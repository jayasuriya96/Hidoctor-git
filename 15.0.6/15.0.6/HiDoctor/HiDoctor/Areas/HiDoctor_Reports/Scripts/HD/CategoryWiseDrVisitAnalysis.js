/// <reference path="CategoryWiseDrVisitAnalysis.js" />
function fnCategoryWiseDoctorVisitAnalysis() {
    ShowModalPopup("dvloading");
    if (!fnValidateInputs()) {
        return false;
    }

    $('#divInput').show();
    $('#divToggle').show();
    var selectedMonth = $('#txtMonth').val();
    var Month = fngetMonthNumber(selectedMonth.split('-')[0]);
    var Year = selectedMonth.split('-')[1];
    var groupbyRegionTypeCode = $('#ddlGroupByRegionType').val();
    var aggregateRegionTypeCode = $('#ddlAggregateRegionType').val();
    var groupbyRegionTypeName = $('#ddlGroupByRegionType :selected').text();
    var aggregateRegionTypeName = $('#ddlAggregateRegionType :selected').text();

    var dcrOptions = $('input:checkbox[name=DCRStatus]:checked');
    var dcrStatus = "";

    for (var intLoop = 0; intLoop < dcrOptions.length; intLoop++) {
        dcrStatus += dcrOptions[intLoop].value + "^";
    }

    var monthName = $('#txtMonth').val();

    $('#divReport').html("");

    $.ajax({
        url: '../HiDoctor_Reports/CategoryWiseDrVisitAnalysis/ShowCategoryWiseDrVisitAnalysis',
        type: "POST",
        data: "Month=" + Month + "&Year=" + Year + "&GroupByRegionTypeCode=" + groupbyRegionTypeCode + "&AggregateRegionTypeCode=" + aggregateRegionTypeCode + "&DCRStatus=" + dcrStatus + "&MonthName=" + monthName + "&GroupByRegionTypeName=" + groupbyRegionTypeName + "&AggregateRegionTypeName=" + aggregateRegionTypeName + "",
        success: function (response) {
            if (response != "") {
                $('#divReport').html(response.split('$')[0].toString());
                $("#aURL").html('Download report')
                $("#aURL").attr("href", response.split('$')[1].toString());
                $('#tblTpVsActualDocVisits').tablePagination({});
                $('#dvTblHelpIcon').show();
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

    $("#divMain").css('width', '100%');
    $("#divReport").css('width', '100%');
}

function fnLoadRegionTypes() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/CategoryWiseDrVisitAnalysis/GetRegionTypes',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');

            $('option', $("#ddlGroupByRegionType")).remove();
            $('option', $("#ddlAggregateRegionType")).remove();

            if (jsData.Tables[0].Rows.length > 0) {
                $('#ddlGroupByRegionType').append("<option value='0'>-Select-</option>");
                $('#ddlAggregateRegionType').append("<option value='0'>-Select-</option>");

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlGroupByRegionType").append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                    $("#ddlAggregateRegionType").append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                }

                $("#ddlGroupByRegionType").val('0');
                $("#ddlAggregateRegionType").val('0');
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