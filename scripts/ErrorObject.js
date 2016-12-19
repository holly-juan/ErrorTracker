var objectAssign = require('./objectAssign');


var ErrorObject = objectAssign.create({

    constructor: function(opt) {
        var args = opt.args;

        this.message = args[0] || 'unknown';
        this.file = args[1] || 'unknown';
        this.line = args[2] || -1;
        this.column = args[3] || -1;
        this.stack = [ this.message, '@', this.file, ':', this.line, ':', this.column ].join('');    
    },

    toString: function() {
        return this.message
    }
});

module.exports = ErrorObject;