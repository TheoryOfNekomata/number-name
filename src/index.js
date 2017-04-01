/**
 * number-name
 * Converts a number into its name.
 *
 * @author TheoryOfNekomata <allan.crisostomo@outlook.com>
 * @license MIT
 */

/**
 * This app is derived from Landon Curt Noll's source which can be found
 * at:
 *
 * http://www.isthe.com/chongo/tech/math/number/number
 *
 * The copyright from the original source is copied to here:
 *
 *
 * Copyright (c) 1998-2011,2016 by Landon Curt Noll.  All Rights Reserved.
 *
 * Permission to use, copy, modify, and distribute this software and
 * its documentation for any purpose and without fee is hereby granted,
 * provided that the above copyright, this permission notice and text
 * this comment, and the disclaimer below appear in all of the following:
 *
 *    supporting documentation
 *    source copies
 *    source works derived from this source
 *    binaries derived from this source or from derived source
 *
 * LANDON CURT NOLL DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE,
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO
 * EVENT SHALL LANDON CURT NOLL BE LIABLE FOR ANY SPECIAL, INDIRECT OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF
 * USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 *
 * With many thanks for Latin suggestions from:
 *
 *    Jeff Drummond
 *
 * as well as thanks to these people for their bug reports on earlier versions:
 *
 *    Dr K.M. Briggs            Fredrik Mansfeld
 *
 * Comments, suggestions, bug fixes and questions about these routines
 * are welcome.
 *
 * Happy bit twiddling,
 *
 *    Landon Curt Noll
 *    http://www.isthe.com/chongo/index.html
 *
 * Send EMail to: number-mail at asthe dot com
 *
 * chongo (Share and enjoy! :-) - chongo was here) /\../\
 */

/**
 * On the purpose and history of this code
 * =======================================
 *
 * The English number system we use today is a mix of old English, old
 * French and old commercial Latin to name just a few sources. Extensions
 * beyond the Latin power of 21 was based in part commercial Latin of
 * Venice, particularly of the 14th and early 15th century when Republic
 * of Venice. This Latin differs from liturgical Latin and modern
 * standard Latin in several ways.  One of these differences is
 * "do" vs. "duo" as in "do-dec-illion" vs. "duo-dec-illion", and is
 * "du" vs. "duo" as in "ducen-tillion" vs. "duo-cen-tillion".  Additional
 * differences include, but are not limited and "millia" vs. "milia".
 * It is unfortunate that consistent spelling was not a hallmark of that era!
 *
 * When we codifying the rules for "The English name of a number", we
 * were tempted to "improve" the system today.  For example there are
 * a number of aspects to the system that we do not like.  The
 * inconsistency of "do/du" (as in "do-dec-illion" and "ducen-tillion")
 * and the "four and twenty" rule (as in the name "quattuor-vigin-tillion")
 * is unfortunate.
 *
 * When we set down the "name of the number" system we were attempting
 * to programmatically describe the system we had using the roots of
 * the language on which it was based.  If we tweaked the system to
 * our preferences in one place then soon we would have been describing
 * our preferences instead of the system we use today.  So we resisted
 * the temptation to improve and stuck to strict codification of the
 * names of the Latin powers.
 *
 * However since that time, we have uncovered use of "duo" in the 14th
 * and early 15th centuries.  And since spelling then was often
 * inconsistent (it was not unusual to find a word spelled several
 * ways in some documents), we feel safe to select "duo" in the name
 * of consistency.  I.e., if we are forced to choose a spelling, then
 * we will opt for the more consistent spelling that produces a simpler
 * algorithm.  Therefore starting with version 3, we will use "duo"
 * in place of "du" and "do".  However for backward compatibility, a
 * flag will be used to generate original Latin power roots.
 *
 * Regarding those proposing improved number naming systems
 * ========================================================
 *
 * There exist a number of proposals offering improved number naming
 * systems.  We agree that names of numbers used in English could be
 * improved if one was not interested in remaining backward compatible
 * with the system in use today.  We also agree that the extension
 * beyond the Latin power of 21 may be improved if one is willing to
 * ignore the historic Latin power roots.
 *
 * This program will NOT be modified to reflect such recommendations
 * for improvements for two important reasons:
 *
 *     1) The "name of the number" system algorithm only describes an
 *        extension to a historical system using the spelling and grammar
 *        rules of that era.  Modern Latin rules and more general proposals
 *        for improved number naming systems are focused in ideas of
 *        today, not what was in place centuries ago when the English
 *        number naming system began.
 *
 *     2) We do not have time or the energy required to codify alternate
 *        proposals. While we wish the proponents of those systems success,
 *        the purpose this algorithm is to describe the extension of the
 *        common naming system today using the historic rules of the
 *        languages on which today's system is based.
 *
 * Regarding regional English language variations
 * ==============================================
 *
 * There exist many of variations of the names of numbers in the English
 * language.  Examples include this such as "zero" vs. "naught",
 * "thousand million" vs. "millard", "one thousand two hundred" vs.
 * "twelve hundred", "two hundred and forty" vs. "two hundred forty",
 * etc.  English is a multifaceted language.  English spelling and
 * grammar of New Zealand, Canada, Australia, U.K., U.S.A., just to
 * name a few places will differ.  Even the output of digits can differ
 * among English speaking countries.  For example: "123,456.789" vs.
 * "123 456.789".
 *
 * The original code only described just the "American" and "European"
 * systems. We don't have the time, or the energy to codify the many
 * English variations.  If you wish extend this code to describes a
 * favorite variation, then you are welcome to send us a patch in
 * "diff –u" (unified context) form to:
 *
 *     number-mail at asthe dot com
 *
 * To invoke your variation, please use:
 *
 *     -r name_of_your_ruleset
 *
 * We will consider patches that describe a regional English variation
 * only.  Please do not submit a patch for an "improved number naming
 * systems" (see the previous section).
 */

