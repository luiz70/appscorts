angular.module('controllers')
.controller('Home', function($scope,$rootScope,uiGmapGoogleMapApiManualLoader,$animate,uiGmapIsReady,uiGmapGoogleMapApi,$timeout,socket,Message,Memory,$ionicViewSwitcher,$state,$timeout,$ionicSlideBoxDelegate ,$interval,TDCardDelegate) {
	
	var cardTypes = [
	{
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
	}
	]
$scope.allbitches=Array.prototype.slice.call(cardTypes, 0)

 $scope.cards = {
    master: Array.prototype.slice.call(cardTypes, 0),
    active: Array.prototype.slice.call(cardTypes, 0),
    discards: [],
    liked: [],
    disliked: []
  }

  $scope.cardDestroyed = function(index) {
	//$scope.allbitches.splice(index,1);
    //$scope.cards.active.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[0];
    $scope.cards.active.push(angular.extend({}, newCard));
  }
$scope.reloadCards=function(){
	$timeout(function() {
	$scope.allbitches = Array.prototype.slice.call(cardTypes, 0)
	})
}
  $scope.refreshCards = function() {
    // Set $scope.cards to null so that directive reloads
    $scope.allbitches = null;
    $timeout(function() {
      $scope.allbitches = Array.prototype.slice.call(cardTypes, 0)
	  console.log($scope.allbitches);
    },1000);
  }
  
  $scope.$on('removeCard', function(event, element, card) {
    //var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
    //$scope.cards.discards.push(discarded);
  });

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    //var card = $scope.cards.active[index];
    //$scope.cards.disliked.push(card);
	$timeout(function() {
	$scope.allbitches.splice(index,1);
	})
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    //var card = $scope.cards.active[index];
    //$scope.cards.liked.push(card);
	$timeout(function() {
	$scope.allbitches.splice(index,1);
	});
  };


})