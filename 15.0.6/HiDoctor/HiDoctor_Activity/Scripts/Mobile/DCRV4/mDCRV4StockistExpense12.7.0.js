var stockRow = "1", expenseRow = "1";
var stockiest_g = "", expense_g = "";
var stockiestDetails = "", expenseDetails = "";
var submitStatus = "";
var jsonKYDDoctorsCount_g = 0;
var KYDEnabledConfigValue_g = "";
//Adding Accompanist's stockiest details
var acccomRegions_g = "";
//Validate the special character in DCR remarks field
var restrictedSpecialchar_g = "/\+^%$#@!~{}'><=";
//DCR special character check for remarks
var allowCharacterinDCR = "-_.,()";
var com_Remark_Mandatory = "NO";
var com_Remark_MandatoryStatic = "NO";
var username = "";
function fnCheckRemarksSpecialCharforDCRinBlurfun(id) {
    debugger;
    var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2(id);
    if (!res) {
        fnMsgAlert('info', 'Information', 'Please Enter the following characters ' + allowCharacterinDCR + ' only in Remarks.');
        return false;
    }
    else {
        return true;
    }

    return true
}

function GetStockiest() {
    var stocString = '<div id="dvStockist_DNUM" data-inset="true" style="border-bottom: 1px solid gray">';
    //stocString += '<span class="ui-icon ui-icon-delete ui-icon-shadow" style="float: right" onclick="fnStockistDelete(DNUM)" id="spnStockDelete_DNUM">&nbsp;</span><table style="width: 100%">';
    stocString += '<a href="#" data-role="button" data-icon="delete" data-iconpos="notext" style="float:right;" onclick="fnStockistDelete(DNUM)" id="aStockDelete_DNUM">Delete</a><table style="width: 100%">';
    //stocString += '<a href="#" id="aStockDelete_DNUM" style="float:right;"  onclick="fnStockistDelete(DNUM)">Delete</a><table style="width: 100%">';
    stocString += '<tr><td><h5>' + stockist_header + ' Name</h5></td><td><select name="" data-mini="true" id="ddlStockist_DNUM" class="classstock"><option value="0">Select ' + stockist_header + '</option></select></td></tr>';
    stocString += '<tr><td><h5>Visit Session</h5></td><td><div data-role="fieldcontain"><fieldset data-role="controlgroup" data-type="horizontal" ><input type="radio" name="visitmode_DNUM" id="rbAm_DNUM" value="AM" checked="checked" /><label for="rbAm_DNUM">AM</label><input type="radio" name="visitmode_DNUM" id="rbPm_DNUM" value="PM" /><label for="rbPm_DNUM">PM</label></fieldset></div></td></tr>';
    stocString += '<tr><td><h5>POB Amount</h5></td><td><input type="text" id="txtPOB_DNUM" maxlength="6"  value="" class="checknumeric"/></td></tr>';
    stocString += '<tr><td><h5>Collection Amount</h5></td><td><input type="text" id="txtCollection_DNUM" maxlength="6"  value="" class="checknumeric"/></td></tr>';
    stocString += '<tr><td><h5>Remarks</h5></td><td><textarea  id="txtRemark_DNUM"  class="checkspecialchar" ></textarea></td></tr></table>';
    stocString += '<input type="hidden" id="hdnSS_DNUM"  value="1"/></div>';

    $("#hdnSC").val(stocString);
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4StockiestExpense/StockiestDetails',
        data: "dcrStatus=" + dcrStatus + "&dcrDate=" + dcrDate + '&acc_Regions=' + acccomRegions_g + "&showAccDataValue=" + showAccStockiestData_g,
        success: function (jsStockiestData) {
            stockiest_g = jsStockiestData;
            if (stockiest_g[0].Data === undefined || stockiest_g[0].Data.length == null || stockiest_g[0].Data.length <= 0) {
                $("#hdnSC").val($("#hdnSC").val().replace(/Select Stockist/g, 'No ' + stockist_header + ''));
            }
            fnCreateStockiestTable();
        }
    });
}

function fnCreateStockiestTable() {
    // For Drafted Data
    if (stockiest_g[1].Data.length > 0) {
        for (var i = 1; i <= stockiest_g[1].Data.length; i++) {
            fnStockist(false, stockiest_g[1].Data[i - 1]);
        }
        fnStockist(true, "");
    }
    else {
        fnStockist(true, "");
    }
    fnStockiestEventBinder();
}

function fnCreateNewRowInStockiest() {
    fnStockist(true, "");
}

function fnStockiestEventBinder() {
    $(".checknumeric").blur(function () { return fnCheckNumeric(this) });
    $(".checkspecialchar").unbind('blur').bind('blur', function () { fnCheckRemarksSpecialCharforDCRinBlurfun(this) });
    //$(".checkspecialchar").blur(function () {
    //    fnCheckRemarksSpecialCharforDCRinBlurfun(this);
    //});
    //$(".checkspecialchar").blur(function () { if (fnCheckRemarksSpecialChar(this)) { return fnRemoveErrorIndicatior(this); } });
    $(".checkspecialchar").keypress(function () { return fnEnterKeyPrevent(event) });
}

function fnStockistDelete(rowIndex) {
    $("#hdnSS_" + rowIndex).val("0");
    $("#dvStockist_" + rowIndex).css('display', 'none');
}

