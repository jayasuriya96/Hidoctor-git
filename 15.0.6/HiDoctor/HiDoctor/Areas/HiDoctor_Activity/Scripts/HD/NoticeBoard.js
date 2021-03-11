var isEditMode = "";
var msgCodeforEdit = "";
function fnLoadControls() {
    fnBindDistributionTypes();
    fnLoadAllTrees();
    fnFillAllCheckBoxes();
    fnFillSummaryGrid();
    SetDefautlSelection();
    $("#dvOverlay").overlay().load();
}
var editFileName = "";
function fnBindDistributionTypes() {
    $("#divDistTypeAll").hide();
    $("#divDistTypeUsers").hide();
    $("#divDistTypeRegions").hide();
    $("#divDistTypeMyTeam").hide();
    $("#divDistTypeGroup").hide();

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/NoticeBoard/GetDistributionTypes',
        success: function (response) {
            var distributionType = response;
            var arrDistributionType = distributionType.split(',');

            for (var i = 0; i < arrDistributionType.length; i++) {
                if (arrDistributionType[i] == "ALL") {
                    $("#divDistTypeAll").show();
                }
                else if (arrDistributionType[i] == "SHOW_USERS") {
                    $("#divDistTypeUsers").show();
                }
                else if (arrDistributionType[i] == "SHOW_REGIONS") {
                    $("#divDistTypeRegions").show();
                }
                else if (arrDistributionType[i] == "MY_TEAM") {
                    $("#divDistTypeMyTeam").show();
                }
                else if (arrDistributionType[i] == "GROUP") {
                    $("#divDistTypeGroup").show();
                }
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get the distribution types');
        }
    });
}

function fnLoadAllTrees() {
    fnLoadAllUserTree();
    fnLoadUserTree();
    fnLoadRegionTree();
    fnLoadMyTeamUserTree();
    fnLoadGroupTree();
}

function fnLoadAllUserTree() {
    var displayType = $('#rdoDistTypeAll').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        fnBindFullUserTreeWithCheckBox("divAllUserTree");
        $("#divAllUserTree").hide();
    }
}

function fnLoadUserTree() {
    var displayType = $('#rdoDistTypeUsers').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        fnBindFullUserTreeWithCheckBox("divUserTree");
        $("#divUserTree").hide();
    }
}

function fnLoadRegionTree() {
    var displayType = $('#rdoDistTypeRegions').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        fnBindFullRegionTreeWithCheckbox("divRegionTree");
        $("#divRegionTree").hide();
    }
}

function fnLoadMyTeamUserTree() {
    var displayType = $('#rdoDistTypeMyTeam').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        fnBindUserTreeWithCheckBox("divMyTeamTree");
        $("#divMyTeamTree").hide();
    }
}

function fnLoadGroupTree() {
    var displayType = $('#rdoDistTypeGroup').css('display').toLowerCase();
    if (displayType.indexOf("block") >= 0) {
        fnBindUserTreeWithCheckBoxGroup("divGroupTree");
        $("#divGroupTree").hide();
    }
}

function fnFillAllCheckBoxes() {
    fnFillUserTypecCheckBoxes();
    fnFillRegionTypeCheckBoxes();
    fnFillUserTypesUnderMeCheckBoxes();
    fnFillDivisionsCheckboxes();
    fnFillUserTypecCheckBoxes();
    fnFillGroupCheckBoxes();
}

function fnFillGroupCheckBoxes() {
    debugger;
    //$.ajax({
    //    url: '../HiDoctor_Master/SplashScreen/GetGroupDetails',
    //    // url: '../HiDoctor_Activity/NoticeBoard/GetGroupDetails',
    //    type: "POST",
    //    data: "",
    //    success: function (jsonResult) {
    //        var GrpJson = jsonResult;
    //        debugger;
    //        var content = "";
    //        for (var l = 0; l < GrpJson.length; l++) {
    //            content += "<input type='checkbox_" + l + "' name='GroupIDcheck' onclick='fnGetTreeUserCode(" + GrpJson[l].Group_ID + ")'type='radio' value=" + GrpJson[l].Group_ID + ">";
    //            content += "<label for='checkbox_" + l + "'>" + GrpJson[l].Group_Name + "</label> <br>";
    //        }
    //        $('#divUserGroupCheckBoxes').html(content);
    //        $.unblockUI();
    //    },
    //    error: function () {
    //        $.unblockUI();
    //    }
    //});
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/NoticeBoard/GetGroupDetails',
        data: 'A',
        success: function (response) {
            if (response != null && response != "") {
                $('#divUserGroupCheckBoxes').html(response);
            }
            else {
                $('#divUserGroupCheckBoxes').html('No Groups found');
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get the Group names');
        }
    });
    $("#divUserGroup").hide();
}
function fnFillDivisionsCheckboxes() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/NoticeBoard/GetAllDivision',
        data: 'A',
        success: function (response) {
            if (response != null && response != "") {
                $('#divDivionsCheckBoxes').html(response);
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get the user type names');
        }
    });

    $("#divDivision").hide();
}


function fnFillUserTypecCheckBoxes() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/NoticeBoard/GetAllUserTypes',
        data: 'A',
        success: function (response) {
            if (response != null && response != "") {
                $('#divUserTypeCheckBoxes').html(response);
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get the user type names');
        }
    });

    $("#divUserType").hide();
}

