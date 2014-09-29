function Person(place, config) {

	this.config = {
		name: 'Untitled', // Name of the person.
		picUrl: 'gfx/Person.png', // Persons's graphic.
		height: 110 // Height of the person in pixels.		
	};
	
	this.initialize(place, config);
	
	document.addEventListener("click", function(e){
		document.getElementById('Person1').style.top=e.clientY+'px';
		document.getElementById('Person1').style.left=e.clientX+'px';
	});
}

Person.prototype.initialize = function(place, config) {
	this.place = place;
	this.place
		.empty()
		.addClass('person')
		.append(
			'<div class="scene part person" style="background-image: url(' + this.config.picUrl + '); width: 40px; height: ' + this.config.height + 'px; top:0px;"></div>'
		);
}