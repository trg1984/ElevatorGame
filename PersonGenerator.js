function PersonGenerator(gameDiv, targetElevator){

	this.gameDiv = gameDiv;
	this.personCount = 0;
	this.targetElevator = targetElevator;
	
	this.getNewPerson = function(){
		var startingFloor = this.getRandomFloorFromElevator(this.targetElevator);
		var targetFloor = this.determineTargetFloor(startingFloor);
		var sideOffset = this.determineSideOffset(startingFloor);
		var topOffset = this.calculateTopOffset(startingFloor);
		
		this.createPerson(topOffset, sideOffset, startingFloor, targetFloor);
	}

	this.determineTargetFloor = function(startingFloor){
		var targetFloor = startingFloor;
		while(targetFloor == startingFloor){
			targetFloor = this.getRandomFloorFromElevator(this.targetElevator);
		}
		return targetFloor;
	}
	
	this.getRandomFloorFromElevator = function(elevator){
		return elevator.config.floors[this.getRandomInt(0,elevator.config.floors.length)];;
	}
	
	this.createPerson = function(topOffset, sideOffset, startFloor, endFloor){
		this.gameDiv.append(
			'<div id="Person'+this.personCount+'" class="person moveTransition"'+
			'style="top:'+topOffset+'px; left:'+sideOffset+'"></div>'
		);
		var person = new Person($('#Person'+this.personCount), 
			{name: 'Untitled', // Name of the person.
			picUrl: 'gfx/Person.png', // Persons's graphic.
			height: 110, // Height of the person in pixels.
			targetElevator: this.targetElevator,
			startingFloor: startFloor,
			targetFloor: endFloor}
			);
		this.personCount++;
		
	}
	
	this.calculateTopOffset = function(targetFloor){
		return targetFloor.getWalkableHeight();
	}
	
	this.determineSideOffset = function(floor){
		var side = Math.random(); //0 for left side, 1 for right
		if(side>.5){
			side = 1;
		}else{
			side = 0;
		}
		return side*(floor.config.width-40); //40 is the width of people sprites
	}
	this.getRandomInt = function(min, max){
		min = Math.floor(min);
		max = Math.ceil(max);
		console.log(min+' '+max);
		return Math.floor(Math.random()*(max-min))+min;
	}
}