var header_g = "";
var headerid = "";
var accV4HeaderTableString_g = ' <table class="accHeaderTable"><tr><td style="font-weight:bold;">User Name</td> <td><span id="spnpuserName"></span></td>';
accV4HeaderTableString_g += '<td style="font-weight:bold;">Employee Name</td><td><span id="spnpEmpName"></span></td>';
accV4HeaderTableString_g += '<td style="font-weight:bold;">Employee Number</td><td><span id="spnpEmpNumber"></span></td>';
accV4HeaderTableString_g += '</tr>';
accV4HeaderTableString_g += '<tr><td style="font-weight:bold;">Region Name</td><td><span id="spnpRegionName"></span></td></td>';
accV4HeaderTableString_g += '<td style="font-weight:bold;">Designation</td><td><span id="spnpDesignation"></span></td>';
accV4HeaderTableString_g += '<td style="font-weight:bold;">Division Name</td><td><span id="tddivisionName"></span></td>';
accV4HeaderTableString_g += '</tr><tr><td style="font-weight:bold;">DCR Date</td> <td><span id="spnDCRDate"></span></td>';
accV4HeaderTableString_g += '<td style="font-weight:bold;">Work Place</td> <td><span id="spnWorkPlace"></span></td>';
accV4HeaderTableString_g += '<td style="font-weight:bold;">Entered Date</td><td><span id="spnDCRentedDate"></span></td>';
accV4HeaderTableString_g += '</tr></table>';
//accV4HeaderTableString_g += '<table style="width:50%;margin:0px auto;">';
//accV4HeaderTableString_g += '<tr><td style="font-weight: bold;">Accompanist Name : </td><td><span id="accPopUpName"></span></td></tr>';
//accV4HeaderTableString_g += '<tr><td style="font-weight: bold;">Time : </td><td><span id="accPopUpTime"></span></td></tr>';
//accV4HeaderTableString_g += '</table>';
accV4HeaderTableString_g += '<div style="height:45px;"><span style="font-size:19px;">Accompanist Details</span></div>';
accV4HeaderTableString_g += '<table style="width:99%;margin-top:-12px;">';
accV4HeaderTableString_g += '<tr><td style="font-weight: bold;">User Name</td><td><span id="accPopUpName"></span></td><td style="font-weight: bold;">Employee Name</td><td><span id="accEmpName"></span></td><td style="font-weight: bold;">Region Name</td><td><span id="accRegName"></span></td></tr>';
accV4HeaderTableString_g += '<tr><td style="font-weight: bold;">Division</td><td><span id="accDivName"></span></td><td style="font-weight: bold;">Designation</td><td><span id="accdesignation"></span></td><td style="font-weight: bold;">Time</td><td><span id="accPopUpTime"></span></td></tr>';
accV4HeaderTableString_g += '</table>';


var detailProdString_g = '<table class="accHeaderTable"><tr><td style="font-weight:bold;">User Name</td><td><span id="spnduserName"></span></td><td style="font-weight:bold;">Employee Name</td>';
detailProdString_g += '<td><span id="spndEmpName"></span></td><td style="font-weight:bold;">Region Name</td><td><span id="spndRegionName"></span></td>';
detailProdString_g += '</tr><br /><tr><td style="font-weight:bold;">Doctor Name</td><td><span id="spndDocName"></span></td><td style="font-weight:bold;">MDL No</td><td><span id="spndMDL"></span></td>';
detailProdString_g += '<td style="font-weight:bold;">Speciality</td><td><span id="spndSpeciality"></span></td></tr><tr><td style="font-weight:bold;">Category</td><td><span id="spndCategory"></span></td>';
detailProdString_g += '</tr></table>';
var response = '';
function BindV4DCRDeatils(dcrDetailJSON) {
    debugger;
    dcrdejson_g = dcrDetailJSON;
    fnBindV4HeaderDeatils(dcrDetailJSON.Tables[0]);
    fnBindV4HOPPlaces(dcrDetailJSON.Tables[1]);
    if (flag_g == 'A') {
        $('#spnTypeofDCR').html('Attendance');
        $('#dvAcc').css('display', 'none');
        $('#tblAcc').css('display', 'none');
        fnBindV4ExpenseDetails(dcrDetailJSON.Tables[2]);
        fnBindV4AttendanceDetails(dcrDetailJSON.Tables[3])
        BindAttendanceDoctorDetails(dcrDetailJSON.Tables[22]);
        fnBindV4AttendanceHospitalProductDetails(dcrDetailJSON.Tables[23]);
        fnBindV4AttendanceHospitalContactDetails(dcrDetailJSON.Tables[24]);
        fnBindV4AttendanceHospitalActivityDetails(dcrDetailJSON.Tables[25]);
        BindAttendanceCallActivityDetails(dcrDetailJSON.Tables[20]);
        BindAttendanceMCActivityDetails(dcrDetailJSON.Tables[21]);
        fnBindV4AttendanceProductDetails(dcrDetailJSON.Tables[19]);
    }
    else {
        debugger;
        fnBindV4OwnDoctorsVisit(dcrDetailJSON.Tables[2], dcrDetailJSON.Tables[2].Rows.length);
        // fnBindV4AccDoctorsVisit(dcrDetailJSON.Tables[3], dcrDetailJSON.Tables[2].Rows.length);
        fnBindV4ProductDetails(dcrDetailJSON.Tables[4]);
        fnBindV4DetailsProductDetails(dcrDetailJSON.Tables[11]);
        if (Company_Code != 'COM00000146') {
            fnBindV4DetailedDigitalAssets(dcrDetailJSON.Tables[15]);
        }
        fnBindV4ChemistDetails(dcrDetailJSON.Tables[5]);
        fnBindPOBOrder(dcrDetailJSON.Tables[14]);
        fnBindV4FollowUps(dcrDetailJSON.Tables[12]);
        fnBindV4Attachments(dcrDetailJSON.Tables[13]);
        fnBindV4RCPADetails(dcrDetailJSON.Tables[6]);
        fnBindV4CallActivity(dcrDetailJSON.Tables[23]);
        fnBindV4MCActivity(dcrDetailJSON.Tables[24]);
        fnBindV4CompetitorProductDetails(dcrDetailJSON.Tables[25]);
        $.ajax({
            type: 'POST',
            data: 'flag=' + flag_g,
            url: '../HiDoctor_Activity/DCRV4ChemistVisit/GetChemistVisitPrivilegeforReport',
            success: function (response) {

                var chemistPlv = response;
                if (chemistPlv == "CHEMIST_DAY") {
                    fnBindV4ChemistOwnChemistVisit(dcrDetailJSON.Tables[16]);
                    fnBindV4ChemistContact(dcrDetailJSON.Tables[33]);
                    fnBindV4ChemistDetailsProductDetails(dcrDetailJSON.Tables[18]);
                    fnBindV4ChemistSampleProductDetails(dcrDetailJSON.Tables[17]);
                    fnBindV4ChemistRCPADetails(dcrDetailJSON.Tables[19]);
                    fnBindChemistPOBOrder(dcrDetailJSON.Tables[20]);
                    fnBindV4ChemistFollowUps(dcrDetailJSON.Tables[21]);
                    fnBindV4ChemistAttachments(dcrDetailJSON.Tables[22]);
                }
            }
        });

        fnBindV4StockiestDetails(dcrDetailJSON.Tables[7]);
        // fnBindDoctorAccompanists(dcrDetailJSON.Tables[8]);
        //fnBindDetailedProducts(dcrDetailJSON.Tables[9]);
        fnBindV4ExpenseDetails(dcrDetailJSON.Tables[10]);
    }
    HideModalPopup('dvLoading');
}


function fnBindV4HeaderDeatils(dcrHeaderJson) {
    debugger;
    var headerJson = dcrHeaderJson.Rows[0];
    if (headerJson.DCR_Status == "1" || headerJson.DCR_Status == "2") {
        //$('#dvUnapprove').css('display', '');
    }
    $('#spnuserName').html(headerJson.User_Name);
    $('#spniregionName').html(headerJson.Region_Name);
    $('#spnPlaceWorked').html(headerJson.Place_Worked);
    $('#spnCategory').html(headerJson.Category);
    $('#spnPlacefrom').html(headerJson.From_Place);
    $('#spnSFCRegion').html(headerJson.SFC_Region);
    $('#spnPlaceto').html(headerJson.To_Place);
    $('#spnTravelMode').html(headerJson.Travel_Mode);
    $('#spnDistance').html(headerJson.Travelled_Kms);
    $('#spnCpName').html(headerJson.CP_Name);
    $('#spnStartTime').html(headerJson.User_Start_Time);
    $('#spnEndTime').html(headerJson.User_End_Time);
    $('#spndcrEnteredDate').html(headerJson.DCR_Entered_Date);
    $('#spniEmpName').html(headerJson.Employee_Name);
    $('#dcrcode').val(headerJson.DCR_Code);
    $('#dcrcode').val(headerJson.DCR_Code);
    $('#lbnEmpNumber').html(headerJson.Employee_Number);
    $('#lbnDivisionName').html(headerJson.Division_Name);
    $('#lbndesignation').html(headerJson.User_Type_Name);

    if (headerJson.Person_Type_Code == null) {
        $('#accdetails').hide();
        $('#accRow1').css('display', 'none');
    }
    else {
        $('#accdetails').show();
        if (headerJson.Acc1_Only_For_Doctor != null && headerJson.Acc1_region_Code == null) {
            $("#spnfirstregion").html(headerJson.Acc1_Only_For_Doctor);
            $("#spnFirstAccPersonName").html(" ");
            $("#spnindependentone").html("Yes");
        }
        else if (headerJson.Acc1_Only_For_Doctor == null && headerJson.Acc1_region_Code != null) {
            $("#spnfirstregion").html(headerJson.Acc1_region_Code);
            $('#spnFirstAccPerType').html(headerJson.Person_Type_Code);
            $('#spnFirstAccPersonName').html(headerJson.Person_Code);
            $("#spnindependentone").html("No");
        }
        else {
            $("#spnfirstregion").html(headerJson.Acc1_region_Code);
            $('#spnFirstAccPerType').html(headerJson.Person_Type_Code);
            $('#spnFirstAccPersonName').html(headerJson.Person_Code);
            $("#spnindependentone").html("Yes");
        }



        if (headerJson.Accomp_Start_Time != null && headerJson.Accomp_Start_Time != "") {
            $('#spnFirstAccStartTime').html(headerJson.Accomp_Start_Time);
        }
        if (headerJson.Accomp_End_Time != null && headerJson.Accomp_End_Time != "") {
            $('#spnFirstAccEndTime').html(headerJson.Accomp_End_Time);
        }
    }

    if (headerJson.Acc2_Type_Code == null) {
        $('#accRow2').css('display', 'none');
    }
    else {
        if (headerJson.Acc2_Only_For_Doctor != null && headerJson.Acc2_region_Code == null) {
            $("#spnsecondregion").html(headerJson.Acc2_Only_For_Doctor);
            $("#spnSecAccPersonName").html(" ");
            $("#spnindependenttwo").html("Yes");
        }
        else if (headerJson.Acc2_Only_For_Doctor == null && headerJson.Acc2_region_Code != null) {
            $("#spnsecondregion").html(headerJson.Acc2_region_Code);
            $('#spnSecAccPersonType').html(headerJson.Acc2_Type_Code);
            $('#spnSecAccPersonName').html(headerJson.Acc2_User_Code);
            $("#spnindependenttwo").html("No");
        }
        else {
            $("#spnsecondregion").html(headerJson.Acc2_region_Code);
            $('#spnSecAccPersonType').html(headerJson.Acc2_Type_Code);
            $('#spnSecAccPersonName').html(headerJson.Acc2_User_Code);
            $("#spnindependenttwo").html("Yes");
        }

        if (headerJson.Acc2_Start_Time != null && headerJson.Acc2_Start_Time != "") {
            $('#spnSecAccStartTime').html(headerJson.Acc2_Start_Time);
        }
        if (headerJson.Acc2_End_Time != null && headerJson.Acc2_End_Time != "") {
            $('#spnSecAccEndTime').html(headerJson.Acc2_End_Time);
        }
    }
    if (headerJson.Acc_3_Person == null) {
        $('#accRow3').css('display', 'none');
    }
    else {
        if (headerJson.Acc3_Only_For_Doctor != null && headerJson.Acc3_region_Code == null) {
            $("#spnthirdregion").html(headerJson.Acc3_Only_For_Doctor);
            $("#spnThirdAccPersonName").html(" ");
            $("#spnindependentthree").html("Yes");
        }
        else if (headerJson.Acc3_Only_For_Doctor == null && headerJson.Acc3_region_Code != null) {
            $("#spnthirdregion").html(headerJson.Acc3_region_Code);
            $('#spnThirdAccPersonType').html(headerJson.Acc3_Type_Code);
            $('#spnThirdAccPersonName').html(headerJson.Acc_3_Person);
            $("#spnindependentthree").html("No");
        }
        else {
            $("#spnthirdregion").html(headerJson.Acc3_region_Code);
            $('#spnThirdAccPersonName').html(headerJson.Acc_3_Person);
            $("#spnindependentthree").html("Yes");
        }

        if (headerJson.Acc_3_Time != null) {
            if (headerJson.Acc_3_Time.split('_')[0] != '') {
                $('#spnThirdAccStartTime').html(headerJson.Acc_3_Time.split('_')[0]);
            }
            if (headerJson.Acc_3_Time.split('_')[1] != '') {
                $('#spnThirdAccEndTime').html(headerJson.Acc_3_Time.split('_')[1]);
            }
        }
    }

    if (headerJson.Acc_4_Person == null) {
        $('#accRow4').css('display', 'none');
    }
    else {
        if (headerJson.Acc4_Only_For_Doctor != null && headerJson.Acc4_region_Code == null) {
            $("#spnfourthregion").html(headerJson.Acc4_Only_For_Doctor);
            $("#spnFourthAccPersonName").html(" ");
            $("#spnindependentfour").html("Yes")
        }
        else if (headerJson.Acc4_Only_For_Doctor == null && headerJson.Acc4_region_Code != null) {
            $("#spnfourthregion").html(headerJson.Acc4_region_Code);
            $('#spnFourthAccPersonName').html(headerJson.Acc_4_Person);
            $("#spnindependentfour").html("No");
        }
        else {
            $("#spnfourthregion").html(headerJson.Acc4_region_Code);
            $('#spnFourthAccPersonName').html(headerJson.Acc_4_Person);
            $("#spnindependentfour").html("Yes");
        }


        if (headerJson.Acc_4_Time != null) {
            if (headerJson.Acc_4_Time.split('_')[0] != '') {
                $('#spnFourthAccStartTime').html(headerJson.Acc_4_Time.split('_')[0]);
            }
            if (headerJson.Acc_4_Time.split('_')[0] != '') {
                $('#spnFourthAccEndTime').html(headerJson.Acc_4_Time.split('_')[1]);
            }
        }
    }

    var status = headerJson.DCR_Status == "3" ? "Drafted" : headerJson.DCR_Status == "1" ? "Applied" : "Approved"
    $('#spnDCRStatus').html(status);
    $('#spnApprovedby').html(headerJson.Approved_By == null ? '' : headerJson.Approved_By);
    $('#spnApproveddate').html(headerJson.ApprovedDate == null ? '' : headerJson.ApprovedDate);
    var unapprovalReason = headerJson.Unapproval_Reason == null ? '' : headerJson.Unapproval_Reason;
    unapprovalReason = unapprovalReason.replace(/~\^/g, ' - N/A<br />');
    unapprovalReason = unapprovalReason.replace(/\^/g, '<br />');
    unapprovalReason = unapprovalReason.replace(/~/g, ' - ');
    $('#spnUnapprovalreason').html(unapprovalReason);
    $('#spnNoofdoctorsmet').html();

    var DcrcommonRemarks = headerJson.DCR_General_Remarks == null ? '' : headerJson.DCR_General_Remarks;
    DcrcommonRemarks = DcrcommonRemarks.replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
    DcrcommonRemarks = DcrcommonRemarks.replace("^", "<br />");//.replace(/\^/g, '<br />');
    DcrcommonRemarks = DcrcommonRemarks.replace("~", " - ");//.replace(/~/g, ' - ');
    DcrcommonRemarks = DcrcommonRemarks.replace(/\^/g, '<br />');//.replace(/~/g, ' - ');

    $('#spnDCRCommonRemarks').html(DcrcommonRemarks)
}
function fnBindV4HOPPlaces(dcrHOPJson) {
    if (dcrHOPJson != null) {
        debugger;
        if (dcrHOPJson.Rows.length > 0) {
            var hopPlacesHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>SFC Details</h3></div>";
            hopPlacesHtml += "<table id='tblHOP' style='width:85%' class='data display dataTable box'><thead><th>Region Name</th><th>From Place</th><th>To Place</th><th>Travel Mode</th><th>Distance</th></thead>";
            hopPlacesHtml += "<tbody>";
            for (var i = 0; i < dcrHOPJson.Rows.length; i++) {
                var region = dcrHOPJson.Rows[i].Region_Name == null ? '' : dcrHOPJson.Rows[i].Region_Name;
                var fromPalce = dcrHOPJson.Rows[i].From_Place == null ? '' : dcrHOPJson.Rows[i].From_Place;
                var toPlace = dcrHOPJson.Rows[i].To_Place == null ? '' : dcrHOPJson.Rows[i].To_Place;
                var distnce = dcrHOPJson.Rows[i].Distance == null ? '' : dcrHOPJson.Rows[i].Distance;
                var travelmode = dcrHOPJson.Rows[i].Travel_Mode == null ? '' : dcrHOPJson.Rows[i].Travel_Mode;
                hopPlacesHtml += "<tr>";
                hopPlacesHtml += "<td>" + region + "</td>";
                if (dcrHOPJson.Rows[i].Route_Way == "R") {
                    hopPlacesHtml += "<td>" + toPlace + "</td>";
                    hopPlacesHtml += "<td>" + fromPalce + "</td>";
                }
                else {
                    hopPlacesHtml += "<td>" + fromPalce + "</td>";
                    hopPlacesHtml += "<td>" + toPlace + "</td>";
                }
                hopPlacesHtml += "<td>" + travelmode + "</td>";
                hopPlacesHtml += "<td>" + distnce + "</td>";
                hopPlacesHtml += "</tr>";
            }
            hopPlacesHtml += "</tbody></table>";
            $('#dvhopplaces').html(hopPlacesHtml);
            $('#tblSFCDetails').css('display', 'none');
            $('#dvsfcdetails').css('display', 'none');
            //$('#tblHOP').dataTable({
            //    "bFilter": false,
            //    "bPaginate": false,
            //    "sPaginationType": "full_numbers",
            //    "bInfo": false,
            //    // "sScrollX": "100%",
            //    "bSort": false
            //});
        }
    }
}
var val = '';
var CustomerCode_g = '';
var lstCustomerSurveyMap = [];
function fnGetSurveyResponse(id, Survey_Id, customercode) {
    debugger;
    val = id;
    CustomerCode_g = customercode;
    var _objData = {
        Id: id,
        Customer_Code: customercode
    }
    lstCustomerSurveyMap.push(_objData);
    Method_params = ["SurveyAPI/GetSurveyResponse", Company_Code, RegionCode, UserCode, customercode, Survey_Id, flag_g];
    SurveyCoreREST.get(null, Method_params, null, fnSurveyResponseSuccessCallback, fnSurveyResponseFailureCallback);
}
function fnSurveyResponseSuccessCallback(result) {
    debugger;
    response = result;
    if (response == 1) {
        var disjson = $.grep(lstCustomerSurveyMap, function (ele, index) {
            return ele.Id == val;
        })
        if (flag_g == 'A') {
            $("#Surveylink" + val + "").append("<a href='#' style='color:blue;' onclick='fnviewsurvey(\"" + Survey_Id + "\",\"" + disjson[0].Customer_Code + "\");'>YES</a>");
        }
        else {
            $("#surveylinkyes_" + val + "").append("<a href='#' style='color:blue;' onclick='fnviewsurvey(\"" + Survey_Id + "\",\"" + disjson[0].Customer_Code + "\");'>YES</a>");
        }
    }
    else {
        if (flag_g == 'A') {
            $("#Surveylink" + val + "").append("<span>NO</span>");
        }
        else {
            $("#surveylinkyes_" + val + "").append("<span>NO</span>");
        }
    }
}
function fnSurveyResponseFailureCallback() {
    debugger;
}
function fnviewsurvey(Survey_Id, CustomerCode) {
    debugger;
    var subdomainName = '';
    var Survey_User_Assignment_Id = 0;
    var Survey_Publish_Group_Id = 0;
    var qeyString = accKey + '/Survey/KASurveyResultPage?CompanyCode=' + Company_Code + '&ChecklistId=' + Survey_Id + '&CompanyId=' + CompanyId + '&UserId=' + UserCode + '&CustomerCode=' + CustomerCode + '';
    $("#mySurveyViewModal").show();
    $("#surveyviewbody").html('<iframe src=' + qeyString + ' id="isurvey" style="width:100%;height:500px;"></iframe>');
}
function fnsurveyresponseclose() {
    $("#mySurveyViewModal").hide();
}
function fnBindV4OwnDoctorsVisit(dcrOwnDoctorJson, count) {
    debugger;
    var drCountlist = 0;
    //No Need for check count
    if (dcrOwnDoctorJson.Rows.length > 0) {
        drCountlist = dcrOwnDoctorJson.Rows.length;
        var ownDocHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>" + doctor_caption + " visited  Details</h3><h4 id='drCount' style='padding-left: 65%;'> Total " + doctor_caption + "  Met Count  : <td> " + drCountlist + " </td> </h4></div>";
        ownDocHtml += "<table id='tblV4OwnDoctor'  class='data display box' style='width:85%'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>MDL/SVL#</th><th>Category</th><th>Speciality</th><th>Visit Mode/Time</th><th>Accompanist Details</th><th>POB Amount</th>";
        ownDocHtml += "<th>Campaign Name</th>";
        ownDocHtml += "<th>Business Status</th>";
        ownDocHtml += "<th>Call Objective</th>";
        ownDocHtml += "<th>Remarks</th>";
        ownDocHtml += "<th>Survey</th></thead>";
        ownDocHtml += "<tbody>";
        if (dcrOwnDoctorJson != null) {
            if (dcrOwnDoctorJson.Rows.length > 0) {
                var id = 1;
                for (var i = 0; i < dcrOwnDoctorJson.Rows.length; i++) {
                    var type = 'own';
                    var doc_code = dcrOwnDoctorJson.Rows[i].Doctor_Code;
                    var docregion = dcrOwnDoctorJson.Rows[i].Region_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Region_Name;
                    var doctorName = dcrOwnDoctorJson.Rows[i].Doctor_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Doctor_Name;
                    var mdlNumber = dcrOwnDoctorJson.Rows[i].MDL_Number == null ? '' : dcrOwnDoctorJson.Rows[i].MDL_Number;
                    var specialityName = dcrOwnDoctorJson.Rows[i].Speciality_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Speciality_Name;
                    var visitMode = dcrOwnDoctorJson.Rows[i].Visit_Mode == null ? '' : dcrOwnDoctorJson.Rows[i].Visit_Mode;
                    if (dcrOwnDoctorJson.Rows[i].Doctor_Visit_Time != null && dcrOwnDoctorJson.Rows[i].Doctor_Visit_Time != '' && dcrOwnDoctorJson.Rows[i].Doctor_Visit_Time != '') {
                        var visitTime = dcrOwnDoctorJson.Rows[i].Doctor_Visit_Time == null ? '' : dcrOwnDoctorJson.Rows[i].Doctor_Visit_Time.toUpperCase() + ' ';
                    }
                    else {
                        var visitTime = '';
                    }
                    if (visitTime != null && visitTime != '' && visitTime != undefined) {
                        var visitTimeMode = visitTime.split(' ');
                        visitTime = visitTimeMode[0];
                    }
                    var po_Amount = dcrOwnDoctorJson.Rows[i].PO_Amount == null ? '' : dcrOwnDoctorJson.Rows[i].PO_Amount;
                    var remarks = dcrOwnDoctorJson.Rows[i].Remarks_By_User == null ? '' : dcrOwnDoctorJson.Rows[i].Remarks_By_User;
                    var timemode = visitTime.length > 0 ? (visitTime + visitMode) : visitMode.length > 0 ? visitMode : "AM";
                    ownDocHtml += "<tr>";
                    ownDocHtml += "<td id='regname_" + i.toString() + "'>" + docregion + "</td>";
                    ownDocHtml += "<td id='docname_" + i.toString() + "'>" + doctorName + "</td>";
                    ownDocHtml += "<td id='docmdl_" + i.toString() + "'>" + mdlNumber + "</td>";
                    ownDocHtml += "<td id='docCategory_" + i.toString() + "'>" + dcrOwnDoctorJson.Rows[i].Category_Name + "</td>";
                    ownDocHtml += "<td id='docspec_" + i.toString() + "'>" + specialityName + "<span id='docCategory_" + i + "' style='display:none'>" + dcrOwnDoctorJson.Rows[i].Category_Name + "</span></td>";
                    ownDocHtml += "<td>" + timemode + "</td>";
                    if (dcrOwnDoctorJson.Rows[i].Acc_Visit_Count > 0) {
                        //ownDocHtml += "<td><div style='display:none;' id='divDocAccDetails_" + id + "'>" + dcrOwnDoctorJson.Rows[i].DCR_Actual_Date + "$" + dcrOwnDoctorJson.Rows[i].DCR_Visit_Code + "$" + dcrOwnDoctorJson.Rows[i].MDL_Number + "$" + dcrOwnDoctorJson.Rows[i].Doctor_Name + "$" + dcrOwnDoctorJson.Rows[i].Category_Name + "</div><a style='color: blue;' href='#' onclick='fnGetDoctorAccompanist(\"" + id + "\");'> YES </a></td>";
                        //id++;
                        ownDocHtml += "<td>YES</td>";
                    }
                    else
                        ownDocHtml += "<td>No</td>";
                    // ownDocHtml += "<td><span class='hyperlink' onclick='fnShowV4DetailedProducts(\"" + i.toString() + "\",\"" + doc_code + "\",\"" + type + "\")'>View</span></td>";
                    ownDocHtml += "<td style='text-align: right;'>" + po_Amount + "</td>";
                    ownDocHtml += "<td>" + (dcrOwnDoctorJson.Rows[i].Campaign_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Campaign_Name) + "</td>";

                    ownDocHtml += "<td>" + (dcrOwnDoctorJson.Rows[i].Status_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Status_Name) + "</td>";
                    ownDocHtml += "<td>" + (dcrOwnDoctorJson.Rows[i].Call_Objective_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Call_Objective_Name) + "</td>";

                    ownDocHtml += "<td>" + remarks + "</td>";
                    ownDocHtml += "<td class='surveylinkyes' id='surveylinkyes_" + i.toString() + "'></td>";
                    //  ownDocHtml += "<td class='surveylinkno' id='surveylinkno_" + i.toString() + "'></td>";
                    ownDocHtml += "</tr>";

                }

            }

        }
        //if (dcrAccDoctorJson != null) {
        //    if (dcrAccDoctorJson.Rows.length > 0) {
        //        for (var i = 0; i < dcrAccDoctorJson.Rows.length; i++) {
        //            var type = "acc"
        //            var doc_code = dcrAccDoctorJson.Rows[i].Doctor_Code;
        //            var doc_region = dcrAccDoctorJson.Rows[i].Region_Name;
        //            var doctorName = dcrAccDoctorJson.Rows[i].Doctor_Name == null ? '' : dcrAccDoctorJson.Rows[i].Doctor_Name;
        //            var mdlNumber = dcrAccDoctorJson.Rows[i].MDL_Number == null ? '' : dcrAccDoctorJson.Rows[i].MDL_Number;
        //            var specialityName = dcrAccDoctorJson.Rows[i].Speciality_Name == null ? '' : dcrAccDoctorJson.Rows[i].Speciality_Name;
        //            var visitMode = dcrAccDoctorJson.Rows[i].Visit_Mode == null ? '' : dcrAccDoctorJson.Rows[i].Visit_Mode;
        //            var visitTime = dcrAccDoctorJson.Rows[i].Doctor_Visit_Time == null ? '' : dcrAccDoctorJson.Rows[i].Doctor_Visit_Time + ' ';
        //            var po_Amount = dcrAccDoctorJson.Rows[i].PO_Amount == null ? '' : dcrAccDoctorJson.Rows[i].PO_Amount;
        //            var remarks = dcrAccDoctorJson.Rows[i].Remarks_By_User == null ? '' : dcrAccDoctorJson.Rows[i].Remarks_By_User;
        //            var timemode = visitTime.length > 0 ? (visitTime + ' ' + visitMode) : visitMode.length > 0 ? visitMode : "AM";
        //            ownDocHtml += "<tr>";
        //            ownDocHtml += "<td id='accregname_" + i.toString() + "'>" + doc_region + "</td>";
        //            ownDocHtml += "<td id='accdocname_" + i.toString() + "'>" + doctorName + "</td>";
        //            ownDocHtml += "<td id='accdocmdl_" + i.toString() + "'>" + mdlNumber + "</td>";
        //            ownDocHtml += "<td id='accdocspec_" + i.toString() + "'>" + specialityName + "<span id='accdocCategory_" + i + "' style='display:none'>" + dcrAccDoctorJson.Rows[i].Category_Name + "</span></td>";
        //            ownDocHtml += "<td id='accdocCategory_" + i.toString() + "'>" + dcrAccDoctorJson.Rows[i].Category_Name + "</td>";
        //            ownDocHtml += "<td>" + timemode + "</td>";
        //            if (dcrAccDoctorJson.Rows[i].Acc_Visit_Count > 0) {
        //                count++;
        //                ownDocHtml += "<td><div style='display:none;' id='divDocAccDetails_" + count + "'>" + dcrAccDoctorJson.Rows[i].DCR_Actual_Date + "$" + dcrAccDoctorJson.Rows[i].DCR_Visit_Code + "$" + dcrAccDoctorJson.Rows[i].MDL_Number + "$" + dcrAccDoctorJson.Rows[i].Doctor_Name + "$" + dcrAccDoctorJson.Rows[i].Category_Name + "</div>YES </td>";
        //            }
        //            else
        //                ownDocHtml += "<td>No</td>";
        //            // accDocHtml += "<td><span class='hyperlink' onclick='fnShowV4DetailedProducts(\"" + i.toString() + "\",\"" + doc_code + "\",\"" + type + "\")'>View</span></td>";
        //            ownDocHtml += "<td style='text-align: right;'>" + po_Amount + "</td>";
        //            ownDocHtml += "<td>" + (dcrAccDoctorJson.Rows[i].Status_Name == null ? '' : dcrAccDoctorJson.Rows[i].Status_Name) + "</td>";
        //            ownDocHtml += "<td>" + (dcrAccDoctorJson.Rows[i].Call_Objective_Name == null ? '' : dcrAccDoctorJson.Rows[i].Call_Objective_Name) + "</td>";
        //            ownDocHtml += "<td>" + remarks + "</td>";
        //            ownDocHtml += "</tr>";
        //        }
        //    }
        //}
        ownDocHtml += "</tbody></table>";
        $('#dvOwnDoctors').html(ownDocHtml);
        for (var i = 0; i < dcrOwnDoctorJson.Rows.length; i++) {
            var Survey = dcrOwnDoctorJson.Rows[i].Survey;
            var CustomerCode = dcrOwnDoctorJson.Rows[i].Doctor_Code;
            fnGetSurveyResponse(i, Survey, CustomerCode);

        }

    }
}

