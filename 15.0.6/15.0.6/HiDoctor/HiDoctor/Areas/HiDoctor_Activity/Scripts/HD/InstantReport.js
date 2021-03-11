var accHeaderTableString_g = ' <table class="accHeaderTable"><tr><td style="font-weight:bold;">User Name</td> <td><span id="spnpuserName"></span></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">Employee Name</td><td><span id="spnpEmpName"></span></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">Region Name</td><td><span id="spnpRegionName"></span></td></tr>';
accHeaderTableString_g += '<tr><td style="font-weight:bold;">DCR Date</td> <td><span id="spnDCRDate"></span></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">DCR Type</td><td><span id="spnDCRType"></span></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">DCR Status</td><td><span id="spnpDCRStatus"></span></td>';
accHeaderTableString_g += '</tr><tr><td style="font-weight:bold;">Work Place</td> <td><span id="spnWorkPlace"></span></td><td style="font-weight:bold;">Travelled Places</td>';
accHeaderTableString_g += '<td id="tdTravlledPlaces"></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">Entered Date</td><td><span id="spnDCRentedDate"></span></td>';
accHeaderTableString_g += '</tr></table>';
accHeaderTableString_g += '<table style="width:50%;margin:0px auto;">';
accHeaderTableString_g += '<tr><td style="font-weight: bold;">Accompanist Name : </td><td><span id="accPopUpName"></span></td></tr>';
accHeaderTableString_g += '<tr><td style="font-weight: bold;">Time : </td><td><span id="accPopUpTime"></span></td></tr>';
accHeaderTableString_g += '</table>';

var detailProdString_g = '<table class="accHeaderTable"><tr><td style="font-weight:bold;">User Name</td><td><span id="spnduserName"></span></td><td style="font-weight:bold;">Employee Name</td>';
detailProdString_g += '<td><span id="spndEmpName"></span></td><td style="font-weight:bold;">Region Name</td><td><span id="spndRegionName"></span></td>';
detailProdString_g += '</tr><br /><tr><td style="font-weight:bold;">Doctor Name</td><td><span id="spndDocName"></span></td><td style="font-weight:bold;">MDL No</td><td><span id="spndMDL"></span></td>';
detailProdString_g += '<td style="font-weight:bold;">Specilaity</td><td><span id="spndSpeciality"></span></td></tr><tr><td style="font-weight:bold;">Category</td><td><span id="spndCategory"></span></td>';
detailProdString_g += '</tr></table>';

function BindDCRDeatils(dcrDetailJSON) {
    dcrdejson_g = dcrDetailJSON;
    fnBindHeaderDeatils(dcrDetailJSON.Tables[0]);
    fnBindHOPPlaces(dcrDetailJSON.Tables[1]);
    if (flag_g == 'A') {
        $('#spnTypeofDCR').html('Attendance');
        $('#dvAcc').css('display', 'none');
        $('#tblAcc').css('display', 'none');
        fnBindExpenseDetails(dcrDetailJSON.Tables[2]);
        fnBindAttendanceDetails(dcrDetailJSON.Tables[3])
    }
    else {
        fnBindOwnDoctorsVisit(dcrDetailJSON.Tables[2]);
        fnBindAccDoctorsVisit(dcrDetailJSON.Tables[3]);
        fnBindProductDetails(dcrDetailJSON.Tables[4]);
        fnBindChemistDetails(dcrDetailJSON.Tables[5]);
        fnBindRCPADetails(dcrDetailJSON.Tables[6]);
        fnBindStockiestDetails(dcrDetailJSON.Tables[7]);
        fnBindExpenseDetails(dcrDetailJSON.Tables[8]);
    }
    HideModalPopup('dvLoading');
}

