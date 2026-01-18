import prompt from "prompt";
import promptQRCODE from "../../prompts/prompt-qrcode.js";
import handle from "./handle.js";

async function createQRCODE(){
    prompt.get(promptQRCODE, handle);

    prompt.start();
}

export default createQRCODE;