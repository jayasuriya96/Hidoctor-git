//Created By: Sumathi
//Date: 20/12/2013
function fnGetCycleMaster() {
  
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Master/CycleMaster/GetCycleMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divcycleMaster").html(result);
                $.unblockUI();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error:' + e.message);
            $.unblockUI();
        }
    });
}

function fnGetNodeClickDetails() {
    $.blockUI();
    var regionCode = $('#hdnregionCode').val();
    $.ajax({
        url: '../HiDoctor_Master/CycleMaster/GetCycleDetailsforNodeClick',
        type: "GET",
        data: { 'regioncodeVal': regionCode },
        success: function (result) {
            if (result != '') {
                $("#divcycleMaster").html(result);
                $.unblockUI();
            }
        }
    });
}

$("#btnsave").click(function () {
    var result = fnsubvalidate();
    if (result) {
        $("#btnsave").attr("disabled", true);
        $("#btnsave").attr("disabled", true);
        var CycleName = $.trim($("#txtcycleName").val());
        var Description = $("#txtdescription").val();
        var Isapproved = $('#chkstatus').attr('Checked') ? 2 : 1;

        var day = $("#txtStartDate").val().split('/')[0];
        var month = $('#txtStartDate').val().split('/')[1];
        var year = $('#txtStartDate').val().split('/')[2];
        var StartDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var EndDate = year + '-' + month + '-' + day;
        var regionCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            regionCodes += selKeys[i] + '^';
        }
        if (regionCodes == "") {
            fnMsgAlert('info', 'Info', 'Please Click Any Region');
            $("#btnsave").attr("disabled", false);
            $("#btnsave").attr("disabled", false);
            return false;
        }

        $.ajax({
            url: '../HiDoctor_Master/CycleMaster/InsertandUpdateforCycleMaster',
            type: "POST",
            data: {
                'cycleName': CycleName, 'startDate': StartDate, 'endDate': EndDate, 'description': Description, 'isApproved': Isapproved,
                'Mode': $("#hdnMode").val(), 'regioncodeVal': regionCodes, 'cycleCodeEdit': $("#hdnCyclecode").val(),
            },
            success: function (data) {
                if (data != '') {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {                            
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            $("#divRegionTree").show();
                            $("#txtcycleName").val('');
                            $("#txtStartDate").val('');
                            $("#txtEndDate").val('');
                            $("#txtdescription").val('');
                            $("#lblmessage").html('');
                            $('#chkstatus').prop('checked', true);
                            $("#divRegionTree").dynatree("getRoot").visit(function (node) {
                                node.select(false);
                            });
                            $('#hdnregionCode').val('');
                            $("#btnsave").val('Save');  //Button Value Change From Update To Save
                            $("#hdnMode").val("I");
                            fnGetCycleMaster();
                            $("#btnsave").attr("disabled", false);
                            $("#btnsave").attr("disabled", false);

                        }
                        else {
                            fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                            $("#btnsave").attr("disabled", false);
                            $("#btnsave").attr("disabled", false);
                        }

                    }
                }
                else {
                    fnMsgAlert('info', 'Caution', 'Insertion Failed');
                    $("#btnsave").attr("disabled", false);
                    $("#btnsave").attr("disabled", false)
                }
            }
        });
    }
});

