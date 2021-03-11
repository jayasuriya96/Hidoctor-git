


function fnOpenHiDoctorGenie() {
    var content = '';
    content = "<div class='close' onclick='$(&#34;#divGeniemain&#34;).overlay().close()'></div>";
    content += "<img id='imgGene' src='Content/images/HiDOCTOR_Genie_95x175.png' />";
    content += "<div id='divGenieTitle' class='detailsGenie'>";
    content += "Hi <b> " + $("#spnUser").html().split(',')[0] + "</b> , I am <b>Genie</b>, your HiDOCTOR Assistant, please use the place to search Doctor360, Day analysis report and menu navigation.";
    content += "</div>";

    content += "<div id='divGenieSearch'>";
    content += "<input type='text' class='autoDoctor' id='txtGenieSearch' onkeyup='fnGeneSearch(this);'  placeholder=' Please type to search doctor 360 | Day analysis report | Menu navigation' />";
    content += "<input type='hidden' id='hdnGenieSearch'/>";
    content += "<a onclick='fnShowGenieHelp();' style='cursor: pointer;'>Help Me</a>";
    content += "</div>";

    content += "<div id='divGenieNote'><b>";
    content += "Search Keys: ^ Territory, ~ Doctor, * Menu ";
    content += "</b><a onclick='showHelp()' style='font-size: 11px;'>Learn More about Search Keys</a>";

    content += "</div>";

    content += "<div id='divGenieResult' style='padding: 10px;'>";
    content += "</div>";

    content += "<div style='clear:both;'></div>";

    $("#divGeniemain").html(content);
    $("#divGeniemain").overlay().load();
    //$('#divGeniemain').css('height', '180px');
}

function showHelp() {
    //  $('#dvHelp').css('display', '');
    $('#divhelpImg').css('top', '10%');
    $('#divhelpImg').overlay().load();

}

function fnGeneSearch(id) {

    //$('#divGeniemain').css('height', '180px');
    $('#divGenieResult').html("");
    $("#divGenieNote").show();

    if ($(id).val().length == 1 && $(id).val() == "~") {
        // Doctor
        $(id).unautocomplete();
        $(id).keyup(function () { fnGeneSearch(this); });
        fnGetDoctos();
    }
    else if ($(id).val().length == 1 && $(id).val() == '^') {
        // Region
        $(id).unautocomplete();
        $(id).keyup(function () { fnGeneSearch(this); });
        fnGetTerritory();
    }
    else if ($(id).val().length > 2 && $(id).val().slice(0, 1) == '^' && $(id).val().slice(-1) == '!') {
        // Date
        $(id).unautocomplete();
        $(id).keyup(function () { fnGeneSearch(this); });
        fnGetPastTenDates();
    }
    else if ($(id).val().length == 1 && $(id).val() == "*") {
        $(id).unautocomplete();
        $(id).keyup(function () { fnGeneSearch(this); });
    }
    if ($(id).val().length == 0 || $(id).val() == "") {
        $(id).unautocomplete();
        $(id).keyup(function () { fnGeneSearch(this); });
    }
}

var doctor_g = "";
function fnGetDoctos() {
    if (doctor_g == "") {
        $.ajax({
            url: '/Home/GetSelectedDoctors/',
            type: "POST",
            data: "A",
            success: function (jsData) {
                if (jsData != '') {
                    jsData = eval('(' + jsData + ')');
                    if (jsData.Tables[0].Rows.length > 0) {
                        var doctor = "[";
                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                            doctor += "{label:" + '"' + "" + jsData.Tables[0].Rows[i].Customer_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[0].Rows[i].Customer_Code + "" + '"' + "}";
                            if (i < jsData.Tables[0].Rows.length - 1) {
                                doctor += ",";
                            }
                        }
                        doctor += "];";
                        doctor_g = eval(doctor);
                        autoComplete(doctor_g, "txtGenieSearch", "hdnGenieSearch", "autoDoctor");
                    }
                }
            },
            error: function () {
                $("#dvAjaxLoad").hide();
            }
        });
    }
    else {
        autoComplete(doctor_g, "txtGenieSearch", "hdnGenieSearch", "autoDoctor");
    }
}


