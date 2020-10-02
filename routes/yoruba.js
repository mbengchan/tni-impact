const express = require('express');
const router = express.Router();
const path = require('path');
const request = require('request');
const {google} = require('googleapis');
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

/* GET yoruba page. */
router.get('/', async (req, res, next) => {
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
    console.log(ip)
    return await request(`http://ipinfo.io/${ip}`, { json: true }, async(err, _, body) => {
        if (err) { return console.log(err); }
        let values = Object.values(body)
        values.pop()
        values.push("Yoruba")
        values.push(new Date().toLocaleString('default', { month: 'long' }))
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
                        return res.sendFile(path.join(__dirname, '../views', 'yoruba.html'));
                    })
                    .catch((err) => {
                        console.log(err)
                        appendOptions.resource.values = [];
                        return res.sendFile(path.join(__dirname, '../views', 'yoruba.html'));
                    })
            })
            .catch((error) => {
                console.log(error);
                appendOptions.resource.values = [];

                res.sendFile(path.join(__dirname, '../views', 'yoruba.html'));
            })
    });
});

router.post('/', async (req, res, next) => {
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  let values = Object.values(req.body)
  values.push(ip.replace("::ffff:", ""))
  values.push(new Date().toLocaleString('default', { month: 'long' }))

  appendOptions.resource.values.push(values);
  appendOptions.spreadsheetId = "16LARNya1pWp1_IrPH_wKDhILL7HSZuKt80rscx18L8U";

  return await sheetClient.authorize()
      .then(async (tokens) => {
          const googleSheetsService = google.sheets({version: 'v4', auth: sheetClient});

          return await googleSheetsService.spreadsheets.values.append(appendOptions)
              .then((result) => {
                  appendOptions.resource.values = [];
                  console.log("success")
                  return res.json({message: "E dupe. Iwọ awọn alaye ti fi silẹ ni aṣeyọri. A kọwe si ọ laipẹ. Olorun bukun fun o."});
              })
              .catch((err) => {
                  console.log(err)
                  appendOptions.resource.values = [];
                  return res.json({message: "Iṣoro kan wa pẹlu iṣẹ ifakalẹ. Gbiyanju lẹẹkansi nigbamii."});
              })
      })
      .catch((error) => {
          console.log(error);
          appendOptions.resource.values = [];

          res.json({message: "Unhandled error."});
      })
});

module.exports = router;