function fnStockist(isEmpty, objData) {
    if (isEmpty) {
        var cnt = parseInt(stockRow);
        var stockNewHTML = "";
        stockNewHTML = $("#hdnSC").val().replace(/DNUM/g, cnt);
        $("#divStockist").append(stockNewHTML).trigger('create');
        stockRow = parseInt(stockRow) + 1;

        if (stockiest_g[0].Data.length != null) {
            for (var i = 0; i < stockiest_g[0].Data.length; i++) {
                $('#ddlStockist_' + cnt).append('<option value="' + stockiest_g[0].Data[i].StockiestCode + '" >' + stockiest_g[0].Data[i].StockiestName + '</option>');
            }
        }
        fnStockiestEventBinder();
    }
    else {
        // prefill data
        var cnt = parseInt(stockRow);
        var stockNewHTML = "";
        stockNewHTML = $("#hdnSC").val().replace(/DNUM/g, cnt);
        $("#divStockist").append(stockNewHTML).trigger('create');
        stockRow = parseInt(stockRow) + 1;

        if (stockiest_g[0].Data.length != null) {
            for (var i = 0; i < stockiest_g[0].Data.length; i++) {
                $('#ddlStockist_' + cnt).append('<option value="' + stockiest_g[0].Data[i].StockiestCode + '" >' + stockiest_g[0].Data[i].StockiestName + '</option>');
            }
        }
        fnStockiestEventBinder();

        if (objData != "") {
            $("#ddlStockist_" + cnt).val(objData.StockiestCode);
            $("#ddlStockist_" + cnt).selectmenu('refresh');

            $("input:radio[name=visitmode_" + cnt + "]").each(function () {
                $(this).attr("checked", false).checkboxradio("refresh");
            });

            $("input:radio[name=visitmode_" + cnt + "]").each(function () {
                if ($(this).val() == objData.VisitSession.toUpperCase()) {
                    $(this).attr("checked", true).checkboxradio("refresh");
                }
            });

            $("#txtPOB_" + cnt).val(objData.POB);
            $("#txtCollection_" + cnt).val(objData.collectionAmnt);
            $("#txtRemark_" + cnt).val(objData.StockiestRemark);
        }
    }
}



function fnGetExpense(entity, travelKm) {
    debugger;
    var expString = ' <div id="dvExpense_DNUM" data-inset="true" style="border-bottom: 1px solid gray">';
    //expString+='<span class="ui-icon ui-icon-delete ui-icon-shadow" style="float: right" onclick="fnExpenseDelete(DNUM)" id="spnExpenseDelete_DNUM">&nbsp;</span><table style="width: 100%">';
    expString += '<a href="#" data-role="button" data-icon="delete" data-iconpos="notext" style="float:right;" onclick="fnExpenseDelete(DNUM)" id="aExpenseDelete_DNUM">Delete</a><table style="width: 100%">';
    //expString += '<a href="#" id="aExpenseDelete_DNUM" style="float:right;"  onclick="fnExpenseDelete(DNUM)">Delete</a><table style="width: 100%">';
    expString += '<tr><td><h5>Expense Name</h5></td><td><select name="" data-mini="true" id="ddlExpense_DNUM" class="classexp" onchange="fnprefillMonthlybasedAllowence(this);"><option value="0">Select Expense</option></select></td></tr>';
    expString += '<tr><td><h5>Expense Amount</h5></td><td><input type="text" id="txtExpenseAmount_DNUM" maxlength="5" value="" class="checknumeric" /></td></tr>';
    expString += '<tr><td><h5>Remarks</h5></td><td><textarea  id="txtExpenseRemark_DNUM"  class="checkspecialchar" ></textarea></td></tr></table>';
    expString += '<input type="hidden" id="hdnES_DNUM"  value="1"/></div>';

    $("#hdnEC").val(expString);
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4StockiestExpense/ExpenseDetails',
        data: "entity=" + escape(entity) + "&dcrDate=" + dcrDate + "&Travel_Km=" + travelKm + "&dcrStatus=" + dcrStatus + "&flag=" + flag_g,
        success: function (jsExpenseData) {
            expense_g = jsExpenseData;

            if (expense_g[0].Data === undefined || expense_g[0].Data.length == null || expense_g[0].Data.length <= 0) {
                $("#hdnEC").val($("#hdnEC").val().replace(/Select Expense/g, 'No Expense'));
            }
            fnCreateExpenseTable();
        }
    });
}

function fnCreateExpenseTable() {
    debugger;
    var i = 1;
    var draft = "NO";
    var isDisReadOnly = false;
    dailyAllowance = dailyAllowance.split(',');
    if (expense_g[2].Data.length > 0 || expense_g[1].Data.length > 0) {

        // generate prefill data rows.
        if (expense_g[1].Data.length > 0) {
            for (i = 1; i <= expense_g[1].Data.length; i++) {

                // hide activity expense.
                debugger;
                if (hideExpense_g && flag_g == "A") {
                    if ($.inArray(expense_g[1].Data[i - 1].ExpenseTypeName, dailyAllowance) !== -1) {
                        continue;
                    }
                }
                if (expense_g[1].Data[i - 1].IsPrefill == "R") {
                    //style = "readonly='readonly'";
                    isDisReadOnly = true;
                }
                else {
                    //style = "";
                    isDisReadOnly = false;
                }

                debugger;
                var draftAmountObj = "";
                if (expense_g[2] != null && expense_g[2].Data != null && expense_g[2].Data.length > 0) {
                    draftAmountObj = jsonPath(expense_g[2], "$.Data[?(@.ExpenseTypeCode=='" + expense_g[1].Data[i - 1].ExpenseTypeCode + "')]");
                }
                
                var remarks = '';
                if (draftAmountObj != null && draftAmountObj && draftAmountObj.length > 0) {
                    remarks = draftAmountObj[0].ExpenseRemark;
                }

                fnExpense(false, expense_g[1].Data[i - 1], isDisReadOnly, remarks, true,"");

               if (expense_g[2].Data.length > 0) { // if there is any drafted data, and the same expense type in the prefill data, the remarks should be prefilled from drafted data.
                    var expenseDraftCheck = jsonPath(expense_g[2], "$.Data[?(@.ExpenseTypeCode=='" + expense_g[1].Data[i - 1].ExpenseTypeCode + "')]");
                    

                    if (expenseDraftCheck.length > 0) {
                        fnExpense(false, expense_g[1].Data[i - 1], isDisReadOnly, expenseDraftCheck[0].ExpenseRemark, true,"1");
                    }

                    else {
                        // fnExpense(false, expense_g[1].Data[i - 1], isDisReadOnly, "", true);
                    }
                }
                else {
                    //fnExpense(false, expense_g[1].Data[i - 1], isDisReadOnly, "", true,"1");
                }
            }
            if (expense_g[2].Data.length <= 0) { // if drafted data empty.                
                fnExpense(true, "", isDisReadOnly, "", false,"");
            }
        }

        // generate drafted data row
        if (expense_g[2].Data.length > 0) {
            debugger;
            if (expense_g[1].Data.length > 0) { // if it has prefill data along with drafted.
                var k = 0;
                var j = i;
                var count = expense_g[1].Data.length + expense_g[2].Data.length;

                for (i = i; i <= count; i++) {
                    var expenseDraftCheck = jsonPath(expense_g[1], "$.Data[?(@.ExpenseTypeCode=='" + expense_g[2].Data[k].ExpenseTypeCode + "')]");

                    // Check whether the drafted data is already in prefilled.
                    if (!(expenseDraftCheck.length > 0)) {
                        fnExpense(false, expense_g[2].Data[k], false, expense_g[2].Data[k].ExpenseRemark, true,"");
                        j++;
                    }
                    k++;
                }
                i = j;
            }
            else {
                for (var i = 1; i <= expense_g[2].Data.length; i++) {
                    fnExpense(false, expense_g[2].Data[i - 1], false, "", false,"");
                }
            }
            fnExpense(true, "", false, "", false,"");
        }
    }

    else {
        // generate empty columns.
        fnExpense(true, "", false, "", false,"");
    }
    fnExpenseEventBinder();
    $.mobile.loading('hide');
}

