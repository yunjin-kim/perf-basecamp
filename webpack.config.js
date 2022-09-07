const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: '[name].[contenthash].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
          tsconfigRaw: require('./tsconfig.json')
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|gif|webp|webm|eot|mp4)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new CompressionPlugin(),
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin()
  ],
  optimization: {}
};
