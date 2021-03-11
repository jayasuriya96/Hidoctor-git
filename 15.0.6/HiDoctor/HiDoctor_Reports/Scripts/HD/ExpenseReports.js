
function fnGetExpenseGroupMasterReport(userCode) {
    ShowModalPopup('dvloading');
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetExpenseGroupMasterReport',
        data: 'userCode=' + userCode,
        success: function (response) {
            var jsReport = eval('(' + response + ')');
            var tblCont = "";
            if (!(jsReport.Tables === undefined) && jsReport.Tables.length > 0 && jsReport.Tables[0].Rows.length > 0) {

                tblCont = "<table cellspacing='0' cellpadding='0' id='tblExpenseReport' class='data display dataTable box' width='100%'>";
                tblCont += "<thead>";
                tblCont += "<tr style='display: none;' id='tblTr'>";
                tblCont += "<th>User Name</th>";
                tblCont += "<th>Employee Name</th>";
                tblCont += "<th>User Type</th>";
                tblCont += "<th>Division</th>";
                tblCont += "<th>Reporting to</th>";
                tblCont += "<th>Reporting HQ</th>";
                tblCont += "<th>Expense Group Name</th>";
                tblCont += "</tr>";
                var type = '[{ type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }]';
                tblCont += "<tr>";
                tblCont += "<th>User Name</th>";
                tblCont += "<th>Employee Name</th>";
                tblCont += "<th>User Type</th>";
                tblCont += "<th>Division</th>";
                tblCont += "<th>Reporting to</th>";
                tblCont += "<th>Reporting HQ</th>";
                tblCont += "<th>Expense Group Name</th>";
                tblCont += "</tr>";
                tblCont += "<th colspan= '7' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tblCont += "</thead><tbody>";

                for (var k = 0; k < jsReport.Tables[0].Rows.length; k++) {
                    tblCont += "<tr>";
                    tblCont += "<td>" + jsReport.Tables[0].Rows[k]["User_Name"] + "</td>";
                    tblCont += "<td>" + jsReport.Tables[0].Rows[k]["Employee_Name"] + "</td>";
                    tblCont += "<td>" + jsReport.Tables[0].Rows[k]["User_Type_Name"] + "</td>";

                    var division = jsonPath(jsReport, "$.Tables[1].Rows[?(@.User_Code=='" + jsReport.Tables[0].Rows[k]["User_Code"] + "')]");

                    if (division != false && !(division === undefined)) {
                        tblCont += "<td>" + division[0].Division_Name + "</td>";
                    }
                    else {
                        tblCont += "<td>-</td>";
                    }
                    tblCont += "<td>" + jsReport.Tables[0].Rows[k]["Manager_Name"] + "</td>";
                    tblCont += "<td>" + jsReport.Tables[0].Rows[k]["Reporting_Region"] + "</td>";

                    if (jsReport.Tables[0].Rows[k]["Expense_Group_Id"] == null) {
                        tblCont += "<td>No group</td>";
                    }
                    else {
                        tblCont += "<td class='td-a' onclick='fnShowExpenseGroupDetails(\"" + jsReport.Tables[0].Rows[k]["Expense_Group_Id"] + "\")'>" + jsReport.Tables[0].Rows[k]["Expense_Group_Name"] + "</td>";
                    }
                    tblCont += "</tr>";
                }
                tblCont += "</tbody></table></br>";
                $("#divReport").html(tblCont);
                $("#divPrint").html(tblCont);
                var jsonType = eval(type);
                $('#tblExpenseReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'//, "sGroupBy": "Doctor Name"
                }).dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                HideModalPopup('dvloading');
                return;
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}

//************************* Start- Expense Analysis Report******************************
function fnChangeCheck() {
    if ($("input:checkbox[name=all]:checked").val() == "0,1,2") {
        $('input:checkbox[name=dcrStatus]').each(function () {
            $(this).removeAttr('checked');
        });
        return;
    }
}

function fnChangeRadio() {
    if ($(":checkbox[name=dcrStatus]:checked").length > 0) {
        $("input:checkbox[name=all]").removeAttr('checked');
        return;
    }
}

function fnExpenseAnalysisReport() {
    $("#divSubReport").empty();
    ShowModalPopup("dvloading");
    if (fnValidateExpenseAnalysisReport("Expense Analysis Report")) {
        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        if ($("input:checkbox[name=all]:checked").val() == "0,1,2") {
            dcrStatus = $("input:checkbox[name=all]:checked").val();
        }
        else {
            $('input:checkbox[name=dcrStatus]').each(function () {
                if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
            });
        }

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetExpenseAnalysisReport',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {

                var jExp = eval('(' + response + ')');
                var tblCont = "";
                if (!(jExp.Tables === undefined) && jExp.Tables.length > 0 && jExp.Tables[0].Rows.length > 0) {

                    // User details                    
                    tblCont = "<div id='dvUserDetails'><table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr>";
                    tblCont += "<th>User Name : " + jExp.Tables[0].Rows[0]["User_Name"] + "</th>";
                    tblCont += "<th>Employee Name : " + jExp.Tables[0].Rows[0]["Employee_Name"] + "</th>";
                    tblCont += "<th>Territory Name : " + jExp.Tables[0].Rows[0]["Region_Name"] + "</th>";
                    //jExp.Tables[0].Rows[0]["User_Code"]
                    var expDiv = jsonPath(jExp, "$.Tables[1].Rows[?(@.User_Code=='" + jExp.Tables[0].Rows[0]["User_Code"] + "')]");

                    if (expDiv != false) {
                        tblCont += "<th>Division : " + expDiv[0].Division_Name + "</th></tr>";
                    }
                    else {
                        tblCont += "<th>Division : </th></tr>";
                    }

                    tblCont += "<tr><th>Reporting Manager : " + jExp.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + jExp.Tables[0].Rows[0]["Manager_Name"] + ")</th>";
                    tblCont += "<th>Reporting HQ : " + jExp.Tables[0].Rows[0]["Manager_Region_Name"] + "</th>";
                    tblCont += "<th>Date of joining : " + ((jExp.Tables[0].Rows[0]["DOJ"] == null) ? "-" : jExp.Tables[0].Rows[0]["DOJ"]) + "</th>";
                    tblCont += "<th></th>";
                    tblCont += "</tr></thead></table></div></br>";

                    $("#divSubReport").append(tblCont);

                    //Work Summary
                    if (!(jExp.Tables === undefined) && jExp.Tables.length > 0 && jExp.Tables[2].Rows.length > 0) {
                        tblCont = "";
                        tblCont = "<div id='dvWrkSummary' style='float:left;width:50%;'><div class='gridHeader'><h3 style='margin:0px auto;'>Work Summary</h3></div>";
                        tblCont += "<table cellspacing='0' cellpadding='0' id='tblWrkSummary' class='data display dataTable box' width='100%'>";
                        tblCont += "<thead>";
                        tblCont += "<tr>";
                        tblCont += "<th>Category</th>";
                        tblCont += "<th>Days</th>";
                        tblCont += "<th>Total Expense</th></tr>";
                        tblCont += "</thead><tbody>";

                        for (var i = 0; i < jExp.Tables[2].Rows.length; i++) {
                            tblCont += "<tr>";
                            tblCont += "<td>No of Days in " + jExp.Tables[2].Rows[i]["Category"] + "</td>";
                            tblCont += "<td>" + jExp.Tables[2].Rows[i]["Days"] + "</td>";
                            tblCont += "<td>" + jExp.Tables[2].Rows[i]["Total"] + "</td>";
                            tblCont += "</tr>";
                        }
                        tblCont += "</tbody></table><div></br>";
                        $("#divSubReport").append(tblCont);
                    }
                    else {
                        $("#divSubReport").append('<span>No Work Summary data found.</span>');
                    }


                    //Expense Analysis Report
                    var fromDate = new Date(startDate.split('-')[0] + '/' + startDate.split('-')[1] + '/' + startDate.split('-')[2]);
                    var toDate = new Date(endDate.split('-')[0] + '/' + endDate.split('-')[1] + '/' + endDate.split('-')[2]);

                    var tempDate = new Date();

                    tblCont = "<div style='clear:both;'></div><div class='gridHeader'><h3 style='width: 99.5%;margin:0px auto;'>Expense Analysis Report</h3></div>";
                    tblCont += "<div style='float:left; width:100%;overflow:scroll;'><table cellspacing='0' cellpadding='0' id='tblExpenseAnalysis' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrpop'>";

                    tblCont += "<th style='display:none;'>User Name</th>";
                    tblCont += "<th style='display:none;'>Employee Name</th>";
                    tblCont += "<th style='display:none;'>Division Name</th>";
                    tblCont += "<th style='display:none;'>Date of Joining</th>";
                    tblCont += "<th style='display:none;'>Manager Name</th>";
                    tblCont += "<th style='display:none;'>Manager Territory name</th>";
                    tblCont += "<th style='display:none;'>Territory Name</th>";

                    tblCont += "<th >Date</th>";
                    tblCont += "<th >Activity name</th>";
                    tblCont += "<th >Status</th>";
                    tblCont += "<th >Category</th>";
                    tblCont += "<th >Work Place</th>";
                    tblCont += "<th >From-To,Mode(Distance)</th>";
                    tblCont += "<th >Sum of Distance</th>";
                    tblCont += "<th >Accompanist</th>";
                    tblCont += "<th >Total Expense</th>";
                    tblCont += "</tr>";
                    tblCont += "<tr>";

                    tblCont += "<th style='display:none;'>User Name</th>";
                    tblCont += "<th style='display:none;'>Employee Name</th>";
                    tblCont += "<th style='display:none;'>Division Name</th>";
                    tblCont += "<th style='display:none;'>Date of Joining</th>";
                    tblCont += "<th style='display:none;'>Manager Name</th>";
                    tblCont += "<th style='display:none;'>Manager Territory name</th>";
                    tblCont += "<th style='display:none;'>Territory Name</th>";

                    tblCont += "<th >Date</th>";
                    tblCont += "<th >Activity name</th>";
                    tblCont += "<th >Status</th>";
                    tblCont += "<th >Category</th>";
                    tblCont += "<th >Work Place</th>";
                    tblCont += "<th >From-To,Mode(Distance)</th>";
                    tblCont += "<th >Sum of Distance</th>";
                    tblCont += "<th >Accompanist</th>";
                    tblCont += "<th >Total Expense</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '16' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapopup()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";
                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },';
                    type += '{ type: "date" },{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "number-range" }, { type: "text" }, { type: "number-range" }]';
                    var totalExp = 0.0;

                    for (tempDate = fromDate; tempDate <= toDate; tempDate.setDate(tempDate.getDate() + 1)) {

                        var tempDateString = ((tempDate.getDate() <= 9) ? '0' + tempDate.getDate() : tempDate.getDate()) + '/' + (((tempDate.getMonth() + 1) <= 9) ? '0' + (tempDate.getMonth() + 1) : (tempDate.getMonth() + 1)) + '/' + tempDate.getFullYear();

                        var dcrJson = jsonPath(jExp, "$.Tables[3].Rows[?(@.DCR_Actual_Date=='" + tempDateString + "')]");
                        var holidayJson = jsonPath(jExp, "$.Tables[8].Rows[?(@.Holiday_Date=='" + tempDateString + "')]");

                        // if dcr entered
                        if (dcrJson != false && dcrJson !== undefined) {
                            for (k = 0; k < dcrJson.length; k++) {
                                tblCont += "<tr>";
                                tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["User_Name"] + "</td>";
                                tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Employee_Name"] + "</td>";
                                //jExp.Tables[0].Rows[0]["User_Code"]
                                var expDiv = jsonPath(jExp, "$.Tables[1].Rows[?(@.User_Code=='" + jExp.Tables[0].Rows[0]["User_Code"] + "')]");

                                if (expDiv != false) {
                                    tblCont += "<td style='display:none;'>" + expDiv[0].Division_Name + "</td>";
                                }
                                else {
                                    tblCont += "<td style='display:none;'></td>";
                                }
                                tblCont += "<td style='display:none;'>" + ((jExp.Tables[0].Rows[0]["DOJ"] == null) ? "-" : jExp.Tables[0].Rows[0]["DOJ"]) + "</td>";
                                tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + jExp.Tables[0].Rows[0]["Manager_Name"] + ")</td>";
                                tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>";
                                tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Region_Name"] + "</td>";

                                var style = "";
                                if ((holidayJson != false && holidayJson !== undefined) || tempDate.getDay() == 0) {
                                    style = "style='background-color: #d3d3d3;'";
                                    var holidayOrSunday = "";
                                    if (holidayJson != false && holidayJson !== undefined) {
                                        holidayOrSunday = "Holiday";
                                    }
                                    else {
                                        holidayOrSunday = "Sunday";
                                    }

                                    tblCont += "<td " + style + ">" + tempDateString + "</td>";
                                    // Holiday/Sunday with Leave
                                    if (dcrJson[k]["DCR_Type"] == "Leave") {
                                        var ljson = jsonPath(jExp, "$.Tables[6].Rows[?(@.DCR_Code=='" + dcrJson[k]["DCR_Code"] + "')]");
                                        if (ljson != false) {
                                            tblCont += "<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + ljson[0].Leave_Type_Name + ")</td>";
                                        }
                                        else {
                                            tblCont += "<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>";
                                        }
                                    }

                                        // Holiday/Sunday with Attendance
                                    else if (dcrJson[k]["DCR_Type"] == "Attendance") {
                                        var ljson = jsonPath(jExp, "$.Tables[5].Rows[?(@.DCR_Code=='" + dcrJson[k]["DCR_Code"] + "')]");
                                        if (ljson != false) {
                                            tblCont += "<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + ljson[0].Activity_Name + ")</td>";
                                        }
                                        else {
                                            tblCont += "<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>";
                                        }
                                    }

                                        // Holiday/Sunday with Field
                                    else {
                                        tblCont += "<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>";
                                    }
                                }
                                else {
                                    style = "";
                                    tblCont += "<td " + style + ">" + tempDateString + "</td>";
                                    // Only Leave
                                    if (dcrJson[k]["DCR_Type"] == "Leave") {
                                        var ljson = jsonPath(jExp, "$.Tables[6].Rows[?(@.DCR_Code=='" + dcrJson[k]["DCR_Code"] + "')]");
                                        if (ljson != false) {
                                            tblCont += "<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + ljson[0].Leave_Type_Name + ")</td>";
                                        }
                                        else {
                                            tblCont += "<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>";
                                        }
                                    }

                                        // Only Attendance
                                    else if (dcrJson[k]["DCR_Type"] == "Attendance") {
                                        var ljson = jsonPath(jExp, "$.Tables[5].Rows[?(@.DCR_Code=='" + dcrJson[k]["DCR_Code"] + "')]");
                                        if (ljson != false) {
                                            tblCont += "<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + ljson[0].Activity_Name + ")</td>";
                                        }
                                        else {
                                            tblCont += "<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>";
                                        }
                                    }

                                        // Only Field
                                    else {
                                        tblCont += "<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>";
                                    }
                                }
                                tblCont += "<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>";
                                //for Leave
                                if (dcrJson[k]["DCR_Type"] == "Leave") {
                                    for (var u = 0; u < 6; u++) {
                                        if (u == 0) { tblCont += "<td style='background-color: #d3d3d3;'>N/A</td>"; }
                                        else { tblCont += "<td style='background-color: #d3d3d3;'></td>"; }
                                    }
                                }

                                    //for Attendance and field
                                else {
                                    tblCont += "<td " + style + ">" + dcrJson[k]["Category"] + "</td>";
                                    tblCont += "<td " + style + ">" + dcrJson[k]["Place_Worked"] + "</td>";

                                    // for HQ
                                    if (dcrJson[k]["Category"] == "HQ") {
                                        if (dcrJson[k]["From_Place"] != null && dcrJson[k]["From_Place"] != '') {
                                            tblCont += "<td " + style + ">" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>";
                                            tblCont += "<td " + style + ">" + dcrJson[k]["Travelled_Kms"] + "</td>";
                                        }
                                        else {
                                            tblCont += "<td " + style + "></td>";
                                            tblCont += "<td " + style + "></td>";
                                        }
                                    }

                                        // for other than HQ
                                    else {
                                        if (dcrJson[k]["From_Place"] != null && dcrJson[k]["From_Place"] != '') {
                                            tblCont += "<td " + style + ">" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>";
                                            tblCont += "<td " + style + ">" + dcrJson[k]["Travelled_Kms"] + "</td>";
                                        }
                                        else {
                                            var rdJson = jsonPath(jExp, "$.Tables[4].Rows[?(@.DCR_Code=='" + dcrJson[k]["DCR_Code"] + "' & @.DCR_HOP_Flag=='" + dcrJson[k]["Flag"] + "')]");
                                            var totaldistanse = 0.0;
                                            if (rdJson != false) {
                                                tblCont += "<td " + style + ">";
                                                for (var g = 0; g < rdJson.length; g++) {
                                                    if (rdJson[g].Route_Way != "R") {
                                                        tblCont += rdJson[g].From_Place + "-" + rdJson[g].To_Place + "," + rdJson[g].Travel_Mode + "(" + rdJson[g].Distance + ")</br>";
                                                        totaldistanse += rdJson[g].Distance
                                                    }
                                                    else {
                                                        tblCont += rdJson[g].From_Place + "-" + rdJson[g].To_Place + "," + rdJson[g].Travel_Mode + "(" + rdJson[g].Distance + ")</br>";
                                                        totaldistanse += rdJson[g].Distance
                                                    }
                                                }
                                                tblCont += "</td>";

                                                tblCont += "<td " + style + ">";
                                                //for (var g = 0; g < rdJson.length; g++) {
                                                //    if (rdJson[g].Route_Way != "R") {
                                                //        tblCont += rdJson[g].Distance + "</br>";
                                                //    }
                                                //    else {
                                                //        tblCont += rdJson[g].Distance + "</br>";
                                                //    }
                                                //}
                                                tblCont += totaldistanse;
                                                tblCont += "</td>";
                                            }
                                            else {
                                                tblCont += "<td " + style + "></td>";
                                                tblCont += "<td " + style + "></td>";

                                            }
                                        }
                                    }

                                    //for Attendance
                                    if (dcrJson[k]["DCR_Type"] == "Attendance") {
                                        for (var u = 0; u < 1; u++) {
                                            if (u == 0) { tblCont += "<td style='background-color: #d3d3d3;'>N/A</td>"; }
                                            else { tblCont += "<td style='background-color: #d3d3d3;'></td>"; }
                                        }
                                    }
                                        //for Field
                                    else {
                                        var accName = "";
                                        if (dcrJson[k]["Acc1_Name"] != null) { accName += dcrJson[k]["Acc1_Name"] + ","; }
                                        if (dcrJson[k]["Acc2_Name"] != null) { accName += dcrJson[k]["Acc2_Name"] + ","; }
                                        if (dcrJson[k]["Acc3_Person"] != null) { accName += dcrJson[k]["Acc3_Person"] + ","; }
                                        if (dcrJson[k]["Acc4_Person"] != null) { accName += dcrJson[k]["Acc4_Person"]; }
                                        tblCont += "<td " + style + ">" + accName + "</td>";
                                    }

                                    var expJson = "";
                                    if (dcrJson[k]["DCR_Type"] == "Attendance") {
                                        expJson = jsonPath(jExp, "$.Tables[7].Rows[?(@.DCR_Code=='" + dcrJson[k]["DCR_Code"] + "' && @.DCR_Flag=='A')]");
                                    }
                                    else if (dcrJson[k]["DCR_Type"] == "Field") {
                                        expJson = jsonPath(jExp, "$.Tables[7].Rows[?(@.DCR_Code=='" + dcrJson[k]["DCR_Code"] + "'  && @.DCR_Flag=='F')]");
                                    }

                                    if (expJson != false) {
                                        tblCont += "<td " + style + " align='right' class='td-a' onclick='fnShowExpenseAnalysisDetails(\"" + expJson[0].DCR_Code + "_" + expJson[0].DCR_Flag + "\")'>" + expJson[0].Total + "</td>";
                                        totalExp = parseFloat(totalExp) + parseFloat(expJson[0].Total);
                                    }
                                    else {
                                        tblCont += "<td " + style + ">-</td>";
                                    }
                                }
                                tblCont += "</tr>";
                            }

                        }

                            // holiday entered
                        else if (holidayJson != false && holidayJson !== undefined) {
                            tblCont += "<tr>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["User_Name"] + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Employee_Name"] + "</td>";
                            //jExp.Tables[0].Rows[0]["User_Code"]
                            var expDiv = jsonPath(jExp, "$.Tables[1].Rows[?(@.User_Code=='" + jExp.Tables[0].Rows[0]["User_Code"] + "')]");

                            if (expDiv != false) {
                                tblCont += "<td style='display:none;'>" + expDiv[0].Division_Name + "</td>";
                            }
                            else {
                                tblCont += "<td style='display:none;'></td>";
                            }
                            tblCont += "<td style='display:none;'>" + ((jExp.Tables[0].Rows[0]["DOJ"] == null) ? "-" : jExp.Tables[0].Rows[0]["DOJ"]) + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + jExp.Tables[0].Rows[0]["Manager_Name"] + ")</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Region_Name"] + "</td>";

                            tblCont += "<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>";
                            if (tempDate.getDay() == 0) { // holiday on sunday
                                tblCont += "<td style='background-color: #d3d3d3;'>Sunday(Holiday-" + holidayJson[0].Holiday + ")</td>";
                            }
                            else {
                                tblCont += "<td style='background-color: #d3d3d3;'>Holiday(" + holidayJson[0].Holiday + ")</td>";
                            }
                            for (var u = 0; u < 7; u++) {
                                tblCont += "<td style='background-color: #d3d3d3;'></td>";
                            }
                            tblCont += "</tr>";
                        }

                            // Sunday
                        else if (tempDate.getDay() == 0) {
                            tblCont += "<tr>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["User_Name"] + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Employee_Name"] + "</td>";
                            //jExp.Tables[0].Rows[0]["User_Code"]
                            var expDiv = jsonPath(jExp, "$.Tables[1].Rows[?(@.User_Code=='" + jExp.Tables[0].Rows[0]["User_Code"] + "')]");

                            if (expDiv != false) {
                                tblCont += "<td style='display:none;'>" + expDiv[0].Division_Name + "</td>";
                            }
                            else {
                                tblCont += "<td style='display:none;'></td>";
                            }
                            tblCont += "<td style='display:none;'>" + ((jExp.Tables[0].Rows[0]["DOJ"] == null) ? "-" : jExp.Tables[0].Rows[0]["DOJ"]) + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + jExp.Tables[0].Rows[0]["Manager_Name"] + ")</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Region_Name"] + "</td>";

                            tblCont += "<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>";
                            for (var u = 0; u < 8; u++) {
                                if (u == 0) { tblCont += "<td style='background-color: #d3d3d3;'>Sunday</td>"; }
                                else { tblCont += "<td style='background-color: #d3d3d3;'></td>"; }
                            }
                            tblCont += "</tr>";
                        }

                            // No Report
                        else {
                            tblCont += "<tr>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["User_Name"] + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Employee_Name"] + "</td>";
                            //jExp.Tables[0].Rows[0]["User_Code"]
                            var expDiv = jsonPath(jExp, "$.Tables[1].Rows[?(@.User_Code=='" + jExp.Tables[0].Rows[0]["User_Code"] + "')]");

                            if (expDiv != false) {
                                tblCont += "<td style='display:none;'>" + expDiv[0].Division_Name + "</td>";
                            }
                            else {
                                tblCont += "<td style='display:none;'></td>";
                            }
                            tblCont += "<td style='display:none;'>" + ((jExp.Tables[0].Rows[0]["DOJ"] == null) ? "-" : jExp.Tables[0].Rows[0]["DOJ"]) + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + jExp.Tables[0].Rows[0]["Manager_Name"] + ")</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>";
                            tblCont += "<td style='display:none;'>" + jExp.Tables[0].Rows[0]["Region_Name"] + "</td>";

                            tblCont += "<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>";
                            for (var u = 0; u < 8; u++) {
                                if (u == 0) { tblCont += "<td style='background-color: #d3d3d3;'>No Report</td>"; }
                                else { tblCont += "<td style='background-color: #d3d3d3;'></td>"; }
                            }
                            tblCont += "</tr>";
                        }
                    }

                    tblCont += "</tbody>";
                    tblCont += "<tfoot align='left'><th colspan='7' style='display:none;'></th><th colspan='9'>Total Expense : " + totalExp.toFixed(2) + "</th></tfoot>";
                    tblCont += "</table></div></br>";
                    $("#divSubReport").append(tblCont);
                    // $("#divPrint").html(tblCont);
                    $("#divsubPrint").html(tblCont);
                    var jsonType = eval(type);
                    $('#tblExpenseAnalysis').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "bSort": false//, "sGroupBy": "Doctor Name"
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });

                    $("#divSubReport").append('<div style="clear:both"></div>');
                    $('#divReport').show();
                    //fninializePrint("divPrint", "ifrmPrint");
                    fninializePrint("divsubPrint", "ifrmsubPrint", "divSubReport");
                    HideModalPopup("dvloading");
                }
                else {
                    fnMsgAlert('info', 'Expense Analysis Report', 'No Data found.');
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



function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}
function fninializeExcel(mainDiv, blobUrl) {
    $('#' + mainDiv + ' #aExcel').remove();
    $("#" + mainDiv + " .TableTools").append("<a id='aExcel' href='" + blobUrl + "' title='Excel Export' class='TableTools_button' style='background: url(../Content/DataTable/media/images/xls.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></a>");
}


