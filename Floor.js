function Floor(place, config) {

	this.callButtonChangedEvent = [];

	this.config = {
		name: 'Untitled floor',
		floorIndex: -1, // Index of the floor.
		picUrl: 'gfx/floor1.png', // Floor's graphic.
		height: 180, // Height of the floor in pixels.
		width: 360, //width in pixels
		elevatorPos: 40,
		currentPos: 0, // Position of the floor vertically.
		walkableHeight: 65
	};
	
	this.initialize(place, config);
}

Floor.prototype.getWalkableHeight = function() {
	return this.config.walkableHeight + this.config.currentPos;
};

Floor.prototype.getWidth = function() {
	return this.config.width;
};

Floor.prototype.changeUpButtonState = function(on) {
	console.log('changeUpButtonState():', on, this);
	if (on){
		this.place.find('.floorButtonUp').show();
		this.triggerCallButtonEvent(true);
	}else{
		this.place.find('.floorButtonUp').hide();
	}
};

Floor.prototype.changeDownButtonState = function(on) {
	console.log('changeDownButtonState():', on, this);
	if(on){
		this.place.find('.floorButtonDown').show();
		this.triggerCallButtonEvent(false);
	}else{
		this.place.find('.floorButtonDown').hide();
	}
};

Floor.prototype.resetFloorButtons = function() {
	this.changeDownButtonState(false);
	this.changeUpButtonState(false);
};

Floor.prototype.registerToButtonStateChange = function(callback) {
	this.callButtonChangedEvent.push(callback);
}

Floor.prototype.triggerCallButtonEvent = function(direction) {
	for(i=0; i<this.callButtonChangedEvent.length; i++){
		this.callButtonChangedEvent[i](this, direction);
	}
};

Floor.prototype.initialize = function(place, config) {
	this.place = place;
	this.place
		.empty()
		.addClass('floor')
		.append(
			'<div style="position: absolute; background-image: url(gfx/sides.png); z-index: 20; width: 360px; height: 180px;"></div>'+
			'<div class="scene part" style="position:absolute; background-image: url(' + this.config.picUrl + '); z-index: 10; width: 360px; height: ' + this.config.height + 'px;"></div>' +
			'<div class="floorButtonDown" style="position: absolute; background-image: url(gfx/lowerButton.png); z-index: 10; width: 360px; height: 180px; display: none;"></div>'+
			'<div class="floorButtonUp" style="position: absolute; background-image: url(gfx/upperButton.png); z-index: 10; width: 360px; height: 180px; display: none;"></div>'+
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