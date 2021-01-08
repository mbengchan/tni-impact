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

router.post('/', async (req, res, next) => {
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  let values = Object.values(req.body)
//   values.push(ip.replace("::ffff:", ""))
//   values.push(new Date().toLocaleString('default', { month: 'long' }))

  appendOptions.resource.values.push(values);
  appendOptions.spreadsheetId = "10URfWHtL5gC0_pCJ48VozP6J9N1rxKSx1vr9xvnDi4k";

  return await sheetClient.authorize()
      .then(async (tokens) => {
          const googleSheetsService = google.sheets({version: 'v4', auth: sheetClient});

          return await googleSheetsService.spreadsheets.values.append(appendOptions)
              .then((result) => {
                  appendOptions.resource.values = [];
                  console.log("success")
                  return res.json({message: "Thank you. You have successfully registered for TNI Enlightment Week. We write to you shortly. God Bless You."});
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
