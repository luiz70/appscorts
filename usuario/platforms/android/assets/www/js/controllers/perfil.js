angular.module('controllers')
.controller('Perfil', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	$scope.perfilUsuario=$state.params.user;
	$scope.back=$state.params.back;
	$scope.added=false;
	$scope.showImage=false;
	$scope.imgShowImage=0;
	$scope.precios=function(){
		Message.alert("Precios","<div class='precio-perfil' style='margin-top:2vh;'>Cena: $3,000</div><div  class='precio-perfil'>Compañia completa: $8,000</div>");
	}
	$scope.like=function(){
		$scope.added=true;
	}
	$scope.chat=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.chat",{user:$scope.perfilUsuario});
	}
	$scope.openimg=function(id){
		$scope.showImage=true;
		$scope.imgShowImage=id;
	}
	$scope.closeImg=function(){
		$scope.showImage=false;
	}
	$scope.goBack=function(){
		$ionicViewSwitcher.nextDirection('back');
		if($scope.back==null)$state.go("app.home");
		else $state.go($scope.back,{user:$scope.perfilUsuario});
	}
})