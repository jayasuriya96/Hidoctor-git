
var expTypeD = "", expTypeND = "", category = "";
var entryD = "", entryND = "", entryRow = "", entryRowND = "";
var group_g = "", daily_g = "", nonDaily_g = "";

function fnGetExpenseDetailsTable() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExpenseGroup/GetExpenseTypeDetails',
        data: "type=load",
        success: function (jsData) {
            var expense = eval('(' + jsData + ')');
            expTypeD = expense.Tables[0].Rows;
            expTypeND = expense.Tables[1].Rows;
            category = expense.Tables[2].Rows;

            // generate json for Expense group.
            var grp = "[";
            for (var i = 1; i < $("#ddlExpenseGroup option").length; i++) {
                grp += "{label:" + '"' + "" + $("#ddlExpenseGroup option")[i].text + "" + '",' + "value:" + '"' + "" + $("#ddlExpenseGroup option")[i].value + "" + '"' + "}";
                if (i < $("#ddlExpenseGroup option").length - 1) {
                    grp += ",";
                }
            }
            grp += "];";
            group_g = eval(grp);

            //generate json for Daily Expense
            var dly = "[";
            for (var i = 0; i < expTypeD.length; i++) {
                dly += "{label:" + '"' + "" + expTypeD[i].Expense_Type_Name + "" + '",' + "value:" + '"' + "" + expTypeD[i].Expense_Type_Code + "" + '"' + "}";
                if (i < expTypeD.length - 1) {
                    dly += ",";
                }
            }
            dly += "];";
            daily_g = eval(dly);

            //generate json for NonDaily Expense
            var ndly = "[";
            for (var i = 0; i < expTypeND.length; i++) {
                ndly += "{label:" + '"' + "" + expTypeND[i].Expense_Type_Name + "" + '",' + "value:" + '"' + "" + expTypeND[i].Expense_Type_Code + "" + '"' + "}";
                if (i < expTypeND.length - 1) {
                    ndly += ",";
                }
            }
            ndly += "];";
            nonDaily_g = eval(ndly);

            var categoryTable = "";

            categoryTable = "<table class='catTable' cellspacing='0' cellpadding='0'><thead>";
            categoryTable += "<tr><th>Category</th><th>Applicable?</th><th>Sum Distance?</th></tr></thead>";
            categoryTable += "<tbody>";
            for (var j = 0; j < category.length; j++) {
                categoryTable += "<tr><td>" + category[j].Expense_Entity_Name + "</td>";
                categoryTable += "<td><input type='checkbox' id='chkEligAmnt_DNUM_" + j + "' checked='checked' onclick='$(\"#ddlSumDist_DNUM_" + j + "\").toggle();$(\"#ddlSumDist_DNUM_" + j + "\").val(\"NO\");' /></td>";
                categoryTable += "<td><select class='cmbBox' id='ddlSumDist_DNUM_" + j + "'><option value='NO'>-Select-</option><option value='Y'>Yes</option><option value='N'>No</option></select></td></tr>";
            }
            categoryTable += "</tbody></table>";
            $("#hdnCatNE").val(categoryTable);

            categoryTable = "<table class='catTable'  cellspacing='0' cellpadding='0'><thead>";
            categoryTable += "<tr><th>Category</th><th>Eligibility Amount</th></tr></thead>";
            categoryTable += "<tbody>";
            for (var j = 0; j < category.length; j++) {
                categoryTable += "<tr><td>" + category[j].Expense_Entity_Name + "</td>";
                categoryTable += "<td><input type='text' id='txtEligAmount_DNUM_" + j + "' style='width:50px !important;'  value='' class='checkexpnumeric' onclick= '$(this).select();' /></td></tr>";

            }
            categoryTable += "</tbody></table>";

            $("#hdnCatE").val(categoryTable);

            autoComplete(group_g, "Expense_Group_Name", "hdnGroupCode", 'autoGroup');
            $(".autoGroup").dblclick(function () { autoComplete(group_g, "Expense_Group_Name", "hdnGroupCode", 'autoGroup'); });
            $(".autoGroup").keypress(function () { autoComplete(group_g, "Expense_Group_Name", "hdnGroupCode", 'autoGroup'); });
            //fnValidateAutofill(obj, json, actObj, hdnObj)

            fnCreateDailyModeTable('LOAD');
            fnCreateNonDailyModeTable('LOAD');
        }
    });
}

