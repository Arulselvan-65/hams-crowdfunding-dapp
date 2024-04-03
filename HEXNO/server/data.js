require('dotenv').config();
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const axios = require('axios');
const port = 3002;




app.use(cors());
app.use(express.json());


mongoose.connect(process.env.DB_URL);


const detailSchema = new mongoose.Schema({
  projectID: String,
  smallDescription: String,
  fullDescription: String,
  uri1: String,
  uri2: String,
  uri3: String,
  img1: String,
  img2: String,
  img3: String,
});


const Project = new mongoose.model('projectDetails', detailSchema);


app.post('/submit', async(req, res) => {
  let a = req.body;
  let project = {
  projectID: a.projectId,
  smallDescription: a.smallDescription,
  fullDescription: a.fullDescription,
  uri1: a.uris[0],
  uri2: a.uris[1],
  uri3: a.uris[2],
  img1: a.imgs[0],
  img2: a.imgs[1],
  img3: a.imgs[2]
  }

  let proj = new Project(project);
  await proj.save();

  res.json({message: "Added!!"});
});
app.get('/submissions', async(req, res) => {
  const projects = await Project.find();
  console.log(projects);
  res.json(projects);
});

app.get('/api/credentials', (req,res) =>{
    let data = {
        pinataApiKey: process.env.PINATA_API_KEY,
        pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
    }
    res.json(data);
})

app.listen(port, () => console.log(`Server is running on port ${port}`));
