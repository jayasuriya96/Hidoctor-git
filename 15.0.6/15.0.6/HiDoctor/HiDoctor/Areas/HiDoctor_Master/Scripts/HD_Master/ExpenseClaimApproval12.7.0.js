
var dcr_fromDate = "";
var dcr_toDate = "";
var claim_Code = "";
var selectedUser_Code = "";
var imglst = '';
var expenselength = 0;
function fnGetPendingClaimRequest() {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetPendingClaimRequestByUser',
        data: "Company_Code=" + Company_Code + "&User_Code=" + User_Code + "&User_Type_Code=" + User_Type_Code + "&User_Type_Name=" + (User_Type_Name.replace(/ /g, '_')) + "&searchKey=" + $('#txtClaimSearch').val() + "",
        success: function (result) {
            if (result != '') {
                $('#dvPendingClaim').html(result);
                $("#divMultipleClose").html('');
                var chkcount = $("#divBtnName").text();
                if (chkcount.split('#')[1] != '')
                    if (parseInt(chkcount.split('#')[1]) > 0) {
                        $("#divMultipleClose").html("<div style='margin-left: 84%;margin-bottom: 16px; margin-top: 15px;'  class='btnStatus' type='button' name='Close'  id='btnMultipleClose' onclick='fnMultipleClose(" + chkcount.split('#')[1] + ")' >" + chkcount.split('#')[0] + "</div>");
                        $("#btnMultipleClose").hide();
                        $("#dvMultiplePayment").show();
                    }

            }
        }
    });
}
function fnCheckAll() {
    var boolval = $("input[name='selectAll']").prop('checked');
    $("#tblPendingRequest tbody tr input[name='chkbox']").prop('checked', boolval);
    if (boolval) {
        $("#btnMultipleClose").show();
    }
    else {
        $("#btnMultipleClose").hide();
    }
}
var claimJson_g = "";
var claimTypeCRM = "";
var g_screenMode = "";
function fnEditRequest(event, editedValues) {
    debugger;
    //dvRightPanel
    var domElement = $(event.target);
    if ('checkbox' != domElement.attr('type')) {
        $("#spnClaim").html('Show Summary');
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        $('#dvLeftPanel').hide();
        $('#dvRightPanel').show();
        var claimCode = editedValues.split('_')[0];
        var userCode = editedValues.split('_')[1];
        var requestName = editedValues.split('_')[2];
        var favUserCode = editedValues.split('_')[3];
        var statusCode = editedValues.split('_')[4];
        var moveOrder = editedValues.split('_')[5];
        var cycleCode = editedValues.split('_')[6];
        var requestCode = editedValues.split('_')[7];
        var claimUserTypeName = editedValues.split('_')[8];
        var claimdatetime = editedValues.split('_')[9];
        var screenMode = editedValues.split('_')[10];
        g_screenMode = screenMode;
        $('#hdnStatusCode').val(statusCode);
        $('#hdnCycleCode').val(cycleCode);
        $('#hdnMoveOrder').val(moveOrder);
        $('#hdnFavouringUsercode').val(favUserCode);
        $('#hdnExpenseclaimcode').val(claimCode);
        $('#hdnClaimDate').val(claimdatetime);
        $("#hdnScreenMode").val(screenMode);
        expensePrivilege_g = screenMode;
        if (screenMode.toUpperCase() == "MONTHLY") {
            $("#dvExpClaimMonthlyDetails").css("display", ""); 
            $(".monthDcrHide").css("vertical-align", "middle");
        }
        else {
            $("#dvExpClaimMonthlyDetails").css("display", "none");
        }
        //fnGetPrivilegeforExpense(favUserCode);

        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/Expense/GetClaimRequestDetails',
            data: "claimCode=" + claimCode + "&userCode=" + userCode + "&requestName=" + requestName + "&favouringUserCode=" + favUserCode + "&requestCode=" + requestCode + "&Company_Code=" + Company_Code + "&Loged_User_Code=" + User_Code,
            success: function (result) {
                debugger;
                if (result != '') {
                    if (result.split('$').length > 1) {
                        var ar = result.split('$');
                        if (ar[5].length > 0) {
                            $("#dvAddlExpDetails").show();
                            $("#dvAddlExpenseTypeAmountDetail").html(ar[5]);


                        }
                        else {
                            $("#dvAddlExpenseTypeAmountDetail").html('');
                            $("#dvAddlExpDetails").hide();
                        }
                        var claimJson = eval('(' + ar[3] + ')');
                        claimJson_g = claimJson;
                        expenselength = ar[6];
                        fnFillDetails(claimJson, requestName, ar[1], userCode);
                        $('#dvClaimDetails').html(ar[0]);
                        if (g_screenMode.toUpperCase() == "MONTHLY") {
                            $(".monthDcrHide").css("vertical-align", "middle");
                        }
                        else {
                            $(".monthDcrHide").css("display", "none");
                        }
                        $("#dvClaimHistoryPopUp").html(ar[2]);
                        // $("#dvExpenseTypeAmountDetail").html(ar[4]);
                        //$("#dvRightPanel").unblock();
                        $('.clsCheckSpecial').blur(function () { fnCheckBillNumSpecialChar(this); });
                        $('.clsCheckRemarks').blur(function () { fnCheckAdminRemarksSpecialChar(this); });
                        // $('#dvExpenseTypeAmount').hide();
                        if (ar[1] == "REQUEST_CUSTOMER_FOR") {
                            debugger;
                            $('#dvExpenseTypeAmount').hide();
                            $('#dvExpenseTypeAmountDetail').hide();
                            $('#superscript').hide();
                            $('#ItemWiseDeduction').hide();
                            $('#spnItemwiseDeduction').hide();
                            $("#dvExpDetails").hide();
                            $("#superscript").hide();
                            claimTypeCRM = "REQUEST_CUSTOMER_FOR";

                        }
                        else {
                            $("#superscript").show();
                            $("#dvExpDetails").show();
                            $("#dvExpDCRDetails").hide();
                            fnExpandSFCDetails();

                        }
                        fnExpandItemwiseDetailsTotal();
                        //$(".numbersOnly").keypress(function (e) {
                        //    //if the letter is not digit then display error and don't type anything
                        //    if (e.which != 8 && e.which != 0 && e.key != "." && (e.which < 48 || e.which > 57)) {
                        //        return false;
                        //    }
                        //});
                    }
                }
            },
            error: function () {
                $("#dvRightPanel").unblock();
            },
            complete: function () {
                debugger;
                $("#main").unblock();
                fnGetStatus(cycleCode, moveOrder, claimUserTypeName);
                fnGetClosedStatus(claimCode, cycleCode, moveOrder, claimUserTypeName);
            }
        });
        fnBindDocDetails(claimCode);
    }
    else {
        debugger;
        fnEnableDisableMultipleCloseBtn();
    }
}
function fnFillDetails(claimJson, requestName, claimType, userCode) {
    debugger;
    if (claimJson != '') {
        if (claimJson[0].lstUser != '') {

            $('#spnEmployeeNo').html(claimJson[0].lstUser[0].Employee_Number);
            $('#spnReportingUserName').html(claimJson[0].lstUser[0].Reporting_Manager_Name);
            $('#spnClaimUserName').html(claimJson[0].lstUser[0].User_Name);
            $('#spnReportingRegionName').html(claimJson[0].lstUser[0].Reporting_Manager_Region_Name);
            $('#spnEmployeeName').html(claimJson[0].lstUser[0].Employee_Name);
            $('#spnEmpAccountNo').html(claimJson[0].lstUser[0].Acc_No);
            $('#spnRegionName').html(claimJson[0].lstUser[0].Region_Name);
            $('#spnMobileNo').html(claimJson[0].lstUser[0].User_Mobile_Number);
            $('#spnDesigantion').html(claimJson[0].lstUser[0].User_Type_Name);
            $('#spnDOJ').html(claimJson[0].lstUser[0].DOJ);
            $('#spnDivision').html(claimJson[0].lstUser[0].Division_Name);
            dcr_fromDate = claimJson[0].lstClaimHeader[0].Date_From;
            dcr_toDate = claimJson[0].lstClaimHeader[0].Date_To;
            claim_Code = claimJson[0].lstClaimHeader[0].Claim_Code;
            selectedUser_Code = userCode;
        }
        var tblContent = "";
        var Rem_By_Usr = "";
        
        tblContent += "<table id='tblRemarks'>";
        if (claimJson[0].lstClaimRemarks != '') {
            for (var i = 0; i < claimJson[0].lstClaimRemarks.length; i++) {
                if (claimJson[0].lstClaimRemarks[i].Remarks_By_User == undefined)
                {
                    Rem_By_Usr = "";
                }
                else
                {
                    Rem_By_Usr = claimJson[0].lstClaimRemarks[i].Remarks_By_User;
                }
                tblContent += "<tr><td><div class='col-lg-12'>";
                tblContent += "<div class='col-lg-12' style='font-size: 13px;'><span class='user'></span>" + claimJson[0].lstClaimRemarks[i].User_Name
                                                        + " </div><div class='dvEnteredRemarks col-lg-12'>"
                                                            + Rem_By_Usr + "</div></div></td> </tr>";
            }
        }
        tblContent += "<tr><td><div class='col-lg-12'>";
        tblContent += "<div class='col-lg-12' style='font-size: 13px;'><span class='user'></span>" + $("#spnUser").html().split('(')[0] + " | "
                + curRegionName + "</div> ";
        tblContent += "<div  class='col-lg-12' style='font-size: 13px;'> <textarea id='txtAdminRemarks' class='form-group' maxlength='1000'></textarea></div></div></td> </tr>";
        tblContent += "</table>";
        if (tblContent == 'undefined') {
            tblContent = "";
            $('#dvConRemarks').html(tblContent);
        }
        else
        {
            $('#dvConRemarks').html(tblContent);
        }
        if (claimJson[0].lstClaimHeader != '') {
            debugger;
            $("#hdnExpType").val(claimType.toUpperCase());
            $('#dvClaimCode').html(claimJson[0].lstClaimHeader[0].Claim_Code);
            $('#dvClaimStatus').html('<div class="col-lg-2">Status Name : </div> <div id="dvSName" class="col-lg-2">' + claimJson[0].lstClaimHeader[0].Status_Name + '</div>'
                + '<div class="col-lg-3"> <a onclick="fnShowHistory();" style="cursor:pointer;">Status History</a></div>' + '<div class="col-lg-3"> <a id="lnkShowDedctionDetailsEdit" onclick="fnOpenDeductionDetailPopUp(\'' + claimJson[0].lstClaimHeader[0].Claim_Code + '\',\'' + userCode + '\');" style="cursor:pointer;">Show Deduction Detail</a></div>');
            $("#spnItemwiseDeduction").html(parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction).toFixed(2));
            $("#txtOtherDeduction").val(parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction).toFixed(2));
            $("#spnTotalClaimAmount").html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
            var totalDeduction = parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction) + parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction);
            $('#spnTotalDeductionAmount').html(parseFloat(totalDeduction).toFixed(2));

            $("#spnTotalApprovedAmount").html(parseFloat(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount) - parseFloat(totalDeduction)).toFixed());

            if (claimType.toUpperCase() == "FIELD_EXPENSE_REQUEST_FOR") {
                debugger;
                $("#lnkShowDedctionDetailsEdit").show();
                $('#trDcrDate').show();
                $("#dvDeductionPanel").show();
                $("#dvClaimDetailsPanel").show();
                $('#dvClaimHeaderPanel').show();
                $('#tdDcrDateTitle').show();
                $('#tdDcrDate').show();
                $('#tdTotalDeductionTitle').show();
                $('#tdTotalDeduction').show();
                $('#spnDcrDate').html(claimJson[0].lstClaimHeader[0].Date_From + ' to ' + claimJson[0].lstClaimHeader[0].Date_To);
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
                var totalDeduction = parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction) + parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction);
                if (claimJson[0].lstClaimHeader[0].Order_No != "1") {
                    $('#txtOtherDeductionAmount').val(parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction));
                }

                $('#spnTotalDeduction').html(parseFloat(totalDeduction).toFixed(2));
                $('#spnApprovedAmount').html(parseFloat(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount) - parseFloat(totalDeduction)).toFixed(2));
            }
            else if (claimType.toUpperCase() == "REQUEST_CUSTOMER_FOR") {
                debugger;
                $("#lnkShowDedctionDetailsEdit").hide();
                $('#tdDcrDateTitle').hide();
                $('#tdDcrDate').hide();
                $("#dvDeductionPanel").show();
                $("#dvClaimDetailsPanel").show();
                $('#dvClaimHeaderPanel').show();
                $('#tdTotalDeductionTitle').show();
                $('#tdTotalDeduction').show();
                $('#spnDcrDate').html(claimJson[0].lstClaimHeader[0].Date_From + ' to ' + claimJson[0].lstClaimHeader[0].Date_To);
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
                var totalDeduction = parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction) + parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction);
                $('#txtOtherDeductionAmount').val(parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction).toFixed(2));
                $('#spnTotalDeduction').html(parseFloat(totalDeduction).toFixed(2));
                $('#spnApprovedAmount').html(parseFloat(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount) - parseFloat(totalDeduction)).toFixed(2));


               
            }
            else {
                debugger;
                $("#dvDeductionPanel").hide();
                $("#dvClaimDetailsPanel").hide();
                $('#dvClaimHeaderPanel').hide();
                $('#tdDcrDateTitle').hide();
                $('#tdDcrDate').hide();
                $('#tdTotalDeductionTitle').hide();
                $('#tdTotalDeduction').hide();
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
            }
            $('.clsCheckSpecial').blur(function () { fnCheckBillNumSpecialChar(this); });
            $('.clsCheckRemarks').blur(function () { fnCheckAdminRemarksSpecialChar(this); });
        }
    }
}

