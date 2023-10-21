// note: can't use ES Modules import syntax inside webpack5 config
// node module to generate absolute path
const path = require("path");

// this plugins comes out of box with webpack5
const TerserPlugin = require("terser-webpack-plugin");

// this needs to be installed
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    // publicPath tells webpack which specific output url to use to load the file
    // note: webpack 5 sets its value to 'auto' by default, sets the path to display the file.
    // Version 4 or less is set to ''. Must need to specify the Out Dir to set the relative path to the file.
    publicPath: "dist/",
    // note: useful when serving file from cdn
    // publicPath: "http://some-cdn.com",
  },
  mode: "none",

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
        test: /\.txt/,
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

          // "style-loader", "css-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },

      {
        test: /\.scss$/,
        // note: Webpack processes loaders from Right to Left '<--', so the orders matter
        use: [
          // "style-loader", "css-loader", "sass-loader"],
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
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
    ],
  },
  // note: plugin is a js library that adds functionality to the webpack itself
  // plugin can also modify how the bundles themselves are created eg. code splitting
  // There will always be new features (not supported out-of-the-box) that needs to be enable
  // by installing related plugins to support those features here.
  plugins: [
    // creating instance of TerserPlugin for bundle minification to reduce bundle size
    new TerserPlugin(),

    // NOTE: css will be dynamically added into single js bundle file during run time by javascript
    // Not a great solution for production. Our js bundle will be very large. Large file will need more time to load.
    // The best solution is to extract all our css code into separate file which will be generated
    // along same time with JS bundle. This way we have two bundles instead of one.
    new MiniCssExtractPlugin({
      // assigning file name
      // note: need to modify the rules in css & scss loaders in order to use plugin
      filename: "styles.css",
    }),
  ],
};
