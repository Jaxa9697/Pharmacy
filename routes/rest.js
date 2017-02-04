/**
 * Created by JAHONGIR-PC on 07/15/2016.
 */
var Medicine = require("../models/medicines"),
    MedicineController = require("../controllers/medicine-controller"),
    ComingController = require("../controllers/coming-controller"),
    Coming = require("../models/comings"),
    SaleController = require("../controllers/sale-controller"),
    Sale = require("../models/sales"),
    CreditController = require("../controllers/credit-controller"),
    main =  require("../controllers/common-functions"),
    router = require("index"),
    mongoose = require('mongoose');

router.post('/addMedicine',  function (req, res) {

    var url = main.imgSaver(req.body.image);

    var newMedicine = new Medicine.model({
        photo: url,
        name: req.query.name,
        price: Number(req.query.price)
    });

    newMedicine.save(function(err) {
        if (err) throw err;
        res.json({message:  "Новое лекарство успешно добавлено"});
    });
});

router.delete('/delete', function (req, res) {

    var ID = req.query.id;

    if (req.query.from == 'medicine'){
        Medicine.update(ID,{deleted: true},function () {
            MedicineController.listOfMedicines(res);
        });
    }else if (req.query.from == 'comings'){
        Coming.delete(ID, function () {
            ComingController.listOfComings(res);
        });
    }else if (req.query.from == 'sales'){
        Sale.delete(ID, function () {
            SaleController.listOfSales(res);
        });
    }
});

router.put('/update', function (req, res) {

    var data = {}, ID = req.query.id;
    if(req.query.from == "medicine"){
        data = {
            name: req.query.name,
            price: req.query.price
        };

        if (req.query.photo == "new" || req.query.photo){data.photo = main.imgSaver(req.body.image); }

        Medicine.update(ID, data, function () {
            MedicineController.listOfMedicines(res);
        });
    }

    if(req.query.from == "comings"){
        data = {
            IdMedicine: req.query.IdMedicine,
            date: req.query.date,
            quantity: req.query.quantity
        };
        Coming.update(ID, data, function () {
            ComingController.listOfComings(res);
        });
    }

    if (req.query.from == "sales"){
        Medicine.getById(req.query.IdMedicine, function (medicine) {
            data = {
                IdMedicine: req.query.IdMedicine,
                quantity: req.query.quantity,
                totalSum: req.query.quantity * medicine.price
            };

            if(req.query.creditDesc != undefined){
                if (req.query.credit == "true") data.payed = true;
                if (req.query.credit == "false" || req.query.credit == "" || !req.query.credit) data.payed = false;
                data.credit = true;
                data.creditDesc = req.query.creditDesc
            }else{
                data.payed = false;
                data.credit = false;
            }

            Sale.update(ID, data, function () {
                SaleController.listOfSales(res);
            });
        });

    }

    if (req.query.from == "credits"){
        if (req.query.payed == "true") data.payed = true;
        if (req.query.payed == "false" || !req.query.payed) data.payed = false;

        Sale.update(ID, data,function () {
            CreditController.listOfCredits(res);
        });
    }
});

router.post('/addComing', function (req, res) {

    var id = mongoose.Types.ObjectId(req.query.id);

    var newComing = new Coming.model({
        IdMedicine: id,
        date: req.query.date,
        quantity: req.query.quantity
    });

    newComing.save(function (err) {
        if (err) throw err;
        ComingController.listOfComings(res);
    });
});

router.post('/addSale', function (req, res) {

    var id = mongoose.Types.ObjectId(req.query.id);

    Medicine.getById(id, function (medicine) {
        var newComing = new Sale.model({
            IdMedicine: id,
            date: req.query.date,
            quantity: req.query.quantity,
            totalSum: req.query.quantity * medicine.price
        });

        if(req.query.creditDesc != undefined){
            newComing.credit = true;
            newComing.payed = false;
            newComing.creditDesc = req.query.creditDesc;
        }else {
            newComing.credit = false;
            newComing.payed = true;
        }

        newComing.save(function (err) {
            if (err) throw err;
            SaleController.listOfSales(res);
        });
    });
});
