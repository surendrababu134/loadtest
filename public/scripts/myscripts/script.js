var app=angular.module('main',['ngRoute','toastr']);

app.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl:'./components/home.html',
		controller:'homeCtrl'
	}).when('/login',{
		templateUrl:'./components/login.html',
		controller:'loginCtrl'
	})
	.when('/dashboard',{
		templateUrl:'./components/dashboard.html',
		controller:'loginCtrl'
	})
	.otherwise({
		template:'404'
	})
})

app.controller('homeCtrl',function($scope,$location){
	$scope.goToLogin=function(){
		$location.path('/login');
	};
	$scope.register=function(){
		$location.path('/register');
	}
})
app.controller('loginCtrl',function($scope,$http,$location,toastr){
	$scope.urlDetails={};
	$scope.requestTable = false;
	$scope.requestList={};
	$scope.testingMethod = function(){
		if(!$scope.urlDetails.httpRequest){
			toastr.error('Please fill Protocol type.');
			$scope.requestList.isResolved=true;
			return false;
		}
		if(!$scope.urlDetails.url){
			toastr.error('Please fill API.');
			$scope.requestList.isResolved=true;
			return false;
		}
		if(!$scope.urlDetails.urlmethod){
			toastr.error('Please select Request method.');
			$scope.requestList.isResolved=true;
			return false;
		}
		if(!$scope.urlDetails.requestCount){
			toastr.error('Please select number of requests.');
			$scope.requestList.isResolved=true;
			return false;
		}
		$scope.requestTable = true;
		$scope.requestList.isResolved=false;
		$http.post('/loadtest',$scope.urlDetails).then(function success(response) {
			console.log(response.data);
			$scope.requestList=response.data;
			$scope.requestList.isResolved=true;

		},function error(response) {
			toastr.error('Something went wrong','Error');
			
		});
	}
})