function fnCreateNewRowInExpense() {
    debugger
    fnExpense(true, "", false, "", false,"");
}

function fnExpenseEventBinder() {
    $(".checknumeric").blur(function () { return fnCheckNumeric(this) });
    $(".checkspecialchar").unbind('blur').bind('blur', function () { fnCheckRemarksSpecialCharforDCRinBlurfun(this) });
    ////$(".checkspecialchar").blur(function () {
    //    fnCheckRemarksSpecialCharforDCRinBlurfun(this);
    //});
    //$(".checkspecialchar").blur(function () { if (fnCheckRemarksSpecialChar(this)) { return fnRemoveErrorIndicatior(this); } });
    $(".checkspecialchar").keypress(function () { return fnEnterKeyPrevent(event) });
}

function fnExpenseDelete(rowIndex) {
    $("#hdnES_" + rowIndex).val("0");
    $("#dvExpense_" + rowIndex).css('display', 'none');
}

function fnExpense(isEmpty, objData, isReadOnly, draftedRemark, isPrefill,remarks) {
    debugger;
    if (isEmpty) {
        var ecnt = parseInt(expenseRow);
        var expNewHTML = "";
        expNewHTML = $("#hdnEC").val().replace(/DNUM/g, ecnt);
        $("#divExpense").append(expNewHTML).trigger('create');
        expenseRow = parseInt(expenseRow) + 1;

        if (expense_g[0] != null) {
            for (var i = 0; i < expense_g[0].Data.length; i++) {
                debugger;
                if (hideExpense_g && flag_g == "A" && $.inArray(expense_g[0].Data[i].ExpenseTypeName,dailyAllowance)!==-1 ) {
                    continue;
                }
                $('#ddlExpense_' + ecnt).append('<option value="' + expense_g[0].Data[i].ExpenseTypeCode + '" >' + expense_g[0].Data[i].ExpenseTypeName + '</option>');
            }
        }
        fnExpenseEventBinder();
    }
    else if (remarks == "1") {

        if (objData != "") {
            $("#ddlExpense_" + ecnt).val(objData.ExpenseTypeCode);
            $("#ddlExpense_" + ecnt).selectmenu('refresh');

            if (expense_g[2] != null && expense_g[2].Data != null && expense_g[2].Data.length > 0) {
                var draftAmountObj = jsonPath(expense_g[2], "$.Data[?(@.ExpenseTypeCode=='" + objData.ExpenseTypeCode + "')]");
            }


            //if (objData.isPrefill == "R") {
            if (objData.IsPrefill == "R") {
                debugger;
                // if it is prfill
                $("#txtExpenseAmount_" + ecnt).val(objData.TotalFare);
                $("#txtExpenseRemark_" + ecnt).val(draftedRemark);
            }
            else if (objData.IsPrefill == "F" && objData.ExpenseMode == "DAILY") {
                debugger;
                //// for drafted
                //if (draftAmountObj != null && draftAmountObj.length > 0) {
                //    $("#txtExpenseAmount_" + ecnt).val(draftAmountObj[0].ExpenseAmount);
                //    $("#txtExpenseRemark_" + ecnt).val(draftAmountObj[0].ExpenseRemark);
                //}
                // else {
                // $("#txtExpenseAmount_" + ecnt).val(objData.draftAmountObj[0].ExpenseAmount);
                $("#txtExpenseAmount_" + ecnt).val(objData.TotalFare);
                $("#txtExpenseRemark_" + ecnt).val(draftedRemark);
                //}
            }
            else {
                $("#txtExpenseAmount_" + ecnt).val(objData.ExpenseAmount);
                $("#txtExpenseRemark_" + ecnt).val(draftedRemark);
            }
            //distance read only
            if (isReadOnly) {
                $("#txtExpenseAmount_" + ecnt).attr('readOnly', 'readOnly');
                $("#ddlExpense_" + ecnt).attr('disabled', 'disabled');
                $("#ddlExpense_" + ecnt).selectmenu('refresh');
                $("#aExpenseDelete_" + ecnt).css('display', 'none');
            }
        }
    }
    else {
        // prefill data
        var ecnt = parseInt(expenseRow);
        var expNewHTML = "";
        expNewHTML = $("#hdnEC").val().replace(/DNUM/g, ecnt);
        $("#divExpense").append(expNewHTML).trigger('create');
        expenseRow = parseInt(expenseRow) + 1;

        if (expense_g[0] != null) {
            for (var i = 0; i < expense_g[0].Data.length; i++) {
                $('#ddlExpense_' + ecnt).append('<option value="' + expense_g[0].Data[i].ExpenseTypeCode + '" >' + expense_g[0].Data[i].ExpenseTypeName + '</option>');
            }
        }
        fnExpenseEventBinder();

        if (objData != "") {
            $("#ddlExpense_" + ecnt).val(objData.ExpenseTypeCode);
            $("#ddlExpense_" + ecnt).selectmenu('refresh');

            if (expense_g[2] != null && expense_g[2].Data != null && expense_g[2].Data.length > 0) {
                var draftAmountObj = jsonPath(expense_g[2], "$.Data[?(@.ExpenseTypeCode=='" + objData.ExpenseTypeCode + "')]");
            }


            //if (objData.isPrefill == "R") {
            if (objData.IsPrefill == "R") {
                debugger;
                // if it is prfill
                $("#txtExpenseAmount_" + ecnt).val(objData.TotalFare);
                $("#txtExpenseRemark_" + ecnt).val(draftedRemark);
            }
            else if (objData.IsPrefill == "F" && objData.ExpenseMode == "DAILY") {
                debugger;
                //// for drafted
                //if (draftAmountObj != null && draftAmountObj.length > 0) {
                //    $("#txtExpenseAmount_" + ecnt).val(draftAmountObj[0].ExpenseAmount);
                //    $("#txtExpenseRemark_" + ecnt).val(draftAmountObj[0].ExpenseRemark);
                //}
                // else {
                // $("#txtExpenseAmount_" + ecnt).val(objData.draftAmountObj[0].ExpenseAmount);
                $("#txtExpenseAmount_" + ecnt).val(objData.TotalFare);
                $("#txtExpenseRemark_" + ecnt).val(draftedRemark);
                //}
            }
            else {
                $("#txtExpenseAmount_" + ecnt).val(objData.ExpenseAmount);
                $("#txtExpenseRemark_" + ecnt).val(draftedRemark);
            }
            //distance read only
            if (isReadOnly) {
                $("#txtExpenseAmount_" + ecnt).attr('readOnly', 'readOnly');
                $("#ddlExpense_" + ecnt).attr('disabled', 'disabled');
                $("#ddlExpense_" + ecnt).selectmenu('refresh');
                $("#aExpenseDelete_" + ecnt).css('display', 'none');
            }
        }
    }
}

