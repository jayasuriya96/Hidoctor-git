var Totallist = "";
var SpecialityjsonString
var totregionlist = '';
var CCMailarr = '';
var URMdata = '';
//var json = '';
var DocList = '';
var unique = '';
var userList = '';
var itr = 0;
var regionlist = '';
var doctorlength = '';
var Doctorslist = '';
var regiondoclist = '';
var FromDate = "";
var DoctorBirthday = {
    defaults: {

        LoginRegionCode: "",
        Company_Code: "",
        LoginUserCode: "",
        CompanyId: "",
        OrderStatusData: "",
        RequestUserTypeName: "",
        ShowTeam: "",
        jsonActiveUserDetails: null,
        SelectedUser: "",
        RequestUserTypeCode: "",
        UrlStosID: "",
        LogUserCode: "",
        hdnCSACode: "",
        UserCode: ""
    },
    initialize: function () {
        debugger;

        DoctorBirthday.fnReleasedetails();

    },
    GetAllDivisions: function () {
        debugger;
        var Companycode = CompanyCode;
        $.ajax(
                 {
                     type: 'Get',
                     url: '../HiDoctor_Master/DoctorsBirthday/GetAllDivisions',
                     data: "Company_Code=" + CompanyCode,
                     success: function (response) {
                         debugger;
                         var indexDet = 0;
                         $('#dvtxtdivisionnName').html('<input type="text" class="" id="divisionname">');
                         if (response != null && response.length > 0) {
                             var lstDivision = [];
                             for (var i = 0; i < response.length; i++) {
                                 if (i == 0) {
                                     indexDet = 0;
                                     var regioncode = response[0].Division_Code;
                                     $('#regionname').val(response[0].Division_Name)
                                 }
                                 var _obj = {
                                     label: response[i].Division_Name,
                                     id: response[i].Division_Code,
                                     index: i

                                 }
                                 lstDivision.push(_obj)
                             }
                             var atcObj = new ej.dropdowns.DropDownList({
                                 dataSource: lstDivision,
                                 fields: { text: 'label', value: 'id' },
                                 filterBarPlaceholder: 'Search',
                                 showClearButton: true,
                                 allowFiltering: true,
                                 placeholder: 'Select a Division',
                                 index: indexDet,
                                 filtering: function (e) {
                                     var dropdown_query = new ej.data.Query();
                                     dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                     e.updateData(lstDivision, dropdown_query);
                                 },

                             });
                             atcObj.appendTo('#divisionname');
                         }
                     },
                     error: function () {

                     }
                 });

    },
    fnReleasedetails: function () {
        debugger;
        var Division_code = $('select[name="regionname"]').val();
        if ($('select[name="regionname"]').val() == "") {
            fnMsgAlert('info', 'Doctors Birthday', 'Please Select  Division.');
            return false;
        }

        FromDate;
        if ($.trim($('#effectfrom').val()) == "") {
            fnMsgAlert('info', 'Doctors Birthday', 'Please Select  Date.');
            return false;
        }
        FromDate = $('#effectfrom').val();
        var FromDate1 = FromDate.split('-')[2] + '-' + FromDate.split('-')[1] + '-' + FromDate.split('-')[0];
        GetDoctorDetails(FromDate1);
    },
}
function GetDoctorDetails(FromDate1) {
    debugger;
    $('#STOSPage').show();

    var RegionCode = LoginRegionCode;
    var Companycode = CompanyCode;
    var Division_code = $('select[name="divisionname"]').val();
    $.ajax(
      {
          async: false,
          type: 'Get',
          url: '../HiDoctor_Master/DoctorsBirthday/GetDoctorDetails',
          data: 'Region_Code=' + RegionCode + "&Company_Code=" + Companycode + "&Dob=" + FromDate1 + "&Division_code=" + Division_code,
          success: function (data) {
              debugger;
              fngetmailDataSucess(data);
          }
      });
}
function fngetmailDataSucess(data) {
    debugger;
    var content = '';

    if (data.length != 0 && data.length != null) {
        debugger; STOSPage
        $("#ViewDoctorDetails").html('');
        $("#ViewDoctorDetails").html('');
        $("#btnShowtmailbtn").show();
        var content = '';
        Totallist = [];
        Totallist = data;
        URMdata = data;
        unique = data.reduce(function (item, e1) {
            var matches = item.filter(function (e2)
            { return e1.Region_Name == e2.Region_Name });
            if (matches.length == 0) {
                item.push(e1);
            }
            return item;
        }, []);
        if (unique.length > 0) {
            debugger
            content += '<div><input type="checkbox" id="chkbox_" name="chkS" onclick="fnSelectAll()"/>SelectAll</div>';
            for (var i = 0; i < unique.length; i++) {
                content += '<div class="panel-group">';
                content += '</h3>';

                content += '</h3>';
                content += '<div class="panel-heading" style="background-color: cornflowerblue;color: white;height:45px;margin-top: 15px;">';
                content += '<h3 class="panel-title">';
                //content += '<div><input type="checkbox" class="Chkboxreg" name="chkregion" id="chkbox_' + i + '" value=' + unique[i].Region_Code + ' aria-label="..."></div>';
                content += '<div class="col-sm-8"><input type="checkbox" class="Chkboxreg" name="chkS" id="chkbox_' + i + '" value=' + unique[i].Region_Code + ' aria-label="..."><a   style="color: white;" onclick="fnopentable(\'' + unique[i].Region_Name + '\',\'' + i + '\');">' + unique[i].Region_Name + '</a></div>';

                content += ' <div class="col-sm-4"><a><span style="margin-left: 65%;text-decoration:underline;cursor:pointer;color: white;" onclick="javascript:return fnGetRegionTree(\'' + unique[i].Region_Code + '\',\'' + i + '\');"> Copy Holders </span></a> </div>'
                //content += '<a><span onclick="fnMailTrigger(\'' + unique[i].Doctor_Name + '\',\'' + unique[i].Speciality_Name + '\',\'' + unique[i].Customer_Code + '\',\'' + unique[i].Email_Id + '\');" style="margin-left: 75%;text-decoration:underline;cursor:pointer;color: white;">Send Mail</span></a>';
                content += '</h3>';
                content += '</div>';
                content += '<div id="collapse_' + i + '">';
                content += '<div class="panel-body" id="Sign_' + i + '">';
                content += '</div></div>';
                content += '</div>';
                content += '</div>';
            }


            $('#ViewDoctorDetails').html(content);
            $('#btnemail').show();
        }



    }
    else {
        $("#STOSPage").hide();
        //$('#ViewDoctorDetails').html("No release Details Found.");
        $("#btnemail").hide();
        $("#STOSPage").hide();
        fnMsgAlert('info', 'Doctors Birthday', 'No Records Found.');
        return false;
    }




}
function fnopentable(RegionName, index) {
    debugger;
    $('#collapse_' + index).toggle();
    var Content = '';

    if (URMdata.length != 0 && URMdata.length != undefined && URMdata.length != null && URMdata.length != '') {
        debugger;
        Content += '<table class="table table-striped"style="font-size: 14px;width: 95%;margin-top: 3px;">';
        Content += '<thead> <tr>'
        Content += '<th>Doctor Id</th>';
        Content += '<th>Doctor Name </th>';
        Content += '<th>Speciality </th>';

        Content += '</tr></thead>';
        Content += ' <tbody id="tblbody">';
        var userList = $.grep(URMdata, function (v) {
            return v.Region_Name == RegionName;
        });

        for (var i = 0; i < userList.length; i++) {

            Content += '<tr class="doclength">';
            Content += '<td data-title="Doctorid" id="Doctorid_' + i + '" value=' + userList[i].Region_Code + '>' + userList[i].Customer_Code + '</td>';
            Content += '<td data-title="Doctor Name" id="DocName_' + i + '" value=' + userList[i].Region_Code + '>' + userList[i].Doctor_Name + '</td>';
            Content += '<td data-title="Speciality" id="Speciality_' + i + '" value=' + userList[i].Region_Code + '>' + userList[i].Speciality_Name + '</td>';
            Content += ' </tr>';
            //itr++;
        }
        Content += '</tbody>';
        Content += '</table>';
    } else {
        Content = '<div class="col-xs-10"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
    }
    $('#Sign_' + index).html(Content);

}
function fnSelectAll() {
    debugger;
    if ($('#chkbox_').is(":checked")) {
        $("input:checkbox[name=chkS]").attr('checked', 'checked');

    }
    else {
        $("input:checkbox[name=chkS]").removeAttr('checked');
    }
}
function fnGetRegionTree(Region_Code, index) {
    debugger
    URMdata;
    var Region_Code = Region_Code;
    var indexx = index;
    var login_Region = LoginRegionCode;
    //$('input[name="chkS"]:checked').each(function () {
    //    if (this.checked) {
    //        debugger;
    //        var id = this.id;
    //        var idval = id.split('_')[1];
    //        RegionCode = $("#chkbox_" + idval).val();
    //    }
    //});

    //$("#ViewDoctorDetails").hide();
    //$('#sendmail').hide();

    $.ajax({
        url: '../HiDoctor_Master/DoctorsBirthday/GetdoctorsHierarchyByRegion',
        type: "POST",
        async: false,
        data: "Region_code=" + Region_Code + "&login_Region=" + LoginRegionCode,
        success: function (Result) {
            var data = Result;
            if (data != null && data != '') {
                debugger;
                $('#regionTreeNew').html('');
                json = data;
                var content = '';
                var Sno = 1;
                content += '<table class="table table-sm" id="tblregion"style="width: 99%;">';
                content += '<thead><tr>';
                content += '<th><input type="checkbox" id="checkbox_" name="chkSSSelectS" onclick="fnselectAllCC()"/>SelectAll</th>';
                content += '<th scope="col">Copy Holders</th>';
                content += '</tr>';
                content += '</thead>';
                content += '<tbody>';
                for (var i = 0; i < json.length; i++) {
                    content += '<tr>';
                    content += '<td><input type="checkbox" class="Chkboxreg" name="checkkregion" id="checkbox_' + i + '" value=' + json[i].User_Code + ' aria-label="..."></td>';
                    content += '<input type="hidden" value=' + json[i].Company_Code + '/>';
                    content += '<input class="emailid_' + i + '" type="hidden" value=' + json[i].Email_Id + '>';
                    content += '<input class="usercode_' + i + '" type="hidden" value=' + json[i].User_Code + '>';
                    content += '<input class="empname_' + i + '" type="hidden" value=' + json[i].Employee_Name + '>';
                    content += '<td>' + json[i].Region_Name + ' - ' + json[i].Employee_Name + json[i].RegionCode + ' (' + json[i].User_Name + ')</td>';
                    content += '</tr>';
                    Sno++;
                }
                content += '</tbody></table>';
                $('#regionTreeNew').append(content);
                $('#myModalregion').modal({ show: true });
                checkedall = data;
                checkedall.length;
                fnCheckUsers(CCMailarr, Region_Code);

            }
            else {
                $("#ViewDoctorDetails").show();
                $('#sendmail').show();
                HideModalPopup('dvLoading');
            }

        },

        error: function () {
            HideModalPopup('dvLoading');
        }
    });
}
function fnSaveCCUsers() {
    debugger;
    $("#ViewDoctorDetails").show();
    $('#sendmail').show();
    $('#btnccsave').prop('disabled', true);
    var lstCCMail = [];
    var obj = {};
    //var json;
    var UserArray = [];
    var region = $('[name="checkkregion"]:checked');
    if (region.length > 0) {
        for (var i = 0; i < json.length; i++) {
            if ($("#checkbox_" + i).is(':checked')) {
                obj = {
                    User_Code: $(".usercode_" + i).val(),
                    Employee_Name: $(".empname_" + i).val(),
                    Email_Id: $(".emailid_" + i).val(),
                    RegionCode: json[i].RegionCode
                }
                lstCCMail.push(obj);
            }
        }
        CCMailarr = lstCCMail;

        //var objlst = {
        //    lstCCMail: lstCCMail
        //}
        //if (objlst > 0) {
        //    CCMailarr = lstCCMail;
        //}
        //else {
        //    ResMailarr = lstCCMail;
        //}

        $('#myModalregion').modal('hide');
        $('#btnccsave').prop('disabled', false);
    }

    else {
        //$("#ViewDoctorDetails").hide();
        //$('#sendmail').hide();
        alert("Please Select any User.");
        $('#btnccsave').prop('disabled', false);
        return false;
    }
    CCMailarr = lstCCMail;
}
function fnCheckUsers(CCMailarr, Region_Code) {
    debugger

    checkedall.length;
    if (CCMailarr.length > 0) {
        var doclist = $.grep(CCMailarr, function (v) {
            return v.RegionCode == Region_Code;
        });
        debugger;
        for (var i = 0; i < doclist.length; i++) {
            $("input[value='" + doclist[i].User_Code + "']").prop('checked', true);
        }
        if (doclist.length == checkedall.length) {
            $('#checkbox_').attr('checked', 'checked')

        }
    }
}

