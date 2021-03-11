function ToJavaScriptDate(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear();
}
var LandingPage = {
    _defaults: {
        companyCode: "",
        userCode: "",
    },
    
    fnEventBinder: function () {
        $(".inwardack").unbind("click").bind("click", function () { LandingPage.fnRedirectToInwardAck() });
        $(".popupclose").unbind("click").bind("click", function () { LandingPage.fnOverlayClose(); })

    },
    OnInit: function () {

        LandingPage.fnEventBinder();
        $.ajax({
            type: 'GET',
            url: " DashBoardLandingPage/GetDCRPendingApprovalCountForTeam",
            success: function (response) {
                //$('#dvDCRApprovalCount').html(response);
                if (response != null) {
                    $(".teamDCRapprovalcount").html(response + " User(s)");
                    if (response > 0) {
                        $(".teamDCRapprovalcount").css("cursor", "pointer");
                        $(".teamDCRapprovalcount").unbind("click").bind("click", function () { LandingPage.fnShowTeamDCRDetails(); });
                    }
                }
                else {
                    $(".teamDCRapprovalcount").html("0 User(s)");
                }
                LandingPage.fnGetTPApprovalCount();
            },
            error: function (response) {

            }
        });
    },

    fnGetTPApprovalCount: function () {
        $.ajax({
            type: 'GET',
            url: " DashBoardLandingPage/GetTPPendingApprovalCountForTeam",
            success: function (response) {
                if (response != null) {
                    $(".teamTPapprovalcount").html(response + " User(s)");
                    if (response > 0) {
                        $(".teamTPapprovalcount").css("cursor", "pointer");
                        $(".teamTPapprovalcount").unbind("click").bind("click", function () { LandingPage.fnShowTeamTPDetails(); });
                    }

                }
                else {
                    $(".teamTPapprovalcount").html("0 User(s)");
                }
                LandingPage.fnGetExpenseClaimApprovalCount();
            },
            error: function (response) {

            }
        });
    },

    fnGetExpenseClaimApprovalCount: function () {
        debugger;
        $.ajax({
            type: 'GET',
            url: " DashBoardLandingPage/GetExpenseClaimPendingApprovalCountForTeam",
            success: function (response) {
                if (response != null) {
                    $(".teamExpClaimapprovalcount").html(response + " User(s)");
                    if (response > 0) {
                        $(".teamExpClaimapprovalcount").css("cursor", "pointer");
                        $(".teamExpClaimapprovalcount").unbind("click").bind("click", function () { LandingPage.fnShowTeamExpenseClaimDetails(); });
                    }
                }
                else {
                    $(".teamExpClaimapprovalcount").html("0 User(s)");
                }
                LandingPage.fnGetLockDetails();
                //LandingPage.fnGetMyDCRUnapproveCount();
            },
            error: function (response) {

            }
        });
    },

    fnGetLockDetails: function () {
        debugger;
        var r = '';
        $.ajax({
            type: 'GET',
            url: 'DashBoardLandingPage/GetLockDetails',
            success: function (result) {
                debugger;
                if (result != null) {
                    $('.totalLocks').html(result[0].Total_Locks);
                    $('.activeLocks').html(result[0].Active_Locks);
                    $('.disabledLocks').html(result[0].Released_Locks);
                }
                LandingPage.fnGetMyDCRUnapproveCount();
            },
            error: function (result) {

            }
        });
    },
    fnGetMyDCRUnapproveCount: function () {
        $.ajax({
            type: 'GET',
            url: " DashBoardLandingPage/GetMyDCRUnapprovedCount",
            success: function (response) {
                $('.myrejectDCR').html(response);
                if (response > 0) {
                    $(".myrejectDCR").css("cursor", "pointer");
                    $(".myrejectDCR").unbind("click").bind("click", function () { LandingPage.fnMyGetUnapproveDCR() });
                }
                LandingPage.fnGetMyTPUnapproveCount();
            },
            error: function (response) {

            }
        });
    },
    fnGetMyTPUnapproveCount: function () {
        debugger;
        $.ajax({
            type: 'GET',
            url: " DashBoardLandingPage/GetMyTPUnapprovedCount",
            success: function (response) {
                $('.myrejectTP').html(response);
                if (response > 0) {
                    $(".myrejectTP").css("cursor", "pointer");
                    $(".myrejectTP").unbind("click").bind("click", function () { LandingPage.fnMyGetUnapproveTP(); });
                }
                LandingPage.fnGetMyExpenseClaimUnapproveCount();
            },
            error: function (response) {

            }
        });
    },
    fnGetMyExpenseClaimUnapproveCount: function () {
        $.ajax({
            type: 'GET',
            url: " DashBoardLandingPage/GetMyExpenseClaimUnapprovedCount",
            success: function (response) {
                $('.myrejectExpClaim').html(response);
                if (response > 0) {
                    $(".myrejectExpClaim").css("cursor", "pointer");
                    $(".myrejectExpClaim").unbind("click").bind("click", function () { LandingPage.fnMyGetUnapproveExpenseClaim(); });
                }
                LandingPage.fnGetUnreadMessageCount();
            },
            error: function (response) {

            }
        });
    },



    fnGetUnreadMessageCount: function () {
        $.ajax({
            type: 'GET',
            url: " DashBoardLandingPage/GetMyUnreadMessageCount",
            success: function (response) {
                $('.myunreadmessaging').html(response);
                if (response > 0) {
                    $(".myunreadmessaging").css("cursor", "pointer");
                    $(".myunreadmessaging").unbind("click").bind("click", function () { LandingPage.fnRedirectToMessaging(); });
                }

                LandingPage.fnGetUnreadNotification();

            },
            error: function (response) {

            }
        });
    },
    fnGetUnreadNotification: function () {
        $.ajax({
            type: 'GET',
            url: " DashBoardLandingPage/GetMyUnreadNoticeBoard",
            success: function (response) {
                $('.myunreadnotices').html(response);
                if (response > 0) {
                    $(".myunreadnotices").css("cursor", "pointer");
                    $(".myunreadnotices").unbind("click").bind("click", function () { LandingPage.fnRedirectToNotice(); });
                }
                LandingPage.fnGetTaskCount();
            },
            error: function (response) {

            }
        });
    },
    fnGetTaskCount: function () {
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetMyTaskCount",
            success: function (response) {

                if (response != null && response.length > 0) {
                    $('.mypendingtask').html(response[0].Task_Count);
                    if (response[0].Task_Count > 0) {
                        $(".mypendingtask").css("cursor", "pointer");
                        $(".mypendingtask").unbind("click").bind("click", function () { LandingPage.fnRedirectToTask() });
                    }
                }

                LandingPage.fnGetInwardAckment();
            },
            error: function (response) {

            }
        });
    },
    fnGetInwardAckment: function () {
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetUserDashboardInwardAcknowlegementConfigValue",
            success: function (response) {
                if (response != null && response == "YES") {
                    $(".box_inwardack").css("display", "block");
                    $('.inwardack').html('*');
                    $(".inwardack").css("cursor", "pointer");
                }
            },
            error: function (response) {

            }
        });
    },




    fnShowTeamDCRDetails: function () {
        debugger;
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetDCRPendingUserList",
            success: function (response) {

                //if (response > 0) {
                LandingPage.fnBindDCRPendingUserList(response);
                //}
            },
            error: function (response) {

            }
        });
    },

    fnBindDCRPendingUserList: function (response) {
        debugger;
        var contentUserDetails = "";

        for (var i = 0; i < response.length; i++) {
            contentUserDetails += '<div class="col-sm-12 userDetail" style="height:40px;padding: 10px 12px 12px;margin-top: 0.5%;cursor: pointer;background-color:blueviolet;color:#fff" onclick="LandingPage.fnToggleDCR(this,\'' + response[i].UserCode + '\');" >';
            contentUserDetails += '<div style="float:left">';
            contentUserDetails += '<span class="headinguser">' + response[i].EmployeeName + "(" + response[i].UserTypeName + ") - " + response[i].Count + '</span>';
            contentUserDetails += '</div>';

            contentUserDetails += '<div style="text-align:right;">';
            // contentUserDetails += '<span style="font-size: 16px;margin-right: 20px;"><i class="fa fa-print" aria-hidden="true"></i></span>';
            var expandIcon = '<div class="clsicon_' + response[i].UserCode + '" ><i class="fa fa-plus" aria-hidden="true"></i></div>';//  '<i class="fa fa-plus" aria-hidden="true"></i>';
            contentUserDetails += '<span  style="font-size:14px">' + expandIcon + '</span>';
            contentUserDetails += '</div>';
            contentUserDetails += '</div>';
            contentUserDetails += '<div style="display:none;background-color:#fff;color:#222" class="cls_' + response[i].UserCode + '">';
            //contentUserDetails +='<table class="table table-bordered maintable" border=0 cellspacing=0 cellpadding=0  style="width:100%"><thead><tr><th>DCR Date</th><th>Activity</th><th>Entered Date</th></tr></thead>';
            //contentUserDetails +='<tbody><tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr></tbody>'
            //contentUserDetails +='<tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr>'
            //contentUserDetails +='<tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr>'
            //contentUserDetails +='</table>'
            contentUserDetails += '</div>'

            //content += " <div style='width:100%;float:left;font-size:11.5px;padding:5px;'>" + response[i].EmployeeName + "(" + response[i].UserTypeName + ") - " + response[i].Count;
        }
        $('.modal-body').html(contentUserDetails);
        //content += " <div style='width:100%;float:left;font-size:11.5px;padding:5px;'>";
        //content += "<table class='table table-bordered maintable' border=0 cellspacing=0 cellpadding=0>";
        //content += "<thead>";
        //content += "<tr>";
        //content += "<th nowrap class='freezecolumns'> Employee Name </th>";
        //content += "<th nowrap class='freezecolumns'> Designation </th>";
        //content += "<th nowrap class='freezecolumns'> Count </th>";
        //content += "</tr>";
        //content += "</thead>";

        //content += "<tbody>";
        //for (var i = 0; i < response.length; i++) {
        //    content += "<tr data-key='"+response[i].UserCode+"'>";
        //    content += "<td>" + response[i].EmployeeName + "</td>";
        //    content += "<td>" + response[i].UserTypeName + "</td>";
        //    content += "<td>" + response[i].Count + "</td>";
        //    content += "</tr>";
        //}
        //content += "</tbody>";
        //content += "</table>";

        $(".modal-title").html("DCR Approval pending User List");
        $('#Modal').modal("show");
        // $('.popupcontent').html(content);
        // $("#DetailsModel").overlay().load();
    },

    fnToggleDCR: function (obj, key) {
        if ($(".cls_" + key).css("display") == "none") {
            $.ajax({
                type: 'GET',
                url: "DashBoardLandingPage/GetAppliedDCR",
                data: "userCode=" + key,
                success: function (response) {

                    //if (response > 0) {
                    LandingPage.fnBindDCRDetails(response, key);
                    //}
                },
                error: function (response) {

                }
            });


            if ($(".cls_" + key).css("display") == "none") {
                $(".cls_" + key).css("display", "block");
                $(".clsicon_" + key).html('<i class="fa fa-minus" aria-hidden="true">');
            }
            else {
                $(".cls_" + key).css("display", "none");
                $(".clsicon_" + key).html('<i class="fa fa-plus" aria-hidden="true"></i>');
            }
        }
        else {
            $(".cls_" + key).css("display", "none");
            $(".clsicon_" + key).html('<i class="fa fa-plus" aria-hidden="true">');
        }
    },

    fnBindDCRDetails: function (res, key) {
        debugger;
        var content = "";
        content += "<table class='table table-bordered maintable' border=0 cellspacing=0 cellpadding=0>";
        content += "<thead>";
        content += "<tr>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> DCR Date </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;' > Activity </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;' > Entered Date </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;' > Action </th>";
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";

        for (var i = 0; i < res.length; i++) {
            var screenName = "Dashboard";
            content += "<tr >";
            content += "<td>" + ToJavaScriptDate(res[i].DCRDate) + "</td>";
            content += "<td>" + res[i].Flag + "</td>";
            content += "<td>" + ToJavaScriptDate(res[i].DCREnteredDate) + "</td>";
            content += "<td>" + "<span class='clsUserper' onclick='LandingPage.fnShowDCRPopupReport(\"" + res[i].User_Code + "|" + res[i].DCRDate + "|" + res[i].Region_Code + "|" + res[i].Flag + "|" + res[i].DCR_Status + "|" + res[i].Month + "|" + res[i].Year + "|" + res[i].dcrStatus + "|" + res[i].flag + "|" + res[i].DCR_Code + "|" + res[i].Unapproval_Reason + "|" + res[i].Leave_Type_Name + "|" + res[i].Source_Of_Entry + "|" + screenName + "|" + res[i].User_Name + "|" + res[i].User_Type_Name + "(" + res[i].Region_Name + ")" + "|" + res[i].Place_Worked + "|" + res[i].Employee_Name + "|" + res[i].Division_Name + "|" + res[i].DCREnteredDate + "|" + res[i].User_Type_Name + "|" + res[i].Employee_Number + "\")' style='text-decoration:underline;cursor:pointer'>View Report</span>" + "</td>";
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";
        $(".cls_" + key).html("");
        $(".cls_" + key).html(content);
        if ($(".cls_" + key).css("display") == "none") {
            $(".cls_" + key).css("display", "block");
            $(".clsicon_" + key).html('<i class="fa fa-minus" aria-hidden="true">');
        }


    },

    fnBindTPPendingUserList: function (response) {
        debugger;
        var contentUserDetails = "";

        for (var i = 0; i < response.length; i++) {
            contentUserDetails += '<div class="col-sm-12 userDetail" style="height:40px;padding: 10px 12px 12px;margin-top: 0.5%;cursor: pointer;background-color:blueviolet;color:#fff" onclick="LandingPage.fnToggleTP(this,\'' + response[i].UserCode + '\',\'' + response[i].TPType + '\');" >';
            contentUserDetails += '<div style="float:left">';
            contentUserDetails += '<span class="headinguser">' + response[i].EmployeeName + "(" + response[i].UserTypeName + ") - " + response[i].Count + '</span>';
            contentUserDetails += '</div>';

            contentUserDetails += '<div style="text-align:right;">';
            // contentUserDetails += '<span style="font-size: 16px;margin-right: 20px;"><i class="fa fa-print" aria-hidden="true"></i></span>';
            var expandIcon = '<div class="clsicon_' + response[i].UserCode + '" ><i class="fa fa-plus" aria-hidden="true"></i></div>';//  '<i class="fa fa-plus" aria-hidden="true"></i>';
            contentUserDetails += '<span  style="font-size:14px">' + expandIcon + '</span>';
            contentUserDetails += '</div>';
            contentUserDetails += '</div>';
            contentUserDetails += '<div style="display:none;background-color:#fff;color:#222" class="cls_' + response[i].UserCode + '">';
            //contentUserDetails +='<table class="table table-bordered maintable" border=0 cellspacing=0 cellpadding=0  style="width:100%"><thead><tr><th>DCR Date</th><th>Activity</th><th>Entered Date</th></tr></thead>';
            //contentUserDetails +='<tbody><tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr></tbody>'
            //contentUserDetails +='<tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr>'
            //contentUserDetails +='<tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr>'
            //contentUserDetails +='</table>'
            contentUserDetails += '</div>'

            //content += " <div style='width:100%;float:left;font-size:11.5px;padding:5px;'>" + response[i].EmployeeName + "(" + response[i].UserTypeName + ") - " + response[i].Count;
        }

        $('.modal-body').html(contentUserDetails);
        $('#Modal').modal("show");
        $(".modal-title").html("TP Approval pending User List");
        // $('.popupcontent').html(content);
        // $("#DetailsModel").overlay().load();

        //var content = "";
        //content += " <div style='width:100%;float:left;font-size:11.5px'>";
        //content += "<table class='table table-bordered maintable' border=0 cellspacing=0 cellpadding=0>";
        //content += "<thead>";
        //content += "<tr>";
        //content += "<th nowrap class='freezecolumns'> Employee Name </th>";
        //content += "<th nowrap class='freezecolumns'> Designation </th>";
        //content += "<th nowrap class='freezecolumns'> Count </th>";
        //content += "</tr>";
        //content += "</thead>";
        //content += "<tbody>";
        //for (var i = 0; i < response.length; i++) {
        //    content += "<tr data-key='" + response[i].UserCode + "'>";
        //    content += "<td>" + response[i].EmployeeName + "</td>";
        //    content += "<td>" + response[i].UserTypeName + "</td>";
        //    content += "<td>" + response[i].Count + "</td>";
        //    content += "</tr>";
        //}
        //content += "</tbody>";
        //content += "</table>";
        //$(".popuptitle").html("TP Pending User List");
        //$('.popupcontent').html(content);
        //$("#DetailsModel").overlay().load();
    },


    fnToggleTP: function (obj, key, TPType) {
        debugger;
        if ($(".cls_" + key).css("display") == "none") {
            $.ajax({
                type: 'GET',
                url: "DashBoardLandingPage/GetAppliedTPList",
                data: "userCode=" + key +"&tptype=" + TPType,
                success: function (response) {
                    debugger;
                    //if (response > 0) {
                    LandingPage.fnBindTPDetails(response, key);
                    //}
                },
                error: function (response) {

                }
            });


            if ($(".cls_" + key).css("display") == "none") {
                $(".cls_" + key).css("display", "block");
                $(".clsicon_" + key).html('<i class="fa fa-minus" aria-hidden="true">');
            }
            else {
                $(".cls_" + key).css("display", "none");
                $(".clsicon_" + key).html('<i class="fa fa-plus" aria-hidden="true"></i>');
            }
        }
        else {
            $(".cls_" + key).css("display", "none");
            $(".clsicon_" + key).html('<i class="fa fa-plus" aria-hidden="true">');
        }
    },


    fnBindTPDetails: function (res, key) {
        debugger;
        var content = "";
        content += "<table class='table table-bordered maintable' border=0 cellspacing=0 cellpadding=0>";
        content += "<thead>";
        content += "<tr>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> TP Date </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Activity </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Entered Date </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Action </th>";
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";

        for (var i = 0; i < res.length; i++) {
            var screenName = "Dashboard";
            content += "<tr >";
            content += "<td>" + ToJavaScriptDate(res[i].TPDate) + "</td>";
            content += "<td>" + res[i].Activity + "</td>";
            content += "<td>" + ToJavaScriptDate(res[i].TPEnteredDate) + "</td>";
            content += "<td>" + "<span class='clsUserper' onclick='LandingPage.fnShowTPPopupReport(\"" + res[i].TP_Id + "|" + screenName + "|" + ToJavaScriptDate(res[i].TPDate) + "\")' style='text-decoration:underline;cursor:pointer'>View Report</span>" + "</td>";
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";
        $(".cls_" + key).html("");
        $(".cls_" + key).html(content);
        if ($(".cls_" + key).css("display") == "none") {
            $(".cls_" + key).css("display", "block");
            $(".clsicon_" + key).html('<i class="fa fa-minus" aria-hidden="true">');
        }


    },

    fnShowTeamTPDetails: function () {
        debugger;
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetTPPendingUserList",


            success: function (response) {
                LandingPage.fnBindTPPendingUserList(response);
                //
                //
                //var content = "";
                //content += " <div style='width:48%;float:left;font-size:11.5px'>";
                //content += "<table border=0 cellspacing=0 cellpadding=0>";
                //content += "<thead>";
                //content += "<tr>";
                //content += "<th nowrap class='freezecolumns'> User Name </th>";
                //content += "<th nowrap class='freezecolumns'> Activity </th>";
                //content += "<th nowrap class='freezecolumns'> TP Date </th>";
                //content += "<th nowrap class='freezecolumns'> Category Name </th>";
                //content += "<th nowrap class='freezecolumns'> Work Place </th>";
                //content += "</tr>";

                //for (var i = 0; i < response.length; i++) {
                //    content += "<tr>";
                //    var activity = "";
                //    if (response[i].Activity_Name != "") {
                //        activity = "Attendence";
                //    }
                //    else if (response[i].Project_Code != "") {
                //        activity = "Field";
                //    }
                //    else if (response[i].LeaveTypeName != "") {
                //        activity = "Leave";
                //    }
                //    //var LeaveReason = "";
                //    //if (activity == "Leave")
                //    //{
                //    //    LeaveReason = response[i].LeaveTypeName;
                //    //}
                //    content += "<td>" + response[i].User_Name + "<td>";
                //    content += "<td>" + activity + "<td>";
                //    content += "<td>" + response[i].TP_Date + "<td>";
                //    content += "<td>" + response[i].Category + "<td>";
                //    content += "<td>" + response[i].Place_Worked + "<td>";

                //}
                //$('#myModal').html(content);
                //$("myModal").overlay().load();
            },
            error: function (response) {

            }
        });
    },
    fnShowTeamExpenseClaimDetails: function () {
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetExpenseClaimPendingUserList",
            success: function (response) {

                LandingPage.fnBindExpenseClaimUserList(response);
            },
            error: function (response) {

            }
        });
    },
    fnBindExpenseClaimUserList: function (response) {

        var contentUserDetails = "";

        for (var i = 0; i < response.length; i++) {
            contentUserDetails += '<div class="col-sm-12 userDetail" style="height:40px;padding: 10px 12px 12px;margin-top: 0.5%;cursor: pointer;background-color:blueviolet;color:#fff" onclick="LandingPage.fnToggleExpenseClaim(this,\'' + response[i].UserCode + '\');" >';
            contentUserDetails += '<div style="float:left">';
            contentUserDetails += '<span class="headinguser">' + response[i].EmployeeName + "(" + response[i].UserTypeName + ") - " + response[i].Count + '</span>';
            contentUserDetails += '</div>';

            contentUserDetails += '<div style="text-align:right;">';
            // contentUserDetails += '<span style="font-size: 16px;margin-right: 20px;"><i class="fa fa-print" aria-hidden="true"></i></span>';
            var expandIcon = '<div class="clsicon_' + response[i].UserCode + '" ><i class="fa fa-plus" aria-hidden="true"></i></div>';//  '<i class="fa fa-plus" aria-hidden="true"></i>';
            contentUserDetails += '<span  style="font-size:14px">' + expandIcon + '</span>';
            contentUserDetails += '</div>';
            contentUserDetails += '</div>';
            contentUserDetails += '<div style="display:none;background-color:#fff;color:#222" class="cls_' + response[i].UserCode + '">';
            //contentUserDetails +='<table class="table table-bordered maintable" border=0 cellspacing=0 cellpadding=0  style="width:100%"><thead><tr><th>DCR Date</th><th>Activity</th><th>Entered Date</th></tr></thead>';
            //contentUserDetails +='<tbody><tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr></tbody>'
            //contentUserDetails +='<tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr>'
            //contentUserDetails +='<tr><td>12-12-2017</td><td>Field</td><td>12-12-2017</td></tr>'
            //contentUserDetails +='</table>'
            contentUserDetails += '</div>'

            //content += " <div style='width:100%;float:left;font-size:11.5px;padding:5px;'>" + response[i].EmployeeName + "(" + response[i].UserTypeName + ") - " + response[i].Count;
        }

        $('.modal-body').html(contentUserDetails);
        $(".modal-title").html("Expense Claim Approval Pending User List");
        $('#Modal').modal("show");
        // $('.popupcontent').html(content);
        // $("#DetailsModel").overlay().load();

        //var content = "";
        //content += " <div style='width:100%;float:left;font-size:11.5px'>";
        //content += "<table class='table table-bordered maintable' border=0 cellspacing=0 cellpadding=0>";
        //content += "<thead>";
        //content += "<tr>";
        //content += "<th nowrap class='freezecolumns'> Employee Name </th>";
        //content += "<th nowrap class='freezecolumns'> Designation </th>";
        //content += "<th nowrap class='freezecolumns'> Count </th>";
        //content += "</tr>";
        //content += "</thead>";
        //content += "<tbody>";
        //for (var i = 0; i < response.length; i++) {
        //    content += "<tr data-key='" + response[i].UserCode + "'>";
        //    content += "<td>" + response[i].EmployeeName + "</td>";
        //    content += "<td>" + response[i].UserTypeName + "</td>";
        //    content += "<td>" + response[i].Count + "</td>";
        //    content += "</tr>";
        //}
        //content += "</tbody>";
        //content += "</table>";
        //$(".popuptitle").html("Expense Claim Pending User List");
        //$('.popupcontent').html(content);
        //$("#DetailsModel").overlay().load();
    },

    fnToggleExpenseClaim: function (obj, key) {

        if ($(".cls_" + key).css("display") == "none") {
            $.ajax({
                type: 'GET',
                url: "DashBoardLandingPage/GetAppliedExpenseClaimList",
                data: "userCode=" + key,
                success: function (response) {

                    //if (response > 0) {
                    LandingPage.fnBindExpenseClaimList(response, key);
                    //}
                },
                error: function (response) {

                }
            });


            if ($(".cls_" + key).css("display") == "none") {
                $(".cls_" + key).css("display", "block");
                $(".clsicon_" + key).html('<i class="fa fa-minus" aria-hidden="true">');
            }
            else {
                $(".cls_" + key).css("display", "none");
                $(".clsicon_" + key).html('<i class="fa fa-plus" aria-hidden="true"></i>');
            }
        }
        else {
            $(".cls_" + key).css("display", "none");
            $(".clsicon_" + key).html('<i class="fa fa-plus" aria-hidden="true">');
        }
    },
    fnBindExpenseClaimList: function (res, key) {
        var content = "";

        content += "<table class='table table-bordered maintable' border=0 cellspacing=0 cellpadding=0>";
        content += "<thead>";
        content += "<tr>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Claim Code </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Claimed Date </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Date From </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Date To </th>";
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";

        for (var i = 0; i < res.length; i++) {
            content += "<tr >";
            content += "<td>" + res[i].ClaimCode + "</td>";
            content += "<td>" + ToJavaScriptDate(res[i].ClaimedDate) + "</td>";
            content += "<td>" + ToJavaScriptDate(res[i].DateFrom) + "</td>";
            content += "<td>" + ToJavaScriptDate(res[i].DateTo) + "</td>";
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";
        $(".cls_" + key).html("");
        $(".cls_" + key).html(content);
        if ($(".cls_" + key).css("display") == "none") {
            $(".cls_" + key).css("display", "block");
            $(".clsicon_" + key).html('<i class="fa fa-minus" aria-hidden="true">');
        }

    },

    fnMyGetUnapproveDCR: function () {
        debugger;
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetUnapproveDCRList",
            success: function (response) {

                LandingPage.fnMyUnapproveDCRBind(response);
            },
            error: function (response) {

            }
        });
    },

    fnMyGetUnapproveTP: function () {
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetUnapproveTPList",
            success: function (response) {

                LandingPage.fnMyUnapproveTPBind(response);
            },
            error: function (response) {

            }
        });
    },

    fnMyGetUnapproveExpenseClaim: function () {
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetUnapproveExpenseClaimList",
            success: function (response) {

                LandingPage.fnMyUnapproveExpenseClaimBind(response);
            },
            error: function (response) {

            }
        });
    },


    fnMyUnapproveDCRBind: function (response) {
        debugger;
        var content = "";
        content += " <div style='width:100%;float:left;font-size:11.5px;height:395px;'>";
        content += "<table id='fixTable' class='table table-bordered maintable' border=0 cellspacing=0 cellpadding=0>";
        content += "<thead>";
        content += "<tr>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> DCR Date </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Activity </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Entered Date </th>";
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";
        for (var i = 0; i < response.length; i++) {
            content += "<tr>";
            content += "<td>" + ToJavaScriptDate(response[i].DCRDate) + "</td>";
            content += "<td>" + response[i].Flag + "</td>";
            content += "<td>" + ToJavaScriptDate(response[i].DCREnteredDate) + "</td>";
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";
        $(".modal-title").html("Rejected DCR List");
        $('.modal-body').html(content);


        $('#Modal').modal("show");
        $("#fixTable").tableHeadFixer({ "left": 0 });
        // $("#DetailsModel").overlay().load();
    },

    fnMyUnapproveTPBind: function (response) {
        var content = "";
        content += " <div style='width:100%;float:left;font-size:11.5px'>";
        content += "<table class='table table-bordered maintable'  border=0 cellspacing=0 cellpadding=0>";
        content += "<thead>";
        content += "<tr>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> TP Date </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Activity </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Entered Date </th>";
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";
        for (var i = 0; i < response.length; i++) {
            content += "<tr >";
            content += "<td>" + ToJavaScriptDate(response[i].TPDate) + "</td>";
            content += "<td>" + response[i].Activity + "</td>";
            content += "<td>" + ToJavaScriptDate(response[i].TPEnteredDate) + "</td>";
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";
        $(".modal-title").html("Rejected TP List");
        $('.modal-body').html(content);
        $('#Modal').modal("show");
        //$("#DetailsModel").overlay().load();
    },

    fnMyUnapproveExpenseClaimBind: function (response) {
        var content = "";
        content += " <div style='width:100%;float:left;font-size:11.5px'>";
        content += "<table class='table table-bordered maintable'  border=0 cellspacing=0 cellpadding=0>";
        content += "<thead>";
        content += "<tr>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Claim Code </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> Claimed Date </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> DCR Date From </th>";
        content += "<th nowrap class='freezecolumns' style='background: #03a9f4 !important;color: #fff !important;'> DCR Date To </th>";
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";
        for (var i = 0; i < response.length; i++) {
            content += "<tr data-key='" + response[i].ClaimCode + "'>";
            content += "<td>" + response[i].ClaimCode + "</td>";
            content += "<td>" + ToJavaScriptDate(response[i].ClaimedDate) + "</td>";
            content += "<td>" + ToJavaScriptDate(response[i].DateFrom) + "</td>";
            content += "<td>" + ToJavaScriptDate(response[i].DateTo) + "</td>";
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";
        $(".modal-title").html("Rejected Expense Claim List");
        $('.modal-body').html(content);
        $('#Modal').modal("show");
        //$("#DetailsModel").overlay().load();
    },
    fnRedirectToMessaging: function () {
        $('#main').load("Messaging/Index");
    },
    fnRedirectToNotice: function () {
        $('#main').load("HiDoctor_Activity/NoticeBoard/NoticeBoardRead");
    },
    fnRedirectToTask: function () {
        $('#main').load("HiDoctor_Master/FeedBack/ICETasksView");
    },
    fnRedirectToInwardAck: function () {
        $('#main').load("HiDoctor_Master/Inward/InwardAcknowledgement");
    },

    fnOverlayClose: function () {
        $("#DetailsModel").overlay().close();
    },

    fnHolidayList: function () {
        $.blockUI();
        //$('#myModalCustom').show();
        //$("#myModalCustom").empty();
        $("#dvshowRegionholidays").html('');
        debugger;
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetUserRegionholidays",
            success: function (response) {
                debugger;
                var content = '';

                //content += '<table class="table table-striped" cellpadding="0" cellspacing="0"><thead class="active">';
                //    content += '<tr style="background-color:#428bca;color:white;"><th>Date</th><th>Holiday</th></tr></thead><tbody>';
                content += "<table class=table table-hover border=1><thead ><tr><th>S.No</th>";
                content += "<th>Date</th><th>Holiday</th>";
                content += "</tr></thead><tbody>";
                if (response.Past_Holidaylst.length == 0 && response.Present_Holiday.length == 0) {
                    content += "<tr>";
                    content += "<td colspan='3' style='text-align: center;'>No Upcoming Holidays</td>";
                    content += "</tr>";
                }
                if (response != null && response != '') {
                    var sno = 0;
                    if (response.Past_Holidaylst.length > 0) {
                        for (var i = 0; i < response.Past_Holidaylst.length; i++) {
                            debugger;
                            sno++;
                            content += "<tr style='background-color:#FFA07A'>";
                            content += "<td>" + sno + "</td>";
                            content += "<td>" + response.Past_Holidaylst[i].Holiday_Date + "</td>";
                            content += "<td>" + response.Past_Holidaylst[i].Holiday_Name + "</td>";
                            content += "</tr>";
                        }
                    }
                    if (response.Present_Holiday.length > 0) {
                        for (var i = 0; i < response.Present_Holiday.length; i++) {
                            debugger;
                            sno++;
                            content += "<tr>";
                            content += "<td >" + sno + "</td>";
                            content += "<td>" + response.Present_Holiday[i].Holiday_Date + "</td>";
                            content += "<td>" + response.Present_Holiday[i].Holiday_Name + "</td>";
                            content += "</tr>";
                        }
                    }

                }

                content += "</tbody></table>";
                $("#dvshowRegionholidays").html(content);
                $('#HolidayList').show();
                $.unblockUI();
            }
        })
    },

    fnDocBirthdayList: function () {
        $.blockUI();
        $("#dvshowDocBirthday").html('');
        $.ajax({
            type: 'GET',
            //url: "DashBoardLandingPage/GetDoctorBirthdays",
            url: "DashBoardLandingPage/GetDoctorBirthdays",
            success: function (response) {
                debugger;
                var content = '';
                content += "<table class=table table-hover border=1><thead><tr><th>S.No</th>";
                content += "<th>Doctor Name</th><th>Region Name</th><th>Team Member Name</th><th>Date Of Birth</th>";
                content += "<th>Email</th><th>Mobile</th>";
                content += "</tr></thead><tbody>";
                var sno = 0;
                if (response != null && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        sno++;
                        content += "<tr>";
                        content += "<td>" + sno + "</td><td>" + response[i].Customer_Name + "</td>";
                        content += "<td>" + response[i].Region_Name + "</td><td>" + response[i].User_Name + "</td>";
                        content += "<td>" + response[i].DOB + "</td><td>" + response[i].Email + "</td><td>" + response[i].Mobile + "</td>";
                        content += "</tr>";

                    }
                }
                else {
                    content += "<tr>";
                    content += "<td colspan='7' style='text-align: center;'>No Upcoming Birthdays</td>";
                    content += "</tr>";
                }
                content += "</tbody></table>";
                $("#dvshowDocBirthday").html(content);
                $('#DocBirthdayList').show();
                $.unblockUI();
            }
        })
    },

    fnDocAnniversaryList: function () {
        $.blockUI();
        $("#dvshowDocAnniversary").html('');
        $.ajax({
            type: 'GET',
            //url: "DashBoardLandingPage/GetDoctorBirthdays",
            url: "DashBoardLandingPage/GetDoctorAnniversary",
            success: function (response) {
                debugger;
                var content = '';
                content += "<table class=table table-hover border=1><thead ><tr><th>S.No</th>";
                content += "<th>Doctor Name</th><th>Region Name</th><th>Team Member Name</th><th>Anniversary</th>";
                content += "<th>Email</th><th>Mobile</th>";
                content += "</tr></thead><tbody>";
                var sno = 0;
                if (response != null && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        sno++;
                        content += "<tr>";
                        content += "<td>" + sno + "</td><td>" + response[i].Customer_Name + "</td>";
                        content += "<td>" + response[i].Region_Name + "</td><td>" + response[i].User_Name + "</td>";
                        content += "<td>" + response[i].Anniversary_Date + "</td><td>" + response[i].Email + "</td><td>" + response[i].Mobile + "</td>";
                        content += "</tr>";
                    }
                }
                else {
                    content += "<tr>";
                    content += "<td colspan='7' style='text-align: center;'>No Upcoming Anniversaries</td>";
                    content += "</tr>";
                }

                content += "</tbody></table>";
                $("#dvshowDocAnniversary").html(content);
                $('#DocAnniversaryList').show();
                $.unblockUI();
            }
        })
    },

    fnEmpBirthdayList: function () {
        $.blockUI();
        $("#dvshowEmpBirthday").html('');
        debugger;
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetEmployeeBirthdays",
            success: function (response) {
                debugger;
                var content = '';
                content += "<table class=table table-hover border=1><thead ><tr><th>S.No</th>";
                content += "<th>User Name</th><th>Employee Name</th><th>Date Of Birth</th><th>Region Name</th>"; //<th>Designation</th>
                content += "</tr></thead><tbody>";
                var sno = 0;
                if (response != null && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        sno++;
                        content += "<tr>";
                        content += "<td>" + sno + "</td>";
                        content += "<td>" + response[i].User_Name + "</td><td>" + response[i].Employee_Name + "</td>";
                        content += "<td>" + response[i].Date_Of_Birth + "</td><td>" + response[i].Region_Name + "</td>"; //<td>" + response[i].User_Type_Name + "</td>
                        content += "</tr>";

                    }
                }
                else {
                    content += "<tr>";
                    content += "<td colspan='5' style='text-align: center;'>No Upcoming Birthdays</td>";
                    content += "</tr>";
                }
                content += "</tbody></table>";
                $("#dvshowEmpBirthday").html(content);
                $('#EmpBirthdayList').show();
                $.unblockUI();
            }
        })
    },

    fnGetBirthdayAnniversaryCount: function () {
        $.blockUI();
        debugger;
        $.ajax({
            type: 'GET',
            url: "DashBoardLandingPage/GetBirthdayAnniversaryCount",
            success: function (response) {
                debugger;
                var HolidayCount = '';
                var DocBirthdayCount = '';
                var DocAnniversaryCount = '';
                var EmpBirthdayCount = '';
                HolidayCount = response[0].Holiday;
                DocBirthdayCount = response[0].DocBir;
                DocAnniversaryCount = response[0].DocAnn;
                EmpBirthdayCount = response[0].EmpBirthday;
                $("#holidayCount").html(HolidayCount);
                $("#DocBirthdayCount").html(DocBirthdayCount);
                $("#DocAnnivCount").html(DocAnniversaryCount);
                $("#EmpBirthdaycount").html(EmpBirthdayCount);

            }
        })
        $.unblockUI();
    }
    , fnShowDCRPopupReport: function (val) {        
        $('#Modal').modal("hide");
        var userTypeCode = "";
        var value = "";
        var result = LandingPage.fnCheckDCRApprovalMenuAccess();
        debugger;
        if (result.length == 0) {
            value = "no";
        }
        else if (result[0].Menu_URL == "HiDoctor_Master/Approval/DCRApproval") {
            if (result[0].Access == "1") {
                value = "yes";
            }
            else {
                value = "no";
            }
        }
        //else {
        //    value = "no";
        //}
        debugger;    
        if (value == "yes") {
            fnReportTwo(val);
            $(".clsdivuserperday").dialog({
                draggable: false,
                resizable: false,
                position: {
                    my: "center",
                    at: "center"
                },
                closeOnEscape: true,
                width: 1200,
                height: 950,
                open: function () {
                    $(".ui-dialog-content").scrollTop(0);
                },
                //open: function (event, ui) {
                //    $(this).parent().css({ 'top': Y + 20 });
                //},
                close: function () {
                    $(".clsdivuserperday").unbind('click');
                    $(".clsdivuserperday").dialog("destroy");
                    $(".clsdivuserperday").hide();
                    $('#Modal').modal("show");                    
               },

            });
            HideModalPopup('dvReportTwo');
            window.scrollTo(0, 0);
        }
        else {
            fnMsgAlert('info', 'Info', "You do not have access to approve or unapprove DCR in WEB");
            return false;
        }
    }
   , fnShowTPPopupReport: function (val) {
       debugger;
       var result = LandingPage.fnCheckTPApprovalMenuAccess();
       debugger;
       if (result.length == 0) {
           value = "no";
       }
       else if (result[0].Menu_URL == "HiDoctor_Activity/TourPlanner/TPApproval") {
           if (result[0].Access == "1") {
               value = "yes";
           }
           else {
               value = "no";
           }
       }
       //else {
       //    value = "no";
       //}
       debugger;
       if (value == "yes") {
           fnsetPrivilegeValues();
           fnBindTpReport(val);
       }
       else {
           fnMsgAlert('info', 'Info', "You do not have access to approve or unapprove TP in WEB");
           return false;
       }
   }
   , fnCheckDCRApprovalMenuAccess: function () {
       debugger;
       $.ajax({
           type: 'GET',
           async: false,
           url: "DashBoardLandingPage/GetDCRApprovalMenuAccess",
           success: function (response) {
               debugger;
               userTypeCode = response;
           }
       })
       return userTypeCode;
   }
    , fnCheckTPApprovalMenuAccess: function () {
        debugger;
        $.ajax({
            type: 'GET',
            async: false,
            url: "DashBoardLandingPage/GetTPApprovalMenuAccess",
            success: function (response) {
                debugger;
                userTypeCode = response;
            }
        })
        return userTypeCode;
    }
}