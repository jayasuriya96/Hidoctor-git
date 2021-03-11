var rowNumber = "", expenseRow = "";
var stockiestjsonString = "", stockiest_g = "", expensejsonString = "", expense_g = "";
var stockiestDetails = "", expenseDetails = "";
var submitStatus = "";
//Adding Accompanist's stockiest details
var acccomRegions_g = "";
var allowCharacterinDCR = "-_.,()@";
var com_Remark_Mandatory = "NO";
var com_Remark_MandatoryStatic = "NO";
var username = "";
var objVisitTime = "";
var DR_status = 0;
var Insertresult = "";
function fnGetCommonRemarks() {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/GetCommonRemarks',
        data: "dcrDate=" + dcrDate + "&dcrFlag=" + flag_g,
        success: function (response) {
            if (response != "") {
                debugger;
                var remrksAll = response.split('~');
                if (remrksAll.length > 0) {
                    if (remrksAll[0] == "") {
                        var org_Remark = remrksAll[1].slice(0, remrksAll[1].length - 1);
                        $("#txtCommonRemarks").val(org_Remark.slice(11));
                    }
                    else {
                        var remrksArr = remrksAll[0].split('^');
                        var content = "";
                        for (var i = 0; i < remrksArr.length; i++) {
                            content += "<div style='float:left;width:90%;'>" + remrksArr[i] + "</div>";
                        }
                        $("#dvOldRemarks").html(content);
                        if (remrksAll.length > 1) {
                            var org_Remark = remrksAll[1].slice(0, remrksAll[1].length - 1);
                            $("#txtCommonRemarks").val(org_Remark.slice(11));
                        }
                        $("#dvMainOldRemarks").show();
                    }
                }

            }
        }
    });
    fnGetCommonRemarksMandatory();
}

function fnGetCommonRemarksMandatory() {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/GetCommonRemarksMandatory',
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
}
function GetStockiest() {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/StockiestDetails',
        data: "dcrStatus=" + dcrStatus + "&dcrDate=" + dcrDate + '&acc_Regions=' + acccomRegions_g + "&showAccDataValue=" + showAccStockiestData_g,
        success: function (jsStockiestData) {
            debugger;
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

function fncheckVisitTimePrivlige() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/checkVisitTimePrivilge',
        type: "GET",
        //data: "usertypename=" + usertypecode,
        async: false,
        success: function (result) {
            debugger;
            objVisitTime = result;
        },
        error: function (result) {
            debugger;
        }
    });
}


