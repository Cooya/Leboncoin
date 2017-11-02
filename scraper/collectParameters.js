const fs = require('fs');
const system = require('system');

if(system.args.length === 1) {
	console.error('Missing argument.');
	phantom.exit();
}

const url = 'https://www.leboncoin.fr/' + system.args[1] + '/offres/aquitaine/';
const page = require('webpage').create();

page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0';
page.settings.loadImages = false;
page.settings.loadPlugins = false;
page.settings.resourceTimeout = 30000;

page.onError = function(msg) {
	console.log(msg);
};
page.onResourceTimeout = function(request) {
	console.log('Timeout resource : ' + JSON.stringify(request));
};
page.onConsoleMessage = function(msg, lineNum, sourceId) {
	console.log(msg);
};
page.onLoadStarted = function() {
	console.log('Page loading started.');
};
page.onLoadFinished = function() {
	console.log('Page loading finished.');
};

function scrap() {
	var parameters = {};

	$('.searchbox_row.visible').each(function(index, elt) {
		var title = $(this).find('> span.searchbox_rowText');
		if(title.length) {
			var parameterName = title.text();
			var parameterId = null;
			$(this).find('input[type="radio"]').each(function(index) {
				if(index == 0) {
					parameterId = $(this).attr('name');
					parameters[parameterName] = {
						type: 'radio',
						id: parameterId,
						values: {}
					}
				}
				parameters[parameterName].values[$(this).parent().text().trim()] = $(this).val();
			});

			$(this).find('input[type="checkbox"]').each(function(index) {
				if(index == 0) {
					parameterId = $(this).attr('name');
					parameters[parameterName] = {
						type: 'checkbox',
						id: parameterId,
						values: {}
					}
				}
				parameters[parameterName].values[$(this).parent().text().trim()] = $(this).val();
			});
		}

		$(this).find('select').each(function(index) {
			var parameterName = null;
			var parameterId = $(this).attr('name');
			$(this).find('option').each(function(index) {
				if(index == 0) {
					parameterName = $(this).text();
					parameters[parameterName] = {
						type: 'select',
						id: parameterId,
						values: {}
					};
				}
				else
					parameters[parameterName].values[$(this).text().trim()] = $(this).val();
			});
		});
	});

	return parameters;
}

page.open(url, function() {
	try {
		page.injectJs('jquery.js');
		const result = page.evaluate(scrap);
		fs.write('./output.json', JSON.stringify(result, null, 4));
	}
	catch(e) {
		console.error(e);
	}
	phantom.exit();
});