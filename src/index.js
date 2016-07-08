(function () {
    var bigint = require('big-integer'),
        reverse = require('reverse-string'),
        normalizeExp = require('@theoryofnekomata/normalize-exponential'),
        config;

    function getVariant() {
        return config.variant;
    }

    function getLongCount() {
        return config.system.language.longCountType;
    }

    function getZeroWord() {
        return config.system.base.zero;
    }

    function getUnitsWord(digit) {
        if (parseInt(digit) === 0) {
            return getZeroWord();
        }
        return config.system.base.units[digit - 1];
    }

    function getTensWord(digit) {
        return config.system.base.tens[digit - 2];
    }

    function getTeensWord(digit) {
        return config.system.base.teens[digit];
    }

    function getHundredWord() {
        return config.system.base.hundred;
    }

    function getThousandWord() {
        return config.system.base.thousand;
    }

    function getLlionLliard(power) {
        return (getLongCount() === 'european' && power % 2 === 1) ?
            config.system.suffixes.lliard : config.system.suffixes.llion;
    }

    function getSpecialUnitsKiloPrefix(power) {
        return config.system.prefixes.special[getVariant()][power - 1];
    }

    function getUnitsKiloPrefix(power) {
        return config.system.prefixes.units[getVariant()][power - 1];
    }

    function getTensKiloPrefix(power) {
        return config.system.prefixes.tens[getVariant()][power - 1];
    }

    function getHundredsKiloPrefix(power) {
        return config.system.prefixes.hundreds[getVariant()][power - 1];
    }

    function getMilliaPrefix() {
        return config.system.prefixes.millia;
    }

    function getNegativeWord() {
        return config.system.base.negative;
    }

    function toLatinPower(power) {
        return (getLongCount() !== null ? (power / 2) : (power - 1));
    }

    function logN(value, base) {
        return Math.log(value) / Math.log(base);
    }

    function getKiloKilo(power, i) {
        var unitsPower = power % 10,
            tensPower = Math.floor(power / 10) % 10,
            hundredsPower = Math.floor(power / 100) % 10,
            prefixFragments = [];

        if (i < 1 || i > 0 && power > 1) {
            if (unitsPower > 0) {
                prefixFragments.unshift(
                    power < 10 && i < 10 ?
                        getSpecialUnitsKiloPrefix(unitsPower) : getUnitsKiloPrefix(unitsPower)
                );
            }

            if (tensPower > 0) {
                prefixFragments.push(getTensKiloPrefix(tensPower));
            }

            if (hundredsPower > 0) {
                prefixFragments.unshift(getHundredsKiloPrefix(hundredsPower));
            }
        }

        if (i > 0) {
            prefixFragments.push(getMilliaPrefix());
        }

        return prefixFragments.join(config.dashes ? '-' : '');
    }

    function getKiloPrefix(power) {
        return splitInThrees(reverse('' + Math.floor(power)))
            .map((kiloKilo) => reverse(kiloKilo))
            .map((kiloKilo) => parseInt(kiloKilo))
            .map(getKiloKilo)
            .reverse()
            .join(config.dashes ? '-' : '')
            .trim();
    }

    function getTillionIllion(latinPower) {
        var powerKilo = latinPower % 1000;

        if (powerKilo < 5 && powerKilo > 0) {
            return null;
        }
        if (powerKilo >= 7 && powerKilo <= 10 || Math.floor(powerKilo / 10) % 10 === 1) {
            return 'i';
        }
        return 'ti';
    }

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
            .filter((fragment) => fragment !== null);

        return (getLongCount() === 'british' && power % 2 === 1 ? getThousandWord() + ' ' : '') + kiloNameFragments.join(config.dashes ? '-' : '');
    }

    function splitInThrees(number) {
        return number.match(/.{1,3}/g);
    }

    function getHundredName(number) {
        var hundreds = Math.floor(number / 100),
            tens = Math.floor(number / 10 % 10),
            ones = Math.floor(number % 10),
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

        return [kiloString, kiloName].join(' ');
    }

    function getDecimalPointSymbol() {
        return config.system.symbols.decimalPoint;
    }

    function normalizeNumber(value) {
        if (typeof value === 'number') {
            value = value.toExponential().toLowerCase();
        }

        return normalizeExp({ decimalPoint: getDecimalPointSymbol() })(value);
    }

    function getIntegerPart(number) {
        var decPoint = getDecimalPointSymbol(),
            decPointIdx = number.indexOf(decPoint),
            digitsExp = number.slice(0, decPointIdx) + number.slice(decPointIdx + decPoint.length),
            expIndex = digitsExp.indexOf('e'),
            exp = parseInt(digitsExp.slice(expIndex + 1)),
            digits = digitsExp.slice(0, expIndex),
            i,
            integerPart = '';

        if (exp < 0) {
            return '0';
        }

        for (i = 0; exp >= 0; i++, exp--) {
            integerPart += digits[i] || '0';
        }

        return integerPart;
    }

    function getFractionalPart(number) {
        var expIndex = number.indexOf('e'),
            exp = parseInt(number.slice(expIndex + 1)),
            i,
            fractionalPart = '',
            decPoint = getDecimalPointSymbol(),
            decPointIdx = number.indexOf(decPoint);

        number = number.slice(0, decPointIdx) + number.slice(decPointIdx + decPoint.length);
        expIndex = number.indexOf('e')
        exp = parseInt(number.slice(expIndex + 1));

        for (i = 0; i < expIndex; exp--, i++) {
            if (exp >= 0) {
                continue;
            }
            fractionalPart += number[i];
        }

        if (fractionalPart === '' || parseInt(fractionalPart) === 0) {
            return null;
        }

        return fractionalPart;
    }

    function getDecimalPointWord() {
        return config.system.base.decimalPoint;
    }

    function getFractionName(fractionalPart) {
        var i,
            nameFragments = [];


        nameFragments.unshift(getDecimalPointWord());

        for(i = 0; i < fractionalPart.length; i++) {
            nameFragments.push(getUnitsWord(fractionalPart[i]));
        }

        return nameFragments.join(' ');
    }

    function numberName(number) {
        var normalizedNumber = normalizeNumber(number);
            integerPart = getIntegerPart(normalizedNumber),
            fractionalPart = getFractionalPart(normalizedNumber),
            bigNumber = bigint(integerPart),
            integralName = splitInThrees(reverse(bigNumber.abs().toString()))
                .map((kilos) => reverse(kilos))
                .map((number) => parseInt(number))
                .map(getKiloPhrase)
                .reverse()
                .filter((kilo) => kilo !== null)
                .join(' ')
                .trim(),
            nameFragments = [integralName];

        if (normalizedNumber.indexOf('-') === 0) {
            nameFragments.unshift(getNegativeWord());
        }

        if (fractionalPart !== null) {
            nameFragments.push(getFractionName(fractionalPart));
        }

        return nameFragments.join(' ').trim();
    }

    module.exports = function customNumberName(theConfig) {
        config = theConfig;
        config.variant = config.variant || 'formal';
        return numberName;
    };
})();
