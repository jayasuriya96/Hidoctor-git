function fnGetPendingClaimRequest() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetPendingClaimRequestByUser',
        data: "searchKey=" + $('#txtClaimSearch').val() + "",
        success: function (result) {
            if (result != '') {
                $('#dvPendingClaim').html(result);

            }
        }
    });
}
var claimJson_g = "";
function fnEditRequest(editedValues) {
    //dvRightPanel
    $("#spnClaim").html('Show Details');
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
    $('#hdnStatusCode').val(statusCode);
    $('#hdnCycleCode').val(cycleCode);
    $('#hdnMoveOrder').val(moveOrder);

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetClaimRequestDetails',
        data: "claimCode=" + claimCode + "&userCode=" + userCode + "&requestName=" + requestName + "&favouringUserCode=" + favUserCode + "",
        success: function (result) {
            if (result != '') {
                if (result.split('$').length > 1) {
                    var ar = result.split('$');
                    var claimJson = eval('(' + ar[3] + ')');
                    claimJson_g = claimJson;
                    fnFillDetails(claimJson, requestName, ar[1], userCode);
                    $('#dvClaimDetails').html(ar[0]);
                    $("#dvClaimHistoryPopUp").html(ar[2]);
                    // $("#dvExpenseTypeAmountDetail").html(ar[4]);
                    //$("#dvRightPanel").unblock();
                    $('.clsCheckSpecial').blur(function () { fnCheckBillNumSpecialChar(this); });
                    $('.clsCheckRemarks').blur(function () { fnCheckAdminRemarksSpecialChar(this); });
                    // $('#dvExpenseTypeAmount').hide();
                    fnExpandItemwiseDetailsTotal();

                }
            }
        },
        error: function () {
            $("#dvRightPanel").unblock();
        },
        complete: function () {
            $("#main").unblock();
            fnGetStatus(cycleCode, moveOrder);
        }
    });
}
function fnFillDetails(claimJson, requestName, claimType, userCode) {
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
            $('#spnDivision').html(claimJson[0].lstUser[0].Division_Name);
        }
        var tblContent = "";
        var Rem_By_Usr = "";

        tblContent += "<table id='tblRemarks'>";
        if (claimJson[0].lstClaimRemarks != '') {
            for (var i = 0; i < claimJson[0].lstClaimRemarks.length; i++) {
                if (claimJson[0].lstClaimRemarks[i].Remarks_By_User == undefined) {
                    Rem_By_Usr = "";
                }
                else {
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
        else {
            $('#dvConRemarks').html(tblContent);
        }
        if (claimJson[0].lstClaimHeader != '') {
            $("#hdnExpType").val(claimType.toUpperCase());
            $('#dvClaimCode').html(claimJson[0].lstClaimHeader[0].Claim_Code);
            $('#dvClaimStatus').html('<div class="col-lg-2">Status Name : </div> <div id="dvSName" class="col-lg-2">' + claimJson[0].lstClaimHeader[0].Status_Name + '</div>'
                + '<div class="col-lg-3"> <a onclick="fnShowHistory();" style="cursor:pointer;">Status History</a></div>' + '<div class="col-lg-3"> <a onclick="fnOpenDeductionDetailPopUp(\'' + claimJson[0].lstClaimHeader[0].Claim_Code + '\',\'' + userCode + '\');" style="cursor:pointer;">Show Deduction Detail</a></div>');
            $("#spnItemwiseDeduction").html(parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction).toFixed(2));
            $("#txtOtherDeduction").val(parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction).toFixed(2));
            $("#spnTotalClaimAmount").html(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount).toFixed(2));
            var totalDeduction = parseFloat(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction) + parseFloat(claimJson[0].lstClaimHeader[0].Other_Deduction);
            $('#spnTotalDeductionAmount').html(parseFloat(totalDeduction).toFixed(2));
            $("#spnTotalApprovedAmount").html(parseFloat(parseFloat(claimJson[0].lstClaimHeader[0].Actual_Amount) - parseFloat(totalDeduction)).toFixed());

            if (claimType.toUpperCase() == "FIELD_EXPENSE_REQUEST_FOR") {
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

function fnShowDetails() {
    if ($("#spnClaim").html() == "Hide Details") {
        $("#dvLeftPanel").hide();
        $("#dvRightPanel").show();
        $("#spnClaim").html('Show Details');
    }
    else {
        $("#dvRightPanel").hide();
        $("#dvLeftPanel").show();
        $("#spnClaim").html('Hide Details');
    }
}

function fnShowHistory() {
    $("#dvHistoryPopUp").overlay().load();
}

function fnGetStatus(cycleCode, moveOrder) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetMappedStatusCycle',
        data: "cycleCode=" + cycleCode + "&moveOrder=" + moveOrder + "",
        success: function (result) {
            if (result != '') {
                var statusJson = eval('(' + result.split('^')[0] + ')');
                var content = "";
                if (statusJson.length > 0) {
                    //content = "<div style='float:left'>Change Status - </div>";
                    for (var i = 0; i < statusJson.length; i++) {
                        content += "<div class='btnStatus' id='dv_" + statusJson[i].Status_Name + "'  onclick='fnApproveClaim(\"" + statusJson[i].Status_Code
                                               + "\",\"" + statusJson[i].Order_No + "\",\"" + statusJson[i].Move_Order + "\");' >" + statusJson[i].Status_Name + "</div>";

                    }
                    $("#dvAction").html("<div style='float:left'>Change Status - </div>" + content);
                    $("#dvBottomStatus").html(content);
                }

            }
        }
    });
}

