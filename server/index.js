const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db/config');
connectDB();
const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // allow your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


const Todo = require('./db/todo');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Song = require('./db/songs');

const PORT = process.env.PORT;

// const getPublicIp = (req) => {
//     return (
//         req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
//         req.headers["x-real-ip"] ||
//         req.socket.remoteAddress
//     );
// };

app.post('/addtodo', (req, resp) => {
    console.log("Received a request to add todo", req.body);
    const { todo } = req.body;
    //ip address  retrieval


    // const ipAddress = getPublicIp(req);
    // console.log("Network / Public IP:", ipAddress);
    const todoItem = new Todo({ todo});
    todoItem.save().then(() => {
        resp.status(201).json({ message: "Todo added successfully" });
    }).catch((err) => {
        resp.status(500).json({ message: "Error adding todo", error: err });
    });
})

app.get('/gettodos', (req, resp) => {
    Todo.find().then((todos) => {
        resp.status(200).json(todos);

    }).catch((err) => {
        resp.status(500).json({ message: "Error fetching todos", error: err });
    }
    );
});

    // Ensure songs directory exists
    const songsDir = path.join(__dirname, 'songs');
    if (!fs.existsSync(songsDir)) {
            fs.mkdirSync(songsDir);
    }

    // Serve uploaded songs statically under /songs
    app.use('/songs', express.static(songsDir));

    // Multer storage config for song uploads
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, songsDir);
        },
        filename: function (req, file, cb) {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + unique + ext);
        }
    });
    const upload = multer({ storage });

    // Upload a song file. Field name for file should be "song". Title can be provided in body.
    app.post('/addsong', upload.single('song'), async (req, res) => {
        try {
            const { title } = req.body;
            if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
            const publicPath = '/songs/' + req.file.filename; // path saved in DB (publicly accessible)
            const song = new Song({ title: title || req.file.originalname, filename: req.file.filename, path: publicPath });
            await song.save();
            res.status(201).json({ message: 'Song uploaded successfully', song });
        } catch (err) {
            res.status(500).json({ message: 'Error uploading song', error: err });
        }
    });

    // Return list of uploaded songs (records from DB)
    app.get('/getsongs', (req, res) => {
        Song.find().then((songs) => {
            res.status(200).json(songs);
        }).catch((err) => {
            res.status(500).json({ message: 'Error fetching songs', error: err });
        });
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});