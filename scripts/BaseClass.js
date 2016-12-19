var objectAssign = require('./objectAssign');


var BaseClass = objectAssign.create({

    constructor: function(options) {
        this.options = options || {};
        this.singer = this.options.singer || 'anonymous' + (new Date()).getTime();
    },

    tester: function() {
        console.log('name:[' + this.singer + ']: Has no tester');
    },

    rewrite: function(api, func) {
        if(!this[api]) throw new Error('Have no ['+ api +'] function');
        this[api] = func;
    }
});

module.exports = BaseClass;