function fnFillRegionTypeCheckBoxes() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/NoticeBoard/GetAllRegionTypes',
        data: 'A',
        success: function (response) {
            if (response != null && response != "") {
                $('#divRegionTypeCheckBoxes').html(response);
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get the region type names');
        }
    });

    $("#divRegionType").hide();
}

function fnFillUserTypesUnderMeCheckBoxes() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/NoticeBoard/GetUserTypesUnderMe',
        data: 'A',
        success: function (response) {
            if (response != null && response != "") {
                $('#divUserTypesUnderMeCheckBoxes').html(response);
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get the user type names under you');
        }
    });

    $("#divUserTypesUnderMe").hide();
}

function fnFillSummaryGrid() {
    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/GetAllNotices',
        type: "POST",
        success: function (response) {
            if (response != "") {
                $("#divSummaryGrid").html(response);
                $.unblockUI();
            }
            else {
                fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get your notice board details');
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get your notice board details');
        }
    });
}

function SetDefautlSelection() {
    var displayType = $('#divDistTypeAll').css('display').toLowerCase();
    $("#divisionLable").hide();
    if (displayType.indexOf("block") >= 0) {
        $("#rdoDistTypeAll").prop("checked", true);

    }

    $("#rdoPriorityMedium").prop("checked", true);
    $("#rdoAckReqdNo").prop("checked", true);

    $("#rdoOnlyTickerNo").prop("checked", true);
    $("#rdoHighlightNo").prop("checked", true);

    saveMode = "NEW";
    msgCode_edit = "";
    selectedKeys = "";
}

function fnClearForm() {
    $("#txtTitle").val("");
    $("#txtMessage").val("");
    $("#txtHyperlink").val("");
    $("#txtValidFrom").val("");
    $("#txtValidTo").val("");
    var fileControl = document.getElementById("fileUploader");
    fileControl.value = "";
    $("#divDivision").hide();
    SetDefautlSelection();
    fnShowTree();
    fnClearAllCheckBoxes();
    fnClearAllTrees();

    $('#link').hide();
    editFileName = "";
}

function fnShowTree() {
    debugger;
    var distributionType = $('input:radio[name=rdoDistType]:checked').val();

    $("#divAllUserTree").hide();
    $("#divUserTree").hide();
    $("#divRegionTree").hide();
    $("#divMyTeamTree").hide();

    $("#divUserType").hide();
    $("#divRegionType").hide();
    $("#divUserTypesUnderMe").hide();

    $("#divGroupTree").hide();
    $("#divUserGroup").hide();
    $("#divisionLable").text('Division Name');

    if (distributionType == "M") {
        $("#divMyTeamTree").show();
        $("#divUserTypesUnderMe").show();
        $("#divDivision").show();
        $("input[name='chck_RT']:checkbox").prop('checked', false);
        $("input[name='chck_DV']:checkbox").prop('checked', false);
        $("input[name='chck_UT']:checkbox").prop('checked', false);
        $("input[name='chk_DV_ALL']:checkbox").prop('checked', false);
        $("#divisionLable").show();
    }
    else if (distributionType == "R") {
        $("#divRegionTree").show();
        $("#divRegionTypeCheckBoxes").show();
        $("#divRegionType").show();
        $("#divDivision").show();
        $("input[name='chck_UT']:checkbox").prop('checked', false);
        $("input[name='chck_DV']:checkbox").prop('checked', false);
        $("input[name='chck_UTALL']:checkbox").prop('checked', false);
        $("input[name='chk_DV_ALL']:checkbox").prop('checked', false);
        $("#divisionLable").show();
    }
    else if (distributionType == "U") {
        $("#divUserTree").show();
        $("#divUserTypeCheckBoxes").show();
        $("#divUserType").show();
        $("#divDivision").show();
        $("input[name='chck_RT']:checkbox").prop('checked', false);
        $("input[name='chck_DV']:checkbox").prop('checked', false);
        $("input[name='chk_DV_ALL']:checkbox").prop('checked', false);
        $("#divisionLable").show();
    }
    else if (distributionType == "A") {
        $("#divAllUserTree").hide();
        $("#divDivision").hide();
        $("input[name='chck_UT']:checkbox").prop('checked', false);
        $("input[name='chck_DV']:checkbox").prop('checked', false);
        $("input[name='chck_RT']:checkbox").prop('checked', false);
        $("input[name='chck_UTALL']:checkbox").prop('checked', false);
        $("input[name='chk_DV_ALL']:checkbox").prop('checked', false);
        $("#divisionLable").hide();

    }
    else if (distributionType == "G") {
        $("#divGroupTree").show();
        $("#divUserGroup").show();
        $("#divisionLable").show();
        $('#divUserGroupCheckBoxes').show();
        //fnFillGroupCheckBoxes();
        $("input[name='chck_RT']:checkbox").prop('checked', false);
        $("input[name='chck_UT']:checkbox").prop('checked', false);
        $("input[name='chck_DV']:checkbox").prop('checked', false);
        $("input[name='chck_UTALL']:checkbox").prop('checked', false);
        $("input[name='chk_DV_ALL']:checkbox").prop('checked', false);
        //$("#divisionLable").hide();
        $("#btnSelectUserGroup").hide();
        $("#divisionLable").text('Group Name');
        $("#divDivision").hide();
        $('input[name="chck_UG"]').prop('checked', false);
    }
}


function fnClearAllCheckBoxes() {
    fnClearUserTypeCheckBoxes();
    fnClearRegionTypeCheckBoxes();
    fnClearUserTypesUnderMeCheckBoxes();
    fnClearUserGroupCheckBoxes();
}

