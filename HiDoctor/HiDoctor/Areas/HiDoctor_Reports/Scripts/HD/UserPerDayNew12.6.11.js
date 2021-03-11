//CREATED BY:SRISUDHAN
//CREATED DATE:06-08-2013

var dcrjson_g = "";
var uaccHeaderTableString_g = ' <table class="accHeaderTable"><tr><td style="font-weight:bold;">User Name</td> <td><span id="spnuserName"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Employee Name</td><td><span id="spnpEmpName"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Employee Number</td><td><span id="spnpEmpNumber"></span></td>';
uaccHeaderTableString_g += '</tr>';
uaccHeaderTableString_g += '<tr><td style="font-weight:bold;">Region Name</td><td><span id="spnpRegionName"></span></td></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Designation</td><td><span id="spnpDesignation"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Division Name</td><td><span id="tddivisionName"></span></td>';
uaccHeaderTableString_g += '</tr><tr><td style="font-weight:bold;">DCR Date</td> <td><span id="spnDCRDate"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Work Place</td> <td><span id="spnWorkPlace"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Entered Date</td><td><span id="spnDCRentedDate"></span></td>';
uaccHeaderTableString_g += '</tr></table>';
uaccHeaderTableString_g += ' <h3 style="text-decoration:underline;font-size: 15px;">Accompanist Details:</h3>';
uaccHeaderTableString_g += '<table style="width:99%;margin-top:-12px;">';
uaccHeaderTableString_g += '<tr><td style="font-weight: bold;">User Name</td><td><span id="accPopUpName"></span></td><td style="font-weight: bold;">Employee Name</td><td><span id="accEmpName"></span></td><td style="font-weight: bold;">Region Name</td><td><span id="accRegName"></span></td></tr>';
uaccHeaderTableString_g += '<tr><td style="font-weight: bold;">Division</td><td><span id="accDivName"></span></td><td style="font-weight: bold;">Designation</td><td><span id="accdesignation"></span></td><td style="font-weight: bold;">Time</td><td><span id="accPopUpTime"></span></td></tr>';
uaccHeaderTableString_g += '</table>';



var detailProdString_g = '<table class="accHeaderTable"><tr><td style="font-weight:bold">User Name</td><td><span id="spnduserName"></span></td><td style="font-weight:bold">Employee Name</td>';
detailProdString_g += '<td><span id="spndEmpName"></span></td><td style="font-weight:bold">Region Name</td><td><span id="spndRegionName"></span></td>';
detailProdString_g += '</tr><br /><tr><td style="font-weight:bold">Doctor Name</td><td><span id="spndDocName"></span></td><td style="font-weight:bold">MDL No</td><td><span id="spndMDL"></span></td>';
detailProdString_g += '<td style="font-weight:bold">Specialty</td><td><span id="spndSpeciality"></span></td></tr><tr><td style="font-weight:bold">Category</td><td><span id="spndCategory"></span></td>';
detailProdString_g += '<td style="font-weight:bold">Division Name</td><td><span id="spnDivisionname"></span></td>'
detailProdString_g += '</tr></table>';

