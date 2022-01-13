require("dotenv").config();
require('../libs/models');
var express = require('express');
const Applications = require('../libs/applications');
const axios = require('axios');
const jwt = require("jsonwebtoken");
const formidable = require('formidable');
const path = require('path');
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Reset = mongoose.model("Reset");
var router = express.Router();
var appLib = new Applications();

/** Authentication */
/** POST - Login */
router.post('/auth/login', async function (req, res, next) {
    console.log(req.body);
    const data = req.body;

    User.find({ email: data.email }, (err, user) => {
        if (err) return res.sendStatus(500);
        console.log(user);
        if (user.length > 0) {
            const _user = new User();
            const isVerified = _user.verifyUser(data.password, user[0].hash);

            if (isVerified) {
                return res.status(200).json({
                    token: jwt.sign({ user: data.email }, process.env.TOKEN_SKT),
                    data: { id: user[0].id, email: user[0].email }
                });
            } else return res.sendStatus(401);
        } else return res.sendStatus(400);
    });
});

/** POST - Signup */
router.post('/auth/signup', async function (req, res, next) {
    console.log(req.body);
    const data = req.body;

    //   check if user with this email does not exist
    User.exists({ email: data.email }, (err, exists) => {
        if (err) return res.sendStatus(500);

        if (exists) return res.sendStatus(409);
        else {
            const user = new User(data);

            user.newUser(data.email, data.password);

            console.log(user);

            user.save((err, user) => {
                if (err) return res.sendStatus(500);

                return res.status(200).json({
                    token: jwt.sign({ user: data.email }, process.env.TOKEN_SKT),
                    data: { id: user.id, email: user.email }
                });
            });
        }
    });
});

/** POST - Reset */
router.post('/auth/reset', async function (req, res, next) {
    console.log(req.body);
    const data = req.body;

    Reset.find({ resetToken: data.token }, (err, resetReq) => {
        if (err) return res.sendStatus(500);
        // console.log(resetReq);
        if (resetReq.length > 0) {
            let expiryDate = new Date(
                resetReq[0].tokenCreatedOn.getTime() + 5 * 60000
            );
            if (+resetReq[0].tokenCreatedOn <= +expiryDate) {
                // console.log(resetReq[0].tokenCreatedOn, expiryDate);
                let user = new User({
                    id: resetReq[0].userId,
                    email: resetReq[0].userEmail,
                    hash: null,
                });

                user.updateHash(data.password);
                console.log(user);

                User.updateOne(
                    { id: resetReq[0].userId },
                    { hash: user.hash },
                    (err, doc) => {
                        if (err) return res.sendStatus(500);
                        console.log(doc);

                        return res.status(200).json("password reset successfully");
                    }
                );
            } else return res.sendStatus(400);
        } else return res.sendStatus(400);
    });
});

/** GET - Reset Link */
router.get('/auth/reset/:email', async function (req, res, next) {
    console.log(req.params.email);
    const email = req.params.email;
    // check if user with this email exists
    User.find({ email: email }, (err, user) => {
        if (err) return res.sendStatus(500);
        console.log(user);
        if (user.length > 0) {
            const reset = new Reset();
            const token = reset.addResetRequest(user[0].email, user[0].id);

            reset.save((err, r) => {
                if (err) return res.sendStatus(500);

                // try {
                //     sendEmail({
                //         to: user[0].email,
                //         subject: "Password Reset Link",
                //         text: `${domain}/reset?token=${token}`,
                //         html: `<p>Click on this <a href="${domain}/reset?token=${token}">link</a> to reset your password.`,
                //     });
                // } catch (error) {
                //     return res.sendStatus(500);
                // }
                // return res.status(200).json("Email with reset link sent");

                // Axios - send to sendgrid email api
                axios.post({
                    url: '/email',
                    method: 'post',
                    baseUrl: process.env.SG_EMAIL,
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        to: user[0].email,
                        subject: "[No Reply] Password Reset Link",
                        text: `${domain}/reset?token=${token}`,
                        html: `<p>Click on this <a href="${domain}/reset?token=${token}">link</a> to reset your password.`
                    }
                })
                    .then(r => {
                        console.log(r);
                        return res.status(200).json("Email with reset link sent");
                    })
                    .catch(e => {
                        console.log(e);
                        return res.sendStatus(500);
                    });
            });
        } else return res.sendStatus(400);
    });
});

/** GET - Get all users */
router.get('/users', async function (req, res, next) {
    User.find({}, (err, users) => {
        if (err) return res.sendStatus(500);
        users = users.map(user => {
            return {
                id: user.id,
                email: user.email
            }
        });
        return res.status(200).json({ users: users })
    });
});
/** END AUTH */

/** FILES */
/** GET - file download */
router.get('/files/:filename', async function (req, res, next) {
    const filename = req.params.filename;

    res.sendFile(path.join(__dirname + process.env.FILE_DIR + filename));
});

/** POST - Upload file */
router.post('/files', async function (req, res, next) {
    const fileData = formidable({
        multiples: false,
        uploadDir: path.join(__dirname + process.env.FILE_DIR),
        keepExtensions: true,
    });

    fileData.parse(req, (err, fields, files) => {
        if (err) return res.sendStatus(500);

        // console.log(files);

        return res.status(201).json({
            filename: files['file']['path'].split('/')[files['file']['path'].split('/').length - 1]
        });
    });
});
/** END FILES */

/** COLLEGE DATA */
/* GET us-colleges list */
router.get('/colleges', async function (req, res, next) {
    try {
        var colleges = await appLib.getColleges();
        res.status(200).json(colleges);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/* GET us-states list */
router.get('/majors', async function (req, res, next) {
    try {
        var majors = await appLib.getCollegeMajors();
        res.status(200).json(majors);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/* GET us-college-majors list */
router.get('/states', async function (req, res, next) {
    try {
        var states = await appLib.getStates();
        res.status(200).json(states);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * POST
 * Use College Card API - US Gov.
 * Search by keyword - school name
 * @param keyword school.name
 */
router.get('/collegecard/:keyword', async function (req, res, next) {

    var url =
        `https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=${process.env.COLLEGE_CARD_APIKEY}&school.name=${req.params.keyword}&per_page=100`;

    console.log(url);

    axios.get(url)
        .then(function (r) {
            // console.log(r.data.results[0].latest.programs['cip_4_digit']);
            // console.log(r.data.metadata);
            var formattedResult = r.data.results.map(d => {
                // console.log(d.latest.school.name);
                var newObj = {
                    "school": {
                        "zip": d.latest.school.zip,
                        "city": d.latest.school.city,
                        "name": d.latest.school.name,
                        "state": d.latest.school.state,
                        "accreditor": d.latest.school.accreditor,
                        "school_url": d.latest.school.school_url,
                        "accreditor_code": d.latest.school.accreditor_code,
                        "price_calculator_url": d.latest.school.price_calculator_url,
                        "programs": []
                    }
                };
                if (!d.latest.programs)
                    return newObj

                newObj['programs'] = d.latest.programs['cip_4_digit'].map(dp => {
                    // console.log(dp.title);
                    var newObjProg = {
                        "cip_4_digit": dp.code,
                        "title": dp.title,
                        "school": {
                            "name": dp.school.name,
                            "type": dp.school.type
                        },
                        "credential": {
                            "title": dp.credential.title
                        }
                    }
                    return newObjProg;
                });
                return newObj;
            });
            // console.log(formattedResult);
            res.status(200).send(formattedResult);
        })
        .catch(function (error) {
            console.log(error);
            res.sendStatus(500);
        });
});
/** END COLLEGE DATA */

module.exports = router;
