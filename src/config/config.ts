

export default () => ({
    database: {
        MONGODB_URI: process.env.MONGODB_URI
    },
    jwt: {
        SECRET: process.env.JWT_SECRET
    },
    googleOauthConfig: {
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
        googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL
    },
    chapa:{
        secretKey: process.env.CHAPA_SECRET_KEY,
        publicKey: process.env.CHAPA_PUBLIC_KEY,
        encryptionKey: process.env.CHAPA_ENCRYPTION_KEY
    },
    frontendUrl: process.env.FRONTEND_URL
})