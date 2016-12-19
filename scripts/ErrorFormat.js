var objectAssign = require('./objectAssign');


var ErrorFormat = objectAssign.create({

    crossBrowserStackExp: {

        spaceMark: [
            /\s+at\s+/g
            , /\n+/g
        ],
        
        // every regxp must have four group( 1:fnName,2:fileName,3:rowNumber,4:columnNumber )
        infoGroup: [

            // fn@file:http://www.a.com:110:90
            // fn@http://www.a.com:110:90
            /^([\S\s]+?)@((?:file\:){0,1}[\S]+?)\:([-]*\d+)\:([-]*\d+)$/,

            // fn (http://www.a.com:110:90)
            , /^([\S\s]+?)\s\(([\S]+?)\:([-]*\d+)\:([-]*\d+)\)$/

            // fn@http://10.129.7.49:9999/target/20160602104029/et.js:1: IE8
            , /^([\S\s]+?)@([\S]+?)\:([-]*\d+)\:([-]*\d*)$/

            // no fnName :
            // http://stnew03.beisen.com/ux/tms-recruit/release/app/scripts/views/applicants/index-page-view-1606211918.min.js:3:2166
            , /^()(http[\S]+?)\:([-]*\d+)\:([-]*\d*)$/

            // local file, no fnName
            // @file:///C:/Users/144533/Desktop/%E8%81%98%E9%80%9A%E6%96%87%E6%A1%A3/%E5%8E…%E7%9A%84%E9%A1%B9%E7%9B%AE_files/selected-post-view-1606231029.min.js:1:1
            // @http://recruitv5.tms.beisen.com/Recruiting/ApplicantOverview/ApplicantDetai…=271686086&from=JobApplicantList&jobId=270007364&authtoken=1501221930:1:-1
            , /^()@([\S]+?)\:([-]*\d+)\:([-]*\d+)$/

            // Firefox, no column number
            // .redrawTable@http://stnew03.beisen.com/ux/tms-recruit/release/app/scripts/views/home/index-page-view-1608311758.min.js:4
            , /^([\S\s]+?)@([\S]+?)\:([-]*\d+)(?:\:)*([-]*\d*)$/
        ]
    },

    getErrorStack: function(e) {
        return e.stack || e.backtrace || e.stacktrace || '';
    },

    getStackList: function(errorStackStr){
        if(!errorStackStr) return [];
        
        var self = this;
        errorStackStr = errorStackStr.replace(/^[\s]*|[\s]*$/, '');
        
        var browserStackExp = self.crossBrowserStackExp;
        var stackList = [];

        for( var i=0; i<browserStackExp.spaceMark.length; i++ ){
            var spaceMark = browserStackExp.spaceMark[i];
            stackList = errorStackStr.split(spaceMark);
            if(stackList && stackList.length>1) return stackList;
        }

        // 没有通过堆栈分隔符分出多行堆栈, 返回单行
        stackList = [ errorStackStr ];

        return stackList
    },

    createFrame: function(frameInfo){
        frameInfo = frameInfo || {};
        var obj = {
            'fnName': frameInfo['fnName'] || '',
            'fileName': frameInfo['fileName'] || '',
            'lineNum': frameInfo['lineNum'] || '-1',
            'colNum': frameInfo['colNum'] || '-1',
            'ori': frameInfo['ori'] || '',
        };
        return obj;
    },

    getStackInfo: function(preStackStr){
        var self = this;

        var browserStackExp = self.crossBrowserStackExp;
        var stackInfo = null;

        for(var i=0; i<browserStackExp.infoGroup.length; i++){
            var infoGroupExp = browserStackExp.infoGroup[i];
            stackInfo = preStackStr.match(infoGroupExp);
            if( stackInfo && stackInfo.length > 4 ) return self.createFrame({
                'fnName': stackInfo[1] || '[anonymous]',
                'fileName': stackInfo[2],
                'lineNum': stackInfo[3],
                'colNum': stackInfo[4],
                'ori': preStackStr
            })
        }
        
        return null;
    },

    format: function(error){
        var self = this;
        var frames = [];
        
        var nativeStack = self.getErrorStack(error);
        var stackList = self.getStackList(nativeStack);
        
        for(var i = 0; i < stackList.length; i++) {
            var stackInfo = self.getStackInfo(stackList[i]);
            if(stackInfo) frames.push(stackInfo);
        }
        
        // 默认一个frame
        if(!frames.length) frames.push(this.createFrame());

        return {
            message: error.toString(),
            frames: frames,
            stack: nativeStack
        }
    },

    toString: function(){
        var self = this;
        var stackFrameStr = '';
        var framesStrList = [];
        for( var i=0; i< self.frames.length; i++ ){
            var frameObj = self.frames[i];
            // 未格式化成功
            if(!frameObj.hasFormated) {
                framesStrList.push(frameObj.ori);
            } else {
                framesStrList.push([
                    frameObj.fnName, '@',
                    '(', frameObj.fileName, ')', ':',
                    frameObj.lineNum, ':',
                    frameObj.colNum
                ].join(''))
            }
        }
        stackFrameStr += framesStrList.join(';');
        return stackFrameStr
    }
});

module.exports = ErrorFormat;