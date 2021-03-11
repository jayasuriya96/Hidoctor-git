




function fnUserPerDayreport() {
    debugger;


    $('#dvHeader').hide();
    $('#dvsfcdetails').hide();
    $('#dvAcc').hide();
    $('#dvOwnDoctors').hide();
    $('#dvAccDoctors').hide();
    $('#dvProducts').hide();
    $('#dvDetailedProductsDetails').hide();
    $('#dvRCPA').hide();
    $('#dvChemist').hide();
    $('#dvFollowUps').hide();
    $('#dvAttchments').hide();
    $('#dvExpense').hide();
    $('#dvStockiest').hide();
    $('#dvAttendance').hide();
    $('#dvLeave').hide();



    $.ajax({

        type: 'GET',
        url: "http://localhost:14829/UserPerday/DCR/" + Company_Code + "/" + userCode + "/" + dcrDate,

        success: function (response) {
            debugger;
            if (response != "") {
                HeaderReponse = response;
                fnGetDoctorVisitDetails();
            }
            else {

                $('#dvUserPerday').val('');
                $('#dvUserPerday').hide();
                var empty = 'NO DCR FOUND';
                $('#dvEmpty').html(empty);
                $('#dvEmpty').show();
            }

        },
    });
}

function fnGetDoctorVisitDetails() {
    debugger;
    $.ajax({

        type: 'Get',
        url: "http://localhost:14829/UserPerday/DCRDoctorVisit/" + Company_Code + "/" + userCode + "/" + dcrDate,
        async: false,
        success: function (response) {
            debugger;
            if (response != "") {
                $("#StartDate").text(dcrDate);
                DoctorReponse = response;
            }
        },
    });
    fnBindHeaderDetails();
}

