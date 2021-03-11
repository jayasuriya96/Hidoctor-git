function fnLoadControls() {
    fnFillSummaryGrid();
    SetDefautlSelection();
    $("#dvOverlay").overlay().load();
}

function fnFillSummaryGrid() {
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/GetAllSplashScreenData',
        type: "POST",
        success: function (response) {
            if (response != "") {
                $("#divSummaryGrid").html(response);
                $('.cls_lnk_assign').unbind('click').bind('click', function () {
                    var id = $(this).attr('splash-id');
                    $('#hdnSplashId').val(id);
                    $('.clsUserMap').show();
                    $('.clsSuccMsg').hide();
                    $('.clsSplashCreation').hide();
                    $('.clsSpecUser').hide();
                    $('.clsSpecGroup').hide();
                });
                $.unblockUI();
            }
            else {
                fnMsgAlert('info', 'Splash Screen', 'Sorry. No splash screen details found');
            }
            //  getChildUsers();
        },
        error: function () {
            fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to get splash screen details');
        }
    });
}

function SetDefautlSelection() {
    saveMode = "NEW";
    splashScreenId_Edit = "";
    $('input[type=radio][name=rdAttachment][value=0]').prop('checked', true);
    $('.clsMobileAttachment').hide();
    uploadedFiles = [];
    allFiles = new Array();
    $('.clsSuccMsg').show();
}

