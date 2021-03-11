var userDetails = ""; userCode = ""; usertypePrivilege_g = ""; canunApproveAnApprovedEntryOf_g = ""; canUnApproveAApprovedRecord_g = "";
var BeatPlanApproval = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        RegionCode: "",
        UserCode: "",
        SelectedRegionCode: "",
    },
    Init: function () {
        BeatPlanApproval.fnGetUserDetails();
    },
    fnGetBadgeName: function (status) {
        var badgeName = "";
        switch (status) {
            case "2":
                badgeName = "badge-primary";
                break;
            case "1":
                badgeName = "badge-success";
                break;
            case "0":
                badgeName = "badge-danger";
                break;
            default:
                badgeName = "badge-info";
                break;
        }
        return badgeName;
    },
    fnGetUserDetails: function () {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanApproval.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = BeatPlanApproval.defaults.RegionCode;
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetUserDetails', arrDetails, "POST", BeatPlanApproval.fnUserDetailsSuccessCallback, BeatPlanApproval.fnUserDetailsFailureCallback, null);
    },
    fnUserDetailsSuccessCallback: function (response) {
        debugger;
        if (response.length == 0) {

        } else {
            if (response != null && response.length > 0) {
                userCode = response[0].User_Code;
                userDetails = response;
                BeatPlanApproval.fnGetUserPrivileges(response[0].User_Code, "LOAD");
            } else {
                swal('Info', 'The selected Region is Vaccant.Please select a Region having User to Create Beat Plan Or Assign a User to the Region Selected.', 'info');
                return false;
            }
        }
    },
    fnUserDetailsFailureCallback: function (error) {

    },
    fnGetUserPrivileges: function (userCode, typeofLoad) {
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanApproval.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = BeatPlanApproval.defaults.SelectedRegionCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "userCode";
        _obj.value = userCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "userTypeCode";
        _obj.value = userDetails[0].User_Type_Code;
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetUserTypePrivileges', arrDetails, "POST", BeatPlanApproval.fnUserTypePrivilegesSuccessCallback, BeatPlanApproval.fnUserTypePrivilegesFailureCallback, null);
    },
    fnUserTypePrivilegesSuccessCallback: function (response) {
        debugger;
        usertypePrivilege_g = response;
        var canUnAppr_lcl = [];
        var canunApproveAnApprovedEntryOf = $.grep(usertypePrivilege_g, function (ele, index) {
            return ele.Privilege_Name == 'CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF';
        });
        if (canunApproveAnApprovedEntryOf.length > 0) {
            canunApproveAnApprovedEntryOf_g = canunApproveAnApprovedEntryOf[0].Privilege_Value_Name;
            if (canunApproveAnApprovedEntryOf_g.lastIndexOf(',') != -1) {
                canunApproveAnApprovedEntryOf_g = canunApproveAnApprovedEntryOf_g.split(',');
                for (var i = 0; i < canunApproveAnApprovedEntryOf_g.length; i++) {
                    var _obj = {};
                    _obj.Privilege_Value_Name = canunApproveAnApprovedEntryOf_g[i];
                    canUnAppr_lcl.push(_obj);
                }
            }
        }
        if (canunApproveAnApprovedEntryOf_g.length > 0) {
            canUnApproveAApprovedRecord_g = $.grep(canUnAppr_lcl, function (ele, index) {
                return ele.Privilege_Value_Name == "BPP"
            });
            if (canUnApproveAApprovedRecord_g.length > 0) {
                canUnApproveAApprovedRecord_g = canUnApproveAApprovedRecord_g[0].Privilege_Value_Name;

            }
        }
    },
    fnUserTypePrivilegesFailureCallback: function (error) {

    },
    fnValidateGetBeatPlanDetailsInputs: function () {
        debugger;
        var isValid = true;
        if ($('input[name="BeatPlansStatus"]:checked').length == 0) {
            swal('Info', 'Please select Status to List Beat/Patch Plan Data.', 'info');
            isValid = false;
            return isValid;
        }
        return isValid;
    },
    fnGetBeatPlanDetails: function (value) {
        debugger;
        var result = BeatPlanApproval.fnValidateGetBeatPlanDetailsInputs();
        if (result) {
            var beatStatus = "";
            beatStatus = $('input[name="BeatPlansStatus"]:checked').val() + ',';
            var arrDetails = new Array();
            var _objData = {};
            _objData.name = "companyCode";
            _objData.value = BeatPlanApproval.defaults.CompanyCode;
            arrDetails.push(_objData);

            _objData = {};
            _objData.name = "regionCode";
            _objData.value = BeatPlanApproval.defaults.SelectedRegionCode;
            arrDetails.push(_objData);


            _objData = {};
            _objData.name = "beatStatus";
            _objData.value = beatStatus;
            arrDetails.push(_objData);
            HDAjax.requestInvoke('BeatPlan', 'GetBeatPlanDetails', arrDetails, "POST", BeatPlanApproval.fnGetBeatPlanDetailsSuccessCallback, BeatPlanApproval.fnGetBeatPlanDetailsFailureCallback, null);
        }
    },
    fnGetBeatPlanDetailsSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                var badge = BeatPlanApproval.fnGetBeatBadgeByStatus(response[i].Status);
                content += '<div class="card">';
                content += '<div class="card-header p-0 text-white" style="background:#6d50de">';
                content += '<div class="row no-gutters p-2">';
                content += '<div class="col-1 col-sm-1">';
                if (response[i].Status == "2" || (response[i].Status == 1 && canUnApproveAApprovedRecord_g.length != 0 && canUnApproveAApprovedRecord_g != "" && canUnApproveAApprovedRecord_g == "BPP")) {
                    content += '<div class="custom-control custom-checkbox align-top">';
                    content += '<input type="checkbox" class="custom-control-input align-top" value="' + response[i].Beat_Code + '" name="beatforApproval" id="newcustomControlAutosizing_' + i + '">';
                    content += '<input type="hidden" class="form-control" value="' + response[i].Region_Code + '" id="hdnRegionCode_' + i + '">';
                    content += '<input type="hidden" class="form-control" value="' + response[i].Beat_Code + ',' + response[i].Weeknumber + ',' + response[i].Weekday + '" id="hdndata_' + i + '">';
                    content += '<label class="custom-control-label" for="newcustomControlAutosizing_' + i + '"></label>';
                    content += '</div>';
                } else {
                    content += '<input type="checkbox" class="custom-control-input align-top" value="' + response[i].Beat_Code + '" name="beatforApproval" id="newcustomControlAutosizing_' + i + '">';
                }
                content += '</div>';
                content += '<div class="col-10 col-sm-10 pl-2">';
                content += '<p class="mb-0 card_header_Label" style="font-size:14px;font-weight:600;">' + response[i].Beat_Name + ' </p>';
                content += '</div>';
                //if (response[i].SFC_Details_Count > 0) {
                content += '<div class="col-1 col-sm-1">';
                content += '<i class="fa fa-eye" aria-hidden="true" id="singleEdit" style="cursor: pointer;"onclick="BeatPlanApproval.fnViewBeatDetails(\'' + response[i].Beat_Code + '\',\'' + response[i].Region_Code + '\');"></i>';
                content += '</div>';
                //}
                content += '</div>';
                content += '</div>';
                content += '<ul class="list-group list-group-flush"><li class="list-group-item px-2" style="color:#ddc204">';
                content += '<li class="list-group-item">';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Category Name:</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + response[i].Work_Category_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Status:</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge ' + badge + '">' + response[i].Beat_Status + ' </span></label>';
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Week Number:</label>';
                if (response[i].Weeknumber != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge ' + badge + '">' + response[i].Weeknumber + ' </span></label>';
                }
                else {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge ' + badge + '"> - </span></label>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Week Day:</label>';
                if (response[i].Weekday != null) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge ' + badge + '">' + response[i].Weekday + ' </span></label>';
                }
                else {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge ' + badge + '"> - </span></label>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Created By:</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + response[i].Created_By + '</label>';
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Remarks:</label>';
                if (($('input[name="BeatPlansStatus"]:checked').val() == 1 && canUnApproveAApprovedRecord_g.length != 0) || $('input[name="BeatPlansStatus"]:checked').val() == 2) {
                    content += '<textarea rows="2" id="txtRemarks_' + i + '" maxLength="500" style="resize:none;width:100%"></textarea>';
                } else {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + response[i].Remarks + '</label>';
                }
                content += '</div>';
                content += '</li>';
                content += '</ul>';
                //content += ' <div clas="card-footer">';
                //content += '<div class="d-flex text-center border-top" style="background:#c9d3dc;">';
                //content += '<div class="p-2 flex-fill border-right">';
                //content += '<input type="button" id="btnApprove_' + i + '" class="btn btn-success btn-sm" value="Approve");>';
                //content += '</div>';
                //content += '<div class="p-2 flex-fill border-right">';
                //content += '<input type="button" id="btnUnApprove_' + i + '" class="btn btn-danger btn-sm" value="UnApprove">';
                //content += '</div>';
                //content += '</div>';
                content += '</div></div></div>';

            }

            if (!($('#divReport').hasClass('card-columns'))) {
                $('#divReport').addClass('card-columns');
            }


            if ($('input[name="BeatPlansStatus"]:checked').val() == 1 && canUnApproveAApprovedRecord_g.length == 0) {//&& canUnApproveAApprovedRecord_g != "") {
                $('#dvbuttons').hide();
                $('#dvSelectAll').hide();
            } else if ($('input[name="BeatPlansStatus"]:checked').val() == 1 && canUnApproveAApprovedRecord_g.length > 0) {
                $('#divApprovebtn').hide();
            }

            if ($('input[name="BeatPlansStatus"]:checked').val() == 2 || ($('input[name="BeatPlansStatus"]:checked').val() == 1 && canUnApproveAApprovedRecord_g.length != 0)) {
                if ($('input[name="BeatPlansStatus"]:checked').val() == 1 && canUnApproveAApprovedRecord_g.length != 0) {
                    $('#divApprovebtn').hide();
                    $('#dvSelectAll').show();
                } else {
                    $('#divApprovebtn').show();
                    $('#dvSelectAll').show();
                }
                $('#dvbuttons').show();
            } else {
                $('#dvbuttons').hide();
                $('#dvSelectAll').hide();
            }
        } else {
            content = '<div id="norecordAlert"><div class="alert alert-info text-center" role="alert">No Records Found.</div></div>';
            $('#dvbuttons').hide();
            $('#dvSelectAll').hide();
            $('#divReport').removeClass('card-columns');
        }
        if ($('input[name="BeatPlansStatus"]:checked').val() == 2 || ($('input[name="BeatPlansStatus"]:checked').val() == 1 && canUnApproveAApprovedRecord_g.length != 0)) {// && canUnApproveAApprovedRecord_g != "")) {
            $('#dvApprove').show();
        }
        $('#divReport').html(content);
        $('#divReport').show();
        $.unblockUI();
    },
    fnGetBeatBadgeByStatus: function (value) {
        var badgeName = "";
        debugger;
        switch (value) {
            case "2":
                badgeName = "badge-pill badge-primary";
                break;
            case "1":
                badgeName = "badge-pill badge-success";
                break;
            case "0":
                badgeName = "badge-pill badge-danger";
                break;
            default:
                badgeName = "badge-pill badge-info";
                break;
        }
        return badgeName;
    },
    fnGetBeatPlanDetailsFailureCallback: function (error) {

    },
    fnGetColorCode: function (status) {
        var style = "";
        debugger;
        switch (status) {
            case "1":
                style = "#85b385";
                break;
            case "2":
                style = "#6495ed";
                break;
            case "0":
                style = "#e55045";
                break;
            default:
                style = "#fff";
                break;
        }
        return style;
    },
    fnValidateApprovalorUnApproval: function (value) {
        debugger;
        var isValid = true;
        var text = "";
        if (value.toUpperCase() == "A") {
            text = "Approve";
        } else {
            text = "UnApprove"
        }
        if ($('input[name="beatforApproval"]:checked').length == 0) {
            swal('Info', 'Please select atleast one record to ' + text + '.', 'info');
            isValid = false;
            return isValid;
        }
        var arrDetails = new Array();
        $('input[name="beatforApproval"]:checked').map(function (e, i) {
            debugger;
            var rowId = this.id.split('_')[1];
            //var data = $("#hdndata_" + rowId).val().split(',');
            //if (arrDetails.length > 0) {
            //    for (var i = 0; i < arrDetails.length; i++) {
            //        if (arrDetails[i].Weeknumber == data[1] && arrDetails[i].Weekday == data[2]) {
            //            swal('Info','Multiple beatplans cannot have same weekday and weeknumber.', 'info');
            //            isValid = false;
            //            return isValid;
            //        }
            //    }
            //}
            //var dupdata = {
            //    Weeknumber: data[1],
            //    Weekday: data[2]
            //}
            //arrDetails.push(dupdata);
          
            var _obj = {};
            _obj.Beat_Code = $('#newcustomControlAutosizing_' + rowId).val();
            _obj.Region_Code = $('#hdnRegionCode_' + rowId).val();
            _obj.Company_Code = BeatPlanApproval.defaults.CompanyCode;
            _obj.Company_Id = BeatPlanApproval.defaults.CompanyId;
            _obj.Created_By = BeatPlanApproval.defaults.UserCode;
            if (value == "U" && ($('#txtRemarks_' + rowId).val() == "" || $('#txtRemarks_' + rowId).val() == undefined || $('#txtRemarks_' + rowId).val() == null)) {
                swal('Info', 'Please enter remarks to UnApprove the Beat/Patch Plan.', 'info');
                isValid = false;
                return isValid;
            }
            if ($('#txtRemarks_' + rowId).val() != "" && $('#txtRemarks_' + rowId).val() != undefined && $('#txtRemarks_' + rowId).val() != null) {
                if ($('#txtRemarks_' + rowId).val().length > 500) {
                    swal('Info', 'Remarks should not exceed 500 Characters.', 'info');
                    isValid = false;
                    return isValid;
                }
                var isNotHavingSplChar = BeatPlanApproval.fnValidateSpecialCharacter($('#txtRemarks_' + rowId).val());
                if (!isNotHavingSplChar) {
                    swal('Info', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) Special Character(s) are allowed in the field Remarks.', 'info');
                    isValid = false;
                    return isValid;
                }

            }
            if (!isValid) {
                return isValid;
            }
        });
        return isValid;
    },
    fnValidateSpecialCharacter: function (value) {
        var specialCharregex = new RegExp("^[a-zA-Z0-9-_.,/ ]+$");
        if (!specialCharregex.test(value)) {
            return false;
        }
        else {
            return true;
        }
    },
    fnSubmitApprovalorUnApproval: function (value) {
        debugger;
        var result = BeatPlanApproval.fnValidateApprovalorUnApproval(value);
        if (result) {
            var lstApproveorUnApproveBeat = [];
            var beatStatus = "";
            if (value == "A") {
                beatStatus = 1;
            } else {
                beatStatus = 0;
            }
            $('input[name="beatforApproval"]:checked').map(function (e, i) {
                var rowId = this.id.split('_')[1];
                var _obj = {};
                _obj.Beat_Code = $('#newcustomControlAutosizing_' + rowId).val();
                _obj.Region_Code = $('#hdnRegionCode_' + rowId).val();
                _obj.Company_Code = BeatPlanApproval.defaults.CompanyCode;
                _obj.Company_Id = BeatPlanApproval.defaults.CompanyId;
                _obj.Created_By = BeatPlanApproval.defaults.UserCode;
                _obj.Remarks = $('#txtRemarks_' + rowId).val();
                _obj.Beat_Status = beatStatus;
                lstApproveorUnApproveBeat.push(_obj);
            });

            var arrDetails = new Array();
            var _objData = {};
            _objData.name = "companyCode";
            _objData.value = BeatPlanApproval.defaults.CompanyCode;
            arrDetails.push(_objData);

            _objData = {};
            _objData.name = "regionCode";
            _objData.value = BeatPlanApproval.defaults.SelectedRegionCode;
            arrDetails.push(_objData);


            _objData = {};
            _objData.name = "objBeatData";
            _objData.value = JSON.stringify(lstApproveorUnApproveBeat);
            arrDetails.push(_objData);
            HDAjax.requestInvoke('BeatPlan', 'UpdateApproveorUnApproveBeat', arrDetails, "POST", BeatPlanApproval.fnSubmitApprovalorUnApprovalSuccesscallback, BeatPlanApproval.fnSubmitApprovalorUnApprovalfailureCallback, null);
        }
    },
    fnSubmitApprovalorUnApprovalSuccesscallback: function (response) {
        debugger;
        if (response != null) {
            if (response.Status_Message) {
                swal('Success', '' + response.Message.split(':')[1] + '', 'success');
                BeatPlanApproval.fnGetBeatPlanDetails('S');
            } else {
                swal('Error', '' + response.Message.split(':')[1] + '', 'error');
            }
        }
    },
    fnSubmitApprovalorUnApprovalfailureCallback: function () {

    },


    fnViewBeatDetails: function (beatCode, regionCode) {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanApproval.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "beatCode";
        _obj.value = beatCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "beatType";
        _obj.value = "BEAT"
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetBeatWiseDetails', arrDetails, "POST", BeatPlanApproval.fnViewBeatDetailsSuccessCallback, BeatPlanApproval.fnViewBeatDetailsFailureCallback, null);
    },
    fnViewBeatDetailsSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null) {
            if (response.lstHeader.length > 0) {
                content += '<div class="" id="data">';
                content += '<div class="card mb-3">';
                content += '<div class="card-header bg-info text-white">Beat / Patch Info</div>';
                content += '<div class="card-body">';
                content += ' <div class="row">';
                content += '<div class="col-sm-12 row">';
                content += '<div class="col-sm-6">';
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Beat Name :</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].Beat_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Category Name :</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].Work_Category_Name + '</label></div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Work Area :</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].Work_Area + '</label>';
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Week Number :</label>';
                if (response.lstHeader[0].WeekNumber != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].WeekNumber + '</label>';
                }
                else {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">-</label>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Week Day :</label>';
                if (response.lstHeader[0].Weekday!=null) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].Weekday + '</label>';
                }
                else {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">-</label>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Beat Status :</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname " id="localareaname">' + response.lstHeader[0].Beat_Status + ' </label></div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';

                if (response.lstSFC.length > 0) {
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">SFC Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="card-columns1">';
                    for (var i = 0; i < response.lstSFC.length; i++) {
                        content += '<div class="card mt-3">';
                        content += '<div class="card-body p-0">';
                        content += '<ul class="list-group list-group-flush">';
                        content += '<li class="list-group-item">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">From Place : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].From_Place + ' </label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">To Place : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].To_Place + ' </label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Travel Mode :</label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].Travel_Mode + ' </label>';
                        content += '</div>';
                        //content += '<div class="form-group row no-gutters">';
                        //content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Work Category : </label>';
                        //content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].Work_Category_Name + ' </label>';
                        //content += '</div>';
                        //content += '<div class="form-group row no-gutters">';
                        //content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Distance :</label>';
                        //content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].Distance + '(Km.)</label>';
                        //content += '</div>';
                        //content += '<div class="form-group row no-gutters">';
                        //content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Fare Amount :(expected) </label>';
                        //content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].Fare_Amount + '(Rs.) </label>';
                        //content += '</div>';
                        content += '</li>';
                        content += '</ul>';
                        content += '</div>';
                        content += '</div>';

                    }
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';



                }
                //Doctors
                if (response.lstDoctors.length > 0) {
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Tagged Doctor(s) Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="">';
                    for (var i = 0; i < response.lstDoctors.length; i++) {
                        content += '<div class="mb-2">';
                        content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">First Name :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="BeatPlanApproval.fnViewDetails(\'' + response.lstDoctors[i].Region_Code + '\',\'' + response.lstDoctors[i].Customer_Code + '\',\'' + response.lstDoctors[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstDoctors[i].First_Name + '  ' + response.lstDoctors[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Doctor Name to View Details." id="testDocPop_' + i + '"></i>';
                        content += '</div>';
                        content += '</div>';
                        //content += '<div class="p-2 flex-fill bd-highlight flex border-right">';
                        //content += '<div class="form-group row no-gutters m-0">';
                        //content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Last Name :</label>';
                        //content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstDoctors[i].Last_Name + '</label>';
                        //content += '</div></div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Speciality :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstDoctors[i].Speciality_Name + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Category :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstDoctors[i].Category_Name + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += ' <div class="p-2 flex-fill bd-highlight flex border-right col-2">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                        var badgeDetails = BeatPlanApproval.fnGetBadgeName(response.lstDoctors[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstDoctors[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-1" id="dvhideDoctbutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true"  id="ifadochide_' + i + '" onclick="BeatPlanApproval.fnHidetheDiv(\'' + i + '\',\'' + response.lstDoctors[i].Customer_Entity_Type + '\');"></i>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="col-sm-12 col-md-12 p-3" id=dvHdnDoctDetails_' + i + ' style="display:none;"></div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                }

                //Chemists
                if (response.lstChemists.length > 0) {
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Tagged Chemist(s) Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="">';
                    for (var i = 0; i < response.lstChemists.length; i++) {
                        content += '<div class="mb-2">';
                        content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">First Name :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="BeatPlanApproval.fnViewDetails(\'' + response.lstChemists[i].Region_Code + '\',\'' + response.lstChemists[i].Customer_Code + '\',\'' + response.lstChemists[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstChemists[i].First_Name + '  ' + response.lstChemists[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Chemist Name to View Details." id="testChemPop_' + i + '"></i>';
                        content += '</div>';
                        content += '</div>';
                        //content += '<div class="p-2 flex-fill bd-highlight flex border-right">';
                        //content += '<div class="form-group row no-gutters m-0">';
                        //content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Last Name :</label>';
                        //content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstDoctors[i].Last_Name + '</label>';
                        //content += '</div></div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Drug Licence Number :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstChemists[i].Drug_License_Number + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Ref Key1 :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstChemists[i].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += ' <div class="p-2 flex-fill bd-highlight flex border-right col-2">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                        var badgeDetails = BeatPlanApproval.fnGetBadgeName(response.lstChemists[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstChemists[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-1"  id="dvhideChembutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true" id="ifaChemhide_' + i + '" onclick="BeatPlanApproval.fnHidetheDiv(\'' + i + '\',\'' + response.lstChemists[i].Customer_Entity_Type + '\');"></i>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="col-sm-12 col-md-12 p-3" id=dvHdnChemDetails_' + i + ' style="display:none;"></div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                }

                //Stockists
                if (response.lstStockists.length > 0) {
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Tagged Stockist(s) Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="">';
                    for (var i = 0; i < response.lstStockists.length; i++) {
                        content += '<div class="mb-2">';
                        content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">First Name :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="BeatPlanApproval.fnViewDetails(\'' + response.lstStockists[i].Region_Code + '\',\'' + response.lstStockists[i].Customer_Code + '\',\'' + response.lstStockists[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstStockists[i].First_Name + '  ' + response.lstStockists[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Stockist Name to View Details." id="testStocksitPop_' + i + '"></i>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Drug Licence Number :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstStockists[i].Drug_License_Number + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Ref Key1 :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstStockists[i].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += ' <div class="p-2 flex-fill bd-highlight flex border-right col-2">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                        var badgeDetails = BeatPlanApproval.fnGetBadgeName(response.lstStockists[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstStockists[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-righ col-1" id="dvhideStockistbutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true" id="ifaStochide_' + i + '" onclick="BeatPlanApproval.fnHidetheDiv(\'' + i + '\',\'' + response.lstStockists[i].Customer_Entity_Type + '\');"></i>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="col-sm-12 col-md-12 p-3" id=dvHdnStocDetails_' + i + ' style="display:none;"></div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                }
                content += '</div>';
                $('#beatPopBody').html(content);
                $.blockUI();
                $('#beatModal').modal('show');
            }
        }
    },
    fnViewBeatDetailsFailureCallback: function (error) {

    },
    fnCloseBeatModal: function () {
        $('#beatModal').modal('hide');
        $.unblockUI();

    },
    fnViewDetails: function (regionCode, customerCode, customerEntityType, divId) {
        debugger;
        var bindGrid = "";
        if (divId == "-1") {
            bindGrid = "-1";
        } else {
            bindGrid = divId;
        }
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanApproval.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "customerCode";
        _obj.value = customerCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "customerEntityType";
        _obj.value = customerEntityType;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "gridId";
        _obj.value = bindGrid
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetEntityWiseDetails', arrDetails, "POST", BeatPlanApproval.fnViewDetailsSuccessCallback, BeatPlanApproval.fnViewDetailsFailureCallback, null);
    },
    fnViewDetailsSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null) {
            if (response.Customer_Entity_Type.toUpperCase() == "DOCTOR") {
                if (response.lstDoctor.length > 0) {
                    content += '<div class="" id="data">';
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Business Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="row">';
                    content += '<div class="col-sm-4">';
                    content += '<img src="' + response.lstDoctor[0].Doctor_Photo + '" style="height:150px;width :240px;">';
                    content += '</div>';
                    content += ' <div class="col-sm-8 row">';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">First Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].First_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Last Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Last_Name + '</label>';
                    content += '</div><div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Category</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Category_Name + '</label>';
                    content += '</div><div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Speciality </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Speciality_Name + ' </label>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Status </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">';
                    var badgeDetails = BeatPlanApproval.fnGetBadgeName(response.lstDoctor[0].Customer_Status);
                    content += '<span class="badge ' + badgeDetails + '">' + response.lstDoctor[0].Customer_Status_Text + '</span>';
                    content += '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">MDL Number </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].MDL_Number + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Qualification </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Qualification + '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';

                    if (response.lstAddress.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Communication Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns1">';
                        for (var i = 0; i < response.lstAddress.length; i++) {
                            content += '<div class="card">';
                            content += '<div class="card-body p-0">';
                            content += '<ul class="list-group list-group-flush">';
                            content += '<li class="list-group-item">';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address1 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address1 + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address2 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address2 + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">State :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].State_Name + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">City :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].City_Name + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Pincode : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Pincode + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Local Area : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Local_Area + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Mobile : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Mobile + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Phone : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Phone + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Fax : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Fax + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Email : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Email + '</label>';
                            content += '</div>';
                            content += '</li> ';
                            content += '</ul> ';
                            content += '</div>';
                            content += '</div>';

                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }


                    if (response.lstHospital.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Organisation Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns1">';
                        for (var i = 0; i < response.lstHospital.length; i++) {
                            content += '<div class="card">';
                            content += '<div class="card-body p-0">';
                            content += '<ul class="list-group list-group-flush">';
                            content += '<li class="list-group-item">';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Hospital Name : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHospital[i].Hospital_Name + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Hospital Classification Name : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHospital[i].Hospital_Classification_Name + ' </label>';
                            content += '</div>';
                            content += '</li> ';
                            content += '</ul> ';
                            content += '</div>';
                            content += '</div>';

                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }

                    if (response.lstDoctor.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Personal Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="d-flex">';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">DOB : </label>';
                        if (response.lstDoctor[0].DOB != "01/01/1900") {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].DOB + '</label>';

                        } else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">-</label>';

                        }
                        content += '</div>';
                        content += '</div><div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Anniversary Date : </label>';
                        if (response.lstDoctor[0].Anniversary_Date != "01/01/1900") {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Anniversary_Date + '</label>';

                        } else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">-</label>';
                        }
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">RegistrationNo : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Registration_No + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Gender : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Gender + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';



                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Other Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="d-flex">';

                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key1 : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';

                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key2 : </label>';
                        content += ' <label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Ref_Key2 + ' </label>';
                        content += '</div>';
                        content += '</div>';

                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                }

                if (response.GridId == "-1") {
                    $('#EntityPopBody').html(content);
                    $.blockUI();
                    $('#EntityModal').modal('show');
                    $('#spanEntity').html('Doctor');
                }
                else {
                    $('#dvHdnDoctDetails_' + response.GridId).html(content);
                    $('#dvHdnDoctDetails_' + response.GridId).show();
                    $('#dvhideDoctbutton_' + response.GridId).show();
                    $('#ifadochide_' + response.GridId).show();
                }
            }
            else if (response.Customer_Entity_Type.toUpperCase() == "CHEMIST") {
                if (response.lstChemist.length > 0) {
                    content += '<div class="" id="data">';
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Business Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="row">';
                    content += ' <div class="col-sm-12 row">';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">First Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].First_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Last Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Last_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Drug Licence Number1 :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Drug_License_Number1 + '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Drug Licence Number2 :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Drug_License_Number2 + ' </label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Status </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">';
                    var badgeDetails = BeatPlanApproval.fnGetBadgeName(response.lstChemist[0].Customer_Status);
                    content += '<span class="badge ' + badgeDetails + '">' + response.lstChemist[0].Customer_Status_Text + '</span>';
                    content += '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';

                    if (response.lstAddress.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Communication Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns1">';
                        for (var i = 0; i < response.lstAddress.length; i++) {
                            content += '<div class="card">';
                            content += '<div class="card-body p-0">';
                            content += '<ul class="list-group list-group-flush">';
                            content += '<li class="list-group-item">';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address1 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address1 + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address2 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address2 + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">State :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].State_Name + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">City :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].City_Name + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Pincode : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Pincode + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Local Area : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Local_Area + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Mobile : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Mobile + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Phone : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Phone + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Fax : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Fax + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Email : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Email + '</label>';
                            content += '</div>';
                            content += '</li> ';
                            content += '</ul> ';
                            content += '</div>';
                            content += '</div>';

                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';

                    }
                    if (response.lstChemist.length > 0) {

                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Other Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="d-flex">';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key1 : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key2 : </label>';
                        content += ' <label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Ref_Key2 + ' </label>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                }

                if (response.GridId == "-1") {
                    $('#EntityPopBody').html(content);
                    $.blockUI();
                    $('#EntityModal').modal('show');
                    $('#spanEntity').html('Chemist');
                } else {
                    $('#dvHdnChemDetails_' + response.GridId).html(content);
                    $('#dvHdnChemDetails_' + response.GridId).show();
                    $('#dvhideChembutton_' + response.GridId).show();
                    $('#ifaChemhide_' + response.GridId).show();
                }
            }
            else if (response.Customer_Entity_Type.toUpperCase() == "STOCKIEST") {
                if (response.lstStockist.length > 0) {
                    content += '<div class="" id="data">';
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Business Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="row">';
                    content += ' <div class="col-sm-12 row">';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">First Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].First_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Last Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Last_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Drug Licence Number1 :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Drug_License_Number1 + '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Drug Licence Number2 :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Drug_License_Number2 + ' </label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Status </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">';
                    var badgeDetails = BeatPlanApproval.fnGetBadgeName(response.lstStockist[0].Customer_Status);
                    content += '<span class="badge ' + badgeDetails + '">' + response.lstStockist[0].Customer_Status_Text + '</span>';
                    content += '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';

                    if (response.lstAddress.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Communication Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns1">';
                        for (var i = 0; i < response.lstAddress.length; i++) {
                            content += '<div class="card">';
                            content += '<div class="card-body p-0">';
                            content += '<ul class="list-group list-group-flush">';
                            content += '<li class="list-group-item">';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address1 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address1 + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address2 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address2 + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">State :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].State_Name + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">City :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].City_Name + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Pincode : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Pincode + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Local Area : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Local_Area + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Mobile : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Mobile + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Phone : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Phone + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Fax : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Fax + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Email : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Email + '</label>';
                            content += '</div>';
                            content += '</li> ';
                            content += '</ul> ';
                            content += '</div>';
                            content += '</div>';

                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';

                    }
                    if (response.lstStockist.length > 0) {

                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Other Info</div>';
                        content += '<div class="card-body">';

                        content += '<div class="d-flex">';

                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key1 : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';

                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key2 : </label>';
                        content += ' <label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Ref_Key2 + ' </label>';
                        content += '</div>';
                        content += '</div>';

                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                }

                if (response.GridId == "-1") {
                    $('#EntityPopBody').html(content);
                    $.blockUI();
                    $('#EntityModal').modal('show');
                    $('#spanEntity').html('Stockist');
                } else {
                    $('#dvHdnStocDetails_' + response.GridId).html(content);
                    $('#dvHdnStocDetails_' + response.GridId).show();
                    $('#dvhideStockistbutton_' + response.GridId).show();
                    $('#ifaStochide_' + response.GridId).show();
                }
            }
        }
    },
    fnViewBeatDetailsFailureCallback: function (error) {
        debugger;
    },
    fnCloseEntityModal: function () {
        debugger;
        $.unblockUI();
        $('#EntityModal').modal('hide');
    },

    fnHidetheDiv: function (griId, customerEntityType) {
        debugger;
        if (customerEntityType.toUpperCase() == "DOCTOR") {
            $('#dvHdnDoctDetails_' + griId).hide();
            $('#ifadochide_' + griId).hide();
            $('#dvhideDoctbutton_' + response.GridId).hide();
        } else if (customerEntityType.toUpperCase() == "CHEMIST") {
            $('#dvHdnChemDetails_' + griId).hide();
            $('#ifaChemhide_' + griId).hide();
            $('#dvhideChembutton_' + response.GridId).hide();
        } else if (customerEntityType = "STOCKIEST") {
            $('#dvHdnStocDetails_' + griId).hide();
            $('#ifaStochide_' + griId).hide();
            $('#dvhideStockistbutton_' + response.GridId).hide();
        }
    }
}