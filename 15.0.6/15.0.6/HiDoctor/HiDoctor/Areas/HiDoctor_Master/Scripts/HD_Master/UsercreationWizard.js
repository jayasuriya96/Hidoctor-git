///Created By:Sumathi
//Date:3/12/2014
var EmployeeDetails = '';
var UserDetails = '';
var Json_UserTypeBydivision = '';
//Global variable
var btnclick = false;
var Usercode = '';
var min_max_config_global = "";
var DOJ_gl = "";
var oldDetails = '';
var checkedall = '';
var Json_Divisions = '';
var effect = '0';
var Json_UserName = '';


var ExpenseGroupMapping = "Expense Group";
var KI_DisableUser = {
    CompanyCode: "",
    DisabledUsers: [],
    UnderUsers: [],
}; // object for Kangle Integration Api Region Disable.


//------------------START - HOME PAGE FOR NEW USER CREATION------------------//
$("#dvquitPopup").dialog({
    autoOpen: false,
    buttons: [
    {
        text: "Yes",
        "class": 'addButtonClass',
        click: function () {
            debugger;
            $('.blurbg').hide();
            $(this).dialog("close");
            fnLoadBody('Dashboard/AdminDashboard', this, 'Home');
            // $('#main').load('../Home/Home');
        }
    },
    {
        text: "No",
        "class": 'addButtonClass',
        click: function () {
            $('.blurbg').hide();
            $(this).dialog("close");
        }
    }
    ],
    hide: "puff",
    show: "slide",
    height: 250
});


//Redirect the UserType Master
function fnUserTypeMaster() {
    $("#divPageHeader").html('User Type Master')
    $('#main').load('HiDoctor_Master/UserTypeMaster/UserType');
}

//Redirect the Rgion Master
function fnRegionMaster() {
    $("#divPageHeader").html('Region Master')
    $('#main').load('HiDoctor_Master/Organogram/Create');
}
//Redirect the Project Master
function fnProjectMaster() {
    $("#divPageHeader").html('Project Master')
    $('#main').load('HiDoctor_Master/ProjectMaster/Create');
}

//Redirect the Division Master
function fnDivisionMaster() {
    $("#divPageHeader").html('Division Master')
    $('#main').load('HiDoctor_Master/Division/Index');
}
//Used to Quit the wizard
function fnQuit() {
    debugger;
    $('.blurbg').show();
    $('#dvUsercreationwizard').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    $("#dvquitPopup").dialog("open");
    $("#dvUsercreationwizard").unblock();
}
//Redirect the New User Page
function fnCreateNewUser(id) {
    debugger;
    $.blockUI();
    if (id == '1') {
        $('#main').load('HiDoctor_Master/UsercreationWizard/CreateUserWizard?id=1');
    }
    else {
        $('#main').load('HiDoctor_Master/UsercreationWizard/CreateUserWizard?id=0');
    }
    $.unblockUI();
}
//Redirect the Disable Page
function fnDiableUser() {
    $('#main').load('HiDoctor_Master/UsercreationWizard/DisableUser');
}
function fnUserhierarchy() {
    $('#main').load('HiDoctor_Master/UsercreationWizard/UserHierarchy?id=1');
}
//------------------END - HOME PAGE FOR NEW USER CREATION------------------//

//------------------START - REGULAR EXPRESSION TO VALIDATE ------------------------------------//
function fnValidateMobileNumber(obj, device) {
    if ($.trim($(obj).val()) != '') {
        if (device.toUpperCase() == "MOBILE") {
            ////+919840011514 , 919840011514,9840011514
            //var mobilePattern = /^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}9[0-9](\s){0,1}(\-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$/;
            //return mobilePattern.test($.trim($(obj).val()));
            var phoneNumberPattern = /^\d+$/
            return phoneNumberPattern.test($.trim($(obj).val()));
        }
        else {
            var phoneNumberPattern = /^\d+$/
            return phoneNumberPattern.test($.trim($(obj).val()));
        }


    }
    return true;
}

function regExforAlphaNumericEmployee(value) {
    var specialCharregex = new RegExp("^[a-zA-Z0-9]+$");
    // var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
    if (!specialCharregex.test(value)) {
        return false;
    }
    else {
        return true;
    }
}
//----------------END - REGULAR EXPRESSION TO VALIDATE-----------------------------------//

//------------------START - EMPLOYEE DETAILS-------------------------------//
$(".dcrConsTabHeader").click(function () {
    fnExpandandCollapse(this);
});

function fnExpandandCollapse(obj) {
    if ($(obj).hasClass("dcrconscollapse")) {
        $(obj).removeClass('dcrconscollapse');
        $(obj).addClass('dcrconsexpand');
        $(obj).next('div.table-responsive').slideDown();
        $('#tblmorefield').show();
    }
    else {
        $(obj).removeClass('dcrconsexpand');
        $(obj).addClass('dcrconscollapse');
        $(obj).next('div.table-responsive').slideUp();
        $('#tblmorefield').hide();
    }
}
//Used to Get Unassigned Employee

function fnValidateRegionAutoFill(Id) {
    debugger;
    var EmployeeName = $('#' + Id.id).val();
    if (EmployeeName != "" && EmployeeDetails.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < EmployeeDetails.length; o++) {
            if (EmployeeDetails[o].label == EmployeeName) {
                i = true;
                s = EmployeeDetails[o].value;
            }
        }
        if (!i) {
            $("#hdnEmployeeCode").val(0);
        }
        else {
            $("#hdnEmployeeCode").val(s);
        }
    } else {
        $("#hdnEmployeeCode").val(0);
    }
}



//Used to get User Types

function fnValidateDesignationAutoFill(Id) {
    debugger;
    var UserTypeName = $('#' + Id.id).val();
    if (UserTypeName != "" && Usertypedetails.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < Usertypedetails.length; o++) {
            if (Usertypedetails[o].label == UserTypeName) {
                i = true;
                s = Usertypedetails[o].value;
            }
        }
        if (!i) {
            $("#hdnUserTypeCode").val(0);
        }
        else {
            $("#hdnUserTypeCode").val(s);
        }
    } else {
        $("#hdnUserTypeCode").val(0);
    }
}


function fnValidateReportingRegionAutoFill(Id) {
    debugger;
    var RepManagerName = $('#' + Id.id).val();
    if (RepManagerName != "" && Usertypedetails.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < Usertypedetails.length; o++) {
            if (Usertypedetails[o].label == RepManagerName) {
                i = true;
                s = Usertypedetails[o].value;
            }
        }
        if (!i) {
            $("#hdnReportingtoManagerCode").val(0);
        }
        else {
            $("#hdnReportingtoManagerCode").val(s);
        }
    } else {
        $("#hdnReportingtoManagerCode").val(0);
    }
}

function fnValidateUserRegionAutoFill(Id) {
    debugger;
    var UserRegion = $('#' + Id.id).val();
    if (UserRegion != "" && regiondetails.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < regiondetails.length; o++) {
            if (regiondetails[o].label == UserRegion) {
                i = true;
                s = regiondetails[o].value;
            }
        }
        if (!i) {
            $("#hdnUserRegion").val(0);
        }
        else {
            $("#hdnUserRegion").val(s);
        }
    } else {
        $("#hdnUserRegion").val(0);
    }
}


function fnValidateExpenseGrpAutoFill(Id) {
    debugger;
    var ExpenseGrpName = $('#' + Id.id).val();
    if (ExpenseGrpName != "" && regiondetails.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < regiondetails.length; o++) {
            if (regiondetails[o].label == ExpenseGrpName) {
                i = true;
                s = regiondetails[o].value;
            }
        }
        if (!i) {
            $("#hdnExpenseGroupCode").val(0);
        }
        else {
            $("#hdnExpenseGroupCode").val(s);

        }
    } else {
        $("#hdnExpenseGroupCode").val(0);
    }
}





//------------------END - EMPLOYEE DETAILS-------------------------------//

//------------------START - LEAVE DETAILS--------------------------------//

function fnBackLeave() {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#main').load('HiDoctor_Master/UsercreationWizard/CreateUserWizard?id=1');
    $('#dvPanel').unblock();
}
function fnBackLeavechange() {
    debugger;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#main').load('HiDoctor_Master/UsercreationWizard/UserHierarchy?id=0');

    $('#dvPanel').unblock();

}
function fnNextLeave(DOJ_g) {
    debugger;
    var result = fnValidateLeaveDetails();
    if (result) {
        var leaveDetails_arr = new Array();
        var leaveCount = $('#hdnLeavecount').val();
        var leavevalue = 0;
        try {
            ShowModalPopup('dvLoading');
            //$('#dvPanel').block({
            //    message: '<h3>Loading...</h3>',
            //    css: { border: '2px solid #ddd' }
            //});
            if (leaveCount != '' && leaveCount != null) {
                if (leaveCount > 0) {
                    for (var i = 0 ; i < leaveCount ; i++) {
                        var leavedetails = {};
                        var leave = $('#txtleave_' + i).val();
                        if (leave != '') {
                            leavedetails.Leave_Type_Code = $('#hdnLeaveTypeCode_' + i).val();
                            leavedetails.Leave_Type_Name = $('#txtLeaveTypeName_' + i).html();
                            leavedetails.User_Type_Code = Usertypecode_g;
                            leavevalue = leave;
                            leavedetails.Leave_Eligible = leavevalue;
                            leavedetails.Opening_Balance = leavevalue;
                            leavedetails.Leave_Balance = leavevalue;
                            leavedetails.Effective_From = $('#txtEffectiveFrom_' + i).val();
                            leavedetails.Effective_To = $('#txtEffectiveTo_' + i).val();
                            leaveDetails_arr.push(leavedetails);
                        }
                    }
                }
                if (leaveDetails_arr.length > 0) {
                    $.ajax({
                        url: '../HiDoctor_Master/UsercreationWizard/GetLeaveDetailsList',
                        type: "POST",
                        data: "leavedetails_Arr=" + JSON.stringify(leaveDetails_arr),
                        success: function (Jsonresult) {
                            debugger;
                            if (Jsonresult != null && Jsonresult != '') {
                                if (Jsonresult.length > 0) {
                                    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMapping/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + '&UserregionCode=' + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(DOJ_g));
                                }
                            }
                            else {
                                $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMapping/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + '&UserregionCode=' + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(DOJ_g));
                            }
                            HideModalPopup('dvLoading');
                            //$('#dvPanel').unblock();
                        },
                        error: function (e) {
                            fnMsgAlert('info', '', 'Error.' + e.Message);
                            HideModalPopup('dvLoading');
                            //$('#dvPanel').unblock();
                        },
                        complete: function () {
                            HideModalPopup('dvLoading');
                            // $('#dvPanel').unblock();
                        }
                    });
                }
                else {
                    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMapping/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + '&UserregionCode=' + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(DOJ_g));
                    HideModalPopup('dvLoading');
                }
            }

        }
        catch (e) {

            // $('#dvPanel').unblock();
        }
    }
}

function fnGetLeaveTypes(entrymode, hiDoctorStartDate, doj) {
    debugger;
    DOJ_gl = doj;
    var userTypecode = Usertypecode_g;
    ShowModalPopup('dvLoading');
    //$('#dvPanel').block({
    //    message: '<h3>Loading...</h3>',
    //    css: { border: '2px solid #ddd' }
    //});
    try {
        if (userTypecode != null && userTypecode != '') {
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetLeaveTypeNames',
                type: "POST",
                data: "userTypeCode=" + userTypecode + "&entryMode=" + entrymode + "&hiDoctorStartDate=" + hiDoctorStartDate + "&doj=" + doj,
                success: function (JsonResult) {
                    debugger;
                    if (JsonResult != null && JsonResult != '') {
                        if (JsonResult.length > 0) {
                            $('#divLeaveTypes').html(JsonResult);
                            var year = new Date(curdate.split('.')[2] + '-' + curdate.split('.')[1] + '-' + curdate.split('.')[0]).getFullYear();
                            $(".datepicker").datepicker({
                                changeMonth: true,
                                changeYear: true,
                                dateFormat: 'dd/mm/yy',
                                yearRange: (year - 20) + ':' + (year + 50)
                            });

                        }
                    }
                    if (JsonResult != '') {
                        for (var i = 0; i < JsonResult.length; i++) {
                            if ($("#txtleave_" + i).val() == 0) {
                                $("#txtleave_" + i).val('');
                            }
                        }
                    }
                    HideModalPopup('dvLoading');
                    // $('#dvPanel').unblock();
                },
                error: function () {
                    fnMsgAlert("Get Activities failed.");
                    HideModalPopup('dvLoading');
                    //$('#dvPanel').unblock();
                },
                complete: function () {
                    HideModalPopup('dvLoading');
                    // $('#dvPanel').unblock();
                }
            });
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        HideModalPopup('dvLoading');
        // $('#dvPanel').unblock();
    }

}
function fnGetLeaveTypesbyUser(entrymode) {
    debugger;
    var userTypecode = Json_user[0].User_Type_Code;
    //var newUsertypeCode = $("#ddlDesignation").val();
    ShowModalPopup('dvLoading');
    //$('#dvPanel').block({
    //    message: '<h3>Loading...</h3>',
    //    css: { border: '2px solid #ddd' }
    //});
    try {
        if (userTypecode != null && userTypecode != '') {
            debugger;
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetLeaveTypeNamesbyuser',
                type: "POST",
                data: "userTypeCode=" + userTypecode + "&entryMode=" + entrymode + "&UserCode=" + UserCode + "&newusertypecode=" + newusertypecode,
                success: function (JsonResult) {
                    debugger;

                    if (JsonResult != null && JsonResult != '') {
                        if (JsonResult.length > 0) {

                            $('#divLeaveTypes').html(JsonResult);

                        }
                    }
                    if (JsonResult != '') {
                        for (var i = 0; i < JsonResult.length; i++) {
                            if ($("#txtleave_" + i).val() == 0) {
                                $("#txtleave_" + i).val('');
                            }
                        }
                    }
                    HideModalPopup('dvLoading');
                    // $('#dvPanel').unblock();
                },
                error: function () {
                    fnMsgAlert("Get Activities failed.");
                    HideModalPopup('dvLoading');
                    //$('#dvPanel').unblock();
                },
                complete: function () {
                    HideModalPopup('dvLoading');
                    // $('#dvPanel').unblock();
                }
            });
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        HideModalPopup('dvLoading');
        // $('#dvPanel').unblock();
    }

}
function fnValidateLeaveDetails() {
    var tblcount = $('#hdnLeavecount').val();
    if (tblcount > 0) {
        for (var i = 0 ; i < tblcount ; i++) {
            if (parseInt($.trim($("#txtleave_" + i).val())) < 0) {
                fnMsgAlert('info', 'User Creation Wizard', 'Negative numbers are not allowed for the Leave Type');
                return false;
            }

            if (isNaN($("#txtleave_" + i).val())) {
                fnMsgAlert('info', 'User Creation Wizard', 'Please Enter the Numeric Value For Leave Type');
                return false;
            }

            //int range check
            $("#txtleave_" + i).blur(function () {
                if ($(this).val() != "") {
                    if (fnCheckSmallInt(this)) {
                        var value = parseInt($(this).val());
                        $(this).val(value);
                    }
                }
            });

            $("#txtvisitcount" + i).blur(function () {
                if ($(this).val() != "") {
                    if (fnCheckInt(this)) {
                        var value = parseInt($(this).val());
                        $(this).val(value);
                    }
                }
            });

            if ($.trim($("#txtleave_" + i).val()).length > 8) {
                fnMsgAlert('info', 'User Creation Wizard', 'Number of Leave Days cannot exceed eight digits.');
                return false;
            }

            if ($.trim($("#txtleave_" + i).val()) != '') {
                if ($('#txtEffectiveFrom_' + i).val() == "") {
                    fnMsgAlert('info', 'User Creation Wizard', 'Effective From cannot be empty');
                    return false;
                }
                if ($('#txtEffectiveTo_' + i).val() == "") {
                    fnMsgAlert('info', 'User Creation Wizard', 'Effective To cannot be empty');
                    return false;
                }
                var hsd_Year = $('#spnHDS').html().split('/')[2];
                var hsd_Month = $('#spnHDS').html().split('/')[1]
                var hsd_Day = $('#spnHDS').html().split('/')[0]
                if (hsd_Year > $('#txtEffectiveFrom_' + i).val().split('/')[2]) {
                    fnMsgAlert('info', 'User Creation Wizard', 'Effective From cannot be less than Hidoctor Start Date');
                    return false;
                }
                else {
                    if (hsd_Month > $('#txtEffectiveFrom_' + i).val().split('/')[1]) {
                        fnMsgAlert('info', 'User Creation Wizard', 'Effective From cannot be less than Hidoctor Start Date');
                        return false;
                    }
                    else {
                        if (hsd_Month == $('#txtEffectiveFrom_' + i).val().split('/')[1]) {
                            if (hsd_Day > $('#txtEffectiveFrom_' + i).val().split('/')[0]) {
                                fnMsgAlert('info', 'User Creation Wizard', 'Effective From cannot be less than Hidoctor Start Date');
                                return false;
                            }
                        }
                    }
                }
                if (hsd_Year > $('#txtEffectiveTo_' + i).val().split('/')[2]) {
                    fnMsgAlert('info', 'User Creation Wizard', 'Effective To cannot be less than Hidoctor Start Date');
                    return false;
                }
                else {
                    if (hsd_Month > $('#txtEffectiveTo_' + i).val().split('/')[1]) {
                        fnMsgAlert('info', 'User Creation Wizard', 'Effective To cannot be less than Hidoctor Start Date');
                        return false;
                    }
                    else {
                        if (hsd_Month == $('#txtEffectiveTo_' + i).val().split('/')[1]) {
                            if (hsd_Day > $('#txtEffectiveTo_' + i).val().split('/')[0]) {
                                fnMsgAlert('info', 'User Creation Wizard', 'Effective To cannot be less than Hidoctor Start Date');
                                return false;
                            }
                        }
                    }
                }
                if ($('#txtEffectiveFrom_' + i).val().split('/')[2] != $('#txtEffectiveTo_' + i).val().split('/')[2]) {
                    fnMsgAlert('info', 'User Creation Wizard', 'Effective From and Effective To should have the same year');
                    return false;
                }
                else {
                    if ($('#txtEffectiveFrom_' + i).val().split('/')[1] > $('#txtEffectiveTo_' + i).val().split('/')[1]) {
                        fnMsgAlert('info', 'User Creation Wizard', 'Effective From cannot be greater than Effective To');
                        return false;
                    }
                    else {
                        if ($('#txtEffectiveFrom_' + i).val().split('/')[1] == $('#txtEffectiveTo_' + i).val().split('/')[1]) {
                            if ($('#txtEffectiveFrom_' + i).val().split('/')[0] > $('#txtEffectiveTo_' + i).val().split('/')[0]) {
                                fnMsgAlert('info', 'User Creation Wizard', 'Effective From cannot be greater than Effective To');
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}



//------------------END - LEAVE DETAILS----------------------------------//

//------------------END - USER PRODUCT MAPPING----------------------------------//
function fnBackUserProduct(mode, doj_g, hiDoctorStartDate_g) {
    debugger;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateLeaveDetails/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&divisionCode=' + escape(divisionCode_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&entryMode=' + escape(mode) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&DOJ=' + escape(doj_g));
    $('#dvPanel').unblock();
}
function fnBackUserProductchange(mode) {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateLeaveDetailsforhierarchychange/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&divisionCode=' + escape(divisionCode_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&entryMode=' + escape(mode) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&Usercode=' + escape(UserCode));
    $('#dvPanel').unblock();
}
function fnBackUserProductdivision(mode) {
    debugger;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    var id = 0;
    $('#main').load('../HiDoctor_Master/UsercreationWizard/UserHierarchy/?ID=' + escape(id) + '&Usercode=' + escape(UserCode));
    //fnprefillalldetails();
    //$('#main').load('HiDoctor_Master/UsercreationWizard/UserHierarchy?id=0');
    $('#dvPanel').unblock();
}

function fnGetMinMaxConfig() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetMinMaxConfig',
        type: 'GET',
        async: false,
        success: function (result) {
            debugger;
            min_max_config_global = result;
        }
    });
}

function fnNextUserProduct(doj_g, hiDoctorStartDate_g) {
    debugger;
    // var result = fnValidateProductdetails();
    // if (result) {
    try {
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        var UserProductdetails_arr = new Array();
        var productcount = $('#hdnproductcount').val();
        var count_Validate = 0;
        var SpecialCharacter = 0;
        var ng_value = 0;
        var decimal_value = 0;
        var prod_name = "";
        var min_count = 0;
        var max_count = 0;
        fnGetMinMaxConfig();
        debugger;
        if (productcount > 0) {
            $("input:checkbox[name=chkSelectAll]").attr('checked', false);
            $("input:checkbox[name=chkSelect]:checked").each(function () {
                var productdetails = {};
                var selectedvalues = $(this).val();
                if (min_max_config_global == "YES") {
                    min_count = $(this).parent().parent().children().find('input')[1].value;
                    max_count = $(this).parent().parent().children().find('input')[2].value;
                }
                else {
                    min_count = 0;
                    max_count = 0;
                }
                selectedvalues = selectedvalues + '|' + min_count + '|' + max_count;
                if ($(this).is(":checked")) {
                    productdetails.Product_Code = selectedvalues.split('|')[0];
                    productdetails.Product_Name = selectedvalues.split('|')[1];
                    productdetails.Product_Type = selectedvalues.split('|')[2];
                    productdetails.Current_Stock = 0;
                    productdetails.Product_Type_Name = selectedvalues.split('|')[3];
                    productdetails.User_Type_Code = Usertypecode_g;
                    productdetails.Min_Count = selectedvalues.split('|')[4];
                    productdetails.Max_Count = selectedvalues.split('|')[5];
                    if (productdetails.Min_Count > productdetails.Max_Count) {
                        count_Validate = 1;
                    }
                    if (productdetails.Min_Count == '' || productdetails.Min_Count == null || productdetails.Min_Count == undefined) {
                        SpecialCharacter = 1;
                    }
                    if (productdetails.Max_Count == '' || productdetails.Max_Count == null || productdetails.Max_Count == undefined) {
                        SpecialCharacter = 1;
                    }
                    if (productdetails.Min_Count < 0 || productdetails.Max_Count < 0) {
                        ng_value = 1;
                    }
                    var regex = new RegExp("[.]");
                    if (regex.test(productdetails.Min_Count)) {
                        decimal_value = 1;
                    }
                    if (regex.test(productdetails.Max_Count)) {
                        decimal_value = 1;
                    }
                    if (SpecialCharacter == 1 || count_Validate == 1 || decimal_value == 1 || ng_value == 1) {
                        if (prod_name == "") {
                            prod_name = selectedvalues.split('|')[1];
                        }
                    }
                    UserProductdetails_arr.push(productdetails);
                }
            });
            debugger;

            if (SpecialCharacter == 1) {
                $('#dvPanel').unblock();
                fnMsgAlert('info', 'Info', 'Please enter only numbers in Min Count and Max Count for ' + prod_name + '. <b>Do not keep empty boxes for selected products</b>');
                return false;
            }
            else if (count_Validate == 1) {
                $('#dvPanel').unblock();
                fnMsgAlert('info', 'Info', 'Min Count cannot be greater than Max count in ' + prod_name + '.');
                return false;
            }
            else if (ng_value == 1) {
                $('#dvPanel').unblock();
                fnMsgAlert('info', 'Info', 'Min Count and Max Count cannot be less than 0 for ' + prod_name + '.');
                return false;
            }
            else if (decimal_value == 1) {
                $('#dvPanel').unblock();
                fnMsgAlert('info', 'Info', 'Please do not enter decimal numbers in Min Count and Max Count for ' + prod_name + '.');
                return false;
            }
            else {
                $.ajax({
                    url: '../HiDoctor_Master/UsercreationWizard/GetUserProductMappingdetails',
                    type: "POST",
                    data: "productdetails_Arr=" + encodeURIComponent(JSON.stringify(UserProductdetails_arr)),
                    success: function (Jsonresult) {
                        debugger;
                        if (Jsonresult != null && Jsonresult != '') {
                            if (Jsonresult.length > 0) {
                                $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNoticeBoard/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(doj_g));
                            }
                        }
                        $('#dvPanel').unblock();
                    },
                    error: function (e) {
                        fnMsgAlert('info', '', 'Error.' + e.Message);
                        $('#dvPanel').unblock();
                    },
                    complete: function () {
                        $('#dvPanel').unblock();
                    }
                });
            }
        }
        else {
            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNoticeBoard/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(doj_g));
        }
        $('#dvPanel').unblock();
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
    //}
}

//Used to get all products
function fnGetProducts(entrymode, ProductName) {
    debugger;
    var content = '';
    var userTypecode = Usertypecode_g;
    var divisionCode = divisionCode_g;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    try {
        if (userTypecode != null && userTypecode != '') {
            //var divisionCode = "";
            //$('select#ddlDivision > option:selected').each(function () {
            //    divisionCode += $(this).val() + ',';
            //    //entity_Names.push($(this).text().split('(')[0]);
            //});
            //divisionCode = divisionCode.slice(0, -1);
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetUserProducts',
                type: "POST",
                async: false,
                data: "userTypeCode=" + userTypecode + "&entryMode=" + entrymode + "&divisionCode=" + divisionCode + "&ProductName=" + ProductName,
                success: function (JsonResult) {
                    debugger;
                    resp = JsonResult;
                    if (JsonResult != null && JsonResult != '') {
                        if (JsonResult.length > 0) {

                            $('#divProducts').html(JsonResult);
                            //fnproduct(resp);
                        }
                    }
                    $('#dvPanel').unblock();
                },
                error: function () {
                    fnMsgAlert("Get Activities failed.");
                    $('#dvPanel').unblock();
                },
                complete: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }

}

function fnGetProductsbyuser(entrymode, ProductName) {
    debugger;
    var userTypecode = Usertypecode_g;
    var divisionCode = divisionCode_g;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    try {
        if (userTypecode != null && userTypecode != '') {
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetProductsbyuser',
                type: "POST",
                async: false,
                data: "UserCode=" + UserCode + "&userTypeCode=" + userTypecode + "&entryMode=" + entrymode + "&divisionCode=" + divisionCode + "&ProductName=" + ProductName,
                success: function (JsonResult) {
                    debugger;
                    resp = JsonResult;
                    if (JsonResult != null && JsonResult != '') {
                        if (JsonResult.length > 0) {
                            $('#divProducts').html(JsonResult);
                        }
                    }
                    $('#dvPanel').unblock();
                },
                error: function () {
                    fnMsgAlert("Get Activities failed.");
                    $('#dvPanel').unblock();
                },
                complete: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }

}
function fnproduct() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetProduct',
        type: "POST",
        async: false,
        data: "userCode=" + UserCode,
        success: function (JsonResult) {
            debugger;
            var jsonresult = eval('(' + JsonResult + ')');
            var product = $("[name='product']");

            for (var j = 0; j < jsonresult.length; j++) {
                for (var i = 0; i < product.length; i++) {
                    var testprod = $("#hdnProductCode_" + i).val();
                    if ((jsonresult[j].Entity_Code == testprod) && (jsonresult[j].User_Product_Status == "0")) {

                        $('#chkSelect_' + i).attr('checked', true);
                    }
                    //else {
                    //    $('#chkSelect_' + i).attr('checked', false);
                    //}

                }
            }
        }
    });
}
//Function Used to get all products
function fnSearchProduct() {

    if ($.trim($("#txtsearchproduct").val()) != '') {
        if ($.trim($("#txtsearchproduct").val()).length < 3) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter the Search Product Name minimum 3 characters');
            return false;
        }
    }

    var productName = $.trim($("#txtsearchproduct").val());
    var entrymode = "";

    $('.btnBackUserProduct').click(function () {
        entrymode = "BACK";
    });
    fnGetProducts(entrymode, productName);
}

//Used to check All
function fnSelectAll() {

    if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = true;
            // var checal=1
        });
    }
    else {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = false;
        });
    }
}

function fnValidateProductdetails() {
    var flag = true;

    var productcount = $('#hdnproductcount').val();
    if (productcount > 0) {
        if (!$("input[name='chkSelect']").is(":checked")) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please select alteast one product');
            flag = false;
        }
    }
    return flag;
}
//------------------END - USER PRODUCT MAPPING----------------------------------//

//------------------START - NOTICE BOARD----------------------------------//
function fnBackNoticeBoard(mode, doj_g) {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMapping/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(mode) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(doj_g));
    $('#dvPanel').unblock();
}

function fnsplash(splash_Arr, doj_g, hiDoctorStartDate_g) {
    debugger;
    $.ajax({

        url: '../HiDoctor_Master/UsercreationWizard/GetSplashdetail',
        type: "POST",
        data: "splash_Arr=" + encodeURIComponent(JSON.stringify(splash_Arr)),
        success: function (Jsonresult) {
            debugger;
            if (Jsonresult != null && Jsonresult != '') {

                if (Jsonresult.length > 0) {
                    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNewUser/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(doj_g));
                }
            }
            $('#dvPanel').unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}
function fnEdetailing(Edetailing_Arr, doj_g, hiDoctorStartDate_g) {
    debugger;
    $.ajax({

        url: '../HiDoctor_Master/UsercreationWizard/GetEdetailingdetail',
        type: "POST",
        data: "Edetailing_Arr=" + encodeURIComponent(JSON.stringify(Edetailing_Arr)),
        success: function (Jsonresult) {
            debugger;
            if (Jsonresult != null && Jsonresult != '') {

                if (Jsonresult.length > 0) {
                    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNewUser/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(doj_g));
                }
            }
            $('#dvPanel').unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}
var splashid = '';
var Edetailingid = '';
function fnNextNoticeBoard(doj_g, hiDoctorStartDate_g) {
    debugger;
    // var result = fnValidateNoticeboardMessage();
    //  if (result) {
    try {
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        var NoticeBoardDetails_arr = new Array();
        var splash_Arr = new Array();
        var Edetailing_Arr = new Array();
        var noticecount = $('#hdnnoticecount').val();
        if (noticecount => 0) {
            $("input:checkbox[name=chkSelectAllmessage]").attr('checked', false);
            $("input:checkbox[name=chkSelectmessage]:checked").each(function () {
                var noticeBoarddetails = {};
                var selectedvalues = $(this).val();
                noticeBoarddetails.Msg_Code = selectedvalues.split('-')[0];
                noticeBoarddetails.Title = selectedvalues.split('-')[1];
                noticeBoarddetails.Date_From = selectedvalues.split('-')[2];
                noticeBoarddetails.Date_To = selectedvalues.split('-')[3];
                NoticeBoardDetails_arr.push(noticeBoarddetails);
            });

            var splashcount = $('#hdnsplashcount').val();
            for (var i = 0; i < splashcount.length; i++) {
                splashid = $('#hdnsplashid_' + i).val();
            }

            if (splashcount > 0) {
                $("input:checkbox[name=chkSelectAllsplashmessage]").attr('checked', false);
                $("input:checkbox[name=chkSelectmessagesplash]:checked").each(function () {
                    var splashdetails = {};
                    var selectedvalues = $(this).val();

                    splashdetails.Title = selectedvalues.split('-')[0];
                    splashdetails.Date_From = selectedvalues.split('-')[1];
                    splashdetails.Date_To = selectedvalues.split('-')[2];
                    splashdetails.Splash_Screen_Id = splashid;
                    splash_Arr.push(splashdetails);
                });
            }
            var Edetailingcount = $('#hdnedetailingcount').val();
            //for (var i = 0; i < Edetailingcount.length; i++) {
            //    debugger;
            //    Edetailingid = $('#hdnedetailingid_' + i).val();
            //}

            if (Edetailingcount > 0) {
                debugger;
                $("input:checkbox[name=chkSelectAllEdetailingmessage]").attr('checked', false);
                $("input:checkbox[name=chkSelectmessageEdetailing]:checked").each(function () {
                    var Edetailingdetails = {};
                    var selectedvalues = $(this).val();

                    Edetailingdetails.DA_Name = selectedvalues.split('(')[0];
                    Edetailingdetails.FromDate = selectedvalues.split('(')[1];
                    Edetailingdetails.ToDate = selectedvalues.split('(')[2];
                    Edetailingdetails.DA_Code = selectedvalues.split('(')[3];;
                    Edetailing_Arr.push(Edetailingdetails);
                });
            }
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetNoticeBoardSessiondetails',
                type: "POST",
                data: "noticeBoardDetails_Arr=" + encodeURIComponent(JSON.stringify(NoticeBoardDetails_arr)),
                success: function (Jsonresult) {
                    debugger;
                    fnsplash(splash_Arr, doj_g, hiDoctorStartDate_g);
                    fnEdetailing(Edetailing_Arr, doj_g, hiDoctorStartDate_g)
                    if (Jsonresult != null && Jsonresult != '') {

                        if (Jsonresult.length > 0) {
                            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNewUser/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(doj_g));
                        }
                    }
                    $('#dvPanel').unblock();
                },
                error: function (e) {
                    fnMsgAlert('info', '', 'Error.' + e.Message);
                    $('#dvPanel').unblock();
                },
                complete: function () {
                    $('#dvPanel').unblock();
                }
            });

        }
        else {
            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNewUser/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(doj_g));
        }
        $('#dvPanel').unblock();
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
    //}
}

function fnGetNoticeBoardMessage(entrymode, message) {
    debugger;
    var regionCode = userRegionCode_g;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    try {
        if (regionCode != null && regionCode != '') {
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetNoticeBoardDetails',
                type: "POST",
                async: false,
                data: "regionCode=" + regionCode + "&entryMode=" + entrymode + "&noticeBoardmessage=" + message + '&reportingManagerUsercode=' + reportingmanagerUsercode_g,
                success: function (JsonResult) {
                    debugger;
                    if (JsonResult != null && JsonResult != '') {
                        if (JsonResult.length > 0) {
                            $('#divNoticeBoard').html(JsonResult);
                        }
                    }
                    $('#dvPanel').unblock();
                },
                error: function () {
                    fnMsgAlert("Get Activities failed.");
                    $('#dvPanel').unblock();
                },
                complete: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
    }
    catch (e) {
        //fnMsgAlert();
        $('#dvPanel').unblock();
    }
}
function fnGetsplashMessage(message) {
    debugger;
    //  var regionCode = userRegionCode_g;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    try {
        // if (regionCode != null && regionCode != '') {
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/GetSplashdetails',
            type: "POST",
            async: false,
            data: "splashmessage=" + message,
            success: function (JsonResult) {
                debugger;
                if (JsonResult != null && JsonResult != '') {
                    if (JsonResult.length > 0) {
                        $('#divsplash').html(JsonResult);

                    }
                }
                $('#dvPanel').unblock();
            },
            error: function () {
                fnMsgAlert("Get Activities failed.");
                $('#dvPanel').unblock();
            },
            complete: function () {
                $('#dvPanel').unblock();
            }
        });
        // }
    }
    catch (e) {
        //fnMsgAlert();
        $('#dvPanel').unblock();
    }
}

