/**
 * Script description.
 * @author TheoryOfNekomata
 * @date 2017-04-01
 */

var systemAliases = require('./aliases'),
    defaultSystems = require('./systems');

/**
 * Constructor for a configuration object.
 * @constructor
 * @param {Object} config A configuration object.
 * @returns {Object} The comprehensive configuration object.
 */
module.exports = function Config(config) {

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
        fractionType: config.fractionType || 'digits',
        dashes: config.dashes === true
    };
};