function fnCreateDailyModeTable(option) {
    debugger;
    var content = "";
    var count = "";
    if (option == 'LOAD') {
        if (expTypeD.length > 0) {
            count = expTypeD.length;
            entryD = count + 1;
        }
    }
        // edit mode
    else if (option != false && option.length > 0) {
        count = option.length;
        entryD = count + 1;
    }

    if (count > 0) {
        content = "<table cellspacing='0' cellpadding='0' width='95%'  id='tblDaily' class='tblTarget'>";
        content += "<thead>";
        content += "<tr ><th class='tableth'>Expense Type</th>";
        content += "<th class='tableth'>Eligibility Base</th>";
        content += "<th class='tableth'>Travel Distance Edit</th>";
        content += "<th class='tableth'>Validation on Eligibility</th>";
        content += "<th class='tableth'>DCR Prefill</th>";
        content += "<th class='tableth'>Effective From</th>";
        content += "<th class='tableth'>Effective To</th>";
        content += "<th class='tableth' style='width:20% !important;'>Category and Summation</th>";
        //for (var i = 0; i < category.length; i++) {
        //    content += "<th class='tableth'>" + category[i].Expense_Entity_Name + "</th>";
        //}

        content += "</tr>";
        content += "</thead><tbody>";

        for (var i = 0; i <= count; i++) {
            content += "<tr id='trD_" + (i + 1) + "'>";
            if (i != count) {
                if (option == "LOAD") {
                    content += "<td><span id='spnExp_" + (i + 1) + "'>" + expTypeD[i].Expense_Type_Name + "</span><input type='hidden' id='hdnExpenseType_" + (i + 1) + "' value='" + expTypeD[i].Expense_Type_Code + "'/>";
                    content += "<input type='hidden' id='hdnGroupDetailID_" + (i + 1) + "'/><input type='hidden' id='hdnStatus_" + (i + 1) + "'/></td>";
                }
                else {
                    content += "<td><span id='spnExp_" + (i + 1) + "'>" + option[i].Expense_Type_Name + "</span><input type='hidden' id='hdnExpenseType_" + (i + 1) + "' value='" + option[i].Expense_Type_Code + "'/>";
                    content += "<input type='hidden' id='hdnGroupDetailID_" + (i + 1) + "' value='" + option[i].Expense_Group_Id + "'/><input type='hidden' id='hdnStatus_" + (i + 1) + "'/></td>";
                }
            }
            else {
                content += "<td><input type='text' id='txtExpenseType_" + (i + 1) + "'  class='autoExpense'  onclick= '$(this).select();'/><input type='hidden' id='hdnExpenseType_" + (i + 1) + "'/><input type='hidden' id='hdnGroupDetailID_" + (i + 1) + "'/><input type='hidden' id='hdnStatus_" + (i + 1) + "'/></td>";
            }
            content += "<td><select class='cmbBox' id='ddlEligBase_" + (i + 1) + "' onchange='fnSelectEligBase(this);'><option value='N'>-Select-</option><option value='E'>E</option><option value='S'>S</option><option value='SD'>SD</option><option value='SD_SLAB'>SD_SLAB</option><option value='D'>D</option><option value='D_SLAB'>D_SLAB</option><option value='DS'>DS</option><option value='DS_SLAB'>DS_SLAB</option></select></td>";
            content += "<td><div class='divShowE_" + (i + 1) + "'><input type= 'radio' name='disEdit_" + (i + 1) + "' value = 'R' checked='checked'/>Rigid<div class='divShowE_" + (i + 1) + "'><input type= 'radio' name='disEdit_" + (i + 1) + "' value = 'F'/>Flexi<div class='divShowE_" + (i + 1) + "'><input type= 'radio' name='disEdit_" + (i + 1) + "' value = 'A'/>All</div></td>";
            //content += "<td><div class='divShowE_" + (i + 1) + "'><input type='checkbox' id='chkDistanceEdit_" + (i + 1) + "'/></div></td>";
            content += "<td><div class='divShowNotE_" + (i + 1) + "'><input type='checkbox' id='chkValidElig_" + (i + 1) + "'/></div></td>";
            content += "<td><select class='cmbBox' id='ddlDCRPrefill_" + (i + 1) + "'><option value='NO'>-Select-</option><option value='R'>Rigid</option><option value='F'>Flexi</option><option value='N'>No Prefill</option></select></td>";
            content += "<td><input type='text' id='txtEffFrom_" + (i + 1) + "'  value='' style='width:75px !important;' class='datepick time' onclick= '$(this).select();' /></td>";
            content += "<td><input type='text' id='txtEffTo_" + (i + 1) + "'  value='' style='width:75px !important;' class='datepick time' onchange='fnCompareDate(this);' onclick= '$(this).select();' /></td>";
            content += "<td><div class='td-a' id='dvCat_" + (i + 1) + "' onclick='$(\"#dvCatExpand_" + (i + 1) + "\").toggle(200);' >Category</div><div id='dvCatExpand_" + (i + 1) + "' style='display:none;' ><div class='divShowNotE_" + (i + 1) + "'>" + $("#hdnCatE").val().replace(/DNUM/g, (i + 1)) + "</div><div class='divShowE_" + (i + 1) + "' style='display:none;'>" + $("#hdnCatNE").val().replace(/DNUM/g, (i + 1)) + "</div></div></td>";
            //for (var j = 0; j < category.length; j++) {
            //    content += "<td> <div class='divShowNotE_" + (i + 1) + "'><input type='text' id='txtEligAmount_" + (i + 1) + "_" + j + "' style='width:50px !important;'  value='' class='checkexpnumeric' onclick= '$(this).select();' /></div><div class='divShowE_" + (i + 1) + "' style='display:none;'><input type='checkbox' id='chkEligAmnt_" + (i + 1) + "_" + j + "' checked='checked'/></div></td>";
            //}
            content += "</tr>";
        }
        content += "</tbody></table>";
        entryRow = parseInt(i) + 1;

        $("#dvDailyBlock").html(content);
        autoComplete(daily_g, "txtExpenseType", "hdnExpenseType", 'autoExpense');

        if (option != "LOAD") {
            debugger;
            if (option != false && option.length > 0) {
                for (var i = 0; i < option.length; i++) {

                    if ($("#hdnPrefill").val() == 'EVENT') {
                        if ($("#hdnGroupDetailID_" + (i + 1)).val() != 'null' && $("#hdnGroupDetailID_" + (i + 1)).val() != "" && $("#hdnGroupDetailID_" + (i + 1)).val() != null) {
                            $("#hdnStatus_" + (i + 1)).val("Y");
                        }
                    }

                    if (option[i].SFC_Type != null) {
                        $("#ddlEligBase_" + (i + 1)).val(option[i].SFC_Type);

                        if (option[i].SFC_Type == "E") {
                            if (option[i].Is_Validation_On_Eligibility != null && option[i].Is_Validation_On_Eligibility == "Y") {
                                $("#chkValidElig_" + (i + 1)).attr('checked', 'checked');
                            }
                            for (var j = 0; j < category.length; j++) {
                                if (option[i][category[j].Expense_Entity_Code] != null) {
                                    $("#txtEligAmount_" + (i + 1) + "_" + j).val(option[i][category[j].Expense_Entity_Code].split('_')[0]);
                                }
                            }
                        }
                        else {
                            if (option[i].Distance_Edit != null) {
                                $("input[name=disEdit_" + (i + 1) + "][value=" + option[i].Distance_Edit + "]").attr('checked', 'checked');
                            }
                            //if (option[i].Distance_Edit != null && option[i].Distance_Edit == "F") {
                            //    $("#chkDistanceEdit_" + (i + 1)).attr('checked', 'checked');
                            //}
                            for (var j = 0; j < category.length; j++) {
                                if (option[i][category[j].Expense_Entity_Code] == null) {
                                    //$("#txtEligAmount_" + (i + 1) + "_" + j).val(option[i][category[j].Expense_Entity_Code]);
                                    $("#chkEligAmnt_" + (i + 1) + "_" + j).attr('checked', false);
                                    $("#ddlSumDist_" + (i + 1) + "_" + j).css('display', 'none');
                                }
                                else {
                                    if (option[i][category[j].Expense_Entity_Code].split('_').length > 1) {
                                        $("#ddlSumDist_" + (i + 1) + "_" + j).val(option[i][category[j].Expense_Entity_Code].split('_')[1]);
                                    }
                                }
                            }
                        }
                    }
                    if (option[i].Is_Prefill != null) {
                        $("#ddlDCRPrefill_" + (i + 1)).val(option[i].Is_Prefill);
                    }
                    if (option[i].Effective_From != null) {
                        $("#txtEffFrom_" + (i + 1)).val(option[i].Effective_From);
                    }
                    if (option[i].Effective_To != null && option[i].Effective_To != '31/12/9999') {
                        $("#txtEffTo_" + (i + 1)).val(option[i].Effective_To);
                    }

                    if (option[i].SFC_Type != null) {
                        if (option[i].SFC_Type == "E") {
                            $('.divShowE_' + (i + 1)).css('display', 'none');
                            $('.divShowNotE_' + (i + 1)).css('display', '');
                        }
                        else if (option[i].SFC_Type == "N") {
                            $('.divShowE_' + (i + 1)).css('display', '');
                            $('.divShowNotE_' + (i + 1)).css('display', '');
                        }
                        else {
                            $('.divShowNotE_' + (i + 1)).css('display', 'none');
                            $('.divShowE_' + (i + 1)).css('display', '');
                        }
                    }
                }
            }
        }
        fnDailyBlockEventBinder();
    }
    else {
        content = "<span>No Expense Type Found.</span>";
        $("#dvDailyBlock").html(content);
    }
}

