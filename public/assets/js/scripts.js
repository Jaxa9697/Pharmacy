
function setDate() {
    var d = new Date(Date.now()), hour = d.getHours(), minute = d.getMinutes(), second = d.getSeconds();
    if (hour < 10){hour = '0' + hour;}
    if (minute < 10){minute = '0' + minute;}
    if (second < 10){second = '0' + second;}

    $('#time')[0].innerText =  hour + ":" + minute + ":" + second;
}

jQuery(document).ready(function() {

    $.backstretch("assets/img/backgrounds/5.jpg");

    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    var loading = $('#loading'),
        divForModalForms = $('#modalForm'),
        content = $('#bodyLayout');

    $('.login-form').on('submit', function(e) {

        e.preventDefault();
        var counter = 0;

    	$(this).find('input[type="text"], input[type="password"], textarea').each(function(){
            if ($(this).val() != "") {
                $(this).removeClass('input-error');
                 counter++;
            } else {
                $(this).addClass('input-error');
            }
    	});

    	var errorMessage = $('#error'),
            signIn = $('#signIn');

    	if (counter == 2){
            var username = $('input[name="username"]').val(),
                password = $('input[name="password"]').val(),
                remember = $('input[name="remember"]:checked').length > 0;

            errorMessage.hide();
            loading.removeClass('hidden');
            $.ajax({
                type: "get",
                url: "signIn?username=" + username + "&password=" + password + "&remember=" + remember,
                timeout: 20000,
                success: function(json) {
                    loading.addClass('hidden');
                    if (json.message == "error"){
                        errorMessage.hide().removeClass('hidden')
                            .html("Неверный логин или пароль!").show(600);
                    }else{
                        signIn.hide(600);
                        content.html(json);
                        content.css("height", "0px");
                        scriptForMenu();
                    }
                },
                error: function(jqXHR, textStatus, err) {
                    errorMessage.hide().removeClass('hidden')
                        .html(err).show(600);
                    loading.addClass('hidden');
                }
            });
        }

    });

    function middleForm (el){
        var windowD = $(el),
            middleWidth = (document.documentElement.clientWidth - windowD.width()) / 2,
            middleHeight = (document.documentElement.clientHeight - windowD.height()) / 3;

        windowD.css('left',  Math.abs(middleWidth) + 'px');
        if (el == '#goodForm'){
            windowD.css('top',  Math.abs(middleHeight*4) + 'px');
        }else {
            windowD.css('top',  Math.abs(middleHeight) + 'px');
        }

        window.addEventListener('resize', function(){ middleForm(el);});
    }

    function exitModalForm (idWin, ex){
        var windowDefault = $(idWin);

        var exit = document.getElementById(ex);
        exit.onclick = function () {windowDefault.hide(300);}
    }

    if (document.cookie){
        scriptForMenu();
    }

    function filterRecords(from) {
        var filter = document.getElementById('filter'),
            contentMedicines = $('#contentBody');

        filter.onchange = function () {
            var s = this.selectedIndex;
            var filterOption = this[s].value;

            loading.removeClass('hidden');
            $.ajax({
                type: "get",
                url: "getContentByFilter?content=" + from + "&option=" + filterOption,
                timeout: 20000,
                success: function(rows) {
                    loading.addClass('hidden');
                    contentMedicines.html(rows).show(600);
                    if (from == 'comings'){
                        comingsContent(s);
                    }else if (from == 'sales'){
                        salesContent(s);
                    }else if (from == 'credits'){
                        creditContent(s);
                    }else if (from == 'reports'){
                        reportContent(s);
                    }
                },
                error: function(jqXHR, textStatus, err) {
                    loading.addClass('hidden');
                    alert('text status '+textStatus+', err '+err)
                }
            });
        };
    }

    function reportContent(s) {
        filterRecords('reports');
        document.getElementById('filter').selectedIndex = s;
        var contentMedicines = $('#contentBody');
        var dat = new Date(); dat.setDate(dat.getDate() - 1);
        var day = dat.getDate(),
            month = dat.getMonth() + 1,
            year = dat.getFullYear();

        if (month < 10){month = '0' + month;}
        if (day < 10){day = '0' + day;}
        $('input[name="still"]').val(year + "-" + month + "-" + day);

        $('#send').click(function (e) {
            var from = $('input[name="from"]'),
                still = $('input[name="still"]');

            if(isValidDate(from.val())){
                if (isValidDate(still.val())){
                    e.preventDefault();
                    loading.removeClass('hidden');
                    $.ajax({
                        type: "get",
                        url: "getReportByFilter?from=" + from.val() + "&still=" + still.val(),
                        timeout: 20000,
                        success: function(rows) {
                            loading.addClass('hidden');
                            contentMedicines.html(rows);
                            reportContent();
                        },
                        error: function(jqXHR, textStatus, err) {
                            loading.addClass('hidden');
                            alert('text status '+textStatus+', err '+err)
                        }
                    });
                }else {
                    still.get(0).setCustomValidity('Пожалуйста введите правильную дату');
                }
            }else {
                from.get(0).setCustomValidity('Пожалуйста введите правильную дату');
            }
        });

    }

    function scriptForMenu() {
        setInterval('setDate();', 1000);
        var linkOfMenu = $('#menu a'),
            contentMedicines = $('#contentBody');

        function getContent(href) {
            loading.removeClass('hidden');
            $.ajax({
                type: "get",
                url: "getContent?content=" +  href ,
                timeout: 2000,
                success: function(rows) {
                    loading.addClass('hidden');
                    contentMedicines.html(rows).show(600);
                    if (href == 'medicines'){
                        medicineContent();
                    }else if (href == 'comings'){
                        comingsContent();
                    }else if (href == 'sales'){
                        salesContent();
                    }else if (href == 'credits'){
                        creditContent();
                    }else if (href == 'reports'){
                        reportContent();
                    }
                },
                error: function(jqXHR, textStatus, err) {
                    loading.addClass('hidden');
                    alert('text status '+textStatus+', err '+err)
                }
            });
        }

        for (var i=0; i < linkOfMenu.length; i++){
            // linkOfMenu[i].parentElement.style.backgroundColor = "";
            linkOfMenu[i].onclick = function (event) {
                event.preventDefault();
                // this.parentElement.style.backgroundColor = "#dadada";
                // this.parent.addClass('active');
                var href = $(this).attr("href");
                getContent(href);
            }
        }
    }

    function medicineContent() {
        delChangeIcons('settingsOfMedicine','#contentBody');
        var searchForm = $('form[name="search"]'),
            searchText = $('input[name="query"]');
        var medicinePhotos = document.getElementsByClassName('photos'), arrHeights = [];
        var  k = 0;
        console.log(medicinePhotos);
        for (var i=0; i < medicinePhotos.length; i++){
            medicinePhotos[i].onload = function () {
                arrHeights.push(this.parentElement.parentElement.parentElement.parentElement.scrollHeight);
                k++;
                if (k == medicinePhotos.length - 1) {
                    var maxHeight = Math.max.apply(null, arrHeights);
                    console.log(arrHeights);
                    console.log(maxHeight);
                    var medicineBoxes = document.getElementsByClassName('MedicineBox');
                    for (var j=0; j < medicineBoxes.length; j++){
                        medicineBoxes[j].style.height = maxHeight + 'px';
                    }
                }
            };
        }

        searchForm.submit(function(e){e.preventDefault();});
        searchText.keydown(function(){
            var value = $(this).val().toUpperCase();
            var $rows = $(".MedicineBox");

            if(value === ''){ $rows.show(100); }

            $rows.each(function() {
                    var $row = $(this);
                    var column = $row.find("tr").eq(2).find("td").eq(1).text().toUpperCase();
                    var column2 = $row.find("tr").eq(3).find("td").eq(1).text().toUpperCase();

                    if ((column.indexOf(value) > -1) || (column2.indexOf(value) > -1)) {
                        $row.show(100);
                    }
                    else {
                        $row.hide(100);
                    }
            });
        });

        var addRecordButton = document.getElementById('addMedicine');
        addRecordButton.onclick = function () {
            loading.removeClass('hidden');
            $.ajax({
                type: "get",
                url: "addMedicine",
                timeout: 20000,
                success: function(rows) {
                    loading.addClass('hidden');
                    divForModalForms.html(rows).show(600);
                    addNewMedicine();
                },
                error: function(jqXHR, textStatus, err) {
                    loading.addClass('hidden');
                    alert('text status '+textStatus+', err '+err)
                }
            }, divForModalForms.hide());
        };
    }

    function isValidComingForm(e, form) {
        var optionFound = false,
            input = document.querySelectorAll('input[list]')[0], ID, remainder = 0,
            datalist =  input.list;
        var quantity = $('input[name="quantity"]');

        for (var j = 0; j < datalist.options.length; j++) {
            if (input.value == datalist.options[j].value) {
                optionFound = true;
                ID = datalist.options[j].previousSibling.innerText;
                if (form == "sales"){
                    remainder = datalist.options[j].nextSibling.innerText;
                }
                break;
            }
        }

        if (optionFound) {
            input.setCustomValidity('');
            if (!quantity.val() || quantity.val() == "" || quantity.val() == " "){
                quantity.get(0).setCustomValidity('Поля не можеть быть пустым');
            }else if (remainder != 0 && Number(quantity.val()) > Number(remainder)){
                quantity.get(0).setCustomValidity('Значение превышаеть максимума. Обратите внимание на максимума');
            }else {
                var date = $('input[name="date"]');

                if (!isValidDate(date.val())){
                    date.get(0).setCustomValidity('Пожалуйста введите правильную дату');
                }else {
                    e.preventDefault();
                    return {
                        id: ID,
                        quantity: quantity.val(),
                        date: date.val()
                    };
                }
            }
        } else {
            input.setCustomValidity('Пожалуйста введите правильное имя лекарство');
        }
    }

    function comingsContent(s) {
        delChangeIcons('settingsOfComings','#contentBody');
        filterRecords('comings');
        pages('comings');
        document.getElementById('filter').selectedIndex = s;

        $('#addNewComing').click(function (e) {
            var data = isValidComingForm(e);
            if (data){
                loading.removeClass('hidden');
                $.ajax({
                    type: "post",
                    url: "addComing?id=" + data.id + "&date=" + data.date + "&quantity=" + data.quantity,
                    timeout: 20000,
                    success: function(rows) {
                        loading.addClass('hidden');
                        $('#contentBody').html(rows);
                        comingsContent();
                    },
                    error: function(jqXHR, textStatus, err) {
                        loading.addClass('hidden');
                        alert('text status '+textStatus+', err '+err)
                    }
                });
            }
        });
    }

    function pages(from) {
        var pages = $('.pages a'),
            contentMedicines = $('#contentBody');

        for (var i=0; i < pages.length; i++){
            if (pages.length > 1){
                var currentPage = pages[i].previousElementSibling.innerText;
                if (currentPage == "true"){
                    pages[i].style.color = "#217bc1";
                }
                $('#pages').removeClass('hidden');
            }else {
                $('#pages').addClass('hidden');
            }
            pages[i].onclick = function () {
                loading.removeClass('hidden');
                $.ajax({
                    type: "get",
                    url: "getContentByPage?content=" + from + "&page=" + this.innerText,
                    timeout: 20000,
                    success: function(rows) {
                        loading.addClass('hidden');
                        contentMedicines.html(rows);
                        if (from == 'comings'){
                            comingsContent();
                        }else if (from == 'sales'){
                            salesContent();
                        }else if (from == 'credits'){
                            creditContent();
                        }
                    },
                    error: function(jqXHR, textStatus, err) {
                        loading.addClass('hidden');
                        alert('text status '+textStatus+', err '+err)
                    }
                });
            }
        }
    }

    function salesContent(s) {
        delChangeIcons('settingsOfSales','#contentBody');
        filterRecords('sales');
        pages('sales');
        document.getElementById('filter').selectedIndex = s;

        var d = new Date(Date.now()), day = d.getDate(), month = d.getMonth() + 1, year = d.getFullYear();
        if (month < 10){month = '0' + month;}
        if (day < 10){day = '0' + day;}

        $('input[name="date"]').val(year + "-" + month + "-" + day);
        var creditDesc = $('textarea[name="creditDesc"]'), typeSale = $('input[name="typeSale"]');
        
        typeSale.change(function () {
            var cond = this.checked;
            if (cond){ creditDesc.removeClass("hidden");}
            else {creditDesc.addClass("hidden");}
        });

        var input = document.querySelectorAll('input[list]')[0], remainder = 0;
        input.onchange = function () {
            var datalist = this.list, quantity = $('input[name="quantity"]');
            for (var j = 0; j < datalist.options.length; j++) {
                if (this.value == datalist.options[j].value) {
                    remainder = datalist.options[j].nextSibling.innerText;
                    quantity.attr("placeholder", "Max: " + remainder);
                    break;
                }else{
                    quantity.attr("placeholder", "Max: ");
                }
            }
        };

        var totals = $('.summa');
        for (var i=0; i < totals.length; i++){
            
            var creditDescText = totals[i].previousElementSibling.innerText,
                payed = totals[i].nextElementSibling,
                credit = payed.nextElementSibling;
            
            if (creditDescText){
                if (credit.innerText == "true" && payed.innerText == "false"){
                    totals[i].style.color = '#ff0000';
                }else if(credit.innerText == "true" && payed.innerText == "true") {
                    totals[i].style.color = '#05910e';
                }
            }
        }

        $('#addNewSale').click(function (e) {
            var query = "",
                cond = true;
            if (typeSale[0].checked){
                if (!creditDesc.val() || creditDesc.val() == "" || creditDesc.val().length < 10){
                    cond = false;
                    creditDesc.get(0).setCustomValidity('Значение должен быть как минимум 10 символов');
                }else{
                    cond = true;
                    query += "creditDesc=" + creditDesc.val();
                }
            }

            if (cond){
                var data = isValidComingForm(e, "sales");
                if (data){
                    query += "&id=" + data.id + "&date=" + Date.now() + "&quantity=" + data.quantity;
                    loading.removeClass('hidden');
                    $.ajax({
                        type: "post",
                        url: "addSale?" + query,
                        timeout: 20000,
                        success: function(rows) {
                            loading.addClass('hidden');
                            $('#contentBody').html(rows);
                            salesContent();
                        },
                        error: function(jqXHR, textStatus, err) {
                            loading.addClass('hidden');
                            alert('text status '+textStatus+', err '+err)
                        }
                    });
                }
            }
        });
    }

    function creditContent(s) {
        filterRecords('credits');
        document.getElementById('filter').selectedIndex = s;
        pages('credits');

        var payed = $('.payed');
        for (var i=0; i < payed.length; i++){
            (function(){
                var credit = payed[i].previousElementSibling, cond;

                if (credit.innerText == "true"){
                    payed[i].checked = true;
                    credit.parentElement.style.color = "#05910e";
                }

                cond = payed[i].checked;

                payed[i].onchange = function () {
                    var save = this.parentElement.nextElementSibling;
                    if (this.checked != cond){
                        save.setAttribute("src","images/save_hover.png");
                    }else {
                        save.setAttribute("src","images/save.png");
                    }
                }
            })();
        }

        var saveButtons = $('.save');
        for (i=0; i < saveButtons.length; i++) {
            saveButtons[i].onclick = function () {
                if (this.getAttribute("src") == "images/save_hover.png"){
                    var id = this.nextElementSibling.innerText,
                        payed = this.previousElementSibling.children[1].checked;

                    loading.removeClass('hidden');
                    $.ajax({
                        type: "put",
                        url: "update?from=credits&id=" + id + "&payed=" + payed,
                        timeout: 20000,
                        success: function(rows) {
                            $('#contentBody').html(rows);
                            loading.addClass('hidden');
                            creditContent();
                        },
                        error: function(jqXHR, textStatus, err) {
                            loading.addClass('hidden');
                            alert('text status '+textStatus+', err '+err)
                        }
                    });
                }
            }
        }
    }

    function isValidDate(date){

        var dat = new Date(date),
            day = dat.getDate(),
            month = dat.getMonth() + 1,
            year = dat.getFullYear();

        if (month < 10){month = '0' + month;}
        if (day < 10){day = '0' + day;}

        var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(day + '-' + month + '-' + year);
        if (matches == null) return false;
        var d = matches[1];
        var m = matches[2] - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y;
    }

    function addNewMedicine() {

        middleForm("#medicineForm");
        exitModalForm('#curtainForm','exitForm');

        var img = $('input[name="imgMedicine"]');
        img.change(function () {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#photoMedicine').attr('src', e.target.result)
            };

            reader.readAsDataURL(this.files[0]);
        });

        var msg = $('#messageField');

        document.getElementById('addNewMedicine').onclick = function (e) {
            e.preventDefault();
            var name = $('textarea[name="medicineName"]').val(),
                price = $('input[name="price"]').val();

            loading.removeClass('hidden');
            $.ajax({
                type: "post",
                url: "addMedicine?name=" + name + "&price=" + price,
                timeout: 20000,
                data: {image: $('#photoMedicine').attr('src')},
                success: function(rows) {
                    loading.addClass('hidden');
                    msg.removeClass('hidden').hide().html(rows.message).show(600);
                    $("#medicineForm")[0].reset();
                    $('#photoMedicine').attr('src', '');
                },
                error: function(jqXHR, textStatus, err) {
                    loading.addClass('hidden');
                    alert('text status '+textStatus+', err '+err)
                }
            });
        };
    }

    function hoverChangeButton (e){
        e.onmouseover = function (){this.setAttribute("src","images/change_hover.png");};
        e.onmouseout = function (){this.setAttribute("src","images/change.png");};
    }

    function hoverDeleteButton (e){
        e.onmouseover = function (){this.setAttribute("src","images/delete_hover.png");};
        e.onmouseout = function (){this.setAttribute("src","images/delete.png");};
    }

    function delChangeIcons(classSettings, table){
        var settings = document.getElementsByClassName(classSettings);

        for (var i=0; i < settings.length; i++){

            var changeButton = document.createElement("img");
            changeButton.src = "images/change.png";
            changeButton.title = "Изменить";
            changeButton.className = "change";
            hoverChangeButton(changeButton);

            settings[i].appendChild(changeButton);

            changeButton.onclick = function () {
                if (classSettings == 'settingsOfMedicine') {getForUpdateRecord('medicine', table, this);}
                if (classSettings == 'settingsOfComings') {getForUpdateRecord('comings', table, this);}
                if (classSettings == 'settingsOfSales') {getForUpdateRecord('sales', table, this);}
            };

            var deleteButton = document.createElement("img");
            deleteButton.src = "images/delete.png";
            deleteButton.title = "Удалить";
            deleteButton.className = "delete";
            hoverDeleteButton(deleteButton);

            settings[i].appendChild(deleteButton);

            deleteButton.onclick = function(){
                if (classSettings == 'settingsOfMedicine') {removeRecord('medicine', table, this);}
                if (classSettings == 'settingsOfComings') {removeRecord('comings', table, this);}
                if (classSettings == 'settingsOfSales') {removeRecord('sales', table, this);}
            };

        }

        // var imgSettings = document.getElementById('img-settings');
        // imgSettings.onmouseover = function (){this.setAttribute("src","images/settings_hover.png");};
        // imgSettings.onmouseout = function (){this.setAttribute("src","images/settings.png");};

    }

    function removeRecord ( from, table, e){

        var div = $(table), query = '';

        // if (from == 'medicine'){
            var ID = e.previousElementSibling.previousElementSibling.innerHTML;
            query = from + "&id=" + ID;

            var answer = confirm('Действительно ли вы хотите удалить текущего записа?');
            if(answer){deleteRec();}
        // }

        function deleteRec() {
            loading.removeClass('hidden');
            $.ajax({
                type: "delete",
                url: "delete?from=" + query ,
                timeout: 2000,
                success: function(rows) {
                    div.html(rows);
                    // alert(rows);
                    loading.addClass('hidden');
                    if (from == 'medicine'){
                        medicineContent();
                    }else if (from == 'comings'){
                        comingsContent();
                    }else if (from == 'sales'){
                        salesContent();
                    }
                },
                error: function(jqXHR, textStatus, err) {
                    loading.addClass('hidden');
                    alert('text status '+ textStatus + ', err ' + err)
                }
            });
        }
    }

    function getForUpdateRecord(from, table, e) {

        var ID = e.previousElementSibling.innerHTML;
        if (from == 'medicine'){
            loading.removeClass('hidden');
            $.ajax({
                type: "get",
                url: "getForUpdate?from="+ from + "&id=" + ID ,
                timeout: 20000,
                success: function(rows) {
                    loading.addClass('hidden');
                    divForModalForms.html(rows).show(600);
                    updateRecord({id: ID}, table, '#updateMedicine');
                },
                error: function(jqXHR, textStatus, err) {
                    loading.addClass('hidden');
                    alert('text status '+textStatus+', err '+err)
                }
            },divForModalForms.hide());
        }else if (from == 'comings'){
            updateRecord({id: ID, e: e}, table, '#updateComing');
        }else if (from == 'sales'){
            updateRecord({id: ID, e: e}, table, '#updateSale');
        }
    }

    function updateRecord(data, table, updateBtn) {

        var query = "",
            dat = {};
        if (updateBtn == '#updateMedicine'){
            middleForm("#medicineForm");
            exitModalForm('#curtainForm','exitForm');
            $('#addNewMedicine').addClass('hidden');

            var img = $('input[name="imgMedicine"]');
            img.change(function () {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#photoMedicine').attr('src', e.target.result);
                    dat = {image: e.target.result};
                };

                query += "&photo=new";
                reader.readAsDataURL(this.files[0]);
            });
        }

        if (updateBtn == '#updateComing' || updateBtn == '#updateSale'){

            var tr = data.e.parentElement.parentElement,
                upDate = tr.children[1].innerText,
                upName = tr.children[2].innerText,
                upQuantity = tr.children[3].innerText;

            if (updateBtn == '#updateComing'){
                $('#addNewComing').addClass('hidden');
            }else {
                $('#addNewSale').addClass('hidden');
                var creditDescText = tr.children[4].firstElementChild.innerText,
                    credit = tr.children[4].children[2].innerText,
                    payed = tr.children[4].children[3].innerText;

                var txt = $('textarea[name="creditDesc"]'),
                    typeSale = $('input[name="typeSale"]');

                if (creditDescText){
                    if (payed =="true"){
                        txt.val(creditDescText).removeClass('hidden');
                        typeSale.attr("checked","checked");
                    }else{
                        txt.val(creditDescText);
                    }
                }else {
                    typeSale.removeAttr("checked");
                    txt.addClass('hidden');
                }
            }

            var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})[\s](\d{2})[:](\d{2})$/.exec(upDate);
            if (matches == null) return false;
            var d = matches[1], m = matches[2], y = matches[3];

            $('input[name="date"]').val(y + "-" + m + "-" + d);
            $('input[name="medicines"]').val(upName);
            $('input[name="quantity"]').val(upQuantity);
        }

        var  div = $(table), update = $(updateBtn);
        update.removeClass('hidden').click(function (e) {

            if (updateBtn == '#updateMedicine') {
                e.preventDefault();
                var name = $('textarea[name="medicineName"]').val(),
                    price = $('input[name="price"]').val();

                query += "&from=medicine&name=" + name + "&price=" + price;
                sendQuery();
            }

            if (updateBtn == '#updateSale' || updateBtn == '#updateComing') {
                var creditDesc = $('textarea[name="creditDesc"]'), typeSale = $('input[name="typeSale"]');
                var cond = true;

                if (updateBtn == '#updateSale'){
                    query += "&from=sales";
                    if (typeSale[0].checked){
                        if (!creditDesc.val() || creditDesc.val() == "" || creditDesc.val().length < 10){
                            cond = false;
                            creditDesc.get(0).setCustomValidity('Значение должен быть как минимум 10 символов');
                        }else{
                            cond = true;
                            query += "&credit=" + credit + "&creditDesc=" + creditDesc.val();
                        }
                    }
                }else {
                    query += "&from=comings";
                }

                if (cond){
                    if (updateBtn == '#updateSale'){
                        var data2 = isValidComingForm(e, "sales");
                    }else {
                        data2 = isValidComingForm(e);
                    }

                    if (data2){
                        query += "&IdMedicine=" + data2.id + "&date=" + data2.date + "&quantity=" + data2.quantity;
                        sendQuery();
                    }
                }
            }

            function sendQuery() {
                loading.removeClass('hidden');
                $.ajax({
                    type: "put",
                    url: "update?id=" + data.id + query,
                    data: dat,
                    timeout: 20000,
                    success: function(rows) {
                        divForModalForms.hide(250);
                        div.html(rows);
                        loading.addClass('hidden');
                        if (updateBtn == '#updateMedicine'){ medicineContent();}
                        if (updateBtn == '#updateComing') { comingsContent(); }
                        if (updateBtn == '#updateSale') { salesContent(); }
                    },
                    error: function(jqXHR, textStatus, err) {
                        loading.addClass('hidden');
                        alert('text status '+textStatus+', err '+err)
                    }
                });
            }
        });
    }
});

