module.exports = function() {
	var publ = this,
		priv = {},

		readline	= require('readline'),
		Table 		= require('cli-table'),

		tableConf = {
			chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
				, 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
				, 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
				, 'right': '' , 'right-mid': '' , 'middle': ' ' },
		  	style: { 'padding-left': 0, 'padding-right': 0 }
		};

		history = [];

	var rl = readline.createInterface({
	  input:	process.stdin,
	  output:	process.stdout
	});

	publ.clearConsole = function() {
		console.log('\033[2J');
	}

	publ.hasHistory = function() {
		return history.length > 1;
	}

	publ.forward = function(name, fn) {
		history.push({ name: name, fn: fn });

		publ.clearConsole();

		fn();
	}

	publ.backward = function() {
		if (publ.hasHistory()) {
			history.pop();
			publ.reload();
		}
		else {
			publ.quit();
		}
	}

	publ.reset = function(keepHistory) {
		history.splice(keepHistory || 0);
	}

	publ.reload = function() {
		publ.clearConsole();

		history[history.length - 1].fn();
	}

	publ.quit = function() {
		publ.clearConsole();

		rl.close();
	}

	priv.breadcrumb = function() {
		var ret = '> ',
			i;

		for (i in history) {
			if (history.hasOwnProperty(i) && history[i].name) {
				ret += history[i].name + ' > ';
			}
		}

		return ret;
	}

	publ.menu = function(choices) {
		var nav = {};

		if (publ.hasHistory()) {
			nav['B'] = 'Back to previous';
		}

		nav['Q'] = 'Quit';

		choices.push(nav);

		var i, table, section, letter, choice;
		for (i in choices) {
			section = choices[i];
			table 	= new Table(tableConf);
			for (letter in section) {
				choice = section[letter];
				letter = isNaN(parseInt(letter)) ? letter.toUpperCase() : (parseInt(letter) + 1);

				table.push([letter + ')'].concat(choice));
			} 
			table.push(['']);
			console.log(table.toString());
		}
	}

	publ.question = function(question, callback) {
		callback = callback || function() {};
		question += '\n' + priv.breadcrumb();

		rl.question(question, function(answer) {
			var letter = isNaN(parseInt(answer)) ? answer.toLowerCase() : answer;

			switch (letter) { 
			 	case 'b': publ.backward(); break;
				case 'q': publ.quit(); break;
				default: callback(answer); break;
			}

		});
	}
};