(function () {
    var Jasmine = require('jasmine'),
        SpecReporter = require('jasmine-spec-reporter'),
        noop = function() {},
        jrunner = new Jasmine(),
        process = require('process'),
        commander = require('commander'),
        packageJson = require('./package.json'),
        specReporterOptions = {
            prefixes: {
                success: 'OK  ',
                failure: 'ERR ',
                pending: '... '
            }
        };

    jrunner.configureDefaultReporter({ print: noop });

    commander
        .version(packageJson.version)
        .option('-c, --no-color')
        .parse(process.argv);

    specReporterOptions.colors = commander.color;

    jasmine.getEnv().addReporter(new SpecReporter(specReporterOptions));
    jrunner.loadConfigFile();
    jrunner.execute();
})();
