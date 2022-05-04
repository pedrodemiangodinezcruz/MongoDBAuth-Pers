require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const Bicicleta = require('../models/bicicleta')

/*
Crear una bicicleta, listar todas las bicicletas, 
añadir bicicleta, 
encontrar bici por código, 
eliminar bicicleta.
*/

describe('Test Bicicletas Model', () => {
    beforeEach((done) => {
        const mongoDB = process.env.MONGODB_CONNECTION
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

    // CREATE
    describe('Bicicleta.createInstance', ()=>{
        it('should create a Bicicleta instance without error', ()=>{
            let bici = Bicicleta.createInstance(1, 'verde', 'urbana', [19.28, -99.13])

            assert.equal(bici.code, 1)
            assert.equal(bici.color, 'verde')
            assert.equal(bici.modelo, 'urbana')
            assert.equal(bici.ubicacion[0], 19.28)
            assert.equal(bici.ubicacion[1], -99.13)
        })
    });

    // GET ALL
    describe('Bicicleta.allBicis', ()=>{
        it('should return empty list', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                assert.equal(bicis.length, 0)
                done()
            })
        })
    })

    // INSERT 
    describe('Bicicletas.add', ()=>{
        it('should add a new Bicicleta Instance to the DB', (done)=>{
            let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
            Bicicleta.add(bici, function(err, newBici){
                if(err) console.log(err)
                Bicicleta.allBicis(function(err, bicis){
                    assert.equal(bicis.length, 1)
                    assert.equal(bicis[0].code, bici.code)

                    done()
                })
            })
        })
    })


    // FIND
    describe('Bicicleta.findByCode', ()=>{
        it('should return bike with code 1', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                assert.equal(bicis.length, 0)

                let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
                Bicicleta.add(bici, function(err, newBike){
                    if(err) console.log(err)

                    let bici2 = new Bicicleta({code: 2, color: 'blanca', modelo: 'montaña'})
                    Bicicleta.add(bici2, function(err, newBike){                        
                        if(err) console.log(err)

                        Bicicleta.findByCode(1, function(err, targetBici){
                            assert.equal(targetBici.code, bici.code)
                            assert.equal(targetBici.color, bici.color)
                            assert.equal(targetBici.modelo, bici.modelo)

                            done()
                        })
                    })
                })
            })
        })
    })


    // REMOVE
    describe('Remove a bike by its code', ()=>{
        it('should delete bike with code 1', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                assert.equal(bicis.length, 0)

                let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
                Bicicleta.add(bici, function(err, newBike){
                    if(err) console.log(err)
                    Bicicleta.allBicis(function(err, bicis){
                        assert.equal(bicis.length, 1)
                        Bicicleta.removeByCode(1, function(err, cb){
                            Bicicleta.allBicis(function(err, bicis){
                                assert.equal(bicis.length, 0)
                            
                                done()
                            })
                        })
                    })
                })
            })
        })
    })
})