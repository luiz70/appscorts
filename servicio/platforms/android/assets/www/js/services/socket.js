angular.module('services')
.factory('socket', function ($rootScope,Memory,Message) {
    var conectado=false;
	$rootScope.socketState=true;
	var socket ;
	var socketFactory;
	
	var inicializa=function(){
		
		var usuario=Memory.get("Usuario")
		//if(usuario){
		//if(!socket){
			if(socket){
				socket.removeAllListeners();
				socket.disconnect();
			}
			socket=null;
			
			//socket = io();
			
			socket=io.connect('http://sd/socket',{
                                    reconnection:true,
									query:{id:$rootScope.User.IdUser},
									"force new connection":true
            });			
			/*socketFactory = null;
			socketFactory = socketFactory({
        		ioSocket: socket
    		});*/
		//}else socket.connect();
		
    
	/*socket.on("autenticated",function(val){
		$rootScope.socketState=val;
		conectado=val;
		
	})*/
	
    socket.on("connect",function(){
		$rootScope.$broadcast("socket.connect",true)
        conectado=true;
		$rootScope.socketState=true;
		try{$rootScope.$apply(function(){})}catch(err){}
		
    })
	/*socket.on('setLogOut',function(data){
		if(data.Id==$rootScope.Usuario.Id && data.Log!=$rootScope.Usuario.Log){
			//cerrar sesion
			Message.alert($rootScope.idioma.General[0],$rootScope.idioma.Login[11],function(){
				$rootScope.cerrarSesion();
			})
		}
	})*/
	
	
    socket.on("connect_error",function(){
       $rootScope.$broadcast("socket.connect",false)
	    conectado=false;
		$rootScope.socketState=false;
		try{$rootScope.$apply(function(){})}catch(err){}
		
    })
    socket.on("reconnect",function(){
		$rootScope.$broadcast("socket.connect",true)
        conectado=true;
		$rootScope.socketState=true;
		try{$rootScope.$apply(function(){})}catch(err){}
    })
    socket.on("reconnect_error",function(){
		$rootScope.$broadcast("socket.connect",false)
        conectado=false;
		$rootScope.socketState=false;
		try{$rootScope.$apply(function(){})}catch(err){}
    })
    socket.on("disconnect",function(){
		$rootScope.$broadcast("socket.connect",false)
        conectado=false;
		$rootScope.socketState=false;
		try{$rootScope.$apply(function(){})}catch(err){}

    })
    socket.on("error",function(){
		$rootScope.$broadcast("socket.connect",false)
        conectado=false;
		$rootScope.socketState=false;
		try{$rootScope.$apply(function(){})}catch(err){}
    })
	return socket;
	}
       
    return {
		inicializa:function(){
			return inicializa()
		},
         getSocket:function(){
            return socket
         },
         connect:function(){
            if(!conectado)socket.connect();
            return true;
         },
         isConnected:function(){
            return socket.connected;
         },
		 emit:function(event,obj){
			 socket.emit(event,obj);
		 
		 },
		 close:function(){
			
			 if(socket){
				socket.removeAllListeners();
			 	socket.disconnect();
			 }
		 }
    };
})