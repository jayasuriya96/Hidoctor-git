var leaveBalance_g = "", lstWeekends = "";
var noOfDays = 0;
var allowCharacterinDCR = "-_.,()";

function DrawLeaveBalanceTable(dcrDate) {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRLeaveEntry/GetLeaveBalance',
        data: "leaveValidationLeaves=" + leaveValidationLeaves + "&dcrDate=" + dcrDate,
        success: function (jsLeaveBalanceData) {
            leaveBalance_g = jsLeaveBalanceData;
            // text box alignment
            $("#txtFromDate").closest("div").css('width', '10%');
            $("#txtFromMonth").closest("div").css('width', '10%');
            $("#txtFromYear").closest("div").css('width', '20%');

            $("#txtFromDate").closest("div").css('float', 'left');
            $("#txtFromMonth").closest("div").css('float', 'left');
            $("#txtFromYear").closest("div").css('float', 'left');

            $("#txtToDate").closest("div").css('width', '10%');
            $("#txtToMonth").closest("div").css('width', '10%');
            $("#txtToYear").closest("div").css('width', '20%');

            $("#txtToDate").closest("div").css('float', 'left');
            $("#txtToMonth").closest("div").css('float', 'left');
            $("#txtToYear").closest("div").css('float', 'left');
            // fnCreateLeaveBalanceTable();      

        }
    });
}

// page submition.
function fnLeaveSubmit() {
    var fromDate = $("#txtFromYear").val() + '-' + $("#txtFromMonth").val() + '-' + $("#txtFromDate").val();
    var toDate = $("#txtToYear").val() + '-' + $("#txtToMonth").val() + '-' + $("#txtToDate").val();

    // For unapproved .
    if (dcrStatus == 0) {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRLeaveEntry/UpdateLeave',
            data: "fromDate=" + fromDate + "&leaveTypeCode=" + $("#ddlLeaveType").val() + "&reason=" + escape($.trim($("#Reason").val())) + "&entryMode=MOBILE",
            success: function (result) {
                if (result == "SUCCESS") {
                    //HideModalPopup('dvLoading');
                    fnMsgAlert('success', 'DCR Leave', 'Your leave status has been updated.');
                    DrawLeaveBalanceTable(dcrDateLeave);
                    fnCancel();
                }
                else {
                    //HideModalPopup('dvLoading');
                    fnMsgAlert('error', 'DCR Leave', 'Updation Failed.');
                }
            }
        });
    }

        // for applid.
    else {
        var leaveJson = jsonPath(leaveBalance_g[1], "$.Data[?(@.Leave_Type_Code=='" + $("#ddlLeaveType").val().toString() + "')]");
        var startDate = new Date(fromDate);
        var endDate = new Date(toDate);

        var tempDate = new Date();
        var sundayValidation = "";

        for (tempDate = startDate; tempDate <= endDate; tempDate.setDate(tempDate.getDate() + 1)) {
            isTrue = true;
            // Sunday Check.
            // Sunday Count->WEEKEND DAY COUNT.
            var tempmonth = tempDate.getMonth() + 1;
            var tempday = tempDate.getDate();
            tempmonth = ((tempmonth < 10) ? "0" + tempmonth : tempmonth);
            tempday = ((tempday < 10) ? "0" + tempday : tempday);

            var tempDateString = tempDate.getFullYear() + '-' + tempmonth + '-' + tempday;
            var isWeekendDay = jsonPath(lstWeekends, "$.[?(@.Weekend_Date=='" + tempDateString + "')]");
            if (isWeekendDay != false && isWeekendDay !== undefined && isWeekendDay.length > 0) { // sunday=0                                  
                if (leaveJson != false && leaveJson.length != 0) {
                    if (leaveJson[0].IS_Added_Weekend_Holiday == "Y") {
                        sundayValidation += 'TRUE^';
                    }
                    else {
                        sundayValidation += 'FALSE^';
                    }
                }
                else {
                    sundayValidation += 'FALSE^';
                }
            }
            else {
                sundayValidation += 'TRUE^';
            }
        }

        if (leaveJson.length != 0 && !(leaveJson.length === undefined)) {
            var addedWeekendHoliday = leaveJson[0].IS_Added_Weekend_Holiday;
            var isAddHoliday = leaveJson[0].IS_Added_Holiday;
            var userLeaveTypeCode = leaveJson[0].User_Leave_Type_Code
        }
        else {
            var addedWeekendHoliday = 'N';
            var isAddHoliday = 'N';
            var userLeaveTypeCode = '';
        }


        // INSERT LEAVE- FOR NEW LEAVE ENTRY.
        var calcFieldsStatus = fnGetPrivilegeValue("CALC_FIELD_STATUS", "2");
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRLeaveEntry/InsertLeave',
            data: "fromDate=" + fromDate + "&toDate=" + toDate + "&isAddedWeekendHoliday=" + addedWeekendHoliday + "&sundayValidation=" + sundayValidation + "&leaveTypeCode=" + $("#ddlLeaveType").val() + "&reason=" + escape($("#Reason").val()) + "&calcFieldStatus=" + calcFieldsStatus
                + "&entryMode=MOBILE&isAddHoliday=" + isAddHoliday + "&userLeaveTypeCode=" + userLeaveTypeCode + "&leaveTypeName=" + $("#ddlLeaveType :selected").text() + "&noOfDays=" + noOfDays,
            success: function (result) {
                if (result == 'SUCCESS') {
                    //HideModalPopup('dvLoading');
                    fnMsgAlert('success', 'DCR Leave', 'Leave Applied Successfully.');
                    DrawLeaveBalanceTable(dcrDateLeave);
                    fnCancel();
                }
                else {
                    //HideModalPopup('dvLoading');
                    fnMsgAlert('error', 'DCR Leave', result);
                }
            }
        });
    }



}




