/*
Js Details
*********************
Created by : Senthil S
For : Mobile Login
Created Date : 21-12-2012
*/

var loginUserName_g = "";
var childUsersCount_g = 0;
function fnUserAuthentication() {
    //validdation
    $("#spnError").html("");
    if ($.trim($("#txtUserName").val()) == "") {
        $("#spnError").html('<br />Please enter UserName/Password<br />');
        return false;
    }
    if ($.trim($("#txtPassword").val()) == "") {
        $("#spnError").html('<br />Please enter UserName/Password<br />');
        return false;
    }
    $.ajax({
        type: "POST",
        url: '/Home/GetLogin',
        data: "userName=" + $("#txtUserName").val() + "&password=" + $("#txtPassword").val() + "&latitude=" + latitude_g + "&longitude=" + longitude_g + "&sourceOfEntry=MOBILE&UA="+escape(navigator.userAgent),
        success: function (result) {

            if (result.indexOf("SUCCESS") > -1) {
                fnmGetAllPrivileges();
            }
            else {
                $("#spnError").html(result);
            }

        }
    });
}

function fnOpenPassword() {
    $.mobile.changePage("/HiDoctor_Activity/ForgotPassword/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}


function fnLogin() {
    $.mobile.changePage("/HiDoctor_Activity/Login/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}



/* Menu starts here*/
//to get the notification in page load
function fnGetNotification() {
    $("#spnNotificationHeader").hide();
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileMenu/GetNotification',
        data: "a",
        success: function (result) {
            result = eval('(' + result + ')');
            $("#spnNotificationHeader").hide();
            if (result.Tables[0].Rows.length > 0 && result.Tables[0].Rows[0].COUNT != 0) {
                $('#legUnapproveDCR').css('display', 'block');
                $('#spnUnappDCRCount').css('display', 'inline-block');
                $("#spnNotificationHeader").show();
                $("#spnNotification").html(result.Tables[0].Rows[0].COUNT);
                $('#menuNotification').removeClass('menuhidden');
            }


            //var showApproval = fnGetPrivilegeValue("IS_MOBILE_DCR_APPROVAL_REQUIRED", "NO");

            //if (showApproval == "YES") {
            //    // $('#menuApproval').removeClass('menuhidden');            
            //    if (result.Tables[1].Rows.length > 0 && result.Tables[1].Rows[0].Count != 0) {
            //        $('#legPendingDCR').css('display', 'block');
            //        $('#spnPendDCRCount').css('display', 'inline-block');
            //        $("#spnPenndingDCRBG").show();
            //        $("#spnPendingDCR").append(result.Tables[1].Rows[0].Count);
            //    }
            //}
        }
    });
}

function fnGetUnreadMessageCount() {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileNotification/GetUnreadMessageCount',
        data: "a",
        success: function (result) {
            $("#spnMessages").html(result);
        }
    });
}

function fnGetUnreadAnnouncementCount() {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileNotification/GetUnreadAnnouncementCount',
        data: "a",
        success: function (result) {
            $("#spnAnnouncements").html(result);
        }
    });
}

function fnGetChildUsers() {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileMenu/GetChildUsers',
        success: function (result) {
            childUsersCount_g = result;
            $('#menuNotification').removeClass('menuhidden');
            var showApproval = fnGetPrivilegeValue("IS_MOBILE_DCR_APPROVAL_REQUIRED", "NO");
            if (showApproval == "YES") {
                if (childUsersCount_g.length > 1) {
                    $('#menuApproval').removeClass('menuhidden');
                    $('#menuDCRLockRealese').removeClass('menuhidden');
                }
            }
            else {
                if (childUsersCount_g.length > 1) {
                    $('#menuApproval').removeClass('menuhidden');
                    $('#menuDCRLockRealese').removeClass('menuhidden');


                }
            }
        }
    });
}

