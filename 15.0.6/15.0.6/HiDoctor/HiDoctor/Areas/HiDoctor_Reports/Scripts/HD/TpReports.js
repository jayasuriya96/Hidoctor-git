

// ********************** Start - Tp Vs Actual Doctor Visits Report **********************
function fnTpVsActualDoctorVisitsReport() {
    $("#divSubReport").empty();
    ShowModalPopup("dvloading");
    if (fnValidateTpVsActualDoctorVisits("TP Vs Actual Doctor Visits Report")) {
        var month = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
        var year = $('#txtFromDate').val().split('-')[1];
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetTpVsActualDoctorVisits',
            data: 'month=' + month + '&year=' + year + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jTp = eval('(' + response + ')');
                var tblCont = "";

                if (!(jTp.Tables === undefined) && jTp.Tables.length > 0 && jTp.Tables[0].Rows.length > 0) {

                    // User details                    
                    tblCont = "<div id='dvUserDetails'><table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr>";
                    tblCont += "<th>User Name : " + jTp.Tables[0].Rows[0]["User_Name"] + "</th>";
                    tblCont += "<th>Employee Name : " + jTp.Tables[0].Rows[0]["Employee_Name"] + "</th>";
                    tblCont += "<th>Territory Name : " + jTp.Tables[0].Rows[0]["Region_Name"] + "</th>";
                    var expDiv = jsonPath(jTp, "$.Tables[1].Rows[?(@.User_Code=='" + jTp.Tables[0].Rows[0]["User_Code"] + "')]");

                    if (expDiv != false) {
                        tblCont += "<th>Division : " + expDiv[0].Division_Name + "</th></tr>";
                    }
                    else {
                        tblCont += "<th>Division : </th></tr>";
                    }

                    tblCont += "<tr><th>Reporting Manager : " + jTp.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + jTp.Tables[0].Rows[0]["Manager_Name"] + ")</th>";
                    tblCont += "<th>Reporting HQ : " + jTp.Tables[0].Rows[0]["Manager_Region_Name"] + "</th>";
                    tblCont += "<th>Date of joining : " + ((jTp.Tables[0].Rows[0]["DOJ"] == null) ? "-" : jTp.Tables[0].Rows[0]["DOJ"]) + "</th>";
                    tblCont += "<th></th>";
                    tblCont += "</tr></thead></table></div></br>";

                    $("#divSubReport").append(tblCont);
                    $('#tblUserDetail').dataTable({
                        "bPaginate": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    });

                    // Report
                    if (jTp.Tables.length > 1 && jTp.Tables[2].Rows.length > 0) {

                        tblCont = "<div ><table cellspacing='0' cellpadding='0' id='tblTpVsActualDocVisits' class='data display dataTable box' width='100%'>";
                        tblCont += "<thead>";

                        // get number of days in a month
                        var monthStart = new Date(year, (month - 1), 1);
                        var monthEnd = new Date(year, month, 1);
                        var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24)

                        tblCont += "<tr style='display: none;' id='tblTrb'>";

                        tblCont += "<th style='display:none'>Region Name</th>";
                        tblCont += "<th style='display:none'>User Name</th>";
                        tblCont += "<th style='display:none'>Employee Name</th>";
                        tblCont += "<th style='display:none'>Reporting To</th>";
                        tblCont += "<th >Doctor Name</th>";
                        tblCont += "<th >MDL</th>";
                        tblCont += "<th >Category</th>";
                        tblCont += "<th >Speciality</th>";
                        tblCont += "<th >Hospital Name</th>";
                        tblCont += "<th >Hospital Classification</th>";
                        tblCont += "<th >Linked CP</th>";
                        tblCont += "<th >Planned As Per TP</th>";
                        tblCont += "<th >Actual Visits As Per TP</th>";
                        tblCont += "<th >Visited not Planned in TP</th>";
                        tblCont += "<th >Total Visits</th>";
                        for (var u = 1; u <= monthLength; u++) {
                            tblCont += "<th>Day " + u + "</th>";
                        }
                        tblCont += "</tr>";


                        var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }';
                        type += ', { type: "number-range" },{ type: "number-range" }, { type: "number-range" }, { type: "number-range" }';
                        for (var u = 1; u <= monthLength; u++) {
                            type += ', { type: "text" }';
                        }
                        type += ']';

                        tblCont += "<tr>";
                        tblCont += "<th style='display:none'>Region Name</th>";
                        tblCont += "<th style='display:none'>User Name</th>";
                        tblCont += "<th style='display:none'>Employee Name</th>";
                        tblCont += "<th style='display:none'>Reporting To</th>";
                        tblCont += "<th >Doctor Name</th>";
                        tblCont += "<th >MDL</th>";
                        tblCont += "<th >Category</th>";
                        tblCont += "<th >Speciality</th>";
                        tblCont += "<th >Hospital Name</th>";
                        tblCont += "<th >Hospital Classification</th>";
                        tblCont += "<th >Linked CP</th>";
                        tblCont += "<th >Planned As Per TP</th>";
                        tblCont += "<th >Actual Visits As Per TP</th>";
                        tblCont += "<th >Visited not Planned in TP</th>";
                        tblCont += "<th >Total Visits</th>";

                        for (var u = 1; u <= monthLength; u++) {
                            tblCont += "<th>Day " + u + "</th>";
                        }
                        tblCont += "</tr>";

                        var colCount = monthLength + 15;
                        tblCont += "<th colspan= '" + colCount + "' align='left'  ><span id='spnDivToggleb' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeb()'>Show Filter</span></th>";
                        tblCont += " </thead><tbody>";

                        for (var i = 0; i < jTp.Tables[2].Rows.length; i++) {
                            tblCont += "<tr>";
                            tblCont += "<td style='display:none'>" + jTp.Tables[0].Rows[0]["Region_Name"] + "  </td>";
                            tblCont += "<td style='display:none'>" + jTp.Tables[0].Rows[0]["User_Name"] + " </td>";
                            tblCont += "<td style='display:none'> " + jTp.Tables[0].Rows[0]["Employee_Name"] + "</td>";
                            tblCont += "<td style='display:none'> " + jTp.Tables[0].Rows[0]["Manager_Emp_Name"] + "  </td>";
                            //tblCont += "<td>" + jTp.Tables[2].Rows[i]["Customer_Name"] + "</td>";
                            //  tblCont += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jTp.Tables[0].Rows[0]["Region_Code"] + "_" + jTp.Tables[2].Rows[i]["Customer_Code"] + "_" + jTp.Tables[0].Rows[0]["User_Code"] + "\")' style='text-decoration:underline;cursor:pointer'>" + jTp.Tables[2].Rows[i]["Customer_Name"] + "</span></td>";
                            tblCont += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jTp.Tables[2].Rows[i]["Customer_Code"] + "\")' style='text-decoration:underline;cursor:pointer'>" + jTp.Tables[2].Rows[i]["Customer_Name"] + "</span></td>";
                            tblCont += "<td>" + jTp.Tables[2].Rows[i]["MDL"] + "</td>";
                            tblCont += "<td>" + ((jTp.Tables[2].Rows[i]["Category_Name"] == null) ? "" : jTp.Tables[2].Rows[i]["Category_Name"]) + "</td>";
                            tblCont += "<td>" + ((jTp.Tables[2].Rows[i]["Speciality"] == null) ? "" : jTp.Tables[2].Rows[i]["Speciality"]) + "</td>";
                            tblCont += "<td>" + ((jTp.Tables[2].Rows[i]["Hospital_Name"] == null) ? "" : jTp.Tables[2].Rows[i]["Hospital_Name"]) + "</td>";
                            tblCont += "<td>" + ((jTp.Tables[2].Rows[i]["Hospital_Classification"] == null) ? "" : jTp.Tables[2].Rows[i]["Hospital_Classification"]) + "</td>";

                            // CP
                            var cpJson = jsonPath(jTp, "$.Tables[3].Rows[?(@.Customer_Code=='" + jTp.Tables[2].Rows[i]["Customer_Code"] + "')]");
                            if (cpJson != false && !(cpJson === undefined)) {
                                tblCont += "<td>" + cpJson[0].CP_Name + "</td>";
                            }
                            else { tblCont += "<td></td>"; }

                            // planned as per tp
                            var tpJson = jsonPath(jTp, "$.Tables[4].Rows[?(@.Doctor_Code=='" + jTp.Tables[2].Rows[i]["Customer_Code"] + "')]");
                            if (tpJson != false && !(tpJson === undefined)) {
                                tblCont += "<td>" + tpJson.length + "</td>";
                            }
                            else {
                                tblCont += "<td>0</td>";
                            }

                            var asPerTpVisit = 0;
                            var notInTp = 0;
                            var totalVisit = 0;

                            var dvJson = jsonPath(jTp, "$.Tables[5].Rows[?(@.Doctor_Code=='" + jTp.Tables[2].Rows[i]["Customer_Code"] + "')]");
                            if (dvJson != false && !(dvJson === undefined)) {
                                for (var p = 0; p < dvJson.length; p++) {
                                    var tpPlanJson = jsonPath(jTp, "$.Tables[4].Rows[?(@.Doctor_Code=='" + jTp.Tables[2].Rows[i]["Customer_Code"] + "' && @.TP_Date=='" + dvJson[p].DCR_Actual_Date + "')]");
                                    if (tpPlanJson != false && !(tpPlanJson === undefined) && tpPlanJson.length > 0) {
                                        asPerTpVisit = parseInt(asPerTpVisit) + 1; // Planned visit
                                    }
                                    else {
                                        notInTp = parseInt(notInTp) + 1; // Un Planned Visit
                                    }
                                }
                                totalVisit = parseInt(asPerTpVisit) + parseInt(notInTp);
                            }

                            tblCont += "<td>" + asPerTpVisit + "</td>";
                            tblCont += "<td>" + notInTp + "</td>";
                            tblCont += "<td>" + totalVisit + "</td>";

                            var formatedMonth = (((month).toString().length == 1) ? "0" + (month).toString() : (month).toString());

                            for (var u = 1; u <= monthLength; u++) {
                                var currentDate = "";
                                var day = ((u.toString().length == 1) ? "0" + u.toString() : u.toString());
                                currentDate = day + '/' + formatedMonth + '/' + year;

                                var dvJData = jsonPath(jTp, "$.Tables[5].Rows[?(@.Doctor_Code=='" + jTp.Tables[2].Rows[i]["Customer_Code"] + "' && @.DCR_Actual_Date=='" + currentDate + "')]");
                                if (dvJData != false && !(dvJData === undefined) && dvJData.length > 0) {
                                    tblCont += "<td>Y</td>";
                                }
                                else {
                                    tblCont += "<td>N</td>";
                                }
                            }
                            tblCont += "</tr>";
                        }
                        tblCont += "</tbody></table>";
                    }
                    else {
                        tblCont = "<span>No data found.</span>";
                    }
                    $("#divSubReport").append(tblCont);
                    $("#divSubReport").append('<div style="clear:both"></div>');
                    $("#divsubPrint").html(tblCont);
                    var jsonType = eval(type);
                    $('#tblTpVsActualDocVisits').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                        , "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });

                    $('#divSubReport').show();

                    $('#divReport').show();
                    fninializePrint("divsubPrint", "ifrmsubPrint", "divSubReport");
                    HideModalPopup("dvloading");
                }
                else {
                    fnMsgAlert('info', 'TP Vs Actual Doctor Visits', 'No Data found.');
                    HideModalPopup("dvloading");
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }

        });
    }
}