//function fnOpenDeductionDetailPopUp(claimCode, userCode) {
//    ShowModalPopup("dvloading");
//    $.ajax({
//        type: 'POST',
//        url: '../HiDoctor_Reports/ExpenseGroupReport/GetExpenseClaimDeductionDetailPopUp',
//        data: 'claimCode=' + claimCode + '&userCode=' + userCode,
//        success: function (response) {
//            if (response != "" && response.split('^')[0] != "FAIL") {
//                $("#divclaimDeductionDetail").html("<div class='col-lg-12'><div id='dvPrint' onclick='fnPrint(\"dvPrintPopupContent\",\"ifrmPrintPopUp\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;float:left;left:95%;'></div><div style='clear:both;'></div></div><div style='clear:both;'></div>");
//                $("#divclaimDeductionDetail").append(response);
//                $("#dvPrintPopupContent").html(response);
//                // fninializePrint("dvPrintPopupContent", "ifrmPrintPopUp", "dvOverLay");
//                $("#dvOverLay").overlay().load();
//                HideModalPopup("dvloading");
//            }
//            else {
//                fnMsgAlert('info', 'Expense Claim Alumni Report', 'Error.' + response.split('^')[1]);
//                HideModalPopup("dvloading");
//            }
//        },
//        error: function () {
//            fnMsgAlert('info', 'Report', 'Error.');
//            HideModalPopup("dvloading");
//        }
//    });
//}

function fnShowDetails() {
    debugger;
    if ($("#spnClaim").html() == "Hide Summary") {
        if ($('#hdnExpenseclaimcode').val() != "") {
            $("#dvLeftPanel").hide();
            $("#dvRightPanel").show();
            $("#spnClaim").html('Show Summary');
        }
        else {
            debugger;
            fnMsgAlert("info", "Claim Approval", "Please click on the claim row.Then view/edit the claim details.");
            return false;
        }
    }
    else {
        debugger;
        $("#dvRightPanel").hide();
        $("#dvLeftPanel").show();
        $("#spnClaim").html('Hide Summary');

    }
}

