// note: can't use ES Modules import syntax inside webpack5 config
// node module to generate absolute path
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",

    // NOTE: Use 'html-webpack-plugin' to link MD5 Hash file to scripts tags in index.html
    // This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles.
    // This is especially useful for webpack bundles that include a hash in the filename
    // which changes every compilation.

    // note: to remove previous build files dir or move to another dir before generating new bundles
    // output.clean option does not clean the output directory when running webpack-dev-server with writeToDisk: true.
    // clean: true,

    path: path.resolve(__dirname, "./dist"),
    // publicPath tells webpack which specific output url to use to load the file
    // note: webpack 5 sets its value to 'auto' by default, sets the path to display the file.
    // Version 4 or less is set to ''. Must need to specify the Out Dir to set the relative path to the file.
    publicPath: "",
    // note: useful when serving file from cdn
    // publicPath: "http://some-cdn.com",
  },

  // note: Usually Production Build require different build than Development Builds.
  // In production, we want our build as fast as possible and our bundle should be as small as possible.
  // In development, we often want to see additional information inside our javascript code. eg. source file
  // mode: "none" - Opts out of any default optimization options

  // note: 'production' mode enables long list of different plugins including TerserPlugin
  // Sets process.env.NODE_ENV variable to production
  // mode: "production",

  // note: on 'production' mode, the error is displayed from the bundle file if error exists
  // note: on 'development' mode, the error is displayed more clearly from the js source map file if error exists
  mode: "development",

  // note: Development build needs to have different configuration to have a faster build
  // to see our changes instantly without re-building with 'webpack-dev-server' during development
  // note: webpack-dev-server supports Hot Module Replacement feature out of the box
  devServer: {
    // four options out of many provided by webpack-dev-server
    port: 9000,
    // what to server on above port
    static: {
      directory: path.resolve(__dirname, "./dist"),
    },
    devMiddleware: {
      // define file that will be use as index
      index: "index.html",
      // note: by default, webpack dev server generates files in memory & doesn't save them to dist
      // webpack dev server will explicitly write generated files to the 'dist' directory & accessible if needed
      writeToDisk: true,
    },
  },

  // note: 'module' property contain 'rules' which is a rule for every file type / extension
  // webpack will throw error if no rules found when importing modules
  module: {
    // note: 'test' property identifies which file or files should be transformed.
    // 'use' property indicates which Loader should be used to do the transforming.
    rules: [
      {
        // regex to match png/jpg files
        test: /\.(jpg)$/,

        // note: Using one of four types of Asset Modules to import files

        // 1. asset/resource
        // This will create a new file in output dir.
        // Cons: Browser have to make api request for each generate files.

        // type: "asset/resource",
        // use: ["file-loader"], - old way

        // 2. asset/inline
        // note: This does not generate a new file in  output dir like with above.
        // The generated base 64 file will be included in the js bundle.
        // Great of small files, however, large files will make the size of js bundle lot bigger
        // however, the cost is efficient when bundling small files since not making multiple browser requests.

        // type: "asset/inline",

        // 3. asset - general asset type
        // note: Webpack automatically chooses between exporting emitting a separate file
        // as in asset/resource depending on a file size or a data URI as in asset/inline.
        // If the file size is less than 8KB (default 8kb can be customized), the file is generated as asset/inline,
        // If more than 8KB, the file is generated as resource asset.
        // Previously achievable by using url-loader with asset size limit.

        type: "asset",
        // changing default 8kb
        parser: {
          // this prop decides to use inline asset or resource asset
          // less than 3kb will be treated as inline asset
          dataUrlCondition: {
            maxSize: 3 * 1024, // 3KB
          },
        },
      },
      {
        // 4. asset/source - converts source code/text into strings to inject in js bundle
        test: /\.txt$/,
        type: "asset/source",
      },

      // note: Loaders allow to import all Kinds of files that can’t be import with Asset Modules.
      // eg. css, sass, less, xml etc
      // note: Loaders needs to be Install explicitly
      {
        test: /\.css$/,
        use: [
          // note: using one or more loaders to transform the file
          // 'style-loader' injects css into the page using style text with js into js bundle,
          // 'css-loader' reads the file content & returns it

          "style-loader",
          "css-loader",
        ],
      },

      {
        test: /\.scss$/,
        // note: Webpack processes loaders from Right to Left '<--', so the orders matter
        use: ["style-loader", "css-loader", "sass-loader"],
      },

      {
        // note: webpack will use 'babel-loader' when importing js files & converts modern js code into es5
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          // need to specify extra options
          options: {
            // need special babel preset which compiles es6,7,8,9... etc to es5
            // In other words, babel env presets supports latest js es code
            presets: ["@babel/env"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },

      {
        // handler bars template
        test: /\.hbs$/,
        use: ["handlebars-loader"],
      },
    ],
  },
  // note: plugin is a js library that adds functionality to the webpack itself
  // plugin can also modify how the bundles themselves are created eg. code splitting
  // There will always be new features (not supported out-of-the-box) that needs to be enable
  // by installing related plugins to support those features here.
  plugins: [
    // note: webpack plugin to remove/clean build folders eg. to remove previous build files as a whole
    // This will ensure that it has clean folder before creating a new dist dir on every time
    // new CleanWebpackPlugin(),
    // NOTE: This plugin won't work with webpack 5

    // NOTE: Use 'html-webpack-plugin' to link MD5 Hash file to scripts tags in index.html
    // This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles.
    // This is especially useful for webpack bundles that include a hash in the filename
    // which changes every compilation.
    new HtmlWebpackPlugin({
      // customizing auto generated index.html contents
      title: "Webpack 5",
      // meta: {
      //   description: "Learn Webpack5 now!",
      // },

      // rendering Handlebars template instead of the default webpack generated  html template
      // note: added rules above on how to handle it
      template: "src/index.hbs",
      description: "Learn Webpack5 right now!",
    }),
  ],
};
