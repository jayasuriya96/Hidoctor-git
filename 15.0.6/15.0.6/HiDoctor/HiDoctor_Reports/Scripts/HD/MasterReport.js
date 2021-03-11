//Created By:Sumathi.M
//Date:8/1/2013

//BrandMaster Report
function fnGetBrandMasterrptDetails() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelThree/GetBrandMasterReportDetails',
        success: function (response) {
            if (response != "" && response != null) {
                $("#dvMasterReport").html(response);
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
}

//ProductMaster Report
function fnGetProductrptMasterDetails() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelThree/GetProductMasterReportDetails',
        success: function (response) {
            if (response != "" && response != null) {
                $("#dvMasterReport").html(response);
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
}

//---------------START-Doctor Master-----------------//
//Doctor Master Report
function fnGetDoctorMasterReport() {

    $('#dvMainMasterReport').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });

    var options = "";
    //GET OPTIONS
    if ($('#optViewInScreen').attr('checked') == "checked") {
        options = "S";
    }
    else {
        options = "E";
    }
    var regionCode = $('#hdnRegionCode').val();
    var RegionType = $('#hdnUseractivity').val();

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDoctorMasterReportDetails',
        data: "regionCode=" + regionCode + "&viewFormat=" + options + "&title=" + $("#divPageHeader").html() + "&selectedUser=" + RegionType,
        timeout: 600000,
        success: function (response) {
            if (response != "" && response != null) {
                $("#dvDoctorMasterReport").html(response);
                //$('#tblDoctoMasterMainReport').tablePagination({});
                $("#dvMainMasterReport").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvMainMasterReport").unblock();
        }
    });
}
function fnHideblock() {
    $("#dvMainMasterReport").unblock();
}
function fnGetDoctorMasterReportOpt() {

    $('#dvMainMasterReport').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    $("#docReport").submit();
    var options = "";
    //GET OPTIONS
    if ($('#optViewInScreen').attr('checked') == "checked") {
        options = "S";
    }
    else {
        options = "E";
    }
    var regionCode = $('#hdnRegionCode').val();
    var RegionType = $('#hdnUseractivity').val();
    $("#regionCode").val(regionCode);
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorMasterReportDetailsOpt',
        data: "regionCode=" + regionCode + "&viewFormat=" + options + "&title=" + $("#divPageHeader").html() + "&selectedUser=" + RegionType,
        timeout: 600000,
        success: function (response) {
            if (response != "" && response != null) {
                $("#dvDoctorMasterReport").html(response);
                //$('#tblDoctoMasterMainReport').tablePagination({});
                $("#dvMainMasterReport").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvMainMasterReport").unblock();
        }
    });
}

//---------------START-DOCTORMASTER TERRITORYWISE REPORT---//
function fnGetDoctorMaster(regionCode) {
    $("#tblGetDoctorMaster").html('');
    $("#tblGetDoctorMasterDetails").html('');
    $('#dvMainMasterReport').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    $("#tblGetCustomerMasterDetails").html('');
    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCode,
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDoctorMaster',
        success: function (response) {
            if (response != "" && response != null) {
                $("#tblGetDoctorMaster").html(response);
                $.ajax({
                    type: 'POST',
                    data: "regionCode=" + regionCode,
                    url: '../HiDoctor_Reports/ReportsLevelThree/GetDoctorMasterDetails',
                    success: function (result) {
                        if (result != "" && result != null) {
                            $("#tblGetDoctorMasterDetails").html(result);
                            $("#dvDoctorMasterTerrotoryWiseReport").overlay().load();
                            $('#btnmore').show();
                        }
                    },
                    error: function (e) {
                        fnMsgAlert('info', '', 'Error.' + e.Message);
                    }
                });
                $("#dvDoctorMasterTerrotoryWiseReport").overlay().load();
                $('#btnmore').show();
                $("#dvMainMasterReport").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvMainMasterReport").unblock();
        }
    });
}

//---------------END-DOCTORMASTER TERRITORYWISE REPORT---//