function fnBindHeaderDeatils(dcrHeaderJson) {
    var headerJson = dcrHeaderJson.Rows[0];
    if (headerJson.DCR_Status == "1" || headerJson.DCR_Status == "2") {
        //$('#dvUnapprove').css('display', '');
    }
    $('#spnuserName').html(headerJson.User_Name);
    $('#spniregionName').html(headerJson.Region_Name);
    $('#spnPlaceWorked').html(headerJson.Place_Worked);
    $('#spnCategory').html(headerJson.Category);
    $('#spnPlacefrom').html(headerJson.From_Place);
    $('#spnPlaceto').html(headerJson.To_Place);
    $('#spnTravelMode').html(headerJson.Travel_Mode);
    $('#spnDistance').html(headerJson.Travelled_Kms);
    $('#spnCpName').html(headerJson.CP_Name);
    $('#spnStartTime').html(headerJson.User_Start_Time);
    $('#spnEndTime').html(headerJson.User_End_Time);
    $('#spndcrEnteredDate').html(headerJson.DCR_Entered_Date);
    $('#spniEmpName').html(headerJson.Employee_Name);

    if (headerJson.Person_Type_Code == null || headerJson.Person_Type_Code.length == 0) {
        $('#accRow1').css('display', 'none');
    }
    else {
        $('#spnFirstAccPerType').html(headerJson.Person_Type_Code);
        $('#spnFirstAccPersonName').html(headerJson.Person_Code);
        if (headerJson.Accomp_Start_Time != null && headerJson.Accomp_Start_Time != "") {
            $('#spnFirstAccStartTime').html(headerJson.Accomp_Start_Time);
        }
        if (headerJson.Accomp_End_Time != null && headerJson.Accomp_End_Time != "") {
            $('#spnFirstAccEndTime').html(headerJson.Accomp_End_Time);
        }
    }

    if (headerJson.Acc2_Type_Code == null || headerJson.Acc2_Type_Code.length == 0) {
        $('#accRow2').css('display', 'none');
    }
    else {
        $('#spnSecAccPersonType').html(headerJson.Acc2_Type_Code);
        $('#spnSecAccPersonName').html(headerJson.Acc2_User_Code);
        if (headerJson.Acc2_Start_Time != null && headerJson.Acc2_Start_Time != "") {
            $('#spnSecAccStartTime').html(headerJson.Acc2_Start_Time);
        }
        if (headerJson.Acc2_End_Time != null && headerJson.Acc2_End_Time != "") {
            $('#spnSecAccEndTime').html(headerJson.Acc2_End_Time);
        }
    }
    if (headerJson.Acc_3_Person == null || headerJson.Acc_3_Person.length == 0) {
        $('#accRow3').css('display', 'none');
    }
    else {
        $('#spnThirdAccPersonName').html(headerJson.Acc_3_Person);
        if (headerJson.Acc_3_Time != null) {
            if (headerJson.Acc_3_Time.split('_')[0] != '') {
                $('#spnThirdAccStartTime').html(headerJson.Acc_3_Time.split('_')[0]);
            }
            if (headerJson.Acc_3_Time.split('_')[1] != '') {
                $('#spnThirdAccEndTime').html(headerJson.Acc_3_Time.split('_')[1]);
            }
        }

    }

    if (headerJson.Acc_4_Person == null || headerJson.Acc_4_Person.length == 0) {
        $('#accRow4').css('display', 'none');
    }
    else {
        $('#spnFourthAccPersonName').html(headerJson.Acc_4_Person);
        if (headerJson.Acc_4_Time != null) {
            if (headerJson.Acc_4_Time.split('_')[0] != '') {
                $('#spnFourthAccStartTime').html(headerJson.Acc_4_Time.split('_')[0]);
            }
            if (headerJson.Acc_4_Time.split('_')[0] != '') {
                $('#spnFourthAccEndTime').html(headerJson.Acc_4_Time.split('_')[1]);
            }
        }
    }

    var status = headerJson.DCR_Status == "3" ? "Saved" : headerJson.DCR_Status == "1" ? "Applied" : "Approved"
    $('#spnDCRStatus').html(status);
    $('#spnApprovedby').html(headerJson.Approved_By == null ? '' : headerJson.Approved_By);
    $('#spnApproveddate').html(headerJson.ApprovedDate == null ? '' : headerJson.ApprovedDate);

    var unapprovalReason = headerJson.Unapproval_Reason == null ? '' : headerJson.Unapproval_Reason;
    unapprovalReason = unapprovalReason.replace(/~\^/g, ' - N/A<br />');
    unapprovalReason = unapprovalReason.replace(/\^/g, '<br />');
    unapprovalReason = unapprovalReason.replace(/~/g, ' - ');
    $('#spnUnapprovalreason').html(unapprovalReason);

    $('#spnNoofdoctorsmet').html();

    $('#tblAcc').dataTable({
        "bFilter": false,
        "bPaginate": false,
        "sPaginationType": "full_numbers",
        "bInfo": false,
        // "sScrollX": "100%",
        "bSort": false
    });
}

