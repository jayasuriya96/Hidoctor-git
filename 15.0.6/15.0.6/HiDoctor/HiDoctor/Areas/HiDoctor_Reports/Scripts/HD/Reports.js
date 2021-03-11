function fnCustomerMaster() {
    $('#regiontree').hide();
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');
    $("#spnTreeToggle").html('Show Tree');

    $("#divHideHeader").show();
    $('#divHideHeader1').hide();
    $('#divImport').hide();
    $("#divSummary").html("");
    $('#dvSubprint').hide();
    $('#dvExcelPrint').hide();
    var regionCode = $('#hdnRegionCode').val();
    var tablecontent = "", options = "";

    //GET OPTIONS
    if ($('#optViewInScreen').attr('checked') == "checked") {
        options = "S";
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        options = "E";
    }

    ShowModalPopup("dvloading");

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorMasterReport',
        data: 'regionCode=' + regionCode + '&options=' + options,
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $("#divReport").html(response.split('^')[0]);
                $("#divdocMasterprint").html(response.split('^')[0]);
                //* Added
                $('#divImport').show();
                tablecontent += "<lable style='font-weight:bold;'><span style='color:red;font-weight: bold;font-size: 20px;'>*</span>Values indicates that there are a some doctors without any category and hence the mismatch between the sum of individual categories and Total.</lable>";
                $('#divImport').html(tablecontent);
                $("#spnTreeToggle").show();
                $("#divReport").show();
                // $("#dvPrint").show();
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
                if (options == "E") {
                    $('#divHideHeader').hide();
                    $('#divImport').hide();
                    $('#dvPrint').hide();
                }

                $('#tblDoctorMaster').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                , "sDom": 'T<"clear">lfrtip'
                });

                fninializePrint("divdocMasterprint", "ifrmPrint", "divReport");
                HideModalPopup("dvloading");

            }
            else {
                fnMsgAlert('info', 'Report', 'No data found.');
                $("#spnTreeToggle").show();
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            $("#spnTreeToggle").show();
            HideModalPopup("dvloading");
        }
    });
}

function fnToggleTreea() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnDetails(val) {
    var regioncode = "", docCount = "", categoryName = "", categoryCode = ""
    regionCode = val.split('_')[0];
    docCount = val.split('_')[1];
    categoryName = val.split('_')[2];
    category = val.split('_')[3];
    $('#regionCode').val(regionCode);
    $('#category').val(category);
    $('#docCount').val(docCount);
    $('#categoryName').val(categoryName);
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorMasterDetails',
        data: 'regionCode=' + regionCode + '&category=' + category + '&docCount=' + docCount + '&categoryName=' + categoryName,
        success: function (response) {
            if (response != null && response != '') {
                $("#divSummary").html(response);
                $("#dvExcelPrint").show();
                $('#divdocdetalsprint').html(response);
                // $('#tblDoctorPopUp').tablePagination({});
                $('#dvSubprint').show();


                $('#tblDoctorPopUp').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                      , "sDom": 'T<"clear">lfrtip'
                });



                fninializePrint("divdocdetalsprint", "ifrmsubPrint", "divSummary");
            }

            if (response != "") {
                $("#divHideHeader").show();
                $('#divHideHeader1').show();

                $("#divReport").fadeOut('slow');
                $("#dvPrint").fadeOut('slow');
                //$("#spnReport").removeClass('collapse');
                //$("#spnReport").addClass('expand');


                $('#divmainSummary').fadeIn('slow');
                $('#dvSubprint').fadeIn('slow');
                //$("#spnHeader").removeClass('expand');
                //$("#spnHeader").addClass('collapse');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}




$('#CA_Excel').bind('click', function () {
    $('#dvExcelPrint').hide();
    var regionCode = $('#regionCode').val();
    var category = $('#category').val();
    var docCount = $('#docCount').val();
    var categoryName = $('#categoryName').val();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/DownloadDoctorMasterReportExcel',
        data: 'regionCode=' + regionCode + '&category=' + category + '&docCount=' + docCount + '&categoryName=' + categoryName,
        success: function (response) {
            if (response != '') {
                $('#dvExcelPrint').show();
                $('#dvExceldwn').show();
                $('#dvExceldwn').html(response);
            }
        }
    });
});
//function fnDetails(val) {
//    
//    $.ajax({
//        type: 'POST',
//        url: '../HiDoctor_Reports/Reports/GetDoctorMasterDetails',
//        data: 'regionCode=' + val.split('_')[0] + '&category=' + val.split('_')[1],
//        success: function (response) {
//            jsData = eval('(' + response + ')');
//            var tableContent = "";
//            $("#divModel").html('');

//            if (jsData.Tables[1].Rows.length > 0) {
//                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserPopUp' class='data display datatable' >";
//                tableContent += "<thead><tr>";
//                tableContent += "<th colspan='4'>User Details</th>";
//                tableContent += "</tr></thead>";
//                tableContent += "<tbody>";
//                tableContent += "<tr>";
//                tableContent += "<td align='left' width='15%'>User Name</td>";
//                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[0].User_Name + "</td>";
//                tableContent += "<td align='left' width='15%'>Division Name</td>";
//                var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[0].Region_Code + "')]");
//                divisionName = "";
//                if (dJsonData != false) {
//                    for (var j = 0; j < dJsonData.length; j++) {
//                        divisionName += dJsonData[j].Division_Name + ",";
//                    }

//                    if (divisionName != "") {
//                        divisionName = divisionName.substring(0, divisionName.length - 1);
//                    }
//                    tableContent += "<td align='left' width='15%'>" + divisionName + "</td>";
//                }
//                else {
//                    tableContent += "<td align='left' width='15%'></td>";
//                }
//                tableContent += "<tr>";
//                tableContent += "<td align='left' width='15%'>Employee Name</td>";
//                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[0].Employee_Name + "</td>";
//                tableContent += "<td align='left' width='15%'>Manager Name</td>";
//                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[0].Manager_Name + "</td></tr>";
//                tableContent += "<tr>";
//                tableContent += "<td align='left' width='15%'>Region Name</td>";
//                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[0].Region_Name + "</td>";
//                tableContent += "<td align='left' width='15%'>Manager Territory name</td>";
//                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[0].Manager_Region_Name + "</td></tr>";
//                tableContent += "</tbody>";
//                tableContent += "</table>";
//                $("#divHeader").html(tableContent);
//            }
//            tableContent = "";
//            if (jsData.Tables[0].Rows.length > 0) {
//                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorPopUp' class='data display datatable' >";
//                tableContent += "<thead><tr style='display: none;' id='tblTrtbl'>";
//                tableContent += "<th style='display:none'>Region Name</th>";
//                tableContent += "<th style='display:none'>User Name</th>";
//                tableContent += "<th style='display:none'>Employee Name</th>";
//                tableContent += "<th style='display:none'>Reporting To</th>";
//                for (var j = 0; j < jsData.Tables[3].Rows.length; j++) {
//                    tableContent += "<th>";
//                    tableContent += jsData.Tables[3].Rows[j].Field_Alias_Name;
//                    tableContent += "</th>";
//                }
//                tableContent += "</tr>";

//                tableContent += "<tr>";
//                tableContent += "<th style='display:none'>Region Name</th>";
//                tableContent += "<th style='display:none'>User Name</th>";
//                tableContent += "<th style='display:none'>Employee Name</th>";
//                tableContent += "<th style='display:none'>Reporting To</th>";
//                for (var j = 0; j < jsData.Tables[3].Rows.length; j++) {
//                    tableContent += "<th>";
//                    tableContent += jsData.Tables[3].Rows[j].Field_Alias_Name;
//                    tableContent += "</th>";
//                }

//                tableContent += "</tr>";
//                //var colspan = jsData.Tables[3].Rows.length + 4;
//                //tableContent += "<th colspan= '" + colspan+ "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggle()'>Show Filter</span></th>";
//                tableContent += " </thead>";
//                tableContent += "<tbody>";


//                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
//                    for (var k = 0 ; k < jsData.Tables[3].Rows.length ; k++) {
//                        var mdlNo = 0;
//                        tableContent += "<tr>";


//                        if (jsData.Tables[0].Rows[i].MDL_Number != "") {
//                            if (jsData.Tables[0].Rows[i].MDL_Number.match(/^\d+$/)) {
//                                mdlNo = parseInt(jsData.Tables[0].Rows[i].MDL_Number);
//                            }
//                            else {
//                                mdlNo = jsData.Tables[0].Rows[i].MDL_Number;
//                            }

//                        }
//                    }

//                }


//                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
//                    var mdlNo = 0;
//                    tableContent += "<tr>";
//                    if (jsData.Tables[0].Rows[i].MDL_Number != "") {
//                        if (jsData.Tables[0].Rows[i].MDL_Number.match(/^\d+$/)) {
//                            mdlNo = parseInt(jsData.Tables[0].Rows[i].MDL_Number);
//                        }
//                        else {
//                            mdlNo = jsData.Tables[0].Rows[i].MDL_Number;
//                        }

//                    }
//                    tableContent += "<td style='display:none'>" + jsData.Tables[1].Rows[0].Region_Name + "  </td>";
//                    tableContent += "<td style='display:none'>" + jsData.Tables[1].Rows[0].User_Name + " </td>";
//                    tableContent += "<td style='display:none'> " + jsData.Tables[1].Rows[0].Employee_Name + "</td>";
//                    tableContent += "<td style='display:none'> " + jsData.Tables[1].Rows[0].Manager_Name + "  </td>";
//                    tableContent += "<td align='center'>" + mdlNo + "</td>";
//                    tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[0].Rows[i].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Customer_Name + "</span></td>";
//                    tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Speciality_Name + "</td>";
//                    tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Category_Name + "</td>";

//                    if (jsData.Tables[0].Rows[i].DOB != "01/01/1900" && jsData.Tables[0].Rows[i].DOB != "") {
//                        tableContent += "<td align='center'>" + jsData.Tables[0].Rows[i].DOB + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='center'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Registration_No != null && jsData.Tables[0].Rows[i].Registration_No != "") {
//                        tableContent += "<td align='center'>" + jsData.Tables[0].Rows[i].Registration_No + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='center'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Hospital_Name != null && jsData.Tables[0].Rows[i].Hospital_Name != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Hospital_Name + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }
//                    if (jsData.Tables[0].Rows[i].Hospital_Classification != null && jsData.Tables[0].Rows[i].Hospital_Classification != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Hospital_Classification + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }
//                    if (jsData.Tables[0].Rows[i].Qualification != null && jsData.Tables[0].Rows[i].Qualification != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Qualification + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Anniversary_Date != "01/01/1900" && jsData.Tables[0].Rows[i].Anniversary_Date != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Anniversary_Date + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Local_Area != null && jsData.Tables[0].Rows[i].Local_Area != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Local_Area + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Phone != null && jsData.Tables[0].Rows[i].Phone != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Phone + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }


//                    if (jsData.Tables[0].Rows[i].Mobile != null && jsData.Tables[0].Rows[i].Mobile != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Mobile + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Fax != null && jsData.Tables[0].Rows[i].Fax != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Fax + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Email != null && jsData.Tables[0].Rows[i].Email != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Email + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Address1 != null && jsData.Tables[0].Rows[i].Address1 != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Address1 + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Address2 != null && jsData.Tables[0].Rows[i].Address2 != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Address2 + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }

//                    if (jsData.Tables[0].Rows[i].Remarks != null && jsData.Tables[0].Rows[i].Remarks != "") {
//                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Remarks + "</td>";
//                    }
//                    else {
//                        tableContent += "<td align='left'></td>";
//                    }


//                    tableContent += "</tr>";

//                }
//                tableContent += "</tbody>";
//                tableContent += "</table>";
//                $("#divSummary").html(tableContent);
//                $("#divsubPrint").html(tableContent);
//                var jsonType = eval(type);
//                // if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
//                //if ($.fn.dataTable) {
//                //    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
//                //    $.datepicker.setDefaults($.datepicker.regional['']);
//                //    $('#tblDoctorPopUp').dataTable({
//                //        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
//                //    }).dataTable().columnFilter({
//                //        sPlaceHolder: "head:after",
//                //        aoColumns: jsonType
//                //    });
//                //};
//                fninializePrint("divsubPrint", "ifrmsubPrint", "divSummary");
//                if (tableContent != "") {
//                    $("#divHideHeader").show();
//                    $('#divHideHeader1').show();
//                    $("#divReport").fadeOut('slow');

//                    $("#spnReport").removeClass('collapse');
//                    $("#spnReport").addClass('expand');

//                    $('#divmainSummary').fadeIn('slow');
//                    $("#spnHeader").removeClass('expand');
//                    $("#spnHeader").addClass('collapse');
//                }
//            }

//        },
//        error: function () {
//            fnMsgAlert('info', 'Report', 'Error.');
//            HideModalPopup("dvloading");
//        }
//    });

//}

function fnToggle() {

    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrtbl").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrtbl").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
