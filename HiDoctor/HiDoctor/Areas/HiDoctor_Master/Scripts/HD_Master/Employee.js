var Statelst = "";
var citylst = "";
var Deptlst = "";
var stateID = "";
var cityID = "";
var Employeelist = "";
var emplycode = '';
var emplystatus = '';
var userstatus = '';
var blooburl = ""
var lstAttachementArr = '';
var EDNProof='0';
var salaryProof='0';
var resumeGiven='0';
var resignationSubmitted = '0';
 var appointed='0';
function fnChangeDOC(jd) {
    debugger
    var cd = jd.value;
    var ncd = cd.split('/');
    //console.log(addMonths(new Date(ncd[2], ncd[1].split('0')[1], ncd[0]), 5).toString());
    if (ncd[1] >= 10) {
        var nxtdate = addMonths(new Date(ncd[2], ncd[1] - 1, ncd[0]), 5).toString();
    } else {
        var nxtdate = addMonths(new Date(ncd[2], ncd[1].split('0')[1] - 1, ncd[0]), 5).toString();
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
    $("#txtPDOC").val(DOC);
}
function fnPrefillDOC(jd) {
    debugger
    var ncd = jd.split('/');
    //console.log(addMonths(new Date(ncd[2], ncd[1].split('0')[1], ncd[0]), 5).toString());
    if (ncd[1] >= 10) {
        var nxtdate = addMonths(new Date(ncd[2], ncd[1] - 1, ncd[0]), 5).toString();
    } else {
        var nxtdate = addMonths(new Date(ncd[2], ncd[1].split('0')[1] - 1, ncd[0]), 5).toString();
    }
    var date = new Date(nxtdate);
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    //console.log(dd + "/" + mm + "/" + yyyy);
    var DOC = dd + "/" + mm + "/" + yyyy;
    $("#txtPDOC").val(DOC);
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

function fnGetAllEmployees() {
    //  $.blockUI();
    $('#dvTab').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetAllEmployees',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                allEmployeeJson_g = jsData;
            }
        },
        error: function () {
            $("#dvTab").unblock();
        },
        complete: function () {
            $("#dvTab").unblock();
        }
    });
}
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
function fnEmployeeSubmit() {//
    debugger;
    aadhaar_No = $("#txtAADHAARnumberbox_1").val() + $("#txtAADHAARnumberbox_2").val() + $("#txtAADHAARnumberbox_3").val();
    var Ref_Key1 = $("#txtRefKey1").val();
    var Ref_Key2 = $("#txtRefKey2").val();
    var result = fnValidate();
    var BloodGroup = $('select[name="blooddgrp"]').text()
    if (BloodGroup == "") {

        BloodGroup == "";

    }

    if (result) {
        //if ($("#dvMainEmployee .errorIndicator").length > 0) {
        //    fnMsgAlert('info', 'Info', 'Please correct the error then try to submit');
        //    //   $("#dvMainEmployee .errorIndicator")[0].focus();
        //    return;
        //}
        var DOB = "";
        var DOC = "";
        var DOJ = "";
        var PDOC = "";

        if ($("#txtDOB").val() != '') {
            DOB = $("#txtDOB").val().split('/')[2] + "-" + $("#txtDOB").val().split('/')[1] + "-" + $("#txtDOB").val().split('/')[0];
        }
        if ($("#txtDOJ").val() != '') {
            DOJ = $("#txtDOJ").val().split('/')[2] + "-" + $("#txtDOJ").val().split('/')[1] + "-" + $("#txtDOJ").val().split('/')[0];
        }
        if ($("#txtDOC").val() != '') {
            DOC = $("#txtDOC").val().split('/')[2] + "-" + $("#txtDOC").val().split('/')[1] + "-" + $("#txtDOC").val().split('/')[0];
        }
        if ($("#txtPDOC").val() != '') {
            PDOC = $("#txtPDOC").val().split('/')[2] + "-" + $("#txtPDOC").val().split('/')[1] + "-" + $("#txtPDOC").val().split('/')[0];
        }
        if ($("#txtState").val() == 0) {
            Stateval = '';
        }
        if ($("#txtCity").val() == 0) {
            $("#txtCity").val(' ');
        }
        if ($("#Pincode_Id").val() == 0) {
            $("#Pincode_Id").val(' ');
        }

        if ($("#txtDept").val() == 0) {
            $("#txtDept").val(' ');
        }
        if ($("#BloodGroup").val() == 0) {
            $("#BloodGroup").val(' ');
        }
        //$('#dvTab').block({
        //    message: '<h3>Binding the employee details</h3>',
        //    css: { border: '2px solid #ddd' }
        //});


        if ($('#fileupload').val() != "") {
            var fileData = $("#fileupload").get(0);
        }

        var formdata = new FormData();
        if ($('#fileupload').val() != "") {
            formdata.append('File_Name', fileData.files[0].name);
            formdata.append('File_Data', fileData.files[0]);

            var data = getFileExtension(fileData.files[0].name);
            if (data == 'jpg' || data == 'png' || data == 'JPG' || data == 'PNG') {

                fnUpload(formdata);

            }
            else {
                fnMsgAlert('info', 'Info', 'Please Choose JPG,PNG Files only');
                return false;
            }
        }


        else {
            blooburl == "";

        }




        blooburl = lstAttachementArr;

        if (blooburl != "") {

            blooburl = lstAttachementArr;
        }
        blooburl == "";
        var DateOfBirth = DOB == "" ? "1900-01-01" : DOB;
        var Phone = $("#txtPhone").val() == "" ? "-1" : $("#txtPhone").val();
        var PFNumber = $("#txtPFNumber").val() == "" ? "-1" : $("#txtPFNumber").val();
        var PANNumber = $("#txtPANNumber").val() == "" ? "-1" : $("#txtPANNumber").val();
        var address1 = $("#txtAddress").val() == "" ? "-1" : $("#txtAddress").val();
        var address2 = $("#txtAddress2").val() == "" ? "-1" : $("#txtAddress2").val();
        var mobile = $("#txtMobile").val() == "" ? "-1" : $("#txtMobile").val();
        var address3 = $("#txtAddress3").val() == "" ? "-1" : $("#txtAddress3").val();
        var confirmationDate = DOC == "" ? "1900-01-01" : DOC;
        var SCBAccountNumber = $("#txtAcc1").val() == "" ? "-1" : $("#txtAcc1").val();
        var ICICIAccountNumber = $("#txtAcc2").val() == "" ? "-1" : $("#txtAcc2").val();
        var Ref_Key1 = Ref_Key1 == "" ? "-1" : Ref_Key1;
        var Ref_Key2 = Ref_Key2 == "" ? "-1" : Ref_Key2;
        var aadhaar_No = aadhaar_No == "" ? "-1" : aadhaar_No;
        var Blood_Group = BloodGroup == "" ? "-1" : BloodGroup;
        var Employee_Photo = blooburl == "" ? "-1" : blooburl;
        var employeeCode = $("#hdnEmployeeCode").val() == "" ? "-1" : $("#hdnEmployeeCode").val();


        var EmpObj = {
            EmployeeName: $("#txtEmployeeName").val(),
            employeeNumber: $("#txtEmployeeNumber").val(),
            gender: $('input:radio[name=rdGender]:checked').val(),
            dateOfBirth: DateOfBirth,

            Department_Id: $("#txtDept option:selected").val(),
            EDNProof: EDNProof,
            salaryProof: salaryProof,
            resumeGiven: resumeGiven,
            resignationSubmitted: resignationSubmitted,
            appointed: appointed,
            dateofJoining: DOJ,
            ProDateofConfirm: PDOC,
            confirmationDate: confirmationDate,
            PFNumber: PFNumber,
            PANNumber: PANNumber,
            SCBAccountNumber: SCBAccountNumber,
            ICICIAccountNumber: ICICIAccountNumber,
            address1: address1,
            address2: address2,
            address3: address3,
            State_ID: $("#txtState option:selected").val(),
            City_ID: $("#txtCity option:selected").val(),
            Pincode_Id: $("#txtPincode option:selected").val(),
            mobile: mobile,
            phone: Phone,
            emailId: $("#txtEmail").val(),
            employeeEntityType: $('input:radio[name=rdEntity]:checked').val(),
            employeeCode: employeeCode,
            mode: $("#hdnMode").val(),
            aadhaar_No: aadhaar_No,
            Ref_Key1: Ref_Key1,
            Ref_Key2: Ref_Key2,
            Blood_Group: Blood_Group,
            Employee_Photo: Employee_Photo,
        }


        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/User/InsertEmployee/',
            data: JSON.stringify({ "EmployeedetObj": EmpObj }),
            contentType: 'application/json; charset=utf-8',
            success: function (jsData) {
                if (jsData.split(':')[0].toUpperCase() == "SUCCESS") {
                    if ($("#dvEmp").is(":visible")) {
                        $("#hdnNewEmpCode").val(jsData.split(':')[1]);
                        var employee = "[" + "{label:" + '"' + "" + $("#txtEmployeeName").val().toUpperCase() + "_" + $("#txtEmployeeNumber").val() + "" + '",' + "value:" + '"' + ""
                                                                                      + jsData.split(':')[1] + "" + '"' + "}]";
                        employee = eval(employee);
                        employeeJson_g.push(employee[0]);
                        var currentEmpId = $("#hdnCurrentEmpName").val();
                        $("#" + currentEmpId.replace("dvAddEmp", "txtEmployeeName")).val($("#txtEmployeeName").val().toUpperCase() + "_" + $("#txtEmployeeNumber").val());
                        $("#" + currentEmpId.replace("dvAddEmp", "hdnEmployeeCode")).val(jsData.split(':')[1]);
                        autoComplete(employeeJson_g, "txtEmployeeName", "hdnEmployeeCode", "autoEmployee");
                        //fnGetAllEmployees();
                        $("#dvEmp").overlay().close();
                    }
                    if ($('#hdnMode').val() == "EDIT") {
                        fnMsgAlert('success', 'Success', 'Employee Details updated Successfully');
                        fnGetEmpDetails(1);
                        fnGetAllEmployees();
                        fnEmpClearAll();
                        fngetABloodgroupnames();
                    }
                    else {
                        fnMsgAlert('success', 'Success', 'Employee Details added Successfully');
                        fnGetEmpDetails(1);
                        fnGetAllEmployees();

                        fnEmpClearAll();
                    }
                }
                else {
                    fnMsgAlert('error', 'Error', 'Failed to add Employee Details');
                }
                //  $("#dvAjaxLoad").hide();
            },
            error: function () {
                $("#dvTab").unblock();
            },
            complete: function () {
                $("#dvTab").unblock();
            }
        });
        if ($("#hdnMode").val() == "EDIT") {
            var EmployeeObj = {
                Company_Code: Company_Code,
                User_Code: Logged_User_Code,
                EmployeeName: $("#txtEmployeeName").val(),
                employeeNumber: $("#txtEmployeeNumber").val(),
                gender: $('input:radio[name=rdGender]:checked').val(),
                dateOfBirth: DOB,

                EDNProof: EDNProof,
                salaryProof: salaryProof,
                resumeGiven: resumeGiven,
                resignationSubmitted: resignationSubmitted,
                appointed: appointed,
                dateofJoining: DOJ,
                confirmationDate: DOC,
                PFNumber: $("#txtPFNumber").val(),
                PANNumber: $("#txtPANNumber").val(),
                SCBAccountNumber: $("#txtAcc1").val(),
                ICICIAccountNumber: $("#txtAcc2").val(),
                address: $("#txtAddress").val(),

                mobile: $("#txtMobile").val(),
                phone: $("#txtPhone").val(),
                emailId: $("#txtEmail").val(),
                employeeEntityType: $('input:radio[name=rdEntity]:checked').val(),
                employeeCode: $("#hdnEmployeeCode").val(),
                mode: $("#hdnMode").val(),

            }
            KangleIntegration.requestInvoke("UserMigration", "ManageEmployeeHiDoctor", EmployeeObj, "POST");
        }

    }
    else {
        $("#dvAjaxLoad").hide();
        if ($("#dvMainEmployee .errorIndicator").length > 0) {
            fnMsgAlert('info', 'Info', 'Please correct the errors and then try to Submit');
            // $("#dvMainEmployee .errorIndicator")[0].focus();
            return;
        }
    }
}

