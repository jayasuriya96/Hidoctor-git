var s = 0;
var acc_g = "";
var Sub_g = "";
var headerid = "";
var a_g = "";
var val_g = "";
var resp_g = "";
var User_g = "";
var Activity_g = "";
var bind_g = "";
var b = "";
var cc_g = "";
var reheaderid = "";
var Check_g = "";
var placeworked = "";

var DieticianAPPLanding = {
    defaults: {
        //companyCode: "",
        //regionCode: "",
        //userCode: "",
        //userTypeCode: ""
    },
    Init: function () {
    },
    fnbinddates: function () {
        debugger;
        //var sdate = $("#stardate").val().spilt('/');
        //var startdate = sdate[2] + '-' + sdate[0] + '-' + sdate[1];
        //var edate = $("#enddate").val().spilt('/');
        //var enddate = edate[2] + '-' + edate[0] + '-' + edate[1];
        if ($("#stardate").val() > $("#enddate").val()) {
            swal({
                icon: "info",
                title: "Info",
                text: "Start date should not be greater than end date.",
                button: "Ok",
            });
            return false;
        }
        Method_params = ["DieticianReporting/GetDCRDatesforAPP", DieticianAPPLanding.defaults.companyCode, UserCode, RegionCode, $("#stardate").val(), $("#enddate").val()];
        CoreREST.get(null, Method_params, null, DieticianAPPLanding.fnbinddatesSuccessCallback, DieticianAPPLanding.fnbinddatesFailureCallback);
    },
    fnbinddatesSuccessCallback: function (response) {
        debugger;
        //s = s + 1;
        $("#binddates").html("");
        var content = "";
        if (response != null && response.list.length > 0) {
            for (var s = 0; s < response.list.length; s++) {
                content += '<div class="cardcount card' + (s + 1) + '">';
                content += '<div class="panel-group">';
                content += '<div class="panel panel-default">';
                content += '<div class="panel-heading">';
                content += '<div class="card-header card-header-primary" style="background-color: khaki;">';
                content += '<a data-toggle="collapse" href="#collapse' + (s + 1) + '" onclick="DieticianAPPLanding.fngetdata(' + (s + 1) + ');" id="dcrdate' + (s + 1) + '">' + response.list[s].DCR_Actual_Date + '</a>';
                content += '</div>';
                content += '</div>';
                content += '<div id="collapse' + (s + 1) + '" class="panel-collapse collapse">';
                content += '<div class="panel-body' + (s + 1) + '">';
                content += '<div class="card-body dvMainBody" id="dvMainBody' + (s + 1) + '">';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
            }
            $("#binddates").append(content);
        }
        else {
            content += "<span>No data found</span>";
            $("#binddates").append(content);
        }

    },
    fnbinddatesFailureCallback: function () {
    },
    fngetdata: function (value) {
        debugger;
        acc_g = value;
        DieticianAPPLanding.fngetstatus(acc_g, 1);

    },
    fngetstatus: function (acc_g, cval) {
        debugger;
        val_g = cval;
        var a = $("#dcrdate" + acc_g + "").text().split('/')
        var dcrdate = a[2] + '-' + a[1] + '-' + a[0];
        var details = DieticianAPPLanding.defaults.companyCode + '/' + dcrdate + '/' + RegionCode + '/' + UserCode;
        RPAREST.requestInvoke("DieticianReporting/Getreportingdatastatus", details, null, "GET", DieticianAPPLanding.fngetstatusSuccessCallback, DieticianAPPLanding.fngetstatusFailureCallback, null);

    },
    fncheckcombination: function (cc, ch) {
        debugger;
        Check_g = cc + '_' + ch;
        var a = $("#dcrdate" + ch + "").text().split('/')
        var dcrdate = a[2] + '-' + a[1] + '-' + a[0];
        var details = DieticianAPPLanding.defaults.companyCode + '/' + dcrdate + '/' + RegionCode + '/' + UserCode;
        RPAREST.requestInvoke("DieticianReporting/Getreportingdatastatus", details, null, "GET", DieticianAPPLanding.fncheckcombinationSuccessCallback, DieticianAPPLanding.fncheckcombinationFailureCallback, null);
    },
    fncheckcombinationSuccessCallback: function (response) {
        debugger;
        var check = Check_g.split('_');
        if (response != null && response.list.length > 0) {
            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].For_Region_Code != $("#ddluser" + Check_g + "").val() || response.list[i].Camp_Type != $("#ddlActivity" + Check_g + "").val() || response.list[i].Camp_Sub_Type != $("#ddlsubActivity" + Check_g + "").val()) {
                    $("#view" + Check_g + "").hide();
                    $("#go" + Check_g + "").show();
                }
                else {
                    $("#go" + Check_g + "").hide();
                    $("#view" + Check_g + "").show();
                }
            }
        }

    },
    fncheckcombinationFailureCallback: function () {

    },
    fngetstatusSuccessCallback: function (response) {
        debugger;
        resp_g = response;
        var content = "";

        $("#dvMainBody" + acc_g + "").html("");
        if (response != null && response.list.length > 0) {
            for (var i = 0; i < response.list.length; i++) {
                content = "";
                content += '<form>';
                content += '<div class="form-group row">';
                content += '<label for="region" class="col-sm-2 col-form-label">Region Name</label>';
                content += '<div class="col-sm-4" id="dvusers' + (i + 1) + '_' + acc_g + '">';
                content += '<select class="form-control" id="ddluser' + (i + 1) + '_' + acc_g + '">';
                content += '<option value="-1" selected disabled>Select Region</option>';
                content += '</select>';
                content += '</div>';
                content += '</div>';
                content += '<div class="form-group row">';
                content += '<label for="activity" class="col-sm-2 col-form-label">Activity</label>';
                content += '<div class="col-sm-4" id="Activity' + (i + 1) + '_' + acc_g + '">';
                content += '<select class="form-control" id="ddlActivity' + (i + 1) + '_' + acc_g + '">';
                content += '<option value="-1" selected disabled>Select Activity</option>';
                content += '</select>';
                content += '</div>';
                content += '</div>';
                content += '<div class="form-group row">';
                content += '<label for="subactivity" class="col-sm-2 col-form-label">Sub Activity</label>';
                content += '<div class="col-sm-4" id="subactivity' + (i + 1) + '_' + acc_g + '">';
                content += '<select class="form-control" id="ddlsubActivity' + (i + 1) + '_' + acc_g + '">';
                content += '<option value="-1" selected disabled>Select SubActivity</option>';
                content += '</select>';
                content += '</div>';
                content += '</div>';
                content += '<div class="form-group row">';
                if (response.list[i].status == 1) {
                    content += '<button type="button" class="btn btn-primary" id="view' + (i + 1) + '_' + acc_g + '" onclick="DieticianAPPLanding.fnviewredirect(' + (i + 1) + ',' + acc_g + ',' + response.list[i].Header_Id + ');" style="margin-left: 76%;">View</button>';
                    content += '<button type="button" class="btn btn-primary" id="go' + (i + 1) + '_' + acc_g + '" onclick="DieticianAPPLanding.fnredirect(' + (i + 1) + ',' + acc_g + ',' + response.list[i].Header_Id + ');" style="display:none;margin-left: 76%;">GO</button>';
                }
                else {
                    content += '<button type="button" class="btn btn-primary" id="view' + (i + 1) + '_' + acc_g + '" onclick="DieticianAPPLanding.fnviewredirect(' + (i + 1) + ',' + acc_g + ',' + response.list[i].Header_Id + ');" style="display:none;margin-left: 76%;">View</button>';
                    content += '<button type="button" class="btn btn-primary" id="go' + (i + 1) + '_' + acc_g + '" onclick="DieticianAPPLanding.fnredirect(' + (i + 1) + ',' + acc_g + ',' + response.list[i].Header_Id + ');" style="margin-left: 76%;">GO</button>';
                }
                content += '</div>';
                content += '</form>';
                bind_g = "" + (i + 1) + '_' + acc_g + "";
                var a = bind_g.split('_');
                if (i <= response.list.length - 1) {
                    $("#dvMainBody" + acc_g + "").append(content);
                    DieticianAPPLanding.fngetusers("" + bind_g + "");
                    DieticianAPPLanding.fngetdcractivity("" + bind_g + "");
                    $("#ddluser" + bind_g + "").val(response.list[a[0] - 1].For_Region_Code);
                    $("#ddlActivity" + bind_g + "").val(response.list[a[0] - 1].Camp_Type);
                    DieticianAPPLanding.fngetsubActivityfordcr("" + bind_g + "");
                    $("#ddlsubActivity" + bind_g + "").val(resp_g.list[a[0] - 1].Camp_Sub_Type);
                }
            }

        }
        else {
            content += '<form>';
            content += '<div class="form-group row">';
            content += '<label for="region" class="col-sm-2 col-form-label">Region Name</label>';
            content += '<div class="col-sm-4" id="dvusers' + 1 + '_' + acc_g + '">';
            content += '<select class="form-control" id="ddluser' + 1 + '_' + acc_g + '">';
            content += '<option value="-1" selected disabled>Select Region</option>';
            content += '</select>';
            content += '</div>';
            content += '</div>';
            content += '<div class="form-group row">';
            content += '<label for="activity" class="col-sm-2 col-form-label">Activity</label>';
            content += '<div class="col-sm-4" id="Activity' + 1 + '_' + acc_g + '">';
            content += '<select class="form-control" id="ddlActivity' + 1 + '_' + acc_g + '">';
            content += '<option value="-1" selected disabled>Select Activity</option>';
            content += '</select>';
            content += '</div>';
            content += '</div>';
            content += '<div class="form-group row">';
            content += '<label for="subactivity" class="col-sm-2 col-form-label">Sub Activity</label>';
            content += '<div class="col-sm-4" id="subactivity' + 1 + '_' + acc_g + '">';
            content += '<select class="form-control" id="ddlsubActivity' + 1 + '_' + acc_g + '">';
            content += '<option value="-1" selected disabled>Select SubActivity</option>';
            content += '</select>';
            content += '</div>';
            content += '</div>';
            content += '<div class="form-group row">';
            content += '<button type="button" class="btn btn-primary" id="go' + 1 + '_' + acc_g + '" onclick="DieticianAPPLanding.fnredirect(1,' + acc_g + ',0);" style="margin-left: 76%;">GO</button>';
            content += '</div>';
            content += '</form>';
            bind_g = "" + 1 + '_' + acc_g + "";
            var a = bind_g.split('_');
            $("#dvMainBody" + acc_g + "").html(content);
            DieticianAPPLanding.fngetusers("" + bind_g + "");
            DieticianAPPLanding.fngetdcractivity("" + bind_g + "");
            DieticianAPPLanding.fngetsubActivityfordcr("" + bind_g + "");
        }

    },
    fngetstatusFailureCallback: function () {

    },
    fngetusers: function (uval) {
        User_g = uval
        debugger;
        var divisioncode = 0;
        var details = DieticianAPPLanding.defaults.companyCode + '/' + UserCode + '/' + RegionCode;
        RPAREST.requestInvoke("DieticianReporting/GetUsersbasedondivision", details, null, "GET", DieticianAPPLanding.fngetusersSuccessCallback, DieticianAPPLanding.fngetusersFailureCallback, null);
    },
    fngetusersSuccessCallback: function (response) {
        debugger;
        var k = User_g.split('_');
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddluser' + User_g + '" onchange="DieticianAPPLanding.fncheckcombination(' + k[0] + ',' + k[1] + ');">';
            content += '<option value="-1" selected disabled>Select Region</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Region_Code + '">' + response.list[i].Region_Name + '-' + response.list[i].User_Name + '-' + response.list[i].Employee_Name + '-' + response.list[i].User_Type_Name + '</option>'
            }
            content += '</select>';
            $('#dvusers' + User_g + '').html(content);
            $("#ddluser" + User_g + "").val(RegionCode);
        }
    },
    fngetusersFailureCallback: function () {

    },

    fngetdcractivity: function (acval) {
        debugger;
        Activity_g = acval;
        b = Activity_g.split('_');
        var a = $("#dcrdate" + b[1] + "").text().split('/')
        var dcrdate = a[2] + '-' + a[1] + '-' + a[0];
        var details = DieticianAPPLanding.defaults.companyCode + '/' + dcrdate + '/' + UserCode;
        RPAREST.requestInvoke("DieticianReporting/GetDCRActivity", details, null, "GET", DieticianAPPLanding.fngetdcractivitySuccessCallback, DieticianAPPLanding.fngetdcractivityFailureCallback, null);
    },
    fngetdcractivitySuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddlActivity' + Activity_g + '" onblur="DieticianAPPLanding.fngetsubActivityfordcr(' + b[0] + ',' + b[1] + ');" onchange="DieticianAPPLanding.fncheckcombination(' + b[0] + ',' + b[1] + ');">';
            content += '<option value="-1" selected disabled>Select Activity</option>'
            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Activity_Code + '">' + response.list[i].Activity_Name + '</option>'
            }
            content += '</select>';
            $('#Activity' + Activity_g + '').html(content);
            if (response.list.length > 1) {
                $("#ddlActivity" + Activity_g + "").attr('disabled', false);
            }
            else {
                $("#ddlActivity" + Activity_g + "").val(response.list[0].Activity_Code).attr('disabled', true);
            }
        }
    },
    fngetdcractivityFailureCallback: function () {

    },
    fngetsubActivityfordcr: function (subval, n) {
        debugger;
        if (n != undefined) {
            Sub_g = subval + '_' + n;
        }
        else {
            Sub_g = subval;
        }
        var ActivityCode = $("#ddlActivity" + Sub_g + "").val();
        var details = DieticianAPPLanding.defaults.companyCode + '/' + ActivityCode;
        RPAREST.requestInvoke("DieticianReporting/GetDCRSubActivity", details, null, "GET", DieticianAPPLanding.fngetdcrsubactivitySuccessCallback, DieticianAPPLanding.fngetdcrsubactivityFailureCallback, null);
    },
    fngetdcrsubactivitySuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddlsubActivity' + Sub_g + '" onchange="DieticianAPPLanding.fncheckcombination(' + b[0] + ',' + b[1] + ');">';
            content += '<option value="-1" selected disabled>Select SubActivity</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].SubActivity_Code + '">' + response.list[i].SubActivity_Name + '</option>';
            }
            content += '</select>';
            $('#subactivity' + Sub_g + '').html(content);
            if (response.list.length > 1) {
                $("#ddlsubActivity" + Sub_g + "").attr('disabled', false);
            }
            else {
                $("#ddlsubActivity" + Sub_g + "").val(response.list[0].SubActivity_Code).attr('disabled', true);
            }
        }
    },
    fngetdcrsubactivityFailureCallback: function () {

    },
    fnredirect: function (v, k, headerid) {
        debugger;
        if ($("#ddluser" + v + '_' + k + "").val() == null || $("#ddluser" + v + '_' + k + "").val() == "") {
            swal({
                icon: "info",
                title: "Info",
                text: "Please select Region.",
                button: "Ok",
            });
            return false;
        }
        if ($("#ddlActivity" + v + '_' + k + "").val() == null || $("#ddlActivity" + v + '_' + k + "").val() == "") {
            swal({
                icon: "info",
                title: "Info",
                text: "Please select activity.",
                button: "Ok",
            });
            return false;
        }
        if ($("#ddlsubActivity" + v + '_' + k + "").val() == null || $("#ddlsubActivity" + v + '_' + k + "").val() == "") {
            swal({
                icon: "info",
                title: "Info",
                text: "Please select sub activity.",
                button: "Ok",
            });
            return false;
        }
        var a = $("#dcrdate" + k + "").text().split('/')
        var dcrdate = a[2] + '-' + a[1] + '-' + a[0];
        var activitycode = $("#ddlActivity" + v + '_' + k + "").val();
        var subactivitycode = $("#ddlsubActivity" + v + '_' + k + "").val();
        //  var loc = $("#location" + v + "").val();
        var selectedregionname = $("#ddluser" + v + '_' + k + "").val();
        if (resp_g.list.length > 0) {
            // if (resp_g.list[v-1].status == 1) {
            if (resp_g.list[v - 1].For_Region_Code != $("#ddluser" + v + '_' + k + "").val() || resp_g.list[v - 1].Camp_Type != $("#ddlActivity" + v + '_' + k + "").val() || resp_g.list[v - 1].Camp_Sub_Type != $("#ddlsubActivity" + v + '_' + k + "").val()) {
                var headerid = 0;
            }
            // }
        }
        if (headerid == 0 || headerid == undefined || headerid == null) {
            var headerid = 0;
        }
        var url = '/HiDoctor_Activity/DailyReporting/DailyAPPReporting/?dcrdate=' + dcrdate + '&activitycode=' + activitycode + '&subactivitycode=' + subactivitycode + '&loc=' + 0 + '&selectedregionname=' + selectedregionname + '&headerid=' + headerid + '&CompanyCode=' + DieticianAPPLanding.defaults.companyCode + '&RegionCode=' + RegionCode + '&UserCode=' + UserCode + '&UserName=' + UserName + '&RegionName=' + RegionName + '&latitude=' + latitude + '&longitude=' + longitude + '&SubDomainName=' + SubDomainName;
        window.location.href = url;
    },
    fnviewredirect: function (v, k, headerid) {
        DieticianAPPLanding.fncheckstatus(v, k, headerid);
    },
    fncheckstatus: function (v, k, headerid) {
        debugger;
        reheaderid = headerid;
        a_g = v + '_' + k;
        var a = $("#dcrdate" + k + "").text().split('/')
        var dcrdate = a[2] + '-' + a[1] + '-' + a[0];
        Method_params = ["DieticianReporting/checkstatus", DieticianAPPLanding.defaults.companyCode, dcrdate, UserCode, $("#ddluser" + a_g + "").val(), $("#ddlActivity" + a_g + "").val(), $("#ddlsubActivity" + a_g + "").val()];
        CoreREST.get(null, Method_params, null, DieticianAPPLanding.fncheckstatusSuccessCallback, DieticianAPPLanding.fncheckstatusFailureCallback);
    },
    fncheckstatusSuccessCallback: function (response) {
        debugger;
        var dateval = a_g.split('_');
        var a = $("#dcrdate" + dateval[1] + "").text().split('/')
        var dcrdate = a[2] + '-' + a[1] + '-' + a[0];
        var activitycode = $("#ddlActivity" + a_g + "").val();
        var subactivitycode = $("#ddlsubActivity" + a_g + "").val();
        var loc = $("#location" + a_g + "").val();
        var selectedregionname = $("#ddluser" + a_g + "").val();
        if (response == 1) {
            swal({
                icon: "info",
                title: "Info",
                text: "There is already camp for this combination.You can just view the data.",
                button: "Ok",
            }).then(function () {
                // $("#main").load('../HiDoctor_Activity/DieticianReporting/DieticianAPPReporting/?dcrdate=' + dcrdate + '&activitycode=' + activitycode + '&subactivitycode=' + subactivitycode + '&loc=' + loc + '&selectedregionname=' + selectedregionname + '&headerid=' + headerid + '&CompanyCode=' + DieticianAPPLanding.defaults.companyCode + '&RegionCode=' + RegionCode + '&UserCode=' + UserCode + '&UserName=' + UserName + '&RegionName=' + RegionName);
                var url = '/HiDoctor_Activity/DailyReporting/DailyAPPReporting/?dcrdate=' + dcrdate + '&activitycode=' + activitycode + '&subactivitycode=' + subactivitycode + '&loc=' + 0 + '&selectedregionname=' + selectedregionname + '&headerid=' + reheaderid + '&CompanyCode=' + DieticianAPPLanding.defaults.companyCode + '&RegionCode=' + RegionCode + '&UserCode=' + UserCode + '&UserName=' + UserName + '&RegionName=' + RegionName + '&latitude=' + latitude + '&longitude=' + longitude;
                window.location.href = url;
            });
        }

    },
    fncheckstatusFailureCallback: function () {

    },
}