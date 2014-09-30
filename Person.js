function Person(place, config) {

	/*this.config = {
		name: 'Untitled', // Name of the person.
		picUrl: 'gfx/Person.png', // Persons's graphic.
		height: 110, // Height of the person in pixels.
		targetElevator: null,
		startingFloor: 0,
		targetFloor: 0
	};*/
	this.config = config;
	
	this.initialize(place, config);
	
	this.moveToElevator = function(){
		place[0].style.left = config.targetElevator.place[0].style.left;
	}
	
	window.setTimeout(this.moveToElevator,1000);
}

Person.prototype.initialize = function(place, config) {
	this.place = place;
	this.place
		.empty()
		.addClass('person')
		.append(
			'<div class="scene part person walkAnimation" style="background-image: url(' + this.config.picUrl + '); width: 40px; height: ' + this.config.height + 'px;"></div>'
		);
}