//// Employee photo upload   logic///
function fnUpload(formdata) {
    debugger;

    $.ajax({
        type: 'post',
        url: '../HiDoctor_Master/User/BlopUpload',
        data: formdata,
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            debugger;
            lstAttachementArr = response;



        },
        error: function () {

        }
    });
}
//}
//}

function fnEmpClearAll() {
    $("#txtEmployeeName").val('');
    $("#txtAddress").val('');
    $("#txtAddress2").val('');
    $("#txtAddress3").val('');
    $("#txtPhone").val('');
    $("#txtMobile").val('')
    $("#txtEmail").val('')
    $("#txtEmployeeNumber").val('');
    $("#txtAcc1").val('');
    $("#txtAcc2").val('');
    $("#txtPFNumber").val('');
    $("#txtPANNumber").val('');
    $("#txtAADHAARnumberbox_1").val('');
    $("#txtAADHAARnumberbox_2").val('');
    $("#txtAADHAARnumberbox_3").val('');
    $("#hdnEmployeeCode").val('');
    $("#hdnMode").val('INSERT');
    $("#txtDOB").val('');
    $("#txtDOJ").val('');
    $("#txtDOC").val('');
    $("#txtPDOC").val('');
    $('#txtDept').prop('selectedIndex', 0);
    $('#txtCity').prop('selectedIndex', 0);
    $('#txtState').prop('selectedIndex', 0);
    $('#txtPincode').prop('selectedIndex', 0);
    $("input[type='radio'][name='rdEDN'][value='0']").attr('checked', true);
    $("input[type='radio'][name='rdSalary'][value='0']").attr('checked', true);
    $("input[type='radio'][name='rdResumeGiven'][value='0']").attr('checked', true);
    $("input[type='radio'][name='rdResignationSubmitted'][value='0']").attr('checked', true);
    $("input[type='radio'][name='rdAppointed'][value='0']").attr('checked', true);
    $("input[type='radio'][name='rdEntity'][value='CORPORATE']").attr('checked', true);
    $("input[type='radio'][name='rdGender'][value='M']").attr('checked', true);
    $("#txtRefKey1").val('');
    $("#txtRefKey2").val('');
    $("#blooddgrp").val('');
    $("#fileUrl").html('');
    $("#fileupload").val('');

}

function fnValidateEmpName() {
    if ($("#txtEmployeeName").val() != '') {
        if ($.trim($("#txtEmployeeName").val()).length < 3) {
            fnMsgAlert('info', 'Info', 'Please enter minimum 3 characters in the Employee Name field');
            return;
        }
        var result = regExforAlphaNumeric($.trim($("#txtEmployeeName").val()));
        if (!result) {
            fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Employee Name field');
            return;
        }
    }
}


