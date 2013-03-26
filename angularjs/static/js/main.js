angular.module('dbl', []).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/p', {
        templateUrl: 'partials/square.html', 
        controller: PageController
    }).when('/p/:page', {
        templateUrl: 'partials/square.html', 
        controller: PageController
    }).when('/gn', {
        templateUrl: 'partials/loading.html', 
        controller: NextController
    }).when('/gp', {
        templateUrl: 'partials/loading.html', 
        controller: PrevController
    }).otherwise({
        redirectTo: '/'
    });
}]);

var DBL = {
    page: 1
};

function PageController($scope, $http, $routeParams) {
    DBL.page = $routeParams.page || DBL.page;
    var dbl_url = 'http://api.dribbble.com/shots/everyone?page=' + DBL.page + '&callback=JSON_CALLBACK'
    $http.jsonp(dbl_url).success(function(resp) {
        $scope.square = resp.shots;
    });
}

function NextController($scope, $location,  $routeParams) {
    $location.path('/p/' + (parseInt(DBL.page, 10) + 1));
}

function PrevController($scope, $location,  $routeParams) {
    $location.path('/p/' + (parseInt(DBL.page, 10) - 1));
}
