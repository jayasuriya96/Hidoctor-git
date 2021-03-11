// Bind Campaign name
function fnBindCampaignName(userCode) {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetCompaignName',
        data: 'userCode=' + userCode,
        success: function (response) {
            jsData = eval('(' + response + ')');
            $('option', $("#ddlCompaignName")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                $('#ddlCompaignName').append("<option value='0'>-Select Campaign Name-</option>");
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlCompaignName").append("<option value='" + jsData.Tables[0].Rows[i].Campaign_Code + "'>" + jsData.Tables[0].Rows[i].Campaign_Name + "</option>");
                }
                $("#ddlCompaignName").val('0');
            }
            else {
                fnMsgAlert('info', 'Report', 'No Campaign found for this user.');
                HideModalPopup("dvloading");
                $("#divInput").hide();

                return false;
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
            return false;
        }
    });

}

function fnMarketingCampaignTracker() {


    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Marketing Campaign Tracker Report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Marketing Campaign Tracker Report', 'Please enter End month.');
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
        fnMsgAlert('info', 'Marketing Campaign Tracker Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#ddlCompaignName").val() == "0") {
        fnMsgAlert('info', 'Marketing Campaign Visit Details', 'Please select campaign.');
        $("#ddlCompaignName").focus();
        HideModalPopup("dvloading");
        return false;
    }

    fnMarketingCampaignTrackerReport($("#ddlCompaignName").val(), $("#hdnTrackerUserCode").val(), startDate, endDate)

}


