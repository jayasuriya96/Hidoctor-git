var leaveBalance_g = "", lstWeekends = "";
var noOfDays = 0;
var allowCharacterinDCR = "-_.,()@";
var Unapproval_Reason = "";
var document_Url = "";
var uploaded_files = "";
function fnBindUnApprovalReason(dcrDate) {
    if (dcrStatus == "0") {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRV4Header/GetLeaveUnapprovalReason',
            data: "dcrDate=" + dcrDate,
            success: function (result) {
                debugger;
                if (result != '' && result != undefined) {
                    var unapprovalReason = result;
                    unapprovalReason = unapprovalReason.replace(/~\^/g, ' - N/A<br />');
                    unapprovalReason = unapprovalReason.replace(/\^/g, '<br />');
                    unapprovalReason = unapprovalReason.replace(/~/g, ' - ');
                    $('#divUnapprove').html(unapprovalReason);
                    $('#divUnapprove').css('display', '');
                } else {
                    $('#divUnapprove').css('display', 'none');
                }
            }
        });

    }
}

function fnHideUnapprove() {
    $('#divUnapprove').fadeOut("slow");
}

function DrawLeaveBalanceTable(dcrDate) {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRLeaveEntry/GetLeaveBalance',
        data: "leaveValidationLeaves=" + leaveValidationLeaves + "&dcrDate=" + dcrDate,
        success: function (jsLeaveBalanceData) {
            debugger;
            leaveBalance_g = jsLeaveBalanceData;
            if (leaveBalance_g[0].Data.length > 0 && !(leaveBalance_g[0].Data.length === undefined)) {
               
                if (drawleaveGrid.toUpperCase() == "YES") {
                    fnCreateLeaveBalanceTable();
                    HideModalPopup('dvLoading');
                    $('#divLeaveLoad').css('display', '');
                }
                else {
                    HideModalPopup('dvLoading');
                    $('#divLeaveLoad').css('display', '');
                }
            }
            else {
                HideModalPopup('dvLoading');
                $('#divLeaveLoad').css('display', '');
            }
        }
    });
    debugger;
    fnBindUnApprovalReason(dcrDate);
}
// Create Leave balance table.
function fnCreateLeaveBalanceTable() {
    debugger;
    var tableContent = "";
    var leave_Type = [];
    if (leaveBalance_g[0].Data.length > 0 && !(leaveBalance_g[0].Data.length === undefined)) {
        var currentYear = (new Date).getFullYear();
        var previousYear = currentYear - 1;

        tableContent = "<table id='tblLeaveBalance' width='100%'>";
        tableContent += "<thead>";
        tableContent += "<tr><th>Leave Type</th>";
        tableContent += "<th>Carryforward Leave Balance</th>";
        tableContent += "<th>Entitled Leave</th>";
        tableContent += "<th style=display:none;'>Lapsed Num</th>";
        tableContent += "<th>Total Leaves Count</th>";
        tableContent += "<th>Leave Taken</th>";
        tableContent += "<th style=display:none;'>Leaves Pending for Approval Num</th>";
        tableContent += "<th>Balance Leave</th>";
        tableContent += "</tr>";
        tableContent += "</thead>";

        for (var i = 0; i < leaveBalance_g[0].Data.length; i++) {
            tableContent += "<tr>";
            tableContent += "<td>" + leaveBalance_g[0].Data[i].Leave_Type_Name + "</td>";
            leave_Type.push(leaveBalance_g[0].Data[i].Leave_Type_Name);
            tableContent += "<td class='leaveBalanceAlign'>" + leaveBalance_g[0].Data[i].Balance_CF + "</td>";
            tableContent += "<td class='leaveBalanceAlign'>" + leaveBalance_g[0].Data[i].Leave_Eligible + "</td>";
            tableContent += "<td style=display:none;'>" + leaveBalance_g[0].Data[i].Lapsed + "</td>";
            tableContent += "<td class='leaveBalanceAlign'>" + leaveBalance_g[0].Data[i].Opening_Balance + "</td>";
            tableContent += "<td class='leaveBalanceAlign'>" + leaveBalance_g[0].Data[i].Leave_Taken + "</td>";
            tableContent += "<td style=display:none;'>" + leaveBalance_g[0].Data[i].Leave_Taken_Applied + "</td>";
            tableContent += "<td class='leaveBalanceAlign'>" + leaveBalance_g[0].Data[i].Leave_Balance + "</td>";
            tableContent += "</tr>";
        }
        tableContent += "</table>";
    }
    else {
        tableContent = "<span class='leaveMeassage'>You don't have any active leave types.</span>";
    }
    $('#leaveBalanceTable').html(tableContent);
    debugger;
    var current = null;
    var cnt = 0;
    var number_Of_Times = "";
    for (var i = 0; i < leave_Type.length; i++) {
        if (leave_Type[i] != current) {
            if (cnt > 1) {
                $('#Submit').hide();
                $('#Reset').hide();
                fnMsgAlert('info', 'Info', 'Same leave type is present more than once. Please contact salesadmin');
                return false;
                break;
            }
            current = leave_Type[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 1) {
        $('#Submit').hide();
        $('#Reset').hide();
        fnMsgAlert('info', 'Info', 'Same leave type is present more than once. Please contact sales admin');
        return false;
    }
}
// page submition.

function fnUploadAttachment() {
    debugger;
    var details = document.getElementById('leave_doc_upload');
    var files = details.files;
    var file_Name = "";

    // Create FormData object  
    var fileData = new FormData();

    // Looping over all files and add it to FormData object  
    for (var i = 0; i < files.length; i++) {
        fileData.append(files[i].name, files[i]);
        file_Name = files[i].name;
        if (uploaded_files != "") {
            uploaded_files = uploaded_files + "," + file_Name;
        }
        else {
            uploaded_files = file_Name;
        }
    }

    if (files.length > 5) {
        HideModalPopup('dvLoading');
        $('#ddlLeaveType').val('');
        $("#Reason").val('');
        $("#leave_doc_upload").val('');
        uploaded_files = "";
        fnMsgAlert("info", "Info", "You cannot attach more than 5 files");
        return false;
    }
    else if (files.length == 0) {
        fnLeaveSubmit();
    }
    else {
        $.ajax({
            type: "POST",
            url: "../HiDoctor_Activity/DCRLeaveEntry/UploadAttachment",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: fileData,
            success: function (result) {
                debugger;
                document_Url = result;
                fnLeaveSubmit();
            }
        })
    }
}



function fnInsertLeave(leave_Status) {
    var fromDate = $("#From_Date").val().split('/')[2] + '-' + $("#From_Date").val().split('/')[1] + '-' + $("#From_Date").val().split('/')[0];
    var toDate = $("#To_Date").val().split('/')[2] + '-' + $("#To_Date").val().split('/')[1] + '-' + $("#To_Date").val().split('/')[0];
    var leaveTypeCode = $('#ddlLeaveType').val();
    var reason = $("#Reason").val();
    var entryMode = "WEB";
    debugger;
    var _objDateDetails = CommonDateDetails.fnGetTodaysDateNew();
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRLeaveEntry/InsertUpdateLeave',
        data: "&fromDate=" + fromDate + "&toDate=" + toDate + "&leaveTypeCode=" + leaveTypeCode + "&reason=" + reason +
            "&entry_mode=" + entryMode + "&leave_Status=" + leave_Status + "&doc_Url=" + document_Url +
            "&uploaded_files=" + uploaded_files + "&objDateDetails=" + JSON.stringify(_objDateDetails),
        success: function (result) {
            debugger;
            if (result == "SUCCESS") {
                $("#To_Date").val('');
                $('#ddlLeaveType').val('');
                $("#Reason").val('');
                $("#leave_doc_upload").val('');
                uploaded_files = "";
                document_Url = "";
                DrawLeaveBalanceTable(fromDate);
                ShowModalPopup('dvLoading');
                GetReport(curUserCode_g, fromDate, 'S');
                fnMsgAlert('success', 'Success', 'Your leave has been successfully inserted');
                return false;
            }
            else {
                HideModalPopup('dvLoading');
                fnMsgAlert('info', 'Info', result);
                return false;
            }
        }
    });
}

