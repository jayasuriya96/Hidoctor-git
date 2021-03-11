//function fnChangedCheck() {
//    if ($("input:checkbox[name=all]:checked").val() == "0,1,2,3") {
//        $('input:checkbox[name=dcrStatus]').each(function () {
//            $(this).removeAttr('checked');
//        });
//        return;
//    }
//}

//function fnChangedRadio() {
//    if ($(":checkbox[name=dcrStatus]:checked").length > 0) {
//        $("input:checkbox[name=all]").removeAttr('checked');
//        return;
//    }
//}
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


function fnToggleTreeHeader(divId, tblId) {
    if ($("#" + divId).html() == "Hide Filter") {

        $("#" + tblId).hide();
        $("#" + divId).html('Show Filter');
    }
    else if ($("#" + divId).html() == "Show Filter") {
        $("#" + tblId).show();
        $("#" + divId).html('Hide Filter');
    }
}
function fnToggleReport() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#tblTr1").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#tblTr1").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}


function fnValidateReport(screenName) {
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', screenName, 'Please enter Start date.');
        $("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', screenName, 'Please enter End date.');
        $("#txtToDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', screenName, 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($(":checkbox[name=all]:checked").length == 0 && $(":checkbox[name=dcrStatus]:checked").length == 0) {
        fnMsgAlert('info', screenName, 'Please select DCR status.');
        HideModalPopup("dvloading");
        return false;
    }
    return true;
}

function fnRCPACompliance() {
    $("#divSubReport").empty();
    ShowModalPopup("dvloading");
    if (fnValidateReport("RCPA Compliance Report")) {
        var dcrStatus = "";
        var startDate = "", endDate = "";

        $("#divInput").slideUp();
        $("#spnInputToggle").html("Show Input");
        $("#divInput").slideUp();
        $("#spnInputToggle").html("Show Input");

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        if ($("input:checkbox[name=all]:checked").val() == "0,1,2") {
            dcrStatus = $("input:checkbox[name=all]:checked").val();
        }
        else {
            $('input:checkbox[name=dcrStatus]').each(function () {
                if ($(this).is(':checked')) {
                    dcrStatus += $(this).val() + ",";
                }
            });
        }
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ReportsLevelTwo/GetRCPACompliance',
            data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&regionCode=' + $("#hdnRegionCode").val(),
            success: function (response) {

                jsData = eval('(' + response + ')');
                var tableContent = "", divisionName = "";
                var fieldCount = 0, rcpaCount = 0;
                if (jsData.Tables[0].Rows.length > 0) {
                    tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblRCPACompliance' class='data display datatable' >";
                    tableContent += "<thead><tr style='display: none;' id='tblTr'>";
                    tableContent += "<th align='left' width='15%'>User Name</th>";
                    tableContent += "<th align='left' width='15%'>Employee Name</th>";
                    tableContent += "<th align='left' width='15%'>Territory Name</th>";
                    tableContent += "<th align='left' width='15%'>Division Name</th>";
                    tableContent += "<th align='left' width='15%'>Reporting To</th>";
                    tableContent += "<th align='left' width='15%'>Reporting HQ</th>";
                    tableContent += "<th align='left' width='15%'>Total Worked Days</th>";
                    tableContent += "<th align='left' width='15%'>Total Planned Field Days</th>";
                    tableContent += "<th align='left' width='15%'>Total Field DCRs entered</th>";
                    tableContent += "<th align='left' width='15%'>Total RCPA Entered Days</th>";
                    tableContent += "<th align='left' width='15%'>Deviation</th>";
                    tableContent += "</tr>";

                    tableContent += "<tr>";
                    tableContent += "<th align='left' width='15%'>User Name</th>";
                    tableContent += "<th align='left' width='15%'>Employee Name</th>";
                    tableContent += "<th align='left' width='15%'>Territory Name</th>";
                    tableContent += "<th align='left' width='15%'>Division Name</th>";
                    tableContent += "<th align='left' width='15%'>Reporting To</th>";
                    tableContent += "<th align='left' width='15%'>Reporting HQ</th>";
                    tableContent += "<th align='left' width='15%'>Total Worked Days</th>";
                    tableContent += "<th align='left' width='15%'>Total Planned Field Days</th>";
                    tableContent += "<th align='left' width='15%'>Total Field DCRs entered</th>";
                    tableContent += "<th align='left' width='15%'>Total RCPA Entered Days</th>";
                    tableContent += "<th align='left' width='15%'>Deviation</th>";
                    tableContent += "</tr>";

                    tableContent += "<tr >";
                    tableContent += "<th colspan= '11' style='text-align:left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                    tableContent += "</tr>";

                    var type = '[{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "number-range" }';
                    type += ', { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';

                    tableContent += "</thead><tbody>";
                    for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                        fieldCount = 0;
                        rcpaCount = 0;
                        tableContent += "<tr>";
                        tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[i].User_Name + "</td>";
                        tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[i].Employee_Name + "</td>";
                        tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[i].Region_Name + "</td>";

                        if (jsData.Tables[2].Rows.length > 0) {
                            var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                            divisionName = "";
                            if (dJsonData != false) {
                                for (var j = 0; j < dJsonData.length; j++) {
                                    divisionName += dJsonData[j].Division_Name + ",";
                                }
                                if (divisionName != "") {
                                    divisionName = divisionName.substring(0, divisionName.length - 1);
                                }
                                tableContent += "<td style='text-align:left' >" + divisionName + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:left' ></td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:left' ></td>";
                        }
                        tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[i].Manager_Name + "</td>";
                        tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[i].Manager_Region_Name + "</td>";
                        //Total Working Days
                        var dJson = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        if (dJson != false) {
                            if (dJson.length > 0) {
                                tableContent += "<td style='text-align:center' >" + dJson.length + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' >0</td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center' >0</td>";
                        }

                        //Total Planned Field Days
                        var dJson = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        if (dJson != false) {
                            if (dJson.length > 0) {
                                tableContent += "<td style='text-align:center' >" + dJson.length + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' >0</td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center' >0</td>";
                        }

                        //Total Field DCRs entered
                        var dJson = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "' & @.Flag=='F')]");
                        if (dJson != false) {
                            if (dJson.length > 0) {
                                fieldCount = parseInt(dJson.length);
                                tableContent += "<td style='text-align:center' >" + dJson.length + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' >0</td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center' >0</td>";
                        }


                        //Total RCPA Entered Days
                        var dJson = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "' & @.Is_RCPA=='Y')]");
                        if (dJson != false) {
                            if (dJson.length > 0) {
                                rcpaCount = parseInt(dJson.length);
                                tableContent += "<td style='text-align:center' >" + dJson.length + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' >0</td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center' >0</td>";
                        }
                        // Deviation

                        if (fieldCount > 0) {
                            tableContent += "<td style='text-align:center' >" + (fieldCount - rcpaCount) + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center' >0</td>";
                        }
                        tableContent += "</tr>";
                    }
                    tableContent += "</tbody>";
                    tableContent += "</table>";

                    var jsonType = eval(type);
                    $("#divReport").html(tableContent);
                    $("#divPrint").html(tableContent);
                    if ($.fn.dataTable) {
                        $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                        $.datepicker.setDefaults($.datepicker.regional['']);
                        $('#tblRCPACompliance').dataTable({
                            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        }).columnFilter({
                            sPlaceHolder: "head:after",
                            aoColumns: jsonType
                        });
                    };

                    if (tableContent != "") {
                        $("#divInput").slideUp();
                        $("#spnInputToggle").html("Show Input");
                    }
                    $('#dvPrint').remove();
                    fninializePrint("divPrint", "ifrmPrint", "divReport");
                    HideModalPopup("dvloading");


                }
                else {
                    fnMsgAlert('info', 'Report', 'No Data found.');
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

function fnValidateReportforDocMissedCategory(screenName) {
    var startDate = "", endDate = "";

    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];

    var days = daysInMonth(startMonth, startYear)

    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
        endDate = startYear + "-" + startMonth + "-" + days;
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
        endDate = startYear + "-0" + startMonth + "-" + days;
    }

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', screenName, 'Select month and year');
        $("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":checkbox[name=all]:checked").length == 0 && $(":checkbox[name=dcrStatus]:checked").length == 0) {
        fnMsgAlert('info', screenName, 'Please select DCR status.');
        HideModalPopup("dvloading");
        return false;
    }
    return true;
}


function fnDoctorMissedFormCategory() {
    $("#divSubReport").empty();
    $("#divReport").empty();
    $("#divImport").empty();
    ShowModalPopup("dvloading");
    if (fnValidateReportforDocMissedCategory("Doctor Missed Form Category")) {
        var dcrStatus = "";
        var startDate = "", endDate = "", status = "", startMonth = "", startYear = "";

        $("#divInput").slideUp();
        $("#spnInputToggle").html("Show Input");
        $("#divInput").slideUp();
        $("#spnInputToggle").html("Show Input");

        startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
        startYear = $('#txtFromDate').val().split('-')[1];

        var days = daysInMonth(startMonth, startYear)
        var title = $('#divPageHeader').html();
        var downLoadDate = new Date();
        if (parseInt(startMonth) >= 10) {
            startDate = startYear + "-" + startMonth + "-01";
            endDate = startYear + "-" + startMonth + "-" + days;
        }
        else {
            startDate = startYear + "-0" + startMonth + "-01";
            endDate = startYear + "-0" + startMonth + "-" + days;
        }

        if ($("input:checkbox[name=all]:checked").val() == "0,1,2") {
            dcrStatus = $("input:checkbox[name=all]:checked").val();
            dcrStatus = dcrStatus + ',';
        }
        else {
            $('input:checkbox[name=dcrStatus]').each(function () {
                if ($(this).is(':checked')) {
                    dcrStatus += $(this).val() + ",";
                }
            });
        }
        var seleceddcrstatus = "";
        switch (dcrStatus)
        {
            case "0,1,2,":
                seleceddcrstatus = "Applied,Approved,Unapproved";
                break;
            case "1,":
                seleceddcrstatus = "Applied";
                break;
            case "0,":
                seleceddcrstatus = "Unapproved";
                break;
            case "2,":
                seleceddcrstatus = "Approved";
                break;
            case "1,2,":
                seleceddcrstatus = "Applied,Approved";
                break;
            case "1,0,":
                seleceddcrstatus = "Applied,Unapproved";
                break;
            case "2,0,":
                seleceddcrstatus = "Approved,Unapproved";
                break;
            default: break;
        }
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ReportsLevelTwo/GetDoctorMissedFromCategory',
            data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val() + '&selectedMonth=' + startMonth + '&Selectedyear=' + startYear,
            success: function (response) {
                jsData = eval('(' + response + ')');
                var tableContent = "", divisionName = "";
                var tableContentDoctorMissed = "", tableContentVisitMissed = "", tableContentTotalDoctorMissed = "";
                var doctorTotal = 0, doctorVisit = 0, doctorCategoryCount = 0, doctorCount = 0;
                var missedTotal = 0, visitMissed = 0, totalMissedDoctor = 0, MissedDoctor = 0;
                if (jsData.Tables[0].Rows.length > 0) {  
                    tableContent += "<lable style='text-decoration: underline;'>Notes:</lable>";
                    tableContent += "<div style='width:100%'>";
                    tableContent += "<Lable>1)<span style='font-weight:bold;'>Doctor Master Count</span> - Is the Number of Doctors from Doctor Master.</Lable><br/>";
                    tableContent += "<Lable>2)<span style='font-weight:bold;'>Number of Doctors Never Vistied</span> - Is the number of doctors who have not been visited even once in the selected month.</Lable><br/>";
                    tableContent += "<Lable>3)<span style='font-weight:bold;'>Num of Doctors where Category Visit Count Missed</span> - Is the number of doctors for whom the visit category count has not been achieved. For e.g. a Doctor in some category needs to be visited twice, but has been visited only once.</Lable><br/>";
                    tableContent += "<Lable>4)<span style='font-weight:bold;'>Master Visits</span> - Is the standard number of visits for that category.</Lable><br/>";
                    tableContent += "<Lable>5)<span style='font-weight:bold;'>Planned Visits</span> - Is the number of visits planned in TP for that doctor, in the selected month.</Lable><br/>";
                    tableContent += "<Lable>6)<span style='font-weight:bold;'>Actual Visits</span> - Is the number of visits, calculated from the DCRs in the selected month.</Lable><br/>";
                    tableContent += "</div><br>";

                    //Bind Report Name                   
                    tableContent += "<div><b style='font-weight:bold;font-size:17px;font-style:italic;'>" + title + " report generate on " + downLoadDate.toLocaleString() + "</b></div><br>";
                    

                    tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                    tableContent += "<thead><tr>";
                    tableContent += "<th colspan='6'>User Details</th>";
                    tableContent += "<th>";
                    tableContent += ("<div class='helpIconRpt'>");
                    tableContent += ("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DOCTOR_MISSED_FROM_CATEGORY')\" />");
                    tableContent += ("</div>");
                    tableContent += "</th></tr></thead>";
                    tableContent += "<tbody>";
                    tableContent += "<tr>";
                    tableContent += "<td style='text-align:left' >User Name</td>";
                    tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                    tableContent += "<td style='text-align:left' >Division Name</td>";
                    var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                    divisionName = "";
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            divisionName += dJsonData[j].Division_Name + ",";
                        }

                        if (divisionName != "") {
                            divisionName = divisionName.substring(0, divisionName.length - 1);
                        }
                        tableContent += "<td style='text-align:left' >" + divisionName + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:left' ></td>";
                    }
                    tableContent += "<td style='text-align:left' >Manager Name</td>";
                    tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

                    tableContent += "<tr>";
                    tableContent += "<td style='text-align:left' >Employee Name</td>";
                    tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                    tableContent += "<td style='text-align:left' >Date of Joining</td>";
                    tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                    tableContent += "<td style='text-align:left' >Manager Territory name</td>";
                    tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
                    tableContent += "<tr>";
                    tableContent += "<td style='text-align:left' >Region Name</td>";
                    tableContent += "<td style='text-align:left'>" + jsData.Tables[0].Rows[0].Region_Name + "</td>";
                    tableContent += "<td style='text-align:left'>Selected Status</td>";
                    tableContent += "<td style='text-align:left' colspan='3'>" + seleceddcrstatus + "</td></tr>";
                    tableContent += "</tbody>";
                    tableContent += "</table><br/>";

                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorHeader' >";
                    tableContent += "<thead><tr>";
                    tableContent += "<th style='text-align:left' >Parameter</th>";
                    if (jsData.Tables[2].Rows.length > 0) {
                        for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                            tableContent += "<th style='text-align:center'>" + jsData.Tables[2].Rows[i].Category_Name + "</th>";
                        }
                    }

                    tableContent += "<th style='text-align:center' >Total</th>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";

                    tableContent += "<tr>";
                    tableContent += "<td style='text-align: left;'>Doctor Master count</td>";

                    tableContentDoctorMissed = "<tr>";
                    tableContentDoctorMissed += "<td style='text-align: left;'>No of Doctors Never Visited - A</td>";

                    tableContentVisitMissed = "<tr>";
                    tableContentVisitMissed += "<td style='text-align: left;'>No of Doctors where Category Visit Count Missed - B</td>";

                    tableContentTotalDoctorMissed = "<tr>";
                    tableContentTotalDoctorMissed += "<td style='text-align: left;'>Sum of doctors in A and B</td>";
                    if (jsData.Tables[2].Rows.length > 0) {
                        for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                            doctorCategoryCount = 0;
                            MissedDoctor = 0;
                            //Doctor Master Count
                            var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Category_Code=='" + jsData.Tables[2].Rows[i].Category_Code + "')]");
                            if (dJsonData != false) {
                                doctorTotal += parseInt(dJsonData[0].Count);
                                doctorCategoryCount = parseInt(dJsonData[0].Count);
                                if (doctorTotal > 0) {
                                    tableContent += "<td style='text-align:center;text-decoration:underline;cursor:pointer;width:8%;' onclick='fnDoctorMissedFormCategoryDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_" + jsData.Tables[2].Rows[i].Category_Code + "_" + startMonth + "_" + startYear + "_" + jsData.Tables[2].Rows[i].Category_Name + "\")'>" + parseInt(dJsonData[0].Count) + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center'> " + parseInt(dJsonData[0].Count) + "</td>";
                                }

                            }
                            else {
                                tableContent += "<td style='text-align:center'>0</td>";
                            }

                            // No of Doctor Never Visited
                            var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Category_Code=='" + jsData.Tables[2].Rows[i].Category_Code + "')]");

                            if (dJsonData != false) {
                                MissedDoctor += (doctorCategoryCount - parseInt(dJsonData.length));
                                missedTotal += (doctorCategoryCount - parseInt(dJsonData.length));
                                if (MissedDoctor > 0) {
                                    tableContentDoctorMissed += "<td style='text-align:center;text-decoration:underline;cursor:pointer;' onclick='fnNoofDocNevervisitedDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_" + jsData.Tables[2].Rows[i].Category_Code + "_" + startMonth + "_" + startYear + "_" + jsData.Tables[2].Rows[i].Category_Name + "\")'>" + (doctorCategoryCount - parseInt(dJsonData.length)) + "</td>";
                                }
                                else {
                                    tableContentDoctorMissed += "<td style='text-align:center;'>" + (doctorCategoryCount - parseInt(dJsonData.length)) + "</td>";
                                }
                            }
                            else {
                                missedTotal += doctorCategoryCount;
                                MissedDoctor += doctorCategoryCount;
                                if (doctorCategoryCount > 0) {
                                    tableContentDoctorMissed += "<td style='text-align:center;text-decoration:underline;cursor:pointer;' onclick='fnNoofDocNevervisitedDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_" + jsData.Tables[2].Rows[i].Category_Code + "_" + startMonth + "_" + startYear + "_" + jsData.Tables[2].Rows[i].Category_Name + "\")'>" + doctorCategoryCount + "</td>";
                                }
                                else {
                                    tableContentDoctorMissed += "<td style='text-align:center;'>" + doctorCategoryCount + "</td>"
                                }
                            }               
                            // No of Doctor where category Visit Missed Counts
                            doctorVisit = parseInt(jsData.Tables[2].Rows[i].Visit_Count);
                            var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Category_Code=='" + jsData.Tables[2].Rows[i].Category_Code + "' & @.Count < " + doctorVisit + ")]");
                            if (dJsonData != false) {
                                visitMissed += parseInt(dJsonData.length);
                                MissedDoctor += parseInt(dJsonData.length);
                                if (visitMissed > 0) {
                                    tableContentVisitMissed += "<td style='text-align:center;text-decoration:underline;cursor:pointer;' onclick='fnNoofDocVisitcountmissedDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_" + jsData.Tables[2].Rows[i].Category_Code + "_" + startMonth + "_" + startYear + "_" + jsData.Tables[2].Rows[i].Category_Name + "\")'>" + parseInt(dJsonData.length) + "</td>";
                                }
                                else {
                                    tableContentVisitMissed += "<td style='text-align:center;'>"+parseInt(dJsonData.length)+"</td>";
                                }
                            }
                            else {
                                tableContentVisitMissed += "<td style='text-align:center'>0</td>";
                            }
                            // Total Doctor Missed
                            if (MissedDoctor > 0) {
                                tableContentTotalDoctorMissed += "<td style='text-align:center;text-decoration:underline;cursor:pointer;' onclick='fnNoofDocVisitedandMissedCountDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_" + jsData.Tables[2].Rows[i].Category_Code + "_" + startMonth + "_" + startYear + "_" + jsData.Tables[2].Rows[i].Category_Name + "\")'>" + MissedDoctor + "</td>";
                            }
                            else {
                                tableContentTotalDoctorMissed += "<td style='text-align:center;'>" + MissedDoctor + "</td>";
                            }
                            totalMissedDoctor += MissedDoctor;
                        }
                    }

                    if (doctorTotal > 0) {
                        tableContent += "<td align='center' width='8%' onclick='fnDoctorMissedFormCategoryDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_TOTAL" + "_" + startMonth + "_" + startYear +"_"+"ALL"+ "\")' style='text-decoration:underline;cursor:pointer'>" + doctorTotal + "</td></tr>";
                    }
                    else {
                        tableContent += "<td style='text-align:center' >" + doctorTotal + "</td></tr>";
                    }
                    //Total of never visited(A)
                    if (missedTotal > 0) {
                        tableContentDoctorMissed += "<td style='text-align:center;text-decoration:underline;cursor:pointer;' onclick='fnNoofDocNevervisitedDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_TOTAL" + "_" + startMonth + "_" + startYear + "_"+"ALL"+"\")'>" + missedTotal + "</td></tr>";
                    }
                    else {
                        tableContentDoctorMissed += "<td style='text-align:center;'>" + missedTotal + "</td></tr>";
                    }
                    //No of doctors where category visit count missed(B)
                    if (visitMissed > 0) {
                        tableContentVisitMissed += "<td style='text-align:center;text-decoration:underline;cursor:pointer;' onclick='fnNoofDocVisitcountmissedDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_TOTAL" + "_" + startMonth + "_" + startYear + "_" + "ALL" + "\")'>" + visitMissed + "</td></tr>";
                    }
                    else {
                        tableContentVisitMissed += "<td style='text-align:center' >" + visitMissed + "</td></tr>";
                    }
                    //Sum of A+B
                    if (totalMissedDoctor > 0) {
                        tableContentTotalDoctorMissed += "<td style='text-align:center;text-decoration:underline;cursor:pointer;' onclick='fnNoofDocVisitedandMissedCountDetails(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_TOTAL" + "_" + startMonth + "_" + startYear + "_" + "ALL" + "\")'>" + totalMissedDoctor + "</td></tr>";
                    }
                    else {
                        tableContentTotalDoctorMissed += "<td style='text-align:center' >" + totalMissedDoctor + "</td></tr>";
                    }


                    tableContent += tableContentDoctorMissed;
                    tableContent += tableContentVisitMissed;
                    tableContent += tableContentTotalDoctorMissed;

                    tableContent += "</tbody></table>";

                    //$('#divHeader').show();
                    //$('#divMainprint').show();

                    $("#divHeader").html(tableContent);
                    $("#divMainprint").html(tableContent);
                    if ($.fn.dataTable) {
                        $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                        $.datepicker.setDefaults($.datepicker.regional['']);
                        $('#tblDoctorHeader').dataTable({
                            "sPaginationType": "full_numbers", "bDestroy": true
                                , "sDom": 'T<"clear">lfrtip'
                        })
                    };
                    fninializePrint("divMainprint", "ifrmPrint", "divHeader");
                    HideModalPopup("dvloading");
                }
                else {
                    fnMsgAlert('info', 'Doctor Missed Form Category', 'No data found.');
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
function fnDoctorMissedFormCategoryDetails(val) {
    ShowModalPopup("dvloading");
    var tableRpt = "", surName = "";
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];
    var dcrStatus = val.split('_')[4];
   // dcrStatus = dcrStatus + ',';
    var detailMonth = val.split('_')[6];
    var detailYear = val.split('_')[7];
    var categoryName = val.split('_')[8];
    if (categoryName.toUpperCase() == 'ALL') {
        categoryName = 'For all Categories';
    }
    else {
        categoryName = categoryName;
    }


    var title = $('#divPageHeader').html();
    var downLoadDate = new Date();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetDoctorMissedFromCategoryDetails',
        data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + val.split('_')[1] + '&regionCode=' + val.split('_')[0] + '&category=' + val.split('_')[5] + '&selectedMonth=' + detailMonth + '&selectedyear=' + detailYear,
        success: function (response) {          
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var divisionName = "";
            var VisitCount = 0, tpVisit = 0, DoctorVisit = 0;
            var masterDeviation = 0, tpDeviation = 0;
            $("#divModel").html('');
            if (jsData != null && jsData != undefined && jsData.Tables[0].Rows.length > 0) {
                if (jsData.Tables[0].Rows.length > 0) {

                    tableContent = "";
                    tableContent += "<div><b style='font-weight:bold;font-size:14px;font-style:italic;'>" + title + ",Doctor Master count - <span style='color:red;'>" + categoryName + "</span> report generate on " + downLoadDate.toLocaleString() + "</b></div><br>";
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorDetails' >";
                    tableContent += "<thead><tr style='display: none;' id='tblTr'>";

                    tableContent += "<th align='left' width='15%'>Doctor Name</th>";
                    tableContent += "<th align='left' width='15%'>MDL No</th>";
                    tableContent += "<th align='left' width='15%'>Category</th>";
                    tableContent += "<th align='left' width='15%'>Specialty</th>";
                    tableContent += "<th align='left' width='15%'>Local Area</th>";
                    tableContent += "<th align='left' width='15%'>Hospital Name</th>";
                    tableContent += "<th align='left' width='15%'>Master Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Planned Visits in TP (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Actual Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Planned vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Planned (Nos.)</th>";
                    tableContent += "</tr><tr>";
                    tableContent += "<th align='left' width='15%'>Doctor Name</th>";
                    tableContent += "<th align='left' width='15%'>MDL No</th>";
                    tableContent += "<th align='left' width='15%'>Category</th>";
                    tableContent += "<th align='left' width='15%'>Specialty</th>";
                    tableContent += "<th align='left' width='15%'>Local Area</th>";
                    tableContent += "<th align='left' width='15%'>Hospital Name</th>";
                    tableContent += "<th align='left' width='15%'>Master Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Planned Visits in TP (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Actual Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Planned vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Planned (Nos.)</th>";
                    var type = '[{ type: "text" }, { type: "number-range" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "number-range" }, { type: "number-range" },{ type: "number-range" },{ type: "number-range" }';
                    type += ', { type: "number-range" }, { type: "number-range" }]';

                    tableContent += "</tr>";
                    tableContent += "<tr >";
                    tableContent += "<th colspan= '12' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";

                    if (val.split('_')[5] == "TOTAL") {
                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                            tableContent += "<tr>";
                            //Sur Name Added
                            if (jsData.Tables[0].Rows[i].Sur_Name != "" && jsData.Tables[0].Rows[i].Sur_Name != null) {
                                surName = jsData.Tables[0].Rows[i].Sur_Name
                            }
                            else {
                                surName = "";
                            }
                            if (surName != '') {
                                tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[0].Rows[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Doctor_Name + "-" + surName + "</span></td>";
                            }
                            else {
                                tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[0].Rows[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Doctor_Name + "</span></td>";
                            }

                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].MDL_Number + "</td>";
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Category_Name + "</td>";
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Speciality_Name + "</td>";
                            if (jsData.Tables[0].Rows[i].Local_Area != "" && jsData.Tables[0].Rows[i].Local_Area != null) {
                                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Local_Area + "</td>";
                            }
                            else {
                                tableContent += "<td align='left' width='15%'></td>";
                            }
                            if (jsData.Tables[0].Rows[i].Hospital_Name != "" && jsData.Tables[0].Rows[i].Hospital_Name != null) {
                                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Hospital_Name + "</td>";
                            }
                            else {
                                tableContent += "<td align='left' width='15%'></td>";
                            }

                            DoctorVisit = parseInt(jsData.Tables[0].Rows[i].Visit_Count);
                            //Master Visit(A)
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Visit_Count + "</td>";
                            var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Doctor_code=='" + jsData.Tables[0].Rows[i].Doctor_Code + "')]");
                            // Visit Planned as per TP(B)
                            VisitCount = 0;
                            masterDeviation = 0;
                            tpDeviation = 0;
                            tpVisit = 0;
                            if (dJsonData != false) {
                                tpVisit = parseInt(dJsonData.length);
                                tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }
                            //  Actual Visits(C)
                            var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Doctor_Code=='" + jsData.Tables[0].Rows[i].Doctor_Code + "')]");
                            if (dJsonData != false) {
                                VisitCount = parseInt(dJsonData.length);
                                tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }
                            //Actual Vs Master(A - C)
                            if (VisitCount > 0) {
                                var deviation_Master = DoctorVisit - VisitCount
                                if (deviation_Master >= 0) {
                                    tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "<span style='color:red;'>*</span></td>";
                                }
                                //masterDeviation = (DoctorVisit - VisitCount);
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }
                            //Planned Vs Master(A - B)
                            if (VisitCount > 0) {
                                var tp_Deviation = DoctorVisit - tpVisit;
                                if (tp_Deviation >= 0) {
                                    tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "<span style='color:red;'>**</span></td>";
                                }
                                //tpDeviation = (DoctorVisit - tpVisit);
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }

                            //Actual Vs Planned(B-C)
                            if (tpVisit > 0) {
                                var Tp_Actual = tpVisit - VisitCount;
                                if (Tp_Actual >= 0) {
                                    tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "<span style='color:red;'>***</span></td>";
                                }
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }
                            //if (tpVisit > 0) {
                            //    tableContent += "<td style='text-align:center' width='15%'>" + (tpDeviation - masterDeviation) + "</td>";
                            //}
                            //else {
                            //    tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            //}

                            tableContent += "</tr>";
                        }
                    }
                    else {       
                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                            tableContent += "<tr>";
                            //Sur Name Added
                            if (jsData.Tables[0].Rows[i].Sur_Name != "" && jsData.Tables[0].Rows[i].Sur_Name != null) {
                                surName = jsData.Tables[0].Rows[i].Sur_Name
                            }
                            else {
                                surName = "";
                            }
                            if (surName != '') {
                                tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[0].Rows[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Doctor_Name + "-" + surName + "</span></td>";
                            }
                            else {
                                tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[0].Rows[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Doctor_Name + "</span></td>";
                            }
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].MDL_Number + "</td>";
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Category_Name + "</td>";
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Speciality_Name + "</td>";
                            if (jsData.Tables[0].Rows[i].Local_Area != "" && jsData.Tables[0].Rows[i].Local_Area != null) {
                                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Local_Area + "</td>";
                            }
                            else {
                                tableContent += "<td align='left' width='15%'></td>";
                            }
                            if (jsData.Tables[0].Rows[i].Hospital_Name != "" && jsData.Tables[0].Rows[i].Hospital_Name != null) {
                                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[i].Hospital_Name + "</td>";
                            }
                            else {
                                tableContent += "<td align='left' width='15%'></td>";
                            }
                            VisitCount = 0;
                            masterDeviation = 0;
                            tpDeviation = 0;
                            tpVisit = 0;
                            DoctorVisit = parseInt(jsData.Tables[0].Rows[i].Visit_Count);
                            //Master Visit(A)
                            tableContent += "<td style='text-align:center' width='15%'>" + jsData.Tables[0].Rows[i].Visit_Count + "</td>";
                            var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Doctor_code=='" + jsData.Tables[0].Rows[i].Doctor_Code + "')]");
                            // Visit Planned as per TP(B)
                            if (dJsonData != false) {
                                tpVisit = parseInt(dJsonData.length);
                                tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }
                            //  Actual Visits(C)
                            var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Doctor_Code=='" + jsData.Tables[0].Rows[i].Doctor_Code + "')]");
                            if (dJsonData != false) {
                                VisitCount = parseInt(dJsonData.length);
                                tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }
                            //Actual Vs Master(A - C)
                            if (VisitCount > 0) {
                                var deviation_Master = DoctorVisit - VisitCount
                                if (deviation_Master >= 0) {
                                    tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "<span style='color:red;'>*</span></td>";
                                }
                                //masterDeviation = (DoctorVisit - VisitCount);
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }
                            //Planned Vs Master(A - B)
                            if (VisitCount > 0) {
                                var tp_Deviation = DoctorVisit - tpVisit;
                                if (tp_Deviation >= 0) {
                                    tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "<span style='color:red;'>**</span></td>";
                                }
                                // tpDeviation = (DoctorVisit - tpVisit);
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }
                            //Actual Vs Planned(B-C)
                            if (tpVisit > 0) {
                                var Tp_Actual = tpVisit - VisitCount;
                                if (Tp_Actual >= 0) {
                                    tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "<span style='color:red;'>***</span></td>";
                                }
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>0</td>";
                            }

                            tableContent += "</tr>";

                        }
                    }
                    tableContent += "</tbody>";
                    tableContent += "</table>";

                    var jsonType = eval(type);

                    //$('#divReport').show();
                    //$('#divPrint').show();

                    $("#divReport").html(tableContent);
                    $("#divPrint").html(tableContent);
                    if ($.fn.dataTable) {
                        $('#tblDoctorDetails').dataTable({
                            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        }).columnFilter({
                            sPlaceHolder: "head:after",
                            aoColumns: jsonType
                        });
                    };

                    //Added *
                    tableRpt += "<br/><lable style='font-weight:bold;'><span style='color:red;'>*</span>Values indicates that Actuals are more than Masters(If Available)</lable><br/>";
                    tableRpt += "<lable style='font-weight:bold;'><span style='color:red;'>**</span>Values indicates that Planned more than Masters(If Available)</lable><br/>";
                    tableRpt += "<lable style='font-weight:bold;'><span style='color:red;'>***</span>Values indicates that Actuals are more than Planned(If Available)</lable><br/>";
                    $('#divImport').html(tableRpt);

                    HideModalPopup("dvloading");

                    fninializePrint("divPrint", "ifrmPrint", "divReport");
                }

                else {
                    fnMsgAlert('info', 'Report', 'No Data found.');
                    HideModalPopup("dvloading");
                }
            }

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//No of doctors never visited - A
function fnNoofDocNevervisitedDetails(val) {
    ShowModalPopup("dvloading");
    var tableRpt = "", surName = "";
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];
    var dcrStatus = val.split('_')[4];
    var detailMonth = val.split('_')[6];
    var detailYear = val.split('_')[7];
    var categoryName = val.split('_')[8];
    if (categoryName.toUpperCase() == 'ALL') {
        categoryName = 'For all Categories';
    }
    else {
        categoryName = categoryName;
    }
    var title = $('#divPageHeader').html();
    var downLoadDate = new Date();
   // dcrStatus = dcrStatus + ',';
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetNoofDocsNeverVisited',
        data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + val.split('_')[1] + '&regionCode=' + val.split('_')[0] + '&category=' + val.split('_')[5] + '&selectedMonth=' + detailMonth + '&selectedyear=' + detailYear,
        success: function (response) {
            var result = eval('(' + response + ')');
            if (result != null && result != undefined && result.length > 0) {
                var lstMissedDoctors = result[0].lstCustomers;
                var lstActualDoctors = result[0].lstActualDoctors;
                var lstTpdates = result[0].lstTpDates;
                var tableContent = "";
                var divisionName = "";
                var VisitCount = 0, tpVisit = 0, DoctorVisit = 0;
                var masterDeviation = 0, tpDeviation = 0;
                $("#divModel").html('');
                if (lstMissedDoctors.length > 0) {

                    tableContent = "";
                    tableContent += "<div><b style='font-weight:bold;font-size:14px;font-style:italic;'>" + title + ",No of Doctors Never Visited - <span style='color:red;'>" + categoryName + "</span> report generate on " + downLoadDate.toLocaleString() + "</b></div><br>";
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorDetails' >";
                    tableContent += "<thead><tr style='display: none;' id='tblTr'>";

                    tableContent += "<th align='left' width='15%'>Doctor Name</th>";
                    tableContent += "<th align='left' width='15%'>MDL No</th>";
                    tableContent += "<th align='left' width='15%'>Category</th>";
                    tableContent += "<th align='left' width='15%'>Specialty</th>";
                    tableContent += "<th align='left' width='15%'>Local Area</th>";
                    tableContent += "<th align='left' width='15%'>Hospital Name</th>";
                    tableContent += "<th align='left' width='15%'>Master Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Planned Visits in TP (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Actual Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Planned vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Planned (Nos.)</th>";
                    tableContent += "</tr><tr>";
                    tableContent += "<th align='left' width='15%'>Doctor Name</th>";
                    tableContent += "<th align='left' width='15%'>MDL No</th>";
                    tableContent += "<th align='left' width='15%'>Category</th>";
                    tableContent += "<th align='left' width='15%'>Specialty</th>";
                    tableContent += "<th align='left' width='15%'>Local Area</th>";
                    tableContent += "<th align='left' width='15%'>Hospital Name</th>";
                    tableContent += "<th align='left' width='15%'>Master Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Planned Visits in TP (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Actual Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Planned vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Planned (Nos.)</th>";
                    var type = '[{ type: "text" }, { type: "number-range" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "number-range" }, { type: "number-range" },{ type: "number-range" },{ type: "number-range" }';
                    type += ', { type: "number-range" }, { type: "number-range" }]';

                    tableContent += "</tr>";
                    tableContent += "<tr >";
                    tableContent += "<th colspan= '12' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";
                    // if (val.split('_')[5] == "TOTAL") {
                    for (var i = 0; i < lstMissedDoctors.length; i++) {

                        tableContent += "<tr>";
                        //Sur Name Added with Doctor Name
                        if (lstMissedDoctors[i].Sur_Name != "" && lstMissedDoctors[i].Sur_Name != null) {
                            surName = lstMissedDoctors[i].Sur_Name
                        }
                        else {
                            surName = "";
                        }
                        if (surName != '') {
                            tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + lstMissedDoctors[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + lstMissedDoctors[i].Doctor_Name + "-" + surName + "</span></td>";
                        }
                        else {
                            tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + lstMissedDoctors[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + lstMissedDoctors[i].Doctor_Name + "</span></td>";
                        }
                        //MDL No                        
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].MDL_Number + "</td>";
                        //Category
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Category_Name + "</td>";
                        //Speciality
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Speciality_Name + "</td>";
                        //Local Area
                        if (lstMissedDoctors[i].Local_Area != "" && lstMissedDoctors[i].Local_Area != null) {
                            tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Local_Area + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        //Hospital Name
                        if (lstMissedDoctors[i].Hospital_Name != "" && lstMissedDoctors[i].Hospital_Name != null) {
                            tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Hospital_Name + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        DoctorVisit = parseInt(lstMissedDoctors[i].Visit_Count);
                        //Master Visit(A)
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Visit_Count + "</td>";
                        var dJsonData = jsonPath(result[0].lstTpDates, "$.[?(@.Doctor_code=='" + lstMissedDoctors[i].Doctor_Code + "')]");
                        // Visit Planned as per TP(B)
                        VisitCount = 0;
                        masterDeviation = 0;
                        tpDeviation = 0;
                        tpVisit = 0;
                        if (dJsonData != false) {
                            tpVisit = parseInt(dJsonData.length);
                            tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //  Actual Visits(C)
                        var dJsonData = jsonPath(result[0].lstActualDoctors, "$.[?(@.Doctor_Code=='" + lstMissedDoctors[i].Doctor_Code + "')]");
                        if (dJsonData != false) {
                            VisitCount = parseInt(dJsonData.length);
                            tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //Actual Vs Master(A - C)
                        if (VisitCount > 0) {
                            var deviation_Master = DoctorVisit - VisitCount
                            if (deviation_Master >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "<span style='color:red;'>*</span></td>";
                            }
                            //masterDeviation = (DoctorVisit - VisitCount);
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //Planned Vs Master(A - B)
                        if (VisitCount > 0) {
                            var tp_Deviation = DoctorVisit - tpVisit;
                            if (tp_Deviation >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "<span style='color:red;'>**</span></td>";
                            }
                            //tpDeviation = (DoctorVisit - tpVisit);
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }

                        //Actual Vs Planned(B-C)
                        if (tpVisit > 0) {
                            var Tp_Actual = tpVisit - VisitCount;
                            if (Tp_Actual >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "<span style='color:red;'>***</span></td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }

                        tableContent += "</tr>";
                    }
                   
                    tableContent += "</tbody>";
                    tableContent += "</table>";

                    var jsonType = eval(type);

                    //$('#divReport').show();
                    //$('#divPrint').show();

                    $("#divReport").html(tableContent);
                    $("#divPrint").html(tableContent);
                    if ($.fn.dataTable) {
                        $('#tblDoctorDetails').dataTable({
                            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        }).columnFilter({
                            sPlaceHolder: "head:after",
                            aoColumns: jsonType
                        });
                    };

                    //Added *
                    tableRpt += "<br/><lable style='font-weight:bold;'><span style='color:red;'>*</span>Values indicates that Actuals are more than Masters(If Available)</lable><br/>";
                    tableRpt += "<lable style='font-weight:bold;'><span style='color:red;'>**</span>Values indicates that Planned more than Masters(If Available)</lable><br/>";
                    tableRpt += "<lable style='font-weight:bold;'><span style='color:red;'>***</span>Values indicates that Actuals are more than Planned(If Available)</lable><br/>";
                    $('#divImport').html(tableRpt);

                    HideModalPopup("dvloading");

                    fninializePrint("divPrint", "ifrmPrint", "divReport");
                }

                else {

                    fnMsgAlert('info', 'Report', 'No Data found.');
                    HideModalPopup("dvloading");
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
//No of doctors category visit count missed - B
function fnNoofDocVisitcountmissedDetails(val) {
    ShowModalPopup("dvloading");
    var tableRpt = "", surName = "";
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];
    var dcrStatus = val.split('_')[4];
    var detailMonth = val.split('_')[6];
    var detailYear = val.split('_')[7];
    var title = $('#divPageHeader').html();
    var downLoadDate = new Date();
    var categoryName = val.split('_')[8];
    if (categoryName.toUpperCase() == 'ALL') {
        categoryName = 'For all Categories';
    }
    else {
        categoryName = categoryName;
    }
   // dcrStatus = dcrStatus + ',';

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetNoofDocsVisitCountMissed',
        data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + val.split('_')[1] + '&regionCode=' + val.split('_')[0] + '&category=' + val.split('_')[5] + '&selectedMonth=' + detailMonth + '&selectedyear=' + detailYear,
        success: function (response) {
            var result = eval('(' + response + ')');
            if (result != null && result != undefined && result.length > 0) {
                var lstMissedDoctors = result[0].lstCustomers;
                var lstActualDoctors = result[0].lstActualDoctors;
                var lstTpdates = result[0].lstTpDates;
                var tableContent = "";
                var divisionName = "";
                var VisitCount = 0, tpVisit = 0, DoctorVisit = 0;
                var masterDeviation = 0, tpDeviation = 0;
                $("#divModel").html('');
                if (lstMissedDoctors.length > 0) {

                    tableContent = "";
                    tableContent += "<div><b style='font-weight:bold;font-size:14px;font-style:italic;'>" + title + ",No of Doctors where Category Visit Count Missed - <span style='color:red;'>" + categoryName + "</span> report generate on " + downLoadDate.toLocaleString() + "</b></div><br>";
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorDetails' >";
                    tableContent += "<thead><tr style='display: none;' id='tblTr'>";

                    tableContent += "<th align='left' width='15%'>Doctor Name</th>";
                    tableContent += "<th align='left' width='15%'>MDL No</th>";
                    tableContent += "<th align='left' width='15%'>Category</th>";
                    tableContent += "<th align='left' width='15%'>Specialty</th>";
                    tableContent += "<th align='left' width='15%'>Local Area</th>";
                    tableContent += "<th align='left' width='15%'>Hospital Name</th>";
                    tableContent += "<th align='left' width='15%'>Master Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Planned Visits in TP (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Actual Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Planned vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Planned (Nos.)</th>";
                    tableContent += "</tr><tr>";
                    tableContent += "<th align='left' width='15%'>Doctor Name</th>";
                    tableContent += "<th align='left' width='15%'>MDL No</th>";
                    tableContent += "<th align='left' width='15%'>Category</th>";
                    tableContent += "<th align='left' width='15%'>Specialty</th>";
                    tableContent += "<th align='left' width='15%'>Local Area</th>";
                    tableContent += "<th align='left' width='15%'>Hospital Name</th>";
                    tableContent += "<th align='left' width='15%'>Master Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Planned Visits in TP (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Actual Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Planned vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Planned (Nos.)</th>";
                    var type = '[{ type: "text" }, { type: "number-range" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "number-range" }, { type: "number-range" },{ type: "number-range" },{ type: "number-range" }';
                    type += ', { type: "number-range" }, { type: "number-range" }]';

                    tableContent += "</tr>";
                    tableContent += "<tr >";
                    tableContent += "<th colspan= '12' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";
                   
                    for (var i = 0; i < lstMissedDoctors.length; i++) {

                        tableContent += "<tr>";
                        //Sur Name Added with Doctor Name
                        if (lstMissedDoctors[i].Sur_Name != "" && lstMissedDoctors[i].Sur_Name != null) {
                            surName = lstMissedDoctors[i].Sur_Name
                        }
                        else {
                            surName = "";
                        }
                        if (surName != '') {
                            tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + lstMissedDoctors[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + lstMissedDoctors[i].Doctor_Name + "-" + surName + "</span></td>";
                        }
                        else {
                            tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + lstMissedDoctors[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + lstMissedDoctors[i].Doctor_Name + "</span></td>";
                        }
                        //MDL No                        
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].MDL_Number + "</td>";
                        //Category
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Category_Name + "</td>";
                        //Speciality
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Speciality_Name + "</td>";
                        //Local Area
                        if (lstMissedDoctors[i].Local_Area != "" && lstMissedDoctors[i].Local_Area != null) {
                            tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Local_Area + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        //Hospital Name
                        if (lstMissedDoctors[i].Hospital_Name != "" && lstMissedDoctors[i].Hospital_Name != null) {
                            tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Hospital_Name + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        DoctorVisit = parseInt(lstMissedDoctors[i].Visit_Count);
                        //Master Visit(A)
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Visit_Count + "</td>";
                        var dJsonData = jsonPath(result[0].lstTpDates, "$.[?(@.Doctor_code=='" + lstMissedDoctors[i].Doctor_Code + "')]");
                        // Visit Planned as per TP(B)
                        VisitCount = 0;
                        masterDeviation = 0;
                        tpDeviation = 0;
                        tpVisit = 0;
                        if (dJsonData != false) {
                            tpVisit = parseInt(dJsonData.length);
                            tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //  Actual Visits(C)
                        var dJsonData = jsonPath(result[0].lstActualDoctors, "$.[?(@.Doctor_Code=='" + lstMissedDoctors[i].Doctor_Code + "')]");
                        if (dJsonData != false) {
                            VisitCount = parseInt(dJsonData.length);
                            tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //Actual Vs Master(A - C)
                        if (VisitCount > 0) {
                            var deviation_Master = DoctorVisit - VisitCount
                            if (deviation_Master >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "<span style='color:red;'>*</span></td>";
                            }
                            //masterDeviation = (DoctorVisit - VisitCount);
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //Planned Vs Master(A - B)
                        if (VisitCount > 0) {
                            var tp_Deviation = DoctorVisit - tpVisit;
                            if (tp_Deviation >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "<span style='color:red;'>**</span></td>";
                            }
                            //tpDeviation = (DoctorVisit - tpVisit);
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }

                        //Actual Vs Planned(B-C)
                        if (tpVisit > 0) {
                            var Tp_Actual = tpVisit - VisitCount;
                            if (Tp_Actual >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "<span style='color:red;'>***</span></td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }

                        tableContent += "</tr>";
                    }
                   
                    tableContent += "</tbody>";
                    tableContent += "</table>";

                    var jsonType = eval(type);

                    //$('#divReport').show();
                    //$('#divPrint').show();

                    $("#divReport").html(tableContent);
                    $("#divPrint").html(tableContent);
                    if ($.fn.dataTable) {
                        $('#tblDoctorDetails').dataTable({
                            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        }).columnFilter({
                            sPlaceHolder: "head:after",
                            aoColumns: jsonType
                        });
                    };

                    //Added *
                    tableRpt += "<br/><lable style='font-weight:bold;'><span style='color:red;'>*</span>Values indicates that Actuals are more than Masters(If Available)</lable><br/>";
                    tableRpt += "<lable style='font-weight:bold;'><span style='color:red;'>**</span>Values indicates that Planned more than Masters(If Available)</lable><br/>";
                    tableRpt += "<lable style='font-weight:bold;'><span style='color:red;'>***</span>Values indicates that Actuals are more than Planned(If Available)</lable><br/>";
                    $('#divImport').html(tableRpt);

                    HideModalPopup("dvloading");

                    fninializePrint("divPrint", "ifrmPrint", "divReport");
                }

                else {

                    fnMsgAlert('info', 'Report', 'No Data found.');
                    HideModalPopup("dvloading");
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
//Sum of A+B - No of doctors never visited plus doctors visit count missed
function fnNoofDocVisitedandMissedCountDetails(val) {
    ShowModalPopup("dvloading");
    var tableRpt = "", surName = "";
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];
    var dcrStatus = val.split('_')[4];
    var detailMonth = val.split('_')[6];
    var detailYear = val.split('_')[7];
    var categoryName = val.split('_')[8];
    if (categoryName.toUpperCase() == 'ALL') {
        categoryName = 'For all Categories';
    }
    else {
        categoryName = categoryName;
    }

    var title = $('#divPageHeader').html();
    var downLoadDate = new Date();
    //dcrStatus = dcrStatus + ',';
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetNoofDocsNeverVisitedandMissedCount',
        data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + val.split('_')[1] + '&regionCode=' + val.split('_')[0] + '&category=' + val.split('_')[5] + '&selectedMonth=' + detailMonth + '&selectedyear=' + detailYear,
        success: function (response) {
            var result = eval('(' + response + ')');
            if (result != null && result != undefined && result.length > 0) {
                var lstMissedDoctors = result[0].lstCustomers;
                var lstActualDoctors = result[0].lstActualDoctors;
                var lstTpdates = result[0].lstTpDates;
                var tableContent = "";
                var divisionName = "";
                var VisitCount = 0, tpVisit = 0, DoctorVisit = 0;
                var masterDeviation = 0, tpDeviation = 0;
                $("#divModel").html('');
                if (lstMissedDoctors.length > 0) {
                    tableContent = "";
                    tableContent += "<div><b style='font-weight:bold;font-size:14px;font-style:italic;'>" + title + ",No of Doctors Never Visited and where category Visit missed count - <span style='color:red;'>" + categoryName + "</span> report generate on " + downLoadDate.toLocaleString() + "</b></div><br>";
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorDetails' >";
                    tableContent += "<thead><tr style='display: none;' id='tblTr'>";

                    tableContent += "<th align='left' width='15%'>Doctor Name</th>";
                    tableContent += "<th align='left' width='15%'>MDL No</th>";
                    tableContent += "<th align='left' width='15%'>Category</th>";
                    tableContent += "<th align='left' width='15%'>Specialty</th>";
                    tableContent += "<th align='left' width='15%'>Local Area</th>";
                    tableContent += "<th align='left' width='15%'>Hospital Name</th>";
                    tableContent += "<th align='left' width='15%'>Master Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Planned Visits in TP (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Actual Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Planned vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Planned (Nos.)</th>";
                    tableContent += "</tr><tr>";
                    tableContent += "<th align='left' width='15%'>Doctor Name</th>";
                    tableContent += "<th align='left' width='15%'>MDL No</th>";
                    tableContent += "<th align='left' width='15%'>Category</th>";
                    tableContent += "<th align='left' width='15%'>Specialty</th>";
                    tableContent += "<th align='left' width='15%'>Local Area</th>";
                    tableContent += "<th align='left' width='15%'>Hospital Name</th>";
                    tableContent += "<th align='left' width='15%'>Master Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Planned Visits in TP (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Actual Visits (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Planned vs. Master (Nos.)</th>";
                    tableContent += "<th align='left' width='15%'>Deviation - Actual vs. Planned (Nos.)</th>";
                    var type = '[{ type: "text" }, { type: "number-range" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "number-range" }, { type: "number-range" },{ type: "number-range" },{ type: "number-range" }';
                    type += ', { type: "number-range" }, { type: "number-range" }]';

                    tableContent += "</tr>";
                    tableContent += "<tr >";
                    tableContent += "<th colspan= '12' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";
                 
                    for (var i = 0; i < lstMissedDoctors.length; i++) {

                        tableContent += "<tr>";
                        //Sur Name Added with Doctor Name
                        if (lstMissedDoctors[i].Sur_Name != "" && lstMissedDoctors[i].Sur_Name != null) {
                            surName = lstMissedDoctors[i].Sur_Name
                        }
                        else {
                            surName = "";
                        }
                        if (surName != '') {
                            tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + lstMissedDoctors[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + lstMissedDoctors[i].Doctor_Name + "-" + surName + "</span></td>";
                        }
                        else {
                            tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + lstMissedDoctors[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + lstMissedDoctors[i].Doctor_Name + "</span></td>";
                        }
                        //MDL No                        
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].MDL_Number + "</td>";
                        //Category
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Category_Name + "</td>";
                        //Speciality
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Speciality_Name + "</td>";
                        //Local Area
                        if (lstMissedDoctors[i].Local_Area != "" && lstMissedDoctors[i].Local_Area != null) {
                            tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Local_Area + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        //Hospital Name
                        if (lstMissedDoctors[i].Hospital_Name != "" && lstMissedDoctors[i].Hospital_Name != null) {
                            tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Hospital_Name + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        DoctorVisit = parseInt(lstMissedDoctors[i].Visit_Count);
                        //Master Visit(A)
                        tableContent += "<td align='left' width='15%'>" + lstMissedDoctors[i].Visit_Count + "</td>";
                        var dJsonData = jsonPath(result[0].lstTpDates, "$.[?(@.Doctor_code=='" + lstMissedDoctors[i].Doctor_Code + "')]");
                        // Visit Planned as per TP(B)
                        VisitCount = 0;
                        masterDeviation = 0;
                        tpDeviation = 0;
                        tpVisit = 0;
                        if (dJsonData != false) {
                            tpVisit = parseInt(dJsonData.length);
                            tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //  Actual Visits(C)
                        var dJsonData = jsonPath(result[0].lstActualDoctors, "$.[?(@.Doctor_Code=='" + lstMissedDoctors[i].Doctor_Code + "')]");
                        if (dJsonData != false) {
                            VisitCount = parseInt(dJsonData.length);
                            tableContent += "<td style='text-align:center' width='15%'>" + parseInt(dJsonData.length) + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //Actual Vs Master(A - C)
                        if (VisitCount > 0) {
                            var deviation_Master = DoctorVisit - VisitCount
                            if (deviation_Master >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + deviation_Master + "<span style='color:red;'>*</span></td>";
                            }
                            //masterDeviation = (DoctorVisit - VisitCount);
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }
                        //Planned Vs Master(A - B)
                        if (VisitCount > 0) {
                            var tp_Deviation = DoctorVisit - tpVisit;
                            if (tp_Deviation >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + tp_Deviation + "<span style='color:red;'>**</span></td>";
                            }
                            //tpDeviation = (DoctorVisit - tpVisit);
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }

                        //Actual Vs Planned(B-C)
                        if (tpVisit > 0) {
                            var Tp_Actual = tpVisit - VisitCount;
                            if (Tp_Actual >= 0) {
                                tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' width='15%'>" + Tp_Actual + "<span style='color:red;'>***</span></td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center' width='15%'>0</td>";
                        }

                        tableContent += "</tr>";
                    }
                   
                    tableContent += "</tbody>";
                    tableContent += "</table>";

                    var jsonType = eval(type);

                    //$('#divReport').show();
                    //$('#divPrint').show();

                    $("#divReport").html(tableContent);
                    $("#divPrint").html(tableContent);
                    if ($.fn.dataTable) {
                        $('#tblDoctorDetails').dataTable({
                            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        }).columnFilter({
                            sPlaceHolder: "head:after",
                            aoColumns: jsonType
                        });
                    };

                    //Added *
                    tableRpt += "<br/><lable style='font-weight:bold;'><span style='color:red;'>*</span>Values indicates that Actuals are more than Masters(If Available)</lable><br/>";
                    tableRpt += "<lable style='font-weight:bold;'><span style='color:red;'>**</span>Values indicates that Planned more than Masters(If Available)</lable><br/>";
                    tableRpt += "<lable style='font-weight:bold;'><span style='color:red;'>***</span>Values indicates that Actuals are more than Planned(If Available)</lable><br/>";
                    $('#divImport').html(tableRpt);

                    HideModalPopup("dvloading");

                    fninializePrint("divPrint", "ifrmPrint", "divReport");
                }

                else {

                    fnMsgAlert('info', 'Report', 'No Data found.');
                    HideModalPopup("dvloading");
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

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
function fnDailyStatusReport() {

    ShowModalPopup("dvloading");
    var userCode = $('#hdnUserCode').val();

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Daily Status Report.', 'Select month and year');
        HideModalPopup("dvloading");
        return false;
    }
    var selectedMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var selectedYear = $('#txtFrom').val().split('-')[1];
    var days = daysInMonth(selectedMonth, selectedYear);

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetDailyStatusReport',
        data: 'month=' + selectedMonth + '&year=' + selectedYear + '&userCode=' + $("#hdnUserCode").val(),
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "", divisionName = "", fieldStatus = "", sunday = "", activityName = "";
            var category = "", PlaceWork = "", enterdDate = "", dcrStatus = "", approvedDate = "";
            var totalDoctor = 0;
            var chemisitPob = 0.0, stockiestPob = 0.0, ownProduct = 0.0, competitorProduct = 0.0, expenseAmt = 0.0;
            var tblContent = "";

            var totalDocMet = 0, totalMorningMet = 0, totalEveMet = 0, totalChemistMet = 0, totalStockiestMet = 0, totalRCPACount = 0;
            var totalStockiestpob = 0.0, totalChemistPob = 0.0, toatlMyRCPA = 0.0, totalCom = 0.0, totalExpenseAmt = 0.0;
            var toatalunlistedDocmet = 0;

            var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >User Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td style='text-align:left' >Division Name</td>";
                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                divisionName = "";
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {
                        divisionName += dJsonData[j].Division_Name + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }
                    tableContent += "<td style='text-align:left' >" + divisionName + "</td>";
                }
                else {
                    tableContent += "<td style='text-align:left' ></td>";
                }
                tableContent += "<td style='text-align:left' >Manager Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Employee Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                tableContent += "<td style='text-align:left' >Date of Joining</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                tableContent += "<td style='text-align:left' >Manager Territory name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Region Name</td>";
                tableContent += "<td style='text-align:left'  colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table><br/>";
                $("#divHeader").html(tableContent);

                tblContent += tableContent;
                tableContent = "";
                var iRow = 20;
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDailyStatusReport' ><thead>";
                tableContent += "<tr style='display: none;' id='tblTrDay'>";
                tableContent += "<th align='left' width='15%' >Date</th>";
                tableContent += "<th align='left' width='15%' >Activity Name</th>";
                tableContent += "<th align='left' width='15%' >Place of Worked</th>";
                tableContent += "<th align='left' width='15%' >Category</th>";
                tableContent += "<th align='left' width='15%' >CP Name</th>";
                var type = '[{ type: "date-range" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }';
                if (jsData.Tables[2].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                        iRow++;
                        type += ', { type: "number-range" }';
                        tableContent += "<th align='left' width='15%' >" + jsData.Tables[2].Rows[i].Category_Name + "  Drs Met</th>";
                    }
                }
                tableContent += "<th align='left' width='15%' >Unlisted Dr Met</th>";
                tableContent += "<th align='left' width='15%' >Total Dr Met</th>";
                tableContent += "<th align='left' width='15%' >No of Drs Met Morning</th>";
                tableContent += "<th align='left' width='15%' >No of Drs Met Evening</th>";
                tableContent += "<th align='left' width='15%' >No of Chemist Met</th>";
                tableContent += "<th align='left' width='15%' >Chemist POB</th>";
                tableContent += "<th align='left' width='15%' >No of Stockist Met</th>";
                tableContent += "<th align='left' width='15%' >Stockist POB</th>";
                tableContent += "<th align='left' width='15%' >No of Drs Covered in RCPA</th>";
                tableContent += "<th align='left' width='15%' >My product RCPA Business</th>";
                tableContent += "<th align='left' width='15%' >Compitator Brand Business</th>";
                tableContent += "<th align='left' width='15%' >Expense Amount</th>";
                tableContent += "<th align='left' width='15%' >DCR Submitted Date</th>";
                tableContent += "<th align='left' width='15%' >DCR Status</th>";
                tableContent += "<th align='left' width='15%' >Approved Date</th>";
                tableContent += "</tr>";

                type += ',{ type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" },{ type: "number-range" },{ type: "number-range" }';
                type += ',{ type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "date-range" },';
                type += '{ type: "text" }, { type: "date-range" }]';

                tableContent += "<tr>";
                tableContent += "<th align='left' width='15%' >Date</th>";
                tableContent += "<th align='left' width='15%' >Activity Name</th>";
                tableContent += "<th align='left' width='15%' >Place of Worked</th>";
                tableContent += "<th align='left' width='15%' >Category</th>";
                tableContent += "<th align='left' width='15%' >CP Name</th>";

                if (jsData.Tables[2].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                        tableContent += "<th align='left' width='15%' >" + jsData.Tables[2].Rows[i].Category_Name + "  Drs Met</th>";
                    }
                }
                tableContent += "<th align='left' width='15%' >Unlisted Dr Met</th>";
                tableContent += "<th align='left' width='15%' >Total Dr Met</th>";
                tableContent += "<th align='left' width='15%' >No of Drs Met Morning</th>";
                tableContent += "<th align='left' width='15%' >No of Drs Met Evening</th>";
                tableContent += "<th align='left' width='15%' >No of Chemist Met</th>";
                tableContent += "<th align='left' width='15%' >Chemist POB</th>";
                tableContent += "<th align='left' width='15%' >No of Stockist Met</th>";
                tableContent += "<th align='left' width='15%' >Stockist POB</th>";
                tableContent += "<th align='left' width='15%' >No of Drs Covered in RCPA</th>";
                tableContent += "<th align='left' width='15%' >My product RCPA Business</th>";
                tableContent += "<th align='left' width='15%' >Compitator Brand Business</th>";
                tableContent += "<th align='left' width='15%' >Expense Amount</th>";
                tableContent += "<th align='left' width='15%' >DCR Submitted Date</th>";
                tableContent += "<th align='left' width='15%' >DCR Status</th>";
                tableContent += "<th align='left' width='15%' >Approved Date</th>";
                tableContent += "</tr>";

                tableContent += "<tr >";
                tableContent += "<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggleDay' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeHeader(\"spnDivToggleDay\",\"tblTrDay\")'>Show Filter</span></th>";
                tableContent += "</tr>";

                tableContent += "</thead><tbody>";

                if (selectedMonth < 10) {
                    selectedMonth = "0" + selectedMonth;
                }
                var dt1 = new Date(selectedYear + "-" + selectedMonth + "-01");
                for (var j = 0; j < days; j++) {
                    //  var temp = new Date(selectedYear, selectedMonth, (j + 1));
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
                    fieldStatus = "";
                    var date = day + "/" + month + "/" + temp.getFullYear();
                    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.DCR_Date=='" + date + "')]");
                    if (dJsonData != false) {

                        var dJsonH = jsonPath(jsData, "$.Tables[4].Rows[?(@.Holiday_Date=='" + date + "')]");
                        if (dJsonH != false) {
                            fieldStatus = "Holiday :" + dJsonH[0].Holiday_Name;
                        }
                        if (weekday[temp.getDay()] == "Sunday") {
                            fieldStatus = "Sunday";
                        }
                        activityName = "";
                        category = "";
                        PlaceWork = "";
                        dcrStatus = "";
                        enterdDate = "";
                        approvedDate = "";

                        for (var k = 0; k < dJsonData.length; k++) {

                            tableContent += "<tr>";
                            tableContent += "<td align='left' width='15%'>" + date + "</td>";
                            if (dJsonData[k].Flag == "Field") {
                                activityName = "Field";
                                category = dJsonData[k].Category;
                                PlaceWork = dJsonData[k].Place_Worked;
                                dcrStatus = dJsonData[k].DCR_Status;
                                enterdDate = dJsonData[k].DCR_Entered_Date;

                                if (dJsonData[k].DCR_Status == "Approved") {
                                    if (dJsonData[k].Approved_Date != "" && dJsonData[k].Approved_Date != null) {
                                        approvedDate = dJsonData[k].Approved_Date;
                                    }
                                }
                                else {
                                    approvedDate = " ";
                                }
                            }
                            else if (dJsonData[k].Flag == "Attendance") {
                                var dJsonDataA = jsonPath(jsData, "$.Tables[5].Rows[?(@.DCR_Date=='" + date + "')]");
                                if (dJsonDataA != false) {
                                    for (var index = 0; index < dJsonDataA.length; index++) {
                                        activityName += dJsonDataA[index].Activity_Name + ",";
                                    }
                                }
                                else {
                                    activityName = "Attendance,";
                                }
                                activityName = activityName.substring(0, activityName.length - 1);
                                category = dJsonData[k].Category;
                                PlaceWork = dJsonData[k].Place_Worked;
                                dcrStatus = dJsonData[k].DCR_Status;
                                enterdDate = dJsonData[k].DCR_Entered_Date;
                                if (dJsonData[k].DCR_Status == "Approved") {
                                    if (dJsonData[k].Approved_Date != "" && dJsonData[k].Approved_Date != null) {
                                        approvedDate = dJsonData[k].Approved_Date;
                                    }
                                }
                                else {
                                    approvedDate = " ";
                                }
                            }
                            else if (dJsonData[k].Flag == "Leave") {
                                var dJsonDataL = jsonPath(jsData, "$.Tables[6].Rows[?(@.DCR_Date=='" + date + "')]");
                                if (dJsonDataL != false) {
                                    activityName = dJsonDataL[0].Leave_Type_Name;
                                }
                                else {
                                    activityName = "Leave";
                                }

                                dcrStatus = dJsonData[k].DCR_Status;
                                enterdDate = dJsonData[k].DCR_Entered_Date;
                                if (dJsonData[k].DCR_Status == "Approved") {
                                    if (dJsonData[k].Approved_Date != "" && dJsonData[k].Approved_Date != null) {
                                        approvedDate = dJsonData[k].Approved_Date;
                                    }
                                }
                                else {
                                    approvedDate = " ";
                                }
                            }
                            if (fieldStatus != "") {
                                tableContent += "<td align='left' width='15%' >" + fieldStatus + "(" + activityName + ")</td>";
                            }
                            else {
                                if (activityName != "") {
                                    tableContent += "<td align='left' width='15%' >" + activityName + "</td>";
                                }
                                else {
                                    tableContent += "<td align='left' width='15%' >" + fieldStatus + "</td>";
                                }
                            }

                            if (dJsonData[k].Flag != "Leave") {
                                tableContent += "<td align='left' width='15%'>" + PlaceWork + "</td>";
                                tableContent += "<td align='left' width='15%'>" + category + "</td>";
                            }
                            else {
                                tableContent += "<td align='left' width='15%'></td>";
                                tableContent += "<td align='left' width='15%'></td>";
                            }
                            totalDoctor = 0;

                            if (dJsonData[k].Flag == "Field") {

                                if (dJsonData[k].CP_Name != "" && dJsonData[k].CP_Name != null) {
                                    tableContent += "<td align='left' width='15%'>" + dJsonData[k].CP_Name + "</td>";
                                }
                                else {
                                    tableContent += "<td align='left' width='15%'></td>";
                                }
                                for (var index = 0; index < jsData.Tables[2].Rows.length; index++) {
                                    var dJsonDataC = jsonPath(jsData, "$.Tables[7].Rows[?(@.DCR_Date=='" + date + "' & @.Category=='" + jsData.Tables[2].Rows[index].Category_Code + "')]");

                                    if (dJsonDataC != false) {
                                        totalDoctor += parseInt(dJsonDataC.length);
                                        totalDocMet += parseInt(dJsonDataC.length);
                                        tableContent += "<td style='text-align:center;' >" + dJsonDataC.length + "</td>";
                                    }
                                    else {
                                        tableContent += "<td style='text-align:center;'>0</td>";
                                    }
                                }
                                var dJsonDataunlisted = jsonPath(jsData, "$.Tables[14].Rows[?(@.DCR_Date=='" + date + "')]");
                                unlistedDoctor = 0;
                                if (dJsonDataunlisted != false && dJsonDataunlisted != undefined && dJsonDataunlisted != '') {

                                    unlistedDoctor += parseFloat(dJsonDataunlisted[0].Doctor_Count);
                                    totalDocMet += parseFloat(dJsonDataunlisted[0].Doctor_Count);
                                    totalDoctor += parseFloat(dJsonDataunlisted[0].Doctor_Count);
                                    toatalunlistedDocmet += parseFloat(dJsonDataunlisted[0].Doctor_Count);
                                }


                                tableContent += "<td style='text-align:center;'>" + unlistedDoctor + "</td>";
                                if (totalDoctor > 0) {
                                    tableContent += "<td align='center' onclick='fnDailyStatusDoctorView(\"" + dJsonData[k].DCR_Code + "_" + $("#hdnUserCode").val() + "_F\")' style='text-decoration:underline;cursor:pointer'>" + totalDoctor + "</td>";

                                }
                                else {
                                    tableContent += "<td style='text-align:center;'>0</td>";
                                }
                                morningmet = 0;
                                var dJsonDataMode = jsonPath(jsData, "$.Tables[15].Rows[?(@.DCR_Date=='" + date + "' & @.Visit_Mode=='AM')]");
                                if (dJsonDataMode != false) {
                                    morningmet += parseInt(dJsonDataMode.length);
                                    totalMorningMet += parseInt(dJsonDataMode.length);
                                }



                                var dJsonDataMode = jsonPath(jsData, "$.Tables[7].Rows[?(@.DCR_Date=='" + date + "' & @.Visit_Mode=='AM')]");
                                if (dJsonDataMode != false) {
                                    morningmet += parseInt(dJsonDataMode.length);
                                    tableContent += "<td style='text-align:center;'>" + morningmet + "</td>";
                                    totalMorningMet += parseInt(dJsonDataMode.length);
                                }
                                else {
                                    tableContent += "<td style='text-align:center;'>" + morningmet + "</td>";
                                }


                                Eveningmet = 0;
                                var dJsonDataMode = jsonPath(jsData, "$.Tables[15].Rows[?(@.DCR_Date=='" + date + "' & @.Visit_Mode=='PM')]");
                                if (dJsonDataMode != false) {
                                    Eveningmet += parseInt(dJsonDataMode.length);
                                    totalEveMet += parseInt(dJsonDataMode.length);
                                }


                                var dJsonDataMode = jsonPath(jsData, "$.Tables[7].Rows[?(@.DCR_Date=='" + date + "' & @.Visit_Mode=='PM')]");
                                if (dJsonDataMode != false) {
                                    Eveningmet += parseInt(dJsonDataMode.length);
                                    tableContent += "<td style='text-align:center;'>" + Eveningmet + "</td>";
                                    totalEveMet += parseInt(dJsonDataMode.length);
                                }
                                else {
                                    tableContent += "<td style='text-align:center;'>" + Eveningmet + "</td>";
                                }
                                chemisitPob = 0.0;
                                var dJsonDataMode = jsonPath(jsData, "$.Tables[8].Rows[?(@.DCR_Date=='" + date + "')]");
                                if (dJsonDataMode != false) {
                                    tableContent += "<td style='text-align:center;'>" + dJsonDataMode.length + "</td>";
                                    totalChemistMet += parseInt(dJsonDataMode.length);
                                    for (var l = 0; l < dJsonDataMode.length; l++) {
                                        chemisitPob += parseFloat(dJsonDataMode[l].PO_Amount);
                                        totalChemistPob += parseFloat(dJsonDataMode[l].PO_Amount);
                                    }
                                }
                                else {
                                    tableContent += "<td style='text-align:center;'>0</td>";
                                }
                                tableContent += "<td style='text-align:center;'>" + Math.round(chemisitPob * 100) / 100 + "</td>";
                                stockiestPob = 0.0;
                                var dJsonDataMode = jsonPath(jsData, "$.Tables[9].Rows[?(@.DCR_Date=='" + date + "')]");
                                if (dJsonDataMode != false) {
                                    totalStockiestMet += parseInt(dJsonDataMode.length);
                                    tableContent += "<td style='text-align:center;'>" + dJsonDataMode.length + "</td>";
                                    for (var l = 0; l < dJsonDataMode.length; l++) {
                                        totalStockiestpob += parseFloat(dJsonDataMode[l].PO_Amount);
                                        stockiestPob += parseFloat(dJsonDataMode[l].PO_Amount);
                                    }
                                }
                                else {
                                    tableContent += "<td style='text-align:center;'>0</td>";
                                }
                                tableContent += "<td style='text-align:center;'>" + Math.round(stockiestPob * 100) / 100 + "</td>";

                                var dJsonDataMode = jsonPath(jsData, "$.Tables[10].Rows[?(@.DCR_Date=='" + date + "')]");
                                if (dJsonDataMode != false) {
                                    tableContent += "<td style='text-align:center;'>" + dJsonDataMode.length + "</td>";
                                    totalRCPACount += parseInt(dJsonDataMode.length);
                                }
                                else {
                                    tableContent += "<td style='text-align:center;'>0</td>";
                                }

                                ownProduct = 0.0;
                                var dJsonDataMode = jsonPath(jsData, "$.Tables[11].Rows[?(@.DCR_Date=='" + date + "')]");
                                if (dJsonDataMode != false) {
                                    for (var l = 0; l < dJsonDataMode.length; l++) {
                                        ownProduct += parseFloat(dJsonDataMode[l].Price);
                                        toatlMyRCPA += parseFloat(dJsonDataMode[l].Price);
                                    }
                                }
                                tableContent += "<td style='text-align:center;'>" + Math.round(ownProduct * 100) / 100 + "</td>";

                                competitorProduct = 0.0;
                                var dJsonDataMode = jsonPath(jsData, "$.Tables[12].Rows[?(@.DCR_Date=='" + date + "')]");
                                if (dJsonDataMode != false) {
                                    for (var l = 0; l < dJsonDataMode.length; l++) {
                                        competitorProduct += parseFloat(dJsonDataMode[l].Price);
                                        totalCom += parseFloat(dJsonDataMode[l].Price);
                                    }
                                }
                                tableContent += "<td style='text-align:center;'>" + Math.round(competitorProduct * 100) / 100 + "</td>";
                                expenseAmt = 0.0;
                                var dJsonDataMode = jsonPath(jsData, "$.Tables[13].Rows[?(@.DCR_Date=='" + date + "' & @.DCR_Flag=='F')]");
                                if (dJsonDataMode != false) {
                                    for (var l = 0; l < dJsonDataMode.length; l++) {
                                        expenseAmt += parseFloat(dJsonDataMode[l].Total);
                                        totalExpenseAmt += parseFloat(dJsonDataMode[l].Total);
                                    }
                                    tableContent += "<td align='center' onclick='fnDailyStatusExpenseView(\"" + dJsonDataMode[0].DCR_Code + "_" + $("#hdnUserCode").val() + "_F\")' style='text-decoration:underline;cursor:pointer'>" + expenseAmt + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center;'>" + expenseAmt + "</td>";
                                }
                                tableContent += "<td align='left' width='15%'>" + enterdDate + "</td>";
                                tableContent += "<td align='left' width='15%'>" + dcrStatus + "</td>";
                                tableContent += "<td align='left' width='15%'>" + approvedDate + "</td>";
                            }
                            else {

                                tableContent += "<td align='left' width='15%'></td>";
                                for (var index = 0; index < jsData.Tables[2].Rows.length; index++) {
                                    tableContent += "<td align='left' width='15%' ></td>";
                                }
                                tableContent += "<td align='left' width='15%'><td align='left' width='15%'></td><td align='left' width='15%'></td><td align='left' width='15%'></td>";
                                tableContent += "<td align='left' width='15%'></td><td align='left' width='15%'></td><td align='left' width='15%'></td>";
                                tableContent += "<td align='left' width='15%'></td><td align='left' width='15%'></td><td align='left' width='15%'></td>";

                                tableContent += "<td align='left' width='15%'>";
                                expenseAmt = 0.0;
                                if (dJsonData[k].Flag == "Attendance") {
                                    var dJsonDataMode = jsonPath(jsData, "$.Tables[13].Rows[?(@.DCR_Date=='" + date + "' & @.DCR_Flag=='A')]");
                                    if (dJsonDataMode != false) {
                                        for (var l = 0; l < dJsonDataMode.length; l++) {
                                            expenseAmt += parseFloat(dJsonDataMode[l].Total);
                                        }
                                        tableContent += "<td align='center' onclick='fnDailyStatusExpenseView(\"" + dJsonDataMode[0].DCR_Code + "_" + $("#hdnUserCode").val() + "_A\")' style='text-decoration:underline;cursor:pointer'>" + expenseAmt + "</td>";
                                    }
                                    else {
                                        tableContent += "<td style='text-align:center;'></td>";
                                    }
                                }
                                else {
                                    tableContent += "<td style='text-align:center;'></td>";
                                }
                                tableContent += "<td align='left' width='15%'>" + enterdDate + "</td>";
                                tableContent += "<td align='left' width='15%'>" + dcrStatus + "</td>";
                                tableContent += "<td align='left' width='15%'>" + approvedDate + "</td>";
                            }
                            tableContent += "</tr>";
                        }
                    }
                    else {

                        var dJsonH = jsonPath(jsData, "$.Tables[4].Rows[?(@.Holiday_Date=='" + date + "')]");
                        if (dJsonH != false) {
                            fieldStatus = "Holiday";
                        }
                        else if (weekday[temp.getDay()] == "Sunday") {
                            fieldStatus = "Sunday";
                        }
                        else {
                            fieldStatus = "No Report";
                        }
                        tableContent += "<tr>";
                        tableContent += "<td align='left' width='15%'>" + date + "</td>";
                        tableContent += "<td align='left' width='15%'>" + fieldStatus + "</td>";
                        tableContent += "<td align='left' width='15%'></td>";
                        tableContent += "<td align='left' width='15%'></td>";
                        tableContent += "<td align='left' width='15%'></td>";
                        for (var k = 0; k < jsData.Tables[2].Rows.length; k++) {
                            tableContent += "<td align='left' width='15%' ></td>";
                        }
                        tableContent += "<td align='left' width='15%'><td align='left' width='15%'></td><td align='left' width='15%'></td><td align='left' width='15%'></td>";
                        tableContent += "<td align='left' width='15%'></td><td align='left' width='15%'></td><td align='left' width='15%'></td>";
                        tableContent += "<td align='left' width='15%'></td><td align='left' width='15%'></td><td align='left' width='15%'></td>";
                        tableContent += "<td align='left' width='15%'></td><td align='left' width='15%'></td><td align='left' width='15%'></td>";
                        tableContent += "<td align='left' width='15%'></td><td align='left' width='15%'></td>";
                        tableContent += "</tr>";
                    }
                }
                tableContent += "<tr>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'></th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'></th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'></th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'></th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;' >Total</th>";
                for (var k = 0; k < jsData.Tables[2].Rows.length; k++) {

                    var dJsonDataC = jsonPath(jsData, "$.Tables[7].Rows[?(@.Category=='" + jsData.Tables[2].Rows[k].Category_Code + "')]");
                    if (dJsonDataC != false) {

                        tableContent += "<th style='text-align:center;background-color:#C0C0C0;' >" + dJsonDataC.length + "</th>";
                    }
                    else {
                        tableContent += "<th style='text-align:center;background-color:#C0C0C0;' ></th>";
                    }
                }

                tableContent += "<th style='text-align:center;background-color:#C0C0C0;' >" + toatalunlistedDocmet + "</th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'>" + totalDocMet + "</th><th style='text-align:center;background-color:#C0C0C0;'>" + totalMorningMet + "</th><th style='text-align:center;background-color:#C0C0C0;'>" + totalEveMet + "</th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'>" + totalChemistMet + "</th><th style='text-align:center;background-color:#C0C0C0;'>" + Math.round(totalChemistPob * 100) / 100 + "</th><th style='text-align:center;background-color:#C0C0C0;'>" + totalStockiestMet + "</th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'>" + Math.round(totalStockiestpob * 100) / 100 + "</th><th style='text-align:center;background-color:#C0C0C0;'>" + totalRCPACount + "</th><th style='text-align:center;background-color:#C0C0C0;'>" + Math.round(toatlMyRCPA * 100) / 100 + "</th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'>" + Math.round(totalCom * 100) / 100 + "</th><th style='text-align:center;background-color:#C0C0C0;'>" + Math.round(totalExpenseAmt * 100) / 100 + "</th><th style='text-align:center;background-color:#C0C0C0;'></th>";
                tableContent += "<th style='text-align:center;background-color:#C0C0C0;'></th><th style='text-align:center;background-color:#C0C0C0;'></th>";

                tableContent += "</tbody></table>";

                tblContent += tableContent;
                var jsonType = eval(type);
                $("#divReport").html(tableContent);
                $("#divPrint").html(tblContent);
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tblDailyStatusReport').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                HideModalPopup("dvloading");
                $('#dvPrint').remove();

                fninializePrint("divPrint", "ifrmPrint", "divReport");
            }
            else {
                fnMsgAlert('info', 'Daily Status Report.', 'No Data found');
                HideModalPopup("dvloading");
            }

        },
        error: function () {
            fnMsgAlert('info', 'Daily Status Report.', 'Error');
            HideModalPopup("dvloading");
        }
    });
}

function fnDailyStatusDoctorView(val) {
    ShowModalPopup("dvloading");
    var dcrCode = val.split('_')[0];
    var userCode = val.split('_')[1];
    var flag = val.split('_')[2];

    $.ajax({
        type: 'POST',
        url: '../ReportsLevelTwo/GetDailyStatusDoctorPopup',
        data: 'dcrCode=' + dcrCode + '&userCode=' + userCode + '&flag=' + flag,
        success: function (response) {
            jsData = eval('(' + response + ')');
            $("#divModel").html('');
            var tableContent = "", divisionName = "", tblContent = "";
            var ownProduct = 0.0, competitorProduct = 0.0;
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >User Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td style='text-align:left' >Division Name</td>";
                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                divisionName = "";
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {
                        divisionName += dJsonData[j].Division_Name + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }
                    tableContent += "<td style='text-align:left' >" + divisionName + "</td>";
                }
                else {
                    tableContent += "<td style='text-align:left' ></td>";
                }
                tableContent += "<td style='text-align:left' >Manager Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Employee Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                tableContent += "<td style='text-align:left' >Date of Joining</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                tableContent += "<td style='text-align:left' >Manager Territory name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Region Name</td>";
                tableContent += "<td style='text-align:left'  colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divHeaderpop").html(tableContent);
                tblContent += tableContent;
                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDailyStatusDoctor' >";
                tableContent += "<thead><tr style='display: none;' id='tblTrdoc'>";
                tableContent += "<th style='text-align:left;width: 15%' >Doctor Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >MDL/SVL No</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Category</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Speciality</th>";
                tableContent += "<th style='text-align:left;width: 15%' >CP Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Visit Mode</th>";
                tableContent += "<th style='text-align:left;width: 15%' >No of Chemist Linked</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Chemist POB</th>";
                tableContent += "<th style='text-align:left;width: 15%' >My Product RCPA business</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Compitator Brand RCPA Business</th>";
                tableContent += "</tr><tr>";
                tableContent += "<th style='text-align:left;width: 15%' >Doctor Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >MDL/SVL No</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Category</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Speciality</th>";
                tableContent += "<th style='text-align:left;width: 15%' >CP Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Visit Mode</th>";
                tableContent += "<th style='text-align:left;width: 15%' >No of Chemist Linked</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Chemist POB</th>";
                tableContent += "<th style='text-align:left;width: 15%' >My Product RCPA business</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Compitator Brand RCPA Business</th>";

                var type = '[{ type: "text" },{ type: "number-range" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }';
                type += ',{ type: "text" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';
                tableContent += "</tr>";
                tableContent += "<tr >";
                tableContent += "<th colspan= '10' align='left'  ><span id='spnDivToggleDoc' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeHeader(\"spnDivToggleDoc\",\"tblTrdoc\")'>Show Filter</span></th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                var totalAmount = 0.0;
                if (jsData.Tables[2].Rows.length > 0) {

                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {

                        tableContent += "<tr>";
                        tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Doctor_Name + "</td>";
                        if (jsData.Tables[2].Rows[i].MDL_Number != "" && jsData.Tables[2].Rows[i].MDL_Number != null) {
                            tableContent += "<td style='text-align:center;'>" + jsData.Tables[2].Rows[i].MDL_Number + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:left;'></td>";
                        }


                        if (jsData.Tables[2].Rows[i].Category_Name != "" && jsData.Tables[2].Rows[i].Category_Name != null) {
                            tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Category_Name + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:left;'></td>";
                        }


                        if (jsData.Tables[2].Rows[i].Speciality_Name != "" && jsData.Tables[2].Rows[i].Speciality_Name != null) {
                            tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Speciality_Name + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:left;'></td>";
                        }

                        if (jsData.Tables[2].Rows[i].CP_Name != "" && jsData.Tables[2].Rows[i].CP_Name != null) {
                            tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].CP_Name + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:left;'></td>";
                        }

                        if (jsData.Tables[2].Rows[i].Doctor_Visit_Time != "" && jsData.Tables[2].Rows[i].Doctor_Visit_Time != null) {
                            tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Doctor_Visit_Time + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Visit_Mode + "</td>";
                        }
                        var chemisitPob = 0.0;
                        var dJsonDataMode = jsonPath(jsData, "$.Tables[3].Rows[?(@.Doctor_Code=='" + jsData.Tables[2].Rows[i].Doctor_Code + "')]");
                        if (dJsonDataMode != false) {
                            tableContent += "<td style='text-align:center;'>" + dJsonDataMode.length + "</td>";
                            for (var l = 0; l < dJsonDataMode.length; l++) {
                                chemisitPob += parseFloat(dJsonDataMode[l].PO_Amount);
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center;' width='15%'>0</td>";
                        }
                        tableContent += "<td style='text-align:center;'>" + Math.round(chemisitPob * 100) / 100 + "</td>";
                        ownProduct = 0.0;
                        var dJsonDataMode = jsonPath(jsData, "$.Tables[4].Rows[?(@.Doctor_Code=='" + jsData.Tables[2].Rows[i].Doctor_Code + "')]");
                        if (dJsonDataMode != false) {
                            for (var l = 0; l < dJsonDataMode.length; l++) {
                                ownProduct += parseFloat(dJsonDataMode[l].Price);
                            }
                        }
                        tableContent += "<td style='text-align:center;'>" + Math.round(ownProduct * 100) / 100 + "</td>";
                        competitorProduct = 0.0;
                        var dJsonDataMode = jsonPath(jsData, "$.Tables[5].Rows[?(@.Doctor_Code=='" + jsData.Tables[2].Rows[i].Doctor_Code + "')]");
                        if (dJsonDataMode != false) {
                            for (var l = 0; l < dJsonDataMode.length; l++) {
                                competitorProduct += parseFloat(dJsonDataMode[l].Price);
                            }
                        }
                        tableContent += "<td style='text-align:center;'>" + Math.round(competitorProduct * 100) / 100 + "</td>";
                        tableContent += "</tr>";
                    }
                }
                tableContent += "</tbody>";
                tableContent += "</table>";
                tblContent += tableContent;
                var jsonType = eval(type);
                $("#divPrintSub").html('');
                $("#divPrintSub").html(tblContent);
                $("#divModel").html(tableContent);
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tblDailyStatusDoctor').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };

                $('#dvPrint').remove();

                fninializePrint("divPrintSub", "ifrmPrintSub", "divModel");
                HideModalPopup("dvloading");
                ShowModalPopup('modal');
            }

            else {

                fnMsgAlert('info', 'Daily Status Report', 'No Data found.');
                HideModalPopup("dvloading");
            }

        },
        error: function () {

            fnMsgAlert('info', 'Report', 'Error.');

            HideModalPopup("dvloading");
        }
    });
}
function fnDailyStatusExpenseView(val) {
    ShowModalPopup("dvloading");
    var dcrCode = val.split('_')[0];
    var userCode = val.split('_')[1];
    var flag = val.split('_')[2];

    $.ajax({
        type: 'POST',
        url: '../ReportsLevelTwo/GetDailyStatusExpensePopup',
        data: 'dcrCode=' + dcrCode + '&userCode=' + userCode + '&flag=' + flag,
        success: function (response) {
            jsData = eval('(' + response + ')');
            $("#divModel").html('');
            var tableContent = "", divisionName = "", tblContent = "";
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >User Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td style='text-align:left' >Division Name</td>";
                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                divisionName = "";
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {
                        divisionName += dJsonData[j].Division_Name + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }
                    tableContent += "<td style='text-align:left' >" + divisionName + "</td>";
                }
                else {
                    tableContent += "<td style='text-align:left' ></td>";
                }
                tableContent += "<td style='text-align:left' >Manager Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Employee Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                tableContent += "<td style='text-align:left' >Date of Joining</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                tableContent += "<td style='text-align:left' >Manager Territory name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Region Name</td>";
                tableContent += "<td style='text-align:left'  colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                tblContent += tableContent;
                $("#divHeaderpop").html(tableContent);

                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDailyStatusExpense' >";
                tableContent += "<thead><tr style='display: none;' id='tblTrExpense'>";
                tableContent += "<th style='text-align:left;width: 15%' >DCR Date</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Expense Type Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Expense Amount</th>";
                tableContent += "</tr><tr>";
                tableContent += "<th style='text-align:left;width: 15%' >DCR Date</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Expense Type Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Expense Amount</th>";
                var type = '[{ type: "date-range" }, { type: "text" }, { type: "number-range" }]';
                tableContent += "</tr>";
                tableContent += "<tr >";
                tableContent += "<th colspan= '3' align='left'  ><span id='spnDivToggleExpense' style='text-decoration: underline; cursor: pointer; padding: 5px'  onclick='fnToggleTreeHeader(\"spnDivToggleExpense\",\"tblTrExpense\")'>Show Filter</span></th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                var totalAmount = 0.0;
                if (jsData.Tables[2].Rows.length > 0) {

                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {

                        tableContent += "<tr>";
                        tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].DCR_Date + "</td>";
                        tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Expense_Type_Name + "</td>";
                        tableContent += "<td style='text-align:center;'>" + jsData.Tables[2].Rows[i].Expense_Amount + "</td>";
                        totalAmount += parseFloat(jsData.Tables[2].Rows[i].Expense_Amount);
                        tableContent += "</tr>";
                    }
                    tableContent += "<tr>";
                    tableContent += "<td style='text-align:center;background-color:#C0C0C0;' ></td>";
                    tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>Total</td>";
                    tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + totalAmount + "</td>";
                    tableContent += "</tr>";

                }
                tableContent += "</tbody>";
                tableContent += "</table>";
                tblContent += tableContent;
                var jsonType = eval(type);
                $("#divPrintSub").html('');
                $("#divPrintSub").html(tblContent);
                $("#divModel").html(tableContent);
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tblDailyStatusExpense').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };

                $('#dvPrint').remove();
                fninializePrint("divPrintSub", "ifrmPrintSub", "divModel");


                HideModalPopup("dvloading");
                ShowModalPopup('modal');
            }
            else {
                fnMsgAlert('info', 'Daily Status Report', 'No Data found.');
                HideModalPopup("dvloading");
            }

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
function fnSpecialityWiseAnalysis() {
    $("#divSubReport").empty();
    ShowModalPopup("dvloading");
    if (fnValidateReportforDocMissedCategory("Speciality Wise Analysis Report")) {
        $("#divSubReport").html('');
        var dcrStatus = "";
        var startDate = "", endDate = "";
        var totalQty = 0.0;
        var ownproductQty = 0.0;
        var CompetitorQty = 0.0;

        $("#divInput").slideUp();
        $("#spnInputToggle").html("Show Input");
        $("#divInput").slideUp();
        $("#spnInputToggle").html("Show Input");

        var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
        var startYear = $('#txtFromDate').val().split('-')[1];

        var days = daysInMonth(startMonth, startYear)

        if (parseInt(startMonth) >= 10) {
            startDate = startYear + "-" + startMonth + "-01";
            endDate = startYear + "-" + startMonth + "-" + days;
        }
        else {
            startDate = startYear + "-0" + startMonth + "-01";
            endDate = startYear + "-0" + startMonth + "-" + days;
        }


        if ($("input:checkbox[name=all]:checked").val() == "0,1,2") {
            dcrStatus = "0^1^2^";
        }
        else {
            $('input:checkbox[name=dcrStatus]').each(function () {
                if ($(this).is(':checked')) {
                    dcrStatus += $(this).val() + "^";
                }
            });
        }

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ReportsLevelTwo/GetSpecialityWiseAnalysis',
            data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + dcrStatus + '&regionCode=' + $("#hdnRegionCode").val() + "&Month=" + startMonth + "&Year=" + startYear,
            success: function (response) {

                if (response != "") {
                    var jsonType = eval(response.split('~')[2]);
                    $("#divHeader").html(response.split('~')[0]);
                    $("#divReport").html(response.split('~')[1]);
                    $("#divPrint").html(response.split('~')[1]);

                    $('#tblSpecialityWiseAnalysis').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });

                    fninializePrint("divPrint", "ifrmPrint", "divReport");
                    //    $(".TableTools").append("<div id='dvPrint' onclick='fnPrint(\"divPrint\",\"ifrmPrint\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
                    HideModalPopup('dvloading');
                }
                else {
                    fnMsgAlert('info', 'Report', 'No data found.');
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

// SPECIALITY WISE VISIT ANALYSIS POPUP REPORT

function fnSpecialityWiseAnalysisView(val) {
    var surName = "";
    ShowModalPopup("dvloading");
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];
    var dcrStatus = val.split('_')[4];
    var selectedMonth = val.split('_')[6];
    var selectedYear = val.split('_')[7];
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetSpecialityWiseAnalysisDetails',
        data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + dcrStatus + '&userCode=' + val.split('_')[1] + '&regionCode=' + val.split('_')[0] + '&speciality=' + val.split('_')[5] + "&Month=" + selectedMonth + "&Year=" + selectedYear,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var ownProduct = 0.0;
            var competitor = 0.0;
            var divisionName = "";
            var tableContentPrint = "";
            $("#divHeaderSummary").html('');
            $("#divReportSummary").html('');
            if (jsData.Tables[0].Rows.length > 0) {


                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >User Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td style='text-align:left' >Division Name</td>";
                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                divisionName = "";
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {
                        divisionName += dJsonData[j].Division_Name + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }
                    tableContent += "<td style='text-align:left' >" + divisionName + "</td>";
                }
                else {
                    tableContent += "<td style='text-align:left' ></td>";
                }
                tableContent += "<td style='text-align:left' >Manager Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Employee Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                tableContent += "<td style='text-align:left' >Date of Joining</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                tableContent += "<td style='text-align:left' >Manager Territory name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Region Name</td>";
                tableContent += "<td style='text-align:left'  colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                tableContentPrint += tableContent;
                $("#divHeaderSummary").html(tableContent);


                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSpecialityDetails' >";
                tableContent += "<thead><tr style='display: none;' id='tblTrpopupview'>";
                tableContent += "<th style='display:none'>User Name</th>";
                tableContent += "<th style='display:none'>Region Name</th>";
                tableContent += "<th style='display:none'>Employee Name</th>";
                tableContent += "<th style='display:none'>Manager Name</th>";
                tableContent += "<th style='display:none'>Manager Territory name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Doctor Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >MDL No</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Category</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Specialty</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Local Area</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Hospital Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >My RCPA Amount</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Competitor RCPA Amount </th>";
                tableContent += "<th style='text-align:left;width: 15%' >% to Competitor</th>";
                tableContent += "</tr>";
                tableContent += "<tr>";
                tableContent += "<th style='display:none'>User Name</th>";
                tableContent += "<th style='display:none'>Region Name</th>";
                tableContent += "<th style='display:none'>Employee Name</th>";
                tableContent += "<th style='display:none'>Manager Name</th>";
                tableContent += "<th style='display:none'>Manager Territory name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Doctor Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >MDL No</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Category</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Specialty</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Local Area</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Hospital Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >My RCPA Amount</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Competitor RCPA Amount </th>";
                tableContent += "<th style='text-align:left;width: 15%' >% to Competitor</th>";
                var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';

                tableContent += "</tr>";
                tableContent += "<tr >";
                tableContent += "<th colspan= '14' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapopupview()'>Show Filter</span></th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";

                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {

                    ownProduct = 0.0;

                    tableContent += "<tr>";
                    tableContent += "<th style='display:none'>" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                    tableContent += "<th style='display:none'>" + jsData.Tables[0].Rows[0].Region_Name + "</td>";
                    tableContent += "<th style='display:none'>" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                    tableContent += "<th style='display:none'>" + jsData.Tables[0].Rows[0].Manager_Name + "</td>";
                    tableContent += "<th style='display:none'>" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td>";
                    //Sur Name Added
                    if (jsData.Tables[2].Rows[i].Sur_Name != "" && jsData.Tables[2].Rows[i].Sur_Name != null) {
                        surName = jsData.Tables[2].Rows[i].Sur_Name
                    }
                    else {
                        surName = "";
                    }
                    if (surName != '') {
                        tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[2].Rows[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[2].Rows[i].Doctor_Name + "-" + surName + "</span></td>";
                    }
                    else {
                        tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[2].Rows[i].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[2].Rows[i].Doctor_Name + "</span></td>";
                    }
                    tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].MDL_Number + "</td>";
                    tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Category_Name + "</td>";
                    tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Speciality_Name + "</td>";
                    //Local Area Added
                    if (jsData.Tables[2].Rows[i].Local_Area != "" && jsData.Tables[2].Rows[i].Local_Area != null) {
                        tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Local_Area + "</td>";
                    }
                    else {
                        tableContent += "<td align='left' ></td>";
                    }
                    if (jsData.Tables[2].Rows[i].Hospital_Name != "" && jsData.Tables[2].Rows[i].Hospital_Name != null) {
                        tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Hospital_Name + "</td>";
                    }
                    else {
                        tableContent += "<td align='left' ></td>";
                    }
                    competitor = 0.0;
                    ownProduct = 0.0;
                    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Doctor_Code=='" + jsData.Tables[2].Rows[i].Doctor_Code + "')]");
                    if (dJsonData != false) {
                        if (dJsonData.length > 0) {
                            for (var k = 0; k < dJsonData.length; k++) {
                                ownProduct += parseFloat(dJsonData[k].Price);
                            }
                        }
                    }
                    tableContent += "<td style='text-align:center' width='15%'>" + Math.round(ownProduct * 100) / 100 + "</td>";

                    var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Doctor_Code=='" + jsData.Tables[2].Rows[i].Doctor_Code + "')]");
                    if (dJsonData != false) {
                        if (dJsonData.length > 0) {
                            for (var k = 0; k < dJsonData.length; k++) {
                                competitor += parseFloat(dJsonData[k].Price);
                            }
                        }
                    }
                    tableContent += "<td style='text-align:center' >" + Math.round(competitor * 100) / 100 + "</td>";
                    if (competitor != 0.0) {
                        var avg = (ownProduct / competitor) * 100;
                        tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center' >0</td>";
                    }
                    tableContent += "</tr>";
                }
                tableContent += "</tbody>";
                tableContent += "</table>";
                var jsonType = eval(type);
                $("#divReportSummary").html(tableContent);
                tableContentPrint += tableContent;
                $("#divpopPrint").html(tableContentPrint);
                if ($.fn.dataTable) {
                    $('#tblSpecialityDetails').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };

                fninializePrint("divpopPrint", "ifrmpopPrint", "divReportSummary");
                HideModalPopup("dvloading");
            }

            else {
                fnMsgAlert('info', 'Speciality Wise Analysis', 'No Data found.');
                HideModalPopup("dvloading");
            }

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


function fnDoctor360Popup(val) {
    $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + val, title: 'Reports', overlayClose: false });
    return;
}




function fnToggleTreeapopupview() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrpopupview").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrpopupview").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnGetGeoLocationReport() {

    ShowModalPopup("dvloading");
    var userCode = $('#hdnUserCode').val();

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Geo Location Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Geo Location Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Geo Location Report', 'Start date& end date should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":checkbox[name=all]:checked").length == 0 && $(":checkbox[name=dcrStatus]:checked").length == 0) {
        fnMsgAlert('info', 'Geo Location Report', 'Please select DCR status.');
        HideModalPopup("dvloading");
        return false;
    }
    var statusName = "";
    var dcrStatus = "";
    if ($("input:checkbox[name=all]:checked").val() == "0,1,2,3") {
        dcrStatus = "0^1^2^3^"
        statusName = "ALL,";
    }
    else {
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) {
                dcrStatus += $(this).val().split('_')[0] + "^";
                statusName += $(this).val().split('_')[1] + ",";
            }
        });
    }

    if (statusName != "") {
        statusName = statusName.substring(0, statusName.length - 1);
    }
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetGeoLocationReport',
        data: 'userCode=' + userCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&dcrStatus=' + escape(dcrStatus),
        success: function (response) {
            jsData = eval('(' + response + ')');
            $("#divReport").html('');
            var tableContent = "", divisionName = "", tableHeader = "";
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='4'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >User Name :</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td style='text-align:left' >Designation :</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].User_Type_Name + "</td>";
                tableContent += "</tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Employee Name :</td>";
                tableContent += "<td style='text-align:left' ><b>" + jsData.Tables[0].Rows[0].Employee_Name + "</b></td>";
                tableContent += "<td style='text-align:left' >Employee Number :</td>";
                tableContent += "<td style='text-align:left' ><b>" + jsData.Tables[0].Rows[0].Employee_Number + "</b></td>";
                tableContent += "</tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Reporting HQ :</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td>";
                tableContent += "<td style='text-align:left' >Reporting Manager :</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Manager_Name + "</td>";
                tableContent += "</tr>";


                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Territory Name :</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Region_Name + "</td>";
                tableContent += "<td style='text-align:left' >Division :</td>";
                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                divisionName = "";
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {
                        divisionName += dJsonData[j].Division_Name + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }
                    tableContent += "<td style='text-align:left' >" + divisionName + "</td>";
                }
                else {
                    tableContent += "<td style='text-align:left' ></td>";
                }

                tableContent += "</tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Phone number :</td>";
                if (jsData.Tables[0].Rows[0].Mobile != "" && jsData.Tables[0].Rows[0].Mobile != null) {
                    tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].Mobile + "</td>";
                }
                else {
                    tableContent += "<td style='text-align:left' ></td>";
                }
                tableContent += "<td style='text-align:left' >Date of joining :</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                tableContent += "</tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Period :</td>";
                tableContent += "<td style='text-align:left' >" + $("#txtFromDate").val() + " - " + $("#txtToDate").val() + "</td>";
                tableContent += "<td style='text-align:left' >Selected Status :</td>";
                tableContent += "<td style='text-align:left' >" + statusName + "</td>";
                tableContent += "</tr>";

                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divHeader").html(tableContent);
                tableHeader += tableContent;
                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblGeoLocation' >";
                tableContent += "<thead><tr style='display: none;' id='tblTr'>";
                tableContent += "<th style='text-align:center;width: 15%' >DCR Date</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Work Category</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Place of Work</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Name of the Doctor</th>";
                tableContent += "<th style='text-align:center;width: 15%' >MDL/SVL No</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Category</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Speciality</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Time of Meeting</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Latitude</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Longitude</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Location of entry</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Entered Via (mobile or Web)</th>";
                tableContent += "<th style='text-align:center;width: 15%' > DCR Entry Date & Time</th>";
                tableContent += "<th style='text-align:center;width: 15%' > Doctor Visit Details Entered Date & Time</th>";
                tableContent += "</tr>";
                var type = '[{ type: "date-range" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "number-range" },';
                type += '{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "date-range" }, { type: "text" },{ type: "date-range" },{ type: "date-range" }]';
                // HEADER 2
                tableContent += "<tr>";
                tableContent += "<th style='text-align:center;width: 15%' >DCR Date</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Work Category</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Place of Work</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Name of the Doctor</th>";
                tableContent += "<th style='text-align:center;width: 15%' >MDL/SVL No</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Category</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Speciality</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Time of Meeting</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Latitude</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Longitude</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Location of entry</th>";
                tableContent += "<th style='text-align:center;width: 15%' >Entered Via (mobile or Web)</th>";
                tableContent += "<th style='text-align:center;width: 15%' > DCR Entry Date & Time</th>";
                tableContent += "<th style='text-align:center;width: 15%' > Doctor Visit Details Entered Date & Time</th>";
                tableContent += "<tr >";
                tableContent += "<th colspan= '14' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";

                tableContent += "</thead>";
                tableContent += "<tbody>";

                if (jsData.Tables[2].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                        tableContent += "<tr>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].DCR_Actual_Date + "</td>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Category + "</td>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Place_Worked + "</td>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Doctor_Name + "</td>";
                        if (jsData.Tables[2].Rows[i].MDL_Number != null && jsData.Tables[2].Rows[i].MDL_Number != "") {
                            tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].MDL_Number + "</td>";
                        }
                        else {
                            tableContent += "<td align='left'></td>";
                        }
                        if (jsData.Tables[2].Rows[i].Category_Name != null && jsData.Tables[2].Rows[i].Category_Name != "") {
                            tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Category_Name + "</td>";
                        }
                        else {
                            tableContent += "<td align='left'></td>";
                        }
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Speciality_Name + "</td>";

                        if (jsData.Tables[2].Rows[i].Doctor_Visit_Time != null && jsData.Tables[2].Rows[i].Doctor_Visit_Time != "") {
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Doctor_Visit_Time + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Visit_Mode + "</td>";
                        }
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Lattitude + "</td>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Longitude + "</td>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Location + "</td>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Source_Of_Entry + "</td>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].DCR_Entered + "</td>";
                        tableContent += "<td align='left'>" + jsData.Tables[2].Rows[i].Doctor_Entered_DateTime + "</td>";
                        tableContent += "</tr>";
                    }
                    tableContent += "</tbody>";
                    tableContent += "</table>";
                }
                var jsonType = eval(type);
                $("#divReport").html(tableContent);
                $("#divPrint").html(tableHeader + tableContent);
                if ($.fn.dataTable) {
                    $('#tblGeoLocation').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };

                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");

                }
            }
            $('#dvPrint').remove();

            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup('dvloading');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}



function fnVacancyReport() {

    ShowModalPopup("dvloading");
    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Vacancy Report', 'Please enter Start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Vacancy Report', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }
    if (parseInt(endMonth) >= 10) {
        endDate = endYear + "-" + endMonth + "-" + days;
    }
    else {
        endDate = endYear + "-0" + endMonth + "-" + days;
    }
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Vacancy Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetVacancyReport',
        data: 'regionCode=' + $('#hdnRegionCode').val() + '&sd=' + startDate + '&ed=' + endDate,
        success: function (response) {

            $("#divReport").html(response.split('@')[0]);
            $("#divPrint").html(response.split('@')[0]);
            var type = response.split('@')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tblVacancyReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };

            if (response != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
            }
            else {
                fnMsgAlert('info', 'Vacancy Report', 'No data found.');

                HideModalPopup("dvloading");
            }
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup("dvloading");

        },
        error: function () {
            fnMsgAlert('info', 'Vacancy Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//// Audit Report

function fnAuditReport() {

    ShowModalPopup("dvloading");
    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Audit Report', 'Select period from');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Audit Report', 'Select period to');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Audit Report', 'Period from should be less than Period to.');
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetAuditReport',
        data: "userCode=" + $("#hdnUserCode").val() + "&sd=" + $("#txtFromDate").val() + "&ed=" + $("#txtToDate").val(),
        success: function (response) {

            $("#divReport").html(response.split('@')[0]);
            $("#divPrint").html(response.split('@')[0]);
            var type = response.split('@')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tblVacancyReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };

            if (response != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
            }
            else {
                fnMsgAlert('info', 'Audit Report', 'No data found.');

                HideModalPopup("dvloading");
            }
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup("dvloading");

        },
        error: function () {
            fnMsgAlert('info', 'Audit Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnVacancyReportNew() {

    ShowModalPopup("dvloading");
    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Audit Report', 'Select start date');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Audit Report', 'Select end date');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Audit Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetVacancyReportNew',
        data: 'regionCode=' + $('#hdnRegionCode').val() + "&sd=" + $("#txtFromDate").val() + "&ed=" + $("#txtToDate").val() + "&regionStatus=" + $("input:radio[name=regionStatus]:checked").val(),
        success: function (response) {

            $("#divReport").html(response.split('@')[0]);
            $("#divPrint").html(response.split('@')[0]);
            var type = response.split('@')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tblVacancyReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };

            if (response != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
            }
            else {
                fnMsgAlert('info', 'Vacancy Report', 'No data found.');

                HideModalPopup("dvloading");
            }
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup("dvloading");

        },
        error: function () {
            fnMsgAlert('info', 'Vacancy Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnComprehensiveAnalysisReport() {
    ShowModalPopup("dvloading");
    $("#dvExcelPrint").hide();
    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Comprehensive Analysis Report', 'Please select Start Date.');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Comprehensive Analysis Report', 'Please select End Date.');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Comprehensive Analysis Report', 'Start date should be less than end date.');
        HideModalPopup("dvloading");
        return false;
    }

    // to open as a sub report from expense group wise analysis, check report type 
    var reportType = "";
    if ($("#ddlReportType") == null || $("#ddlReportType") === undefined) {
        reportType = "VISIT";
    }
    else {
        reportType = $("#ddlReportType").val();
    }

    // assign date values in server controls for excel export
    $("#sd").val($("#txtFromDate").val());
    $("#ed").val($("#txtToDate").val());
    $("#reportType").val(reportType);

    var userCodes = "";

    for (var i = 0; i < selKeys.length; i++) {
        userCodes += selKeys[i] + '^';
    }

    $("#userCode").val(userCodes);

    if (userCodes == "") {
        fnMsgAlert('info', 'Comprehensive Analysis Report', 'Please select atleast one user.');
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetComprehensiveAnalysisReport',
        data: "userCode=" + userCodes + "&sd=" + $("#txtFromDate").val() + "&ed=" + $("#txtToDate").val() + "&reportType=" + reportType,
        success: function (response) {

            $("#divCompReport").html(response);
            $("#divCompReport").show();
            $("#dvExcelPrint").show();
            $("#divCompPrint").html(response);

            if (response != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
                $("#divMain").css('width', '100%');
            }
            else {
                fnMsgAlert('info', 'Comprehensive Analysis Report', 'No data found.');

                HideModalPopup("dvloading");
            }
            HideModalPopup("dvloading");
            fninializePrint("divCompPrint", "ifrmCompPrint", "divCompReport");
        },
        error: function () {
            fnMsgAlert('info', 'Comprehensive Analysis Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnDoctorVisitAnalysis() {

    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Doctor Visit Analysis Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Doctor Visit Analysis Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");

    var reportFor = $("input:radio[name=rdctivity]:checked").val();
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');

    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Doctor Visit Analysis Report', 'Start date should be less than end date.');
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetDoctorVisitAnalysis',
        data: 'regionCode=' + regionCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&selection=' + reportFor + '&reportView=' + reportViewType,
        success: function (response) {
            $("#divReport").html('');
            var type = response.split('^')[1];
            var jsonType = eval(type);
            $("#divReport").html(response.split('^')[0]);
            $("#divPrint").html(response.split('^')[0]);
            if ($.fn.dataTable) {
                $('#tblDoctorVisitsFrequency').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
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
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}



function fnGetInwardAuditReport() {

    ShowModalPopup("dvloading");
    var userCode = $('#hdnUserCode').val();

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Inward Audit Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Inward Audit Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Inward Audit Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }


    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetInwardAuditReport',
        data: 'userCode=' + userCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0],
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $("#divReport").html(response);
                $("#divPrint").html(response);
                if ($.fn.dataTable) {
                    $('#tblInwardAuditReport').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                };
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Inward Audit Report', 'No data found.');
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

function fnGetLastSubmittedReport() {

    ShowModalPopup("dvloading");
  
    $('#dvExcelPrint').hide();
    $('#lnkExcel').hide();
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');

    $("#divCompReport").html("");
    $("#divCompPrint").html("");

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }

    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Last Submitted Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays > 92) {

        fnMsgAlert('info', 'Last Submitted Report', 'Start date and end date should not be greater than 92 days.');
        HideModalPopup("dvloading");
        return false;
    }
    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }

    var userCode = selKeys_ls;
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();

    if (userCode == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Please select atleast one user.');
        HideModalPopup("dvloading");
        return false;
    }
    $('#hdnDownload').val('');
    $('#hdnDownload').val(userCode);

    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastSubmittedReport',
        data: 'userCode=' + userCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType,
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                // $("#lnkExcel").attr("href", response.split('$')[1]);
                $("#divReport").html(response);
                //   $("#divPrint").html(response.split('$')[0]);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
                $('#tblLastSubmittedReport').tablePagination({});
                $("#DcrDisclaimer").show();
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                $("#spnTreeToggle").show();
                $('#dvTablePrint').hide();
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnGetViewAllLastSubmittedReport() {

    ShowModalPopup("dvloading");
    $('#dvExcelPrint').hide();
    $('#lnkExcel').hide();
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');

    $("#divCompReport").html("");
    $("#divCompPrint").html("");

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }
    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Last Submitted Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays > 92) {

        fnMsgAlert('info', 'Last Submitted Report', 'Start date and end date should not be greater than 92 days.');
        HideModalPopup("dvloading");
        return false;
    }
    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }
    var userCode = "ALL";
    $('#hdnDownload').val('');
    $('#hdnDownload').val(userCode);
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastSubmittedReport',
        data: 'userCode=' + userCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType,
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                // $("#lnkExcel").attr("href", response.split('$')[1]);
                $("#divReport").html(response);
                //   $("#divPrint").html(response.split('$')[0]);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
                $('#tblLastSubmittedReport').tablePagination({});
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                $("#spnTreeToggle").show();
                $('#dvTablePrint').hide();
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnDownloadExcel() {
    ShowModalPopup("dvloading");
    $('#lnkExcel').hide();
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }
    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Last Submitted Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays > 92) {

        fnMsgAlert('info', 'Last Submitted Report', 'Start date and end date should not be greater than 92 days.');
        HideModalPopup("dvloading");
        return false;
    }
    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }
    var download = "YES";


    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastSubmittedReport',
        data: 'userCode=' + $('#hdnDownload').val() + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&download=' + download,
        success: function (response) {
            if (response != "") {
                $('#lnkExcel').show();
                $("#lnkExcel").attr("href", response);
                //$("#divReport").html(response);
                $("#divPrint").html(response);
                $('#dvTablePrint').hide();
                HideModalPopup("dvloading");

            }
            else {

                $('#dvTablePrint').hide();
                $('#lnkExcel').hide();
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
            $('#dvTablePrint').hide();
        }
    });

}