function fnSearchNoticeboard() {

    if ($.trim($("#txtsearchText").val()) != '') {
        if ($.trim($("#txtsearchText").val()).length < 3) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter the Search Text minimum 3 characters');
            return false;
        }
    }
    var message = $.trim($("#txtsearchText").val());

    var entrymode = "";
    $('.btnBackNoticeBoard').click(function () {
        entrymode = "BACK";
    });
    fnGetNoticeBoardMessage(entrymode, message);
}

//function fnValidateNoticeboardMessage() {

//    var noticecount = $('#hdnnoticecount').val();
//    if (noticecount > 0) {
//        if (!$("input[name='chkSelectmessage']").is(":checked")) {
//            fnMsgAlert('info', 'User Createion Wizard', 'Please select alteast one Message');
//            return falsedivNoticeBoard
//        }
//    }
//    return true;
//}
function fnSearchsplash() {

    if ($.trim($("#txtsplashsearchText").val()) != '') {
        if ($.trim($("#txtsplashsearchText").val()).length < 3) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter the Search Text minimum 3 characters');
            return false;
        }
    }
    var message = $.trim($('#txtsplashsearchText').val());

    var entrymode = "";
    $('.btnBackNoticeBoard').click(function () {
        entrymode = "BACK";
    });
    fnGetsplashMessage(message);
}
function fnSearchedetailing() {

    if ($.trim($("#btnsearchedetailingText").val()) != '') {
        if ($.trim($("#btnsearchedetailingText").val()).length < 3) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter the Search Text minimum 3 characters');
            return false;
        }
    }
    var message = $.trim($("#btnsearchedetailingText").val());

    var entrymode = "";
    $('.btnBackNoticeBoard').click(function () {
        entrymode = "BACK";
    });
    fnEdetailingdata(message);
}

function fnSelectAllMessagesplash() {

    if ($("input:checkbox[name=chkSelectAllsplashmessage]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelectmessagesplash]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelectmessagesplash]").each(function () {
            this.checked = false;
        });
    }
}
function fnSelectAllMessageedetailing() {

    if ($("input:checkbox[name=chkSelectAllEdetailingmessage]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelectmessageEdetailing]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelectmessageEdetailing]").each(function () {
            this.checked = false;
        });
    }
}
//Used to check All
function fnSelectAllMessage() {

    if ($("input:checkbox[name=chkSelectAllmessage]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelectmessage]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelectmessage]").each(function () {
            this.checked = false;
        });
    }
}
//------------------START - NOTICE BOARD----------------------------------//


//------------------START - CREATE NEW USER-------------------------------//
function fnGetTemplateDetails() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetMailTemplates',
        type: "POST",
        async: false,
        data: "",
        success: function (JsonResult) {
            var data = eval('(' + JsonResult + ')');
            if (data != null && data != '') {
                Templatedetails = data;
            }
            HideModalPopup('dvLoading');
        },
        error: function () {
            fnMsgAlert("Send mail Failed.");
            HideModalPopup('dvLoading');
            //$('#dvPanel').unblock();
        }
    });

}
function fnsendSms(userCode) {
    var user_Code = "";
    if (userCode != null && userCode != '') {
        user_Code = userCode + ',';
    }

    //$('#dvPanel').block({
    //    message: '<h3>Loading...</h3>',
    //    css: { border: '2px solid #ddd' }
    //});
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/SendPassword',
        type: "POST",
        async: false,
        data: "userCode=" + user_Code + "&mobileNumber=" + mobileNO_g,
        success: function (JsonResult) {
            if (JsonResult != null && JsonResult != '') {
                alert("User Created Successfully.");
                $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
                //fnMsgAlert('success', 'User Createion Wizard', 'User Created Successfully');
                //return false;
                //$('#main').load('HiDoctor_Master/UsercreationWizard/Home');
            }
            HideModalPopup('dvLoading');
        },
        error: function () {
            fnMsgAlert("Send sms Failed.");
            HideModalPopup('dvLoading');
            //$('#dvPanel').unblock();
        }
    });
}

function fnGetRegionTree(val) {
    debugger
    if ($("#ddlUserRegion_hidden").val() != '' && $("#ddlUserRegion_hidden").val() != undefined) {
        var Regioncode = $("#ddlUserRegion_hidden").val();
    }
    else {
        var Regioncode = Empdetails[0].Region_Code;
    }
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetParentHierarchyByRegion',
        type: "POST",
        async: false,
        data: "Regioncode=" + Regioncode,
        success: function (JsonResult) {
            var data = eval('(' + JsonResult + ')');
            if (data != null && data != '') {
                debugger;
                $('#regionTreeNew').html('');
                json = data;
                var content = '';
                var Sno = 1;
                content += '<table class="table table-sm" id="tblregion">';
                content += '<thead><tr>';
                content += '<th><input type="checkbox" id="chekbox_" name="chkSSSelectS" onclick="fnselectAll()"/>SelectAll</th>';
                // content += '<th><input type="checkbox" id="chkbox_" name="chkSSSelectS" onclick="fnSelectAll()"/></th>';
                content += '<th scope="col">Copy Holders</th>';
                content += '</tr>';
                content += '</thead>';
                content += '<tbody>';
                for (var i = 0; i < json.length; i++) {
                    content += '<tr>';
                    content += '<td><input type="checkbox" class="Chkboxreg" name="chkregion" id="chekbox_' + i + '" value=' + json[i].User_Code + ' aria-label="..."></td>';
                    content += '<input type="hidden" value=' + json[i].Company_Code + '/>';
                    content += '<input class="emailid_' + i + '" type="hidden" value=' + json[i].Email_Id + '>';
                    content += '<input class="usercode_' + i + '" type="hidden" value=' + json[i].User_Code + '>';
                    content += '<input class="empname_' + i + '" type="hidden" value=' + json[i].Employee_Name + '>';
                    content += '<td>' + json[i].Region_Name + ' - ' + json[i].Employee_Name + ' (' + json[i].User_Name + ')</td>';
                    content += '</tr>';
                    Sno++;
                }

                content += '</tbody></table>';
                $('#regionTreeNew').append(content);
                $('#myModalregion').modal({ show: true });
                //var checkedall=[]
                checkedall = data;
                checkedall.length;
                fnCheckUsers(val);
            }
            HideModalPopup('dvLoading');


        },

        error: function () {
            HideModalPopup('dvLoading');
            //$('#dvPanel').unblock();
        }
    });
}
function fnselectAll() {
    debugger;
    if ($('#chekbox_').is(":checked")) {
        $("input:checkbox[name=chkregion]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chkregion]").removeAttr('checked');
    }
}
function fnCheckUsers(val) {
    debugger

    //checkedall = '';
    checkedall.length;
    if (val == 0) {
        if (CCMailarr.length > 0) {
            debugger;
            for (var i = 0; i < CCMailarr.length; i++) {
                $("input[value='" + CCMailarr[i].User_Code + "']").prop('checked', true);
            }
            if (CCMailarr.length == checkedall.length) {
                $('#chekbox_').attr('checked', 'checked')

            }
        }
    }

    else if (val == 1) {
        checkedall.length;
        if (HirarchyMailarr.length > 1) {
            debugger;
            for (var i = 0; i < HirarchyMailarr.length; i++) {
                $("input[value='" + HirarchyMailarr[i].User_Code + "']").prop('checked', true);
            }
            if (HirarchyMailarr.length == checkedall.length) {
                $('#chekbox_').attr('checked', 'checked')

            }

        }
    }
    else {
        if (ResMailarr.length > 0) {
            debugger;
            for (var i = 0; i < ResMailarr.length; i++) {
                $("input[value='" + ResMailarr[i].User_Code + "']").prop('checked', true);
            }
            if (ResMailarr.length == checkedall.length) {
                $('#chekbox_').attr('checked', 'checked')

            }

        }
    }
}

function fnGetRegionTreefordisableuser(Regioncode) {
    debugger
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetParentHierarchyByRegion',
        type: "POST",
        async: false,
        data: "Regioncode=" + Regioncode,
        success: function (JsonResult) {
            var data = eval('(' + JsonResult + ')');
            if (data != null && data != '') {
                debugger;
                $('#regionTreeNew').html('');
                json = data;
                var content = '';
                var Sno = 1;
                content += '<table class="table table-sm" id="tblregion">';
                content += '<thead><tr>';
                // content += '<th scope="col"></th>';
                content += '<th><input type="checkbox" id="chekbox_" name="chkSSSelectS" onclick="fnselectAll()"/>SelectAll</th>';
                content += '<th scope="col">Copy Holders</th>';
                content += '</tr>';
                content += '</thead>';
                content += '<tbody>';
                for (var i = 0; i < json.length; i++) {
                    content += '<tr>';
                    content += '<td><input type="checkbox" class="Chkboxreg" name="chkregion" id="chekbox_' + i + '" value=' + json[i].User_Code + ' aria-label="..."></td>';
                    content += '<input type="hidden" value=' + json[i].Company_Code + '/>';
                    content += '<input class="emailid_' + i + '" type="hidden" value=' + json[i].Email_Id + '>';
                    content += '<input class="usercode_' + i + '" type="hidden" value=' + json[i].User_Code + '>';
                    content += '<input class="empname_' + i + '" type="hidden" value=' + json[i].Employee_Name + '>';
                    content += '<td>' + json[i].Region_Name + ' - ' + json[i].Employee_Name + ' (' + json[i].User_Name + ')</td>';
                    content += '</tr>';
                    Sno++;
                }
                content += '</tbody></table>';
                $('#regionTreeNew').append(content);
                $('#myModalregion').modal({ show: true });
                checkedall = data;
                checkedall.length;
                fnCheckUsers(2);
            }
            HideModalPopup('dvLoading');
        },
        error: function () {
            HideModalPopup('dvLoading');
            //$('#dvPanel').unblock();
        }
    });
}


function fnGetRegionTreefaiureCallback(data) {

    //console.log(data);
    alert("ERROR");
}
function fnSaveCCUsers(val) {
    debugger
    $('#btnccsave').prop('disabled', true);
    var lstCCMail = [];
    var obj = {};
    var UserArray = [];
    var region = $('[name="chkregion"]:checked');
    if (region.length > 0) {
        for (var i = 0; i < json.length; i++) {
            if ($("#chekbox_" + i).is(':checked')) {
                obj = {
                    User_Code: $(".usercode_" + i).val(),
                    Employee_Name: $(".empname_" + i).val(),
                    Email_Id: $(".emailid_" + i).val()
                }
                lstCCMail.push(obj);
            }
        }
        var objlst = {
            lstCCMail: lstCCMail
        }
        if (val == 1) {
            CCMailarr = lstCCMail;
        }
        else if (val == 0) {
            ResMailarr = lstCCMail;
        }
        else {
            HirarchyMailarr = lstCCMail;
        }
        $('#myModalregion').modal('hide');
        $('#btnccsave').prop('disabled', false);
    }
    else {
        alert("Please Select any User.");
        $('#btnccsave').prop('disabled', false);
        return false;
    }
}


function fnsendmail(userCode) {
    debugger
    $('#btnccsave').prop('disabled', false);
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetManagerEmpnumber',
        type: "POST",
        async: false,
        data: "UserCode=" + userCode,
        success: function (JsonResult) {
            var data = eval('(' + JsonResult + ')');
            if (data != null && data != '') {
                debugger;
                var CanSelFrommailid = '';
                var CanSelTomailid = '';
                var CanSelCCmailid = '';
                var CanSelSenderName = ''
                var TemplateName = "Employee_Joining";

                var CanSelMailids = $.grep(FromEmailIdarr, function (element, index) {
                    return element.TemplateName == TemplateName;
                });
                if (CanSelMailids.length > 0) {
                    debugger
                    CanSelFrommailid = CanSelMailids[0].FromMail;
                }
                var CanSelMailids = $.grep(hrmsCCmailarr, function (element, index) {
                    return element.TemplateName == TemplateName;
                });
                if (CanSelMailids.length > 0) {
                    debugger
                    CanSelCCmailid = CanSelMailids[0].CCMail;
                }
                var CanSelMailids = $.grep(MailSenderNamearr, function (element, index) {
                    return element.TemplateName == TemplateName;
                });
                if (CanSelMailids.length > 0) {
                    debugger
                    CanSelSenderName = CanSelMailids[0].SenderName;
                }

                var ccmaillst = "";
                var Empnames = "";
                if (CCMailarr.length > 0) {
                    debugger;
                    if (CCMailarr.length == 1) {
                        ccmaillst = CCMailarr[0].Email_Id;
                        Empnames = CCMailarr[0].Employee_Name;
                    }
                    else {
                        for (var i = 0; i < CCMailarr.length; i++) {
                            if (i == (CCMailarr.length - 1)) {
                                ccmaillst += CCMailarr[i].Email_Id;
                                Empnames = CCMailarr[i].Employee_Name;
                            }
                            else {
                                ccmaillst += CCMailarr[i].Email_Id + ',';
                                Empnames = CCMailarr[i].Employee_Name + '/';
                            }
                        }
                    }
                }

                var Doccall = $.grep(Templatedetails, function (element, index) {
                    return element.TemplateName == TemplateName;
                });
                var host = "";
                var reqHeader = null;
                var masterApiKey = ""

                if (Doccall != null) {
                    host = Doccall[0].HostName;
                    reqHeader = { "Master-api-key": Doccall[0].Master_Api_Key };
                    Company_Logo_Path = Doccall[0].Company_Logo_Path;

                }
                else {
                    alert("Failed to send Mail.");
                }

                if (host == "" || host == undefined || host == null) {
                    alert("Failed to get Notification Configs.");
                    return false;
                }
                if (Empdetails[0].Gender == 0) {
                    Empdetails[0].Gender = "";
                }
                else if (Empdetails[0].Gender == "F") {
                    Empdetails[0].Gender = "Female";
                }
                else if (Empdetails[0].Gender == "M") {
                    Empdetails[0].Gender = "Male";
                }
                if (Empdetails[0].Date_of_Joining != '') {
                    var dot = Empdetails[0].Date_of_Joining;
                    var Doj = dot.split('-')[2] + '/' + dot.split('-')[1] + '/' + dot.split('-')[0];
                }
                if (Empdetails[0].Date_of_birth != '') {
                    var dot = Empdetails[0].Date_of_birth;
                    var DoB = dot.split('-')[2] + '/' + dot.split('-')[1] + '/' + dot.split('-')[0];
                }
                var Maildata = Object.assign({}, MailObject);

                Maildata.data.Empnames = Empnames;
                Maildata.data.HDId = Empdetails[0].User_Name;
                Maildata.data.Emp_Code = Empdetails[0].Employee_Number;
                Maildata.data.Name = Empdetails[0].Employee_Name;
                Maildata.data.Designation = Empdetails[0].User_Type_Name;
                Maildata.data.DOJ = Doj;
                Maildata.data.DOB = DoB;
                Maildata.data.Gender = Empdetails[0].Gender;
                Maildata.data.HQ = Empdetails[0].Region_Name;
                Maildata.data.Division = Empdetails[0].Division_Name;
                Maildata.data.Address = Empdetails[0].Address;
                Maildata.data.Mobile = Empdetails[0].Mobile;
                Maildata.data.Phone = Empdetails[0].Phone;
                Maildata.data.Email = Empdetails[0].Email_Id;
                Maildata.data.Manager = Empdetails[0].Reporting_Manager_User_Name + '-' + data[0].Manager_Employee_Number;
                Maildata.data.to_mail = ccmaillst;
                Maildata.data.Mail_Sender_Name = CanSelSenderName;
                Maildata.data.Sender_Mail = CanSelFrommailid;
                Maildata.data.cc_mail = CanSelCCmailid;
                Maildata.data.req_id = "GUID140";
                console.log(Maildata);
                $.ajax({
                    type: "POST",
                    headers: reqHeader,
                    url: host,
                    data: JSON.stringify(Maildata),
                    contentType: "application/json; charset=utf-8",
                    success: function (resp) {
                        if (resp.trim() != "") {
                            var ApiPdfStatus = eval('(' + resp + ')');
                            var text = "";
                            var icon = "info";
                            if (ApiPdfStatus.response.Code == "200") {
                                text = "Mail has been sent";
                                icon = "success";
                            }
                            else if (ApiPdfStatus.response.Code == "400") {
                                text = "Failure";
                            }
                            else if (ApiPdfStatus.response.Code == "204") {
                                text = "Invalid Mail";
                            }
                            else if (ApiPdfStatus.response.Code == "403") {
                                text = "Authentication Failed";
                            }
                        }
                        else {
                            console.log(resp);
                            HideModalPopup('dvLoading');
                            //  alert("Failed Sending Mail.");
                        }
                    },
                    error: function (result) {
                        console.log(resp);
                        HideModalPopup('dvLoading');
                        //alert("Failed Sending Mail.");
                    }
                });
            }
            HideModalPopup('dvLoading');
        },
        error: function () {
            HideModalPopup('dvLoading');
            //$('#dvPanel').unblock();
        }
    });


}
function fnsendresignmail(userCode) {
    debugger
    $('#btnccsave').prop('disabled', false);
    var CanSelFrommailid = '';
    var CanSelTomailid = '';
    var CanSelCCmailid = '';
    var CanSelSenderName = ''
    var TemplateName = "Employee_Resignation";

    var CanSelMailids = $.grep(FromEmailIdarr, function (element, index) {
        return element.TemplateName == TemplateName;
    });
    if (CanSelMailids.length > 0) {
        debugger
        CanSelFrommailid = CanSelMailids[0].FromMail;
    }
    var CanSelMailids = $.grep(hrmsCCmailarr, function (element, index) {
        return element.TemplateName == TemplateName;
    });
    if (CanSelMailids.length > 0) {
        debugger
        CanSelCCmailid = CanSelMailids[0].CCMail;
    }
    var CanSelMailids = $.grep(MailSenderNamearr, function (element, index) {
        return element.TemplateName == TemplateName;
    });
    if (CanSelMailids.length > 0) {
        debugger
        CanSelSenderName = CanSelMailids[0].SenderName;
    }

    var ccmaillst = "";
    var Empnames = "";
    if (ResMailarr.length > 0) {
        debugger;
        if (ResMailarr.length == 1) {
            ccmaillst = ResMailarr[0].Email_Id;
            Empnames = ResMailarr[0].Employee_Name;
        }
        else {
            for (var i = 0; i < ResMailarr.length; i++) {
                if (i == (ResMailarr.length - 1)) {
                    ccmaillst += ResMailarr[i].Email_Id;
                    Empnames += ResMailarr[i].Employee_Name;
                }
                else {
                    ccmaillst += ResMailarr[i].Email_Id + ',';
                    Empnames += ResMailarr[i].Employee_Name + '/';
                }
            }
        }
    }
    else {
        ccmaillst = CanSelCCmailid;
    }

    var Doccall = $.grep(Templatedetails, function (element, index) {
        return element.TemplateName == TemplateName;
    });
    var host = "";
    var reqHeader = null;
    var masterApiKey = ""

    if (Doccall != null) {
        host = Doccall[0].HostName;
        reqHeader = { "Master-api-key": Doccall[0].Master_Api_Key };
        Company_Logo_Path = Doccall[0].Company_Logo_Path;
    }
    else {
        alert("Failed to send Mail.");
    }
    var desgn = '';
    desgn = $('select[name="txtSearhUserId"]').text().split('-')[2].split('(')[1].split(')')[0];
    if (host == "" || host == undefined || host == null) {
        alert("Failed to get Notification Configs.");
        return false;
    }
    var Maildata = Object.assign({}, MailObject);
    Maildata.data.Empnames = Empnames;
    Maildata.data.HDId = ResignDet[0].User_Name;
    Maildata.data.Emp_Code = ResignDet[0].Employee_Number;
    Maildata.data.Designation = desgn;
    Maildata.data.Name = ResignDet[0].Employee_Name;
    Maildata.data.Division = Userdivs;
    Maildata.data.HQ = $('#txtsearchRegion').text();
    Maildata.data.Remarks = ResignDet[0].Remarks;
    Maildata.data.DOR = ResignDet[0].DOR;
    Maildata.data.Remarks = Resignremarks;
    // Maildata.data.Entered_By = userName_g +'-'+ employeeName_g + '(' + EmployeeNo_g + ')';
    Maildata.data.to_mail = ccmaillst;
    Maildata.data.Mail_Sender_Name = CanSelSenderName;
    Maildata.data.Sender_Mail = CanSelFrommailid;
    Maildata.data.cc_mail = CanSelCCmailid;
    Maildata.data.req_id = "GUID190";
    console.log(Maildata);
    $.ajax({
        type: "POST",
        headers: reqHeader,
        url: host,
        data: JSON.stringify(Maildata),
        contentType: "application/json; charset=utf-8",
        success: function (resp) {
            if (resp.trim() != "") {
                var ApiPdfStatus = eval('(' + resp + ')');
                var text = "";
                var icon = "info";
                if (ApiPdfStatus.response.Code == "200") {
                    text = "Mail has been sent";
                    icon = "success";
                }
                else if (ApiPdfStatus.response.Code == "400") {
                    text = "Failure";
                }
                else if (ApiPdfStatus.response.Code == "204") {
                    text = "Invalid Mail";
                }
                else if (ApiPdfStatus.response.Code == "403") {
                    text = "Authentication Failed";
                }
                $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
            }
            else {
                // alert("Failed Sending Mail.");
                HideModalPopup('dvLoading');
                $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
            }
        },
        error: function (result) {
            //alert("Failed Sending Mail.");
            HideModalPopup('dvLoading');
            $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
        }
    });
    HideModalPopup('dvLoading');
}
function fnsendtransfermail(userCode) {
    debugger


    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetManagerEmpnumber',
        type: "POST",
        async: false,
        data: "UserCode=" + userCode,
        success: function (JsonResult) {
            var data = eval('(' + JsonResult + ')');

            if (data != null && data != '') {
                $('#btnccsave').prop('disabled', false);
                var CanSelFrommailid = '';
                var CanSelTomailid = '';
                var CanSelCCmailid = '';
                var CanSelSenderName = ''
                var TemplateName = "Employee_Transfer";
                //var Emailsubject = "Announcement";
                //var EmailDescription = "Employee has been Promoted/Re-Designated";
                var CanSelMailids = $.grep(FromEmailIdarr, function (element, index) {
                    return element.TemplateName == TemplateName;
                });
                if (CanSelMailids.length > 0) {
                    debugger
                    CanSelFrommailid = CanSelMailids[0].FromMail;
                }
                var CanSelMailids = $.grep(hrmsCCmailarr, function (element, index) {
                    return element.TemplateName == TemplateName;
                });
                if (CanSelMailids.length > 0) {
                    debugger
                    CanSelCCmailid = CanSelMailids[0].CCMail;
                }
                var CanSelMailids = $.grep(MailSenderNamearr, function (element, index) {
                    return element.TemplateName == TemplateName;
                });
                if (CanSelMailids.length > 0) {
                    debugger
                    CanSelSenderName = CanSelMailids[0].SenderName;
                }

                var ccmaillst = "";
                var Empnames = "";
                if (HirarchyMailarr.length > 0) {
                    debugger;
                    if (HirarchyMailarr.length == 1) {
                        ccmaillst = HirarchyMailarr[0].Email_Id;
                        Empnames = HirarchyMailarr[0].Employee_Name;
                    }
                    else {
                        for (var i = 0; i < HirarchyMailarr.length; i++) {
                            if (i == (HirarchyMailarr.length - 1)) {
                                ccmaillst += HirarchyMailarr[i].Email_Id;
                                Empnames = HirarchyMailarr[i].Employee_Name;
                            }
                            else {
                                ccmaillst += HirarchyMailarr[i].Email_Id + ',';
                                Empnames = HirarchyMailarr[i].Employee_Name + '/';
                            }
                        }
                    }
                }
                else {
                    ccmaillst = CanSelCCmailid;
                }

                var Doccall = $.grep(Templatedetails, function (element, index) {
                    return element.TemplateName == TemplateName;
                });
                var host = "";
                var reqHeader = null;
                var masterApiKey = ""

                if (Doccall != null) {
                    host = Doccall[0].HostName;
                    reqHeader = { "Master-api-key": Doccall[0].Master_Api_Key };
                    Company_Logo_Path = Doccall[0].Company_Logo_Path;
                    //Emailsubject = Emailsubject;
                    //EmailDescription = EmailDescription;

                }
                else {
                    alert("Failed to send Mail.");
                }

                if (host == "" || host == undefined || host == null) {
                    alert("Failed to get Notification Configs.");
                    return false;
                }
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var DOT = dd + '/' + mm + '/' + yyyy;
                //var OldMailData = Object.assign({}, MailObject);
                var Maildata = Object.assign({}, MailObject);
                //Employee Id: {{Emp_Id}}
                //Date of Joining: {{DOJ}}
                //DOT: {{DOT}}
                //Next level manager: {{NextManager}}
                // Maildata.data.Subject = Emailsub;

                //  old details //
                if (ExisUserdata != '') {
                    //var OldUserDetails = '';
                    var jsonresult = ExisUserdata;
                    if (ExisDiv != '') {
                        var data1 = eval('(' + ExisDiv + ')');
                        Maildata.data.OldDivision = data1[0].Division_Name;
                    }


                    Maildata.data.OldDesignation = jsonresult[0].User_Type_Name;
                    Maildata.data.OldManagerName = jsonresult[0].Reporting_Manager;
                    Maildata.data.OldHQName = jsonresult[0].Region_Name;
                    Maildata.data.OldReportingHQ = jsonresult[0].Reporting_Region;

                }
                Maildata.data.Subject = 'Announcement';
                //  Maildata.data.Description = 'Employee has been Promoted/Re-Designated';
                Maildata.data.Empnames = Empnames;
                Maildata.data.HDId = Userdetails[0].User_Name;
                Maildata.data.Emp_Id = data[0].User_Employee_Number;
                Maildata.data.Emp_Name = Userdetails[0].Employee_Name;
                Maildata.data.Designation = Userdetails[0].User_Type_Name;
                Maildata.data.HQ = Userdetails[0].Region_Name;
                Maildata.data.NewHQ = Userdetails[0].NewHQ;
                Maildata.data.DOJ = data[0].Date_of_Joining;
                Maildata.data.DOT = DOT;
                Maildata.data.Division = Userdetails[0].Division_Name;
                Maildata.data.Manager = data[0].Manager_Emp_Name + '-' + data[0].User_Type_Name + '-' + data[0].Manager_Employee_Number;
                if (Maildata.data.Designation != Maildata.data.OldDesignation) {
                    Maildata.data.Description = 'Employee has been Promoted/Re-Designated';
                }
                else {
                    Maildata.data.Description = 'Employee has been Transferred';

                }

                Maildata.data.to_mail = ccmaillst;
                Maildata.data.Mail_Sender_Name = CanSelSenderName;
                Maildata.data.Sender_Mail = CanSelFrommailid;
                Maildata.data.cc_mail = CanSelCCmailid;
                Maildata.data.req_id = "GUID140";
                console.log(Maildata);
                $.ajax({
                    type: "POST",
                    headers: reqHeader,
                    url: host,
                    data: JSON.stringify(Maildata),
                    contentType: "application/json; charset=utf-8",
                    success: function (resp) {
                        if (resp.trim() != "") {
                            var ApiPdfStatus = eval('(' + resp + ')');
                            var text = "";
                            var icon = "info";
                            if (ApiPdfStatus.response.Code == "200") {
                                text = "Mail has been sent";
                                icon = "success";
                            }
                            else if (ApiPdfStatus.response.Code == "400") {
                                text = "Failure";
                            }
                            else if (ApiPdfStatus.response.Code == "204") {
                                text = "Invalid Mail";
                            }
                            else if (ApiPdfStatus.response.Code == "403") {
                                text = "Authentication Failed";
                            }
                        }
                        else {
                            HideModalPopup('dvLoading');
                            //alert("Failed Sending Mail.");
                        }
                    },
                    error: function (result) {
                        HideModalPopup('dvLoading');
                        //alert("Failed Sending Mail.");
                    }
                });
            }
        }
    })

}
var kanglevalue = '';
function fnkangle() {
    debugger;
    kanglevalue = $("input[name='kangleaccess']").prop("checked");
    if (kanglevalue == true) {
        kanglevalue = 1;
    }
    else {
        kanglevalue = 0;
    }
}
var TPLockvalue = '';
function fnTPLockvalue() {
    debugger;
    TPLockvalue = $("input[name='TPaccess']").prop("checked");
    if ($('#btnShowtpbtn').is(':visible')) {
        if (TPLockvalue == true) {
            TPLockvalue = 1;
        }
        else {
            TPLockvalue = 0;
        }
    }
    else {
        TPLockvalue = 0;
    }
}
function fncheckmaildetails() {
    debugger
    // var IsMailNeeded = $('#Mailchk').attr('Checked') ? 1 : 0;
    //if ($('#btnShowtmailbtn').is(':visible') && $('#Mailchk').is(":checked")) {
    //if (CCMailarr.length > 0) {
    //    fnFinish();
    //}
    //else {
    //    fnMsgAlert('info', 'Info', 'Please Select Copy Holders.');
    //    return false;
    //}
    //} else {
    fnFinish();
    //}

}
function fnFinish() {
    debugger;
    btnclick = true;
    if (btnclick) {
        $('#btnfinish').attr('disabled', true);
        ShowModalPopup('dvLoading');
        var isSmsNeeded = $('#chksms').attr('Checked') ? 1 : 0;
        var IsMailNeeded = $('#Mailchk').attr('Checked') ? 1 : 0;
        var smsvalue = smsconfigValue;
        fnkangle();
        fnTPLockvalue();
        try {
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/InsertUserDetails',
                type: "POST",
                data: "value=" + kanglevalue + "&TPLockvalue=" + TPLockvalue,
                success: function (JsonResult) {
                    debugger;
                    var result = JsonResult.split(':')[0];
                    var errorresult = JsonResult.split(':')[1];
                    var userCode = JsonResult.split('-')[1];
                    fnGetKangleUserDetails(userCode, "INSERT");
                    debugger;
                    if (result.toUpperCase() == "SUCCESS") {
                        if (smsvalue.toUpperCase() == "YES" && isSmsNeeded == "1") {
                            fnsendSms(userCode);
                        }
                        if ($('#btnShowtmailbtn').is(':visible') && $('#Mailchk').is(":checked")) {
                            fnsendmail(userCode);
                        }
                        else if (userCreationWiz == '1') {
                            fnMsgAlert('success', 'Success', 'User Created Successfully.');
                            // alert("User Created Successfully.");
                            $('#btnfinish').attr('disabled', true);
                            $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
                        }
                            // fnGetMasterDataForUser();

                        else { // UsercreationWizard in Region & User Single Screen 
                            debugger;
                            fnMsgAlert('success', 'Success', 'User Created Successfully.');
                            fnreloaddirect();
                            //$('#main').load('HiDoctor_Master/UsercreationWizard/Home').hide();  // For session value prefilled avoid to load Home page                       
                            //$("#divPageHeader").html('Region & User Single Screen')
                            //$('#main').load('HiDoctor_Master/Organogram/Create').show();
                        }

                    }
                    else {
                        HideModalPopup('dvLoading');
                        fnMsgAlert('info', 'User Creation Wizard', '' + errorresult + '.Please click the Back button to navigate to the respective screens,correct the errors and retry.');
                    }
                    HideModalPopup('dvLoading');
                },
                error: function () {
                    fnMsgAlert("Get Activities failed.");
                    HideModalPopup('dvLoading');
                }
            });
        }
        catch (e) {
            HideModalPopup('dvLoading');
            alert(e.message);
        }
    }
}

