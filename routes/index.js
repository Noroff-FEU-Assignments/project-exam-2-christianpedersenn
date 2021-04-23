const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const sendmail = require('sendmail')();
const serviceAccount = require('../serviceAccountKey.json');
const admin = require('firebase-admin');
const moment = require('moment');

// Firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejs-statuspage.firebaseio.com",
  storageBucket: "nodejs-statuspage.appspot.com"
});
let db = admin.firestore();

// Global variables
let reloadBrowserVal = false;

var currentMonth = moment().format("MM")
var currentYear = moment().format("YYYY")
var currentDay = moment().format("DD")
var dateToday = moment().format("DD") + moment().format("MM") + moment().format("YYYY")

router.get('/', function(req, res, next) {
  res.render('index', {title: 'NodeJS Status'})
});

router.get('/reloadBrowser', function(req, res, next) {  
  res.json({ reloadBrowserVal })
});

router.get('/data', function(req, res, next) { 
   
  res.json(incidentArray)
});

let incidentArray = []
let incidentType;
let incidentDate;
let incidentDesc;

// setInterval(getData, 60000);
function getData() {
//   db.collection("date").orderBy("id", "desc").limit(15).get().then((querySnapshot) => {
//     console.log(querySnapshot);
//     querySnapshot.forEach((doc) => {
//         var data = doc.data();
//         let thisMonth = data.id.slice(2, 4)
//         if (thisMonth == currentMonth) {
//             incidentType;
//             incidentDate = data.date;
//             incidentDesc = data.desc;
//             if (data.incident == false) {
//                 incidentType = 'no-incident'
//             } else {
//                 incidentType = 'incident'
//             }           
//         }
//     });
// });  
}
getData()

function reloadBrowser() {
  reloadBrowserVal = true
  setTimeout(() => {
    reloadBrowserVal = false
  }, 60200); 
  // If you want to change this value - be sure to also modify the value in assets/js/main.js. 
  // The value must be somewhat higher than the value in main.js to avoid client browser getting stuck in a reload loop
}


router.post('/subscribe', function(req, res, next) {
  console.log(req.body);
  console.log(req.body.email);
  sendmail({
    from: 'christian@relis.no',
    to: req.body.email,
    subject: 'Subscription RELIS status',
    html: 'Thanks for subscribing to RELIS status.'
  }, function (err, reply) {
    console.log(err && err.stack)
    console.dir(reply)
    res.send({status: 'OK'})
  }) 
});

module.exports = router;
