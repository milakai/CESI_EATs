module.exports = {
    // Autres configurations...
  
    configureWebpack: {
      resolve: {
        fallback: {
          assert: require.resolve('assert/'),
          stream: require.resolve('stream-browserify'),
          http: require.resolve('stream-http'),
          zlib: require.resolve('browserify-zlib'),
          querystring: require.resolve('querystring-es3'),
          path: require.resolve('path-browserify'),
          crypto: require.resolve('crypto-browserify'),
          fs: false,
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "util": require.resolve("util/")
        },
      },
    },
  };
