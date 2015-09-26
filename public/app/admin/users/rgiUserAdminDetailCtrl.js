angular
    .module('app')
    .controller('rgiUserAdminDetailCtrl', function (
        $scope,
        $routeParams,
        $location,
        ngDialog,
        rgiNotifier,
        rgiUserSrvc,
        rgiDocumentSrvc,
        rgiUserMethodSrvc
    ) {
        'use strict';
        $scope.role_options = [
            // {value: 'admin', text: 'Administrator'},
            {value: 'supervisor', text: 'Supervisor'},
            {value: 'researcher', text: 'Researcher'},
            {value: 'reviewer', text: 'Reviewer'}
        ];

        rgiUserSrvc.get({_id: $routeParams.id}, function (user) {
            $scope.user = user;
            $scope.user.document_details = [];
            console.log(user);
            user.documents.forEach(function (doc_id) {
                rgiDocumentSrvc.get({_id: doc_id}, function (doc) {
                    $scope.user.document_details.push(doc);
                });
            });
        });

        $scope.editUserDialog = function () {
            $scope.value = true;
            ngDialog.open({
                template: 'partials/dialogs/edit-user-dialog',
                controller: 'rgiEditUserDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };
        $scope.deleteConfirmDialog = function () {
            $scope.value = true;
            ngDialog.open({
                template: 'partials/dialogs/delete-profile-confirmation-dialog',
                controller: 'rgiDeleteProfileDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        //$scope.userDelete = function () {
        //    var user_deletion = $scope.user._id;
        //
        //    rgiUserMethodSrvc.deleteUser(user_deletion).then(function () {
        //        $location.path('/admin/user-admin');
        //        rgiNotifier.notify('User account has been deleted');
        //    }, function (reason) {
        //        rgiNotifier.error(reason);
        //    });
        //};
    });