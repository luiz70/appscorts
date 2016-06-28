angular.module('controllers')
.controller('General', function($scope,$rootScope,Memory,Message) {
	$rootScope.fromLogin=false;
	$rootScope.Usuario=Memory.get("Usuario");
	$rootScope.lock=function(){
		/*if(!$rootScope.fromLogin)Message.showModal("screens/modal/lock.html","none");
		else $rootScope.fromLogin=false;*/
	}
	$rootScope.$watch("Usuario",function(newv,oldv){
		if(newv){
			Memory.set($rootScope.Usuario)
		}
	},true)
	
})