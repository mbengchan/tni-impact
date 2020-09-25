const express = require('express');
const router = express.Router();
const path = require('path');
const geoip = require('geoip-lite');
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

/* GET filipino page. */
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
        values.push("Filipino")
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
                        return res.sendFile(path.join(__dirname, '../views', 'filipino.html'));
                    })
                    .catch((err) => {
                        console.log(err)
                        appendOptions.resource.values = [];
                        return res.sendFile(path.join(__dirname, '../views', 'filipino.html'));
                    })
            })
            .catch((error) => {
                console.log(error);
                appendOptions.resource.values = [];

                res.sendFile(path.join(__dirname, '../views', 'filipino.html'));
            })
    });
});

router.post('/', async (req, res, next) => {
  console.log('IP: ' + JSON.stringify(req.ip));
  console.log(req.body)

  var values = Object.values(req.body)
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
                  return res.json({message: "Salamat. Matagumpay kang naisumite ang mga detalye. Sumusulat kami sa iyo ng ilang sandali. Pagpalain ka ng Diyos."});
              })
              .catch((err) => {
                  console.log(err)
                  appendOptions.resource.values = [];
                  return res.json({message: "Nagkaroon ng problema sa pagpapatakbo ng pagsusumite. Subukan ulit mamaya."});
              })
      })
      .catch((error) => {
          console.log(error);
          appendOptions.resource.values = [];

          res.json({message: "Unhandled error."});
      })
});

module.exports = router;
