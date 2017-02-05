/**
 * Created by Jahongir on 01-Feb-17.
 */
var main = require("./common-functions"),
    Report = require("../models/reports");


setInterval(function () {
    // var data = main.filterOption();
    var start = new Date(Date.now());
    start.setMinutes(0,0,0);
    var end = new Date(Date.now());
    end.setMinutes(59,59,999);
    var data = {
        start: start,
        end: end
    };

    var match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: false}};
    Report.createReportForToday(match, function(coming) {
        if (coming){
            var report = new Report.model({
                date: main.dateConverter(coming[i].date),
                name: coming[i].medicine,
                quantity: coming[i].quantity,
                price: coming[i].price,
                totalSum: coming[i].totalSum,
                credit: false
            });

            report.save(function (err) {
                if (err) throw err;
            });

            match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: true, payed: true}};
            Report.createReportForToday(match, function(coming) {
                if (coming) {
                    var report = new Report.model({
                        date: main.dateConverter(coming[i].date),
                        name: coming[i].medicine,
                        quantity: coming[i].quantity,
                        price: coming[i].price,
                        totalSum: coming[i].totalSum,
                        credit: false
                    });

                    report.save(function (err) {
                        if (err) throw err;
                    });

                    match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: true, payed: false}};
                    Report.createReportForToday(match, function (coming) {
                        if (coming) {
                            var report = new Report.model({
                                date: main.dateConverter(coming[i].date),
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
                    });
                }
            });
        }else {
            res.json({message: "error"});
        }
    });
}, 60 * 60 * 1000);

module.exports = {
    listOfTodaysSales: function (res, save) {
        // var data = main.filterOption();
        var start = new Date(Date.now());
            start.setMinutes(0,0,0);
        var end = new Date(Date.now());
            end.setMinutes(59,59,999);
        var data = {
            start: start,
            end: end
        };

        var match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: false}};
        Report.createReportForToday(match, function(coming) {
            if (coming){
                var list = [], totalSum = 0, totalQuantity = 0;
                for (var i=0; i < coming.length; i++){
                    list.push({
                        number: i + 1 + '.',
                        name: coming[i].medicine,
                        quantity: coming[i].quantity,
                        price: coming[i].price,
                        sum: coming[i].totalSum
                    });
                    if (save){
                        var report = new Report.model({
                            date: main.dateConverter(coming[i].date),
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
                    totalSum += coming[i].totalSum;
                    totalQuantity += coming[i].quantity;
                }

                match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: true, payed: true}};
                Report.createReportForToday(match, function(coming) {
                    if (coming){
                        for (var i=0; i < coming.length; i++){
                            list.push({
                                number: i + 1 + '.',
                                name: coming[i].medicine,
                                quantity: coming[i].quantity,
                                price: coming[i].price,
                                sum: coming[i].totalSum
                            });
                            if (save){
                                var report = new Report.model({
                                    date:  main.dateConverter(coming[i].date),
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
                            totalSum += coming[i].totalSum;
                            totalQuantity += coming[i].quantity;
                        }

                        match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: true, payed: false}};
                        Report.createReportForToday(match, function(coming) {
                            if (coming){

                                var list2 = [], totalSumC = 0, totalQuantityC = 0;
                                for (var i=0; i < coming.length; i++){
                                    list2.push({
                                        number: i + 1 + '.',
                                        name: coming[i].medicine,
                                        quantity: coming[i].quantity,
                                        price: coming[i].price,
                                        sum: coming[i].totalSum
                                    });
                                    if (save){
                                        var report = new Report.model({
                                            date:  main.dateConverter(coming[i].date),
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
                                    totalSumC += coming[i].totalSum;
                                    totalQuantityC += coming[i].quantity;
                                }
                            }

                            if (res){
                                res.render('reports', {
                                    payed: list,
                                    totalSum: totalSum,
                                    totalQuantity: totalQuantity,
                                    credit: list2,
                                    totalSumC: totalSumC,
                                    totalQuantityC: totalQuantityC
                                });
                            }
                        });
                    }
                });
            }else {
                res.json({message: "error"});
            }
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