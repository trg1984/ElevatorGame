function Elevator(place, config) {
	
	this.config = {
		floors: [],
		floorIndex: -1,
		currentPos: 0,
		height: 120, // Height of the elevator.
		center: 180 // target for people to move to
	};
	
	this.initialize(place, config);
}

Elevator.prototype.fireEvent = function(eventArray, parameter){
	for(i = 0; i < eventArray.length; i++) {
		eventArray[i](parameter);
	}
}

Elevator.prototype.registerToElevatorEvents = function(openCallback, closeCallback) {
	this.registerToElevatorStartEvent(openCallback);
	this.registerToElevatorStopEvent(closeCallback);
}

Elevator.prototype.registerToElevatorStartEvent = function(callback) {
	this.pushToArray(this.elevatorStartEvent, callback);
}

Elevator.prototype.unregisterToElevatorStartEvent = function(callback) {
	this.removeFromArray(this.elevatorStartEvent, callback);
}

Elevator.prototype.registerToElevatorStopEvent = function(callback) {
	this.pushToArray(this.elevatorStopEvent, callback);
}

Elevator.prototype.registerToDoorEvents = function(openCallback, closeCallback) {
	this.registerToDoorOpenEvent(openCallback);
	this.registerToDoorCloseEvent(closeCallback);
}

Elevator.prototype.registerToDoorCloseEvent = function(callback) {
	this.pushToArray(this.doorsCloseEvent, callback);
}

Elevator.prototype.unregisterToDoorCloseEvent = function(callback) {
	this.removeFromArray(this.doorsCloseEvent, callback);
}

Elevator.prototype.registerToDoorOpenEvent = function(callback) {
	this.pushToArray(this.doorsOpenEvent, callback);
}

Elevator.prototype.unregisterToDoorOpenEvent = function(callback) {
	this.removeFromArray(this.doorsOpenEvent, callback);
}

Elevator.prototype.pushToArray = function(array, element) {
	array.push(element);
}

Elevator.prototype.removeFromArray = function(array, element) {
	for (i = 0; i < array.length; ++i){
		if (array[i] == element) {
			array.splice(i,1);
			return;
		}
	}
}
	
Elevator.prototype.getCurrentFloor = function(){
	return this.config.floors[this.config.floorIndex];
}

Elevator.prototype.moveUp = function(n) {
	this.fireEvent(this.elevatorStartEvent); // NOTE what does this do with just one parameter?
	console.log('before: ', this.config.floorIndex, this.config.floors.length, this.config.currentPos);
	this.config.floors[this.config.floorIndex].changeUpButtonState(false);
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
	this.fireEvent(this.elevatorStartEvent); // NOTE what does this do with just one parameter?
	console.log('before: ', this.config.floorIndex, this.config.floors.length, this.config.currentPos);
	this.config.floors[this.config.floorIndex].changeDownButtonState(false);
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

Elevator.prototype.insertFloor = function(floor, index) {
	this.config.floors.splice(index, 0, floor);
	if (this.config.floors.length === 1) {
		this.currentFloor =  this.config.floors[0];
		this.config.currentPos = this.currentFloor.config.elevatorPos;
		this.place.css('top', this.config.currentPos);
	}
}

Elevator.prototype.getFloor = function(n) {
	return this.config.floors[n];
}

Elevator.prototype.initialize = function(place, config) {
	var self = this;
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
	
	this.doorsOpenEvent = []; //after doors have opened
	this.doorsCloseEvent = []; //after doors have closed
	this.elevatorStopEvent = []; //when elevator stops
	this.elevatorStartEvent = []; //when elevator starts
	
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
	
	var transitionEndEventName = "transitionend";
	
	//transition for elevator, for hiding/showing people
	this.place[0].addEventListener(transitionEndEventName, function(e){
		self.fireEvent(self.elevatorStopEvent, self.config.currentPos);	
	},false);
	
	//transition for doors, so people can walk out
	this.place.find('.part.leftDoor, .part.rightDoor')[0].addEventListener(
		transitionEndEventName,
		function(e) {
			var currentFloor = self.config.floors[self.config.floorIndex];
			e.stopPropagation();
			if(self.doorsOpen()){
				self.fireEvent(self.doorsOpenEvent, currentFloor);
			}else{
				self.fireEvent(self.doorsCloseEvent, currentFloor);		
			}
		},
		false
	);
}

Elevator.prototype.toggleTimeLapse = function() {
	this.place.toggleClass('timeLapse');
	this.place.find('.part.leftDoor, .part.rightDoor').toggleClass('timeLapse');
}


Elevator.prototype.toggleDoors = function() {
	// TODO only open doors if elevator is not moving.
	//	if(!this.doorsOpen())
		
	this.place.find('.part.leftDoor, .part.rightDoor').toggleClass('open');
}

Elevator.prototype.doorsOpen = function() {
	return this.place.find('.part.leftDoor, .part.rightDoor').hasClass('open');
}