function fnLastSubmittedPopup(details) {

    ShowModalPopup("dvloading");

    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');
    var DCRDate = $('input:radio[name=UnDCRDate]:checked').val();
    var regionCode = details.split('_')[0];
    var userCode = details.split('_')[1];
    var startDate = details.split('_')[2];
    var endDate = details.split('_')[3];
    var type = details.split('_')[4];
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastsubmittedReportSub',
        data: 'userCode=' + userCode + '&sd=' + startDate + '&ed=' + endDate + '&type=' + type + '&regionCode=' + regionCode,
        success: function (response) {
            $("#divModel").html('');
            if (response != "") {
                $("#divModel").html(response);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
                HideModalPopup("dvloading");
                ShowModalPopup('modal');
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnOpenComprehensiveAnalysisReport(input) {
    //  var selKeys = new Array();
    selKeys = [];
    selKeys.push(input);
    $('#hdnUserCode').val(input);
    $('#userCode').val(input);
    fnComprehensiveAnalysisReport();
}
function fnComprehensiveAnalysisReportopen(input) {
    selKeys = [];
    selKeys.push(input);
    $('#hdnUserCode').val(input);
    $('#userCode').val(input);
    fnComprehensiveAnalysisReport();
}
function fnLeaveDetailPopUp(details) {
    ShowModalPopup("dvloading");

    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');
    var DCRDate = $('input:radio[name=UnDCRDate]:checked').val();
    var leavetypeCode = details.split('_')[0];
    var userCode = details.split('_')[1];
    var startDate = details.split('_')[2];
    var endDate = details.split('_')[3];
    var regionCode = details.split('_')[4];
    var leaveTypeName = details.split('_')[5];

    $("#divInput").slideUp();
    $("#divModel").html('');
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastsubmittedLeaveReportSub',
        data: 'userCode=' + userCode + '&sd=' + startDate + '&ed=' + endDate + '&ltn=' + leaveTypeName + '&ltc=' + leavetypeCode + '&regionCode=' + regionCode,
        success: function (response) {
            $("#divModel").html('');
            if (response != "") {
                $("#divModel").html(response);
                HideModalPopup("dvloading");
                ShowModalPopup('modal');
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}
// ***************************************************Brand master report*********************************************************//


function fnValidateInputs() {
    // Month validation
    if ($('#txtMonth').val() == "") {
        alert('Please select report month');
        return false;
    }

    // Group by region type validation
    if ($('#ddlGroupByRegionType').val() == 0) {
        alert('Please select Group by option');
        return false;
    }

    // Aggregate region type validation
    if ($('#ddlAggregateRegionType').val() == 0) {
        alert('Please select Aggregate option');
        return false;
    }

    // DCR Status validation
    var adjustType = $('input:checkbox[name=DCRStatus]:checked');
    var selectedval = "";
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + ",";
    }
    if (selectedval != "") {
        selectedval = selectedval.substring(0, selectedval.length - 1);
    }
    else {
        alert('Select at least one DCR status');
        return false;
    }

    return true;
}

function fnLoadTypes() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/DoctorVisit/GetRegionTypes',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');
            $('option', $("#ddlRegionType")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                $('#ddlRegionType').append("<option value='0'>-Select-</option>");
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlRegionType").append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                }
                $("#ddlRegionType").val('0');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function OnSelectedIndexChanged() {

    var SelectedItem = $("#ddlRegionType option:selected").val();
    if (SelectedItem == "0") {
        fnMsgAlert('info', 'Report', 'Select Region Type.');
        return false;
    }
    $("#trbutton").show();
    $("#trUrl").show();
    $("#trStatus").show();
    $("#trUserType").show();
    $("#trRegionName").show();
    $('option', $("#ddlRegionName")).remove();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/DoctorVisit/GetRegionTypeAndChildUserType',
        data: 'regionType=' + SelectedItem,
        success: function (response) {
            jsData = eval('(' + response + ')');
            $('option', $("#ddlRegionName")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlRegionName").append("<option value='" + jsData.Tables[0].Rows[i].Region_Code + "'>" + jsData.Tables[0].Rows[i].Region_Name + "</option>");

                }
                $("#selectall").click(function () {
                    $('.case').attr('checked', this.checked);
                });
                $("#ddlRegionName").multiselect({
                    noneSelectedText: 'Select Region name',
                    selectedList: 4
                }).multiselectfilter();
                $("#ddlRegionName").multiselect("destroy").multiselect().multiselectfilter();
            }
            else {
                $("#trbutton").hide();
                $("#trUrl").hide();
                $("#trStatus").hide();
                $("#trUserType").hide();
                $("#trRegionName").hide();
            }
            $('option', $("#ddlUserTypeName")).remove();
            if (jsData.Tables[1].Rows.length > 0) {
                $('#ddlUserTypeName').append("<option value='0'>-Select-</option>");
                for (var j = 0; j < jsData.Tables[1].Rows.length; j++) {
                    $("#ddlUserTypeName").append("<option value='" + jsData.Tables[1].Rows[j].User_Type_Code + "'>" + jsData.Tables[1].Rows[j].User_Type_Name + "</option>");
                }
                $("#ddlUserTypeName").val('0');
            }

        },
        error: function () {
            $("#trbutton").hide();
            $("#trUrl").hide();
            $("#trStatus").hide();
            $("#trUserType").hide();
            $("#trRegionName").hide();
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");

        }
    });

}


function fnBrandMasterReport() {

    ShowModalPopup("dvloading");
    if (!fnValidateInputs()) {
        HideModalPopup('dvloading');
        return false;
    }
    var SelectedItem = $("#ddlUserTypeName option:selected").val();
    var dcrStatus = "";
    $('input:checkbox[name=dcrStatus]').each(function () {
        if ($(this).is(':checked')) { dcrStatus += $(this).val() + "^"; }
    });

    var regionCode = "";
    if ($("#ddlRegionName").val() != null) {
        for (var index = 0; index < $("#ddlRegionName").val().length; index++) {
            regionCode += $("#ddlRegionName").val()[index] + "^";
        }
    }

    var selectedMonth = $('#txtMonth').val();
    var Month = fngetMonthNumber(selectedMonth.split('-')[0]);
    var Year = selectedMonth.split('-')[1];
    var monthName = $('#txtMonth').val();


    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/DoctorVisit/GetBrandMasterReport',
        data: 'userType=' + SelectedItem + '&regionCodes=' + regionCode + '&dcrStatus=' + dcrStatus + '&month=' + Month + '&year=' + Year + '&monthName=' + monthName + '&userTypeName=' + $("#ddlUserTypeName option:selected").text() + '&title=' + $("#divPageHeader").html(),
        success: function (response) {
            if (response != "") {
                $("#aURL").html('Download report')
                $("#aURL").attr("href", response);
                HideModalPopup('dvloading');
            }
            else {
                fnMsgAlert('info', 'Report', 'No data found.');
                HideModalPopup('dvloading');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnValidateInputs() {
    // Month validation
    if ($('#txtMonth').val() == "") {
        alert('Please select Report month');
        return false;
    }
    // Region Type Name
    if ($('#ddlRegionType').val() == 0) {
        alert('Please select Region Type');
        return false;
    }

    // Region Name Validation
    var regionCode = "";
    if ($("#ddlRegionName").val() != null) {
        for (var index = 0; index < $("#ddlRegionName").val().length; index++) {
            regionCode += $("#ddlRegionName").val()[index] + "^";
            break;
        }
    }
    if (regionCode == "") {
        alert('Please select atleast Region Name');
        return false;

    }
    // Validate region type validation
    if ($('#ddlUserTypeName').val() == 0) {
        alert('Please select User Type Name ');
        return false;
    }

    // DCR Status validation

    var dcrStatus = "";
    $('input:checkbox[name=dcrStatus]').each(function () {
        if ($(this).is(':checked')) { dcrStatus += $(this).val() + "^"; }
    });

    if (dcrStatus == "") {
        alert('Please select atleast one dcr status ');
        return false;
    }

    return true;
}

//------------------------------------ START - SPECIALITY COVERAGE ANALYSIS -------------------------------------------
function fnBindSpecialityCoverageAnalysis() {
    ShowModalPopup("dvloading");
    $("#dvDataTable").html("");
    if (fnValidateSpecialityCoverageAnalysis()) {
        var startDate = $.trim($("#txtStartDate").val().split('/')[2]) + '-' + $.trim($("#txtStartDate").val().split('/')[1]) + '-' + $.trim($("#txtStartDate").val().split('/')[0]);
        var endDate = $.trim($("#txtEndDate").val().split('/')[2]) + '-' + $.trim($("#txtEndDate").val().split('/')[1]) + '-' + $.trim($("#txtEndDate").val().split('/')[0]);
        var userCode = $("#hdnUserCode").val();
        var userName = $("#hdnUserName").val();
        var isExcel = 'N';
        isExcel = $(":radio[name=rptOptions]:checked").val();

        // GET DCR STATUS
        var dcrStatus = "";
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });

        HideModalPopup("dvloading");

        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ReportsLevelThree/GetSpecialityCoverageAnalysis',
            data: 'userCode=' + userCode + '&userName=' + userName + '&startDate=' + startDate + '&endDate=' + endDate + '&isExcel=' + isExcel + '&dcrStatus=' + dcrStatus,
            success: function (response) {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvDataTable").html('<div class="col-lg-12"><div class="helpIconright"><img src="../Images/HelpIcon.png" onclick="fnHelp(\'SPECIALITYCOVERAGEANALYSIS\',\'GRID\')" /></div><div style="clear:both;"></div></div>');
                    if (isExcel == "Y") {
                        $("#dvDataTable").append("<a href='" + response + "' target='_blank'>Click here to Download.</a>");
                    }
                    else {
                        $("#dvDataTable").append(response);
                    }
                }
                else {
                    fnMsgAlert('info', 'Speciality Coverage Analysis', 'Error.' + response.split('^')[1]);
                }
                $("#main").unblock();
            },
            error: function () {
                fnMsgAlert('info', 'Speciality Coverage Analysis', 'Error.');
                $("#main").unblock();
            }
        });
    }
}

