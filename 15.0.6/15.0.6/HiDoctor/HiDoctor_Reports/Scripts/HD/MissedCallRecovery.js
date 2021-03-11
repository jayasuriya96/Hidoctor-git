
//**********************************    Sales And Activity Performance**********************************//

function fnDoctor360Popup(val) {
    $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + val, title: 'Reports', overlayClose: false });
    return;
}

function fnGetSalesAndActivityPerformance() {
    var month = $('input:radio[name=Selection]:checked').val();
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSalesAndActivityPerformance',
        data: 'regionCode=' + $('#hdnRegionCode').val().split('_')[0] + '&month=' + month,
        success: function (result) {
            //jsData = eval('(' + response + ')');
            //var tableContent = "";
            //var quterCount = 0, quter = 0, monthCount = 0, yearCount = 0, monthAvg = 0, yearAvg = 0;;
            //var monthList = new Array();
            //var monthCount = 0, yearCount = 0;
            //var currentMonths = 0, currentYear = 0;
            //currentMonths = currentMonth.split('_')[0];
            //currentYear = currentMonth.split('_')[1];
            //if (parseInt(currentMonths) <= 3) {
            //    currentYear = parseInt(currentYear) - 1;
            //}

            //monthList.push("Apr_4"); monthList.push("May_5"); monthList.push("Jun_6"); monthList.push("Jul_7");
            //monthList.push("Aug_8"); monthList.push("Sep_9"); monthList.push("Oct_10"); monthList.push("Nov_11");
            //monthList.push("Dec_12"); monthList.push("Jan_1"); monthList.push("Feb_2"); monthList.push("Mar_3");
            //if (jsData.Tables[0].Rows.length > 0) {


            //    tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
            //    tableContent += "<thead><tr>";
            //    tableContent += "<th colspan='6'>User Details</th>";
            //    tableContent += "</tr></thead>";
            //    tableContent += "<tbody>";
            //    tableContent += "<tr>";
            //    tableContent += "<td align='left' width='15%'>User Name</td>";
            //    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].User_Name + "</td>";
            //    tableContent += "<td align='left' width='15%'>Division Name</td>";
            //    var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
            //    divisionName = "";
            //    if (dJsonData != false) {
            //        for (var j = 0; j < dJsonData.length; j++) {
            //            divisionName += dJsonData[j].Division_Name + ",";
            //        }

            //        if (divisionName != "") {
            //            divisionName = divisionName.substring(0, divisionName.length - 1);
            //        }
            //        tableContent += "<td align='left' width='15%'>" + divisionName + "</td>";
            //    }
            //    else {
            //        tableContent += "<td align='left' width='15%'></td>";
            //    }
            //    tableContent += "<td align='left' width='15%'>Manager Name</td>";
            //    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

            //    tableContent += "<tr>";
            //    tableContent += "<td align='left' width='15%'>Employee Name</td>";
            //    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
            //    tableContent += "<td align='left' width='15%'>Date of Joining</td>";
            //    if (jsData.Tables[0].Rows[0].DOJ != null && jsData.Tables[0].Rows[0].DOJ != "") {
            //        tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].DOJ + "</td>";
            //    }
            //    else {
            //        tableContent += "<td align='left' width='15%'></td>";
            //    }
            //    tableContent += "<td align='left' width='15%'>Manager Territory name</td>";
            //    tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
            //    tableContent += "<tr>";
            //    tableContent += "<td align='left' width='15%'>Region Name</td>";
            //    tableContent += "<td align='left' width='15%' colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
            //    tableContent += "</tbody>";
            //    tableContent += "</table>";
            //    $("#divHeader").html(tableContent);

            //    tableContent = "";

            //    var tableContentH = "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].User_Name + "</td>";
            //    tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].Region_Name + "</td>";
            //    tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
            //    tableContentH += "<td align='left' style='display:none'>" + divisionName + "</td>";
            //    if (jsData.Tables[0].Rows[0].DOJ != null && jsData.Tables[0].Rows[0].DOJ != "") {
            //        tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].DOJ + "</td>";
            //    }
            //    else {
            //        tableContentH += "<td align='left' style='display:none'></td>";
            //    }
            //    tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].Manager_Name + "</td>";
            //    tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td>";


            //    tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblSalesAndActivity' class='data display datatable' >";
            //    tableContent += "<thead><tr>";

            //    tableContent += "<th align='left' style='display:none'>User Name</th>";
            //    tableContent += "<th align='left' style='display:none'>Region Name</th>";
            //    tableContent += "<th align='left' style='display:none'>Employee Name</th>";
            //    tableContent += "<th align='left' style='display:none'>Division Name</th>";
            //    tableContent += "<th align='left' style='display:none'>DOJ</th>";
            //    tableContent += "<th align='left' style='display:none'>Manager Name</th>";
            //    tableContent += "<th align='left' style='display:none'>Manager Region Name</th>";
            //    tableContent += "<th>Parameter of Reviews</th>";

            //    for (var k = 0; k < monthList.length; k++) {
            //        tableContent += "<th>" + monthList[k].split('_')[0] + " </th>";
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<th>Qtr " + quter + "</th>";
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<th>Year</th>";
            //    tableContent += "</tr></thead>";
            //    tableContent += "<tbody>";
            //    quterCount = 0;
            //    monthCount = 0;
            //    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
            //        // PARAMETER VALUES
            //        yearCount = 0;
            //        tableContent += "<tr>";
            //        tableContent += tableContentH;
            //        tableContent += "<td align='left' >" + jsData.Tables[2].Rows[i].Parameter_Name + "</td>";
            //        for (var k = 0; k < monthList.length; k++) {
            //            var dJson = jsonPath(jsData, "$.Tables[3].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "' & @.Parameter_Code=='" + jsData.Tables[2].Rows[i].Parameter_Code + "')]");
            //            if (dJson != false) {
            //                if (dJson[0].Parameter_Value != null && dJson[0].Parameter_Value != "") {
            //                    monthCount = monthCount + parseInt(dJson[0].Parameter_Value);
            //                    yearCount = yearCount + parseInt(dJson[0].Parameter_Value);
            //                    tableContent += "<td align='center'>" + dJson[0].Parameter_Value + " </td>";
            //                }
            //                else {
            //                    tableContent += "<td  align='center'>0</td>";
            //                }
            //            }
            //            else {
            //                tableContent += "<td  align='center'>0</td>";
            //            }
            //            quterCount++;
            //            if (quterCount == 3) {
            //                quterCount = 0;
            //                tableContent += "<td align='center'> " + monthCount + "</td>";
            //                monthCount = 0;
            //            }
            //            if (month == k) {
            //                break;
            //            }
            //        }
            //        tableContent += "<td align='center'> " + yearCount + "</td>";
            //        tableContent += "</tr>";
            //    }
            //    //No. of field working days
            //    tableContent += "<tr>";
            //    monthCount = 0;
            //    yearCount = 0;
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left' >No. of field working days</td>";
            //    for (var k = 0; k < monthList.length; k++) {
            //        var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "' & @.Flag=='F')]");
            //        if (dJson != false) {
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);
            //            tableContent += "<td align='center'>" + dJson.length + " </td>";
            //        }
            //        else {
            //            tableContent += "<td  align='center'>0</td>";
            //        }
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + monthCount + "</td>";
            //            monthCount = 0;
            //        }

            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'> " + yearCount + "</td>";
            //    tableContent += "</tr>";
            //    //Leave availed days

            //    monthCount = 0;
            //    yearCount = 0;

            //    tableContent += "<tr>"
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'> Leave availed days</td>";
            //    for (var k = 0; k < monthList.length; k++) {
            //        var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "' & @.Flag=='L')]");
            //        if (dJson != false) {
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);
            //            tableContent += "<td align='center'>" + dJson.length + " </td>";
            //        }
            //        else {
            //            tableContent += "<td  align='center'>0</td>";
            //        }
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + monthCount + "</td>";
            //            monthCount = 0;
            //        }

            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'> " + yearCount + "</td>";
            //    tableContent += "</tr>";
            //    monthCount = 0;
            //    yearCount = 0;

            //    // Total Holiday & Sundays
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    var sundayCount = 0, holidayCount = 0, monthSunday = 0, monthHoliday = 0, yearSunday = 0, yearHoliday = 0;

            //    tableContent += "<td align='left'> Total Holiday & Sundays</td>";
            //    for (var k = 0; k < monthList.length; k++) {

            //        sundayCount = 0;
            //        if (parseInt(monthList[k].split('_')[1]) >= 4) {
            //            sundayCount = getActiveDays(parseInt(monthList[k].split('_')[1]), currentYear);
            //            monthSunday = monthSunday + sundayCount;
            //            yearSunday = yearSunday + sundayCount;
            //        }
            //        else {
            //            sundayCount = getActiveDays(parseInt(monthList[k].split('_')[1]), (currentYear + 1))
            //        }

            //        var dJson = jsonPath(jsData, "$.Tables[17].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {
            //            monthHoliday = monthHoliday + parseInt(dJson.length);
            //            yearHoliday = yearHoliday + parseInt(dJson.length);
            //            tableContent += "<td align='center'>" + (sundayCount + parseInt(dJson.length)) + " </td>";
            //        }
            //        else {
            //            tableContent += "<td  align='center'>" + sundayCount + "</td>";
            //        }
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + (monthSunday + monthHoliday) + "</td>";
            //            monthHoliday = 0;
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'> " + (yearSunday + yearHoliday) + "</td>";
            //    tableContent += "</tr>";

            //    //No of non Field working days
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>No of non Field working days</td>";
            //    for (var k = 0; k < monthList.length; k++) {
            //        var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "' & @.Flag=='A')]");
            //        if (dJson != false) {
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);
            //            tableContent += "<td align='center'>" + dJson.length + " </td>";
            //        }
            //        else {
            //            tableContent += "<td  align='center'>0</td>";
            //        }
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + monthCount + "</td>";
            //            monthCount = 0;
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'> " + yearCount + "</td>";
            //    tableContent += "</tr>";

            //    //Total Doctors in list
            //    tableContent += "<tr> ";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>Total Doctors in list</td>";
            //    var doctorCount = 0;
            //    for (var k = 0; k < jsData.Tables[5].Rows.length; k++) {
            //        doctorCount += parseInt(jsData.Tables[5].Rows[k].Count);
            //    }

            //    for (var k = 0; k < monthList.length; k++) {
            //        tableContent += "<td  align='center'>" + doctorCount + "</td>";
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + doctorCount + "</td>";

            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'> " + doctorCount + "</td>";
            //    tableContent += "</tr>";


            //    //Total Doctors met
            //    monthCount = 0;
            //    yearCount = 0;
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>Total Doctors met</td>";
            //    for (var k = 0; k < monthList.length; k++) {
            //        var dJson = jsonPath(jsData, "$.Tables[6].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {

            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);
            //            tableContent += "<td align='center'>" + dJson.length + " </td>";
            //        }
            //        else {
            //            tableContent += "<td  align='center'>0</td>";
            //        }
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td  align='center'>" + monthCount + "</td>";
            //            monthCount = 0;
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td  align='center'>" + yearCount + "</td>";
            //    tableContent += "</tr>";

            //    //Call Avg for the month
            //    var fieldCount = 0;
            //    monthCount = 0;
            //    yearCount = 0;
            //    monthAvg = 0, yearAvg = 0;
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>Call Avg for the month</td>";
            //    for (var k = 0; k < monthList.length; k++) {

            //        var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "' & @.Flag=='L')]");
            //        if (dJson != false) {
            //            fieldCount = parseInt(dJson.length);
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);

            //        }
            //        var dJson = jsonPath(jsData, "$.Tables[7].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {
            //            if (fieldCount > 0) {

            //                monthAvg = monthAvg + parseInt(dJson.length);
            //                yearAvg = yearAvg + parseInt(dJson.length);
            //                tableContent += "<td align='center'>" + Math.round(parseInt(dJson.length) / fieldCount) + " </td>";
            //            }
            //            else {
            //                tableContent += "<td  align='center'>0</td>";
            //            }
            //        }
            //        else {
            //            tableContent += "<td  align='center'>0</td>";
            //        }
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            if (monthCount > 0) {
            //                tableContent += "<td align='center'>" + Math.round(monthAvg / monthCount) + "</td>";
            //            }
            //            else {
            //                tableContent += "<td align='center'>0</td>";
            //            }
            //            monthCount = 0;
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }

            //    if (yearCount > 0) {
            //        tableContent += "<td  align='center'>" + Math.round(yearAvg / yearCount) + "</td>";
            //    }
            //    else {
            //        tableContent += "<td align='center'>0</td>";
            //    }
            //    tableContent += "</tr>";


            //    monthCount = 0, yearCount = 0;
            //    //Total Missed Doctors
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>Total Missed Doctors</td>";
            //    for (var k = 0; k < monthList.length; k++) {


            //        var dJson = jsonPath(jsData, "$.Tables[6].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {

            //            fieldCount = parseInt(dJson.length);
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);
            //        }
            //        if (doctorCount > 0) {
            //            tableContent += "<td align='center'>" + (doctorCount - fieldCount) + "</td>";
            //        }
            //        else {
            //            tableContent += "<td align='center'>0</td>";
            //        }
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            if (doctorCount > 0) {
            //                tableContent += "<td align='center'>" + (doctorCount - monthCount) + "</td>";
            //            }
            //            else {
            //                tableContent += "<td align='center'>0</td>";
            //            }

            //            monthCount = 0;
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    if (doctorCount > 0) {
            //        tableContent += "<td align='center'>" + (doctorCount - yearCount) + "</td>";
            //    }
            //    else {
            //        tableContent += "<td align='center'>0</td>";
            //    }
            //    tableContent += "</tr>";

            //    //Total SC Doctors
            //    var visitCount = 0, visitOrde = 0;
            //    monthCount = 0, yearCount = 0;
            //    for (var j = 0; j < jsData.Tables[10].Rows.length; j++) {

            //        tableContent += "<tr>";
            //        tableContent += tableContentH;
            //        tableContent += "<td align='left'>Total " + jsData.Tables[10].Rows[j].Category_Name + "  Doctors</td>";
            //        for (var k = 0; k < monthList.length; k++) {

            //            var dJson = jsonPath(jsData, "$.Tables[5].Rows[?(@.Category=='" + jsData.Tables[10].Rows[j].Category_Code + "')]");
            //            if (dJson != false) {

            //                monthCount = monthCount + parseInt(dJson[0].Count);
            //                yearCount = yearCount + parseInt(dJson[0].Count);

            //                tableContent += "<td align='center'>" + dJson[0].Count + " </td>";
            //            }
            //            else {
            //                tableContent += "<td  align='center'>0</td>";
            //            }
            //            quterCount++;
            //            if (quterCount == 3) {
            //                quterCount = 0;
            //                quter++;
            //                tableContent += "<td>" + monthCount + "</td>";
            //                monthCount = 0;
            //            }
            //            if (month == k) {
            //                break;
            //            }
            //        }
            //        tableContent += "<td>" + yearCount + "</td>";
            //        tableContent += "</tr>";

            //        // Categort Total
            //        if (jsData.Tables[10].Rows[j].Visit_Count != null && jsData.Tables[10].Rows[j].Visit_Count != "") {
            //            visitCount = parseInt(jsData.Tables[10].Rows[j].Visit_Count);
            //        }
            //        else {
            //            visitCount = 0;
            //        }

            //        // Categort wise visit count


            //        for (var index = 0; index < visitCount; index++) {
            //            monthCount = 0, yearCount = 0;
            //            visitOrde = visitCountDetails(index + 1);
            //            tableContent += "<tr>";
            //            tableContent += tableContentH;
            //            tableContent += "<td align='left'>" + jsData.Tables[10].Rows[j].Category_Name + "  Doctors " + visitOrde + " visits</td>";
            //            for (var k = 0; k < monthList.length; k++) {

            //                var dJson = jsonPath(jsData, "$.Tables[11].Rows[?(@.Category=='" + jsData.Tables[10].Rows[j].Category_Code + "' & @.Count=='" + (index + 1) + "' & @.Month=='" + monthList[k].split('_')[1] + "')]");
            //                if (dJson != false) {
            //                    monthCount = monthCount + parseInt(dJson.length);
            //                    yearCount = yearCount + parseInt(dJson.length);
            //                    tableContent += "<td align='center'>" + dJson.length + " </td>";
            //                }
            //                else {
            //                    tableContent += "<td  align='center'>0</td>";
            //                }

            //                quterCount++;
            //                if (quterCount == 3) {
            //                    quterCount = 0;
            //                    quter++;
            //                    tableContent += "<td align='center'>" + monthCount + "</td>";
            //                    monthCount = 0;
            //                }
            //                if (month == k) {
            //                    break;
            //                }
            //            }
            //            tableContent += "<td align='center'>" + yearCount + "</td>";
            //            tableContent += "</tr>";
            //        }

            //        //  Doctors More then Visit
            //        monthCount = 0, yearCount = 0;

            //        visitOrde = visitCountDetails(visitCount);
            //        tableContent += "<tr>";
            //        tableContent += tableContentH;
            //        tableContent += "<td align='left'>" + jsData.Tables[10].Rows[j].Category_Name + "  Doctors More then " + visitOrde + "</td>";
            //        for (var k = 0; k < monthList.length; k++) {

            //            var dJson = jsonPath(jsData, "$.Tables[11].Rows[?(@.Category=='" + jsData.Tables[10].Rows[j].Category_Code + "' & @.Count > '" + visitCount + "' & @.Month=='" + monthList[k].split('_')[1] + "')]");
            //            if (dJson != false) {
            //                monthCount = monthCount + parseInt(dJson.length);
            //                yearCount = yearCount + parseInt(dJson.length);
            //                tableContent += "<td align='center'>" + dJson.length + " </td>";
            //            }
            //            else {
            //                tableContent += "<td  align='center'>0</td>";
            //            }

            //            quterCount++;
            //            if (quterCount == 3) {
            //                quterCount = 0;
            //                quter++;
            //                tableContent += "<td align='center'>" + monthCount + "</td>";
            //                monthCount = 0;
            //            }
            //            if (month == k) {
            //                break;
            //            }
            //        }
            //        tableContent += "<td align='center'>" + yearCount + "</td>";
            //        tableContent += "</tr>";


            //        // Categort wise visit count

            //        monthCount = 0, yearCount = 0, monthAvg = 0, yearAvg = 0, fieldCount = 0;
            //        var fieldAvg = 0;
            //        tableContent += "<tr>";
            //        tableContent += tableContentH;
            //        tableContent += "<td align='left'> No of " + jsData.Tables[10].Rows[j].Category_Name + "  Doctors Missed</td>";
            //        for (var k = 0; k < monthList.length; k++) {

            //            var dJson = jsonPath(jsData, "$.Tables[11].Rows[?(@.Category=='" + jsData.Tables[10].Rows[j].Category_Code + "' & @.Month=='" + monthList[k].split('_')[1] + "')]");
            //            if (dJson != false) {
            //                fieldCount = parseInt(dJson.length);
            //                monthCount = monthCount + parseInt(dJson.length);
            //                yearCount = yearCount + parseInt(dJson.length);
            //            }


            //            var dJson = jsonPath(jsData, "$.Tables[5].Rows[?(@.Category=='" + jsData.Tables[10].Rows[j].Category_Code + "')]");
            //            if (dJson != false) {

            //                fieldAvg = parseInt(dJson[0].Count);
            //                monthAvg = monthAvg + parseInt(dJson[0].Count);
            //                yearAvg = yearAvg + parseInt(dJson[0].Count);
            //            }

            //            if (fieldAvg > 0) {

            //                tableContent += "<td align='center'>" + (fieldAvg - fieldCount) + " </td>";
            //            }
            //            else {
            //                tableContent += "<td  align='center'>0</td>";
            //            }

            //            quterCount++;
            //            if (quterCount == 3) {
            //                quterCount = 0;
            //                quter++;
            //                if (monthAvg > 0) {

            //                    tableContent += "<td align='center'>" + (monthAvg - monthCount) + " </td>";
            //                }
            //                else {
            //                    tableContent += "<td  align='center'>0</td>";
            //                }
            //                monthCount = 0;
            //            }
            //            if (month == k) {
            //                break;
            //            }
            //        }
            //        if (yearAvg > 0) {

            //            tableContent += "<td align='center'>" + (yearAvg - yearCount) + " </td>";
            //        }
            //        else {
            //            tableContent += "<td  align='center'>0</td>";
            //        }
            //        tableContent += "</tr>";
            //    }


            //    //Total Chemist in list
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>Total Chemist in list</td>";
            //    var chemisitCount = 0;
            //    for (var k = 0; k < jsData.Tables[8].Rows.length; k++) {
            //        chemisitCount += parseInt(jsData.Tables[8].Rows[k].Count);
            //    }

            //    for (var k = 0; k < monthList.length; k++) {
            //        tableContent += "<td  align='center'>" + chemisitCount + "</td>";
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + chemisitCount + "</td>";

            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'> " + chemisitCount + "</td>";
            //    tableContent += "</tr>";

            //    // No of Chemist Met
            //    fieldCount = 0, monthCount = 0, yearCount = 0;
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>No of Chemist Met</td>";
            //    for (var k = 0; k < monthList.length; k++) {
            //        var dJson = jsonPath(jsData, "$.Tables[9].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);
            //            tableContent += "<td align='center'>" + dJson.length + " </td>";
            //        }
            //        else {
            //            tableContent += "<td  align='center'>0</td>";
            //        }
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + monthCount + "</td>";
            //            monthCount = 0;
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'>" + yearCount + "</td>";
            //    tableContent += "</tr>";



            //    fieldCount = 0, monthCount = 0, yearCount = 0;
            //    fieldAvg = 0, monthAvg = 0, yearAvg = 0;
            //    //No of Chemist Avg
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>No of Chemist Avg</td>";
            //    for (var k = 0; k < monthList.length; k++) {

            //        var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {
            //            fieldCount = parseInt(dJson.length);
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);
            //        }

            //        var dJson = jsonPath(jsData, "$.Tables[12].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {

            //            fieldAvg = parseInt(dJson.length);
            //            monthAvg = monthAvg + parseInt(dJson.length);
            //            yearAvg = yearAvg + parseInt(dJson.length);
            //        }

            //        if (fieldCount > 0) {
            //            tableContent += "<td align='center'>" + Math.round(fieldAvg / fieldCount) + "</td>";
            //        }
            //        else {
            //            tableContent += "<td align='center'>0</td>";
            //        }

            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            if (fieldCount > 0) {
            //                tableContent += "<td align='center'>" + Math.round(monthAvg / monthCount) + "</td>";
            //            }
            //            else {
            //                tableContent += "<td align='center'>0</td>";
            //            }
            //            monthFiled = 0;

            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }

            //    if (yearCount > 0) {
            //        tableContent += "<td align='center'>" + Math.round(yearAvg / yearCount) + "</td>";
            //    }
            //    else {
            //        tableContent += "<td align='center'>0</td>";
            //    }

            //    // Chemist POB Value
            //    fieldCount = 0;
            //    monthCount = 0;
            //    yearCount = 0;
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>Chemist POB Value</td>";
            //    for (var k = 0; k < monthList.length; k++) {
            //        fieldCount = 0;
            //        var dJson = jsonPath(jsData, "$.Tables[9].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {
            //            for (var index = 0; index > dJson.length; index++) {
            //                fieldCount += parseInt(dJson[index].PO_Amount);
            //                monthCount = monthCount + parseInt(dJson[index].PO_Amount);
            //                yearCount = yearCount + parseInt(dJson[index].PO_Amount);
            //            }

            //        }
            //        tableContent += "<td align='center'>" + fieldCount + "</td>";
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + monthCount + "</td>";
            //            monthTotal = 0;

            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'>" + yearCount + "</td>";
            //    tableContent += "</tr>";

            //    // No of Stockist Met
            //    fieldCount = 0;
            //    monthCount = 0;
            //    yearCount = 0;
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>No of Stockist Met</td>";
            //    for (var k = 0; k < monthList.length; k++) {
            //        fieldCount = 0;
            //        var dJson = jsonPath(jsData, "$.Tables[13].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {
            //            fieldCount = parseInt(dJson.length);
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);
            //        }
            //        tableContent += "<td align='center'>" + fieldCount + "</td>";
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + monthCount + "</td>";
            //            monthTotal = 0;
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'>" + yearCount + "</td>";
            //    tableContent += "</tr>";

            //    // No of Stockist Met
            //    fieldCount = 0, fieldAvg = 0;
            //    monthCount = 0, monthAvg = 0;
            //    yearCount = 0, yearAvg = 0;
            //    qtrAvg = 0;
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>No of Stockist Avg</td>";
            //    for (var k = 0; k < monthList.length; k++) {

            //        fieldCount = 0, fieldAvg = 0;
            //        var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {
            //            fieldCount = parseInt(dJson.length);
            //            monthCount = monthCount + parseInt(dJson.length);
            //            yearCount = yearCount + parseInt(dJson.length);

            //        }
            //        var dJson = jsonPath(jsData, "$.Tables[14].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
            //        if (dJson != false) {

            //            fieldAvg = parseInt(dJson.length);
            //            monthAvg = monthAvg + parseInt(dJson.length);
            //            yearAvg = yearAvg + parseInt(dJson.length);
            //        }

            //        if (fieldCount > 0) {
            //            tableContent += "<td align='center'>" + Math.round(fieldAvg / fieldCount) + "</td>";
            //        }
            //        else {
            //            tableContent += "<td align='center'>0</td>";
            //        }

            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            if (fieldCount > 0) {
            //                tableContent += "<td align='center'>" + Math.round(monthAvg / monthCount) + "</td>";
            //            }
            //            else {
            //                tableContent += "<td align='center'>0</td>";
            //            }
            //            monthAvg = 0;
            //            monthCount = 0;
            //        }
            //        if (month == k) {
            //            break;
            //        }
            //    }
            //    if (fieldCount > 0) {
            //        tableContent += "<td align='center'>" + Math.round(yearCount / yearAvg) + "</td>";
            //    }
            //    else {
            //        tableContent += "<td align='center'>0</td>";
            //    }
            //    tableContent += "</tr>";

            //    //No of Days Independent
            //    monthCount = 0;
            //    yearCount = 0;
            //    tableContent += "<tr>";
            //    tableContent += tableContentH;
            //    tableContent += "<td align='left'>No of Days Independent</td>";
            //    for (var l = 0; l < monthList.length; l++) {
            //        fieldCount = 0;
            //        var dJsonData = jsonPath(jsData, "$.Tables[15].Rows[?(@.Month=='" + monthList[l].split('_')[1] + "')]");
            //        if (dJsonData != false) {
            //            for (var k = 0; k < dJsonData.length; k++) {
            //                workedWith = "";
            //                if (dJsonData[k].Acc1 != null && dJsonData[k].Acc1 != "") {
            //                    workedWith = dJsonData[k].Acc1 + ",";
            //                }
            //                if (dJsonData[k].Acc2 != null && dJsonData[k].Acc2 != "") {
            //                    workedWith += dJsonData[k].Acc2 + ",";
            //                }
            //                if (dJsonData[k].Acc3 != null && dJsonData[k].Acc3 != "") {
            //                    workedWith += dJsonData[k].Acc3 + ",";
            //                }
            //                if (dJsonData[k].Acc4 != null && dJsonData[k].Acc4 != "") {
            //                    workedWith += dJsonData[k].Acc4 + ",";
            //                }
            //                if (workedWith == "") {
            //                    fieldCount = fieldCount + 1;
            //                    monthCount = monthCount + 1;
            //                    yearCount = yearCount + 1;
            //                }
            //            }
            //        }
            //        tableContent += "<td align='center'>" + fieldCount + "</td>";
            //        quterCount++;
            //        if (quterCount == 3) {
            //            quterCount = 0;
            //            quter++;
            //            tableContent += "<td align='center'>" + monthCount + "</td>";
            //            monthCount = 0;
            //        }
            //        if (month == l) {
            //            break;
            //        }
            //    }
            //    tableContent += "<td align='center'>" + yearCount + "</td>";
            //    tableContent += "</tr>";

            //    var count = 0;
            //    //No of Days Joined with Level 2 Region Type
            //    if (jsData.Tables[16].Rows.length > 0) {
            //        for (var index = (jsData.Tables[16].Rows.length - 1) ; index >= 0; index--) {
            //            count++;
            //            if (count != 1) {
            //                monthCount = 0;
            //                yearCount = 0;
            //                fieldCount = 0;
            //                tableContent += "<tr>";
            //                tableContent += tableContentH;
            //                tableContent += "<td align='left'>No of Days Worked with " + jsData.Tables[16].Rows[index].Region_Name + " (" + jsData.Tables[16].Rows[index].Region_Type_Name + ")</td>";
            //                for (var l = 0; l < monthList.length; l++) {
            //                    fieldCount = 0;
            //                    var dJsonData = jsonPath(jsData, "$.Tables[15].Rows[?(@.Month=='" + monthList[l].split('_')[1] + "')]");
            //                    if (dJsonData != false) {
            //                        for (var k = 0; k < dJsonData.length; k++) {
            //                            workedWith = "";
            //                            if (dJsonData[k].Acc1 != null && dJsonData[k].Acc1 != "") {
            //                                if (dJsonData[k].Acc1 == jsData.Tables[16].Rows[index].User_Name) {
            //                                    workedWith = dJsonData[k].Acc1 + ",";
            //                                }
            //                            }
            //                            if (dJsonData[k].Acc2 != null && dJsonData[k].Acc2 != "") {
            //                                if (dJsonData[k].Acc2 == jsData.Tables[16].Rows[index].User_Name) {
            //                                    workedWith = dJsonData[k].Acc1 + ",";
            //                                }
            //                            }
            //                            if (dJsonData[k].Acc3 != null && dJsonData[k].Acc3 != "") {
            //                                if (dJsonData[k].Acc3 == jsData.Tables[16].Rows[index].User_Name) {
            //                                    workedWith = dJsonData[k].Acc1 + ",";
            //                                }
            //                            }
            //                            if (dJsonData[k].Acc4 != null && dJsonData[k].Acc4 != "") {
            //                                if (dJsonData[k].Acc4 == jsData.Tables[16].Rows[index].User_Name) {
            //                                    workedWith = dJsonData[k].Acc1 + ",";
            //                                }
            //                            }
            //                            if (workedWith != "") {
            //                                fieldCount = fieldCount + 1;
            //                                monthCount = monthCount + 1;
            //                                yearCount = yearCount + 1;
            //                            }
            //                        }
            //                    }
            //                    tableContent += "<td align='center'>" + fieldCount + "</td>";
            //                    quterCount++;
            //                    if (quterCount == 3) {
            //                        quterCount = 0;
            //                        quter++;
            //                        tableContent += "<td align='center'>" + monthCount + "</td>";
            //                        monthCount = 0;
            //                    }
            //                    if (month == l) {
            //                        break;
            //                    }
            //                }
            //                tableContent += "<td align='center'>" + yearCount + "</td>";
            //                tableContent += "</tr>";
            //            }
            //            if (count == 3) {
            //                break;
            //            }
            //        }
            //    }
            //}
            //tableContent += "</tbody>";
            //tableContent += "</table>";
            $("#divHeader").html(result.split('$')[0]);
            $("#divReport").html(result.split('$')[1]);
            $("#divPrint").html(result.split('$')[1]);

            if ($.fn.dataTable) {
                $('#tblSalesAndActivity').dataTable({
                    "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };

            if (result.split('$')[1] != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
            }
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
function getActiveDays(month, year) {
    var daysinmonth = daysInMonth(month, year);
    var sundays = 0;
    for (i = 1; i <= daysinmonth; i++) {
        var dateCount = new Date(year, (month - 1), i);
        if (weekday[dateCount.getDay()] == "Sunday") {
            sundays++;
        }
    }
    return sundays;
}

function visitCountDetails(number) {
    if (1 == number) {
        return "Once";
    }
    if (2 == number) {
        return "Twice";
    }
    if (3 == number) {
        return "Thrice";
    }
    if (4 == number) {
        return "Four";
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

function fnBindCategoryName() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorCategory',
        data: 'A',
        success: function (response) {
            var tableContent = "";
            jsData = eval('(' + response + ')');
            if (jsData.Tables[0].Rows.length > 0) {
                for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                    $("#ddlCategory").append(new Option(jsData.Tables[0].Rows[j].Category_Name, jsData.Tables[0].Rows[j].Category_Code, false, false));
                }
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnGetMissedCallRecovery() {

    ShowModalPopup("dvloading");
    var nodeVal = $('#hdnRegionCode').val();
    var regionCode = nodeVal.split('_')[0];
    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];
    var category = $('#ddlCategory').val();


    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Missed Call Recovery report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Missed Call Recovery report', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("input:checkbox[name=DCRStatus]:checked").val() === undefined) {
        fnMsgAlert('info', 'Missed Call Recovery report', 'Please select DCR status.');
        HideModalPopup("dvloading");
        return false;
    }
    var days = daysInMonth(endMonth, endYear)


    var startDate = "", endDate = "", status = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }
    endDate = endYear + "-" + endMonth + "-" + days;

    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);


    if (dt1 > dt2) {
        fnMsgAlert('info', 'Missed Call Recovery report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }

    var diffMonth = monthDiff(startMonth + "/01/" + startYear, endMonth + "/" + days + "/" + endYear);
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthList = new Array();
    var dd = new Date(startDate);
    var current_month = dd.getMonth();
    for (var k = 0; k < parseInt(diffMonth) ; k++) {

        monthList.push(monthNames[current_month] + "_" + (dd.getMonth() + 1) + "_" + dd.getFullYear());
        //  tableContent += "<th>" + monthNames[current_month] + " - " + dd.getFullYear() + " </th>";
        dd.setMonth(dd.getMonth() + 1);
        current_month = dd.getMonth();
    }
    $('input:checkbox[name=DCRStatus]').each(function () {
        if ($(this).is(':checked')) { status += $(this).val() + ","; }
    });

    if (status != "") {
        status = status.substring(0, status.length - 1);
    }

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/Reports/GetMissedCallRecovery',
        data: "sd=" + startDate + "&ed=" + endDate + "&regionCode=" + regionCode + "&status=" + escape(status) + "&category=" + category,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            if (jsData.Tables[3].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead style='display: none;' id='tblTr'><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>User Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[0].User_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Division Name</td>";
                var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Region_Code=='" + jsData.Tables[3].Rows[0].Region_Code + "')]");
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
                tableContent += "<td align='left' width='15%'>Manager Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Employee Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[0].Employee_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Date of Joining</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[0].DOJ + "</td>";
                tableContent += "<td align='left' width='15%'>Manager Territory Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Region Name</td>";
                tableContent += "<td align='left' width='15%' colspan='5'>" + jsData.Tables[3].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divHeader").html(tableContent);
                tableContent = "";

                var tpVisit = 0, dcrVisit = 0, deviation = 0;
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblMissedCallRecovery' >";
                tableContent += "<thead >";
                tableContent += "<tr style='display: none;' id='tblTrmissed' >";

                var tableContentH = "<td align='left' style='display:none'>" + jsData.Tables[3].Rows[0].User_Name + "</td>";
                tableContentH += "<td align='left'style='display:none'>" + jsData.Tables[3].Rows[0].Region_Name + "</td>";
                tableContentH += "<td align='left'style='display:none'>" + jsData.Tables[3].Rows[0].Employee_Name + "</td>";
                tableContentH += "<td align='left'style='display:none'>" + divisionName + "</td>";
                tableContentH += "<td align='left'style='display:none'>" + jsData.Tables[3].Rows[0].DOJ + "</td>";
                tableContentH += "<td align='left'style='display:none'>" + jsData.Tables[3].Rows[0].Manager_Name + "</td>";
                tableContentH += "<td align='left'style='display:none'>" + jsData.Tables[3].Rows[0].Manager_Region_Name + "</td>";


                tableContent += "<th style='display:none'>User Name</th>";
                tableContent += "<th style='display:none'>Region Name</th>";
                tableContent += "<th style='display:none'>Employee Name</th>";
                tableContent += "<th style='display:none'>Division Name</th>";
                tableContent += "<th style='display:none'>DOJ</th>";
                tableContent += "<th style='display:none'>Manager Name</th>";
                tableContent += "<th style='display:none'>Manager Region Name</th>";
                tableContent += "<th >Doctor Name</th>";
                tableContent += "<th >MDL No</th>";
                tableContent += "<th >Category</th>";
                tableContent += "<th>Speciality</th>";
                tableContent += "<th >Qualification</th>";
                tableContent += "<th >Hospital Name</th>";
                tableContent += "<th >Hospital classification</th>";
                tableContent += "<th>Month</th>";
                tableContent += "<th >Planned Visits Count</th>";
                tableContent += "<th >Planned Visits Date</th>";
                tableContent += "<th >Actual Visits Count</th>";
                tableContent += "<th >Actual Visits Date</th>";
                tableContent += "<th >No of Time Missed</th>";
                tableContent += "<th >RCPA Business</th>";
                tableContent += "<th >No of Visits worked Independent</th>";
                tableContent += "</tr >";
                var type = '[{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "date-range" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "number-range" },{ type: "text" },{ type: "text" }';
                type += ', { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "number-range" },{ type: "date-range" },{ type: "number-range" },{ type: "text" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" }]';
                tableContent += "<tr>";

                var tableContentH = "<td align='left' style='display:none'>" + jsData.Tables[3].Rows[0].User_Name + "</td>";
                tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[3].Rows[0].Region_Name + "</td>";
                tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[3].Rows[0].Employee_Name + "</td>";
                tableContentH += "<td align='left' style='display:none'>" + divisionName + "</td>";
                tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[3].Rows[0].DOJ + "</td>";
                tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[3].Rows[0].Manager_Name + "</td>";
                tableContentH += "<td align='left' style='display:none'>" + jsData.Tables[3].Rows[0].Manager_Region_Name + "</td>";


                tableContent += "<th  style='display:none'>User Name</th>";
                tableContent += "<th style='display:none'>Region Name</th>";
                tableContent += "<th style='display:none'>Employee Name</th>";
                tableContent += "<th style='display:none'>Division Name</th>";
                tableContent += "<th style='display:none'>DOJ</th>";
                tableContent += "<th style='display:none'>Manager Name</th>";
                tableContent += "<th style='display:none'>Manager Region Name</th>";
                tableContent += "<th >Doctor Name</th>";
                tableContent += "<th >MDL No</th>";
                tableContent += "<th >Category</th>";
                tableContent += "<th>Speciality</th>";
                tableContent += "<th >Qualification</th>";
                tableContent += "<th >Hospital Name</th>";
                tableContent += "<th >Hospital classification</th>";
                tableContent += "<th>Month</th>";
                tableContent += "<th >Planned Visits Count</th>";
                tableContent += "<th >Planned Visits Date</th>";
                tableContent += "<th >Actual Visits Count</th>";
                tableContent += "<th >Actual Visits Date</th>";
                tableContent += "<th >No of Time Missed</th>";
                tableContent += "<th >RCPA Business</th>";
                tableContent += "<th >No of Visits worked Independent</th>";

                tableContent += "</tr>";
                tableContent += "<th colspan= '29' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeamissed()'>Show Filter</span></th>";
                tableContent + " </thead>";

                tableContent += "<tbody>";

                if (jsData.Tables[0].Rows.length > 0) {


                    for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                        for (var j = 0; j < monthList.length; j++) {
                            tableContent += "<tr>";
                            tableContent += tableContentH;
                            //tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[3].Rows[0].Region_Code + "_" + jsData.Tables[0].Rows[i].Customer_Code + "_" + jsData.Tables[3].Rows[0].User_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Customer_Name + "</span></td>";
                            tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[0].Rows[i].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[0].Rows[i].Customer_Name + "</span></td>";
                            tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].MDL_Number + "</td>";
                            tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Category_Name + "</td>";
                            tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Speciality_Name + "</td>";
                            tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Qualification + "</td>";
                            if (jsData.Tables[0].Rows[i].Hospital_Name != "" && jsData.Tables[0].Rows[i].Hospital_Name != null) {
                                tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Hospital_Name + "</td>";
                            }
                            else {
                                tableContent += "<td align='left'></td>";
                            }
                            if (jsData.Tables[0].Rows[i].Hospital_Classification != "" && jsData.Tables[0].Rows[i].Hospital_Classification != null) {
                                tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Hospital_Classification + "</td>";
                            }
                            else {
                                tableContent += "<td align='left'></td>";
                            }
                            tableContent += "<td align='left'>" + monthList[j].split('_')[0] + "</td>";
                            // TP 
                            var tpdate = "";
                            tpVisit = 0;
                            dcrVisit = 0;
                            deviation = 0;
                            var accCount = 0;
                            var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Doctor_code=='" + jsData.Tables[0].Rows[i].Customer_Code + "' & @.Month=='" + monthList[j].split('_')[1] + "' & @.Year=='" + monthList[j].split('_')[2] + "')]");
                            if (dJsonData != false) {
                                tpVisit = parseInt(dJsonData.length);
                                tableContent += "<td align='left'>" + dJsonData.length + "</td>";
                                for (var k = 0; k < dJsonData.length; k++) {
                                    tpdate += dJsonData[k].TP_Day + ",";
                                }

                            }
                            else {
                                tableContent += "<td align='left'>0</td>";
                            }

                            if (tpdate != "") {
                                tpdate = tpdate.substring(0, tpdate.length - 1);
                            }
                            tableContent += "<td align='left'>" + tpdate + "</td>";

                            //DCR

                            var dcrdate = "", workedWith = "";
                            var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Customer_Code=='" + jsData.Tables[0].Rows[i].Customer_Code + "' & @.Month=='" + monthList[j].split('_')[1] + "' & @.Year=='" + monthList[j].split('_')[2] + "')]");
                            if (dJsonData != false) {
                                dcrVisit = parseInt(dJsonData.length);
                                tableContent += "<td align='left'>" + dJsonData.length + "</td>";
                                for (var k = 0; k < dJsonData.length; k++) {
                                    dcrdate += dJsonData[k].DCR_Day + ",";
                                    workedWith = "";
                                    if (dJsonData[k].Acc1 != null && dJsonData[k].Acc1 != "") {
                                        workedWith = dJsonData[k].Acc1 + ",";
                                    }
                                    if (dJsonData[k].Acc2 != null && dJsonData[k].Acc2 != "") {
                                        workedWith += dJsonData[k].Acc2 + ",";
                                    }
                                    if (dJsonData[k].Acc3 != null && dJsonData[k].Acc3 != "") {
                                        workedWith += dJsonData[k].Acc3 + ",";
                                    }
                                    if (dJsonData[k].Acc4 != null && dJsonData[k].Acc4 != "") {
                                        workedWith += dJsonData[k].Acc4 + ",";
                                    }
                                    if (workedWith == "") {
                                        accCount = accCount + 1;
                                    }
                                }
                            }
                            else {
                                tableContent += "<td align='left'>0</td>";
                            }
                            if (dcrdate != "") {
                                dcrdate = dcrdate.substring(0, dcrdate.length - 1);
                            }
                            tableContent += "<td align='left'>" + dcrdate + "</td>";

                            if (tpVisit > 0) {
                                deviation = tpVisit - dcrVisit;
                                tableContent += "<td align='left'>" + deviation + "</td>";
                            }
                            else {
                                tableContent += "<td align='left'>0</td>";
                            }
                            var amount = 0.0;
                            var dJsonData = jsonPath(jsData, "$.Tables[5].Rows[?(@.Doctor_Code=='" + jsData.Tables[0].Rows[i].Customer_Code + "')]");
                            if (dJsonData != false) {
                                for (var k = 0; k < dJsonData.length; k++) {
                                    amount = amount + parseFloat(dJsonData[k].Amount);
                                }
                            }
                            else {
                                amount = 0.0;
                            }
                            tableContent += "<td align='left'>" + Math.round(amount * 100) / 100 + "</td>";
                            tableContent += "<td align='left'>" + accCount + "</td></tr>";
                        }

                    }

                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                var jsonType = eval(type);
                $("#divReport").html(tableContent);
                $("#divPrint").html(tableContent);
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tblMissedCallRecovery').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType

                    });
                };
                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
                fninializePrint("divPrint", "ifrmPrint", "divReport");
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
            HideModalPopup("dvloading");
        }
    });
}

