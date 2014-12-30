function SwipeDrag(options) {

	this.initOptions(options);

	var self = this;
	self.options.element.on("mousedown", function(e) {
		self.element = $(this);
		self.mouseDown = true;

		var	pos_x = parseInt(self.element.css('margin-left')) + self.elemWidth - e.pageX;

		self.element.parent().off("mousemove").on("mousemove", self.mouseMove(pos_x));

		e.preventDefault();
	});

	$(document).on("mouseup", self.mouseUp());

}

SwipeDrag.prototype.initOptions = function(options) {

	var defaults = {
		onDrag: null,
		onStart: null,
		onStop: null,
		xlimit: null,
		element: null
    }

    this.options = $.extend(true, defaults, options);
	this.element = null;
	this.moved = false;
	this.mouseDown = false;
	this.elemWidth = this.options.element.first().outerWidth();
	this.options.element.css('width', this.elemWidth + 'px');

}

SwipeDrag.prototype.mouseMove = function(pos_x) {
	var self = this;
	return function(e) {
		if(!self.mouseDown) return;

		var x = e.pageX + pos_x - self.elemWidth;

		if(self.options.xlimit) {
			x > self.options.xlimit && (x = self.options.xlimit);
			x < 0 && (x = 0);
		}

		!self.moved && self.options.onStart && self.options.onStart(self.element);
		!self.moved && (self.moved = true);


		self.options.onDrag && self.options.onDrag(e);

		self.element.css({
			'margin-left': x
		}).on("mouseup", self.mouseUp());
	}
}

SwipeDrag.prototype.mouseUp = function() {
	var self = this;
	return function(e) {
		self.mouseDown = false;
		if(self.moved) {
			self.options.onStop && self.options.onStop(self.element);
			self.moved = false;
		}
	}
}


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
		revertSwipe($(event.currentTarget));
		options.elemClick.apply(event.currentTarget, [event]);
	};

    that.on('click', options.elementClick);

	that.parent().css('overflow-x', 'hidden');

	new SwipeDrag({
		element: $(this),
		onDrag: function(event, ui){
			options.onDrag && options.onDrag(event, ui);
		},
        onStart: function(elem) {
			revertSwipe(elem);
            that.off('click');
			options.onStart && options.onStart(elem);
        },
        onStop: function(elem) {
            setTimeout(function(){ that.on('click', options.elementClick); }, 300);
			options.onStop && options.onStop(elem);
        },
        xlimit: buttons_wrapper_width
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
				!action.noRevert && revertSwipe(e.currentTarget);
			});

			btn.css({
				'width': options.buttonWidth + 'px',
				'height': button_height + 'px'
			});

			action.htmlOptions && $.each(action.htmlOptions, function(option_name, option_value){
				btn.attr(option_name, option_value);
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
		that.not(current_element).animate({
			'margin-left': '0'
		}, 300);
	}

}
