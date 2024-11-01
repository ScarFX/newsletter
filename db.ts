// db.ts
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://connorfinn:StrangeChew22@cluster0.8n9oscj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client.db("subs"); // Replace 'myDatabase' with your database name
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

export { client };