function monthDiff(fromDate, toDate) {
    var tempDate = new Date(fromDate);
    var endDate = new Date(toDate);

    var monthCount = 0;
    while ((tempDate.getMonth() + '' + tempDate.getFullYear()) != (endDate.getMonth() + '' + endDate.getFullYear())) {
        monthCount++;
        tempDate.setMonth(tempDate.getMonth() + 1);
    }
    return monthCount + 1;
}
function fnManPowerStatusReport() {
    ShowModalPopup("dvloading");
    var nodeVal = $('#hdnRegionCode').val();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetManPowerStatusReport',
        data: 'regionCode=' + nodeVal.split('_')[0],
        success: function (response) {
            $("#divReport").html(response);
            if ($.fn.dataTable) {
                $('#tblDoctorMaster').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            }
            if (response != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
            }
            else {
                $("#divReport").html("No data found");
                $("#dvTree").show();
                $("#divMain").css('width', '80%');
                $("#spnTreeToggle").html('Hide Tree');
            }

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
    HideModalPopup("dvloading");
}
function fnExpenseReportHeader() {
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetExpenseReportHeader',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divReport").html('');

            if (jsData.Tables[1].Rows.length > 0) {
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblUserType' >";
                tableContent += "<tr>";
                var i = 1;
                for (var j = 0; j < jsData.Tables[1].Rows.length; j++, i++) {
                    tableContent += "<td><input type='checkbox' name='chkUserType' id='chkUserType_" + (j + 1) + "' value='" + jsData.Tables[1].Rows[j].User_Type_Code + "' />" + jsData.Tables[1].Rows[j].User_Type_Name + "</td>"
                    if (i == 5 && j != (jsData.Tables[1].Rows.length - 1)) {
                        i = 0;
                        tableContent += "</tr><tr>";
                    }
                }
                if (jsData.Tables[1].Rows.length % 5 == 0) {
                    tableContent += "</tr>";
                }
                else {
                    for (var i = 1; i <= (5 - jsData.Tables[1].Rows.length % 5) ; i++) {
                        tableContent += "<td></td>";
                    }
                    tableContent += "</tr>";
                }

                tableContent += "</table>";
                $('#divUserType').html(tableContent);
            }
            tableContent = "";
            tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblClassification' >";
            if (jsData.Tables[0].Rows.length > 0) {
                for (var j = 0; j < jsData.Tables[0].Rows.length; j++, i++) {
                    tableContent += "<tr>";
                    tableContent += "<td><input type='checkbox' name='chkClassif'  value='" + jsData.Tables[0].Rows[j].Region_Classification_Code + "' id='chkClassifName_" + (j + 1) + "'/>" + jsData.Tables[0].Rows[j].Region_Classification_Name + "</td>"
                    tableContent += "</tr>";
                }
            }
            tableContent += "<tr><td><input type='checkbox' name='chkClassif' value='NoClassification'  id='chkClassifName_" + (jsData.Tables[0].Rows.length + 1) + "'/>No Classification</td></tr>";
            tableContent += "</table>";
            $('#divClassificationHeader').html(tableContent);
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnExpenseMasterReport() {

    ShowModalPopup("dvloading");
    var userTypeCode = "";
    var nodeVal = $('#hdnRegionCode').val();
    // USer Type Code
    var tblInput = $('input:checkbox[name=chkUserType]:checked');
    for (var intLoop = 0; intLoop < tblInput.length; intLoop++) {
        userTypeCode += "'" + tblInput[intLoop].value + "',";
    }


    if (userTypeCode != "") {
        userTypeCode = userTypeCode.substring(0, userTypeCode.length - 1);
    }
    else {
        fnMsgAlert('info', 'Expense Master Report', 'Select atleast one user type.');
        HideModalPopup("dvloading");
        return false;
    }
    // Get Region Classifiction Code
    var regionClassifiction = "";
    var tblInput = $('input:checkbox[name=chkClassif]:checked');
    for (var intLoop = 0; intLoop < tblInput.length; intLoop++) {
        regionClassifiction += "" + tblInput[intLoop].value + "^";
    }

    if (regionClassifiction != "") {
        regionClassifiction = regionClassifiction.substring(0, regionClassifiction.length - 1);
    }
    else {
        fnMsgAlert('info', 'Expense Master Report', 'Select atleast Region Classification.');
        HideModalPopup("dvloading");
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetExpenseMasterReport',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&userType=' + userTypeCode + '&rClassifi=' + regionClassifiction,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divReport").html('');
            var divisionName = "";
            var type = "";
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblExpenseReport' >";
                tableContent += "<thead><tr>";
                tableContent += "<th>Region Name</th>";
                tableContent += "<th>Region Classification</th>";
                tableContent += "<th>User Type Name</th>";
                tableContent += "<th>Division Name</th>";
                tableContent += "<th>Expense Type Name</th>";
                tableContent += "<th>Work category</th>";
                tableContent += "<th>Expense Mode</th>";
                tableContent += "<th>Eligibility Amount</th>";
                tableContent += "<th>Is Validation on eligibility</th>";
                tableContent += "<th>Is DCR Prefill</th>";
                tableContent += "<th>SFC Type</th>";
                type = '[{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }, { type: "text" }, { type: "number-range" }, { type: "text" },{ type: "text" },{ type: "text" }]';
                tableContent += "</tr>";
                tableContent += "<tr>";
                tableContent += "<th>Region Name</th>";
                tableContent += "<th>Region Classification</th>";
                tableContent += "<th>User Type Name</th>";
                tableContent += "<th>Division Name</th>";
                tableContent += "<th>Expense Type Name</th>";
                tableContent += "<th>Work category</th>";
                tableContent += "<th>Expense Mode</th>";
                tableContent += "<th>Eligibility Amount</th>";
                tableContent += "<th>Is Validation on eligibility</th>";
                tableContent += "<th>Is DCR Prefill</th>";
                tableContent += "<th>SFC Type</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    tableContent += "<tr>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Region_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Region_Classification_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].User_Type_Name + "</td>";
                    if (jsData.Tables[1].Rows.length > 0) {
                        var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        divisionName = "";
                        if (dJsonData != false) {
                            for (var j = 0; j < dJsonData.length; j++) {
                                divisionName += dJsonData[j].Division_Name + ",";
                            }

                            if (divisionName != "") {
                                divisionName = divisionName.substring(0, divisionName.length - 1);
                            }
                            tableContent += "<td align='left'>" + divisionName + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' ></td>";
                        }
                    }
                    else {
                        tableContent += "<td align='left' ></td>";
                    }
                    //   tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Division_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Expense_Type_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Expense_Entity + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Expense_Mode + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Eligibility_Amount + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Is_Validation_On_Eligibility + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].DCR_Prefill + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].SFC_Type + "</td>";
                    tableContent += "</tr>";
                }
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divReport").html(tableContent);
                $("#divPrint").html(tableContent);
                var jsonType = eval(type);
                if ($.fn.dataTable) {
                    var oTable = $('#tblExpenseReport').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnSecondarySalesComplainceReport() {

    var nodeVal = $('#hdnRegionCode').val();

    var fromDate = "";
    var toDate = "";

    if ($("#txtFrom").val().split('-')[0] == "Jan") {
        fromDate = "01/01/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Feb") {
        fromDate = "01/02/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Mar") {
        fromDate = "01/03/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Apr") {
        fromDate = "01/04/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "May") {
        fromDate = "01/05/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Jun") {
        fromDate = "01/06/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Jul") {
        fromDate = "01/07/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Aug") {
        fromDate = "01/08/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Sep") {
        fromDate = "01/09/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Oct") {
        fromDate = "01/10/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Nov") {
        fromDate = "01/11/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Dec") {
        fromDate = "01/12/" + $("#txtFrom").val().split('-')[1];
    }
    //To date
    if ($("#txtTo").val().split('-')[0] == "Jan") {
        toDate = "01/01/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Feb") {
        toDate = "01/02/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Mar") {
        toDate = "01/03/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Apr") {
        toDate = "01/04/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "May") {
        toDate = "01/05/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Jun") {
        toDate = "01/06/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Jul") {
        toDate = "01/07/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Aug") {
        toDate = "01/08/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Sep") {
        toDate = "01/09/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Oct") {
        toDate = "01/10/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Nov") {
        toDate = "01/11/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Dec") {
        toDate = "01/12/" + $("#txtTo").val().split('-')[1];
    }
    var FromDateArr = fromDate.split('/');
    var ToDateArr = toDate.split('/');

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Complaince Report', 'Select start month.');
        return false;

    }
    if ($("#txtTo").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Complaince Report', 'Select end month.');
        return false;
    }

    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Secondary Sales Complaince Report', 'Start Month&Year should be less than End Month&Year.');
        return false;
    }


    var total = 0;
    var d = new Date(FromDateArr[2] + "/" + FromDateArr[1] + "/" + FromDateArr[0]);
    var diffMonth = monthDiff(FromDateArr[1] + "/" + FromDateArr[0] + "/" + FromDateArr[2], ToDateArr[1] + "/" + ToDateArr[0] + "/" + ToDateArr[2]);

    var current_month = d.getMonth();
    var year = "";
    for (var k = 0; k < parseInt(diffMonth) ; k++) {
        year += "'" + d.getFullYear() + "',";
        d.setMonth(d.getMonth() + 1);
        current_month = d.getMonth();
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSecondarySalesComplaince',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&year=' + year,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divReport").html('');
            tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblExpenseReport' >";
            tableContent += "<thead><tr>";
            tableContent += "<th>User Name</th>";
            tableContent += "<th>Employee Name</th>";
            tableContent += "<th>Region Name</th>";
            tableContent += "<th>Division Name</th>";
            tableContent += "<th>Manager Name</th>";
            tableContent += "<th>Manager Region</th>";
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var dd = new Date(FromDateArr[2] + "/" + FromDateArr[1] + "/" + FromDateArr[0]);
            var current_month = dd.getMonth();
            for (var k = 0; k < parseInt(diffMonth) ; k++) {
                tableContent += "<th>" + monthNames[current_month] + " - " + dd.getFullYear() + " </th>";
                dd.setMonth(dd.getMonth() + 1);
                current_month = dd.getMonth();
            }
            tableContent += "<th>Total</th>";
            tableContent += "</tr></thead>";
            tableContent += "<tbody>";


            for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].User_Name + "</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].Employee_Name + "</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].Region_Name + "</td>";
                tableContent += "<td align='left' width='15%'></td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].Manager_Name + "</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[1].Rows[i].Manager_Region_Name + "</td>";
                total = 0;
                if (jsData.Tables[0].Rows.length > 0) {
                    var d = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
                    var current_month = d.getMonth()
                    for (var k = 0; k < parseInt(diffMonth) ; k++) {
                        if (jsData.Tables[1].Rows.length > 0) {
                            var dJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Month=='" + (current_month + 1) + "' & @.Year=='" + d.getFullYear() + "' & @.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");
                            if (dJson != false) {
                                total++;
                                tableContent += "<td align='center' width='15%'>YES</td>";

                            }
                            else {
                                tableContent += "<td align='center' width='15%'>NO</td>";
                            }
                        }
                        else {
                            tableContent += "<td align='center' width='15%'>NO</td>";

                        }

                        d.setMonth(d.getMonth() + 1);
                        current_month = d.getMonth();
                    }
                }
                else {

                    for (var k = 0; k < parseInt(diffMonth) ; k++) {
                        tableContent += "<td align='left' width='15%'>NO</td>";
                        dd.setMonth(dd.getMonth() + 1);
                        current_month = dd.getMonth();
                    }
                }
                tableContent += "<td align='left' width='15%'>" + total + "</td>";
                tableContent += "</tr>";
            }
            tableContent += "</tbody>";
            tableContent += "</table>";
            $("#divReport").html(tableContent);
            $("#divPrint").html(tableContent);
            if ($.fn.dataTable) {
                $('#tblExpenseReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            if (tableContent != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
            }

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

// year value binding in dropdown
function fnYear() {

    var currentYear = (new Date).getFullYear();
    currentYear = currentYear - 2;
    var yearselect = $("#drpYear");
    $('option', yearselect).remove();
    $('#drpYear').append(new Option("-Select Year-", "0", true, true));
    for (var t = 0; t < 4; t++) {
        $('#drpYear').append(new Option(currentYear, currentYear, true, true));
        currentYear = currentYear + 1;
    }
    $("#drpYear").val('0');
}

function fnLockReport() {
    var selectedval = "";
    var enteredDate = "";
    ShowModalPopup("dvloading");
    var nodeVal = $('#hdnRegionCode').val();
    var adjustType = $('input:checkbox[name=Lock]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
    }
    if (selectedval == "") {
        fnMsgAlert('info', 'Lock Report', 'Select atleast one status.');
        HideModalPopup("dvloading");
        return false;
    }
    var year = $('#drpYear').val();
    if (year == "0") {
        fnMsgAlert('info', 'Lock Report', 'Select Year');
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetLockReport',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&year=' + year + '&lockType=' + selectedval,
        success: function (response) {

            $("#divReport").html('');
            if (response != "") {
                var type = response.split('^')[1]
                var jsonType = eval(type);
                $("#divReport").html(response.split('^')[0]);
                $("#divPrint").html(response.split('^')[0]);
                if ($.fn.dataTable) {
                    $('#tblLockreport').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType

                    })
                };

                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                HideModalPopup("dvloading");
            }
        }
    });

}

function fnDayWiseAttendanceReport() {
    var selectedval = "";
    var nodeVal = $('#hdnRegionCode').val();
    var adjustType = $('input:checkbox[name=DCRStatus]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = "1^2^0^";
            break;
        }
    }

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Day Wise Attendance Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Day Wise Attendance Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }

    if (selectedval == "") {
        fnMsgAlert('info', 'Day Wise Attendance Report', 'Select atleast one dcr Status.');
        HideModalPopup("dvloading");
        return false;
    }


    ShowModalPopup("dvloading");
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Day Wise Attendance Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }



    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDayWiseAttendanceReport',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&status=' + selectedval,
        success: function (response) {


            $("#divReport").html('');
            if (response) {

                $("#divReport").html(response.split('^')[0]);
                $("#divPrint").html(response.split('^')[0]);
                var type = response.split('^')[1]
                var jsonType = eval(type);
                if ($.fn.dataTable) {
                    $('#tblAttendanceReport').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
// Secondary Sales Header Report
function fnShowProductDetails() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSaleProductsSS',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');
            $('option', $("#ddlProductName")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlProductName").append("<option value='" + jsData.Tables[0].Rows[i].Product_Code + "'>" + jsData.Tables[0].Rows[i].Product_Name + "</option>");
                    //   $("#ddlProductName").append(new Option(jsData.Tables[0].Rows[i].Product_Name, jsData.Tables[0].Rows[i].Product_Code, false, false));
                }
                $("#selectall").click(function () {
                    $('.case').attr('checked', this.checked);
                });
                $("#ddlProductName").multiselect({
                    noneSelectedText: 'Select Product',
                    selectedList: 4
                }).multiselectfilter();
                $('#dvAjaxLoad').hide();
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
            $('#dvAjaxLoad').hide();
        }
    });
}


//old report

function fnShowStockiestDetails() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetStockiestSSOld',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');
            $('option', $("#ddlStockiestName")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlStockiestName").append("<option value='" + jsData.Tables[0].Rows[i].Customer_Code + "'>" + jsData.Tables[0].Rows[i].Customer_Name + "</option>");                  
                }
                $("#selectall").click(function () {
                    $('.case').attr('checked', this.checked);
                });
                $("#ddlStockiestName").multiselect({
                    noneSelectedText: 'Select Stockiest',
                    selectedList: 4
                }).multiselectfilter();
                $('#dvAjaxLoad').hide();
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
            $('#dvAjaxLoad').hide();
        }
    });
}

function fnSecondarySalesReport() {

    var nodeVal = $('#hdnRegionCode').val();

    var fromDate = "";
    var toDate = "";

    if ($("#txtFrom").val().split('-')[0] == "Jan") {
        fromDate = "01/01/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Feb") {
        fromDate = "01/02/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Mar") {
        fromDate = "01/03/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Apr") {
        fromDate = "01/04/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "May") {
        fromDate = "01/05/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Jun") {
        fromDate = "01/06/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Jul") {
        fromDate = "01/07/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Aug") {
        fromDate = "01/08/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Sep") {
        fromDate = "01/09/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Oct") {
        fromDate = "01/10/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Nov") {
        fromDate = "01/11/" + $("#txtFrom").val().split('-')[1];
    }
    else if ($("#txtFrom").val().split('-')[0] == "Dec") {
        fromDate = "01/12/" + $("#txtFrom").val().split('-')[1];
    }
    //To date
    if ($("#txtTo").val().split('-')[0] == "Jan") {
        toDate = "01/01/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Feb") {
        toDate = "01/02/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Mar") {
        toDate = "01/03/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Apr") {
        toDate = "01/04/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "May") {
        toDate = "01/05/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Jun") {
        toDate = "01/06/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Jul") {
        toDate = "01/07/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Aug") {
        toDate = "01/08/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Sep") {
        toDate = "01/09/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Oct") {
        toDate = "01/10/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Nov") {
        toDate = "01/11/" + $("#txtTo").val().split('-')[1];
    }
    else if ($("#txtTo").val().split('-')[0] == "Dec") {
        toDate = "01/12/" + $("#txtTo").val().split('-')[1];
    }
    var FromDateArr = fromDate.split('/');
    var ToDateArr = toDate.split('/');

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Report', 'Select start month.');
        return false;

    }
    if ($("#txtTo").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Report', 'Select end month.');
        return false;
    }

    var dt1 = new Date(FromDateArr[2] + "/" + FromDateArr[1] + "/" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "/" + ToDateArr[1] + "/" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Secondary Sales Report', 'Start Month&Year should be less than End Month&Year.');
        return false;
    }

    var total = 0;
    var diffMonth = monthDiff(FromDateArr[1] + "/" + FromDateArr[0] + "/" + FromDateArr[2], ToDateArr[1] + "/" + ToDateArr[0] + "/" + ToDateArr[2]);
    var d = new Date(FromDateArr[2] + "/" + FromDateArr[1] + "/" + FromDateArr[0]);
    var current_month = d.getMonth();

    var year = "";
    var month = "";
    for (var k = 0; k < parseInt(diffMonth) ; k++) {

        year += "'" + d.getFullYear() + "',";
        month += "'" + (d.getMonth() + 1) + "',";
        d.setMonth(d.getMonth() + 1);
        current_month = d.getMonth();
    }
    if (month != "") {
        month = month.substring(0, month.length - 1);
    }
    else {
        month = "''";
    }

    if (year != "") {
        year = year.substring(0, year.length - 1);
    }
    else {
        year = "''";
    }
    var productCodes = "";
    var productCode = new Array();

    if ($("#ddlProductName").val() != null) {
        for (var index = 0; index < $("#ddlProductName").val().length; index++) {
            productCodes += "'" + $("#ddlProductName").val()[index] + "',";
        }
    }
    if (productCodes != "") {
        productCodes = productCodes.substring(0, productCodes.length - 1);
    }
    else {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'Secondary Sales Report', 'Please select atleast one product');
        return false;
    }


    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSecondarySalesReport',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&year=' + year + '&product=' + productCodes + '&month=' + month,
        success: function (response) {

            jsData = eval('(' + response[0].Data + ')');
            var tableContent = "";
            $("#divReport").html('');
            tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSecondarySales' >";
            tableContent += "<thead><tr>";
            tableContent += "<th>User Name</th>";
            tableContent += "<th>Employee Name</th>";
            tableContent += "<th>Region Name</th>";
            tableContent += "<th>Division Name</th>";
            tableContent += "<th>Manager Name</th>";
            tableContent += "<th>Manager Region</th>";
            tableContent += "<th>Product Name</th>";
            tableContent += "<th>Month</th>";
            tableContent += "<th>Sales Qty</th>";
            tableContent += "<th>Unit Price</th>";
            tableContent += "<th>Sales Value</th>";
            tableContent += "<th>Sales Return Qty</th>";
            tableContent += "<th>Closing Balance Qty</th>";
            tableContent += "<th>Closing Balance Value</th>";
            tableContent += "</tr></thead>";
            tableContent += "<tbody>";

            var amount = 0; var salesReturn = 0; var closingStock = 0; var Qvantity = 0; var unitprice = 0;
            var closingStockValue = 0;
            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    var dJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");

                    tableContent += "<tr>";
                    if (dJson != false) {
                        tableContent += "<td align='left' width='15%'>" + dJson[0].User_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + dJson[0].Employee_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + dJson[0].Region_Name + "</td>";

                        if (jsData.Tables[2].Rows.length > 0) {
                            var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
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
                        tableContent += "<td align='left' width='15%'>" + dJson[0].Manager_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + dJson[0].Manager_Region_Name + "</td>";
                    }
                    else {
                        tableContent += "<td align='left' width='15%'>Vacant</td>";
                        tableContent += "<td align='left' width='15%'>Vacant</td>";
                        var dJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        if (dJson != false) {
                            tableContent += "<td align='left' width='15%'>" + dJson[0].Region_Name + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        if (jsData.Tables[2].Rows.length > 0) {
                            var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
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
                        if (dJson != false) {
                            tableContent += "<td align='left' width='15%'>" + dJson[0].Manager_Name + "</td>";
                            tableContent += "<td align='left' width='15%'>" + dJson[0].Manager_Region_Name + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                    }
                    amount = parseFloat(amount) + Math.round(jsData.Tables[0].Rows[i].Amount);
                    salesReturn = parseFloat(salesReturn) + jsData.Tables[0].Rows[i].Sales_Return;
                    closingStock = parseFloat(closingStock) + jsData.Tables[0].Rows[i].Closing_Stock;
                    closingStockValue = parseFloat(closingStockValue) + jsData.Tables[0].Rows[i].Closing_Stock_Value;
                    //unitprice = parseFloat(unitprice) + jsData.Tables[0].Rows[i].Price_Per_Unit;
                    Qvantity = parseFloat(Qvantity) + jsData.Tables[0].Rows[i].Sales;
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Product_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Month + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Sales + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Price_Per_Unit + "</td>";
                    tableContent += "<td align='center' width='15%'>" + Math.round(jsData.Tables[0].Rows[i].Amount) + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Sales_Return + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Closing_Stock + "</td>";
                    tableContent += "<td align='center' width='15%'>" + parseFloat(jsData.Tables[0].Rows[i].Closing_Stock_Value).toFixed(2) + "</td>";
                    tableContent += "</tr>";
                }
            }
            tableContent += "</tbody>";
            tableContent += "<tbody><tfoot>";
            tableContent += "<tr>";
            tableContent += "<th></th>";
            tableContent += "<th></th>";
            tableContent += "<th></th>";
            tableContent += "<th></th>";
            tableContent += "<th></th>";
            tableContent += "<th></th>";
            tableContent += "<th></th>";
            tableContent += "<th>Total</th>";
            tableContent += "<th align='center'>" + parseFloat(Qvantity).toFixed(2) + "</th>";
            tableContent += "<th align='center'></th>";
            tableContent += "<th align='center'>" + parseFloat(amount).toFixed(2) + "</th>";
            tableContent += "<th align='center'>" + parseFloat(salesReturn).toFixed(2) + "</th>";
            tableContent += "<th align='center'>" + parseFloat(closingStock).toFixed(2) + "</th>";
            tableContent += "<th align='center'>" + parseFloat(closingStockValue).toFixed(2) + "</th>";
            tableContent += "</tr>";
            tableContent += "</tfoot></tbody>";
            tableContent += "</table>";
            $("#divReport").html(tableContent);
            $("#divPrint").html(tableContent);
            //if ($.fn.dataTable) {
            //    $('#tblSecondarySales').dataTable({
            //        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
            //    });
            //};

            var oTable = $('#tblSecondarySales').dataTable({
                "sPaginationType": "full_numbers", sPlaceHolder: "head:after",
                "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                    var amount = 0; var salesReturn = 0; var closingBalances = 0; var quantity = 0; var unitPrice = 0; var closingBalancesValue = 0;
                    var totalamount = 0; var totalsalesReturn = 0; var totalclosingBalances = 0; var totalQuantity = 0; var totalUnitprice = 0; var totalclosingBalancesValues = 0;
                    for (var i = 0; i < aaData.length; i++) {
                        amount += parseFloat(aaData[i][10].replace(',', '')); salesReturn += parseFloat(aaData[i][11].replace(',', ''));
                        closingBalances += parseFloat(aaData[i][12].replace(',', '')); quantity += parseFloat(aaData[aiDisplay[i]][8].replace(',', ''));
                        closingBalancesValue += parseFloat(aaData[aiDisplay[i]][13].replace(',', ''));
                    }
                    var pageTotal_costs = 0; var pageTotal_count = 0;
                    for (var i = iStart; i < iEnd; i++) {
                        totalamount += parseFloat(aaData[aiDisplay[i]][10].replace(',', '')); totalsalesReturn += parseFloat(aaData[aiDisplay[i]][11].replace(',', ''));
                        totalclosingBalances += parseFloat(aaData[aiDisplay[i]][12].replace(',', '')); totalQuantity += parseFloat(aaData[aiDisplay[i]][8].replace(',', ''));
                        totalclosingBalancesValues += parseFloat(aaData[aiDisplay[i]][13].replace(',', ''));
                    }
                    var nCells = nRow.getElementsByTagName('th');
                    nCells[8].innerHTML = '' + addCommas(totalQuantity.toFixed(2)) + '<br/>(' + addCommas(quantity.toFixed(2)) + ')';
                    //nCells[9].innerHTML = '' + addCommas(totalUnitprice.toFixed(2)) + '<br/>(' + addCommas(unitPrice.toFixed(2)) + ')';
                    nCells[10].innerHTML = '' + addCommas(totalamount.toFixed(2)) + '<br/>(' + addCommas(amount.toFixed(2)) + ')';
                    nCells[11].innerHTML = '' + addCommas(totalsalesReturn.toFixed(2)) + '<br/>(' + addCommas(salesReturn.toFixed(2)) + ')';
                    nCells[12].innerHTML = '' + addCommas(totalclosingBalances.toFixed(2)) + '<br/>(' + addCommas(closingBalances.toFixed(2)) + ')';
                    nCells[13].innerHTML = '' + addCommas(totalclosingBalancesValues.toFixed(2)) + '<br/>(' + addCommas(closingBalancesValue.toFixed(2)) + ')';

                },
                "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }

            });
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            if (tableContent != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
            }

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function addCommas(nStr) {
    nStr += ''; x = nStr.split('.'); x1 = x[0]; x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) { x1 = x1.replace(rgx, '$1' + ',' + '$2'); }
    return x1 + x2;
}
function addCommas(nStr) {
    nStr += ''; x = nStr.split('.'); x1 = x[0]; x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) { x1 = x1.replace(rgx, '$1' + ',' + '$2'); }
    return x1 + x2;
}
// DOCTOR WISE PRODUCT REPORT

