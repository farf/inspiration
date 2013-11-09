var services = angular.module('services', []);

services.value('Filters', {
    currentFilter: 'date',
	year: null,
	month: null,
	nbDays:null,
	tags: ['de la plongée', 'du trek']
});