# Leboncoin.fr HTTP client

This package allows to perform requests on the french e-commerce website "leboncoin.fr". At the moment, it contains 3 simple methods for retrieve items data from the website : search(), get() and watch().

### Installation
```
npm install leboncoin-client
```

### Usage examples

Perform a search :
```javascript
const lbc = require('leboncoin-client');

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

lbc.search(req, 1, 5) // browse pages 1 to 5
.then(function(items) {
    console.log(items);
}, function(error) {
    console.error(error);
});
```

Second search example :
```javascript
const lbc = require('leboncoin-client');

const req = {
   category: 'informatique',
   city_or_postal_code: '75001'
   filters: {
       'Prix min': 400,
       'Prix max': 'Plus de 1000'
   }
};

lbc.search(req) // only the first page
.then(function(items) {
    console.log(items);
}, function(error) {
    console.error(error);
});
```

Get data from a specific advertisement : 
```javascript
const lbc = require('leboncoin-client');

lbc.get('informatique', 1159809960)
.then(function(item) {
    console.log(item);
}, function(error) {
    console.error(error);
});
```

Watch new objects from a specific category and location :
```javascript
const lbc = require('leboncoin-client');

const req = {
    category: 'informatique',
    region_or_department: 'gers'
};

lbc.watch(req, 60, function(item) { // the request is performed every 60 seconds
    console.log(item);
});
```

### Methods

- search(request, minPage, maxPage)

<sub>Query a research of items specified by various criterias. Return a promise with an array of items in parameter.</sub>

Parameter | Type    | Description | Default value
--------  | ---     | --- | ---
request   | object  | object containing the query parameters (see request spec for more info) | {}
minPage   | integer | first page to browse | 1
maxPage   | integer | last page to browse | 1


-------
- get(category, id)

<sub>Get specific item data by its category and id. Return a promise with the item data in parameter.</sub>

Parameter | Type    | Description | Default value
--------  | ---     | --- | ---
category  | string | item category (see category list) | required
id | integer | 10-digit item id | required


-------
- watch(request, interval, action)

<sub>Watching loop for detect new objects added specified by various criterias. Each time a new object is spotted, the function "action" is called with its data in parameter.</sub>

Parameter | Type    | Description | Default value
--------  | ---     | --- | ---
request | object | object containing the query parameters (see request spec for more info) | {}
interval | integer | number of seconds between each request | 60
action | function | action to execute for process the new object data | required


-------
### Request spec

Field | Type    | Description | Default value
--------  | ---     | --- | ---
category | string | category to look in (check out the [parameters.json](https://github.com/Cooya/Leboncoin/blob/master/parameters.json) for the complete list of categories) | "tous"
type | string | type of advertisement ("offres" or "demandes") | "offres"
region_or_department | string | region or department of items (check out the [parameters.json](https://github.com/Cooya/Leboncoin/blob/master/parameters.json) for the complete list of locations) | "toute la France"
city_or_postal_code | string | city or postal code of items (return empty array if it does not exist) | none
sellers | string | type of sellers ("tous" or "particuliers" or "professionnels" | "tous"
query | string | matching keywords | none
sort | string | sort criteria ("date" or "prix") | "date"
titles_only | boolean | search only in ad titles | false
urgent_only | boolean | search only for urgent ads | false
filters: | object | object containing some filters depending on the category (check out the [parameters.json](https://github.com/Cooya/Leboncoin/blob/master/parameters.json) for the complete list of filters) | {}

-------
Filters not implemented yet :
* Car models (depending on the brand)
* Dates ("holidays" categories)
* Clothes sizes (depending on the gender)

Feel free to contact me for any suggestion, issue, improvement...