function fnLeaveSubmit() {
    debugger;
    var fromDate = $("#From_Date").val().split('/')[2] + '-' + $("#From_Date").val().split('/')[1] + '-' + $("#From_Date").val().split('/')[0];
    var toDate = $("#To_Date").val().split('/')[2] + '-' + $("#To_Date").val().split('/')[1] + '-' + $("#To_Date").val().split('/')[0];
    var leaveTypeCode = $('#ddlLeaveType').val();
    var reason = $("#Reason").val();
    var entryMode = "WEB";
    var leave_Status = "";
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRLeaveEntry/LeaveValidation',
        data: "&fromDate=" + fromDate + "&toDate=" + toDate + "&leaveTypeCode=" + leaveTypeCode + "&uploaded_files=" + uploaded_files,
        success: function (result) {
            if (result == "NO ISSUE") {
                leave_Status = "1";
                fnInsertLeave(leave_Status);
            }
            else {
                HideModalPopup('dvLoading');
                //$("#To_Date").val('');
                $('#ddlLeaveType').val('');
                $("#Reason").val('');
                $("#leave_doc_upload").val('');
                fnMsgAlert('info', 'Info', result);
                return false;
            }
        }
    });
}

function GetReport(curUserCode_g, startDate, options) {

    $.ajax({
        url: '../HiDoctor_Reports/UserPerDay/GetUserPerDayReport',
        type: "POST",
        data: "userCode=" + curUserCode_g + '&sd=' + startDate + '&options=' + options + '&Company_Code=' + Company_Code + '&User_Name=' + User_Name + '&Region_Code=' + Region_Code,
        success: function (response) {
            if (response.split('^')[0] != 'FAIL') {
                $("#dvUserPerDayCont").html(response);
                $("#divPageHeader").text('')
                $("#divLeaveForm").hide();
                $("#divHeader").text('DCR Instant Report of');
                $("#divLeaveReport").show();
                HideModalPopup('dvLoading');
            }
        }
    });
}

