angular.module('controllers')
.controller('Recuperar', function($scope,$rootScope,$timeout,$ionicViewSwitcher,$state,Message,Memory,$http) {
	$scope.$on('$ionicView.afterEnter',function(){
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
			
			
    })
	
	$scope.Recuperacion={
		Correo:($state.params.Correo)?$state.params.Correo:""
	}
	
	$scope.recuperar=function(){
		if($scope.Recuperacion.Correo!=""){
			Message.showLoading("Recuperando contraseña...")
			$timeout(function(){
				Message.hideLoading();
				Message.alert("Recuperación de contraseña","Hemos enviado un correo electrónico con las sencillas instrucciones para recuperar tu contraseña.");
				
			},2000);
		}else
		Message.alert("Recuperación de contraseña","Ingresa tu correo electrónico registrado para recuperar tu contraseña.")
	}
	if($scope.Recuperacion.Correo!=""){
		Message.showLoading("Recuperando contraseña...")
		$scope.recuperar();
	}
})