//function fnBindV4AccDoctorsVisit(dcrAccDoctorJson, count) {
//    if (dcrAccDoctorJson != null) {
//        if (dcrAccDoctorJson.Rows.length > 0) {
//            var accDocHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>" + doctor_caption + " visited from others MDL</h3></div>";
//            accDocHtml += "<table class='data display box'  style='width:85%'><thead><th>" + doctor_caption + "</th><th>MDL/SVL#</th><th>Speciality</th><th>Category</th><th>Visit Mode/Time</th><th>Accompanist Details</th><th>POB Amount</th><th>Remarks</th></thead>";
//            accDocHtml += "<tbody>";
//            for (var i = 0; i < dcrAccDoctorJson.Rows.length; i++) {
//                var type = "acc"
//                var doc_code = dcrAccDoctorJson.Rows[i].Doctor_Code;
//                var doctorName = dcrAccDoctorJson.Rows[i].Doctor_Name == null ? '' : dcrAccDoctorJson.Rows[i].Doctor_Name;
//                var mdlNumber = dcrAccDoctorJson.Rows[i].MDL_Number == null ? '' : dcrAccDoctorJson.Rows[i].MDL_Number;
//                var specialityName = dcrAccDoctorJson.Rows[i].Speciality_Name == null ? '' : dcrAccDoctorJson.Rows[i].Speciality_Name;
//                var visitMode = dcrAccDoctorJson.Rows[i].Visit_Mode == null ? '' : dcrAccDoctorJson.Rows[i].Visit_Mode;
//                var visitTime = dcrAccDoctorJson.Rows[i].Doctor_Visit_Time == null ? '' : dcrAccDoctorJson.Rows[i].Doctor_Visit_Time;
//                var po_Amount = dcrAccDoctorJson.Rows[i].PO_Amount == null ? '' : dcrAccDoctorJson.Rows[i].PO_Amount;
//                var remarks = dcrAccDoctorJson.Rows[i].Remarks_By_User == null ? '' : dcrAccDoctorJson.Rows[i].Remarks_By_User;
//                var timemode = visitTime.length > 0 ? (visitTime + ' ' + visitMode) : visitMode.length > 0 ? visitMode : "AM";
//                accDocHtml += "<tr>";
//                accDocHtml += "<td id='accdocname_" + i.toString() + "'>" + doctorName + "</td>";
//                accDocHtml += "<td id='accdocmdl_" + i.toString() + "'>" + mdlNumber + "</td>";
//                accDocHtml += "<td id='accdocspec_" + i.toString() + "'>" + specialityName + "<span id='accdocCategory_" + i + "' style='display:none'>" + dcrAccDoctorJson.Rows[i].Category_Name + "</span></td>";
//                accDocHtml += "<td id='accdocCategory_" + i.toString() + "'>" + dcrAccDoctorJson.Rows[i].Category_Name + "</td>";
//                accDocHtml += "<td>" + timemode + "</td>";
//                if (dcrAccDoctorJson.Rows[i].Acc_Visit_Count > 0) {
//                    count++;
//                    accDocHtml += "<td><div style='display:none;' id='divDocAccDetails_" + count + "'>" + dcrAccDoctorJson.Rows[i].DCR_Actual_Date + "$" + dcrAccDoctorJson.Rows[i].DCR_Visit_Code + "$" + dcrAccDoctorJson.Rows[i].MDL_Number + "$" + dcrAccDoctorJson.Rows[i].Doctor_Name + "$" + dcrAccDoctorJson.Rows[i].Category_Name + "</div><a style='color: blue;' href='#' onclick='fnGetDoctorAccompanist(\"" + count + "\");'> YES </a></td>";
//                }
//                else
//                    accDocHtml += "<td>No</td>";
//                // accDocHtml += "<td><span class='hyperlink' onclick='fnShowV4DetailedProducts(\"" + i.toString() + "\",\"" + doc_code + "\",\"" + type + "\")'>View</span></td>";
//                accDocHtml += "<td style='text-align: right;'>" + po_Amount + "</td>";
//                accDocHtml += "<td>" + remarks + "</td>";
//                accDocHtml += "</tr>";
//            }
//            accDocHtml += "</tbody></table>";
//            $('#dvAccDoctors').html(accDocHtml);

//        }

//    }
//}

function fnBindV4ProductDetails(dcrProductJson) {
    debugger;
    if (dcrProductJson != null) {
        if (dcrProductJson.Rows.length > 0) {
            var productHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>" + doctor_caption + " Sample / Promotional Item Details</h3></div>";
            productHtml += "<table id='tblProducts'  class='data display dataTable box' style='width:85%'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>Sample/Promotional item Name</th><th>Batch Number</th><th>Qty given</th><th>Brand</th></thead>";
            productHtml += "<tbody>";
            var docname = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrProductJson.Rows.length; i++) {
                var regionname = dcrProductJson.Rows[i].Region_Name == null ? '' : dcrProductJson.Rows[i].Region_Name;
                var doctorName = dcrProductJson.Rows[i].Doctor_Name == null ? '' : dcrProductJson.Rows[i].Doctor_Name;
                var productName = dcrProductJson.Rows[i].Product_Name == null ? '' : dcrProductJson.Rows[i].Product_Name;
                var batchNumber = dcrProductJson.Rows[i].Batch_Number == null ? '' : dcrProductJson.Rows[i].Batch_Number;
                var quantityProvided = dcrProductJson.Rows[i].Quantity_Provided == null ? '' : dcrProductJson.Rows[i].Quantity_Provided;
                var currentStcok = dcrProductJson.Rows[i].Current_Stock == null ? '0' : dcrProductJson.Rows[i].Current_Stock;
                var brand = dcrProductJson.Rows[i].Brand_Name == null ? '0' : dcrProductJson.Rows[i].Brand_Name;
                //var specilaityName = dcrProductJson.Rows[i].Speciality_Name == null ? '' : dcrProductJson.Rows[i].Speciality_Name;
                //var detailed = dcrProductJson.Rows[i].Detailed == null ? '' : dcrProductJson.Rows[i].Detailed;
                //var isCpDoc = dcrProductJson.Rows[i].Is_CP_Doc == null ? '' : dcrProductJson.Rows[i].Is_CP_Doc;
                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = docname.indexOf(doctorName.trim());
                    if (matchdoc == -1) {
                        docname.push(doctorName.trim());
                    }
                }
                productHtml += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    productHtml += "<td>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        productHtml += "<td>" + regionname + "</td>";
                    }
                    else {
                        productHtml += "<td></td>";
                    }
                }
                else {
                    productHtml += "<td>" + regionname + "</td>";
                }
                if (i == 0) {
                    docname.push(doctorName.trim());
                    productHtml += "<td>" + doctorName + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        productHtml += "<td>" + doctorName + "</td>";
                    }
                    else {
                        productHtml += "<td></td>";
                    }
                }
                else {
                    productHtml += "<td>" + doctorName + "</td>";
                }
                productHtml += "<td>" + productName + "</td>";
                productHtml += "<td>" + batchNumber + "</td>";
                productHtml += "<td>" + quantityProvided + "</td>";
                // productHtml += "<td>" + currentStcok + "</td>";
                // productHtml += "<td>" + specilaityName + "</td>";
                //productHtml += "<td style='display:none'>" + detailed + "</td>";
                // productHtml += "<td>" + isCpDoc + "</td>";
                productHtml += "<td>" + brand + "</td>";
                productHtml += "</tr>";
            }
            productHtml += "</tbody></table>";
            $('#dvProducts').html(productHtml);
            //$('#tblProducts').dataTable({
            //    "bFilter": false,
            //    "bPaginate": false,
            //    "sPaginationType": "full_numbers",
            //    "bInfo": false,
            //    // "sScrollX": "100%",
            //    "bSort": false
            //});
        }

    }
}
function fnBindV4AttendanceProductDetails(dcrProductJson) {
    debugger;
    if (dcrProductJson != null) {
        if (dcrProductJson.Rows.length > 0) {
            var productHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>" + doctor_caption + " Sample / Promotional Item Details</h3></div>";
            productHtml += "<table id='tblProducts'  class='data display dataTable box' style='width:85%'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>Sample/Promotional item Name</th><th>Batch Number</th><th>Qty given</th><th>Campaign Name</th><th>Survey</th></thead>";
            productHtml += "<tbody>";
            var docname = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrProductJson.Rows.length; i++) {
                var regionname = dcrProductJson.Rows[i].Region_Name == null ? '' : dcrProductJson.Rows[i].Region_Name;
                var doctorName = dcrProductJson.Rows[i].Doctor_Name == null ? '' : dcrProductJson.Rows[i].Doctor_Name;
                var productName = dcrProductJson.Rows[i].Product_Name == null ? '' : dcrProductJson.Rows[i].Product_Name;
                var batchNumber = dcrProductJson.Rows[i].Batch_Number == null ? '' : dcrProductJson.Rows[i].Batch_Number;
                var quantityProvided = dcrProductJson.Rows[i].Quantity_Provided == null ? '' : dcrProductJson.Rows[i].Quantity_Provided;
                var CampaignName = dcrProductJson.Rows[i].Campaign_Name == null ? '' : dcrProductJson.Rows[i].Campaign_Name;
                // var currentStcok = dcrProductJson.Rows[i].Current_Stock == null ? '0' : dcrProductJson.Rows[i].Current_Stock;
                // var brand = dcrProductJson.Rows[i].Brand_Name == null ? '0' : dcrProductJson.Rows[i].Brand_Name;
                //var specilaityName = dcrProductJson.Rows[i].Speciality_Name == null ? '' : dcrProductJson.Rows[i].Speciality_Name;
                //var detailed = dcrProductJson.Rows[i].Detailed == null ? '' : dcrProductJson.Rows[i].Detailed;
                //var isCpDoc = dcrProductJson.Rows[i].Is_CP_Doc == null ? '' : dcrProductJson.Rows[i].Is_CP_Doc;

                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = docname.indexOf(doctorName.trim());
                    if (matchdoc == -1) {
                        docname.push(doctorName.trim());
                    }
                }
                productHtml += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    productHtml += "<td>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        //productHtml += "<td>" + regionname + "</td>";
                        productHtml += "<td></td>";
                    }
                    else {
                        productHtml += "<td></td>";
                    }
                }
                else {
                    productHtml += "<td>" + regionname + "</td>";
                }
                if (i == 0) {
                    docname.push(doctorName.trim());
                    productHtml += "<td>" + doctorName + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        productHtml += "<td>" + doctorName + "</td>";
                    }
                    else {
                        productHtml += "<td></td>";
                    }
                }
                else {
                    productHtml += "<td>" + doctorName + "</td>";
                }
                productHtml += "<td>" + productName + "</td>";
                productHtml += "<td>" + batchNumber + "</td>";
                productHtml += "<td>" + quantityProvided + "</td>";
                productHtml += "<td>" + CampaignName + "</td>";
                productHtml += "<td id='Surveylink" + i + "'></td>";
                // productHtml += "<td>" + currentStcok + "</td>";
                // productHtml += "<td>" + specilaityName + "</td>";
                //productHtml += "<td style='display:none'>" + detailed + "</td>";
                // productHtml += "<td>" + isCpDoc + "</td>";
                //productHtml += "<td>" + brand + "</td>";
                productHtml += "</tr>";
            }
            productHtml += "</tbody></table>";
            $('#dvAttSample').html(productHtml);

        }

    }
}

