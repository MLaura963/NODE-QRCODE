import fs from "fs";
import path from "path";
import makeCode from "./utils/make-code.js";
import ensureOutputDir from "./utils/ensure-output-dir.js";

async function handle(baseUrl, prefix, length, count) {
  const outDir = await ensureOutputDir();
  const csvPath = path.join(outDir, "coupons.csv");

  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, "code,full_url\n", { encoding: "utf8" });
  }

  const generatedCoupons = [];

  for (let i = 0; i < count; i++) {
    const code = await makeCode(prefix, length);

    const fullUrl = baseUrl.endsWith("/")
      ? `${baseUrl}${code}`
      : `${baseUrl}/${code}`;

    fs.appendFileSync(csvPath, `${code},${fullUrl}\n`, { encoding: "utf8" });

    generatedCoupons.push({ code, url: fullUrl });
  }

  return {
    coupons: generatedCoupons,
    csvPath
  };
}

export default handle;
