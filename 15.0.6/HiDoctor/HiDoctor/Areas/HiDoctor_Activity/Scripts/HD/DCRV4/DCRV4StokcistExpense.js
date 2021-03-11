var rowNumber = "", expenseRow = "";
var stockiestjsonString = "", stockiest_g = "", expensejsonString = "", expense_g = "";
var stockiestDetails = "", expenseDetails = "";
var submitStatus = "";
//Adding Accompanist's stockiest details
var acccomRegions_g = "";

function fnGetCommonRemarks() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/GetCommonRemarks',
        data: "dcrDate=" + dcrDate + "&dcrFlag=" + flag_g,
        success: function (response) {
            if (response != "") {
                var remrksArr = response.split('^');
                var content = "";
                for (var i = 0; i < remrksArr.length; i++) {
                    content += "<div style='float:left;width:90%;'>" + remrksArr[i] + "</div>";
                }
                $("#dvOldRemarks").html(content);
                $("#dvMainOldRemarks").show();
            }
        }
    });
}




function GetStockiest() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/StockiestDetails',
        data: "dcrStatus=" + dcrStatus + "&dcrDate=" + dcrDate + '&acc_Regions=' + acccomRegions_g + "&showAccDataValue=" + showAccStockiestData_g,
        success: function (jsStockiestData) {
            stockiest_g = jsStockiestData;
            var stockiest = "[";
            for (var i = 0; i < stockiest_g[0].Data.length; i++) {
                stockiest += "{label:" + '"' + "" + stockiest_g[0].Data[i].StockiestName + "" + '",' + "value:" + '"' + "" + stockiest_g[0].Data[i].StockiestCode + "" + '"' + "}";
                if (i < stockiest_g[0].Data.length - 1) {
                    stockiest += ",";
                }
            }
            stockiest += "];";
            stockiestjsonString = eval(stockiest);
            fnCreateStockiestTable(jsStockiestData);
        }
    });
}

function fnCreateStockiestTable(jsStockiestData) {
    var tableContent = "";
    tableContent += "<table cellspacing='0' cellpadding='0' id='tblStockiest' width='100%'>";
    tableContent += "<thead>";
    tableContent += "<tr><th width='30%'>Stockist</th>";
    tableContent += "<th style='white-space:nowrap'>Visit Session</th>";
    tableContent += "<th class='numericth'>POB Amount</th>";
    tableContent += "<th class='numericth'>Collection Amount</th>";
    tableContent += "<th>Remarks</th>";
    tableContent += "</tr>";
    tableContent += "</thead>";

    // For Drafted Data
    if (stockiest_g[1].Data.length > 0) {
        for (var i = 1; i <= stockiest_g[1].Data.length; i++) {
            tableContent += "<tr>";
            tableContent += "<td><input type='text' id='txtStockiestName_" + i + "'  value='" + stockiest_g[1].Data[i - 1].StockiestName + "' class='autostockiest' onclick= '$(this).select();' /><input type='hidden' id='hdnStockiestCode_" + i + "' value='" + stockiest_g[1].Data[i - 1].StockiestCode + "'/></td>";
            if (stockiest_g[1].Data[i - 1].VisitSession == 'AM') {
                tableContent += "<td><input type='radio' value='AM' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
            }
            else {
                tableContent += "<td><input type='radio' value='AM'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' checked='checked'  name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
            }
            tableContent += "<td><input type='text' id='txtPOB_" + i + "'  value='" + stockiest_g[1].Data[i - 1].POB + "' class='checknumeric' onclick= '$(this).select();' /></td>";
            tableContent += "<td><input type='text' id='txtCollection_" + i + "'  value='" + stockiest_g[1].Data[i - 1].collectionAmnt + "'  class='checknumeric' onclick= '$(this).select();'/></td>";
            tableContent += "<td><textarea id='txtRemark_" + i + "' class='checkspecialchar' onclick= '$(this).select();'>" + stockiest_g[1].Data[i - 1].StockiestRemark + "</textarea></td>";
            tableContent += "</tr>";
        }
        tableContent += "<tr>";
        tableContent += "<td><input type='text' id='txtStockiestName_" + i + "' class='autostockiest'  onclick= '$(this).select();' /><input type='hidden' id='hdnStockiestCode_" + i + "'/></td>";
        tableContent += "<td><input type='radio' value='am' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='pm' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
        tableContent += "<td><input type='text' id='txtPOB_" + i + "'  class='checknumeric' onclick= '$(this).select();' /></td>";
        tableContent += "<td><input type='text' id='txtCollection_" + i + "'   class='checknumeric' onclick= '$(this).select();'/></td>";
        tableContent += "<td><textarea id='txtRemark_" + i + "'  class='checkspecialchar' onclick= '$(this).select();'></textarea></td>";
        tableContent += "</tr>";
        rowNumber = parseInt(i) + 1;
    }
    else {
        for (var i = 1; i <= 2; i++) {
            tableContent += "<tr>";
            tableContent += "<td><input type='text' id='txtStockiestName_" + i + "'  class='autostockiest'  onclick= '$(this).select();' /><input type='hidden' id='hdnStockiestCode_" + i + "'/></td>";
            tableContent += "<td><input type='radio' value='am' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='pm' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
            tableContent += "<td><input type='text' id='txtPOB_" + i + "'  class='checknumeric' onclick= '$(this).select();' /></td>";
            tableContent += "<td><input type='text' id='txtCollection_" + i + "'  class='checknumeric' onclick= '$(this).select();'/></td>";
            tableContent += "<td><textarea id='txtRemark_" + i + "' class='checkspecialchar'  onclick= '$(this).select();' ></textarea></td>";
            tableContent += "</tr>";
            rowNumber = 3;
        }
    }
    $('#stockiestDetails').html(tableContent);
    autoComplete(stockiestjsonString, "txtStockiestName", "hdnStockiestCode", 'autostockiest');
    fnStockiestEventBinder();
}

