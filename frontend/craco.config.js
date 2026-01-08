const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

/** @type {import('webpack').Configuration} */
module.exports = {
    plugins: [
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    // Webpack 설정의 resolve 플러그인 리스트에 TsconfigPathsPlugin을 직접 추가
                    webpackConfig.resolve.plugins.push(
                        new TsconfigPathsPlugin({})
                    );
                    return webpackConfig;
                },
            },
        },
    ],
};
