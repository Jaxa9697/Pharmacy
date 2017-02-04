/**
 * Created by Jahongir on 31-Jan-17.
 */
var main = require("./common-functions"),
    Medicine = require("../models/medicines"),
    Coming = require("../models/comings");

module.exports = {
    listOfComings: function (res, page) {
    var p = page || 1;
    Coming.getAll(p, function(coming) {
        if (coming){

            var list = [];
            for (var i=0; i < coming.length; i++){

                var d = coming[i].date,
                    day = d.getDate(),
                    month = d.getMonth() + 1,
                    year = d.getFullYear();

                if (month < 10){month = '0' + month;}
                if (day < 10){day = '0' + day;}

                list.push({
                    number: (p - 1)*15 + i + 1 + '.',
                    name: coming[i].medicine[0].name,
                    date: day + "/" + month + "/" + year,
                    quantity: coming[i].quantity,
                    id: coming[i]._id
                });
            }
            Medicine.getAll( function(medicine) {
                if (medicine) {
                    var list2 = [];
                    for (var i = 0; i < medicine.length; i++) {
                        if (!medicine[i].deleted){
                            list2.push({
                                name: medicine[i].name,
                                id: medicine[i]._id
                            });
                        }
                    }

                    Coming.count(function (count) {
                        var list3 = main.pageCounter(p, count);
                        res.render('comings', { coming: list, medicine: list2, page: list3});
                    });
                }
            });

        }else {
            res.json({message: "error"});
        }
    });
},

    listOfComingsByFilter:function (res, option) {
    var data = main.filterOption(option);
    Coming.getByFilter(data.start, data.end, function(coming) {
        if (coming){

            var list = [];
            for (var i=0; i < coming.length; i++){

                var d = coming[i].date,
                    day = d.getDate(),
                    month = d.getMonth() + 1,
                    year = d.getFullYear();

                if (month < 10){month = '0' + month;}
                if (day < 10){day = '0' + day;}

                list.push({
                    number: i + 1 + '.',
                    name: coming[i].medicine[0].name,
                    date: day + "/" + month + "/" + year,
                    quantity: coming[i].quantity,
                    id: coming[i]._id
                });
            }
            Medicine.getAll( function(medicine) {
                if (medicine) {
                    var list2 = [];
                    for (var i = 0; i < medicine.length; i++) {
                        if (!medicine[i].deleted){
                            list2.push({
                                name: medicine[i].name,
                                id: medicine[i]._id
                            });
                        }
                    }
                    res.render('comings', {
                        coming: list,
                        medicine: list2
                    });
                }
            });

        }else {
            res.json({message: "error"});
        }
    });
}
};