function fnGetAllNodeValues() {
    var displayType = $('#rdoDistTypeAll').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divAllUserTree").dynatree("getRoot").visit(function (node) {
            node.select(true);
        });
    }
}

function fnClearUserGroupCheckBoxes()
{
    var displayType = $('#rdoDistTypeGroup').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $('#divUserGroupCheckBoxes :checked').each(function () {
            $(this).prop("checked", false);
    });
}
}

function fnClearUserTypeCheckBoxes() {
    var displayType = $('#rdoDistTypeUsers').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $('#divUserTypeCheckBoxes :checked').each(function () {
            $(this).prop("checked", false);
        });
    }
}

function fnClearUserTypesUnderMeCheckBoxes() {
    var displayType = $('#rdoDistTypeMyTeam').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $('#divUserTypesUnderMeCheckBoxes :checked').each(function () {
            $(this).prop("checked", false);
        });
    }
}

function fnClearRegionTypeCheckBoxes() {
    var displayType = $('#rdoDistTypeRegions').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $('#divRegionTypeCheckBoxes :checked').each(function () {
            $(this).prop("checked", false);
        });
    }
}

function fnClearAllTrees() {
    var displayType = $('#rdoDistTypeAll').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divAllUserTree").dynatree("getRoot").visit(function (node) {
            node.select(false);
        });
    }

    displayType = $('#rdoDistTypeUsers').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divUserTree").dynatree("getRoot").visit(function (node) {
            node.select(false);
        });

        fnClearUserTypeCheckBoxes();
    }

    displayType = $('#rdoDistTypeRegions').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divRegionTree").dynatree("getRoot").visit(function (node) {
            node.select(false);
        });

        fnClearRegionTypeCheckBoxes();
    }

    displayType = $('#rdoDistTypeMyTeam').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divMyTeamTree").dynatree("getRoot").visit(function (node) {
            node.select(false);
        });
    }

    displayType = $('#rdoDistTypeGroup').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divGroupTree").dynatree("getRoot").visit(function (node) {
            node.select(false);
        });
    }

}

function fnSelectUsers() {

    var displayType = $('#rdoDistTypeUsers').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divUserTree").dynatree("getRoot").visit(function (node) {
            node.select(false);
        });

        var selectedValues = [];
        var DivisonselectedValues = [];

        $('#divDivionsCheckBoxes :checked').each(function () {
            DivisonselectedValues.push($(this).val());
        });

        var countDiv = DivisonselectedValues.length;

        if (countDiv == 0) {
            alert("Please select at least one division");
            return false;
        }



        $('#divUserTypeCheckBoxes :checked').each(function () {
            selectedValues.push($(this).val());
        });

        var count = selectedValues.length;

        if (count == 0) {
            alert("Please select at least one user type");
            return false;
        }




        fnselectUsertreedivisionwise();
    }
}


function fnselectUsertreedivisionwise() {
    var selectedval = "";
    var selecteddiv = "";
    var adjustType = $('input:checkbox[name=chck_UT]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
    }

    var adjustTypeDiv = $('input:checkbox[name=chck_DV]:checked');
    for (var intLoop = 0; intLoop < adjustTypeDiv.length; intLoop++) {
        selecteddiv += adjustTypeDiv[intLoop].value + "^";
    }

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/NoticeBoard/GetUserCodeDivisionwise',
        data: "userTypeCodes=" + selectedval + "&divisionCodes=" + selecteddiv,
        success: function (jsData) {

            jsData = eval('(' + jsData + ')');
            $("#divUserTree").dynatree("getRoot").visit(function (node) {
                var users = jsonPath(jsData, "$.[?(@.User_code=='" + node.data.key + "')]");
                if (users.length > 0) {
                    node.select(true);
                }
            });
            if (jsData[0].lstUserDetail.length == 0) {
                alert("No Users Matched")
            }
        }
    });
}

function fnSelectRegions() {
    var displayType = $('#rdoDistTypeRegions').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divRegionTree").dynatree("getRoot").visit(function (node) {
            node.select(false);
        });

        var selectedValues = [];
        var DivisonselectedValues = [];

        $('#divRegionTypeCheckBoxes :checked').each(function () {
            selectedValues.push($(this).val());
        });

        var count = selectedValues.length;

        $('#divDivionsCheckBoxes :checked').each(function () {
            DivisonselectedValues.push($(this).val());
        });

        var countDivs = DivisonselectedValues.length;

        if (countDivs == 0) {
            alert("Please select at least one division");
            return false;
        }


        if (count == 0) {
            alert("Please select at least one region type");
            return false;
        }



        //$("#divRegionTree").dynatree("getRoot").visit(function (node) {
        //    for (var i = 0; i < count; i++) {
        //        if (node.data.title.split('(')[1].trim().split(')')[0].trim() == selectedValues[i].trim()) {
        //            node.select(true);
        //        }
        //    }
        //});
        fnselectRegiontreedivisionwise();
    }
}

function fnselectRegiontreedivisionwise() {
    var selectedval = "";
    var selecteddiv = "";
    var adjustType = $('input:checkbox[name=chck_RT]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
    }

    var adjustTypeDiv = $('input:checkbox[name=chck_DV]:checked');
    for (var intLoop = 0; intLoop < adjustTypeDiv.length; intLoop++) {
        selecteddiv += adjustTypeDiv[intLoop].value + "^";
    }

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/NoticeBoard/GetRegionCodeDivisionwise',
        data: "regionsCodes=" + selectedval + "&divisionCodes=" + selecteddiv,
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            $("#divRegionTree").dynatree("getRoot").visit(function (node) {
                var regions = jsonPath(jsData, "$.[?(@.Region_Code=='" + node.data.key + "')]");
                if (regions.length > 0) {
                    node.select(true);
                }
            });
            if (jsData[0].lstUserDetail.length == 0) {
                alert("No Regions Matched")
            }
        }
    });
}

