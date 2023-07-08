import path from 'path';
import { fileURLToPath } from 'url';

import ForkTsCheckerWebpackPlugin  from 'fork-ts-checker-webpack-plugin';
import  TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default  {
    entry: './src/main.ts',
    experiments: {
        outputModule: true,
      },
    output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'main.js',
       libraryTarget: "module",
    },
    devtool: 'source-map',
    mode: 'production',
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json'}),] 
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
