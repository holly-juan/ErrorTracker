var Requester = require('./scripts/Requester');
var Monitor = require('./scripts/Monitor');
var BaseListener = require('./scripts/Listeners/Base');
var ResourceListener = require('./scripts/Listeners/Resource');
var ExceptionListener = require('./scripts/Listeners/Exception');
var ErrorFormat = require('./scripts/ErrorFormat');
var Catcher = require('./scripts/Catcher');

var constants = require('./scripts/constants');
var objectAssign = require('./scripts/objectAssign');

var ErrorTracker = objectAssign.create({

    constructor: function(options) {
        if(!options) throw new Error('缺少初始化参数');
        if(!options.requester) throw new Error('缺少异常记录请求的参数:[requester->{type:\'\',url:\'\'}]');

        this.requester = new Requester(options.requester);

        this.monitor = new Monitor({requester: this.requester});

        this.resourceListener = new ResourceListener().init();
        this.exceptionListener = new ExceptionListener().init();

        this.catcher = new Catcher();

        this.init();
    },

    use: function() {
        this.monitor.apply(this.monitor, arguments);
    },

    wrap: function() {
        this.catcher.wrap.apply(this.catcher, arguments);
    }
});

module.exports = {

    'ErrorTracker': ErrorTracker,

    'ErrorTracker_BaseClasses': {
        'BaseListener': BaseListener,
        'ErrorFormat': ErrorFormat,
        'Catcher': Catcher,
        'ResourceListener': ResourceListener,
        'ExceptionListener': ExceptionListener,
        'Monitor': Monitor,
        'Requester': Requester,
        'constants': constants
    }
}