function fnToggleTreeamissed() {

    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrmissed").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrmissed").show();
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

function fnDayAnalysisReport() {

    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Day Analysis Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Day Analysis Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "/" + FromDateArr[1] + "/" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "/" + ToDateArr[1] + "/" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Day Analysis Report', 'Start date should be less than end date.');
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
            $("#divReport").html('');
            if (jsData.Tables[1].Rows.length > 0) {
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDayAnalysis' >";
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
                tableContent += "<tr >";
                tableContent += "<th colspan= '16' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";
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
                        tableContent += "<td align='center' width='8%' onclick='fnDayAnalysisPopup(\"" + jsData.Tables[1].Rows[i].Region_Code + "_" + jsData.Tables[1].Rows[i].User_Code + "_" + $("#txtFromDate").val() + "_" + $("#txtToDate").val() + "_NOTREPORTED\")' style='text-decoration:underline;cursor:pointer'>" + nonFieldDays + "</td>";
                    }
                    else {
                        tableContent += "<td align='center' width='15%'>0</td>";
                    }
                    //Not Available  Days
                    if (sunday > 0) {
                        tableContent += "<td align='center' width='8%' onclick='fnDayAnalysisPopup(\"" + jsData.Tables[1].Rows[i].Region_Code + "_" + jsData.Tables[1].Rows[i].User_Code + "_" + $("#txtFromDate").val() + "_" + $("#txtToDate").val() + "_SUNDAY\")' style='text-decoration:underline;cursor:pointer'>" + sunday + "</td>";
                    }
                    else {
                        tableContent += "<td align='center' width='15%'>0</td>";
                    }
                    //Leave
                    if (leave > 0) {
                        tableContent += "<td align='center' width='8%' onclick='fnDayAnalysisPopup(\"" + jsData.Tables[1].Rows[i].Region_Code + "_" + jsData.Tables[1].Rows[i].User_Code + "_" + $("#txtFromDate").val() + "_" + $("#txtToDate").val() + "_LEAVE\")' style='text-decoration:underline;cursor:pointer'>" + leave + "</td>";
                    }
                    else {
                        tableContent += "<td align='center' width='15%'>0</td>";
                    }
                    //Holiday
                    if (holiday > 0) {
                        tableContent += "<td align='center' width='8%' onclick='fnDayAnalysisPopup(\"" + jsData.Tables[1].Rows[i].Region_Code + "_" + jsData.Tables[1].Rows[i].User_Code + "_" + $("#txtFromDate").val() + "_" + $("#txtToDate").val() + "_HOLIDAY\")' style='text-decoration:underline;cursor:pointer'>" + holiday + "</td>";
                    } else {
                        tableContent += "<td align='center' width='15%'>0</td>";
                    }
                    //Non FW Days
                    if (attendance > 0) {
                        tableContent += "<td align='center' width='8%' onclick='fnDayAnalysisPopup(\"" + jsData.Tables[1].Rows[i].Region_Code + "_" + jsData.Tables[1].Rows[i].User_Code + "_" + $("#txtFromDate").val() + "_" + $("#txtToDate").val() + "_ATTENDANCE\")' style='text-decoration:underline;cursor:pointer'>" + attendance + "</td>";
                    }
                    else {
                        tableContent += "<td align='center' width='15%'>0</td>";
                    }
                    //No of Days in FW
                    if (field > 0) {
                        tableContent += "<td align='center' width='8%' onclick='fnDayAnalysisPopup(\"" + jsData.Tables[1].Rows[i].Region_Code + "_" + jsData.Tables[1].Rows[i].User_Code + "_" + $("#txtFromDate").val() + "_" + $("#txtToDate").val() + "_FIELD\")' style='text-decoration:underline;cursor:pointer'>" + field + "</td>";
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
                $("#divReport").html(tableContent);
                $("#divPrint").html(tableContent);
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tblDayAnalysis').dataTable({
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
            HideModalPopup('dvloading');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnDayAnalysisPopup(val) {

    ShowModalPopup("dvloading");
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];
    var FromDateArr = startDate.split('/');
    var ToDateArr = endDate.split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Day Analysis Report', 'Start date should be less than end date.');
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
        url: '../HiDoctor_Reports/Reports/GetDayAnalysisPopupReport',
        data: 'regionCode=' + val.split('_')[0] + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var day = 0;
            var month = 0;
            var total = 0, leave = 0, attendance = 0, field = 0;
            var nonFieldDays = 0, sunday = 0, holiday = 0, tempDays = 0;
            var divisionName = "";
            var fieldStatus = "";
            $("#divModel").html('');

            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>User Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Division Name</td>";
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
                tableContent += "<td align='left' width='15%'>Manager Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Employee Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Date of Joining</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                tableContent += "<td align='left' width='15%'>Manager Territory Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Region Name</td>";
                tableContent += "<td align='left' width='15%' colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divHeader").html(tableContent);

                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDayAnalysispopReport' >";
                tableContent += "<thead><tr>";
                tableContent += "<th align='left' >Date</th>";
                tableContent += "<th align='left' >Activity Name</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";

                nonFieldDays = 0, tempDays = 0, sunday = 0, holiday = 0;
                attendance = 0, field = 0, leave = 0;
                var tableContentH = "", tableContentS = "", tableContentL = "", tableContentF = "";
                for (var j = 0; j <= noOfDays; j++) {
                    var isHoliday = false;
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
                    var dJsonH = jsonPath(jsData, "$.Tables[5].Rows[?(@.DCR_Date=='" + date + "' & @.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                    if (dJsonH != false) {
                        tempDays++;
                        isHoliday = true;
                        tableContentH += "<tr>";
                        tableContentH += "<td align='left' >" + date + "</td><td align='left'>" + dJsonH[0].Holiday_Name + "</td>";
                        tableContentH += "</tr>";
                    }
                    if (weekday[temp.getDay()] == "Sunday") {
                        isHoliday = true;
                        tableContentS += "<tr>";
                        tableContentS += "<td align='left'>" + date + "</td><td align='left'>SUNDAY</td>";
                        tableContentS += "</tr>";

                        tempDays++;
                    }

                    var dJson = jsonPath(jsData, "$.Tables[2].Rows[?(@.DCR_Actual_Date=='" + date + "' & @.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                    if (dJson != false) {
                        for (var k = 0; k < dJson.length; k++) {
                            if (dJson[k].Flag == "F") {
                                tempDays++;
                                tableContentF += "<tr>";
                                tableContentF += "<td align='left' >" + date + "</td><td align='left'>FIELD</td>";
                                tableContentF += "</tr>";
                            }
                            else if (dJson[k].Flag == "A") {
                                tempDays++;

                            }
                            else if (dJson[k].Flag == "L") {
                                tempDays++;
                                tableContentL += "<tr>";
                                tableContentL += "<td align='left'>" + date + "</td><td align='left'>" + dJson[k].Leave_Type_Name + "</td>";
                                tableContentL += "</tr>";

                            }
                        }
                    }

                    if (val.split('_')[4] == "NOTREPORTED") {

                        var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.DCR_Actual_Date=='" + date + "' & @.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                        if (dJson != false) {
                            if (!isHoliday) {
                                if (dJson.length > 0) {
                                    if (dJson.length == 1) {
                                        if (dJson[0].DCR_Status != "2") {
                                            tableContent += "<tr>";
                                            tableContent += "<td align='left' >" + date + "</td><td align='left' >" + dJson[0].DCR_Flag + "(" + dJson[0].Status + ")</td>";
                                            tableContent += "</tr>";
                                        }
                                    }
                                    else {
                                        for (var index = 0; index < dJson.length; index++) {
                                            if (dJson[index].DCR_Status != "2") {
                                                tableContent += "<tr>";
                                                tableContent += "<td align='left' >" + date + "</td><td align='left' >" + dJson[index].DCR_Flag + "(" + dJson[index].Status + ")</td>";
                                                tableContent += "</tr>";
                                            }
                                        }
                                    }
                                }
                                else {
                                    tableContent += "<tr>";
                                    tableContent += "<td align='left' >" + date + "</td><td align='left' >Not Reported</td>";
                                    tableContent += "</tr>";
                                }
                            }
                            else {
                                if (dJson.length > 0) {
                                    if (dJson.length == 1) {
                                        if (dJson[0].DCR_Status != "2") {
                                            tableContent += "<tr>";
                                            tableContent += "<td align='left' >" + date + "</td><td align='left' >" + dJson[0].DCR_Flag + "(" + dJson[0].Status + ")</td>";
                                            tableContent += "</tr>";
                                        }
                                    }
                                    else {
                                        for (var index = 0; index < dJson.length; index++) {
                                            if (dJson[index].DCR_Status != "2") {
                                                tableContent += "<tr>";
                                                tableContent += "<td align='left' >" + date + "</td><td align='left' >" + dJson[index].DCR_Flag + "(" + dJson[index].Status + ")</td>";
                                                tableContent += "</tr>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (!isHoliday) {
                                tableContent += "<tr>";
                                tableContent += "<td align='left' >" + date + "</td><td align='left' >Not Reported</td>";
                                tableContent += "</tr>";
                            }
                        }

                        //if (tempDays == 0) {
                        //    tableContent += "<tr>";
                        //    tableContent += "<td align='left' >" + date + "</td><td align='left' >Not Reported</td>";
                        //    tableContent += "</tr>";
                        //}
                        //else {
                        //    var dJson = jsonPath(jsData, "$.Tables[4].Rows[?(@.DCR_Actual_Date=='" + date + "' & @.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "')]");
                        //    if (dJson != false) {
                        //        if (dJson.length > 0) {
                        //            for (var index = 0; index < dJson.length; index++) {

                        //                tableContent += "<tr>";
                        //                if (dJson[index].Flag == "A") {
                        //                    tableContent += "<td align='left' >" + date + "</td><td align='left' >Attendance(" + dJson[index].DCR_Status + ")</td>";
                        //                }
                        //                else if (dJson[index].Flag == "F") {
                        //                    tableContent += "<td align='left' >" + date + "</td><td align='left' >Field(" + dJson[index].DCR_Status + ")</td>";
                        //                }
                        //                else {
                        //                    tableContent += "<td align='left' >" + date + "</td><td align='left' >LEAVE(" + dJson[index].DCR_Status + ")</td>";
                        //                }
                        //                tableContent += "</tr>";
                        //            }
                        //        }
                        //    }
                        //}
                    }
                    else if (val.split('_')[4] == "ATTENDANCE") {
                        var dJsonA = jsonPath(jsData, "$.Tables[3].Rows[?(@.CR_Actual_Date=='" + date + "' & @.Region_Code=='" + jsData.Tables[0].Rows[0].Region_Code + "' & @.Flag=='A')]");
                        if (dJsonA != false) {
                            if (dJsonA.length > 0) {
                                for (var k = 0; k < dJsonA.length; k++) {
                                    tableContent += "<tr>";
                                    tableContent += "<td align='left' >" + date + "</td><td align='left' >" + dJsonA[k].Activity_Name + "</td>";
                                    tableContent += "</tr>";

                                }
                            }
                            else {
                                tableContent += "<tr>";
                                tableContent += "<td align='left' >" + date + "</td><td align='left' >Attendance</td>";
                                tableContent += "</tr>";
                            }
                        }
                    }

                }
                if (val.split('_')[4] == "SUNDAY") {
                    tableContent += tableContentS;
                }
                else if (val.split('_')[4] == "LEAVE") {
                    tableContent += tableContentL;
                }
                else if (val.split('_')[4] == "HOLIDAY") {
                    tableContent += tableContentH;
                }
                else if (val.split('_')[4] == "FIELD") {
                    tableContent += tableContentF;
                }
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divModel").html(tableContent);
                $("#divsubPrint").html(tableContent);
                if ($.fn.dataTable) {
                    $('#tblDayAnalysispopReport').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                };

                fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
                ShowModalPopup('modal');
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Doctor Visits Frequency Analysis Report


function fnDoctorVisitsFrequencyAnalysis() {


    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Doctor Visits Frequency Analysis Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Doctor Visits Frequency Analysis Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');

    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Doctor Visits Frequency Analysis Report', 'Start date should be less than end date.');
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorVisitsFrequencyAnalysis',
        data: 'regionCode=' + regionCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0],
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


function fnDoctorVisitsFrequencyPopup(val) {
    ShowModalPopup("dvloading");
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];
    var tableContentAbove = "", tableContentRight = "", tableContentBelow = "", tableContentNo = "";
    var above = 0, right = 0, below = 0, no = 0;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorVisitsFrequencyPopup',
        data: 'regionCode=' + val.split('_')[0] + '&sd=' + startDate + '&ed=' + endDate + '&category=' + val.split('_')[4],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var divisionName = "";
            $("#divModel").html('');
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>User Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Division Name</td>";
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
                tableContent += "<td align='left' width='15%'>Manager Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Employee Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Date of Joining</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                tableContent += "<td align='left' width='15%'>Manager Territory Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Region Name</td>";
                tableContent += "<td align='left' width='15%' colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divHeader").html(tableContent);
                tableContent = "";
                if (val.split('_')[5] == "FREQACHIVED") {
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorVisitsFrequencypop' >";
                    tableContent += "<thead><tr>";
                    tableContent += "<th align='left' >S.No</th>";
                    tableContent += "<th align='left' >Doctor Name</th>";
                    tableContent += "<th align='left' >VisitDetails</th>";
                    tableContent += "<th align='left' >MDL No</th>";
                    tableContent += "<th align='left' >Category</th>";
                    tableContent += "<th align='left' >Speciality</th>";
                    tableContent += "<th align='left' >Hospital Name</th>";
                    tableContent += "<th align='left' >Hospital Claissification</th>";
                    tableContent += "<th align='left' >No of Visits</th>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";
                    var sno = 0, visitCount = 0;
                    if (jsData.Tables[2].Rows[0].Visit_Count != null && jsData.Tables[2].Rows[0].Visit_Count != "") {
                        visitCount = parseInt(jsData.Tables[2].Rows[0].Visit_Count);
                    }
                    else {
                        visitCount = 0;
                    }
                    for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {

                        var mdlNo = 0;
                        if (jsData.Tables[3].Rows[i].MDL_Number != "") {
                            if (jsData.Tables[3].Rows[i].MDL_Number.match(/^\d+$/)) {
                                mdlNo = parseInt(jsData.Tables[3].Rows[i].MDL_Number);
                            }
                            else {
                                mdlNo = jsData.Tables[3].Rows[i].MDL_Number;
                            }
                        }

                        var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Customer_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "')]");
                        if (dJsonData != false) {
                            if (parseInt(dJsonData[0].Count) > visitCount) {
                                above++;
                                tableContentAbove += "<tr>";
                                tableContentAbove += "<td align='left' width='15%'>" + above + "</td>";
                                tableContentAbove += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Customer_Name + "</td>";
                                tableContentAbove += "<td align='left' width='15%'>Doctor Covered above Frequency</td>";
                                tableContentAbove += "<td align='left' width='15%'>" + mdlNo + "</td>";
                                tableContentAbove += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Category_Name + "</td>";
                                tableContentAbove += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Speciality_Name + "</td>";

                                if (jsData.Tables[3].Rows[i].Hospital_Name != "" && jsData.Tables[3].Rows[i].Hospital_Name != null) {
                                    tableContentAbove += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Name + "</td>";
                                }
                                else {
                                    tableContentAbove += "<td align='left' width='15%'></td>";
                                }

                                if (jsData.Tables[3].Rows[i].Hospital_Classification != "" && jsData.Tables[3].Rows[i].Hospital_Classification != null) {
                                    tableContentAbove += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Classification + "</td>";
                                }
                                else {
                                    tableContentAbove += "<td align='left' width='15%'></td>";
                                }
                                tableContentAbove += "<td align='left' width='15%'>" + parseInt(dJsonData[0].Count) + "</td>";
                                tableContentAbove += "</tr>";

                            }
                            else if (parseInt(dJsonData[0].Count) == visitCount) {
                                right++;
                                tableContentRight += "<tr>";
                                tableContentRight += "<td align='left' width='15%'>" + right + "</td>";
                                tableContentRight += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Customer_Name + "</td>";
                                tableContentRight += "<td align='left' width='15%'>Doctor Covered Right Frequency</td>";
                                tableContentRight += "<td align='left' width='15%'>" + mdlNo + "</td>";
                                tableContentRight += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Category_Name + "</td>";
                                tableContentRight += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Speciality_Name + "</td>";

                                if (jsData.Tables[3].Rows[i].Hospital_Name != "" && jsData.Tables[3].Rows[i].Hospital_Name != null) {
                                    tableContentRight += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Name + "</td>";
                                }
                                else {
                                    tableContentRight += "<td align='left' width='15%'></td>";
                                }
                                if (jsData.Tables[3].Rows[i].Hospital_Classification != "" && jsData.Tables[3].Rows[i].Hospital_Classification != null) {

                                    tableContentRight += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Classification + "</td>";
                                }
                                else {
                                    tableContentRight += "<td align='left' width='15%'></td>";
                                }
                                tableContentRight += "<td align='left' width='15%'>" + parseInt(dJsonData[0].Count) + "</td>";
                                tableContentRight += "</tr>";

                            }
                            else if (parseInt(dJsonData[0].Count) < visitCount) {

                                below++;
                                tableContentBelow += "<tr>";
                                tableContentBelow += "<td align='left' width='15%'>" + below + "</td>";
                                tableContentBelow += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Customer_Name + "</td>";
                                tableContentBelow += "<td align='left' width='15%'>Doctor Covered below Frequency</td>";
                                tableContentBelow += "<td align='left' width='15%'>" + mdlNo + "</td>";
                                tableContentBelow += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Category_Name + "</td>";
                                tableContentBelow += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Speciality_Name + "</td>";

                                if (jsData.Tables[3].Rows[i].Hospital_Name != "" && jsData.Tables[3].Rows[i].Hospital_Name != null) {

                                    tableContentBelow += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Name + "</td>";
                                }
                                else {
                                    tableContentBelow += "<td align='left' width='15%'></td>";
                                }

                                if (jsData.Tables[3].Rows[i].Hospital_Classification != "" && jsData.Tables[3].Rows[i].Hospital_Classification != null) {

                                    tableContentBelow += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Classification + "</td>";
                                }
                                else {
                                    tableContentBelow += "<td align='left' width='15%'></td>";
                                }
                                tableContentBelow += "<td align='left' width='15%'>" + parseInt(dJsonData[0].Count) + "</td>";
                                tableContentBelow += "</tr>";

                            }
                        }
                        else {

                            no++;
                            tableContentNo += "<tr>";
                            tableContentNo += "<td align='left' width='15%'>" + no + "</td>";
                            tableContentNo += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Customer_Name + "</td>";
                            tableContentNo += "<td align='left' width='15%'>Doctor Covered No Frequency</td>";
                            tableContentNo += "<td align='left' width='15%'>" + mdlNo + "</td>";
                            tableContentNo += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Category_Name + "</td>";
                            tableContentNo += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Speciality_Name + "</td>";

                            if (jsData.Tables[3].Rows[i].Hospital_Name != "" && jsData.Tables[3].Rows[i].Hospital_Name != null) {

                                tableContentNo += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Name + "</td>";
                            }
                            else {
                                tableContentNo += "<td align='left' width='15%'></td>";
                            }

                            if (jsData.Tables[3].Rows[i].Hospital_Classification != "" && jsData.Tables[3].Rows[i].Hospital_Classification != null) {
                                tableContentNo += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Classification + "</td>";
                            }
                            else {
                                tableContentNo += "<td align='left' width='15%'></td>";
                            }
                            tableContentNo += "<td align='left' width='15%'>0</td>";
                            tableContentNo += "</tr>";
                        }
                    }
                    tableContent += tableContentAbove;
                    tableContent += tableContentRight;
                    tableContent += tableContentBelow;
                    tableContent += tableContentNo;
                    tableContent += "</tbody>";
                    tableContent += "</table>";
                }
                else if (val.split('_')[5] == "ACTUAL") {
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorVisitsFrequencypop' >";
                    tableContent += "<thead><tr>";
                    tableContent += "<th align='left' >S.No</th>";
                    tableContent += "<th align='left' >Doctor Name</th>";
                    tableContent += "<th align='left' >MDL No</th>";
                    tableContent += "<th align='left' >Category</th>";
                    tableContent += "<th align='left' >Speciality</th>";
                    tableContent += "<th align='left' >Hospital Name</th>";
                    tableContent += "<th align='left' >Hospital Claissification</th>";
                    tableContent += "<th align='left' >No of Visits</th>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";

                    for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {

                        var mdlNo = 0;
                        if (jsData.Tables[3].Rows[i].MDL_Number != "") {
                            if (jsData.Tables[3].Rows[i].MDL_Number.match(/^\d+$/)) {
                                mdlNo = parseInt(jsData.Tables[3].Rows[i].MDL_Number);
                            }
                            else {
                                mdlNo = jsData.Tables[3].Rows[i].MDL_Number;
                            }
                        }
                        no++;
                        tableContent += "<tr>";
                        tableContent += "<td align='left' width='15%'>" + no + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Customer_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + mdlNo + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Category_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Speciality_Name + "</td>";

                        if (jsData.Tables[3].Rows[i].Hospital_Name != "" && jsData.Tables[3].Rows[i].Hospital_Name != null) {

                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Name + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }

                        if (jsData.Tables[3].Rows[i].Hospital_Classification != "" && jsData.Tables[3].Rows[i].Hospital_Classification != null) {

                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[3].Rows[i].Hospital_Classification + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Customer_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "')]");
                        if (dJsonData != false) {
                            tableContent += "<td align='left' width='15%'>" + parseInt(dJsonData[0].Count) + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'>0</td>";
                        }
                        tableContent += "</tr>";
                    }
                    tableContent += "</tbody>";
                    tableContent += "</table>";
                }

                else if (val.split('_')[5] == "TOTAL") {
                    visitCount = 0;
                    var totalDoctor = 0;
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorVisitsFrequencypop' >";
                    tableContent += "<thead><tr>";
                    tableContent += "<th align='left' >DETAILS</th>";
                    tableContent += "<th align='left' >COUNT</th>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";
                    for (var j = 0; j < jsData.Tables[5].Rows.length; j++) {
                        if (jsData.Tables[5].Rows[j].Visit_Count != null && jsData.Tables[5].Rows[j].Visit_Count != "") {
                            visitCount = parseInt(jsData.Tables[5].Rows[j].Visit_Count);
                        }
                        else {
                            visitCount = 0;
                        }
                        tableContent += "<tr>";
                        tableContent += "<td align='left' width='15%'>Actual " + jsData.Tables[5].Rows[j].Category_Name + "  Drs Visits</td>";
                        var dJsonData = jsonPath(jsData, "$.Tables[6].Rows[?(@.Category=='" + jsData.Tables[5].Rows[j].Category_Code + "')]");
                        if (dJsonData != false) {
                            if (dJsonData.length > 0) {
                                tableContent += "<td align='left' width='15%'>" + (parseInt(dJsonData[0].Count) * visitCount) + "</td>";
                                totalDoctor = totalDoctor + (parseInt(dJsonData[0].Count) * visitCount);
                            }
                            else {
                                tableContent += "<td align='left' width='15%'>0</td>";
                            }
                        }
                        else {
                            tableContent += "<td align='left' width='15%'>0</td>";
                        }
                        tableContent += "</tr>";
                    }
                    tableContent += "<tr>";
                    tableContent += "<td align='left' width='15%'>Actual Total Visits</td>";
                    tableContent += "<td align='left' width='15%'>" + totalDoctor + "</td>";
                    tableContent += "</tr>";
                }


                $("#divModel").html(tableContent);
                $("#divsubPrint").html(tableContent);
                if ($.fn.dataTable) {
                    if (val.split('_')[5] == "FREQACHIVED") {
                        $('#tblDoctorVisitsFrequencypop').dataTable({
                            "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        }).rowGrouping({ bExpandableGrouping: true, iGroupingColumnIndex: 2 });
                    }
                    else if (val.split('_')[5] == "ACTUAL") {
                        $('#tblDoctorVisitsFrequencypop').dataTable({
                            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        });
                    }
                };

                fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
                ShowModalPopup('modal');
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}




//  TP VS ACtual Deviation Details


function fnGetTPvsActualDeviationDetails() {
    $('#regiontree').hide();
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');
    $("#spnTreeToggle").html('Show Tree');
    var tbllegend = "";
    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();

    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'TP VS Actual Deviation Details Report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    var noOfDays = daysInMonth(startMonth, startYear)
    if (startMonth < 10) {
        var dt1 = new Date(startYear + "/" + startMonth + "/01");
    }
    else {
        var dt1 = new Date(startYear + "/" + startMonth + "/01");
    }

    // var dt1 = new Date(startYear + "-" + startMonth + "-01");
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetTPvsActualDeviationDetails',
        data: 'regionCode=' + regionCode + '&month=' + startMonth + '&year=' + startYear,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";

            $("#divSubReport").html('');
            if (jsData.Tables[0].Rows.length > 0) {

                // User Information start here
                var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6' style='text-align:center;'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>User Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Division Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Division_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Manager Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Reporting_Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Employee Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Date of Joining</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].User_Date_of_joining + "</td>";
                tableContent += "<td align='left' width='15%'>Manager Territory name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Reporting_Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Region Name</td>";
                tableContent += "<td align='left' width='15%' colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divHeader").html(tableContent);

                // User information end here
                tableContent = "";

                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblTPvsActualDeviation' >";
                tableContent += "<thead>";

                // FILTER CONTROL 
                var iRow = 18;
                tableContent += "<tr style='display: none;' id='tblTr'>";
                var type = '[{ type: "text" },{ type: "date-range" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }';
                tableContent += "<th align='left' width='15%' style='display:none'>User name</th>";
                tableContent += "<th align='left' width='15%' style='display:none'>Region Name</th>";
                tableContent += "<th align='left' width='15%' style='display:none'>Employee Name</th>";
                tableContent += "<th align='left' width='15%' style='display:none'>Reporting To</th>";
                tableContent += "<th align='left' width='15%'>Date</th>";
                tableContent += "<th align='left' width='15%' >Activity as per TP</th>";
                tableContent += "<th align='left' width='15%'> Category as per TP</th>";
                tableContent += "<th align='left' width='15%'>Place of Work as per TP</th>";
                tableContent += "<th align='left' width='15%' >Accompanist(s) as per TP</th>";
                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                    iRow++
                    type += ', { type: "number-range" }';
                    tableContent += "<th align='left' width='15%' >" + jsData.Tables[2].Rows[i].Category_Name + "</th>";
                }
                type += ', { type: "number-range" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }';
                tableContent += "<th align='left' width='15%'>Total Drs</th>";
                tableContent += "<th align='left' width='15%'>DCR Status</th>";
                tableContent += "<th align='left' width='15%'>Activity as per DCR</th>";
                tableContent += "<th align='left' width='15%' >Category as per DCR</th>";
                tableContent += "<th align='left' width='15%' >Place of Work as per DCR</th>";
                tableContent += "<th align='left' width='15%' >Accompanist(s) as per DCR</th>";
                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                    iRow++
                    type += ', { type: "number-range" }';
                    tableContent += "<th align='left' width='15%' >" + jsData.Tables[2].Rows[i].Category_Name + "</th>";
                }
                type += ', { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';
                tableContent += "<th align='left' width='15%'>Total Drs</th>";

                tableContent += "<th align='left' width='15%'>Chemist(s) Met</th>";
                tableContent += "<th align='left' width='15%'>Chemist(s)POB</th>";
                tableContent += "</tr>";

                // HEADER 1
                tableContent += "<tr>";
                tableContent += "<th style='text-align: center' colspan=" + (6 + jsData.Tables[2].Rows.length) + ">Activity as per TP</th>";
                tableContent += "<th style='text-align: center' colspan=" + (14 + jsData.Tables[2].Rows.length) + ">Activity as per DCR</th>";
                tableContent += "</tr>";

                // HEADER 2
                tableContent += "<tr>";
                tableContent += "<th align='left' width='15%' rowspan='2' style='display:none'>User name</th>";
                tableContent += "<th align='left' width='15%' rowspan='2' style='display:none'>Region Name</th>";
                tableContent += "<th align='left' width='15%' rowspan='2' style='display:none'>Employee Name</th>";
                tableContent += "<th align='left' width='15%' rowspan='2' style='display:none'>Reporting To</th>";

                tableContent += "<th align='left' width='15%' rowspan='2'>Date</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'>Activity as per TP</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'> Category as per TP</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'>Place of Work as per TP</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'>Accompanist(s) as per TP</th>";

                tableContent += "<th style='text-align: center' width='15%' colspan =" + (1 + jsData.Tables[2].Rows.length) + ">No of Doctors as per TP</th>";

                tableContent += "<th align='left' width='15%' rowspan='2'>DCR Status</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'>Activity as per DCR</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'> Category as per DCR</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'>Place of Work as per DCR</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'>Accompanist(s) as per DCR</th>";
                tableContent += "<th style='text-align: center' width='15%' colspan =" + (1 + jsData.Tables[2].Rows.length) + ">No of Doctors as per DCR</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'>Chemist(s) Met</th>";
                tableContent += "<th align='left' width='15%' rowspan='2'>Chemist(s)POB</th>";
                tableContent += "</tr>";

                tableContent += "<tr>";
                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                    tableContent += "<th align='left' width='15%' >" + jsData.Tables[2].Rows[i].Category_Name + "</th>";
                }
                tableContent += "<th align='left' width='15%'>Total Drs</th>";
                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                    tableContent += "<th align='left' width='15%'>" + jsData.Tables[2].Rows[i].Category_Name + "</th>";
                }
                tableContent += "<th align='left' width='15%'>Total Drs</th>";
                tableContent += "</tr>";

                // SHOW HIDE CONTROL

                tableContent += "<tr >";
                tableContent += "<th colspan= '" + iRow + "' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";

                var tpaccName = "", tpactivityName = "", tpcategory = "", tpworkarea = "", tpAcctivtywithProjectName = "";
                var tpDoctorCount = 0, dcrDoctorCount = 0, chemistMet = 0;
                var chemistPob = 0.0;
                tableContent += "</thead>";
                tableContent += "<tbody>";
                for (var i = 0; i < noOfDays; i++) {                  
                    var temp = new Date(dt1.getFullYear(), dt1.getMonth(), dt1.getDate() + i);
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
                    chemistPob = 0.0;
                    chemistMet = 0;
                    tableContent += "<tr>";
                    //TP Section
                    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.DAY=='" + day + "')]");
                    tpaccName = "", tpactivityName = "", tpcategory = "", tpworkarea = "", tpStatus = "", tpAcctivtywithProjectName = "", tpholidayName = "";

                    if (weekday[temp.getDay()] == "Sunday") {
                        tpactivityName = "Sunday,";
                    }
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            tpStatus = dJsonData[j].Tp_Status;
                            if (tpStatus.toUpperCase() == 'APPROVED') {
                                if (dJsonData[j].Project_Name.toUpperCase() == "FIELD" || dJsonData[j].Project_Name.toUpperCase() == "FIELD_RCPA") {
                                    if (dJsonData[j].Project_Name.toUpperCase() == "FIELD") {
                                        tpAcctivtywithProjectName += "FIELD,";
                                    }
                                    else {
                                        tpAcctivtywithProjectName += "FIELD_RCPA,";
                                    }
                                    tpactivityName += dJsonData[j].Project_Name + ",";
                                    tpcategory += dJsonData[j].Category + ',';
                                    tpworkarea += dJsonData[j].Work_Area + ',';
                                    if (dJsonData[j].Acc1 != null && dJsonData[j].Acc1 != "") {
                                        tpaccName = dJsonData[j].Acc1 + ",";
                                    }
                                    if (dJsonData[j].Acc2 != null && dJsonData[j].Acc2 != "") {
                                        tpaccName += dJsonData[j].Acc2 + ",";
                                    }
                                    if (dJsonData[j].Acc3 != null && dJsonData[j].Acc3 != "") {
                                        tpaccName += dJsonData[j].Acc3 + ",";
                                    }
                                    if (dJsonData[j].Acc4 != null && dJsonData[j].Acc4 != "") {
                                        tpaccName += dJsonData[j].Acc4 + ",";
                                    }
                                }
                                else if (dJsonData[j].Project_Name.toUpperCase() == "ATTENDANCE") {
                                    tpAcctivtywithProjectName += "Attendance,";
                                    tpactivityName += dJsonData[j].Project_Name + " - " + dJsonData[j].Activity_Name + ",";
                                    tpcategory += dJsonData[j].Category + ',';
                                    tpworkarea += dJsonData[j].Work_Area + ',';
                                }
                                else if (dJsonData[j].Project_Name.toUpperCase() == "LEAVE") {
                                    tpAcctivtywithProjectName += "leave,";
                                    tpactivityName += dJsonData[j].Project_Name + " - " + dJsonData[j].Activity_Name + ",";
                                }
                                else if (dJsonData[j].Project_Name.toUpperCase() == "DCRLEAVE") {
                                    tpAcctivtywithProjectName += "Dcr leave,";
                                    tpactivityName += "Dcr leave,";
                                }
                                else if (dJsonData[j].Project_Name.toUpperCase() == "HOLIDAY") {
                                    tpAcctivtywithProjectName += "Holiday :" + dJsonData[j].Activity_Name + ",";
                                    tpactivityName += "Holiday :" + dJsonData[j].Activity_Name + ",";
                                }
                            }
                            else {

                                tpaccName = "-";
                                if (dJsonData[j].Project_Name.toUpperCase() == "HOLIDAY") {
                                    tpAcctivtywithProjectName += "Holiday :" + dJsonData[j].Activity_Name + ",";
                                    tpactivityName += "Holiday :" + dJsonData[j].Activity_Name + ",";
                                    tpholidayName = "HOLIDAY";
                                }
                                else if (tpactivityName == "Sunday,") {
                                    tpAcctivtywithProjectName = tpactivityName.slice(0, -1);
                                    tpactivityName = tpactivityName.slice(0, -1);
                                }

                                else {
                                    tpactivityName = "-";
                                }
                                tpcategory = "-";
                                tpworkarea = "-";
                            }
                        }
                        if (tpaccName != "" && tpaccName != "-") {
                            tpaccName = tpaccName.substring(0, tpaccName.length - 1);
                        }
                        if (tpactivityName != "" && tpactivityName != "-" && tpactivityName.toUpperCase() != "SUNDAY") {
                            tpactivityName = tpactivityName.substring(0, tpactivityName.length - 1);
                        }
                        if (tpAcctivtywithProjectName != "" && tpAcctivtywithProjectName != "-") {
                            tpAcctivtywithProjectName = tpAcctivtywithProjectName.substring(0, tpAcctivtywithProjectName.length - 1);
                        }
                        if (tpworkarea != "" && tpworkarea != "-") {
                            tpworkarea = tpworkarea.substring(0, tpworkarea.length - 1);
                        }
                        if (tpcategory != "" && tpcategory != "-") {
                            tpcategory = tpcategory.substring(0, tpcategory.length - 1);
                        }

                    }
                    else {

                        if (tpactivityName == "Sunday,") {
                            tpaccName = "-";
                            tpAcctivtywithProjectName = tpactivityName.slice(0, -1);
                            tpactivityName = tpactivityName.slice(0, -1);
                            tpcategory = "-";
                            tpworkarea = "-";

                        }
                        else {
                            tpaccName = "$";
                            tpactivityName = "$";
                            tpcategory = "$";
                            tpworkarea = "$";
                        }

                    }
                    tpDoctorCount = 0, dcrDoctorCount = 0;
                    tableContent += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                    tableContent += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].Region_Name + "</td>";
                    tableContent += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                    tableContent += "<td align='left' style='display:none'>" + jsData.Tables[0].Rows[0].Manager_Name + "</td>";

                    tableContent += "<td align='left'>" + date + "</td>";
                    if (tpStatus.toUpperCase() == 'APPLIED' || tpStatus.toUpperCase() == 'APPROVED' || tpStatus.toUpperCase() == 'UNAPPROVED' || tpStatus.toUpperCase() == 'DRAFTED') {
                        tableContent += "<td align='left'>" + tpactivityName + "</td>";
                        tableContent += "<td align='left'>" + tpcategory + "</td>";
                        tableContent += "<td align='left'>" + tpworkarea + "</td>";
                        tableContent += "<td align='left'>" + tpaccName + "</td>";
                    }
                    else {
                        if (tpactivityName.toUpperCase() == 'SUNDAY' || tpholidayName.toUpperCase() == "HOLIDAY") {
                            tableContent += "<td align='left'>" + tpactivityName + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' class='spndev'>" + tpactivityName + "</td>";
                        }
                        tableContent += "<td align='left' class='spndev'>" + tpcategory + "</td>";
                        tableContent += "<td align='left' class='spndev'>" + tpworkarea + "</td>";
                        tableContent += "<td align='left' class='spndev'>" + tpaccName + "</td>";
                    }
                    //Doctor Count for Each category      
                    for (var j = 0; j < jsData.Tables[2].Rows.length; j++) {
                        if (tpStatus.toUpperCase() == 'APPLIED' || tpStatus.toUpperCase() == 'APPROVED' || tpStatus.toUpperCase() == 'UNAPPROVED' || tpStatus.toUpperCase() == 'DRAFTED') {
                            if (tpStatus.toUpperCase() == "APPROVED") {
                                var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.DAY=='" + day + "' & @.Category =='" + jsData.Tables[2].Rows[j].Category_Code + "')]");
                                if (dJsonData != false) {
                                    tpDoctorCount = tpDoctorCount + parseInt(dJsonData.length);
                                    tableContent += "<td align='center'>" + dJsonData.length + "</td>";
                                }
                                else {
                                    tableContent += "<td align='center'>0<span class='spndev'>#<span></td>";
                                }
                            }
                            else {
                                tpDoctorCount = "-";
                                tableContent += "<td align='center'>-</td>";
                            }
                        }
                        else {
                            if (tpactivityName.toUpperCase() == "SUNDAY" || tpholidayName.toUpperCase() == "HOLIDAY") {
                                tpDoctorCount = "-";
                            }
                            else {
                                tpDoctorCount = "$";
                            }
                            if (tpDoctorCount == "$") {
                                tableContent += "<td align='center' class='spndev'>$</td>";
                            }
                            else {
                                tableContent += "<td align='center'>-</td>";
                            }
                        }
                    }

                    if (tpDoctorCount != "$") {
                        tableContent += "<td align='left'>" + tpDoctorCount + "</td>";
                    }
                    else if (tpDoctorCount == "-") {
                        tableContent += "<td align='left'>" + tpDoctorCount + "</td>";
                    }
                    else {
                        tableContent += "<td align='left' class='spndev'>" + tpDoctorCount + "</td>";
                    }
                    //DCR Section                   
                    var dJsonData = jsonPath(jsData, "$.Tables[5].Rows[?(@.DAY=='" + day + "')]");
                    var dcraccName = "", dcractivityName = "", dcrcategory = "", dcrworkarea = "", dcrStatus = "";


                    if (weekday[temp.getDay()] == "Sunday") {
                        dcractivityName = "Sunday,";
                    }
                    var showDcrstatus = "";
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            dcrStatus = dJsonData[j].DCR_Status;
                            if (dcrStatus.toUpperCase() == 'APPLIED' || dcrStatus.toUpperCase() == 'APPROVED') {
                                showDcrstatus += dcrStatus + ',';
                                if (dJsonData[j].Flag.toUpperCase() == "FIELD") {

                                    if (dJsonData[j].RCPA == "YES") {
                                        dcractivityName += "FIELD_RCPA,";
                                    }
                                    else {
                                        dcractivityName += "FIELD,";
                                    }
                                    dcrcategory += dJsonData[j].Category + ",";
                                    dcrworkarea += dJsonData[j].Place_Worked + ",";
                                    if (dJsonData[j].Acc1 != null && dJsonData[j].Acc1 != "") {
                                        dcraccName = dJsonData[j].Acc1 + ",";
                                    }
                                    if (dJsonData[j].Acc2 != null && dJsonData[j].Acc2 != "") {
                                        dcraccName += dJsonData[j].Acc2 + ",";
                                    }
                                    if (dJsonData[j].Acc3 != null && dJsonData[j].Acc3 != "") {
                                        dcraccName += dJsonData[j].Acc3 + ",";
                                    }
                                    if (dJsonData[j].Acc4 != null && dJsonData[j].Acc4 != "") {
                                        dcraccName += dJsonData[j].Acc4 + ",";
                                    }
                                }
                                else if (dJsonData[j].Flag.toUpperCase() == "ATTENDANCE") {
                                    dcractivityName += "Attendance,";
                                    dcrcategory += dJsonData[j].Category + ",";
                                    dcrworkarea += dJsonData[j].Place_Worked + ",";
                                }
                                else if (dJsonData[j].Flag.toUpperCase() == "LEAVE") {
                                    dcractivityName += "leave,";
                                }
                                //else if (dJsonData[j].Flag.toUpperCase() == "H") {
                                //    dcractivityName += "Holiday :" + dJsonData[j].Activity_Name + ",";
                                //}
                            }
                            else {                              
                                dcraccName = "-";
                                if (dcractivityName == "Sunday,") {
                                    dcractivityName = dcractivityName.slice(0, -1);
                                }
                                else if (dJsonData[j].Flag.toUpperCase() == "H") {
                                    dcractivityName += "Holiday :" + dJsonData[j].Activity_Name + ",";
                                }
                                else {
                                    dcractivityName = "-";
                                }
                                dcrcategory = "-";
                                dcrworkarea = "-";
                            }
                        }
                        if (dcraccName != "" && dcraccName != "-") {
                            dcraccName = dcraccName.substring(0, dcraccName.length - 1);
                        }
                        if (dcractivityName != "" && dcractivityName != "-" && dcractivityName.toUpperCase() != "SUNDAY") {
                            dcractivityName = dcractivityName.substring(0, dcractivityName.length - 1);
                        }

                        if (dcrworkarea != "" && dcrworkarea != "-") {
                            dcrworkarea = dcrworkarea.substring(0, dcrworkarea.length - 1);
                        }
                        if (dcrcategory != "" && dcrcategory != "-") {
                            dcrcategory = dcrcategory.substring(0, dcrcategory.length - 1);
                        }
                    }
                    else {
                        dcraccName = "-";
                        if (dcractivityName == "Sunday,") {
                            dcractivityName = dcractivityName.slice(0, -1);
                        }
                        else {
                            dcractivityName = "-";
                        }
                        dcrcategory = "-";
                        dcrworkarea = "-";
                    }
                    var status = showDcrstatus.slice(0, -1);
                    //DCR Status Added                     
                    tableContent += "<td align='center'>" + status + "</td>";
                    //Deviation
                    var tpActvity = tpAcctivtywithProjectName.split(',');
                    var tpandDCRacctivity = dcractivityName.split(',');
                    if (tpStatus.toUpperCase() == 'APPROVED') {
                        if (dcrStatus.toUpperCase() == 'APPLIED' || dcrStatus.toUpperCase() == 'APPROVED') {
                            if ((tpActvity.length == tpandDCRacctivity.length) || (tpActvity.length < tpandDCRacctivity.length)) {
                                for (var k = 0 ; k < tpActvity.length; k++) {
                                    if ($.inArray(tpActvity[k], tpandDCRacctivity) == 0) {
                                        tableContent += "<td align='left'>" + dcractivityName + "</td>";
                                        break;
                                    }
                                    else {
                                        tableContent += "<td align='left'>" + dcractivityName + "<span class='spnstar'>*</span></td>";
                                        break;
                                    }
                                }
                            }
                            else {
                                tableContent += "<td align='left'>" + dcractivityName + "<span class='spnstar'>*</span></td>";
                            }
                            if (dcractivityName.toUpperCase() != "LEAVE") {
                                var tpcat = tpcategory.split(',');
                                var tpwithdcrcategory = dcrcategory.split(',');
                                if ((tpcat.length == tpwithdcrcategory.length) || (tpcat.length < tpwithdcrcategory.length)) {
                                    for (var k = 0 ; k < tpcat.length; k++) {
                                        if ($.inArray(tpcat[k], tpwithdcrcategory) == 0) {
                                            tableContent += "<td align='left'>" + dcrcategory + "</td>";
                                            break;
                                        }
                                        else {
                                            tableContent += "<td align='left'>" + dcrcategory + "<span class='spnstar'>*</span></td>";
                                            break;
                                        }
                                    }
                                }
                                else {
                                    tableContent += "<td align='left'>" + tpwithdcrcategory + "<span class='spnstar'>*</span></td>";
                                }                              
                                var tpwork = tpworkarea.toUpperCase().split(',');
                                var tpwithdcrworkarea = dcrworkarea.toUpperCase().split(',');
                                if ((tpwork.length == tpwithdcrworkarea.length) || (tpwork.length < tpwithdcrworkarea.length)) {
                                    for (var k = 0 ; k < tpwork.length; k++) {
                                        if ($.inArray(tpwork[k], tpwithdcrworkarea) == 0) {
                                            tableContent += "<td align='left'>" + dcrworkarea + "</td>";
                                            break;
                                        }
                                        else {
                                            tableContent += "<td align='left'>" + dcrworkarea + "<span class='spnstar'>*</span></td>";
                                            break;
                                        }
                                    }
                                }
                                else {
                                    tableContent += "<td align='left'>" + tpwithdcrworkarea + "<span class='spnstar'>*</span></td>";
                                }
                                var tpacc = tpaccName.split(',');
                                var tpwithdcracc = dcraccName.split(',');
                                if ((tpacc.length == tpwithdcracc.length) || (tpacc.length < tpwithdcracc.length)) {
                                    for (var k = 0 ; k < tpacc.length; k++) {
                                        if ($.inArray(tpacc[k], tpwithdcracc) == 0) {
                                            tableContent += "<td align='left'>" + dcraccName + "</td>";
                                            break;
                                        }
                                        else {
                                            tableContent += "<td align='left'>" + dcraccName + "<span class='spnstar'>*</span></td>";
                                            break;
                                        }
                                    }
                                }
                                else {
                                    tableContent += "<td align='left'>" + tpwithdcracc + "<span class='spnstar'>*</span></td>";
                                }                                
                            }
                            else {
                                tableContent += "<td align='left'></td>";//Category
                                tableContent += "<td align='left'></td>";//Workarea
                                tableContent += "<td align='left'></td>";//AccName
                            }
                        }
                        else {
                            tableContent += "<td align='left'>" + dcractivityName + "</td>"; //Activity as per TP
                            if (dcractivityName.toUpperCase() != "LEAVE") {

                                tableContent += "<td align='left'>" + dcrcategory + "</td>"; // Category
                                tableContent += "<td align='left'>" + dcrworkarea + "</td>"; //Work Area
                                tableContent += "<td align='left'>" + dcraccName + "</td>"; //Accompanist Name
                            }
                            else {
                                tableContent += "<td align='left'></td>";//Category
                                tableContent += "<td align='left'></td>";//Workarea
                                tableContent += "<td align='left'></td>";//AccName
                            }
                        }
                    }
                    else {                  
                        tableContent += "<td align='left'>" + dcractivityName + "</td>"; //Activity as per TP
                        if (dcractivityName.toUpperCase() != "LEAVE") {

                            tableContent += "<td align='left'>" + dcrcategory + "</td>"; // Category
                            tableContent += "<td align='left'>" + dcrworkarea + "</td>"; //Work Area
                            tableContent += "<td align='left'>" + dcraccName + "</td>"; //Accompanist Name
                        }
                        else {
                            tableContent += "<td align='left'></td>";//Category
                            tableContent += "<td align='left'></td>";//Workarea
                            tableContent += "<td align='left'></td>";//AccName
                        }
                    }
                    //Newly Added                  
                    for (var j = 0; j < jsData.Tables[2].Rows.length; j++) {
                        if (dcrStatus.toUpperCase() == "APPLIED" || dcrStatus.toUpperCase() == "APPROVED") {
                            var dJsonTPData = jsonPath(jsData, "$.Tables[7].Rows[?(@.DAY=='" + day + "' & @.Category =='" + jsData.Tables[2].Rows[j].Category_Code + "')]");
                            var tpdoct = 0;
                            if (dJsonTPData != false) {
                                var dJsonData = jsonPath(dJsonTPData, "$.[?(@.DAY=='" + day + "' & @.Category =='" + jsData.Tables[2].Rows[j].Category_Code + "')]");
                                if (dJsonData != false) {
                                    dcrDoctorCount = dcrDoctorCount + parseInt(dJsonData.length);
                                    tableContent += "<td align='center'>" + dJsonData.length + "</td>";
                                }
                                else {
                                    dcrDoctorCount = dcrDoctorCount + parseInt(dJsonData.length);
                                    tableContent += "<td align='center'>" + dJsonData.length + "<span class='spnstar'>*</span></td>";
                                }
                                tpdoct++;
                            }
                            else {
                                var dJsonData = jsonPath(jsData, "$.Tables[7].Rows[?(@.DAY=='" + day + "' & @.Category =='" + jsData.Tables[2].Rows[j].Category_Code + "')]");
                                if (dJsonData != false && tpdoct == 0) {
                                    dcrDoctorCount = dcrDoctorCount + parseInt(dJsonData.length);
                                    tableContent += "<td align='center'>" + dJsonData.length + "</td>";                                    
                                }
                                else {
                                    tableContent += "<td align='center'>0</td>";
                                }
                            }

                        }
                        else {
                            tableContent += "<td align='center'>-</td>";
                            dcrDoctorCount = "-";
                        }
                    }
                    //Total Dr count category wise
                    tableContent += "<td align='center'>" + dcrDoctorCount + "</td>";
                    var dJsonData = jsonPath(jsData, "$.Tables[6].Rows[?(@.DAY=='" + day + "')]");
                    if (dJsonData != false) {
                        for (var index = 0; index < dJsonData.length; index++) {
                            if (dJsonData[index].DCR_Status.toUpperCase() == "APPLIED" || dJsonData[index].DCR_Status.toUpperCase() == "APPROVED") {
                                chemistPob = chemistPob + parseFloat(dJsonData[index].PO_Amount);
                                chemistMet = parseFloat(dJsonData.length);
                            }
                            else {
                                chemistPob = "-";
                                chemistMet = "-";
                            }
                        }
                        //chemistMet = parseFloat(dJsonData.length);
                    }
                    else {
                        chemistMet = "-";
                        chemistPob = "-";
                    }
                    tableContent += "<td align='center'>" + chemistMet + "</td>";
                    tableContent += "<td align='center'>" + chemistPob + "</td></tr>";
                }

                tableContent += "</tbody>";
                tableContent += "</table>";

                var jsonType = eval(type);
                $("#divSubReport").html(tableContent);

                $("#divsubPrint").html(tableContent);
                //$("#divPrint").html($("#divSubReport").html());
                if ($.fn.dataTable) {
                    $('#tblTPvsActualDeviation').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }

                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                //Legend Added
                tbllegend += "<lable style='font-weight:bold;'><span class='spnstar'>*</span>Values indicates a Deviation between Planned and Actuals</lable><br/>";
                tbllegend += "<lable style='font-weight:bold;'><span class='spnstar'>$</span>There is no TP for this date.</lable><br/>";
                tbllegend += "<lable style='font-weight:bold;'><span class='spnstar'>#</span>No doctors were saved in the TP for this date.</lable><br/>";
                $('#divImport').html(tbllegend);

                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
            }         
            fninializePrint("divsubPrint", "ifrmsubPrint", "divSubReport");
            HideModalPopup('dvloading');
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





