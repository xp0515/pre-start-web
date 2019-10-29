const MJ_APIKEY_PUBLIC = '9d429879ec29ef3ac6302bad0517208d'
const MJ_APIKEY_PRIVATE = 'd51246fcf952baf3c80b1ef69bde5fc5'

const SENDER_EMAIL = 'claire@solbox.com.au'
const RECIPIENT_EMAIL = 'peng@solbox.it'

const mailjet = require('node-mailjet')
    .connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE)
const request = require("request");


module.exports.sendEmail = (req, res, next) => {
    mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [{
                "From": {
                    "Email": SENDER_EMAIL,
                    "Name": "SolBox Pre-Start Check"
                },
                "To": [{
                    "Email": req.body.email,
                    "Name": "Peng"
                }],
                "Subject": "Pre-start check result",
                "HTMLPart": `<h3>Inspection Plan: ${req.body.plan}<br />
            Vehicle: ${req.body.vehicle}<br/>
            Status: ${req.body.status}<br/>
            Time: ${req.body.shortTime}<br/>
            Duration: ${req.body.duration}<br/>
            Performed by: ${req.body.performedBy}<br/>
            <a href="${req.body.view}">Click here to view</a><br/></h3>`
            }]
        })
        .then((result) => {
            res.status(200).send({ message: 'Email sent successfully' })
        })
        .catch((err) => {
            res.status(500).send(err)
        })
}

module.exports.sendSms = (req, res, next) => {
    const options = {
        method: 'GET',
        url: 'https://api.smsbroadcast.com.au/api-adv.php',
        qs:
        {
            username: 'solbox',
            password: 'SB@solbox',
            to: req.body.receiver,
            message: req.body.message
        },
        headers:
        {
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            'Accept-Encoding': 'gzip, deflate',
            Host: 'api.smsbroadcast.com.au',
            'Postman-Token': '104ae170-9a94-41cd-a932-a90be17ced09,34326380-8afe-4834-88db-faef8902454f',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'User-Agent': 'PostmanRuntime/7.17.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    });
}
