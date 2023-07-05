const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: './src/quill-toolbar-item.ts',
    output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'main.js',
       libraryTarget: "umd",
    },
    devtool: 'source-map',
    mode: 'production',
    resolve: {
        extensions: ['.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts?/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread
    ],
    watch: true,
};