function fnClearForm() {
    //$(":radio").removeAttr("checked");
    $('#txtimg').prop('checked', true);
    $("#lbldesc").show();
    $("#attachmnt").show();
    $("#txtTitle").val("");
    // $("#txtDescription").val("");
    $('.jqte_editor').html('');
    $("#txtValidFrom").val("");
    $("#txtValidTo").val("");
    $('#link').hide();
    editFileName = new Array();
    editFilePath = new Array();
    // var fileControl = document.getElementById("fileUploader");
    // fileControl.value = "";
    // var mobilefileControl = document.getElementById("mobileFileUploader");
    // mobilefileControl.value = "";
    $("#fileUploader").closest('form').trigger('reset');
    $("#mobileFileUploader").closest('form').trigger('reset');
    $('#hdnSplashId').val('');
    SetDefautlSelection();
    $('#spnSelectedUsers').html('No of Selected Users: 0');
    $('#spnSelectedGrpUsers').html('No of Selected Users: 0');
    $("#tree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });
    $('#editfilepathlink').attr("href", "");
    $('#editfilepathlink').html('');
    $('#editMobilefilepathlink').attr("href", "");
    $('#editMobilefilepathlink').html("");
    $('#imgSplash').removeAttr("src");
    $('#imgSplash').attr("src", "");
}

function ValidateForm() {
    debugger;
    Splashtype = $("input[name='optradio']:checked").val();
    if(Splashtype == "txtonly"){
    SplashtypeString = "T";
    }

    if (Splashtype == "imgonly") {
        SplashtypeString = "I";
    }

    if (Splashtype == "txtimg") {
        SplashtypeString = "B";
    }

    //if ($("#txtTitle").val().trim() == "") {
    //    $.unblockUI();
    //    HideModalPopup("dvloading");
    //    alert("Please Enter Title");
    //    return false;
    //}

    if ($("#txtTitle").val().trim().length > 150) {
        $.unblockUI();
        HideModalPopup("dvloading");
        alert("Title should not exceed 150 characters");
        return false;
    }
    if (Splashtype == "txtonly" || Splashtype == "txtimg") {
        if ($('.jqte_editor').text().trim() == "") {
            $.unblockUI();
            HideModalPopup("dvloading");
            alert("Please enter the description");
            return false;
        }

        if ($('.jqte_editor').text().trim().length > 1000) {
            $.unblockUI();
            HideModalPopup("dvloading");
            alert("Description should not exceed 1000 characters");
            return false;
        }
    }

    if (Splashtype == "imgonly" || Splashtype == "txtimg") {
        if ($('#editfilepathlink').html() == "") {
            if ($("#fileUploader").val() == "") {
                $.unblockUI();
                HideModalPopup("dvloading");
                alert("Attachment should not be empty");
                return false;
            }
        }
      }
    if (Splashtype == "imgonly" || Splashtype == "txtimg") {
        var isTrue;
        //isTrue = fnDoDateValidations();

        //if (!isTrue) {
        //    return false;
        //}
        isTrue = fnValidateFile();
        if (!isTrue) {
            return false;
        }
    }
    var splashScreenId = "";
    var validFrom = $("#txtValidFrom").val().trim();
    var validTo = $("#txtValidTo").val().trim();

    if ($.trim(validFrom) == null || $.trim(validFrom) == '') {
        $.unblockUI();
        HideModalPopup("dvloading");
        alert("Please enter date from");
        return false;
    }


    if ($.trim(validTo) == null || $.trim(validTo) == '') {
        $.unblockUI();
        HideModalPopup("dvloading");
        alert("Please enter date to");
        return false;
    }
    if (saveMode != "EDIT") {
        var selectedDate = new Date($('#txtValidFrom').val().split("/")[2] + "-" + $('#txtValidFrom').val().split("/")[1] + "-" + $('#txtValidFrom').val().split("/")[0]);
        var EndDate = new Date($('#txtValidTo').val().split("/")[2] + "-" + $('#txtValidTo').val().split("/")[1] + "-" + $('#txtValidTo').val().split("/")[0]);
        var todayDate = new Date(curdate.split(".")[2] + "-" + curdate.split(".")[1] + "-" + curdate.split(".")[0]);

        var todayObj = new Date(todayDate);
        if (selectedDate < todayDate) {
            $.unblockUI();
            HideModalPopup("dvloading");
            fnMsgAlert('info', 'Info', "Please ensure that From Date is greater than or equal to today's Date.");
            return false;
        }
        if (EndDate < todayDate) {
            $.unblockUI();
            HideModalPopup("dvloading");
            fnMsgAlert('info', 'Info', "Please ensure that To Date is greater than or equal to today's Date.");
            return false;
        }
        if (selectedDate > EndDate) {
            $.unblockUI();
            HideModalPopup("dvloading");
            fnMsgAlert('info', 'Info', "Please ensure that To Date is greater than or equal to From Date.");
            return false;
        }
        if (Splashtype == "imgonly" || Splashtype == "txtimg") {
                if ($("#fileUploader").val() == "") {
                    $.unblockUI();
                    HideModalPopup("dvloading");
                    alert("Attachment should not be empty");
                    return false;
            }
        }

    }
    if (saveMode == "EDIT") {
        splashScreenId = splashScreenId_Edit;
        var selectedDate = new Date($('#txtValidFrom').val().split("/")[2] + "-" + $('#txtValidFrom').val().split("/")[1] + "-" + $('#txtValidFrom').val().split("/")[0]);
        var EndDate = new Date($('#txtValidTo').val().split("/")[2] + "-" + $('#txtValidTo').val().split("/")[1] + "-" + $('#txtValidTo').val().split("/")[0]);
        var todayDate = new Date(curdate.split(".")[2] + "-" + curdate.split(".")[1] + "-" + curdate.split(".")[0]);

        if (EndDate < todayDate) {
            $.unblockUI();
            HideModalPopup("dvloading");
            fnMsgAlert('info', 'Info', "Please ensure that To Date is greater than or equal to today's Date.");
            return false;
        }
        if (selectedDate > EndDate) {
            $.unblockUI();
            HideModalPopup("dvloading");
            fnMsgAlert('info', 'Info', "Please ensure that From Date is greater than or equal to today's Date.");
            return false;
        }

        Splashtype = $("input[name='optradio']:checked").val();
        if (Splashtype == "txtonly") {
            SplashtypeString = "T";
            $("#fileUploader").val("");
        }

        if (Splashtype == "imgonly") {
            SplashtypeString = "I";
            $(".jqte_editor").text('');
        }

        if (Splashtype == "txtimg") {
            SplashtypeString = "B";
        }
       
    }

    //$.ajax({
    //    url: '../HiDoctor_Master/SplashScreen/CheckOverlappingSplashScreenData',
    //    type: "POST",
    //    data: "splashScreenId=" + splashScreenId + "&validFrom=" + validFrom + "&validTo=" + validTo + "&saveMode=" + saveMode + "",
    //    success: function (response) {
    //        if (response == "ERROR") {
    //            HideModalPopup("dvloading");
    //            alert('Validity of this splash screen is overlapping with other active splash screen. Kindly change the date period');
    //            return false;
    //        }
    //        else {
    //            var uploadedFileName = $('#fileUploader').val();
    //            if (uploadedFileName != "") {
    //                BeginFileUpload(uploadedFileName);
    //            }
    //            else {

    //                fnSaveSplashScreen(editFileName);
    //            }
    //        }
    //    },
    //    error: function () {
    //        HideModalPopup("dvloading");
    //        fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to get splash screen data to check overlapping');
    //        return false;
    //    }
    //});

    var uploadedFileName = $('#fileUploader').val();
    var uploadedMobileFileName = $('#mobileFileUploader').val();

    if (uploadedFileName != "") {
        
        BeginFileUpload(uploadedFileName, uploadedMobileFileName);
    }
    else {
        fnSaveSplashScreen(editFileName);
    }


}

function fnDoDateValidations() {
    var regexDate = /^\s*((31([-/ ])((0?[13578])|(1[02]))\3(\d\d)?\d\d)|((([012]?[1-9])|([123]0))([-/ ])((0?[13-9])|(1[0-2]))\12(\d\d)?\d\d)|(((2[0-8])|(1[0-9])|(0?[1-9]))([-/ ])0?2\22(\d\d)?\d\d)|(29([-/ ])0?2\25(((\d\d)?(([2468][048])|([13579][26])|(0[48])))|((([02468][048])|([13579][26]))00))))\s*$/;

    var validFrom = $("#txtValidFrom").val().trim();
    var validTo = $("#txtValidTo").val().trim();

    if (!regexDate.test(validFrom)) {
        $.unblockUI();
        HideModalPopup("dvloading");
        alert("Please enter Valid From date in dd/mm/yyyy format");
        return false;
    }

    if (!regexDate.test(validTo)) {
        $.unblockUI();
        HideModalPopup("dvloading");
        alert("Please enter Valid To date in dd/mm/yyyy format");
        return false;
    }

    validFrom = validFrom.split('/')[2] + "-" + validFrom.split('/')[1] + "-" + validFrom.split('/')[0];
    validTo = validTo.split('/')[2] + "-" + validTo.split('/')[1] + "-" + validTo.split('/')[0];

    if (Date.parse(validFrom) > Date.parse(validTo)) {
        $.unblockUI();
        HideModalPopup("dvloading");
        alert("Valid To date can not be less than Vaid From date")
        return false;
    }

    //if (Date.parse(validFrom) < Date.parse(todaysDate)) {
    //    $.unblockUI();
    //    alert("Valid from date can not be past date. Error on Valid From date");
    //    return false;
    //}

    //if (Date.parse(validTo) < Date.parse(todaysDate)) {
    //    $.unblockUI();
    //    alert("Notice date can not be past date. Error on Valid To date");
    //    return false;
    //}

    return true;
}
function validateFileExtenstion() {
    var uploadedFileName = $('#fileUploader').val();
    var fileExtention = uploadedFileName.substring(uploadedFileName.lastIndexOf('.'));
    if (uploadedFileName != "") {
        var extenstionArrary = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".JPG", ".JPEG", ".BMP", ".GIF", ".PNG"];
        if ($.inArray(fileExtention, extenstionArrary) <= -1) {
            alert("You can't upload " + fileExtention + " type files");
            $('#fileUploader').val('');
            $('.clsAttachment').hide();
        }
        else {
          
            if (bytesToSize(document.getElementById("fileUploader").files[0].size) > 1) {
                alert("File size should be less than or equal to 1 MB");
                $('#fileUploader').val('');
                $('.clsAttachment').hide();
            }
            else {
                //$('.clsAttachment').show();
            }
        }
    }
}
function validateMobileFileExtenstion() {
    var uploadedFileName = $('#mobileFileUploader').val();
    var fileExtention = uploadedFileName.substring(uploadedFileName.lastIndexOf('.'));
    if (uploadedFileName != "") {
        var extenstionArrary = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".JPG", ".JPEG", ".BMP", ".GIF", ".PNG"];
        if ($.inArray(fileExtention, extenstionArrary) <= -1) {
            alert("You can't upload " + fileExtention + " type files");
            $('#mobileFileUploader').val('');
            $('.clsAttachment').hide();
        }
        else {
           
            if (bytesToSize(document.getElementById("mobileFileUploader").files[0].size) > 1) {
                alert("File size should be less than or equal to 1 MB");
                $('#mobileFileUploader').val('');
                $('.clsAttachment').hide();
            }
            else {
               // $('.clsAttachment').show();
            }
        }
    }
}
function fnValidateFile() {
    var uploadedFileName = $('#fileUploader').val();
    //if (uploadedFileName == "" && saveMode != "EDIT") {
    //    HideModalPopup("dvloading");
    //    alert("Please upload a image file");

    //    $.unblockUI();
    //    return false;

    //}

    var fileExtention = uploadedFileName.substring(uploadedFileName.lastIndexOf('.'));
    if (uploadedFileName != "") {
        var extenstionArrary = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".JPG", ".JPEG", ".BMP", ".GIF", ".PNG"];
        if ($.inArray(fileExtention, extenstionArrary) <= -1) {
            $.unblockUI();
            HideModalPopup("dvloading");
            alert("You can't upload " + fileExtention + " type files");
            return false;
        }

        //if (attachmentFileSize > (parseInt(1048576) * parseInt(attachmentMaxSize))) {
        //    $.unblockUI();
        //    alert("Attachment file size can not exceed " + attachmentMaxSize + " MB");

        //    return false;
        //}
    }

    var mobileuploadedFileName = $('#mobileFileUploader').val();
    var fileExtention = mobileuploadedFileName.substring(mobileuploadedFileName.lastIndexOf('.'));
    if (mobileuploadedFileName != "") {
        var extenstionArrary = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".JPG", ".JPEG", ".BMP", ".GIF", ".PNG"];
        if ($.inArray(fileExtention, extenstionArrary) <= -1) {
            $.unblockUI();
            HideModalPopup("dvloading");
            alert("You can't upload " + fileExtention + " type files");
            return false;
        }
    }
    $.unblockUI();
    return true;
}

