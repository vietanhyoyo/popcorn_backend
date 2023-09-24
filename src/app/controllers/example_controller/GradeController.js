const Grade = require('../models/Grade');

class GradeController {

    getAll(req, res) {
        Grade.find({}, (err, doc) => {
            if (err) res.send(err);
            else res.send(doc);
        })
    }

    setSubjectGrade(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const data = req.body;
            Grade.updateOne(
                { _id: data.id },
                { subjects: data.subjects },
                (err, doc) => {
                    if (err) res.send({ status: "Error", message: "Lỗi khi cập nhật dữ liệu", err });
                    else res.send({ status: "Success", doc })
                });
        }
    }

}

module.exports = new GradeController;