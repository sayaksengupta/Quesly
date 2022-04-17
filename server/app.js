require("dotenv").config();
const upload = require("./router/routes");
const socketio = require("socket.io");
const http = require("http");
const express = require("express");
const mongo = require("mongodb");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
const app = express();
app.use(cors());
const cookieParser = require("cookie-parser");
const connection = require("./db/conn");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(require("./router/routes"));
const port = process.env.PORT || 8000;
const { addUser, getUser } = require("./middleware/spaceUsers");

connection();

const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("join", ({ username, selectedSpace }, callback) => {
    const spacename = selectedSpace.spaceName;
    console.log(spacename);
    const { error, user } = addUser({ id: socket.id, username, spacename });
    if (error) {
      console.log(error);
      return callback({ error: "error" });
    }
    console.log(user);
    console.log("Random");
    socket.emit("message", {
      username: "admin",
      message: `${user.username} welcome to the space ${user.spacename}`,
      spacename: `${user.spacename}`,
    });

    socket.broadcast.to(user.spacename).emit("message", {
      username: "admin",
      message: `${user.username} has joined!`,
    });

    socket.join(user.spacename);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log(user);
    io.to(user.spacename).emit("message", {
      username: user.username,
      message: message,
      spacename: user.spacename,
    });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

app.get("/file/:filename", async (req, res) => {
  try {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({ err: "No File Exists!" });
      }

      return res.json(file);
    });
  } catch (e) {
    res.send(`Not Found. ${e}`);
  }
});

app.get("/image/:filename", async (req, res) => {
  try {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({ err: "No File Exists!" });
      }

      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/jpg" ||
        file.contentType === "image/png"
      ) {
        console.log(file.filename);
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: "Not an image",
        });
      }
    });
  } catch (e) {
    res.send(`Not Found. ${e}`);
  }
});

// app.delete("/file/:filename", async(req,res) => {
//     try {
//         await gfs.files.deleteOne({filename: req.params.filename});
//         res.status(200).send("Successfully Deleted!");
//     } catch (e) {
//         res.send(`Not Found. ${e}`);
//     }
// })

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