function fnCreateStockiestTable(jsStockiestData) {
    debugger;
    var tableContent = "";
    tableContent += "<table cellspacing='0' cellpadding='0' id='tblStockiest' width='100%'>";
    tableContent += "<thead>";
    tableContent += "<tr><th width='30%'>" + stockistHeaderName + " Name</th>";
    tableContent += "<th style='white-space:nowrap'>Visit Session/Time</th>";
    tableContent += "<th class='numericth'>POB Amount</th>";
    tableContent += "<th class='numericth'>EPOB / Collection Amount</th>";
    tableContent += "<th>Remarks</th>";
    tableContent += "</tr>";
    tableContent += "</thead>";

    fncheckVisitTimePrivlige();
    debugger;
    // For Drafted Data
    //console(objVisitTime);
    if (stockiest_g[1].Data.length > 0) {
        for (var i = 1; i <= stockiest_g[1].Data.length; i++) {
            tableContent += "<tr>";
            tableContent += "<td><input type='text' id='txtStockiestName_" + i + "'  value='" + stockiest_g[1].Data[i - 1].StockiestName + "' class='autostockiest' onclick= '$(this).select();' /><input type='hidden' id='hdnStockiestCode_" + i + "' value='" + stockiest_g[1].Data[i - 1].StockiestCode + "'/></td>";
            if (objVisitTime.length > 0) {
                if (objVisitTime[0].Privilege_Value_Name == 'AM_PM') {
                    if (stockiest_g[1].Data[i - 1].VisitSession == 'AM') {
                        tableContent += "<td><input type='radio' value='AM' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
                    }
                    else {
                        tableContent += "<td><input type='radio' value='AM'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' checked='checked'  name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
                    }
                }
                else if (objVisitTime[0].Privilege_Value_Name == 'VISIT_TIME_MANDATORY') {
                    if (stockiest_g[1].Data[i - 1].VisitTime != "") {
                        tableContent += "<td><input type='text' readonly id='txtStartTime_" + i + "' value='" + stockiest_g[1].Data[i - 1].VisitTime.split(':')[0] + ':' + stockiest_g[1].Data[i - 1].VisitTime.split(':')[1] + ' ' + stockiest_g[1].Data[i - 1].VisitSession + "' class='time accomp' onclick= '$(this).select();' /></td>";
                    }
                    else {
                        tableContent += "<td><input type='text' readonly id='txtStartTime_" + i + "' class='time accomp' onclick= '$(this).select();' /></td>";
                    }
                }
            }
            else {
                if (stockiest_g[1].Data[i - 1].VisitSession == 'AM') {
                    tableContent += "<td><input type='radio' value='AM' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
                }
                else {
                    tableContent += "<td><input type='radio' value='AM'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' checked='checked'  name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
                }
            }
            tableContent += "<td><input type='text' id='txtPOB_" + i + "'  value='" + stockiest_g[1].Data[i - 1].POB + "' class='checknumeric' onblur='return fnCurrencyFormatNew(this, \"POB\")' onclick= '$(this).select();' /></td>";
            tableContent += "<td><input type='text' id='txtCollection_" + i + "'  value='" + stockiest_g[1].Data[i - 1].collectionAmnt + "'  class='checknumeric' onblur='return fnCurrencyFormatNew(this, \"Collection\")' onclick= '$(this).select();'/></td>";
            tableContent += "<td><textarea id='txtRemark_" + i + "' class='checkspecialchar' onclick= '$(this).select();'>" + stockiest_g[1].Data[i - 1].StockiestRemark + "</textarea></td>";
            tableContent += "</tr>";
        }
        tableContent += "<tr>";
        tableContent += "<td><input type='text' id='txtStockiestName_" + i + "' class='autostockiest'  onclick= '$(this).select();' /><input type='hidden' id='hdnStockiestCode_" + i + "'/></td>";
        if (objVisitTime.length > 0) {
            if (objVisitTime[0].Privilege_Value_Name == 'AM_PM') {
                tableContent += "<td><input type='radio' value='AM' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
            }
            else if (objVisitTime[0].Privilege_Value_Name == 'VISIT_TIME_MANDATORY') {
                tableContent += "<td><input type='text' readonly id='txtStartTime_" + i + "' class='time accomp' onclick= '$(this).select();'  /></td>";
            }
        }
        else {
            tableContent += "<td><input type='radio' value='AM' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
        }
        tableContent += "<td><input type='text' id='txtPOB_" + i + "'  class='checknumeric' onblur='return fnCurrencyFormatNew(this, \"POB\")' onclick= '$(this).select();' /></td>";
        tableContent += "<td><input type='text' id='txtCollection_" + i + "'   class='checknumeric' onblur='return fnCurrencyFormatNew(this, \"Collection\")' onclick= '$(this).select();'/></td>";
        tableContent += "<td><textarea id='txtRemark_" + i + "'  class='checkspecialchar' onclick= '$(this).select();'></textarea></td>";
        tableContent += "</tr>";
        rowNumber = parseInt(i) + 1;
    }
    else {
        for (var i = 1; i <= 2; i++) {
            tableContent += "<tr>";
            tableContent += "<td><input type='text' id='txtStockiestName_" + i + "'  class='autostockiest'  onclick= '$(this).select();' /><input type='hidden' id='hdnStockiestCode_" + i + "'/></td>";
            if (objVisitTime.length > 0) {
                if (objVisitTime[0].Privilege_Value_Name == 'AM_PM') {
                    tableContent += "<td><input type='radio' value='AM' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='PM' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
                }
                else if (objVisitTime[0].Privilege_Value_Name == 'VISIT_TIME_MANDATORY') {
                    tableContent += "<td><input type='text' readonly id='txtStartTime_" + i + "' class = 'time accomp' onclick= '$(this).select();'  /></td>";
                }
            }
            else {
                tableContent += "<td><input type='radio' value='AM' checked='checked'  name='visitmode_" + i + "'  id='rbAm_" + i + "' /><span>AM</span>&nbsp&nbsp<input type='radio' value='pm' name='visitmode_" + i + "' id='rbPm_" + i + "' /><span>PM</span></td>";
            }
            tableContent += "<td><input type='text' id='txtPOB_" + i + "'  class='checknumeric' onblur='return fnCurrencyFormatNew(this, \"POB\")' onclick= '$(this).select();' /></td>";
            tableContent += "<td><input type='text' id='txtCollection_" + i + "'  class='checknumeric' onblur='return fnCurrencyFormatNew(this, \"Collection\")' onclick= '$(this).select();'/></td>";
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
    debugger;
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
    if (objVisitTime.length > 0) {
        if (objVisitTime[0].Privilege_Value_Name == 'AM_PM') {
            $(tdVisitSession).html("<input type='radio' value='AM' name='visitmode_" + rowNumber + "' checked='checked' id='rbAm_" + rowNumber + "' /><span>AM</span>&nbsp&nbsp<input type='radio' title='AM'  value='PM'  name='visitmode_" + rowNumber + "' id='rbPm_" + rowNumber + "' /><span>PM</span>");
        }
        else if (objVisitTime[0].Privilege_Value_Name == 'VISIT_TIME_MANDATORY') {
            $(tdVisitSession).html("<input type='text' readonly id='txtStartTime_" + rowNumber + "' class = 'time accomp' onclick= '$(this).select();'  /></td>");
        }
    }
    else {
        $(tdVisitSession).html("<input type='radio' value='AM' name='visitmode_" + rowNumber + "' checked='checked' id='rbAm_" + rowNumber + "' /><span>AM</span>&nbsp&nbsp<input type='radio' title='AM'  value='PM'  name='visitmode_" + rowNumber + "' id='rbPm_" + rowNumber + "' /><span>PM</span>");
    }
    $(tdPOB).html("<input type='text' id='txtPOB_" + rowNumber + "'   class='checknumeric' onblur='return fnCurrencyFormatNew(this, \"POB\")' onclick= '$(this).select();'/>");
    $(tdCollection).html("<input type='text' id='txtCollection_" + rowNumber + "'  class='checknumeric' onblur='return fnCurrencyFormatNew(this, \"Collection\")' onclick= '$(this).select();'/>");
    $(tdRemarks).html("<textarea id='txtRemark_" + rowNumber + "' class='checkspecialchar' onclick= '$(this).select();'></textarea>");

    autoComplete(stockiestjsonString, "txtStockiestName", "hdnStockiestCode", 'autostockiest');
    fnStockiestEventBinder();

    rowNumber = parseInt(rowNumber) + 1;
}

function GetExpense(entity, travelKm) {
    debugger;
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4StockiestExpense/ExpenseDetails',
        data: "entity=" + escape(entity) + "&dcrDate=" + dcrDate + "&Travel_Km=" + travelKm + "&dcrStatus=" + dcrStatus + "&flag=" + flag_g,
        success: function (jsExpenseData) {
            debugger;
            dailyAllowance = dailyAllowance.split(',');
            expense_g = jsExpenseData;
            var expense = "[";
            for (var i = 0; i < expense_g[0].Data.length; i++) {
                // Hide autofill also.
                if (hideExpense_g && flag_g == "A" && $.inArray(expense_g[0].Data[i].ExpenseTypeName, dailyAllowance) !== -1) {
                    continue;
                }
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
    debugger;
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
                    if ($.inArray(expense_g[1].Data[i - 1].ExpenseTypeName, dailyAllowance) !== -1) {
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
                var draftAmountObj = "";
                if (expense_g[2] != null && expense_g[2].Data != null && expense_g[2].Data.length > 0) {
                    draftAmountObj = jsonPath(expense_g[2], "$.Data[?(@.ExpenseTypeCode=='" + expense_g[1].Data[i - 1].ExpenseTypeCode + "')]");
                }

                tableContent += "<td><input type='text' id='txtExpense_" + i + "' value='" + expense_g[1].Data[i - 1].ExpenseTypeName + "' class='autoexpense'  onclick= '$(this).select();' " + style + " /><input type='hidden' id='hdnExpenseCode_" + i + "' value='" + expense_g[1].Data[i - 1].ExpenseTypeCode + "'/></td>";
                if (expense_g[1].Data[i - 1].IsPrefill != "R") {
                    if (draftAmountObj != null && draftAmountObj && draftAmountObj.length > 0) {
                        tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' value='" + draftAmountObj[0].ExpenseAmount + "' class='checknumeric' onclick= '$(this).select();' " + style + " /></td>";
                    }
                    else {
                        tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' value='" + expense_g[1].Data[i - 1].TotalFare + "' class='checknumeric' onclick= '$(this).select();' " + style + " /></td>";
                    }
                }
                else {
                    tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' value='" + expense_g[1].Data[i - 1].TotalFare + "' class='checknumeric' onclick= '$(this).select();' " + style + " /></td>";
                }

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
                tableContent += "<td><input type='text' id='txtExpense_" + i + "' class='autoexpense' placeholder='To enter any other expense types,press down arrow key here.' onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);'/><input type='hidden' id='hdnExpenseCode_" + i + "'/></td>";
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
                        tableContent += "<td><input type='text' id='txtExpense_" + j + "' value='" + expense_g[2].Data[k].ExpenseTypeName + "' class='autoexpense' placeholder='To enter any other expense types,press down arrow key here.' onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);'/><input type='hidden' id='hdnExpenseCode_" + j + "' value='" + expense_g[2].Data[k].ExpenseTypeCode + "'/></td>";
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
                    tableContent += "<td><input type='text' id='txtExpense_" + i + "' value='" + expense_g[2].Data[i - 1].ExpenseTypeName + "' class='autoexpense' placeholder='To enter any other expense types,press down arrow key here.' onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);'/><input type='hidden' id='hdnExpenseCode_" + i + "' value='" + expense_g[2].Data[i - 1].ExpenseTypeCode + "'/></td>";
                    tableContent += "<td><input type='text' id='txtExpenseAmount_" + i + "' value='" + expense_g[2].Data[i - 1].ExpenseAmount + "' class='checknumeric' onclick= '$(this).select();' /></td>";
                    tableContent += "<td><textarea id='txtExpenseRemark_" + i + "'  class='checkspecialchar'  onclick= '$(this).select();' >" + expense_g[2].Data[i - 1].ExpenseRemark + "</textarea></td>";
                    tableContent += "</tr>";
                }
            }
            tableContent += "<tr>";
            //Newly added for prefil the amount when select DAILY expenseType Mode
            tableContent += "<td><input type='text' id='txtExpense_" + i + "' class='autoexpense' placeholder='To enter any other expense types,press down arrow key here.' onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this)' /><input type='hidden' id='hdnExpenseCode_" + i + "'/></td>";
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
            tableContent += "<td><input type='text' id='txtExpense_" + i + "' class='autoexpense' onclick= '$(this).select();' placeholder='To enter any other expense types,press down arrow key here.' onblur='fnprefillMonthlybasedAllowence(this);' /><input type='hidden' id='hdnExpenseCode_" + i + "'/></td>";
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
    debugger;
    var id = "txtExpense_" + (expenseRow - 1) + "";
    if (e.id != id) {
        return;
    }
    var rCnt = $("#tblExpense tr").length;
    var newRow = document.getElementById("tblExpense").insertRow(parseInt(rCnt));

    var tdExpense = newRow.insertCell(0);
    var tdExpenseAmount = newRow.insertCell(1);
    var tdExpenseRemark = newRow.insertCell(2);

    $(tdExpense).html("<input type='text' id='txtExpense_" + expenseRow + "' class='autoexpense' placeholder='To enter any other expense types,press down arrow key here.' onclick= '$(this).select();' onblur='fnprefillMonthlybasedAllowence(this);'/><input type='hidden' id='hdnExpenseCode_" + expenseRow + "'/>");
    $(tdExpenseAmount).html("<input type='text' id='txtExpenseAmount_" + expenseRow + "' class='checknumeric' onclick= '$(this).select();' />");
    $(tdExpenseRemark).html("<textarea id='txtExpenseRemark_" + expenseRow + "' class='checkspecialchar' onclick= '$(this).select();' ></textarea>");

    autoComplete(expensejsonString, "txtExpense", "hdnExpenseCode", 'autoexpense');
    fnExpenseEventBinder();

    expenseRow = parseInt(expenseRow) + 1;
}

//Prefill the Monthly based allowence
function fnprefillMonthlybasedAllowence(obj) {
    debugger;
    var arrMonthlybased = obj.id;
    var expense_id = arrMonthlybased.split('_')[1];
    if ($("#hdnExpenseCode_" + expense_id).val() != '') {
        if (cvPrefill_g.toUpperCase() == 'YES') {
            var expenseType_Code = $("#hdnExpenseCode_" + expense_id).val();
            if (expense_g[0].Data.length > 0) {
                var jsonMonth_Expense = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeCode=='" + expenseType_Code + "')]");
                if (jsonMonth_Expense != null && jsonMonth_Expense.length > 0) {
                    if (jsonMonth_Expense[0].ExpenseMode.toUpperCase() == 'DAILY' && jsonMonth_Expense[0].SFC_Type.toUpperCase() == 'E' && jsonMonth_Expense[0].IsPrefill.toUpperCase() == 'N') {
                        $('#txtExpenseAmount_' + expense_id).val(jsonMonth_Expense[0].EligibilityAmount);
                    }
                    else {
                        $('#txtExpenseAmount_' + expense_id).val('');
                    }
                }
            }
        }
        else {
            $('#txtExpenseAmount_' + expense_id).val('');
        }
    }
}


function fnReadStockiestTable() {
    debugger;
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
                if (objVisitTime.length > 0) {
                    if (objVisitTime[0].Privilege_Value_Name == 'VISIT_TIME_MANDATORY') {
                        //stockiestDetails += $("#txtStartTime_" + i).val();
                        //stockiestDetails += $("#txtStartTime_" + i).val().split(" ")[0] + '^';
                        stockiestDetails += $("#txtStartTime_" + i).val().split(" ")[1] + '^';
                    }
                    else if (objVisitTime[0].Privilege_Value_Name == 'AM_PM') {
                        stockiestDetails += $("input:radio[name=visitmode_" + i + "]:checked").val().toUpperCase() + '^';
                    }
                }
                else {
                    stockiestDetails += $("input:radio[name=visitmode_" + i + "]:checked").val().toUpperCase() + '^';
                }
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
                stockiestDetails += $.trim($("#txtRemark_" + i).val()) + '^';
                if (objVisitTime.length > 0) {
                    if (objVisitTime[0].Privilege_Value_Name == 'VISIT_TIME_MANDATORY') {
                        stockiestDetails += $("#txtStartTime_" + i).val().split(" ")[0] + '^';
                    }
                    else if (objVisitTime[0].Privilege_Value_Name == 'AM_PM') {
                        stockiestDetails += '^';
                    }
                }
                else {
                    stockiestDetails += '^';
                }
            }
        }
        stockiestDetails = $.trim(stockiestDetails);
        return isTrue;
    }
}
function fnValidateStockiest(rCnt) {
    debugger;
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
            if (objVisitTime.length > 0) {
                if (objVisitTime[0].Privilege_Value_Name == 'VISIT_TIME_MANDATORY') {
                    if ($("#txtStartTime_" + i).val() == "") {
                        fnMsgAlert('info', 'Stockiest & Expense', 'Please enter Visit Session/Time for' + " " + $("#txtStockiestName_" + i).val());
                        return false;
                    }
                }
            }
            if ($("#hdnStockiestCode_" + i).val() == "") {
                fnMsgAlert('info', 'Stockist & Expense', $("#txtStockiestName_" + i).val() + " is invalid " + stockistHeaderName + " name.");
                return false;
            }
        }
        if ($("#txtStockiestName_" + i).val() != "" || $("#txtPOB_" + i).val() != "" || $("#txtCollection_" + i).val() != "" || $("#txtRemark_" + i).val() != "") {

            // Empty check for Stockiest Name.
            if ($("#txtStockiestName_" + i).val() == "") {
                HideModalPopup('dvLoading');
                fnMsgAlert('info', 'Stockist & Expense', 'Please Enter the ' + stockistHeaderName + ' Name.');
                $("#txtStartTime_" + i).val("");
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
                    fnMsgAlert('info', 'Stockist & Expense', 'The ' + stockistHeaderName + ' name ' + stockiest + ' is entered more than one time. It is not allowed.');
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
            var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2("#txtRemark_" + i);
            if (!res) {
                var id = $("#txtRemark_" + i);
                HideModalPopup('dvLoading');
                fnMsgAlert('info', 'Information', 'Please Enter the following characters only <b>[ ' + allowCharacterinDCR + ' ]</b> in ' + stockistHeaderName + ' remarks ' + i + '');
                fnErrorIndicator(id);
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
    debugger;
    var expenseNameArr = [];
    var eligibilityAmount = 0.0;
    var correctIndex = [];
    var expenseTypeNameArr = [];
    expenseTypeDetails = "";
    var ex_count = new Array();

    for (var i = 1; i <= rCnt; i++) {
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

            // Expense Remark Mandatory for Monthly
            var expense = $("#txtExpense_" + i).val();
            var expenseTypeNameArr = jsonPath(expense_g[0], "$.Data[?(@.ExpenseTypeName=='" + expense + "')]");
            if (expenseTypeNameArr[0].ExpenseMode == "MONTHLY" && expenseTypeNameArr[0].Mandate_Remarks == "Y") {
                if ($("#txtExpenseRemark_" + i).val().trim() == "") {
                    ex_count.push(expenseTypeNameArr[0].ExpenseTypeName);
                }
            }

            expenseTypeNameArr.push(i);

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
            var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2("#txtExpenseRemark_" + i);
            if (!res) {
                HideModalPopup('dvLoading');
                var id = $("#txtExpenseRemark_" + i);
                fnMsgAlert('info', 'Information', 'Please Enter the following characters only <b> [ ' + allowCharacterinDCR + ' ] </b> in Expense remarks ' + i + '');
                fnErrorIndicator(id);
                $('.btnSave').show();
                return false;
            }
            correctIndex.push(i);
        }
    }

    // Expense Remark Mandatory more than one Expense Type Name, i.e "Expense Remarks is Mandatory for DailyAllowance, Internet"
    if (ex_count.length > 0) {
        var msg = "";
        for (var i = 0; i < ex_count.length; i++) {
            if (i == 0)
                msg = ex_count[i];
            else
                msg = msg + ", " + ex_count[i];
        }
        HideModalPopup('dvLoading');
        fnMsgAlert('info', 'Mandate Remarks', 'Please enter remarks for expenses: ' + msg + '');
        $('.btnSave').show();
        return false;
    }
    // End Expense Mandatory Remarks.

    if (expense_g[0].Data.length > 0 && correctIndex.length > 0) {
        fnCanSplitAmount(0, correctIndex);
    }
    else {
        fnReadExpenseTable();
    }
}

function fnCanSplitAmount(index, row) {
    debugger;

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
    debugger;
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

                        if (parseFloat(enteredAmount) > parseFloat(eligibilityAmount)) {
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
                                enteredAmount = parseFloat(enteredAmount) + parseFloat(expenseSum);
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
    debugger;
    var rCntExpense = $("#tblExpense tr").length;
    expenseDetails = "";
    var monthlyExpenseCodesJson = "";
    var monthlyExpenseCodes = "";
    var dailyExpenseCodesJson = "";
    var dailyExpenseCodes = "";
    if (expense_g[0].Data.length > 0) {
        // Generate the expense data string

        for (var i = 1; i <= rCntExpense; i++) {
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
    if ($('#txtCommonRemarks').val() != '') {
        var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2("#txtCommonRemarks");
        if (!res) {
            HideModalPopup('dvLoading');
            var id = $("#txtCommonRemarks");
            fnMsgAlert('info', 'Information', 'Please Enter the following characters only <b> [ ' + allowCharacterinDCR + ' ] </b> in Common Remarks.');
            $('.btnSave').show();
            fnErrorIndicator(id);
            return false;
        }
    }

    if ($('#txtCommonRemarks').val().length > 225) {
        HideModalPopup('dvLoading');
        fnMsgAlert('info', 'Information', 'Cannot allow Above 225 characters in Common Remarks.');
        $('.btnSave').show();
        return false;
    }
    // insert stockiest expense details.
    if (submitStatus == '1') {//Enter only Save and Submit
        if ($("#txtCommonRemarks").val().trim() != '')
            com_Remark_Mandatory = "NO";
    }
    else {
        com_Remark_Mandatory = "NO";
    }
    if (com_Remark_Mandatory.toUpperCase() == "NO") {
        var _objdateDetails = CommonDateDetails.fnGetTodaysDateNew();

        try {
            debugger;

            // HD Error Audit Log.
            var objStockiestData = {};
            objStockiestData.tblStockiestData = JSON.stringify(stockiestDetails);
            objStockiestData.tblExpenseData = JSON.stringify(expenseDetails);
            objStockiestData.dcrDate = dcrDate;
            objStockiestData.dailyAllowance = dailyAllowance;
            objStockiestData.dcrStatus = dcrStatus;
            objStockiestData.submit = submitStatus;
            objStockiestData.autoApproval = autoApproval;
            objStockiestData.flag = flag_g;
            objStockiestData.commonRemarks = $("#txtCommonRemarks").val().trim();
            objStockiestData.comRemarkMandatory = com_Remark_MandatoryStatic;
            objStockiestData._objDateDetails = JSON.stringify(_objdateDetails);

            var objdata = {
                PartitionKey: "HiDoctor",
                Type: "DCRLog",
                CompanyCode: CompanyCode,
                UserCode: User_Code,
                RegionCode: Region_Code,
                ActionDateTime: new Date().toLocaleString(),
                ModuleName: "DCR",
                SubModuleName: "Stockist Visit & Expense Details.",
                ActionTaken: (dcrStatus == "3" ? "Submit Draft" : "Submit Applied"),
                ErrorCode: "",
                ErrorMessage: "",
                Data: "POST DATA",
                Json: JSON.stringify(objStockiestData),
                SourceOfEntry: "WEB",
                VersionName: "14.4.3",
                VersionCode: "14.4.3"
            };
            var context = ["api", "HDLogServices"];
            ErrorLogCoreRest.post(context, objdata, fnSucessCallBack, fnFailureCallback);
        }
        catch (ex) {

        }
        // End.

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/DCRV4StockiestExpense/InsertAllValues',
            data: "tblStockiestData=" + escape(stockiestDetails) + "&tblExpenseData=" + escape(expenseDetails) + "&dcrDate=" + dcrDate + "&dailyAllowance=" + dailyAllowance +
                "&dcrStatus=" + dcrStatus + "&submit=" + submitStatus +
                "&autoApproval=" + autoApproval + "&flag=" + flag_g + "&commonRemarks=" + $("#txtCommonRemarks").val().trim() +
                "&comRemarkMandatory=" + com_Remark_MandatoryStatic + "&_objDateDetails=" + JSON.stringify(_objdateDetails),
            success: function (result) {
                Insertresult = result;
                fncheckactivitytype(dcrDate);

            }
        });
    }
    else {
        HideModalPopup('dvLoading');
        $('.btnSave').show();
        fnMsgAlert('error', 'DCR', 'Dear ' + username + ',<br/>Please enter the remarks for resubmitting this DCR. ');
    }
}
function fncheckactivitytype(dcrdate) {
    debugger;
    Method_params = ["DieticianReporting/Checkactivitytype", Company_Code, dcrdate, RegionCode, UserCode];
    CoreREST.get(null, Method_params, null, fncheckactivitytypeSuccessCallback, fncheckactivitytypeFailureCallback);
}
function fncheckactivitytypeSuccessCallback(response) {
    debugger;
    for (var i = 0; i < response.list.length; i++) {
        if (response.list[i].SubActivity_Name != null) {
            DR_status = 1
        }
    }
    if (Insertresult.toUpperCase() == "TRUE") {
        if (flag_g == 'F' && submitStatus == '1' && jsonKYDConfig_g == '1' && jsonDoctorCount_g > 0 && $.trim(unapprovereason_g) == "") {
            $('#main').load('HiDoctor_Activity/DCRV4KYD/KYD/?dcrActualDate=' + dcrDate + '&flag=' + flag_g);
        }
        else {
            if (flag_g == 'A' && submitStatus == '1' && DR_status == 1) {
                ShowModalPopup('dvLoading');
                fnRedirecttodieticianreporting();
            }
                //if (flag_g == 'A' && DR_status == 1) {
                //    fnRedirecttodieticianreporting();
                //}
            else {
                fnRedirectToInstantReport();
            }
        }
    }
    else {
        HideModalPopup('dvLoading');
        fnMsgAlert('error', 'Stockist & Expense', 'Insertion failed.');
        $('.btnSave').show();
    }
}
function fncheckactivitytypeFailureCallback() {

}
function fnSucessCallBack() {

}
function fnFailureCallback() {

}
function fnSubmit(status) {
    debugger;
    debugger;
    var doc = fnGetPrivilegeValue("SHOW_SAMPLE_IN_DCR_ATTENDANCE", "NO");
    var error = true;
    doc = 'NO';
    if (doc == 'YES')
        error = AttendanceDoctor.fnSaveProduct();
    if (!error) {
        $('.btnSave').show();
        return false;
    }
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
    debugger;
    // Valid name check for Expense
    $('.autoexpense').blur(function () { return fnValidateAutofill(this, expensejsonString, "txtExpense_", "hdnExpenseCode_") });

    // New row Creation - Expense Table
    $(".autoexpense").keyup(function () { fnCreateNewRowInExpense(this); });
    $(".autoexpense").dblclick(function () { fnCreateNewRowInExpense(this); });

    $(".checknumeric").blur(function () { return fnCheckNumeric(this) });
    $(".checkspecialchar").blur(function () { fnCloseTextarea(this); fnRemoveErrorIndicatior(this); });
    $(".checkspecialchar").focus(function () { fnExpandTextarea(this); });
}

function fnStockiestEventBinder() {
    debugger;
    // Valid name check for Stockiest
    $(".autostockiest").blur(function () { return fnValidateAutofill(this, stockiestjsonString, "txtStockiestName_", "hdnStockiestCode_") });

    // New row Creation - Stockiest Table
    $(".autostockiest").keyup(function () { fnCreateNewRowInStockiest(this); });
    $(".autostockiest").dblclick(function () { fnCreateNewRowInStockiest(this); });

    $(".checknumeric").blur(function () { return fnCheckNumeric(this) });
    $(".checkspecialchar").blur(function () { fnCloseTextarea(this); fnRemoveErrorIndicatior(this); });
    $(".checkspecialchar").focus(function () { fnExpandTextarea(this); });

    $('.time').timepicker({
        showPeriod: true,
        showLeadingZero: true
    });
}
function fnRedirecttodieticianreporting() {
    var date = dcrDate.split('-')[1] + '/' + dcrDate.split('-')[2] + '/' + dcrDate.split('-')[0];

    $('#main').load('../HiDoctor_Activity/DieticianReporting/DieticianReporting/?dcrActualDate=' + dcrDate);
    HideModalPopup('dvLoading');
}
function fnRedirectToInstantReport() {
    debugger;

    $('#main').load('../HiDoctor_Activity/DCRV4Report/Index/?dcrActualDate=' + dcrDate + '&flag=' + flag_g + '&Company_Code=' + Company_Code + '&UserCode=' + UserCode + '&RegionCode=' + RegionCode + '&CompanyId=' + 0);
    HideModalPopup('dvLoading');
    //parent.location.href = url;
}

function fnRedirectToHeader() {
    debugger;
    if (isrcpa == "N") {
        $('#main').load('../HiDoctor_Activity/DCRV4Header/Index/?dcrDate=' + dcrDate + '&dcrStatus=' + dcrStatus + '&isrcpa=' + isrcpa + '&source=TAB_STOCKIEST&flag=' + flag_g);
    }
    if (isrcpa == "R") {
        $('#main').load('../HiDoctor_Activity/DCRV4Header/Index/?dcrDate=' + dcrDate + '&dcrStatus=' + status_g + '&isrcpa=Y&source=TAB_STOCKIEST&flag=' + flag_g);
    }
}


function fnRedirectToDoctorVisit() {
    debugger;
    var dcrActualDate = dcrActualDate = dcrDate.split('-')[2] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[0];
    if (flag_g == "A") {
        //  var doc = fnGetPrivilegeValue("SHOW_SAMPLE_IN_DCR_ATTENDANCE", "NO");
        if (isThereAnyOneDoctorSavedA == "true" || isThereAnyOneDoctorSavedH == "true") {
            dcrActualDate = dcrActualDate.split('-')[2] + "-" + dcrActualDate.split('-')[1] + "-" + dcrActualDate.split('-')[0];
        }
    }
    if (isrcpa == "N") {
        if (flag_g == "A") {
            $('#main').load('../HiDoctor_Activity/DCRV4DoctorVisit/Index/?status=' + dcrStatus + '&flagRCPA=N&cp=' + escape(cpCode_g) + '&tp=' + escape(tpCode_g) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(entity) + '&travelledkms=' + travelKm + '&source=TAB_STOCKIEST&flag=' + flag_g + "&actvity=" + escape(activity_g));
        }
        else {
            $('#main').load('../HiDoctor_Activity/DCRV4DoctorVisit/Index/?status=' + dcrStatus + '&flagRCPA=N&cp=' + escape(cpCode_g) + '&tp=' + escape(tpCode_g) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(entity) + '&travelledkms=' + travelKm + '&source=TAB_STOCKIEST&flag=' + flag_g);
        }
    }
    else if (isrcpa == "R") {
        if (flag_g == "A") {
            $('#main').load('../HiDoctor_Activity/DCRV4DoctorVisit/Index/?status=' + dcrStatus + '&flagRCPA=R&cp=' + escape(cpCode_g) + '&tp=' + escape(tpCode_g) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(entity) + '&travelledkms=' + travelKm + '&source=TAB_STOCKIEST&flag=' + flag_g + "&actvity=" + escape(activity_g));
        }
        else {
            $('#main').load('../HiDoctor_Activity/DCRV4DoctorVisit/Index/?status=' + dcrStatus + '&flagRCPA=R&cp=' + escape(cpCode_g) + '&tp=' + escape(tpCode_g) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(entity) + '&travelledkms=' + travelKm + '&source=TAB_STOCKIEST&flag=' + flag_g);
        }
    }
}


//Adding Accompanist's Stockiest Details
function fnGetAccompanistRegionCodes() {
    debugger;
    if (acc_g != null) {
        for (var a = 0; a < acc_g.length; a++) {
            acccomRegions_g += acc_g[a].accCode + "^";
        }
    }
}

//Check config values for showing the KYD Screen and Doctor duplicate check column 
function fnGetConfigvaluesforKYD() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4KYD/GetConfigurationValues',
        type: "POST",
        success: function (jsData) {
            if (jsData != null && jsData != '') {
                jsonKYDConfig_g = jsData[0].Config_KYDvaluesforDesignation;
                jsonKYDDoctorduplicatecheckColumn_g = jsData[0].Config_DuplicatecheckColumn;
                if (jsonKYDConfig_g != null && jsonKYDConfig_g == "1") {
                    fnGetDoctorcountforKYD();
                }
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
    debugger;
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4KYD/GetKYDDoctorJsonList',
        type: "POST",
        data: 'dcrDate=' + dcrDate + '&Key_Column=' + jsonKYDDoctorduplicatecheckColumn_g,
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


function fnCheckRemarksSpecialCharforDCRFORSTEX(id) {
    if ($(id).val() != "") {
        var specialCharregexfordcr = new RegExp(/^[a-zA-Z0-9-_.?,;:&*()[\] ]+$/);
        if (!specialCharregexfordcr.test($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please Remove the following special characters ' + restrictedSpecialchar_g + '');
            fnErrorIndicator(id);
            return false;
        }
        else {
            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true
}
var stockistHeaderName = "";
var DoctorHeader = "";
function fnPrivilegeValueforHeaderName() {
    debugger;
    //stockist
    stockistHeaderName = fnGetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist ");

    if (stockistHeaderName.length >= 20) {
        stockistHeaderName = stockistHeaderName.substr(0, 20) + "...";

    }

    if (stockistHeaderName != '') {
        $("#spnStockist").text(stockistHeaderName);
        $("#stockist").html(stockistHeaderName + " - Expense");
        $("#btnInsertCP").val("Go to " + stockistHeaderName + " Visit >>");
    }
    DoctorHeader = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor ");

    var cv_Header = fnGetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist ")
    var headerName = DoctorHeader + ' & ' + cv_Header;
    if (headerName.length >= 20) {
        headerName = headerName.substr(0, 20) + "...";
    }
    $('#spnDcoCus').text(headerName);
    //Doctors / Customers
}
function fnCurrencyFormatNew(id, text) {
    debugger
    if ($.trim($(id).val()).length > 0) {
        if (!/^\d{1,11}(\.\d{1,2})?$/.test($(id).val())) {
            fnMsgAlert('info', 'Information', 'Invalid ' + text + ' amount.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {

            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true;
}