function fnDoctor360Popup(val) {

    $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + val, title: 'Reports', overlayClose: false });
    return;
}


function fnValidateTpVsActualDoctorVisits(screenName) {
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', screenName, 'Please select month.');
        //$("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    return true;
}

function fnClearTpVsActualDoctorVisitsReport() {
    $("#txtFromDate").val('');
}

function fnToggleTreeb() {
    if ($("#spnDivToggleb").html() == "Hide Filter") {

        $("#tblTrb").hide();
        $("#spnDivToggleb").html('Show Filter');
    }
    else if ($("#spnDivToggleb").html() == "Show Filter") {
        $("#tblTrb").show();
        $("#spnDivToggleb").html('Hide Filter');
    }
}
// ********************** End - Tp Vs Actual Doctor Visits Report **********************


//************************* Start - TP Vs Actual Deviation Summary **********************

function fnTpVsActualDeviationSummaryReport() {
    $("#divReport").empty();
    $("#divSubReport").empty();
    $("#divHeader").empty();
    $("#divSubReport").hide();
    $("#divHeader").hide();
    ShowModalPopup("dvloading");
    if (fnValidateTpVsActualDoctorVisits("TP Vs Actual Deviation Summary")) {
        var month = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
        var year = $('#txtFromDate').val().split('-')[1];
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetTpVsActualDeviationSummary',
            data: 'month=' + month + '&year=' + year + '&userCode=' + $("#hdnMainUserCode").val(),
            success: function (response) {
                //var jTp = response;
                //var tblCont = "";
                //if (!(jTp[0] === undefined) && jTp[0].length > 0) {

                $("#divReport").html(response);
                $("#divReport").append('<div style="clear:both"></div>');
                $("#divPrint").html(response);
                // $("#divPrint").html($("#divSubReport").html());
                // var jsonType = eval(type);
                $('#tblTpVsActualDeviationSummaryReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true
                    , "sDom": 'T<"clear">lfrtip'
                }).dataTable()
                //    .columnFilter({
                //    sPlaceHolder: "head:after",
                //    aoColumns: jsonType
                //});

                fninializePrint("divsubPrint", "ifrmsubPrint", "divSubReport");
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                $('#divReport').show();
                HideModalPopup("dvloading");
                //}
                //else {
                //    fnMsgAlert('info', 'TP Vs Actual Deviation Summary Report', 'No Data found.');
                //    HideModalPopup("dvloading");
                //}
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }

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

function fnRedirectToDeviationDetails(regionCode) {
    $("#divSubReport").hide();
    $("#divHeader").hide();
    $('#hdnRegionCode').val(regionCode);
    fnGetTPvsActualDeviationDetails();
    $("#divSubReport").show();
    $("#divHeader").show();
}

function fnRedirectToTpVsActualDoctorVisitsReport(userCode) {
    $("#divSubReport").hide();
    $("#divHeader").hide();
    $('#hdnUserCode').val(userCode);
    fnTpVsActualDoctorVisitsReport();
    $("#divSubReport").show();
}

function fnToggleTreeasummary() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrSummary").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrSummary").show();
        $("#spnDivToggle").html('Hide Filter');
    }
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
//************************* End - TP Vs Actual Deviation Summary **********************