function fnreloaddirect() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/Home',
        type: "POST",
        success: function () {
            $("#divPageHeader").html('Region & User Single Screen')
            $('#main').load('HiDoctor_Master/Organogram/Create');
        }
    });
}
function fnBackfinish(doj_g, hiDoctorStartDate_g) {
    ShowModalPopup('dvLoading');
    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNoticeBoard/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&hiDoctorStartDate=' + escape(hiDoctorStartDate_g) + '&doj=' + escape(doj_g));
    HideModalPopup('dvLoading');
}
//------------------END - CREATE NEW USER-------------------------------//

//-----------------START - DISABLE USER---------------------------------//


function fnGetEmployeeNumbertoDisable() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetEmployeedetailstoDisable',
        type: "POST",
        data: "A",
        async: false,
        success: function (jsData) {

            Json_Employeedetails_g = eval('(' + jsData + ')');
            var Json_EmployeeNames = eval('(' + jsData + ')');
            if (Json_EmployeeNames.length > 0 && Json_EmployeeNames != null && Json_EmployeeNames != '') {
                var baseEmployeeNames = "[";
                for (var i = 0; i < Json_EmployeeNames.length; i++) {
                    baseEmployeeNames += "{label:" + '"' + "" + Json_EmployeeNames[i].Employee_Number + "" + '",' + "value:" + '"' + "" + Json_EmployeeNames[i].Employee_Code + "" + '"' + "}";
                    if (i < Json_EmployeeNames.length - 1) {
                        baseEmployeeNames += ",";
                    }
                }
                baseEmployeeNames += "];";
                baseEmployeejson_g = eval(baseEmployeeNames);
                autoComplete(baseEmployeejson_g, "txtemployeeNo", "hdnSearchEmployeeNo", "GroupsearchemployeeNo");
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
}

function fnUserValidateRegionAutoFill(Id) {
    debugger;
    var UserName = $('#' + Id.id).val();
    if (UserName != "" && json_Userdetails_g.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < json_Userdetails_g.length; o++) {
            if (json_Userdetails_g[o].User_Name == UserName) {
                i = true;
                s = json_Userdetails_g[o].User_Code;
            }
        }
        if (!i) {
            $("#hdnsearchUserCode").val(0);
        }
        else {
            $("#hdnsearchUserCode").val(s);
            fnGetemployeeNamebyUsercode();
        }
    } else {
        $("#hdnsearchUserCode").val(0);
    }
}

function fnGetChildUsers() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetChildUsers',
        type: "POST",
        async: false,
        success: function (JsonResult) {

            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    json_GetchildUsers = eval('(' + JsonResult + ')');
                    var jsDate = eval('(' + JsonResult + ')');
                    if (jsDate.length > 0 && jsDate != null && jsDate != '') {
                    }
                }
            }
        },
        error: function () {
            fnMsgAlert("Get Child count failed.")
        }
    });
}

//Used to Get User region
function fnGetRegionstoDisable() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetChildregiontoDisable',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            debugger;

            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    Json_Regiondetails_g = eval('(' + JsonResult + ')');
                    var Json_Region = eval('(' + JsonResult + ')');
                    if (Json_Region.length > 0 && Json_Region != null && Json_Region != '') {
                        var baseRegions = "[";
                        for (var i = 0; i < Json_Region.length; i++) {
                            baseRegions += "{label:" + '"' + "" + Json_Region[i].Region_Name + "" + '",' + "value:" + '"' + "" + Json_Region[i].Region_Code + "" + '"' + "}";
                            if (i < Json_Region.length - 1) {
                                baseRegions += ",";
                            }
                        }
                        baseRegions += "];";
                        baseRegionsjson_g = eval(baseRegions);
                        autoComplete(baseRegionsjson_g, "txtsearchRegion", "hdnSearchregion", "Groupsearchregion");
                    }
                }
            }
        },
        error: function () {
            fnMsgAlert("Get Regions failed.")
        }
    });
}

function fnGetemployeeNamebyEmployeecode() {

    var empName = $.trim($("#txtemployeeNo").val());
    var disJson = jsonPath(Json_Employeedetails_g, "$.[?(@.Employee_Number=='" + empName + "')]");

    if (disJson != false) {
        $("#hdnSearchEmployeeNo").val(disJson[0].Employee_Code)
    }
    else {
        $("#hdnSearchEmployeeNo").val('');
    }

    if ($("#txtemployeeNo").val() != '') {
        if ($("#hdnSearchEmployeeNo").val() == '') {
            fnMsgAlert('info', 'Info', 'Please Enter a valid Employee Number.');
            return false;
        }
    }

    var EmployeeCode = $('#hdnSearchEmployeeNo').val();
    if (EmployeeCode != null && EmployeeCode != '') {
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/GetEmployeeNamebyEmployeeCode',
            type: "POST",
            data: "employeeCode=" + EmployeeCode,
            success: function (jsData) {

                var Json_EmployeeName = eval('(' + jsData + ')');
                if (Json_EmployeeName.length > 0 && Json_EmployeeName != null && Json_EmployeeName != '') {
                    var empName = Json_EmployeeName[0].Employee_Name;
                    var userName = Json_EmployeeName[0].User_Name;
                    var regionName = Json_EmployeeName[0].Region_Name;
                    var employeeNo = Json_EmployeeName[0].Employee_Number;
                    var empCode = Json_EmployeeName[0].Employee_Code;
                    if (empCode != '' && empCode != null) {
                        $('#txtsearchEmpname').val(empName);
                        $('#txtsearchRegion').val(regionName);
                        $('#txtemployeeNo').val(employeeNo);
                        $('#txtSearhUserId').val(userName);
                        $('#hdndisableEmployeeCode').val(empCode);
                        $('#btnGO').focus();
                    }
                }

            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            }
        });
    }
}

function fnGetemployeeNamebyRegioncode() {
    var regionName = $.trim($("#txtsearchRegion").val());
    var disJson = jsonPath(Json_Regiondetails_g, "$.[?(@.Region_Name=='" + regionName + "')]");

    if (disJson != false) {
        $("#hdnSearchregion").val(disJson[0].Region_Code)
    }
    else {
        $("#hdnSearchregion").val('');
    }

    if ($("#txtsearchRegion").val() != '') {
        if ($("#hdnSearchregion").val() == '') {
            fnMsgAlert('info', 'Info', 'Please Enter a valid Region Name.');
            return false;
        }
    }

    var RegionCode = $('#hdnSearchregion').val();
    if (RegionCode != null && RegionCode != '') {
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/GetEmployeeNamebyRegionCode',
            type: "POST",
            data: "regionCode=" + RegionCode,
            success: function (jsData) {
                var Json_EmployeeName = eval('(' + jsData + ')');
                if (Json_EmployeeName.length > 0 && Json_EmployeeName != null && Json_EmployeeName != '') {
                    var empName = Json_EmployeeName[0].Employee_Name;
                    var userName = Json_EmployeeName[0].User_Name;
                    var regionName = Json_EmployeeName[0].Region_Name;
                    var employeeNo = Json_EmployeeName[0].Employee_Number;
                    var empCode = Json_EmployeeName[0].Employee_Code;
                    if (regionName != '' && regionName != null) {
                        $('#txtsearchEmpname').val(empName);
                        //$('#txtsearchRegion').val(regionName);
                        $('#txtemployeeNo').val(employeeNo);
                        $('#txtSearhUserId').val(userName);
                        $('#hdndisableEmployeeCode').val(empCode);
                        $('#btnGO').focus();
                    }
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            }
        });
    }
}

//function fnBackdisableUser() {
//    $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
//}

function fnBackfinishDisable(entrymode) {

    $('#main').load('../HiDoctor_Master/UsercreationWizard/DisableUser/?userCode=' + escape(UserCode_g) + '&userName=' + escape(userName_g) + '&disableDate=' + escape(disabledate_g) + '&employeeCode=' + escape(EmployeeCode_g) + '&entryMode=' + escape(entrymode));
}

//-----------------END - DISABLE USER----------------------------------/

function fnValidateRegionAutoFill(Id) {
    debugger;
    var UserName = $('#' + Id.id).val();
    if (UserName != "" && UserDetails.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < UserDetails.length; o++) {
            if (UserDetails[o].label == UserName) {
                i = true;
                s = UserDetails[o].value;
            }
        }
        if (!i) {
            $("#hdnUserCode").val(0);
        }
        else {
            $("#hdnUserCode").val(s);
        }
    } else {
        $("#hdnUserCode").val(0);
    }
}

function fnNextLeavechange() {
    debugger;
    //var User = $("#hdnUserCode").val();
    var result = fnValidateLeaveDetails();
    if (result) {
        var leaveDetails_arr = new Array();
        var leaveCount = $('#hdnLeavecount').val();
        var leavevalue = 0;
        try {
            ShowModalPopup('dvLoading');
            //$('#dvPanel').block({
            //    message: '<h3>Loading...</h3>',
            //    css: { border: '2px solid #ddd' }
            //});
            if (leaveCount != '' && leaveCount != null) {
                if (leaveCount > 0) {
                    for (var i = 0 ; i < leaveCount ; i++) {
                        var leavedetails = {};
                        leavedetails.Leave_Type_Code = $('#hdnLeaveTypeCode_' + i).val();
                        leavedetails.Leave_Type_Name = $('#txtLeaveTypeName_' + i).html();
                        leavedetails.User_Type_Code = Usertypecode_g;
                        var leave = $('#txtleave_' + i).val();
                        if (leave == "") {
                            leavevalue = 0;
                        }
                        else {
                            leavevalue = leave
                        }
                        leavedetails.Leave_Eligible = leavevalue;
                        leavedetails.Opening_Balance = leavevalue;
                        leavedetails.Leave_Balance = leavevalue;
                        leaveDetails_arr.push(leavedetails);
                    }
                }
                $.ajax({
                    url: '../HiDoctor_Master/UsercreationWizard/GetLeaveDetailsList',
                    type: "POST",
                    data: "leavedetails_Arr=" + JSON.stringify(leaveDetails_arr),
                    success: function (Jsonresult) {
                        debugger;
                        if (Jsonresult != null && Jsonresult != '') {
                            if (Jsonresult.length > 0) {
                                $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMappinghierarchy/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + '&UserregionCode=' + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&Usercode=' + escape(UserCode));
                            }
                        }
                        else {
                            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMappinghierarchy/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + '&UserregionCode=' + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g) + '&Usercode=' + escape(UserCode));
                        }
                        HideModalPopup('dvLoading');
                        //$('#dvPanel').unblock();
                    },
                    error: function (e) {
                        fnMsgAlert('info', '', 'Error.' + e.Message);
                        HideModalPopup('dvLoading');
                        //$('#dvPanel').unblock();
                    },
                    complete: function () {
                        HideModalPopup('dvLoading');
                        // $('#dvPanel').unblock();
                    }
                });
            }

        }
        catch (e) {

            // $('#dvPanel').unblock();
        }
    }
}
function fnfinishUserProduct() {
    debugger;
    btnclick = true;
    if (btnclick) {
        ShowModalPopup('dvLoading');

        // var USERCODE=$("#hdnUserCode").val();
        try {
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/UpdateUser',
                type: "POST",
                data: "UserCode=" + UserCode,
                success: function (JsonResult) {
                    debugger;
                    //var result = JsonResult.split(':')[0];
                    //var errorresult = JsonResult.split(':')[1];
                    //var userCode = JsonResult.split('-')[1];
                    debugger;
                    if (JsonResult == "") {
                        if (sendmail == 1) {

                            fnsendtransfermail(UserCode);
                        }
                        //  if (userCreationWiz == '1') {
                        fnMsgAlert('success', 'Success', 'User information saved Successfully.');
                        //  alert("User information saved Successfully.");
                        $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
                        // }
                        // fnGetMasterDataForUser();

                        //else { // UsercreationWizard in Region & User Single Screen 
                        //    debugger;
                        //    alert("User Created Successfully.");
                        //    fnreloaddirect();
                        //    //$('#main').load('HiDoctor_Master/UsercreationWizard/Home').hide();  // For session value prefilled avoid to load Home page                       
                        //    //$("#divPageHeader").html('Region & User Single Screen')
                        //    //$('#main').load('HiDoctor_Master/Organogram/Create').show();
                        //}

                    }
                    else {
                        HideModalPopup('dvLoading');
                        fnMsgAlert('info', 'User Createion Wizard', '' + errorresult + '.Please click the Back button to navigate to the respective screens,correct the errors and retry.');
                    }
                    HideModalPopup('dvLoading');
                },
                error: function () {
                    fnMsgAlert("Get Activities failed.");
                    HideModalPopup('dvLoading');
                }
            });
        }
        catch (e) {
            HideModalPopup('dvLoading');
            alert(e.message);
        }
    }
}
function fnNextUserProductchange() {
    debugger;
    // var result = fnValidateProductdetails();
    //  if (result) {
    try {
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        var UserProductdetails_arr = new Array();
        var productcount = $('#hdnproductcount').val();
        var count_Validate = 0;
        var SpecialCharacter = 0;
        var ng_value = 0;
        var decimal_value = 0;
        var prod_name = "";
        var min_count = 0;
        var max_count = 0;
        fnGetMinMaxConfig();
        if (productcount > 0) {
            $("input:checkbox[name=chkSelectAll]").attr('checked', false);
            debugger;
            $("input:checkbox[name=chkSelect]").each(function () {
                var productdetails = {};
                var selectedvalues = $(this).val();
                if (min_max_config_global == "YES") {
                    min_count = $(this).parent().parent().children().find('input')[1].value;
                    max_count = $(this).parent().parent().children().find('input')[2].value;
                }
                else {
                    min_count = 0;
                    max_count = 0;
                }
                selectedvalues = selectedvalues + '|' + min_count + '|' + max_count;
                if ($(this).is(":checked")) {
                    productdetails.Product_Code = selectedvalues.split('|')[0];
                    productdetails.Product_Name = selectedvalues.split('|')[1];
                    productdetails.Product_Type = selectedvalues.split('|')[2];
                    productdetails.Current_Stock = 0;
                    productdetails.Product_Type_Name = selectedvalues.split('|')[3];
                    productdetails.User_Type_Code = Usertypecode_g;
                    productdetails.Min_Count = selectedvalues.split('|')[4];
                    productdetails.Max_Count = selectedvalues.split('|')[5];
                    if (productdetails.Min_Count > productdetails.Max_Count) {
                        count_Validate = 1;
                    }
                    if (productdetails.Min_Count == '' || productdetails.Min_Count == null || productdetails.Min_Count == undefined) {
                        SpecialCharacter = 1;
                    }
                    if (productdetails.Max_Count == '' || productdetails.Max_Count == null || productdetails.Max_Count == undefined) {
                        SpecialCharacter = 1;
                    }
                    if (productdetails.Min_Count < 0 || productdetails.Max_Count < 0) {
                        ng_value = 1;
                    }
                    var regex = new RegExp("[.]");
                    if (regex.test(productdetails.Min_Count)) {
                        decimal_value = 1;
                    }
                    if (regex.test(productdetails.Max_Count)) {
                        decimal_value = 1;
                    }
                    if (count_Validate == 1 || SpecialCharacter == 1 || ng_value == 1 || decimal_value == 1) {
                        if (prod_name == "") {
                            prod_name = selectedvalues.split('|')[1];
                        }
                    }
                    UserProductdetails_arr.push(productdetails);
                }
            });
            if (SpecialCharacter == 1) {
                $('#dvPanel').unblock();
                fnMsgAlert('info', 'Info', 'Please enter only numbers in Min Count and Max Count for ' + prod_name + '. <b>Do not keep empty boxes for selected products</b>');
                return false;
            }
            else if (count_Validate == 1) {
                $('#dvPanel').unblock();
                fnMsgAlert('info', 'Info', 'Min Count cannot be greater than Max count in ' + prod_name + '.');
                return false;
            }
            else if (ng_value == 1) {
                $('#dvPanel').unblock();
                fnMsgAlert('info', 'Info', 'Min Count and Max Count cannot be less than 0 for ' + prod_name + '.');
                return false;
            }
            else if (decimal_value == 1) {
                $('#dvPanel').unblock();
                fnMsgAlert('info', 'Info', 'Please do not enter decimal numbers in Min Count and Max Count for ' + prod_name + '.');
                return false;
            }
            else {
                $.ajax({
                    url: '../HiDoctor_Master/UsercreationWizard/GetUserProductMappingdetails',
                    type: "POST",
                    data: "productdetails_Arr=" + encodeURIComponent(JSON.stringify(UserProductdetails_arr)),
                    success: function (Jsonresult) {
                        debugger;
                        if (Jsonresult != null && Jsonresult != '') {
                            if (Jsonresult.length > 0) {
                                fnfinishUserProduct();
                                // $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNoticeBoard/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g));
                            }
                        }
                        $('#dvPanel').unblock();
                    },
                    error: function (e) {
                        fnMsgAlert('info', '', 'Error.' + e.Message);
                        $('#dvPanel').unblock();
                    },
                    complete: function () {
                        $('#dvPanel').unblock();
                    }
                });
            }
        }
        else {
            fnfinishUserProduct();
            //$('#main').load('../HiDoctor_Master/UsercreationWizard/CreateNoticeBoard/?employeeName=' + escape(employeeName_g) + '&userType=' + escape(userTypename_g) + '&divisionName=' + escape(divisionName_g) + '&regionName=' + escape(regionName_g) + '&userTypecode=' + escape(Usertypecode_g) + '&divisionCode=' + escape(divisionCode_g) + '&entryMode=' + escape(entrymode_g) + "&UserregionCode=" + escape(userRegionCode_g) + '&reportingmanagerusercode=' + escape(reportingmanagerUsercode_g));
        }
        $('#dvPanel').unblock();
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
    // }
}

function fnUpdateUser() {
    debugger;

    //if ($('#btnShowtmailbtn').is(':visible') && $('#Mailchk').is(":checked")) {
    //    if (HirarchyMailarr.length == 0) {
    //        //fnMsgAlert('info', 'Info', 'Please Select Copy Holders.');
    //        //HideModalPopup('dvLoading');
    //        //return false;
    //    }
    //}
    var count_Validate = 0;
    var SpecialCharacter = 0;
    var ng_value = 0;
    var UserProductdetails_arr = new Array();
    var productcount = $('#hdnproductcount').val();
    var decimal_value = 0;
    var prod_name = "";
    var min_count = 0;
    var max_count = 0;
    fnGetMinMaxConfig();
    debugger;
    if (productcount > 0) {
        $("input:checkbox[name=chkSelectAll]").attr('checked', false);
        $("input:checkbox[name=chkSelect]").each(function () {
            var productdetails = {};
            var selectedvalues = $(this).val();
            if (min_max_config_global == "YES") {
                min_count = $(this).parent().parent().children().find('input')[1].value;
                max_count = $(this).parent().parent().children().find('input')[2].value;
            }
            else {
                min_count = 0;
                max_count = 0;
            }
            selectedvalues = selectedvalues + '|' + min_count + '|' + max_count;

            if ($(this).is(":checked")) {
                productdetails.Product_Code = selectedvalues.split('|')[0];
                productdetails.Product_Name = selectedvalues.split('|')[1];

                productdetails.Product_Type = selectedvalues.split('|')[2];
                productdetails.Current_Stock = 0;
                productdetails.Product_Type_Name = selectedvalues.split('|')[3];
                productdetails.User_Type_Code = Usertypecode_g;
                productdetails.Min_Count = selectedvalues.split('|')[4];
                productdetails.Max_Count = selectedvalues.split('|')[5];
                if (productdetails.Min_Count > productdetails.Max_Count) {
                    count_Validate = 1;
                }
                if (productdetails.Min_Count == '' || productdetails.Min_Count == null || productdetails.Min_Count == undefined) {
                    SpecialCharacter = 1;
                }
                if (productdetails.Max_Count == '' || productdetails.Max_Count == null || productdetails.Max_Count == undefined) {
                    SpecialCharacter = 1;
                }
                if (productdetails.Min_Count < 0 || productdetails.Max_Count < 0) {
                    ng_value = 1;
                }
                var regex = new RegExp("[.]");
                if (regex.test(productdetails.Min_Count)) {
                    decimal_value = 1;
                }
                if (regex.test(productdetails.Max_Count)) {
                    decimal_value = 1;
                }
                if (count_Validate == 1 || SpecialCharacter == 1 || ng_value == 1 || decimal_value == 1) {
                    if (prod_name == "") {
                        prod_name = selectedvalues.split('|')[1];
                    }
                }

                UserProductdetails_arr.push(productdetails);
            }
        });
        if (SpecialCharacter == 1) {
            $('#dvPanel').unblock();
            fnMsgAlert('info', 'Info', 'Please enter only numbers in Min Count and Max Count for ' + prod_name + '. <b>Do not keep empty boxes for selected products</b>');
            return false;
        }
        else if (count_Validate == 1) {
            $('#dvPanel').unblock();
            fnMsgAlert('info', 'Info', 'Min Count cannot be greater than Max count in ' + prod_name + '.');
            return false;
        }
        else if (ng_value == 1) {
            $('#dvPanel').unblock();
            fnMsgAlert('info', 'Info', 'Min Count and Max Count cannot be less than 0 for ' + prod_name + '.');
            return false;
        }
        else if (decimal_value == 1) {
            $('#dvPanel').unblock();
            fnMsgAlert('info', 'Info', 'Please do not enter decimal numbers in Min Count and Max Count for ' + prod_name + '.');
            return false;
        }
        else {
            $.ajax({
                type: 'GET',
                url: '../HiDoctor_Master/UsercreationWizard/UpdateUserDetailsFromSession',
                success: function (result) {
                    debugger;

                    fnGetKangleUserDetails(result, "EDIT");
                    fnUpdateUserIndex();
                    fnNextUserProductchange();
                }
            });
        }
    }
    else {
        $.ajax({
            type: 'GET',
            url: '../HiDoctor_Master/UsercreationWizard/UpdateUserDetailsFromSession',
            success: function (result) {
                debugger;
                fnGetKangleUserDetails(result, "EDIT");
                fnUpdateUserIndex();
                fnNextUserProductchange();
            }
        });
    }
}


function fnEdetailingdata(message) {
    debugger;
    var Content = '';
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetEdetailingdetails',
        type: "POST",
        async: false,
        data: "message=" + message,
        success: function (JsonResult) {
            debugger;
            //var jsonresult = eval('(' + JsonResult + ')');
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    $("#divEdetailing").html(JsonResult);
                }
            }

        }
    });
}
function fnprivilege() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetPriviligevalue',
        type: "POST",
        async: false,
        data: "Usertypecode=" + Usertypecode_g,
        success: function (JsonResult) {
            debugger;
            var jsonresult = eval('(' + JsonResult + ')');
            if (jsonresult.length > 0) {
                if (jsonresult[0].Record_status != 0) {
                    $("#btnShowtpbtn").show();
                }
            }
        }
    });
}
function fngetmaildetails() {
    debugger
    Usertypecode_g = $('select[name="ddlDesignation"]').val();
    fnmailprivilege();
}
function fnmailprivilege() {
    $("#btnShowtmailbtn").hide();
    sendmail = 0;
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetMailPriviligevalue',
        type: "POST",
        async: false,
        data: "Usertypecode=" + Usertypecode_g,
        success: function (JsonResult) {
            debugger;
            var jsonresult = eval('(' + JsonResult + ')');
            if (jsonresult.length > 0) {
                if (jsonresult[0].Privilege_Value_name == "YES") {
                    $("#btnShowtmailbtn").show();

                    sendmail = 1;
                }
            }
        }
    });

}

function fnAllmailprivilege() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetAllMailPriviligevalue',
        type: "POST",
        async: false,
        data: "",
        success: function (JsonResult) {
            debugger;
            var jsonresult = eval('(' + JsonResult + ')');
            if (jsonresult.length > 0) {
                Maildetails = jsonresult;
            }
        }
    });

}



//***********************************************************Common Functions Start*****************************************************************//
function fnGetUserTypes() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetUserType',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            debugger;
            Json_userTypes = JsonResult;
            //if (Json_userTypes != null && Json_userTypes != '') {
            //    if (Json_userTypes.length > 0) {
            //        var jsonresult = eval('(' + Json_userTypes + ')');
            //        var selectcolumn = $("#ddlDesignation");
            //        selectcolumn.append("<option value=0>-Select Designation-</option>");
            //        for (var i = 0; i < jsonresult.length; i++) {
            //            selectcolumn.append("<option value=" + jsonresult[i].User_Type_Code + ">" + jsonresult[i].User_Type_Name + "</option>");
            //        }
            //    }
            //}
            var lstusertype = [];
            var jsonresult = eval('(' + Json_userTypes + ')');
            // var Json_EmployeeNames = eval('(' + jsData + ')');
            for (var i = 0; i < jsonresult.length; i++) {
                _objData = {};
                _objData.id = jsonresult[i].User_Type_Code;
                _objData.label = jsonresult[i].User_Type_Name;
                lstusertype.push(_objData);
            }
            $('#dvDesignation').empty();
            $('#dvDesignation').html('<input type="text" id="ddlDesignation" onblur="fnValidateDesignationAutoFill(this);" placeholder="Select Designation..">')
            $('#dvDesignation').html('<input type="text" id="ddlDesignation" onchange="fnbtnchange();">')
            //if (lstEmployee.length > 0) {
            Usertypedetails = lstusertype;
            var valueArr = [];
            //valueArr.push(lstEmployee[0].label);
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstusertype,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select a Designation',
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstusertype, dropdown_query);
                }

            });
            atcObj.appendTo('#ddlDesignation');
        },
        error: function () {
            fnMsgAlert("Get Desigantions failed.");

        }
    });
}




/////////   Actual Reporting manager

function fngetActualReportingmanager(divisionCode) {
    debugger;
    //var Company_code = CompanyCode;
    //Company_Code;
    $.ajax({
        async: false,
        url: '../HiDoctor_Master/UsercreationWizard/GetActuluser',
        type: "POST",
        data: "divisionCode=" + divisionCode,
        async: false,
        success: function (jsData) {
            debugger;
            $('#dvddlActualreport').empty();
            $('#dvddlActualreport').html('<input type="text" id="ddlActual">');
            var lstUser = [];
             Json_UserNames = eval('(' + jsData + ')');
            for (var i = 0; i < Json_UserNames.length; i++) {
                _objData = {};
                _objData.id = Json_UserNames[i].User_Code;
                _objData.label = Json_UserNames[i].User_Name;
                lstUser.push(_objData);
            }
            // if (lstUser.length > 0) {
            UserDetails = lstUser;
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstUser,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select a  Actual user',
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstUser, dropdown_query);
                }
            });
            atcObj.appendTo('#ddlActual');
            //}
            // }



            //////Actual reporting user//////



        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });

}

//Used to Get Reporting to region
function fnGetReportingtoRegions() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetRegions',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            debugger;
            Json_reportingtoRegions = JsonResult;
            //if (Json_reportingtoRegions != null && Json_reportingtoRegions != '') {
            //    if (Json_reportingtoRegions.length > 0) {
            //        var jsonresult = eval('(' + Json_reportingtoRegions + ')');
            //        var selectcolumn = $("#ddlreportingManagerregion");
            //        //selectcolumn.append("<option value=0>-Select Reporting to Region-</option>");
            //        for (var i = 0; i < jsonresult.length; i++) {
            //            selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
            //        }
            //    }
            //}
            $('#dvReportingManagerRegion').empty();
            $('#dvReportingManagerRegion').html('<input type="text" id="ddlreportingManagerregion" onblur="fnValidateRegionAutoFill(this);" placeholder="Reporting to Region">');
            $('#dvddlUserRegionchange').empty();
            $('#dvddlUserRegionchange').html(' <input type="text" id="ddlUserRegionchange">');
            var lstreportingreg = [];
            var jsonresult = eval('(' + Json_reportingtoRegions + ')');
            // var Json_EmployeeNames = eval('(' + jsData + ')');
            for (var i = 0; i < jsonresult.length; i++) {
                _objData = {};
                _objData.id = jsonresult[i].Region_Code;
                _objData.label = jsonresult[i].Region_Name;
                lstreportingreg.push(_objData);
            }
            //if (lstEmployee.length > 0) {
            regiondetails = lstreportingreg;
            var valueArr = [];
            //valueArr.push(lstEmployee[0].label);
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstreportingreg,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select a Reporting to region',
                //  value: valueArr

                //change: StockiestMaster.fnGetStockiestDetails(), 
                change: fnChangeUnderRegionsBySelectedRegion,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstreportingreg, dropdown_query);
                }
            });
            atcObj.appendTo('#ddlreportingManagerregion');
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstreportingreg,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select a Reporting to region',
                //  value: valueArr
                //change: StockiestMaster.fnGetStockiestDetails(),
                change: fnCheckReportingManageChange,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstreportingreg, dropdown_query);
                }
            });
            atcObj.appendTo('#ddlUserRegionchange');
        },
        error: function () {
            fnMsgAlert("Get Reporting to Regions failed.");
        }
    });
}

function fnChangeUnderRegionsBySelectedRegion(args) {
    debugger;
    if (args.isInteracted && args.itemData != null) {
        fnGetReportingmanagerByregion();
    }
    else {
        $('#showTree').show();
        return true;
    }
}

function fnCheckReportingManageChange(args) {
    if (args.isInteracted && args.itemData != null) {
        fnGetReportingmanagerByregionchange()
    } else {
        return true;
    }
}

//Get Reporting Manager by selected Region
function fnGetReportingmanagerByregion() {
    debugger;
    $("#bindreportingusers").html('');
    if ($('#ddlDivision').val() == null || $('#ddlDivision').val() == '0') {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select Division');
        $('#ddlreportingManagerregion').val('');
        //$('#ddlreportingManagerregion').val(0);
        $('#dvPanel').unblock();
        return false;
    }
    try {
        var selectedRegionCode = $('select[name="ddlreportingManagerregion"]').val();// $('#ddlreportingManagerregion option:selected').val();
        if (selectedRegionCode != null && selectedRegionCode != '') {
            if (selectedRegionCode == 0) {
                $("#lblregionstatus").html('');
                //$("#ddlReportingManager").val(0);
            }
            $('#dvPanel').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/CheckVacantRegionOrnot',
                type: "POST",
                async: false,
                data: "regionCode=" + selectedRegionCode,
                success: function (JsonResult) {
                    debugger;
                    if (JsonResult == '') {
                        $('#lblregionstatus').html('');
                    }
                    if (JsonResult != null && JsonResult != '') {
                        if (JsonResult == "VACANT" || JsonResult == "UNASSIGNED") {
                            $('#lblregionstatus').html('This Region is ' + JsonResult + '.Please select another Reporting-To-Region.');
                            $('#showtree').hide();
                        }
                        if ($("#ddlreportingManagerregion").val() == 0 && JsonResult == "UNASSIGNED") {
                            $('#lblregionstatus').html('');
                        }
                        if ($("#ddlreportingManagerregion").val() == 0 && JsonResult == "ACTIVE") {
                            $('#lblregionstatus').html('');
                            $('#showtree').hide();
                        }
                        if (selectedRegionCode == 0) {

                            var selectcolumn = $("#ddlReportingManager");
                            $(selectcolumn).html('');
                            selectcolumn.append("<option value=0>-Select Reporting Manager-</option>");

                        }
                        else {
                            $.ajax({
                                url: '../HiDoctor_Master/UsercreationWizard/GetUsersbyRegion',
                                type: "POST",
                                async: false,
                                data: "regionCode=" + selectedRegionCode,
                                success: function (JsonResult) {
                                    debugger;
                                    $('#dvManagerChange').empty();
                                    $('#dvManagerChange').html('<input type="text" id="ddlReportingManager" >');
                                    var lstManagerName = [];
                                    //  fngetreportingusers();
                                    if (JsonResult != null && JsonResult != '') {
                                        if (JsonResult.length > 0) {

                                            var jsonresult = eval('(' + JsonResult + ')');

                                            for (var i = 0; i < jsonresult.length; i++) {
                                                _objData = {};
                                                _objData.id = jsonresult[i].User_Code;
                                                _objData.label = jsonresult[i].User_Name;
                                                lstManagerName.push(_objData);
                                            }

                                            regiondetails = lstManagerName;
                                            var valueArr = [];
                                            var atcObj = new ej.dropdowns.DropDownList({
                                                //set the data to dataSource property
                                                dataSource: lstManagerName,
                                                fields: { text: 'label', value: 'id' },
                                                filterBarPlaceholder: 'Search',
                                                showClearButton: true,
                                                allowFiltering: true,
                                                placeholder: "Select Reporting Manager",
                                                index: 0,
                                                value: JsonResult[0].User_Code,
                                                //change: fnCheckSelectedRegionsStatus,
                                                filtering: function (e) {
                                                    var dropdown_query = new ej.data.Query();
                                                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                                    e.updateData(lstManagerName, dropdown_query);
                                                }

                                            });
                                            atcObj.appendTo('#ddlReportingManager');

                                            // $("#ddlReportingManager option").remove();
                                            //if (jsonresult.length == 1) {
                                            //     $("#ddlReportingManager").val(jsonresult[0].User_Name);
                                            //}
                                            //else{
                                            // var selectcolumn = $("#ddlReportingManager");

                                            //if (jsonresult.length == 1) {

                                            //    selectcolumn.append("<option value=" + jsonresult[0].User_Code + ">" + jsonresult[0].User_Name + "</option>");
                                            //    $('#lblregionstatus').html('')
                                            //    $('#showtree').show();
                                            //}

                                            //else {
                                            //    selectcolumn.append("<option value=0>-Select Reporting Manager-</option>");
                                            //    for (var i = 0; i < jsonresult.length; i++) {
                                            //        selectcolumn.append("<option value=" + jsonresult[i].User_Code + ">" + jsonresult[i].User_Name + "</option>");
                                            //        $('#lblregionstatus').html('');
                                            //        $('#showtree').show();
                                            //    }
                                            //}
                                            // }
                                            fnGetUserRegionByregionCode();
                                            //   $('#lblregionstatus').html('');
                                            $('#dvPanel').unblock();
                                        }
                                    }
                                    // $('#lblregionstatus').html('');
                                    $('#dvPanel').unblock();
                                },
                                error: function () {
                                    fnMsgAlert("Get Reporting Managers failed.")
                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                    }
                    $('#dvPanel').unblock();
                },
                error: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
        else {
            fnGetReportingtoUsers();
            fnGetRegions();
            $('#dvPanel').unblock();
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
}

//Used to get All reporting user
function fnGetReportingtoUsers() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetUser',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            debugger;
            var lstManagerName = [];
            //Json_Users = JsonResult;
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    var jsonresult = eval('(' + JsonResult + ')');

                    for (var i = 0; i < jsonresult.length; i++) {
                        _objData = {};
                        _objData.id = jsonresult[i].User_Code;
                        _objData.label = jsonresult[i].User_Name;
                        lstManagerName.push(_objData);
                    }

                    regiondetails = lstManagerName;
                    var valueArr = [];
                    //var selectcolumn = $("#ddlReportingManager");
                    //$("#ddlReportingManager option").remove();
                    //selectcolumn.append('<option value="0">-Select Reporting Manager-</option>');

                    //for (var i = 0; i < jsonresult.length; i++) {
                    //    selectcolumn.append("<option value=" + jsonresult[i].User_Code + ">" + jsonresult[i].User_Name + "</option>");
                    //}
                }
            }

            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstManagerName,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,

                placeholder: "Select Reporting Manager",
                //change: fnCheckSelectedRegionsStatus,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstManagerName, dropdown_query);
                }

            });
            atcObj.appendTo('#ddlReportingManager');
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstManagerName,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,

                placeholder: "Select Reporting Manager",
                //change: fnCheckSelectedRegionsStatus,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstManagerName, dropdown_query);
                }

            });
            atcObj.appendTo('#ddlReportingManagerchange');


        },
        error: function () {
            fnMsgAlert("Get Reporting Managers failed.");
        }
    });
}

