/**
* SymCalc.js
* @copyright Copyright 2014 Rolf Lindén
* @mailto rolind@utu.fi
* @licence MIT licence
*/

// Environment setup code
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

var leftDelimiter_regExp = '\\(';
var rightDelimiter_regExp = '\\)';
var listSeparator_regExp = '\\,';
var quoteSeparator_regExp = '\\"';
var leftDelimiter = '(';
var rightDelimiter = ')';
var listSeparator = ',';
var quoteSeparator = '"';
var delimiters_regExp = ['\\+', '\\-', '\\*', '\\/', '\\,'];
var delimiters = ['+', '-', '*', '/', ','];
var structuralFunctions = ['if', 'ifelse', 'block', 'while', 'for', 'set'];

var root = null;
var cellTypes = [
	'var',
	'real',
	'string',
	'function'
];

var fn = {
	sum: function(arr) {
			//console.log('sum(): ', arr);
			var result = (typeof(arr[0]) === 'number' ? 0 : '');
			for (var item in arr) result += arr[item];
			return result;
		},
	sub: function(arr) {
			var result = (typeof(arr[0]) === 'number' ? arr[0] : '');
			for (var item = 1; item < arr.length; ++item) result -= arr[item];
			return result;
		},
	mul: function(arr) {
			var result = (typeof(arr[0]) === 'number' ? 1 : '');
			for (var item in arr) result *= arr[item];
			return result;
		},
	div: function(arr) {
			var result = (typeof(arr[0]) === 'number' ? arr[0] : '');
			for (var item = 1; item < arr.length; ++item) result /= arr[item];
			return result;
		},
	neg: function(arr) {
		if (typeof(arr[0]) === 'boolean') return !arr[0];
		else if (typeof(arr[0]) === 'number') return -arr[0];
		else throw('Negation is only possible on numbers and booleans.');
	},
	sqr : function() { return Math.sqr(arguments[0]); },
	sqrt : function() { return Math.sqrt(arguments[0]); },
	abs : function() { return Math.abs(arguments[0]); },
	print : function() {
		
		if (!ENVIRONMENT_IS_WORKER) {
			if (
				(typeof($) === 'function') &&
				($('#output1').length > 0)
			) $('#output1').append('<div class="print">' + arguments[0][0] + '</div>');
			else console.log(arguments[0][0]);
			return 0;
		}
		else return 1;
	},
	block : function(args, vars) {
		var lastLine = null;
		//console.log(args, vars);
		
		for (var i = 0; i < args.length; ++i) lastLine = valueOf(args[i], vars);
		
		// Return the last item's result.
		return lastLine;
	},
	while: function(args, vars) {
		var lastLine = null;
		while (valueOf(args[0], vars)) lastLine = valueOf(args[1], vars);
		
		return lastLine;
	},
	for: function(args, vars) {
		var lastLine = null;
		
		valueOf(args[0], vars); // Initialize
		while (valueOf(args[1], vars)) { // Stop condition
			lastLine = valueOf(args[3], vars); // Iteration step.
			valueOf(args[2], vars); // Update iterator
		}
		
		return lastLine;
	},
	if: function(args, vars) {
		var lastLine = null;
		if (valueOf(args[0], vars)) lastLine = valueOf(args[1], vars);
		
		return lastLine;
	},
	ifelse: function(args, vars) {
		var lastLine;
		
		if (valueOf(args[0], vars)) lastLine = valueOf(args[1], vars);
		else lastLine = valueOf(args[2], vars);
		
		return lastLine;
	},
	set: function(args, vars) {
		vars[args[0].name] = valueOf(args[1], vars);
		return vars[args[0].name];
	},
	moveUp: function(args, vars) {
		//console.log('moveUp(): ', args, vars);
		var change = args.length > 0 ? valueOf(args[0], vars) : 1;
		level.elevator.moveUp(change);
	},
	moveDown: function(args, vars) {
		//console.log('moveDown(): ', args, vars);
		var change = args.length > 0 ? valueOf(args[0], vars) : 1;
		level.elevator.moveDown(change);
	},
	toggleDoors: function(args, vars) {
		//console.log('toggleDoors(): ', args, vars);
		level.elevator.toggleDoors();
	}
};

function isStructuralFunction(s) {
	return structuralFunctions.indexOf(s) >= 0;
}

function isFunctionName(s) {
	return typeof(fn[s]) === 'function';
}

function isVariableName(s) {
	return s.search(/^[a-zA-Z_][a-zA-Z_0-9]*$/) === 0;
}

function isBinaryOperator(s) {
	return ['sum', 'sub', 'mul', 'div'].indexOf(s) >= 0;
}

function parseString(s) {
	var newTemp = s.substr(quoteSeparator.length, s.length - quoteSeparator.length - 1); // Remove quotes.
	var temp;
	do {
		temp = newTemp;
		newTemp = temp.replace('\\' + quoteSymbol, quoteSymbol)
 	} while (newTemp !== temp);
	
	return temp;
}

