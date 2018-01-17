var express=require('express');
var app=express();
var morgan=require('morgan');
var mongoose=require('mongoose');
var bodyparser=require('body-parser');
var port=process.env.PORT||3000;
var approutes=require('./app/routes/api');
var path=require('path');
var cors =require('cors');
	

app.use(bodyparser.json());
app.use(morgan('dev'));
app.use(cors());
//app.use(express.static(__dirname+'/public'));
 app.use('/api',approutes);
 


 //use middleware first before connecting...
mongoose.connect('mongodb://localhost:27017/mean',function(err){
if(err){
	console.log('error'+err);
}
else{
	console.log('mongodb');
}
});
 

//listening to server

app.listen(port,function(req,res){
	
	console.log('started sever at: '+ port);
});


	
