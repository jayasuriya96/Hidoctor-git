var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthArray = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
var lockLeaveData_g = new Array();

function fnSetDCROptions() {
    var defaultOptions = "Attendance,Field,Leave,Field_RCPA";
    var dcrOptions = fnGetPrivilegeValue("DCR_ENTRY_OPTIONS", defaultOptions);

    var dcrOptionsArr = dcrOptions.split(',');
    var dcrOptionsHTML = "";

    dcrOptionsHTML = '<fieldset data-role="controlgroup" data-type="horizontal" >';
    var selectedOption = "";
    for (var g = 0; g < dcrOptionsArr.length; g++) {
        var option = "";
        if (dcrOptionsArr[g].toUpperCase() == "LEAVE" && isPayRollIntegrated_g) {
            continue;
        }
        if (dcrOptionsArr[g].toUpperCase() == "ATTENDANCE") {
            option = "A";
            if (g == 0) {
                selectedOption = option;
            }
        }
        else if (dcrOptionsArr[g].toUpperCase() == "FIELD") {
            option = "F";
            if (g == 0) {
                selectedOption = option;
            }
        }

        else if (dcrOptionsArr[g].toUpperCase() == "LEAVE") {
            option = "L";
            if (g == 0) {
                selectedOption = option;
            }
        }

        else if (dcrOptionsArr[g].toUpperCase() == "FIELD_RCPA") {
            option = "F(R)";
            if (g == 0) {
                selectedOption = option;
            }
        }
        if (g == 0) {
            dcrOptionsHTML += '<input id="radio' + option + '" checked="checked" name="dcroptions" value="' + dcrOptionsArr[g] + '" type="radio">';
            dcrOptionsHTML += '<label for="radio' + option + '">' + option + '</label>';
        }
        else {
            dcrOptionsHTML += '<input id="radio' + option + '" name="dcroptions" value="' + dcrOptionsArr[g] + '" type="radio">';
            dcrOptionsHTML += '<label for="radio' + option + '">' + option + '</label>';
        }
    }
    $('#dcrEntryOptions').prepend(dcrOptionsHTML).trigger('create');
}

function fnGetPre() {
    try {
        $.mobile.loading('show')
        var s = $('#hdnsdate').val();
        fnGetDCRDetails(monthArray[new Date(s).getMonth()] + ' ' + new Date(s).getFullYear())
    }
    catch (e) {
        $.mobile.loading('hide');
    }
}

function fnGetNext() {
    try {
        var s = $('#hdnedate').val();
        $.mobile.loading('show')
        fnGetDCRDetails(monthArray[new Date(s).getMonth()] + ' ' + new Date(s).getFullYear())
    }
    catch (e) {
        $.mobile.loading('hide');
    }
}

function fnSetNavigation() {
    var navigations = '<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">';
    navigations += '<input id="navigationpre" name="navigation" value="pre" type="radio">';
    navigations += '<label for="navigationpre"><<</label>';
    navigations += '<input id="navigationnext" name="navigation" value="next" type="radio" onclick="">';
    navigations += '<label for="navigationpre">>></label>';
    $(function () {
        var $navigation = $('<fieldset data-role="controlgroup" data-type="horizontal" ></fieldset>')
            .prepend(
                $('<legend></legend>'),
                $('<input />')
                    .attr({
                        'type': 'radio',
                        'name': 'navigation',
                        'id': 'navigationpre',
                        'value': 'pre'
                    }),
                $('<label />')
                    .attr({
                        'for': 'navigationpre'
                    }).text('<<'),
                $('<input />')
                    .attr({
                        'type': 'radio',
                        'name': 'navigation',
                        'id': 'navigationnext',
                        'value': '>>'
                    }),
                $('<label />')
                    .attr({
                        'for': 'navigationnext'
                    }).text('>>')
            );
        $('#navigation').prepend($navigation).trigger('create');
        $("#navigationnext").unbind('click').bind('click', event, function (e) { e.stopImmediatePropagation(); var s = $('#hdnedate').val(); fnGetDCRDetails(monthArray[new Date(s).getMonth()] + ' ' + new Date(s).getFullYear()) });
        $("#navigationpre").unbind('click').bind('click', event, function (e) { e.stopImmediatePropagation(); var s = $('#hdnsdate').val(); fnGetDCRDetails(monthArray[new Date(s).getMonth()] + ' ' + new Date(s).getFullYear()) });

    });
}

function fnDCRLockAutomation(enddate) {
    
    // isdcrLock_g = true;
    if (dcrJSON_g != null && dcrJSON_g.length > 0 && dcrJSON_g[0].Data.length > 0) {
        if (dcrJSON_g[0].Data[0].LockType.toUpperCase() == "IDLE_DCR") {
            fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked, Since you have failed to enter DCR.');
            isdcrLock_g = true;
            return false;

        }
        else if (dcrJSON_g[0].Data[0].LockType.toUpperCase() == "TP_UNAVAILABILITY") {
            var month = dcrJSON_g[0].Data[0].TP_Define_Month;
            var year = dcrJSON_g[0].Data[0].TP_Define_Year;
            var monthName = monthArray[month - 1];
            fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked, Since you have failed to define TP for ' + monthName + ' - ' + year);
            isdcrLock_g = true;
            return false;

        }
        else if (dcrJSON_g[0].Data[0].LockType.toUpperCase() == "TP_APPROVAL_LOCK") {

            var month = dcrJSON_g[0].Data[0].TP_Approval_Month;
            var year = dcrJSON_g[0].Data[0].TP_Approval_Year
            var curMonth = new Date(curdate_g).getMonth() + 1;
            var curYear = new Date(curdate_g).getFullYear();

            if (parseInt(month) == curMonth && parseInt(year) == curYear) {
                var monthName = monthArray[month - 1];
                fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked, Your TPs are not Approved for the Month.' + monthName + "-" + year);
                isdcrLock_g = true;
                return false;
            }

        }

    }
    //if (dcrJSON_g[9] != undefined) {
    //    if (dcrJSON_g[9].Data[0].SS_Applied_Lock == "1") {
    //        var SS_Month = fngetMonthNumberFromArray(dcrJSON_g[9].Data[0].Previous_Month_Year.substring(3, 5));
    //        var SS_Year = dcrJSON_g[9].Data[0].Previous_Month_Year.substring(6, 10);
    //        fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ' <br />Your DCR has been locked,Since you did not enter Secondary sales for the Month' + SS_Month + "-" + SS_Year);
    //        isdcrLock_g = true;
    //        return false;
    //    }
    //}
  
    if (dcrJSON_g[9] != undefined) {
        if (dcrJSON_g[9].Data[0].SS_Applied_Lock == "1") {
            var SS_Month = fngetMonthNumberFromArray(dcrJSON_g[9].Data[0].Previous_Month_Year.substring(3, 5));
            var SS_Year = dcrJSON_g[9].Data[0].Previous_Month_Year.substring(6, 10);
            fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked,Since you did not enter Secondary sales for the Month ' + SS_Month + "-" + SS_Year);
            isdcrLock_g = true;
            return false;
        }
    }

    //// START: TP Approval lock.
    //if (monthArray[new Date(curdate_g).getMonth()].toUpperCase() == monthArray[new Date(enddate).getMonth()].toUpperCase()
    //    && new Date(curdate_g).getFullYear() == new Date(enddate).getFullYear()) {
    //    if (dcrJSON_g != null && dcrJSON_g.length > 0 && dcrJSON_g[1] != null && dcrJSON_g[1].Data != null && dcrJSON_g[1].Data.length > 0) {
    //        if (dcrJSON_g[1].Data[0].TP_Approval_Lock == 1) {

    //            fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked, Your TPs are not Approved.')
    //            return false;
    //        }
    //    }
    //}
    //// END: TP Approval lock.

    //// Retirieve the Lock Automation, Lock Entry Days and Lock Release Days Privilege.
    //var dcrLockAutomation = fnGetPrivilegeValue("DCR_LOCK_AUTOMATION", "NO");
    //var dcrLockEntryDays = fnGetPrivilegeValue("DCR_LOCK_ENTRY_DAYS", "-1");
    //var dcrLockEntryDaysNumeric = parseInt(dcrLockEntryDays);
    //var dcrLockReleaseDays = fnGetPrivilegeValue("DCR_LOCK_RELEASE_DAYS", "0");
    //var isRegionLock = dcrJSON_g[1].Data[0].IsRegionLock;
    ////fnGetMissedDCRDate();
    //if ((dcrLockAutomation == "DCR_LOCK_IDLE" || dcrLockAutomation == "DCR_LOCK_LEAVE") && isRegionLock == "1") {
    //    if (dcrJSON_g.length > 0) {
    //        if (dcrJSON_g[0].Data.length > 0 && dcrJSON_g[0].Data[dcrJSON_g[0].Data.length - 1].LockStatus != null ) {
    //            // The DCR Lock table have already a record for DCR Lock
    //            // We will check Type and show the alert.
    //            if (dcrJSON_g[0].Data[dcrJSON_g[0].Data.length - 1].LockStatus == "LOCKED") {
    //                if (dcrJSON_g[0].Data[dcrJSON_g[0].Data.length - 1].LockType == "IDLE_DCR") {
    //                    isdcrLock_g = true;
    //                    fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked, Since you have failed to enter DCR.');
    //                    return false;
    //                }
    //                else {
    //                    if (dcrJSON_g[0].Data[dcrJSON_g[0].Data.length - 1].LockType == "TP_UNAVAILABILITY") {
    //                        isdcrLock_g = true;
    //                        var monthYearValue = GetMonthAndYearFromDate(dcrJSON_g[0].Data[dcrJSON_g[0].Data.length - 1].NeedsToBeTPMonth)
    //                        var tpLockDays = fnGetPrivilegeValue("TP_LOCK_DAY", "0");
    //                        if (parseInt(tpLockDays) < new Date(curdate_g).getDate()) {
    //                            isdcrLock_g = true;
    //                            fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked, Since you have failed to define TP for ' + monthYearValue + '.');
    //                            return false;
    //                        }
    //                        else {
    //                            isdcrLock_g = true;
    //                            fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked, Since you have failed to define TP for  ' + monthYearValue + '.');
    //                            return false;
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}

}