function fnLeavePopup(val) {
    debugger;
    $('#dvPopupLeave').overlay().load();
    var tblcontent = "", approvedby = "", approvedDate = "", approvedReason = "", attachment = "";
    approvedby = val.split('|')[0];
    approvedDate = val.split('|')[1];
    approvedReason = val.split('|')[2];
    attachment = val.split('|')[3];
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Reports/UserPerDay/GetAttachments",
        data: "attachment_Id=" + attachment,
        success: function (result) {
            debugger;
            tblcontent += "<table class='table table-striped' style='width: -webkit-fill-available;'>";
            tblcontent += "<thead id='tblLeave' style='background: #5E87B0 !important;color: rgba(0, 0, 0, 0.87);'><tr><th>S No</th>";
            tblcontent += "<th>Attachment Name</th>";
            tblcontent += "</tr></thead>";
            tblcontent += "<tbody>";
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    tblcontent += "<tr>";
                    tblcontent += "<td>" + (i + 1) + "</td>";
                    //tblcontent += "<td>" + result[i].Attachment_Name + "</td>";
                    tblcontent += "<td><span><a href='" + result[i].Attachment_Url + "'>" + result[i].Attachment_Name + " </span></td>";
                    tblcontent += "</tr>";
                }
            }
            else {
                tblcontent += "No details found.";
            }
            tblcontent += "</tbody>";
            tblcontent += "</table>";

            tblcontent += "<label>NOTE: Click on Attachment Name to Download the Attachment</label>";
            $('#tblleavepopup').html(tblcontent);
            $("#dvPopupLeave").overlay().load();
        }
    });
}

