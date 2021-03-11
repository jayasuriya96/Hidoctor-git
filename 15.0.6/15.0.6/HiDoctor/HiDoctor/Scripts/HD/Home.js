
function fnGetNotifications() {
    $('#dvMainAnnounce').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Home/GetHomePageNotification/',
        type: "POST",
        data: "A",
        success: function (content) {
            $("#dvAnnouncement").html(content);
        },
        error: function () {
            $("#dvMainAnnounce").unblock();
        },
        complete: function () {
            $("#dvMainAnnounce").unblock();
        }
    });
}

function fnGetMessages() {
    $('#dvMainMsg').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Home/GetHomePageMessages/',
        type: "POST",
        data: "A",
        success: function (content) {
            $("#dvMsg").html(content);
        },
        error: function () {
            $("#dvMainMsg").unblock();
        },
        complete: function () {
            $("#dvMainMsg").unblock();
        }
    });
}

function fnShowMeeting() {
    $('#dvMainAlerts').block({
        message: '...',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Home/GetHomePageMeetingPoint/',
        type: "POST",
        data: "A",
        success: function (content) {
            $("#dvMeeting").show();
            $("#dvMeeting").html(content);
            $('#dvMeeting').css('height', '');
            $('#dvMeeting').css('min-height', '');
        },
        error: function () {
            $("#dvMainAlerts").unblock();
        },
        complete: function () {
            $("#dvMainAlerts").unblock();
        }
    });
}

function fnShowBirthdays() {
    $('#dvMainAlerts').block({
        message: '...',
        css: { border: '2px solid #ddd' }
    });
    $('#dvBirthday').css('height', '0px');
    $('#dvBirthday').css('display', 'none');
    $.ajax({
        url: '../../Home/GetBirthdayAlertforChildUsers/',
        type: "POST",
        data: "A",
        success: function (content) {
            if (content != null && content != '') {
                $('#dvshowBirthdayAlertsforchildusers').html(content);
                ShowModalPopup('dvLoadingDoctorsBirthdayAlerts');
            }           
        },
        error: function () {
            $("#dvMainAlerts").unblock();
            //$('#dvBirthday').css('min-height', '');
        },
        complete: function () {
            $("#dvMainAlerts").unblock();
        }
    });
}


function fnShowAnniversary() {
    $('#dvMainAlerts').block({
        message: '...',
        css: { border: '2px solid #ddd' }
    });
    $('#dvAnniversary').css('height', '0px');
    $('#dvAnniversary').css('display', 'none');
    $.ajax({
        url: '../../Home/GetAnniversaryAlertforChildUsers/',
        type: "POST",
        data: "A",
        success: function (content) {
            if(content != null && content != ''){
                $('#dvshowAnniversaryAlertsforchildusers').html(content);
                ShowModalPopup('dvLoadingDoctorsAnniversaryAlerts');
            }          
        },
        error: function () {
            $("#dvMainAlerts").unblock();
        },
        complete: function () {
            $("#dvMainAlerts").unblock();
        }
    });
}

function fnShowHoliday() {
    $('#dvMainAlerts').block({
        message: '...',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Home/GetHomePageHolidayAlert/',
        type: "POST",
        data: "A",
        success: function (content) {
            $("#dvHoliday").show();
            $("#dvHoliday").html(content);
            $('#dvHoliday').css('height', '');
            $('#dvHoliday').css('min-height', '');
        },
        error: function () {
            $("#dvMainAlerts").unblock();
        },
        complete: function () {
            $("#dvMainAlerts").unblock();
        }
    });
}


function fnGetCALCDetails() {
    $('#dvCalcFields').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../../Home/GetHomePageCALCFieldsData/',
        type: "POST",
        data: "A",
        success: function (content) {
            if (content != '' && content != undefined) {
                if (content.split('$').length > 2) {
                    var ar = content.split('$');
                    $("#dvActivity").html(ar[0]);
                    $("#dvData").html(ar[1]);
                    $("#dvExp").html(ar[2]);
                }
            }
        },
        error: function () {
            $("dvCalcFields").unblock();
        },
        complete: function () {
            $("#dvCalcFields").unblock();
        }
    });
}


