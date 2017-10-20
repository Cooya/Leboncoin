# Leboncoin.fr HTTP client

This package allows to perform requests on the french e-commerce website "leboncoin.fr". At the moment, it contains 3 simple methods for retrieve items data from the website : search(), get() and watch().


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
category | string | category to look in (see category list below) | "tous"
type | string | type of advertisement ("offres" or "demandes") | "offres"
location | string | location of the item (see location list below) | "dans toute la France"
sellers | string | type of sellers ("tous" or "particuliers" or "professionnels" | "tous"
query | string | matching keywords | none
sort | string | sort criteria ("date" or "prix") | "date" 
titles_only | boolean | search only in ad titles | false 
urgent_only | boolean | search only for urgent ads | false


-------
### Category list

```
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
```
-------
### Location list

```
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
```
