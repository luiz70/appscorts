angular.module('controllers')
.controller('Chats', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher,Socket) {
	$scope.openChat=function(user){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.chat",{user:user})
	}
	$scope.first=false
	$scope.openPerfil=function(user){
		$ionicViewSwitcher.nextDirection('forward');
		user.IdServidor=user.Id
		$state.go("app.perfil",{user:user,back:"app.chats"});
	}
	$scope.chats=[]
	
	$scope.chatsCargados=function(data){
		console.log(data);
		Socket.off("servidor_carga_chats",$scope.chatsCargados)
		if(data.Error)console.log(data);
		else $timeout(function(){$scope.chats=data.Chats},1)
	}
	$scope.cargaChats=function(){
		if(Socket.status){
		Socket.off("servidor_carga_chats",$scope.chatsCargados)
		Socket.on("servidor_carga_chats",$scope.chatsCargados)
		Socket.emit("servidor_carga_chats")
		Socket.off("servidor_nuevo_mensaje",$scope.nuevoMensaje)
		Socket.on("servidor_nuevo_mensaje",$scope.nuevoMensaje)
		}
	}
	$scope.$on('$ionicView.afterEnter',function(){
		$scope.cargaChats()
	})
	/*if(Socket.status){
		console.log(8);
		Socket.off("servidor_carga_chats",$scope.chatsCargados)
		Socket.on("servidor_carga_chats",$scope.chatsCargados)
		Socket.emit("servidor_carga_chats")
	}else*/
	if(!Socket.status)
	$rootScope.$on("socket.connect",function(data){
		if(!$scope.first){
			$scope.first=true;
			$scope.cargaChats();
		}
	});
	$scope.nuevoMensaje=function(data){
		var i=_.findIndex($scope.chats,{IdChat:data.IdChat})
		if(i>=0)$scope.cargaChats();
	}
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
			Socket.emit("cliente_elimina_like",{IdServidor:perfil.Id,IdChat:perfil.IdChat})
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

.controller('Solicitar', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher) {
	console.log($scope.chatUser);
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
.controller('AgregarFavorita', function($scope,$rootScope,Message,$state,Memory,$timeout,$ionicViewSwitcher,Socket) {
	
	$scope.cierraModal=function(){
		Message.hideModal();
	}
	$scope.cargando=true;
	$scope.chats=[]
	$scope.chatsCargados=function(data){
		console.log(data);
		if(data.Error)console.log(data);
		else $timeout(function(){
			$scope.chats=[]
			for(var i=0;i<data.Chats.length;i++)if(data.Chats[i].Id!=$scope.chatUser.Id)$scope.chats.push(data.Chats[i]);
			//_.without(data.Chats,{Id:$scope.chatUser.Id})
		},1)
	}
	$scope.cargaFavoritas=function(){
		if(Socket.status){
		Socket.off("cliente_carga_chats",$scope.chatsCargados)
		Socket.on("cliente_carga_chats",$scope.chatsCargados)
		Socket.emit("cliente_carga_chats")
		}
	}
	$scope.cargaFavoritas();
	$scope.grupoCreado=function(data){
		Message.hideLoading();
		if(data.Error){
			Message.alert("Crear Grupo","Error al agregar favoritos, intenta de nuevo.");
		}else{
			Message.hideModal();
		}
	}
	$scope.agregaFav=function(){
		var ids=[]
		for(var i=0;i<$scope.chats.length;i++)
			if($scope.chats[i].seleccionada)ids.push($scope.chats[i].Id)
		if(ids.length>0){
			Message.showLoading("Creando grupo...");
			Socket.off("cliente_crear_grupo",$scope.grupoCreado)
			Socket.on("cliente_crear_grupo",$scope.grupoCreado);
			Socket.emit("cliente_crear_grupo",{IdChat:$scope.chatUser.IdChat,Ids:ids});
		}else $scope.cierraModal();
	}
	$scope.selecciona=function(bitch){
		bitch.seleccionada=!bitch.seleccionada;
	}
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
	$scope.map=null;
	$scope.ubicacion=null;
	$timeout(function(){
		$scope.map = new google.maps.Map(document.getElementById('Mapa'), {
		  center: new google.maps.LatLng(20.666871, -103.352925),
		  zoom: 17
		});
		$scope.marcador = new google.maps.Marker({
			position: new google.maps.LatLng(20.666871, -103.352925),
			map: $scope.map,
			draggable: true,
    		animation: google.maps.Animation.DROP,
		});
		$scope.marcador.addListener('position_changed', function(position) {
			$scope.ubicacion={latitude:$scope.marcador.getPosition().lat(),longitude:$scope.marcador.getPosition().lng(),Direccion:"Ubicación personalizada"};
	  	});
		navigator.geolocation.getCurrentPosition($scope.ubicacionExito,function(){},
        	{enableHighAccuracy: true,timeout:2000 , frequency: 1000});
	},500);
	$scope.enviarUbicacion=function(){
		$scope.sendMessage($scope.ubicacion);
		Message.hideModal();
	}
	$scope.seleccionarLugar=function(lugar){
		
		$scope.map.setCenter(new google.maps.LatLng(lugar.geometry.location.lat(),lugar.geometry.location.lng()));
		$scope.marcador.setPosition(new google.maps.LatLng(lugar.geometry.location.lat(),lugar.geometry.location.lng()));
		$scope.ubicacion={latitude:lugar.geometry.location.lat(),longitude:lugar.geometry.location.lng(),Direccion:lugar.formatted_address};
		$scope.resultados=[];
	}
	
	$scope.ubicacionExito=function(data){
		$scope.map.setCenter(new google.maps.LatLng(data.coords.latitude,data.coords.longitude));
		$scope.marcador.setPosition(new google.maps.LatLng(data.coords.latitude,data.coords.longitude));
	}
	$scope.busca=function(){
	
		$scope.resultados=[]
		if($scope.buscador.texto){
		if($scope.buscador.texto.trim()!=""){
			$scope.searchBox = new google.maps.places.PlacesService($scope.map);
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
          	$scope.resultados.push(result);
        });
	  }
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