//Prefill the Monthly based allowence
function fnprefillMonthlybasedAllowence(obj) {
    debugger;
    if (cvPrefill_g.toUpperCase() == 'YES') {
        var arrMonthlybased = obj.id;
        var expense_id = arrMonthlybased.split('_')[1];
        var expenseType_Code = $('#ddlExpense_' + expense_id).val();
        if (expenseType_Code != null && expenseType_Code != '' && expenseType_Code != undefined) {
            debugger;
            // var expenseType_Code = $("#hdnExpenseCode_" + expense_id).val();
            if (expense_g[0].Data.length > 0) {
                debugger;
                var jsonMonth_Expense = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeCode=='" + expenseType_Code + "')]");
                if (jsonMonth_Expense != null && jsonMonth_Expense.length > 0) {
                    debugger;
                    if (jsonMonth_Expense[0].ExpenseMode.toUpperCase() == 'DAILY' && jsonMonth_Expense[0].SFC_Type.toUpperCase() == 'E' && jsonMonth_Expense[0].IsPrefill.toUpperCase() == 'N') {
                        $('#txtExpenseAmount_' + expense_id).val(jsonMonth_Expense[0].EligibilityAmount);
                    }
                    else {
                        $('#txtExpenseAmount_' + expense_id).val('');
                    }
                }
            }
        }
    }
    else {
        $('#txtExpenseAmount_' + expense_id).val('');
    }
}


function fnReadStockiestTable() {
    var rCntStock = stockRow;
    var isTrue = new Boolean(true);
    stockiestDetails = "";

    // Validate the values
    isTrue = fnValidateStockiest(rCntStock);

    // Generate the stockiest data string.
    if (isTrue) {
        for (var i = 1; i < rCntStock; i++) {
            if ($("#hdnSS_" + i).val() == "1") {
                if ($("#ddlStockist_" + i).val() != "0") {
                    stockiestDetails += $("#ddlStockist_" + i + "  :selected").text() + '^';
                    stockiestDetails += $("#ddlStockist_" + i).val() + '^';
                    stockiestDetails += $("input:radio[name=visitmode_" + i + "]:checked").val() + '^';

                    if ($("#txtPOB_" + i).val() != "") {
                        stockiestDetails += $("#txtPOB_" + i).val() + '^';
                    }
                    else {
                        stockiestDetails += '0^';
                    }
                    if ($("#txtCollection_" + i).val() != "") {
                        stockiestDetails += $("#txtCollection_" + i).val() + '^';
                    }
                    else {
                        stockiestDetails += '0^';
                    }
                    stockiestDetails += $("#txtRemark_" + i).val() + '^';
                }
            }
        }
    }
    return isTrue;
}