function fnCreateNonDailyModeTable(option) {
    var content = "";
    var count = "";
    if (option == 'LOAD') {
        if (expTypeND.length > 0) {
            count = expTypeND.length;
            entryND = count + 1;
        }
    }

        // edit mode
    else if (option != false && option.length > 0) {
        count = option.length;
        entryND = count + 1;
    }

    if (count > 0) {
        content = "<table cellspacing='0' cellpadding='0' width='70%'  id='tblNonDaily' class='tblTarget'>";
        content += "<thead>";
        content += "<tr ><th class='tableth'>ExpenseType</th>";
        content += "<th class='tableth'>Expense Mode</th>";
        content += "<th class='tableth'>Can Split Amount</th>";
        content += "<th class='tableth'>Validation on Eligibility</th>";
        content += "<th class='tableth'>Amount</th>";
        content += "<th class='tableth'>Effective From</th>";
        content += "<th class='tableth'>Effective To</th>";
        content += "<th class='tableth'>Mandate remarks</th>";
        content += "</tr>";
        content += "</thead><tbody>";

        for (var i = 0; i <= count; i++) {
            content += "<tr id='trND_" + (i + 1) + "'>";
            if (i != count) {
                if (option == "LOAD") {
                    content += "<td><span id='spnExpND_" + (i + 1) + "'>" + expTypeND[i].Expense_Type_Name + "</span><input type='hidden' id='hdnExpenseTypeND_" + (i + 1) + "' value='" + expTypeND[i].Expense_Type_Code + "'/>";
                    content += "<input type='hidden' id='hdnGroupDetailIDND_" + (i + 1) + "'/><input type='hidden' id='hdnStatusND_" + (i + 1) + "'/></td>";
                }
                else {
                    content += "<td><span id='spnExpND_" + (i + 1) + "'>" + option[i].Expense_Type_Name + "</span><input type='hidden' id='hdnExpenseTypeND_" + (i + 1) + "' value='" + option[i].Expense_Type_Code + "'/>";
                    content += "<input type='hidden' id='hdnGroupDetailIDND_" + (i + 1) + "' value='" + option[i].Expense_Group_Detail_Id + "'/><input type='hidden' id='hdnStatusND_" + (i + 1) + "'/></td>";
                }
            }
            else {
                content += "<td><input type='text' id='txtExpenseTypeND_" + (i + 1) + "'  class='autoExpenseND'  onclick= '$(this).select();'/><input type='hidden' id='hdnExpenseTypeND_" + (i + 1) + "'/><input type='hidden' id='hdnGroupDetailIDND_" + (i + 1) + "'/><input type='hidden' id='hdnStatusND_" + (i + 1) + "'/></td>";
            }
            content += "<td><select class='cmbBox' id='ddlExpModeND_" + (i + 1) + "'><option value='N'>-Select-</option><option value='WEEKLY'>Weekly</option><option value='MONTHLY'>Monthly</option><option value='YEARLY'>Yearly</option></select></td>";
            content += "<td><input type='checkbox' id='chkCanSplitND_" + (i + 1) + "'/></td>";
            content += "<td><input type='checkbox' id='chkValidEligND_" + (i + 1) + "'/></td>";
            content += "<td><input type='text' id='txtEligAmountND_" + (i + 1) + "' style='width:50px !important;'   value='' class='checkexpnumeric' onclick= '$(this).select();' /></td>";
            content += "<td><input type='text' id='txtEffFromND_" + (i + 1) + "'  value='' style='width:75px !important;' class='datepick time' onclick= '$(this).select();' /></td>";
            content += "<td><input type='text' id='txtEffToND_" + (i + 1) + "'  value='' style='width:75px !important;' class='datepick time' onchange='fnCompareDateND(this);' onclick= '$(this).select();' /></td>";
            content += "<td><input type='checkbox' id='chkMandRemarkND_" + (i + 1) + "'/></td>";
            content += "</tr>";
        }
        content += "</tbody></table>";
        entryRowND = parseInt(i) + 1;
        $("#dvNonDailyBlock").html(content);
        autoComplete(nonDaily_g, "txtExpenseTypeND", "hdnExpenseTypeND", 'autoExpenseND');

        if (option != "LOAD") {
            if (option != false && option.length > 0) {
                for (var i = 0; i < option.length; i++) {

                    if ($("#hdnPrefill").val() == 'EVENT') {
                        if ($("#hdnGroupDetailIDND_" + (i + 1)).val() != 'null' && $("#hdnGroupDetailIDND_" + (i + 1)).val() != "" && $("#hdnGroupDetailIDND_" + (i + 1)).val() != null) {
                            $("#hdnStatusND_" + (i + 1)).val("Y");
                        }
                    }

                    if (option[i].Expense_Mode != null) {
                        $("#ddlExpModeND_" + (i + 1)).val(option[i].Expense_Mode);
                    }
                    if (option[i].Can_Split_Amount != null && option[i].Can_Split_Amount == "Y") {
                        $("#chkCanSplitND_" + (i + 1)).attr('checked', 'checked');
                    }
                    if (option[i].Is_Validation_On_Eligibility != null && option[i].Is_Validation_On_Eligibility == "Y") {
                        $("#chkValidEligND_" + (i + 1)).attr('checked', 'checked');
                    }
                    if (option[i].Eligibility_Amount != null) {
                        $("#txtEligAmountND_" + (i + 1)).val(option[i].Eligibility_Amount);
                    }
                    if (option[i].Effective_From != null) {
                        $("#txtEffFromND_" + (i + 1)).val(option[i].Effective_From);
                    }
                    if (option[i].Effective_To != null && option[i].Effective_To != '31/12/9999') {
                        $("#txtEffToND_" + (i + 1)).val(option[i].Effective_To);
                    }

                    if (option[i].Mandate_Remarks != null && option[i].Mandate_Remarks == "Y") {
                        $("#chkMandRemarkND_" + (i + 1)).attr('checked', 'checked');
                    }

                }
            }
        }
        fnNonDailyBlockEventBinder();
    }
    else {
        content = "<span>No Expense Type Found.</span>";
        $("#dvNonDailyBlock").html(content);
    }
}

//********************* DAILY BLOCK EVENTS- START *********************************************************************************************//
function fnSelectEligBase(id) {
    var row = (id.id).split('_')[1];
    if ($(id).val() == "E") {
        $('.divShowE_' + row).css('display', 'none');
        $('.divShowNotE_' + row).css('display', '');
    }
    else if ($(id).val() == "N") {
        $('.divShowE_' + row).css('display', '');
        $('.divShowNotE_' + row).css('display', '');

    }
    else {
        $('.divShowE_' + row).css('display', '');
        $('.divShowNotE_' + row).css('display', 'none');
    }
}

function fnDailyBlockEventBinder() {
    // New row Creation - Accompanist Table
    $(".autoExpense").keypress(function () { fnCreateNewRowInDailyBlock(this); });
    $(".autoExpense").dblclick(function () { fnCreateNewRowInDailyBlock(this); });

    $(".checkexpnumeric").blur(function () { if ($(this).val() != "") { return fnCheckNumeric(this); } });

    // for date picker.
    $('.datepick').datepicker({ dateFormat: 'dd/mm/yy' });
}

function fnCompareDate(id) {
    if ($(id).val() != "") {
        var row = (id.id).split('_')[1];
        if ($("#txtEffFrom_" + row).val() == "") {
            fnMsgAlert('info', 'Expense Group Header', 'Please Enter Effective From Date.');
            $(id).val("");
            $("#txtEffFrom_" + row).focus();
            return false;
        }
        var fromDate = $("#txtEffFrom_" + row).val().split('/')[2] + '/' + $("#txtEffFrom_" + row).val().split('/')[1] + '/' + $("#txtEffFrom_" + row).val().split('/')[0];
        var toDate = $(id).val().split('/')[2] + '/' + $(id).val().split('/')[1] + '/' + $(id).val().split('/')[0];
        var startDate = new Date(fromDate);
        var endDate = new Date(toDate);

        if (endDate != "") {
            if (startDate > endDate) {
                fnMsgAlert('info', 'Expense Group Header', 'End date can not be less than start date.');
                $(id).val("");
                return false;
            }
        }
    }
    else {
        fnRemoveErrorIndicatior(id);
        return true;
    }
}

