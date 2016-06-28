angular.module('controllers')
.controller('Login', function($scope,$rootScope,$timeout) {
	$scope.$on('$ionicView.afterEnter',function(){
            //if(!Memory.get("Usuario"))
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
			
			
    })
})