function fnToggleTreeapopup() {
    if ($("#spnDivToggle").html() == "Hide Filter") {


        $("#tblTrpop").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrpop").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}
function fnValidateExpenseAnalysisReport(screenName) {
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
    if ($(":checkbox[name=all]:checked").length == 0 && $(":checkbox[name=dcrStatus]:checked").length == 0) {
        fnMsgAlert('info', screenName, 'Please select DCR status.');
        HideModalPopup("dvloading");
        return false;
    }

    var fromDate = $("#txtFromDate").val().split('/')[2] + '/' + $("#txtFromDate").val().split('/')[1] + '/' + $("#txtFromDate").val().split('/')[0];
    var toDate = $("#txtToDate").val().split('/')[2] + '/' + $("#txtToDate").val().split('/')[1] + '/' + $("#txtToDate").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (endDate != "") {
        if (startDate > endDate) {
            fnMsgAlert('info', screenName, 'End date can not be less than start date.');
            HideModalPopup("dvloading");
            $("#txtToDate").val("");
            return false;
        }
    }
    return true;
}

function fnShowExpenseAnalysisDetails(id) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetExpenseAnalysisReportPopUp',
        data: 'dcrCode=' + id.split('_')[0] + '&flag=' + id.split('_')[1] + '&userCode=' + $("#hdnUserCode").val(),
        success: function (response) {
            var jsReport = eval('(' + response + ')');
            var content = "";
            if (!(jsReport.Tables === undefined) && jsReport.Tables.length > 0 && jsReport.Tables[0].Rows.length > 0) {

                content = "<table cellspacing='0' cellpadding='0' width='50%'  id='tblNonDaily' class='data display dataTable box'>";
                content += "<thead>";
                content += "<tr><th>Expense Type</th>";
                content += "<th>Expense Amount</th>";
                content += "<th>Remarks</th>";
                content += "</tr>";
                content += "</thead><tbody>";

                for (var j = 0; j < jsReport.Tables[0].Rows.length; j++) {
                    content += "<tr>";
                    content += "<td>" + jsReport.Tables[0].Rows[j]["Expense_Type_Name"] + "</td>";
                    content += "<td>" + jsReport.Tables[0].Rows[j]["Expense_Amount"] + "</td>";
                    content += "<td>" + jsReport.Tables[0].Rows[j]["Expense_Remarks"] + "</td>";
                    content += "</tr>";
                }
                content += "</tbody></table>";

                var userDet = $("#dvUserDetails").html();
                $("#dvDailyBlockM").html(userDet);
                $("#dvNonDailyBlockM").html(content);
            }
            else {
                fnMsgAlert('info', 'Information', 'No Data is mapped for this Expense group.');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnClearExpenseAnalysisReport() {
    $("#txtFromDate").val('');
    $("#txtToDate").val('');
    $('input:checkbox[name=dcrStatus]').each(function () {
        $(this).removeAttr('checked');
    });
    $("input:checkbox[name=all]").attr('checked', 'checked');
}
//************************* End- Expense Analysis Report******************************

//************************* Start- Expense Summary Report******************************

function fnExpenseSummaryReport() {
    $("#divReport").empty();
    $("#divSubReport").empty();
    ShowModalPopup("dvloading");
    if (fnValidateExpenseAnalysisReport("Expense Summary Report")) {
        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        if ($("input:checkbox[name=all]:checked").val() == "0,1,2") {
            dcrStatus = $("input:checkbox[name=all]:checked").val();
        }
        else {
            $('input:checkbox[name=dcrStatus]').each(function () {
                if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
            });
        }

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetExpenseSummaryReport',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnMainUserCode").val(),
            success: function (response) {
                var jExp = eval('(' + response + ')');
                var tblCont = "";
                if (!(jExp.Tables === undefined) && jExp.Tables.length > 0 && jExp.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblExpenseSummary' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTr'>";
                    tblCont += "<th>User Name</th>";
                    tblCont += "<th>Employee Name</th>";
                    tblCont += "<th>User Type</th>";
                    tblCont += "<th>Division</th>";
                    tblCont += "<th>Reporting to</th>";
                    tblCont += "<th>Reporting HQ</th>";
                    tblCont += "<th>Total Expense</th>";
                    tblCont += "</tr>";

                    var type = '[{ type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "number-range" }]';
                    tblCont += "<tr>";
                    tblCont += "<th>User Name</th>";
                    tblCont += "<th>Employee Name</th>";
                    tblCont += "<th>User Type</th>";
                    tblCont += "<th>Division</th>";
                    tblCont += "<th>Reporting to</th>";
                    tblCont += "<th>Reporting HQ</th>";
                    tblCont += "<th>Total Expense</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '7' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";

                    for (var k = 0; k < jExp.Tables[0].Rows.length; k++) {
                        tblCont += "<tr>";
                        tblCont += "<td>" + jExp.Tables[0].Rows[k]["User_Name"] + "</td>";
                        tblCont += "<td>" + jExp.Tables[0].Rows[k]["Employee_Name"] + "</td>";
                        tblCont += "<td>" + jExp.Tables[0].Rows[k]["User_Type_Name"] + "</td>";

                        var division = jsonPath(jExp, "$.Tables[1].Rows[?(@.User_Code=='" + jExp.Tables[0].Rows[k]["User_Code"] + "')]");

                        if (division != false && !(division === undefined)) {
                            tblCont += "<td>" + division[0].Division_Name + "</td>";
                        }
                        else {
                            tblCont += "<td>-</td>";
                        }
                        tblCont += "<td>" + jExp.Tables[0].Rows[k]["Manager_Name"] + "</td>";
                        tblCont += "<td>" + jExp.Tables[0].Rows[k]["Reporting_Region"] + "</td>";

                        var expAmount = jsonPath(jExp, "$.Tables[2].Rows[?(@.User_Code=='" + jExp.Tables[0].Rows[k]["User_Code"] + "')]");

                        if (expAmount != false && !(expAmount === undefined)) {

                            tblCont += "<td class='td-a' onclick='fnRedirectToExpenseAnalysis(\"" + jExp.Tables[0].Rows[k]["User_Code"] + "\")'>" + expAmount[0].Total + "</td>";
                        }
                        else {
                            tblCont += "<td>-</td>";
                        }
                        tblCont += "</tr>";
                    }
                    tblCont += "</tbody></table></br>";
                    $("#divReport").html(tblCont);
                    $("#divPrint").html(tblCont);
                    var jsonType = eval(type);
                    $('#tblExpenseSummary').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'//, "sGroupBy": "Doctor Name"
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });

                    $("#divReport").show();
                    fninializePrint("divPrint", "ifrmPrint", "divReport");
                    HideModalPopup('dvloading');
                    return;
                }
                else {
                    fnMsgAlert('info', 'Expense Summary Report', 'No Data found.');
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

function fnRedirectToExpenseAnalysis(userCode) {
    $("#divSubReport").hide();
    $('#hdnUserCode').val(userCode);
    fnExpenseAnalysisReport();
    $("#divSubReport").show();
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

//************************* End- Expense Summary Report******************************

//************************* Start- Expense Analysis- Group Wise Report******************************

function fnClearExpenseAnalysisGroupWiseReport() {
    $("#txtFromDate").val('');
    $("#txtToDate").val('');
    $('input:checkbox[name=dcrStatus]').each(function () {
        $(this).removeAttr('checked');
    });
    $("input:checkbox[name=all]").removeAttr('checked', 'checked');

    $("#chkApproved").attr('checked', true);
    $("#chkApplied").attr('checked', true);

    $('input:checkbox[name=dcrActivity]').each(function () {
        $(this).removeAttr('checked');
    });
    $("input:checkbox[name=allActivity]").attr('checked', 'checked');

    $('input:checkbox[name=chkDocChemist]').each(function () {
        $(this).removeAttr('checked');
    });

    $("#chkDoctor").attr('checked', true);
}

function fnChangeCheckExpenseGroupWise() {
    if ($("input:checkbox[name=all]:checked").val() == "0,1,2") {
        $('input:checkbox[name=dcrStatus]').each(function () {
            $(this).removeAttr('checked');
        });
        return;
    }
}

function fnChangeRadioExpenseGroupWise() {
    if ($(":checkbox[name=dcrStatus]:checked").length > 0) {
        $("input:checkbox[name=all]").removeAttr('checked');
        return;
    }
}

function fnChangeActivityCheck() {
    if ($("input:checkbox[name=allActivity]:checked").val() == "F,A") {
        $('input:checkbox[name=dcrActivity]').each(function () {
            $(this).removeAttr('checked');
        });
        return;
    }
}


function fnChangeActivityRadio() {
    if ($(":checkbox[name=dcrActivity]:checked").length > 0) {
        $("input:checkbox[name=allActivity]").removeAttr('checked');
        return;
    }
}

function fnExpenseAnalysisGroupWiseReport() {
    $("#divReport").empty();
    $('#divCompReport').empty();

    ShowModalPopup("dvloading");

    //$("input:checkbox[name=allActivity]:checked").length==1 $("#chkField:checked").length
    if (fnValidateExpenseAnalysisReport("Expense Analysis Group Wise Report")) {
        if ($(":checkbox[name=allActivity]:checked").length == 0 && $(":checkbox[name=dcrActivity]:checked").length == 0) {
            fnMsgAlert('info', "Expense Analysis Group Wise Report", 'Please select Activity status.');
            HideModalPopup("dvloading");
            return false;
        }


        var dcrStatus = "", activityStatus = "", docChemistMet = "";
        var startDate = "", endDate = "";
        var printContent = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        var rowCount = 0;
        //get dcr status
        if ($("input:checkbox[name=all]:checked").val() == "0,1,2") {
            dcrStatus = $("input:checkbox[name=all]:checked").val();
            rowCount = 3;
        }
        else {
            $('input:checkbox[name=dcrStatus]').each(function () {
                if ($(this).is(':checked')) {
                    rowCount++;
                    dcrStatus += $(this).val() + ",";
                }
            });
        }

        //get activty status
        if ($("input:checkbox[name=allActivity]:checked").val() == "F,A") {
            activityStatus = $("input:checkbox[name=allActivity]:checked").val();
        }
        else {
            $('input:checkbox[name=dcrActivity]').each(function () {
                if ($(this).is(':checked')) {
                    activityStatus += $(this).val() + ",";
                }
            });
        }

        $('input:checkbox[name=chkDocChemist]').each(function () {
            if ($(this).is(':checked')) {
                rowCount++;
                docChemistMet += $(this).val() + ",";
            }
        });

        // assign date values in server controls for excel export
        $("#sd").val($("#txtFromDate").val());
        $("#ed").val($("#txtToDate").val());

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ExpenseGroupReport/GetExpenseAnalysisGroupWiseReport',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val() + '&docChemistMet=' + docChemistMet + '&activityStatus=' + activityStatus + '&rowCount=' + rowCount + '&reportName=' + reportName,
            success: function (response) {
                if (response.split('^')[0] != 'FAIL') {
                    $("#divReport").append(response.split('$')[0]);
                    $("#divPrint").html(response.split('$')[1]);
                    var totalExp = parseFloat(response.split('$')[2]);
                    var expModeCount = parseInt(response.split('$')[3]);
                    var docCount = parseInt(response.split('$')[4]);
                    var blobUrl = response.split('$')[5];
                    var totalDistances = response.split('$')[6];

                    $('#dvPrintTotal').html("Total Expense : " + totalExp.toFixed(2));

                    $('#tblExpenseAnalysis').dataTable({
                        "sPaginationType": "full_numbers",
                        "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                            var subTotalArr = new Array();
                            var grandTotalArr = new Array();
                            var colArray = new Array();

                            // 12 static column 
                            // expense will start from 13 or 17 (if doc count 4)

                            var arrInx = 0;
                            var startIdx = 14 + (4 - docCount);
                            var endIdx = 14 + (4 - docCount) + (expModeCount * 3);
                            var skipFrst = 1;
                            var docTotalStrt = startIdx - (4 - docCount);
                            var discount = 13
                            //for dynamic Distances count total


                            for (var col = docTotalStrt - 1; col < startIdx ; col++) {
                                for (var i = 0; i < aaData.length; i++) {
                                    if (subTotalArr[arrInx] === undefined) {
                                        subTotalArr[arrInx] = 0.0;
                                    }
                                    if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                        subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                    }
                                }
                                colArray[arrInx] = col;
                                arrInx++;
                            }


                            // for dynamic doctor count total
                            for (var col = docTotalStrt; col < startIdx ; col++) {
                                for (var i = 0; i < aaData.length; i++) {
                                    if (subTotalArr[arrInx] === undefined) {
                                        subTotalArr[arrInx] = 0.0;
                                    }
                                    if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                        subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                    }
                                }
                                colArray[arrInx] = col;
                                arrInx++;
                            }

                            // for dynamic Expense type expenses
                            for (var col = startIdx; col < endIdx ; col++) {
                                if (skipFrst == 3) {
                                    for (var i = 0; i < aaData.length; i++) {
                                        if (subTotalArr[arrInx] === undefined) {
                                            subTotalArr[arrInx] = 0.0;
                                        }
                                        if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                            subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                        }
                                    }
                                    colArray[arrInx] = col;
                                    arrInx++;
                                    skipFrst = 0;
                                }
                                skipFrst++;
                            }

                            //Total Expense
                            for (var i = 0; i < aaData.length; i++) {
                                if (subTotalArr[arrInx] === undefined) {
                                    subTotalArr[arrInx] = 0.0;
                                }
                                if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                    subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                }
                            }
                            colArray[arrInx] = col;

                            // grand total
                            for (var col = 0; col < colArray.length ; col++) {
                                for (var i = iStart; i < iEnd; i++) {
                                    if (grandTotalArr[col] === undefined) {
                                        grandTotalArr[col] = 0.0;
                                    }
                                    if (!isNaN(aaData[aiDisplay[i]][colArray[col]].replace(',', '')) && aaData[aiDisplay[i]][colArray[col]] != "") {
                                        grandTotalArr[col] += parseFloat(aaData[aiDisplay[i]][colArray[col]].replace(',', ''));
                                    }
                                }
                            }

                            var ncell = nRow.getElementsByTagName('th');

                            for (var col = 0; col < colArray.length; col++) {
                                ncell[colArray[col]].innerHTML = addCommas(grandTotalArr[col].toFixed(2)) + '<br/>(' + addCommas(subTotalArr[col].toFixed(2)) + ')';
                            }

                        },
                        "bDestroy": true,
                        "sDom": 'T<"clear">lfrtip',
                        "bSort": false,
                        "bSearchable": false,
                        "bFilter": false
                    }).dataTable();

                    if (expenseReportid_g == "OLD") {
                        $(".TableTools_clipboard").css('display', 'show');
                        $("#divReport").show();
                        fninializePrint("divPrint", "ifrmPrint", "divReport");
                        fninializeExcel("divReport", blobUrl);
                    }
                    else {
                        $(".TableTools_clipboard").css('display', 'none');
                        $("#divReport").show();
                        fninializePrint("divPrint", "ifrmPrint", "divReport");
                        //fninializeExcel("divReport", blobUrl);
                    }
                    HideModalPopup("dvloading");
                }
                else {
                    fnMsgAlert('info', 'Error:', response.split('^')[1]);
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

function fnOpenAccompanistDetails(dcrDate) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetAccompanistDetailForaDay',
        data: '&userCode=' + $("#hdnUserCode").val() + '&dcrDate=' + dcrDate,
        success: function (response) {
            var jExp = eval('(' + response + ')');
            if (!(jExp.Tables === undefined) && jExp.Tables.length > 0 && jExp.Tables[0].Rows.length > 0) {
                var cont = "";
                for (var p = 0; p < jExp.Tables[0].Rows.length; p++) {
                    cont += "<div style='float:left;width:100%;'>" + jExp.Tables[0].Rows[p].Accomp_Name + "</div>";
                }

                $("#dvSubAccpName").html(cont);
                ShowModalPopup("dvLoadingAccpName");
            }
            else {
                fnMsgAlert('info', 'Report', 'No Accompanist details found.');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });
}

//************************* End- Expense Analysis- Group Wise Report******************************


//****************************** Start - Expense Claim Report ***************
function fnChangeStatusCheck() {
    if ($(":checkbox[name=claimStatusAll]:checked").length > 0) {
        $('input:checkbox[name=claimStatus]').each(function () {
            $(this).removeAttr('checked');
        });
        return;
    }
}

function fnChangeStatusRadio() {
    if ($(":checkbox[name=claimStatus]:checked").length > 0) {
        $("input:checkbox[name=claimStatusAll]").removeAttr('checked');
        return;
    }
}

function fnExpenseClaimReport() {
    fnToggleTree();
    $("#divReport").empty();
    $('#dvTablePrint').hide();
    $('#spnPeriodDetail').html("");
    
    ShowModalPopup("dvloading");
    if (fnValidateExpenseClaimReport("Expense Claim Report")) {
        var claimStatus = "";
        var claimstatusname = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        if ($(":checkbox[name=claimStatusAll]:checked").length > 0) {
            claimStatus = $("input:checkbox[name=claimStatusAll]:checked").val();
            claimstatusname = $("input:checkbox[name=claimStatusAll]:checked").attr('name_text');
        }
        else {
            $('input:checkbox[name=claimStatus]').each(function () {
                if ($(this).is(':checked'))
                {
                    claimStatus += $(this).val() + ",";
                    claimstatusname += $(this).attr('name_text') + ",";
                }
            });
        }


        //if ($(":checkbox[name=claimStatusAll]:checked").length > 0) {
        //   // claimstatusname = "ALL";
        //    claimstatusname = $("input:checkbox[name=claimStatusAll]:checked").attr('name_text');
        //}
        //else {
        //    $('input:checkbox[name=claimStatus]').each(function () {
        //        if ($(this).is(':checked')) {
        //            claimstatusname += $(this).attr('name_text') + ",";
        //        }
        //    });
        //}

        $('#spnPeriodDetail').html(" for the Period of " + $("#txtFromDate").val() + " to " + $("#txtToDate").val());
        var viewFormat = $("input[name='rptOptions']:checked").val();
        $('#dvExpenseClaimDetails').css('display', 'none');
        $('#divdivider').css('display', 'none');
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetExpenseClaimReport',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&claimStatus=' + escape(claimStatus) + '&userCode=' + $("#hdnUserCode").val() + '&mode=' + viewFormat + '&claimstatusname=' + claimstatusname,
            success: function (response) {
                if (response != "") {
                    var tblCont = response.split('$')[0];
                    var expTypeCont = parseInt(response.split('$')[2]);

                    var type = "[{ type: 'text' }, { type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' }";
                    type += ",{ type: 'text' }, { type: 'date' }";
                    type += ",{ type: 'date' }, { type: 'date' }";
                    type += ",{ type: 'text' }, { type: 'date' },{ type: 'text' }";
                    if (expTypeCont > 0) {
                        for (var u = 0; u < expTypeCont; u++) {
                            type += ", { type: 'number-range' }, { type: 'number-range' }";
                        }
                    }
                    //type += ", { type: 'number-range' }, { type: 'number-range' }, { type: 'number-range' }, { type: 'number-range' }, { type: 'number-range' }, { type: 'number-range' }";
                    type += ",{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' },{ type: 'text' }";
                    type += ", { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' },{ type: 'text' }]";

                    debugger;
                    $("#divReport").append(tblCont);

                    $(".expRem").each(function () {
                        if ($(this).html().length > 30) {
                            $(this).html($(this).html().substring(0, 30) + '...');
                        }
                    });
                    //Print
                    var printHeader = "";

                    printHeader = "<table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%'>";
                    printHeader += "<thead>";

                    printHeader += "<tr>";
                    printHeader += "<th style='font-size:18px;' align='left'><b>" + $("#divPageHeader").html() + "</b></th>";
                    printHeader += "</tr>";

                    printHeader += "<tr>";
                    printHeader += "<th align='right'>";
                    printHeader += "<img style='display: inline;' src='" + $("#imgIndexClientLogo").attr('src') + "'>";
                    printHeader += "</th>";
                    printHeader += "</tr>";
                    printHeader += "</thead></table>";

                    $("#dvPrintContent").html(printHeader + tblCont);

                    var jsonType = eval(type);
                    debugger;
                    $('#tblExpenseClaim').dataTable({
                        "sPaginationType": "full_numbers",
                        "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                            var subTotalArr = new Array();
                            var grandTotalArr = new Array();
                            var colArray = new Array();

                            var arrInx = 0;
                            var startIdx = 19;
                            var endIdx = 22 + (expTypeCont * 3);


                            // for dynamic Expense type expenses
                            for (var col = startIdx; col < endIdx ; col++) {
                                for (var i = 0; i < aaData.length; i++) {
                                    if (subTotalArr[arrInx] === undefined) {
                                        subTotalArr[arrInx] = 0.0;
                                    }
                                    if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                        subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                    }
                                }
                                colArray[arrInx] = col;
                                arrInx++;
                            }

                            // grand total
                            for (var col = 0; col < colArray.length ; col++) {
                                for (var i = iStart; i < iEnd; i++) {
                                    if (grandTotalArr[col] === undefined) {
                                        grandTotalArr[col] = 0.0;
                                    }
                                    if (!isNaN(aaData[aiDisplay[i]][colArray[col]].replace(',', '')) && aaData[aiDisplay[i]][colArray[col]] != "") {
                                        grandTotalArr[col] += parseFloat(aaData[aiDisplay[i]][colArray[col]].replace(',', ''));
                                    }
                                }
                            }

                            var ncell = nRow.getElementsByTagName('th');

                            for (var col = 0; col < colArray.length; col++) {
                                ncell[colArray[col]].innerHTML = addCommas(grandTotalArr[col].toFixed(2)) + '<br/>(' + addCommas(subTotalArr[col].toFixed(2)) + ')';
                            }

                        },
                        "bDestroy": true
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                    
                    $("#lnkExcel").attr('href', response.split('$')[1]);
                    $('#divReport').show();
                    if (response.split('$')[1] != "") {
                        $('#dvTablePrint').show();
                    }

                    HideModalPopup("dvloading");
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Report', 'No Claim details found.');
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



function fnExpensePrint(userCode, claimCode, DateFrom, DateTo, statusName) {

    var dateFrom = new Array();
    var dateTo = new Array();

    dateFrom = DateFrom.split('/');
    dateTo = DateTo.split('/');
    DateFrom = dateFrom[2] + '-' + dateFrom[1] + '-' + dateFrom[0];
    DateTo = dateTo[2] + '-' + dateTo[1] + '-' + dateTo[0];

    $.ajax({
        type: 'POST',
        data: 'userCode=' + userCode + '&claimCode=' + claimCode + '&dateFrom=' + DateFrom + '&dateTo=' + DateTo + "&claimStatusName=" + statusName,
        url: '../HiDoctor_Reports/Reports/GetExpenseClaimForPrint',
        success: function (response) {

            if (response != false || response != undefined) {
                $("#div").append(response.split('$')[0]);
                $("#divSumPrint").html(response.split('$')[1]);
                var totalExp = parseFloat(response.split('$')[2]);
                var expModeCount = parseInt(response.split('$')[3]);
                var docCount = parseInt(response.split('$')[4]);
                var blobUrl = response.split('$')[5];
                var totalDistances = response.split('$')[6];

                $('#dvPrintTotal').html("Total Expense : " + totalExp.toFixed(2));

                $('#tblExpenseAnalysis').dataTable({
                    "sPaginationType": "full_numbers",
                    "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                        var subTotalArr = new Array();
                        var grandTotalArr = new Array();
                        var colArray = new Array();

                        // 12 static column 
                        // expense will start from 13 or 17 (if doc count 4)

                        var arrInx = 0;
                        var startIdx = 14 + (4 - docCount);
                        var endIdx = 14 + (4 - docCount) + (expModeCount * 3);
                        var skipFrst = 1;
                        var docTotalStrt = startIdx - (4 - docCount);
                        var discount = 13
                        //for dynamic Distances count total


                        for (var col = docTotalStrt - 1; col < startIdx ; col++) {
                            for (var i = 0; i < aaData.length; i++) {
                                if (subTotalArr[arrInx] === undefined) {
                                    subTotalArr[arrInx] = 0.0;
                                }
                                if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                    subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                }
                            }
                            colArray[arrInx] = col;
                            arrInx++;
                        }


                        // for dynamic doctor count total
                        for (var col = docTotalStrt; col < startIdx ; col++) {
                            for (var i = 0; i < aaData.length; i++) {
                                if (subTotalArr[arrInx] === undefined) {
                                    subTotalArr[arrInx] = 0.0;
                                }
                                if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                    subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                }
                            }
                            colArray[arrInx] = col;
                            arrInx++;
                        }

                        // for dynamic Expense type expenses
                        for (var col = startIdx; col < endIdx ; col++) {
                            if (skipFrst == 3) {
                                for (var i = 0; i < aaData.length; i++) {
                                    if (subTotalArr[arrInx] === undefined) {
                                        subTotalArr[arrInx] = 0.0;
                                    }
                                    if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                        subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                    }
                                }
                                colArray[arrInx] = col;
                                arrInx++;
                                skipFrst = 0;
                            }
                            skipFrst++;
                        }

                        //Total Expense
                        for (var i = 0; i < aaData.length; i++) {
                            if (subTotalArr[arrInx] === undefined) {
                                subTotalArr[arrInx] = 0.0;
                            }
                            if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                            }
                        }
                        colArray[arrInx] = col;

                        // grand total
                        for (var col = 0; col < colArray.length ; col++) {
                            for (var i = iStart; i < iEnd; i++) {
                                if (grandTotalArr[col] === undefined) {
                                    grandTotalArr[col] = 0.0;
                                }
                                if (!isNaN(aaData[aiDisplay[i]][colArray[col]].replace(',', '')) && aaData[aiDisplay[i]][colArray[col]] != "") {
                                    grandTotalArr[col] += parseFloat(aaData[aiDisplay[i]][colArray[col]].replace(',', ''));
                                }
                            }
                        }

                        var ncell = nRow.getElementsByTagName('th');

                        for (var col = 0; col < colArray.length; col++) {
                            ncell[colArray[col]].innerHTML = addCommas(grandTotalArr[col].toFixed(2)) + '<br/>(' + addCommas(subTotalArr[col].toFixed(2)) + ')';
                        }

                    },
                    "bDestroy": true,
                    "sDom": 'T<"clear">lfrtip',
                    "bSort": false,
                    "bSearchable": false,
                    "bFilter": false
                }).dataTable();


                fninializePrint("divSumPrint", "ifrmPrint", "div");
                fnPrint("divSumPrint", "ifrmPrint");
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fninializePrint(divId, iFrameId, mainDiv) {

    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

function fnShowClaimDetails(id) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetExpenseClaimDetailsPopUp',
        data: 'claimCode=' + id.split('_')[0] + '&userCode=' + id.split('_')[1] + '&entity=MAIN',
        success: function (response) {
            
            var jsReport = eval('(' + response.split('$')[0] + ')');
            var content = "", tblCont = "", divisionName ="";
            if (!(jsReport.Tables === undefined) && jsReport.Tables.length > 0 && jsReport.Tables[0].Rows.length > 0) {

                content = "<div style='max-height:490px;' id='dvECMain'>";

                content += "<span style='font-weight: bold;font-size: initial;'>Day-wise Summary</span>";
                content += "<table width='100%' class='data display dataTable box'>";
                content += "<tr>";
                content += "<td style='font-weight:bold;'>User Name:</td><td>" + jsReport.Tables[0].Rows[0]["User_Name"] + "</td>";
                content += "<td style='font-weight:bold;'>Employee Name:</td><td>" + jsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>";
                content += "<td style='font-weight:bold;'>Region Name:</td><td>" + jsReport.Tables[0].Rows[0]["Region_Name"] + "</td>";
                content += "</tr>";

                content += "<tr>";
                content += "<td style='font-weight:bold;'>Employee Number</td><td>" + jsReport.Tables[0].Rows[0]["Employee_Number"] + "</td>";
                content += "<td style='font-weight:bold;'>Designation</td><td>" + jsReport.Tables[0].Rows[0]["Designation"] + "</td>";
                if (jsReport.Tables[1].Rows.length > 0) {

                    for (var j = 0; j < jsReport.Tables[1].Rows.length ; j++) {
                        divisionName += jsReport.Tables[1].Rows[j]["Division_Name"] + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }

                    content += "<td style='font-weight:bold;'>Division:</td><td>" + divisionName + "</td>";
                }
                else {
                    content += "<td style='font-weight:bold;'>Division:</td><td>N/A</td>";
                }

                //content += "<td style='font-weight:bold;'>Reporting Manager :</td><td>" + jsReport.Tables[0].Rows[0]["Manager_Name"] + " (" + jsReport.Tables[0].Rows[0]["Manager_Id"] + ")</td>";

                content += "</tr>";

                content += "<tr>";
                // content += "<td style='font-weight:bold;'>PAN:</td><td>" + ((jsReport.Tables[0].Rows[0]["PAN_Number"] == "") ? "N/A" : jsReport.Tables[0].Rows[0]["PAN_Number"]) + "</td>";
                content += "<td style='font-weight:bold;'>PF No:</td><td>" + ((jsReport.Tables[0].Rows[0]["PF_Number"] == "") ? "N/A" : jsReport.Tables[0].Rows[0]["PF_Number"]) + "</td>";
                content += "<td style='font-weight:bold;'>Bank Acc No:</td><td>" + ((jsReport.Tables[0].Rows[0]["Acc_No"] == "") ? "N/A" : jsReport.Tables[0].Rows[0]["Acc_No"]) + "</td>";
                content += "<td style='font-weight:bold;'>PAN:</td><td>" + ((jsReport.Tables[0].Rows[0]["PAN_Number"] == "") ? "N/A" : jsReport.Tables[0].Rows[0]["PAN_Number"]) + "</td>"
                content += "</tr>";
                content += "<tr>";
                content += "<td style='font-weight:bold;'>Employee Mobile No</td><td>" + ((jsReport.Tables[0].Rows[0]["Mobile"] == "") ? "N/A" : jsReport.Tables[0].Rows[0]["Mobile"]) + "</td>";
                content += "<td></td><td></td>";
                content += "<td></td><td></td>";
                content += "</tr>";

                content += "<tr>";
                content += "<td style='font-weight:bold;'>Claim Request No:</td><td>" + id.split('_')[0] + "</td>";
                content += "<td style='font-weight:bold;'>DCR Submitted Period:</td><td>" + jsReport.Tables[0].Rows[0]["Date_From"] + " to " + jsReport.Tables[0].Rows[0]["Date_To"] + "</td>";
                content += "<td style='font-weight:bold;'>Request Submitted Date:</td><td>" + jsReport.Tables[0].Rows[0]["Entered_DateTime"] + "</td>";
                content += "</tr>";

                content += "<tr>";
                content += "<td style='font-weight:bold;'>Other Deduction:</td><td>" + jsReport.Tables[0].Rows[0]["Other_Deduction"] + "</td>";
                content += "<td></td><td></td>";
                content += "<td></td><td></td>";
                content += "</tr>";

                content += "</table>";
                content += "<a title='Excel Export' href='" + response.split('$')[1] + "' style='float: right;'><img src='../Content/DataTable/media/images/xls.png' style='border: 1px solid #f0f0f0; height: 30px; width: 30px; cursor: pointer;' /></a>";
                content += "<div id='dvPrintDayWiseSummary' onclick='fnPrint(\"divDaywise\",\"ifrmDaywise\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center; border: 1px solid #f0f0f0; height: 30px; width: 30px; cursor: pointer; float: right;'></div>";
                content += "<table cellspacing='0' cellpadding='0' width='100%'  id='tblNonDaily' class='data display dataTable box'>";
                content += "<thead>";
                content += "<tr><th>DCR Date</th>";
                content += "<th>Category</th>";
                content += "<th>Claimed(Rs.)</th>";
                content += "<th>Deduction(Rs.)</th>";
                content += "<th>Approved(Rs.)</th>";

                content += "</tr>";
                content += "</thead><tbody>";

                for (var j = 0; j < jsReport.Tables[2].Rows.length; j++) {
                    content += "<tr>";
                    content += "<td>" + jsReport.Tables[2].Rows[j]["DCR_Actual_Date"] + "</td>";
                    content += "<td>" + ((jsReport.Tables[2].Rows[j]["Category"] == null) ? "-" : jsReport.Tables[2].Rows[j]["Category"]) + "</td>";
                    content += "<td>" + ((jsReport.Tables[2].Rows[j]["Expense_Amount"] == null) ? "-" : jsReport.Tables[2].Rows[j]["Expense_Amount"]) + "</td>";
                    content += "<td>" + ((jsReport.Tables[2].Rows[j]["Deduction_Amount"] == null) ? "-" : jsReport.Tables[2].Rows[j]["Deduction_Amount"].toFixed(2)) + "</td>";
                    content += "<td>" + ((jsReport.Tables[2].Rows[j]["Approved_Amount"] == null) ? "-" : jsReport.Tables[2].Rows[j]["Approved_Amount"]) + "</td>";
                    content += "</tr>";
                }
                content += "</tbody></table>";
                content += "<input type='button' value='Bill Wise Info..' onclick='fnExpenseClaimBillWiseDetail(\"" + id.split('_')[0] + "_" + jsReport.Tables[0].Rows[0]["User_Code"] + "\")' />";
                content += "<div id='toggleBill' style='display:none;'><a id='aToggleBill' style='cursor:pointer;' onclick='fnToggleBillWiseReport()'>Hide</a></div>";
                content += "</div>";

                //$("#dvDailyBlockM").html(tblCont);
                $("#dvNonDailyBlockM").html(content);
                $("#divDaywise").html(content);
                //$("#dvNonDailyBlockM").append('<input type="button" value="Bill Wise Info.." />');
                $('#tblNonDaily').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true
                });
            }
            // fninializePrint("divDaywiseSummary", "ifrmDaywiseSummary", "dvNonDailyBlockM");
            if ($("#dvNonDailyBlockM").html() != "") {
                ShowModalPopup('dvLoadingExpense');
            }
            else {
                fnMsgAlert('info', 'Information', 'No Data is found.');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });
}

function fnToggleBillWiseReport() {
    if ($("#aToggleBill").html() == "Hide") {
        $("#tblBillWise_wrapper").css('display', 'none');
        $("#lnkBillWiseExcel").css('display', 'none');
        $("#aToggleBill").html("Show");
    }
    else {
        $("#tblBillWise_wrapper").css('display', '');
        $("#lnkBillWiseExcel").css('display', '');
        $("#aToggleBill").html("Hide");
    }
}

function fnExpenseClaimBillWiseDetail(id) {

    $("#tblBillWise").html("");
    $("#tblBillWise_info").html("");

    if ($("#tblBillWise").html() == null || $("#tblBillWise").html() == "") {
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetExpenseClaimDetailsPopUpBillWise',
            data: 'claimCode=' + id.split('_')[0] + '&userCode=' + id.split('_')[1] + '&entity=BILL',
            success: function (response) {
                if (response != "") {
                    $("#dvECMain").append("<div id='dvPrintSummary' onclick='fnPrint(\"divDaywiseSummary\",\"ifrmDaywiseSummary\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center; border: 1px solid #f0f0f0; height: 30px; width: 30px; cursor: pointer; float: right;'></div><a id='lnkBillWiseExcel' title='Excel Export' href=\"" + response.split('$')[1] + "\"  style='float: right;'><img src='../Content/DataTable/media/images/xls.png' style='border: 1px solid #f0f0f0; height: 30px; width: 30px; cursor: pointer;float:right;' /></a>");
                    //$("#dvECMain").append("<div id='dvPrintSummary' onclick='fnPrint(\"" + divDaywiseSummary + "\",\"" + ifrmDaywiseSummary + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center; border: 1px solid #f0f0f0; height: 30px; width: 30px; cursor: pointer; float: right;'></div>");
                    $("#dvECMain").append(response.split('$')[0]);
                    $("#divDaywiseSummary").append(response.split('$')[0]);
                    $(".expRem").each(function () {
                        if ($(this).html().length > 30) {
                            $(this).html($(this).html().substring(0, 30) + '...');
                        }
                    })

                    $("#toggleBill").css('display', '');
                    $('#tblBillWise').dataTable({
                        "sPaginationType": "full_numbers"
                        , "bDestroy": true
                    }).rowGrouping({
                        iGroupingColumnIndex: 1,
                        sGroupBy: "name",
                        bExpandableGrouping: true,
                        bHideGroupingColumn: false
                    });
                    $(".TableTools_clipboard").css('display', 'none');
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
            }
        });
    }
}




function fnValidateExpenseClaimReport(reportName) {
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', reportName, 'Please enter Start date.');
        $("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', reportName, 'Please enter End date.');
        $("#txtToDate").focus();
        HideModalPopup("dvloading");
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "Start Date"))) {
        HideModalPopup("dvloading");
        return false;
    }
    if (!(fnValidateDateFormate($("#txtToDate"), "End Date"))) {
        HideModalPopup("dvloading");
        return false;
    }


    var fromDate = $("#txtFromDate").val().split('/')[2] + '/' + $("#txtFromDate").val().split('/')[1] + '/' + $("#txtFromDate").val().split('/')[0];
    var toDate = $("#txtToDate").val().split('/')[2] + '/' + $("#txtToDate").val().split('/')[1] + '/' + $("#txtToDate").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (endDate != "") {
        if (startDate > endDate) {
            fnMsgAlert('info', reportName, 'End date can not be less than start date.');
            HideModalPopup("dvloading");
            $("#txtToDate").val("");
            return false;
        }
    }
    if ($(":checkbox[name=claimStatusAll]:checked").length == 0 && $(":checkbox[name=claimStatus]:checked").length == 0) {
        fnMsgAlert('info', reportName, 'Please select Claim status.');
        HideModalPopup("dvloading");
        return false;
    }
    return true;
}

function fnExpenseClaimExcelExport(id) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetExpenseClaimDetailsExcel',
        data: 'claimCode=' + id.split('_')[0] + '&userCode=' + id.split('_')[1],
        success: function (response) {
            var jsReport = eval('(' + response + ')');
            var content = "";
            if (!(jsReport.Tables === undefined) && jsReport.Tables.length > 0 && jsReport.Tables[0].Rows.length > 0) {

                var html = "<table border='1'>";
                html += "<tr>";
                html += "<td><b>User Name : </b>" + jsReport.Tables[0].Rows[0]["User_Name"] + "</td>";
                html += "<td><b>Employee Name : </b>" + jsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>";
                html += "<td><b>Territory Name : </b>" + jsReport.Tables[0].Rows[0]["Region_Name"] + "</td>";
                if (jsReport.Tables[1].Rows.length > 0) {
                    html += "<td><b>Division : </b>" + jsReport.Tables[1].Rows[0]["Division_Name"] + "</td>";
                }
                else {
                    html += "<td><b>Division : </b></td>";
                }

                html += "</tr>";

                html += "<tr>";
                html += "<td><b>Reporting Manager : </b>" + jsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>";
                html += "<td><b>Manager Id : </b>" + jsReport.Tables[0].Rows[0]["Manager_Id"] + "</td>";
                html += "<td></td>";
                html += "<td></td>";
                html += "</tr>";

                html += "<tr><td></td><td></td><td></td><td></td></tr>";

                html += "<tr>";
                html += "<td><b>Claim Request No: </b>" + id.split('_')[0] + "</td>";
                html += "<td><b>Claim Period: </b>" + jsReport.Tables[0].Rows[0]["Date_From"] + " to " + jsReport.Tables[0].Rows[0]["Date_To"] + "</td>";
                html += "<td><b>Request Date: </b>" + jsReport.Tables[0].Rows[0]["Entered_DateTime"] + "</td>";
                html += "<td></td>";
                html += "</tr>";
                html += "<tr><td></td><td></td><td></td><td></td></tr>";

                html += "<tr>";
                html += "<th >DCR Date</th>";
                for (var l = 0; l < jsReport.Tables[3].Rows.length; l++) {
                    html += "<th>" + jsReport.Tables[3].Rows[l]["Expense_Type_Name"] + "</th>";
                }
                html += "<th>Expense Amount</th>";
                html += "<th>Bill Number</th>";
                html += "<th>Category</th>";
                html += "</tr>";

                for (var j = 0; j < jsReport.Tables[2].Rows.length; j++) {
                    html += "<tr>";
                    html += "<td align='left'>" + jsReport.Tables[2].Rows[j]["DCR_Actual_Date"] + "</td>";
                    var tot = 0.0;
                    for (var l = 0; l < jsReport.Tables[3].Rows.length; l++) {
                        var amount = jsReport.Tables[2].Rows[j][jsReport.Tables[3].Rows[l]["Expense_Type_Code"]];
                        html += "<td>" + ((amount == null) ? "" : amount) + "</td>";
                        if (amount != null) {
                            tot += parseFloat(amount);
                        }
                    }
                    html += "<td>" + tot.toFixed(2) + "</td>";
                    var billJson = jsonPath(jsReport, "$.Tables[4].Rows[?(@.DCR_Actual_Date=='" + jsReport.Tables[2].Rows[j]["DCR_Actual_Date"] + "')]");
                    if (billJson != false) {
                        html += "<td>" + billJson[0].Bill_Number + "</td>";
                    }
                    else {
                        html += "<td>-</td>";
                    }
                    html += "<td>" + jsReport.Tables[2].Rows[j]["Category"] + "</td>";
                    html += "</tr>";
                }
                html += "</table>";

                window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });
}

function fnClearExpenseClaimReport() {
    $("#txtFromDate").val('');
    $("#txtToDate").val('');
    $('input:checkbox[name=claimStatus]').each(function () {
        $(this).removeAttr('checked');
    });
    $("input:checkbox[name=claimStatusAll]").attr('checked', 'checked');
}
//****************************** End - Expense Claim Report ***************

//****************************** Start - Expense Claim Alumni Report *******************
function fnExpenseClaimAlumniReport() {
    
    ShowModalPopup("dvloading");
    $("#dvDataTable").empty();
    if (fnValidateExpenseClaimAlumniReport()) {


        var claimStatus = "", userCode = "";
        var startDate = "", endDate = "";
        var claimStatusName = "";
        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        if ($(":checkbox[name=claimStatusAll]:checked").length > 0) {
            claimStatus = $("input:checkbox[name=claimStatusAll]:checked").val();
            claimStatusName = $("input:checkbox[name=claimStatusAll]:checked").attr('name_text');
        }
        else {
            $('input:checkbox[name=claimStatus]').each(function () {
                if ($(this).is(':checked')) { claimStatus += $(this).val() + ","; claimStatusName += $(this).attr('name_text') + ","; }
            });
        }



        //$("input:checkbox[name=selectedUsers]:checked").each(function () {
        //    userCode += $(this).val() + ",";
        //});hdnUserCode

        var userCode = $('#hdnUserCode').val();
        $('#spnPeriodDetail').html(" for the Period of " + $("#txtFromDate").val() + " to " + $("#txtToDate").val());

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ExpenseGroupReport/GetExpenseClaimAlumniReport',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&claimStatus=' + escape(claimStatus) + '&userCodes=' + userCode + '&claimStatusName=' + claimStatusName,
            success: function (response) {
                if (response != "" && response.split('^')[0] != "FAIL") {
                    var tblCont = response.split('$')[0];
                    var expTypeCont = parseInt(response.split('$')[2]);

                    $("#dvDataTable").append(tblCont);

                    $(".expRem").each(function () {
                        if ($(this).html().length > 30) {
                            $(this).html($(this).html().substring(0, 30) + '...');
                        }
                    })
                    //Print
                    var printHeader = "";

                    printHeader = "<table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%'>";
                    printHeader += "<thead>";

                    printHeader += "<tr>";
                    printHeader += "<th style='font-size:18px;' align='left'><b>" + $("#divPageHeader").html() + "</b></th>";
                    printHeader += "</tr>";

                    printHeader += "<tr>";
                    printHeader += "<th align='right'>";
                    printHeader += "<img style='display: inline;' src='" + $("#imgIndexClientLogo").attr('src') + "'>";
                    printHeader += "</th>";
                    printHeader += "</tr>";
                    printHeader += "</thead></table>";

                    $("#dvPrintContent").html(printHeader + tblCont);

                    $('#tblExpenseClaim').dataTable({
                        "sPaginationType": "full_numbers",
                        "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                            var subTotalArr = new Array();
                            var grandTotalArr = new Array();
                            var colArray = new Array();

                            var arrInx = 0;
                            var startIdx = 19;
                            var endIdx = 22 + (expTypeCont * 3);


                            // for dynamic Expense type expenses
                            for (var col = startIdx; col < endIdx ; col++) {
                                for (var i = 0; i < aaData.length; i++) {
                                    if (subTotalArr[arrInx] === undefined) {
                                        subTotalArr[arrInx] = 0.0;
                                    }
                                    if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                        subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                    }
                                }
                                colArray[arrInx] = col;
                                arrInx++;
                            }

                            // grand total
                            for (var col = 0; col < colArray.length ; col++) {
                                for (var i = iStart; i < iEnd; i++) {
                                    if (grandTotalArr[col] === undefined) {
                                        grandTotalArr[col] = 0.0;
                                    }
                                    if (!isNaN(aaData[aiDisplay[i]][colArray[col]].replace(',', '')) && aaData[aiDisplay[i]][colArray[col]] != "") {
                                        grandTotalArr[col] += parseFloat(aaData[aiDisplay[i]][colArray[col]].replace(',', ''));
                                    }
                                }
                            }

                            var ncell = nRow.getElementsByTagName('th');

                            for (var col = 0; col < colArray.length; col++) {
                                ncell[colArray[col]].innerHTML = addCommas(grandTotalArr[col].toFixed(2)) + '<br/>(' + addCommas(subTotalArr[col].toFixed(2)) + ')';
                            }

                        },
                        "bDestroy": true
                    });

                    $("#lnkExcel").attr('href', response.split('$')[1]);
                    $('#dvDataTable').show();
                    if (response.split('$')[1] != "") {
                        $('#dvTablePrint').show();
                    }

                    HideModalPopup("dvloading");
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Alumni Report', 'Error.' + response.split('^')[1]);
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

function fnValidateExpenseClaimAlumniReport() {
    //if ($(":checkbox[name=selectedUsers]:checked").length == 0) {
    //    fnMsgAlert('info', 'Expense Claim Alumni Report', 'Please select any User.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Expense Claim Alumni Report', 'Please enter Start date.');
        $("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Expense Claim Alumni Report', 'Please enter End date.');
        $("#txtToDate").focus();
        HideModalPopup("dvloading");
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "Start Date"))) {
        HideModalPopup("dvloading");
        return false;
    }
    if (!(fnValidateDateFormate($("#txtToDate"), "End Date"))) {
        HideModalPopup("dvloading");
        return false;
    }

    var fromDate = $("#txtFromDate").val().split('/')[2] + '/' + $("#txtFromDate").val().split('/')[1] + '/' + $("#txtFromDate").val().split('/')[0];
    var toDate = $("#txtToDate").val().split('/')[2] + '/' + $("#txtToDate").val().split('/')[1] + '/' + $("#txtToDate").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (endDate != "") {
        if (startDate > endDate) {
            fnMsgAlert('info', 'Expense Claim Alumni Report', 'End date can not be less than start date.');
            HideModalPopup("dvloading");
            $("#txtToDate").val("");
            return false;
        }
    }
    if ($(":checkbox[name=claimStatusAll]:checked").length == 0 && $(":checkbox[name=claimStatus]:checked").length == 0) {
        fnMsgAlert('info', 'Expense Claim Alumni Report', 'Please select Claim status.');
        HideModalPopup("dvloading");
        return false;
    }
    return true;
}

function fnCancelExpenseClaimAlumniReport() {
    $("#txtFromDate").val('');
    $("#txtToDate").val('');
    $('input:checkbox[name=claimStatus]').each(function () {
        $(this).removeAttr('checked');
    });
    $("input:checkbox[name=claimStatusAll]").attr('checked', 'checked');
    $("input:checkbox[name=selectedUsers]:checked").each(function () {
        $(this).removeAttr('checked');
    });
    $(".dvDisableUser").removeClass('selectNode');
}
//****************************** End - Expense Claim Alumni Report *******************



//****************************** Start - Expense Analysis- Alumni *********************

function fnBindDisabledUserTree(id) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDisabledUsers',
        data: 'companyCode=1',
        success: function (response) {
            var jsUser = eval('(' + response + ')');
            var content = "";
            if (!(jsUser.Tables === undefined) && jsUser.Tables.length > 0 && jsUser.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsUser.Tables[0].Rows.length; i++) {
                    content += "<div class='dvDisableUser' onclick='fnDisabledUserTreeClick(\"" + jsUser.Tables[0].Rows[i]["User_Code"] + "\");$(this).addClass(\"selectNode\");' >" + jsUser.Tables[0].Rows[i]["User_Name"] + "</div>";
                }
                $("#disabledUserTree").html(content);
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });

}

function fnBindDisabledUserTreeNew(id) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDisabledUsers_New',
        data: 'companyCode=1',
        success: function (response) {
            debugger;
            var jsUser = eval('(' + response + ')');
            var content = "";
            if (!(jsUser.Tables === undefined) && jsUser.Tables.length > 0 && jsUser.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsUser.Tables[0].Rows.length; i++) {
                    content += "<div class='dvDisableUser' onclick='fnDisabledUserTreeClick(\"" + jsUser.Tables[0].Rows[i]["User_Code"] + "\");$(this).addClass(\"selectNode\");' >" + jsUser.Tables[0].Rows[i]["Employee_Name"] + "</div>";
                }
                $("#disabledUserTree").html(content);
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });

}


