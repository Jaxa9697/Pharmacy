/**
 * Created by Jahongir on 31-Jan-17.
 */
var main = require("./common-functions"),
    Sale = require("../models/sales");

module.exports = {
    listOfCredits: function (res, page) {
        var p = page || 1;
        Sale.getAllCredits(p, function(coming) {
            if (coming){
                var list = [], k = 1;
                for (var i=0; i < coming.length; i++){
                    var date = main.getDate(coming[i].date);
                    list.push({
                        number: (p - 1)*15 + k + '.',
                        name: coming[i].medicine[0].name,
                        summa: coming[i].totalSum,
                        date: date,
                        id: coming[i]._id,
                        creditDesc: coming[i].creditDesc,
                        payed: coming[i].payed
                    });
                    k++;
                }

                Sale.creditCount(function (record) {
                    var list3 = main.pageCounter(p, record[0].count);
                    res.render('credits', { coming: list, page: list3});
                });
            }else {
                res.json({message: "error"});
            }
        });
    },

    listOfCreditsByFilter: function (res, option) {

    var data = main.filterOption(option);
    Sale.getByFilter(data.start, data.end, function(coming) {
        if (coming){
            var list = [], k = 1;
            for (var i=0; i < coming.length; i++){
                if (coming[i].credit){
                    var date = main.getDate(coming[i].date);
                    list.push({
                        number: k + '.',
                        name: coming[i].medicine[0].name,
                        summa: coming[i].totalSum,
                        date: date,
                        id: coming[i]._id,
                        creditDesc: coming[i].creditDesc,
                        payed: coming[i].payed
                    });
                    k++;
                }
            }
            res.render('credits', {coming: list});
        }else {
            res.json({message: "error"});
        }
    });
}
};
