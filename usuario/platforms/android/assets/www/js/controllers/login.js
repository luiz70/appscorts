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
		/*$rootScope.Usuario="loquesea";
		Memory.set("Usuario",$rootScope.Usuario);
		$rootScope.fromLogin=true;
		$ionicViewSwitcher.nextDirection('forward');
		$state.go('app.home');*/
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
		/*if(!$scope.user.user || $scope.user.password.length<6)Message.alert($rootScope.dictionary.Login[5],$rootScope.dictionary.Login[6],function(){});
		else{
			Message.showLoading("");
			Memory.clean();
			$http({method: 'Post', url: 'http://45.40.137.37:88/login', data: $scope.user,timeout :15000})
			.success(function(data){
				Message.hideLoading();
				if(data.IdUser){
					Memory.set("User",data);
					$rootScope.User=data;
					$ionicViewSwitcher.nextDirection('forward');
					$state.go('app.home');
				}else{
					
					Message.alert($rootScope.dictionary.Login[5],$rootScope.dictionary.Login[6],function(){});
				}
		/*	Message.showLoading($rootScope.idioma.Login[8]);
			Memory.clean();
			var us=Usuario.login($scope.login)
			if(us){
			us.success(function(data){
				
				if (data.error){
					Message.hideLoading();
					Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.Login[7],function(){
					$scope.login.Contrasena="";
					});
				}else{
					$rootScope.Usuario=data;*/
					/*$timeout(function(){
						Message.hideLoading();
						$ionicViewSwitcher.nextDirection('forward');
						$state.go('app.home');
					},3000)*/
				/*}
				
			})
			.error(function(){
				Message.hideLoading();
				Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.General[7],function(){
				});
				
			})
			}else{
				Message.hideLoading();
				Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.General[7],function(){
				});
			}*/
			/*})
			.error(function(){
				Message.hideLoading();
				Message.alert($rootScope.dictionary.Login[5],$rootScope.dictionary.Login[6],function(){});
				
			})
		}*/
	}
	
})