angular.module('controllers')
.controller('Menu', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	$scope.cierraAjustes=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.home")
	}
	$scope.abreCuenta=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.cuenta")
	}
	$scope.abrePago=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.pago")
	}
	$scope.abrePreferencias=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.preferencias")
	}
	
	$scope.abreTerminos=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.terminos")
	}
//Message.showModal("/screens/modal/informacion.html");
	$scope.abreInformacion=function(){
		Message.showModal("/screens/modal/informacion.html");
	}
	$scope.logout=function(){
		Message.confirm("Cerrar sesión","¿Desea cerrar la sesión?",function(){
		Message.hideModal();
		Message.showLoading("Cerrando sesión");
		$timeout(function(){
			$rootScope.Usuario=null;
			Memory.clean();
			$state.go("login")
			Message.hideLoading();
		},1000)
		})
	}
})
.controller('Pago', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
})
.controller('Cuenta', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher,Socket) {
	$scope.nuevacontrasena={c:"",r:""}
	$scope.cierraContrasena=function(event){
		event.preventDefault()
		Message.closeAlert()
	}
	$scope.guardaContrasena=function(event){
		Message.closeAlert()
		event.preventDefault();
		if($scope.nuevacontrasena.c.length<8){
			Message.alert("Cambiar contraseña","La nueva contraseña debe de tener al menos 8 caracteres.",function(){
				$scope.cambiarContrasena();
			})	
		}else if($scope.nuevacontrasena.c!=$scope.nuevacontrasena.r){
			Message.alert("Cambiar contraseña","Las contraseñas proporcionadas no coinciden.",function(){
				$scope.cambiarContrasena();
			})	
		}else{
			Message.showLoading("Cambiando contraseña...")
			Socket.on("cliente_cambia_contrasena",$scope.contrasenaCambiada)
			Socket.emit("cliente_cambia_contrasena",{Contrasena:$scope.nuevacontrasena.c});
		}
	}
	$scope.contrasenaCambiada=function(data){
		Socket.off("cliente_cambia_contrasena",$scope.contrasenaCambiada)
		Message.hideLoading();
		if(!data.Error)Message.alert("Cambiar contraseña","La contraseña se ha cambiado con éxito")
		else Message.alert("Cambiar contraseña","No se ha podido cambiar la contraseña, intente de nuevo")
	}
	$scope.nicknameCambiada=function(data){
		Socket.off("cliente_cambia_nickname",$scope.nicknameCambiada)
		Message.hideLoading();
		if(!data.Error)Message.alert("Cambiar nickname","Tu nickname se ha cambiado con éxito",function(){
			$rootScope.Usuario.Alias=data.Nickname
		})
		else Message.alert("Cambiar nickname","No se ha podido cambiar tu nickname, intenta de nuevo")
	}
	$scope.cambiarNick=function(){
		Message.prompt("Cambiar nickname","Proporciona tu nuevo nickname",function(data){
			if(data){
				Message.showLoading("Cambiando nickname...")
				Socket.on("cliente_cambia_nickname",$scope.nicknameCambiada)
				Socket.emit("cliente_cambia_nickname",{Nickname:data});
			}
		},"text","Nickname")
	}
	$scope.cambiarContrasena=function(){
		$scope.nuevacontrasena={c:"",r:""}
		var buttons=[{ 
    				text: "Cancelar",
    				type: 'button-default',
    				onTap:$scope.cierraContrasena
  				},{
    				text: "Guardar",
    				type: "button",
    				onTap: $scope.guardaContrasena
  				}]
		Message.alertTemplate($scope,"screens/modal/contrasena.html","Cambiar contraseña",buttons,"alert-contrasena")
	}
})
.controller('Preferencias', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
})
.controller('Terminos', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
})
.controller('Informacion', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	$scope.cierraInformacion=function(){
		Message.hideModal();
	}
})
.controller('Lock', function($scope,$rootScope,Message,$state,Memory,$timeout) {
	$scope.lockCode=[{id:1,val:null},{id:2,val:null},{id:3,val:null},{id:4,val:null}];
	$scope.errorCode=false;
	$scope.restantes=5;
	$scope.lockNumber=function(num){
		$scope.errorCode=false;
		var finished=false;
		for(var i=0;i<$scope.lockCode.length;i++)
			if($scope.lockCode[i].val==null){
				$scope.lockCode[i].val=num;
				if(i==3)finished=true;
				i=$scope.lockCode.length;
			}
		if(finished)$scope.validate();
	}
	$scope.getCode=function(){
		return $scope.lockCode[0].val+""+$scope.lockCode[1].val+""+$scope.lockCode[2].val+""+$scope.lockCode[3].val
	}
	$scope.lockDelete=function(){
		$scope.errorCode=false;
		for(var i=$scope.lockCode.length-1;i>=0;i--)
			if($scope.lockCode[i].val!=null){
				$scope.lockCode[i].val=null;
				i=-1;
			}
	}
	$scope.lockRestart=function(){
		for(var i=$scope.lockCode.length-1;i>=0;i--)
			$scope.lockCode[i].val=null;
	}
	
	$scope.validate=function(){
		Message.showLoading("Verificando");
		$timeout(function(){
			Message.hideLoading();
			if($scope.getCode()==$rootScope.Usuario.Codigo){
				Message.hideModal();
			}else{
				$scope.lockRestart();
				$scope.restantes--;
				$scope.errorCode=true;
				if($scope.restantes==0){
					$scope.logout();
				}
			}
			
		},500)
	}
	$scope.logout=function(){
		Message.confirm("Cerrar sesión","¿Desea cerrar la sesión?",function(){
		
		Message.showLoading("Cerrando sesión");
		$timeout(function(){
			$rootScope.Usuario=null;
			Memory.clean();
			$state.go("login")
			$timeout(function(){
			Message.hideModal();
			},500)
			Message.hideLoading();
		},1000)
		})
	}
})