function fnBindHOPPlaces(dcrHOPJson) {
    if (dcrHOPJson != null) {
        if (dcrHOPJson.Rows.length > 0) {
            var hopPlacesHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>SFC Details</h3></div>";
            hopPlacesHtml += "<table id='tblHOP' style='width:85%' class='data display dataTable box'><thead><th>From Place</th><th>To Place</th><th>Distance</th><th>Travel Mode</th></thead>";
            hopPlacesHtml += "<tbody>";
            for (var i = 0; i < dcrHOPJson.Rows.length; i++) {
                var fromPalce = dcrHOPJson.Rows[i].From_Place == null ? '' : dcrHOPJson.Rows[i].From_Place;
                var toPlace = dcrHOPJson.Rows[i].To_Place == null ? '' : dcrHOPJson.Rows[i].To_Place;
                var distnce = dcrHOPJson.Rows[i].Distance == null ? '' : dcrHOPJson.Rows[i].Distance;
                var travelmode = dcrHOPJson.Rows[i].Travel_Mode == null ? '' : dcrHOPJson.Rows[i].Travel_Mode;
                hopPlacesHtml += "<tr>";
                if (dcrHOPJson.Rows[i].Route_Way == "R") {
                    hopPlacesHtml += "<td>" + toPlace + "</td>";
                    hopPlacesHtml += "<td>" + fromPalce + "</td>";
                }
                else {
                    hopPlacesHtml += "<td>" + fromPalce + "</td>";
                    hopPlacesHtml += "<td>" + toPlace + "</td>";
                }
                hopPlacesHtml += "<td>" + distnce + "</td>";
                hopPlacesHtml += "<td>" + travelmode + "</td>";
                hopPlacesHtml += "</tr>";
            }
            hopPlacesHtml += "</tbody></table>";
            $('#dvhopplaces').html(hopPlacesHtml);
            $('#tblSFCDetails').css('display', 'none');
            $('#dvsfcdetails').css('display', 'none');
            $('#tblHOP').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }
    }
}

function fnBindOwnDoctorsVisit(dcrOwnDoctorJson) {
    if (dcrOwnDoctorJson != null) {
        if (dcrOwnDoctorJson.Rows.length > 0) {
            var ownDocHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Doctors visited from his own MDL</h3></div>";
            ownDocHtml += "<table id='tblOwnDoctor'  class='data display dataTable box' style='width:85%'><thead><th>Doctor</th><th>MDL/SVL#</th><th>Speciality</th><th>Category</th><th>Visit Mode/Time</th><th>Detailed Product List</th><th>POB Amount</th><th>Remarks</th></thead>";
            ownDocHtml += "<tbody>";
            for (var i = 0; i < dcrOwnDoctorJson.Rows.length; i++) {
                var doc_code = dcrOwnDoctorJson.Rows[i].Doctor_Code;
                var doctorName = dcrOwnDoctorJson.Rows[i].Doctor_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Doctor_Name;
                var mdlNumber = dcrOwnDoctorJson.Rows[i].MDL_Number == null ? '' : dcrOwnDoctorJson.Rows[i].MDL_Number;
                var specialityName = dcrOwnDoctorJson.Rows[i].Speciality_Name == null ? '' : dcrOwnDoctorJson.Rows[i].Speciality_Name;
                var visitMode = dcrOwnDoctorJson.Rows[i].Visit_Mode == null ? '' : dcrOwnDoctorJson.Rows[i].Visit_Mode;
                var visitTime = dcrOwnDoctorJson.Rows[i].Doctor_Visit_Time == null ? '' : dcrOwnDoctorJson.Rows[i].Doctor_Visit_Time;
                var po_Amount = dcrOwnDoctorJson.Rows[i].PO_Amount == null ? '' : dcrOwnDoctorJson.Rows[i].PO_Amount;
                var remarks = dcrOwnDoctorJson.Rows[i].Remarks_By_User == null ? '' : dcrOwnDoctorJson.Rows[i].Remarks_By_User;
                var timemode = visitTime.length > 0 ? visitTime : visitMode.length > 0 ? visitMode : "AM";
                ownDocHtml += "<tr>";
                ownDocHtml += "<td id='docname_"+i.toString()+"'>" + doctorName + "</td>";
                ownDocHtml += "<td id='docmdl_" + i.toString() + "'>" + mdlNumber + "</td>";
                ownDocHtml += "<td id='docspec_" + i.toString() + "'>" + specialityName + "<span id='docCategory_" + i + "' style='display:none'>" + dcrOwnDoctorJson.Rows[i].Category_Name + "</span></td>";
                ownDocHtml += "<td id='docCategory_" + i.toString() + "'>" + dcrOwnDoctorJson.Rows[i].Category_Name + "</td>";
                ownDocHtml += "<td>" + timemode + "</td>";
                ownDocHtml += "<td><span class='hyperlink' onclick='fnShowDetailedProducts(\"" + i.toString() + "\",\""+doc_code+"\")'>View</span></td>";
                ownDocHtml += "<td>" + po_Amount + "</td>";
                ownDocHtml += "<td>" + remarks + "</td>";
                ownDocHtml += "</tr>";
            }

            ownDocHtml += "</tbody></table>";
            $('#dvOwnDoctors').html(ownDocHtml);
            $('#tblOwnDoctor').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }
    }
}