function fnValidate() {
    var flag = true;
    //mobile number validation
    var result = fnValidateMobileNumber($("#txtMobile"), "MOBILE");
    if (!result) {
        fnMsgAlert('info', 'Validate', 'Please validate the Mobile Number');
        flag = false;
        return;
    }

    if ($.trim($("#txtMobile").val()) != '') {
        if ($.trim($("#txtMobile").val()).length < 10) {
            fnMsgAlert('info', 'Info', 'Please validate the mobile number.Mobile number must contain atleast 10 digit');
            return false;
        }
    }
    if ($.trim($("#txtMobile").val()) != '') {
        if ($.trim($("#txtMobile").val()).length > 10) {
            fnMsgAlert('info', 'Info', 'Mobile number length should not exceed 10.');
            return false;
        }
    }

    //phone number validation
    var result = fnValidateMobileNumber($("#txtPhone"), "PHONE");
    if (!result) {
        fnMsgAlert('info', 'Validate', 'Please validate the phone number');
        flag = false;
        return;
    }
    if ($.trim($("#txtPhone").val()) != '') {
        if ($.trim($("#txtPhone").val()).length < 10) {
            fnMsgAlert('info', 'validate', 'Please validate the Phone Number.Phone Number must contain 10 digits');
            flag = false;
            return;
        }
    }
    if ($.trim($("#txtPhone").val()) != '') {
        if ($.trim($("#txtPhone").val()).length > 11) {
            fnMsgAlert('info', 'Validate', 'Please validate the Phone Number.Phone Number can contain only 11 digits');
            flag = false;
            return;
        }
    }
    if ($.trim($("#txtEmployeeName").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please enter the Employee Name');
        flag = false;
        return;
    }
    if ($("#txtEmployeeName").val() != '') {
        if ($.trim($("#txtEmployeeName").val()).length < 3) {
            //$("#txtEmployeeName").attr('title', 'Please enter the employee name minimum 3 characters');
            //$("#txtEmployeeName").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Please enter atleast 3 characters in Employee Name');
            flag = false;
            return;
        }
        var result = regExforAlphaNumeric($.trim($("#txtEmployeeName").val()));
        if (!result) {
            //$("#txtEmployeeName").attr('title', 'Special characters are not allowed in the employee name field');
            //$("#txtEmployeeName").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Employee Name field');
            flag = false;
            return;
        }
    }
    if ($.trim($("#txtEmployeeNumber").val()) == "") {
        //$("#txtEmployeeNumber").attr('title', 'Please enter the employee number');
        //$("#txtEmployeeNumber").addClass('errorIndicator');
        //flag = false;
        fnMsgAlert('info', 'Info', 'Please enter Employee Number');
        flag = false;
        return;
    }

    else {
        if (allEmployeeJson_g != '' && $("#hdnMode").val() != 'EDIT') {
            var disJson = jsonPath(allEmployeeJson_g, "$.[?(@.Employee_Number=='" + $.trim($("#txtEmployeeNumber").val()).toUpperCase() + "')]");
            if (disJson != false & disJson != undefined) {
                $("#txtEmployeeNumber").val('');
                fnMsgAlert('info', 'Information', 'Employee Number already exists.Please enter valid Employee Number');
                flag = false;
                return;
            }
            else {   // 
                var result = regExforAlphaNumeric($.trim($("#txtEmployeeNumber").val()));
                if (!result) {
                    //$("#txtEmployeeNumber").attr('title', 'Special characters are not allowed in the employee number field');
                    //$("#txtEmployeeNumber").addClass('errorIndicator');
                    //flag = false;
                    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Employee Number field');
                    flag = false;
                    return;
                }
            }
        }
        else {
            var disJson = jsonPath(allEmployeeJson_g, "$.[?(@.Employee_Number=='" + $.trim($("#txtEmployeeNumber").val()).toUpperCase() + "')]");
            if (disJson != false & disJson != undefined) {
                if (disJson[0].Employee_Code != $('#hdnEmployeeCode').val()) {
                    $("#txtEmployeeNumber").val('');
                    fnMsgAlert('info', 'Information', 'Employee Number already exists.Please enter valid Employee Number');
                    flag = false;
                    return;
                }
                else {
                    var result = regExforAlphaNumeric($.trim($("#txtEmployeeNumber").val()));
                    if (!result) {
                        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Employee Number field');
                        flag = false;
                        return;
                    }
                }
            }
            else {   // 
                var result = regExforAlphaNumeric($.trim($("#txtEmployeeNumber").val()));
                if (!result) {
                    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Employee Number field');
                    flag = false;
                    return;
                }
            }
        }
    }
    if ($("#txtDOJ").val() == "") {
        //$("#txtDOJ").attr('title', 'Please enter the join date');
        //$("#txtDOJ").addClass('errorIndicator');
        //flag = false;
        fnMsgAlert('info', 'Info', 'Please enter the Join Date');
        flag = false;
        return;

    }
    else {
        var result = isValidDateFormat($("#txtDOJ"));
        //new Date($("#txtDOJ").val().split('/')[2] + "-" + $("#txtDOJ").val().split('/')[1] + "-" + $("#txtDOJ").val().split('/')[0]);
        if (!result) {
            fnMsgAlert('info', 'Info', 'Please enter valid date in Date of Joining');
            flag = false;
            return;
        }
    }
    if ($("#txtEmail").val() == '') {
        //$("#txtEmail").attr('title', 'Please enter email id');
        //$("#txtEmail").addClass('errorIndicator');
        //flag = false;
        fnMsgAlert('info', 'Info', 'Please enter Email Id');
        flag = false;
        return;
    }
    else {
        if (!fnEmailCheck($("#txtEmail"))) {
            //$("#txtEmail").attr('title', 'Please enter a valid email id');
            //$("#txtEmail").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Please enter a valid Email Id');
            flag = false;
            return;
        }
    }
    if ($("#txtMobile").val() == '') {

        fnMsgAlert('info', 'Info', 'Please enter Mobile Number');
        flag = false;
        return;
    }

    if ($.trim($("#txtPFNumber").val()) != '') {
        var result = regExforAlphaNumeric($.trim($("#txtPFNumber").val()));
        if (!result) {
            //$("#txtPFNumber").attr('title', 'Special characters are not allowed in the PF Number');
            //$("#txtPFNumber").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Special characters are not allowed in the PF Number');
            flag = false;
            return;
        }
    }
    else
        if ($.trim($("#txtPFNumber").val()).length > 50) {
            fnMsgAlert('info', 'Info', 'PF Number should be less than or equal to 50 characters');
            flag = false;
            return;
        }
    if ($.trim($("#txtPANNumber").val()) != '') {
        var result = regExforAlphaNumeric($.trim($("#txtPANNumber").val()));
        if (!result) {
            //$("#txtPANNumber").attr('title', 'Special characters are not allowed in the PAN Number');
            //$("#txtPANNumber").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Special characters are not allowed in the PAN Number');
            flag = false;
            return;
        }
        else
            if (($.trim($("#txtPANNumber").val()).length < 10)) {
                fnMsgAlert('info', 'Info', 'PAN Number should be equal to 10 characters');
                flag = false;
                return;
            }
            else
                if (($.trim($("#txtPANNumber").val()).length > 10)) {
                    fnMsgAlert('info', 'Info', 'PAN Number cannot be greater than 10 digits');
                    flag = false;
                    return;
                }
    }

    if ($.trim($("#txtAcc1").val()) != '') {
        var result = regExforAlphaNumeric($.trim($("#txtAcc1").val()));
        if (!result) {
            //$("#txtAcc1").attr('title', 'Special characters are not allowed in the Bank Account Number1');
            //$("#txtAcc1").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Bank Account Number1');
            flag = false;
            return;
        }
    }
    if ($.trim($("#txtAcc2").val()) != '') {
        var result = regExforAlphaNumeric($.trim($("#txtAcc2").val()));
        if (!result) {
            //$("#txtAcc2").attr('title', 'Special characters are not allowed in the Bank account number2');
            //$("#txtAcc2").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Bank account Number2');
            flag = false;
            return;
        }
    }
    //if ($.trim($("#txtAddress").val()) != '') {
    //var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#@!;{}*-\/,`=?]+$");
    //if (!specialCharregex.test($.trim($("#txtAddress").val()))) {
    //    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the address field');
    //    flag = false;
    //    return;
    //}
    //else {
    //    var address = $.trim($("#txtAddress").val());
    //    $("#txtAddress").val(address.replace(/'/g, ' '));
    //}

    if ($("#txtAddress").val() != "") {
        var specialCharregex = new RegExp(/[~`''^&<>$\\]/);
        if (specialCharregex.test($("#txtAddress").val())) {
            var specialChar = "(/[~`''^&<>$\\]/)";
            fnMsgAlert('info', 'Information', 'The following <b>' + specialChar + '</b> charcters not allowed in the address field');
            flag = false;
            return;
        }
        else {
            var address = $.trim($("#txtAddress").val());
            $("#txtAddress").val(address.replace(/'/g, ' '));
        }

    }
    if ($("#txtAddress2").val() != "") {
        var specialCharregex = new RegExp(/[~`''^&<>$\\]/);
        if (specialCharregex.test($("#txtAddress2").val())) {
            var specialChar = "(/[~`''^&<>$\\]/)";
            fnMsgAlert('info', 'Information', 'The following <b>' + specialChar + '</b> charcters not allowed in the address field');
            flag = false;
            return;
        }
        else {
            var address = $.trim($("#txtAddress2").val());
            $("#txtAddress2").val(address.replace(/'/g, ' '));
        }
    }

    if ($("#txtAddress3").val() != "") {
        var specialCharregex = new RegExp(/[~`''^&<>$\\]/);
        if (specialCharregex.test($("#txtAddress3").val())) {
            var specialChar = "(/[~`''^&<>$\\]/)";
            fnMsgAlert('info', 'Information', 'The following <b>' + specialChar + '</b> charcters not allowed in the address field');
            flag = false;
            return;;
        }
        else {
            var address = $.trim($("#txtAddress3").val());
            $("#txtAddress3").val(address.replace(/'/g, ' '));
        }
    }
    //}
    if ($("#txtDept").val() == "" && $("#txtDept").val() == 0) {
        fnMsgAlert('info', 'Info', 'Please select a Department');
        flag = false;
        return;
    }
    if ($("#txtDOB").val() != '') {
        var result = isValidDateFormat($("#txtDOB"));
        if (!result) {
            fnMsgAlert('info', 'Info', 'Please enter valid date in Date of Birth');
            flag = false;
            return;
        }
    }
    if ($("#txtDOC").val() != '') {
        var result = isValidDateFormat($("#txtDOC"));
        if (!result) {
            fnMsgAlert('info', 'Info', 'Please enter valid date in Date of Confirmation');
            flag = false;
            return;
        }
    }
    if ($("#txtDOJ").val() != '' && $("#txtDOB").val() != '') {
        var dob = $("#txtDOB").val().split('/')[2] + '/' + $("#txtDOB").val().split('/')[1] + '/' + $("#txtDOB").val().split('/')[0];
        var doj = $("#txtDOJ").val().split('/')[2] + '/' + $("#txtDOJ").val().split('/')[1] + '/' + $("#txtDOJ").val().split('/')[0];
        var dobDate = new Date(dob);
        var dojDate = new Date(doj);
        if (dobDate > dojDate) {
            fnMsgAlert('info', 'Validate', 'Date of Joining should be greater than Date of Birth');
            flag = false;
            return;
        }
        else {
            if ($("#txtDOJ").val() == $("#txtDOB").val()) {
                fnMsgAlert('info', 'Validate', 'Date of Joining should not be same as Date of Birth');
                flag = false;
                return;
            }
        }
    }
    if ($("#txtDOC").val() != '' && $("#txtDOJ").val() != '') {
        var doc = $("#txtDOC").val().split('/')[2] + '/' + $("#txtDOC").val().split('/')[1] + '/' + $("#txtDOC").val().split('/')[0];
        var doj = $("#txtDOJ").val().split('/')[2] + '/' + $("#txtDOJ").val().split('/')[1] + '/' + $("#txtDOJ").val().split('/')[0];
        var docDate = new Date(doc);
        var dojDate = new Date(doj);
        if (dojDate > docDate) {
            fnMsgAlert('info', 'Validate', 'Date of Confirmation should be greater than or equal to Date of Joining');
            flag = false;
            return;
        }
    }
    if ($("#txtState").val() == "" && $("#txtState").val() == 0) {
        fnMsgAlert('info', 'Info', 'Please select a State');
        flag = false;
        return;
    }
    if ($("#txtCity").val() == "" && $("#txtCity").val() == 0) {
        fnMsgAlert('info', 'Info', 'Please select a City');
        flag = false;
        return;
    }
    if ($("#txtPincode").val() == "" && $("#txtPincode").val() == 0) {
        fnMsgAlert('info', 'Info', 'Please select a Pincode');
        flag = false;
        return;
    }
    if (aadhaar_No != '') {
        if (aadhaar_No.length != 12) {
            fnMsgAlert('info', 'Info', 'Please enter 12 characters in the Aadhaar Number field');
            flag = false;
            return;
        }
        else if ($('#hdnMode').val() == "EDIT") {
            if (Eaadhaar != aadhaar_No) {
                var flagaadhar = fnValidateAadhaarNumber();
                if (!flagaadhar) {
                    flag = false;
                    return;
                }
            }
        }
        else {
            var flagaadhar = fnValidateAadhaarNumber();
            if (!flagaadhar) {
                flag = false;
                return;
            }
        }
    }

    if ($('#txtRefKey1').val() != "") {
        var result = regExforAlphaNumeric($.trim($("#txtRefKey1").val()));
        if (!result) {
            fnMsgAlert('info', 'Info', 'Reference key 1 is not valid.Only (a-z A-Z 0-9)  are allowed.');
            // HideModalPopup("dvloading");
            flag = false;
            return;
        }
        else if ($('#hdnMode').val() == "EDIT") {
            if (EditEmp[0].Ref_Key1 != $('#txtRefKey1').val()) {
                var flagrefkey1 = fntxtReferenceKey1();
                if (!flagrefkey1) {
                    flag = false;
                    return;
                }
            }
        }
        else {
            var flagrefkey1 = fntxtReferenceKey1();
            if (!flagrefkey1) {
                flag = false;
                return;
            }
        }
    }
    if ($('#txtRefKey2').val() != "") {
        var result = regExforAlphaNumeric($.trim($("#txtRefKey2").val()));
        if (!result) {
            fnMsgAlert('info', 'Info', 'Refernce key 2 is not valid.Only (a-z A-Z 0-9) are allowed.');
            // HideModalPopup("dvloading");
            flag = false;
            return;
        }
        else if ($('#hdnMode').val() == "EDIT") {
            if (EditEmp[0].Ref_Key2 != $('#txtRefKey2').val()) {
                var flagrefkey2 = fntxtReferenceKey2();
                if (!flagrefkey2) {
                    flag = false;
                    return;
                }
            }
        }
        else {
            var flagrefkey2 = fntxtReferenceKey2();
            if (!flagrefkey2) {
                flag = false;
                return;
            }
        }
    }

    //txtPhone
    return flag;
}

function fnValidateMobileNumber(obj, device) {
    if ($.trim($(obj).val()) != '') {
        if (device.toUpperCase() == "MOBILE") {
            ////+919840011514 , 919840011514,9840011514
            //var mobilePattern = /^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}9[0-9](\s){0,1}(\-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$/;
            //return mobilePattern.test($.trim($(obj).val()));
            var phoneNumberPattern = /^\d+$/
            return phoneNumberPattern.test($.trim($(obj).val()));
        }
        else if (device.toUpperCase() == "PINCODE") {
            var pincodePattern = /^\d+$/
            return pincodePattern.test($.trim($(obj).val()));
        }
        else {
            var phoneNumberPattern = /^\d+$/
            return phoneNumberPattern.test($.trim($(obj).val()));
        }


    }
    return true;
}
function fnRemoverErrorIndicator(obj) {
    $(obj).removeClass('errorIndicator');
    $(obj).removeAttr('title');
    // $(obj).removeClass('tip');
    // $(obj).removeClass('tooltip');
}

function fnCloseEmpPop() {
    $("#dvEmp").overlay().close();
}

function fnGetSearchResult() {
    if ($.trim($("#txtEmpSearch").val()) != '') {
        if ($.trim($("#txtEmpSearch").val()).length < 3) {
            fnMsgAlert('info', 'Info', 'Please enter atleast 3 characters');
            return;
        }
        else {
            fnGetEmpDetails('1');
        }
    }
    else {
        fnGetEmpDetails('1');
    }
}

function fnGetInactiveSearchResult() {
    if ($.trim($("#txtInactiveEmpSearch").val()) != '') {
        if ($.trim($("#txtInactiveEmpSearch").val()).length < 3) {
            fnMsgAlert('info', 'Info', 'Please enter atleast 3 characters');
            return;
        }
        else {
            fnGetEmpInactiveDetails('1');
        }
    }
    else {
        fnGetEmpInactiveDetails('1');
    }
}


function fnGetEmpDetails(pageNumber) {
    var empName = "";
    $('#dvEmpDetails').html('');
    $("#dvExcelExport").html('');
    if ($.trim($("#txtEmpSearch").val()) != '') {
        empName = $.trim($("#txtEmpSearch").val());
    }
    $('#dvTab').block({
        message: '<h3>Binding the employee details</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetAllEmployeeDetails',
        data: "pageNumber=" + pageNumber + "&excelDownload=true&empName=" + empName,
        success: function (result) {
            EmployeeJson_g = result;
            // if (result != '') {
            //  if (result.split('$').length > 1) {
            //    $("#dvEmpDetails").html(result.split('$')[0]);
            //    EmployeeJson_g = eval('(' + result.split('$')[1] + ')');
            //    $("#dvExcelExport").html(result.split('$')[2]);

            //}
            var grid = new ej.grids.Grid({
                dataSource: result.Data,
                // rowSelected: fnRowSelected,
                showColumnChooser: true,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                allowExcelExport: true,
                height: 400,
                frozenColumns: 3,
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['ExcelExport', 'Search', 'ColumnChooser'],

                aggregates: [],
                columns: [
                       { headerText: 'Edit', template: "<a href=#;>Edit</a>", width: 100, textAlign: 'center' },
                       { headerText: 'Change Status', template: "<a href=#;>Change Status</a>", width: 170, textAlign: 'center' },
                       { field: 'Employee_Name', headerText: 'Employee Name', width: 250, textAlign: 'center' },
                       { field: 'Gender', headerText: 'Gender', width: 150, textAlign: 'center' },
                       { field: 'Date_Of_Birth', headerText: 'Date Of Birth', width: 200, textAlign: 'center' },
                       { field: 'Employee_Number', headerText: 'Employee Number', width: 230, textAlign: 'center' },
                       { field: 'Department_Name', headerText: 'Department', width: 200, textAlign: 'center' },
                       //{ field: 'Resume_Given', headerText: 'Resume Given', width: 200, textAlign: 'center' },
                       //{ field: 'EDN_Proof', headerText: 'EDN Proof', width: 200, textAlign: 'center' },
                       //{ field: 'Salary_Proof', headerText: 'Salary Proof', width: 180, textAlign: 'center' },
                      // { field: 'Appointed', headerText: 'Appointed', width: 170, textAlign: 'center' },
                       { field: 'Date_of_Joining', headerText: 'Date Of Joining', width: 200, textAlign: 'center' },
                       { field: 'Confirmation_Date', headerText: 'Date Of Confirmation', width: 230, textAlign: 'center' },
                       { field: 'Prop_Date_of_Confirmation', headerText: 'Proposed Date Of Confirmation', width: 230, textAlign: 'center' },
                      // { field: 'Resignation_Submitted', headerText: 'Resignation Submitted', width: 250, textAlign: 'center' },
                       { field: 'PF_Number', headerText: 'PF Number', width: 200, textAlign: 'center' },
                       { field: 'PAN_Number', headerText: 'PAN Number', width: 200, textAlign: 'center' },
                       { field: 'Aadhar_Number', headerText: 'AADHAAR Number', width: 220, textAlign: 'center' },
                       { field: 'Ref_Key1', headerText: 'Reference Key1', width: 200, textAlign: 'center' },
                       { field: 'Ref_Key2', headerText: 'Reference Key2', width: 200, textAlign: 'center' },
                       { field: 'SCB_Account_Number', headerText: 'Bank A/C No 1', width: 200, textAlign: 'center' },
                       { field: 'ICICI_Account_Number', headerText: 'Bank A/C No 2', width: 200, textAlign: 'center' },
                       { field: 'Address', headerText: 'Address Line 1', width: 200, textAlign: 'center' },
                       { field: 'Address2', headerText: 'Address Line 2', width: 200, textAlign: 'center' },
                       { field: 'Address3', headerText: 'Address Line 3', width: 200, textAlign: 'center' },
                       { field: 'State_Name', headerText: 'State', width: 200, textAlign: 'center' },
                       { field: 'City_Name', headerText: 'City', width: 200, textAlign: 'center' },
                       { field: 'Pincode', headerText: 'Pincode', width: 200, textAlign: 'center' },
                       { field: 'Mobile', headerText: 'Mobile', width: 200, textAlign: 'center' },
                       { field: 'Phone', headerText: 'Phone', width: 200, textAlign: 'center' },
                       { field: 'Email_Id', headerText: 'Email', width: 200, textAlign: 'center' },
                       { field: 'Blood_Group_Name', headerText: 'Blood Group', width: 200, textAlign: 'center' },
                       { field: 'Employee_Photo', headerText: 'Employee Photo', width: 200, textAlign: 'center' },
                       //{ field: 'Resignation_Date', headeText: 'Resignation Date',width:200,textAlign:'center' },
                       //{ field: 'Employee_Entity_Type', headerText: 'Employee Type', width: 200, textAlign: 'center' },
                ],
                queryCellInfo: queryCellInfo,
            });
            grid.appendTo('#dvEmpDetails');

            var style = $("#customSyncStyle").html();
            $("#customSyncStyle").html(style);

            var secgrid = new ej.grids.Grid({
                dataSource: result.Data,
                // rowSelected: fnRowSelected,
                showColumnChooser: true,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                allowExcelExport: true,
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['ExcelExport', 'Search', 'ColumnChooser'],

                aggregates: [],
                columns: [
                       { field: 'Employee_Name', headerText: 'Employee Name', width: 250, textAlign: 'center' },
                       { field: 'Gender', headerText: 'Gender', width: 150, textAlign: 'center' },
                       { field: 'Date_Of_Birth', headerText: 'Date Of Birth', width: 200, textAlign: 'center' },
                       { field: 'Employee_Number', headerText: 'Employee Number', width: 230, textAlign: 'center' },
                       { field: 'Department_Name', headerText: 'Department', width: 200, textAlign: 'center' },
                       //{ field: 'Resume_Given', headerText: 'Resume Given', width: 200, textAlign: 'center' },
                       //{ field: 'EDN_Proof', headerText: 'EDN Proof', width: 200, textAlign: 'center' },
                      // { field: 'Salary_Proof', headerText: 'Salary Proof', width: 180, textAlign: 'center' },
                      // { field: 'Appointed', headerText: 'Appointed', width: 170, textAlign: 'center' },
                       { field: 'Date_of_Joining', headerText: 'Date Of Joining', width: 200, textAlign: 'center' },
                       { field: 'Confirmation_Date', headerText: 'Date Of Confirmation', width: 230, textAlign: 'center' },
                       { field: 'Prop_Date_of_Confirmation', headerText: 'Proposed Date Of Confirmation', width: 230, textAlign: 'center' },
                      // { field: 'Resignation_Submitted', headerText: 'Resignation Submitted', width: 250, textAlign: 'center' },
                       { field: 'PF_Number', headerText: 'PF Number', width: 200, textAlign: 'center' },
                       { field: 'PAN_Number', headerText: 'PAN Number', width: 200, textAlign: 'center' },
                       { field: 'Aadhar_Number', headerText: 'AADHAAR Number', width: 220, textAlign: 'center' },
                       { field: 'Ref_Key1', headerText: 'Reference Key1', width: 200, textAlign: 'center' },
                       { field: 'Ref_Key2', headerText: 'Reference Key2', width: 200, textAlign: 'center' },
                       { field: 'SCB_Account_Number', headerText: 'Bank A/C No 1', width: 200, textAlign: 'center' },
                       { field: 'ICICI_Account_Number', headerText: 'Bank A/C No 2', width: 200, textAlign: 'center' },
                       { field: 'Address', headerText: 'Address Line 1', width: 200, textAlign: 'center' },
                       { field: 'Address2', headerText: 'Address Line 2', width: 200, textAlign: 'center' },
                       { field: 'Address3', headerText: 'Address Line 3', width: 200, textAlign: 'center' },
                       { field: 'State_Name', headerText: 'State', width: 200, textAlign: 'center' },
                       { field: 'City_Name', headerText: 'City', width: 200, textAlign: 'center' },
                       { field: 'Pincode', headerText: 'Pincode', width: 200, textAlign: 'center' },
                       { field: 'Mobile', headerText: 'Mobile', width: 200, textAlign: 'center' },
                       { field: 'Phone', headerText: 'Phone', width: 200, textAlign: 'center' },
                       { field: 'Email_Id', headerText: 'Email', width: 200, textAlign: 'center' },
                        //{ field: 'Resignation_Date', headeText: 'Resignation Date', width: 200, textAlign: 'center' },

                       //{ field: 'Employee_Entity_Type', headerText: 'Employee Type', width: 200, textAlign: 'center' },
                ],
                queryCellInfo: queryCellInfo,
            });
            grid.toolbarClick = function (args) {
                if (args['item'].id === 'dvEmpDetails_excelexport') {
                    secgrid.excelExport();
                }
            }

            secgrid.appendTo('#dvEmpDetailshidden');
            // }
        },
        error: function () {
            $("#dvTab").unblock();
        },
        complete: function () {
            $("#dvTab").unblock();
        }
    });
}
// Start For All Inactive employee in employee master page

function fnGetEmpInactiveDetails(pageNumber) {
    debugger;
    var empName = "";
    $('#dvInactiveEmpDetails').html('');
    $("#dvExcelExport").html('');
    if ($.trim($("#txtInactiveEmpSearch").val()) != '') {
        empName = $.trim($("#txtInactiveEmpSearch").val());
    }
    $('#dvTab').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetAllEmployeeInactiveDetails',
        data: "pageNumber=" + pageNumber + "&excelDownload=true&empName=" + empName,
        async: false,
        success: function (result) {
            debugger
            //   if (result != '') {
            //if (result.split('$').length > 1) {
            //    $("#dvInactiveEmpDetails").html(result.split('$')[0]);
            //    $("#dvInactiveExcelExport").html(result.split('$')[2]);
            //}
            var grid = new ej.grids.Grid({
                dataSource: result.Data,
                // rowSelected: fnRowSelected,
                showColumnChooser: true,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                allowExcelExport: true,
                height: 300,
                frozenColumns: 2,
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['ExcelExport', 'Search', 'ColumnChooser'],

                aggregates: [],
                columns: [
                       { headerText: 'Change Status', template: "<a href=#;>Change</a>", width: 170, textAlign: 'center' },
                       { field: 'Employee_Name', headerText: 'Employee Name', width: 250, textAlign: 'center' },
                       { field: 'Gender', headerText: 'Gender', width: 150, textAlign: 'center' },
                       { field: 'Date_Of_Birth', headerText: 'Date Of Birth', width: 200, textAlign: 'center' },
                       { field: 'Employee_Number', headerText: 'Employee Number', width: 230, textAlign: 'center' },
                       { field: 'Department_Name', headerText: 'Department', width: 200, textAlign: 'center' },
                      // { field: 'Resume_Given', headerText: 'Resume Given', width: 200, textAlign: 'center' },
                      // { field: 'EDN_Proof', headerText: 'EDN Proof', width: 200, textAlign: 'center' },
                      // { field: 'Salary_Proof', headerText: 'Salary Proof', width: 180, textAlign: 'center' },
                      // { field: 'Appointed', headerText: 'Appointed', width: 170, textAlign: 'center' },
                       { field: 'Date_of_Joining', headerText: 'Date Of Joining', width: 200, textAlign: 'center' },
                       { field: 'Confirmation_Date', headerText: 'Date Of Confirmation', width: 230, textAlign: 'center' },
                       { field: 'Prop_Date_of_Confirmation', headerText: 'Proposed Date Of Confirmation', width: 230, textAlign: 'center' },
                       //{ field: 'Resignation_Submitted', headerText: 'Resignation Submitted', width: 250, textAlign: 'center' },
                       { field: 'PF_Number', headerText: 'PF Number', width: 200, textAlign: 'center' },
                       { field: 'PAN_Number', headerText: 'PAN Number', width: 200, textAlign: 'center' },
                       { field: 'Aadhar_Number', headerText: 'AADHAAR Number', width: 220, textAlign: 'center' },
                       { field: 'Ref_Key1', headerText: 'Reference Key1', width: 200, textAlign: 'center' },
                       { field: 'Ref_Key2', headerText: 'Reference Key2', width: 200, textAlign: 'center' },
                       { field: 'SCB_Account_Number', headerText: 'Bank A/C No 1', width: 200, textAlign: 'center' },
                       { field: 'ICICI_Account_Number', headerText: 'Bank A/C No 2', width: 200, textAlign: 'center' },
                       { field: 'Address', headerText: 'Address Line 1', width: 200, textAlign: 'center' },
                       { field: 'Address2', headerText: 'Address Line 2', width: 200, textAlign: 'center' },
                       { field: 'Address3', headerText: 'Address Line 3', width: 200, textAlign: 'center' },
                       { field: 'State_Name', headerText: 'State', width: 200, textAlign: 'center' },
                       { field: 'City_Name', headerText: 'City', width: 200, textAlign: 'center' },
                       { field: 'Pincode', headerText: 'Pincode', width: 200, textAlign: 'center' },
                       { field: 'Mobile', headerText: 'Mobile', width: 200, textAlign: 'center' },
                       { field: 'Phone', headerText: 'Phone', width: 200, textAlign: 'center' },
                       { field: 'Email_Id', headerText: 'Email', width: 200, textAlign: 'center' },
                       { field: 'Resignation_Date', headerText: 'Resignation Date', width: 200, textAlign: 'center' },
                       { field: 'Blood_Group_Name', headerText: 'Blood Group', width: 200, textAlign: 'center' },
                       { field: 'Employee_Photo', headerText: 'Employee Photo', width: 200, textAlign: 'center' },
                       //{ field: 'Employee_Entity_Type', headerText: 'Employee Type', width: 200, textAlign: 'center' },
                ],
                queryCellInfo: queryCellInfo,
            });
            grid.appendTo('#dvInactiveEmpDetails');

            var style = $("#customSyncStyleInactive").html();
            $("#customSyncStyleInactive").html(style);
            var secgrid = new ej.grids.Grid({
                dataSource: result.Data,
                // rowSelected: fnRowSelected,                 
                showColumnChooser: true,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                allowExcelExport: true,
                pageSettings: { pageSize: 100, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['ExcelExport', 'Search', 'ColumnChooser'],

                aggregates: [],
                columns: [
                       { field: 'Employee_Name', headerText: 'Employee Name', width: 250, textAlign: 'center' },
                       { field: 'Gender', headerText: 'Gender', width: 150, textAlign: 'center' },
                       { field: 'Date_Of_Birth', headerText: 'Date Of Birth', width: 200, textAlign: 'center' },
                       { field: 'Employee_Number', headerText: 'Employee Number', width: 230, textAlign: 'center' },
                       { field: 'Department_Name', headerText: 'Department', width: 200, textAlign: 'center' },

                       // columns removed

                       //{ field: 'Resume_Given', headerText: 'Resume Given', width: 200, textAlign: 'center' },
                       //{ field: 'EDN_Proof', headerText: 'EDN Proof', width: 200, textAlign: 'center' },
                      // { field: 'Salary_Proof', headerText: 'Salary Proof', width: 180, textAlign: 'center' },
                       //{ field: 'Appointed', headerText: 'Appointed', width: 170, textAlign: 'center' },
                       { field: 'Date_of_Joining', headerText: 'Date Of Joining', width: 200, textAlign: 'center' },
                       { field: 'Confirmation_Date', headerText: 'Date Of Confirmation', width: 230, textAlign: 'center' },
                       { field: 'Prop_Date_of_Confirmation', headerText: 'Proposed Date Of Confirmation', width: 230, textAlign: 'center' },
                      // { field: 'Resignation_Submitted', headerText: 'Resignation Submitted', width: 250, textAlign: 'center' },
                       { field: 'PF_Number', headerText: 'PF Number', width: 200, textAlign: 'center' },
                       { field: 'PAN_Number', headerText: 'PAN Number', width: 200, textAlign: 'center' },
                       { field: 'Aadhar_Number', headerText: 'AADHAAR Number', width: 220, textAlign: 'center' },
                       { field: 'Ref_Key1', headerText: 'Reference Key1', width: 200, textAlign: 'center' },
                       { field: 'Ref_Key2', headerText: 'Reference Key2', width: 200, textAlign: 'center' },
                       { field: 'SCB_Account_Number', headerText: 'Bank A/C No 1', width: 200, textAlign: 'center' },
                       { field: 'ICICI_Account_Number', headerText: 'Bank A/C No 2', width: 200, textAlign: 'center' },
                       { field: 'Address', headerText: 'Address Line 1', width: 200, textAlign: 'center' },
                       { field: 'Address2', headerText: 'Address Line 2', width: 200, textAlign: 'center' },
                       { field: 'Address3', headerText: 'Address Line 3', width: 200, textAlign: 'center' },
                       { field: 'State_Name', headerText: 'State', width: 200, textAlign: 'center' },
                       { field: 'City_Name', headerText: 'City', width: 200, textAlign: 'center' },
                       { field: 'Pincode', headerText: 'Pincode', width: 200, textAlign: 'center' },
                       { field: 'Mobile', headerText: 'Mobile', width: 200, textAlign: 'center' },
                       { field: 'Phone', headerText: 'Phone', width: 200, textAlign: 'center' },
                       { field: 'Email_Id', headerText: 'Email', width: 200, textAlign: 'center' },
                       { field: 'Resignation_Date', headerText: 'Resignation Date', width: 200, textAlign: 'center' },
                       //{ field: 'Employee_Entity_Type', headerText: 'Employee Type', width: 200, textAlign: 'center' },
                ],
                queryCellInfo: queryCellInfo,
            });
            grid.toolbarClick = function (args) {
                if (args['item'].id === 'dvInactiveEmpDetails_excelexport') {
                    secgrid.excelExport();
                }
            }

            secgrid.appendTo('#dvInactiveEmpDetailshidden');
            // }
        },
        error: function () {
            $("#dvTab").unblock();
        },
        complete: function () {
            $("#dvTab").unblock();
        }
    });
}

function queryCellInfo(args) {
    if (args.column.headerText == "Appointed") {
        if (args.data.Appointed == 0) {
            args.cell.innerHTML = "NO";
        }
        else {
            args.cell.innerHTML = "YES";
        }
    }
    if (args.column.headerText == "Resume Given") {
        if (args.data.Resume_Given == 0) {
            args.cell.innerHTML = "NO";
        }
        else {
            args.cell.innerHTML = "YES";
        }
    }
    if (args.column.headerText == "EDN Proof") {
        if (args.data.EDN_Proof == 0) {
            args.cell.innerHTML = "NO";
        }
        else {
            args.cell.innerHTML = "YES";
        }
    }
    if (args.column.headerText == "Salary Proof") {
        if (args.data.Salary_Proof == 0) {
            args.cell.innerHTML = "NO";
        }
        else {
            args.cell.innerHTML = "YES";
        }
    }
    if (args.column.headerText == "Resignation Submitted") {
        if (args.data.Resignation_Submitted == 0) {
            args.cell.innerHTML = "NO";
        }
        else {
            args.cell.innerHTML = "YES";
        }
    }
    if (args.column.headerText == "Pincode") {
        if (args.data.Pincode == 0) {
            args.cell.innerHTML = " ";
        }
    }
    if (args.column.headerText == "Edit") {
        if (args.data.Employee_Status == 0) {
            if (args.cell.innerText == "[Edit]") {
                //args.cell.style.cursor = "pointer";
                //args.cell.style.color = "blue";
                args.cell.style.cursor = "pointer";
                //args.cell.style.textDecoration = "underline";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnEditEmpDetails(" + args.data.Employee_Code + ")'>Edit</a>"
            }

            $(args.cell).bind("click", function () {
                fngetABloodgroupnames();

                fnEditEmpDetails(args.data.Employee_Code);

            })
        } else {
            if (args.cell.innerText == "[Edit]") {
                //args.cell.style.cursor = "pointer";
                //args.cell.style.color = "blue";
                args.cell.style.cursor = "pointer";
                //args.cell.style.textDecoration = "underline";
                args.cell.innerHTML = "<a></a>"
            }
        }
    } else if (args.column.headerText == "Change Status") {

        if (args.cell.innerText == "[Change Status]") {
            //args.cell.style.cursor = "pointer";
            //args.cell.style.color = "blue";
            args.cell.style.cursor = "pointer";
            //args.cell.style.textDecoration = "underline";
            args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnStatuschange(" + args + ")'>Change Status</a>"
        }
        else {
            if (args.cell.innerText == "[Change]") {
                if (args.data.User_Status == 1) {
                    args.cell.style.cursor = "pointer";
                    args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnStatuschange(" + args + ")'>Change Status </a>"
                }
                else {
                    args.cell.innerHTML = "<a></a>"
                }

            }

        }

        $(args.cell).bind("click", function () {

            fnStatuschange(args);

        })
    }
}

function fnStatuschange(val) {
    debugger;

    //UpdateEmployeeStatus
    var employeeCode = val.data.Employee_Code;
    var employeeStatus = val.data.Employee_Status;
    var userStatus = val.data.User_Status;
    var empstatus = "";
    if (employeeStatus == "1") {
        if (userStatus == "1") {
            empstatus = "0";
        }
        else if (userStatus == "0") {
            fnMsgAlert('info', 'Info', 'Status of the selected Employee cannot be changed since User status is inactive');
            return false;
        }
        else {
            empstatus = "0";
        }
    }
    else {
        empstatus = "1";
    }
    if (confirm("Do you want to change the status of this Employee?")) {
        fnStatusChange(val);
        emplycode = employeeCode;
        emplystatus = empstatus;
        userstatus = userStatus;
    }
}

function fnChangeStatus() {
    debugger;
    var employeeCode = emplycode;
    var userStatus = userstatus;
    var empstatus = emplystatus;
    userstatus

    //var employeeCode = val.data.Employee_Code;
    //var employeeStatus = val.data.Employee_Status;
    //var userStatus = val.data.User_Status;
    //var empstatus = "";

    $("#dvTab").block();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/UpdateEmployeeStatus',
        data: "employeeCode=" + employeeCode + "&employeeStatus=" + empstatus,
        success: function (result) {
            if (result == "1") {

                fnGetEmpDetails(1);
                fnGetEmpInactiveDetails(1);
                fnMsgAlert('success', 'Success', 'Employee Status changed successfully');

            }
            else {
                fnMsgAlert('info', 'Error', 'Failed to change the Employee Status');
            }
        },
        error: function () {
            $("#dvTab").unblock();
        },
        complete: function () {
            $("#dvTab").unblock();
        }
    });
    var obj = {
        Company_Code: Company_Code,
        EmployeeCode: employeeCode,
        EmployeeStatus: empstatus,
        Updated_By: Logged_User_Code,
    }

    KangleIntegration.requestInvoke("UserMigration", "UpdateEmployeeStatusHiDoctor", obj, "POST");
    //}
}

function fnStatusChange(val) {
    debugger;
    $('#dvEmpDetails').hide();
    $('#dvInactiveEmp').hide();
    $('#EmpRemarks').show();

    var employeeCode = val.data.Employee_Code;
    empcode = employeeCode;

}
function fnStatusSave() {
    debugger;

    empcode;
    var employeeCode = empcode;
    var useCode = Logged_User_Code;
    var status = emplystatus

    if ($('#remarks').val() == '') {
        fnMsgAlert('info', 'Error', 'Please enter the Remarks');
        return false;
    }
    $('#dvEmpDetails').show();
    $('#dvInactiveEmp').show();
    var Remark = $('#remarks').val()

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/InsertRemarks',
        data: "employeeCode=" + employeeCode + "&Remarks=" + Remark + "&User_Code=" + useCode + "&Status=" + status,
        success: function (result) {
            $('#remarks').val('');

            $('#EmpRemarks').hide();
            fnChangeStatus();


        },
        error: function () {

        }
    });
}
//function fnChangeStatus(val) {
//    //alert("hello");
//    
//    var regionClassificationCode = val.data.Region_Classification_Code;
//    var regionClassificationname = val.data.Region_Classification_Name;
//    var changeStatus = val.data.Record_Status;
//    $("#divRegionType").html("");
//    $.ajax({
//        type: "POST",
//        url: '../HiDoctor_Master/RegionCategoryMaster/regionclassificationchangestatus',
//        data: "regionClassificationCode=" + regionClassificationCode + "&regionClassificationname=" + regionClassificationname + "&changeStatus=" + changeStatus,
//        success: function (result) {
//            if (result.split(":")[0].toString() == "SUCCESS") {
//                fnMsgAlert('success', 'Region Classification Master', result.split(":")[1].toString());
//            }
//            if (result.split(":")[0].toString() == "INFO") {
//                fnMsgAlert('info', 'Region Classification Master', result.split(":")[1].toString());
//            }
//            if (result.split(":")[0].toString() == "ERROR") {
//                fnMsgAlert('error', 'Region Classification Master', result.split(":")[1].toString());
//            }
//            HideModalPopup("dvloading");
//            //    fnfillRegionTypeGrid();
//            fnGetRegionCategory();
//            $('option', $("#ddlUnderRegion")).remove()
//            fnUnderRegion();
//        }
//    });
//}