function fnShowHistory() {
    debugger;
    $("#dvHistoryPopUp").overlay().load();
}

function fnGetStatus(cycleCode, moveOrder, claimUserTypeName) {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetMappedStatusCycle',
        data: "cycleCode=" + cycleCode + "&moveOrder=" + moveOrder + "&Company_Code=" + Company_Code + "&User_Type_Name=" + (User_Type_Name.replace(/ /g, '_')) + "&User_Name=" + User_Name + "&Region_Name=" + (curRegionName.replace(/ /g, '_')),
        success: function (result) {
            if (result != '') {
                var statusJson = eval('(' + result.split('^')[0] + ')');
                var content = "";
                if (statusJson.length > 0) {
                    //content = "<div style='float:left'>Change Status - </div>";
                    var styleCode = "";
                    for (var i = 0; i < statusJson.length; i++) {
                        if (parseInt(statusJson[i].Move_Order) > parseInt(statusJson[i].Order_No)) {
                            styleCode = "background-color:green;";
                        }
                        else if (parseInt(statusJson[i].Move_Order) < parseInt(statusJson[i].Order_No)) {
                            styleCode = "background-color:red;";
                        }
                        else if (parseInt(statusJson[i].Move_Order) == parseInt(statusJson[i].Order_No)) {
                            styleCode = "background-color:blue;";
                        }
                        content += "<div class='btnStatus' style=" + styleCode + " id='dv_" + statusJson[i].Status_Name + "'  onclick='fnApproveClaim(\"" + statusJson[i].Status_Code
                                                 + "\",\"" + statusJson[i].Order_No + "\",\"" + expensePrivilege_g + "\",\"" + claimUserTypeName + "\",\"" + statusJson[i].Move_Order + "\");' >" + statusJson[i].Status_Name + "</div>";

                    }
                    $("#dvAction").html("<div style='float:left'>Change Status - </div>" + content);
                    $("#dvBottomStatus").html(content);
                }

            }
        }
    });
}

function fnGetClosedStatus(claimCode, cycleCode, moveOrder, claimUserTypeName) {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetStatusCyle',
        data: "cycleCode=" + cycleCode + "&moveOrder=" + moveOrder + "",
        async: 'false',
        success: function (result) {
            debugger;
            if (result != '') {
                if (result.toUpperCase() == "APPROVED") {

                    $('#dvPaymentDetails').show();

                    var PaymentAutoFill = [];
                    var Payment = {};
                    Payment.label = "Cheque Or DD";
                    Payment.value = "Cheque";
                    PaymentAutoFill.push(Payment);
                    Payment = {};
                    Payment.label = "Cash";
                    Payment.value = "Cash";
                    PaymentAutoFill.push(Payment);
                    Payment = {};
                    Payment.label = "Others";
                    Payment.value = "Others";
                    PaymentAutoFill.push(Payment);

                    //autoComplete(d_g, "txtDCust", "hdnDCust", 'autoCustEdit');

                    autoComplete(PaymentAutoFill, "txtModeOfPayment", "txtModeOfPayment", 'txtModeOfPayment');
                }
                else if (result.toUpperCase() == "CLOSED") {
                    $('#dvPaymentDetails').show();
                    $.ajax({
                        type: "POST",
                        url: '../HiDoctor_Master/Expense/GetCRMPaymentDetails',
                        data: "companyCode=" + Company_Code + "&ClaimCode=" + claimCode,
                        async: 'false',
                        success: function (result) {
                            debugger;
                            if (result != '') {
                                debugger;
                                var paymentMode = result[0].Payment_Mode;
                                var remarks = result[0].Payment_Remarks;
                                $('#txtModeOfPayment').val(paymentMode);
                                $('#txtPaymentRemarks').val(remarks);
                            }

                        }
                    });
                }
            }
        }
    });
}

