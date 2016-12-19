module.exports = {

    create: function() {
        var args = Array.prototype.slice.call(arguments);
        if(args.length === 1) return this.object.apply(this, args);
        if(args.length === 2) return this.extend.apply(this, args);
        throw new Error('Function\'s(\'Object.create()\') arguments aren\'t expected.');
    },

    extend: function(SuperClass, SubClass) {
        // create temporary function used for inheritted
        var temporaryClass = function() {}
        temporaryClass.prototype = SuperClass.prototype;
        // create child class
        var Object = function() {
            // execute parent's constructor
            SuperClass.apply(this, arguments);
            // execute child's constructor
            if(SubClass.constructor) SubClass.constructor.apply(this, arguments);
        };
        // generte prototype that inheritted by its parent object
        Object.prototype = new temporaryClass();
        for(var key in SubClass) if(SubClass.hasOwnProperty(key)) Object.prototype[key] = SubClass[key];
        return Object;
    },

    object: function(SingleObject) {
        var Object = function() {
            // execute child's constructor
            if(SingleObject.constructor) SingleObject.constructor.apply(this, arguments);
        };
        // generte prototype that inheritted by its parent object
        Object.prototype = {};
        for(var key in SingleObject) if(SingleObject.hasOwnProperty(key)) Object.prototype[key] = SingleObject[key];
        return Object;
    }
}