/// fnGetDoctorCallAnalysis

function fnGetDoctorCallAnalysis() {

    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Doctor Call Analysis Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Doctor Call Analysis Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Doctor Call Analysis Report', 'Start date should be less than End Date.');
        HideModalPopup("dvloading");
        return false;

    }
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorCallAnalysis',
        data: 'regionCode=' + regionCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&reportViewType=' + reportViewType,
        success: function (response) {

            var type = response.split('^')[1]
            var jsonType = eval(type);

            $("#divReport").html(response.split('^')[0]);
            $("#divPrint").html(response.split('^')[0]);
            if ($.fn.dataTable) {
                $('#tblDoctorCallAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };

            if (response != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");

            }


            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup('dvloading');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}



function fnDoctorCallAnalysisPopup(val) {
    ShowModalPopup("dvloading");
    var startDate = val.split('_')[2];
    var endDate = val.split('_')[3];



    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorCallAnalysisPopup',
        data: 'regionCode=' + val.split('_')[0] + '&sd=' + startDate + '&ed=' + endDate + '&category=' + val.split('_')[4] + '&mode=' + val.split('_')[5],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var divisionName = "";
            $("#divModel").html('');
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>User Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].User_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Division Name</td>";
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
                tableContent += "<td align='left' width='15%'>Manager Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Employee Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                tableContent += "<td align='left' width='15%'>Date of Joining</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].DOJ + "</td>";
                tableContent += "<td align='left' width='15%'>Manager Territory Name</td>";
                tableContent += "<td align='left' width='15%'>" + jsData.Tables[0].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td align='left' width='15%'>Region Name</td>";
                tableContent += "<td align='left' width='15%' colspan='5'>" + jsData.Tables[0].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divHeaderPop").html(tableContent);
                tableContent = "";

                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorCallAnalysispop' >";
                tableContent += "<thead><tr>";
                tableContent += "<th align='left' >S.No</th>";
                tableContent += "<th style='display:none'>Region Name</th>";
                tableContent += "<th style='display:none'>User Name</th>";
                tableContent += "<th style='display:none'>Employee Name</th>";
                tableContent += "<th style='display:none'>Reporting To</th>";
                tableContent += "<th align='left' >Doctor Name</th>";
                tableContent += "<th align='left' >MDL No</th>";
                tableContent += "<th align='left' >Category</th>";
                tableContent += "<th align='left' >Speciality</th>";
                tableContent += "<th align='left' >Hospital Name</th>";
                tableContent += "<th align='left' >Hospital Claissification</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                var iRow = 0;
                if (val.split('_')[5] == "MASTER") {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                        iRow++;
                        tableContent += "<tr>";
                        tableContent += "<td align='left' width='15%'>" + iRow + "</td>";
                        tableContent += "<td style='display:none'>" + jsData.Tables[0].Rows[0].Region_Name + "  </td>";
                        tableContent += "<td style='display:none'>" + jsData.Tables[0].Rows[0].User_Name + " </td>";
                        tableContent += "<td style='display:none'> " + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                        tableContent += "<td style='display:none'> " + jsData.Tables[0].Rows[0].Manager_Name + "  </td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Customer_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].MDL_Number + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Category_Name + "</td>";
                        tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Speciality_Name + "</td>";
                        if (jsData.Tables[2].Rows[i].Hospital_Name != "" && jsData.Tables[2].Rows[i].Hospital_Name != null) {
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Hospital_Name + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        if (jsData.Tables[2].Rows[i].Hospital_Classification != "" && jsData.Tables[2].Rows[i].Hospital_Classification != null) {
                            tableContent += "<td align='left' width='15%'>" + jsData.Tables[2].Rows[i].Hospital_Classification + "</td>";
                        }
                        else {
                            tableContent += "<td align='left' width='15%'></td>";
                        }
                        tableContent += "</tr>";
                    }
                }
                else {
                    for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {
                        var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Customer_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "')]");
                        if (dJsonData != false) {
                            iRow++;
                            tableContent += "<tr>";
                            tableContent += "<td align='left' width='15%'>" + iRow + "</td>";
                            tableContent += "<td style='display:none'>" + jsData.Tables[0].Rows[0].Region_Name + "  </td>";
                            tableContent += "<td style='display:none'>" + jsData.Tables[0].Rows[0].User_Name + " </td>";
                            tableContent += "<td style='display:none'> " + jsData.Tables[0].Rows[0].Employee_Name + "</td>";
                            tableContent += "<td style='display:none'> " + jsData.Tables[0].Rows[0].Manager_Name + "  </td>";
                            tableContent += "<td align='left' width='15%'>" + dJsonData[0].Customer_Name + "</td>";
                            tableContent += "<td align='left' width='15%'>" + dJsonData[0].MDL_Number + "</td>";
                            tableContent += "<td align='left' width='15%'>" + dJsonData[0].Category_Name + "</td>";
                            tableContent += "<td align='left' width='15%'>" + dJsonData[0].Speciality_Name + "</td>";
                            if (dJsonData[0].Hospital_Name != "" && dJsonData[0].Hospital_Name != null) {
                                tableContent += "<td align='left' width='15%'>" + dJsonData[0].Hospital_Name + "</td>";
                            }
                            else {
                                tableContent += "<td align='left' width='15%'></td>";
                            }
                            if (dJsonData[0].Hospital_Classification != "" && dJsonData[0].Hospital_Classification != null) {
                                tableContent += "<td align='left' width='15%'>" + dJsonData[0].Hospital_Classification + "</td>";
                            }
                            else {
                                tableContent += "<td align='left' width='15%'></td>";
                            }
                            tableContent += "</tr>";
                        }
                    }
                }
                tableContent += "</tbody>";
                tableContent += "</table>";
            }
            $("#divModel").html(tableContent);
            $("#divsubPrint").html(tableContent);
            if ($.fn.dataTable) {
                $('#tblDoctorCallAnalysispop').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
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

function fnBindProductDetails() {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSaleProductsSS',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');
            var product = $("#ddlProductName");
            $('option', product).remove();
            $('#ddlProductName').append("<option value='0'>-Select Product-</option>");
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                $('#ddlProductName').append("<option value='" + jsData.Tables[0].Rows[i].Product_Code + "'>" + jsData.Tables[0].Rows[i].Product_Name + "</option>");
            }
            $("#ddlProductName").val('0');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