function fnShowSFC(dcrDate, userCode, flag) {
    debugger;
    //GetDCRSFCData
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetDCRSFCData',
        data: "userCode=" + userCode + "&dcrDate=" + dcrDate + "&dcrFlag=" + flag + "&Company_Code=" + Company_Code,
        success: function (result) {
            $("#dvSFC").html(result);
            $("#dvSFCPopUp").overlay().load();
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function regExforAlphaNumericSpecificRemarks(value) {
    var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
    //var specialCharregex = new RegExp("^[''!@#$%^*?+=|]+$");
    if (specialCharregex.test(value) == true) {
        return false;
    }
    else {
        return true;
    }
}
var claimJson = new Array();
function fnApproveClaim(statusCode, orderNo, expensePrivilegevalue, claimUserTypeName, moveOrder) {
    debugger;
    if (confirm("Do you want to change the status of this claim ?")) {
        if ($.trim($("#dvClaimCode").html()) == '') {
            fnMsgAlert('info', 'Information', 'Please select any one claim request then proceed');
            return;
        }
        var actualAmount = 0.00, otherDeductions = 0.00;

        var totalAmount = $("#spnTotalApprovedAmount").html();
        actualAmount = $('#spnTotalClaimAmount').html();
        var adminRemarks = $("#txtAdminRemarks").val();
        var favoringUserCode = $('#hdnFavouringUsercode').val();
        if ($.trim(adminRemarks) != "") {
            //var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
            if (!regExforAlphaNumericSpecificRemarks(adminRemarks)) {
                fnMsgAlert('info', 'Information', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Remarks.');
                return;
            }
        }
        var claimCode = $("#dvClaimCode").html();
        if (claimTypeCRM == "REQUEST_CUSTOMER_FOR") {
            //$("#dvClaimDetails table tr:first").remove();
            var tblLength = $("#dvClaimDetails table tr").length;
            tblLength--;
        }
        else {
            var addltblExpenselength = 0;
            var tblLength = parseInt(expenselength);
            var addltblExpenselength = $(".clsApplied td.trRow").length;
        }
        claimJson = new Array();
        if (tblLength > 0) {
            for (var i = 1; i <= tblLength; i++) {
                var claim = {};
                if ($("#hdnDCRExpenseCode_" + i).val() != null && $("#hdnDCRExpenseCode_" + i).val() != '') {
                claim.Bill_Number = $.trim($("#txtBillNumber_" + i).val());
                var deductionAmount = $.trim($("#txtDeduction_" + i).val());
                deductionAmount = deductionAmount.length == 0 ? 0 : parseFloat(deductionAmount);
                if (deductionAmount > 0) {
                    if ($("#txtAdminRemarks_" + i).attr("readonly") == null && $.trim($("#txtAdminRemarks_" + i).val()) == "") {
                        fnMsgAlert('info', 'Expense Claim Approval', 'Please enter the remarks at row number ' + i + ".");
                        return false;
                    }
                }
                if ($.trim($("#txtAdminRemarks_" + i).val()) != "") {
                    //var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
                    if (!regExforAlphaNumericSpecificRemarks($("#txtAdminRemarks_" + i).val())) {
                        fnMsgAlert('info', 'Information', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Remarks. Error at row number ' + i);
                        return;
                    }
                }
                claim.Managers_Approval_Remark = $.trim($("#txtAdminRemarks_" + i).val());
                if ($.trim($("#spnApproved_" + i).html()) == "") {
                    $("#spnApproved_" + i).html('0.00');
                }
                claim.Approved_Amount = parseFloat($("#spnApproved_" + i).html()).toFixed(2);
                claim.Expense_Amount = parseFloat($("#spnClaimAmount_" + i).html()).toFixed(2);
                claim.DCR_Expense_Code = $('#hdnDCRExpenseCode_' + i).val();
                claim.Claim_Detail_Code = $("#hdnClaimDetailCode_" + i).val();
                var dcrDate = $('#lbliddcracutalDate_' + i).val();
                dcrDate = dcrDate.split('-')[0] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[2];
                claim.DCR_Actual_Date = dcrDate;
                claim.Expense_Mode = "Automatic";
                claim.Expense_Type_Code = $('#hdnAutomaticExpenseCode_' + i).val();
                claimJson.push(claim);
                }
                else {
                    var claim = {};
                    claim.Bill_Number = $.trim($("#txtBillNumber_" + i).val());
                    var deductionAmount = $.trim($("#txtDeduction_" + i).val());
                    deductionAmount = deductionAmount.length == 0 ? 0 : parseFloat(deductionAmount);
                    if (deductionAmount > 0) {
                        if ($("#txtAdminRemarks_" + i).attr("readonly") == null && $.trim($("#txtAdminRemarks_" + i).val()) == "") {
                            fnMsgAlert('info', 'Expense Claim Approval', 'Please enter the remarks at row number ' + i + ".");
                            return false;
                        }
                    }
                    if ($.trim($("#txtAdminRemarks_" + i).val()) != "") {
                        //var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
                        if (!regExforAlphaNumericSpecificRemarks($("#txtAdminRemarks_" + i).val())) {
                            fnMsgAlert('info', 'Information', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Remarks. Error at row number ' + i);
                            return;
                        }
                    }
                    claim.Managers_Approval_Remark = $.trim($("#txtAdminRemarks_" + i).val());
                    if ($.trim($("#spnApproved_" + i).html()) == "") {
                        $("#spnApproved_" + i).html('0.00');
                    }
                    claim.Approved_Amount = parseFloat($("#spnApproved_" + i).html()).toFixed(2);
                    claim.Expense_Amount = parseFloat($("#spnClaimAmount_" + i).html()).toFixed(2);
                    claim.Claim_Detail_Code = $("#hdnClaimDetailCode_" + i).val();
                    var dcrDate = $('#lbliddcracutalDate_' + i).val();
                    dcrDate = dcrDate.split('-')[0] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[2];
                    claim.DCR_Actual_Date = dcrDate;
                    claim.Expense_Mode = "Manual";
                    claim.Expense_Type_Code = $('#hdnAutomaticExpenseCode_' + i).val();
                    claimJson.push(claim);
                }
            }
        }
        if (addltblExpenselength > 0) {
            for (var i = 1; i <= addltblExpenselength; i++) {
                var claim = {};
                claim.Bill_Number = $.trim($("#hdnAddlBillNum_" + i).val());
                var deductionAmount = $.trim($("#AddlExpCurrDed_" + i).val());
                deductionAmount = deductionAmount.length == 0 ? 0 : parseFloat(deductionAmount);
                if (deductionAmount > 0) {
                    if ($("#AddlAprDcrRem_" + i).attr("readonly") == null && $.trim($("#AddlAprDcrRem_" + i).val()) == "") {
                        fnMsgAlert('info', 'Expense Claim Approval', 'Please enter the remarks at row number ' + i + ".");
                        return false;
                    }
                }
                if ($.trim($("#AddlAprDcrRem_" + i).val()) != "") {
                    //var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
                    if (!regExforAlphaNumericSpecificRemarks($("#AddlAprDcrRem_" + i).val())) {
                        fnMsgAlert('info', 'Information', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Remarks. Error at row number ' + i);
                        return;
                    }
                }
                claim.Managers_Approval_Remark = $.trim($("#AddlAprDcrRem_" + i).val());
                if ($.trim($("#AddlExpAprAmt_" + i).html()) == "") {
                    $("#AddlExpAprAmt_" + i).html('0.00');
                }
                claim.Approved_Amount = parseFloat($("#AddlExpAprAmt_" + i).html()).toFixed(2);
                claim.Expense_Amount = parseFloat($("#AddlAprClaimAmt_" + i).html()).toFixed(2);
                claim.Claim_Detail_Code = $("#hdnAddlClaimDetCode_" + i).val();
                var dcrDate = $('#lblAddlExpiddcracutalDate_' + i).val();
                dcrDate = dcrDate.split('/')[0] + '-' + dcrDate.split('/')[1] + '-' + dcrDate.split('/')[2];
                claim.DCR_Actual_Date = dcrDate;
                claim.Expense_Mode = "Manual";
                claim.Expense_Type_Code = $('#AddlAprExpCode_' + i).val();
                claimJson.push(claim);
            }
        }
        //else {
        //    var claim = {};
        //    if ($.trim(adminRemarks) != "") {
        //        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
        //        if (!specialCharregex.test(adminRemarks)) {
        //            fnMsgAlert('info', 'Information', 'Please remove the special characters from admin remarks');
        //            return;
        //        }
        //    }
        //    claim.Managers_Approval_Remark = adminRemarks;
        //    claim.Approved_Amount = "0.00";
        //    claim.Claim_Detail_Code = claimCode;
        //    claimJson.push(claim);
        //}
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        debugger;
        var paymentMode = "";
        var paymentRemarks = "";
        debugger;
        if ($('.dvPaymentDetails').css('display') != '') {
            debugger;
            paymentMode = $("#txtModeOfPayment").val();
            paymentRemarks = $("#txtPaymentRemarks").val();
        }

        var obj = {};
        obj.claimCode = claimCode;
        obj.claimDetails = JSON.stringify(claimJson);
        obj.statusCode = statusCode;
        obj.approvedAmount = totalAmount;
        obj.adminRemarks = adminRemarks
        obj.orderNo = orderNo;
        obj.expensePrivilegevalue = expensePrivilegevalue;
        obj.OtherDeduction = $("#txtOtherDeductionAmount").val();
        obj.actualAmount = actualAmount;
        obj.claimUserTypeName = claimUserTypeName;
        obj.favoringUserCode = favoringUserCode;
        obj.ExpType = $("#hdnExpType").val();
        obj.payment_Mode = paymentMode;
        obj.payment_Remarks = paymentRemarks;
        obj.moveOrder = moveOrder;
        obj.Company_Code = Company_Code;
        obj.Region_Code = Region_Code;
        obj.User_Name = User_Name;
        obj.User_Type_Name = User_Type_Name;
        obj.Region_Name = curRegionName;
        obj.User_Type_Code = User_Type_Code;

        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/Expense/InsertExpenseClaimApproval',
            data: obj,
            //data: "claimCode=" + claimCode + "&claimDetails=" + escape(JSON.stringify(claimJson)) + "&statusCode=" + statusCode + "&approvedAmount="
            //                    + totalAmount + "&adminRemarks=" + escape(adminRemarks) + "&orderNo=" + orderNo + "&expensePrivilegevalue=" + expensePrivilegevalue + "&OtherDeduction="
            //                    + $("#txtOtherDeductionAmount").val() + "&actualAmount=" + actualAmount + "&claimUserTypeName=" + claimUserTypeName + "&favoringUserCode=" + favoringUserCode +
            //                      "&ExpType=" + $("#hdnExpType").val() + "&payment_Mode=" + paymentMode + "&payment_Remarks=" + paymentRemarks + "&moveOrder=" + moveOrder +"&Company_Code="+Company_Code,
            success: function (result) {
                if (!isNaN(result)) {
                    if (parseInt(result) > 0) {
                        fnMsgAlert('success', 'Success', 'Expense claim status changed successfully');
                        fnGetPendingClaimRequest();
                        $("#spnClaim").html('Show Summary');
                        fnShowDetails();
                        fnClearAll();

                    }
                    else {
                        fnMsgAlert('info', 'Error', 'Error while change the status of the expense claim');
                        return;
                    }
                }
                else {
                    fnMsgAlert('info', 'Error', 'Error while change the status of the expense claim');
                    return;
                }
            },
            error: function () {
            },
            complete: function () {
                $("#main").unblock();
            }
        });
    }
}

function fnCalcItemWiseApprovedAmount(rowNumber) {
    debugger;
    var deductionAmount = 0;
    var claimAmount = 0;
    var previousDeductionAmount = 0;
    if ($.trim($("#txtDeduction_" + rowNumber).val()) != '') {
        if (!isNaN($("#txtDeduction_" + rowNumber).val())) {
            if ($.trim($("#txtDeduction_" + rowNumber).val()) == '') {
                $("#txtDeduction_" + rowNumber).val('0.00');
            }
            deductionAmount = $.trim($("#txtDeduction_" + rowNumber).val());
            previousDeductionAmount = $.trim($("#spnpreviousDecAmount_" + rowNumber).html()) == NaN ? 0 : $.trim($("#spnpreviousDecAmount_" + rowNumber).html());
            claimAmount = $.trim($("#spnClaimAmount_" + rowNumber).html());

            if (previousDeductionAmount == "") {
                previousDeductionAmount = 0;
            }
            if ((parseFloat(claimAmount) >= ((parseFloat(previousDeductionAmount) + parseFloat(deductionAmount))))) {
                $("#spnApproved_" + rowNumber).html(parseFloat(claimAmount).toFixed(2) - (parseFloat(previousDeductionAmount) + parseFloat(deductionAmount)).toFixed(2));
            }
            else {
                fnMsgAlert('info', 'info', 'Deduction amount should not exceed claimed amount');
                return false;
            }
        }
        else {
            fnMsgAlert('info', 'info', 'Please enter numbers alone');
            $("#txtDeduction_" + rowNumber).val('0');
            return;
        }
    }
    else {
        $("#txtDeduction_" + rowNumber).val('0.00');
        deductionAmount = $.trim($("#txtDeduction_" + rowNumber).val());
        previousDeductionAmount = $.trim($("#spnpreviousDecAmount_" + rowNumber).html()) == NaN ? 0 : $.trim($("#spnpreviousDecAmount_" + rowNumber).html());
        claimAmount = $.trim($("#spnClaimAmount_" + rowNumber).html());

        if ((parseFloat(claimAmount) >= ((parseFloat(previousDeductionAmount) + parseFloat(deductionAmount))))) {
            $("#spnApproved_" + rowNumber).html(parseFloat(claimAmount).toFixed(2) - (parseFloat(previousDeductionAmount) + parseFloat(deductionAmount)).toFixed(2));
        }
        else {
            fnMsgAlert('info', 'info', 'Deduction amount should not exceed claimed amount');
            return false;
        }
        // $("#spnApproved_" + rowNumber).html($("#spnClaimAmount_" + rowNumber).html());
    }
    var tblLength = parseInt(expenselength);
    var itemwisetotalDeduction = 0;
    for (var k = 1; k <= tblLength; k++) {
        if ($("#txtDeduction_" + k).val() == undefined)
        {
            itemwisetotalDeduction = parseFloat(itemwisetotalDeduction) + 0;
        }
        else {
            itemwisetotalDeduction = parseFloat(itemwisetotalDeduction) + parseFloat($("#txtDeduction_" + k).val());
        }
        
    }
    $("#spnItemwiseDeduction").html(itemwisetotalDeduction.toFixed(2));
    var otherDeduction = $("#txtOtherDeductionAmount").val();
    $("#spnTotalDeductionAmount").html(parseFloat(parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalDeduction").html(parseFloat(parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - parseFloat($('#spnTotalDeduction').html())).toFixed(2));
   // $("#spnTotalApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction))).toFixed(2));
    $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction))).toFixed(2));
    // $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
    fnExpandItemwiseDetailsTotal();
}


var selectedExpenseTypeName = new Array();
var uniqueExpenseTypeName = new Array();
function fnExpandItemwiseDetailsTotal() {
    debugger;
    var tableContent = "";
    var expenseTypeName = "";
    selectedExpenseTypeName = [];
    uniqueExpenseTypeName = [];
    var expClaimAmount = 0.0;
    var ApprovedAmount = 0.0;
    var totalDeductionAmount = 0.0;
    var preduduction = 0.0;
    var tblExpenselength = expenselength;
    var addltblExpenselength = $(".clsApplied td.trRow").length;

    for (var z = 1; z <= tblExpenselength; z++) {
        expenseTypeName = $("#spnClaimExpTypeName_" + z).html();
        if (expenseTypeName !=null)
        selectedExpenseTypeName.push(expenseTypeName.split('(')[0]);
    }
    for (var i = 1; i <= addltblExpenselength; i++) {
        expenseTypeName = $("#AddlAprExpType_" + i).text();
        if (expenseTypeName != null)
        selectedExpenseTypeName.push(expenseTypeName);
    }
    // uniqueExpenseTypeName.push($.unique(selectedExpenseTypeName));


    $.each(selectedExpenseTypeName, function (i, el) {
        if ($.inArray(el, uniqueExpenseTypeName) === -1) uniqueExpenseTypeName.push(el);
    });
    debugger;

    tableContent += "<table class='table table-striped'>";
    tableContent += "<thead>";
    tableContent += "<tr>";
    tableContent += "<td style='font-weight: bold;'>Expense Type Name</td>";
    tableContent += "<td style='font-weight: bold;'>Total Claimed Amount Rs.</td>";
    tableContent += "<td style='font-weight: bold;'>Total Deducted Amount Rs.</td>";
    tableContent += "<td style='font-weight: bold;'>Total Approved Amount Rs.</td>";
    tableContent += "</tr>";
    tableContent += "</thead>";
    for (var i = 0; i < uniqueExpenseTypeName.length; i++) {
        typewiseExpense = 0.0;
        expClaimAmount = 0.0;
        ApprovedAmount = 0.0;
        totalDeductionAmount = 0.0;

        preduduction = 0.0;
        tableContent += "<tr><td style='font-weight: bold;'>" + uniqueExpenseTypeName[i] + "</td>";
        var expLen = $("td[Exp_Code='" + uniqueExpenseTypeName[i] + "']").length;
        var AddlExpLen = $("td[Addl_Exp_Code='" + uniqueExpenseTypeName[i] + "']").length;
        for (var r = 0; r < expLen; r++) {
            var id = $("td[Exp_Code='" + uniqueExpenseTypeName[i] + "']")[r].id;
            var expClaim = ($("#" + id.replace("spnClaimExpTypeName", "spnClaimAmount")));
            expClaimAmount += parseFloat(expClaim.html());
            var expApp = ($("#" + id.replace("spnClaimExpTypeName", "spnApproved")));
            ApprovedAmount += parseFloat(expApp.html());
            var totaldec = ($("#" + id.replace("spnClaimExpTypeName", "txtDeduction")));
            totalDeductionAmount += parseFloat(totaldec.val());
            var totalpreduction = ($("#" + id.replace("spnClaimExpTypeName", "spnpreviousDecAmount")));
            preduduction += parseFloat(totalpreduction.html());
        }
        for (var r = 0; r < AddlExpLen; r++) {
            var id = $("td[Addl_Exp_Code='" + uniqueExpenseTypeName[i] + "']")[r].id;
            var expClaim = ($("#" + id.replace("AddlAprExpType", "AddlAprClaimAmt")));
            expClaimAmount += parseFloat(parseFloat(expClaim.html() == "" ? 0 : expClaim.html()).toFixed(2));
            var expApp = ($("#" + id.replace("AddlAprExpType", "AddlExpAprAmt")));
            ApprovedAmount += parseFloat(parseFloat(expApp.html() == "" ? 0 : expApp.html()).toFixed(2));
            var totaldec = ($("#" + id.replace("AddlAprExpType", "AddlExpCurrDed")));
            totalDeductionAmount += parseFloat(parseFloat(totaldec.val() == "" ? 0 : totaldec.val()).toFixed(2));
            var totalpreduction = ($("#" + id.replace("AddlAprExpType", "AddlExpDedAmt")));
            preduduction += parseFloat(parseFloat(totalpreduction.html() == "" ? 0 : totalpreduction.html()).toFixed(2));
        }
        var finalDedutionAmount = 0.0;
        finalDedutionAmount = parseFloat(totalDeductionAmount + preduduction);
        tableContent += "<td><span>" + expClaimAmount.toFixed(2) + "</span></td>";
        tableContent += "<td><span>" + finalDedutionAmount.toFixed(2) + "</span></td>";
        tableContent += "<td><span>" + ApprovedAmount.toFixed(2) + "</span></td></tr>";
    }
    var deductionAmount = 0.0;

    for (var d = 1; d < $("#tblDoctorCRM  tbody tr").length + 1; d++) {
        debugger;
        deductionAmount += parseFloat($("#txtDeduction_" + d).val());
    }

    var itemwisetotalDeductions = 0;
    for (var p = 1; p <= tblExpenselength; p++) {
        itemwisetotalDeductions = parseFloat(itemwisetotalDeductions) + parseFloat($("#spnpreviousDecAmount_" + p).html() == null ? 0 : $("#spnpreviousDecAmount_" + p).html()) + parseFloat($("#txtDeduction_" + p).val() == null ? 0 : $("#txtDeduction_" + p).val());
    }
    for (var p = 1; p <= addltblExpenselength; p++) {
        itemwisetotalDeductions = parseFloat(itemwisetotalDeductions) + parseFloat($("#AddlExpDedAmt_" + p).html() == "" ? 0 : $("#AddlExpDedAmt_" + p).html()) + parseFloat($("#AddlExpCurrDed_" + p).val() == "" ? 0 : $("#AddlExpCurrDed_" + p).val());
    }
    $("#spnItemwiseDeduction").html(itemwisetotalDeductions.toFixed(2));
    var otherDeduction = $("#txtOtherDeductionAmount").val();
    if (otherDeduction == "") {
        otherDeduction = 0.0;
    }
    $("#spnTotalDeductionAmount").html(parseFloat(parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalDeduction").html(parseFloat(parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html() - parseFloat(deductionAmount)) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
    $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
    $("#dvExpenseTypeAmountDetail").html(tableContent);
    // fnCalcItemWiseApprovedAmount()
}

function fnCheckBillNumSpecialChar(obj) {
    if ($.trim($(obj).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
        if (!specialCharregex.test($(obj).val())) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters.');
            return false;
        }
    }
}
function fnCheckAdminRemarksSpecialChar(obj) {
    if ($.trim($(obj).val()) != "") {
        //var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
        var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
        if (specialCharregex.test($(obj).val())) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters.');
            return false;
        }
    }
}
function fnCalcTotal(id) {
    var deductionAmount = 0.0;
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please enter numeric value only.');
            return false;
        }
        else {
            var itemwiseDeduction = parseFloat($("#spnItemwiseDeduction").html());
            var claimAmount = parseFloat($("#spnTotalClaimAmount").html());
            var otherDeduction = $(id).val();
            for (var d = 1; d < $("#tblDoctorCRM  tbody tr").length + 1; d++) {
                debugger;
                deductionAmount += parseFloat($("#txtDeduction_" + d).val());
            }

            var totalDeduction = parseFloat(deductionAmount) + parseFloat(itemwiseDeduction) + parseFloat(otherDeduction);
            if (claimAmount >= totalDeduction) {
                debugger;
                $("#spnTotalDeductionAmount").html(parseFloat(totalDeduction).toFixed(2));
                $("#spnTotalApprovedAmount").html(parseFloat(claimAmount - totalDeduction).toFixed(2));
                $("#spnTotalDeduction").html(parseFloat(totalDeduction).toFixed(2));
                $("#spnApprovedAmount").html(parseFloat(claimAmount - totalDeduction).toFixed(2));
            }
            else {
                fnMsgAlert('info', 'Information', 'Deduction amount should not exceed claimed amount.');
                return false;
            }
        }
    }
    else {
        $(id).val("0.00");
        var itemwiseDeduction = parseFloat($("#spnItemwiseDeduction").html());
        var claimAmount = parseFloat($("#spnTotalClaimAmount").html());
        var otherDeduction = $(id).val();
        var totalDeduction = parseFloat(itemwiseDeduction) + parseFloat(otherDeduction);
        $("#spnTotalDeductionAmount").html(parseFloat(totalDeduction).toFixed(2));
        debugger;
        $("#spnTotalApprovedAmount").html(parseFloat(claimAmount - totalDeduction).toFixed(2));
        $("#spnTotalDeduction").html(parseFloat(totalDeduction).toFixed(2))
        $("#spnApprovedAmount").html(parseFloat(claimAmount - totalDeduction).toFixed(2));
    }
}

function fnExpandItemwiseDetails() {
    if ($("#dvClaimDetails").is(':visible')) {
        $("#dvClaimDetails").hide();
        $("#aExpDetails").html('Show');
    }
    else {
        $("#dvClaimDetails").show();
        $("#aExpDetails").html('Hide');
    }
}
function fnExpandSFCDetails() {
    debugger;
    if ($("#dvExpDCRDetails").is(':visible')) {
        $("#dvExpDCRDetails").hide();
        $("#aDCRExpDetails").html('Show');
    }
    else {
        fnShowDCRExpenseDetails();
        $("#aDCRExpDetails").html('Hide');
    }
}

function fnClearAll() {
    $("#spnEmployeeNo").html('');
    $("#spnReportingUserName").html('');
    $("#spnClaimUserName").html('');
    $("#spnReportingRegionName").html('');
    $("#spnEmployeeName").html('');
    $("#spnEmpAccountNo").html('');
    $("#spnRegionName").html('');
    $("#spnMobileNo").html('');
    $("#spnDcrDate").html('');
    $("#spnClaimDate").html('');
    $("#spnClaimAmount").html('');
    $("#spnTotalDeduction").html('');
    $("#spnApprovedAmount").html('');
    $("#dvClaimDetails").html('');
    $("#spnItemwiseDeduction").html('');
    $("#txtOtherDeductionAmount").val('0.0');
    $("#spnTotalClaimAmount").html();
    $("#spnTotalDeductionAmount").html('');
    $("#spnTotalApprovedAmount").html('');
    $("#txtAdminRemarks").val('');
    $("#dvClaimCode").html('');
    $("#dvSName").html('');
    $("#dvClaimHistoryPopUp").html('');
    $('#spnTotalClaimAmount').html('');
    $('#dvConRemarks').html('');
    $('#hdnExpenseclaimcode').val("");
}

///Newly added for privilege check - Month or date wise
function fnGetPrivilegeforExpense(favoringUserCode) {
    debugger;
    if (favoringUserCode != "" && favoringUserCode != null) {
        $.ajax({
            type: 'POST',
            data: 'favoringuserCode=' + favoringUserCode,
            url: '../HiDoctor_Activity/ExpenseClaim/GetExpenseDayandMonthwisePrivilege',
            success: function (result) {
                debugger;
                if (result != null && result != '') {
                    expensePrivilege_g = result;
                }
            }
        });
    }
}

//Function is used to show the expese details
function fnShowDCRExpenseDetails() {
    debugger;
    //if ($("#dvExpDCRDetails").is(':visible')) {
    //    //$("#aDCRExpDetails").hide();
    //    $("#aDCRExpDetails").html('Hide');
    //}
    //else {
    //    debugger;
    //    //    $("#dvExpDCRDetails").show();
    //    //    $("#aExpDetails").html('Hide');
    //    //}
    var favoringUserCode = $('#hdnFavouringUsercode').val();
    var claimCode = $('#hdnExpenseclaimcode').val();
    var claimDate = $('#hdnClaimDate').val();

    var month = claimDate.split(' ')[1], year = claimDate.split(' ')[2];
    var a = claimDate.toUpperCase().split(" ");
    a[1] = (("JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".indexOf(a[1]) / 3 + 101) + "").substr(1);
    month = a[1];
    $.ajax({
        type: "POST",
        data: "userCode=" + favoringUserCode + "&claimCode=" + claimCode + "&month=" + month + "&year=" + year + "&Company_Code=" + Company_Code,
        url: "../HiDoctor_Master/Expense/GetExpenseClaimApprovalPopup",
        success: function (result) {
            if (result != '' && result != null) {
                debugger;
                //$('#dvExpDCRDetails').show();
                $('#dvExpDCRDetails').html(result);
                $("#dvExpDCRDetails").show();
                //$("#aDCRExpDetails").html('Hide');
            }
        },
    });
    //$("#dvExpDCRDetails").show();
    //$("#aDCRExpDetails").html('Hide');
    //}
}

function fnGetDoctorDetails(customerCode) {
    if (customerCode != null && customerCode != "" && customerCode != undefined) {
        $.ajax({
            type: "POST",
            async: false,
            data: "doctorCode=" + customerCode + "&regionCode=" + "",
            url: "../HiDoctor_Master/Expense/GetDoctorVisitDetails",
            success: function (result) {
                if (result != '' && result != null) {
                    $('#dvDoctorDetails').overlay().load();
                    $('#dvDoctorQuickView').html(result);
                }
            }
        });

        $.ajax({
            type: "POST",
            async: false,
            data: "customerCode=" + customerCode + "&claimCode=" + $('#dvClaimCode').html(),
            url: "../HiDoctor_Master/Expense/GetExpenseClaimApprovedStockiest",
            success: function (result) {
                if (result != '' && result != null) {
                    $('#dvDoctorDetails').overlay().load();
                    $('#dvProductDetails').html(result);
                }
            }
        });
    }


}
function fnPopUpOpen(id) {
    $('#' + id).overlay().load();
    $('#' + id).overlay().load();
}
function fnGetTPDetails(dcrDate) {
    debugger;
    //alert(dcrDate);
    $.ajax({
        type: "POST",
        async: false,
        data: "usercode=" + $('#hdnFavouringUsercode').val() + "&dcrDate=" + dcrDate + "&Company_Code=" + Company_Code,
        url: "../HiDoctor_Master/Expense/GetTpDetails",
        success: function (result) {
            screenName = "Expense";
            debugger;
            if (result.length > 0) {
                fnBindTpReport(result[0].tp_id + "|" + screenName + "|" + dcrDate);
            }
            else {
                var tpDetails = "<table class='table table-striped' style='margin-top: 40px;margin-left: 45px;width: 60%;'>";
                tpDetails += "<tr> <td><b>No TP Found</b></td></tr>";
                tpDetails += "</table>";
                $("#divTpDetails").html(tpDetails);
                $('#dvTpDetails').overlay().load();
                $('#dvTpDetails').overlay().load();
            }
            debugger;
            //var tpDetails = "<table class='table table-striped' style='margin-top: 40px;margin-left: 45px;width: 80%;'>";
            //if (result.length > 0)
            //    tpDetails += "<tr> <td><b>TP From</b></td> <td><b>TP To</b></td><td><b>Travel Mode</b></td><td><b>Work Category</b></td></tr>";
            //else
            //    tpDetails += "<tr> <td><b>No SFC Found</b></td></tr>";
            //for (var i = 0; i < result.length; i++) {
            //    tpDetails += "<tr><td>" + result[i].From_Place + "</td>";
            //    tpDetails += "<td>" + result[i].To_Place + "</td>";
            //    tpDetails += "<td>" + result[i].Travel_Mode + "</td>";
            //    tpDetails += "<td>" + result[i].Category + "</td></tr>";
            //}

            //tpDetails += "</<table";
            //$("#divTpDetails").html(tpDetails);
            //$('#dvTpDetails').overlay().load();
            //$('#dvTpDetails').overlay().load();
        }
    });
}

function fnGetMutipleClosePayment() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetCRMPaymentDetails',
        data: "companyCode=" + Company_Code + "&ClaimCode=" + claimCode,
        async: 'false',
        success: function (result) {
            debugger;
            if (result != '') {
                debugger;
                var paymentMode = result[0].Payment_Mode;
                var remarks = result[0].Payment_Remarks;
                $('#txtModeOfPayment').val(paymentMode);
                // $('#txtPaymentRemarks').val(remarks);
            }

        }
    });
}
function fnMultipleClose(chk_count) {
    debugger;
    var claim_id = new Array();
    // var chk_count = 6;
    for (var i = 0; i < chk_count; i++) {
        if ($("#chk_" + i).prop("checked") == true) {
            claim_id.push($("#chk_" + i).val());
        }
    }
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'Post',
        dataType: 'json',
        url: '../HiDoctor_Master/Expense/ExpenseClaimMultipleApproval',
        data: JSON.stringify({ claimCode: claim_id, paymentMode: $("#txtModeOfPayment").val(), Company_Code: Company_Code, User_Name: User_Name, Region_Code: Region_Code }),
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            if (!isNaN(result)) {
                if (parseInt(result) > 0) {
                    fnGetPendingClaimRequest();
                    $("#spnClaim").html('Show Summary');

                    fnClearAll();

                }
                else {
                    fnMsgAlert('info', 'Error', 'Error while change the status of the expense claim');
                    return;
                }
            }
            else {
                fnMsgAlert('info', 'Error', 'Error while change the status of the expense claim');
                return;
            }
            $("#txtModeOfPayment").val('');
        },
        error: function () {
        },
        complete: function () {
            $("#main").unblock();
            fnMsgAlert('success', 'Success', 'Expense claim status changed successfully');
        }
    });
}
function fnMarkMultipleApprovel(chkbox) {
    var chkcount = $("#divBtnName").text();
    if (chkcount.split('#')[1] != '')
        if (chkbox.checked == true)
            $("#btnMultipleClose").show();
        else
            $("#btnMultipleClose").hide();
    for (var i = 0; i < parseInt(chkcount.split('#')[1]) ; i++) {
        if (chkbox.checked == true) {
            $("#chk_" + i).prop("checked", true);
        }
        else {
            $("#chk_" + i).prop("checked", false);
        }
    }
}
function fnEnableDisableMultipleCloseBtn() {
    var chkcount = $("#divBtnName").text();
    var count = 0;
    if (chkcount.split('#')[1] != '') {
        for (var i = 0; i < parseInt(chkcount.split('#')[1]) ; i++) {
            if ($("#chk_" + i).prop("checked") == true) {
                count++;
            }
        }
        if (parseInt(chkcount.split('#')[1]) == count)
            $('input[name="selectAll"]').prop("checked", true);
        else
            $('input[name="selectAll"]').prop("checked", false);
    }

    if (count != 0)
        $("#btnMultipleClose").show();
    else
        $("#btnMultipleClose").hide();
}
function fnBindDocDetails(claimCode) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/ExpenseClaim/GetDetailsUploadImage',
        data: "ClaimCode=" + claimCode,
        async: 'false',
        success: function (lstimage) {
            imglst = '';
            imglst = lstimage;
            if (lstimage.length > 0) {
                $("#dvDocPannel").show();
                var imgDetails = "";
                var link = "";
                $("#dvDoc").html('');
                var winOpen = "";
                for (var i = 0; i < lstimage.length; i++) {
                    imgDetails += "Attachment " + [i + 1] + " : <a href='" + lstimage[i].Image_File_Path + "'  target='_blank'>" + lstimage[i].File_Name + "</a><br/>";
                    link += "<a href='" + lstimage[i].Image_File_Path + "' download='" + lstimage[i].File_Name + "' class='download_file'><img src='" + lstimage[i].Image_File_Path + "'></a>";
                }
                $("#divDowenloadLink").html(link);
                $("#dvDoc").html(imgDetails);
            }
            else
                $("#dvDocPannel").hide();
        }
    })

} function fnDownloadAllImg() {
    debugger;
    for (var i = 0; i < imglst.length; i++)
    {
        window.open(imglst[i].Image_File_Path, "_blank");
    }
}
function fnAddlCalcItemWiseApprovedAmount(rowNumber) {
    debugger;
    var deductionAmount = 0;
    var claimAmount = 0;
    var previousDeductionAmount = 0;
    if ($.trim($("#AddlExpCurrDed_" + rowNumber).val()) != '') {
        if (!isNaN($("#AddlExpCurrDed_" + rowNumber).val())) {
            if ($.trim($("#AddlExpCurrDed_" + rowNumber).val()) == '') {
                $("#AddlExpCurrDed_" + rowNumber).val('0.00');
            }
            deductionAmount = $.trim($("#AddlExpCurrDed_" + rowNumber).val());
            previousDeductionAmount = $.trim($("#AddlExpDedAmt_" + rowNumber).html());
            claimAmount = $.trim($("#AddlAprClaimAmt_" + rowNumber).html());

            if (previousDeductionAmount == "") {
                previousDeductionAmount = 0;
            }
            if ((parseFloat(claimAmount) >= ((parseFloat(previousDeductionAmount) + parseFloat(deductionAmount))))) {
                $("#AddlExpAprAmt_" + rowNumber).html(parseFloat(claimAmount) - (parseFloat(previousDeductionAmount) + parseFloat(deductionAmount)).toFixed(2));
            }
            else {
                fnMsgAlert('info', 'info', 'Deduction amount should not exceed claimed amount');
                return false;
            }
        }
        else {
            fnMsgAlert('info', 'info', 'Please enter numbers alone');
            $("#AddlExpCurrDed_" + rowNumber).val('0');
            return;
        }
    }
    else {
        $("#AddlExpCurrDed_" + rowNumber).val('0.00');
        deductionAmount = $.trim($("#AddlExpCurrDed_" + rowNumber).val());
        previousDeductionAmount = $.trim($("#AddlExpDedAmt_" + rowNumber).html());
        claimAmount = $.trim($("#AddlAprClaimAmt_" + rowNumber).html());

        if ((parseFloat(claimAmount) >= ((parseFloat(previousDeductionAmount) + parseFloat(deductionAmount))))) {
            $("#AddlExpAprAmt_" + rowNumber).html(parseFloat(claimAmount) - (parseFloat(previousDeductionAmount) + parseFloat(deductionAmount)).toFixed(2));
        }
        else {
            fnMsgAlert('info', 'info', 'Deduction amount should not exceed claimed amount');
            return false;
        }
        // $("#spnApproved_" + rowNumber).html($("#spnClaimAmount_" + rowNumber).html());
    }
    var tblLength = $("#dvClaimDetails table tr td.trlength").length
    var itemwisetotalDeduction = 0;
    for (var k = 1; k <= tblLength; k++) {
        itemwisetotalDeduction = parseFloat(itemwisetotalDeduction) + parseFloat($("#txtDeduction_" + k).val());
    }
    var AddltblLength = $("#dvAddlExpenseTypeAmountDetail table tr td.trRow").length
    for (var k = 1; k <= AddltblLength; k++) {
        if ($("#AddlExpCurrDed_" + k).val() != "") {
            itemwisetotalDeduction = parseFloat(itemwisetotalDeduction) + parseFloat($("#AddlExpCurrDed_" + k).val());
        }
    }
    $("#spnItemwiseDeduction").html(itemwisetotalDeduction.toFixed(2));
    var otherDeduction = $("#txtOtherDeductionAmount").val();
    $("#spnTotalDeductionAmount").html(parseFloat(parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalDeduction").html(parseFloat(parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html() - parseFloat(deductionAmount)) - (parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction))).toFixed(2));
    $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction))).toFixed(2));
    // $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
    fnExpandItemwiseDetailsTotal();
}