//************************* Start - TP with CP Doctor Missed ****************************

function fnBindTpWithCPDoctorMissed() {
    ShowModalPopup("dvloading");

    $("#dvDataTable").html("");
    if (fnValidateTpWithCPDoctorMissed()) {
        var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
        var year = $('#txtMonth').val().split('-')[1];
        var regionCode = $("#hdnRegionCode").val();
        var tpStatus = "";

        if ($("input:checkbox[name=tpAll]:checked").val() == "0,1,2") {
            tpStatus = $("input:checkbox[name=tpAll]:checked").val();
        }
        else {
            $('input:checkbox[name=tpStatus]').each(function () {
                if ($(this).is(':checked')) { tpStatus += $(this).val() + ","; }
            });
        }
        var isExcel = 'N';
        isExcel = $(":radio[name=rptOptions]:checked").val();
        HideModalPopup("dvloading");

        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ReportsLevelThree/GetTpWithCpDoctorMissedReport',
            data: 'regionCode=' + regionCode + '&month=' + month + '&year=' + year + '&tpStatus=' + escape(tpStatus) + '&isExcel=' + isExcel,
            success: function (response) {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvDataTable").html('<div class="col-lg-12"><div class="helpIconright"><img src="../Images/HelpIcon.png" onclick="fnHelp(\'TPWITHCPDOCTORMISSED\',\'GRID\')" /></div><div style="clear:both;"></div></div>');
                    if (isExcel == "Y") {
                        $("#dvDataTable").append("<a target='_blank' style='padding-left:5px;font-size:14px;' href='" + response + "'>Click here to Download.</a>");
                    }
                    else {
                        $("#dvDataTable").append(response);
                    }
                    $("#dvDataTable").append("<div style='clear:both;'></div>");
                }
                else {
                    fnMsgAlert('info', 'TP with CP Doctors Missed', 'Error.' + response.split('^')[1]);
                }
                $("#main").unblock();
            },
            error: function () {
                fnMsgAlert('info', 'TP with CP Doctors Missed', 'Error.');
                $("#main").unblock();
            }
        });
    }
}

