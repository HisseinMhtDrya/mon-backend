const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("la connexion est etablie avec succes");
    })
    .catch(error => {
        console.log("echec de connexion", error);
    })

const studentModel = mongoose.model("students", mongoose.Schema())

app.get("/students", async (request, response) => {
    const students = await studentModel.find();

    if (!students) {
        response.status(404).send({
            message: "opperation echoue"
        });
        return;
    }

    response.send({
        message: "opperation reussi", students
    });
})

app.post("/students", async (req, res) => {
//    console.log(req.body)
 const { name, age } = req.body;
    // const student  = req.body;

    const newStudent = await studentModel.create({
        name,
        age
    })
    // const newStudent = await studentModel.create(student);

    if (!newStudent) {
        response.status(401).send({
            message: "operation erreur"

        })
        return;
    }

    res.status(201).send({
        message: 'students ajouter avec succes',
        newStudent
    })
})


// Lancement du serveur
app.listen(port, () => {
    console.log(`le server ecoute sur le port:${port}`)

});
