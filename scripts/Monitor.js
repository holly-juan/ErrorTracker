var BaseClass = require('./BaseClass');
var ErrorFormat = require('./ErrorFormat');

var objectAssign = require('./objectAssign');


var Monitor = objectAssign.create(BaseClass, {

    constructor: function(options) {
        this.requester = options.requester;
    },

    use: function(fn) {
        var self = this;

        this.middleware = (function(prevSelf) {
            return function(fields, done, options) {
                prevSelf(fields, function(){ fn(fields, function(){ done&&done(fields); }, options); }, options);
            }
        })(this.middleware);
    },

    middleware: function(fields, next, options){
        next(fields);
    },

    /* arguments: 
       0. error: ErrorObject
       1. fn: function  [ use for format fields ]
       1. options: { category: '' }  [ record runtime settings ]
    */
    record: function(error, btmFormater, options) {
        var self = this;
        btmFormater = btmFormater || function() {};

        // get fields from args[0]
        var errorFields = error
            ? this.getErrorFields(error)
            : {};

        // get the end fileds via fn:middleware
        this.middleware(errorFields, function(fields) {
            btmFormater(fields);
            self.requester.send(fields)
        }, options);
    },

    getErrorFields: function(error) {
        var error = new ErrorFormat().format(error);
        return {'message': error.message, 'stack': error.stack, 'frames': error.frames};
    }

});

module.exports = Monitor;