function fnCreateNewRowInStockiest(e) {
    var id = "txtStockiestName_" + (rowNumber - 1) + "";
    if (e.id != id) {
        return;
    }
    var rCnt = $("#tblStockiest tr").length;
    var newRow = document.getElementById("tblStockiest").insertRow(parseInt(rCnt));

    var tdStockiestName = newRow.insertCell(0);
    var tdVisitSession = newRow.insertCell(1);
    var tdPOB = newRow.insertCell(2);
    var tdCollection = newRow.insertCell(3);
    var tdRemarks = newRow.insertCell(4);

    $(tdStockiestName).html("<input type='text' id='txtStockiestName_" + rowNumber + "'  class='autostockiest' onclick= '$(this).select();' /><input type='hidden' id='hdnStockiestCode_" + rowNumber + "'/>");
    $(tdVisitSession).html("<input type='radio' value='am' name='visitmode_" + rowNumber + "' checked='checked' id='rbAm_" + rowNumber + "' /><span>AM</span>&nbsp&nbsp<input type='radio' title='am'  value='pm'  name='visitmode_" + rowNumber + "' id='rbPm_" + rowNumber + "' /><span>PM</span>");
    $(tdPOB).html("<input type='text' id='txtPOB_" + rowNumber + "'   class='checknumeric' onclick= '$(this).select();'/>");
    $(tdCollection).html("<input type='text' id='txtCollection_" + rowNumber + "'  class='checknumeric'  onclick= '$(this).select();'/>");
    $(tdRemarks).html("<textarea id='txtRemark_" + rowNumber + "' class='checkspecialchar' onclick= '$(this).select();'></textarea>");

    autoComplete(stockiestjsonString, "txtStockiestName", "hdnStockiestCode", 'autostockiest');
    fnStockiestEventBinder();

    rowNumber = parseInt(rowNumber) + 1;
}

function GetExpense(entity, travelKm) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/ExpenseDetails',
        data: "InterMediate_Places_Needed=" + intermediatePlace + " &entity=" + escape(entity) + "&dcrDate=" + dcrDate + "&Travel_Km=" + travelKm + "&dcrStatus=" + dcrStatus + "&flag=" + flag_g,
        success: function (jsExpenseData) {
            expense_g = jsExpenseData;
            var expense = "[";
            for (var i = 0; i < expense_g[0].Data.length; i++) {
                expense += "{label:" + '"' + "" + expense_g[0].Data[i].ExpenseTypeName + "" + '",' + "value:" + '"' + "" + expense_g[0].Data[i].ExpenseTypeCode + "" + '"' + "}";
                if (i < expense_g[0].Data.length - 1) {
                    expense += ",";
                }
            }
            expense += "];";
            expensejsonString = eval(expense);
            fnCreateExpenseTable();
            HideModalPopup('dvLoading');
            $('#divStockiestLoad').css('display', '');
        }
    });
}