// Leave Validation.
function fnValidateLeave() {

    //ShowModalPopup('dvLoading');   

    // empty Check
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter From Date.');
        fnErrorIndicator("#txtFromDate");
        return false;
    }
    if ($("#txtFromMonth").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter From Month.');
        fnErrorIndicator("#txtFromMonth");
        return false;
    }
    if ($("#txtFromYear").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter From Year.');
        fnErrorIndicator("#txtFromYear");
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter To Date.');
        fnErrorIndicator("#txtToDate");
        return false;
    }
    if ($("#txtToMonth").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter To Month.');
        fnErrorIndicator("#txtToMonth");
        return false;
    }
    if ($("#txtToYear").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter To Year.');
        fnErrorIndicator("#txtToYear");
        return false;
    }

    var fromDate = $("#txtFromYear").val() + '-' + $("#txtFromMonth").val() + '-' + $("#txtFromDate").val();
    var toDate = $("#txtToYear").val() + '-' + $("#txtToMonth").val() + '-' + $("#txtToDate").val();

    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);
    // validate correct date
    if (startDate == "Invalid Date") {
        fnMsgAlert('error', 'DCR Leave', 'Please enter valid From Date');
        return false;
    }
    if (endDate == "Invalid Date") {
        fnMsgAlert('error', 'DCR Leave', 'Please enter valid To Date');
        return false;
    }

    if (($("#txtToMonth").val() == 4 || $("#txtToMonth").val() == 6 || $("#txtToMonth").val() == 9 || $("#txtToMonth").val() == 11) && $("#txtToDate").val() == 31) {
        fnMsgAlert('error', 'DCR Leave', 'Please enter valid To Date.');
        return false;
    }
    if ($("#txtToMonth").val() == 2)
    {
        var isleap = ($("#txtToYear").val() % 4 == 0 && ($("#txtToYear").val() % 100 != 0 || $("#txtToYear").val() % 400 == 0));
        if ($("#txtToDate").val() > 29 || ($("#txtToDate").val() == 29 && !isleap)) {
            fnMsgAlert('error', 'DCR Leave', 'Please enter valid To Date.');
            return false;
        }
    }
    // end


    if (startDate > endDate) {
        fnMsgAlert('info', 'DCR Leave', 'End date can not be less than start date.');
        $("#txtToYear").val('');
        $("#txtToMonth").val('');
        $("#txtToDate").val('');
        return false;
    }

    if ($("#ddlLeaveType").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please select Leave Type.');
        fnErrorIndicator("#ddlLeaveType");
        return false;
    }
    if ($("#Reason").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter the reason for leave.');
        fnErrorIndicator("#Reason");
        return false;
    }
        // remarks length check
    else {
        if ($("#Reason").val().length > 500) {
            fnMsgAlert('info', 'DCR Leave', 'You have entered more then 500 character in remarks. That is not allowed.');
            fnErrorIndicator("#Reason");
            //HideModalPopup('dvLoading');
            return false;
        }
    }    
    //Newly added for restict the special characters in Remarks field
    if ($('#Reason').val() != '') {
        var result = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2($('#Reason'));
        if (!result) {
            fnMsgAlert('info', 'DCR Leave', 'Please Enter the following characters only ' + allowCharacterinDCR + ' in Reason.');
            fnErrorIndicator("#Reason");
            return false;
        }
    }

    // TP Check
    var TP_LOCK_DAY = fnGetPrivilegeValue("TP_LOCK_DAY", '0')
    var Tour_Planner = fnGetPrivilegeValue("TOUR_PLANNER", 'NO')
    if (Tour_Planner == "YES" && parseInt(TP_LOCK_DAY) > 0) {
        var dates = fnCheckTPavailable(fromDate, toDate)        
        if (parseInt(dates.length) > 0) {
           
            var notPlannedDates = ""
            for (var i = 0; i < dates.length; i++) {
                notPlannedDates += dates[i].toString() + ", ";
            }
           var npd = notPlannedDates.substring(0, notPlannedDates.length - 1);

           fnMsgAlert('info', 'DCR Leave', ' Please plan your leave in TP before entering actual here. The follwoing dates are not planned: ' + npd);
            return false;
        }
    }

    var isValidation = new Boolean(false);

    var leaveReqired = 0;

    // Get holiday count and check if any other dcr(attendance,field etc) applied on that date.
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRLeaveEntry/GetHolidayCount',
        data: "fromDate=" + fromDate + "&toDate=" + toDate,
        async:false,
        success: function (response) {
            var result = response.split('$')[0];
            if (result == "CANNOT_APPLY") {
                fnMsgAlert('info', 'DCR Leave', 'Already you are applied for DCR/Attendance/Leave for these dates. Unable to apply leave for these dates.');
                //HideModalPopup('dvLoading');
                return false;
            }
            else {
                var holidayCount = 0;
                var sundayCount = 0;
                holidayCount = parseInt(result.split('_')[0]);
                var activityCount = 0;
                activityCount = parseFloat(result.split('_')[1]);
                var fromDate = $("#txtFromYear").val() + '-' + $("#txtFromMonth").val() + '-' + $("#txtFromDate").val();
                var toDate = $("#txtToYear").val() + '-' + $("#txtToMonth").val() + '-' + $("#txtToDate").val();
                var fromTemp = new Date(fromDate);
                var toTemp = new Date(toDate);
                var dateDiff = fnGetDateDifference(fromTemp, toTemp)
                leaveReqired = dateDiff + 1;

                var tempDate = new Date();

                // WeekendDaysCount
                lstWeekends = eval('(' + response.split('$')[1] + ')');               
                for (tempDate = fromTemp; tempDate <= toTemp; tempDate.setDate(tempDate.getDate() + 1)) {
                    // Sunday Count->WEEKEND DAY COUNT.
                    var tempmonth = tempDate.getMonth() + 1;
                    var tempday = tempDate.getDate();
                    tempmonth = ((tempmonth < 10) ? "0" + tempmonth : tempmonth);
                    tempday = ((tempday < 10) ? "0" + tempday : tempday);

                    var tempDateString = tempDate.getFullYear() + '-' + tempmonth + '-' + tempday;
                    var isWeekendDay = jsonPath(lstWeekends, "$.[?(@.Weekend_Date=='" + tempDateString + "')]");
                    if (isWeekendDay != false && isWeekendDay !== undefined && isWeekendDay.length > 0) { // sunday=0  
                        sundayCount++;
                    }
                }               
                leaveReqired = parseFloat(leaveReqired) - parseFloat(holidayCount);
                leaveReqired = parseFloat(leaveReqired) - parseFloat(sundayCount);
                leaveReqired = parseFloat(leaveReqired) - activityCount;
                noOfDays = leaveReqired;

                // The json value exist only if the privilege LEAVE_ENTRY_VALIDATION_REQUIRED is assigned as "YES".....                    

                if (leaveBalance_g[1] != "" && leaveBalance_g[1].Data.length > 0) {
                    var leaveJson = jsonPath(leaveBalance_g[1], "$.Data[?(@.Leave_Type_Code=='" + $("#ddlLeaveType").val().toString() + "')]");

                    if (leaveJson.length == 0 || leaveJson.length === undefined) {
                        fnMsgAlert('info', 'DCR Leave', 'No user leave balance found.');
                        //HideModalPopup('dvLoading');
                        return false;
                    }

                    var leaveValidationLeavesArr = leaveValidationLeaves.split(',');

                    for (var i = 0; i < leaveValidationLeavesArr.length; i++) {
                        if ($("#ddlLeaveType :selected").text().toUpperCase() == leaveValidationLeavesArr[i].toUpperCase()) { // Check wherther the selected leave type need validation.
                            isValidation = true;
                            break;
                        }
                    }

                    // Validation for leave type values.
                    if (isValidation === true) {

                        if (leaveBalance_g[0] != "" && leaveBalance_g[0].Data.length > 0) {
                            var leaveBalanceJson = jsonPath(leaveBalance_g[0], "$.Data[?(@.Leave_Type_Code=='" + $("#ddlLeaveType").val().toString() + "')]");
                        }

                        if (leaveJson.length > 0) {

                            // holiday add check.
                            if (leaveJson[0].IS_Added_Weekend_Holiday == "Y") {                                
                                leaveReqired = leaveReqired + sundayCount;
                            }
                            if (leaveJson[0].IS_Added_Holiday == "Y") {
                                leaveReqired = leaveReqired + holidayCount;
                            }

                            // Leave balance Check.
                            if (leaveBalanceJson != false && !(leaveBalanceJson === undefined) && leaveBalanceJson[0].Leave_Balance != "") {
                                if (leaveReqired > leaveBalanceJson[0].Leave_Balance) {
                                    fnMsgAlert('info', 'DCR Leave', 'Your leave balance is ' + leaveBalanceJson[0].Leave_Balance + ' only. You are not able to apply leave for ' + leaveReqired + ' days.');
                                    //HideModalPopup('dvLoading');
                                    return false;
                                }
                            }
                            else {
                                fnMsgAlert('info', 'DCR Leave', 'No leave balance details found.');
                                //HideModalPopup('dvLoading');
                                return false;
                            }

                            // Min leave check.
                            if (leaveJson[0].Min_Leave > leaveReqired) {
                                fnMsgAlert('info', 'DCR Leave', 'Minimum leave for this leave type is ' + leaveJson[0].Min_Leave + ' only. You cannot enter leave for ' + leaveReqired + ' days.');
                                //HideModalPopup('dvLoading');
                                return false;
                            }

                            //Max Leave Check
                            if (leaveReqired > leaveJson[0].Max_Leave) {
                                fnMsgAlert('info', 'DCR Leave', 'Maximum leave for this leave type is ' + leaveJson[0].Max_Leave + ' only. You cannot enter leave for ' + leaveReqired + ' days. ');
                                //HideModalPopup('dvLoading');
                                return false;
                            }
                            noOfDays = leaveReqired;

                            fnClubHolidays(fromDate, toDate, leaveJson[0].User_Leave_Type_Code);
                        }
                    }
                    else {
                        fnLeaveSubmit();
                    }
                }
                else {
                    fnLeaveSubmit();
                }
            }
        }
    });

}

