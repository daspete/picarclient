export default {
    modules: [
        '@nuxtjs/apollo'
    ],

    apollo: {
        clientConfigs: {
            default: {
                httpEndpoint: 'http://192.168.0.66:3000/graphql'
            }
        }
    }
}