function fngetMonthNumberFromArray(monthName) {
    if (monthName.toUpperCase() == "01") {
        return "JAN";
    }
    if (monthName.toUpperCase() == "02") {
        return "FEB";
    }
    if (monthName.toUpperCase() == "03") {
        return "MAR";
    }
    if (monthName.toUpperCase() == "04") {
        return "APR";
    }
    if (monthName.toUpperCase() == "05") {
        return "MAY";
    }
    if (monthName.toUpperCase() == "06") {
        return "JUN";
    }
    if (monthName.toUpperCase() == "07") {
        return "JUL";
    }
    if (monthName.toUpperCase() == "08") {
        return "AUG";
    }
    if (monthName.toUpperCase() == "09") {
        return "SEP";
    }
    if (monthName.toUpperCase() == "10") {
        return "OCT";
    }
    if (monthName.toUpperCase() == "11") {
        return "NOV";
    }
    if (monthName.toUpperCase() == "12") {
        return "DEC";
    }
}


function fnValidation(d) {
    var dcrJSON3_g = dcrJSON_g;


    d = new Date(d.id.split('-')[1] + '/' + d.id.split('-')[0] + '/' + d.id.split('-')[2]);

    // Retrieve the user selected option.
    var selectedOption = fnUserSelectedOption();

    selectedOption = selectedOption.indexOf('RCPA') != -1 ? "FIELD" : selectedOption;
    // Feature date validation.

    if (d > new Date(curdate_g) && selectedOption != "LEAVE") {
        // $.msgbox("Since the selected date is a future date, you are not allowed to enter DCR.", { type: "info" });
        fnMsgAlert('info', 'DCR', 'Since the selected date is a future date, you are not allowed to enter DCR.');
        return false;
    }


    // set the user selected date.
    var m = d.getMonth() + 1;
    var y = d.getFullYear();
    var d1 = d.getDate();
    var selectedDate = m + "/" + d1 + "/" + y;

    //var hiDotorStartDate = dcrJSON_g[1].Data[0].HidoctorStartDate;
    if (fnGetDateDifference(new Date(selectedDate), new Date(dcrJSON_g[1].Data[0].HidoctorStartDate)) > 0) {
        fnMsgAlert('info', 'DCR', 'You cant enter DCR before your joining date.');
        return false;
    }


    var WA_REGIS_DATE = dcrJSON_g[1].Data[0].WA_REGIS_DATE;
    var IS_WA_TABLET_USER = dcrJSON_g[1].Data[0].Is_WA_TABLET_USER;
    var data1 = jsonPath(dcrJSON3_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");
    var WAdata = jsonPath(dcrJSON3_g[7].Data, "$.[?(@.start=='" + selectedDate + "')]");
    var entryExist = false;

    if (d >= new Date(WA_REGIS_DATE) && selectedOption != "LEAVE" && IS_WA_TABLET_USER) {
        if (data1) {
            for (var i = 0; i < data1.length; i++) {
                if (data1[i].title.split(' ')[0].toUpperCase() == selectedOption) {
                    entryExist = true;
                    break;
                }
            }
        }

        for (var i = 0; i < WAdata.length; i++) {
            if (WAdata[i].title.split('-')[1].toUpperCase() == selectedOption) {
                entryExist = true;
                break;
            }
        }

        if (!entryExist) {
            var dateCount = fnGetCountforDCRRestrictDate(selectedDate);
            if (dateCount == 0) {
                fnMsgAlert('info', 'DCR Calendar', "Dear User, You are a WideAngle user. Please enter your Field/Attendance activity in WideAngle. If you wish to enter DCR directly in Web/Mobile, please contact your administrator.")
                return false;
            }
        }

    }

    // var dcrLockAutomation = fnGetPrivilegeValue("DCR_LOCK_AUTOMATION", "NO");
    var lockReasonName = fnGetPrivilegeValue('LOCK_REASON_NAME', 'Lock Leave');
    //if (dcrLockAutomation == "DCR_LOCK_LEAVE") {
    if (lockLeaveData_g.length > 0) {
        var dcrLockLeaveData = jsonPath(lockLeaveData_g, "$.[?(@.date=='" + selectedDate + "')]");
        if (dcrLockLeaveData != "false" && dcrLockLeaveData.length > 0) {
            fnMsgAlert('info', 'DCR', 'You have applied ' + lockReasonName + ' for this date, and it is approved.');
            return false;
        }
    }

    var dcrLockLeaveData = jsonPath(dcrJSON3_g[3].Data, "$.[?(@.start=='" + selectedDate + "')]");
    if (dcrLockLeaveData != "false" && dcrLockLeaveData.length > 0 && !(dcrLockLeaveData[0].title.split('-')[1].toUpperCase() =='RELEASED')) {
        fnMsgAlert('info', 'DCR', 'You have applied ' + lockReasonName + ' for this date, and it is approved.');
        return false;
    }
    //}

    // Activity Lock check.
    // Dont check Privilege. if any lock in a date show the alert.
    if (dcrJSON_g != null && dcrJSON_g.length > 0 && dcrJSON_g[6] != null) {
        if (dcrJSON_g[6].Data != null && dcrJSON_g[6].Data.length > 0) {
            for (var i = 0; i < dcrJSON_g[6].Data.length; i++) {
                var dcrDate = dcrJSON_g[6].Data[i].DCR_Actual_Date;
                dcrDateArr = dcrJSON_g[6].Data[i].DCR_Actual_Date.split('/');
                dcrDateArr[0] = dcrDateArr[0].indexOf('0') == 0 ? dcrDateArr[0].replace('0', '') : dcrDateArr[0];
                dcrDateArr[1] = dcrDateArr[1].indexOf('0') == 0 ? dcrDateArr[1].replace('0', '') : dcrDateArr[1];
                dcrDate = dcrDateArr[0] + '/' + dcrDateArr[1] + '/' + dcrDateArr[2];
                if (fnGetDateDifference(new Date(selectedDate), new Date(dcrDate)) == 0) {
                    if (selectedOption.toUpperCase() == dcrJSON_g[6].Data[i].Flag.toUpperCase()) {
                        fnMsgAlert('info', 'DCR', "Dear User, Your DCR has been locked. Please contact your head office for further assistance. Your manager has unapproved your DCR - " + dcrJSON_g[6].Data[i].Flag + " activity for this day. Reason for unapproval is as follows: " + dcrJSON_g[6].Data[i].UnapproveReason);
                        //fnMsgAlert('info', 'DCR', 'Your Manager has unapproved your DCR - ' + dcrJSON_g[6].Data[i].Flag + ' activity for this day. Reason for unapproval is as follows:' + dcrJSON_g[6].Data[i].UnapproveReason);
                        return false;
                    }
                }
            }
        }
    }


    // Tow entries validate.
    var entryCount = 0;
    // DCR Master.
    for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
        if (fnGetDateDifference(new Date(dcrJSON_g[2].Data[i].start), new Date(selectedDate)) == 0) {
            if (dcrJSON_g[2].Data[i].title.split(' ')[0].toUpperCase() != selectedOption.toUpperCase()) {
                // if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPLIED") {
                entryCount++;
                //}
            }
        }
    }
    for (var i = 0; i < dcrJSON_g[4].Data.length; i++) {
        if (fnGetDateDifference(new Date(dcrJSON_g[4].Data[i].start), new Date(selectedDate)) == 0) {
            entryCount++;
        }
    }

    if (entryCount >= 2) {
        fnMsgAlert('info', 'DCR Calendar', 'You can enter maximum of two entries for a date.');
        return false;
    }

    var status = "";
    // Applied and Approved Validation.

    for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
        if (fnGetDateDifference(new Date(selectedDate), new Date(dcrJSON_g[2].Data[i].start)) == 0) {

            if (selectedOption == dcrJSON_g[2].Data[i].title.split(' ')[0].toUpperCase()) {
                if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPLIED") {
                    fnMsgAlert('info', 'DCR Calendar', 'You have already applied ' + selectedOption + ' for this date.');
                    return false;
                }
                if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED") {
                    fnMsgAlert('info', 'DCR Calendar', 'You have already entered ' + selectedOption + ' for this date and it is approved.');
                    return false;
                }
                if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "UNAPPROVED") {
                    status = 0;
                    break;
                }
                if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT") {
                    status = 3;
                    break
                }

            }
        }
    }

    //Check activity per day
    //if (singleActivityperday_g.toUpperCase() == 'SINGLE') {

    //    if (entryCount == '1') {
    //        for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
    //            if (fnGetDateDifference(new Date(selectedDate), new Date(dcrJSON_g[2].Data[i].start)) == 0) {
    //                if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPLIED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED") {
    //                    fnMsgAlert('info', 'DCR Calendar', 'Dear ' + loginUserName_g + ',You can not enter another activity for this date.');
    //                    return false;
    //                }
    //            }
    //        }

    //    }
    //}
    if (singleActivityperday_g.toUpperCase() == 'SINGLE') {
  
        if (entryCount == '1') {
            for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                if (fnGetDateDifference(new Date(selectedDate), new Date(dcrJSON_g[2].Data[i].start)) == 0) {

                    if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPLIED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() =="UNAPPROVED") {
                        fnMsgAlert('info', 'DCR Calendar', 'Dear ' + loginUserName_g + ' You can not enter another activity for this date.');
                        return false;
                    }
                }
            }
        }
    }

    if (singleActivityperday_g.toUpperCase() == 'RESTRICTED') {
       
        if (entryCount == '1') {
            for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                if (fnGetDateDifference(new Date(selectedDate), new Date(dcrJSON_g[2].Data[i].start)) == 0) {
                    if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED") {
                        fnMsgAlert('info', 'DCR Calendar', 'Dear ' + loginUserName_g + ' .Your DCR for this date (' + selectedDate + ')is in approved mode, to apply a another DCR for this day, request your manager to unapprove the first DCR.');
                        return false;
                    }
                }
            }
        }
    }

    if (singleActivityperday_g.toUpperCase() == 'RESTRICTED' || singleActivityperday_g.toUpperCase() == 'MULTIPLE') {
  
        if (leaveentrymode_g.toUpperCase() == 'FULL_DAY') {
            if (entryCount == '1') {
                for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                    if (fnGetDateDifference(new Date(selectedDate), new Date(dcrJSON_g[2].Data[i].start)) == 0) {
                        if (selectedOption.toUpperCase() == "LEAVE") {
                            if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPLIED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED") {
                                fnMsgAlert('info', 'DCR Calendar', 'Dear ' + loginUserName_g + ' . Your DCR for this date (' + selectedDate + ')is already entered, to apply a leave for this day, request your manager to unapprove the first DCR.');
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }

    if (leaveentrymode_g.toUpperCase() == 'FULL_DAY') {
       
        if (entryCount == '1') {
            for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                if (fnGetDateDifference(new Date(selectedDate), new Date(dcrJSON_g[2].Data[i].start)) == 0) {
                    if (dcrJSON_g[2].Data[i].title.toUpperCase() == "LEAVE APPLIED" || dcrJSON_g[2].Data[i].title.toUpperCase() == "LEAVE APPROVED") {
                        fnMsgAlert('info', 'DCR Calendar', 'Dear ' + loginUserName_g + ', . Since, you have applied or approved Leave for this day, you cannot apply any other activity(s).');
                        return false;
                    }
                }
            }//alert("No Leave applied");
        }
    }

    var weekend = null;
    if (dcrJSON_g[8] != null && dcrJSON_g[8].Data != null) {
        var mo = m.toString().length == 1 ? "0" + m : m;
        var da = d1.toString().length == 1 ? "0" + d1 : d1;
        wdate = y + '-' + mo + '-' + da;
        if (dcrJSON_g[8] != null && dcrJSON_g[8].Data != null) {
            weekend = jsonPath(dcrJSON_g[8].Data, "$.[?(@.Weekend_Date=='" + wdate + "')]");
        }
    }

    if (selectedOption == "LEAVE") {

        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var date = d.getDate();
        month = month.toString().length == 1 ? "0" + month : month;
        date = date.toString().length == 1 ? "0" + date : date;
        var dcrDate = year + "-" + month + "-" + date;
        var data = jsonPath(dcrJSON3_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");
        var holidayData = jsonPath(dcrJSON3_g[4].Data, "$.[?(@.start=='" + selectedDate + "')]");
        var TP_LOCK_DAY = fnGetPrivilegeValue("TP_LOCK_DAY", '0')
        var Tour_Planner = fnGetPrivilegeValue("TOUR_PLANNER", 'NO')
        if (holidayData != null && holidayData.length > 0) {
            fnMsgAlert('info', 'DCR Calendar', 'Dear User selected date is holiday, You will not be able to apply leave for this date.');
            return false;
        }
        else if (weekend) {
            var day = weekday[new Date(selectedDate).getDay()];
            fnMsgAlert('info', 'DCR Calendar', 'Dear User selected date is weekend off day (' + day + '), You will not be able to apply leave for this date.');
            return false;
        }

        if (Tour_Planner == "YES" && parseInt(TP_LOCK_DAY) > 0) {
            var dateCount = fnCheckTPavailable(dcrDate)
            if (parseInt(dateCount) > 0) {
                fnMsgAlert('info', 'DCR Calendar', 'Please plan your leave in TP before entering actual here.');
                return false;
            }
        }

        if (data.length > 0) {
            var leave_Entry_Mode = fnGetLeaveEntryMode();
            // Check Leave Entry Mode 
            if (leave_Entry_Mode.toUpperCase() == "FULL_DAY" && data[0].title.split(' ')[1].length > 1) {
                if (data[0].title.split(' ')[1].toUpperCase() == "APPLIED" || data[0].title.split(' ')[1].toUpperCase() == "APPROVED") {
                    alert('Since, you have applied or approved ' + data[0].title.split(' ')[0] + ' for this day, you cannot apply any other activity(s).');
                    return false;
                }
            }
            if (data[0].title.split(' ')[0].toUpperCase() == "FIELD" || data[0].title.split(' ')[0].toUpperCase() == "ATTENDANCE") {
                if (confirm("You have already entered " + data[0].title.split(' ')[0] + " for this date. Still do you wish to apply leave?")) {
                    fnNavigationtoScreens(status, dcrDate);
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        fnNavigationtoScreens(status, dcrDate);
        return true;
    }

    var tp = jsonPath(dcrJSON3_g[5].Data, "$.[?(@.start=='" + selectedDate + "')]");
    if (tp.toString() != "false") {
        var dcrMaster = jsonPath(dcrJSON3_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");
        if (dcrMaster.toString() == "false") {
            var tpActName = tp[0].className.toUpperCase().indexOf("RCPA") > -1 ? "FIELD" : tp[0].className.toUpperCase();
            if (tpActName != selectedOption.toUpperCase()) {
                if (!confirm('Call objective of this date is ' + tp[0].className + ' and you are trying to enter ' + selectedOption + '. Still do you wish to continue?')) {
                    return false;
                }
            }
        }
    }

    if (weekend) {
        var dcrMaster = jsonPath(dcrJSON_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");
        if (dcrMaster.toString() == "false") {
            var day = weekday[new Date(selectedDate).getDay()];
            var confirmResult = confirm('The selected date is weekend off day (' + day + '). Do you wish to enter ' + selectedOption + '?')
            if (!confirmResult) {
                return false;
            }
        }
    }

    var sequentialDCREntry = fnGetPrivilegeValue("SEQUENTIAL_DCR_ENTRY", "YES");
    if (sequentialDCREntry != "NO") {
        // Set Start Date.
        var startDate
        if (sequentialDCREntry.toUpperCase() == "DRAFTED_DCR") {
            sequentialDCREntry = "YES,DRAFTED_DCR";
        }
        // If month check previous month first date is a strat date
        if (sequentialDCREntry.toUpperCase().indexOf('MONTH_CHECK') != -1) {

            // Month Check valid is only current month.
            if (new Date(curdate_g).getMonth() == d.getMonth()) {
                var month = d.getMonth();
                var year = "";
                if (month == "0") {
                    month = "12";
                    year = d.getFullYear() - 1;
                }
                else {
                    year = d.getFullYear();
                }
                startDate = month + "/" + "01" + "/" + year;
            }
            else {
                var month = d.getMonth() + 1;
                var year = d.getFullYear();
                startDate = month + "/" + "01" + "/" + year;
            }
        }
        else if (sequentialDCREntry.toUpperCase().indexOf('YES') != -1) {
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            startDate = month + "/" + "01" + "/" + year;
        }
        else {
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            startDate = month + "/" + "01" + "/" + year;
        }

        if (fnGetDateDifference(new Date(dcrJSON_g[1].Data[0].HidoctorStartDate), new Date(startDate)) < 0) {
            startDate = dcrJSON_g[1].Data[0].HidoctorStartDate;
        }

        if (sequentialDCREntry.toUpperCase().indexOf('MONTH_CHECK') != -1 || sequentialDCREntry.toUpperCase().indexOf('YES') != -1) {
            for (var dateIndex = new Date(startDate) ; dateIndex < d; dateIndex = new Date(new Date(dateIndex).setDate(new Date(dateIndex).getDate() + 1))) {
                var y = dateIndex.getFullYear();
                var m = dateIndex.getMonth();
                var da = dateIndex.getDate();
                var dcrMaster = false;
                
                var dcrMasterobj = jsonPath(dcrJSON3_g[3].Data, "$.[?(@.month=='" + (m + 1) + "' & @.year=='" + y + "' & @.day=='" + da + "'& @.DCR_Lock_Status !='Released' )]");

                // Grey tip integartion.
                if (dcrMasterobj != null && dcrMasterobj) {
                    for (var a = 0; a < dcrMasterobj.length; a++) {
                        if (dcrMasterobj[a].title.split(' ')[0].toUpperCase() == "LEAVE" && dcrMasterobj[a].Activity_Count == "0.5") {
                            var date1 = fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                            fnMsgAlert('info', 'DCR Calendar', 'Dear User, Activity for ' + date1 + ' is missing(Half a day). Please enter an activity for that date');
                            return false;
                        }
                    }
                }


                // DCR Master.
                for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                    if (fnGetDateDifference(new Date(dcrJSON_g[2].Data[i].start), new Date(dateIndex)) == 0) {
                        dcrMaster = true;
                        break;
                    }
                }

                var dcrLockLeave = false;
                for (var i = 0; i < dcrJSON_g[3].Data.length; i++) {
                    if (fnGetDateDifference(new Date(dcrJSON_g[3].Data[i].start), new Date(dateIndex)) == 0 && dcrJSON_g[3].Data[i].DCR_Lock_Status != 'Released') {
                        dcrLockLeave = true;
                        break;
                    }
                }

                // DCR Holiday.
                var dcrHoliday = false;
                for (var i = 0; i < dcrJSON_g[4].Data.length; i++) {
                    if (fnGetDateDifference(new Date(dcrJSON_g[4].Data[i].start), new Date(dateIndex)) == 0) {
                        dcrHoliday = true;
                        break;
                    }
                }

                // Sunday
                var weekend = null;
                if (dcrJSON_g[8] != null && dcrJSON_g[8].Data != null) {

                    var mo = (parseInt(m) + 1).toString().length == 1 ? "0" + (parseInt(m) + 1).toString() : parseInt(m) + 1;
                    var d1 = da.toString().length == 1 ? "0" + da : da;
                    wdate = y + '-' + mo + '-' + d1;
                    if (dcrJSON_g[8] != null && dcrJSON_g[8].Data != null) {
                        weekend = jsonPath(dcrJSON_g[8].Data, "$.[?(@.Weekend_Date=='" + wdate + "')]");
                    }
                }
                if (weekend) {
                    continue;
                }

                if (!dcrMaster && !dcrHoliday && !dcrLockLeave) {
                    var date1 = fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                    //$.msgbox('Activity for ' + date1 + ' is missing. Please enter an activity for that date', { type: "info" });
                    fnMsgAlert('info', 'DCR Calendar', 'Activity for ' + date1 + ' is missing. Please enter an activity for that date');
                    //alert("Please enter the a activity for date:" + new Date(dateIndex));
                    return false;
                }
            }
        }

        if (sequentialDCREntry.toUpperCase().indexOf('DRAFTED') != -1) {
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            //startDate = month + "/" + "01" + "/" + year;
            //var month = d.getMonth() + 1;
            //var year = d.getFullYear();
            //startDate = month + "/" + "01" + "/" + year;
            if (fnGetDateDifference(new Date(dcrJSON_g[1].Data[0].HidoctorStartDate), new Date(startDate)) < 0) {
                startDate = dcrJSON_g[1].Data[0].HidoctorStartDate;
            }


            var selectedOption = fnUserSelectedOption();
            selectedOption = selectedOption.indexOf('RCPA') != -1 ? "FIELD" : selectedOption;

            for (var dateIndex = new Date(startDate) ; dateIndex < d; dateIndex = new Date(new Date(dateIndex).setDate(new Date(dateIndex).getDate() + 1))) {

                var y = dateIndex.getFullYear();
                var m = dateIndex.getMonth();
                var da = dateIndex.getDate();
                var dcrMaster = false;
                var unpaidleavefordraftentry = false;
                // DCR Master.
                for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                    if (fnGetDateDifference(new Date(dcrJSON_g[2].Data[i].start), new Date(dateIndex)) == 0) {

                        if (dcrJSON_g[3].Data != null) {
                            for (var j = 0; j < dcrJSON_g[3].Data.length; j++) {
                                if (fnGetDateDifference(new Date(dcrJSON_g[3].Data[j].start), new Date(dateIndex)) == 0) {
                                    if (dcrJSON_g[3].Data[j].title.toUpperCase().split('-')[1] != "RELEASED") {
                                        unpaidleavefordraftentry = true;
                                    }
                                    break;
                                }
                            }
                        }
                        if (!unpaidleavefordraftentry) {
                            if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT") {
                                var date1 = fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                                fnMsgAlert('info', 'DCR Calendar', 'The DCR entry of ' + date1 + ' is in draft status. Please submit the DCR of that date.');
                                return false;
                            }
                        }
                    }
                }
            }
        }


        if (unApprovedDCRCheck_g == "YES") {
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            //startDate = month + "/" + "01" + "/" + year;
            //var month = d.getMonth() + 1;
            //var year = d.getFullYear();
            //startDate = month + "/" + "01" + "/" + year;
            if (fnGetDateDifference(new Date(dcrJSON_g[1].Data[0].HidoctorStartDate), new Date(startDate)) < 0) {
                startDate = dcrJSON_g[1].Data[0].HidoctorStartDate;
            }


            var selectedOption = fnUserSelectedOption();
            selectedOption = selectedOption.indexOf('RCPA') != -1 ? "FIELD" : selectedOption;

            for (var dateIndex = new Date(startDate) ; dateIndex < d; dateIndex = new Date(new Date(dateIndex).setDate(new Date(dateIndex).getDate() + 1))) {

                var y = dateIndex.getFullYear();
                var m = dateIndex.getMonth();
                var da = dateIndex.getDate();
                var dcrMaster = false;
                var unpaidleavefordraftentry = false;
                var chkUnApproverStatus = false;
                var isCheckApproveApplied = true;
                // DCR Master.
                for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                    if (fnGetDateDifference(new Date(dcrJSON_g[2].Data[i].start), new Date(dateIndex)) == 0) {

                        if (dcrJSON_g[3].Data != null) {
                            for (var j = 0; j < dcrJSON_g[3].Data.length; j++) {
                                if (fnGetDateDifference(new Date(dcrJSON_g[3].Data[j].start), new Date(dateIndex)) == 0) {
                                    if (dcrJSON_g[3].Data[j].title.toUpperCase().split('-')[1] != "UN APPROVED") {
                                        unpaidleavefordraftentry = true;
                                    }
                                    break;
                                }
                            }
                        }

                        if (!unpaidleavefordraftentry) {
                            if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "UNAPPROVED" && isCheckApproveApplied) {
                                chkUnApproverStatus = true;
                            }
                            else if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT" && isCheckApproveApplied) {
                                for (var unA = 0; unA < dcrJSON_g[2].Data.length; unA++) {
                                    var draftDay = dcrJSON_g[2].Data[i].day;
                                    var chkDay = dcrJSON_g[2].Data[unA].day;
                                    if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT" && dcrJSON_g[2].Data[unA].title.split(' ')[1].toUpperCase() == "UNAPPROVED" && draftDay == chkDay) {
                                        chkUnApproverStatus = true;
                                        break;
                                    }
                                    //else {
                                    //    chkUnApproverStatus = false;
                                    //    isCheckApproveApplied = false;
                                    //}
                                }
                            }
                            else {
                                chkUnApproverStatus = false;
                                isCheckApproveApplied = false;
                            }
                        }
                    }
                }

                if (chkUnApproverStatus) {
                    var date1 = fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                    fnMsgAlert('info', 'DCR Calendar', 'The DCR entry of ' + date1 + ' is in UnApproved status. Please submit the DCR of that date.');
                    return false;
                }



            }
        }
    }


    var dcrMaster = jsonPath(dcrJSON3_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");
    if (dcrMaster.toString() != "false" && dcrMaster.length == 1) {
        for (var i = 0; i < dcrMaster.length; i++) {
            if (dcrMaster[i].title.split(' ')[0].toUpperCase() != selectedOption) {

                // Check Leave Entry Mode.
                if (dcrMaster[i].title.split(' ')[0].toUpperCase() == "LEAVE" && dcrMaster[i].title.split(' ')[1].toUpperCase() != "UNAPPROVED") {
                    var leave_Entry_Mode = fnGetLeaveEntryMode();
                    if (leave_Entry_Mode.toUpperCase() == "FULL_DAY") {
                        alert('Since, you have applied or approved ' + dcrMaster[i].title.split(' ')[0].toUpperCase() + ' for this day, you cannot apply any other activity(s).');
                        return false;
                    }
                    //else {
                    //    // Grey Tip integration, Grey Tip leave Activity Count. if activity count is 1, no other activities al lowed.
                    //    if (dcrMaster[i].Activity_Count == "1") {
                    //        fnMsgAlert('info', 'DCR Calendar', 'Dear User, Since, you have applied or approved ' + dcrMaster[i].title.split(' ')[0].toUpperCase() + ' for this day, you cannot apply any other activity(s).');
                    //        return false;
                    //    }
                    //}
                }

                if (!confirm('You have already entered ' + dcrMaster[i].title.split(' ')[0].toUpperCase() + ' for this date. Do you wish to enter ' + selectedOption + '?')) {
                    return false;
                }
            }
        }
    }

    var dcrHoliday = jsonPath(dcrJSON3_g[4].Data, "$.[?(@.start=='" + selectedDate + "')]");
    if (dcrHoliday.toString() != "false") {
        var dcrMaster = jsonPath(dcrJSON3_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");

        if (dcrMaster.toString() == "false") {
            if (!confirm('The selected date is holiday. Do you wish to enter ' + selectedOption + '?')) {
                return false;
            }
        }
    }

    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var date = d.getDate();
    month = month.toString().length == 1 ? "0" + month : month;
    date = date.toString().length == 1 ? "0" + date : date;
    var dcrDate = year + "-" + month + "-" + date;
    fnNavigationtoScreens(status, dcrDate);
}


function fnUserSelectedOption() {
    var option = "";
    $("input[name*=dcroptions]:checked").each(function () {
        option = $(this).val();
    });
    return option.toUpperCase();

    /*var defaultOptions = "Attendance,Field,Leave,Field_RCPA";
    var dcrOptions = fnGetPrivilegeValue("DCR_ENTRY_OPTIONS", defaultOptions);
    var dcrOptionsArr = dcrOptions.split(',');
    for (var i = 0; i < dcrOptionsArr.length; i++) {
        if ($('#' + dcrOptionsArr[i]).hasClass('fc-state-active')) {
            return dcrOptionsArr[i].toUpperCase();
        }
    }*/
}

function fnGetDateDifference(d1, d2) {
    return (d2 - d1) / 1000 / 60 / 60 / 24;
}

function fnNavigationtoScreens(status, dcrDate) {
    var flag = fnUserSelectedOption();
    var redirectHeader = "";
    var redirectHome = "";

    if (dcrJSON_g[1].Data[0].Is_WA_User == 'Y') {// if wa user redirect to dcrv4 header
        redirectHeader = "../DCRV4Header/Index/";
        redirectHome = "../DCRV4MobileHome/Index/"
    }
    else {// else redirect to dcrv3 header
        redirectHeader = "../DCRHeader/Create/";
        redirectHome = "../MobileHome/Index/"
    }

    if (flag.toUpperCase() == "FIELD") {
        if (status == "3") {
            // $(":mobile-pagecontainer").pagecontainer("change", { changeHash: false, type: "post", showLoadMsg: true, dataUrl: redirectHome + "?dcrDate=" + dcrDate + "&dcrStatus=3&isrcpa=N&source=CALENDAR&flag=F&travelKm=0" });
            $.mobile.changePage(redirectHome + "?dcrDate=" + dcrDate + "&dcrStatus=3&isrcpa=N&source=CALENDAR&flag=F&travelKm=0", {
                type: "post",
                reverse: false,
                changeHash: false
            });
            //$('#main').load('../DCRHeader/Create/?dcrDate=' + dcrDate + '&dcrStatus=3&isrcpa=N&source=CALENDAR&flag=F');
        }
        else if (status == "0") {
            //$(":mobile-pagecontainer").pagecontainer("change", { changeHash: false, type: "post", showLoadMsg: true, dataUrl: redirectHome + "/?dcrDate=" + dcrDate + "&dcrStatus=0&isrcpa=N&source=CALENDAR&flag=F&travelKm=0" });
            $.mobile.changePage(redirectHome + "/?dcrDate=" + dcrDate + "&dcrStatus=0&isrcpa=N&source=CALENDAR&flag=F&travelKm=0", {
                type: "post",
                reverse: false,
                changeHash: false
            });
            // $('#main').load('../DCRHeader/Create/?dcrDate=' + dcrDate + '&dcrStatus=0&isrcpa=N&source=CALENDAR&flag=F');
        }
        else {
            //$(":mobile-pagecontainer").pagecontainer("change", { changeHash: false, type: "post", showLoadMsg: true, dataUrl: redirectHeader + "?dcrDate=" + dcrDate + "&dcrStatus=1&isrcpa=N&source=CALENDAR&flag=F" });
            $.mobile.changePage(redirectHeader + "?dcrDate=" + dcrDate + "&dcrStatus=1&isrcpa=N&source=CALENDAR&flag=F", {
                type: "post",
                reverse: false,
                changeHash: false
            });
            //alert('Header Navigation Inprogress');
            //$('#main').load('../DCRHeader/Create/?dcrDate=' + dcrDate + '&dcrStatus=1&isrcpa=N&source=CALENDAR&flag=F');
        }
    }
    if (flag.toUpperCase() == "FIELD_RCPA") {
        if (status == "3") {
            //$(":mobile-pagecontainer").pagecontainer("change", { changeHash: false, type: "post", showLoadMsg: true, dataUrl: redirectHome + "?dcrDate=" + dcrDate + "&dcrStatus=3&isrcpa=N&source=CALENDAR&flag=F&travelKm=0" });
            $.mobile.changePage(redirectHome + "?dcrDate=" + dcrDate + "&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F&travelKm=0", {
                type: "post",
                reverse: false,
                changeHash: false
            });
            //$('#main').load('DCRHeader/Create/?dcrDate=' + dcrDate + '&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F');
        }
        else if (status == "0") {
            // $(":mobile-pagecontainer").pagecontainer("change", { changeHash: false, type: "post", showLoadMsg: true, dataUrl: redirectHome + "?dcrDate=" + dcrDate + "&dcrStatus=0&isrcpa=Y&source=CALENDAR&flag=F&travelKm=0" });
            $.mobile.changePage(redirectHome + "?dcrDate=" + dcrDate + "&dcrStatus=0&isrcpa=y&source=CALENDAR&flag=F&travelKm=0", {
                type: "post",
                reverse: false,
                changeHash: false
            });
            //$('#main').load('DCRHeader/Create/?dcrDate=' + dcrDate + '&dcrStatus=0&isrcpa=Y&source=CALENDAR&flag=F');
        }
        else {
            // $(":mobile-pagecontainer").pagecontainer("change", { changeHash: false, type: "post", showLoadMsg: true, dataUrl: redirectHeader + "?dcrDate=" + dcrDate + "&dcrStatus=1&isrcpa=Y&source=CALENDAR&flag=F" });
            $.mobile.changePage(redirectHeader + "?dcrDate=" + dcrDate + "&dcrStatus=1&isrcpa=Y&source=CALENDAR&flag=F", {
                type: "post",
                reverse: false,
                changeHash: false
            });
            //alert('Header navigation inprogress.');
            //$('#main').load('DCRHeader/Create/?dcrDate=' + dcrDate + '&dcrStatus=1&isrcpa=Y&source=CALENDAR&flag=F');
        }
    }
    if (flag.toUpperCase() == "LEAVE") {
        if (status == "0") {
            // $(":mobile-pagecontainer").pagecontainer("change", { changeHash: false, type: "post", showLoadMsg: true, dataUrl: "../DCRLeaveEntry/Create/?dcrDate=" + dcrDate + "&dcrStatus=0" });
            $.mobile.changePage("../DCRLeaveEntry/Create/?dcrDate=" + dcrDate + "&dcrStatus=0", {
                type: "post",
                reverse: false,
                changeHash: false
            });
        }
        else {
            // $(":mobile-pagecontainer").pagecontainer("change", { changeHash: false, type: "post", showLoadMsg: true, dataUrl: "../DCRLeaveEntry/Create/?dcrDate=" + dcrDate + "&dcrStatus=1" });
            $.mobile.changePage("../DCRLeaveEntry/Create/?dcrDate=" + dcrDate + "&dcrStatus=1", {
                type: "post",
                reverse: false,
                changeHash: false
            });
        }
    }
    if (flag.toUpperCase() == "ATTENDANCE") {

        // dcrDate = dcrDate.split('-')[1] + "-" + dcrDate.split('-')[2] + "-" + dcrDate.split('-')[0];
        // TO DO: Get Parent Url and Replace the localhost.

        if (status == "3") {
            $.mobile.changePage(redirectHome + "?dcrDate=" + $.trim(dcrDate) + "&dcrStatus=3&isrcpa=N&source=CALENDAR&flag=A&travelKm=0", {
                type: "post",
                reverse: false,
                changeHash: false
            });
        }
        else if (status == "0") {
            $.mobile.changePage(redirectHome + "?dcrDate=" + $.trim(dcrDate) + "&dcrStatus=0&isrcpa=N&source=CALENDAR&flag=A&travelKm=0", {
                type: "post",
                reverse: false,
                changeHash: false
            });
        }
        else {
            $.mobile.changePage(redirectHeader + "?dcrDate=" + $.trim(dcrDate) + "&dcrStatus=1&isrcpa=N&source=CALENDAR&flag=A", {
                type: "post",
                reverse: false,
                changeHash: false
            });
        }
    }
}

function fnGetDCRDetails(my, isFirstTime, navigation) {
    // Intize the start date and end date.

    var startDate;
    var endDate;
    // if fisrtTime callinf we retrieves the las two months data.
    // this data help for Sequntial DCR = Month_Check.
    // if not fistatime we retrieves the one month details.
    var month = new Date(curdate_g).getMonth();
    var monthName = monthArray[month];
    var calndarMonthName = my.split(' ')[0];
    if (monthName.toUpperCase() == calndarMonthName.toUpperCase()) {
        var monthName = my.split(' ')[0];
        var year = my.split(' ')[1];
        stratYear = monthName == "JANUARY" ? year - 1 : year;
        startMonthName = fnGetPreviousMonth(monthName);
        var mon = fngetMonthNumber(startMonthName);
        startDate = mon + "/" + "01" + "/" + stratYear;

        // Retrives the last day of month.
        var lastDay = fnDaysInMonth(mon + 1, year);
        var endMonth = fngetMonthNumber(monthName);
        endDate = endMonth + "/" + lastDay + "/" + year;
    }
    else {
        my_g = my;
        var month = my.split(' ');
        var mon = fngetMonthNumber(month[0]);
        var startDate = mon + "/01/" + month[1]
        var endDate;
        var lastDay = fnDaysInMonth(mon, month[1]);
        endDate = mon + "/" + lastDay + "/" + month[1]
    }

    $.ajax({
        type: 'POST',
        data: "startDate=" + startDate + "&endDate=" + endDate,
        url: '/HiDoctor_Activity/DCRCalendar/GetCalendarDetails',
        success: function (response) {
            var result = response;
            if (result.length == 0) {
                fnBuildCalendar('', '', '{}', isFirstTime);
                dcrJSON2_g = JSON.stringify('{}');
            }
            else {
                dcrJSON2_g = JSON.stringify(result);
                fnBuildCalendar(startDate, endDate, result, isFirstTime);
            }

            if (navigation == 'FROM_PICKER') {
                var dcrCalDate = new Date($("#ddlCalYear").val() + '-' + $("#ddlCalMonth").val() + '-' + $("#ddlCalDay").val());
                var calMonth = new Date(dcrCalDate).getMonth();
                calMonth = parseInt(calMonth) + 1;
                var p = [];
                p.id = $("#ddlCalDay").val() + "-" + calMonth + "-" + $("#ddlCalYear").val();
                fnValidation(p);
            }

            if (navigation == 'FROM_LINK') {
                var dcrCalDate = new Date(curdate_g);
                var calMonth = new Date(dcrCalDate).getMonth();
                calMonth = parseInt(calMonth) + 1;
                var p = [];
                p.id = ((dcrCalDate.getDate() < 10) ? "0" + dcrCalDate.getDate() : dcrCalDate.getDate()) + "-" + calMonth + "-" + dcrCalDate.getFullYear();
                fnValidation(p);
            }

            $.mobile.loading('hide');
        },
        error: function (e) {
            $.mobile.loading('hide');
            $.msgbox('Retrieve the calendar deatils failed.', { type: "error" });
            return false;
        }
    });
    return true;
}

// dcrJSON[5] = TP;
function fnBuildCalendar(startDate, endDate, dcrJSON, isFirstTime) {
    try {
        $.mobile.loading('show');
        dcrJSON_g = dcrJSON;
        if (isFirstTime) {
            fnDCRLockAutomation(endDate);
        }
        if (!isdcrLock_g) {
            var sd = new Date(endDate);
            var daysinmonth = fnDaysInMonth(sd.getMonth() + 1, sd.getFullYear());
            var end = sd.getMonth() + 1 + '/' + daysinmonth + '/' + sd.getFullYear();
            var start = sd.getMonth() + 1 + '/1/' + sd.getFullYear();
            $("#calList").html('<li data-role="list-divider" style="height:30px" role="heading"><div style="float:left;font-size:18px !important"><a href="#" onclick="fnGetPre()" style="color:#fff;margin-right:5px;font-size:21px !important;"><<</a></div><div style="float:left;width:60%;text-align:center"><span id="monthheading">Calendar</span></div><div style="float:right;font-size:18px !important"><a href="#" onclick="fnGetNext()" style="color:#fff;margin-left:5px;font-size:21px !important;">>></a><div></li>');
            for (var i = new Date(start) ; i <= new Date(end) ; i = new Date(new Date(i).setDate(new Date(i).getDate() + 1))) {
                var date = i.getDate().toString().length == 1 ? "0" + i.getDate().toString() : i.getDate();
                var month = i.getMonth() + 1;
                var year = i.getFullYear();
                var datestring = date + '-' + month + '-' + year;
                var WADATA = "";
                var d = i.getMonth() + 1 + '/' + i.getDate() + '/' + i.getFullYear();
                var objlockleave = jsonPath(dcrJSON_g[3].Data, "$.[?(@.start=='" + d + "')]");
                var objTP = jsonPath(dcrJSON_g[5].Data, "$.[?(@.start=='" + d + "')]");
                var objAct = jsonPath(dcrJSON_g[2].Data, "$.[?(@.start=='" + d + "')]");
                var objHoli = jsonPath(dcrJSON_g[4].Data, "$.[?(@.start=='" + d + "')]");
                if (dcrJSON_g[7] != null && dcrJSON_g[7].Data != null) {
                    WADATA = jsonPath(dcrJSON_g[7].Data, "$.[?(@.start=='" + d + "')]");
                }
                var tpstr = objTP ? objTP[0].title + "<br /><br />" : "<br /><br />";
                var actstr = "";
                var lockleave = "";
                var WADATASTR = "";
                var day = weekdaydisplay[new Date(i).getDay()]
                $.each(objAct, function (aindex, avalue) {
                    actstr += avalue.title + "<br /><br />";
                });
                var holistr = "";
                $.each(objHoli, function (hindex, hvalue) {
                    holistr += hvalue.title + "<br /><br />";
                });
                if (objlockleave) {
                    lockleave = objlockleave[0].title + '<br />';
                }
                $.each(WADATA, function (waindex, wavalue) {
                    WADATASTR += wavalue.title + "<br /><br />";
                });

                $("#calList").append('<li data-theme="d"><a href="#"  style="font-weight:normal; font-size:12px;" onclick="fnValidation(this)" id=' + datestring + ' data-transition="slide">' + day + ',&nbsp;' + datestring + '&nbsp;' + tpstr + actstr + holistr + lockleave + WADATASTR + '</a></li>');
            }
            $('#hdnsdate').val(new Date(new Date(start).setDate(new Date(start).getDate() - 1)));
            $('#hdnedate').val(new Date(new Date(end).setDate(new Date(end).getDate() + 1)));
            $("#calList").listview();
            $("#calList").listview("refresh");
            $('#monthheading').html(monthArray[sd.getMonth()] + ' ' + sd.getFullYear().toString());
        }
        else {
            $('#dvCalendar').css('display', 'none');
        }
    }
    catch (e) {
        alert(e.message);
        $.mobile.loading('hide');
    }

}

function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JANUARY") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEBRUARY") {
        return 2;
    }
    if (monthName.toUpperCase() == "MARCH") {
        return 3;
    }
    if (monthName.toUpperCase() == "APRIL") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUNE") {
        return 6;
    }
    if (monthName.toUpperCase() == "JULY") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUGUST") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEPTEMBER") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCTOBER") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOVEMBER") {
        return 11;
    }
    if (monthName.toUpperCase() == "DECEMBER") {
        return 12;
    }
}

function fnDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function fnGetPreviousMonth(monthName) {
    if (monthName.toUpperCase() == "JANUARY") {
        return "DECEMBER"
    }
    if (monthName.toUpperCase() == "FEBRUARY") {
        return "JANUARY";
    }
    if (monthName.toUpperCase() == "MARCH") {
        return "FEBRUARY";
    }
    if (monthName.toUpperCase() == "APRIL") {
        return "MARCH";
    }
    if (monthName.toUpperCase() == "MAY") {
        return "APRIL";
    }
    if (monthName.toUpperCase() == "JUNE") {
        return "MAY";
    }
    if (monthName.toUpperCase() == "JULY") {
        return "JUNE";
    }
    if (monthName.toUpperCase() == "AUGUST") {
        return "JULY";
    }
    if (monthName.toUpperCase() == "SEPTEMBER") {
        return "AUGUST";
    }
    if (monthName.toUpperCase() == "OCTOBER") {
        return "SEPTEMBER";
    }
    if (monthName.toUpperCase() == "NOVEMBER") {
        return "OCTOBER";
    }
    if (monthName.toUpperCase() == "DECEMBER") {
        return "NOVEMBER";
    }
}

function fnGetLeaveEntryMode() {
    var leave_Entry_Mode = "HALF_A_DAY"
    if (dcrJSON_g[1].Data[0].Leave_Entry_Mode != null) {
        leave_Entry_Mode = dcrJSON_g[1].Data[0].Leave_Entry_Mode;
    }
    return leave_Entry_Mode;
}