function fnValidateStockiest(rCnt) {
    var stockiestNameArr = [];
    for (var i = 1; i < rCnt; i++) {
        if ($("#hdnSS_" + i).val() == "1") {
            if ($("#ddlStockist_" + i).val() != "0" || $("#txtPOB_" + i).val() != "" || $("#txtCollection_" + i).val() != "" || $("#txtRemark_" + i).val() != "") {

                // Empty check for Stockiest Name.
                if ($("#ddlStockist_" + i).val() == "0") {
                    fnMsgAlert('info', 'Stockist & Expense', 'Please Enter the ' + stockist_header + ' Name.');
                    $.mobile.loading('hide');
                    $("#ddlStockist_" + i).focus();
                    $('#btnSaveMobExp').show();
                    return false;
                }

                // Check for Stockiest name repeatation
                if ($.inArray($("#ddlStockist_" + i).val(), stockiestNameArr) > -1) {
                    fnMsgAlert('info', 'Stockist & Expense', 'The ' + stockist_header + ' name ' + $("#ddlStockist_" + i + " :selected").text() + ' is entered more than one time. It is not allowed.')
                    $.mobile.loading('hide');
                    $("#ddlStockist_" + i).focus();
                    $('#btnSaveMobExp').show();
                    return false;
                }
                stockiestNameArr.push($("#ddlStockist_" + i).val());

                // remarks length check
                if ($("#txtRemark_" + i).val() != "") {
                    if ($("#txtRemark_" + i).val().length > 255) {
                        fnMsgAlert('info', 'Stockist & Expense', 'You have entered more then 255 character in remarks. That is not allowed.');
                        $.mobile.loading('hide');
                        fnErrorIndicator("#txtRemark_" + i);
                        $('#btnSaveMobExp').show();
                        return false;
                    }
                }
                // remarks special char check.
                if (!(fnCheckRemarksSpecialCharforDCR("#txtRemark_" + i))) {
                    $.mobile.loading('hide');
                    $('#btnSaveMobExp').show();
                    return false;
                }
                //if (!(fnCheckRemarksSpecialChar("#txtRemark_" + i))) {
                //    $.mobile.loading('hide');
                //    $('#btnSaveMobExp').show();
                //    return false;
                //}

                // pob amount check
                if (!(fnCheckNumeric("#txtPOB_" + i))) {
                    $.mobile.loading('hide');
                    $('#btnSaveMobExp').show();
                    return false;
                }

                // collection amount check
                if (!(fnCheckNumeric("#txtCollection_" + i))) {
                    $.mobile.loading('hide');
                    $('#btnSaveMobExp').show();
                    return false;
                }
            }
        }
    }
    return true;
}

function fnValidateExpense(rCnt) {
    debugger;
    var expenseNameArr = [];
    var eligibilityAmount = 0.0;
    var correctIndex = [];
    var expenseTypeNameArr = [];
    expenseTypeDetails = "";
    var ex_count = new Array();

    for (var i = 1; i < rCnt; i++) {
        if ($("#hdnES_" + i).val() == "1") {

            if ($("#txtExpenseAmount_" + i).length > 0) {
                if ($("#txtExpenseAmount_" + i).val() < 0) {
                    fnMsgAlert('info', 'Stockist & Expense', "Please do not enter expense in negative value.");
                    $.mobile.loading('hide');
                    $('#btnSaveMobExp').show();
                    return false;
                }
            }

            if ($("#ddlExpense_" + i).val() != "0" || $("#txtExpenseAmount_" + i).val() != "" || $("#txtExpenseRemark_" + i).val() != "") {
                // Empty check for Expense Type.
                if ($("#ddlExpense_" + i).val() == "0") {
                    fnMsgAlert('info', 'Stockist & Expense', 'Please enter the Expense type.');
                    $.mobile.loading('hide');
                    $("#ddlExpense_" + i).focus();
                    $('#btnSaveMobExp').show();
                    return false;
                }

                // check to avoid repeatation.
                if ($.inArray($("#ddlExpense_" + i).val(), expenseNameArr) > -1) {
                    fnMsgAlert('info', 'Stockist & Expense', 'The expense type ' + $("#ddlExpense_" + i + " :selected").text() + ' is entered more than one time. It is not allowed.');
                    $.mobile.loading('hide');
                    $("#ddlExpense_" + i).focus();
                    $('#btnSaveMobExp').show();
                    return false;
                }
                expenseNameArr.push($("#ddlExpense_" + i).val());

                // Null check for expenseAmount
                if ($("#txtExpenseAmount_" + i).val() == "") {
                    fnMsgAlert('info', 'Stockist & Expense', 'Please enter expense amount for the expense type ' + $("#ddlExpense_" + i + " :selected").text() + '.')
                    $.mobile.loading('hide');
                    fnErrorIndicator("#txtExpenseAmount_" + i);
                    $('#btnSaveMobExp').show();
                    return false;
                }
                else {
                    if ($("#txtExpenseAmount_" + i).val() < 0) {
                        fnMsgAlert('info', 'Stockist & Expense', 'The expense amount ' + $("#txtExpenseAmount_" + i).val() + ' is invalid.');
                        $.mobile.loading('hide');
                        fnErrorIndicator("#txtExpenseAmount_" + i);
                        $('#btnSaveMobExp').show();
                        return false;
                    }
                }

                // Expense Remark Mandatory for Monthly
                var expenseTypes = $("#ddlExpense_" + i).val();
                var expenseTypeNameArr = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeCode=='" + $("#ddlExpense_" + i).val() + "')]");
                //var expenseTypeNameArr = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeName=='" + expenseTypes + "')]");
                if (expenseTypeNameArr[0].ExpenseMode == "MONTHLY" && expenseTypeNameArr[0].Mandate_Remarks == "Y") {
                    debugger;
                    if ($("#txtExpenseRemark_" + i).val().trim() == "") {
                        ex_count.push(expenseTypeNameArr[0].ExpenseTypeName);
                        expenseTypeNameArr.push($("#txtExpenseRemark_" + i).val());
                        expenseTypeNameArr.push($("#txtExpenseAmount_" + i).val());
                    }
                }
                else {
                    (expenseTypeNameArr[0].ExpenseMode != "MONTHLY")

                }

                expenseTypeNameArr.push(i);

                debugger;
                // remarks length check
                if ($("#txtExpenseRemark_" + i).val() != "") {
                    debugger;
                    if ($("#txtExpenseRemark_" + i).val().length > 255) {
                        fnMsgAlert('info', 'Stockist & Expense', 'You have entered more then 255 character in remarks. That is not allowed.');
                        $.mobile.loading('hide');
                        fnErrorIndicator("#txtExpenseRemark_" + i);
                        $('#btnSaveMobExp').show();
                        return false;
                    }
                }
                // remarks special char check.
                if (!(fnCheckRemarksSpecialCharforDCR("#txtExpenseRemark_" + i))) {
                    $.mobile.loading('hide');
                    $('#btnSaveMobExp').show();
                    return false;
                }
                //if (!(fnCheckRemarksSpecialChar("#txtExpenseRemark_" + i))) {
                //    $.mobile.loading('hide');
                //    $('#btnSaveMobExp').show();
                //    return false;
                //}
                correctIndex.push(i);
            }
        }
    }

    // Expense Remark Mandatory more than one Expense type Name, i.e "Expense Remarks is Mandatory for DailyAllowance, Internet"
    if (ex_count.length > 0) {
        var msg = "";
        for (var i = 0; i < ex_count.length; i++) {
            if (i == 0)
                msg = ex_count[i];
            else
                msg = msg + ", " + ex_count[i];
        }
       // HideModalPopup('dvLoading');
        $.mobile.loading('hide');
        fnMsgAlert('info', 'Mandate Remarks', 'Expense Remarks is Mandatory for ' + msg + '');
        $('.btnSave').show();
        return false;
    }


    if (expense_g[0].Data.length > 0 && correctIndex.length > 0) {
        fnCanSplitAmount(0, correctIndex);
    }
    else {
        fnReadExpenseTable();
    }
}

