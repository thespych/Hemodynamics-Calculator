const express = require("express");

// The router will be added as a middleware and will take control of requests starting with path /calculation.
const calcuationRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the calculations.
calcuationRoutes.route("/calculation").get(async function (req, response) {
  let db_connect = dbo.getDb();

  db_connect
    .collection("calculations")
    .find({})
    .toArray()
    .then((data) => {
      console.log(data);
      response.json(data);
    });

});

// This section will help you get a single record by id
calcuationRoutes.route("/caclulation/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: new ObjectId(req.params.id) };
 db_connect
   .collection("calculations")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});

// This section will help you create a new record.
// TODO: Add functionality for selected patient -- right now defaults to first in recordlist
calcuationRoutes.route("/calculation/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 db_connect.collection("records").findOne() // To be changed
 .then(result=> {
    let myobj = {
        patient_id: result._id,
        date: new Date(),
        valueType: req.body.valueType, 
        calculatedValue: req.body.calculatedValue,
      };
      db_connect.collection("calculations").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
      });
 })
});

// This section will help you update a record by id.
calcuationRoutes.route("/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: new ObjectId(req.params.id) };
 let newvalues = {
   $set: {
    value: req.body.calculatedValue,
   },
 };
 db_connect
   .collection("calculations")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated");
     response.json(res);
   });
});

// This section will help you delete a record
calcuationRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: new ObjectId(req.params.id) };
 db_connect.collection("calculations").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});

module.exports = calcuationRoutes;