//Newly added - Display the detailed Products List
function fnBindV4DetailsProductDetails(dcrDetailedproductJson) {
    if (dcrDetailedproductJson != null && dcrDetailedproductJson != '') {
        if (dcrDetailedproductJson.Rows.length > 0) {
            debugger;

            var docname = new Array();
            var regname = new Array();

            var detailProductHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'> " + doctor_caption + " Detailed Products </h3></div>";
            detailProductHtml += "<table id='tblDetailedProducts'  class='data display dataTable box' style='width:85%'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + " Name</th><th>Detailed Product Name</th><th>Brand</th>";
            detailProductHtml += "<th>Business Status</th>";
            detailProductHtml += "<th>Remark</th><th>Business Potential</th></thead>";
            detailProductHtml += "<tbody>";
            for (var i = 0; i < dcrDetailedproductJson.Rows.length; i++) {
                var regionname = dcrDetailedproductJson.Rows[i].Region_Name == null ? '' : dcrDetailedproductJson.Rows[i].Region_Name;
                var doctorName = dcrDetailedproductJson.Rows[i].Doctor_Name == null ? '' : dcrDetailedproductJson.Rows[i].Doctor_Name;
                var productName = dcrDetailedproductJson.Rows[i].Product_Name == null ? '' : dcrDetailedproductJson.Rows[i].Product_Name;
                var productTypeName = dcrDetailedproductJson.Rows[i].Product_Type_Name == null ? '' : dcrDetailedproductJson.Rows[i].Product_Type_Name;
                var barndName = dcrDetailedproductJson.Rows[i].Brand_Name == null ? '' : dcrDetailedproductJson.Rows[i].Brand_Name;

                //var isCpDoc = dcrDetailedproductJson.Rows[i].Is_CP_Doc == null ? '' : dcrDetailedproductJson.Rows[i].Is_CP_Doc;
                var match = 0;

                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = docname.indexOf(doctorName.trim());
                    if (matchdoc == -1) {
                        docname.push(doctorName.trim());
                    }
                }
                detailProductHtml += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    detailProductHtml += "<td>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        detailProductHtml += "<td>" + regionname + "</td>";
                    }
                    else {
                        detailProductHtml += "<td></td>";
                    }
                }
                else {
                    detailProductHtml += "<td>" + regionname + "</td>";
                }
                if (i == 0) {
                    docname.push(doctorName.trim());
                    detailProductHtml += "<td>" + doctorName + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        detailProductHtml += "<td>" + doctorName + "</td>";
                    }
                    else {
                        detailProductHtml += "<td></td>";
                    }
                }
                else {
                    detailProductHtml += "<td>" + doctorName + "</td>";
                }

                detailProductHtml += "<td>" + productName + "</td>";
                //detailProductHtml += "<td>" + productTypeName + "</td>";
                detailProductHtml += "<td>" + barndName + "</td>";
                detailProductHtml += "<td>" + (dcrDetailedproductJson.Rows[i].Status_Name == null ? '' : dcrDetailedproductJson.Rows[i].Status_Name) + "</td>";
                detailProductHtml += "<td>" + (dcrDetailedproductJson.Rows[i].Business_Status_Remarks == null ? '' : dcrDetailedproductJson.Rows[i].Business_Status_Remarks) + "</td>";
                detailProductHtml += "<td>" + (dcrDetailedproductJson.Rows[i].BusinessPotential == null ? '' : dcrDetailedproductJson.Rows[i].BusinessPotential) + "</td>";

                //detailProductHtml += "<td>" + isCpDoc + "</td>";
                detailProductHtml += "</tr>";
            }
            detailProductHtml += "</tbody></table>";
            $('#dvDetailedProductsDetails').html(detailProductHtml);
        }
    }
}
//--------------Competitor Details-------------------//

function fnBindV4CompetitorProductDetails(dcrDetailedproductJson) {
    if (dcrDetailedproductJson != null && dcrDetailedproductJson != '') {
        if (dcrDetailedproductJson.Rows.length > 0) {
            debugger;

            var docname = new Array();
            var regname = new Array();
            var prodname = new Array();
            var brand = new Array();
            var detailProductHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>  Competitor Products </h3></div>";
            detailProductHtml += "<table id='tblDetailedProducts'  class='data display dataTable box' style='width:85%'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + " Name</th><th>Detailed Product Name</th><th>Brand</th>";
            detailProductHtml += "<th>Competitor Name</th><th>Competitor Product Name</th>";
            detailProductHtml += "</thead>";
            detailProductHtml += "<tbody>";
            for (var i = 0; i < dcrDetailedproductJson.Rows.length; i++) {
                var regionname = dcrDetailedproductJson.Rows[i].Region_Name == null ? '' : dcrDetailedproductJson.Rows[i].Region_Name;
                var doctorName = dcrDetailedproductJson.Rows[i].Doctor_Name == null ? '' : dcrDetailedproductJson.Rows[i].Doctor_Name;
                var productName = dcrDetailedproductJson.Rows[i].Product_Name == null ? '' : dcrDetailedproductJson.Rows[i].Product_Name;
                var productTypeName = dcrDetailedproductJson.Rows[i].Product_Type_Name == null ? '' : dcrDetailedproductJson.Rows[i].Product_Type_Name;
                var brandName = dcrDetailedproductJson.Rows[i].Brand_Name == null ? '' : dcrDetailedproductJson.Rows[i].Brand_Name;
                var CompetitorName = dcrDetailedproductJson.Rows[i].Competitor_Name == null ? '' : dcrDetailedproductJson.Rows[i].Competitor_Name;

                var match = 0;
                var matchprod = 0;
                var matchche = 0;
                var matchbrand = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = docname.indexOf(doctorName.trim());
                    if (matchdoc == -1) {
                        docname.push(doctorName.trim());
                    }
                    if (matchdoc == -1) {
                        prodname = [];
                    }
                    matchprod = prodname.indexOf(productName.trim());
                    if (matchprod == -1) {
                        prodname.push(productName.trim());
                    }
                }
                detailProductHtml += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    detailProductHtml += "<td>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        detailProductHtml += "<td>" + regionname + "</td>";
                    }
                    else {
                        detailProductHtml += "<td></td>";
                    }
                }
                else {
                    detailProductHtml += "<td>" + regionname + "</td>";
                }
                if (i == 0) {
                    docname.push(doctorName.trim());
                    detailProductHtml += "<td>" + doctorName + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        detailProductHtml += "<td>" + doctorName + "</td>";
                    }
                    else {
                        detailProductHtml += "<td></td>";
                    }
                }
                else {
                    detailProductHtml += "<td>" + doctorName + "</td>";
                }
                if (i == 0) {
                    prodname.push(productName.trim());
                    detailProductHtml += "<td>" + productName + "</td>";
                }
                else if (matchprod != -1) {
                    if (match == -1 || matchdoc == -1) {
                        detailProductHtml += "<td>" + productName + "</td>";
                    }
                    else {
                        detailProductHtml += "<td></td>";
                    }
                }
                else {
                    detailProductHtml += "<td>" + productName + "</td>";
                }
                if (i == 0) {
                    brand.push(brandName.trim());
                    detailProductHtml += "<td>" + brandName + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1 || matchprod == -1) {

                        detailProductHtml += "<td>" + brandName + "</td>";

                    }
                    else {
                        detailProductHtml += "<td></td>";
                    }
                }
                else {
                    detailProductHtml += "<td>" + brandName + "</td>";
                }

                //detailProductHtml += "<td>" + productName + "</td>";
                //detailProductHtml += "<td>" + brandName + "</td>";
                detailProductHtml += "<td>" + (dcrDetailedproductJson.Rows[i].Competitor_Name == null ? '' : dcrDetailedproductJson.Rows[i].Competitor_Name) + "</td>";
                detailProductHtml += "<td>" + (dcrDetailedproductJson.Rows[i].Comp_Product == null ? '' : dcrDetailedproductJson.Rows[i].Comp_Product) + "</td>";
                detailProductHtml += "</tr>";
            }
            detailProductHtml += "</tbody></table>";
            $('#dvCompetitorProductsDetails').html(detailProductHtml);
        }
    }
}

///////////////////////////////////Detailed Digital Assets////////////////////////////////////////////////////

function fnBindV4DetailedDigitalAssets(dcrDigitalAssetsJson) {
    if (dcrDigitalAssetsJson != null) {
        if (dcrDigitalAssetsJson.Rows.length > 0) {
            var digitalAsset = "<div class= 'gridHeader'> <h3 style='width: 85%;margin:0px auto'>" + doctor_caption + " Detailed Digital Assets</h3></div>";
            digitalAsset += "<table id='tblDigitalAssets' style='width:85%' class='data display box'><thead><th>" + doctor_caption + "</th><th>MDL/SVL#</th><th>Speciality</th><th>DA Name</th><th>DA Type</th><th>Total Viewed Durations </th></thead>";
            digitalAsset += "<tbody>";
            for (var i = 0; i < dcrDigitalAssetsJson.Rows.length; i++) {
                var doctorName = dcrDigitalAssetsJson.Rows[i].Doctor_Name == null ? '' : dcrDigitalAssetsJson.Rows[i].Doctor_Name;
                var mdlNo = dcrDigitalAssetsJson.Rows[i].MDL_Number == null ? '' : dcrDigitalAssetsJson.Rows[i].MDL_Number;
                var speciality = dcrDigitalAssetsJson.Rows[i].Speciality_Name == null ? '' : dcrDigitalAssetsJson.Rows[i].Speciality_Name;
                var daName = dcrDigitalAssetsJson.Rows[i].DA_Name == null ? '' : dcrDigitalAssetsJson.Rows[i].DA_Name;
                var daType = dcrDigitalAssetsJson.Rows[i].DA_Type == null ? '' : dcrDigitalAssetsJson.Rows[i].DA_Type;
                var viewedDurations = dcrDigitalAssetsJson.Rows[i].Total_Duration == null ? '' : dcrDigitalAssetsJson.Rows[i].Total_Duration;


                digitalAsset += "<tr>";
                digitalAsset += "<td>" + doctorName + "</td>";
                digitalAsset += "<td>" + mdlNo + "</td>";
                digitalAsset += "<td>" + speciality + "</td>";
                digitalAsset += "<td>" + daName + "</td>";
                digitalAsset += "<td>" + daType + "</td>";
                digitalAsset += "<td>" + viewedDurations + "</td>";
                digitalAsset += "</tr>";
            }

            digitalAsset += "</tbody></table>";
            $('#dvDigitalAssets').html(digitalAsset);
        }

    }
}


function fnBindV4ChemistDetails(dcrChemistJson) {
    if (dcrChemistJson != null) {
        if (dcrChemistJson.Rows.length > 0) {
            var chemistHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>" + doctor_caption + " " + chemist_caption + " Details</h3></div>";
            chemistHtml += "<table id='tblChemist' style='width:85%' class='data display box'><thead><th>" + chemist_caption + " Name</th><th>POB Amount</th></thead>";
            chemistHtml += "<tbody>";
            for (var i = 0; i < dcrChemistJson.Rows.length; i++) {
                var chemistName = dcrChemistJson.Rows[i].Chemists_Name == null ? '' : dcrChemistJson.Rows[i].Chemists_Name;
                var poAmount = dcrChemistJson.Rows[i].PO_Amount == null ? '' : dcrChemistJson.Rows[i].PO_Amount;
                chemistHtml += "<tr>";
                chemistHtml += "<td>" + chemistName + "</td>";
                chemistHtml += "<td style='text-align: right;'>" + poAmount + "</td>";
                chemistHtml += "</tr>";
            }
            chemistHtml += "</tbody></table>";
            $('#dvChemists').html(chemistHtml);

        }
    }
}

// POB Order 

function fnBindPOBOrder(dcrPobOrderJson) {
    debugger;
    if (dcrPobOrderJson != null && dcrPobOrderJson != undefined && dcrPobOrderJson.Rows.length > 0) {
        var statusTemp = false;
        var strPob = "<div class= 'gridHeader'><h3 style='width:85%;margin:0px auto'>" + doctor_caption + "  Purchase Order Booking </h3></div>";
        strPob += "<table id='tblPobOrders' style='width:85%' class='data display box'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + " Name</th><th>Stockist Name</th><th>Order Number</th><th>Order Due Date</th><th>No. Of Products</th><th>Total POB Value</th></thead>";
        strPob += "<tbody>";
        var docname = new Array();
        var regname = new Array();
        for (var i = 0; i < dcrPobOrderJson.Rows.length; i++) {
            var regionname = dcrPobOrderJson.Rows[i].Region_Name;
            var doctorName = dcrPobOrderJson.Rows[i].Customer_Name;
            var match = 0;
            var matchche = 0;
            if (i != 0) {
                match = regname.indexOf(regionname.trim());
                if (match == -1) {
                    regname.push(regionname.trim());
                }
                matchdoc = docname.indexOf(doctorName.trim());
                if (matchdoc == -1) {
                    docname.push(doctorName.trim());
                }
            }
            strPob += "<tr>";
            if (i == 0) {
                regname.push(regionname.trim());
                strPob += "<td style='width:20%;'>" + regionname + "</td>";
            }
            else if (match != -1) {
                if (matchdoc == -1) {
                    strPob += "<td style='width:20%;'>" + regionname + "</td>";
                }
                else {
                    strPob += "<td></td>";
                }
            }
            else {
                strPob += "<td style='width:20%;'>" + regionname + "</td>";
            }
            if (i == 0) {
                docname.push(doctorName.trim());
                strPob += "<td style='width:20%;'>" + doctorName + "</td>";
            }
            else if (matchdoc != -1) {
                if (match == -1) {
                    strPob += "<td style='width:20%;'>" + doctorName + "</td>";
                }
                else {
                    strPob += "<td></td>";
                }
            }
            else {
                strPob += "<td style='width:20%;'>" + doctorName + "</td>";
            }
            strPob += "<td style='width:20%;'>" + dcrPobOrderJson.Rows[i].Stockist_Name + "</td>";
            strPob += "<td style='width:10%;text-decoration:underline;cursor:pointer;'><a href='javascript:fnGetPOBProductDetails(" + dcrPobOrderJson.Rows[i].Order_Id + ");' class='btnEditOrder'>" + dcrPobOrderJson.Rows[i].Order_Number + "</a></td>";
            strPob += "<td style='width:10%;'>" + dcrPobOrderJson.Rows[i].Order_Due_Date + "</td>";
            strPob += "<td style='width:10%;text-align: right;'>" + dcrPobOrderJson.Rows[i].No_Of_Products + "</td>";
            strPob += "<td style='width:10%;text-align: right;'>" + dcrPobOrderJson.Rows[i].Total_POB_Value + "</td>";
            strPob += "</tr>";
            if (parseInt(dcrPobOrderJson.Rows[i].Order_Status) == 3) {
                statusTemp = true;
            }

        }
        if (statusTemp) {
            strPob += "<tr><td colspan='5' style='font-size:11px;'>T : Temporary/Drafted Order Number.</td></tr>";
        }
        strPob += "</tbody></table>";
        $('#dvPOB').html(strPob);
    }
}


