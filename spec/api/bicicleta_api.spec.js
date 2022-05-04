const mongoose = require('mongoose')
const Bicicleta = require('../../models/bicicleta')
const request = require('request')

let base_url = 'http://localhost:3000/api/bicicletas/'

describe('Bicicletas API', () => {

    beforeEach(function(done){
        var mongoDB = process.env.MONGODB_CONNECTION
        mongoose.connect(mongoDB, {useNewUrlParser: true})

        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', function(){
            //console.log('Connected to the test database')
            done()
        })
    })

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err)
            const db = mongoose.connection
            db.close()
            done()
        })
    })

    describe('GET BICICLETAS /', () => {
        it('Status 200', (done) => {
            request.get(base_url, function(error, response, body) {
                let res = JSON.parse(body)
                expect(response.statusCode).toBe(200)
                let bicis_num = res.bicicletas.length;
                expect(bicis_num).toBe(0)
                done()
            })
        })
    })
    
    describe('POST BICICLETA /create', () => {
        it('Status 200', (done) => {
            let headers = {'content-type' : 'application/json'}
            let aBici = '{"code" : 3, "color": "green", "modelo": "bmx", "lat": -99.13, "lon": 19.28}'
            request.post({
                headers: headers,
                url: base_url + 'create',
                body: aBici
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200)
                let bici = JSON.parse(body).bicicleta
                expect(bici.color).toBe('green')
                expect(bici.ubicacion[0]).toBe(-99.13)
                expect(bici.ubicacion[1]).toBe(19.28)
                done()
            })
        })
    })

    //TODO: add test for removing a bike
    describe('POST BICICLETA create-delete', () => {
        it('Status 204', (done) => {
            const headers = {'content-type' : 'application/json'}
            const aBici = '{"code" : 3, "color": "green", "modelo": "bmx", "lat": -99.13, "lon": 19.28}'
            request.post({
                headers: headers,
                url: base_url + 'create',
                body: aBici
            }, (error, response, body) => {
                const idToDelete = 3;
                const deleteUrl = base_url + 'delete'

                request.post({
                    headers:headers,
                    url: deleteUrl,
                    body: '{"code" : 3}'
                }, (error, response, body) => {
                    expect(response.statusCode).toBe(204)
                    done()
                })
            })})
        })
})