//Get User Regions By regionCode
function fnGetUserRegionByregionCode() {
    var selectedRegionCode = $('select[name="ddlreportingManagerregion"]').val()//$('#ddlreportingManagerregion option:selected').val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetRegionsbyRegion',
        type: "POST",
        async: false,
        data: "regionCode=" + selectedRegionCode,
        success: function (JsonResult) {
            var lstuserregion = [];
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    var jsonresult = eval('(' + JsonResult + ')');
                    $('#dvUsersRegion').empty();
                    $('#dvUsersRegion').html('<input type="text" id="ddlUserRegion">');

                    for (var i = 0; i < jsonresult.length; i++) {
                        _objData = {};
                        _objData.id = jsonresult[i].Region_Code;
                        _objData.label = jsonresult[i].Region_Name;
                        lstuserregion.push(_objData);
                    }
                    //if (lstEmployee.length > 0) {
                    regiondetails = lstuserregion;
                    var valueArr = [];
                }
            }
            //valueArr.push(lstEmployee[0].label);
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstuserregion,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: "Select User's region",
                change: fnCheckSelectedRegionsStatus,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstuserregion, dropdown_query);
                }

            });
            atcObj.appendTo('#ddlUserRegion');
            //$("#ddlUserRegion option").remove();
            //var selectcolumn = $("#ddlUserRegion");
            //selectcolumn.append("<option value=0>-Select Region-</option>");
            //for (var i = 0; i < jsonresult.length; i++) {
            //    selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
            //    //selregion = jsonresult[i].Region_Code;
            //}

        },
        error: function () {
            fnMsgAlert("Get Regions failed.")
        }
    });
}

function fnCheckSelectedRegionsStatus(args) {
    if (args.isInteracted && args.itemData != null) {
        fnChangeUserregion();
        fngetreportingusers();
    } else {
        return true;
    }

}

//Used to Get User region
function fnGetRegions() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetRegions',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            debugger;
            Json_regions = JsonResult;
            //if (Json_regions != null && Json_regions != '') {
            //    if (Json_regions.length > 0) {
            //        var jsonresult = eval('(' + Json_regions + ')');
            //        var selectcolumn = $("#ddlUserRegion");
            //        //selectcolumn.append("<option value=0>-Select Region-</option>");
            //        for (var i = 0; i < jsonresult.length; i++) {
            //            selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");

            //        }
            //    }
            //}
            $('#dvUsersRegion').empty();
            $('#dvUsersRegion').html('<input type="text" id="ddlUserRegion" onblur="fnValidateUserRegionAutoFill ()">');
            var lstuserregion = [];
            var jsonresult = eval('(' + Json_regions + ')');
            // var Json_EmployeeNames = eval('(' + jsData + ')');
            for (var i = 0; i < jsonresult.length; i++) {
                _objData = {};
                _objData.id = jsonresult[i].Region_Code;
                _objData.label = jsonresult[i].Region_Name;
                lstuserregion.push(_objData);
            }
            //if (lstEmployee.length > 0) {
            regiondetails = lstuserregion;
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstuserregion,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: "Select User's region",
                change: fnCheckSelectedRegionsStatus,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstuserregion, dropdown_query);
                }
            });
            atcObj.appendTo('#ddlUserRegion');
        },
        error: function () {
            fnMsgAlert("Get Regions failed.")
        }
    });
}
///hierarchy Actual Reporting
function fngetActualReport() {
    debugger;
    //var Company_code = CompanyCode;
    //Company_Code;
    $.ajax({
        async: false,
        url: '../HiDoctor_Master/UsercreationWizard/GetActuluser',
        type: "POST",
        data: "A",
        async: false,
        success: function (jsData) {
            debugger;
            
            var lstUser = [];
             Json_UserName = eval('(' + jsData + ')');
            for (var i = 0; i < Json_UserName.length; i++) {
                _objData = {};
                _objData.id = Json_UserName[i].User_Code;
                _objData.label = Json_UserName[i].User_Name;
                lstUser.push(_objData);
            }
            // if (lstUser.length > 0) {
            UserDetails = lstUser;
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstUser,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select a  Actual user',
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstUser, dropdown_query);
                }
            });
            atcObj.appendTo('#ddlActual');
            //}
            // }



            //////Actual reporting user//////



        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });

}
//Get Reporting Manager by selected Region change
function fnGetReportingmanagerByregionchange() {
    debugger;
    $('#Effectivefrm').show();
    effect = '1';
    //$("#bindreportingusers").html('');
    if ($('#DDlDivision').val() == null || $('#DDlDivision').val() == '0') {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select Division');
        $('#ddlReportingManagerchange').val(0);
        return false;

    }
    try {
        var selectedRegionCode = $('select[name="ddlUserRegionchange"]').val();
        if (selectedRegionCode != null && selectedRegionCode != '') {
            if (selectedRegionCode == 0) {
                $("#lblregionstatus").html('');
                //$("#ddlReportingManager").val(0);
            }
            $('#dvPanel').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/CheckVacantRegionOrnot',
                type: "POST",
                async: false,
                data: "regionCode=" + selectedRegionCode,
                success: function (JsonResult) {
                    debugger;

                    if (JsonResult != null && JsonResult != '') {
                        if (JsonResult == "VACANT" || JsonResult == "UNASSIGNED") {
                            $('#lblregionstatus').html('This Region is ' + JsonResult + '.Please select another Reporting-To-Region.');
                        }
                        if (selectedRegionCode == 0) {

                            var selectcolumn = $("selec[name='ddlReportingManagerchange']");
                            $(selectcolumn).html('');
                            selectcolumn.append("<option value=0>-Select Reporting Manager-</option>");

                        }
                        else {
                            $.ajax({
                                url: '../HiDoctor_Master/UsercreationWizard/GetUsersbyRegion',
                                type: "POST",
                                data: "regionCode=" + selectedRegionCode,
                                success: function (JsonResult) {
                                    debugger;
                                    $('#dvddlReportingManagechange').empty();
                                    $('#dvddlReportingManagechange').html('<input type="text" id="ddlReportingManagerchange" >');
                                    var lstManagerName = [];
                                    //  fngetreportingusers();
                                    if (JsonResult != null && JsonResult != '') {
                                        if (JsonResult.length > 0) {

                                            var jsonresult = eval('(' + JsonResult + ')');
                                            //$("#ddlReportingManagerchange").remove();
                                            //if (jsonresult.length == 1) {
                                            //     $("#ddlReportingManager").val(jsonresult[0].User_Name);
                                            //}
                                            //else{
                                            //var selectcolumn = $("#ddlReportingManagerchange");

                                            //if (jsonresult.length  1) {
                                            //var lstManagerName = [];

                                            var jsonresult = eval('(' + JsonResult + ')');

                                            for (var i = 0; i < jsonresult.length; i++) {
                                                _objData = {};
                                                _objData.id = jsonresult[i].User_Code;
                                                _objData.label = jsonresult[i].User_Name;
                                                lstManagerName.push(_objData);
                                            }

                                            regiondetails = lstManagerName;
                                            var valueArr = [];
                                            var atcObj = new ej.dropdowns.DropDownList({
                                                //set the data to dataSource property
                                                dataSource: lstManagerName,
                                                fields: { text: 'label', value: 'id' },
                                                filterBarPlaceholder: 'Search',
                                                showClearButton: true,
                                                allowFiltering: true,
                                                placeholder: "Select Reporting Manager",
                                                index: 0,
                                                value: JsonResult[0].User_Code,
                                                //change: fnCheckSelectedRegionsStatus,
                                                filtering: function (e) {
                                                    var dropdown_query = new ej.data.Query();
                                                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                                    e.updateData(lstManagerName, dropdown_query);
                                                }

                                            });
                                            atcObj.appendTo('#ddlReportingManagerchange');
                                            //selectcolumn.append("<option value=" + jsonresult[0].User_Code + ">" + jsonresult[0].User_Name + "</option>");

                                            $('#lblregionstatus').html('');

                                            //}

                                            //else {
                                            //    selectcolumn.append("<option value=0>-Select Reporting Manager-</option>");
                                            //    for (var i = 0; i < jsonresult.length; i++) {
                                            //        if (jsonresult[i].User_Code != $("#hdnUserCode").val()) {
                                            //            selectcolumn.append("<option value=" + jsonresult[i].User_Code + ">" + jsonresult[i].User_Name + "</option>");
                                            //        }



                                            //        $('#lblregionstatus').html('');
                                            //    }
                                            //}
                                            // }
                                            //fnGetUserRegionByregionCodechange();
                                            //   $('#lblregionstatus').html('');
                                            $('#dvPanel').unblock();
                                        }
                                    }
                                    // $('#lblregionstatus').html('');
                                    $('#dvPanel').unblock();
                                },
                                error: function () {
                                    fnMsgAlert("Get Reporting Managers failed.")
                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                    }
                    $('#dvPanel').unblock();
                },
                error: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
}

//Used to Ger ExpenseGroup Header
function fnGetExpenseGroupHeader() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetExpenseGroupHeader',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            Json_Expensegroup = JsonResult;
            //if (Json_Expensegroup != null && Json_Expensegroup != '') {
            //    if (Json_Expensegroup.length > 0) {
            //        var jsonresult = eval('(' + Json_Expensegroup + ')');
            //        var selectcolumn = $("#ddlExpemseGroup");
            //        //selectcolumn.append("<option value=0>-Select Expense Group Header-</option>");
            //        for (var i = 0; i < jsonresult.length; i++) {
            //            selectcolumn.append("<option value=" + jsonresult[i].Expense_Group_Id + ">" + jsonresult[i].Expense_Group_Name + "</option>");
            //        }
            //    }
            //}
            $('#dvExpenseGrp').empty();
            $('#dvExpenseGrp').html('<input type="text" id="ddlExpemseGroup" onblur="fnValidateExpenseGrpAutoFill(this);" placeholder="Select Expense Group">')
            var lstexpensegrp = [];
            var jsonresult = eval('(' + Json_Expensegroup + ')');
            // var Json_EmployeeNames = eval('(' + jsData + ')');
            for (var i = 0; i < jsonresult.length; i++) {
                _objData = {};
                _objData.id = jsonresult[i].Expense_Group_Id;
                _objData.label = jsonresult[i].Expense_Group_Name;
                lstexpensegrp.push(_objData);
            }
            //if (lstEmployee.length > 0) {
            expensegrpdetails = lstexpensegrp;
            var valueArr = [];
            //valueArr.push(lstEmployee[0].label);
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstexpensegrp,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select Expense Group',
                //  value: valueArr
                //change: StockiestMaster.fnGetStockiestDetails(),
                change: fnonchangeExpense,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstexpensegrp, dropdown_query);
                }
            });
            atcObj.appendTo('#ddlExpemseGroup');
        },
        error: function () {
            fnMsgAlert("Get Expense Group Headers failed.")
        }
    });
}

//Onchange Expense
function fnonchangeExpense() {
    if ($('select[name="ddlUserRegion"]').val() == '0') {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select The Reporting to Manager Region');
        $('select[name="ddlExpemseGroup"]').val('');
        $('#dvPanel').unblock();
        return false;
    }
}

var divisionCode = "";
//Get Reporting to region by Selected Division
function fnGetReportingManagerRegion() {
    debugger;
    try {
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        if ($('#ddlDivision').val() == '0') {//|| $('#ddlDivision').val() == null) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please Select The Division');
            $('#dvPanel').unblock();
            return false;
        }
        //var divisionCode = $('#ddlDivision") option:selected').val();
        divisionCode = "";
        $('select#ddlDivision > option:selected').each(function () {
            divisionCode += $(this).val() + ',';
            //entity_Names.push($(this).text().split('(')[0]);
        });
        divisionCode = divisionCode.slice(0, -1);
        if (divisionCode != null && divisionCode != '') {
            $('#ddlDivision').multiselect("destroy").multiselect().multiselectfilter();
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetRegionsbyDivision',
                type: "POST",
                data: "divisionCode=" + divisionCode,
                success: function (JsonResult) {
                    debugger;
                    if (JsonResult != null && JsonResult != '') {
                        if (JsonResult.length > 0) {
                            var jsonresult = eval('(' + JsonResult + ')');
                            var lstRegions = [];
                            $('#dvReportingManagerRegion').empty();
                            $('#dvReportingManagerRegion').html('<input type="text" id="ddlreportingManagerregion" onblur="fnValidateRegionAutoFill(this);" placeholder="Reporting to Region">');
                            for (var i = 0; i < jsonresult.length; i++) {
                                var _obj = {
                                    id: jsonresult[i].Region_Code,
                                    label: jsonresult[i].Region_Name
                                }
                                lstRegions.push(_obj);
                            }
                            regiondetails = lstRegions;
                            var valueArr = [];
                            //valueArr.push(lstEmployee[0].label);
                            var atcObj = new ej.dropdowns.DropDownList({
                                //set the data to dataSource property
                                dataSource: lstRegions,
                                fields: { text: 'label', value: 'id' },
                                filterBarPlaceholder: 'Search',
                                showClearButton: true,
                                allowFiltering: true,
                                placeholder: 'Select a Reporting to region',
                                //  value: valueArr
                                //change: StockiestMaster.fnGetStockiestDetails(),
                                change: fnGetReportingmanagerByregion,
                                filtering: function (e) {
                                    var dropdown_query = new ej.data.Query();
                                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                    e.updateData(lstRegions, dropdown_query);
                                }
                            });
                            atcObj.appendTo('#ddlreportingManagerregion');
                            //$("#ddlreportingManagerregion option").remove();
                            //var selectcolumn = $("#ddlreportingManagerregion");
                            //selectcolumn.append("<option value=0>-Select Reporting to Region-</option>");
                            //for (var i = 0; i < jsonresult.length; i++) {
                            //    selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                            //}
                        }
                    }
                    $('#dvPanel').unblock();
                    fnGetDesignationByDivision(1);
                    fngetActualReportingmanager(divisionCode);
                },
                error: function () {
                    fnMsgAlert("Get Reporting to Regions failed.")
                    $('#dvPanel').unblock();
                }
            });
        } else {
            $('#ddlDivision').multiselect("destroy").multiselect().multiselectfilter();
            //$("#ddlDivision").multiselect({
            //    noneSelectedText: '-Select Division-'
            //}).multiselectfilter();
            fnGetUserTypes();
            fnGetReportingtoRegions();
           
            $('#dvPanel').unblock();
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
}

function fnGetUserRegionByregionCodeBack(reportingMangerRegion) {
    //var selectedRegionCode = $('select[name="ddlreportingManagerregion"]').val()//$('#ddlreportingManagerregion option:selected').val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetRegionsbyRegion',
        type: "POST",
        async: false,
        data: "regionCode=" + reportingMangerRegion,
        success: function (JsonResult) {
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    var jsonresult = eval('(' + JsonResult + ')');
                    $('#dvUsersRegion').empty();
                    $('#dvUsersRegion').html('<input type="text" id="ddlUserRegion">');
                    var lstuserregion = [];
                    for (var i = 0; i < jsonresult.length; i++) {
                        _objData = {};
                        _objData.id = jsonresult[i].Region_Code;
                        _objData.label = jsonresult[i].Region_Name;
                        lstuserregion.push(_objData);
                    }
                    //if (lstEmployee.length > 0) {
                    regiondetails = lstuserregion;
                    var valueArr = [];
                    //valueArr.push(lstEmployee[0].label);
                    var atcObj = new ej.dropdowns.DropDownList({
                        //set the data to dataSource property
                        dataSource: lstuserregion,
                        fields: { text: 'label', value: 'id' },
                        filterBarPlaceholder: 'Search',
                        showClearButton: true,
                        allowFiltering: true,
                        placeholder: "Select User's region",
                        change: fnCheckSelectedRegionsStatus,
                        filtering: function (e) {
                            var dropdown_query = new ej.data.Query();
                            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                            e.updateData(lstuserregion, dropdown_query);
                        }

                    });
                    atcObj.appendTo('#ddlUserRegion');
                    //$("#ddlUserRegion option").remove();
                    //var selectcolumn = $("#ddlUserRegion");
                    //selectcolumn.append("<option value=0>-Select Region-</option>");
                    //for (var i = 0; i < jsonresult.length; i++) {
                    //    selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                    //    //selregion = jsonresult[i].Region_Code;
                    //}
                }
            }
        },
        error: function () {
            fnMsgAlert("Get Regions failed.")
        }
    });
}

//Onchange the Reporting to Manager
function fnOnchangeReportingtoManager() {
    if ($('#ddlreportingManagerregion').val() == '0') {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select The Reporting to Manager Region');
        $('#ddlReportingManager').val(0);
        $('#dvPanel').unblock();
        return false;
    }
}

//Onchange the User Region
function fnChangeUserregion() {
    debugger;
    $('#Effectivefrm').show();
    effect = '1';
    if ($('select[name="ddlreportingManagerregion"]').val() == '0') {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select The Reporting to Manager Region');
        $('#ddlUserRegion').val(0);
        $('#dvPanel').unblock();
        return false;
    }
    try {
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        var selectedRegionCode = $('select[name="ddlUserRegion"]').val()//$('#ddlUserRegion option:selected').val();
        if (selectedRegionCode != null && selectedRegionCode != '') {
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/CheckVacantRegionOrnot',
                type: "POST",
                async: false,
                data: "regionCode=" + selectedRegionCode,
                success: function (JsonResult) {
                    if (JsonResult != null && JsonResult != '') {
                        var regionstatus = JsonResult;
                        if (regionstatus.toUpperCase() == "ACTIVE") {
                            fnMsgAlert('info', 'User Creation Wizard', 'This Region is not VACANT and has an existing user. If you wish to disable the existing user then select the Resignation option in the wizard and follow the steps given.');
                            $('#dvPanel').unblock();
                            fnGetExpenseByRegionCode();
                            return false;
                            //if (confirm("This Region is not VACANT and has an existing user. If you wish to disable the existing user then select the Resignation option in the wizard and follow the steps given.If you wish to Disable this user from this region without any action click OK.However If you still wish to assign the user to this region click Cancel.")) {
                            //    $('#main').load('HiDoctor_Master/UsercreationWizard/DisableUser');
                            //}
                            //else {
                            //    fnGetExpenseByRegionCode();
                            //}
                            // "<div id='dvquitPopup' title='New User Creation Wizard'>This Region is not VACANT and has an existing user. If you wish to disable the existing user then select the Resignation option in the wizard and follow the steps given. However If you still wish to assign the user to this region click Yes.If you wish to remain on this screen without any action click No.</div>";
                        }
                    }
                    $('#dvPanel').unblock();
                },
                error: function () {
                    fnMsgAlert("Get Reporting Managers failed.")
                    $('#dvPanel').unblock();
                }
            });
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
}

//Get Expense by RegionCode
function fnGetExpenseByRegionCode() {
    debugger;

    if (($('select[name="ddlUserRegion"]').val() == '0') || ($('#ddlDivision').val() == '0')) {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select The User Region or Designation');
        //$('#ddlreportingManagerregion').val(0)
        $('#ddlDivision').val(0);
        $('#dvPanel').unblock();
        return false;
    }

    var selectedRegionCode = $('select[name="ddlreportingManagerregion"]').val();
    var selectedUserTypeCode = $('select[name="ddlDesignation"]').val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetExpensebyRegionorUsertype',
        type: "POST",
        data: "regionCode=" + selectedRegionCode + "&usertypeCode=" + selectedUserTypeCode,
        success: function (JsonResult) {

            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    //$("#ddlExpemseGroup option").remove();
                    var jsonresult = eval('(' + JsonResult + ')');
                    // var selectcolumn = $("#ddlExpemseGroup");
                    // selectcolumn.append("<option value=0>-Select Expense Group Header-</option>");
                    //for (var i = 0; i < jsonresult.length; i++) {
                    //    var expenseId = jsonresult[i].Expense_Group_Id;
                    //    $('#ddlExpemseGroup').val(expenseId);
                    //    // selectcolumn.append("<option value=" + jsonresult[i].Expense_Group_Id + ">" + jsonresult[i].Expense_Group_Name + "</option>");
                    //}
                    $('#dvExpenseGrp').empty();

                    $('#dvExpenseGrp').html(' <input type="text" id="ddlExpemseGroup" onblur="fnValidateExpenseGrpAutoFill(this);" placeholder="Select Expense Group">')
                    var lstexpensegrp = [];
                    var jsonresult = eval('(' + Json_Expensegroup + ')');
                    // var Json_EmployeeNames = eval('(' + jsData + ')');
                    for (var i = 0; i < jsonresult.length; i++) {
                        _objData = {};
                        _objData.id = jsonresult[i].Expense_Group_Id;
                        _objData.label = jsonresult[i].Expense_Group_Name;
                        lstexpensegrp.push(_objData);
                    }
                    //if (lstEmployee.length > 0) {
                    expensegrpdetails = lstexpensegrp;
                    var valueArr = [];
                    //valueArr.push(lstEmployee[0].label);
                    var atcObj = new ej.dropdowns.DropDownList({
                        //set the data to dataSource property
                        dataSource: lstexpensegrp,
                        fields: {
                            text: 'label', value: 'id'
                        },
                        filterBarPlaceholder: 'Search',
                        showClearButton: true,
                        allowFiltering: true,
                        placeholder: 'Select Expense Group',
                        //  value: valueArr
                        //change: StockiestMaster.fnGetStockiestDetails(),
                        change: fnonchangeExpense
                    });
                    atcObj.appendTo('#ddlExpemseGroup');
                }
            }
        },
        error: function () {
            fnMsgAlert("Get ExpenseGroup Header failed.")
        }
    });
}

//Get User Regions By regionCode
function fnGetUserRegionByregionCodechange() {
    debugger;
    var selectedRegionCode = $('select[name="ddlUserRegionchange"]').val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetRegionsbyRegion',
        type: "POST",
        data: "regionCode=" + selectedRegionCode,
        success: function (JsonResult) {
            //if (JsonResult != null && JsonResult != '') {
            //    if (JsonResult.length > 0) {
            //        var jsonresult = eval('(' + JsonResult + ')');
            //        $("#ddlUserRegion option").remove();
            //        var selectcolumn = $("#ddlUserRegion");
            //        selectcolumn.append("<option value=0>-Select Region-</option>");
            //        for (var i = 0; i < jsonresult.length; i++) {
            //            selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
            //            //selregion = jsonresult[i].Region_Code;
            //        }
            //        selectcolumn.append("<option value=" + Json_user[0].Region_Code + ">" + Json_user[0].Region_Name + "</option>");
            //    }
            ////}
            $('#dvUsersRegion').empty();
            $('#dvUsersRegion').html('<input type="text" id="ddlUserRegion">');
            var lstuserbyregion = [];
            var jsonresult = eval('(' + JsonResult + ')');
            // var Json_EmployeeNames = eval('(' + jsData + ')');
            for (var i = 0; i < jsonresult.length; i++) {
                _objData = {};
                _objData.id = jsonresult[i].Region_Code;
                _objData.label = jsonresult[i].Region_Name;
                lstuserbyregion.push(_objData);
            }
            _objData = {};
            _objData.id = Json_user[0].Region_Code;
            _objData.label = Json_user[0].Region_Name;
            lstuserbyregion.push(_objData);
            //if (lstEmployee.length > 0) {
            regiondetails = lstuserbyregion;
            var valueArr = [];
            //valueArr.push(lstEmployee[0].label);
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstuserbyregion,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                index: 0,
                allowFiltering: true,
                placeholder: 'Select a Reporting to region',
                //  value: valueArr
                //change: StockiestMaster.fnGetStockiestDetails(),
            });
            atcObj.appendTo('#ddlUserRegion');
        },
        error: function () {
            fnMsgAlert("Get Regions failed.")
        }
    });
}

function fnGetUserRegionByregionCodechangeBack(selectedRegionCode) {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetRegionsbyRegion',
        type: "POST",
        async: false,
        data: "regionCode=" + selectedRegionCode,
        success: function (JsonResult) {
            //if (JsonResult != null && JsonResult != '') {
            //    if (JsonResult.length > 0) {
            //        var jsonresult = eval('(' + JsonResult + ')');
            //        $("#ddlUserRegion option").remove();
            //        var selectcolumn = $("#ddlUserRegion");
            //        selectcolumn.append("<option value=0>-Select Region-</option>");
            //        for (var i = 0; i < jsonresult.length; i++) {
            //            selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
            //            //selregion = jsonresult[i].Region_Code;
            //        }
            //        selectcolumn.append("<option value=" + Json_user[0].Region_Code + ">" + Json_user[0].Region_Name + "</option>");
            //    }
            ////}
            $('#dvUsersRegion').empty();
            $('#dvUsersRegion').html('<input type="text" id="ddlUserRegion">');
            var lstuserbyregion = [];
            var jsonresult = eval('(' + JsonResult + ')');
            // var Json_EmployeeNames = eval('(' + jsData + ')');
            for (var i = 0; i < jsonresult.length; i++) {
                _objData = {};
                _objData.id = jsonresult[i].Region_Code;
                _objData.label = jsonresult[i].Region_Name;
                lstuserbyregion.push(_objData);
            }
            //if (lstEmployee.length > 0) {
            regiondetails = lstuserbyregion;
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstuserbyregion,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                index: 0,
                allowFiltering: true,
                placeholder: 'Select a Reporting to region',
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstuserbyregion, dropdown_query);
                }
            });
            atcObj.appendTo('#ddlUserRegion');
        },
        error: function () {
            fnMsgAlert("Get Regions failed.")
        }
    });
}

//***********************************************************Common Functions End******************************************************************//

//***********************************************************User Creation Functions Start(New Main)*****************************************************************//
function fnGetDivisions() {
    var selectcolumn = '';
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetDivision',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            Json_Divisions = JsonResult;
            if (Json_Divisions != null && Json_Divisions != '') {
                if (Json_Divisions.length > 0) {
                    var jsonresult = eval('(' + Json_Divisions + ')');

                    // var selectcolumn = $("#ddlDivision");
                    //selectcolumn.append("<option value=0>-Select Division-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn += "<option  value=" + jsonresult[i].Division_Code + ">" + jsonresult[i].Division_Name + "</option>";
                    }
                    $("#ddlDivision").html(selectcolumn);
                }
            }
            $("#ddlDivision").multiselect("destroy").multiselect().multiselectfilter();
            $("#ddlDivision").multiselect({
                noneSelectedText: '-Select Division-'
            }).multiselectfilter();
        },
        error: function () {
            fnMsgAlert("Get Divisions failed.");
        }
    });

}

function fngetreportingusers() {
    var selregion = $("select[name='ddlUserRegion']").val();
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/Getunderusers',
        type: "POST",
        async: false,
        data: "regionCode=" + selregion,
        success: function (JsonResult) {
            debugger;
            fnbindusersreportingHTML(JsonResult)
            // fnValidateUserRegionAutoFill();
        }

    });
}

function fnbindusersreportingHTML(JsonResult) {
    if (JsonResult != null && JsonResult != '') {
        if (JsonResult.length > 0) {
            var jsonresult = eval('(' + JsonResult + ')');
            var selectcolumn = '';
            // selectcolumn.append("<option value=0>-Select Region-</option>");
            for (var i = 0; i < jsonresult.length; i++) {
                selectcolumn += "<input type='checkbox' name='underuserchk' value=" + jsonresult[i].User_Code + ">" + jsonresult[i].User_Name + "</br>";
                //selregion = jsonresult[i].Region_Code;
            }
            $("#bindreportingusers").html(selectcolumn);
        }
    }
}

//Function Used to get Project details
function fnGetProjectMaster() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetProjectMaster',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            Json_projects = JsonResult;
            if (Json_projects != null && Json_projects != '') {
                if (Json_projects.length > 0) {
                    var jsonresult = eval('(' + Json_projects + ')');
                    var selectcolumn = $("#ddlprojectName");
                    //selectcolumn.append("<option value=0>-Select Project-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn.append("<option value=" + jsonresult[i].Project_Code + ">" + jsonresult[i].Project_Name + "</option>");
                    }
                }
            }
        },
        error: function () {
            fnMsgAlert("Get Projects failed.")
        }
    });
}


function fnValidateEmployee() {
    debugger;
    isValid = true;
    if ($.trim($("#txtsearchEmployeeName").val()) == "") {
        fnMsgAlert('info', 'User Creation Wizard', 'Please enter the employee Name');
        isValid = false;
        return isValid;
    }

    if ($("#txtsearchEmployeeName").val() != '') {
        if ($.trim($("#txtsearchEmployeeName").val()).length < 3) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter the employee name minimum 3 characters');
            isValid = false;
            return isValid;
        }
    }
    return isValid;
}

