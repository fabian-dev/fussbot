export function exitIfAnyMissing(envVarNames: string[]) {
    for (let varName of envVarNames) {
        exitIfMissing(varName);
    }
}

export function exitIfMissing(envVarName: string) {
    const value = process.env[envVarName];
    if (!value) {
        console.log(`Error: Specify Environment Variable ${envVarName}`);
        process.exit(1);
    }
}