function fnBindHeaderDetails() {

    debugger;
    if (HeaderReponse != null) {
        $("#userName").text(HeaderReponse[0].DCRInfo.UserName);

        for (var h = 0; h < HeaderReponse.length; h++) {
            $('#spnLegend').html("USER PER DAY REPORT for : " + HeaderReponse[h].DCRInfo.UserName + " DATE : " + HeaderReponse[h].DCRInfo.LocalDCRActualDate);

            var headerHTML = "<div class='gridHeader'><span class='tbl_heading'>Header Details</span></div>";
            headerHTML += "<table id='tblheaderdetail' class='table table-striped details'>";
            headerHTML += "<thead class='reportHeader'>";
            headerHTML += "<th>Type of DCR</th>";
            headerHTML += "<th>CP Name</th>";
            headerHTML += "<th>Category</th>";
            headerHTML += "<th>Place Worked</th>";
            headerHTML += "<th>Start Time</th>";
            headerHTML += "<th>End Time</th>";
            headerHTML += "<th>DCR Status</th>";
            headerHTML += "<th>DCR Common Remarks</th>";
            headerHTML += "<th>Approved /Unapproved By</th>";
            headerHTML += "<th>Approved /Unapproved Date</th>";
            headerHTML += "<th>Approval/Unapproval Reason</th>";
            headerHTML += "</thead>";
            headerHTML += "<tbody>";

            if (HeaderReponse[h].DCRInfo.ActivityFlag == "F") {
                activityflag = "Field";
            }
            else if (HeaderReponse[h].DCRInfo.ActivityFlag == "L") {
                activityflag = "Leave";
            }
            else if (HeaderReponse[h].DCRInfo.ActivityFlag == "A") {
                activityflag = "Attendence";
            }

            var CPName = HeaderReponse[h].DCRInfo.CPName == null ? '' : HeaderReponse[h].DCRInfo.CPName;
            var WorkCategory = HeaderReponse[h].DCRInfo.WorkCategoryName == null ? '' : HeaderReponse[h].DCRInfo.WorkCategoryName;
            var PlaceWorked = HeaderReponse[h].DCRInfo.PlaceWorked == null ? '' : HeaderReponse[h].DCRInfo.PlaceWorked;
            var StatusName = HeaderReponse[h].DCRInfo.DCRStatusName == null ? '' : HeaderReponse[h].DCRInfo.DCRStatusName;
            var StartTime = HeaderReponse[h].DCRInfo.StartTime == null ? '' : HeaderReponse[h].DCRInfo.StartTime;
            var EndTime = HeaderReponse[h].DCRInfo.EndTime == null ? '' : HeaderReponse[h].DCRInfo.EndTime;
            var ApprovedBy = HeaderReponse[h].DCRInfo.DCRApprovalCycle[0].ApprovedBy == null ? '' : HeaderReponse[h].DCRInfo.DCRApprovalCycle[0].ApprovedBy;
            var ApprovedDate = HeaderReponse[h].DCRInfo.DCRApprovalCycle[0].ApprovedDate == null ? '' : HeaderReponse[h].DCRInfo.DCRApprovalCycle[0].ApprovedDate;
            var UnapprovalReason = HeaderReponse[h].DCRInfo.DCRApprovalCycle[0].UnapprovalReason == null ? '' : HeaderReponse[h].DCRInfo.DCRApprovalCycle[0].UnapprovalReason;
            var Remarks = HeaderReponse[h].DCRInfo.Remarks == null ? '' : HeaderReponse[h].DCRInfo.Remarks;
            var EnteredDate = HeaderReponse[h].DCRInfo.LocalDCREnteredDate == null ? '' : HeaderReponse[h].DCRInfo.LocalDCREnteredDate;
            var EmployeeName = HeaderReponse[h].DCRInfo.EmployeeName == null ? '' : HeaderReponse[h].DCRInfo.EmployeeName;
            var DivisionName = HeaderReponse[h].DCRInfo.DivisionDetails[0].DivisionName == null ? '' : HeaderReponse[h].DCRInfo.DivisionDetails[0].DivisionName;
            var DCRStatus = HeaderReponse[h].DCRInfo.DCRStatusName == null ? '' : HeaderReponse[h].DCRInfo.DCRStatusName;

            if (activityflag == "Field") {
                headerHTML += "<tr>";
                headerHTML += "<td><span id='spnTypeofDCR'>Field</span><span id='spndcrversion' style='display:none'>" + activityflag + "</span></td>";
                headerHTML += "<td><span id='spnCpName'>" + CPName + "</span></td>";
                headerHTML += "<td><span id='spnCategory'>" + WorkCategory + "</span></td>";
                headerHTML += "<td><span id='spnPlaceWorked'>" + PlaceWorked + "</span></td>";
                headerHTML += "<td><span id='spnStartTime'>" + StartTime + "</span></td>";
                headerHTML += "<td><span id='spnEndTime'>" + EndTime + "</span></td>";
                headerHTML += "<td><span id='spnEndTime'>" + DCRStatus + "</span></td>";
                headerHTML += "<td><span id='spnDCRStatus'>" + Remarks + "</span></td>";
                headerHTML += "<td><span id='spnApprovedby'>" + ApprovedBy + "</span></td>";
                headerHTML += "<td><span id='spnApproveddate'>" + ApprovedDate + "</span></td>";
                headerHTML += "<td><span id='spnUnapprovalreason'>" + UnapprovalReason + "</span><span id='spndcrEnteredDate' style='display: none'> " + EnteredDate + "</span><span id='spnEmpName' style='display: none'>" + EmployeeName + "</span><span id='lbnDivisionName' style='display: none'>" + DivisionName + "</span></td>";
                headerHTML += "</tr>";

                headerHTML += "</tbody></table>";
                $('#dvHeader').html(headerHTML);
                $('#dvHeader').show();
            }
            else if (activityflag == "Attendence") {
                headerHTML += "<tr>";
                headerHTML += "<td><span id='spnTypeofDCR'>Attendance</span><span id='spndcrversion' style='display:none'>" + dcrVersion + "</span></td>";
                headerHTML += "<td><span id='spnCpName'>N/A</span></td>";
                headerHTML += "<td><span id='spnCategory'>" + WorkCategory + "</span></td>";
                headerHTML += "<td><span id='spnPlaceWorked'>" + PlaceWorked + "</span></td>";
                headerHTML += "<td><span id='spnStartTime'>" + StartTime + "</span></td>";
                headerHTML += "<td><span id='spnEndTime'>" + EndTime + "</span></td>";
                headerHTML += "<td><span id='spnDCRStatus'>" + DCRStatus + "</span></td>";
                headerHTML += "<td><span id='spnDCRStatus'>" + Remarks + "</span></td>";
                headerHTML += "<td><span id='spnApprovedby'>" + ApprovedBy + "</span></td>";
                headerHTML += "<td><span id='spnApproveddate'>" + ApprovedDate + "</span></td>";
                headerHTML += "<td><span id='spnUnapprovalreason'>" + UnapprovalReason + "</span><span id='spndcrEnteredDate' style='display: none'> " + EnteredDate + "</span><span id='spnEmpName' style='display: none'>" + EmployeeName + "</span><span id='lbnDivisionName' style='display: none'>" + DivisionName + "</span></td>";
                headerHTML += "</tr>";

                headerHTML += "</tbody></table>";
                $('#dvHeader').html(headerHTML);
                $('#dvHeader').show();
            }



            //BIND SFC DETAILS
            if (HeaderReponse[h].DCRInfo.DCRTravelledPlaces != null) {
                var SFCdetails = "<div class='gridHeader'><span class='tbl_heading'>SFC Details</span></div>";
                SFCdetails += "<table id='tblSFC'  class='table table-striped details'><thead class='reportHeader'><th>FromPlace </th><th>To Place</th><th>Distance</th><th>Travel Mode</th></thead>";
                SFCdetails += "<tbody>";
                for (var i = 0; i < HeaderReponse[h].DCRInfo.DCRTravelledPlaces.length; i++) {
                    var FromPlace = HeaderReponse[h].DCRInfo.DCRTravelledPlaces[i].FromPlace == null ? '' : HeaderReponse[h].DCRInfo.DCRTravelledPlaces[i].FromPlace;
                    var ToPlace = HeaderReponse[h].DCRInfo.DCRTravelledPlaces[i].ToPlace == null ? '' : HeaderReponse[h].DCRInfo.DCRTravelledPlaces[i].ToPlace;
                    var Distance = HeaderReponse[h].DCRInfo.DCRTravelledPlaces[i].Distance == null ? '' : HeaderReponse[h].DCRInfo.DCRTravelledPlaces[i].Distance;
                    var TravelMode = HeaderReponse[h].DCRInfo.DCRTravelledPlaces[i].TravelMode == null ? '' : HeaderReponse[h].DCRInfo.DCRTravelledPlaces[i].TravelMode;


                    SFCdetails += "<tr>";
                    SFCdetails += "<td id='FromPlace_" + i + "'>" + FromPlace + "</td>";
                    SFCdetails += "<td id='ToPlace_" + i + "'>" + ToPlace + "</td>";
                    SFCdetails += "<td id='Distance_" + i + "'>" + Distance + "</td>";
                    SFCdetails += "<td id='dTravelMode_" + i + "'>" + TravelMode + "</td>";
                    SFCdetails += "</tr>";
                }

                SFCdetails += "</tbody></table>";
                $('#dvsfcdetails').html(SFCdetails);
                $('#dvsfcdetails').show();

            }

            //BIND ACCOMPANIST
            if (HeaderReponse[h].DCRInfo.DCRAccompanists.length > 0) {
                var Accomp = "<div class='gridHeader'><span class='tbl_heading'>Accompanist Details</span></div>";
                Accomp += "<table id='tblAcc'  class='table table-striped details'><thead class='reportHeader'><th>Accompanist </th><th>Start Time</th><th>End Time</th></thead>";
                Accomp += "<tbody>";
                for (var i = 0; i < HeaderReponse[h].DCRInfo.DCRAccompanists.length; i++) {
                    var Accompname = HeaderReponse[h].DCRInfo.DCRAccompanists[i].AccUserName == null ? '' : HeaderReponse[h].DCRInfo.DCRAccompanists[i].AccUserName;
                    var startTime = HeaderReponse[h].DCRInfo.DCRAccompanists[i].AccStartTime == null ? '' : HeaderReponse[h].DCRInfo.DCRAccompanists[i].AccStartTime;
                    var endTime = HeaderReponse[h].DCRInfo.DCRAccompanists[i].AccEndTime == null ? '' : HeaderReponse[h].DCRInfo.DCRAccompanists[i].AccEndTime;
                    Accomp += "<tr>";
                    Accomp += "<td id='AccompName_" + i + "'>" + Accompname + "</td>";
                    Accomp += "<td id='startTime_" + i + "'>" + startTime + "</td>";
                    Accomp += "<td id='endTime_" + i + "'>" + endTime + "</td>";
                }
                Accomp += "</tbody></table>";

                $('#dvAcc').html(Accomp);
                $('#dvAcc').show();
            }

            //BIND DOCTOR VISIT
            if (HeaderReponse[h].DCRInfo.DCRDoctorsVisit.length > 0) {
                var ownDocHtml = "<div class='gridHeader'><span class='tbl_heading'>Doctors visited from his own MDL</span></div>";
                ownDocHtml += "<table id='tblV4OwnDoctor' class='table table-striped details'><thead class='reportHeader'><th>Doctors </th><th>MDL/SVL#</th><th>Speciality</th><th>Category</th><th>Visit Mode/Time</th><th>Accompanist Details</th><th>POB Amount</th><th>Remarks</th></thead>";
                ownDocHtml += "<tbody>";
                for (var i = 0; i < HeaderReponse[h].DCRInfo.DCRDoctorsVisit.length; i++) {
                    var type = 'own';
                    var doc_code = HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].Doctor_Code;
                    var doctorName = HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].DoctorName == null ? '' : HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].DoctorName;
                    var mdlNumber = HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].MDLNo == null ? '' : HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].MDLNo;
                    var specialityName = HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].SpecialityName == null ? '' : HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].SpecialityName;
                    var visitMode = HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].VisitMode == null ? '' : HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].VisitMode;
                    var visitTime = HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].VisitTime == null ? '' : HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].VisitTime;
                    var po_Amount = HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].POBAmount == null ? '' : HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].POBAmount;
                    var remarks = HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].Remarks == null ? '' : HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].Remarks;
                    var timemode = visitTime.length > 0 ? (visitTime + visitMode) : visitMode.length > 0 ? visitMode : "AM";
                    ownDocHtml += "<tr>";
                    ownDocHtml += "<td id='docname_" + i + "'>" + doctorName + "</td>";
                    ownDocHtml += "<td id='docmdl_" + i + "'>" + mdlNumber + "</td>";
                    ownDocHtml += "<td id='docspec_" + i + "'>" + specialityName + "<span id='docCategory_" + i + "' style='display:none'>" + HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].CategoryName + "</span></td>";
                    ownDocHtml += "<td id='docCategory_" + i + "'>" + HeaderReponse[h].DCRInfo.DCRDoctorsVisit[i].CategoryName + "</td>";
                    ownDocHtml += "<td>" + timemode + "</td>";
                    ownDocHtml += "<td>No</td>";
                    ownDocHtml += "<td id='poAmount'>" + po_Amount + "</td>";
                    ownDocHtml += "<td>" + remarks + "</td>";
                    ownDocHtml += "</tr>";
                }

                ownDocHtml += "</tbody></table>";
                $('#dvOwnDoctors').html(ownDocHtml);
                $('#dvOwnDoctors').show();
            }

            //BIND DOCTOR ACCOMPANIST DATA
            //if (DoctorReponse[h] != null) {
            if (DoctorReponse.lstAccompanists.length > 0) {
                var AccDocHtml = "<div class='gridHeader'><span class='tbl_heading'>Doctors visited from Accompanist Master</span></div>";
                AccDocHtml += "<table id='tblAccDoctor' class='table table-striped details'><thead class='reportHeader'><th>Doctors </th><th>MDL/SVL#</th><th>Speciality</th><th>Category</th><th>Visit Mode/Time</th><th>Accompanist Details</th><th>POB Amount</th><th>Remarks</th></thead>";
                AccDocHtml += "<tbody>";
                for (var i = 0; i < DoctorReponse.lstAccompanists.length; i++) {
                    var type = 'own';
                    var doc_code = DoctorReponse.lstAccompanists[i].DoctorCode;
                    var doctorName = DoctorReponse.lstAccompanists[i].DoctorName == null ? '' : DoctorReponse.lstAccompanists[i].DoctorName;
                    var mdlNumber = DoctorReponse.lstAccompanists[i].MDLNo == null ? '' : DoctorReponse.lstAccompanists[i].MDLNo;
                    var specialityName = DoctorReponse.lstAccompanists[i].SpecialityName == null ? '' : DoctorReponse.lstAccompanists[i].SpecialityName;
                    var visitMode = DoctorReponse.lstAccompanists[i].VisitMode == null ? '' : DoctorReponse.lstAccompanists[i].VisitMode;
                    var visitTime = DoctorReponse.lstAccompanists[i].VisitTime == null ? '' : DoctorReponse.lstAccompanists[i].VisitTime;
                    var po_Amount = DoctorReponse.lstAccompanists[i].POBAmount == null ? '' : DoctorReponse.lstAccompanists[i].POBAmount;
                    var remarks = DoctorReponse.lstAccompanists[i].Remarks == null ? '' : DoctorReponse.lstAccompanists[i].Remarks;
                    var timemode = visitTime.length > 0 ? (visitTime + visitMode) : visitMode.length > 0 ? visitMode : "AM";
                    AccDocHtml += "<tr>";
                    AccDocHtml += "<td id='docname_" + i + "'>" + doctorName + "</td>";
                    AccDocHtml += "<td id='docmdl_" + i + "'>" + mdlNumber + "</td>";
                    AccDocHtml += "<td id='docspec_" + i + "'>" + specialityName + "<span id='docCategory_" + i + "' style='display:none'>" + DoctorReponse.lstAccompanists[i].CategoryName + "</span></td>";
                    AccDocHtml += "<td id='docCategory_" + i + "'>" + DoctorReponse.lstAccompanists[i].CategoryName + "</td>";
                    AccDocHtml += "<td>" + timemode + "</td>";
                    AccDocHtml += "<td>No</td>";
                    AccDocHtml += "<td style='text-align: right;'>" + po_Amount + "</td>";
                    AccDocHtml += "<td>" + remarks + "</td>";
                    AccDocHtml += "</tr>";
                }

                AccDocHtml += "</tbody></table>";
                $('#dvAccDoctors').html(AccDocHtml);
                $('#dvAccDoctors').show();
            }
            //}

            //BIND SAMPLE PRODUCTS
            //if (DoctorReponse[h] != null) {
            if (DoctorReponse.lstSamples.length > 0) {
                var SampleHtml = "<div class='gridHeader'><span class='tbl_heading'>Sample/Promotional item Details</span></div>";
                SampleHtml += "<table id='tblV4OwnDoctor' class='table table-striped details'><thead class='reportHeader'><th>Stockiest Name</th><th>Sample/Promotional item name</th><th>Qty given</th><th>Speciality</th><th style='display:none'>Is_Detailed</th><th>Is_CPDoctor</th></thead>"
                SampleHtml += "<tbody>";
                for (var i = 0; i < DoctorReponse.lstSamples.length; i++) {
                    var doctorName = DoctorReponse.lstSamples[i].DoctorName == null ? '' : DoctorReponse.lstSamples[i].DoctorName;
                    var productName = DoctorReponse.lstSamples[i].ProductName == null ? '' : DoctorReponse.lstSamples[i].ProductName;
                    var quantityProvided = DoctorReponse.lstSamples[i].QuantityProvided == null ? '' : DoctorReponse.lstSamples[i].QuantityProvided;
                    var specilaityName = DoctorReponse.lstSamples[i].SpecialityName == null ? '' : DoctorReponse.lstSamples[i].SpecialityName;
                    var isCpDoc = DoctorReponse.lstSamples[i].IsCPDoctor == null ? '' : DoctorReponse.lstSamples[i].IsCPDoctor;

                    SampleHtml += "<tr>";
                    SampleHtml += "<td>" + doctorName + "</td>";
                    SampleHtml += "<td>" + productName + "</td>";
                    SampleHtml += "<td>" + quantityProvided + "</td>";
                    SampleHtml += "<td>" + specilaityName + "</td>";
                    SampleHtml += "<td>" + isCpDoc + "</td>";
                    SampleHtml += "</tr>";
                }

                SampleHtml += "</tbody></table>";
                $('#dvProducts').html(SampleHtml);
                $('#dvProducts').show();
            }
            //}

            //if (DoctorReponse[h] != null) {
            //BIND RCPA DETAILS
            if (DoctorReponse.lstDetailedProducts.length > 0) {
                var DetailedHtml = "<div class='gridHeader'><span class='tbl_heading'>Detailed Product Details</span></div>";
                DetailedHtml += "<table id='tblProducts' class='table table-striped details'><thead class='reportHeader'><th>Doctor Name</th><th>Detailed Product Name</th><th>Product Type Name</th><th>Specialty</th><th>Is_CPDoctor</th></thead>";
                DetailedHtml += "<tbody>";

                for (var i = 0; i < DoctorReponse.lstDetailedProducts.length; i++) {

                    var doctorName = DoctorReponse.lstDetailedProducts[i].DoctorName == null ? '' : DoctorReponse.lstDetailedProducts[i].DoctorName;
                    var productName = DoctorReponse.lstDetailedProducts[i].ProductName == null ? '' : DoctorReponse.lstDetailedProducts[i].ProductName;
                    var productTypeName = DoctorReponse.lstDetailedProducts[i].ProductTypeName == null ? '' : DoctorReponse.lstDetailedProducts[i].ProductTypeName;
                    var specilaityName = DoctorReponse.lstDetailedProducts[i].SpecialityName == null ? '' : DoctorReponse.lstDetailedProducts[i].SpecialityName;
                    var isCpDoc = DoctorReponse.lstDetailedProducts[i].IsCPDoc == null ? '' : DoctorReponse.lstDetailedProducts[i].IsCPDoc;

                    DetailedHtml += "<tr>";
                    DetailedHtml += "<td>" + doctorName + "</td>";
                    DetailedHtml += "<td>" + productName + "</td>";
                    DetailedHtml += "<td>" + productTypeName + "</td>";
                    // leave+="<td>" + currentStcok + "</td>";
                    DetailedHtml += "<td>" + specilaityName + "</td>";
                    DetailedHtml += "<td style='display:none'>" + specilaityName + "</td>";
                    DetailedHtml += "<td>" + isCpDoc + "</td>";
                    DetailedHtml += "</tr>";
                }

                DetailedHtml += "</tbody></table>";
                $('#dvDetailedProductsDetails').html(DetailedHtml);
                $('#dvDetailedProductsDetails').show();
            }
            //}

            //if (DoctorReponse[h] != null) {
            //BIND RCPA DETAILS
            if (DoctorReponse.lstRCPADetails.length > 0) {
                var rcpaaHtml = "<div class='gridHeader'><span class='tbl_heading'>Doctors visited from his own MDL</span></div>";
                rcpaaHtml += "<table id='tblV4OwnDoctor' class='table table-striped details'><thead class='reportHeader'><th>Doctors </th><th>MDL/SVL#</th><th>Speciality</th><th>Category</th><th>Visit Mode/Time</th><th>Accompanist Details</th><th>POB Amount</th><th>Remarks</th></thead>";
                rcpaaHtml += "<tbody>";
                for (var i = 0; i < DoctorReponse.lstRCPADetails.length; i++) {
                    var type = 'own';
                    var doc_code = DoctorReponse.lstRCPADetails[i].Doctor_Code;
                    var doctorName = DoctorReponse.lstRCPADetails[i].DoctorName == null ? '' : DoctorReponse.lstRCPADetails[i].DoctorName;
                    var mdlNumber = DoctorReponse.lstRCPADetails[i].MDLNo == null ? '' : DoctorReponse.lstRCPADetails[i].MDLNo;
                    var specialityName = DoctorReponse.lstRCPADetails[i].SpecialityName == null ? '' : DoctorReponse.lstRCPADetails[i].SpecialityName;
                    var visitMode = DoctorReponse.lstRCPADetails[i].VisitMode == null ? '' : DoctorReponse.lstRCPADetails[i].VisitMode;
                    var visitTime = DoctorReponse.lstRCPADetails[i].VisitTime == null ? '' : DoctorReponse.lstRCPADetails[i].VisitTime;
                    var po_Amount = DoctorReponse.lstRCPADetails[i].POBAmount == null ? '' : DoctorReponse.lstRCPADetails[i].POBAmount;
                    var remarks = DoctorReponse.lstRCPADetails[i].Remarks == null ? '' : DoctorReponse.lstRCPADetails[i].Remarks;
                    var timemode = visitTime.length > 0 ? (visitTime + visitMode) : visitMode.length > 0 ? visitMode : "AM";
                    rcpaaHtml += "<tr>";
                    rcpaaHtml += "<td id='docname_" + i + "'>" + doctorName + "</td>";
                    rcpaaHtml += "<td id='docmdl_" + i + "'>" + mdlNumber + "</td>";
                    rcpaaHtml += "<td id='docspec_" + i + "'>" + specialityName + "<span id='docCategory_" + i + "' style='display:none'>" + DoctorReponse.lstRCPADetails[i].CategoryName + "</span></td>";
                    rcpaaHtml += "<td id='docCategory_" + i + "'>" + DoctorReponse.lstRCPADetails[i].CategoryName + "</td>";
                    rcpaaHtml += "<td>" + timemode + "</td>";
                    rcpaaHtml += "<td>No</td>";
                    rcpaaHtml += "<td style='text-align: right;'>" + po_Amount + "</td>";
                    rcpaaHtml += "<td>" + remarks + "</td>";
                    rcpaaHtml += "</tr>";
                }

                rcpaaHtml += "</tbody></table>";
                $('#dvRCPA').html(rcpaaHtml);
                $('#dvRCPA').show();
            }
            //}

            //if (DoctorReponse[h] != null) {
            //BIND CHEMIST DETAILS
            if (DoctorReponse.lstChemistsVisits.length > 0) {
                var chemistHTML = "<div class='gridHeader'><span class='tbl_heading'>CHEMIST  Details</span></div>";
                chemistHTML += "<table id='tblChemist' class='table table-striped details'><thead class='reportHeader'><th> Chemist Name</th><th>POB Amount</th></thead>";
                chemistHTML += "<tbody>";
                for (var i = 0; i < DoctorReponse.lstChemistsVisits.length; i++) {
                    var chemistName = DoctorReponse.lstChemistsVisits[i].ChemistName == null ? "" : DoctorReponse.lstChemistsVisits[i].ChemistName;
                    var poAmount = DoctorReponse.lstChemistsVisits[i].dvChemist == null ? "" : DoctorReponse.lstChemistsVisits[i].dvChemist;
                    chemistHTML += "<tr>";
                    chemistHTML += "<td>" + chemistName + "</td>";
                    chemistHTML += "<td id='poAmount'>" + poAmount + "</td>";
                    chemistHTML += "</tr>";
                }
                chemistHTML += "</tbody></table>";
                $('#dvChemist').html(chemistHTML);
                $('#dvChemist').show();
            }
            //}


            //BIND FOLLOW UPS
            //if (DoctorReponse[h] != null) {
            if (DoctorReponse.lstDCRFollowups.length > 0) {
                var followUps = "div class='gridHeader'><span class='tbl_heading'>Follow Ups</span></div>";
                followUps += "<table id='tblFollowUps' class='table table-striped details'><thead class='reportHeader'><th>DOCTOR</th><th>MDL/SVL#</th><th>Tasks</th><th>Due Date</th><th>Updated DateTime</th></thead>";
                followUps += "<tbody>";
                for (var i = 0; i < DoctorReponse.lstDCRFollowups.length; i++) {
                    var doctorName = DoctorReponse.lstDCRFollowups[i].DoctorName == null ? "" : DoctorReponse.lstDCRFollowups[i].DoctorName;
                    var mdlNo = DoctorReponse.lstDCRFollowups[i].MDLNumber == null ? "" : DoctorReponse.lstDCRFollowups[i].MDLNumber;
                    var tasks = DoctorReponse.lstDCRFollowups[i].Tasks == null ? "" : DoctorReponse.lstDCRFollowups[i].Tasks;
                    var dueDate = DoctorReponse.lstDCRFollowups[i].DueDate == null ? "" : DoctorReponse.lstDCRFollowups[i].DueDate;
                    //string dcrActualDate = dr["DCR_Actual_Date"] == null ? "" : dr["DCR_Actual_Date"];
                    var updatedDateTime = DoctorReponse.lstDCRFollowups[i].UpdatedDateTime == null ? "" : DoctorReponse.lstDCRFollowups[i].UpdatedDateTime;

                    followUps += "<tr>";
                    followUps += "<td style='width:25%;'>" + doctorName + "</td>";
                    followUps += "<td style='width:15%;'>" + mdlNo + "</td>";
                    followUps += "<td style='width:20%;'>" + tasks + "</td>";
                    followUps += "<td style='width:20%;'>" + dueDate + "</td>";
                    //leave+="<td>" + dcrActualDate + "</td>";
                    followUps += "<td style='width:20%;'>" + updatedDateTime + "</td>";
                    followUps += "</tr>";
                }
                followUps += "</tbody></table>";
                $('#dvFollowUps').html(followUps);
                $('#dvFollowUps').show();
            }
            //}

            //BIND ATTACHMENTS
            //if (DoctorReponse[h] != null) {
            if (DoctorReponse.lstDCRDoctorAttachments.length > 0) {
                var Attachements = "<div class='gridHeader'><span class='tbl_heading'>Attachments</span></div>";
                Attachements += "<table id='tblAttachments' class='table table-striped details'><thead class='reportHeader'><th>Doctor Name</th><th>MDL/SVL#</th><th>Attachement File name (click on the file to download locally)</th><th>Updated DateTime</th><th>Status </th></thead>";
                Attachements += "<tbody>";
                for (var i = 0; i < DoctorReponse.lstDCRDoctorAttachments.length; i++) {
                    var doctorName = DoctorReponse.lstDCRDoctorAttachments[i].DoctorName == null ? "" : DoctorReponse.lstDCRDoctorAttachments[i].DoctorName;
                    var mdlNo = DoctorReponse.lstDCRDoctorAttachments[i].MDLNumber == null ? "" : DoctorReponse.lstDCRDoctorAttachments[i].MDLNumber;
                    var bloburl = DoctorReponse.lstDCRDoctorAttachments[i].BlobUrl == null ? "" : DoctorReponse.lstDCRDoctorAttachments[i].BlobUrl;
                    var uploadFileName = DoctorReponse.lstDCRDoctorAttachments[i].UploadedFileName == null ? "" : DoctorReponse.lstDCRDoctorAttachments[i].UploadedFileName;
                    var updatedDateTime = DoctorReponse.lstDCRDoctorAttachments[i].UpdatedDateTime == null ? "" : DoctorReponse.lstDCRDoctorAttachments[i].UpdatedDateTime;

                    Attachements += "<tr>";
                    Attachements += "<td style='width:25%;'>" + doctorName + "</td>";
                    Attachements += "<td style='width:10%;'>" + mdlNo + "</td>";
                    //leave+="<td>" + id + "</td>";
                    if (bloburl == "") {
                        Attachements += "<td style='width:40%;'>" + uploadFileName + "</td>";
                    }
                    else {
                        Attachements += "<td style='width:40%;'><a href='" + bloburl + "'>" + uploadFileName + "</td>";
                    }
                    //leave+="<td>" + dcrActualDate + "</td>";
                    Attachements += "<td style='width:15%;'>" + updatedDateTime + "</td>";
                    if (bloburl == null || bloburl == "") {
                        Attachements += "<td style='width:10%;'>" + "Yet to upload" + "</td>";
                    }
                    else {
                        Attachements += "<td style='width:10%;'>" + "Attached" + "</td>";
                    }
                    Attachements += "</tr>";
                }
                Attachements += "</tbody></table>";
                $('#dvAttchments').html(Attachements);
                $('#dvAttchments').show();
            }
            //}

            //BIND EXPENSE DETAILS
            if (HeaderReponse[h].DCRExpenses.length > 0) {
                var expenseHtml = "<div class='gridHeader'><span class='tbl_heading'>Expense Details</span></div>";
                expenseHtml += "<table id='tblExpenseSummary' class='table table-striped details'><thead class='reportHeader'><th>Expense Name</th><th>Amount</th><th>Remarks</th></thead>";
                expenseHtml += "<tbody>";
                for (var i = 0; i < HeaderReponse[h].DCRExpenses.length; i++) {
                    var expenseTypeName = HeaderReponse[h].DCRExpenses[i].ExpenseTypeName == null ? '' : HeaderReponse[h].DCRExpenses[i].ExpenseTypeName;
                    var expenseAmount = HeaderReponse[h].DCRExpenses[i].ExpenseAmount == null ? '' : HeaderReponse[h].DCRExpenses[i].ExpenseAmount;
                    var expenseRemarks = HeaderReponse[h].DCRExpenses[i].Remarks == null ? '' : HeaderReponse[h].DCRExpenses[i].Remarks;
                    expenseHtml += "<tr>";
                    expenseHtml += "<td>" + expenseTypeName + "</td>";
                    expenseHtml += "<td style='text-align: right;'>" + expenseAmount + "</td>";
                    expenseHtml += "<td>" + expenseRemarks + "</td>";
                    expenseHtml += "</tr>";
                }
                expenseHtml += "</tbody></table>";
                $('#dvExpense').html(expenseHtml);
                $('#dvExpense').show();

            }

            //BIND STOCKIEST DETAILS
            if (HeaderReponse[h].DCRStockist.length > 0) {
                var stockHtml = "<div class='gridHeader'><span class='tbl_heading'>Stockiest Details</span></div>";
                stockHtml += "<table id='tblStockiest'  class='table table-striped details'><thead class='reportHeader'><th>Name</th><th>Visit Time/Mode</th><th>Remarks</th><th>POB</th><th>Collection</th></thead>";
                stockHtml += "<tbody>";
                for (var i = 0; i < HeaderReponse[h].DCRStockist.length; i++) {
                    var stockName = HeaderReponse[h].DCRStockist[i].StokiestName == null ? '' : HeaderReponse[h].DCRStockist[i].StokiestName;
                    var visitMode = HeaderReponse[h].DCRStockist[i].VisitMode == null ? '' : HeaderReponse[h].DCRStockist[i].VisitMode;
                    var remarks = HeaderReponse[h].DCRStockist[i].Remarks == null ? '' : HeaderReponse[h].DCRStockist[i].Remarks;
                    stockHtml += "<tr>";
                    stockHtml += "<td id='AccompName_" + i + "'>" + stockName + "</td>";
                    stockHtml += "<td id='startTime_" + i + "'>" + visitMode + "</td>";
                    stockHtml += "<td id='endTime_" + i + "'>" + remarks + "</td>";
                }
                stockHtml += "</tbody></table>";

                $('#dvStockiest').html(stockHtml);
                $('#dvStockiest').show();
            }

            //BIND ATTENDENCE DETAILS
            if (HeaderReponse[h].DCRAttendanceActivity != null) {
                var attendance = "<div class='gridHeader'><span class='tbl_heading'>Attendance Details</span></div>";
                attendance += "<table id='tblAttendance' class='table table-striped details'><thead class='reportHeader'><th>Project</th><th>Activity</th><th>Start Time</th><th>End Time</th><th>Remarks</th></thead>";
                attendance += "<tbody>";
                for (var i = 0; i < HeaderReponse[h].DCRAttendanceActivity.length; i++) {
                    attendance += "<tr>";
                    attendance += "<td>" + HeaderReponse[h].DCRAttendanceActivity[i].ProjectName + "</td>";
                    attendance += "<td>" + HeaderReponse[h].DCRAttendanceActivity[i].ActivityName + "</td>";
                    attendance += "<td>" + HeaderReponse[h].DCRAttendanceActivity[i].StartTime + "</td>";
                    attendance += "<td>" + HeaderReponse[h].DCRAttendanceActivity[i].EndTime + "</td>";
                    attendance += "<td>" + HeaderReponse[h].DCRAttendanceActivity[i].Remarks + "</td>";
                    attendance += "</tr>";
                }
                attendance += "</tbody></table>";
                $('#dvAttendance').html(attendance);
                $('#dvAttendance').show();
            }

            //BIND LEAVE
            if (HeaderReponse[h].DCRInfo.ActivityFlag == "L") {
                var leave = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Leave Details</h3></div>";
                leave += "<h3 style='margin: 0px auto'>Leave Details &nbsp <span id='UserName'></span></h3>";
                leave += "</div>";
                leave += "<table id='tblleaveDetails' class='data display dataTable box'>";
                leave += "<thead>";
                leave += "<tr>";
                leave += "<th>Dcr Type</th>";
                leave += "<th>Dcr Status</th>";
                leave += "<th>Leave Type Name</th>";
                leave += "<th>Leave Reason</th>";
                leave += "<th>Approved/Unapproved Reason</th>";
                leave += "</tr>";
                leave += "</thead><tbody>";
                leave += "<tr>";
                leave += "<td><span id='spnleave'>Leave</span></td>";
                leave += "<td><span id='spndcr'>" + HeaderReponse[h].DCRInfo.DCRStatusName + "</span></td>";
                leave += "<td><span id='spntypename'>" + HeaderReponse[h].DCRInfo.LeaveTypeName + "</span></td>";
                if (HeaderReponse[h].DCRInfo.LeaveReason != null) {
                    leave += "<td><span id='spnleavereason'>" + HeaderReponse[h].DCRInfo.LeaveReason + "</span></td>";
                }
                else {
                    leave += "<td></td>";
                }
                //leave+="<td class='td-a'><a onclick='fnLeavePopup(\"" + HeaderReponse[h].DCRInfo.ApprovedBy + "|" + HeaderReponse[h].DCRInfo.ApprovedDate + "|" + HeaderReponse[h].DCRInfo.ApprovalRemarks + "\");</td>";
                leave += "</tr></tbody></table>";
                $('#dvLeave').html(leave);
                $('#dvLeave').show();
            }
        }


        $('#dvUserPerday').show();

    }

}