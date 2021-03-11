
var FWADetailsJson_g = "";

//function to get the login user code under user types



function fnGetUnderUserTypes() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetUnderUserType',
        data: "A",
        success: function (jsData) {
            if (jsData != "") {
                jsData = eval('(' + jsData + ')');
                //To remove all the options
                var select = $('#drpUserType');
                $('option', select).remove();
                $('#drpUserType').append("<option value='0'>-Select user type-</option>");
                for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                    $('#drpUserType').append("<option value='" + jsData.Tables[0].Rows[j].User_Type_Code + "'>" + jsData.Tables[0].Rows[j].User_Type_Name + "</option>");
                }
            }
        }
    });
}
//function to disable team / self
function fnGetUnderUserTypeCount() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetUnderUserTypeCount',
        data: "userTypeCode=" + $('#drpUserType').val() + "",
        success: function (count) {
            if (count == 0) {
                $("input[name=mode][value=1]").attr('checked', 'checked');
                $('input[type=radio][name=mode]').prop('disabled', true);
            }
            else {
                $('input[type=radio][name=mode]').prop('disabled', false);
            }
        }
    });
}


function fnGetFWAnanlysisDetails() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select The Month');
        return false;
    }
    if ($("#drpUserType").val() == "0") {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select The UserType Name .');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    $("#dvFWAnalysisReport").html('');
    var userTypeCode = $('#drpUserType').val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetFWAnanlysisDetails',
        data: "userTypeCode=" + userTypeCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (tableContent) {
            $("#dvFWAnalysisReport").html(tableContent);
            $("#MaindivPrint").html($("#FWAMainreport").html());

            //enabling datatable
            if ($.fn.dataTable) {
                var oTable = $('#tblFWAReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };

            fninializePrint("MaindivPrint", "MainifrmPrint", "FWAMainreport");
            $.unblockUI();
        },
        error: function (jsData) {
            $.unblockUI();
        },
        complete: function (jsData) {
            $.unblockUI();
        }
    });
}
function fnBindUserDetails(rowIndex) {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select The Month');
        return false;
    }
    if ($("#drpUserType").val() == "0") {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select The UserType Name .');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#dvFWAnalysisReport").html('');

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetChildUserDetails',
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "",
        success: function (tableContent) {
            $("#dvFWAnalysisReport").html(tableContent);

            $("#MaindivPrint").html($("#FWAMainreport").html());
            //enabling datatable
            if ($.fn.dataTable) {
                $('#tblFWAReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };

            fninializePrint("MaindivPrint", "MainifrmPrint", "FWAMainreport");

            $.unblockUI();
        },
        error: function (jsData) {
            $.unblockUI();
        },
        complete: function (jsData) {
            $.unblockUI();
        }
    });
}

