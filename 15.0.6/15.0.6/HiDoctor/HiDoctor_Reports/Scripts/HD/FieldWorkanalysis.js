//Created By:SRISUDHAN//
//Date : 28/03/2013//
//Field work analysis//
function fnFieldWorkAnalysis() {

    ShowModalPopup("dvloading");
    var regionCode = $('#hdnmainRegionCode').val();
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Joined Work Analysis Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Joined Work Analysis Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Joined Work Analysis Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetFieldWorkanalysis',
        data: 'regionCode=' + regionCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0],
        success: function (response) {
            //jsData = eval('(' + response + ')');
            var tableContent = response.split('$')[0];
            var type = response.split('$')[1];

            //var accCount = 0, totalFieldCount = 0;
            //var avg = 0.0;
            $("#divmainReport").html('');

            var jsonType = eval(type);

            $("#divmainReport").html(tableContent);
            $("#divmainPrint").html(tableContent);
            if ($.fn.dataTable) {
                $('#tblfieldWorkAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };

            //if (tableContent != "") {
            //    $("#divInput").slideUp();
            //    $("#spnInputToggle").html("Show Input");

            //}

            //jsData = eval('(' + response + ')');
            //var tableContent = "";

            //var accCount = 0, totalFieldCount = 0;
            //var avg = 0.0;
            //$("#divmainReport").html('');

            //if (jsData.Tables[0].Rows.length > 0) {
            //    tableContent = "";
            //    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblfieldWorkAnalysis' >";
            //    tableContent += "<thead>";
            //    tableContent += "<tr style='display: none;' id='tblTrfield'>";
            //    tableContent += "<th align='left' >User Name</th>";
            //    tableContent += "<th align='left' >User Type Name</th>";
            //    tableContent += "<th align='left' >Territory Name</th>";
            //    tableContent += "<th align='left' >Employee Name</th>";
            //    tableContent += "<th align='left' >Division</th>";
            //    tableContent += "<th align='left' >Reporting Manager</th>";
            //    tableContent += "<th align='left' >Reporting HQ</th>";
            //    tableContent += "<th align='left' >% Days worked </th>";
            //    tableContent += "<th align='left' >Joint field work % (Manager only)</th>";
            //    tableContent += "<th align='left' >Call Avg</th>";
            //    tableContent += "<th align='left' >Total Coverage %</th>";

            //    var type = '[{ type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "number-range" },{ type: "number-range" },{ type: "number-range" }';

            //    if (jsData.Tables[0].Rows.length > 0) {
            //        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
            //            type += ', { type: "number-range" }';
            //            tableContent += "<th align='left'>Total " + jsData.Tables[0].Rows[i].Category_Name + " Coverage %</th>";
            //        }
            //    }

            //    tableContent += "<th align='left' >Total Visits %</th>";

            //    type += ', { type: "number-range" }';

            //    if (jsData.Tables[0].Rows.length > 0) {
            //        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
            //            type += ', { type: "number-range" }';
            //            tableContent += "<th align='left'>Total " + jsData.Tables[0].Rows[i].Category_Name + " Visits %</th>";
            //        }
            //    }
            //    tableContent += "<th align='left' >Chemist Call Avg</th>";
            //    tableContent += "<th align='left' >Stockist Call Avg</th>";
            //    tableContent += "<th align='left' >RCPA Coverage %</th>";
            //    tableContent += "<th align='left' >Independent Doctor Coverage %</th>";
            //    type += ', { type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" }]';
            //    tableContent += "</tr>";
            //    tableContent += "<tr>";
            //    tableContent += "<th align='left' >User Name</th>";
            //    tableContent += "<th align='left' >User Type Name</th>";
            //    tableContent += "<th align='left' >Territory Name</th>";
            //    tableContent += "<th align='left' >Employee Name</th>";
            //    tableContent += "<th align='left' >Division</th>";
            //    tableContent += "<th align='left' >Reporting Manager</th>";
            //    tableContent += "<th align='left' >Reporting HQ</th>";
            //    tableContent += "<th align='left' >% Days worked </th>";
            //    tableContent += "<th align='left' >Joint field work % (Manager only)</th>";
            //    tableContent += "<th align='left' >Call Avg</th>";
            //    tableContent += "<th align='left' >Total Coverage %</th>";
            //    var iRow = 11;
            //    if (jsData.Tables[0].Rows.length > 0) {
            //        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
            //            iRow++;
            //            tableContent += "<th align='left'>Total " + jsData.Tables[0].Rows[i].Category_Name + " Coverage %</th>";
            //        }
            //    }
            //    iRow = iRow + 1;
            //    tableContent += "<th align='left' >Total Visits %</th>";
            //    if (jsData.Tables[0].Rows.length > 0) {
            //        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
            //            iRow++;
            //            tableContent += "<th align='left'>Total " + jsData.Tables[0].Rows[i].Category_Name + "  Visits % </th>";
            //        }
            //    }
            //    iRow = iRow + 4;
            //    tableContent += "<th align='left' >Chemist Call Avg</th>";
            //    tableContent += "<th align='left' >Stockist Call Avg</th>";
            //    tableContent += "<th align='left' >RCPA Coverage %</th>";
            //    tableContent += "<th align='left' >Independent Doctor Coverage %</th>";
            //    tableContent += "</tr>";

            //    tableContent += "<tr >";
            //    tableContent += "<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeField()'>Show Filter</span></th>";
            //    tableContent += "</tr>";

            //    tableContent += "</thead>";
            //    tableContent += "<tbody>";

            //    if (jsData.Tables[1].Rows.length > 0) {
            //        for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
            //            accCount = 0;
            //            tableContent += "<tr>";
            //            //User Name
            //            tableContent += "<td align='left'>" + jsData.Tables[1].Rows[i].User_Name + "</td>";
            //            // User Type Name
            //            tableContent += "<td align='left'>" + jsData.Tables[1].Rows[i].User_Type_Name + "</td>";
            //            //Territory Name
            //            tableContent += "<td align='left'>" + jsData.Tables[1].Rows[i].Region_Name + "</td>";
            //            //employee name
            //            tableContent += "<td align='left'>" + jsData.Tables[1].Rows[i].Employee_Name+ "</td>";
            //            //division
            //            if (jsData.Tables[2].Rows.length > 0) {
            //                var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");
            //                divisionName = "";
            //                if (dJsonData != false) {
            //                    for (var j = 0; j < dJsonData.length; j++) {
            //                        divisionName += dJsonData[j].Division_Name + ",";
            //                    }

            //                    if (divisionName != "") {
            //                        divisionName = divisionName.substring(0, divisionName.length - 1);
            //                    }
            //                    tableContent += "<td align='left' >" + divisionName + "</td>";
            //                }
            //                else {
            //                    tableContent += "<td align='left'></td>";
            //                }
            //            }
            //            else {
            //                tableContent += "<td align='left' ></td>";
            //            }
            //            //manager name
            //            tableContent += "<td align='left'>" + jsData.Tables[1].Rows[i].Manager_Name + "</td>";
            //            //manager region name
            //            tableContent += "<td align='left'>" + jsData.Tables[1].Rows[i].Manager_Region_Name + "</td>";
            //            //fieldworkdays

            //            field = 0
            //            if (jsData.Tables[1].Rows.length > 0) {
            //                var dJsonData = jsonPath(jsData, "$.Tables[21].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");
            //                fieldworkdayscount = "";
            //                if (dJsonData != false) {
            //                    for (var u = 0; u < dJsonData.length; u++) {
            //                        fieldworkdayscount += dJsonData[u].Field + "";

            //                    }

            //                }
            //            }

            //            if (jsData.Tables[1].Rows.length > 0) {
            //                var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                fieldworkdays = "";

            //                if (dJsonData != false) {
            //                    for (var j = 0; j < dJsonData.length; j++) {
            //                        fieldworkdays += dJsonData[j].Field_Working_Day + "";
            //                    }

            //                    var avg = parseFloat(fieldworkdayscount) / parseFloat((noOfDays + 1)) * 100
            //                    tableContent += "<td class='td-a' onclick='fnDayanalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + Math.round(avg * 100) / 100 + "</td>";

            //                }
            //                else {
            //                    tableContent += "<td > 0 </td>";
            //                }
            //            }
            //            else {
            //                tableContent += "<td > 0 </td>";
            //            }
            //            ////joinedworkdays

            //            if (jsData.Tables[1].Rows.length > 0) {

            //                var dJsonData = jsonPath(jsData, "$.Tables[5].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                var dJsonunderUserCode = jsonPath(jsData, "$.Tables[5].Rows[?(@.Under_User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                joinedworkdays = "";
            //                if (dJsonunderUserCode != false) {
            //                    if (dJsonData != false) {
            //                        for (var j = 0; j < dJsonData.length; j++) {
            //                            joinedworkdays += dJsonData[j].Days_Joined_Worked + "";                                     
            //                        }
            //                        var avg = parseFloat((joinedworkdays) / parseFloat(fieldworkdayscount)) * 100
            //                        tableContent += "<td class='td-a' onclick='fnjoinedworksanalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + Math.round(avg * 100) / 100 + "</td>";
            //                        //tableContent += "<td class='td-a' onclick='fnjoinedworksanalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + joinedworkdays + "</td>";

            //                    }
            //                    else {
            //                        tableContent += "<td>0 </td>  ";
            //                    }
            //                }
            //                else {
            //                    if (dJsonData != false) {
            //                        for (var j = 0; j < dJsonData.length; j++) {
            //                            joinedworkdays += dJsonData[j].Days_Joined_Worked + "";
            //                        }
            //                        var avg = parseFloat((joinedworkdays) / parseFloat(fieldworkdayscount)) * 100
            //                        // tableContent += "<td class='td-a' onclick='fnjoinedworksanalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + Math.round(avg * 100) / 100 + "</td>";
            //                        //tableContent += "<td class='td-a' onclick='fnjoinedworksanalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + joinedworkdays + "</td>";
            //                        tableContent += "<td>" + Math.round(avg * 100) / 100 + "</td>";
            //                    }
            //                    else {
            //                        tableContent += "<td>0 </td>  ";
            //                    }
            //                }
            //            }
            //            else {
            //                tableContent += "<td> 0</td>  ";
            //            }

            //            //call avg//
            //            if (jsData.Tables[1].Rows.length > 0) {

            //                var dJsonData = jsonPath(jsData, "$.Tables[6].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                Callavg = "";
            //                if (dJsonData != false) {
            //                    for (var j = 0; j < dJsonData.length; j++) {
            //                        Callavg += dJsonData[j].Calls_Made + "";

            //                    }
            //                    tableContent += "<td >" + parseFloat((parseFloat(Callavg) / parseFloat(fieldworkdayscount))).toFixed(2) + "</td>";

            //                }
            //                else {
            //                    tableContent += "<td>0 </td>  ";
            //                }
            //            }
            //            else {
            //                tableContent += "<td> 0</td>  ";
            //            }

            //            //Total Coverage %

            //            if (jsData.Tables[1].Rows.length > 0) {
            //                var dJsonData = jsonPath(jsData, "$.Tables[17].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                var totalJsonData = jsonPath(jsData, "$.Tables[7].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                Doctorlist = "";
            //                Doctorsmet = "";
            //                if (dJsonData != false) {
            //                    for (var j = 0; j < dJsonData.length; j++) {
            //                        Doctorlist += dJsonData[j].Doctor_list + "";

            //                    }
            //                    if (totalJsonData != false) {
            //                        for (var j = 0; j < totalJsonData.length; j++) {
            //                            Doctorsmet += totalJsonData[j].Doctors_Met + "";

            //                        }
            //                        tableContent += "<td align='center' class='td-a' onclick='fnDoctorCalAnalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + parseFloat((parseFloat(Doctorsmet) / parseFloat(Doctorlist)) * 100).toFixed(2) + "</td>";

            //                    }
            //                    else {
            //                        tableContent += "<td align='center'> 0</td>  ";
            //                    }
            //                }
            //                else {
            //                    tableContent += "<td align='center'> 0</td>";
            //                }
            //            }
            //            //  tableContent += "<td align='left'> 0 </td>";
            //            //tableContent += "<td class='td-a' onclick='fnDoctorCalAnalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'> 0 </td>";

            //            //total nc coverage

            //            if (jsData.Tables[1].Rows.length > 0) {
            //                for (var k = 0; k < jsData.Tables[0].Rows.length; k++) {

            //                    var dJsonData = jsonPath(jsData, "$.Tables[9].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "' & @.Category =='" + jsData.Tables[0].Rows[k].Category_Code + "')]");
            //                    var totalJsonData = jsonPath(jsData, "$.Tables[8].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "' & @.Category =='" + jsData.Tables[0].Rows[k].Category_Code + "')]");
            //                    Categorymet = "";
            //                    CategoryCount = "";
            //                    if (dJsonData != false && totalJsonData != false) {
            //                        for (var j = 0; j < dJsonData.length; j++) {
            //                            Categorymet += dJsonData[j].Category_Met;

            //                        }

            //                        for (var j = 0; j < totalJsonData.length; j++) {
            //                            CategoryCount += totalJsonData[j].Category_wise_count;

            //                        }
            //                        tableContent += "<td align='center' >" + parseFloat((parseFloat(Categorymet) / parseFloat(CategoryCount)) * 100).toFixed(2) + "</td>";
            //                    }
            //                    else {
            //                        tableContent += "<td align='center'> 0</td>  ";
            //                    }
            //                }
            //            }

            //            ///////////////////total
            //            actualVisit = 0, totalActualVisit = 0;
            //            doctorCoverage = 0, totalDoctor = 0;
            //            for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
            //                actualVisit = 0, doctorCoverage = 0;
            //                if (jsData.Tables[0].Rows[j].Visit_Count != null && jsData.Tables[18].Rows[j].Visit_Count != "") {
            //                    visitCount = parseInt(jsData.Tables[0].Rows[j].Visit_Count);
            //                }
            //                else {
            //                    visitCount = 0;
            //                }

            //                var dJsonData = jsonPath(jsData, "$.Tables[19].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "' & @.Category=='" + jsData.Tables[0].Rows[j].Category_Code + "')]");
            //                if (dJsonData != false) {
            //                    if (dJsonData.length > 0) {
            //                        actualVisit = (parseInt(dJsonData[0].Count) * visitCount);
            //                        totalActualVisit = totalActualVisit + (parseInt(dJsonData[0].Count) * visitCount);
            //                    }
            //                }

            //                var dJsonData = jsonPath(jsData, "$.Tables[20].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "' & @.Category=='" + jsData.Tables[0].Rows[j].Category_Code + "')]");
            //                if (dJsonData != false) {
            //                    if (dJsonData.length > 0) {
            //                        for (var k = 0; k < dJsonData.length; k++) {
            //                            doctorCoverage = doctorCoverage + parseInt(dJsonData[k].Count);
            //                        }
            //                        totalDoctor = totalDoctor + doctorCoverage;
            //                    }
            //                }

            //                if (actualVisit > 0) {
            //                    avg = (doctorCoverage / actualVisit) * 100;
            //                    //tableContent += "<td>" + Math.round(avg * 100) / 100 + "</td>";
            //                }
            //                else {
            //                    //tableContent += "<td align='center' width='15%'>0</td>";
            //                }
            //            }
            //            avg = 0;
            //            if (totalActualVisit > 0) {
            //                avg = (totalDoctor / totalActualVisit) * 100;
            //                tableContent += "<td class='td-a' onclick='fnDoctorVisitsFrequency(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + Math.round(avg * 100) / 100 + " </td>";
            //                //tableContent += "<td align='center' width='15%'  title='Total No of Drs Visits Met/Total Visits)*100'>" + Math.round(avg * 100) / 100 + "</td>";
            //            }
            //            else {
            //                tableContent += "<td > 0</td>  ";
            //            }


            //            //tolal category visit

            //            actualVisit = 0, totalActualVisit = 0;
            //            doctorCoverage = 0, totalDoctor = 0;
            //            for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
            //                actualVisit = 0, doctorCoverage = 0;
            //                if (jsData.Tables[0].Rows[j].Visit_Count != null && jsData.Tables[0].Rows[j].Visit_Count != "") {
            //                    visitCount = parseInt(jsData.Tables[0].Rows[j].Visit_Count);
            //                }
            //                else {
            //                    visitCount = 0;
            //                }

            //                var dJsonData = jsonPath(jsData, "$.Tables[19].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "' & @.Category=='" + jsData.Tables[0].Rows[j].Category_Code + "')]");
            //                if (dJsonData != false) {
            //                    if (dJsonData.length > 0) {
            //                        actualVisit = (parseInt(dJsonData[0].Count) * visitCount);
            //                        totalActualVisit = totalActualVisit + (parseInt(dJsonData[0].Count) * visitCount);
            //                    }
            //                }

            //                var dJsonData = jsonPath(jsData, "$.Tables[20].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "' & @.Category=='" + jsData.Tables[0].Rows[j].Category_Code + "')]");
            //                if (dJsonData != false) {
            //                    if (dJsonData.length > 0) {
            //                        for (var k = 0; k < dJsonData.length; k++) {
            //                            doctorCoverage = doctorCoverage + parseInt(dJsonData[k].Count);
            //                        }
            //                        totalDoctor = totalDoctor + doctorCoverage;
            //                    }
            //                }

            //                if (actualVisit > 0) {
            //                    avg = (doctorCoverage / actualVisit) * 100;
            //                    tableContent += "<td>" + Math.round(avg * 100) / 100 + "</td>";
            //                }
            //                else {
            //                    tableContent += "<td> 0</td>";
            //                }
            //            }

            //            //chemist avg
            //            if (jsData.Tables[1].Rows.length > 0) {

            //                var dJsonData = jsonPath(jsData, "$.Tables[13].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                Chemistavg = "";
            //                if (dJsonData != false) {
            //                    for (var j = 0; j < dJsonData.length; j++) {
            //                        Chemistavg += dJsonData[j].Chemist_Met + "";

            //                    }

            //                    var chemavg = Chemistavg / fieldworkdayscount
            //                    // tableContent += "<td >" + parseFloat((parseFloat(Chemistavg) / parseFloat(fieldworkdays)) * 100).toFixed(2) + "</td>";
            //                    tableContent += "<td align='center' class='td-a' onclick='FnChemistMetAnalysis(\"" + jsData.Tables[1].Rows[i].User_Code + "\")'>" + parseFloat((parseFloat(Chemistavg) / parseFloat(fieldworkdayscount))).toFixed(2) + " </td>";
            //                }
            //                else {
            //                    tableContent += "<td align='center'> 0</td> ";
            //                }
            //            }
            //            else {
            //                tableContent += "<td align='center'> 0</td>  ";
            //            }
            //            //Stoskiest avg
            //            if (jsData.Tables[1].Rows.length > 0) {

            //                var dJsonData = jsonPath(jsData, "$.Tables[14].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                stockiestavg = "";
            //                if (dJsonData != false) {
            //                    for (var j = 0; j < dJsonData.length; j++) {
            //                        stockiestavg += dJsonData[j].Stockiest_Visit + "";

            //                    }
            //                    tableContent += "<td align='center' class='td-a' onclick='fnStockiest(\"" + jsData.Tables[1].Rows[i].User_Code + "_" + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + "_" + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + "\")' >" + parseFloat((parseFloat(stockiestavg) / parseFloat(fieldworkdayscount))).toFixed(2) + "</td>";
            //                    // tableContent += "<td >" + parseFloat((parseFloat(stockiestavg) / parseFloat(fieldworkdays)) * 100).toFixed(2) + "</td>";

            //                }
            //                else {
            //                    tableContent += "<td align='center'> 0</td>  ";
            //                }
            //            }
            //            else {
            //                tableContent += "<td align='center'> 0</td>";
            //            }
            //            //rcpa avg


            //            if (jsData.Tables[1].Rows.length > 0) {
            //                var dJsonData = jsonPath(jsData, "$.Tables[15].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                var totalJsonData = jsonPath(jsData, "$.Tables[7].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                RcpaDoctor = "";
            //                Doctorsmet = "";
            //                if (dJsonData != false) {
            //                    for (var j = 0; j < dJsonData.length; j++) {
            //                        RcpaDoctor = dJsonData[j].Dcr_Rcpa;

            //                    }
            //                    if (totalJsonData != false) {
            //                        for (var j = 0; j < totalJsonData.length; j++) {
            //                            Doctorsmet = totalJsonData[j].Doctors_Met;

            //                        }
            //                        var avgrcpa = 0;
            //                        if (parseFloat(RcpaDoctor) > 0) {
            //                            avgrcpa = (RcpaDoctor / Doctorsmet) * 100;
            //                        }
            //                        //tableContent += "<td >" + Math.round(avgrcpa * 100) / 100 + "</td>";
            //                        //tableContent += "<td align='center' class='td-a' onclick='fnRcpaDetails(\"" + jsData.Tables[1].Rows[i].User_Code + "_" + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + "_" + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + "\")' >" + Math.round(avgrcpa * 100) / 100 + "</td>";
            //                        tableContent += "<td align='center' class='td-a' onclick='fnRcpaDetails(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + Math.round(avgrcpa * 100) / 100 + " </td>";
            //                    }
            //                    else {
            //                        //tableContent += "<td align='center'> 0</td>  ";
            //                        tableContent += "<td align='center' class='td-a' onclick='fnRcpaDetails(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>0</td>";
            //                    }
            //                }
            //                else {
            //                    tableContent += "<td align='center' class='td-a' onclick='fnRcpaDetails(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>0 </td>";
            //                }
            //            }

            //            //independent doctor//
            //            if (jsData.Tables[1].Rows.length > 0) {
            //                var dJsonData = jsonPath(jsData, "$.Tables[16].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                var totalJsonData = jsonPath(jsData, "$.Tables[7].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
            //                IndependentDoctor = "";
            //                Doctorsmet = "";
            //                if (dJsonData != false) {
            //                    for (var j = 0; j < dJsonData.length; j++) {
            //                        IndependentDoctor += dJsonData[j].Independent_Call + "";

            //                    }
            //                    if (totalJsonData != false) {
            //                        for (var j = 0; j < totalJsonData.length; j++) {
            //                            Doctorsmet += totalJsonData[j].Doctors_Met + "";

            //                        }

            //                        var avgIndepentDoctor = 0;
            //                        if (parseFloat(IndependentDoctor) > 0) {
            //                            avgIndepentDoctor = (IndependentDoctor / Doctorsmet) * 100;
            //                        }

            //                        // tableContent += "<td >" + parseFloat((parseFloat(IndependentDoctor) / parseFloat(Doctorsmet)) * 100).toFixed(2) + "</td>";
            //                        tableContent += "<td align='center' class='td-a' onclick='fnIndependentDoctor(\"" + jsData.Tables[1].Rows[i].User_Code + "_" + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + "_" + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + "\")' >" + Math.round(avgIndepentDoctor * 100) / 100 + "</td>";
            //                    }
            //                    else {
            //                        tableContent += "<td align='center'> 0</td>  ";
            //                    }
            //                }
            //                else {
            //                    tableContent += "<td align='center'> 0</td>  ";
            //                }
            //            }


            //            tableContent += "</tr>";

            //        }
            //    }

            //    tableContent += "</tbody>";
            //    tableContent += "</table>";
            //    var jsonType = eval(type);

            //    $("#divmainReport").html(tableContent);
            //    $("#divmainPrint").html(tableContent);
            //    if ($.fn.dataTable) {
            //        $('#tblfieldWorkAnalysis').dataTable({
            //            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
            //        }).columnFilter({
            //            sPlaceHolder: "head:after",
            //            aoColumns: jsonType
            //        });
            //    };

            //    if (tableContent != "") {
            //        $("#divInput").slideUp();
            //        $("#spnInputToggle").html("Show Input");

            //    }
            //}
            fninializePrint("divmainPrint", "ifrmmainPrint", "divmainReport");
            HideModalPopup('dvloading');
        },
        //error: function () {
        //    fnMsgAlert('info', 'Report', 'Error.');
        //    HideModalPopup("dvloading");
        //}
    });

}


