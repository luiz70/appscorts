angular.module('controllers')
.controller('Chat',
  function($scope, $rootScope, $state, $stateParams, MockService,$ionicActionSheet, $ionicPopup, $ionicScrollDelegate, $timeout, $interval,$ionicViewSwitcher,Socket) {
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
    // mock acquiring data via $stateParams
    $scope.toUser = {
      _id: '534b8e5aaa5e7afc1b23e69b',
      pic: 'http://ionicframework.com/img/docs/venkman.jpg',
      username: 'Venkman'
    }

    // this could be on $rootScope rather than in $stateParams
    $scope.user = {
      _id: '534b8fb2aa5e7afc1b23e69c',
      pic: 'http://ionicframework.com/img/docs/mcfly.jpg',
      username: 'Tu'
    };

    $scope.input = {
      message: localStorage['userMessage-' + $scope.toUser._id] || ''
    };

    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    $scope.$on('$ionicView.enter', function() {
      console.log('UserMessages $ionicView.enter');

      getMessages();
      
      $timeout(function() {
        footerBar = document.body.querySelector('#userMessagesView .bar-footer');
		console.log(footerBar);
        scroller = document.body.querySelector('#userMessagesView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));
      }, 0);

      messageCheckTimer = $interval(function() {
        // here you could check for new messages if your app doesn't use push notifications or user disabled them
      }, 20000);
    });

    $scope.$on('$ionicView.leave', function() {
      console.log('leaving UserMessages view, destroying interval');
      // Make sure that the interval is destroyed
      if (angular.isDefined(messageCheckTimer)) {
        $interval.cancel(messageCheckTimer);
        messageCheckTimer = undefined;
      }
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      if (!$scope.input.message || $scope.input.message === '') {
        localStorage.removeItem('userMessage-' + $scope.toUser._id);
      }
    });

    function getMessages() {
      // the service is mock but you would probably pass the toUser's GUID here
      MockService.getUserMessages({
        toUserId: $scope.toUser._id
      }).then(function(data) {
        $scope.doneLoading = true;
        $scope.messages = data.messages;

        $timeout(function() {
          viewScroll.scrollBottom();
        }, 0);
      });
    }

    $scope.$watch('input.message', function(newValue, oldValue) {
      console.log('input.message $watch, newValue ' + newValue);
      if (!newValue) newValue = '';
      localStorage['userMessage-' + $scope.toUser._id] = newValue;
    });

    $scope.sendMessage = function(sendMessageForm) {
      var message = {
        toId: $scope.toUser._id,
        text: $scope.input.message
      };

      // if you do a web service call this will be needed as well as before the viewScroll calls
      // you can't see the effect of this in the browser it needs to be used on a real device
      // for some reason the one time blur event is not firing in the browser but does on devices
      keepKeyboardOpen();
      
      //MockService.sendMessage(message).then(function(data) {
      $scope.input.message = '';

      message._id = new Date().getTime(); // :~)
      message.date = new Date();
      message.username = $scope.user.username;
      message.userId = $scope.user._id;
      message.pic = $scope.user.picture;

      $scope.messages.push(message);

      $timeout(function() {
        keepKeyboardOpen();
        viewScroll.scrollBottom(true);
      }, 0);

      $timeout(function() {
        $scope.messages.push(MockService.getMockMessage());
        keepKeyboardOpen();
        viewScroll.scrollBottom(true);
      }, 2000);

      //});
    };
    
    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function() {
        console.log('textarea blur, focus back on it');
        txtInput[0].focus();
      });
    }

    $scope.onMessageHold = function(e, itemIndex, message) {
      console.log('onMessageHold');
      console.log('message: ' + JSON.stringify(message, null, 2));
      $ionicActionSheet.show({
        buttons: [{
          text: 'Copy Text'
        }, {
          text: 'Delete Message'
        }],
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Copy Text
              //cordova.plugins.clipboard.copy(message.text);

              break;
            case 1: // Delete
              // no server side secrets here :~)
              $scope.messages.splice(itemIndex, 1);
              $timeout(function() {
                viewScroll.resize();
              }, 0);

              break;
          }
          
          return true;
        }
      });
    };

    // this prob seems weird here but I have reasons for this in my app, secret!
    $scope.viewProfile = function(msg) {
      if (msg.userId === $scope.user._id) {
        // go to your profile
      } else {
        // go to other users profile
      }
    };
    
    // I emit this event from the monospaced.elastic directive, read line 480
    $scope.$on('taResize', function(e, ta) {
      console.log('taResize');
      if (!ta) return;
      
      var taHeight = ta[0].offsetHeight;
      console.log('taHeight: ' + taHeight);
      
      if (!footerBar) return;
      
      var newFooterHeight = taHeight + 10;
      newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
      
      footerBar.style.height = newFooterHeight + 'px';
      scroller.style.bottom = newFooterHeight + 'px'; 
    });

})
.factory('MockService', ['$http', '$q',
  function($http, $q) {
    var me = {};

    me.getUserMessages = function(d) {
      /*
      var endpoint =
        'http://www.mocky.io/v2/547cf341501c337f0c9a63fd?callback=JSON_CALLBACK';
      return $http.jsonp(endpoint).then(function(response) {
        return response.data;
      }, function(err) {
        console.log('get user messages error, err: ' + JSON.stringify(
          err, null, 2));
      });
      */
      var deferred = $q.defer();
      
		 setTimeout(function() {
      	deferred.resolve(getMockMessages());
	    }, 1500);
      
      return deferred.promise;
    };

    me.getMockMessage = function() {
      return {
        userId: $scope.chatUser.IdServidor,
        date: new Date(),
        text: 'Por el momento no estoy disponible, pero recibire tus mensajes y contestare a la brevedad.'
      };
    }

    return me;
  }
])

function onProfilePicError(ele) {
  this.ele.src = ''; // set a fallback
}

function getMockMessages() {
  return {"messages":[],"unread":0};
}

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
