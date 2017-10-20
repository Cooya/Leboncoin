const cheerio = require('cheerio');
const request = require('request');
const sleep = require('system-sleep');

const PREFIX = 'https://www.leboncoin.fr/';
const CATEGORIES = [
	'_emploi_',
	'offres_d_emploi',
	'_vehicules_',
	'voitures',
	'motos',
	'caravaning',
	'utilitaires',
	'equipement_auto',
	'equipement_moto',
	'equipement_caravaning',
	'nautisme',
	'equipement_nautisme',
	'_immobilier_',
	'ventes_immobilieres',
	'locations',
	'colocations',
	'bureaux_commerces',
	'_vacances_',
	'locations_gites',
	'chambres_d_hotes',
	'campings',
	'hotels',
	'hebergements_insolites',
	'_maison_',
	'ameublement',
	'electromenager',
	'arts_de_la_table',
	'decoration',
	'linge_de_maison',
	'bricolage',
	'jardinage',
	'vetements',
	'chaussures',
	'accessoires_bagagerie',
	'montres_bijoux',
	'equipement_bebe',
	'vetements_bebe',
	'_multimedia_',
	'informatique',
	'consoles_jeux_video',
	'image_son',
	'telephonie',
	'_loisirs',
	'dvd_films',
	'cd_musique',
	'livres',
	'animaux',
	'velos',
	'sports_hobbies',
	'instruments_de_musique',
	'collection',
	'jeux_jouets',
	'vins_gastronomie',
	'_materiel_professionnel',
	'materiel_agricole',
	'transport_manutention',
	'btp_chantier_gros_oeuvre',
	'outillage_materiaux_2nd_oeuvre',
	'equipements_industriels',
	'restauration_hotellerie',
	'founitures_de_bureau',
	'commerces_marches',
	'materiel_medical',
	'_services_',
	'prestations_de_service',
	'billeterie',
	'evenements',
	'cours_particuliers',
	'covoiturage',
	'_',
	'autres'
];
const TYPES = ['offres', 'demandes'];
const LOCATIONS = [
	'alsace',
	'aquitaine',
	'auvergne',
	'basse_normandie',
	'bourgogne',
	'bretagne',
	'centre',
	'champagne_ardenne',
	'corse',
	'franche_comte',
	'haute_normandie',
	'ile_de_france',
	'languedoc_roussillon',
	'limousin',
	'lorraine',
	'midi_pyrenees',
	'nord_pas_de_calais',
	'pays_de_la_loire',
	'picardie',
	'poitou_charentes',
	'provence_alpes_cotes_d_azur',
	'rhone_alpes',
	'guadeloupe',
	'martinique',
	'guyane',
	'reunion'
];

function convertRequestToUrl(request) {
	let url = PREFIX;

	if(request.category)
		url += checkCategory(request.category) + '/';
	else
		url += 'annonces/';

	if(request.type)
		url += checkType(request.type) + '/';
	else
		url += TYPES[0];

	if(request.location)
		url += checkLocation(request.location) + '/';	

	url += '?';

	if(request.sellers)
		url += checkSellers(request.sellers) + '&';

	if(request.query)
		url += checkQuery(request.query) + '&';

	if(request.sort)
		url += checkSort(request.sort) + '&';

	if(request.titles_only)
		url += checkTitlesOnly(request.titles_only) + '&';

	if(request.urgent_only)
		url += checkUrgentOnly(request.urgent_only) + '&';

	return url;
}

function checkId(id) {
	const str = id.toString();
	if(!Number.isInteger(id) || str.length != 10)
		throw 'Invalid id "' + id + '", the "id" parameter must be a 10-digit integer.';
	return id;
}

function checkCategory(category) {
	category = category.toLowerCase();
	if(CATEGORIES.indexOf(category) == -1)
		throw 'Invalid category "' + category + '", check out the doc for know all the valid categories.';
	return category;
}

function checkType(type) {
	type = type.toLowerCase();
	if(TYPES.indexOf(type) == -1)
		throw 'Invalid type "' + type + '", types accepted : "offres" & "demandes".';
	return type;
}

function checkLocation(location) {
	location = location.toLowerCase();
	if(LOCATIONS.indexOf(location) == -1)
		throw 'Invalid location "' + location + '", check out the doc for know all the possible locations.';
	return location;
}

function checkSellers(sellers) {
	sellers = sellers.toLowerCase();
	if(sellers == 'tous')
		return 'f=a';
	if(sellers == 'particuliers')
		return 'f=p';
	if(sellers == 'professionnels')
		return 'f=c';
	throw 'Invalid sellers "' + sellers + '", sellers accepted : "particuliers" & "professionnels".';
}

function checkQuery(query) {
	query = query.toLowerCase();
	if(query.length > 100)
		throw 'The query is too long, max length : 100.';
	return 'q=' + query;
}

function checkSort(sort) {
	sort = sort.toLowerCase();
	if(sort == 'date')
		return 'sp=0';
	if(sort == 'prix')
		return 'sp=1';
	throw 'Invalid sort "' + sort + '", sort accepted : "date" & "prix".';
}