function fnSelectUsersUnderMe() {
    var displayType = $('#rdoDistTypeMyTeam').css('display').toLowerCase();

    if (displayType.indexOf("block") >= 0) {
        $("#divMyTeamTree").dynatree("getRoot").visit(function (node) {
            node.select(false);
        });

        var selectedValues = [];
        var DivisonselectedValues = [];


        $('#divDivionsCheckBoxes :checked').each(function () {
            DivisonselectedValues.push($(this).val());
        });

        var countDivs = DivisonselectedValues.length;

        if (countDivs == 0) {
            alert("Please select at least one division");
            return false;
        }


        $('#divUserTypesUnderMeCheckBoxes :checked').each(function () {
            selectedValues.push($(this).val());
        });

        var count = selectedValues.length;

        if (count == 0) {
            alert("Please select at least one user type");
            return false;
        }

        //$("#divMyTeamTree").dynatree("getRoot").visit(function (node) {
        //    for (var i = 0; i < count; i++) {
        //        if (node.data.title.split(',')[1].trim().split('(')[0].trim() == selectedValues[i].trim()) {
        //            node.select(true);
        //        }
        //    }
        //});

        fnDivisionwiseMyteam();
    }
}



function fnDivisionwiseMyteam() {
    var selectedval = "";
    var selecteddiv = "";
    var adjustType = $('input:checkbox[name=chck_UT]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
    }

    var adjustTypeDiv = $('input:checkbox[name=chck_DV]:checked');
    for (var intLoop = 0; intLoop < adjustTypeDiv.length; intLoop++) {
        selecteddiv += adjustTypeDiv[intLoop].value + "^";
    }

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/NoticeBoard/GetUserCodeDivisionwise',
        data: "userTypeCodes=" + selectedval + "&divisionCodes=" + selecteddiv,
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            var childuserCount = 0;
            $("#divMyTeamTree").dynatree("getRoot").visit(function (node) {
                var users = jsonPath(jsData, "$.[?(@.User_code=='" + node.data.key + "')]");
                if (users.length > 0) {
                    childuserCount += 1;
                    node.select(true);
                }
            });

            if (childuserCount == 0) {
                alert("No Users Matched")
            }
        }
    });


}

function ValidateForm() {
    debugger;
    if ($('input:radio[name=rdoDistType]:checked').val() == undefined) {
        $.unblockUI();
        alert("Please select distribution type");
        return false;
    }

    if ($('input:radio[name=rdoDistType]:checked').val() == "A") {
        fnGetAllNodeValues();
    }

    if (selectedKeys.length < 11) {
        $.unblockUI();
        alert("Please select atleast one user");
        return false;
    }

    if ($("#txtTitle").val().trim() == "") {
        $.unblockUI();
        alert("Please enter Title for the notice");
        return false;
    }

    if ($("#txtTitle").val().trim().length > 100) {
        $.unblockUI();
        alert("Notice board title should not exceed 100 characters");
        return false;
    }

    if ($("#txtMessage").val().trim() == "") {
        $.unblockUI();
        alert("Please enter the message");
        return false;
    }

    var isTrue;

    var hyperlink = $("#txtHyperlink").val();
    if (hyperlink != "") {
        if (!/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(hyperlink)) {
            $.unblockUI();
            alert("Invalid hyperlink. Please enter a valid web url");
            return false;
        }
    }

    if ($("#txtHyperlink").val().length > 250) {
        $.unblockUI();
        alert("Hyperlink should not exceed 250 characters");
        return false;
    }

    if ($("#txtValidFrom").val().trim() == "") {
        $.unblockUI();
        alert("Please enter Valid From date");
        return false;
    }

    if ($("#txtValidTo").val().trim() == "") {
        $.unblockUI();
        alert("Please enter Valid To date");
        return false;
    }

    isTrue = fnDoDateValidations();

    if (!isTrue) {
        return false;
    }

    isTrue = fnValidateFile();

    if (!isTrue) {
        return false;
    }

    return true;
}

