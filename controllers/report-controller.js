/**
 * Created by Jahongir on 01-Feb-17.
 */
var main = require("./common-functions"),
    Report = require("../models/reports"),
    Credit = require("../models/sales");

var ONE_HOUR = 60 * 60 * 1000;

setInterval(function () {
    var myDate = new Date(Date.now() + 9*60*60*1000);
    var one_our_ago = new Date(myDate.getTime() - ONE_HOUR);

    var start = new Date(one_our_ago);
    var end = new Date(Date.now() + 9*60*60*1000);
    // var start = new Date(2017,2,12,0,0,0,0),
    //     end = new Date(2017,2,12,23,59,59,999);
    var data = {
        start: start,
        end: end
    };

    // var date = main.dateConverter(coming[i].date);
    var date = new Date(Date.now());
    var match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: false}};
    Report.createReportForToday(match, function(coming) {
        if (coming && coming.length > 0){
            for (var i=0; i < coming.length; i++){
                var report = new Report.model({
                    date: date,
                    name: coming[i].medicine,
                    quantity: coming[i].quantity,
                    price: coming[i].price,
                    totalSum: coming[i].totalSum,
                    credit: false
                });

                report.save(function (err) {
                    if (err) throw err;
                });
            }

            match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: true, payed: true}};
            Report.createReportForToday(match, function(coming) {
                if (coming){
                    for (var i=0; i < coming.length; i++){
                        var report = new Report.model({
                            date:  date,
                            name: coming[i].medicine,
                            quantity: coming[i].quantity,
                            price: coming[i].price,
                            totalSum: coming[i].totalSum,
                            credit: true
                        });

                        report.save(function (err) {
                            if (err) throw err;
                        });
                    }

                    match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: true, payed: false}};
                    Report.createReportForToday(match, function(coming) {
                        if (coming){

                            for (var i=0; i < coming.length; i++){

                                var report = new Report.model({
                                    date: date,
                                    name: coming[i].medicine,
                                    quantity: coming[i].quantity,
                                    price: coming[i].price,
                                    totalSum: coming[i].totalSum,
                                    credit: true
                                });

                                report.save(function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}, ONE_HOUR);

module.exports = {
    createReportPayedCredit: function (ID) {
        Credit.getCreditById(ID, function (coming) {
            var report = new Report.model({
                date: main.dateConverter(Date.now() + 9*60*60*1000),
                name: coming[0].medicine[0].name,
                quantity: coming[0].quantity,
                price: coming[0].totalSum/coming[0].quantity,
                totalSum: coming[0].totalSum,
                credit: false
            });

            report.save(function (err) {
                if (err) throw err;
            });
        });
    },
    listOfReportByFilter: function (res, match, match2) {
        Report.getReportsByFilter(match, function(coming) {
            if (coming){
                var list = [], totalSum = 0, totalQuantity = 0;
                for (var i=0; i < coming.length; i++){
                    list.push({
                        number: i + 1 + '.',
                        name: coming[i].name,
                        quantity: coming[i].quantity,
                        price: coming[i].price,
                        sum: coming[i].totalSum
                    });
                    totalSum += coming[i].totalSum;
                    totalQuantity += coming[i].quantity;
                }

                Report.getReportsByFilter(match2, function(coming) {
                    if (coming){
                        var list2 = [], totalSumC = 0, totalQuantityC = 0;
                        for (var i=0; i < coming.length; i++){
                            list2.push({
                                number: i + 1 + '.',
                                name: coming[i].name,
                                quantity: coming[i].quantity,
                                price: coming[i].price,
                                sum: coming[i].totalSum
                            });
                            totalSumC += coming[i].totalSum;
                            totalQuantityC += coming[i].quantity;
                        }
                    }

                    res.render('reports', {
                        payed: list,
                        totalSum: totalSum,
                        totalQuantity: totalQuantity,
                        credit: list2,
                        totalSumC: totalSumC,
                        totalQuantityC: totalQuantityC
                    });
                });
            }else {
                res.json({message: "error"});
            }
        });
    }
};