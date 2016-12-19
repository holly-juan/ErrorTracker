var constants = require('./constants');
var objectAssign = require('./objectAssign');


var Catcher = objectAssign.create({

    record: function() {
        var monitor = window[constants.ETALIAS].monitor;
        monitor.record.apply(monitor, arguments);
    },

    wrap: function(_super) {
        if(!_super || typeof _super !== 'function') return _super;
        if(_super[constants.CATCHWRAPER]) return _super[constants.CATCHWRAPER];

        var self = this;

        _super[constants.CATCHWRAPER] = function() {
            try {
                return _super.apply(this, arguments);
            }
            catch (e) {

                // break throw the callstack of js
                if (e.broken) throw e;
                e.broken = true;

                // tag error, prevet multi record by 'Resource.Listener'
                e.message = constants.CATCHER_SINGER + ': ' + e.message;
                
                // record error message
                self.record(e, null, {'category': 'catcher'});

                throw e;
            }
        };

        // prevent multi binds
        _super[constants.CATCHWRAPER][constants.CATCHWRAPER] = _super[constants.CATCHWRAPER];
        return _super[constants.CATCHWRAPER];
    }
});

module.exports = Catcher;