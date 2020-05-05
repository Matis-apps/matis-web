module.exports = {
  devServer: {
    proxy: {
      '^/deezer': {
        target: 'https://api.deezer.com/',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/deezer' : '/'
        },
      },
    }
  }
}
