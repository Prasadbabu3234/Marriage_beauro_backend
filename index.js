const express = require('express')
const { MongoClient, ServerApiVersion, CURSOR_FLAGS } = require('mongodb');
const jwt = require('jsonwebtoken')
// const {PORT}  = require('dotenv')
const cors = require('cors')
const app = express();
const fs = require('fs');
const { ObjectId } = require('mongodb');





app.use(cors())
app.use(express.json())


const url = "mongodb+srv://prasadbabuyanbu:prasad3234@cluster0.wdccmqo.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



app.get("/", (req, res) => {
    res.send("hello")
})

app.post('/login', async (req, res) => {

    try {
        const receivedData = req.body; // This will contain the data sent from Angular
        const collection1 = client.db('UserDetails').collection('Users');
        const allData = await collection1.find({ "$or": [{ "mobile": receivedData.mobile }, { "email": receivedData.mobile }, { "password": receivedData.password }] }).toArray();
        if (allData.length > 0) {
            if (allData[0].mobile == receivedData.mobile || allData[0].email === receivedData.mobile) {
                if (allData[0].password === receivedData.password) {
                    let data = receivedData.mobile
                    let token = jwt.sign(data, 'myToken')
                    res.send({ token: token, allData })
                } else {
                    res.status(403).json({ message: 'Incorrect passoword' })
                }
            } else {
                res.status(403).json({ message: "Incorrect Email or Mobile" })
            }
        }
        else {
            res.status(403).json({ message: 'No user Found' })
        }
    }
    catch (error) {
        console.log(error)
    }
})

app.post("/register", async (req, res) => {

    try {
        const receivedData = req.body;
        const collection1 = client.db('UserDetails').collection('Users');
        const allData = await collection1.find({ "$or": [{ "mobile": receivedData.mobile }, { "email": receivedData.email }] }).toArray();
        if (allData.length == 0) {
            collection1.insertOne({
                "username": receivedData.username, "email": receivedData.email,
                "password": receivedData.password, "mobile": receivedData.mobile
            })
            res.send("account created")
        } else {
            res.status(409)
            res.send('email or mobile is already registered')
        }

    }
    catch (error) {
        console.log(error)
    }
});

app.post('/profile', async (req, res) => {
    try {
        const collection1 = client.db('Mrriage-buearo').collection('Marriage_Details');

        const update = await collection1.updateOne(
            { _id: new ObjectId("650976adbfa106c424242dd5") },
            {
                $set: {
                    imageName: 'example.jpg',
                    imageData: imageBuffer,
                }
            }
        )
        console.log("inserted successfully")
        res.send("inserted successfully")
    } catch (error) {
        console.log(error)
    }
})

app.get('/profiles', async (req,res) => {
    try {
        const collection1 = client.db('Mrriage-buearo').collection('Marriage_Details');
        const result = await collection1.find({}).toArray()
        res.send(result)
    } catch (error) {
        
    }
})

app.get('/profile/:id', async(req,res) => {
    try {
        const collection1 = client.db('Mrriage-buearo').collection('Marriage_Details');
        const result = await collection1.find({"_id": new ObjectId(req.params.id)}).toArray()
        res.send(result)
    } catch (error) {
        
    }
})

app.listen(4000, async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!');
        console.log("http://localhost:4000")
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
})