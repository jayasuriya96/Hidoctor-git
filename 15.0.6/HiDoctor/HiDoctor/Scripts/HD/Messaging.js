var MsgPageNum = 1;
var MsgPageSize = 15;
var totalPageCount = 0;
var mappedUserJson_g = "";
var UserDivision_g = "";
var userTypeJson_g = "";
var regionTyepJson_g = "";
var userTypecount_g = 0;
var regionTypecount_g = 0;


function fnGoToPrevPage() {

    //if (MsgPageNum == "1") {
    //    fnGetMsgDetails('', '');
    //}
    //else {
    //    MsgPageNum = parseInt(MsgPageNum) - 1;
    //    fnGetMsgDetails('', '');
    //}
    if (MsgPageNum > 1) {
        MsgPageNum = parseInt(MsgPageNum) - 1;
        fnGetMsgDetails('', '');
    }

}
function fnGoToNextPage() {
    if (((parseInt(MsgPageNum) * 15)) < totalPageCount) {
        MsgPageNum = parseInt(MsgPageNum) + 1;
        //if (totalPageCount == MsgPageNum) {
        fnGetMsgDetails('', '');
    }
    //else {
    //    MsgPageNum = parseInt(MsgPageNum) + 1;
    //    fnGetMsgDetails('', '');
    //}

}
function fnOpenComposeMain() {
    //$('#dvMainInbox').hide();
    //$('#dvMainComposeMail').show();
    //  $("#editor").cleditor();
    fnClearControlValues();
    $('#hdnMailSendType').val('SENT');
    $('.mailType').hide();
    $('#dvMainComposeMail').show();
    $("#txtToUsers").tokenInput('clear');
    $("#txtCCUsers").tokenInput('clear');
    // $('.cleditorMain iframe').contents().find('body').html('');
    $(".jqte_editor").html('')
    if ($('#dvMailMode li').hasClass('active')) {
        $('#dvMailMode li').removeClass('active');
    }
}
function fnGetMsgCount() {
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Messaging/GetMsgCount/',
        type: "POST",
        data: "A",
        success: function (result) {
            var ar = result.split('~');
            if (!isNaN(ar[0])) {
                if (parseInt(ar[0]) > 0) {
                    $('#spnInboxCount').html(ar[0]);
                    $('#spnInboxTxt').css('font-weight', 'bold');
                }
                else {
                    $('#spnInboxCount').html('');
                }
            }
            if (!isNaN(ar[1])) {
                if (parseInt(ar[1]) > 0) {
                    $('#spnDraftedCount').html(ar[1]);
                    $('#spnDraftTxt').css('font-weight', 'bold');
                }
                else {
                    $('#spnDraftedCount').html('');
                }
            }
            if (!isNaN(ar[2])) {
                if (parseInt(ar[2]) > 0) {
                    $('#spnTrashCount').html(ar[2]);
                    $('#spnTrashTxt').css('font-weight', 'bold');
                }
                else {
                    $('#spnTrashCount').html('');
                }
            }
        },
        error: function () {
            $("#dvMessagingMain").unblock();
        },
        complete: function () {
            $("#dvMessagingMain").unblock();
        }
    });
}
function fnGetMsgDetails(mailmode, obj) {
    fnGetMsgCount();
    var searchWord = $('#txtMailSearch').val();

    //$('#dvStatusMsg').hide();
    //$('#dvStatusMsg').html('');
    $('#spnMailSubject').html('');
    $('#spnMailContent').html('');
    if ($('#hdnMailMode').val().toUpperCase() != mailmode.toUpperCase() && mailmode != '') {
        MsgPageNum = 1;
    }
    $('#hdnMsgCode').val('');
    $('#liMarkAsRead').show();
    $('#liMarkAsUnread').show();
    $('#liMarkAsUnread a').html('Mark as Unread')
    if (mailmode != '') {
        $('#hdnMailMode').val(mailmode);
        $('#hdnMailSendType').val(mailmode);
        if ($('#dvMailMode li').hasClass('active')) {
            $('#dvMailMode li').removeClass('active');
        }
        $(obj).parent().addClass('active');
    }
    $('.mailType').hide();

    $('#spnCurMailMode').html($('#hdnMailMode').val());

    if ($('#hdnMailMode').val() == "DRAFTED") {
        $('#liMarkAsRead').hide();
        $('#liMarkAsUnread').hide();
    }
    else if ($('#hdnMailMode').val() == "SENT") {
        $('#liMarkAsRead').hide();
        $('#liMarkAsUnread').hide();
    }
    else if ($('#hdnMailMode').val() == "UNREAD") {
        $('#liMarkAsRead').hide();
        $('#liMarkAsUnread').hide();
    }
    else if ($('#hdnMailMode').val() == "TRASH") {
        $('#liMarkAsRead').hide();
        $('#liMarkAsUnread a').html('Move to Inbox')
    }
    else {
        $('#liMarkAsRead').show();
        $('#liMarkAsUnread').show();
    }
    $('#spnCurPage').html('');
    if (MsgPageNum > 1) {
        if ((((parseInt(MsgPageNum) - 1) * 15)) <= totalPageCount) {
            $('#dvMessagingMain').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                url: '../../Messaging/GetMessageContent/',
                type: "POST",
                data: "mailMode=" + $('#hdnMailMode').val() + "&pageNum=" + MsgPageNum + "&pageSize=" + MsgPageSize + "&searchKeyWord="
                    + $.trim($('#txtMailSearch').val()) + "",
                success: function (result) {
                    totalPageCount = parseFloat(result.split('á')[1]);
                    var totalMsg = parseFloat(result.split('á')[1]);
                    $('#dvInboxContent').html(result.split('á')[0]); //alt+160 = á
                    if (totalMsg > 0) {
                        var startRow = ((parseInt(MsgPageNum) - 1) * 15) + 1;
                        if (MsgPageNum == 1) {
                            $('#spnCurPage').html('Showing 1 - ' + parseFloat($('#dvInboxContent tr').length)
                              + ' of ' + totalMsg + ' messages');
                        }
                        else if (totalPageCount < startRow) {
                            $('#spnCurPage').html('Showing ' + startRow + ' - ' + totalPageCount + ' of '
                            + totalMsg + ' messages');
                        }
                        else {
                            $('#spnCurPage').html('Showing ' + startRow + ' - ' + parseInt((parseInt(startRow) + parseFloat($('#dvInboxContent tr').length)) - 1) + ' of '
                                + totalMsg + ' messages');
                        }
                    }
                    else {
                        if ($('#hdnMailMode').val() == "DRAFTED") {
                            $('#dvInboxContent').html('No Draft Found.');
                        }
                        else if ($('#hdnMailMode').val() == "SENT") {
                            $('#dvInboxContent').html('No Sent Items Found.');
                        }
                        else if ($('#hdnMailMode').val() == "UNREAD") {
                            $('#dvInboxContent').html('No Unread Items Found.');
                        }
                        else if ($('#hdnMailMode').val() == "TRASH") {
                            $('#dvInboxContent').html('No Trash Found.');
                        }
                    }
                    $('#dvStatusMsg').html('');
                    $('#dvStatusMsg').hide();
                    $('#dvMainInbox').show();
                },
                error: function () {
                    $("#dvMessagingMain").unblock();
                },
                complete: function () {
                    $('#dvStatusMsg').html('');
                    $('#dvStatusMsg').hide();
                    $('#dvMainInbox').show();
                    $("#dvMessagingMain").unblock();
                }
            });
        }
    }
    else {
        $('#dvMessagingMain').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });

        MsgPageNum = MsgPageNum == 0 ? 1 : MsgPageNum;

        $.ajax({
            url: '../../Messaging/GetMessageContent/',
            type: "POST",
            data: "mailMode=" + $('#hdnMailMode').val() + "&pageNum=" + MsgPageNum + "&pageSize=" + MsgPageSize + "&searchKeyWord="
                   + $.trim($('#txtMailSearch').val()) + "",
            success: function (result) {
                totalPageCount = parseFloat(result.split('á')[1]);
                var totalMsg = parseFloat(result.split('á')[1]);
                $('#dvInboxContent').html(result.split('á')[0]); //alt+160 = á
                if (totalMsg > 0) {
                    var startRow = ((parseInt(MsgPageNum) - 1) * 15) + 1;
                    if (MsgPageNum == 1) {
                        $('#spnCurPage').html('Showing 1 - ' + parseFloat($('#dvInboxContent tr').length)
                          + ' of ' + totalMsg + ' messages');
                    }
                    else if (totalPageCount < startRow) {
                        $('#spnCurPage').html('Showing ' + startRow + ' - ' + totalPageCount + ' of '
                        + totalMsg + ' messages');
                    }
                    else {
                        $('#spnCurPage').html('Showing ' + startRow + ' - ' + parseInt((parseInt(startRow) + parseFloat($('#dvInboxContent tr').length)) - 1) + ' of '
                            + totalMsg + ' messages');
                    }
                }
                else {
                    if ($('#hdnMailMode').val() == "DRAFTED") {
                        $('#dvInboxContent').html('No Draft Found.');
                    }
                    else if ($('#hdnMailMode').val() == "SENT") {
                        $('#dvInboxContent').html('No Sent Items Found.');
                    }
                    else if ($('#hdnMailMode').val() == "UNREAD") {
                        $('#dvInboxContent').html('No Unread Items Found.');
                    }
                    else if ($('#hdnMailMode').val() == "TRASH") {
                        $('#dvInboxContent').html('No Trash Found.');
                    }
                }
                $('#dvStatusMsg').html('');
                $('#dvStatusMsg').hide();
                $('#dvMainInbox').show();
            },
            error: function () {
                $("#dvMessagingMain").unblock();
            },
            complete: function () {
                $('#dvStatusMsg').html('');
                $('#dvStatusMsg').hide();
                $('#dvMainInbox').show();
                $("#dvMessagingMain").unblock();
            }
        });
    }
}
var usersJson_g = "";
function fnGetChildUsers() {
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Messaging/GetChildUsers/',
        type: "POST",
        data: "A",
        success: function (jsonResult) {
            debugger;
            if (jsonResult != '') {
                var jsData = eval('(' + jsonResult + ')');
                mappedUserJson_g = jsData;
                // var users = jsData;
                var content = "";
                var data = "";
                var data1 = new Array();
                content = "[";
                for (var i = 0; i < jsData.length; i++) {
                    content += "{id:\"" + jsData[i].User_Code + "\",name:\"" + jsData[i].User_Name + "\"},";
                }
                content = content.slice(0, -1) + "]";
                if (jsData.length == 0) {
                    content = "[]";
                }
                data1 = eval('(' + content + ')');
                usersJson_g = data1;
                $(".users-input-token").tokenInput(
                [data1], {
                    preventDuplicates: true, theme: "facebook", onAdd: function (item) {
                    }
                });

                $('.token-input-list-facebook').css('width', '100%')
            }
        },
        error: function () {
            $("#dvMessagingMain").unblock();
        },
        complete: function () {
            $("#dvMessagingMain").unblock();
        }
    });
}
function fnSelectAll() {
    if ($("#dvUlAction").hasClass('open')) {
        $("#dvUlAction").removeClass('open');
    }
    // if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
    $("input:checkbox[name=chkSelect]").each(function () {
        this.checked = true;
    });
    //  }
    //else {
    //    $("input:checkbox[name=chkSelect]").each(function () {
    //        this.checked = false;
    //    });
    //}
}
function fnUnSelectAll() {
    if ($("#dvUlAction").hasClass('open')) {
        $("#dvUlAction").removeClass('open');
    }
    $("input:checkbox[name=chkSelect]").each(function () {
        this.checked = false;
    });
}
function fnChangeReadStatus() {
    if ($("#dvUlAction").hasClass('open')) {
        $("#dvUlAction").removeClass('open');
    }
    var i = 0;
    var msgCode = "";
    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            i = parseInt(i) + 1;
            msgCode += this.value + "^";
        }
    });
    if (i > 0) {
        $('#dvMessagingMain').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../../Messaging/UpdateMsgReadStatus/',
            type: "POST",
            data: "isRead=1&msgDetails=" + msgCode + "",
            success: function (result) {
                $('#dvStatusMsg').html(result);
                $('#dvStatusMsg').show();
                fnGetMsgDetails('', '');
                fnGetMsgCount();
            },
            error: function () {
                $("#dvMessagingMain").unblock();
            },
            complete: function () {
                $("#dvMessagingMain").unblock();
            }
        });
    }
    else {
        $('#dvStatusMsg').html('Please select atleast one message');
        $('#dvStatusMsg').show();
    }
}
function fnChangeUnreadStatus() {
    if ($("#dvUlAction").hasClass('open')) {
        $("#dvUlAction").removeClass('open');
    }
    var i = 0;
    var msgCode = "";
    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            i = parseInt(i) + 1;
            msgCode += this.value + "^";
        }
    });
    if (i > 0) {
        $('#dvMessagingMain').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../../Messaging/UpdateMsgReadStatus/',
            type: "POST",
            data: "isRead=0&msgDetails=" + msgCode + "",
            success: function (result) {
                $('#dvStatusMsg').html(result);
                $('#dvStatusMsg').show();
                fnGetMsgDetails('', '');
                fnGetMsgCount();
            },
            error: function () {
                $("#dvMessagingMain").unblock();
            },
            complete: function () {
                $("#dvMessagingMain").unblock();
            }
        });
    }
    else {
        $('#dvStatusMsg').html('Please select atleast one message');
        $('#dvStatusMsg').show();
    }
}
function fnDeleteMultipleMsg() {
    var i = 0;
    var msgCode = "";
    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            i = parseInt(i) + 1;
            msgCode += this.value + "^";
        }
    });
    if (i > 0) {
        var rowStatus = "0";
        if ($('#hdnMailMode').val() == "TRASH") {
            rowStatus = "3";
        }
        $('#dvMessagingMain').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../../Messaging/UpdateMsgStatus/',
            type: "POST",
            data: "rowStatus=" + rowStatus + "&msgCode=" + msgCode + "&mailMode=" + $('#hdnMailMode').val() + "",
            success: function (result) {
                $('#dvStatusMsg').html(result);
                $('#dvStatusMsg').show();
                if (MsgPageNum > (totalPageCount / 15)) {
                    MsgPageNum = MsgPageNum - 1;
                }
                fnGetMsgDetails('', '');
                fnGetMsgCount();
            },
            error: function () {
                $("#dvMessagingMain").unblock();
            },
            complete: function () {
                $("#dvMessagingMain").unblock();
            }
        });
    }
    else {
        $('#dvStatusMsg').html('Please select atleast one message to delete');
        $('#dvStatusMsg').show();
    }
}
function fnShowMailDetails(msgCode, targetAddress) {
    $('.mailType').hide();
    //if ($("#txtToUsers").val() != '') {
    //    if ($("#txtToUsers").hasClass('users-input-token')) { $('.users-input-token').tokenInput('clear') };
    //}
    //if ($("#txtCCUsers").val() != '') {
    //    if ($("#txtCCUsers").hasClass('users-input-token')) { $('.users-input-token').tokenInput('clear') };
    //}
    if ($('#txtToUsers').tokenInput('get').length > 0) {
        $('#txtToUsers').tokenInput('clear');
    }
    if ($('#txtCCUsers').tokenInput('get').length > 0) {
        $('#txtCCUsers').tokenInput('clear');
    }
    $(".jqte_editor").html('');
    $(".token-input-dropdown-facebook").css('display', 'none');
    $('#liReplyAll').show();
    $('#liForward').show();
    $('#liPrint').show();
    $('#liDelete').show();
    $('#btnReplyMail').show();
    $('#hdnMsgCode').val(msgCode);
    $('#hdnTargetAddress').val(targetAddress);
    $('#spnMailContent').html('');
    $('#dvMainMailDetails').show();
    if ($('#hdnMailMode').val() == "DRAFTED" || $('#hdnMailMode').val() == "TRASH") {
        $('#liReplyAll').hide();
        $('#liForward').hide();
        $('#liPrint').hide();
        $('#btnReplyMail').hide();
    }
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Messaging/GetSelectedMsgDetails/',
        type: "POST",
        data: "msgCode=" + msgCode + "&TargetAddress=" + targetAddress + "",
        success: function (result) {
            if (result.split('~')[0] != '') {
                var jsData = eval('(' + result.split('~')[0] + ')');
                $('#spnMailDate').html(jsData[0].Date_From);
                $('#spnFromUser').html('From : ' + jsData[0].Employee_Name + '(' + jsData[0].User_Name + ')');
                $('#hdnFromUserName').val(jsData[0].User_Name);
                $('#hdnFromUserCode').val(jsData[0].User_Code);
                $('#spnMailSubject').html(jsData[0].Subject);
                $('#spnMailContent').html(jsData[0].Message_Content);
                var attachement = "";
                for (var z = 1; z <= 5; z++) {
                    if ((jsData[0]['Attachment_Path' + z]) != '' && (jsData[0]['Attachment_Path' + z]) != null &&
                        (jsData[0]['Attachment_Path' + z]) != undefined) {
                        attachement += "<div class='col-lg-12 clearfix'><div style='float:left'>Attachment " + z + " : </div><div><a href='" + result.split('~')[1]
                            + "/" + jsData[0]['Attachment_Path' + z] + "'>" + result.split('~')[1]
                            + "/" + jsData[0]['Attachment_Path' + z] + "</a> </div></div>";
                    }
                }
                $('#dvAllAttachments').html(attachement);
                var toUsersToShow = "";
                var ccUsersToShow = "";
                var toUsers = "";
                var toUserCodes = "";
                var ccUsers = "";
                var ccUserCodes = "";
                for (var i = 0; i < jsData.length; i++) {
                    if (jsData[i].Address_Type == "TO") {
                        toUsersToShow += jsData[i].To_User_Name + ",";
                    }
                    else {
                        ccUsersToShow += jsData[i].To_User_Name + ",";
                    }
                }
                for (var i = 0; i < jsData.length; i++) {

                    if (jsData[i].Address_Type == "TO") {
                        if (usersJson_g != '') {
                            var disJson = jsonPath(usersJson_g, "$[?(@.id=='" + jsData[i].Target_Address + "')]");
                            if (disJson != false && disJson != undefined) {
                                toUsers += jsData[i].To_User_Name + ",";
                                toUserCodes += jsData[i].Target_Address + ",";

                            }
                        }
                    }
                    else {
                        if (usersJson_g != '') {
                            var disJson = jsonPath(usersJson_g, "$[?(@.id=='" + jsData[i].Target_Address + "')]");
                            if (disJson != false && disJson != undefined) {
                                ccUsers += jsData[i].To_User_Name + ",";
                                ccUserCodes += jsData[i].Target_Address + ",";
                            }
                        }
                    }
                }
                $('#hdnToUserCode').val(toUserCodes.slice(0, -1));
                $('#hdnCCUserCode').val(ccUserCodes.slice(0, -1));
                $('#hdnToUserName').val(toUsers.slice(0, -1));
                $('#hdnCCUserName').val(ccUsers.slice(0, -1));
                if (toUsersToShow.slice(0, -1).length > 150) {
                    var details = "<div style='padding: 1%;'><div class='col-lg-12'><div class='col-xs-1'>From </div><div class='col-xs-11'> : "
                        + jsData[0].Employee_Name + '(' + jsData[0].User_Name + ')' + "</div></div>";
                    details += "<div class='col-lg-12 clearfix'><div class='col-xs-1'>To </div><div class='col-xs-11'> : "
                                + toUsersToShow.slice(0, -1).replace(/,/g, ",</br>") + "</div></div>";
                    if (ccUsers.split(',').length > 1) {
                        details += "<div class='col-lg-12 clearfix'><div class='col-xs-1'>CC </div><div class='col-xs-11'> : "
                            + ccUsersToShow.slice(0, -1).replace(/,/g, ",</br>") + "</div></div>";
                    }
                    details += "</div>";
                    $('#dvCont').html(details);
                    $('#dvToUsersDetails').show();
                    $('#spnToUser').html('To : ' + toUsersToShow.slice(0, -1).substring(0, 150) + "..");
                }
                else {
                    // $('#dvToUsersDetails').hide();
                    var details = "<div style='padding: 1%;'><div class='col-lg-12'><div class='col-xs-1'>From </div><div class='col-xs-11'> : "
                      + jsData[0].Employee_Name + '(' + jsData[0].User_Name + ')' + "</div></div>";
                    details += "<div class='col-lg-12 clearfix'><div class='col-xs-1'>To </div><div class='col-xs-11'> : "
                                + toUsersToShow.slice(0, -1).replace(/,/g, ",</br>") + "</div></div>";
                    if (ccUsers.split(',').length > 1) {
                        details += "<div class='col-lg-12 clearfix'><div class='col-xs-1'>CC </div><div class='col-xs-11'> : "
                            + ccUsersToShow.slice(0, -1).replace(/,/g, ",</br>") + "</div></div>";
                    }
                    details += "</div>";
                    $('#dvCont').html(details);
                    $('#dvToUsersDetails').show();
                    $('#spnToUser').html('To : ' + toUsersToShow.slice(0, -1));
                    // $('#spnCCUser').html('Cc : ' + ccUsers.slice(0, -1));
                }
            }
            if ($('#hdnMailMode').val() == "DRAFTED") {
                for (var i = 1; i <= 5; i++) {
                    $('#attachment' + i).val('');
                    $('#attachment' + i).hide();
                    $('#lnkFilePath' + i).html('');
                    $('#lnkFilePath' + i).hide();
                    $('#lnkFilePath' + i).removeAttr('href');
                    $('#hdnFilePath' + i).val('');
                    // $('#dvAttach' + i).hide();
                }
                $('.mailType').hide();
                $('#dvMainComposeMail').show();
                //$('.cleditorMain iframe').contents().find('body').html($('#spnMailContent').html());
                $(".jqte_editor").html($('#spnMailContent').html());
                //  $("#txtToUsers").tokenInput("add", { id: $('#hdnFromUserCode').val(), name: $('#hdnFromUserName').val() });
                var toUserCode = $('#hdnToUserCode').val().split(',');
                var ccUserCode = $('#hdnCCUserCode').val().split(',');
                var toUsers = $('#hdnToUserName').val().split(',');
                var ccUsers = $('#hdnCCUserName').val().split(',');
                for (var i = 0; i < toUsers.length; i++) {
                    if (toUsers[i] != '') {
                        $("#txtToUsers").tokenInput("add", { id: toUserCode[i], name: toUsers[i] });
                    }
                }
                for (var i = 0; i < ccUsers.length; i++) {
                    if (ccUsers[i] != '') {
                        $("#txtCCUsers").tokenInput("add", { id: ccUserCode[i], name: ccUsers[i] });
                    }
                }
                $("#txtSubject").val($('#spnMailSubject').html());
                var attachement = "";
                for (var z = 1; z <= 5; z++) {
                    if ((jsData[0]['Attachment_Path' + z]) != '' && (jsData[0]['Attachment_Path' + z]) != null &&
                        (jsData[0]['Attachment_Path' + z]) != undefined) {
                        //$('#attachment' + z).val((jsData[0]['Attachment_Path' + z]));
                        $('#lnkFilePath' + z).html((encodeURIComponent(jsData[0]['Attachment_Path' + z])));
                        $('#lnkFilePath' + z).attr('href', (result.split('~')[1] + "/" + encodeURIComponent(jsData[0]['Attachment_Path' + z])));
                        $('#hdnFilePath' + z).val(encodeURIComponent(jsData[0]['Attachment_Path' + z]));
                        //  $('#attachment' + z).val(jsData[0]['Attachment_Path' + z]);
                        $('#dvFilePath' + z).show();
                        $('#attachment' + z).hide();
                        $('#lnkFilePath' + z).show();
                        //$('#dvAttach' + i).show();
                    }
                    else {
                        $('#attachment' + z).show();
                        break;
                    }
                }
            }
            fnGetMsgCount();
            $(".token-input-dropdown-facebook").css('display', 'none');
            $("#dvMessagingMain").unblock();
        },
        error: function () {
            $("#dvMessagingMain").unblock();
        },
        complete: function () {
            $("#dvMessagingMain").unblock();
        }
    });
    $(".token-input-dropdown-facebook").css('display', 'none');
}
function fnDeleteFileFromBlob(id) {
    var fileName = $('#' + id).val();
    $('#' + id.replace('hdnFilePath', 'dvFilePath')).hide();
    $('#' + id.replace('hdnFilePath', 'attachment')).show();
    $('#' + id).val('');
}
function fnReplyMail() {
    $('.mailType').hide();
    fnClearControlValues();
    $('#hdnMailSendType').val('REPLY');
    $('#dvMainComposeMail').show();
    if (usersJson_g != '') {
        var disJson = jsonPath(usersJson_g, "$[?(@.id=='" + $('#hdnFromUserCode').val() + "')]");
        if (disJson != false && disJson != undefined) {
            $("#txtToUsers").val($('#hdnFromUserCode').val());
            $("#txtToUsers").tokenInput("add", { id: $('#hdnFromUserCode').val(), name: $('#hdnFromUserName').val() });
        }
    }
    // $("#txtToUsers").val($('#hdnFromUserCode').val())
    $("#txtSubject").val($('#spnMailSubject').html());
    // $('.cleditorMain iframe').contents().find('body').html($('#spnMailContent').html());
    var content = "</br></br></br>";
    content += "<div class='col-lg-12' style='border-top: 1px solid #ddd;'>";
    content += "<div class='col-lg-12'>From: " + $('#hdnFromUserName').val() + "</div>";
    content += "<div class='col-lg-12'>Date: " + $('#spnMailDate').html() + "</div>";
    content += "<div class='col-lg-12'>Subject: " + $('#spnMailSubject').html() + "</div>";
    content += "<div class='col-lg-12'>To: " + $('#hdnToUserName').val() + "</div>";
    content += "<div class='col-lg-12'>Cc: " + $('#hdnCCUserName').val() + "</div>";
    content += "<div class='col-lg-12'>" + $('#spnMailContent').html() + "</div>";
    content += "</div>";
    //$('.cleditorMain iframe').contents().find('body').html('');
    $(".jqte_editor").html('');
    $('#txtSubject').val('RE: ' + $('#spnMailSubject').html());
    //  $('.cleditorMain iframe').contents().find('body').html(content);
    $(".jqte_editor").html(content);

    // $("#editor").val($('#spnMailContent').html());
    //  $("#txtToUsers").tokenInput("add", { id: $('#hdnFromUserCode').val(), name: $('#hdnFromUserName').val() });
}
function fnShowToUserDetails() {
    $("#dvToUsersPopUp").overlay().load();
}
function fnReplyAllMail() {
    $('#btnReplyMail').parent().removeClass('open');
    fnClearControlValues();
    $('#hdnMailSendType').val('REPLYALL');
    $('.mailType').hide();
    $('#dvMainComposeMail').show();
    // $('.cleditorMain iframe').contents().find('body').html($('#spnMailContent').html());
    if (usersJson_g != '') {
        var disJson = jsonPath(usersJson_g, "$[?(@.id=='" + $('#hdnFromUserCode').val() + "')]");
        if (disJson != false && disJson != undefined) {
            $("#txtToUsers").val($('#hdnFromUserCode').val());
            $("#txtToUsers").tokenInput("add", { id: $('#hdnFromUserCode').val(), name: $('#hdnFromUserName').val() });
        }
    }
    // $("#txtToUsers").tokenInput("add", { id: $('#hdnFromUserCode').val(), name: $('#hdnFromUserName').val() });
    var toUserCode = $('#hdnToUserCode').val().split(',');
    var ccUserCode = $('#hdnCCUserCode').val().split(',');
    var toUsers = $('#hdnToUserName').val().split(',');
    var ccUsers = $('#hdnCCUserName').val().split(',');
    for (var i = 0; i < toUsers.length; i++) {
        if (curUserCode_g != toUserCode[i] && toUserCode[i] != '') {
            $("#txtToUsers").tokenInput("add", { id: toUserCode[i], name: toUsers[i] });
        }
    }
    for (var i = 0; i < ccUsers.length; i++) {
        if (curUserCode_g != ccUserCode[i] && ccUserCode[i] != '') {
            $("#txtCCUsers").tokenInput("add", { id: ccUserCode[i], name: ccUsers[i] });
        }
    }

    var content = "</br></br></br></br>";
    content += "<div class='col-lg-12' style='border-top: 1px solid #ddd;'>";
    content += "<div class='col-lg-12'>From: " + $('#hdnFromUserName').val() + "</div>";
    content += "<div class='col-lg-12'>Date: " + $('#spnMailDate').html() + "</div>";
    content += "<div class='col-lg-12'>Subject: " + $('#spnMailSubject').html() + "</div>";
    content += "<div class='col-lg-12'>To: " + $('#hdnToUserName').val() + "</div>";
    content += "<div class='col-lg-12'>Cc: " + $('#hdnCCUserName').val() + "</div></br>";
    content += "<div class='col-lg-12'>" + $('#spnMailContent').html() + "</div>";
    content += "</div>";
    // $('.cleditorMain iframe').contents().find('body').html('');
    $(".jqte_editor").html('');
    $('#txtSubject').val('RE: ' + $('#spnMailSubject').html());
    // $('.cleditorMain iframe').contents().find('body').html(content);
    $(".jqte_editor").html(content);
}
function fnClearControlValues() {
    //$('#hdnMsgCode').val('');
    $('#hdnMailSendType').val('');
    $('.mailType').hide();
    if ($("#txtToUsers").val() != '') {
        if ($("#txtToUsers").hasClass('users-input-token')) { $('.users-input-token').tokenInput('clear') };
    }
    if ($("#txtCCUsers").val() != '') {
        if ($("#txtCCUsers").hasClass('users-input-token')) { $('.users-input-token').tokenInput('clear') };
    }
    if ($('#txtToUsers').tokenInput('get').length > 0) {
        $('#txtToUsers').tokenInput('clear');
    }
    if ($('#txtCCUsers').tokenInput('get').length > 0) {
        $('#txtCCUsers').tokenInput('clear');
    }
    $(".token-input-dropdown-facebook").css('display', 'none');
    //$('.cleditorMain iframe').contents().find('body').html('');
    $(".jqte_editor").html('');
    $("#txtSubject").val('');
    $('#dvStatusMsg').html('');
    $('#dvStatusMsg').hide();
    for (var i = 1; i <= 5; i++) {
        $('#attachment' + i).val('');
        $('#attachment' + i).hide();
        $('#lnkFilePath' + i).html('');
        $('#lnkFilePath' + i).removeAttr('href');
        $('#hdnFilePath' + i).val('');
    }
    $('.dvFilePath').hide();
    $('#attachment1').show();
    $('#hdnMsgCode').val('');
}

