define([
    '../../../../app'
], function(app) {
    'use strict';
    return app.factory('HeaderFactory',function(){
        var dataObj = {
            type: "h1",
            properties: {
                "position": "relative",
                "color": "#000",
                "top": ""
            },
            "innerHTML": "Some value"
        }
        return dataObj;
    });
});