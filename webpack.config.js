var webpack = require('webpack');

module.exports = {
    entry: "./client/main.js",
    output: {
        path: __dirname + "/public/javascript/",
        publicPath: "javascript/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: "uglify!babel-loader"
            },
            {
                test: /\.min\.css/,
                loader: "style-loader!css-loader"
            }
        ]
    }
};