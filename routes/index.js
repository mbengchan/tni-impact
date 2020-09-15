var express = require('express');
var router = express.Router();
var path = require('path');
var geoip = require('geoip-lite');
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

/* GET home page. */
router.get('/', async (req, res, next) => {
  // console.log('Headers: ' + JSON.stringify(req.headers));
  console.log('IP: ' + JSON.stringify(req.ip));

  var geo = geoip.lookup(req.ip);
  geo.range = geo.range.toString()
  geo.ll = geo.ll.toString()

  console.log(Object.values(geo))

  appendOptions.resource.values.push(Object.values(geo));
  appendOptions.spreadsheetId = "1I8y1TEjmqlXkOxZqn7jDBcgpMM0epFxmmyg5sP_V0js";
  console.log(appendOptions.resource.values)

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
                // console.log(err)
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

router.get('/download', async (req, res, next) => {
  var filePath = path.join(__dirname, '../public', 'files/vsor_website.pdf');

  res.download(filePath, async (err) => {
    if (!err) return; // file sent
    if (err.status !== 404) return next(err); // non-404 error
    // file for download not found
    // res.statusCode = 404;
    // res.send('Cant find that file, sorry!');
  });
});

module.exports = router;
