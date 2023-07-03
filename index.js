const userSchema = require("./Model");
const dbconnect = require("./MongooseDb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const server = express();
server.use(cors());
server.use(bodyParser.json());
dbconnect();

server.get("/", async (req, res) => {
  console.log(req.query);

  let filters = {};

  if (req.query.name) {
    filters.name = { $regex: new RegExp(req.query.name, "ig") };
  }

  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.result) || 10;

  

  let skip = (page - 1) * limit;

  let count = await userSchema.find().count();


  let data = await userSchema
    .find(filters)
    .sort({ _id: -1, name: -1 })
    .skip(skip)
    .limit(limit);
  
  const responseObj = {
    data: data,
    count: count,
   
  };
  res.json(responseObj);
});

server.put("/:id", async (req, res) => {
  let personData = await userSchema.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { name: req.body.name } },
    { new: true }
  );
  res.json(personData);
});

server.delete("/:id", async (req, res) => {
  const deletedDocument = await userSchema.deleteOne({ _id: req.params.id });
  res.json(deletedDocument);
});

server.post("/", async (req, res) => {
 
  let dataUser = new userSchema();

  
  console.log("check the data in body", req.body);

  dataUser.name = req.body.name;
  dataUser.phone = req.body.phone;
  dataUser.password = req.body.password;

  const doc = await dataUser.save();
  console.log(doc, "Post request");
  res.json(doc);
 
});

server.listen(3200);

