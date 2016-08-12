module.exports = {
  context: __dirname,
  entry: './app.jsx',

  output: {
    filename: 'bundle.js',
    path: __dirname
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}
