var express = require('express');
const Applications = require('../libs/applications');
const axios = require('axios');
var router = express.Router();
var appLib = new Applications();

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
 * Search by school name or zip
 * @param name school.name
 * @param zip zip
 */
router.get('/collegecard/:zip?/:name?', async function (req, res, next) {

    var url = `https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=${process.env.COLLEGE_CARD_APIKEY}`;

    if (req.params.zip)
        url += `&zip=${req.params.zip}`
    if (req.params.name)
        url += `&school.name=${req.params.name}`

    console.log(url);

    axios.get(url)
        .then(function (r) {
            // console.log(r.data);
            var formattedResult = r.data.results.map(d => {
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
                newObj['programs'] = d.latest.programs['cip_4_digit'].map(dp => {
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

module.exports = router;
