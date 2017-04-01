/**
 * Script description.
 * @author TheoryOfNekomata
 * @date 2017-04-01
 */

var path = require('path'),
    webpack = require('webpack');

module.exports = [
    {
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'bin'),
            filename: 'number-name.js',
            library: 'NumberName',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        resolve: {
            modules: ['node_modules'],
            extensions: ['.js', '.json']
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.json$/,
                    loaders: ['json-loader']
                }
            ]
        }
    },
    {
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'bin'),
            filename: 'number-name.min.js',
            library: 'NumberName',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        resolve: {
            modules: ['node_modules'],
            extensions: ['.js', '.json']
        },
        module: {
            rules: [
                {
                    test: /\.json$/,
                    loaders: ['json-loader']
                }
            ]
        },
        devtool: 'source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ]
    }
];