/// Speciality Name AND 

function fnBindCategoryAndSpeciality(regionCode) {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDivisionWiseCateorAndSpeciality',
        data: 'regionCode=' + regionCode,
        success: function (response) {
            jsData = eval('(' + response + ')');

            /// Bind Category
            var category = $("#ddlCategoryName");
            $('option', $("#ddlProductName")).remove();

            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $('#ddlCategoryName').append("<option value='" + jsData.Tables[0].Rows[i].Category_Code + "'>" + jsData.Tables[0].Rows[i].Category_Name + "</option>");
                }
            }
            $("#selectall").click(function () {
                $('.case').attr('checked', this.checked);
            });
            $("#ddlCategoryName").multiselect({
                noneSelectedText: 'Select Category',
                selectedList: 4
            }).multiselectfilter();

            //// Bind Speciality

            var speciality = $("#ddlSpecialityName");
            $('option', speciality).remove();
            if (jsData.Tables[1].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                    $('#ddlSpecialityName').append("<option value='" + jsData.Tables[1].Rows[i].Speciality_Code + "'>" + jsData.Tables[1].Rows[i].Speciality_Name + "</option>");
                }
            }
            $("#selectall").click(function () {
                $('.case').attr('checked', this.checked);
            });
            $("#ddlSpecialityName").multiselect({
                noneSelectedText: 'Select Speciality',
                selectedList: 4
            }).multiselectfilter();
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnCompetitorBrandAnalysis() {
    ShowModalPopup("dvloading");
    var dcrStatus = "", productCode = "";
    var regionCode = $('#hdnRegionCode').val();
    var dcrStatusArr = $('input:checkbox[name=DCRStatus]:checked');

    var startMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var startYear = $('#txtFrom').val().split('-')[1];
    var startDate = "", endDate = "";

    // GET DCR STATUS
    if ($(":checkbox[name=dcrStatusAll]:checked").length > 0) {
        dcrStatus = $("input:checkbox[name=dcrStatusAll]:checked").val();
    }
    else {
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) {
                dcrStatus += $(this).val();
            }
        });
    }

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Competitor Brand Analysis Report', 'Month & Year');
        HideModalPopup("dvloading");
        return false;

    }
    var days = daysInMonth(startMonth, startYear);
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
        endDate = startYear + "-0" + startMonth + "-" + days;
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
        endDate = startYear + "-0" + startMonth + "-" + days;
    }

    if (dcrStatus == "") {
        fnMsgAlert('info', 'Competitor Brand Analysis Report', 'Select atleast one dcr Status');
        HideModalPopup("dvloading");
        return false;
    }


    if ($("#ddlProductName").val() != "0") {
        productCode = $("#ddlProductName").val();
    }
    else {
        fnMsgAlert('info', 'Competitor Brand Analysis Report', 'Select Product Name');
        HideModalPopup("dvloading");
        return false;
    }


    var categoryCode = "";
    if ($("#ddlCategoryName").val() != null) {
        for (var index = 0; index < $("#ddlCategoryName").val().length; index++) {
            categoryCode += "" + $("#ddlCategoryName").val()[index] + "^";
        }
    }

    if (categoryCode == "") {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'Competitor Brand Analysis Report', 'Please select atleast category');
        return false;
    }

    var specialityCode = "";
    if ($("#ddlSpecialityName").val() != null) {
        for (var index = 0; index < $("#ddlSpecialityName").val().length; index++) {
            specialityCode += "" + $("#ddlSpecialityName").val()[index] + "^";
        }
    }

    if (specialityCode == "") {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'Competitor Brand Analysis Report', 'Please select atleast one Speciality');
        return false;
    }


    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetCompetitorBrandAnalysis',
        data: 'regionCode=' + regionCode + '&sd=' + startDate + '&ed=' + endDate + '&productCode=' + productCode + '&status=' + dcrStatus + '&speciality=' + specialityCode + '&category=' + categoryCode,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "", divisionName = "";
            $("#divReport").html('');
            var ownRCPA = 0, comRCPA = 0, otharRCPA = 0, totalRCPA = 0, totalOwnRCPA = 0;
            var totalRCPAValue = 0;
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent = "";

                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblCompetitorBrandAnalysis' >";
                tableContent += "<thead>";

                // HEADER 
                tableContent += "<tr style='display: none;' id='tblTr'>";
                tableContent += "<th align='left'>User Name</th>";
                tableContent += "<th align='left' >User Type Name</th>";
                tableContent += "<th align='left' >Territory Name</th>";
                tableContent += "<th align='left' >Employee Name</th>";
                tableContent += "<th align='left' >Division Name</th>";
                tableContent += "<th align='left' >Reporting manager</th>";
                tableContent += "<th align='left' >Reporting HQ</th>";
                tableContent += "<th align='left' >No Drs to be Covered</th>";
                tableContent += "<th align='left' >My Own Product RCPA Business(" + $('#ddlProductName :selected').text() + ")</th>";

                if (jsData.Tables[2].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                        tableContent += "<th align='left' >" + $('#ReportOption').val() + ")</th>";
                        tableContent += "<th align='left' >%</th>";
                    }
                }
                tableContent += "<th align='left' >" + $('#ReportOption').val() + ")</th>";
                tableContent += "<th align='left' >%</th>";
                tableContent += "<th align='left' >" + $('#ReportOption').val() + ")</th>";
                tableContent += "<th align='left' >%</th>";
                tableContent += "</tr>";

                // HEADER 
                tableContent += "<tr>";
                tableContent += "<th align='left' rowspan='2'>User Name</th>";
                tableContent += "<th align='left' rowspan='2'>User Type Name</th>";
                tableContent += "<th align='left' rowspan='2'>Territory Name</th>";
                tableContent += "<th align='left' rowspan='2'>Employee Name</th>";
                tableContent += "<th align='left' rowspan='2'>Division Name</th>";
                tableContent += "<th align='left' rowspan='2'>Reporting manager</th>";
                tableContent += "<th align='left' rowspan='2'>Reporting HQ</th>";
                tableContent += "<th align='left' rowspan='2'>No Drs to be Covered</th>";
                tableContent += "<th align='left' rowspan='2'>My Own Product RCPA Business (" + $('#ddlProductName :selected').text() + ")</th>";
                var iRow = 9;
                var type = '[{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "number-range" },{ type: "number-range" }';
                if (jsData.Tables[2].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                        iRow = iRow + 2;
                        type += ', { type: "number-range" }, { type: "number-range" }';
                        if (jsData.Tables[2].Rows[i].Competitor_Name != "" && jsData.Tables[2].Rows[i].Competitor_Name != null) {
                            tableContent += "<th align='left'  colspan='2'>" + jsData.Tables[2].Rows[i].Product_Name + " <br>(" + jsData.Tables[2].Rows[i].Competitor_Name + ")</th>";
                        }
                        else {
                            tableContent += "<th align='left'  colspan='2'>" + jsData.Tables[2].Rows[i].Product_Name + " <br>(No Company Mapped)</th>";
                        }
                    }
                }
                type += ', { type: "number-range" }, { type: "number-range" }';
                iRow = iRow + 2;
                tableContent += "<th align='left' colspan='2'>Others Competitor - Product</th>";
                iRow = iRow + 2;
                type += ', { type: "number-range" }, { type: "number-range" }]';
                tableContent += "<th align='left' colspan='2'>Total Competitor RCPA Business</th>";
                tableContent += "</tr>";

                tableContent += "<tr>";
                if (jsData.Tables[2].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                        tableContent += "<th style='text-align: center'  >" + jsData.Tables[2].Rows[i].Product_Name + " ( " + $('#ReportOption').val() + ")</th>";
                        tableContent += "<th style='text-align: center'  >" + jsData.Tables[2].Rows[i].Product_Name + " ( % )</th>";
                    }
                }
                tableContent += "<th style='text-align: center' > Others (" + $('#ReportOption').val() + ")</th>";
                tableContent += "<th style='text-align: center' >Others ( % )</th>";
                tableContent += "<th style='text-align: center' >Total (" + $('#ReportOption').val() + ")</th>";
                tableContent += "<th style='text-align: center' >Total ( % )</th>";
                tableContent += "</tr>";

                tableContent += "<tr >";
                tableContent += "<th colspan= '" + iRow + "' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";

                tableContent += "</thead>";
                tableContent += "<tbody>";

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    ownRCPA = 0, comRCPA = 0, totalRCPA = 0;
                    tableContent += "<tr>";
                    tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].User_Name + "</td>";
                    tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].User_Type_Name + "</td>";
                    tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Region_Name + "</td>";
                    tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Employee_Name + "</td>";
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
                        tableContent += "<td align='left'></td>";
                    }

                    tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Manager_Name + "</td>";
                    tableContent += "<td align='left' >" + jsData.Tables[0].Rows[i].Manager_Region_Name + "</td>";

                    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                    if (dJsonData != false) {
                        tableContent += "<td style='text-align:center' >" + dJsonData.length + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center' >0</td>";
                    }
                    var avg = 0.0;
                    ownRCPA = 0;
                    totalRCPAValue = 0;
                    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                    if (dJsonData != false) {
                        if ($('#ReportOption').val() == "Unit") {
                            for (var j = 0; j < dJsonData.length; j++) {
                                totalRCPAValue += parseInt(dJsonData[j].Support_Qty);
                                ownRCPA += parseInt(dJsonData[j].Support_Qty);
                            }
                        }
                        else {
                            for (var j = 0; j < dJsonData.length; j++) {
                                ownRCPA += parseInt(dJsonData[j].Price);
                                totalRCPAValue += parseInt(dJsonData[j].Price);
                            }
                        }
                        tableContent += "<td style='text-align:center'>" + ownRCPA + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center' >0</td>";
                    }

                    otharRCPA = 0;
                    var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "' & @.Competitor_Product_Code=='' | @.Competitor_Product_Code==null)]");
                    if (dJsonData != false) {
                        if ($('#ReportOption').val() == "Unit") {
                            for (var j = 0; j < dJsonData.length; j++) {
                                otharRCPA += parseInt(dJsonData[j].Support_Qty);
                                totalRCPA += parseInt(dJsonData[j].Support_Qty);
                                totalRCPAValue += parseInt(dJsonData[j].Support_Qty);
                            }
                        }
                        else {
                            for (var j = 0; j < dJsonData.length; j++) {
                                otharRCPA += parseInt(dJsonData[j].Price);
                                totalRCPA += parseInt(dJsonData[j].Price);
                                totalRCPAValue += parseInt(dJsonData[j].Price);
                            }
                        }
                    }
                    if (jsData.Tables[2].Rows.length > 0) {
                        for (var j = 0; j < jsData.Tables[2].Rows.length; j++) {
                            comRCPA = 0;
                            var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "' & @.Competitor_Product_Code=='" + jsData.Tables[2].Rows[j].Mapping_Product_Code + "')]");
                            if (dJsonData != false) {
                                if ($('#ReportOption').val() == "Unit") {
                                    for (var k = 0; k < dJsonData.length; k++) {
                                        comRCPA += parseInt(dJsonData[k].Support_Qty);
                                        totalRCPA += parseInt(dJsonData[k].Support_Qty);
                                        totalRCPAValue += parseInt(dJsonData[k].Support_Qty);
                                    }
                                }
                                else {
                                    for (var k = 0; k < dJsonData.length; k++) {
                                        comRCPA += parseInt(dJsonData[k].Price);
                                        totalRCPA += parseInt(dJsonData[k].Price);
                                        totalRCPAValue += parseInt(dJsonData[k].Price);
                                    }
                                }
                            }

                            tableContent += "<td style='text-align:center' >" + comRCPA + "</td>";
                            if (totalRCPAValue > 0 && comRCPA > 0) {
                                avg = (comRCPA / totalRCPAValue) * 100;
                                tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center' >0</td>";
                            }
                        }
                    }

                    tableContent += "<td style='text-align:center' >" + otharRCPA + "</td>";

                    if (otharRCPA > 0 && totalRCPAValue > 0) {
                        avg = (otharRCPA / totalRCPAValue) * 100;
                        tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center' >0</td>";
                    }

                    tableContent += "<td style='text-align:center'>" + totalRCPA + "</td>";
                    if (totalRCPAValue > 0 && totalRCPA > 0) {
                        avg = (totalRCPA / totalRCPAValue) * 100;
                        tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td></tr>";
                    }
                    else {
                        tableContent += "<td style='text-align:center' >0</td></tr>";
                    }
                }

                tableContent += "</tbody>";
                tableContent += "</table>";

                var jsonType = eval(type);
                $("#divReport").html(tableContent);
                $("#divPrint").html(tableContent);
                if ($.fn.dataTable) {
                    $('#tblCompetitorBrandAnalysis').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };

                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $("#dvTree").hide();
                    $("#spnTreeToggle").html('Show Tree');
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

