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
        url: '/api/movie/*',
        auth: true,
        creditCheck: false,
        rateLimit: {
            windowMs: 15 * 60 * 1000,
            max: 5
        },
        proxy: {
            target: "http://movie:8081",
            changeOrigin: true,
            pathRewrite: {
                [`^/api/movie`]: '/',
            },
        }
    }
]

exports.ROUTES = ROUTES;