async function permittedCharacters(){
let permitted = []
 if(process.env.UPPERCASE_LETTERS === "true"){
        permitted.push(..."ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    };

    if(process.env.LOWER_LETTERS === "true"){
        permitted.push(..."abcdefghijklmnopqrstuvwxyz")
    };

    if(process.env.NUMBERS === "true"){
        permitted.push(..."1234567890")
    };

    if(process.env.SPECIAL_CHARACTERS === "true"){
        permitted.push(..."!@#$%¨&*()-=+_.")
    }; 

    return permitted;
}

export default permittedCharacters;