function fnCreateNewRowInDailyBlock(e) {
    var id = "txtExpenseType_" + (entryRow - 1) + "";
    if (e.id != id) { return; }
    //var rCnt = $("#tblDaily tr").length;
    var newRow = document.getElementById("tblDaily").insertRow(parseInt(entryRow));
    $(newRow).attr('id', 'trD_' + entryRow);

    //var trlength = rCnt - 1;
    //var tdlength = $("#tblDaily tr td").length / trlength;

    //for (var a = 1; a <= tdlength; a++) {
    //    newRow.insertCell((a - 1)).id = 'td_' + entryRow + '_' + a;
    //}
    var tdExpenseType = newRow.insertCell(0);
    var tdElig = newRow.insertCell(1);
    var tdTDE = newRow.insertCell(2);
    var tdVE = newRow.insertCell(3);
    var tdPre = newRow.insertCell(4);
    var tdFrom = newRow.insertCell(5);
    var tdTo = newRow.insertCell(6);
    var tdCate = newRow.insertCell(7);


    $(tdExpenseType).html("<input type='text' id='txtExpenseType_" + entryRow + "'  class='autoExpense'  onclick= '$(this).select();'/><input type='hidden' id='hdnExpenseType_" + entryRow + "'/><input type='hidden' id='hdnGroupDetailID_" + entryRow + "'/><input type='hidden' id='hdnStatus_" + entryRow + "'/>");
    $(tdElig).html("<select class='cmbBox' id='ddlEligBase_" + entryRow + "' onchange='fnSelectEligBase(this);'><option value='N'>-Select-</option><option value='E'>E</option><option value='S'>S</option><option value='SD'>SD</option><option value='SD_FLAT'>SD_FLAT</option><option value='SD_SLAB'>SD_SLAB</option><option value='D'>D</option><option value='D_FLAT'>D_FLAT</option><option value='D_SLAB'>D_SLAB</option><option value='DS'>DS</option><option value='DS_FLAT'>DS_FLAT</option><option value='DS_SLAB'>DS_SLAB</option></select>");
    $(tdTDE).html("<div class='divShowE_" + entryRow + "'><input type='checkbox' id='chkDistanceEdit_" + entryRow + "'/></div>");
    $(tdVE).html("<div class='divShowNotE_" + entryRow + "'><input type='checkbox' id='chkValidElig_" + entryRow + "'/></div>");
    $(tdPre).html("<select class='cmbBox' id='ddlDCRPrefill_" + entryRow + "'><option value='NO'>-Select-</option><option value='R'>Rigid</option><option value='F'>Flexi</option><option value='N'>No Prefill</option></select>");
    $(tdFrom).html("<input type='text' id='txtEffFrom_" + entryRow + "'  value='' style='width:75px !important;' class='datepick time' onclick= '$(this).select();' />");
    $(tdTo).html("<input type='text' id='txtEffTo_" + entryRow + "'  value='' style='width:75px !important;' class='datepick time' onchange='fnCompareDate(this);' onclick= '$(this).select();' />");
    $(tdCate).html("<div class='td-a' id='dvCat_" + entryRow + "' onclick='$(\"#dvCatExpand_" + entryRow + "\").toggle(200);' >Category</div><div id='dvCatExpand_" + entryRow + "' style='display:none;' ><div class='divShowNotE_" + entryRow + "'>" + $("#hdnCatE").val().replace(/DNUM/g, entryRow) + "</div><div class='divShowE_" + entryRow + "' style='display:none;'>" + $("#hdnCatNE").val().replace(/DNUM/g, entryRow) + "</div></div>");

    autoComplete(daily_g, "txtExpenseType", "hdnExpenseType", 'autoExpense');
    fnDailyBlockEventBinder();
    entryRow = parseInt(entryRow) + 1;
}
//********************* DAILY BLOCK EVENTS- END *********************************************************************************************//

//********************* NON DAILY BLOCK EVENTS- START *********************************************************************************************//

function fnNonDailyBlockEventBinder() {
    // New row Creation - Accompanist Table
    $(".autoExpenseND").keypress(function () { fnCreateNewRowInNonDailyBlock(this); });
    $(".autoExpenseND").dblclick(function () { fnCreateNewRowInNonDailyBlock(this); });

    $(".checkexpnumeric").blur(function () { if ($(this).val() != "") { return fnCheckNumeric(this); } });

    // for date picker.
    $('.datepick').datepicker({ dateFormat: 'dd/mm/yy' });
}

function fnCompareDateND(id) {
    if ($(id).val() != "") {
        var row = (id.id).split('_')[1];
        if ($("#txtEffFromND_" + row).val() == "") {
            fnMsgAlert('info', 'Expense Group Header', 'Please Enter Effective From Date.');
            $(id).val("");
            $("#txtEffFromND_" + row).focus();
            return false;
        }
        var fromDate = $("#txtEffFromND_" + row).val().split('/')[2] + '/' + $("#txtEffFromND_" + row).val().split('/')[1] + '/' + $("#txtEffFromND_" + row).val().split('/')[0];
        var toDate = $(id).val().split('/')[2] + '/' + $(id).val().split('/')[1] + '/' + $(id).val().split('/')[0];
        var startDate = new Date(fromDate);
        var endDate = new Date(toDate);

        if (endDate != "") {
            if (startDate > endDate) {
                fnMsgAlert('info', 'Expense Group Header', 'End date can not be less than start date.');
                $(id).val("");
                return false;
            }
        }
    }
    else {
        fnRemoveErrorIndicatior(id);
        return true;
    }
}

function fnCreateNewRowInNonDailyBlock(e) {
    debugger;
    var id = "txtExpenseTypeND_" + (entryRowND - 1) + "";
    if (e.id != id) { return; }
    var rCnt = $("#tblNonDaily tr").length;
    var newRow = document.getElementById("tblNonDaily").insertRow(parseInt(rCnt));
    $(newRow).attr('id', 'trND_' + entryRowND);

    var tdExpenseType = newRow.insertCell(0);
    var tdMode = newRow.insertCell(1);
    var tdCanSplit = newRow.insertCell(2);
    var tdValidate = newRow.insertCell(3);
    var tdAmount = newRow.insertCell(4);
    var tdFrom = newRow.insertCell(5);
    var tdTo = newRow.insertCell(6);
    var tdMandRemark = newRow.insertCell(7);

    $(tdExpenseType).html("<input type='text' id='txtExpenseTypeND_" + entryRowND + "'  class='autoExpenseND'  onclick= '$(this).select();'/><input type='hidden' id='hdnExpenseTypeND_" + entryRowND + "'/><input type='hidden' id='hdnGroupDetailIDND_" + entryRowND + "'/><input type='hidden' id='hdnStatusND_" + entryRowND + "'/>");
    $(tdMode).html("<select class='cmbBox' id='ddlExpModeND_" + entryRowND + "'><option value='N'>-Select-</option><option value='WEEKLY'>Weekly</option><option value='MONTHLY'>Monthly</option><option value='YEARLY'>Yearly</option></select>");
    $(tdCanSplit).html("<input type='checkbox' id='chkCanSplitND_" + entryRowND + "'/>");
    $(tdValidate).html("<input type='checkbox' id='chkValidEligND_" + entryRowND + "'/>");
    $(tdAmount).html("<input type='text' id='txtEligAmountND_" + entryRowND + "' style='width:50px !important;'   value='' class='checkexpnumeric' onclick= '$(this).select();' />");
    $(tdFrom).html("<input type='text' id='txtEffFromND_" + entryRowND + "'  value='' style='width:75px !important;' class='datepick time' onclick= '$(this).select();' />");
    $(tdTo).html("<input type='text' id='txtEffToND_" + entryRowND + "'  value='' style='width:75px !important;' class='datepick time' onchange='fnCompareDateND(this);' onclick= '$(this).select();' />");
    $(tdMandRemark).html("<input type ='checkbox' id='chkMandRemarkND_" + entryRowND + "'/>");

    autoComplete(nonDaily_g, "txtExpenseTypeND", "hdnExpenseTypeND", 'autoExpenseND');
    fnNonDailyBlockEventBinder();

    entryRowND = parseInt(entryRowND) + 1;
}
//********************* NON DAILY BLOCK EVENTS- END *********************************************************************************************//

