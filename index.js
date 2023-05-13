const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://rezoanshawon:rbSrWbkFBKoUmFc2@cluster0.smadxws.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//rezoanshawon
//rbSrWbkFBKoUmFc2

async function run() {
  try {
    const database = client.db("testMongo");
    const userCollection = database.collection("userCollection");
    // create a document to insert

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const allUser = await cursor.toArray();
      res.send(allUser);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newuser = req.body;
      const result = await userCollection.insertOne(newuser);
      res.send(result);
    });

    app.put(`/users/:id`, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const user = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          address: user.address,
          phone: user.phone,
          email: user.email,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
      console.log(result);
    });
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port);
