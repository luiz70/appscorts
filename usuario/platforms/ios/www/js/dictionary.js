angular.module('controllers',[])
.controller('Dictionary', function($scope,$rootScope) {
	$rootScope.dictionary={
		General:{
			1:"Aceptar",
			2:"Cancelar",
		},
		Login:{
			1:"Correo electrónico",
			2:"Contraseña",
			3:"Entrar",
			4:"Crear cuenta nueva",
			5:"Inicio de sesión",
			6:"El usuario y contraseña proporcionados no coinciden con nuestros registros, verifique e intente de nuevo."
		},
		Home:{
			
		}
	}
})