function fnInActEmpChangeStatus(employeeCode) {
    //UpdateEmployeeStatus
    var employeeCode = val.data.Employee_Code;
    var changeStatus = val.data.Employee_Status;
    var empstatus = "";
    if (status == "1") {
        empstatus = "0";
    }
    else {
        empstatus = "1";
    }
    if (confirm("Do you want to change the status of this employee?")) {

        $("#dvTab").block();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/User/UpdateEmployeeStatus',
            data: "employeeCode=" + employeeCode + "&employeeStatus=" + empstatus,
            success: function (result) {
                if (result == "1") {
                    fnGetEmpDetails(1);
                    fnGetEmpInactiveDetails(1);
                    fnMsgAlert('success', 'Success', 'Employee status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Error', 'Failed to change the Employee Status');
                }
            },
            error: function () {
                $("#dvTab").unblock();
            },
            complete: function () {
                $("#dvTab").unblock();
            }
        });
    }
}

// End For All Inactive employee in employee master page

function fnDeleteEmpDetails(employeeCode, userCode, userName, obj) {
    var resDate = "";
    if (userCode == "") {
        if (confirm("Do you want to delete this employee?")) {
            $('#dvTab').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });

            $.ajax({
                type: 'POST',
                url: '../HiDoctor_Master/User/DeleteEmployee',
                data: "employeeCode=" + employeeCode + "&userCode=" + userCode + "&resignationDate=" + resDate + "",
                success: function (result) {
                    if (result != '') {
                        if (result.split(':')[0] == "SUCCESS") {
                            fnGetEmpDetails(1);
                            //var parent = $(obj).parent().parent();
                            //parent.fadeOut('slow', function () { });
                            fnMsgAlert('success', 'Success', 'Employee deleted successfully');
                        }
                        else {
                            fnMsgAlert('info', 'Error', 'Sorry error occured while Deleting the Employee');
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Error', 'Sorry error occured while Deleting the Employee');
                    }
                },
                error: function () {
                    $("#dvTab").unblock();
                },
                complete: function () {
                    $("#dvTab").unblock();
                }
            });
        }
    }
    else {
        empUserCode_g = userCode;
        empUserName_g = userName;
        $.msgAlert({
            type: 'warning'
            , title: 'Delete'
            , text: 'If you delete this employee the corresponding user also will be deleted. Still do you want to delete?'
            , callback: function () {
                $('#dvTab').block({
                    message: '<h3>Binding the employee details</h3>',
                    css: { border: '2px solid #ddd' }
                });

                $.ajax({
                    url: '../HiDoctor_Master/Master/GetChildUsers/',
                    type: "POST",
                    data: "UserCode=" + userCode + "",
                    success: function (jsData) {
                        jsData = eval('(' + jsData + ')');
                        if (jsData.Tables[0].Rows.length > 1) {
                            var users = "Dear " + $("#spnUser").html().split(',')[0] + " ,You can not delete this employee.<br/> because following user(s) are reporting to him.<br/>";
                            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                                if (userCode != jsData.Tables[0].Rows[i].User_Code) {
                                    users += jsData.Tables[0].Rows[i].User_Name + "(" + jsData.Tables[0].Rows[i].User_Type_Name + ") <br/>";
                                }
                            }
                            $("#dvUserContent").html(users);
                            $("#dvDisUserCount").dialog({
                                resizable: true,
                                height: 300,
                                modal: true,
                                buttons: {
                                    Cancel: function () {
                                        $(this).dialog("close");
                                    }
                                }
                            });
                        }
                        else {
                            $("#dvTab").unblock();
                            $("#dvAjaxLoad").show();
                            $("#dvDisableUser").overlay().load();
                        }
                    },
                    error: function () {
                        $("#dvTab").unblock();
                    },
                    complete: function () {
                        $("#dvTab").unblock();
                    }
                });

            }
        });
    }
}