function fnValidateAndSave() {
    
    $.blockUI();
    ShowModalPopup("dvloading");
    var isFormValidationSuccess = false;

    isFormValidationSuccess = ValidateForm();
}

function fnSaveSplashScreen(fileName) {
    var title = '';
    Splashtype = $("input[name='optradio']:checked").val();
    if (Splashtype == "txtonly") {
        SplashtypeString = "T";
    }

    if (Splashtype == "imgonly") {
        SplashtypeString = "I";
    }

    if (Splashtype == "txtimg") {
        SplashtypeString = "B";
    }
    var splashScreenId = $('#hdnSplashId').val();
    if ($("#txtTitle").val().trim() != "") {
        title = $("#txtTitle").val().trim().replace(/&/g, "~~~");
    }
    else {
        title = '';
    }
    if (Splashtype != "imgonly") {
        description = $('.jqte_editor').html(); //$("#txtDescription").val().trim().replace(/&/g, "~~~");
    }
    var validFrom = $("#txtValidFrom").val().trim();
    var validTo = $("#txtValidTo").val().trim();

    var attachmentPath = "";
    var mobAttachmentPath = "";
    var webAttachmentPath = "";
    if (Splashtype != "txtonly") {
        var webAttachmentPath = fileName[0];
        if ($('input[type=radio][name=rdAttachment]:checked').val() == 0) {
            mobAttachmentPath = fileName[0];
        }
        else {
            mobAttachmentPath = fileName[1];
        }
    // var mobAttachmentPath = fileName[1];
        if (webAttachmentPath == undefined || webAttachmentPath == null) {
            webAttachmentPath = ''
        }
        if (mobAttachmentPath == undefined || mobAttachmentPath == null) {
            mobAttachmentPath = ''
        }
    }
    debugger;
    if (Splashtype != "imgonly") {
        var descText = $('.jqte_editor').text();
        description = encodeURIComponent(description.replace(/'/g, '').replace(/</g, 'á').replace(/>/g, 'í').replace(/\//g, 'ó').replace(/"/g, 'ú').replace(/~/g, '_'));
    }
    if (Splashtype == "imgonly") {
            descText = '';
            description = '';
        }
        if (Splashtype == "imgonly" || Splashtype == "txtimg") {
            if ($('#editfilepathlink').html() == " ") {
                if ($("#fileUploader").val() == " ") {
                    $.unblockUI();
                    HideModalPopup("dvloading");
                    alert("Attachment should not be empty");
                    return false;
                }
            }
        }

    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/SaveSplashScreenData',
        type: "POST",
        data: "splashScreenId=" + splashScreenId + "&Splashtype=" + SplashtypeString + "&title=" + title + "&description=" + descText + "&validFrom=" + validFrom + "&validTo=" + validTo + "&fileName=" + webAttachmentPath + "&saveMode=" + saveMode + "&descHtml=" + description + "&mobileFileName=" + mobAttachmentPath + "",
        success: function (response) {
            //if (response.indexOf("SUCCESS") >= 0) {
            if (response.split(':')[0] == "SUCCESS") {
                fnClearForm();
                fnFillSummaryGrid();

                $.unblockUI();
                HideModalPopup("dvloading");
                fnMsgAlert('success', 'Splash Screen', 'Saved Successfully');
                $('.clsUserMap').hide();
                $('.clsSplashCreation').show();
                $('.clsSpecUser').hide();
                $('.clsSpecGroup').hide();
                $('#hdnSplashId').val(response.split(':')[1]);
            }
            else {
                fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to save your data');
                $.unblockUI();
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to save your data');
            $.unblockUI();
            HideModalPopup("dvloading");
        }
    });
}

function fnEditSplashScreen(splashScreenId) {
    debugger;
    fnClearForm();
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/EditSplashScreen',
        type: "POST",
        data: "splashScreenId=" + splashScreenId + "",
        success: function (response) {
            var editObj = response;
            fnSetDataForEdit($.parseJSON(editObj));
        },
        error: function () {
            fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to get your data for edit');
            $.unblockUI();
        }
    });
}

