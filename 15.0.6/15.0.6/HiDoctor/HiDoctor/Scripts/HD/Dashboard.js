/*
Created By : Senthil S
Created Date : 2013-02-27
For : Dashboard
*/
//global variables
var month = "";
var regionNames = "";

var monthArray = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"];
var shortMonthArray = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                   "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthNumArray = ["1", "2", "3", "4", "5",
            "6", "7", "8", "9", "10", "11", "12"];
var weekFulldays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var disCatArr = new Array();
var disCatNameArr = new Array();
var gaugeRedColorFromTo = "";
var gaugeYellowColorFromTo = "";
var gaugeGreenColorFromTo = "";

//function to bind the division
function fnBindDivision() {
    $.ajax({
        type: 'GET',
        url: "DashBoard/GetDivision",
        success: function (response) {
            response = eval('(' + response + ')');
            $('option', $("#drpDivision")).remove();
            $("#drpDivision").append("<option value=0>-Select Division-</option>");
            for (var i = 0; i < response.Tables[0].Rows.length; i++) {
                $("#drpDivision").append("<option value=" + response.Tables[0].Rows[i].Division_Code + ">" + response.Tables[0].Rows[i].Division_Name + "</option>");
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'Bind User Division failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

//function to get the region types after pick the division
function fnGetRegionType() {
    var divisionCode = "";
    if ($("#drpDivision").is(":visible")) {
        divisionCode = $("#drpDivision").val();
    }
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetRegionTypesByDivision",
        data: "DivisionCode=" + divisionCode + "",
        success: function (response) {
            response = eval('(' + response + ')');
            $('option', $("#drpRegionType")).remove();
            $("#drpRegionType").append("<option value=0>Select RegionType</option>");
            $("#drpRegionType").append("<option value=ALL>ALL</option>");
            for (var i = 0; i < response.Tables[0].Rows.length; i++) {
                $("#drpRegionType").append("<option value=" + response.Tables[0].Rows[i].Region_Type_Code + ">" + response.Tables[0].Rows[i].Region_Type_Name + "</option>");
            }
            //$("#drpTerritory").multiselect('destroy');
            //$("#drpTerritory").multiselect();
            //if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
            //$("#selectall").click(function () {
            //    $('.case').attr('checked', this.checked);
            //});
            //$("#drpTerritory").multiselect({
            //    noneSelectedText: 'Select Regions'
            //}).multiselectfilter();
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'Bind Region Type failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

//function to bind the regions
function fnBindRegions() {
    var divisionCode = "";
    if ($("#drpDivision").is(":visible")) {
        divisionCode = $("#drpDivision").val();
    }
    //to get the selected region types
    var regionTypeCode = $("#drpRegionType").val();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetRegionByDivisionAndRegionType",
        data: "DivisionCode=" + divisionCode + "&RegionTypeCode=" + regionTypeCode + "",
        success: function (response) {//CurrentDate
            response = eval('(' + response + ')');
            // $("#drpTerritory").multiselect('destroy');
            //$('option', $("#drpTerritory")).remove();
            var regions = "";
            //$("#drpTerritory").append("<option value=ALL>ALL</option>");
            regions += "<select id='drpTerritory' multiple='multiple'>";
            regions += "<option value=ALL>ALL</option>"
            for (var i = 0; i < response.Tables[0].Rows.length; i++) {
                // $("#drpTerritory").append("<option value=" + response.Tables[0].Rows[i].Region_Code + ">" + response.Tables[0].Rows[i].Region_Name + "</option>");
                regions += "<option value=" + response.Tables[0].Rows[i].Region_Code + ">" + response.Tables[0].Rows[i].Region_Name + "</option>";
            }
            regions += "</select>";
            $("#dvRegionList").html(regions);
            $("#drpTerritory").multiselect("destroy").multiselect().multiselectfilter();
            //if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
            //$("#selectall").click(function () {
            //    $('.case').attr('checked', this.checked);
            //});
            //$("#drpTerritory").multiselect({
            //    noneSelectedText: 'Select Regions'
            //}).multiselectfilter();
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'Bind Region failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}
var result = "";

function fnCategoryWiseVisitAnanlysis() {
    $.blockUI();
    $("#dvCategoryVisit").html('');
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";
    //  var regionNames = fnGetRegionNames();
    var regionCodes = fnGetRegionCodes();
    var divisionCode = fnGetDivisionCode();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetCategoryWiseVisitAnanlysis",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "&DivisionCode=" + divisionCode + "",
        success: function (response) {
            if (response != '') {
                response = eval('(' + response + ')');
                var content = "";
                if (response != false && response != undefined) {
                    if (response.Tables[0] != undefined) {
                        if (response.Tables[0].Rows.length > 0) {
                            var data = "[['Month',";
                            for (var j = 0; j < disCatArr.length; j++) {
                                data += "'" + disCatNameArr[j] + "'";
                                if (j < disCatArr.length - 1) {
                                    data += ",";
                                }
                            }
                            data += "],";
                            //Total Doctors in List
                            for (var a = 0; a < monthAr.length; a++) {
                                data += "[";
                                data += "'" + shortMonthArray[parseInt(monthAr[a]) - 1] + "',";
                                for (var j = 0; j < disCatArr.length; j++) {
                                    var disJson = jsonPath(response, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "' & @.Month=='" + monthAr[a] + "')]");
                                    if (disJson != false) {
                                        data += disJson[0].Total_Approved_Doctors;
                                        if (j < disCatArr.length - 1) {
                                            data += ",";
                                        }
                                    }
                                    else {
                                        data += 0;
                                        if (j < disCatArr.length - 1) {
                                            data += ",";
                                        }
                                    }
                                }
                                data += "]";
                                if (a < monthAr.length - 1) {
                                    data += ",";
                                }

                            }
                            data += ",";
                            //No of Doctors planned
                            for (var a = 0; a < monthAr.length; a++) {
                                data += "[";
                                data += "'" + shortMonthArray[parseInt(monthAr[a]) - 1] + "',";
                                for (var j = 0; j < disCatArr.length; j++) {
                                    var disJson = jsonPath(response, "$.Tables[1].Rows[?(@.Category_Code=='" + disCatArr[j] + "' & @.Month=='" + monthAr[a] + "')]");
                                    if (disJson != false) {
                                        data += disJson[0].Total_Planned_Doctors;
                                        if (j < disCatArr.length - 1) {
                                            data += ",";
                                        }
                                    }
                                    else {
                                        data += 0;
                                        if (j < disCatArr.length - 1) {
                                            data += ",";
                                        }
                                    }
                                }
                                data += "]";
                                if (a < monthAr.length - 1) {
                                    data += ",";
                                }

                            }

                            // data += "]";
                            data += ",";
                            //No Of Doctors Visited
                            for (var a = 0; a < monthAr.length; a++) {
                                data += "[";
                                data += "'" + shortMonthArray[parseInt(monthAr[a]) - 1] + "',";
                                for (var j = 0; j < disCatArr.length; j++) {
                                    var disJson = jsonPath(response, "$.Tables[2].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "' & @.Month=='" + monthAr[a] + "')]");
                                    if (disJson != false) {
                                        data += disJson[0].Total_Visited_Doctors;
                                        if (j < disCatArr.length - 1) {
                                            data += ",";
                                        }
                                    }
                                    else {
                                        data += 0;
                                        if (j < disCatArr.length - 1) {
                                            data += ",";
                                        }
                                    }
                                }
                                data += "]";
                                if (a < monthAr.length - 1) {
                                    data += ",";
                                }

                            }
                            //
                            data += "]";

                            // result = data;
                            data = eval('(' + data + ')');
                            var chartData = google.visualization.arrayToDataTable(data);
                            var options = {
                                isStacked: true,
                                height: 245,
                                title: '',
                                hAxis: { title: '' }, legend: 'none', colors: catImgCode,
                                xAxis: {
                                    lineWidth: 0,
                                    labels: {
                                        overflow: 'justify',
                                    }
                                },
                            };
                            var chart = new google.visualization.ColumnChart(document.getElementById('dvCategoryVisit'));
                            chart.draw(chartData, options);
                            $("#dvCatTitle").show();
                            $("#dvTotalDoc").html('Total Doctors in List')
                            $("#dvnoOfDocPlanned").html('No of Doctors Planned in TP')
                            $("#dvnoOfDocVisit").html('No of Doctors met')
                        }
                        else {
                            $("#dvCategoryVisit").html('No Data available');
                            $("#dvCategoryVisit").css('text-align', 'center');
                            $("#dvCategoryVisit").css('font-style', 'italic');
                            $("#dvCategoryVisit").css('background-color', '#fff');
                        }
                    }
                    else {
                        $("#dvCategoryVisit").html('No Data available');
                        $("#dvCategoryVisit").css('text-align', 'center');
                        $("#dvCategoryVisit").css('font-style', 'italic');
                        $("#dvCategoryVisit").css('background-color', '#fff');
                    }
                }
            }
        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'can not create Categorywise visit analysis chart');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

//function to calculate work 
function fnWorkCalculation() {
    $.blockUI();
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";
    // var regionNames = fnGetRegionNames();
    var regionCodes = fnGetRegionCodes();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetWorkedCalculation",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                fnCreateWorkCalcTable(jsonData);
            }
            else {
                $("#dvField").html('No Data available');
            }

        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

function fnCreateWorkCalcTable(jsonData) {
    var tableContent = "";
    if (jsonData.Tables[0] != undefined) {
        if (jsonData.Tables[0].Rows.length > 0) {
            tableContent += "<table cellpadding='0' cellspacing='0' style='width:100%;border: 1px solid #DDD;'>";
            tableContent += "<thead style='background-color:#efefef;font-size: 11px; text-align:center;'><tr>";
            tableContent += "<td style='border-right:1px solid #ddd;width:13%;display:none;'>No.Of Days</td>";
            tableContent += "<td style='border-right:1px solid #ddd;width:7%'>Year</td>";
            tableContent += "<td style='border-right:1px solid #ddd;width:7%'>Month</td>";
            tableContent += "<td style='border-right:1px solid #ddd;width:10%'>No Reporting</td>";
            tableContent += "<td style='border-right:1px solid #ddd;width:10%'>NA</td>";
            tableContent += "<td style='border-right:1px solid #ddd;width:10%'> Field Work</td>";
            tableContent += "<td style='border-right:1px solid #ddd;width:10%'>Off Field Work</td>";
            tableContent += "<td style='border-right:1px solid #ddd;width:20%'>% Worked</td>";
            tableContent += "</tr></thead><tbody style='background-color: #fff;'>";

            for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                tableContent += "<tr>";
                tableContent += "<td class='tdBorder' style='display:none;'><div class='dvFullGrayspark' style='float:left;width:40%;padding-top'></div>";
                tableContent += "<div style='float:left;width:60%;'>" + jsonData.Tables[0].Rows[i].No_Of_Days + "</div></td>";
                tableContent += "<td class='tdBorder'><div style='text-align:center;'>" + jsonData.Tables[0].Rows[i].Year + "</div></td>";
                tableContent += "<td class='tdBorder'><div style='text-align:center;'>"
                    + shortMonthArray[parseInt(jsonData.Tables[0].Rows[i].Month) - 1] + "</div></td>";
                tableContent += "<td class='tdBorder'><div id='dvNoReporting_" + i + "' style='float:left;width:40%;padding-top'></div><div style='float:left;width:60%;'>" + jsonData.Tables[0].Rows[i].No_Reporting + "</div></td>";
                tableContent += "<td class='tdBorder'><div id='dvNA_" + i + "' style='float:left;width:40%;padding-top'></div><div style='float:left;width:60%;'>" + jsonData.Tables[0].Rows[i].NA + "</div></td>";
                tableContent += "<td class='tdBorder'><div id='dvFieldWork_" + i + "' style='float:left;width:40%;padding-top'></div><div style='float:left;width:60%;'>" + jsonData.Tables[0].Rows[i].Field_Work + "</div></td>";
                tableContent += "<td class='tdBorder'><div id='dvOffFieldWork_" + i + "' style='float:left;width:40%;padding-top'></div><div style='float:left;width:60%;'>" + jsonData.Tables[0].Rows[i].Off_Field_Work + "</div></td>";
                tableContent += "<td class='tdBorder'><div id='dvWorked_" + i + "' class='progressBarClass'><span>" + parseFloat(jsonData.Tables[0].Rows[i].Worked).toFixed(0) + "%</span></div></td>";
                tableContent += "</tr>";
            }
            tableContent += "</tbody></table>";

            $(".progressBarClass").progressbar({ value: 100 });
            $("#dvField").html(tableContent);
            $(".dvFullGrayspark").sparkline([100], {
                type: 'pie',
                sliceColors: ['#88888A']
            });
            for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                var pval = parseFloat(jsonData.Tables[0].Rows[i].Worked).toFixed(0);
                $("#dvWorked_" + i + "").progressbar({ "value": parseInt(pval) });
                $("#dvNA_" + i + "").sparkline([jsonData.Tables[0].Rows[i].NA, parseFloat(jsonData.Tables[0].Rows[i].No_Of_Days) - parseFloat(jsonData.Tables[0].Rows[i].NA)], {
                    type: 'pie',
                    sliceColors: ['#88888A', '#FFF']
                });//
                $("#dvFieldWork_" + i + "").sparkline([jsonData.Tables[0].Rows[i].Field_Work, parseFloat(jsonData.Tables[0].Rows[i].No_Of_Days) - parseFloat(jsonData.Tables[0].Rows[i].Field_Work)], {
                    type: 'pie',
                    sliceColors: ['#88888A', '#FFF']
                });
                $("#dvOffFieldWork_" + i + "").sparkline([jsonData.Tables[0].Rows[i].Off_Field_Work, parseFloat(jsonData.Tables[0].Rows[i].No_Of_Days) - parseFloat(jsonData.Tables[0].Rows[i].Off_Field_Work)], {
                    type: 'pie',
                    sliceColors: ['#88888A', '#FFF']
                });
                $("#dvNoReporting_" + i + "").sparkline([jsonData.Tables[0].Rows[i].No_Reporting, parseFloat(jsonData.Tables[0].Rows[i].No_Of_Days) - parseFloat(jsonData.Tables[0].Rows[i].No_Reporting)], {
                    type: 'pie',
                    sliceColors: ['#88888A', '#FFF']
                });
            }
        }
        else {
            $("#dvField").html('No Data available');
            $("#dvField").css('text-align', 'center');
            $("#dvField").css('font-style', 'italic');
            $("#dvField").css('background-color', '#fff');
        }
    }
    else {
        $("#dvField").html('No Data available');
        $("#dvField").css('text-align', 'center');
        $("#dvField").css('font-style', 'italic');
        $("#dvField").css('background-color', '#fff');
    }

}

function fnDrawPieSparkChart(fullValue, currentValue, id) {
    $("#" + id).sparkline([fullValue, currentValue], {
        type: 'pie',
        sliceColors: ['#DDD', '#FFF']
    });
}

var monthAr = new Array();
var catImgCode = "";//['#7EB25D', '#6180D1', '#FAC521', '#0099C6', '#990099', '#109618'];
function fnSubmit() {
    fnClearActivityDashboard();
    $("#imgloginLoad").show()
    var regionCount = 0;
    if ($("#drpDivision").is(":visible")) {
        if ($("#drpDivision").val() == 0) {
            fnMsgAlert('info', 'info', 'Please select any division');
            $("#imgloginLoad").hide()
            return false;
        }
    }
    if ($("#drpRegionType").val() == 0) {
        fnMsgAlert('info', 'info', 'Please select any region type');
        $("#imgloginLoad").hide()
        return false;
    }
    if ($("#drpPeriodType").val() == 0) {
        fnMsgAlert('info', 'info', 'Please select any period type');
        $("#imgloginLoad").hide()
        return false;
    }
    if ($("#drpPeriod").val() == null || $("#drpPeriod").val() == 0) {
        fnMsgAlert('info', 'info', 'Please select any period');
        $("#imgloginLoad").hide()
        return false;
    }

    $('select#drpTerritory > option:selected').each(function () {
        regionCount = regionCount + 1;
    });
    if (regionCount == 0) {
        fnMsgAlert('info', 'info', 'Please select atleast one region');
        $("#imgloginLoad").hide()
        return false;
    }
    fnGetRegionNames();
    fnBindCategory();
    monthAr = new Array();
    // $("#dvLeftPanel").hide();
    // $("#dvRightPanel").css('width', '98%');
    //// $('#imgScroll').removeClass("ScrollDown");
    // $('#imgScroll').addClass("ScrollUp");
    catImgCode = ['#A62525', '#7CC23D', '#58A2C9', '#109618', '#990099', '#0099C6'];
    var arr = $("#drpPeriod").val().split('-');
    var arr1 = arr[1].split('_');
    for (var m = 0; m < arr1.length; m++) {
        monthAr.push(arr1[m].toString())
    }

}
//function to doctor call average
function fnDoctorCallAverage() {
    $.blockUI();
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";
    //var regionNames = fnGetRegionNames();
    var regionCodes = fnGetRegionCodes();
    var divisionCode = fnGetDivisionCode();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetDoctorCallAverage",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "&DivisionCode=" + divisionCode + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                result = jsonData;
                fnBindDocCallAvg(jsonData);
            }
            else {
                $("#dvDocCalAvg").html('No Data available');
                $("#dvDocCalAvg").css('text-align', 'center');
                $("#dvDocCalAvg").css('font-style', 'italic');
                $("#dvDocCalAvg").css('background-color', '#fff');
            }
        },
        error: function (e) {
            $.unblockUI();
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

var json_g = "";
function fnBindDocCallAvg(jsonData) {
    var tableContent = "";
    tableContent += "<table style='width:100%;border:1px solid #DDD;' cellspacing='0' cellpaddind='0'><tr><thead><td colspan='" + monthAr.length + "' style='text-align:center;border-bottom: 1px solid #ddd;font-weight:bold;'>";
    tableContent += "<div style='float:left;margin-left:30%'>Doctor Call Average</div>";
    tableContent += "<div class='helpIcon'>";
    tableContent += "<img src='../Images/HelpIcon.png' onclick='fnHelp(\"ACTIVITY_DASHBOARD\",\"DOCTOR_CALL_AVERAGE\")' />";
    tableContent += "</div>";
    tableContent += "</td></tr></thead>";
    if (jsonData.Tables[0] != undefined) {
        if (jsonData.Tables[0].Rows.length > 0) {
            var maxArr = new Array();
            //var _array = [1,3,2];
            //Math.max.apply(Math,_array); // 3
            var commonData = "[['',";
            for (var j = 0; j < disCatArr.length; j++) {
                var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "')]");
                if (disJson != false) {

                    commonData += "'" + disCatNameArr[j] + "'"; //disJson[0].Value;
                    if (j < disCatArr.length - 1) {
                        commonData += ",";
                    }
                }
                else {
                    //commonData += 0;
                    //if (j < disCatArr.length - 1) {
                    //    commonData += ",";
                    //}
                }
            }
            commonData += "],";
            tableContent += "<tr>";

            var width = 100 / parseFloat(monthAr.length) - 5;
            for (var b = 0; b < monthAr.length; b++) {
                tableContent += "<td style='width:" + parseFloat(width).toFixed(0) + "px;text-align:center;border-bottom: 1px solid #ddd;border-right: 1px solid #ddd;'>" + shortMonthArray[parseInt(monthAr[b]) - 1] + "<span id='spnDocCallAvg_" + monthAr[b] + "' ></span></td>";
            }
            tableContent += "</tr>";

            tableContent += "<tr>";
            for (var b = 0; b < monthAr.length; b++) {
                tableContent += "<td style='width:" + parseFloat(width).toFixed(0) + "px;border-right: 1px solid #ddd;'><div style='width:100%;padding-left: 5px;' id='dvDocCallAvg_" + monthAr[b] + "'></div></td>";
            }
            tableContent += "</tr></table>";
            $("#dvDocCalAvg").html(tableContent);

            for (var c = 0; c < monthAr.length; c++) {
                var totalCoverage = 0;
                if (disCatArr.length > 0) {
                    var data = "['',";
                    for (var j = 0; j < disCatArr.length; j++) {
                        var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "' & @.Month=='" + monthAr[c] + "')]");
                        if (disJson != false) {
                            maxArr.push(disJson[0].Value);
                            data += disJson[0].Value;
                            totalCoverage = parseFloat(disJson[0].Value) + parseFloat(totalCoverage);
                            if (j < disCatArr.length - 1) {
                                data += ",";
                            }
                        }
                        else {
                            //data += 0;
                            //if (j < disCatArr.length - 1) {
                            //    data += ",";
                            //}
                        }
                    }
                    data += "]";
                    var fullData = commonData + data;
                    fullData = fullData + "]";
                    fullData = eval('(' + fullData + ')');
                    var maxValue = Math.max.apply(Math, maxArr); // 3
                    var options = {};
                    var chartData = google.visualization.arrayToDataTable(fullData);
                    new google.visualization.BarChart(document.getElementById('dvDocCallAvg_' + monthAr[c])).
                        draw(chartData, {
                            height: 100,
                            width: 100, //parseFloat(width - 5).toFixed(0),
                            hAxis: {
                                title: '',
                                minValue: 0,
                                maxValue: maxValue,
                                textPosition: 'none',
                                gridlines:
                                        {
                                            color: '#fff'
                                        }
                            },
                            cAxis: {
                                textPosition: 'none',
                                title: '',
                            },
                            legend: 'none', colors: catImgCode
                        });
                    $('#spnDocCallAvg_' + monthAr[c]).html('(Total:' + parseFloat(totalCoverage).toFixed(2) + ')');
                }
            }
        }
        else {
            $("#dvDocCalAvg").html('No Data available');
            $("#dvDocCalAvg").css('text-align', 'center');
            $("#dvDocCalAvg").css('font-style', 'italic');
            $("#dvDocCalAvg").css('background-color', '#fff');
        }
    }
    else {
        $("#dvDocCalAvg").html('No Data available');
        $("#dvDocCalAvg").css('text-align', 'center');
        $("#dvDocCalAvg").css('font-style', 'italic');
        $("#dvDocCalAvg").css('background-color', '#fff');
    }
}

function fnChemistCallAverage() {
    $.blockUI();
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";
    var regionCodes = fnGetRegionCodes();//fnGetRegionNames();

    $.ajax({
        type: 'POST',
        url: "DashBoard/GetChemistCallAverage",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                fnBindChemistCallAvgChart(jsonData);
            }
            else {
                $("#dvCheCallAvg").html('No data available');
                $("#dvCheCallAvg").css('text-align', 'center');
                $("#dvCheCallAvg").css('font-style', 'italic');
                $("#dvCheCallAvg").css('background-color', '#fff');
            }
        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}
function fnCategoryCoverage() {
    $.blockUI();
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";

    // var regionNames = fnGetRegionNames();
    var regionCodes = fnGetRegionCodes();
    var divisionCode = fnGetDivisionCode();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetCategoryCoverage",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "&DivisionCode=" + divisionCode + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                fnBindCategoryCoverage(jsonData);
            }
            $('#imgScroll').removeClass("ScrollUp");
            $('#imgScroll').addClass("ScrollDown");
            $("#dvLeftPanel").hide();
            $("#imgloginLoad").hide();
        },
        error: function (e) {
            $('#imgScroll').removeClass("ScrollUp");
            $('#imgScroll').addClass("ScrollDown");
            $("#dvLeftPanel").hide();
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

//function fnBindCategoryCoverage(jsonData) {
//    
//    if (jsonData.Tables[0] != undefined && jsonData.Tables[0] != '') {
//        if (jsonData.Tables[0].Rows.length > 0) {
//            var total = 0;
//            var achTotal = 0;
//            var totalApprovedDoctorsCnt = 0;
//            var totalAchApprovedDoctorsCnt = 0;
//            var data = "[['Category','% Coverage','% Visit Achieved'],";
//            //Individual Category
//            for (var a = 0; a < disCatArr.length; a++) {
//                //Coverage
//                data += "['" + disCatNameArr[a] + "',";
//                var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[a] + "')]");
//                if (disJson != false) {
//                    total = parseFloat(total) + parseFloat(disJson[0].CategoryValue);
//                    totalApprovedDoctorsCnt = parseFloat(totalApprovedDoctorsCnt) + parseFloat(disJson[0].Total_Approved_Doctors);
//                    data += disJson[0].CategoryValue + ',';
//                }
//                else {
//                    data += 0 + ',';
//                }
//                //visit  achieved
//                var disAchJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Doctor_Category_Code=='" + disCatArr[a] + "')]");
//                if (disAchJson != false) {
//                    achTotal = parseFloat(achTotal) + parseFloat(disAchJson[0].CategoryValue);
//                    totalAchApprovedDoctorsCnt = parseFloat(totalAchApprovedDoctorsCnt) + parseFloat(disAchJson[0].Total_Approved_Doctors);
//                    data += disAchJson[0].CategoryValue + '],';
//                }
//                else {
//                    data += 0 + '],';
//                }
//            }
//            //Total
//            var totalCatPercentage = parseFloat((parseFloat(total) / parseFloat(totalApprovedDoctorsCnt)) * 100).toFixed(0);
//            if (isNaN(totalCatPercentage)) {
//                totalCatPercentage = 0;
//            }
//            var totalVisitAchPercentage = parseFloat((parseFloat(achTotal) / parseFloat(totalAchApprovedDoctorsCnt)) * 100).toFixed(0);
//            if (isNaN(totalVisitAchPercentage)) {
//                totalVisitAchPercentage = 0;
//            }

//            data += "['Total'," + totalCatPercentage + "," + totalVisitAchPercentage + "]]";

//            data = eval('(' + data + ')');
//            var chartdata = google.visualization.arrayToDataTable(data);
//            //new google.visualization.Gauge(document.getElementById("dvCat_" + disCatArr[b])).draw(chartdata, options);
//            new google.visualization.BarChart(document.getElementById('dvCatAvg')).draw(chartdata,
//	           {title:"% Coverage / % Visit Achieved",
//	               width:350, height:200,
//	               vAxis: {title: "Year"},
//	               hAxis: {title: "Percentage"},
//	               legend: {position: 'bottom', textStyle: {fontSize: 10}}
//	           }
//);
//        }
//    }
//}

function fnBindCategoryCoverage(jsonData) {
    var tableContent = "";
    if (jsonData.Tables[0] != undefined) {
        if (jsonData.Tables[0].Rows.length > 0) {
            var total = 0;
            var achTotal = 0;
            var totalApprovedDoctorsCnt = 0;
            var len = 100 / (parseFloat(disCatArr.length) + 2);
            tableContent += "<table style='width:100%;border:1px solid #ddd;' cellspacing=0 cellpadding=0><thead><tr><td style='width:" + parseFloat(len).toFixed(0) + "%;' class='tdBorder'></td>";
            for (var i = 0; i < disCatNameArr.length; i++) {
                tableContent += "<td style='width:" + parseFloat(len).toFixed(0) + "%;font-weight: bold;text-align: center;' class='tdBorder'>" + disCatNameArr[i] + "</td>";
            }
            tableContent += "<td style='width:" + parseFloat(len).toFixed(0) + "%;font-weight: bold;text-align: center;' class='tdBorder'>Total</td></tr></thead><tbody style='background-color: #fff;'>";
            if (disCatArr.length > 0) {

                tableContent += "<tr><td style='width:" + parseFloat(len).toFixed(0) + "% !important;text-align: center;vertical-align: middle;font-weight: bold;' class='tdBorder'>";
                tableContent += "<div style='float:left'>Coverage(Met)</div>";
                tableContent += "<div class='helpIcon'>";
                tableContent += "<img src='../Images/HelpIcon.png' onclick='fnHelp(\"ACTIVITY_DASHBOARD\",\"COVERAGE\")' />";
                tableContent += "</div>";
                tableContent += "</td>";

                //Coverage
                for (var a = 0; a < disCatArr.length; a++) {
                    var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[a] + "')]");
                    if (disJson != false) {
                        tableContent += "<td style='width:" + parseFloat(len).toFixed(0) + "%;' class='tdBorder'>";
                        tableContent += "<div id='dvCat_" + disCatArr[a] + "' style='width:80%;float:left;'></div>";
                        tableContent += "<div style='width:20%;float:left;'>" + parseFloat(disJson[0].Value).toFixed(0) + "%</div></td>";
                        //  total = parseFloat(total) + parseFloat(disJson[0].Value);
                        total = parseFloat(total) + parseFloat(disJson[0].CategoryValue);
                        totalApprovedDoctorsCnt = parseFloat(totalApprovedDoctorsCnt) + parseFloat(disJson[0].Total_Approved_Doctors)
                    }
                    else {
                        tableContent += "<td style='width:" + parseFloat(len).toFixed(0) + "%;'  class='tdBorder'><div id='dvCat_" + disCatArr[a] + "' style='width:80%;float:left;'></div>";
                        tableContent += "<div style='width:20%;float:left;'>0%</div></td>";
                    }

                }

                var totalPercentage = parseFloat((parseFloat(total) / parseFloat(totalApprovedDoctorsCnt)) * 100).toFixed(0);
                if (isNaN(totalPercentage)) {
                    totalPercentage = 0;
                }
                tableContent += "<td   style='width:" + parseFloat(len).toFixed(0) + "%;' class='tdBorder'><div id='dvCat_" + (parseFloat(disCatArr.length) + 1) + "' style='width:80%;float:left;'></div>";
                tableContent += "<div style='width:20%;float:left;'>" + totalPercentage + "%</div></td>";

                tableContent += "</tr>";
                totalApprovedDoctorsCnt = 0;
                //Visit Objective achieved
                tableContent += "<tr><td style='width:" + parseFloat(len).toFixed(0) + "%;text-align: center;vertical-align: middle;font-weight: bold;' class='tdBorder'>";
                tableContent += "<div style='float:left'>Visit Objective achieved as per category visit standard</div>";

                tableContent += "<div class='helpIcon'>";
                tableContent += "<img src='../Images/HelpIcon.png' onclick='fnHelp(\"ACTIVITY_DASHBOARD\",\"VISIT_OBJECTIVE\")' />";
                tableContent += "</div>";

                tableContent += "</td>";
                for (var a = 0; a < disCatArr.length; a++) {

                    var disJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Doctor_Category_Code=='" + disCatArr[a] + "')]");
                    if (disJson != false) {
                        tableContent += "<td style='width:" + parseFloat(len).toFixed(0) + "%;' class='tdBorder'>";
                        tableContent += "<div id='dvCatAch_" + disCatArr[a] + "' style='width:80%;float:left;'></div>";
                        tableContent += "<div style='width:20%;float:left;'>" + parseFloat(disJson[0].Value).toFixed(0) + "% </div></td>";
                        //  achTotal = parseFloat(achTotal) + parseFloat(disJson[0].Value);
                        achTotal = parseFloat(achTotal) + parseFloat(disJson[0].CategoryValue);
                        totalApprovedDoctorsCnt = parseFloat(totalApprovedDoctorsCnt) + parseFloat(disJson[0].Total_Approved_Doctors)
                    }
                    else {
                        tableContent += "<td  class='tdBorder'><div id='dvCatAch_" + disCatArr[a] + "' style='width:80%;float:left;'></div>";
                        tableContent += "<div style='width:20%;float:left;'>0%</div></td>";
                    }

                }
                var totalAchPercentage = parseFloat((parseFloat(achTotal) / parseFloat(totalApprovedDoctorsCnt)) * 100).toFixed(0);
                if (isNaN(totalAchPercentage)) {
                    totalAchPercentage = 0;
                }
                tableContent += "<td style='width:" + parseFloat(len).toFixed(0) + "%;' class='tdBorder' ><div id='dvCatAch_" + (parseFloat(disCatArr.length) + 1) + "' style='width:80%;float:left;'></div>";
                //   tableContent += "<div style='width:20%;float:left;'>" + parseFloat(parseFloat(achTotal) / parseFloat(disCatArr.length)).toFixed(0) + "%</div></td>";
                tableContent += "<div style='width:20%;float:left;'>" + totalAchPercentage + "%</div></td>";
                tableContent += "</tr>";
            }
            tableContent += "</tbody></table>";
            $("#dvCatAvg").html(tableContent);
            for (var b = 0; b < disCatArr.length; b++) {
                var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[b] + "')]");
                if (disJson != false) {
                    var data = "[['label','Value'],";
                    data += "['" + disCatNameArr[b] + "',";
                    data += disJson[0].Value;
                    data += "]]";
                    data = eval('(' + data + ')');
                    var options = {
                        redColor: '#FF9966',
                        yellowColor: '#FFFF00',
                        greenColor: '#00CC00',
                        redFrom: $("#txtRedFrom").val(), redTo: $("#txtRedTo").val(),
                        yellowFrom: $("#txtYellowFrom").val(), yellowTo: $("#txtYellowTo").val(),
                        greenFrom: $("#txtGreenFrom").val(), greenTo: $("#txtGreenTo").val(),
                        minorTicks: 10,
                        majorTicks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

                    }
                    var chartdata = google.visualization.arrayToDataTable(data);
                    new google.visualization.Gauge(document.getElementById("dvCat_" + disCatArr[b])).draw(chartdata, options);
                    // Second Table
                }
                var disJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Doctor_Category_Code=='" + disCatArr[b] + "')]");
                if (disJson != false) {
                    var data = "[['label','Value'],";
                    data += "['" + disCatNameArr[b] + "',";
                    data += disJson[0].Value;
                    data += "]]";
                    data = eval('(' + data + ')');
                    var options = {
                        redColor: '#FF9966',
                        yellowColor: '#FFFF00',
                        greenColor: '#00CC00',
                        redFrom: $("#txtRedFrom").val(), redTo: $("#txtRedTo").val(),
                        yellowFrom: $("#txtYellowFrom").val(), yellowTo: $("#txtYellowTo").val(),
                        greenFrom: $("#txtGreenFrom").val(), greenTo: $("#txtGreenTo").val(),
                        minorTicks: 10,
                        majorTicks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

                    }
                    var chartdata = google.visualization.arrayToDataTable(data);
                    new google.visualization.Gauge(document.getElementById("dvCatAch_" + disCatArr[b])).draw(chartdata, options);
                }
            }
            //Total
            var data = "[['label','Value'],";
            data += "['Total',";
            data += parseFloat(totalPercentage).toFixed(0);
            data += "]]";
            data = eval('(' + data + ')');
            var options = {
                redColor: '#FF9966',
                yellowColor: '#FFFF00',
                greenColor: '#00CC00',
                redFrom: $("#txtRedFrom").val(), redTo: $("#txtRedTo").val(),
                yellowFrom: $("#txtYellowFrom").val(), yellowTo: $("#txtYellowTo").val(),
                greenFrom: $("#txtGreenFrom").val(), greenTo: $("#txtGreenTo").val(),
                minorTicks: 10,
                majorTicks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

            }
            var chartdata = google.visualization.arrayToDataTable(data);
            new google.visualization.Gauge(document.getElementById("dvCat_" + (parseFloat(disCatArr.length) + 1))).draw(chartdata, options);

            var data = "[['label','Value'],";
            data += "['Total',";
            data += parseFloat(totalAchPercentage).toFixed(0);
            data += "]]";
            data = eval('(' + data + ')');
            var options = {
                redColor: '#FF9966',
                yellowColor: '#FFFF00',
                greenColor: '#00CC00',
                redFrom: $("#txtRedFrom").val(), redTo: $("#txtRedTo").val(),
                yellowFrom: $("#txtYellowFrom").val(), yellowTo: $("#txtYellowTo").val(),
                greenFrom: $("#txtGreenFrom").val(), greenTo: $("#txtGreenTo").val(),
                minorTicks: 10,
                majorTicks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

            }
            var chartdata = google.visualization.arrayToDataTable(data);
            new google.visualization.Gauge(document.getElementById("dvCatAch_" + (parseFloat(disCatArr.length) + 1))).draw(chartdata, options);

        }
    }
}
function fnBindChemistCallAvgChart(jsonData) {
    if (jsonData.Tables[0] != undefined) {
        if (jsonData.Tables[0].Rows.length > 0) {
            var data = "[['Month',''],";
            var maxArr = new Array();
            for (var c = 0; c < monthAr.length; c++) {
                data += "[";
                data += "'" + shortMonthArray[parseInt(monthAr[c]) - 1] + "',";
                var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Month=='" + monthAr[c] + "')]");
                if (disJson != false) {
                    maxArr.push(disJson[0].Value);
                    data += disJson[0].Value;
                }
                else {
                    data += 0;

                }
                if (c < monthAr.length - 1) {
                    data += "],";
                }
                else {
                    data += "]";
                }
            }
            data += "]";

            data = eval('(' + data + ')');
            var maxValue = Math.max.apply(Math, maxArr); // 3
            //var options = {};
            //options.cht = 'bvg';
            //options.chxt = '';
            //options.chyt = '';
            //// options.chco = catImgCode;//'3399CC,80C65A,FF0000,FFCC33,BBCCED,C870FF'; // have to fill the dynamic colors
            //var suffix = 'N**';
            //var color = '000000';
            //var index = 0;
            //// -1 tells Google Chart API to draw a label on all bars.
            //var allbars = -1;
            //// 10 pixels font size for the labels.file:///C:/Users/raji/Desktop/Dashboard/Dashboard/PMT051232_001_Activity%20Dashboard.jpg
            //var fontSize = 9;
            //// The following loop now draws one long statement for chm
            //var maxCols = monthAr.length;
            //var divider = '|';
            ////var stringHolder = '0';
            //var labelString = [suffix, color, index, allbars, fontSize];
            //for (var count = 0; count <= maxCols; count++) {
            //    labelString = labelString + '|' + [suffix, color, index, allbars, fontSize];
            //    index++;
            //}
            //options.width = 100;
            //options.height = 120;
            //options.vAxis = { title: '', minValue: 0, textPosition: 'none' };
            //options.hAxis = { title: '', minValue: 0, textPosition: 'none' };
            //options.legend = 'none';
            //options.series = [{ lineWidth: 0 }];
            ////options.colors = catImgCode;
            //options.chm = labelString;
            var chartData = google.visualization.arrayToDataTable(data);
            new google.visualization.BarChart(document.getElementById('dvCheCallAvg')).draw(chartData, {
                width: 100,
                height: 100,
                cht: 'bvg',
                hAxis: {
                    title: '',
                    minValue: 0,
                    maxValue: maxValue,
                    textPosition: 'none',
                    gridlines:
                        {
                            color: '#fff'
                        }
                },
                cAxis: {
                    title: '',
                },
                legend: 'none',
                colors: catImgCode
            });
            $("#dvTitleCheCallAvg").html('Chemist Call Average');
            $("#dvTitleCheCallAvg").css('font-weight', 'bold');
            $("#dvTitleCheCallAvg").css('border-bottom', '1px solid #DDD');
        }
        else {
            $("#dvCheCallAvg").html('No data available');
            $("#dvCheCallAvg").css('text-align', 'center');
            $("#dvCheCallAvg").css('font-style', 'italic');
            $("#dvCheCallAvg").css('background-color', '#fff');
        }
    }
    else {
        $("#dvCheCallAvg").html('No data available');
        $("#dvCheCallAvg").css('text-align', 'center');
        $("#dvCheCallAvg").css('font-style', 'italic');
        $("#dvCheCallAvg").css('background-color', '#fff');
    }
    //dvCheCallAvg
}
function fnBindCategory() {
    $.blockUI();
    var divisionCode = fnGetDivisionCode();
    disCatArr = new Array();
    disCatNameArr = new Array();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetCategory",
        data: "DivisionCode=" + divisionCode + "",
        async: false,
        success: function (jsonData) {
            if (jsonData != '') {
                $("#dvAjaxLoad").show();
                jsonData = eval('(' + jsonData + ')');
                var content = "";
                content += "<table style='width:100%;padding-left:12px;padding-top:12px;'>";
                for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                    content += "<tr>";
                    content += "<td><div style='background-color:" + catImgCode[i] + ";height: 10px;width: 10px;'></div></td>";
                    content += "<td>" + jsonData.Tables[0].Rows[i].Category_Name + "</td>";
                    content += "</tr>";
                    if ($.inArray(jsonData.Tables[0].Rows[i].Category_Code, disCatArr) == -1) {
                        disCatArr.push(jsonData.Tables[0].Rows[i].Category_Code);
                        disCatNameArr.push(jsonData.Tables[0].Rows[i].Category_Name);
                    }
                }
                content += "</table>";
                fnCategoryWiseVisitAnanlysis();
                fnWorkCalculation();
                fnDoctorCallAverage();
                fnChemistCallAverage();

                fnCategoryCoverage();
                $("#dvLegend").html(content);
                $("#dvAjaxLoad").hide();
                //$("#imgloginLoad").hide()
            }
            else {
                $("#imgloginLoad").hide()
                $("#dvLegend").html('No category available');

            }
        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}