function fnDayanalysis(regionCode) {
    $("#divHeaderSummary").hide();
    $("#divSPECReport").hide();
    $("#divReport").hide();
    $("#divHeader").hide();
    $("#divReportSummary").hide();
    $('#hdnRegionCode').val(regionCode);
    fnDayAnalysisReport()
    HideModalPopup('dvloading');
    $("#divReport").show();
}


function fnjoinedworksanalysis(regionCode) {
    $("#divHeaderSummary").hide();
    $("#divSPECReport").hide();
    $("#divHeader").hide();
    $("#divReport").hide();
    $("#divReportSummary").hide();
    $('#hdnRegionCode').val(regionCode);
    fnJoinedWorkAnalysis()
    $("#divReport").show();
}

function fnDoctorCalAnalysis(regionCode) {
    $("#divHeaderSummary").hide();
    $("#divSPECReport").hide();
    $("#divHeader").hide();
    $("#divReport").hide();
    $("#divReportSummary").hide();
    $('#hdnRegionCode').val(regionCode);
    fnGetDoctorCallAnalysis()
    $("#divReport").show();
}
function fnDoctorVisitsFrequency(regionCode) {
    $("#divHeaderSummary").hide();
    $("#divSPECReport").hide();
    $("#divHeader").hide();
    $("#divReport").hide();
    $("#divReportSummary").hide();
    $('#hdnRegionCode').val(regionCode);
    fnDoctorVisitsFrequencyAnalysis()
    $("#divReport").show();
}

