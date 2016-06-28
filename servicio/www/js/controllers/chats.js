angular.module('controllers')
.controller('Chats', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	$scope.openChat=function(user){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.chat",{user:user})
	}
	$scope.openPerfil=function(user){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.perfil",{user:user,back:"app.chats"});
	}
	$scope.openOptions=function(){
		var buttons=[
			{text:"Eliminar chats",data:1},
			{text:"Ordenar (A..Z)",data:1},
			{text:"Ordenar (Z..A)",data:1}
		]
		Message.showActionSheet("Chats",buttons,null,"Cancelar",function(index,res){
			
		})
	}
})
.controller('Chat', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	$scope.chatUser=$state.params.user;
	$scope.messages=[];
	$scope.inputChat="";
	$scope.closeChat=function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.chats")
	}
	$scope.messages.push({text:"Hola, ¿cómo estás?",user:1,time:"12:35"})
	
	/*$timeout(function(){
		$scope.messages.push({})
	},1000);*/
	$scope.sendMsg=function(){
		$scope.inputChat=$scope.inputChat.trim();
		if($scope.inputChat && $scope.inputChat!=""){
			$scope.messages.push({text:$scope.inputChat,user:2,time:"12:36"})
			$scope.inputChat="";
		}
	}
	$scope.showOptions=function(){
		var buttons=[
			{text:"Enviar ubicacion",funcion:$scope.sendUbicacion},
			{text:"Ver calificacion",funcion:function(){}},
			{text:"Reportar",funcion:function(){}},
			
		]
		Message.showActionSheet(null,buttons,null,"Cancelar",function(index,res){
			if(res){
				res.funcion();
			}
		})
	}
	$scope.sendUbicacion=function(){
		Message.showModal("screens/modal/ubicacion.html",null,$scope);
	}
	$scope.verperfil=function(){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.perfil",{user:$scope.chatUser,back:"app.chat"});
	}
	window.addEventListener('native.keyboardshow', function(e){
		//$timeout(function(){
			$("#vista-chat").height((window.innerHeight-e.keyboardHeight)+"px")
		//263
		//},500);
	});
	window.addEventListener('native.keyboardhide', function(e){
		//$timeout(function(){
			$("#vista-chat").height("100vh")
		//},500);
	});
	$scope.solicitar=function(){
		Message.showModal("screens/modal/solicitar.html",null,$scope)
	}
	$scope.aceptServicio=function(){
		Message.showLoading("Solicitando...");
		Message.hideModal();
		$timeout(function(){
			Message.showModal("screens/modal/espera.html",null,$scope);
			Message.hideLoading();
		},1000)
	}
	$scope.exitModal=function(){
			Message.hideModal();
	}
	
	$scope.iniciaServicio=function(){
		$scope.time=3600;
		Message.showLoading("iniciandoServicio");
		$timeout(function(){
			//Message.hideModal();
			Message.showModal("screens/modal/timer.html","none",$scope);
			Message.hideLoading();
		},1000)
	}
	$scope.addServicio=function(){
		Message.confirm("Incrementar servicio","¿Desea incrementar 1 hora el servicio?",function(){
		 $scope.$broadcast('timer-add-cd-seconds', 3600);
		})
	}
	$scope.cancelarServicio=function(){
		//titulo,texto,funcion,btn1,btn2,closable,callback
		Message.confirm("Cancelar servicio","Al cancelar este servicio no se reembolsara el pago.<div>¿Desea cancelar el servicio?</div>",function(){
			$scope.exitModal();
			$state.go("app.home");
		})
	}
})
.controller('Solicitar', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	
	$scope.servicios=[
		{descripcion:"Compañia completa",precio:"8,000",selected:true},
		{descripcion:"Cena",precio:"3,000",selected:false},
	]
	$scope.pagos=[
		{terminacion:"4578",selected:true},
		{terminacion:"5900",selected:false}
	]
	$scope.seleccionarServicio=function(id){
		for(var i=0;i<$scope.servicios.length;i++)
		$scope.servicios[i].selected=false;
		$scope.servicios[id].selected=true;
	}
	$scope.seleccionarPago=function(id){
		for(var i=0;i<$scope.pagos.length;i++)
		$scope.pagos[i].selected=false;
		$scope.pagos[id].selected=true;
	}
})
.controller('Espera', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	$timeout(function(){
		$scope.iniciaServicio();
	},5000)
	
})
.controller('Ubicacion', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	
})