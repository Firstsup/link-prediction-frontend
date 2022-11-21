const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#0aa679', '@border-radius-base':'15px' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};