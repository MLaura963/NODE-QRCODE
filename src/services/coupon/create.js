// src/services/coupon/create.js
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import promptSync from "prompt-sync";
import chalk from "chalk";
import { randomBytes } from "crypto";

const prompt = promptSync({ sigint: true });

function makeCode(prefix = "", length = 8) {
  const hex = randomBytes(Math.ceil(length / 2)).toString("hex").toUpperCase();
  const code = hex.slice(0, length);
  return prefix ? `${prefix}-${code}` : code;
}

export default async function createCoupons() {
  try {
    console.log(chalk.green.bold("\n=== Gerador de Cupons (QR no Terminal) ===\n"));

    const baseUrl = prompt("Base URL (ex: https://meusite.com/cupom): ");
    if (!baseUrl) {
      console.log(chalk.red("Base URL é obrigatória. Saindo."));
      return;
    }

    const qtdStr = prompt("Quantidade de cupons a gerar (ex: 5): ");
    const count = Math.max(1, parseInt(qtdStr || "1"));

    const prefix = prompt("Prefixo opcional (ex: PROMO) [Enter para pular]: ");
    const lengthStr = prompt("Tamanho do código (ex: 8): ");
    const length = Math.max(4, parseInt(lengthStr || "8"));

    const outDir = path.resolve(process.cwd(), "output", "cupons");
    fs.mkdirSync(outDir, { recursive: true });

    const csvPath = path.join(outDir, "coupons.csv");

    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, "code,full_url\n", { encoding: "utf8" });
    }

    console.log(chalk.blue(`\nGerando ${count} cupons...\n`));

    const generatedCoupons = [];

    for (let i = 0; i < count; i++) {
      const code = makeCode(prefix, length);
      const fullUrl = baseUrl.endsWith("/")
        ? `${baseUrl}${code}`
        : `${baseUrl}/${code}`;

      // Salva no Excel/CSV
      fs.appendFileSync(csvPath, `${code},${fullUrl}\n`, { encoding: "utf8" });

      generatedCoupons.push({ code, url: fullUrl });

      console.log(chalk.yellow(`\n📌 CUPOM ${i + 1}/${count}: ${code}`));

      // Gera QR Code direto no terminal (ASCII)
      const qrAscii = await QRCode.toString(fullUrl, { type: "terminal" });
      console.log(qrAscii);
    }

    console.log(chalk.green.bold("\n=== CUpons GERADOS ===\n"));

    generatedCoupons.forEach((c, index) => {
      console.log(
        `${index + 1}. ${chalk.cyan(c.code)} → ${chalk.gray(c.url)}`
      );
    });

    console.log(
      chalk.green.bold(
        `\nArquivo salvo em: ${csvPath}\n`
      )
    );
  } catch (err) {
    console.error(chalk.red("Erro ao gerar cupons:"), err);
  }
}
