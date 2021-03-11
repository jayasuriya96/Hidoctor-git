
var COURSE = {
    checkedUser: new Array(),
    
    fnBindUserType: function (month, year) {
        
        month = month_g;
        year = year_g;
        $.ajax({
            type: "POST",
            url: '/AdCourseReport/GetUserTypeDetails',
            data: "month=" + month + "&year=" + year,
            success: function (jsData) {
                if (jsData != null && jsData != undefined) {
                    jsData = eval(jsData);
                    if (jsData.length > 0) {
                        $("#desigText").hide();
                        $("#dvUserType").show();
                        var content = "";
                        content += "<input type='checkbox' name='chkallusertype' value='0' onclick='COURSE.fnSelectAllUserType();' id='chkallUserType' title='All User Type' /> Select All <br/>"
                        for (var d = 0; d < jsData.length; d++) {
                            content += "<input type='checkbox' onclick='COURSE.fnGetUserList(this);' name='chkusertype' value='" + jsData[d].User_Type_Id + "' title='" + jsData[d].User_Type_Name + "' /> " + jsData[d].User_Type_Name + " <br/>"
                        }
                        $("#dvUserType").html(content);
                        $("#dvHUserType").show();
                        $("#dvMode").hide();
                        $("#btnShowReport").hide();
                        $('#myModal').modal('show')

                    }
                    else {
                        //$("#dvUserType").html('No user type found');
                        $('#myModal').modal('show')
                        $("#dvUserType").hide();
                        $("#desigText").show();
                        $("#dvHUserType").show();
                        $("#dvHEmployee").hide();
                        $("#dvMode").hide();
                        $("#btnShowReport").hide();
                        $("#divReportCourseActivity").html('<h2>No data found</h2>');
                    }

                }
                else {
                    $('#myModal').modal('show')
                    $("#dvUserType").hide();
                    $("#desigText").show();
                    $("#dvUserType").html('No user type found');
                    $("#dvHUserType").show();
                    $("#dvHEmployee").hide();
                    $("#dvMode").hide();
                    $("#btnShowReport").hide();
                    $("#divReportCourseActivity").html('<h2>No data found</h2>');
                }
            }
        });
    },
    //function to bind the user details
    fnBindUserDetails: function (userTypeCode) {
        $('#cboUserDetails').html("");
        var month = month_g;
        var year = year_g;
        $.ajax({
            type: "POST",
            url: '/AdCourseReport/GetEmployeeDetails',
            data: "userTypeCode=" + userTypeCode + "&month=" + month + "&year=" + year,
            success: function (jsonData) {
                var selectContent = "";
                var tmpCheckedUser = new Array();
                if (jsonData != null && jsonData != undefined) {
                    selectContent += "<input type='checkbox' name='chkEmpDetails' value='0' onclick='COURSE.fnSelectEmpDetails();' id='chkallEmpDetails' title='All user details' /> Select All <br/>"
                    for (var i = 0; i < jsonData.length; i++) {
                        var isChecked = false;
                        var elemId = "userlist_" + jsonData[i].User_Id;
                        if (COURSE.checkedUser.indexOf(elemId) >= 0) {
                            isChecked = true;
                            tmpCheckedUser.push(elemId);
                        }
                        selectContent += "<input type='checkbox' name='userlist' " + (isChecked ? "checked='checked'" : "") + " id='" + elemId + "' value='" + jsonData[i].User_Id + "' title='" + jsonData[i].Employee_Name + "' onchange='COURSE.fnSelectUserDetail(this);' /> " + jsonData[i].Employee_Name + " <br/>"
                    }
                    $('#dvEmployeeDetails').html(selectContent);
                    $("#dvHEmployee").show();
                    $("#dvMode").show();
                    $("#btnShowReport").show();
                }
                else {
                    $('#dvEmployeeDetails').html("Please select a user role to map the users");
                    $("#dvHEmployee").show();
                    $("#dvMode").hide();
                    $("#btnShowReport").hide();
                }
                COURSE.checkedUser = tmpCheckedUser;
            }
        });
    },
    fnGetUserList: function (obj) {
        var utype = "";
        $("input:checkbox[name=chkusertype]").each(function () {
            if (this.checked) {
                utype += this.value + ",";
            }
        });
        COURSE.fnBindUserDetails(utype);
    },
    fnSelectAllUserType: function () {
        var utype = "";
        if ($("input:checkbox[name=chkallusertype]").attr("checked") == "checked") {
            $("input:checkbox[name=chkusertype]").each(function () {
                this.checked = true;
                utype += this.value + ",";
            });
        }
        else {
            $("input:checkbox[name=chkusertype]").each(function () {
                this.checked = false;
                utype = "";
            });
        }
        
        COURSE.fnBindUserDetails(utype);
    },

    fnSelectEmpDetails: function () {
        var utype = "";
        if ($("input:checkbox[name=chkEmpDetails]").attr("checked") == "checked") {
            $("input:checkbox[name=userlist]").each(function () {
                this.checked = true;
                COURSE.fnSelectUserDetail(this);
                utype += this.value + ",";
            });
        }
        else {
            $("input:checkbox[name=userlist]").each(function () {
                this.checked = false;
                COURSE.fnSelectUserDetail(this);
                utype = "";
            });
        }
    },
    fnSelectUserDetail: function (elem) {
        if (elem.checked) {
            if (COURSE.checkedUser.indexOf(elem.id) < 0) {
                COURSE.checkedUser.push(elem.id);
            }
        } else {
            var idx = COURSE.checkedUser.indexOf(elem.id);
            COURSE.checkedUser.splice(idx, 1);
        }
    },
    fnBindReportData: function () {

        var flag = COURSE.fnValidate();
        if (flag) {

            var userList = "";
            $('input:checkbox[name=userlist]').each(function () {
                if ($(this).is(':checked')) {
                    userList += $(this).val() + "^";
                }
            });
            //month = fngetMonthNumber($('#txtFromMonth').val().split('-')[0]);
            //year = $('#txtFromMonth').val().split('-')[1];


            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var userParam = {};
            userParam.name = 'userList';
            userParam.value = userList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#userList").val(userList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(userParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getCourseListOfAttendeesReport', adAry, 'POST', this.onBindReportData, this.onFail);
        }
    },
    onBindReportData: function (result) {
        if (result == 'No data found') {
            $("#divReportCourseActivity").html('<h2>No data found</h2>');
        }
        else {
            $("#dvReportTitle").show();
            $("#divReportCourseActivity").html(result);
            $("#tblAdCourseActivity").oneSimpleTablePagination({ rowsPerPage: 10 });
            $("#divMain").removeClass('col-lg-9');
            $("#divMain").addClass('col-lg-12');
            $("#spnTreeToggle").html('Show Input');
        }

    },
    onFail: function (e) {
        alert(e);
    },
    fnValidate: function () {
        var flag = true;
        if ($("#txtFromMonth").val() == "") {
            fnMsgAlert('info', 'Course Report', 'Please select month & year');
            flag = false;
        }
        var $userIds = $('input[name=userlist]:checked');
        var userIds = new Array();
        if ($userIds.length <= 0) {
            fnMsgAlert('info', 'Course Report', 'Please select atleast one user');
            flag = false;
        }
        return flag;
    },
    //Vignesh-Validation_Begin

    //First Attempt Report
    fnBindReportDataFailure: function () {
        
        var flag = COURSE.fnValidate();
        if (flag) {

            var userList = "";
            $('input:checkbox[name=userlist]').each(function () {
                if ($(this).is(':checked')) {
                    userList += $(this).val() + "^";
                }
            });

            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var userParam = {};
            userParam.name = 'userList';
            userParam.value = userList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#userList").val(userList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(userParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getFailureAttemptReport', adAry, 'POST', this.onBindReportData, this.onFail);
        }
    },

    //Failure Report
    fnBindReportDataAttempt: function () {
        
        var flag = COURSE.fnValidate();
        if (flag) {

            var userList = "";
            $('input:checkbox[name=userlist]').each(function () {
                if ($(this).is(':checked')) {
                    userList += $(this).val() + "^";
                }
            });

            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var userParam = {};
            userParam.name = 'userList';
            userParam.value = userList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#userList").val(userList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(userParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getFirstAttemptReport', adAry, 'POST', this.onBindReportData, this.onFail);
        }
    },
    //Hundred Percent Report

    fntHundredPercentReport: function () {
        
        var flag = COURSE.fnValidate();
        if (flag) {

            var userList = "";
            $('input:checkbox[name=userlist]').each(function () {
                if ($(this).is(':checked')) {
                    userList += $(this).val() + "^";
                }
            });

            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var userParam = {};
            userParam.name = 'userList';
            userParam.value = userList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#userList").val(userList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(userParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getHundredPercentReport', adAry, 'POST', this.onBindReportData, this.onFail);
        }
    },


    //Area of improvement Report

    fnAreaOfImprovementReport: function () {
        
        var flag = COURSE.fnValidate();
        if (flag) {

            var userList = "";
            $('input:checkbox[name=userlist]').each(function () {
                if ($(this).is(':checked')) {
                    userList += $(this).val() + "^";
                }
            });

            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var userParam = {};
            userParam.name = 'userList';
            userParam.value = userList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#userList").val(userList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(userParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getAreaOfImprovementReport', adAry, 'POST', this.onBindReportData, this.onFail);
        }
    },


    fnLaggardsReport: function () {
        
        var flag = COURSE.fnValidate();
        if (flag) {

            var userList = "";
            $('input:checkbox[name=userlist]').each(function () {
                if ($(this).is(':checked')) {
                    userList += $(this).val() + "^";
                }
            });

            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var userParam = {};
            userParam.name = 'userList';
            userParam.value = userList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#userList").val(userList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(userParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getLaggardsReport', adAry, 'POST', this.onBindReportData, this.onFail);
        }
    },


    fnConsistencyReport: function () {
        
        var flag = COURSE.fnValidate();
        if (flag) {

            var userList = "";
            $('input:checkbox[name=userlist]').each(function () {
                if ($(this).is(':checked')) {
                    userList += $(this).val() + "^";
                }
            });

            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var userParam = {};
            userParam.name = 'userList';
            userParam.value = userList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#userList").val(userList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(userParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getConsistencyReport', adAry, 'POST', this.onBindReportData, this.onFail);
        }
    },

    fnNonConsistencyReport: function () {
        
        var flag = COURSE.fnValidate();
        if (flag) {

            var userList = "";
            $('input:checkbox[name=userlist]').each(function () {
                if ($(this).is(':checked')) {
                    userList += $(this).val() + "^";
                }
            });

            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var userParam = {};
            userParam.name = 'userList';
            userParam.value = userList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#userList").val(userList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(userParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getNonConsistencyReport', adAry, 'POST', this.onBindReportData, this.onFail);
        }
    },
    //Early bird report Region Wise
    checkedregion: new Array(),
    fnBindRegion: function (month, year) {
        $.ajax({
            type: "POST",
            url: '/AdCourseReport/GetRegionTypeDetails',
            data: "month=" + month + "&year=" + year,
            success: function (jsData) {
                if (jsData != null && jsData != undefined) {
                    jsData = eval(jsData);
                    if (jsData.length > 0) {
                        $("#desigText").hide();
                        $("#dvRegionType").show();
                        var content = "";
                        content += "<input type='checkbox' name='chkallregiontype' value='0' onclick='COURSE.fnSelectAllRegion();' id='chkallregionType' title='All Regions' /> Select All <br/>"
                        for (var d = 0; d < jsData.length; d++) {
                            content += "<input type='checkbox' onclick='COURSE.fnGetRegionList(this);' name='chkregiontype' value='" + jsData[d].Region_Type_Code + "' title='" + jsData[d].Region_Type_Name + "' /> " + jsData[d].Region_Type_Name + " <br/>"
                        }
                        $("#dvRegionType").html(content);
                        $("#dvHRegionType").show();
                        $("#dvMode").hide();
                        $("#btnShowReport").hide();
                        $('#myModal').modal('show')

                    }
                    else {
                        //$("#dvUserType").html('No user type found');
                        $('#myModal').modal('show')
                        $("#dvRegionType").hide();
                        $("#desigText").show();
                        $("#dvHRegionType").show();
                        $("#dvHRegion").hide();
                        $("#dvMode").hide();
                        $("#btnShowReport").hide();
                        $("#divReportCourseActivity").html('<h2>No data found</h2>');
                    }

                }
                else {
                    $('#myModal').modal('show')
                    $("#dvUserType").hide();
                    $("#desigText").show();
                    $("#dvRegionType").html('No user type found');
                    $("#dvHRegionType").show();
                    $("#dvHRegion").hide();
                    $("#dvMode").hide();
                    $("#btnShowReport").hide();
                    $("#divReportCourseActivity").html('<h2>No data found</h2>');
                }
            }
        });
    },
    fnBindRegionDetails: function (regionTypeCode) {

        $('#cboUserDetails').html("");
        $.ajax({
            type: "POST",
            url: '/AdCourseReport/GetRegionDetails',
            data: "regionTypeCode=" + regionTypeCode + "&month=" + month_g + "&year=" + year_g,
            success: function (jsonData) {
                var selectContent = "";
                var tmpCheckedregion = new Array();
                if (jsonData != null && jsonData != undefined) {
                    selectContent += "<input type='checkbox' name='chkRegionDetails' value='0' onclick='COURSE.fnRegionDetails();' id='chkallRegionDetails' title='All user details' /> Select All <br/>"
                    for (var i = 0; i < jsonData.length; i++) {
                        var isChecked = false;
                        var elemId = "regionlist_" + jsonData[i].Region_Code;
                        if (COURSE.checkedregion.indexOf(elemId) >= 0) {
                            isChecked = true;
                            tmpCheckedregion.push(elemId);
                        }
                        selectContent += "<input type='checkbox' name='regionlist' " + (isChecked ? "checked='checked'" : "") + " id='" + elemId + "' value='" + jsonData[i].Region_Code + "' title='" + jsonData[i].Region_Name + "' onchange='COURSE.fnSelectregionDetail(this);' /> " + jsonData[i].Region_Name + " <br/>"
                    }
                    $('#dvRegionDetails').html(selectContent);
                    $("#dvHRegion").show();
                    $("#dvMode").show();
                    $("#btnShowReport").show();
                }
                else {
                    $('#dvRegionDetails').html("Please select a user role to map the Regions");
                    $("#dvHRegion").show();
                    $("#dvMode").hide();
                    $("#btnShowReport").hide();
                }
                COURSE.checkedregion = tmpCheckedregion;
            }
        });
    },
    fnGetRegionList: function (obj) {

        var rtype = "";
        $("input:checkbox[name=chkregiontype]").each(function () {
            if (this.checked) {
                rtype += this.value + ",";
            }
        });
        COURSE.fnBindRegionDetails(rtype);
    },
    fnSelectAllRegion: function () {

        var rtype = "";
        if ($("input:checkbox[name=chkallregiontype]").attr("checked") == "checked") {
            $("input:checkbox[name=chkregiontype]").each(function () {
                this.checked = true;
                rtype += this.value + ",";
            });
        }
        else {
            $("input:checkbox[name=chkregiontype]").each(function () {
                this.checked = false;
                rtype = "";
            });
        }
        COURSE.fnBindRegionDetails(rtype);
    },
    fnRegionDetails: function () {

        var rtype = "";
        if ($("input:checkbox[name=chkRegionDetails]").attr("checked") == "checked") {
            $("input:checkbox[name=regionlist]").each(function () {
                this.checked = true;
                COURSE.fnSelectregionDetail(this);
                rtype += this.value + ",";
            });
        }
        else {
            $("input:checkbox[name=regionlist]").each(function () {
                this.checked = false;
                COURSE.fnSelectregionDetail(this);
                rtype = "";
            });
        }
    },
    fnSelectregionDetail: function (elem) {

        if (elem.checked) {
            if (COURSE.checkedregion.indexOf(elem.id) < 0) {
                COURSE.checkedregion.push(elem.id);
            }
        } else {
            var idx = COURSE.checkedregion.indexOf(elem.id);
            COURSE.checkedregion.splice(idx, 1);
        }
    },
    fnBindRegionEarlyBirdReportData: function () {

        var flag = COURSE.fnRegionValidate();
        if (flag) {

            var regionList = "";
            $('input:checkbox[name=regionlist]').each(function () {
                if ($(this).is(':checked')) {
                    regionList += $(this).val() + "^";
                }
            });
            
            var adAry = new Array();
            var monthParam = {};
            monthParam.name = 'month';
            monthParam.value = month_g;
            var yearParam = {};
            yearParam.name = 'year';
            yearParam.value = year_g;
            var exportParam = {};
            exportParam.name = 'execlExport';
            exportParam.value = 0;
            var regionParam = {};
            regionParam.name = 'regionList';
            regionParam.value = regionList;

            var dateParam = {};
            dateParam.name = 'offsetValue';
            dateParam.value = commonValues.getUTCOffset();

            var monthNameParam = {};
            monthNameParam.name = 'monthName';
            monthNameParam.value = $("#txtFromMonth").val();

            var reportNameParam = {};
            reportNameParam.name = 'reportName';
            reportNameParam.value = $("#dvPageHeader").html();

            $("#month").val(month_g);
            $("#year").val(year_g);
            $("#regionList").val(regionList);
            $("#offsetValue").val(commonValues.getUTCOffset());
            $("#monthName").val($("#txtFromMonth").val());
            $("#reportName").val($("#dvPageHeader").html());

            adAry.push(monthParam);
            adAry.push(yearParam);
            adAry.push(exportParam);
            adAry.push(regionParam);
            adAry.push(dateParam);
            adAry.push(monthNameParam);
            adAry.push(reportNameParam);
            DPAjax.requestInvoke('AdCourseReport', 'getEarlyBirdReport', adAry, 'POST', this.onBindRegionReportData, this.onReportRegionFail);
        }
    },
    fnRegionValidate: function () {
        var flag = true;
        if ($("#txtFromMonth").val() == "") {
            fnMsgAlert('info', 'Course Report', 'Please select month & year');
            flag = false;
        }
        var $regionIds = $('input[name=regionlist]:checked');
        var regionIds = new Array();
        if ($regionIds.length <= 0) {
            fnMsgAlert('info', 'Course Report', 'Please select atleast one Region');
            flag = false;
        }
        return flag;
    },
    onBindRegionReportData: function (result) {
        if (result == 'No data found') {
            $("#divReportCourseActivity").html('<h2>No data found</h2>');
        }
        else {
            $("#dvReportTitle").show();
            $("#divReportCourseActivity").html(result);
            $("#tblAdCourseActivity").oneSimpleTablePagination({ rowsPerPage: 10 });
            $("#divMain").removeClass('col-lg-9');
            $("#divMain").addClass('col-lg-12');
            $("#spnTreeToggle").html('Show Input');
        }

    },
    onReportRegionFail: function (e) {
        alert(e);
    },
}



