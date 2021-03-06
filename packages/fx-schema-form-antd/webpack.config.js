const path = require('path');
const webpack = require('webpack');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = process.env.NODE_ENV || "dev";

const __DEV__ = env.toUpperCase() == "DEV" || env.toUpperCase() == "DEVELOPMENT";
const __TEST__ = env.toUpperCase() == "UAT";
const __PROD__ = env.toUpperCase() == "production";
const __STAG__ = env.toUpperCase() == "STG";

module.exports = {
    entry: {
        index: ['./src/index.tsx'],
        demo: ['./src/demo/index.tsx']
    },
    devServer: {
        historyApiFallback: true,
        hot: false,
        inline: true,
        // contentBase: './out',
        port: 8081,
        host: "127.0.0.1",
        stats: { colors: true },
        proxy: {
            '/weixin': {
                target: 'https://qyapi.weixin.qq.com/',
                pathRewrite: { '^/weixin': '/cgi-bin/media/get' },
                changeOrigin: true
            }
        }
    },

    output: {
        path: path.resolve('./out'),
        filename: '[name].[chunkhash:8].js',
        publicPath: __TEST__ ? './' : '/',
        libraryTarget: "umd",
        library: "fx-schema-form-antd"
    },
    devtool: !(__PROD__ || __STAG__) ? "cheap-module-eval-source-map" : "cheap-module-source-map",
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.ts(x?)$/,
            loader: 'tslint-loader',
            exclude: /node_modules/,
        }, {
            test: require.resolve("react-addons-perf"),
            loader: "expose-loader?Perf"
        }, {
            test: /module\.styl/,
            loader: 'style-loader!css-loader?modules!stylus-loader',
        }, {
            test: /module\.css/,
            loader: 'style-loader!css-loader?modules',
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract("css-loader!less-loader?sourceMap")
        }, {
            test: /\.css/,
            exclude: /module\.css/,
            loader: 'style-loader!css-loader?modules',
        }, {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            loader: 'babel-loader!awesome-typescript-loader',
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }, {
            test: /\.json/,
            loader: 'json-loader',
        }, {
            test: /\.(jpg|png)/,
            loader: 'file-loader',
        }, {
            test: /\.svg$/,
            loader: 'file-loader',
        }, {
            test: /icons\/.*\.svg$/,
            loader: 'raw-loader!svgo-loader?{"plugins":[{"removeStyleElement":true}]}',
        }, {
            test: /\.md/,
            loader: 'raw-loader',
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: './build/fonts/[name].[hash:7].[ext]'
            }
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                "NODE_ENV": JSON.stringify(env),
                "__DEV__": __DEV__,
                "__TEST__": __TEST__,
                "__PROD__": __PROD__,
                "__STAG__": __STAG__
            },
        }),
        !(__PROD__ || __STAG__) ? new HtmlWebpackPlugin({
            // favicon: 'static/favicon.png',
            template: 'test.html',
        }) : new CleanWebpackPlugin(
            ['out/**',],
            {
                root: __dirname,
                verbose: true,
                dry: false
            }
        ),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                svgo: {
                    plugins: [
                        { removeStyleElement: true },
                    ],
                },
            }
        }),
        new ExtractTextPlugin("styles/[name].[contenthash:6].css")
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    externals: !(__PROD__ || __STAG__) ? {} : {
        "react": true,
        "recompose": true
    }
}