function fnBindRegionTypeName() {
    var nodeVal = $('#hdnRegionCode').val();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetChildRegionType',
        data: "regionCode=" + nodeVal.split('_')[0],
        success: function (response) {
            var tableContent = "";
            jsData = eval('(' + response + ')');
            $('option', $("#ddlLevelOneGroup")).remove();
            $('option', $("#ddlLevelTwoGroup")).remove();

            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                    $('#ddlLevelOneGroup').append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                    $('#ddlLevelTwoGroup').append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                }
            }

            if (jsData.Tables[1].Rows.length > 0) {
                tableContent += "<table cellspacing='0' cellpadding='0' border='1' class='data display datatable' width='100%' id='tblInputVal' >";
                tableContent += "<thead><tr>";
                tableContent += "<th >Category Name</th>";
                tableContent += "<th style='width:70px;' >Count</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                    tableContent += "<tr>";
                    tableContent += "<td align='left' >" + jsData.Tables[1].Rows[i].Category_Name + "</td>";
                    tableContent += "<td align='left' >  <input type='text' style='width:70px;' id='txtCategoryValue_" + i + "' />   <input  type='hidden' id='txtCategoryCode_" + i + "' value=" + jsData.Tables[1].Rows[i].Category_Code + " /></td>";
                    tableContent += "</tr>";
                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divCategory").html(tableContent);

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnDoctorWiseProductReport() {
    $("#divReport").html('');
    $("#divModel").html('');
    ShowModalPopup("dvloading");
    var tblInput = $("#tblInputVal tr").length;
    var categoryCount = "";
    var categoryCode = "";
    var categoryValue = 0;
    for (var i = 0; i < tblInput; i++) {
        if ($("#txtCategoryCode_" + i).val() != "" && $("#txtCategoryCode_" + i).val() != undefined) {
            categoryCode = $("#txtCategoryCode_" + i).val();
            categoryValue = $("#txtCategoryValue_" + i).val();
            if (isNaN($("#txtCategoryValue_" + i).val())) {
                fnMsgAlert('info', 'Doctor Wise Product Report', 'Please enter numeric value only at row number ' + (i + 1) + '.');
                $("#txtCategoryValue_" + i).val('')
                $("#txtCategoryValue_" + i).focus();
                HideModalPopup("dvloading");
                return false;
                break;
            }

            if ($("#txtCategoryValue_" + i).val() == "") {
                fnMsgAlert('info', 'Doctor Wise Product Report', 'Please enter numeric value only at row number ' + (i + 1) + '.');
                HideModalPopup("dvloading");
                return false;
                break;

            }
            categoryCount += categoryCode + "_" + categoryValue + "^";
        }
    }

    if (categoryCount != "") {
        categoryCount = categoryCount.substring(0, categoryCount.length - 1);
    }
    else {
        fnMsgAlert('info', 'Doctor Wise Product Report', 'Enter target values');
        HideModalPopup("dvloading");
    }

    var firstLevel = $('#ddlLevelOneGroup').val();
    var secondLevel = $('#ddlLevelTwoGroup').val();
    var regionCode = $('#hdnRegionCode').val();
    var val = "";
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorProductMapping',
        data: 'regionCode=' + regionCode.split('_')[0] + '&category=' + categoryCount + '&leveOne=' + firstLevel + '&levelTwo=' + secondLevel,
        success: function (response) {
            if (response != "") {
                $("#divReport").html(response.split('^')[0]);
                $("#divPrint").html(response.split('^')[0]);
            }
            else {
                $("#divReport").html("No data found");
            }
            var type = response.split('^')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $('#tblDoctorProductMapping').dataTable({
                    "sPaginationType": "full_numbers", "bSort": false, "bSortable": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });

            };
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup("dvloading");
            $("#divInput").slideUp();
            $("#spnInputToggle").html("Show Input");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}

function fnMappedDoctorDetails(val) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorProductMappingPopup',
        data: 'regionCode=' + val.split('_')[0] + '&category=' + val.split('_')[1],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divModel").html('');
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorProductPopUp' class='data display datatable' >";
                tableContent += "<thead><tr style='display: none;' id='tblTr'>";
                tableContent += "<th>Doctor Name</th>";
                tableContent += "<th>MDL Number</th>";
                tableContent += " <th>Category</th>";
                tableContent += "<th>Speciality</th>";
                tableContent += " <th> Hospital Name</th>";
                tableContent += " <th> Hospital Classification</th>";
                tableContent += " <th>Product mapped</th>";
                tableContent += " <th>Yield</th>";
                tableContent += " <th>Potential</th>";
                tableContent += "</tr>";
                var type = '[{ type: "text" }, { type: "number-range" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "text" }';
                type += ',{ type: "number-range" },{ type: "number-range" }]';
                tableContent += "<tr>";
                tableContent += "<th>Doctor Name</th>";
                tableContent += "<th>MDL Number</th>";
                tableContent += " <th>Category</th>";
                tableContent += "<th>Speciality</th>";
                tableContent += " <th> Hospital Name</th>";
                tableContent += " <th> Hospital Classification</th>";
                tableContent += " <th>Product mapped</th>";
                tableContent += " <th>Yield</th>";
                tableContent += " <th>Potential</th>";
                tableContent += "</tr>";
                tableContent += "<th colspan= '9' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</thead>";
                tableContent += "<tbody>";
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                    tableContent += "<tr>";
                    // tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + val.split('_')[0] + "_" + jsData.Tables[0].Rows[i].Customer_Code + "_" + val.split('_')[2] + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Customer_Name + "</span></td>";
                    tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[0].Rows[i].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Customer_Name + "</span></td>";

                    var mdlNo = 0;
                    if (jsData.Tables[0].Rows[i].MDL_Number != "") {
                        if (jsData.Tables[0].Rows[i].MDL_Number.match(/^\d+$/)) {
                            mdlNo = parseInt(jsData.Tables[0].Rows[i].MDL_Number);
                        }
                        else {
                            mdlNo = jsData.Tables[0].Rows[i].MDL_Number;
                        }
                    }
                    tableContent += "<td align='center' width='15%'>" + mdlNo + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Category_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Speciality_Name + "</td>";
                    if (jsData.Tables[0].Rows[i].Hospital_Name != null && jsData.Tables[0].Rows[i].Hospital_Name != "") {
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Hospital_Name + "</td>";
                    }
                    else {
                        tableContent += "<td align='left' width='15%'></td>";
                    }
                    if (jsData.Tables[0].Rows[i].Hospital_Classification != null && jsData.Tables[0].Rows[i].Hospital_Classification != "") {
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Hospital_Classification + "</td>";
                    }
                    else {
                        tableContent += "<td align='left' width='15%'></td>";
                    }

                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Product_Name + "</td>";
                    if (jsData.Tables[0].Rows[i].Yield != null && jsData.Tables[0].Rows[i].Yield != "") {
                        tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Yield + "</td>";
                    }
                    else {
                        tableContent += "<td align='center' width='15%'>0</td>";
                    }
                    if (jsData.Tables[0].Rows[i].Potential != null && jsData.Tables[0].Rows[i].Potential != "") {
                        tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Potential + "</td>";
                    }
                    else {
                        tableContent += "<td align='center' width='15%'>0</td>";
                    }
                    tableContent += "</tr>";

                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divModel").html(tableContent);
                $("#divsubPrint").html(tableContent);
                var jsonType = eval(type);
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tblDoctorProductPopUp').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

function fnDayWiseFieldReport() {
    var lblContent = "";
    ShowModalPopup("dvloading");
    var selectedval = "";
    var nodeVal = $('#hdnRegionCode').val();
    var adjustType = $('input:checkbox[name=DCRStatus]:checked');

    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + ",";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = adjustType[intLoop].value + ",";
            break;
        }
    }

    if ($.trim($("#txtFromDate").val()) == "") {
        fnMsgAlert('info', 'Day Wise Field Report', 'Select start date');
        HideModalPopup("dvloading");
        return false;

    }
    if ($.trim($("#txtToDate").val()) == "") {
        fnMsgAlert('info', 'Day Wise Field Report', 'Select end date');
        HideModalPopup("dvloading");
        return false;
    }

    if (!fnValidateDateFormate($('#txtFromDate'), "Start Date")) {
        HideModalPopup("dvloading");
        return false;
    }

    if (!fnValidateDateFormate($('#txtToDate'), "End Date")) {
        HideModalPopup("dvloading");
        return false;
    }

    if (selectedval != "") {
        selectedval = selectedval.substring(0, selectedval.length - 1);
    }
    else {
        fnMsgAlert('info', 'Day Wise Field Report', 'Select atleast one dcr Status.');
        HideModalPopup("dvloading");
        return false;
    }

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Day Wise Field Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;

    }
    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);
    var tableContent = "";
    var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDayWiseFieldReport',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-"
            + ToDateArr[1] + "-" + ToDateArr[0] + '&status=' + selectedval + '&startTime= ' + $('#txtStartTime').val(),
        success: function (response) {
            if (response != '' && response != null) {
                lblContent += '<lable>1. <span style="font-weight:bold;">Doctor Visit Average</span> – Grand Total of Doctors Met / Field Days (Assuming .5 logic is already in place while calculating Field Days).</lable></br>';
                lblContent += '<lable>2. <span style="font-weight:bold;">Chemist Visit Average</span> - Grand Total of Chemist Met / Field Days (Assuming .5 logic is already in place while calculating Field Days).</lable></br>';
                lblContent += '<lable>3. <span style="font-weight:bold;">Own Brand Total Value </span>is the total Num. of RCPA Qty  *  Price defined in price group PTR column.</lable></br>';
                lblContent += '<lable>4. <span style="font-weight:bold;">Competitor Brand Rx Qty </span> is the total Num. of RCPA Qty *  Price defined in price group PTR column.</lable>'
                $("#divReport").html('');
                $("#divReportHeader").html('');
                $('#dvLegend').html('');
                var ar = response.split('$');
                if (ar.length > 1) {
                    $("#divReportHeader").html(ar[0]);
                    $("#divReport").html(ar[1]);
                    $("#divPrint").html(ar[1]);
                    $("#divSummary").html(ar[2]);
                }
                if ($.fn.dataTable) {
                    $('#tblDetails').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });

                };
                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
                if (lblContent != '') {
                    $('#dvLegend').html(lblContent);
                }
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}

function fnFieldWorkPlannerReport() {
    HideModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetFieldWorkPlanner',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divReport").html('');
            if (jsData.Tables[0].Rows.length > 0) {

                var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
                tableContent = "<div class='gridHeader'><h3 style='width: 97.6%;margin:0px auto'>AREA PROFILING</h3></div>";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display dataTable box' width='100%' id='tblFieldWorkPlannerReport' >";
                tableContent += "<tr><td>MANAGERS NAME</td><td>" + jsData.Tables[0].Rows[0].User_Name + "</td><td>DATE OF JOINING ( DD/MM/YY )</td><td>" + jsData.Tables[0].Rows[0].DOJ + "</td><td>Approved TEAM SIZE</td><td>" + (jsData.Tables[4].Rows.length - 1) + "</td></tr>";
                var d = new Date();

                tableContent += "<tr><td>AREA NAME</td><td>" + jsData.Tables[0].Rows[0].Region_Name + "</td><td>TOUR PLAN FOR THE MONTH</td><td>" + monthname[d.getMonth() + 1] + "-" + d.getFullYear() + "</td><td>CURRENT TEAM SIZE</td><td>" + (jsData.Tables[4].Rows.length - 1) + "</td></tr>";
                tableContent += "<tr><td>DIVISION NAME</td>";
                if (jsData.Tables[2].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
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
                tableContent += "<td>APPROVED BY ( RM / DSM / SM / NSM ) NAME</td><td></td><td>SIGN & DATE</td><td></td></tr>";
                var count = 0;
                var primarySalesVal = "";
                if (jsData.Tables[2].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {

                        var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Parameter_Code=='" + jsData.Tables[2].Rows[i].Parameter_Code + "')]");
                        if (dJsonData != false) {
                            primarySalesVal = dJsonData[0].Parameter_Value
                        }
                        else {
                            primarySalesVal = "0";
                        }

                        if (count == 0) {
                            tableContent += "<tr>";
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Parameter_Name + "</td><td align='left' width='15%'>" + primarySalesVal + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Parameter_Name + "</td><td align='left' width='15%'>" + primarySalesVal + "</td>";
                        }
                        count++;
                        if (count == 3) {
                            tableContent += "</tr>";
                            count = 0;
                        }
                    }
                    if (count < 3) {
                        tableContent += "</tr>";
                    }
                }
                tableContent += "</table>";

                if (jsData.Tables[2].Rows.length > 0) {
                    tableContent += "<div class='gridHeader'><h3 style='width: 97.6%;margin:0px auto'>SALES PERFORMANCE AT A GLANCE FOR THE AREA</h3></div>";
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display dataTable box' width='100%' id='tblFieldWorkPlannerDetailReport'><tr>";
                    tableContent += "<tr class='tableTR'><th rowspan='2' class='tableTR' class='tableTR'>USER NAME</th><th rowspan='2' class='tableTR'>USER TYPE NAME</th>";

                    var dJsonDataM = jsonPath(jsData, "$.Tables[2].Rows[?(@.Flag=='M')]");
                    if (dJsonDataM != false) {
                        tableContent += "<th colspan='" + dJsonDataM.length + "' class='tableTR'>Next MONTH VALUES</th>";
                    }
                    else {
                        tableContent += "<th  class='tableTR'>NEXT MONTH VALUES</th>";
                    }

                    var dJsonDataY = jsonPath(jsData, "$.Tables[2].Rows[?(@.Flag=='Y')]");
                    if (dJsonDataY != false) {
                        tableContent += "<th colspan='" + dJsonDataY.length + "'  class='tableTR'>NEXT YTD VALUES</th>";
                    }
                    else {
                        tableContent += "<th  class='tableTR'>NEXT YTD VALUES</th>";
                    }
                    tableContent += "<th rowspan='2'  class='tableTR'>NO.OF TIMES WRKD </th></tr><tr>";

                    if (dJsonDataM.length > 0) {
                        for (var j = 0; j < dJsonDataM.length; j++) {
                            tableContent += "<th class='tableTR'>" + dJsonDataM[j].Parameter_Name + "</th>";
                        }

                    }
                    if (dJsonDataY.length > 0) {
                        for (var j = 0; j < dJsonDataY.length; j++) {
                            tableContent += "<th class='tableTR'>" + dJsonDataY[j].Parameter_Name + "</th>";
                        }

                    }

                    tableContent += "</tr>";
                    primarySalesVal = "";
                    for (var i = 0; i < jsData.Tables[4].Rows.length; i++) {
                        if (jsData.Tables[0].Rows[0].User_Name != jsData.Tables[4].Rows[i].User_Name) {
                            tableContent += "<tr >";
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[4].Rows[i].User_Name + "</td>";
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[4].Rows[i].User_Type_Name + "</td>";
                            if (dJsonDataM.length > 0) {
                                for (var j = 0; j < dJsonDataM.length; j++) {
                                    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Parameter_Code=='" + dJsonDataM[j].Parameter_Code + "' & @.Region_Code=='" + jsData.Tables[4].Rows[i].Region_Code + "')]");
                                    if (dJsonData != false) {
                                        primarySalesVal = dJsonData[0].Parameter_Value;
                                    }
                                    else {
                                        primarySalesVal = "0";
                                    }
                                    tableContent += "<td align='center'>" + primarySalesVal + "</td>";

                                }
                            }
                            if (dJsonDataY.length > 0) {
                                for (var j = 0; j < dJsonDataY.length; j++) {
                                    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Parameter_Code=='" + dJsonDataY[j].Parameter_Code + "' & @.Region_Code=='" + jsData.Tables[4].Rows[i].Region_Code + "')]");
                                    if (dJsonData != false) {
                                        primarySalesVal = dJsonData[0].Parameter_Value;
                                    }
                                    else {
                                        primarySalesVal = "0";
                                    }
                                    tableContent += "<td align='center'>" + primarySalesVal + "</td>";
                                }
                            }

                            var dJsonData = jsonPath(jsData, "$.Tables[6].Rows[?(@.Region_Code=='" + jsData.Tables[4].Rows[i].Region_Code + "')]");
                            if (dJsonData != false) {
                                var dJson = jsonPath(dJsonData, "$.[?(@.Acc1=='" + jsData.Tables[0].Rows[0].User_Name + "' | @.Acc2=='" + jsData.Tables[0].Rows[0].User_Name + "' | @.Acc3=='" + jsData.Tables[0].Rows[0].User_Name + "' | @.Acc4=='" + jsData.Tables[0].Rows[0].User_Name + "')]");
                                if (dJson != false) {

                                    tableContent += "<td align='center' width='8%'><span onclick='fnTourPlannerPopup(\"" + jsData.Tables[4].Rows[i].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Name + "\")' style='text-decoration:underline;cursor:pointer'>" + dJson.length + "</span></td>";
                                }
                                else {
                                    tableContent += "<td align='center'>0</td>";
                                }
                            }
                            else {
                                tableContent += "<td align='center'>0</td>";
                            }
                            tableContent += "</tr>";
                        }
                    }
                }
                tableContent += "</table>";

                $("#divReport").html(tableContent);
                $("#divPrint").html(tableContent);
                if ($.fn.dataTable) {
                    $('#tblExpenseReport').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                };
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}