function fnAluminiSearchUsers() {
    debugger;
    fnGetalumniUsersByUserName($('#txtaluminiSearchNode').val(), "dvUserTree", "dvFilteredNode");
}

function fnGetalumniUsersByUserName(userName, treeId, filterId) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetselectedDisabledUsers',
        data: 'userName=' + userName,
        success: function (response) {
            var jsUser = eval('(' + response + ')');

            var content = "";
            if (!(jsUser.Tables === undefined) && jsUser.Tables.length > 0 && jsUser.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsUser.Tables[0].Rows.length; i++) {
                    content += "<div class='dvDisableUser' onclick='fnDisabledUserTreeClick(\"" + jsUser.Tables[0].Rows[i]["User_Code"] + "\");$(this).addClass(\"selectNode\");' >" + jsUser.Tables[0].Rows[i]["User_Name"] + "</div>";
                }
                
                $("#disabledUserTree").html(content);

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });
}

function fnAluminiSearchUsersNew() {
    debugger;
    fnGetalumniUsersByUserNameNew($('#txtaluminiSearchNode').val(), "dvUserTree", "dvFilteredNode");
}

function fnGetalumniUsersByUserNameNew(EmployeeName, treeId, filterId) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetselectedDisabledUsers_New',
        data: 'EmployeeName=' + EmployeeName,
        success: function (response) {
            debugger;
            var jsUser = eval('(' + response + ')');

            var content = "";
            if (!(jsUser.Tables === undefined) && jsUser.Tables.length > 0 && jsUser.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsUser.Tables[0].Rows.length; i++) {
                    content += "<div class='dvDisableUser' onclick='fnDisabledUserTreeClick(\"" + jsUser.Tables[0].Rows[i]["User_Code"] + "\");$(this).addClass(\"selectNode\");' >" + jsUser.Tables[0].Rows[i]["Employee_Name"] + "</div>";
                }

                $("#disabledUserTree").html(content);

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });
}


