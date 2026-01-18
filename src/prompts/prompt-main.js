import chalk from "chalk";

const mainPrompt =[
    {
        name: "select",
        description: chalk.yellow("Choose a tool (1 - QRCODE ou 2- PASSWORD)"),
        pattern: /^[1-2]+$/,
        message: chalk.red("Choose only between 1 and 2."),
        required: true,
    },
];

export default mainPrompt;