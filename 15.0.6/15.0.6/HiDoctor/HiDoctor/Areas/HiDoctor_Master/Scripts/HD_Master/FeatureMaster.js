//Created By: Sumathi
//Date: 20/12/2013

function fnGetfeatureDetails() {
    $.ajax({
        url: '../HiDoctor_Master/FeatureMaster/GetFeatureMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divFeatureMaster").html(result);
            }
        }
    });
}

function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Record_Status');
        var tblfeaturecode = obj.id.replace('C', 'Feature_Code');
        var status = $("#" + tblchange).text();
        var FeatureCode = $("#" + tblfeaturecode).text();

        $.ajax({
            url: '../HiDoctor_Master/FeatureMaster/ChangestatusforFeatureMaster',
            type: "POST",
            data: { 'status': status, 'featureCode': FeatureCode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'something went wrong');
                }
                fnGetfeatureDetails();
            }
        });
    }
}

function fnsubvalidate() {
    if ($.trim($("#txtfeatureName").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Feature Name');
        return false;
    }

    if ($.trim($("#txtfeatureName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Feature Name');
        return false;
    }

    if (!(isNaN($("#txtfeatureName").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Feature Name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtfeatureName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Feature Name');
        return false;
    }


    if ($.trim($("#txtEffectivefrom").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter the Effective Date');
        return false;
    }

    if ($.trim($("#txtfeatureName").val()).length > 100) {
        fnMsgAlert('info', 'Info', 'Feature Name should not exceed 100 Characters');
        return false;
    }

    if ($("#hdnMode").val() == "I") {
        var FeatureName = $.trim($("#txtfeatureName").val().toUpperCase());
        if (FeatureName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Feature_Name" + i).html().toUpperCase() == FeatureName) {
                        fnMsgAlert('info', 'Info', 'FeatureName Already Exists');
                        return false;
                    }
                }
            }
        }
    }

    if ($("#hdnMode").val() == "E") {
        var FeaturecodeVal = $.trim($("#hdnFeaturecodeval").val());
        var FeatureName = $.trim($("#txtfeatureName").val().toUpperCase());
        if (FeatureName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i < $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Feature_Name" + i).html().toUpperCase() == FeatureName && $("#Feature_Code" + i).html() != FeaturecodeVal) {
                        fnMsgAlert('info', 'Info', 'FeatureName Already Exists');
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

$("#btnsave").click(function () {
    var result = fnsubvalidate();
    if (result) {
        var FeatureName = $("#txtfeatureName").val();
        var Description = $("#txtdescription").val();

        var day = $("#txtEffectivefrom").val().split('/')[0];
        var month = $('#txtEffectivefrom').val().split('/')[1];
        var year = $('#txtEffectivefrom').val().split('/')[2];
        var EffectiveFrom = year + '-' + month + '-' + day;

        $.ajax({
            url: '../HiDoctor_Master/FeatureMaster/InsertandUpdateFeatureMaster',
            type: "POST",
            data: {
                'featureName': FeatureName, 'effectiveFrom': EffectiveFrom, 'description': Description,

                'Mode': $("#hdnMode").val(), 'featureCodeval': $("#hdnFeaturecodeval").val()
            },
            success: function (data) {
                if (data != '') {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            $("#txtfeatureName").val('');
                            $("#txtEffectivefrom").val('');
                            $("#txtdescription").val('');

                            $("#btnsave").val('Save');  //Button Value Change From Update To Save
                            $("#hdnMode").val("I");
                            fnGetfeatureDetails();
                        }
                        else {
                            fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                        }
                    }
                }
                else {
                    fnMsgAlert('info', 'Caution', 'Insertion Failed');
                }
               
            }
        });
    }
});

$("#btncancel").click(function () {
    $("#txtfeatureName").val('');
    $("#txtEffectivefrom").val('');
    $("#txtdescription").val('');

    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
    }
    else {
        $("#btnsave").val('Save');
    }

});

function fnEdit(obj) {
    if (obj.id != null) {
        var tblFeatureCode = obj.id.replace('E', 'Feature_Code');
        var tblFeatureName = obj.id.replace('E', 'Feature_Name');
        var tblDescription = obj.id.replace('E', 'Description');
        var tblEffectivefrom = obj.id.replace('E', 'Effective_From');

        var FeatureCode = $("#" + tblFeatureCode).text();
        var FeatureName = $("#" + tblFeatureName).text();
        var Description = $("#" + tblDescription).text();
        var Effectivefrom = $("#" + tblEffectivefrom).text();

        $("#hdnFeaturecodeval").val(FeatureCode);
        $("#txtfeatureName").val(FeatureName);
        $("#txtEffectivefrom").val(Effectivefrom);
        $('#txtdescription').val(Description);

        $("#btnsave").val('Update');  //Button Value Change From Save To Update
        $("#hdnMode").val("E");
    }
}