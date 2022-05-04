require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const Usuario = require('../models/usuario')
const Bicicleta = require('../models/bicicleta')

/*
A user can make a bicycle reservation
*/

/* let example = Bicicleta.createInstance(99, 'blue', 'vintage', [19.25, -99.15])
await Bicicleta.add(example);
await Usuario.create({nombre: "Test", email:"test@test.com", password: "somePassword", verificado: true}) */

let testUser;
let testBike;

describe('Test Usuario Model', () => {
    beforeEach(function (done)  {
        this.timeout(10000);
        const mongoDB = process.env.MONGODB_CONNECTION
        mongoose.connect(mongoDB, {useNewUrlParser: true})

        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', async function(){  

            await Bicicleta.deleteMany({});
            await Usuario.deleteMany({});
            //let example = Bicicleta.createInstance()
            testBike = await Bicicleta.create({code:99, color:'blue', model:'vintage', lat:19.25, lon:-99.15});
            testUser = await Usuario.create({nombre: "Test", email:"test@test.com", password: "somePassword", verificado: true})

            done();
        })
    })

    afterEach(async function(){
        this.timeout(5000);
        await Bicicleta.deleteMany({})
        await Usuario.deleteMany({})
        const db = mongoose.connection
        db.close()
    })


    // MAKE A RESERVATION
    describe('Usuario.reservar', function () {
        this.timeout(20000);
        it('should create a reservation without error', async () => {
            // Make a reservation for bicycle with code 99
            await testUser.reservar(testBike._id, '2022-04-25', '2022-04-26');            
        })
    })
})