function fnUserDelete() {
    if (confirm("If you delete this employee then corresponding user also will be deleted. Still do you want to continue?")) {

        $("#dvTab").unblock();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/User/DeleteEmployee',
            data: "A",
            success: function (result) {
                if (result != '') {
                    if (result.split(':')[0] == "SUCCESS") {
                        var parent = $(obj).parent().parent();
                        parent.fadeOut('slow', function () { });
                        fnMsgAlert('success', 'Success', 'Employee deleted successfully');
                    }
                    else {
                        fnMsgAlert('info', 'Error', 'Sorry error occured while delete the employee');
                    }
                }
                else {
                    fnMsgAlert('info', 'Error', 'Sorry error occured while delete the employee');
                }
            },
            error: function () {
                $("#dvTab").unblock();
            },
            complete: function () {
                $("#dvTab").unblock();
            }
        });
    }
}

function fnEditEmpDetails(employeeCode) {
    debugger;
    if (EmployeeJson_g != null && EmployeeJson_g != '') {
        var disJson = jsonPath(EmployeeJson_g, "$.[?(@.Employee_Code=='" + employeeCode + "')]");
        EditEmp = disJson;
        if (disJson != false) {
            $("#txtEmployeeName").val(disJson[0].Employee_Name);
            $("input[name=rdGender][value=" + disJson[0].Gender + "]").attr('checked', 'checked');
            // $('input:radio[name=rdGender]:checked').val(disJson[0].Gender) ;
            if (disJson[0].Date_Of_Birth == '01/01/1900') {
                $('#txtDOB').val('');
            }
            else {
                $('#txtDOB').val(disJson[0].Date_Of_Birth);
            }
            if (disJson[0].Date_of_Joining == '01/01/1900') {
                $('#txtDOJ').val('');//
            }
            else {
                $("#txtDOJ").val(disJson[0].Date_of_Joining);
            }
            if (disJson[0].Confirmation_Date == '01/01/1900') {
                $('#txtDOC').val('');
            }
            else {
                $("#txtDOC").val(disJson[0].Confirmation_Date);
            }
            $("#txtAddress").val(disJson[0].Address);
            $("#txtAddress2").val(disJson[0].Address2);
            $("#txtAddress3").val(disJson[0].Address3);
            $("#txtPhone").val(disJson[0].Phone);
            $("#txtMobile").val(disJson[0].Mobile);
            $("#txtEmail").val(disJson[0].Email_Id);
            $("#txtEmployeeNumber").val(disJson[0].Employee_Number)
            $("input[name=rdEDN][value=" + disJson[0].EDN_Proof + "]").attr('checked', 'checked');
            // $('input:radio[name=rdEDN]:checked').val(disJson[0].EDN_Proof) ;
            $("input[name=rdSalary][value=" + disJson[0].Salary_Proof + "]").attr('checked', 'checked');
            //  $('input:radio[name=rdSalary]:checked').val(disJson[0].Salary_Proof) ;
            $("input[name=rdResumeGiven][value=" + disJson[0].Resume_Given + "]").attr('checked', 'checked');
            // $('input:radio[name=rdResumeGiven]:checked').val(disJson[0].Resume_Given);
            $("input[name=rdResignationSubmitted][value=" + disJson[0].Resignation_Submitted + "]").attr('checked', 'checked');
            //$('input:radio[name=rdResignationSubmitted]:checked').val(disJson[0].Resignation_Submitted);
            $("input[name=rdAppointed][value=" + disJson[0].Appointed + "]").attr('checked', 'checked');
            //$('input:radio[name=rdAppointed]:checked').val(disJson[0].Appointed);
            $("#txtAcc1").val(disJson[0].SCB_Account_Number);
            $("#txtAcc2").val(disJson[0].ICICI_Account_Number);
            $("#txtPFNumber").val(disJson[0].PF_Number);
            $("#txtPANNumber").val(disJson[0].PAN_Number);
            var Aadhar = '';
            Aadhar = disJson[0].Aadhar_Number;
            Eaadhaar = Aadhar;
            var first = Aadhar.substring(0, 4);
            var second = Aadhar.substring(4, 8);
            var third = Aadhar.substring(8, 12);
            $("#txtAADHAARnumberbox_1").val(first);
            $("#txtAADHAARnumberbox_2").val(second);
            $("#txtAADHAARnumberbox_3").val(third);
            $("input[name=rdEntity][value=" + disJson[0].Employee_Entity_Type + "]").attr('checked', 'checked');
            // $('input:radio[name=rdEntity]:checked').val(disJson[0].Employee_Entity_Type);
            $("#hdnEmployeeCode").val(disJson[0].Employee_Code);
            $("#hdnMode").val('EDIT');
            $('#dvTab').tabs('option', 'selected', 0);
            $('#txtDept').val(disJson[0].Department_Id);
            $('#txtState').val(disJson[0].State_ID);

            fnGetCitiesDetails(disJson[0].State_ID);
            fnGetPincodesDetails(disJson[0].City_ID);

            /////   prefil blood group///
            if (disJson[0].Blood_Group_Name != 0 && disJson[0].Blood_Group_Name != null) {
                var doctcode = disJson[0].Blood_Group_Id;
                var msObject = document.getElementById("blooddgrp").ej2_instances[0];
                msObject.value = doctcode;
            }
            else {
                function fngetABloodgroupnames() {
                    debugger;
                    var Company_code = Company_Code;
                    //Company_Code;
                    $.ajax({
                        async: false,
                        url: '../HiDoctor_Master/User/GetBloodgroupName',
                        data: "Company_code=" + Company_code,
                        type: "GET",
                        async: false,
                        success: function (resp) {
                            debugger;
                            $('#dvbldgroup').empty();
                            $('#dvbldgroup').html('<input type="text" id="blooddgrp">');
                            var lstUser = [];
                            for (var i = 0; i < resp.length; i++) {
                                _objData = {};
                                _objData.id = resp[i].Blood_Group_Id;
                                _objData.label = resp[i].Blood_Group_Name;
                                lstUser.push(_objData);
                            }
                            // if (lstUser.length > 0) {
                            var UserDetails = lstUser;
                            var atcObj = new ej.dropdowns.DropDownList({
                                //set the data to dataSource property
                                dataSource: lstUser,
                                fields: { text: 'label', value: 'id' },
                                filterBarPlaceholder: 'Search',
                                showClearButton: true,
                                allowFiltering: true,
                                placeholder: 'Select Blood Group',
                                filtering: function (e) {
                                    var dropdown_query = new ej.data.Query();
                                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                    e.updateData(lstUser, dropdown_query);
                                }
                            });
                            atcObj.appendTo('#blooddgrp');
                            //}
                            // }






                        },
                        error: function (e) {
                            fnMsgAlert('info', '', 'Error.' + e.Message);
                        }
                    });

                }

}
          



            if (disJson[0].Employee_Photo != null) {
                var gobfile = '';
                gobfile = disJson[0].Employee_Photo;
                $("#fileUrl").html(disJson[0].Employee_Photo.split('/').reverse()[0]);
            }
            //$("#fileUrl").html(prefillUrl[0].Attachments.split('/').reverse()[0]);

            //$('#fileupload').val(disJson[0].Employee_Photo);
            $('#txtCity').val(disJson[0].City_ID);
            $('#txtPincode').val(disJson[0].Pincode_Id);
            $('#txtDOB').val(disJson[0].Date_Of_Birth);
            $('#txtDOJ').val(disJson[0].Date_of_Joining);
            $('#txtDOC').val(disJson[0].Confirmation_Date);
            $("#txtAddress").val(disJson[0].Address);
            $("#txtAddress2").val(disJson[0].Address2);
            $("#txtAddress3").val(disJson[0].Address3);
            $("#txtPhone").val(disJson[0].Phone);
            $("#txtMobile").val(disJson[0].Mobile);
            $("#txtEmail").val(disJson[0].Email_Id);
            $("#txtEmployeeNumber").val(disJson[0].Employee_Number);
            $("#txtRefKey1").val(disJson[0].Ref_Key1);
            $("#txtRefKey2").val(disJson[0].Ref_Key2);
            if ($('#txtDOJ').val() !='' && $("#txtPDOC").val() == "") {
                fnPrefillDOC($('#txtDOJ').val());
            }
        }
    }
}

