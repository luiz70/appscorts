angular.module('controllers',[])
.controller('Dictionary', function($scope,$rootScope) {
	$rootScope.dictionary={
		Login:{
			1:"User",
			2:"Password",
			3:"Park in",
			4:"¡Sing up here!"
		}
	}
})