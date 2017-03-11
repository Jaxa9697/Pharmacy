
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var saleSchema = new Schema({
    IdMedicine: {type:  Schema.Types.ObjectId, required: true},
    date: {type: Date, default: Date.now, required: true},
    quantity: {type: Number, required: true},
    totalSum: Number,
    credit: Boolean,
    creditDesc: String,
    payed: Boolean
}, {versionKey: false});

var saleModel = mongoose.model('sale', saleSchema);

module.exports = {
    getAll: function (page, callback) {
        saleModel.aggregate(
            {$lookup: {
                    from: "medicines", localField: "IdMedicine", foreignField: "_id", as: "medicine"
            }},
            {$project: {
                _id: 1, date: 1, quantity: 1, medicine:{ name: 1 }, totalSum: 1,creditDesc: 1, credit: 1, payed: 1
            }},
            { $sort : { date: -1}},
            { $limit: (page - 1)*15 + 15 },
            { $skip: (page - 1)*15 },
            (function (err, sales){
            if (err) throw err;
            callback(sales);
        }));
    },

    getAllCredits: function (page, callback) {
        saleModel.aggregate(
            {$match: { credit: true}},
            {$lookup: {
                from: "medicines", localField: "IdMedicine", foreignField: "_id", as: "medicine"
            }},
            {$project: {
                _id: 1, date: 1, quantity: 1, medicine:{ name: 1 }, totalSum: 1, creditDesc: 1, credit: 1, payed: 1
            }},
            { $sort : { date: -1}},
            { $limit: (page - 1)*15 + 15 },
            { $skip: (page - 1)*15 },
            (function (err, sales){
                if (err) throw err;
                callback(sales);
            }));
    },

    getCreditById: function (ID, callback) {
        saleModel.aggregate(
            {$match: { _id: ID}},
            {$lookup: {
                from: "medicines", localField: "IdMedicine", foreignField: "_id", as: "medicine"
            }},
            {$project: {
                _id: 1, date: 1, quantity: 1, medicine:{ name: 1 }, totalSum: 1, credit: 1, payed: 1
            }},
            (function (err, sales){
                if (err) throw err;
                callback(sales);
            }));
    },

    creditCount: function (callback) {
        saleModel.aggregate(
            {$match: { credit: true}},
            (function (err, count){
                if (err) throw err;
                callback(count);
            }));
    },

    getById: function (id, callback) {
        saleModel.findById( id,(function (err, medicine){
            if (err) throw err;
            callback(medicine);
        }));
    },

    delete: function (id, callback) {
        saleModel.remove({"_id": id},(function (err){
            if (err) throw err;
            callback();
        }));
    },

    update: function (id, data, callback) {
        saleModel.findByIdAndUpdate(id,{$set: data},(function (err){
            if (err) throw err;
            callback();
        }));
    },

    getByFilter: function (start, end, callback) {
        saleModel.aggregate(
            {$match: {
                date: {$gte: start, $lt: end}
            }},
            {$lookup: {
                from: "medicines", localField: "IdMedicine", foreignField: "_id", as: "medicine"
            }},
            {$project: {
                _id: 1, date: 1, quantity: 1, medicine:{ name: 1 }, totalSum: 1, creditDesc: 1, credit: 1, payed: 1
            }},
            { $sort : { date: -1}},
            (function (err, sale){
            if (err) throw err;
            callback(sale);
        }));
    },

    count: function (callback) {
        saleModel.count(function (err, count) {
            if (err) throw err;
            callback(count);
        });
    },

    model: saleModel
};
/**
 * Created by Jahongir on 21-Jan-17.
 */