function fnGetSurveyResponse(Survey_Id, customercode) {
    debugger;
    Method_params = ["SurveyAPI/GetSurveyResponse", Company_Code, RegionCode, UserCode, customercode, Survey_Id, $('#hdnFlag').val()];
    CoreREST.get(null, Method_params, null, fnSurveyResponseSuccessCallback, fnSurveyResponseFailureCallback);
}
function fnSurveyResponseSuccessCallback(result) {
    debugger;
    response = result;
    if (response == 1) {
        $(".surveylinkno").hide();
        $(".surveylinkyes").show();
    }
    else {
        $(".surveylinkyes").hide();
        $(".surveylinkno").show();
    }
}
function fnviewsurvey(URL) {
    debugger;
    //var subdomainName = '';
    //var Survey_User_Assignment_Id = 0;
    //var Survey_Publish_Group_Id = 0;
    var qeyString = URL;
    $("#mySurveyViewModal").show();
    $("#surveyviewbody").html('<iframe src=' + qeyString + ' id="isurvey" style="width:100%;height:500px;"></iframe>');
}
function fnsurveyresponseclose() {
    $("#mySurveyViewModal").hide();
}
function fnUserPerDayreport() {
    debugger;
    ShowModalPopup("dvloading");
    $('#tree').hide();
    $("#spnTreeToggle").html('Show Tree');
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-12');

    //Hide all divs   
    $("#aExpandCollapse").html("Collapse All");
    $("#aExpandCollapse").html("Collapse All");
    // $("#divuserperday").hide();
    $("#dvUserPerDayCont").hide();
    // $("#dvPrint").hide();

    //Clear All the Fields
    // $("#dvUserPerDayCont").empty();
    $("#dvUserPerDayCont").html('');
    $("#dvPrint").hide();

    //$("#dvUserPerDayCont").html('');
    //$("#divuserperPrint").html('');
    //$("#dvUserPerDayCont").hide();
    //$("#dvPrint").show();
    var options = "";

    //GET OPTIONS
    if ($('#optViewInScreen').attr('checked') == "checked") {
        options = "S";
    }
    else {
        options = "E";
    }


    var userCode = $('#hdnUserCode').val();
    var startDate = ""
    var activityMode = ""
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'User Per Day Report', 'Select Date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($('#ddlflag option:selected').val() == "") {
        fnMsgAlert('info', 'User Per Day Report', 'Please Select Activity.');
        HideModalPopup("dvloading");
        return false;
    }
    // $("#divuserperday").show();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    activityMode = $("#ddlflag option:selected").val();


    $.ajax({
        url: '../HiDoctor_Reports/UserPerDay/GetUserPerDayReport',
        type: "POST",
        data: "userCode=" + userCode + '&sd=' + startDate + '&options=' + options + '&Company_Code=' + companyCode + '&User_Name=' + User_Name + '&Region_Code=' + Region_Code,
        success: function (response) {
            debugger;
            if (response.split('^')[0] != 'FAIL') {
                $("#dvUserPerDayCont").html(response);
                $("#divuserperPrint").html(response);
                var userName = $('#hdnUserName').val();
                fnchecksurveyresponse();
                $('#UserName').html(userName);
                // $("#divuserperday").show();
                $("#dvUserPerDayCont").show();
                if (options == "E") {
                    $("#dvPrint").hide();
                }
                else {
                    $("#dvPrint").show();
                }
                fninializePrint("divuserperPrint", "ifrmuserperday", "dvUserPerDayCont");
                HideModalPopup("dvloading");
            }
            if (response != '') {

            }
            else {
            }
        },
    });
}
var rowid = "";
var lstDetails = [];
var lstDetailsA = [];
function fnchecksurveyresponse() {
    debugger;
    lstDetails = [];
    var tblDoclength = $('#dvUserPerDayCont #tblOwnDoctor tbody tr').length;
    var sno = 0;
    for (var i = 0; i < tblDoclength; i++) {
        sno++;
        rowid = sno;
        if ($('#dvUserPerDayCont #surveylink_' + sno).text().toUpperCase() == "YES") {
            var details = $('#hdnDetails_' + sno).val();
            var doctCode = details.split('|')[0];
            var surveyId = details.split('|')[1];
            var UserCode = details.split('|')[2];
            var flag = "F"
            _objData = {
                Id: rowid,
                Customer_Code: doctCode,
                Survey_Id: surveyId,
                User_Code: UserCode,
                Flag: "F"
            };
            lstDetails.push(_objData)
            Method_params = ["SurveyAPI/GetSurveyResponse", companyCode, Region_Code, UserCode, doctCode, surveyId, flag];
            SurveyCoreREST.get(null, Method_params, null, fnSurveyResponseSuccessCallback, fnSurveyResponseFailureCallback);
        }
    }
    var tblDocAlength = $('#dvUserPerDayCont #tblProducts tbody tr').length;
    lstDetailsA = [];
    for (var i = 0; i < tblDocAlength; i++) {
        rowid = i;
        if ($('#dvUserPerDayCont #surveylinkA_' + i).text().toUpperCase() == "YES") {
            var details = $('#hdnAtteDetails_' + i).val();
            var doctCode = details.split('|')[0];
            var surveyId = details.split('|')[1];
            var UserCode = details.split('|')[2];
            var flag = "A"
            _objData = {
                Id: rowid,
                Customer_Code: doctCode,
                Survey_Id: surveyId,
                User_Code: UserCode,
                Flag: "A"
            };
            lstDetailsA.push(_objData)
            Method_params = ["SurveyAPI/GetSurveyResponse", companyCode, Region_Code, UserCode, doctCode, surveyId, flag];
            SurveyCoreREST.get(null, Method_params, null, fnSurveyAtteResponseSuccessCallback, fnSurveyResponseFailureCallback);
        }
    }
}
function fnSurveyResponseSuccessCallback(response) {
    debugger;
    var disjson = $.grep(lstDetails, function (ele, index) {
        return ele.Id == rowid;
    });
    var content = "";
    if (response == 1) {
        var qeyString = accKey + "/Survey/KASurveyResultPage?CompanyCode=" + companyCode + "&ChecklistId=" + disjson[0].Survey_Id + "&CompanyId=" + CompanyId + "&UserId=" + disjson[0].User_Code + "&CustomerCode=" + disjson[0].Customer_Code + "";
        content = "<a href='#' onclick='fnviewsurvey(\"" + qeyString + "\");'>YES</a>";
    } else {
        content = "<span>NO</span>";
    }
    $('#dvUserPerDayCont #surveylink_' + rowid).html(content);
}
function fnSurveyAtteResponseSuccessCallback(response) {
    var disjson = $.grep(lstDetailsA, function (ele, index) {
        return ele.Id == rowid;
    });
    var content = "";
    if (response == 1) {
        var qeyString = accKey + "/Survey/KASurveyResultPage?CompanyCode=" + companyCode + "&ChecklistId=" + disjson[0].Survey_Id + "&CompanyId=" + CompanyId + "&UserId=" + disjson[0].User_Code + "&CustomerCode=" + disjson[0].Customer_Code + "";
        content = "<a href='#' onclick='fnviewsurvey(\"" + qeyString + "\");'>YES</a>";
    } else {
        content = "<span>NO</span>";
    }
    $('#dvUserPerDayCont #surveylinkA_' + rowid).html(content);
}
function fnSurveyResponseFailureCallback() {
}
function fnShowDigitalsig(Id, Datalink) {
    debugger;
    $('#showImage').html('<img src="' + Datalink + '"/>');
    $("#udvOverLaydg").show();

}
function fnShowAccDoctor(obj, dcrcode) {
    debugger;
    if ($("#udvOverLay").css('display') == 'none') {
        $('#udivAccDocDetail').html('')
        $('#udivAccDocDetail').html(uaccHeaderTableString_g);
        var accName = document.getElementById(obj.id).innerHTML;
        var accStartTimeId = "";
        var accEndTimeId = "";
        var flag = "";
        var dcrflag = $('#hdnFlag').val();


        if (obj.id.indexOf('First') > -1) {
            accStartTimeId = obj.id.replace(/AccPersonName/g, 'AccStartTime');
            accEndTimeId = obj.id.replace(/AccPersonName/g, 'AccEndTime');
        }
        else if (obj.id.indexOf('Sec') > -1) {
            accStartTimeId = obj.id.replace(/SecAccPersonName/g, 'SecondAccStartTime');
            accEndTimeId = obj.id.replace(/SecAccPersonName/g, 'SecondAccEndTime');
        }
        else {
            accStartTimeId = obj.id.replace(/AccPersonName/g, 'AccPersonStartTime');
            accEndTimeId = obj.id.replace(/AccPersonName/g, 'AccPersonEndTime');
        }
        var accTime = document.getElementById(accStartTimeId).innerHTML + "-" + document.getElementById(accEndTimeId).innerHTML;



        var userCode = $('#hdnUserCode').val();
        var userName = $('#UserName').html().split(',')[0];
        var s = $('#UserName').html().split(',')[1];
        var regionName = s.substring(s.lastIndexOf('(') + 1, s.lastIndexOf(')'));
        var dcrDate = $("#txtFromDate").val().split('/')[1] + "/" + $("#txtFromDate").val().split('/')[0] + "/" + $("#txtFromDate").val().split('/')[2];
        var dcrType = $("#ddlflag option:selected").text();
        var workplace = $('#spnPlaceWorked').html();
        var dcrEnterDate = $('#spndcrEnteredDate').html();
        var dcrStatus = $('#spnDCRStatus').html();
        var empName = $('#spnEmpName').html();
        var divisionName = $('#lbnDivisionName').html();
        var designation = $('#lbndesignation').html();
        var empnumber = $('#lbnEmpNumber').html();
        var travlePlaces = "";

        for (var i = 1; i < $("#tblHOP tbody tr").length; i++) {
            travlePlaces += $("#tblHOP tbody tr")[i].getElementsByClassName("sfcFrom")[0].innerHTML + "<br />" + $("#tblHOP tbody tr")[i].getElementsByClassName("sfcTo")[0].innerHTML;
        }

        //Added Newly
        if (dcrType == '') {
            dcrType = dcrflag;
            //flag = dcrflag;
            //if (flag == "F") {
            //    dcrType = "Field";
            //}           
        }
        $('#spnuserName').html(userName);
        $('#spnpEmpName').html(empName);
        $('#spnpRegionName').html(regionName);
        $('#spnDCRDate').html(dcrDate);
        $('#spnDCRType').html(dcrType);
        $('#uspnpDCRStatus').html(dcrStatus);
        $('#spnWorkPlace').html(workplace);
        $('#spnDCRentedDate').html(dcrEnterDate);
        $('#tddivisionName').html(divisionName);
        $('#accPopUpName').html(accName);
        $('#accPopUpTime').html(accTime);
        $('#spnpEmpNumber').html(empnumber);
        $('#spnpDesignation').html(designation);
        $("#udvOverLay").overlay().load();
        fnAccDetail(accName, dcrcode);
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetAccompanistVisitedDoctors',
            data: "DCR_User_Code=" + userCode + "&Acc_User_Name=" + accName + "&DCR_User_Name=" + userName
                + "&DCR_Actual_Date=" + dcrDate,
            success: function (response) {
                if ($('#spndcrversion').html().toUpperCase() == "DCR V3") {
                    var accHTML = $('#udivAccDocDetail').html() + "*Doctor Details <br />" + response + '<br /><span id="accDesclaimer">*the data that you see here is indicative only.</span>';
                }
                else {
                    var accHTML = $('#udivAccDocDetail').html() + response;
                }
                $('#udivAccDocDetail').html(accHTML);

                //fninializePrint("divuserperPrint", "ifrmuserperday", "udivAccDocDetail");
            },
            error: function () {
                fnMsgAlert('info', 'DCR Consolidate', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }

}
function fnAccDetail(accName, DcrUserCode) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetAccompanistVisitedDetails',
        data: "Accompanist=" + accName + "&DcrUserCode=" + DcrUserCode,
        success: function (result) {
            debugger;
            if (result != null && result.length > 0) {
                $('#accEmpName').html(result[0].Emp_Name);
                $('#accRegName').html(result[0].Region_Name);
                $('#accdesignation').html(result[0].User_Type_Name);
                for (var i = 0; i <= result.length; i++) {
                    if (i < result.length - 1) {
                        $('#accDivName').append(result[i].Division_Name + ',');
                    }
                    else {
                        $('#accDivName').append(result[i].Division_Name);
                    }
                }
            }
        },
        error: function () {
            HideModalPopup("dvloading");
        }
    });
}