function fnClubHolidays(fromDate, toDate, userLeaveTypeCode) {
    //Check clubbing with other leave types
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRLeaveEntry/CheckClubLeave',
        data: "fromDate=" + fromDate + "&toDate=" + toDate + "&leaveTypeCode=" + $("#ddlLeaveType").val() + "&userLeaveTypeCode=" + userLeaveTypeCode,
        success: function (result) {
            if (result != "0") {
                if (result.split('^')[0] == "CANNOT CLUB WITH") {
                    fnMsgAlert('info', 'DCR Leave', $("#ddlLeaveType :selected").text() + " can not be clubbed with " + result.split('^')[1]);
                    //HideModalPopup('dvLoading');
                    return false;
                }
                else {
                    fnMsgAlert('error', 'DCR Leave', result);
                    //HideModalPopup('dvLoading');
                    return false;
                }
            }
            else {
                fnLeaveSubmit();
            }
        }
    });
}

function fnCheckTPavailable(leaveFromDate, LeaveToDate) {
    // var dateCount = 0;
    var result = "";
    $.ajax({
        type: 'POST',
        data: "leaveFromDate=" + leaveFromDate + "&leaveToDate=" + LeaveToDate,
        url: '/HiDoctor_Activity/DCRLeaveEntry/CheckTPAvailableForSelectedLeaveDates',
        async: false,
        success: function (response) {            
            if (response != null) {
                result = response;
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'DCR Calendar', e.responseText)
            return false;
        }
    });
    return result;
}