function fnselectAllCC() {
    debugger;
    if ($('#checkbox_').is(":checked")) {
        $("input:checkbox[name=checkkregion]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=checkkregion]").removeAttr('checked');
    }
}

function fnMailTrigger() {
    debugger;
    var arr = [];
    regionlist = [];
    //$("input:checkbox[name=chkS]").each(function () {
    $('#ViewDoctorDetails input:checkbox[class=Chkboxreg]:checked').each(function () {
        //var region = $('[name="chkS"]:checked');
        //if (this.checked) {
        // var reg = $("input:checkbox[name=chkS]").val();
        var id = this.id;
        var idval = id.split('_')[1];
        var det = $("#chkbox_" + idval).val();

        var list = $.grep(URMdata, function (v) {
            return v.Region_Code == det;
        });
        for (var i = 0; i < list.length; i++) {
            debugger;
            var obj = {

                Customer_Code: list[i].Customer_Code,
                Doctor_Name: list[i].Doctor_Name,
                Speciality_Name: list[i].Speciality_Name,
                RegionCode: list[i].Region_Code,
                Category_Name: list[i].Category_Name,
                Email_Id: list[i].Email_Id,
                EmailId: list[i].EmailId,
            }

            arr.push(obj);
        }
        var list = $.grep(unique, function (v) {
            return v.Region_Code == det;
        });
        for (var i = 0; i < list.length; i++) {
            debugger;
            var obj = {
                Email_Id: list[i].Email_Id,
                EmailId: list[i].EmailId,
                RegionCode: list[i].Region_Code,
                RegionName: list[i].Region_Name,
                Category_Name: list[i].Category_Name
            }

            regionlist.push(obj);
        }

        // }
    });

    if (arr.length == 0) {
        fnMsgAlert('info', 'Doctors Birthday', 'Please select atleast one Region');
        return false;
    }

    Doctorslist = arr
    fnGetTemplateDetails();
    fngetCompanyEmail();
    fncheckmaildetails();




}
  
