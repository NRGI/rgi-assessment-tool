// angular.module('app').factory('rgiUtils', function(rgiToastr) {
//   return {
//     notify: function(msg) {
//       rgiToastr.success(msg);
//       console.log(msg);
//     },
//     error: function(msg) {
//       rgiToastr.error(msg);
//       console.log(msg);
//     }
//   }


// angular.module('app').filter('capitalize', function() {
//   return function(input, all) {
//     return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
//   }
// });