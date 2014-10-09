function Elevator(place, config) {

	var doorsOpenEvent = []; //after doors have opened
	var doorsCloseEvent = []; //after doors have closed
	var elevatorStopEvent = []; //when elevator stops
	var elevatorStartEvent = []; //when elevator starts

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
	
	//transition for elevator, for hiding/showing people
	this.place[0].addEventListener(transitionEndEventName, function(e){
		self.fireEvent(elevatorStopEvent, self.config.currentPos);	
	},false);
	
	//transition for doors, so people can walk out
	this.place.find('.part.leftDoor, .part.rightDoor')[0].addEventListener(transitionEndEventName, function(e){
		var currentFloor = self.config.floors[self.config.floorIndex];
		e.stopPropagation();
		if(self.doorsOpen()){
			self.fireEvent(doorsOpenEvent, currentFloor);
		}else{
			self.fireEvent(doorsCloseEvent, currentFloor);		
		}
	},false);
	
	this.fireEvent = function(eventArray, parameter){
		for(i=0; i<eventArray.length; i++){
			eventArray[i](parameter);
		}
	}
	
	this.registerToElevatorEvents = function(openCallback, closeCallback){
		this.registerToElevatorStartEvent(openCallback);
		this.registerToElevatorStopEvent(closeCallback);
	}
	
	this.registerToElevatorStartEvent = function(callback){
		this.pushToArray(elevatorStartEvent, callback);
	}
	
	this.unregisterToElevatorStartEvent = function(callback){
		this.removeFromArray(elevatorStartEvent, callback);
	}
	
	this.registerToElevatorStopEvent = function(callback){
		this.pushToArray(elevatorStopEvent, callback);
	}
	
	this.registerToDoorEvents = function(openCallback, closeCallback){
		this.registerToDoorOpenEvent(openCallback);
		this.registerToDoorCloseEvent(closeCallback);
	}
	
	this.registerToDoorCloseEvent = function(callback){
		this.pushToArray(doorsCloseEvent, callback);
	}
	
	this.unregisterToDoorCloseEvent = function(callback){
		this.removeFromArray(doorsCloseEvent, callback);
	}

	this.registerToDoorOpenEvent = function(callback){
		this.pushToArray(doorsOpenEvent, callback);
	}
	
	this.unregisterToDoorOpenEvent = function(callback){
		this.removeFromArray(doorsOpenEvent, callback);
	}
	
	this.pushToArray = function(array, element){
		array.push(element);
	}
	
	this.removeFromArray =function(array, element){
		for(i=0; i<array.length;i++){
			if(array[i] == callback){
				array.splice(i,1);
				return;
			}
		}
	}
	
	this.getCurrentFloor = function(){
		return self.config.floors[self.config.floorIndex];
	}
	
	this.moveUp = function(n) {
	self.fireEvent(elevatorStartEvent);
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

	this.moveDown = function(n) {
	self.fireEvent(elevatorStartEvent);
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
//	if(!this.doorsOpen())
		
	this.place.find('.part.leftDoor, .part.rightDoor').toggleClass('open');
}

Elevator.prototype.doorsOpen = function() {
	return this.place.find('.part.leftDoor, .part.rightDoor').hasClass('open');
}