function fnOpenDoctor() {
    var disJson = jsonPath(doctor_g, "$.[?(@.label=='" + $.trim($("#txtGenieSearch").val().slice(1)) + "')]");
    if (disJson != false) {
        $("#hdnHomeDocCode").val(disJson[0].value);
    }
    else {
        $("#hdnHomeDocCode").val('')
    }
    if ($("#hdnHomeDocCode").val() != '') {
        $.ajax({
            url: '/Home/GetRegionAndUserInfo/',
            type: "POST",
            data: "A",
            success: function (jsInfo) {
                //$.modal({ ajax: '../HiDoctor_Reports/Reports/Doctor360/' + jsInfo.split("_")[1] + "_" + $("#hdnHomeDocCode").val() + "_" + jsInfo.split("_")[0], title: 'Doctor Info', overlayClose: false });
                $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + $("#hdnHomeDocCode").val(), title: 'Doctor Info', overlayClose: false });
                return;
            },
            error: function () {
                $("#dvAjaxLoad").hide();
            }
        });
    }
}


var childTerritory = "";
function fnGetTerritory() {
    if (childTerritory == "") {
        $.ajax({
            url: '/Home/GetChildRegions/',
            type: "POST",
            data: "A",
            success: function (jsData) {
                if (jsData != '') {
                    jsData = eval('(' + jsData + ')');
                    if (jsData.Tables[0].Rows.length > 0) {
                        var childRegion = "[";
                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                            childRegion += "{label:" + '"' + "" + jsData.Tables[0].Rows[i].Region_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[0].Rows[i].Region_Code + "" + '"' + "}";
                            if (i < jsData.Tables[0].Rows.length - 1) {
                                childRegion += ",";
                            }
                        }
                        childRegion += "];";
                        childTerritory = eval(childRegion);
                        autoComplete(childTerritory, "txtGenieSearch", "hdnGenieSearch", "autoDoctor");
                    }
                }
            },
            error: function () {
                $("#dvAjaxLoad").hide();
            }
        });
    }
    else {
        autoComplete(childTerritory, "txtGenieSearch", "hdnGenieSearch", "autoDoctor");
    }
}

var pastTen = '';
function fnGetPastTenDates() {
    if (pastTen == "") {
        var temp = $("#spnUser").html().split(',')[1];
        var todayDate = new Date(temp.split('.')[2] + '/' + temp.split('.')[1] + '/' + temp.split('.')[0]);
        var tempDate = "";
        //tempDate.setDate(tempDate.getDate() + 1
        for (var m = 1; m <= 10; m++) {
        }

        var dateString = "[";
        for (var m = 1; m <= 10; m++) {
            tempDate = todayDate.getDate() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getFullYear();
            dateString += "{label:" + '"' + "" + tempDate + "" + '",' + "value:" + '"' + "" + tempDate + "" + '"' + "}";
            if (m < 10) {
                dateString += ",";
            }
            todayDate.setDate(todayDate.getDate() - 1);
        }
        dateString += "];";
        pastTen = eval(dateString);
        autoComplete(pastTen, "txtGenieSearch", "hdnGenieSearch", "autoDoctor");
    }
    else {
        autoComplete(pastTen, "txtGenieSearch", "hdnGenieSearch", "autoDoctor");
    }
}

function fnShowGenieHelp() {

    if ($("#txtGenieSearch").val().slice(0, 1) == '~') {
        fnOpenDoctor();
    }
    if ($("#txtGenieSearch").val().slice(0, 1) == '^' && $("#txtGenieSearch").val().split('!').length > 1) {
        var toDatevalid = $("#txtGenieSearch").val().split('!')[1];
        var FromDateArrvalid = toDatevalid.split('-');

        var dt1valid = new Date(FromDateArrvalid[2] + "/" + FromDateArrvalid[1] + "/" + FromDateArrvalid[0]);
        if (dt1valid == "Invalid Date") {
            fnMsgAlert('info', 'Report', 'Please select valid Date.');
            return false;
        }
        else {
            fnGenieDayAnalysisReport();
        }
    }

    if ($("#txtGenieSearch").val().slice(0, 1) == '*') {
        fnGenieMenuHelp($("#txtGenieSearch").val().split('*')[1]);
    }
}