function fnSetDataForEdit(editObj) {
    debugger;
    fnClearForm();
    $("#txtTitle").val(editObj.Title);
    SplashtypeString = editObj.Splash_Type;
    if (editObj.Description_HTML != "") {
        $('#txt').prop('checked', true);
        $("#attachmnt").hide();
        $("#lbldesc").show();
    }
    if (editObj.File_Path != "") {
        $('#img').prop('checked', true);
        $("#lbldesc").hide();
        $("#attachmnt").show();
    }
    if (editObj.Description_HTML != "" && editObj.File_Path != "") {
        $('#txtimg').prop('checked', true);
        $("#lbldesc").show();
        $("#attachmnt").show();
    }
    if (SplashtypeString == "T")
    {
        $('#txt').prop('checked', true);
        $("#attachmnt").hide();
        $("#lbldesc").show();
    }
    if (SplashtypeString == "I") {
        $('#img').prop('checked', true);
        $("#lbldesc").hide();
        $("#attachmnt").show();
    }
    if (SplashtypeString == "B") {
        $('#txtimg').prop('checked', true);
        $("#lbldesc").show();
        $("#attachmnt").show();
    }

    //  $("#txtDescription").val(editObj.Description);
    $('.jqte_editor').html(editObj.Description_HTML)
    $("#txtValidFrom").val(fnChangeDateFormat(editObj.Date_From));
    $("#txtValidTo").val(fnChangeDateFormat(editObj.Date_To));
    splashScreenId_Edit = editObj.Splash_Screen_Id;
    var editfilepath = editObj.File_Path;
    $('#imgSplash').removeAttr("src");
    if (editfilepath != '' && editfilepath != null && editfilepath != undefined) {
        $('#imgSplash').attr("src", editfilepath);
    }
    var companyCode = editObj.Company_Code;
    if (editObj.File_Path == editObj.Mobile_Attachment_Url) {
        $('input[type=radio][name=rdAttachment][value=0]').prop('checked', true);
    }
    else {
        $('input[type=radio][name=rdAttachment][value=1]').prop('checked', true);
    }
    $('#link').show();
    if (editfilepath != "undefined" && editfilepath != '' && editfilepath != null && editfilepath != undefined) {
        editFileName.push(editfilepath);
        $('#editfilepathlink').attr("href", "https://nbfiles.blob.core.windows.net/" + companyCode + "/" + editfilepath);
        $('#editfilepathlink').html(editFileName[0]);
        editFilePath.push("https://nbfiles.blob.core.windows.net/" + companyCode + "/" + editfilepath);
    }
    else {
        editFilePath.push("");
    }
    if (editObj.Mobile_Attachment_Url != "undefined" && editObj.Mobile_Attachment_Url != '' && editObj.Mobile_Attachment_Url != null && editObj.Mobile_Attachment_Url != undefined) {
        editFileName.push(editObj.Mobile_Attachment_Url);

        $('#editMobilefilepathlink').attr("href", "https://nbfiles.blob.core.windows.net/" + companyCode + "/" + editObj.Mobile_Attachment_Url);
        $('#editMobilefilepathlink').html(editFileName[1]);
        editFilePath.push("https://nbfiles.blob.core.windows.net/" + companyCode + "/" + editObj.Mobile_Attachment_Url);
    }
    else {
        editFilePath.push("");
    }

    saveMode = "EDIT";
    $.unblockUI();
    $('#hdnSplashId').val(editObj.Splash_Screen_Id);
}

