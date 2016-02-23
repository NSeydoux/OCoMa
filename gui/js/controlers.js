var ocoma = angular.module('ocoma', []);

ocoma.controller('bookListCtrl', function ($scope, $http) {
	$scope.books = [
		{'title': 'Born to be a larve',
		'series': 'Notes',
		'author': 'Boulet',
		'edition': 'shampooing',
		'status': 'dans le salon'},
		 {'title': 'Le petit théâtre de la rue',
		 'series': 'Notes',
		 'author': 'Boulet',
		 'edition': 'shampooing',
		 'status': 'dans le salon'},
		 {'title': 'La viande c\'est la force',
		'series': 'Notes',
		'author': 'Boulet',
		'edition': 'shampooing',
		'status': 'dans le salon'}
	];
	
	$scope.addBook = function(){
		console.log("adding book");
		$scope.books.push({"title":$scope.newTitle, "series":$scope.newSeries, "author":$scope.newAuthor, "edition":$scope.edition, "status":"dans le salon"});
		$("#add-comic-modal").find(':input').each(function () {
			switch (this.type) {
				case 'password':
				case 'select-multiple':
				case 'select-one':
				case 'text':
				case 'textarea':
					$(this).val('');
					break;
				case 'checkbox':
				case 'radio':
					this.checked = false;
			}
		});
		$("#add-comic-modal").modal('hide');
	}
});