//DCR Entry click in mobile menu
function fnOpenDCR() {

    $.mobile.changePage("/HiDoctor_Activity/DCRCalendar/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}
//Function to open DCR Approval Screen
function fnGoToDCRApproval() {
    $.mobile.changePage("/HiDoctor_Activity/DCRApproval/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnGoToNotification() {
    $.mobile.changePage("/HiDoctor_Activity/MobileNotification/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnGoToMessages() {
    $.mobile.changePage("/HiDoctor_Activity/MobileNotification/Messages", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnGoToAnnouncements() {
    $.mobile.changePage("/HiDoctor_Activity/MobileNotification/Announcements", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnReport() {

    $.mobile.changePage("/HiDoctor_Activity/MobileReports/ReportsHome", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

//Function to open DCR Approval Screen
function fnGoToOTC() {
    $.mobile.changePage("/HiDoctor_Activity/OTC/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnGoToDCRLockRealese() {
    $.mobile.changePage("/HiDoctor_Activity/MobileNotification/DCRLockRelease", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}



/*Menu ends here */


function fnOk() {
    $.mobile.changePage("/HiDoctor_Activity/MobileMenu/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
    //$("#spnUserName").html("Welcome " + $("#txtUserName").val() + "");
    fnmGetAllPrivileges();

}

function fnLogOut() {
    // if ($.inArray(window.location.host, denysites) == -1) {
    if (isdenied == 0) {
        $.mobile.changePage("/Home/Create?id=L", {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
   // }
}

// This method is called when the page is loaded
function fninit() {
    if ($("#hdnNeedGeo").val().toUpperCase() == "YES") {
        // Check if the device supports HTML5 geolocation
        if (!(navigator && navigator.geolocation)) {
            //GEO object not supported
        }
        else {
            //GEO object supported
            //  navigator.geolocation.getCurrentPosition(setMap, positionError);

            getLocation();
        }
    }
}

// GEO Suceess callback			
function setMap(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    latitude_g = latitude;
    longitude_g = longitude;
}

// GEO failure callback	
function positionError(error) {
    //
}


function showLocation(position) {

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    latitude_g = latitude;
    longitude_g = longitude;

}

function errorHandler(err) {
    if (err.code == 1) {
        alert("Error: Access is denied!");
    } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
    }
}
function getLocation() {

    if (navigator.geolocation) {
        // timeout at 60000 milliseconds (60 seconds)


        navigator.geolocation.getCurrentPosition(showLocation, errorHandler);

    } else {
        alert("Sorry, browser does not support geolocation!");
    }
}
//Get Menuaccess for Mobile
function fnGetMenuAccessforMobile() {
    userperrpt_g = "";
    tprpt_g = "";
    activesumrpt_g = "";
    $.ajax({
        data: "A",
        url: "/HiDoctor_Master/MenuMaster/GetMenuaccessforMobile",
        type: "POST",
        success: function (data) {
            var lstMenues = eval(data);
            if (lstMenues != null && lstMenues.length > 0 && lstMenues != undefined) {
                for (var s = 0 ; s < lstMenues.length ; s++) {
                    var menuURL = lstMenues[s].Menu_URL;
                    if (menuURL.toUpperCase() == 'HIDOCTOR_ACTIVITY/DCRCALENDAR/INDEX') {
                        $('#menuDCR').removeClass('menuhidden');
                        $('#menuDCR').addClass('menuShow');

                        $('#menuNotification').removeClass('menuhidden');
                        $('#menuNotification').addClass('menuShow');
                        fnGetNotification();
                    }
                    else if (menuURL.toUpperCase() == 'HIDOCTOR_MASTER/APPROVAL/DCRLOCKRELEASE') {
                        $('#menuDCRLock').removeClass('menuhidden');
                        $('#menuDCRLock').addClass('menuShow');
                    }

                    else if (menuURL.toUpperCase() == 'HIDOCTOR_MASTER/APPROVAL/DCRAPPROVAL') {
                        $('#menuApproval').removeClass('menuhidden');
                        $('#menuApproval').addClass('menuShow');
                    }

                    else if (menuURL.toUpperCase() == 'MESSAGING/INDEX') {
                        $('#menuMessage').removeClass('menuhidden');
                        $('#menuMessage').addClass('menuShow');
                        fnGetUnreadMessageCount();
                    }

                    else if (menuURL.toUpperCase() == 'HIDOCTOR_ACTIVITY/NOTICEBOARD/NOTICEBOARDREAD') {
                        $('#menuAnnouncement').removeClass('menuhidden');
                        $('#menuAnnouncement').addClass('menuShow');
                        fnGetUnreadAnnouncementCount();
                    }

                    else if (menuURL.toUpperCase() == 'HIDOCTOR_REPORTS/REPORTS/USERPERDAYREPORT') {
                        userperrpt_g = "USER";
                        $('#menuReports').removeClass('menuhidden');
                        $('#menuReports').addClass('menuShow');
                    }

                    else if (menuURL.toUpperCase() == 'HIDOCTOR_REPORTS/REPORTS/TPREPORT') {
                        tprpt_g = "TP";
                        $('#menuReports').removeClass('menuhidden');
                        $('#menuReports').addClass('menuShow');
                    }

                    else if (menuURL.toUpperCase() == 'HIDOCTOR_REPORTS/REPORTS/COMPREHENSIVEANALYSISREPORT' || 'HIDOCTOR_REPORTS/AYSNCREPORTS/ASYNCCOMPREHENSIVEANALYSISREPORT') {
                        activesumrpt_g = "ACT";
                        $('#menuReports').removeClass('menuhidden');
                        $('#menuReports').addClass('menuShow');
                    }
                }
            }
        }

    });
}

//Function used to redirect the DCR Lock release
function fnShowDCRLockRelease() {
    $.mobile.changePage("/HiDoctor_Activity/MobileNotification/DCRLockRelease", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}