function GetMonthAndYearFromDate(datevalue) {
    var monthName = monthArray[new Date(datevalue).getMonth()];
    var year = new Date(datevalue).getFullYear();
    return monthName + "-" + year;
}


// Single Date selection method in calendar
function fnCalendarDateSelection() {
    var dcrCalDate = new Date($("#ddlCalYear").val() + '-' + $("#ddlCalMonth").val() + '-' + $("#ddlCalDay").val());
    var isValidDate = fnIsValidDate($("#ddlCalDay").val(), $("#ddlCalMonth").val(), $("#ddlCalYear").val());
    if (isValidDate) {
        var calMonth = new Date(dcrCalDate).getMonth();
        calMonth = parseInt(calMonth) + 1;
        var calYear = parseInt($("#ddlCalYear").val());

        // validate correct date
        if (dcrCalDate == "Invalid Date") {
            fnMsgAlert('error', 'DCR Calendar', 'Please enter valid DCR Date');
            return false;
        }

        if ((calMonth == 4 || calMonth == 6 || calMonth == 9 || calMonth == 11) && $("#ddlCalDay").val() == 31) {
            fnMsgAlert('error', 'DCR Calendar', 'Please enter valid DCR Date.');
            return false;
        }
        if (calMonth == 2) {
            var isleap = (calYear % 4 == 0 && (calYear % 100 != 0 || calYear % 400 == 0));
            if ($("#ddlCalDay").val() > 29 || ($("#ddlCalDay").val() == 29 && !isleap)) {
                fnMsgAlert('error', 'DCR Calendar', 'Please enter valid DCR Date.');
                return false;
            }
        }
        //

        var currentMonth = $.inArray($("#monthheading").html().split(' ')[0], monthArray);
        currentMonth = parseInt(currentMonth) + 1;
        //  if current month, done All validtaions using already loaded data
        if (currentMonth == calMonth) {
            var d = [];
            d.id = $("#ddlCalDay").val() + "-" + calMonth + "-" + $("#ddlCalYear").val();
            fnValidation(d);
        }
            // Else, Load the calendar for selected month and do validation
        else {
            var d = new Date($("#ddlCalMonth").val() + '/' + $("#ddlCalDay").val() + '/' + $("#ddlCalYear").val());
            fnGetDCRDetails(monthArray[new Date(d).getMonth()] + ' ' + new Date(d).getFullYear(), false, 'FROM_PICKER')
        }
    }
    else {
        fnMsgAlert('error', 'DCR Calendar', 'Please choose valid Date.');
        return false;
    }
}


