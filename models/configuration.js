/**
 * Created by JAHONGIR-PC on 05/22/2016.
 */
var mongoose = require("mongoose");

var connStr = "mongodb://Jahongir:Jaxa9696@ds139959.mlab.com:39959/veterinarypharmacy";

mongoose.Promise = global.Promise;
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log("Successfully connected to MongoDB");
});
