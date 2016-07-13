(function () {
    var bigint = require('big-integer'),
        reverse = require('reverse-string'),
        normalizeExp = require('@theoryofnekomata/normalize-exponential');

    function Config(config) {
        return {
            variant: config.variant || 'formal',
            system: config.system || require('./lang/en-us')
        };
    }

    module.exports = function numberName(theConfig) {
        var config = new Config(theConfig);

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

        function getKiloKilo(power, milliaCount, powers) {
            var unitsPower = power % 10,
                tensPower = Math.floor(power / 10) % 10,
                hundredsPower = Math.floor(power / 100) % 10,
                maxMillia = powers.length - 1,
                prefixFragments = [],
                i;
                    
            if (unitsPower > 0 && (
                maxMillia === 0 || // no millias yet, add unit prefixes
                milliaCount < maxMillia || // has millias, add unit prefixes for lower millias...
                milliaCount === maxMillia && unitsPower > 1 // ... and don't add for largest millia if unit power is 1 (safely say a milliatillion == unmilliatillion)
            )) {
                prefixFragments.unshift(
                    power < 10 && milliaCount < 1 && maxMillia < 1 ?
                        getSpecialUnitsKiloPrefix(unitsPower) : getUnitsKiloPrefix(unitsPower)
                );
            }

            if (tensPower > 0) {
                prefixFragments.push(getTensKiloPrefix(tensPower));
            }

            if (hundredsPower > 0) {
                prefixFragments.unshift(getHundredsKiloPrefix(hundredsPower));
            }

            if (power > 0) {
                for (i = milliaCount; i > 0; i--) {
                    prefixFragments.push(getMilliaPrefix());
                }
            }

            console.log(milliaCount, power, maxMillia, prefixFragments.join(''));

            return prefixFragments.join(config.dashes ? '-' : '');
        }

        function getKiloPrefix(power) {
            return splitInThrees(reverse('' + Math.floor(power)))
                .map((kiloKilo) => parseInt(reverse(kiloKilo)))
                .map(getKiloKilo)
                .reverse()
                .join(config.dashes ? '-' : '')
                .trim();
        }

        function getTillionIllion(latinPower) {
            var powerKilo = latinPower % 1000;

            if (powerKilo < 5 && powerKilo > 0 && latinPower < 1000) {
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

            latinPower = toLatinPower(power)

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

        function getDigitGroupingSymbol() {
            return config.system.symbols.digitGrouping;
        }

        function normalizeNumber(value) {
            if (typeof value === 'number') {
                value = value.toExponential().toLowerCase();
            }

            return new normalizeExp({
                decimalPoint: getDecimalPointSymbol(),
                exponentSymbol: 'e'
            })(value);
        }

        function isAllZeroes(string) {
            var i;

            for (i = 0; i < string.length; i++) {
                if (string[i] !== '0') {
                    return false;
                }
            }

            return true;
        }

        function getNegativeSymbol() {
            return '-';
        }

        function getExponentSymbol() {
            return 'e';
        }

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
                digits = digits.slice(negSymbol.length);
            }

            if (exp < 0) {
                for (i = 0; i <= -exp - 2; i++) {
                    digits = '0' + digits;
                }
            }

            for (i = 0; i < digits.length; i++, exp--) {
                if (exp >= 0) {
                    integerPart += digits[i];
                    continue;
                }
                fractionalPart += digits[i] || '0';
            }

            for (; exp >= 0; exp--) {
                integerPart += '0';
            }

            if (integerPart === '') {
                integerPart = '0';
            }

            if (fractionalPart === '') {
                fractionalPart = '0';
            }

            fractionalPart = fractionalPart.replace(/0+$/g, '');

            return (isNegative ? '-' : '') + integerPart + decPoint + fractionalPart;
        }

        function getIntegerPart(number) {
            var decPoint = getDecimalPointSymbol(),
                decPointIdx = number.indexOf(decPoint);

            return number.slice(0, decPointIdx);
        }

        function getFractionalPart(number) {
            var decPoint = getDecimalPointSymbol(),
                decPointIdx = number.indexOf(decPoint),
                fractionalPart = number.slice(decPointIdx + decPoint.length);

            if (isAllZeroes(fractionalPart)) {
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

        function degroupNumber(number) {
            var digitGroupingSymbol = getDigitGroupingSymbol(),
                digitGroupingSymbolIdx;

            while((digitGroupingSymbolIdx = number.indexOf(digitGroupingSymbol) > -1)) {
                number = number.slice(0, digitGroupingSymbolIdx) + number.slice(digitGroupingSymbolIdx + digitGroupingSymbol.length);
            }

            return number;
        }

        return function NumberName(number) {
            var degroupedNumber = degroupNumber('' + number),
                normalizedNumber = normalizeNumber(degroupedNumber),
                fraction = exponentialToFloat(normalizedNumber),
                integerPart = getIntegerPart(fraction),
                fractionalPart = getFractionalPart(fraction),
                bigNumber = bigint(integerPart),
                integralName = splitInThrees(reverse(bigNumber.abs().toString()))
                    .map((kilos) => parseInt(reverse(kilos)))
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
        };
    };
})();