function FnChemistMetAnalysis(UserCode) {
    $("#divHeaderSummary").hide();
    $("#divSPECReport").hide();
    $("#divHeader").hide();
    $("#divReport").hide();
    $("#divReportSummary").hide();
    $('#hdnUserCode').val(UserCode);
    GetChemistmet()
    $("#divReport").show();
}



function fnRcpaDetails(regionCode) {

    $("#divReport").hide();
    $('#hdnRegionCode').val(regionCode);
    $('#dcrStatus').val()
    fnSpeciality()
    $("#divReport").show();
    $("#divReportSummary").show();
}
function fnSpeciality() {
    $("#divSubReport").empty();
    ShowModalPopup("dvloading");
    // if (fnValidateReport("Speciality Wise Analysis Report")) {
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

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
    dcrStatus = '2';

    $.ajax({
        type: 'POST',
        url: '../ReportsLevelTwo/GetSpecialityWiseAnalysis',
        data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&regionCode=' + $("#hdnRegionCode").val(),
        success: function (response) {

            jsData = eval('(' + response + ')');
            var tableContent = "", divisionName = "", tableContenSub = "", tableContentHeader = "", tableContentHeaderSub = "";
            var totalDoctor = 0, masterVisits = 0, doctorVisitCount = 0;
            var iRow = 0;
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
                $("#divHeader").html(tableContent);

                tableContent = "";

                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSpecialityWiseAnalysis' >";
                tableContent += "<thead>";
                // HEADER 


                //TABLE HEADER

                tableContentHeader = "<tr style='display: none;' id='tblTr'>";
                iRow++;
                tableContentHeader += "<th style='text-align:left' >Speciality Name</th>";
                var type = '[{ type: "text" }';
                if (jsData.Tables[3].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {
                        iRow++;
                        tableContentHeader += "<th style='text-align:left'>" + jsData.Tables[3].Rows[i].Category_Name + " </th>";
                        iRow++;
                        tableContentHeaderSub += "<th style='text-align:left'>" + jsData.Tables[3].Rows[i].Category_Name + " </th>";
                        type += ', { type: "number-range" }, { type: "number-range" }';

                    }
                }
                type += ', { type: "number-range" }, { type: "number-range" }';
                iRow++;
                tableContentHeader += "<th style='text-align:left'>Total</th>";

                iRow++;
                tableContentHeaderSub += "<th style='text-align:left'>Total</th>";
                type += ', { type: "number-range" }, { type: "number-range" }';

                tableContentHeader += tableContentHeaderSub;
                iRow++;
                tableContentHeader += "<th style='text-align:left' >Master Visits</th>";
                iRow++;
                tableContentHeader += "<th style='text-align:left' >Actual Visits</th>";
                type += ', { type: "number-range" }, { type: "number-range" }';
                iRow++;
                tableContentHeader += "<th style='text-align:left' >No of Drs Detailing done</th>";
                type += ', { type: "number-range" }';
                for (var j = 0; j < jsData.Tables[7].Rows.length; j++) {
                    iRow++;
                    type += ', { type: "number-range" }';
                    tableContentHeader += "<th style='text-align:left' >No of Drs " + jsData.Tables[7].Rows[j].Product_Type_Name + " given</th>";
                    if (jsData.Tables[7].Rows[j].Product_Type_Name.toUpperCase() == "SAMPLE") {
                        iRow++;
                        tableContentHeader += "<th style='text-align:left' >Total Qty " + jsData.Tables[7].Rows[j].Product_Type_Name + " given</th>";
                        type += ', { type: "number-range" }';
                    }
                }
                iRow++;
                tableContentHeader += "<th style='text-align:left' >No of drs added in Marketing Campaign</th>";
                type += ', { type: "number-range" }';
                iRow++;
                tableContentHeader += "<th style='text-align:left' >RCPA - My Product</th>";
                type += ', { type: "number-range" }';
                iRow++;
                tableContentHeader += "<th style='text-align:left' >RCPA -Competitor Product</th>";
                type += ', { type: "number-range" }';
                iRow++;
                tableContentHeader += "<th style='text-align:left' >% to Competitor</th></tr>";
                type += ', { type: "number-range" }]';

                tableContent += tableContentHeader;


                tableContent += "<tr>";
                tableContent += "<th style='text-align:left' rowspan='2'>Speciality Name</th>";
                tableContent += "<th style='text-align:center' colspan='" + (jsData.Tables[3].Rows.length + 1) + "'>Total Drs in List</th>";
                tableContent += "<th style='text-align:center' colspan='" + (jsData.Tables[3].Rows.length + 1) + "'>Total Drs Met</th>";
                tableContent += "<th style='text-align:left' rowspan='2'>Master Visits</th>";
                tableContent += "<th style='text-align:left' rowspan='2'>Actual Visits</th>";
                tableContent += "<th style='text-align:left' rowspan='2'>No of Drs Detailing done</th>";

                for (var j = 0; j < jsData.Tables[7].Rows.length; j++) {
                    tableContent += "<th style='text-align:left' rowspan='2'>No of Drs " + jsData.Tables[7].Rows[j].Product_Type_Name + " given</th>";
                    if (jsData.Tables[7].Rows[j].Product_Type_Name.toUpperCase() == "SAMPLE") {
                        tableContent += "<th style='text-align:left' rowspan='2'>Total Qty " + jsData.Tables[7].Rows[j].Product_Type_Name + " given</th>";
                    }
                }
                tableContent += "<th style='text-align:left' rowspan='2'>No of drs added in Marketing Campaign</th>";
                tableContent += "<th style='text-align:left' rowspan='2'>RCPA - My Product</th>";
                tableContent += "<th style='text-align:left' rowspan='2'>RCPA -Competitor Product</th>";
                tableContent += "<th style='text-align:left' rowspan='2'>% to Competitor</th></tr>";

                tableContent += "<tr >";
                if (jsData.Tables[3].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {
                        tableContent += "<th style='text-align:left'>" + jsData.Tables[3].Rows[i].Category_Name + " </th>";
                        tableContenSub += "<th style='text-align:left'>" + jsData.Tables[3].Rows[i].Category_Name + " </th>";
                    }
                }
                tableContent += "<th style='text-align:left'>Total</th>";
                tableContenSub += "<th style='text-align:left'>Total</th>";
                tableContent += tableContenSub;
                tableContent += "</tr>";

                tableContent += "<tr >";
                tableContent += "<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";
                tableContent += "</thead><tbody>";
                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {

                    totalDoctor = 0;
                    masterVisits = 0;
                    tableContent += "<tr>";
                    //Speciality Name
                    tableContenSub = "";
                    // tableContent += "<td style='text-align:left'>" + jsData.Tables[2].Rows[i].Speciality_Name + "</td>";
                    tableContent += "<td align='left' width='8%' onclick='fnSpecialityWiseAnalysisView(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "_" + $("#txtFromDate").val() + "_" + $("#txtToDate").val() + "_" + dcrStatus + "_" + jsData.Tables[2].Rows[i].Speciality_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[2].Rows[i].Speciality_Name + "</td>";
                    // Speciality Wise Category visit
                    for (var j = 0; j < jsData.Tables[3].Rows.length; j++) {
                        var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Speciality_Code=='" + jsData.Tables[2].Rows[i].Speciality_Code + "' & @.Category =='" + jsData.Tables[3].Rows[j].Category_Code + "')]");
                        if (dJsonData != false) {
                            if (dJsonData[0].Count != null) {

                                doctorVisitCount = parseInt(jsData.Tables[3].Rows[j].Visit_Count);

                                tableContent += "<td style='text-align:center'>" + dJsonData[0].Count + "</td>";
                                totalDoctor += parseInt(dJsonData[0].Count);

                                masterVisits += parseInt(dJsonData[0].Count) * doctorVisitCount;
                            }
                            else {
                                tableContent += "<td style='text-align:center'>0</td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }
                    }
                    // Speciality Wise Category visit met Total
                    tableContent += "<td style='text-align:center'>" + totalDoctor + "</td>";
                    totalDoctor = 0;
                    for (var j = 0; j < jsData.Tables[3].Rows.length; j++) {
                        var dJsonData = jsonPath(jsData, "$.Tables[5].Rows[?(@.Speciality_Code=='" + jsData.Tables[2].Rows[i].Speciality_Code + "' & @.Category =='" + jsData.Tables[3].Rows[j].Category_Code + "')]");
                        if (dJsonData != false) {
                            if (dJsonData[0].Count != null) {
                                tableContent += "<td style='text-align:center'>" + dJsonData[0].Count + "</td>";
                                totalDoctor += parseInt(dJsonData[0].Count);
                            }
                            else {
                                tableContent += "<td style='text-align:center'>0</td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }
                    }
                    // Speciality Wise Category visit Total
                    tableContent += "<td style='text-align:center'>" + totalDoctor + "</td>";
                    //Master Visits
                    tableContent += "<td style='text-align:center'>" + masterVisits + "</td>";

                    //Actual Visits
                    var dJsonData = jsonPath(jsData, "$.Tables[6].Rows[?(@.Speciality_Code=='" + jsData.Tables[2].Rows[i].Speciality_Code + "')]");
                    if (dJsonData != false) {
                        tableContent += "<td style='text-align:center'>" + dJsonData.length + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center'>0</td>";
                    }
                    var dJsonData = jsonPath(jsData, "$.Tables[8].Rows[?(@.Speciality_Code=='" + jsData.Tables[2].Rows[i].Speciality_Code + "')]");
                    if (dJsonData != false) {
                        tableContent += "<td style='text-align:center'>" + dJsonData.length + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center'>0</td>";
                    }
                    totalQty = 0.0;
                    for (var j = 0; j < jsData.Tables[7].Rows.length; j++) {
                        var dJsonDataD = jsonPath(jsData, "$.Tables[9].Rows[?(@.Speciality_Code=='" + jsData.Tables[2].Rows[i].Speciality_Code + "')]");
                        if (dJsonDataD != false) {
                            tableContent += "<td style='text-align:center'>" + dJsonDataD.length + "</td>";
                            if (dJsonDataD.length > 0) {
                                for (var k = 0; k < dJsonDataD.length; k++) {
                                    totalQty += parseFloat(dJsonDataD[k].COUNT);
                                }
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }
                        if (jsData.Tables[7].Rows[j].Product_Type_Name.toUpperCase() == "SAMPLE") {
                            if (dJsonDataD.length > 0) {
                                for (var k = 0; k < dJsonDataD.length; k++) {
                                    totalQty += parseFloat(dJsonDataD[k].COUNT);
                                }
                            }
                            tableContent += "<td style='text-align:center'>" + totalQty + "</td>";
                        }
                    }
                    tableContent += "<td style='text-align:center'>0</td>";
                    ownproductQty = 0.0;
                    var dJsonDataD = jsonPath(jsData, "$.Tables[10].Rows[?(@.Speciality_Code=='" + jsData.Tables[2].Rows[i].Speciality_Code + "' & @.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                    if (dJsonDataD != false) {
                        if (dJsonDataD.length > 0) {
                            for (var k = 0; k < dJsonDataD.length; k++) {
                                ownproductQty += parseFloat(dJsonDataD[k].Price);
                            }
                        }
                    }
                    tableContent += "<td style='text-align:center'>" + Math.round(ownproductQty * 100) / 100 + "</td>";
                    CompetitorQty = 0.0;
                    var dJsonDataD = jsonPath(jsData, "$.Tables[11].Rows[?(@.Speciality_Code=='" + jsData.Tables[2].Rows[i].Speciality_Code + "' & @.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                    if (dJsonDataD != false) {
                        if (dJsonDataD.length > 0) {
                            for (var k = 0; k < dJsonDataD.length; k++) {
                                CompetitorQty += parseFloat(dJsonDataD[k].Price);
                            }
                        }
                    }
                    tableContent += "<td style='text-align:center'>" + Math.round(CompetitorQty * 100) / 100 + "</td>";
                    if (CompetitorQty != 0.0) {
                        var avg = (ownproductQty / CompetitorQty) * 100;
                        tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center'>0.0</td>";
                    }
                    tableContent += "</tr>";
                }
                tableContent += "</tbody></table>";
                var jsonType = eval(type);
                $("#divSPECReport").html(tableContent);
                $("#divSPECPrint").html(tableContent);
                $('#tblSpecialityWiseAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });

                fninializePrint("divSPECPrint", "ifrmSPECPrint", "divSPECReport");
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
    //}
}


function fnSpecialityWiseAnalysisView(val) {
    ShowModalPopup("dvloading");
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];
    var dcrStatus = val.split('_')[4];

    startDate = startDate.split('/')[2] + "-" + startDate.split('/')[1] + "-" + startDate.split('/')[0];
    endDate = endDate.split('/')[2] + "-" + endDate.split('/')[1] + "-" + endDate.split('/')[0];

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetSpecialityWiseAnalysisDetails',
        data: 'sd=' + startDate + '&ed=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + val.split('_')[1] + '&regionCode=' + val.split('_')[0] + '&speciality=' + val.split('_')[5],
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

                tableContent += "<th style='text-align:left;width: 15%' >Doctor Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >MDL No</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Category</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Speciality</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Hospital Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Hospital Claissification</th>";
                tableContent += "<th style='text-align:left;width: 15%' >My RCPA Amount</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Competitor RCPA Amount </th>";
                tableContent += "<th style='text-align:left;width: 15%' >% to Competitor</th>";
                tableContent += "</tr>";
                tableContent += "<tr><th style='text-align:left;width: 15%' >Doctor Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >MDL No</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Category</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Speciality</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Hospital Name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Hospital Claissification</th>";
                tableContent += "<th style='text-align:left;width: 15%' >My RCPA Amount</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Competitor RCPA Amount </th>";
                tableContent += "<th style='text-align:left;width: 15%' >% to Competitor</th>";
                var type = '[{ type: "text" }, { type: "number-range" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';

                tableContent += "</tr>";
                tableContent += "<tr >";
                tableContent += "<th colspan= '9' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapopupview()'>Show Filter</span></th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";

                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {

                    ownProduct = 0.0;

                    tableContent += "<tr>";
                    // tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[0].Rows[0].Region_Code + "_" + jsData.Tables[2].Rows[i].Customer_Code + "_" + jsData.Tables[0].Rows[0].User_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[2].Rows[i].Customer_Name + "</span></td>";
                    tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[2].Rows[i].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[2].Rows[i].Customer_Name + "</span></td>";
                    //  tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Customer_Name + "</td>";
                    tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].MDL_Number + "</td>";
                    tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Category_Name + "</td>";
                    tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Speciality_Name + "</td>";
                    if (jsData.Tables[2].Rows[i].Hospital_Name != "" && jsData.Tables[2].Rows[i].Hospital_Name != null) {
                        tableContent += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Hospital_Name + "</td>";
                    }
                    else {
                        tableContent += "<td align='left' ></td>";
                    }
                    if (jsData.Tables[2].Rows[i].Hospital_Classification != "" && jsData.Tables[2].Rows[i].Hospital_Classification != null) {
                        tableContent += "<td align='left' >" + jsData.Tables[2].Rows[i].Hospital_Classification + "</td>";
                    }
                    else {
                        tableContent += "<td align='left' ></td>";
                    }
                    competitor = 0.0;
                    ownProduct = 0.0;
                    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Doctor_Code=='" + jsData.Tables[2].Rows[i].Customer_Code + "')]");
                    if (dJsonData != false) {
                        if (dJsonData.length > 0) {
                            for (var k = 0; k < dJsonData.length; k++) {
                                ownProduct += parseFloat(dJsonData[k].Price);
                            }
                        }
                    }
                    tableContent += "<td style='text-align:center' width='15%'>" + Math.round(ownProduct * 100) / 100 + "</td>";

                    var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Doctor_Code=='" + jsData.Tables[2].Rows[i].Customer_Code + "')]");
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
                $("#divRCPAPrint").html(tableContentPrint);
                if ($.fn.dataTable) {
                    $('#tblSpecialityDetails').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };

                fninializePrint("divRCPAPrint", "ifrmRCPAPrint", "divReportSummary");
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


function fnIndependentDoctor(val) {

    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetIndependentDoctor',
        type: "POST",
        data: 'UserCode=' + val.split('_')[0] + '&sd=' + val.split('_')[1] + '&ed=' + val.split('_')[2],


        success: function (response) {

            jsData = eval('(' + response + ')');
            var content = ""
            if (jsData.Tables[0].Rows.length > 0) {
                content += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >";
                content += "<thead><tr>";
                content += "<th align='left' colspan='6' >User Details</th></tr></thead>";
                content += "<tbody>";
                content += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Name + "</td>";
                content += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Region_Name + " </td>";
                content += "<td align='left' ><b>Date Period</b></td><td align='left' >" + $('#txtFromDate').val() + " to " + $('#txtToDate').val() + " </td></tr>";
                content += "<tr><td align='left' ><b>Employee Name</b></td><td align='left' > " + jsData.Tables[1].Rows[0].Employee_Name + " </td>";
                if (jsData.Tables[1].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[0].Region_Code + "')]");
                    divisionName = "";
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            divisionName += dJsonData[j].Division_Name + ",";
                        }

                        if (divisionName != "") {
                            divisionName = divisionName.substring(0, divisionName.length - 1);
                        }
                        content += "<td align='left' ><b>Division</b></td><td align='left' > " + divisionName + "</td>";
                    }
                    else {
                        content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                    }
                }
                else {
                    content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                }
                content += "<td align='left' ><b>Reporting To</b></td><td align='left' >  " + jsData.Tables[1].Rows[0].Manager_Name + " </td></tr>";
                content += "</tbody>";
                content += "</table>";
                content += "<table class='data display datatable' id='tbl_DoctorDetails'>";
                content += "<thead>";
                content += "<tr style='display: none;' id='tblTrDoctors'>";
                content += "<th style='display:none'>Region Name</th>";
                content += "<th style='display:none'>User Name</th>";
                content += "<th style='display:none'>Employee Name</th>";
                content += "<th style='display:none'>Reporting To</th>";
                content += "<th>DCR Date</th>";
                content += "<th>Doctor Name</th>";
                content += "<th>MDL No</th>";
                content += "<th>Catetory</th>"
                content += "<th>Speciality</th>"
                content += "<th>Hospital</th>"
                content += "<th>Hospital Classification</th>"
                content += "</tr>";
                var type = '[{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"}]';
                content += "<tr>";
                content += "<th style='display:none'>Region Name</th>";
                content += "<th style='display:none'>User Name</th>";
                content += "<th style='display:none'>Employee Name</th>";
                content += "<th style='display:none'>Reporting To</th>";
                content += "<th>DCR Date</th>";
                content += "<th>Doctor Name</th>";
                content += "<th>MDL No</th>";
                content += "<th>Catetory</th>"
                content += "<th>Speciality</th>"
                content += "<th>Hospital</th>"
                content += "<th>Hospital Classification</th>"
                content += "</tr>";
                content += "<th colspan= '11' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeDoctors()'>Show Filter</span></th>";
                content += "</thead>";
                content += "<tbody>";

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    content += "<tr>";
                    content += "<td style='display:none'>" + jsData.Tables[1].Rows[0].Region_Name + "  </td>";
                    content += "<td style='display:none'>" + jsData.Tables[1].Rows[0].User_Name + " </td>";
                    content += "<td style='display:none'> " + jsData.Tables[1].Rows[0].Employee_Name + "</td>";
                    content += "<td style='display:none'> " + jsData.Tables[1].Rows[0].Manager_Name + "  </td>";

                    content += "<td>" + jsData.Tables[0].Rows[i].DCR_Actual_Date + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Customer_Name + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].MDL_Number + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Category_Name + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Speciality_Name + "</td>";
                    if (jsData.Tables[0].Rows[i].Hospital_Name != null && jsData.Tables[0].Rows[i].Hospital_Name != "") {
                        content += "<td>";
                        content += jsData.Tables[0].Rows[i].Hospital_Name;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }
                    if (jsData.Tables[0].Rows[i].Hospital_Classification != null && jsData.Tables[0].Rows[i].Hospital_Classification != "") {
                        content += "<td>";
                        content += jsData.Tables[0].Rows[i].Hospital_Classification;
                        content += "</td>";
                    }
                    else {
                        content += "<td></td>  ";
                    }



                    content += "</tr>";
                }

                content += "</tbody>";
                content += "</table>";
                // alert(content);
                $("#divModel").html(content);
                $("#divpopPrint").html(content);
                var jsonType = eval(type)
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tbl_DoctorDetails').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType


                    });
                };
                $("#divModel").show();
                $('#dvPrint').remove();
                fninializePrint("divpopPrint", "ifrmpopPrint", "divModel");
                ShowModalPopup('modal');
            }
            else {
                alert("No data found");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}




