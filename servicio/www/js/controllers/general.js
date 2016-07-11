angular.module('controllers')
.controller('General', function($scope,$rootScope,Memory,Message) {
	//GENERAL CONFIGURATION
	$rootScope.config={
		Socket: {
			url: 'http://www.virtual-guardian.com',
			port: 94,
			route:"socket",
			getUrl:function(){
				return this.url+':'+this.port+'/'+this.route
				
			}
		},
		http:{
			url:'http://www.virtual-guardian.com',
			port:94,
			getUrl:function(){
				return this.url+":"+this.port+"/";
			}
		}
	}
	$rootScope.lock=function(){
	}
	$rootScope.fromLogin=false;
	$rootScope.Usuario=Memory.get("Usuario");
	$rootScope.$watch("Usuario",function(newv,oldv){
		if(newv){
			Memory.set($rootScope.Usuario)
		}
	},true)
	
})