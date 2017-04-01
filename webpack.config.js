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
            filename: 'number-name.js'
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
        }
    },
    {
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'bin'),
            filename: 'number-name.min.js'
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
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ]
    }
];
