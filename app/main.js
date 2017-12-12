'use strict'

require.config({
    baseUrl: "js",
    paths: {
        'jquery': '/modules/jquery.min',
        'angular': 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular.min',
        'ngDrag': '/modules/angular-drag-drop.min',
        'uiRouter': '/modules/angular-ui.min',
        'bootstrap': "/modules/boostrap.min",
        'ckEditor':'/modules/ck-editor',
        'angularModal': '/modules/angular-modal.min',
        'angularSanitize': 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular-sanitize.min',
        'angularSidebar': '/modules/sidebar-angular',
        'colorPicker': '/modules/color-picker.min',
        'bootstrapUi' : 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap.min',
        'angular-animate':'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular-animate.min',
        'angular-touch':'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular-touch.min'
    },
    shim: {
        'angular': {
            'exports': 'angular',
        },
        'jquery': {
            'exports': 'jquery'
        },
        'ngDrag': {
            deps:['jquery','angular'],
            exports: 'angular'
        },
        'uiRouter': {
            deps:['angular']
        },
        'bootstrap':{
            deps:['jquery']
        },
        'angular-animate': {
            deps:['angular']
        },
        'bootstrapUi': {
            deps:['jquery','angular','angular-animate','angular-touch'],
            exports: 'angular'
        },
        'angular-touch': {
            deps: ['angular']
        },
        'angularSanitize':{
            deps: ['angular']
        },
        'ckEditor': {
            deps:['jquery']
        },

        'angularSidebar':{   
            deps:['angular']
        },
        'angularModal': {
            deps: ['angular']
        },
        'colorPicker': {
            deps: ['angular']
        }
        
    }
})

define(['angular',
         '../app',
         './src/home/controller/home.controller.js',
         './src/create_template/controller/template.controller.js',
         './src/create_template/directive/drag.directive.js',
         './src/create_template/directive/drop.directive.js'],function(angular,app){
            angular.element(function(){
            app.init();
        })
})