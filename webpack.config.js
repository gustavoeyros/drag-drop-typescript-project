const path = require('path')

module.exports = {
    mode: 'development',
     // arquivo root
    entry: './src/app.ts',
    //saída do arquivo gerado
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist'
    },
    devtool: 'inline-source-map',
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
    devServer:{
        static:{
            directory: path.join(__dirname, '/')
        }
    }
}