function fnDoDateValidations() {
    var regexDate = /^\s*((31([-/ ])((0?[13578])|(1[02]))\3(\d\d)?\d\d)|((([012]?[1-9])|([123]0))([-/ ])((0?[13-9])|(1[0-2]))\12(\d\d)?\d\d)|(((2[0-8])|(1[0-9])|(0?[1-9]))([-/ ])0?2\22(\d\d)?\d\d)|(29([-/ ])0?2\25(((\d\d)?(([2468][048])|([13579][26])|(0[48])))|((([02468][048])|([13579][26]))00))))\s*$/;

    var validFrom = $("#txtValidFrom").val().trim();
    var validTo = $("#txtValidTo").val().trim();

    if (!regexDate.test(validFrom)) {
        $.unblockUI();
        alert("Please enter Valid From date in dd/mm/yyyy format");
        return false;
    }

    if (!regexDate.test(validTo)) {
        $.unblockUI();
        alert("Please enter Valid To date in dd/mm/yyyy format");
        return false;
    }
    debugger;
    validFrom = validFrom.split('/')[2] + "-" + validFrom.split('/')[1] + "-" + validFrom.split('/')[0];
    validTo = validTo.split('/')[2] + "-" + validTo.split('/')[1] + "-" + validTo.split('/')[0];

    if (Date.parse(validFrom) > Date.parse(validTo)) {
        $.unblockUI();
        alert("Valid To date can not be less than Vaid From date")
        return false;
    }

    if (saveMode == "EDIT") {
        var msgcode = msgCodeforEdit;
        var editFromYear = msgCodeforEdit.split('_')[1].substring(0, 4);
        var editMonth = msgCodeforEdit.split('_')[1].substring(4, 6);
        var editDate = msgCodeforEdit.split('_')[1].substring(6, 8);
    }
    var editFromDate = editFromYear + "-" + editMonth + "-" + editDate;
    var fullDate = new Date();
    var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);

    var currentDate = fullDate.getFullYear() + "/" + twoDigitMonth + "/" + fullDate.getDate();

    if (isEditMode.toUpperCase() == "TRUE") {
        if (editFromDate != validFrom) {
            if (Date.parse(validFrom) < Date.parse(currentDate)) {
                $.unblockUI();
                alert("Notice date can not be past date. Error on Valid From date");
                return false;
            }
        }
    }

    else {
        if (Date.parse(validFrom) < Date.parse(todaysDate)) {
            $.unblockUI();
            alert("Notice date can not be past date. Error on Valid From date");
            return false;
        }
    }

    //if (Date.parse(validTo) < Date.parse(todaysDate)) {
    //    $.unblockUI();
    //    alert("Notice date can not be past date. Error on Valid To date");
    //    return false;
    //}
    isEditMode = "";
    msgCodeforEdit = "";
    return true;
}

function fnValidateFile() {
    var uploadedFileName = $('#fileUploader').val();
    var fileExtention = uploadedFileName.substring(uploadedFileName.lastIndexOf('.'));
    if (uploadedFileName != "") {
        //  var extenstionArrary = [".xls", ".xlsx", ".txt", ".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".bmp", ".gif", ".zip"];
        var extenstionArrary = [".exe", ".js", ".css"];
        if ($.inArray(fileExtention, extenstionArrary) > -1) {
            $.unblockUI();
            alert("You can't upload " + fileExtention + " type files");
            return false;
        }

        if (attachmentFileSize > (parseInt(1048576) * parseInt(attachmentMaxSize))) {
            $.unblockUI();
            alert("Attachment file size can not exceed " + attachmentMaxSize + " MB");

            return false;
        }
    }
    $.unblockUI();
    return true;
}

function fnSaveNoticeBoard() {
    debugger;
    var msgCode = "";
    var msgTitle = $("#txtTitle").val().trim().replace(/&/g, "~~~");
    var msgBody = $("#txtMessage").val().trim().replace(/&/g, "~~~");
    var hyperlink = $("#txtHyperlink").val().trim().replace(/&/g, "~~~");
    var priority = $('input:radio[name=rdoPriority]:checked').val();
    var validFrom = $("#txtValidFrom").val().trim();
    var validTo = $("#txtValidTo").val().trim();
    var distType = $('input:radio[name=rdoDistType]:checked').val();
    var ackReqd = $('input:radio[name=rdoAckReqd]:checked').val();

    var showTicker = $('input:radio[name=rdoOnlyTicker]:checked').val();
    var highlight = $('input:radio[name=rdoHighlight]:checked').val();

    var selectedNodeValues = selectedKeys;
    debugger;
    if (saveMode == "EDIT") {
        msgCode = msgCode_edit;
    }


    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/SaveNoticeBoard',
        type: "POST",
        data: "MsgCode=" + msgCode + "&MsgTitle=" + msgTitle + "&MsgBody=" + msgBody + "&HyperLink=" + hyperlink + "&ValidFrom=" + validFrom + "&ValidTo=" + validTo + "&DistType=" + distType + "&AckReqd=" + ackReqd + "&FileName=" + retFileName + "&SelectedNodeValues=" + selectedNodeValues + "&SaveMode=" + saveMode + "&Priority=" + priority + "&showTicker=" + showTicker + "&highlight=" + highlight + "",
        success: function (response) {
            if (response.indexOf("SUCCESS") >= 0) {
                fnClearForm();
                fnFillSummaryGrid();

                $.unblockUI();

                fnMsgAlert('success', 'Notice Board', 'Save Successful');

                $("#progressBar").css('display', 'none');
            }
            else {
                fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to save your data');
                $("#progressBar").css('display', 'none');
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to save your data');
            $("#progressBar").css('display', 'none');
        }
    });
}

function fnValidateAndSaveNotice() {
    debugger;
    $.blockUI();
    var isFormValidationSuccess = false;
    var uploadedFileName = $('#fileUploader').val();
    var edit = $('#editfilepathlink').html();
    var filenamepath = editFileName
    isFormValidationSuccess = ValidateForm();
    debugger;
    if (isFormValidationSuccess) {

        if (saveMode != "EDIT") {
            debugger;
            if (uploadedFileName != "") {
                BeginFileUpload(uploadedFileName);
            }
            else {
                fnSaveNoticeBoard(uploadedFileName);
            }
        }
        else {
            debugger;
            if (uploadedFileName != "") {
                BeginFileUpload(uploadedFileName);
            }
            else {
                retFileName = $('#editfilepathlink').html();
                fnSaveNoticeBoard(edit);
            }

        }
    }
}


