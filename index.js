const express = require("express");
const dotenv = require("dotenv");
const mongoose= require("mongoose");
const app = express();
const SafesModel = require('./models/Safes.js')
const cors = require("cors");


dotenv.config();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

//Home Route
app.get("/", (req, res) => {
    res.send("Hello world! This is my entry to the real backend")
})

//Get all Safes 
app.get("/safes", (req, res) => {
    SafesModel.find({},(err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

//Create a new Safe
app.post("/safes", async (req, res) => {
    const safe = req.body;
    const newSafe = new SafesModel(safe);
    await newSafe.save();

    res.send(safe);
})

//Select Safe by id
app.post("/safes/:id", async (req, res) => {
    const id = req.params.id;

    SafesModel.bulkWrite([
        {
            updateOne: {
                filter: { _id: id},
                update: { select: true}
            }
        },
        {
            updateMany: {
                filter: { _id: {$ne: id}},
                update: { select: false}
            }
        },
    ]).then((result) => res.send(result));
})

//Edit Safe data by id
app.patch("/safes/:id", async (req, res) => {
    const id = req.params.id;

    SafesModel.findByIdAndUpdate(id, req.body,(err, result)=> {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
})

//Delete Safe data by id
app.delete("/safes/:id", async (req, res) => {
    const id = req.params.id;

    SafesModel.findByIdAndDelete(id, (err, result)=> {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
})

//Create a new secret inside safe using id
app.post("/safes/secrets/:safeId", async (req, res) => {
    const safe = req.body;
    console.log(safe);
    const safeId = req.params.safeId;
    SafesModel.findByIdAndUpdate(safeId, safe, {new: true}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
})

//Delete a secret inside safe using id
app.delete("/safes/:safeId/secrets/:secretId", async (req, res) => {
    const secretId = req.params.secretId;
    const safeId = req.params.safeId;
    console.log(secretId)
    SafesModel.updateOne({"_id" : safeId}, {
        "$pull": {
          "secrets": {
            "_id": secretId
          }
        }}, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                console.log(result)
                res.send(result);
            }
        });
})

app.listen(PORT, () => console.log("Server has started at PORT", PORT));