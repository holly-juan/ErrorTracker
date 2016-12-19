var webpack = require('webpack');
var path = require('path');
var packageJson = require("./package.json");

module.exports = {
    entry: {
        'index': [ './index.js' ]
    },
    output: {
        path: path.join( __dirname, '/' ),
        filename: "[name].min.js",
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEBUG__: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            test: /(\.jsx|\.js)$/
            ,compress: {
                warnings: false
            }
            ,minimize: true
            ,sourceMap: false
        })
    ]
};