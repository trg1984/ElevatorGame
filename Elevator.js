function Elevator(place, config) {

	var doorsOpenEvent = [];

	this.config = {
		floors: [],
		floorIndex: -1,
		currentPos: 0,
		height: 120, // Height of the elevator.
		center: 180 // target for people to move to
	};
	
	this.initialize(place, config);
	
	var self = this;
	
	var transitionEndEventName = "transitionend";
	$("#elevator")[0].addEventListener(transitionEndEventName, function(){
		if(self.doorsOpen()){
			for(i=0; i<doorsOpenEvent.length; i++){
				doorsOpenEvent[i](self.config.floors[self.config.floorIndex]);
			}
		}
	},false);
	
	this.registerToDoorOpenEvent = function(callback){
		doorsOpenEvent.push(callback);
	}
	
	this.unregisterToDoorOpenEvent = function(callback){
		for(i=0; i<doorsOpenEvent.length;i++){
			if(doorsOpenEvent[i] == callback){
				doorsOpenEvent.splice(i,1);
				return;
			}
		}
	}
}

Elevator.prototype.insertFloor = function(floor, index) {
	this.config.floors.splice(index, 0, floor);
	if (this.config.floors.length === 1) {
		this.currentFloor =  this.config.floors[0];
		this.config.currentPos = this.currentFloor.config.elevatorPos;
		this.place.css('top', this.config.currentPos);
	}
}

Elevator.prototype.initialize = function(place, config) {
	this.place = place;
	this.place
		.empty()
		.addClass('elevator')
		.append(
			'<div class="box part"></div>' +
			'<div class="door leftDoor part"></div>' +
			'<div class="door rightDoor part"></div>' +
			'<div class="frame part"></div>'
		);
	
	if (typeof(config) === 'object') for (var item in config) this.config[item] = config[item];
	if (this.config.floors.length > 0) {
		var usedSpace = 0;
		for (var i = 0; i < this.config.floors.length; ++i) {
			this.config.floors[i].setCurrentPos(usedSpace);
			usedSpace += this.config.floors[i].config.height;
		}
		
		this.config.floorIndex = 0;
		this.currentFloor =  this.config.floors[this.config.floorIndex];
		this.config.currentPos = this.currentFloor.config.elevatorPos;
		this.place.css('top', this.config.currentPos);
		this.place.css('left', '140px');
		
	}
	
}

Elevator.prototype.toggleTimeLapse = function() {
	this.place.toggleClass('timeLapse');
	this.place.find('.part.leftDoor, .part.rightDoor').toggleClass('timeLapse');
}


Elevator.prototype.toggleDoors = function() {
	// TODO only open doors if elevator is not moving.
	this.place.find('.part.leftDoor, .part.rightDoor').toggleClass('open');
}

Elevator.prototype.doorsOpen = function() {
	return this.place.find('.part.leftDoor, .part.rightDoor').hasClass('open');
}

Elevator.prototype.moveUp = function(n) {
	console.log('before: ', this.config.floorIndex, this.config.floors.length, this.config.currentPos);
	if (!this.doorsOpen() && (this.config.floorIndex > 0)) {
		
		// Move up to the next floor's elevator position.
		this.config.currentPos -= this.currentFloor.config.elevatorPos;
		--this.config.floorIndex;
		this.currentFloor = this.config.floors[this.config.floorIndex];
		this.config.currentPos -= this.currentFloor.config.height - this.currentFloor.config.elevatorPos;
		
		this.place.css('top', this.config.currentPos);
	}
	console.log('after: ', this.config.floorIndex, this.config.floors.length, this.config.currentPos);
}

Elevator.prototype.moveDown = function(n) {
	console.log('before: ', this.config.floorIndex, this.config.floors.length, this.config.currentPos);
	if (!this.doorsOpen() && (this.config.floorIndex < this.config.floors.length - 1)) {
		//debugger;
		// Move down to the previous floor's elevator position.
		this.config.currentPos += this.currentFloor.config.height - this.currentFloor.config.elevatorPos;
		++this.config.floorIndex;
		this.currentFloor = this.config.floors[this.config.floorIndex];
		this.config.currentPos += this.currentFloor.config.elevatorPos;
		
		this.place.css('top', this.config.currentPos);
	}
	console.log('after: ', this.config.floorIndex, this.config.floors.length, this.config.currentPos);
}