function fnChangeDateFormat(date) {
    var returnValue = date.substring(0, 10);

    returnValue = returnValue.split('-')[2] + "/" + returnValue.split('-')[1] + "/" + returnValue.split('-')[0];

    return returnValue;
}

function fnChangeSplashScreenStatus(splashScreenId, currentStatus, validFrom, validTo) {
    fnClearForm();

    // if (currentStatus.toUpperCase() == "INACTIVE") {
    //$.ajax({
    //    url: '../HiDoctor_Master/SplashScreen/CheckOverlappingSplashScreenData',
    //    type: "POST",
    //    data: "splashScreenId=" + splashScreenId + "&validFrom=" + validFrom + "&validTo=" + validTo + "&saveMode=" + saveMode + "",
    //    success: function (response) {
    //        if (response == "ERROR") {
    //            alert('Validity of this splash screen is overlapping with other active splash screen. Hence you are not allowed to change the status');
    //        }
    //        else {
    //$.ajax({
    //    url: '../HiDoctor_Master/SplashScreen/ChangeStatus',
    //    type: "POST",
    //    data: "splashScreenId=" + splashScreenId + "&currentStatus=" + currentStatus + "",
    //    success: function (response) {
    //        if (response == "SUCCESS") {
    //            fnFillSummaryGrid();
    //            fnMsgAlert('success', 'Splash Screen', 'Status has been changed successfully');
    //        }
    //    },
    //    error: function () {
    //        fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to change the splash screen status');
    //    }
    //});
    //        }
    //    },
    //    error: function () {
    //        fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to get splash screen data to check overlapping');
    //        return false;
    //    }
    //});
    //  }
    // else {
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/ChangeStatus',
        type: "POST",
        data: "splashScreenId=" + splashScreenId + "&currentStatus=" + currentStatus + "",
        success: function (response) {
            if (response == "SUCCESS") {
                fnFillSummaryGrid();
                fnMsgAlert('success', 'Splash Screen', 'Status has been changed successfully');
            }
        },
        error: function () {
            fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to change the splash screen status');
            $.unblockUI();
        }
    });
    //}
}

function getChildUsers() {
    entityDetails_g = "";
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/GetChildUsers',
        type: "POST",
        data: "",
        success: function (jsonResult) {
            debugger;
            //  usersJson = jsonResult;
            console.log(jsonResult);
            var divJson = jsonResult[0].Data;
            var utJson = jsonResult[1].Data;

            getSplashMappedUsers();
            var content = "";
            $.each(divJson, function (divIndex, divValue) {
                content += "<div class='checkbox checkbox-primary'><input id='divCheckbox_" + divIndex + "' class='styled' name='divisonCheck' type='checkbox' value=" + divValue.Division_Code + ">";
                content += "<label for='divCheckbox_" + divIndex + "'>" + divValue.Division_Name + "</label></div>";
            });
            $('.clsDivisions').html(content);
            content = "";
            var content = "";
            $.each(utJson, function (utIndex, utValue) {
                content += "<div class='checkbox checkbox-primary'><input id='UTCheckbox_" + utIndex + "' class='styled' name='utCheck' type='checkbox' value=" + utValue.User_Type_Code + ">";
                content += "<label for='UTCheckbox_" + utIndex + "'>" + utValue.User_Type_Name + "</label></div>";
            });
            $('.clsUserTypes').html(content);
             
            $('.clsUserMap').hide();
            $('.clsSplashCreation').hide();
            $('.clsSpecUser').show();
            $('.clsSpecGroup').hide();
        },
        error: function () {
            $.unblockUI();
            //  fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to get splash screen data to check overlapping');
            // return false;
        }
    });
}

function fnGetSelectedUserTypes()
{
    debugger;
    var divisionCode = '';
    var divisionCode_String = '';
    var divisionCode = $('input[name=divisonCheck]:checked').each(function () { });
    var divisionCode_Lgnth = $("input[name='divisonCheck']:checked").length;
    if (divisionCode_Lgnth > 0) {
    for (var i = 0; i < divisionCode_Lgnth; i++) {
        divisionCode_String += divisionCode[i].defaultValue;
        if (i < divisionCode_Lgnth-1) {
            divisionCode_String += ",";
        }
    }
            $('#btnAssign').show();
    }
    else {
        $('#btnAssign').hide();
        fnMsgAlert('info', 'Info', 'Please select any one division');
        return;
    }
    var UserTypeCode = '';
    var User_Type_String = '';
    UserTypeCode = $("input[name='utCheck']:checked").each(function () { });
    var USerType_Lgnth = $("input[name='utCheck']:checked").length;
    for (var i = 0; i < USerType_Lgnth; i++) {
        User_Type_String += UserTypeCode[i].defaultValue;
        if (i < USerType_Lgnth-1) {
            User_Type_String += ",";
        }
    }
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/GetselectedUserTypes',
        type: "POST",
        data: "divisionCodes=" + divisionCode_String + "&UserTypeCodes=" + User_Type_String,
        success: function (jsonResult) {
            debugger;
            if (jsonResult != false && jsonResult != '' && jsonResult != null) {
                $("#tree").dynatree("getRoot").visit(function (node) {
                    var user = jsonPath(jsonResult, "$.[?(@.User_Code=='" + node.data.key + "')]");
                    if (user.length > 0) {
                        node.select(true);
                    }
                });
                $('#spnSelectedUsers').html('No of Selected users : ' + selKeys.length);
                $.unblockUI();
            }
        },
        error: function () {
            $.unblockUI();
        }
    });
}

