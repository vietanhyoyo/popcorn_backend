const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/upload/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage }).single("fileImage");

class ImageController { 

    uploadImage(req, res) {
        upload(req, res, err => {
            if (err) {
                return res.send({ success: false, err })
            }
            else {
                console.log(res.req.file);
                return res.send({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
            }
        })
    }

}

module.exports = new ImageController;