
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var medicineSchema = new Schema({
    photo: String,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    deleted: Boolean
}, {versionKey: false});

var medicineModel = mongoose.model('medicine', medicineSchema);

module.exports = {
    getAll: function (callback) {
        medicineModel.aggregate(
            {$lookup:{
                from: "sales",  localField: "_id", foreignField: "IdMedicine", as: "sales" }},
            {$lookup:{
                from: "comings", localField: "_id", foreignField: "IdMedicine", as: "comings"}},
            {$project: {
                quanCom:{ $sum:{ $map:{
                    input: "$comings", as: "comings",
                    in:{
                        $add: [
                            {"$ifNull": ["$$comings.quantity" , 0]},
                            {"$ifNull": [0 , 0]}
                        ]}}
                }},
                quanSale:{ $sum:{ $map:{
                    input: "$sales", as: "sales",
                    in:{
                        $add: [
                            {"$ifNull": ["$$sales.quantity" , 0]},
                            {"$ifNull": [0 , 0]}
                        ]}}
                }}, name: 1, photo: 1, price: 1, deleted: 1
            }},
            {$project:{ remainder:{$subtract: ["$quanCom", "$quanSale"]}, name: 1, photo: 1, price: 1, deleted: 1}},
            { $sort : {date: -1}
            },(function (err, medicines){
            if (err) throw err;
            callback(medicines);
        }));
    },
    getById: function (id, callback) {
        medicineModel.findById( id,(function (err, medicine){
            if (err) throw err;
            callback(medicine);
        }));
    },
    delete: function (id, callback) {
        medicineModel.remove({"_id": id},(function (err){
            if (err) throw err;
            callback();
        }));
    },
    update: function (id, data, callback) {
        medicineModel.findByIdAndUpdate(id,{$set: data},(function (err){
            if (err) throw err;
            callback();
        }));
    },
    count: function (callback) {
        medicineModel.count(function (err, count) {
            if (err) throw err;
            callback(count);
        });
    },
    model: medicineModel
};
/**
 * Created by Jahongir on 21-Jan-17.
 */