function fnCheckTPAll() {
    if ($("input:checkbox[name=tpAll]:checked").val() == "0,1,2") {
        $('input:checkbox[name=tpStatus]').each(function () {
            $(this).removeAttr('checked');
        });
        return;
    }
}

function fnUncheckTPAll() {
    if ($(":checkbox[name=tpStatus]:checked").length > 0) {
        $("input:checkbox[name=tpAll]").removeAttr('checked');
        return;
    }
}

function fnClearTpWithCPDoctorMissed() {
    $('#txtMonth').val("");
    $('input:checkbox[name=tpStatus]').each(function () {
        $(this).removeAttr('checked');
    });
    $("input:checkbox[name=tpAll]").attr('checked', true);
}

function fnValidateTpWithCPDoctorMissed() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'TP with CP Doctors Missed', 'Please select Month and Year.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":checkbox[name=tpAll]:checked").length == 0 && $(":checkbox[name=tpStatus]:checked").length == 0) {
        fnMsgAlert('info', 'TP with CP Doctors Missed', 'Please select TP status.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($(":radio[name=rptOptions]:checked").length == 0) {
        fnMsgAlert('info', 'Speciality Coverage Analysis', 'Please select View in-screen\Export to excel.');
        HideModalPopup("dvloading");
        return false;
    }
    return true;
}

//************************* End - TP with CP Doctor Missed ******************************