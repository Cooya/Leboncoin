const lbc = require('./client');

const req = {
    category: 'informatique',
    type: 'offres',
    region_or_department: 'cantal',
    sellers: 'particuliers',
    query: 'ordinateur',
    sort: 'date',
    titles_only: false,
    urgent_only: false
};

const req2 = {
	category: 'informatique',
    city_or_postal_code: '75001',
	filters: {
		'Prix min': 400,
		'Prix max': 'Plus de 1000'
	}
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