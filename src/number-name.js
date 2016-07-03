(function () {
    var bigint = require('big-integer'),
        reverse = require('reverse-string'),
        config;

    function getIsFormal() {
        return config.formal !== false;
    }

    function getIsLongCount() {
        return config.system.language.isLongCount;
    }

    function getZero() {
        return config.system.base.zero;
    }

    function getUnits(digit) {
        return config.system.base.units[digit - 1];
    }

    function getTens(digit) {
        return config.system.base.tens[digit - 2];
    }

    function getTeens(digit) {
        return config.system.base.teens[digit];
    }

    function getHundred() {
        return config.system.base.hundred;
    }

    function getThousand() {
        return config.system.base.thousand;
    }

    function getLlionLliard(power) {
        return (getIsLongCount() && power % 2 === 1) ?
            config.system.suffixes.lliard : config.system.suffixes.llion;
    }

    function getSpecialUnitsKiloPrefix(power) {
        return config.system.prefixes.special[getIsFormal() ? 'formal' : 'informal'][power - 1];
    }

    function getUnitsKiloPrefix(power) {
        return config.system.prefixes.units[getIsFormal() ? 'formal' : 'informal'][power - 1];
    }

    function getTensKiloPrefix(power) {
        return config.system.prefixes.tens[getIsFormal() ? 'formal' : 'informal'][power - 1];
    }

    function getHundredsKiloPrefix(power) {
        return config.system.prefixes.hundreds[getIsFormal() ? 'formal' : 'informal'][power - 1];
    }

    function getMillia() {
        return config.system.prefixes.millia;
    }

    function getNegative() {
        return config.system.base.negative;
    }

    function toLatinPower(power) {
        return (getIsLongCount() ? (power / 2) : (power - 1));
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
            prefixFragments.push(getMillia());
        }

        return prefixFragments.join(config.dashes ? '-' : '');
    }

    function getKiloPrefix(power) {
        return splitInThrees(reverse('' + power))
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
        var latinPower;

        if (power < 2) {
            return power === 1 ? getThousand() : null;
        }

        latinPower = toLatinPower(power);

        return [
            getKiloPrefix(latinPower),
            getTillionIllion(latinPower),
            getLlionLliard(power)
        ]
            .filter((fragment) => fragment !== null)
            .join(config.dashes ? '-' : '');
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
            hundredNames.push(getUnits(hundreds));
            hundredNames.push(getHundred());
        }

        if (tens > 0) {
            if (tens === 1) {
                hundredNames.push(getTeens(ones));
                return hundredNames.join(' ');
            }
            hundredNames.push(getTens(tens));
        }

        if (ones > 0) {
            hundredNames.push(getUnits(ones));
        }

        return hundredNames.join(' ');
    }

    function getKilo(kilo, power, kilos) {
        var kiloString = '',
            kiloName;

        if (kilo === 0) {
            if (kilos.length < 2 && power === 0) {
                return getZero();
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

    function normalizeValue(value) {
        return value.trim();
    }

    function isValidNumber(value) {
        value = normalizeValue(value);

        return /^-?([0-9]+\.?[0-9]*)|([0-9]*\.[0-9]+)$/g.test(value);
    }

    function normalizeNumber(value) {
        if (!isValidNumber(value)) {
            throw new Error('Not a valid number.');
        }

        return normalizeValue(value);
    }

    function getIntegerPart(number) {
        var dotIndex = number.indexOf('.');

        if (dotIndex < 0) {
            return number;
        }

        number = number.slice(0, dotIndex);

        if (number === '-') {
            return 0;
        }

        return number;
    }

    function getFractionalPart(number) {
        var dotIndex = number.indexOf('.');

        if (dotIndex < 0) {
            return null;
        }

        return number.slice(dotIndex + 1);
    }

    function getPoint() {
        return config.system.base.point;
    }

    function getFractionName(fractionalPart) {
        var i,
            nameFragments = [];

        for(i = 0; i < fractionalPart.length; i++) {
            nameFragments.push(getUnits(fractionalPart[i]));
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
                .map(getKilo)
                .reverse()
                .join(' ')
                .trim(),
            nameFragments = [integralName];

        if (normalizedNumber.indexOf('-') === 0) {
            nameFragments.unshift(getNegative());
        }

        if (fractionalPart !== null) {
            nameFragments.push(getPoint());
            nameFragments.push(getFractionName(fractionalPart));
        }

        return nameFragments.join(' ');
    }

    module.exports = function customNumberName(theConfig) {
        config = theConfig;
        return numberName;
    };
})();