function fnMarketingCampaignTrackerReport(campaignCode, userCode, startDate, endDate) {

    ShowModalPopup("dvloading");
    var monthList = new Array();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (startDate != "" && startDate != null) {
        var d = new Date(startDate.split('-')[0] + "/" + startDate.split('-')[1] + "/" + startDate.split('-')[2]);
        var diffMonth = monthDiff(startDate.split('-')[0] + "/" + startDate.split('-')[1] + "/10", endDate.split('-')[0] + "/" + endDate.split('-')[1] + "/" + endDate.split('-')[2]);
        var currentmonth = d.getMonth();
        for (var index = 0; index < parseInt(diffMonth) ; index++) {
            monthList.push(monthNames[currentmonth] + "-" + (d.getMonth() + 1) + "-" + d.getFullYear());
            d.setMonth(d.getMonth() + 1);
            currentmonth = d.getMonth();
        }
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetMarketingCampaignTraker',
        data: 'compaignCode=' + campaignCode + '&userCode=' + userCode + '&sd=' + startDate + '&ed=' + endDate,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "", tableContentSub = "", printHeader = "";
            var alCampaignMonth = new Array();
            var tableSub = "";
            var comBrandValue = 0.0, ownBrandValue = 0.0;
            var totalComValue = 0.0, totalOwnBrandValue = 0.0;
            var totalROIComValue = 0.0, totalROIOwnBrandValue = 0.0;

            if (jsData.Tables[0].Rows.length > 0) {

                if (jsData.Tables[2].Rows[0].Start_Date != null && jsData.Tables[2].Rows[0].Start_Date != "") {
                    var FromDateArr = jsData.Tables[2].Rows[0].Start_Date.split('/');
                    var ToDateArr = jsData.Tables[2].Rows[0].End_Date.split('/');
                    var diffMonth = monthDiff(FromDateArr[2] + "/" + FromDateArr[1] + "/10", ToDateArr[2] + "/" + ToDateArr[1] + "/" + ToDateArr[0]);
                    var dd = new Date(FromDateArr[2] + "/" + FromDateArr[1] + "/" + FromDateArr[0]);
                    var current_month = dd.getMonth();
                    for (var k = 0; k < parseInt(diffMonth) ; k++) {
                        alCampaignMonth.push(monthNames[current_month] + "-" + (current_month + 1) + "-" + dd.getFullYear());
                        dd.setMonth(dd.getMonth() + 1);
                        current_month = dd.getMonth();
                    }
                }

                var headerContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblCampaignHeader' class='data display datatable' >";
                tableContent += "<thead>";
                tableContent += "<tr><td style='text-align:left'> Marketing Campaign Name</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Campaign_Name + "</td></tr>";
                tableContent += "</thead>";
                tableContent += "<tbody>";
                tableContent += "<tr><td style='text-align:left'> Campaign Period </td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Start_Date + " - " + jsData.Tables[2].Rows[0].End_Date + "</td></tr>";
                if (jsData.Tables[2].Rows[0].Cycle_Name != null && jsData.Tables[2].Rows[0].Cycle_Name != "") {
                    tableContent += "<tr><td style='text-align:left'> Cycle Name </td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Cycle_Name + "</td></tr>";
                }
                else {
                    tableContent += "<tr><td style='text-align:left'> Cycle Name </td><td style='text-align:left' ></td></tr>";
                }
                tableContent += "<tr><td style='text-align:left'>Customer Category</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Customer_Category.slice(0, -2) + "</td></tr>";
                tableContent += "<tr><td style='text-align:left'> Speciality Name</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Customer_Speciality.slice(0, -2) + "</td></tr>";
                tableContent += "<tr><td style='text-align:left'> Customer Count</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Customer_Count + "</td></tr>";
                tableContent += "<tr><td style='text-align:left'> Created Date</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Created_Date + "</td></tr>";
                tableContent += "<tr><td style='text-align:left'> No of Months MC Planned</td><td style='text-align:left' >" + alCampaignMonth.length + "</td></tr>";
                tableContent += "<tr><td style='text-align:left'> No of Product Mapped</td>";
                tableContent += "<td onclick='fnMarketingCampaignTrackerView(\"" + campaignCode + "\")' style='text-decoration:underline;cursor:pointer;text-align:left'>" + jsData.Tables[2].Rows[0].Brand_Count + "</td></tr>";
                tableContent += "</tbody></table>";
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
                printHeader += tableContent;
                $("#divTrackerHeader").html(tableContent);
                printHeader = tableContent;
                tableContent = "";
                tableSub = "";

                tableContentHeader = "";

                tableContent = "<table cellspacing='0' cellpadding='0' width='100%' id='tblCampaignDetailReport' class='data display datatable' >";
                tableContent += "<thead>";
                tableContentHeader += "<tr>";
                tableContentHeader += "<th style='text-align:left' rowspan='2'> Doctor Region Name</th>";
                tableContentHeader += "<th style='text-align:left' rowspan='2'> Doctor Name</th>";
                tableContentHeader += "<th style='text-align:left' rowspan='2'> MDL No</th>";
                tableContentHeader += "<th style='text-align:left' rowspan='2'> Speciality Name</th>";
                tableContentHeader += "<th style='text-align:left' rowspan='2'> Category</th>";
                tableContentHeader += "<th style='text-align:left' rowspan='2'> Other Campaigns Targeted</th>";
                tableContentHeader += "<th style='text-align:left' rowspan='2'> Doctor Product Mapping </th>";
                //tableContentHeader += "<th style='text-align:left' rowspan='2'> Products targeted for this Campaign</th>";

                headerContent = "<tr>";
                headerContent += "<th style='text-align:left' > Doctor Region Name</th>";
                headerContent += "<th style='text-align:left' > Doctor Name</th>";
                headerContent += "<th style='text-align:left' > MDL No</th>";
                headerContent += "<th style='text-align:left' > Speciality Name</th>";
                headerContent += "<th style='text-align:left' > Category</th>";
                headerContent += "<th style='text-align:left' > Other Campaigns Targeted</th>";
                headerContent += "<th style='text-align:left' > Doctor Product Mapping </th>";
                // headerContent += "<th style='text-align:left' > Products targeted for this Campaign</th>";

                var type = '[{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }';


                tableContentSub = "<tr>";
                for (var i = 0; i < alCampaignMonth.length; i++) {
                    tableContentHeader += "<th style='text-align:left' colspan='2'> Marketing Campaign '" + alCampaignMonth[i].split('-')[0] + " - " + alCampaignMonth[i].split('-')[2] + "' visits</th>";
                    tableContentSub += "<th style='text-align:left' >My visits</th>";
                    tableContentSub += "<th style='text-align:left' >Reporting Manager Visits</th>";


                    headerContent += "<th style='text-align:left' >My visits</th>";
                    headerContent += "<th style='text-align:left' >Reporting Manager Visits</th>";
                    type += ',{ type: "text" },{ type: "text" }';
                }

                for (var i = 0; i < alCampaignMonth.length; i++) {
                    tableContentHeader += "<th style='text-align:left' colspan='2'> Marketing Campaign '" + alCampaignMonth[i].split('-')[0] + " - " + alCampaignMonth[i].split('-')[2] + "'</th>";
                    tableContentSub += "<th style='text-align:left' >My Brand  Value</th>";
                    tableContentSub += "<th style='text-align:left' >Competitor Brand Value</th>";


                    headerContent += "<th style='text-align:left' >My Brand  Value</th>";
                    headerContent += "<th style='text-align:left' >Competitor Brand Value</th>";
                    type += ',{ type: "number-range" },{ type: "number-range" }';
                }
                tableContentHeader += "<th style='text-align:left' colspan='2'> Total Return On Investment - MC Period</th>";
                tableContentSub += "<th style='text-align:left' >My Brand  Value</th>";
                tableContentSub += "<th style='text-align:left' >Competitor Brand Value</th>";

                headerContent += "<th style='text-align:left' >My Brand  Value</th>";
                headerContent += "<th style='text-align:left' >Competitor Brand Value</th>";
                type += ',{ type: "number-range" },{ type: "number-range" }';

                if (startDate != "" && startDate != null) {
                    for (var i = 0; i < monthList.length; i++) {
                        tableContentHeader += "<th style='text-align:left' colspan='2'> Return On Investment '" + monthList[i].split('-')[0] + " - " + monthList[i].split('-')[2] + "' </th>";
                        tableContentSub += "<th style='text-align:left' >My Brand  Value</th>";
                        tableContentSub += "<th style='text-align:left' >Competitor Brand Value</th>";

                        headerContent += "<th style='text-align:left' >My Brand  Value</th>";
                        headerContent += "<th style='text-align:left' >Competitor Brand Value</th>";
                        type += ',{ type: "number-range" },{ type: "number-range" }';
                    }
                    tableContentHeader += "<th style='text-align:left' colspan='2'> Total Return On Investment</th></tr>";

                    tableContentSub += "<th style='text-align:left' >My Brand  Value</th>";
                    tableContentSub += "<th style='text-align:left' >Competitor Brand Value</th></tr>";

                    headerContent += "<th style='text-align:left' >My Brand  Value</th>";
                    headerContent += "<th style='text-align:left' >Competitor Brand Value</th></tr>";
                    type += ',{ type: "number-range" },{ type: "number-range" }]';
                }
                else {
                    type += ']';
                }

                tableContent += headerContent;
                tableContent += tableContentHeader;
                tableContent += tableContentSub;

                // tableContent + headerContent;
                tableContent += "</thead>";
                tableContent += "<tbody>";
                for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {
                    tableContent += "<tr>";
                    tableContent += "<td style='text-align:left'> " + jsData.Tables[3].Rows[i].Region_Name + "</td>";
                    //   tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[3].Rows[i]["Region_Code"] + "_" + jsData.Tables[3].Rows[i].Customer_Code + "_" + jsData.Tables[3].Rows[i]["User_Code"] + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[3].Rows[i].Customer_Name + "</span></td>"
                    tableContent += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[3].Rows[i].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[3].Rows[i].Customer_Name + "</span></td>"
                    // tableContent += "<td style='text-align:left'> " + jsData.Tables[3].Rows[i].Customer_Name + "</td>";
                    tableContent += "<td style='text-align:left'> " + jsData.Tables[3].Rows[i].MDL + "</td>";
                    tableContent += "<td style='text-align:left'> " + jsData.Tables[3].Rows[i].Speciality_Name + "</td>";
                    tableContent += "<td style='text-align:left'> " + jsData.Tables[3].Rows[i].Category_Name + "</td>";

                    //Other Campaigns Targeted
                    tableSub = "";
                    var dJsonDataH = jsonPath(jsData, "$.Tables[6].Rows[?(@.Customer_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "')]");
                    if (dJsonDataH != false) {
                        if (dJsonDataH.length > 0) {
                            tableSub = "<table>";
                            for (var index = 0; index < dJsonDataH.length ; index++) {
                                tableSub += "<tr><td >" + dJsonDataH[index].Campaign_Name + "</td></tr>";
                            }
                            tableSub += "</table>";
                        }
                    }
                    tableContent += "<td style='text-align:center'>" + tableSub + "</td>";
                    tableSub = "";


                    //Doctor Product Mapping - Focus Products for the Doctor from Doctor product mapping not campigan specify
                    var otherMapProd = jsonPath(jsData, "$.Tables[4].Rows[?(@.Customer_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "')]");

                    if (otherMapProd != false && otherMapProd !== undefined && otherMapProd.length > 0) {
                        tableContent += "<td>";
                        for (var w = 0; w < jsData.Tables[12].Rows.length; w++) {
                            var unMappedCamp = jsonPath(otherMapProd, "$.[?(@.Product_Code=='" + jsData.Tables[12].Rows[w]["Product_Code"] + "')]");
                            if (unMappedCamp == false || unMappedCamp === undefined) {
                                tableContent += "<span style='color:red !important;'>" + jsData.Tables[12].Rows[w]["Sale_Product"] + "</span>,<br />";
                            }
                        }
                        for (var l = 0; l < otherMapProd.length; l++) {
                            tableContent += otherMapProd[l].Product_Name;
                            if (otherMapProd.length > 1 && (otherMapProd.length - 1) != l) {
                                tableContent += ",<br />";
                            }
                        }
                        tableContent += "</td>";
                    }
                    else {
                        tableContent += "<td>";
                        for (var w = 0; w < jsData.Tables[12].Rows.length; w++) {
                            tableContent += "<span style='color:red !important;'>" + jsData.Tables[12].Rows[w]["Sale_Product"] + "</span>";
                            if (jsData.Tables[12].Rows.length > 1 && (jsData.Tables[12].Rows.length - 1) != w) {
                                tableContent += ",<br />";
                            }
                        }
                        tableContent += "</td>";
                    }

                    ////Products targeted for this Campaign
                    //var dJsonDataH = jsonPath(jsData, "$.Tables[5].Rows[?(@.Customer_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "')]");
                    //if (dJsonDataH != false) {
                    //    if (dJsonDataH.length > 0) {
                    //        tableSub = "<table>";
                    //        for (var index = 0; index < dJsonDataH.length ; index++) {

                    //            tableSub += "<tr><td >" + dJsonDataH[index].Product_Name + "</td></tr>";
                    //        }
                    //        tableSub += "</table>";
                    //    }
                    //}
                    //tableContent += "<td style='text-align:center'>" + tableSub + "</td>";
                    //tableSub = "";

                    for (var j = 0; j < alCampaignMonth.length; j++) {

                        var dJsonDataM = jsonPath(jsData, "$.Tables[7].Rows[?(@.Customer_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "' & @.User_Code=='" + jsData.Tables[0].Rows[0].User_Code + "' & @.Month=='" + alCampaignMonth[j].split('-')[1] + "' & @.Year=='" + alCampaignMonth[j].split('-')[2] + "')]");
                        if (dJsonDataM != false) {
                            if (dJsonDataM[0].DAYS != null && dJsonDataM[0].DAYS != "") {
                                tableContent += "<td style='text-align:center'>" + dJsonDataM[0].DAYS + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center'></td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center'></td>";
                        }

                        var dJsonDataM = jsonPath(jsData, "$.Tables[7].Rows[?(@.Customer_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "' & @.User_Code !='" + jsData.Tables[0].Rows[0].User_Code + "' & @.Month=='" + alCampaignMonth[j].split('-')[1] + "' & @.Year=='" + alCampaignMonth[j].split('-')[2] + "')]");
                        if (dJsonDataM != false) {
                            if (dJsonDataM[0].DAYS != null && dJsonDataM[0].DAYS != "") {
                                tableContent += "<td style='text-align:center'>" + dJsonDataM[0].DAYS + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center'></td>";
                            }
                        }
                        else {
                            tableContent += "<td style='text-align:center'></td>";
                        }
                    }
                    totalOwnBrandValue = 0.0;
                    totalComValue = 0.0;
                    for (var j = 0; j < alCampaignMonth.length; j++) {
                        ownBrandValue = 0.0
                        comBrandValue = 0.0;
                        var dJsonDataRCPA = jsonPath(jsData, "$.Tables[8].Rows[?(@.Doctor_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "' & @.User_Code=='" + jsData.Tables[0].Rows[0].User_Code + "' & @.Month=='" + alCampaignMonth[j].split('-')[1] + "' & @.Year=='" + alCampaignMonth[j].split('-')[2] + "')]");
                        if (dJsonDataRCPA != false) {
                            for (var index = 0; index < dJsonDataRCPA.length ; index++) {
                                ownBrandValue += parseFloat(dJsonDataRCPA[index].Price);
                                totalOwnBrandValue += parseFloat(dJsonDataRCPA[index].Price);
                            }
                        }
                        if (ownBrandValue != 0.0) {
                            tableContent += "<td style='text-align:center'>" + Math.round(ownBrandValue * 100) / 100 + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'></td>";
                        }
                        var dJsonDataRCPA = jsonPath(jsData, "$.Tables[9].Rows[?(@.Doctor_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "' & @.User_Code=='" + jsData.Tables[0].Rows[0].User_Code + "' & @.Month=='" + alCampaignMonth[j].split('-')[1] + "' & @.Year=='" + alCampaignMonth[j].split('-')[2] + "')]");
                        if (dJsonDataRCPA != false) {
                            for (var index = 0; index < dJsonDataRCPA.length ; index++) {
                                comBrandValue += parseFloat(dJsonDataRCPA[index].Price);
                                totalComValue += parseFloat(dJsonDataRCPA[index].Price);
                            }
                        }
                        if (comBrandValue != 0.0) {
                            tableContent += "<td style='text-align:center'>" + Math.round(comBrandValue * 100) / 100 + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'></td>";
                        }
                    }
                    if (totalOwnBrandValue != 0.0) {
                        tableContent += "<td style='text-align:center'>" + Math.round(totalOwnBrandValue * 100) / 100 + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center'></td>";
                    }

                    if (totalComValue != 0.0) {
                        tableContent += "<td style='text-align:center'>" + Math.round(totalComValue * 100) / 100 + "</td>";
                    }
                    else {
                        tableContent += "<td style='text-align:center'></td>";
                    }
                    totalROIComValue = 0.0;
                    totalROIOwnBrandValue = 0.0;
                    if (startDate != "" && startDate != null) {
                        for (var j = 0; j < monthList.length; j++) {

                            ownBrandValue = 0.0
                            comBrandValue = 0.0;
                            var dJsonDataRCPA = jsonPath(jsData, "$.Tables[8].Rows[?(@.Doctor_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "' & @.User_Code=='" + jsData.Tables[0].Rows[0].User_Code + "' & @.Month=='" + monthList[j].split('-')[1] + "' & @.Year=='" + monthList[j].split('-')[2] + "')]");
                            if (dJsonDataRCPA != false) {
                                for (var index = 0; index < dJsonDataRCPA.length ; index++) {
                                    ownBrandValue += parseFloat(dJsonDataRCPA[index].Price);
                                    totalROIOwnBrandValue += parseFloat(dJsonDataRCPA[index].Price);
                                }
                            }

                            if (ownBrandValue != 0.0) {
                                tableContent += "<td style='text-align:center'>" + Math.round(ownBrandValue * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center'></td>";
                            }
                            var dJsonDataRCPA = jsonPath(jsData, "$.Tables[9].Rows[?(@.Doctor_Code=='" + jsData.Tables[3].Rows[i].Customer_Code + "' & @.User_Code=='" + jsData.Tables[0].Rows[0].User_Code + "' & @.Month=='" + monthList[j].split('-')[1] + "' & @.Year=='" + monthList[j].split('-')[2] + "')]");
                            if (dJsonDataRCPA != false) {
                                for (var index = 0; index < dJsonDataRCPA.length ; index++) {
                                    comBrandValue += parseFloat(dJsonDataRCPA[index].Price);
                                    totalROIComValue += parseFloat(dJsonDataRCPA[index].Price);
                                }
                            }
                            if (comBrandValue != 0.0) {
                                tableContent += "<td style='text-align:center'>" + Math.round(comBrandValue * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center'></td>";
                            }

                        }

                        if (totalROIOwnBrandValue != 0.0) {
                            tableContent += "<td style='text-align:center'>" + Math.round(totalROIOwnBrandValue * 100) / 100 + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'></td>";
                        }
                        if (totalROIComValue != 0.0) {
                            tableContent += "<td style='text-align:center'>" + Math.round(totalROIComValue * 100) / 100 + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'></td>";
                        }
                    }
                    tableContent += "</tr>"
                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                var jsonType = eval(type);
                printHeader += tableContent;
                $("#divTrackerReport").html(tableContent);
                $("#divPrint").html(printHeader);
                if ($.fn.dataTable) {
                    $('#tblCampaignDetailReport').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };

                fninializePrint("divPrint", "ifrmPrint", "divTrackerReport");
                HideModalPopup("dvloading");
            }
            else {
                $("#divTrackerReport").html("");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnMarketingCampaignTrackerView(campaignCode) {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetMCProductDetails',
        data: 'compaignCode=' + campaignCode,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblProductDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<td style='text-align:left'> Sale Product</td>";
                tableContent += "<td style='text-align:left'> Input Mapped</td>";
                tableContent += "<td style='text-align:left'> Qty</td>";
                tableContent += "<td style='text-align:left'> Visit Order</td>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    tableContent += "<tr>";
                    tableContent += "<td align='left' >" + jsData.Tables[0].Rows[i].Sale_Product + "</td>";
                    tableContent += "<td align='left' >" + jsData.Tables[0].Rows[i].Sample_Product + "</td>";
                    tableContent += "<td align='left' >" + jsData.Tables[0].Rows[i].Quantity + "</td>";
                    tableContent += "<td align='left' >" + jsData.Tables[0].Rows[i].Visit_Order + "</td>";
                    tableContent += "</tr>";
                }
                tableContent += "</tbody></table>";
                $("#divTrackerModel").html(tableContent);
                if ($.fn.dataTable) {
                    $('#tblProductDetails').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                };
                $("#divTrackerModel").show();
                ShowModalPopup('modalTracker');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


//----------------------START - MARKETING CAMPAIGN VISITS DETAILS------------------

function fnMarketingCampaignVisitsDetails(campaignCode) {
    ShowModalPopup("dvloading");
    $("#divVisitHeader").empty();
    $("#divVisitPrint").empty();
    $("#divVisitReport").empty();

    if (campaignCode === undefined) {
        if ($("#ddlCompaignName").val() == "0") {
            fnMsgAlert('info', 'Marketing Campaign Visit Details', 'Please select campaign.');
            $("#ddlCompaignName").focus();
            HideModalPopup("dvloading");
            return false;
        }
        campaignCode = $("#ddlCompaignName").val();
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetMCVisitsDetails',
        data: 'compaignCode=' + campaignCode + '&userCode=' + $("#hdnVisitUserCode").val(),
        success: function (response) {
            var jsData = eval('(' + response + ')');
            var tableContent = "";
            if (!(jsData.Tables === undefined) && jsData.Tables.length > 0 && jsData.Tables[0].Rows.length > 0) {

                tableContent += "<div style='float:left;width:40%;'><table cellspacing='0' cellpadding='0' width='100%' id='tblCampaignDetails' class='data display datatable' >";
                tableContent += "<tbody style='font-weight:bold;'>";
                tableContent += "<tr><td style='text-align:left;width:40%;'> Marketing Campaign Name :</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Campaign_Name + "</td></tr>";
                tableContent += "<tr><td style='text-align:left;width:40%;'> Campaign Period : </td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Start_Date + " - " + jsData.Tables[2].Rows[0].End_Date + "</td></tr>";
                tableContent += "<tr><td style='text-align:left;width:40%;'> Cycle Name :</td><td style='text-align:left' >" + ((jsData.Tables[2].Rows[0].Cycle_Name == null) ? "" : jsData.Tables[2].Rows[0].Cycle_Name) + "</td></tr>";
                tableContent += "<tr><td style='text-align:left;width:40%;'> Customer Category :</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Customer_Category.slice(0, -2) + "</td></tr>";
                tableContent += "<tr><td style='text-align:left;width:40%;'> Speciality Name :</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Customer_Speciality.slice(0, -2) + "</td></tr>";
                tableContent += "<tr><td style='text-align:left;width:40%;'> Customer Count :</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Customer_Count + "</td></tr>";
                tableContent += "<tr><td style='text-align:left;width:40%;'> Created Date :</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Created_Date + "</td></tr>";
                tableContent += "<tr><td style='text-align:left;width:40%;'> No of Brand Mapped in MC :</td><td style='text-align:left' >" + jsData.Tables[2].Rows[0].Brand_Count + "</td></tr>";
                tableContent += "</tbody></table></div>";

                //sale product detail
                var visitOrder = 0;
                var saleProdNameArr = new Array();
                tableContent += "<div style='float:right;width:50%;'>";
                if (jsData.Tables[3].Rows.length > 0) {
                    tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblCampaignProductDetails' class='data display datatable' >";
                    tableContent += "<thead><tr>";
                    tableContent += "<td style='text-align:left'>Sale Product</td>";
                    tableContent += "<td style='text-align:left'>Input Mapped</td>";
                    tableContent += "<td style='text-align:left'>Qty</td>";
                    tableContent += "<td style='text-align:left'>VisitOrder</td>";
                    tableContent += "</tr></thead>";
                    tableContent += "<tbody>";

                    var saleProdArr = new Array();

                    for (var l = 0; l < jsData.Tables[3].Rows.length; l++) {
                        if (jQuery.inArray(jsData.Tables[3].Rows[l].Product_Code, saleProdArr) === -1) {
                            saleProdArr.push(jsData.Tables[3].Rows[l].Product_Code);
                            saleProdNameArr.push(jsData.Tables[3].Rows[l].Product_Code + '_' + jsData.Tables[3].Rows[l].Sale_Product);

                            tableContent += "<tr>";
                            var saleJson = jsonPath(jsData, "$.Tables[3].Rows[?(@.Product_Code=='" + jsData.Tables[3].Rows[l].Product_Code + "')]");
                            if (saleJson != false && saleJson !== undefined) {

                                tableContent += "<td rowspan='" + saleJson.length + "' style='text-align:left'>" + saleJson[0].Sale_Product + "</td>";
                                tableContent += "<td style='text-align:left'>" + saleJson[0].Sample_Product + "</td>";
                                tableContent += "<td style='text-align:left'>" + saleJson[0].Quantity + "</td>";
                                tableContent += "<td style='text-align:left'>" + saleJson[0].Visit_Order + "</td></tr>";
                                if (parseInt(saleJson[0].Visit_Order) > visitOrder) {
                                    visitOrder = parseInt(saleJson[0].Visit_Order);
                                }

                                if (saleJson.length > 1) {
                                    for (var m = 1; m < saleJson.length; m++) {
                                        tableContent += "<tr>";
                                        tableContent += "<td style='text-align:left'>" + saleJson[m].Sample_Product + "</td>";
                                        tableContent += "<td style='text-align:left'>" + saleJson[m].Quantity + "</td>";
                                        tableContent += "<td style='text-align:left'>" + saleJson[m].Visit_Order + "</td>";
                                        tableContent += "</tr>";
                                        if (parseInt(saleJson[m].Visit_Order) > visitOrder) {
                                            visitOrder = parseInt(saleJson[m].Visit_Order);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    tableContent += "</tbody></table>";
                }
                else {
                    tableContent += "<span><b>No sales product mapping for this campaign.</b></span>";
                }
                tableContent += "</div>";
                $("#divVisitHeader").html(tableContent);
                $("#divVisitPrint").append(tableContent);
                //$('#tblCampaignProductDetails').dataTable({
                //    "sPaginationType": "full_numbers"
                //});

                // User Details
                tableContent = "";
                tableContent = "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetail' class='data display datatable' >";
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
                tableContent += "</table></br>";
                $("#divVisitReport").html(tableContent);
                $("#divVisitPrint").append(tableContent);

                //Report details
                var tblCont = "";
                if (!(jsData.Tables === undefined) && jsData.Tables.length > 0 && jsData.Tables[4].Rows.length > 0) {

                    var rowSpanCnt = ((visitOrder > 0) ? 2 : 1);
                    var colSpanCnt = ((visitOrder > 0) ? 2 : 1);
                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblMCVisitDetails' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrpop'>";
                    tblCont += "<th style='display:none;'>User Name</th>";
                    tblCont += "<th style='display:none;'>Employee Name</th>";
                    tblCont += "<th style='display:none;'>Division Name</th>";
                    tblCont += "<th style='display:none;'>Date of Joining</th>";
                    tblCont += "<th style='display:none;'>Manager Name</th>";
                    tblCont += "<th style='display:none;'>Manager Territory name</th>";
                    tblCont += "<th style='display:none;'>Region Name</th>";
                    tblCont += "<th >Doctor Region Name</th>";
                    tblCont += "<th >Doctor Name</th>";
                    tblCont += "<th >MDL No</th>";
                    tblCont += "<th >Speciality Name</th>";
                    tblCont += "<th >Category</th>";
                    tblCont += "<th >Doctor Product Mapping</th>";
                    //tblCont += "<th >Products targeted for this Campaign</th>";
                    tblCont += "<th >No of visits Made to the doctor</th>";
                    for (var p = 1; p <= visitOrder; p++) {
                        tblCont += "<th ></th>";
                        tblCont += "<th ></th>";
                    }
                    tblCont += "</tr>";

                    tblCont += "<tr>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' style='display:none;'>User Name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' style='display:none;'>Employee Name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' style='display:none;'>Division Name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' style='display:none;'>Date of Joining</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' style='display:none;'>Manager Name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' style='display:none;'>Manager Territory name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "'  style='display:none;'>Region Name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "'>Doctor Region Name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' >Doctor Name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' >MDL No</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' >Speciality Name</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' >Category</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' >Doctor Product Mapping</th>";
                    //tblCont += "<th rowspan='" + rowSpanCnt + "' >Products targeted for this Campaign</th>";
                    tblCont += "<th rowspan='" + rowSpanCnt + "' >No of visits Made to the doctor</th>";
                    for (var p = 1; p <= visitOrder; p++) {
                        tblCont += "<th colspan='" + colSpanCnt + "'>Visit " + p + "</th>";
                    }
                    tblCont += "</tr>";
                    if (visitOrder > 0) {
                        tblCont += "<tr>";
                        for (var p = 1; p <= visitOrder; p++) {
                            tblCont += "<th >Plan in Marketing Campaign</th>";
                            tblCont += "<th >Actual in DCR</th>";
                        }
                        tblCont += "</tr>";
                    }

                    tblCont += "<th colspan= '" + ((visitOrder * 2) + 14) + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapopup()'>Show Filter</span></th>";
                    tblCont += "</thead>";
                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },';
                    type += '{ type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "number-range" }';
                    for (var p = 1; p <= visitOrder; p++) {
                        type += ', { type: "text" }, { type: "text" }';
                    }
                    type += ']';

                    tblCont += "<tbody>";

                    for (var y = 0; y < jsData.Tables[4].Rows.length; y++) {
                        tblCont += "<tr>";
                        tblCont += "<td style='display:none;'>" + jsData.Tables[0].Rows[0]["User_Name"] + "</td>";
                        tblCont += "<td style='display:none;'>" + jsData.Tables[0].Rows[0]["Employee_Name"] + "</td>";

                        var expDiv = jsonPath(jsData, "$.Tables[1].Rows[?(@.User_Code=='" + jsData.Tables[0].Rows[0]["User_Code"] + "')]");

                        if (expDiv != false) {
                            tblCont += "<td style='display:none;'>" + expDiv[0].Division_Name + "</td>";
                        }
                        else {
                            tblCont += "<td style='display:none;'></td>";
                        }
                        tblCont += "<td style='display:none;'>" + ((jsData.Tables[0].Rows[0]["DOJ"] == null) ? "-" : jsData.Tables[0].Rows[0]["DOJ"]) + "</td>";
                        tblCont += "<td style='display:none;'>" + jsData.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + jsData.Tables[0].Rows[0]["Manager_Name"] + ")</td>";
                        tblCont += "<td style='display:none;'>" + jsData.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>";
                        tblCont += "<td style='display:none;'>" + jsData.Tables[0].Rows[0]["Region_Name"] + "</td>";
                        tblCont += "<td >" + jsData.Tables[4].Rows[y]["Region_Name"] + "</td>";
                        // tblCont += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[4].Rows[y]["Region_Code"] + "_" + jsData.Tables[4].Rows[y]["Customer_Code"] + "_" + jsData.Tables[4].Rows[y]["User_Code"] + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[4].Rows[y]["Customer_Name"] + "</span></td>"
                        tblCont += "<td align='left' ><span onclick='fnDoctor360Popup(\"" + jsData.Tables[4].Rows[y]["Customer_Code"] + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[4].Rows[y]["Customer_Name"] + "</span></td>"
                        // tblCont += "<td>" + jsData.Tables[4].Rows[y]["Customer_Name"] + "</td>";
                        tblCont += "<td>" + jsData.Tables[4].Rows[y]["MDL"] + "</td>";
                        tblCont += "<td>" + jsData.Tables[4].Rows[y]["Speciality_Name"] + "</td>";
                        tblCont += "<td>" + jsData.Tables[4].Rows[y]["Category_Name"] + "</td>";

                        //Doctor Product Mapping - Focus Products for the Doctor in Doctor Product Mapping not MC specify
                        var otherMapProd = jsonPath(jsData, "$.Tables[5].Rows[?(@.Customer_Code=='" + jsData.Tables[4].Rows[y]["Customer_Code"] + "')]");
                        //saleProdNameArr

                        if (otherMapProd != false && otherMapProd !== undefined && otherMapProd.length > 0) {
                            tblCont += "<td>";
                            for (var w = 0; w < saleProdNameArr.length; w++) {
                                var unMappedCamp = jsonPath(otherMapProd, "$.[?(@.Product_Code=='" + saleProdNameArr[w].split('_')[0] + "')]");
                                if (unMappedCamp == false || unMappedCamp === undefined) {
                                    tblCont += "<span style='color:red !important;'>" + saleProdNameArr[w].split('_')[1] + "</span>,<br />";
                                }
                            }
                            for (var l = 0; l < otherMapProd.length; l++) {
                                tblCont += otherMapProd[l].Product_Name;
                                if (otherMapProd.length > 1 && (otherMapProd.length - 1) != l) {
                                    tblCont += ",<br />";
                                }
                            }
                            tblCont += "</td>";
                        }
                        else {
                            tblCont += "<td>";
                            for (var w = 0; w < saleProdNameArr.length; w++) {
                                tblCont += "<span style='color:red !important;'>" + saleProdNameArr[w].split('_')[1] + "</span>";
                                if (saleProdNameArr.length > 1 && (saleProdNameArr.length - 1) != w) {
                                    tblCont += ",<br />";
                                }
                            }
                            tblCont += "</td>";
                        }

                        ////Products targeted for this Campaign
                        //var camProd = jsonPath(jsData, "$.Tables[6].Rows[?(@.Customer_Code=='" + jsData.Tables[4].Rows[y]["Customer_Code"] + "')]");
                        //if (camProd != false && camProd !== undefined) {
                        //    tblCont += "<td>";
                        //    for (var l = 0; l < camProd.length; l++) {
                        //        tblCont += camProd[l].Product_Name + "<br />";
                        //        if (camProd.length > 1 && (camProd.length - 1) != l) {
                        //            tblCont += ",";
                        //        }
                        //    }
                        //    tblCont += "</td>";
                        //}
                        //else {
                        //    tblCont += "<td></td>";
                        //}

                        //Doctor visit count
                        var docCount = jsonPath(jsData, "$.Tables[8].Rows[?(@.Customer_Code=='" + jsData.Tables[4].Rows[y]["Customer_Code"] + "')]");
                        if (docCount != false && docCount !== undefined & docCount.length > 0) {
                            tblCont += "<td class='td-a' onclick='fnDoctorVisitProductDetails(\"" + jsData.Tables[4].Rows[y]["Customer_Code"] + " _ " + jsData.Tables[2].Rows[0].Start_Date + " _ " + jsData.Tables[2].Rows[0].End_Date + "\")'>" + docCount.length + "</td>";
                        }
                        else {
                            tblCont += "<td>0</td>";
                        }

                        //Visit order
                        var camProd = jsonPath(jsData, "$.Tables[6].Rows[?(@.Customer_Code=='" + jsData.Tables[4].Rows[y]["Customer_Code"] + "')]");
                        var sampleArr = new Array();
                        for (var p = 1; p <= visitOrder; p++) {
                            sampleArr = new Array();
                            //Plan in Marketing Campaign
                            // camProd --> Sale Product list mapped for the doctor
                            if (camProd != false && camProd !== undefined && camProd.length > 0) {

                                tblCont += "<td>";
                                for (var a = 0; a < camProd.length; a++) {
                                    // select samples for all the sale products with respect to the visit order.                                   
                                    var sampleJson = jsonPath(jsData, "$.Tables[3].Rows[?(@.Product_Code=='" + camProd[a].Product_Code + "' & @.Visit_Order=='" + p + "')]");
                                    if (sampleJson != false && sampleJson !== undefined && sampleJson.length > 0) {
                                        for (var b = 0; b < sampleJson.length; b++) {
                                            if (jQuery.inArray(sampleJson[b].Sample_Product, sampleArr) === -1) {
                                                sampleArr.push(sampleJson[b].Sample_Product);

                                                tblCont += sampleJson[b].Sample_Product;
                                                if (camProd.length > 1 && (camProd.length - 1) != a) {
                                                    tblCont += ",<br />";
                                                }
                                            }
                                        }
                                    }
                                }
                                tblCont += "</td>";
                            }
                            else { // if no sales product there will be no sample for this doctor
                                tblCont += "<td ></td>";
                            }


                            //Actual in DCR
                            // docCount --> Doctor visit details for the doctor within the satrt time and end time of this campaign
                            if (docCount != false && docCount !== undefined && docCount.length > 0 && p <= docCount.length) {
                                tblCont += "<td>";
                                var docProdctJson = jsonPath(jsData, "$.Tables[9].Rows[?(@.Customer_Code=='" + docCount[p - 1].Customer_Code + "' & @.DCR_Actual_Date=='" + docCount[p - 1].DCR_Actual_Date + "')]");
                                if (docProdctJson != false && docProdctJson !== undefined && docProdctJson.length > 0) {
                                    var visitDate = new Date(docCount[p - 1].DCR_Actual_Date);
                                    tblCont += visitDate.getDate() + '/' + (visitDate.getMonth() + 1) + '/' + visitDate.getFullYear() + "<br />";
                                    for (var f = 0; f < docProdctJson.length; f++) {
                                        tblCont += docProdctJson[f].Product_Name;
                                        if (docProdctJson.length > 1 && (docProdctJson.length - 1) != f) {
                                            tblCont += ",<br />";
                                        }
                                    }
                                }
                                tblCont += "</td>";
                            }
                            else {
                                tblCont += "<td ></td>";
                            }
                        }

                        tblCont += "</tr>";
                    }

                    tblCont += "</tbody>";
                    tblCont += "</table></br>";

                    $("#divVisitReport").append(tblCont);

                    var jsonType = eval(type);
                    $('#tblMCVisitDetails').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "bSort": false
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                }
                else {
                    tblCont = "<sapn>No Doctors Mapped for this campaign.</span>";
                    $("#divsubReport").html(tblCont);
                }
                $("#divVisitPrint").append(tblCont);
                fninializePrint("divVisitPrint", "ifrmVisitPrint", "divVisitReport");
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
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

function fnDoctorVisitProductDetails(id) {
    ShowModalPopup("dvloading");
    var fromDate = id.split('_')[1];
    var toDate = id.split('_')[2];

    fromDate = fromDate.split('/')[2] + "-" + fromDate.split('/')[1] + "-" + fromDate.split('/')[0];
    toDate = toDate.split('/')[2] + "-" + toDate.split('/')[1] + "-" + toDate.split('/')[0];
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetMCVisitsDetailsPopUp',
        data: 'userCode=' + $("#hdnVisitUserCode").val() + '&doctorCode=' + id.split('_')[0] + '&fromDate=' + fromDate + '&toDate=' + toDate,
        success: function (response) {
            var jsPop = eval('(' + response + ')');
            var tblCont = "";
            if (!(jsPop.Tables === undefined) && jsPop.Tables.length > 0 && jsPop.Tables[0].Rows.length > 0) {

                tblCont = "<table cellspacing='0' cellpadding='0' id='tblProductDetails' class='data display dataTable' width='100%'>";
                tblCont += "<thead>";
                tblCont += "<tr style='display: none;' id='tblTrProduct'>";
                tblCont += "<th>Product Name</th>";
                tblCont += "<th>Brand Name</th>";
                tblCont += "<th>Doctor Name</th>";
                tblCont += "<th>MDL/SVL No</th>";
                tblCont += "<th>Category</th>";
                tblCont += "<th>Speciality</th>";
                tblCont += "<th>Hospital Name</th>";
                tblCont += "<th>Hospital Classification</th>";
                tblCont += "<th>Visited Dates</th>";
                tblCont += "<th>Yield</th>";
                tblCont += "<th>Potential</th>";
                tblCont += "</tr>";

                var type = '[{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }';
                type += ', { type: "date-range" }, { type: "number-range" }, { type: "number-range" }]';
                tblCont += "<tr>";
                tblCont += "<th>Product Name</th>";
                tblCont += "<th>Brand Name</th>";
                tblCont += "<th>Doctor Name</th>";
                tblCont += "<th>MDL/SVL No</th>";
                tblCont += "<th>Category</th>";
                tblCont += "<th>Speciality</th>";
                tblCont += "<th>Hospital Name</th>";
                tblCont += "<th>Hospital Classification</th>";
                tblCont += "<th>Visited Dates</th>";
                tblCont += "<th>Yield</th>";
                tblCont += "<th>Potential</th>";
                tblCont += "</tr>";
                tblCont += "<th colspan= '11' align='left'  ><span id='spnDivTogglePopUp' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaProduct()'>Show Filter</span></th>";
                tblCont += "</thead><tbody>";


                for (var k = 0; k < jsPop.Tables[1].Rows.length; k++) {
                    var proJson = jsonPath(jsPop, "$.Tables[0].Rows[?(@.Product_Code=='" + jsPop.Tables[1].Rows[k]["Product_Code"] + "')]");
                    tblCont += "<tr>";
                    tblCont += "<td>" + proJson[0].Product_Name + "</td>";
                    tblCont += "<td>" + ((proJson[0].Brand_Name == null) ? "" : proJson[0].Brand_Name) + "</td>";
                    tblCont += "<td>" + proJson[0].Doctor_Name + "</span></td>";
                    tblCont += "<td>" + ((proJson[0].MDL == null) ? "" : proJson[0].MDL) + "</td>";
                    tblCont += "<td>" + ((proJson[0].Category_Name == null) ? "" : proJson[0].Category_Name) + "</td>";
                    tblCont += "<td>" + ((proJson[0].Speciality_Name == null) ? "" : proJson[0].Speciality_Name) + "</td>";
                    tblCont += "<td>" + ((proJson[0].Hospital_Name == null) ? "" : proJson[0].Hospital_Name) + "</td>";
                    tblCont += "<td>" + ((proJson[0].Hospital_Classification == null) ? "" : proJson[0].Hospital_Classification) + "</td>";
                    tblCont += "<td>";
                    for (var l = 0; l < proJson.length; l++) {
                        tblCont += proJson[l].DCR_Actual_Date;
                        if (proJson.length > 1 && (proJson.length - 1) != l) {
                            tblCont += ",<br />";
                        }
                    }
                    tblCont += "</td>";
                    tblCont += "<td>" + ((proJson[0].Support_Quantity == null) ? "" : proJson[0].Support_Quantity) + "</td>";
                    tblCont += "<td>" + ((proJson[0].Potential_Quantity == null) ? "" : proJson[0].Potential_Quantity) + "</td>";
                    tblCont += "</tr>";
                }
                tblCont += "</tbody></table>";
                $("#divVisitModel").html(tblCont);
                //if ($.fn.dataTable) {
                //    $('#tblProductDetails').dataTable({
                //        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                //    });
                //};

                var jsonType = eval(type);
                $('#tblProductDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "bSort": false
                }).dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });

                $("#divVisitModel").show();
                $("#divVisitPopUpPrint").append(tblCont);
                fninializePrint("divVisitPopUpPrint", "ifrmVisitPopUpPrint", "divVisitModel");
                HideModalPopup("dvloading");
                ShowModalPopup('modalVisit');
            }
            else {
                fnMsgAlert('info', 'Report', 'No input given for this doctor.');
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnToggleTreeaProduct() {
    if ($("#spnDivTogglePopUp").html() == "Hide Filter") {

        $("#tblTrProduct").hide();
        $("#spnDivTogglePopUp").html('Show Filter');
    }
    else if ($("#spnDivTogglePopUp").html() == "Show Filter") {
        $("#tblTrProduct").show();
        $("#spnDivTogglePopUp").html('Hide Filter');
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
function fnDoctor360Popup(val) {
    $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + val, title: 'Reports', overlayClose: false });
    return;
}

//---------------------- END  - MARKETING CAMPAIGN VISITS DETAILS------------------