function fnCanSplitAmount(index, row) {


    var i = row[index];
    if ($("#ddlExpense_" + i).val() != "0") {
        var expense = $("#ddlExpense_" + i + " :selected").text();
        var expenseJson = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeName=='" + expense + "')]");

        //  Can_Split_Amount check
        if (expenseJson[0].ExpenseMode != "DAILY") {
            if (expenseJson[0].CanSplitAmount == "N") {
                $.ajax({
                    type: "POST",
                    url: '/HiDoctor_Activity/DCRV4StockiestExpense/GetExpenseSum',
                    data: "dcrDate=" + dcrDate + "&expenseMode=" + expenseJson[0].ExpenseMode + "&expenseTypeCode=" + expenseJson[0].ExpenseTypeCode,
                    success: function (expenseSum) {
                        if (expenseSum > 0.0) {
                            fnMsgAlert('info', 'Stockist & Expense', 'Already you have entered ' + $("#ddlExpense_" + i + " :selected").text() + '. And it can not be split for the expense mode ' + expenseJson[0].ExpenseMode + '.');
                            $.mobile.loading('hide');
                            $("#ddlExpense_" + i).focus();
                            $('#btnSaveMobExp').show();
                            return false;
                        }
                        else {
                            if (row.length != (index + 1)) {
                                fnCanSplitAmount((index + 1), row);
                            }
                            else {
                                return (fnEligibilityAmountCheck(0, row));
                            }
                        }
                    }
                });
            }
            else {
                if (row.length != (index + 1)) {
                    fnCanSplitAmount((index + 1), row);
                }
                else {
                    return (fnEligibilityAmountCheck(0, row));
                }
            }
        }
        else {
            if (row.length != (index + 1)) {
                fnCanSplitAmount((index + 1), row);
            }
            else {
                return (fnEligibilityAmountCheck(0, row));
            }
        }
    }
    else {
        if (row.length != (index + 1)) {
            fnCanSplitAmount((index + 1), row);
        }
        else {
            return (fnEligibilityAmountCheck(0, row));
        }
    }
}

function fnEligibilityAmountCheck(index, row) {
    var i = row[index];
    if ($("#ddlExpense_" + i).val() != "0") {
        var expense = $("#ddlExpense_" + i + " :selected").text();
        var expenseJson = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeName=='" + expense + "')]");

        // Is_Validation_On_Eligibility check.
        if (expenseJson[0].SFC_Type == 'E') {
            if (expenseJson[0].IsValidationOnEligibility == "Y") {
                // Getting eligibility amount.
                if (expenseJson[0].EligibilityAmount != "") {
                    eligibilityAmount = parseFloat(expenseJson[0].EligibilityAmount);
                }
                else {
                    eligibilityAmount = 0.0;
                }

                // Check for ExpenseMode
                if (expenseJson[0].ExpenseMode != "") {
                    if (expenseJson[0].ExpenseMode.toUpperCase() == "DAILY") {
                        var enteredAmount = $("#txtExpenseAmount_" + i).val();

                        if (parseFloat(enteredAmount) > parseFloat(eligibilityAmount)) {
                            $.mobile.loading('hide');
                            fnMsgAlert('info', 'Stockist & Expense', 'You have entered more than the eligibilty amount for the expense type ' + $("#ddlExpense_" + i + " :selected").text() + '.');
                            fnErrorIndicator("#txtExpenseAmount_" + i);
                            $('#btnSaveMobExp').show();
                            return false;
                        }
                        else {
                            if (row.length != (index + 1)) {
                                fnEligibilityAmountCheck((index + 1), row);
                            }
                            else {
                                fnReadExpenseTable();
                            }
                        }
                    }
                    else {
                        var enteredAmount = $("#txtExpenseAmount_" + i).val();

                        $.ajax({
                            type: "POST",
                            url: '/HiDoctor_Activity/DCRV4StockiestExpense/GetExpenseSum',
                            data: "dcrDate=" + dcrDate + "&expenseMode=" + expenseJson[0].ExpenseMode + "&expenseTypeCode=" + expenseJson[0].ExpenseTypeCode,
                            success: function (expenseSum) {
                                enteredAmount = parseFloat(enteredAmount) + parseFloat(expenseSum);
                                if (enteredAmount > eligibilityAmount) {
                                    $.mobile.loading('hide');
                                    fnMsgAlert('info', 'Stockist & Expense', 'You have entered more than the eligibilty amount for the expense type ' + $("#ddlExpense_" + i + " :selected").text() + '.');
                                    fnErrorIndicator("#txtExpenseAmount_" + i);
                                    $('#btnSaveMobExp').show();
                                    return false;
                                }
                                else {
                                    if (row.length != (index + 1)) {
                                        fnEligibilityAmountCheck((index + 1), row);
                                    }
                                    else {
                                        fnReadExpenseTable();
                                    }
                                }
                            }
                        });
                    }
                }
                else {
                    if (row.length != (index + 1)) {
                        fnEligibilityAmountCheck((index + 1), row);
                    }
                    else {
                        fnReadExpenseTable();
                    }
                }
            }
            else {
                if (row.length != (index + 1)) {
                    fnEligibilityAmountCheck((index + 1), row);
                }
                else {
                    fnReadExpenseTable();
                }
            }
        }
        else {
            if (row.length != (index + 1)) {
                fnEligibilityAmountCheck((index + 1), row);
            }
            else {
                fnReadExpenseTable();
            }
        }
    }
    else {
        if (row.length != (index + 1)) {
            fnEligibilityAmountCheck((index + 1), row);
        }
        else {
            fnReadExpenseTable();
        }
    }
}

