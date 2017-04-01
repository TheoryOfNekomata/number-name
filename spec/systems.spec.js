/* eslint-disable global-require, func-names, no-undefined, no-console */

(function () {
    var tab = require('tab'),
        NumberName = require('./../src/index'),
        us = new NumberName({ system: 'american' }),
        usInf = new NumberName({ system: 'american', variant: 'informal' }),
        uk = new NumberName({ system: 'british' }),
        eu = new NumberName({ system: 'european' });

    describe('number-name', function () {
        var conversions = [];

        function localizeValue(value, numberName) {
            var baseDecimalPoint = '.',
                baseDigitGroupingSymbol = ',';

            value = '' + value;

            return value
                .split(baseDecimalPoint)
                .map(function (digits) {
                    return digits.replace(baseDigitGroupingSymbol, numberName.getDigitGroupingSymbol());
                })
                .join(numberName.getDecimalPointSymbol());
        }

        function expectValue(value, expected) {
            var usValue = us.toName(localizeValue(value, us)),
                usInfValue = usInf.toName(localizeValue(value, usInf)),
                ukValue = uk.toName(localizeValue(value, uk)),
                euValue = eu.toName(localizeValue(value, eu)),

                actual = {
                    value: value,
                    american: usValue,
                    americanInf: usInfValue,
                    british: ukValue,
                    european: euValue
                };

            conversions.push(actual);

            expect(actual.american).toBe(expected.american);
            expect(actual.americanInf).toBe(expected.americanInf);
            expect(actual.british).toBe(expected.british);
            expect(actual.european).toBe(expected.european);
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
                        label: 'American/Modern Br. (formal)',
                        align: 'left',
                        width: 32
                    },
                    {
                        label: 'American/Modern Br. (informal)',
                        align: 'left',
                        width: 32
                    },
                    {
                        label: 'Traditional British',
                        align: 'left',
                        width: 32
                    },
                    {
                        label: 'European',
                        align: 'left',
                        width: 32
                    }
                ],
                'rows': conversions.map(function (conversion) {
                    return [
                        conversion.value,
                        conversion.american,
                        conversion.americanInf,
                        conversion.british,
                        conversion.european
                    ];
                })
            });
        }

        afterAll(function () {
            console.log('      actual values:');
            console.log();
            printAllConversions();
            console.log();
        });

        describe('upon converting numbers', function () {
            it('should be able to differentiate zeroes', function () {
                expectValue(0, {
                    american: 'zero',
                    americanInf: 'zero',
                    british: 'naught',
                    european: 'zero'
                });
            });

            describe('in employing long count', function () {
                it('should be able to convert small numbers', function () {
                    [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ].forEach(function (conversion, value) {
                        expectValue(value + 1, {
                            american: conversion,
                            americanInf: conversion,
                            british: conversion,
                            european: conversion
                        });
                    });

                    [ 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen' ].forEach(function (conversion, unit) {
                        expectValue(10 + unit, {
                            american: conversion,
                            americanInf: conversion,
                            british: conversion,
                            european: conversion
                        });
                    });

                    [ 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety' ].forEach(function (conversion, factor) {
                        expectValue(10 * (factor + 2), {
                            american: conversion,
                            americanInf: conversion,
                            british: conversion,
                            european: conversion
                        });
                    });

                    [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ].forEach(function (word, unit) {
                        var conversion = word + ' hundred';
                        expectValue((unit + 1) * 100, {
                            american: conversion,
                            americanInf: conversion,
                            british: conversion,
                            european: conversion
                        });
                    });

                    // TODO consider 1000 => US ("ten hundred")
                    [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ].forEach(function (word, unit) {
                        var conversion = word + ' thousand';
                        expectValue((unit + 1) * 1000, {
                            american: conversion,
                            americanInf: conversion,
                            british: conversion,
                            european: conversion
                        });
                    });
                });

                it('should be able to convert large numbers', function () {
                    expectValue('1.0e+6', {
                        american: 'one million',
                        americanInf: 'one million',
                        british: 'one million',
                        european: 'one million'
                    });

                    expectValue('1.0e+7', {
                        american: 'ten million',
                        americanInf: 'ten million',
                        british: 'ten million',
                        european: 'ten million'
                    });

                    expectValue('1.0e+8', {
                        american: 'one hundred million',
                        americanInf: 'one hundred million',
                        british: 'one hundred million',
                        european: 'one hundred million'
                    });

                    expectValue('1.0e+9', {
                        american: 'one billion',
                        americanInf: 'one billion',
                        british: 'one thousand million',
                        european: 'one milliard'
                    });

                    expectValue('1.0e+39', {
                        american: 'one duodecillion',
                        americanInf: 'one dodecillion',
                        british: 'one thousand sextillion',
                        european: 'one sextilliard'
                    });

                    expectValue('1.0e+303', {
                        american: 'one centillion',
                        americanInf: 'one centillion',
                        british: 'one thousand quinquagintillion',
                        european: 'one quinquagintilliard'
                    });

                    expectValue('1.0e+600', {
                        american: 'one cennovemnonagintillion',
                        americanInf: 'one cennovemnonagintillion',
                        british: 'one centillion',
                        european: 'one centillion'
                    });

                    expectValue('1.0e+603', {
                        american: 'one duocentillion',
                        americanInf: 'one ducentillion',
                        british: 'one thousand centillion',
                        european: 'one centilliard'
                    });
                });
            });
        });
    });
})();