function fnTourPlannerPopup(val) {
    HideModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetFieldWorkPlannerPopup',
        data: 'regionCode=' + val.split('_')[0],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divModel").html('');

            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblTourPlannerPopUp' class='data display datatable' >";
                tableContent += "<thead>";
                tableContent += "<tr>";
                tableContent += "<th >Acc Name</th>";
                tableContent += "<th >Date</th>";
                tableContent += "<tr></thead>";
                tableContent += "<tbody>";
                var dJsonData = jsonPath(jsData, "$.Tables[0].Rows[?(@.Acc1=='" + val.split('_')[1] + "' | @.Acc2=='" + val.split('_')[1] + "' | @.Acc3=='" + val.split('_')[1] + "' | @.Acc4=='" + val.split('_')[1] + "')]");
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {

                        tableContent += "<tr><td align='left' >" + val.split('_')[1] + "</td>";
                        tableContent += "<td align='left' >" + dJsonData[j].Date + "</td>";
                        tableContent += "</tr>";
                    }
                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divModel").html(tableContent);
                // if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
                //                if ($.fn.dataTable) {
                //                    $('#tblTourPlannerPopUp').dataTable({ "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                //                    });
                //                };
            }
            ShowModalPopup('modal');
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

// RCPA Detailed Report

function fnRCPADetailedReport(pageNo, totalOwn, totalComp) {
    var dcrStatus = "";
    $('#dvTotal').hide();

    var nodeVal = $('#hdnRegionCode').val();
    ShowModalPopup("dvloading");
    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    var totalownvalue = "";
    var totalCompValue = "";
    //$("#divSummaryReport").html("");
    $("#divReport").html("");
    if (pageNo == 1) {
        $('#divUserRetailsforRCPA').html("");
    }

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'RCPA Detailed Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'RCPA Detailed Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate);
    var dt2 = new Date(endDate)
    if (dt1 > dt2) {
        fnMsgAlert('info', 'RCPA Detailed Report', 'Start date should be less than End end date');
        HideModalPopup("dvloading");
        return false;
    }
    var dcrStatusArr = $('input:checkbox[name=DCRStatus]:checked');
    for (var intLoop = 0; intLoop < dcrStatusArr.length; intLoop++) {
        dcrStatus += dcrStatusArr[intLoop].value + "^";
    }
    if (dcrStatus != "") {
        dcrStatus = dcrStatus;
    }
    else {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'RCPA Detailed Report', 'Select atleast one dcr status');
        return false;
    }


    var productCodes = "";
    if ($("#ddlProductName").val() != null) {
        for (var index = 0; index < $("#ddlProductName").val().length; index++) {
            productCodes += "" + $("#ddlProductName").val()[index] + "^";
        }
    }

    if (productCodes == "") {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'RCPA Detailed Report', 'Please select atleast one product');
        return false;
    }

    var options = "";
    //GET OPTIONS
    if ($('#optViewInScreen').attr('checked') == "checked") {
        options = "S";
    }
    else {
        options = "E";
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetRCBADetails',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&sd=' + startDate + '&ed=' + endDate + '&status=' + dcrStatus + '&option=' + options + '&productCodes=' + productCodes + '&pageNo=' + pageNo + '&totalOwn=' + totalOwn + '&totalComp=' + totalComp,
        success: function (response) {
            $("#divReport").html('');
            if (response != "" && response != null) {
                $("#divUserRetailsforRCPA").html(response.split('^')[0]);
                $("#divReport").html(response.split('^')[1]);
                totalownvalue = response.split('^')[2];
                totalCompValue = response.split('^')[3];
                if ($.fn.dataTable) {

                    $('#tblRCPADeatiledRept').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, bFilter: false, bInfo: false,
                        "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                            var ownValue = 0; var competitorvalue = 0;
                            for (var i = iStart; i < iEnd; i++) {
                                if (aaData[i][0].toUpperCase() != "TOTAL VALUE") {
                                    if (aaData[i][12] != null && aaData[i][12] != '') {
                                        ownValue += parseFloat(aaData[i][12].replace(',', ''));
                                    }
                                    if (aaData[i][15] != null && aaData[i][15] != '') {
                                        competitorvalue += parseFloat(aaData[i][15].replace(',', ''));
                                    }
                                }
                            }
                            var ncell = nRow.getElementsByTagName('th');
                            ncell[12].getElementsByTagName("span")[0].innerHTML = addCommas(addCommas(ownValue.toFixed(2)));
                            ncell[12].getElementsByTagName("span")[1].innerHTML = totalownvalue;
                            ncell[15].getElementsByTagName("span")[0].innerHTML = '' + addCommas(addCommas(competitorvalue.toFixed(2)));
                            ncell[15].getElementsByTagName("span")[1].innerHTML = totalCompValue;
                        },
                        "fnDrawCallback": function () {
                            var currentPage = this._fnPagingInfo();
                            if ((currentPage.iPage + 1) == currentPage.iTotalPages) {
                                $("#spnTotal").css("display", "block");
                                $("#spnTotalOwnValue").css("display", "block");
                                $("#spnTotalCompValue").css("display", "block");
                            }
                            else {
                                $("#spnTotal").css("display", "none");
                                $("#spnTotalOwnValue").css("display", "none");
                                $("#spnTotalCompValue").css("display", "none");
                                $('#dvTotal').hide();
                            }
                        }
                    });

                };
                HideModalPopup("dvloading");
            }
            else {

                fnMsgAlert('info', 'Report', 'No data found.');
                HideModalPopup("dvloading");
                $('#btnShowReport').hide();
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
            $('#btnShowReport').hide();
        }
    });
}

function fnGoToPrevPage() {
    var pno = parseInt($('#pageno').html()) - 1;
    var totalOwn = $('#hdnTotalown').val();
    var totalComp = $('#hdnTotalComp').val();
    fnRCPADetailedReport(pno, totalOwn, totalComp);
}
function fnGoToNextPage() {
    var pno = parseInt($('#pageno').html()) + 1;
    var totalOwn = $('#hdnTotalown').val();
    var totalComp = $('#hdnTotalComp').val();
    fnRCPADetailedReport(pno, totalOwn, totalComp);
}
function fnGoToPage() {
    var pno = $('#drpPaging :selected').val();
    var totalOwn = $('#hdnTotalown').val();
    var totalComp = $('#hdnTotalComp').val();
    fnRCPADetailedReport(pno, totalOwn, totalComp);
}

function fnRCPASummaryReport() {

    var productCodes = "";
    var regionCodes = "";
    var dcrStatus = "";
    ShowModalPopup("dvloading");
    var length = $("#tblRCPADetails tr").length;
    if (length > 0) {
        for (var index = 1; index < length; index++) {
            if ($("#hdnValues_" + index.toString()) != null) {
                if ($("#chk_" + index.toString()) != null) {
                    if ($("#chk_" + index.toString()).attr('checked') == "checked") {
                        regionCodes += $("#hdnValues_" + index.toString()).val() + "^";
                    }
                }
            }
        }
    }

    var dcrStatusArr = $('input:checkbox[name=DCRStatus]:checked');
    for (var intLoop = 0; intLoop < dcrStatusArr.length; intLoop++) {
        dcrStatus += dcrStatusArr[intLoop].value + "^";
    }

    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];


    if ($("#ddlProductName").val() != null) {
        for (var index = 0; index < $("#ddlProductName").val().length; index++) {
            productCodes += "" + $("#ddlProductName").val()[index] + "^";
        }
    }


    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetRCBASummaryDetails',
        data: 'regionCode=' + regionCodes + '&sd=' + startDate + '&ed=' + endDate + '&status=' + dcrStatus + '&product=' + productCodes,
        success: function (response) {
            $("#divSummaryReport").html('');
            $("#divSummaryReport").html(response);
            $("#divsubPrint").html(response);
            if ($.fn.dataTable) {
                $('#tblRCPASummary').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("divsubPrint", "ifrmsubPrint", "divSummaryReport");
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

function fnDoctor360Popup(val) {
    // $.modal({ ajax: '../HiDoctor_Reports/Reports/Doctor360/' + val, title: 'Reports', overlayClose: false });
    $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + val, title: 'Reports', overlayClose: false });
    return;
}

//User Leave Report -- Created by arshad
function fnLeaveReport() {
    ShowModalPopup("dvloading");
    var selectedval = "";
    var viewType = "";
    if ($('#optViewInScreen').attr('checked') == 'checked') {
        viewType = "SCREEN";
    }
    else {
        viewType = "EXCEL";
    }

    var nodeVal = $('#hdnUserCode').val();
    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Leave Report', 'Select start date');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Leave Report', 'Select end date');
        HideModalPopup("dvloading");
        return false;
    }

    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Leave Report', 'Start Month&Year should be less than End Month&Year');
        HideModalPopup("dvloading");
        return false;
    }
    $("#divReport").html(" ");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetLeaveReport',
        data: 'userCode=' + nodeVal.split('_')[0] + '&startDate=' + startDate[2] + "-" + startDate[1] + "-" + startDate[0] +
            '&endDate=' + endDate[2] + "-" + endDate[1] + "-" + endDate[0] + "&viewType=" + viewType + "&title=" + $('#hdnTitle').val(),
        success: function (response) {
            $("#divReport").html(response);
            // $("#divPrint").html(response);
            //if ($.fn.dataTable) {
            //    $('#tblLeavereport').dataTable({
            //        "iDisplayLength": 25,
            //        "sPaginationType": "full_numbers",
            //        "bDestroy": true,
            //        "sDom": 'T<"clear">lfrtip',
            //        "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
            //    });
            //};
            //fninializePrint("divPrint", "ifrmPrint", "divReport");
            $("#divInput").slideUp();
            $("#spnInputToggle").html("Show Input");
            HideModalPopup("dvloading");
        },
        error: function (e) {
            fnMsgAlert('info', 'Report', e.responseText);
            HideModalPopup("dvloading");
        }
    });
}

//fnDoctorStatisticsReport.
function fnDoctorStatisticsReport() {

    ShowModalPopup("dvloading");

    $('#regiontree').hide();
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');
    $("#spnTreeToggle").html('Show Tree');

    $("#divHideHeader").show();
    $('#divHideHeader1').hide();
    $('#divImport').hide();
    $("#divSummary").html("");
    $('#dvSubprint').hide();
    $('#dvExcelPrint').hide();

    var selectedval = "";
    var tablecontent = "";
    var tblprint = ""
    var nodeVal = $('#hdnRegionCode').val();
    var startMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var startYear = $('#txtFrom').val().split('-')[1];

    var days = daysInMonth(startMonth, startYear)

    var startDate = "", endDate = "", status = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
        endDate = startYear + "-" + startMonth + "-" + days;
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
        endDate = startYear + "-0" + startMonth + "-" + days;
    }

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Doctor Statistics Report', 'Select month and year');
        HideModalPopup("dvloading");
        return false;
    }

    var adjustType = $('input:checkbox[name=DCRStatus]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
    }
    if (selectedval != "") {
        //  selectedval = selectedval.substring(0, selectedval.length - 1);
    }
    else {
        fnMsgAlert('info', 'Doctor Statistics Report', 'Select atleast one dcr Status');
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorStatisticsReport',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&sd=' + startDate + '&ed=' + endDate + '&status=' + selectedval + "&Month=" + startMonth + "&Year=" + startYear + "&title=" + $('#divPageHeader').html(),
        success: function (response) {

            $("#spnTreeToggle").show();
            $("#divReport").show();
            $("#dvPrint").show();
            $("#divInput").slideUp();
            $("#spnInputToggle").html("Show Input");
            $("#dvTree").hide();
            $("#spnTreeToggle").html('Show Tree');

            $("#divReportHeader").html(response.split('@')[0]);
            tblprint += response.split('@')[0] + "<br/>" + response.split('@')[1];
            $("#divReport").html(response.split('@')[1]);
            $("#divPrint").html(tblprint);
            if ($.fn.dataTable) {
                $('#tblDoctorStatistics').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };

            if (response != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
            }
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            //Added *
            tablecontent += "<lable style='font-weight:bold;'><span style='color:red;'>*</span>Values indicates that Actuals are more than Planned(If Available)</lable>";
            $('#divImport').html(tablecontent);
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

// Get Month val();
function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEB") {
        return 2;
    }
    if (monthName.toUpperCase() == "MAR") {
        return 3;
    }
    if (monthName.toUpperCase() == "APR") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 6;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCT") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC") {
        return 12;
    }
}