function fnGetGroupPrefillData(id) {
    debugger;
    var groupID = "";
    if (id.id == "Expense_Group_Name") {
        if ($("#Expense_Group_Name").val() == "") {
            $("#spnSelect").css('display', 'none');
        }
        else {
            $("#spnSelect").css('display', '');
            $("#spnSelectRegion").html($("#Expense_Group_Name").val());
        }
        groupID = $("#hdnGroupCode").val();
    }
    else {
        if ($("#ddlExpenseGroup").val() == "") {
            $("#spnSelect").css('display', 'none');
        }
        else {
            $("#spnSelect").css('display', '');
            $("#spnSelectRegion").html($("#ddlExpenseGroup :selected").text());
        }
        groupID = $("#ddlExpenseGroup").val();
        $("#hdnPrefill").val("EVENT");
    }
    debugger;
    if (groupID != "") {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/ExpenseGroup/GetExpenseGroupDetails',
            data: "groupID=" + groupID,
            success: function (jsPrefillData) {
                debugger;
                if (jsPrefillData != false && jsPrefillData != "") {
                    var prefill = eval('(' + jsPrefillData + ')');
                    var prefillD = prefill.Tables[0].Rows;
                    var prefillND = prefill.Tables[1].Rows;

                    fnCreateNonDailyModeTable(prefillND);
                    fnCreateDailyModeTable(prefillD);
                }
                else {
                    fnCreateDailyModeTable('LOAD');
                    fnCreateNonDailyModeTable('LOAD');
                }

            }
        });
    }
    else {
        fnCreateDailyModeTable('LOAD');
        fnCreateNonDailyModeTable('LOAD');
    }
}

//********************************************* Validation - start ********************************************//
function fnValidateDailyBlock() {
    // mandatory  field check
    for (var i = 1; i < entryRow; i++) {
        if (i >= entryD) {
            if ($("#txtExpenseType_" + i).val() != "") {
                if ($("#ddlEligBase_" + i).val() == "N") {
                    fnMsgAlert('info', 'Expense Group Header', 'Please select Eligibility base for ' + $("#txtExpenseType_" + i).val() + '.');
                    //HideModalPopup('dvLoading');
                    $("#ddlEligBase_" + i).focus();
                    return false;
                }
            }
        }

        if ($("#ddlEligBase_" + i).val() != "N") {
            if (i >= entryD) {
                // empty check for expense type
                if ($("#txtExpenseType_" + i).val() == "") {
                    fnMsgAlert('info', 'Expense Group Header', 'Please enter Expense Type.');
                    //HideModalPopup('dvLoading');
                    $("#txtExpenseType_" + i).focus();
                    return false;
                }
                var jsonExpenseType = jsonPath(expTypeD, "$.[?(@.Expense_Type_Name=='" + $("#txtExpenseType_" + i).val() + "')]");
                if (!(jsonExpenseType.length > 0)) {
                    fnMsgAlert('info', 'Expense Group Header', $("#txtExpenseType_" + i).val() + ' is invalid Expense type.');
                    //HideModalPopup('dvLoading');
                    $("#txtExpenseType_" + i).focus();
                    return false;
                }
            }
            // check for dcr prefill
            if ($("#ddlDCRPrefill_" + i).val() == "NO") {
                if (i >= entryD) {
                    fnMsgAlert('info', 'Expense Group Header', 'Please select DCR Prefil for ' + $("#txtExpenseType_" + i).val() + ' .');
                }
                else {
                    fnMsgAlert('info', 'Expense Group Header', 'Please select DCR Prefil for ' + $("#spnExp_" + i).html() + ' .');
                }
                //HideModalPopup('dvLoading');
                $("#ddlDCRPrefill_" + i).focus();
                return false;
            }
            // check for Effective from date
            if ($("#txtEffFrom_" + i).val() == "") {
                if (i >= entryD) {
                    fnMsgAlert('info', 'Expense Group Header', 'Please select Effective From date for ' + $("#txtExpenseType_" + i).val() + ' .');
                }
                else {
                    fnMsgAlert('info', 'Expense Group Header', 'Please select Effective From date for ' + $("#spnExp_" + i).html() + ' .');
                }
                //HideModalPopup('dvLoading');
                $("#txtEffFrom_" + i).focus();
                return false;
            }

            //check for sum distance
            if ($("#ddlEligBase_" + i).val() != "E") { //check for sum distance
                var catCount = 0;
                for (var j = 0; j < category.length; j++) {
                    if ($("#chkEligAmnt_" + i + "_" + j).attr('checked')) {
                        catCount += 1;
                        if ($("#ddlSumDist_" + i + "_" + j).val() == "NO") {
                            if (i >= entryD) {
                                fnMsgAlert('info', 'Expense Group Header', 'Please select Sum Distance for ' + category[j].Expense_Entity_Name + '  for ' + $("#txtExpenseType_" + i).val() + ' .');
                            }
                            else {
                                fnMsgAlert('info', 'Expense Group Header', 'Please select Sum Distance for ' + category[j].Expense_Entity_Name + '  for ' + $("#spnExp_" + i).html() + ' .');
                            }
                            $("#dvCatExpand_" + i).show();
                            $("#ddlSumDist_" + i + "_" + j).focus()
                            return false;
                        }
                    }
                }
                if (catCount == 0) {
                    if (i >= entryD) {
                        fnMsgAlert('info', 'Expense Group Header', 'Please Enter atleast one category  for ' + $("#txtExpenseType_" + i).val() + ' .');
                    }
                    else {
                        fnMsgAlert('info', 'Expense Group Header', 'Please Enter atleast one category  for ' + $("#spnExp_" + i).html() + ' .');
                    }
                    $("#dvCatExpand_" + i).show();
                    return false;
                }
            }
            else { // check  eligibility amount for atleast one category
                var catCount = 0;
                for (var j = 0; j < category.length; j++) {
                    if ($("#txtEligAmount_" + i + "_" + j).val() != "") {
                        catCount += 1;
                    }
                }
                if (catCount == 0) {
                    if (i >= entryD) {
                        fnMsgAlert('info', 'Expense Group Header', 'Please Enter eligibility amount atleast for one category  for ' + $("#txtExpenseType_" + i).val() + ' .');
                    }
                    else {
                        fnMsgAlert('info', 'Expense Group Header', 'Please Enter eligibility amount atleast for one category  for ' + $("#spnExp_" + i).html() + ' .');
                    }
                    $("#dvCatExpand_" + i).show();
                    $("#txtEligAmount_" + i + "_0").focus();
                    return false;
                }
            }
        }
    }
    // mandatory check end.

    fnNonFixedEligibilityBaseCheck();
}

function fnNonFixedEligibilityBaseCheck() {
    // Non- Fixed check

    var tblCnt = "";
    var istrue = new Boolean(true);
    tblCnt = "<table id='tblUniqueCheckSFC'>";
    tblCnt += "<thead>";
    tblCnt += "<tr><th>Expense_Type</th>";
    tblCnt += "<th>Eff_From</th>";
    tblCnt += "<th>Eff_To</th>";
    tblCnt += "<th>Row</th>";
    tblCnt += "</tr>";
    tblCnt += "</thead><tbody>";

    for (var j = 1; j < entryRow; j++) {
        if ($("#ddlEligBase_" + j).val() != "N" && $("#ddlEligBase_" + j).val() != "E") {
            tblCnt += "<tr>";
            tblCnt += "<td>" + $("#txtEffFrom_" + j).val() + "</td>";
            if ($("#txtEffTo_" + j).val() == "") {
                tblCnt += "<td>31/12/9999</td>";
            }
            else {
                tblCnt += "<td>" + $("#txtEffTo_" + j).val() + "</td>";
            }
            tblCnt += "<td>" + j + "</td>";
            tblCnt += "</tr>";
        }
    }
    tblCnt += "</tbody></table>";
    $("#divUnidueCheck").html(tblCnt);
    var uniqueJson = "";

    $("#tblUniqueCheckSFC").tabletojson({
        headers: "Eff_From,Eff_To,Row",
        complete: function (x) {
            uniqueJson = eval('(' + x + ')');
        }
    });

    if (uniqueJson.length > 1) {
        for (var j = 0; j < uniqueJson.length; j++) {
            for (var i = j + 1; i < uniqueJson.length; i++) {
                var currFrom = new Date(uniqueJson[i].Eff_From.split('/')[2] + '/' + uniqueJson[i].Eff_From.split('/')[1] + '/' + uniqueJson[i].Eff_From.split('/')[0]);
                var currTo = new Date(uniqueJson[i].Eff_To.split('/')[2] + '/' + uniqueJson[i].Eff_To.split('/')[1] + '/' + uniqueJson[i].Eff_To.split('/')[0]);
                var fromDate = new Date(uniqueJson[j].Eff_From.split('/')[2] + '/' + uniqueJson[j].Eff_From.split('/')[1] + '/' + uniqueJson[j].Eff_From.split('/')[0]);
                var toDate = new Date(uniqueJson[j].Eff_To.split('/')[2] + '/' + uniqueJson[j].Eff_To.split('/')[1] + '/' + uniqueJson[j].Eff_To.split('/')[0]);
                if ((currFrom >= fromDate && currFrom <= toDate) || (currTo >= fromDate && currTo <= toDate)) {
                    fnMsgAlert('info', 'Expense Group Header', 'You can select the eligibility base other than E for only one time.');
                    $("#trD_" + uniqueJson[i].Row).addClass('trbgColor');
                    //HideModalPopup('dvLoading');
                    return false;
                }
                else if (currFrom <= fromDate && currTo >= toDate) {
                    fnMsgAlert('info', 'Expense Group Header', 'You can select the eligibility base other than E for only one time.');
                    //$('body,html').animate({ scrollTop: 0 }, 500);
                    $("#trD_" + uniqueJson[i].Row).addClass('trbgColor');
                    //HideModalPopup('dvLoading');
                    return false;
                }
            }
        }
    }
    fnUniqueCheckForDaily();
}

