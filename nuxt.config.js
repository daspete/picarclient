import 'dotenv/config'

export default {
    modules: [
        '@nuxtjs/apollo'
    ],

    buildModules: ['@nuxtjs/tailwindcss'],

    apollo: {
        clientConfigs: {
            default: {
                httpEndpoint: process.env.API_URL
            }
        }
    },

    tailwindcss: {
        jit: true,
    }
}