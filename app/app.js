define(['angular','ngDrag','uiRouter','bootstrapUi','angularSidebar','angularSanitize','colorPicker','angular-animate','angular-touch',
'bootstrapUi'],function(angular){
    //var app = angular.module('myApp',['ui.router','ui.bootstrap']);
    var app = angular.module('myApp',['ui.router','ui.bootstrap']);
    

    app.init = function(){
        console.log("App bootstrapped");
        angular.bootstrap(document, ['myApp']);
    }
    
    app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        console.log("app config")
        $stateProvider.state({
            name: 'home',
            url: '/',
            controller: 'home.controller',
            templateUrl: "./src/home/template/home.html"
        }).state({
            name: 'template',
            url: '/create_template',
            controller: "template.controller",
            templateUrl: "./src/create_template/template/create_template.html"
        }).state({
            name: 'other',
            url: '/other_page',
            template: "<h1>Some template</h1>"
        })

        $urlRouterProvider.otherwise('/');
    }]);
    return app;
})