function fnUniqueCheckForDaily() {
    var tblCnt = "";
    var istrue = new Boolean(true);
    tblCnt = "<table id='tblUniqueCheckDaily'>";
    tblCnt += "<thead>";
    tblCnt += "<tr><th>Expense_Type</th>";
    tblCnt += "<th>Eff_From</th>";
    tblCnt += "<th>Eff_To</th>";
    tblCnt += "<th>Row</th>";
    tblCnt += "</tr>";
    tblCnt += "</thead><tbody>";

    for (var j = 1; j < entryRow; j++) {
        if ($("#ddlEligBase_" + j).val() != "N") {
            tblCnt += "<tr>";
            tblCnt += "<td>" + $("#hdnExpenseType_" + j).val() + "</td>";
            tblCnt += "<td>" + $("#txtEffFrom_" + j).val() + "</td>";
            if ($("#txtEffTo_" + j).val() == "") {
                tblCnt += "<td>31/12/9999</td>";
            }
            else {
                tblCnt += "<td>" + $("#txtEffTo_" + j).val() + "</td>";
            }
            tblCnt += "<td>" + j + "</td>";
            tblCnt += "</tr>";
        }
    }
    tblCnt += "</tbody></table>";
    $("#divUnidueCheck").html(tblCnt);
    var uniqueData = "";

    $("#tblUniqueCheckDaily").tabletojson({
        headers: "Expense_Type,Eff_From,Eff_To,Row",
        complete: function (x) {
            uniqueData = eval('(' + x + ')');
        }
    });

    for (var k = 0; k < expTypeD.length; k++) {
        var uniqueJson = jsonPath(uniqueData, "$.[?(@.Expense_Type=='" + expTypeD[k].Expense_Type_Code + "')]");
        if (uniqueJson.length > 1) {
            for (var j = 0; j < uniqueJson.length; j++) {
                for (var i = j + 1; i < uniqueJson.length; i++) {
                    var currFrom = new Date(uniqueJson[i].Eff_From.split('/')[2] + '/' + uniqueJson[i].Eff_From.split('/')[1] + '/' + uniqueJson[i].Eff_From.split('/')[0]);
                    var currTo = new Date(uniqueJson[i].Eff_To.split('/')[2] + '/' + uniqueJson[i].Eff_To.split('/')[1] + '/' + uniqueJson[i].Eff_To.split('/')[0]);
                    var fromDate = new Date(uniqueJson[j].Eff_From.split('/')[2] + '/' + uniqueJson[j].Eff_From.split('/')[1] + '/' + uniqueJson[j].Eff_From.split('/')[0]);
                    var toDate = new Date(uniqueJson[j].Eff_To.split('/')[2] + '/' + uniqueJson[j].Eff_To.split('/')[1] + '/' + uniqueJson[j].Eff_To.split('/')[0]);
                    if ((currFrom >= fromDate && currFrom <= toDate) || (currTo >= fromDate && currTo <= toDate)) {
                        fnMsgAlert('info', 'Expense Group Header', 'Unique combination conflict has occured for the Expense type ' + expTypeD[k].Expense_Type_Name + '.');
                        $("#trD_" + uniqueJson[i].Row).addClass('trbgColor');
                        //HideModalPopup('dvLoading');
                        return false;
                    }
                    else if (currFrom <= fromDate && currTo >= toDate) {
                        fnMsgAlert('info', 'Expense Group Header', 'Unique combination conflict has occured for the Expense type ' + expTypeD[k].Expense_Type_Name + '.');
                        $("#trD_" + uniqueJson[i].Row).addClass('trbgColor');
                        //HideModalPopup('dvLoading');
                        return false;
                    }
                }
            }
        }
    }
    fnValidateNonDailyBlock();
}

function fnValidateNonDailyBlock() {
    debugger;
    // mandatory  field check
    for (var i = 1; i < entryRowND; i++) {
        if (i >= entryND) {
            if ($("#txtExpenseTypeND_" + i).val() != "") {
                if ($("#ddlExpModeND_" + i).val() == "N") {
                    fnMsgAlert('info', 'Expense Group Header', 'Please select Expense Mode for ' + $("#txtExpenseTypeND_" + i).val() + '.');
                    //HideModalPopup('dvLoading');
                    $("#ddlExpModeND_" + i).focus();
                    return false;
                }
            }
        }

        if ($("#ddlExpModeND_" + i).val() != "N") {
            if (i >= entryND) {
                // empty check for expense type
                if ($("#txtExpenseTypeND_" + i).val() == "") {
                    fnMsgAlert('info', 'Expense Group Header', 'Please enter Expense Type.');
                    //HideModalPopup('dvLoading');
                    $("#txtExpenseTypeND_" + i).focus();
                    return false;
                }
                var jsonExpenseType = jsonPath(expTypeND, "$.[?(@.Expense_Type_Name=='" + $("#txtExpenseTypeND_" + i).val() + "')]");
                if (!(jsonExpenseType.length > 0)) {
                    fnMsgAlert('info', 'Expense Group Header', $("#txtExpenseTypeND_" + i).val() + ' is invalid Expense type.');
                    //HideModalPopup('dvLoading');
                    $("#txtExpenseTypeND_" + i).focus();
                    return false;
                }
            }
            // check for expense amount
            if ($("#txtEligAmountND_" + i).val() == "") {
                if (i >= entryND) {
                    fnMsgAlert('info', 'Expense Group Header', 'Please enter Expense Amount for ' + $("#txtExpenseTypeND_" + i).val() + '.');
                }
                else {
                    fnMsgAlert('info', 'Expense Group Header', 'Please enter Expense Amount for ' + $("#spnExpND_" + i).html() + '.');
                }
                //HideModalPopup('dvLoading');
                $("#txtEligAmountND_" + i).focus();
                return false;
            }
            // check for Effective from date
            if ($("#txtEffFromND_" + i).val() == "") {
                if (i >= entryND) {
                    fnMsgAlert('info', 'Expense Group Header', 'Please select Effective From date for ' + $("#txtExpenseTypeND_" + i).val() + '.');
                }
                else {
                    fnMsgAlert('info', 'Expense Group Header', 'Please select Effective From date for ' + $("#spnExpND_" + i).html() + '.');
                }
                //HideModalPopup('dvLoading');
                $("#txtEffFromND_" + i).focus();
                return false;
            }

        }
    }
    // mandatory check end.
    fnUniqueCheckForNonDaily();
}

