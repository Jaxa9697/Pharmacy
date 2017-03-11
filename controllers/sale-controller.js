/**
 * Created by Jahongir on 31-Jan-17.
 */
var Medicine = require("../models/medicines"),
    Sale = require("../models/sales"),
    main = require("./common-functions");

module.exports = {
    listOfSales: function (res, page) {
    var p = page || 1;
    Sale.getAll(p, function(coming) {
        if (coming){
            var list = [];
            for (var i=0; i < coming.length; i++){

                var date = main.getDate(coming[i].date);
                list.push({
                    number: (p - 1)*15 + i + 1 + '.',
                    name: coming[i].medicine[0].name,
                    summa: coming[i].totalSum,
                    date: date,
                    quantity: coming[i].quantity,
                    id: coming[i]._id,
                    creditDesc: coming[i].creditDesc,
                    payed: coming[i].payed,
                    credit: coming[i].credit
                });
            }

            Medicine.getAll( function(medicine) {
                if (medicine) {
                    var list2 = [];
                    for (var i = 0; i < medicine.length; i++) {
                        if (!medicine[i].deleted && medicine[i].remainder > 0){
                            list2.push({
                                name: medicine[i].name,
                                id: medicine[i]._id,
                                remainder: medicine[i].remainder
                            });
                        }
                    }

                    Sale.count(function (count) {
                        var list3 = main.pageCounter(p, count);
                        res.render('sales', {
                            coming: list,
                            medicine: list2,
                            page: list3
                        });
                    });
                }
            });

        }else {
            res.json({message: "error"});
        }
    });
    },

    listOfSalesByFilter: function (res, option) {

    var data = main.filterOption(option);
    Sale.getByFilter(data.start, data.end, function(coming) {
        if (coming){
            var list = [];
            for (var i=0; i < coming.length; i++){

                var date = main.getDate(coming[i].date);
                list.push({
                    number: i + 1 + '.',
                    name: coming[i].medicine[0].name,
                    summa: coming[i].totalSum,
                    date: date,
                    quantity: coming[i].quantity,
                    id: coming[i]._id,
                    creditDesc: coming[i].creditDesc,
                    payed: coming[i].payed,
                    credit: coming[i].credit
                });
            }
            Medicine.getAll( function(medicine) {
                if (medicine) {
                    var list2 = [];
                    for (var i = 0; i < medicine.length; i++) {
                        if (!medicine[i].deleted && medicine[i].remainder > 0){
                            list2.push({
                                name: medicine[i].name,
                                id: medicine[i]._id,
                                remainder: medicine[i].remainder
                            });
                        }
                    }

                    res.render('sales', {
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
