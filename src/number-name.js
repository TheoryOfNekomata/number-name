

(function () {
    var isFormal,
        format;



    function numberName(number) {

    }

    function initializeLanguage(config) {
        language = config.language || 
        isFormal = config.isFormal !== false;
    }

    function initializeFormat(config) {
        
    }

    module.exports = function customNumberName(config) {
        config = config || {};
        config.language = config.language || {};

        initializeLanguage(config.language);

        return numberName();
    };
})();