/* global define */

var TEN = 10,
    ONE_HUNDRED = 100,
    ONE_THOUSAND = 1000;

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(
            [ 'big-integer', 'reverse-string', '@theoryofnekomata/normalize-exponential' ],
            function (bigint, reverse, ExpNormalizer) {
                return (root.NumberName = factory(bigint, reverse, ExpNormalizer));
            }
        );
    } else if (typeof module.exports === 'object' && module.exports) {
        module.exports = factory(
            require('big-integer'),
            require('reverse-string'),
            require('@theoryofnekomata/normalize-exponential')
        );
    } else {
        root.NumberName = factory(root.bigInteger, root.reverseString, root.NormalizeExponential);
    }
})(this, function (bigint, reverse, ExpNormalizer) {
    var systemAliases = {
            "american": [
                "america", "us", "usa", "unitedstates", "unitedstatesofamerica", "modernbritish"
            ],
            "european": [
                "europe", "eu", "eur"
            ],
            "british": [
                "uk", "unitedkingdom", "britain", "greatbritain", "oldenglish"
            ]
        },
        defaultSystems = {
            american: {
                "language": {
                    "name": "English",
                    "variant": "American",
                    "code": "en",
                    "fullCode": "en-US",
                    "longCountType": null,
                    "canInfixDashes": true
                },
                "symbols": {
                    "decimalPoint": ".",
                    "digitGrouping": ","
                },
                "base": {
                    "zero": "zero",
                    "units": [ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ],
                    "tens": [ "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety" ],
                    "teens": [ "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen" ],
                    "hundred": "hundred",
                    "thousand": "thousand",
                    "decimalPoint": "point",
                    "negative": "negative"
                },
                "ordinal": {
                    "1": "first",
                    "2": "second",
                    "3": "third",
                    "5": "fifth",
                    "12": "twelfth"
                },
                "fractions": {
                    "halves": "halves"
                },
                "prefixes": {
                    "units": {
                        "formal": [ "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem" ],
                        "informal": [ "un", "do", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem" ]
                    },
                    "tens": {
                        "formal": [ "dec", "vigin", "trigin", "quadragin", "quinquagin", "sexagin", "septuagin", "octogin", "nonagin" ],
                        "informal": [ "dec", "vigin", "trigin", "quadragin", "quinquagin", "sexagin", "septuagin", "octogin", "nonagin" ]
                    },
                    "hundreds": {
                        "formal": [ "cen", "duocen", "trecen", "quadringen", "quingen", "sescen", "septingen", "octingen", "nongen" ],
                        "informal": [ "cen", "ducen", "trecen", "quadringen", "quingen", "sescen", "septingen", "octingen", "nongen" ]
                    },
                    "special": {
                        "formal": [ "mi", "bi", "tri", "quadri", "quin", "sex", "sept", "oct", "non" ],
                        "informal": [ "mi", "bi", "tri", "quadri", "quin", "sex", "sept", "oct", "non" ]
                    },
                    "millia": "millia"
                },
                "suffixes": {
                    "llion": "llion",
                    "lliard": "lliard"
                }
            },
            british: {
                "language": {
                    "name": "English",
                    "variant": "Traditional British",
                    "code": "en",
                    "fullCode": "en-UK",
                    "longCountType": "british",
                    "canInfixDashes": true
                },
                "symbols": {
                    "decimalPoint": ".",
                    "digitGrouping": ","
                },
                "base": {
                    "zero": "naught",
                    "units": [ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ],
                    "tens": [ "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety" ],
                    "teens": [ "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen" ],
                    "hundred": "hundred",
                    "thousand": "thousand",
                    "decimalPoint": "point",
                    "negative": "negative"
                },
                "ordinal": {
                    "1": "first",
                    "2": "second",
                    "3": "third",
                    "5": "fifth",
                    "12": "twelfth"
                },
                "fractions": {
                    "halves": "halves"
                },
                "prefixes": {
                    "units": {
                        "formal": [ "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem" ],
                        "informal": [ "un", "do", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem" ]
                    },
                    "tens": {
                        "formal": [ "dec", "vigin", "trigin", "quadragin", "quinquagin", "sexagin", "septuagin", "octogin", "nonagin" ],
                        "informal": [ "dec", "vigin", "trigin", "quadragin", "quinquagin", "sexagin", "septuagin", "octogin", "nonagin" ]
                    },
                    "hundreds": {
                        "formal": [ "cen", "duocen", "trecen", "quadringen", "quingen", "sescen", "septingen", "octingen", "nongen" ],
                        "informal": [ "cen", "ducen", "trecen", "quadringen", "quingen", "sescen", "septingen", "octingen", "nongen" ]
                    },
                    "special": {
                        "formal": [ "mi", "bi", "tri", "quadri", "quin", "sex", "sept", "oct", "non" ],
                        "informal": [ "mi", "bi", "tri", "quadri", "quin", "sex", "sept", "oct", "non" ]
                    },
                    "millia": "millia"
                },
                "suffixes": {
                    "llion": "llion",
                    "lliard": "lliard"
                }
            },
            european: {
                "language": {
                    "name": "English",
                    "variant": "European",
                    "code": "en",
                    "fullCode": "en-EU",
                    "longCountType": "european",
                    "canInfixDashes": true
                },
                "symbols": {
                    "decimalPoint": ",",
                    "digitGrouping": "."
                },
                "base": {
                    "zero": "zero",
                    "units": [ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ],
                    "tens": [ "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety" ],
                    "teens": [ "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen" ],
                    "hundred": "hundred",
                    "thousand": "thousand",
                    "decimalPoint": "comma",
                    "negative": "negative"
                },
                "ordinal": {
                    "1": "first",
                    "2": "second",
                    "3": "third",
                    "5": "fifth",
                    "12": "twelfth"
                },
                "fractions": {
                    "halves": "halves"
                },
                "prefixes": {
                    "units": {
                        "formal": [ "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem" ],
                        "informal": [ "un", "do", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem" ]
                    },
                    "tens": {
                        "formal": [ "dec", "vigin", "trigin", "quadragin", "quinquagin", "sexagin", "septuagin", "octogin", "nonagin" ],
                        "informal": [ "dec", "vigin", "trigin", "quadragin", "quinquagin", "sexagin", "septuagin", "octogin", "nonagin" ]
                    },
                    "hundreds": {
                        "formal": [ "cen", "duocen", "trecen", "quadringen", "quingen", "sescen", "septingen", "octingen", "nongen" ],
                        "informal": [ "cen", "ducen", "trecen", "quadringen", "quingen", "sescen", "septingen", "octingen", "nongen" ]
                    },
                    "special": {
                        "formal": [ "mi", "bi", "tri", "quadri", "quin", "sex", "sept", "oct", "non" ],
                        "informal": [ "mi", "bi", "tri", "quadri", "quin", "sex", "sept", "oct", "non" ]
                    },
                    "millia": "millia"
                },
                "suffixes": {
                    "llion": "llion",
                    "lliard": "lliard"
                }
            }
        };

    /**
     * Constructor for a configuration object.
     * @constructor
     * @param {Object} config A configuration object.
     * @returns {Object} The comprehensive configuration object.
     */
    function Config(config) {

        /**
         * Normalizes a system name.
         * @param {String} systemAlias A system name, presumably an alias.
         * @returns {String} The normalized system name.
         */
        function normalizeAlias(systemAlias) {
            var normalizedAlias = '';

            systemAlias = systemAlias.replace(/[^a-zA-Z]/g, '').toLowerCase();

            Object.keys(systemAliases)
                .forEach(function (normalizedSystemName) {
                    if (normalizedSystemName.indexOf(systemAlias) < 0) {
                        return;
                    }
                    normalizedAlias = normalizedSystemName;
                });

            if (normalizedAlias === '') {
                throw new Error('Unknown system "' + systemAlias + '"');
            }

            return normalizedAlias;
        }

        config = config || {};
        config.system = config.system || 'american';

        if (typeof config.system === 'string') {
            config.system = defaultSystems[ normalizeAlias(config.system) ];
        }

        return {
            variant: config.variant || 'formal',
            isShortMillia: config.isShortMillia === true,
            system: config.system || defaultSystems.american,
            fractionType: config.fractionType || 'digits'
        };
    }

    /**
     * Creates a custom instance of the converter.
     * @param {Object} theConfig The configuration object.
     * @class
     */
    return function numberName(theConfig) {
        var config = new Config(theConfig);

        /**
         * Gets the variant of the converter.
         * @returns {String} The variant of the converter.
         */
        function getVariant() {
            return config.variant;
        }

        /**
         * Gets the flag if dashes are to be added between prefix fragments for readability.
         * @returns {Boolean} Value that determines if dashes are to be added between prefixes.
         */
        function getHasDashes() {
            return config.dashes;
        }

        /**
         * Gets the fraction type of the converter.
         * @returns {String} The fraction type of the converter.
         */
        function getFractionType() {
            return config.fractionType;
        }

        /**
         * Gets the flag if millia- prefixes are to be shortened (e.g. milliamilliatillion => millia^2tillion)
         * @returns {Boolean} Value that determines if millia- prefixes are to be shortened.
         */
        function getIsShortMillia() {
            return config.isShortMillia;
        }

        /**
         * Gets the long count type of the system (or null if the system is short count).
         * @returns {String|null} The long count type of the system (or null if the system is short count.)
         */
        function getLongCount() {
            return config.system.language.longCountType;
        }

        /**
         * Gets the "zero" word of the system.
         * @returns {String} The "zero" word of the system.
         */
        function getZeroWord() {
            return config.system.base.zero;
        }

        /**
         * Gets the unit word of the system for a specific digit.
         * @param {Number} digit The unit digit.
         * @returns {String} The word for the unit.
         */
        function getUnitsWord(digit) {
            if (parseInt(digit) === 0) {
                return getZeroWord();
            }
            return config.system.base.units[ digit - 1 ];
        }

        /**
         * Gets the tens word of the system for a specific tens factor.
         * @param {Number} factor The tens factor (10 * factor).
         * @returns {String} The word for the ten.
         */
        function getTensWord(factor) {
            return config.system.base.tens[ factor - 2 ];
        }

        /**
         * Gets the -teen word of the system for a specific digit.
         * @param {Number} offset The ten offset (10 + offset).
         * @returns {String} The word for the -teen.
         */
        function getTeensWord(offset) {
            return config.system.base.teens[ offset ];
        }

        /**
         * Gets the "hundred" word of the system.
         * @returns {String} The "hundred" word of the system.
         */
        function getHundredWord() {
            return config.system.base.hundred;
        }

        /**
         * Gets the "thousand" word of the system.
         * @returns {String} The "thousand" word of the system.
         */
        function getThousandWord() {
            return config.system.base.thousand;
        }

        /**
         * Gets the -llion/-lliard suffix of the system for a certain Latin power.
         * @param {Number} latinPower The Latin power.
         * @returns {String} The suffix.
         */
        function getLlionLliard(latinPower) {
            return (getLongCount() === 'european' && latinPower % 2 === 1) ?
                config.system.suffixes.lliard : config.system.suffixes.llion;
        }

        /**
         * Gets the special units prefix of the system for a certain Latin power.
         * @param {Number} latinPower The Latin power.
         * @returns {String} The prefix.
         */
        function getSpecialUnitsKiloPrefix(latinPower) {
            return config.system.prefixes.special[ getVariant() ][ latinPower - 1 ];
        }

        /**
         * Gets the standard units prefix of the system for a certain Latin power.
         * @param {Number} latinPower The Latin power.
         * @returns {String} The prefix.
         */
        function getUnitsKiloPrefix(latinPower) {
            return config.system.prefixes.units[ getVariant() ][ latinPower - 1 ];
        }

        /**
         * Gets the tens prefix of the system for a certain Latin power factor.
         * @param {Number} latinPowerFactor The Latin power factor (10 * latinPowerFactor).
         * @returns {String} The prefix.
         */
        function getTensKiloPrefix(latinPowerFactor) {
            return config.system.prefixes.tens[ getVariant() ][ latinPowerFactor - 1 ];
        }

        /**
         * Gets the hundreds prefix of the system for a certain Latin power factor.
         * @param {Number} latinPowerFactor The Latin power factor (100 * latinPowerFactor).
         * @returns {String} The prefix.
         */
        function getHundredsKiloPrefix(latinPowerFactor) {
            return config.system.prefixes.hundreds[ getVariant() ][ latinPowerFactor - 1 ];
        }

        /**
         * Gets the "millia" prefix of the system, which is used for naming Latin powers 1000 and beyond.
         * @returns {String} The "millia" prefix.
         */
        function getMilliaPrefix() {
            return config.system.prefixes.millia;
        }

        /**
         * Gets the "negative" word of the system.
         * @returns {String} The "negative" word.
         */
        function getNegativeWord() {
            return config.system.base.negative;
        }

        /**
         * Gets the decimal point symbol (i.e. '.' for US/UK, ',' for European).
         * @returns {String} The decimal point symbol.
         */
        function getDecimalPointSymbol() {
            return config.system.symbols.decimalPoint;
        }

        /**
         * Gets the word for the decimal point symbol of the system.
         * @returns {String} The word for the decimal point.
         */
        function getDecimalPointWord() {
            return config.system.base.decimalPoint;
        }

        /**
         * Gets the digit grouping symbol (i.e. ',' for US/UK, '.' for European).
         * @returns {String} The digit grouping symbol.
         */
        function getDigitGroupingSymbol() {
            return config.system.symbols.digitGrouping;
        }

        /**
         * Gets the negative symbol (e.g. the minus '-' symbol).
         * @returns {String} The negative symbol.
         */
        function getNegativeSymbol() {
            return '-';
        }

        /**
         * Gets the exponential delimiter symbol (e.g. the 'e' in "3.14e+25").
         * @returns {String} The exponential delimiter symbol.
         */
        function getExponentSymbol() {
            return 'e';
        }

        /**
         * Splits a string into three characters each.
         * @param {String} s A string.
         * @returns {String[]} The string split in three characters.
         */
        function splitInThrees(s) {
            return s.match(/.{1,3}/g);
        }

        /**
         * Normalizes the Latin power to accomodate both long and short count systems.
         * @returns {Number} power The base power.
         * @returns {String} The normalized power.
         */
        function toLatinPower(power) {
            return (getLongCount() !== null ? (power / 2) : (power - 1));
        }

        /**
         * Gets the repeated millia- prefix.
         * @returns {Number} milliaCount How many millia-'s?
         * @returns {String} The repeated millia- prefixes.
         */
        function getMilliaRep(milliaCount) {
            var i,
                millias = [];

            if (getIsShortMillia()) {
                return [ getMilliaPrefix() + (milliaCount > 1 ? '^' + milliaCount : '') ];
            }

            for (i = milliaCount; i > 0; i--) {
                millias.push(getMilliaPrefix());
            }

            return millias;
        }

        /**
         * Gets the kilo-kilo (the thousands of the Latin power).
         * @param {Number} latinPowerKilo The Latin power for the kilo.
         * @param {Number} milliaCount
         * @param {Number} kilos
         * @returns {String} The fragment of the name of the Latin power kilo.
         */
        function getKiloKilo(latinPowerKilo, milliaCount, kilos) {
            var kiloOnes = latinPowerKilo % TEN,
                kiloTens = Math.floor(latinPowerKilo / TEN) % TEN,
                kiloHundreds = Math.floor(latinPowerKilo / ONE_HUNDRED) % TEN,
                lastKilo = kilos.length - 1,
                prefixFragments = [];

            if (kiloOnes > 0 && (
                    // No millias yet, add unit prefixes.
                    lastKilo === 0 ||

                    // Has millias, add unit prefixes for lower millias...
                    milliaCount < lastKilo ||
                    // ...and don't add for largest millia if unit power is 1 (safely say a milliatillion == unmilliatillion)
                    milliaCount === lastKilo && kiloOnes > 1
                )) {
                prefixFragments.unshift(
                    latinPowerKilo < TEN && milliaCount < 1 && lastKilo < 1 ?
                        getSpecialUnitsKiloPrefix(kiloOnes) : getUnitsKiloPrefix(kiloOnes)
                );
            }

            if (kiloTens > 0) {
                prefixFragments.push(getTensKiloPrefix(kiloTens));
            }

            if (kiloHundreds > 0) {
                prefixFragments.unshift(getHundredsKiloPrefix(kiloHundreds));
            }

            if (latinPowerKilo > 0) {
                getMilliaRep(milliaCount)
                    .forEach(function (milliaRep) {
                        return prefixFragments.push(milliaRep);
                    });
            }

            return prefixFragments.join(getHasDashes() ? '-' : '');
        }

        /**
         * Gets the kilo prefix of the Latin power.
         * @param {Number} latinPower The Latin power.
         * @returns {String} The kilo prefix of the Latin power.
         */
        function getKiloPrefix(latinPower) {
            return splitInThrees(reverse('' + Math.floor(latinPower)))
                .map(function (kiloKilo) {
                    return parseInt(reverse(kiloKilo));
                })
                .map(getKiloKilo)
                .reverse()
                .join(getHasDashes() ? '-' : '')
                .trim();
        }

        /**
         * Gets the infix between the Latin power prefix and the -llion/-lliard suffix.
         * @param {Number} latinPower The Latin power.
         * @returns {String|null} The infix, or null if it does not require an infix.
         */
        function getTillionIllion(latinPower) {
            var powerKilo = latinPower % ONE_THOUSAND;

            if (powerKilo < 5 && powerKilo > 0 && latinPower < ONE_THOUSAND) {
                return null;
            }
            if (powerKilo >= 7 && powerKilo <= TEN || Math.floor(powerKilo / TEN) % TEN === 1) {
                return 'i';
            }
            return 'ti';
        }

        /**
         * Gets the kilo name of the power.
         * @param {Number} power The base power.
         * @returns {String} The kilo name.
         */
        function getKiloName(power) {
            var latinPower,
                kiloNameFragments;

            if (power < 2) {
                return power === 1 ? getThousandWord() : null;
            }

            latinPower = toLatinPower(power);

            kiloNameFragments = [
                getKiloPrefix(latinPower),
                getTillionIllion(latinPower),
                getLlionLliard(power)
            ]
                .filter(function (fragment) {
                    return fragment !== null;
                });

            return (getLongCount() === 'british' && power % 2 === 1 ? getThousandWord() + ' ' : '') + kiloNameFragments.join(getHasDashes() ? '-' : '');
        }

        /**
         * Gets the name of the hundred.
         * @param {Number} number The number < 1000.
         * @returns {String} The name of the hundred.
         */
        function getHundredName(number) {
            var hundreds = Math.floor(number / ONE_HUNDRED),
                tens = Math.floor(number / TEN % TEN),
                ones = Math.floor(number % TEN),
                hundredNames = [];

            if (hundreds > 0) {
                hundredNames.push(getUnitsWord(hundreds));
                hundredNames.push(getHundredWord());
            }

            if (tens > 0) {
                if (tens === 1) {
                    hundredNames.push(getTeensWord(ones));
                    return hundredNames.join(' ');
                }
                hundredNames.push(getTensWord(tens));
            }

            if (ones > 0) {
                hundredNames.push(getUnitsWord(ones));
            }

            return hundredNames.join(' ');
        }

        /**
         * Gets the phrase of the kilo (i.e. "one million two hundred forty five", there are two phrases:
         * "one million", and "two hundred forty five".
         * @param {Number} kilo The kilo
         * @param {Number} power The power of the kilo.
         * @param {Number[]} kilos All the kilos.
         * @returns {String} The kilo phrase.
         */
        function getKiloPhrase(kilo, power, kilos) {
            var kiloString = '',
                kiloName;

            if (kilo === 0) {
                if (kilos.length < 2 && power === 0) {
                    return getZeroWord();
                }
                return null;
            }

            kiloString = getHundredName(kilo);
            kiloName = getKiloName(power);

            if (kiloName === null) {
                return kiloString;
            }

            return [ kiloString, kiloName ].join(' ');
        }

        /**
         * Normalizes a number.
         * @param {*} value A value.
         * @returns {String} The normalized number.
         */
        function normalizeNumber(value) {
            var normalize = new ExpNormalizer({
                decimalPoint: getDecimalPointSymbol(),
                exponentSymbol: getExponentSymbol()
            });

            if (typeof value === 'number') {
                value = value.toExponential().toLowerCase();
            }

            return normalize(value);
        }

        /**
         * Checks if a string is composed of only zeroes.
         * @param {String} string A string.
         * @returns {Boolean} Is string composed of only zeroes?
         */
        function isAllZeroes(string) {
            var i;

            for (i = 0; i < string.length; i++) {
                if (string[ i ] !== '0') {
                    return false;
                }
            }

            return true;
        }

        /**
         * Converts a number-like string represented in exponential notation to its standard notation.
         * @param {String} number A number-like string.
         * @returns {String} The same number in standard notation.
         */
        function exponentialToFloat(number) {
            var decPoint = getDecimalPointSymbol(),
                negSymbol = getNegativeSymbol(),
                expDelimiter = getExponentSymbol(),

                decPointIdx = number.indexOf(decPoint),
                realDecPointIdx = decPointIdx < 0 ? number.length : decPointIdx,
                digitsExp = number.slice(0, realDecPointIdx) + number.slice(realDecPointIdx + decPoint.length),

                expIndex = digitsExp.indexOf(expDelimiter),
                realExpIndex = expIndex < 0 ? digitsExp.length : expIndex,
                exp = parseInt(digitsExp.slice(realExpIndex + expDelimiter.length)),

                isNegative = number.indexOf(negSymbol) === 0,

                digits = digitsExp.slice(0, realExpIndex),

                integerPart = '',
                fractionalPart = '',
                i;

            if (isNegative) {
                // Treat it as a positive number, then add the negative symbol afterwards.
                digits = digits.slice(negSymbol.length);
            }

            if (exp < 0) {
                // Save the zeroes in fractional numbers (e.g. 0.03, 0.000084, 0.0005)
                for (i = 0; i <= -exp - 2; i++) {
                    digits = '0' + digits;
                }
            }

            for (i = 0; i < digits.length; i++, exp--) {
                if (exp >= 0) {
                    integerPart += digits[ i ];
                    continue;
                }
                fractionalPart += digits[ i ] || '0';
            }

            for (; exp >= 0; exp--) {
                integerPart += '0';
            }

            // If there are no integer/fractional parts, just consider them as zeroes.
            if (integerPart === '') {
                integerPart = '0';
            }

            if (fractionalPart === '') {
                fractionalPart = '0';
            }

            // Trim the leading zeroes in the integer part...
            integerPart = integerPart.replace(/^0+/g, '');

            // ...and the trailing zeroes in the fractional part.
            fractionalPart = fractionalPart.replace(/0+$/g, '');

            return (isNegative ? '-' : '') + integerPart + decPoint + fractionalPart;
        }

        /**
         * Get the integer part of a number.
         * @param {String} number A number.
         * @returns {String} The integer part of the number.
         */
        function getIntegerPart(number) {
            var decPoint = getDecimalPointSymbol(),
                decPointIdx = number.indexOf(decPoint);

            return number.slice(0, decPointIdx);
        }

        /**
         * Gets the fractional part of a number.
         * @param {String} number A number.
         * @returns {String} The fractional part of the number including its leading zeroes if any.
         */
        function getFractionalPart(number) {
            var decPoint = getDecimalPointSymbol(),
                decPointIdx = number.indexOf(decPoint),
                fractionalPart = number.slice(decPointIdx + decPoint.length);

            if (isAllZeroes(fractionalPart)) {
                return null;
            }

            return fractionalPart;
        }

        /**
         * Gets the name of the fractional part of a number.
         * @param {String} fractionalPart The fractional part of the number.
         * @returns {String} The name of the fractional part of the number.
         */
        function getFractionName(fractionalPart) {
            var i,
                nameFragments = [];

            switch (getFractionType()) {
                case 'digits':
                    nameFragments.unshift(getDecimalPointWord());

                    for (i = 0; i < fractionalPart.length; i++) {
                        nameFragments.push(getUnitsWord(fractionalPart[ i ]));
                    }
                    break;
                default:
                    break;
            }

            return nameFragments.join(' ');
        }

        /**
         * Removes the digit grouping symbol of a number.
         * @param {String} number A number with digit grouping symbols.
         * @returns {String} The same number without digit grouping symbols.
         */
        function degroupNumber(number) {
            var digitGroupingSymbol = getDigitGroupingSymbol(),
                digitGroupingSymbolIdx;

            while ((digitGroupingSymbolIdx = number.lastIndexOf(digitGroupingSymbol)) > -1) {
                number = number.slice(0, digitGroupingSymbolIdx) + number.slice(digitGroupingSymbolIdx + digitGroupingSymbol.length);
            }

            return number;
        }

        /**
         * Converts a number to a name.
         * @param {String|Number} number A number.
         * @returns {String} The name of the number.
         */
        this.toName = function toName(number) {
            var degroupedNumber,
                normalizedNumber,
                fraction,
                integerPart,
                fractionalPart,
                bigNumber,
                integralName,
                nameFragments;

            try {
                number = number.replace(/\s/g, '');
                degroupedNumber = degroupNumber('' + number);
                normalizedNumber = normalizeNumber(degroupedNumber);
                fraction = exponentialToFloat(normalizedNumber);
                integerPart = getIntegerPart(fraction);
                fractionalPart = getFractionalPart(fraction);
                bigNumber = bigint(integerPart);
                integralName = splitInThrees(reverse(bigNumber.abs().toString()))
                    .map(function (kilos) {
                        return parseInt(reverse(kilos));
                    })
                    .map(getKiloPhrase)
                    .reverse()
                    .filter(function (kilo) {
                        return kilo !== null;
                    })
                    .join(' ')
                    .trim();
                nameFragments = [ integralName ];

                if (normalizedNumber.indexOf('-') === 0) {
                    nameFragments.unshift(getNegativeWord());
                }

                if (fractionalPart !== null) {
                    nameFragments.push(getFractionName(fractionalPart));
                }
            } catch (e) {
                throw new Error('Invalid number: "' + number + '"');
            }

            return nameFragments.join(' ').trim();
        };

        this.getDigitGroupingSymbol = getDigitGroupingSymbol;

        this.getDecimalPointSymbol = getDecimalPointSymbol;
    };
});