function fnBindAccDoctorsVisit(dcrAccDoctorJson) {
    if (dcrAccDoctorJson != null) {
        if (dcrAccDoctorJson.Rows.length > 0) {
            var accDocHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Doctors visited from others MDL</h3></div>";

            accDocHtml += "<table id='tblAccDoctor'  class='data display dataTable box' style='width:85%'><thead><th>Doctor</th><th>MDL/SVL#</th><th>Speciality</th><th>Category</th><th>Visit Mode/Time</th><th>POB Amount</th><th>Remarks</th></thead>";
            accDocHtml += "<tbody>";
            for (var i = 0; i < dcrAccDoctorJson.Rows.length; i++) {
                var doctorName = dcrAccDoctorJson.Rows[i].Doctor_Name == null ? '' : dcrAccDoctorJson.Rows[i].Doctor_Name;
                var mdlNumber = dcrAccDoctorJson.Rows[i].MDL_Number == null ? '' : dcrAccDoctorJson.Rows[i].MDL_Number;
                var specialityName = dcrAccDoctorJson.Rows[i].Speciality_Name == null ? '' : dcrAccDoctorJson.Rows[i].Speciality_Name;
                var CategoryName = dcrAccDoctorJson.Rows[i].Category_Name == null ? '' : dcrAccDoctorJson.Rows[i].Category_Name;
                var visitMode = dcrAccDoctorJson.Rows[i].Visit_Mode == null ? '' : dcrAccDoctorJson.Rows[i].Visit_Mode;
                var visitTime = dcrAccDoctorJson.Rows[i].Doctor_Visit_Time == null ? '' : dcrAccDoctorJson.Rows[i].Doctor_Visit_Time;
                var po_Amount = dcrAccDoctorJson.Rows[i].PO_Amount == null ? '' : dcrAccDoctorJson.Rows[i].PO_Amount;
                var remarks = dcrAccDoctorJson.Rows[i].Remarks_By_User == null ? '' : dcrAccDoctorJson.Rows[i].Remarks_By_User;
                var timemode = visitTime.length > 0 ? visitTime : visitMode.length > 0 ? visitMode : "AM";
                accDocHtml += "<tr>";
                accDocHtml += "<td>" + doctorName + "</td>";
                accDocHtml += "<td>" + mdlNumber + "</td>";
                accDocHtml += "<td>" + specialityName + "</td>";
                accDocHtml += "<td>" + CategoryName + "</td>";
                accDocHtml += "<td>" + timemode + "</td>";
                accDocHtml += "<td>" + po_Amount + "</td>";
                accDocHtml += "<td>" + remarks + "</td>";
                accDocHtml += "</tr>";
            }
            accDocHtml += "</tbody></table>";
            $('#dvAccDoctors').html(accDocHtml);
            $('#tblAccDoctor').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }

    }
}

