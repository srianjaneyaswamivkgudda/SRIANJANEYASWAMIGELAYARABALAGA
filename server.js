const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNR2_FR2JvDp_wq-z5YQqJ2mwjnvsANnIA-6i989oruvyouK4WZWmzvt45mDMNll8qjw/exec';

app.post('/submit', async (req, res) => {
    try {
        const response = await fetch(https://script.google.com/macros/s/AKfycbxNR2_FR2JvDp_wq-z5YQqJ2mwjnvsANnIA-6i989oruvyouK4WZWmzvt45mDMNll8qjw/exec,) {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        if (response.ok) {
            res.status(200).send('Data submitted successfully.');
        } else {
            res.status(500).send('Failed to submit data.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
