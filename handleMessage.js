var crypto = require('crypto'),
padManager = require("ep_etherpad-lite/node/db/PadManager"),
        fs = require('fs'),
    md5sum = crypto.createHash('md5');

exports.handleMessage = function(hook_name, context, callback){
  if (context.message && context.message.data){
    if (context.message.data.type == 'WRITE_TO_FILESYSTEM' ) { // if it's a request to update an authors email
      // Write padId data to filesystem
      padManager.getPad(context.message.data.padId, null, function(err, value){
        var hash = crypto.createHash('md5').update(context.message.data.padId).digest("hex");
        fs.writeFile("/tmp/"+hash, value.atext.text, function(err) {
          if(err){
            console.err("failed to write text to hashed location");
          }else{
            console.log("Wrote pad contents to /tmp/"+hash);
            // everything went great, we could tell the client here if we wanted..
          }
        });
      });
      callback([null]);
    }
  }
  callback();
}
