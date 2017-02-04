
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var comingSchema = new Schema({
    IdMedicine: {type:  Schema.Types.ObjectId, required: true},
    date: {type: Date, default: Date.now, required: true},
    quantity: {type: Number, required: true}
}, {versionKey: false});

var comingModel = mongoose.model('coming', comingSchema);

module.exports = {
    getAll: function (page, callback) {
        comingModel.aggregate(
            {$lookup: {
                from: "medicines", localField: "IdMedicine", foreignField: "_id", as: "medicine"
            }},
            {$project: {_id: 1, date: 1, quantity: 1, medicine:{ name: 1}
            }},
            { $limit: (page - 1)*15 + 15 },
            { $skip: (page - 1)*15 },
            { $sort : {date: -1}},
            (function (err, comings){
            if (err) throw err;
            callback(comings);
        }));

    },
    getById: function (id, callback) {
        comingModel.findById( id,(function (err, medicine){
            if (err) throw err;
            callback(medicine);
        }));
    },
    getByFilter: function (start, end, callback) {
        comingModel.aggregate(
            {$match: {
                date: {$gte: start, $lt: end}
            }},
            {$lookup: {
                from: "medicines", localField: "IdMedicine", foreignField: "_id", as: "medicine"
            }},
            {$project: {_id: 1, date: 1, quantity: 1, medicine:{ name: 1}
            }},
            { $sort : {date: -1}},
            (function (err, sale){
                if (err) throw err;
                callback(sale);
            }));
    },
    delete: function (id, callback) {
        comingModel.remove({"_id": id},(function (err){
            if (err) throw err;
            callback();
        }));
    },
    update: function (id, data, callback) {
        comingModel.findByIdAndUpdate(id,{$set: data},(function (err){
            if (err) throw err;
            callback();
        }));
    },  
    count: function (callback) {
        comingModel.count(function (err, count) {
            if (err) throw err;
            callback(count);
        });
    },
    model: comingModel
};
/**
 * Created by Jahongir on 21-Jan-17.
 */
