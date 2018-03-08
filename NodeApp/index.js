const express = require ('express');
const ejs = require ('ejs');
const Nexmo = require('nexmo');
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage  = require('multer-gridfs-storage');
const GridStream = require('gridfs-stream');
const methodOverride = require('method-override');
const port = process.env.PORT || 3000;

const app = express();

const nexmo = new Nexmo({
    apiKey: 'XXXXXXXX',
    apiSecret: 'XXXXXXXX'
}, {debug: true});

app.set('view engine','ejs');


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(methodOverride('_method'));

const mongoURI = 'mongodb://XX:12XXX456@ds257858.mlab.com:57858/monogouploads';
let gfs;

const conn = mongoose.createConnection(mongoURI);

conn.once('open', function () {
    //init stream
     gfs = GridStream(conn.db, mongoose.mongo);
  
    gfs.collection('uploads');
  });

app.get('/', (req,res) => {
    gfs.files.find().toArray((err,files) => {
        if(!files || files.length === 0){
         res.render('index', {files: false})
        } else {
            files.map(file => {
              if(file.contentType === 'image/jpeg' || file.contentType === 'img/png'){
                  file.isImage = true;
              } else{
                  file.isImage = false;
              }
            });
            
        }
        
        res.render('index', {files:files});
    });
});

//create storage engine 
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads' //should match collecion name
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

// upload a file
app.post('/upload',upload.single('myfile'), (req,res) => {
 res.redirect('/');
});

// display files
app.get('/files', (req,res) => {
    gfs.files.find().toArray((err,files) => {
        if(!files || files.length === 0){
            return res.status(404).json({err: 'no files exists'});
        }
        return res.json(files);
    });
});


// display one file
app.get('/files/:filename', (req,res) => {
    gfs.files.findOne({filename: req.params.filename}, (err,file) => {
        if(!file || file.length === 0){
            return res.status(404).json({err: 'no file exists'});
        }
        return res.json(file);
    });
});

// display an image
app.get('/image/:filename', (req,res) => {
    gfs.files.findOne({filename: req.params.filename}, (err,file) => {
        if(!file || file.length === 0){
            return res.status(404).json({err: 'no file exists'});
        }
        
        if(file.contentType == 'image/jpeg' || file.contentType == 'img/jpg' ) {
            const  readstream = gfs.createReadStream(file.filename);
             readstream.pipe(res);
        }else{
            res.status(404).json({err: 'not an image'});
        }
    });
});

//delete a file 
app.delete('/files/:id',(req,res)=> {
  gfs.remove({_id:req.params.id, root: 'uploads'}, (err,gridStore)=>{
     if(err){
         return res.status(404).json({err:err});
     }else {
         res.redirect('/');
     }
  });
});














//nexmo api
app.post('/send', (req,res) => {
const number = '91'+req.body.number;
const msg = req.body.msg;


nexmo.message.sendSms('Rubiks-cube', number, msg, {type:'unicode'},
(err, resp)=>{
if(err){
    console.log(err);
}else { 
    
    let data = {
    id: resp.messages[0]['messsage-id'],
    number: resp.messages[0]['to']
    }
    res.json({data:data});
    
}
});


});





//paypal api
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AcDhUuWxChdbi_TYXXXXXXXXXXXXXXXXXXXXXXXXXXXX5rHok9ald-doK4BJqTeqOkjI9cNiEesWcUxEc2KzXOF',
    'client_secret': 'EXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXTHzihAOCvlUpqsi__JL_YQb6IRqkBswYDNqLrv8Hsb'
  });

app.post('/pay', (req,res) => {

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "The alchemist",
                    "sku": "001",
                    "price": "200.00",
                    "currency": "INR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "INR",
                "total": "200.00"
            },
            "description": "the book."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let index = 0; index < payment.links.length; index++) {
                //Redirect user to this endpoint for redirect url
                    if (payment.links[index].rel === 'approval_url') {
                        res.redirect(payment.links[index].href);
                    }
                }
        console.log(payment);
        }
    });
});

app.get('/success', (req,res) => {

const payerId = req.query.PayerID;
const paymentId = req.query.paymentId;

const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "INR",
            "total": "200.00"
        }
    }]
};



paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
       // console.log(JSON.stringify(payment));
        res.send('Success!');
    }
});

});

app.get('cancel', (req,res)=>{
    res.send('Cancelled');
});

app.listen(port, ()=>{
  console.log(`listening on..'${port}`);
});





