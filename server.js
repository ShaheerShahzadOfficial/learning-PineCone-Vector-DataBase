import express from "express";
import { MongoClient, ObjectId } from "mongodb"
import morgan from 'morgan';
import cors from 'cors'
import path from 'path';
const __dirname = path.resolve();
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import "dotenv/config.js";
import { customAlphabet } from "nanoid";
import './config/index.mjs'

const nanoid = customAlphabet("1234567890", 20)

const openai = new OpenAI({
  // organization: process.env.OPENAI_API_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY
});


const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: process.env.PINE_CONE_API_KEY,
});





const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@todo.lyzzkhz.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(mongodbURI);
const database = client.db('ecom');
const productsCollection = database.collection('products');


const app = express();
app.use(express.json());
app.use(cors(["http://localhost:5173"]));

app.use(morgan('combined'));




app.get("/api/v1/stories", async (req, res) => {

  // try {
  const queryText = req.query.queryText
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: queryText
  })

  const vector = response.data[0].embedding
  console.log(vector)
  const index = pinecone.index(process.env.PINE_CONE_INDEX_NAME)
  await index.query({
    vector: vector,
    topK: 100,
    includeValues: false,
    includeMetadata: true,
  }).then((resp) => {
    res.send({
      response: resp,
      message: "All Stories Are Here"
    })
  }).catch((error) => {
    res.status(400).send({
      message: "Error While Getting Stories",
      error
    })
  })

  // res.send({
  //   response: queryResponse.matches,
  //   message: "All Stories Are Here"
  // })
  // } catch (error) {
  //   res.status(500).send({
  //     message: "Error While Getting Stories",
  //     error
  //   })
  // }

});

app.post("/api/v1/story", async (req, res) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: `${req.body.title} ${req.body.text}`
    })

    const vector = response.data[0].embedding

    const index = pinecone.index(process.env.PINE_CONE_INDEX_NAME);

    const upsertResponse = await index.upsert([{
      id: nanoid(),
      values: vector,
      metadata: {
        title: req.body.title,
        text: req.body.text
      },
    }])

    console.log(upsertResponse)


    res.send({
      upsertResponse,
      message: "story created successfully"
    });
  } catch (error) {
    res.status(500).send({
      error,
      message: "Failed to Create Story Plz Try Again"
    })
  }

});

app.put("/api/v1/story/:id", async (req, res) => {

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: `${req.body?.title} ${req.body?.text}`,
  });
  console.log("response?.data: ", response?.data);
  const vector = response.data[0].embedding

  const index = pinecone.index(process.env.PINE_CONE_INDEX_NAME);
  try {
    const upsertResponse = await index.upsert([{
      id: nanoid(),
      values: vector,
      metadata: {
        title: req.body.title,
        text: req.body.text
      },
    }])
    console.log("upsertResponse: ", upsertResponse);

    res.send({
      message: "story updated successfully"
    });
  } catch (e) {
    console.log("error: ", e)
    res.status(500).send({
      message: "failed to update story, please try later"
    });
  }
});


app.delete("/api/v1/story/:id", async (req, res) => {
  try {

    const index = pinecone.index(process.env.PINE_CONE_INDEX_NAME);

    const deleteResponse = await index.deleteOne(String(req.params.id))

    res.send({
      deleteResponse,
      message: "Deleted Successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Failed to delete Story"
    })
  }

});

//  baseurl/filename.txt
app.get(express.static(path.join(__dirname, "./web/build")));
app.use("/", express.static(path.join(__dirname, "./web/build")));

// /Users/malik/Desktop/_CLASS/SMIT-chatbot-b3/04. nodejs/2. crud operation
app.use('/static', express.static(path.join(__dirname, 'static')))


app.use((req, res) => {
  res.status(404).send("not found");
})


const port = process.env.PORT || 8088;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});