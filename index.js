const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


// user:end-game
// pass:egyHvm4I2YE5Yjfc


const uri = "mongodb+srv://end-game:egyHvm4I2YE5Yjfc@cluster0.myonw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const taskCollection = client.db("end-game").collection("task");
        const completeCollection = client.db("end-game").collection("complete");
        const scheduleCollection = client.db("end-game").collection("schedule");

        app.post('/task', async(req,res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        app.get('/task/:date', async(req,res) => {
            const date = req.params.date;
            const filter = {date: date};
            const result = await taskCollection.findOne(filter);
            res.send(result);
        })

        app.put('/completeTask', async(req,res) => {
            const filter = {};
            const complete = req.body.change;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  complete: complete
                },
            };
            const result = await completeCollection.updateOne(filter,updateDoc,options);
            res.send(result)
        })

        app.get('/completeTask', async(req,res) => {
            const filter = {};
            const result = await completeCollection.findOne(filter);
            res.send(result);
        })

        app.post('/addSchedule', async(req,res) => {
            const card = req.body;
            const result = await scheduleCollection.insertOne(card);
            res.send(result);
        })
        app.get('/schedule', async(req,res) => {
            const result = await scheduleCollection.find({}).toArray();
            res.send(result);
        })
    }
    finally{}
}

run().catch(console.dir)


app.get('/', (req,res) => {
    res.send('Hello world')
})

app.listen(port, () =>{
    console.log('listening port', port);
})