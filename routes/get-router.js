/**
 * Created by Jahongir on 31-Jan-17.
 */
var Medicine = require("../models/medicines"),
    MedicineController = require("../controllers/medicine-controller"),
    ComingController = require("../controllers/coming-controller"),
    SaleController = require("../controllers/sale-controller"),
    CreditController = require("../controllers/credit-controller"),
    ReportController = require("../controllers/report-controller"),
    main = require("../controllers/common-functions"),
    router = require("./app"),
    mongoose = require('mongoose');

router.get('/getContent', function (req, res) {

    if(req.query.content == 'medicines'){
        MedicineController.listOfMedicines(res);
    }else if (req.query.content == 'comings'){
        ComingController.listOfComings(res);
    }else if (req.query.content == 'sales'){
        SaleController.listOfSales(res);
    }else if (req.query.content == 'credits'){
        CreditController.listOfCredits(res);
    }else if (req.query.content == 'reports'){
        ReportController.listOfTodaysSales(res, null);
    }

});

router.get('/getContentByFilter', function (req, res) {

    if (req.query.content == 'comings'){
        if (req.query.option == 'all'){
            ComingController.listOfComings(res);
        }else {
            ComingController.listOfComingsByFilter(res, req.query.option);
        }
    }else if (req.query.content == 'sales'){
        if (req.query.option == 'all') {
            SaleController.listOfSales(res);
        }else{
            SaleController.listOfSalesByFilter(res, req.query.option);
        }
    }else if (req.query.content == 'credits'){
        if (req.query.option == 'all') {
            CreditController.listOfCredits(res);
        }else {
            CreditController.listOfCreditsByFilter(res, req.query.option);
        }
    }else if (req.query.content == 'reports'){
        if (req.query.option == 'all') {
            var match = {$match: {credit: false}}, match2 = {$match: {credit: true}};
            ReportController.listOfReportByFilter(res, match, match2);

        }else if (req.query.option == 'today'){
            ReportController.listOfTodaysSales(res, null);

        } else {
            var data = main.filterOption(req.query.option);
            match = {$match: {date: {$gte: data.start, $lt: data.end}, credit: false}};
            match2 = {$match: {date: {$gte: data.start, $lt: data.end}, credit: true}};

            ReportController.listOfReportByFilter(res, match, match2);
        }
    }
});

router.get('/getReportByFilter', function (req, res) {
    var start =  new Date(req.query.from);
        start.setHours(0,0,0,0);
    var end =  new Date(req.query.still);
        end.setHours(23,59,59,999);
    var match = {$match: {date: {$gte: start, $lt: end}, credit: false}},
        match2 = {$match: {date: {$gte: start, $lt: end}, credit: true}};

    ReportController.listOfReportByFilter(res, match, match2);
});

router.get('/getContentByPage', function (req, res) {
    if (req.query.content == 'comings'){
        ComingController.listOfComings(res, Number(req.query.page));
    }else if (req.query.content == 'sales'){
        SaleController.listOfSales(res, Number(req.query.page));
    }else if (req.query.content == 'credits'){
        CreditController.listOfCredits(res, Number(req.query.page));
    }
});

router.get('/addMedicine', function (req, res) {
    res.render("addNewMedicine");
});

router.get('/getForUpdate', function (req, res) {
    var ID = req.query.id;
    if (req.query.from == "medicine"){
        Medicine.getById(ID, function (medicine) {
            res.render("addNewMedicine", {
                name: medicine.name,
                price: medicine.price,
                photo: medicine.photo
            });
        });
    }
});