function getSplashMappedUsers() {
    //$.blockUI();
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/GetSplashMappedUsers',
        type: "POST",
        data: "splashId=" + $('#hdnSplashId').val(),
        success: function (jsonResult) {
            console.log(jsonResult); 
            debugger;
            if (jsonResult != false && jsonResult != '' && jsonResult != null) {
                $("#tree").dynatree("getRoot").visit(function (node) {
                    var user = jsonPath(jsonResult, "$.[?(@.User_Code=='" + node.data.key + "')]");
                    if (user.length > 0) {
                        node.select(true);
                    }
                    else {
                        node.select(false);
                    }
                });
                $('#spnSelectedUsers').html('No of Selected users : ' + selKeys.length);
                $('#spnSelectedGrpUsers').html('No of Selected users : ' + selKeys.length);
                $.unblockUI();
            }
        },
        error: function () {
            $.unblockUI();
            //  fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to get splash screen data to check overlapping');
            // return false;
        }
    });
}
function getGroupDetails() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/GetGroupDetails',
        type: "POST",
        data: "",
        success: function (jsonResult) {
            var GrpJson = jsonResult;
            debugger;
            getSplashMappedUsersforGroups();
            //var content = "";
            //for (var l = 0; l < GrpJson.length; l++) {

            //    content += "<input id='radio_" + l + "' class='styled' name='GroupIDradio' onclick=fnGetTreeUserCode(" + GrpJson[l].Group_ID + ","+l+") type='radio' value=" + GrpJson[l].Group_ID + ">";
            //    content += "<label for='radio_" + l + "'>" + GrpJson[l].Group_Name + "</label> <br>";
                
            //}
            var content = "";
            $.each(GrpJson, function (utGrpIndex, utGrpValue) {
                content += "<div class='checkbox checkbox-primary'><input id='UTGrpCheckbox_" + utGrpIndex + "' class='styled' name='utGrpCheck' type='checkbox' value=" + utGrpValue.Group_ID + ">";
                content += "<label for='UTGrpCheckbox_" + utGrpIndex + "'>" + utGrpValue.Group_Name + "</label></div>";
                //UserTypeCode = $("input[name='utCheck']:checked").val();
            });
            $('.clsUserGroups').html(content);
            $('.clsUserMap').hide();
            $('.clsSplashCreation').hide();
            $('.clsSpecUser').hide();
            $('.clsSpecGroup').show();
            $.unblockUI();
        },
        error: function () {
            $.unblockUI();
            //  fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to get splash screen data to check overlapping');
            // return false;
        }
    });
   
}

function getSplashMappedUsersforGroups() {
    debugger;
    //$.blockUI();
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/GetSplashMappedUsers',
        type: "POST",
        data: "splashId=" + $('#hdnSplashId').val(),
        success: function (jsonResult) {
            console.log(jsonResult);
            debugger;
            if (jsonResult != false && jsonResult != '' && jsonResult != null) {
                $("#dvusertree").dynatree("getRoot").visit(function (node) {
                    var grpuser = jsonPath(jsonResult, "$.[?(@.User_Code=='" + node.data.key + "')]");
                    if (grpuser.length > 0) {
                        node.select(true);
                    }
                    else {
                        node.select(false);
                    }
                });
                $('#spnSelectedGrpUsers').html('No of Selected users : ' + selKeys.length);
                $.unblockUI();
            }
        },
        error: function () {
            $.unblockUI();
            //  fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to get splash screen data to check overlapping');
            // return false;
        }
    });
}

function fnGetSelectedGroups()
{
    debugger;
    var GroupCode = '';
    var GroupCode_String = '';
    GroupCode = $("input[name='utGrpCheck']:checked").each(function () { });
    var GroupCode_Lgnth = $("input[name='utGrpCheck']:checked").length;
    for (var i = 0; i < GroupCode_Lgnth; i++) {
        debugger;
        GroupCode_String += GroupCode[i].defaultValue;
        if (i < GroupCode_Lgnth - 1) {
            GroupCode_String += ",";
        }
    }
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/GetselectedGroupCodes',
        type: "POST",
        data: "GroupCodes=" + GroupCode_String,
        success: function (jsonResult) {
            debugger;
            if (jsonResult != false && jsonResult != '' && jsonResult != null) {
                $("#dvusertree").dynatree("getRoot").visit(function (node) {
                    var grpuser = jsonPath(jsonResult, "$.[?(@.User_Code=='" + node.data.key + "')]");
                    if (grpuser.length > 0) {
                        node.select(true);
                    }
                });
                $('#spnSelectedGrpUsers').html('No of Selected users : ' + selKeys.length);
                $.unblockUI();
            }
        },
        error: function () {
            $.unblockUI();
        }
    });
}


//function fnGetTreeUserCode(GroupId,RadioVal) {
//    debugger;
//    $.blockUI();
//    //$("#dvUserTree").html();
//    //fnBindUserTreeWithCheckBoxDoubleClick("dvusertree");
//   // $("span").removeClass("dynatree-selected");
//    $.ajax({
//        type: "POST",
//        url: '../Hidoctor_Activity/NoticeBoard/GetUserCodesForTree',
//        data: "Group_Id=" + GroupId,
//        success: function (resp) {
//            debugger;
//            entityDetails_g = '';
          
//                if (resp.length != '') {
//                    entityDetails_g = resp;
//                }
//                if (resp.length <= 0) {
//                    $.unblockUI();
//                    fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to assign an Empty Group to Splash');
//                    $("#radio_" + RadioVal).prop('checked', false);
//                    return false;
                   