function fnGetPOBProductDetails(Order_Id) {
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
    if (jsonPOB.lstHeader.length > 0) {
        debugger;
        var strPOB = "<table style='width:100%' class='data display box'><tbody><tr>";
        strPOB += "<tr><td colspan='2'>" + doctor_caption + " Name : </td><td colspan='2'>" + jsonPOB.lstHeader[0].Customer_Name + "</td></tr>";
        var orderDueDate = new Date(eval(jsonPOB.lstHeader[0].Order_Due_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
        strPOB += "<tr><td>Stockist Name : </td><td>" + jsonPOB.lstHeader[0].Stockist_Name + "</td><td>Due Date : </td><td>" + orderDueDate.getDate() + "/" + (orderDueDate.getMonth() + 1) + "/" + orderDueDate.getFullYear() + "</td></tr>";
        strPOB += "<tr><td colspan='4'>";

        strPOB += "<table style='width:95%' class='data display box'>";
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


// Call Activity
function fnBindV4CallActivity(dcrCallCativityJson) {
    debugger;
    if (dcrCallCativityJson != null) {
        if (dcrCallCativityJson.Rows.length > 0) {
            var CallActivity = "<div class= 'gridHeader'><h3 style='width:85%;margin:0px auto'>" + doctor_caption + "  Call Activity</h3></div>";
            CallActivity += "<table id='tblCallActivity' style='width:85%' class='data display box'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>Activity</th><th>Remark</th></thead>";
            CallActivity += "<tbody>";
            var docname = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrCallCativityJson.Rows.length; i++) {
                var regionname = dcrCallCativityJson.Rows[i].Region_Name == null ? '' : dcrCallCativityJson.Rows[i].Region_Name;
                var doctorName = dcrCallCativityJson.Rows[i].Doctor_Name == null ? '' : dcrCallCativityJson.Rows[i].Doctor_Name;
                // var mdlNo = dcrCallCativityJson.Rows[i].MDL_Number == null ? '' : dcrCallCativityJson.Rows[i].MDL_Number;
                var Activity_Name = dcrCallCativityJson.Rows[i].Activity_Name == null ? '' : dcrCallCativityJson.Rows[i].Activity_Name;
                var Activity_Remarks = dcrCallCativityJson.Rows[i].Activity_Remarks == null ? '' : dcrCallCativityJson.Rows[i].Activity_Remarks;
                // var updatedDate = dcrCallCativityJson.Rows[i].Updated_Date_Time == null ? '' : dcrCallCativityJson.Rows[i].Updated_Date_Time;
                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = docname.indexOf(doctorName.trim());
                    if (matchdoc == -1) {
                        docname.push(doctorName.trim());
                    }
                }
                CallActivity += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    CallActivity += "<td style='width:20%;'>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        CallActivity += "<td style='width:20%;'>" + regionname + "</td>";
                    }
                    else {
                        CallActivity += "<td></td>";
                    }
                }
                else {
                    CallActivity += "<td style='width:20%;'>" + regionname + "</td>";
                }
                if (i == 0) {
                    docname.push(doctorName.trim());
                    CallActivity += "<td style='width:20%;'>" + doctorName + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        CallActivity += "<td style='width:20%;'>" + doctorName + "</td>";
                    }
                    else {
                        CallActivity += "<td></td>";
                    }
                }
                else {
                    CallActivity += "<td style='width:20%;'>" + doctorName + "</td>";
                }

                //CallActivity += "<td style='width:10%;'>" + mdlNo + "</td>";
                CallActivity += "<td style='width:20%;'>" + Activity_Name + "</td>";
                CallActivity += "<td style='width:15%;'>" + Activity_Remarks + "</td>";
                CallActivity += "</tr>";
            }
            CallActivity += "</tbody></table>";
            $('#divCallActivity').html(CallActivity);
        }
    }
}
// Call Activity
function fnBindV4MCActivity(dcrMCCativityJson) {
    debugger;
    if (dcrMCCativityJson != null) {
        if (dcrMCCativityJson.Rows.length > 0) {
            var mcActivity = "<div class= 'gridHeader'><h3 style='width:85%;margin:0px auto'>" + doctor_caption + "  Marketing Campaign Activity</h3></div>";
            mcActivity += "<table id='tblFollowUps' style='width:85%' class='data display box'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>Marketing Campaign</th><th>Activity</th><th>Remark</th></thead>";
            mcActivity += "<tbody>";
            var docname = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrMCCativityJson.Rows.length; i++) {
                var regionname = dcrMCCativityJson.Rows[i].Region_Name == null ? '' : dcrMCCativityJson.Rows[i].Region_Name;
                var doctorName = dcrMCCativityJson.Rows[i].Doctor_Name == null ? '' : dcrMCCativityJson.Rows[i].Doctor_Name;
                // var mdlNo = dcrMCCativityJson.Rows[i].MDL_Number == null ? '' : dcrMCCativityJson.Rows[i].MDL_Number;
                var tasks = dcrMCCativityJson.Rows[i].Campaign_Name == null ? '' : dcrMCCativityJson.Rows[i].Campaign_Name;
                var dueDate = dcrMCCativityJson.Rows[i].Activity_Name == null ? '' : dcrMCCativityJson.Rows[i].Activity_Name;
                var Remark = dcrMCCativityJson.Rows[i].MC_Remark == null ? '' : dcrMCCativityJson.Rows[i].MC_Remark;
                // var updatedDate = dcrMCCativityJson.Rows[i].Updated_Date_Time == null ? '' : dcrMCCativityJson.Rows[i].Updated_Date_Time;
                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = docname.indexOf(doctorName.trim());
                    if (matchdoc == -1) {
                        docname.push(doctorName.trim());
                    }
                }
                mcActivity += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    mcActivity += "<td style='width:20%;'>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        mcActivity += "<td style='width:20%;'>" + regionname + "</td>";
                    }
                    else {
                        mcActivity += "<td></td>";
                    }
                }
                else {
                    mcActivity += "<td style='width:20%;'>" + regionname + "</td>";
                }
                if (i == 0) {
                    docname.push(doctorName.trim());
                    mcActivity += "<td style='width:20%;'>" + doctorName + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        mcActivity += "<td style='width:20%;'>" + doctorName + "</td>";
                    }
                    else {
                        mcActivity += "<td></td>";
                    }
                }
                else {
                    mcActivity += "<td style='width:20%;'>" + doctorName + "</td>";
                }

                //mcActivity += "<td style='width:10%;'>" + mdlNo + "</td>";
                mcActivity += "<td style='width:20%;'>" + tasks + "</td>";
                mcActivity += "<td style='width:15%;'>" + dueDate + "</td>";
                mcActivity += "<td style='width:15%;'>" + Remark + "</td>";
                mcActivity += "</tr>";
            }
            mcActivity += "</tbody></table>";
            $('#divMCActivity').html(mcActivity);
        }
    }
}

// Follow Ups
function fnBindV4FollowUps(dcrFollowUpsJson) {
    debugger;
    if (dcrFollowUpsJson != null) {
        if (dcrFollowUpsJson.Rows.length > 0) {
            var followUps = "<div class= 'gridHeader'><h3 style='width:85%;margin:0px auto'>" + doctor_caption + "  Follow Ups</h3></div>";
            followUps += "<table id='tblFollowUps' style='width:85%' class='data display box'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>Tasks</th><th>Due Date</th></thead>";
            followUps += "<tbody>";
            var docname = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrFollowUpsJson.Rows.length; i++) {
                var regionname = dcrFollowUpsJson.Rows[i].Region_Name == null ? '' : dcrFollowUpsJson.Rows[i].Region_Name;
                var doctorName = dcrFollowUpsJson.Rows[i].Doctor_Name == null ? '' : dcrFollowUpsJson.Rows[i].Doctor_Name;
                // var mdlNo = dcrFollowUpsJson.Rows[i].MDL_Number == null ? '' : dcrFollowUpsJson.Rows[i].MDL_Number;
                var tasks = dcrFollowUpsJson.Rows[i].Tasks == null ? '' : dcrFollowUpsJson.Rows[i].Tasks;
                var dueDate = dcrFollowUpsJson.Rows[i].Due_Date == null ? '' : dcrFollowUpsJson.Rows[i].Due_Date;
                // var updatedDate = dcrFollowUpsJson.Rows[i].Updated_Date_Time == null ? '' : dcrFollowUpsJson.Rows[i].Updated_Date_Time;
                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = docname.indexOf(doctorName.trim());
                    if (matchdoc == -1) {
                        docname.push(doctorName.trim());
                    }
                }
                followUps += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    followUps += "<td style='width:20%;'>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        followUps += "<td style='width:20%;'>" + regionname + "</td>";
                    }
                    else {
                        followUps += "<td></td>";
                    }
                }
                else {
                    followUps += "<td style='width:20%;'>" + regionname + "</td>";
                }
                if (i == 0) {
                    docname.push(doctorName.trim());
                    followUps += "<td style='width:20%;'>" + doctorName + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        followUps += "<td style='width:20%;'>" + doctorName + "</td>";
                    }
                    else {
                        followUps += "<td></td>";
                    }
                }
                else {
                    followUps += "<td style='width:20%;'>" + doctorName + "</td>";
                }

                //followUps += "<td style='width:10%;'>" + mdlNo + "</td>";
                followUps += "<td style='width:20%;'>" + tasks + "</td>";
                followUps += "<td style='width:15%;'>" + dueDate + "</td>";
                followUps += "</tr>";
            }
            followUps += "</tbody></table>";
            $('#dvFollowUps').html(followUps);
        }
    }
}
// Attachments
function fnBindV4Attachments(dcrAttachmentsJson) {
    debugger;
    if (dcrAttachmentsJson != null) {
        if (dcrAttachmentsJson.Rows.length > 0) {
            var attachments = "<div class= 'gridHeader'><h3 style='width:85%;margin:0px auto'>" + doctor_caption + " Attachments</h3></div>";
            attachments += "<table id='tblAttachments' style='width:85%' class='data display box'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>Attachement File name (click on the file to download locally)</th><th>Updated DateTime</th><th>Status</th></thead>";
            attachments += "<tbody>";
            var docname = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrAttachmentsJson.Rows.length; i++) {
                var regionname = dcrAttachmentsJson.Rows[i].Region_Name == null ? '' : dcrAttachmentsJson.Rows[i].Region_Name;
                var doctorName = dcrAttachmentsJson.Rows[i].Doctor_Name == null ? '' : dcrAttachmentsJson.Rows[i].Doctor_Name;
                var mdlNo = dcrAttachmentsJson.Rows[i].MDL_Number == null ? '' : dcrAttachmentsJson.Rows[i].MDL_Number;
                var bloburl = dcrAttachmentsJson.Rows[i].Blob_Url == null ? '' : dcrAttachmentsJson.Rows[i].Blob_Url;
                var uploadFileName = dcrAttachmentsJson.Rows[i].Uploaded_File_Name == null ? '' : dcrAttachmentsJson.Rows[i].Uploaded_File_Name;
                var updatedDateTime = dcrAttachmentsJson.Rows[i].Updated_Date_Time == null ? '' : dcrAttachmentsJson.Rows[i].Updated_Date_Time;
                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = docname.indexOf(doctorName.trim());
                    if (matchdoc == -1) {
                        docname.push(doctorName.trim());
                    }
                }
                attachments += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    attachments += "<td style='width:20%;'>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        attachments += "<td style='width:20%;'>" + regionname + "</td>";
                    }
                    else {
                        attachments += "<td></td>";
                    }
                }
                else {
                    attachments += "<td style='width:20%;'>" + regionname + "</td>";
                }
                if (i == 0) {
                    docname.push(doctorName.trim());
                    attachments += "<td style='width:20%;'>" + doctorName + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        attachments += "<td style='width:20%;'>" + doctorName + "</td>";
                    }
                    else {
                        attachments += "<td></td>";
                    }
                }
                else {
                    attachments += "<td style='width:20%;'>" + doctorName + "</td>";
                }

                //  attachments += "<td style='width:10%;'>" + mdlNo + "</td>";
                if (bloburl == "") {
                    attachments += ("<td style='width:30%;'>" + uploadFileName + "</td>");
                }
                else {
                    attachments += ("<td style='width:30%;'><a href='" + bloburl + "'>" + uploadFileName + "</td>");
                }
                //attachments += "<td><a href='" + bloburl + "'>" + uploadFileName + "</td>";
                attachments += "<td style='width:15%;'>" + updatedDateTime + "</td>";
                if (bloburl == null || bloburl == "") {
                    attachments += "<td style='width:10%;'>" + "Yet to upload" + "</td>";
                }
                else {
                    attachments += "<td style='width:10%;'>" + "Attached" + "</td>";
                }
                attachments += "</tr>";
            }
            attachments += "</tbody></table>";
            $('#dvAttachments').html(attachments);
        }
    }
}

function fnBindV4RCPADetails(dcrRCPAJson) {
    var dtDoctorlist = new Array();
    rcpa_g = dcrRCPAJson;
    debugger;
    if (dcrRCPAJson != null) {
        if (dcrRCPAJson.Rows.length > 0) {
            var rcpaHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>" + doctor_caption + " RCPA Details</h3></div>";
            rcpaHtml += "<table id='tblRCPA'  class='data display dataTable box' style='width:85%'><thead><th>" + doctor_caption + " Name</th><th>" + chemist_caption + " Name</th><th>My Product Name</th><th>My Product Quantity</th><th>Competitor Product Name</th><th>Competitor Product Qty</th></thead>";
            if (dcrRCPAJson.Rows.length > 0) {
                rcpaHtml += "<tbody>";
                for (k = 0; k < dcrRCPAJson.Rows.length; k++) {
                    var doctor = {};
                    if ($.inArray(dcrRCPAJson.Rows[k].Doctor_Name, dtDoctorlist) == -1) {

                        dtDoctorlist.push(dcrRCPAJson.Rows[k].Doctor_Name);
                    }
                }

                if (dtDoctorlist != null && dtDoctorlist != "" && dtDoctorlist.length > 0) {
                    for (var p = 0; p < dtDoctorlist.length; p++) {
                        if (dtDoctorlist[p] != null && dtDoctorlist[p] != "") {
                            var distDoctorlist = jsonPath(dcrRCPAJson.Rows, "$.[?(@.Doctor_Name=='" + dtDoctorlist[p] + "')]");//Get doctor names from the list


                            if (distDoctorlist != false && distDoctorlist != undefined) {
                                var doctorName = distDoctorlist[0].Doctor_Name;
                                rcpaHtml += "<tr>";
                                if (doctorName != "") {
                                    rcpaHtml += "<td>" + doctorName + "</td>";
                                }
                                else {
                                    rcpaHtml += "<td></td>";
                                }

                                //To get the chemist names  from the doctor list
                                var dtChemistlist = [];
                                for (var i = 0; i < distDoctorlist.length; i++) {
                                    if ($.inArray(distDoctorlist[i].Chemists_Name, dtChemistlist) == -1) {
                                        dtChemistlist.push(distDoctorlist[i].Chemists_Name);
                                    }
                                }

                                var chemistcount = 0;
                                if (dtChemistlist != false && dtChemistlist != undefined) {
                                    for (var j = 0; j < dtChemistlist.length; j++) {
                                        var distChemistName = jsonPath(distDoctorlist, "$.[?(@.Chemists_Name=='" + dtChemistlist[j] + "')]");//To get the corresponding chemist name for all the doctors
                                        if (distChemistName != false) {
                                            var chemist = distChemistName[0].Chemists_Name;
                                            if (chemistcount > 0) {
                                                rcpaHtml += "<tr>";//New Row for two or more chemists
                                                rcpaHtml += "<td></td>";
                                                rcpaHtml += "<td>" + chemist + "</td>";
                                            }
                                            else {
                                                rcpaHtml += "<td>" + chemist + "</td>";
                                            }

                                            //To get the products from the chemist list
                                            var dcrProduct = {};
                                            var distproductcode = [];
                                            for (var i = 0; i < distChemistName.length; i++) {
                                                if ($.inArray(distChemistName[i].DCR_Product_Code, distproductcode) == -1) {
                                                    dcrProduct.Dcr_Product_Code = distChemistName[i].DCR_Product_Code;
                                                    distproductcode.push(distChemistName[i].DCR_Product_Code);
                                                }
                                            }

                                            if (distproductcode != false && distproductcode != undefined) {
                                                var ownproductCount = 0;
                                                for (a = 0; a < distproductcode.length ; a++) {
                                                    var compRowcount = 0;
                                                    var drOwnandcompetitorproducts = "";
                                                    drOwnandcompetitorproducts = jsonPath(distChemistName, "$.[?(@.DCR_Product_Code == '" + distproductcode[a] + "')]");//To get the corresponding products for the chemists
                                                    if (drOwnandcompetitorproducts != false) {
                                                        var drOwnProduct = jsonPath(drOwnandcompetitorproducts, "$.[?(@.Product_Code != '')]");
                                                        var drCompProduct = jsonPath(drOwnandcompetitorproducts, "$.[?(@.Product_Code == '')]");
                                                        var productName = drOwnandcompetitorproducts[0].Product_Name;
                                                        var ownProductQty = drOwnandcompetitorproducts[0].Support_Qty;

                                                        if (parseInt(ownproductCount) > 0) {
                                                            rcpaHtml += "<tr>";//New row for two or more products
                                                            rcpaHtml += "<td></td>";//Doctor Name
                                                            rcpaHtml += "<td></td>"; // Chemist Name
                                                            rcpaHtml += "<td>" + productName + "</td>";//Own Product Name
                                                            rcpaHtml += "<td>" + ownProductQty + "</td>";//My Product Quantity
                                                        }
                                                        else {
                                                            rcpaHtml += "<td>" + productName + "</td>";//Own Product Name
                                                            rcpaHtml += "<td>" + ownProductQty + "</td>";//My Product Quantity
                                                        }


                                                        for (var b = 0 ; b < drOwnandcompetitorproducts.length; b++) {
                                                            if (drOwnandcompetitorproducts[b].Product_Code == null || drOwnandcompetitorproducts[b].Product_Code == "") {
                                                                var competitorProductName = drOwnandcompetitorproducts[b].Competitor_Product_Name;
                                                                var competitorqty = drOwnandcompetitorproducts[b].Support_Qty;
                                                                if (parseInt(compRowcount) > 0) {
                                                                    rcpaHtml += "<tr>";//New Row for two or more competitor products
                                                                    rcpaHtml += "<td></td>";//Doctor Name
                                                                    rcpaHtml += "<td></td>"; //Chemist Name
                                                                    rcpaHtml += "<td></td>";//My Product Name
                                                                    rcpaHtml += "<td></td>"; //My own Product Quantity
                                                                    rcpaHtml += "<td>" + competitorProductName + "</td>";//Competitor Product Name
                                                                    rcpaHtml += "<td>" + competitorqty + "</td>";//Comp Qty
                                                                }
                                                                else {
                                                                    rcpaHtml += "<td>" + competitorProductName + "</td>";//Competitor Product Name
                                                                    rcpaHtml += "<td>" + competitorqty + "</td>";//Comp Qty
                                                                    rcpaHtml += "</tr>";
                                                                }
                                                                compRowcount++;
                                                            }

                                                        }
                                                        if (!drCompProduct) {
                                                            rcpaHtml += "<td>&nbsp</td>" //Competitor Product Name
                                                            rcpaHtml += "<td>&nbsp</td>" //Competitor Product Qty
                                                            rcpaHtml += "</tr>";
                                                        }
                                                    }

                                                    ownproductCount++;
                                                }

                                            }

                                        }
                                        chemistcount++;

                                    }
                                }
                            }
                        }
                    }
                }
            }
            //if (dtDoctorlist != null && dtDoctorlist != "" && dtDoctorlist.length > 0) {
            //    for (var p = 0; p < dtDoctorlist.length ; p++) {
            //        if (dtDoctorlist[p] != null && dtDoctorlist[p] != "") {

            //            var drdoctorlist = jsonPath(dcrRCPAJson.Rows, "$.[?(@.Doctor_Name=='" + dtDoctorlist[p] + "')]");

            //            for (j = 0; j < drdoctorlist.length; j++) {
            //                var dcrProduct = {};

            //                if ($.inArray(drdoctorlist[j].Chemists_Name, distChemistName) == -1) {
            //                    
            //                    //dcrProduct.Chemists_Name = drdoctorlist[j].Chemists_Name;
            //                    distChemistName.push(drdoctorlist[j].Chemists_Name);
            //                }
            //            }

            //                if (drdoctorlist != false && !(drdoctorlist == undefined)) {
            //                    
            //                    var doctorName = drdoctorlist[0].Doctor_Name;

            //                    rcpaHtml += "<tr>";
            //                    if (doctorName != "") {//Doctor Name
            //                        rcpaHtml += "<td>" + doctorName + "</td>";
            //                    }
            //                    else {
            //                        rcpaHtml += "<td></td>";
            //                    }

            //                    for (j = 0; j < drdoctorlist.length; j++) {
            //                        var dcrProduct = {};

            //                        if ($.inArray(drdoctorlist[j].DCR_Product_Code, distproductcode) == -1) {
            //                            dcrProduct.Dcr_Product_Code = drdoctorlist[j].DCR_Product_Code;
            //                            distproductcode.push(drdoctorlist[j].DCR_Product_Code);
            //                        }
            //                    }

            //                    var chemistcount = 0;


            //                    for (var index = 0; index < distChemistName.length; index++) {
            //                        var drChemist = jsonPath(drdoctorlist, "$.[?(@.Chemists_Name=='" + distChemistName[index] + "')]");

            //                        if (index > 0) {
            //                            rcpaHtml += "<tr>";
            //                        }

            //                        if (chemistcount > 0) {

            //                            rcpaHtml += "<td></td>";
            //                            rcpaHtml += "<td>" + distChemistName[index] + "</td>";
            //                        }
            //                        else {
            //                            rcpaHtml += "<td>" + distChemistName[index] + "</td>";
            //                        }
            //                        ownproductCount = 0;
            //                        if (distproductcode != null && distproductcode != "" && distproductcode.length > 0) {
            //                            for (a = 0; a < distproductcode.length ; a++) {
            //                                var compRowcount = 0;
            //                                drOwnandcompetitorproducts = jsonPath(drChemist, "$.[?(@.DCR_Product_Code == '" + distproductcode[a] + "')]");
            //                                if (drOwnandcompetitorproducts != false) {
            //                                    
            //                                    var drOwnProduct = jsonPath(drOwnandcompetitorproducts, "$.[?(@.Product_Code != '')]");
            //                                    var drCompProduct = jsonPath(drOwnandcompetitorproducts, "$.[?(@.Product_Code == '')]");
            //                                    var productName = drOwnandcompetitorproducts[0].Product_Name;
            //                                    var ownProductQty = drOwnandcompetitorproducts[0].Support_Qty;
            //                                    if (a > 0) {
            //                                        rcpaHtml += "<tr>";
            //                                    }
            //                                    if (parseInt(ownproductCount) > 0) {
            //                                        



            //                                        rcpaHtml += "<td></td>";//Doctor Name
            //                                        rcpaHtml += "<td></td>"; // Chemist Name
            //                                        rcpaHtml += "<td>" + productName + "</td>";//Own Product Name
            //                                        rcpaHtml += "<td>" + ownProductQty + "</td>";//My Product Quantity
            //                                    }
            //                                    else {
            //                                        
            //                                        rcpaHtml += "<td>" + productName + "</td>";//Own Product Name
            //                                        rcpaHtml += "<td>" + ownProductQty + "</td>";//My Product Quantity
            //                                    }
            //                                    ownproductCount++;
            //                                    for (var b = 0 ; b < drOwnandcompetitorproducts.length; b++) {
            //                                        if (drOwnandcompetitorproducts[b].Product_Code == null || drOwnandcompetitorproducts[b].Product_Code == "") {
            //                                            var competitorProductName = drOwnandcompetitorproducts[b].Competitor_Product_Name;
            //                                            var competitorqty = drOwnandcompetitorproducts[b].Support_Qty;
            //                                            if (parseInt(compRowcount) > 0) {
            //                                                
            //                                                rcpaHtml += "<tr>";
            //                                                rcpaHtml += "<td></td>";//Doctor Name
            //                                                rcpaHtml += "<td></td>"; //Chemist Name
            //                                                rcpaHtml += "<td></td>";//My Product Name
            //                                                rcpaHtml += "<td></td>"; //My own Product Quantity
            //                                                rcpaHtml += "<td>" + competitorProductName + "</td>";//Competitor Product Name
            //                                                rcpaHtml += "<td>" + competitorqty + "</td>";//Comp Qty
            //                                            }
            //                                            else {
            //                                                
            //                                                rcpaHtml += "<td>" + competitorProductName + "</td>";//Competitor Product Name
            //                                                rcpaHtml += "<td>" + competitorqty + "</td>";//Comp Qty
            //                                                rcpaHtml += "</tr>";
            //                                            }
            //                                            compRowcount++;
            //                                        }

            //                                    }
            //                                    if (!drCompProduct) {
            //                                        
            //                                        rcpaHtml += "<td></td>" //Competitor Product Name
            //                                        rcpaHtml += "<td></td>" //Competitor Product Qty
            //                                        rcpaHtml += "</tr>";
            //                                    }
            //                                }

            //                            }
            //                        }
            //                        chemistcount++;

            //                    }
            //                }
            //        }
            //        distChemistName = [];
            //    }

            //}



            //for (var i = 0; i < dcrRCPAJson.Rows.length; i++) {
            //    var doctorName = dcrRCPAJson.Rows[i].Doctor_Name == null ? '' : dcrRCPAJson.Rows[i].Doctor_Name;
            //    var productName = dcrRCPAJson.Rows[i].Product_Name == null ? '' : dcrRCPAJson.Rows[i].Product_Name;
            //    var chemistName = dcrRCPAJson.Rows[i].Chemists_Name == null ? '' : dcrRCPAJson.Rows[i].Chemists_Name;
            //    var compProdName = dcrRCPAJson.Rows[i].Competitor_Product_Name == null ? '' : dcrRCPAJson.Rows[i].Competitor_Product_Name;
            //    var supportQty = dcrRCPAJson.Rows[i].Support_Qty == null ? '' : dcrRCPAJson.Rows[i].Support_Qty;
            //    rcpaHtml += "<tr>";
            //    rcpaHtml += "<td>" + doctorName + "</td>";
            //    rcpaHtml += "<td>" + productName + "</td>";
            //    rcpaHtml += "<td>" + chemistName + "</td>";
            //    rcpaHtml += "<td>" + compProdName + "</td>";
            //    rcpaHtml += "<td>" + supportQty + "</td>";
            //    rcpaHtml += "</tr>";
            //} 
            rcpaHtml += "</tbody></table>";

            $('#dvRCPA').html(rcpaHtml);

        }


    }
}

