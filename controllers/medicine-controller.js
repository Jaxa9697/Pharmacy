/**
 * Created by Jahongir on 31-Jan-17.
 */
var Medicine = require("../models/medicines");

module.exports = {

    listOfMedicines: function (res) {
        Medicine.getAll( function(medicine) {
            if (medicine){
                var list = [];

                for (var i=0; i < medicine.length; i++){
                    if (!medicine[i].deleted){
                        list.push({
                            number: i + 1 + '.',
                            name: medicine[i].name,
                            photo: medicine[i].photo,
                            price: medicine[i].price,
                            remainder: Math.floor(medicine[i].remainder),
                            id: medicine[i]._id
                        });
                    }
                }

                res.render('medicines', {medicine: list});
            }else {
                res.json({message: "error"});
            }
        });
    }
};
