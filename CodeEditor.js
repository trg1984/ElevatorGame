function CodeEditor(place, config) {
	this.config = {
		// No default parameters.
	};
	this.initialize(place, config);
}

CodeEditor.prototype.initialize = function(place, config) {
	this.place = typeof(place) === 'undefined' ? $('body') : place;
	this.place.addClass('codeEditor');

	for (var item in config) this.config[item] = config[item];
	
	this.draw();
}

CodeEditor.prototype.setKeyControls = function() {
	var self = this;
	var textBox = this.place.find('.codeArea');
	textBox
		.on(
			'keydown',
			function (e) {
				
				// TODO missing: backwards tab with [shift] + [tab].
				// TODO missing: selection tab with selection + [tab].
				if (e.which === 9) {
					e.preventDefault();
				}
			}
		)
		.on(
			'keyup',
			function(e) {
				if (e.which === 9) {
					var caretPos = self.getCaret(textBox[0]);
					var s = textBox[0].value;
					textBox.val(s.substr(0, caretPos) + "\t" + s.substr(caretPos));
					self.setCaretToPos(textBox[0], ++caretPos);
				}
				//if (e.which == 13) actions['compile']();
			}
		);
}


CodeEditor.prototype.getCaret = function(el) { 
	if (el.selectionStart) return el.selectionStart; 
	
	if (document.selection) { 
		el.focus(); 

		var r = document.selection.createRange(); 
		if (r === null) return 0;

		var re = el.createTextRange();
		var rc = re.duplicate();
		
		re.moveToBookmark(r.getBookmark());
		rc.setEndPoint('EndToStart', re);
		
		return rc.text.length;
	}
	return 0; 
}
			
CodeEditor.prototype.setSelectionRange = function(el, selectionStart, selectionEnd) {
	if (el.setSelectionRange) {
		el.focus();
		el.setSelectionRange(selectionStart, selectionEnd);
	}
	else if (el.createTextRange) {
		var range = el.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
}

CodeEditor.prototype.setCaretToPos = function(el, pos) {
	this.setSelectionRange(el, pos, pos);
}

CodeEditor.prototype.draw = function() {
	this.place
		.empty()
		.append(
			'<div class="topmenu"></div>' +
			'<textarea class="codearea" spellcheck="false"></textarea>' + 
			'<div class="output" id="output1"></div>' +
			'<div class="inspector"></div>' +
			'<div class="eventView"></div>'
		);
	
	this.setKeyControls();
}