function fnBindMonth() {
    $('option', $("#drpPeriod")).remove();
    if ($("#drpPeriodType").val().toUpperCase() == "M") {

        var currentMonth = $("#hdnCurrentDate").val().split('-')[1];
        $("#drpPeriod").append("<option value=0>-Select Period-</option>");
        var fixedYear = 2014;
        var year = new Date($("#hdnCurrentDate").val()).getFullYear();
        var year_to_add = fixedYear;
        for (var j = year_to_add; j <= year; j++) {
            for (var i = 0; i < monthArray.length; i++) {
                $("#drpPeriod").append("<option value=" + year_to_add + "-" + monthNumArray[i] + ">" + year_to_add + "-" + monthArray[i] + "</option>");
                if (year_to_add == year && monthArray[i] == monthArray[new Date($("#hdnCurrentDate").val()).getMonth()]) {
                    break;
                }
            }
            year_to_add = year_to_add + 1;
        }
        $("#tdPeriod").html('Select Month');
    }
    else if ($("#drpPeriodType").val().toUpperCase() == "Q") {
        $("#drpPeriod").append("<option value=0>-Select Period-</option>");
        var select = $("#drpPeriod");
        var date = new Date($("#hdnCurrentDate").val());
        var fixedYear = 2014;
        var year = date.getFullYear();
        var quarter = Math.floor(date.getMonth() / 3);
        var year_to_add = fixedYear;
        for (var i = year_to_add; i <= year; i++) {
            for (var j = 0; j < 4; j++) {
                var option = $('<option/>');
                var quarter_value = get_quarter_text(j).split('|')[1];
                var quarter_text = get_quarter_text(j).split('|')[0];

                var value = year_to_add + '-' + quarter_value;
                var text = year_to_add + ' ' + quarter_text;

                option.val(value).text(text);
                if (year_to_add == year && quarter == j) {
                    option.css('font-weight', 'bold !important')
                }
                select.append(option);
                if (year_to_add == year && quarter == j) {
                    break;
                }

            }
            year_to_add = year_to_add + 1;
        }
        $("#tdPeriod").html('Select Quarter');
    }
}

function get_quarter_text(num) {
    switch (num) {
        case 0:
            return 'Jan-Mar|1_2_3';
        case 1:
            return 'Apr-Jun|4_5_6';
        case 2:
            return 'Jul-Sep|7_8_9';
        case 3:
            return 'Oct-Dec|10_11_12';
    }
}

function fnGetMonthYear() {
    var arr = $("#drpPeriod").val().split('-');
    var arr1 = arr[1].split('_');
    month = "";
    for (var m = 0; m < arr1.length; m++) {
        month += "^" + arr1[m] + "^,";
    }
    var year = arr[0].toString();
    month = month.slice(0, -1) + "_" + year;
    return month;
}
function fnGetRegionNames() {
    regionNames = "";
    var isAll = false;


    $('select#drpTerritory > option:selected').each(function () {
        if ($(this).val() == "ALL") {
            isAll = true;
        }
    });
    if (!isAll) {
        $('select#drpTerritory > option:selected').each(function () {
            regionNames += "^" + $(this).text() + "^,";
        });
    }
    else {
        $('select#drpTerritory > option').each(function () {
            if ($(this).val() != "ALL") {
                regionNames += "^" + $(this).text() + "^,";
            }
        });
    }

    regionNames = regionNames.slice(0, -1);
    if (regionNames == "") {
        fnMsgAlert('info', 'info', 'Please select atleast one region');
        return;
    }
    var regionArr = new Array();
    regionArr = regionNames.split('^');

    if (regionArr.length == 3) {
        $("#dvRegion").html('Activity insights of ' + regionArr[1] + " *")
    }
    else {
        $("#dvRegion").html('Activity insights of ' + regionArr[1] + " and selected regions *")
    }
    return regionNames;
}



function fnGetRegionCodes() {
    var regionCodes = "";
    var isAll = false;


    $('select#drpTerritory > option:selected').each(function () {
        if ($(this).val() == "ALL") {
            isAll = true;
        }
    });
    if (!isAll) {
        $('select#drpTerritory > option:selected').each(function () {
            regionCodes += "^" + $(this).val() + "^,";
        });
    }
    else {
        $('select#drpTerritory > option').each(function () {
            if ($(this).val() != "ALL") {
                regionCodes += "^" + $(this).val() + "^,";
            }
        });
    }

    regionCodes = regionCodes.slice(0, -1);
    return regionCodes;
}

function fnGetDivisionCode() {
    var divisionCode = "";
    if ($("#drpDivision").is(":visible")) {
        if ($("#drpDivision").val() != 0) {
            divisionCode = $("#drpDivision").val();
        }

    }
    return divisionCode;
}
function fnPageLoad() {
    monthAr = new Array();
    var year = new Date($("#hdnCurrentDate").val()).getFullYear();
    var mnth = new Date($("#hdnCurrentDate").val()).getMonth() + 1;
    catImgCode = ['#A62525', '#7CC23D', '#58A2C9', '#109618', '#990099', '#0099C6'];
    monthAr.push(mnth)
    month = "^" + mnth + "^_" + year;
    $("#drpPeriod").append('<option value="' + year + '-' + mnth + '" selected>' + year + '-' + monthArray[new Date($("#hdnCurrentDate").val()).getMonth()] + '</option>');
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetRegionByDivision",
        data: "A",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                if (jsonData.Tables[0] != undefined) {
                    if (jsonData.Tables[0].Rows.length > 0) {
                        for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                            regionNames += "^" + jsonData.Tables[0].Rows[i].Region_Name + "^,";
                            var regions = "<select id='drpTerritory' multiple='multiple'>";
                            // $('option', $("#drpTerritory")).remove();
                            //  $("#drpTerritory").append("<option value=ALL selected>ALL</option>");
                            regions += "<option value=ALL selected>ALL</option>";
                            for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                                //  $("#drpTerritory").append("<option value=" + jsonData.Tables[0].Rows[i].Region_Code + ">" + jsonData.Tables[0].Rows[i].Region_Name + "</option>");
                                regions += "<option value=" + jsonData.Tables[0].Rows[i].Region_Code + ">" + jsonData.Tables[0].Rows[i].Region_Name + "</option>"
                            }
                            regions += "</select>";
                            //   $("#drpTerritory").multiselect('destroy');
                            //   $("#drpTerritory").multiselect();
                            //if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
                            //$("#selectall").click(function () {
                            //    $('.case').attr('checked', this.checked);
                            //});

                            //$("#drpTerritory").multiselect({
                            //    noneSelectedText: 'Select Regions'
                            //}).multiselectfilter();
                            $("#dvRegionList").html(regions);
                            $("#drpTerritory").multiselect("destroy").multiselect().multiselectfilter();
                        }
                        regionNames = regionNames.slice(0, -1);
                        if (jsonData.Tables[1].Rows.length > 0) {
                            $("#drpDivision").val(jsonData.Tables[1].Rows[0].Division_Code)
                        }
                        fnGetRegionType();
                        fnBindCategory();
                    }
                    else {
                        fnMsgAlert('info', 'Info', 'Can not find user data');
                    }
                }
                else {
                    fnMsgAlert('info', 'Info', 'Can not find user data');
                }
            }

        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'Page Load failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });


}


function fnActivityVsSalesSubmit() {
    //$("#dvLeftPanel").hide();
    $.blockUI();
    $("#imgloginLoad").show()
    fnClearActivityVsSalesDashBoard();
    if ($("#drpDivision").is(":visible")) {
        if ($("#drpDivision").val() == 0) {
            $("#imgloginLoad").hide()
            fnMsgAlert('info', 'info', 'Please select any division');
            return false;
        }
    }
    if ($("#drpRegionType").val() == 0) {
        $("#imgloginLoad").hide()
        fnMsgAlert('info', 'info', 'Please select any region type');
        return false;
    }
    if ($("#drpPeriodType").val() == 0) {
        $("#imgloginLoad").hide()
        fnMsgAlert('info', 'info', 'Please select any period type');
        return false;
    }
    if ($("#drpPeriod").val() == null || $("#drpPeriod").val() == 0) {
        $("#imgloginLoad").hide()
        fnMsgAlert('info', 'info', 'Please select any period');
        return false;
    }

    monthAr = new Array();
    catImgCode = ['#A62525', '#7CC23D', '#58A2C9', '#109618', '#990099', '#0099C6'];
    var arr = $("#drpPeriod").val().split('-');
    var arr1 = arr[1].split('_');
    for (var m = 0; m < arr1.length; m++) {
        monthAr.push(arr1[m].toString())
    }
    fnGetRegionNames();
    fnBindDivCategory();
    $("#imgloginLoad").hide()
}
function fnBindDivCategory() {
    var divisionCode = fnGetDivisionCode();
    disCatArr = new Array();
    disCatNameArr = new Array();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetCategory",
        data: "DivisionCode=" + divisionCode + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                var content = "";
                content += "<table style='width:100%;padding-left:12px;padding-top:12px;'>";
                for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                    content += "<tr>";
                    content += "<td><div style='background-color:" + catImgCode[i] + ";height: 10px;width: 10px;'></div></td>";
                    content += "<td>" + jsonData.Tables[0].Rows[i].Category_Name + "</td>";
                    content += "</tr>";
                    if ($.inArray(jsonData.Tables[0].Rows[i].Category_Code, disCatArr) == -1) {
                        disCatArr.push(jsonData.Tables[0].Rows[i].Category_Code);
                        disCatNameArr.push(jsonData.Tables[0].Rows[i].Category_Name);
                    }
                }
                content += "</table>";
                fnGetCategorywiseDoctorCoverage();
                fnGetCategoryDoctors();
                fnGetCategoryAndDoctorCoverage();
                fnProducts();
            }
            else {
                $("#dvLegend").html('No category available');

            }
        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

/* Get Categorywise Doctor Coverage */
function fnGetCategorywiseDoctorCoverage() {
    $.blockUI();
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";

    //var regionNames = fnGetRegionNames();
    var regionCodes = fnGetRegionCodes();
    var divisionCode = fnGetDivisionCode();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetCategorywiseDoctorCoverage",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "&DivisionCode=" + divisionCode + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = jsonData.replace(/NaN/g, '0');
                jsonData = eval('(' + jsonData + ')');
                fnBindCategorywiseDoctorCoverage(jsonData);
            }
            else {
                $("#dvCatwiseDocCoverage").html('No Data available');
                $("#dvCatwiseDocCoverage").addClass('NoValue');
            }
        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

function fnBindCategorywiseDoctorCoverage(jsonData) {
    if (jsonData.Tables[0] != undefined) {
        if (jsonData.Tables[0].Rows.length > 0) {
            var maxArray = new Array();
            var data = "[['Coverage','Value'],";

            for (var j = 0; j < disCatArr.length; j++) {
                data += "['" + disCatNameArr[j] + "',";
                var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "')]");
                if (disJson != false) {
                    data += disJson[0].Value;
                    maxArray.push(disJson[0].Value);
                }
                else {
                    data += 0;
                }
                data += "]";
                if (j < disCatArr.length - 1) {
                    data += ",";
                }
            }
            data += "]";
            data = eval('(' + data + ')');
            var maxVal = Math.max.apply(Math, maxArray); // 3
            if (maxVal > 0) {
                var chartData = google.visualization.arrayToDataTable(data);
                // Create and draw the visualization.
                new google.visualization.PieChart(document.getElementById('dvCatwiseDocCoverage')).
                draw(chartData, { legend: { position: 'bottom' }, is3D: 'true', colors: catImgCode });
            }
            else {
                $("#dvCatwiseDocCoverage").html('No Data available');
                $("#dvCatwiseDocCoverage").addClass('NoValue');
            }
        }
        else {
            $("#dvCatwiseDocCoverage").html('No Data available');
            $("#dvCatwiseDocCoverage").addClass('NoValue');
        }
    }
    else {
        $("#dvCatwiseDocCoverage").html('No Data available');
        $("#dvCatwiseDocCoverage").addClass('NoValue');
    }

}