function fnEdit(obj) {
    $("#divRegionTree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });
    if (obj.id != null) {
        var tblCyclecode = obj.id.replace('E', 'Cycle_Code');
        var tblRegionCode = obj.id.replace('E', 'Region_Code');
        var tblCycleName = obj.id.replace('E', 'Cycle_Name');
        var tblRegionName = obj.id.replace('E', 'Region_Name');
        var tblDescription = obj.id.replace('E', 'Long_Description');
        var tblStartDate = obj.id.replace('E', 'Start_Date');
        var tblEndDate = obj.id.replace('E', 'End_Date');
        var tblrecordStatus = obj.id.replace('E', 'Record_Status');

        var Cyclecode = $("#" + tblCyclecode).text();
        var RegionCode = $("#" + tblRegionCode).text();
        var CycleName = $("#" + tblCycleName).text();
        var regionName = $("#" +tblRegionName).text();
        var Description = $("#" + tblDescription).text();
        var StartDate = $("#" + tblStartDate).text();
        var EndDate = $("#" + tblEndDate).text();
        var status = $("#" + tblrecordStatus).text();
    
        $("#txtcycleName").focus();
        $("#hdnregionCode").val(RegionCode);
        $("#hdnCyclecode").val(Cyclecode);
        $("#txtcycleName").val(CycleName);
        $("#hdnRegionName").val(regionName);
        $('#txtStartDate').val(StartDate);
        $("#txtEndDate").val(EndDate);
        $('#txtdescription').val(Description);
        if ($.trim(status.toUpperCase()) == "APPLIED") {
            $('#chkstatus').prop('checked', true);
        }
        else {
            $('#chkstatus').prop('checked', false);
        }
        $("#divRegionTree").dynatree("getRoot").visit(function (node) {
            if (node.data.key == RegionCode) {
                node.select(true);
            }
        });
        $("#divRegionTree").hide();
        $("#lblmessage").html("The Region Name for The Clicked Region is " + $("#hdnRegionName").val() + ".");
        $("#btnsave").val('Update');  //Button Value Change From Save To Update
        $("#hdnMode").val("E");
    }
}

function fnsubvalidate() {

    var selectedregionCode = $("#hdnregionCode").val();
    if ($.trim(selectedregionCode).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Click Any Region');
        return false;
    }

    if ($.trim($("#txtcycleName").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Cycle Name');
        return false;
    }

    if ($.trim($("#txtStartDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter the Start Date');
        return false;
    }

    if ($.trim($("#txtEndDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter the End Date');
        return false;
    }

    if ($.trim($("#txtcycleName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Cycle Name');
        return false;
    }

    if ($.trim($("#txtcycleName").val()).length > 50) {
        fnMsgAlert('info', 'Info', 'Cycle Name should not exceed 50 Characters');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtcycleName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the CycleName');
        return false;
    }

    var FromDateArr = $("#txtStartDate").val().split('/');
    var ToDateArr = $("#txtEndDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        return false;
    }

    var validformat = /^\d{2}\/\d{2}\/\d{4}$/
    if (!validformat.test($('#txtStartDate').val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid Start Date');
        return false;
    }

    if (!validformat.test($('#txtEndDate').val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid End Date');
        return false;
    }

    if ($("#hdnMode").val() == "I") {
        var CycleName = $.trim($("#txtcycleName").val().toUpperCase());
        if (CycleName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Cycle_Name" + i).html().toUpperCase() == CycleName) {
                        fnMsgAlert('info', 'Info', 'CycleName Already Exists');
                        return false;
                    }
                }
            }
        }
    }
    if ($("#hdnMode").val() == "E") {
        var RegioncodeVal = $.trim($("#hdnregionCode").val());
        var CycleName = $.trim($("#txtcycleName").val().toUpperCase());
        if (CycleName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Cycle_Code" + i).html() != $("#hdnCyclecode").val()) {
                        if ($("#Cycle_Name" + i).html().toUpperCase() == CycleName.toUpperCase() && $("#Region_Code" + i).html() == RegioncodeVal) {
                            fnMsgAlert('info', 'Info', 'CycleName Already Exists');
                            return false;
                        }
                    }
                }
            }
        }

    }
    return true;
}

$("#btncancel").click(function () {
    $("#txtcycleName").val('');
    $("#txtStartDate").val('');
    $("#txtEndDate").val('');
    $("#txtdescription").val('');
    $('#chkstatus').prop('checked', true);
    $("#btnsave").attr("disabled", false);
    $("#btnsave").attr("disabled", false);
    $("#divRegionTree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });
    $("#divRegionTree").show();
    $('#hdnregionCode').val('');
    $("#lblmessage").html('');

    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
});