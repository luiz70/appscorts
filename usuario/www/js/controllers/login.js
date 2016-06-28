angular.module('controllers')
.controller('Login', function($scope,$rootScope,$timeout,$ionicViewSwitcher,$state,Message,Memory,$http) {
	$scope.Login={
		Correo:"",
		Contrasena:""
	}
	$scope.$on('$ionicView.beforeEnter',function(){
		if(Memory.get("Usuario")){
		$ionicViewSwitcher.nextDirection('enter');
		$state.go('app.home');
	}
		
	})
	$scope.$on('$ionicView.afterEnter',function(){
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
			
			
    })
	$scope.login=function(){
		if(!$scope.Login.Correo || $scope.Login.Correo=="")
		Message.alert("Iniciar sesión","Debe propocionar su correo electrónico registrado para iniciar sesión");
		else if(!$scope.Login.Contrasena || $scope.Login.Contrasena=="" )
		Message.alert("Iniciar sesión","Debe propocionar su contraseña para iniciar sesión");
		else {
			Message.showLoading("Iniciando sesión...")
			$http({method: 'Post', url: $rootScope.config.http.getUrl()+"login/cliente",data:$scope.Login, timeout :15000})
			.success(function(respuesta){
				Message.hideLoading()
				if(respuesta.Error){
					Message.alert("Iniciar sesión",respuesta.Mensaje,function(){
						$scope.Login.Contrasena="";
					});
				}else
					Memory.set("Usuario",respuesta.Usuario);
					$rootScope.fromLogin=true;
					$ionicViewSwitcher.nextDirection('forward');
					$state.go('app.home');
					
				
			})
		}
		
	}
	
})