//function fnEdit(employeeCode) {
//    if (employeeCode != null) {
//        //var tblRegionCategoryCode = obj.id.replace('E', 'Region_Classification_Code');
//        //var tblRegioncategoryName = obj.id.replace('E', 'Region_Classification_Name');
//        //var tblstatus = val.Status;
//        var EmployeeName = employeeCode.data.Employee_Name;
//        var DateOfBirth = employeeCode.data.Date_Of_Birth;
//        var DateOfJoining = employeeCode.data.Date_of_Joining;
//        var ConfirmationDate = employeeCode.data.Confirmation_Date;
//        var Address = employeeCode.data.Address;
//        var Address2 = employeeCode.data.Address2;
//        var Address3 = employeeCode.data.Address3;
//        var Phone = employeeCode.data.Phone;
//        var Mobile = employeeCode.data.Mobile;
//        var EmailId = employeeCode.data.Email_Id;
//        var EmployeeNumber = employeeCode.data.Employee_Number;
//        var EDNProof = employeeCode.data.EDN_Proof;
//        var Salary = employeeCode.data.Salary_Proof;
//        var Resume = employeeCode.data.Resume_Given;
//        var Resignation = employeeCode.data.Resignation_Submitted;
//        var Appointed = employeeCode.data.Appointed;
//        var Account1 = employeeCode.data.SCB_Account_Number;
//        var Account2 = employeeCode.data.ICICI_Account_Number;
//        var PFNumber = employeeCode.data.PF_Number;
//        var PANNumber = employeeCode.data.PAN_Number;
//        var Ref_Key1 = employeeCode.data.Ref_Key1;
//        var Ref_Key2 = employeeCode.data.Ref_Key2;
//        var tblstatus = employeeCode.data.Record_Status;
//        $("#hdnEmployeeCode").val(employeeCode);
//        $("#txtEmployeeName").val(EmployeeName);
//        $("#txtReference_Key1").val(Ref_Key1);
//        $("#txtReference_Key2").val(Ref_Key2);
//        editflag1 = false;
//        editflag2 = false;
//        //$('#txtReference_Key1').val('');
//        //$('#txtReference_Key2').val('');
//        //$("#txtReference_Key1").val(Reference_Key1);
//        //$('input:radio[name=rdnstatus][value="' + status + '"]').prop('checked', true);
//        $('#dvTab').tabs('option', 'selected', 0);  
//        $("#hdnMode").val('Edit');