function fnEditNotice(msgCode) {
    msgCodeforEdit = msgCode;
    isEditMode = "true";
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/EditNoticeBoard',
        type: "POST",
        data: "MsgCode=" + msgCode + "",
        success: function (response) {
            var editObj = response;
            fnSetDataForEdit(editObj);
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get your data');
        }
    });
}

function fnSetDataForEdit(editObj) {
    fnClearForm();
    fnSetDistributionType(editObj.MsgDistributionType);
    $("#txtTitle").val(editObj.MsgTitle);
    $("#txtMessage").val(editObj.MsgBody);
    $("#txtHyperlink").val(editObj.MsgHyperlink);
    fnSetPriority(editObj.MsgPriority);
    $("#txtValidFrom").val(editObj.MsgValidFrom);
    $("#txtValidTo").val(editObj.MsgValidTo);
    fnSetAckReqd(editObj.MsgAcknowlendgementReqd);
    fnSetTargetUsers(editObj.MsgDistributionType, editObj.lstNoticeBoardAgent);
    var editfilepath = editObj.MsgAttachmentPath;
    var companyCode = editObj.Company_Code;
    editFileName = editfilepath
    $('#link').show();
    $('#editfilepathlink').attr("href", "https://nbfiles.blob.core.windows.net/" + companyCode + "/" + editfilepath);
    $('#editfilepathlink').html(editFileName)

    // EDIT SHOW TICKER

    if (editObj.SHOW_IN_TICKER_ONLY == "1") {
        $("#rdoOnlyTickerYes").prop("checked", true);
    }
    else {
        $("#rdoOnlyTickerNo").prop("checked", true);
    }

    if (editObj.HIGHLIGHT == "1") {

        $("#rdoHighlightYes").prop("checked", true);
    }
    else {
        $("#rdoHighlightNo").prop("checked", true);
    }

    msgCode_edit = editObj.MsgCode;
    saveMode = "EDIT";
    debugger;
    if (editObj.MsgDistributionType == 'G') {
        selectedKeys = '';
        for (var i = 0; i < editObj.lstNoticeBoardAgent.length; i++) {
            if (selectedKeys == '')
                selectedKeys = editObj.lstNoticeBoardAgent[i].MsgTargetUserCode;
            else
                selectedKeys = selectedKeys + ',' + editObj.lstNoticeBoardAgent[i].MsgTargetUserCode;
        }
    }
    $.unblockUI();
}

function fnSetDistributionType(distType) {
    if (distType == "A") {
        $("#rdoDistTypeAll").prop("checked", true);
    }
    else if (distType == "U") {
        $("#rdoDistTypeUsers").prop("checked", true);
    }
    else if (distType == "R") {
        $("#rdoDistTypeRegions").prop("checked", true);
    }
    else if (distType == "M") {
        $("#rdoDistTypeMyTeam").prop("checked", true);
    }
    else if (distType == "G") {
        $("#rdoDistTypeGroup").prop("checked", true);
    }
    fnShowTree();
}

function fnSetPriority(priority) {
    if (priority == 0) {
        $("#rdoPriorityHigh").prop("checked", true);
    }
    else if (priority == 1) {
        $("#rdoPriorityMedium").prop("checked", true);
    }
    else if (priority == 2) {
        $("#rdoPriorityLow").prop("checked", true);
    }
}

function fnSetAckReqd(ackReqd) {
    if (ackReqd == "Y") {
        $("#rdoAckReqdYes").prop("checked", true);
    }
    else {
        $("#rdoAckReqdNo").prop("checked", true);
    }
}

function fnDeleteNotice(msgCode) {
    fnClearForm();
    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/DeleteNoticeBoard',
        type: "POST",
        data: "MsgCode=" + msgCode + "",
        success: function (response) {
            if (response == "SUCCESS") {
                fnFillSummaryGrid();
                fnMsgAlert('success', 'Notice Board', 'Delete Successful');
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get your data');
        }
    });
}

function fnUserTreeSelect(select, node) {
    selectedKeys = $.map(node.tree.getSelectedNodes(), function (node) {
        return node.data.key;
    });

    selectedKeys = selectedKeys + ",";
}

function fnRegionTreeSelect(select, node) {
    selectedKeys = $.map(node.tree.getSelectedNodes(), function (node) {
        return node.data.key;
    });

    selectedKeys = selectedKeys + ",";
}

function fnSetTargetUsers(distributionType, objTargetUsers) {
    var userCount = objTargetUsers.length;
    var targetUserCode;
    var treeContorlId;

    if (distributionType == "A") {
        treeContorlId = "divAllUserTree";
    }
    else if (distributionType == "U") {
        treeContorlId = "divUserTree";
    }
    else if (distributionType == "R") {
        treeContorlId = "divRegionTree";
    }
    else if (distributionType == "M") {
        treeContorlId = "divMyTeamTree";
    }
    else if (distributionType == "G") {
        treeContorlId = "divGroupTree";
    }

    for (var i = 0; i < userCount; i++) {
        targetUserCode = objTargetUsers[i].MsgTargetUserCode;

        if ($("#" + treeContorlId).dynatree("getTree").getNodeByKey(targetUserCode) != undefined && $("#" + treeContorlId).dynatree("getTree").getNodeByKey(targetUserCode) != null) {
            $("#" + treeContorlId).dynatree("getTree").getNodeByKey(targetUserCode).select();
        }
    }
}

