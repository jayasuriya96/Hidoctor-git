var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
var weekdayFullName = ["Sunday", "Monday", "Tuseday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthArray = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
var lockLeaveData_g = new Array();
var userName_g = $('#spnUser').html().split(',')[0];
var g_DCR_Date = "", l_flag = "";
function fnSetDCROptions() {
    debugger;

    var defaultOptions = "Attendance,Field,Leave,Field_RCPA";
    var dcrOptions = fnGetPrivilegeValue("DCR_ENTRY_OPTIONS", defaultOptions);

    var dcrOptionsArr = dcrOptions.split(',');
    var dcrOptionsHTML = "";
    for (var i = 0; i < dcrOptionsArr.length; i++) {
        if (isPayRollIntegrated_g && dcrOptionsArr[i].toUpperCase() == "LEAVE") {
            continue;
        }
        if (i == 0) {
            dcrOptionsHTML += '<span id=' + dcrOptionsArr[i] + ' class="fc-button fc-button-month fc-state-default fc-corner-left fc-state-active" onclick="fnSetActiveClass(this)">';
        }
        else {
            dcrOptionsHTML += '<span id=' + dcrOptionsArr[i] + '  class="fc-button fc-button-month fc-state-default fc-corner-left" onclick="fnSetActiveClass(this)">';
        }
        dcrOptionsHTML += ' <span class="fc-button-inner"><span class="fc-button-content">' + dcrOptionsArr[i] + '</span><span class="fc-button-effect"><span></span>';
        dcrOptionsHTML += '</span></span></span>';
    }
    $('#dvControls').html(dcrOptionsHTML);
}

function fnSetActiveClass(ctl) {
    debugger;
    $('.fc-state-active').removeClass('fc-state-active');
    $(ctl).addClass('fc-state-active');
}

function fnCheckTPLock() {
    debugger;

    var dcrLockAutomation = fnGetPrivilegeValue("DCR_LOCK_AUTOMATION", "NO");
    if (dcrLockAutomation.toUpperCase() == "DCR_LOCK_IDLE" || dcrLockAutomation.toUpperCase() == "DCR_LOCK_LEAVE") {
        var tpLockDays = fnGetPrivilegeValue("TP_LOCK_DAY", "0");
        if (parseInt(tpLockDays) > 0) {
            _isTPDefineforNextmonth = dcrJSON_g[1].Data[0].IsTPDefineNextMonth;
            if (parseInt(tpLockDays) < parseInt(curdate_g.split('/')[1], 10)) {
                if (_isTPDefineforNextmonth == "0") {
                    if (dcrJSON_g[0].Data.length > 0 && dcrJSON_g[0].Data[dcrJSON_g[0].Data.length - 1].LockStatus != null && dcrJSON_g[0].Data[dcrJSON_g[0].Data.length - 1].LockStatus == "LOCKED") {
                        var tpMonthDate = fnAddMonthToDate(curdate_g, 1);
                        var tpmonthandYear = GetMonthAndYearFromDate(tpMonthDate);
                        isdcrLock_g = true;
                        fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been Locked, since you failed to enter the TP for ' + tpmonthandYear + '.');
                        //fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been locked, Since you have failed to define TP for the' + tpmonthandYear + '.');
                        return false;
                    }
                    else {
                        return fnInsertDCRLockIdle('', 'TP', '');
                    }
                }
            }
        }
        return true;
    }
}

function fnGetMissedDCRDate() {
    var sequentialDCREntry = fnGetPrivilegeValue("SEQUENTIAL_DCR_ENTRY", "YES");
    var year = new Date(curdate_g).getFullYear();
    var month = new Date(curdate_g).getMonth();
    var misseddate = '';

    if (sequentialDCREntry.toUpperCase().indexOf('MONTH_CHECK') != -1) {
        var preMonth;
        var preyear;
        if (month == 0) {
            preMonth = 11;
            preyear = year - 1;
        }
        else {
            preMonth = month - 1;
            preyear = year
        }

        // Convert to date string date object. So we plus 1 in the month variable. This is tested.(
        misseddate = new Date(preyear + '/' + (preMonth + 1) + '/' + '01');
    }
    else {
        // Convert to date string date object. So we plus 1 in the month variable. This is tested.
        misseddate = new Date(year + '/' + (month + 1) + '/' + '01');
    }

    // Set HiDoctor Start Date as missed date.
    if (fnGetDateDifference(new Date(dcrJSON_g[1].Data[0].HidoctorStartDate), misseddate) < 0) {
        misseddate = new Date(dcrJSON_g[1].Data[0].HidoctorStartDate);
    }

    // dindex = new Date(new Date(dindex).setDate(new Date(dindex).getDate() + 1))
    for (var dindex = misseddate; misseddate <= new Date(curdate_g) ; dindex = new Date(new Date(dindex).setDate(new Date(dindex).getDate() + 1))) {
        //for (var dindex = misseddate; misseddate <= new Date(curdate_g); dindex.setTime(dindex.getTime() + 1 * 24 * 60 * 60 * 1000)) {
        var y = dindex.getFullYear();
        var m = dindex.getMonth() + 1;
        var d = dindex.getDate();
        var dcrMaster = false;

        /*if (dcrJSON_g[2].Data.length > 0) {
            dcrMaster = jsonPath(dcrJSON_g[2].Data, "$.[?(@.year=='" + y + "'&@.month=='" + m + "'&@.day=='" + d + "')]");
            if (dcrMaster) {
                continue;
            }
        }*/
        var dcrHoliday = false;
        if (dcrJSON_g[4].Data.length > 0) {
            dcrHoliday = jsonPath(dcrJSON_g[4].Data, "$.[?(@.year=='" + y + "' & @.month=='" + m + "' & @.day=='" + d + "')]");
            if (dcrHoliday) {
                continue;
            }
        }
        var mo = m.toString().length == 1 ? "0" + m : m;
        var da = d.toString().length == 1 ? "0" + d : d;
        date = y + '-' + mo + '-' + da;
        var weekend = jsonPath(dcrJSON_g[8].Data, "$.[?(@.Weekend_Date=='" + date + "')]");
        if (weekend) {
            continue;
        }
        return dindex;
    }
}

function fnDCRLockAutomation() {
    debugger;
    if (dcrJSON_g != null && dcrJSON_g.length > 0 && dcrJSON_g[0].Data.length > 0) {
        DCRactdate = dcrJSON_g[0].Data[0].DCR_Actual_Date;
        if (dcrJSON_g[0].Data[0].LockType.toUpperCase() == "IDLE_DCR") {
            fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been Locked, since you failed to enter the DCR for ' + DCRactdate + '.');
            //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ' <br />Your DCR has been locked, Since you have failed to enter DCR.');
            isdcrLock_g = true;
            return false;

        }
        else if (dcrJSON_g[0].Data[0].LockType.toUpperCase() == "TP_UNAVAILABILITY") {
            var month = dcrJSON_g[0].Data[0].TP_Define_Month;
            var year = dcrJSON_g[0].Data[0].TP_Define_Year
            var monthName = monthArray[month - 1];
            fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been Locked, since you failed to enter TP for ' + monthName + ' - ' + year);
            //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ' <br />Your DCR has been locked, Since you have failed to define TP for ' + monthName + ' - ' + year);
            isdcrLock_g = true;
            return false;

        }
        else if (dcrJSON_g[0].Data[0].LockType.toUpperCase() == "TP_APPROVAL_LOCK") {
            var month = dcrJSON_g[0].Data[0].TP_Approval_Month;
            var year = dcrJSON_g[0].Data[0].TP_Approval_Year
            var curMonth = new Date(curdate_g).getMonth() + 1;
            var curYear = new Date(curdate_g).getFullYear();

            if (parseInt(month) <= curMonth && parseInt(year) <= curYear) {
                var monthName = monthArray[month - 1];
                fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been Locked, since your ' + monthName + "-" + year + ' TP is yet to be approved');
                //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ' <br />Your DCR has been locked, Your TPs are not Approved for the Month.' + monthName + "-" + year);
                isdcrLock_g = true;
                return false;
            }
        }

    }
    debugger;
    if (dcrJSON_g[9] != undefined) {
        if (dcrJSON_g[9].Data[0].SS_Applied_Lock == "1") {
            var SS_Month = fngetMonthNumberFromArray(dcrJSON_g[9].Data[0].Previous_Month_Year.substring(3, 5));
            var SS_Year = dcrJSON_g[9].Data[0].Previous_Month_Year.substring(6, 10);
            //fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been Locked, since you failed to enter the Secondary Sales for ' + SS_Month + "-" + SS_Year);
            ////fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ' <br />Your DCR has been locked,Since you did not enter Secondary sales for the Month' + SS_Month + "-" + SS_Year);
            
            var result = fngetlockedstockiestname(dcrJSON_g[9].Data[0].SS_Id, SS_Month, SS_Year);
            if(result==true)
            {
                isdcrLock_g = true;
                return false;
            }
        }
    }

    //// Retirieve the Lock Automation, Lock Entry Days and Lock Release Days Privilege.
    //var dcrLockAutomation = fnGetPrivilegeValue("DCR_LOCK_AUTOMATION", "NO");
    //var dcrLockEntryDays = fnGetPrivilegeValue("DCR_LOCK_ENTRY_DAYS", "-1");
    //var dcrLockEntryDaysNumeric = parseInt(dcrLockEntryDays);
    //var dcrLockReleaseDays = fnGetPrivilegeValue("DCR_LOCK_RELEASE_DAYS", "0");
    //var isRegionLock = dcrJSON_g[1].Data[0].IsRegionLock;
    //fnGetMissedDCRDate();
    dcrJSON_g[1].Data[0].MissedDCRDate = fnGetMissedDCRDate();
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


function fnGetDateDifference(d1, d2) {
    return (d2 - d1) / 1000 / 60 / 60 / 24;
}

function fnValidation(d) {
    debugger;

    var dcrJSON3_g = eval('(' + dcrJSON2_g + ')');
    // Retrieve the user selected option.
    var selectedOption = fnUserSelectedOption();
    selectedOption = selectedOption.indexOf('RCPA') != -1 ? "FIELD" : selectedOption;
    // Future date validation.

    var leavepriv = fnGetPrivilegeValue("FUTURE_LEAVE_ALLOW_IN_DCR", "YES");
    if (leavepriv == 'YES') {
        if (d > new Date(curdate_g) && selectedOption != "LEAVE") {
            fnMsgAlert('info', 'DCR', 'You are not allowed to enter ' + selectedOption + ' activity for the future date.');
            //fnMsgAlert('info', 'DCR', 'Dear ' + userName_g + ' <br />Since the selected date is a future date, you are not allowed to enter DCR.');
            return false;
        }
    } else {
        if (d > new Date(curdate_g)) {
            fnMsgAlert('info', 'DCR', 'You are not allowed to enter Leave Activity for the future date.');
            // fnMsgAlert('info', 'DCR', 'Dear ' + userName_g + ' <br />Since the selected date is a future date, you are not allowed to enter DCR.');
            return false;
        }
    }

    // set the user selected date.
    var m = d.getMonth() + 1;
    var y = d.getFullYear();
    var d1 = d.getDate();
    var selectedDate = m + "/" + d1 + "/" + y;
    var msgSelectedDate = d1 + "/" + m + "/" + y;
    //var selectedDate = d1 + "/" + m + "/" + y;

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
                fnMsgAlert('info', 'DCR Calendar', "Dear " + userName_g + "<br />You are a WideAngle user. Please enter your Field/Attendance activity in WideAngle. If you wish to enter DCR directly in Web/Mobile, please contact your administrator.")
                return false;
            }
        }

    }

    ////Manual Lock Check
    //if (dcrJSON3_g[0].Data[0].Lock_Reason == 'MANUAL_LOCK') {
    //    debugger;
    //    var lockReasonName = dcrJSON3_g[0].Data[0].Reason;
    //    debugger
    //    if (lockLeaveData_g.length > 0) {
    //        var lockleavedate = selectedDate.split('/')[0].length == 1 ? "0" + selectedDate.split('/')[0] + '/' + selectedDate.split('/')[1] + '/' + selectedDate.split('/')[2] : selectedDate;
    //        var dcrLockLeaveData = jsonPath(lockLeaveData_g, "$.[?(@.date=='" + lockleavedate + "')]");
    //        if (dcrLockLeaveData != "false" && dcrLockLeaveData.length > 0) {
    //            fnMsgAlert('info', 'DCR', 'Your DCR has been Locked, due to the following reason :' + lockReasonName + '.');
    //            return false;
    //        }
    //    }
    //}
    //else {
    // var dcrLockAutomation = fnGetPrivilegeValue("DCR_LOCK_AUTOMATION", "NO");
    var lockReasonName = fnGetPrivilegeValue('LOCK_REASON_NAME', 'Lock Leave');
    //if (dcrLockAutomation == "DCR_LOCK_LEAVE") {
    if (lockLeaveData_g.length > 0) {
        var lockleavedate = selectedDate.split('/')[0].length == 1 ? "0" + selectedDate.split('/')[0] + '/' + selectedDate.split('/')[1] + '/' + selectedDate.split('/')[2] : selectedDate;
        var dcrLockLeaveData = jsonPath(lockLeaveData_g, "$.[?(@.date=='" + lockleavedate + "')]");
        if (dcrLockLeaveData != "false" && dcrLockLeaveData.length > 0) {
            DCRactdate = dcrJSON_g[0].Data[0].DCR_Actual_Date;
            fnMsgAlert('info', 'DCR', 'Your DCR has been Locked, since you failed to enter the DCR for ' + DCRactdate);
            //fnMsgAlert('info', 'DCR', 'Dear ' + userName_g + ', <br />You have applied ' + lockReasonName + ' for this date, and it is approved.');
            //$.msgbox('You have applied ' + lockReasonName + ' for this date, and it is approved.', { type: "info" });
            return false;
        }
    }

    var dcrLockLeaveData = jsonPath(dcrJSON3_g[3].Data, "$.[?(@.start=='" + selectedDate + "')]"); 
    if (dcrLockLeaveData != "false" && dcrLockLeaveData.length > 0 && dcrLockLeaveData[0].title.split('-')[1].toUpperCase() == 'RELEASED' && dcrLockLeaveData[0].LeaveType == '1'&&selectedOption != "LEAVE"){
   
       
            fnMsgAlert('info', 'DCR', 'You can apply only leave for this date');
      
        return false;
       
        }
   
        
 
    //else{
    //if (dcrLockLeaveData != "false" && dcrLockLeaveData.length > 0 && !(dcrLockLeaveData[0].title.split('-')[1].toUpperCase() == 'UN APPROVED')) {
    if (dcrLockLeaveData != "false" && dcrLockLeaveData.length > 0 && !(dcrLockLeaveData[0].title.split('-')[1].toUpperCase() == 'RELEASED')) {
        if (dcrJSON3_g[0].Data.length > 0) {
            if (dcrJSON3_g[0].Data[0].Lock_Reason == 'MANUAL_LOCK' && selectedDate == dcrJSON3_g[0].Data[0].DCR_Actual_Date) {
                var lockReasonName = dcrJSON3_g[0].Data[0].Reason;
                if (lockReasonName != '') {
                    fnMsgAlert('info', 'DCR', 'Your DCR has been Locked, due to the following reason : ' + lockReasonName + '.');
                }
                else {
                    fnMsgAlert('info', 'DCR', 'Your DCR has been Locked by your manager.');
                }
            }
            else {
                fnMsgAlert('info', 'DCR', 'Your DCR has been Locked, due to the following reason : ' + lockReasonName + '.');
                // fnMsgAlert('info', 'DCR', 'You have applied ' + lockReasonName + ' for this date, and it is approved.');
            }

        }
        else {
            if (lockReasonName != '' && dcrJSON3_g[0].Data.length > 0) {
                fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been Locked, since you failed to enter the DCR for ' + dcrJSON_g[0].Data[0].DCR_Actual_Date + '.');
                //fnMsgAlert('info', 'DCR', 'Your DCR has been Locked, due to the following reason : ' + lockReasonName + '.');
            }
            else {
                fnMsgAlert('info', 'DCR', 'Your DCR has been Locked, since you failed to enter the DCR. ');
            }
        }
        //$.msgbox('You have applied ' + lockReasonName + ' for this date, and it is approved.', { type: "info" });
        return false;
    }
    //}
    //}

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
                        var Remarks = dcrJSON_g[6].Data[i].UnapproveReason;
                        Remarks = Remarks.split('~');
                        Remarks = Remarks[Remarks.length - 1];
                        Remarks = Remarks.split('^');
                        fnMsgAlert('info', 'DCR', "Your DCR - " + dcrJSON_g[6].Data[i].Flag + " has been Locked, since it has been Un-Approved by your Superior for the following reason : " + Remarks[0] + ". Kindly contact your Head office for further assistance");
                        // fnMsgAlert('info', 'DCR', "Dear " + userName_g + " <br /> Your DCR has been locked. Please contact your head office for further assistance. Your manager has unapproved your DCR - " + dcrJSON_g[6].Data[i].Flag + " activity for this day. Reason for unapproval is as follows: " + dcrJSON_g[6].Data[i].UnapproveReason);
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
        if (fnGetDateDifference(dcrJSON_g[2].Data[i]._start, new Date(selectedDate)) == 0) {
            if (dcrJSON_g[2].Data[i].title.split(' ')[0].toUpperCase() != selectedOption.toUpperCase() && dcrJSON_g[2].Data[i].title.split(' ')[0].toUpperCase().indexOf('WA') == -1) {
                if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPLIED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT") {
                    entryCount++;
                }
            }
        }
    }
    for (var i = 0; i < dcrJSON_g[4].Data.length; i++) {
        if (fnGetDateDifference(dcrJSON_g[4].Data[i]._start, new Date(selectedDate)) == 0) {
            entryCount++;
        }
    }

    if (entryCount >= 2) {
        //$.msgbox('You can enter maximum of two entries for a date.', { type: "info" });
        fnMsgAlert('info', 'DCR Calendar', 'You can enter maximum of two entries for a date.');
        //alert("You have already entred two entries for this date.");
        return false;
    }

    var status = "";
    // Applied and Approved Validation.
    for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
        if (fnGetDateDifference(new Date(selectedDate), new Date(dcrJSON_g[2].Data[i]._start)) == 0) {
            if (selectedOption == dcrJSON_g[2].Data[i].title.split(' ')[0].toUpperCase()) {
                if (dcrJSON_g[2].Data[i].title.split(' ').length > 1 && dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "UNAPPROVED") {
                    // leave unapprove comes from grytip.
                    if (selectedOption.toUpperCase() == "LEAVE") {
                        if (dcrJSON_g[2].Data[i].title.split(' ').length > 2
                            && dcrJSON_g[2].Data[i].title.split(' ')[2].indexOf("(") > -1) {
                            fnMsgAlert("info", "DCR Calendar", "Your Leave is unapproved from Payroll system.Now you can't access Payroll system. Please contact your administrator.");
                            return false;
                        }
                    }
                    status = 0;
                    break;
                }
                if (dcrJSON_g[2].Data[i].title.split(' ').length > 1 && dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT") {
                    status = 3;
                    break
                }
                if (dcrJSON_g[2].Data[i].title.split(' ').length > 1 && dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase().indexOf("APPLIED") > -1) {
                    fnMsgAlert('info', 'DCR Calendar', 'You have already entered ' + selectedOption + ' for this date'); // 'You are not eligible to enter ' + selectedOption + ', since there is already an existing activity in Applied Status.');
                    //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ', <br />You have already applied ' + selectedOption + ' for this date.');
                    return false;
                }
                if (dcrJSON_g[2].Data[i].title.split(' ').length > 1 && dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase().indexOf("APPROVED") > -1) {
                    fnMsgAlert('info', 'DCR Calendar', 'You have already entered ' + selectedOption + ' for this date'); // 'You are not eligible to enter ' + selectedOption + ', since there is already an existing activity in Approved Status.');
                    //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ', <br />You have already entered ' + selectedOption + ' for this date and it is approved.');
                    return false;
                }
            }
        }
    }

    //Check activity per day
    if (singleActivityperday_g.toUpperCase() == 'SINGLE') {
        debugger;
        if (entryCount == '1') {
            for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                if (fnGetDateDifference(dcrJSON_g[2].Data[i]._start, new Date(selectedDate)) == 0) {

                    if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPLIED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "UNAPPROVED") {
                        //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ' <br />You can not enter another activity for this date.');
                        fnMsgAlert('info', 'DCR Calendar', 'You cannot enter one more Activity, since there is already an existing activity in Drafted / Applied / Approved Status.');
                        return false;
                    }
                }
            }
        }
    }

    if (singleActivityperday_g.toUpperCase() == 'RESTRICTED') {
        debugger;
        if (entryCount == '1') {
            for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                if (fnGetDateDifference(dcrJSON_g[2].Data[i]._start, new Date(selectedDate)) == 0) {
                    if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED") {
                        //  fnMsgAlert('info', 'DCR Calendar', 'Your DCR for this date (' + msgSelectedDate + ')is in approved mode, to apply another DCR for this day, request your manager to unapprove the first DCR.');
                        fnMsgAlert('info', 'DCR Calendar', 'You are not eligible to enter ' + selectedOption + ', since there is already an Existing Activity in Approved Status.');
                        return false;
                    }
                }
            }
        }
    }

    if (singleActivityperday_g.toUpperCase() == 'RESTRICTED' || singleActivityperday_g.toUpperCase() == 'MULTIPLE') {
        debugger;
        if (leaveentrymode_g.toUpperCase() == 'FULL_DAY') {
            if (entryCount == '1') {
                for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                    if (fnGetDateDifference(dcrJSON_g[2].Data[i]._start, new Date(selectedDate)) == 0) {
                        if (selectedOption.toUpperCase() == "LEAVE") {
                            if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPLIED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "APPROVED" || dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT") {
                                if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT") {
                                    fnMsgAlert('info', 'DCR Calendar', 'Your DCR for this date (' + msgSelectedDate + ')is in Draft mode, You Can not to apply a leave for this day.');
                                    return false;
                                }
                                else {
                                    fnMsgAlert('info', 'DCR Calendar', 'Your DCR for this date (' + msgSelectedDate + ')is in applied/approved mode, to apply a leave for this day, request your manager to unapprove the first DCR.');
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (leaveentrymode_g.toUpperCase() == 'FULL_DAY') {
        debugger;
        if (entryCount == '1') {
            for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                if (fnGetDateDifference(dcrJSON_g[2].Data[i]._start, new Date(selectedDate)) == 0) {
                    if (dcrJSON_g[2].Data[i].title.toUpperCase() == "LEAVE APPLIED" || dcrJSON_g[2].Data[i].title.toUpperCase() == "LEAVE APPROVED") {
                        fnMsgAlert('info', 'DCR Calendar', 'You are not eligible to enter Field / Attendance Activity, since there is already a Leave Entry Available.');
                        // fnMsgAlert('info', 'DCR Calendar', 'Since, you have applied or approved Leave for this day, you cannot apply any other activity(s).');
                        return false;
                    }
                }
            }//alert("No Leave applied");
        }
    }

    var tp = jsonPath(dcrJSON3_g[5].Data, "$.[?(@.start=='" + selectedDate + "')]");
    if (tp.toString() != "false") {
        var dcrMaster = jsonPath(dcrJSON3_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");
        if (dcrMaster.toString() == "false") {
            if (tp[0].className.toUpperCase() != fnUserSelectedOption().toUpperCase()) {
                if (!confirm('Call objective of this date is ' + tp[0].className.toUpperCase() + ' and you are trying to enter ' + fnUserSelectedOption().toUpperCase() + '. Still do you wish to continue?')) {
                    return false;
                }
            }
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
        //if (dcrJSON[2].Data[i].title.split(' ')[0].toUpperCase() == "LEAVE") {
        //    var leave_Entry_Mode = fnGetLeaveEntryMode();
        //    if (leave_Entry_Mode.toUpperCase() == "HALF_A_DAY" && dcrJSON[2].Data[i].title.split(' ')[0].length > 1 && dcrJSON[2].Data[i].title.split(' ')[0].toUpperCase() != "UNAPPROVED") {
        //        fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ', <br />You have ' + jsonSelectedDate[0].title.split(' ')[1] + ' ' + jsonSelectedDate[0].title.split(' ')[0] + ' for this day,since you cannot apply any other activity(s).');
        //        //alert("No Leave applied");
        //        return false;
        //    }
        //}
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


        //if (holidayData != null && holidayData.length > 0) {
        //    fnMsgAlert('info', 'DCR Calendar', 'You cannot enter Leave on a Holiday / Weekend.');
        //    //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ', <br /> selected data is holiday, You will not be able to apply leave for this date.');
        //    return false;
        //}
        //else if (weekend) {
        //    var day = weekdayFullName[new Date(selectedDate).getDay()];
        //    fnMsgAlert('info', 'DCR Calendar', 'You cannot enter Leave on a Holiday / Weekend.');
        //    // fnMsgAlert('info', 'DCR Calendar', 'Dear User selected data is weekend off day (' + day + '), You will not be able to apply leave for this date.');
        //    return false;
        //}
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
            if (leave_Entry_Mode.toUpperCase() == "FULL_DAY" && data[0].title.split(' ').length > 1) {
                if (data[0].title.split(' ')[1].toUpperCase() == "APPLIED" || data[0].title.split(' ')[1].toUpperCase() == "APPROVED") {
                    fnMsgAlert('info', 'DCR Calendar', 'You are not eligible to enter any other Activity, since there is already an Existing Activity Available.');
                    //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ', <br />Since, you have applied or approved ' + data[0].title.split(' ')[0] + ' for this day, you cannot apply any other activity(s).');
                    return false;
                } //alert("No Leave applied");               
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

    // if WA data 

    var dcrMaster = jsonPath(dcrJSON3_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");
    if (dcrMaster.toString() != "false" && dcrMaster.length > 0) {
        for (var i = 0; i < dcrMaster.length; i++) {
            if (dcrMaster[i].title.split(' ')[0].toUpperCase() != selectedOption) {
                if (dcrMaster[i].title.split(' ')[0].toUpperCase() == "LEAVE" && dcrMaster[i].title.split(' ').length > 1 && dcrMaster[i].title.split(' ')[1].toUpperCase() != "UNAPPROVED") {
                    var leave_Entry_Mode = fnGetLeaveEntryMode();
                    if (leave_Entry_Mode.toUpperCase() == "FULL_DAY") {
                        fnMsgAlert('info', 'DCR Calendar', 'You are not eligible to enter Field / Attendance Activity, since there is already a Leave Entry Available.');
                        //fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ', <br />Since, you have applied or approved ' + dcrMaster[i].title.split(' ')[0].toUpperCase() + ' for this day, you cannot apply any other activity(s).');
                        return false;
                    }
                    //else {
                    //    // Grey Tip integration, Grey Tip leave Activity Count. if activity count is 1, no other activities al lowed.
                    //    if (dcrMaster[i].Activity_Count == "1") {
                    //        fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ', <br />Since, you have applied or approved ' + dcrMaster[i].title.split(' ')[0].toUpperCase() + ' for this day, you cannot apply any other activity(s).');
                    //        return false;
                    //    }
                    //}
                }
            }
            if (dcrMaster[i].title.split(' ')[0].toUpperCase().indexOf("WA") == -1 && dcrMaster[i].title.split(' ')[0].toUpperCase() != selectedOption && dcrMaster[i].title.split(' ').length > 1 && dcrMaster[i].title.split(' ')[1].length > 0) {
                if (!fnSelectedOptionsIsthereInMaster(dcrMaster, selectedOption))
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
            if (!confirm('Would you like to enter DCR on Holiday / Weekend?')) {
                //if (!confirm('The selected date is holiday. Do you wish to enter ' + selectedOption + '?')) {
                return false;
            }
        }
    }
    if (weekend) {
        var dcrMaster = jsonPath(dcrJSON3_g[2].Data, "$.[?(@.start=='" + selectedDate + "')]");
        if (dcrMaster.toString() == "false") {
            var day = weekdayFullName[new Date(selectedDate).getDay()];
            var confirmResult = confirm('Would you like to enter DCR on Holiday / Weekend?')
            //var confirmResult = confirm('The selected date is weekend off day (' + day + '). Do you wish to enter ' + selectedOption + '?')
            if (!confirmResult) {
                return false;
            }
        }
    }


    var sequentialDCREntry = fnGetPrivilegeValue("SEQUENTIAL_DCR_ENTRY", "YES");

    if (sequentialDCREntry != "NO") {
        debugger;
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
            debugger;
            for (var dateIndex = new Date(startDate) ; dateIndex < d; dateIndex = new Date(new Date(dateIndex).setDate(new Date(dateIndex).getDate() + 1))) {
                var y = dateIndex.getFullYear();
                var m = dateIndex.getMonth();
                var da = dateIndex.getDate();
                var dcrMaster = false;
                // DCR Master.
                //var date1=

                var dcrMaster = jsonPath(dcrJSON3_g[3].Data, "$.[?(@.month=='" + (m + 1) + "' & @.year=='" + y + "' & @.day=='" + da + "'& @.DCR_Lock_Status !='Released' )]");

                // Grey tip integartion.
                if (dcrMaster != null && dcrMaster) {
                    for (var a = 0; a < dcrMaster.length; a++) {
                        if (dcrMaster[a].title.split(' ')[0].toUpperCase() == "LEAVE" && dcrMaster[a].Activity_Count == "0.5") {
                            var date1 = fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                            fnMsgAlert('info', 'DCR Calendar', 'Activity for ' + date1 + ' is missing(Half a day). Please enter an activity for that date');
                            return false;
                        }
                    }
                }

                for (var i = 0; i < dcrJSON_g[2].Data.length; i++) {
                    if (fnGetDateDifference(dcrJSON_g[2].Data[i]._start, new Date(dateIndex)) == 0) {
                        dcrMaster = true;
                        break;
                    }
                }



                var dcrLockLeave = false;
                for (var i = 0; i < dcrJSON_g[3].Data.length; i++) {
                    if (fnGetDateDifference(dcrJSON_g[3].Data[i]._start, new Date(dateIndex)) == 0 && dcrJSON_g[3].Data[i].DCR_Lock_Status != 'Released') {
                        dcrLockLeave = true;
                        break;
                    }
                }

                // DCR Holiday.
                var dcrHoliday = false;
                for (var i = 0; i < dcrJSON_g[4].Data.length; i++) {
                    if (fnGetDateDifference(dcrJSON_g[4].Data[i]._start, new Date(dateIndex)) == 0) {
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

                debugger;
                if (!dcrMaster && !dcrHoliday && !dcrLockLeave) {
                    var date1 = fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                    //$.msgbox('Activity for ' + date1 + ' is missing. Please enter an activity for that date', { type: "info" });
                    fnMsgAlert('info', 'DCR Calendar', 'DCR is missing for the ' + date1 + '. Kindly fill the DCR for the same to proceed further.');
                    //alert("Please enter the a activity for date:" + new Date(dateIndex));
                    return false;
                }
            }
        }

        if (sequentialDCREntry.toUpperCase().indexOf('DRAFTED') != -1) {

            var month = d.getMonth() + 1;
            var year = d.getFullYear();
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
                    if (fnGetDateDifference(dcrJSON_g[2].Data[i]._start, new Date(dateIndex)) == 0) {
                        if (dcrJSON_g[3].Data != null) {
                            for (var j = 0; j < dcrJSON_g[3].Data.length; j++) {
                                if (fnGetDateDifference(dcrJSON_g[3].Data[j]._start, new Date(dateIndex)) == 0) {
                                    if (dcrJSON_g[3].Data[j].title.toUpperCase().split('-')[1] != "UN APPROVED") {
                                        unpaidleavefordraftentry = true;
                                    }
                                    break;
                                }
                            }
                        }
                        //if (selectedOption == dcrJSON_g[2].Data[i].title.split(' ')[0].toUpperCase()) 
                        //{
                        if (!unpaidleavefordraftentry) {
                            if (dcrJSON_g[2].Data[i].title.split(' ')[1].toUpperCase() == "DRAFT") {
                                var date1 = fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                                fnMsgAlert('info', 'DCR Calendar', 'DCR is in Draft Status for the ' + date1 + '. Kindly complete the DCR to proceed further.');
                                // fnMsgAlert('info', 'DCR Calendar', 'Dear ' + userName_g + ', <br />The DCR entry of ' + date1 + ' is in draft status. Please submit the DCR of that date.');
                                //alert('Previous date is drafted.' + new Date(dateIndex));
                                return false;
                            }
                        }
                        // }
                    }
                }

            }
        }


        // Unapproved DCR Check.
        if (unApprovedDCRCheck_g == "YES") {
            debugger;
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            //startDate = month + "/" + "01" + "/" + year;
            if (fnGetDateDifference(new Date(dcrJSON_g[1].Data[0].HidoctorStartDate), new Date(startDate)) < 0) {
                startDate = dcrJSON_g[1].Data[0].HidoctorStartDate;
            }
            var selectedOption = fnUserSelectedOption();
            selectedOption = selectedOption.indexOf('RCPA') != -1 ? "FIELD" : selectedOption;

            for (var dateIndex = new Date(startDate) ; dateIndex < d; dateIndex = new Date(new Date(dateIndex).setDate(new Date(dateIndex).getDate() + 1))) {
                debugger;
                var y = dateIndex.getFullYear();
                var m = dateIndex.getMonth();
                var da = dateIndex.getDate();
                var dcrMaster = false;
                var unpaidleavefordraftentry = false;
                var chkUnApproverStatus = false;
                var isCheckApproveApplied = true;
                // DCR Master.
                var mn = 0;
                for (var k = 0; k < dcrJSON_g[2].Data.length; k++) {
                    mn = k;
                    if (fnGetDateDifference(dcrJSON_g[2].Data[k]._start, new Date(dateIndex)) == 0) {
                        if (dcrJSON_g[3].Data != null) {
                            for (var l = 0; l < dcrJSON_g[3].Data.length; l++) {
                                if (fnGetDateDifference(dcrJSON_g[3].Data[l]._start, new Date(dateIndex)) == 0) {
                                    if (dcrJSON_g[3].Data[l].title.toUpperCase().split('-')[1] != "UN APPROVED") {
                                        unpaidleavefordraftentry = true;
                                    }
                                    break;
                                }
                            }
                        }

                        if (!unpaidleavefordraftentry) {
                            if (dcrJSON_g[2].Data[k].title.split(' ')[1].toUpperCase() == "UNAPPROVED" && isCheckApproveApplied && dcrJSON_g[2].Data[mn].Record_Status == "0") {
                                chkUnApproverStatus = true;
                            }
                            else if (dcrJSON_g[2].Data[k].title.split(' ')[1].toUpperCase() == "DRAFT" && isCheckApproveApplied) {
                                for (var unA = 0; unA < dcrJSON_g[2].Data.length; unA++) {
                                    var draftDay = dcrJSON_g[2].Data[k].day;
                                    var chkDay = dcrJSON_g[2].Data[unA].day;
                                    if (dcrJSON_g[2].Data[k].title.split(' ')[1].toUpperCase() == "DRAFT" && dcrJSON_g[2].Data[unA].title.split(' ')[1].toUpperCase() == "UNAPPROVED" && draftDay == chkDay) {
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


                    debugger;
                    if (chkUnApproverStatus && dcrJSON_g[2].Data[mn].Record_Status == "0") {
                        var date1 = fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                        fnMsgAlert('info', 'dcr calendar', 'kindly re-submit the un-approved dcr for ' + date1 + 'to proceed further.');
                        //fnmsgalert('info', 'dcr calendar', 'dear ' + username_g + ', <br />the dcr entry of ' + date1 + ' is in unapproved status. please submit the dcr of that date.');
                        return false;
                    }
                }
            }
        }
    }


    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var date = d.getDate();
    month = month.toString().length == 1 ? "0" + month : month;
    date = date.toString().length == 1 ? "0" + date : date;
    //dcrDate = year + "-" + month + "-" + date;
    g_DCR_Date = year + "-" + month + "-" + date;
    l_flag = fnUserSelectedOption();
    debugger;
    $.ajax({
        type: "GET",
        data: 'dcrDate=' + g_DCR_Date + '&flag=' + l_flag,
        url:'../HiDoctor_Activity/DCRCalendar/GetDCREntryBasedOnPrivilege',
        success: function (result) {
            debugger;
            if(result == "1"){
                fnNavigationtoScreens(status, g_DCR_Date);
            }
            else {
                fnMsgAlert('info', 'Info', 'You cannot enter ' + l_flag.toUpperCase() + ' type DCR since you have already applied leave for day before, selected date and day after');
                return false;
            }
        }
    });
    //fnNavigationtoScreens(status, dcrDate);
}

function fnUserSelectedOption() {
    var defaultOptions = "Attendance,Field,Leave,Field_RCPA";
    var dcrOptions = fnGetPrivilegeValue("DCR_ENTRY_OPTIONS", defaultOptions);
    var dcrOptionsArr = dcrOptions.split(',');
    for (var i = 0; i < dcrOptionsArr.length; i++) {
        if ($('#' + dcrOptionsArr[i]).hasClass('fc-state-active')) {
            return dcrOptionsArr[i].toUpperCase();
        }
    }
}

function fnNavigationtoScreens(status, dcrDate) {
    var flag = fnUserSelectedOption();
    var redirectHeader = "";

    if (dcrJSON_g[1].Data[0].Is_WA_User == 'Y') {// if wa user redirect to dcrv4 header
        if (recon_Status.toString() == "0") {
            fnMsgAlert('info', 'DCR Calendar', "Your Recon Form is in applied/approved status for the  month. You Cant Enter the DCR")
            return false;
        } else if (recon_Status.toString() == "-1") {
            fnMsgAlert('info', 'DCR Calendar', "Recon Form not entered For the Month You Cant Enter the DCR.")
            return false;

        } else if (recon_Status.toString() == "-2") {
            fnMsgAlert('info', 'DCR Calendar', "Since Recon Form for the current month is either it is in Applied/Approved is either it is in Applied/Approved  You Cant Upload DCR");
            return false;
        } else
            redirectHeader = "DCRV4Header/Index";
    }
    else {// else redirect to dcrv3 header
        redirectHeader = "DCRHeader/Create";
    }

    if (flag.toUpperCase() == "FIELD") {
        if (status == "3") {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=3&isrcpa=N&source=CALENDAR&flag=F');
        }
        else if (status == "0") {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=0&isrcpa=N&source=CALENDAR&flag=F');
        }
        else {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=1&isrcpa=N&source=CALENDAR&flag=F');
        }

    }
    if (flag.toUpperCase() == "FIELD_RCPA") {
        if (status == "3") {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F');
        }
        else if (status == "0") {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=0&isrcpa=Y&source=CALENDAR&flag=F');
        }
        else {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=1&isrcpa=Y&source=CALENDAR&flag=F');
        }
    }
    if (flag.toUpperCase() == "LEAVE") {
        if (status == "0") {
            $('#main').load('../HiDoctor_Activity/DCRLeaveEntry/Create/?dcrDate=' + dcrDate + '&dcrStatus=0');
        }
        else {
            $('#main').load('../HiDoctor_Activity/DCRLeaveEntry/Create/?dcrDate=' + dcrDate + '&dcrStatus=1');
        }
    }
    if (flag.toUpperCase() == "ATTENDANCE") {
        //dcrDate = dcrDate.split('-')[1] + "-" + dcrDate.split('-')[2] + "-" + dcrDate.split('-')[0];
        // TO DO: Get Parent Url and Replace the localhost.

        if (status == "3") {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=3&isrcpa=N&source=CALENDAR&Flag=A');
        }
        else if (status == "0") {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=0&isrcpa=N&source=CALENDAR&Flag=A');
        }
        else {
            $('#main').load('../HiDoctor_Activity/' + redirectHeader + '/?dcrDate=' + dcrDate + '&dcrStatus=1&isrcpa=N&source=CALENDAR&Flag=A');
        }

        //parent.location.href = "http://" + domainName_g + "/TransDailyCall/DCRheader1.aspx?dcrdate=" + dcrDate + "&dcrstatus=" + status + "&type=NEW&DCR_Type=A&isrcpa=N&source=NEW_CALENDAR";
        //$('#main').load("http://" + domainName_g + "/TransDailyCall/DCRheader1.aspx?dcrdate=" + dcrDate + "&dcrstatus=" + status + "&type=NEW&DCR_Type=A&isrcpa=N");
        //parent.location.href = "http://" + domainName_g + "/TransDailyCall/DCR.aspx?dcrdate=" + dcrDate + "&dcrstatus=" + status + "&type=NEW&DCR_Type=A&isrcpa=N&source=HOME";
    }
}

function fnGetLeaveEntryMode() {
    debugger;
    var leavepriv = fnGetPrivilegeValue("LEAVE_ENTRY_MODE", "FULL_DAY");
    return leavepriv;
    //var leave_Entry_Mode = "HALF_A_DAY"
    //if (dcrJSON_g[1].Data[0].Leave_Entry_Mode != null) {
    //    leave_Entry_Mode = dcrJSON_g[1].Data[0].Leave_Entry_Mode;
    //}
    //return leave_Entry_Mode;
}

function GetMonthAndYearFromDate(datevalue, isDBValue) {
    var monthIndex = "";
    var year = "";

    if (isDBValue != null) {
        monthIndex = parseInt(datevalue.split('/')[0]) - 1;
        year = datevalue.split('/')[2].substring(0, 4);

    }
    else {
        monthIndex = datevalue.split('/')[0];
        year = datevalue.split('/')[2];
    }

    var monthName = monthArray[monthIndex];
    return monthName + "-" + year;
}

function fnAddMonthToDate(d, monthinterval) {
    var dateObj = new Date(d);
    // assume a month have 30 days.
    var dayObj = dateObj.getDate() == 31 ? 30 : dateObj.getDate();
    var monthObj = dateObj.getMonth();
    var yearObj = dateObj.getFullYear();
    var dateStr = monthObj + "/" + dayObj + "/" + yearObj;
    var ModMonth = monthObj + monthinterval;
    if (ModMonth >= 12) {
        ModMonth = 1;
        yearObj = yearObj + 1;
    }

    resultdateStr = ModMonth + "/" + dayObj + "/" + yearObj
    return resultdateStr;
}

function fnSelectedOptionsIsthereInMaster(dcr, flagFullName) {
    for (var j = 0; j < dcr.length; j++) {
        if (dcr[j].title.split(' ')[0].toUpperCase() == flagFullName.toUpperCase()) {
            return true;
        }
    }
    return false;
}

function fnGetCountforDCRRestrictDate(d1) {
    var dateCount = 0;
    $.ajax({
        type: 'POST',
        data: "DCR_Date=" + d1,
        url: '../HiDoctor_Activity/DCRCalendar/GetCountforDCRRestrictDate',
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
        url: '../HiDoctor_Activity/DCRCalendar/CheckTPAvailableForSelectedDCRDates',
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
function fngetlockedstockiestname(SS_Id, SS_Month, SS_Year)
{
    $.ajax({
        type: 'POST',
        data: "SS_Id=" + SS_Id,
        url: '../HiDoctor_Activity/DCRCalendar/Getlockedstockiestname',
        async: false,
        success: function (response) {
            if (response.length > 0) {
                var name = '';
                var j = (response.length)-1;
                for (var i = 0; i < response.length; i++)
                {
                    if (i == j)
                    {
                        name += response[i].Stockist_Name;
                    }
                    else {
                        name += response[i].Stockist_Name + ',';
                    }
                    
                }
                fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been Locked, since you failed to enter the Secondary Sales for ' + name + ' for this Month ' + SS_Month + "-" + SS_Year);
            }
            else {
                fnMsgAlert('info', 'DCR Calendar', 'Your DCR has been Locked, since you failed to enter the Secondary Sales for ' + SS_Month + "-" + SS_Year);
                
            }
        },
        error: function (e) {
            fnMsgAlert('info', 'DCR Calendar', e.responseText)
            return false;
        }
    });
    return true;
}