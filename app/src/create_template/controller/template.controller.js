define(['../../../../app'],function(app){
    "use strict";

    app.controller('template.controller',['$scope',callback]);

    function callback($scope){
        $scope.editMode = false;
    }
});

// function callback($scope){
    //     $scope.editmode=false;
    //     $scope.selectedElement={};
    //     $scope.allElementProperties = {};
    //     $scope.specificProperties = {};

    //     var element = angular.element(document.querySelector('.drop-zone'));
    //     element.on('drop',function(event){
    //         if(event.target.className !== "drop-zone"){
    //             event.preventDefault();
    //             return false;
    //         }
    //         var obj= {};
    //         var data = JSON.parse(event.originalEvent.dataTransfer.getData("data"));
    //         var dropElement = document.createElement(data.type);
    //         dropElement.className = "editable";
    //         for (var prop in data.properties){
    //             dropElement.style[prop] = data.properties[prop];
    //         }
    //         dropElement.style.top = obj.top =((event.pageY/window.innerHeight)*100)+ "px";
    //         if(data.type == "h1"){
    //             dropElement.innerHTML = obj.innerHTML = data.innerHTML || "";
    //         }else if(data.type== "img"){
    //             dropElement.src = obj.src = "/src/create_template/images/noimage.jpg";          
    //         }
    //         dropElement.editProperties = data.properties;
    //         dropElement.specificProperties = obj;
    //         event.target.appendChild(dropElement);
    //         addingEvents();
    //     });

    //     element.on('dragover',function(event){
    //         event.preventDefault();    
    //     })

    //     function addingEvents(){
    //         $('.editable').off('click');
    //         $('.editable').on("click",function(e){
    //             $scope.editmode = true;
    //             $scope.allElementProperties = this.editProperties;
    //             $scope.specificProperties = this.specificProperties;
    //             $scope.$digest();
    //             $scope.selectedElement = this;
    //             $('#inner_text').val(this.innerHTML);
    //             $("#color").val(this.style.color || "#000");
    //         })
    //     }

    //     $scope.save = function() {
    //         for (var key in $scope.allElementProperties){
    //             $scope.selectedElement.style[key]=$scope.selectedElement.editProperties[key]=$("#"+key).val();
               
    //         }
    //         for (var key in $scope.specificProperties){
    //             $scope.selectedElement[key]=$scope.selectedElement.specificProperties[key]=$("#"+key).val();
    //         }
    //         $scope.editmode = false;
    //     }

    //     $scope.delete = function() {
    //         $($scope.selectedElement).off('click');
    //         $scope.selectedElement.remove();
    //         $scope.editmode = false;
    //     }
    // }