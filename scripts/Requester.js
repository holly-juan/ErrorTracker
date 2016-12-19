var BaseClass = require('./BaseClass');

var objectAssign = require('./objectAssign');


var Requestor = objectAssign.create(BaseClass, {

    type: 'GET',

    url: '#',
    
    constructor: function() {
        if(this.options.type) this.type = this.options.type;
        if(this.options.url) this.url = this.options.url;
    },
    
    send: function(fields) {

        var paramsList = [];
        for (var name in fields) {
            var value = fields[name];
            if(typeof value !== 'string') value = JSON.stringify(value);
            paramsList.push(name + '=' + encodeURIComponent(value));
        }

        // ie browser, multi identical url will be prevented
        paramsList.push('_=' + Math.random());
        var url = this.url + '?' + paramsList.join('&');

        // protocol
        if ((window.location.protocol || '').match(/https/)) url = 'https:' + url;
        else url = 'http:' + url;
        
        (new Image()).src = url;
    }
});

module.exports = Requestor;