function fnGetDCRDetails(dcrCode) {
    debugger;
    $.ajax({
        type: "POST",
        async: false,
        data: "DCR_Code=" + dcrCode + "&Company_Code=" + Company_Code,
        url: "../HiDoctor_Master/Expense/GetDCRDetails",
        success: function (result) {
            debugger;
            fnGetDCRReport(result);
        }
    });
}

function fnGetDCRReport(result) {
    var userCode = result[0].User_Code;
    var date = result[0].DCRDate;
    var dateS = new Date(parseInt(date.substr(6)));
    var month = dateS.getMonth() + 1;
    if (month <= 9) {
        month = "0" + month;
    }
    var newDate = dateS.getDate();
    if (newDate <= 9) {
        newDate = "0" + newDate;
    }
    var startDate = dateS.getFullYear() + "-" + month + "-" + newDate;
    var options = "S";
    debugger;
    $.ajax({
        type: "POST",
        async: false,
        data: "userCode=" + userCode + "&sd=" + startDate + "&options=" + options + "&Company_Code=" + Company_Code + "&User_Name=" + User_Name + "&Region_Code=" + Region_Code,
        url: "../HiDoctor_Reports/UserPerDay/GetUserPerDayReport",
        success: function (result) {
            debugger;
            if (result.split('^')[0] != 'FAIL') {

                $(".clsdivuserperday").dialog({
                    draggable: false,
                    resizable: false,
                    width: 1200,
                    height: 650,
                    modal: true,
                    closeOnEscape: true,
                    dialogClass: 'dlgfixed',
                    position: {
                        my: "center top",
                        at: "center top",
                        of: window,
                        collision: "none"
                    },
                    create: function (event, ui) {
                        $(event.target).parent().css('position', 'fixed');
                    },
                    open: function () {
                        $("#dvUserPerDayCont").html(result);
                        $("#divuserperPrint").html(result);
                        var userName = $('#hdnUserName').val();
                        $('#UserName').html(userName);
                        $('#txtRatingRemarks').hide();
                        $('#txtReason').hide();
                        $(".ui-dialog-content").scrollTop(0);

                    },
                    close: function () {
                        $(".clsdivuserperday").unbind('click');
                        $(".clsdivuserperday").dialog("destroy");
                        $(".clsdivuserperday").hide();
                    },

                });
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
function fnBindUserData() {
    debugger;
    var FDate = dcr_fromDate
    if (FDate != "" && FDate != null && FDate != undefined) {
        FDate = FDate.split('/')[2] + '-' + FDate.split('/')[1] + '-' + FDate.split('/')[0];
    }
    var TDate = dcr_toDate
    if (TDate != "" && TDate != null && TDate != undefined) {
        TDate = TDate.split('/')[2] + '-' + TDate.split('/')[1] + '-' + TDate.split('/')[0];
    }
    var startDate = FDate;
    var endDate = TDate;
    //User_Claim_Code = $("#dvClaimCode").html();
    //User_From_Date = fromDate;
    //User_To_Date = toDate;
    var objData = new Object();
    objData.CompanyCode = Company_Code;
    objData.UserCode = selectedUser_Code + ",";
    objData.StartDate = startDate;
    objData.EndDate = endDate;
    objData.Status = "";
    objData.DocChemistStock = 'D,M';
    objData.IsfirstTime = 1;
    objData.Claimcode = claim_Code;
    objData.ReportId = 1
   
    var params = [];
    var p = {};
    p.name = "objParams";
    p.value = objData;
    params.push(p);
    HDWebApiAjax.requestInvoke("SQLReport/ExepenseClaimRequestReport", "", params, "POST", ExpenseClaimRequest.fnSuccessCallBack, ExpenseClaimRequest.GettingFailed, null, "JSON")
}

function fnViewRemarks(dcrRemarks, expenseClaimRemarks, referenceDetails) {
    debugger;
    
    if (dcrRemarks == 'undefined') {
        dcrRemarks = "";
        $('#spnExpRem').text(dcrRemarks);
    }
    else {
        $('#spnExpRem').text(dcrRemarks);
    }
    if (expenseClaimRemarks == 'undefined') {
        expenseClaimRemarks = "";
        $('#spnRemByUser').text(expenseClaimRemarks);
    }
    else
    {
        $('#spnRemByUser').text(expenseClaimRemarks);
    }
    if (referenceDetails == 'undefined') {
        referenceDetails = "";
        $('#spnBillNum').text(referenceDetails);
    }
    else
    {
        $('#spnBillNum').text(referenceDetails);
    }
    $("#dvClaimRemarks").overlay().load();
    $("#dvClaimRemarks").overlay().load();
}