//****************************** End - Expense Analysis- Alumni ***********************

//*************** POP UP

function fnShowExpenseGroupDetails(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/Reports/GetExpenseGroupDetails',
        data: "groupID=" + id,
        success: function (jsPrefillData) {
            if (jsPrefillData != false && jsPrefillData != "") {
                var prefill = eval('(' + jsPrefillData + ')');
                var prefillD = prefill.Tables[0].Rows;
                var prefillND = prefill.Tables[1].Rows;
                var category = prefill.Tables[2].Rows;

                fnDailyTable(prefillD, category);
                fnNonDailyTable(prefillND, category);
                if (($("#dvDailyBlockM").html() != "") || ($("#dvNonDailyBlockM").html() != "")) {
                    ShowModalPopup('dvLoadingExpense');
                }
                else {
                    fnMsgAlert('info', 'Information', 'No Data is mapped for this Expense group.');
                }
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });

}

function fnDailyTable(option, category) {
    var content = "";
    if (option != false && option.length > 0) {
        content = "<table cellspacing='0' cellpadding='0' width='100%'  id='tblDaily' class='data display dataTable box'>";
        content += "<thead>";
        content += "<tr><th >ExpenseType</th>";
        content += "<th >Eligibility Base</th>";
        content += "<th >Travel Distance Edit</th>";
        content += "<th >Validation on Eligibility</th>";
        content += "<th>DCR Prefill</th>";
        content += "<th >Effective From</th>";
        content += "<th >Effective To</th>";
        content += "<th colspan='3'>Category</th>";
        content += "</tr>";
        content += "</thead><tbody>";

        for (var i = 0; i < option.length; i++) {
            content += "<tr >";
            content += "<td rowspan='" + (category.length + 1) + "'>" + option[i].Expense_Type_Name + "</td>";
            content += "<td rowspan='" + (category.length + 1) + "'>" + option[i].SFC_Type + "</td>";

            //Distance Edit
            if (option[i].SFC_Type == "E") {
                content += "<td rowspan='" + (category.length + 1) + "'></td>";
            }
            else {
                if (option[i].Distance_Edit != null && option[i].Distance_Edit == "F") {
                    content += "<td rowspan='" + (category.length + 1) + "'>Flexi</td>";
                }
                else { content += "<td rowspan='" + (category.length + 1) + "'>Rigid</td>"; }
            }

            //Validation on eligibility
            if (option[i].SFC_Type == "E") {
                if (option[i].Is_Validation_On_Eligibility != null && option[i].Is_Validation_On_Eligibility == "Y") {
                    content += "<td rowspan='" + (category.length + 1) + "'>Yes</td>";
                }
                else { content += "<td rowspan='" + (category.length + 1) + "'>No</td>"; }
            }
            else {
                content += "<td rowspan='" + (category.length + 1) + "'></td>";
            }

            //Is Prefill
            if (option[i].Is_Prefill != null) {
                if (option[i].Is_Prefill == "R") {
                    content += "<td rowspan='" + (category.length + 1) + "'>Rigid</td>";
                }
                else if (option[i].Is_Prefill == "F") { content += "<td rowspan='" + (category.length + 1) + "'>Flexi</td>"; }
                else { content += "<td rowspan='" + (category.length + 1) + "'>No Prefill</td>"; }
            }
            else { content += "<td rowspan='" + (category.length + 1) + "'></td>"; }


            //From date
            if (option[i].Effective_From != null) {
                content += "<td rowspan='" + (category.length + 1) + "'>" + option[i].Effective_From + "</td>";
            }
            else { content += "<td rowspan='" + (category.length + 1) + "'></td>"; }

            //To date
            if (option[i].Effective_To != null && option[i].Effective_To != '31/12/9999') {
                content += "<td rowspan='" + (category.length + 1) + "'>" + option[i].Effective_To + "</td>";
            }
            else { content += "<td rowspan='" + (category.length + 1) + "'></td>"; }

            //Category
            if (option[i].SFC_Type == "E") {
                content += "<td><b>Category</b><td><td colspan='2'><b>Eligibility Amount</b></td></tr>";
                for (var j = 0; j < category.length; j++) {
                    if (option[i][category[j].Expense_Entity_Code] != null) {
                        content += "<tr><td>" + category[j].Expense_Entity_Name + "</td><td colspan='2'>" + option[i][category[j].Expense_Entity_Code] + "</td></tr>";
                    }
                    else {
                        content += "<tr><td></td><td colspan='2'></td></tr>";
                    }
                }
            }
            else {
                content += "<td><b>Category</b></td><td><b>Applicable?</b></td><td><b>Sum Distance</b></td></tr>";
                for (var j = 0; j < category.length; j++) {
                    if (option[i][category[j].Expense_Entity_Code] == null) {
                        content += "<tr><td>" + category[j].Expense_Entity_Name + "</td><td>No</td><td>-</td></tr>";
                    }
                    else {
                        content += "<tr><td>" + category[j].Expense_Entity_Name + "</td><td>Yes</td>";
                        if (option[i][category[j].Expense_Entity_Code].split('_')[1] === undefined) {
                            content += "<td>-</td></tr>";
                        }
                        else {
                            if (option[i][category[j].Expense_Entity_Code].split('_')[1] == 'Y') {
                                content += "<td>Yes</td></tr>";
                            }
                            else {
                                content += "<td>No</td></tr>";
                            }
                        }
                    }
                }
            }
        }
        content += "</tbody></table>";
    }
    $("#dvDailyBlockM").html(content);
}

