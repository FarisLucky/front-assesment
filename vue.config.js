const { defineConfig } = require('@vue/cli-service')
const NODE_ENV = 'production'
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: NODE_ENV === 'production' ? '/simpeg-front-babel/dist/' : '/'
})
