require('dotenv').config()

module.exports = {
    PORT: process.env.PORT,
    CLIENT_BASEURL: process.env.CLIENT_BASEURL,
    JWT_TOKEN: process.env.JWT_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
}
