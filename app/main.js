"use strict"
var app = angular.module("Ikaruga-like", ["ngRoute"])
  .constant("firebaseURL","https://ikaruga-like.firebaseio.com/")
  

// let isAuth = (AuthFactory) => new Promise ((resolve, reject) => {
//   if(AuthFactory.isAuthenticated()){
//     console.log("User is authenticated, resolve route promise");
//     resolve();
//   } else {
//     console.log("User is not authenticated, reject route promise");
//     reject();
//   }
// })

app.config(function($routeProvider){
  $routeProvider.
    when('/',{
      templateUrl: 'partials/game.html',
      controller: 'GameplayCtrl',
       // resolve: {isAuth}
    }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: "LoginCtrl"
      
      }).
      when('/logout', {
        templateUrl: 'partials/login.html',
        controller: "LoginCtrl"
      }).
      otherwise('/');
});


app.run(($location) =>{
  let todoRef = new Firebase("https://ikaruga-like.firebaseio.com/");
  todoRef.unauth();

  todoRef.onAuth(authData =>{
    if(!authData){
      $location.path("/login");
    }
  })
})
