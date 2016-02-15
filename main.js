$(function() {
	$('.swipe-item').swipeButtons({
		elementClick: function(e, element) {
			console.log('click');
		},
		actions: function(element) {
			var btns = [{
				html: '<span class="glyphicon glyphicon-remove font-size-25"></span>',
				cssClass: 'btn btn-danger no-radius no-border',
				htmlOptions: {
					'title': 'Remove this message'
				},
				callback: function(e){
					console.log('2');
				}
			},{
				html: '<span class="glyphicon glyphicon-remove font-size-25"></span>',
				cssClass: 'btn btn-danger no-radius no-border',
				htmlOptions: {
					'title': 'Remove this message'
				},
				callback: function(e, btn){
					console.log('1');
				}
			}]

			if(element.data('test')) {
				btns.push({
					html: '<span class="glyphicon glyphicon-ok font-size-25"></span>',
					cssClass: 'btn btn-success no-radius no-border',
					htmlOptions: {
						'title': 'Remove this message'
					},
					callback: function(e){
						console.log('3');
					}
				});
			}

			return btns;
		}
	});
});
