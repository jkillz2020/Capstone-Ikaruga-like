"use strict";
angular.module('Ikaruga-like')
  .factory("GameplayCtrl", function($q, $http, firebaseURL, AuthFactory){
//loads game object from firebase//
  var getGameObjects = function(go){
      let game = [];
      return $q(function(resolve, reject){
        $http.get(`${firebaseURL}?s=${go}=json`)
          .success(function(gameObject){
            console.log("gameObject", gameObject);
            var gameCollection = gameObject;
            Object.keys(gameCollection).forEach(function(key){
              gameCollection[key].id=key;
              game.push(gameCollection[key]);
            })
            console.log("game", game);
            resolve(game);
          }, function(error){
            reject(error);
      })
    })};
//posts user stats to game object to track by linking user id//
      var postNewGame = function(newGame) {
    let user = AuthFactory.getUser();
  console.log("qwerttreweq", newGame);
  return $q(function(resolve, reject){
    $http.post(
        firebaseURL,
        JSON.stringify({
          assets: newGame.assets,
          groups: newGame.groups,
          prefabs: newGame.prefabs,
          world: newGame.world,
          shots_fired: newGame.shots_fired,
          enemies_killed: newGame.enemies_killed,
          lives_lost: newGame.lives_lost,
          uid: user.uid
        })
      )
        .success(
          function(objectFromFirebase) {
            resolve(objectFromFirebase);
          });
  })
}; 
//calls game stats based on user logged in//
var getMyGameStats = function(){
      let myGame = [];
      let user = AuthFactory.getUser();
      return $q(function(resolve, reject){
        $http.get(`${firebaseURL}game.json?orderBy="uid"&equalTo="${user.uid}"`)
          .success(function(gameObject){
            // console.log("gameObject", gameObject);
            var gameCollection = gameObject;
            Object.keys(movieCollection).forEach(function(key){
              gameCollection[key].id=key;
              myGames.push(gameCollection[key]);
            })
            console.log("myGame", myGame);
            resolve(myGame);
          }, function(error){
            reject(error);
      })
    })};

//update game stats per user
  var updateGame = function(gameId) {
                   console.log("gameId.shots_fired", gameId.shots_fired);
        return $q(function(resolve, reject) {
            $http.put(
                firebaseURL + gameId.id + ".json",
                JSON.stringify({
                  assets: gameId.assets,
                  groups: gameId.groups,
                  prefabs: gameId.prefabs,
                  world: gameId.world,
                  shots_fired: gameId.shots_fired,
                  enemies_killed: gameId.enemies_killed,
                  lives_lost: gameId.lives_lost,
                  uid: gameId.uid
                  
                })
        )
            .success(
                function(objectFromFirebase) {
                    resolve(objectFromFirebase);    
      })
      })
        }   
//delete a specific user's game
var deleteGame = function(gameId) {
        return $q(function(resolve, reject) {
            $http
                .delete(firebaseURL + "ikaruga-like/" + gameId + ".json")
                .success(function(objectFromFirebase) {
                  console.log("this array after the delete", objectFromFirebase)
                    resolve(objectFromFirebase)
                });
        });
};

  return {getGameObjects:getGameObjects, postNewGame:postNewGame, getMyGameStats:getMyGameStats, deleteGame:deleteGame, updateGame:updateGame}
})