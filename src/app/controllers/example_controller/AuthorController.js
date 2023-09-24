const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt-nodejs');
const Account = require('../models/Account');

class AuthorController {

    async login(req, res) {

        const data = req.body;
        if (data.username !== undefined && data.password !== undefined) {

            const account = await Account.findOne({ username: data.username });

            if (account) {
                //Kiem tra mat khau
                const bool = bcrypt.compareSync(data.password, account.password);
                if (bool) {
                    const role = account.role;
                    const _id = account._id;
                    const accessToken = jwt.sign({ _id, username: data.username, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
                    const refreshToken = jwt.sign({ _id, username: data.username, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "12h" });

                    account.refreshToken = refreshToken;
                    await account.save();

                    res.send({ status: "Success", accessToken, refreshToken, role });
                } else {
                    res.send({ message: "Mật khẩu không đúng!", status: "Error" });
                }
            }
            else res.send({ message: "Tài khoản không đúng!", status: "Error" });
        }
        else res.send({ message: "Chua nhap thong tin!", status: "Error" });
    }

    async checkRefreshToken(req, res) {
        const reToken = req.body.token;
        if (!reToken) res.sendStatus(401);
        else {

            jwt.verify(reToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
                //console.log(err, data)
                if (err) res.sendStatus(401);
                else {
                    const account = await Account.findOne({ username: data.username });
                    if (!account) res.sendStatus(401);
                    else {
                        if (account.refreshToken === reToken) {
                            const role = account.role;
                            const _id = account._id;
                            const accessToken = jwt.sign({ _id, username: data.username, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20m" });
                            const refreshToken = jwt.sign({ _id, username: data.username, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });

                            account.refreshToken = refreshToken;
                            await account.save();

                            res.send({ status: "Success", accessToken, refreshToken });
                        }
                        else res.sendStatus(401);
                    }
                }
            });
        }
    }
}

module.exports = new AuthorController;