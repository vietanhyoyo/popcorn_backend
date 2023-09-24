const Link = require("../models/Link")
const Teacher = require("../models/Teacher")
const News = require("../models/News")
const jwt = require("jsonwebtoken")
const Comment = require("../models/Comment")
const ReComment = require("../models/ReComment")

class NewsController {

    add(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const authorization = req.headers['authorization'];
            if (!authorization) res.sendStatus(401);
            //'Beaer [token]'
            const token = authorization.split(' ')[1];

            if (!token) res.sendStatus(401);
            else {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                    // console.log(err, data)
                    if (err) res.sendStatus(403);
                    else {
                        News.create({ text: req.body.text, createUser: data._id }, (error, doc) => {
                            if (error) res.send(error);
                            else res.send(doc);
                        })
                    };
                });
            }
        }
    }

    getAll(req, res) {
        News.find({})
        .populate({ path: 'createUser', model: 'Account' })
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
            if (err) res.send(err);
            else {
                res.send(docs);
            }
        })
    }

    getCommentByNews(req, res) {
        if (!req.body) res.sendStatus(400)
        else {
            const { news } = req.body
            Comment.find({ news }).populate({ path: 'createUser', model: 'Account' }).exec((err, docs) => {
                if (err) res.send(err)
                else {
                    res.send(docs)
                }
            })
        }
    }

    getCommentsByLesson(req, res) {
        if (!req.body) res.sendStatus(400)
        else {
            const { lesson } = req.body
            Comment.find({ lesson }).populate({ path: 'createUser', model: 'Account' }).exec((err, docs) => {
                if (err) res.send(err)
                else {
                    res.send(docs)
                }
            })
        }
    }

    addComment(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const authorization = req.headers['authorization'];
            if (!authorization) res.sendStatus(401);
            //'Beaer [token]'
            const token = authorization.split(' ')[1];

            if (!token) res.sendStatus(401);
            else {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                    // console.log(err, data)
                    if (err) res.sendStatus(403);
                    else {
                        const { text, news } = req.body;
                        Comment.create({ text, news, createUser: data._id }, (error, doc) => {
                            if (error) res.send(error);
                            else res.send(doc);
                        })
                    };
                });
            }
        }
    }

    addCommentQA(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const authorization = req.headers['authorization'];
            if (!authorization) res.sendStatus(401);
            //'Beaer [token]'
            const token = authorization.split(' ')[1];

            if (!token) res.sendStatus(401);
            else {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                    // console.log(err, data)
                    if (err) res.sendStatus(403);
                    else {
                        const { text, lesson } = req.body;
                        Comment.create({ text, lesson, createUser: data._id }, (error, doc) => {
                            if (error) res.send(error);
                            else res.send(doc);
                        })
                    };
                });
            }
        }
    }

    addReComment(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const authorization = req.headers['authorization'];
            if (!authorization) res.sendStatus(401);
            //'Beaer [token]'
            const token = authorization.split(' ')[1];

            if (!token) res.sendStatus(401);
            else {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                    // console.log(err, data)
                    if (err) res.sendStatus(403);
                    else {
                        const { text, comment } = req.body;
                        ReComment.create({ text, comment, createUser: data._id }, (error, doc) => {
                            if (error) res.send(error);
                            else res.send(doc);
                        })
                    };
                });
            }
        }
    }

    getReCommentByComment(req, res) {
        if (!req.body) res.sendStatus(400)
        else {
            const { comment } = req.body
            ReComment.find({ comment }).populate({ path: 'createUser', model: 'Account' }).exec((err, docs) => {
                if (err) res.send(err)
                else {
                    res.send(docs)
                }
            })
        }
    }

    async likeNews(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const authorization = req.headers['authorization'];
                if (!authorization) res.sendStatus(401);
                //'Beaer [token]'
                const token = authorization.split(' ')[1];

                if (!token) res.sendStatus(401);

                else {
                    const { newsID } = req.body;
                    const data = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

                    let news = await News.findById(newsID)
                    const usersLike = news.usersLike;
                    const find = usersLike.indexOf(data._id)

                    if (find === -1) {
                        usersLike.push(data._id)
                    }
                    else {
                        usersLike.splice(find, 1)
                    }

                    news = {
                        ...news,
                        usersLike
                    }

                    await News.updateOne({ _id: newsID }, { usersLike })
                    res.send(news)

                }
            } catch (error) {
                res.send(error)
            }
        }
    }

    async likeComment(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const authorization = req.headers['authorization'];
                if (!authorization) res.sendStatus(401);
                //'Beaer [token]'
                const token = authorization.split(' ')[1];

                if (!token) res.sendStatus(401);

                else {
                    const { commentID } = req.body;
                    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

                    let comment = await Comment.findById(commentID).populate({ path: 'createUser', model: 'Account' })
                    const usersLike = comment.usersLike;
                    const find = usersLike.indexOf(user._id)

                    if (find === -1) {
                        usersLike.push(user._id)
                    }
                    else {
                        usersLike.splice(find, 1)
                    }

                    console.log(comment)

                    comment = {
                        ...comment,
                        usersLike
                    }

                    await Comment.updateOne({ _id: commentID }, { usersLike })
                    res.send(comment)

                }
            } catch (error) {
                res.send(error)
            }
        }
    }

    async likeReComment(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const authorization = req.headers['authorization'];
                if (!authorization) res.sendStatus(401);
                //'Beaer [token]'
                const token = authorization.split(' ')[1];

                if (!token) res.sendStatus(401);

                else {
                    const { reCommentID } = req.body;
                    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

                    let recomment = await ReComment.findById(reCommentID).populate({ path: 'createUser', model: 'Account' })
                    const usersLike = recomment.usersLike;
                    const find = usersLike.indexOf(user._id)

                    if (find === -1) {
                        usersLike.push(user._id)
                    }
                    else {
                        usersLike.splice(find, 1)
                    }

                    console.log(recomment)

                    recomment = {
                        ...recomment,
                        usersLike
                    }

                    await ReComment.updateOne({ _id: reCommentID }, { usersLike })
                    res.send(recomment)

                }
            } catch (error) {
                res.send(error)
            }
        }
    }

}

module.exports = new NewsController;