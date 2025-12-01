const JSDOMEnvironment = require('jest-environment-jsdom').default;
const { VirtualConsole } = require('jsdom');

class CustomJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
        // Create a virtual console that suppresses all output
        const virtualConsole = new VirtualConsole();

        // Override sendToConsole to prevent any output
        virtualConsole.sendTo = function () { };

        // Suppress all event types
        virtualConsole.on('error', () => { });
        virtualConsole.on('warn', () => { });
        virtualConsole.on('info', () => { });
        virtualConsole.on('log', () => { });
        virtualConsole.on('dir', () => { });
        virtualConsole.on('dirxml', () => { });
        virtualConsole.on('table', () => { });
        virtualConsole.on('trace', () => { });
        virtualConsole.on('group', () => { });
        virtualConsole.on('groupCollapsed', () => { });
        virtualConsole.on('groupEnd', () => { });
        virtualConsole.on('time', () => { });
        virtualConsole.on('timeLog', () => { });
        virtualConsole.on('timeEnd', () => { });
        virtualConsole.on('assert', () => { });

        // Inject the virtual console into the config
        const customConfig = {
            ...config,
            projectConfig: {
                ...config.projectConfig,
                testEnvironmentOptions: {
                    ...config.projectConfig.testEnvironmentOptions,
                    virtualConsole,
                },
            },
        };

        super(customConfig, context);
    }
}

module.exports = CustomJSDOMEnvironment;
