var BaseListener = require("./Base");

var objectAssign = require('./../objectAssign');


var ResourceErrorListener = objectAssign.create(BaseListener, {

    event: 'error',

    callback: function(e) {
        if (!e.target || !e.target.tagName) return false;
        
        var self = this;
        
        var tagName = e.target.tagName.toLocaleLowerCase() || '';

        var fileUrl = '';
        switch (tagName) {
            case 'script':
            case 'img':
                fileUrl = e.target.src;
                break;
            case 'link':
                fileUrl = e.target.href;
                break;
            default: break;
        }

        this.record(
            null,
            function(fields) {
                fields['message'] = ['Resource(\''+ tagName +'\') not found: ', self.getClearPath(fileUrl)].join('');
            },
            {'category': 'resource'}
        );
    }
});

module.exports = ResourceErrorListener;