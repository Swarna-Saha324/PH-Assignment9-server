const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000; 
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db, usersCollection, doctorsCollection, appointmentsCollection;

async function run() {
  try {
    await client.connect();
    
    db = client.db('docAppoint');
    usersCollection = db.collection('users');
    doctorsCollection = db.collection('doctors');
    appointmentsCollection = db.collection('appointments');
    
    await client.db("admin").command({ ping: 1 });
    console.log("⚡ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Database connection fault tracking:", error);
  }
}
run().catch(console.dir);

// 🩺 Default Base Route
app.get('/', (req, res) => {
    res.send('Doctor Booking Server is Humming Nicely!');
});

// 🩺 API 1: Fetch All Doctors
app.get('/doctors', async (req, res) => {
  try {
    if (!doctorsCollection) {
      return res.status(500).json({ message: "Database connection not ready yet" });
    }
    const doctors = await doctorsCollection.find({}).toArray();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Data fetch layer crashed", error: error.message });
  }
});

// 🩺 API 2: Single Doctor Dynamic Details Parsing via MongoDB _id
app.get('/doctors/:id', async (req, res) => {
  try {
    if (!doctorsCollection) {
      return res.status(500).json({ message: "Database connection not ready yet" });
    }
    
    const targetId = req.params.id;

    if (targetId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(targetId)) {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }

    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(targetId) });
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found in database" });
    }
    
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server parsing index failed", error: error.message });
  }
});

// 🩺 API 3: Book Appointment Registry (POST)
app.post('/appointments', async (req, res) => {
  try {
    if (!appointmentsCollection) {
      return res.status(500).json({ message: "Database connection not ready yet" });
    }
    const bookingData = req.body;
    bookingData.createdAt = new Date();
    const result = await appointmentsCollection.insertOne(bookingData);
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Booking database insertion failed", error: error.message });
  }
});





app.listen(PORT, () => {
    console.log(`🚀 Server is perfectly running on port ${PORT}`);
});