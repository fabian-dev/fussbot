function encode(privateKey) {
    console.log(Buffer.from(privateKey).toString('base64'));
}

encode("<private key with begin and end line and \n");
