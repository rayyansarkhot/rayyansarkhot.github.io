const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SHEET_ID = '1-ceK_eeykNUdE_oHWzFq-jFG6XVR-t5EL-7-QcAVjns';
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name
const RANGE = `${SHEET_NAME}!A:Z`;

const credentials = require('./annular-fold-424515-f7-9dc8689ead67.json'); // Path to your service account key file

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

app.post('/webhook', upload.none(), async (req, res) => {
  // console.log('Incoming request:', req.body);  // Log the entire request body

  const rawRequest = req.body.rawRequest;

  if (!rawRequest) {
    return res.status(400).send('rawRequest is required');
  }

  try {
    const parsedRawRequest = JSON.parse(rawRequest);
    console.log('Parsed rawRequest:', parsedRawRequest);
    const vendor = parsedRawRequest.q12_businessorganizationName;
    const boothNumber = parsedRawRequest.q24_typeA24; // Adjust according to your JSON structure
    console.log("Booth # - " + boothNumber);
    console.log("Booth Name - " + vendor);
    
    if (!boothNumber) {
      return res.status(400).send('Booth # is required');
    }

    // Fetch the data from the Google Sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    console.log(rows);
    if (rows.length) {
      // Find the row with the matching booth number
      const headerRow = rows[0];
      const boothIndex = headerRow.indexOf('Booth');
      const vendorIndex = headerRow.indexOf('Vendor');

      if (boothIndex === -1 || vendorIndex === -1) {
        return res.status(400).send('Sheet must contain "Booth #" and "Vendor" columns');
      }

      let rowIndex;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][boothIndex] === boothNumber) {
          rowIndex = i;
          break;
        }
      }

      if (rowIndex === undefined) {
        console.log("UNDEFINED ROW INDEX");
        return res.status(404).send('Booth # not found');
      }
      console.log(rowIndex);
      // Update the vendor column to 'filled'
      const updateRange = `${SHEET_NAME}!${String.fromCharCode(65 + vendorIndex)}${rowIndex + 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: updateRange,
        valueInputOption: 'RAW',
        resource: {
          values: [[vendor]],
        },
      });

      res.status(200).send('Vendor column updated to filled');
    } else {
      res.status(404).send('No data found in sheet');
    }
  } catch (error) {
    console.error('Error updating sheet:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