//    }
//}
function fnOpenDisableUser() {
    $("#dvDisableUser").load('../HiDoctor_Master/User/DisableUser/?id=EMPLOYEE|' + escape(empUserCode_g + "_" + empUserName_g));
}


function fnGoToPrevPage() {
    var pno = parseInt($('#pageno').html()) - 1;
    fnGetEmpDetails(pno);
}
function fnGoToNextPage() {
    var pno = parseInt($('#pageno').html()) + 1;
    fnGetEmpDetails(pno);
}
function fnGoToPage() {
    var pno = $('#drpPaging :selected').val();
    fnGetEmpDetails(pno);
}

function fnGoToPrevPageEmpInactive() {

    var pno = parseInt($('#Inacivepageno').html()) - 1;
    fnGetEmpInactiveDetails(pno);
}
function fnGoToNextPageEmpInactive() {

    var pno = parseInt($('#Inacivepageno').html()) + 1;
    fnGetEmpInactiveDetails(pno);
}
function fnGoToPageEmpInactive() {

    var pno = $('#EmpInactivedrpPaging :selected').val();
    fnGetEmpInactiveDetails(pno);
}



function fnValidateDate(obj) {
    if ($(obj).val() != '') {
        var result = new Date($(obj).val().split('/')[2] + "-" + $(obj).val().split('/')[1] + "-" + $(obj).val().split('/')[0]);
        if (result == "Invalid Date") {
            $(obj).val('');
            fnMsgAlert('info', 'Validate', 'Please enter valid Date');
            return;
        }
    }
}

////Code Starts
//function validatePhone(obj) {
//    if($.trim($(obj).val()) !='') {
//        var no =$.trim($(obj).val());
//        var filter = /^[0-9-+]+$/;
//        if (filter.test(no)) {
//            return true;
//        }
//        else {
//            return false;
//        }
//    }
//}​
////Code Ends


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

function fnValidatePinCode(obj) {
    if ($.trim($(obj.val)) != '') {
        var pincodePattern = /^\d+$/
        return pincodePattern.test($.trim($(obj).val()));
    }
    return true;
}


//function fnChangeStatus(employeeCode, status, obj) {
//    var id = obj.id;
//    //UpdateEmployeeStatus
//    var empstatus = "";
//    if (status == "1") {
//        empstatus = "0";
//    }
//    else {
//        empstatus = "1";
//    }
//    if (confirm("Do you want to change the status of this Employee?")) {

//        $("#dvTab").block();
//        $.ajax({
//            type: 'POST',
//            url: '../HiDoctor_Master/User/UpdateEmployeeStatus',
//            data: "employeeCode=" + employeeCode + "&employeeStatus=" + empstatus,
//            success: function (result) {
//                if (result == "1") {
//                    fnGetEmpDetails(1);
//                    fnMsgAlert('success', 'Success', 'Employee status changed successfully');
//                }
//                else {
//                    fnMsgAlert('info', 'Error', 'Failed to change the Employee Status');
//                }
//            },
//            error: function () {
//                $("#dvTab").unblock();
//            },
//            complete: function () {
//                $("#dvTab").unblock();
//            }
//        });
//    }
//}





function fnGetStateDetails() {

    $.ajax({
        type: "Get",
        url: '../Hidoctor_Master/User/GetEmpStateDetails',
        data: '',
        async: false,
        success: function (resp) {
            Statelst = resp;
            StatesuccesscallbackBindHTML(resp);


        }
    });
}
function StatesuccesscallbackBindHTML(resp) {
    debugger;
    console.log(resp);
    var drpdwnCont = '';
    drpdwnCont += '<option maxlength="25" style="text-align:left;" value="0">Please Select State</option>';
    if (resp != null && resp != '' & resp.length > 0) {
        for (i = 0; i < resp.length; i++) {
            drpdwnCont += '<option maxlength="25" value="' + resp[i].State_ID + '" style="text-align:left;">' + resp[i].State_Name + '</option>';

        }
    }
    $('#txtState').html(drpdwnCont);
}
function fnInputStateName() {

    var flag = false;
    var statename = $('#txtAddState').val();
    if (statename != '') {
        if (statename.length > 35) {
            fnMsgAlert('info', 'Info', 'State Name excedded 35 characters');
            $('#txtAddState').val('');
            flag = false;
            return;
        }
        var result = regExforAlphaNumeric($.trim($("#txtAddState").val()));
        if (!result) {
            //$("#txtAcc2").attr('title', 'Special characters are not allowed in the Bank account number2');
            //$("#txtAcc2").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Special characters are not allowed when entering State Name');
            $('#txtAddState').val('');
            flag = false;
            return;
        }

        for (i = 0; i < Statelst.length; i++) {
            if (statename.toUpperCase().replace(/[^A-Z0-9]/ig, ' ') == Statelst[i].State_Name.toUpperCase().replace(/[^A-Z0-9]/ig, ' ')) {
                flag = true;
            }
        }
        if (flag == true) {
            fnMsgAlert('info', 'Info', 'State Name already exists');
            $('#txtAddState').val('');
        }
        else {
            fnInsertStateName();
        }
    }
    else {
        fnMsgAlert('info', 'Info', 'Please enter State Name');
        return false;
    }

}


function fnInsertStateName() {
    var statename = $('#txtAddState').val().replace(/[^A-Z0-9]/ig, ' ');
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/InsertNewStateDetails',
        async: false,
        data: 'statename=' + statename,
        success: function () {
            fnMsgAlert('success', 'Success', 'New State is successfully added.');
            $('#txtAddState').val('');
            fnGetStateDetails();
        }
    });
}



function fnGetCitiesDetails(State_Id) {
    debugger;
    if (State_Id != stateID) {
        $('#txtPincode').val(0);
    }
    if (State_Id != undefined && State_Id != "") {
        stateID = State_Id;
    }

    $.ajax({
        type: 'Get',
        url: '../Hidoctor_Master/User/GetEmpCitiesDetails',
        data: "State_Id=" + stateID + "",
        async: false,
        success: function (resp) {
            citylst = resp;
            CitysuccesscallbackBindHTML(resp);
        }
    });
}
function CitysuccesscallbackBindHTML(resp) {
    debugger
    console.log(resp);
    var citydrpdwn = '';
    citydrpdwn += '<option maxlength="25" style="text-align:left;"value="0">Please Select City</option>';
    if (resp != null && resp != '' && resp.length > 0) {
        for (i = 0; i < resp.length; i++) {
            citydrpdwn += '<option maxlength="25" value="' + resp[i].City_ID + '" style="text-align:left;">' + resp[i].City_Name + '</option>';
        }
    }
    $('#txtCity').html(citydrpdwn);
}


function fnInputCityName() {

    if (stateID == 0) {
        fnMsgAlert('info', 'Info', 'Please select a State to Add new City.');
        return false;
    }
    var flag = false;
    var cityname = $('#txtAddCity').val();
    if (cityname != '') {


        var result = regExforAlphaNumeric($.trim($("#txtAddCity").val()));
        if (!result) {

            fnMsgAlert('info', 'Info', 'Special characters are not allowed in City Name');
            $('#txtAddCity').val('');
            flag = false;
            return;
        }
        if (cityname.length > 35) {
            fnMsgAlert('info', 'Info', 'City Name exceeded 35 characters');
            $('#txtAddCity').val('');
            flag = false;
            return;
        }

        for (i = 0; i < citylst.length; i++) {
            if (cityname.toUpperCase().replace(/[^A-Z0-9]/ig, ' ') == citylst[i].City_Name.toUpperCase().replace(/[^A-Z0-9]/ig, ' ')) {
                flag = true;
            }
        }
        if (flag == true) {
            fnMsgAlert('info', 'Info', 'City Name already exists');
            $('#txtAddCity').val('');
        }
        else {

            fnInsertCityName();
        }
    }
    else {
        fnMsgAlert('info', 'Info', 'Please enter City Name');
        return false;
    }
}