//Function Used to get Employee details
function fnGetEmployeeDetails() {
    debugger;
    var result = fnValidateEmployee();
    if (result) {
        var empName = $.trim($("#txtsearchEmployeeName").val());
        var employeeName = empName.split('(')[0];
        var disJson = jsonPath(Json_Assignemp_g, "$.[?(@.Employee_Name=='" + employeeName + "')]");

        if (disJson != false) {
            $("#hdnEmployeeCode").val(disJson[0].Employee_Code)
        }
        else {
            $("#hdnEmployeeCode").val('');
        }

        if ($("#txtsearchEmployeeName").val() != '') {
            if ($("#hdnEmployeeCode").val() == '') {
                fnMsgAlert('info', 'Info', 'Please Choose the valid Employee Name.');
                return false;
            }
        }

        try {
            $('#dvPanel').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $('#ddlDesignation option').remove(); // remove all Designation Options
            $('#ddlDivision option').remove();// remove all Division Options
            $('#ddlreportingManagerregion option').remove();// remove all Reporting to Region Options
            $('#ddlReportingManager option').remove();// remove all Reporting to all User Options
            $('#ddlUserRegion option').remove();// remove all User Region Options
            $('#ddlprojectName option').remove();// remove all Project Options
            $('#ddlExpemseGroup option').remove();// remove all Expense Options
            //Bind Designation
            if (Json_userTypes.length > 0) {
                var jsonresult = eval('(' + Json_userTypes + ')');
                var selectcolumn = $("#ddlDesignation");
                selectcolumn.append("<option value='0'>-Select Designation-</option>");
                for (var i = 0; i < jsonresult.length; i++) {
                    selectcolumn.append("<option value=" + jsonresult[i].User_Type_Code + ">" + jsonresult[i].User_Type_Name + "</option>");
                }
            }
            //  Get Divisions
            if (Json_Divisions.length > 0) {
                var jsonresult = eval('(' + Json_Divisions + ')');
                var selectcolumn = $("#ddlDivision");
                //if (Json_Divisions.length > 1) {
                //    selectcolumn.append("<option value='0'>-Select Division-</option>");
                //}

                for (var i = 0; i < jsonresult.length; i++) {
                    selectcolumn.append("<option value=" + jsonresult[i].Division_Code + ">" + jsonresult[i].Division_Name + "</option>");
                    if (jsonresult.length == 1) {

                        $("#ddlDivision").multiselect("widget").find(":checkbox[value='" + jsonresult[i].Division_Code + "']").attr("checked", "checked");
                        $("#ddlDivision option[value='" + jsonresult[i].Division_Code + "']").attr("selected", true);
                        fnGetReportingManagerRegion();
                        //  fnGetDesignationByDivision();
                        //selectcolumn.append("(<option value=" + jsonresult[i].Division_Code + "></option>).attr('selected', true)");

                    }
                }
                $('#ddlDivision').multiselect("destroy").multiselect().multiselectfilter();
                $("#ddlDivision").multiselect({
                    noneSelectedText: '-Select Division-'
                }).multiselectfilter();
            }

            //}
            //if (Json_Divisions.length > 0) {
            //    $('#ddlDivision').html('');
            //    var jsonresult = eval('(' + Json_Divisions + ')');
            //    var content = '';
            //    if (jsonresult != null && jsonresult.length > 0) {
            //        var checkList = new ej.dropdowns.ComboBox({
            //            // set the country data to dataSource property
            //            dataSource: data.list,
            //            // map the appropriate columns to fields property
            //            fields: { text: 'Division_Name', value: 'Division_Code' },
            //            // set the placeholder to MultiSelect input element
            //            placeholder: 'Select Division',
            //            // set the type of mode for checkbox to visualized the checkbox added in li element.
            //            mode: 'CheckBox',
            //            // set true for enable the selectAll support.
            //            showSelectAll: true,
            //            // set true for enable the dropdown icon.
            //            showDropDownIcon: true,
            //            // set the placeholder to MultiSelect filter input element
            //            filterBarPlaceholder: 'Search',
            //            // set the MultiSelect popup height
            //            popupHeight: '350px'
            //        });
            //        checkList.appendTo('#ddlDivision');
            //        //content += '<select class="selectpicker" multiple data-live-search="true" id="ddlRegion"  onchange="BMWC.fnbindRegionlist();">';
            //        ////content += '<select class="multi-select mandatory" multiple="multiple" id="ddlRegion"  onchange="BMWC.fnbindRegionlist();">';
            //        //for (var i = 0; i < data.list.length; i++) {
            //        //    content += '<option  value="' + data.list[i].Region_Code + '">' + data.list[i].Region_Name + '</option>';
            //        //}
            //        //content += '</select>';
            //    }
            //    else {
            //        content = "No data found";
            //    }
            //}
            //Get Reporting to Region
            if (Json_reportingtoRegions != null && Json_reportingtoRegions != '') {
                if (Json_reportingtoRegions.length > 0) {
                    var jsonresult = eval('(' + Json_reportingtoRegions + ')');
                    var selectcolumn = $("#ddlreportingManagerregion");
                    selectcolumn.append("<option value=0>-Select Reporting to Region-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                    }
                }
            }
            //Get Reporting to User
            if (Json_Users != null && Json_Users != '') {
                if (Json_Users.length > 0) {
                    var jsonresult = eval('(' + Json_Users + ')');
                    var selectcolumn = $("#ddlReportingManager");
                    selectcolumn.append("<option value=0>-Select Reporting Manager-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn.append("<option value=" + jsonresult[i].User_Code + ">" + jsonresult[i].User_Name + "</option>");
                    }
                }
            }
            //Get User Region
            if (Json_regions != null && Json_regions != '') {
                if (Json_regions.length > 0) {
                    var jsonresult = eval('(' + Json_regions + ')');
                    var selectcolumn = $("#ddlUserRegion");
                    selectcolumn.append("<option value=0>-Select Region-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                    }
                }
            }
            //Get Project Name
            if (Json_projects != null && Json_projects != '') {
                if (Json_projects.length > 0) {
                    var jsonresult = eval('(' + Json_projects + ')');
                    var selectcolumn = $("#ddlprojectName");
                    selectcolumn.append("<option value=0>-Select Project-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn.append("<option value=" + jsonresult[i].Project_Code + ">" + jsonresult[i].Project_Name + "</option>");
                    }
                }

            }
            //Get Expense Group Header
            if (Json_Expensegroup != null && Json_Expensegroup != '') {
                if (Json_Expensegroup.length > 0) {
                    var jsonresult = eval('(' + Json_Expensegroup + ')');
                    var selectcolumn = $("#ddlExpemseGroup");
                    selectcolumn.append("<option value=0>-Select Expense Group Header-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn.append("<option value=" + jsonresult[i].Expense_Group_Id + ">" + jsonresult[i].Expense_Group_Name + "</option>");
                    }
                }
            }

            var employeeCode = $('#hdnEmployeeCode').val();
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetEmployeeDetails',
                type: "POST",
                data: "employeeCode=" + employeeCode,
                success: function (JsData) {

                    var jsonresult = eval('(' + JsData + ')');
                    if (jsonresult != null && jsonresult != '') {
                        if (jsonresult.length > 0) {
                            //Get Employee details               
                            var employeeName = jsonresult[0].Employee_Name;
                            var employeeNumber = jsonresult[0].Employee_Number;
                            var employeeCode = jsonresult[0].Employee_Code;
                            var email = jsonresult[0].Email_Id;
                            var mobile = jsonresult[0].Mobile;
                            var doJ = jsonresult[0].Date_of_Joining;
                            var doC = jsonresult[0].Prop_Date_of_Confirmation;
                            //var hidoctorStartdate = jsonresult[0].HiDOCTOR_Start_Date;
                            //var userTypeCode = jsonresult[0].User_Type_Code;;
                            //var userTypeName = jsonresult[0].User_Type_Name;;
                            //var divisionCode = jsonresult[0].Division_Code;
                            //var divisionName = jsonresult[0].Division_Name;
                            //var reportingtoRegionCode = jsonresult[0].Reporting_Manager_Region_Code;
                            //var reportingtoRegionName = jsonresult[0].Reporting_Manager_Region_Name;
                            //var reportingtoManagerCode = jsonresult[0].Reporting_Manager_User_Code;
                            //var reportingtoManagerName = jsonresult[0].Reporting_Manager_User_Name;
                            //var UserRegioncode = jsonresult[0].Region_Code;
                            //var UserRegionName = jsonresult[0].Region_Name;
                            //var projectCode = jsonresult[0].Project_Code;
                            //var projectName = jsonresult[0].Project_Name;
                            //var ExpenseGroupId = jsonresult[0].Expense_Group_Id;
                            //var expenseGroupName = jsonresult[0].Expense_Group_Name;
                            //var assignuserid = jsonresult[0].User_Name;
                            //var userCode = jsonresult[0].User_Code;
                            //var passwrd = jsonresult[0].User_Pass;
                            var gender = jsonresult[0].Gender;
                            var doB = jsonresult[0].Date_of_birth;
                            var address = jsonresult[0].Address;
                            var phone = jsonresult[0].Phone;
                            var pfNo = jsonresult[0].PF_Number;
                            var panNo = jsonresult[0].PAN_Number;
                            var bankAcc1 = jsonresult[0].SCB_Account_Number;
                            var bankAcc2 = jsonresult[0].ICICI_Account_Number;
                            var EdnProof = jsonresult[0].EDN_Proof;
                            var salaryProof = jsonresult[0].Salary_Proof;
                            var resumeGiven = jsonresult[0].Resume_Given;
                            var resignationsubmitted = jsonresult[0].Resignation_Submitted;
                            var Appointed = jsonresult[0].Appointed;

                            //Prefill Employee Details              
                            $('#txtempName').val(employeeName);
                            $('#hdnEmployeeCode').val(employeeCode);
                            $('#txtempNo').val(employeeNumber);
                            $('#txtemail').val(email); //Email
                            $('#txtMobile').val(mobile);//Mobile
                            $('#txtDOJ').val(doJ); //DOJ 
                            $('#txtDOC').val(doC); //DOJ 
                            //$('#txthidoctorstartdate').val(hidoctorStartdate) // Hidoctor Start Date
                            //$('#hdnUserTypeCode').val(userTypeCode); //Designation User Type Code
                            //$('#ddlDesignation').val(userTypeCode);//Designation user Type Name
                            //$('#hdnDivisionCode').val(divisionCode); //Get Dvision Code
                            //$('#ddlDivision').val(divisionCode); //Get Division name
                            //$('#hdnReportingtoRegioncode').val(reportingtoRegionCode); //reporting to region Code
                            //$('#ddlreportingManagerregion').val(reportingtoRegionCode); //Reporting to region name
                            //$('#hdnReportingtoManagerCode').val(reportingtoManagerCode); //Reproting to Manager Code
                            //$('#ddlReportingManager').val(reportingtoManagerCode); // Reproting to Manager Name
                            //$('#hdnUserRegion').val(UserRegioncode); //User region Code
                            //$('#ddlUserRegion').val(UserRegioncode); //User Region Name
                            //$('#hdnProjectCode').val(projectCode); // Project Code
                            //$('#ddlprojectName').val(projectCode); // Project Name
                            //$('#hdnExpenseGroupCode').val(ExpenseGroupId); //Expense Group Id
                            //$('#ddlExpemseGroup').val(ExpenseGroupId); // Expense Group Name
                            //$('#txtAssignuserid').val(assignuserid); // Assign user Id
                            //$('#hdnUserCode').val(userCode); // Assign User Code
                            //$('#txtPwd').val(passwrd);//Password                       
                            $('#txtDOB').val(doB); // DOB
                            $('#ddlGender').val(gender); //Gender
                            $('#txtAddress').val(address); //Address
                            $('#txtPhoneNo').val(phone); //Phone
                            $('#txtPFNO').val(pfNo); //PF No
                            $('#txtpanNo').val(panNo); //PAN No
                            $('#txtbankAct1').val(bankAcc1); //ACC no 1
                            $('#txtbankAct2').val(bankAcc2); //ACC no 2

                            //EDN Proof
                            if (EdnProof != undefined && EdnProof.toUpperCase() == "YES") {
                                $('input:radio[id=rdnEdnYes]').prop('checked', true);
                            }
                            else {
                                $('input:radio[id=rdnEdnNo]').prop('checked', true);
                            }
                            //Salary Proof
                            if (salaryProof != undefined && salaryProof.toUpperCase() == "YES") {
                                $('input:radio[id=rdnSalYes]').prop('checked', true);
                            }
                            else {
                                $('input:radio[id=rdnSalNo]').prop('checked', true);
                            }
                            //Resume given
                            if (resumeGiven != undefined && resumeGiven.toUpperCase() == "YES") {
                                $('input:radio[id=rdnResYes]').prop('checked', true);
                            }
                            else {
                                $('input:radio[id=rdnResNo]').prop('checked', true);
                            }
                            //Resignation Submitted
                            if (resignationsubmitted != undefined && resignationsubmitted.toUpperCase() == "YES") {
                                $('input:radio[id=rdnResignationYes]').prop('checked', true);
                            }
                            else {
                                $('input:radio[id=rdnResignationNo]').prop('checked', true);
                            }
                            //Appointed
                            if (Appointed != undefined && Appointed.toUpperCase() == "YES") {
                                $('input:radio[id=rdnAppointedYes]').prop('checked', true);
                            }
                            else {
                                $('input:radio[id=rdnAppointedNo]').prop('checked', true);
                            }
                            $("#hdnMode").val("E");
                            if (doJ != "" && doC == "01/01/1900") {
                                fnPrefillDOC(doJ);
                            }
                        }
                    }

                },
                error: function () {
                    $('#dvPanel').unblock();
                    fnMsgAlert("Get Divisions failed.")
                },
                complete: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
        catch (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvPanel').unblock();

        }
    }
    //Will write a new code
    //else {
    //    window.location.reload();
    //}


}

//Get ActivitiesName by Project Name
function fnGetActivityName() {
    if ($('#ddlDivision').val() == '0' || $('#ddlDivision').val() == null) {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select Division');
        $('#ddlprojectName').val(0);
        $('#dvPanel').unblock();
        return false;
    }
    var projectCode = $("#ddlprojectName option:selected").val();
    var ProjectName = $("#ddlprojectName option:selected").text();
    var activitiesName = "";
    if (projectCode != null && projectCode != '') {
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/GetActivitybyProject',
            type: "POST",
            data: "projectCode=" + projectCode,
            success: function (JsonResult) {

                var json_Activity = eval('(' + JsonResult + ')');
                if (json_Activity != null && json_Activity != '') {
                    if (json_Activity.length > 0) {

                        for (var i = 0; i < json_Activity.length; i++) {
                            activitiesName += json_Activity[i].Activity_Name + ',';
                        }
                    }
                }
                if (activitiesName != null && activitiesName != '') {

                    var activityName = ProjectName + " and its activities Names" + "-" + activitiesName.slice(0, -1);
                    $('#spnActivityName').html(activityName);
                }
                else {
                    $('#spnActivityName').html(ProjectName);
                }
            },
            error: function () {
                fnMsgAlert("Get Activities failed.")
            }
        });
    }
}

function fnBackEmployee() {
    debugger;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#main').load('HiDoctor_Master/UsercreationWizard/Home');

    $('#dvPanel').unblock();
}

function fnValidateEmployeedetails() {
    debugger;
    fnUserExpenseGroupMand(); // Newly added for Expense Group Mandatory
    var empCode = $('#hdnEmployeeCode').val();

    //Employee Name
    if ($.trim($("#txtempName").val()) == "") {
        fnMsgAlert('info', 'User Creation Wizard', 'Please enter the employee Name');
        HideModalPopup('dvLoading');
        return false;
    }

    if ($("#txtempName").val() != '') {
        if ($.trim($("#txtempName").val()).length < 3) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter the employee name minimum 3 characters');
            return false;
        }
        var result = regExforAlphaNumeric($.trim($("#txtempName").val()));
        if (!result) {
            fnMsgAlert('info', 'User Creation Wizard', 'Special characters and Space are not allowed in the employee name field');
            return false;
        }
    }
    //Employee Number
    if ($.trim($("#txtempNo").val()) == "") {
        fnMsgAlert('info', 'User Creation Wizard', 'Please enter the employee number');
        return false;
    }

    else {
        if (unassignedAllemployeedetails != '' && $("#hdnMode").val() != 'E') {
            var disJson = jsonPath(unassignedAllemployeedetails, "$.[?(@.Employee_Number=='" + $.trim($("#txtempNo").val()).toUpperCase() + "')]");
            if (disJson != false & disJson != undefined) {
                $("#txtempNo").val('');
                fnMsgAlert('info', 'User Creation Wizard', 'Employee number already exists.Please enter valid employee number');
                return false;
            }
            else {   // 
                var result = regExforAlphaNumeric($.trim($("#txtempNo").val()));
                if (!result) {
                    //flag = false;
                    fnMsgAlert('info', 'User Creation Wizard', 'Special characters are not allowed in the employee number field');
                    return false;
                }
            }
        }
        else {
            var disJson = jsonPath(unassignedAllemployeedetails, "$.[?(@.Employee_Number=='" + $.trim($("#txtempNo").val()).toUpperCase() + "' & @.Employee_Code != '" + empCode + "')]");
            //var disJson = jsonPath(unassignedAllemployeedetails, "$.[?(@.Employee_Number=='" + $.trim($("#txtempNo").val()).toUpperCase() + "')]");
            if (disJson != false & disJson != undefined) {
                if (disJson[0].Employee_Code != $('#hdnEmployeeCode').val()) {
                    $("#txtempNo").val('');
                    fnMsgAlert('info', 'User Creation Wizard', 'Employee number already exists.Please enter another Employee Number');
                    return false;
                }
                else {
                    var result = regExforAlphaNumeric($.trim($("#txtempNo").val()));
                    if (!result) {
                        fnMsgAlert('info', 'User Creation Wizard', 'Special characters are not allowed in the employee number field');
                        return false;
                    }
                }
            }
            else {   // 
                var result = regExforAlphaNumeric($.trim($("#txtempNo").val()));
                if (!result) {
                    fnMsgAlert('info', 'User Creation Wizard', 'Special characters are not allowed in the employee number field');
                    return false;
                }
            }
        }
    }

    if ($.trim($("#txtempNo").val()).length > 30) {
        fnMsgAlert('info', 'User Creation Wizard', 'Employee Number length should not exceed 30.');
        return false;
    }

    //Email
    if ($("#txtemail").val() == '') {
        fnMsgAlert('info', 'User Creation Wizard', 'Please enter email id');
        return false;
    }
    else {
        if (!fnEmailCheck($("#txtemail"))) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter a valid email id');
            return false;
        }
    }
    if ($.trim($("#txtemail").val()) != '') {
        if ($.trim($("#txtemail").val()).length > 50) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please validate the email Id.Length should not exceed 50');
            return false;
        }
    }
    //Mobile
    if ($("#txtMobile").val() == '') {
        fnMsgAlert('info', 'User Creation Wizard', 'Please enter Mobile no');
        return false;
    }

    var result = fnValidateMobileNumber($("#txtMobile"), "MOBILE");
    if (!result) {
        fnMsgAlert('info', 'User Creation Wizard', 'Please validate the mobile number');
        return false;
    }
    if ($.trim($("#txtMobile").val()) != '') {
        if ($.trim($("#txtMobile").val()).length < 10) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please validate the mobile number.Mobile number must contains atleat 10 digit');
            return false;
        }
    }
    if ($.trim($("#txtMobile").val()) != '') {
        if ($.trim($("#txtMobile").val()).length > 10) {
            fnMsgAlert('info', 'User Creation Wizard', 'Mobile number length should not exceed 10.');
            return false;
        }
    }
    //Date of Joining
    if ($("#txtDOJ").val() == "") {
        fnMsgAlert('info', 'User Creation Wizard', 'Please enter the Date of Joining.');
        return false;
    }
    else {
        var result = isValidDateFormat($("#txtDOJ"));
        if (!result) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter valid date in Date of joining');
            return false;
        }
    }
    //Hidoctor start date
    if ($("#txthidoctorstartdate").val() == "") {
        fnMsgAlert('info', 'User Creation Wizard', 'Please enter the HiDoctor start date');
        return false;
    }
    else {
        var result = isValidDateFormat($("#txthidoctorstartdate"));
        if (!result) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter valid HiDoctor start date');
            return false;
        }
    }
    //Designation
    if (($('select[name="ddlDesignation"]').val() == null)) {//($('#ddlDesignation').val() == '0')
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select the Designation');
        return false;
    }
    //Division
    if (($('#ddlDivision').val() == '0')) {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select the Division');
        return false;
    }
    //Reporting Manager Region
    if (($('select[name="ddlreportingManagerregion"]').val() == null)) {//($('#ddlreportingManagerregion').val() == '0')
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select the Reporting to Manager Region');
        return false;
    }
    //Reporting Manager
    if ($('#ddlReportingManager').val() == '0') {//        ($('#ddlReportingManager').val() == '0')
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select the Reporting to Manager');
        return false;
    }
    //User Region
    if (($('select[name="ddlUserRegion"]').val() == null)) {//$('#ddlUserRegion').val() == '0'
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select the User Region');
        return false;
    }
    //Project Name
    if (($('#ddlprojectName').val() == '0')) {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Select the Project');
        return false;
    }
    //Expense Group Id
    //if (($('#ddlExpemseGroup').val() == '0')) {
    //    fnMsgAlert('info', 'User Creation Wizard', 'Please select the User's Region.');
    //    return false;
    //}


    debugger;
    var ExpMandatory = false;
    for (var k = 0; k < g_Ex_Mandatory.length; k++) {
        //$('#ddlDesignation option:selected').val()
        if (g_Ex_Mandatory[k].user_type_code == $('select[name="ddlDesignation"]').val()) {
            if (g_Ex_Mandatory[k].PRIVILEGE_VALUE_NAME == "YES") {
                ExpMandatory = true;
            }
            else {
                (g_Ex_Mandatory[k].PRIVILEGE_VALUE_NAME == "NO")
                ExpMandatory = false;
            }
        }
    }

    //var lstworkAreas = $('select[name="workarea"]').val();
    var expenseGroupId = $('select[name="ddlExpemseGroup"]').val(); //$('#ddlExpemseGroup option:selected').val();
    if (ExpMandatory) {
        if (($('select[name="ddlExpemseGroup"]').val() == null)) {
            fnMsgAlert('info', 'ExpenseGroupMapping', 'Expense group mapping is mandatory for this selected user type(s)/designation(s)');
            return false;
        }
    }


    //if ($('#ddlExpemseGroup')[0].ej2_instances[0].listData.length < 1) {//($('#ddlExpemseGroup option').length) < 1) {
    //    debugger;
    //    fnMsgAlert('info', 'User Creation Wizard', 'No Expense Groups configured to assign to the user. Please do so using the Expense Group Screens first and repeat the steps in the wizard.');
    //    return false;
    //}
    // if (!$("#mySelect option:selected").length)
    //Assign user Id 
    if ($("#txtAssignuserid").val() == "") {
        fnMsgAlert('info', 'User Creation Wizard', 'Please assign a User ID.');
        return false;
    }

    if ($.trim($("#txtAssignuserid").val()).length > 30) {
        fnMsgAlert('info', 'User Creation Wizard', 'User ID cannot exceed a length of 30 characters.');
        return false;
    }

    var result = regExforAlphaNumericEmployee($.trim($("#txtAssignuserid").val()));
    if (!result) {
        fnMsgAlert('info', 'User Creation Wizard', 'Special characters are not allowed in the Assigned User Id');
        return false;
    }
    //Password
    if ($("#txtPwd").val() == "") {
        fnMsgAlert('info', 'User Creation Wizard', 'Please enter the Password');
        return false;
    }


    var words = ["#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
    var password = new Array();
    password = $("#txtPwd").val();
    for (var i = 0; i <= password.length; i++) {
        var a = words.indexOf(password[i]);
        if (a >= 0) {
            fnMsgAlert('info', 'User Creation Wizard', "Special characters like * _ - ! @ are only allowed.");
            return false;
        }
    }

    if (password.length >= 31) {
        fnMsgAlert('info', 'User Creation Wizard', "Please enter minimum 30 character in password.");
        return false;
    }
    $.trim($("#ref1").val());
    $.trim($("#ref2").val());
    $('select[name="ddlActual"]').val();
    //Date of Birth
    if ($("#txtDOB").val() == "undefined/undefined/") {
        $("#txtDOB").val('');
    }

    if ($("#txtDOB").val() != '') {
        var result = isValidDateFormat($("#txtDOB"));
        if (!result) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please enter valid date in Date of birth');
            return false;
        }
    }
    if ($("#txtDOJ").val() != '' && $("#txthidoctorstartdate").val() != '') {
        var doj = $("#txtDOJ").val().split('/')[2] + '/' + $("#txtDOJ").val().split('/')[1] + '/' + $("#txtDOJ").val().split('/')[0];
        var hidoctorstartdate = $("#txthidoctorstartdate").val().split('/')[2] + '/' + $("#txthidoctorstartdate").val().split('/')[1] + '/' + $("#txthidoctorstartdate").val().split('/')[0];
        var dojDate = new Date(doj);
        var dojhidoctorstartdate = new Date(hidoctorstartdate);
        if (dojhidoctorstartdate < dojDate) {
            fnMsgAlert('info', 'User Creation Wizard', 'Hidoctor start date should be greater than the Date of Joining');
            return false;
        }
        //else {
        //    if ($("#txtDOJ").val() == $("#txthidoctorstartdate").val()) {
        //        fnMsgAlert('info', 'User Creation Wizard', 'Hidoctor start date should not be same as the Date of Joining');
        //        return false;
        //    }
        //}
    }

    if ($("#txtDOJ").val() != '' && $("#txtDOC").val() != '') {
        var doj = $("#txtDOJ").val().split('/')[2] + '/' + $("#txtDOJ").val().split('/')[1] + '/' + $("#txtDOJ").val().split('/')[0];
        var Confirmationdate = $("#txtDOC").val().split('/')[2] + '/' + $("#txtDOC").val().split('/')[1] + '/' + $("#txtDOC").val().split('/')[0];
        var dojDate = new Date(doj);
        var dojhidoctorstartdate = new Date(Confirmationdate);
        if (dojhidoctorstartdate < dojDate) {
            fnMsgAlert('info', 'User Creation Wizard', 'Date of Confirmation should be greater than the Date of Joining');
            return false;
        }
    }

    if ($("#txtDOJ").val() != '' && $("#txtDOB").val() != '') {
        var dob = $("#txtDOB").val().split('/')[2] + '/' + $("#txtDOB").val().split('/')[1] + '/' + $("#txtDOB").val().split('/')[0];
        var doj = $("#txtDOJ").val().split('/')[2] + '/' + $("#txtDOJ").val().split('/')[1] + '/' + $("#txtDOJ").val().split('/')[0];
        var dobDate = new Date(dob);
        var dojDate = new Date(doj);
        if (dobDate > dojDate) {
            fnMsgAlert('info', 'User Creation Wizard', 'Date of joining should be greater than date of birth');
            return false;
        }
        else {
            if ($("#txtDOJ").val() == $("#txtDOB").val()) {
                fnMsgAlert('info', 'User Creation Wizard', 'Date of joining should not be same as date of birth');
                return false;
            }
        }
    }
    //Address
    if ($.trim($("#txtAddress").val()) != '') {
        if ($("#txtAddress").val() != "") {
            var specialCharregex = new RegExp(/[~`''^&<>$\\]/);
            if (specialCharregex.test($("#txtAddress").val())) {
                var specialChar = "(/[~`''^&<>$\\]/)"
                fnMsgAlert('info', 'User Creation Wizard', 'The following  <b>' + specialChar + '</b> charcters not allowed in the address field and Enter key');
                return false;
            }
            else {
                var address = $.trim($("#txtAddress").val());
                $("#txtAddress").val(address.replace(/'/g, ' '));
            }
        }
    }
    if ($.trim($("#txtAddress").val()).length > 300) {
        fnMsgAlert('info', 'User Creation Wizard', 'Address should not exceed 300.');
        return false;
    }
    //Phone
    var result = fnValidateMobileNumber($("#txtPhoneNo"), "PHONE");
    if (!result) {
        fnMsgAlert('info', 'User Creation Wizard', 'Please validate the phone number');
        return false;
    }
    if ($.trim($("#txtPhoneNo").val()) != '') {
        if ($.trim($("#txtPhoneNo").val()).length > 20) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please validate the Phone number.Phone number must contains atleast 20 digit');
            return false;
        }
    }
    //PF No
    if ($.trim($("#txtPFNO").val()) != '') {
        var result = regExforAlphaNumeric($.trim($("#txtPFNO").val()));
        if (!result) {
            fnMsgAlert('info', 'User Creation Wizard', 'Special characters are not allowed in the PF Number');
            return false;
        }
    }
    if ($.trim($("#txtPFNO").val()) != '') {
        if ($.trim($("#txtPFNO").val()).length > 20) {
            fnMsgAlert('info', 'User Creation Wizard', 'PF Number length should not exceed 20.');
            return false;
        }
    }
    //Pan No
    if ($.trim($("#txtpanNo").val()) != '') {
        var result = regExforAlphaNumeric($.trim($("#txtpanNo").val()));
        if (!result) {
            fnMsgAlert('info', 'User Creation Wizard', 'Please Enter the Valid PAN Number/Special characters are not allowed.');
            return false;
        }
    }
    if ($.trim($("#txtpanNo").val()) != '') {
        if ($.trim($("#txtpanNo").val()).length > 20) {
            fnMsgAlert('info', 'User Creation Wizard', 'PAN Number length should not exceed 20.');
            return false;
        }
    }
    //Bank Acc No 1
    if ($.trim($("#txtbankAct1").val()) != '') {
        var result = regExforAlphaNumeric($.trim($("#txtbankAct1").val()));
        if (!result) {
            fnMsgAlert('info', 'User Creation Wizard', 'Special characters are not allowed in the Bank Account Number1');
            return false;
        }
    }
    if ($.trim($("#txtbankAct1").val()) != '') {
        if ($.trim($("#txtbankAct1").val()).length > 20) {
            fnMsgAlert('info', 'User Creation Wizard', 'Account Number1 length should not exceed 20.');
            return false;
        }
    }
    //Bank Acc no2
    if ($.trim($("#txtbankAct2").val()) != '') {
        var result = regExforAlphaNumeric($.trim($("#txtbankAct2").val()));
        if (!result) {
            fnMsgAlert('info', 'User Creation Wizard', 'Special characters are not allowed in the Bank account number2');
            return false;
        }
    }
    if ($.trim($("#txtbankAct2").val()) != '') {
        if ($.trim($("#txtbankAct2").val()).length > 20) {
            fnMsgAlert('info', 'User Creation Wizard', 'Account Number2 length should not exceed 20.');
            return false;
        }
    }

    return true;
}

