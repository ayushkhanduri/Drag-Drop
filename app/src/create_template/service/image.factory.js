define([
    '../../../../app'
], function(app) {
    'use strict';
    return app.factory('ImageFactory',function(){
        var dataObj = {
            type: "img",
            properties: {
                "height": "100px",
                "width": "100px"
            }
        }
        return dataObj;
    });
});