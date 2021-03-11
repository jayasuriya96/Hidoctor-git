//Created By: Sumathi
//Date: 18/12/2013

function fnGetProjectDeatils() {
    $.ajax({
        url: '../HiDoctor_Master/ProjectMaster/GetProjectMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divProjectMaster").html(result);
            }
        }
    });
}

var division_p
function fnGetProjectLead() {
    $.ajax({
        url: '../HiDoctor_Master/ProjectMaster/GetProjectLead',
        type: "POST",
        success: function (JsonResult) {
            division_p = JsonResult;
            if (division_p != null) {
                if (division_p.length > 0) {
                    fnAddOptionToSelect("ddlprojectLead", "-Select a User-", "0");
                    for (var di = 0; di < division_p.length; di++) {
                        fnAddOptionToSelect("ddlprojectLead", division_p[di].User_Name, division_p[di].User_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlprojectLead", "-No Division-", "0");
                }

            }
            else {
                fnAddOptionToSelect("ddlprojectLead", "-No Division-", "0");
            }
        }
    });
}

var division_c
function fnGetClient() {
    $.ajax({
        url: '../HiDoctor_Master/ProjectMaster/GetClient',
        type: "POST",
        success: function (JsonResult) {
            division_c = JsonResult;
            if (division_c != null) {
                if (division_c.length > 0) {
                    fnAddOptionToSelect("ddlClient", "-Select a Client-", "0");
                    for (var di = 0; di < division_c.length; di++) {
                        fnAddOptionToSelect("ddlClient", division_c[di].Company_Name, division_c[di].Company_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlClient", "-No Division-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlClient", "-No Division-", "0");
            }
        }
    });
}

var division_d
function fnGetDomain() {
    $.ajax({
        url: '../HiDoctor_Master/ProjectMaster/GetDomain',
        type: "POST",
        success: function (JsonResult) {
            division_d = JsonResult;
            if (division_d != null) {
                if (division_d.length > 0) {
                    fnAddOptionToSelect("ddlDomain", "-Select a Domain-", "0");
                    for (var di = 0; di < division_d.length; di++) {
                        fnAddOptionToSelect("ddlDomain", division_d[di].Domain_Name, division_d[di].Domain_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlDomain", "-No Division-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlDomain", "-No Division-", "0");
            }
        }
    });
}

function fnAddOptionToSelect(id, text, value) {
    if ($.msie) {
        var option = document.createElement('option');
        jQuery(option).appendTo('#' + id);
        option.text = text;
        option.value = value;
    }
    else {
        $('#' + id).append("<option value='" + value + "'>" + text + "</option>");
    }
}

function fnsubvalidate() {
    if ($.trim($("#txtprojectName").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Project Name');
        return false;
    }

    if ($.trim($("#txtprojectName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Project Name');
        return false;
    }

    if (!(isNaN($("#txtprojectName").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Project Name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtprojectName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Project Name');
        return false;
    }

    if ($('#ddlprojectLead').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The ProjectLead');
        return false;
    }

    if ($('#ddlClient').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The Client');
        return false;
    }

    if ($('#ddlDomain').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The Domain');
        return false;
    }

    if ($.trim($("#txtFromDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter the Start Date');
        return false;
    }

    if ($.trim($("#txtEndDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The End Date');
        return false;
    }

    if ($.trim($("#txtprojectName").val()).length > 100) {
        fnMsgAlert('info', 'Info', 'Project Name should not exceed 100 Characters');
        return false;
    }

    if ($.trim($("#txtremarks").val()).length > 100) {
        fnMsgAlert('info', 'Info', 'Remarks should not exceed 100 Characters');
        return false;
    }
    //Date validation 
    
    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtEndDate"), "EndDate"))) {
        return false;
    }

    var fromDate = $("#txtFromDate").val().split('/')[2] + '/' + $("#txtFromDate").val().split('/')[1] + '/' + $("#txtFromDate").val().split('/')[0];
    var toDate = $("#txtEndDate").val().split('/')[2] + '/' + $("#txtEndDate").val().split('/')[1] + '/' + $("#txtEndDate").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (startDate > endDate) {
        fnMsgAlert('info', 'Info', 'End date can not be less than Start date.');     
        return false;
    }

    if ($("#hdnMode").val() == "I") {
        var ProjectName = $.trim($("#txtprojectName").val().toUpperCase());
        if (ProjectName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Project_Name" + i).html().toUpperCase() == ProjectName) {
                        fnMsgAlert('info', 'Info', 'ProjectName Already Exists');
                        return false;
                    }
                }
            }
        }
    }

    if ($("#hdnMode").val() == "E") {
        var ProjectCodeVal = $.trim($("#hdnProjectcodeval").val());
        var ProjectName = $.trim($("#txtprojectName").val().toUpperCase());
        if (ProjectName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Project_Name" + i).html().toUpperCase() == ProjectName && $("#Project_Code" + i).html() != ProjectCodeVal) {
                        fnMsgAlert('info', 'Info', 'ProjectName Already Exists');
                        return false;
                    }
                }
            }
        }

    }



    return true;
}

function fnSubmit() {
    var result = fnsubvalidate();
    if (result) {
        var ProjectName = $.trim($("#txtprojectName").val());
        var ProjectLeadcode = $("#ddlprojectLead option:selected").val();
        var ProjectLeadName = $("#ddlprojectLead option:selected").text();

        var Client = $("#ddlClient option:selected").val();
        var Domain = $("#ddlDomain option:selected").val();

        var day = $("#txtFromDate").val().split('/')[0];
        var month = $('#txtFromDate').val().split('/')[1];
        var year = $('#txtFromDate').val().split('/')[2];
        var StartDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var EndDate = year + '-' + month + '-' + day;
        var Remarks = $("#txtremarks").val();

        $.ajax({
            url: '../HiDoctor_Master/ProjectMaster/InsertandUpdateProjectDetails',
            type: "POST",
            data: {
                'projectName': ProjectName, 'ProjectLeadcode': ProjectLeadcode, 'ProjectLeadName': ProjectLeadName,

                'client': Client, 'domain': Domain, 'startDate': StartDate, 'endDate': EndDate, 'remarks': Remarks, 'Mode': $("#hdnMode").val(), 'projectCodeVal':

                $("#hdnProjectcodeval").val()
            },
            success: function (data) {
                if (data != '') {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            $("#txtprojectName").val('');
                            $("#ddlprojectLead").val('0');
                            $("#ddlClient").val('0');
                            $("#ddlDomain").val('0');
                            $("#txtFromDate").val('');
                            $("#txtEndDate").val('');
                            $("#txtremarks").val('');

                            $("#btnsave").val('Save');  //Button Value Change From Update To Save
                            $("#hdnMode").val("I");
                            fnGetProjectDeatils();
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
}


function fnClearAll() {
    $("#txtprojectName").val('');
    $("#ddlprojectLead").val('0');
    $("#ddlClient").val('0');
    $("#ddlDomain").val('0');
    $("#txtFromDate").val('');
    $("#txtEndDate").val('');
    $("#txtremarks").val('');

    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
    else {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }

}

function fnEdit(obj) {
    if (obj.id != null) {
        var tblProjectCode = obj.id.replace('E', 'Project_Code');
        var tblProjectName = obj.id.replace('E', 'Project_Name');
        var tblProjectLeadcode = obj.id.replace('E', 'Project_Lead_Code');
        var tblProjectLeadName = obj.id.replace('E', 'Project_Lead_Name');
        var tblCompanyName = obj.id.replace('E', 'Company_Name');
        var tblClientCode = obj.id.replace('E', 'Company_Code');
        var tblDomainCode = obj.id.replace('E', 'Domain_Code');
        var tblDomainName = obj.id.replace('E', 'Domain_Name');
        var tblStartDate = obj.id.replace('E', 'Start_Date');
        var tblEndDate = obj.id.replace('E', 'End_Date');
        var tblRemarks = obj.id.replace('E', 'Remarks');

        var ProjectCode = $("#" + tblProjectCode).text();
        var ProjectName = $("#" + tblProjectName).text();
        var ProjectLeadcode = $("#" + tblProjectLeadcode).text();
        var ProjectLeadName = $("#" + tblProjectLeadName).text();
        var CompanyName = $("#" + tblCompanyName).text();
        var ClientCode = $("#" + tblClientCode).text();
        var DomainCode = $("#" + tblDomainCode).text();
        var DomainName = $("#" + tblDomainName).text();
        var StartDate = $("#" + tblStartDate).text();
        var EndDate = $("#" + tblEndDate).text();
        var Remarks = $("#" + tblRemarks).text();

        $("#txtprojectName").focus();
        $("#hdnProjectcodeval").val(ProjectCode);
        $("#txtprojectName").val(ProjectName);
        $("#hdnProjectLeadval").val(ProjectLeadcode);
        $('#ddlprojectLead').val(ProjectLeadcode);
        $("#hdnClientCodeval").val(ClientCode);
        $("#ddlClient").val(ClientCode);
        $("#hdnDomainCodeval").val(DomainCode);
        $('#ddlDomain').val(DomainCode);
        $("#txtFromDate").val(StartDate);
        $("#txtEndDate").val(EndDate);
        $("#txtremarks").val(Remarks);

        $("#btnsave").val('Update');  //Button Value Change From Save To Update
        $("#hdnMode").val("E");
    }
}

function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Status');
        var tblprojectcode = obj.id.replace('C', 'Project_Code');
        var status = $("#" + tblchange).text();
        var ProjectCode = $("#" + tblprojectcode).text();

        $.ajax({
            url: '../HiDoctor_Master/ProjectMaster/ChangestatusforProjectMaster',
            type: "POST",
            data: { 'status': status, 'projectCode': ProjectCode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'something went wrong');
                }
                fnGetProjectDeatils();
            }
        });
    }
}