function fnGenieDayAnalysisReport() {
    $("#dvAjaxLoad").show();

    var disJson = jsonPath(childTerritory, "$.[?(@.label=='" + $.trim(($("#txtGenieSearch").val().slice(1)).split('!')[0]) + "')]");
    if (disJson != false) {

        var regionCode = disJson[0].value;
        var toDate = $("#txtGenieSearch").val().split('!')[1];

        var FromDateArr = toDate.split('-');
        var ToDateArr = ($("#spnUser").html().split(',')[1]).split('.');
        var dt1 = new Date(FromDateArr[2] + "/" + FromDateArr[1] + "/" + FromDateArr[0]);
        var dt2 = new Date(ToDateArr[2] + "/" + ToDateArr[1] + "/" + ToDateArr[0]);

        var noOfDays = dt2 - dt1;
        noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);
        var tableContent = "";

        var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDayAnalysisReport',
            data: 'regionCode=' + regionCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0],
            success: function (response) {
                jsData = eval('(' + response + ')');
                var tableContent = "";
                var day = 0;
                var month = 0;
                var total = 0, leave = 0, attendance = 0, field = 0;
                var sunday = 0, holiday = 0, tempDays = 0;
                var nonFieldDays = 0.0;
                var divisionName = "";
                var fieldStatus = "";
                if (jsData.Tables[1].Rows.length > 0) {
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblGenieDayAnalysisReport' >";
                    tableContent += "<thead><tr style='display: none;' id='tblTr'>";
                    tableContent += "<th align='left' width='15%'>User Name</th>";
                    tableContent += "<th align='left' width='15%'>User Type Name</th>";
                    tableContent += "<th align='left' width='15%'>Territory Name</th>";
                    tableContent += "<th align='left' width='15%'>Employee Name</th>";
                    tableContent += "<th align='left' width='15%'>Division Name</th>";
                    tableContent += "<th align='left' width='15%'>Reporting manager</th>";
                    tableContent += "<th align='left' width='15%'>Reporting HQ</th>";
                    tableContent += "<th align='left' width='15%'>Total No of Days</th>";
                    tableContent += "<th align='left' width='15%'>No Reporting</th>";
                    tableContent += "<th align='left' width='15%'>Not Available  Days</th>";
                    tableContent += "<th align='left' width='15%'>Leave</th>";
                    tableContent += "<th align='left' width='15%'>Holiday</th>";
                    tableContent += "<th align='left' width='15%'>Non FW Days</th>";
                    tableContent += "<th align='left' width='15%'>No of Days in FW</th>";
                    tableContent += "<th align='left' width='15%'>% Days Worked</th>";
                    tableContent += "<th align='left' width='15%'>Last DCR Date</th>";
                    tableContent += "</tr>";
                    tableContent += "<tr  >";
                    tableContent += "<th align='left' width='15%'>User Name</th>";
                    tableContent += "<th align='left' width='15%'>User Type Name</th>";
                    tableContent += "<th align='left' width='15%'>Territory Name</th>";
                    tableContent += "<th align='left' width='15%'>Employee Name</th>";
                    tableContent += "<th align='left' width='15%'>Division Name</th>";
                    tableContent += "<th align='left' width='15%'>Reporting manager</th>";
                    tableContent += "<th align='left' width='15%'>Reporting HQ</th>";

                    tableContent += "<th align='left' width='15%'>Total No of Days</th>";
                    tableContent += "<th align='left' width='15%'>No Reporting</th>";
                    tableContent += "<th align='left' width='15%'>Not Available  Days</th>";
                    tableContent += "<th align='left' width='15%'>Leave</th>";
                    tableContent += "<th align='left' width='15%'>Holiday</th>";
                    tableContent += "<th align='left' width='15%'>Non FW Days</th>";
                    tableContent += "<th align='left' width='15%'>No of Days in FW</th>";
                    tableContent += "<th align='left' width='15%'>% Days Worked</th>";
                    tableContent += "<th align='left' width='15%'>Last DCR Date</th>";

                    tableContent += "</tr>";
                    //tableContent += "<tr >";
                    //tableContent += "<th colspan= '16' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                    //tableContent += "</tr>";
                    var type = '[{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "text" }';
                    type += ', { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }';
                    type += ', { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "date-range" }]';
                    tableContent += "</thead>";
                    tableContent += "<tbody>";
                    for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                        tableContent += "<tr>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].User_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].User_Type_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].Region_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].Employee_Name + "</td>";
                        if (jsData.Tables[2].Rows.length > 0) {
                            var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");
                            divisionName = "";
                            if (dJsonData != false) {
                                for (var j = 0; j < dJsonData.length; j++) {
                                    divisionName += dJsonData[j].Division_Name + ",";
                                }
                                if (divisionName != "") {
                                    divisionName = divisionName.substring(0, divisionName.length - 1);
                                }
                                tableContent += "<td align='left' width='15%'>" + divisionName + "</td>";
                            }
                            else {
                                tableContent += "<td align='left' width='15%'></td>";
                            }
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].Manager_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].Manager_Region_Name + "</td>";
                        nonFieldDays = 0.0;
                        tempDays = 0, sunday = 0, holiday = 0;
                        attendance = 0, field = 0, leave = 0;
                        for (var j = 0; j <= noOfDays; j++) {
                            var temp = new Date(dt1.getFullYear(), dt1.getMonth(), dt1.getDate() + j);
                            if (temp.getDate() >= 10) {
                                day = temp.getDate();
                            }
                            else {
                                day = "0" + temp.getDate();
                            }
                            if ((temp.getMonth() + 1) >= 10) {
                                month = (temp.getMonth() + 1);
                            }
                            else {
                                month = "0" + (temp.getMonth() + 1);
                            }

                            var date = day + "/" + month + "/" + temp.getFullYear();
                            fieldStatus = "";
                            tempDays = 0;
                            var isHoliday = false;
                            var dJsonH = jsonPath(jsData, "$.Tables[5].Rows[?(@.DCR_Date=='" + date + "' & @.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");
                            if (dJsonH != false) {
                                tempDays++;
                                isHoliday = true;
                            }
                            if (weekday[temp.getDay()] == "Sunday") {
                                tempDays++;
                                isHoliday = true;
                            }
                            var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.DCR_Actual_Date=='" + date + "' & @.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");
                            if (dJson != false) {
                                if (!isHoliday) {
                                    if (dJson.length > 0) {
                                        if (dJson.length == 1) {
                                            if (dJson[0].DCR_Status != "2") {
                                                nonFieldDays = nonFieldDays + 1;
                                            }
                                        }
                                        else {
                                            for (var k = 0; k < dJson.length; k++) {
                                                if (dJson[k].DCR_Status != "2") {
                                                    nonFieldDays = nonFieldDays + 0.5;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        nonFieldDays = nonFieldDays + 1;
                                    }
                                }
                                else {
                                    if (dJson.length > 0) {
                                        if (dJson.length == 1) {
                                            if (dJson[0].DCR_Status != "2") {
                                                nonFieldDays = nonFieldDays + 1;
                                            }
                                        }
                                        else {
                                            for (var k = 0; k < dJson.length; k++) {
                                                if (dJson[k].DCR_Status != "2") {
                                                    nonFieldDays = nonFieldDays + 0.5;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                if (!isHoliday) {
                                    nonFieldDays = nonFieldDays + 1;
                                }
                            }
                        }

                        var dJsonD = jsonPath(jsData, "$.Tables[6].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");
                        if (dJsonD != false) {
                            holiday = dJsonD[0].Holiday;
                            sunday = dJsonD[0].Sunday;
                            leave = dJsonD[0].Leave;
                            attendance = dJsonD[0].Attendance;
                            field = dJsonD[0].Field;
                        }
                        //total no days                    
                        tableContent += "<td align='center' width='15%'>" + (noOfDays + 1) + "</td>";
                        //No Reporting
                        if (nonFieldDays > 0) {
                            tableContent += "<td align='center' width='8%' >" + nonFieldDays + "</td>";
                        }
                        else {
                            tableContent += "<td align='center' width='15%'>0</td>";
                        }
                        //Not Available  Days
                        if (sunday > 0) {
                            tableContent += "<td align='center' width='8%' >" + sunday + "</td>";
                        }
                        else {
                            tableContent += "<td align='center' width='15%'>0</td>";
                        }
                        //Leave
                        if (leave > 0) {
                            tableContent += "<td align='center' width='8%' >" + leave + "</td>";
                        }
                        else {
                            tableContent += "<td align='center' width='15%'>0</td>";
                        }
                        //Holiday
                        if (holiday > 0) {
                            tableContent += "<td align='center' width='8%' >" + holiday + "</td>";
                        } else {
                            tableContent += "<td align='center' width='15%'>0</td>";
                        }
                        //Non FW Days
                        if (attendance > 0) {
                            tableContent += "<td align='center' width='8%' >" + attendance + "</td>";
                        }
                        else {
                            tableContent += "<td align='center' width='15%'>0</td>";
                        }
                        //No of Days in FW
                        if (field > 0) {
                            tableContent += "<td align='center' width='8%' >" + field + "</td>";
                        }
                        else {
                            tableContent += "<td align='center' width='15%'>0</td>";
                        }
                        //% Days Worked
                        if (field > 0) {
                            var avg = parseFloat(field) / parseFloat((noOfDays + 1)) * 100;
                            tableContent += "<td align='center' width='15%' title='(Total No of Days Worked/Total No of Days in Selected Dated)*100'>" + Math.round(avg * 100) / 100 + "</td>";
                        }
                        else {
                            tableContent += "<td align='center' width='15%'>0</td>";
                        }
                        //Last DCR Date
                        var dJson = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");
                        if (dJson != false) {
                            if (dJson[0].Last_Entered != null && dJson[0].Last_Entered != "") {
                                tableContent += "<td align='center' width='15%'>" + dJson[0].Last_Entered.split('.')[2] + "/" + dJson[0].Last_Entered.split('.')[1] + "/" + dJson[0].Last_Entered.split('.')[0] + "</td>";
                            }
                            else {
                                tableContent += "<td align='center' width='15%'></td>";
                            }
                        }
                        else {
                            tableContent += "<td align='center' width='15%'></td>";
                        }


                        tableContent += "</tr>";
                    }
                    tableContent += "</tbody>";
                    tableContent += "</table>";
                    var jsonType = eval(type);
                    $("#divGenieReport").html('');
                    $("#divGenieReport").html(tableContent);
                    if ($.fn.dataTable) {
                        $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                        $.datepicker.setDefaults($.datepicker.regional['']);
                        $('#tblGenieDayAnalysisReport').dataTable({
                            "sPaginationType": "full_numbers", "bRetrieve": true,
                            "bProcessing": true,
                            "bDestroy": true
                        }).dataTable().columnFilter({
                            sPlaceHolder: "head:after",
                            aoColumns: jsonType
                        });
                    };

                    ShowModalPopup("divGenieReportMain");
                }
                $("#dvAjaxLoad").hide();
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                $("#dvAjaxLoad").hide();
            }
        });
    }
    else {
        $("#dvAjaxLoad").hide();
        fnMsgAlert('info', 'Report', 'Please select valid region.');
    }
}

function fnGenieMenuHelp(val) {
    $.ajax({
        url: '/Home/GetReportName/',
        type: "POST",
        data: 'SearchText=' + val,
        success: function (jsData) {
            if (jsData != '') {
                var content = "";
                jsData = eval('(' + jsData + ')');
                if (jsData.Tables[0].Rows.length > 0) {
                    if (jsData.Tables[0].Rows.length > 10) {
                        content += "<div style='font-size: 10px;color:#06c;'>Your search for '" + val + "' returned more than " + jsData.Tables[0].Rows.length + " number or results. We are showing Top 10 results.</div>";
                        content += "<div style='font-size: 10px;color:#06c;'> If you wish to narrow down, please type a more specific keyword.</div>";
                        for (var i = 0; i < 10; i++) {
                            content += "<div >" + jsData.Tables[0].Rows[i].MenuTest + "</div>";
                        }
                    }
                    else {
                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                            content += "<div >" + jsData.Tables[0].Rows[i].MenuTest + "</div>";

                        }
                    }
                }
                else {
                    content += "<div>Your search returned '0' result. Please try with a different keyword.</div>";
                }
                //$('#divGeniemain').css('height', '350px');
                $("#divGenieNote").hide();
                $("#divGenieResult").html(content);
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });

}