function fnCreateExpenseTable() {
    var tableContent = "";
    var i = 1;
    var draft = "NO";
    var style = "";
    tableContent += "<table cellspacing='0' cellpadding='0' id='tblExpense' width='100%'>";
    tableContent += "<thead>";
    tableContent += "<tr><th>Expense Type</th>";
    tableContent += "<th class='numericth'>Expense Amount</th>";
    tableContent += "<th>Expense Remarks</th>";
    tableContent += "</tr>";
    tableContent += "</thead>";
    if (expense_g[2].Data.length > 0 || expense_g[1].Data.length > 0) {

        // generate prefill data rows.
        if (expense_g[1].Data.length > 0) {
            for (i = 1; i <= expense_g[1].Data.length; i++) {

                // hide activity expense.
                if (hideExpense_g && flag_g == "A") {
                    if (dailyAllowance == expense_g[1].Data[i - 1].ExpenseTypeName) {
                        continue;
                    }
                }

                if (expense_g[1].Data[i - 1].IsPrefill == "R") {
                    style = "readonly='readonly'";
                }
                else {
                    style = "";
                }
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtExpense_" + i + "' value='" + expense_g[1].Data[i - 1].ExpenseTypeName + "' class='autoexpense'  onclick= '$(this).select();' " + style + " /><input type='hidden' id='hdnExpenseCode_" + i + "' value='" + expense_g[1].Data[i - 1].ExpenseTypeCode + "'/></td>";
                tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' value='" + expense_g[1].Data[i - 1].TotalFare + "' class='checknumeric' onclick= '$(this).select();' " + style + " /></td>";

                if (expense_g[2].Data.length > 0) { // if there is any drafted data, and the same expense type in the prefill data, the remarks should be prefilled from drafted data.
                    var expenseDraftCheck = jsonPath(expense_g[2], "$.Data[?(@.ExpenseTypeCode=='" + expense_g[1].Data[i - 1].ExpenseTypeCode + "')]");

                    if (expenseDraftCheck.length > 0) {
                        tableContent += "<td><textarea id='txtExpenseRemark_" + i + "'  class='checkspecialchar'  onclick= '$(this).select();' >" + expenseDraftCheck[0].ExpenseRemark + "</textarea></td>";
                    }

                    else {
                        tableContent += "<td><textarea id='txtExpenseRemark_" + i + "'  class='checkspecialchar'  onclick= '$(this).select();' ></textarea></td>";
                    }
                }
                else {
                    tableContent += "<td><textarea id='txtExpenseRemark_" + i + "'  class='checkspecialchar'  onclick= '$(this).select();' ></textarea></td>";
                }
                tableContent += "</tr>";
            }
            if (expense_g[2].Data.length <= 0) { // if drafted data empty.                
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtExpense_" + i + "' class='autoexpense'  onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);'/><input type='hidden' id='hdnExpenseCode_" + i + "'/></td>";
                tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' class='checknumeric'  onclick= '$(this).select();'/></td>";
                tableContent += "<td><textarea id='txtExpenseRemark_" + i + "' class='checkspecialchar'  onclick= '$(this).select();' ></textarea></td>";
                tableContent += "</tr>";
                expenseRow = parseInt(i) + 1;
            }
        }

        // generate drafted data row
        if (expense_g[2].Data.length > 0) {
            if (expense_g[1].Data.length > 0) { // if it has prefill data along with drafted.
                var k = 0;
                var j = i;
                var count = expense_g[1].Data.length + expense_g[2].Data.length;

                for (i = i; i <= count; i++) {
                    var expenseDraftCheck = jsonPath(expense_g[1], "$.Data[?(@.ExpenseTypeCode=='" + expense_g[2].Data[k].ExpenseTypeCode + "')]");

                    // Check whether the drafted data is already in prefilled.
                    if (!(expenseDraftCheck.length > 0)) {
                        tableContent += "<tr>";
                        tableContent += "<td><input type='text' id='txtExpense_" + j + "' value='" + expense_g[2].Data[k].ExpenseTypeName + "' class='autoexpense'  onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);'/><input type='hidden' id='hdnExpenseCode_" + j + "' value='" + expense_g[2].Data[k].ExpenseTypeCode + "'/></td>";
                        tableContent += "<td><input type='text' id='txtExpenseAmount_" + j + "' value='" + expense_g[2].Data[k].ExpenseAmount + "' class='checknumeric' onclick= '$(this).select();'/></td>";
                        tableContent += "<td><textarea id='txtExpenseRemark_" + j + "'  class='checkspecialchar' onclick= '$(this).select();' >" + expense_g[2].Data[k].ExpenseRemark + "</textarea></td>";
                        tableContent += "</tr>";
                        j++;
                    }
                    k++;
                }
                i = j;
            }
            else {
                for (var i = 1; i <= expense_g[2].Data.length; i++) {
                    tableContent += "<tr>";
                    tableContent += "<td><input type='text' id='txtExpense_" + i + "' value='" + expense_g[2].Data[i - 1].ExpenseTypeName + "' class='autoexpense'  onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);'/><input type='hidden' id='hdnExpenseCode_" + i + "' value='" + expense_g[2].Data[i - 1].ExpenseTypeCode + "'/></td>";
                    tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' value='" + expense_g[2].Data[i - 1].ExpenseAmount + "' class='checknumeric' onclick= '$(this).select();' /></td>";
                    tableContent += "<td><textarea id='txtExpenseRemark_" + i + "'  class='checkspecialchar'  onclick= '$(this).select();' >" + expense_g[2].Data[i - 1].ExpenseRemark + "</textarea></td>";
                    tableContent += "</tr>";
                }
            }
            tableContent += "<tr>";
            //Newly added for prefil the amount when select DAILY expenseType Mode
            tableContent += "<td><input type='text' id='txtExpense_" + i + "' class='autoexpense' onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this)' /><input type='hidden' id='hdnExpenseCode_" + i + "'/></td>";
            tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' class='checknumeric' onclick= '$(this).select();' /></td>";
            tableContent += "<td><textarea id='txtExpenseRemark_" + i + "' class='checkspecialchar' onclick= '$(this).select();' ></textarea></td>";
            tableContent += "</tr>";
            expenseRow = parseInt(i) + 1;
        }
    }

    else {
        // generate empty columns.
        for (i = 1; i <= 2; i++) {
            tableContent += "<tr>";
            //Newly added for prefil the amount when select DAILY expenseType Mode
            tableContent += "<td><input type='text' id='txtExpense_" + i + "' class='autoexpense' onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);' /><input type='hidden' id='hdnExpenseCode_" + i + "'/></td>";
            tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' class='checknumeric' onclick= '$(this).select();' /></td>";
            tableContent += "<td><textarea id='txtExpenseRemark_" + i + "' class='checkspecialchar' onclick= '$(this).select();' ></textarea></td>";
            tableContent += "</tr>";
            expenseRow = 3;
        }
    }
    $('#expenseDetails').html(tableContent + "</table>");
    autoComplete(expensejsonString, "txtExpense", "hdnExpenseCode", 'autoexpense');
    fnExpenseEventBinder();
}

