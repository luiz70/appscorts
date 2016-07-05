angular.module('services')
.factory('Socket', function ($rootScope,$timeout) {
	var socket=null;
	var initialize=function(){
	
		if(!$rootScope.Usuario){
			return false;
		}
		if(socket){
			socket.removeAllListeners();
			socket.disconnect();
		}
		socket=null;
		console.log($rootScope.config.Socket.getUrl())
		socket=io.connect($rootScope.config.Socket.getUrl(),{reconnection:true,query:"token="+$rootScope.Usuario.Token,"force new connection":true});			
		
		socket.on("autenticated",function(val){
		})
		socket.on("connect",function(){
			$timeout(function(){
			$rootScope.conexion=true;
			},1)
			$rootScope.$broadcast("socket.connect",true)
		})
		socket.on("connect_error",function(){
			$timeout(function(){
			$rootScope.conexion=false;
			},1)
    	})
		socket.on("reconnect",function(){
			//$rootScope.$broadcast("socket.connect",true)
		})
    	socket.on("reconnect_error",function(){
			$timeout(function(){
			$rootScope.conexion=false;
			},1)
    	})
   		socket.on("disconnect",function(){
			$timeout(function(){
			$rootScope.conexion=false;
			},1)
		})
    	socket.on("error",function(error){
			$timeout(function(){
			$rootScope.conexion=false;
			},1)
		})
		return socket;
	}
      
    return {
		open:function(){
			return initialize();
		},
        connect:function(){
        	if(!conectado)socket.connect();
            return true;
		},
		disconnect:function(){
			if(socket){
				socket.disconnect();
			}
		},
		emit:function(event,data){
			data=(data==null)?{}:data;
			if(socket)socket.emit(event,data);
		},
		on:function(event,funcion){
			if(socket)socket.on(event,funcion);
		},
		off:function(event,funcion){
			if(socket)socket.removeListener(event,funcion);
		},
		status:function(){
			return socket.connected
		},
		close:function(){
			if(socket){
				socket.removeAllListeners();
				socket.disconnect();
			}
		}
    };
})