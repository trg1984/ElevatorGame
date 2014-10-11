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
		var pfx = ["webkit", "MS", "moz", "o", ""];
		for (var p = 0; p < pfx.length; p++) {
			if (p>1) animationEventName = animationEventName.toLowerCase();
			htmlElement.addEventListener(pfx[p]+animationEventName, function(){
				animatedElement.className=animatedElement.className.replace(oldClassName,newClassName);
				htmlElement.removeEventListener(pfx[p]+animationEventName, this);
					
				if(animationFinishedFunction){
					animationFinishedFunction();
				}
			}, false);
		}			
	};
	
	var animatedElement = $(place[0]).find('.person')[0];
	addEventListenerFunction(place[0], animatedElement, "walkAnimation", "turnAnimation", "TransitionEnd");
	addEventListenerFunction(place[0], animatedElement, "turnAnimation", "waitForElevator", "AnimationEnd", function(){
		if(config.startingFloor == config.targetElevator.getCurrentFloor() && config.targetElevator.doorsOpen()){
			reactToDoorOpenEvent(config.targetElevator.getCurrentFloor());
		}else{
			pressElevatorCallButton();
		}
		config.targetElevator.registerToDoorEvents(reactToDoorOpenEvent, reactToDoorCloseEvent); 				
	});
	
	this.moveToElevator = function(){
		var targetPos = config.targetElevator.config.center+((Math.random()*40)-20)+'px';
		self.setDirection(targetPos);
		self.moveTo(targetPos);
	}

	this.setDirection = function(targetLeft){
		if(place[0].style.left < targetLeft)
			direction=-1;
		else
			direction=1;
		
		var transformStr = place[0].style.transform.replace(/scaleX(.*)/,"scaleX("+direction+")");
		place[0].style.transform = transformStr;
	}
	
	this.moveTo = function(left, top){
		place[0].style.left = left;
		
		if(top){
			place[0].style.top = top;
		}
	}
	
	var pressElevatorCallButton = function(){
		if(config.startingFloor.config.floorIndex < config.targetFloor.config.floorIndex){
			config.startingFloor.changeDownButtonState(true);
		}else{
			config.startingFloor.changeUpButtonState(true);
		}
	}
	
	var reactToDoorOpenEvent = function(floorOfElevator){
		if(!insideElevator && config.startingFloor == floorOfElevator){
		console.log(config.targetFloor);
			insideElevator = !insideElevator;
			self.moveTo((config.targetElevator.config.center-direction*(20+Math.floor(Math.random()*30)))+'px', (self.getY()-(10+Math.floor(Math.random()*10)))+'px');
			var animatedElement = $(place[0]).find('.person')[0];
			self.changeCssClassName(animatedElement, "waitForElevator", "walkIntoElevatorAnimation");
			addEventListenerFunction(place[0], animatedElement, "walkIntoElevatorAnimation", "turnInElevatorAnimation", "TransitionEnd", function(){
				console.log("moveTransition finisher");
				addEventListenerFunction(place[0], animatedElement, "walkIntoElevatorAnimation", "turnInElevatorAnimation", "AnimationEnd", function(){
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
			var animatedElement = $(place[0]).find('.person')[0];
			place[0].className = place[0].className+" moveTransition";
			insideElevator = !insideElevator;
			self.changeCssClassName(place[0], "insideElevator", "outsideElevator");
			self.changeCssClassName(animatedElement, "waitInElevator", "walkOutElevatorAnimation");
			addEventListenerFunction(place[0], animatedElement, "walkOutElevatorAnimation", "walkAnimation", "TransitionEnd", function(){
				var targetX = Math.round(Math.random())*(self.config.targetFloor.getWidth()-20)+'px';
				place[0].className = place[0].className+" moveTransition";
				self.setDirection(targetX);
				addEventListenerFunction(place[0], animatedElement, "walkOutElevatorAnimation", "walkAnimation", "TransitionEnd", function(){
					self.despawn();
				});
				self.moveTo(targetX);
				console.log("stepped out");
			});
			self.moveTo(self.getX()+'px', self.config.targetElevator.getCurrentFloor().getWalkableHeight()+'px');
			place[0].style.transform= place[0].style.transform.replace(/scaleY(.*)/, "scaleY(1)");
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

	this.getX = function(){
		var pixelPos = self.place[0].style.left;
		return parseInt(pixelPos.substring(0,pixelPos.indexOf('p')));
	}

	this.getY = function(){
		var pixelPos = self.place[0].style.top;
		return parseInt(pixelPos.substr(0,pixelPos.indexOf('p')));
	}
	
	this.changeCssClassName = function(element, oldName, newName){
		element.className = element.className.replace(oldName,newName);
	}
}

Person.prototype.initialize = function(place, config) {
	
	this.config = config;
	this.place = place;
	this.place
		.empty()
		.css({transform:'scaleX(1) scaleY(1)'})
		.addClass('person outsideElevator')
		.append(
			'<div class="scene part person walkAnimation" style="background-image: url(' + this.config.picUrl + '); width: 40px; height: ' + this.config.height + 'px;"></div>'
		);
}

Person.prototype.despawn = function() {
	console.log("despawned");
	this.place[0].parentNode.removeChild(this.place[0]);
}