function fnCreateNewRowInExpense(e) {
    var id = "txtExpense_" + (expenseRow - 1) + "";
    if (e.id != id) {
        return;
    }
    var rCnt = $("#tblExpense tr").length;
    var newRow = document.getElementById("tblExpense").insertRow(parseInt(rCnt));

    var tdExpense = newRow.insertCell(0);
    var tdExpenseAmount = newRow.insertCell(1);
    var tdExpenseRemark = newRow.insertCell(2);

    $(tdExpense).html("<input type='text' id='txtExpense_" + expenseRow + "' class='autoexpense'  onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);'/><input type='hidden' id='hdnExpenseCode_" + expenseRow + "'/>");
    $(tdExpenseAmount).html("<input type='text' id='txtExpenseAmount_" + expenseRow + "' class='checknumeric' onclick= '$(this).select();' />");
    $(tdExpenseRemark).html("<textarea id='txtExpenseRemark_" + expenseRow + "' class='checkspecialchar' onclick= '$(this).select();' ></textarea>");

    autoComplete(expensejsonString, "txtExpense", "hdnExpenseCode", 'autoexpense');
    fnExpenseEventBinder();

    expenseRow = parseInt(expenseRow) + 1;
}

//Prefill the Monthly based allowence
function fnprefillMonthlybasedAllowence(obj) {
    var arrMonthlybased = obj.id;
    var expense_id = arrMonthlybased.split('_')[1];
    if ($("#hdnExpenseCode_" + expense_id).val() != '') {
        var expenseType_Code = $("#hdnExpenseCode_" + expense_id).val();
        if (expense_g[0].Data.length > 0) {
            var jsonMonth_Expense = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeCode=='" + expenseType_Code + "')]");
            if (jsonMonth_Expense != null && jsonMonth_Expense.length > 0) {
                if (jsonMonth_Expense[0].ExpenseMode.toUpperCase() == 'DAILY' && jsonMonth_Expense[0].SFC_Type.toUpperCase() == 'E') {
                    $('#txtExpenseAmount_' + expense_id).val(jsonMonth_Expense[0].EligibilityAmount);
                }
            }
        }
        else {
            $('#txtExpenseAmount_' + expense_id).val('');
        }
    }
}


