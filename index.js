const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

// Get
app.get('/', (req, res) => {
    res.send('<a href="/appointments" style="text-decoration: none; font-size: 30px; font-weight: 700; color: navy;">Click here to see all data retrieved from Database</a>');
});
app.get('/appointments', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            } else {
                res.send(documents);
            }
        });
        client.close();
    });
});

// Post
app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    appointment.status = "pending";
    appointment.prescription = null;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.insert(appointment, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            } else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});

app.post('/updatePrescription', (req, res) => {
    const appointment = req.body;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.updateOne({ _id: ObjectId(appointment.id) }, { $set: { "prescription": appointment.prescription } }, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
        });
        client.close();
    });
});

app.post('/updateStatus', (req, res) => {
    const appointment = req.body;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.updateOne({ _id: ObjectId(appointment.id) }, { $set: { "status": appointment.status } },
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ message: err })
                }
                else {
                    res.send(result);
                    console.log(result);
                }
            });
        client.close();
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));