function fnBindV4StockiestDetails(dcrStockiestJson) {
    debugger;
    if (dcrStockiestJson != null) {
        if (dcrStockiestJson.Rows.length > 0) {
            var Count = dcrStockiestJson.Rows.length;
            var stockistHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: #ec9e0e;'>" + stockist_caption + " Details</h3><h4 id='chCount' style='padding-left: 65%;'> Total " + stockist_caption + " Met Count :  <td> " + Count + " </td> </h4></div>";
            stockistHtml += "<table id='tblstockist' style='width:85%' class='data display box'><thead><th>" + stockist_caption + " Name</th><th>Visit Time/Mode</th><th>POB</th><th>Collection</th><th>Remarks</th></thead>";
            stockistHtml += "<tbody>";
            for (var i = 0; i < dcrStockiestJson.Rows.length; i++) {
                var stockiestName = dcrStockiestJson.Rows[i].Stockiest_Name == null ? '' : dcrStockiestJson.Rows[i].Stockiest_Name;
                var visitMode = dcrStockiestJson.Rows[i].Visit_Mode == null ? '' : dcrStockiestJson.Rows[i].Visit_Mode;
                var visitTime = dcrStockiestJson.Rows[i].Visit_Time == null ? '' : dcrStockiestJson.Rows[i].Visit_Time.split(':')[0] + ':' + dcrStockiestJson.Rows[i].Visit_Time.split(':')[1];
                var pob = dcrStockiestJson.Rows[i].PO_Amount == null ? '' : dcrStockiestJson.Rows[i].PO_Amount;
                var collecion = dcrStockiestJson.Rows[i].Collection_Amount == null ? '' : dcrStockiestJson.Rows[i].Collection_Amount;
                var remarks = dcrStockiestJson.Rows[i].Remarks_By_User == null ? '' : dcrStockiestJson.Rows[i].Remarks_By_User;
                stockistHtml += "<tr>";
                stockistHtml += "<td>" + stockiestName + "</td>";
                stockistHtml += "<td>" + visitTime + ' ' + visitMode + "</td>";
                stockistHtml += "<td>" + pob + "</td>";
                stockistHtml += "<td>" + collecion + "</td>";
                stockistHtml += "<td>" + remarks + "</td>";
                stockistHtml += "</tr>";
            }
            stockistHtml += "</tbody></table>";
            $('#dvStockiest').html(stockistHtml);

        }
    }
}

function fnBindV4ExpenseDetails(dcrExpenseJson) {
    if (dcrExpenseJson != null) {
        if (dcrExpenseJson.Rows.length > 0) {
            var expenseHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>Expense Details</h3></div>";
            expenseHtml += "<table id='tblExpenseSummary' class='data display  box' style='width:85%' ><thead><th>Expense Name</th><th>Amount</th><th>Remarks</th></thead>";
            expenseHtml += "<tbody>";
            for (var i = 0; i < dcrExpenseJson.Rows.length; i++) {
                var expenseTypeName = dcrExpenseJson.Rows[i].Expense_Type_Name == null ? '' : dcrExpenseJson.Rows[i].Expense_Type_Name;
                var expenseAmount = dcrExpenseJson.Rows[i].Expense_Amount == null ? '' : dcrExpenseJson.Rows[i].Expense_Amount;
                var expenseRemarks = dcrExpenseJson.Rows[i].Expense_Remarks == null ? '' : dcrExpenseJson.Rows[i].Expense_Remarks;
                expenseHtml += "<tr>";
                expenseHtml += "<td>" + expenseTypeName + "</td>";
                expenseHtml += "<td style='text-align: right;'>" + expenseAmount + "</td>";
                expenseHtml += "<td>" + expenseRemarks + "</td>";
                expenseHtml += "</tr>";
            }
            expenseHtml += "</tbody></table>";


        }
        $('#dvExpense').html(expenseHtml);
    }
}

//////////////////////////////////////////////////////////////Chemist visit day///////////////////////////////////////////////
function fnBindV4ChemistOwnChemistVisit(dcrOwnDoctorJson) {
    var chemistCount = 0;
    debugger;
    if (dcrOwnDoctorJson != null) {
        if (dcrOwnDoctorJson.Rows.length > 0) {
            chemistCount = dcrOwnDoctorJson.Rows.length;
            var ownDocHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background:lightseagreen;'>" + chemist_caption + " Visited Details</h3><h4 id='chCount' style='padding-left: 65%;'> Total " + chemist_caption + " Met Count : <td> " + chemistCount + " </td> </h4></div>";
            ownDocHtml += "<table id='tblV4CVOwnChemist'  class='data display box' style='width:85%'><thead><th>" + chemist_caption + " Region</th><th>" + chemist_caption + "</th><th>MDL/SVL#</th><th>Visit Time</th><th>Accompanist Details</th><th>POB Amount</th><th>Remarks</th><th>Business Category Name</th></thead>";
            ownDocHtml += "<tbody>";
            var id = 1;
            for (var i = 0; i < dcrOwnDoctorJson.Rows.length; i++) {
                var type = 'own';
                var regionName = dcrOwnDoctorJson.Rows[i].Region_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Region_Name;
                var doc_code = dcrOwnDoctorJson.Rows[i].Chemist_Code;
                var chemistName = dcrOwnDoctorJson.Rows[i].Chemists_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Chemists_Name;
                var mdlNumber = dcrOwnDoctorJson.Rows[i].MDL_Number == null ? '' : dcrOwnDoctorJson.Rows[i].MDL_Number;
                // var specialityName = dcrOwnDoctorJson.Rows[i].Speciality_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Speciality_Name;
                var visitMode = dcrOwnDoctorJson.Rows[i].Visit_Mode == null ? '' : dcrOwnDoctorJson.Rows[i].Visit_Mode;
                var visitTime = dcrOwnDoctorJson.Rows[i].Visit_Time == null ? '' : dcrOwnDoctorJson.Rows[i].Visit_Time.toUpperCase();
                if (visitTime != null && visitTime != '' && visitTime != undefined) {
                    var visitTimeMode = visitTime.split(' ');
                    visitTime = visitTimeMode[0];
                }
                var po_Amount = dcrOwnDoctorJson.Rows[i].PO_Amount == null ? '' : dcrOwnDoctorJson.Rows[i].PO_Amount;
                var remarks = dcrOwnDoctorJson.Rows[i].Remarks_By_User == null ? '' : dcrOwnDoctorJson.Rows[i].Remarks_By_User;
                var CategoryName = dcrOwnDoctorJson.Rows[i].Business_Category_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Business_Category_Name;
                var timemode = visitTime.length > 0 ? (visitTime + " " + visitMode) : visitMode.length > 0 ? visitMode : "AM";
                ownDocHtml += "<tr>";
                ownDocHtml += "<td id='docname_" + i.toString() + "'>" + regionName + "</td>";
                ownDocHtml += "<td id='docname_" + i.toString() + "'>" + chemistName + "</td>";
                ownDocHtml += "<td id='docmdl_" + i.toString() + "'>" + mdlNumber + "</td>";
                //    ownDocHtml += "<td id='docspec_" + i.toString() + "'>" + specialityName + "<span id='docCategory_" + i + "' style='display:none'>" + dcrOwnDoctorJson.Rows[i].Category_Name + "</span></td>";
                //       ownDocHtml += "<td id='docCategory_" + i.toString() + "'>" + dcrOwnDoctorJson.Rows[i].Category_Name + "</td>";
                ownDocHtml += "<td>" + timemode + "</td>";
                if (dcrOwnDoctorJson.Rows[i].Acc_Visit_Count > 0) {
                    //ownDocHtml += "<td><div style='display:none;' id='divDocAccDetails_" + id + "'>" + dcrOwnDoctorJson.Rows[i].DCR_Actual_Date + "$" + dcrOwnDoctorJson.Rows[i].DCR_Visit_Code + "$" + dcrOwnDoctorJson.Rows[i].MDL_Number + "$" + dcrOwnDoctorJson.Rows[i].Chemists_Name + "</div><a style='color: blue;'> YES </a></td>";
                    ownDocHtml += "<td><div style='display:none;' id='divCvAccDetails_" + id + "'>" + dcrOwnDoctorJson.Rows[i].DCR_Actual_Date + "$" + dcrOwnDoctorJson.Rows[i].Visit_Id + "$" + dcrOwnDoctorJson.Rows[i].MDL_Number + "$" + dcrOwnDoctorJson.Rows[i].Chemists_Name + "$" + dcrOwnDoctorJson.Rows[i].Category_Name + "</div> YES</td>";
                    id++;
                }
                else
                    ownDocHtml += "<td>No</td>";
                // ownDocHtml += "<td><span class='hyperlink' onclick='fnShowV4DetailedProducts(\"" + i.toString() + "\",\"" + doc_code + "\",\"" + type + "\")'>View</span></td>";
                ownDocHtml += "<td style='text-align: right;'>" + po_Amount + "</td>";
                ownDocHtml += "<td>" + remarks + "</td>";
                ownDocHtml += "<td>" + CategoryName + "</td>";
                ownDocHtml += "</tr>";
            }

            ownDocHtml += "</tbody></table>";
            $('#dvOwnCVChemist').html(ownDocHtml);

        }
    }
}
function fnBindV4ChemistContact(dcrOwnDoctorJson) {
    if (dcrOwnDoctorJson != null) {
        if (dcrOwnDoctorJson.Rows.length > 0) {
            var attendanceHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background:lightseagreen;'>Chemist Contact Details</h3></div>";
            attendanceHtml += "<table id='tblChemistContact'style='width: 85%;' class='data display dataTable box'><thead><th>Chemist Name</th><th>Contact Name</th><th>Mobile</th><th>Email</th></thead>";
            attendanceHtml += "<tbody>";
            for (var i = 0; i < dcrOwnDoctorJson.Rows.length; i++) {
                var ChemistName = dcrOwnDoctorJson.Rows[i].Chemists_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Chemists_Name;
                var ContactName = dcrOwnDoctorJson.Rows[i].Contact_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Contact_Name;
                var MobileNumber = dcrOwnDoctorJson.Rows[i].Mobile == null ? '' : dcrOwnDoctorJson.Rows[i].Mobile;
                var EmailId = dcrOwnDoctorJson.Rows[i].Email == null ? '' : dcrOwnDoctorJson.Rows[i].Email;
                attendanceHtml += "<tr>";
                attendanceHtml += "<td>" + ChemistName + "</td>";
                attendanceHtml += "<td>" + ContactName + "</td>";
                attendanceHtml += "<td>" + MobileNumber + "</td>";
                attendanceHtml += "<td>" + EmailId + "</td>";
                attendanceHtml += "</tr>";
            }
            attendanceHtml += "</tbody></table>";
            $('#dvChemistContact').html(attendanceHtml);

        }
    }
}
function fnBindV4ChemistRCPADetails(dcrRCPAJson) {
    debugger;
    var Chemname = new Array();
    var custname = new Array();
    var prodname = new Array();
    var prodqty = new Array();


    if (dcrRCPAJson != null) {
        if (dcrRCPAJson.Rows.length > 0) {
            var rcpaHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background:lightseagreen;'>" + chemist_caption + " RCPA Details</h3></div>";
            rcpaHtml += "<table id='tblChemistRCPA'  class='data display dataTable box' style='width:85%'><thead><th>" + chemist_caption + " Name</th><th> " + doctor_caption + "</th><th>My Product Name</th><th>My Product Quantity</th><th>Product Remarks</th><th>Rx Number</th><th>Competitor Product Name</th><th>Competitor Product Qty</th></thead>";

            rcpaHtml += "<tbody>";
            for (var i = 0; i < dcrRCPAJson.Rows.length; i++) {
                var chemistname = dcrRCPAJson.Rows[i].Chemists_Name == null ? '' : dcrRCPAJson.Rows[i].Chemists_Name;
                var customername = dcrRCPAJson.Rows[i].Customer_Name == null ? '' : dcrRCPAJson.Rows[i].Customer_Name;
                var productname = dcrRCPAJson.Rows[i].Product_Name == null ? '' : dcrRCPAJson.Rows[i].Product_Name;
                var productqty = dcrRCPAJson.Rows[i].Qty == null ? '' : dcrRCPAJson.Rows[i].Qty;
                var Remarks = dcrRCPAJson.Rows[i].Product_Remarks == null ? '' : dcrRCPAJson.Rows[i].Product_Remarks;
                var rxnumber = dcrRCPAJson.Rows[i].RxNumber == null ? '' : dcrRCPAJson.Rows[i].RxNumber;

                var matchchem = 0;
                var matchcust = 0;
                var matchprod = 0;
                var matchprodqty = 0;

                if (i != 0) {
                    matchchem = Chemname.indexOf(chemistname.trim());
                    if (matchchem == -1) {
                        Chemname.push(chemistname.trim());
                    }
                    matchcust = custname.indexOf(customername.trim());
                    if (matchcust == -1) {
                        custname.push(customername.trim());
                    }
                    if (matchcust == -1) {
                        prodname = [];
                    }
                    matchprod = prodname.indexOf(productname.trim());
                    if (matchprod == -1) {
                        prodname.push(productname.trim());
                    }
                }

                rcpaHtml += "<tr>";
                //chemist name
                if (i == 0) {
                    Chemname.push(chemistname.trim());
                    rcpaHtml += "<td>" + chemistname + "</td>";
                }
                else if (matchchem != -1) {
                    if (matchcust == -1) {
                        rcpaHtml += "<td>" + chemistname + "</td>";
                    }
                    else {
                        rcpaHtml += "<td></td>";
                    }
                }
                else {
                    rcpaHtml += "<td>" + chemistname + "</td>";
                }
                //customer name
                if (i == 0) {
                    custname.push(customername.trim());
                    rcpaHtml += "<td>" + customername + "</td>";
                }
                else if (matchcust != -1) {
                    if (matchchem == -1) {
                        rcpaHtml += "<td>" + customername + "</td>";
                    }
                    else {
                        rcpaHtml += "<td></td>";
                    }
                }
                else {
                    rcpaHtml += "<td>" + customername + "</td>";
                }
                //own product
                if (i == 0) {
                    prodname.push(productname.trim());
                    rcpaHtml += "<td>" + productname + "</td>";
                }
                else if (matchprod != -1) {
                    if (matchchem == -1 || matchcust == -1) {
                        rcpaHtml += "<td>" + productname + "</td>";
                    }
                    else {
                        rcpaHtml += "<td></td>";
                    }
                }
                else {
                    rcpaHtml += "<td>" + productname + "</td>";
                }
                //own product qty
                if (i == 0) {
                    prodqty.push(productqty.toString().trim());
                    rcpaHtml += "<td>" + productqty + "</td>";
                }
                else if (matchchem != -1) {
                    if (matchcust == -1 || matchprod == -1) {

                        rcpaHtml += "<td>" + productqty + "</td>";

                    }
                    else {
                        rcpaHtml += "<td></td>";
                    }
                }
                else {
                    rcpaHtml += "<td>" + productqty + "</td>";
                }
                rcpaHtml += "<td>" + (dcrRCPAJson.Rows[i].Product_Remarks == null ? '' : dcrRCPAJson.Rows[i].Product_Remarks) + "</td>";
                rcpaHtml += "<td>" + (dcrRCPAJson.Rows[i].RxNumber == null ? '' : dcrRCPAJson.Rows[i].RxNumber) + "</td>";
                rcpaHtml += "<td>" + (dcrRCPAJson.Rows[i].Competitor_Product_Name == null ? '' : dcrRCPAJson.Rows[i].Competitor_Product_Name) + "</td>";
                rcpaHtml += "<td>" + (dcrRCPAJson.Rows[i].Comp_Qty == null ? '' : dcrRCPAJson.Rows[i].Comp_Qty) + "</td>";

                rcpaHtml += "</tr>";
            }




            rcpaHtml += "</tbody></table>";
        }


        $('#dvChemistRCPA').html(rcpaHtml);
    }

}
function fnBindV4ChemistSampleProductDetails(dcrProductJson) {
    debugger;
    if (dcrProductJson != null) {
        if (dcrProductJson.Rows.length > 0) {
            var productHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background:lightseagreen;'>" + chemist_caption + " Sample/Promotional item Details</h3></div>";
            productHtml += "<table id='tblChemistProducts'  class='data display dataTable box' style='width:85%'><thead><th>" + chemist_caption + " Region</th><th>" + chemist_caption + "</th><th>Sample/Promotional item Name</th><th>Batch Number</th><th>Qty given</th><th>Brand</th></thead>";
            productHtml += "<tbody>";
            var chename = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrProductJson.Rows.length; i++) {
                var regionname = dcrProductJson.Rows[i].Region_Name == null ? '' : dcrProductJson.Rows[i].Region_Name;
                var chemistName = dcrProductJson.Rows[i].Chemists_Name == null ? '' : dcrProductJson.Rows[i].Chemists_Name;
                var productName = dcrProductJson.Rows[i].Product_Name == null ? '' : dcrProductJson.Rows[i].Product_Name;
                var Batchnumber = dcrProductJson.Rows[i].Batch_Number == null ? '' : dcrProductJson.Rows[i].Batch_Number;
                var quantityProvided = dcrProductJson.Rows[i].Quantity_Provided == null ? '' : dcrProductJson.Rows[i].Quantity_Provided;
                var currentStcok = dcrProductJson.Rows[i].Current_Stock == null ? '0' : dcrProductJson.Rows[i].Current_Stock;
                //var specilaityName = dcrProductJson.Rows[i].Speciality_Name == null ? '' : dcrProductJson.Rows[i].Speciality_Name;
                //    var detailed = dcrProductJson.Rows[i].Detailed == null ? '' : dcrProductJson.Rows[i].Detailed;
                //  var isCpDoc = dcrProductJson.Rows[i].Is_CP_Doc == null ? '' : dcrProductJson.Rows[i].Is_CP_Doc;
                var Brand = dcrProductJson.Rows[i].Brand_Name == null ? '' : dcrProductJson.Rows[i].Brand_Name;

                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchche = chename.indexOf(chemistName.trim());
                    if (matchche == -1) {
                        chename.push(chemistName.trim());
                    }
                }
                productHtml += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    productHtml += "<td>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchche == -1) {
                        productHtml += "<td>" + regionname + "</td>";
                    }
                    else {
                        productHtml += "<td></td>";
                    }
                }
                else {
                    productHtml += "<td>" + regionname + "</td>";
                }
                if (i == 0) {
                    chename.push(chemistName.trim());
                    productHtml += "<td>" + chemistName + "</td>";
                }
                else if (matchche != -1) {
                    if (match == -1) {
                        productHtml += "<td>" + chemistName + "</td>";
                    }
                    else {
                        productHtml += "<td></td>";
                    }
                }
                else {
                    productHtml += "<td>" + chemistName + "</td>";
                }
                productHtml += "<td>" + productName + "</td>";
                productHtml += "<td>" + Batchnumber + "</td>";
                productHtml += "<td>" + quantityProvided + "</td>";
                // productHtml += "<td>" + currentStcok + "</td>";
                productHtml += "<td>" + Brand + "</td>";

                //    productHtml += "<td style='display:none'>" + detailed + "</td>";
                //   productHtml += "<td>" + isCpDoc + "</td>";
                productHtml += "</tr>";
            }
            productHtml += "</tbody></table>";
            $('#dvChemistVisitSsampleProducts').html(productHtml);
            //$('#tblProducts').dataTable({
            //    "bFilter": false,
            //    "bPaginate": false,
            //    "sPaginationType": "full_numbers",
            //    "bInfo": false,
            //    // "sScrollX": "100%",
            //    "bSort": false
            //});
        }

    }
}
function fnBindV4ChemistDetailsProductDetails(dcrDetailedproductJson) {
    if (dcrDetailedproductJson != null && dcrDetailedproductJson != '') {
        if (dcrDetailedproductJson.Rows.length > 0) {
            var detailProductHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background:lightseagreen;'> " + chemist_caption + " Detailed Products</h3></div>";
            detailProductHtml += "<table id='tblChemistDetailedProducts'  class='data display dataTable box' style='width:85%'><thead><th>" + chemist_caption + " Region</th><th>" + chemist_caption + " Name</th><th>Detailed Product Name</th><th>Brand Name</th></thead>";
            detailProductHtml += "<tbody>";
            var chename = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrDetailedproductJson.Rows.length; i++) {
                var regionname = dcrDetailedproductJson.Rows[i].Region_Name == null ? '' : dcrDetailedproductJson.Rows[i].Region_Name;
                var chemistName = dcrDetailedproductJson.Rows[i].Chemists_Name == null ? '' : dcrDetailedproductJson.Rows[i].Chemists_Name;
                var productName = dcrDetailedproductJson.Rows[i].Sales_Product_Name == null ? '' : dcrDetailedproductJson.Rows[i].Sales_Product_Name;
                var productTypeName = dcrDetailedproductJson.Rows[i].Product_Type_Name == null ? '' : dcrDetailedproductJson.Rows[i].Product_Type_Name;
                var brandName = dcrDetailedproductJson.Rows[i].Brand_Name == null ? '' : dcrDetailedproductJson.Rows[i].Brand_Name;
                //     var isCpDoc = dcrDetailedproductJson.Rows[i].Is_CP_Doc == null ? '' : dcrDetailedproductJson.Rows[i].Is_CP_Doc;
                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchche = chename.indexOf(chemistName.trim());
                    if (matchche == -1) {
                        chename.push(chemistName.trim());
                    }
                }
                detailProductHtml += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    detailProductHtml += "<td>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchche == -1) {
                        detailProductHtml += "<td>" + regionname + "</td>";
                    }
                    else {
                        detailProductHtml += "<td></td>";
                    }
                }
                else {
                    detailProductHtml += "<td>" + regionname + "</td>";
                }
                if (i == 0) {
                    chename.push(chemistName.trim());
                    detailProductHtml += "<td>" + chemistName + "</td>";
                }
                else if (matchche != -1) {
                    if (match == -1) {
                        detailProductHtml += "<td>" + chemistName + "</td>";
                    }
                    else {
                        detailProductHtml += "<td></td>";
                    }
                }
                else {
                    detailProductHtml += "<td>" + chemistName + "</td>";
                }
                detailProductHtml += "<td>" + productName + "</td>";
                //  detailProductHtml += "<td>" + productTypeName + "</td>";
                detailProductHtml += "<td>" + brandName + "</td>";
                //       detailProductHtml += "<td>" + isCpDoc + "</td>";
                detailProductHtml += "</tr>";
            }
            detailProductHtml += "</tbody></table>";
            $('#dvCVDetailedProductsDetails').html(detailProductHtml);
        }

    }
}