function fnManPowerSummary(val) {
    $.ajax({
        type: 'post',
        url: '../HiDoctor_Reports/Reports/GetManpowerSummary',
        data: 'regioncode=' + val.split('_')[0] + '&status=' + val.split('_')[1],
        success: function (response) {

            $("#divSummaryReport").html(response.split('^')[0]);
            $("#divsubPrint").html(response.split('^')[0]);
            var type = response.split('^')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);

                $('#tblManPowerSummary').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };
            fninializePrint("divsubPrint", "ifrmsubPrint", "divSummaryReport");
            if (response != "") {
                $("#divInput").slideUp();
            }
            else {
                $("#divReport").html("No data found");
                $("#dvTree").show();
                $("#main").css('width', '80%');
                $("#spnTreeToggle").html('Hide Tree');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnTableShowHide(divid, spnid, printId) {
    if ($('#' + divid).css("display") == "none") {
        $('#' + divid).fadeIn('slow');
        //$('#' + spnid).removeClass('expand');
        //$('#' + spnid).addClass('collapse');
        $('#' + printId).fadeIn('slow');
    }
    else {
        $('#' + divid).fadeOut('slow');
        //$('#' + spnid).removeClass('collapse');
        //$('#' + spnid).addClass('expand');    
        $('#' + printId).fadeOut('slow');
    }
}
// year value binding in dropdown
function fnYear() {

    var currentYear = (new Date).getFullYear();
    currentYear = currentYear - 2;
    var yearselect = $("#drpYear");
    $('option', yearselect).remove();
    $('#drpYear').append("<option value='0'>-Select Year-</option>");
    for (var t = 0; t < 4; t++) {
        $('#drpYear').append("<option value='" + currentYear + "'>" + currentYear + "</option>");
        currentYear = currentYear + 1;
    }
    $("#drpYear").val('0');
}

function fnDoctorPOBDetails(val) {

    HideModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorPOBDetails',
        data: 'regionCode=' + val.split('_')[0] + '&date=' + val.split('_')[1],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divModel").html('');
            if (jsData.Tables[0].Rows.length > 0) {
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorPopUpUserHeader' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th align='left' colspan='6' >User Details</th></tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Name + "</td>";
                tableContent += "<td align='left' ><b>Employee Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Employee_Name + "</td><tr>";

                tableContent += "<tr><td align='left' ><b>Designation</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Type_Name + "</td>";
                tableContent += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Region_Name + "</td><tr>";

                var dcrDate = val.split('_')[1];
                dcrDate = dcrDate.split('-')[2] + "/" + dcrDate.split('-')[1] + "/" + dcrDate.split('-')[0]

                if (jsData.Tables[2].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[0].Region_Code + "')]");
                    divisionName = "";
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            divisionName += dJsonData[j].Division_Name + ",";
                        }

                        if (divisionName != "") {
                            divisionName = divisionName.substring(0, divisionName.length - 1);
                        }

                        tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' >" + divisionName + "</td><td></td><td></td></tr>";
                    }
                    else {
                        tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' ></td><td></td><td></td></tr>";
                    }
                }
                else {
                    tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' ></td><td></td><td></td></tr>";
                }

                tableContent += "<tr><td align='left' ><b>Reporting To Manager Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Manager_Name + "</td>";
                tableContent += "<td align='left' ><b>Reporting To Region </b></td><td align='left' >" + jsData.Tables[1].Rows[0].Manager_Region_Name + "</td><tr>";


                tableContent += "<tr><td align='left' ><b>Date Period</b></td><td align='left' >" + val.split('_')[2] + " To " + val.split('_')[3] + "</td>";
                tableContent += "<td><b>DCR Date:</b></td><td>" + dcrDate + "</td><tr>";

                tableContent += "</table>";

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorPopUp' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th >Doctor Name</th>";
                tableContent += "<th >MDL No</th>";
                tableContent += "<th >Category</th>";
                tableContent += "<th >Speciality</th>";
                tableContent += "<th >Hospital Name</th>";
                tableContent += "<th >Local Area Name</th>";
                //tableContent += "<th >DCR Date</th>";
                tableContent += "<th >POB Amount</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                //tableContent += "<tr>";
                //tableContent += " <td></td>";
                //tableContent += " <td></td>";
                //tableContent += " <td></td>";
                //tableContent += " <td width=40%'><b>DCR Date:" + dcrDate + "<b></td>";
                //tableContent += " <td></td>";
                //tableContent += " <td></td>";
                //tableContent += " <td></td>";
                //// tableContent += " <td></td>";
                //tableContent += "</tr>";

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                    tableContent += "<tr>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Customer_Name + " " + jsData.Tables[0].Rows[i].Sur_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].MDL_Number + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Category_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Speciality_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Hospital_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Local_Area + "</td>";
                    // tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].DCR_Date + "</td>";
                    tableContent += "<td align='left' width='15%'>" + parseFloat(jsData.Tables[0].Rows[i].PO_Amount).toFixed(2) + "</td>";
                    tableContent += "</tr>";

                }
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divModel").html(tableContent);
                $("#divsubPrint").html(tableContent);

            }
            if ($.fn.dataTable) {
                $('#tblDoctorPopUp').dataTable({
                    "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
            ShowModalPopup('modal');
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}



function fnChemistPOBDetails(val) {
    HideModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetChemistPOBDetails',
        data: 'regionCode=' + val.split('_')[0] + '&date=' + val.split('_')[1],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divModel").html('');
            if (jsData.Tables[0].Rows.length > 0) {
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorPopUpUserHeader' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th align='left' colspan='6' >User Details</th></tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Name + "</td>";
                tableContent += "<td align='left' ><b>Employee Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Employee_Name + "</td><tr>";

                tableContent += "<tr><td align='left' ><b>Designation</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Type_Name + "</td>";
                tableContent += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Region_Name + "</td><tr>";

                if (jsData.Tables[2].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[0].Region_Code + "')]");
                    divisionName = "";
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            divisionName += dJsonData[j].Division_Name + ",";
                        }

                        if (divisionName != "") {
                            divisionName = divisionName.substring(0, divisionName.length - 1);
                        }

                        tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' >" + divisionName + "</td><td></td><td></td></tr>";
                    }
                    else {
                        tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' ></td><td></td><td></td></tr>";
                    }
                }
                else {
                    tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' ></td><td></td><td></td></tr>";
                }

                tableContent += "<tr><td align='left' ><b>Reporting To Manager Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Manager_Name + "</td>";
                tableContent += "<td align='left' ><b>Reporting To Region </b></td><td align='left' >" + jsData.Tables[1].Rows[0].Manager_Region_Name + "</td><tr>";


                tableContent += "<tr><td align='left' ><b>Date Period</b></td><td align='left' >" + val.split('_')[2] + " To " + val.split('_')[3] + "</td>";
                var dcrDate = val.split('_')[1];
                dcrDate = dcrDate.split('-')[2] + "/" + dcrDate.split('-')[1] + "/" + dcrDate.split('-')[0];
                tableContent += "<td><b>DCR Date:</b></td><td>" + dcrDate + "</td><tr>";

                tableContent += "</table>";

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorPopUp' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th >Chemist Name</th>";
                tableContent += "<th >Chemist POB Amount</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";

                //tableContent += "<tr>";
                //tableContent += " <td></td>";
                //tableContent += " <td width='15%'><b>DCR Date:" + dcrDate + "<b></td>";
                //tableContent += "</tr>";

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                    tableContent += "<tr>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Chemists_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + parseFloat(jsData.Tables[0].Rows[i].PO_Amount).toFixed(2) + "</td>";
                    tableContent += "</tr>";

                }
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divModel").html(tableContent);
                $("#divsubPrint").html(tableContent);

            }
            if ($.fn.dataTable) {
                $('#tblDoctorPopUp').dataTable({
                    "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
            ShowModalPopup('modal');
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnStockiestPOBDetails(val) {
    HideModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetStockiestPOBDetails',
        data: 'regionCode=' + val.split('_')[0] + '&date=' + val.split('_')[1],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            $("#divModel").html('');
            if (jsData.Tables[0].Rows.length > 0) {
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorPopUpUserHeader' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th align='left' colspan='6' >User Details</th></tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Name + "</td>";
                tableContent += "<td align='left' ><b>Employee Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Employee_Name + "</td><tr>";

                tableContent += "<tr><td align='left' ><b>Designation</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Type_Name + "</td>";
                tableContent += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Region_Name + "</td><tr>";

                if (jsData.Tables[2].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[0].Region_Code + "')]");
                    divisionName = "";
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            divisionName += dJsonData[j].Division_Name + ",";
                        }

                        if (divisionName != "") {
                            divisionName = divisionName.substring(0, divisionName.length - 1);
                        }

                        tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' >" + divisionName + "</td><td></td><td></td></tr>";
                    }
                    else {
                        tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' ></td><td></td><td></td></tr>";
                    }
                }
                else {
                    tableContent += "<tr><td align='left' ><b>Division Name</b></td><td align='left' ></td><td></td><td></td></tr>";
                }

                tableContent += "<tr><td align='left' ><b>Reporting To Manager Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Manager_Name + "</td>";
                tableContent += "<td align='left' ><b>Reporting To Region </b></td><td align='left' >" + jsData.Tables[1].Rows[0].Manager_Region_Name + "</td><tr>";


                tableContent += "<tr><td align='left' ><b>Date Period</b></td><td align='left' >" + val.split('_')[2] + " To " + val.split('_')[3] + "</td>";
                var dcrDate = val.split('_')[1];
                dcrDate = dcrDate.split('-')[2] + "/" + dcrDate.split('-')[1] + "/" + dcrDate.split('-')[0];
                tableContent += "<td><b>DCR Date:</b></td><td>" + dcrDate + "</td><tr>";
                tableContent += "</table>";

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorPopUp' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th >Stockiest Name</th>";
                tableContent += "<th >Stockiest POB Amount</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                //var dcrDate = val.split('_')[1];
                //dcrDate = dcrDate.split('-')[2] + "/" + dcrDate.split('-')[1] + "/" + dcrDate.split('-')[0]
                //tableContent += "<tr>";
                //tableContent += " <td></td>";
                //tableContent += " <td width='15%'><b>DCR Date:" + dcrDate + "<b></td>";
                //tableContent += "</tr>";

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                    tableContent += "<tr>";
                    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Stockiest_Name + "</td>";
                    tableContent += "<td align='left' width='15%'>" + parseFloat(jsData.Tables[0].Rows[i].PO_Amount).toFixed(2) + "</td>";
                    tableContent += "</tr>";

                }
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divModel").html(tableContent);
                $("#divsubPrint").html(tableContent);

            }
            if ($.fn.dataTable) {
                $('#tblDoctorPopUp').dataTable({
                    "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
            ShowModalPopup('modal');
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}




// *****************************TP REPORT *********************************************************//

// *****************************TP REPORT *********************************************************//

var result = "";
function fnTpReport() {
    ShowModalPopup("dvloading");
    if ($("#txtFrom").val() == "") {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'TP Report', 'Please Select The Month.');
        return false;
    }

    var month = "", year = "";
    var fromDate = "";
    var toDate = "", accName = "";
    if ($("#txtFrom").val().split('-')[0] == "Jan") {
        month = "01";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Feb") {
        month = "02";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Mar") {
        month = "03";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Apr") {
        month = "04";
    }
    else if ($("#txtFrom").val().split('-')[0] == "May") {
        month = "05";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Jun") {
        month = "06";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Jul") {
        month = "07";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Aug") {
        month = "08";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Sep") {
        month = "09";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Oct") {
        month = "10";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Nov") {
        month = "11";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Dec") {
        month = "12";
    }
    year = $("#txtFrom").val().split('-')[1];
    $.ajax({

        url: '../HiDoctor_Reports/Reports/GetTpReport',
        type: "POST",
        data: "UserCode=" + $("#hdnUserCode").val() + "&month=" + month + "&year=" + year,
        success: function (response) {

            jsData = eval('(' + response + ')');

            var month = "", year = "";
            if ($("#txtFrom").val().split('-')[0] == "Jan") {
                month = "01";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Feb") {
                month = "02";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Mar") {
                month = "03";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Apr") {
                month = "04";
            }
            else if ($("#txtFrom").val().split('-')[0] == "May") {
                month = "05";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Jun") {
                month = "06";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Jul") {
                month = "07";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Aug") {
                month = "08";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Sep") {
                month = "09";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Oct") {
                month = "10";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Nov") {
                month = "11";
            }
            else if ($("#txtFrom").val().split('-')[0] == "Dec") {
                month = "12";
            }
            year = $("#txtFrom").val().split('-')[1];

            var content = "";
            content += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblHeader' >";
            content += "<thead><tr>";
            content += "<th align='left' colspan='6' >User Details</th></tr></thead>";
            content += "<tbody>";
            content += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsData.Tables[2].Rows[0].User_Name + "</td>";
            content += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsData.Tables[2].Rows[0].Region_Name + "</td>";
            content += "<td align='left' ><b>Date Period</b></td><td align='left' >" + $("#txtFrom").val() + "</td></tr>";
            content += "<tr><td align='left' ><b>Employee Name</b></td><td align='left' >" + jsData.Tables[2].Rows[0].Employee_Name + "</td>";
            //            content += "<td align='left' ><b>Division</b></td><td align='left' >" + jsData.Tables[3].Rows[0].Division_Name + "</td>";
            if (jsData.Tables[3].Rows.length > 0) {
                var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[0].Region_Code + "')]");
                divisionName = "";
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {
                        divisionName += dJsonData[j].Division_Name + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }
                    content += "<td align='left' ><b>Division</b></td><td align='left' >" + divisionName + "</td>";
                }
                else {
                    content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                }
            }
            else {
                content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
            }


            content += "<td align='left' ><b>Reporting To</b></td><td align='left' >" + jsData.Tables[2].Rows[0].Manager_Name + "</td></tr>";
            content += "</tbody>";
            content += "</table>";

            content += "<table class='data display datatable'  id ='tblTPReport'>";
            content += "<thead>";
            content += "<tr style='display: none;' id='tblTr'>";
            content += "<th>User Name</th>";
            content += "<th style='display:none'>Employee Name</th>";
            content += "<th style='display:none'>Region Name</th>";
            content += "<th style='display:none'>Reporting To</th>";
            content += "<th style='display:none'>Date Period</th>";

            content += "<th>TPDate</th>";
            content += "<th>CallObjective</th>";
            content += "<th>ActivityName</th>";
            content += "<th>Category</th>";
            content += "<th>CPName</th>";
            content += "<th>Meeting Point </th>";
            content += "<th>Meeting Time </th>";
            content += "<th>WorkPlace</th>";
            content += "<th>SFC</th>";
            content += "<th>Accomp_Name</th>";
            content += "<th>No oF Planned Doctors</th>";
            content += "<th>EnteredDate</th>";
            content += "<th>EnteredBy</th>";
            content += "<th>Remarks</th>";
            content += "<th>Status</th>";
            content += "<th>Approved By</th>"
            content += "<th>Approved/Unapproved Date</th>";
            content += "<th>Approve/Unapprove Reason</th>";

            content += "</tr>";
            var type = '[{ type: "text" }, null, null, null, null,{ type: "date-range" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }';
            type += ',{ type: "text" },{ type: "text" },{ type: "text" },{ type: "number-range" },{ type: "date-range" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }]';
            content += "<tr>";
            content += "<th>User Name</th>";
            content += "<th style='display:none'>Employee Name</th>";
            content += "<th style='display:none'>Region Name</th>";
            content += "<th style='display:none'>Reporting To</th>";
            content += "<th style='display:none'>Date Period</th>";
            content += "<th>TPDate</th>";
            content += "<th>CallObjective</th>";
            content += "<th>ActivityName</th>";
            content += "<th>Category</th>";
            content += "<th>CPName</th>";
            content += "<th>Meeting Point </th>";
            content += "<th>Meeting Time </th>";
            content += "<th>WorkPlace</th>";
            content += "<th>SFC</th>";
            content += "<th>Accomp_Name</th>";
            content += "<th>No oF Planned Doctors</th>";
            content += "<th>EnteredDate</th>";
            content += "<th>EnteredBy</th>";
            content += "<th>Remarks</th>";
            content += "<th>Status</th>";
            content += "<th>Approved By</th>"
            content += "<th>Approved/Unapproved Date</th>";
            content += "<th>Approve/Unapprove Reason</th>";

            content += "</tr>";
            content += "<th colspan= '23' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";

            content += "</thead>";
            content += "<tbody>";

            var date = new Date(year + "-" + month + "-01");
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            for (var dt = firstDay; dt <= lastDay; dt = firstDay.setDate(firstDay.getDate() + 1)) {
                var day = new Date(dt).getDate();
                var month = new Date(dt).getMonth() + 1;
                var year = new Date(dt).getFullYear();

                var details = jsonPath(jsData, "$.Tables[0].Rows[?(@.Day=='" + day + "' & @.Month=='" + month + "' & @.Year=='" + year + "')]");

                if (details != false) {
                    content += "<tr>";
                    content += "<td >";
                    content += jsData.Tables[2].Rows[0].User_Name;
                    content += "</td>";
                    content += "<td style='display:none'>";
                    content += jsData.Tables[2].Rows[0].Employee_Name;
                    content += "</td>";
                    content += "<td style='display:none'>";
                    content += jsData.Tables[2].Rows[0].Region_Name;
                    content += "</td>";
                    content += "<td style='display:none'>";
                    content += jsData.Tables[2].Rows[0].Manager_Name;
                    content += "</td>";

                    content += "<td style='display:none'>" + $("#txtFrom").val() + "</td>";


                    content += "<td>";
                    content += details[0].TP_Date;
                    content += "</td>";

                    if (details[0].Activity_Code != null && details[0].Activity_Code != "") {
                        content += "<td>";
                        content += details[0].Activity_Code;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }
                    if (details[0].Project_Code != null && details[0].Project_Code != "") {
                        content += "<td>";
                        content += details[0].Project_Code;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }
                    if (details[0].Category != null && details[0].Category != "") {
                        content += "<td>";
                        content += details[0].Category;
                        content += "</td>";
                    }
                    else {
                        content += "<td>-</td>  ";
                    }
                    if (details[0].CP_name != null && details[0].CP_name != "") {
                        content += "<td>";
                        content += details[0].CP_name;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>";
                    }
                    /// Added meeting point And Meeting Time
                    if (details[0].Meeting_point != null && details[0].Meeting_point != "") {
                        content += "<td>";
                        content += details[0].Meeting_point;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }

                    if (details[0].Meeting_Time != null && details[0].Meeting_Time != "") {
                        content += "<td>";
                        content += details[0].Meeting_Time;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }

                    /// End meeting point And Meeting Time

                    if (details[0].Work_Area != null && details[0].Work_Area != "") {
                        content += "<td>";
                        content += details[0].Work_Area;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }


                    //tp sfc
                    var sfcDet = jsonPath(jsData, "$.Tables[4].Rows[?(@.TP_Id=='" + details[0].TP_Id + "')]");
                    var scontent = "";

                    if (sfcDet != false && sfcDet != undefined) {
                        for (var s = 0; s < sfcDet.length; s++) {
                            if ($.trim(sfcDet[s].From_Place) != "") {
                                scontent += "<b>" + (s + 1) + " . </b>" + sfcDet[s].From_Place + " <b>to</b> " + sfcDet[s].To_Place + "<br />";
                            }
                        }
                    }

                    content += "<td>" + scontent + "</td>";
                    var accName = "";
                    if (details[0].Accomp_Name != null && details[0].Accomp_Name != "") {
                        accName = "<b>1. </b>" + details[0].Accomp_Name + " <br />";
                    }
                    if (details[0].Accompanist2_Name != null && details[0].Accompanist2_Name != "") {
                        accName += "<b>2. </b>" + details[0].Accompanist2_Name + "<br /> ";
                    }
                    if (details[0].Accompanist3_Name != null && details[0].Accompanist3_Name != "") {
                        accName += "<b>3. </b>" + details[0].Accompanist3_Name + "<br /> ";
                    }
                    if (details[0].Accompanist4_Name != null && details[0].Accompanist4_Name != "") {
                        accName += "<b>4. </b>" + details[0].Accompanist4_Name + "<br /> ";
                    }

                    content += "<td>";
                    content += accName;
                    content += "</td>";
                    var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.TP_Date=='" + details[0].TP_Date + "')]");
                    if (dJsonData != false) {

                        if (dJsonData.length > 0) {
                            // content += "<td>" + dJsonData.length + "</td>";
                            content += "<td align='center' ><span onclick='fnTPDetails(\"" + $("#hdnUserCode").val() + "_" + details[0].TP_Date + "\")' style='text-decoration:underline;cursor:pointer'>" + dJsonData.length + "</span></td>";
                        }
                        else {
                            content += "<td></td>";
                        }
                    }
                    else {
                        content += "<td></td>";
                    }

                    content += "<td>";
                    content += details[0].Entered_Date;
                    content += "</td>";
                    if (details[0].Entered_by != null && details[0].Entered_by != "") {
                        content += "<td>";
                        content += details[0].Entered_by;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }

                    if (details[0].Remarks != null && details[0].Remarks != "") {
                        content += "<td>";
                        content += details[0].Remarks;
                        content += "</td>";
                    }
                    else {
                        content += "<td>-</td>";
                    }

                    if (details[0].Status != null && details[0].Status != "") {
                        content += "<td>";
                        content += details[0].Status;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }
                    //Approved By
                    if (details[0].Tp_Approved_By != null && details[0].Tp_Approved_By != "") {
                        content += "<td>";
                        content += details[0].Tp_Approved_By;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>";
                    }
                    if (details[0].Approved_Date != null && details[0].Approved_Date != "") {
                        content += "<td>";
                        content += details[0].Approved_Date;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }

                    if (details[0].Unapprove_Reason != null && details[0].Unapprove_Reason != "") {
                        content += "<td>";
                        content += details[0].Unapprove_Reason;
                        content += "</td>";
                    }
                    else {
                        content += "<td>-</td>";
                    }

                    content += "</tr>";
                }
                else {
                    var details = jsonPath(jsData, "$.Tables[5].Rows[?(@.Day=='" + day + "' & @.Month=='" + month + "' & @.Year=='" + year + "')]");
                    if (details != false) {
                        if (details[0].Type == "S") {
                            content += "<tr>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='display:none'></td>";
                            content += "<td style='display:none'></td>";
                            content += "<td style='display:none'></td>";

                            content += "<td style='display:none'></td>";

                            content += "<td style='background: #efefef;'>" + details[0].Date + "</td>";

                            content += "<td style='background: #efefef;'> - Sunday</td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";

                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";

                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";

                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "</tr>";
                        }
                        else {
                            content += "<tr>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='display:none;background: #efefef;'></td>";
                            content += "<td style='display:none;background: #efefef;'></td>";

                            content += "<td style='display:none;background: #efefef;'></td>";
                            content += "<td style='display:none;background: #efefef;'></td>";

                            content += "<td style='background: #efefef;'>" + details[0].Date + "</td>";
                            content += "<td style='background: #efefef;'> - Holiday - </td>";

                            content += "<td style='background: #efefef;'>" + details[0].Holiday + "</td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";

                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";

                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";

                            content += "<td style='background: #efefef;'></td>";
                            content += "<td style='background: #efefef;'></td>";
                            content += "</tr>";
                        }
                    }
                }
            }


            //for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
            //    content += "<tr>";
            //    content += "<td >";
            //    content += jsData.Tables[2].Rows[0].User_Name;
            //    content += "</td>";
            //    content += "<td style='display:none'>";
            //    content += jsData.Tables[2].Rows[0].Employee_Name;
            //    content += "</td>";
            //    content += "<td style='display:none'>";
            //    content += jsData.Tables[2].Rows[0].Region_Name;
            //    content += "</td>";
            //    content += "<td style='display:none'>";
            //    content += jsData.Tables[2].Rows[0].Manager_Name;
            //    content += "</td>";

            //    content += "<td style='display:none'>" + $("#txtFrom").val() + "</td>";
            //    content += "<td>";
            //    content += jsData.Tables[0].Rows[i].TP_Date;
            //    content += "</td>";
            //    if (jsData.Tables[0].Rows[i].Activity_Code != null && jsData.Tables[0].Rows[i].Activity_Code != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Activity_Code;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }
            //    if (jsData.Tables[0].Rows[i].Project_Code != null && jsData.Tables[0].Rows[i].Project_Code != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Project_Code;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }
            //    content += "<td>";
            //    content += jsData.Tables[0].Rows[i].Category;
            //    content += "</td>";
            //    if (jsData.Tables[0].Rows[i].CP_name != null && jsData.Tables[0].Rows[i].CP_name != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].CP_name;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }
            //     /// Added meeting point And Meeting Time
            //    if (jsData.Tables[0].Rows[i].Meeting_point != null && jsData.Tables[0].Rows[i].Meeting_point != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Meeting_point;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }

            //    if (jsData.Tables[0].Rows[i].Meeting_Time != null && jsData.Tables[0].Rows[i].Meeting_Time != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Meeting_Time;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }

            //    /// End meeting point And Meeting Time

            //    if (jsData.Tables[0].Rows[i].Work_Area != null && jsData.Tables[0].Rows[i].Work_Area != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Work_Area;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }


            //    //tp sfc
            //    var sfcDet = jsonPath(jsData, "$.Tables[4].Rows[?(@.TP_Id=='" + jsData.Tables[0].Rows[i].TP_Id + "')]");
            //    var scontent = "";

            //    if (sfcDet != false && sfcDet != undefined) {
            //        for (var s = 0; s < sfcDet.length; s++) {
            //            if ($.trim(sfcDet[s].From_Place) != "") {
            //                scontent += "<b>" + (s + 1) + " . </b>" + sfcDet[s].From_Place + " <b>to</b> " + sfcDet[s].To_Place + "<br />";
            //            }
            //        }
            //    }

            //    content += "<td>" + scontent + "</td>";
            //    if (jsData.Tables[0].Rows[i].Accomp_Name != null && jsData.Tables[0].Rows[i].Accomp_Name != "") {
            //        accName = "<b>1. </b>" + jsData.Tables[0].Rows[i].Accomp_Name + " <br />";
            //    }
            //    if (jsData.Tables[0].Rows[i].Accompanist2_Name != null && jsData.Tables[0].Rows[i].Accompanist2_Name != "") {
            //        accName += "<b>2. </b>" + jsData.Tables[0].Rows[i].Accompanist2_Name + "<br /> ";
            //    }
            //    if (jsData.Tables[0].Rows[i].Accompanist3_Name != null && jsData.Tables[0].Rows[i].Accompanist3_Name != "") {
            //        accName += "<b>3. </b>" + jsData.Tables[0].Rows[i].Accompanist3_Name + "<br /> ";
            //    }
            //    if (jsData.Tables[0].Rows[i].Accompanist4_Name != null && jsData.Tables[0].Rows[i].Accompanist4_Name != "") {
            //        accName += "<b>4. </b>" + jsData.Tables[0].Rows[i].Accompanist4_Name + "<br /> ";
            //    }

            //    content += "<td>";
            //    content += accName;
            //    content += "</td>";
            //    var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.TP_Date=='" + jsData.Tables[0].Rows[i].TP_Date + "')]");
            //    if (dJsonData != false) {

            //        if (dJsonData.length > 0) {
            //            // content += "<td>" + dJsonData.length + "</td>";
            //            content += "<td align='center' ><span onclick='fnTPDetails(\"" + $("#hdnUserCode").val() + "_" + jsData.Tables[0].Rows[i].TP_Date + "\")' style='text-decoration:underline;cursor:pointer'>" + dJsonData.length + "</span></td>";
            //        }
            //        else {
            //            content += "<td></td>";
            //        }
            //    }
            //    else {
            //        content += "<td></td>";
            //    }

            //    content += "<td>";
            //    content += jsData.Tables[0].Rows[i].Entered_Date;
            //    content += "</td>";
            //    if (jsData.Tables[0].Rows[i].Entered_by != null && jsData.Tables[0].Rows[i].Entered_by != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Entered_by;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }

            //    if (jsData.Tables[0].Rows[i].Status != null && jsData.Tables[0].Rows[i].Status != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Status;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }

            //    if (jsData.Tables[0].Rows[i].Approved_Date != null && jsData.Tables[0].Rows[i].Approved_Date != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Approved_Date;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>  ";
            //    }

            //    if (jsData.Tables[0].Rows[i].Unapprove_Reason != null && jsData.Tables[0].Rows[i].Unapprove_Reason != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Unapprove_Reason;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>";
            //    }
            //    if (jsData.Tables[0].Rows[i].Remarks != null && jsData.Tables[0].Rows[i].Remarks != "") {
            //        content += "<td>";
            //        content += jsData.Tables[0].Rows[i].Remarks;
            //        content += "</td>";
            //    }
            //    else {
            //        content += "<td></td>";
            //    }
            //    content += "</tr>";
            //}
            content += "</tbody>";
            content += "</table>";

            $("#divReport").html(content);
            $("#divPrint").html(content);
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tblTPReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true
                        , "sDom": 'T<"clear">lfrtip',
                    "aaSorting": [[5, 'asc']],
                })
                .dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            $("#divReport").show();
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnToggleTreea() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnTPDetails(val) {
    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetTpDetails',
        type: "POST",
        data: 'UserCode=' + val.split('_')[0] + '&date=' + val.split('_')[1],
        success: function (response) {

            jsData = eval('(' + response + ')');

            var content = "";
            content += "<table class='data display datatable' id='tbl_Details'>";
            content += "<thead>";
            content += "<tr style='display: none;' id='tblTrpopup'>";
            content += "<th>MDL NO</th>";
            content += "<th>Doctor Name</th>";
            content += "<th>Speciality</th>";
            //            content += "<th>Category</th>";
            content += "</tr>";
            var type = '[{ type: "text" }, { type: "text" }, { type: "text" }]';
            content += "<tr>";
            content += "<th>MDL NO</th>";
            content += "<th>Doctor Name</th>";
            content += "<th>Speciality</th>";
            //            content += "<th>Category</th>";
            content += "</tr>";
            content += "<th colspan= '3' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapopup()'>Show Filter</span></th>";
            content += "</thead>";
            content += "<tbody>";
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                content += "<tr>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].MDL_Number;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Customer_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Speciality_Name;
                content += "</td>";
                //                content += "<td>";
                //                content += jsData.Tables[0].Rows[i].Category_Name;
                //                content += "</td>";
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";

            $("#divModel").html(content);
            $("#divsubPrint").html(content);
            var jsonType = eval(type);
            //  if ($.fn.dataTable) { $('#tbl_Details').dataTable({ "sPaginationType": "full_numbers" }); };
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_Details').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };
            $("#divModel").show();
            //fninializePrint("divPrint", "ifrmPrint");
            fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
            ShowModalPopup('modal');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}


function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

function fnToggleTreeapopup() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrpopup").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrpopup").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

