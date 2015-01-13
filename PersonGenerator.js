function PersonGenerator(gameDiv, targetElevator) {

	this.gameDiv = gameDiv;
	this.personCount = 0;
	this.targetElevator = targetElevator;
}

PersonGenerator.prototype.determineTargetFloor = function(startingFloor) {
	
	var targetFloor;
	do {
		targetFloor = this.getRandomFloor();
	} while(targetFloor == startingFloor);
	
	return targetFloor;
}

PersonGenerator.prototype.getRandomFloor = function() {
	return this.targetElevator.config.floors[this.getRandomInt(0, this.targetElevator.config.floors.length)];
}

PersonGenerator.prototype.createPerson = function(presets) {
	
	var startingFloor = this.getRandomFloor();
	var defaults = {
		name: 'Untitled', // Name of the person.
		picUrl: 'gfx/Person.png', // Persons's graphic.
		height: 110, // Height of the person in pixels.
		targetElevator: this.targetElevator,
		startingFloor: startingFloor,
		targetFloor: this.determineTargetFloor(startingFloor),
		patience: 1000,
		patienceRefreshRate: 100
	};
	for (var item in presets) defaults[item] = presets[item];
	
	if (typeof(defaults.startingFloor) === 'number')
		defaults.startingFloor = this.targetElevator.getFloor(defaults.startingFloor);
	
	if (typeof(defaults.targetFloor) === 'number')
		defaults.targetFloor = this.targetElevator.getFloor(defaults.targetFloor);
	
	this.gameDiv.append(
		'<div id="Person' + this.personCount + '" class="person moveTransition"' +
		'style="top:' + this.calculateTopOffset(defaults.startingFloor) + 'px; left:' + this.determineSideOffset(defaults.startingFloor) + '"></div>'
	);
	var person = new Person(
		$('#Person' + this.personCount), 
		defaults
	);
	this.personCount++;
}

PersonGenerator.prototype.calculateTopOffset = function(targetFloor){
	return targetFloor.getWalkableHeight();
}

PersonGenerator.prototype.determineSideOffset = function(floor){
	var side = Math.round(Math.random()); //0 for left side, 1 for right
	return side * (floor.config.width - 40); //40 is the width of people sprites
}
PersonGenerator.prototype.getRandomInt = function(min, max){
	min = Math.floor(min);
	max = Math.ceil(max);
	//console.log(min, max);
	return Math.floor(Math.random() * (max - min)) + min;
}