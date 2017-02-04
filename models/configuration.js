/**
 * Created by JAHONGIR-PC on 05/22/2016.
 */
var mongoose = require("mongoose");

var connStr = "localhost:27017/Pharmacy";

mongoose.Promise = global.Promise;
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log("Successfully connected to MongoDB");
});
