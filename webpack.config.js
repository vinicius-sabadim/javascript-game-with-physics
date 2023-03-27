const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/js/main.js',
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: "development",
  devtool: 'inline-source-map',
};