function fnBindChemistPOBOrder(dcrPobOrderJson) {
    debugger;
    if (dcrPobOrderJson != null && dcrPobOrderJson != undefined && dcrPobOrderJson.Rows.length > 0) {
        var statusTemp = false;
        var strPob = "<div class= 'gridHeader'><h3 style='width:85%;margin:0px auto;background:lightseagreen;'>" + chemist_caption + " Purchase Order Booking </h3></div>";
        strPob += "<table id='tblPobOrders' style='width:85%' class='data display box'><thead><th>" + chemist_caption + " Region</th><th>" + chemist_caption + " Name</th><th>Stockist Name</th><th>Order Number</th><th>Order Due Date</th><th>No. Of Products</th><th>Total Value</th></thead>";
        strPob += "<tbody>";
        var chename = new Array();
        var regname = new Array();
        for (var i = 0; i < dcrPobOrderJson.Rows.length; i++) {
            var regionname = dcrPobOrderJson.Rows[i].Region_Name;
            var chemistName = dcrPobOrderJson.Rows[i].Customer_Name;
            var match = 0;
            var matchche = 0;
            if (i != 0) {
                match = regname.indexOf(regionname.trim());
                if (match == -1) {
                    regname.push(regionname.trim());
                }
                matchche = chename.indexOf(chemistName.trim());
                if (matchche == -1) {
                    chename.push(chemistName.trim());
                }
            }
            strPob += "<tr>";

            if (i == 0) {
                regname.push(regionname.trim());
                strPob += "<td style='width:20%;'>" + regionname + "</td>";
            }
            else if (match != -1) {
                if (matchche == -1) {
                    strPob += "<td style='width:20%;'>" + regionname + "</td>";
                }
                else {
                    strPob += "<td></td>";
                }
            }
            else {
                strPob += "<td style='width:20%;'>" + regionname + "</td>";
            }
            if (i == 0) {
                chename.push(chemistName.trim());
                strPob += "<td style='width:20%;'>" + chemistName + "</td>";
            }
            else if (matchche != -1) {
                if (match == -1) {
                    strPob += "<td style='width:20%;'>" + chemistName + "</td>";
                }
                else {
                    strPob += "<td></td>";
                }
            }
            else {
                strPob += "<td style='width:20%;'>" + chemistName + "</td>";
            }
            strPob += "<td style='width:15%;'>" + dcrPobOrderJson.Rows[i].Stockist_Name + "</td>";
            strPob += "<td style='width:10%;text-decoration:underline;cursor:pointer;'><a href='javascript:fnGetPOBProductDetails(" + dcrPobOrderJson.Rows[i].Order_Id + ");' class='btnEditOrder'>" + dcrPobOrderJson.Rows[i].Order_Number + "</a></td>";
            strPob += "<td style='width:15%;'>" + dcrPobOrderJson.Rows[i].Order_Due_Date + "</td>";
            strPob += "<td style='width:10%;text-align: right;'>" + dcrPobOrderJson.Rows[i].No_Of_Products + "</td>";
            strPob += "<td style='width:10%;text-align: right;'>" + dcrPobOrderJson.Rows[i].Total_POB_Value + "</td>";
            strPob += "</tr>";
            if (parseInt(dcrPobOrderJson.Rows[i].Order_Status) == 3) {
                statusTemp = true;
            }

        }
        //if (statusTemp) {
        //    strPob += "<tr><td colspan='5' style='font-size:11px;'>T : Temporary/Drafted Order Number.</td></tr>";
        //}
        strPob += "</tbody></table>";
        $('#dvCVPOB').html(strPob);
    }
}
//Followups
function fnBindV4ChemistFollowUps(dcrFollowUpsJson) {
    debugger;
    if (dcrFollowUpsJson != null) {
        if (dcrFollowUpsJson.Rows.length > 0) {
            var followUps = "<div class= 'gridHeader'><h3 style='width:85%;margin:0px auto;background:lightseagreen;'>" + chemist_caption + " Follow Ups</h3></div>";
            followUps += "<table id='tblChemistFollowUps' style='width:85%' class='data display box'><thead><th>" + chemist_caption + " Region</th><th>" + chemist_caption + "</th><th>Tasks</th><th>Due Date</th></thead>";
            followUps += "<tbody>";
            var chename = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrFollowUpsJson.Rows.length; i++) {
                debugger;
                var regionname = dcrFollowUpsJson.Rows[i].Region_Name == null ? '' : dcrFollowUpsJson.Rows[i].Region_Name;
                var chemistName = dcrFollowUpsJson.Rows[i].Chemists_Name == null ? '' : dcrFollowUpsJson.Rows[i].Chemists_Name;
                var mdlNo = dcrFollowUpsJson.Rows[i].MDL_Number == null ? '' : dcrFollowUpsJson.Rows[i].MDL_Number;
                var tasks = dcrFollowUpsJson.Rows[i].Tasks == null ? '' : dcrFollowUpsJson.Rows[i].Tasks;
                var dueDate = dcrFollowUpsJson.Rows[i].Due_Date == null ? '' : dcrFollowUpsJson.Rows[i].Due_Date;
                //var updatedDate = dcrFollowUpsJson.Rows[i].Updated_Date_Time == null ? '' : dcrFollowUpsJson.Rows[i].Updated_Date_Time;
                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchche = chename.indexOf(chemistName.trim());
                    if (matchche == -1) {
                        chename.push(chemistName.trim());
                    }
                }
                followUps += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    followUps += "<td style='width:20%;'>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchche == -1) {
                        followUps += "<td style='width:20%;'>" + regionname + "</td>";
                    }
                    else {
                        followUps += "<td></td>";
                    }
                }
                else {
                    followUps += "<td style='width:20%;'>" + regionname + "</td>";
                }
                if (i == 0) {
                    chename.push(chemistName.trim());
                    followUps += "<td style='width:20%;'>" + chemistName + "</td>";
                }
                else if (matchche != -1) {
                    if (match == -1) {
                        followUps += "<td style='width:20%;'>" + chemistName + "</td>";
                    }
                    else {
                        followUps += "<td></td>";
                    }
                }
                else {
                    followUps += "<td style='width:20%;'>" + chemistName + "</td>";
                }

                // followUps += "<td style='width:10%;'>" + mdlNo + "</td>";
                followUps += "<td style='width:20%;'>" + tasks + "</td>";
                followUps += "<td style='width:15%;'>" + dueDate + "</td>";
                //  followUps += "<td style='width:20%;'>" + updatedDate + "</td>";
                followUps += "</tr>";
            }
            followUps += "</tbody></table>";
            $('#dvchemistFollowUps').css('display', '');
            $('#dvchemistFollowUps').html(followUps);
        }
    }
}
// Attachments
function fnBindV4ChemistAttachments(dcrAttachmentsJson) {
    debugger;
    if (dcrAttachmentsJson != null) {
        if (dcrAttachmentsJson.Rows.length > 0) {
            var attachments = "<div class= 'gridHeader'><h3 style='width:85%;margin:0px auto;background:lightseagreen;'>" + chemist_caption + " Attachments</h3></div>";
            attachments += "<table id='tblchemistAttachments' style='width:85%' class='data display box'><thead><th>" + chemist_caption + " Region</th><th>" + chemist_caption + "</th><th>Attachement File name (click on the file to download locally)</th><th>Updated DateTime</th><th>Status</th></thead>";
            attachments += "<tbody>";
            var chename = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrAttachmentsJson.Rows.length; i++) {
                var regionname = dcrAttachmentsJson.Rows[i].Region_Name == null ? '' : dcrAttachmentsJson.Rows[i].Region_Name;
                var chemistName = dcrAttachmentsJson.Rows[i].Chemists_Name == null ? '' : dcrAttachmentsJson.Rows[i].Chemists_Name;
                var mdlNo = dcrAttachmentsJson.Rows[i].MDL_Number == null ? '' : dcrAttachmentsJson.Rows[i].MDL_Number;
                var bloburl = dcrAttachmentsJson.Rows[i].Blob_Url == null ? '' : dcrAttachmentsJson.Rows[i].Blob_Url;
                var uploadFileName = dcrAttachmentsJson.Rows[i].Uploaded_File_Name == null ? '' : dcrAttachmentsJson.Rows[i].Uploaded_File_Name;
                var updatedDateTime = dcrAttachmentsJson.Rows[i].Updated_Date_Time == null ? '' : dcrAttachmentsJson.Rows[i].Updated_Date_Time;
                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchche = chename.indexOf(chemistName.trim());
                    if (matchche == -1) {
                        chename.push(chemistName.trim());
                    }
                }
                attachments += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    attachments += "<td style='width:20%;'>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchche == -1) {
                        attachments += "<td style='width:20%;'>" + regionname + "</td>";
                    }
                    else {
                        attachments += "<td></td>";
                    }
                }
                else {
                    attachments += "<td style='width:20%;'>" + regionname + "</td>";
                }
                if (i == 0) {
                    chename.push(chemistName.trim());
                    attachments += "<td style='width:20%;'>" + chemistName + "</td>";
                }
                else if (matchche != -1) {
                    if (match == -1) {
                        attachments += "<td style='width:20%;'>" + chemistName + "</td>";
                    }
                    else {
                        attachments += "<td></td>";
                    }
                }
                else {
                    attachments += "<td style='width:20%;'>" + chemistName + "</td>";
                }

                // attachments += "<td style='width:10%;'>" + mdlNo + "</td>";
                if (bloburl == "") {
                    attachments += ("<td style='width:30%;'>" + uploadFileName + "</td>");
                }
                else {
                    attachments += ("<td style='width:30%;'><a href='" + bloburl + "'>" + uploadFileName + "</td>");
                }
                //attachments += "<td><a href='" + bloburl + "'>" + uploadFileName + "</td>";
                attachments += "<td style='width:15%;'>" + updatedDateTime + "</td>";
                if (bloburl == null || bloburl == "") {
                    attachments += "<td style='width:10%;'>" + "Yet to upload" + "</td>";
                }
                else {
                    attachments += "<td style='width:10%;'>" + "Attached" + "</td>";
                }
                attachments += "</tr>";
            }
            attachments += "</tbody></table>";
            $('#dvchemistAttachments').css('display', '');
            $('#dvchemistAttachments').html(attachments);
        }
    }
}

