//Created BY:Suamthi.M
//Date:04/04/2014
var jsonResult = '';
function fnGetMyProfile() {
    $('#dvTabs').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MyProfile/GetProfileDetails',
        type: "POST",
        success: function (response) {
            debugger;
            jsonResult = eval('(' + response + ')');
            if (jsonResult.length > 0) {
                $('#spnRegionTypeName').html(jsonResult[0].Region_Name + " " + "(" + jsonResult[0].Region_Type_Name + ")");
                $('#hdnEmployeeCode').val(jsonResult[0].Employee_Code);
                $("#dvusrname").html(jsonResult[0].User_Name + " " + "&" + " " + jsonResult[0].User_Type_Name);
                $('#spnEmployeeName').html(jsonResult[0].Employee_Name);
                if (jsonResult[0].Employee_Number != 0) {
                    $("#spnEmployeeNumber").html(jsonResult[0].Employee_Number);
                }
                else {
                    $("#spnEmployeeNumber").html('');
                }
                $("#spnHidocstartDate").html(jsonResult[0].HiDOCTOR_Start_Date);
                if (jsonResult[0].Confirmation_Date == "01/01/1900") {
                    $("#spnDOC").html('');
                }
                else {
                    $("#spnDOC").html(jsonResult[0].Confirmation_Date);
                }
                $("#spnGender").html(jsonResult[0].Gender);
                if (jsonResult[0].Date_Of_Birth != "01/01/1900") {
                    $('#spnDob').html(jsonResult[0].Date_Of_Birth);
                }
                else {
                    $("#spnDob").html('');
                }
                if (jsonResult[0].SCB_Account_Number != 0) {
                    $('#spnAccNo1').html(jsonResult[0].SCB_Account_Number);
                }
                else {
                    $("#spnAccNo1").html('');
                }
                if (jsonResult[0].ICICI_Account_Number != 0) {
                    $('#spnAccNo2').html(jsonResult[0].ICICI_Account_Number);
                }
                else {
                    $("#spnAccNo2").html('');
                }
                $('#spnPf').html(jsonResult[0].PF_Number);
                $('#spnPAN').html(jsonResult[0].PAN_Number);

                if (jsonResult[0].Address != 0) {
                    $("#spnAddress").html(jsonResult[0].Address);
                }
                else {
                    $("#spnAddress").html('');
                }

                if (jsonResult[0].Address2 != 0) {
                    $("#spnAddress2").html(jsonResult[0].Address2);
                }
                else {
                    $("#spnAddress2").html('');
                }

                if (jsonResult[0].dvAddress3 != 0) {
                    $("#spnAddress3").html(jsonResult[0].Address3);
                }
                else {
                    $("#spnAddress3").html('');
                }

                if (jsonResult[0].State_Name != "") {
                    $("#spnState").html(jsonResult[0].State_Name);
                }
                else {
                    $("#spnState").html('');
                }


                if (jsonResult[0].Employee_Photo != "") {
                    $("#fileUrl").html(jsonResult[0].Employee_Photo.split('/').reverse()[0]);
                }
                else {
                    $("#fileUrl").html('');
                }
                if (jsonResult[0].Blood_Group_Name != "") {
                    $("#blooddgrp").html(jsonResult[0].Blood_Group_Name);
                }
                else {
                    $("#blooddgrp").html('');
                }

                if (jsonResult[0].City_Name != "") {

                    $("#spnCity").html(jsonResult[0].City_Name);
                }
                else {
                    $("#spnCity").html('');
                }

                if (jsonResult[0].Pincode != "") {

                    $("#spnPincode").html(jsonResult[0].Pincode);
                }
                else {
                    $("#spnPincode").html('');
                }
                if (jsonResult[0].Date_of_Joining != "01/01/1900") {
                    $('#spnDoj').html(jsonResult[0].Date_of_Joining);
                }
                else {
                    $("#spnDoj").html('');
                }

                if (jsonResult[0].Ref_Key1 != "") {
                    $("#refkey1").html(jsonResult[0].Ref_Key1);
                }
                else {
                    $("#refkey1").html('');
                }
                if (jsonResult[0].Ref_Key2 != "") {
                    $("#refkey2").html(jsonResult[0].Ref_Key2);
                }
                else {
                    $("#refkey2").html('');
                }
                $('#spnMobile').html(jsonResult[0].Mobile);
                $('#spnPhone').html(jsonResult[0].Phone);
                $('#spnmail').html(jsonResult[0].Email_Id);
                $('#dvTabs').unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvTabs').unblock();
        },
        complete: function () {
            $('#dvTabs').unblock();
        }
    });
}
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
function fnshowempphoto() {
    debugger;
    $('#myModalEmpphoto').show();

    debugger;
    jsonResult;

    if (jsonResult[0].Employee_Photo!="" && jsonResult[0].Employee_Photo != null) {
        var attachment = "";
       
        var extension = jsonResult[0].Employee_Photo.split('.');
        extension = extension.reverse();
        if (extension[0] == "jpg" || extension[0] == "png") {
            attachment += '<img src="' +  jsonResult[0].Employee_Photo + '" />';
            $('#Empdata').html(attachment);
            $('#myModalEmpphoto').show();

        }
    }


    }

//Save
function fnsaveMyProfile() {
    if ($.trim($("#txtEmail").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Enter The Email Id.');
        return false;
    }


    if (!emailIdValidation($.trim($("#txtEmail").val()))) {
        fnMsgAlert('info', 'Info', 'Enter the Valid Email-Id.');
        return false;
    }

    var employeeCode = $.trim($('#hdnEmployeeCode').val());
    var emailid = $.trim($('#txtEmail').val());

    $('#dvTabs').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        url: '../HiDoctor_Master/MyProfile/SavePrivilege',
        type: "POST",
        data: "employeeCode=" + employeeCode + "&mailId=" + emailid,
        success: function (result) {
            if ($('#wrapperbody').hasClass('hide')) {
                $('#wrapperbody').removeClass('hide');
                $('#wrapperbody').addClass('show');
            }
            if ($.trim(result) != '') {
                $('#txtEmail').val('');
                fnGetMyProfile();
                fnMsgAlert('success', 'Information', result);
                return;
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvTabs').unblock();
        },
        complete: function () {
            $('#dvTabs').unblock();
        }
    });
}

//Cancel
function fnClearprofile() {
    $('#txtEmail').val('');
}
