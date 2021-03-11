//Created By:Sumathi.M
//Date:22/04/2014

//DCR Status
function checkAll() {
    if ($('#chkAll').attr('checked') == 'checked') {
        $('.clsCheck').attr('checked', 'checked')
    }
    else {
        $('.clsCheck').attr('checked', false);
    }
}

function chkAllChecked() {
    if ($('.clsCheck:checked').length == 3) {
        $('#chkAll').attr('checked', 'checked');
    }
    else {
        $('#chkAll').attr('checked', false);
    }
}
//Activity Status
function checkAllforActivity() {
    if ($('#chkAllforActivity').attr('checked') == 'checked') {
        $('.clsCheckforAct').attr('checked', 'checked')
    }
    else {
        $('.clsCheckforAct').attr('checked', false);
    }
}

function chkAllCheckedforActivity() {
    if ($('.clsCheckforAct:checked').length == 2) {
        $('#chkAllforActivity').attr('checked', 'checked');
    }
    else {
        $('#chkAllforActivity').attr('checked', false);
    }
}

function fnSubvalidation(screenName) {
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', screenName, 'Please enter Start date.');
        $("#txtFromDate").focus();
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', screenName, 'Please enter End date.');
        $("#txtToDate").focus();
        return false;
    }
    if ($(":checkbox[name=chkdcrstatus]:checked").length == 0 && $(":checkbox[name=chkdcrstatus]:checked").length == 0) {
        fnMsgAlert('info', screenName, 'Please select DCR status.');
        return false;
    }

    if ($(":checkbox[name=chkshow]:checked").length == 0 && $(":checkbox[name=chkshow]:checked").length == 0) {
        fnMsgAlert('info', screenName, 'Please select Show.');
        return false;
    }

    if ($(":checkbox[name=chkActivity]:checked").length == 0 && $(":checkbox[name=chkActivity]:checked").length == 0) {
        fnMsgAlert('info', screenName, 'Please select Activity Status.');
        return false;
    }

    var fromDate = $("#txtFromDate").val().split('/')[2] + '/' + $("#txtFromDate").val().split('/')[1] + '/' + $("#txtFromDate").val().split('/')[0];
    var toDate = $("#txtToDate").val().split('/')[2] + '/' + $("#txtToDate").val().split('/')[1] + '/' + $("#txtToDate").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (endDate != "") {
        if (startDate > endDate) {
            fnMsgAlert('info', screenName, 'End date can not be less than start date.');
            $("#txtToDate").val("");
            return false;
        }
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtToDate"), "EndDate"))) {
        return false;
    }
    return true;
}

