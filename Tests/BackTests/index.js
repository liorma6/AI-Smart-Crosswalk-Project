// Import statements 
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//Create an instance of an express application
const app = express();

//Define the port the server will listen on
const PORT = 3000;

//Define MongoDB Connection String from .env
const MONGO_URI = process.env.MONGO_URI;
//Middleware -> This line allows Express to parse incoming JSON payloads from request bodies (req.body)
app.use(express.json());

//Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// This is the "blueprint" for our data, as we discussed (Data Design).
const eventSchema = new mongoose.Schema({
  eventType: {
    type: String, //The data type for this field
    required: true //This field is mandatory
  },
  timestamp: {
    type: Date, //The data type for this field
    default: Date.now //Sets a default value to the current time
  }
});

//Schema into a model -> our tool to interact with the 'events' collection in the database.
const Event = mongoose.model('Event', eventSchema);


// --- API Endpoints (Routes) ---

//Define a endpoint - This tells the server what to do when someone sends a GET request to the root URL
app.get('/', (req, res) => {
  // req = Request
  // res = Response
  res.send('AI Smart Crosswalk Project- Dor Hayat');
});


//This endpoint creates a new event in the database.
app.post('/events', async (req, res) => {
  try {
    // Create a new event instance using the data from the request body
    const newEvent = new Event({
      eventType: req.body.eventType
    });
    //Save the new event to the database
    const savedEvent = await newEvent.save();
    //Respond with status 201 (Created) and the saved event object
    res.status(201).json(savedEvent);
  } catch (error) { //Handle errors
    res.status(400).json({ message: 'Failed to create event', error: error.message });
  }
});

// This endpoint retrieves all events from the database.
app.get('/events', async (req, res) => {
  try {
    //Find all documents in the 'Event' collection
    const events = await Event.find();
    //Respond with status 200 and the array of events
    res.status(200).json(events);
  } catch (error) { //Handle potential server errors
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// This endpoint deletes a specific event by its unique _id.
app.delete('/events/:id', async (req, res) => {
  try {
    //Get the 'id' parameter from the URL
    const eventId = req.params.id;
    //Find the event by its ID and delete it
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    //Check if an event was actually found and deleted
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    //Respond with status 200 and a success message
    res.status(200).json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) { //Handle errors 
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
});

// This endpoint updates an existing event by its unique _id.
app.put('/events/:id', async (req, res) => {
  try {
    //Get the 'id' parameter from the URL
    const eventId = req.params.id;
    //Get the new data from the request body
    const newData = req.body;

    //Find the event by ID and update it with the new data
    const updatedEvent = await Event.findByIdAndUpdate(eventId, newData, { new: true });

    //heck if an event was found and updated
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    //Respond with status 200 (OK) and the updated event
    res.status(200).json(updatedEvent);

  } catch (error) { //Handle errors
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});


//Start the server - This tells the app to start listening for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running and listening on http://localhost:${PORT}`);
});