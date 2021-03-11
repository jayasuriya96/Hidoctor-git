//Created By: Sumathi
//Date: 20/12/2013

function fnGetDomaindetails() {
    $.ajax({
        url: '../HiDoctor_Master/DomainMaster/GetDomainMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divdomainMaster").html(result);
            }
        }
    });
}

function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Status');
        var tbldomaincode = obj.id.replace('C', 'Domain_Code');
        var status = $("#" + tblchange).text();
        var DomainCode = $("#" + tbldomaincode).text();

        $.ajax({
            url: '../HiDoctor_Master/DomainMaster/ChangestatusforDomainMaster',
            type: "POST",
            data: { 'status': status, 'domainCode': DomainCode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'something went wrong');
                }
                fnGetDomaindetails();
            }
        });
    }
}

function fnsubvalidate() {
    if ($.trim($("#txtdomainname").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Domain Name');
        return false;
    }

    if ($.trim($("#txtdomainname").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Domain Name');
        return false;
    }

    if (!(isNaN($("#txtdomainname").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Domain Name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtdomainname").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Domain Name');
        return false;
    }


    if ($.trim($("#txtstartDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter the Start Date');
        return false;
    }

    if ($.trim($("#txtEndDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The End Date');
        return false;
    }

    if ($("#txtdomainname").val().length > 50) {
        fnMsgAlert('info', 'Info', 'Domain name should not exceed 50 characters');
        return false;
    }

    if ($("#hdnMode").val() == "I") {
        var DomainName = $.trim($("#txtdomainname").val().toUpperCase());
        if (DomainName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Domain_Name" + i).html().toUpperCase() == DomainName) {
                        fnMsgAlert('info', 'Info', 'DomainName Already Exists');
                        return false;
                    }
                }
            }
        }
    }

    if ($("#hdnMode").val() == "E") {
        var DomaincodeVal = $.trim($("#hdnDomaincodeval").val());
        var DomainName = $.trim($("#txtdomainname").val().toUpperCase());
        if (DomainName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i < $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Domain_Name" + i).html().toUpperCase() == DomainName && $("#Domain_Code" + i).html() != DomaincodeVal) {
                            fnMsgAlert('info', 'Info', 'DomainName Already Exists');
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
        var DomainName = $("#txtdomainname").val();

        var day = $("#txtstartDate").val().split('/')[0];
        var month = $('#txtstartDate').val().split('/')[1];
        var year = $('#txtstartDate').val().split('/')[2];
        var StartDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var EndDate = year + '-' + month + '-' + day;

        $.ajax({
            url: '../HiDoctor_Master/DomainMaster/InsertandUpdateforDomainMaster',
            type: "POST",
            data: {
                'domainName': DomainName, 'startDate': StartDate, 'endDate': EndDate,

                'Mode': $("#hdnMode").val(), 'domainCodeval': $("#hdnDomaincodeval").val()
            },
            success: function (data) {
                if (data != '') {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            $("#txtdomainname").val('');
                            $("#txtstartDate").val('');
                            $("#txtEndDate").val('');

                            $("#btnsave").val('Save');  //Button Value Change From Update To Save
                            $("#hdnMode").val("I");
                            fnGetDomaindetails();
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
    $("#txtdomainname").val('');
    $("#txtstartDate").val('');
    $("#txtEndDate").val('');

    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
    }
    else {
        $("#btnsave").val('Save');
    }
    
});

function fnEdit(obj) {
    if (obj.id != null) {
        var tblDomainCode = obj.id.replace('E', 'Domain_Code');
        var tblDomainName = obj.id.replace('E', 'Domain_Name');
        var tblStartdate = obj.id.replace('E', 'Start_Date');
        var tblEnddate = obj.id.replace('E', 'End_Date');

        var DomainCode = $("#" + tblDomainCode).text();
        var DomainName = $("#" + tblDomainName).text();
        var Startdate = $("#" + tblStartdate).text();
        var Enddate = $("#" + tblEnddate).text();

        $("#hdnDomaincodeval").val(DomainCode);
        $("#txtdomainname").val(DomainName);
        $("#txtstartDate").val(Startdate);
        $('#txtEndDate').val(Enddate);

        $("#btnsave").val('Update');  //Button Value Change From Save To Update
        $("#hdnMode").val("E");
    }
}