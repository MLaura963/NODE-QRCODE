import chalk from "chalk";


const promptQRCODE = [
    {
        name: "link",
        description: chalk.yellow("Enter the link to generate the QR code."),
    },
    {
        name: "type",
        description: chalk.yellow("Choose the type of QR code (1- NORMAL (2 - TERMINAL"),
        pattern: /^[1-2]+$/,
        message: chalk.red.italic("Choose only between 1 and 2."),
        required: true,
    },

];

export default promptQRCODE;

