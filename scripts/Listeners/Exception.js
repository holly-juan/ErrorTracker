var BaseListener = require("./Base");
var ErrorObject = require('./../ErrorObject');

var constants = require('./../constants');
var objectAssign = require('./../objectAssign');


var ResourceErrorListener = objectAssign.create(BaseListener, {

    manner: 'set',
    event: 'onerror',
    
    callback: function(errorMsg, fileUrl, lineNumber, colNumber, errorObj) {
        var self = this;

        // Script error. [crossDomain]
        if (
            this.isScriptError(errorMsg) &&
            !fileUrl &&
            (!lineNumber || lineNumber < 1)
        ) {
            this.record(
                null,
                function(fields) {
                    fields['message'] = ['Error on cross-domain script(\'', errorMsg, '\') in ', self.getClearPath()].join('');
                },
                {'category': 'crossDomain'}
            );
            return false;
        }

        // IE 6+ colNumber support.
        if (!colNumber && window.event) colNumber = window.event.errorCharacter;

        // init errorObj, if have no native ErrorObject in older browser
        errorObj = errorObj || new ErrorObject({args: [errorMsg, fileUrl, lineNumber, colNumber, errorObj]});

        this.record(errorObj, null, {'category': 'exception'});
    },

    isScriptError: function(errorMsg) {
        return !!errorMsg.match(/^script\serror[\.]?$/i)
    }
});

module.exports = ResourceErrorListener;