function fnForwardMail() {
    $('#btnReplyMail').parent().removeClass('open');
    $('#txtToUsers').val('');
    $('#txtCCUsers').val('');
    fnClearControlValues();
    $('#hdnMailSendType').val('FORWARD');
    //  $('.cleditorMain iframe').contents().find('body').html('');
    $(".jqte_editor").html('');
    var content = "</br></br></br>";
    content += "<div class='col-lg-12' style='border-top: 1px solid #ddd;'>";
    content += "<div class='col-lg-12'>From: " + $('#hdnFromUserName').val() + "</div>";
    content += "<div class='col-lg-12'>Date: " + $('#spnMailDate').html() + "</div>";
    content += "<div class='col-lg-12'>Subject: " + $('#spnMailSubject').html() + "</div>";
    content += "<div class='col-lg-12'>To: " + $('#hdnToUserName').val() + "</div>";
    content += "<div class='col-lg-12'>Cc: " + $('#hdnCCUserName').val() + "</div>";
    content += "<div class='col-lg-12'>" + $('#spnMailContent').html() + "</div>";
    content += "</div>";
    content += $("#dvAllAttachments").html();
    //$('.cleditorMain iframe').contents().find('body').html('');
    $(".jqte_editor").html('');
    $('#txtSubject').val('FW: ' + $('#spnMailSubject').html());
    //$('.cleditorMain iframe').contents().find('body').html(content);
    $(".jqte_editor").html(content);
    $('#dvMainComposeMail').show();
    //for (var i = 1; i <= 5; i++) {
    //    $('#attachment' + i).val('');
    //    $('#lnkFilePath' + i).html('');
    //    $('#lnkFilePath' + i).removeAttr('href');
    //    $('#hdnFilePath' + i).val('');
    //}
    //$('.dvFilePath').hide();
}