function fnUniqueCheckForNonDaily() {
    var tblCnt = "";
    var istrue = new Boolean(true);
    tblCnt = "<table id='tblUniqueCheckND'>";
    tblCnt += "<thead>";
    tblCnt += "<tr><th>Expense_Type</th>";
    tblCnt += "<th>Eff_From</th>";
    tblCnt += "<th>Eff_To</th>";
    tblCnt += "<th>Row</th>";
    tblCnt += "</tr>";
    tblCnt += "</thead><tbody>";

    for (var j = 1; j < entryRowND; j++) {
        if ($("#ddlExpModeND_" + j).val() != "N") {
            tblCnt += "<tr>";
            tblCnt += "<td>" + $("#hdnExpenseTypeND_" + j).val() + "</td>";
            tblCnt += "<td>" + $("#txtEffFromND_" + j).val() + "</td>";
            if ($("#txtEffToND_" + j).val() == "") {
                tblCnt += "<td>31/12/9999</td>";
            }
            else {
                tblCnt += "<td>" + $("#txtEffToND_" + j).val() + "</td>";
            }
            tblCnt += "<td>" + j + "</td>";
            tblCnt += "</tr>";
        }
    }
    tblCnt += "</tbody></table>";
    $("#divUnidueCheck").html(tblCnt);
    var uniqueData = "";

    $("#tblUniqueCheckND").tabletojson({
        headers: "Expense_Type,Eff_From,Eff_To,Row",
        complete: function (x) {
            uniqueData = eval('(' + x + ')');
        }
    });

    for (var k = 0; k < expTypeND.length; k++) {
        var uniqueJson = jsonPath(uniqueData, "$.[?(@.Expense_Type=='" + expTypeND[k].Expense_Type_Code + "')]");
        if (uniqueJson.length > 1) {
            for (var j = 0; j < uniqueJson.length; j++) {
                for (var i = j + 1; i < uniqueJson.length; i++) {
                    var currFrom = new Date(uniqueJson[i].Eff_From.split('/')[2] + '/' + uniqueJson[i].Eff_From.split('/')[1] + '/' + uniqueJson[i].Eff_From.split('/')[0]);
                    var currTo = new Date(uniqueJson[i].Eff_To.split('/')[2] + '/' + uniqueJson[i].Eff_To.split('/')[1] + '/' + uniqueJson[i].Eff_To.split('/')[0]);
                    var fromDate = new Date(uniqueJson[j].Eff_From.split('/')[2] + '/' + uniqueJson[j].Eff_From.split('/')[1] + '/' + uniqueJson[j].Eff_From.split('/')[0]);
                    var toDate = new Date(uniqueJson[j].Eff_To.split('/')[2] + '/' + uniqueJson[j].Eff_To.split('/')[1] + '/' + uniqueJson[j].Eff_To.split('/')[0]);
                    if ((currFrom >= fromDate && currFrom <= toDate) || (currTo >= fromDate && currTo <= toDate)) {
                        fnMsgAlert('info', 'Expense Group Header', 'Unique combination conflict has occured for the Expense type ' + expTypeND[k].Expense_Type_Name + '.');
                        $("#trND_" + uniqueJson[i].Row).addClass('trbgColor');
                        //HideModalPopup('dvLoading');
                        return false;
                    }
                    else if (currFrom <= fromDate && currTo >= toDate) {
                        fnMsgAlert('info', 'Expense Group Header', 'Unique combination conflict has occured for the Expense type ' + expTypeND[k].Expense_Type_Name + '.');
                        $("#trND_" + uniqueJson[i].Row).addClass('trbgColor');
                        //HideModalPopup('dvLoading');
                        return false;
                    }
                }
            }
        }
    }
    fnReadExpense();
}

function fnReadExpense() {
    debugger;
    var insertExpense = "";

    for (var i = 1; i < entryRow; i++) {
        if ($("#ddlEligBase_" + i).val() != "N") {
            if ($("#ddlEligBase_" + i).val() == "E") { // Daily mode with Fixed
                for (var j = 0; j < category.length; j++) {
                    if ($("#txtEligAmount_" + i + "_" + j).val() != "") {
                        insertExpense += $("#hdnExpenseType_" + i).val() + '^'; //    Expense_Type_Code
                        insertExpense += 'DAILY^'; //    Expense_Mode
                        insertExpense += category[j].Expense_Entity_Name + '^'; //    Expense_Entity
                        insertExpense += category[j].Expense_Entity_Code + '^'; //    Expense_Entity_Code
                        insertExpense += $("#txtEligAmount_" + i + "_" + j).val() + '^'; //    Eligibility_Amount
                        insertExpense += '^'; //    Can_Split_Amount
                        if ($("#chkValidElig_" + i).attr('checked')) { //    Is_Validation_On_Eligibility
                            insertExpense += 'Y^';
                        }
                        else { insertExpense += 'N^'; }
                        insertExpense += 'E^'; //    SFC_Type
                        insertExpense += $("#ddlDCRPrefill_" + i).val() + '^'; //    Is_Prefill
                        //    Effective_From
                        //    Effective_To
                        insertExpense += $("#txtEffFrom_" + i).val().split('/')[2] + '-' + $("#txtEffFrom_" + i).val().split('/')[1] + '-' + $("#txtEffFrom_" + i).val().split('/')[0] + '^';
                        if ($("#txtEffTo_" + i).val() == "") {
                            insertExpense += "^";
                        }
                        else {
                            insertExpense += $("#txtEffTo_" + i).val().split('/')[2] + '-' + $("#txtEffTo_" + i).val().split('/')[1] + '-' + $("#txtEffTo_" + i).val().split('/')[0] + '^';
                        }
                        insertExpense += '^'; //    Distance_Edit
                        insertExpense += '^'; //    Sum_Distance
                        insertExpense += '^'; // Mandate_Remark
                    }
                }
            }
            else {// Daily mode with Non-Fixed
                for (var j = 0; j < category.length; j++) {
                    if ($("#chkEligAmnt_" + i + "_" + j).attr('checked')) {
                        insertExpense += $("#hdnExpenseType_" + i).val() + '^'; //    Expense_Type_Code
                        insertExpense += 'DAILY^'; //    Expense_Mode
                        insertExpense += category[j].Expense_Entity_Name + '^'; //    Expense_Entity
                        insertExpense += category[j].Expense_Entity_Code + '^'; //    Expense_Entity_Code
                        insertExpense += '0^'; //    Eligibility_Amount
                        insertExpense += '^'; //    Can_Split_Amount
                        insertExpense += '^'; //    Is_Validation_On_Eligibility                    
                        insertExpense += $("#ddlEligBase_" + i).val() + '^'; //    SFC_Type
                        insertExpense += $("#ddlDCRPrefill_" + i).val() + '^'; //    Is_Prefill
                        //    Effective_From
                        //    Effective_To
                        insertExpense += $("#txtEffFrom_" + i).val().split('/')[2] + '-' + $("#txtEffFrom_" + i).val().split('/')[1] + '-' + $("#txtEffFrom_" + i).val().split('/')[0] + '^';
                        if ($("#txtEffTo_" + i).val() == "") {
                            insertExpense += "^";
                        }
                        else {
                            insertExpense += $("#txtEffTo_" + i).val().split('/')[2] + '-' + $("#txtEffTo_" + i).val().split('/')[1] + '-' + $("#txtEffTo_" + i).val().split('/')[0] + '^';
                        }
                        if ($('input:radio[name=disEdit_' + i + ']:checked').val() == "R") {
                            insertExpense += 'R^';
                        }
                        else if ($('input:radio[name=disEdit_' + i + ']:checked').val() == "F") {
                            insertExpense += 'F^';
                        }
                        else {
                            insertExpense += 'A^';
                        }
                        //else if ($('input:radio[name=disEdit_" + (i + 1) + "]:checked').val() == "F") {
                        //    insertExpense += 'F^';
                        //}
                        
                        //if ($("#chkDistanceEdit_" + i).attr('checked')) { //    Distance_Edit
                        //    insertExpense += 'F^';
                        //}
                        //else {
                        //    insertExpense += 'R^';
                        //}
                        insertExpense += $("#ddlSumDist_" + i + "_" + j).val() + '^'; //    Sum_Distance
                        insertExpense += '^'; // Mandate_Remark
                    }
                }
            }
        }
    }

    for (var i = 1; i < entryRowND; i++) {
        debugger;
        if ($("#ddlExpModeND_" + i).val() != "N") {// Non Daily with Fixed.

            insertExpense += $("#hdnExpenseTypeND_" + i).val() + '^'; //    Expense_Type_Code
            insertExpense += $("#ddlExpModeND_" + i).val() + '^'; //    Expense_Mode
            insertExpense += '^'; //    Expense_Entity
            insertExpense += '^'; //    Expense_Entity_Code
            insertExpense += $("#txtEligAmountND_" + i).val() + '^'; //    Eligibility_Amount
            if ($("#chkCanSplitND_" + i).attr('checked')) { //    Can_Split_Amount
                insertExpense += 'Y^';
            }
            else { insertExpense += 'N^'; }
            if ($("#chkValidEligND_" + i).attr('checked')) { //    Is_Validation_On_Eligibility
                insertExpense += 'Y^';
            }
            else { insertExpense += 'N^'; }
            insertExpense += 'E^'; //    SFC_Type
            insertExpense += '^'; //    Is_Prefill
            //    Effective_From
            //    Effective_To
            insertExpense += $("#txtEffFromND_" + i).val().split('/')[2] + '-' + $("#txtEffFromND_" + i).val().split('/')[1] + '-' + $("#txtEffFromND_" + i).val().split('/')[0] + '^';
            if ($("#txtEffToND_" + i).val() == "") {
                insertExpense += "^";
            }
            else {
                insertExpense += $("#txtEffToND_" + i).val().split('/')[2] + '-' + $("#txtEffToND_" + i).val().split('/')[1] + '-' + $("#txtEffToND_" + i).val().split('/')[0] + '^';
            }
            insertExpense += '^'; //    Distance_Edit
            insertExpense += '^'; //    Sum_Distance

            // Mandate remark based on Monthly
            if ($("#chkMandRemarkND_" + i).attr('checked')) { // Mandate_Remark
                debugger;
                insertExpense += 'Y^';
            }
            else {
                insertExpense += 'N^';
            }
            // End Mandate Remark Based on Monthly
        }
    }

    //autoComplete(group_g, "Expense_Group_Name", "hdnGroupCode", 'autoGroup');

    if (insertExpense == "") {
        fnMsgAlert('info', 'Expense Group Header', 'Please enter atleast one expense type.');
        return;
    }

    var grpJson = jsonPath(group_g, "$.[?(@.label=='" + $("#Expense_Group_Name").val() + "')]");
    if (grpJson != false && grpJson.length > 0) {
        fnUpdateExpenseGroup(insertExpense);
    }
    else {
        fnInsertNewExpenseGroup(insertExpense);
    }
}