function fnStockiest(val) {

    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetStockistInformation',
        type: "POST",
        data: 'UserCode=' + val.split('_')[0] + '&sd=' + val.split('_')[1] + '&ed=' + val.split('_')[2],


        success: function (response) {

            jsData = eval('(' + response + ')');
            var content = ""
            if (jsData.Tables[0].Rows.length > 0) {
                content += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >";
                content += "<thead><tr>";
                content += "<th align='left' colspan='6' >User Details</th></tr></thead>";
                content += "<tbody>";
                content += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Name + "</td>";
                content += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Region_Name + " </td>";
                content += "<td align='left' ><b>Date Period</b></td><td align='left' >" + $('#txtFromDate').val() + " to " + $('#txtToDate').val() + " </td></tr>";
                content += "<tr><td align='left' ><b>Employee Name</b></td><td align='left' > " + jsData.Tables[1].Rows[0].Employee_Name + " </td>";
                if (jsData.Tables[1].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[0].Region_Code + "')]");
                    divisionName = "";
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            divisionName += dJsonData[j].Division_Name + ",";
                        }

                        if (divisionName != "") {
                            divisionName = divisionName.substring(0, divisionName.length - 1);
                        }
                        content += "<td align='left' ><b>Division</b></td><td align='left' > " + divisionName + "</td>";
                    }
                    else {
                        content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                    }
                }
                else {
                    content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                }
                content += "<td align='left' ><b>Reporting To</b></td><td align='left' >  " + jsData.Tables[1].Rows[0].Manager_Name + " </td></tr>";
                content += "</tbody>";
                content += "</table>";
                content += "<table class='data display datatable' id='tbl_StockiestDetails'>";
                content += "<thead>";
                content += "<tr style='display: none;' id='tblTrStockiestDetails'>";
                content += "<th style='display:none'>Region Name</th>";
                content += "<th style='display:none'>User Name</th>";
                content += "<th style='display:none'>Employee Name</th>";
                content += "<th style='display:none'>Reporting To</th>";
                content += "<th>DCR Date</th>";
                content += "<th>Stockist Name</th>";
                content += "<th>Stockist POB</th>";
                content += "</tr>";
                var type = '[{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"}]';
                content += "<tr>";
                content += "<th style='display:none'>Region Name</th>";
                content += "<th style='display:none'>User Name</th>";
                content += "<th style='display:none'>Employee Name</th>";
                content += "<th style='display:none'>Reporting To</th>";
                content += "<th>DCR Date</th>";
                content += "<th>Stockist Name</th>";
                content += "<th>Stockist POB</th>";
                content += "</tr>";
                content += "<th colspan= '7' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeStockiest()'>Show Filter</span></th>";
                content += "</thead>";
                content += "<tbody>";

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    content += "<tr>";
                    content += "<td style='display:none'>" + jsData.Tables[1].Rows[0].Region_Name + "  </td>";
                    content += "<td style='display:none'>" + jsData.Tables[1].Rows[0].User_Name + " </td>";
                    content += "<td style='display:none'> " + jsData.Tables[1].Rows[0].Employee_Name + "</td>";
                    content += "<td style='display:none'> " + jsData.Tables[1].Rows[0].Manager_Name + "  </td>";

                    content += "<td>" + jsData.Tables[0].Rows[i].DCR_Actual_Date + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Stockiest_Name + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].PO_Amount + "</td>";
                    content += "</tr>";
                }

                content += "</tbody>";
                content += "</table>";
                // alert(content);
                $("#divModel2").html(content);
                $("#divpopPrint").html(content);
                var jsonType = eval(type)
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tbl_StockiestDetails').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                $("#divModel2").show();

                fninializePrint("divpopPrint", "ifrmpopPrint", "divModel2");
                ShowModalPopup('modal2');
            }
            else {
                alert("No data found");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}


function fnToggleTreeField() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrfield").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrfield").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}


function fnToggleTreeStockiest() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrStockiestDetails").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrStockiestDetails").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeDoctors() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrDoctors").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrDoctors").show();
        $("#spnDivToggle").html('Hide Filter');
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