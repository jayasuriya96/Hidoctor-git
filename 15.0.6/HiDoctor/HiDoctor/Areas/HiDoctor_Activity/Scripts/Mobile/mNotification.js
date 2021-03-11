/* 
For Mobile Notification
Date : 2013-01-10
*/

//function to bind the applied dcr for the child users
function fnGetApprovedDCR() {
    var content = '<ul data-role="listview" data-divider-theme="b" data-inset="true" data-role="collapsible">';
    content += '<li data-role="list-divider" role="heading">Applied DCR\'s</li>';

    for (var i = 0; i < notification_g.Tables[2].Rows.length; i++) {
        content += '<li data-theme="c">';
        content += '<a href="#" data-transition="slide" onclick="fnGoToDCRApproval(' + i + ')">';

        var dcrType = "";
        if (notification_g.Tables[2].Rows[i].Flag == "F") {
            if (notification_g.Tables[2].Rows[i].Is_RCPA == "Y") {
                dcrType = "Field_RCPA";
            }
            else {
                dcrType = "Field_RCPA";
            }
        }
        else if (notification_g.Tables[2].Rows[i].Flag == "A") {
            dcrType = "Attendance";
        }
        else {
            dcrType = "Leave";
        }

        content += '<span>' + notification_g.Tables[2].Rows[i].User_Name + ' - ' + notification_g.Tables[2].Rows[i].Date + ' - ' + dcrType + '</span>';
        content += '</a>';
        content += '<input type="hidden" id="hdnUserCode_' + i + '" value="' + notification_g.Tables[2].Rows[i].User_Code + '" />';
        content += '<input type="hidden" id="hdnUserName_' + i + '" value="' + notification_g.Tables[2].Rows[i].User_Name + '" />';
        content += '<input type="hidden" id="hdnRegionCode_' + i + '" value="' + notification_g.Tables[2].Rows[i].Region_Code + '" />';
        content += '<input type="hidden" id="hdnFlag_' + i + '" value="' + notification_g.Tables[2].Rows[i].Flag + '" />';
        content += '<input type="hidden" id="hdnDate_' + i + '" value="' + notification_g.Tables[2].Rows[i].Date + '" />';
        content += '</li>';
    }

    //for empty 
    if (notification_g.Tables[2].Rows.length == 0) {
        content += '<li data-theme="c">';
        content += '<a href="#" data-transition="slide">';
        content += 'No applied DCR found';
        content += '</a>';
        content += '</li>';
    }

    content += '</ul>';

    $("#dvAppliedDCR").html(content).trigger('create');
}

//function to bind the unapproved dcrs
function fnGetUnApprovedDCR() {
    var content = '<ul data-role="listview" data-divider-theme="b" data-inset="true" data-role="collapsible">';
    content += '<li data-role="list-divider" role="heading">Unapproved DCR\'s</li>';

    for (var i = 0; i < notification_g.Tables[3].Rows.length; i++) {
        var unapprovalReason = "";

        content += '<li data-theme="c">';
        content += '<a href="#" data-transition="slide" onclick="fnGoToHome(' + i + ')">';
        if (notification_g.Tables[3].Rows[i].Unapproval_Reason != null) {
            unapprovalReason = notification_g.Tables[3].Rows[i].Unapproval_Reason;
            unapprovalReason = unapprovalReason.replace(/~\^/g, ' - N/A<br />');
            unapprovalReason = unapprovalReason.replace(/\^/g, '<br />');
            unapprovalReason = unapprovalReason.replace(/~/g, ' - ');
        }
        else {
            unapprovalReason = "-No Reason-";
        }
        content += '<span>Date : ' + notification_g.Tables[3].Rows[i].Date + ' <br />Reason : ' + unapprovalReason + '</span>';
        content += '<input type="hidden" id="hdnDate_' + i + '" value="' + notification_g.Tables[3].Rows[i].Date + '">';
        content += '<input type="hidden" id="hdnFlag_' + i + '" value="' + notification_g.Tables[3].Rows[i].Flag + '">';
        content += '<input type="hidden" id="hdnIsRCPA_' + i + '" value="' + notification_g.Tables[3].Rows[i].Is_RCPA + '">';
        content += '<input type="hidden" id="hdnTravelKm_' + i + '" value="' + notification_g.Tables[3].Rows[i].Travelled_Kms + '">';
        content += '<input type="hidden" id="hdnunapprovereason_' + i + '" value="' + unapprovalReason + '">';
        content += '</a>';
        content += '</li>';
    }

    //for empty 
    if (notification_g.Tables[3].Rows.length == 0) {
        content += '<li data-theme="c">';
        content += '<a href="#" data-transition="slide">';
        content += 'No Unapproved DCR found';
        content += '</a>';
        content += '</li>';
    }
    content += '</ul>';

    $("#dvAppliedDCR").html(content).trigger('create');
}

function fnGoToDCRApproval(index) {
    var userName = $("#hdnUserName_" + index).val();
    var userCode = $("#hdnUserCode_" + index).val();
    var regionCode = $("#hdnRegionCode_" + index).val();
    var flag = $("#hdnFlag_" + index).val();
    var date = $("#hdnDate_" + index).val();
    //date = date.split('/')[1].toString() + "/" + date.split('/')[0].toString() + "/" + date.split('/')[2].toString();

    $.mobile.changePage("/HiDoctor_Activity/DCRApproval/Index/?Date=" + date + "&UserName=" + userName + "&UserCode=" + userCode + "&Flag=" + flag + "&RegionCode=" + regionCode + "", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}


function fnGoToHome(rowIndex) {
    var flag = $("#hdnFlag_" + rowIndex).val();
    var isRcpa = $("#hdnIsRCPA_" + rowIndex).val();
    var date = $("#hdnDate_" + rowIndex).val();
    var travelKm = $("#hdnTravelKm_" + rowIndex).val();
    var unapprovalReason = $("#hdnunapprovereason_" + rowIndex).val();
    date = date.split('/')[2].toString() + "-" + date.split('/')[1].toString() + "-" + date.split('/')[0].toString();

    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4MobileHome/GetActivityLocktype',
        data: 'dcrDate=' + date + '&flag=' + flag,
        success: function (result) {            
            if (result != null && result != '') {                
                if (result > 0) {
                    fnMsgAlert('info', 'DCR', "Dear User, Your DCR has been locked. Please contact your head office for further assistance. Your manager has unapproved your DCR activity for this day. Reason for unapproval is as follows: " + unapprovalReason);
                    return false;
                }
                else {                    
                    if (flag != "L") {
                        $.mobile.changePage("/HiDoctor_Activity//DCRV4MobileHome/Index/?dcrDate=" + date + "&dcrStatus=0&isrcpa=" + isRcpa + "&source=CALENDAR&flag=" + flag + "&travelKm=" + travelKm, {
                            type: "post",
                            reverse: false,
                            changeHash: false
                        });
                    }
                    else {
                        $.mobile.changePage("/HiDoctor_Activity/DCRLeaveEntry/Create/?dcrDate=" + date + "&dcrStatus=0", {
                            type: "post",
                            reverse: false,
                            changeHash: false
                        });
                    }
                }
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
            $.msgbox('Retrieve the calendar deatils failed.', { type: "error" });
            return false;
        }
    });

}