function fnShowDetailedProducts(rI, docCode, t) {
    $('#divDetailPrdDetail').html('')
    $('#divDetailPrdDetail').html(detailProdString_g);
    var docName = "";
    var docmdl = "";
    var cate = "";
    var spec = "";

    if (t == "acc") {
        docName = $('#accdocName_' + rI).html();
        docmdl = $('#accdocMDL_' + rI).html();
        cate = $('#accdocCategory_' + rI).html();
        spec = $('#accdocSpec_' + rI).html();
    }
    else {
        docName = $('#docName_' + rI).html();
        docmdl = $('#docMDL_' + rI).html();
        cate = $('#docCategory_' + rI).html();
        spec = $('#docSpec_' + rI).html();
    }


    /*var docName = $('#docName_' + rI).html();
    var docmdl = $('#docMDL_' + rI).html();
    var cate = $('#docCategory_' + rI).html();
    var spec = $('#docSpec_' + rI).html();*/
    var dates = $("#txtFromDate").val().split('/')[1] + "/" + $("#txtFromDate").val().split('/')[0] + "/" + $("#txtFromDate").val().split('/')[2] + "^";
    var dcr_user_Code = $("#hdnUserCode").val();
    var dcrDates = "";
    var userCode = $('#hdnUserCode').val();
    var userName = $('#UserName').html().split(',')[0];
    var s = $('#UserName').html().split(',')[1];
    var regionName = s.substring(s.lastIndexOf('(') + 1, s.lastIndexOf(')'));
    var empName = $('#spnEmpName').html();
    var divisionname = $('#lbnDivisionName').html();
    spec = spec.split('<')[0];
    $('#spnduserName').html(userName);
    $('#spndEmpName').html(empName);
    $('#spndRegionName').html(regionName);
    $('#spndDocName').html(docName);
    $('#spndMDL').html(docmdl);
    $('#spndSpeciality').html(spec);
    $('#spndCategory').html(cate == null ? "NA" : cate);
    $('#spnDivisionname').html(divisionname);

    $("#dvDetailedProductOverLay").overlay().load();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDetailedProductsAndInputsPerDoctor',
        data: "doctor_Code=" + docCode + "&doctor_Name=" + $.trim(docName) + "&user_Code=" + userCode
            + "&DCR_Actual_Dates=" + $.trim(dates) + "&speciality_Name=" + $.trim(spec),
        success: function (response) {
            var htmlvalue = $('#divDetailPrdDetail').html() + response;
            $('#divDetailPrdDetail').html(htmlvalue);
        },
        error: function () {
            fnMsgAlert('info', 'DCR Consolidate', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

function fnLeavePopup(val) {
    debugger;
    var tblcontent = "", approvedby = "", approvedDate = "", approvedReason = "", attachment = "";
    approvedby = val.split('|')[0];
    approvedDate = val.split('|')[1];
    approvedReason = val.split('|')[2];
    attachment = val.split('|')[3];
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Reports/UserPerDay/GetAttachments",
        data: "attachment_Id=" + attachment,
        success: function (result) {
            debugger;
            tblcontent += "<table class='table table-striped'>";
            tblcontent += "<thead class='active'><tr><th>S No</th>";
            tblcontent += "<th>Attachment Name</th>";
            tblcontent += "</tr></thead>";
            tblcontent += "<tbody>";
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    tblcontent += "<tr>";
                    tblcontent += "<td>" + (i + 1) + "</td>";
                    //tblcontent += "<td>" + result[i].Attachment_Name + "</td>";
                    tblcontent += "<td><span><a href='" + result[i].Attachment_Url + "'>" + result[i].Attachment_Name + " </span></td>";
                    tblcontent += "</tr>";
                }
            }
            else {
                tblcontent += "No details found.";
            }
            tblcontent += "</tbody>";
            tblcontent += "</table>";

            tblcontent += "<label>NOTE: Click on Attachment Name to Download the Attachment</label>";
            $('#tblleavepopup').html(tblcontent);
            $("#dvPopupLeave").overlay().load();
        }
    });
    //tblcontent += "<table class='table table-striped'>";
    //tblcontent += "<thead class='active'><tr><th>Approved/Unapproved By</th>";
    //tblcontent += "<th>Approved/Unapproved Date</th><th>Approved/Unapproved Date</th>";
    //tblcontent += "</tr></thead>";
    //tblcontent += "<tbody>";
    //if (val != '') {
    //    tblcontent += "<tr>";
    //    tblcontent += "<td>" + approvedby + "</td>";
    //    tblcontent += "<td>" + approvedDate + "</td>";
    //    tblcontent += "<td>" + approvedReason + "</td>";
    //    tblcontent += "</tr>";
    //}
    //else {
    //    tblcontent += "No details found.";
    //}
    //tblcontent += "</tbody>"
    //tblcontent += "</table>";
    //$('#tblleavepopup').html(tblcontent);
    //$("#dvPopupLeave").overlay().load();
}