function fnBindProductDetails(dcrProductJson) {
    if (dcrProductJson != null) {
        if (dcrProductJson.Rows.length > 0) {
            var productHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Sample/Promotional item Details</h3></div>";
            productHtml += "<table id='tblProducts'  class='data display dataTable box' style='width:85%'><thead><th>Doctor</th><th>Sample/Promotional item Name</th><th>Qty given</th><th>Speciality</th><th>Is_Detailed</th><th>Is_CPDoctor</th></thead>";
            productHtml += "<tbody>";
            for (var i = 0; i < dcrProductJson.Rows.length; i++) {
                var doctorName = dcrProductJson.Rows[i].Doctor_Name == null ? '' : dcrProductJson.Rows[i].Doctor_Name;
                var productName = dcrProductJson.Rows[i].Product_Name == null ? '' : dcrProductJson.Rows[i].Product_Name;
                var quantityProvided = dcrProductJson.Rows[i].Quantity_Provided == null ? '' : dcrProductJson.Rows[i].Quantity_Provided;
                var currentStcok = dcrProductJson.Rows[i].Current_Stock == null ? '0' : dcrProductJson.Rows[i].Current_Stock;
                var specilaityName = dcrProductJson.Rows[i].Speciality_Name == null ? '' : dcrProductJson.Rows[i].Speciality_Name;
                var detailed = dcrProductJson.Rows[i].Detailed == null ? '' : dcrProductJson.Rows[i].Detailed;
                var isCpDoc = dcrProductJson.Rows[i].Is_CP_Doc == null ? '' : dcrProductJson.Rows[i].Is_CP_Doc;

                productHtml += "<tr>";
                productHtml += "<td>" + doctorName + "</td>";
                productHtml += "<td>" + productName + "</td>";
                productHtml += "<td>" + quantityProvided + "</td>";
               // productHtml += "<td>" + currentStcok + "</td>";
                productHtml += "<td>" + specilaityName + "</td>";
                productHtml += "<td>" + detailed + "</td>";
                productHtml += "<td>" + isCpDoc + "</td>";
                productHtml += "</tr>";
            }
            productHtml += "</tbody></table>";
            $('#dvProducts').html(productHtml);
            $('#tblProducts').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }

    }
}

function fnBindChemistDetails(dcrChemistJson) {
    if (dcrChemistJson != null) {
        if (dcrChemistJson.Rows.length > 0) {
            var chemistHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Chemist Details</h3></div>";
            chemistHtml += "<table id='tblChemist' style='width:85%' class='data display dataTable box'><thead><th>Chemist Name</th><th>POB Amount</th></thead>";
            chemistHtml += "<tbody>";
            for (var i = 0; i < dcrChemistJson.Rows.length; i++) {
                var chemistName = dcrChemistJson.Rows[i].Chemists_Name == null ? '' : dcrChemistJson.Rows[i].Chemists_Name;
                var poAmount = dcrChemistJson.Rows[i].PO_Amount == null ? '' : dcrChemistJson.Rows[i].PO_Amount;
                chemistHtml += "<tr>";
                chemistHtml += "<td>" + chemistName + "</td>";
                chemistHtml += "<td>" + poAmount + "</td>";
                chemistHtml += "</tr>";
            }
            chemistHtml += "</tbody></table>";
            $('#dvChemists').html(chemistHtml);
            $('#tblChemist').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }
    }
}

function fnBindRCPADetails(dcrRCPAJson) {
    if (dcrRCPAJson != null) {
        if (dcrRCPAJson.Rows.length > 0) {
            var rcpaHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>RCPA Details</h3></div>";
            rcpaHtml += "<table id='tblRCPA'  class='data display dataTable box' style='width:85%'><thead><th>Doctor Name</th><th>Product Name</th><th>Chemist Name</th><th>Competitor Product Name</th><th>Support Qty</th></thead>";
            rcpaHtml += "<tbody>";
            for (var i = 0; i < dcrRCPAJson.Rows.length; i++) {
                var doctorName = dcrRCPAJson.Rows[i].Doctor_Name == null ? '' : dcrRCPAJson.Rows[i].Doctor_Name;
                var productName = dcrRCPAJson.Rows[i].Product_Name == null ? '' : dcrRCPAJson.Rows[i].Product_Name;
                var chemistName = dcrRCPAJson.Rows[i].Chemists_Name == null ? '' : dcrRCPAJson.Rows[i].Chemists_Name;
                var compProdName = dcrRCPAJson.Rows[i].Competitor_Product_Name == null ? '' : dcrRCPAJson.Rows[i].Competitor_Product_Name;
                var supportQty = dcrRCPAJson.Rows[i].Support_Qty == null ? '' : dcrRCPAJson.Rows[i].Support_Qty;
                rcpaHtml += "<tr>";
                rcpaHtml += "<td>" + doctorName + "</td>";
                rcpaHtml += "<td>" + productName + "</td>";
                rcpaHtml += "<td>" + chemistName + "</td>";
                rcpaHtml += "<td>" + compProdName + "</td>";
                rcpaHtml += "<td>" + supportQty + "</td>";
                rcpaHtml += "</tr>";
            }
            rcpaHtml += "</tbody></table>";
            $('#dvRCPA').html(rcpaHtml);
            $('#tblRCPA').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }
    }
}

