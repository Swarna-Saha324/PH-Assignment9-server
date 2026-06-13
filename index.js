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

async function connectDB() {
  if (db) return db; 
  try {
    //await client.connect();
    db = client.db('docAppoint');
    usersCollection = db.collection('users');
    doctorsCollection = db.collection('doctors');
    appointmentsCollection = db.collection('appointments');
    console.log(" Successfully connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
  }
}


app.use(async (req, res, next) => {
  await connectDB();
  next();
});


app.get('/', (req, res) => {
    res.send('Doctor Booking Server is Humming Nicely!');
});

// API 1: Fetch All Doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await doctorsCollection.find({}).toArray();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Data fetch layer crashed", error: error.message });
  }
});

// API 2: Single Doctor Dynamic Details Parsing
app.get('/doctors/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(targetId)) {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }
    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(targetId) });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server parsing index failed", error: error.message });
  }
});

// API 3: Book Appointment Registry (POST)
app.post('/appointments', async (req, res) => {
  try {
    const bookingData = req.body;
    bookingData.createdAt = new Date();
    const result = await appointmentsCollection.insertOne(bookingData);
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Booking insertion failed", error: error.message });
  }
});

// API 4: Get Appointments By User Email
app.get('/appointments', async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }
    const query = { userEmail: userEmail }; 
    const result = await appointmentsCollection.find(query).toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
});

// API 5: Update Appointment (PUT)
app.put('/appointments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const { patientName, patientPhone, selectedSlot } = req.body;
    const filter = { _id: new ObjectId(id) };
    
    const updatedDoc = {
      $set: {
        patientName,
        patientPhone,
        selectedSlot,
        updatedAt: new Date()
      },
    };

    const result = await appointmentsCollection.updateOne(filter, updatedDoc);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Appointment record not found" });
    }
    res.status(200).json({ success: true, message: "Appointment updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Update layer failed", error: error.message });
  }
});

//  API 6: Delete Appointment (DELETE)
app.delete('/appointments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const query = { _id: new ObjectId(id) };
    const result = await appointmentsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ success: true, message: "Appointment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed", error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});