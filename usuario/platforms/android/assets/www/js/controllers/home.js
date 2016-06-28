angular.module('controllers')
.controller('Home', function($scope,$rootScope,uiGmapGoogleMapApiManualLoader,$animate,uiGmapIsReady,uiGmapGoogleMapApi,$timeout,socket,Message,Memory,$ionicViewSwitcher,$state,$timeout,$ionicSlideBoxDelegate ,$interval) {
	$scope.available=[];
	$scope.refreshBitches=function(){
		for(var i=0;i<$rootScope.bitches.length;i++)
		$scope.available.push($rootScope.bitches[i])
		$timeout(function(){
			$(".home-card").animate({
				'margin-top':"0px"
			},300,function(){
			})
		},300);
	}
	$scope.refreshBitches();
	$scope.likeb=function(bitch){
		$("#card"+bitch.id).animate({
			'margin-top':"-100vh"
		},300,function(){
			$scope.available.shift();
			$scope.$apply();
		})
		
	}
	$scope.dislikeb=function(bitch){
		$("#card"+bitch.id).animate({
			'margin-top':"-100vh"
		},300,function(){
			$scope.available.shift();
			$scope.$apply();
		})
	}
	
})