angular.module('services',[])
.factory('Message', function(localStorageService,$ionicLoading,$ionicPopup,$ionicActionSheet,$ionicModal,$rootScope,$timeout) {
	var dictionary=$rootScope.dictionary;
	var alertPopUp=null;
	var confirmPopUp=null;
	var promptPopUp=null
	var selectPopUp=null;
	var options=null;
	var modal=null;
	var alertFree=null
	var closeSelect=function(){
		angular.element(document.getElementsByClassName('modal-backdrop')[0]).unbind('click',closeSelect)
		if(selectPopUp)selectPopUp.close();
	}
	var closeAlertFree=function(){
		angular.element(document.getElementsByClassName('modal-backdrop')[0]).unbind('click',closeAlertFree)
		if(alertFree)alertFree.close();
	}
	return {
		setDictionary:function(dictionary){
			$rootScope.dictionary=dictionary
		},
		showLoading: function(texto){
			texto=texto || ""
			$ionicLoading.show({
      			template: '<div style="width: 28px;height: 28px;margin: auto;margin-bottom: 1vh;"><ion-spinner icon="android" class="spinner-dark"></ion-spinner></div>'+texto
   			});
		},
		hideLoading:function(){
			$ionicLoading.hide();
		},
         toast:function(msg){
         $cordovaToast.showShortBottom(msg);
         },
		alert:function(titulo,texto,funcion){
			
			funcion=funcion || function(){};
			if(alertPopUp)alertPopUp.close();
			alertPopUp = $ionicPopup.alert({
     			title: titulo,
     			template: texto,
				okText: $rootScope.dictionary.General[1],
				okType:"button",
   			});
   			alertPopUp.then(function(res) {
     			funcion();
   			});
		},
		prompt:function(titulo,texto,funcion,tipo,placeholder){
			tipo=tipo || "text";
			placeholder=placeholder || "";
			if(promptPopUp)promptPopUp.close();
			promptPopUp=$ionicPopup.prompt({
   				title: titulo,
   				template: texto,
   				inputType: tipo,
				cancelText:$rootScope.dictionary.General[2],
				cancelType:"button-default",
				okText:$rootScope.dictionary.General[1],
				okType:"button",
   				inputPlaceholder: placeholder
 			})
			promptPopUp.then(function(res) {
				if(!_.isUndefined(res))funcion(res);
 			});
		},
		alertTemplate:function(scope,template,title,buttons,clase){
			buttons=buttons ||[{ // Array[Object] (optional). Buttons to place in the popup footer.
				text: $scope.dictionary.General[2],
				type: 'button-default',
				onTap: function(e) {
					timePopUp.close();
				}
			  },] 
			if(alertFree)alertFree.close();
			alertFree=$ionicPopup.show({
  				title: title, 
				 cssClass: clase,
				templateUrl: template, // String (optional). The URL of an html template to place in the popup   body.
				scope: scope, // Scope (optional). A scope to link to the popup content.
			  buttons: buttons
			});
			$timeout(function(){
				angular.element(document.getElementsByClassName('modal-backdrop')[0]).bind('click',closeAlertFree)
			},300);
		},
		closeAlert:function(){
			closeAlertFree()
		},
		select:function(scope){
			
			if(selectPopUp)selectPopUp.close();
			selectPopUp=$ionicPopup.show({
  				//title: title, // String. The title of the popup.
				 cssClass: 'select-popup',
				templateUrl: 'screens/modal/select.html', // String (optional). The URL of an html template to place in the popup   body.
				scope: scope, // Scope (optional). A scope to link to the popup content.
			  buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
				text: $scope.dictionary.General[2],
				type: 'button-default',
				onTap: function(e) {
					timePopUp.close();
				}
			  },]
			});
			$timeout(function(){
			
			angular.element(document.getElementsByClassName('modal-backdrop')[0]).bind('click',closeSelect)
			},300);
		},
		closeSelect:function(){
			closeSelect()
		},
		confirm:function(titulo,texto,funcion,btn1,btn2,closable,callback){
			if(confirmPopUp)confirmPopUp.close();
			callback=callback || false
			btn1 = btn1 || $rootScope.dictionary.General[1];
    		btn2 = btn2 || $rootScope.dictionary.General[2];
			closable=closable||function(){return true};
			confirmPopUp = $ionicPopup.confirm({
     			title: titulo,
     			template: "<div>"+texto+"</div>"+
				'<div id="botones_confirm"></div>',
				buttons: [{ 
    				text: btn2,
    				type: 'button-default',
    				onTap: function(){
					  return 0;
					}
  				},{
    				text: btn1,
    				type: "button",
    				onTap: function(){
						return 1;
					}
  				}]
   			});
			if(!closable())$timeout(function(){
				$(".popup-buttons").addClass("ng-hide");
				$(".popup-visible").removeClass("ng-hide");
			},10);
			confirmPopUp.then(function(res) {
			if(res) {
				confirmPopUp.close();
				funcion(res);
			} else {
				if(callback)funcion(res);
				confirmPopUp.close();
			}
		})
		},
		showActionSheet:function(title,buttons,destructive,cancel,result){
			var settings={
     			buttons: buttons,
				 buttonClicked: function(index) {
				   result(index,buttons[index])
				   options();
				 },
				 cancel:function(){
					 result(-1,null)
				 }
   			}
			if(cancel)settings.cancelText=cancel
			if(title)settings.titleText=title
			if(destructive){
				settings.destructiveText=destructive.text
				settings.destructiveButtonClicked=function(){
					options();
					destructive.funcion(destructive)
				}
			}
			 options = $ionicActionSheet.show(settings);
		},
		showModal:function(template,direction,scope){
			var direction=direction || ''
			var scope=scope || $rootScope
			switch(direction){
				case 'left':direction='slide-in-left'
				break;
				case 'right': direction='slide-in-right'
				break;
				case 'up': direction='slide-in-down'
				break;
				case 'none': direction='slide-in-down'
				break;
				default: direction='slide-in-up'
				break
			}
			 $ionicModal.fromTemplateUrl(template, {
				scope: scope,
				animation: direction,
				hardwareBackButtonClose:false
			  }).then(function(mod) {
				  if(modal!=null)modal.hide();
    			modal = mod;
				modal.show();
  			});
			  
		},
		hideModal:function(){
			if(modal){
				modal.hide();
				modal.remove();
			}
		}
	}

})