//                }
//            $(".dynatree-title:contains(" + entityDetails_g + ")").parent().addClass('dynatree-selected');
//            CheckedUser();
//        }
//    })
//}

var entityDetails_g = "";
function CheckedUser() {
    debugger;
    if (entityDetails_g != '' && entityDetails_g != undefined) {
        $("#dvusertree").dynatree("getRoot").visit(function (node) {
            var disJson = jsonPath(entityDetails_g, "$.[?(@.Entity_Code=='" + node.data.key + "')]");
            if (disJson.length > 0) {
                node.select(true);
            }
        });
        $('#spnSelectedGrpUsers').html('No of Selected users : ' + selKeys.length);
        $.unblockUI();
    }
}
function selectUsers() {
    var divisionCode = '';
    var divisionCode = $('input[name=divisonCheck]:checked').map(function () {
        return $(this).val();
    }).get();
    var userTypeCodes = $('input[name=utCheck]:checked').map(function () {
        return $(this).val();
    }).get();
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/GetUnderUsersByDivisionAndUT',
        type: "POST",
        data: "divisionCodes=" + (divisionCode + ",") + "&userTypeCodes=" + (userTypeCodes + ",") + "",
        success: function (jsonResult) {
            
            //$.each(jsonResult, function (index, value) {
            
            $("#tree").dynatree("getRoot").visit(function (node) {
                var user = jsonPath(jsonResult, "$.[?(@.User_Code=='" + node.data.key + "')]");
                if (user.length > 0) {
                    node.select(true);
                }
                else {
                    node.select(false);
                }
            });
            $('#spnSelectedUsers').html('No of Selected users : ' + selKeys.length);
            //$("#tree").dynatree("getRoot").visit(function (node) {
            //    
            //    if (node.data.key == value.User_Code) {
            //        node.checked = true;
            //    }
            //});
            //});
            $.unblockUI();
        },
        error: function () {
            $.unblockUI();
        }
    });

}

function assignToAllUsers() {
    assignUsers("", 1, "R");
}
function assignToSleectiveUsers(mode) {
    var selectedUsers = selKeys.join(',');
    assignUsers(selectedUsers, 0, mode);
}

function assignUsers(users, assignToAll, mode) {
    debugger;
    $.blockUI();
    var splashScreenId = $('#hdnSplashId').val();
    Splashtype = $("input[name='optradio']:checked").val();
    if (Splashtype == "txtonly") {
        SplashtypeString = "T";
    }

    if (Splashtype == "imgonly") {
        SplashtypeString = "I";
    }

    if (Splashtype == "txtimg") {
        SplashtypeString = "B";
    }
    $.ajax({
        url: '../HiDoctor_Master/SplashScreen/InsertSplashUsers',
        type: "POST",
        data: "splashId=" + splashScreenId + "&Splashtype=" + SplashtypeString + "&users=" + users + "&isAssignToAll=" + assignToAll + "&mode=" + mode + "",
        success: function (response) {
            if (response.split(":")[0] == "SUCCESS") {
                fnClearForm();
                fnFillSummaryGrid();

                //$.unblockUI();
                HideModalPopup("dvloading");
                fnMsgAlert('success', 'Splash Screen', 'User(s) successfully assigned to splash message');
                $('.clsUserMap').hide();
                $('.clsSplashCreation').show();
                $('.clsSpecUser').hide();
                $('.clsSpecGroup').hide();
                $("span").removeClass("dynatree-selected");
                $.unblockUI();
            }
            else {
                fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to assign the users');
                $.unblockUI();
            }
        },
    });
}
function fnShowImagePreview(input) {
    
    var imgUrl = $('#fileUploader').val();
    if ($.trim(imgUrl) != '') {
        if ($.browser.msie) {
            var imgUrl = $('#fileUploader').val().replace(/C:\\fakepath\\/i, '');
            var fileName = $('#fileUploader').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
            var arFileName = $('#fileUploader').val().replace(/C:\\fakepath\\/i, '').split('\\').pop().split('.');
            arFileName.reverse();

            if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                 arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF" || arFileName[0].toUpperCase() == "TIF") {

            }
            else {

            }
        }
        else {
            //var input = $('#txtSurImg');
            if ($('#fileUploader').prop("files")[0] != null) {
                var fileName = $('#fileUploader').prop("files")[0].name;
                var arFileName = $('#fileUploader').prop("files")[0].name.split('.');
                var fileNameAlone = arFileName[0];
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                   arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF" || arFileName[0].toUpperCase() == "TIF") {
                    //if (input.files[0].size <= QUESTIONS.maxImageSize) {
                    var filerdr = new FileReader();
                    filerdr.onload = function (e) {
                        $('#imgSplash').attr('src', e.target.result);
                    }
                    filerdr.readAsDataURL(input.files[0]);

                }
                else {
                }
            }
        }
    }
    else {
    }
}
function previewSplash() {
    debugger;
    Splashtype = $("input[name='optradio']:checked").val();
    if (Splashtype == "txtonly") {
        $('.splashTitle').html($('#txtTitle').val());
        $('.splashContent').html($('.jqte_editor').html());
        ShowModalPopup('splashPreviewtxt');
    }

    if (Splashtype == "imgonly") {
        $('.splashTitle').html($('#txtTitle').val());
        if (saveMode == "EDIT") {
            var imgUrl = $('#fileUploader').val();
            $('.splashImg').html($('#imgSplash'));
            if ($.trim(imgUrl) == '') {
                $('#imgSplash').removeAttr("src");
                $('#imgSplash').attr("src", editFilePath[0]);
            }
        }
        else {
            var imgUrl = $('#fileUploader').val();
            $('.splashImg').html($('#imgSplash'));
            if ($.trim(imgUrl) == '') {
                $('#imgSplash').removeAttr("src");
                $('#imgSplash').attr("src", editFilePath[0]);
            }
        }
        ShowModalPopup('splashPreviewimg');
    }

    if (Splashtype == "txtimg") {
        var Title = $('#txtTitle').val();
        if (Title == '') {

        }
        $('.splashTitle').html($('#txtTitle').val());
        $('.splashContent').html($('.jqte_editor').html());
        if (saveMode == "EDIT") {
            var imgUrl = $('#fileUploader').val();
            if ($.trim(imgUrl) == '') {
                $('#imgSplash').removeAttr("src");
                $('#imgSplash').attr("src", editFilePath[0]);
            }
        }
        ShowModalPopup('splashPreview');
    }

}
function bytesToSize(bytes) {
    //var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    //if (bytes == 0) return '0 Byte';
    //var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    //return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    return (bytes / 1048576).toFixed(3);
}
////////////////////////////// Attachment upload //////////////////////////////////////////////////////////////////