////    Copy holders and CC mail filter logic & send Mail logic ///
function fnMailsend(Doctorslist) {


    debugger;
    var CanSelFrommailid = '';
    var CanSelTomailid = '';
    var CanSelCCmailid = '';
    var CanSelSenderName = ''
    var TemplateName = "Birthday-Alert";

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
        var Email_Id;
        if (regionlist.length == 1) {
            CanSelCCmailid = regionlist[0].Email_Id;

        }
        else if (i == (regionlist.length - 1)) {
            CanSelCCmailid = regionlist[0].Email_Id;

        }

        else {
            CanSelCCmailid = regionlist[0].Email_Id + ',';

        }


    }
    var CanSelMailids = $.grep(MailSenderNamearr, function (element, index) {
        return element.TemplateName == TemplateName;
    });
    if (CanSelMailids.length > 0) {
        debugger
        CanSelSenderName = CanSelMailids[0].SenderName;
    }

   

    for (var i = 0; i < regionlist.length; i++) {

        regiondoclist = $.grep(Doctorslist, function (v) {
            return v.RegionCode == regionlist[i].RegionCode;
        });

        var cc = '';
        var DoctorId = '';
        //var Name = '';
        var Speciality = '';
        var EmailId = '';
        var DoctorList = '';
        var DYN_PARTICULARS = '';
        var ccmaillst = "";
        var ccmail = '';
        var ccmaildata = '';
        var Empnames = "";
        if (Doctorslist.length > 0) {
            debugger;
            if (regiondoclist.length == 1) {
                ccmail = regiondoclist[0].EmailId;
                Empnames = regiondoclist[0].RegionName;
            }
            else {
                for (var j = 0; j < regiondoclist.length; j++) {
                    if (j == (regiondoclist.length - 1)) {
                        ccmail += regiondoclist[j].EmailId;
                        Empnames += regiondoclist[j].RegionName;
                    }

                    else {
                        ccmail += regiondoclist[j].EmailId + ',';
                        Empnames = regiondoclist[j].RegionName + '/';
                    }
                }
            }
        }
        //else {
        //    cc= ccmail;
        //}
        if (CCMailarr.length > 0) {
            debugger;
            if (CCMailarr.length == 1) {
                ccmaillst = CCMailarr[0].Email_Id;
                Empnames = CCMailarr[0].Employee_Name;
            }
            else {
                for (var k = 0; k < CCMailarr.length; k++) {
                    if (k == (CCMailarr.length - 1)) {
                        ccmaillst += CCMailarr[k].Email_Id;
                        Empnames += CCMailarr[k].Employee_Name;
                    }

                    else {
                        ccmaillst += CCMailarr[k].Email_Id + ',';
                        Empnames = CCMailarr[k].Employee_Name + '/';
                    }
                }
            }
        }
        if (ccmaillst == null || ccmaillst == "") {
            CanSelCCmailid;

        } if (regiondoclist.length == 1) {
            ccmaildata = regiondoclist[0].Email_Id;
            Empnames = regiondoclist[0].RegionName;
        }
        else {

            for (var l = 0; l < regiondoclist.length; l++) {
                if (l == (regiondoclist.length - 1)) {
                    ccmaildata += regiondoclist[l].Email_Id;
                    Empnames += regiondoclist[l].RegionName;
                }

                else {
                    ccmaildata += regiondoclist[l].Email_Id + ',';
                    Empnames = regiondoclist[l].RegionName + '/';
                }
            }
        }
        if (ccmaillst == "") {
            CanSelCCmailid = ccmaildata

        }
        else {
            CanSelCCmailid = ccmaillst + ',' + ccmaildata;
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

        var Maildata = Object.assign({}, MailObject);
        //for (var j = 0; j < regionlist.length; j++) {
        //    var Regioncode = regionlist[j].RegionCode
        var doclist = $.grep(URMdata, function (v) {
            return v.Region_Code == regionlist[i].RegionCode;
        });
        var ManagerName = doclist[0].Manager_Name;
        Maildata.data.Name = ManagerName;
        Maildata.data.Date = FromDate;
        Maildata.data.regcode = regionlist[i].RegionCode;
        var regioncod = Maildata.data.regcode;
        Maildata.data.DoctorList = GetParticularsHTML(regioncod);
        Maildata.data.to_mail = ccmail;
        Maildata.data.Mail_Sender_Name = CanSelSenderName;
        Maildata.data.Sender_Mail = CanSelFrommailid;
        Maildata.data.cc_mail = CanSelCCmailid;
        Maildata.data.req_id = "GUID141";
        console.log(Maildata);
        $.ajax({
            type: "POST",
            headers: reqHeader,
            url: host,
            data: JSON.stringify(Maildata),
            contentType: "application/json; charset=utf-8",
            success: function (resp) {


                if (resp.trim() != "") {
                    ApiPdfStatus = eval('(' + resp + ')');
                    var text = "";
                    var icon = "info";
                    if (ApiPdfStatus.response.Code == "200") {
                        text = "Mail has been sent";
                        icon = "success";
                        $("input:checkbox").prop("checked", false);
                        fnMsgAlert('success', 'Doctors Birthday', 'Mail has been sent');
                        return false;
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
                    //$("input:checkbox").prop("checked", false);
                    //fnMsgAlert('success', 'Doctors Birthday', 'Mail has been sent');
                    //return false;
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
        //}
        //}
    }
}

function GetParticularsHTML(regioncod) {
    debugger;
    var htmlContent = "";
    if (Doctorslist.length > 0) {
        htmlContent += "<table style='border-collapse:collapse;border:1px solid black'><tbody>";
        htmlContent += "<tr><th style='border-collapse:collapse;font-size: 14px;border:1px solid black'>Doctor Id</th><th style='border-collapse:collapse;font-size: 14px;border:1px solid black;' >Doctor Name.</th><th style='border-collapse:collapse;font-size: 14px;border:1px solid black'>Speciality</th><th style='border-collapse:collapse;font-size: 14px;border:1px solid black'>Dr.Category</th></tr>";



        //if (Doctorslist.length > 0) {
        var doclist = $.grep(Doctorslist, function (v) {
            return v.RegionCode == regioncod;
        });
        for (var j = 0; j < doclist.length; j++) {
            htmlContent += "<tr>";
            htmlContent += "<td style='border-collapse:collapse;border:1px solid black;text-align: center;font-size: 12px;font-family: Arial,Helvetica,sans-serif;'>";
            htmlContent += doclist[j].Customer_Code;
            htmlContent += "</td>";
            htmlContent += "<td style='border-collapse:collapse;border:1px solid black;text-align: center;font-size: 12px;font-family: Arial,Helvetica,sans-serif;'>";
            htmlContent += doclist[j].Doctor_Name;
            htmlContent += "</td>";
            htmlContent += "<td style='border-collapse:collapse;border:1px solid black;text-align: center;font-size: 12px;font-family: Arial,Helvetica,sans-serif;'>";
            htmlContent += doclist[j].Speciality_Name;
            htmlContent += "</td>";
            htmlContent += "<td style='border-collapse:collapse;border:1px solid black;text-align: center;font-size: 12px;font-family: Arial,Helvetica,sans-serif;'>";
            htmlContent += doclist[j].Category_Name;
            htmlContent += "</td>";
            htmlContent += "</tr>";

        }
        //}
        htmlContent += "</tbody></table>";
    }
    return htmlContent;
}

function fncheckmaildetails() {
    debugger
    fnMailsend(Doctorslist);
    $("input:checkbox").prop("checked", false);
    fnMsgAlert('success', 'Doctors Birthday', 'Mail has been sent');
    return false;
    //if (CCMailarr.length != 0 && CCMailarr != "") {
    //    fnMailsend(Doctorslist);

    //}
    //else {
    //    fnMsgAlert('info', 'Info', 'Please Select Copy Holders.');
    //    return false;
    //}


}

function fnGetTemplateDetails() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/DoctorsBirthday/GetMailTemplates',
        type: "POST",
        async: false,
        data: "",
        success: function (Result) {
            var data = Result;
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
