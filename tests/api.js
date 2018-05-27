const chai = require('chai');
const lbc = require('../client');

const expect = chai.expect;

describe('Leboncoin API tests', () => {
    let itemId = null;

    it('Check search result with a bad category', async () => {
        try {
            await lbc.search({
                category: 'bad_category',
                city_or_postal_code: '75001',
                filters: {
                    'Prix min': 400,
                    'Prix max': 'Plus de 1000'
                }
            });
        }
        catch(e) {
            expect(e.message).to.equal('Invalid category "bad_category", check out the "parameters.json" file to know all the valid categories.');
        }
    });

    it('Check search result with valid request', async () => {
        const result = await lbc.search({
            category: 'informatique',
            type: 'offres',
            region_or_department: 'cantal',
            sellers: 'particuliers',
            query: 'ordinateur',
            sort: 'date',
            titles_only: false,
            urgent_only: false
        });
        expect(result.length).to.equal(35);
        itemId = result[0].id;
    });

    it('Check get item with invalid id', async() => {
        try {
            await lbc.get(12345);
        }
        catch(e) {
            expect(e.message).to.equal('Invalid id "12345", the "id" parameter must be a 10-digit integer.');
        }
    });

    it('Check get item with valid id', async() => {
        const result = await lbc.get(itemId);
        expect(result.title.length);
        expect(result.category).to.equal('Informatique');
    });
});
