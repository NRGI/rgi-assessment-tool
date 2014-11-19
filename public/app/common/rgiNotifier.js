angular.module('app').value('rgiToastr', toastr);

angular.module('app').factory('rgiNotifier', function(rgiToastr) {
  return {
    notify: function(msg) {
      rgiToastr.success(msg);
      console.log(msg);
    }
  }
})