var USERWISEREPORT = {
    checkedUser: new Array(),
    fnBindUserTypeMonthWise: function (month, year) {
        $.ajax({
            type: "POST",
            url: '/AdCourseReport/GetUserTypeMonthWise',
            data: "month=" + month + "&year=" + year,
            success: function (jsData) {
                if (jsData != null && jsData != undefined) {
                    jsData = eval(jsData);
                    if (jsData.length > 0) {
                        $("#desigText").hide();
                        $("#dvUserType").show();
                        var content = "";
                        content += "<input type='checkbox' name='chkallusertype' value='0' onclick='USERWISEREPORT.fnSelectAllUserType();' id='chkallUserType' title='All User Type' /> Select All <br/>"
                        for (var d = 0; d < jsData.length; d++) {
                            content += "<input type='checkbox' onclick='USERWISEREPORT.fnGetUserList(this);' name='chkusertype' value='" + jsData[d].User_Type_Code + "' title='" + jsData[d].User_Type_Name + "' /> " + jsData[d].User_Type_Name + " <br/>"
                        }
                        $("#dvUserType").html(content);
                        $("#dvHUserType").show();
                        $("#dvMode").hide();
                        $("#btnShowReport").hide();
                        $('#myModal').modal('show');
                    }
                    else {
                        //$("#dvUserType").html('No user type found');
                        $("#dvUserType").hide();
                        $("#desigText").show();
                        $("#dvHUserType").show();
                        $("#dvHEmployee").hide();
                        $("#dvMode").hide();
                        $("#btnShowReport").hide();
                        $('#myModal').modal('show');
                        $('#divReport').html('<h2>Please choose input and view report</h2>');
                    }

                }
                else {
                    $("#dvUserType").hide();
                    $("#desigText").show();
                    $("#dvUserType").html('No user type found');
                    $("#dvHUserType").show();
                    $("#dvHEmployee").hide();
                    $("#dvMode").hide();
                    $("#btnShowReport").hide();
                    $('#myModal').modal('show');
                    $('#divReport').html('<h2>Please choose input and view report</h2>');
                }
            }
        });
    },

    fnBindUserDetails: function (userTypeCode) {
        
        $('#cboUserDetails').html("");
        $.ajax({
            type: "POST",
            url: '/AdCourseReport/GetEmployeeDetailsWithMonthWiseSnapshot',
            data: "userTypeCode=" + userTypeCode + "&month=" + month_g + "&year=" + year_g,
            success: function (jsonData) {
                var selectContent = "";
                var tmpCheckedUser = new Array();

                if (jsonData != null && jsonData != undefined) {
                    selectContent += "<input type='checkbox' name='chkEmpDetails' value='0' onclick='USERWISEREPORT.fnSelectEmpDetails();' id='chkallEmpDetails' title='All user details' /> Select All <br/>"
                    for (var i = 0; i < jsonData.length; i++) {
                        var isChecked = false;
                        var elemId = "userlist_" + jsonData[i].User_Id;
                        if (USERWISEREPORT.checkedUser.indexOf(elemId) >= 0) {
                            isChecked = true;
                            tmpCheckedUser.push(elemId);
                        }
                        selectContent += "<input type='checkbox' name='userlist' " + (isChecked ? "checked='checked'" : "") + " id='" + elemId + "' value='" + jsonData[i].User_Id + "' title='" + jsonData[i].Employee_Name + "' onchange='USERWISEREPORT.fnSelectUserDetail(this);' /> " + jsonData[i].Employee_Name + " <br/>"
                    }
                    $('#dvEmployeeDetails').html(selectContent);
                    $("#dvHEmployee").show();
                    $("#dvMode").show();
                    $("#btnShowReport").show();
                }
                else {
                    $('#dvEmployeeDetails').html("Please select a user role to map the users");
                    $("#dvHEmployee").show();
                    $("#dvMode").hide();
                    $("#btnShowReport").hide();
                }
                USERWISEREPORT.checkedUser = tmpCheckedUser;
            }
        });
    },
    fnGetUserList: function (obj) {
        var utype = "";
        $("input:checkbox[name=chkusertype]").each(function () {
            if (this.checked) {
                utype += this.value + ",";
            }
        });
        USERWISEREPORT.fnBindUserDetails(utype);
    },
    fnSelectAllUserType: function () {
        var utype = "";
        if ($("input:checkbox[name=chkallusertype]").attr("checked") == "checked") {
            $("input:checkbox[name=chkusertype]").each(function () {
                this.checked = true;
                utype += this.value + ",";
            });
        }
        else {
            $("input:checkbox[name=chkusertype]").each(function () {
                this.checked = false;
                utype = "";
            });
        }
        USERWISEREPORT.fnBindUserDetails(utype);
    },

    fnSelectEmpDetails: function () {
        var utype = "";
        if ($("input:checkbox[name=chkEmpDetails]").attr("checked") == "checked") {
            $("input:checkbox[name=userlist]").each(function () {
                this.checked = true;
                USERWISEREPORT.fnSelectUserDetail(this);
                utype += this.value + ",";
            });
        }
        else {
            $("input:checkbox[name=userlist]").each(function () {
                this.checked = false;
                USERWISEREPORT.fnSelectUserDetail(this);
                utype = "";
            });
        }
    },
    fnSelectUserDetail: function (elem) {
        if (elem.checked) {
            if (USERWISEREPORT.checkedUser.indexOf(elem.id) < 0) {
                USERWISEREPORT.checkedUser.push(elem.id);
            }
        } else {
            var idx = USERWISEREPORT.checkedUser.indexOf(elem.id);
            USERWISEREPORT.checkedUser.splice(idx, 1);
        }
    },
    fnBindUserWiseReportData: function (search) {
        $("#dvAdCourseDetailHeader").html("");
        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");


        $("#dvCourseHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseDetailHeader").html("").removeClass('clsbgclr clsCollapse activeDiv');
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse activeDiv');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse activeDiv');

        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");


        $("#divReportDetails").css('display', '');
        $("#divReportSummary").css('display', '');
        $("#divSectionSummary").css('display', '');

        $("#dvSearch").hide();
        $("#divReport").html("");
        $("#divReport").css('display', 'block');

        $("#dvCourseHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> Test Report for selected user <i id='SpinHeader' class='fa'></i>").addClass('clsbgclr');
        $("#SpinHeader").addClass('fa-spinner fa-spin');
        $("#dvCourseHeader").addClass('activeDiv');

        if (search == "") {
            var searchValue = "";
            $("#txtSearch").val("");
        }
        else {
            var searchValue = $("#txtSearch").val();
        }

        var userList = "";
        $('input:checkbox[name=userlist]').each(function () {
            if ($(this).is(':checked')) {
                userList += $(this).val() + "^";
            }
        });

        if (userList == "") {
            fnMsgAlert('info', 'Course Report', 'Please select atleast one user');
            return false;
        }

        var adAry = new Array();
        var monthParam = {};
        monthParam.name = 'month';
        monthParam.value = month_g;
        var yearParam = {};
        yearParam.name = 'year';
        yearParam.value = year_g;
        var exportParam = {};
        exportParam.name = 'execlExport';
        exportParam.value = 0;
        var userParam = {};
        userParam.name = 'userList';
        userParam.value = userList;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        var monthNameParam = {};
        monthNameParam.name = 'monthName';
        monthNameParam.value = $("#txtFromMonth").val();

        var reportNameParam = {};
        reportNameParam.name = 'reportName';
        reportNameParam.value = $("#dvPageHeader").html();

        var searchParam = {};
        searchParam.name = 'searchVal';
        searchParam.value = searchValue;


        $("#month").val(month_g);
        $("#year").val(year_g);
        $("#userList").val(userList);
        $("#offsetValue").val(commonValues.getUTCOffset());
        $("#monthName").val($("#txtFromMonth").val());
        $("#reportName").val($("#dvPageHeader").html());


        adAry.push(monthParam);
        adAry.push(yearParam);
        adAry.push(exportParam);
        adAry.push(userParam);
        adAry.push(dateParam);
        adAry.push(monthNameParam);
        adAry.push(reportNameParam);
        adAry.push(searchParam);
        DPAjax.requestInvoke('AdCourseReport', 'getAdCourseUserWiseReportHeader', adAry, 'POST', this.onBindUserData, this.onFail);

    },
    onBindUserData: function (result) {
        $("#dvSearch").show();
        $("#divReport").html(result);
        $("#tblUserWiseReportHeader").oneSimpleTablePagination({});
        //$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
        $("#SpinHeader").removeClass('fa-spinner fa-spin');
        //fnToggleTree();
        //$('html, body').animate({
        //    'scrollTop': $("#divReport").position().top
        //});
    },
    onFail: function (e) {
        alert(e);
    },
    fnUserAssignedTestDetails: function (userId, reportName) {

        $("#dvCourseDetailHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse');
        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");
        $("#divReportDetails").css('display', '');
        $("#divReportSummary").css('display', '');
        $("#divSectionSummary").css('display', '');
        $("#divReport").slideToggle("slow");
        $('#dvCourseHeader').toggleClass('clsCollapse');
        $("#dvCourseDetailHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> " + reportName + "<i id='SpinAssigned' class='fa'></i><span id='spnAssign' style='color:#3b6792;cursor:pointer;float:right;' onclick='USERWISEREPORT.fnCloseCountHeaderDetail();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#SpinAssigned").addClass('fa-spinner fa-spin');
        $("#dvCourseDetailHeader").addClass('activeDiv');
        $("#dvCourseHeader").removeClass('activeDiv');
        var adAry = new Array();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();
        adAry.push(userParam);
        adAry.push(dateParam);

        DPAjax.requestInvoke('AdCourseReport', 'getAdUserAssignedTestDetails', adAry, 'POST', this.onBindAdTestDetails, this.onFail);

    },
    onBindUserSub: function (result) {
        $("#dvAdCourseDetailHeader").html(result);
        $("#SpinAssigned").removeClass('fa-spinner fa-spin');
        $("#SpinAttended").removeClass('fa-spinner fa-spin');
        $("#Spinyts").removeClass('fa-spinner fa-spin');
        $("#SpinComplete").removeClass('fa-spinner fa-spin');
        $("#SpinInp").removeClass('fa-spinner fa-spin');
        //$("#divReportDetails").html(result);
        //$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
    },
    fnUserAttendedTestDetails: function (userId, reportName) {

        $("#dvCourseDetailHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse');
        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");
        $("#divReportDetails").css('display', '');
        $("#divReportSummary").css('display', '');
        $("#divSectionSummary").css('display', '');
        $("#divReport").slideToggle("slow");
        $('#dvCourseHeader').toggleClass('clsCollapse');
        $("#dvCourseDetailHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> " + reportName + "<i id='SpinAttended' class='fa'></i><span id='spnAttended' style='color:#3b6792;cursor:pointer;float:right;' onclick='USERWISEREPORT.fnCloseCountHeaderDetail();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#SpinAttended").addClass('fa-spinner fa-spin');
        $("#dvCourseDetailHeader").addClass('activeDiv');
        $("#dvCourseHeader").removeClass('activeDiv');
        var adAry = new Array();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();
        adAry.push(userParam);
        adAry.push(dateParam);

        DPAjax.requestInvoke('AdCourseReport', 'getAdUserAttenededTestDetails', adAry, 'POST', this.onBindAdTestDetails, this.onFail);

    },
    fnUserYetToStartTestDetails: function (userId, reportName) {
        $("#dvCourseDetailHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse');
        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");
        $("#divReportDetails").css('display', '');
        $("#divReportSummary").css('display', '');
        $("#divSectionSummary").css('display', '');
        $("#divReport").slideToggle("slow");
        $('#dvCourseHeader').toggleClass('clsCollapse');
        $("#dvCourseDetailHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> " + reportName + "<i id='Spinyts' class='fa'></i><span id='spnYettostart' style='color:#3b6792;cursor:pointer;float:right;' onclick='USERWISEREPORT.fnCloseCountHeaderDetail();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#Spinyts").addClass('fa-spinner fa-spin');
        $("#dvCourseDetailHeader").addClass('activeDiv');
        $("#dvCourseHeader").removeClass('activeDiv');
        var adAry = new Array();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();
        adAry.push(userParam);
        adAry.push(dateParam);

        DPAjax.requestInvoke('AdCourseReport', 'getAdUserYetToStartTestDetails', adAry, 'POST', this.onBindAdTestDetails, this.onFail);

    },

    fnUserInProgressTestDetails: function (userId, reportName) {
        $("#dvCourseDetailHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse');
        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");
        $("#divReportDetails").css('display', '');
        $("#divReportSummary").css('display', '');
        $("#divSectionSummary").css('display', '');
        $("#divReport").slideToggle("slow");
        $('#dvCourseHeader').toggleClass('clsCollapse');
        $("#dvCourseDetailHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> " + reportName + "<i id='SpinInp' class='fa'></i><span id='spnInprogress' style='color:#3b6792;cursor:pointer;float:right;' onclick='USERWISEREPORT.fnCloseCountHeaderDetail();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#SpinInp").addClass('fa-spinner fa-spin');
        $("#dvCourseDetailHeader").addClass('activeDiv');
        $("#dvCourseHeader").removeClass('activeDiv');

        var adAry = new Array();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();
        adAry.push(userParam);
        adAry.push(dateParam);

        DPAjax.requestInvoke('AdCourseReport', 'getAdUserInProgressTestDetails', adAry, 'POST', this.onBindAdTestDetails, this.onFail);

    },
    onBindAdTestDetails: function (result) {
        $("#divReportDetails").html(result);
        $("#SpinAssigned").removeClass('fa-spinner fa-spin');
        $("#SpinAttended").removeClass('fa-spinner fa-spin');
        $("#Spinyts").removeClass('fa-spinner fa-spin');
        $("#SpinComplete").removeClass('fa-spinner fa-spin');
        $("#SpinInp").removeClass('fa-spinner fa-spin');
        //$("#divReportDetails").animate({ scrollTop: $(document).height() - $(window).height() });
        //$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
    },
    fnUserCompletedTestDetails: function (userId, reportName) {
        $("#dvCourseDetailHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse');

        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");

        $("#divReportDetails").css('display', '');
        $("#divReportSummary").css('display', '');
        $("#divSectionSummary").css('display', '');

        $("#divReport").slideToggle("slow");
        $('#dvCourseHeader').toggleClass('clsCollapse');

        $("#dvCourseDetailHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> " + reportName + "<i id='SpinComplete' class='fa'></i><span id='spnComplete' style='color:#3b6792;cursor:pointer;float:right;' onclick='USERWISEREPORT.fnCloseCountHeaderDetail();' class='fa fa-close'></span>").addClass('clsbgclr');

        $("#SpinComplete").addClass('fa-spinner fa-spin');
        $("#dvCourseDetailHeader").addClass('activeDiv');
        $("#dvCourseHeader").removeClass('activeDiv');
        var adAry = new Array();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();
        adAry.push(userParam);
        adAry.push(dateParam);

        DPAjax.requestInvoke('AdCourseReport', 'getAdUserCompletedTestDetails', adAry, 'POST', this.onBindAdTestDetails, this.onFail);

    },
    fnGetUserSectionDetails: function (userdet) {
        $("#divReportDetails").slideToggle("slow");
        $("#divReportSummary").css('display', '');
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");

        var userId = userdet.split('~')[0];
        var publishId = userdet.split('~')[1];
        var userName = userdet.split('~')[2];
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseDetailHeader span").removeClass('fa-close');
        $("#dvCourseResultHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> Attempt Details for - " + userName + "<i id='SpinAttempt' class='fa'></i><span id='spnCloseDet' style='color:#3b6792;cursor:pointer;float:right;' onclick='USERWISEREPORT.fnCloseAttemptDetail();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#SpinAttempt").addClass('fa-spinner fa-spin');
        $('#dvCourseDetailHeader').toggleClass('clsCollapse');
        $('#dvCourseDetailHeader').removeClass('activeDiv');
        $('#dvCourseResultHeader').addClass('activeDiv');



        var adAry = new Array();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var pubParam = {};
        pubParam.name = 'publishId';
        pubParam.value = publishId;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        adAry.push(userParam);
        adAry.push(pubParam);
        adAry.push(dateParam);

        DPAjax.requestInvoke('AdCourseReport', 'getAdUserSectionDetails', adAry, 'POST', this.onBindUserSection, this.onFail);
    },
    onBindUserSection: function (result) {
        $("#divReportSummary").html(result);
        $("#SpinAttempt").removeClass('fa-spinner fa-spin');

    },
    fnUserSectionResultDetails: function (userdet) {

        var userId = userdet.split('~')[0];
        var examId = userdet.split('~')[1];
        var publishId = userdet.split('~')[2];
        var sectionId = userdet.split('~')[3];
        var userName = userdet.split('~')[4];
        $("#divSectionSummary").html("");
        $("#divReportSummary").toggle();

        $("#dvCourseResultHeader span").removeClass('fa-close');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse');
        $("#divSectionSummary").css('display', '');
        $("#dvCourseResultDetails").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> Result Details for - " + userName + "<i id='SpinDetails' class='fa'></i><span id='spnCloseRes' style='color:#3b6792;cursor:pointer;float:right;' onclick='USERWISEREPORT.fnCloseAttemptResult();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#SpinDetails").addClass('fa-spinner fa-spin');
        $('#dvCourseResultHeader').toggleClass('clsCollapse');
        $('#dvCourseResultHeader').removeClass('activeDiv');
        $('#dvCourseResultDetails').addClass('activeDiv');

        var adAry = new Array();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var examParam = {};
        examParam.name = 'examId';
        examParam.value = examId;

        var pubParam = {};
        pubParam.name = 'publishId';
        pubParam.value = publishId;

        var secParam = {};
        secParam.name = 'sectionId';
        secParam.value = sectionId;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        adAry.push(userParam);
        adAry.push(examParam);
        adAry.push(pubParam);
        adAry.push(secParam);
        adAry.push(dateParam);

        DPAjax.requestInvoke('AdCourseReport', 'GetAdSectionResultDetails', adAry, 'POST', this.onBindUserSectionResult, this.onFail);
    },
    onBindUserSectionResult: function (result) {
        $("#divSectionSummary").html(result);
        $("#SpinDetails").removeClass('fa-spinner fa-spin');
    },
    fnCloseAttemptResult: function (result) {
        $('#divSectionSummary').html('');
        $('#dvCourseResultDetails').html('');
        $("#dvCourseResultDetails").removeClass('clsbgclr');
        $("#divReportSummary").slideToggle("slow");
        $('#dvCourseResultHeader').toggleClass('clsCollapse');
        $('#spnCloseDet').addClass('fa-close');

        $("#dvCourseResultDetails").removeClass('activeDiv');
        $("#dvCourseResultHeader").addClass('activeDiv');
    },
    fnCloseAttemptDetail: function (result) {
        $('#divReportSummary').html('');
        $('#dvCourseResultHeader').html('');
        $("#dvCourseResultHeader").removeClass('clsbgclr');
        $("#divReportDetails").slideToggle("slow");
        $('#dvCourseDetailHeader').toggleClass('clsCollapse');

        $('#spnAssign').addClass('fa-close');
        $('#spnInprogress').addClass('fa-close');
        $('#spnComplete').addClass('fa-close');
        $('#spnAttended').addClass('fa-close');
        $('#spnYettostart').addClass('fa-close');

        $("#dvCourseResultHeader").removeClass('activeDiv');
        $("#dvCourseDetailHeader").addClass('activeDiv');
    },
    fnCloseCountHeaderDetail: function (result) {
        $('#divReportDetails').html('');
        $('#dvCourseDetailHeader').html('');
        $("#dvCourseDetailHeader").removeClass('clsbgclr');
        $("#divReport").slideToggle("slow");
        $('#dvCourseHeader').toggleClass('clsCollapse');
        $("#dvCourseDetailHeader").removeClass('activeDiv');
        $("#dvCourseHeader").addClass('activeDiv');
    },
}

var COURSEWISEUSERREPORT = {
    getSelectedUsers: function () {
        var userList = "";
        $('input:checkbox[name=userlist]').each(function () {
            if ($(this).is(':checked')) {
                userList += $(this).val() + "^";
            }
        });
        return userList;
    },
    getCourseWiseUserReportMain: function () {

        $("#dvCourseHeader").html("").removeClass('clsbgclr clsCollapse activeDiv');
        $("#dvCourseDetailHeader").html("").removeClass('clsbgclr clsCollapse activeDiv');
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse activeDiv');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse activeDiv');

        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");

        $("#divReportDetails").css('display', '');
        $("#divReportSummary").css('display', '');
        $("#divSectionSummary").css('display', '');

        $("#dvSearch").hide();
        $("#dvReportTitle").hide();
        //$("#divToggle").hide();
        $("#divReport").html("");
        $("#divReport").css('display', 'block');
        var userList = this.getSelectedUsers();
        if (userList == "") {
            fnMsgAlert('info', 'Course Report', 'Please select atleast one user');
            return false;
        } else {
            $("#dvReportTitle").show();
        }

        $("#dvCourseHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> Course Report for selected user <i id='SpinHeader' class='fa'></i>").addClass('clsbgclr');
        $("#SpinHeader").addClass('fa-spinner fa-spin');
        $("#dvCourseHeader").addClass('activeDiv');

        var adAry = new Array();
        var monthParam = {};
        monthParam.name = 'month';
        monthParam.value = month_g;
        var yearParam = {};
        yearParam.name = 'year';
        yearParam.value = year_g;
        var exportParam = {};
        exportParam.name = 'execlExport';
        exportParam.value = 0;
        var userParam = {};
        userParam.name = 'userList';
        userParam.value = userList;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        var monthNameParam = {};
        monthNameParam.name = 'monthName';
        monthNameParam.value = $("#txtFromMonth").val();

        var reportNameParam = {};
        reportNameParam.name = 'reportName';
        reportNameParam.value = $("#dvPageHeader").html();

        $("#month").val(month_g);
        $("#year").val(year_g);
        $("#userList").val(userList);
        $("#offsetValue").val(commonValues.getUTCOffset());
        $("#monthName").val($("#txtFromMonth").val());
        $("#reportName").val($("#dvPageHeader").html());


        adAry.push(monthParam);
        adAry.push(yearParam);
        adAry.push(exportParam);
        adAry.push(userParam);
        adAry.push(dateParam);
        adAry.push(monthNameParam);
        adAry.push(reportNameParam);
        DPAjax.requestInvoke('AdCourseReport', 'getADCoursewiseUserDetails', adAry, 'POST', this.bindCourseWiseUserReport, this.onFail);
    },
    bindCourseWiseUserReport: function (result) {
        if (result == "No data found") {
            $('#divReport').html('<h2>No data found</h2>');
            $('#dvReportTitle').hide();
        }
        else {
            $('#divReport').html(result);
            $("#tblUserWiseReportHeader").oneSimpleTablePagination({});
            //$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
            $("#SpinHeader").removeClass('fa-spinner fa-spin');
        }
    },
    showUsers: function (courseId, mode, publishId, reportHeader) {

        $("#dvCourseDetailHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse');
        $("#divReportDetails").html("");
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");
        $("#divReportDetails").css('display', '');
        $("#divReportSummary").css('display', '');
        $("#divSectionSummary").css('display', '');
        $("#divReport").slideToggle("slow");
        $('#dvCourseHeader').toggleClass('clsCollapse');
        $("#dvCourseDetailHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> " + reportHeader + "<i id='SpinAssigned' class='fa'></i><span id='spnAssign' style='color:#3b6792;cursor:pointer;float:right;' onclick='COURSEWISEUSERREPORT.fnCloseCountHeaderDetail();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#SpinAssigned").addClass('fa-spinner fa-spin');
        $("#dvCourseDetailHeader").addClass('activeDiv');
        $("#dvCourseHeader").removeClass('activeDiv');

        var userList = this.getSelectedUsers();
        if (userList == "") {
            fnMsgAlert('info', 'Course Report', 'Please select atleast one user');
            return false;
        }
        var adAry = new Array();

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        var userParam = {};
        userParam.name = 'userList';
        userParam.value = userList;

        var course = {};
        course.name = 'courseId';
        course.value = courseId;

        var type = {};
        type.name = 'mode';
        type.value = mode;

        var publish = {};
        publish.name = "publishId";
        publish.value = publishId;

        var searchKey = {};
        searchKey.name = "searchText";
        searchKey.value = $.trim($('#txtSubReportSearch').val());

        adAry.push(dateParam);
        adAry.push(userParam);
        adAry.push(course);
        adAry.push(type);
        adAry.push(publish);
        adAry.push(searchKey);

        DPAjax.requestInvoke('AdCourseReport', 'GetCoursewiseUserDetailsReport', adAry, 'POST', this.bindUsers, this.onFail);
    },
    bindUsers: function (result) {
        //$('#dvSubReport').html('');
        //$('#dvSubReport').html(result);
        //$('#dvSubReport').show();
        //$("#tblMainSubReport").oneSimpleTablePagination({});
        //$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
        $("#divReportDetails").html(result);
        $("#SpinAssigned").removeClass('fa-spinner fa-spin');
        $("#SpinAttended").removeClass('fa-spinner fa-spin');
        $("#Spinyts").removeClass('fa-spinner fa-spin');
        $("#SpinComplete").removeClass('fa-spinner fa-spin');
        $("#SpinInp").removeClass('fa-spinner fa-spin');
    },
    showYTDUsers: function (courseId, publishId) {
        $('#dvSubReport').html('');
        $('#dvSubDetailsReport').html('');

        $('#dvSectionDetailsReport').hide();

        var userList = this.getSelectedUsers();
        if (userList == "") {
            fnMsgAlert('info', 'Course Report', 'Please select atleast one user');
            return false;
        }
        var adAry = new Array();

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        var userParam = {};
        userParam.name = 'userList';
        userParam.value = userList;

        var course = {};
        course.name = 'courseId';
        course.value = courseId;

        var publish = {};
        publish.name = "publishId";
        publish.value = publishId;

        var searchKey = {};
        searchKey.name = "searchText";
        searchKey.value = $.trim($('#txtSubReportSearch').val());

        adAry.push(dateParam);
        adAry.push(userParam);
        adAry.push(course);
        adAry.push(publish);
        adAry.push(searchKey);

        DPAjax.requestInvoke('AdCourseReport', 'GetCoursewiseYTSDetailsReport', adAry, 'POST', this.bindYTDUsers, this.onFail);
    },
    bindYTDUsers: function (result) {
        //$('#dvSubReport').html(result);
        //$('#dvSubReport').show();
        //$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
        $("#divReportSummary").html(result);
        $("#SpinAttempt").removeClass('fa-spinner fa-spin');
    },
    showUserCourse: function (courseId, userId, publishId, empName) {
        //  $('#dvSubDetailsReport').html('');
        $("#divReportDetails").slideToggle("slow");
        $("#divReportSummary").css('display', '');
        $("#divReportSummary").html("");
        $("#divSectionSummary").html("");

        $("#dvCourseResultHeader").html("").removeClass('clsbgclr clsCollapse');
        $("#dvCourseDetailHeader span").removeClass('fa-close');
        $("#dvCourseResultHeader").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> Attempt Details for - " + empName + "<i id='SpinAttempt' class='fa'></i><span id='spnCloseDet' style='color:#3b6792;cursor:pointer;float:right;' onclick='COURSEWISEUSERREPORT.fnCloseAttemptDetail();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#SpinAttempt").addClass('fa-spinner fa-spin');
        $('#dvCourseDetailHeader').toggleClass('clsCollapse');
        $('#dvCourseDetailHeader').removeClass('activeDiv');
        $('#dvCourseResultHeader').addClass('activeDiv');

        var userList = this.getSelectedUsers();
        if (userList == "") {
            fnMsgAlert('info', 'Course Report', 'Please select atleast one user');
            return false;
        }
        var adAry = new Array();

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var course = {};
        course.name = 'courseId';
        course.value = courseId;

        var publish = {};
        publish.name = "publishId";
        publish.value = publishId;

        adAry.push(dateParam);
        adAry.push(userParam);
        adAry.push(course);
        adAry.push(publish);

        DPAjax.requestInvoke('AdCourseReport', 'GetCourseUserSectionView', adAry, 'POST', this.bindUserCourse, this.onFail);
    },
    bindUserCourse: function (result) {
        //$('#dvSubDetailsReport').html(result);
        //$('#dvSubDetailsReport').show();
        //$("#tblSubDetailsReport").oneSimpleTablePagination({});
        //$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });

        $("#divReportSummary").html(result);
        $("#SpinAttempt").removeClass('fa-spinner fa-spin');
    },
    showSectionDetails: function (userdet) {

        var userId = userdet.split('~')[0];
        var examId = userdet.split('~')[1];
        var publishId = userdet.split('~')[2];
        var sectionId = userdet.split('~')[3];
        var empName = userdet.split('~')[4];

        $("#divSectionSummary").html("");
        $("#divReportSummary").toggle();

        $("#dvCourseResultHeader span").removeClass('fa-close');
        $("#dvCourseResultDetails").html("").removeClass('clsbgclr clsCollapse');
        $("#divSectionSummary").css('display', '');
        $("#dvCourseResultDetails").html("<span style='color:#3b6792;cursor:pointer;' class='fa fa-minus'></span><span style='color:#3b6792;cursor:pointer;' class='fa fa-plus'></span> Result Details for - " + empName + "<i id='SpinDetails' class='fa'></i><span id='spnCloseRes' style='color:#3b6792;cursor:pointer;float:right;' onclick='COURSEWISEUSERREPORT.fnCloseAttemptResult();' class='fa fa-close'></span>").addClass('clsbgclr');
        $("#SpinDetails").addClass('fa-spinner fa-spin');
        $('#dvCourseResultHeader').toggleClass('clsCollapse');
        $('#dvCourseResultHeader').removeClass('activeDiv');
        $('#dvCourseResultDetails').addClass('activeDiv');



        var adAry = new Array();

        var userParam = {};
        userParam.name = 'userId';
        userParam.value = userId;

        var examParam = {};
        examParam.name = 'examId';
        examParam.value = examId;

        var pubParam = {};
        pubParam.name = 'publishId';
        pubParam.value = publishId;

        var secParam = {};
        secParam.name = 'sectionId';
        secParam.value = sectionId;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        adAry.push(userParam);
        adAry.push(examParam);
        adAry.push(pubParam);
        adAry.push(secParam);
        adAry.push(dateParam);

        DPAjax.requestInvoke('AdCourseReport', 'GetAdSectionResultDetails', adAry, 'POST', this.bindUserSectionDetails, this.onFail);
    },
    bindUserSectionDetails: function (result) {
        //$('#dvSectionDetailsReport').html(result);
        //$('#dvSectionDetailsReport').show();
        //$("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
        $("#divSectionSummary").html(result);
        $("#SpinDetails").removeClass('fa-spinner fa-spin');
    },
    onFail: function () {
    },
    fnCloseAttemptResult: function (result) {
        $('#divSectionSummary').html('');
        $('#dvCourseResultDetails').html('');
        $("#dvCourseResultDetails").removeClass('clsbgclr');
        $("#divReportSummary").slideToggle("slow");
        $('#dvCourseResultHeader').toggleClass('clsCollapse');
        $('#spnCloseDet').addClass('fa-close');

        $("#dvCourseResultDetails").removeClass('activeDiv');
        $("#dvCourseResultHeader").addClass('activeDiv');
    },
    fnCloseAttemptDetail: function (result) {
        $('#divReportSummary').html('');
        $('#dvCourseResultHeader').html('');
        $("#dvCourseResultHeader").removeClass('clsbgclr');
        $("#divReportDetails").slideToggle("slow");
        $('#dvCourseDetailHeader').toggleClass('clsCollapse');
        $('#spnHeader').addClass('fa-close');
        $("#dvCourseResultHeader").removeClass('activeDiv');
        $("#dvCourseDetailHeader").addClass('activeDiv');
        $('#spnAssign').addClass('fa-close');
    },
    fnCloseCountHeaderDetail: function (result) {
        $('#divReportDetails').html('');
        $('#dvCourseDetailHeader').html('');
        $("#dvCourseDetailHeader").removeClass('clsbgclr');
        $("#divReport").slideToggle("slow");
        $('#dvCourseHeader').toggleClass('clsCollapse');
        $("#dvCourseDetailHeader").removeClass('activeDiv');
        $("#dvCourseHeader").addClass('activeDiv');
    },

 fngetMonthNumber:function(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 1;
    }
if (monthName.toUpperCase() == "FEB") {
    return 2;
}
if (monthName.toUpperCase() == "MAR") {
    return 3;
}
if (monthName.toUpperCase() == "APR") {
    return 4;
}
if (monthName.toUpperCase() == "MAY") {
    return 5;
}
if (monthName.toUpperCase() == "JUN") {
    return 6;
}
if (monthName.toUpperCase() == "JUL") {
    return 7;
}
if (monthName.toUpperCase() == "AUG") {
    return 8;
}
if (monthName.toUpperCase() == "SEP") {
    return 9;
}
if (monthName.toUpperCase() == "OCT") {
    return 10;
}
if (monthName.toUpperCase() == "NOV") {
    return 11;
}
if (monthName.toUpperCase() == "DEC") {
    return 12;
}
}
}