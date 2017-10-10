const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'app'),
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [{
      test: /.js$/,
      include: [
        path.resolve(__dirname)
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  resolve: {
    extensions: ['.json', '.js']
  }
}