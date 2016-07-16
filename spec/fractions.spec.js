/* eslint-disable global-require, func-names, no-undefined, no-console */

(function () {
    var american = require('./../src/lang/en-us'),
        NumberName = require('./../src/index'),
        tab = require('tab'),
        us = new NumberName({ system: american }); // default fractionType should be 'digits'

    describe('number-name', function () {
        var conversions = [];

        function expectValue(value, expected) {
            var actual = us(value);

            conversions.push({
                value: value,
                expected: expected,
                actual: actual
            });
            expect(actual).toBe(expected);
        }

        function printAllConversions() {
            tab.emitTable({
                'columns': [
                    {
                        label: 'value',
                        align: 'right',
                        width: 16
                    },
                    {
                        label: 'expected',
                        align: 'left',
                        width: 64
                    },
                    {
                        label: 'actual',
                        align: 'left',
                        width: 64
                    }
                ],
                'rows': conversions.map((conversion) => [conversion.value, conversion.expected, conversion.actual])
            });
        }

        afterAll(function () {
            printAllConversions();
            console.log();
        });

        describe('upon converting fractions', function () {            
            it('should be able to convert x, where 0 < x < 1', function () {
                var conversions = {
                    'zero point zero zero five': '0.005',
                    'zero point one two three': '0.123',
                    'zero point six': '.6',
                    'zero point zero zero three one two five': '.003125'
                };

                Object.keys(conversions).forEach((word) => {
                    expectValue(conversions[word], `${word}`);
                });
            });

            it('should be able to convert x, where 1 < x < 10', function () {
                var conversions = {
                    'one point zero zero five': '1.005',
                    'three point one two three': '3.123',
                    'seven point six three': '7.63',
                    'nine point zero zero three one two five': '9.003125'
                };

                Object.keys(conversions).forEach((word) => {
                    expectValue(conversions[word], `${word}`);
                });
            });

            it('should be able to convert x, where 10 < 100', function () {
                var conversions = {
                    'ten point zero zero five': '10.005',
                    'thirteen point one two three': '13.123',
                    'seventy point six three': '70.63',
                    'ninety nine point zero zero three one two five': '99.003125'
                };

                Object.keys(conversions).forEach((word) => {
                    expectValue(conversions[word], `${word}`);
                });
            });

            it('should be able to convert different representation of numbers', function () {
                var conversions = {
                    'twelve point three four five six': '12.3456e+0',
                    'one point three one two three': '1312.3e-3',
                    'zero point zero zero zero zero zero zero zero six': 6.0e-8
                };

                Object.keys(conversions).forEach((word) => {
                    expectValue(conversions[word], `${word}`);
                });
            });
        });
    });
})();
