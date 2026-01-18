import promptSync from "prompt-sync";
import chalk from "chalk";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

const prompt = promptSync({ sigint: true });

function makeCode(prefix = "", length = 8) {
  const hex = randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .toUpperCase();
  const code = hex.slice(0, length);
  return prefix ? `${prefix}-${code}` : code;
}

export default async function createCoupons() {
  try {
    console.log(chalk.green.bold("\n=== Coupon Generator (QR in Terminal) ===\n"));

    const baseUrl = prompt("Base URL (e.g.: https://mysite.com/coupon): ");
    if (!baseUrl) {
      console.log(chalk.red("Base URL is required. Exiting."));
      return;
    }

    const qtdStr = prompt("Number of coupons to generate (e.g.: 5): ");
    const count = Math.max(1, parseInt(qtdStr || "1"));

    const prefix = prompt(
      "Optional prefix (e.g.: PROMO) [Press Enter to skip]: "
    );
    const lengthStr = prompt("Code length (e.g.: 8): ");
    const length = Math.max(4, parseInt(lengthStr || "8"));

    const outDir = path.resolve(process.cwd(), "output", "coupons");
    fs.mkdirSync(outDir, { recursive: true });

    const csvPath = path.join(outDir, "coupons.csv");

    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, "code,full_url\n", { encoding: "utf8" });
    }

    console.log(chalk.blue(`\nGenerating ${count} coupons...\n`));

    const generatedCoupons = [];

    for (let i = 0; i < count; i++) {
      const code = makeCode(prefix, length);
      const fullUrl = baseUrl.endsWith("/")
        ? `${baseUrl}${code}`
        : `${baseUrl}/${code}`;

      // Save to CSV
      fs.appendFileSync(csvPath, `${code},${fullUrl}\n`, {
        encoding: "utf8",
      });

      generatedCoupons.push({ code, url: fullUrl });

      console.log(
        chalk.yellow(`\n📌 COUPON ${i + 1}/${count}: ${code}`)
      );

      // Generate QR Code directly in terminal (ASCII)
      const qrAscii = await QRCode.toString(fullUrl, {
        type: "terminal",
      });
      console.log(qrAscii);
    }

    console.log(chalk.green.bold("\n=== COUPONS GENERATED ===\n"));

    generatedCoupons.forEach((c, index) => {
      console.log(
        `${index + 1}. ${chalk.cyan(c.code)} → ${chalk.gray(c.url)}`
      );
    });

    console.log(
      chalk.green.bold(`\nFile saved at: ${csvPath}\n`)
    );
  } catch (err) {
    console.error(chalk.red("Error generating coupons:"), err);
  }
}
