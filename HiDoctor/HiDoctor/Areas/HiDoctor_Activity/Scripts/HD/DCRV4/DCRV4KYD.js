//Date : 13/1/2014
var Email_Id = 'EMAIL_ID', Registration_No = 'REGISTRATION_NO', Local_Area = 'LOCAL_AREA', Mobile = 'MOBILE', Pin_Code = 'PIN_CODE', Place_Type = 'PLACE_TYPE', Hospital_Name = 'HOSPITAL_NAME';
var place_TypeName = 'Med.Council'
var emailIdarr = [];
var registrationNamearr = [];
var phonenOarr = [];
var duplicateValue = false;
var KYDdetails_arr = new Array();

//Error indication for Error message
function fnIndicateError(id) {
    $(id).addClass('cls_Errorindication');
}
//function used to Remove the Error Indication
function fnRemoveIndication(obj) {
    if ($(obj).hasClass('cls_Errorindication')) {
        $(obj).removeClass('cls_Errorindication')
    }
}
//Used to indicate the Duplicate Enter Row
function fnErrorindicationforDuplicateRow(i) {

    var highlightedrow = $('#trRow_' + i);
    $(highlightedrow).addClass('cls-ErrorindicationRow');
}
//Regular expression
//Registration No
var specialcharecterforregistrationNo_g = "-_()/";
//Hospital Name and Local area
var specialchracterforHospitalname_g = "-_()/.&,";
//Place Type
var specialcharacterforPlaceType = "-_().";
//Validate Mobile No
function fnValidateMobileNumber(obj, device) {
    if ($.trim($(obj).val()) != '') {
        if (device.toUpperCase() == "MOBILE") {
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
//Used to get config values
function fnGetKYDConfigValues() {
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4KYD/GetConfigurationValues',
        type: "POST",
        async: false,
        success: function (jsData) {
            if (jsData != null && jsData != '') {
                var jsonforDesignation = jsData[0].configvalueforDesignation;
                var jsonDisplaycolumn = jsData[0].Config_DisplayColumns;
                var jsonMandatorycolumn = jsData[0].Config_MandatoryColumns;
                var jsonDuplicatecheckvalue = jsData[0].Config_DuplicatecheckColumn;

                var Displaycolumns = new Array();
                var MandatoryColumns = new Array();
                var Duplicatecheckvalue = new Array();

                Displaycolumns = jsonDisplaycolumn.split(',');
                MandatoryColumns = jsonMandatorycolumn.split(',');
                Duplicatecheckvalue = jsonDuplicatecheckvalue.split(',');

                jsonCheckDuplicate_g = Duplicatecheckvalue;
                jsonMandatory_g = MandatoryColumns;
                jsonDisplayColumns_g = Displaycolumns;
            }
            HideModalPopup('dvLoading');
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            HideModalPopup('dvLoading');
        }
    });

}
//Used to Get KYD- Doctor List
function fnGetKYDScreen() {
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4KYD/GetKYDDoctorListHTMLFormat',
        type: "POST",
        data: 'dcrDate=' + dcrDate + '&Key_Column=' + jsonCheckDuplicate_g,
        success: function (jsData) {
            if (jsData != null && jsData != '') {

                $('#tblkyd').html(jsData);
                $('#spnkeycheck').html('Please note that each customer record should have valid ' + jsonCheckDuplicate_g + '.Record without ' + jsonCheckDuplicate_g + ' value is considered as incomplete KYD Record.');
                fnDisplayColumns(jsonDisplayColumns_g);
                fnMandatorydisplayColumn(jsonMandatory_g);
                //calculate no of doctors to fill
                var noofdoctors = $('#tblDisplayKYD tbody tr').length;
                showDoctorPercentage_g = (parseInt(prividotorpercentage_g) * parseInt(noofdoctors)) / 100;
                var doctorscount = Math.ceil(showDoctorPercentage_g);
                if (showDoctorPercentage_g != '' && showDoctorPercentage_g != null && showDoctorPercentage_g > 0) {
                    $('#spnDoctMandatory').html('<span  class="cls_mandatory">**</span>Please enter at-least <span style="font-weight:bold;">' + doctorscount + '</span> doctor(s) data.');
                }
                //Show the skip button if show doctor percentage is 0
                if (doctorscount <= 0) {
                    $('#btnKydskip').removeClass('cls_ShowButton');
                }
                ShowModalPopup('dvKYD');
                HideModalPopup('dvLoading');
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            HideModalPopup('dvLoading');
        }
    });

}
//Used to get the columns to display
function fnDisplayColumns(jsonDisplaycolumn) {
    for (var s = 0 ; s < jsonDisplaycolumn.length ; s++) {
        if (jsonDisplaycolumn[s] == Email_Id) {
            $('#thEmail').removeClass('cls_DisplayColumn');
            $('.clsEmailId').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Registration_No) {
            $('#thRegNo').removeClass('cls_DisplayColumn');
            $('.clsRegistration').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Pin_Code) {
            $('#thPin').removeClass('cls_DisplayColumn');
            $('.clsPincode').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Local_Area) {
            $('#thLocalarea').removeClass('cls_DisplayColumn');
            $('.clsLocalArea').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Mobile) {
            $('#thMobileNo').removeClass('cls_DisplayColumn');
            $('.clsMobileno').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Place_Type) {
            $('#thplaceType').removeClass('cls_DisplayColumn');
            $('.clsPlaceType').removeClass('cls_DisplayColumn');
        }
        else if (jsonDisplaycolumn[s] == Hospital_Name) {
            $('#thhospitalName').removeClass('cls_DisplayColumn');
            $('.clsHospitalName').removeClass('cls_DisplayColumn');
        }
    }
}
//Used to display the * for mandatorycolumns
function fnMandatorydisplayColumn(jsonMandatory_g) {

    var keycheckcolumn = "";
    if (jsonCheckDuplicate_g == Registration_No) {
        keycheckcolumn = Registration_No;
        $('#spnmanreg').html('**');
    }
    else if (jsonCheckDuplicate_g == Mobile) {
        keycheckcolumn = Mobile;
        $('#spnmanmobile').html('**');
    }
    else if (jsonCheckDuplicate_g == Email_Id) {
        keycheckcolumn = Email_Id;
        $('#spnmanmail').html('**');
    }

    for (var s = 0 ; s < jsonMandatory_g.length ; s++) {
        if (jsonMandatory_g[s] != keycheckcolumn) {
            if (jsonMandatory_g[s] == Email_Id) {
                $('#spnmanmail').html('*');
            }

            else if (jsonMandatory_g[s] == Registration_No) {
                $('#spnmanreg').html('*');
            }
            else if (jsonMandatory_g[s] == Mobile) {
                $('#spnmanmobile').html('*');
            }
            else if (jsonMandatory_g[s] == Local_Area) {
                $('#spnmanlocalarea').html('*');
            }
            else if (jsonMandatory_g[s] == Pin_Code) {
                $('#spnmanpin').html('*');
            }
            else if (jsonMandatory_g[s] == Place_Type) {
                $('#spnmanplaceType').html('*');
            }
            else if (jsonMandatory_g[s] == Hospital_Name) {
                $('#spnmanhospital').html('*');
            }
        }
    }
}
//Validation on Mnadatory column
function fnValidateMandatoryColumn(s) {
    //Registration No               
    //To check Mandatory or not
    //Email id Mandatory
    if ($.inArray(Email_Id, jsonMandatory_g) != -1) {
        if ($.trim($("#txtEmailid_" + s).val()) == '') {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Enter the Email Id at row no' + s + '.');
            fnIndicateError("#txtEmailid_" + s);
            return false;
        }
    }
    //Registration Validation
    if ($.inArray(Registration_No, jsonMandatory_g) != -1) {
        if ($("#txtRegistration_" + s).val() == '') {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Enter the Registration No at row no' + s + '.');
            fnIndicateError("#txtRegistration_" + s);
            return false;
        }
    }
    //Mobile No Validation
    if ($.inArray(Mobile, jsonMandatory_g) != -1) {
        if ($("#txtMobile_" + s).val() == '') {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Enter the Mobile No at row no' + s + '.');
            fnIndicateError("#txtMobile_" + s);
            return false;
        }
    }
    //Local Area
    if ($.inArray(Local_Area, jsonMandatory_g) != -1) {
        var localarea = $("#txtLocalArea_" + s).val();
        if ($("#txtLocalArea_" + s).val() == '') {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Enter the Local Area at row no' + s + '.');
            fnIndicateError("#txtLocalArea_" + s);
            return false;
        }
    }
    //PIN Code validation
    if ($.inArray(Pin_Code, jsonMandatory_g) != -1) {
        if ($("#txtPincode_" + s).val() == '') {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Enter the PIN Code at row no' + s + '.');
            fnIndicateError("#txtPincode_" + s);
            return false;
        }
    }
    //Place Type
    if ($.inArray(Place_Type, jsonMandatory_g) != -1) {
        var placeType = $("#txtPlaceType_" + s).val();
        if ($("#txtPlaceType_" + s).val() == '') {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Enter the ' + place_TypeName + ' at row no' + s + '.');
            fnIndicateError("#txtPlaceType_" + s);
            return false;
        }
    }
    //Hospital Name
    if ($.inArray(Hospital_Name, jsonMandatory_g) != -1) {
        var hospitalName = $("#txtHospitalName_" + s).val();
        if ($("#txtHospitalName_" + s).val() == '') {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Enter the Hospital Name at row no' + s + '.');
            fnIndicateError("#txtHospitalName_" + s);
            return false;
        }
    }
    return true;
}
function fnValidateSpecialcharCheckcolumns(s) {
    //Email Id
    var emailId = $("#txtEmailid_" + s).val();
    //Length check
    if ($("#txtEmailid_" + s).val() != '') {
        if ($.trim($("#txtEmailid_" + s).val()).length > 100) {
            fnMsgAlert('info', 'Know Your Doctor', 'The Email Id length should not exceed 100 at row no' + s + ' .');
            fnIndicateError("#txtEmailid_" + s);
            return false;
        }
    }

    if ($.trim($("#txtEmailid_" + s).val()) != '') {
        
        if (!fnEmailCheck($("#txtEmailid_" + s))) {
            
            fnMsgAlert('info', 'Know Your Doctor', 'Please enter a valid email id at row no'+s+'.');
            fnIndicateError("#txtEmailid_" + s);
            return false;
        }
    }

    //Restrict duplication allowed
    if (jsonCheckDuplicate_g == Email_Id) {
        if ($("#txtEmailid_" + s).val() != '') {
            if ($.inArray($("#txtEmailid_" + s).val(), emailIdarr) > -1) {

                for (var i = 1; i <= $("#tblDisplayKYD tbody tr").length; i++) {
                    var emailId = $("#txtEmailid_" + s).val();
                    if ($("#txtEmailid_" + i).val() == emailId) {
                        duplicateValue = true;
                        fnErrorindicationforDuplicateRow(i);
                    }
                }
            }
            emailIdarr.push($("#txtEmailid_" + s).val());
        }
    }

    //Registration No
    var registrationNo = $("#txtRegistration_" + s).val();
    //Length check
    if ($("#txtRegistration_" + s).val() != '') {
        if ($.trim($("#txtRegistration_" + s).val()).length > 50) {
            fnMsgAlert('info', 'Know Your Doctor', 'The Registration Number length should not exceed 50 at row no' + s + ' .');
            fnIndicateError("#txtRegistration_" + s);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txtRegistration_" + s).val()) != "") {
        var specialCharregexforregistration = new RegExp(/^[a-zA-Z0-9-_()/']+$/);
        if (!specialCharregexforregistration.test($.trim($("#txtRegistration_" + s).val()))) {
            fnMsgAlert('info', 'Information', 'Please Remove the special characters in Registration No at row no ' + s + '.Following characters only allowed (' + specialcharecterforregistrationNo_g + ').');
            fnIndicateError("#txtRegistration_" + s);
            return false;
        }
    }
    //Restrict duplication allowed
    if (jsonCheckDuplicate_g == Registration_No) {
        if ($("#txtRegistration_" + s).val() != '') {
            if ($.inArray($("#txtRegistration_" + s).val(), registrationNamearr) > -1) {

                for (var i = 1; i <= $("#tblDisplayKYD tbody tr").length; i++) {
                    var registrationNo = $("#txtRegistration_" + s).val();
                    if ($("#txtRegistration_" + i).val() == registrationNo) {
                        duplicateValue = true;
                        fnErrorindicationforDuplicateRow(i);
                    }
                }
            }
            registrationNamearr.push($("#txtRegistration_" + s).val());
        }
    }
    //Mobile No
    var Mobileno = $("#txtMobile_" + s).val();
    //Length check
    if ($("#txtMobile_" + s).val() != '') {
        if ($.trim($("#txtMobile_" + s).val()).length > 13) {
            fnMsgAlert('info', 'Know Your Doctor', 'The Mobile length should not exceed 13 at row no' + s + ' .');
            fnIndicateError("#txtMobile_" + s);
            return false;
        }

        if ($.trim($("#txtMobile_" + s).val()).length < 10) {
            fnMsgAlert('info', 'Know Your Doctor', 'Please validate the mobile number at row no ' + s + ' .Mobile number must contains atleast 10 digits.');
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txtMobile_" + s).val()) != "") {
        var result = fnValidateMobileNumber($("#txtMobile_" + s), "MOBILE");
        if (!result) {
            fnMsgAlert('info', 'Know Your Doctor', 'Please validate the mobile number at row no' + s + '.');
            return false;
        }
    }
    //Restrict dulication allowed
    if (jsonCheckDuplicate_g == Mobile) {
        if ($("#txtMobile_" + s).val() != '') {
            if ($.inArray($("#txtMobile_" + s).val(), phonenOarr) > -1) {

                for (var i = 1; i <= $("#tblDisplayKYD tbody tr").length; i++) {
                    var mobileNo = $("#txtMobile_" + s).val();
                    if ($("#txtMobile_" + i).val() == mobileNo) {
                        duplicateValue = true;
                        fnErrorindicationforDuplicateRow(i);
                    }
                }
            }
            phonenOarr.push($("#txtMobile_" + s).val());
        }
    }
    //Local Area
    //Length check
    if ($("#txtLocalArea_" + s).val() != '') {
        if ($.trim($("#txtLocalArea_" + s).val()).length > 500) {
            fnMsgAlert('info', 'Know Your Doctor', 'The Local Area length should not exceed 500 at row no' + s + ' .');
            fnIndicateError("#txtLocalArea_" + s);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txtLocalArea_" + s).val()) != "") {
        var specialCharregexforLocalarea = new RegExp(/^[a-zA-Z0-9,&.\-_() ']+$/);
        if (!specialCharregexforLocalarea.test($.trim($("#txtLocalArea_" + s).val()))) {
            fnMsgAlert('info', 'Information', 'Please Remove the special characters in Local Area at row no ' + s + '.Following characters only allowed (' + specialchracterforHospitalname_g + ').');
            fnIndicateError("#txtLocalArea_" + s);
            return false;
        }
    }
    //Pin Code
    var pinCode = $("#txtPincode_" + s).val();
    //Length check
    if ($("#txtPincode_" + s).val() != '') {
        if ($.trim($("#txtPincode_" + s).val()).length > 10) {
            fnMsgAlert('info', 'Know Your Doctor', 'The PIN Code length should not exceed 10 at row no' + s + ' .');
            fnIndicateError("#txtPincode_" + s);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txtPincode_" + s).val()) != "") {

        var specialCharregexforPINcode = new RegExp(/^[0-9]{6}$/);
        if (!specialCharregexforPINcode.test($.trim($("#txtPincode_" + s).val()))) {
            fnMsgAlert('info', 'Information', 'Please Enter a valid PIN code at row no' + s + '.');
            fnIndicateError("#txtPincode_" + s);
            return false;
        }
    }
    //Place Type    
    //Length check
    if ($("#txtPlaceType_" + s).val() != '') {
        if ($.trim($("#txtPlaceType_" + s).val()).length > 100) {
            fnMsgAlert('info', 'Know Your Doctor', 'The ' + place_TypeName + ' length should not exceed 100 at row no' + s + '.');
            fnIndicateError("#txtPlaceType_" + s);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txtPlaceType_" + s).val()) != "") {
        var specialCharregexforplaceType = new RegExp(/^[a-zA-Z0-9._() '-]+$/);
        if (!specialCharregexforplaceType.test($.trim($("#txtPlaceType_" + s).val()))) {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Remove the special characters in ' + place_TypeName + ' at row no ' + s + '.Following characters only allowed (' + specialcharacterforPlaceType + ').');
            fnIndicateError("#txtPlaceType_" + s);
            return false;
        }
    }
    //Hospital Name
    //Length check
    if ($("#txtHospitalName_" + s).val() != '') {
        if ($.trim($("#txtHospitalName_" + s).val()).length > 100) {
            fnMsgAlert('info', 'Know Your Doctor', 'The Hospital Name length should not exceed 100 at row no' + s + '.');
            fnIndicateError("#txtHospitalName_" + s);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txtHospitalName_" + s).val()) != "") {

        var specialCharregexforLocalarea = new RegExp(/^[a-zA-Z0-9,&.-_() ']+$/);
        if (!specialCharregexforLocalarea.test($.trim($("#txtHospitalName_" + s).val()))) {
            fnMsgAlert('info', 'Know Your Doctor', 'Please Remove the special characters in Hospital Name at row no ' + s + '.Following characters only allowed (' + specialchracterforHospitalname_g + ').');
            fnIndicateError("#txtHospitalName_" + s);
            return false;
        }
    }
    return true;
}
//Validation on Key column
function fnValidateKYD() {
    var checkkey = "";
    var rowcount = $('#tblDisplayKYD tbody tr').length;
    var noofrowsfilled = 0;
    var result = false;
    for (var s = 1 ; s <= rowcount; s++) {
        if (jsonCheckDuplicate_g == Mobile) {
            if (Math.ceil(noofrowsfilled) <= Math.ceil(showDoctorPercentage_g)) {
                checkkey = "Mobile No"
                if ($.trim($('#txtMobile_' + s).val()).length > 0) {
                    result = fnValidateMandatoryColumn(s);
                    if (!result) {
                        return false;
                    }
                    else {
                        result = fnValidateSpecialcharCheckcolumns(s);
                        if (!result) {
                            return false;
                        }
                    }
                    noofrowsfilled++;
                }
                else {
                    result = fnValidateSpecialcharCheckcolumns(s);
                    if (!result) {
                        return false;
                    }
                }
            }
            else {
                result = fnValidateSpecialcharCheckcolumns(s);
                if (!result) {
                    return false;
                }
            }
        }
        else if (jsonCheckDuplicate_g == Registration_No) {
            checkkey = "Registration No";
            if (Math.ceil(noofrowsfilled) <= Math.ceil(showDoctorPercentage_g)) {
                if ($.trim($('#txtRegistration_' + s).val()).length > 0) {
                    result = fnValidateMandatoryColumn(s);
                    if (!result) {
                        return false;
                    }
                    else {
                        result = fnValidateSpecialcharCheckcolumns(s);
                        if (!result) {
                            return false;
                        }
                    }
                    noofrowsfilled++;
                }
                else {
                    result = fnValidateSpecialcharCheckcolumns(s);
                    if (!result) {
                        return false;
                    }
                }
            }
            else {
                result = fnValidateSpecialcharCheckcolumns(s);
                if (!result) {
                    return false;
                }
            }
        }
        else if (jsonCheckDuplicate_g == Email_Id) {
            checkkey = "Email Id";
            if (Math.ceil(noofrowsfilled) <= Math.ceil(showDoctorPercentage_g)) {
                if ($.trim($('#txtEmailid_' + s).val()).length > 0) {
                    result = fnValidateMandatoryColumn(s);
                    if (!result) {
                        return false;
                    }
                    else {
                        result = fnValidateSpecialcharCheckcolumns(s);
                        if (!result) {
                            return false;
                        }
                    }
                    noofrowsfilled++;
                }
                else {
                    result = fnValidateSpecialcharCheckcolumns(s);
                    if (!result) {
                        return false;
                    }
                }
            }
            else {
                result = fnValidateSpecialcharCheckcolumns(s);
                if (!result) {
                    return false;
                }
            }
        }
    }
    //If privilege is not mapped
    if (showDoctorPercentage_g > 0) {
        if (noofrowsfilled == "0") {
            fnMsgAlert('info', 'Know Your Doctor ', 'You are not entered any doctor details.Please enter atleast one doctor details.');
            return false;
        }
    }

    if (duplicateValue) {
        debugger;
        if (!confirm('The Highlighted row(s) are Duplicated for ' + jsonCheckDuplicate_g + '. Do you wish to continue?')) {
            return false;
        }
    }
    //Percentage calculation
    // Rowsfilledpercentage = (no of rows filled with mandatory filled/No of doctors entered in kyd screeen)*100;
    if (Math.ceil(noofrowsfilled) >= Math.ceil(showDoctorPercentage_g)) {
        return true;
    }
    else {
        fnMsgAlert('info', 'Know Your Doctor ', 'You need to fill Doctor details till to reach the desired percentage.Please enter the ' + checkkey + '');
        return false;
    }

    return true;
}
//Check duplication on Key column from DB
function fnSaveKYDDoctorList() {
    //Clear phonearr and registration arr and duplicate row highlight
    emailIdarr = [];
    phonenOarr = [];
    registrationNamearr = [];
    KYDdetails_arr = [];
    duplicateValue = false;
    var doctorNames = "";
    var keycolumns = "";

    $('#tblDisplayKYD tbody tr').removeClass('cls-ErrorindicationRow');
    var result = fnValidateKYD();
    if (result) {
        var duplicatekey_Arr = new Array();
        var rowcount = $('#tblDisplayKYD tbody tr').length;
        for (var s = 1 ; s <= rowcount ; s++) {
            if ($.trim($("#txtRegistration_" + s).val()).length > 0) {
                fnReadFormValues(s);
            }
            else if ($.trim($("#txtPincode_" + s).val()).length > 0) {
                fnReadFormValues(s);
            }
            else if ($.trim($("#txtLocalArea_" + s).val()).length > 0) {
                fnReadFormValues(s);
            }
            else if ($.trim($("#txtMobile_" + s).val()).length > 0) {
                fnReadFormValues(s);
            }
            else if ($.trim($("#txtPlaceType_" + s).val()).length > 0) {
                fnReadFormValues(s);
            }
            else if ($.trim($("#txtHospitalName_" + s).val()).length > 0) {
                fnReadFormValues(s);
            }
            else if ($.trim($("#txtEmailid_" + s).val()).length > 0) {
                fnReadFormValues(s);
            }
        }
        try {
            ShowModalPopup('dvLoading');
            $.ajax({
                url: '../HiDoctor_Activity/DCRV4KYD/DuplicateValidationOnKYD',
                type: "POST",
                data: "KYDDoctordetails_arr=" + JSON.stringify(KYDdetails_arr) + '&duplicateKeycolumn=' + jsonCheckDuplicate_g,
                async:false,
                success: function (jsData) {

                    if (jsData == null || jsData.length == 0) {
                        fnSaveDoctorDeatils(JSON.stringify(KYDdetails_arr));
                    }
                    else {
                        for (var s = 0 ; s < jsData.length ; s++) {
                            if (jsonCheckDuplicate_g == Registration_No) {
                                keycolumns += jsData[s].Registration_No + '\n';
                                duplicatekey_Arr.push(jsData[s].Registration_No);
                            }
                            else if(jsonCheckDuplicate_g == Mobile){
                                keycolumns += jsData[s].Mobile + '\n';
                                duplicatekey_Arr.push(jsData[s].Mobile);
                            }
                            else if (jsonCheckDuplicate_g == Email_Id) {
                                keycolumns += jsData[s].Email_Id + '\n';
                                duplicatekey_Arr.push(jsData[s].Email_Id);
                            }
                        }
                        if (keycolumns.length > 0) {
                            debugger;
                            if (!confirm('The following  ' + jsonCheckDuplicate_g + '(s) are already entered for some doctor(s). \n' + keycolumns + ' Do you wish to continue?')) {
                                if (jsonCheckDuplicate_g == Registration_No) {
                                    for (var i = 1; i <= $("#tblDisplayKYD tbody tr").length; i++) {
                                        var duplicateValue = $("#txtRegistration_" + i).val();
                                        if ($.inArray(duplicateValue, duplicatekey_Arr) != -1) {

                                            fnIndicateError("#txtRegistration_" + i);
                                        }
                                    }
                                }
                                else if(jsonCheckDuplicate_g == Mobile){
                                    for (var i = 1; i <= $("#tblDisplayKYD tbody tr").length; i++) {
                                        var duplicateValue = $("#txtMobile_" + i).val();
                                        if ($.inArray(duplicateValue, duplicatekey_Arr) != -1) {
                                            fnIndicateError("#txtMobile_" + i);
                                        }
                                    }
                                }
                                else if (jsonCheckDuplicate_g == Email_Id) {
                                    for (var i = 1; i <= $("#tblDisplayKYD tbody tr").length; i++) {
                                        var duplicateValue = $("#txtEmailid_" + i).val();
                                        if ($.inArray(duplicateValue, duplicatekey_Arr) != -1) {
                                            fnIndicateError("#txtEmailid_" + i);
                                        }
                                    }
                                }
                                return false;
                            }
                            fnSaveDoctorDeatils(JSON.stringify(KYDdetails_arr));
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
    }
}
//Used to Read table values
function fnReadFormValues(s) {
    var doctordetails = $('#hdndoctordetails_' + s).val();
    var doctorCode = doctordetails.split('-')[0];
    var doctorRegionCode = doctordetails.split('-')[1];
    var registrationNo = $("#txtRegistration_" + s).val();
    var pinCode = $("#txtPincode_" + s).val();
    var localArea = $("#txtLocalArea_" + s).val();
    var mobile = $("#txtMobile_" + s).val();
    var placeType = $("#txtPlaceType_" + s).val();
    var hospitalName = $("#txtHospitalName_" + s).val();
    var emailId = $('#txtEmailid_'+s).val();
    var KYDdetails = {};
    KYDdetails.Doctor_Code = doctorCode;
    KYDdetails.Doctor_Region_Code = doctorRegionCode;
    KYDdetails.Registration_No = registrationNo;
    KYDdetails.Local_Area = localArea;
    KYDdetails.Hospital_Name = hospitalName;
    KYDdetails.Mobile = mobile;
    KYDdetails.Pin_Code = pinCode;
    KYDdetails.Medical_Council = placeType;
    KYDdetails.Email_Id = emailId;
    KYDdetails_arr.push(KYDdetails);
}
//Save Doctor details
function fnSaveDoctorDeatils(kydDetails_Arr) {
    try {
        ShowModalPopup('dvLoading');
        $.ajax({
            url: '../HiDoctor_Activity/DCRV4KYD/SaveKYDInfo',
            type: "POST",
            data: "KYDDoctordetails_arr=" + kydDetails_Arr + '&duplicateKeycolumn=' + jsonCheckDuplicate_g,
            success: function (result) {

                if (result == '0') {
                    fnRedirectToInstantReport();
                }
                else {
                    fnMsgAlert('info', '', 'Error.' + result);
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
}
//Used to redirect the Instant Report
function fnRedirectToInstantReport() {
    var date = dcrDate.split('-')[1] + '/' + dcrDate.split('-')[2] + '/' + dcrDate.split('-')[0];

    $('#main').load('../HiDoctor_Activity/DCRV4Report/Index/?dcrActualDate=' + dcrDate + '&flag=' + flag_g);
    HideModalPopup('dvLoading');
}
//Used to skip the KYD Screen
function fnSkipKYD() {
    fnRedirectToInstantReport();
}