var Users_g = "";
//var i = 0;
//var j = 0;
//var k = 0;
var privilege_g = "";
var doc_g = "";
var spcl_g = "";
var b = "";
var p_g = "";
var ActivityCode = "";
var SubActivityCode = "";
var dcrstatus = "";
var headerid = "";
var camptype = "";
var ctype = "";
var rcode = "";
var resp_g = "";
var s = 0;
var main_g = "";
var Activityid = "";
var AccompId = "";
var Activity_g = "";
var dcr_g = "";
var DieticianReporting = {
    defaults: {
        companyCode: "",
        regionCode: "",
        userCode: "",
        userTypeCode: ""
    },
    Init: function () {
        s = 0;
        main_g = "";
        DieticianReporting.fnbindUI();
    },
    fnbindUI: function () {
        s = s + 1;
        main_g = s;
        if (main_g != 1) {
            $("#addcamp" + (main_g - 1) + "").hide();
        }
        var content = "";
        content += '<div class="cardcount card' + s + '">';
        content += '<div class="panel-group">';
        content += '<div class="panel panel-default">';
        content += '<div class="panel-heading">';
        content += '<div class="card-header card-header-primary" style="background-color: khaki;">';
        // content += '<a data-toggle="collapse" href="#collapse' + s + '" onclick="DieticianReporting.fnloaddata();">Camp ' + s + '</a>';
        content += '<a data-toggle="collapse" href="#collapse' + s + '">Camp ' + s + '</a>';
        content += '</div>';
        content += '</div>';
        content += '<div id="collapse' + s + '" class="panel-collapse collapse">';
        content += '<div class="panel-body' + s + '">';
        content += '<div class="card-body" id="dvMainBody' + s + '">';
        content += '<form>';
        content += '<div class="form-group row">';
        content += '<label for="FilledBy" class="col-sm-2 col-form-label">Filled By</label>';
        content += '<div class="col-sm-4">';
        content += '<input type="text" class="form-control" id="filledby' + s + '">';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="For" class="col-sm-2 col-form-label">For</label>';
        content += '<div class="col-sm-4" id="dvusers' + s + '">';
        content += '<select class="form-control" id="ddluser' + s + '">';
        content += '<option value="-1" selected disabled>Select User</option>';
        content += '</select>';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="Additionalusers" class="col-sm-2 col-form-label">Additional Users</label>';
        content += '<div class="col-sm-4" id="dvadditionalusers' + s + '">';
        content += '<input type="text" class="accompanist" id="additionalusers' + s + '" name="additionalusers' + s + '" class="form-control" maxlength="" />';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="date" class="col-sm-2 col-form-label">Date of Camp</label>';
        content += '<div class="col-sm-4">';
        content += '<input type="date" class="form-control" id="startdate' + s + '">';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="time" class="col-sm-2 col-form-label">Time of Camp</label>';
        content += '<div class="col-sm-2">';
        content += '<input type="time" class="form-control" id="starttime' + s + '">';
        content += '</div>';
        content += '<div class="col-sm-2">';
        content += '<input type="time" class="form-control" id="endtime' + s + '">';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="camptype" class="col-sm-2 col-form-label">Camp Type</label>';
        content += '<div class="col-sm-4" id="Activity' + s + '">';
        content += '<select class="form-control" id="ddlActivity' + s + '">';
        content += '<option value="-1" selected disabled>Select Activity</option>';
        content += '</select>';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="campsubtype" class="col-sm-2 col-form-label">Camp Sub Type</label>';
        content += '<div class="col-sm-4" id="subactivity' + s + '">';
        content += '<select class="form-control" id="ddlsubActivity' + s + '">';
        content += '<option value="-1" selected disabled>Select SubActivity</option>';
        content += '</select>';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="Location" class="col-sm-2 col-form-label">Location</label>';
        content += '<div class="col-sm-4">';
        content += '<input type="text" class="form-control" id="Location' + s + '">';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="doctorcount" class="col-sm-2 col-form-label">Doctor Attendees(count)</label>';
        content += '<div class="col-sm-4">';
        content += '<input type="text" class="form-control" id="doctorcount' + s + '" onkeypress="return DieticianReporting.isNumber(event)" maxlength="10000">';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="patientcount" class="col-sm-2 col-form-label">Patient Attendees(count)</label>';
        content += '<div class="col-sm-4">';
        content += '<input type="text" class="form-control" id="patientcount' + s + '" onkeypress="return DieticianReporting.isNumber(event)" maxlength="10000">';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group row">';
        content += '<label for="Prescription" class="col-sm-2 col-form-label">Prescription(value)</label>';
        content += '<div class="col-sm-4">';
        content += '<input type="text" class="form-control" id="Prescription' + s + '" onkeypress="return DieticianReporting.isNumberKey(event,this)" maxlength="1000000">';
        content += '</div>';
        content += '</div>';
        content += '</form>';
        content += '</div>';
        content += '<div class="card">';
        content += '<div class="card-header card-header-primary">Doctor Details';
        content += '</div>';
        content += '<div class="card-body" id="dvMainDoctorBody' + s + '">';
        content += '</div>';
        content += '</div>';
        content += '<div class="card">';
        content += '<div class="card-header card-header-primary">Patient Details';
        content += '</div>';
        content += '<div class="card-body" id="dvMainPatientdetBody' + s + '">';
        content += '</div>';
        content += '</div>';
        content += '<div class="card">';
        content += '<div class="card-header card-header-primary">Prescription Details';
        content += '</div>';
        content += '<div class="card-body" id="dvMainprescriptionBody' + s + '">';
        content += '</div>';
        content += ' </div>';
        content += '<div>';
        content += '<a href="#" id="addcamp' + s + '" onclick="DieticianReporting.fnbindUI(' + s + ');">Add Camp</button>';
        content += '</div>';
        content += '</div>';
        content += '</div>';
        content += '</div>';
        content += '</div>';
        content += '</div>';
        $("#bind").append(content);
        DieticianReporting.fngetusers(s);
        DieticianReporting.fnadddoctor(s, 0);
        DieticianReporting.fnaddpatient(s, 0);
        DieticianReporting.fnaddprescription(s, 0);
        DieticianReporting.fnonloadgetSpeciality(s, 0);
        DieticianReporting.fngetAccompanist(s);
        DieticianReporting.fngetdcrdata();
        if (resp_g != "" && resp_g.list.lstheaderdetails.length > 0) {
            DieticianReporting.fnloadgrid(s);
        }

    },
    fnloaddata: function () {
        // ShowModalPopup('dvLoading');
        //DieticianReporting.fngetusers(s);
        //DieticianReporting.fnadddoctor(s, 0);
        //DieticianReporting.fnaddpatient(s, 0);
        //DieticianReporting.fnaddprescription(s, 0);
        //DieticianReporting.fnonloadgetSpeciality(s, 0);
        //DieticianReporting.fngetAccompanist(s);
        //DieticianReporting.fngetdcrdata();
        //if (resp_g.list.lstheaderdetails.length > 0) {
        //    DieticianReporting.fnloadgrid(s);
        //}
    },
    fnloadgrid: function (value) {
        debugger;
        // HideModalPopup('dvLoading');
        var disjson = $.grep(resp_g.list.lstheaderdetails, function (ele, index) {
            return index == (value - 1);
        });
        var response = resp_g;

        var hid = disjson[0].Header_Id;
        var header_id = disjson[0].Header_Id;
        $("#ddluser" + value + "").val(disjson[0].User_Code);
        var a = disjson[0].Start_date.split("T");
        var b = a[0].split("/");
        //var c = b[2] + '-' + b[0] + '-' + b[1]
        $("#startdate" + value + "").val(b);
        $("#starttime" + value + "").val(disjson[0].Start_Time);
        $("#endtime" + value + "").val(disjson[0].End_Time);
        //var a = [];
        //var b = {};
        //for (var u = 0; u < response.list.lstheaderdetails.length; u++) {
        //    var b = {
        //        activitycode: response.list.lstheaderdetails[u].Camp_Type,
        //    }
        //    a.push(b);
        //}
        if (response.list.lstheaderdetails[0].Division_Code > 1) {
            $("#ddlActivity" + value + "").val(disjson[0].Camp_Type).attr('disabled', false);
        }
        DieticianReporting.fngetsubActivity(value);
        if (disjson[0].Camp_Sub_Type != null && disjson[0].Camp_Sub_Type != 0 && disjson[0].Camp_Sub_Type != undefined && disjson[0].Camp_Sub_Type != -1) {
            $("#ddlsubActivity" + value + "").val(disjson[0].Camp_Sub_Type);

        }
        else {
            $("#ddlsubActivity" + value + "").val(-1);
        }
        if (disjson[0].Noofdoctors == 0) {
            $("#doctorcount" + value + "").val("");
        }
        else {
            $("#doctorcount" + value + "").val(disjson[0].Noofdoctors);
        }
        if (disjson[0].Noofpatients == 0) {
            $("#patientcount" + value + "").val("");
        }
        else {
            $("#patientcount" + value + "").val(disjson[0].Noofpatients);
        }
        if (disjson[0].Noofprescriptions == 0) {
            $("#Prescription" + value + "").val("");
        }
        else {
            $("#Prescription" + value + "").val(disjson[0].Noofprescriptions);
        }
        if (disjson[0].User_Code != 0) {
            rcode = disjson[0].User_Code;
            DieticianReporting.fngetdocdetails(value, 1, rcode);
            DieticianReporting.fngetParametertype(value, disjson[0].Camp_Type, disjson[0].Camp_Sub_Type, value);
            DieticianReporting.fngetskudetails(value, 1, rcode);
        }
        if (response.list.lstAccompdetails.length > 0) {
            var lstarr = [];
            var disjson = $.grep(response.list.lstAccompdetails, function (ele, index) {
                return ele.Header_Id == header_id;
            });
            if (disjson.length > 0) {
                for (var j = 0; j < disjson.length; j++) {
                    lstarr.push(disjson[j].Accompanist_Code);
                }
                var msObject = document.getElementById("additionalusers" + value + "").ej2_instances[0];
                msObject.value = lstarr;
            }

        }

        if (response.list.lstpatientdetails.length > 0) {
            var disjson = $.grep(response.list.lstpatientdetails, function (ele, index) {
                return ele.Header_Id == header_id;
            });
            for (var k = 0; k < disjson.length; k++) {
                //if (response.list.lstpatientdetails[k].Header_Id == header_id) {
                $("#ddltype" + value + '_' + (k + 1) + "").val(disjson[k].Parameter_Value);
                $("#Patientname" + value + '_' + (k + 1) + "").val(disjson[k].Patient_Name);
                if (disjson[k].Age == 0) {
                    $("#age" + value + '_' + (k + 1) + "").val("");
                }
                else {
                    $("#age" + value + '_' + (k + 1) + "").val(disjson[k].Age);
                }
                if (disjson[k].Gender == null) {
                    $("#gender" + value + '_' + (k + 1) + "").val(-1);

                }
                else {
                    $("#gender" + value + '_' + (k + 1) + "").val(disjson[k].Gender);

                }
                if (disjson[k].Total_Prescription_Value == null || disjson[k].Total_Prescription_Value == 0) {
                    $("#pvalue" + value + '_' + (k + 1) + "").val("");
                }
                else {
                    $("#pvalue" + value + '_' + (k + 1) + "").val(disjson[k].Total_Prescription_Value);
                }
                $("#notes" + value + '_' + (k + 1) + "").val(disjson[k].Notes);
                DieticianReporting.fnaddpatient(value, (k + 1));
                //}
            }
        }

        if (resp_g != null) {
            if (resp_g.list.lstdoctordetails.length > 0) {
                var lstdoct = [];
                var disjson = $.grep(response.list.lstdoctordetails, function (ele, index) {
                    return ele.Header_Id == header_id;
                });
                for (var m = 0; m < disjson.length; m++) {
                    var doctcode = disjson[m].Doctor_Code;
                    var msObject = document.getElementById("ddldoctor_" + value + '_' + (m + 1) + "").ej2_instances[0];
                    msObject.value = doctcode;
                    $("#ddldoctor_" + value + '_' + (m + 1) + "").val(disjson[m].Doctor_Name);
                    //$("select[name='ddldoctor_" + (i + 1) + "']").val(response.list.lstdoctordetails[i].Doctor_Code);
                    $("#Speciality" + value + '_' + (m + 1) + "").val(disjson[m].Speciality_Code);
                    if (disjson[m].Prescription_Value == 0 || disjson[m].Prescription_Value == null) {
                        $("#Prescription" + value + '_' + (m + 1) + "").val("");
                    }
                    else {
                        $("#Prescription" + value + '_' + (m + 1) + "").val(disjson[m].Prescription_Value)
                    }
                    $("#remarks" + value + '_' + (m + 1) + "").val(disjson[m].Notes);
                    //if (i != 0) {
                    DieticianReporting.fnadddoctor(value, (m + 1));
                }
            }
        }
        if (resp_g != null) {
            if (resp_g.list.lstprescriptiondetails.length > 0) {
                var disjson = $.grep(response.list.lstprescriptiondetails, function (ele, index) {
                    return ele.Header_Id == header_id;
                });
                for (var n = 0; n < disjson.length; n++) {
                    var skucode = disjson[n].Product_Code;
                    var msObject = document.getElementById("ddlsku" + value + '_' + (n + 1) + "").ej2_instances[0];
                    msObject.value = skucode;
                    if (disjson[n].No_of_Prescriptions == 0 || disjson[n].No_of_Prescriptions == null) {
                        $("#noofprescriptions" + value + '_' + (n + 1) + "").val("");
                    }
                    else {
                        $("#noofprescriptions" + value + '_' + (n + 1) + "").val(disjson[n].No_of_Prescriptions);
                    }
                    if (disjson[n].No_of_PrescriptionValue == 0 || disjson[n].No_of_PrescriptionValue == null) {
                        $("#noofprescriptionsValue" + value + '_' + (n + 1) + "").val("");
                    }
                    else {
                        $("#noofprescriptionsValue" + value + '_' + (n + 1) + "").val(disjson[n].No_of_Prescriptions);
                    }

                    $("#note" + value + '_' + (n + 1) + "").val(disjson[n].Notes);
                    DieticianReporting.fnaddprescription(value, (n + 1));
                }
            }
        }
        var AccordGridLength = $(".cardcount").length
        if (resp_g != "" && AccordGridLength < resp_g.list.lstheaderdetails.length) {
            DieticianReporting.fnbindUI();
        }

        //  }
    },
    fngetdcrdata: function () {
        debugger;
        var details = DieticianReporting.defaults.companyCode + '/' + RegionCode + '/' + dcrdate + '/' + UserCode;
        RPAREST.requestInvoke("DieticianReporting/GetDCRdata", details, null, "GET", DieticianReporting.fngetdcrdataSuccessCallback, DieticianReporting.fngetdcrdataFailureCallback, null);
        //Method_params = ["DieticianReporting/GetDCRdata", DieticianReporting.defaults.companyCode, RegionCode, dcrdate, UserCode];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetdcrdataSuccessCallback, DieticianReporting.fngetdcrdataFailureCallback);
    },
    fngetdcrdataSuccessCallback: function (response) {
        debugger;
        //  HideModalPopup('dvLoading');
        dcr_g = response;
        for (var i = 0; i < $(".cardcount").length; i++) {
            $("#filledby" + main_g + "").val(UserName).attr('disabled', true);
            $("#Location" + main_g + "").val(response.list[0].Place_Worked).attr('disabled', false);
            $("#startdate" + main_g + "").val(dcrdate).attr('disabled', true);
            ctype = response.list[0].Activity_Code;
            dcrstatus = response.list[0].DCR_Status;
            var content = "";
            if (response != null && response.list.length > 1) {
                content += '<select class="form-control" id="ddlActivity' + main_g + '" onchange="DieticianReporting.fngetsubActivity(' + main_g + ');">';
                content += '<option value="-1" selected disabled>Select Activity</option>'

                for (var j = 0; j < response.list.length; j++) {
                    content += '<option value="' + response.list[j].Activity_Code + '">' + response.list[j].Activity_Name + '</option>'
                }
                content += '</select>';
                $('#Activity' + main_g + '').html(content);
            }
            else {
                DieticianReporting.fngetActivity();
            }
            $("#ddluser" + main_g + "").val(RegionCode);
            // if (dcrstatus == "0") {
            DieticianReporting.fngetdocdetails(main_g, 1, RegionCode);
            DieticianReporting.fngetskudetails(main_g, 1, RegionCode);
            //  }
            headerid = response.list[0].Header_Id;
        }
        if (dcrstatus == "0" && resp_g == "") {
            DieticianReporting.fncheckcamptype();
            DieticianReporting.fngetDieticianReportingdetails();
        }
    },
    fngetdcrdataFailureCallback: function () {

    },
    fncheckcamptype: function () {
        debugger;
        var details = DieticianReporting.defaults.companyCode + '/' + headerid;
        RPAREST.requestInvoke("DieticianReporting/checkcamptype", details, null, "GET", DieticianReporting.fncheckcamptypeSuccessCallback, DieticianReporting.fncheckcamptypeFailureCallback, null);
        // Method_params = ["DieticianReporting/checkcamptype", DieticianReporting.defaults.companyCode, headerid];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fncheckcamptypeSuccessCallback, DieticianReporting.fncheckcamptypeFailureCallback);
    },
    fncheckcamptypeSuccessCallback: function (response) {
        debugger;
        if (response.list > 0) {
            camptype = response.list[0].Camp_Type;
        }
        else {
            camptype == 0;
        }

    },
    fncheckcamptypeFailureCallback: function () {

    },
    fngetdivisions: function () {
        debugger;
        var details = DieticianReporting.defaults.companyCode + '/' + DieticianReporting.defaults.regionCode + '/' + DieticianReporting.defaults.userCode;
        RPAREST.requestInvoke("DieticianReporting/GetDivisions", details, null, "GET", DieticianReporting.fngetdivisionsSuccessCallback, DieticianReporting.fngetdivisionsFailureCallback, null);
        //Method_params = ["DieticianReporting/GetDivisions", DieticianReporting.defaults.companyCode, DieticianReporting.defaults.regionCode, DieticianReporting.defaults.userCode];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetdivisionsSuccessCallback, DieticianReporting.fngetdivisionsFailureCallback);
    },
    fngetdivisionsSuccessCallback: function (response, CompanyCode) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddldivision" onchange="DieticianReporting.fngetusers();">';
            content += '<option value="-1" selected disabled>Select Division</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Division_Code + '">' + response.list[i].Division_Name + '</option>'
            }
            content += '</select>';
            $('#division').html(content);
            //$("#division option").each(function () {
            //    if ($(this).text() == "HQ") {
            //        $(this).attr('selected', 'selected');
            //    }
            //});
        }
    },
    fngetdivisionsFailureCallback: function () {

    },
    fngetusers: function () {
        debugger;
        var divisioncode = $('#ddldivision option:selected').val();
        if (divisioncode == "") {
            var divisioncode = 0;
        }
        var details = DieticianReporting.defaults.companyCode + '/' + DieticianReporting.defaults.userCode + '/' + DieticianReporting.defaults.regionCode;
        RPAREST.requestInvoke("DieticianReporting/GetUsersbasedondivision", details, null, "GET", DieticianReporting.fngetusersSuccessCallback, DieticianReporting.fngetusersFailureCallback, null);
        //Method_params = ["DieticianReporting/GetUsersbasedondivision", DieticianReporting.defaults.companyCode, divisioncode, DieticianReporting.defaults.regionCode];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetusersSuccessCallback, DieticianReporting.fngetusersFailureCallback);
    },
    fngetusersSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddluser' + main_g + '"  onchange="DieticianReporting.fngetdata(' + s + ');">';
            content += '<option value="-1" selected disabled>Select Region</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Region_Code + '">' + response.list[i].Region_Name + '-' + response.list[i].User_Name + '-' + response.list[i].Employee_Name + '-' + response.list[i].User_Type_Name + '</option>'
            }
            content += '</select>';
            $('#dvusers' + main_g + '').html(content);
        }
    },
    fngetusersFailureCallback: function () {

    },
    fngetdata: function (rid) {
        DieticianReporting.fngetskudetails(rid, 1);
        DieticianReporting.fngetdocdetails(rid, 1);
    },
    fngetActivity: function () {
        debugger;
        //Method_params = ["DieticianReporting/GetActivityforDR", DieticianReporting.defaults.companyCode];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetActivitySuccessCallback, DieticianReporting.fngetActivityFailureCallback);
        var details = DieticianReporting.defaults.companyCode + '/' + dcrdate + '/' + UserCode;
        RPAREST.requestInvoke("DieticianReporting/GetDCRActivity", details, null, "GET", DieticianReporting.fngetActivitySuccessCallback, DieticianReporting.fngetActivityFailureCallback, null);
    },
    fngetActivitySuccessCallback: function (response, CompanyCode) {
        debugger;
        Activity_g = response;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddlActivity' + main_g + '" onchange="DieticianReporting.fngetsubActivity(' + main_g + ');">';
            content += '<option value="-1" selected disabled>Select Activity</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Activity_Code + '">' + response.list[i].Activity_Name + '</option>'
            }
            content += '</select>';
            $('#Activity' + main_g + '').html(content);
            if (response.list.length > 0) {
                $("#ddlActivity" + main_g + "").val(dcr_g.list[0].Activity_Code).attr('disabled', false);
                DieticianReporting.fngetsubActivity(main_g);
            }
            if (response.list.length > 0 && dcrstatus != 0) {
                $("#ddlActivity" + main_g + "").val(dcr_g.list[0].Activity_Code).attr('disabled', true);
            }
            else if (dcrstatus != 0) {
                $("#ddlActivity" + main_g + "").val(dcr_g.list[0].Activity_Code).attr('disabled', true);
            }
            //$("#division option").each(function () {
            //    if ($(this).text() == "HQ") {
            //        $(this).attr('selected', 'selected');
            //    }
            //});
        }
    },
    fngetActivityFailureCallback: function () {

    },
    fngetsubActivity: function (Subid) {
        debugger;
        Activityid = Subid;
        // var ActivityCode = $('#ddlActivity' + Subid + ' option:selected').val();
        //Method_params = ["DieticianReporting/GetSubActivity", DieticianReporting.defaults.companyCode, ActivityCode];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetsubactivitySuccessCallback, DieticianReporting.fngetsubactivityFailureCallback);
        var details = DieticianReporting.defaults.companyCode + '/' + $('#ddlActivity' + Subid + ' option:selected').val();
        RPAREST.requestInvoke("DieticianReporting/GetSubActivity", details, null, "GET", DieticianReporting.fngetsubactivitySuccessCallback, DieticianReporting.fngetsubactivityFailureCallback, null);
    },
    fngetsubactivitySuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddlsubActivity' + Activityid + '" onchange="DieticianReporting.fngetParametertype(' + Activityid + ',' + Activityid + ',' + Activityid + ',' + Activityid + ')">';
            content += '<option value="-1" selected disabled>Select SubActivity</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].SubActivity_Code + '">' + response.list[i].SubActivity_Name + '</option>';
            }
            content += '</select>';
            $('#subactivity' + Activityid + '').html(content);
            if (resp_g != "" && resp_g.list.lstheaderdetails.length > 1) {
                $("#ddlsubActivity" + Activityid + "").val(resp_g.list.lstheaderdetails[Activityid - 1].Camp_Sub_Type);
            }
        }
    },
    fngetsubactivityFailureCallback: function () {

    },
    fnadddoctor: function (accrdId, rowId) {
        debugger;
        var i = rowId + 1;
        if (i != 1) {
            $("#plus" + accrdId + '_' + (i - 1) + "").hide();
        }

        var content = "";
        content += '<form>';
        content += '<div class="form-row docgrid' + accrdId + '" id="doctorgrid' + accrdId + '_' + i + '">';
        content += '<div class="form-group col-md-2">';
        content += '<label for="DoctorName">Doctor Name</label>';
        content += '<div class="col-sm-12" id="dvdoctor' + accrdId + '_' + i + '">';
        content += '<input class="txtdoc" type="text" id="ddldoctor_' + accrdId + '_' + i + '" tabindex="1"/>';
        //content += '<select class="form-control" id="ddldoctor' + i + '">';
        //content += '<option value="-1" selected disabled>Select Doctor</option>';
        //content += '</select>';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="Speciality">Speciality</label>';
        content += '<div class="col-sm-12" id="dvspeciality' + accrdId + '_' + i + '">';
        content += '<select class="form-control"  id="Speciality' + accrdId + '_' + i + '">';
        content += '<option value="-1" selected disabled>Select Speciality</option>';
        content += '</select>';
        content += '</div>';
        //content += '<input type="text" class="form-control" id="Speciality' + i + '">';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="Prescription">Prescription Value</label>';
        content += '<input type="text" class="form-control" id="Prescription' + accrdId + '_' + i + '"  onkeypress = "return DieticianReporting.isNumber(event)">';
        content += '</div>';
        content += '<div class="form-group col-md-3">';
        content += '<label for="Remarks">Notes</label>';
        content += '<textarea class="form-control" maxlength="500" class="form-control" id="remarks' + accrdId + '_' + i + '" style="resize:none;"></textarea>';
        content += '</div>';
        content += '<div class="col-md-3">';
        content += '<label for="inputPassword4"></label>';
        content += '<i class="fa fa-plus" aria-hidden="true" style="margin-top:41px;" id="plus' + accrdId + '_' + i + '" onclick="DieticianReporting.fnadddoctor(' + accrdId + ',' + i + ');"></i>';
        content += '<i class="fa fa-minus-circle" aria-hidden="true" style="margin-left:25px;"  id="minus' + accrdId + '_' + i + '" onclick="DieticianReporting.fnremovedoctor(' + accrdId + ',' + i + ');"></i>';
        content += '</div>';
        content += '</div>';
        content += '</form>';
        $("#dvMainDoctorBody" + accrdId + "").append(content);
        if (i == 1) {
            $("#minus" + accrdId + '_' + i + "").hide();
        }
        DieticianReporting.fngetdocdetails(accrdId, i);
        DieticianReporting.fnonloadgetSpeciality(accrdId, i);
    },
    fnremovedoctor: function (accrdId, rowId) {
        debugger;
        if (rowId != 1) {
            $('#doctorgrid' + accrdId + '_' + rowId + '').remove();
        }
        if (rowId != 1) {
            $("#plus" + accrdId + '_' + (rowId - 1) + "").show();
        }
    },
    fnaddpatient: function (accrdId, rowpId) {
        //j = j + 1;
        var j = rowpId + 1;
        p_g = accrdId + '_' + j;
        if (j != 1) {
            $("#patplus" + accrdId + '_' + (j - 1) + "").hide();
        }
        var content = "";
        content += '<form>';
        content += '<div class="form-row pgrid' + accrdId + '" id="patientgrid' + accrdId + '_' + j + '">';
        content += '<div class="form-group col-md-1.5">';
        content += '<label for="Type">Parameter Value</label>';
        // content += '<select class="form-control" id="type' + j + '"></select>';
        content += '<div class="col-sm-12" id="dvtype">';
        content += '<select class="form-control" id="ddltype' + accrdId + '_' + j + '">';
        content += '<option value="-1" selected disabled>Select Type</option>';
        content += '</select>';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group col-md-1.5">';
        content += '<label for="patientname">Patient Name</label>';
        content += '<input type="text" class="form-control" id="Patientname' + accrdId + '_' + j + '">';
        content += '</div>';
        content += '<div class="form-group col-md-1">';
        content += '<label for="age">Age</label>';
        content += '<input type="text" class="form-control" id="age' + accrdId + '_' + j + '"  onkeypress = "return DieticianReporting.isNumber(event)">';
        content += '</div>';
        content += '<div class="form-group col-md-1.5">';
        content += '<label for="gender">Gender</label>';
        // content += '<div class="col-sm-12" id="dvtype">';
        content += '<select class="form-control" id="gender' + accrdId + '_' + j + '">';
        content += '<option value="-1" selected disabled>Select Gender</option>';
        content += '<option value="male">Male</option>';
        content += '<option value="female">Female</option>';
        content += '<option value="others">Others</option>';
        content += '</select>';
        // content += '</div>';
        content += '</div>';
        content += '<div class="form-group col-md-1.5">';
        content += '<label for="pvalue">Total Prescription Value</label>';
        content += '<input type="text" class="form-control" id="pvalue' + accrdId + '_' + j + '"  onkeypress = "return DieticianReporting.isNumber(event)">';
        content += '</div>';
        content += '<div class="form-group col-md-1.5">';
        content += '<label for="notes">Notes</label>';
        content += '<textarea class="form-control" maxlength="500" class="form-control" id="notes' + accrdId + '_' + j + '" style="resize:none;"></textarea>';
        content += '</div>';
        content += '<div class="col-md-2">';
        content += '<label for="inputPassword4"></label>';
        content += '<i class="fa fa-plus" aria-hidden="true" style="margin-top:41px;" id="patplus' + accrdId + '_' + j + '" onclick="DieticianReporting.fnaddpatient(' + accrdId + ',' + j + ');"></i>';
        content += '<i class="fa fa-minus-circle" aria-hidden="true" style="margin-left:25px;" id="patminus' + accrdId + '_' + j + '" onclick="DieticianReporting.fnremovepatient(' + accrdId + ',' + j + ')"></i>';
        content += '</div>';
        content += '</div>';
        content += '</form>';
        $("#dvMainPatientdetBody" + accrdId + "").append(content);
        if (j == 1) {
            $("#patminus" + accrdId + '_' + j + "").hide();
        }
        DieticianReporting.fngetParametertype(accrdId, ActivityCode, SubActivityCode, j);

    },
    fnremovepatient: function (accrdId, rowppId) {
        debugger;
        if (rowppId != 1) {
            $('#patientgrid' + accrdId + '_' + rowppId + '').remove();
        }
        if (rowppId != 1) {
            $("#patplus" + accrdId + '_' + (rowppId - 1) + "").show();
        }
    },
    fnaddprescription: function (accrdId, rowkId) {
        //k = k + 1;
        var k = rowkId + 1;
        if (k != 1) {
            $("#preplus" + accrdId + '_' + (k - 1) + "").hide();
        }
        var content = "";
        content += '<form>';
        content += '<div class="form-row pregrid' + accrdId + '" id="prescriptiongrid' + accrdId + '_' + k + '">';
        content += '<div class="form-group col-md-3">';
        content += '<label for="sku">SKU</label>';
        content += '<div class="col-sm-12" id="dvsku' + accrdId + '_' + k + '">';
        content += '<input class="ddlsku" type="text" id="ddlsku' + accrdId + '_' + k + '" tabindex="1" onkeypress="return false;"/>';
        //content += '<select class="form-control" id="ddlsku' + k + '">';
        //content += '<option value="-1" selected disabled>Select</option>';
        content += '</select>';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="noofprescriptions">Prescription Qty</label>';
        content += '<input type="text" class="form-control" id="noofprescriptions' + accrdId + '_' + k + '"  onkeypress = "return DieticianReporting.isNumber(event)">';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="noofprescriptionsValue">Prescription Value</label>';
        content += '<input type="text" class="form-control" id="noofprescriptionsValue' + accrdId + '_' + k + '"  onkeypress = "return DieticianReporting.isNumber(event)">';
        content += '</div>';
        //content += '<div class="form-group col-md-2">';
        //content += '<label for="soldd">Sold</label>';
        //content += '<input type="text" class="form-control" id="soldd' + k + '">';
        //content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="note">Notes</label>';
        content += '<textarea class="form-control" maxlength="500" class="form-control" id="note' + accrdId + '_' + k + '" style="resize:none;"></textarea>';
        content += '</div>';
        content += '<div class="col-md-2">';
        content += '<label for="inputPassword4"></label>';
        content += '<i class="fa fa-plus" aria-hidden="true" style="margin-top:41px;" id="preplus' + accrdId + '_' + k + '" onclick="DieticianReporting.fnaddprescription(' + accrdId + ',' + k + ');"></i>';
        content += '<i class="fa fa-minus-circle" aria-hidden="true" style="margin-left:25px;" id="preminus' + accrdId + '_' + k + '" onclick="DieticianReporting.fnremoveprescription(' + accrdId + ',' + k + ');"></i>';
        content += '</div>';
        content += '</div>';
        content += '</form>';
        $("#dvMainprescriptionBody" + accrdId + "").append(content);
        if (k == 1) {
            $("#preminus" + accrdId + '_' + k + "").hide();
        }
        DieticianReporting.fngetskudetails(accrdId, k);
    },
    fnremoveprescription: function (accrdId, rowkkId) {
        debugger;
        if (rowkkId != 1) {
            $('#prescriptiongrid' + accrdId + '_' + rowkkId + '').remove();
        }
        if (rowkkId != 1) {
            $("#preplus" + accrdId + '_' + (rowkkId - 1) + "").show();
        }
    },
    //fngetPatienttype: function () {
    //    debugger;
    //    var ActivityCode = $('#ddlActivity option:selected').val();
    //    Method_params = ["DieticianReporting/GetSubActivity", 'TEO00000010', 'ATY00000001'];
    //    CoreREST.get(null, Method_params, null, DieticianReporting.fngettypeSuccessCallback, DieticianReporting.fngettypeFailureCallback);
    //},
    //fngettypeSuccessCallback: function (response) {
    //    debugger;
    //    var content = "";
    //    if (response != null && response.list.length > 0) {
    //        content += '<select class="form-control" id="ddltype">';
    //        content += '<option value="-1" selected disabled>Select Type</option>'

    //        for (var i = 0; i < response.list.length; i++) {
    //            content += '<option value="' + response.list[i].SubActivity_Code + '">' + response.list[i].SubActivity_Name + '</option>';
    //        }
    //        content += '</select>';
    //        $('#dvtype').html(content);
    //    }
    //},
    //fngettypeFailureCallback: function () {

    //},
    fngetParametertype: function (acis, ac, subactivcode, v) {
        debugger;
        ActivityCode = $('#ddlActivity' + acis + ' option:selected').val();
        SubActivityCode = $('#ddlsubActivity' + acis + ' option:selected').val();
        //Method_params = ["DieticianReporting/Getparametertype", DieticianReporting.defaults.companyCode, ActivityCode, SubActivityCode];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetParametertypeSuccessCallback, DieticianReporting.fngetParametertypeFailureCallback);
        var details = DieticianReporting.defaults.companyCode + '/' + ActivityCode + '/' + SubActivityCode;
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetdocdetailsSuccessCallback, DieticianReporting.fngetdocdetailsFailureCallback);
        RPAREST.requestInvoke("DieticianReporting/Getparametertype", details, null, "GET", DieticianReporting.fngetParametertypeSuccessCallback, DieticianReporting.fngetParametertypeFailureCallback, null);
    },
    fngetParametertypeSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddltype' + p_g + '">';
            content += '<option value="-1" selected disabled>Select Type</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Parametertype_Code + '">' + response.list[i].Parametertype_Name + '</option>';
            }
            content += '</select>';
            $('#ddltype' + p_g + '').html(content);
        }
    },
    fngetParametertypeFailureCallback: function () {

    },
    fngetprivileges: function () {
        debugger;
        Method_params = ["DieticianReporting/Getprivileges", DieticianReporting.defaults.companyCode, UserCode, UserTypeCode];
        CoreREST.get(null, Method_params, null, DieticianReporting.fngetprivilegesSuccessCallback, DieticianReporting.fngetprivilegesFailureCallback);
    },
    fngetprivilegesSuccessCallback: function (response) {
        debugger;
        privilege_g = response.list;

    },
    fngetprivilegesFailureCallback: function () {

    },
    fngetdocdetails: function (accrdId, val, rcode) {
        debugger;
        doc_g = accrdId + '_' + val;
        if (CompanyCode == "") {
            var compcode = DieticianReporting.defaults.companyCode;
        }
        else {
            var compcode = CompanyCode;
        }
        if (rcode != undefined) {
            var regcode = rcode;
        }
        else {
            var regcode = $("#ddluser" + accrdId + "").val();
        }
        //Method_params = ["DieticianReporting/GetDoctordetailsforDR", compcode, regcode];
        //RPAREST.get(null, Method_params, null, DieticianReporting.fngetdocdetailsSuccessCallback, DieticianReporting.fngetdocdetailsFailureCallback);
        // Method_params = ["DieticianReporting/Getsaleproduct", compcode, regcode];
        var details = compcode + '/' + regcode;
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetdocdetailsSuccessCallback, DieticianReporting.fngetdocdetailsFailureCallback);
        RPAREST.requestInvoke("DieticianReporting/GetDoctordetailsforDR", details, null, "GET", DieticianReporting.fngetdocdetailsSuccessCallback, DieticianReporting.fngetdocdetailsFailureCallback, null);
    },
    fngetdocdetailsSuccessCallback: function (response) {
        debugger;
        var data2 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].Customer_Code),
                        name: $.trim(response.list[i].Customer_Name)
                    };
                    data2.push(_obj);
                }
            }
            $('#dvdoctor' + doc_g + '').empty();
            $('#dvdoctor' + doc_g + '').html('<input class="txtdoc" type="text" id="ddldoctor_' + doc_g + '" tabindex="1" />');
            var Doctors = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Doctor',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                change: DieticianReporting.fngetSpeciality
            });
            Doctors.appendTo('#ddldoctor_' + doc_g + '');
        } else {
            $('#dvdoctor' + doc_g + '').empty();
            $('#dvdoctor' + doc_g + '').html('<input class="txtdoc" type="text" id="ddldoctor_' + doc_g + '" tabindex="1" />');
            var Doctors = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Doctor',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                change: DieticianReporting.fngetSpeciality()
            });
            Doctors.appendTo('#ddldoctor_' + doc_g + '');
        }
    },
    fngetdocdetailsFailureCallback: function () {

    },
    fngetSpeciality: function (args) {
        debugger;
        //  spcl_g = val;
        if (args != null) {
            var a = args.element.id;
            b = a.split('_');
        }
        var Customercode = $("select[name='ddldoctor_" + b[1] + '_' + b[2] + "']").val();
        if ($("select[name='ddldoctor_" + b[1] + '_' + b[2] + "']").val() == undefined) {
            var Customercode = 0;
        }
            // }
        else {
            var Customercode = $("select[name='ddldoctor_" + b[1] + '_' + b[2] + "']").val();
        }
        var details = DieticianReporting.defaults.companyCode + '/' + Customercode + '/' + $("#ddluser" + b[1] + "").val();
        RPAREST.requestInvoke("DieticianReporting/GetSpecialityforDR", details, null, "GET", DieticianReporting.fngetSpecialitySuccessCallback, DieticianReporting.fngetSpecialityFailureCallback, null);
        // Method_params = ["DieticianReporting/GetSpecialityforDR", DieticianReporting.defaults.companyCode, Customercode, $("#ddluser" + b[1] + "").val()];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetSpecialitySuccessCallback, DieticianReporting.fngetSpecialityFailureCallback);
    },
    fngetSpecialitySuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="Speciality' + b[1] + '_' + b[2] + '">';
            content += '<option value="-1" selected disabled>Select Speciality</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Speciality_Code + '">' + response.list[i].Speciality_Name + '</option>';
            }
            content += '</select>';
            $('#dvspeciality' + b[1] + '_' + b[2] + '').html(content);
            if ($("select[name='ddldoctor_" + b[1] + '_' + b[2] + "']").val() != null) {
                $("#Speciality" + b[1] + '_' + b[2] + "").val(response.list[0].Speciality_Code).attr('disabled', true);
            }
        }
    },
    fngetSpecialityFailureCallback: function () {

    },
    fngetAccompanist: function (aid) {
        debugger;
        AccompId = aid;
        var details = DieticianReporting.defaults.companyCode + '/' + DieticianReporting.defaults.regionCode + '/' + '0' + '/' + DieticianReporting.defaults.userCode + '/' + '0';
        RPAREST.requestInvoke("DieticianReporting/GetAccompanistdetails", details, null, "GET", DieticianReporting.fngetAccompanistSuccessCallback, DieticianReporting.fngetAccompanistFailureCallback, null);
        //Method_params = ["DieticianReporting/GetAccompanistdetails", DieticianReporting.defaults.companyCode, DieticianReporting.defaults.regionCode, '0', DieticianReporting.defaults.userCode, '0'];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetAccompanistSuccessCallback, DieticianReporting.fngetAccompanistFailureCallback);
    },
    fngetAccompanistSuccessCallback: function (response) {
        debugger;
        var data1 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].User_Code),
                        name: $.trim(response.list[i].User_Name + '-' + response.list[i].Employee_Name + '-' + response.list[i].User_Type_Name)
                    };
                    data1.push(_obj);
                }
            }
            Users_g = data1;

            $('#dvadditionalusers' + AccompId + '').empty();
            $('#dvadditionalusers' + AccompId + '').html('<input type="text" id="additionalusers' + AccompId + '" name="additionalusers' + AccompId + '" class="form-control" maxlength="" />');
            var Users = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Accompanist(s)',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('name', 'contains', e.text, true) : dropdown_query;
                    e.updateData(Users_g, dropdown_query);
                },
            });
            Users.appendTo('#additionalusers' + AccompId + '');
        } else {
            $('#dvadditionalusers' + AccompId + '').empty();
            $('#dvadditionalusers' + AccompId + '').html('<input type="text" id="additionalusers' + AccompId + '" name="additionalusers' + AccompId + '" class="form-control" maxlength="" />');
            var Users = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Accompanist(s)',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box'
            });
            Users.appendTo('#additionalusers' + AccompId + '');
        }
    },
    fngetAccompanistFailureCallback: function () {

    },
    fngetskudetails: function (accrdId, val, rcode) {
        debugger;
        sku_g = accrdId + '_' + val;
        if (CompanyCode == "") {
            var compcode = DieticianReporting.defaults.companyCode;
        }
        else {
            var compcode = CompanyCode;
        }
        if (rcode != undefined) {
            var regcode = rcode;
        }
        else {
            var regcode = $("#ddluser" + accrdId + "").val();
        }
        // Method_params = ["DieticianReporting/Getsaleproduct", compcode, regcode];
        var details = compcode + '/' + regcode;
        // CoreREST.get(null, Method_params, null, DieticianReporting.fngetskudetailsSuccessCallback, DieticianReporting.fngetskudetailsFailureCallback);
        RPAREST.requestInvoke("DieticianReporting/Getsaleproduct", details, null, "GET", DieticianReporting.fngetskudetailsSuccessCallback, DieticianReporting.fngetskudetailsFailureCallback, null);
    },
    fngetskudetailsSuccessCallback: function (response) {
        debugger;
        var data3 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].Product_Code),
                        name: $.trim(response.list[i].Product_Name)
                    };
                    data3.push(_obj);
                }
            }
            $('#dvsku' + sku_g + '').empty();
            $('#dvsku' + sku_g + '').html('<input class="ddlsku" type="text" id="ddlsku' + sku_g + '" tabindex="1" onkeypress="return false;"/>');
            var sku = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data3,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Product',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

            });
            sku.appendTo('#ddlsku' + sku_g + '');
        } else {
            $('#dvsku' + sku_g + '').empty();
            $('#dvsku' + sku_g + '').html('<input class="ddlsku" type="text" id="ddlsku' + sku_g + '" tabindex="1" onkeypress="return false;"/>');
            var sku = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data3,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Product',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

            });
            sku.appendTo('#ddlsku' + sku_g + '');
        }
        //var content = "";
        //if (response != null && response.list.length > 0) {
        //    content += '<select class="form-control" id="ddldoctor">';
        //    content += '<option value="-1" selected disabled>Select Doctor</option>'

        //    for (var i = 0; i < response.list.length; i++) {
        //        content += '<option value="' + response.list[i].Customer_Code + '">' + response.list[i].Customer_Name + '</option>';
        //    }
        //    content += '</select>';
        //    $('#dvdoctor').html(content);
        //}
        //if (resp_g != null) {
        //    if (resp_g.list.lstprescriptiondetails.length > 0) {
        //        for (var i = 0; i < resp_g.list.lstprescriptiondetails.length; i++) {
        //            var skucode = resp_g.list.lstprescriptiondetails[i].Product_Code;
        //            var msObject = document.getElementById("ddlsku" + (i + 1) + "").ej2_instances[0];
        //            msObject.value = skucode;
        //            //$("select[name='ddlsku" + (i + 1) + "']").val(response.list.lstprescriptiondetails[i].Product_Code);
        //            $("#noofprescriptions" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].No_of_Prescriptions);
        //            $("#noofprescriptionsValue" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].No_of_PrescriptionValue);
        //            $("#note" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].Notes);
        //        }
        //    }
        //}
    },
    fngetskudetailsFailureCallback: function () {

    },
    fnonloadgetSpeciality: function (accrdId, val) {
        debugger;
        spcl_g = accrdId + '_' + val;
        var Customercode = $("select[name='ddldoctor_" + spcl_g + "']").val();
        if ($("select[name='ddldoctor_" + spcl_g + "']").val() == undefined) {
            var Customercode = 0;
        }
            // }
        else {
            var Customercode = $("select[name='ddldoctor_" + spcl_g + "']").val();
        }
        var details = DieticianReporting.defaults.companyCode + '/' + Customercode + '/' + RegionCode;
        RPAREST.requestInvoke("DieticianReporting/GetSpecialityforDR", details, null, "GET", DieticianReporting.fnonloadgetSpecialitySuccessCallback, DieticianReporting.fnonloadgetSpecialityFailureCallback, null);
        //Method_params = ["DieticianReporting/GetSpecialityforDR", DieticianReporting.defaults.companyCode, Customercode, RegionCode];
        // CoreREST.get(null, Method_params, null, DieticianReporting.fnonloadgetSpecialitySuccessCallback, DieticianReporting.fnonloadgetSpecialityFailureCallback);
    },
    fnonloadgetSpecialitySuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="Speciality' + spcl_g + '">';
            content += '<option value="-1" selected disabled>Select Speciality</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Speciality_Code + '">' + response.list[i].Speciality_Name + '</option>';
            }
            content += '</select>';
            $('#dvspeciality' + spcl_g + '').html(content);
        }
    },
    fnonloadgetSpecialityFailureCallback: function () {

    },
    fnsubmit: function () {
        debugger;
        $("#submit").hide();
        var header = [];
        var headerdet = {};
        var Accompanist = [];
        var accomp = {};
        var docdetails = [];
        var doc = {};
        var patientdetails = [];
        var patient = {};
        var prescriptiondetails = [];
        var prescription = {};
        for (var a = 0; a < $(".cardcount").length; a++) {
            if ($("#ddluser" + (a + 1) + "").val() == -1) {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Please select region.',
                    button: "Ok",
                })
                return false;
            }
            if ($("#startdate" + (a + 1) + "").val() == "") {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Please select start dates.',
                    button: "Ok",
                })
                return false;
            }
            if ($("#starttime" + (a + 1) + "").val() == "") {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Please select start time.',
                    button: "Ok",
                })
                return false;
            }
            if ($("#endtime" + (a + 1) + "").val() == "") {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Please select end time.',
                    button: "Ok",
                })
                return false;
            }
            if ($("#endtime" + (a + 1) + "").val() < $("#starttime" + (a + 1) + "").val()) {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Start time should be greater than end time.',
                    button: "Ok",
                })
                return false;
            }
            if ($("#ddlsubActivity" + (a + 1) + "").val() == -1) {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Please select Sub Activity.',
                    button: "Ok",
                })
                return false;
            }
            if ($("#ddlActivity" + (a + 1) + "").val() == -1) {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Please select Sub Activity.',
                    button: "Ok",
                })
                return false;
            }
            if (header.length > 0) {
                if ((($("#ddluser" + (a + 1) + "").val() == header[a - 1].foruser && $("#ddlActivity" + (a + 1) + "").val() == header[a - 1].camptype && $("#ddlsubActivity" + (a + 1) + "").val() == header[a - 1].campsubtype))) {
                    $("#submit").show();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'You cannot select same region and same subtype twice.',
                        button: "Ok",
                    })
                    return false;
                }
            }
            if ($("#doctorcount" + (a + 1) + "").val().length > 5) {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Doctor count should not be greater than 5 digits.',
                    button: "Ok",
                })
                return false;
            }
            if ($("#patientcount" + (a + 1) + "").val().length > 5) {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Patient count should not be greater than 5 digits.',
                    button: "Ok",
                })
                return false;
            }
            if ($("#Prescription" + (a + 1) + "").val().length > 8) {
                $("#submit").show();
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Prescription count should not be greater than 8 digits.',
                    button: "Ok",
                })
                return false;
            }
            var headerdet = {
                filledby: $("#filledby" + (a + 1) + "").val(),
                foruser: $("#ddluser" + (a + 1) + "").val(),
                startdate: $("#startdate" + (a + 1) + "").val(),
                starttime: $("#starttime" + (a + 1) + "").val(),
                endtime: $("#endtime" + (a + 1) + "").val(),
                camptype: $("#ddlActivity" + (a + 1) + "").val(),
                campsubtype: $("#ddlsubActivity" + (a + 1) + "").val(),
                Location: $("#Location" + (a + 1) + "").val(),
                doctorcount: $("#doctorcount" + (a + 1) + "").val(),
                patientcount: $("#patientcount" + (a + 1) + "").val(),
                prescriptioncount: $("#Prescription" + (a + 1) + "").val()

            };
            header.push(headerdet)
            var accCode = $("select[name=additionalusers" + (a + 1) + "]").val();

            if (accCode != undefined) {
                for (var i = 0; i < accCode.length; i++) {
                    var accomp = {
                        Accompanist_Code: accCode[i],
                        Region_Code: $("#ddluser" + (a + 1) + "").val(),
                        Sub_Type: $("#ddlsubActivity" + (a + 1) + "").val()
                    };
                    Accompanist.push(accomp)
                }
            }


            for (var i = 0; i < $(".docgrid" + (a + 1) + "").length; i++) {
                if ((DoctorEntryMode_g.toUpperCase() != 'YES')) {
                    if (isNaN(parseInt($("select[name='ddldoctor_" + (a + 1) + '_' + (i + 1) + "']").val())) == true) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Please enter valid DOCTOR name.',
                            button: "Ok",
                        });
                        // swal('info', 'Info', 'Please enter valid DOCTOR name');
                        return false;
                    }
                }
                if (docdetails.length > 0) {
                    var disjson = $.grep(docdetails, function (ele, index) {
                        return ele.Doctor_Code == $("select[name='ddldoctor_" + (a + 1) + '_' + (i + 1) + "']").val();
                    });
                    if (disjson.length > 0) {
                        for (var g = 0; g < disjson.length; g++) {
                            if ($("select[name='ddldoctor_" + (a + 1) + '_' + (g + 1) + "']").val() == disjson[g].Doctor_Code) {
                                $("#submit").show();
                                swal({
                                    icon: "info",
                                    title: "Info",
                                    text: 'Same doctor name could not be entered twice.',
                                    button: "Ok",
                                });
                                return false;
                            }
                        }

                    }

                }
                if ($("#Prescription" + (a + 1) + '_' + (i + 1) + "").val() != "" && $("#Prescription" + (a + 1) + '_' + (i + 1) + "").val() != undefined) {
                    if ($("#Prescription" + (a + 1) + '_' + (i + 1) + "").val().length > 5) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Doctor Prescription should not be greater than 5 digits .',
                            button: "Ok",
                        })
                        return false;
                    }
                }
                if (isNaN(parseInt($("select[name='ddldoctor_" + (a + 1) + '_' + (i + 1) + "']").val())) == true) {
                    var Doctor_Code = null;
                }
                else {
                    var Doctor_Code = $("select[name='ddldoctor_" + (a + 1) + '_' + (i + 1) + "']").val()
                }
                doc = {
                    Doctor_Code: Doctor_Code,
                    Doctor_Name: $("#ddldoctor_" + (a + 1) + '_' + (i + 1) + "").val(),
                    Speciality_Code: $("#Speciality" + (a + 1) + '_' + (i + 1) + "").val(),
                    Prescription_Value: $("#Prescription" + (a + 1) + '_' + (i + 1) + "").val(),
                    Notes: $("#remarks" + (a + 1) + '_' + (i + 1) + "").val(),
                    Region_Code: $("#ddluser" + (a + 1) + "").val(),
                    Sub_Type: $("#ddlsubActivity" + (a + 1) + "").val(),
                };
                if ($("select[name='ddldoctor_" + (a + 1) + '_' + (i + 1) + "']").val() != null || $("select[name='ddldoctor_" + (a + 1) + '_' + (i + 1) + "']").val() != undefined || $("#Speciality" + (a + 1) + '_' + (i + 1) + "").val() != -1 || $("#Prescription" + (a + 1) + '_' + (i + 1) + "").val() != 0 || $("#remarks" + (a + 1) + '_' + (i + 1) + "").val() != "") {
                    if ($("#ddldoctor_" + (a + 1) + '_' + (i + 1) + "").is(":visible") == true) {
                        if ($("#ddldoctor_" + (a + 1) + '_' + (i + 1) + "").val() == "" && ($("#Speciality" + (a + 1) + '_' + (i + 1) + "").val() != -1 || $("#Prescription" + (a + 1) + '_' + (i + 1) + "").val() != 0 || $("#remarks" + (a + 1) + '_' + (i + 1) + "").val() != "")) {
                            $("#submit").show();
                            swal({
                                icon: "info",
                                title: "Info",
                                text: 'Please enter doctor name.',
                                button: "Ok",
                            });
                            return false;
                        }
                    }
                    if (($("select[name='ddldoctor_" + (a + 1) + '_' + (i + 1) + "']").val() != 0 || $("select[name='ddldoctor_" + (a + 1) + '_' + (i + 1) + "']").val() != null) && $("#Speciality" + (a + 1) + '_' + (i + 1) + "").val() == -1) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Please enter Speciality.',
                            button: "Ok",
                        });
                        return false;
                    }
                    else {
                        if ($("#doctorgrid" + (a + 1) + '_' + (i + 1) + "").is(":visible") == true) {
                            docdetails.push(doc);
                        }
                    }
                }
            }


            for (var i = 0; i < $(".pgrid" + (a + 1) + "").length; i++) {
                //if (patientdetails.length > 0) {
                //    var disjson = $.grep(patientdetails, function (ele, index) {
                //        return ele.Parameter_Value == $("#ddltype" + (a + 1) + '_' + (i + 1) + "").val();
                //    });
                //    if (disjson.length > 0) {
                //        for (var i = 0; i < disjson.length; i++) {
                //            //if ($("#ddltype" + (a + 1) + '_' + (i + 1) + "").val() == disjson[i].Parameter_Value) {
                //            //    $("#submit").show();
                //            //    swal({
                //            //        icon: "info",
                //            //        title: "Info",
                //            //        text: 'Same Parameter value should not be entered twice.',
                //            //        button: "Ok",
                //            //    })
                //            //    return false;
                //            //}
                //        }
                //    }

                //}
                if ($("#pvalue" + (a + 1) + '_' + (i + 1) + "").val() != "" && $("#pvalue" + (a + 1) + '_' + (i + 1) + "").val() != undefined) {
                    if ($("#pvalue" + (a + 1) + '_' + (i + 1) + "").val().length > 5) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Patient Prescription should not be greater than 5 digits .',
                            button: "Ok",
                        })
                        return false;
                    }
                }

                patient = {
                    Parameter_Value: $("#ddltype" + (a + 1) + '_' + (i + 1) + "").val(),
                    Patient_Name: $("#Patientname" + (a + 1) + '_' + (i + 1) + "").val(),
                    Age: $("#age" + (a + 1) + '_' + (i + 1) + "").val(),
                    Gender: $("#gender" + (a + 1) + '_' + (i + 1) + "").val(),
                    Total_Prescription_Value: $("#pvalue" + (a + 1) + '_' + (i + 1) + "").val(),
                    Notes: $("#notes" + (a + 1) + '_' + (i + 1) + "").val(),
                    Region_Code: $("#ddluser" + (a + 1) + "").val(),
                    Sub_Type: $("#ddlsubActivity" + (a + 1) + "").val()
                };
                if ($("#ddltype" + (a + 1) + '_' + (i + 1) + "").val() != -1 || $("#ddltype" + (a + 1) + '_' + (i + 1) + "").val() == undefined || $("#Patientname" + (a + 1) + '_' + (i + 1) + "").val() != "" || $("#age" + (a + 1) + '_' + (i + 1) + "").val() != 0 || $("#gender" + (a + 1) + '_' + (i + 1) + "").val() != -1 || $("#pvalue" + (a + 1) + '_' + (i + 1) + "").val() != "" || $("#notes" + (a + 1) + '_' + (i + 1) + "").val() != "") {
                    if ($("#ddltype" + (a + 1) + '_' + (i + 1) + "").val() != -1 && $("#Patientname" + (a + 1) + '_' + (i + 1) + "").val() == "") {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Please enter patient name .',
                            button: "Ok",
                        })
                        return false;
                    }
                    if ($("#ddltype" + (a + 1) + '_' + (i + 1) + "").val() != -1 && $("#age" + (a + 1) + '_' + (i + 1) + "").val() == "") {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Please enter Age .',
                            button: "Ok",
                        })
                        return false;
                    }
                    if ($("#ddltype" + (a + 1) + '_' + (i + 1) + "").val() != -1 && $("#gender" + (a + 1) + '_' + (i + 1) + "").val() == -1) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Please enter Gender .',
                            button: "Ok",
                        })
                        return false;
                    }
                    else if (($("#ddltype" + (a + 1) + '_' + (i + 1) + "").val() == -1 && $("#ddltype" + (a + 1) + '_' + (i + 1) + "").val() != undefined) && (($("#Patientname" + (a + 1) + '_' + (i + 1) + "").val() != "" || $("#age" + (a + 1) + '_' + (i + 1) + "").val() != 0 || $("#gender" + (a + 1) + '_' + (i + 1) + "").val() != -1 || $("#pvalue" + (a + 1) + '_' + (i + 1) + "").val() != "" || $("#notes" + (a + 1) + '_' + (i + 1) + "").val() != ""))) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Please enter parameter value.',
                            button: "Ok",
                        })
                        return false;
                    }
                    else {
                        if ($("#patientgrid" + (a + 1) + '_' + (i + 1) + "").is(":visible") == true) {
                            patientdetails.push(patient);
                        }
                    }
                }
            }


            for (var i = 0; i < $(".pregrid" + (a + 1) + "").length; i++) {
                if (prescriptiondetails.length > 0) {
                    var disjson = $.grep(prescriptiondetails, function (ele, index) {
                        return ele.Product_Code == $("select[name='ddlsku" + (a + 1) + '_' + (i + 1) + "']").val();
                    });
                    if (disjson.length > 0) {
                        for (var i = 0; i < disjson.length; i++) {
                            if ($("select[name='ddlsku" + (a + 1) + '_' + (i + 1) + "']").val() == disjson[i].Product_Code) {
                                $("#submit").show();
                                swal({
                                    icon: "info",
                                    title: "Info",
                                    text: 'Same product name cannot not be entered twice.',
                                    button: "Ok",
                                })
                                return false;
                            }
                        }
                    }

                }
                if ($("#noofprescriptions" + (a + 1) + '_' + (i + 1) + "").val() != "" && $("#noofprescriptions" + (a + 1) + '_' + (i + 1) + "").val() != undefined) {
                    if ($("#noofprescriptions" + (a + 1) + '_' + (i + 1) + "").val().length > 5) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Prescription qty should not be greater than 5 digits .',
                            button: "Ok",
                        })
                        return false;
                    }
                }
                if ($("#noofprescriptionsValue" + (a + 1) + '_' + (i + 1) + "").val() != "" && $("#noofprescriptionsValue" + (a + 1) + '_' + (i + 1) + "").val() != undefined) {
                    if ($("#noofprescriptionsValue" + (a + 1) + '_' + (i + 1) + "").val().length > 5) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Prescription value should not be greater than 5 digits .',
                            button: "Ok",
                        })
                        return false;
                    }
                }
                //if ($("select[name='ddlsku" + (a + 1) + '_' + (i + 1) + "']").val() == null) {
                //    $("#submit").show();
                //    swal({
                //        icon: "info",
                //        title: "Info",
                //        text: 'Flexi product not allowed.',
                //        button: "Ok",
                //    })
                //    return false;
                //}
                prescription = {
                    Product_Code: $("select[name='ddlsku" + (a + 1) + '_' + (i + 1) + "']").val(),
                    No_of_Prescriptions: $("#noofprescriptions" + (a + 1) + '_' + (i + 1) + "").val(),
                    No_of_PrescriptionValue: $("#noofprescriptionsValue" + (a + 1) + '_' + (i + 1) + "").val(),
                    Notes: $("#note" + (a + 1) + '_' + (i + 1) + "").val(),
                    Region_Code: $("#ddluser" + (a + 1) + "").val(),
                    Sub_Type: $("#ddlsubActivity" + (a + 1) + "").val()
                };
                if ($("select[name='ddlsku" + (a + 1) + '_' + (i + 1) + "']").val() != null || $("select[name='ddlsku" + (a + 1) + '_' + (i + 1) + "']").val() != undefined || $("#noofprescriptions" + (a + 1) + '_' + (i + 1) + "").val() != "" || $("#noofprescriptionsValue" + (a + 1) + '_' + (i + 1) + "").val() != "" || $("#note" + (a + 1) + '_' + (i + 1) + "").val() != "") {
                    if (($("select[name='ddlsku" + (a + 1) + '_' + (i + 1) + "']").val() == null && $("select[name='ddlsku" + (a + 1) + '_' + (i + 1) + "']").val() != undefined) && ($("#noofprescriptions" + (a + 1) + '_' + (i + 1) + "").val() != "" || $("#noofprescriptionsValue" + (a + 1) + '_' + (i + 1) + "").val() != "" || $("#note" + (a + 1) + '_' + (i + 1) + "").val() != "")) {
                        $("#submit").show();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Please enter Product Name.',
                            button: "Ok",
                        })
                        return false;
                    }
                    else {
                        if ($("#prescriptiongrid" + (a + 1) + '_' + (i + 1) + "").is(":visible") == true) {
                            prescriptiondetails.push(prescription);
                        }
                    }
                }
            }
        }
        var objdieticianreprting = {
            CompanyCode: DieticianReporting.defaults.companyCode,
            RegionCode: DieticianReporting.defaults.regionCode,
            UserCode: DieticianReporting.defaults.userCode,
            dcrstatus: dcrstatus,
            headerid: headerid,
            DCR_Date: dcrdate,
            header: header,
            Accompanist: Accompanist,
            docdetails: docdetails,
            patientdetails: patientdetails,
            prescriptiondetails: prescriptiondetails
        };

        Method_params = ["DieticianReporting/InsertDieticianReporting", DieticianReporting.defaults.companyCode, RegionCode, UserCode, dcrstatus, headerid, dcrdate];
        CoreREST.post(null, Method_params, objdieticianreprting, DieticianReporting.BindpostSuccessData, DieticianReporting.BindpostFailure);
    },
    BindpostSuccessData: function (response) {
        debugger;
        if (response == 'Success') {
            swal({
                icon: "success",
                title: "Success",
                text: 'Saved successfully.',
                button: "Ok",
            }).then(function () {
                $('#main').load('../HiDoctor_Activity/DCRV4Report/Index/?dcrActualDate=' + dcrdate + '&flag=' + 'A' + '&Company_Code=' + CompanyCode + '&UserCode=' + UserCode + '&RegionCode=' + RegionCode + '&CompanyId=' + 0);
            });

        }
        else {
            $("#submit").show();
            swal({
                icon: "info",
                title: "Info",
                text: response,
                button: "Ok",
            });
        }
    },
    BindpostFailure: function () {

    },
    fngetDieticianReportingdetails: function () {
        debugger;
        var details = DieticianReporting.defaults.companyCode + '/' + RegionCode + '/' + headerid;
        RPAREST.requestInvoke("DieticianReporting/GetDieticianReportingdetails", details, null, "GET", DieticianReporting.fngetDieticianReportingdetailsSuccessData, DieticianReporting.fngetDieticianReportingdetailsFailure, null);
        //Method_params = ["DieticianReporting/GetDieticianReportingdetails", DieticianReporting.defaults.companyCode, RegionCode, headerid];
        //CoreREST.get(null, Method_params, null, DieticianReporting.fngetDieticianReportingdetailsSuccessData, DieticianReporting.fngetDieticianReportingdetailsFailure);
    },
    fngetDieticianReportingdetailsSuccessData: function (response) {
        debugger;
        resp_g = response;
        if (camptype != 0) {
            if (camptype != ctype) {
                swal({
                    icon: "info",
                    title: "Info",
                    text: 'Camp type is not matched for the previous record.',
                    button: "Ok",
                }).then(function () {
                    DieticianReporting.fnclear();
                });
            }
        }

    },
    fngetDieticianReportingdetailsFailure: function () {

    },
    fnclear: function () {
        $("#ddluser").val("");
        $("#startdate").val("");
        $("#starttime").val("");
        $("#endtime").val("");
        $("#ddlsubActivity").val(-1);
        $("#doctorcount").val("");
        $("#patientcount").val("");
        $("#Prescription").val("");
        $("select[name='additionalusers']").val("");
        $("#dvMainDoctorBody").empty();
        $("#dvMainPatientdetBody").empty();
        $("#dvMainprescriptionBody").empty();
        DieticianReporting.fnadddoctor();
        DieticianReporting.fnaddpatient();
        DieticianReporting.fnaddprescription();

    },
    isNumber: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    },
    isNumberKey: function (evt, obj) {

        var charCode = (evt.which) ? evt.which : event.keyCode
        var value = obj.value;
        var dotcontains = value.indexOf(".") != -1;
        if (dotcontains)
            if (charCode == 46) return false;
        if (charCode == 46) return true;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

}