function fnGetDoctorAccompanist(id) {
    var dcr_date = "";
    var doctor_Visit_Code = ""; var mdlno = ""; var doc_name = ""; var category = "";
    var details = $("#divDocAccDetails_" + id).text().trim().split('$');
    var userCode = $('#hdnUserCode').val();
    dcr_date = details[0];
    doctor_Visit_Code = details[1];
    mdlno = details[2];
    doc_name = details[3];
    category = details[4];
    $("#dvAccOverLay").overlay().load();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorVisitAccName',
        data: "dcr_date=" + dcr_date + "&doctor_Visit_Code=" + doctor_Visit_Code + "&user_code=" + userCode,
        success: function (response) {
            var header = doc_name + ", " + mdlno + ", " + category;
            $("#doc_details").text(header);
            $("#divAccDocDetail_Call").html(response);
        },
        error: function () {
            fnMsgAlert('info', 'DCR Consolidate', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}



// POB Order 


function fnGetPOBProductDetailsforReport(Order_Id) {
    debugger;
    $.ajax({
        start: ShowModalPopup("dvloading"),
        type: 'POST',
        data: 'orderId=' + Order_Id,
        url: 'Order/GetOrder',
        async: false,
        success: function (response) {
            if (response != null && response != undefined) {
                fnBuildPOBDetails(response);
            }
        },
        complete: function () {
            HideModalPopup("dvloading");
        }
    });
}

function fnBuildPOBDetails(jsonPOB) {
    var customerCaption = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Customer");

    if (jsonPOB.lstHeader.length > 0) {
        var strPOB = "<table style='width:100%' class='data display box'><tbody><tr>";
        strPOB += "<tr><td colspan='2'>" + customerCaption + " Name : </td><td colspan='2'>" + jsonPOB.lstHeader[0].Customer_Name + "</td></tr>";
        var orderDueDate = new Date(eval(jsonPOB.lstHeader[0].Order_Due_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
        strPOB += "<tr><td>Stockist Name : </td><td>" + jsonPOB.lstHeader[0].Stockist_Name + "</td><td>Due Date : </td><td>" + orderDueDate.getDate() + "/" + (orderDueDate.getMonth() + 1) + "/" + orderDueDate.getFullYear() + "</td></tr>";
        strPOB += "<tr><td colspan='4'>";

        strPOB += "<table style='width:100%' class='data display box'>";
        strPOB += "<thead>";
        strPOB += "<tr>";
        strPOB += "<th>Product Name</th><th>Qty</th><th>Unit Rate</th><th>Amount</th>";
        strPOB += "</tr>";
        strPOB += "<thead>";
        strPOB += "<tbody>";
        for (var pRCount = 0; pRCount < jsonPOB.lstDetails.length; pRCount++) {
            strPOB += "<tr><td>" + jsonPOB.lstDetails[pRCount].Product_Name + "</td><td>" + jsonPOB.lstDetails[pRCount].Product_Qty + "</td><td>" + jsonPOB.lstDetails[pRCount].Unit_Rate + "</td><td>" + jsonPOB.lstDetails[pRCount].Amount + "</td></tr>";
        }
        strPOB += "</tbody>";
        strPOB += "<tfoot>";
        strPOB += "<tr style='font-weight: bold;'><td>No of Products : " + jsonPOB.lstHeader[0].No_Of_Products + "</td><td>Total Qty : " + jsonPOB.lstHeader[0].Total_Qty + "</td><td colspan='2'>  Total POB :  " + jsonPOB.lstHeader[0].Total_POB_Value + "</td></tr>";
        strPOB += "</tfoot>";
        strPOB += "</table>";

        strPOB += "<tr><td colspan='4'>Remarks :</td><tr>";
        strPOB += "<tr><td colspan='4'>" + jsonPOB.lstHeader[0].Remarks + "</td><tr>";
        strPOB += "</td><tr>";
        strPOB += "</tbody></table>";

        $("#dvMoreInfoHeader").html("POB Details");
        $("#dvInfoContent").html(strPOB);
        $("#dvMoreInfoModal").overlay().load();
    }
}
function fngetCMEProductDetails(DCR_Code, DCR_Attendance_Doctor_Id, CME_Id) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetCMEProductDetails',
        data: "DCR_Code=" + DCR_Code + '&DCR_Attendance_Doctor_Id=' + DCR_Attendance_Doctor_Id + '&CME_Id=' + CME_Id,
        success: function (response) {
            var str = '';
            if (response.length > 0) {
                str = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>CME Details</h3></div>";
                str += "<label style='margin-left: 55px;padding: 10px;'>No of Month Tracked : " + response[0].No_Of_Months + "</label>";
                str += "<table id='tblCME' style='width: 85%;' class='data display dataTable box'><thead>";
                str += "<th>Product Name</th><th>Current Sales</th><th>ExpectedSales</th></thead>";
                str += "<tbody>";
                for (var i = 0; i < response.length; i++) {
                    str += "<tr>";
                    str += "<td>" + response[i].Product_Name + "</td><td>" + response[i].Current_Sales + "</td><td>" + response[i].Expected_Sales + "</td>"
                    str += "</tr>";

                }
                str += "</tbody></table>";
                $('#dvCMEDetails').html(str);

            }
            else {
                $('#dvCMEDetails').html('No Record found');
            }
            $("#dvCME").show();

        },
        error: function () {

        }
    });
}
function fnCMEclose() {
    debugger;
    $("#dvCME").hide();
    $("#dvReportTwo").removeClass('addzindex');
    $("#dvReportTwo").addClass('removezindex');

}
function fnshowattachments(url) {
    debugger;
    $('#dvExpense').overlay().load();
    $('#tblexpense').html('<img src=' + url + ' style="width:50%;max-width:1000px;height:50%;max-height:1000px;text-align:center;">');
}
function fnshowDRReport(headerid) {
    debugger;
    Method_params = ["DieticianReporting/GetDieticianReportingdetailsforDCR", Company_Code, Region_Code, headerid];
    CoreREST.get(null, Method_params, null, fngetDieticianReportingdetailsSuccessData, fngetDieticianReportingdetailsFailure);
}

function fngetDieticianReportingdetailsSuccessData(response) {
    debugger;
    $("#dvDRdetails").html("");
    var content = "";
    for (var i = 0; i < response.list.lstheaderdetails.length; i++) {
        content += "<h3>Camp" + (i + 1) + "</h3>";
        content += "<table class='data display dataTable box' style='width:100%'>";
        content += "<thead>";
        content += "<tr>";
        content += "<th>Filled By</th>";
        content += "<th>Region Name</th> ";
        content += "<th>Start Date</th>";
        content += "<th>Start Time</th>";
        content += "<th>End Time</th>";
        content += "<th>Camp Type</th>";
        content += "<th>Camp Sub Type</th>";
        content += "<th>Location</th>";
        content += "<th>Doctor Count</th>";
        content += "<th>Patient Count</th>";
        content += "<th>Prescription Count</th>";
        content += "</tr>";
        content += "</thead>";
        headerid = response.list.lstheaderdetails[i].Camp_Sub_Type;
        var CST = response.list.lstheaderdetails[i].Camp_Sub_Type;
        var disjson = $.grep(response.list.lstheaderdetails, function (ele, index) {
            return ele.Camp_Sub_Type == headerid;
        });
        content += "<tbody>";
        //   for (var d = 0; i < disjson.length; x++) {
        var a = disjson[0].Start_date.split("T");
        content += "<tr>";
        content += "<td>" + disjson[0].Filled_By + "</td>";
        content += "<td>" + disjson[0].Region_Name + "</td>";
        content += "<td>" + a[0] + "</td>";
        content += "<td>" + disjson[0].Start_Time + "</td>";
        content += "<td>" + disjson[0].End_Time + "</td>";
        content += "<td>" + disjson[0].Activity_Name + "</td>";
        content += "<td>" + disjson[0].SubActivity_Name + "</td>";
        content += "<td>" + disjson[0].Location + "</td>";
        if (disjson[0].Noofdoctors != 0) {
            content += "<td>" + disjson[0].Noofdoctors + "</td>";
        }
        else {
            content += "<td>-</td>";
        }
        if (disjson[0].Noofpatients != 0) {
            content += "<td>" + disjson[0].Noofpatients + "</td>";
        }
        else {
            content += "<td>-</td>";
        }
        if (disjson[0].Noofprescriptions != 0) {
            content += "<td>" + disjson[0].Noofprescriptions + "</td>";
        }
        else {
            content += "<td>-</td>";
        }
        content += "</tr>";
        //  }
        content += "</tbody>";
        content += "</table>";
        if (response.list.lstAccompdetails.length > 0) {
            content += "<table style='width:100%' class='data display dataTable box'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Accompanist Name</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";
            var disjson = $.grep(response.list.lstAccompdetails, function (ele, index) {
                return ele.Accompanist_Code == headerid;
            });
            for (var k = 0; k < disjson.length; k++) {
                content += "<tr>";
                if (disjson[k].User_Name != null) {
                    content += "<td>" + disjson[k].User_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
        if (response.list.lstdoctordetails.length > 0) {
            content += "<table style='width:100%' class='data display dataTable box'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Doctor Name</th>";
            content += "<th>Speciality Name</th>";
            content += "<th>Prescription Value</th>";
            content += "<th>Notes</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";
            var disjson = $.grep(response.list.lstdoctordetails, function (ele, index) {
                return ele.Doctor_Code == headerid;
            });
            for (var m = 0; m < disjson.length; m++) {
                content += "<tr>";
                if (disjson[m].Customer_Name != null) {
                    content += "<td>" + disjson[m].Customer_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }

                if (disjson[m].Speciality_Name != -1) {
                    content += "<td>" + disjson[m].Speciality_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[m].Prescription_Value != 0) {
                    content += "<td>" + disjson[m].Prescription_Value + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[m].Notes != null) {
                    content += "<td>" + disjson[m].Notes + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
        if (response.list.lstpatientdetails.length > 0) {
            content += "<table style='width:100%' class='data display dataTable box'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Parameter Type</th>";
            content += "<th>Patient Name</th>";
            content += "<th>Age</th>";
            content += "<th>Gender</th>";
            content += "<th>Prescription Value</th>";
            content += "<th>Notes</th>";
            content += "</tr>";
            content += "</thead>";

            content += "<tbody>";
            var disjson = $.grep(response.list.lstpatientdetails, function (ele, index) {
                return ele.Parameter_Value == headerid;
            });
            for (var n = 0; n < disjson.length; n++) {
                content += "<tr>";
                if (disjson[n].Parametertype_Name != null) {
                    content += "<td>" + disjson[n].Parametertype_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Patient_Name != null) {
                    content += "<td>" + disjson[n].Patient_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Age != 0) {
                    content += "<td>" + disjson[n].Age + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Gender != -1 && disjson[n].Gender != null) {
                    content += "<td>" + disjson[n].Gender + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Total_Prescription_Value != 0) {
                    content += "<td>" + disjson[n].Total_Prescription_Value + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Notes != null) {
                    content += "<td>" + disjson[n].Notes + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
        if (response.list.lstprescriptiondetails.length > 0) {
            content += "<table style='width:100%' class='data display dataTable box'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Product Name</th>";
            content += "<th>No of Prescriptions</th>";
            content += "<th>No of Prescription Value</th>";
            content += "<th>Notes</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";
            var disjson = $.grep(response.list.lstprescriptiondetails, function (ele, index) {
                return ele.Product_Code == headerid;
            });
            for (var o = 0; o < disjson.length; o++) {
                content += "<tr>";
                if (disjson[o].Product_Name != null) {
                    content += "<td>" + disjson[o].Product_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[o].No_of_Prescriptions != 0) {
                    content += "<td>" + disjson[o].No_of_Prescriptions + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[o].No_of_PrescriptionValue != 0) {
                    content += "<td>" + disjson[o].No_of_PrescriptionValue + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[o].Notes != null) {
                    content += "<td>" + disjson[o].Notes + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }

                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
    }
    $("#dvDRdetails").append(content);
    $("#dvDR").show();
}
function fngetDieticianReportingdetailsFailure() {

}