function fnSendMail() {
    $('#hdnSendStatus').val('SEND');
    var toUsers = $('#txtToUsers').val();
    var ccUsers = $('#txtCCUsers').val();
    var subject = $.trim($('#txtSubject').val());
    var msgContent = $(".jqte_editor").html(); //$('.cleditorMain iframe').contents().find('body').html();
    //$('#hdnMsgContent').val(msgContent);
    var attachment1 = "", attachment2 = "", attachment3 = "", attachment4 = "", attachment5 = "";
    attachment1 = $('#attachment1').val();
    attachment2 = $('#attachment2').val();
    attachment3 = $('#attachment3').val();
    attachment4 = $('#attachment4').val();
    attachment5 = $('#attachment5').val();
    var sentType = $('#hdnMailSendType').val(); // reply, replyall, forward, sent, draft
    if ($.trim(toUsers).length == 0) {
        $('#dvStatusMsg').html('Please select atleast one recipient');
        $('#dvStatusMsg').show();
        return;
    }
    if ($.trim(subject) == '') {
        if (confirm('Send this message without a subject?')) {
            subject = "(No Subject)";
            fnSubmitMsg(subject.replace(/'/g, ''), msgContent, "SEND", sentType, toUsers, ccUsers);
        }
    }
    else {
        if ($.trim(msgContent) == '') {
            if (confirm('Send this message without a text in the body?')) {
                fnSubmitMsg(subject.replace(/'/g, ''), msgContent, "SEND", sentType, toUsers, ccUsers);
            }
        }
        else {
            fnSubmitMsg(subject.replace(/'/g, ''), msgContent, "SEND", sentType, toUsers, ccUsers);
        }
    }
}

function fnSendDraftMail() {
    $('#hdnSendStatus').val('DRAFT');
    var toUsers = $('#txtToUsers').val();
    var ccUsers = $('#txtCCUsers').val();
    var subject = $.trim($('#txtSubject').val());
    var msgContent = $(".jqte_editor").html(); //$('.cleditorMain iframe').contents().find('body').html();
    //$('#hdnMsgContent').val(msgContent);
    var attachment1 = "", attachment2 = "", attachment3 = "", attachment4 = "", attachment5 = "";
    attachment1 = $('#attachment1').val();
    attachment2 = $('#attachment2').val();
    attachment3 = $('#attachment3').val();
    attachment4 = $('#attachment4').val();
    attachment5 = $('#attachment5').val();
    var sentType = $('#hdnMailSendType').val(); // reply, replyall, forward, sent, draft
    if ($.trim(toUsers).length == 0) {
        $('#dvStatusMsg').html('Please select atleast one recipient');
        $('#dvStatusMsg').show();
        return;
    }
    if ($.trim(subject) == '') {
        if (confirm('Send this message without a subject?')) {
            subject = "(No Subject)"; // ALT+160 = á , ALT+161= í
            fnSubmitMsg(subject.replace(/'/g, ''), msgContent, "DRAFT", sentType, toUsers, ccUsers);
        }
    }
    else {
        if ($.trim(msgContent) == '') {
            if (confirm('Send this message without a text in the body?')) {
                fnSubmitMsg(subject.replace(/'/g, ''), msgContent, "DRAFT", sentType, toUsers, ccUsers);
            }
        }
        else {
            fnSubmitMsg(subject.replace(/'/g, ''), msgContent, "DRAFT", sentType, toUsers, ccUsers);
        }
    }
}
var isUploadSuccess = true;
function fnSubmitMsg(subject, msgContent, sentStatus, sentType, toUsers, ccUsers) {
    var totalFileSize = 0;
    var arToUsers = toUsers.split(',');
    var arCCUsers = ccUsers.split(',');
    for (var k = 0; k < arCCUsers.length; k++) {
        if ($.inArray(arCCUsers[k], arToUsers) > -1) {
            $('#dvStatusMsg').html('You can not give same user name in Recipient as well as CC');
            $('#dvStatusMsg').show();
            window.scrollTo(0, 0);
            return;
        }
    }
    var fileSize = 0;
    for (var a = 1; a <= 5; a++) {
        if ($('#attachment' + a).val() != '') {

            if ($.browser.msie) {
                // contentMasterEntity.ThumbnailURL = $('#attachment' + a).val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                var myFSO = new ActiveXObject("Scripting.FileSystemObject");
                var thefile = myFSO.getFile($('#attachment' + a).val());
                fileSize = thefile.size;
            }
            else {
                fileSize = $('#attachment' + a)[0].files[0].size;

            }
            // var fileSize = $('#attachment' + a)[0].files[0].size;
            totalFileSize += parseFloat(fileSize) / 1048576;
        }
    }
    if (totalFileSize > 2) {
        // fnMsgAlert('info', 'Info', 'You can upload maximum of 2 MB file size only');
        $('#dvStatusMsg').html('You can upload maximum of 2 MB file size only');
        $('#dvStatusMsg').show();
        window.scrollTo(0, 0);
        return;
    }
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    msgContent = msgContent.replace(/spnMailContent/g, 'spnMailContent11');
    $.ajax({
        url: '../../Messaging/InsertMessage/',
        type: "POST",
        data: "subject=" + encodeURIComponent(subject.replace(/'/g, '').replace(/</g, 'á').replace(/>/g, 'í').replace('~', '_')) + "&msgContent="
            + encodeURIComponent(msgContent.replace(/'/g, '').replace(/</g, 'á').replace(/>/g, 'í').replace('~', '_')) + "&sentStatus=" + sentStatus
                        + "&sentType=" + sentType + "&toUsers=" + toUsers + "&ccUsers=" + ccUsers + "&msgCode=" + $('#hdnMsgCode').val() + "",
        success: function (result) {
            if (result.split(":")[0] == "SUCCESS") {
                var msgCode = result.split(":")[1].split('~')[0];
                // $('#hdnMsgCode').val(msgCode);
                var userMsg = result.split(":")[1].split('~')[1];
                $('#dvStatusMsg').html(userMsg);
                $('#dvStatusMsg').show();
                window.scrollTo(0, 0);
                fnGetMsgCount();
                $('#hdnMailMode').val('INBOX');
                if ($('#dvMailMode li').hasClass('active')) {
                    $('#dvMailMode li').removeClass('active');
                }
                $('#hdnMailMode').parent().addClass('active');
                fnGetMsgDetails('', '');
                //  if (sentStatus == "DRAFT") {
                for (var i = 1; i <= 5; i++) {
                    if ($('#attachment' + i).val() != '') {
                        // var fileExt = $('#attachment' + i).val().split('.')[1];
                        //var fileName = $('#attachment' + i).val().substring($('#attachment' + i).val().lastIndexOf('.'));
                        var fileName = $('#attachment' + i).val();
                        fileName = fileName.replace(/[-%$#@&]+/g, "_")
                        //var orgfileName = $('#attachment' + i).val();
                        //var mesgfilename = "";
                        //if (orgfileName.indexOf('\\') > 0) {
                        //    mesgfilename = orgfileName.split('\\')[2];
                        //}
                        //else {
                        //    mesgfilename = orgfileName;
                        //}
                        //mesgfilename = mesgfilename.replace(' ', '_');
                        //mesgfilename = mesgfilename.replace(/&/g, 'and');
                        //mesgfilename = mesgfilename.replace('~', '_');
                        // var mesgFN = mesgfilename.split('.')[0];

                        //var mesgFN = mesgfilename.replace(mesgfilename.substring(mesgfilename.lastIndexOf('.')), '');

                        BeginFileUpload("attachment" + i, fileName, i, msgCode);
                    }
                    else {
                        if ($('#hdnFilePath' + i).val() == '') {
                            //var fileExt = $('#hdnFilePath' + i).val().split('.')[1];
                            //BeginFileUpload("hdnFilePath" + i, msgCode + "_" + i + "." + fileExt);
                            $.ajax({
                                url: '../../Messaging/UpdateAttachmentPath/',
                                type: "POST",
                                data: "msgCode=" + msgCode + "&fileRemoved=YES&columnName=" + "Attachment_Path" + i + "",
                                success: function (result) {
                                },
                                error: function () {
                                },
                                complete: function () {
                                }
                            });
                        }
                    }
                }
                //}
                //else {
                //    for (var i = 1; i <= 5; i++) {
                //        if ($('#attachment' + i).val() != '') {
                //            var fileExt = $('#attachment' + i).val().split('.')[1];
                //            BeginFileUpload("attachment" + i, msgCode + "_" + i + "." + fileExt);
                //        }
                //    }
                //}

            }

            $(".jqte_editor").html('');

            $("#dvMessagingMain").unblock();
        },
        error: function () {
            $("#dvMessagingMain").unblock();
        },
        complete: function () {
            $("#dvMessagingMain").unblock();
        }
    });
}

function fnUpdateAttachmentPath(fileName, columnName, msgCode) {
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Messaging/UpdateAttachmentPath/',
        type: "POST",
        data: "msgCode=" + msgCode + "&fileName=" + fileName + "&columnName=" + columnName + "",
        success: function (result) {
            if (result.split(":")[0] == "SUCCESS") {
            }
        },
        error: function () {
            $("#dvMessagingMain").unblock();
        },
        complete: function () {
            $("#dvMessagingMain").unblock();
        }
    });
}

function fnShowAttachments() {
    if ($('#attachment1').val() != '') {
        $('#dvAttach2').show();
    }
}

function fnHideCommonControl() {
    $('#dvStatusMsg').html('');
    $('#dvStatusMsg').hide();
}

function fnShowLeftPanel() {
    if ($("#dvLeftPanel").is(":visible")) {
        $("#dvLeftPanel").hide();
    }
    else {
        $("#dvLeftPanel").show();
    }
}

function fnUploadIntoBlob(fileNum) {
}

function fnPrintMail() {
    $('#btnReplyMail').parent().removeClass('open');
    try {
        var oIframe = document.getElementById('ifrmPrint');
        var oContent = document.getElementById('dvPrintMail').innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();'>");
        oDoc.write(oContent + "</body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
    // }
    //  fnPrint('dvPrintMail', 'ifrmPrint');
}

function fnShowNextOrPreviousMsgDetails(mode) {
    var curMsgCode = $("#hdnMsgCode").val();
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Messaging/GetNextOrPreviousMsgCode/',
        type: "POST",
        data: "msgCode=" + curMsgCode + "&mode=" + mode + "&mailMode=" + $('#hdnMailMode').val() + "",
        success: function (result) {
            if (result != null && result != "NOMSG") {
                if ($('#hdnMailMode').val() == "INBOX") {
                    fnShowMailDetails(result, $('#hdnTargetAddress').val());
                }
                else {
                    fnShowMailDetails(result, '');
                }
            }
        },
        error: function () {
            $("#dvMessagingMain").unblock();
        },
        complete: function () {
            $("#dvMessagingMain").unblock();
        }
    });
}

function fnShowNextMsgDetails() {
    //
}

function fnDeleteSingleMsg() {
    var rowStatus = "0";
    var msgCode = $('#hdnMsgCode').val() + "~" + $('#hdnTargetAddress').val();
    if ($('#hdnMailMode').val() == "TRASH") {
        rowStatus = "3";
    }
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Messaging/UpdateMsgStatus/',
        type: "POST",
        data: "rowStatus=" + rowStatus + "&msgCode=" + msgCode + "&mailMode=" + $('#hdnMailMode').val() + "",
        success: function (result) {
            $('#dvStatusMsg').html(result);
            $('#dvStatusMsg').show();
            fnGetMsgDetails('', '');
            fnGetMsgCount();
        },
        error: function () {
            $("#dvMessagingMain").unblock();
        },
        complete: function () {
            $("#dvMessagingMain").unblock();
        }
    });


    //var rowStatus = "0";
    //if ($('#hdnMailMode').val() == "TRASH") {
    //    rowStatus = "3";
    //}
    //$('#dvMessagingMain').block({
    //    message: '<h3>Loading...</h3>',
    //    css: { border: '2px solid #ddd' }
    //});
    //$.ajax({
    //    url: '../../Messaging/UpdateMsgStatus/',
    //    type: "POST",
    //    data: "rowStatus=" + rowStatus + "&msgCode=" + $('#hdnMsgCode').val() + "~" + $('#hdnTargetAddress').val() + "&mailMode=" + $('#hdnMailMode').val() + "",
    //    success: function (result) {
    //        $('#dvStatusMsg').html(result);
    //        $('#dvStatusMsg').show();
    //        fnGetMsgDetails('', '');
    //        fnGetMsgCount();
    //    },
    //    error: function () {
    //        $("#dvMessagingMain").unblock();
    //    },
    //    complete: function () {
    //        $("#dvMessagingMain").unblock();
    //    }
    //});

}


function fnShowUserSelectionPopUP(mode) {
    $('#btnShowSelection').hide();
    $('input:radio[name=rdUserSelection]').attr('checked', false);
    $('#dvFilteredOutput').html('');
    $("input:checkbox[name=cheDivisionselection]").each(function () {
        this.checked = false;
    });
    //$("input:checkbox[name=chkSelection]").each(function () {
    //    this.checked = false;
    //});
    $('#hdnFilterMode').val(mode);
    var content = "";

    if (mappedUserJson_g != '') {
        content += '<table class="table" id="tblUsersPopUp">';
        content += '<thead style="font-weight:bold !important;"><tr> <th><input type="checkbox" name="chkSelectAllUsers" onclick="fnSelectAllUsers();"/></th><th>User Name</th><th>User Type</th><th>Employee Name</th>';
        content += '<th>Region Name</th><th>Region Type Name</th></tr></thead><tbody>';
        for (var i = 0; i < mappedUserJson_g.length; i++) {
            content += '<tr>';
            content += '<td><input type="checkbox" name="chkSelectUsers" id="chkSelectUsers_' + i + '"  value="'
                    + mappedUserJson_g[i].User_Code + '^' + mappedUserJson_g[i].User_Name + '"/></td>';
            content += '<td>' + mappedUserJson_g[i].User_Name + '</td>';
            content += '<td>' + mappedUserJson_g[i].User_Type_Name + '</td>';
            content += '<td>' + mappedUserJson_g[i].Employee_Name + '</td>';
            content += '<td>' + mappedUserJson_g[i].Region_Name + '</td>';
            content += '<td>' + mappedUserJson_g[i].Region_Type_Name + '<input type="hidden" id="hdnUserType_' + i + '" value="'
                + mappedUserJson_g[i].User_Type_Code + '"/><input type="hidden" id="hdnRegionType_' + i + '" value="'
                + mappedUserJson_g[i].Region_Type_Code + '"/><input type="hidden" id="hdnDivUserCode_' + i + '" value="'
                + mappedUserJson_g[i].User_Code + '"/></td>';
            content += '</tr>';
        }
        content += '</tbody></table>';
        $('#dvAllUsers').html(content);
        $('#dvUserSelection').overlay().load();
    }
}

function fnSelectAllUsers() {
    if ($("input:checkbox[name=chkSelectAllUsers]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelectUsers]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelectUsers]").each(function () {
            this.checked = false;
        });
    }
}

function fnFilteredSelection() {
    var unMatchedUsers = "";
    var result = fnValidateUserselectionBasedonDivision();
    var userTypecount = 0;
    if (result) {
        // $('#dvFilteredOutput').hide();
        var selection = $('input:radio[name=rdUserSelection]:checked').val();
        var tblLength = $('#tblUsersPopUp tr').length;
        $("input:checkbox[name=chkSelectUsers]").each(function () {
            this.checked = false;
        });
        $("input:checkbox[name=chkSelection]").each(function () {
            if (this.checked) {
                var chkvalue = this.value;
                if (selection == "U") {
                    $("input:checkbox[name=cheDivisionselection]").each(function () {
                        if (this.checked) {
                            var divisionValue = this.value;
                            var disuserJson = jsonPath(UserDivision_g, "$.[?(@.Division_Code=='" + divisionValue + "' && @.User_Type_Code =='" + chkvalue + "' )]");
                            if (disuserJson != false) {
                                for (var s = 0; s < disuserJson.length ; s++) {
                                    for (var i = 0; i < tblLength; i++) {
                                        if ($('#hdnDivUserCode_' + i).val() == disuserJson[s].Entity_Code) {
                                            $('#chkSelectUsers_' + i).attr('checked', true);
                                            userTypecount++;
                                        }
                                    }
                                }
                            }
                            else {
                                unMatchedUsers = "NO";
                            }
                        }
                    });
                }
                else {
                    $("input:checkbox[name=cheDivisionselection]").each(function () {
                        if (this.checked) {
                            var divisionValue = this.value;
                            var disRegionJson = jsonPath(UserDivision_g, "$.[?(@.Division_Code=='" + divisionValue + "' && @.Region_Type_Code=='" + chkvalue + "')]");
                            if (disRegionJson != false) {
                                for (var s = 0; s < disRegionJson.length ; s++) {
                                    for (var i = 0; i < tblLength; i++) {
                                        if ($('#hdnDivUserCode_' + i).val() == disRegionJson[s].Entity_Code) {
                                            $('#chkSelectUsers_' + i).attr('checked', true);
                                            userTypecount++;
                                        }
                                    }
                                }
                            }
                            else {
                                unMatchedUsers = "NO";
                            }
                        }
                    });
                }
            }
        });
        if (userTypecount == 0) {
            if (unMatchedUsers.toUpperCase() == "NO") {
                fnMsgAlert('info', 'Messaging', 'No users Matched.');
                return false;
            }
        }
    }
}

function fnShowSelection() {
    // $('#dvFilteredOutput').show();

    var selection = $('input:radio[name=rdUserSelection]:checked').val();
    if (selection == "U") {
        fnBindUserType();
    }
    else if (selection == "R") {
        fnBindRegionType();
    }
    else {
    }
    $('#btnShowSelection').show();
}
function fnBindUserType() {
    $('#dvUserSelection').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../HiDoctor_Master/UserTypeMaster/GetUnderUserType/',
        type: "POST",
        data: "A",
        success: function (jsonUserType) {
            userTypecount_g = jsonUserType.length;
            userTypeJson_g = jsonUserType;
            var content = "";
            content += '<div class="col-xs-12 chkStyle">'
            for (var j = 0; j < jsonUserType.length; j++) {
                content += '&nbsp;<input type="checkbox" name="chkSelection" class="clsChkUserType" value="' + jsonUserType[j].User_Type_Code + '" onclick="fnChksingleUserType();"/>'
                            + jsonUserType[j].User_Type_Name;
            }
            content += '&nbsp;<input type="checkbox" id="chkAllUserType" name="chkSelection" value="USERALL" onclick="fnchkAllUserType();"/>Select All';
            content += '</div>';
            $('#dvFilteredOutput').html(content);
        },
        error: function () {
            $("#dvUserSelection").unblock();
        },
        complete: function () {
            $("#dvUserSelection").unblock();
        }
    });
}
function fnBindRegionType() {
    $('#dvUserSelection').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../HiDoctor_Master/RegionType/GetRegionType/',
        type: "POST",
        data: "A",
        success: function (jsonRegionType) {
            regionTypecount_g = jsonRegionType.length;
            regionTyepJson_g = jsonRegionType;
            var content = "";
            content += '<div class="col-xs-12 chkStyle">'
            for (var j = 0; j < jsonRegionType.length; j++) {
                content += '&nbsp;<input type="checkbox" name="chkSelection" class="clsCheckRegionType" value="' + jsonRegionType[j].UserRegionCode + '" onclick="fnRegionTypesingleChk();"/>'
                            + jsonRegionType[j].UserRegionName;

            }
            content += '&nbsp;<input type="checkbox" name="chkSelection" id="chkAllRegionType" value="REGIONALL" onclick="fnchkAllRegionType();"/>Select All';
            content += '</div>';
            $('#dvFilteredOutput').html(content);
        },
        error: function () {
            $("#dvUserSelection").unblock();
        },
        complete: function () {
            $("#dvUserSelection").unblock();
        }
    });
}

function fnBindSelectedUsers() {
    var selectMode = $('#hdnFilterMode').val();

    if (selectMode == "TO") {
        $("input:checkbox[name=chkSelectUsers]").each(function () {
            if (this.checked) {
                var user = this.value;
                $("#txtToUsers").tokenInput("add", { id: user.split('^')[0], name: user.split('^')[1] });
            }
        });
    }
    else {
        $("input:checkbox[name=chkSelectUsers]").each(function () {
            if (this.checked) {
                var user = this.value;
                $("#txtCCUsers").tokenInput("add", { id: user.split('^')[0], name: user.split('^')[1] });
            }
        });
    }
    $('#dvUserSelection').overlay().close();
}

//Messaging - Division Based  -START
function fnGetDevisions() {
    var divcontent = "";
    $.ajax({
        url: '../../Messaging/GetDivisions/',
        type: 'POST',
        data: "A",
        success: function (response) {
            var jsonData = eval(response);
            divisionCount_g = jsonData.length;
            if (jsonData != null && jsonData != '' && jsonData.length > 0) {
                divcontent += '<div class="col-xs-12 chkStyle">'
                divcontent += '<label style="font-weight:bold;">Division(s):</label>';

                for (var s = 0 ; s < jsonData.length ; s++) {

                    divcontent += '&nbsp;<input type="checkbox" name="cheDivisionselection" class="clsCheck" value="' + jsonData[s].Division_Code + '" onclick="fnDivsingleChk();"/>'
                                + jsonData[s].Division_Name;
                }
                divcontent += '&nbsp;<input type="checkbox" name="cheDivisionselection" id="chkAll" value="ALLDIV" onclick="fnDivChkAll();"/>All Divisions';

                $('#divDivisionNames').html(divcontent);
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Messaging', e.responseText);
        }

    });
}
//Messaging - Division Based  -START
function fnGetEntitybyDivisions() {
    var divcontent = "";
    $.ajax({
        url: '../../Messaging/GetEntitycodebyDivision/',
        type: 'POST',
        data: "A",
        success: function (response) {
            var jsonData = eval(response);
            if (jsonData != null && jsonData != '' && jsonData.length > 0) {
                UserDivision_g = jsonData;
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Messaging', e.responseText);
        }

    });
}
//Division All check
function fnDivChkAll() {
    if ($('#chkAll').attr('checked') == 'checked') {
        $('.clsCheck').attr('checked', 'checked')
    }
    else {
        $('.clsCheck').attr('checked', false);
    }
}
//Single Division Check
function fnDivsingleChk() {
    if ($('.clsCheck:checked').length == divisionCount_g) {
        $('#chkAll').attr('checked', 'checked');
    }
    else {
        $('#chkAll').attr('checked', false);
    }
}

//Region Type All check
function fnchkAllRegionType() {
    if ($('#chkAllRegionType').attr('checked') == 'checked') {
        $('.clsCheckRegionType').attr('checked', 'checked')
    }
    else {
        $('.clsCheckRegionType').attr('checked', false);
    }
}
//Single Region Type Check
function fnRegionTypesingleChk() {
    if ($('.clsCheckRegionType:checked').length == regionTypecount_g) {
        $('#chkAllRegionType').attr('checked', 'checked');
    }
    else {
        $('#chkAllRegionType').attr('checked', false);
    }
}
//User Type All check
function fnchkAllUserType() {
    if ($('#chkAllUserType').attr('checked') == 'checked') {
        $('.clsChkUserType').attr('checked', 'checked')
    }
    else {
        $('.clsChkUserType').attr('checked', false);
    }
}
//User Region Type Check
function fnChksingleUserType() {
    if ($('.clsChkUserType:checked').length == userTypecount_g) {
        $('#chkAllUserType').attr('checked', 'checked');
    }
    else {
        $('#chkAllUserType').attr('checked', false);
    }
}

function fnValidateUserselectionBasedonDivision() {
    var selection = $('input:radio[name=rdUserSelection]:checked').val();

    if ($(":checkbox[name=cheDivisionselection]:checked").length == 0) {
        fnMsgAlert('info', 'Messaging', 'Please select Division.');
        return false;
    }

    if (selection == "U") {
        if ($(":checkbox[name=chkSelection]:checked").length == 0) {
            fnMsgAlert('info', 'Messaging', 'Please select User Type.');
            return false;
        }
    }
    else {
        if ($(":checkbox[name=chkSelection]:checked").length == 0) {
            fnMsgAlert('info', 'Messaging', 'Please select Region Type.');
            return false;
        }
    }

    return true;
}



//Messaging - Division Based  -END


//Messaging - OBO User Based  -START

function fnGetOBOAccessedUsers() {
    var divcontent = "";
    //divcontent = "<select id='selOboUser' class='form-control'>";
    //divcontent += "<option value='" + CurrentUserCode + "'>Self</option>";

    divcontent += ' <div class="form-group mb5">';
    divcontent += ' <div class="col-xs-1">';
    divcontent += '   <label style="font-weight: bold;">Users</label>';
    divcontent += '   </div>';
    divcontent += '   <div class="col-xs-10">';
    divcontent += '<select id="selOboUser" class="col-sm-5 form-control" onchange="fnOBOChangeUser(this);">';
    divcontent += "<option value='" + CurrentUserCode + "'>Self</option>";
  

    var Flag = true;
    $.ajax({
        url: '../../Messaging/GetOBOUsers/',
        type: 'POST',
        data: "TypeName=USER",
        async: false,
        success: function (response) {
            var jsonData = eval(response);
            if (jsonData != null && jsonData != '' && jsonData.length > 0) {
                for (var i = 0; i <= jsonData.length - 1; i++) {
                    divcontent += "<option value='" + jsonData[i].User_Code + "'>" + jsonData[i].Employee_Name + " </option>";
                }
            }
            else {
                Flag = false;
            }
        },
        error: function (e) {
            Flag = false;
            fnMsgAlert('error', 'Messaging', e.responseText);
        }
    });

    divcontent += "</select>";
    divcontent += '</div>';
    divcontent += '      </div>';

    if (Flag)
        $("#dvObOPowerTree").html("").html(divcontent);
}
function fnOBOChangeUser(ev) {
   // console.log($(ev).val());
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    debugger;
    $.ajax({
        url: '../../Messaging/GetOBOChildUsersForMessaging/',
        type: "POST",
        data: "UserCode=" + $(ev).val(),
        success: function (jsonResult) {
            debugger;

            if (jsonResult != '') {

                var jsData = eval('(' + jsonResult + ')');
                mappedUserJson_g = jsData;

                var Data = {};
                var EmailerSearch = new Array();

                for (var i = 0; i < jsData.length; i++) {
                    Data = {
                        "id": jsData[i].User_Code,
                        "name": jsData[i].User_Name
                    };
                    EmailerSearch.push(Data);
                }

                usersJson_g = EmailerSearch;

                //Remove Old value it meaning Reset 
                $(".token-input-dropdown-facebook").css('display', 'none');
                var TotokenCopy = $('#txtToUsers').clone();
                //$(' .token-input-list-facebook').remove();

                //$(".users-input-token")
                // .before(TotokenCopy)
                // .remove();
                $("#txtToUsers").show();
                $("#txtCCUsers").show()

                $('.token-input-list-facebook').remove();
                $('.token-input-dropdown-facebook').remove();

                $(".users-input-token").tokenInput(
                [EmailerSearch], {
                    preventDuplicates: true, theme: "facebook", onAdd: function (item) {
                    }
                });
                $('.token-input-list-facebook').css('width', '100%');

              //  fnShowUserSelectionPopUP($('#hdnFilterMode').val());
            }
        },
        error: function () {
            $("#dvMessagingMain").unblock();
        },
        complete: function () {
            $("#dvMessagingMain").unblock();
        }
    });
}
