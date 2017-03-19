/**
 * Created by Jahongir on 30-Jan-17.
 */

var fs = require('fs');

module.exports = {
    pageCounter: function (p, count) {
      var k = 1, list3 = [];
      while (count > 15){
          count -= 15;
          k++;
      }
      for (var i=1; i <= k; i++){
          var data = {};
          if ( i == p ){ data.currentPage = true;}
          else {data.currentPage = false;}
          data.number = i;
          list3.push(data);
      }

      return list3;
    },

    filterOption: function (option) {

        var start = new Date(), end = new Date();

        if (option == "yesterday"){
            start.setDate(start.getDate() - 1);
            end.setDate(end.getDate() - 1);
        }

        if (option == "currentWeek"){
            start.setDate(start.getDate() - start.getDay());
            end.setDate(end.getDate() - end.getDay() + 6);
        }

        if (option == "lastWeek"){
            start.setDate(start.getDate() - start.getDay() - 7);
            end.setDate(end.getDate() - end.getDay() - 1);
        }

        if (option == "currentMonth"){
            start = new Date(start.getFullYear(), start.getMonth(), 1);
            end = new Date(end.getFullYear(), end.getMonth() + 1, 0);
        }

        if (option == "lastMonth"){
            start = new Date(start.getFullYear(), start.getMonth() - 1, 1);
            end = new Date(end.getFullYear(), end.getMonth(), 0);
        }

        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return {
            start: start,
            end: end
        }

    },

    getDate: function (date) {
        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hour = date.getHours(),
            minute = date.getMinutes();

        if (month < 10){month = '0' + month;}
        if (day < 10){day = '0' + day;}
        if (hour < 10){hour = '0' + hour;}
        if (minute < 10){minute = '0' + minute;}

        return day + "/" + month + "/" + year + "  " + hour + ":" + minute;
    },

    imgSaver: function (image) {
        function decodeBase64Image(dataString) {
            var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                response = {};

            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }

            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');

            return response;
        }

        var url = "";

        if (image){
            var imageBuffer = decodeBase64Image(image.toString());

            var today = new Date(),
                sec = today.getSeconds(),
                min = today.getMinutes(),
                hh = today.getHours(),
                dd = today.getDate(),
                mm = today.getMonth()+1;

            if( dd<10 ){ dd = '0' + dd; }
            if( mm<10 ){ mm = '0'+ mm; }
            today = hh + '_' + min + '_' + sec + '_' + dd + '_' + mm;

            url += '/images/medicines/image'+ today + '.jpg';
            fs.writeFile('./public' + url, imageBuffer.data , function (err) {
                if (err) console.log(err);
            });
        }

        return url;
},

    dateConverter: function (date) {
        var dat = new Date(date),
            day = dat.getDate(),
            month = dat.getMonth(),
            year = dat.getFullYear();

        // if (month < 10){month = '0' + month;}
        // if (day < 10){day = '0' + day;}

        return new Date(year, month, day);
    }
};