function fnValidateSpecialityCoverageAnalysis() {
    if ($.trim($("#txtStartDate").val()) == "") {
        fnMsgAlert('info', 'Speciality Coverage Analysis', 'Please select Start Date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($.trim($("#txtEndDate").val()) == "") {
        fnMsgAlert('info', 'Speciality Coverage Analysis', 'Please select End Date.');
        HideModalPopup("dvloading");
        return false;
    }

    var fromDate = $.trim($("#txtStartDate").val().split('/')[2]) + '/' + $.trim($("#txtStartDate").val().split('/')[1]) + '/' + $.trim($("#txtStartDate").val().split('/')[0]);
    var toDate = $.trim($("#txtEndDate").val().split('/')[2]) + '/' + $.trim($("#txtEndDate").val().split('/')[1]) + '/' + $.trim($("#txtEndDate").val().split('/')[0]);
    var todayDate = curdate.split('.')[2] + '-' + curdate.split('.')[1] + '-' + curdate.split('.')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);
    var today = new Date(todayDate);

    //Invalid Date
    //if (startDate == 'Invalid Date') {
    //    fnMsgAlert('info', 'Speciality Coverage Analysis', 'Please enter valid Start Date.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    //if (endDate == 'Invalid Date') {
    //    fnMsgAlert('info', 'Speciality Coverage Analysis', 'Please enter valid End Date.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    if (!(fnValidateDateFormate($("#txtStartDate"), "Start Date"))) {
        HideModalPopup("dvloading");
        return false;
    }
    if (!(fnValidateDateFormate($("#txtEndDate"), "End Date"))) {
        HideModalPopup("dvloading");
        return false;
    }

    if (startDate > endDate) {
        fnMsgAlert('info', 'Speciality Coverage Analysis', 'End date can not be less than start date.');
        HideModalPopup("dvloading");
        return false;
    }

    if (startDate > today) {
        fnMsgAlert('info', 'Speciality Coverage Analysis', 'Start date can not be a future Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if (endDate > today) {
        fnMsgAlert('info', 'Speciality Coverage Analysis', 'End date can not be a future Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":checkbox[name=dcrStatus]:checked").length == 0) {
        fnMsgAlert('info', 'Speciality Coverage Analysis', 'Please select DCR status.');
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

function fnClearSpecialityCoverageAnalysis() {
    $("#txtStartDate").val('');
    $("#txtEndDate").val('');

    $('input:checkbox[name=tpStatus]').each(function () {
        $(this).removeAttr('checked');
    });
    //uncheck all without draft
    $("input:checkbox[name=dcrStatusAllWOD]").removeAttr('checked');
    // uncheck all with draft
    $("input:checkbox[name=dcrStatusAllWD]").removeAttr('checked');

    //uncheck all status
    $('input:checkbox[name=dcrStatus]').each(function () {
        $(this).removeAttr('checked');
    });

    //check approved
    $("#chkApproved").attr('checked', true);

    $("#optExportToExcel").removeAttr('checked');
    $("#optViewInScreen").attr('checked', true);
}

function fnChangeRadioDCR() {
    //uncheck all without draft
    $("input:checkbox[name=dcrStatusAllWOD]").removeAttr('checked');
    // uncheck all with draft
    $("input:checkbox[name=dcrStatusAllWD]").removeAttr('checked');

    if ($(":checkbox[name=dcrStatus]:checked").length > 0) {
        var dcrStatus = "";
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val(); }
        });
        if (dcrStatus == '210') {
            // check All without draft
            $("input:checkbox[name=dcrStatusAllWOD]").attr('checked', 'checked');
        }
        if (dcrStatus == '2103') {
            // check All with draft
            $("input:checkbox[name=dcrStatusAllWD]").attr('checked', 'checked');
        }
    }
}

