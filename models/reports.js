/**
 * Created by Jahongir on 31-Jan-17.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Sale = require("./sales"),
    main =  require("../controllers/common-functions");

var reportSchema = new Schema({
    date: {type: Date, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    totalSum: {type: Number, required: true},
    credit: Boolean
}, {versionKey: false});

var reportModel = mongoose.model('report', reportSchema);
module.exports = {
    createReportForToday: function (match, callback) {
        Sale.model.aggregate(
            match,
            {$lookup: {from: "medicines", localField: "IdMedicine", foreignField: "_id", as: "medicine"}},
            {$project: { price: "$medicine.price",  medicine:{ name: 1}, quantity: 1,date: 1}},
            {$unwind: "$medicine"},
            {$unwind: "$price"},
            {$group:{ _id: "$medicine",
                totalSum: {$sum: {$multiply: ["$price", "$quantity"]}},
                price: {$first: "$price"}, date: {$first: "$date"}, quantity: {$sum: "$quantity"}}},
            {$project: { _id: 0, medicine: "$_id.name", quantity: 1, price: 1, date: 1, totalSum: 1 }},
            (function (err, sales){
                if (err) throw err;
                callback(sales);
            }));
    },
    getReportsByFilter: function (match, callback) {
        reportModel.aggregate(
            match,
            {$group:{ _id: "$name",
                quantity: {$sum: "$quantity"}, totalSum: {$sum: "$totalSum"}, price: {$avg: "$price"}
            }},
            {$project: { _id: 0, name: "$_id",quantity: 1, price: 1, totalSum: 1}},
            (function (err, sales){
                if (err) throw err;
                callback(sales);
            }));
    },
    delete: function (id, callREback) {
        reportModel.remove({"_id": id},(function (err){
            if (err) throw err;
            callback();
        }));
    },
    update: function (id, data, callback) {
        reportModel.findByIdAndUpdate(id,{$set: data},(function (err){
            if (err) throw err;
            callback();
        }));
    },
    count: function (callback) {
        reportModel.count(function (err, count) {
            if (err) throw err;
            callback(count);
        });
    },
    model: reportModel
};
/**
 * Created by Jahongir on 21-Jan-17.
 */