function fnBindStockiestDetails(dcrStockiestJson) {
    if (dcrStockiestJson != null) {
        if (dcrStockiestJson.Rows.length > 0) {
            var stockistHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Stockist Details</h3></div>";
            stockistHtml += "<table id='tblstockist' style='width:85%' class='data display dataTable box'><thead><th>Stockist Name</th><th>Visit Mode</th><th>Remarks</th></thead>";
            stockistHtml += "<tbody>";
            for (var i = 0; i < dcrStockiestJson.Rows.length; i++) {
                var stockiestName = dcrStockiestJson.Rows[i].Stockiest_Name == null ? '' : dcrStockiestJson.Rows[i].Stockiest_Name;
                var visitMode = dcrStockiestJson.Rows[i].Visit_Mode == null ? '' : dcrStockiestJson.Rows[i].Visit_Mode;
                var remarks = dcrStockiestJson.Rows[i].Remarks_By_User == null ? '' : dcrStockiestJson.Rows[i].Remarks_By_User;
                stockistHtml += "<tr>";
                stockistHtml += "<td>" + stockiestName + "</td>";
                stockistHtml += "<td>" + visitMode + "</td>";
                stockistHtml += "<td>" + remarks + "</td>";
                stockistHtml += "</tr>";
            }
            stockistHtml += "</tbody></table>";
            $('#dvStockiest').html(stockistHtml);
            $('#tblstockist').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }
    }
}

function fnBindExpenseDetails(dcrExpenseJson) {
    if (dcrExpenseJson != null) {
        if (dcrExpenseJson.Rows.length > 0) {
            var expenseHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Expense Details</h3></div>";
            expenseHtml += "<table id='tblExpenseSummary' class='data display dataTable box' style='width:85%' ><thead><th>Expense Name</th><th>Amount</th><th>Remarks</th></thead>";
            expenseHtml += "<tbody>";
            for (var i = 0; i < dcrExpenseJson.Rows.length; i++) {
                var expenseTypeName = dcrExpenseJson.Rows[i].Expense_Type_Name == null ? '' : dcrExpenseJson.Rows[i].Expense_Type_Name;
                var expenseAmount = dcrExpenseJson.Rows[i].Expense_Amount == null ? '' : dcrExpenseJson.Rows[i].Expense_Amount;
                var expenseRemarks = dcrExpenseJson.Rows[i].Expense_Remarks == null ? '' : dcrExpenseJson.Rows[i].Expense_Remarks;
                expenseHtml += "<tr>";
                expenseHtml += "<td>" + expenseTypeName + "</td>";
                expenseHtml += "<td>" + expenseAmount + "</td>";
                expenseHtml += "<td>" + expenseRemarks + "</td>";
                expenseHtml += "</tr>";
            }
            expenseHtml += "</tbody></table>";
            $('#dvExpense').html(expenseHtml);
            $('#tblExpense').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }
    }
}

function fnBindAttendanceDetails(dcrAttendance) {
    if (dcrAttendance != null) {
        if (dcrAttendance.Rows.length > 0) {
            var attendanceHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Attendance Details</h3></div>";
            attendanceHtml += "<table id='tblAttendance' class='data display dataTable box' style='width:85%' ><thead><th>Project</th><th>Activity</th><th>Start Time</th><th>End Time</th><th>Remarks</th></thead>";
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
                attendanceHtml += "</tr>";
            }
            attendanceHtml += "</tbody></table>";
            $('#dvAttendance').css('display', '');
            $('#dvAttendance').html(attendanceHtml);
            $('#tblAttendance').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }
    }
}

function fnBindDetailedProducts(dcrProductJson) {
    if (dcrProductJson != null) {
        if (dcrProductJson.Rows.length > 0) {
            var prodHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Detailed Product Details</h3></div>";
            prodHtml += "<table id='tblDetailedProduct'  class='data display dataTable box' style='width:85%'><thead><th>Doctor</th><th>Detailed Product</th></thead>";
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
            $('#tblDetailedProduct').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }
    }
}