function fnJoinedWorkAnalysis() {

    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();
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

    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({

        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetJoinedWorkAnalysis',
        data: 'regionCode=' + regionCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var accCount = 0, totalFieldCount = 0, totalAccUserCount = 0;
            var avg = 0.0, accAvg = 0.0;
            $("#divReport").html('');
            if (jsData.Tables[0].Rows.length > 0) {
                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblJoinedWorkAnalysis' >";
                tableContent += "<thead>";
                // HEADER 
                tableContent += "<tr style='display: none;' id='tblTr'>";
                tableContent += "<th align='left' >User Name</th>";
                tableContent += "<th align='left' >User Type Name</th>";
                tableContent += "<th align='left' >Territory Name</th>";
                tableContent += "<th align='left' >Employee Name</th>";
                tableContent += "<th align='left' >Total Days FW worked </th>";
                tableContent += "<th align='left' >No of Days Joined</th>";
                tableContent += "<th align='left' >Total Drs Met</th>";

                var type = '[{ type: "text" }, { type: "text" },{ type: "text" }, { type: "text" }, { type: "number-range" }, { type: "number-range" },{ type: "number-range" }';

                if (jsData.Tables[1].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                        type += ', { type: "number-range" }';
                        tableContent += "<th align='left'>Total " + jsData.Tables[1].Rows[i].Category_Name + " Dr Met</th>";
                    }
                }

                tableContent += "<th align='left' >Total Non Listed Drs</th>";
                tableContent += "<th align='left' >% Days Joined</th>";
                tableContent += "<th align='left' >Total Cal Avg</th>";
                tableContent += "<th align='left' >No Of Days DCR Submitted</th>";
                tableContent += "<th align='left' >No Of DCR's Approved</th>";
                type += ', { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';
                tableContent += "</tr>";


                tableContent += "<tr>";
                tableContent += "<th align='left' >User Name</th>";
                tableContent += "<th align='left' >User Type Name</th>";
                tableContent += "<th align='left' >Territory Name</th>";
                tableContent += "<th align='left' >Employee Name</th>";
                tableContent += "<th align='left' >Total Days FW worked </th>";
                tableContent += "<th align='left' >No of Days Joined</th>";
                tableContent += "<th align='left' >Total Drs Met</th>";
                var iRow = 7;
                if (jsData.Tables[1].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                        iRow++;
                        tableContent += "<th align='left'>Total " + jsData.Tables[1].Rows[i].Category_Name + " Dr Met</th>";
                    }
                }
                iRow = iRow + 5;
                tableContent += "<th align='left' >Total Non Listed Drs</th>";
                tableContent += "<th align='left' >% Days Joined</th>";
                tableContent += "<th align='left' >Total Cal Avg</th>";
                tableContent += "<th align='left' >No Of Days DCR Submitted</th>";
                tableContent += "<th align='left' >No Of DCR's Approved</th>";
                tableContent += "</tr>";

                tableContent += "<tr >";
                tableContent += "<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";

                tableContent += "</thead>";
                tableContent += "<tbody>";

                if (jsData.Tables[0].Rows.length > 0) {
                    for (var i = 1; i < jsData.Tables[0].Rows.length; i++) {

                        accCount = 0;
                        tableContent += "<tr>";
                        //User Name
                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].User_Name + "</td>";
                        // User Type Name
                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].User_Type_Name + "</td>";
                        //Territory Name
                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Region_Name + "</td>";
                        //employee 
                        tableContent += "<td align='left'>" + jsData.Tables[0].Rows[i].Employee_Name + "</td>";
                        totalFieldCount = 0;
                        //Total Days FW worked
                        if (jsData.Tables[2].Rows.length > 0) {
                            tableContent += "<td style='text-align:center'>" + jsData.Tables[2].Rows.length + "</td>";
                            totalFieldCount = parseInt(jsData.Tables[2].Rows.length);
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }
                        accAvg = 0.0;
                        if (jsData.Tables[2].Rows.length > 0) {
                            for (j = 0; j < jsData.Tables[2].Rows.length; j++) {
                                totalAccUserCount = 0;
                                accCount = 0;
                                if (jsData.Tables[2].Rows[j].Acc1 != null && jsData.Tables[2].Rows[j].Acc1 != "") {
                                    if (jsData.Tables[2].Rows[j].Acc1 == jsData.Tables[0].Rows[i].User_Name) {
                                        accCount++;
                                    }
                                    totalAccUserCount++;
                                }
                                if (jsData.Tables[2].Rows[j].Acc2 != null && jsData.Tables[2].Rows[j].Acc2 != "") {
                                    if (jsData.Tables[2].Rows[j].Acc2 == jsData.Tables[0].Rows[i].User_Name) {
                                        accCount++;
                                    }
                                    totalAccUserCount++;
                                }
                                if (jsData.Tables[2].Rows[j].Acc3 != null && jsData.Tables[2].Rows[j].Acc3 != "") {
                                    if (jsData.Tables[2].Rows[j].Acc3 == jsData.Tables[0].Rows[i].User_Name) {
                                        accCount++;
                                    }
                                    totalAccUserCount++;
                                }
                                if (jsData.Tables[2].Rows[j].Acc4 != null && jsData.Tables[2].Rows[j].Acc4 != "") {
                                    if (jsData.Tables[2].Rows[j].Acc4 == jsData.Tables[0].Rows[i].User_Name) {
                                        accCount++;
                                    }
                                    totalAccUserCount++;
                                }

                                if (accCount > 0) {

                                    if (totalAccUserCount == 1) {
                                        accAvg += 1;
                                    }
                                    else if (totalAccUserCount == 2) {
                                        accAvg += 0.5;
                                    }
                                    else if (totalAccUserCount == 3) {
                                        accAvg += 0.33;
                                    }
                                    else if (totalAccUserCount == 4) {
                                        accAvg += 0.25;
                                    }
                                }
                            }

                        }
                        if (accAvg != 0.0) {
                            tableContent += "<td style='text-align:center'>" + Math.round(accAvg * 100) / 100 + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }

                        // Acc Total Doctor Visit

                        var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.AccDoc=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        if (dJsonData != false) {
                            tableContent += "<td style='text-align:center'>" + dJsonData.length + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }


                        if (jsData.Tables[1].Rows.length > 0) {
                            for (var j = 0; j < jsData.Tables[1].Rows.length; j++) {
                                var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.AccDoc=='" + jsData.Tables[0].Rows[i].Region_Code + "' & @.Category =='" + jsData.Tables[1].Rows[j].Category_Code + "')]");
                                if (dJsonData != false) {
                                    tableContent += "<td style='text-align:center'>" + dJsonData.length + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center'>0</td>";
                                }
                            }
                        }

                        // Un listed doctor
                        var dJsonData = jsonPath(jsData, "$.Tables[5].Rows[?(@.Acc1=='" + jsData.Tables[0].Rows[i].User_Name + "' | @.Acc2=='" + jsData.Tables[0].Rows[i].User_Name + "' | @.Acc3=='" + jsData.Tables[0].Rows[i].User_Name + "' | @.Acc4=='" + jsData.Tables[0].Rows[i].User_Name + "')]");
                        if (dJsonData != false) {
                            tableContent += "<td style='text-align:center'>" + dJsonData.length + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }

                        if (totalFieldCount > 0) {
                            avg = (parseFloat(accAvg) / totalFieldCount) * 100;
                            tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }

                        // Total Cal Avg

                        var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.AccDoc=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        if (dJsonData != false) {
                            if (accAvg != 0.0) {
                                avg = parseFloat(dJsonData.length) / accAvg;
                                tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center'>0</td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }
                        // No Of Days DCR Submitted
                        var dJsonData = jsonPath(jsData, "$.Tables[6].Rows[?(@.UserCode=='" + jsData.Tables[0].Rows[i].User_Code + "' & @.Status =='APPLIED')]");
                        if (dJsonData != false) {
                            tableContent += "<td style='text-align:center'>" + dJsonData.length + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }
                        //No Of DCR's approved
                        var dJsonData = jsonPath(jsData, "$.Tables[6].Rows[?(@.UserCode=='" + jsData.Tables[0].Rows[i].User_Code + "' & @.Status =='APPROVED')]");
                        if (dJsonData != false) {
                            tableContent += "<td style='text-align:center'>" + dJsonData.length + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }
                        tableContent += "</tr>";
                    }
                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                var jsonType = eval(type);

                $("#divReport").html(tableContent);
                $("#divPrint").html(tableContent);
                if ($.fn.dataTable) {
                    $('#tblJoinedWorkAnalysis').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                HideModalPopup('dvloading');
                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");

                }
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


function fnDoctorYearlyVisitAnalysisReport() {
    $('#regiontree').hide();
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');
    $("#spnTreeToggle").html('Show Tree');
    ShowModalPopup("dvloading");
    var nodeVal = $('#hdnRegionCode').val();
    var fromDate = "", dcrStatus = "";
    var toDate = "";
    var startDate = "", endDate = "";
    var selectionType = "S";

    var startMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtTo').val().split('-')[0]);
    var startYear = $('#txtFrom').val().split('-')[1];
    var endYear = $('#txtTo').val().split('-')[1];

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Doctor Yearly Visit Analysis Report', 'Select from month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtTo").val() == "") {
        fnMsgAlert('info', 'Doctor Yearly Visit Analysis Report', 'Select to month.');
        HideModalPopup("dvloading");
        return false;
    }

    var days = daysInMonth(endMonth, endYear);
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }

    endDate = endYear + "-" + endMonth + "-" + days;

    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);


    if (dt1 > dt2) {
        fnMsgAlert('info', 'Doctor Yearly Visit Analysis Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }

    var dcrStatusArr = $('input:checkbox[name=dcrStatus]:checked');
    for (var intLoop = 0; intLoop < dcrStatusArr.length; intLoop++) {
        dcrStatus += dcrStatusArr[intLoop].value + ",";
        if (dcrStatusArr[intLoop].value.length > 4) {
            dcrStatus = dcrStatusArr[intLoop].value + ",";
            break;
        }
    }

    if (dcrStatus != "") {
        dcrStatus = dcrStatus;
    }
    else {
        fnMsgAlert('info', 'Doctor Yearly Visit Analysis Report', 'Select atleast one dcr Status.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($('#trMode').is(':visible')) {
        selectionType = $('input:radio[name=mode]:checked').val()
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorYearlyVisitAnalysisReport',
        data: 'regionCode=' + nodeVal.split('_')[0] + '&sd=' + startDate + '&ed=' + endDate + '&status=' + dcrStatus + "&title=" + $('#divPageHeader').html() + '&selectionType=' + selectionType,
        success: function (response) {
            var tableContent = "";
            $("#divReport").html('');
            $("#divReportHeader").html('');
            $("#divReportHeader").html(response.split('@')[0]);
            $("#divReport").html(response.split('@')[1]);
            $("#divPrint").html(response.split('@')[0] + response.split('@')[1]);
            var type = response.split('@')[2];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $('#DoctorYearlyVisitAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };

            if (tableContent != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
            }
            HideModalPopup("dvloading");

            fninializePrint("divPrint", "ifrmPrint", "divReport");

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

function fnGetWeekendDetails() {
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'TP VS Actual Deviation Details Report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }

    var regionCode = $('#hdnRegionCode').val();

    var selectedMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var selectedYear = $('#txtFromDate').val().split('-')[1];
    var days = daysInMonth(selectedMonth, selectedYear);

    var startdate = selectedYear + "-" + selectedMonth + "-" + "01";
    var endDate = selectedYear + "-" + selectedMonth + "-" + days;

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/Reports/GetWeekendDays',
        data: "fromDate=" + startdate + "&toDate=" + endDate + "&regionCode=" + regionCode,
        success: function (response) {
            if (response != '') {
                weekenddays_g = response;
                fnGetTPvsActualDeviationDetails();
            }
            else {
                fnGetTPvsActualDeviationDetails();
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

