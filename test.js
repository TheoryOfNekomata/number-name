(function () {
    var Jasmine = require('jasmine'),
        SpecReporter = require('jasmine-spec-reporter'),
        noop = function() {},
        jrunner = new Jasmine();

    jrunner.configureDefaultReporter({ print: noop });
    jasmine.getEnv().addReporter(new SpecReporter({prefixes: {
        success: 'OK  ',
        failure: 'ERR ',
        pending: '... '
    }}));
    jrunner.loadConfigFile();
    jrunner.execute();
})();