//******************************************************TargetReport*********************************************//
//******************************************************TargetReport*********************************************//
function GetTarget() {
    ShowModalPopup("dvloading");
    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetTargetDetails',
        type: "POST",
        data: "RegionCode=" + $("#hdnRegionCode").val(),
        success: function (response) {

            jsData = eval('(' + response + ')');

            var content = "";

            content += "<table class='data display datatable' id='tbl_Target'>";
            content += "<thead>";
            content += "<tr style='display: none;' id='tblTr'>";
            content += "<th>Employee Name</th>";
            content += "<th>User Name</th>";
            content += "<th>User Type</th>";
            content += "<th>Territory Name</th>";
            content += "<th>Division</th>";
            content += "<th>Target Name</th>";
            content += "<th>Product Name</th>";
            content += "<th>Target Qty</th>";
            content += "<th>Month</th>";
            content += "<th>Target Amount</th>";
            content += "<th>Entered Date</th>";
            content += "<th>Entered By</th>";
            content += "</tr>";

            var type = '[{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "text" }';
            type += ',{ type: "number-range" },{ type: "text" },{ type: "number-range" },{ type: "date-range" },{ type: "date-range" }]';
            content += "<tr>";
            content += "<th>Employee Name</th>";
            content += "<th>User Name</th>";
            content += "<th>User Type</th>";
            content += "<th>Territory Name</th>";
            content += "<th>Division</th>";
            content += "<th>Target Name</th>";
            content += "<th>Product Name</th>";
            content += "<th>Target Qty</th>";
            content += "<th>Month</th>";
            content += "<th>Target Amount</th>";
            content += "<th>Entered Date</th>";
            content += "<th>Entered By</th>";
            content += "</tr>";
            content += "<th colspan= '12' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
            content += "</thead>";
            content += "<tbody>";
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                content += "<tr>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Employee_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].User_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].User_Type_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Region_Name;
                content += "</td>";

                if (jsData.Tables[0].Rows[i].Division_Name != null && jsData.Tables[0].Rows[i].Division_Name != "") {
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Division_Name;
                    content += "</td>";
                }
                else {
                    content += "<td></td>  ";
                }
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Target_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Product_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Target_Qty;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Target_Month;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Target_Amount;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Entered_Date;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Entered_By;
                content += "</td>";
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
            var jsonType = eval(type);

            $("#divReport").html(content);
            $("#divPrint").html(content);
            //            if ($.fn.dataTable) { $('#tbl_Target').dataTable({ "sPaginationType": "full_numbers" }); };
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_Target').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            $("#divReport").show();
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}
function fnToggleTreea() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

//******************************************************Target Regionwise Report*********************************************//

function fntargetname() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GettargetName',
        data: 'A',
        success: function (response) {
            var tableContent = "";
            jsData = eval('(' + response + ')');
            $('option', $("#ddltargetname")).remove();
            $('#ddltargetname').append($('<option></option>').val("0").html("-Select Target-"));
            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $('#ddltargetname').append("<option value='" + jsData.Tables[0].Rows[i].Target_Code + "'>" + jsData.Tables[0].Rows[i].Target_Name + "</option>");
                    // $("#ddltargetname").append(new Option(jsData.Tables[0].Rows[i].Target_Name, jsData.Tables[0].Rows[i].Target_Code));

                }
            }
        }
    });

}
function fnTargetRegionReport() {
    if ($("#ddltargetname").val() == "0") {
        fnMsgAlert('info', 'Target Report', 'Please Select The TargetName.');
        return false;
    }
    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetTargetRegionWise',
        type: "POST",
        data: "UserCode=" + $("#hdnRegionCode").val() + "&TargetName=" + $("#ddltargetname").val(),
        success: function (response) {
            jsData = eval('(' + response + ')');
            var totalQty = "0";
            var totalAmount = "0";
            var productArr = new Array();
            var monthAr = new Array();
            var content = "", divisionName = "";
            var tableContent = "";
            if (jsData.Tables[4].Rows.length > 0) {
                content += "<table cellspacing='0' cellpadding='0' class='data display datatable'  id='tblHeader' >";
                content += "<thead><tr>";
                content += "<th align='left' colspan='6' >User Details</th></tr></thead>";
                content += "<tbody>";
                content += "<tr><td align='left'><b>User Name</b></td><td align='left' >" + jsData.Tables[4].Rows[0].User_Name + "</td>";
                content += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsData.Tables[4].Rows[0].Region_Name + "</td>";
                content += "<td align='left' ><b>Target Name</b></td><td align='left' >" + jsData.Tables[6].Rows[0].Target_Name + "</td></tr>";
                content += "<tr><td align='left' ><b>Employee Name</b></td><td align='left' >" + jsData.Tables[4].Rows[0].Employee_Name + "</td>";


                if (jsData.Tables[5].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[5].Rows[?(@.Region_Code=='" + jsData.Tables[4].Rows[0].Region_Code + "')]");

                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            divisionName += dJsonData[j].Division_Name + ",";
                        }

                        if (divisionName != "") {
                            divisionName = divisionName.substring(0, divisionName.length - 1);
                        }
                        content += "<td align='left' ><b>Division</b></td><td align='left' >" + divisionName + "</td>";
                    }
                    else {
                        content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                    }
                }
                else {
                    content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                }

                var tableContentH = "<td align='left'>" + jsData.Tables[4].Rows[0].User_Name + "</td>";
                tableContentH += "<td align='left'>" + jsData.Tables[4].Rows[0].Region_Name + "</td>";
                tableContentH += "<td align='left'>" + jsData.Tables[4].Rows[0].Employee_Name + "</td>";
                tableContentH += "<td align='left'>" + divisionName + "</td>";
                tableContentH += "<td align='left'>" + jsData.Tables[4].Rows[0].DOJ + "</td>";
                tableContentH += "<td align='left'>" + jsData.Tables[4].Rows[0].Manager_Name + "</td>";
                tableContentH += "<td align='left'>" + jsData.Tables[4].Rows[0].Manager_Region_Name + "</td>";


                //            content += "<td align='left' ><b>Division</b></td><td align='left' >" + jsData.Tables[5].Rows[0].Division_Name + "</td>";
                content += "<td align='left' ><b>Reporting To</b></td><td align='left' >" + jsData.Tables[4].Rows[0].Manager_Name + "</td></tr>";
                content += "</tbody>";
                content += "</table>";

                $("#divHeader").html(content);
                tableContent += content;
                content = "";
                content += "<table class='data display datatable' id='tbl_Target_product'><thead>";
                content += "<tr>";
                content += "<th align='left' rowspan='2'>User Name</th>";
                content += "<th align='left' rowspan='2'>Region Name</th>";
                content += "<th align='left' rowspan='2'>Employee Name</th>";
                content += "<th align='left' rowspan='2'>Division Name</th>";
                content += "<th align='left' rowspan='2'>DOJ</th>";
                content += "<th align='left' rowspan='2' >Manager Name</th>";
                content += "<th align='left' rowspan='2'>Manager Region Name</th>";

                content += "<th rowspan='2'>Product Name</th>";
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    if ($.inArray(jsData.Tables[0].Rows[i].Product_Code, productArr) == -1) {
                        productArr.push(jsData.Tables[0].Rows[i].Product_Code);
                    }
                    if ($.inArray(jsData.Tables[0].Rows[i].Month, monthAr) == -1) {
                        monthAr.push(jsData.Tables[0].Rows[i].Month);
                        content += "<th colspan='2' align='center'>" + jsData.Tables[0].Rows[i].Month + "</th>";
                    }
                }
                content += "<th colspan='2' align='center'>Total</th></tr>";
                content += "<tr>";
                for (var z = 0; z <= monthAr.length; z++) {
                    content += "<th><b>Unit</b></th>";
                    content += "<th><b>Value</b></th>";
                }
                content += "</tr></thead><tbody>";
                for (var j = 0; j < productArr.length; j++) {
                    var productJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Product_Code=='" + productArr[j] + "')]");
                    content += "<tr>";
                    content += tableContentH;
                    content += "<td>" + productJson[0].Product_Name + "</td>";
                    if (productJson != false) {
                        for (var m = 0; m < monthAr.length; m++) {
                            var monthJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Month=='" + monthAr[m] + "' && @.Product_Code=='" + productArr[j] + "')]");
                            if (monthJson != false) {
                                content += "<td>" + monthJson[0].Target_Qty + "</td>";
                                content += "<td>" + monthJson[0].Target_Amount + "</td>";
                                totalQty = parseFloat(totalQty) + parseFloat(monthJson[0].Target_Qty);
                                totalAmount = parseFloat(totalAmount) + parseFloat(monthJson[0].Target_Amount);
                            }
                            else {
                                content += "<td>0.00</td>";
                                content += "<td>0.00</td>";
                            }
                        }
                        // Total Unit nad Value
                        if (jsData.Tables[2].Rows.length > 0) {
                            var totalProductJson = jsonPath(jsData, "$.Tables[2].Rows[?(@.Product_Code=='" + productArr[j] + "')]");
                            if (totalProductJson != false) {
                                content += "<td>" + totalProductJson[0].Target_Qty + "</td>";
                                content += "<td>" + totalProductJson[0].Target_Amount + "</td>";
                            }
                        }
                    }
                    content += "</tr>";

                }
                content += "<tr><td  align='right'></td><td  align='right'></td><td  align='right'></td><td  align='right'></td><td  align='right'></td><td  align='right'></td><td  align='right'></td><td align='right'><b>Total</b></td>";
                for (var a = 0; a < monthAr.length; a++) {
                    if (jsData.Tables[1].Rows.length > 0) {
                        var disMonthJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Month=='" + monthAr[a] + "')]");
                        if (disMonthJson != false) {
                            content += "<td></td>";
                            content += "<td>" + disMonthJson[0].Target_Amount + "</td>";
                        }
                    }
                }

                content += "<td></td>";
                content += "<td><b>" + parseFloat(totalAmount).toFixed(0) + "</b></td>";
                content += "</tr>";
                content += "</tbody></table>";
                tableContent += content;
                $("#divPrint").html(tableContent);
                $("#divReport").html(content);
                if ($.fn.dataTable) {
                    $('#tbl_Target_product').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                };
                $('#dvPrint').remove();
                fninializePrint("divPrint", "ifrmPrint", "divReport");

                $("#divReport").show();
            }
            else {
                fnMsgAlert('info', 'Report', 'No data found.');
                $("#spnTreeToggle").show();
                HideModalPopup("dvloading");

            }

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}