function fnBindV4AttendanceDetails(dcrAttendance) {
    if (dcrAttendance != null) {
        if (dcrAttendance.Rows.length > 0) {
            var attendanceHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>Activity Details</h3></div>";
            attendanceHtml += "<table id='tblAttendance' class='data display  box' style='width:85%' ><thead><th>Project</th><th>Activity</th><th>Start Time</th><th>End Time</th><th>Remarks</th><th>Additional Details</th></thead>";
            attendanceHtml += "<tbody>";
            for (var i = 0; i < dcrAttendance.Rows.length; i++) {
                var project = dcrAttendance.Rows[i].Project_Name == null ? '' : dcrAttendance.Rows[i].Project_Name;
                var activity = dcrAttendance.Rows[i].Activity_Name == null ? '' : dcrAttendance.Rows[i].Activity_Name;
                var enteredDate = dcrAttendance.Rows[i].Entered_Date == null ? '' : dcrAttendance.Rows[i].Entered_Date;
                var startTime = dcrAttendance.Rows[i].StartTime == null ? '' : dcrAttendance.Rows[i].StartTime;
                var endTime = dcrAttendance.Rows[i].EndTime == null ? '' : dcrAttendance.Rows[i].EndTime;
                var remarks = dcrAttendance.Rows[i].Remarks == null ? '' : dcrAttendance.Rows[i].Remarks;
                attendanceHtml += "<tr>";
                attendanceHtml += "<td>" + project + "</td>";
                attendanceHtml += "<td>" + activity + "</td>";
                attendanceHtml += "<td>" + startTime + "</td>";
                attendanceHtml += "<td>" + endTime + "</td>";
                attendanceHtml += "<td>" + remarks + "</td>";
                header_g = dcrAttendance.Rows[i].Header_Id;
                if ((dcrAttendance.Rows[i].Header_Id != null || dcrAttendance.Rows[i].Header_Id != 0) && dcrAttendance.Rows[i].status != null) {
                    attendanceHtml += "<td><a href='#' onclick='fnshowDRReport();' style='color:blue'>Click here</a></td>";
                }
                else {
                    attendanceHtml += "<td></td>";
                }
                attendanceHtml += "</tr>";
            }
            attendanceHtml += "</tbody></table>";
            $('#dvAttcallact').css('display', '');
            $('#dvAttcallact').html(attendanceHtml);

        }
    }
}
function fnshowDRReport() {
    debugger;
    Method_params = ["DieticianReporting/GetDieticianReportingdetailsforDCR", Company_Code, RegionCode, header_g];
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
function BindAttendanceCallActivityDetails(dcrAttendance) {
    if (dcrAttendance != null) {
        if (dcrAttendance.Rows.length > 0) {
            var attendanceHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>Call Activity Details</h3></div>";
            attendanceHtml += "<table id='tblAttendancecallact'style='width: 85%;' class='data display dataTable box'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>Call Activity</th><th>Activity Remarks</th></thead>";
            attendanceHtml += "<tbody>";
            for (var i = 0; i < dcrAttendance.Rows.length; i++) {

                attendanceHtml += "<tr>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Doctor_Region_Name + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Doctor_Name + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Activity_Name + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Activity_Remarks + "</td>";
                attendanceHtml += "</tr>";
            }
            attendanceHtml += "</tbody></table>";
            $('#dvAttendance').css('display', '');
            $('#dvAttendance').html(attendanceHtml);

        }
    }
}
function fnBindV4AttendanceHospitalActivityDetails(dcrAttendance) {
    if (dcrAttendance != null) {
        if (dcrAttendance.Rows.length > 0) {
            var attendanceHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>Hospital Call Activity Details</h3></div>";
            attendanceHtml += "<table id='tblAttendancecallact'style='width: 85%;' class='data display dataTable box'><thead><th>Hospital Region</th><th>Hospital Name</th><th>Call Activity</th><th>Activity Remarks</th></thead>";
            attendanceHtml += "<tbody>";
            for (var i = 0; i < dcrAttendance.Rows.length; i++) {
                var RegionName = dcrAttendance.Rows[i].Region_Name == null ? '' : dcrAttendance.Rows[i].Region_Name;
                var HospitalName = dcrAttendance.Rows[i].Hospital_Name == null ? '' : dcrAttendance.Rows[i].Hospital_Name;
                var ActivityName = dcrAttendance.Rows[i].Activity_Name == null ? '' : dcrAttendance.Rows[i].Activity_Name;
                var ActivityRemarks = dcrAttendance.Rows[i].Activity_Remarks == null ? '' : dcrAttendance.Rows[i].Activity_Remarks;
                attendanceHtml += "<tr>";
                attendanceHtml += "<td>" + RegionName + "</td>";
                attendanceHtml += "<td>" + HospitalName + "</td>";
                attendanceHtml += "<td>" + ActivityName + "</td>";
                attendanceHtml += "<td>" + ActivityRemarks + "</td>";
                attendanceHtml += "</tr>";
            }
            attendanceHtml += "</tbody></table>";
            $('#dvAttendance').css('display', '');
            $('#dvAtthsptlcallact').html(attendanceHtml);

        }
    }
}
function fnBindV4AttendanceHospitalContactDetails(dcrAttendance) {
    if (dcrAttendance != null) {
        if (dcrAttendance.Rows.length > 0) {
            var attendanceHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>Hospital Contact Details</h3></div>";
            attendanceHtml += "<table id='tblAttendancecallact'style='width: 85%;' class='data display dataTable box'><thead><th>Hospital Name</th><th>Contact Name</th><th>Mobile</th><th>Email</th></thead>";
            attendanceHtml += "<tbody>";
            for (var i = 0; i < dcrAttendance.Rows.length; i++) {
                var HospitalName = dcrAttendance.Rows[i].Hospital_Name == null ? '' : dcrAttendance.Rows[i].Hospital_Name;
                var ContactName = dcrAttendance.Rows[i].Contact_Name == null ? '' : dcrAttendance.Rows[i].Contact_Name;
                var MobileNumber = dcrAttendance.Rows[i].Mobile_Number == null ? '' : dcrAttendance.Rows[i].Mobile_Number;
                var EmailId = dcrAttendance.Rows[i].Email_Id == null ? '' : dcrAttendance.Rows[i].Email_Id;
                attendanceHtml += "<tr>";
                attendanceHtml += "<td>" + HospitalName + "</td>";
                attendanceHtml += "<td>" + ContactName + "</td>";
                attendanceHtml += "<td>" + MobileNumber + "</td>";
                attendanceHtml += "<td>" + EmailId + "</td>";
                attendanceHtml += "</tr>";
            }
            attendanceHtml += "</tbody></table>";
            $('#dvAttendance').css('display', '');
            $('#dvhsptlcontact').html(attendanceHtml);

        }
    }
}
function BindAttendanceMCActivityDetails(dcrAttendance) {
    if (dcrAttendance != null) {
        if (dcrAttendance.Rows.length > 0) {
            var attendanceHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>MC/CME Activity Details</h3></div>";
            attendanceHtml += "<table id='tblAttendancecallact'style='width: 85%;' class='data display dataTable box'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>Campaign Name</th><th>MC Activity</th><th>Activity Remarks</th></thead>";
            attendanceHtml += "<tbody>";
            for (var i = 0; i < dcrAttendance.Rows.length; i++) {

                attendanceHtml += "<tr>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Doctor_Region_Name + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Doctor_Name + "</td>";
                if (dcrAttendance.Rows[i].Campaign_Type == "CME") {
                    attendanceHtml += "<td><a class='link' onclick=fngetCMEProductDetails('" + dcrAttendance.Rows[i].DCR_Code + "','" + dcrAttendance.Rows[i].DCR_Attendance_Doctor_Id + "','" + dcrAttendance.Rows[i].Campaign_Code + "')>" + dcrAttendance.Rows[i].Campaign_Name + "</a></td>";
                }
                else {
                    attendanceHtml += "<td>" + dcrAttendance.Rows[i].Campaign_Name + "</td>";
                }

                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Activity_Name + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].MC_Remark + "</td>";
                attendanceHtml += "</tr>";
            }
            attendanceHtml += "</tbody></table>";
            $('#dvAttmcact').css('display', '');
            $('#dvAttmcact').html(attendanceHtml);

        }
    }
}

function BindAttendanceDoctorDetails(dcrAttendance) {
    debugger;
    if (dcrAttendance != null) {
        if (dcrAttendance.Rows.length > 0) {
            var attendanceHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>Doctor Visit Details</h3></div>";
            attendanceHtml += "<table id='tblAttendancecallact' style='width: 85%;' class='data display dataTable box'><thead><th>" + doctor_caption + " Region</th><th>" + doctor_caption + "</th><th>MDL/SVL#</th><th>Category</th><th>Speciality</th><th>Visit Mode/Time</th><th>Campaign Name</th><th>Call Objective</th><th>Business Status</th><th>Remarks</th></thead>";
            attendanceHtml += "<tbody>";
            for (var i = 0; i < dcrAttendance.Rows.length; i++) {
                var visitMode = dcrAttendance.Rows[i].Visit_Mode
                var visitTime = dcrAttendance.Rows[i].Visit_Time == null ? '' : dcrAttendance.Rows[i].Visit_Time.toUpperCase() + ' ';
                if (visitTime != null && visitTime != '' && visitTime != undefined) {
                    var visitTimeMode = visitTime.split(' ');
                    visitTime = visitTimeMode[0];
                }
                var timemode = visitTime.length > 0 ? (visitTime + visitMode) : visitMode.length > 0 ? visitMode : "AM";
                var campaignname = '';
                if (dcrAttendance.Rows[i].Campaign_Name == null || dcrAttendance.Rows[i].Campaign_Name == '') {
                    campaignname = '';
                } else {
                    campaignname = dcrAttendance.Rows[i].Campaign_Name;
                    // fnGetSurveyResponse(dcrAttendance.Rows[i].Survey_Id);
                }
                var remarks = '';
                if (dcrAttendance.Rows[i].Remarks_By_User == null || dcrAttendance.Rows[i].Remarks_By_User == '') {
                    remarks = '';
                }
                else {
                    remarks = dcrAttendance.Rows[i].Remarks_By_User;
                }
                var Callobj = '';
                if (dcrAttendance.Rows[i].Call_Objective_Name == null || dcrAttendance.Rows[i].Call_Objective_Name == '') {
                    Callobj = '';
                }
                else {
                    Callobj = dcrAttendance.Rows[i].Call_Objective_Name;
                }
                var statusname = '';
                if (dcrAttendance.Rows[i].Status_Name == null || dcrAttendance.Rows[i].Status_Name == '') {
                    statusname = '';
                }
                else {
                    statusname = dcrAttendance.Rows[i].Status_Name;
                }
                attendanceHtml += "<tr>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Doctor_Region_Name + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Doctor_Name + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].MDL_Number + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Category_Name + "</td>";
                attendanceHtml += "<td>" + dcrAttendance.Rows[i].Speciality_Name + "</td>";
                attendanceHtml += "<td>" + timemode + "</td>";
                attendanceHtml += "<td>" + campaignname + "</td>";
                attendanceHtml += "<td>" + Callobj + "</td>";
                attendanceHtml += "<td>" + statusname + "</td>";
                attendanceHtml += "<td>" + remarks + "</td>";
                attendanceHtml += "</tr>";
            }
            attendanceHtml += "</tbody></table>";
            $('#dvAttDoc').css('display', '');
            $('#dvAttDoc').html(attendanceHtml);

        }
    }
}
function fnBindV4AttendanceHospitalProductDetails(dcrProductJson) {
    debugger;
    if (dcrProductJson != null) {
        if (dcrProductJson.Rows.length > 0) {
            var productHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Hospital Sample / Promotional Item Details</h3></div>";
            productHtml += "<table id='tblProducts'  class='data display dataTable box' style='width:85%'><thead><th>Hospital Region</th><th>Hospital Name</th><th>Sample/Promotional item Name</th><th>Batch Number</th><th>Qty given</th></thead>";
            productHtml += "<tbody>";
            var hsptlname = new Array();
            var regname = new Array();
            for (var i = 0; i < dcrProductJson.Rows.length; i++) {
                var regionname = dcrProductJson.Rows[i].Region_Name == null ? '' : dcrProductJson.Rows[i].Region_Name;
                var hospitalname = dcrProductJson.Rows[i].Hospital_Name == null ? '' : dcrProductJson.Rows[i].Hospital_Name;
                var productName = dcrProductJson.Rows[i].Product_Name == null ? '' : dcrProductJson.Rows[i].Product_Name;
                var batchNumber = dcrProductJson.Rows[i].Batch_Number == null ? '' : dcrProductJson.Rows[i].Batch_Number;
                var quantityProvided = dcrProductJson.Rows[i].Quantity_Provided == null ? '' : dcrProductJson.Rows[i].Quantity_Provided;
                // var currentStcok = dcrProductJson.Rows[i].Current_Stock == null ? '0' : dcrProductJson.Rows[i].Current_Stock;
                // var brand = dcrProductJson.Rows[i].Brand_Name == null ? '0' : dcrProductJson.Rows[i].Brand_Name;
                //var specilaityName = dcrProductJson.Rows[i].Speciality_Name == null ? '' : dcrProductJson.Rows[i].Speciality_Name;
                //var detailed = dcrProductJson.Rows[i].Detailed == null ? '' : dcrProductJson.Rows[i].Detailed;
                //var isCpDoc = dcrProductJson.Rows[i].Is_CP_Doc == null ? '' : dcrProductJson.Rows[i].Is_CP_Doc;

                var match = 0;
                var matchche = 0;
                if (i != 0) {
                    match = regname.indexOf(regionname.trim());
                    if (match == -1) {
                        regname.push(regionname.trim());
                    }
                    matchdoc = hsptlname.indexOf(hospitalname.trim());
                    if (matchdoc == -1) {
                        hsptlname.push(hospitalname.trim());
                    }
                }
                productHtml += "<tr>";
                if (i == 0) {
                    regname.push(regionname.trim());
                    productHtml += "<td>" + regionname + "</td>";
                }
                else if (match != -1) {
                    if (matchdoc == -1) {
                        //productHtml += "<td>" + regionname + "</td>";
                        productHtml += "<td></td>";
                    }
                    else {
                        productHtml += "<td></td>";
                    }
                }
                else {
                    productHtml += "<td>" + regionname + "</td>";
                }
                if (i == 0) {
                    hsptlname.push(hospitalname.trim());
                    productHtml += "<td>" + hospitalname + "</td>";
                }
                else if (matchdoc != -1) {
                    if (match == -1) {
                        productHtml += "<td>" + hospitalname + "</td>";
                    }
                    else {
                        productHtml += "<td></td>";
                    }
                }
                else {
                    productHtml += "<td>" + hospitalname + "</td>";
                }
                productHtml += "<td>" + productName + "</td>";
                productHtml += "<td>" + batchNumber + "</td>";
                productHtml += "<td>" + quantityProvided + "</td>";

                productHtml += "</tr>";
            }
            productHtml += "</tbody></table>";
            $('#dvAttHospital').html(productHtml);

        }

    }
}
function fnBindV4DetailedProducts(dcrProductJson) {
    if (dcrProductJson != null) {
        if (dcrProductJson.Rows.length > 0) {
            var prodHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'> " + doctor_caption + "  Detailed Products</h3></div>";
            prodHtml += "<table id='tblDetailedProduct'  class='data display  box' style='width:85%'><thead><th>" + doctor_caption + "</th><th>Detailed Product</th></thead>";
            prodHtml += "<tbody>";
            for (var i = 0; i < dcrProductJson.Rows.length; i++) {
                var doctorName = dcrProductJson.Rows[i].Doctor_Name == null ? '' : dcrProductJson.Rows[i].Doctor_Name;
                var productName = dcrProductJson.Rows[i].Product_Name == null ? '' : dcrProductJson.Rows[i].Product_Name;

                prodHtml += "<tr>";
                prodHtml += "<td>" + doctorName + "</td>";
                prodHtml += "<td>" + productName + "</td>";
                prodHtml += "</tr>";
            }
            prodHtml += "</tbody></table>";
            $('#dvDetailedProduct').html(prodHtml);

        }
    }
}