function fnNonDailyTable(option, category) {
    debugger;
    var content = "";
    if (option != false && option.length > 0) {
        content = "<table cellspacing='0' cellpadding='0' width='50%'  id='tblNonDaily' class='data display dataTable box'>";
        content += "<thead>";
        content += "<tr><th>ExpenseType</th>";
        content += "<th>Expense Mode</th>";
        content += "<th>Can Split Amount</th>";
        content += "<th>Validation on Eligibility</th>";
        content += "<th>Amount</th>";
        content += "<th>Effective From</th>";
        content += "<th>Effective To</th>";
        content += "<th>Mandate remarks</th>";
        content += "</tr>";
        content += "</thead><tbody>";

        for (var i = 0; i < option.length; i++) {
            content += "<tr>";
            content += "<td>" + option[i].Expense_Type_Name + "</td>";
            content += "<td>" + option[i].Expense_Mode + "</td>";

            //CanSplit
            if (option[i].Can_Split_Amount != null && option[i].Can_Split_Amount == "Y") {
                content += "<td>Yes</td>";
            }
            else { content += "<td>No</td>"; }

            //Validation  on eligibility
            if (option[i].Is_Validation_On_Eligibility != null && option[i].Is_Validation_On_Eligibility == "Y") {
                content += "<td>Yes</td>";
            }
            else { content += "<td>No</td>"; }

            //Amount
            if (option[i].Eligibility_Amount != null) {
                content += "<td>" + option[i].Eligibility_Amount + "</td>";
            }
            else { content += "<td></td>"; }

            //From date
            if (option[i].Effective_From != null) {
                content += "<td>" + option[i].Effective_From + "</td>";
            }
            else { content += "<td></td>"; }

            //To date
            if (option[i].Effective_To != null && option[i].Effective_To != '31/12/9999') {
                content += "<td>" + option[i].Effective_To + "</td>";
            }
            else { content += "<td></td>"; }

            // Mandate Remarks Mandatory 
            if (option[i].Mandate_Remarks != null && option[i].Mandate_Remarks == "Y") {
                content += "<td>Yes</td>";
            }
            else {
                content += "<td>No</td>";
            }

            content += "</tr>";
        }
        content += "</tbody></table>";
    }
    $("#dvNonDailyBlockM").html(content);
}

