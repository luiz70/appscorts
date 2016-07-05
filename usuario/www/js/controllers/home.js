angular.module('controllers')
.controller('Home', function($scope,$rootScope,uiGmapGoogleMapApiManualLoader,$animate,uiGmapIsReady,uiGmapGoogleMapApi,$timeout,Message,Memory,$ionicViewSwitcher,$state,$timeout,$ionicSlideBoxDelegate ,$interval,TDCardDelegate) {
	$scope.firsth=false;
	$scope.$on('$ionicView.afterEnter',function(){
		
		if(!$scope.firsth){
			$scope.firsth=true;
			$rootScope.$broadcast("socket.connect",true)
		}
	})

})
.controller('CardsCtrl', function($rootScope,$scope, TDCardDelegate, $timeout,Socket) {
	$scope.first=false
	$rootScope.$on("socket.connect",function(data){
		if(!$scope.first){
			$scope.first=true;
			$scope.refreshCards();
		}
	});
	$scope.cardTypes=null;
	$scope.cards={
    master:null,
    active: null,
  }
	$scope.obtenerServidoras=function(data){
		$timeout(function(){
		$scope.cardTypes=data;
		$scope.inicializa();
		});
	}
	
	$scope.inicializa=function(){
  /*var cardTypes = [
	/*{
		nombre:"Alice",
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
		nombre:"Steff",
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
	}*/
	//]

  $scope.cards = {
    master: Array.prototype.slice.call($scope.cardTypes, 0),
    active: Array.prototype.slice.call($scope.cardTypes, 0),
    discards: [],
    liked: [],
    disliked: []
  }
}

  $scope.cardDestroyed = function(index) {
    $scope.cards.active.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[0];
    $scope.cards.active.push(angular.extend({}, newCard));
  }

  $scope.refreshCards = function() {
	  $scope.cards.active = null;
	  Socket.off("cliente_servidoras",$scope.obtenerServidoras);
		Socket.on("cliente_servidoras",$scope.obtenerServidoras)
		Socket.emit("cliente_servidoras")
    /* Set $scope.cards to null so that directive reloads
    $scope.cards.active = null;
    $timeout(function() {
      $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
    });*/
  }

  $scope.$on('removeCard', function(event, element, card) {
    var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
    $scope.cards.discards.push(discarded);
  });

  $scope.cardSwipedLeft = function(index) {
    var card = $scope.cards.active[index];
    $scope.cards.disliked.push(card);
  };
  $scope.cardSwipedRight = function(index) {
    var card = $scope.cards.active[index];
    $scope.cards.liked.push(card);
	Socket.emit("cliente_like",{IdServidor:card.IdServidor});
  };

})

.controller('CardCtrl', function($scope, TDCardDelegate) {

});