function fnInsertCityName() {
    var cityname = $('#txtAddCity').val().replace(/[^A-Z0-9]/ig, ' ');
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/InsertNewCityDetails',
        data: "cityname=" + cityname + "&state_Id=" + stateID,
        async: false,
        success: function () {
            fnMsgAlert('success', 'Success', 'New City is successfully added for the selected State.');
            $('#txtAddCity').val('');
            fnGetCitiesDetails();
        }

    });

}
function fnGetPincodesDetails(City_Id) {


    if (City_Id != undefined && City_Id != "") {
        cityID = City_Id;
    }

    $.ajax({
        type: 'Get',
        url: '../Hidoctor_Master/User/GetPincodeDetails',
        data: "State_Id=" + stateID + "&City_Id=" + cityID,
        async: false,
        success: function (resp) {
            pincodelst = resp;
            PincodesuccesscallbackBindHTML(resp);
        }
    });

}
function PincodesuccesscallbackBindHTML(resp) {
    var pincodedrpdwn = '';
    pincodedrpdwn += '<option maxlength="25" style="text-align:left;"value="0">Please Select Pincode</option>';
    if (resp != null && resp != '' && resp.length > 0) {
        for (i = 0; i < resp.length; i++) {
            pincodedrpdwn += '<option maxlength="25" value="' + resp[i].Pincode_Id + '" style="text-align:left;">' + resp[i].Pincode + '</option>';
        }
    }
    $('#txtPincode').html(pincodedrpdwn);
}
function fnInputPincode() {


    if (stateID == 0 && cityID == 0 || cityID == 0) {
        fnMsgAlert('info', 'Info', 'Please select State & City to add new Pincode.');
        return false;
    }
    var flag = false;
    var pincode = $('#txtAddPincode').val();
    if (pincode == '') {
        fnMsgAlert('info', 'Info', 'Please enter Pincode');
        return false;
    }
    for (i = 0; i < pincodelst.length; i++) {
        if (pincode == pincodelst[i].Pincode) {
            flag = true;
        }
    }
    if (flag == true) {
        fnMsgAlert('info', 'Info', 'Entered Pincode already exists');
        $('#txtAddPincode').val('');
    }
    else {
        fnInsertPincode();
    }
}


function fnInsertPincode() {
    debugger;
    var pincode = $('#txtAddPincode').val();

    if (pincode.length < 6) {
        fnMsgAlert('info', 'Info', 'Pincode should atleast have 6 digits');
        return false;
    }
    if (pincode.length > 10) {
        fnMsgAlert('info', 'Info', 'Pincode can only have 10 digits');
        return false;
    }
    var flag = true;
    var result = fnValidatePinCode($("#txtAddPincode"));
    if (!result) {
        fnMsgAlert('info', 'Info', 'Pincode allows only numbers');
        $('#txtAddPincode').val('');
        flag = false;
        return;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/InsertPincode',
        data: "Pincode=" + pincode + "&state_Id=" + stateID + "&cityID=" + cityID,
        async: false,
        success: function () {
            fnMsgAlert('success', 'Success', 'New Pincode is successfully added for the Selected State & City.');
            $('#txtAddPincode').val('');
            fnGetPincodesDetails();
        }

    });
}
function fnGetDepartmentDetails() {
    $.ajax({
        type: "Get",
        url: '../Hidoctor_Master/User/GetDepartmentDetails',
        data: '',
        success: function (resp) {
            Deptlst = resp;
            DepartmentsuccesscallbackBindHTML(resp);
        }
    });
}
function DepartmentsuccesscallbackBindHTML(resp) {
    var deptdrpdwn = '';
    deptdrpdwn += '<option maxlength="25" style="text-align:left;"value="0">Please Select Department</option>';
    if (resp != null && resp != '' && resp.length > 0) {
        for (i = 0; i < resp.length; i++) {
            deptdrpdwn += '<option maxlength="25" value="' + resp[i].Department_Id + '" style="text-align:left;">' + resp[i].Department_Name + '</option>';
        }
    }
    $('#txtDept').html(deptdrpdwn);
}
function fnInputDeptDetails() {

    var flag = false;
    var deptInp = $('#txtAdddept').val();
    if (deptInp == '') {
        fnMsgAlert('info', 'Info', 'Please enter Department Name');
        return false;
    }
    if (deptInp != '') {
        if (deptInp.length > 35) {
            fnMsgAlert('info', 'Info', 'Department Name cannot exceed 35 characters');
            $('#txtAdddept').val('');
            flag = false;
            return;
        }
    }
    var result = regExforAlphaNumeric($.trim($("#txtAdddept").val()));
    if (!result) {
        //$("#txtAcc2").attr('title', 'Special characters are not allowed in the Bank account number2');
        //$("#txtAcc2").addClass('errorIndicator');
        //flag = false;
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in Department Name');
        $('#txtAdddept').val('');
        flag = false;
        return;
    }
    for (i = 0; i < Deptlst.length; i++) {
        if (deptInp.toUpperCase().replace(/[^A-Z0-9]/ig, ' ') == Deptlst[i].Department_Name.toUpperCase().replace(/[^A-Z0-9]/ig, ' ')) {
            flag = true;
        }
    }
    if (flag == true) {
        fnMsgAlert('info', 'Info', 'Entered Department already exists');
        $('#txtAdddept').val('');
        flag = false;
        return;
    }
    else {
        fnInsertDepartment();
    }
}
function fnInsertDepartment() {
    var txtdept = $('#txtAdddept').val();
    var deptInp = txtdept.replace(/[^A-Z0-9]/ig, ' ');
    if (deptInp != '') {

        var result = regExforAlphaNumeric($.trim($("#txtAdddept").val()));
        if (!result) {
            //$("#txtAcc2").attr('title', 'Special characters are not allowed in the Bank account number2');
            //$("#txtAcc2").addClass('errorIndicator');
            //flag = false;
            fnMsgAlert('info', 'Info', 'Special characters are not allowed in Department Name');
            $('#txtAdddept').val('');
            flag = false;
            return;
        }
    }
    $.ajax({
        type: "POST",
        url: '../Hidoctor_Master/User/InsertNewDept',
        data: '&Department=' + deptInp,
        success: function (resp) {
            fnMsgAlert('success', 'Success', 'New Department is Successfully Added.');
            $('#txtAdddept').val('');
            fnGetDepartmentDetails();
        }
    });
}

function fntxtEmployeeNumber() {
    var empNumb = $('#txtEmployeeNumber').val();
    if (empNumb != "" && empNumb != null && empNumb != undefined) {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/User/GetEmpNumb',
            data: "employeeNUmber=" + empNumb,
            success: function (resp) {
                if (resp == "True") {
                    fnMsgAlert('Info', 'Info', "Employee Number already exists");
                    $("#txtEmployeeNumber").val('');
                }
                //else {
                //    fnMsgAlert("Employee Number is available");
                //}
            }
        });
    }
}

function fntxtReferenceKey1() {
    var empRefKey1 = $('#txtRefKey1').val();
    var refkey1flag = true;
    if (empRefKey1 != "" && empRefKey1 != null && empRefKey1 != undefined) {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/User/GetRefKey_1',
            data: "refKey=" + empRefKey1,
            async: false,
            success: function (resp) {
                if (resp == "True" || resp == "true") {
                    fnMsgAlert('Info', 'Info', "Reference Key 1 already exists");
                    refkey1flag = false;
                    return;
                }
                //else {
                //    fnMsgAlert("Reference Number is available");
                //}
            }
        });
    }
    return refkey1flag;
}

function fntxtReferenceKey2() {
    var empRefKey2 = $('#txtRefKey2').val();
    var refkey2flag = true;
    if (empRefKey2 != "" & empRefKey2 != null && empRefKey2 != undefined) {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/User/GetRefKey_2',
            data: "refKey=" + empRefKey2,
            async: false,
            success: function (resp) {
                if (resp == "True" || resp == "true") {
                    fnMsgAlert('Info', 'Info', "Reference Key 2 already exists");
                    refkey2flag = flase;
                    return;
                }
                //else {               
                //    fnMsgAlert("Reference Number is available");
                //}
            }
        });
    }
    return refkey2flag;
}

function fntxtAadharNumber(Id, evt) {
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 4) {
            return false;

        }
    }
}

//function fntxtPinCode(Id, evt) {
//    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
//        return false;
//    }
//    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
//        return false;
//    } else {
//        if ($('#' + Id.id + '').val().length < 6 || $('#' + Id.id + '').val().length > 10) {
//            return false;
//        }
//    }
//}



///Blood group logic//
function fngetABloodgroupnames() {
    debugger;
    var Company_code = Company_Code;
    //Company_Code;
    $.ajax({
        async: false,
        url: '../HiDoctor_Master/User/GetBloodgroupName',
        data: "Company_code=" + Company_code,
        type: "GET",
        async: false,
        success: function (resp) {
            debugger;
            $('#dvbldgroup').empty();
            $('#dvbldgroup').html('<input type="text" id="blooddgrp">');
            var lstUser = [];
            for (var i = 0; i < resp.length; i++) {
                _objData = {};
                _objData.id = resp[i].Blood_Group_Id;
                _objData.label = resp[i].Blood_Group_Name;
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
                placeholder: 'Select Blood Group',
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstUser, dropdown_query);
                }
            });
            atcObj.appendTo('#blooddgrp');
            //}
            // }






        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });

}
function fnValidateAadhaarNumber() {
    var aadharflag = true;
    if (aadhaar_No != "" && aadhaar_No != null && aadhaar_No != undefined) {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/User/GetAadhaarNumber',
            data: "aadhaarNumber=" + aadhaar_No,
            async: false,
            success: function (resp) {
                if (resp == "True") {
                    fnMsgAlert('Info', 'Info', "Aadhaar Number already exists.Please enter a new Aadhaar Number");
                    $("#txtAADHAARnumberbox_1").val('');
                    $("#txtAADHAARnumberbox_2").val('');
                    $("#txtAADHAARnumberbox_3").val('');
                    aadharflag = false;
                    return;
                }
                //else {
                //    fnMsgAlert("Employee Number is available");
                //}
            }
        });
    }
    return aadharflag;
}

//function fneditflagrefkey1(txtRefKey1, event) {
//    if (event.keycode == 8) {
//        editflag1 = true;
//    }
//    else if (event.keycode >= 65 && event.keycode <= 90) {
//        editflag1 = true;
//    }
//    else if (event.keycode >= 97 && event.keycode <= 122) {
//        editflag1 = true;
//    }
//    else if (event.keycode >= 48 && event.keycode <= 57) {
//        editflag1 = true;
//    }
//}


//function fneditflagrefkey2(txtRefKey2, event) {
//    
//    if (event.keycode == 8) {
//        editflag2 = true;
//    }
//    else if (event.keycode >= 65 && event.keycode <= 90) {
//        editflag2 = true;
//    }
//    else if (event.keycode >= 97 && event.keycode <= 122) {
//        editflag2 = true;
//    }
//    else if (event.keycode >= 48 && event.keycode <= 57) {
//        editflag2 = true;
//    }
//}


//function ExforAlphaNumericSpecificRemarks(value) {
//    var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g)
//    if (specialCharregex.test(value) == true) {
//        return false;
//    }
//    else {
//        return true;
//    }
//}

//function fnvalidatenumfield(element, e) {
//    if ((e.keyCode >= 48 && e.keyCode <= 57)) {
//        return true;
//    }
//    else {
//        fnMsgAlert('info', 'Info', 'Please enter only numbers');
//        return false;
//    }
//}