function fnReadExpenseTable() {
    var rCntExpense = expenseRow;
    expenseDetails = "";
    var monthlyExpenseCodesJson = "";
    var monthlyExpenseCodes = "";
    var dailyExpenseCodesJson = "";
    var dailyExpenseCodes = "";
    if (expense_g[0].Data.length > 0) {
        // Generate the expense data string

        for (var i = 1; i < rCntExpense; i++) {
            if ($("#hdnES_" + i).val() == "1") {
                if ($("#ddlExpense_" + i).val() != "0") {
                    expenseDetails += $("#ddlExpense_" + i + " :selected").text() + '^';
                    expenseDetails += $("#ddlExpense_" + i).val() + '^';
                    expenseDetails += $("#txtExpenseAmount_" + i).val() + '^';
                    var expenseJSON = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeCode=='" + $("#ddlExpense_" + i).val() + "')]");
                    expenseDetails += expenseJSON[0].ExpenseMode + '^';
                    expenseDetails += (expenseJSON[0].EligibilityAmount == null ? '0' : expenseJSON[0].EligibilityAmount.length > 0 ? expenseJSON[0].EligibilityAmount : '0') + '^';
                    expenseDetails += expenseJSON[0].ExpenseGroupId + '^';
                    expenseDetails += $("#txtExpenseRemark_" + i).val() + '^';
                }
            }
        }
    }

    // get DCR_AUTO_APPROVAL privilege value

    var autoApproval = fnGetPrivilegeValue("DCR_AUTO_APPROVAL", "NO");
    var calcFieldsStatus = fnGetPrivilegeValue("CALC_FIELD_STATUS", "APPROVED");
    // Atleast one doctor save.
    if (submitStatus == "1") {
        if (flag_g == "F") {
            var isthereOneDoctorSaved = false;
            if (doclist_g != null && doclist_g.length > 0 && doclist_g[0].Data) {
                for (var i = 0; i < doclist_g[0].Data.length; i++) {
                    if (doclist_g[0].Data[i].Record_Status == 3) {
                        isthereOneDoctorSaved = true;
                    }
                }
                if (!isthereOneDoctorSaved) {
                    $.mobile.loading('hide');
                    alert("Please Save the atleast one doctor.");
                    return false;
                }
                for (var j = 0; j < doclist_g[0].Data.length; j++) {
                    if (doclist_g[0].Data[j].Mode_Of_Entry == "A") {
                        if (doclist_g[0].Data[j].Record_Status == "3") {
                            continue;
                        }
                        else {
                            $.mobile.loading('hide');
                            alert("Kindly save all the doctors you have done detailing using WideAngle application.");
                            return false;
                        }
                    }
                }
            }

        }
    }

    if ($('#txtDCRCommonRmrksInExpense').val() != '') {
        var id = $('#txtDCRCommonRmrksInExpense');
        var result = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2(id);
        if (!result) {
            fnMsgAlert('info', 'Stockist & Expense', 'Please Enter the Following characters only ' + allowCharacterinDCR + ' in Common Remarks.');
            $.mobile.loading('hide');
            $("#txtDCRCommonRmrksInExpense").focus();
            $('#btnSaveMobExp').show();
            $('#btnSubmitDCR').show();
            return false;
        }
    }
    if (submitStatus == '1') {//Enter only Save and Submit
        if ($("#txtDCRCommonRmrksInExpense").val().trim() != '')
            com_Remark_Mandatory = "NO";
    }
    else {
        com_Remark_Mandatory = "NO";
    }
    if (com_Remark_Mandatory.toUpperCase() == "NO") {
        // insert stockiest expense details.
        $.ajax({
            type: 'POST',
            url: '/HiDoctor_Activity/DCRV4StockiestExpense/InsertAllValues',
            data: "tblStockiestData=" + escape(stockiestDetails) + "&tblExpenseData=" + escape(expenseDetails) + "&dcrDate=" + dcrDate + "&dailyAllowance=" + dailyAllowance + "&dcrStatus=" + dcrStatus + "&submit=" + submitStatus + "&autoApproval=" + autoApproval + "&flag=" + flag_g + "&CalcFieldsStatus=" + calcFieldsStatus + "&commonRemarks=" + $("#txtDCRCommonRmrksInExpense").val().trim()+"&comRemarkMandatory=" + com_Remark_MandatoryStatic ,
            success: function (result) {
                if (result.toUpperCase() == "TRUE") {
                    //alert("insert successfully");
                    $.mobile.loading('hide');
                    if (submitStatus == "1") {
                        if (jsonKYDDoctorsCount_g > 0 && KYDEnabledConfigValue_g == "1" && flag_g == "F" && $.trim(unapproveReason_g) == "") {
                            fnRedirectToKYD();
                        }
                        else {
                            fnRedirectToCalendar()
                        }

                    }
                    else {
                        fnRedirectToInstantReport();
                    }
                }
                else {
                    fnMsgAlert('error', 'Stockist & Expense', 'Insertion failed.');
                    $.mobile.loading('hide');
                    $('#btnSaveMobExp').show();
                }
            }
        });
    }
    else {
        $('#btnSubmitDCR').show();
        $.mobile.loading('hide');
        fnMsgAlert('error', 'DCR', 'Dear ' + username + ',\n Please enter the remarks for resubmitting this DCR. ');
    }
}

