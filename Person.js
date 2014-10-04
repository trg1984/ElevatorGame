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

	var addEventListenerFunction = function(htmlElement, animatedElement, oldClassName, newClassName, animationEventName, animationFinishedFunction){
		htmlElement.addEventListener(animationEventName, function(){
			animatedElement.className=animatedElement.className.replace(oldClassName,newClassName);
			htmlElement.removeEventListener(animationEventName, this);
			
			if(animationFinishedFunction){
				animationFinishedFunction();
			}
		}, false);
			
	};
	
	addEventListenerFunction(place[0], $(place[0]).find('.person')[0], "walkAnimation", "turnAnimation", "transitionend");
	addEventListenerFunction(place[0], $(place[0]).find('.person')[0], "turnAnimation", "waitForElevator", "animationend", function(){ 
		config.targetElevator.registerToDoorOpenEvent(reactToDoorOpenEvent); 
	});
	
	this.moveToElevator = function(){
		var targetPos = config.targetElevator.config.center+((Math.random()*40)-20)+'px';
		self.setScale(targetPos);
		self.moveTo(targetPos);
	}

	this.setScale = function(targetLeft){
		if(place[0].style.left < targetLeft)
			place[0].style.transform="scaleX(-1)";
		else
			place[0].style.transform="scaleX(1)";
	}
	
	this.moveTo = function(left, top){
		place[0].style.left = left;
		
		if(top){
			place[0].style.top = top;
		}
	}
	
	var reactToDoorOpenEvent = function(floorOfElevator){
		if(config.startingFloor != floorOfElevator)
			return;
			
		if(!insideElevator){
			self.moveTo((config.targetElevator.config.center+(5-Math.floor(Math.random()*10)))+'px', (self.getY()-(10+Math.floor(Math.random()*10)))+'px');
			place[0].style.transform= place[0].style.transform+" scaleY(.95)"
			self.changeCssClassName(place[0], "outsideElevator", "insideElevator");
			insideElevator = !insideElevator;
		}else{
		}
		
		window.setTimeout(config.targetElevator.unregisterToDoorOpenEvent(reactToDoorOpenEvent),50); 
	};
	
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