angular.module('controllers')
.controller('Chat',
  function($scope, $rootScope, $state, $stateParams,$ionicActionSheet, $ionicPopup, $ionicScrollDelegate, $timeout, $interval,$ionicViewSwitcher,Socket,Message) {
	$scope.cargandoMensajes=true;
	$scope.chatUser=$state.params.user;
	$scope.error=false;
	$scope.mensajes=[];
	var messageCheckTimer;
    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^
	
	if(!$scope.chatUser){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.chats")
	}
	$scope.actualizaMensajes=function(){
		if(Socket.status){
			$scope.cargandoMensajes=true;
			Socket.off("cliente_carga_chat",$scope.chatCargado)
			Socket.on("cliente_carga_chat",$scope.chatCargado)
			Socket.emit("cliente_carga_chat",{IdChat:$scope.chatUser.IdChat})
		}
	}
	$scope.$on('$ionicView.afterEnter',function(){
		$scope.actualizaMensajes();
		$timeout(function() {
        	footerBar = document.body.querySelector('#userMessagesView .bar-footer');
        	scroller = document.body.querySelector('#userMessagesView .scroll-content');
        	txtInput = angular.element(footerBar.querySelector('textarea'));
      	}, 0);

      	messageCheckTimer = $interval(function() {
        	$scope.actualizaMensajes();
      	}, 20000);
	})
	
	$scope.chatCargado=function(data){
		$timeout(function(){
			if(data.Error){
				$scope.cargandoMensajes=false;
				$scope.error=true;
			}else{
				$scope.mensajes=data.Mensajes
				$timeout(function(){
					viewScroll.scrollBottom(true);
					$scope.cargandoMensajes=false;
				},100)
			}
		},1);
	}
	
	$scope.abreUbicacion=function(mensaje){
		
		if(mensaje.Latitud || mensaje.Longitud){
			console.log("ubicacion");
		}
	}
	
	
	$scope.closeChat=function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.chats")
	}
	
	
	
	$scope.agregarFavorita=function(){
		Message.showModal("screens/modal/agregarFavorita.html","up",$scope);
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

	$scope.sendUbicacion=function(){
		Message.showModal("screens/modal/ubicacion.html",null,$scope);
	}
	
	$scope.verperfil=function(){
		$scope.chatUser.IdServidor=$scope.chatUser.Id
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.perfil",{user:$scope.chatUser,back:"app.chat"});
	}
	
	window.addEventListener('native.keyboardshow', function(e){
		//$("#vista-chat").height((window.innerHeight-e.keyboardHeight)+"px")
	});
	
	window.addEventListener('native.keyboardhide', function(e){
			//$("#vista-chat").height("100vh")
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
		Message.confirm("Cancelar servicio","Al cancelar este servicio no se reembolsara el pago.<div>¿Desea cancelar el servicio?</div>",function(){
			$scope.exitModal();
			$state.go("app.home");
		})
	}

    $scope.input = {
      message: localStorage['userMessage-' + $scope.chatUser.IdChat] || ''
    };

    $scope.$on('$ionicView.leave', function() {
      if (angular.isDefined(messageCheckTimer)) {
        $interval.cancel(messageCheckTimer);
        messageCheckTimer = undefined;
      }
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      if (!$scope.input.message || $scope.input.message === '') {
        localStorage.removeItem('userMessage-' + $scope.chatUser.IdChat);
      }
    });

    

    $scope.$watch('input.message', function(newValue, oldValue) {
    	if (!newValue) newValue = '';
    	localStorage['userMessage-' + $scope.chatUser.IdChat] = newValue;
    });
	
	$scope.mensajeEnviado=function(data){
		var i=_.findIndex($scope.mensajes,{Id:data.Id,Mensaje:data.Mensaje})
		$timeout(function(){
			$scope.mensajes[i].Confirmado=1;
			$scope.mensajes[i].IdMensaje=data.IdMensaje;
			$scope.mensajes[i].Ubicacion=data.Ubicacion;
		},1)
	}
	
    $scope.sendMessage = function(ubicacion) {
		
    	var message = {
			IdChat:$scope.chatUser.IdChat,
        	Emisor: $rootScope.Usuario.Id,
			Fecha:new Date(),
			Id:Math.random(),
			IdMensaje:0,
			Mensaje: $scope.input.message,
			Usuario:1,
			Confirmado:0,
			Ubicacion:ubicacion,
			Latitud:ubicacion.latitude,
			Longitud:ubicacion.longitude,
      	};
		if(ubicacion) {
			message.Mensaje=ubicacion.Direccion;
			message.Ubicacion={latitud:ubicacion.latitude,longitud:ubicacion.longitude}
		}
		// if you do a web service call this will be needed as well as before the viewScroll calls
		// you can't see the effect of this in the browser it needs to be used on a real device
		// for some reason the one time blur event is not firing in the browser but does on devices
     	keepKeyboardOpen();
	 	Socket.off("cliente_mensaje_chat",$scope.mensajeEnviado)
		Socket.on("cliente_mensaje_chat",$scope.mensajeEnviado)
		Socket.emit("cliente_mensaje_chat",{IdChat:message.IdChat,Usuario:message.Usuario,Mensaje:message.Mensaje,Id:message.Id,Ubicacion:message.Ubicacion})
		if(!ubicacion)$scope.input.message = '';
		$scope.mensajes.push(message);
		$timeout(function() {
			keepKeyboardOpen();
			viewScroll.scrollBottom(true);
		 }, 0);
    };
    
    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    function keepKeyboardOpen() {
    	txtInput.one('blur', function() {
        	txtInput[0].focus();
      	});
    }

    $scope.onMessageHold = function(e, itemIndex, message) {
		var botones=[{
          text: 'Copiar texto'
        }]
		if(message.Latitud || message.Longitud)botones.push({text:'Abrir ubicación'})
      $ionicActionSheet.show({
        buttons: botones,
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Copy Text
              //cordova.plugins.clipboard.copy(message.text);

              break;
			case 1:
				$scope.abreUbicacion(message);  
			break;
            /*case 1: // Delete
              // no server side secrets here :~)
              $scope.messages.splice(itemIndex, 1);
              $timeout(function() {
                viewScroll.resize();
              }, 0);

              break;*/
          }
          
          return true;
        }
      });
    };

    // I emit this event from the monospaced.elastic directive, read line 480
    $scope.$on('taResize', function(e, ta) {
		if (!ta) return;
      	var taHeight = ta[0].offsetHeight;     
      	if (!footerBar) return;
		var newFooterHeight = taHeight + 10;
      	newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
      	footerBar.style.height = newFooterHeight + 'px';
      	scroller.style.bottom = newFooterHeight + 'px'; 
    });
})


// configure moment relative time
moment.locale('en', {
	relativeTime: {
		future: "en %s",
		past: "hace %s",
		s: "%d seg",
		m: "a minuto",
		mm: "%d minutos",
		h: "una hora",
		hh: "%d horas",
		d: "a día",
		dd: "%d dias",
		M: "un mes",
		MM: "%d meses",
		y: "un año",
		yy: "%d años"
	}
});