function fnShowReadUsers(msgCode) {
    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/GetNoticeReadStatus',
        type: "POST",
        data: "MsgCode=" + msgCode + "",
        success: function (response) {
            if (response != "") {
                $("#divModel").html(response);
                $("#dvOverlay").overlay().load();
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get notice read user details');
        }
    });
}

////////////////////////////// Attachment upload //////////////////////////////////////////////////////////////////

/// <reference path="jquery-1.8.2.js" />
/// <reference path="_references.js" />

var maxRetries = 3;
var blockLength = 1048576;
var numberOfBlocks = 1;
var currentChunk = 1;
var retryAfterSeconds = 3;

function BeginFileUpload(fileName) {
    var fileControl = document.getElementById("fileUploader");

    if (fileControl.files.length > 0) {
        if (fileControl.files.length > 0) {
            for (var i = 0; i < fileControl.files.length; i++) {
                UploadFile(fileControl.files[i], i, fileName);
            }
        }
    }
}

var retFileName = "";

var UploadFile = function (file, index, fileName) {
    var size = file.size;
    numberOfBlocks = Math.ceil(file.size / blockLength);
    var name = fileName;
    currentChunk = 1;
    name = name.replace(/&/g, 'and');
    $.ajax({
        type: "POST",
        async: false,
        url: "../HiDoctor_Activity/NoticeBoard/UploadAttachment",
        data: "blocksCount=" + numberOfBlocks + "&fileName=" + encodeURIComponent(name) + "&fileSize=" + size + "",
    }).done(function (retfileName) {
        if (retfileName != "") {
            retFileName = retfileName;
            sendFile(file, blockLength, fnSaveNoticeBoard, fnNoticeUploadFailure);

            //  fnSaveNoticeBoard(retfileName);
        }
        else {
            //var message = eval('(' + state + ')');
        }
    }).fail(function () {
        alert('Error: Error while uploading attachment');
    });
}

function fnNoticeUploadFailure() {
    alert("Upload Failed");
    $("#progressBar").css('display', 'none');
}

var sendFile = function (file, chunkSize, successCallBack, failureCallBack) {
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
            url: ('../HiDoctor_Activity/NoticeBoard/UploadChunk?id=' + currentChunk),
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
                successCallBack();
                return;
            }

            ++currentChunk;
            start = (currentChunk - 1) * blockLength;
            end = Math.min(currentChunk * blockLength, file.size);
            retryCount = 0;
            updateProgress();
            if (currentChunk <= numberOfBlocks) {
                sendNextChunk(successCallBack, failureCallBack);
            }

        });
    }
    sendNextChunk(successCallBack, failureCallBack);
}

var displayStatusMessage = function (message) {
    //$("#statusMessage").html(message);
    //alert(message)
}

//var updateProgress = function () {
//    //$("#progressBar").css('display', '');
//    //var progress = currentChunk / numberOfBlocks * 100;
//    //if (progress <= 100) {
//    //    $("#progressBar").progressbar("option", "value", parseInt(progress));
//    //    displayStatusMessage("Uploaded " + parseInt(progress) + "%");
//    //}

//}

var updateProgress = function (progressbar) {
    if (progressbar != undefined && progressbar != null && progressbar != '') {
        $("#progressBar").css('display', 'block');
        var progress = currentChunk / numberOfBlocks * 100;
        if (progress <= 100) {
            $("#" + progressbar).simple_progressbar({ value: parseInt(progress), showValue: true });
            //$("#" + progressbar).progressbar("option", "value", parseInt(progress));
            //displayStatusMessage("Uploaded " + parseInt(progress) + "%");
        }
    }

}

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}
////////////////////////////// Attachment upload //////////////////////////////////////////////////////////////////


//SRISUDHAN///////////////////////////
//NOTICEBOARDREAD///////////////////

function fnNoticeBoardGrid() {
    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/GetAllNoticesReadDetail',
        type: "POST",
        success: function (response) {
            if (response != "") {
                $("#divNoticeBoardRead").html(response);
            }
            else {
                fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get your notice board details');
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get your notice board details');
        }
    });
}

function GetNoticepopup(val) {
    var mesgCode = val;
    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/GetAllNoticesReadPopup',
        data: "mesgCode=" + mesgCode,
        type: "POST",
        success: function (response) {

            if (response != "") {
                $("#divModel").html(response);
                $("#dvOverlay").overlay().load();
                fnNoticeBoardGrid();
                fnShowNoticeTicker();
            }
            else {
                fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get your notice board details');
            }
        },
        error: function () {
            fnMsgAlert('error', 'Notice Board', 'Sorry. Unable to get your notice board details');
        }
    });
}


function checkAll() {
    if ($('#chk_DV_ALL').attr('checked') == 'checked') {
        $('.clsCheck').attr('checked', 'checked')
    }
    else {
        $('.clsCheck').attr('checked', false);
    }
}

function fnDivsingleChk(val) {
    if ($('.clsCheck:checked').length == val) {
        $('#chk_DV_ALL').attr('checked', 'checked');
    }
    else {
        $('#chk_DV_ALL').attr('checked', false);
    }
}


function fnUnderUsertypeleChk(val) {
    if ($('.clsUnCheckUserType:checked').length == val) {
        $('#Uchk_UT_ALL').attr('checked', 'checked');
    }
    else {
        $('#Uchk_UT_ALL').attr('checked', false);
    }
}

function fnUserTypeChk(val) {
    if ($('.clsCheckUserType:checked').length == val) {
        $('#chk_UT_ALL').attr('checked', 'checked');
    }
    else {
        $('#chk_UT_ALL').attr('checked', false);
    }
}


