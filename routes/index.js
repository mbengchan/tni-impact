var express = require('express');
var router = express.Router();
var path = require('path');
const {google} = require('googleapis');
const request = require('request');
const serviceAccount = require('../service-account.json');

const sheetClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

const appendOptions = {
  spreadsheetId: null,
  range: "Data!A:A",
  valueInputOption: "USER_ENTERED",
  insertDataOption: "OVERWRITE",
  resource: {
      values: [],
      majorDimension: "ROWS"
  }

};

/* GET home page. */
router.get('/', async (req, res, next) => {
    return await request('http://ipinfo.io', { json: true }, async(err, _, body) => {
        if (err) { return console.log(err); }
        let values = Object.values(body)
        values.pop()
        values.push("English")
        console.log(values);

        appendOptions.resource.values.push(values);
        appendOptions.spreadsheetId = "1gjjIPLFGr9CobzjnMk5d2aw-GXhFsFjFrZG6oktClwo";

        return await sheetClient.authorize()
            .then(async (tokens) => {
                const googleSheetsService = google.sheets({version: 'v4', auth: sheetClient});

                return await googleSheetsService.spreadsheets.values.append(appendOptions)
                    .then((result) => {
                        appendOptions.resource.values = [];
                        console.log("success")
                        return res.sendFile(path.join(__dirname, '../views', 'index.html'));
                    })
                    .catch((err) => {
                        console.log(err)
                        appendOptions.resource.values = [];
                        return res.sendFile(path.join(__dirname, '../views', 'index.html'));
                    })
            })
            .catch((error) => {
                console.log(error);
                appendOptions.resource.values = [];

                res.sendFile(path.join(__dirname, '../views', 'index.html'));
            })
    });
});

router.post('/', async (req, res, next) => {
  console.log('IP: ' + JSON.stringify(req.ip));
  console.log(req.body)

  let values = Object.values(req.body)
  values.push(req.ip.replace("::ffff:", ""))

  appendOptions.resource.values.push(values);
  appendOptions.spreadsheetId = "16LARNya1pWp1_IrPH_wKDhILL7HSZuKt80rscx18L8U";

  return await sheetClient.authorize()
      .then(async (tokens) => {
          const googleSheetsService = google.sheets({version: 'v4', auth: sheetClient});

          return await googleSheetsService.spreadsheets.values.append(appendOptions)
              .then((result) => {
                  appendOptions.resource.values = [];
                  console.log("success")
                  return res.json({message: "Thank you. You details have submitted successfully. We write to you shortly. God Bless You."});
              })
              .catch((err) => {
                  console.log(err)
                  appendOptions.resource.values = [];
                  return res.json({message: "There has been a problem with the submission operation. Try again later."});
              })
      })
      .catch((error) => {
          console.log(error);
          appendOptions.resource.values = [];

          res.json({message: "Unhandled error."});
      })
});

module.exports = router;
