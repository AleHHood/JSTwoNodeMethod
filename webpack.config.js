const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const isDev = process.env.NODE_ENV === "development"
console.log("IS DEV:", isDev);
const isProd = !isDev

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "development",
    entry: ['@babel/polyfill','./js/main.js'],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
    devServer: {
        port: 4201
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify:{
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
            {
                from: path.resolve(__dirname, "src/img/favicon/favicon.png"),
                to: path.resolve(__dirname, "dist/img/favicon")
            }
        ]}),
        new MiniCssExtractPlugin({
            filename: '[name].style.css'
        }),
        new ESLintPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: {
                loader: "file-loader",
                options: {
                    outputPath: 'images',
                }
            }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                  isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                  "css-loader",
                  "postcss-loader",
                  "sass-loader",
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
              },
            
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                    presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    }
};
