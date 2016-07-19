// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires''starter.services',
angular.module('starter', ['ionic', 'controllers','ionic-material', 'ngCordova','ngAnimate',"ngTouch",'uiGmapgoogle-maps','LocalStorageModule','ngError','services','timer','ionic.contrib.ui.tinderCards2', 'monospaced.elastic', 'angularMoment', 'ionicLazyLoad'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	  //StatusBar.backgroundColorByHexString("#059DB5");
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
	  ionic.Platform.isFullScreen=true;
    }
    if(window.StatusBar) {
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#000000");
        StatusBar.styleLightContent();
        StatusBar.show();
    }
	$ionicPlatform.registerBackButtonAction(function (event) {
    	event.preventDefault();
    }, 100);
  });
})
.config(function($stateProvider, $urlRouterProvider,localStorageServiceProvider,uiGmapGoogleMapApiProvider,$ionicConfigProvider) {
	uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyA9Pf6xs5oXGWmLsxZizEUdQMLrzR-mSmA',
        libraries: 'places',
        preventLoad: false,
		transport:"https"
    });
	$ionicConfigProvider.views.maxCache(10);
	$ionicConfigProvider.views.swipeBackEnabled(false);
	$ionicConfigProvider.platform.ios.views.maxCache(10);
	$ionicConfigProvider.platform.android.views.maxCache(10);
	$ionicConfigProvider.views.transition("ios");
	$ionicConfigProvider.views.forwardCache(true);
	$ionicConfigProvider.form.checkbox("circle")
	// LocalStorage config
	localStorageServiceProvider
	.setPrefix('com.app.news')
	.setStorageType('localStorage');
  
	$stateProvider.state('app', {
		url: '/app',
        abstract: true,
		cache:false,
		views:{
			'contenido-app':{
       			templateUrl: 'screens/app.html',
				controller:'Aplicacion'
			}
		}
    })
	.state('login', {
        url: '/login',
        views: {
            'contenido-app': {
                templateUrl: 'screens/login.html',
                controller: 'Login'
            },
        }
    })
	.state('registro', {
        url: '/registro',
        views: {
            'contenido-app': {
                templateUrl: 'screens/registro.html',
                controller: 'Registro'
            },
        }
    })
	.state('recuperar', {
        url: '/recuperar',
		params:{
			Correo:null
		},
        views: {
            'contenido-app': {
                templateUrl: 'screens/recuperar.html',
                controller: 'Recuperar'
            },
        }
    })
	.state('app.home', {
        url: '/home',
        views: {
            'contenido-home': {
                templateUrl: 'screens/home.html',
                controller: 'Home'
            }
        }
    })
	.state('app.perfil', {
        url: '/perfil',
		cache:false,
        views: {
            'contenido-home': {
                templateUrl: 'screens/perfil.html',
                controller: 'Perfil'
            }
        },
		params: {
     		user: null,
			back:null,
   		},
    })
	.state('app.menu', {
        url: '/menu',
		cache:false,
        views: {
            'contenido-home': {
                templateUrl: 'screens/menu.html',
                controller: 'Menu'
            }
        },
    })
	.state('app.cuenta', {
        url: '/cuenta',
		cache:false,
        views: {
            'contenido-home': {
                templateUrl: 'screens/cuenta.html',
                controller: 'Cuenta'
            }
        },
    })
	.state('app.pago', {
        url: '/pago',
		cache:false,
        views: {
            'contenido-home': {
                templateUrl: 'screens/pago.html',
                controller: 'Pago'
            }
        },
    })
	.state('app.preferencias', {
        url: '/preferencias',
		cache:false,
        views: {
            'contenido-home': {
                templateUrl: 'screens/preferencias.html',
                controller: 'Preferencias'
            }
        },
    })
	.state('app.terminos', {
        url: '/terminos',
		cache:false,
        views: {
            'contenido-home': {
                templateUrl: 'screens/terminos.html',
                controller: 'Terminos'
            }
        },
    })
	.state('app.chats', {
        url: '/chats',
        views: {
            'contenido-home': {
                templateUrl: 'screens/chats.html',
                controller: 'Chats'
            }
        }
    })
	.state('app.chat', {
        url: '/chat',
        views: {
            'contenido-home': {
                templateUrl: 'screens/chat.html',
                controller: 'Chat'
            }
        },
		cache:false,
		params: {
     		user: null
   		},
    })
	/*.state('app.registro', {
        url: '/registro',
		abstract: true,
        views: {
            'contenido-app': {
                templateUrl: 'screens/registro.html',
                controller: 'Registro'
            },
        }
    })
	.state('app.registro.datos', {
        url: '/datos',
        views: {
            'contenido-registro': {
                templateUrl: 'screens/registro_datos.html',
            },
        }
    })
	.state('app.registro.codigo', {
        url: '/codigo',
        views: {
            'contenido-registro': {
                templateUrl: 'screens/registro_codigo.html',
            },
        }
    })
	.state('app.registro.final', {
        url: '/final',
        views: {
            'contenido-registro': {
                templateUrl: 'screens/registro_final.html',
            },
        }
    })
	.state('app.recuperar', {
        url: '/recuperar',
        views: {
            'contenido-app': {
                templateUrl: 'screens/recuperar.html',
				controller: 'Recuperar'
            },
        }
    })
	.state('app.home',{
		url:'/home',
		abstract:true,
		views:{
			'contenido-app':{
				templateUrl: 'screens/home.html',
				controller: 'Home'
			}
		}
	})
	.state('app.home.mapa', {
        url: '',
		id:1,
        views: {
            'contenido-home': {
                templateUrl: 'screens/mapa.html',
				controller: 'Mapa'
            },
			'contenido-menu':{
				templateUrl: 'screens/menu.html',
				controller: 'Menu'
			}
        }
    })
	.state('app.home.notificaciones', {
        url: '',
		id:2,
        views: {
            'contenido-home': {
                templateUrl: 'screens/notificaciones.html',
				controller: 'Notificaciones'
            },
        }
    })
	.state('app.home.contactos', {
        url: '',
		id:3,
        views: {
            'contenido-home': {
                templateUrl: 'screens/contactos.html',
				controller: 'Contactos'
            },
        }
    })
	.state('app.home.reportes', {
        url: '',
		id:4,
        views: {
            'contenido-home': {
                templateUrl: 'screens/reportes.html',
				controller: 'Reportes'
            },
        }
    })*/
	$urlRouterProvider.otherwise('/login');
})
// directives
.directive('autolinker', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function() {
          var eleHtml = element.html();

          if (eleHtml === '') {
            return false;
          }

          var text = Autolinker.link(eleHtml, {
            className: 'autolinker',
            newWindow: false
          });

          element.html(text);

          var autolinks = element[0].getElementsByClassName('autolinker');

          for (var i = 0; i < autolinks.length; i++) {
            angular.element(autolinks[i]).bind('click', function(e) {
              var href = e.target.href;
              console.log('autolinkClick, href: ' + href);

              if (href) {
                //window.open(href, '_system');
                window.open(href, '_blank');
              }

              e.preventDefault();
              return false;
            });
          }
        }, 0);
      }
    }
  }
])