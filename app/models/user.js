var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstname:{type:String,  required:true},
  lastname:{type:String,  required:true},
  username: {type:String, lowercase:true, required:true}
 
 
  
  
   
  
});



module.exports=mongoose.model('User',UserSchema);



