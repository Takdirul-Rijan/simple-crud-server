const express = require("express");

const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// simpleDBUser
// Fcz9cU1Vk4SkUhkJ

// const uri =
//   "mongodb+srv://simpleDBUser:<db_password>@cluster0.qcldgif.mongodb.net/?appName=Cluster0";

const uri =
  "mongodb+srv://simpleDBUser:Fcz9cU1Vk4SkUhkJ@cluster0.qcldgif.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Simple CRUD server is running");
});

async function run() {
  try {
    await client.connect();

    const usersDB = client.db("usersDB");
    const usersCollection = usersDB.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find().sort({ date: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Need user with id", id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // add database related apis here

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("User info", newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      console.log("to update", id, updatedUser);

      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const options = {};
      const result = await usersCollection.updateOne(query, update, options);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      console.log(req.params.id);
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);

      // console.log("Delete a user from database");
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Simple CRUD server is running on port: ${port}`);
});

// async function run() {
//   // await
// }
// run().catch(console.dir);