function fnBindV4DoctorAccompanists(dcrDocAccson) {
    debugger;
    if (dcrDocAccson != null) {
        if (dcrDocAccson.Rows.length > 0) {
            var accHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>" + doctor_caption + " Accompanist Details</h3></div>";
            accHtml += "<table id='tblDocAcc'  class='data display box' style='width:85%'><thead><th>" + doctor_caption + "</th><th>Accompanist Name</th><th>Accompanist Region</th><th>Accompanist User type</th><th>Independent Doctor</th></thead>";
            accHtml += "<tbody>";
            for (var i = 0; i < dcrDocAccson.Rows.length; i++) {
                var doctorName = dcrDocAccson.Rows[i].Doctor_Name == null ? '' : dcrDocAccson.Rows[i].Doctor_Name;
                var accName = dcrDocAccson.Rows[i].Acc_User_Name == null ? '' : dcrDocAccson.Rows[i].Acc_User_Name;
                var accRegion = dcrDocAccson.Rows[i].Region_Name == null ? '' : dcrDocAccson.Rows[i].Region_Name;
                var accUserType = dcrDocAccson.Rows[i].Acc_User_Type_Name == null ? '' : dcrDocAccson.Rows[i].Acc_User_Type_Name;
                var indepDoct = dcrDocAccson.Rows[i].Is_Only_For_Doctor == 1 ? 'YES' : "NO";

                accHtml += "<tr>";
                accHtml += "<td>" + doctorName + "</td>";
                accHtml += "<td>" + accName + "</td>";
                accHtml += "<td>" + accRegion + "</td>";
                accHtml += "<td>" + accUserType + "</td>";
                accHtml += "<td>" + indepDoct + "</td>";
                accHtml += "</tr>";
            }
            accHtml += "</tbody></table>";
            $('#dvDoctorAcc').html(accHtml);

        }

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

function fnShowV4AccDoctor(obj) {
    debugger;
    if ($("#V4dvOverLay").css('display') == 'none') {
        $('#divV4AccDocDetail').html('')
        $('#divV4AccDocDetail').html(accV4HeaderTableString_g);
        var accName = $('#' + obj).html();
        var accStartTimeId = obj.replace(/AccPersonName/g, 'AccStartTime');
        var accEndTimeId = obj.replace(/AccPersonName/g, 'AccEndTime');
        var accTime = document.getElementById(accStartTimeId).innerHTML + "-" + document.getElementById(accEndTimeId).innerHTML;
        var userName = $('#spnuserName').html();
        var regionName = $('#spniregionName').html();
        var empName = $('#spniEmpName').html();
        var dcrDate = $("#spndate").html().split('-')[1] + "/" + $("#spndate").html().split('-')[0] + "/" + $("#spndate").html().split('-')[2];
        var dcrType = $("#spnTypeofDCR").html().replace('Work', '');
        var workplace = $('#spnPlaceWorked').html();
        var dcrEnterDate = $('#spndcrEnteredDate').html();
        var dcrStatus = $('#spnDCRStatus').html();
        var empnumber = $('#lbnEmpNumber').html();
        var userdesig = $('#lbndesignation').html();
        var divisionname = $('#lbnDivisionName').html();

        var travlePlaces = "";
        var cate = dcrdejson_g.Tables[0].Rows[0].Category;
        var head = dcrdejson_g.Tables[0].Rows[0];

        if (cate.toUpperCase() == "HQ") {
            travlePlaces = head.From_Place + "<br />" + head.To_Place + "<br />";
        }
        else {
            var r = dcrdejson_g.Tables[1].Rows;
            for (var i = 0; i < dcrdejson_g.Tables[1].Rows.length; i++) {
                travlePlaces += r[i].From_Place + "<br />" + r[i].To_Place;
            }
        }

        $('#spnpuserName').html(userName);
        $('#spnpEmpName').html(empName);
        $('#spnpRegionName').html(regionName);
        $('#spnDCRDate').html(dcrDate);
        $('#spnDCRType').html(dcrType);
        $('#spnpDCRStatus').html(dcrStatus);
        $('#spnWorkPlace').html(workplace);
        $('#spnDCRentedDate').html(dcrEnterDate);
        $('#tddivisionName').html(divisionname);
        $('#accPopUpName').html(accName);
        $('#accPopUpTime').html(accTime);
        $('#spnpEmpNumber').html(empnumber);
        $('#spnpDesignation').html(userdesig);
        var dcrcode = $('#dcrcode').val();
        $("#V4dvOverLay").overlay().load();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetAccompanistVisitedDoctors',
            data: "DCR_User_Code=" + userCode + "&Acc_User_Name=" + accName + "&DCR_User_Name=" + userName
                + "&DCR_Actual_Date=" + dcrDate,
            success: function (response) {
                var accHTML = $('#divV4AccDocDetail').html() + response;
                $('#divV4AccDocDetail').html(accHTML);
                fnAccDetail(accName, dcrcode);
            },
            error: function () {
                fnMsgAlert('info', 'DCR Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }

}

function fnShowV4DetailedProducts(rI, docCode, t) {
    $('#divDetailPrdDetail').html('')
    $('#divDetailPrdDetail').html(detailProdString_g);

    var docName = "";
    var docmdl = "";
    var cate = ""
    var spec = ""
    var dcrDate = $("#spndate").html().split('-')[1] + "/" + $("#spndate").html().split('-')[0] + "/" + $("#spndate").html().split('-')[2] + "^";
    //var dcr_user_Code = $("#hdnUserCode").val();
    var dcrDates = "";
    var userName = $('#spnuserName').html();
    var regionName = $('#spniregionName').html();
    var empName = $('#spniEmpName').html();

    if (t == "acc") {
        docName = $('#accdocname_' + rI).html();
        docmdl = $('#accdocmdl_' + rI).html();
        cate = $('#accdocCategory_' + rI).html();
        spec = $('#accdocspec_' + rI).html();

    }
    else {
        docName = $('#docname_' + rI).html();
        docmdl = $('#docmdl_' + rI).html();
        cate = $('#docCategory_' + rI).html();
        spec = $('#docspec_' + rI).html();
    }
    spec = spec.split('<')[0];

    $('#spnduserName').html(userName);
    $('#spndEmpName').html(empName);
    $('#spndRegionName').html(regionName);
    $('#spndDocName').html(docName);
    $('#spndMDL').html(docmdl);
    $('#spndSpeciality').html(spec);
    $('#spndCategory').html(cate);

    $("#dvDetailedProductOverLay").overlay().load();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDetailedProductsAndInputsPerDoctor',
        data: "doctor_Code=" + docCode + "&doctor_Name=" + $.trim(docName) + "&user_Code=" + userCode
            + "&DCR_Actual_Dates=" + $.trim(dcrDate) + "&speciality_Name=" + $.trim(spec),
        success: function (response) {
            var htmlvalue = $('#divDetailPrdDetail').html() + response;
            $('#divDetailPrdDetail').html(htmlvalue);
        },
        error: function () {
            fnMsgAlert('info', 'DCR Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnsetDCRUnapprove() {
    if ($('#txtUnapprovalReason').val().length == 0) {
        fnMsgAlert('info', 'DCR Report', 'Please enter the reason for unapprove.');
        return false;
    }

    if ($('#txtUnapprovalReason').val().length > 500) {
        fnMsgAlert('info', 'DCR Report', 'Reason for unapproval should not exceed 500 characters.');
        return false;
    }
    if (!fnCheckRemarksSpecialChar($('#txtUnapprovalReason'))) {
        return false;
    }
    var calcFieldsStatus = fnGetPrivilegeValue("CALC_FIELD_STATUS", "APPROVED");
    var reason = $('#txtUnapprovalReason').val();
    $.ajax({
        type: 'POST',
        data: 'dcrDate=' + dcrActualDate + '&unapprovealReason=' + reason + "&flag=" + flag_g + "&calcFieldStatus=" + calcFieldsStatus,
        url: '../HiDoctor_Activity/DCRV4InstantReport/SetDCRUnapprove',
        success: function (response) {
            // we have the response
            if (response == "SUCCESS") {
                fnRedirectToCalendar();
            }
            else {
                fnMsgAlert('info', 'DCR Report', response);
                return false;
            }
        },
        error: function (e) {
            alert("Eror" + e);
        }
    });

}

function fnRedirectToCalendar() {
    $('#main').load('../HiDoctor_Activity/DCRCalendar/Index');
}

//*********************************** ACTIVITY SUMMARY ************************//

function GetActivitySummary(dcrDate, today) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/ActivitySummary/GetActicitySummary',
        data: "dcrDate=" + dcrDate,
        success: function (jsData) {

            if (jsData != '') {
                var actSummary = eval('(' + jsData + ')');
                //actSummary.Tables[0].Rows[0]["Category_Code"]
                var tblCont = "";
                var totalDoc = 0;

                if (!(actSummary.Tables === undefined) && actSummary.Tables.length > 0) {
                    if (!(actSummary.Tables[1] === undefined) && actSummary.Tables[1].Rows.length > 0 && parseInt(actSummary.Tables[1].Rows[0]["Field_Days"]) > 0) { // if field days >0
                        if (!(actSummary.Tables[0] === undefined) && actSummary.Tables[0].Rows.length > 0) {
                            tblCont += "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Activity Details</h3></div>";
                            tblCont += "<table cellspacing='0' cellpadding='0' id='tblActivityIR' class='data display dataTable box' width='85%'>";
                            tblCont += "<thead>";
                            tblCont += "<tr><th>F.W.Day No.</th>";
                            tblCont += "<th>Calls Made</th>";
                            tblCont += "<th>Upto date Call Avg.</th>";
                            tblCont += "</tr>";
                            tblCont += "</thead><tbody>";
                            for (var i = 0; i < actSummary.Tables[0].Rows.length; i++) {
                                var catJson = jsonPath(actSummary.Tables[2], "$.Rows[?(@.Category_Code=='" + actSummary.Tables[0].Rows[i]["Category_Code"] + "')]");
                                tblCont += "<tr>";
                                if (catJson != false && catJson.length > 0) {
                                    tblCont += "<td>" + catJson[0]["Category_Name"].toString() + " Dr. Calls</td>";
                                }
                                else {
                                    tblCont += "<td>Other Dr. Calls</td>";
                                }
                                tblCont += "<td>" + actSummary.Tables[0].Rows[i]["Doctor_Count"] + "</td>";
                                totalDoc += parseInt(actSummary.Tables[0].Rows[i]["Doctor_Count"]);
                                tblCont += "<td>" + (parseFloat(actSummary.Tables[0].Rows[i]["Doctor_Count"]) / parseFloat(actSummary.Tables[1].Rows[0]["Field_Days"])).toFixed(2) + "</td>";
                                tblCont += "</tr>";
                            }
                            tblCont += "<tr>";
                            tblCont += "<td>Total</td>";
                            tblCont += "<td>" + totalDoc + "</td>";
                            tblCont += "<td>" + (parseFloat(totalDoc) / parseFloat(actSummary.Tables[1].Rows[0]["Field_Days"])).toFixed(2) + "</td>";
                            tblCont += "</tr>";
                        }
                        tblCont += "</tbody></table>";
                        $("#divAct").html(tblCont);
                        $('#tblActivityIR').dataTable({
                            "bFilter": false,
                            "bPaginate": false,
                            "bInfo": false,
                            "bSort": false
                        });
                        return;
                    }
                    else {
                        tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>No Doctor Call Data found</h3></div>";
                        $("#divAct").html(tblCont);
                        return;
                    }
                }

                else {
                    tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>No Doctor Call Data found</h3></div>";
                    $("#divAct").html(tblCont);
                    return;
                }

            }
            else {
                var tblCont = "";
                tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>No Doctor Call Data found</h3></div>";
                $("#divAct").html(tblCont);
                return;
            }
        }
    });
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/ActivitySummary/GetActicitySummaryMissedDoctor',
        data: "dcrDate=" + dcrDate,
        success: function (jsData) {
            if (jsData != '') {
                var missedDoc = eval('(' + jsData + ')');
                //missedDoc.Rows[0]["DCR_Date"]
                var tblCont = "";
                if (missedDoc.Rows.length > 0) {
                    tblCont = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Missed Doctor Details</h3></div>";
                    tblCont += "<table cellspacing='0' cellpadding='0' id='tblMissedDoc' class='data display dataTable box' width='85%'>";
                    tblCont += "<thead>";

                    tblCont += "<tr><th colspan='5' align='center'>Missed Calls Till: " + today + " </th></tr>";

                    tblCont += "<tr><th>Doctor Name</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>MDL Number</th>";
                    tblCont += "<th>Doctor Category</th>";
                    tblCont += "<th>Visit Missed Date</th>";
                    tblCont += "</tr>";
                    tblCont += "</thead><tbody>";

                    for (var j = 0; j < missedDoc.Rows.length; j++) {
                        tblCont += "<tr>";
                        tblCont += "<td>" + missedDoc.Rows[j]["Doctor_Name"] + "</td>";
                        tblCont += "<td>" + missedDoc.Rows[j]["Speciality_Name"] + "</td>";
                        tblCont += "<td>" + missedDoc.Rows[j]["MDL_Number"] + "</td>";
                        tblCont += "<td>" + missedDoc.Rows[j]["Category_Name"] + "</td>";
                        tblCont += "<td>" + missedDoc.Rows[j]["DCR_Date"] + "</td>";
                        tblCont += "</tr>";
                    }
                    tblCont += "</tbody></table>";
                    $("#divMissed").html(tblCont);
                    $('#tblMissedDoc').dataTable({
                        "bFilter": false,
                        "bPaginate": true,
                        "sPaginationType": "full_numbers",
                        "bInfo": false,
                        "bSort": false
                    });
                    return;
                }
                else {
                    tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>You have no missed doctors.</h3></div>";
                    $("#divMissed").html(tblCont);
                    return;
                }
            }
            else {
                var tblCont = "";
                tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>You have no missed doctors.</h3></div>";
                $("#divMissed").html(tblCont);
                return;
            }
        }
    });
}
//*********************************** End - ACTIVITY SUMMARY ************************//

//******************************DAILY CALL PLANNER **********************************//


function fnGetDailyCallPlanner() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4DailyCallPlanner/GetDailyCallPlanner',
        data: "dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != '') {
                var dailyPlan = eval('(' + jsData + ')');
                //dailyPlan.Tables[0].Rows.length

                var tblCont = "";
                if (!(dailyPlan.Rows === undefined) && dailyPlan.Rows.length > 0) {
                    tblCont += "<table cellspacing='0' cellpadding='0' id='tblDailyPlannerHeader' class='data display dataTable box' width='85%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr>";
                    tblCont += "<th>Employee Name : " + dailyPlan.Rows[0]["Employee_Name"] + "</th>";
                    tblCont += "<th>Category : " + dailyPlan.Rows[0]["Category"] + "</th>";
                    tblCont += "<th>Beat/Patch : " + dailyPlan.Rows[0]["CP_Name"] + "</th>";
                    tblCont += "<th>Distance : " + dailyPlan.Rows[0]["Distance"] + "</th>";
                    tblCont += "</tr>";
                    tblCont += "<tr>";
                    tblCont += "<th>Working with :" + dailyPlan.Rows[0]["Accomp_Name"] + "</th>";
                    tblCont += "<th>Contact point :" + dailyPlan.Rows[0]["Meeting_Point"] + "</th>";
                    tblCont += "<th>Time :" + dailyPlan.Rows[0]["Meeting_Time"] + "</th>";
                    tblCont += "<th></th>";
                    tblCont += "</tr></thead>";
                    tblCont += "</table>";
                    $("#divDailyCallHeader").html(tblCont);
                    return;
                }
                else {
                    var dateFormate = $("#hdnDCRDate").val().split('-')[2] + '/' + $("#hdnDCRDate").val().split('-')[1] + '/' + $("#hdnDCRDate").val().split('-')[0];
                    tblCont = "<div><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>No TP for " + dateFormate + "</h3></div>";
                    $("#divDailyCallHeader").html(tblCont);
                    return;
                }
            }
            else {
                var tblCont = "";
                var dateFormate = $("#hdnDCRDate").val().split('-')[2] + '/' + $("#hdnDCRDate").val().split('-')[1] + '/' + $("#hdnDCRDate").val().split('-')[0];
                tblCont = "<div><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>No TP for " + dateFormate + "</h3></div>";
                $("#divDailyCallHeader").html(tblCont);
                return;
            }
        }
    });
}

function fnGetDailyCallPlannerDoctorDetails(financeYear) {
    $("#hdnYTD").val(financeYear);
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4DailyCallPlanner/GetDailyCallPlannerDoctorDetails',
        data: "dcrDate=" + $("#hdnDCRDate").val() + "&YTDType=" + financeYear,
        success: function (jsData) {

            if (jsData != '') {

                var dailyDoc = eval('(' + jsData + ')');

                var content = "";
                if (!(dailyDoc.Tables === undefined) && dailyDoc.Tables.length > 0 && dailyDoc.Tables[0].Rows.length > 0) {
                    content = "<table cellspacing='0' cellpadding='0' width='85%' class='data display datatable' id='tblDoctorDetails'>";
                    content += "<thead><tr>";
                    content += "<th rowspan='2'>MDL/SVL</th>";
                    content += "<th rowspan='2'>Doctor Name</th>";
                    content += "<th rowspan='2'>Speciality</th>";
                    content += "<th rowspan='2'>Category</th>";
                    content += "<th rowspan='2'>Last Visited Date</th>";
                    content += "<th colspan='2'>Brands prescribed</th>";
                    content += "<th rowspan='2'>Focus brands</th>";
                    content += "<th rowspan='2'>Sample/Promotional item given in last month</th>";
                    content += "<th rowspan='2'>Non Samples given in last month</th>";
                    content += "<th rowspan='2'>Non Samples given till Date(YTD)</th>";
                    content += "</tr>";
                    content += "<tr>";
                    content += "<th>Our</th>";
                    content += "<th>Other</th>";
                    content += "</tr>";
                    content += "</thead><tbody>";

                    for (var i = 0; i < dailyDoc.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + dailyDoc.Tables[0].Rows[i]["MDL_Number"] + "</td>";
                        content += "<td>" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "</td>";
                        content += "<td>" + dailyDoc.Tables[0].Rows[i]["Speciality_Name"] + "</td>";
                        content += "<td>" + dailyDoc.Tables[0].Rows[i]["Category_Name"] + "</td>";

                        // Last Visited Date
                        var lstJson = jsonPath(dailyDoc.Tables[6], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (lstJson != false) {
                            content += "<td>" + lstJson[0]["Last_Visited"] + "</td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        //Our and other brand count
                        var brandJson = jsonPath(dailyDoc.Tables[5], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (brandJson != false) {
                            content += "<td><a id='our_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "'  onclick='fnGetOurBrandProducts(this)'>" + brandJson[0]["Our_Count"] + "</a></td>";
                            content += "<td><a id='Comp_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "'  onclick='fnGetCompBrandProducts(this)'>" + brandJson[0]["Comp_Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                            content += "<td></td>";
                        }

                        // from doctor product mapping
                        var focusJson = jsonPath(dailyDoc.Tables[1], "$.Rows[?(@.Customer_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (focusJson != false) {
                            content += "<td><a id='doc_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "' onclick='fnDoctorProductPopUp(this)'>" + focusJson[0]["Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        //Inputs / Samples given in last month(Count)
                        var samJson = jsonPath(dailyDoc.Tables[2], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (samJson != false) {
                            content += "<td><a id='samp_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "' onclick='fnGetGivenProducts(this)'>" + samJson[0]["Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        //Non Samples given in last month(Count)
                        var nonsamJson = jsonPath(dailyDoc.Tables[3], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (nonsamJson != false) {
                            content += "<td><a id='nonsamp_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "'  onclick='fnGetGivenProducts(this)'>" + nonsamJson[0]["Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        //Non Samples given ytd
                        var nonsamYTDJson = jsonPath(dailyDoc.Tables[4], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (nonsamYTDJson != false) {
                            content += "<td><a id='nonsampYTD_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "' onclick='fnGetNonSampleGivenYTD(this)'>" + nonsamYTDJson[0]["Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#divDailyCallDetail").html(content);
                    $('#tblDoctorDetails').dataTable({
                        //"bPaginate": false, 
                        "sPaginationType": "full_numbers",
                        "bFilter": true,
                        "bSearchable": true,
                        "bSort": false, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                    $("#dvShowDocDetail").css('display', '');
                    return;
                }
            }
        }
    });
}


function fnDoctorProductPopUp(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4DailyCallPlanner/GetDoctorProductMappingDetail',
        data: "customerCode=" + (id.id).split('_')[1],
        success: function (jsData) {
            if (jsData != "") {
                var docProd = eval('(' + jsData + ')');
                if (!(docProd.Rows === undefined) && docProd.Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Product Type</th>";
                    content += "<th>Yield</th>";
                    content += "<th>Potential</th>";
                    content += "</tr></thead><tbody>";
                    for (var i = 0; i < docProd.Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + docProd.Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + docProd.Rows[i]["Product_Type_Name"] + "</td>";
                        content += "<td>" + docProd.Rows[i]["Support_Quantity"] + "</td>";
                        content += "<td>" + docProd.Rows[i]["Potential_Quantity"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopup").html(content);
                    ShowModalPopup('dvDailyPopup');
                }
            }
        }
    });
}

function fnGetGivenProducts(id) {
    var type = "";
    if ((id.id).split('_')[0] == "samp") { type = "SAMPLE"; }
    else { type = "NONSAMPLE"; }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4DailyCallPlanner/GetProductGivenInLastMonth',
        data: "customerCode=" + (id.id).split('_')[1] + "&type=" + type + "&dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Rows === undefined) && product.Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Given Date</th>";
                    content += "<th>Quantity given</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + product.Rows[i]["DCR_Actual_Date"] + "</td>";
                        content += "<td>" + product.Rows[i]["Quantity_Provided"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopup").html(content);
                    ShowModalPopup('dvDailyPopup');
                }
            }
        }
    });
}

function fnGetNonSampleGivenYTD(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4DailyCallPlanner/GetNonSampleGivenYTD',
        data: "customerCode=" + (id.id).split('_')[1] + "&YTDType=" + $("#hdnYTD").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Rows === undefined) && product.Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Given Date</th>";
                    content += "<th>Quantity given</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + product.Rows[i]["DCR_Actual_Date"] + "</td>";
                        content += "<td>" + product.Rows[i]["Quantity_Provided"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopup").html(content);
                    ShowModalPopup('dvDailyPopup');
                }
            }
        }
    });
}

function fnGetOurBrandProducts(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4DailyCallPlanner/GetOurBrandProducts',
        data: "customerCode=" + (id.id).split('_')[1] + "&dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Rows === undefined) && product.Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Rows[i]["Product_Name"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopup").html(content);
                    ShowModalPopup('dvDailyPopup');
                }
            }
        }
    });
}

function fnGetCompBrandProducts(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4DailyCallPlanner/GetCompetitorBrandProducts',
        data: "customerCode=" + (id.id).split('_')[1] + "&dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Rows === undefined) && product.Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Competitor Product Name</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Rows[i]["Own_Product_Name"] + "</td>";
                        content += "<td>" + product.Rows[i]["Competitor_Product_Name"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopup").html(content);
                    ShowModalPopup('dvDailyPopup');
                }
            }
        }
    });
}

function fnLoadLeaveDeatils() {
    var tblCont = "";
    var dateFormate = $("#hdnDCRDate").val().split('-')[2] + '/' + $("#hdnDCRDate").val().split('-')[1] + '/' + $("#hdnDCRDate").val().split('-')[0];
    tblCont = "<div ><h3 style='width: 100%;margin:0px auto;padding-top: 20px;'>You have planned leave on " + dateFormate + "</h3></div>";
    $("#divDailyCallHeader").html(tblCont);
    return;
}

function fnLoadHolidayDetail() {
    var tblCont = "";
    var dateFormate = $("#hdnDCRDate").val().split('-')[2] + '/' + $("#hdnDCRDate").val().split('-')[1] + '/' + $("#hdnDCRDate").val().split('-')[0];
    tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>" + dateFormate + " is Holiday for you</h3></div>";
    $("#divDailyCallHeader").html(tblCont);
    return;
}

function fnLoadAttendance() {
    var tblCont = "";

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4DailyCallPlanner/GetAttendanceDetail',
        data: "dcrDate=" + $("#hdnDCRDate").val(),
        success: function (result) {
            if (result != "") {
                var dateFormate = $("#hdnDCRDate").val().split('-')[2] + '/' + $("#hdnDCRDate").val().split('-')[1] + '/' + $("#hdnDCRDate").val().split('-')[0];
                tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>You have attendance on " + dateFormate + ".(" + result + ")</h3></div>";
                $("#divDailyCallHeader").html(tblCont);
                return;
            }
        }
    });
}

//***************************** END - DAILY CALL PLANNER ****************************//
function fnGetDoctorAccompanist(id) {
    var dcr_date = "";
    var doctor_Visit_Code = ""; var mdlno = ""; var doc_name = ""; var category = "";
    var details = $("#divDocAccDetails_" + id).text().trim().split('$');
    dcr_date = details[0];
    doctor_Visit_Code = details[1];
    mdlno = details[2];
    doc_name = details[3];
    category = details[4];
    var type = "doctor";
    $("#dvAccOverLay").overlay().load();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorVisitAccName',
        data: "dcr_date=" + dcr_date + "&doctor_Visit_Code=" + doctor_Visit_Code + "&user_code=" + userCode + "&type=" + type,
        success: function (response) {
            var header = doc_name + ", " + mdlno + ", " + category;
            $("#doc_details").text(header);
            $("#divAccDocDetail_Call").html(response);
            $("#AccompanistsDetails").prop('class', 'acc_doctor_visit');
        },
        error: function () {
            fnMsgAlert('info', 'DCR Consolidate', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
function fnGetChemistAccompanist(id) {
    var dcr_date = "";
    var doctor_Visit_Code = ""; var mdlno = ""; var doc_name = ""; var category = "";
    var details = $("#divCvAccDetails_" + id).text().trim().split('$');
    dcr_date = details[0];
    doctor_Visit_Code = details[1];
    mdlno = details[2];
    doc_name = details[3];
    category = details[4];
    var type = "chemist";
    $("#dvAccOverLay").overlay().load();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorVisitAccName',
        data: "dcr_date=" + dcr_date + "&doctor_Visit_Code=" + doctor_Visit_Code + "&user_code=" + userCode + "&type=" + type,
        success: function (response) {
            var header = doc_name + ", " + mdlno;
            $("#doc_details").text(header);
            $("#divAccDocDetail_Call").html(response);
            $("#AccompanistsDetails").prop('class', 'acc_doctor_visit');
        },
        error: function () {
            fnMsgAlert('info', 'DCR Consolidate', 'Error.');
            HideModalPopup("dvloading");
        }
    });
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
                str += "<label style='margin-left: 35px;padding: 10px;'>No of Month Tracked : " + response[0].No_Of_Months + "</label>";
                str += "<table id='tblCME' style='width: 85%;' class='data display dataTable box'><thead>";
                str += "<th>Product Name</th><th>Current Sales</th><th>ExpectedSales</th></thead>";
                str += "<tbody>";
                for (var i = 0; i < response.length; i++) {
                    str += "<tr>";
                    str += "<td>" + response[i].Product_Name + "</td><td>" + response[i].Current_Sales + "</td><td>" + response[i].Expected_Sales + "</td>"
                    str += "</tr>";

                }
                str += "</tbody></table>";
                $('#dvCMEDetails').css('display', '');
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