function fnReadStockiestTable() {
    var rCntStock = $("#tblStockiest tr").length;
    var isTrue = new Boolean(true);
    stockiestDetails = "";

    // Validate the values
    isTrue = fnValidateStockiest(rCntStock);

    // Generate the stockiest data string.
    if (isTrue) {
        for (var i = 1; i < rCntStock; i++) {
            if ($("#txtStockiestName_" + i).val() != "") {
                stockiestDetails += $("#txtStockiestName_" + i).val() + '^';
                stockiestDetails += $("#hdnStockiestCode_" + i).val() + '^';
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
    return isTrue;
}

function fnValidateStockiest(rCnt) {
    var stockiestNameArr = [];
    for (var i = 1; i < rCnt; i++) {
        if ($("#txtStockiestName_" + i).val() != "") {
            if (stockiestjsonString != null && stockiestjsonString != "" && stockiestjsonString.length > 0) {
                var result = jsonPath(stockiestjsonString, "$.[?(@.label=='" + $("#txtStockiestName_" + i).val() + "')]");
                if (!result) {
                    $("#hdnStockiestCode_" + i).val("");
                }
            }
            else {
                $("#hdnStockiestCode_" + i).val("");
            }
            if ($("#hdnStockiestCode_" + i).val() == "") {
                fnMsgAlert('info', 'Stockist & Expense', $("#txtStockiestName_" + i).val() + " is invalid stockiest name.");
                return false;
            }
        }
        if ($("#txtStockiestName_" + i).val() != "" || $("#txtPOB_" + i).val() != "" || $("#txtCollection_" + i).val() != "" || $("#txtRemark_" + i).val() != "") {

            // Empty check for Stockiest Name.
            if ($("#txtStockiestName_" + i).val() == "") {
                HideModalPopup('dvLoading');
                fnMsgAlert('info', 'Stockist & Expense', 'Please Enter the Stockist Name.');
                fnErrorIndicator("#txtStockiestName_" + i);
                $('.btnSave').show();
                return false;
            }

            var stockiest = $("#txtStockiestName_" + i).val();
            var stockiestJson = jsonPath(stockiest_g[0], "$.Data[?(@.StockiestName=='" + stockiest + "')]");

            if (stockiestJson.length > 0) { // check for valid stockiest name, and choose the correct json data.
                // Check for Stockiest name repeatation
                if ($.inArray($("#txtStockiestName_" + i).val(), stockiestNameArr) > -1) {
                    HideModalPopup('dvLoading');
                    fnMsgAlert('info', 'Stockist & Expense', 'The stockist name ' + stockiest + ' is entered more than one time. It is not allowed.');
                    fnErrorIndicator("#txtStockiestName_" + i);
                    $('.btnSave').show();
                    return false;
                }
                stockiestNameArr.push($("#txtStockiestName_" + i).val());
            }

            // remarks length check
            if ($("#txtRemark_" + i).val() != "") {
                if ($("#txtRemark_" + i).val().length > 255) {
                    HideModalPopup('dvLoading');
                    fnMsgAlert('info', 'Stockist & Expense', 'You have entered more then 255 character in remarks. That is not allowed.');
                    fnErrorIndicator("#txtRemark_" + i);
                    $('.btnSave').show();
                    return false;
                }
            }
            // remarks special char check.
            if (!(fnCheckRemarksSpecialCharforDCR("#txtRemark_" + i))) {
                return false;
            }
            //if (!(fnCheckRemarksSpecialChar("#txtRemark_" + i))) {
            //    return false;
            //}
        }
    }
    return true;
}

function fnValidateExpense(rCnt) {
    var expenseNameArr = [];
    var eligibilityAmount = 0.0;
    var correctIndex = [];
    for (var i = 1; i < rCnt; i++) {
        if ($("#txtExpense_" + i).length > 0 && $("#txtExpense_" + i).val() != "") {
            if (expensejsonString != null && expensejsonString != "" && expensejsonString.length > 0) {
                var result = jsonPath(expensejsonString, "$.[?(@.label=='" + $("#txtExpense_" + i).val() + "')]");
                if (!result) {
                    $("#hdnExpenseCode_" + i).val("");
                }
            }
            else {
                $("#hdnExpenseCode_" + i).val("");
            }
            if ($('#hdnExpenseCode_' + i).val().length == 0) {
                fnMsgAlert('info', 'Stockist & Expense', $("#txtExpense_" + i).val() + " is invalid expense.");
                HideModalPopup('dvLoading');
                $('.btnSave').show();
                return false;
            }
        }

        if ($("#txtExpenseAmount_" + i).length > 0 && $("#txtExpenseAmount_" + i).val().length > 0) {
            if ($("#txtExpenseAmount_" + i).val() < 0) {
                fnMsgAlert('info', 'Stockist & Expense', "Please do not enter expense in negative value.");
                HideModalPopup('dvLoading');
                $('.btnSave').show();
                return false;
            }
        }

        if ($("#txtExpense_" + i).length > 0 && ($("#txtExpense_" + i).val() != "" || $("#txtExpenseAmount_" + i).val() != "" || $("#txtExpenseRemark_" + i).val() != "")) {
            // Empty check for Expense Type.
            if ($("#txtExpense_" + i).val() == "") {
                HideModalPopup('dvLoading');
                fnMsgAlert('info', 'Stockist & Expense', 'Please enter the Expense type.');
                fnErrorIndicator("#txtExpense_" + i);
                $('.btnSave').show();
                return false;
            }

            // check to avoid repeatation.
            if ($.inArray($("#txtExpense_" + i).val(), expenseNameArr) > -1) {
                HideModalPopup('dvLoading');
                fnMsgAlert('info', 'Stockist & Expense', 'The expense type ' + $("#txtExpense_" + i).val() + ' is entered more than one time. It is not allowed.');
                fnErrorIndicator("#txtExpense_" + i);
                $('.btnSave').show();
                return false;
            }
            expenseNameArr.push($("#txtExpense_" + i).val());

            // Null check for expenseAmount
            if ($("#txtExpenseAmount_" + i).val() == "") {
                HideModalPopup('dvLoading');
                fnMsgAlert('info', 'Stockist & Expense', 'Please enter expense amount for the expense type ' + $("#txtExpense_" + i).val() + '.');
                fnErrorIndicator("#txtExpenseAmount_" + i);
                $('.btnSave').show();
                return false;
            }
            else {
                if ($("#txtExpenseAmount_" + i).val() < 0) {
                    HideModalPopup('dvLoading');
                    fnMsgAlert('info', 'Stockist & Expense', 'The expense amount ' + $("#txtExpenseAmount_" + i).val() + ' is invalid.');
                    fnErrorIndicator("#txtExpenseAmount_" + i);
                    $('.btnSave').show();
                    return false;
                }
            }

            // remarks length check
            $("#txtExpenseRemark_" + i).val($.trim($("#txtExpenseRemark_" + i).val().replace(/\'/g, ' ')));
            if ($("#txtExpenseRemark_" + i).val() != "") {
                if ($("#txtExpenseRemark_" + i).val().length > 255) {
                    HideModalPopup('dvLoading');
                    fnMsgAlert('info', 'Stockist & Expense', 'You have entered more then 255 character in remarks. That is not allowed.');
                    fnErrorIndicator("#txtExpenseRemark_" + i);
                    $('.btnSave').show();
                    return false;
                }
            }

            // remarks special char check.
            if (!(fnCheckRemarksSpecialCharforDCR("#txtExpenseRemark_" + i))) {
                HideModalPopup('dvLoading');
                $('.btnSave').show();
                return false;
            }
            //if (!(fnCheckRemarksSpecialChar("#txtExpenseRemark_" + i))) {
            //    HideModalPopup('dvLoading');
            //    $('.btnSave').show();
            //    return false;
            //}
            correctIndex.push(i);
        }
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
    if ($.trim($("#txtExpense_" + i).val()).length > 0) {
        var expense = $("#txtExpense_" + i).val();
        var expenseJson = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeName=='" + expense + "')]");

        //  Can_Split_Amount check
        if (expenseJson[0].ExpenseMode != "DAILY") {
            if (expenseJson[0].CanSplitAmount == "N") {
                $.ajax({
                    type: "POST",
                    url: '../HiDoctor_Activity/DCRV4StockiestExpense/GetExpenseSum',
                    data: "dcrDate=" + dcrDate + "&expenseMode=" + expenseJson[0].ExpenseMode + "&expenseTypeCode=" + expenseJson[0].ExpenseTypeCode,
                    success: function (expenseSum) {
                        if (expenseSum > 0.0) {
                            HideModalPopup('dvLoading');
                            fnMsgAlert('info', 'Stockist & Expense', 'Already you have entered ' + $("#txtExpense_" + i).val() + '. And it can not be split for the expense mode ' + expenseJson[0].ExpenseMode + '.');
                            fnErrorIndicator("#txtExpense_" + i);
                            $('.btnSave').show();
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
    if ($.trim($("#txtExpense_" + i).val()).length > 0) {
        var expense = $("#txtExpense_" + i).val();
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

                        if (enteredAmount > eligibilityAmount) {
                            HideModalPopup('dvLoading');
                            fnMsgAlert('info', 'Stockist & Expense', 'You have entered more than the eligibilty amount for the expense type ' + $("#txtExpense_" + i).val() + '.');
                            fnErrorIndicator("#txtExpenseAmount_" + i);
                            $('.btnSave').show();
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
                            url: '../HiDoctor_Activity/DCRV4StockiestExpense/GetExpenseSum',
                            data: "dcrDate=" + dcrDate + "&expenseMode=" + expenseJson[0].ExpenseMode + "&expenseTypeCode=" + expenseJson[0].ExpenseTypeCode,
                            success: function (expenseSum) {
                                enteredAmount = parseInt(enteredAmount) + parseInt(expenseSum);
                                if (enteredAmount > eligibilityAmount) {
                                    HideModalPopup('dvLoading');
                                    fnMsgAlert('info', 'Stockist & Expense', 'You have entered more than the eligibilty amount for the expense type ' + $("#txtExpense_" + i).val() + '.');
                                    fnErrorIndicator("#txtExpenseAmount_" + i);
                                    $('.btnSave').show();
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
    var rCntExpense = $("#tblExpense tr").length;
    expenseDetails = "";
    var monthlyExpenseCodesJson = "";
    var monthlyExpenseCodes = "";
    var dailyExpenseCodesJson = "";
    var dailyExpenseCodes = "";
    if (expense_g[0].Data.length > 0) {
        // Generate the expense data string

        for (var i = 1; i < rCntExpense; i++) {
            if ($("#txtExpense_" + i).length > 0 && $("#txtExpense_" + i).val() != "") {

                expenseDetails += $("#txtExpense_" + i).val() + '^';
                expenseDetails += $("#hdnExpenseCode_" + i).val() + '^';
                expenseDetails += $("#txtExpenseAmount_" + i).val() + '^';
                var expenseJSON = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeCode=='" + $("#hdnExpenseCode_" + i).val() + "')]");
                expenseDetails += expenseJSON[0].ExpenseMode + '^';
                expenseDetails += (expenseJSON[0].EligibilityAmount == null ? '0' : expenseJSON[0].EligibilityAmount.length > 0 ? expenseJSON[0].EligibilityAmount : '0') + '^';
                expenseDetails += expenseJSON[0].ExpenseGroupId + '^';
                expenseDetails += $("#txtExpenseRemark_" + i).val() + '^';
            }
        }
    }

    // get DCR_AUTO_APPROVAL privilege value

    var autoApproval = fnGetPrivilegeValue("DCR_AUTO_APPROVAL", "NO");
    // insert stockiest expense details.
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/InsertAllValues',
        data: "tblStockiestData=" + escape(stockiestDetails) + "&tblExpenseData=" + escape(expenseDetails) + "&dcrDate=" + dcrDate + "&dailyAllowance=" + dailyAllowance + "&dcrStatus=" + dcrStatus + "&submit=" + submitStatus + "&autoApproval=" + autoApproval + "&flag=" + flag_g + "&commonRemarks=" + $("#txtCommonRemarks").val(),
        success: function (result) {    
            if (result.toUpperCase() == "TRUE") {            
                if (flag_g == 'F' && submitStatus == '1' && jsonKYDConfig_g == '1' && jsonDoctorCount_g > 0 && $.trim(unapprovereason_g) == "") {
                    $('#main').load('HiDoctor_Activity/DCRV4KYD/KYD/?dcrActualDate=' + dcrDate + '&flag='+flag_g);
                }
                else {
                   fnRedirectToInstantReport();
                }
            }
            else {
                HideModalPopup('dvLoading');
                fnMsgAlert('error', 'Stockist & Expense', 'Insertion failed.');
                $('.btnSave').show();
            }
        }
    });
}

function fnSubmit(status) {
    submitStatus = status;
    ShowModalPopup('dvLoading');
    var isTrueStockiest = new Boolean(false);
    var isTrueExpense = new Boolean(false);
    if (flag_g != "A") {
        isTrueStockiest = fnReadStockiestTable();
    }
    else {
        isTrueStockiest = true;
    }

    if (isTrueStockiest == true) {
        var rCntExpense = $("#tblExpense tr").length;
        // Validate the values.
        fnValidateExpense(rCntExpense);
    }
    else {
        HideModalPopup('dvLoading');
        $('.btnSave').show();
    }
}

function fnExpenseEventBinder() {
    // Valid name check for Expense
    $('.autoexpense').blur(function () { return fnValidateAutofill(this, expensejsonString, "txtExpense_", "hdnExpenseCode_") });

    // New row Creation - Expense Table
    $(".autoexpense").keypress(function () { fnCreateNewRowInExpense(this); });
    $(".autoexpense").dblclick(function () { fnCreateNewRowInExpense(this); });

    $(".checknumeric").blur(function () { return fnCheckNumeric(this) });
    $(".checkspecialchar").blur(function () { fnCloseTextarea(this); fnRemoveErrorIndicatior(this); });
    $(".checkspecialchar").focus(function () { fnExpandTextarea(this); });
}

function fnStockiestEventBinder() {
    // Valid name check for Stockiest
    $(".autostockiest").blur(function () { return fnValidateAutofill(this, stockiestjsonString, "txtStockiestName_", "hdnStockiestCode_") });

    // New row Creation - Stockiest Table
    $(".autostockiest").keypress(function () { fnCreateNewRowInStockiest(this); });
    $(".autostockiest").dblclick(function () { fnCreateNewRowInStockiest(this); });

    $(".checknumeric").blur(function () { return fnCheckNumeric(this) });
    $(".checkspecialchar").blur(function () { fnCloseTextarea(this); fnRemoveErrorIndicatior(this); });
    $(".checkspecialchar").focus(function () { fnExpandTextarea(this); });
}

function fnRedirectToInstantReport() {
    var date = dcrDate.split('-')[1] + '/' + dcrDate.split('-')[2] + '/' + dcrDate.split('-')[0];

    $('#main').load('../HiDoctor_Activity/DCRV4Report/Index/?dcrActualDate=' + dcrDate + '&flag=' + flag_g);
    HideModalPopup('dvLoading');
    //parent.location.href = url;
}

function fnRedirectToHeader() {
    if (isrcpa == "N") {
        $('#main').load('../HiDoctor_Activity/DCRV4Header/Index/?dcrDate=' + dcrDate + '&dcrStatus=' + dcrStatus + '&isrcpa=' + isrcpa + '&source=TAB_STOCKIEST&flag=' + flag_g);
    }
    if (isrcpa == "R") {
        $('#main').load('../HiDoctor_Activity/DCRV4Header/Index/?dcrDate=' + dcrDate + '&dcrStatus=' + status_g + '&isrcpa=Y&source=TAB_STOCKIEST&flag=' + flag_g);
    }
}


function fnRedirectToDoctorVisit() {
    var dcrActualDate = dcrActualDate = dcrDate.split('-')[2] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[0];

    if (isrcpa == "N") {
        $('#main').load('../HiDoctor_Activity/DCRV4DoctorVisit/Index/?status=' + dcrStatus + '&flagRCPA=N&cp=' + escape(cpCode_g) + '&tp=' + escape(tpCode_g) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(entity) + '&travelledkms=' + travelKm + '&source=TAB_STOCKIEST&flag=' + flag_g);
    }
    else if (isrcpa == "R") {
        $('#main').load('../HiDoctor_Activity/DCRV4DoctorVisit/Index/?status=' + dcrStatus + '&flagRCPA=R&cp=' + escape(cpCode_g) + '&tp=' + escape(tpCode_g) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(entity) + '&travelledkms=' + travelKm + '&source=TAB_STOCKIEST&flag=' + flag_g);
    }
}


//Adding Accompanist's Stockiest Details
function fnGetAccompanistRegionCodes() {
    if (acc_g != null) {
        for (var a = 0; a < acc_g.length; a++) {
            acccomRegions_g += acc_g[a].accCode + "^";
        }
    }
}

//Check config values for showing the KYD Screen and Doctor duplicate check column 
function fnGetConfigvaluesforKYD() {
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4KYD/GetConfigurationValues',
        type: "POST",
        async : false,
        success: function (jsData) {          
            if (jsData != null && jsData != '') {
                jsonKYDConfig_g = jsData[0].Config_KYDvaluesforDesignation;
                jsonKYDDoctorduplicatecheckColumn_g = jsData[0].Config_DuplicatecheckColumn;
            }
            HideModalPopup('dvLoading');
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            HideModalPopup('dvLoading');
        }
    });
}

function fnGetDoctorcountforKYD() {
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4KYD/GetKYDDoctorJsonList',
        type: "POST",
        data: 'dcrDate='+dcrDate+'&Key_Column='+jsonKYDDoctorduplicatecheckColumn_g,
        success: function (jsData) {          
            if (jsData != null && jsData != '') {
                jsonDoctorCount_g = jsData.length;
            }
            HideModalPopup('dvLoading');
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            HideModalPopup('dvLoading');
        }
    });
}

