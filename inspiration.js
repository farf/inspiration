angular.module('inspiration', ['services', 'ngAnimate'])
.value('search', {})
.controller('Ctrl', ['$scope', 'Filters', 'Results', function($scope, Filters, Results) {
	$scope.nbYears = 3;
	$scope.offsetMonth = 3;
	$scope.currentFilters = Filters;
	$scope.results = Results.results;
	
	$scope.changeCurrentFilter = function(filter) {
		Filters.currentFilter = filter;
	}
	Filters.year = 2013;
}])
.filter('month', function() {
	return function(input) {
		var frenchMonths = ['Pas de mois fixe','Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
		return frenchMonths[input];
	}
})
.filter('nbDays', function() {
	return function(input) {
		var texts = ['un long week-end','une semaine', '10 jours', '2 semaines', '3 semaines', 'un mois', "plus d'un mois"];
		return texts[input];
	}
})
.directive('evDatepicker', ["$timeout", function($timeout) {
	
	function link($scope, element, attrs) {
		$scope.years = getYears($scope.nbYears);
		$scope.months = getMonths($scope.year);

		$scope.$watch('year', function() {
			$scope.months = getMonths($scope.year);
		});

		$scope.setYear = function(year) {
			$scope.year = year;
		}

		$scope.setMonth = function(month) {
			$scope.month = month;
			var scope = $scope;
			$timeout(function() {scope.clickMonth()}, 5);
		}

	}

	function getYears(nb) {
		var years = [];
		var currentYear = new Date().getFullYear();
		for (var i = 0 ; i < nb; i++) {
			years.push(currentYear++);
		}
		return years;
	}

	function getMonths(year) {
		var months = [];
		
		if (new Date().getFullYear() == year) {
			var currentMonth = new Date().getMonth();
		} else {
			var currentMonth = 1; 
		}
		for (var i = currentMonth; i < 13 ; i++) {
			months.push(i);
		}
		return months;

	}

	return {
		restrict: 'E',
    	templateUrl: 'datePicker.html',
    	scope: {
    		nbYears: '=',
    		offsetMonth: '=',
    		year: '=',
    		month: '=',
    		clickMonth: '&'
    	},
    	link: link
    };
}])		
.directive('evNbDaysPicker',["$timeout", function($timeout) {
	
	function link($scope, element, attrs) {
		$scope.nbDaysList = getNbDaysList();

		$scope.setNbDays = function(nbDays) {
			$scope.nbDays = nbDays;
			var scope = $scope;
			$timeout(function() {scope.clickNbDays()}, 5);
			
		}
	}

	function getNbDaysList() {
		var nbDaysList = [];
		for (var i = 0 ; i < 10; i++) {
			nbDaysList.push(i);
		}
		return nbDaysList;
	}

	return {
		restrict: 'E',
    	templateUrl: 'nbDaysPicker.html',
    	scope: {
    		nbDays: '=',
    		clickNbDays: '&'
    	},
    	link: link
    };
}])
.directive('evFlash', ['$animate', function($animate) {
	return {
		link: function(scope, element, attrs) {
			scope.$watch(attrs.ngBind, function (newValue, oldValue) {
				if (oldValue !== newValue) {
					$animate.addClass(element, "flash");
				}
            });
		}
    };
}])
.directive('evLoader', function() {
	return {
		restrict: 'E',
    	templateUrl: 'evLoader.html',
    	scope: {
    		delay: '=',
    		complete: '='
    	},
    	link: function($scope, elements, attrs) {
    		var r = Math.round(Math.random()*1000000).toString();
    		$scope.clippathurl = 'url(#clip'+r+')';
    		$scope.clippathid = 'clip' + r;
    		$scope.pathhref = '#clipp'+r;
    		$scope.pathid = 'clipp' + r;
    	}
	};
})
.directive('evResult', ["$timeout", function($timeout) {

	
	function link($scope, elements, attrs) {
		$scope.indexArgument = 0;
		$scope.arguments = new Array();
		$scope.arguments.push({picture:$scope.result.picture, title:$scope.result.title, subtitle: $scope.result.subtitle});
		$scope.arguments = $scope.arguments.concat($scope.result.arguments);
		
		var timerId = 0;

		$scope.initTimer = function() {
			if (timerId === 0 ) {
				$scope.indexArgument = 1;
				timer()
			};
		}

		$scope.stopTimer = function() {
			$timeout.cancel(timerId);
			$scope.indexArgument = 0;
			timerId = 0;
		}

		$scope.setIndexArgument = function(index) {
			$timeout.cancel(timerId);
			timerId = 0;
			// to force animation from beginning in svg :( 
			$scope.indexArgument = 0;
			$scope.$apply();
			$scope.indexArgument = index;
			timer();
		}

		function timer() {
			if ($scope.indexArgument < $scope.arguments.length ) {
				timerId = $timeout(function() {
					$scope.indexArgument++;
					timer();
				}, 3000);
			}
			
		}
	}

	return {
		restrict: 'E',
    	templateUrl: 'evResult.html',
    	scope: {
    		delay: '=',
    		number: '=',
    		result: '='
    	},
    	link: link
	};
}])

;