function fnValidatePrivilege(regionCode) {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetUserPrivileges',
        data: "RegionCode=" + regionCode,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var dJsonData = jsonPath(jsData, "$.Tables[0].Rows[?(@.Privilege_Name=='DCR_DOCTOR_VISIT_MODE')]");
            if (dJsonData != false) {
                if (dJsonData[0].Privilege_Value_Name.toUpperCase() == "AM_PM") {
                    $("#trVisitMode").hide();
                }
                else if (dJsonData[0].Privilege_Value_Name.toUpperCase() == "VISIT_TIME_MANDATORY" || dJsonData[0].Privilege_Value_Name.toUpperCase() == "VISIT_TIME") {
                    $("#trVisitMode").show();
                }
                else {
                    $("#trVisitMode").hide();
                }

            }
            else {
                $("#trVisitMode").hide();
            }
        }
    });
}

///


function fnGetKYDConfigValues() {
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4KYD/GetConfigurationValues',
        type: "POST",
        async: false,
        success: function (jsData) {
            if (jsData != null && jsData != '') {
                var jsonforDesignation = jsData[0].configvalueforDesignation;
                var jsonDisplaycolumn = jsData[0].Config_DisplayColumns;
                var jsonMandatorycolumn = jsData[0].Config_MandatoryColumns;
                var jsonDuplicatecheckvalue = jsData[0].Config_DuplicatecheckColumn;

                var Displaycolumns = new Array();
                var MandatoryColumns = new Array();
                var Duplicatecheckvalue = new Array();

                Displaycolumns = jsonDisplaycolumn.split(',');
                MandatoryColumns = jsonMandatorycolumn.split(',');
                Duplicatecheckvalue = jsonDuplicatecheckvalue.split(',');

                jsonCheckDuplicate_g = Duplicatecheckvalue;
                jsonMandatory_g = MandatoryColumns;
                jsonDisplayColumns_g = Displaycolumns;
            }
            HideModalPopup('dvLoading');
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            HideModalPopup('dvLoading');
        }
    });

}

function fnKYDCompletionStatus() {

    $('#regiontree').hide();
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');
    $("#spnTreeToggle").html('Show Tree');

    $("#divHideHeader").show();
    $('#divHideHeader1').hide();
    $('#divImport').hide();
    $("#divSummary").html("");
    $('#dvSubprint').hide();
    $('#dvExcelPrint').hide();
    var regionCode = $('#hdnRegionCode').val();
    var tablecontent = "", options = "";

    //GET OPTIONS
    var viewFormat = $("input[name='rptOptions']:checked").val();
    ShowModalPopup("dvloading");

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetKYDCompletionStatus',
        data: 'regionCode=' + regionCode + '&viewFormat=' + viewFormat,
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $("#divReport").html(response);
                $("#divdocMasterprint").html(response);
                fnDisplayColumns(jsonDisplayColumns_g);
                //* Added
                $('#divImport').show();
                // tablecontent += "<lable style='font-weight:bold;'><span style='color:red;font-weight: bold;font-size: 20px;'>*</span>Values indicates that there are a some doctors without any category and hence the mismatch between the sum of individual categories and Total.</lable>";
                $('#divImport').html(tablecontent);
                $("#spnTreeToggle").show();
                $("#divReport").show();
                $("#dvPrint").show();
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
                $('#vacantRegion').html("Your selected (" + RegionNameTitle + ") is vacant")
                if (viewFormat == 2) {
                    $('#dvPrint').hide();
                }
                fninializePrint("divdocMasterprint", "ifrmPrint", "divReport");
                HideModalPopup("dvloading");

            }
            else {
                fnMsgAlert('info', 'Report', 'No data found.');
                $("#spnTreeToggle").show();
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            $("#spnTreeToggle").show();
            HideModalPopup("dvloading");
        }
    });
}

var Registration_No = 'REGISTRATION_NO', Local_Area = 'LOCAL_AREA', Mobile = 'MOBILE', Pin_Code = 'PIN_CODE', Place_Type = 'PLACE_TYPE', Hospital_Name = 'HOSPITAL_NAME';
function fnDisplayColumns(jsonDisplaycolumn) {
    for (var s = 0 ; s < jsonDisplaycolumn.length ; s++) {
        if (jsonDisplaycolumn[s] == Registration_No) {
            $('#tdRegno').removeClass('cls_DisplayColumn');
            $('.clsRegNo').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Pin_Code) {
            $('#tdPinCode').removeClass('cls_DisplayColumn');
            $('.clsPincode').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Local_Area) {
            $('#tdlocalared').removeClass('cls_DisplayColumn');
            $('.clsLocalarea').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Mobile) {
            $('#tdmobileno').removeClass('cls_DisplayColumn');
            $('.clsMobile').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Place_Type) {
            $('#tdmedcoun').removeClass('cls_DisplayColumn');
            $('.clsMedCou').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Hospital_Name) {
            $('#tdHospitalNamr').removeClass('cls_DisplayColumn');
            $('.clsHospitalName').removeClass('cls_DisplayColumn');
        }
    }
}


//---------------------------Start of DRBondDCReport Function-----------------------------------------------------------//

function fnDrBondDCReport() {

    $('#divDReport').html("")
    var options = "";

    //GET OPTIONS
    if ($('#optViewInScreen').attr('checked') == "checked") {
        options = "S";
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        options = "E";
    }

    ShowModalPopup("dvloading");

    var userCodes = "";

    for (var i = 0; i < selKeys.length; i++) {
        userCodes += selKeys[i] + ',';
    }



    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDRBondDCReportDetails',
        data: "userCode=" + userCodes + "&Option=" + options,
        success: function (result) {
            if (result != "No Data Found") {
                $('#divDReport').html(result);
            }
            else {
                fnMsgAlert('info', 'DRBondDC Report', 'No data Found');
            }
            if (userCodes == "") {
                fnMsgAlert('info', 'DRBondDC Report', 'Select any one user');
            }
            HideModalPopup("dvloading");
        }
    });

    function fnGetHospitalURl(val) {

        if (val != null && val != "") {
            window.open(val, '_blank');
        }

    }
    //------------------------------------End of DRBondDCReport Function-----------------------------------------------------------//
}

function fnEditRequestforCliamCode(editedValues) {
    debugger;
    //dvRightPanel
    $("#spnClaim").html('Show Details');
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#dvLeftPanel').hide();
    $('#dvRightPanel').show();
    $('#dvExpenseClaimDetails').css('display', 'block');
    $('#divdivider').css('display', 'block');

    var claimCode = editedValues.split('_')[0];
    var userCode = editedValues.split('_')[1];
    var requestName = editedValues.split('_')[2];
    var favUserCode = editedValues.split('_')[3];
    var statusCode = editedValues.split('_')[4];
    var moveOrder = editedValues.split('_')[5];
    var cycleCode = editedValues.split('_')[6];
    var requestCode = editedValues.split('_')[7];
    var claimUserTypeName = editedValues.split('_')[8];
    var claimdatetime = editedValues.split('_')[9];
    var screenMode = editedValues.split('_')[10];

    $('#hdnStatusCode').val(statusCode);
    $('#hdnCycleCode').val(cycleCode);
    $('#hdnMoveOrder').val(moveOrder);
    $('#hdnFavouringUsercode').val(favUserCode);
    $('#hdnExpenseclaimcode').val(claimCode);
    $('#hdnClaimDate').val(claimdatetime);
    $("#hdnScreenMode").val(screenMode);
    expensePrivilege_g = screenMode;
    if (screenMode.toUpperCase() == "MONTHLY") {
        $("#dvExpClaimMonthlyDetails").css("display", "");
        $(".monthDcrHide").css("vertical-align", "middle");
    }
    else {
        $("#dvExpClaimMonthlyDetails").css("display", "none");
    }
    //fnGetPrivilegeforExpense(favUserCode);

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/Reports/GetClaimRequestDetailsforClaimCode',
        async: 'false',
        data: "claimCode=" + claimCode + "&userCode=" + userCode + "&requestName=" + requestName + "&favouringUserCode=" + favUserCode + "&requestCode=" + requestCode + "",
        success: function (result) {

            if (result != '') {
                if (result.split('$').length > 1) {
                    var ar = result.split('$');
                    var claimJson = eval('(' + ar[3] + ')');
                    claimJson_g = claimJson;
                    debugger;
                    fnFillDetails(claimJson, requestName, ar[1], userCode);
                    $('#dvClaimDetails').html(ar[0]);
                    if (ar[5].length>0) {
                        $('#dvAddlAprClaimDetails').html(ar[5]);
                    }
                    else {
                        $("#dvAddlAprClaimDetailsPanel").hide();
                    }
                    if (screenMode.toUpperCase() == "MONTHLY") {
                        $(".monthDcrHide").css("vertical-align", "middle");
                    }
                    else {
                        $(".monthDcrHide").css("display", "none");
                    }
                    $("#dvClaimHistoryPopUp").html(ar[2]);
                    // $("#dvExpenseTypeAmountDetail").html(ar[4]);
                    //$("#dvRightPanel").unblock();
                    $('.clsCheckSpecial').blur(function () { fnCheckBillNumSpecialChar(this); });
                    $('.clsCheckRemarks').blur(function () { fnCheckAdminRemarksSpecialChar(this); });
                    // $('#dvExpenseTypeAmount').hide();
                    if (ar[1] == "REQUEST_CUSTOMER_FOR") {
                        debugger;
                        $('#dvExpenseTypeAmount').hide();
                        $('#dvExpenseTypeAmountDetail').hide();
                        $('#superscript').hide();
                        $('#ItemWiseDeduction').hide();
                        $('#spnItemwiseDeduction').hide();
                        $("#dvExpDetails").hide();
                        $("#superscript").hide();
                        claimTypeCRM = "REQUEST_CUSTOMER_FOR";

                    }
                    else {
                        $("#superscript").show();
                        $("#dvExpDetails").show();
                        $("#dvExpDCRDetails").hide();
                        fnExpandSFCDetails();

                    }
                    fnExpandItemwiseDetailsTotal();
                }
            }
        },
        error: function () {
            $("#dvRightPanel").unblock();
        },
        complete: function () {
            debugger;
            $("#main").unblock();
            //fnGetStatus(cycleCode, moveOrder, claimUserTypeName);
            fnGetClosedStatus(claimCode, cycleCode, moveOrder, claimUserTypeName);
            $("#dvExpenseClaimDetails").attr('tabindex', 1).focus();

        }
    });

}

function fnFillDetails(claimJson, requestName, claimType, userCode) {

    if (claimJson != '') {
        if (claimJson[0].lstUser != '') {

            $('#spnEmployeeNo').html(claimJson[0].lstUser[0].Employee_Number);
            $('#spnReportingUserName').html(claimJson[0].lstUser[0].Reporting_Manager_Name);
            $('#spnClaimUserName').html(claimJson[0].lstUser[0].User_Name);
            $('#spnReportingRegionName').html(claimJson[0].lstUser[0].Reporting_Manager_Region_Name);
            $('#spnEmployeeName').html(claimJson[0].lstUser[0].Employee_Name);
            $('#spnEmpAccountNo').html(claimJson[0].lstUser[0].Acc_No);
            $('#spnRegionName').html(claimJson[0].lstUser[0].Region_Name);
            $('#spnMobileNo').html(claimJson[0].lstUser[0].User_Mobile_Number);
            $('#spnDesigantion').html(claimJson[0].lstUser[0].User_Type_Name);

        }
        var tblContent = "";
        var Rem_By_Usr = "";

        tblContent += "<table id='tblRemarks'>";
        if (claimJson[0].lstClaimRemarks != '') {
            for (var i = 0; i < claimJson[0].lstClaimRemarks.length; i++) {
                if (claimJson[0].lstClaimRemarks[i].Remarks_By_User == undefined) {
                    Rem_By_Usr = "";
                }
                else
                {
                    Rem_By_Usr = claimJson[0].lstClaimRemarks[i].Remarks_By_User;
                }
                tblContent += "<tr><td><div class='col-lg-12'>";
                tblContent += "<div class='col-lg-12' style='font-size: 13px;'><span class='user'></span>" + claimJson[0].lstClaimRemarks[i].User_Name
                                                        + " </div><div class='dvEnteredRemarks col-lg-12'>"
                                                            + Rem_By_Usr + "</div></div></td> </tr>";
            }
        }
        tblContent += "<tr><td><div class='col-lg-12'>";
        tblContent += "<div class='col-lg-12' style='font-size: 13px;'><span class='user'></span>" + $("#spnUser").html().split('(')[0] +
            //" | " + curRegionName + 
            "</div> ";
        //tblContent += "<div  class='col-lg-12' style='font-size: 13px;'> <textarea id='txtAdminRemarks' class='form-group' maxlength='1000'></textarea></div></div></td> </tr>";
        tblContent += "</table>";
        $('#dvConRemarks').html(tblContent);
        if (claimJson[0].lstClaimHeader != '') {
            $("#hdnExpType").val(claimType.toUpperCase());
            $('#dvClaimCode').html(claimJson[0].lstClaimHeader[0].Claim_Code);
            $('#dvClaimStatus').html('<div class="col-lg-2">Status Name : </div> <div id="dvSName" class="col-lg-2">' + claimJson[0].lstClaimHeader[0].Status_Name + '</div>'
                + '<div class="col-lg-3"> <a onclick="fnShowHistory();" style="cursor:pointer;">Status History</a></div>' + '<div class="col-lg-3"> <a id="lnkShowDedctionDetailsEdit" onclick="fnOpenDeductionDetailPopUp(\'' + claimJson[0].lstClaimHeader[0].Claim_Code + '\',\'' + userCode + '\');" style="cursor:pointer;">Show Deduction Detail</a></div>');
            $("#spnItemwiseDeduction").html(parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction).toFixed(2));
            $("#txtOtherDeduction").val(parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction).toFixed(2));
            $("#spnTotalClaimAmount").html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
            var totalDeduction = parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction) + parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction);
            $('#spnTotalDeductionAmount').html(parseFloat(totalDeduction).toFixed(2));

            $("#spnTotalApprovedAmount").html(parseFloat(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount) - parseFloat(totalDeduction)).toFixed());

            if (claimType.toUpperCase() == "FIELD_EXPENSE_REQUEST_FOR") {
                $("#lnkShowDedctionDetailsEdit").show();
                $('#trDcrDate').show();
                $("#dvDeductionPanel").show();
                $("#dvClaimDetailsPanel").show();
                $('#dvClaimHeaderPanel').show();
                $('#tdDcrDateTitle').show();
                $('#tdDcrDate').show();
                $('#tdTotalDeductionTitle').show();
                $('#tdTotalDeduction').show();
                $('#spnDcrDate').html(claimJson[0].lstClaimHeader[0].Date_From + ' to ' + claimJson[0].lstClaimHeader[0].Date_To);
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
                var totalDeduction = parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction) + parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction);
                $('#txtOtherDeductionAmount').val('0.0');
                if (claimJson[0].lstClaimHeader[0].Order_No != "1") {
                    $('#txtOtherDeductionAmount').val(parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction));
                }

                $('#spnTotalDeduction').html(parseFloat(totalDeduction).toFixed(2));
                $('#spnApprovedAmount').html(parseFloat(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount) - parseFloat(totalDeduction)).toFixed(2));
            }
            else if (claimType.toUpperCase() == "REQUEST_CUSTOMER_FOR") {
                $("#lnkShowDedctionDetailsEdit").hide();
                $('#tdDcrDateTitle').hide();
                $('#tdDcrDate').hide();
                $("#dvDeductionPanel").show();
                $("#dvClaimDetailsPanel").show();
                $('#dvClaimHeaderPanel').show();
                $('#tdTotalDeductionTitle').show();
                $('#tdTotalDeduction').show();
                $('#spnDcrDate').html(claimJson[0].lstClaimHeader[0].Date_From + ' to ' + claimJson[0].lstClaimHeader[0].Date_To);
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
                $('#txtOtherDeductionAmount').val('0.0');
                var totalDeduction = parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction) + parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction);
                $('#txtOtherDeductionAmount').val(parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction).toFixed(2));
                $('#spnTotalDeduction').html(parseFloat(totalDeduction).toFixed(2));
                $('#spnApprovedAmount').html(parseFloat(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount) - parseFloat(totalDeduction)).toFixed(2));
            }
            else {
                $("#dvDeductionPanel").hide();
                $("#dvClaimDetailsPanel").hide();
                $('#dvClaimHeaderPanel').hide();
                $('#tdDcrDateTitle').hide();
                $('#tdDcrDate').hide();
                $('#tdTotalDeductionTitle').hide();
                $('#tdTotalDeduction').hide();
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
            }
            $('.clsCheckSpecial').blur(function () { fnCheckBillNumSpecialChar(this); });
            $('.clsCheckRemarks').blur(function () { fnCheckAdminRemarksSpecialChar(this); });
        }
    }
}

