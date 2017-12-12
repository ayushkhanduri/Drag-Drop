(function(){
    define(['../../../../app'],function(app){
        
        app.directive('dragContainer',[function(){
            return {
                restrict: "E",
                replace: false,
                scope: {},
                templateUrl:"/src/create_template/directive/templates/drag-template.html",
                controller: function($scope,$rootScope,$timeout,$http,$uibModal){
                    $scope.showEditPanel = false;
                    $scope.richText = false;
                    $scope.selectedElement = {};
                    $scope.someDefaultValues = {};
                    $scope.currentPage = 1;
                    $scope.pageSize = 100;
                    //var pluginsList =  "templates,smiley,newpage,iframe,flash,forms,selectall,copyformatting,language,find,list";
                    var pluginsList = "flash,language,iframe,smiley";
                    CKEDITOR.replace( 'editor1',{
                        removePlugins: pluginsList,
                        allowedContent: true 
                    } );
                    
                    $rootScope.$on('myEvent',function(event,data){
                        $scope.selectedElement = data;
                        $scope.showEditPanel = true;
                        if($scope.selectedElement.className.indexOf("htmlClass")!== -1){
                            console.log($scope.selectedElement.innerHTML);
                            CKEDITOR.instances['editor1'].setData($scope.selectedElement.innerHTML)                            
                            $scope.richText = true;        
                        }else{
                            $scope.setObjectValues(getComputedStyle(data));
                        }
                        $scope.$digest();
                    }); 

                    function rgb2hex(rgb){
                        if(rgb== "rgba(0, 0, 0, 0)")
                            return "#ffffff";
                        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                        return (rgb && rgb.length === 4) ? "#" +
                         ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                         ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                         ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
                    }

                    $scope.setObjectValues = function(style){
                        if($scope.selectedElement.className.indexOf("imageClass")!== -1){
                            $scope.imageSelection = true;
                            console.log($scope.selectedElement.parentElement.href);
                            $scope.someDefaultValues = {
                                Src: $scope.selectedElement.src,
                                Width: $scope.selectedElement.width,
                                Height: $scope.selectedElement.height,
                                Href: $scope.selectedElement.parentElement.href || "http://"
                            }
                            $scope.getImages();
                        }else if(!$scope.richText){
                            var specificProps = {};
                            $scope.someDefaultValues = {
                                PaddingTop: style.paddingTop,
                                PaddingRight: style.paddingRight,
                                PaddingBottom: style.paddingBottom,
                                PaddingLeft: style.paddingLeft,
                                MarginTop: style.marginTop,
                                MarginRight: style.marginRight,
                                MarginBottom: style.marginBottom,
                                MarginLeft: style.marginLeft
                            }
                            if($scope.selectedElement.localName === "div"){
                                specificProps = {
                                    BackgroundColor: rgb2hex(style.backgroundColor),
                                    MinHeight: style.minHeight
                                };
                            }else if($scope.selectedElement.localName=== 'h1'){
                                specificProps= {
                                    TextAlign: style.textAlign,
                                    BackgroundColor: rgb2hex(style.backgroundColor)
                                }
                            }
                            $scope.someDefaultValues = jQuery.extend($scope.someDefaultValues,specificProps);
                        }
                    }

                    $scope.changeImageSource = function(event,source) {
                        
                        console.log(event.target);
                        var newWidthHeight = calculateAspectRatioFit($scope.someDefaultValues.Width,$scope.someDefaultValues.Height,event.target.naturalWidth,event.target.naturalHeight);
                        $scope.selectedElement.src= source;
                        $scope.someDefaultValues.Src = source;
                    }

                    function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
                        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
                        return { width: srcWidth*ratio, height: srcHeight*ratio };
                    }

                    $scope.getImages = function() {
                        $http.get('/src/create_template/directive/image.json').then(function(res){
                            if(res.status===200){
                                console.log(res.data);
                                $scope.allImages =[];
                                angular.forEach(res.data,function(item){
                                    angular.forEach(item.images,function(image){
                                        $scope.allImages.push(image.src);
                                    })
                                });
                                $scope.changePage(0);
                            }

                        });
                    }

                    $scope.sendMail = function() {
                        var allText = $("#drop-container")[0].innerHTML;
                        allText = '<html xmlns="http://www.w3.org/1999/xhtml">\
                        <head>\
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\
                            <title></title>\
                            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\
                        </head>\
                        <body style="margin: 0; padding: 0; background-color: #ffffff; color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 14px;">' + allText +
                        '</body></html>';

                        allText = allText.replace(/contenteditable/g,"");
                        $http.post('/sendMail',{allText}).success(function(res){
                            if(res.status== 200)
                                alert("completed!");
                        });
                    }

                    function searchForParent(element){
                        while(element && element.className.indexOf("dropped-block")== -1) {
                            element = element.parentElement;
                        }
                        return element
                    }

                    $scope.delete = function(){
                        if($scope.selectedElement.className.indexOf("drop-div")!==-1) {
                            $($scope.selectedElement).remove();
                        }else{
                            $scope.selectedElement = searchForParent($scope.selectedElement);
                            $($scope.selectedElement).prev().remove();
                            $($scope.selectedElement).remove();
                        }
                        $scope.closeAllPanels();
                    }

                    function capsFirstLetter(string){
                        return string.charAt(0).toLowerCase() + string.slice(1);
                    }

                    $scope.closeAllPanels = function(){
                        $scope.showEditPanel = false;
                        $scope.richText = false;
                        $scope.imageSelection = false;
                        $scope.allImages = null;
                    }
            
                    $scope.numberOfPages=function(){
                        return Math.ceil($scope.allImages.length/$scope.pageSize);                
                    }

                    $scope.changePage = function(num) {
                        $scope.currentPage += num;
                        var currentData = $scope.currentPage * $scope.pageSize;
                        $scope.showImages = $scope.allImages.slice(currentData-$scope.pageSize , currentData);
                    }
                    $scope.save = function(){
                        if($scope.richText){
                            $scope.selectedElement.innerHTML = CKEDITOR.instances.editor1.getData();
                        }else if($scope.selectedElement.className.indexOf('imageClass')!== -1){
                            for(key in $scope.someDefaultValues){
                                if(key === "Href"){
                                    $scope.selectedElement.parentElement[capsFirstLetter(key)] = $scope.someDefaultValues[key];
                                }else{
                                    $scope.selectedElement[capsFirstLetter(key)] = $scope.someDefaultValues[key];
                                }
                            }
                        }else{
                            for(key in $scope.someDefaultValues){
                                $scope.selectedElement.style[capsFirstLetter(key)] = $scope.someDefaultValues[key];
                            }
                        }
                        $scope.closeAllPanels();                   
                    }
                }
                //template: "<div id='elements-container'> <h1 style='text-align:center;'> Elements </h1><header-drag> </header-drag> <image-drag> </image-drag></div>"
            }
        }]);

        app.directive('headerDrag',[function(){
            return {
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs) {
                    var metaData =  {
                        element: "h1",
                        className: "headerClass dropped-element editThis",
                        template: '<h1 class="headerClass dropped-element editThis" style="color: #222222;\
                        font-family: Helvetica;\
                        font-size: 40px;\
                        margin: 0px;\
                        font-style: normal;\
                        font-weight: bold;\
                        line-height: 150%;\
                        letter-spacing: normal;\
                        background:#fff;\
                        text-align: center;" contenteditable>Fizz Express!</h1>'
                    }
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                    });
                },
                template: "<div class='images'> <img id='header' draggable='true' title='Header' src='/src/create_template/images/head.svg' width='65' height='65'> </img> </div>"
            }
        }]);

        app.directive('parahDrag',[function(){
            return {
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs) {
                    var metaData =  {
                        element: "p",
                        className: "parahClass dropped-element editThis",
                        template: '<div> <p class="parahClass dropped-element editThis" contenteditable>Demo text</p> </div>'
                    }
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }                    
                    });
                },
                template: "<div class='images'><img id='parah' draggable='true' title='Paragraph' src='/src/create_template/images/parah.svg' width='65' height='65'> </img> </div>"
            }
        }]);

        app.directive('logoDir',[function(){
            return {
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs) {
                    var metaData =  {
                        element: "p",
                        className: " dropped-element",
                        template: '<div class="dropped-element" ><img style= "display:block;margin:0 auto;" src="https://d14sm6a273ku3g.cloudfront.net/0bfce9b27d84ee49355747a28f0345b1.png" contenteditable> </img></div>'
                        //template: '<div> <p class="parahClass dropped-element editThis" contenteditable>kjnjknjknjkn</p> </div>'
                    }
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }                    
                    });
                },
                template: "<div class='images'><img id='logo' draggable='true' title='Logo' src='/src/create_template/images/parah.svg' width='65' height='65'> </img> </div>"
            }
        }]);

        app.directive('imageDrag',[function(){
            return{
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs){
                    var metaData = {
                        element: "img",
                        className: "imageClass dropped-element",
                        editable: "false",
                        text: " ",
                        template: "<a href='www.google.com' contenteditable> <img class='imageClass dropped-element' src='/src/create_template/images/image.svg' width='100%' height='200' > </img> </a>"
                    };
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                    });
                },
                template: "<div class='images'><img id='image' draggable='true' title='Image' src='/src/create_template/images/image.svg' width='65' height='65'> </img> </div>"
            }
        }]);

        app.directive('horizontalLineDrop',[function(){
            return{
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs){
                    var metaData = {
                        element: "hr",
                        className: "horizontalClass  dropped-element",
                        template: "<hr class='horizontalClass dropped-element' contenteditable>"
                    };
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                    });
                },
                template: "<div class='images'><img id='horizontal' draggable='true' title='Horizontal Line' src='/src/create_template/images/divider.svg' width='65' height='65' contenteditable> </img></div>"
            }
        }]);

        app.directive('htmlDrop',[function(){
            return{
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs){
                    var metaData = {
                        element: "div",
                        className: "htmlClass dropped-element",
                        editable: "false",
                        text: "",
                        template: "<div class='htmlClass dropped-element'> Demo Text </div>"
                    };
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                    });
                },
                template: "<div class='images'><img id='html' draggable='true' title='<HTML/>' src='/src/create_template/images/html.svg' width='65' height='65'> </img> </div>"
            }
        }]);

        app.directive('cardTemplate',[function(){
            return{
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs){
                    var metaData = {
                        element: "div",
                        className: "htmlClass dropped-element",
                        editable: "false",
                        text: "",
                        template: "<div class='htmlClass dropped-element'> Demo Text </div>"
                    };
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                    });
                },
                template: "<div class='images'><img id='card-template' draggable='true' title='Card-Template' src='/src/create_template/images/html.svg' width='65' height='65'> </img> </div>"
            }
        }]);

        app.directive("footerTemplate",[function(){
            return{
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs){
                    var metaData = {
                        // element: "div",
                        // className: "htmlClass dropped-element",
                        // editable: "false",
                        // text: "",
                        template: '<div class="static-footer htmlClass dropped-element" ><div style="width: 250px; margin: 0 auto; border-bottom: 1px solid #000;">\
                        <p style="text-align: center; font-style: italic; padding: 0">\
                        <a href="https://www.fizzexpress.com" target="_blank" style="color: #000; text-decoration: none;" title="www.fizzexpress.com">www.fizzexpress.com</a>\
                        </p>\
                    </div>\
                    <ul style="margin: 0; padding: 20px 0 0 0; list-style: none; text-align: center;">\
                        <li style="padding: 0 10px; display: inline-block;">\
                            <a href="http://facebook.com/fizzexpress" target="_blank">\
                                <img src="https://s3.amazonaws.com/silverpushcdn/mailer_promotion/facebook.png" alt="Facebook" title="Facebook" style="vertical-align: middle;" />\
                            </a>\
                        </li>\
                        <li style="padding: 0 10px; display: inline-block;">\
                            <a href="http://twitter.com/fizzexpress" target="_blank">\
                                <img src="https://s3.amazonaws.com/silverpushcdn/mailer_promotion/twitter.png" alt="Twitter" title="Twitter" style="vertical-align: middle;" />\
                            </a>\
                        </li>\
                        <li style="padding: 0 10px; display: inline-block;">\
                            <a href="https://www.instagram.com/fizzexpress/" target="_blank">\
                                <img src="https://s3.amazonaws.com/silverpushcdn/mailer_promotion/instagram.png" alt="Instagram" title="Instagram" style="vertical-align: middle;" />\
                            </a>\
                        </li>\
                    </ul></div>'
                       
                    };
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                    });
                },
                template: "<div class='images'><img id='static-footer' draggable='true' title='Static Footer' src='/src/create_template/images/footer.svg' width='65' height='65'> </img> </div>"
            }
        }]);

        app.directive('headerDiv',[function(){
            return {
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs){
                    var metaData = {
                        element: "div",
                        className: "drop-div dropped-block",
                        id: "header-div"
                    }

                    element.on('dragstart',function(e){
                        ////console.log(e);
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                        ////console.log(e.originalEvent.dataTransfer);
                    })
                },
                template: "<div class='images'><img id='header-container' title='Header-block' draggable='true' src='/src/create_template/images/blocks.svg' width='65' height='65'> </img></div>"
            }
        }]);

        app.directive('bodyDiv',[function(){
            return {
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs){
                    var metaData = {
                        element: "div",
                        className: "drop-div dropped-block",
                        id: "body-div",
                        template: "<div style='min-height:300px' class='drop-div dropped-block'> </div>"
                    }
                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                    })
                },
                template: "<div class='images'><img id='body-container' title='Body-block' draggable='true' src='/src/create_template/images/blocks.svg' width='65' height='65'> </img></div>"
            }
        }]);

        app.directive('footerDiv',[function(){
            return {
                restrict: "E",
                replace: false,
                scope: {},
                link: function(scope,element,attrs){
                    var metaData = {
                        element: "div",
                        className: "drop-div dropped-block",
                        id: "footer-div"
                    }

                    element.on('dragstart',function(e){
                        if(e.originalEvent){
                            e.originalEvent.dataTransfer.setData("data",JSON.stringify(metaData));
                        }else{
                            e.dataTransfer.setData("data",JSON.stringify(metaData));
                        }
                    })
                },
                template: "<div class='images'><img id='footer-container' title='Footer-block' draggable='true' src='/src/create_template/images/blocks.svg' width='65' height='65'> </img></div>"
            }
        }]);
 
    });
})()