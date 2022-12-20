const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
     // arquivo root
    entry: './src/app.ts',
    //saída do arquivo gerado
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module:{
        rules:[
            {
                //irá verificar todos os arquivos com a extensão .ts
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve:{
        extensions: ['.ts', '.js']
    },
    plugins:[
        new CleanPlugin.CleanWebpackPlugin()
    ]
}