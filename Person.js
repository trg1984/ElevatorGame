function Person(place, config) {

	this.config = {
		name: 'Untitled', // Name of the person.
		picUrl: 'gfx/Person.png', // Persons's graphic.
		height: 110, // Height of the person in pixels.
		targetElevator: null,
		startingFloor: null,
		targetFloor: null
	};
	
	this.initialize(place, config);
	
	var insideElevator = false;
	
	var self = this;
	var direction = 1; //scaleX; 1 walks left, -1 walks right
	
	var addEventListenerFunction = function(htmlElement, animatedElement, oldClassName, newClassName, animationEventName, animationFinishedFunction){
		htmlElement.addEventListener(animationEventName, function(){
			animatedElement.className=animatedElement.className.replace(oldClassName,newClassName);
			htmlElement.removeEventListener(animationEventName, this);
			
			if(animationFinishedFunction){
				animationFinishedFunction();
			}
		}, false);
			
	};
	
	var animatedElement = $(place[0]).find('.person')[0];
	addEventListenerFunction(place[0], animatedElement, "walkAnimation", "turnAnimation", "transitionend");
	addEventListenerFunction(place[0], animatedElement, "turnAnimation", "waitForElevator", "animationend", function(){ 
		config.targetElevator.registerToDoorEvents(reactToDoorOpenEvent, reactToDoorCloseEvent); 
	});
	
	this.moveToElevator = function(){
		var targetPos = config.targetElevator.config.center+((Math.random()*40)-20)+'px';
		self.setDirection(targetPos);
		place[0].style.transform="scaleX("+direction+")";
		self.moveTo(targetPos);
	}

	this.setDirection = function(targetLeft){
		if(place[0].style.left < targetLeft)
			direction=-1;
		else
			direction=1;
	}
	
	this.moveTo = function(left, top){
		place[0].style.left = left;
		
		if(top){
			place[0].style.top = top;
		}
	}
	
	var reactToDoorOpenEvent = function(floorOfElevator){
		if(!insideElevator && config.startingFloor == floorOfElevator){
			insideElevator = !insideElevator;
			self.moveTo((config.targetElevator.config.center-direction*(20+Math.floor(Math.random()*30)))+'px', (self.getY()-(10+Math.floor(Math.random()*10)))+'px');
			var animatedElement = $(place[0]).find('.person')[0];
			self.changeCssClassName(animatedElement, "waitForElevator", "walkIntoElevatorAnimation");
			addEventListenerFunction(place[0], animatedElement, "walkIntoElevatorAnimation", "turnInElevatorAnimation", "transitionend", function(){
				console.log("moveTransition finisher");
				addEventListenerFunction(place[0], animatedElement, "walkIntoElevatorAnimation", "turnInElevatorAnimation", "animationend", function(){
					self.changeCssClassName(animatedElement, "turnInElevatorAnimation", "waitInElevator");
				});
				place.removeClass("moveTransition");
			});
			place[0].style.transform= place[0].style.transform+" scaleY(.95)"
			self.changeCssClassName(place[0], "outsideElevator", "insideElevator");
			config.targetElevator.registerToElevatorEvents(hidePerson, showPerson);
			return;
		}
		
		if(insideElevator && config.targetFloor == floorOfElevator){
			place.toggleClass("moveTransition");
			insideElevator = !insideElevator;
			console.log("stepping out");
		}		
	};
	
	var reactToDoorCloseEvent =function(floorOfElevator){
		if(insideElevator){
			place.removeClass("moveTransition");
			hidePerson();
		}
	}
	
	var showPerson = function(elevatorPos){
		console.log(elevatorPos);
		place[0].style.top=(elevatorPos+5+Math.random()*10)+'px';
		place[0].style.visibility="visible";
	}
	
	var hidePerson = function(){
		place[0].style.visibility="hidden";
	}
	
	window.setTimeout(this.moveToElevator,100);
	
	this.getY = function(){
		return parseInt(place[0].style.top.substr(0,place[0].style.top.indexOf('p')));
	}
	
	this.changeCssClassName = function(element, oldName, newName){
		element.className = element.className.replace(oldName,newName);
	}
}

Person.prototype.initialize = function(place, config) {
	this.place = place;
	this.place
		.empty()
		.addClass('person outsideElevator')
		.append(
			'<div class="scene part person walkAnimation" style="background-image: url(' + this.config.picUrl + '); width: 40px; height: ' + this.config.height + 'px;"></div>'
		);
}