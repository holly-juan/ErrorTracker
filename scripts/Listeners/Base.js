var BaseClass = require('./../BaseClass');

var objectAssign = require('./../objectAssign');
var constants = require('./../constants');

var BaseListener = objectAssign.create(BaseClass, {
    
    init: function() {
        var self = this;
        
        var _callback = function(e) { self.callback.apply(self, arguments); };
        
        if(this.manner && this.manner === 'set') {
            
            window[this.event] = _callback;
        } else {
            
            if(window.addEventListener) window.addEventListener(this.event, _callback, true);
            else window.attachEvent('on' + this.event, _callback);
        }
        
        return this;
    },
    
    getMonitor: function() {
        return window[constants.ETALIAS].monitor;
    },
    
    record: function() {
        var monitor = this.getMonitor();
        monitor.record.apply(monitor, arguments);
    },

    getClearPath: function(somePath) {
        return (somePath || window.location.href || '').replace(/\?[\S\s]+$/, '');
    }
});

module.exports = BaseListener;