function fnExpandSFCDetails() {
    debugger;
    if ($("#dvExpDCRDetails").is(':visible')) {
        $("#dvExpDCRDetails").hide();
        $("#aDCRExpDetails").html('Show');
    }
    else {
        fnShowDCRExpenseDetails();
        $("#aDCRExpDetails").html('Hide');
    }
}
function fngetMonthNumberFromArray(monthName) {
    if (monthName.toUpperCase() == "01") {
        return "JAN";
    }
    if (monthName.toUpperCase() == "02") {
        return "FEB";
    }
    if (monthName.toUpperCase() == "03") {
        return "MAR";
    }
    if (monthName.toUpperCase() == "04") {
        return "APR";
    }
    if (monthName.toUpperCase() == "05") {
        return "MAY";
    }
    if (monthName.toUpperCase() == "06") {
        return "JUN";
    }
    if (monthName.toUpperCase() == "07") {
        return "JUL";
    }
    if (monthName.toUpperCase() == "08") {
        return "AUG";
    }
    if (monthName.toUpperCase() == "09") {
        return "SEP";
    }
    if (monthName.toUpperCase() == "10") {
        return "OCT";
    }
    if (monthName.toUpperCase() == "11") {
        return "NOV";
    }
    if (monthName.toUpperCase() == "12") {
        return "DEC";
    }
}

function fnShowDCRExpenseDetails() {
    debugger;
    //if ($("#dvExpDCRDetails").is(':visible')) {
    //    //$("#aDCRExpDetails").hide();
    //    $("#aDCRExpDetails").html('Hide');
    //}
    //else {
    //    debugger;
    //    //    $("#dvExpDCRDetails").show();
    //    //    $("#aExpDetails").html('Hide');
    //    //}
    var favoringUserCode = $('#hdnFavouringUsercode').val();
    var claimCode = $('#hdnExpenseclaimcode').val();
    var claimDate = $('#hdnClaimDate').val();

    var month = claimDate.split('/')[1];
    var year = claimDate.split('/')[2];
    var a = claimDate.toUpperCase().split('/');
    //a[1] = (("JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".indexOf(a[1]) / 3 + 101) + "").substr(1);
    //month = fngetMonthNumberFromArray(month);
    $.ajax({
        type: "POST",
        data: "userCode=" + favoringUserCode + "&claimCode=" + claimCode + "&month=" + month + "&year=" + year,
        async: 'false',
        url: "../HiDoctor_Reports/Reports/GetExpenseClaimApprovalPopup",
        success: function (result) {
            if (result != '' && result != null) {
                debugger;
                //$('#dvExpDCRDetails').show();
                $('#dvExpDCRDetails').html(result);
                $("#dvExpDCRDetails").show();
                //$("#aDCRExpDetails").html('Hide');
            }
        },
    });
    //$("#dvExpDCRDetails").show();
    //$("#aDCRExpDetails").html('Hide');
    //}
}

function fnCalcItemWiseApprovedAmount(rowNumber) {

    var deductionAmount = 0;
    var claimAmount = 0;
    var previousDeductionAmount = 0;
    if ($.trim($("#txtDeduction_" + rowNumber).val()) != '') {
        if (!isNaN($("#txtDeduction_" + rowNumber).val())) {
            if ($.trim($("#txtDeduction_" + rowNumber).val()) == '') {
                $("#txtDeduction_" + rowNumber).val('0.00');
            }
            deductionAmount = $.trim($("#txtDeduction_" + rowNumber).val());
            previousDeductionAmount = $.trim($("#spnpreviousDecAmount_" + rowNumber).html());
            claimAmount = $.trim($("#spnClaimAmount_" + rowNumber).html());

            if (previousDeductionAmount == "") {
                previousDeductionAmount = 0;
            }
            if ((parseFloat(claimAmount) >= ((parseFloat(previousDeductionAmount) + parseFloat(deductionAmount))))) {
                $("#spnApproved_" + rowNumber).html(parseFloat(claimAmount) - (parseFloat(previousDeductionAmount) + parseFloat(deductionAmount)));
            }
            else {
                fnMsgAlert('info', 'info', 'Deduction amount should not exceed claimed amount');
                return false;
            }
        }
        else {
            fnMsgAlert('info', 'info', 'Please enter numbers alone');
            $("#txtDeduction_" + rowNumber).val('0');
            return;
        }
    }
    else {
        debugger;
        $("#txtDeduction_" + rowNumber).val('0.00');
        deductionAmount = $.trim($("#txtDeduction_" + rowNumber).val());
        previousDeductionAmount = $.trim($("#spnpreviousDecAmount_" + rowNumber).html());
        claimAmount = $.trim($("#spnClaimAmount_" + rowNumber).html());

        if ((parseFloat(claimAmount) >= ((parseFloat(previousDeductionAmount) + parseFloat(deductionAmount))))) {
            $("#spnApproved_" + rowNumber).html(parseFloat(claimAmount) - (parseFloat(previousDeductionAmount) + parseFloat(deductionAmount)));
        }
        else {
            fnMsgAlert('info', 'info', 'Deduction amount should not exceed claimed amount');
            return false;
        }
        // $("#spnApproved_" + rowNumber).html($("#spnClaimAmount_" + rowNumber).html());
    }
    var tblLength = $("#dvClaimDetails table tr td.trlength").length
    var itemwisetotalDeduction = 0;
    for (var k = 1; k <= tblLength; k++) {
        itemwisetotalDeduction = parseFloat(itemwisetotalDeduction) + parseFloat($("#txtDeduction_" + k).val());
    }
    $("#spnItemwiseDeduction").html(itemwisetotalDeduction);
    var otherDeduction = $("#txtOtherDeductionAmount").val();
    debugger;
    $("#spnTotalDeductionAmount").html(parseFloat(parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalDeduction").html(parseFloat(parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html() - parseFloat(deductionAmount)) - (parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction))).toFixed(2));
    $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction))).toFixed(2));
    // $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
    fnExpandItemwiseDetailsTotal();
}


function fnExpandItemwiseDetailsTotal() {
    debugger;
    var tableContent = "";
    var expenseTypeName = "";
    selectedExpenseTypeName = [];
    uniqueExpenseTypeName = [];
    var expClaimAmount = 0.0;
    var ApprovedAmount = 0.0;
    var totalDeductionAmount = 0.0;
    var preduduction = 0.0;
    var tblExpenselength = $("#dvClaimDetails table tr td.trlength").length;
    var addltblExpenselength = $("#dvAddlAprClaimDetails table tr td.trRow").length;

    for (var z = 1; z <= tblExpenselength; z++) {
        expenseTypeName = $("#spnClaimExpTypeName_" + z).html();
        selectedExpenseTypeName.push(expenseTypeName);
    }
    for (var i = 1; i <= addltblExpenselength; i++) {
        expenseTypeName = $("#AddlAprExpType_" + i).text();
        selectedExpenseTypeName.push(expenseTypeName);
    }
    // uniqueExpenseTypeName.push($.unique(selectedExpenseTypeName));


    $.each(selectedExpenseTypeName, function (i, el) {
        if ($.inArray(el, uniqueExpenseTypeName) === -1) uniqueExpenseTypeName.push(el);
    });


    tableContent += "<table class='table table-striped'>";
    tableContent += "<thead>";
    tableContent += "<tr>";
    tableContent += "<td style='font-weight: bold;'>Expense Type Name</td>";
    tableContent += "<td style='font-weight: bold;'>Total Claimed Amount Rs.</td>";
    tableContent += "<td style='font-weight: bold;'>Total Deducted Amount Rs.</td>";
    tableContent += "<td style='font-weight: bold;'>Total Approved Amount Rs.</td>";
    tableContent += "</tr>";
    tableContent += "</thead>";
    for (var i = 0; i < uniqueExpenseTypeName.length; i++) {
        typewiseExpense = 0.0;
        expClaimAmount = 0.0;
        ApprovedAmount = 0.0;
        totalDeductionAmount = 0.0;

        preduduction = 0.0;
        tableContent += "<tr><td style='font-weight: bold;'>" + uniqueExpenseTypeName[i] + "</td>";
        var expLen = $("td[Exp_Code='" + uniqueExpenseTypeName[i] + "']").length;
        var AddlExpLen = $("td[Addl_Exp_Code='" + uniqueExpenseTypeName[i] + "']").length;
        for (var r = 0; r < expLen; r++) {
            var id = $("td[Exp_Code='" + uniqueExpenseTypeName[i] + "']")[r].id;
            var expClaim = ($("#" + id.replace("spnClaimExpTypeName", "spnClaimAmount")));
            expClaimAmount += parseFloat(expClaim.html());
            var expApp = ($("#" + id.replace("spnClaimExpTypeName", "spnApproved")));
            ApprovedAmount += parseFloat(expApp.html());
            var totaldec = ($("#" + id.replace("spnClaimExpTypeName", "txtDeduction")));
            totalDeductionAmount += parseFloat(totaldec.val());
            var totalpreduction = ($("#" + id.replace("spnClaimExpTypeName", "spnpreviousDecAmount")));
            preduduction += parseFloat(totalpreduction.html());
        }
        for (var r = 0; r < AddlExpLen; r++) {
            var id = $("td[Addl_Exp_Code='" + uniqueExpenseTypeName[i] + "']")[r].id;
            var expClaim = ($("#" + id.replace("AddlAprExpType", "AddlAprClaimAmt")));
            expClaimAmount += parseFloat(expClaim.html() == "" ? 0 : expClaim.html());
            var expApp = ($("#" + id.replace("AddlAprExpType", "AddlExpAprAmt")));
            ApprovedAmount += parseFloat(expApp.html() == "" ? 0 : expApp.html());
            var totaldec = ($("#" + id.replace("AddlAprExpType", "AddlExpCurrDed")));
            totalDeductionAmount += parseFloat(totaldec.html() == "" ? 0 : totaldec.html());
            //var totalpreduction = ($("#" + id.replace("AddlAprExpType", "AddlExpDedAmt")));
            //preduduction += parseFloat(totalpreduction.html() == "" ? 0 : totalpreduction.html());
        }
        var finalDedutionAmount = 0.0;
        finalDedutionAmount = parseFloat(totalDeductionAmount + preduduction);
        tableContent += "<td><span>" + expClaimAmount + "</span></td>";
        tableContent += "<td><span>" + finalDedutionAmount + "</span></td>";
        tableContent += "<td><span>" + ApprovedAmount + "</span></td></tr>";
    }
    var deductionAmount = 0.0;

    for (var d = 1; d < $("#tblDoctorCRM  tbody tr").length + 1; d++) {
        debugger;
        deductionAmount += parseFloat($("#txtDeduction_" + d).val());
    }

    var itemwisetotalDeductions = 0;
    for (var p = 1; p <= tblExpenselength; p++) {
        itemwisetotalDeductions = parseFloat(itemwisetotalDeductions) + parseFloat($("#spnpreviousDecAmount_" + p).html()) + parseFloat($("#txtDeduction_" + p).val());
    }
    for (var p = 1; p <= addltblExpenselength; p++) {
        if ($("#AddlExpCurrDed_" + p).html() != "") {
            itemwisetotalDeductions = parseFloat(itemwisetotalDeductions) + parseFloat($("#AddlExpCurrDed_" + p).html());
        }
    }
    $("#spnItemwiseDeduction").html(itemwisetotalDeductions);
    var otherDeduction = $("#txtOtherDeductionAmount").val();
    if (otherDeduction == "") {
        otherDeduction = 0.0;
    }
    debugger;
    $("#spnTotalDeductionAmount").html(parseFloat(parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalDeduction").html(parseFloat(parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html() - parseFloat(deductionAmount)) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
    $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
    $("#dvExpenseTypeAmountDetail").html(tableContent);
    // fnCalcItemWiseApprovedAmount()
}



//function fnGetStatus(cycleCode, moveOrder, claimUserTypeName) {
//    $.ajax({
//        type: "POST",
//        url: '../HiDoctor_Master/Expense/GetMappedStatusCycle',
//        data: "cycleCode=" + cycleCode + "&moveOrder=" + moveOrder + "",
//        success: function (result) {
//            if (result != '') {
//                var statusJson = eval('(' + result.split('^')[0] + ')');
//                var content = "";
//                if (statusJson.length > 0) {
//                    //content = "<div style='float:left'>Change Status - </div>";
//                    for (var i = 0; i < statusJson.length; i++) {
//                        content += "<div class='btnStatus' id='dv_" + statusJson[i].Status_Name + "'  onclick='fnApproveClaim(\"" + statusJson[i].Status_Code
//                                            + "\",\"" + statusJson[i].Order_No + "\",\"" + expensePrivilege_g + "\",\"" + claimUserTypeName + "\");' >" + statusJson[i].Status_Name + "</div>";

//                    }
//                    $("#dvAction").html("<div style='float:left'>Change Status - </div>" + content);
//                    $("#dvBottomStatus").html(content);
//                }

//            }
//        }
//    });
//}

function fnGetClosedStatus(claimCode, cycleCode, moveOrder, claimUserTypeName) {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetStatusCyle',
        data: "cycleCode=" + cycleCode + "&moveOrder=" + moveOrder + "",
        async: 'false',
        success: function (result) {
            debugger;
            if (result != '') {
                if (result.toUpperCase() == "APPROVED") {

                    $('#dvPaymentDetails').show();

                    var PaymentAutoFill = [];
                    var Payment = {};
                    Payment.label = "Cheque Or DD";
                    Payment.value = "Cheque";
                    PaymentAutoFill.push(Payment);
                    Payment = {};
                    Payment.label = "Cash";
                    Payment.value = "Cash";
                    PaymentAutoFill.push(Payment);
                    Payment = {};
                    Payment.label = "Others";
                    Payment.value = "Others";
                    PaymentAutoFill.push(Payment);

                    //autoComplete(d_g, "txtDCust", "hdnDCust", 'autoCustEdit');

                    autoComplete(PaymentAutoFill, "txtModeOfPayment", "txtModeOfPayment", 'txtModeOfPayment');
                }
                else if (result.toUpperCase() == "CLOSED") {
                    $('#dvPaymentDetails').show();
                    $.ajax({
                        type: "POST",
                        url: '../HiDoctor_Master/Expense/GetCRMPaymentDetails',
                        data: "ClaimCode=" + claimCode,
                        async: 'false',
                        success: function (result) {
                            debugger;
                            if (result != '') {
                                debugger;
                                var paymentMode = result[0].Payment_Mode;
                                var remarks = result[0].Payment_Remarks;
                                $('#txtModeOfPayment').val(paymentMode);
                                $('#txtPaymentRemarks').val(remarks);
                            }

                        }
                    });
                }
            }
        }
    });
}

function fnShowHistory() {
    $("#dvHistoryPopUp").overlay().load();
}

function fnExpandItemwiseDetails() {
    if ($("#dvClaimDetails").is(':visible')) {
        $("#dvClaimDetails").hide();
        $("#aExpDetails").html('Show');
    }
    else {
        $("#dvClaimDetails").show();
        $("#aExpDetails").html('Hide');
    }
}

function fnGetTPDetails(dcrDate) {
    //alert(dcrDate);
    $.ajax({
        type: "POST",
        async: 'false',
        data: "usercode=" + $('#hdnFavouringUsercode').val() + "&dcrDate=" + dcrDate,
        url: "../HiDoctor_Master/Expense/GetTpDetails",
        success: function (result) {
            var tpDetails = "<table class='table table-striped' style='margin-top: 40px;margin-left: 45px;width: 80%;'>";
            if (result.length > 0)
                tpDetails += "<tr> <td><b>TP From</b></td> <td><b>TP To</b></td><td><b>Travel Mode</b></td><td><b>Work Category</b></td></tr>";
            else
                tpDetails += "<tr> <td><b>No SFC Found</b></td></tr>";
            for (var i = 0; i < result.length; i++) {
                tpDetails += "<tr><td>" + result[i].From_Place + "</td>";
                tpDetails += "<td>" + result[i].To_Place + "</td>";
                tpDetails += "<td>" + result[i].Travel_Mode + "</td>";
                tpDetails += "<td>" + result[i].Category + "</td></tr>";
            }

            tpDetails += "</<table";
            $("#divTpDetails").html(tpDetails);
            $('#dvTpDetails').overlay().load();
            $('#dvTpDetails').overlay().load();
        }
    });
}