/// <reference path="jquery-1.8.2.js" />
/// <reference path="_references.js" />

var maxRetries = 3;
var blockLength = 1048576;
var numberOfBlocks = 1;
var currentChunk = 1;
var retryAfterSeconds = 3;
var uploadedFiles = [];
var allFiles = new Array();
function BeginFileUpload(fileName, uploadedMobileFileName) {
    var name = fileName;
    var fileControl = document.getElementById("fileUploader");
    var mobileFileControl = document.getElementById("mobileFileUploader");

    if (mobileFileControl.files != null && mobileFileControl.files.length > 0) {
        if ($('input[type=radio][name=rdAttachment]:checked').val() == 1) {
            allFiles = allFiles.concat(mobileFileControl.files)
        }
    }
    if (fileControl.files != null && fileControl.files.length > 0) {
        allFiles = allFiles.concat(fileControl.files)
    }
    if (allFiles.length > 0) {
        for (var i = 0; i < allFiles.length; i++) {
            if (i == 1) {
                name = uploadedMobileFileName;
            }
            UploadFile(allFiles[i][0], i, name, allFiles.length);
        }
    }
}

var UploadFile = function (file, index, fileName, fileCount) {
    var size = file.size;
    numberOfBlocks = Math.ceil(file.size / blockLength);
    var name = fileName;
    currentChunk = 1;

    $.ajax({
        type: "POST",
        async: false,
        url: "../HiDoctor_Master/SplashScreen/UploadAttachment",
        data: "blocksCount=" + numberOfBlocks + "&fileName=" + name + "&fileSize=" + size + "",
    }).done(function (state) {
        if (state.split(':')[0] == "SUCCESS") {
            if (file != "") {
                sendFile(file, blockLength);
            }
            uploadedFiles.push(state.split(':')[1]);
            if (fileCount == parseInt(index) + 1) {
                fnSaveSplashScreen(uploadedFiles);
            }
        }
        else {
            var message = eval('(' + state + ')');
        }
    }).fail(function () {
        alert('Error: Error while uploading attachment');
    });

}

var sendFile = function (file, chunkSize) {
    var start = 0,
        end = Math.min(chunkSize, file.size),
        retryCount = 0,
        sendNextChunk, fileChunk;

    sendNextChunk = function () {
        fileChunk = new FormData();

        if (file.slice) {
            fileChunk.append('Slice', file.slice(start, end));
        }
        else if (file.webkitSlice) {
            fileChunk.append('Slice', file.webkitSlice(start, end));
        }
        else if (file.mozSlice) {
            fileChunk.append('Slice', file.mozSlice(start, end));
        }
        else {
            alert(operationType.UNSUPPORTED_BROWSER);
            return;
        }
        jqxhr = $.ajax({
            async: true,
            url: ('../HiDoctor_Master/SplashScreen/UploadChunk?id=' + currentChunk),
            data: fileChunk,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST'
        }).fail(function (request, error) {
            if (error !== 'abort' && retryCount < maxRetries) {
                ++retryCount;
                setTimeout(sendNextChunk, retryAfterSeconds * 1000);
            }

            if (error === 'abort') {
                alert("Aborted");
            }
            else {
                if (retryCount === maxRetries) {
                    alert("Upload timed out.");
                    resetControls();
                    uploader = null;
                }
                else {
                    alert("Resuming Upload");
                }
            }

            return;
        }).done(function (notice) {
            if (notice.error || notice.isLastBlock) {
                return;
            }

            ++currentChunk;
            start = (currentChunk - 1) * blockLength;
            end = Math.min(currentChunk * blockLength, file.size);
            retryCount = 0;
            updateProgress();
            if (currentChunk <= numberOfBlocks) {
                sendNextChunk();
            }

        });
    }
    sendNextChunk();
}

var displayStatusMessage = function (message) {
    //$("#statusMessage").html(message);
    //alert(message)
}

var updateProgress = function () {
    //$("#progressBar").css('display', '');
    //var progress = currentChunk / numberOfBlocks * 100;
    //if (progress <= 100) {
    //    $("#progressBar").progressbar("option", "value", parseInt(progress));
    //    displayStatusMessage("Uploaded " + parseInt(progress) + "%");
    //}

}
function hasWhiteSpace(s) {
    return /\s/g.test(s);
}
////////////////////////////// Attachment upload //////////////////////////////////////////////////////////////////