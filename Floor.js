function Floor(place, config) {

	this.config = {
		name: 'Untitled', // Name of the floor.
		picUrl: 'gfx/floor1.png', // Floor's graphic.
		height: 180, // Height of the floor in pixels.
		elevatorPos: 40,
		currentPos: 0 // Position of the floor vertically.
	};
	
	this.initialize(place, config);
}

Floor.prototype.initialize = function(place, config) {
	this.place = place;
	this.place
		.empty()
		.addClass('floor')
		.append(
			'<div style="position: absolute; background-image: url(gfx/sides.png); z-index: 1; width: 360px; height: 180px;"></div>'+
			'<div class="scene part" style="position:absolute; background-image: url(' + this.config.picUrl + '); width: 360px; height: ' + this.config.height + 'px; z-index:0;"></div>' +
			'<div style="position: absolute; background-image: url(gfx/lowerButton.png); z-index: 0; width: 360px; height: 180px;"></div>'+
			'<div style="position: absolute; background-image: url(gfx/upperButton.png); z-index: 0; width: 360px; height: 180px;"></div>'+
			'<div class="leftDoor part"></div>' +
			'<div class="rightDoor part"></div>'
		);
	
	if (typeof(config) === 'object') for (var item in config) this.config[item] = config[item];
	this.place.css('top', this.config.currentPos);
	
}

Floor.prototype.toggleTimeLapse = function() {
	this.place.toggleClass('timeLapse');
	this.place.find('.part.leftDoor, .part.rightDoor').toggleClass('timeLapse');
}


Floor.prototype.toggleDoors = function() {
	// TODO only open and close doors if elevator is in this floor.
	this.place.find('.part.leftDoor, .part.rightDoor').toggleClass('open');
}

Floor.prototype.doorsOpen = function() {
	return this.place.find('.part.leftDoor, .part.rightDoor').hasClass('open');
}

Floor.prototype.setCurrentPos = function(newPos) {
	this.config.currentPos = newPos;
	this.place.css('top', this.config.currentPos);
	//console.log('Set floor ' + this.config.name + ' to ' + this.config.currentPos);
}