function fnSubmit(status) {
    debugger;
    submitStatus = status;
    //ShowModalPopup('dvLoading');    
    $.mobile.loading('show');
    var isTrueStockiest = new Boolean(false);
    var isTrueExpense = new Boolean(false);
    if (flag_g != "A") {
        isTrueStockiest = fnReadStockiestTable();
    }
    else {
        isTrueStockiest = true;
    }

    if (isTrueStockiest == true) {
        var rCntExpense = expenseRow;
        // Validate the values.
        fnValidateExpense(rCntExpense);
    }
    else {
        $.mobile.loading('hide');
        $('#btnSaveMobExp').show();
    }
}



function fnRedirectToInstantReport() {
    $.mobile.changePage("/HiDoctor_Activity/DCRV4MobileHome/Index/?dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&isrcpa=" + isrcpa + "&source=TAB_STOCKIEST&flag=" + flag_g + "&travelKm=" + travelKm, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnOpenDCROldRemarksInExpense() {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4StockiestExpense/GetCommonRemarks',
        data: "dcrDate=" + dcrDate + "&dcrFlag=" + flag_g,
        success: function (response) {
            debugger;
            var remrksAll = response.split('~');
            if (remrksAll.length > 0) {
                if (remrksAll[0] == "") {
                    var content = "<div style='float:left;width:90%;'>No Previous Remarks Found</div>";
                    $("#dvOpenDCROldRemarksInExpense").html(content).trigger('create');
                }
                else {
                    var remrksArr = remrksAll[0].split('^');
                    var content = "";
                    if (remrksArr.length > 0) {
                        for (var i = 0; i < remrksArr.length; i++) {
                            content += "<div style='float:left;width:90%;'>" + remrksArr[i] + "</div>";
                        }
                    }
                    else {
                        content += "<div style='float:left;width:90%;'>No Previous Remarks Found</div>";
                    }
                    $("#dvOpenDCROldRemarksInExpense").html(content).trigger('create');
                }
            }
            $("#dvOpenDCROldRemarksInExpenseMain").simpledialog2();
        }
    });
}

function fnGetCommonRemarksMandatory() {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4StockiestExpense/GetCommonRemarksMandatory',
        data: "dcrDate=" + dcrDate + "&dcrFlag=" + flag_g,
        success: function (response) {
            debugger;
            if (response != undefined && response != '') {
                var temp = response.split('$');
                com_Remark_Mandatory = temp[0];
                com_Remark_MandatoryStatic = temp[0];
                username = temp[1];
            }
        }
    });
    fnDCROldRemarksInExpense();
}

function fnRedirectToCalendar() {
    fnOpenDCR();
}


function fnGoToHome() {
    $.mobile.changePage("/HiDoctor_Activity/DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=" + isrcpa + "&source=TAB&flag=" + flag_g + "&travelKm=" + travelKMS_g, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnRedirectToKYD() {
    $.mobile.changePage("/HiDoctor_Activity/DCRV4KYD/KYD/?dcrActualDate=" + dcrDate_g, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

//Adding Accompanist's Stockiest Details
function fnGetAccompanistRegionCodes() {
    if (acc_g != null) {
        for (var a = 0; a < acc_g.length; a++) {
            if (acc_g[a].accCode != null && acc_g[a].accCode != '' && acc_g[a].accCode.length > 0) {
                acccomRegions_g += acc_g[a].accCode + "^";
            }
        }
    }
}

//Check config values for showing the KYD Screen and Doctor duplicate check column 
function fnGetConfigvaluesforKYD() {
    $.ajax({
        url: '/HiDoctor_Activity/DCRV4KYD/GetConfigurationValues',
        type: "POST",
        success: function (jsData) {
            if (jsData != null && jsData != '') {
                KYDEnabledConfigValue_g = jsData[0].Config_KYDvaluesforDesignation;
                var KeyColumnValue = jsData[0].Config_DuplicatecheckColumn;
                if (KYDEnabledConfigValue_g != null && KYDEnabledConfigValue_g == "1") {
                    fnGetDoctorcountforKYD(KeyColumnValue);
                }
            }

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);

        }
    });
    fnGetCommonRemarksMandatory();
}

function fnGetDoctorcountforKYD(keyColumnValue) {
    $.ajax({
        url: '/HiDoctor_Activity/DCRV4KYD/GetKYDDoctorJsonList',
        type: "POST",
        data: 'dcrDate=' + dcrDate_g + '&Key_Column=' + keyColumnValue,
        success: function (jsData) {
            if (jsData != null && jsData != '') {
                jsonKYDDoctorsCount_g = jsData.length;
            }

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);

        }
    });

}
function fnDCROldRemarksInExpense() {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4StockiestExpense/GetCommonRemarks',
        data: "dcrDate=" + dcrDate + "&dcrFlag=" + flag_g,
        success: function (response) {
            debugger;
            if (response != '') {
                var remrksAll = response.split('~');
                if (remrksAll.length > 1) {
                    if (remrksAll[1].length > 0) {
                        var org_Remark = remrksAll[1].slice(0, remrksAll[1].length - 1);
                        $("#txtDCRCommonRmrksInExpense").val(org_Remark.slice(11));
                    }
                }
            }
        }
    });
}