angular.module('controllers')
.controller('Aplicacion', function($scope,$rootScope,Memory,Message,$state,$ionicViewSwitcher,$timeout) {
	$rootScope.lock();
	$rootScope.bitches=[
	{
		nombre:"Mr. elegante",
		edad:24,
		ad:"!Hola, me encantaría que pasáramos un día de diversión juntos!",
		id:1,
		about:"Me gusta salir a cenar, ver películas en casa, viajar acompañada y divertirme mucho",
		estatura:1.65,
		peso:59,
		medidas:"86-56-89",
		nacionalidad:"Mexicana",
		viajes:true,
		cenas:true,
		like:false,
		rejected:false,
		mensajes:4,
		time:"12:34am"
	},
	{
		nombre:"28/01/2016",
		edad:23,
		ad:"¿Vamos a cenar?, tengo ganas de salir a pasear contigo",
		id:2,
		about:"Me gusta salir a cenar, ver películas en casa, viajar acompañada y divertirme mucho",
		estatura:1.60,
		peso:55,
		medidas:"84-56-87",
		nacionalidad:"Brasileña",
		viajes:true,
		cenas:true,
		like:false,
		rejected:false,
		mensajes:0,
		time:"1:33pm"
	}
	]

	$scope.ajustes=function(){
		Message.showModal('screens/modal/ajustes.html');
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