function asBinaryOperator(s) {
	var arr = ['+', '-', '*', '/'];
	var index = ['sum', 'sub', 'mul', 'div'].indexOf(s);
	
	if ((index >= 0) && (index < arr.length)) return arr[index];
	/* else */ return null;
}

// Exists to allow default regex escaping of operators in the future.
function regexEscape(s) {
	var result = "";
	for (var i = 0; i < s.length; ++i) result += '\\' + s[i];
	return result;
}

Cell = function(params) {

	// Each cell must have a string field called 'type'.
	// Type must have one of the values defined in cellTypes.
	if (
		params &&
		(typeof(params.type) === 'string') &&
		cellTypes.indexOf(params.type) >= 0
	) {
		for (var item in params) {
			this[item] = params[item];
		}
	}
	else throw('Invalid cell type, or cell type missing.');
}

Cell.prototype.isValid = function() {
	switch(this.type) {
		case 'var' : return true; break;
		case 'real' : return typeof(this.value) === 'number' ? true : false; break;
		case 'string' : return typeof(this.value) === 'string' ? true : false; break;
		case 'function' : return this.name && this.args && Array.isArray(this.args); break;
		default: return false; break;
	}
}

function interpret(input) {
	var items = input.split(new RegExp('(' + listSeparator_regExp + '|' + leftDelimiter_regExp + '|' + delimiters_regExp.join('|') + '|' + rightDelimiter_regExp + ')', 'g')).filter(function(item) {return item !== ''});
	console.log('interpret(), input: ', input, items);
	
	if (items.length === 0) { // For an empty program, return 0.
		
		return new Cell(
			{
				type: 'real',
				value: 0
			}
		);
	}
	
	// Search for additions and substractions.
	var delimDepth = 0;
	var i = items.length - 1;
	
	
	do {
		var current = items[i].trim(); // Remove surrounding whitespaces.
		if (current === leftDelimiter) {
			--delimDepth;
			if (delimDepth < 0) throw('Unpaired delimiter found.');
		}
		else if (current === rightDelimiter) ++delimDepth;
		else if (delimDepth === 0) {
			
			if ( (i > 0) && ((current === '+') || (current === '-')) ) {
				var left = items.slice(0, i).join('');
				var right = items.slice(i + 1).join('');
				return new Cell(
					{
						type: 'function',
						name: (current === '+') ? 'sum' : 'sub',
						args: [
							interpret(left),
							interpret(right)
						]
					}
				);
			}
		}
		--i;
	} while (i >= 0);
	
	if (i < 0) { // No additions or substractions were found, search for multiplications and divisions.
		var delimDepth = 0;
		i = items.length - 1;
		do {
			var current = items[i].trim(); // Remove surrounding whitespaces.
			if (current === leftDelimiter) {
				--delimDepth;
				if (delimDepth < 0) throw('Unpaired delimiter found.');
			}
			else if (current === rightDelimiter) ++delimDepth;
			else if (delimDepth === 0) {
				if ( (i > 0) && ((current === '*') || (current === '/')) ) {
					var left = items.slice(0, i).join('');
					var right = items.slice(i + 1).join('');
					return new Cell(
						{
							type: 'function',
							name: (current === '*') ? 'mul' : 'div',
							args: [
								interpret(left),
								interpret(right)
							]
						}
					);
				}
			}
			--i;
		} while (i >= 0);
		
		if (i < 0) { // No multiplications or divisions were found.
			
			var delimDepth = 0;
			var current = items[0].trim();
			
			if (current === '-') {
				var arg = items.slice(1).join('');
				return new Cell(
					{
						type: 'function',
						name: 'neg',
						args: [
							interpret(arg)
						]
					}
				);
			}
			else if (isFunctionName(current)) {
				//console.log(current, 'is a function name.')
				i = 1;
				do { // TODO This could be solved while going from right to left earlier.
					var trimmed = items[i].trim();
					if (trimmed === leftDelimiter) {
						++delimDepth;
						if (delimDepth < 0) throw('Unpaired delimiter found.');
					}
					else if (trimmed === rightDelimiter) --delimDepth;
					++i
				} while (delimDepth > 0);
				
				
				var level = 0;
				var currentTemp = "";
				var parameters = [];
				for (var ind = 2; ind < i - 1; ++ind) {
					//console.log(ind);
					if (items[ind] === leftDelimiter) ++level;
					else if (items[ind] === rightDelimiter) --level;
					
					if ((level === 0) && (items[ind] === listSeparator)) { // non-terminal parameter
						//console.log('\tNew parameter1: ', currentTemp);
						parameters.push(interpret(currentTemp));
						currentTemp = "";
					}
					else {
						currentTemp += items[ind];
						if (ind === i - 2) { // terminal parameter
							//console.log('\tNew parameter2: ', currentTemp);
							parameters.push(interpret(currentTemp));
						}
					}
				}
				
				//var arg = items.slice(2, i - 1).join('');
				
				//console.log('arg = ', arg, items);
				
				return new Cell(
					{
						type: 'function',
						name: current,
						args: parameters
						/*
						args: [
							interpret(arg)
						]
						*/
					}
				);
			}
			else if (!isNaN(parseFloat(current))) {
				return new Cell(
					{
						type: 'real',
						value: parseFloat(current)
					}
				);
			}
			else if (isVariableName(current)) {
				return new Cell(
					{
						type: 'var',
						name: current
					}
				);
			}
			else if ((current === leftDelimiter) && (items[items.length - 1].trim() === rightDelimiter)) {
				return interpret(items.slice(1, items.length - 1).join(''));
			}
			else {
				//console.log(items);
				throw('Malformed input "' + input + '".')
			};
		}
	}
}

