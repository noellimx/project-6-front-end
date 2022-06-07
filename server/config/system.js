const ENVIRONMENT = process.env.NODE_ENV || "development";

const DB_PASSWORD_HASH = "very-insecure-password-hash";
console.log(`ENVIRONMENT is ${ENVIRONMENT}`);

export default { ENVIRONMENT, DB_PASSWORD_HASH };
