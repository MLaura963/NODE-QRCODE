import chalk from "chalk";

const mainPrompt =[
    {
        name: "select",
        description: chalk.yellow("Choose a tool (1 - QRCODE / (2- PASSWORD / (3- COUPON )"),
        pattern: /^[1-3]+$/,
        message: chalk.red("Choose only between 1, 2 or 3."),
        required: true,
    },
];

export default mainPrompt;