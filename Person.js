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
	
	//there is probably a better way to do this with less repetition
	this.transitionEndEventName = "transitionend";
	this.animationEndEventName = "animationend";
	this.transitionEndEvent = function(){
		console.log("transition ended for person");
		var person = $(place[0]).find('.person')[0];
		person.className=person.className.replace("walkAnimation","turnAnimation");
		place[0].removeEventListener(this.transitionEndEventName, this.transitionEndEvent);
	}
	this.animationEndEvent = function(){
		console.log("animation ended for person");
		var person = $(place[0]).find('.person')[0];
		person.className=person.className.replace("turnAnimation","waitForElevator");
		person.removeEventListener(this.animationEndEventName, this.animationEndEvent);
	}
	
	place[0].addEventListener(this.transitionEndEventName, this.transitionEndEvent, false);
	place[0].addEventListener(this.animationEndEventName, this.animationEndEvent, false);
	
	this.moveToElevator = function(){
		if(place[0].style.left < config.targetElevator.place[0].style.left)
			place[0].style.transform="scaleX(-1)";
		else
			place[0].style.transform="scaleX(1)";
		place[0].style.left = (config.targetElevator.config.center+(Math.random()*40)-20)+'px';
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