/* eslint-disable global-require, func-names, no-undefined, no-console */

(function () {
    var langAmerican = require('./../src/lang/en-us'),
        langEuropean = require('./../src/lang/en-gb'),
        american = require('./../src/index')({
            system: langAmerican,
            formal: true
        }),
        european = require('./../src/index')({
            system: langEuropean,
            format: true
        });

    describe('number-name', function () {
        describe('upon converting numbers', function () {
            it('should be able to convert numbers', function () {
                console.log(american(123123123));
                console.log(european(123123123));
            });
        });
    });
})();