function fnChangeCheckWithDraft() {
    if ($(":checkbox[name=dcrStatusAllWD]:checked").length > 0) {
        //uncheck all without draft
        $("input:checkbox[name=dcrStatusAllWOD]").removeAttr('checked');

        //Check All other status
        $('input:checkbox[name=dcrStatus]').each(function () {
            $(this).attr('checked', 'checked');
        });
        return;
    }
}

function fnChangeCheckWithoutDraft() {
    if ($(":checkbox[name=dcrStatusAllWOD]:checked").length > 0) {
        // uncheck all with draft
        $("input:checkbox[name=dcrStatusAllWD]").removeAttr('checked');

        // uncheck Draft and check Applied, Approved, Unappreved
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).val() == '3') {
                $(this).removeAttr('checked');
            }
            else {
                $(this).attr('checked', 'checked');
            }
        });
        return;
    }
}
//------------------------------------ END - SPECIALITY COVERAGE ANALYSIS   -------------------------------------------


//------------------------------------------ START PAY SALIP REPORT --------------------------------------------------------


function fnBindPayslipReport() {
    $('#divheadPaySlip').block({
        message: 'Retriveing data...',
        css: { border: '1px solid #ddd' }
    });
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'PaySlip Report.', 'Select month and year');
        $("#divheadPaySlip").unblock();
        return false;
    }
    var selectedMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var selectedYear = $('#txtFromDate').val().split('-')[1];
    var reportView = "1";

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelThree/GetPayslipReport',
        data: 'month=' + selectedMonth + '&year=' + selectedYear + '&reportView=' + reportView + '&title=' + $("#divPageHeader").html(),
        success: function (response) {
            if (response != "") {
                $('#dvGrid').html(response);
                $("#divPrint").html(response);

                if (reportView == "1") {
                    if (response == "No data found.") {
                        $("#divprintArea").hide();
                        $("#divheadPaySlip").unblock();
                    }
                    else {
                        $("#divprintArea").show();
                        $("#divheadPaySlip").unblock();
                    }
                }
                else {
                    $("#divprintArea").hide();
                    $("#divheadPaySlip").unblock();

                }

            }
            else {
                $('#dvGrid').html();
                $("#divPrint").html();
                $("#divprintArea").hide();
                $("#divheadPaySlip").unblock();
            }

        },
        error: function (e) {
        }
    });

}

