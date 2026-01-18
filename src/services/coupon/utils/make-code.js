import { randomBytes } from "crypto";

async function makeCode(prefix = "", length = 8) {
  const hex = randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .toUpperCase();

  const code = hex.slice(0, length);

  return prefix ? `${prefix}-${code}` : code;
}

export default makeCode;