function fnShowSFC(dcrDate, userCode, flag) {
    //GetDCRSFCData
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Expense/GetDCRSFCData',
        data: "userCode=" + userCode + "&dcrDate=" + dcrDate + "&dcrFlag=" + flag + "",
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
var claimJson = new Array();
function fnApproveClaim(statusCode, orderNo, moveOrder) {
    if (confirm("Do you want to change the status of this claim?")) {
        if ($.trim($("#dvClaimCode").html()) == '') {
            fnMsgAlert('info', 'Information', 'Please select any one claim request then proceed');
            return;
        }
        var totalAmount = $("#spnTotalApprovedAmount").html();
        var adminRemarks = $("#txtAdminRemarks").val();
        if ($.trim(adminRemarks) != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
            if (!specialCharregex.test(adminRemarks)) {
                fnMsgAlert('info', 'Information', 'Please remove the special characters from admin remarks');
                return;
            }
        }
        var claimCode = $("#dvClaimCode").html();
        //var tblLength = $("#dvClaimDetails table tr").length;
        var tblLength = $("#dvClaimDetails table tr td.trlength").length;
        claimJson = new Array();
        if (tblLength > 0) {
            for (var i = 1; i <= tblLength; i++) {
                var claim = {};
                claim.Bill_Number = $.trim($("#txtBillNumber_" + i).val());
                if ($.trim($("#txtAdminRemarks_" + i).val()) != "") {
                    var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
                    if (!specialCharregex.test($("#txtAdminRemarks_" + i).val())) {
                        fnMsgAlert('info', 'Information', 'Please remove the special characters. Error at row number ' + i);
                        return;
                    }
                }
                claim.Managers_Approval_Remark = $.trim($("#txtAdminRemarks_" + i).val());
                if ($.trim($("#spnApproved_" + i).html()) == "") {
                    $("#spnApproved_" + i).html('0.00');
                }
                claim.Approved_Amount = parseFloat($("#spnApproved_" + i).html()).toFixed(2);
                claim.Claim_Detail_Code = $("#hdnClaimDetailCode_" + i).val();
                var dcrDate = $('#lbliddcracutalDate_' + i).text();
                //dcrDate = dcrDate.split('-')[2] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[0];
                claim.DCR_Actual_Date = dcrDate;
                claimJson.push(claim);
            }
        }
        else {
            var claim = {};
            if ($.trim(adminRemarks) != "") {
                var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
                if (!specialCharregex.test(adminRemarks)) {
                    fnMsgAlert('info', 'Information', 'Please remove the special characters from admin remarks');
                    return;
                }
            }
            claim.Managers_Approval_Remark = adminRemarks;
            claim.Approved_Amount = "0.00";
            claim.Claim_Detail_Code = claimCode;
            var dcrDate = $('#lbliddcracutalDate_' + i).text();
            //dcrDate = dcrDate.split('-')[2] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[0];
            claim.DCR_Actual_Date = dcrDate;
            claimJson.push(claim);
        }
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/Expense/InsertExpenseClaimApproval',
            data: "claimCode=" + claimCode + "&claimDetails=" + escape(JSON.stringify(claimJson)) + "&statusCode=" + statusCode + "&approvedAmount="
                                + totalAmount + "&adminRemarks=" + adminRemarks + "&orderNo=" + orderNo + "&OtherDeduction="
                                 + $("#txtOtherDeductionAmount").val() + "&ExpType=" + $("#hdnExpType").val() + "&moveOrder=" + moveOrder,
            success: function (result) {
                if (!isNaN(result)) {
                    if (parseInt(result) > 0) {
                        fnMsgAlert('success', 'Success', 'Expense claim status changed successfully');
                        fnGetPendingClaimRequest();
                        $("#spnClaim").html('Show Details');
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
    var deductionAmount = 0;
    var claimAmount = 0;
    var previousDeductionAmount = 0;
    if ($.trim($("#txtDeduction_" + rowNumber).val()) != '') {
        if (!isNaN($("#txtDeduction_" + rowNumber).val())) {
            if ($.trim($("#txtDeduction_" + rowNumber).val()) == '') {
                $("#txtDeduction_" + rowNumber).val('0.00');
            }
            deductionAmount = $.trim($("#txtDeduction_" + rowNumber).val());
            previousDeductionAmount = $.trim($("#spnpreviousDecAmount_" + rowNumber).html());
            claimAmount = $.trim($("#spnClaimAmount_" + rowNumber).html());

            if ((parseFloat(claimAmount) >= ((parseFloat(previousDeductionAmount) + parseFloat(deductionAmount))))) {
                $("#spnApproved_" + rowNumber).html(parseFloat(claimAmount) - (parseFloat(previousDeductionAmount) + parseFloat(deductionAmount)));
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
        previousDeductionAmount = $.trim($("#spnpreviousDecAmount_" + rowNumber).html());
        claimAmount = $.trim($("#spnClaimAmount_" + rowNumber).html());

        if ((parseFloat(claimAmount) >= ((parseFloat(previousDeductionAmount) + parseFloat(deductionAmount))))) {
            $("#spnApproved_" + rowNumber).html(parseFloat(claimAmount) - (parseFloat(previousDeductionAmount) + parseFloat(deductionAmount)));
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
    $("#spnItemwiseDeduction").html(itemwisetotalDeduction);
    var otherDeduction = $("#txtOtherDeductionAmount").val();
    $("#spnTotalDeductionAmount").html(parseFloat(parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalDeduction").html(parseFloat(parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction))).toFixed(2));
    $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeduction) + parseFloat(otherDeduction))).toFixed(2));
    // $("#spnApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
    fnExpandItemwiseDetailsTotal();
}


var selectedExpenseTypeName = new Array();
var uniqueExpenseTypeName = new Array();
function fnExpandItemwiseDetailsTotal() {
    var tableContent = "";
    var expenseTypeName = "";
    selectedExpenseTypeName = [];
    uniqueExpenseTypeName = [];
    var expClaimAmount = 0.0;
    var ApprovedAmount = 0.0;
    var totalDeductionAmount = 0.0;
    var preduduction = 0.0;
    var tblExpenselength = $("#dvClaimDetails table tr td.trlength").length;

    for (var z = 1; z <= tblExpenselength; z++) {
        expenseTypeName = $("#spnClaimExpTypeName_" + z).html();
        selectedExpenseTypeName.push(expenseTypeName);
    }
    // uniqueExpenseTypeName.push($.unique(selectedExpenseTypeName));


    $.each(selectedExpenseTypeName, function (i, el) {
        if ($.inArray(el, uniqueExpenseTypeName) === -1) uniqueExpenseTypeName.push(el);
    });


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
        var finalDedutionAmount = 0.0;
        finalDedutionAmount = parseFloat(totalDeductionAmount + preduduction);
        tableContent += "<td><span>" + expClaimAmount + "</span></td>";
        tableContent += "<td><span>" + finalDedutionAmount.toFixed(2) + "</span></td>";
        tableContent += "<td><span>" + ApprovedAmount + "</span></td></tr>";
    }
    var itemwisetotalDeductions = 0;
    for (var p = 1; p <= tblExpenselength; p++) {
        itemwisetotalDeductions = parseFloat(itemwisetotalDeductions) + parseFloat($("#spnpreviousDecAmount_" + p).html()) + parseFloat($("#txtDeduction_" + p).val());
    }
    $("#spnItemwiseDeduction").html(itemwisetotalDeductions.toFixed(2));
    var otherDeduction = $("#txtOtherDeductionAmount").val();
    if (otherDeduction == "") {
        otherDeduction = 0.0;
    }

    $("#spnTotalDeductionAmount").html(parseFloat(parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalDeduction").html(parseFloat(parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction)).toFixed(2));
    $("#spnTotalApprovedAmount").html(parseFloat(parseFloat($("#spnTotalClaimAmount").html()) - (parseFloat(itemwisetotalDeductions) + parseFloat(otherDeduction))).toFixed(2));
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
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
        if (!specialCharregex.test($(obj).val())) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters.');
            return false;
        }
    }
}



function fnCalcTotal(id) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please enter numeric value only.');
            return false;
        }
        else {
            var itemwiseDeduction = parseFloat($("#spnItemwiseDeduction").html());
            var claimAmount = parseFloat($("#spnTotalClaimAmount").html());
            var otherDeduction = $(id).val();
            var totalDeduction = parseFloat(itemwiseDeduction) + parseFloat(otherDeduction);
            if (claimAmount >= totalDeduction) {
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
        $("#spnTotalApprovedAmount").html(parseFloat(claimAmount - totalDeduction).toFixed(2));
        $("#spnTotalDeduction").html(parseFloat(totalDeduction)).toFixed(2);
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
    $("#txtOtherDeductionAmount").val('');
    $("#spnTotalClaimAmount").html();
    $("#spnTotalDeductionAmount").html('');
    $("#spnTotalApprovedAmount").html('');
    $("#txtAdminRemarks").val('');
    $("#dvClaimCode").html('');
    $("#dvSName").html('');
    $("#dvClaimHistoryPopUp").html('');
    $('#spnTotalClaimAmount').html('');
    $('#dvConRemarks').html('');
}

