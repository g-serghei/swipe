// REQUIRES jQuery UI
$.fn.swipe = function(options){

    var defaults = {
		actions: {},
		buttonWidth: 50,
        elemClick: null,
		onDrag: null,
		onStart: null,
		onStop: null
    }

    options = $.extend(true, defaults, options);
    options = defaults;



  	var that = $(this);
	var swipe_wrapper = that.parent();
	var buttons_wrapper_width = Object.keys(options.actions).length * options.buttonWidth;
	var button_height = that.outerHeight();


	options.elementClick = function(event){
		revertSwipe(event.currentTarget);
		options.elemClick.apply(event.currentTarget, [event]);
	};

	// Attach on click event
    that.on('click', options.elementClick);

	// Hide horizontal scroll bar for parent
	that.parent().css('overflow-x', 'hidden');

	$(this).draggable({
        axis: "x",
		drag: function(event, ui){

			// Call onDrag callback
			options.onDrag && options.onDrag(event, ui);

		},
        start: function(event, ui) {

			// Revert all swiped elements
			revertSwipe(event.target);

			// Deattach on click event when start dragging
            that.off('click');

			// Call onStart callback
			options.onStart && options.onStart(event, ui);
        },
        stop: function(event, ui) {

			// Attach on click event back (after 300ms to prevent clicking on mouse up)
            setTimeout(function(){ that.on('click', options.elementClick); }, 300);

			// Call onStop callback
			options.onStop && options.onStop(event, ui);
        },
        containment: [swipe_wrapper.offset().left, 0, swipe_wrapper.offset().left + buttons_wrapper_width, 0]
    });


	var btns = getButtons();
	$.each(that, function(k, elem){
		btns.clone(true).prependTo($(elem));
	});

	function getButtons(){
		var buttons_wrapper = $('<div></div>');
		$.each(options.actions, function(k, action){
			var btn = $('<button></button>');
			btn.addClass(action.cssClass).html(action.html);
			btn.on('click', function(e){
				e.stopPropagation();
				action.callback.apply(this, [e]);
				revertSwipe(e.target);
			});
			$.each(action.htmlOptions, function(option_name, option_value){
				btn.attr(option_name, option_value);
				btn.css({
					'width': options.buttonWidth + 'px',
					'height': button_height + 'px'
				});
			});
			buttons_wrapper.append(btn);
		});

		buttons_wrapper.addClass('swipe-buttons').css({
			'position': 'absolute',
			'left': -buttons_wrapper_width + 'px',
			'top': '0',
			'width': buttons_wrapper_width + 'px'
		});
		return buttons_wrapper;
	}


	function revertSwipe(current_element){
		$.each(that, function(k, elem){
			if(elem != current_element){
				$(elem).animate({
					'left': '0'
				}, 300);
			}
		});
	}

}
