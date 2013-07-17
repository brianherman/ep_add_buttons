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
                    fs.writeFile("/tmp/"+hash+'.c', value.atext.text, function(err) {
                        if(err){
                        console.log("failed to write text to hashed location");
                        }else{
                        console.log("Wrote pad contents to /tmp/"+hash+'.c');
                        // everything went great, we could tell the client here if we wanted..
                            var spawn = require('child_process').spawn,
                                ls    = spawn('emcc', ['"/tmp/"+hash+'.c']);

                                ls.stdout.on('data', function (data) {
                                      console.log('stdout: ' + data);
                                });

                                ls.stderr.on('data', function (data) {
                                      console.log('stderr: ' + data);
                                });

                                ls.on('close', function (code) {
                                      console.log('child process exited with code ' + code);
                                });

                        }
                        });
                    });
            callback([null]);
        }
    }
    callback();
}
