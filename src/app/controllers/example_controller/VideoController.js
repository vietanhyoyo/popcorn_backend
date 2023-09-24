const multer = require('multer');
// const url = require('url');
// const fs = require('fs');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/upload/videos');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('Chỉ cho phép tệp mp4'), false);
        }
        cb(null, true);
    }
})

var upload = multer({ storage: storage }).single("file");

class VideoController {

    uploadVideo(req, res) {
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

    // getVideo(req, res) {
    //     /**Lấy tên file ảnh */
    //     // var params = url.parse(req.url, true).query;
    //     const filePath = params.id;
    //     console.log(params)
    //     /**Đọc file ảnh và gửi */
    //     // const urlString = __dirname + `/upload/elearning/${filePath}`;
    //     const fakeString = __dirname + `/upload/videos/${filePath}`;
    //     console.log(fakeString);
    //     fs.readFile(fakeString, function (err, data) {
    //         if (err) res.end(null);
    //         else
    //             res.end(data); // Send the file data to the browser.
    //     });
    // }

}

module.exports = new VideoController;