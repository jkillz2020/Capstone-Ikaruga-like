// angular.module('Ikaruga-like')
//   .controller('auth-ctrl', function($location, AuthFactory) {
//     const auth = this;

//     auth.login = function () {
//       AuthFactory.verifyLogin(auth.user)
//       .then(() => {$location.path('/ikaruga-like')})
//       .catch((error) => console.log(error));
//     };

//     auth.register = function() {
//       AuthFactory.registerNew(auth.user)
//       .then((res) => (AuthFactory.createUserObject(res, auth.user)))
//       .then(() => (AuthFactory.verifyLogin(auth.user)))
//       .then(() => {$location.path('/ikaruga-like')})
//       .catch((error) => console.log(error));
//     };

//   });