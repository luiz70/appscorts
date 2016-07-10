angular.module('controllers')
.controller('Perfil', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher,Socket) {
	$scope.perfilUsuario=$state.params.user;
	$rootScope.fotoSeleccionada=1;
	$rootScope.perfilUsuario=$state.params.user;
	$scope.inicia=function(){
		//$rootScope.$off("socket.connect",$scope.inicia)
		Socket.off("cliente_servidor_perfil",$scope.perfilCargado);
		Socket.on("cliente_servidor_perfil",$scope.perfilCargado)
		console.log($scope.perfilUsuario.IdServidor);
		Socket.emit("cliente_servidor_perfil",{IdServidor:$scope.perfilUsuario.IdServidor});
	}
	$scope.perfilCargado=function(data){
		if(data.Error)console.log(data)
		else $rootScope.perfilUsuario.Informacion=data.data;
	};
	if(!$scope.perfilUsuario){
		$ionicViewSwitcher.nextDirection(' back');
		$state.go('app.home');
	}else{
		if(Socket.status)$scope.inicia();
		
		//$rootScope.$on("socket.connect",$scope.inicia)
		
	}
	
	$scope.back=$state.params.back;
	$scope.added=false;
	$scope.showImage=false;
	$scope.imgShowImage=0;
	
	
	$scope.precios=function(){
		Message.alert("Precios","<div class='precio-perfil' style='margin-top:2vh;'>Cena: $3,000</div><div  class='precio-perfil'>Compañia completa: $8,000</div>");
	}
	$scope.like=function(){
		Socket.emit("cliente_like",{IdServidor:$rootScope.perfilUsuario.IdServidor});
		$rootScope.perfilUsuario.Informacion.Chat=1;
	}
	$scope.chat=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.chat",{user:$scope.perfilUsuario});
	}
	$scope.openimg=function(id){
		//$scope.showImage=true;
		//$scope.imgShowImage=id;
		$rootScope.fotoSeleccionada=id;
		Message.showModal("screens/modal/fotos.html","none")
	}
	$scope.closeImg=function(){
		$scope.showImage=false;
	}
	$scope.goBack=function(){
		$ionicViewSwitcher.nextDirection('back');
		if($scope.back==null)$state.go("app.home");
		else $state.go($scope.back,{user:$scope.perfilUsuario});
	}
})
.controller('Fotos', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher,$ionicSlideBoxDelegate) {
	$scope.cierraFotos=function(){
		Message.hideModal();
	}
	
	$rootScope.$watch("fotoSeleccionada",function(newv){
		if($rootScope.fotoSeleccionada!=null){
			$ionicSlideBoxDelegate.update();
			console.log($rootScope.fotoSeleccionada);
			$ionicSlideBoxDelegate.slide($rootScope.fotoSeleccionada);
			
		}
	})
	$scope.switchImg=function(foto){
		$rootScope.fotoSeleccionada=foto;
	}
})