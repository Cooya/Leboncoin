const lbc = require('./leboncoin');

const req = {
	category: 'informatique',
	type: 'offres', // 'offres' || 'demandes'
	//region_or_department: 'cantal',
	sellers: 'particuliers', // 'tous' || 'particuliers' || 'professionnels'
	query: 'ssd', // string
	sort: 'date', // 'date' || 'prix'
	titles_only: false, // true || false
	urgent_only: false, // true || false
	filters: {
		'Prix min': 400,
		'Prix max': 'Plus de 1000'
	},
	'city_or_postal_code': '75001'
};

lbc.search(req)
.then(function(items) {
	console.log(items);
}, function(error) {
	console.error(error);
});

/*lbc.get('ameublement', 1329803102)
.then(function(item) {
	console.log(item);
}, function(error) {
	console.error(error);
});*/

/*
lbc.watch(req, 60, function(item) {
	console.log(item);
});
*/