function fnNextEmployee() {
    debugger;
    var result = fnValidateEmployeedetails();
    if (result) {

        var DOB = "";
        var employeedetails_arr = new Array();
        var employeeDetails = {};
        //Get All details
        var editempName = $.trim($("#txtsearchEmployeeName").val());
        var employeeName = $.trim($("#txtempName").val());
        var employeeCode = $.trim($("#hdnEmployeeCode").val());
        var employeeNumber = $.trim($("#txtempNo").val());
        var email = $.trim($('#txtemail').val());
        var mobile = $.trim($('#txtMobile').val());
        var day = $("#txtDOJ").val().split('/')[0];
        var month = $('#txtDOJ').val().split('/')[1];
        var year = $('#txtDOJ').val().split('/')[2];
        var DOJ = year + '-' + month + '-' + day;
        var Cday = $("#txtDOC").val().split('/')[0];
        var Cmonth = $('#txtDOC').val().split('/')[1];
        var Cyear = $('#txtDOC').val().split('/')[2];
        var DOC = Cyear + '-' + Cmonth + '-' + Cday;
        var day = $("#txthidoctorstartdate").val().split('/')[0];
        var month = $('#txthidoctorstartdate').val().split('/')[1];
        var year = $('#txthidoctorstartdate').val().split('/')[2];
        var HidoctorstartDate = year + '-' + month + '-' + day;
        var userTypecode = $('select[name="ddlDesignation"]').val();//$('#ddlDesignation option:selected').val();
        var userTypeName = $('select[name="ddlDesignation"]').text();//$('#ddlDesignation option:selected').text();
        var divisionCode = "";
        //$('#ddlDivision option:selected').val();
        $('select#ddlDivision > option:selected').each(function () {
            divisionCode += $(this).val() + ',';
            //entity_Names.push($(this).text().split('(')[0]);
        });
        divisionCode = divisionCode.slice(0, -1);
        var divisionName = "";
        $('select#ddlDivision > option:selected').each(function () {
            divisionName += $(this).text() + ',';
            //entity_Names.push($(this).text().split('(')[0]);
        });
        divisionName = divisionName.slice(0, -1);

        var reportingtoRegionCode = $('select[name="ddlreportingManagerregion"]').val();//$('#ddlreportingManagerregion option:selected').val();
        var reportingtoRegionName = $('select[name="ddlreportingManagerregion"]').text(); //$('#ddlreportingManagerregion option:selected').text();
        var reportingtoManagerCode = $('select[name="ddlReportingManager"]').val();
        var reportingtoManagerName = $('select[name="ddlReportingManager"]').text();
        var reportinguser = "";
        $("input[name='underuserchk']:checked").each(function () {
            if ($(this).is(':checked')) {

                reportinguser += $(this).val() + ",";
            }
        });

        var userRegioncode = $('select[name="ddlUserRegion"]').val();//$('#ddlUserRegion option:selected').val();
        var userRegionName = $('select[name="ddlUserRegion"]').text();// $('#ddlUserRegion option:selected').text();
        var projectCode = $('#ddlprojectName option:selected').val();
        var projectName = $('#ddlprojectName option:selected').text();
        var expenseGroupId = $('select[name="ddlExpemseGroup"]').val();//$('#ddlExpemseGroup option:selected').val();
        var expenseGroupName = $('select[name="ddlExpemseGroup"]').text(); //$('#ddlExpemseGroup option:selected').text();
        var assignUserid = $('#txtAssignuserid').val();
        MailEmpname = $.trim($("#txtempName").val());
        MailUsername = assignUserid;
        var userCode = $('#hdnUserCode').val();
        var password = $('#txtPwd').val();
        Mailpassword = password;
        var refkey1 = $('#ref1').val();
        var refkey2 = $('#ref2').val();
        var ActualReport = $('select[name="ddlActual"]').val();

        if ($("#txtDOB").val() == "undefined/undefined/") {
            $("#txtDOB").val('');
        }
        var day = $("#txtDOB").val().split('/')[0];
        var month = $('#txtDOB').val().split('/')[1];
        var year = $('#txtDOB').val().split('/')[2];
        var DOBvalue = year + '-' + month + '-' + day;
        if (DOBvalue == "undefined-undefined-") {
            DOB = "";
        }
        else {
            DOB = DOBvalue;
        }
        var gender = $('#ddlGender option:selected').val();
        var address = $('#txtAddress').val();
        var phone = $('#txtPhoneNo').val();
        var pfNo = $('#txtPFNO').val();
        var panNo = $('#txtpanNo').val();
        var bankAcc1 = $('#txtbankAct1').val();
        var bankAcc2 = $('#txtbankAct2').val();
        var ednProof = $('input[name="rdnEdn"]:checked').val();
        var salaryproof = $('input[name="rdnSal"]:checked').val();
        var resumeGiven = $('input[name="rdnRes"]:checked').val();
        var resignationsubmitted = $('input[name="rdnResignation"]:checked').val();
        var appointed = $('input[name="rdnAppointed"]:checked').val();
        var entryMode = $('#hdnMode').val();

        employeeDetails.Employee_Code = employeeCode;
        employeeDetails.Employee_Name = employeeName;
        employeeDetails.Employee_Number = employeeNumber;
        employeeDetails.Gender = gender;
        employeeDetails.Date_of_birth = DOB;
        employeeDetails.Address = address;
        employeeDetails.Phone = phone;
        employeeDetails.Mobile = mobile;
        employeeDetails.Email_Id = email;
        employeeDetails.Date_of_Joining = DOJ;
        employeeDetails.Prop_Date_of_Confirmation = DOC;
        employeeDetails.HiDOCTOR_Start_Date = HidoctorstartDate;
        employeeDetails.EDN_Proof = ednProof;
        employeeDetails.Salary_Proof = salaryproof;
        employeeDetails.Resume_Given = resumeGiven;
        employeeDetails.Resignation_Submitted = resignationsubmitted;
        employeeDetails.Appointed = appointed;
        employeeDetails.SCB_Account_Number = bankAcc1;
        employeeDetails.ICICI_Account_Number = bankAcc2;
        employeeDetails.PF_Number = pfNo;
        employeeDetails.PAN_Number = panNo;
        employeeDetails.User_Name = assignUserid;
        employeeDetails.User_Code = userCode;
        employeeDetails.User_Pass = password;
        employeeDetails.RefKey1 = refkey1;
        employeeDetails.RefKey2 = refkey2;
        employeeDetails.ActualReporting = ActualReport;
        employeeDetails.Reporting_Manager_User_Code = reportingtoManagerCode;
        employeeDetails.Reporting_Manager_User_Name = reportingtoManagerName;
        employeeDetails.lstunderuser = reportinguser;

        employeeDetails.User_Type_Code = userTypecode;
        employeeDetails.User_Type_Name = userTypeName;
        employeeDetails.Region_Code = userRegioncode;
        employeeDetails.Region_Name = userRegionName;
        employeeDetails.Reporting_Manager_Region_Code = reportingtoRegionCode
        employeeDetails.Reporting_Manager_Region_Name = reportingtoRegionName
        employeeDetails.Division_Code = divisionCode;
        employeeDetails.Division_Name = divisionName;
        employeeDetails.Project_Code = projectCode;
        employeeDetails.Project_Name = projectName;
        employeeDetails.Expense_Group_Id = expenseGroupId;
        employeeDetails.Expense_Group_Name = expenseGroupName;
        employeeDetails.Entry_Mode = entryMode;
        employeeDetails.Edit_Employee_Name = editempName;
        employeedetails_arr.push(employeeDetails);
        Empdetails = employeedetails_arr;
        try {
            ShowModalPopup('dvLoading');
            //$('#dvPanel').block({
            //    message: '<h3>Loading...</h3>',
            //    css: { border: '2px solid #ddd' }
            //});
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/checkAssignUserId',
                type: "POST",
                data: "userName=" + assignUserid + "&userCode=" + userCode + "&employeeCode=" + employeeCode,
                success: function (result) {
                    debugger;
                    if (result == "SUCCESS") {

                        if (employeedetails_arr != null && employeedetails_arr != '' && employeedetails_arr.length > 0) {
                            $.ajax({
                                url: '../HiDoctor_Master/UsercreationWizard/GetEmployeeDetailsList',
                                type: "POST",
                                data: "employee_Arr=" + JSON.stringify(employeedetails_arr),
                                success: function (result) {
                                    debugger;
                                    if (result != '' && result != null) {
                                        if (result.length > 0) {
                                            // $('#ullist li.cls_up_stpe1').addClass('tick_img');
                                            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateLeaveDetails/?employeeName=' + escape(employeeName) + '&userType=' + escape(userTypeName) + '&divisionName=' + escape(divisionName) + '&regionName=' + escape(userRegionName) + '&userTypecode=' + escape(userTypecode) + '&divisionCode=' + escape(divisionCode) + '&UserregionCode=' + escape(userRegioncode) + '&reportingmanagerusercode=' + escape(reportingtoManagerCode) + '&hiDoctorStartDate=' + escape(HidoctorstartDate) + '&DOJ=' + escape(DOJ));
                                        }
                                    }
                                    HideModalPopup('dvLoading');
                                },
                                error: function (e) {
                                    fnMsgAlert('info', '', 'Network Error, Please check your network.');
                                    HideModalPopup('dvLoading');
                                    //$('#dvPanel').unblock();
                                },
                                complete: function () {
                                    HideModalPopup('dvLoading');
                                    // $('#dvPanel').unblock();
                                }
                            });
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Information', result);
                        HideModalPopup('dvLoading');
                        return false;
                    }
                    HideModalPopup('dvLoading');
                    // $('#dvPanel').unblock();
                },
                error: function (e) {
                    fnMsgAlert('info', '', 'Network Error, Please check your network.');
                    HideModalPopup('dvLoading');
                    // $('#dvPanel').unblock();
                },
                complete: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
        catch (e) {
            fnMsgAlert('info', '', 'Network Error, Please check your network.');
            HideModalPopup('dvLoading');
            //$('#dvPanel').unblock();
        }
    }
}

function fnGetEmployee() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetEmployee',
        type: "POST",
        data: "A",
        async: false,
        success: function (jsData) {
            debugger;
            //unassignedAllemployeedetails = eval('(' + jsData + ')');
            Json_Assignemp_g = eval('(' + jsData + ')');
            //var Json_EmployeeNames = eval('(' + jsData + ')');
            //if (Json_EmployeeNames.length > 0 && Json_EmployeeNames != null && Json_EmployeeNames != '') {
            //    var baseEmployeeNames = "[";
            //    for (var i = 0; i < Json_EmployeeNames.length; i++) {
            //        baseEmployeeNames += "{label:" + '"' + "" + Json_EmployeeNames[i].Employee_Name + "(" + Json_EmployeeNames[i].Employee_Number + ")" + "" + '",' + "value:" + '"' + "" + Json_EmployeeNames[i].Employee_Code + "" + '"' + "}";
            //        if (i < jsData.length - 1) {
            //            baseEmployeeNames += ",";
            //        }
            //    }
            //    baseEmployeeNames += "];";
            //    baseEmployeejson_g = eval(baseEmployeeNames);
            //    autoComplete(baseEmployeejson_g, "txtsearchEmployeeName", "hdnEmployeeCode", "Groupname");


            ////   $('#txtsearchEmployeeName').html('');
            //       var jsonresult = eval('(' + jsData + ')');
            //       var Json_EmployeeNames = eval('(' + jsData + ')');
            //       var content = '';
            //       if (Json_EmployeeNames.length > 0 && Json_EmployeeNames != null && Json_EmployeeNames != '') {
            //           var checkList = new ej.dropdowns.ComboBox({
            //               // set the country data to dataSource property
            //               dataSource: Json_EmployeeNames,
            //               // map the appropriate columns to fields property
            //               fields: { text: 'Employee_Name', value: 'Employee_Number' },
            //               //// set the placeholder to MultiSelect input element
            //               placeholder: 'Select Employee name',
            //               // set the type of mode for checkbox to visualized the checkbox added in li element.
            //               mode: 'CheckBox',
            //               // set true for enable the selectAll support.
            //               showSelectAll: true,
            //               // set true for enable the dropdown icon.
            //               showDropDownIcon: true,
            //               // set the placeholder to MultiSelect filter input element
            //               filterBarPlaceholder: 'Search',
            //               // set the MultiSelect popup height
            //               popupHeight: '350px'
            //           });
            //           checkList.appendTo('#txtsearchEmployeeName');
            //           //content += '<select class="selectpicker" multiple data-live-search="true" id="ddlRegion"  onchange="BMWC.fnbindRegionlist();">';
            //           ////content += '<select class="multi-select mandatory" multiple="multiple" id="ddlRegion"  onchange="BMWC.fnbindRegionlist();">';
            //           //for (var i = 0; i < data.list.length; i++) {
            //           //    content += '<option  value="' + data.list[i].Region_Code + '">' + data.list[i].Region_Name + '</option>';
            //           //}
            //           //content += '</select>';
            //       }
            //       else {
            //           content = "No data found";
            //}

            //$('#txtsearchEmployeeName').val('');
            ////Result = data;

            var lstEmployee = [];
            var jsonresult = eval('(' + jsData + ')');
            var Json_EmployeeNames = eval('(' + jsData + ')');
            for (var i = 0; i < Json_EmployeeNames.length; i++) {
                _objData = {};
                _objData.id = Json_EmployeeNames[i].Employee_Code;
                _objData.label = Json_EmployeeNames[i].Employee_Name;
                lstEmployee.push(_objData);
            }
            //if (lstEmployee.length > 0) {
            EmployeeDetails = lstEmployee;
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstEmployee,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                allowFiltering: true,
                placeholder: 'Select a Employee',
                showClearButton: true,
                filtering: function (e) {
                    debugger;
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstEmployee, dropdown_query);
                }
            });
            atcObj.appendTo('#txtsearchEmployeeName');
            //document.getElementById('btn').onclick = () => {
            //    atcObj.value = null;
            //};
            //}
            //}

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
}

//Used to get Active employeedetails
function fnGetActiveEmployeedetails() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetActiveEmployeedetails',
        type: "POST",
        data: "A",
        async: false,
        success: function (jsData) {

            unassignedAllemployeedetails = eval('(' + jsData + ')');
            //var Json_EmployeeNames = eval('(' + jsData + ')');
            //if (Json_EmployeeNames.length > 0 && Json_EmployeeNames != null && Json_EmployeeNames != '') {
            //    var baseEmployeeNames = "[";
            //    for (var i = 0; i < Json_EmployeeNames.length; i++) {
            //        baseEmployeeNames += "{label:" + '"' + "" + Json_EmployeeNames[i].Employee_Name + "(" + Json_EmployeeNames[i].Employee_Number + ")" + "" + '",' + "value:" + '"' + "" + Json_EmployeeNames[i].Employee_Code + "" + '"' + "}";
            //        if (i < jsData.length - 1) {
            //            baseEmployeeNames += ",";
            //        }
            //    }
            //    baseEmployeeNames += "];";
            //    baseEmployeejson_g = eval(baseEmployeeNames);
            //    autoComplete(baseEmployeejson_g, "txtsearchEmployeeName", "hdnEmployeeCode", "Groupname");
            //}
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
}

//Get DesignationBydivision
function fnGetDesignationByDivision(val) {
    debugger;
    try {
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        if (val == 1) {
            if ($('#ddlDivision').val() == '0') {
                fnMsgAlert('info', 'User Creation Wizard', 'Please Select The Division');
                $('#dvPanel').unblock();
                return false;
            }
            //var divisionCode = $('#ddlDivision") option:selected').val();
            divisionCode = "";
            $('select#ddlDivision > option:selected').each(function () {
                divisionCode += $(this).val() + ',';
                //entity_Names.push($(this).text().split('(')[0]);
            });
        }
        else {
            if ($('#DDlDivision').val() == '0') {
                fnMsgAlert('info', 'User Creation Wizard', 'Please Select The Division');
                $('#dvPanel').unblock();
                return false;
            }
            //var divisionCode = $('#ddlDivision") option:selected').val();
            divisionCode = "";
            $('select#DDlDivision > option:selected').each(function () {
                divisionCode += $(this).val() + ',';
                //entity_Names.push($(this).text().split('(')[0]);
            });
        }

        divisionCode = divisionCode.slice(0, -1);
        if (divisionCode != null && divisionCode != '') {
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetDesignationbyDivision',
                type: "POST",
                data: "divisionCode=" + divisionCode,
                async: false,
                success: function (JsonResult) {
                    debugger;
                    Json_UserTypeBydivision = JsonResult;
                    // if (JsonResult != null && JsonResult != '') {
                    //  var JsonResult = [];
                    $('#dvDesignation').empty();
                    $('#dvDesignation').html('<input type="text" id="ddlDesignation"  placeholder="Select Designation..">')
                    $('#dvDesignation').html('<input type="text" id="ddlDesignation" onchange="">')
                    var jsonresult = eval('(' + JsonResult + ')');

                    var lstusertype = [];
                    // var Json_EmployeeNames = eval('(' + jsData + ')');
                    for (var i = 0; i < jsonresult.length; i++) {
                        _objData = {};
                        _objData.id = jsonresult[i].User_Type_Code;
                        _objData.label = jsonresult[i].User_Type_Name;
                        lstusertype.push(_objData);
                    }
                    //if (lstEmployee.length > 0) {
                    Usertypedetails = lstusertype;
                    var atcObj = new ej.dropdowns.DropDownList({
                        //set the data to dataSource property
                        dataSource: lstusertype,
                        fields: { text: 'label', value: 'id' },
                        filterBarPlaceholder: 'Search',
                        showClearButton: true,
                        allowFiltering: true,
                        placeholder: 'Select a Designation',
                        change: function (args) {
                            fnDesignationChange(args);
                            if (val == 3 || val == 2) {
                                fngetmaildetails();
                            }
                        },
                        filtering: function (e) {
                            var dropdown_query = new ej.data.Query();
                            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                            e.updateData(lstusertype, dropdown_query);
                        }
                    });
                    atcObj.appendTo('#ddlDesignation');
                    //},
                    //if (JsonResult.length > 0) {
                    //    var jsonresult = eval('(' + JsonResult + ')');
                    //    $("#ddlDesignation option").remove();
                    //    var selectcolumn = $("#ddlDesignation");
                    //    selectcolumn.append("<option value=0>-Select Designation--</option>");
                    //    for (var i = 0; i < jsonresult.length; i++) {
                    //        selectcolumn.append("<option value=" + jsonresult[i].User_Type_Code + ">" + jsonresult[i].User_Type_Name + "</option>");
                    //    }
                    //}
                    //  }
                    $('#dvPanel').unblock();
                    // }
                },
                error: function () {
                    fnMsgAlert("Get designations failed.")
                    $('#dvPanel').unblock();
                }
            });
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
}

function fnDesignationChange(args) {

    debugger

    if (args != undefined) {
        if (args.isInteracted && args.itemData != null) {
            fnbtnchange();
        } else {
            return true;
        }

    }
    oldDetails;
    $('#Effectivefrm').show();
    effect = '1';
}

//Used to prefill the Session Employee details
var underuserSel = "";
function fnPrefillSessionEmployeeDetails(Jsonempdata_sess) {
    debugger;
    var jsonresult = Jsonempdata_sess
    if (jsonresult != null && jsonresult != '') {
        if (jsonresult.length > 0) {
            $('#dvPanel').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            //var employeeCode = $('#hdnEmployeeCode').val();


            //Get Employee details
            var editempName = jsonresult[0].Edit_Employee_Name;
            var employeeName = jsonresult[0].Employee_Name;
            var employeeNumber = jsonresult[0].Employee_Number;
            var employeeCode = jsonresult[0].Employee_Code;
            var email = jsonresult[0].Email_Id;
            var mobile = jsonresult[0].Mobile;
            var doJ = jsonresult[0].Date_of_Joining;
            var doC = jsonresult[0].Prop_Date_of_Confirmation;
            var hidoctorStartdate = jsonresult[0].HiDOCTOR_Start_Date;

            var divisionCode = jsonresult[0].Division_Code.split(',');
            //var divisionCode = "";
            for (var g = 0; g < divisionCode.length; g++) {
                $("#ddlDivision").multiselect("widget").find(":checkbox[value='" + divisionCode[g] + "']").attr("checked", "checked");
                $("#ddlDivision option[value='" + divisionCode[g] + "']").attr("selected", true);

            }
            $('#ddlDivision').multiselect("destroy").multiselect().multiselectfilter();
            if (divisionCode[0] != '') {
                fnGetDesignationByDivision(1);
            }
            //fnGetReportingManagerRegion();
            var userTypeCode = jsonresult[0].User_Type_Code;
            var userTypeName = jsonresult[0].User_Type_Name;
            var msObject = document.getElementById("ddlDesignation").ej2_instances[0];
            msObject.value = userTypeCode;
            var reportingtoRegionCode = jsonresult[0].Reporting_Manager_Region_Code;
            var reportingtoRegionName = jsonresult[0].Reporting_Manager_Region_Name;
            var reportingtoManagerCode = jsonresult[0].Reporting_Manager_User_Code;
            var reportingtoManagerName = jsonresult[0].Reporting_Manager_User_Name;
            var regcode = jsonresult[0].Region_Code;
            underuserSel = jsonresult[0].lstunderuser.slice(0, -1);
            underuserSel = underuserSel.split(',');
            fngetreportingusersprefill(regcode);
            var UserRegioncode = jsonresult[0].Region_Code;
            var UserRegionName = jsonresult[0].Region_Name;
            var projectCode = jsonresult[0].Project_Code;
            var projectName = jsonresult[0].Project_Name;
            var ExpenseGroupId = jsonresult[0].Expense_Group_Id;
            var expenseGroupName = jsonresult[0].Expense_Group_Name;
            var assignuserid = jsonresult[0].User_Name;
            var userCode = jsonresult[0].User_Code;
            var passwrd = jsonresult[0].User_Pass;
            var refkey1 = jsonresult[0].RefKey1;
            var refkey2 = jsonresult[0].RefKey2;
            var ActualReporting = jsonresult[0].ActualReporting
            var gender = jsonresult[0].Gender;
            var doB = jsonresult[0].Date_of_birth;
            var address = jsonresult[0].Address;
            var phone = jsonresult[0].Phone;
            var pfNo = jsonresult[0].PF_Number;
            var panNo = jsonresult[0].PAN_Number;
            var bankAcc1 = jsonresult[0].SCB_Account_Number;
            var bankAcc2 = jsonresult[0].ICICI_Account_Number;
            var EdnProof = jsonresult[0].EDN_Proof;
            var salaryProof = jsonresult[0].Salary_Proof;
            var resumeGiven = jsonresult[0].Resume_Given;
            var resignationsubmitted = jsonresult[0].Resignation_Submitted;
            var Appointed = jsonresult[0].Appointed;
            var mode = jsonresult[0].Entry_Mode;
            //Prefill Employee Details   
            $("#txtsearchEmployeeName").val(editempName); // Edit empName
            $('#txtempName').val(employeeName);
            $('#hdnEmployeeCode').val(employeeCode);
            $('#txtempNo').val(employeeNumber);
            $('#txtemail').val(email); //Email
            $('#txtMobile').val(mobile);//Mobile
            var doJ_g = doJ.split('-')[2] + "/" + doJ.split('-')[1] + "/" + doJ.split('-')[0]
            $('#txtDOJ').val(doJ_g); //DOJ
            var doC_g = doC.split('-')[2] + "/" + doC.split('-')[1] + "/" + doC.split('-')[0]
            $('#txtDOC').val(doC_g); //DOJ
            var hidoctorstartdate_g = hidoctorStartdate.split('-')[2] + "/" + hidoctorStartdate.split('-')[1] + "/" + hidoctorStartdate.split('-')[0]
            $('#txthidoctorstartdate').val(hidoctorstartdate_g) // Hidoctor Start Date
            $('#hdnUserTypeCode').val(userTypeCode); //Designation User Type Code
            // $('#ddlDesignation').val(userTypeCode);//Designation user Type Name
            $('#hdnDivisionCode').val(divisionCode); //Get Dvision Code
            $('#ddlDivision').val(divisionCode); //Get Division name
            $('#hdnReportingtoRegioncode').val(reportingtoRegionCode); //reporting to region Code
            //$('#ddlreportingManagerregion').val(reportingtoRegionCode); //Reporting to region name //ddlreportingManagerregion
            var msObject = document.getElementById("ddlreportingManagerregion").ej2_instances[0];
            msObject.value = reportingtoRegionCode;
            $('#hdnReportingtoManagerCode').val(reportingtoManagerCode); //Reproting to Manager Code
            var msObject = document.getElementById("ddlReportingManager").ej2_instances[0];
            msObject.value = reportingtoManagerCode;
            //$('#ddlReportingManager').val(reportingtoManagerCode);// Reproting to Manager Name
            //$('#bindreportingusers').val(reportinguser);
            $('#hdnUserRegion').val(UserRegioncode); //User region Code
            // $('#ddlUserRegion').val(UserRegioncode); //User Region Name

            $('#hdnProjectCode').val(projectCode); // Project Code
            $('#ddlprojectName').val(projectCode); // Project Name
            $('#hdnExpenseGroupCode').val(ExpenseGroupId); //Expense Group Id
            var msObject = document.getElementById("ddlExpemseGroup").ej2_instances[0];
            msObject.value = ExpenseGroupId;
            //$('#ddlExpemseGroup').val(ExpenseGroupId); // Expense Group Name
            $('#txtAssignuserid').val(assignuserid); // Assign user Id
            $('#hdnUserCode').val(userCode); // Assign User Code
            $('#txtPwd').val(passwrd);//Password    
            $('#ref1').val(refkey1);//Refkey1
            $('#ref2').val(refkey2);//Refkey2
            var doB_g = doB.split('-')[2] + "/" + doB.split('-')[1] + "/" + doB.split('-')[0]
            $('#txtDOB').val(doB_g); // DOB
            $('#ddlGender').val(gender); //Gender
            $('#txtAddress').val(address); //Address
            $('#txtPhoneNo').val(phone); //Phone
            $('#txtPFNO').val(pfNo); //PF No
            $('#txtpanNo').val(panNo); //PAN No
            $('#txtbankAct1').val(bankAcc1); //ACC no 1
            $('#txtbankAct2').val(bankAcc2); //ACC no 2         
            $('#hdnMode').val(mode); //Edit Mode
            //EDN Proof
            fnGetUserRegionByregionCodeBack(reportingtoRegionCode);
            if (EdnProof == "1") {
                $('input:radio[id=rdnEdnYes]').prop('checked', true);
            }
            else {
                $('input:radio[id=rdnEdnNo]').prop('checked', true);
            }
            //Salary Proof
            if (salaryProof == "1") {
                $('input:radio[id=rdnSalYes]').prop('checked', true);
            }
            else {
                $('input:radio[id=rdnSalNo]').prop('checked', true);
            }
            //Resume given
            if (resumeGiven == "1") {
                $('input:radio[id=rdnResYes]').prop('checked', true);
            }
            else {
                $('input:radio[id=rdnResNo]').prop('checked', true);
            }
            //Resignation Submitted
            if (resignationsubmitted == "1") {
                $('input:radio[id=rdnResignationYes]').prop('checked', true);
            }
            else {
                $('input:radio[id=rdnResignationNo]').prop('checked', true);
            }
            //Appointed
            if (Appointed == "1") {
                $('input:radio[id=rdnAppointedYes]').prop('checked', true);
            }
            else {
                $('input:radio[id=rdnAppointedNo]').prop('checked', true);
            }
            var msObject = document.getElementById("ddlUserRegion").ej2_instances[0];
            msObject.value = UserRegioncode;
            $('#showtree').show();
            $('#dvPanel').unblock();
        }
    }
}

function fngetreportingusersprefill(regcode) {

    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/Getunderusers',
        type: "POST",
        async: false,
        data: "regionCode=" + regcode,
        success: function (JsonResult) {
            debugger;
            // fnbindusersreportingHTML(JsonResult);
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    var jsonresult = eval('(' + JsonResult + ')');
                    var selectcolumn = '';
                    // selectcolumn.append("<option value=0>-Select Region-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn += "<input type='checkbox' name='underuserchk' value=" + jsonresult[i].User_Code + ">" + jsonresult[i].User_Name + "</br>";
                        //selregion = jsonresult[i].Region_Code;
                    }
                }
                $("#bindreportingusers").html(selectcolumn);
            }
        },
        complete: function (e) {
            for (var g = 0; g < underuserSel.length; g++) {
                $('input:checkbox[name=underuserchk][value=' + underuserSel[g] + ']').attr('checked', true);
                //  $("#bindreportingusers option[value='" + jsonresult[g].lstunderuser + "']").attr("checked", true)
            }
        }

    });
}

//Used To show Tree
function fnShowTree() {
    var id = "divShowTree";
    var regionCode = $('select[name="ddlreportingManagerregion"]').val();// $('#ddlreportingManagerregion option:selected').val();
    var strTree = "";
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetRegionTreeDetails',
        type: "POST",
        data: "regionCode=" + regionCode,
        success: function (result) {
            if (result != null && result != '') {
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(result);

                $("#" + id).dynatree({
                    checkbox: false,
                    ajaxDefaults: {
                        type: 'POST',
                        cache: false
                    },
                    //    onActivate: function (node) {
                    //        fnRegionTreeActivate(node);
                    //    },
                    //    onClick: function (node, event) {
                    //        // Close menu on click
                    //        if ($(".contextMenu:visible").length > 0) {
                    //            $(".contextMenu").hide();
                    //        }
                    //    },
                    //    onCreate: function (node, span) {
                    //        bindRegionContextMenu(span);
                    //    },
                    //    onKeydown: function (node, event) {
                    //        // Eat keyboard events, when a menu is open
                    //    },
                    //    onDeactivate: function (node) {
                    //    },

                    //    strings: {
                    //        loading: "Loading…",
                    //        loadError: "Load error!"
                    //    },
                    //    onDblClick: function (node, event) {
                    //        fnRegionTreeNodeClick(node);
                    //    },
                    //    onPostInit: function (node, event) {
                    //        fnRegionTreePostInit(node);
                    //    },
                    //    onExpand: function (select, dtnode) {
                    //        fnRegionTreeVacantNodeInit(select, dtnode, id);
                    //    }
                });

                // vacant user background-color change                
                $("#" + id).dynatree("getRoot").visit(function (node) {
                    //$(node.span.lastChild).addClass("tip");
                    //if ($.inArray(node.data.key, vacantArr) > -1) {
                    //if (node.data.title.split('-')[1] == "NOT ASSIGNED" || node.data.title.split('-')[1] == "VACANT") {
                    //    $(node.span).addClass('tree-node-vacant');
                    //}
                    if (node.data.title.split('-')[1] == "NOT ASSIGNED") {
                        $(node.span).addClass('tree-node-assigned');
                    }
                    if (node.data.title.split('-')[1] == "VACANT") {
                        $(node.span).addClass('tree-node-vacant');
                    }
                    if (node.data.title.split('-')[1] == "TO BE VACANT") {
                        $(node.span).addClass('tree-node-tobevacant');
                    }
                    //}
                });
                //ShowModalPopup('dvShowTreepopup');
                $('#dvShowTreepopup').modal('show');
            }
        },
        error: function () {
            fnMsgAlert("Show Tree Get failed.")
        }
    });
}

var g_Ex_Mandatory;
function fnUserExpenseGroupMand() {
    debugger;
    var UserExpenseGroupMand = true;
    var User_Type_Code = "";
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/UsercreationWizard/GetExpenseGroupMandatory',
        data: 'User_Type_Code=' + User_Type_Code,
        async: false,
        success: function (result) {
            debugger;
            g_Ex_Mandatory = eval('(' + result + ')');
            g_Ex_Mandatory = g_Ex_Mandatory.Rows;
        }
    });
    return UserExpenseGroupMand;
}

//***********************************************************User Creation Functions End(New Main)*****************************************************************//

//***********************************************************User Disable Functions Start(New Main)*****************************************************************//

//Used to get All reporting user
function fnGetUserstodisable() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetchildUsertoDisable',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            debugger;

            //if (JsonResult != null && JsonResult != '') {
            //    if (JsonResult.length > 0) {
            //        json_Userdetails_g = eval('(' + JsonResult + ')');
            //        var Json_User = eval('(' + JsonResult + ')');
            //        if (Json_User.length > 0 && Json_User != null && Json_User != '') {
            //            var baseUsers = "[";
            //            for (var i = 0; i < Json_User.length; i++) {
            //                baseUsers += "{label:" + '"' + "" + Json_User[i].User_Name.toUpperCase() + '(' + Json_User[i].Region_Name.toUpperCase() + ')' + "" + '",' + "value:" + '"' + "" + Json_User[i].User_Code + "" + '"' + "}";
            //                if (i < Json_User.length - 1) {
            //                    baseUsers += ",";
            //                }
            //            }
            //            baseUsers += "];";
            //            baseUsersjson_g = eval(baseUsers);
            //            autoComplete(baseUsersjson_g, "txtSearhUserId", "hdnsearchUserCode", "GroupsearchUserId");
            //        }
            //    }
            //}

            var lstUser = [];
            json_Userdetails_g = eval('(' + JsonResult + ')');
            var Json_User = eval('(' + JsonResult + ')');
            for (var i = 0; i < json_Userdetails_g.length; i++) {
                _objData = {};
                _objData.id = json_Userdetails_g[i].User_Code;
                _objData.label = json_Userdetails_g[i].User_Name;


                lstUser.push(_objData);
            }
            //  if (lstUser.length > 0) {
            UserDetails = lstUser;
            var valueArr = [];
            //valueArr.push(lstUser[0].label);
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstUser,
                showClearButton: true,
                filterBarPlaceholder: 'Search',
                allowFiltering: true,
                fields: { text: 'label', value: 'id' },
                placeholder: 'Select a User',
                //value: valueArr
                change: fnGetemployeeNamebyUsercode,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstUser, dropdown_query);
                }

            });
            atcObj.appendTo('#txtSearhUserId');
            //}
            //}
        },
        error: function () {
            fnMsgAlert("Get Users failed.");
        }
    });
}

function fnGetemployeeNamebyUsercode() {
    debugger;
    Usertypecode_g = '';
    //Clear all values when change another user name
    $('#spnMessage').html('');
    $("#spnMessage").show()
    $('#disableDate').hide();
    $('#remks').hide();
    $('#btnShowtmailbtn').hide();
    $('#finish').hide();
    $("#reportuser").hide();
    $("#showleafusers").hide();
    $("#btnsave").hide();
    $("#btnGO").show();
    if ($.trim($("#txtSearhUserId").val()) == "") {
        $('#disableDate').hide();
        $('#remks').hide();
        $('#btnShowtmailbtn').hide();
        $('#dvenabledetails').hide();
    }

    if ($('#disableDate:visible')) {
        $("#txtdisableDate").val('');
    }
    //var userNamewithregionName = $.trim($("#txtSearhUserId").val());
    ////var userName = userNamewithregionName.split('(')[0];
    //var disJson = jsonPath(json_Userdetails_g, "$.[?(@.User_Name=='" + userNamewithregionName + "')]");

    //if (disJson != false) {
    //    $("#hdnsearchUserCode").val(disJson[0].User_Code)
    //}
    //else {
    //    $("#hdnsearchUserCode").val('');
    //}

    //if ($("#txtSearhUserId").val() != '') {
    //    if ($("#hdnsearchUserCode").val() == '') {
    //        //  fnMsgAlert('info', 'Info', 'Please Enter a valid User Id.');
    //        return false;
    //    }
    //}

    var UserCode = $('select[name="txtSearhUserId"]').val();
    if (UserCode != null && UserCode != '') {
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/GetEmployeeNamebyUserCode',
            type: "POST",
            data: "userCode=" + UserCode,
            success: function (jsData) {

                var Json_EmployeeName = eval('(' + jsData + ')');
                if (Json_EmployeeName.length > 0 && Json_EmployeeName != null && Json_EmployeeName != '') {
                    $('#dvenabledetails').show();
                    var empName = Json_EmployeeName[0].Employee_Name;
                    var userName = Json_EmployeeName[0].User_Name;
                    var usertypecode = Json_EmployeeName[0].User_Type_Code;
                    var regionName = Json_EmployeeName[0].Region_Name;
                    var regionCode = Json_EmployeeName[0].Region_Code;
                    var employeeNo = Json_EmployeeName[0].Employee_Number;
                    var empCode = Json_EmployeeName[0].Employee_Code;
                    Usertypecode_g = usertypecode;
                    if (empName != '' && empName != null) {
                        //$('#txtsearchEmpname').val(empName);
                        //$('#txtsearchRegion').val(regionName);
                        //$('#txtemployeeNo').val(employeeNo);   //Commented for lable changes
                        $('#txtsearchEmpname').html(empName);
                        $('#txtsearchRegion').html(regionName);
                        $('#hdnSearchregion').val(regionCode)
                        $('#txtemployeeNo').html(employeeNo);
                        $("#hdnSearchEmployeeNo").val(empCode)
                        $('#hdndisableEmployeeCode').val(empCode);
                        $('#btnGO').focus();
                        // $('#txtSearhUserId').val(userName);
                        fnmailprivilege();
                    }
                }
                else {
                    $('#dvenabledetails').hide();
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            }
        });
    }
}

