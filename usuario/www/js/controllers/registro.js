angular.module('controllers')
.controller('Registro', function($scope,$rootScope,$timeout,$ionicViewSwitcher,$state,Message,Memory,$http) {
	$scope.$on('$ionicView.afterEnter',function(){
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
			
			
    })
	$scope.Registro={
		Correo:"",
		Contrasena:"",
		Contrasena2:""
	}
	$scope.registra=function(){
		if(!$scope.Registro.Correo || $scope.Registro.Correo.length<2){
			Message.alert("Registro","El correo electrónico es obligatorio para crear una cuenta nueva.",function(){
			})
		}else if($scope.RegistroContrasena=="" ){
			Message.alert("Registro","La contraseña es obligatoria para crear una cuenta nueva.",function(){
			})
		}else if($scope.Registro.Contrasena.length<8){
			Message.alert("Registro","La contraseña debe contener al menos 8 dígitos.",function(){
			})
		}else if($scope.Registro.Contrasena!=$scope.Registro.Contrasena2){
			Message.alert("Registro","Las contraseñas no coinciden",function(){
			})
		}else{
			Message.showLoading("Registrando...");
			$http({method: 'Post', url: $rootScope.config.http.getUrl()+"registro/cliente",data:$scope.Registro, timeout :15000})
			.success(function(respuesta){
				Message.hideLoading()
				
				if(respuesta.Error){
					if(respuesta.Tipo){
						Message.confirm("Registro",respuesta.Mensaje,function(res){
							if(res){
							$ionicViewSwitcher.nextDirection('forward');
							$state.go('recuperar',{Correo:$scope.Registro.Correo});
							}else $scope.Registro.Correo="";
						},"Si","No",false,true)
					}else{
						Message.alert("Registro",respuesta.Mensaje);
					}
				}else
				Message.alert("Registro",respuesta.Mensaje,function(){
					Memory.set("Usuario",respuesta.Usuario);
					$rootScope.fromLogin=true;
					$ionicViewSwitcher.nextDirection('forward');
					$state.go('app.home');
				});
					
				
			})
		}
	}
})