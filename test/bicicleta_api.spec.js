require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const Bicicleta = require('../models/bicicleta')

const request = require('request');
const BASE_URL = 'http://localhost:3000/api/bicicletas/'

describe('Bicicletas API', function () {

    beforeEach(function (done) {
        var mongoDB = process.env.MONGODB_CONNECTION
        mongoose.connect(mongoDB, { useNewUrlParser: true }, (err) => {
            if (err) {
                console.error(err);
            }
            done()
        })

        //const db = mongoose.connection

    })

    afterEach(function (done) {
        // Limpiar la base de datos completa
        Bicicleta.deleteMany({}, function (err, success) {
            if (err) console.log(err)
            const db = mongoose.connection
            db.close()
            done()
        })
    })

    describe('API GET /bicicletas', function () {
        it('should return a JSON list of all bycicles', function (done) {
            request.get(BASE_URL, function (error, response, body) {
                let res = JSON.parse(body)
                //expect(response.statusCode).toBe(200)
                assert.equal(response.statusCode, 200);
                let bicis_num = res.bicicletas.length;
                assert.equal(res.bicicletas.length, 0);
                done()
            })
        });
    })

    describe('API POST bicicletas/create', () => {
        it('should add a new bicycle without error', (done) => {
            const headers = { 'content-type': 'application/json' }
            const payload = JSON.stringify({
                code: 111,
                modelo: 'Benotto',
                color: 'blanco',
                lat: -99.13,
                lon: 19.28
            })
            request.post({
                headers: headers,
                url: BASE_URL+'create',
                body: payload
            }, (error, response, body) => {
                assert.equal(response.statusCode, 200);
                let newBike = JSON.parse(body).bicicleta
                assert.equal(newBike.color, 'blanco')
                assert.equal(newBike.ubicacion[0], -99.13)
                assert.equal(newBike.ubicacion[1], 19.28)
                done()
            })
        })
    })
});