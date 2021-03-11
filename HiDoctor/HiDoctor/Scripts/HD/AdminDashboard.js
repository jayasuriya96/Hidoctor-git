
/*
Created By      : Chakkaravarthi C
Created Date    : 23-09-2016
For             : Admin Dashboard
*/

var AdminDashboard = {
    defaults: {
        "Current_Date": "",
        "Previous_Date": "",
        "Next_Date": "",
        "Day_After_Tomorrow": "",
        "Current_Month": "",
        "Next_Month": "",
        "Previous_Month": "",
        "Current_Year": "",
        "Previous_Year": "",
        "Next_Year": "",
        "Child_User_Count": 0,
        "TOUR_PLANNER": "NO",
        "team_data_json": [],
        "self_data_json": [],
        "team_Category_data_json": [],
        "self_Category_data_json": [],
        "OpenPositionByDivision": "",
        "TopDivisionCode": "",
        "CategoryCoverageDetails": "",
        "bindManagerDoctorVisit": "",
        "PSwithTargetDivisionCode": "",
        "IsPS": true,
        "GetMonthNumber": [],
        "isCurrent": true,
        "DcrComplianceMonthType": "",
        "DcrComplianceDDL": "",
        "Months": "",
        "visitSummaryPageNo": 1,
        "Current": "",
        "TpUL": "",
        "status": "",
        "DcrLockStatus": "Current Month",
        "TPUnavalibleLockStatus": "Current Month",
        "TPApprovalLockStatus": "Current Month",
    },
    initialize: function () {
        //Drop Down Menu Click Event Show 
        $(".toggle-menu").click(function () {
            $(this).next(".dropdown-content").toggle();
        });
        $("#dvMoreInfoModal").overlay({
            onBeforeLoad: function () {
            },
            onLoad: function () {
            }
        });


        $("#dvMoreInfoModal2").overlay({
            onBeforeLoad: function () {
            },
            onLoad: function () {
            }
        });
        AdminDashboard.getDivisions();

        AdminDashboard.getAdminDashboardLiveCounts();
        AdminDashboard.getTaskLiveCount();


        AdminDashboard.getMarketingCampaignCount();
        ////AdminDashboard.getDashboardCategoryCountDataForSingleUser();

        AdminDashboard.getOpenPositionCount();
        AdminDashboard.getJoinerAttrition();
        AdminDashboard.getDcrLockCount();
        AdminDashboard.getTPUnavalibleLockCount();
        AdminDashboard.getTPApprovalLockCount();
        // AdminDashboard.fnOpenPositionExpand();
        //AdminDashboard.getDashboardHome();

    },
    getDashboardHome: function () {
        $.ajax({
            type: 'POST',
            url: "DashBoardV2/DashboardHome",
            async: false,
            dataType: 'text',
            // data: _objData,
            success: function (JsonData) {
                debugger;
                if (JsonData == "FIELD_USER") {
                    // $("#dashboard1").load('Dashboard/UserDashboard');
                }
                else {
                    // $("#dashboard1").load('Dashboard/AdminDashboard');
                    $("#notifyhide").hide();
                    var screenwidth = $(window).width();
                    if (parseInt(screenwidth) <= 1024) {
                        $(".dash-title").html('');
                    }
                }
            }
        });
    },
    blockUI: function (dvId) {
        $(".dropdown-content").hide();
        $('#' + dvId).block({
            message: '<img src="../../Content/images/loader1.gif" width="40px" height="40px"  />',
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                //border: '3px solid #aaa',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0)',
                //opacity: 0.6,
                cursor: 'wait'
            },

            // minimal style set used when themes are used 
            themedCSS: {
                width: '30%',
                top: '40%',
                left: '35%'
            },

            // styles for the overlay 
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait'
            },

            // style to replace wait cursor before unblocking to correct issue 
            // of lingering wait cursor 
            cursorReset: 'default',
        })
    },
    UnblockUI: function (dvId) {
        $('#' + dvId).unblock();
        $(".dropdown-content").hide();
    },
    IntiMethodsWithData: function () {


        $("#btnCategoryCurrent").click(function () {
            $(this).removeClass("btn-inactive").addClass("btn-active");
            $("#btnCategoryPrevious").removeClass("btn-active").addClass("btn-inactive");
            AdminDashboard.defaults.isCurrent = true;
            AdminDashboard.getNewCategoryCoverage();
            //AdminDashboard.getDashboardCategoryCountDataForSingleUser();
        });

        $("#btnCategoryPrevious").click(function () {
            $(this).removeClass("btn-inactive").addClass("btn-active");
            $("#btnCategoryCurrent").removeClass("btn-active").addClass("btn-inactive");
            AdminDashboard.defaults.isCurrent = false;
            AdminDashboard.getNewCategoryCoverage();
            //AdminDashboard.getDashboardCategoryCountDataForSingleUser();
        });

        $("#ddlCategoryCoverageDivision").change(function () {

            AdminDashboard.getNewCategoryCoverage();
        });

        $("#ddlPSwithTargetDivision").change(function () {
            AdminDashboard.getPrimarySecondarywithTarget();
        });

        //$("#btnVacant").click(function () {
        //    AdminDashboard.getOpenPositionCount('VACANT');
        //});

        //$("#btnNotAssigned").click(function () {
        //    AdminDashboard.getOpenPositionCount('NOT ASSIGNED');
        //});


        //$("#btnBoth").click(function () {
        //    AdminDashboard.getOpenPositionCount('');
        //});

        $("#ddlDcrComplianceDivsion").change(function () {
            AdminDashboard.getDCRCompliance();
        });

        // Primary Secondary Top Ten Sales

        $("#ddlTopSalesDivision").change(function () {
            AdminDashboard.getTopTenProduct();
        });

        $("#btnPrimary").click(function () {
            $(this).removeClass("btn-inactive").addClass("btn-active");
            $("#btnSecondary").removeClass("btn-active").addClass("btn-inactive");
            AdminDashboard.defaults.IsPS = true;
            AdminDashboard.getTopTenProduct();
        });


        $("#btnSecondary").click(function () {
            $(this).removeClass("btn-inactive").addClass("btn-active");
            $("#btnPrimary").removeClass("btn-active").addClass("btn-inactive");
            AdminDashboard.defaults.IsPS = false;
            AdminDashboard.getTopTenProduct();
        });

        $("#btnRefreshTopTen").click(function () {
            //AdminDashboard.defaults.IsPS = false;
            AdminDashboard.getTopTenProduct();
        });

        // Dcr Compliance


        $("#btnCompliancePre").click(function () {
            AdminDashboard.defaults.DcrComplianceMonthType = "PREVIOUS";
            AdminDashboard.getDCRCompliance();
        });


        $("#btnComplianceCur").click(function () {
            AdminDashboard.defaults.DcrComplianceMonthType = "CURRENT";
            AdminDashboard.getDCRCompliance();
        });

        //----------- DCR TP Unavalible and Approval Count Event

        $(".fnDcrTPCnt").click(function () {
            var whichFunction = $(this).attr("data-identify");
            AdminDashboard.fnDcrTPCount(whichFunction);
        });

        //-----------

    },
    GetMonthNumber: function (strMonth) {
        var str;
        switch (strMonth) {
            case 'Jan':
                str = "1";
                break;
            case 'Feb':
                str = "2";
                break;
            case 'Mar':
                str = "3";
                break;
            case 'Apr':
                str = "4";
                break;
            case 'May':
                str = "5";
                break;
            case 'Jun':
                str = "6";
                break;
            case 'Jul':
                str = "7";
                break;
            case 'Aug':
                str = "8";
                break;
            case 'Sep':
                str = "9";
                break;
            case 'Oct':
                str = "10";
                break;
            case 'Nov':
                str = "11";
                break;
            case 'Dec':
                str = "12";
                break;
        }

        return str;
    },
    getDivisions: function () {
        $.ajax({
            start: $.unblockUI(),
            type: 'POST',
            url: "DashBoard/GetDivisions",
            success: function (jsonData) {
                var listItems;
                if (1 < jsonData.length) {
                    listItems += "<option selected='selected' data-division_Code = 'All'>-- All --</option>";
                    for (var i = 0; i < jsonData.length; i++) {
                        listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                    }
                }
                else {

                    for (var i = 0; i < jsonData.length; i++) {
                        if (i == 0) {
                            listItems += "<option selected='selected' data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        } else {
                            listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        }
                    }

                }


                $("#ddlPSwithTargetDivision").html(listItems);
                $("#ddlTopSalesDivision").html(listItems);
                $("#ddlDcrComplianceDivsion").html(listItems);
                $("#ddlCategoryCoverageDivision").html(listItems);

                $("#btnSecondary").removeClass("btn-inactive").addClass("btn-active");
                $("#btnPrimary").removeClass("btn-active").addClass("btn-inactive");

            },
            error: function (e) {
                $.unblockUI();
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
            },
            complete: function () {

                AdminDashboard.getPrimarySecondarywithTarget();
                AdminDashboard.getNewCategoryCoverage();
                AdminDashboard.defaults.IsPS = false;
                AdminDashboard.getTopTenProduct();

                AdminDashboard.IntiMethodsWithData();
                //Dcr Complaince
                // $("#btnCompliancePre").hide();
                AdminDashboard.defaults.DcrComplianceMonthType = "CURRENT";
                AdminDashboard.getDCRCompliance();
                //AdminDasboard.getNewCategoryCoverage();

            }
        });
    },
    getAdminDashboardLiveCounts: function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "DashBoard/getAdminDashboardLiveCounts",
            success: function (jsonResult) {
                var doctorBirthday = 0, anniversary = 0, message = 0, notice = 0, employeeBirthday = 0;
                if (jsonResult != null && jsonResult != '' && jsonResult != undefined) {


                    message = jsonResult.MSG;
                    notice = jsonResult.NOTICE;
                    doctorBirthday = jsonResult.D_DOB;
                    anniversary = jsonResult.DOA;
                    employeeBirthday = jsonResult.E_DOB;

                    $('#spnNotify').text(notice);
                    $('#spnMsg').text(message);
                    $('#spnAnniversary').text(anniversary);
                    $('#spnBirthday').text(doctorBirthday);
                    $('#spnEmployee').text(employeeBirthday);



                    if (doctorBirthday > 0) {
                        $('.birthday-pop').unbind('click').bind('click', function () {
                            AdminDashboard.getBirthdayMoreInfo();
                        });
                    }
                    else {
                        $('.birthday-pop').unbind('click');
                    }
                    if (anniversary > 0) {
                        $('.anniversary-pop').unbind('click').bind('click', function () {
                            AdminDashboard.getAnniversaryInfo();
                        });
                    }
                    else {
                        $('.anniversary-pop').unbind('click');
                    }

                    if (employeeBirthday > 0) {
                        $('.employee-pop').unbind('click').bind('click', function () {
                            AdminDashboard.getEmployeeBirthdayMoreInfo();
                        });
                    }
                    else {
                        $('.employee-pop').unbind('click');
                    }


                    $('.notify-pop').unbind('click').bind('click', function () {
                        AdminDashboard.getNotificationMoreInfo();
                    });

                    $('.messages-pop').unbind('click').bind('click', function () {
                        AdminDashboard.getMessageMoreInfo();
                    });

                }
                $('.dash-content-wrapper').unblock();
                $.unblockUI();
            },
            error: function (e) {
                $('.dash-content-wrapper').unblock();
                $.unblockUI();
            },
            complete: function () {
                $('.dash-content-wrapper').unblock();
                $.unblockUI();
            }
        });
    },
    getTaskLiveCount:function(){
        debugger;
        var task = 0;
        $.ajax({
            type:"GET",
            url:"../HiDoctor_Master/FeedBack/GetTaskLiveCount",
            data:"",
            success:function(resp){
                console.log(resp);
                if (resp != null && resp != '' && resp != undefined) {
                    debugger;
                    var task = resp[0].Task_Count;
                    $('#spntask').text(task);

                    // In Chamber Effectiveness Task
                    //if (task > 0) {
                    //    $('#main').load("HiDoctor_Master/FeedBack/ICETasksView");
                    //}
                    if (task > 0) {
                        $('.task-pop').unbind('click').bind('click', function () {
                            debugger;
                            $.blockUI();                          
                            User_Dashboard.getTaskInfo();
                        });
                    }
                    else {
                        $('.task-pop').unbind('click');
                    }
                }
            }
        });     
    },
    getBirthdayMoreInfo: function () {
        HDAjax.requestInvoke("Home", "GetBirthdayAlertforChildUsers", null, "POST",
        function (content) {
            var tblbirthday = "";
            if (content != null && content != '') {
                $('#dvshowBirthdayAlertsforchildusers').html(content);
                ShowModalPopup("dvLoadingDoctorsBirthdayAlerts");
                HideModalPopup();
            }
        },
        function (e) {
            $('.dash-content-wrapper').unblock();
        },
        function () {
            $('.dash-content-wrapper').unblock();
        });
    },
    getAnniversaryInfo: function () {
        HDAjax.requestInvoke("Home", "GetAnniversaryAlertforChildUsers", null, "POST",
        function (jsonResult) {
            if (jsonResult != null && jsonResult != '') {
                $('#dvshowAnniversaryAlertsforchildusers').html(jsonResult);
                ShowModalPopup("dvLoadingDoctorsAnniversaryAlerts");
                HideModalPopup();
            }
        },
        function (e) {
            $('.dash-content-wrapper').unblock();
        },
        function () {
            $('.dash-content-wrapper').unblock();
        });
    },
    getNotificationMoreInfo: function () {
        $('#main').load("HiDoctor_Activity/NoticeBoard/NoticeBoardRead");
    },
    getMessageMoreInfo: function () {
        $('#main').load("Messaging/Index");
    },
    getEmployeeBirthdayMoreInfo: function () {
        HDAjax.requestInvoke("Dashboard", "GetEmployeeBirthdayPopUp", null, "POST",
    function (jsonData) {
        if (jsonData != null && jsonData != '') {

            $("#dvInfoContent").html("");
            var strTable = "";
            strTable += "<table class='table'><thead><tr><th>Employee Name</th><th>User Name</th><th>Region Name</th></th><th>Designation</th><th>Birth Date</th></tr></thead><tbody>";
            for (var i = 0; i < jsonData.length; i++) {
                strTable += "<tr><td>" + jsonData[i].Employee_Name + "</td><td>" + jsonData[i].User_Name + "</td><td>" + jsonData[i].Region_Name + "</td><td>" + jsonData[i].User_Type_Name + "</td><td>" + jsonData[i].Date_Of_Birth + "</td></tr>";
            }
            strTable += "</tbody></table>"
            $('.clsModalTitle').html('Employee Birthday Details');
            $("#dvInfoContent").html(strTable);
            ShowModalPopup("dvMoreInfoModal");
            HideModalPopup();

        }
    },
    function (e) {
        $('.dash-content-wrapper').unblock();
    },
    function () {
        $('.dash-content-wrapper').unblock();
    });
    },
    //getDashboardCategoryCountData: function () {
    //    AdminDashboard.defaults.CategoryCoverageDetails = $("#ddlCategoryCoverageDivision").find(':selected').data('division_code');
    //    var _objData = new Object();
    //    _objData.DivisionCode = AdminDashboard.defaults.CategoryCoverageDetails;

    //    $.ajax({
    //        start: AdminDashboard.blockUI("dvCategoryCoverage"),
    //        type: 'POST',
    //        dataType: 'json',
    //        data: _objData,
    //        url: "DashBoard/GetUserDashboardCategoryInfo",
    //        success: function (jsonResult) {
    //            debugger;
    //            AdminDashboard.defaults.team_Category_data_json = jsonResult;
    //            if (AdminDashboard.defaults.Child_User_Count > 1) {

    //                AdminDashboard.fillCategoryCoverage("T");
    //            }
    //            AdminDashboard.UnblockUI("dvCategoryCoverage");
    //        },
    //        error: function (e) {
    //            AdminDashboard.UnblockUI("dvCategoryCoverage");
    //            //fnMsgAlert('error', 'Error', 'Bind Divisions , Get CategoryInfo');
    //        },
    //        complete: function () {
    //            AdminDashboard.UnblockUI("dvCategoryCoverage");
    //        }
    //    });

    //},
    //getDashboardCategoryCountDataForSingleUser: function () {

    //    $.ajax({
    //        start: AdminDashboard.blockUI("dvCategoryCoverage"),
    //        type: 'POST',
    //        dataType: 'json',
    //        url: "DashBoard/GetUserDashboardCategoryInfoSingle",
    //        success: function (jsonResult) {
    //            debugger;
    //            AdminDashboard.defaults.self_Category_data_json = jsonResult;
    //            if (AdminDashboard.defaults.Child_User_Count == 1) {
    //                AdminDashboard.fillCategoryCoverage("S");
    //            }
    //            AdminDashboard.UnblockUI("dvCategoryCoverage");
    //        },
    //        error: function (e) {
    //            AdminDashboard.UnblockUI("dvCategoryCoverage");
    //            //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
    //        },
    //        complete: function () {
    //            AdminDashboard.UnblockUI("dvCategoryCoverage");
    //        }
    //    });

    //},
    //fillCategoryCoverage: function (mode) {
    //    debugger;
    //    var jsonResult = "";
    //    if (mode == "S") {
    //        jsonResult = AdminDashboard.defaults.self_Category_data_json;
    //    }
    //    else {
    //        jsonResult = AdminDashboard.defaults.team_Category_data_json;
    //    }
    //    var totalDoctors = AdminDashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Total_Approved_Doctors : jsonResult[0].Pre_Month_Total_Approved_Doctors;
    //    var missedDoctors = AdminDashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Category_Missed_Doctors : jsonResult[0].Pre_Month_Category_Missed_Doctors;
    //    var metasperstandard = AdminDashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Category_VC_Followed : jsonResult[0].Pre_Month_Category_VC_Followed;
    //    var lessthanStdVisits = AdminDashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Category_VC_Missed : jsonResult[0].Pre_Month_Category_VC_Missed;
    //    var morethanStdVisits = AdminDashboard.defaults.isCurrent == true ? jsonResult[0].Cur_Month_Category_VC_Exceeded : jsonResult[0].Pre_Month_Category_VC_Exceeded;
    //    var myArray = [missedDoctors, metasperstandard, lessthanStdVisits, morethanStdVisits];
    //    var maxValueInArray = Math.max.apply(Math, myArray);
    //    var index = myArray.indexOf(maxValueInArray);
    //    if (missedDoctors == 0 && metasperstandard == 0 && lessthanStdVisits == 0 && morethanStdVisits == 0) {
    //        index = -1;
    //    }
    //    var className = 'max-category';
    //    var content = '';
    //    content += "<p class='lengend'>";
    //    content += "<span>Completely missed count</span>";
    //    if (missedDoctors > 0) {
    //        content += "<span class='doc-count doc-missed'><b class='cls-link'>" + missedDoctors + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    else {
    //        content += "<span class='doc-count'><b>" + missedDoctors + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    content += "</p>";
    //    if (index == 0) {
    //        content += "<div class='progress missed-main " + className + "'>";
    //    }
    //    else {
    //        content += "<div class='progress missed-main'>";
    //    }
    //    if (AdminDashboard.defaults.isCurrent) {
    //        content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_Missed_Doctors_Percentage + "%'>";
    //    }
    //    else {
    //        content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Pre_Month_Category_Missed_Doctors_Percentage + "%'>";
    //    }

    //    content += "</div>";
    //    content += "</div>";
    //    content += "<p class='lengend'>";
    //    content += "<span>Met as per Std. Norm (Doctor Count)</span>";
    //    if (metasperstandard > 0) {
    //        content += "<span class='doc-count doc-met-per-std'><b class='cls-link'>" + metasperstandard + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    else {
    //        content += "<span class='doc-count'><b class=''>" + metasperstandard + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    content += "</p>";
    //    if (index == 1) {
    //        content += "<div class='progress met-main " + className + "'>";
    //    }
    //    else {
    //        content += "<div class='progress met-main'>";
    //    }
    //    if (AdminDashboard.defaults.isCurrent) {
    //        content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Followed_Percentage + "%'>";
    //    } else {
    //        content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Pre_Month_Category_VC_Followed_Percentage + "%'>";
    //    }

    //    content += "</div>";
    //    content += "</div>";
    //    content += "<p class='lengend'>";
    //    content += "<span>Less than Std. Norm (Doctor Count)</span>";
    //    if (lessthanStdVisits > 0) {
    //        content += "<span class='doc-count doc-less-met'><b class='cls-link'>" + lessthanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    else {
    //        content += "<span class='doc-count'><b class=''>" + lessthanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    content += " </p>";
    //    if (index == 2) {
    //        content += "<div class='progress less-met-main " + className + "'>";
    //    }
    //    else {
    //        content += "<div class='progress less-met-main'>";
    //    }
    //    if (AdminDashboard.defaults.isCurrent) {
    //        content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Missed_Percentage + "%'>";
    //    } else {
    //        content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Pre_Month_Category_VC_Missed_Percentage + "%'>";
    //    }

    //    content += "</div>";
    //    content += "</div>";
    //    content += "<p class='lengend'>";
    //    content += "<span>More than Std. Norm (Doctor Count)</span>";
    //    if (morethanStdVisits > 0) {
    //        content += "<span class='doc-count doc-more-met'><b class='cls-link'>" + morethanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    else {
    //        content += "<span class='doc-count'><b class=''>" + morethanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
    //    }
    //    content += " </p>";
    //    if (index == 3) {
    //        content += "<div class='progress more-met-main " + className + "'>";
    //    }
    //    else {
    //        content += "<div class='progress more-met-main'>";
    //    }
    //    if (AdminDashboard.defaults.isCurrent) {
    //        content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Cur_Month_Category_VC_Exceeded_Percentage + "%'>";
    //    } else {
    //        content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + jsonResult[0].Pre_Month_Category_VC_Exceeded_Percentage + "%'>";
    //    }

    //    content += " </div>";
    //    content += " </div>";
    //    $('.cls-all-coverage').html(content);

    //    $('.doc-missed').unbind('click').bind('click', function () {
    //        AdminDashboard.redirectToDoctorVisitReport('MISSED', '', '');
    //    });
    //    $('.doc-met-per-std').unbind('click').bind('click', function () {
    //        AdminDashboard.redirectToDoctorVisitReport('MET_AS_PER_STANDARD', '', '');
    //    });
    //    $('.doc-less-met').unbind('click').bind('click', function () {
    //        AdminDashboard.redirectToDoctorVisitReport('LESS_THAN_MET', '', '');
    //    });
    //    $('.doc-more-met').unbind('click').bind('click', function () {
    //        AdminDashboard.redirectToDoctorVisitReport('MORE_THAN_MET', '', '');
    //    });
    //},
    //redirectToDoctorVisitReport: function (mode, userCode, regionCode) {
    //    var IsCurrent = AdminDashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
    //    $('#main').load('Dashboard/AdminDashboardDoctorVisit/' + mode + '~' + userCode + '~' + regionCode + "~" + AdminDashboard.defaults.Child_User_Count + "~" + IsCurrent + "~" + AdminDashboard.defaults.CategoryCoverageDetails);
    //},
    getUserDashboardDoctorVisitSummary: function () {
        debugger;
        var _objData = new Object();
        _objData.IsCurrent = AdminDashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        _objData.DivisionCode = AdminDashboard.defaults.CategoryCoverageDetails;
        _objData.PageNo = AdminDashboard.defaults.visitSummaryPageNo;
        _objData.Pagesize = 10;


        $.ajax({
            start: AdminDashboard.blockUI("main"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "DashBoard/GetAdminDashboardDoctorVisitSummary",
            success: function (jsonData) {

                AdminDashboard.bindManagerDoctorVisit(jsonData)
            },
            error: function (e) {
                AdminDashboard.UnblockUI("main");
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
            },
            complete: function (jsonData) {

                // $('#tblAdminDashboardVisitSummary').dataTable({
                //     "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                //, "sDom": 'T<"clear">lfrtip'
                // });  items: jData.Totalcount,

                if (AdminDashboard.defaults.visitSummaryPageNo == 1) {
                    debugger;
                    var jData = JSON.parse(jsonData.responseText)
                    $('#visitSummary-Pagination').pagination({
                        items: jData.Totalcount,
                        itemsOnPage: 10,
                        hrefTextPrefix: 'javascript:AdminDashboard.getVisitSummaryPagination(',
                        hrefTextSuffix: ');',
                        cssStyle: 'light-theme'
                    });
                }

                AdminDashboard.UnblockUI("main");
            }
        });

    },
    bindManagerDoctorVisit: function (jsonResult) {

        var content = '';
        content += "<table class='data display datatable dataTable' id='tblAdminDashboardVisitSummary'><thead><tr><th>S.No</th><th>Region Name</th><th>Employee Name</th><th>Employee Number</th><th>Designation</th><th>Total Doctors</th>";
        content += "<th>Doctor Missed</th><th>Met Exactly</th><th>Less than met</th><th>More than met</th></tr></thead><tbody>";
        var i = 0;
        if (jsonResult != false && jsonResult != '' && jsonResult != null && jsonResult != undefined) {

            $.each(jsonResult.lstDashboardDoctorVisitSummary, function (index, value) {
                i = i + 1;
                content += " <tr>";
                content += "<td>" + value.RowNumber + "</td>";
                content += "<td>" + value.Region_Name + "</td>";
                content += "<td>" + value.Employee_Name + "</td>";
                content += "<td>" + value.Employee_Number + "</td>";
                content += "<td>" + value.User_Type_Name + "</td>";
                content += "<td>" + value.Total_Approved_Doctors + "</td>";
                if (value.Category_Missed_Doctors > 0) {
                    content += "<td class='cls-missed-color'><span class='cls-link' onclick=AdminDashboard.getRepCategoryWiseVisit('" + value.User_Code + "','" + value.Region_Code + "','" + value.Division_Code + "','\MISSED\')>" + value.Category_Missed_Doctors + "</span></td>";
                }
                else {
                    content += "<td class='cls-missed-color'><span>" + value.Category_Missed_Doctors + "</span></td>";
                }
                if (value.Category_VC_Followed > 0) {
                    content += "<td class='cls-met-std'><span class='cls-link' onclick=AdminDashboard.getRepCategoryWiseVisit('" + value.User_Code + "','" + value.Region_Code + "','" + value.Division_Code + "','\MET_AS_PER_STANDARD\')>" + value.Category_VC_Followed + "</span></td>";
                }
                else {
                    content += "<td class='cls-met-std'><span>" + value.Category_VC_Followed + "</span></td>";
                }
                if (value.Category_VC_Missed > 0) {
                    content += "<td class='cls-met-less'><span  class='cls-link'  onclick=AdminDashboard.getRepCategoryWiseVisit('" + value.User_Code + "','" + value.Region_Code + "','" + value.Division_Code + "','\LESS_THAN_MET\')>" + value.Category_VC_Missed + "</span></td>";
                }
                else {
                    content += "<td class='cls-met-less'><span>" + value.Category_VC_Missed + "</span></td>";
                }
                if (value.Category_VC_Exceeded > 0) {
                    content += "<td class='cls-met-more'><span class='cls-link' onclick=AdminDashboard.getRepCategoryWiseVisit('" + value.User_Code + "','" + value.Region_Code + "','" + value.Division_Code + "','\MORE_THAN_MET\')>" + value.Category_VC_Exceeded + "</span></td>";

                }
                else {
                    content += "<td class='cls-met-more'><span>" + value.Category_VC_Exceeded + "</span></td>";
                }
                content += "</tr>";
            });
        }

        content += " </tbody>";
        content += "</table>";
        $('#dvManagerVisit').html(content);
        $('.tblFilter').hide();
    },
    getVisitSummaryPagination: function (pageNumber) {
        AdminDashboard.defaults.visitSummaryPageNo = pageNumber;
        AdminDashboard.getUserDashboardDoctorVisitSummary();
    },
    //getRepCategoryWiseVisit: function (userCode, regionCode, DivisionCode, mode) {
    //    firstTimeLoad = true;
    //    $('#cboCategory').val('');
    //    $('#cboSpeciality').val('');
    //    AdminDashboard.getUserDashboardCategoryWiseVisits(userCode, regionCode, DivisionCode, mode);

    //},
    //getUserDashboardCategoryWiseVisits: function (userCode, regionCode, DivisionCode, mode) {
    //    var u = {};
    //    u.name = "userCode";
    //    u.value = userCode;

    //    var r = {};
    //    r.name = "regionCode";
    //    r.value = regionCode;

    //    var m = {};
    //    m.name = "mode";
    //    m.value = mode;

    //    var c = {};
    //    c.name = "category";
    //    if ($('#cboCategory').val() == null) {
    //        c.value = '';
    //    }
    //    else {
    //        c.value = $('#cboCategory').val();
    //    }

    //    var s = {};
    //    s.name = "speciality";
    //    if ($('#cboSpeciality').val() == null) {
    //        s.value = '';
    //    }
    //    else {
    //        s.value = $('#cboSpeciality').val();
    //    }

    //    var p = {};
    //    p.name = "isCurrent";
    //    p.value = AdminDashboard.defaults.isCurrent == true ? 'Current' : 'Previous';

    //    var d = {};
    //    d.name = "DivisionCode";
    //    d.value = DivisionCode;

    //    var ar = new Array();
    //    ar.push(u);
    //    ar.push(r);
    //    ar.push(m);
    //    ar.push(c);
    //    ar.push(s);
    //    ar.push(p);
    //    ar.push(d);

    //    var content = '';
    //    HDAjax.requestInvoke("Dashboard", "GetAdminDashboardCategoryWiseVisits", ar, "POST",
    //    function (jsonResult) {
    //        debugger;
    //        AdminDashboard.bindCategoryWiseDoctorVisit(jsonResult, mode, userCode, regionCode, DivisionCode)
    //    });
    //    //$('#dvInfoContent').html(content);
    //    //$('.clsModalTitle').html('Pending DCR');
    //    //ShowModalPopup("dvMoreInfoModal");
    //},
    //bindCategoryWiseDoctorVisit: function (jsonResult, mode, userCode, regionCode, DivisionCode) {

    //    $('#dvRepVisit').html('');
    //    var content = '';
    //    var disCatAr = new Array();
    //    var disSpeAr = new Array();
    //    content += "<table class='data display datatable' id='tblCategoryWiseDoctorVisit'><thead><tr><th>S.No</th><th>Doctor Name</th><th>Speciality</th><th>MDL No</th>";
    //    content += "<th>Category</th><th>Standard Visit</th><th># Current Month Visits</th><th># Previous Month Visits</th></tr> </thead><tbody>";
    //    var i = 0;
    //    if (jsonResult != false && jsonResult != '' && jsonResult != null && jsonResult != undefined) {
    //        $.each(jsonResult, function (index, value) {

    //            i = i + 1;
    //            var curClassName = '';
    //            var preClassName = '';
    //            var curValue = 0;
    //            var preValue = 0;
    //            var stdVisitCount = 0;
    //            if (firstTimeLoad) {
    //                if ($.inArray(value.Category_Code + "~" + value.Category_Name, disCatAr) == -1) {
    //                    disCatAr.push(value.Category_Code + "~" + value.Category_Name);
    //                }
    //                if ($.inArray(value.Speciality_Code + "~" + value.Speciality_Name, disSpeAr) == -1) {
    //                    disSpeAr.push(value.Speciality_Code + "~" + value.Speciality_Name);
    //                }
    //            }

    //            content += "<tr><td>" + i + "</td>";
    //            content += "<td>" + value.Doctor_Name + "</td>";
    //            content += "<td>" + value.Speciality_Name + "</td>";
    //            content += "<td>" + value.MDL_Number + "</td>";
    //            content += "<td>" + value.Category_Name + "</td>";
    //            content += "<td>" + value.Standard_Visits_Count + "</td>";
    //            stdVisitCount = value.Standard_Visits_Count;

    //            curValue = value.Cur_Month_Count;
    //            preValue = value.Pre_Month_Count;
    //            if (mode == "MISSED") {
    //                //curValue = value.Cur_Month_Category_Missed_Doctors;
    //                //preValue = value.Pre_Month_Category_Missed_Doctors;
    //                curClassName = 'cls-missed-color';
    //                //content += "<td class='cls-missed-color'>" + value.Cur_Month_Category_Missed_Doctors + "</td>";
    //                // content += "<td>" + value.Pre_Month_Category_Missed_Doctors + "</td>";
    //            }
    //            else if (mode == "MET_AS_PER_STANDARD") {
    //                //curValue = value.Cur_Month_Category_VC_Followed;
    //                //preValue = value.Pre_Month_Category_VC_Followed;
    //                curClassName = 'cls-met-std';
    //                //content += "<td class='cls-met-std'>" + value.Cur_Month_Category_VC_Followed + "</td>";
    //                //content += "<td>" + value.Pre_Month_Category_VC_Followed + "</td>";
    //            }
    //            else if (mode == "LESS_THAN_MET") {
    //                //curValue = value.Cur_Month_Category_VC_Missed;
    //                //preValue = value.Pre_Month_Category_VC_Missed;
    //                curClassName = 'cls-met-less';
    //                //content += "<td class='cls-met-less'>" + value.Cur_Month_Category_VC_Missed + "</td>";
    //                //content += "<td>" + value.Pre_Month_Category_VC_Missed + "</td>";
    //            }
    //            else {
    //                //curValue = value.Cur_Month_Category_VC_Exceeded;
    //                //preValue = value.Pre_Month_Category_VC_Exceeded;
    //                curClassName = 'cls-met-more';
    //                //content += "<td class='cls-met-more'>" + value.Cur_Month_Category_VC_Exceeded + "</td>";
    //                //content += "<td>" + value.Pre_Month_Category_VC_Exceeded + "</td>";
    //            }

    //            content += "<td style='text-align:center;' class=" + curClassName + ">" + curValue + "</td>";
    //            if (preValue == 0) {
    //                preClassName = 'cls-missed-color';
    //            }
    //            else if (preValue == stdVisitCount) {
    //                preClassName = 'cls-met-std';
    //            }
    //            else if (preValue < stdVisitCount) {
    //                preClassName = 'cls-met-less';
    //            }
    //            else {
    //                preClassName = 'cls-met-more';
    //            }
    //            content += "<td style='text-align:center;' class=" + preClassName + ">" + preValue + "</td></tr>";
    //        });
    //    }
    //    content += " </tbody></table>";
    //    $('#dvRepVisit').html(content);

    //    if ($.fn.dataTable) {
    //        $('#tblCategoryWiseDoctorVisit').dataTable({
    //            "bPaginate": false, "bFilter": false, "bSearchable": false, "bSort": true, "bDestroy": true
    //        });
    //    };
    //    if (firstTimeLoad) {
    //        $("#cboCategory option").remove();
    //        $("#cboCategory").append("<option value=''>-Select Category-</option>")
    //        $.each(disCatAr, function (index, value) {
    //            $("#cboCategory").append("<option value='" + value.split('~')[0] + "'>" + value.split('~')[1] + "</option>")
    //        });
    //        $("#cboSpeciality option").remove();
    //        $("#cboSpeciality").append("<option value=''>-Select Speciality-</option>")
    //        $.each(disSpeAr, function (index, value) {
    //            $("#cboSpeciality").append("<option value='" + value.split('~')[0] + "'>" + value.split('~')[1] + "</option>")
    //        });

    //    }
    //    $("#cboCategory").unbind('change').bind('change', function () {
    //        debugger;
    //        firstTimeLoad = false;
    //        AdminDashboard.getUserDashboardCategoryWiseVisits(userCode, regionCode, DivisionCode, mode);
    //    });
    //    $("#cboSpeciality").unbind('change').bind('change', function () {
    //        debugger;
    //        firstTimeLoad = false;
    //        AdminDashboard.getUserDashboardCategoryWiseVisits(userCode, regionCode, DivisionCode, mode);
    //    });
    //    $('.tblFilter').show();
    //    console.log(disSpeAr);
    //},
    getPrimarySecondarywithTarget: function () {

        AdminDashboard.defaults.PSwithTargetDivisionCode = $("#ddlPSwithTargetDivision").find(':selected').data('division_code');

        var _objData = new Object();
        _objData.DivisionCode = AdminDashboard.defaults.PSwithTargetDivisionCode;

        $.ajax({
            start: AdminDashboard.blockUI("dvPSwithTarget"),
            type: 'POST',
            url: "DashBoard/GetPrimarySecondarywithTarget",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {

                var PSwithTarget = jsonData;

                var data = new google.visualization.DataTable();

                data.addColumn('string', 'Month');
                data.addColumn('number', 'Primary');
                data.addColumn('number', 'Secondary');
                data.addColumn('number', 'Target');

                for (var i = 0; i < PSwithTarget.length; i++) {
                    data.addRow([PSwithTarget[i].Month, PSwithTarget[i].Primary_Value, PSwithTarget[i].Secondary_Value, PSwithTarget[i].Target_Value]);
                }

                var options = {
                    title: "Primary Sales, Secondary Sales with Target",
                    width: 482, height: 219,
                    vAxis: { title: "" }, isStacked: false,
                    hAxis: { title: "Month" },
                    legend: "right",
                    seriesType: "bars",
                    series: { 2: { type: "line" } },
                }

                new google.visualization.ComboChart(document.getElementById('dvPandSwithTargetBarChat')).draw(data, options);

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvPSwithTarget");
                //fnMsgAlert('error', 'Error', 'Bind Primary , Secondary with Target failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvPSwithTarget");
            }
        });


    },
    getOpenPositionCount: function (status) {
        var _objData = new Object();
        _objData.Region_Status = status;
        _objData.DivisionCode = AdminDashboard.defaults.OpenPositionByDivision;

        $.ajax({
            start: AdminDashboard.blockUI("dvOpenPosition"),
            type: 'POST',
            url: "DashBoard/GetOpenPositionCount",
            data: _objData,
            success: function (jsonData) {


                if (jsonData.length == 1) {
                    if (jsonData[0].Vacancy_Count == -1) {
                        $('.dropdownopen').hide();
                        $("#dvPieChart").text("Not Applicable");
                        $('#dvPieChart').css('text-align', 'center');
                        $('#dvPieChart').css('margin-top', '35%');
                        $('#dvPieChart').css('font-size', '23px');
                    }
                    else if (jsonData[0].Vacancy_Count == 0) {
                        $('.dropdownopen').hide();
                        $("#dvPieChart").text("No Open Position");
                        $('#dvPieChart').css('text-align', 'center');
                        $('#dvPieChart').css('margin-top', '35%');
                        $('#dvPieChart').css('font-size', '23px');
                    }
                    else {
                        $('.dropdownopen').hide();
                        $('#headerdivision').html("<input type='text' style='height:10px;width:15px;background-color: #e81313;' readonly />  " + jsonData[0].Division_Name);
                        $("#dvPieChart").html("<h2 id='heading' Style='font-size:48px;margin-top: 1.25em;text-align: center;cursor: pointer;text-decoration: underline;' onclick='AdminDashboard.getOpenPositionPopUp(" + jsonData[0].Division_Code + ")'>" + jsonData[0].Vacancy_Count + "</h2><br><h3 id='spanheding' Style='text-align: center;margin-top: -2.75em;font-size: 15px;'>Open Position</h3>");
                    }
                }
                else {
                    var OpenPosition = jsonData;

                    var data = new google.visualization.DataTable();

                    data.addColumn('string', 'Division Code');
                    data.addColumn('string', 'Division Name');
                    data.addColumn('number', 'Division Count');



                    for (var i = 0; i < OpenPosition.length; i++) {
                        data.addRow([OpenPosition[i].Division_Code, OpenPosition[i].Division_Name, OpenPosition[i].Vacancy_Count]);
                    }

                    var options = {
                        chartArea: { left: 0, top: 20, width: '100%', height: '100%' },
                        width: 238, height: 215,
                        fontSize: 12,
                        fontName: "Arial",
                        is3D: false,
                        legend: "none",
                        pieSliceText: 'lable'
                    };

                    if (data.getNumberOfRows() == 0) {
                        $("#dvPieChart").html("");
                        $("#dvPieChart").append("<div class='circle_division'>No Open Position</div>")
                        //   return false;
                    } else {
                        $("#dvPieChart").html("");
                        dataview = new google.visualization.DataView(data);
                        dataview.hideColumns([0]);

                        var chart = new google.visualization.PieChart(document.getElementById('dvPieChart'));

                        function fnSelectHandler() {
                            var selectedItem = chart.getSelection()[0];
                            if (selectedItem) {
                                if (selectedItem.row != null) {
                                    var divisionCode = data.getValue(selectedItem.row, 0);
                                    AdminDashboard.getOpenPositionPopUp(divisionCode);
                                }
                            }
                        }

                        google.visualization.events.addListener(chart, 'select', fnSelectHandler);

                        chart.draw(dataview, options);
                    }
                }
            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvOpenPosition");
                //fnMsgAlert('error', 'Error', 'Bind Open Position Count failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvOpenPosition");
            }
        });


    },
    getOpenPositionPopUp: function (divisionCode) {
        debugger;
        var _objData = new Object();
        _objData.DivisionCode = divisionCode;
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "DashBoard/GetOpenPositionPopUp",
            data: _objData,
            success: function (jsonData) {
                debugger;
                $("#dvInfoContent").html("");
                var strTable = "";
                strTable += "<table cellspacing='0' cellpadding='0' class='table table-striped details' id='tblOpenPosition'><thead><tr><th>Region Name</th><th>Region Type Name</th><th>Division Name</th><th>Region Status</th><th>Vacancy from Period</th></tr></thead><tbody>";
                for (var i = 0; i < jsonData.length; i++) {
                    strTable += "<tr><td>" + jsonData[i].Region_Name + "</td><td>" + jsonData[i].Region_Type_Name + "</td><td>" + jsonData[i].Division_Name + "</td><td>" + jsonData[i].Vacancy_Type + "</td><td>" + jsonData[i].Vacant_From_Date + "</td></tr>";
                }
                strTable += "</tbody></table>"
                $("#dvMoreInfoHeader").html("Open Position By Division");
                $("#dvInfoContentopen").html(strTable);
                $('#overylay').overlay().load();

            },


        });


    },
    fnOpenPositionExpand: function () {
        var _objData = new Object();
        _objData.DivisionCode = AdminDashboard.defaults.OpenPositionByDivision;
        $('#expandoverylay').overlay().load();
        debugger;
        $.ajax({
            type: 'POST',
            url: "DashBoard/GetOpenPositionCount",
            data: _objData,
            success: function (jsonData) {
                debugger;

                var total = 0;
                var OpenPosition = jsonData;

                for (var i = 0; i < OpenPosition.length; i++) {
                    var value = OpenPosition[i].Vacancy_Count;
                    total = total + value;
                }

                var data = new google.visualization.DataTable();

                data.addColumn('string', 'Division Code');
                data.addColumn('string', 'Division Name');
                data.addColumn('number', 'Division Count');



                for (var i = 0; i < OpenPosition.length; i++) {
                    debugger;
                    var percentage = (OpenPosition[i].Vacancy_Count / total) * 100
                    percentage = percentage.toFixed(1);
                    data.addRow([OpenPosition[i].Division_Code, OpenPosition[i].Division_Name + '(' + percentage + '%)', OpenPosition[i].Vacancy_Count]);
                }

                var options = {
                    chartArea: { left: 0, top: 20, width: '100%', height: '100%' },
                    width: 450, height: 350,
                    fontSize: 14,
                    fontName: "Arial",
                    is3D: false,
                    legend: {
                        position: 'right',
                        alignment: 'center',
                    },
                    tooltip: { isHtml: true },
                    pieSliceText: 'lable'
                };

                if (data.getNumberOfRows() == 0) {
                    $("#expandoverylay").html("");
                    $("#expandoverylay").append("<div class='circle_division'>No Open Position</div>")
                    //   return false;
                } else {
                    $("dvexpand").html("");
                    dataview = new google.visualization.DataView(data);
                    dataview.hideColumns([0]);

                    var chart = new google.visualization.PieChart(document.getElementById('dvexpand'));

                    //function fnSelectHandler() {
                    //    var selectedItem = chart.getSelection()[0];
                    //    if (selectedItem) {
                    //        if (selectedItem.row != null) {
                    //            var divisionCode = data.getValue(selectedItem.row, 0);
                    //            AdminDashboard.getOpenPositionPopUp(divisionCode);
                    //        }
                    //    }
                    //}

                    // google.visualization.events.addListener(chart, 'select', fnSelectHandler);

                    chart.draw(dataview, options);
                }

            },
        });

    },
    getJoinerAttrition: function () {
        $.ajax({
            start: AdminDashboard.blockUI("dvJoinAttri"),
            type: 'POST',
            url: "DashBoard/GetJoinerAttrition",
            success: function (jsonData) {

                if (jsonData[0].Joiners && jsonData[0].Attrition == -1) {
                    $("#dvJoinerAttrition").text("Not Applicable");
                    $('#dvJoinerAttrition').css('text-align', 'center');
                    $('#dvJoinerAttrition').css('margin-top', '35%');
                    $('#dvJoinerAttrition').css('font-size', '23px');
                }
                else {
                    var JoinAttri = jsonData;

                    var data = new google.visualization.DataTable();

                    data.addColumn('string', 'Month');
                    data.addColumn('number', JoinAttri[0].Month_Name);
                    data.addColumn('number', JoinAttri[1].Month_Name);
                    data.addColumn('number', JoinAttri[2].Month_Name);

                    data.addRow(['Joiner', JoinAttri[0].Joiners, JoinAttri[1].Joiners, JoinAttri[2].Joiners]);
                    data.addRow(['Attrition', JoinAttri[0].Attrition, JoinAttri[1].Attrition, JoinAttri[2].Attrition]);

                    var options = {
                        chartArea: { left: 45, top: 20, width: '80%', height: '80%' },
                        width: 238, height: 219,
                        vAxis: { title: "" }, isStacked: true,
                        hAxis: { title: "" },
                        fontSize: 11,
                        fontName: "Arial",
                        legend: "top",
                        bars: "vertical"
                    }

                    var chart = new google.visualization.ColumnChart(document.getElementById('dvJoinerAttrition'));

                    function selectHandler() {
                        var selectedItem = chart.getSelection()[0];
                        if (selectedItem) {
                            if (selectedItem.row != null) {
                                var getColumnName = data.getColumnLabel(selectedItem.column);
                                var month = AdminDashboard.GetMonthNumber(getColumnName.split("-")[0]), year = getColumnName.split("-")[1], JA_Wise = data.getValue(selectedItem.row, 0);
                                AdminDashboard.GetJoinerAttritionPopUp(month, year, JA_Wise);
                            }
                        }
                    }


                    google.visualization.events.addListener(chart, 'select', selectHandler);
                    chart.draw(data, options);
                }

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvJoinAttri");
                //fnMsgAlert('error', 'Error', 'Bind Joiner and Attrition failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvJoinAttri");
            }
        });


    },
    GetJoinerAttritionPopUp: function (Month, Year, option) {
        debugger;
        var _objData = new Object();
        _objData.Month = Month;
        _objData.Year = Year;
        var JA_Wise = '';
        if (option == 'Joiner') {
            JA_Wise = 1;
        }
        else {
            JA_Wise = 2;
        }
        _objData.JA_Wise = JA_Wise;

        $.ajax({
            start: AdminDashboard.blockUI("dvJoinAttri"),
            type: 'POST',
            dataType: 'json',
            url: "DashBoard/GetJoinerAttritionPopUp",
            data: _objData,
            success: function (jsonData) {
                debugger;
                $("#dvInfoContent").html("");
                var strTable = "";
                if (JA_Wise == 1) {
                    $('.clsModalTitle').html('Joiner Details');
                    strTable += "<table cellspacing='0' cellpadding='0' class='table table-striped details' id='tblJoinerVsAttrition_' title='JoinerAttritions'><thead id='tblheader'><tr><th>Employee Number</th><th>Employee Name</th><th>User ID</th><th>Designation</th><th>Division Name</th><th>Date of Joining</th><th>Region Name</th><th>Mobile Number</th></tr></thead><tbody id='tblbody'>";
                    for (var i = 0; i < jsonData.length; i++) {
                        var txtMobile = jsonData[i].Mobile == null ? "NA" : jsonData[i].Mobile;
                        var Division = jsonData[i].Division_Values == null ? "" : jsonData[i].Division_Values;
                        strTable += "<tr><td>" + jsonData[i].Employee_Number + "</td><td>" + jsonData[i].Employee_Name + "</td><td>" + jsonData[i].User_Name + "</td><td>" + jsonData[i].User_Type_Name + "</td><td>" + Division + "</td><td>" + jsonData[i].Date_Of_Joining + "</td><td>" + jsonData[i].Region_Name + "</td><td>" + txtMobile + "</td></tr>";
                    }
                    strTable += "</tbody></table>"
                }
                else {
                    data: _objData,
                        $('.clsModalTitle').html('Attrion Details');
                    strTable += "<table cellspacing='0' cellpadding='0' class='table table-striped details' id='tblJoinerVsAttrition_' title='JoinerAttritions'><thead id='tblheader'><tr><th>Region Name</th><th>Employee Name</th><th>Division Name</th><th>Designation</th><th>Resigned User ID</th><th>Date of Joining</th><th> Date of Resignation</th><th>Total Number of Days Worked</th><th>Mobile Number</th></tr></thead><tbody>";
                    for (var i = 0; i < jsonData.length; i++) {
                        var txtMobile = jsonData[i].Mobile == null ? "NA" : jsonData[i].Mobile;
                        var Division = jsonData[i].Division_Values == null ? "" : jsonData[i].Division_Values;
                        strTable += "<tr><td>" + jsonData[i].Region_Name + "</td><td>" + jsonData[i].Employee_Name + "</td><td>" + Division + "</td><td>" + jsonData[i].User_Type_Name + "</td><td>" + jsonData[i].User_Name + "</td><td>" + jsonData[i].Date_Of_Joining + "</td><td>" + jsonData[i].Resignation_Date + "</td><td>" + jsonData[i].Days_Worked + "</td><td>" + txtMobile + "</td></tr>";
                    }
                    strTable += "</tbody></table>"
                }
                $("#dvMoreInfoHeader").html("Joiner Vs Attrition");
                $("#dvInfoJoiner").html(strTable);
                $('#joineroverylay').overlay().load();

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvJoinAttri");
                //fnMsgAlert('error', 'Error', 'Bind Joiner Attrition PopUp failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvJoinAttri");
            }
        });
    },
    getTopTenProduct: function () {
        AdminDashboard.defaults.TopDivisionCode = $("#ddlTopSalesDivision").find(':selected').data('division_code');
        var _objData = new Object();
        _objData.IsPS = AdminDashboard.defaults.IsPS;
        _objData.DivisionCode = AdminDashboard.defaults.TopDivisionCode;

        $.ajax({
            start: AdminDashboard.blockUI("dvTopTenProd"),
            type: 'POST',
            url: "DashBoard/GetTopTenProduct",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {

                var TopTenSalesProduct = jsonData;

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'productName');
                if (TopTenSalesProduct.lstTenSalesProduct != undefined && TopTenSalesProduct.lstTenSalesProduct != null) {

                    for (var col = 1; col < TopTenSalesProduct.lstTenSalesProductColumns.length; col++) {
                        data.addColumn('number', TopTenSalesProduct.lstTenSalesProductColumns[col].columns);
                    }


                    for (var i = 0; i < TopTenSalesProduct.lstTenSalesProduct.length; i++) {
                        if (TopTenSalesProduct.lstTenSalesProduct[i].month1 != null && TopTenSalesProduct.lstTenSalesProduct[i].month2 == null && TopTenSalesProduct.lstTenSalesProduct[i].month3 == null) {
                            data.addRow([TopTenSalesProduct.lstTenSalesProduct[i].productName, parseFloat(TopTenSalesProduct.lstTenSalesProduct[i].month1)]);
                        }
                        else if (TopTenSalesProduct.lstTenSalesProduct[i].month1 != null && TopTenSalesProduct.lstTenSalesProduct[i].month2 != null && TopTenSalesProduct.lstTenSalesProduct[i].month3 == null) {
                            data.addRow([TopTenSalesProduct.lstTenSalesProduct[i].productName, parseFloat(TopTenSalesProduct.lstTenSalesProduct[i].month1), parseFloat(TopTenSalesProduct.lstTenSalesProduct[i].month2)]);
                        }
                        else if (TopTenSalesProduct.lstTenSalesProduct[i].month1 != null && TopTenSalesProduct.lstTenSalesProduct[i].month2 != null && TopTenSalesProduct.lstTenSalesProduct[i].month3 != null) {
                            data.addRow([TopTenSalesProduct.lstTenSalesProduct[i].productName, parseFloat(TopTenSalesProduct.lstTenSalesProduct[i].month1), parseFloat(TopTenSalesProduct.lstTenSalesProduct[i].month2), parseFloat(TopTenSalesProduct.lstTenSalesProduct[i].month3)]);
                        }

                    }

                }


                if (data.getNumberOfRows() == 0) {
                    data.addColumn('number', 'No  Month');
                    data.addRow(['No Product', 0]);
                }

                var txtTitle;

                if (AdminDashboard.defaults.IsPS) {
                    txtTitle = "Top 10 Primary Sales Products";
                } else {
                    txtTitle = "Top 10 Secondary Sales Products";
                }

                var options = {
                    title: txtTitle,
                    width: 482, height: 219,
                    vAxis: { title: "Quantity" }, isStacked: true,
                    hAxis: { title: "Product's Name" },
                    legend: "right",
                    bars: "vertical",
                    colors: ['#109618', '#3366cc', '#ff9900']
                }

                new google.visualization.ColumnChart(document.getElementById('dvTopTenProduct')).draw(data, options);


            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvTopTenProd");
                //fnMsgAlert('error', 'Error', 'Bind Top Ten Products failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvTopTenProd");
            }
        });


    },
    fnDcrTPCount: function (whichFunction) {
        switch (whichFunction) {
            case "CurMonthDcrLock":
                AdminDashboard.defaults.DcrLockStatus = "Current Month";
                AdminDashboard.getDcrLockCount();
                break;
            case "PreMonthDcrLock":
                AdminDashboard.defaults.DcrLockStatus = "Previous Month";
                AdminDashboard.getDcrLockCount();
                break;
            case "OverAllMonthDcrLock":
                AdminDashboard.defaults.DcrLockStatus = "Overall Past";
                AdminDashboard.getDcrLockCount();
                break;
            case "CurMonthTPUnavalibleLock":
                AdminDashboard.defaults.TPUnavalibleLockStatus = "Current Month";
                AdminDashboard.getTPUnavalibleLockCount();
                break;
            case "PreMonthTPUnavalibleLock":
                AdminDashboard.defaults.TPUnavalibleLockStatus = "Previous Month";
                AdminDashboard.getTPUnavalibleLockCount();
                break;
            case "OverAllMonthTPUnavalibleLock":
                AdminDashboard.defaults.TPUnavalibleLockStatus = "Overall Past";
                AdminDashboard.getTPUnavalibleLockCount();
                break;
            case "CurMonthTPApprovalLock":
                AdminDashboard.defaults.TPApprovalLockStatus = "Current Month";
                AdminDashboard.getTPApprovalLockCount();
                break;
            case "PreMonthTPApprovalLock":
                AdminDashboard.defaults.TPApprovalLockStatus = "Previous Month";
                AdminDashboard.getTPApprovalLockCount();
                break;
            case "OverAllMonthTPApprovalLock":
                AdminDashboard.defaults.TPApprovalLockStatus = "Overall Past";
                AdminDashboard.getTPApprovalLockCount();
                break;
        }
    },
    getDcrLockCount: function () {
        var _objData = new Object();
        _objData.Lock_Type = "LOCK_LEAVE,IDLE_DCR";
        _objData.DcrTpLockStatus = AdminDashboard.defaults.DcrLockStatus;

        $.ajax({
            start: AdminDashboard.blockUI("dvDCRLock"),
            type: 'POST',
            url: "DashBoard/GetDcrTPLockCounts",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                if (jsonData != undefined && jsonData != null) {
                    if (jsonData.LockedUserCount > 0) {

                        $("#spnLockUser").text(jsonData.LockedUserCount);
                        $("#spnLockDcr").text("(" + jsonData.LockedCount + ")");
                        $("#spnDCRLockStatus").text(AdminDashboard.defaults.DcrLockStatus);

                        $("#spnLockUser").off("click").click(function () {
                            AdminDashboard.getDcrLockCountPopUp();
                        });

                        $('#spnLockUser').css('cursor', 'pointer');
                        $('#spnLockUser').css('text-decoration', 'underline');
                    }
                    else {
                        $('#spnLockUser').css('cursor', 'default');
                        $('#spnLockUser').css('text-decoration', 'blink');
                        $("#spnLockUser").text('0');
                        $("#spnLockDcr").text("(0)");
                        $("#spnDCRLockStatus").text(AdminDashboard.defaults.DcrLockStatus);
                    }
                }

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvDCRLock");
                //fnMsgAlert('error', 'Error', 'Bind DCR Lock Count failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvDCRLock");
            }
        });
    },
    getTPUnavalibleLockCount: function () {
        var _objData = new Object();
        _objData.Lock_Type = "TP_UNAVAILABILITY";
        _objData.DcrTpLockStatus = AdminDashboard.defaults.TPUnavalibleLockStatus;

        $.ajax({
            start: AdminDashboard.blockUI("dvTPUnavalibleLock"),
            type: 'POST',
            url: "DashBoard/GetDcrTPLockCounts",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                if (jsonData != undefined && jsonData != null) {
                    if (jsonData.LockedUserCount > 0) {

                        $("#spnLockUserTP").text(jsonData.LockedUserCount);
                        $("#spnLockTP").text("(" + jsonData.LockedCount + ")");
                        $("#spnTPUnavalibleStatus").text(AdminDashboard.defaults.TPUnavalibleLockStatus);

                        $("#spnLockUserTP").off("click").click(function () {
                            AdminDashboard.getTPUnavalibleLockCountPopUp();
                        });

                        $('#spnLockUserTP').css('cursor', 'pointer');
                        $('#spnLockUserTP').css('text-decoration', 'underline');
                    }
                    else {
                        $('#spnLockUserTP').css('cursor', 'default');
                        $('#spnLockUserTP').css('text-decoration', 'blink');
                        $("#spnLockUserTP").text('0');
                        $("#spnLockTP").text("(0)");
                        $("#spnTPUnavalibleStatus").text(AdminDashboard.defaults.TPUnavalibleLockStatus);
                    }
                }

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvTPUnavalibleLock");
                //fnMsgAlert('error', 'Error', 'Bind TP Unavalible Lock Count failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvTPUnavalibleLock");
            }
        });
    },
    getTPApprovalLockCount: function () {
        var _objData = new Object();
        _objData.Lock_Type = "TP_Approval_Lock";
        _objData.DcrTpLockStatus = AdminDashboard.defaults.TPApprovalLockStatus;


        $.ajax({
            start: AdminDashboard.blockUI("dvTPApprovalLock"),
            type: 'POST',
            url: "DashBoard/GetDcrTPLockCounts",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                if (jsonData != undefined && jsonData != null) {
                    if (jsonData.LockedUserCount > 0) {

                        $("#spnLockUserApproveTP").text(jsonData.LockedUserCount);
                        $("#spnLockApproveTP").text("(" + jsonData.LockedCount + ")");
                        $("#spnTPApprovalStatus").text(AdminDashboard.defaults.TPApprovalLockStatus);

                        $("#spnLockUserApproveTP").off("click").click(function () {
                            AdminDashboard.getTPApprovalLockCountPopUp();
                        });

                        $('#spnLockUserApproveTP').css('cursor', 'pointer');
                        $('#spnLockUserApproveTP').css('text-decoration', 'underline');
                    }
                    else {
                        $('#spnLockUserApproveTP').css('cursor', 'default');
                        $('#spnLockUserApproveTP').css('text-decoration', 'blink');
                        $("#spnLockUserApproveTP").text('0');
                        $("#spnLockApproveTP").text("(0)");
                        $("#spnTPApprovalStatus").text(AdminDashboard.defaults.TPApprovalLockStatus);
                    }
                }

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvTPApprovalLock");
                //fnMsgAlert('error', 'Error', 'Bind TP Approval Lock Count failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvTPApprovalLock");
            }
        });
    },
    getDcrLockCountPopUp: function () {
        var _objData = new Object();
        _objData.Lock_Type = "LOCK_LEAVE,IDLE_DCR";
        _objData.DcrTpLockStatus = AdminDashboard.defaults.DcrLockStatus;

        $.ajax({
            start: AdminDashboard.blockUI("dvDCRLock"),
            type: 'POST',
            url: "DashBoard/GetDcrTPLockPopUpDetails",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                $("#dvInfoContent").html("");
                var strTable = "";
                strTable += "<table class='data display datatable dataTable table' id='tblDCRLock'><thead><tr><th>User Name</th><th>Employee Name(Emp Num)</th><th>Region Name</th><th>Division Name</th></th><th>Designation</th><th>Locked Date</th><th>Actual Date</th><th>Lock Status</th><th>Lock Type</th></tr></thead><tbody>";
                for (var i = 0; i < jsonData.length; i++) {
                    strTable += "<tr><td>" + jsonData[i].User_Name + "</td><td>" + jsonData[i].Employee_Name + '(' + jsonData[i].Employee_Number + ')' + "</td><td>" + jsonData[i].Region_Name + "</td><td>" + jsonData[i].Division_Name + "</td><td>" + jsonData[i].User_Type_Name + "</td><td>"
                        + jsonData[i].Locked_Date + "</td><td>" + jsonData[i].DCR_Actual_Date + "</td><td>" + jsonData[i].Lock_Status + "</td><td>" + jsonData[i].Lock_Type + "</td></tr>";
                }
                strTable += "</tbody></table>"
                $("#dvMoreInfoHeader").html("DCR Lock Details");
                $("#dvInfoContent").html(strTable);
                ShowModalPopup("dvMoreInfoModal");

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvDCRLock");
                //fnMsgAlert('error', 'Error', 'Bind DCR Lock Count failed');
            },
            complete: function () {
                $('#tblDCRLock').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": {
                        "aButtons": [
                       {
                           "sExtends": "excelHtml5",
                           "sTitle": 'DCR',
                           "oTableTools.sTitle": "DCRLock",
                           "sButtonText": "Export to XLS",
                           "sExportOptions": {
                               "columns": ':visible'
                           }
                       }
                        ]
                    }
                });

                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print").hide();
                AdminDashboard.UnblockUI("dvDCRLock");
            }
        });
    },
    getTPUnavalibleLockCountPopUp: function () {
        var _objData = new Object();
        _objData.Lock_Type = "TP_UNAVAILABILITY";
        _objData.DcrTpLockStatus = AdminDashboard.defaults.TPUnavalibleLockStatus;

        $.ajax({
            start: AdminDashboard.blockUI("dvTPUnavalibleLock"),
            type: 'POST',
            url: "DashBoard/GetDcrTPLockPopUpDetails",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                $("#dvInfoContent").html("");
                var strTable = "";
                strTable += "<table class='data display datatable dataTable table' id='tblTPUnavalible'><thead><tr><th>User Name</th><th>Employee Name(Emp Num)</th><th>Region Name</th><th>Division Name</th></th><th>Designation</th><th>Locked Date</th><th>Lock Status</th><th>Lock Type</th></tr></thead><tbody>";
                for (var i = 0; i < jsonData.length; i++) {
                    strTable += "<tr><td>" + jsonData[i].User_Name + "</td><td>" + jsonData[i].Employee_Name + '(' + jsonData[i].Employee_Number + ')' + "</td><td>" + jsonData[i].Region_Name + "</td><td>" + jsonData[i].Division_Name + "</td><td>" + jsonData[i].User_Type_Name + "</td><td>"
                        + jsonData[i].Locked_Date + "</td><td>" + jsonData[i].Lock_Status + "</td><td>" + jsonData[i].Lock_Type + "</td></tr>";
                }
                strTable += "</tbody></table>"
                $("#dvMoreInfoHeader").html("TP Unavailable Lock Details");
                $("#dvInfoContent").html(strTable);
                ShowModalPopup("dvMoreInfoModal");

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvTPUnavalibleLock");
                //fnMsgAlert('error', 'Error', 'Bind TP Unavalible Lock Count failed');
            },
            complete: function () {
                $('#tblTPUnavalible').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": {
                        "aButtons": [
                       {
                           "sExtends": "excelHtml5",
                           "sTitle": "TP Unavailability",
                           "oTableTools.sTitle": "TPUnavailability",
                           "sButtonText": "Export to XLS",
                           "sExportOptions": {
                               "columns": ':visible'
                           }
                       }
                        ]
                    }
                });

                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print").hide();
                AdminDashboard.UnblockUI("dvTPUnavalibleLock");
            }
        });
    },
    getTPApprovalLockCountPopUp: function () {
        var _objData = new Object();
        _objData.Lock_Type = "TP_Approval_Lock";
        _objData.DcrTpLockStatus = AdminDashboard.defaults.TPApprovalLockStatus;

        $.ajax({
            start: AdminDashboard.blockUI("dvTPApprovalLock"),
            type: 'POST',
            url: "DashBoard/GetDcrTPLockPopUpDetails",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                $("#dvInfoContent").html("");
                var strTable = "";
                strTable += "<table class='data display datatable dataTable table' id='tblTPApproval'><thead><tr><th>User Name</th><th>Employee Name(Emp Num)</th><th>Region Name</th><th>Division Name</th></th><th>Designation</th><th>Locked Date</th><th>Lock Status</th><th>Lock Type</th></tr></thead><tbody>";
                for (var i = 0; i < jsonData.length; i++) {
                    strTable += "<tr><td>" + jsonData[i].User_Name + "</td><td>" + jsonData[i].Employee_Name + '(' + jsonData[i].Employee_Number + ')' + "</td><td>" + jsonData[i].Region_Name + "</td><td>" + jsonData[i].Division_Name + "</td><td>" + jsonData[i].User_Type_Name + "</td><td>"
                        + jsonData[i].Locked_Date + "</td><td>" + jsonData[i].Lock_Status + "</td><td>" + jsonData[i].Lock_Type + "</td></tr>";
                }
                strTable += "</tbody></table>"
                $("#dvMoreInfoHeader").html("TP Approval Lock Details");
                $("#dvInfoContent").html(strTable);
                ShowModalPopup("dvMoreInfoModal");

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvTPApprovalLock");
                //fnMsgAlert('error', 'Error', 'Bind TP Approval Lock Count failed');
            },
            complete: function () {
                $('#tblTPApproval').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": {
                        "aButtons": [
                       {
                           "sExtends": "excelHtml5",
                           "sTitle": "TP Approval Lock.",
                           "oTableTools.sTitle": "TP Approval Lock",
                           //"sButtonText": "Export to XLS",
                           "sExportOptions": {
                               "columns": ':visible'
                           }
                       }
                        ]
                    }
                });

                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print").hide();
                AdminDashboard.UnblockUI("dvTPApprovalLock");
            }
        });
    },
    getMarketingCampaignCount: function () {

        $.ajax({
            start: AdminDashboard.blockUI("dvCampaigns"),
            type: 'POST',
            url: "DashBoard/GetMarketingCampaignCount",
            dataType: 'json',
            success: function (jsonData) {

                if (jsonData != undefined && jsonData != null) {
                    if (jsonData.ActiveRuningMcCount > 0) {

                        $("#spnAcctiveRunMc").text(jsonData.ActiveRuningMcCount);
                        //$("#spnNumParticipant").text("(" + jsonData.No_ParticipantCount + ")");

                        $("#spnAcctiveRunMc").click(function () {
                            AdminDashboard.getMarketingCampaignCountPopUpNew();
                        });

                        $('#spnAcctiveRunMc').css('cursor', 'pointer');
                        $('#spnAcctiveRunMc').css('text-decoration', 'underline');
                    }
                    else {
                        $('#spnAcctiveRunMc').css('cursor', 'default');
                        $('#spnAcctiveRunMc').css('text-decoration', 'blink');
                    }
                }

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvCampaigns");
                //fnMsgAlert('error', 'Error', 'Bind Marketing Campaign failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvCampaigns");
            }
        });
    },
    getMarketingCampaignCountPopUpNew: function () {
        $('#main').load('Dashboard/MarketingCampaign/' + 'admin');
    },
    getMarketingCampaignCountPopUp: function () {

        $.ajax({
            start: AdminDashboard.blockUI("tblMarketingCamp"),
            type: 'POST',
            url: "DashBoard/GetMarketingCampaignCountPopUp",
            dataType: 'json',
            success: function (jsonData) {
                $("#tblMarketingCampRegionDetail").hide();
                $("#tblMarketingCampDoctorDetail").hide();
                $('#titleReg').hide();
                $('#titleDoc').hide();
                var strTable = "";
                strTable += "<table class='table table-striped details' id='tblMarketingCampaigninfo'><thead><tr><th>Campaign Name</th><th>Start Date</th><th>End Date</th></th><th>Doctor Count</th><th>Region Count</th><th>Proposed Count</th><th>Mapped Doctor Count</th><th>Mapped Percentage</th></tr></thead><tbody>";
                for (var i = 0; i < jsonData.length; i++) {
                    strTable += "<tr><td style='text-decoration: underline;color:blue;cursor: pointer;'; onclick=AdminDashboard.GetMarketingCampaignRegionPopUP('" + jsonData[i].Campaign_Code + "','" + encodeURIComponent(jsonData[i].Campaign_Name) + "')>" + jsonData[i].Campaign_Name + "</td><td>" + jsonData[i].MC_Start_Date + "</td><td>" + jsonData[i].MC_End_Date + "</td><td>" + jsonData[i].Customer_Count + "</td><td>"
                        + jsonData[i].Region_Count + "</td><td>" + jsonData[i].Proposed_Count + "</td><td>" + jsonData[i].Actual_Met_Count + "</td><td>" + jsonData[i].Coverage_percentage + "%</td>";
                }
                strTable += "</tbody></table>"
                $("#tblMarketingCampDetail").html(strTable);

            },
            error: function (e) {
                AdminDashboard.UnblockUI("tblMarketingCamp");
                //fnMsgAlert('error', 'Error', 'Bind Marketing Campaign failed');
            },
            complete: function () {
                $('#tblMarketingCampaigninfo').DataTable(
               {
                   "paging": false,
                   "ordering": false,
                   //"info": false
                   "bRetrieve": true,
                   "bDestroy": true,
                   "bPaginate": false,
               });

                AdminDashboard.UnblockUI("tblMarketingCamp");
                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print,.dataTables_info").hide();
            }
        });
    },
    GetMarketingCampaignRegionPopUP: function (Campaign_Code, Campaign_Name) {
        var _objData = new Object();
        _objData.Campaign_Code = Campaign_Code;
        var Camp_Name = decodeURIComponent(Campaign_Name);

        $.ajax({
            start: AdminDashboard.blockUI("tblMarketingCampaign"),
            type: 'POST',
            url: "DashBoard/GetMarketingCampaignRegionPopUP",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                debugger;
                $("#tblMarketingCampRegionDetail").show();
                $("#tblMarketingCampDoctorDetail").hide();
                $('#titleReg').show();
                $('#titleDoc').hide();
                var strTable = "";
                $('#titleReg').html('Marketing Campaign Region Based Details for "'+Camp_Name+'"');
                strTable += "<table class='table table-striped details' id='tblMarketingCampaignMap'><thead><tr><th>S.No</th><th>Region Name</th><th> Participant Name</th><th>Doctors Mapped</th><th>Doctors Met</th></th><th>Visit Count</th><th>Coverage Percentage</th></tr></thead><tbody>";
                var lnkcreatedby = '';
                for (var i = 0; i < jsonData.length; i++) {
                    var l = i + 1;
                    var Created_By = jsonData[i].Employee_Name;
                    if (Created_By == null || Created_By == "") {
                        Created_By = '-';
                        lnkcreatedby = '';
                    }
                    else {
                        Created_By = jsonData[i].Employee_Name + "(" + jsonData[i].User_Type_Name+")";
                        lnkcreatedby = jsonData[i].Created_by;
                    }
                    if (jsonData[i].Doctor_Count == 0) {
                        strTable += "<tr><td>" + l + "</td><td>" + jsonData[i].Region_Name + "</td>";
                    }
                    else {
                        strTable += "<tr><td>"+ l +"</td><td style='text-decoration: underline;color:blue;cursor: pointer;'; onclick=AdminDashboard.GetMarketingCampaignDoctorPopUP('" + jsonData[i].Campaign_Code + "','" + jsonData[i].Region_Code + "','" + encodeURIComponent(jsonData[i].Region_Name) + "','" + encodeURIComponent(lnkcreatedby) + "','" + encodeURIComponent(Camp_Name) + "')>" + jsonData[i].Region_Name + "</td>";
                    }
                    strTable += "<td>" + Created_By + "</td><td>" + jsonData[i].Doctor_Count + "</td><td>" + jsonData[i].Actual_Met_Count + "</td><td>" + jsonData[i].Visit_Count + "</td><td>" + jsonData[i].Coverage_percentage + "%</td></tr>";
                }
                strTable += "</tbody></table>"
                $("#tblMarketingCampRegionDetail").html(strTable);
                $('html,body').animate({
                    scrollTop: $("#tblMarketingCampRegionDetail").offset().top
                },
'slow');

            },
            error: function (e) {
                AdminDashboard.UnblockUI("tblMarketingCampaign");
                //fnMsgAlert('error', 'Error', 'Bind Marketing Campaign failed');
            },
            complete: function () {
                $('#tblMarketingCampaignMap').DataTable(
                 {
                     "paging": false,
                     "ordering": false,
                     //"info": false
                     "bRetrieve": true,
                     "bDestroy": true,
                     "bPaginate": false,
                 });
                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print,.dataTables_info").hide();
                AdminDashboard.UnblockUI("tblMarketingCampaign");
            }
        });
    },
    GetMarketingCampaignDoctorPopUP: function (Campaign_Code, Region_Code, Region_Name, Created_By, Camp_Name) {
        debugger;
        var _objData = new Object();
        _objData.Campaign_Code = Campaign_Code;
        _objData.RegionCode = Region_Code;
        var Reg_Name = decodeURIComponent(Region_Name);
        var camp_Name = decodeURIComponent(Camp_Name);
        _objData.Created_By = decodeURIComponent(Created_By);
        $.ajax({
            start: AdminDashboard.blockUI("tblMarketingCampRegionDetail"),
            type: 'POST',
            url: "DashBoard/GetMarketingCampaignDetailsForDoctor",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                $("#tblMarketingCampDoctorDetail").show();
                $('#titleDoc').show();
                var strTable = "";
                $('#titleDoc').html('Marketing Campaign Doctor Based Details for "' + camp_Name + '" & " ' + Reg_Name + '"');
                strTable += "<table class='table table-striped details' id='tblMarketingCampaignUserMapped'><thead><tr><th>Doctor Name</th><th>Category Name</th><th>Speciality Name</th><th>Visit Type</th><th>Visit Count</th></tr></thead><tbody>";
                for (var i = 0; i < jsonData.length; i++) {
                    strTable += "<tr><td>" + jsonData[i].Customer_Name + "</td><td>" + jsonData[i].Category_Name + "</td><td>" + jsonData[i].Speciality_Name + "</td><td>" + jsonData[i].Visit_Mode + "</td><td>" + jsonData[i].Actual_Met_Count + "</td></tr>";
                }
                strTable += "</tbody></table>"
                $("#tblMarketingCampDoctorDetail").html(strTable);
                $('html,body').animate({
                    scrollTop: $("#tblMarketingCampDoctorDetail").offset().top
                },
    'slow');

            },
            error: function (e) {
                AdminDashboard.UnblockUI("tblMarketingCampRegionDetail");
                //fnMsgAlert('error', 'Error', 'Bind Marketing Campaign failed');
            },
            complete: function () {
                $('#tblMarketingCampaignUserMapped').DataTable(
                     {
                         "paging": false,
                         "ordering": false,
                         //"info": false
                         "bRetrieve": true,
                         "bDestroy": true,
                         "bPaginate": false,
                     });
                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print,.dataTables_info").hide();
                AdminDashboard.UnblockUI("tblMarketingCampRegionDetail");
            }
        });
    },
    getDCRCompliance: function () {
        debugger;
        var _objData = new Object();
        _objData.MonthType = AdminDashboard.defaults.DcrComplianceMonthType;

        $.ajax({
            start: AdminDashboard.blockUI("dvDCRComplaince"),
            type: 'POST',
            url: "DashBoard/GetDCRCompliance",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                debugger;

                if (AdminDashboard.defaults.DcrComplianceMonthType == "CURRENT") {
                    $(".spnCurPreTxt").text("Current Month");
                }
                else {
                    $(".spnCurPreTxt").text("Previous Month");
                }

                var monthstatus = AdminDashboard.defaults.DcrComplianceMonthType;

                if (jsonData != undefined && jsonData != null) {
                    $("#spnDCRCompliance").show();
                    $("#spnDCRCompliancecount").hide();
                    $('.spnCurPreTxt').css('color', 'blue');
                    $('.spnCurPreTxt').css('text-decoration', 'underline');
                    $('.spnCurPreTxt').css('margin-left', '-56px');
                    $('#CPheader').css('padding-top', '2px');
                    $('#CPheader').css('margin-left', '50px');
                    var data = google.visualization.arrayToDataTable([
                        ['Label', 'Value'],
                         ['', jsonData[0].count],
                    ]);
                    var options = {
                        width: 800, height: 90,
                        greenFrom: 75, greenTo: 100,
                        yellowFrom: 50, yellowTo: 75,
                        redFrom: 0, redTo: 50,
                        minorTicks: 4,
                        fontSize: 20,
                        fontName: "Arial"
                    };
                    new google.visualization.Gauge(document.getElementById('spnDCRCompliance')).draw(data, options);

                    $("#dcrlink").off("click").click(function () {
                        AdminDashboard.getDCRComplianceDetailPopUp(monthstatus);
                    });



                }

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dvDCRComplaince");
                //fnMsgAlert('error', 'Error', 'Bind Dcr Compliance failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dvDCRComplaince");
            }
        });
    },
    getDCRComplianceDetailPopUp: function (monthstatus) {
        debugger;
        $('#main').load('Dashboard/DashboardDrilldown/' + monthstatus);

    },
    getDCRCompliancePopUpNew: function () {
        debugger;
        var _objData = new Object();
        _objData.Division_Name = $('#ddlDcrComplianceDivsion').val();
        _objData.User_Type = $('#ddlUserType').val();
        _objData.MonthType = $('#ddlMode').val();
        if (_objData.Division_Name == '-- All --') {
            _objData.Division_Name = 'All';
        }
        var user_type = "";
        if (_objData.User_Type == 1) {
            user_type = 'Field';
        }
        else if (_objData.User_Type == 2) {
            user_type = 'Non Field';
        }
        else {
            user_type = 'All';
        }
        $('#heading').show();

        $.ajax({
            start: AdminDashboard.blockUI("dcrcount"),
            type: 'POST',
            url: "DashBoard/GetDCRCompliancePopUp",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                debugger;
                if (jsonData.length >= 0) {
                    var strTable = "";
                    // strTable += "<div><h2>DCR Complaince Details from " + jsonData[0].start_date + " to " + jsonData[0].End_date + "</h2><input type='button' id='ExportExcel' value='Export to Excel' /></div>";
                    strTable += "<table  cellspacing='0' cellpadding='0' class='table table-striped' id='tblDCRDetail'><thead><tr><th>S.No</th><th>User Name</th><th>Designation</th><th>Region Name</th><th>Division Name</th></th><th>Hidoctor Start Date</th><th>Start Date</th><th>End Date</th><th>Resignation Date</th><th>User Status</th><th>Total Count</th>";
                    strTable += "<th>Week End</th><th>Holiday</th><th>Applicable Count</th><th>Working Count</th><th>Dcr Compliance</th></tr></thead><tbody>";
                    for (var i = 0; i < jsonData.length; i++) {
                        var j = i + 1
                        var resignationDate = jsonData[i].resignation_date == null ? "NA" : jsonData[i].resignation_date;
                        var divisionName = jsonData[i].division_values == null ? "NA" : jsonData[i].division_values;
                        strTable += "<tr><td>" + j + "</td><td>" + jsonData[i].user_name + "</td><td>" + jsonData[i].user_type_name + "</td><td>" + jsonData[i].region_name + "</td><td>" + divisionName + "</td><td>" + jsonData[i].hidoctor_startdate + "</td>";
                        strTable += "<td>" + jsonData[0].start_date + "</td><td>" + jsonData[0].End_date + "</td>";
                        strTable += "<td>" + resignationDate + "</td><td>" + jsonData[i].user_status + "</td><td>" + jsonData[i].total_count + "</td><td>" + jsonData[i].weekends + "</td><td>" + jsonData[i].holiday + "</td>";
                        strTable += "<td>" + jsonData[i].applicable_count + "</td><td>" + jsonData[i].working_count + "</td><td>" + jsonData[i].dcr_compliance + "</td></tr>";
                    }
                    strTable += "</tbody></table>"
                    $("#ComplianceDetail").html(strTable);

                    $("#ComplianceDetail").show();
                    $("#heading").html("<h2>DCR Compliance Details For Division Name - " + _objData.Division_Name + ", User Type - " + user_type + ", Month - " + _objData.MonthType + "  </h2>");
                }

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dcrcount");
                //fnMsgAlert('error', 'Error', 'Bind Dcr Compliance failed');
            },
            complete: function () {
                var table = $('#tblDCRDetail').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                });
                $(".TableTools_clipboard, .TableTools_csv, .TableTools_print").hide();
                AdminDashboard.UnblockUI("dcrcount");
            }
        });
    },

    getNewCategoryCoverage: function () {
        debugger;
        $('#categorydrop').fadeOut();
        var month = Month_category;
        var year = Year_category
        var _objData = new Object();
        _objData.IsCurrent = AdminDashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        if (_objData.IsCurrent == 'Previous') {
            if (month == 1) {
                month = 12;
                year = year - 1;
            }
            else {
                month = month - 1;
            }
        }

        _objData.Month = month;
        _objData.Year = year;

        AdminDashboard.defaults.CategoryCoverageDetails = $("#ddlCategoryCoverageDivision").find(':selected').val();
        //var _objData = new Object();
        _objData.Division_Name = AdminDashboard.defaults.CategoryCoverageDetails;

        if (_objData.Division_Name == '-- All --') {
            _objData.Division_Name = '';
        }


        $.ajax({
            // start: AdminDashboard.blockUI("dvDCRComplaince"),
            type: 'POST',
            url: "DashBoard/GetNewCategoryCoverage",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                debugger;
                var missedDoctors = jsonData[0].Missed;
                var metasperstandard = jsonData[0].Exact_Norms;
                var lessthanStdVisits = jsonData[0].Less_Norms;
                var morethanStdVisits = jsonData[0].More_Norms;
                var totalDoctors = jsonData[0].Total;
                var progressmissed = (missedDoctors / totalDoctors) * 100;
                var progressstandard = (metasperstandard / totalDoctors) * 100;
                var progressless = (lessthanStdVisits / totalDoctors) * 100;
                var progressmore = (morethanStdVisits / totalDoctors) * 100;
                var myArray = [missedDoctors, metasperstandard, lessthanStdVisits, morethanStdVisits];
                var maxValueInArray = Math.max.apply(Math, myArray);
                var index = myArray.indexOf(maxValueInArray);
                if (missedDoctors == 0 && metasperstandard == 0 && lessthanStdVisits == 0 && morethanStdVisits == 0) {
                    index = -1;
                }
                var className = 'max-category';
                var content = '';
                content += "<p class='lengend'>";
                content += "<span>Completely missed count</span>";
                if (missedDoctors > 0) {
                    content += "<span class='doc-count doc-missed'><b class='cls-link'>" + missedDoctors + "</b>/" + totalDoctors + " Doctors</span>";
                }
                else {
                    content += "<span class='doc-count'><b>" + missedDoctors + "</b>/" + totalDoctors + " Doctors</span>";
                }
                content += "</p>";
                if (index == 0) {
                    content += "<div class='progress missed-main " + className + "'>";
                }
                else {
                    content += "<div class='progress missed-main'>";
                }
                if (AdminDashboard.defaults.isCurrent) {
                    content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressmissed + "%'>";
                }
                else {
                    content += "<div class='progress-bar progress-missed' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressmissed + "%'>";
                }

                content += "</div>";
                content += "</div>";
                content += "<p class='lengend'>";
                content += "<span>Met as per Std. Norm (Doctor Count)</span>";
                if (metasperstandard > 0) {
                    content += "<span class='doc-count doc-met-per-std'><b class='cls-link'>" + metasperstandard + "</b>/" + totalDoctors + " Doctors</span>";
                }
                else {
                    content += "<span class='doc-count'><b class=''>" + metasperstandard + "</b>/" + totalDoctors + " Doctors</span>";
                }
                content += "</p>";
                if (index == 1) {
                    content += "<div class='progress met-main " + className + "'>";
                }
                else {
                    content += "<div class='progress met-main'>";
                }
                if (AdminDashboard.defaults.isCurrent) {
                    content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressstandard + "%'>";
                } else {
                    content += "<div class='progress-bar progress-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressstandard + "%'>";
                }

                content += "</div>";
                content += "</div>";
                content += "<p class='lengend'>";
                content += "<span>Less than Std. Norm (Doctor Count)</span>";
                if (lessthanStdVisits > 0) {
                    content += "<span class='doc-count doc-less-met'><b class='cls-link'>" + lessthanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
                }
                else {
                    content += "<span class='doc-count'><b class=''>" + lessthanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
                }
                content += " </p>";
                if (index == 2) {
                    content += "<div class='progress less-met-main " + className + "'>";
                }
                else {
                    content += "<div class='progress less-met-main'>";
                }
                if (AdminDashboard.defaults.isCurrent) {
                    content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressless + "%'>";
                } else {
                    content += "<div class='progress-bar progress-less-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressless + "%'>";
                }

                content += "</div>";
                content += "</div>";
                content += "<p class='lengend'>";
                content += "<span>More than Std. Norm (Doctor Count)</span>";
                if (morethanStdVisits > 0) {
                    content += "<span class='doc-count doc-more-met'><b class='cls-link'>" + morethanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
                }
                else {
                    content += "<span class='doc-count'><b class=''>" + morethanStdVisits + "</b>/" + totalDoctors + " Doctors</span>";
                }
                content += " </p>";
                if (index == 3) {
                    content += "<div class='progress more-met-main " + className + "'>";
                }
                else {
                    content += "<div class='progress more-met-main'>";
                }
                if (AdminDashboard.defaults.isCurrent) {
                    content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressmore + "%'>";
                } else {
                    content += "<div class='progress-bar progress-more-met' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: " + progressmore + "%'>";
                }

                content += " </div>";
                content += " </div>";
                $('.cls-all-coverage').html(content);
                $('.doc-missed').unbind('click').bind('click', function () {
                    AdminDashboard.redirectToDoctorVisitReport('1', _objData.Division_Name, '');
                });
                $('.doc-met-per-std').unbind('click').bind('click', function () {
                    AdminDashboard.redirectToDoctorVisitReport('2', _objData.Division_Name, '');
                });
                $('.doc-less-met').unbind('click').bind('click', function () {
                    AdminDashboard.redirectToDoctorVisitReport('3', _objData.Division_Name, '');
                });
                $('.doc-more-met').unbind('click').bind('click', function () {
                    AdminDashboard.redirectToDoctorVisitReport('4', _objData.Division_Name, '');
                });
            },
        });
    },
    redirectToDoctorVisitReport: function (mode, Division_Name, regionCode) {
        var IsCurrent = AdminDashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        Division_Name = encodeURIComponent(Division_Name);
        $('#main').load('Dashboard/AdminDashboardDoctorVisit/' + mode + '~' + Division_Name + '~' + regionCode + "~" + AdminDashboard.defaults.Child_User_Count + "~" + IsCurrent);
    },
    getNewCategoryCoverageSummary: function (curMonth, curYear, mode, Division_Name) {
        var _objData = new Object();
        _objData.IsCurrent = AdminDashboard.defaults.isCurrent == true ? 'Current' : 'Previous';
        _objData.Month = curMonth;
        _objData.Year = curYear;
        _objData.Division_Name = Division_Name;
        _objData.Option_Type = mode;
        AdminDashboard.blockUI("main"),
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "DashBoard/GetNewCategoryCoverageSummery",
            success: function (jsonData) {
                var Division = '';
                var content = '';
                content += "<table class='data display datatable dataTable' id='tblAdminDashboardVisitSummary'><thead><tr><th>S.No</th><th>Region Name</th><th>Employee Name</th><th>Employee Number</th><th>Designation</th><th>Total Doctors</th>";
                content += "<th>Doctor Missed</th><th>Met Exactly</th><th>Less than met</th><th>More than met</th></tr></thead><tbody>";
                var i = 0;
                if (jsonData != false && jsonData != '' && jsonData != null && jsonData != undefined) {

                    $.each(jsonData, function (index, value) {
                        i = i + 1;
                        content += " <tr>";
                        content += "<td>" + i + "</td>";
                        content += "<td><span Class='cls-link' onclick=AdminDashboard.getRegionCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',1)  >" + value.Region_Name + "</span></td>";
                        content += "<td>" + value.Employee_Name + "</td>";
                        content += "<td>" + value.Employee_Number + "</td>";
                        content += "<td>" + value.Designation + "</td>";
                        content += "<td>" + value.Total + "</td>";
                        if (value.Missed > 0) {
                            content += "<td class='cls-missed-color'><span class='cls-link' onclick=AdminDashboard.getNewRepCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + Division + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',1)>" + value.Missed + "</span></td>";
                        }
                        else {
                            content += "<td class='cls-missed-color'><span>" + value.Missed + "</span></td>";
                        }
                        if (value.Exact_Norms > 0) {
                            content += "<td class='cls-met-std'><span class='cls-link' onclick=AdminDashboard.getNewRepCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + Division + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',2)>" + value.Exact_Norms + "</span></td>";
                        }
                        else {
                            content += "<td class='cls-met-std'><span>" + value.Exact_Norms + "</span></td>";
                        }
                        if (value.Less_Norms > 0) {
                            content += "<td class='cls-met-less'><span  class='cls-link'  onclick=AdminDashboard.getNewRepCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + Division + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',3)>" + value.Less_Norms + "</span></td>";
                        }
                        else {
                            content += "<td class='cls-met-less'><span>" + value.Less_Norms + "</span></td>";
                        }
                        if (value.More_Norms > 0) {
                            content += "<td class='cls-met-more'><span class='cls-link' onclick=AdminDashboard.getNewRepCategoryWiseVisit('" + curMonth + "','" + curYear + "','" + Division + "','" + value.Region_Code + "','" + encodeURIComponent(value.Region_Name) + "',4)>" + value.More_Norms + "</span></td>";

                        }
                        else {
                            content += "<td class='cls-met-more'><span>" + value.More_Norms + "</span></td>";
                        }
                        content += "</tr>";
                    });
                }

                content += " </tbody>";
                content += "</table>";
                $('#dvManagerVisit').html(content);
                $('.tblFilter').hide();
            },
            error: function (e) {
                AdminDashboard.UnblockUI("main");
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
            },
            complete: function (jsonData) {

                AdminDashboard.UnblockUI("main");
            }
        });

    },
    getRegionCategoryWiseVisit: function (Month, Year, Region_Code, Region_Name, mode) {
        debugger;
        var _objData = new Object();
        _objData.Month = Month;
        _objData.Year = Year;
        _objData.RegionCode = Region_Code;
        var RegionName = decodeURIComponent(Region_Name);
        $.ajax({
            start: AdminDashboard.blockUI("main"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "DashBoard/GetRegionCategoryCoverageSummery",
            success: function (jsonData) {
                $('#dvRepVisit').html('');
                $('#dvTitleForRep').html('Region wise doctor details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
                var content = '';
                content += "<table class='data display datatable' id='tblCategoryWiseDoctorVisit'><thead><tr><th>S.No</th><th>Category Name</th><th>Speciality Name</th><th>Total Doctors</th><th>Doctor Missed</th><th>Met Exactly</th><th>Less than met</th><th>More than met</th></tr></thead><tbody>";
                var i = 0;
                if (jsonData != false && jsonData != '' && jsonData != null && jsonData != undefined) {

                    $.each(jsonData, function (index, value) {
                        i = i + 1;
                        content += " <tr>";
                        content += "<td>" + i + "</td>";
                        content += "<td>" + value.Category_Name + "</td>";
                        content += "<td>" + value.Speciality_Name + "</td>";
                        content += "<td>" + value.Total + "</td>";
                        content += "<td class='cls-missed-color'>" + value.Missed + "</td>";
                        content += "<td class='cls-met-std'>" + value.Exact_Norms + "</td>";
                        content += "<td class='cls-met-less'>" + value.Less_Norms + "</td>";
                        content += "<td class='cls-met-more'>" + value.More_Norms + "</td>";
                        content += "</tr>";
                    });
                }
                content += " </tbody>";
                content += "</table>";
                $('#dvRepVisit').html(content);
                $('html,body').animate({
                    scrollTop: $("#dvTitleForRep").offset().top
                },
    'slow');
                $('#tblCategoryWiseDoctorVisit').DataTable(
    {
        "paging": false,
        "ordering": false,
        //"info": false
        "bRetrieve": true,
        "bDestroy": true,
        "bPaginate": false,
    });
                $('.tblFilter').hide();
            },
            error: function (e) {
                AdminDashboard.UnblockUI("main");
            },
            complete: function (jsonData) {

                AdminDashboard.UnblockUI("main");
            }
        });

    },
    getNewRepCategoryWiseVisit: function (Month, Year, Division_Name, Region_Code, Region_Name, mode) {
        AdminDashboard.blockUI("dvManagerVisit");
        firstTimeLoad = true;
        $('#cboCategory').val('');
        $('#cboSpeciality').val('');
        AdminDashboard.getNewUserDashboardCategoryWiseVisits(Month, Year, Division_Name, Region_Code, Region_Name, mode);

    },
    getNewUserDashboardCategoryWiseVisits: function (Month, Year, Division_Name, Region_Code, Region_Name, mode) {
        var u = {};
        u.name = "Month";
        u.value = Month;

        var r = {};
        r.name = "Year";
        r.value = Year;

        var m = {};
        m.name = "Option_Type";
        m.value = mode;

        var c = {};
        c.name = "category";
        if ($('#cboCategory').val() == null) {
            c.value = '';
        }
        else {
            c.value = $('#cboCategory').val();
        }

        var s = {};
        s.name = "speciality";
        if ($('#cboSpeciality').val() == null) {
            s.value = '';
        }
        else {
            s.value = $('#cboSpeciality').val();
        }

        var p = {};
        p.name = "isCurrent";
        p.value = AdminDashboard.defaults.isCurrent == true ? 'Current' : 'Previous';

        var d = {};
        d.name = "Division_Name";
        d.value = Division_Name;
        var e = {};
        e.name = "RegionCode";
        e.value = Region_Code;
        var ar = new Array();
        ar.push(u);
        ar.push(r);
        ar.push(m);
        ar.push(c);
        ar.push(s);
        ar.push(p);
        ar.push(d);
        ar.push(e);

        var content = '';
        HDAjax.requestInvoke("Dashboard", "GetNewCategoryCoverageSummery_Drill", ar, "POST",
        function (jsonResult) {
            AdminDashboard.bindNewCategoryWiseDoctorVisit(jsonResult, mode, Month, Year, Region_Name, Division_Name)
        });
        //$('#dvInfoContent').html(content);
        //$('.clsModalTitle').html('Pending DCR');
        //ShowModalPopup("dvMoreInfoModal");
    },
    bindNewCategoryWiseDoctorVisit: function (jsonResult, mode, Month, Year, Region_Name, Division_Name) {
        var RegionName = decodeURIComponent(Region_Name);
        $('#dvRepVisit').html('');
        if (mode == 1) {
            $('#dvTitleForRep').html('Doctor missed details of  ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
        }
        else if (mode == 2) {
            $('#dvTitleForRep').html('Doctor met exactly details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
        }
        else if (mode == 3) {
            $('#dvTitleForRep').html('Doctor Less than met details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
        }
        else {
            $('#dvTitleForRep').html('Doctor more than met details of ' + monthArray[parseInt(Month) - 1] + "-" + Year + ' (' + RegionName + ')');
        }
        var content = '';
        var disCatAr = new Array();
        var disSpeAr = new Array();
        content += "<table class='data display ' id='tblCategoryWiseDoctorVisit'><thead><tr><th>S.No</th><th>Doctor Name</th><th>Speciality</th><th>MDL No</th>";
        content += "<th>Category</th><th>Standard Visit</th><th># Current Month Visits</th><th># Previous Month Visits</th></tr> </thead><tbody>";
        var i = 0;
        if (jsonResult != false && jsonResult != '' && jsonResult != null && jsonResult != undefined) {
            $.each(jsonResult, function (index, value) {

                i = i + 1;
                var curClassName = '';
                var preClassName = '';
                var curValue = 0;
                var preValue = 0;
                var stdVisitCount = 0;
                if (firstTimeLoad) {
                    if ($.inArray(value.Category_Name, disCatAr) == -1) {
                        disCatAr.push(value.Category_Name);
                    }
                    if ($.inArray(value.Speciality_Name, disSpeAr) == -1) {
                        disSpeAr.push(value.Speciality_Name);
                    }
                }

                content += "<tr><td>" + i + "</td>";
                content += "<td>" + value.Doctor_Name + "</td>";
                content += "<td>" + value.Speciality_Name + "</td>";
                content += "<td>" + value.Doctor_MDL + "</td>";
                content += "<td>" + value.Category_Name + "</td>";
                content += "<td>" + value.Norms_Visit_Count + "</td>";
                stdVisitCount = value.Norms_Visit_Count;

                curValue = value.Actual_Visit_Count;
                preValue = value.Last_Actual_Visit_Count;
                if (mode == "1") {
                    //curValue = value.Cur_Month_Category_Missed_Doctors;
                    //preValue = value.Pre_Month_Category_Missed_Doctors;
                    curClassName = 'cls-missed-color';
                    //content += "<td class='cls-missed-color'>" + value.Cur_Month_Category_Missed_Doctors + "</td>";
                    // content += "<td>" + value.Pre_Month_Category_Missed_Doctors + "</td>";
                }
                else if (mode == "2") {
                    //curValue = value.Cur_Month_Category_VC_Followed;
                    //preValue = value.Pre_Month_Category_VC_Followed;
                    curClassName = 'cls-met-std';
                    //content += "<td class='cls-met-std'>" + value.Cur_Month_Category_VC_Followed + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Followed + "</td>";
                }
                else if (mode == "3") {
                    //curValue = value.Cur_Month_Category_VC_Missed;
                    //preValue = value.Pre_Month_Category_VC_Missed;
                    curClassName = 'cls-met-less';
                    //content += "<td class='cls-met-less'>" + value.Cur_Month_Category_VC_Missed + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Missed + "</td>";
                }
                else {
                    //curValue = value.Cur_Month_Category_VC_Exceeded;
                    //preValue = value.Pre_Month_Category_VC_Exceeded;
                    curClassName = 'cls-met-more';
                    //content += "<td class='cls-met-more'>" + value.Cur_Month_Category_VC_Exceeded + "</td>";
                    //content += "<td>" + value.Pre_Month_Category_VC_Exceeded + "</td>";
                }

                content += "<td style='text-align:center;' class=" + curClassName + ">" + curValue + "</td>";
                if (preValue == 0) {
                    preClassName = 'cls-missed-color';
                }
                else if (preValue == stdVisitCount) {
                    preClassName = 'cls-met-std';
                }
                else if (preValue < stdVisitCount) {
                    preClassName = 'cls-met-less';
                }
                else {
                    preClassName = 'cls-met-more';
                }
                content += "<td style='text-align:center;' class=" + preClassName + ">" + preValue + "</td></tr>";
            });
        }
        content += " </tbody></table>";
        $('#dvRepVisit').html(content);
        AdminDashboard.UnblockUI("dvManagerVisit");
        $('html,body').animate({
            scrollTop: $("#dvTitleForRep").offset().top
        },
      'slow');

        if (firstTimeLoad) {
            $("#cboCategory option").remove();
            $("#cboCategory").append("<option >-Select Category-</option>")
            $.each(disCatAr, function (index, value) {
                $("#cboCategory").append("<option>" + value + "</option>")
            });
            $("#cboSpeciality option").remove();
            $("#cboSpeciality").append("<option value=''>-Select Speciality-</option>")
            $.each(disSpeAr, function (index, value) {
                $("#cboSpeciality").append("<option>" + value + "</option>")
            });

        }
        $("#cboCategory").unbind('change').bind('change', function () {
            firstTimeLoad = false;
            AdminDashboard.getUserDashboardCategoryWiseVisits(Month, Year, DivisionName, mode);
        });
        $("#cboSpeciality").unbind('change').bind('change', function () {
            firstTimeLoad = false;
            AdminDashboard.getUserDashboardCategoryWiseVisits(Month, Year, DivisionName, mode);
        });
        $('#tblCategoryWiseDoctorVisit').DataTable(
         {
             "paging": false,
             "ordering": false,
             //"info": false
             "bRetrieve": true,
             "bDestroy": true,
             "bPaginate": false,
         });
        $('.tblFilter').hide();
        console.log(disSpeAr);
    },

    getDivisionsForDcrCompliance: function () {
        $.ajax({
            start: $.unblockUI(),
            type: 'POST',
            url: "DashBoard/GetDivisions",
            success: function (jsonData) {
                var listItems;
                if (1 < jsonData.length) {
                    listItems += "<option selected='selected' data-division_Code = 'All'>-- All --</option>";
                    for (var i = 0; i < jsonData.length; i++) {
                        listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                    }
                }
                else {

                    for (var i = 0; i < jsonData.length; i++) {
                        if (i == 0) {
                            listItems += "<option selected='selected' data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        } else {
                            listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        }
                    }

                }
                $("#ddlDcrComplianceDivsion").html(listItems);
            },
            error: function (e) {
                $.unblockUI();
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
            },
            complete: function () {
                AdminDashboard.fngetDCRComplianceDetail();

            }
        });
    },
    fngetDCRComplianceDetail: function () {
        var _objData = new Object();
        _objData.Division_Name = $('#ddlDcrComplianceDivsion').val();
        _objData.User_Type = $('#ddlUserType').val();
        _objData.MonthType = $('#ddlMode').val();
        if (_objData.Division_Name == '-- All --') {
            _objData.Division_Name = 'All';
        }
        $.ajax({
            start: AdminDashboard.blockUI("dcrcount"),
            type: 'POST',
            url: "DashBoard/GetDCRComplianceNew",
            dataType: 'json',
            data: _objData,
            success: function (jsonData) {
                debugger;
                $('#dcrcount').show();
                var monthstatus = AdminDashboard.defaults.DcrComplianceMonthType;
                $('#complaincetitle').html('(Click here for more details)');
                if (jsonData != undefined && jsonData != null) {

                    if (jsonData[0].DcrCount > 0.0) {

                        $("#ComplaniceCount").text(jsonData[0].DcrCount);

                        $("#ComplaniceCount").off("click").click(function () {
                            AdminDashboard.getDCRCompliancePopUpNew(monthstatus);
                        });

                        $('#ComplaniceCount').css('cursor', 'pointer');
                        $('#ComplaniceCount').css('text-decoration', 'underline');
                    }
                    else {
                        $("#ComplaniceCount").text(0);
                        $("#ComplaniceCount").off("click");
                        $('#ComplaniceCount').css('cursor', 'default');
                        $('#ComplaniceCount').css('text-decoration', 'blink');
                    }

                }
                $('#ComplianceDetail').hide();
                $('#heading').hide();

            },
            error: function (e) {
                AdminDashboard.UnblockUI("dcrcount");
                //fnMsgAlert('error', 'Error', 'Bind Dcr Compliance failed');
            },
            complete: function () {
                AdminDashboard.UnblockUI("dcrcount");
            }
        });
    },



}

function LoadDashBoard(id) {
    if (id == 1) {
        $("#dashboard1").load('/DashBoard/AdminTargetDashBoard_Mobile');
    }
    else if (id == 2) {
        $("#dashboard1").load('/DashBoardV2/CategoryCoverageMobileDashBoard');
    }

    else if (id == 3) {
        $("#dashboard1").load('/DashBoardV2/ProductDashBoardV2_Mobile');
    }

    else if (id == 4) {
        $("#dashboard1").load('/DashBoardV2/JoinAttritionDashBoardMobile');
    }
    else if (id == 5) {
        $("#dashboard1").load('/DashBoardV2/DashBoardV2MoblieMasterPage');
    }

}