function checkTitlesOnly(titlesOnly) {
	if(typeof titlesOnly !== 'boolean')
		throw 'The "titles_only" parameter must be a boolean.';
	return titlesOnly ? 'it=1' : '';
}

function checkUrgentOnly(urgentOnly) {
	if(typeof urgentOnly !== 'boolean')
		throw 'The "urgent_only" parameter must be a boolean.';
	return urgentOnly ? 'ur=1' : '';
}

function sendSearchRequest(url, data) {
	return new Promise(function(resolve, reject) {
		request(url, function(error, response, html) {
			if(error) {
				reject(error);
				return;
			}

			const $ = cheerio.load(html);
			$('.mainList .list_item').each(function(index, elt) {
				const infos = $(this).find('.item_supp');
				const category = infos.first().text().trim();
				const url = $(this).attr('href');
				const thumbnail = $(this).find('.item_imagePic > span').first().attr('data-imgsrc');
				data.push({
					id: url.match(/[0-9]{10}/)[0],
					title: $(this).find('.item_title').text().trim(),
					url: 'https:' + url,
					category: category ? category : null,
					location: infos.eq(1).text().replace(/(?:\r\n|\r|\n|  )/g, '').trim(),
					price: Number($(this).find('.item_price').text().replace(/€| /g, '').trim()),
					date: $(this).find('aside.item_absolute').text().replace('Urgent', '').trim(),
					main_image: {
						thumbnail: thumbnail,
						medium: thumbnail.replace('ad-thumb', 'ad-image'),
						large: thumbnail.replace('ad-thumb', 'ad-large')
					},
					number_of_images: Number($(this).find('.item_imageNumber').text()),
					urgent: !!$(this).find('.emergency').length,
					booster: !!$('.icon-booster').length,
					is_pro: !!$(this).find('.ispro').length
				});
			});

			resolve();
		});
	});
}

function sendItemRequest(url) {
	return new Promise(function(resolve, reject) {
		request(url, function(error, response, html) {
			if(error) {
				reject(error);
				return;
			}

			const $ = cheerio.load(html);
			const sellerInfo = $('.line_pro');
			const title = $('h1').text().trim();
			const thumbnails = $('script').eq(12).html().match(/https:\/\/img[0-9]\.leboncoin\.fr\/ad-thumb.+\.jpg/g);
			const images = [];
			thumbnails.forEach(function(thumbnail) {
				images.push({
					thumbnail: thumbnail,
					medium: thumbnail.replace('ad-thumb', 'ad-image'),
					large: thumbnail.replace('ad-thumb', 'ad-large')
				});
			});
			if(title == 'Cette annonce est désactivée')
				resolve({});
			else
				resolve({
					id: url.match(/[0-9]{10}/)[0],
					title: title,
					url: url,
					category: $('#main nav li:nth-child(3)').text().trim(),
					location: $('.line_city .value').text().trim(),
					price: Number($('.item_price .value').text().replace(/€| /g, '').trim()),
					date: sellerInfo.first().text().replace('Mise en ligne le', '').trim(),
					number_of_images: Number($('.item_photo').text().replace('photos disponibles', '').trim()),
					images: images,
					seller: $('.mbs > p.title').text().trim(),
					contact_seller: 'https:' + sellerInfo.last().find('a').attr('href'),
					description: $('.properties_description .value').text().replace('<br>', '\n').trim(),
					booster: !!$('.icon-booster').length,
					is_pro: !!$('.ad_pro').length
				});
		});
	});
}

function promiseWhile(action, condition) {
	if(condition())
		return action().then(function() {
			return promiseWhile(action, condition);
		});
	else
		return Promise.resolve();
}

function promiseWait(seconds) {
	return new Promise(function(resolve) {
		sleep(seconds * 1000);
		resolve();
	});
}

module.exports = {
	search: function(req = {}, minPage = 1, maxPage = 1) {
		return new Promise(function(resolve, reject) {
			let url;
			try {
				url = convertRequestToUrl(req);
			}
			catch(e) {
				reject(e);
				return;
			}

			const items = [];
			let page = minPage;
			promiseWhile(function() {
				url = page == 1 ? url + 'o=1' : url.replace('o=' + page, 'o=' + (page + 1));
				page++;
				return sendSearchRequest(url, items);
			}, function() {
				return page <= maxPage;
			}).then(function() {
				resolve(items);
			}, reject);
		});
	},

	get: function(category, id) {
		try {
			return sendItemRequest(PREFIX + checkCategory(category) + '/' + checkId(id) + '.htm');
		}
		catch(e) {
			return Promise.reject(e);
		}
	},

	watch: function(req, interval = 60, action) {
		let url;
		try {
			url = convertRequestToUrl(req);
		}
		catch(e) {
			return Promise.reject(e);
		}

		let lastId = null;

		promiseWhile(function() {
			const data = [];
			return sendSearchRequest(url, data).then(function() {
				console.log(new Date().toString() + ' : checking new items...');
				if(data.length) {
					if(lastId) {
						let i = 0;
						while(i < data.length && lastId != data[i].id)
							action(data[i++]);
					}
					lastId = data[0].id;
				}
				return promiseWait(interval);
			});
		}, function() {
			return true;
		});
	}
}