function fnCheckDisableUser() {
    debugger;
    var result = fnValidateDisableUserdetail();
    if (result) {
        var userCode = $('select[name="txtSearhUserId"]').val();
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/GetChildUsers',
            type: "POST",
            data: "userCode=" + userCode,
            success: function (JsonResult) {
                debugger;
                if (JsonResult != null && JsonResult != '') {
                    if (JsonResult.length > 1) {
                        json_GetchildUsers = eval('(' + JsonResult + ')');
                        var jsDate = eval('(' + JsonResult + ')');
                        if (jsDate.length > 1 && jsDate != null && jsDate != '') {
                            $("#finish").show();
                            fnshowunderusers();
                            // $('#spnMessage').html('Selected User has Child users.<a href="#" onclick="fnshowunderusers();">CLICK HERE</a>to assign the child users to other user.');
                            $('#disableDate').show();
                            $('#remks').show();
                            //if ($('#btnShowtmailbtn').is(':visible') && IsResMailNeeded == "1") {
                            //    $('#btnShowtmailbtn').show();
                            //} else {
                            //    $('#btnShowtmailbtn').hide();
                            //}

                            // $('#btnNextdisableUser').show();
                        }
                        else {
                            $('#spnMessage').html('');
                            $('#disableDate').show();
                            $('#remks').show();
                            //if ($('#btnShowtmailbtn').is(':visible') && IsResMailNeeded == "1") {
                            //    $('#btnShowtmailbtn').show();
                            //} else {
                            //    $('#btnShowtmailbtn').hide();
                            //}
                            $('#finish').show();
                        }
                        fngetresuserdivision();
                    }
                }
            },
            error: function () {
                fnMsgAlert("Get Child count failed.")
            }
        });
    }
}

function fnshowunderusers() {
    debugger;
    var userCodeval = $('select[name="txtSearhUserId"]').val();
    $("#spnMessage").hide();
    $("#reportuser").show();
    $("#showleafusers").show();
    $("#btnGO").hide();
    $("#btnsave").show();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/Getleafusers',
        type: "POST",
        data: "userCode=" + userCodeval,
        success: function (JsonResult) {
            debugger;
            if (JsonResult != '') {
                $("#spnMessage").hide();
                $("#reportuser").show();
                $("#showleafusers").show();
                $("#btnGO").hide();
                $("#btnsave").show();
            }



            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    var jsonresult = eval('(' + JsonResult + ')');
                    var selectcolumn = '';
                    var username = '';
                    username += 'Reporting Users for ' + $('#txtSearhUserId').val();
                    $("#reportinguser").html(username);
                    // selectcolumn.append("<option value=0>-Select Region-</option>");
                    for (var g = 0; g < jsonresult.length; g++) {
                        selectcolumn += "<div class='col-xs-12'>";
                        selectcolumn += "<div class='col-xs-4' style='margin-top: 23px;'>";
                        selectcolumn += "<input type='hidden' style='margin-left: 15px;margin-top: 18px;' id='hdncode" + g + "' name='underleafchk' value=" + jsonresult[g].User_Code + "><span id='reportinguname" + g + "' style='margin-left:39px;font-size:13px;'>" + jsonresult[g].User_Name + "</span>";
                        selectcolumn += "</div>";
                        selectcolumn += "<div class='col-xs-12'>";
                        selectcolumn += "<label style='margin-left: 8px;'>Change to Reporting Manager</label><select  name='reportduser' id='bindreporteduser" + g + "' style='margin-left: 12px;margin-top: 18px;'></select></br>";
                        selectcolumn += "</div>";
                        selectcolumn += "</div>";
                        //selregion = jsonresult[i].Region_Code;
                        fngetreportedmanagers(g);
                    }
                }
                $("#showleafusers").html(selectcolumn);

            }

        }
    });
}
function fngetresuserdivision() {
    debugger
    Userdivs = '';
    var UsrCode = $('select[name="txtSearhUserId"]').val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/Getresuserdivision',
        type: "POST",
        data: "UserCode=" + UsrCode,
        success: function (JsonResult) {
            debugger;
            if (JsonResult.length > 0) {
                var Userdivision = eval('(' + JsonResult + ')');
                if (Userdivision.length > 0) {
                    for (var i = 0; i < Userdivision.length; i++) {
                        if (i == (Userdivision.length - 1)) {
                            Userdivs += Userdivision[i].Division_Name;
                        }
                        else {
                            Userdivs += Userdivision[i].Division_Name + ',';
                        }
                    }
                }
            }
        }
    });
}

var responsereport = '';
function fngetreportedmanagers(val) {
    debugger;
    var reporteduser = $('select[name="txtSearhUserId"]').val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetReportedMangers',
        type: "POST",
        data: "UserCode=" + reporteduser,
        success: function (JsonResult) {
            responsereport = JsonResult;
            debugger;
            fnbindreportuser(val);

        }
    });
}

function fnbindreportuser(val) {
    debugger;
    if (responsereport != null && responsereport != '') {
        if (responsereport.length > 0) {
            var jsonresult = eval('(' + responsereport + ')');
            var selectcolumn = '';
            selectcolumn += '<option value="0" disabled selected hidden>Select Manager</option>';

            for (var i = 0; i < jsonresult.length; i++) {
                selectcolumn += '<option value=' + jsonresult[i].User_Code + '>' + jsonresult[i].User_Name + '</option>';

                //selregion = jsonresult[i].Region_Code;
            }
        }
        $("#bindreporteduser" + val).html(selectcolumn);
    }
}
function fnopenRemarks() {
    debugger
    Resignremarks = '';
    $('#myModalremark').modal({ show: true });
}
function fndisablerepuser() {
    debugger;
    Resignremarks = $('#txtrem').val();
    $('#myModalremark').modal('hide');

    if ($("#txtdisableDate").val() == '') {
        fnMsgAlert('info', 'Info', 'Please Enter a DisableDate.');
        HideModalPopup('dvLoading');
        return false;
    }
    if (Resignremarks == "") {
        fnMsgAlert('info', 'Info', 'Please Enter Remarks.');
        HideModalPopup('dvLoading');
        return false;
    }
    //if ($('#btnShowtmailbtn').is(':visible') && $('#ResMailchk').is(":checked")) {
    //    if (ResMailarr.length == 0) {
    //        //fnMsgAlert('info', 'Info', 'Please Select Copy Holders.');
    //        //HideModalPopup('dvLoading');
    //        //return false;
    //    }
    //}
    $('#myModalregion').modal('hide');
    if ($('#reportuser').is(':visible')) {
        var userdisablearr = [];
        var rowLength = $("#showleafusers input").length;
        for (var i = 0; i < rowLength; i++) {
            var obj = {
                Reporting_UserCode: $("#hdncode" + i).val(),
                Reporting_User_Name: $("#reportinguname" + i).text(),
                Reporting_To_UserCode: $('#bindreporteduser' + i + ' :selected').val(),
                Reporting_ToUserName: $('#bindreporteduser' + i + ' :selected').text()

            };
            if (obj.Reporting_To_UserCode == "" || obj.Reporting_To_UserCode == undefined || obj.Reporting_To_UserCode == 0) {
                fnMsgAlert('info', 'Info', 'Please select reporting to manager for user ' + obj.Reporting_User_Name + '.');
                HideModalPopup('dvLoading');
                return false;
            }
            else {
                var MoveUnderUser = {
                    userCode: $("#hdncode" + i).val(),
                    UnderUserCode: $('#bindreporteduser' + i + ' :selected').val()
                };
                KI_DisableUser.UnderUsers.push(MoveUnderUser);
                userdisablearr.push(obj);
            }
        };
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/Insertleafuser',
            type: "POST",
            data: JSON.stringify({ "lstuserdisable": userdisablearr }),
            contentType: 'application/json; charset=utf-8',
            success: function (JsonResult) {
                debugger;
                fnNextdisableUser();
            }

        });
    }
    else {
        fnNextdisableUser();
    }
}

var dcrdate = '';
function fnGetDCRdate() {
    debugger;
    var usercode = $('select[name="txtSearhUserId"]').val()//$('#hdnsearchUserCode').val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetDCRdate',
        type: "POST",
        //  dataType:"application/json",
        data: "UserCode=" + usercode,
        success: function (JsonResult) {
            debugger;
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 1) {
                    json_GetchildUsers = eval('(' + JsonResult + ')');
                    dcr = eval('(' + JsonResult + ')');
                    dcrdate = dcr[0].DCR_Entered_Date;

                }
            }
        }
    });
}

function fnNextdisableUser() {
    debugger;

    var result = fnValidateDisableUserdetail();
    if (result) {
        ShowModalPopup('dvLoading');


        var day = $("#txtdisableDate").val().split('/')[0];
        var month = $('#txtdisableDate').val().split('/')[1];
        var year = $('#txtdisableDate').val().split('/')[2];
        disabledate = year + '-' + month + '-' + day;
        var dtDisabled = new Date(disabledate);

        fnGetDCRdate();

        var userCode = $('select[name="txtSearhUserId"]').val();//$('#hdnsearchUserCode').val();
        var UserName = $('#txtSearhUserId').val();
        var employeeCode = $('#hdndisableEmployeeCode').val();
        // var employeeNo = $('#hdnSearchEmployeeNo').val();
        var employeeNo = $('#txtemployeeNo').html();
        var employeeName = $('#txtsearchEmpname').val();
        var regionName = $('#txtsearchRegion').html();
        var regionCode = $('#hdnSearchregion').val();
        try {
            var DisableUserdetails_arr = new Array();
            var disabledetails = {};
            disabledetails.User_Code = userCode;
            disabledetails.User_Name = UserName;
            disabledetails.Region_Name = regionName;
            disabledetails.Employee_Name = employeeName;
            disabledetails.Employee_Number = employeeNo;
            disabledetails.Region_Code = regionCode;
            disabledetails.Employee_Code = employeeCode;
            disabledetails.Remarks = Resignremarks;
            DisableUserdetails_arr.push(disabledetails);
            ResignDetobj = {};
            ResignDetobj.User_Code = userCode;
            ResignDetobj.User_Name = UserName;
            ResignDetobj.Region_Name = UserName.split('-')[3].split('(')[1].split(')')[0];
            ResignDetobj.Employee_Name = UserName.split('-')[1].split('(')[1].split(')')[0];
            ResignDetobj.Designation = UserName.split('-')[2].split('(')[1].split(')')[0];
            ResignDetobj.Employee_Number = employeeNo;
            ResignDetobj.Region_Code = regionCode;
            ResignDetobj.Employee_Code = employeeCode;
            ResignDetobj.Remarks = Resignremarks;
            ResignDetobj.DOR = $("#txtdisableDate").val();
            ResignDet.push(ResignDetobj);
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetDisableSessionValues',
                type: "POST",
                data: "disableUserdetaills_Arr=" + JSON.stringify(DisableUserdetails_arr),
                success: function (Jsonresult) {
                    debugger;
                    if (Jsonresult != null && Jsonresult != '') {
                        if (Jsonresult.length > 0) {
                            var dtDcr = new Date(dcrdate);
                            if (dtDisabled < dtDcr) {
                                fnMsgAlert('info', 'Info', ' DCR has entered on ' + dcrdate + '.Please select disable date as greater than or equal to last entered DCR date');
                                HideModalPopup('dvLoading');
                                return false;
                            }
                            else {
                                // $('#main').load('../HiDoctor_Master/UsercreationWizard/DisableUserfromMasterData/?userCode=' + escape(userCode) + '&userName=' + escape(UserName) + '&activeDate=' + escape(disabledate) + '&employeeCode=' + escape(employeeCode) + '&employeeNumber=' + escape(employeeNo));
                                fnFinishDisable(escape(userCode), escape(UserName), escape(disabledate), escape(Resignremarks), escape(employeeCode), escape(employeeNo));
                                HideModalPopup('dvLoading');
                            }
                        }
                    }
                    HideModalPopup('dvLoading');
                },
                error: function (e) {
                    fnMsgAlert('info', '', 'Error.' + e.Message);
                    HideModalPopup('dvLoading');
                }

            });
        }
        catch (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            HideModalPopup('dvLoading');
        }
        // $('#main').load('../HiDoctor_Master/UsercreationWizard/DisableUserfromMasterData/?userCode=' + escape(UserCode_g) + '&userName=' + escape(userName_g) + '&disableDate=' + escape(disabledate_g) + '&employeeCode=' + escape(EmployeeCode_g));
    }
}

function fnFinishDisable(userCode, UserName, disabledate, remarks, employeeCode, employeeNo) {
    debugger;
    IsResMailNeeded = $('#ResMailchk').attr('Checked') ? 1 : 0;
    try {
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/DisableUserfromMaster',
            type: "POST",
            data: "userCode=" + userCode + "&employeeCode=" + employeeCode + "&activeDate=" + disabledate + "&Remarks=" + Resignremarks,
            success: function (JsonResult) {
                debugger;
                var result = JsonResult.split(':')[0];
                var errorresult = JsonResult.split(':')[1];
                if (result.toUpperCase() == "SUCCESS") {
                    var UserDetails = {
                        User_Code: userCode,
                        Effective_To: disabledate,
                    }
                    KI_DisableUser.DisabledUsers.push(UserDetails);
                    KangleIntegration.requestInvoke("UserMigration", "DisableUserHiDoctor", KI_DisableUser, "POST");
                    fnUpdateUserIndex();
                    fnUpdateRegionIndex();
                    fnMsgAlert('success', 'SUCCESS', "User Disabled from User Master Successfully.");
                    // $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
                    if ($('#btnShowtmailbtn').is(':visible') && $('#ResMailchk').is(":checked")) {
                        fnsendresignmail(userCode);
                    }
                }
                else if (result.toUpperCase() == "ERROR") {
                    fnMsgAlert('info', 'User Creation Wizard', '' + errorresult + '');
                }
                else {
                    fnMsgAlert('info', 'User Creation Wizard', 'Failure');
                }

            },
            error: function () {
                fnMsgAlert("Get Activities failed.");
            },
            complete: function () {
                $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
            }
        });
    }
    catch (e) {
        $('#dvPanel').unblock();
    }
}

function fnUpdateUserIndex() {
    // $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        type: 'POST',//UpdateUserNewIndex
        url: '../HiDoctor_Master/User/UpdateUserNewIndex',
        data: "A",
        success: function (result) {
            if (result != '') {
                if (result.split(':')[0] == "SUCCESS") {
                    // fnMsgAlert('success', 'Success', 'User tree refreshed successfully');
                }
                else {
                    // fnMsgAlert('error', 'error', 'User tree refresh failed because of ' + result.split(':')[1]);
                }
            }
            else {
                //fnMsgAlert('error', 'error', 'User tree refresh failed.');
            }
            // fnBindUserTreeNew("dvUserTree");
        },
        error: function () {
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        }
    });
}

function fnUpdateRegionIndex() {
    // $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Region/UpdateRegionNewIndex',
        data: "A",
        success: function (result) {
            if (result != '') {
                if (result.split(':')[0] == "SUCCESS") {
                    //  fnMsgAlert('success', 'Success', result.split(':')[1]);
                }
                else {
                    // fnMsgAlert('error', 'error', result.split(':')[1]);
                }
            }
            else {
                //fnMsgAlert('error', 'error', result.split(':')[1]);
            }
        },
        error: function () {
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        }
    });
}

function fnBackdisableUser() {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
    $('#dvPanel').unblock();
}

function fnValidateDisableUserdetail() {
    if ($.trim($('select[name="txtSearhUserId"]').val()) == "") {
        fnMsgAlert('info', 'User Creation Wizard', 'Please Choose the User Id.');
        return false;
    }
    //if ($.trim($("#txtsearchRegion").val()) == "") {
    //    fnMsgAlert('info', 'User Creation Wizard', 'Please Choose the Region Name');
    //    return false;
    //}
    //if ($.trim($("#txtemployeeNo").val()) == "") {
    //    fnMsgAlert('info', 'User Creation Wizard', 'Please Choose the Employee Number.');
    //    return false;
    //}
    return true;

}
//***********************************************************User Disable Functions End(New Main)*****************************************************************//

//***********************************************************User Hierarchy Functions Start(New Main)*****************************************************************//
function fnGetUserDetails() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetUsers',
        type: "POST",
        data: "A",
        async: false,
        success: function (jsData) {
            debugger;
            Json_Assignemp_g = eval('(' + jsData + ')');
            
            var lstUser = [];
            var Json_UserNames = eval('(' + jsData + ')');
            for (var i = 0; i < Json_UserNames.length; i++) {
                _objData = {};
                _objData.id = Json_UserNames[i].User_Code;
                _objData.label = Json_UserNames[i].User_Name;
                lstUser.push(_objData);
            }
            // if (lstUser.length > 0) {
            UserDetails = lstUser;
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstUser,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select a user',
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstUser, dropdown_query);
                }
            });
            atcObj.appendTo('#txtsearchUserName');
            //}
            // }



            //////Actual reporting user//////



        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
}
//Used to get Divisons

function fnGetuserDivisions() {
    var selectcolumn = '';
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetDivision',
        type: "POST",
        async: false,
        success: function (JsonResult) {
            Json_Divisions = JsonResult;
            if (Json_Divisions != null && Json_Divisions != '') {
                if (Json_Divisions.length > 0) {
                    var jsonresult = eval('(' + Json_Divisions + ')');

                    // var selectcolumn = $("#ddlDivision");
                    //selectcolumn.append("<option value=0>-Select Division-</option>");
                    for (var i = 0; i < jsonresult.length; i++) {
                        selectcolumn += "<option  value=" + jsonresult[i].Division_Code + ">" + jsonresult[i].Division_Name + "</option>";
                    }

                    $("#DDlDivision").html(selectcolumn);


                }
            }
            $("#DDlDivision").multiselect("destroy").multiselect().multiselectfilter();
            $("#DDlDivision").multiselect({
                noneSelectedText: '-Select Division-'
            }).multiselectfilter();
        },
        error: function () {
            fnMsgAlert("Get Divisions failed.");
        }
    });

}

function fnprefillalldetails() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/Getuserdetails',
        type: "POST",
        async: false,
        data: "userCode=" + UserCode,
        success: function (JsonResult) {
            debugger;
            $('#ddlDesignation option').remove(); // remove all Designation Options


            $('#ddlReportingManagerchange option').remove();// remove all Reporting to all User Options
            $('#ddlUserRegion option').remove(); // remove all User Region Options
            $('#ddlExpemseGroup option').remove();
            $('#ddlDivision option').remove();
            $('#ddlUserRegionchange option').remove();

            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    Json_user = eval('(' + JsonResult + ')');
                    //$("#txtsearchUserName").val(Json_user[0].User_Name);
                    var msObject = document.getElementById("txtsearchUserName").ej2_instances[0];
                    msObject.value = Json_user[0].User_Code;
                    //$("#txtsearchUserName").val(Json_user[0].User_Code);

                    $('#txtemployeeName').val(Json_user[0].Employee_Name);
                    $("#txtuserName").val(Json_user[0].User_Name);
                    $("#txthidoctorstartdatechange").val(Json_user[0].HiDoctor_start_Date);
                    $("#txtpassword").val(Json_user[0].User_Pass);

                    if (Json_Divisions != null && Json_Divisions != '') {
                        if (Json_Divisions.length > 0) {
                            var jsonresult = eval('(' + Json_Divisions + ')');
                            //var selectcolumn = $("#ddlDivision");
                            if (Json_user[0].User_Division_Code != '' || Json_user[0].User_Division_Code != undefined || Json_user[0].User_Division_Code != null || Json_user[0].User_Division_Code != 0) {
                                var divisionCode = Json_user[0].User_Division_Code.split(',');
                                // var divisionname = Json_user[0].Division_Name.split(',');
                                for (var i = 0; i < jsonresult.length; i++) {
                                    selectcolumn += "<option  value=" + jsonresult[i].Division_Code + ">" + jsonresult[i].Division_Name + "</option>";
                                }
                                $("#DDlDivision").html(selectcolumn);
                                //var divisionCode = "";
                                for (var g = 0; g < divisionCode.length; g++) {
                                    $("#DDlDivision").multiselect("widget").find(":checkbox[value='" + divisionCode[g] + "']").attr("checked", "checked");
                                    $("#DDlDivision option[value='" + divisionCode[g] + "']").attr("selected", true);

                                }
                                $('#DDlDivision').multiselect("destroy").multiselect().multiselectfilter();
                                //if (divisionCode[0] != '') {
                                //}

                            }
                        }
                    }
                    $("#DDlDivision").multiselect("destroy").multiselect().multiselectfilter();
                    $("#DDlDivision").multiselect({
                        noneSelectedText: '-Select Division-'
                    }).multiselectfilter();
                    fnGetDesignationByDivision(2);

                    //Get Reporting to User
                    if (Json_Users != null && Json_Users != '') {
                        if (Json_Users.length > 0) {
                            var jsonresult = eval('(' + Json_Users + ')');
                            var selectcolumn = $("#ddlReportingManagerchange");
                            $(selectcolumn).html('');
                            selectcolumn.append("<option value=0>-Select Reporting Manager-</option>");
                            for (var i = 0; i < jsonresult.length; i++) {
                                selectcolumn.append("<option value=" + jsonresult[i].User_Code + ">" + jsonresult[i].User_Name + "</option>");
                            }
                            if (Json_user[0].Reporting_Manager != '' || Json_user[0].Reporting_Manager != undefined || Json_user[0].Reporting_Manager != null || Json_user[0].Reporting_Manager != 0) {
                                $(selectcolumn).val(Json_user[0].Under_User_Code);
                                //selectcolumn.append("<option value=" + Json_user[0].Under_User_Code + ">" + Json_user[0].Reporting_Manager + "</option>");
                            }
                            //var msObject = document.getElementById("ddlReportingManagerchange").ej2_instances[0];
                            //msObject.value = Json_user[0].Under_User_Code;
                        }
                    }

                    if (Json_reportingtoRegions != null && Json_reportingtoRegions != '') {
                        if (Json_reportingtoRegions.length > 0) {
                            var jsonresult = eval('(' + Json_reportingtoRegions + ')');
                            //var selectcolumn = $("#ddlUserRegionchange");
                            //$(selectcolumn).html('');
                            //selectcolumn.append("<option value=0>-Select Reporting to Region-</option>");
                            //for (var i = 0; i < jsonresult.length; i++) {
                            //    selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                            //}
                            //if (Json_user[0].Reporting_Region != '' || Json_user[0].Reporting_Region != undefined || Json_user[0].Reporting_Region != null || Json_user[0].Reporting_Region != 0) {
                            //    $(selectcolumn).val(Json_user[0].Reporting_Region_Code);
                            //    //selectcolumn.append("<option value=" + Json_user[0].Region_Code + ">" + Json_user[0].Region_Name + "</option>");
                            //}
                            var msObject = document.getElementById("ddlUserRegionchange").ej2_instances[0];
                            msObject.value = Json_user[0].Reporting_Region_Code;
                        }
                    }
                    //  fnGetUserRegionByregionCodechangeBack(Json_user[0].Reporting_Region_Code);
                    //Get User Region
                    if (Json_regions != null && Json_regions != '') {
                        if (Json_regions.length > 0) {
                            var jsonresult = eval('(' + Json_regions + ')');
                            //var selectcolumn = $("#ddlUserRegion");
                            //$(selectcolumn).html('');
                            //selectcolumn.append("<option value=0>-Select Region-</option>");
                            //for (var i = 0; i < jsonresult.length; i++) {
                            //    selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                            //}
                            //if (Json_user[0].Region_Name != '' || Json_user[0].Region_Name != undefined || Json_user[0].Region_Name != null || Json_user[0].Region_Name != 0) {
                            //    $(selectcolumn).val(Json_user[0].Region_Code);
                            //    //selectcolumn.append("<option value=" + Json_user[0].Region_Code + ">" + Json_user[0].Region_Name + "</option>");
                            //}
                            $('#dvUsersRegion').empty();
                            $('#dvUsersRegion').html('<input type="text" id="ddlUserRegion">')
                            var lstUsersRegions = [];
                            for (var i = 0; i < jsonresult.length; i++) {
                                var _objData = {
                                    label: jsonresult[i].Region_Name,
                                    id: jsonresult[i].Region_Code
                                }
                                lstUsersRegions.push(_objData);
                            }
                            var atcObj = new ej.dropdowns.DropDownList({
                                //set the data to dataSource property
                                dataSource: lstUsersRegions,
                                fields: {
                                    text: 'label', value: 'id'
                                },
                                filterBarPlaceholder: 'Search',
                                showClearButton: true,
                                allowFiltering: true,
                                placeholder: 'Select User Region',
                                value: Json_user[0].Region_Code,
                                filtering: function (e) {
                                    var dropdown_query = new ej.data.Query();
                                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                    e.updateData(lstUsersRegions, dropdown_query);
                                }
                            });
                            atcObj.appendTo('#ddlUserRegion');

                            //var msObject = document.getElementById("ddlUserRegion").ej2_instances[0];
                            //msObject.value = Json_user[0].Region_Code;
                        }
                    }
                    if (Json_Expensegroup != null && Json_Expensegroup != '') {
                        if (Json_Expensegroup.length > 0) {
                            var jsonresult = eval('(' + Json_Expensegroup + ')');
                            //var selectcolumn = $("#ddlExpemseGroup");
                            //$(selectcolumn).html('');
                            //selectcolumn.append("<option value=0>-Select Expense Group Header-</option>");
                            //for (var i = 0; i < jsonresult.length; i++) {
                            //    selectcolumn.append("<option value=" + jsonresult[i].Expense_Group_Id + ">" + jsonresult[i].Expense_Group_Name + "</option>");
                            //}
                            //if (Json_user[0].Expense_Group_Id != 0) {
                            //    $(selectcolumn).val(Json_user[0].Expense_Group_Id);
                            //    //selectcolumn.append("<option value=" + Json_user[0].Expense_Group_Id + ">" + Json_user[0].Expense_Group_Name + "</option>");
                            //}
                            var expensegroupId = Json_user[0].Expense_Group_Id.toString();
                            var msObject = document.getElementById("ddlExpemseGroup").ej2_instances[0];
                            msObject.value = expensegroupId
                        }
                    }


                    var msObject = document.getElementById("ddlDesignation").ej2_instances[0];
                    var str_array = Json_user[0].User_Type_Code;
                    msObject.value = str_array;
                    //   $("#ddlDesignation").val(Json_user[0].User_Type_Code);
                    //if (Json_userTypes.length > 0) {
                    //    var jsonresult = eval('(' + Json_userTypes + ')');
                    //    var selectcolumn = $("#ddlDesignation");

                    //    $(selectcolumn).html('');
                    //    selectcolumn.append("<option value='0'>-Select Designation-</option>");
                    //    for (var i = 0; i < jsonresult.length; i++) {
                    //        selectcolumn.append("<option value=" + jsonresult[i].User_Type_Code + ">" + jsonresult[i].User_Type_Name + "</option>");
                    //    }

                    //    if (Json_user[0].User_Type_Name != '' || Json_user[0].User_Type_Name != undefined || Json_user[0].User_Type_Name != null || Json_user[0].User_Type_Name != 0) {
                    //        //selectcolumn.append("<option value=" + Json_user[0].User_Type_Code + ">" + Json_user[0].User_Type_Name + "</option>");
                    //        $(selectcolumn).val(Json_user[0].User_Type_Code);

                    //    }
                    //}

                }
            }
        }
    });
}

function fnBackchange() {
    debugger;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $('#main').load('HiDoctor_Master/UsercreationWizard/Home');

    $('#dvPanel').unblock();
}