function fnGoToNotificationScreen() {
    var count = 0;
    for (var i = 0; i < menuContent_g.Tables[0].Rows.length; i++) {
        if (menuContent_g.Tables[0].Rows[i].Menu_URL != null) {
            var menuUrl = menuContent_g.Tables[0].Rows[i].Menu_URL;
            var menuText = menuContent_g.Tables[0].Rows[i].Menu_Text;
            if (menuUrl.toUpperCase() == 'HIDOCTOR_ACTIVITY/NOTICEBOARD/NOTICEBOARDREAD') {
                count++;
                $("#main").load('HiDoctor_Activity/NoticeBoard/NoticeBoardRead');
                $('#dvPageHeader').html(menuText);
                return;
            }
        }
    }
    if (count == 0) {
        fnMsgAlert('info', 'Info', 'You do not have access to this page');
        return;
    }

    //var disJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/NoticeBoardRead/Create')]");
    //if (disJson != false) {
    //    //fnLoadBody(disJson[0].Menu_URL, '', disJson[0].Menu_Id);
    //    $("#main").load('HiDoctor_Master/NoticeBoardRead/Create');
    //    $('#dvPageHeader').html('Notice board Master');
    //}
    //else {
    //    fnMsgAlert('info', 'Info', 'You do not have access to this page');
    //    return;
    //}
    ////$("#main").load('HiDoctor_Master/NoticeBoardRead/Create');
}

function fnGoToMessageScreen() {
    var count = 0;
    for (var i = 0; i < menuContent_g.Tables[0].Rows.length; i++) {
        if (menuContent_g.Tables[0].Rows[i].Menu_URL != null) {
            var menuUrl = menuContent_g.Tables[0].Rows[i].Menu_URL;
            var menuText = menuContent_g.Tables[0].Rows[i].Menu_Text;
            //if (menuUrl.toUpperCase() == '~/SCREENSHOME/MESSAGING.ASPX') {
            if (menuUrl.toUpperCase() == 'MESSAGING/INDEX') {
                count++;
                fnLoadBody(menuContent_g.Tables[0].Rows[i].Menu_URL, '', menuContent_g.Tables[0].Rows[i].Menu_Id);
                $('#dvPageHeader').html(menuText);
                return;
            }
        }
    }
    if (count == 0) {
        fnMsgAlert('info', 'Info', 'You do not have access to this page');
        return;
    }
    ////Get Birthday alert for child users doctors list
    //function fnGetChildUserDoctorsBdayAlert(value) {   
    //    $('#dvMainAlerts').block({
    //        message: '...',
    //        css: { border: '2px solid #ddd' }
    //    });
    //    var regionCode = value;
    //    $.ajax({
    //        url: '../../Home/GetBirthdayAlertforChildUsers/',
    //        type: 'POST',
    //        data: {'regionCode' : regionCode},
    //        success: function (response) {    
    //            if (response != null && response != undefined && response.length > 0) {
    //                $('#dvshowBirthdayAlertsforchildusers').html(response);
    //                ShowModalPopup('dvLoadingDoctorsBirthdayAlerts');
    //            }
    //        },
    //        error: function () {
    //            $("#dvMainAlerts").unblock();
    //        },
    //        complete: function () {
    //            $("#dvMainAlerts").unblock();
    //        }
    //    });
    //}

    //function fnGetChildUserDoctorsAnniversaryAlert(value) {
    //    $('#dvMainAlerts').block({
    //        message: '...',
    //        css: { border: '2px solid #ddd' }
    //    });
    //    var regionCode = value;
    //    $.ajax({
    //        url: '../../Home/GetAnniversaryAlertforChildUsers/',
    //        type: 'POST',
    //        data: { 'regionCode': regionCode },
    //        success: function (response) {
    //            if (response != null && response != undefined && response.length > 0) {
    //                $('#dvshowAnniversaryAlertsforchildusers').html(response);
    //                ShowModalPopup('dvLoadingDoctorsAnniversaryAlerts');
    //            }
    //        },
    //        error: function () {
    //            $("#dvMainAlerts").unblock();
    //        },
    //        complete: function () {
    //            $("#dvMainAlerts").unblock();
    //        }
    //    });
}