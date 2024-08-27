const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,

  // Output directory
  outputDir: "dist",

  // Alias for @ symbol
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@views": path.resolve(__dirname, "src/views"),
        "@components": path.resolve(__dirname, "src/components"),
      },
    },
  },

  // Dev server settings
  devServer: {
    proxy: {
      "/api": {
        target: "https://www.onebitmyanmar.site/api",
        changeOrigin: true, // Change the origin to match the backend
        pathRewrite: { "^/api": "" }, // Remove the '/api' prefix
      },
    },
  },

  // Lint on save
  lintOnSave: true,

  // Disable production source map
  productionSourceMap: false,
});
