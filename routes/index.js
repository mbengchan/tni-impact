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
  console.log('Headers: ' + JSON.stringify(req.headers));
  // console.log('IP: ' + JSON.stringify(req.ip));

  var geo = geoip.lookup(req.ip);
  geo.range = geo.range.toString()
  geo.range = geo.range.replace(",", " - ")
  geo.ll = geo.ll.toString()

  var values = Object.values(geo)
  values.push(req.ip.replace("::ffff:", ""))

  console.log(values)

  appendOptions.resource.values.push(values);
  appendOptions.spreadsheetId = "1I8y1TEjmqlXkOxZqn7jDBcgpMM0epFxmmyg5sP_V0js";

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

router.get('/download', async (req, res, next) => {
  var filePath = path.join(__dirname, '../public', 'files/vsor_website.pdf');

  res.download(filePath, async (err) => {
    if (!err) return; // file sent
    if (err.status !== 404) return next(err);
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
                  return res.json({message: "Thank you. You details have submitted successfully. We write you shortly. God Bless You."});
              })
              .catch((err) => {
                  console.log(err)
                  appendOptions.resource.values = [];
                  return res.json({message: "There has been a problem with the submission operation. Try agin later."});
              })
      })
      .catch((error) => {
          console.log(error);
          appendOptions.resource.values = [];

          res.json({message: "Unhandled error."});
      })
});

module.exports = router;
