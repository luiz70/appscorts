angular.module('controllers')
.controller('Aplicacion', function($scope,$rootScope,Memory,Message,$state,$ionicViewSwitcher,$timeout,Socket) {
	$rootScope.lock();
	Socket.open();
	$scope.ajustes=function(){
		//Message.showModal('screens/modal/ajustes.html');
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.menu");
	}
	$scope.regresarAjustes=function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.menu")
	}
	$scope.chats=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.chats");
	}
	$scope.perfil=function(user){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.perfil",{user:user});
	}
	$scope.home=function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.home");
	}
	$scope.$on('$ionicView.beforeEnter',function(){
		if(!Memory.get("Usuario")){
			$ionicViewSwitcher.nextDirection('enter');
			$state.go('login');
		}
	})
	$scope.$on('$ionicView.afterEnter',function(){
            
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
			
			
    })
	document.addEventListener("pause", function(){
		//puarda estados y todo
		if(navigator.splashscreen)navigator.splashscreen.show();
		angular.element(document.getElementById("app_content")).addClass("invisible")
		
	}, false);
	document.addEventListener("resume", function(){
		$rootScope.lock();
		$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
	},false);
	
})