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
.controller('Cuenta', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
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
			if($scope.getCode()=="1397"){
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
		Message.showLoading("Cerrando sesión");
		$timeout(function(){
			$rootScope.Usuario=null;
			Memory.clean();
			window.location.href="";
		},1000)
	}
})