function toString(input) {
	//console.log("toString(): ", input);
	if (input.type === 'function') {
		
		var result = "";
		
		// The function is a binary operator with two arguments.
		if ((isBinaryOperator(input.name) === true) && (input.args.length === 2)) {
			var lhs = toString(input.args[0]);
			var rhs = toString(input.args[1]);
			
			{ // Checks if parenthesis should be added.
				
				// a - (b +- c)
				if (
					(input.name === 'sub') &&
					(input.args[1].type === 'function') &&
					(['sum', 'sub'].indexOf(input.args[1].name) >= 0)
				) rhs = '(' + rhs + ')';
				
				else if (['mul', 'div'].indexOf(input.name) >= 0) {
					
					// (a +- b) */ c
					if (
						(input.args[0].type === 'function') &&
						(['sum', 'sub'].indexOf(input.args[0].name) >= 0)
					) lhs = '(' + lhs + ')';
					
					// a */ (b +- c)
					if (
						(input.args[1].type === 'function') &&
						(['sum', 'sub'].indexOf(input.args[1].name) >= 0)
					) rhs = '(' + rhs + ')';
					
					// a / (b */ c)
					if (
						(input.name === 'div') &&
						(input.args[1].type === 'function') &&
						(['mul', 'div'].indexOf(input.args[1].name) >= 0)
					) rhs = '(' + rhs + ')';
				}
			}
			
			result = lhs + asBinaryOperator(input.name) + rhs;
		}
		else { // The function is not a binary operator with two arguments.
			
			if ((input.name === 'neg') && (input.args.length === 1)) {
				
				var argString = toString(input.args[0]);
				
				// -(b +- c)
				if (
					(input.args[0].type === 'function') &&
					(['sum', 'sub'].indexOf(input.args[0].name) >= 0)
				) argString = '(' + argString + ')';
				
				result = '-' + argString;
			}
			else { // A regular function, formatted to fname(arg0, arg1, arg2, ..., argn)
				
				result = input.name + '(';
				
				for (var i = 0; i < input.args.length; ++i) {
					result += toString(input.args[i]);
					result += i < input.args.length - 1 ? ', ' : ')';
				}
			}
		}
		
		return result;
	}
	else if (input.type === 'real') return input.value;
	else if (input.type === 'var') return input.name;
	else return input;
}

function valueOf(input, vars) {
	if (input.type === 'function') {
		
		if (isStructuralFunction(input.name)) {
			return fn[input.name](input.args, vars);
		}
		else {
			var args = [];
			for (var i = 0; i < input.args.length; ++i) args[i] = valueOf(input.args[i], vars);
			
			return fn[input.name](args);
		}
	}
	else if (input.type === 'real') return input.value;
	else if (input.type === 'string') return input.value;
	else if (input.type === 'var') return vars[input.name];
	throw('Unexpected input type.');
}

function hasValidParenthesis(s, leftParen, rightParen) {
	
	var leftP = typeof(leftParen) === 'string' ? leftParen : leftDelimiter;
	var rightP = typeof(leftParen) === 'string' ? leftParen : rightDelimiter;
	var temp = s;
	
	var balance = 0;
	var lpi, rpi;
	do {
		lpi = temp.indexOf(leftP);
		rpi = temp.indexOf(rightP);
		
		lpi = lpi === -1 ? temp.length : lpi;
		rpi = rpi === -1 ? temp.length : rpi;
		
		var min = Math.min(lpi, rpi) + 1;
		
		if (rpi < lpi) --balance;
		else if (rpi > lpi) ++balance;
		
		if (balance < 0) return false;
		temp = temp.substr(min);
	} while (temp !== "");
	return balance === 0;
}

if (ENVIRONMENT_IS_WORKER) {
	
	var self = this;
	
	// Each call must have a type or this will not work.
	self.addEventListener(
		'message',
		function(e) {
			var input = e.data;
			if ((input['type'] !== 'undefined')) {
				
				switch (input.type) {
					case 'interpret':
						self.postMessage(
							{
								parseTree: interpret(input['program']),
								data: input['data'] // Passthrough
							}
						);
						break;
					case 'value':
						self.postMessage(
							{
								output: typeof(input['program']) === 'string' ? valueOf(interpret(input['program']), input['vars']) : valueOf(input['program'], input['vars']),
								vars: input['vars'],
								data: input['data'] // Passthrough
							}
						);
						break;
					// No default case.
				}
			}
		},
		false
	);
}
