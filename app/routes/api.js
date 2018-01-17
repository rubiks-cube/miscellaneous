//require express library
var express = require('express');
//require the express router
var fs = require('fs');
const path=require('path');
var router = express.Router();
//require multer for the file uploads
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
/* GET home page. */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.png')
  }
});

var upload = multer({storage: storage}).array('photo',2);


//our file upload function.
router.post('/upload', function (req, res, next) {
      var path = '';
     upload(req, res, function (err) {
      //console.log(req.file.fieldname);
        if (err) {
          // An error occurred when uploading
          console.log(err);
         
        }  
       else{
        res.json({success:'lo'});}
});
});



router.get('/video', function(req, res) {
  const path = 'uploads/xxx.mp4'
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1;
    const chunksize = (end-start)+1;
    const file = fs.createReadStream(path, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    }

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    }
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});


router.get('/download',(req,res)=>{

res.download('uploads/my.pdf', 'report.pdf', function(err){
  if (err) {
    // Handle error, but keep in mind the response may be partially-sent
    // so check res.headersSent
  } else {

    console.log('download callback called');
    // decrement a download credit, etc.
  }
});




})
module.exports = router;