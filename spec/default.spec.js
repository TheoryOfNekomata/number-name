/* eslint-disable global-require, func-names, no-undefined, no-console */

(function () {
    var american = require('./../src/lang/en-us'),
        NumberName = require('./../src/index'),
        tab = require('tab'),
        us = new NumberName({ system: american });

    describe('number-name', function () {
        var conversions = [];

        function expectValue(value, expected) {
            var actual = us.toName(value);

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
                'rows': conversions.map(function (conversion) {
                    return [ conversion.value, conversion.expected, conversion.actual ];
                })
            });
        }

        afterAll(function () {
            printAllConversions();
            console.log();
        });

        describe('upon converting numbers', function () {

            it('should be able to convert 0..9', function () {
                [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ].forEach(function (conversion, value) {
                    expectValue(value, conversion);
                });
            });

            it('should be able to convert 10..19', function () {
                [ 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen' ].forEach(function (conversion, unit) {
                    expectValue(10 + unit, conversion);
                });
            });

            it('should be able to convert tens', function () {
                [ 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety' ].forEach(function (conversion, factor) {
                    expectValue(10 * (factor + 2), conversion);
                });
            });

            it('should be able to convert hundreds', function () {
                [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ].forEach(function (word, unit) {
                    expectValue((unit + 1) * 100, word + ' hundred');
                });
            });

            it('should be able to convert thousands', function () {
                // TODO consider 1000 => US ("ten hundred")
                [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ].forEach(function (word, unit) {
                    expectValue((unit + 1) * 1000, word + ' thousand');
                });
            });

            it('should be able to convert medium size numbers', function () {
                [
                    'million',
                    'billion',
                    'trillion',
                    'quadrillion',
                    'quintillion',
                    'sextillion',
                    'septillion',
                    'octillion',
                    'nonillion',
                    'decillion',
                    'undecillion',
                    'duodecillion',
                    'tredecillion',
                    'quattuordecillion',
                    'quindecillion',
                    'sexdecillion',
                    'septendecillion',
                    'octodecillion',
                    'novemdecillion',
                    'vigintillion',
                    'unvigintillion',
                    'duovigintillion',
                    'trevigintillion',
                    'quattuorvigintillion',
                    'quinvigintillion',
                    'sexvigintillion',
                    'septenvigintillion',
                    'octovigintillion',
                    'novemvigintillion'
                ]
                    .forEach(function (word, power) {
                        var value = '1.0e+' + ((power + 2) * 3);

                        expectValue(value, 'one ' + word);
                    });
            });

            it('should be able to convert large size numbers', function () {
                var conversions = {
                    'novemquadragintillion': '1.0e+150',
                    'quinquagintillion': '1.0e+153',
                    'unquinquagintillion': '1.0e+156',
                    'treseptuagintillion': '1.0e+222',
                    'novemnonagintillion': '1.0e+300'
                };

                Object.keys(conversions).forEach(function (word) {
                    expectValue(conversions[ word ], 'one ' + word);
                });
            });

            it('should be able to convert gigantic size numbers', function () {
                [
                    'centillion',
                    'cenuntillion',
                    'cenduotillion',
                    'centretillion',
                    'cenquattuortillion',
                    'cenquintillion',
                    'censextillion',
                    'censeptentillion',
                    'cenoctotillion',
                    'cennovemtillion',
                    'cendecillion',
                    'cenundecillion',
                    'cenduodecillion',
                    'centredecillion',
                    'cenquattuordecillion',
                    'cenquindecillion',
                    'censexdecillion',
                    'censeptendecillion',
                    'cenoctodecillion',
                    'cennovemdecillion'
                ]
                    .forEach(function (word, power) {
                        var value = '1.0e+' + ((power + 101) * 3);

                        expectValue(value, 'one ' + word);
                    });

                [
                    'duocentillion',
                    'trecentillion',
                    'quadringentillion',
                    'quingentillion',
                    'sescentillion',
                    'septingentillion',
                    'octingentillion',
                    'nongentillion'
                ]
                    .forEach(function (word, power) {
                        var value = '1.0e+' + (((power + 2) * 100 + 1) * 3);

                        expectValue(value, 'one ' + word);
                    });
            });

            it('should be able to convert titanic size numbers', function () {
                var conversions = {
                    'milliatillion': '1.0e+3003',
                    'duotriginmilliasescenquattuorseptuagintillion': '1.0e+98025'
                };

                Object.keys(conversions).forEach(function (word) {
                    expectValue(conversions[ word ], 'one ' + word);
                });
            });

            it('should be able to convert astronomic size numbers', function () {
                // var conversions = {
                //     'milliamilliatillion': '1.0e+3000003',
                //     'octingensexquinquaginmilliamilliaseptingensexseptuaginmilliaquingenundecillion': '1.0e+2570329536',
                //     'milliamilliamilliatillion': '1.0e+3000000003',
                //     'trecenunnonaginmilliamilliamilliaquingenunoctoginmilliamilliaduocensexdecmilliacenduononagintillion': '1.0e+1174743648579',
                //     'milliamilliamilliamilliatillion': '1.0e+3000000000003',
                //     'duocenduotriginmilliamilliamilliamilliaduononaginmilliamilliamilliacenseptuagin milliamilliacennovemdecmillianongensextrigintillion': '1.0e+696276510359811'
                // };

                var conversions = {
                    'milliamilliatillion': '1.0e+3000003',
                    'milliamilliaunmilliatillion': '1.0e+3003003',
                    'milliamilliaunmilliauntillion': '1.0e+3003006',
                    'milliamilliaduomilliatillion': '1.0e+3006003'
                };

                Object.keys(conversions).forEach(function (word) {
                    expectValue(conversions[ word ], 'one ' + word);
                });
            });
        });
    });
})();