//
function fnIsValidDate(Day, Mn, Yr) {
    var DateVal = Mn + "/" + Day + "/" + Yr;
    var dt = new Date(DateVal);

    if (dt.getDate() != Day) {
        alert('Invalid Date');
        return (false);
    }
    else if (dt.getMonth() != Mn - 1) {
        //this is for the purpose JavaScript starts the month from 0
        return (false);
    }
    else if (dt.getFullYear() != Yr) {
        return (false);
    }

    return (true);
}

function fnAddMonthToDate(d, monthinterval) {
    var dateObj = new Date(d);
    // assume a month have 30 days.
    var dayObj = dateObj.getDate() == 31 ? 30 : dateObj.getDate();
    var monthObj = dateObj.getMonth() + 1;
    var yearObj = dateObj.getFullYear();
    var dateStr = monthObj + "/" + dayObj + "/" + yearObj;
    var ModMonth = monthObj + monthinterval;
    if (ModMonth > 12) {
        ModMonth = 1;
        yearObj = yearObj + 1;
    }

    resultdateStr = ModMonth + "/" + dayObj + "/" + yearObj
    return resultdateStr;
}

function fnGetCountforDCRRestrictDate(d1) {
    var dateCount = 0;
    $.ajax({
        type: 'POST',
        data: "DCR_Date=" + d1,
        url: '/HiDoctor_Activity/DCRCalendar/GetCountforDCRRestrictDate',
        async: false,
        success: function (response) {
            if (response != null) {
                dateCount = response;
            }
        },
        error: function (e) {
            fnMsgAlert('info', 'DCR Calendar', e.responseText)
            return false;
        }
    });
    return dateCount;
}


function fnCheckTPavailable(DCRDate) {
    var dateCount = 0;
    $.ajax({
        type: 'POST',
        data: "DCRDates=" + DCRDate + "^",
        url: '/HiDoctor_Activity/DCRCalendar/CheckTPAvailableForSelectedDCRDates',
        async: false,
        success: function (response) {

            if (response != null) {
                dateCount = response.length;
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'DCR Calendar', e.responseText)
            return false;
        }
    });
    return dateCount;
}