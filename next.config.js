const path = require('path');

module.exports = {
  webpack(config, { isServer }) {
    // Configure Webpack to handle font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          outputPath: 'static/fonts/',
          publicPath: '/_next/static/fonts/',
          name: '[name].[ext]',
          esModule: false,
        },
      },
    });

    return config;
  },
};