//---------------START-DOCTORMASTER DATEWISE REPORT---//
//function fnGetTree(regionCode) {
//    $('#dvMainMasterReport').block({
//        message: 'Retrieving data...',
//        css: { border: '1px solid #ddd' }
//    });
//    $.ajax({
//        type: 'POST',
//        data: "regionCode=" + regionCode,
//        url: '../HiDoctor_Reports/ReportsLevelThree/GetUserTree',
//        success: function (response) {
//            if (response != "" && response != null) {    
//                $("#tblTree").html(response);
//                $("#dvDoctorMasterDatewiseReport").overlay().load();
//                $("#dvMainMasterReport").unblock();
//            }
//        },
//        error: function (e) {
//            fnMsgAlert('info', '', 'Error.' + e.Message);
//            $("#dvMainMasterReport").unblock();
//        }
//    });
//}

//Get Count details for Doctormaster Datewise Report
function fnGetCountDetailsforUser(regionCode) {
    $('#dvMainMasterReport').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCode,
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDoctorMasterDatewiseReport',
        success: function (response) {
            if (response != "" && response != null) {
                $("#tbldoctorDatewiserpt").html(response);
                $("#dvDoctorMasterDatewiseReport").overlay().load();
                $("#dvMainMasterReport").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvMainMasterReport").unblock();
        }
    });
}

function fnclickDateWiseforStatus(val) {
    var regionCode = '';
    var createdDate = '';
    var status = '';
    regionCode = val.split('|')[0];
    createdDate = val.split('|')[1];
    status = val.split('|')[2];

    var day = createdDate.split('/')[0];
    var month = createdDate.split('/')[1];
    var year = createdDate.split('/')[2];
    var date = year + '-' + month + '-' + day;

    $('#dvMainMasterReport').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCode + "&Date=" + date + "&status=" + status,
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDoctorNamesBasedOnStatus',
        success: function (response) {
            if (response != "" && response != null) {
                $("#divcountdetailstable").html(response);
                ShowModalPopup('dvPopup');
                $("#dvMainMasterReport").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvMainMasterReport").unblock();
        }
    });
}
//---------------END-DOCTORMASTER DATEWISE REPORT---//
//To Redirect The DoctorMaster DateWise Report
function fnclickDateWise(val) {
    var regioncode = val;
    //  fnGetTree(regioncode);
    fnGetCountDetailsforUser(regioncode);
}
//To Redirect the DoctorMaster Territorywise Report
var regioncodeEdit = "";
function fnClickTerritoryWise(val) {
    var regioncode = val;
    regioncodeEdit = val;
    fnGetDoctorMaster(regioncode);
}
//To Redirect the DoctorMaster Report
function fnShowMore() {

    $("#tblGetDoctorMaster").html('');
    $("#tblGetDoctorMasterDetails").html('');
    $('#dvMainMasterReport').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "regionCode=" + regioncodeEdit,
        url: '../HiDoctor_Reports/ReportsLevelThree/GetCustomerMasterDetails',
        success: function (response) {
            if (response != "" && response != null) {

                $("#tblGetDoctorMaster").html(response);
                $('#btnmore').hide();
                $("#dvMainMasterReport").unblock();
            }
            else {
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvMainMasterReport").unblock();
        }
    });
}

function fnclicktest(val) {
    var regionCode = '';
    var doctorCode = '';
    var customerName = '';
    var mdlNo = '';
    var category = '';
    var speciality = '';
    var lastVisitedDate = '';
    regionCode = val.split('|')[0];
    doctorCode = val.split('|')[1];
    customerName = val.split('|')[2];
    mdlNo = val.split('|')[3];
    category = val.split('|')[4];
    speciality = val.split('|')[5];
    lastVisitedDate = val.split('|')[6];
    $('#dvMainMasterReport').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCode + "&doctorCode=" + doctorCode + "&customerName=" + customerName + "&mdlNo=" + mdlNo + "&category=" + category + "&speciality=" + speciality + "&lastVisitedDate=" + lastVisitedDate,
        url: '../HiDoctor_Reports/ReportsLevelThree/GenerateToolTipforDoctorMasterDetails',
        success: function (response) {
            if (response != "" && response != null) {
                $("#divcustomer").html(response);
                ShowModalPopup('dvPopupuser');
                $("#dvMainMasterReport").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvMainMasterReport").unblock();
        }
    });
}