//********************************************* Validation - end **********************************************//

//************************************INSERTION- START ************************************************************//
function fnUpdateExpenseGroup(insertString) {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExpenseGroup/UpdateExpenseGroup',
        data: "insertExpense=" + escape(insertString) + "&grpid=" + $("#hdnGroupCode").val(),
        success: function (result) {
            debugger;
            if (result == 'SUCCESS') {
                fnMsgAlert('success', 'Expense Group Header', 'Saved successfully.');
                fnClearAllExpense();
                //HideModalPopup('dvLoading');
            }
            else {
                debugger;
                fnMsgAlert('error', 'Expense Group Header', 'Insertion failed.');
                //HideModalPopup('dvLoading');
                return false;
            }
        }
    });
}

var groupJson = "";
function fnInsertNewExpenseGroup(insertString) {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExpenseGroup/InsertExpenseGroup',
        data: "insertExpense=" + escape(insertString) + "&grpName=" + $("#Expense_Group_Name").val(),
        success: function (jGroup) {
            debugger;
            if (jGroup != false && jGroup != "") {
                groupJson = eval('(' + jGroup + ')');
                if (!(groupJson.Tables === undefined) && groupJson.Tables.length > 0 && groupJson.Tables[0].Rows.length > 0) {
                    fnMsgAlert('success', 'Expense Group Header', 'Saved successfully.');
                    fnBindExpenseGroup(groupJson);
                    fnClearAllExpense();
                    //HideModalPopup('dvLoading');
                }
            }
            else {
                fnMsgAlert('error', 'Expense Group Header', 'Insertion failed.');
                //HideModalPopup('dvLoading');
                return false;
            }
        }
    });
}

function fnBindExpenseGroup(groupJson) {
    // generate json for Expense group.
    var grp = "[";
    for (var i = 0; i < groupJson.Tables[0].Rows.length; i++) {
        grp += "{label:" + '"' + "" + groupJson.Tables[0].Rows[i].Expense_Group_Name + "" + '",' + "value:" + '"' + "" + groupJson.Tables[0].Rows[i].Expense_Group_Id + "" + '"' + "}";
        if (i < $("#ddlExpenseGroup option").length - 1) {
            grp += ",";
        }
    }
    grp += "];";
    group_g = eval(grp);

    autoComplete(group_g, "Expense_Group_Name", "hdnGroupCode", 'autoGroup');
    $(".autoGroup").dblclick(function () { autoComplete(group_g, "Expense_Group_Name", "hdnGroupCode", 'autoGroup'); });
    $(".autoGroup").keypress(function () { autoComplete(group_g, "Expense_Group_Name", "hdnGroupCode", 'autoGroup'); });


    $('option', $("#ddlExpenseGroup")).remove();
    $("#ddlExpenseGroup").append("<option value=''>- Select Expense Group -</option>");
    if (group_g.length > 0) {
        for (var c = 0; c < group_g.length; c++) {
            $("#ddlExpenseGroup").append("<option value=" + group_g[c].value + ">" + group_g[c].label + "</option>");
        }
    }
}
//************************************ INSERTION- END *******************************************************//

//**************************BUTTON CLICK- START ******************************************************//
function fnSaveChart() {

    if ($("#Expense_Group_Name").val() == "") {
        fnMsgAlert('info', 'Expense Group Header', 'Please enter expense group.');
        $("#Expense_Group_Name").focus();
        return;
    }

    // clear error indicator
    for (var i = 1; i < entryRow; i++) {
        if ($("#trD_" + i).hasClass('trbgColor')) {
            $("#trD_" + i).removeClass('trbgColor');
            break;
        }
    }
    for (var i = 1; i < entryRowND; i++) {
        if ($("#trND_" + i).hasClass('trbgColor')) {
            $("#trND_" + i).removeClass('trbgColor');
            break;
        }
    }
    fnValidateDailyBlock();
}

function fnClearAllExpense() {
    $("#Expense_Group_Name").val("");
    $("#hdnGroupCode").val("");
    $("#ddlExpenseGroup").val("");
    $("#spnSelect").css('display', 'none');
    fnCreateDailyModeTable('LOAD');
    fnCreateNonDailyModeTable('LOAD');
    return;
}

function fnShowHelp() { $("#divEligDetail").fadeIn('fast'); }

function fnHideHelp() { $("#divEligDetail").fadeOut('slow'); }

