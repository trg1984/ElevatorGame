function CodeEditor(place, config) {
	this.config = {
		// No default parameters.
	};
	this.initialize(place, config);
}

CodeEditor.prototype.initialize = function(place, config) {
	this.place = typeof(place) === 'undefined' ? $('body') : place;
	this.place.addClass('codeEditor');

	for (var item in config) this.config[item] = config[item];
	
	this.draw();
}

CodeEditor.prototype.draw = function() {
	this.place
		.empty()
		.append('<div class="topmenu"></div><textarea class="codearea"></textarea><div class="output" id="output1"></div><div class="inspector"></div><div class="eventView"></div>');
}