function fnBindDoctorAccompanists(dcrDocAccson) {
    if (dcrDocAccson != null) {
        if (dcrDocAccson.Rows.length > 0) {
            var accHtml = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Doctor Accompanist Details</h3></div>";
            accHtml += "<table id='tblDocAcc'  class='data display dataTable box' style='width:85%'><thead><th>Doctor</th><th>Accompanist Name</th><th>Accompanist Region</th><th>Accompanist User type</th><th>Independent Doctor</th></thead>";
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
            $('#tblDocAcc').dataTable({
                "bFilter": false,
                "bPaginate": false,
                "sPaginationType": "full_numbers",
                "bInfo": false,
                // "sScrollX": "100%",
                "bSort": false
            });
        }

    }
}

function fnShowAccDoctor(obj) {
    if ($("#dvOverLay").css('display') == 'none') {
        $('#divAccDocDetail').html('')
        $('#divAccDocDetail').html(accHeaderTableString_g);
        var accName = document.getElementById(obj.id).innerHTML;
        var accStartTimeId = obj.id.replace(/AccPersonName/g, 'AccStartTime');
        var accEndTimeId = obj.id.replace(/AccPersonName/g, 'AccEndTime');
        var accTime = document.getElementById(accStartTimeId).innerHTML + "-" + document.getElementById(accEndTimeId).innerHTML;

        var userName = $('#spnuserName').html();
        var regionName = $('#spniregionName').html();
        var empName = $('#spniEmpName').html();
        var dcrDate = $("#spndate").html().split('-')[1] + "/" + $("#spndate").html().split('-')[0] + "/" + $("#spndate").html().split('-')[2];
        var dcrType = $("#spnTypeofDCR").html().replace('Work', '');
        var workplace = $('#spnPlaceWorked').html();
        var dcrEnterDate = $('#spndcrEnteredDate').html();
        var dcrStatus = $('#spnDCRStatus').html();

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
        $('#tdTravlledPlaces').html(travlePlaces);
        $('#accPopUpName').html(accName);
        $('#accPopUpTime').html(accTime);
        $("#dvOverLay").overlay().load();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetAccompanistVisitedDoctors',
            data: "DCR_User_Code=" + userCode + "&Acc_User_Name=" + accName + "&DCR_User_Name=" + userName
                + "&DCR_Actual_Date=" + dcrDate,
            success: function (response) {
                var accHTML = $('#divAccDocDetail').html() + '<span>*Doctor Details</span><br />' + response;
                $('#divAccDocDetail').html(accHTML + '<br /><span>*the data that you see here is indicative only.</span>');
            },
            error: function () {
                fnMsgAlert('info', 'DCR Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }

}

function fnShowDetailedProducts(rI, docCode) {
    $('#divDetailPrdDetail').html('')
    $('#divDetailPrdDetail').html(detailProdString_g);

    var docName = $('#docname_' + rI).html();
    var docmdl = $('#docmdl_' + rI).html();
    var cate = $('#docCategory_' + rI).html();
    var spec = $('#docspec_' + rI).html();
    var dcrDate = $("#spndate").html().split('-')[1] + "/" + $("#spndate").html().split('-')[0] + "/" + $("#spndate").html().split('-')[2]+"^";
    var dcr_user_Code = $("#hdnUserCode").val();
    var dcrDates = "";
    var userName = $('#spnuserName').html();
    var regionName = $('#spniregionName').html();
    var empName = $('#spniEmpName').html();
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
        url: '../HiDoctor_Activity/InstantReport/SetDCRUnapprove',
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
                    tblCont += "<table cellspacing='0' cellpadding='0' id='tblMissedDoc' class='data display dataTable box' width='100%'>";
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
        url: '../HiDoctor_Activity/DailyCallPlanner/GetDailyCallPlanner',
        data: "dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != '') {
                var dailyPlan = eval('(' + jsData + ')');
                //dailyPlan.Tables[0].Rows.length

                var tblCont = "";
                if (!(dailyPlan.Tables === undefined) && dailyPlan.Tables.length > 0 && dailyPlan.Tables[0].Rows.length > 0) {
                    tblCont += "<table cellspacing='0' cellpadding='0' id='tblDailyPlannerHeader' class='data display dataTable box' width='85%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr>";
                    tblCont += "<th>Employee Name : " + dailyPlan.Tables[0].Rows[0]["Employee_Name"] + "</th>";
                    tblCont += "<th>Category : " + dailyPlan.Tables[0].Rows[0]["Category"] + "</th>";
                    tblCont += "<th>CP Name : " + dailyPlan.Tables[0].Rows[0]["CP_Name"] + "</th>";
                    tblCont += "<th>Distance : " + dailyPlan.Tables[0].Rows[0]["Distance"] + "</th>";
                    tblCont += "</tr>";
                    tblCont += "<tr>";
                    tblCont += "<th>Working with :" + dailyPlan.Tables[0].Rows[0]["Accomp_Name"] + "</th>";
                    tblCont += "<th>Contact point :" + dailyPlan.Tables[0].Rows[0]["Meeting_Point"] + "</th>";
                    tblCont += "<th>Time :" + dailyPlan.Tables[0].Rows[0]["Meeting_Time"] + "</th>";
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
        url: '../HiDoctor_Activity/DailyCallPlanner/GetDailyCallPlannerDoctorDetails',
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
        url: '../HiDoctor_Activity/DailyCallPlanner/GetDoctorProductMappingDetail',
        data: "customerCode=" + (id.id).split('_')[1],
        success: function (jsData) {
            if (jsData != "") {
                var docProd = eval('(' + jsData + ')');
                if (!(docProd.Tables === undefined) && docProd.Tables.length > 0 && docProd.Tables[0].Rows.length > 0) {
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
                    for (var i = 0; i < docProd.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + docProd.Tables[0].Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + docProd.Tables[0].Rows[i]["Product_Type_Name"] + "</td>";
                        content += "<td>" + docProd.Tables[0].Rows[i]["Support_Quantity"] + "</td>";
                        content += "<td>" + docProd.Tables[0].Rows[i]["Potential_Quantity"] + "</td>";
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
        url: '../HiDoctor_Activity/DailyCallPlanner/GetProductGivenInLastMonth',
        data: "customerCode=" + (id.id).split('_')[1] + "&type=" + type + "&dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Tables === undefined) && product.Tables.length > 0 && product.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Given Date</th>";
                    content += "<th>Quantity given</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Tables[0].Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["DCR_Actual_Date"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["Quantity_Provided"] + "</td>";
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
        url: '../HiDoctor_Activity/DailyCallPlanner/GetNonSampleGivenYTD',
        data: "customerCode=" + (id.id).split('_')[1] + "&YTDType=" + $("#hdnYTD").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Tables === undefined) && product.Tables.length > 0 && product.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Given Date</th>";
                    content += "<th>Quantity given</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Tables[0].Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["DCR_Actual_Date"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["Quantity_Provided"] + "</td>";
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
        url: '../HiDoctor_Activity/DailyCallPlanner/GetOurBrandProducts',
        data: "customerCode=" + (id.id).split('_')[1] + "&dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Tables === undefined) && product.Tables.length > 0 && product.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width:85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Tables[0].Rows[i]["Product_Name"] + "</td>";
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
        url: '../HiDoctor_Activity/DailyCallPlanner/GetCompetitorBrandProducts',
        data: "customerCode=" + (id.id).split('_')[1] + "&dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Tables === undefined) && product.Tables.length > 0 && product.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 85%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='85%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Competitor Product Name</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Tables[0].Rows[i]["Own_Product_Name"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["Competitor_Product_Name"] + "</td>";
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
    tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>You have planned leave on " + dateFormate + "</h3></div>";
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
        url: '../HiDoctor_Activity/DailyCallPlanner/GetAttendanceDetail',
        data: "dcrDate=" + $("#hdnDCRDate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var attn = eval('(' + jsData + ')');
                if (!(attn.Tables === undefined) && attn.Tables.length > 0 && attn.Tables[0].Rows.length > 0) {
                    var dateFormate = $("#hdnDCRDate").val().split('-')[2] + '/' + $("#hdnDCRDate").val().split('-')[1] + '/' + $("#hdnDCRDate").val().split('-')[0];
                    tblCont = "<div ><h3 style='width: 85%;margin:0px auto;padding-top: 20px;'>You have attendance on " + dateFormate + ".(" + attn.Tables[0].Rows[0]["Activity_Name"] + ")</h3></div>";
                    $("#divDailyCallHeader").html(tblCont);
                    return;
                }
            }
        }
    });
    
}

//***************************** END - DAILY CALL PLANNER ****************************//