(function(){
    define([
        '../../../../app',
    ], function(app) {
        'use strict';
        
        app.directive('dropContainer',function(){
            return {
                restrict: "E",
                replace: true,
                scope: {},
                link: function(scope,element,attr){
                    //turn off automatic creation of editor
                    CKEDITOR.disableAutoInline = true;

                    element.on("dragover",containerDragOver);
                    element.on("drop",containerDrop);
                    element.on("dragleave",containerLeave);

                    function containerDragOver(event){
                        if(event.target.className.indexOf( "adjacent-block") !== -1)
                            event.target.style.border = "1px solid #b1e0ec";
                        event.preventDefault();
                    }

                    function containerDrop(event){
                        scope.tranformElement(event);
                    }

                    function containerLeave(event){
                        if(event.target.className.indexOf("adjacent-block")!== -1)
                            event.target.style.border = "";
                    }
                },
                templateUrl: '/src/create_template/directive/templates/drop-template.html',
                controller: ['$scope','$rootScope',dropController]
            }

            function dropController($scope,$rootScope){
                
                $scope.selectedElement = {};
                $scope.showDelete = false;

                var pluginsList =  "templates,smiley,newpage,iframe,flash,forms,selectall,copyformatting,language,find,list";
                $scope.tranformElement = function(event) {
                    var data ;
                    if(event.originalEvent){
                        data = JSON.parse(event.originalEvent.dataTransfer.getData("data")); 
                    }else{
                        data = JSON.parse(event.dataTransfer.getData("data"));
                    }

                    // to check if the element can be dropped at the position
                    var allowDrop= $scope.isDroppable(event.target,data);

                    if((allowDrop)){ 
                        if(data.id){
                            var appendHtml = '<tr>\
                            <td align="center" valign="top">\
                                <table border="0" cellpadding="20" cellspacing="0" width="100%" id="emailFooter">\
                                    <tr>\
                                        <td align="center" class="drop-div" valign="top">\
                                            </td>\
                                        </tr>\
                                    </table>\
                                </td>\
                            </tr>';
                            $("#emailContainer > tbody").append(appendHtml);
                        }else{ 
                            //var appendedDiv = "<"+ data.element+" class = '"+ data.className +"' contenteditable='" + (data.editable|| "true") +"'>" + (data.text || "Demo text" )+ "\
                            //</"+ data.element+">";
                            var appendedDiv = ' <table border="0" cellpadding="0" class="befor-final" cellspacing="0" width="100%" style="min-width:100%;">\
                            <tbody>\
                                <tr>\
                                    <td valign="top">\
                                        <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">\
                                        <tr>\
                                        <td valign="top" width="600" style="width:600px;">\
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" >\
                                            <tbody><tr>\
                                                <td valign="top" style="">' + data.template +
                                                '</td>\
                                            </tr>\
                                        </tbody></table>\
                                        </td>\
                                        </tr>\
                                        </table>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table> </div>';
                            //var appendedDiv = data.template;
                            if((event.target.className.indexOf("drop-div")!== -1) ){    
                                appendedDiv = '<div class="dropped-block">' + appendedDiv + '</div>'
                                var string = "<div class='adjacent-block dropped-block'> </div>" + appendedDiv ;
                                $(event.target).append(string);
                            }else if(event.target.className.indexOf("adjacent-block")!== -1) {
                                event.target.style.border = "";
                                $(event.target).append(appendedDiv);
                                $(event.target).after("<div class='adjacent-block dropped-block'> </div>");
                                $(event.target).before("<div class='adjacent-block dropped-block'> </div>");
                            }

                            var allElements = $('.editThis');
                            
                            for (var i = allElements.length - 1; i >= 0; i--) {
                                if(allElements[i].className.indexOf("cke_editable") == -1)
                                    CKEDITOR.inline(allElements[i],{
                                        removePlugins: pluginsList,
                                        removeDialogTabs: 'flash:advanced',
                                        on:{
                                            drop: function(event){
                                                return false;
                                        }
                                    }
                                });
                            }
                        }
                        var innerBlock = $('.dropped-element');
                        var outerBlocks = $('.drop-div');
                        clickEvents(innerBlock);
                        clickEvents(outerBlocks);
                        
                    }else{
                        event.preventDefault();
                        return;
                    }
                }

                function clickEvents(divs){
                    divs.unbind();
                    angular.forEach(divs, function(block){
                        $(block).on('click',$scope.getSelectedElement);
                    },false);
                }

                // function isParentDropper(element){
                //     var is_parent_dropper = false;
                //     while(element){
                //         if(element.id.indexOf("dropper")!==1){
                //             is_parent_dropper = true;
                //             break;
                //         }else if(element.id.indexOf("dropper")!==1)
                //             break;
                //     }
                //     return is_parent_dropper;
                // }

                $scope.isDroppable  = function(target,data){
                    var id = target.id;
                    var className = target.className;
                    var allowDrop = false;
                    if(data.id){
                        if(target.children[0].id === "emailContainer")
                            allowDrop = true;
                    }else {
                        allowDrop = true;   
                    }
                    return allowDrop;
                }
                
                $scope.dragOverContainer = function(event){
                    var data = JSON.parse(event.originalEvent.dataTransfer.getData("data"));   
                    if(data.id){
                        event.preventDefault();
                    }                    
                }

                $scope.dragOverElement = function(event){
                    var data = JSON.parse(event.originalEvent.dataTransfer.getData("data"));   
                    if(!data.id){
                        event.preventDefault();
                    }
                }
                
                function getParentDiv(element){
                    while(element && element.className.indexOf("dropped-element")== -1) {
                        element = element.parentElement;
                    }
                    return element
                }

                $scope.getSelectedElement = function(event){
                    removeOtherSelectedDivs();
                    if(event.target.className.indexOf("drop-div")!==-1){
                        $scope.selectedElement = event.target;
                        if($scope.selectedElement.className.indexOf("drop-div")!== -1){
                            event.currentTarget.style.border = "1px solid #00AD9C";
                        }
                    }else{
                        var element = getParentDiv(event.target);
                        if(element){
                            $scope.selectedElement = element;
                            console.log($scope.selectedElement);
                        }
                    }
                    console.log($scope.selectedElement);
                    $rootScope.$emit("myEvent",$scope.selectedElement);
                    $scope.$digest();
                }

                function removeOtherSelectedDivs(){
                    var otherDivs = $('.drop-div');
                    angular.forEach(otherDivs,function(div){
                        div.style.border = "";
                    });
                }
            }        
        })
    });
})()