function Level(place, config) {
	this.config = {
		// Default config.
	};

	this.initialize(place, config);
}

Level.prototype.initialize = function(place, config) {
	
	this.place = place;
	for (var item in config) this.config[item] = config[item];
	this.place.addClass('level');
	
	this.place.empty();
	
	var wid = 0;
	var hei = 0;
	this.floors = [];
	console.log(this, config);
	if ((typeof(this.config['floors']) !== 'undefined') && (this.config.floors.length > 0)) {
		for (var i = 0; i < this.config.floors.length; ++i) {
			var floorIndex = typeof(this.config.floors[i].floorIndex) === 'undefined' ? i : this.config.floors[i].floorIndex;
			var nameStr = typeof(this.config.floors[i].name) === 'undefined' ? floorIndex + 1 : this.config.floors[i].name;
			//console.log(floorIndex, nameStr);
			this.place.append('<div data-floor-index="' + floorIndex + '"></div>');
			var floor = new Floor(
				this.place.find('[data-floor-index="' + floorIndex + '"]'),
				{
					name: nameStr,
					floorIndex: floorIndex
				}
			);
			wid = Math.max(wid, floor.config.width);
			hei += floor.config.height;
			
			this.floors.push(floor);
		};
	}
	this.place.width(wid + "px");
	this.place.height(hei + "px");
	
	// TODO fix the following lines to a more general form.
	this.place.append('<div id="elevator"></div>');
	this.elevator = new Elevator($('#elevator'), {floors: this.floors});
	this.personGenerator = new PersonGenerator($('#game'), this.elevator);
	this.editor = new CodeEditor($('#codeEditor'), { /* defaults */ });
}

/**
 * This will only work when run on a web server, like Apache. On file protocol
 * the ajax call fails without error.
 */
Level.prototype.loadFromFile = function(url, callback) {
	console.log('loadFromFile():', url);
	var self = this;
	$.get(
		url + "?nocache=" + (Math.random() * (new Date()).getTime() | 0)
	).success(
		function (data) {
			//console.log('loaded file ', url, "status", data);
			self.initialize(self.place, data);
			callback();
		});
}

Level.prototype.start = function() {
	
	var self = this;
	for (var item in this.config.actions) {
		var current = this.config.actions[item];
		
		switch (current.action) {
			case 'spawnPerson':
				current.timerID = setTimeout(
					function() { // Action.
						self.personGenerator.createPerson(current.presets);
					},
					current.timeStamp
				);
			break;
			default:
				console.log('unknown action:', current);
			break;
		}
	}
}