// Leave Validation.
function fnValidateLeave() {
    debugger;
    ShowModalPopup('dvLoading');

    var isValidation = new Boolean(false);

    var leaveReqired = 0;

    // Empty Check
    if ($("#From_Date").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter From Date.');
        HideModalPopup('dvLoading');
        return false;
    }

    if ($("#To_Date").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter To Date.');
        HideModalPopup('dvLoading');
        return false;
    }

    if ($("#ddlLeaveType").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please select Leave Type.');
        HideModalPopup('dvLoading');
        return false;
    }
    if ($("#Reason").val() == "") {
        fnMsgAlert('info', 'DCR Leave', 'Please enter the reason for leave.');
        fnErrorIndicator("#Reason");
        HideModalPopup('dvLoading');
        return false;
    }
    //if (leaveBalance_g[0].Data[0].leave_confirmation_days == "Y") {
    //    debugger;
    //    //var today = new Date();
    //    //var dd = String(today.getDate()).padStart(2, '0');
    //    //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //    //var yyyy = today.getFullYear();
    //    //today = mm + '/' + dd + '/' + yyyy;
    //    if (dcrDate < leaveBalance_g[0].Data[0].Confirmation_date) {
    //        alert(1);
    //    }
    //}
        // remarks length check
    else {
        if ($("#Reason").val().length > 500) {
            //$.msgbox('You have entered more then 500 character in remarks. That is not allowed.');
            fnMsgAlert('info', 'DCR Leave', 'You have entered more then 500 character in remarks. That is not allowed.');
            fnErrorIndicator("#Reason");
            HideModalPopup('dvLoading');
            return false;
        }
    }
    //Newly added for restict the special characters in Remarks field
    var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2("#Reason");
    if (!res) {
        HideModalPopup('dvLoading');
        var id = $("#Reason");
        fnMsgAlert('info', 'Information', 'Please Enter the following characters only <b>[ ' + allowCharacterinDCR + ' ]</b> in Reason.');
        fnErrorIndicator(id);
        return false;
    }


    var fromDate = $("#From_Date").val().split('/')[2] + '-' + $("#From_Date").val().split('/')[1] + '-' + $("#From_Date").val().split('/')[0];
    var toDate = $("#To_Date").val().split('/')[2] + '-' + $("#To_Date").val().split('/')[1] + '-' + $("#To_Date").val().split('/')[0];

    var month_fromDate = $("#From_Date").val().split('/')[1];
    var year_fromDate = $("#From_Date").val().split('/')[2];

    var month_toDate = $("#To_Date").val().split('/')[1];
    var year_toDate = $("#To_Date").val().split('/')[2];

    if (year_fromDate != year_toDate) {
        fnMsgAlert('info', 'Info', 'Please enter From Date and To Date in the same year');
        HideModalPopup('dvLoading');
        return false;
    }

    //Effective Date period validation
    if (leaveBalance_g[1] != "" && leaveBalance_g[1].Data.length > 0) {
        var leaveJsonPeriod = jsonPath(leaveBalance_g[1], "$.Data[?(@.Leave_Type_Code=='" + $("#ddlLeaveType").val().toString() + "')]");

        if (leaveJsonPeriod[0].Effective_From != "" && leaveJsonPeriod[0].Effective_To != "") {
            var fromDateObj = new Date(fromDate);
            var toDateObj = new Date(toDate);
            var effFromObj = new Date(leaveJsonPeriod[0].Effective_From);
            var effToObj = new Date(leaveJsonPeriod[0].Effective_To);

            if (fromDateObj < effFromObj) {
                fnMsgAlert('info', 'DCR Leave', 'Selected Leave type is not valid in selected period.');
                HideModalPopup('dvLoading');
                return false;
            }
            if (toDateObj > effToObj) {
                fnMsgAlert('info', 'DCR Leave', 'Selected Leave type is not valid in selected period.');
                HideModalPopup('dvLoading');
                return false;
            }
        }
    }

    // TP Check
    var TP_LOCK_DAY = fnGetPrivilegeValue("TP_LOCK_DAY", '0')
    var Tour_Planner = fnGetPrivilegeValue("TOUR_PLANNER", 'NO')
    if (Tour_Planner == "YES" && parseInt(TP_LOCK_DAY) > 0) {
        var dates = fnCheckTPavailable(fromDate, toDate)
        if (parseInt(dates.length) > 0) {
            HideModalPopup('dvLoading');
            var notPlannedDates = ""
            for (var i = 0; i < dates.length; i++) {
                notPlannedDates += dates[i].toString() + ", ";
            }
            notPlannedDates = notPlannedDates.substring(0, notPlannedDates.length - 1);

            fnMsgAlert('info', 'Info', 'Dear ' + userName_g + ', <br /> Please plan your leave in TP before entering actual here. The follwoing dates are not planned:<br />' + notPlannedDates);
            return false;
        }
        else {
            fnUploadAttachment();
        }
    }
    else {
        fnUploadAttachment();
    }
}

function fnCheckTPavailable(leaveFromDate, LeaveToDate) {
    var result = "";
    $.ajax({
        type: 'POST',
        data: "leaveFromDate=" + leaveFromDate + "&leaveToDate=" + LeaveToDate,
        url: '../HiDoctor_Activity/DCRLeaveEntry/CheckTPAvailableForSelectedLeaveDates',
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