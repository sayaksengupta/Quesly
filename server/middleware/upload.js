const multer = require("multer");
const {GridFsStorage} = require('multer-gridfs-storage');
const crypto = require("crypto");
const path = require('path');

const DB = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jc1k9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// const storage = new GridFsStorage({
//   url: DB,
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg", "image/jpg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-profile-pic-${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: "photos",
//       filename: `${Date.now()}-profile-pic-${file.originalname}`,
//     };
//   },
// });

const storage = new GridFsStorage({
  url: DB,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'photos'
        };
        resolve(fileInfo);
      });
    });
  }
});

module.exports = multer({ storage });