function fnshowExpenseAnalysisforAlumni() {

    if (fnSubvalidation("Expense Analysis for Alumni Report")) {
        $('#dvExpenseAnalysisforAlumni').empty();
        $('#divCompReport').empty();

        var dcrStatus = "", activityStatus = "", docChemistMet = "";
        var startDate = "", endDate = "", options = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        var rowCount = 0;
        //get dcr status       
        var adjustType = $('input:checkbox[name=chkdcrstatus]:checked');
        for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
            if (adjustType[intLoop].id == "chkAll") {
                dcrStatus = adjustType[intLoop].value + ",";
                rowCount++;
                break;
            }
            else {
                dcrStatus += adjustType[intLoop].value + ",";
                rowCount++;
            }
        }
        //if (dcrStatus != "") {
        //    dcrStatus = dcrStatus.substring(0, dcrStatus.length - 1);
        //}

        //get activty status
        var adjustTypeforactivity = $('input:checkbox[name=chkActivity]:checked');
        for (var intLoop = 0; intLoop < adjustTypeforactivity.length; intLoop++) {
            if (adjustTypeforactivity[intLoop].id == "chkAllforActivity") {
                activityStatus = adjustTypeforactivity[intLoop].value + ",";
                break;
            }
            else {
                activityStatus += adjustTypeforactivity[intLoop].value + ",";
            }
        }
        //if (activityStatus != "") {
        //    activityStatus = activityStatus.substring(0, activityStatus.length - 1);
        //}

        //Show(Doctor,Chemist,Stockiest)
        $('input:checkbox[name=chkshow]').each(function () {
            if ($(this).is(':checked')) {
                docChemistMet += $(this).val() + ",";
                rowCount++;
            }
        });

        //GET OPTIONS
        if ($('#optViewInScreen').attr('checked') == "checked") {
            options = "S";
        }
        else {
            options = "E";
        }

        $('#dvExpenseforalumni').block({
            message: 'Retrieving data...',
            css: { border: '1px solid #ddd' }
        });
        var RegionType = $('#hdnUseractivity').val();
        $.ajax({
            type: 'POST',
            url: '../ReportsLevelThree/GetExpenseAnalysisForAlumni',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val() + '&docChemistMet=' + docChemistMet + '&activityStatus=' + activityStatus + "&viewFormat=" + options + "&title=" + $("#divPageHeader").html() + '&rowCount=' + rowCount,
            success: function (response) {
                if (response != '' && response != null && response != undefined) {
                    //$('#divCompReport').html(response);
                    //$("#dvExpenseAnalysisforAlumni").html(response);
                    //$('#divuserperPrint').html(response);

                    $("#dvExpenseAnalysisforAlumni").html(response.split('$')[0]);
                    $('#divuserperPrint').html(response.split('$')[1]);
                    var totalExp = parseFloat(response.split('$')[2]);
                    $('#dvPrintTotal').html("Total Expense : " + totalExp.toFixed(2));

                    $("#dvPrint").show();
                    //if ($.fn.dataTable) {
                    //    var oTable = $('#tblExpenseAnalysisforAlumni').dataTable({
                    //        "sPaginationType": "full_numbers",
                    //        //"fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay){
                    //        //},
                    //        "bDestroy": true
                    //    });
                    //};                   
                    $("#dvExpenseforalumni").unblock();
                }
                //$('#tblExpenseAnalysisforAlumni').dataTable({
                       
                //    "sPaginationType": "full_numbers",
                //    "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {                            
                //        var subTotalArr = new Array();
                //        var grandTotalArr = new Array();
                //        var colArray = new Array();

                //        // 12 static column 
                //        // expense will start from 13 or 17 (if doc count 4)

                //        var arrInx = 0;
                //        var startIdx = 14 + (4 - docCount);
                //        var endIdx = 14 + (4 - docCount) + (expModeCount * 3);
                //        var skipFrst = 1;
                //        var docTotalStrt = startIdx - (4 - docCount);
                //        var discount = 13
                //        //for dynamic Distances count total


                //        for (var col = docTotalStrt - 1; col < startIdx ; col++) {
                //            for (var i = 0; i < aaData.length; i++) {
                //                if (subTotalArr[arrInx] === undefined) {
                //                    subTotalArr[arrInx] = 0.0;
                //                }
                //                if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                //                    subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                //                }
                //            }
                //            colArray[arrInx] = col;
                //            arrInx++;
                //        }


                //        // for dynamic doctor count total
                //        for (var col = docTotalStrt; col < startIdx ; col++) {
                //            for (var i = 0; i < aaData.length; i++) {
                //                if (subTotalArr[arrInx] === undefined) {
                //                    subTotalArr[arrInx] = 0.0;
                //                }
                //                if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                //                    subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                //                }
                //            }
                //            colArray[arrInx] = col;
                //            arrInx++;
                //        }

                //        // for dynamic Expense type expenses
                //        for (var col = startIdx; col < endIdx ; col++) {
                //            if (skipFrst == 3) {
                //                for (var i = 0; i < aaData.length; i++) {
                //                    if (subTotalArr[arrInx] === undefined) {
                //                        subTotalArr[arrInx] = 0.0;
                //                    }
                //                    if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                //                        subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                //                    }
                //                }
                //                colArray[arrInx] = col;
                //                arrInx++;
                //                skipFrst = 0;
                //            }
                //            skipFrst++;
                //        }

                //        //Total Expense
                //        for (var i = 0; i < aaData.length; i++) {
                //            if (subTotalArr[arrInx] === undefined) {
                //                subTotalArr[arrInx] = 0.0;
                //            }
                //            if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                //                subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                //            }
                //        }
                //        colArray[arrInx] = col;

                //        // grand total
                //        for (var col = 0; col < colArray.length ; col++) {
                //            for (var i = iStart; i < iEnd; i++) {
                //                if (grandTotalArr[col] === undefined) {
                //                    grandTotalArr[col] = 0.0;
                //                }
                //                if (!isNaN(aaData[aiDisplay[i]][colArray[col]].replace(',', '')) && aaData[aiDisplay[i]][colArray[col]] != "") {
                //                    grandTotalArr[col] += parseFloat(aaData[aiDisplay[i]][colArray[col]].replace(',', ''));
                //                }
                //            }
                //        }

                //        var ncell = nRow.getElementsByTagName('th');

                //        for (var col = 0; col < colArray.length; col++) {
                //            ncell[colArray[col]].innerHTML = addCommas(grandTotalArr[col].toFixed(2)) + '<br/>(' + addCommas(subTotalArr[col].toFixed(2)) + ')';
                //        }

                //    },
                //    "bDestroy": true,
                //    "sDom": 'T<"clear">lfrtip',
                //    "bSort": false,
                //    "bSearchable": false,
                //    "bFilter": false
                //}).dataTable();
                
                fninializePrint("divuserperPrint", "ifrmuserperday", "divCompReport");

            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
                $("#dvExpenseforalumni").unblock();
            }
        });
    }
}

function fnComprehensiveAnalysisReportforAlumni() {
    ShowModalPopup("dvloading");

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



    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetComprehensiveAnalysisReport',
        data: "userCode=" + $("#hdnUserCode").val() + "&sd=" + $("#txtFromDate").val() + "&ed=" + $("#txtToDate").val() + "&reportType=" + reportType,
        success: function (response) {
            if (response != "") {
                $("#divCompReport").html(response);
                $("#divCompReport").show();
            }
            else {
                fnMsgAlert('info', 'Comprehensive Analysis Report', 'No data found.');
                HideModalPopup("dvloading");
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Comprehensive Analysis Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}