var lstdetails = '';
var newusertypecode = '';
function fnupdateuserdetails(mode) {
    debugger;
    var JsonResult;
    oldDetails;

    newusertypecode = $("#ddlDesignation").val();

    if ($("#ddlDesignation").val() == 0 || $("#ddlDesignation").val() == null) {
        fnMsgAlert('info', 'Info', 'Please select Designation.');
        return false;
    }
    if ($("#DDlDivision").val() == 0 || $("#DDlDivision").val() == null) {
        fnMsgAlert('info', 'Info', 'Please select Division.');
        return false;
    }

    if ($("#ddlUserRegionchange").val() == 0 || $("#ddlUserRegionchange").val() == null) {
        fnMsgAlert('info', 'Info', 'Please select Reporting to Region.');
        return false;
    }
    if ($("#ddlUserRegion").val() == 0 || $("#ddlUserRegion").val() == null) {
        fnMsgAlert('info', 'Info', 'Please select Region.');
        return false;
    }
    if ($("#ddlReportingManagerchange").val() == 0 || $("#ddlReportingManagerchange").val() == null) {
        fnMsgAlert('info', 'Info', 'Please select Reporting Manager.');
        return false;
    }
    if ($("#txtsearchUserName").val() == $("#ddlReportingManagerchange option:selected").text()) {
        fnMsgAlert('info', 'Info', 'Please select different Reporting Manager.');
        return false;
    }
    var FromDate = $('#Frmdate').val();
    var Reffkey1 = $("#reff1").val();
    var Reffkey2 = $("#reff2").val();
    var ActualReport = $("select[name='ddlActual']").val();


    if (FromDate != "" && FromDate != undefined && FromDate != null) {
        FromDate = FromDate.split('-')[2] + '-' + FromDate.split('-')[1] + '-' + FromDate.split('-')[0];
    }
    if ($("select[name='ddlDesignation']").val() != ExisUserdata[0].User_Type_Code || $("select[name='ddlUserRegion']").val() != ExisUserdata[0].Region_Code || $("#hdnReportingtoManagerCode").val() != ExisUserdata[0].Under_User_Code || $("select[name='ddlUserRegionchange']").val() != ExisUserdata[0].Reporting_Region_Code || $("#txthidoctorstartdatechange").val() != ExisUserdata[0].HiDoctor_start_Date) {
        var Maildet = $.grep(Maildetails, function (element, index) {
            return element.User_Type_Code == $("select[name='ddlDesignation']").val();
        });
        //if (Maildet.length > 0) {
        //    //if (HirarchyMailarr.length == 0) {
        //        //fnMsgAlert('info', 'Info', 'Please Select Copy Holders.');
        //        //return false;
        //    //}
        //}
    }
    var User = $("select[name='txtsearchUserName']").val();
    if (User == "") {
        var User = UserCode;

    }
    divisionCode = "";
    $('select#DDlDivision > option:selected').each(function () {
        divisionCode += $(this).val() + ',';
        //entity_Names.push($(this).text().split('(')[0]);
    });
    divisionCode = divisionCode.slice(0, -1);
    divisionname = "";
    $("#DDlDivision option:selected").each(function () {
        divisionname += $(this).text() + ',';
        //entity_Names.push($(this).text().split('(')[0]);
    });
    divisionname = divisionname.slice(0, -1);
    entrymode_g = '';
    //var OldUserDetail = oldDetails;
    //var jsonresult = eval('(' + OldUserDetail + ')');
    //var OldUserDetails = regiondetails;

    Userdetailsobj = {};
    var UpdateUser_arr = new Array();
    var userDetails = {};

    userDetails.Employee_Name = $('#txtemployeeName').val();
    userDetails.User_Name = $("#txtuserName").val();
    userDetails.User_Code = User;
    userDetails.User_Type_Name = $('#ddlDesignation').val();
    userDetails.User_Type_Code = $("select[name='ddlDesignation']").val();
    userDetails.Region_Code = $("select[name='ddlUserRegion']").val();
    userDetails.Region_Name = $("#ddlUserRegionchange").val();
    userDetails.Reporting_Region_Code = $("select[name='ddlUserRegionchange']").val();
    userDetails.Reporting_Region_Name = $('#ddlUserRegion').val();
    userDetails.Under_User_Code = $("select[name='ddlReportingManagerchange']").val();
    userDetails.Reporting_Manager = $("#ddlReportingManagerchange option:selected").text();
    userDetails.User_Type_Code = $("select[name='ddlDesignation']").val();
    userDetails.User_Division_Code = divisionCode;
    userDetails.Division_Name = divisionname;
    userDetails.HiDoctor_start_Date = $("#txthidoctorstartdatechange").val();
    userDetails.User_Pass = $("#txtpassword").val();
    userDetails.RefKey1 = $("#reff1").val();
    userDetails.RefKey2 = $("#reff2").val();
    userDetails.ActualReporting = $("select[name='ddlActual']").text();
    userDetails.Effective = effect;
    var EffectFrom = $('#Frmdate').val();
    if (EffectFrom != "" && EffectFrom != undefined && EffectFrom != null) {
        EffectFrom = EffectFrom.split('-')[2] + '-' + EffectFrom.split('-')[1] + '-' + EffectFrom.split('-')[0];
    }
    userDetails.EffectiveFrom = EffectFrom;
    userDetails.Expense_Group_Id = ($("select[name='ddlExpemseGroup']").val() == null ? 0 : $("select[name='ddlExpemseGroup']").val());
    userDetails.Expense_Group_Name = $('#ddlExpemseGroup').val();
    //userDetails.Effectivefrom = $('#Frmdate').val();
    UpdateUser_arr.push(userDetails);
    Userdetailsobj.User_Name = $("#txtuserName").val();
    Userdetailsobj.Employee_Name = $('#txtemployeeName').val();
    Userdetailsobj.User_Type_Name = $('#ddlDesignation').val();
    Userdetailsobj.Region_Name = $("#ddlUserRegionchange").val();
    Userdetailsobj.NewHQ = $("#ddlUserRegion").val()
    Userdetailsobj.Division_Name = divisionname;
    Userdetailsobj.Manager = $("#ddlReportingManagerchange option:selected").text();
    Userdetails.push(Userdetailsobj);

    if (mode == "Next") {
        oldDetails;
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/UpdateSessionUserDetails',
            type: "POST",
            async: false,
            data: "UpdateUser_arr=" + encodeURIComponent(JSON.stringify(UpdateUser_arr)) + "&Mode=" + mode,
            success: function (JsonResult) {
                oldDetails;
                debugger;
                if (JsonResult != null && JsonResult != '') {
                    if (JsonResult.length > 0) {
                        //if (Json_user[0].User_Type_Name != $("select[name='ddlDesignation']").text() && Json_user[0].User_Division_Code == divisionCode) {
                        if (Json_user[0].User_Type_Name != $("select[name='ddlDesignation']").text()) {
                            debugger;
                            //$("#leave").show();
                            //$('#main').load('../HiDoctor_Master/UsercreationWizard/CreateLeaveDetailsforhierarchychange/?employeeName=' + escape($("#txtemployeeName").val()) + '&userType=' + escape($("select[name='ddlDesignation'").text()) + '&divisionName=' + escape(divisionname) +
                            //  '&regionName=' + escape($("select[name='ddlUserRegion']").text()) + '&userTypecode=' + escape($("select[name='ddlDesignation']").val()) + '&divisionCode=' + escape(divisionCode) + '&UserregionCode=' + escape($("select[name='ddlUserRegion']").val()) + '&reportingmanagerusercode='
                            //  + escape($("#ddlReportingManagerchange").val()) + '&Usercode=' + escape(User) + '&newusertypecode=' + escape(newusertypecode) + '&reportingregioncode=' + escape($("select[name='ddlUserRegionchange']").val()) + '&reportingregionname=' + escape($("#ddlUserRegionchange option:selected").text()));
                            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMappingdivision/?employeeName=' + escape($("#txtemployeeName").val()) + '&userType=' + escape($("select[name='ddlDesignation']").text()) + '&divisionName=' + escape(divisionname) + '&regionName=' + escape($("select[name='ddlUserRegion']").text())
                                + '&userTypecode=' + escape($("select[name='ddlDesignation'").val()) + '&divisionCode=' + escape(divisionCode) + '&entryMode=' + escape(entrymode_g) + '&UserregionCode=' + escape($("#ddlUserRegion").val())
                                + '&reportingmanagerusercode=' + escape($("select[name='ddlReportingManagerchange']").val()) + '&Usercode=' + escape(User) + '&reportingregioncode=' + escape($("select[name='ddlUserRegionchange']").val()) + '&reportingregionname=' + escape($("select[name='ddlUserRegionchange']").text()));
                        }
                            //else if (Json_user[0].User_Division_Code != divisionCode && Json_user[0].User_Type_Name == $("select[name='ddlDesignation']").text()) {
                        else if (Json_user[0].User_Division_Code != divisionCode) {
                            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMappingdivision/?employeeName=' + escape($("#txtemployeeName").val()) + '&userType=' + escape($("select[name='ddlDesignation']").text()) + '&divisionName=' + escape(divisionname) + '&regionName=' + escape($("select[name='ddlUserRegion']").text())
                                + '&userTypecode=' + escape($("select[name='ddlDesignation'").val()) + '&divisionCode=' + escape(divisionCode) + '&entryMode=' + escape(entrymode_g) + '&UserregionCode=' + escape($("#ddlUserRegion").val())
                                + '&reportingmanagerusercode=' + escape($("select[name='ddlReportingManagerchange']").val()) + '&Usercode=' + escape(User) + '&reportingregioncode=' + escape($("select[name='ddlUserRegionchange']").val()) + '&reportingregionname=' + escape($("select[name='ddlUserRegionchange']").text()));
                        }
                            //else if (divisionCode != '' && Json_user[0].User_Division_Code != divisionCode && Json_user[0].User_Type_Name != $("#ddlDesignation option:selected").text()) {
                            //    $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateLeaveDetailsforhierarchychange/?employeeName=' + escape($("#txtemployeeName").val()) + '&userType=' + escape($("select[name='ddlDesignation']").text()) + '&divisionName=' + escape(divisionname) +
                            //   '&regionName=' + escape($("select[name='ddlUserRegion']").text()) + '&userTypecode=' + escape($("select[name='ddlDesignation']").val()) + '&divisionCode=' + escape(divisionCode) + '&UserregionCode=' + escape($("#ddlUserRegion").val()) + '&reportingmanagerusercode='
                            //   + escape($("#ddlReportingManagerchange").val()) + '&Usercode=' + escape(User) + '&newusertypecode=' + escape(newusertypecode) + '&reportingregioncode=' + escape($("ddlUserRegionchange").val()) + '&reportingregionname=' + escape($("#ddlUserRegionchange option:selected").text()));
                            //}
                        else {
                            fnGetKangleUserDetails(User, "EDIT");
                            fnUpdateUserIndex();
                            fnMsgAlert('success', 'Success', 'User Hierarchy changed Successfully.');
                            $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
                        }
                    }
                }
            }
        });
    }
    else if (mode == "Save") {
        debugger;
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/UpdateUserDetails',
            type: "POST",
            async: false,
            data: "UserCode=" + User + "&RegionCode=" + $("select[name='ddlUserRegion']").val() + "&UserTypeCode=" + $("select[name='ddlDesignation']").val()
            + "&UnderUserCode=" + $("select[name='ddlReportingManagerchange']").val() + "&UserDivisionCode=" + divisionCode + "&ExpenseId=" + ($("select[name='ddlExpemseGroup']").val() == null ? 0 : $("select[name='ddlExpemseGroup']").val()) + "&EffectiveFrom=" + FromDate + "&Effective=" + effect + "&RefKey1=" + Reffkey1 + "&RefKey2=" + Reffkey2 + "&ActulReporting=" + ActualReport,
            success: function (val) {
                fnGetKangleUserDetails(User, "EDIT");
                fnUpdateUserIndex();
                fnMsgAlert('success', 'Success', 'User Hierarchy changed Successfully.');
                $('#main').load('HiDoctor_Master/UsercreationWizard/Home');
                if (Maildet.length > 0) {
                    fnsendtransfermail(User);
                }
            }
        });
    }


    debugger;
    //$.ajax({
    //    url: '../HiDoctor_Master/UsercreationWizard/UpdateUserDetails',
    //    type: "POST",
    //    async: false,
    //    data: "UserCode=" + User + "&RegionCode=" + $("select[name='ddlUserRegion']").val() + "&UserTypeCode=" + $("select[name='ddlDesignation']").val()
    //        + "&UnderUserCode=" + $("#ddlReportingManagerchange").val() + "&UserDivisionCode=" + divisionCode + "&ExpenseId=" + ($("select[name='ddlExpemseGroup']").val() == null ? 0 : $("select[name='ddlExpemseGroup']").val()),
    //    success: function (val) {
    //        debugger;
    //        // $("#btnNextchange").show();
    //        fnGetKangleUserDetails(User, "EDIT");

    //        //User Migration
    //        fnUpdateUserIndex();

    //        if (Json_user[0].User_Type_Name != $("select[name='ddlDesignation']").text() && Json_user[0].User_Division_Code == divisionCode) {
    //            debugger;
    //            $("#leave").show();
    //            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateLeaveDetailsforhierarchychange/?employeeName=' + escape($("#txtemployeeName").val()) + '&userType=' + escape($("select[name='ddlDesignation'").text()) + '&divisionName=' + escape(divisionname) +
    //              '&regionName=' + escape($("select[name='ddlUserRegion']").text()) + '&userTypecode=' + escape($("select[anem='ddlDesignation']").val()) + '&divisionCode=' + escape(divisionCode) + '&UserregionCode=' + escape($("select[name='ddlUserRegion']").val()) + '&reportingmanagerusercode='
    //              + escape($("#ddlReportingManagerchange").val()) + '&Usercode=' + escape(User) + '&newusertypecode=' + escape(newusertypecode) + '&reportingregioncode=' + escape($("select[name='ddlUserRegionchange']").val()) + '&reportingregionname=' + escape($("#ddlUserRegionchange option:selected").text()));

    //        }
    //        else if (Json_user[0].User_Division_Code != divisionCode && Json_user[0].User_Type_Name == $("select[name='ddlDesignation']").text()) {

    //            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateUserProductMappingdivision/?employeeName=' + escape($("#txtemployeeName").val()) + '&userType=' + escape($("select[name='ddlDesignation']").text()) + '&divisionName=' + escape(divisionname) + '&regionName=' + escape($("select[name='ddlUserRegion']").text())
    //                + '&userTypecode=' + escape($("select[name='ddlDesignation'").val()) + '&divisionCode=' + escape(divisionCode) + '&entryMode=' + escape(entrymode_g) + '&UserregionCode=' + escape($("#ddlUserRegion").val()) + '&reportingmanagerusercode=' + escape($("#ddlReportingManagerchange").val()) + '&Usercode=' + escape(User) + '&reportingregioncode=' + escape($("select[name='ddlUserRegionchange']").val()) + '&reportingregionname=' + escape($("select[name='ddlUserRegionchange']").text()));
    //        }
    //        else if (divisionCode != '' && Json_user[0].User_Division_Code != divisionCode && Json_user[0].User_Type_Name != $("#ddlDesignation option:selected").text()) {
    //            $('#main').load('../HiDoctor_Master/UsercreationWizard/CreateLeaveDetailsforhierarchychange/?employeeName=' + escape($("#txtemployeeName").val()) + '&userType=' + escape($("select[name='ddlDesignation']").text()) + '&divisionName=' + escape(divisionname) +
    //           '&regionName=' + escape($("select[name='ddlUserRegion']").text()) + '&userTypecode=' + escape($("select[name='ddlDesignation']").val()) + '&divisionCode=' + escape(divisionCode) + '&UserregionCode=' + escape($("#ddlUserRegion").val()) + '&reportingmanagerusercode=' + escape($("#ddlReportingManagerchange").val()) + '&Usercode=' + escape(User) + '&newusertypecode=' + escape(newusertypecode) + '&reportingregioncode=' + escape($("ddlUserRegionchange").val()) + '&reportingregionname=' + escape($("#ddlUserRegionchange option:selected").text()));

    //        }
    //        else {
    //            fnMsgAlert('success', 'Success', 'User Hierarchy changed Successfully.');
    //            //alert("User Hierarchy changed Successfully.");
    //            $('#main').load('HiDoctor_Master/UsercreationWizard/Home');

    //        }
    //    }
    //});
}

function fnGetKangleUserDetails(userCode, Mode) {

    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetKangleUserDetails',
        data: "UserCode=" + userCode,
        success: function (JsonResult) {
            debugger;
            var result = JSON.parse(JsonResult);
            var UserEmpDetails = {
                Employee: result.Employee,
                User: result.User,
                Mode: Mode
            }
            KangleIntegration.requestInvoke("UserMigration", "ManageUserMasterHiDoctor", UserEmpDetails, "POST");
        },
        error: function (resp) {
            console.log(resp);
        }
    });
}

function fnbtnchange() {
    $("#btnNextchange").hide();
    $("#btnsavechange").show();
}

//Get Reporting to region by Selected Division change
var divisionCode = "";
function fnGetReportingManagerRegionchange() {
    debugger;
    $('#Effectivefrm').show();
    var effect = '1';
    try {
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        if ($('#DDlDivision').val() == '0') {
            fnMsgAlert('info', 'User Creation Wizard', 'Please Select The Division');
            $('#dvPanel').unblock();
            return false;
        }
        //var divisionCode = $('#ddlDivision") option:selected').val();
        divisionCode = "";
        $('select#DDlDivision > option:selected').each(function () {
            divisionCode += $(this).val() + ',';
            //entity_Names.push($(this).text().split('(')[0]);
        });
        divisionCode = divisionCode.slice(0, -1);
        if (divisionCode != null && divisionCode != '') {
            $("#DDlDivision").multiselect("destroy").multiselect().multiselectfilter();
            $.ajax({
                url: '../HiDoctor_Master/UsercreationWizard/GetRegionsbyDivision',
                type: "POST",
                data: "divisionCode=" + divisionCode,
                success: function (JsonResult) {
                    debugger;
                    fnonchangedivision();
                    //if (JsonResult != null && JsonResult != '') {
                    //    if (JsonResult.length > 0) {
                    //        var jsonresult = eval('(' + JsonResult + ')');
                    //        $("#ddlUserRegionchange option").remove();
                    //        var selectcolumn = $("#ddlUserRegionchange");
                    //        selectcolumn.append("<option value=0>-Select Reporting to Region-</option>");
                    //        for (var i = 0; i < jsonresult.length; i++) {
                    //            selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                    //        }
                    //    }
                    //}
                    $('#dvddlUserRegionchange').empty();
                    $('#dvddlUserRegionchange').html('<input type="text" id="ddlUserRegionchange">');
                    var lstuserbyregion = [];
                    var jsonresult = eval('(' + JsonResult + ')');
                    // var Json_EmployeeNames = eval('(' + jsData + ')');
                    for (var i = 0; i < jsonresult.length; i++) {
                        _objData = {};
                        _objData.id = jsonresult[i].Region_Code;
                        _objData.label = jsonresult[i].Region_Name;
                        lstuserbyregion.push(_objData);
                    }
                    //if (lstEmployee.length > 0) {
                    regiondetails = lstuserbyregion;
                    var atcObj = new ej.dropdowns.DropDownList({
                        //set the data to dataSource property
                        dataSource: lstuserbyregion,
                        fields: { text: 'label', value: 'id' },
                        filterBarPlaceholder: 'Search',
                        showClearButton: true,
                        allowFiltering: true,
                        placeholder: 'Select a Reporting to region',
                        change: fnCheckReportingManageChange,
                        filtering: function (e) {
                            var dropdown_query = new ej.data.Query();
                            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                            e.updateData(lstuserbyregion, dropdown_query);
                        }
                    });
                    atcObj.appendTo('#ddlUserRegionchange');
                    fnGetDesignationByDivision(2);
                    $('#dvPanel').unblock();
                },
                error: function () {
                    fnMsgAlert("Get Reporting to Regions failed.")
                    $('#dvPanel').unblock();
                }
            });
        } else {
            $("#DDlDivision").multiselect("destroy").multiselect().multiselectfilter();
        }
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();
    }
}

var divisioncode = '';
var divisionname = '';
//var User = '';

function fngetprefilluserdetails() {
    debugger;
    $("#btnShowtmailbtn").hide();
    $('#Effectivefrm').hide();
    Exisempname = '';
    $("#btnsavechange").hide();
    $("#btnNextchange").show();
    $("#lblregionstatus").hide();
    $("#Frmdate").val('');
    var usrName = $.trim($("#txtsearchUserName").val());
    if (usrName == '') {
        fnMsgAlert('info', 'Info', 'Please Select UserName');
        return false;
    }
    //var UserName = usrName.split('(')[0];
    //var disJson = jsonPath(Json_Assignemp_g, "$.[?(@.User_Name=='" + usrName + "')]");

    //if (disJson != false) {
    //    $("#hdnUserCode").val(disJson[0].User_Code)
    //}
    //else {
    //    $("#hdnUserCode").val('');
    //}



    try {
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        //$('#ddlDesignation option').remove(); // remove all Designation Options
        //$('#ddlReportingManagerchange option').remove();// remove all Reporting to all User Options
        //$('#ddlUserRegion option').remove(); // remove all User Region Options
        //$('#ddlExpemseGroup option').remove();
        $('#ddlDivision option').remove();
        //Bind Designation
        fngetempcode();
        var employeeCode = Empcode;
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/GetEmployeeDetails',
            type: "POST",
            data: "employeeCode=" + employeeCode,
            success: function (JsData) {
                debugger
                var jsonresult = eval('(' + JsData + ')');
                if (jsonresult != null && jsonresult != '') {
                    if (jsonresult.length > 0) {
                        //Get Employee details               
                        var employeeName = jsonresult[0].Employee_Name;
                        var employeeNumber = jsonresult[0].Employee_Number;
                        var employeeCode = jsonresult[0].Employee_Code;
                        Exisempname = employeeName;
                        //Prefill Employee Details              
                        $('#txtemployeeName').val(employeeName);
                        $('#hdnEmployeeCode').val(employeeCode);
                        fngetuserlist();
                    }
                }

            },
            error: function () {
                $('#dvPanel').unblock();
                fnMsgAlert("Get Divisions failed.")
            },
            complete: function () {
                $('#dvPanel').unblock();
            }
        });
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        $('#dvPanel').unblock();

    }
}

var EmpCode = '';
var EmpName = '';
function fngetempcode() {
    debugger;
    var User = $("select[name='txtsearchUserName']").val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/Getempcode',
        type: "POST",
        async: false,
        data: "userCode=" + User,
        success: function (JsonResult) {
            debugger;
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    Json_Employee = eval('(' + JsonResult + ')');
                    Empcode = Json_Employee[0].Employee_Code;
                    EmpName = Json_Employee[0].Employee_Name;
                }
            }
        }
    });
}

var User = '';
function fngetuserlist() {
    debugger
    var selectcolumn = '';
    Exisusername = '';
    Usertypecode_g = '';
    debugger;
    User = $("select[name='txtsearchUserName']").val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/Getuserdetails',
        type: "POST",
        async: false,
        data: "userCode=" + User,
        success: function (JsonResult) {
            debugger;
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 0) {
                    Json_user = eval('(' + JsonResult + ')');
                    ExisUserdata = Json_user;
                    Usertypecode_g = Json_user[0].User_Type_Code;
                    $("#txtuserName").val(Json_user[0].User_Name);
                    $("#txthidoctorstartdatechange").val(Json_user[0].HiDoctor_start_Date);
                    $("#txtpassword").val(Json_user[0].User_Pass);
                    $("#reff1").val(Json_user[0].RefKey1);
                    $("#reff2").val(Json_user[0].RefKey2);
                    $("#ddlUserRegion").val(Json_user[0].Region_Name);

                    if (Json_Divisions != null && Json_Divisions != '') {
                        debugger;
                        ExisDiv = Json_Divisions;
                        if (Json_Divisions.length > 0) {
                            var jsonresult = eval('(' + Json_Divisions + ')');
                            if (Json_user[0].User_Division_Code != '' && Json_user[0].User_Division_Code != undefined && Json_user[0].User_Division_Code != null && Json_user[0].User_Division_Code != 0) {
                                var divisionCode = Json_user[0].User_Division_Code.split(',');
                                for (var i = 0; i < jsonresult.length; i++) {
                                    selectcolumn += "<option  value=" + jsonresult[i].Division_Code + ">" + jsonresult[i].Division_Name + "</option>";
                                }
                                $("#DDlDivision").html(selectcolumn);
                                for (var g = 0; g < divisionCode.length; g++) {
                                    $("#DDlDivision").multiselect("widget").find(":checkbox[value='" + divisionCode[g] + "']").attr("checked", "checked");
                                    $("#DDlDivision option[value='" + divisionCode[g] + "']").attr("selected", true);

                                }
                                $('#DDlDivision').multiselect("destroy").multiselect().multiselectfilter();
                            }
                        }

                    }
                    $("#DDlDivision").multiselect({
                        noneSelectedText: '-Select Division-'
                    }).multiselectfilter();
                    $("#DDlDivision").multiselect("destroy").multiselect().multiselectfilter();
                    //Get Reporting to User
                    //if (JsonResult != null && JsonResult != '') {
                    //    if (JsonResult.length > 0) {
                    //        var jsonresult = eval('(' + JsonResult + ')');
                    //      var selectcolumn = $("#ddlReportingManagerchange");
                    //        $(selectcolumn).html('');
                    //        selectcolumn.append("<option value=0>-Select Reporting Manager-</option>");
                    //        for (var i = 0; i < jsonresult.length; i++) {
                    //            selectcolumn.append("<option value=" + jsonresult[i].User_Code + ">" + jsonresult[i].User_Name + "</option>");
                    //        }

                    //        if (Json_user[0].Reporting_Manager != '' || Json_user[0].Reporting_Manager != undefined || Json_user[0].Reporting_Manager != null || Json_user[0].Reporting_Manager != 0) {
                    //            // selectcolumn.append("<option value=" + Json_user[0].Under_User_Code + ">" + Json_user[0].Reporting_Manager + "</option>");
                    //            $(selectcolumn).val(Json_user[0].Under_User_Code);
                    //        }


                    //    }
                    //}
                    $('#dvddlReportingManagechange').empty();
                    $('#dvddlReportingManagechange').html('<input type="text" id="ddlReportingManagerchange" >');
                    var lstManagerName = [];
                    if (JsonResult.length > 0) {
                        var jsonresult = eval('(' + JsonResult + ')');

                        for (var i = 0; i < jsonresult.length; i++) {
                            _objData = {};
                            _objData.id = jsonresult[i].Under_User_Code;
                            _objData.label = jsonresult[i].Reporting_Manager;
                            lstManagerName.push(_objData);
                        }

                        regiondetails = lstManagerName;
                        var valueArr = [];
                    }

                    var atcObj = new ej.dropdowns.DropDownList({
                        //set the data to dataSource property
                        dataSource: lstManagerName,
                        fields: { text: 'label', value: 'id' },
                        filterBarPlaceholder: 'Search',
                        showClearButton: true,
                        allowFiltering: true,
                        placeholder: "Select Reporting Manager",
                        value: Json_user[0].Under_User_Code,
                        //change: fnCheckSelectedRegionsStatus,
                        filtering: function (e) {
                            var dropdown_query = new ej.data.Query();
                            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                            e.updateData(lstManagerName, dropdown_query);
                        }

                    });
                    atcObj.appendTo('#ddlReportingManagerchange')

                      //    Actual reporting user   ////

                    if (Json_user[0].ActulReporting_Name != 0 && Json_user[0].ActulReporting_Name != null) {
                        $('#dvddlActualreport').empty();
                        $('#dvddlActualreport').html('<input type="text" id="ddlActual">');
                        var lstuserbyregion = [];
                        if (JsonResult.length > 0) {
                            var jsonresult = eval('(' + JsonResult + ')');
                            for (var i = 0; i < jsonresult.length; i++) {
                                _objData = {};
                                _objData.id = jsonresult[i].ActualReporting_Code;
                                _objData.label = jsonresult[i].ActulReporting_Name;
                                lstuserbyregion.push(_objData);
                            }
                           
                            regiondetails = lstuserbyregion;
                            var valueArr = [];
                        }
                       
                        var atcObj = new ej.dropdowns.DropDownList({
                            //set the data to dataSource property
                            dataSource: lstuserbyregion,
                            fields: { text: 'label', value: 'id' },
                            filterBarPlaceholder: 'Search',
                            showClearButton: true,
                            allowFiltering: true,
                            placeholder: 'Select Actual Reporting Manager',
                            text: Json_user[0].ActulReporting_Name,
                            //change: StockiestMaster.fnGetStockiestDetails(),
                            //change: fnCheckReportingManageChange,
                            filtering: function (e) {
                                var dropdown_query = new ej.data.Query();
                                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                e.updateData(lstuserbyregion, dropdown_query);
                            }
                        });
                        atcObj.appendTo('#ddlActual');
                        
                    }
                    else {
                        var divisioncode = Json_user[0].User_Division_Code


                        fngetActualReporting(divisioncode);
                    }
                  
                   
                    //if (Json_reportingtoRegions != null && Json_reportingtoRegions != '') {
                    //    if (Json_reportingtoRegions.length > 0) {
                    //        var jsonresult = eval('(' + Json_reportingtoRegions + ')');
                    //        var selectcolumn = $("#ddlUserRegionchange");
                    //        var msObject = document.getElementById("ddlUserRegionchange").ej2_instances[0];
                    //        msObject.value = Json_user[0].Reporting_Region_Code;
                    //        //$(selectcolumn).html('');
                    //        //selectcolumn.append("<option value=0>-Select Reporting to Region-</option>");
                    //        //for (var i = 0; i < jsonresult.length; i++) {
                    //        //    selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                    //        //}
                    //        //selectcolumn.append("<option value=" + Json_user[0].Region_Code + ">" + Json_user[0].Region_Name + "</option>");
                    //        //if (Json_user[0].Reporting_Region != '' || Json_user[0].Reporting_Region != undefined || Json_user[0].Reporting_Region != null || Json_user[0].Reporting_Region != 0) {
                    //        //    $(selectcolumn).val(Json_user[0].Reporting_Region_Code);
                    //        //    //selectcolumn.append("<option value=" + Json_user[0].Region_Code + ">" + Json_user[0].Region_Name + "</option>");
                    //        //}
                    //    }
                    //}
                    $('#dvddlUserRegionchange').empty();
                    $('#dvddlUserRegionchange').html('<input type="text" id="ddlUserRegionchange" >');
                    var lstuserbyregion = [];
                    var jsonresult = eval('(' + Json_reportingtoRegions + ')');
                    // var Json_EmployeeNames = eval('(' + jsData + ')');
                    for (var i = 0; i < jsonresult.length; i++) {
                        _objData = {};
                        _objData.id = jsonresult[i].Region_Code;
                        _objData.label = jsonresult[i].Region_Name;
                        lstuserbyregion.push(_objData);
                    }
                    //if (lstEmployee.length > 0) {
                    regiondetails = lstuserbyregion;
                    var valueArr = [];
                    //valueArr.push(Json_user[0].Reporting_Region_Code);
                    var atcObj = new ej.dropdowns.DropDownList({
                        //set the data to dataSource property
                        dataSource: lstuserbyregion,
                        fields: { text: 'label', value: 'id' },
                        filterBarPlaceholder: 'Search',
                        showClearButton: true,
                        allowFiltering: true,
                        placeholder: 'Select a Reporting to Region',
                        value: Json_user[0].Reporting_Region_Code,
                        //change: StockiestMaster.fnGetStockiestDetails(),
                        change: fnCheckReportingManageChange,
                        filtering: function (e) {
                            var dropdown_query = new ej.data.Query();
                            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                            e.updateData(lstuserbyregion, dropdown_query);
                        }
                    });
                    atcObj.appendTo('#ddlUserRegionchange');
                    //fnGetUserRegionByregionCodechangeBack();
                    //Get User Region

                    if (Json_regions != null && Json_regions != '') {
                        if (Json_regions.length > 0) {
                            var jsonresult = eval('(' + Json_regions + ')');
                            var msObject = document.getElementById("ddlUserRegion").ej2_instances[0];
                            msObject.value = Json_user[0].Region_Code;
                            //var selectcolumn = $("#ddlUserRegion");
                            //$(selectcolumn).html('');
                            //selectcolumn.append("<option value=0>-Select Region-</option>");

                            //for (var i = 0; i < jsonresult.length; i++) {
                            //    selectcolumn.append("<option value=" + jsonresult[i].Region_Code + ">" + jsonresult[i].Region_Name + "</option>");
                            //}
                            //if (Json_user[0].Region_Name != '' || Json_user[0].Region_Name != undefined || Json_user[0].Region_Name != null || Json_user[0].Region_Name != 0) {
                            //    $(selectcolumn).val(Json_user[0].Region_Code);
                            //    //selectcolumn.append("<option value=" + Json_user[0].Region_Code + ">" + Json_user[0].Region_Name + "</option>");
                            //}
                        }
                    }

                    if (Json_Expensegroup != null && Json_Expensegroup != '') {
                        if (Json_Expensegroup.length > 0) {
                            var jsonresult = eval('(' + Json_Expensegroup + ')');
                            var expenseGroupId = Json_user[0].Expense_Group_Id.toString();
                            var msObject = document.getElementById("ddlExpemseGroup").ej2_instances[0];
                            msObject.value = expenseGroupId;
                            //$('#dvExpenseHeader').empty();fnGetReportingmanagerByregionchange
                            //var lstExpenses = [];
                            //for (var i = 0; i < Json_Expensegroup.length; i++) {
                            //    _objData = {};
                            //    _objData.id = Json_Expensegroup[i].Expense_Group_Id;
                            //    _objData.label = Json_Expensegroup[i].Expense_Group_Name;
                            //    lstExpenses.push(_objData);
                            //}
                            ////if (lstEmployee.length > 0) {
                            //var valueArr = [];
                            ////valueArr.push(Json_user[0].Reporting_Region_Code);
                            //var atcObj = new ej.dropdowns.DropDownList({
                            //    //set the data to dataSource property
                            //    dataSource: lstExpenses,
                            //    fields: { text: 'label', value: 'id' },
                            //    filterBarPlaceholder: 'Search',
                            //    showClearButton: true,
                            //    allowFiltering: true,
                            //    placeholder: 'Select a Expense Group',
                            //    value: Json_user[0].Expense_Group_Id
                            //    //change: StockiestMaster.fnGetStockiestDetails(),

                            //});
                            //atcObj.appendTo('#ddlExpenseGroup');
                        }
                    }
                    fnGetDesignationByDivision(3);
                    if (Json_user[0].User_Type_Name != '' || Json_user[0].User_Type_Name != undefined || Json_user[0].User_Type_Name != null || Json_user[0].User_Type_Name != 0) {
                        var msObject = document.getElementById("ddlDesignation").ej2_instances[0];
                        msObject.value = Json_user[0].User_Type_Code;
                        sendmail = 0;
                    }
                    var Maildet = $.grep(Maildetails, function (element, index) {
                        return element.User_Type_Code == Json_user[0].User_Type_Code;
                    });
                    if (Maildet.length > 0) {
                        sendmail = 1;
                        $("#btnShowtmailbtn").show();
                    }
                }
            }
            //var oldData=[];
            oldDetails = JsonResult;
        }

    });


}
  //Actual reporting manager in Attribute changes prefil  ///
function fngetActualReporting(divisioncode) {
    debugger;
    //var Company_code = CompanyCode;
    //Company_Code;
    $.ajax({
        async: false,
        url: '../HiDoctor_Master/UsercreationWizard/GetActuluser',
        type: "POST",
        data: "divisionCode=" + divisioncode,
        async: false,
        success: function (jsData) {
            debugger;
            $('#dvddlActualreport').empty();
            $('#dvddlActualreport').html('<input type="text" id="ddlActual">');
            var lstUser = [];
            Json_UserNames = eval('(' + jsData + ')');
            for (var i = 0; i < Json_UserNames.length; i++) {
                _objData = {};
                _objData.id = Json_UserNames[i].User_Code;
                _objData.label = Json_UserNames[i].User_Name;
                lstUser.push(_objData);
            }
            // if (lstUser.length > 0) {
            UserDetails = lstUser;
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstUser,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select a  Actual user',
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstUser, dropdown_query);
                }
            });
            atcObj.appendTo('#ddlActual');
            //}
            // }






        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });

}
function fnPrefillDOC(jd) {
    debugger
    var ncd = jd.split('/');
    //console.log(addMonths(new Date(ncd[2], ncd[1].split('0')[1], ncd[0]), 5).toString());
    if (ncd[1] >= 10) {
        var nxtdate = addMonths(new Date(ncd[2], ncd[1], ncd[0]), 5).toString();
    } else {
        var nxtdate = addMonths(new Date(ncd[2], ncd[1].split('0')[1], ncd[0]), 5).toString();
    }
    var date = new Date(nxtdate);
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    //console.log(dd + "/" + mm + "/" + yyyy);
    var DOC = dd + "/" + mm + "/" + yyyy;
    $("#txtDOC").val(DOC);
}
function fnChangeDOC(jd) {
    debugger
    var cd = jd.value;
    var ncd = cd.split('/');
    //console.log(addMonths(new Date(ncd[2], ncd[1].split('0')[1], ncd[0]), 5).toString());
    if (ncd[1] >= 10) {
        var nxtdate = addMonths(new Date(ncd[2], ncd[1] - 1, ncd[0]), 5).toString();
    } else {
        var nxtdate = addMonths(new Date(ncd[2], ncd[1].split('0')[1] - 1, ncd[0]), 5).toString();
        //var nxtdate = addMonth(new Date(ncd[2], ncd[1]-1, ncd[0]),5).toString();
    }
    var date = new Date(nxtdate);
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    //var mm = date.getMonth();
    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }


    //var currentDate = dd + '/' + mm + '/' + yy;
    //today.setDate(today.getDate() + 180);
    //var dd = ("0" + today.getDate()).slice(-2);
    //var mm = today.getMonth() + 1;
    //mm = ("0" + mm).slice(-2);
    //var pyy = today.getFullYear();
    //var prevDate = pdd + '/' + mm + '/' + yy;
    //console.log(dd + "/" + mm + "/" + yyyy);
    var DOC = dd + "/" + mm + "/" + yyyy;
    $("#txtDOC").val(DOC);
}
function addMonths(date) {
    debugger;
    var d = date.getDate();
    date.setDate(date.getDate() + 179);
    //if (date.getDate() != d) {
    //    date.setDate(0);
    //}
    return date;
}
function fnonchangedivision() {
    $("#btnNextchange").hide();
    $("#btnsavechange").show();
}
//***********************************************************User Hierarchy Functions End(New Main)*****************************************************************//