//function to bind the FwAdayworked analysis report//
function fnGetFWADayWorkedAnalysis(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    //to remove and rebind the table
    $("#dv_FieldWorkAnalysis_DayAnalysis").remove('');
    $('#tbl_FieldWorkAnalysis_DayAnalysis_wrapper').remove()

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetDaysWorkeddDtails',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");

            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DaysWorkeddivPrint").html($("#daysWorked").html());
            if ($.fn.dataTable) {
                $('#tbl_FieldWorkAnalysis_DayAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DaysWorkeddivPrint", "DaysWorkedfrmPrint", "daysWorked");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Sub Report Doctor CAll Analysis bindind//
function fnGetFWADoctorCallAnalysis(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#spnDocCallAnalyHeader").remove()
    $('#tbl_FWADoctorCallAnanlysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/FWGetDoctorCallAnalysisdetails',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");
            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DrcallAnalysisdivPrint").html($("#DrCallanalysis").html());
            if ($.fn.dataTable) {
                $('#tbl_FWADoctorCallAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrcallAnalysisdivPrint", "DrcallAnalysisfrmPrint", "DrCallanalysis");
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

//Field Work Chemist met Analysis report//
function fnGetChemistCallAnalysis(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#spnChemistHeader").remove()
    $('#tbl_ChemistMetAnalysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/FWGetChemistCallAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");
            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DrchemistdivPrint").html($("#ChemistMetAnalysis").html());
            if ($.fn.dataTable) {
                $('#tbl_ChemistMetAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrchemistdivPrint", "DrchemistfrmPrint", "ChemistMetAnalysis");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Doctor visit frequency analysis report
function fnGetFWADoctorVisitsFrequencyAnalysisReport(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#spndoctorVisitfreqHeader").remove();
    $('#tbl_FWADoctorvisitAnanlysis_wrapper').remove();
    $("#colonmDefini").remove();

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/FWGetVisitsFrequencyAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");
            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DrvisitdivPrint").html($("#DoctorVisitsFrequncy").html());
            if ($.fn.dataTable) {
                $('#tbl_FWADoctorvisitAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrvisitdivPrint", "DrvisitfrmPrint", "DoctorVisitsFrequncy");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

//Doctor Call Analysis Popupstart//
function fntotalApprovedDoctorspopup(val, obj) {
    $.blockUI();
    var id = obj.id;

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetDoctorDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&category=" + val.split('_')[1] + "&month=" + val.split('_')[2] + "&year=" + val.split('_')[3],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);
            $("#DrdetailPopupdivPrint").html($("#DrdetailPopup").html());
            $("#dvOverlay").overlay().load();

            //if ($.fn.dataTable) {
            //    $('#tbl_ApprovedDoctorDetails').dataTable({
            //        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
            //    });
            //};
            $("#DrdetailPopup").html(response);
            fninializePrint("DrdetailPopupdivPrint", "DrdetailPopupfrmPrint", "DrdetailPopup");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
function fntotallistedDrs(val, obj) {
    $.blockUI();
    var id = obj.id;

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetlistedDoctorDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&category=" + val.split('_')[1] + "&month=" + val.split('_')[2] + "&year=" + val.split('_')[3],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);
            $("#listedDrPopupdivPrint").html($("#dvlistedDrpopup").html());
            //$("#modal").show();
            $("#dvOverlay").overlay().load();
            if ($.fn.dataTable) {
                $('#tbl_ApprovedDoctorDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("listedDrPopupdivPrint", "listedDrPopupfrmPrint", "dvlistedDrpopup");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Frquency PopUp
function fnFrequencyPopUp(val, obj) {
    $.blockUI();
    var id = obj.id;

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetlistedDrFreqAchievedPop',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&category=" + val.split('_')[1] + "&month=" + val.split('_')[2] + "&year=" + val.split('_')[3] + "&CategoryName=" + val.split('_')[4],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);

            $("#dvOverlay").overlay().load();
            $("#DrFreqPopupdivPrint").html($("#dvDrFreqpopup").html());
            //if ($.fn.dataTable) {
            //    $('#tbl_drFreqAchieved').dataTable({
            //        "bPaginate": false, "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
            //    }).rowGrouping({ bExpandableGrouping: true, iGroupingColumnIndex: 7 });
            //};
            $("#dvDrFreqpopup").html(response);
            fninializePrint("DrFreqPopupdivPrint", "DrFreqpopupfrmPrint", "dvDrFreqpopup");


        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnChemistPopup(val) {
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetChemistDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&month=" + val.split('_')[1] + "&year=" + val.split('_')[2] + "&entity=" + val.split('_')[3] + "&mode=" + val.split('_')[5],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);
            $("#chemistdivPrint").html($("#dvChemistpopup").html());
            HideModalPopup("dvloading");
            $("#modal").show();
            if ($.fn.dataTable) {
                $('#tbl_ChemistDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };

            fninializePrint("chemistdivPrint", "chemistfrmPrint", "dvChemistpopup");
            $("#dvOverlay").overlay().load();
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


//stockiest//

function fnstockiestPopup(val) {
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetStockiestDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&month=" + val.split('_')[1] + "&year=" + val.split('_')[2] + "&entity=" + val.split('_')[3] + "&mode=" + val.split('_')[5],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);
            $("#stockiestdivPrint").html($("#dvStockiestpopup").html());
            $("#modal").show();
            if ($.fn.dataTable) {
                $('#tbl_stockDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("stockiestdivPrint", "stockiestfrmPrint", "dvStockiestpopup");
            $("#dvOverlay").overlay().load();
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnindependentPopup(val) {
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetIndependentdrsDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&month=" + val.split('_')[1] + "&year=" + val.split('_')[2] + "&entity=" + val.split('_')[3] + "&mode=" + val.split('_')[5],
        success: function (response) {
            var header = val.split('_')[4];
            $("#popheader").html(header);

            $("#divModel").html(response);

            $("#dvOverlay").overlay().load();
            $("#independentDrdivPrint").html($("#independentDr").html());
            if ($.fn.dataTable) {
                $('#tbl_independentDr').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("independentDrdivPrint", "independentDrfrmPrint", "independentDr");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Doctor Call Analysis Popup End//

//%days worked pop up started here
function fnDayanalysis(val) {
    $.blockUI();
    var userCode = val.split("~")[0];
    var month = val.split("~")[1];
    var year = val.split("~")[2];
    var reportType = val.split("~")[3];
    var rowIndex = val.split("~")[4];

    var userName = $("#tdUserName_" + rowIndex).html();
    var userTypeName = $("#tdUserTypeName_" + rowIndex).html();
    var regionName = $("#tdRegionName_" + rowIndex).html();

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetDaywiseAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&reportType=" + reportType + "",
        success: function (response) {

            $("#divModel").html(response);

            if (reportType == "FIELD_DAYS") {
                if ($.fn.dataTable) {
                    $('#FIELD_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Field Work Days Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "NONFIELD_DAYS") {
                if ($.fn.dataTable) {
                    $('#NONFIELD_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Non-Field Work Days Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "LEAVE") {
                if ($.fn.dataTable) {
                    $('#LEAVE').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Leave Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "HOLIDAY") {
                if ($.fn.dataTable) {
                    $('#HOLIDAY').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                if ($.fn.dataTable) {
                    $('#HOLIDAY_WORKED').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Holiday Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "WEEKEND") {
                if ($.fn.dataTable) {
                    $('#WEEKEND').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };
                if ($.fn.dataTable) {
                    $('#WEEKEND_WORKED').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };
                $("#popheader").html("Weekend Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "NO_REPORT_DAYS") {
                if ($.fn.dataTable) {
                    $('#NO_REPORT_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("No reporting days details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "NOT_AVAIL_DAYS") {
                if ($.fn.dataTable) {
                    $('#NOT_AVAIL_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Not Available Days details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "STANDARED_WORK_DAYS") {
                if ($.fn.dataTable) {
                    $('#STANDARED_WORK_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Standared Work Days - details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "AVAIL_FIELD_DAYS") {
                if ($.fn.dataTable) {
                    $('#AVAIL_FIELD_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Available field days of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }

            //$("#modal").show();
            $("#dvOverlay").overlay().load();
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//joint work report start//
function fnGetFWAJointFieldWorkAnalysisReport(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#dvJointWorkHeader").remove();
    $('#tbl_FWAjointWorkAnanlysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/FWGetJointWorkAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");
            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DrjointdivPrint").html($("#JointFieldreport").html());
            if ($.fn.dataTable) {
                $('#tbl_FWAjointWorkAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrjointdivPrint", "DrjointfrmPrint", "JointFieldreport");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//joint work

//For Print
function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId, mainDiv) {
    // $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}


//Added Srisudhan//
//SubReport Fot //

//Radoi button Enable/Disable

function fnGetUnderChildUserCount() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/FWAnalysis/GetUnderChildUserCount',
        data: "userCode=" + $("#hdnUserCode").val() + "",
        success: function (count) {
            if (count == 1) {
                $("input[name=mode][value=1]").attr('checked', 'checked');
                $('input[type=radio][name=mode]').prop('disabled', true);
            }
            else {
                $('input[type=radio][name=mode]').prop('disabled', false);
            }
        }
    });
}

//DayWorked Analysis Report//


function fnGetDayWorkedAnalysiscals() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'DaysWorkedAnalysis Report', 'Please Select The Month');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'DaysWorkedAnalysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    var userCode = $("#hdnUserCode").val()
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];


    //to remove and rebind the table
    $("#dv_FieldWorkAnalysis_DayAnalysis").remove('');
    $('#tbl_FieldWorkAnalysis_DayAnalysis_wrapper').remove()

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/GetDaysWorkeddDtails',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#daysWorked").append("<div style='clear:both'></div><br />");

            $("#daysWorked").append(response.split('*')[0]);
            $("#daysWorked").append("<br />");
            $("#daysWorked").append(response.split('*')[1]);
            $("#DaysWorkeddivPrint").html($("#daysWorked").html());
            if ($.fn.dataTable) {
                $('#tbl_FieldWorkAnalysis_DayAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DaysWorkeddivPrint", "DaysWorkedfrmPrint", "daysWorked");

            $.unblockUI();
        },

        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Sub report Doctor Call Analysis //
function fnGetDoctorCallAnalysiscals() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Doctor Call Analysis Report', 'Please Select The Month');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'Doctor Call Analysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    var userCode = $("#hdnUserCode").val()
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];

    $("#spnDocCallAnalyHeader").remove()
    $('#tbl_FWADoctorCallAnanlysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/FWGetDoctorCallAnalysisdetails',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvdoctorcall").append("<div style='clear:both'></div><br />");
            $("#dvdoctorcall").append(response.split('*')[0]);
            $("#dvdoctorcall").append("<br />");
            $("#dvdoctorcall").append(response.split('*')[1]);
            $("#DrcallAnalysisdivPrint").html($("#dvdoctorcall").html());
            if ($.fn.dataTable) {
                $('#tbl_FWADoctorCallAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrcallAnalysisdivPrint", "DrcallAnalysisfrmPrint", "DrCallanalysis");
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}


//Sub report JointWorkAnalysiscals //

function fnGetJointWorkAnalysiscals() {

    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Joint Work Analysis Report', 'Please Select The Month');
        return false;
    }
    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'Joint Work Analysis Report', 'Please Select the Mode type .');
        return false;
    }
    $.blockUI();
    var userCode = $("#hdnUserCode").val()
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];

    $("#dvJointWorkHeader").remove();
    $('#tbl_FWAjointWorkAnanlysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/FWGetJointWorkAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#jointWorked").append("<div style='clear:both'></div><br />");
            $("#jointWorked").append(response.split('*')[0]);
            $("#jointWorked").append("<br />");
            $("#jointWorked").append(response.split('*')[1]);
            $("#DrjointdivPrint").html($("#jointWorked").html());
            if ($.fn.dataTable) {
                $('#tbl_FWAjointWorkAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrjointdivPrint", "DrjointfrmPrint", "JointFieldreport");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Sub report chemist met analysis//


function fnGetChemistAnalysiscals() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Chemist Met Analysis Report', 'Please Select The Month');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'Chemist Met Analysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    var userCode = $("#hdnUserCode").val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];

    $("#spnChemistHeader").remove()
    $('#tbl_ChemistMetAnalysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/FWGetChemistCallAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvchemistmet").append("<div style='clear:both'></div><br />");
            $("#dvchemistmet").append(response.split('*')[0]);
            $("#dvchemistmet").append("<br />");
            $("#dvchemistmet").append(response.split('*')[1]);
            $("#DrchemistdivPrint").html($("#dvchemistmet").html());
            if ($.fn.dataTable) {
                $('#tbl_ChemistMetAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrchemistdivPrint", "DrchemistfrmPrint", "ChemistMetAnalysis");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


//Sub Drfrequency report


function fnGetDrvisitFrequencyAnalysiscals() {

    $('#tree').hide();
    $("#spnTreeToggle").html('Show Tree');
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');

    //Hide all divs   
    $("#aExpandCollapse").html("Collapse All");
    $("#aExpandCollapse").html("Collapse All");
    // $("#divuserperday").hide();
    $("#dvDrvisitfrequency").hide();
    // $("#dvPrint").hide();

    //Clear All the Fields
    // $("#dvUserPerDayCont").empty();
    $("#dvDrvisitfrequency").html('');
    $("#dvPrint").empty();

    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Dr Visit Frequency Analysis Report', 'Please Select The Month');
        return false;
    }
    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'Dr Visit Frequency Analysis Report', 'Please Select the Mode type .');
        return false;
    }
    $.blockUI();

    var userCode = $("#hdnUserCode").val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];

    $("#spndoctorVisitfreqHeader").remove();
    $('#tbl_FWADoctorvisitAnanlysis_wrapper').remove();
    $("#colonmDefini").remove();
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $("#dvTree").hide();
    $("#spnTreeToggle").html('Show Tree');
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        url: '../HiDoctor_Reports/DoctorVisitFACalciArchiveReport/ProcessDoctorVisitsFACalciReport',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
            fnGetAsynReportstatus('DoctorVisitsFACalciReport');
            if ($.fn.dataTable) {
                $('#tbl_FWADoctorvisitAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                });
            };
            //fninializePrint("DrvisitdivPrint", "DrvisitfrmPrint", "DoctorVisitsFrequncy");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