/* Get Categorywise Doctor Coverage */
function fnGetCategoryDoctors() {
    $.blockUI();
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";

    //var regionNames = fnGetRegionNames();
    var regionCodes = fnGetRegionCodes();
    var divisionCode = fnGetDivisionCode();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetNoOfDoctors",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "&DivisionCode=" + divisionCode + "",
        success: function (jsonData) {
            jsonData = eval('(' + jsonData + ')');
            if (jsonData.Tables[0] != undefined) {
                fnBindCategorywiseDoctors(jsonData);
            }
            else {
                $("#dvCatwiseDoctors").html('No Data available');
                $("#dvCatwiseDoctors").addClass('NoValue');
            }
        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

function fnBindCategorywiseDoctors(jsonData) {
    if (jsonData.Tables[0].Rows.length > 0) {
        var data = "[['Coverage','Value'],";
        for (var j = 0; j < disCatArr.length; j++) {
            data += "['" + disCatNameArr[j] + "',";
            var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "')]");
            if (disJson != false) {
                data += disJson[0].Value;
            }
            else {
                data += 0;
            }
            data += "]";
            if (j < disCatArr.length - 1) {
                data += ",";
            }
        }
        data += "]";
        data = eval('(' + data + ')');
        var chartData = google.visualization.arrayToDataTable(data);
        // Create and draw the visualization.
        new google.visualization.PieChart(document.getElementById('dvCatwiseDoctors')).
        draw(chartData, { title: "", pieHole: '0.5', legend: { position: 'bottom' }, colors: catImgCode });
    }
    else {
        $("#dvCatwiseDoctors").html('No Data available');
        $("#dvCatwiseDoctors").addClass('NoValue');
    }

}


/* Get Category And Doctor Coverage */
function fnGetCategoryAndDoctorCoverage() {
    $.blockUI();
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";

    //var regionNames = fnGetRegionNames();
    var regionCodes = fnGetRegionCodes();
    var divisionCode = fnGetDivisionCode();
    $.ajax({
        type: 'POST',
        url: "DashBoard/CategoryAndDoctorCoverage",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "&DivisionCode=" + divisionCode + "",
        success: function (jsonData) {

            jsonData = eval('(' + jsonData + ')');
            if (jsonData.Tables[0] != undefined) {
                fnBindCategoryAndDoctorCoverage(jsonData);
            }
            else {
                $("#dvCatAndCoverage").html('No data available');
                $("#dvCatAndCoverage").addClass('NoValue');
            }
        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

function fnBindCategoryAndDoctorCoverage(jsonData) {
    if (jsonData.Tables[0].Rows.length > 0) {
        //var tableContent = "";
        //tableContent += "<div style='width:100%;float:left;'><div id='dvCover' style='float:left;width:50%;'></div>";
        //tableContent += "<div id='dvVisited' style='float:left;width:50%;'></div></div>";
        //tableContent += "<div style='width:100%;float:left;'><div style='float:left;width:40%;padding-left:10%'>% Coverage</div>";
        //tableContent += "<div style='float:left;width:40%;padding-left:10%'>% Visit achieved</div></div>";
        //tableContent += "<div style='width:100%'><div id='dvDetailed' style='float:left;width:50%;'></div>";
        //tableContent += "<div id='dvSample' style='float:left;width:50%;'></div></div>";
        //tableContent += "<div style='width:100%;float:left;'><div style='float:left;width:40%;;padding-left:7%'>No of Detailed doctors</div>";
        //tableContent += "<div style='float:left;width:40%;padding-left:7%'>No of sample & Gift Covered</div></div>";
        //$("#dvCatAndCoverage").html(tableContent);
        //var data = "";
        //var dataName = "";
        //var total = 0;
        //for (var i = 0; i < jsonData.Tables[0].Rows.length ; i++) {
        //    //if (parseFloat(jsonData.Tables[0].Rows[i].Value) > 0) {
        //    data += jsonData.Tables[0].Rows[i].Value;
        //    total = parseFloat(total) + parseFloat(jsonData.Tables[0].Rows[i].Value);
        //    dataName += jsonData.Tables[0].Rows[i].Category_Name;
        //    if (i < jsonData.Tables[0].Rows.length - 1) {
        //        data += ",";
        //        dataName += "|";
        //    }
        //    //}
        //}
        //data += "," + total;
        //dataName += "|Total";
        //if (dataName != '') {
        //    var src = "http://chart.apis.google.com/chart?chs=250x100&cht=gom&chd=t:" + data + "&chxt=y&chco=9E2423,9E2423,3C86AA,3C86AA,3C86AA,7CC23C,7CC23C&chl=" + dataName + "";
        //}
        //else {
        //    var src = "http://chart.apis.google.com/chart?chs=250x100&cht=gom&chd=t:" + data + "&chxt=y&chco=9E2423,9E2423,3C86AA,3C86AA,3C86AA,7CC23C,7CC23C";
        //}
        var total = "0";
        var achTotal = "0";
        var totalApprovedDoctorsCnt = "0";
        var totalAchApprovedDoctorsCnt = "0";
        var data = "";
        data += "[['Category', '% Coverage(Master)', '% Visit Achieved'],";
        for (var j = 0; j < disCatArr.length; j++) {
            data += "['" + disCatNameArr[j] + "',";
            var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "')]");
            if (disJson != false) {
                data += disJson[0].Value + ",";
                total = parseFloat(total) + parseFloat(disJson[0].Value);
                //  totalApprovedDoctorsCnt = parseFloat(totalApprovedDoctorsCnt) + parseFloat(disJson[0].Total_Approved_Doctors);
            }
            else {
                data += 0 + ",";
            }

            var disAchJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "')]");
            if (disAchJson != false) {
                data += disAchJson[0].Value + "],";
                achTotal = parseFloat(achTotal) + parseFloat(disAchJson[0].Doctor_Calls_Made);
                totalAchApprovedDoctorsCnt = parseFloat(totalAchApprovedDoctorsCnt) + parseFloat(disAchJson[0].Total_Approved_Doctors);
            }
            else {
                data += 0 + "],";
            }
        }
        //Total
        //   var totalCatPercentage = parseFloat((parseFloat(total) / parseFloat(totalApprovedDoctorsCnt)) * 100).toFixed(0);
        //var totalCatPercentage = ((parseFloat(totalApprovedDoctorsCnt) / parseFloat(totalApprovedDoctorsCnt)) * 100).toFixed(0);
        //if (isNaN(totalCatPercentage)) {
        //    totalCatPercentage = 0;
        //}
        //var totalVisitAchPercentage = parseFloat((parseFloat(achTotal) / parseFloat(totalAchApprovedDoctorsCnt)) * 100).toFixed(0);
        //if (isNaN(totalVisitAchPercentage)) {
        //    totalVisitAchPercentage = 0;
        //}
        data += "['Total',100," + parseFloat((parseFloat(achTotal) / parseFloat(totalAchApprovedDoctorsCnt)) * 100).toFixed(0) + "]]";

        // data = data.slice(0, -1);

        //data += "]";
        data = eval('(' + data + ')');
        var chartData = google.visualization.arrayToDataTable(data);
        new google.visualization.BarChart(document.getElementById('dvCatAndCoverage')).
         draw(chartData,
              {
                  // title: "% Coverage / % Visit Achieved",
                  width: 280, height: 300,
                  vAxis: { title: "Year" },
                  hAxis: { title: "Percentage" },
                  legend: { position: 'bottom', textStyle: { fontSize: 10 } }
              }
         );
        //Detailed Doctors

        var data = "";
        total = 0;
        data += "[['Category', 'Count'],";
        for (var j = 0; j < disCatArr.length; j++) {
            data += "['" + disCatNameArr[j] + "',";
            var disJson = jsonPath(jsonData, "$.Tables[2].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "')]");
            if (disJson != false) {
                data += disJson[0].Value;
                total = parseFloat(total) + parseFloat(disJson[0].Value);
            }
            else {
                data += 0;
            }
            data += "],";
        }
        data += "['Total'," + total + "]]";
        data = eval('(' + data + ')');
        var chartData = google.visualization.arrayToDataTable(data);

        new google.visualization.ColumnChart(document.getElementById('dvDetailedDoctors')).
          draw(chartData,
               {
                   //  title: "Detailed Doctors",
                   width: 280, height: 300,
                   hAxis: { title: "Category" },
                   vAxis: { title: "Count" },
                   legend: { position: 'none', textStyle: { fontSize: 10 } }
               }
          );

        data = "";
        var totalNonsampling = 0;
        var totalSampling = 0;
        data += "[['Category', 'Samples Given', 'Non-Samples Given'],";
        for (var j = 0; j < disCatArr.length; j++) {
            data += "['" + disCatNameArr[j] + "',";
            var disJson = jsonPath(jsonData, "$.Tables[3].Rows[?(@.Doctor_Category_Code=='" + disCatArr[j] + "')]");
            if (disJson != false) {
                data += disJson[0].Total_Sampling_Doctors + "," + disJson[0].Value + "],";
                totalSampling = parseFloat(totalSampling) + parseFloat(disJson[0].Total_Sampling_Doctors);
                totalNonsampling = parseFloat(totalNonsampling) + parseFloat(disJson[0].Value);
            }
            else {
                data += 0 + "," + 0 + "],";
            }
        }
        data += "['Total'," + totalSampling + "," + totalNonsampling + "]]";
        data = eval('(' + data + ')');
        var chartData = google.visualization.arrayToDataTable(data);
        var ac = new google.visualization.ComboChart(document.getElementById('dvNonSamples'));
        ac.draw(chartData, {
            // title: 'Doctors who received Samples and gifts',
            width: 280, height: 300,
            vAxis: { title: "Cups" },
            hAxis: { title: "Month" },
            seriesType: "bars",
            series: { 1: { type: "area", color: "blue" } },
            legend: { position: 'bottom', textStyle: { fontSize: 10 } }
        });

        //$("#dvCatAndCoverage")

        //  $("#dvCover").html("<img src='" + src + "' />");
        //var data = "";
        //var dataName = "";
        //var total = 0;
        //for (var i = 0; i < jsonData.Tables[1].Rows.length ; i++) {
        //    // if (parseFloat(jsonData.Tables[1].Rows[i].Value) > 0) {
        //    data += jsonData.Tables[1].Rows[i].Value;
        //    dataName += jsonData.Tables[1].Rows[i].Category_Name;
        //    total = parseFloat(total) + parseFloat(jsonData.Tables[1].Rows[i].Value);
        //    if (i < jsonData.Tables[1].Rows.length - 1) {
        //        data += ",";
        //        dataName += "|";
        //    }
        //    //}
        //}
        //data += "," + total;
        //dataName += "|Total";
        //if (dataName != '') {
        //    var src = "http://chart.apis.google.com/chart?chs=250x100&cht=gom&chd=t:" + data + "&chxt=y&chco=9E2423,9E2423,3C86AA,3C86AA,3C86AA,7CC23C,7CC23C&chl=" + dataName + "";
        //}
        //else {
        //    var src = "http://chart.apis.google.com/chart?chs=250x100&cht=gom&chd=t:" + data + "&chxt=y&chco=9E2423,9E2423,3C86AA,3C86AA,3C86AA,7CC23C,7CC23C";
        //}
        //$("#dvVisited").html("<img src='" + src + "' />");
        //var data = "";
        //var dataName = "";
        //var total = 0;
        //for (var i = 0; i < jsonData.Tables[2].Rows.length ; i++) {
        //    // if (parseFloat(jsonData.Tables[2].Rows[i].Value) > 0) {
        //    data += jsonData.Tables[2].Rows[i].Value;
        //    dataName += jsonData.Tables[2].Rows[i].Category_Name;
        //    total = parseFloat(total) + parseFloat(jsonData.Tables[2].Rows[i].Value);
        //    if (i < jsonData.Tables[3].Rows.length - 1) {
        //        data += ",";
        //        dataName += "|";
        //    }
        //    // }
        //}
        //data += "," + total;
        //dataName += "|Total";
        //if (dataName != '') {
        //    var src = "http://chart.apis.google.com/chart?chs=250x100&cht=gom&chd=t:" + data + "&chxt=y&chco=9E2423,9E2423,3C86AA,3C86AA,3C86AA,7CC23C,7CC23C&chl=" + dataName + "";
        //}
        //else {
        //    var src = "http://chart.apis.google.com/chart?chs=250x100&cht=gom&chd=t:" + data + "&chxt=y&chco=9E2423,9E2423,3C86AA,3C86AA,3C86AA,7CC23C,7CC23C";
        //}
        //$("#dvDetailed").html("<img src='" + src + "' />");
        //var data = "";
        //var dataName = "";
        //var total = 0;
        //for (var i = 0; i < jsonData.Tables[3].Rows.length ; i++) {
        //    //if (parseFloat(jsonData.Tables[3].Rows[i].Value) > 0) {
        //    data += jsonData.Tables[3].Rows[i].Value;
        //    dataName += jsonData.Tables[3].Rows[i].Category_Name;
        //    total = parseFloat(total) + parseFloat(jsonData.Tables[3].Rows[i].Value);
        //    if (i < jsonData.Tables[3].Rows.length - 1) {
        //        data += ",";
        //        dataName += "|";
        //    }
        //    // }
        //}
        //data += "," + total;
        //dataName += "|Total";
        //if (dataName != '') {
        //    var src = "http://chart.apis.google.com/chart?chs=250x100&cht=gom&chd=t:" + data + "&chxt=y&chco=9E2423,9E2423,3C86AA,3C86AA,3C86AA,7CC23C,7CC23C&chl=" + dataName + "";
        //}
        //else {
        //    var src = "http://chart.apis.google.com/chart?chs=250x100&cht=gom&chd=t:" + data + "&chxt=y&chco=9E2423,9E2423,3C86AA,3C86AA,3C86AA,7CC23C,7CC23C";
        //}
        //$("#dvSample").html("<img src='" + src + "' />");
        // $("#dvCatAndCoverage").html(tableContent);
    }
    else {
        $("#dvCatAndCoverage").html('No data available');
        $("#dvCatAndCoverage").addClass('NoValue');
    }
}


function fnProducts() {
    $.blockUI();
    var divisionCode = fnGetDivisionCode();
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetDivisonMappedProducts",
        data: "DivisionCode=" + divisionCode + "",
        success: function (jsonData) {
            jsonData = eval('(' + jsonData + ')');
            $('option', $("#cboProduct")).remove();
            if (jsonData.Tables[0].Rows.length > 0) {
                $('option', $("#cboProduct")).remove();
                for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                    if (i < 10) {
                        $("#cboProduct").append("<option value='" + jsonData.Tables[0].Rows[i].Entity_Code + "' selected>" + jsonData.Tables[0].Rows[i].Product_Name + "</option>");
                    }
                    else {
                        $("#cboProduct").append("<option value='" + jsonData.Tables[0].Rows[i].Entity_Code + "'>" + jsonData.Tables[0].Rows[i].Product_Name + "</option>");
                    }
                }
                $("#cboProduct").multiselect('destroy');
                $("#cboProduct").multiselect();

                fnBindProducts();
                $("#imgloginLoad").hide()
            }
        },
        error: function (e) {
            $("#imgloginLoad").hide()
            fnMsgAlert('error', 'Error', 'Bind Work Calculation failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

function fnGetProductCodes() {
    var productCodes = "";
    $('select#cboProduct > option:selected').each(function () {
        productCodes += "^" + $(this).val() + "^,";
    });
    productCodes = productCodes.slice(0, -1);
    return productCodes;
}


function fnBindProducts() {
    var count = 0;
    $('select#cboProduct > option:selected').each(function () {
        count++;
    });
    if (count == 0) {
        $("#imgloginLoad").hide()
        fnMsgAlert('info', 'Info', 'Please select any products');
        return false;
    }
    if (count > 10) {
        $("#imgloginLoad").hide()
        fnMsgAlert('info', 'Info', 'Please select 10 products');
        return false;
    }

    $("#dvSS").html('');
    var monthYear = fnGetMonthYear();
    var months = monthYear.split('_')[0];
    var years = "^" + monthYear.split('_')[1] + "^";
    var regionCodes = fnGetRegionCodes(); //fnGetRegionNames();
    var divisionCode = fnGetDivisionCode();
    var productCodes = fnGetProductCodes();
    $.ajax({
        type: 'POST',
        url: "DashBoard/SSActivityVsSales",
        data: "Months=" + months + "&Year=" + years + "&RegionCodes=" + regionCodes + "&DivisionCode=" + divisionCode + "&ProductCode=" + productCodes + "",
        success: function (jsonData) {
            jsonData = eval('(' + jsonData + ')');
            if (jsonData.Tables[0].Rows.length > 0) {
                var data = "[";
                data += "['','Product','Yield','Potential'],";
                for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                    var productName = jsonData.Tables[0].Rows[i].Product_Name;
                    data += "['" + jsonData.Tables[0].Rows[i].Product_Name + "',";
                    data += jsonData.Tables[0].Rows[i].Value + ",";
                    var disJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Product_Name=='" + productName + "')]");
                    if (disJson != false) {
                        data += jsonData.Tables[1].Rows[i].Yield + ",";
                        data += jsonData.Tables[1].Rows[i].Potential;
                    } else {
                        data += 0 + ",";
                        data += 0;
                    }
                    if (i < jsonData.Tables[0].Rows.length - 1) {
                        data += "],";
                    }
                    else {
                        data += "]";
                    }
                }
                data += "]";
                data = eval('(' + data + ')');
                var chartData = google.visualization.arrayToDataTable(data);
                var ac = new google.visualization.ComboChart(document.getElementById('dvSS'));
                ac.draw(chartData, {
                    height: 250,
                    vAxis: { title: "Sales" },
                    hAxis: { title: "Product" },
                    seriesType: "bars",
                    series: { 1: { type: "area" }, 2: { type: "area" } }
                });
            }
            else {
                $("#dvSS").html('No Data available');
                $("#dvSS").addClass('NoValue');
            }
            $('#imgScroll').removeClass("ScrollUp");
            $('#imgScroll').addClass("ScrollDown");
            //  $("#dvLeftPanel").hide();
            $("#dvLeftPanel").hide();
            $("#imgloginLoad").hide()
        },
        error: function (e) {
            $("#imgloginLoad").hide();
            //$("#dvLeftPanel").hide();
            $('#imgScroll').removeClass("ScrollUp");
            $('#imgScroll').addClass("ScrollDown");
            $("#dvLeftPanel").hide();
            fnMsgAlert('error', 'Error', 'Bind Secondry sales data failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });
}



function fnActivityVsSalesPageLoad() {

    monthAr = new Array();
    var year = new Date($("#hdnCurrentDate").val()).getFullYear();
    var mnth = new Date($("#hdnCurrentDate").val()).getMonth() + 1;
    catImgCode = ['#A62525', '#7CC23D', '#58A2C9', '#109618', '#990099', '#0099C6'];
    monthAr.push(mnth)
    month = "^" + mnth + "^_" + year;
    $("#drpPeriod").append('<option value="' + year + '-' + mnth + '" selected>' + year + '-' + monthArray[new Date($("#hdnCurrentDate").val()).getMonth()] + '</option>');
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetRegionByDivision",
        data: "A",
        success: function (jsonData) {
            var regions = "";
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                if (jsonData.Tables[0].Rows.length > 0) {
                    for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                        regionNames += "^" + jsonData.Tables[0].Rows[i].Region_Name + "^,";

                        //$('option', $("#drpTerritory")).remove();
                        //$("#drpTerritory").append("<option value=ALL selected>ALL</option>");
                        //for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                        //    $("#drpTerritory").append("<option value=" + jsonData.Tables[0].Rows[i].Region_Code + ">" + jsonData.Tables[0].Rows[i].Region_Name + "</option>");
                        //}
                        //$("#drpTerritory").multiselect('destroy');
                        //$("#drpTerritory").multiselect();
                        //if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
                        //$("#selectall").click(function () {
                        //    $('.case').attr('checked', this.checked);
                        //});
                        //$("#drpTerritory").multiselect({
                        //    noneSelectedText: 'Select Regions'
                        //}).multiselectfilter();
                        regions += "<select id='drpTerritory' multiple='multiple'>";
                        regions += "<option value=ALL selected>ALL</option>"
                        for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {
                            // $("#drpTerritory").append("<option value=" + response.Tables[0].Rows[i].Region_Code + ">" + response.Tables[0].Rows[i].Region_Name + "</option>");
                            regions += "<option value=" + jsonData.Tables[0].Rows[i].Region_Code + ">" + jsonData.Tables[0].Rows[i].Region_Name + "</option>";
                        }
                        regions += "</select>";
                        $("#dvRegionList").html(regions);
                        $("#drpTerritory").multiselect("destroy").multiselect().multiselectfilter();
                    }
                    regionNames = regionNames.slice(0, -1);
                    if (jsonData.Tables[1].Rows.length > 0) {
                        $("#drpDivision").val(jsonData.Tables[1].Rows[0].Division_Code)
                    }
                    fnBindDivCategory();
                    //fnBindCategory();
                    fnGetRegionType();
                    ////Call the functions
                    //fnCategoryWiseVisitAnanlysis();
                    //fnWorkCalculation();
                    //fnDoctorCallAverage();
                    //fnChemistCallAverage();

                    //fnCategoryCoverage();
                }
                else {
                    fnMsgAlert('info', 'Info', 'Can not find user data');
                }
            }

        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'Page Load failed');
        },
        complete: function () {
            $.unblockUI();
        }
    });


}


function fnClearActivityDashboard() {
    $("#dvCategoryVisit").html('No Data available');
    $("#dvCategoryVisit").addClass('NoValue');

    $("#dvField").html('No Data available');
    $("#dvField").addClass('NoValue');

    $("#dvDocCalAvg").html('No Data available');
    $("#dvDocCalAvg").addClass('NoValue');

    $("#dvCheCallAvg").html('No Data available');
    $("#dvCheCallAvg").addClass('NoValue');

    $("#dvCatAvg").html('No Data available');
    $("#dvCatAvg").addClass('NoValue');

    $("#dvLegend").html('');

    $("#dvTotalDoc").html('')
    $("#dvnoOfDocPlanned").html('')
    $("#dvnoOfDocVisit").html('')
}

function fnClearActivityVsSalesDashBoard() {
    $("#dvCatwiseDocCoverage").html('No Data available');
    $("#dvCatwiseDocCoverage").addClass('NoValue');

    $("#dvSS").html('No Data available');
    $("#dvSS").addClass('NoValue');

    $("#dvCatwiseDoctors").html('No Data available');
    $("#dvCatwiseDoctors").addClass('NoValue');

    $("#dvCatAndCoverage").html('No data available');
    $("#dvCatAndCoverage").addClass('NoValue');
}

function fnOpenGaugeSettings() {
    $("#dvGauge").overlay().load();
}

function fnShowConfigSettings() {
    if (parseFloat($("#txtRedFrom").val() > 100)) {
        fnMsgAlert('info', 'Info', 'Please validate Red color from value');
        return;
    }
    if (parseFloat($("#txtRedTo").val() > 100)) {
        fnMsgAlert('info', 'Info', 'Please validate Red color to value');
        return;
    }
    if (parseFloat($("#txtYellowFrom").val() > 100)) {
        fnMsgAlert('info', 'Info', 'Please validate yellow color from value');
        return;
    }
    if (parseFloat($("#txtYellowTo").val() > 100)) {
        fnMsgAlert('info', 'Info', 'Please validate yellow color to value');
        return;
    }
    if (parseFloat($("#txtGreenFrom").val() > 100)) {
        fnMsgAlert('info', 'Info', 'Please validate green color from value');
        return;
    }
    if (parseFloat($("#txtGreenTo").val() > 100)) {
        fnMsgAlert('info', 'Info', 'Please validate green color to value');
        return;
    }

    var redColorFromTo = $("#txtRedFrom").val() + "," + $("#txtRedTo").val();
    var yellowColorFromTo = $("#txtYellowFrom").val() + "," + $("#txtYellowTo").val();
    var greenColorFromTo = $("#txtGreenFrom").val() + "," + $("#txtGreenTo").val();
    $.ajax({
        type: 'POST',
        url: "DashBoard/InsertConfigSetting",
        data: "redColor=" + redColorFromTo + "&yellowColor=" + yellowColorFromTo + "&greenColor=" + greenColorFromTo + "",
        success: function (result) {
            if (result.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', result.split(':')[0]);
                fnCategoryCoverage();
            }
            else {
                fnMsgAlert('error', 'Error', 'Error occured.Settings can not be saved');
            }
            $("#dvGauge").overlay().close();
        },
        error: function () {
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

function fnValidateSettingsValue(obj) {
    if ($(obj).val() == "") {
        $(obj).val('0');
    }
}


function fnGetGaugeSettings() {
    $.ajax({
        type: 'POST',
        url: "DashBoard/GetDashboardGaugeSettings",
        data: "A",
        success: function (result) {
            if (result != "") {
                gaugeRedColorFromTo = result.split('_')[0];
                gaugeYellowColorFromTo = result.split('_')[1];
                gaugeGreenColorFromTo = result.split('_')[2];
                $("#txtRedFrom").val(gaugeRedColorFromTo.split(',')[0]);
                $("#txtRedTo").val(gaugeRedColorFromTo.split(',')[1]);
                $("#txtYellowFrom").val(gaugeYellowColorFromTo.split(',')[0]);
                $("#txtYellowTo").val(gaugeYellowColorFromTo.split(',')[1]);
                $("#txtGreenFrom").val(gaugeGreenColorFromTo.split(',')[0]);
                $("#txtGreenTo").val(gaugeGreenColorFromTo.split(',')[1]);
            }
        },
        error: function () {
        },
        complete: function () {
            $.unblockUI();
        }
    });
}



var aChart;
var User_Dashboard = {
    defaults: {
        "Current_Date": "",
        "Previous_Date": "",
        "Next_Date": "",
        "Day_After_Tomorrow": "",
        "Current_Month": "",
        "Next_Month": "",
        "Previous_Month": "",
        "Current_Year": "",
        "Previous_Year": "",
        "Next_Year": "",
        "Child_User_Count": 0,
        "TOUR_PLANNER": "NO",
        "isCurrent": true,
        "team_data_json": [],
        "self_data_json": [],
        "team_Category_data_json": [],
        "self_Category_data_json": [],
        "selfandteam_expense_data_json": [],
        "sefandteam_SS_data_json": [],
        "pendingApprovalMode": "",
        "expenseMode": "",
        "ssMode": "",
        "categoryCoverageMode": "",
        "visitSummaryPageNo": 1,
    },
    initDashboard: function () {

        if (User_Dashboard.defaults.Child_User_Count == 1) {
            $('.btn-switch').hide();
            $('#spnApproveTitle').html('Pending For Approval');
        }
        else {
            $('.btn-switch').show();
            $('#spnApproveTitle').html('Pending Approvals');
        }
        User_Dashboard.getShowInwardAck();
        User_Dashboard.getUserDashboardLiveCounts();
        User_Dashboard.getUserTaskLiveCounts();
        User_Dashboard.getDashboardExpenseDataCount();
        User_Dashboard.getDashboardSSDataCount();
        User_Dashboard.getDashboardManagerCountData();
        User_Dashboard.getMarketingCampaignCount();
        User_Dashboard.getDivisions();
        //User_Dashboard.getDashboardCategoryCountData();
        //User_Dashboard.getDashboardCategoryCountDataForSingleUser();
        User_Dashboard.getTPLockDays();
        //  User_Dashboard.getDashboardHome();
        setTimeout(function () { User_Dashboard.getDashboardCountData(); }, 2000);

        User_Dashboard.getNextTwoDaysPlan();

        //if (User_Dashboard.defaults.Child_User_Count > 1) {
        //    $('.clsYetToBeApproved').show();
        //}
        //else {
        //    $('.clsYetToBeApproved').hide();
        //}
        $('.messages-pop').unbind('click').bind('click', function () {
            User_Dashboard.getMessageMoreInfo();
        });
        User_Dashboard.bindSelfTeamEvents();
        $('.dash-title').html('Insights - ' + monthArray[parseInt(User_Dashboard.defaults.Current_Month) - 1] + ' ' + User_Dashboard.defaults.Current_Year + '');
        if (IsBack != "YES" || IsBack == null) {
            $("#notifyhide").show();
            $("#fieldnotifyhide").show();
        }
        else {
            $("#fieldnotifyhide").hide();
            $(".dash-title").html('');
        }
    },
    blockUI: function (dvId) {
        $('#' + dvId).block({
            message: '<h4>Processing</h4>',
            css: { border: '2px solid rgba(0, 174, 205, 0.87)' }
        })
    },
    UnblockUI: function (dvId) {
        $('#' + dvId).unblock();
    },
    bindSelfTeamEvents: function () {
        $('.cls-doctor-avg-main .btn-switch .first').unbind('click').bind('click', function () {
            $('.cls-doctor-avg-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-doctor-avg-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-doctor-avg-main .btn-switch .first').addClass('btn-active');
            $('.cls-doctor-avg-main .btn-switch .second').addClass('btn-inactive');
            User_Dashboard.fillDoctorCallAvg('S');
        });
        $('.cls-doctor-avg-main .btn-switch .second').unbind('click').bind('click', function () {
            $('.cls-doctor-avg-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-doctor-avg-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-doctor-avg-main .btn-switch .second').addClass('btn-active');
            $('.cls-doctor-avg-main .btn-switch .first').addClass('btn-inactive');
            User_Dashboard.fillDoctorCallAvg('T');
        });

        $('.cls-chemist-avg-main .btn-switch .first').unbind('click').bind('click', function () {
            $('.cls-chemist-avg-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-chemist-avg-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-chemist-avg-main .btn-switch .first').addClass('btn-active');
            $('.cls-chemist-avg-main .btn-switch .second').addClass('btn-inactive');
            User_Dashboard.fillChemistCallAvg('S');
        });
        $('.cls-chemist-avg-main .btn-switch .second').unbind('click').bind('click', function () {
            $('.cls-chemist-avg-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-chemist-avg-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-chemist-avg-main .btn-switch .second').addClass('btn-active');
            $('.cls-chemist-avg-main .btn-switch .first').addClass('btn-inactive');
            User_Dashboard.fillChemistCallAvg('T');
        });

        $('.cls-SS-main .btn-switch .first').unbind('click').bind('click', function () {
            $('.cls-SS-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-SS-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-SS-main .btn-switch .first').addClass('btn-active');
            $('.cls-SS-main .btn-switch .second').addClass('btn-inactive');
            User_Dashboard.fillSecondarySales('S');
        });
        $('.cls-SS-main .btn-switch .second').unbind('click').bind('click', function () {
            $('.cls-SS-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-SS-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-SS-main .btn-switch .second').addClass('btn-active');
            $('.cls-SS-main .btn-switch .first').addClass('btn-inactive');
            User_Dashboard.fillSecondarySales('T');
        });


        // Expanse Claim 
        $('.cls-Expense-main .btn-switch .first').unbind('click').bind('click', function () {
            $('.cls-Expense-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-Expense-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-Expense-main .btn-switch .first').addClass('btn-active');
            $('.cls-Expense-main .btn-switch .second').addClass('btn-inactive');
            User_Dashboard.fillExpense('S');
        });
        $('.cls-Expense-main .btn-switch .second').unbind('click').bind('click', function () {
            $('.cls-Expense-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-Expense-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-Expense-main .btn-switch .second').addClass('btn-active');
            $('.cls-Expense-main .btn-switch .first').addClass('btn-inactive');
            User_Dashboard.fillExpense('T');
        });
        //


        //Pendding Approval
        $('.cls-pending-main .btn-switch .first').unbind('click').bind('click', function () {
            $('.cls-pending-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-pending-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-pending-main .btn-switch .first').addClass('btn-active');
            $('.cls-pending-main .btn-switch .second').addClass('btn-inactive');
            User_Dashboard.fillPenddingApproval('S');
        });
        $('.cls-pending-main .btn-switch .second').unbind('click').bind('click', function () {
            $('.cls-pending-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-pending-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-pending-main .btn-switch .second').addClass('btn-active');
            $('.cls-pending-main .btn-switch .first').addClass('btn-inactive');
            User_Dashboard.fillPenddingApproval('T');
        });
        //


        $('.cls-cat-cov-main .btn-switch .first').unbind('click').bind('click', function () {

            $('.cls-cat-cov-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-cat-cov-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-cat-cov-main .btn-switch .first').addClass('btn-active');
            $('.cls-cat-cov-main .btn-switch .second').addClass('btn-inactive');
            User_Dashboard.defaults.categoryCoverageMode = "S";
            // User_Dashboard.fillCategoryCoverage();
            //User_Dashboard.fillCategoryCoverage(User_Dashboard.defaults.categoryCoverageMode);
        });
        $('.cls-cat-cov-main .btn-switch .second').unbind('click').bind('click', function () {

            $('.cls-cat-cov-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-cat-cov-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-cat-cov-main .btn-switch .second').addClass('btn-active');
            $('.cls-cat-cov-main .btn-switch .first').addClass('btn-inactive');
            User_Dashboard.defaults.categoryCoverageMode = "T";
            // User_Dashboard.fillCategoryCoverage();
            //User_Dashboard.fillCategoryCoverage(User_Dashboard.defaults.categoryCoverageModes);
        });

    },
    getUserDashboardLiveCounts: function () {
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardLiveCounts", null, "POST",
        function (jsonResult) {
            var birthday = 0, anniversary = 0, message = 0, notice = 0, holiday = 0;
            if (jsonResult != null && jsonResult != '' && jsonResult != undefined) {
                var birthdayJson = jsonPath(jsonResult, "$.[?(@.Mode=='DOB')]");
                if (birthdayJson != false && birthdayJson != '' && birthdayJson != null) {
                    birthday = birthdayJson[0].Count;
                }
                var anniJson = jsonPath(jsonResult, "$.[?(@.Mode=='DOA')]");
                if (anniJson != false && anniJson != '' && anniJson != null) {
                    anniversary = anniJson[0].Count;
                }
                var noticeJson = jsonPath(jsonResult, "$.[?(@.Mode=='NOTICE')]");
                if (noticeJson != false && noticeJson != '' && noticeJson != null) {
                    notice = noticeJson[0].Count;
                }
                var msgJson = jsonPath(jsonResult, "$.[?(@.Mode=='MSG')]");
                if (msgJson != false && msgJson != '' && msgJson != null) {
                    message = msgJson[0].Count;
                }


                //HOLIDAY
                var holidayJson = jsonPath(jsonResult, "$.[?(@.Mode=='HOLIDAY')]");
                if (holidayJson != false && holidayJson != '' && holidayJson != null) {
                    holiday = holidayJson[0].Count;
                }

                $('#spnNotify').text(notice);
                $('#spnMsg').text(message);
                $('#spnAnniversary').text(anniversary);
                $('#spnBirthday').text(birthday);
                $('#spnHoliday').text(holiday);

                if (birthday > 0) {
                    $('.birthday-pop').unbind('click').bind('click', function () {
                        User_Dashboard.getBirthdayMoreInfo();
                    });
                }
                else {
                    $('.birthday-pop').unbind('click');
                }
                if (anniversary > 0) {
                    $('.anniversary-pop').unbind('click').bind('click', function () {
                        User_Dashboard.getAnniversaryInfo();
                    });
                }
                else {
                    $('.anniversary-pop').unbind('click');
                }

                //Holiday
                if (holiday > 0) {
                    $('.holiday-pop').unbind('click').bind('click', function () {
                        User_Dashboard.getHolidayInfo();
                    });
                }
                else {
                    $('.holiday-pop').unbind('click');
                }             
              

                // if (notice > 0) {
                $('.notify-pop').unbind('click').bind('click', function () {
                    User_Dashboard.getNotificationMoreInfo();
                });
                //}
                //else {
                //    $('.notify-pop').unbind('click')
                //}
                $('.messages-pop').unbind('click').bind('click', function () {
                    User_Dashboard.getMessageMoreInfo();
                });

            }
            //var CD = User_Dashboard.defaults.Current_Date.split('-')[2] + "/" + User_Dashboard.defaults.Current_Date.split('-')[1] + "/" + User_Dashboard.defaults.Current_Date.split('-')[0];
            //var ND = User_Dashboard.defaults.Next_Date.split('-')[2] + "/" + User_Dashboard.defaults.Next_Date.split('-')[1] + "/" + User_Dashboard.defaults.Next_Date.split('-')[0];
            //$('#spnTPDetails').html('TP Details for <br/>' + CD + " &<br/> " + ND);
            //$('#spnTPDetails').unbind('click').bind('click', function () {
            //    $('.dash-content-wrapper').block({
            //        message: 'Processing...',
            //        css: { border: '2px solid #DDD' }
            //    });
            //    setTimeout(function () { User_Dashboard.getTPMeetingPointMoreInfo(); }, 10);

            //});
            $('.dash-content-wrapper').unblock();
        },
              function (e) {
                  $('.dash-content-wrapper').unblock();
                  $.unblockUI();
              },
             function () {
                 $('.dash-content-wrapper').unblock();
                 $.unblockUI();
             });
    },
    getUserTaskLiveCounts: function () {
        debugger;
        var task = 0;
        $.ajax({
            type:"GET",
            url:"../HiDoctor_Master/FeedBack/GetTaskLiveCount",
            data:"",
            success:function(resp){
                console.log(resp);
                if (resp != null && resp != '' && resp != undefined) {
                    debugger;
                    var task = resp[0].Task_Count;
                    $('#spntask').text(task);

                    // In Chamber Effectiveness Task
                    //if (task > 0) {
                    //    $('#main').load("HiDoctor_Master/FeedBack/ICETasksView");
                    //}
                     if (task > 0) {
                         $('.task-pop').unbind('click').bind('click', function () {
                             debugger;
                             $.blockUI();                          
                            User_Dashboard.getTaskInfo();
                        });
                    }
                    else {
                        $('.task-pop').unbind('click');
                    }
                }
            }
        });     
    },

    getShowInwardAck: function () {
        var chkInwardAck = User_Dashboard.getUserDashboardInwardAcknowlegementConfigValue();

        if (chkInwardAck == "YES") {
            $("#lstInwardIcon").show();
            $('#spnInward').text('*');

            $('.inward-pop').unbind('click').bind('click', function () {
                User_Dashboard.redirectToAck();
            });
        }
        else {
            $("#lstInwardIcon").hide();
            $('.inward-pop').unbind('click');
        }

    },
    redirectToAck: function () {
        $('#main').load("HiDoctor_Master/Inward/InwardAcknowledgement");
    },
    getMessageMoreInfo: function () {
        $('#main').load("Messaging/Index");
    },
    getTaskInfo: function () {
        debugger;
        
        $('#main').load("HiDoctor_Master/FeedBack/ICETasksView");
       // $.unblockUI();
       
    },
    getDashboardCountData: function () {


        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "DashBoard/GetUserDashboardInfo",
            success: function (jsonData) {
                User_Dashboard.defaults.self_data_json = jsonData;
                User_Dashboard.drawUserCount(jsonData);

                User_Dashboard.fillPenddingApproval('S');
                User_Dashboard.fillDoctorCallAvg('S');
                User_Dashboard.fillChemistCallAvg('S');
            },
            error: function (e) {
                //AdminDashboard.UnblockUI("dvOpenPosition");
                //fnMsgAlert('error', 'Error', 'Bind Open Position PopUp failed');
            },
            complete: function () {
                //AdminDashboard.UnblockUI("dvOpenPosition");
                User_Dashboard.fillExpense("S");
                User_Dashboard.fillSecondarySales("S");
            }
        });
    },
    getDashboardSSDataCount: function () {

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "DashBoard/GetDashboardSSDataCount",
            success: function (jsonData) {
                User_Dashboard.defaults.sefandteam_SS_data_json = jsonData;
                User_Dashboard.fillSecondarySales('S');
            },
            error: function (e) {
                //AdminDashboard.UnblockUI("dvOpenPosition");
                //fnMsgAlert('error', 'Error', 'Bind Open Position PopUp failed');
            },
            complete: function () {
                //AdminDashboard.UnblockUI("dvOpenPosition");
            }
        });
    },
    getDashboardExpenseDataCount: function () {

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "DashBoard/GetDashboardExpenseDataCount",
            success: function (jsonData) {
                User_Dashboard.defaults.selfandteam_expense_data_json = jsonData;
                User_Dashboard.fillExpense('S');
            },
            error: function (e) {
                //AdminDashboard.UnblockUI("dvOpenPosition");
                //fnMsgAlert('error', 'Error', 'Bind Open Position PopUp failed');
            },
            complete: function () {
                //AdminDashboard.UnblockUI("dvOpenPosition");
            }
        });
    },
    getDashboardManagerCountData: function () {

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "DashBoard/GetManagerDashboardInfo",
            success: function (jsonData) {
                User_Dashboard.defaults.team_data_json = jsonData;
                if (User_Dashboard.defaults.Child_User_Count > 1) {
                    User_Dashboard.drawManagerCount(jsonData);
                    User_Dashboard.fillPenddingApproval('T');
                    User_Dashboard.fillDoctorCallAvg('T');
                    User_Dashboard.fillChemistCallAvg('T');

                }
            },
            error: function (e) {
                //AdminDashboard.UnblockUI("dvOpenPosition");
                //fnMsgAlert('error', 'Error', 'Bind Open Position PopUp failed');
            },
            complete: function () {
                //AdminDashboard.UnblockUI("dvOpenPosition");
                User_Dashboard.fillSecondarySales('T');
                User_Dashboard.fillExpense('T');
            }
        });
    },
    fillDoctorCallAvg: function (mode) {
        var jsonResult = "";
        $('.cls-doctor-avg-main .btn-switch .first').removeClass('btn-active').removeClass('btn-inactive');
        $('.cls-doctor-avg-main .btn-switch .second').removeClass('btn-active').removeClass('btn-inactive');

        var docCallAvgCurrent = 0.00, docCallAvgPre = 0.00;
        if (mode == "S") {
            jsonResult = User_Dashboard.defaults.self_data_json;
            $('.cls-doctor-avg-main .btn-switch .first').addClass('btn-active');
            $('.cls-doctor-avg-main .btn-switch .second').addClass('btn-inactive');
        }
        else {
            jsonResult = User_Dashboard.defaults.team_data_json;
            $('.cls-doctor-avg-main .btn-switch .first').addClass('btn-inactive');
            $('.cls-doctor-avg-main .btn-switch .second').addClass('btn-active')
        }
        if (jsonResult.length > 0.00) {
            docCallAvgCurrent = jsonResult[0].Cur_Month_Doctor_Call_Avg;
            docCallAvgPre = jsonResult[0].Pre_Month_Doctor_Call_Avg;
            if (docCallAvgCurrent > 0) {
                $('#spnDocCallAvg').text(docCallAvgCurrent);
            }
            else {
                $('#spnDocCallAvg').text('0.00');
            }
        }

        var docAvgDiff = docCallAvgCurrent - docCallAvgPre;
        User_Dashboard.fillColor('cls-doctor-avg-main', docAvgDiff, "spnDocCallAvgDiff", docCallAvgPre);
    },
    fillChemistCallAvg: function (mode) {
        var jsonResult = "";
        $('.cls-chemist-avg-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
        $('.cls-chemist-avg-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
        var cheCallAvgCurrent = 0.00, cheCallAvgPre = 0.00;
        if (mode == "S") {
            $('.cls-chemist-avg-main .btn-switch .first').addClass('btn-active');
            $('.cls-chemist-avg-main .btn-switch .second').addClass('btn-inactive');
            jsonResult = User_Dashboard.defaults.self_data_json;
        }
        else {
            $('.cls-chemist-avg-main .btn-switch .second').addClass('btn-active');
            $('.cls-chemist-avg-main .btn-switch .first').addClass('btn-inactive');
            jsonResult = User_Dashboard.defaults.team_data_json;
        }
        if (jsonResult.length > 0) {
            cheCallAvgCurrent = jsonResult[0].Cur_Month_Chemist_Call_Avg;
            cheCallAvgPre = jsonResult[0].Pre_Month_Chemist_Call_Avg;
            if (cheCallAvgCurrent > 0) {
                $('#spnChemCallAvg').text(cheCallAvgCurrent);
            }
            else {
                $('#spnChemCallAvg').text('0.00');
            }
        }

        var diffAmount = parseFloat(cheCallAvgCurrent) - parseFloat(cheCallAvgPre);
        User_Dashboard.fillColor('cls-chemist-avg-main', diffAmount, "spnChemCallAvgDiff", cheCallAvgPre);
    },
    fillSecondarySales: function (mode) {
        var jsonResult = "";
        var curSSQty = 0.00, curSSValue = 0.00, preSSQty = 0.00, preSSValue = 0.00;
        if (mode == "S") {
            jsonResult = User_Dashboard.defaults.sefandteam_SS_data_json;
            if (jsonResult.S_Cur_Month_SS_Value > 0 || jsonResult.S_Pre_Month_SS_Value > 0) {
                curSSValue = jsonResult.S_Cur_Month_SS_Value;
                preSSValue = jsonResult.S_Pre_Month_SS_Value;
            }
        }
        else {
            jsonResult = User_Dashboard.defaults.sefandteam_SS_data_json;
            if (jsonResult.T_Cur_Month_SS_Value > 0 || jsonResult.T_Pre_Month_SS_Value > 0) {
                curSSValue = jsonResult.T_Cur_Month_SS_Value;
                preSSValue = jsonResult.T_Pre_Month_SS_Value;
            }
        }

        if (curSSValue > 0.00 || preSSValue > 0.00) {

            $('#spnSS').text(curSSValue);

            $("#spnSS").off("click").click(function () {
                User_Dashboard.defaults.ssMode = mode;
                User_Dashboard.getSSPopUp();
            });

            $('#spnSS').css('cursor', 'pointer');
            $('#spnSS').css('text-decoration', 'underline');
        }
        else {
            $('#spnSS').text("0.00");
            $("#spnSS").off("click");
            $('#spnSS').css('cursor', 'default');
            $('#spnSS').css('text-decoration', 'blink');
        }


        var diffAmount = parseFloat(curSSValue) - parseFloat(preSSValue);
        User_Dashboard.fillColor('cls-SS-main', diffAmount, "spnSSDiff", preSSValue);
    },
    fillExpense: function (mode) {

        var jsonResult = "";
        var curExpenseQty = 0.00, curExpenseValue = 0.00, preExpenseQty = 0.00, preExpenseValue = 0.00;
        if (mode == "S") {
            jsonResult = User_Dashboard.defaults.selfandteam_expense_data_json;
            curExpenseValue = jsonResult.S_Cur_Month_TotalAmount;
            preExpenseValue = jsonResult.S_Pre_Month_TotalAmount;
        }
        else {
            jsonResult = User_Dashboard.defaults.selfandteam_expense_data_json;
            curExpenseValue = jsonResult.T_Cur_Month_TotalAmount;
            preExpenseValue = jsonResult.T_Pre_Month_TotalAmount;
        }

        if (curExpenseValue > 0.00 || preExpenseValue > 0.00) {

            $('#spnExpense').text(curExpenseValue);

            $("#spnExpense").off("click").click(function () {
                User_Dashboard.defaults.expenseMode = mode;
                User_Dashboard.getExpensePopUp();
            });

            $('#spnExpense').css('cursor', 'pointer');
            $('#spnExpense').css('text-decoration', 'underline');
        }
        else {
            $('#spnExpense').text('0.00');
            $("#spnExpense").off("click");
            $('#spnExpense').css('cursor', 'default');
            $('#spnExpense').css('text-decoration', 'blink');
        }


        var diffAmount = parseFloat(curExpenseValue) - parseFloat(preExpenseValue);
        User_Dashboard.fillColor('cls-Expense-main', diffAmount, "spnExpenseDiff", preExpenseValue);
    },
    fillPenddingApproval: function (mode) {
        var jsonResult = "";
        var curPendingQty = 0, curPendingValue = 0, prePendingQty = 0, prePendingValue = 0;
        if (mode == "S") {
            jsonResult = User_Dashboard.defaults.self_data_json;
            User_Dashboard.defaults.pendingApprovalMode = "S";
            $('.cls-pending-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-pending-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-pending-main .btn-switch .first').addClass('btn-active');
            $('.cls-pending-main .btn-switch .second').addClass('btn-inactive');
            $('#spnPenddingApprovalMode').html("Self");
            User_Dashboard.fillSelfPendingDcrCounts(jsonResult);
        }
        else {
            jsonResult = User_Dashboard.defaults.team_data_json;
            User_Dashboard.defaults.pendingApprovalMode = "T";
            $('.cls-pending-main .btn-switch .first').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-pending-main .btn-switch .second').removeClass('btn-inactive').removeClass('btn-active');
            $('.cls-pending-main .btn-switch .second').addClass('btn-active');
            $('.cls-pending-main .btn-switch .first').addClass('btn-inactive');
            $('#spnPenddingApprovalMode').html("Team");
            User_Dashboard.fillSelfPendingDcrCounts(jsonResult);
        }


        //curExpenseValue = jsonResult[0].Cur_Month_Claim_For_Approval;
        //preExpenseValue = jsonResult[0].Pre_Month_Claim_For_Approval;
        //$('#spnExpense').text(curExpenseValue);

        //var diffAmount = parseFloat(curExpenseValue) - parseFloat(preExpenseValue);
        //User_Dashboard.fillColor('cls-pending-main', diffAmount, "spnExpenseDiff", preExpenseValue);
    },
    getExpensePopUp: function () {
        var _data = {
            mode: User_Dashboard.defaults.expenseMode
        }

        $.ajax({
            start: $('.dash-content-wrapper').unblock(),
            type: 'POST',
            dataType: 'json',
            data: _data,
            url: "DashBoard/GetExpensePopUp",
            success: function (jsonResult) {

                if (jsonResult != null && jsonResult != '') {
                    $("#dvInfoContent").html("");
                    var strTable = "";
                    var curMonthAmount = 0.00, preMonthAmount = 0.00;
                    strTable += "<table class='table'><thead><tr><th>Expense Type</th><th>Current Month</th><th>Previous Month</th></tr></thead><tbody>";
                    for (var i = 0; i < jsonResult.length; i++) {
                        curMonthAmount += jsonResult[i].Cur_Month_TotalAmount;
                        preMonthAmount += jsonResult[i].Pre_Month_TotalAmount;
                        strTable += "<tr><td>" + jsonResult[i].Expense_Type_Name + "</td><td>" + jsonResult[i].Cur_Month_TotalAmount + "</td><td>" + jsonResult[i].Pre_Month_TotalAmount + "</td></tr>";
                    }
                    strTable += "<tr><td><b>Total</b></td><td><b>" + curMonthAmount.toFixed(2) + "</b></td><td><b>" + preMonthAmount.toFixed(2) + "</b></td></tr>";
                    strTable += "</tbody></table>";
                    $('.clsModalTitle').html('Considered Applied and Approved DCRs Only');
                    $("#dvInfoContent").html(strTable);
                    ShowModalPopup("dvMoreInfoModal");
                }

            },
            error: function (e) {
                $('.dash-content-wrapper').unblock();
                //fnMsgAlert('error', 'Error', 'Bind Open Position PopUp failed');
            },
            complete: function () {
                $('.dash-content-wrapper').unblock();
            }
        });

    },
    getSSPopUp: function () {

        var _data = {
            mode: User_Dashboard.defaults.ssMode
        }

        $.ajax({
            start: $('.dash-content-wrapper').unblock(),
            type: 'POST',
            dataType: 'json',
            data: _data,
            url: "DashBoard/GetSSPopUp",
            success: function (jsonResult) {

                if (jsonResult != null && jsonResult != '') {
                    $("#dvInfoContent").html("");
                    var strTable = "";

                    strTable += "<table class='table'><thead><tr><th>Stockiest Name</th><th>Sales Qty</th><th>Sales Value</th></tr></thead><tbody>";
                    if (jsonResult.lstSSPrevious.length > 0) {
                        strTable += "<tr><td colspan='3'><b>Previous Month</b></td></tr>";
                        for (var i = 0; i < jsonResult.lstSSPrevious.length; i++) {
                            strTable += "<tr><td>" + jsonResult.lstSSPrevious[i].Stockist_Name + "</td><td>" + jsonResult.lstSSPrevious[i].SS_Previous_Quantity + "</td><td>" + jsonResult.lstSSPrevious[i].SS_Previous_Count + "</td></tr>";
                        }
                        strTable += "<tr><td colspan='3'></td></tr>";
                    }
                    if (jsonResult.lstSSPrePrevious.length > 0) {
                        strTable += "<tr><td colspan='3'><b>Pre-Previous Month</b></td></tr>";
                        for (var i = 0; i < jsonResult.lstSSPrePrevious.length; i++) {
                            strTable += "<tr><td>" + jsonResult.lstSSPrePrevious[i].Stockist_Name + "</td><td>" + jsonResult.lstSSPrePrevious[i].SS_PrePrevious_Quantity + "</td><td>" + jsonResult.lstSSPrePrevious[i].SS_PrePrevious_Count + "</td></tr>";
                        }
                    }
                    strTable += "</tbody></table>";

                    $('.clsModalTitle').html('Secondary Sales');
                    $("#dvInfoContent").html(strTable);
                    ShowModalPopup("dvMoreInfoModal");
                }

            },
            error: function (e) {
                $('.dash-content-wrapper').unblock();
                //fnMsgAlert('error', 'Error', 'Bind Open Position PopUp failed');
            },
            complete: function () {
                $('.dash-content-wrapper').unblock();
            }
        });

    },
    //fillCategoryCoverage: function () {
    //    debugger;
    //    var jsonResult = "";
    //    if (User_Dashboard.defaults.categoryCoverageMode == "S") {
    //        jsonResult = User_Dashboard.defaults.self_Category_data_json;
    //    }
    //    else {
    //        jsonResult = User_Dashboard.defaults.team_Category_data_json;
    //    }
    //    var totalDoctors = User_Dashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Total_Approved_Doctors : jsonResult[0].Pre_Month_Total_Approved_Doctors;
    //    var missedDoctors = User_Dashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Category_Missed_Doctors : jsonResult[0].Pre_Month_Category_Missed_Doctors;
    //    var metasperstandard = User_Dashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Category_VC_Followed : jsonResult[0].Pre_Month_Category_VC_Followed;
    //    var lessthanStdVisits = User_Dashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Category_VC_Missed : jsonResult[0].Pre_Month_Category_VC_Missed;
    //    var morethanStdVisits = User_Dashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Category_VC_Exceeded : jsonResult[0].Pre_Month_Category_VC_Exceeded;
    //    var myArray = [missedDoctors, metasperstandard, lessthanStdVisits, morethanStdVisits];
    //    var maxValueInArray = Math.max.apply(Math, myArray);
    //    var index = myArray.indexOf(maxValueInArray);
    //    if (missedDoctors == 0 && metasperstandard == 0 && lessthanStdVisits == 0 && morethanStdVisits == 0) {
    //        index = -1;
    //    }
    //    var className = 'max-category';
    //    var content = '';
    //    content += "<p class='lengend'>";
    //    content += "<span>Completely missed count</span>";
    //    if (missedDoctors > 0) {
    //        content += "<span class='doc-count doc-missed'><b class='cls-link'>" + missedDoctors + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    else {
    //        content += "<span class='doc-count'><b>" + missedDoctors + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    content += "</p>";
    //    if (index == 0) {
    //        content += "<div class='progress missed-main " + className + "'>";
    //    }
    //    else {
    //        content += "<div class='progress missed-main'>";
    //    }
    //    if (User_Dashboard.defaults.isCurrent) {
    //        content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_Missed_Doctors_Percentage + "%'>";
    //    }
    //    else {
    //        content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Pre_Month_Category_Missed_Doctors_Percentage + "%'>";
    //    }
    //    //content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_Missed_Doctors_Percentage + "%'>";
    //    content += "</div>";
    //    content += "</div>";
    //    content += "<p class='lengend'>";
    //    content += "<span>Met as per Std. Norm (Doctor Count)</span>";
    //    if (metasperstandard > 0) {
    //        content += "<span class='doc-count doc-met-per-std'><b class='cls-link'>" + metasperstandard + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    else {
    //        content += "<span class='doc-count'><b class=''>" + metasperstandard + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    content += "</p>";
    //    if (index == 1) {
    //        content += "<div class='progress met-main " + className + "'>";
    //    }
    //    else {
    //        content += "<div class='progress met-main'>";
    //    }
    //    if (User_Dashboard.defaults.isCurrent) {
    //        content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Followed_Percentage + "%'>";
    //    } else {
    //        content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Pre_Month_Category_VC_Followed_Percentage + "%'>";
    //    }
    //    //content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Followed_Percentage + "%'>";
    //    content += "</div>";
    //    content += "</div>";
    //    content += "<p class='lengend'>";
    //    content += "<span>Less than Std. Norm (Doctor Count)</span>";
    //    if (lessthanStdVisits > 0) {
    //        content += "<span class='doc-count doc-less-met'><b class='cls-link'>" + lessthanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    else {
    //        content += "<span class='doc-count'><b class=''>" + lessthanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    content += " </p>";
    //    if (index == 2) {
    //        content += "<div class='progress less-met-main " + className + "'>";
    //    }
    //    else {
    //        content += "<div class='progress less-met-main'>";
    //    }

    //    if (User_Dashboard.defaults.isCurrent) {
    //        content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Missed_Percentage + "%'>";
    //    } else {
    //        content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Pre_Month_Category_VC_Missed_Percentage + "%'>";
    //    }
    //    //content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Missed_Percentage + "%'>";
    //    content += "</div>";
    //    content += "</div>";
    //    content += "<p class='lengend'>";
    //    content += "<span>More than Std. Norm (Doctor Count)</span>";
    //    if (morethanStdVisits > 0) {
    //        content += "<span class='doc-count doc-more-met'><b class='cls-link'>" + morethanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    else {
    //        content += "<span class='doc-count'><b class=''>" + morethanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    content += " </p>";
    //    if (index == 3) {
    //        content += "<div class='progress more-met-main " + className + "'>";
    //    }
    //    else {
    //        content += "<div class='progress more-met-main'>";
    //    }
    //    if (User_Dashboard.defaults.isCurrent) {
    //        content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Exceeded_Percentage + "%'>";
    //    } else {
    //        content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Pre_Month_Category_VC_Exceeded_Percentage + "%'>";
    //    }
    //    //content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Exceeded_Percentage + "%'>";
    //    content += " </div>";
    //    content += " </div>";
    //    $('.cls-all-coverage').html(content);
    //    $('.doc-missed').unbind('click').bind('click', function () {
    //        User_Dashboard.redirectToDoctorVisitReport('MISSED', '', '');
    //    });
    //    $('.doc-met-per-std').unbind('click').bind('click', function () {
    //        User_Dashboard.redirectToDoctorVisitReport('MET_AS_PER_STANDARD', '', '');
    //    });
    //    $('.doc-less-met').unbind('click').bind('click', function () {
    //        User_Dashboard.redirectToDoctorVisitReport('LESS_THAN_MET', '', '');
    //    });
    //    $('.doc-more-met').unbind('click').bind('click', function () {
    //        User_Dashboard.redirectToDoctorVisitReport('MORE_THAN_MET', '', '');
    //    });
    //},
    drawUserCount: function (jsonResult) {
        debugger;
        var totalUnDCR = 0, totalUnTP = 0, preUnTP = 0, unapprovedExpCount = 0, totalPendingClaim = 0;
        if (jsonResult != false && jsonResult != '' && jsonResult != null) {
            totalUnDCR = (jsonResult[0].Cur_Month_UnApproved_DCR_Count + jsonResult[0].Pre_Month_UnApproved_DCR_Count);
            totalUnTP = (jsonResult[0].Cur_Month_UnApproved_TP_Count + jsonResult[0].Next_Month_UnApproved_TP_Count);
            unapprovedExpCount = jsonResult[0].Till_Date_UnApproved_ExpClaim_Count;
            totalPendingClaim = (jsonResult[0].Cur_Month_Claim_For_Approval + jsonResult[0].Pre_Month_Claim_For_Approval);
        }
        $('.unapproved-dcr').text(totalUnDCR);
        $('.unapproved-tp').text(totalUnTP);
        $('.unapproved-claim').text(unapprovedExpCount);
        $('.pending-claim').text(totalPendingClaim);
        if (totalUnDCR > 0) {
            $('.unapproved-dcr').unbind('click').bind('click', function () {
                $('.dash-content-wrapper').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { User_Dashboard.getUnApprovedDCRMoreInfo(); }, 10);

            });
            $('.unapproved-dcr').css('cursor', 'pointer');
            $('.unapproved-dcr').css('text-decoration', 'underline');
        }
        else {
            $('.unapproved-dcr').css('cursor', 'default');
            $('.unapproved-dcr').css('text-decoration', 'blink');
        }
        if (totalUnTP > 0) {
            $('.unapproved-tp').unbind('click').bind('click', function () {
                $('.dash-content-wrapper').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { User_Dashboard.getUnApprovedTPMoreInfo(); }, 10);
            });
            $('.unapproved-tp').css('cursor', 'pointer');
            $('.unapproved-tp').css('text-decoration', 'underline');
        }
        else {
            $('.unapproved-tp').css('cursor', 'default');
            $('.unapproved-tp').css('text-decoration', 'blink');
        }
        if (totalPendingClaim > 0) {
            $('.pending-claim').unbind('click').bind('click', function () {
                $('.dash-content-wrapper').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(User_Dashboard.pendingClaimViewMore(), 50);

            });
            $('.pending-claim').css('cursor', 'pointer');
            $('.pending-claim').css('text-decoration', 'underline');
        }
        else {
            $('.pending-claim').css('cursor', 'default');
            $('.pending-claim').css('text-decoration', 'blink');
        }
        if (unapprovedExpCount > 0) {
            $('.unapproved-claim').unbind('click').bind('click', function () {
                User_Dashboard.unapprovedExpClaimMoreInfo();
            });
            $('.unapproved-claim').css('cursor', 'pointer');
            $('.unapproved-claim').css('text-decoration', 'underline');
        }
        else {
            $('.unapproved-claim').css('cursor', 'default');
            $('.unapproved-claim').css('text-decoration', 'blink');
        }



        if (User_Dashboard.defaults.Child_User_Count == 1) {
            //User_Dashboard.fillDoctorCallAvg('S');
            //User_Dashboard.fillChemistCallAvg('S');
            //User_Dashboard.fillSecondarySales('S');
            //User_Dashboard.fillExpense('S');
            User_Dashboard.defaults.pendingApprovalMode = "S";
            User_Dashboard.fillSelfPendingDcrCounts(jsonResult);
        }
    },
    fillSelfPendingDcrCounts: function (jsonResult) {

        var totalAppliedDCR = 0, totalAppliedTP = 0, totalAppliedCliam = 0;
        if (jsonResult.length > 0) {
            totalAppliedDCR = jsonResult[0].Cur_Month_Applied_DCR_Count + jsonResult[0].Pre_Month_Applied_DCR_Count;
            totalAppliedTP = jsonResult[0].Cur_Month_Applied_TP_Count + jsonResult[0].Next_Month_Applied_TP_Count;
            totalAppliedCliam = jsonResult[0].Till_Date_Applied_ExpClaim_Count;
        }

        $('.pending-dcr').text(totalAppliedDCR);
        $('.pending-tp').text(totalAppliedTP);
        $('.pending-claim').text(totalAppliedCliam);

        if (totalAppliedDCR > 0) {
            $('.pending-dcr').unbind('click').bind('click', function () {
                $('.dash-content-wrapper').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { User_Dashboard.getAppliedDCRMoreInfo(); }, 10);
            });
            $('.pending-dcr').css('cursor', 'pointer');
            $('.pending-dcr').css('text-decoration', 'underline');
        }
        else {
            $('.pending-dcr').css('cursor', 'default');
            $('.pending-dcr').css('text-decoration', 'blink');
        }

        if (totalAppliedTP > 0) {
            $('.pending-tp').unbind('click').bind('click', function () {
                $('.dash-content-wrapper').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { User_Dashboard.getApppliedTPMoreInfo(); }, 10);

            });
            $('.pending-tp').css('cursor', 'pointer');
            $('.pending-tp').css('text-decoration', 'underline');
        }
        else {
            $('.pending-tp').css('cursor', 'default');
            $('.pending-tp').css('text-decoration', 'blink');
        }

        if (totalAppliedCliam > 0) {
            $('.pending-claim').unbind('click').bind('click', function () {
                $('.dash-content-wrapper').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { User_Dashboard.getAppliedClaimMoreInfo(); }, 10);
            });
            $('.pending-claim').css('cursor', 'pointer');
            $('.pending-claim').css('text-decoration', 'underline');
        }
        else {
            $('.pending-claim').css('cursor', 'default');
            $('.pending-claim').css('text-decoration', 'blink');
        }
    },
    getAppliedDCRMoreInfo: function () {
        var content = '';
        var ar = new Array();
        var aa = {};
        aa.name = "mode";
        aa.value = User_Dashboard.defaults.pendingApprovalMode;
        ar.push(aa);
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardAppliedDCR", ar, "POST",
        function (jsonResult) {
            content = User_Dashboard.showDCrMoreInfo(jsonResult);
            $('.dash-content-wrapper').unblock();
        }, function () { $('.dash-content-wrapper').unblock(); });
        $('#dvInfoContent').html(content);

        $('.clsModalTitle').html('Applied DCR');
        ShowModalPopup("dvMoreInfoModal");
    },
    getApppliedTPMoreInfo: function () {
        var content = '';
        var ar = new Array();
        var aa = {};
        aa.name = "mode";
        aa.value = User_Dashboard.defaults.pendingApprovalMode;
        ar.push(aa);
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardAppliedTP", ar, "POST",
        function (jsonResult) {
            content = User_Dashboard.showTPMoreInfo(jsonResult);
            $('.dash-content-wrapper').unblock();
        }, function () {
            $('.dash-content-wrapper').unblock();
        });
        $('#dvInfoContent').html(content);
        $('.clsModalTitle').html('Applied TP');
        ShowModalPopup("dvMoreInfoModal");
    },
    getAppliedClaimMoreInfo: function () {
        var content = '';
        var ar = new Array();
        var aa = {};
        aa.name = "mode";
        aa.value = User_Dashboard.defaults.pendingApprovalMode;
        ar.push(aa);
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardAppliedClaim", ar, "POST",
    function (jsonResult) {
        content = User_Dashboard.showClaimMoreInfo(jsonResult);
        $('.dash-content-wrapper').unblock();
    }, function (result) { $('.dash-content-wrapper').unblock(); }, function () {
    });
        $('#dvInfoContent').html(content);
        $('.clsModalTitle').html('Applied Expense Claim');
        ShowModalPopup("dvMoreInfoModal");
    },
    fillColor: function (panelClassName, diffAmount, diffId, preValue) {
        if (preValue > 0) {
            $('#' + diffId).text('(' + preValue + ')');
        }
        else {
            $('#' + diffId).text('(0.00)');
        }
        $('.' + panelClassName).removeClass('cls-negative');
        $('.' + panelClassName).removeClass('cls-positive');
        $('.' + panelClassName).removeClass('cls-common-head');
        $('.' + panelClassName + ' .img-arrow').removeClass('img-negative');
        $('.' + panelClassName + ' .img-arrow').removeClass('img-positive');
        $('.' + panelClassName + ' .cls-sub-numbers').removeClass('numbers-negative');
        $('.' + panelClassName + ' .cls-sub-numbers').removeClass('numbers-positive');

        if (parseFloat(diffAmount) > 0) {
            $('.' + panelClassName).addClass('cls-positive');
            $('.' + panelClassName + ' .img-arrow').addClass('img-positive');
            $('.' + panelClassName + ' .cls-sub-numbers').addClass('numbers-positive');
            //   $('#' + diffId).text('(+' + diffAmount.toFixed(0) + ')');
        }
        else if (parseFloat(diffAmount) == 0) {
            $('.' + panelClassName).addClass('cls-common-head');
        }
        else {
            $('.' + panelClassName).addClass('cls-negative');
            $('.' + panelClassName + ' .img-arrow').addClass('img-negative');
            $('.' + panelClassName + ' .cls-sub-numbers').addClass('numbers-negative');
            //$('#' + diffId).text('(' + diffAmount.toFixed(0) + ')');
        }
    },
    getUserDashboardInwardAcknowlegementConfigValue: function () {
        //var _data = {
        //    mode: User_Dashboard.defaults.ssMode
        //}
        var chkStatus = "";
        $.ajax({
            start: $('.dash-content-wrapper').unblock(),
            type: 'POST',
            dataType: 'json',
            async: false,
            //data: _data,
            url: "DashBoard/GetUserDashboardInwardAcknowlegementConfigValue",
            success: function (jsonResult) {

                chkStatus = jsonResult;

            },
            error: function (e) {
                $('.dash-content-wrapper').unblock();
                //fnMsgAlert('error', 'Error', 'Bind Open Position PopUp failed');
            },
            complete: function () {
                $('.dash-content-wrapper').unblock();
            }
        });
        return chkStatus;
    },
    //getDashboardCategoryCountData: function () {
    //    debugger;
    //    var _objData = new Object();
    //    _objData.DivisionCode = 'All';

    //    $.ajax({
    //        start: User_Dashboard.blockUI("dvCategoryCoverage"),
    //        type: 'POST',
    //        dataType: 'json',
    //        data: _objData,
    //        url: "DashBoard/GetUserDashboardCategoryInfo",
    //        success: function (jsonResult) {
    //            User_Dashboard.defaults.team_Category_data_json = jsonResult;
    //            if (User_Dashboard.defaults.Child_User_Count > 1) {
    //                User_Dashboard.defaults.categoryCoverageMode = "T";
    //                User_Dashboard.fillCategoryCoverage();
    //            }
    //            User_Dashboard.UnblockUI("dvCategoryCoverage");
    //        },
    //        error: function (e) {
    //            User_Dashboard.UnblockUI("dvCategoryCoverage");
    //            //fnMsgAlert('error', 'Error', 'Bind Divisions , Get CategoryInfo');
    //        },
    //        complete: function () {
    //            User_Dashboard.UnblockUI("dvCategoryCoverage");
    //        }
    //    });

    //},
    ////getDashboardCategoryCountData: function () {
    ////    HDAjax.requestInvoke("Dashboard", "GetUserDashboardCategoryInfo", null, "POST",
    ////      function (jsonResult) {
    ////          // alert(jsonResult);
    ////          User_Dashboard.defaults.team_Category_data_json = jsonResult;
    ////          if (User_Dashboard.defaults.Child_User_Count > 1) {

    ////              User_Dashboard.fillCategoryCoverage("T");
    ////          }
    ////          // User_Dashboard.drawCategoryCoverage(jsonResult);
    ////      },
    ////      function (e) {
    ////          //alert(e);
    ////      });
    ////},


    //getDashboardCategoryCountDataForSingleUser: function () {
    //    debugger;
    //    $.ajax({
    //        start: User_Dashboard.blockUI("dvCategoryCoverage"),
    //        type: 'POST',
    //        dataType: 'json',
    //        url: "DashBoard/GetUserDashboardCategoryInfoSingle",
    //        success: function (jsonResult) {
    //            User_Dashboard.defaults.self_Category_data_json = jsonResult;
    //            if (User_Dashboard.defaults.Child_User_Count == 1) {
    //                User_Dashboard.defaults.categoryCoverageMode = "S";
    //                User_Dashboard.fillCategoryCoverage();
    //            }
    //            User_Dashboard.UnblockUI("dvCategoryCoverage");
    //        },
    //        error: function (e) {
    //            User_Dashboard.UnblockUI("dvCategoryCoverage");
    //            //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
    //        },
    //        complete: function () {
    //            User_Dashboard.UnblockUI("dvCategoryCoverage");
    //        }
    //    });

    //},

    //getDashboardCategoryCountDataForSingleUser: function () {
    //    HDAjax.requestInvoke("Dashboard", "GetUserDashboardCategoryInfoSingle", null, "POST",
    //      function (jsonResult) {
    //          User_Dashboard.defaults.self_Category_data_json = jsonResult;
    //          if (User_Dashboard.defaults.Child_User_Count == 1) {
    //              User_Dashboard.fillCategoryCoverage("S");
    //          }
    //      },
    //      function (e) {
    //      });
    //},
    drawManagerCount: function (jsonResult) {
        var totalPendingDCR = 0, totalPendingTP = 0;

        HDAjax.requestInvoke("Dashboard", "GetUserDashboardPendingInfo", null, "POST",
        function (pendingJson) {
            if (pendingJson != false && pendingJson != '' && pendingJson != null) {
                totalPendingDCR = (pendingJson[0].Cur_Month_Applied_DCR_Count + pendingJson[0].Pre_Month_Applied_DCR_Count);
                totalPendingTP = (pendingJson[0].Cur_Month_Applied_TP_Count + pendingJson[0].Next_Month_Applied_TP_Count);
            }
            if (User_Dashboard.defaults.Child_User_Count > 1) {
                $('.pending-dcr').text(totalPendingDCR);
                $('.pending-tp').text(totalPendingTP);

                if (totalPendingDCR > 0) {
                    $('.pending-dcr').unbind('click').bind('click', function () {
                        User_Dashboard.getPendingDCRMoreInfo();
                    });
                    $('.pending-dcr').css('cursor', 'pointer');
                    $('.pending-dcr').css('text-decoration', 'underline');
                }
                else {
                    $('.pending-dcr').css('cursor', 'default');
                    $('.pending-dcr').css('text-decoration', 'blink');
                }

                if (totalPendingTP > 0) {
                    $('.pending-tp').unbind('click').bind('click', function () {
                        $('.dash-content-wrapper').block({
                            message: 'Processing...',
                            css: { border: '2px solid #DDD' }
                        });
                        setTimeout(function () { User_Dashboard.getPendingTPMoreInfo(); }, 10);

                    });
                    $('.pending-tp').css('cursor', 'pointer');
                    $('.pending-tp').css('text-decoration', 'underline');
                }
                else {
                    $('.pending-tp').css('cursor', 'default');
                    $('.pending-tp').css('text-decoration', 'blink');
                }
            }
        },
        function ()
        { });
        //User_Dashboard.fillPenddingApproval('T');
        //User_Dashboard.fillDoctorCallAvg('T');
        //User_Dashboard.fillChemistCallAvg('T');
        //User_Dashboard.fillSecondarySales('T');
        //User_Dashboard.fillExpense('T');
    },
    getNotificationMoreInfo: function () {
        $('#main').load("HiDoctor_Activity/NoticeBoard/NoticeBoardRead");
    },
    getBirthdayMoreInfo: function () {
        HDAjax.requestInvoke("Home", "GetBirthdayAlertforChildUsers", null, "POST",
        function (content) {
            var tblbirthday = "";
            if (content != null && content != '') {
                $('#dvshowBirthdayAlertsforchildusers').html(content);
                ShowModalPopup("dvLoadingDoctorsBirthdayAlerts");
                HideModalPopup();
            }
        },
        function (e) {
            $('.dash-content-wrapper').unblock();
        },
        function () {
            $('.dash-content-wrapper').unblock();
        });
    },
    getHolidayInfo: function () {
        HDAjax.requestInvoke("Home", "GetHolidayInfo", null, "POST",
        function (jsonResult) {
            if (jsonResult != null && jsonResult != '') {
                $("#dvInfoContent").html("");
                var strTable = "";
                strTable += "<table class='table'><thead><tr><th>Region Name</th><th>Holiday Name</th><th>Date</th></tr></thead><tbody>";
                for (var i = 0; i < jsonResult.length; i++) {
                    var holidayDate = new Date(jsonResult[i].Holiday_Date);

                    strTable += "<tr><td>" + jsonResult[i].Region_Name + "</td><td>" + jsonResult[i].Holiday_Name + "</td><td>" + holidayDate.getDate() + "/" + (holidayDate.getMonth() + 1) + "/" + holidayDate.getFullYear() + "</td></tr>";
                }
                strTable += "</tbody></table>"
                $('.clsModalTitle').html('Holiday Details');
                $("#dvInfoContent").html(strTable);
                ShowModalPopup("dvMoreInfoModal");
                HideModalPopup();
            }
        },
        function (e) {
            $('.dash-content-wrapper').unblock();
        },
        function () {
            $('.dash-content-wrapper').unblock();
        });
    },
    //getBirthdayMoreInfo: function () {
    //    HDAjax.requestInvoke("Dashboard", "GetUserDashboardDoctorBirthday", null, "POST",
    //     function (jsonResult) {
    //         var content = '';
    //         if (User_Dashboard.defaults.Child_User_Count > 1) {
    //             content += "<p style='font-style: italic;'>If there are different birthday dates recorded in different regions for the same doctor, all the dates will be shown. Past dates will be shown in RED</p>";
    //         }
    //         content += ' <table class="table table-striped"><thead><tr><th>S.No</th><th>Region Name</th><th>Doctor Name</th><th>Speciality</th><th>Category</th><th>Date</th></tr></thead><tbody>';
    //         var dobJson = jsonPath(jsonResult, "$.[?(@.Status=='DOB')]");
    //         if (dobJson != false && dobJson != null && dobJson != '') {
    //             content += "<tr><td colspan='6'><b>Birthdays</b></td></tr>";
    //             var i = 0;
    //             $.each(dobJson, function (index, value) {
    //                 
    //                 i++;
    //                 content += "<tr><td>" + i + "</td><td>" + value.Region_Name + "</td><td>" + value.Customer_Name + "</td>";
    //                 content += "<td>" + value.Speciality_Name + "</td><td>" + value.Category_Name + "</td>";
    //                 if (parseInt(value.Date.split('/')[1]) <= parseInt(User_Dashboard.defaults.Current_Month)) {
    //                     if (parseInt(value.Date.split('/')[0]) < parseInt(User_Dashboard.defaults.Current_Date.split('-')[2])) {
    //                         content += "<td><span style='display:inline-block;color:red;font-weight:bold;'>" + value.Date + "</span></td></tr>";
    //                     }
    //                     else {
    //                         content += "<td>" + value.Date + "</td></tr>";
    //                     }
    //                 }
    //                 else {
    //                     content += "<td>" + value.Date + "</td></tr>";
    //                 }
    //             });
    //         }
    //         //var doaJson = jsonPath(jsonResult, "$.[?(@.Status=='DOA')]");
    //         //if (doaJson != false && doaJson != null && doaJson != '') {
    //         //    content += "<tr><td colspan='6'><b>Anniversary</b></td></tr>";
    //         //    var i = 0;
    //         //    $.each(doaJson, function (index, value) {
    //         //        i++;
    //         //        content += "<tr><td>" + i + "</td><td>" + value.Customer_Name + "</td><td>" + value.Region_Name + "</td>";
    //         //        content += "<td>" + value.Speciality_Name + "</td><td>" + value.Category_Name + "</td>";
    //         //        content += "<td>" + value.Date + "</td></tr>";
    //         //    });
    //         //}
    //         content += '</tbody></table>';
    //         $('#dvInfoContent').html(content);
    //         $('.clsModalTitle').html('Doctor birthday');
    //         ShowModalPopup("dvMoreInfoModal");
    //         //  $.unblockUI();
    //         $('.dash-content-wrapper').unblock();
    //     },
    //     function (e) {
    //         $('.dash-content-wrapper').unblock();
    //     },
    //     function () {
    //         $('.dash-content-wrapper').unblock();
    //     });
    //},
    getAnniversaryInfo: function () {
        HDAjax.requestInvoke("Home", "GetAnniversaryAlertforChildUsers", null, "POST",
        function (jsonResult) {
            if (jsonResult != null && jsonResult != '') {
                $('#dvshowAnniversaryAlertsforchildusers').html(jsonResult);
                ShowModalPopup("dvLoadingDoctorsAnniversaryAlerts");
                HideModalPopup();
            }
        },
        function (e) {
            $('.dash-content-wrapper').unblock();
        },
        function () {
            $('.dash-content-wrapper').unblock();
        });
    },
    //getAnniversaryInfo: function () {
    //    HDAjax.requestInvoke("Dashboard", "GetUserDashboardDoctorBirthday", null, "POST",
    //    function (jsonResult) {
    //        var content = '';
    //        if (User_Dashboard.defaults.Child_User_Count > 1) {
    //            content += "<p style='font-style: italic;'>If there are different anniversary dates recorded in different regions for the same doctor, all the dates will be shown. Past dates will be shown in RED</p>";
    //        }
    //        content += ' <table class="table table-striped"><thead><tr><th>S.No</th><th>Region Name</th><th>Doctor Name</th><th>Speciality</th><th>Category</th><th>Date</th></tr></thead><tbody>';
    //        var doaJson = jsonPath(jsonResult, "$.[?(@.Status=='DOA')]");
    //        if (doaJson != false && doaJson != null && doaJson != '') {
    //            content += "<tr><td colspan='6'><b>Anniversary</b></td></tr>";
    //            var i = 0;
    //            $.each(doaJson, function (index, value) {
    //                i++;
    //                content += "<tr><td>" + i + "</td><td>" + value.Region_Name + "</td><td>" + value.Customer_Name + "</td>";
    //                content += "<td>" + value.Speciality_Name + "</td><td>" + value.Category_Name + "</td>";
    //                if (parseInt(value.Date.split('/')[1]) <= parseInt(User_Dashboard.defaults.Current_Month)) {
    //                    if (parseInt(value.Date.split('/')[0]) < parseInt(User_Dashboard.defaults.Current_Date.split('-')[2])) {
    //                        content += "<td><span style='display:inline-block;color:red;font-weight:bold;'>" + value.Date + "</span></td></tr>";
    //                    }
    //                    else {
    //                        content += "<td>" + value.Date + "</td></tr>";
    //                    }
    //                }
    //                else {
    //                    content += "<td>" + value.Date + "</td></tr>";
    //                }
    //            });
    //        }
    //        content += '</tbody></table>';
    //        $('#dvInfoContent').html(content);
    //        $('.clsModalTitle').html('Doctor Anniversary');
    //        ShowModalPopup("dvMoreInfoModal");
    //        //  $.unblockUI();
    //        $('.dash-content-wrapper').unblock();
    //    },
    //    function (e) {
    //        $('.dash-content-wrapper').unblock();
    //    },
    //    function () {
    //        $('.dash-content-wrapper').unblock();
    //    });
    //},
    getTPMeetingPointMoreInfo: function (mode) {
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardTPMeetingPoint", null, "POST",
         function (jsonResult) {
             var content = '';
             if (jsonResult != false && jsonResult != '' && jsonResult != null) {
                 content += '<div class="col-lg-12"><table class="tblTP"> ';
                 if (mode == "T") {
                     content += "<tr><td colspan='2'><b>Tomorrow's Tour Planner</b></td></tr>";
                     var todayTP = jsonPath(jsonResult, "$.[?(@.TP_Date=='" + User_Dashboard.defaults.Next_Date + "')]");
                     if (todayTP != '' && todayTP != false && todayTP != null) {
                         content += '<tr><td>Activity Name</td><td> : ' + todayTP[0].Activity_Name + '</td></tr>';
                         content += '<tr><td>Meeting Point</td><td> : ' + todayTP[0].Meeting_Point + '</td></tr>';
                         content += '<tr><td>Time</td><td> : ' + todayTP[0].Meeting_Time + '</td></tr>';
                         content += '<tr><td>CP Name</td><td> : ' + todayTP[0].CP_name + '</td></tr>';
                         var accName = '';
                         if (todayTP[0].Accomp_Name != '') { accName = todayTP[0].Accomp_Name + "," };
                         if (todayTP[0].Accompanist2_Name != '') { accName = accName + todayTP[0].Accompanist2_Name + "," };
                         if (todayTP[0].Accompanist3_Name != '') { accName = accName + todayTP[0].Accompanist3_Name + "," };
                         if (todayTP[0].Accompanist4_Name != '') { accName = accName + todayTP[0].Accompanist4_Name + "," };
                         content += '<tr><td>Accompanist Name</td><td> : ' + accName.slice(0, -1) + '</td></tr>';
                         content += '<tr><td>TP Status</td><td> : ' + todayTP[0].TP_Status + '</td></tr>';
                     }
                     else {
                         content += '<tr><td colspan=2>No plan for tomorrow</td></tr>';
                     }
                 }
                 else {
                     content += "<tr><td colspan='2'><b>Day after tomorrow's Tour Planner</b></td></tr>";
                     var tomoTP = jsonPath(jsonResult, "$.[?(@.TP_Date=='" + User_Dashboard.defaults.Day_After_Tomorrow + "')]");
                     if (tomoTP != '' && tomoTP != false && tomoTP != null) {
                         content += '<tr><td>Activity Name</td><td> : ' + tomoTP[0].Activity_Name + '</td></tr>';
                         content += '<tr><td>Meeting Point</td><td> : ' + tomoTP[0].Meeting_Point + '</td></tr>';
                         content += '<tr><td>Time</td><td> : ' + tomoTP[0].Meeting_Time + '</td></tr>';
                         content += '<tr><td>CP Name</td><td> : ' + tomoTP[0].CP_name + '</td></tr>';
                         var accName = '';
                         if (tomoTP[0].Accomp_Name != '') { accName = tomoTP[0].Accomp_Name + "," };
                         if (tomoTP[0].Accompanist2_Name != '') { accName = accName + tomoTP[0].Accompanist2_Name + "," };
                         if (tomoTP[0].Accompanist3_Name != '') { accName = accName + tomoTP[0].Accompanist3_Name + "," };
                         if (tomoTP[0].Accompanist4_Name != '') { accName = accName + tomoTP[0].Accompanist4_Name + "," };
                         content += '<tr><td>Accompanist Name</td><td> : ' + accName.slice(0, -1) + '</td></tr>';
                         content += '<tr><td>TP Status</td><td> : ' + tomoTP[0].TP_Status + '</td></tr>';
                     }
                     else {
                         content += '<tr><td colspan=2>No plan for day after tomorrow</td></tr>';
                     }
                 }
                 content += " </table> </div>";
             }
             else {
                 content += "<div style='text-align:center;'>No Tour Planner details found for the selected date</div>";
             }

             $('#dvInfoContent').html(content);
             $('.clsModalTitle').html('Tour Planner Details');
             ShowModalPopup("dvMoreInfoModal");
             $('.dash-content-wrapper').unblock();
         },
                 function (e) {
                     $('.dash-content-wrapper').unblock();
                 });
    },
    getNextTwoDaysPlan: function () {
        var tpPrivilege = jsonPath(privilegeContainer_g, "$.[?(@.PrivilegeName=='TOUR_PLANNER')]");
        if (tpPrivilege != false && tpPrivilege != '' && tpPrivilege != null && tpPrivilege != undefined) {
            if (tpPrivilege[0].PrivilegeValue != "NO") {
                HDAjax.requestInvoke("Dashboard", "GetNextTwoDaysTourPlan", null, "POST",
                function (jsonResult) {
                    var content = '';
                    var todayDate = new Date(User_Dashboard.defaults.Next_Date);
                    var tomoDate = new Date(User_Dashboard.defaults.Day_After_Tomorrow);
                    if (jsonResult != null && jsonResult != '' && jsonResult != undefined) {
                        var todayTp = jsonPath(jsonResult, "$.[?(@.TP_Date=='" + User_Dashboard.defaults.Next_Date + "')]");
                        if (todayTp != false) {
                            $('.cls-today-date').html("<p class='cls-date-success'>" + weekdays[todayDate.getDay()] + "</p><p class='cls-date-num'>" + User_Dashboard.defaults.Next_Date.split('-')[2] + "</p>");
                            $('.cls-today-date').unbind('click').bind('click', function () {
                                User_Dashboard.getTPMeetingPointMoreInfo('T');//today
                            });
                            $('.cls-today-date').css('cursor', 'pointer');
                        }
                        else {
                            $('.cls-today-date').html("<p class='cls-date-Error'>" + weekdays[todayDate.getDay()] + "</p><p class='cls-date-num'>" + User_Dashboard.defaults.Next_Date.split('-')[2] + "</p>");
                        }

                        var tomoTp = jsonPath(jsonResult, "$.[?(@.TP_Date=='" + User_Dashboard.defaults.Day_After_Tomorrow + "')]");
                        if (tomoTp != false) {
                            $('.cls-next-date').html("<p class='cls-date-success'>" + weekdays[tomoDate.getDay()] + "</p><p class='cls-date-num'>" + User_Dashboard.defaults.Day_After_Tomorrow.split('-')[2] + "</p>");
                            $('.cls-next-date').unbind('click').bind('click', function () {
                                User_Dashboard.getTPMeetingPointMoreInfo('N');//next
                            });
                            $('.cls-next-date').css('cursor', 'pointer');
                        }
                        else {
                            $('.cls-next-date').html("<p class='cls-date-Error'>" + weekdays[tomoDate.getDay()] + "</p><p class='cls-date-num'>" + User_Dashboard.defaults.Day_After_Tomorrow.split('-')[2] + "</p>");
                        }
                    }
                    else {
                        $('.cls-today-date').html("<p class='cls-date-Error'>" + weekdays[todayDate.getDay()] + "</p><p class='cls-date-num'>" + User_Dashboard.defaults.Next_Date.split('-')[2] + "</p>");
                        $('.cls-next-date').html("<p class='cls-date-Error'>" + weekdays[tomoDate.getDay()] + "</p><p class='cls-date-num'>" + User_Dashboard.defaults.Day_After_Tomorrow.split('-')[2] + "</p>");
                    }
                },
                function () { });
            }
            else {
                $('.notp').html('NA');
            }
        }
        else {
            $('.notp').html('NA');
        }
    },
    getUnApprovedDCRMoreInfo: function () {
        $('#dvInfoContent').html('');
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardUnapprovedDCR", null, "POST",
         function (jsonResult) {
             var content = ' <table class="tblUnDcr table"><thead><tr><th>S.No</th><th>DCR Date</th><th>Activity Name</th><th>UnApproved By</th><th>Reason</th></tr></thead><tbody>';
             var i = 0;

             var preJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Previous_Month + "')]");
             if (preJson != false && preJson != null && preJson != '') {
                 content += "<tr><td colspan='5'><b>Previous Month</b></td></tr>";
                 $.each(preJson, function (index, value) {
                     i++;
                     content += "<tr><td>" + i + "</td><td>" + value.DCR_Date + "</td>";
                     content += "<td>" + value.Activity_Name + "</td>";
                     content += "<td>" + value.Approved_By + "</td><td>" + value.Unapproval_Reason + "</td></tr>";
                 });
             }
             var i = 0;
             var curJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Current_Month + "')]");
             if (curJson != false && curJson != null && curJson != '') {
                 content += "<tr><td colspan='5'><b>Current Month</b></td></tr>";
                 $.each(curJson, function (index, value) {
                     i++;
                     content += "<tr><td>" + i + "</td><td>" + value.DCR_Date + "</td>";
                     content += "<td>" + value.Activity_Name + "</td>";
                     content += "<td>" + value.Approved_By + "</td><td>" + value.Unapproval_Reason + "</td></tr>";
                 });
             }
             content += '</tbody></table>';
             $('#dvInfoContent').html(content);
             $('.clsModalTitle').html('Unapproved DCR Details');
             ShowModalPopup("dvMoreInfoModal");
             $('.dash-content-wrapper').unblock();
         },
             function (e) {
                 $('.dash-content-wrapper').unblock();
             });
    },
    getUnApprovedTPMoreInfo: function () {
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardUnapprovedTP", null, "POST",
         function (jsonResult) {

             var content = ' <table class="tblUnTP table"><thead><tr><th>S.No</th><th>TP Date</th><th>Activity Name</th><th>UnApproved By</th><th>Reason</th></tr></thead><tbody>';
             var curJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Current_Month + "')]");
             if (curJson != false && curJson != null && curJson != '') {
                 content += "<tr><td colspan=5><b>Current Month</b></td></tr>";
                 var i = 0;
                 $.each(curJson, function (index, value) {
                     i++;
                     content += "<tr><td>" + i + "</td><td>" + value.TP_Date + "</td>";
                     content += "<td>" + value.Activity_Name + "</td><td>" + value.Tp_Approved_By + "</td><td>" + value.Unapprove_Reason + "</td>";
                     content += "</tr>";
                 });
             }
             //else {
             //    content += "<tr><td colspan=5>No TP Details for current month</td></tr>";
             //}


             var nextJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Next_Month + "')]");
             if (nextJson != false && nextJson != null && nextJson != '') {
                 content += "<tr><td colspan=5><b>Next Month</b></td></tr>";
                 var i = 0;
                 $.each(nextJson, function (index, value) {
                     i++;
                     content += "<tr><td>" + i + "</td><td>" + value.TP_Date + "</td>";
                     content += "<td>" + value.Activity_Name + "</td>";
                     content += "<td>" + value.Tp_Approved_By + "</td><td>" + value.Unapprove_Reason + "</td></tr>";
                 });
             }
             //else {
             //    content += "<tr><td colspan=5>No TP Details for next month</td></tr>";
             //}

             content += '</tbody></table>';
             $('#dvInfoContent').html(content);
             $('.clsModalTitle').html('Unapproved TP Details');
             ShowModalPopup("dvMoreInfoModal");
             $('.dash-content-wrapper').unblock();
         },
         function (e) {
             $('.dash-content-wrapper').unblock();
         });
    },
    getTPLockDays: function () {
        //$('#dvInfoContent').html('');
        $('.cls-tp-lock').removeClass('cls-green-lock');
        $('.cls-tp-lock').removeClass('cls-orange-lock');
        $('.cls-tp-lock').removeClass('cls-lock');
        $('.cls-tp-lock').removeClass('cls-grey-lock');
        var tpPrivilege = jsonPath(privilegeContainer_g, "$.[?(@.PrivilegeName=='TOUR_PLANNER')]");
        if (tpPrivilege != false && tpPrivilege != '' && tpPrivilege != null && tpPrivilege != undefined) {
            if (tpPrivilege[0].PrivilegeValue != "NO") {
                HDAjax.requestInvoke("Dashboard", "GetUserDashboardTPLock", null, "POST",
                function (jsonResult) {

                    if (jsonResult != false && jsonResult != '' && jsonResult != null) {
                        var content = '';
                        if (jsonResult[0].Status == 'LOCKED') {
                            content += "<i class='fa fa-lock title-i'></i>";
                            content += "<p>TP not available for " + shortMonthArray[parseInt(jsonResult[0].Month) - 1] + " - " + jsonResult[0].Year + "</p>";
                            //content = '<tr><td>TP Locked for ' + shortMonthArray[parseInt(jsonResult[0].Month) - 1] + '-' + jsonResult[0].Year + '</td></tr>';
                            $('.cls-tp-lock').addClass('cls-lock');
                            // $('.cls-tp-lock').html();
                        }
                        else if (jsonResult[0].Status == 'NOT COMPLETED') {
                            var lockDay = jsonPath(privilegeContainer_g, "$.[?(@.PrivilegeName=='TP_LOCK_DAY')]");
                            if (lockDay != false) {
                                //content = '<tr>';
                                var bk = ''
                                if (jsonResult[0].Days_Count > 5) {
                                    $('.cls-tp-lock').addClass('cls-green-lock');
                                }
                                else if (jsonResult[0].Days_Count > 2 && jsonResult[0].Days_Count <= 5) {
                                    $('.cls-tp-lock').addClass('cls-orange-lock');
                                }
                                else if (jsonResult[0].Days_Count <= 2) {
                                    $('.cls-tp-lock').addClass('cls-lock');
                                }
                                //content += "<td  style='background-color:" + bk + ";color:white;'>Lock Days Left : <span  style='width: 100px;display: inline-block;text-align: center;'>" + jsonResult[0].Days_Count + "</span></td></tr>";
                                content += "<p>" + jsonResult[0].Days_Count + " day(s) left for " + shortMonthArray[parseInt(jsonResult[0].Month) - 1] + '-' + jsonResult[0].Year + " TP Completion</p>";
                            }
                            else {
                                //content = '<tr><td>&nbsp;</td></tr>';
                                $('.cls-tp-lock').addClass('cls-grey-lock');
                            }
                        }
                        else if (jsonResult[0].Status == 'COMPLETED') {
                            //content = '<tr><td class="viewTPLockMoreInfo" style="cursor:pointer;text-decoration:underline;">You have completed TP for the month - ' + shortMonthArray[parseInt(jsonResult[0].Month) - 1] + '-' + jsonResult[0].Year + '</td></tr>';
                            content += "<p>TP Completed</p><p>for  " + shortMonthArray[parseInt(jsonResult[0].Month) - 1] + '-' + jsonResult[0].Year + "</p>"
                            $('.cls-tp-lock').addClass('cls-green-lock');
                        }
                        else if (jsonResult[0].Status.toUpperCase() == 'YET TO PLAN') {
                            //  $('.cls-tp-lock').html('Yet to Plan TP');
                            content += "<p>Yet to Plan TP for  " + shortMonthArray[parseInt(jsonResult[0].Month) - 1] + '-' + jsonResult[0].Year + "</p>";
                            $('.cls-tp-lock').addClass('cls-grey-lock');
                        }
                        else {
                            $('.cls-tp-lock').addClass('cls-grey-lock');
                            // content = '<tr><td>&nbsp;</td></tr>';
                        }
                        $('.cls-tp-lock').html(content);
                        //$('.cls-tp-lock').unbind('click').bind('click', function () {
                        //    User_Dashboard.getTPLockDaysMoreInfo();
                        //});

                    }
                    else {
                        //TP_LOCK_MONTH_POSITION
                        //  $('.cls-tp-lock').html('Yet to Plan TP');
                        $('.cls-tp-lock').addClass('cls-grey-lock');
                    }
                    User_Dashboard.getDCRLock();
                },

                function (e) {
                    $('.cls-tp-lock').addClass('cls-grey-lock');
                    User_Dashboard.getDCRLock();
                });
            }
            else {
                //$('.cls-tp-lock').html('Yet to Plan TP');
                $('.cls-tp-lock').addClass('cls-grey-lock');
                User_Dashboard.getDCRLock();
            }
        }
        else {
            // $('.cls-tp-lock').html('Yet to Plan TP');
            $('.cls-tp-lock').addClass('cls-grey-lock');
            User_Dashboard.getDCRLock();
        }
    },
    getTPLockDaysMoreInfo: function () {
        $('#dvInfoContent').html('');
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardTPLockDetails", null, "POST",
        function (jsonResult) {
            console.log(jsonResult);
            var content = '';
            content += "<table class='tblTP'>";
            if (jsonResult != false && jsonResult != '' && jsonResult != null) {
                var headerJson = jsonResult[0].lstHeader;
                var doctorsJson = jsonResult[0].lstTPDoctors;
                var sfcJson = jsonResult[0].lstTPSFC;
                $.each(headerJson, function (index, value) {

                    content += "<tr><td>TP Date</td><td> : " + value.TP_Date + "</td></tr>";
                    content += "<tr><td>TP Name</td><td> : " + value.TP_Name + "</td></tr>";
                    content += " <tr><td>Work Area</td><td> : " + value.Work_Area + "</td></tr>";
                    content += "<tr><td>Doctors</td>";
                    var doctors = '';
                    var disDocJson = jsonPath(doctorsJson, "$.[?(@.TP_Date=='" + value.TP_Date + "')]");

                    $.each(disDocJson, function (docIndex, docValue) {
                        if (docValue.Customer_Name != '') {
                            doctors += docValue.Customer_Name + " | " + docValue.MDL_Number + ",";
                        }
                    });
                    content += "<td> : " + doctors.slice(0, -1) + "</td></tr>";

                    content += "<tr><td>SFC</td>";
                    var sfc = '';
                    var disSFCJson = jsonPath(sfcJson, "$.[?(@.TP_Date=='" + value.TP_Date + "')]");
                    $.each(disSFCJson, function (sfcIndex, sfcValue) {
                        if (sfcValue.From_Place != '') {
                            sfc += sfcValue.From_Place + " | " + sfcValue.To_Place + ",";
                        }
                    });
                    content += "<td> : " + sfc.slice(0, -1) + "</td></tr>";
                });
                content += "</tr>";
            }
            content += "</table>";
            $('#dvInfoContent').html(content);
            $('.clsModalTitle').html('Tour Plan Lock');
            ShowModalPopup("dvMoreInfoModal");
        },
    function (e) {
    });
    },
    getDCRLock: function () {
        $('.cls-dcr-lock').removeClass('cls-green-lock');
        $('.cls-dcr-lock').removeClass('cls-orange-lock');
        $('.cls-dcr-lock').removeClass('cls-lock');
        $('.cls-dcr-lock').removeClass('cls-grey-lock');
        var dcrLock = jsonPath(privilegeContainer_g, "$.[?(@.PrivilegeName=='DCR_LOCK_AUTOMATION')]");
        if (dcrLock != false && dcrLock != '' && dcrLock != null && dcrLock != undefined) {
            HDAjax.requestInvoke("Dashboard", "GetUserDashboardCDRLock", null, "POST",
            function (jsonResult) {
                var content = '', fun = '';
                if (jsonResult != '' && jsonResult != null && jsonResult != false) {
                    if (jsonResult[0].Lock_Status == "LOCKED") {
                        if (jsonResult[0].Lock_Type == "IDLE_DCR") {
                            content += "<i class='fa fa-lock title-i'></i><p>DCR Locked</p>";
                            $('.cls-dcr-lock').html(content);
                            $('.cls-dcr-lock').unbind('click').bind('click', function () { User_Dashboard.showDCRLock('IDLE_DCR', 'LOCKED') });
                            $('.cls-dcr-lock').addClass('cls-lock');
                            // content += "<tr><td><a onclick=User_Dashboard.showDCRLock('IDLE_DCR'); style='cursor:pointer;'>DCR is locked</a></td></tr>";
                        } else if (jsonResult[0].Lock_Type == "LOCK_LEAVE") {
                            // content += "<tr><td><a onclick=User_Dashboard.showDCRLock('LOCK_LEAVE');  style='cursor:pointer;'>" + jsonResult[0].No_Of_DCR_Locked + " day(s) DCR Locked</a></td></tr>";
                            content += "<i class='fa fa-lock title-i'></i><p>" + jsonResult[0].No_Of_DCR_Locked + " day(s) DCR Locked</p>";
                            $('.cls-dcr-lock').html(content);
                            $('.cls-dcr-lock').unbind('click').bind('click', function () { User_Dashboard.showDCRLock('LOCK_LEAVE', 'LOCKED') });
                            $('.cls-dcr-lock').addClass('cls-lock');
                        }
                        else {
                            var month = '', year = '';
                            if (jsonResult[0].TP_Month != null && jsonResult[0].TP_Month != '' && jsonResult[0].TP_Month != undefined) {
                                month = shortMonthArray[parseInt(jsonResult[0].TP_Month) - 1];
                            }
                            if (jsonResult[0].TP_Year != null && jsonResult[0].TP_Year != '' && jsonResult[0].TP_Year != undefined) {
                                year = jsonResult[0].TP_Year;
                            }
                            // content += "<tr><td><a onclick=User_Dashboard.showDCRLock('TP_UNAVAILABILITY');  style='cursor:pointer;'>DCR is locked</a></td></tr>";
                            content += "<i class='fa fa-lock title-i'></i><p>DCR Locked</p>";
                            $('.cls-dcr-lock').html(content);
                            $('.cls-dcr-lock').unbind('click').bind('click', function () { User_Dashboard.showDCRLock('TP_UNAVAILABILITY', 'LOCKED') });
                            $('.cls-dcr-lock').addClass('cls-lock');
                        }
                        //  $('#tblTPLockBody').append(content);
                    }
                    else {
                        //content += "<tr><td><a onclick=User_Dashboard.showDCRLock('RELEASED');  style='cursor:pointer;'>DCR is Released</a></td></tr>";
                        //$('#tblTPLockBody').append(content);
                        content += "<i class='fa fa-unlock title-i'></i><p>DCR is Released</p>";
                        $('.cls-dcr-lock').html(content);
                        $('.cls-dcr-lock').unbind('click').bind('click', function () { User_Dashboard.showDCRLock('RELEASED', jsonResult[0].Lock_Type) });
                        $('.cls-dcr-lock').addClass('cls-green-lock');
                    }
                }
                else {
                    content += "<p>No lock and release found</p>";
                    $('.cls-dcr-lock').html(content);
                    $('.cls-dcr-lock').addClass('cls-grey-lock');
                    //  content += "<tr><td>No lock and release found</td></tr>";
                    // $('#tblTPLockBody').append(content);
                    // $('#tblDCRLockBody').html('');
                }

            },
        function (e) {
        });
        }
        else {
            $('.cls-dcr-lock').addClass('cls-grey-lock');
        }
    },
    showDCRLock: function (lockType, lock) {
        var ar = new Array();
        var aa = {};
        aa.name = "lockType";
        aa.value = lockType;
        ar.push(aa);
        var content = '';
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardCDRLockMoreInfo", ar, "POST",
        function (jsonResult) {

            if (lockType == "IDLE_DCR") {
                content += "<table class='table'><thead><tr><th>DCR locked date </th></tr></thead><tbody><tr><td>" + jsonResult[0].LockedDate + "</td></tr></tbody></table>";
            }
            else if (lockType == "LOCK_LEAVE") {
                var data = '';
                //content += "<table class='table'><thead><tr><th>DCR Date</th><th>Locked Date</th></tr></thead>";
                var lockedJson = jsonPath(jsonResult, "$.[?(@.Lock_Status=='LOCKED')]");
                if (lockedJson != false && lockedJson != null && lockedJson != '') {
                    content += "<table class='table'><thead><tr><th>DCR Date</th><th>Locked Date</th></tr></thead>";
                    content += "<tr><td colspan='3'><b>Locked Dates</b></td></tr>";
                    for (var i = 0; i < lockedJson.length; i++) {
                        content += "<tr><td>" + lockedJson[i].DCR_Actual_Date + "</td><td>" + lockedJson[i].LockedDate + "</td></tr>";
                    }
                    content += "</tbody></table>";
                }

                var relesedJson = jsonPath(jsonResult, "$.[?(@.Lock_Status=='RELEASED')]");
                if (relesedJson != false && relesedJson != null && relesedJson != '') {
                    content += "<table class='table'><thead><tr><th>DCR Date</th><th>Locked Date</th><th>Released Date</th></tr></thead>";
                    content += "<tr><td colspan='3'><b>Released Dates</b></td></tr>";
                    for (var i = 0; i < relesedJson.length; i++) {
                        content += "<tr><td>" + relesedJson[i].DCR_Actual_Date + "</td><td>" + relesedJson[i].LockedDate + "</td><td>" + relesedJson[i].Released_Date + "</td></tr>";
                    }
                    content += "</tbody></table>";
                }
                if (lockedJson == false && relesedJson == false) {
                    content += "<div style='width:100%;text-align:center;'>No lock and release found</div>";
                }

                //for (var i = 0; i < jsonResult.length; i++) {
                //    content += "<tr><td>" + jsonResult[i].DCR_Actual_Date + "</td></tr>";
                //}

            }
            else if (lockType == "RELEASED") {
                if (lock == 'LOCK_LEAVE') {
                    content += "<table class='table'><thead><tr><th>DCR Date</th><th>Locked Date</th><th>Released Date</th></tr></thead><tbody>";
                    for (var i = 0; i < jsonResult.length; i++) {
                        content += "<tr><td>" + jsonResult[i].DCR_Actual_Date + "</td><td>" + jsonResult[i].LockedDate + "</td><td>" + jsonResult[i].Released_Date + "</td></tr>";
                    }
                    content += '</tbody></table>';
                }
                else if (lock == 'IDLE_DCR') {
                    content += "<table class=''><tr><td><b>DCR lock released date :" + jsonResult[0].Released_Date + "</b></td></tr></table>";
                }
                else {
                    content += "<table class=''><tr><td><b>DCR lock released date :" + jsonResult[0].Released_Date + "</b></td></tr></table>";
                }
            }
            else {
                content += "<table class=''><tr><td style='border-top:0px; !important;'>DCR is locked due to TP Unavailability</td></tr></table>";
            }

        });
        $('#dvInfoContent').html(content);
        $('.clsModalTitle').html('DCR Lock and Release Information');
        ShowModalPopup("dvMoreInfoModal");
    },
    unapprovedExpClaimMoreInfo: function () {
        //alert(lockType);
        var content = '';
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardExpClaimMoreInfo", null, "POST",
        function (jsonResult) {
            if (jsonResult != false && jsonResult != null && jsonResult != '') {
                content += "<table class='table'> <thead><tr><td>Request Id</td><td>Request Name</td><td>Request Type</td><td>Claim Date</td>";
                content += "<td>Period From</td><td>Period To</td><td>Unapproved By</td><td>Remarks</td></tr></thead>";
                $.each(jsonResult, function (index, value) {
                    content += "<tr><td>" + value.Request_Code + "</td>";
                    content += "<td>" + value.Request_Name + "</td>";
                    content += "<td>" + value.Request_Type + "</td>";
                    content += "<td>" + value.Entered_DateTime + "</td>";
                    content += "<td>" + value.Date_From + "</td>";
                    content += "<td>" + value.Date_To + "</td>";
                    content += "<td>" + value.Updated_By + "</td>";
                    content += "<td>" + value.Remarks_By_User + "</td></tr>";
                });
                content += "</table>";
            }
        });
        $('#dvInfoContent').html(content);
        $('.clsModalTitle').html('Unapproved Expense claim');
        ShowModalPopup("dvMoreInfoModal");
    },
    getPendingDCRMoreInfo: function () {
        var content = '';
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardPendingDCR", null, "POST",
        function (jsonResult) {
            content = User_Dashboard.showDCrMoreInfo(jsonResult)
        });
        $('#dvInfoContent').html(content);
        $('.clsModalTitle').html('Pending DCR');
        ShowModalPopup("dvMoreInfoModal");
    },
    getPendingTPMoreInfo: function () {
        var content = '';
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardPendingTP", null, "POST",
        function (jsonResult) {
            content = User_Dashboard.showTPMoreInfo(jsonResult);
            $('.dash-content-wrapper').unblock();
        }, function () {
            $('.dash-content-wrapper').unblock();
        });
        $('#dvInfoContent').html(content);
        $('.clsModalTitle').html('Pending TP');
        ShowModalPopup("dvMoreInfoModal");
    },
    pendingClaimViewMore: function () {
        var content = '';
        var ar = new Array();
        var a = {};
        a.name = "month";
        a.value = 0;
        var b = {};
        b.name = "year";
        b.value = 0;
        ar.push(a);
        ar.push(b);
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardPendingClaim", ar, "POST",
        function (jsonResult) {
            content = User_Dashboard.showClaimMoreInfo(jsonResult);
            $('.dash-content-wrapper').unblock();
        }, function (result) { $('.dash-content-wrapper').unblock(); }, function () {
        });
        $('#dvInfoContent').html(content);
        $('.clsModalTitle').html('Pending Expense Claim');
        ShowModalPopup("dvMoreInfoModal");
    },
    secondarysalesMoreInfo: function (mode) {
        var content = '';
        var a = new Array();

        var b = {};
        b.name = "mode";
        b.value = mode;
        a.push(b);

        HDAjax.requestInvoke("Dashboard", "GetUserDashboardSSDetails", a, "POST",
        function (jsonResult) {
            if (jsonResult != false && jsonResult != null && jsonResult != '') {
                content += "<table class='table'> <thead><tr><td>Stockist Name</td><td>Region Name</td>";
                if (mode == "Q") {
                    content += "<td>Quantity</td>";
                }
                else {
                    content += "<td>Amount</td>";
                }
                content += "</tr></thead>";
                content += "<tr><td colspan=3><b>Current Month</b></td></tr>";
                var curJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Current_Month + "')]");
                if (curJson != false && curJson != null && curJson != '') {
                    $.each(curJson, function (index, value) {
                        content += "<tr><td>" + value.Customer_Name + "</td>";
                        content += "<td>" + value.Region_Name + "</td>";
                        if (mode == "Q") {
                            content += "<td>" + value.Quantity + "</td> </tr>";
                        }
                        else {
                            content += "<td>" + value.Amount + "</td> </tr>";
                        }
                    });
                }
                content += "<tr><td  colspan=3><b>Previous Month</b></td></tr>";
                var preJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Previous_Month + "')]");
                if (preJson != false && preJson != null && preJson != '') {
                    $.each(preJson, function (index, value) {
                        content += "<tr><td>" + value.Customer_Name + "</td>";
                        content += "<td>" + value.Region_Name + "</td>";
                        if (mode == "Q") {
                            content += "<td>" + value.Quantity + "</td> </tr>";
                        }
                        else {
                            content += "<td>" + value.Amount + "</td> </tr>";
                        }
                    });
                }
                content += "</table>";
            }
            $('.dash-content-wrapper').unblock();
        }, function () { $('.dash-content-wrapper').unblock(); });
        $('#dvInfoContent').html(content);
        $('.clsModalTitle').html('Secondary Sales');
        ShowModalPopup("dvMoreInfoModal");
    },
    showDCrMoreInfo: function (jsonResult) {
        var content = '';
        if (jsonResult != false && jsonResult != null && jsonResult != '') {
            content += "<table class='table'> <thead><tr><td>DCR Date</td><td>User Name</td><td>Activity Name</td>";
            content += "</tr></thead>";

            var curJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Current_Month + "')]");
            if (curJson != false && curJson != null && curJson != '') {
                content += "<tr><td colspan='3'><b>Current Month</b></td></tr>";
                $.each(curJson, function (index, value) {
                    content += "<tr><td>" + value.Formatted_DCR_Actual_Date + "</td>";
                    content += "<td>" + value.User_Name + "</td>";
                    content += "<td>" + value.Activity_Name + "</td></tr>";
                });
            }

            var preJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Previous_Month + "')]");
            if (preJson != false && preJson != null && preJson != '') {
                content += "<tr><td colspan='3'><b>Previous Month</b></td></tr>";
                $.each(preJson, function (index, value) {
                    content += "<tr><td>" + value.Formatted_DCR_Actual_Date + "</td>";
                    content += "<td>" + value.User_Name + "</td>";
                    content += "<td>" + value.Activity_Name + "</td></tr>";
                });
            }
            content += "</table>";
        }
        return content;
    },
    showTPMoreInfo: function (jsonResult) {
        var content = '';
        if (jsonResult != false && jsonResult != null && jsonResult != '') {
            content += "<table class='table'> <thead><tr><td>TP Date</td><td>User Name</td><td>Activity Name</td>";
            content += "</tr></thead>";

            var curJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Current_Month + "')]");
            if (curJson != false && curJson != null && curJson != '') {
                content += "<tr><td colspan='3'><b>Current Month</b></td></tr>";
                $.each(curJson, function (index, value) {
                    content += "<tr><td>" + value.Formatted_Tp_Date + "</td>";
                    content += "<td>" + value.User_Name + "</td>";
                    content += "<td>" + value.Activity_Name + "</td></tr>";
                });
            }

            var nextJson = jsonPath(jsonResult, "$.[?(@.Month=='" + User_Dashboard.defaults.Next_Month + "')]");
            if (nextJson != false && nextJson != null && nextJson != '') {
                content += "<tr><td colspan='3'><b>Next Month</b></td></tr>";
                $.each(nextJson, function (index, value) {
                    content += "<tr><td>" + value.Formatted_Tp_Date + "</td>";
                    content += "<td>" + value.User_Name + "</td>";
                    content += "<td>" + value.Activity_Name + "</td></tr>";
                });
            }
            content += "</table>";
        }
        return content;
    },
    showClaimMoreInfo: function (jsonResult) {
        var content = '';
        if (jsonResult != false && jsonResult != null && jsonResult != '') {
            content += "<table class='table'> <thead><tr><td>Request Id</td><td>Request Type</td><td>Claim Date</td>";
            content += "<td>Period From</td><td>Period To</td><td>User Name</td><td>Reason</td></tr></thead>";
            $.each(jsonResult, function (index, value) {
                content += "<tr><td>" + value.Claim_Code + "</td>";
                content += "<td>" + value.Request_Type + "</td>";
                content += "<td>" + value.Entered_DateTime + "</td>";
                content += "<td>" + value.Date_From + "</td>";
                content += "<td>" + value.Date_To + "</td>";
                content += "<td>" + value.User_Name + "</td>";
                content += "<td>" + value.Remarks_By_User + "</td></tr>";
            });
            content += "</table>";
        }
        return content;
    },
    redirectToDoctorVisitReport: function (mode, userCode, regionCode) {
        var IsCurrent = User_Dashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        $('#main').load('Dashboard/UserDashboardDoctorVisit/' + mode + '~' + userCode + '~' + regionCode + "~" + User_Dashboard.defaults.Child_User_Count + "~" + IsCurrent + "~" + User_Dashboard.defaults.categoryCoverageMode);
    },

    getUserDashboardCategoryWiseVisits: function (userCode, regionCode, mode) {
        debugger;
        var u = {};
        u.name = "userCode";
        u.value = userCode;

        var r = {};
        r.name = "regionCode";
        r.value = regionCode;

        var m = {};
        m.name = "mode";
        m.value = mode;

        var c = {};
        c.name = "category";
        if ($('#cboCategory').val() == null) {
            c.value = '';
        }
        else {
            c.value = $('#cboCategory').val();
        }

        var s = {};
        s.name = "speciality";
        if ($('#cboSpeciality').val() == null) {
            s.value = '';
        }
        else {
            s.value = $('#cboSpeciality').val();
        }

        var p = {};
        p.name = "isCurrent";
        p.value = User_Dashboard.defaults.isCurrent == true ? 'Current' : 'Previous';

        var ar = new Array();
        ar.push(u);
        ar.push(r);
        ar.push(m);
        ar.push(c);
        ar.push(s);
        ar.push(p);

        var content = '';
        HDAjax.requestInvoke("Dashboard", "GetUserDashboardCategoryWiseVisits", ar, "POST",
        function (jsonResult) {

            User_Dashboard.bindCategoryWiseDoctorVisit(jsonResult, mode, userCode, regionCode)
        });
        //$('#dvInfoContent').html(content);
        //$('.clsModalTitle').html('Pending DCR');
        //ShowModalPopup("dvMoreInfoModal");
    },
    bindCategoryWiseDoctorVisit: function (jsonResult, mode, userCode, regionCode) {
        $('#dvRepVisit').html('');
        var content = '';
        var disCatAr = new Array();
        var disSpeAr = new Array();
        content += "<table class='data display datatable'><thead><tr><th>S.No</th><th>Doctor Name</th><th>Speciality</th><th>MDL No</th>";
        content += "<th>Category</th><th>Standard Visit</th><th># Current Month Visits</th><th># Previous Month Visits</th></tr> </thead><tbody>";
        var i = 0;
        if (jsonResult != false && jsonResult != '' && jsonResult != null && jsonResult != undefined) {
            $.each(jsonResult, function (index, value) {
                debugger;
                i = i + 1;
                var curClassName = '';
                var preClassName = '';
                var curValue = 0;
                var preValue = 0;
                var stdVisitCount = 0;
                if (firstTimeLoad) {
                    if ($.inArray(value.Category_Code + "~" + value.Category_Name, disCatAr) == -1) {
                        disCatAr.push(value.Category_Code + "~" + value.Category_Name);
                    }
                    if ($.inArray(value.Speciality_Code + "~" + value.Speciality_Name, disSpeAr) == -1) {
                        disSpeAr.push(value.Speciality_Code + "~" + value.Speciality_Name);
                    }
                }

                content += "<tr><td>" + i + "</td>";
                content += "<td>" + value.Doctor_Name + "</td>";
                content += "<td>" + value.Speciality_Name + "</td>";
                content += "<td>" + value.MDL_Number + "</td>";
                content += "<td>" + value.Category_Name + "</td>";
                content += "<td>" + value.Standard_Visits_Count + "</td>";
                stdVisitCount = value.Standard_Visits_Count;

                curValue = value.Cur_Month_Count;
                preValue = value.Pre_Month_Count;
                if (mode == "MISSED") {
                    //curValue = value.Cur_Month_Category_Missed_Doctors;
                    //preValue = value.Pre_Month_Category_Missed_Doctors;
                    curClassName = 'cls-missed-color';
                    //content += "<td class='cls-missed-color'>" + value.Cur_Month_Category_Missed_Doctors + "</td>";
                    // content += "<td>" + value.Pre_Month_Category_Missed_Doctors + "</td>";
                }
                else if (mode == "MET_AS_PER_STANDARD") {
                    //curValue = value.Cur_Month_Category_VC_Followed;
                    //preValue = value.Pre_Month_Category_VC_Followed;
                    curClassName = 'cls-met-std';
                    //content += "<td class='cls-met-std'>" + value.Cur_Month_Category_VC_Followed + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Followed + "</td>";
                }
                else if (mode == "LESS_THAN_MET") {
                    //curValue = value.Cur_Month_Category_VC_Missed;
                    //preValue = value.Pre_Month_Category_VC_Missed;
                    curClassName = 'cls-met-less';
                    //content += "<td class='cls-met-less'>" + value.Cur_Month_Category_VC_Missed + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Missed + "</td>";
                }
                else {
                    //curValue = value.Cur_Month_Category_VC_Exceeded;
                    //preValue = value.Pre_Month_Category_VC_Exceeded;
                    curClassName = 'cls-met-more';
                    //content += "<td class='cls-met-more'>" + value.Cur_Month_Category_VC_Exceeded + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Exceeded + "</td>";
                }

                content += "<td style='text-align:center;' class=" + curClassName + ">" + curValue + "</td>";
                if (preValue == 0) {
                    preClassName = 'cls-missed-color';
                }
                else if (preValue == stdVisitCount) {
                    preClassName = 'cls-met-std';
                }
                else if (preValue < stdVisitCount) {
                    preClassName = 'cls-met-less';
                }
                else {
                    preClassName = 'cls-met-more';
                }
                content += "<td style='text-align:center;' class=" + preClassName + ">" + preValue + "</td></tr>";
            });
        }
        content += " </tbody></table>";
        $('#dvRepVisit').html(content);

        if ($.fn.dataTable) {
            $('.datatable').dataTable({
                "bPaginate": false, "bFilter": false, "bSearchable": false, "bSort": true, "bDestroy": true
            });
        };
        if (firstTimeLoad) {
            $("#cboCategory option").remove();
            $("#cboCategory").append("<option value=''>-Select Category-</option>")
            $.each(disCatAr, function (index, value) {
                $("#cboCategory").append("<option value='" + value.split('~')[0] + "'>" + value.split('~')[1] + "</option>")
            });
            $("#cboSpeciality option").remove();
            $("#cboSpeciality").append("<option value=''>-Select Speciality-</option>")
            $.each(disSpeAr, function (index, value) {
                $("#cboSpeciality").append("<option value='" + value.split('~')[0] + "'>" + value.split('~')[1] + "</option>")
            });

        }
        $("#cboCategory").unbind('change').bind('change', function () {
            firstTimeLoad = false;
            User_Dashboard.getUserDashboardCategoryWiseVisits(userCode, regionCode, mode);
        });
        $("#cboSpeciality").unbind('change').bind('change', function () {
            firstTimeLoad = false;
            //User_Dashboard.getUserDashboardCategoryWiseVisits();
            User_Dashboard.getUserDashboardCategoryWiseVisits(userCode, regionCode, mode);
        });
        $('.tblFilter').show();
        console.log(disSpeAr);
    },
    getUserDashboardDoctorVisitSummary: function () {
        debugger;
        var _objData = new Object();
        _objData.IsCurrent = User_Dashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        _objData.IsSummaryMode = User_Dashboard.defaults.categoryCoverageMode;
        _objData.PageNo = User_Dashboard.defaults.visitSummaryPageNo;
        _objData.Pagesize = 10;
        //_objData.Mode = User_Dashboard.defaults.categoryCoverageMode;


        $.ajax({
            start: User_Dashboard.blockUI("main"),
            type: 'POST',
            dataType: 'json',
            url: "Dashboard/GetUserDashboardDoctorVisitSummary",
            data: _objData,
            success: function (jsonResult) {

                User_Dashboard.bindManagerDoctorVisit(jsonResult)
            },
            error: function (e) {
                User_Dashboard.UnblockUI("main");
            },
            complete: function (jsonData) {
                if (User_Dashboard.defaults.visitSummaryPageNo == 1) {
                    var jData = JSON.parse(jsonData.responseText)
                    $('#visitSummary-Pagination').pagination({
                        items: jData.Totalcount,
                        itemsOnPage: 10,
                        hrefTextPrefix: 'javascript:User_Dashboard.getVisitSummaryPagination(',
                        hrefTextSuffix: ');',
                        cssStyle: 'light-theme'
                    });
                }
                User_Dashboard.UnblockUI("main");
            }
        });

    },
    //getUserDashboardDoctorVisitSummary: function () {
    //    HDAjax.requestInvoke("Dashboard", "GetUserDashboardDoctorVisitSummary", null, "POST",
    //    function (jsonResult) {
    //        User_Dashboard.bindManagerDoctorVisit(jsonResult)
    //    });
    //},
    bindManagerDoctorVisit: function (jsonResult) {
        var content = '';
        content += "<table class='data display datatable'><thead><tr><th>S.No</th><th>Region Name</th><th>Employee Name</th><th>Employee Number</th><th>Designation</th><th>Total Doctors</th>";
        content += "<th>Doctor Missed</th><th>Met Exactly</th><th>Less than met</th><th>More than met</th></tr></thead><tbody>";
        var i = 0;
        if (jsonResult != false && jsonResult != '' && jsonResult != null && jsonResult != undefined) {
            $.each(jsonResult.lstDashboardDoctorVisitSummary, function (index, value) {
                i = i + 1;
                content += " <tr>";
                content += "<td>" + value.RowNumber + "</td>";
                content += "<td>" + value.Region_Name + "</td>";
                content += "<td>" + value.Employee_Name + "</td>";
                content += "<td>" + value.Employee_Number + "</td>";
                content += "<td>" + value.User_Type_Name + "</td>";
                content += "<td>" + value.Total_Approved_Doctors + "</td>";
                if (value.Category_Missed_Doctors > 0) {
                    content += "<td class='cls-missed-color'><span class='cls-link' onclick=User_Dashboard.getRepCategoryWiseVisit('" + value.User_Code + "','" + value.Region_Code + "','\MISSED\')>" + value.Category_Missed_Doctors + "</span></td>";
                }
                else {
                    content += "<td class='cls-missed-color'><span>" + value.Category_Missed_Doctors + "</span></td>";
                }
                if (value.Category_VC_Followed > 0) {
                    content += "<td class='cls-met-std'><span class='cls-link' onclick=User_Dashboard.getRepCategoryWiseVisit('" + value.User_Code + "','" + value.Region_Code + "','\MET_AS_PER_STANDARD\')>" + value.Category_VC_Followed + "</span></td>";
                }
                else {
                    content += "<td class='cls-met-std'><span>" + value.Category_VC_Followed + "</span></td>";
                }
                if (value.Category_VC_Missed > 0) {
                    content += "<td class='cls-met-less'><span  class='cls-link'  onclick=User_Dashboard.getRepCategoryWiseVisit('" + value.User_Code + "','" + value.Region_Code + "','\LESS_THAN_MET\')>" + value.Category_VC_Missed + "</span></td>";
                }
                else {
                    content += "<td class='cls-met-less'><span>" + value.Category_VC_Missed + "</span></td>";
                }
                if (value.Category_VC_Exceeded > 0) {
                    content += "<td class='cls-met-more'><span class='cls-link' onclick=User_Dashboard.getRepCategoryWiseVisit('" + value.User_Code + "','" + value.Region_Code + "','\MORE_THAN_MET\')>" + value.Category_VC_Exceeded + "</span></td>";

                }
                else {
                    content += "<td class='cls-met-more'><span>" + value.Category_VC_Exceeded + "</span></td>";
                }
                content += "</tr>";
            });
        }

        content += " </tbody>";
        content += "</table>";
        $('#dvManagerVisit').html(content);
        $('.tblFilter').hide();
    },
    getVisitSummaryPagination: function (pageNumber) {
        User_Dashboard.defaults.visitSummaryPageNo = pageNumber;
        User_Dashboard.getUserDashboardDoctorVisitSummary();
    },
    getRepCategoryWiseVisit: function (userCode, regionCode, mode) {
        firstTimeLoad = true;
        $('#cboCategory').val('');
        $('#cboSpeciality').val('');
        User_Dashboard.getUserDashboardCategoryWiseVisits(userCode, regionCode, mode);
    },
    getDivisions: function () {
        $.ajax({
            start: $.unblockUI(),
            type: 'POST',
            url: "DashBoard/GetDivisions",
            success: function (jsonData) {
                debugger;
                var listItems;
                if (1 < jsonData.length) {
                    listItems += "<option selected='selected' data-division_Code = 'All'>-- All --</option>";
                    for (var i = 0; i < jsonData.length; i++) {
                        listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                    }
                }
                else {

                    for (var i = 0; i < jsonData.length; i++) {
                        if (i == 0) {
                            listItems += "<option selected='selected' data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        } else {
                            listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        }
                    }

                }

                $("#ddlCategoryCoverageDivision").html(listItems);
            },
            error: function (e) {
                $.unblockUI();
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
            },
            complete: function () {
                User_Dashboard.getNewCategoryCoverage();

            }
        });
    },
    getNewCategoryCoverage: function () {
        $('#categorydrop').fadeOut();
        var month = Month_category;
        var year = Year_category
        var _objData = new Object();
        _objData.IsCurrent = User_Dashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        if (_objData.IsCurrent == 'Previous') {
            if (month == 1) {
                month = 12;
                year = year - 1;
            }
            else {
                month = month - 1;
            }
        }
        _objData.Month = month;
        _objData.Year = year;
       
        User_Dashboard.defaults.CategoryCoverageDetails = $("#ddlCategoryCoverageDivision").find(':selected').val();
        //var _objData = new Object();
        _objData.Division_Name = User_Dashboard.defaults.CategoryCoverageDetails;

        if (_objData.Division_Name == '-- All --') {
            _objData.Division_Name = '';
        }

        //User_Dashboard.defaults.CategoryCoverageDetails = $("#ddlCategoryCoverageDivision").find(':selected').data('division_code');
        //var _objData = new Object();
        //_objData.DivisionCode = User_Dashboard.defaults.CategoryCoverageDetails;


        $.ajax({
            // start: User_Dashboard.blockUI("dvDCRComplaince"),
            type: 'POST',
            url: "DashBoard/GetNewCategoryCoverage",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                var missedDoctors = jsonData[0].Missed;
                var metasperstandard = jsonData[0].Exact_Norms;
                var lessthanStdVisits = jsonData[0].Less_Norms;
                var morethanStdVisits = jsonData[0].More_Norms;
                var totalDoctors = jsonData[0].Total;
                var progressmissed = (missedDoctors / totalDoctors) * 100;
                var progressstandard = (metasperstandard / totalDoctors) * 100;
                var progressless = (lessthanStdVisits / totalDoctors) * 100;
                var progressmore = (morethanStdVisits / totalDoctors) * 100;
                var myArray = [missedDoctors, metasperstandard, lessthanStdVisits, morethanStdVisits];
                var maxValueInArray = Math.max.apply(Math, myArray);
                var index = myArray.indexOf(maxValueInArray);
                if (missedDoctors == 0 && metasperstandard == 0 && lessthanStdVisits == 0 && morethanStdVisits == 0) {
                    index = -1;
                }
                var className = 'max-category';
                var content = '';
                content += "<p class='lengend'>";
                content += "<span>Completely missed count</span>";
                if (missedDoctors > 0) {
                    content += "<span class='doc-count doc-missed'><b class='cls-link'>" + missedDoctors + "</b>/" + totalDoctors + " Doctors</span>";
                }
                else {
                    content += "<span class='doc-count'><b>" + missedDoctors + "</b>/" + totalDoctors + " Doctors</span>";
                }
                content += "</p>";
                if (index == 0) {
                    content += "<div class='progress missed-main " + className + "'>";
                }
                else {
                    content += "<div class='progress missed-main'>";
                }
                if (User_Dashboard.defaults.isCurrent) {
                    content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressmissed + "%'>";
                }
                else {
                    content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressmissed + "%'>";
                }

                content += "</div>";
                content += "</div>";
                content += "<p class='lengend'>";
                content += "<span>Met as per Std. Norm (Doctor Count)</span>";
                if (metasperstandard > 0) {
                    content += "<span class='doc-count doc-met-per-std'><b class='cls-link'>" + metasperstandard + "</b>/" + totalDoctors + " Doctors</span>";
                }
                else {
                    content += "<span class='doc-count'><b class=''>" + metasperstandard + "</b>/" + totalDoctors + " Doctors</span>";
                }
                content += "</p>";
                if (index == 1) {
                    content += "<div class='progress met-main " + className + "'>";
                }
                else {
                    content += "<div class='progress met-main'>";
                }
                if (User_Dashboard.defaults.isCurrent) {
                    content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressstandard + "%'>";
                } else {
                    content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressstandard + "%'>";
                }

                content += "</div>";
                content += "</div>";
                content += "<p class='lengend'>";
                content += "<span>Less than Std. Norm (Doctor Count)</span>";
                if (lessthanStdVisits > 0) {
                    content += "<span class='doc-count doc-less-met'><b class='cls-link'>" + lessthanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
                }
                else {
                    content += "<span class='doc-count'><b class=''>" + lessthanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
                }
                content += " </p>";
                if (index == 2) {
                    content += "<div class='progress less-met-main " + className + "'>";
                }
                else {
                    content += "<div class='progress less-met-main'>";
                }
                if (User_Dashboard.defaults.isCurrent) {
                    content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressless + "%'>";
                } else {
                    content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressless + "%'>";
                }

                content += "</div>";
                content += "</div>";
                content += "<p class='lengend'>";
                content += "<span>More than Std. Norm (Doctor Count)</span>";
                if (morethanStdVisits > 0) {
                    content += "<span class='doc-count doc-more-met'><b class='cls-link'>" + morethanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
                }
                else {
                    content += "<span class='doc-count'><b class=''>" + morethanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
                }
                content += " </p>";
                if (index == 3) {
                    content += "<div class='progress more-met-main " + className + "'>";
                }
                else {
                    content += "<div class='progress more-met-main'>";
                }
                if (User_Dashboard.defaults.isCurrent) {
                    content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressmore + "%'>";
                } else {
                    content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressmore + "%'>";
                }

                content += " </div>";
                content += " </div>";
                $('.cls-all-coverage').html(content);

                $('.doc-missed').unbind('click').bind('click', function () {
                    User_Dashboard.redirectToDoctorVisitReport('1', _objData.Division_Name, '');
                });
                $('.doc-met-per-std').unbind('click').bind('click', function () {
                    User_Dashboard.redirectToDoctorVisitReport('2', _objData.Division_Name, '');
                });
                $('.doc-less-met').unbind('click').bind('click', function () {
                    User_Dashboard.redirectToDoctorVisitReport('3', _objData.Division_Name, '');
                });
                $('.doc-more-met').unbind('click').bind('click', function () {
                    User_Dashboard.redirectToDoctorVisitReport('4', _objData.Division_Name, '');
                });
            },
        });
    },
    redirectToDoctorVisitReport: function (mode, Division_Name, regionCode) {
        var IsCurrent = User_Dashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        Division_Name = encodeURIComponent(Division_Name);
        $('#main').load('Dashboard/UserDashboardDoctorVisit/' + mode + '~' + Division_Name + '~' + regionCode + "~" + User_Dashboard.defaults.Child_User_Count + "~" + IsCurrent);
    },
    getNewCategoryCoverageSummary: function (curMonth, curYear, mode, Division_Name) {
        var _objData = new Object();
        _objData.IsCurrent = User_Dashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        _objData.DivisionCode = User_Dashboard.defaults.CategoryCoverageDetails;
        _objData.Month = curMonth;
        _objData.Year = curYear;
        _objData.Division_Name = Division_Name;
        _objData.Option_Type = mode;

        $.ajax({
            start: User_Dashboard.blockUI("main"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "DashBoard/GetNewCategoryCoverageSummery",
            success: function (jsonData) {
                var Division = '';
                var content = '';
                content += "<table class='data display datatable dataTable' id='tblAdminDashboardVisitSummary'><thead><tr><th>S.No</th><th>Region Name</th><th>Employee Name</th><th>Employee Number</th><th>Designation</th><th>Total Doctors</th>";
                content += "<th>Doctor Missed</th><th>Met Exactly</th><th>Less than met</th><th>More than met</th></tr></thead><tbody>";
                var i = 0;
                if (jsonData != false && jsonData != '' && jsonData != null && jsonData != undefined) {

                    $.each(jsonData, function (index, value) {
                        i = i + 1;
                        content += " <tr>";
                        content += "<td>" + i + "</td>";
                        content += "<td><span Class='cls-link' onclick=User_Dashboard.getRegionCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',1)  >" + value.Region_Name + "</span></td>";
                        content += "<td>" + value.Employee_Name + "</td>";User_Dashboard
                        content += "<td>" + value.Employee_Number + "</td>";
                        content += "<td>" + value.Designation + "</td>";
                        content += "<td>" + value.Total + "</td>";
                        if (value.Missed > 0) {
                            content += "<td class='cls-missed-color'><span class='cls-link' onclick=User_Dashboard.getNewRepCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + Division + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',1)>" + value.Missed + "</span></td>";
                        }
                        else {
                            content += "<td class='cls-missed-color'><span>" + value.Missed + "</span></td>";
                        }
                        if (value.Exact_Norms > 0) {
                            content += "<td class='cls-met-std'><span class='cls-link' onclick=User_Dashboard.getNewRepCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + Division + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',2)>" + value.Exact_Norms + "</span></td>";
                        }
                        else {
                            content += "<td class='cls-met-std'><span>" + value.Exact_Norms + "</span></td>";
                        }
                        if (value.Less_Norms > 0) {
                            content += "<td class='cls-met-less'><span  class='cls-link'  onclick=User_Dashboard.getNewRepCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + Division + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',3)>" + value.Less_Norms + "</span></td>";
                        }
                        else {
                            content += "<td class='cls-met-less'><span>" + value.Less_Norms + "</span></td>";
                        }
                        if (value.More_Norms > 0) {
                            content += "<td class='cls-met-more'><span class='cls-link' onclick=User_Dashboard.getNewRepCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + Division + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',4)>" + value.More_Norms + "</span></td>";

                        }
                        else {
                            content += "<td class='cls-met-more'><span>" + value.More_Norms + "</span></td>";
                        }
                        content += "</tr>";
                    });
                }

                content += " </tbody>";
                content += "</table>";
                $('#dvManagerVisit').html(content);
                $('.tblFilter').hide();
            },
            error: function (e) {
                User_Dashboard.UnblockUI("main");
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
            },
            complete: function (jsonData) {

                User_Dashboard.UnblockUI("main");
            }
        });

    },
    getRegionCategoryWiseVisit: function (Month, Year, Region_Code,Region_Name, mode) {
        var _objData = new Object();
        _objData.Month = Month;
        _objData.Year = Year;
        _objData.RegionCode = Region_Code;
        var RegionName = decodeURIComponent(Region_Name);
        $.ajax({
            start: User_Dashboard.blockUI("main"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "DashBoard/GetRegionCategoryCoverageSummery",
            success: function (jsonData) {
                $('#dvRepVisit').html('');
                $('#dvTitleForRep').html('Region wise doctor details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
                var content = '';
                content += "<table class='data display datatable' id='tblCategoryWiseDoctorVisit'><thead><tr><th>S.No</th><th>Category Name</th><th>Speciality Name</th><th>Total Doctors</th><th>Doctor Missed</th><th>Met Exactly</th><th>Less than met</th><th>More than met</th></tr></thead><tbody>";
                var i = 0;
                if (jsonData != false && jsonData != '' && jsonData != null && jsonData != undefined) {

                    $.each(jsonData, function (index, value) {
                        i = i + 1;
                        content += " <tr>";
                        content += "<td>" + i + "</td>";
                        content += "<td>" + value.Category_Name + "</td>";
                        content += "<td>" + value.Speciality_Name + "</td>";
                        content += "<td>" + value.Total + "</td>";
                        content += "<td class='cls-missed-color'>" + value.Missed + "</td>";
                        content += "<td class='cls-met-std'>" + value.Exact_Norms + "</td>";
                        content += "<td class='cls-met-less'>" + value.Less_Norms + "</td>";
                        content += "<td class='cls-met-more'>" + value.More_Norms + "</td>";
                        content += "</tr>";
                    });
                }
                content += " </tbody>";
                content += "</table>";
                $('#dvRepVisit').html(content);
                $('html,body').animate({
                    scrollTop: $("#dvTitleForRep").offset().top
                },
    'slow');
                $('#tblCategoryWiseDoctorVisit').DataTable(
     {
         "paging": false,
         "ordering": false,
         //"info": false
         "bRetrieve": true,
         "bDestroy": true,
         "bPaginate": false,
     });
                $('.tblFilter').hide();
            },
            error: function (e) {
                User_Dashboard.UnblockUI("main");
            },
            complete: function (jsonData) {

                User_Dashboard.UnblockUI("main");
            }
        });

    },
    getNewRepCategoryWiseVisit: function (Month, Year, Division_Name, Region_Code, Region_Name, mode) {
        User_Dashboard.blockUI("dvManagerVisit");
        firstTimeLoad = true;
        $('#cboCategory').val('');
        $('#cboSpeciality').val('');
        User_Dashboard.getNewUserDashboardCategoryWiseVisits(Month, Year, Division_Name, Region_Code, Region_Name, mode);

    },
    getNewUserDashboardCategoryWiseVisits: function (Month, Year, Division_Name, Region_Code, Region_Name, mode) {
        var u = {};
        u.name = "Month";
        u.value = Month;

        var r = {};
        r.name = "Year";
        r.value = Year;

        var m = {};
        m.name = "Option_Type";
        m.value = mode;

        var c = {};
        c.name = "category";
        if ($('#cboCategory').val() == null) {
            c.value = '';
        }
        else {
            c.value = $('#cboCategory').val();
        }

        var s = {};
        s.name = "speciality";
        if ($('#cboSpeciality').val() == null) {
            s.value = '';
        }
        else {
            s.value = $('#cboSpeciality').val();
        }

        var p = {};
        p.name = "isCurrent";
        p.value = User_Dashboard.defaults.isCurrent == true ? 'Current' : 'Previous';

        var d = {};
        d.name = "Division_Name";
        d.value = Division_Name;
        var e = {};
        e.name = "RegionCode";
        e.value = Region_Code;

        var ar = new Array();
        ar.push(u);
        ar.push(r);
        ar.push(m);
        ar.push(c);
        ar.push(s);
        ar.push(p);
        ar.push(d);
        ar.push(e);


        var content = '';
        HDAjax.requestInvoke("Dashboard", "GetNewCategoryCoverageSummery_Drill", ar, "POST",
        function (jsonResult) {
            User_Dashboard.bindNewCategoryWiseDoctorVisit(jsonResult, mode, Month, Year, Region_Name, Division_Name)
        });
        //$('#dvInfoContent').html(content);
        //$('.clsModalTitle').html('Pending DCR');
        //ShowModalPopup("dvMoreInfoModal");
    },
    bindNewCategoryWiseDoctorVisit: function (jsonResult, mode, Month, Year, Region_Name, Division_Name) {
        var RegionName = decodeURIComponent(Region_Name);
        $('#dvRepVisit').html('');
        if (mode == 1) {
            $('#dvTitleForRep').html('Doctor missed details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
        }
        else if (mode == 2) {
            $('#dvTitleForRep').html('Doctor met exactly details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
        }
        else if (mode == 3) {
            $('#dvTitleForRep').html('Doctor Less than met details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
        }
        else {
            $('#dvTitleForRep').html('Doctor more than met details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
        }
        var content = '';
        var disCatAr = new Array();
        var disSpeAr = new Array();
        content += "<table class='data display ' id='tblCategoryWiseDoctorVisit'><thead><tr><th>S.No</th><th>Doctor Name</th><th>Speciality</th><th>MDL No</th>";
        content += "<th>Category</th><th>Standard Visit</th><th># Current Month Visits</th><th># Previous Month Visits</th></tr> </thead><tbody>";
        var i = 0;
        if (jsonResult != false && jsonResult != '' && jsonResult != null && jsonResult != undefined) {
            $.each(jsonResult, function (index, value) {

                i = i + 1;
                var curClassName = '';
                var preClassName = '';
                var curValue = 0;
                var preValue = 0;
                var stdVisitCount = 0;
                if (firstTimeLoad) {
                    if ($.inArray(value.Category_Name, disCatAr) == -1) {
                        disCatAr.push(value.Category_Name);
                    }
                    if ($.inArray(value.Speciality_Name, disSpeAr) == -1) {
                        disSpeAr.push(value.Speciality_Name);
                    }
                }

                content += "<tr><td>" + i + "</td>";
                content += "<td>" + value.Doctor_Name + "</td>";
                content += "<td>" + value.Speciality_Name + "</td>";
                content += "<td>" + value.Doctor_MDL + "</td>";
                content += "<td>" + value.Category_Name + "</td>";
                content += "<td>" + value.Norms_Visit_Count + "</td>";
                stdVisitCount = value.Norms_Visit_Count;

                curValue = value.Actual_Visit_Count;
                preValue = value.Last_Actual_Visit_Count;
                if (mode == "1") {
                    //curValue = value.Cur_Month_Category_Missed_Doctors;
                    //preValue = value.Pre_Month_Category_Missed_Doctors;
                    curClassName = 'cls-missed-color';
                    //content += "<td class='cls-missed-color'>" + value.Cur_Month_Category_Missed_Doctors + "</td>";
                    // content += "<td>" + value.Pre_Month_Category_Missed_Doctors + "</td>";
                }
                else if (mode == "2") {
                    //curValue = value.Cur_Month_Category_VC_Followed;
                    //preValue = value.Pre_Month_Category_VC_Followed;
                    curClassName = 'cls-met-std';
                    //content += "<td class='cls-met-std'>" + value.Cur_Month_Category_VC_Followed + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Followed + "</td>";
                }
                else if (mode == "3") {
                    //curValue = value.Cur_Month_Category_VC_Missed;
                    //preValue = value.Pre_Month_Category_VC_Missed;
                    curClassName = 'cls-met-less';
                    //content += "<td class='cls-met-less'>" + value.Cur_Month_Category_VC_Missed + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Missed + "</td>";
                }
                else {
                    //curValue = value.Cur_Month_Category_VC_Exceeded;
                    //preValue = value.Pre_Month_Category_VC_Exceeded;
                    curClassName = 'cls-met-more';
                    //content += "<td class='cls-met-more'>" + value.Cur_Month_Category_VC_Exceeded + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Exceeded + "</td>";
                }

                content += "<td style='text-align:center;' class=" + curClassName + ">" + curValue + "</td>";
                if (preValue == 0) {
                    preClassName = 'cls-missed-color';
                }
                else if (preValue == stdVisitCount) {
                    preClassName = 'cls-met-std';
                }
                else if (preValue < stdVisitCount) {
                    preClassName = 'cls-met-less';
                }
                else {
                    preClassName = 'cls-met-more';
                }
                content += "<td style='text-align:center;' class=" + preClassName + ">" + preValue + "</td></tr>";
            });
        }
        content += " </tbody></table>";
        $('#dvRepVisit').html(content);
        User_Dashboard.UnblockUI("dvManagerVisit");
        $('html,body').animate({
            scrollTop: $("#dvTitleForRep").offset().top
        },
  'slow');


        if (firstTimeLoad) {
            $("#cboCategory option").remove();
            $("#cboCategory").append("<option >-Select Category-</option>")
            $.each(disCatAr, function (index, value) {
                $("#cboCategory").append("<option>" + value + "</option>")
            });
            $("#cboSpeciality option").remove();
            $("#cboSpeciality").append("<option value=''>-Select Speciality-</option>")
            $.each(disSpeAr, function (index, value) {
                $("#cboSpeciality").append("<option>" + value + "</option>")
            });

        }
        $('#tblFilter').each(function () {
            $(this).html('<input type="text" placeholder="Search" />');
        });

   //     // DataTable
   $('#tblCategoryWiseDoctorVisit').DataTable(
            {
                "paging": false,
                "ordering": false,
                //"info": false
                "bRetrieve": true,
                "bDestroy": true,
                "bPaginate": false,
            });

   //     // Apply the search
   //     table.columns().every(function () {
   //         var that = this;

   //         $('input', this.footer()).on('keyup change', function () {
   //             if (that.search() !== this.value) {
   //                 that
   //                     .search(this.value)
   //                     .draw();
   //             }
   //         });
   //     });
        //$("#cboCategory").unbind('change').bind('change', function () {
        //    debugger;
        //    firstTimeLoad = false;
        //    User_Dashboard.getUserDashboardCategoryWiseVisits(userCode, regionCode, DivisionCode, mode);
        //});
        //$("#cboSpeciality").unbind('change').bind('change', function () {
        //    debugger;
        //    firstTimeLoad = false;
        //    User_Dashboard.getUserDashboardCategoryWiseVisits(userCode, regionCode, DivisionCode, mode);
        //});
        $('.tblFilter').hide();
      //  console.log(disSpeAr);
    },

    //////////////////////Marketing Camp
    getMarketingCampaignCount: function () {

        $.ajax({
            type: 'POST',
            url: "DashBoard/GetMarketingCampaignCount",
            dataType: 'json',
            success: function (jsonData) {

                if (jsonData != undefined && jsonData != null) {
                    if (jsonData.ActiveRuningMcCount > 0) {

                        $("#spnAcctiveRunMc").text(jsonData.ActiveRuningMcCount);
                        //$("#spnNumParticipant").text("(" + jsonData.No_ParticipantCount + ")");

                        $("#spnAcctiveRunMc").click(function () {
                            User_Dashboard.getMarketingCampaignCountPopUpNew();
                        });

                        $('#spnAcctiveRunMc').css('cursor', 'pointer');
                        $('#spnAcctiveRunMc').css('text-decoration', 'underline');
                    }
                    else {
                        $('#spnAcctiveRunMc').css('cursor', 'default');
                        $('#spnAcctiveRunMc').css('text-decoration', 'blink');
                    }
                }

            },
            error: function (e) {
                //fnMsgAlert('error', 'Error', 'Bind Marketing Campaign failed');
            }
        });
    },
    getMarketingCampaignCountPopUpNew: function () {
        $('#main').load('Dashboard/MarketingCampaign/'+'user');
    },
    getMarketingCampaignCountPopUp: function () {

        $.ajax({
            start: User_Dashboard.blockUI("tblMarketingCamp"),
            type: 'POST',
            url: "DashBoard/GetMarketingCampaignCountPopUp",
            dataType: 'json',
            success: function (jsonData) {
                $("#tblMarketingCampRegionDetail").hide();
                $("#tblMarketingCampDoctorDetail").hide();
                $('#titleReg').hide();
                $('#titleDoc').hide();
                var strTable = "";
                strTable += "<table class='table table-striped' id='tblMarketingCampaign'><thead><tr><th>Campaign Name</th><th>Start Date</th><th>End Date</th></th><th>Doctor Count</th><th>Region Count</th><th>Proposed Count</th><th>Mapped Doctor Count</th><th>Mapped Percentage</th></tr></thead><tbody>";
                for (var i = 0; i < jsonData.length; i++) {
                    strTable += "<tr><td style='text-decoration: underline;color:blue;cursor: pointer;'; onclick=User_Dashboard.GetMarketingCampaignRegionPopUP('" + jsonData[i].Campaign_Code + "','" + encodeURIComponent(jsonData[i].Campaign_Name) + "')>" + jsonData[i].Campaign_Name + "</td><td>" + jsonData[i].MC_Start_Date + "</td><td>" + jsonData[i].MC_End_Date + "</td><td>" + jsonData[i].Customer_Count + "</td><td>"
                        + jsonData[i].Region_Count + "</td><td>" + jsonData[i].Proposed_Count + "</td><td>" + jsonData[i].Actual_Met_Count + "</td><td>" + jsonData[i].Coverage_percentage + "%</td>";
                }
                strTable += "</tbody></table>"
                $("#tblMarketingCampDetail").html(strTable);

            },
            error: function (e) {
                User_Dashboard.UnblockUI("tblMarketingCamp");
                //fnMsgAlert('error', 'Error', 'Bind Marketing Campaign failed');
            },
            complete: function () {
                $('#tblMarketingCampaign').DataTable(
               {
                   "paging": false,
                   "ordering": false,
                   //"info": false
                   "bRetrieve": true,
                   "bDestroy": true,
                   "bPaginate": false,
               });

                User_Dashboard.UnblockUI("tblMarketingCamp");
            }
        });
    },
    GetMarketingCampaignRegionPopUP: function (Campaign_Code, Campaign_Name) {
        var _objData = new Object();
        _objData.Campaign_Code = Campaign_Code;
        var Camp_Name = decodeURIComponent(Campaign_Name);

        $.ajax({
            start: User_Dashboard.blockUI("tblMarketingCampaign"),
            type: 'POST',
            url: "DashBoard/GetMarketingCampaignRegionPopUP",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                debugger;
                $("#tblMarketingCampRegionDetail").show();
                $("#tblMarketingCampDoctorDetail").hide();
                $('#titleReg').show();
                $('#titleDoc').hide();
                var strTable = "";
                $('#titleReg').html('Marketing Campaign Region Based Details for "' + Camp_Name + '"');
                strTable += "<table class='table table-striped details' id='tblMarketingCampaignUserMapped'><thead><tr><th>S.No</th><th>Region Name</th><th> Participant Name</th><th>Doctors Mapped</th><th>Doctors Met</th></th><th>Visit Count</th><th>Coverage Percentage</th></tr></thead><tbody>";
                var lnkcreatedby = '';
                for (var i = 0; i < jsonData.length; i++) {
                    var l = i + 1;
                    var Created_By = jsonData[i].Employee_Name;
                    if (Created_By == null || Created_By == "") {
                        Created_By = '-';
                        lnkcreatedby = '';
                    }
                    else {
                        Created_By = jsonData[i].Employee_Name + "(" + jsonData[i].User_Type_Name + ")";
                        lnkcreatedby = jsonData[i].Created_by;
                    }
                    if (jsonData[i].Doctor_Count == 0) {
                        strTable += "<tr><td>" +l + "</td><td>" + jsonData[i].Region_Name + "</td>";
                    }
                    else {
                        strTable += "<tr><td>"+ l +"</td><td style='text-decoration: underline;color:blue;cursor: pointer;'; onclick=User_Dashboard.GetMarketingCampaignDoctorPopUP('" + jsonData[i].Campaign_Code + "','" + jsonData[i].Region_Code + "','" + encodeURIComponent(jsonData[i].Region_Name) + "','" + encodeURIComponent(lnkcreatedby) + "','" + encodeURIComponent(Camp_Name) + "')>" + jsonData[i].Region_Name + "</td>";
                    }
                    strTable += "<td>" + Created_By + "</td><td>" + jsonData[i].Doctor_Count + "</td><td>" + jsonData[i].Actual_Met_Count + "</td><td>" + jsonData[i].Visit_Count + "</td><td>" + jsonData[i].Coverage_percentage + "%</td></tr>";
                }
                strTable += "</tbody></table>"
                $("#tblMarketingCampRegionDetail").html(strTable);
                $('html,body').animate({
                    scrollTop: $("#tblMarketingCampRegionDetail").offset().top
                },
'slow');

            },
            error: function (e) {
                User_Dashboard.UnblockUI("tblMarketingCampaign");
                //fnMsgAlert('error', 'Error', 'Bind Marketing Campaign failed');
            },
            complete: function () {
                $('#tblMarketingCampaignUserMapped').DataTable(
                 {
                     "paging": false,
                     "ordering": false,
                     //"info": false
                     "bRetrieve": true,
                     "bDestroy": true,
                     "bPaginate": false,
                 });
                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print,.dataTables_info").hide();
                User_Dashboard.UnblockUI("tblMarketingCampaign");
            }
        });
    },
    GetMarketingCampaignDoctorPopUP: function (Campaign_Code, Region_Code, Region_Name, Created_By, Camp_Name) {
        debugger;
        var _objData = new Object();
        _objData.Campaign_Code = Campaign_Code;
        _objData.RegionCode = Region_Code;
        var Reg_Name = decodeURIComponent(Region_Name);
        var camp_Name = decodeURIComponent(Camp_Name);
        _objData.Created_By = decodeURIComponent(Created_By);
        $.ajax({
            start: User_Dashboard.blockUI("tblMarketingCampRegionDetail"),
            type: 'POST',
            url: "DashBoard/GetMarketingCampaignDetailsForDoctor",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                $("#tblMarketingCampDoctorDetail").show();
                $('#titleDoc').show();
                var strTable = "";
                $('#titleDoc').html('Marketing Campaign Doctor Based Details for "' + camp_Name + '" & " ' + Reg_Name + '"');
                strTable += "<table class='table table-striped details' id='tblMarketingCampaignUserMapped'><thead><tr><th>Doctor Name</th><th>Category Name</th><th>Speciality Name</th><th>Visit Type</th><th>Visit Count</th></tr></thead><tbody>";
                for (var i = 0; i < jsonData.length; i++) {
                    strTable += "<tr><td>" + jsonData[i].Customer_Name + "</td><td>" + jsonData[i].Category_Name + "</td><td>" + jsonData[i].Speciality_Name + "</td><td>" + jsonData[i].Visit_Mode + "</td><td>" + jsonData[i].Actual_Met_Count + "</td></tr>";
                }
                strTable += "</tbody></table>"
                $("#tblMarketingCampDoctorDetail").html(strTable);
                $('html,body').animate({
                    scrollTop: $("#tblMarketingCampDoctorDetail").offset().top
                },
    'slow');

            },
            error: function (e) {
                User_Dashboard.UnblockUI("tblMarketingCampRegionDetail");
                //fnMsgAlert('error', 'Error', 'Bind Marketing Campaign failed');
            },
            complete: function () {
                $('#tblMarketingCampaignUserMapped').DataTable(
                     {
                         "paging": false,
                         "ordering": false,
                         //"info": false
                         "bRetrieve": true,
                         "bDestroy": true,
                         "bPaginate": false,
                     });
                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print,.dataTables_info").hide();
                User_Dashboard.UnblockUI("tblMarketingCampRegionDetail");
            }
        });
    },
    getDashboardHome: function () {
        $.ajax({
            type: 'POST',
            url: "DashBoardV2/DashboardHome",
            async: false,
            dataType: 'text',
            // data: _objData,
            success: function (JsonData) {
                if (JsonData == "FIELD_USER") {
                    $("#fieldnotifyhide").hide();
                    // $("#dashboard1").load('Dashboard/UserDashboard');
                }
            }
        });
    },
}
