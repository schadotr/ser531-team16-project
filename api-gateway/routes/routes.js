const ROUTES = [
    {
        url: '/api/user/*',
        auth: false,
        creditCheck: false,
        rateLimit: {
            windowMs: 15 * 60 * 1000,
            max: 5
        },
        proxy: {
            target: "http://user:8080",
            changeOrigin: true,
            pathRewrite: {
                [`^/api/user`]: '',
            },
        }
    },
    {
        url: '/api/service-2',
        auth: false,
        creditCheck: false,
        rateLimit: {
            windowMs: 15 * 60 * 1000,
            max: 5
        },
        proxy: {
            target: "http://localhost:8081",
            changeOrigin: true,
            pathRewrite: {
                [`^/api`]: '/',
            },
        }
    }
]

exports.ROUTES = ROUTES;