//*********************** END POP UP


// ************************ Start -  Expense Claim deduction Report ***************

function fnExpenseClaimDeductionReport() {
    ShowModalPopup("dvloading");
    $("#dvDataTable").empty();
    if (fnValidateExpenseClaimReport("Expense Claim Deduction Report")) {

        var claimStatus = "", claimStatusName = "";
        var startDate = "", endDate = "", isExcel = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        if ($(":checkbox[name=claimStatusAll]:checked").length > 0) {
            claimStatus = $("input:checkbox[name=claimStatusAll]:checked").val();
            claimStatusName = $("input:checkbox[name=claimStatusAll]:checked").attr('sn');

        }
        else {
            $('input:checkbox[name=claimStatus]').each(function () {
                if ($(this).is(':checked')) {
                    claimStatus += $(this).val() + ",";
                    claimStatusName += $(this).attr('sn') + ",";
                }
            });
        }

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ExpenseGroupReport/GetExpenseClaimDeductionReport',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&claimStatus=' + escape(claimStatus) + '&userCodes=' + $("#hdnUserCode").val() + '&claimStatusName=' + claimStatusName,
            success: function (response) {
                if (response != "" && response.split('^')[0] != "FAIL") {

                    $("#dvDataTable").html('<div class="col-lg-12"><div class="helpIconright"><img src="../Images/HelpIcon.png" onclick="fnHelp(\'EXPENSECLAIMDEDUCTION\',\'GRID\')" /></div><div style="clear:both;"></div></div>');
                    if (isExcel == "Y") {
                        $("#dvDataTable").append("<a href='" + response + "' target='_blank'>Click here to Download.</a>");
                    }
                    else {
                        $("#dvDataTable").append(response);
                        $("#dvPrintContent").append(response);

                        //fninializePrint("dvDataTable", "ifrmPrint", "divReport");
                    }
                    HideModalPopup("dvloading");
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Alumni Report', 'Error.' + response.split('^')[1]);
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

function fnOpenDeductionDetailPopUp(claimCode, userCode) {
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ExpenseGroupReport/GetExpenseClaimDeductionDetailPopUp',
        data: 'claimCode=' + claimCode + '&userCode=' + userCode +'&Company_Code='+Company_Code,
        success: function (response) {
            if (response != "" && response.split('^')[0] != "FAIL") {
                $("#divclaimDeductionDetail").html("<div class='col-lg-12'><div id='dvPrint' onclick='fnPrint(\"dvPrintPopupContent\",\"ifrmPrintPopUp\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;float:left;left:95%;'></div><div style='clear:both;'></div></div><div style='clear:both;'></div>");
                $("#divclaimDeductionDetail").append(response);

                $("#dvPrintPopupContent").html(response);
                // fninializePrint("dvPrintPopupContent", "ifrmPrintPopUp", "dvOverLay");
                $("#dvOverLay").overlay().load();
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Expense Claim Alumni Report', 'Error.' + response.split('^')[1]);
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

// ************************ End -  Expense Claim deduction Report ***************

function fnOpenDeductionDetailPopUpNew(claimCode, userCode) {
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ExpenseGroupReport/GetExpenseClaimDeductionDetailPopUpNew',
        data: 'claimCode=' + claimCode + '&userCode=' + userCode,
        success: function (response) {
            if (response != "" && response.split('^')[0] != "FAIL") {
                $("#divclaimDeductionDetail").html("<div class='col-lg-12'><div id='dvPrint' onclick='fnPrint(\"dvPrintPopupContent\",\"ifrmPrintPopUp\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;float:left;left:95%;'></div><div style='clear:both;'></div></div><div style='clear:both;'></div>");
                $("#divclaimDeductionDetail").append(response);

                $("#dvPrintPopupContent").html(response);
                //fninializePrint("dvPrintPopupContent", "ifrmPrintPopUp", "dvOverLay");
                $("#dvOverLay").overlay().load();
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Expense Claim Alumni Report', 'Error.' + response.split('^')[1]);
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


//******************** *********************//

function fnRemarksByAdmin(remark)
{
    $("#dvMoreInfoHeader").html("Approver Remark");
    $("#dvInfoContent").html(remark);
    ShowModalPopup("dvMoreInfoModal");
}

//******************** *********************//


//function fnExpenseDownloadImage(imageUrl) {
//    debugger;
//    var Urls = imageUrl.split("^");
//    var link = document.createElement('a');

//    link.setAttribute('download', null);
//    link.style.display = 'none';

//    document.body.appendChild(link);

//    for (var i = 0; i < Urls.length; i++) {
//        link.setAttribute('href', Urls[i]);
//        link.click();
//    }

//    document.body.removeChild(link);
//}
function fnExpenseDownloadImage(imageUrl) {
    debugger;
    var Urls = imageUrl.split("^");


    if (Urls.length == 1) {
        var link = document.createElement('a');

        link.setAttribute('download', null);
        link.style.display = 'none';

        document.body.appendChild(link);
        for (var i = 0; i < Urls.length; i++) {
            link.setAttribute('href', Urls[i]);
            link.click();
        }
        document.body.removeChild(link);
    }
    else {
        var ExpAttStr = "";
        ExpAttStr += "<ol>";
        for (var i = 0; i < Urls.length; i++) {
            var lastUrl = Urls[i].substring(Urls[i].lastIndexOf("/") + 1, Urls[i].length);
            ExpAttStr += "<li><a href='" + Urls[i] + "' target='_blank'>" + lastUrl + "</li>";
        }
        ExpAttStr += "</ol>";
        $("#ExpContent").html(ExpAttStr);
        $("#AttModal").modal();
    }

}