//------------------------------------------ END PAY SALIP REPORT --------------------------------------------------------


// -------------------------------------------RPT LAST SUBMITTED REPORT------------------------------------------------------



function fnGetLastSubmittedReportRPT() {

    ShowModalPopup("dvloading");
    $('#lnkExcel').hide();
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');

    $("#divCompReport").html("");
    $("#divCompPrint").html("");

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }

    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Last Submitted Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays > 92) {

        fnMsgAlert('info', 'Last Submitted Report', 'Start date and end date should not be greater than 92 days.');
        HideModalPopup("dvloading");
        return false;
    }
    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }

    var userCode = selKeys;
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();

    if (userCode == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Please select atleast one user.');
        HideModalPopup("dvloading");
        return false;
    }
    $('#hdnDownload').val('');
    $('#hdnDownload').val(userCode);

    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastSubmittedReportRPT',
        data: 'userCode=' + userCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType,
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                // $("#lnkExcel").attr("href", response.split('$')[1]);
                $("#divReport").html(response);
                //   $("#divPrint").html(response.split('$')[0]);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
                $('#tblLastSubmittedReport').tablePagination({});
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                $("#spnTreeToggle").show();
                $('#dvTablePrint').hide();
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnGetViewAllLastSubmittedReportRPT() {

    ShowModalPopup("dvloading");
    $('#lnkExcel').hide();
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');

    $("#divCompReport").html("");
    $("#divCompPrint").html("");

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }
    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Last Submitted Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays > 92) {

        fnMsgAlert('info', 'Last Submitted Report', 'Start date and end date should not be greater than 92 days.');
        HideModalPopup("dvloading");
        return false;
    }
    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }
    var userCode = "ALL";
    $('#hdnDownload').val('');
    $('#hdnDownload').val(userCode);
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastSubmittedReportRPT',
        data: 'userCode=' + userCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType,
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                // $("#lnkExcel").attr("href", response.split('$')[1]);
                $("#divReport").html(response);
                //   $("#divPrint").html(response.split('$')[0]);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
                $('#tblLastSubmittedReport').tablePagination({});
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                $("#spnTreeToggle").show();
                $('#dvTablePrint').hide();
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnLastSubmittedPopupRPT(details) {

    ShowModalPopup("dvloading");

    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');
    var DCRDate = $('input:radio[name=UnDCRDate]:checked').val();
    var regionCode = details.split('_')[0];
    var userCode = details.split('_')[1];
    var startDate = details.split('_')[2];
    var endDate = details.split('_')[3];
    var type = details.split('_')[4];
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastsubmittedReportSubRPT',
        data: 'userCode=' + userCode + '&sd=' + startDate + '&ed=' + endDate + '&type=' + type + '&regionCode=' + regionCode,
        success: function (response) {
            $("#divModel").html('');
            if (response != "") {
                $("#divModel").html(response);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
                HideModalPopup("dvloading");
                ShowModalPopup('modal');
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnLeaveDetailPopUpRPT(details) {
    ShowModalPopup("dvloading");

    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');
    var DCRDate = $('input:radio[name=UnDCRDate]:checked').val();
    var leavetypeCode = details.split('_')[0];
    var userCode = details.split('_')[1];
    var startDate = details.split('_')[2];
    var endDate = details.split('_')[3];
    var regionCode = details.split('_')[4];
    var leaveTypeName = details.split('_')[5];

    $("#divInput").slideUp();
    $("#divModel").html('');
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetLastsubmittedLeaveReportSubRPT',
        data: 'userCode=' + userCode + '&sd=' + startDate + '&ed=' + endDate + '&ltn=' + leaveTypeName + '&ltc=' + leavetypeCode + '&regionCode=' + regionCode,
        success: function (response) {
            $("#divModel").html('');
            if (response != "") {
                $("#divModel").html(response);
                HideModalPopup("dvloading");
                ShowModalPopup('modal');
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}
