import chalk from "chalk";
import promptSync from "prompt-sync";
import QRCode from "qrcode";
import handle from "./handle.js";

const prompt = promptSync({ sigint: true });

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

    console.log(chalk.blue(`\nGerando ${count} cupons...\n`));

    const result = await handle(baseUrl, prefix, length, count);

    // Exibir QR Codes no terminal
    for (let i = 0; i < result.coupons.length; i++) {
      const { code, url } = result.coupons[i];

      console.log(chalk.yellow(`\n📌 CUPOM ${i + 1}/${count}: ${code}`));

      const qrAscii = await QRCode.toString(url, { type: "terminal" });
      console.log(qrAscii);
    }

    console.log(chalk.green.bold("\n=== CUPONS GERADOS ===\n"));

    result.coupons.forEach((c, index) => {
      console.log(
        `${index + 1}. ${chalk.cyan(c.code)} → ${chalk.gray(c.url)}`
      );
    });

    console.log(
      chalk.green.bold(
        `\nArquivo salvo em: ${result.csvPath}\n`
      )
    );
  } catch (err) {
    console.error(chalk.red("Erro ao gerar cupons:"), err);
  }
}