function fnUserRegionChk(val) {
    if ($('.clsCheckRegion:checked').length == val) {
        $('#chk_RT_ALL').attr('checked', 'checked');
    }
    else {
        $('#chk_RT_ALL').attr('checked', false);
    }
}

  
function fnBindUserTreeWithCheckBoxGroup(id) {
    $.blockUI();
    // $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateUserTree',
        data: "A",
        async: 'false',
        success: function (jsData) {
            if (jsData != '') {
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);
                var clickStatus = new Boolean();

                $("#" + id).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        clickStatus = select;
                        //if (!select) {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                        //else {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        try {
                            inEventHandler = true;
                            node.visit(function (childNode) {
                                childNode.select(clickStatus);
                            });
                        } finally {
                            inEventHandler = false;
                        }
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        }
    });
}

function fnUserGroupChk(GroupId) {
    debugger;
    $.blockUI();
        $("#divGroupTree").html();
        fnBindUserTreeWithCheckBoxGroup("divGroupTree");
        $("span").removeClass("dynatree-selected");
    $.ajax({
        type: "POST",
        url: '../Hidoctor_Activity/NoticeBoard/GetUserCodesForTree',
        data: "Group_Id=" + parseInt(GroupId),
        success: function (resp) {
            debugger;
            entityDetails_g = '';

            if (resp.length > 0) {
                entityDetails_g = resp;
            }
            if (resp.length == 0) {
                //$.unblockUI();
                //fnMsgAlert('error', 'Splash Screen', 'Sorry. Unable to assign an Empty Group to Splash');
                //$("#radio_" + RadioVal).prop('checked', false);
                //return false;
                $.unblockUI();
            }
            else {
                $(".dynatree-title:contains(" + entityDetails_g + ")").parent().addClass('dynatree-selected');
                CheckedUser();
            }
        }
    })
}

function CheckedUser() {
    debugger;
    if (entityDetails_g != '' && entityDetails_g != undefined) {
        $("#divGroupTree").dynatree("getRoot").visit(function (node) {
            var disJson = jsonPath(entityDetails_g, "$.[?(@.Entity_Code=='" + node.data.key + "')]");
            if (disJson.length > 0) {
                node.select(true);
            }
            else {
                node.select(false)
                $.unblockUI();
            }
        });
        //$('#spnSelectedGrpUsers').html('No of Selected users : ' + entityDetails_g.length);
        $.unblockUI();
    }
}
function userTypecheckAll() {
    if ($('#chk_UT_ALL').attr('checked') == 'checked') {
        $('.clsCheckUserType').attr('checked', 'checked')
    }
    else {
        $('.clsCheckUserType').attr('checked', false);
    }
}

function UnderuserTypecheckAll() {
    if ($('#Uchk_UT_ALL').attr('checked') == 'checked') {
        $('.clsUnCheckUserType').attr('checked', 'checked')
    }
    else {
        $('.clsUnCheckUserType').attr('checked', false);
    }
}


function RegioncheckAll() {
    if ($('#chk_RT_ALL').attr('checked') == 'checked') {
        $('.clsCheckRegion').attr('checked', 'checked')
    }
    else {
        $('.clsCheckRegion').attr('checked', false);
    }
}


////// Notice author Movement //////////////////////////
function fnGetInactiveUserforActiveNotice() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/NoticeBoard/GetActiveNoticeforInactiveUser',
        data: 'A',
        success: function (response) {
            if (response != null && response != '') {
                $("#disabledUserTree").html(response);
                $("#dvAjaxLoad").hide();
            }
        }
    });
}

function fnDisableUserClick(val) {
    $('#dvActiveUser').show();
    $("#dvNotice").html('');
    var userCode = val;
    if (userCode != "") {
        $(".dvDisableUser").removeClass('selectNode');
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/NoticeBoard/GetNoticeContent',
            data: 'userCode=' + userCode,
            success: function (response) {
                debugger;
                if (response != null && response != '') {
                    $("#dvNotice").html(response);
                    $("#dvAjaxLoad").hide();
                }
            }
        });
    }
}

function fnSubmitNoticeauthorcontent() {
    var messageCodes = "";
    var checkBoxcheck = false;
    var userCode = $('#hdnUserNotice_0').val().split('$')[0];

    var adjustType = $('input:checkbox[name=chkselect]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        checkBoxcheck = true;
        messageCodes += adjustType[intLoop].value + "^";
    }


    if (!checkBoxcheck) {
        fnMsgAlert('info', 'Notice Board', 'Please select atlease one messasge to asign user.');
        return false;
    }

    if (AsignUserCode.length == 0) {
        fnMsgAlert('info', 'Notice Board', 'Please select one User.');
        return false;
    }

    $.ajax({
        type: 'POST',
        data: 'userCode=' + userCode + "&messageCodes=" + messageCodes + "&AsignuserCode=" + AsignUserCode,
        url: '../HiDoctor_Activity/NoticeBoard/UpdateNoticetoActiveUser',
        success: function (response) {
            if (response != null && response != '') {
                fnMsgAlert('success', 'Notice Board', '"' + response + '"');
                fnDisableUserClick(userCode);
            }
        }

    });
}

function fnUserTreeNodeClick(node) {
    debugger;
    //var userTree = $("#dvUserTree").dynatree("getTree");
    //if (userTree.getActiveNode() != null) {
    AsignUserCode = node.data.key;
    //}
}
