angular.module('controllers')
.controller('Chats', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher,Socket) {
	$scope.openChat=function(user){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.chat",{user:user})
	}
	$scope.first=false
	$scope.openPerfil=function(user){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.perfil",{user:user,back:"app.chats"});
	}
	$scope.chats=[]
	$scope.chatsCargados=function(data){
		console.log(data);
		if(data.Error)console.log(data);
		else $timeout(function(){$scope.chats=data.Chats},1)
	}
	$scope.$on('$ionicView.afterEnter',function(){
		if(Socket.status){
		Socket.off("cliente_carga_chats",$scope.chatsCargados)
		Socket.on("cliente_carga_chats",$scope.chatsCargados)
		Socket.emit("cliente_carga_chats")
		}
	})
	if(Socket.status){
		Socket.off("cliente_carga_chats",$scope.chatsCargados)
		Socket.on("cliente_carga_chats",$scope.chatsCargados)
		Socket.emit("cliente_carga_chats")
	}else
	$rootScope.$on("socket.connect",function(data){
		if(!$scope.first){
			$scope.first=true;
			Socket.off("cliente_carga_chats",$scope.chatsCargados)
			Socket.on("cliente_carga_chats",$scope.chatsCargados)
			Socket.emit("cliente_carga_chats")
		}
	});
	$scope.opcionesChat=function(chat){
		var buttons=[
			{text:"Eliminar chat",data:chat,funcion:$scope.borraChat},
			{text:"Ver perfil",data:chat,funcion:$scope.openPerfil},
			{text:"Abrir chat",data:chat,funcion:$scope.openChat},
			
		]
		Message.showActionSheet(chat.Nombre,buttons,null,"Cancelar",function(index,res){
			if(res){
				res.funcion(res.data);
			}
		})
			
	}
	$scope.chatEliminado=function(data){
		Message.hideLoading("");
		if(data.Error){
			Message.alert("Eliminar chat","No se ha podido eliminar el chat, intente de nuevo.")
		}else{
			$scope.chats=[];
			Socket.off("cliente_carga_chats",$scope.chatsCargados)
			Socket.on("cliente_carga_chats",$scope.chatsCargados)
			Socket.emit("cliente_carga_chats")
		}
	}
	$scope.borraChat=function(perfil){
		Message.confirm("Eliminar chat: "+perfil.Nombre,"¿Deseas eliminar la conversación con "+perfil.Nombre+"?",function(res){
			Message.showLoading("Eliminando chat...")
			Socket.off("cliente_elimina_like",$scope.chatEliminado)
			Socket.on("cliente_elimina_like",$scope.chatEliminado)
			Socket.emit("cliente_elimina_like",{IdServidor:perfil.IdServidor})
		})
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

.controller('Chat2', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher,Socket,$ionicScrollDelegate) {
	$scope.cargandoMensajes=true;
	$scope.chatUser=$state.params.user;
	if(!$scope.chatUser){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.chats")
	}
	
	$scope.$on('$ionicView.afterEnter',function(){
		if(Socket.status){
		Socket.off("cliente_carga_chat",$scope.chatCargado)
		Socket.on("cliente_carga_chat",$scope.chatCargado)
		Socket.emit("cliente_carga_chat",{IdServidor:$scope.chatUser.IdServidor})
		}
	})
	$scope.error=false;
	$scope.mensajes=[];
	$scope.chatCargado=function(data){
		$timeout(function(){
		
		if(data.Error){
			$scope.cargandoMensajes=false;
			$scope.error=true;
		}else{
			$scope.mensajes=data.Mensajes
			$timeout(function(){
			$ionicScrollDelegate.scrollBottom();
			$scope.cargandoMensajes=false;
			},100)
			console.log($scope.mensajes);
		}
		},1);
	}
	$scope.messages=[];
	$scope.inputChat="";
	$scope.abreUbicacion=function(mensaje){
		console.log(mensaje.Ubicacion)
		if(mensaje.Ubicacion){
		}
	}
	$rootScope.enviarUbicacion=function(lugar){
		$scope.exitModal()
		
		var dt=new Date()
			var h=dt.getHours()<10?"0"+dt.getHours():dt.getHours();
			var m=dt.getMinutes()<10?"0"+dt.getMinutes():dt.getMinutes();
			var p="am"
			if(h>12){
				p="pm"
				h-=12;
			}
			if(lugar)
		$scope.mensajes.push({Mensaje:"Ubicación",Direccion:1,Fecha:h+":"+m+p,Ubicacion:{latitude:lugar.geometry.location.lat(),longitude:lugar.geometry.location.lng()}})
		else
		$scope.mensajes.push({Mensaje:"Ubicación",Direccion:1,Fecha:h+":"+m+p})
	}
	$scope.closeChat=function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.chats")
	}
	//$scope.messages.push({text:"Hola, ¿cómo estás?",user:1,time:"12:35"})
	
	/*$timeout(function(){
		$scope.messages.push({})
	},1000);*/
	$scope.sendMsg=function(){
		$scope.inputChat=$scope.inputChat.trim();
		if($scope.inputChat && $scope.inputChat!=""){
			var dt=new Date()
			var h=dt.getHours()<10?"0"+dt.getHours():dt.getHours();
			var m=dt.getMinutes()<10?"0"+dt.getMinutes():dt.getMinutes();
			var p="am"
			if(h>12){
				p="pm"
				h-=12;
			}
			$scope.mensajes.push({Mensaje:$scope.inputChat,Direccion:1,Fecha:h+":"+m+p})
			Socket.emit("cliente_mensaje_chat",{Mensaje:$scope.inputChat,IdServidor:$scope.chatUser.IdServidor})
			$scope.inputChat="";
		}
	}
	$scope.agregarFavorita=function(data){
	}
	$scope.showOptions=function(){
		var buttons=[
			{text:"Invitar favorita",funcion:$scope.agregarFavorita},
			{text:"Enviar ubicación",funcion:$scope.sendUbicacion},
			{text:"Solicitar servicio",funcion:$scope.solicitar},
			{text:"Ver perfil",funcion:$scope.verperfil}
		]
		Message.showActionSheet(null,buttons,null,"Cancelar",function(index,res){
			if(res){
				res.funcion();
			}
		})
	}
	//Message.showModal("screens/modal/ubicacion.html",null,$scope);
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
		Message.confirm("Incrementar servicio","¿Deseaincrementar 1 hora el servicio?",function(){
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
	$scope.buscador={
		texto:""
	};
	$scope.resultados=[];
	$scope.timeout=null;
	$scope.buscaTexto=function(){
		if($scope.timeout)$timeout.cancel($scope.timeout)
		$scope.timeout=$timeout($scope.busca,1000);
	}
	$scope.limpiaBuscador=function(){
		$scope.resultados=[];
		$scope.buscador.texto=""
	}
	
	
	$scope.busca=function(){
		var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(20.666871, -103.352925),
      zoom: 15
    });
		$scope.resultados=[]
		if($scope.buscador.texto){
		if($scope.buscador.texto.trim()!=""){
			$scope.searchBox = new google.maps.places.PlacesService(map);
			var service = new google.maps.places.AutocompleteService();
 			service.getPlacePredictions({ input: $scope.buscador.texto ,language:"es"}, $scope.predicciones);
		}else $scope.resultados=[]
		}else $scope.resultados=[]//$scope.buscando=false
	}
	$scope.predicciones = function(predictions, status) {
		$scope.resultados=[]
		if(!predictions)
		$scope.$apply(function () {
			//$scope.buscando=false
		})
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        predictions.forEach(function(prediction) {
		$scope.searchBox.getDetails({placeId:prediction.place_id}, $scope.placeDetails);	
    	});
	}
  };

  $scope.placeDetails=function(result,status){
	 $scope.buscando=false;
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  $scope.$apply(function () {
		  console.log(result);
          	$scope.resultados.push(result);
        });
	  }
  }
	
})