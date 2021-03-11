var d_g = "";
var content = "";
var button = "";
var rownum = "";
var rowProd = "";
var StockiestJson_g = "";
var ProductJson_g = "";
var stockiestArray = new Array();
var customer_code = "", customer_Name = "";
var customerCode = "";
var ret = "";
var popup = "";
var doctorCode = "", doctor_Name = "";
var customerStockiestArray = new Array();
var expenseTable = "";
var CRMCustomerAndProductsJson = "";
var uploadFileName = new Array();
var AddlExpDet_g = "";
var AddlDcrDetEdit_g = "";
var AutoComplete_DcrDate = "";
var AutoComplete_Ovr_DcrFlag = "";
var AddlExpTypeDet_g = "";
var AddlExpDetEdit_g = "";
var AutoComplete_Dcr_Category = "";
var AddlExpArr = [];
var AutoComplete_AprDcrDate = "";
var autoComplete_DcrFlag_Edit = "";
var autoComplete_DcrCat_Edit = "";
var autoComplete_DcrExp = "";
var lstUserDetails = "";
var dcrattachment = '';
var Edituploadeddetails = '';
var dEntry = "<div class='col-lg-12' style='font-weight: bold;padding-left: 0px;'>Showing Expense details of <span id='spnfavouringUser'></span></div>";
dEntry += "<div  class='table-responsive'><table class='table table-striped' id='tbldocCRMEntry' cellspacing='0' cellpadding='0'>";
dEntry += "<thead><tr><th>Customer Name</th><th>Expense Amount</th><th>Present Contribution</th><th>Committed Contribution</th><th>Reference Details</th><th>Remarks</th><th>Show Grid</th></tr>";
dEntry += "</thead><tbody><tr>";
dEntry += "<td><input type='text' id='txtDCust_1' class='input-large form-control autoCust' /><input type='hidden' id='hdnDCust_1' /></td>";
dEntry += "<td><input type='text' id='txtDExp_1' class='input-mini form-control docExp' /></td>";
dEntry += "<td><input type='text' id='txtDPresent_1' class='input-large form-control checkexpnumeric' /></td>";
dEntry += "<td><input type='text' id='txtDPotential_1' class='input-large form-control checkexpnumeric' /></td>";
dEntry += "<td><input type='text' id='txtDBillNumber_1' class='input-large form-control' /></td>";
dEntry += "<td><textarea id='txtDUserRemarks_1' class='form-control'></textarea></td>";
dEntry += "<td><div id=dvbutton_1><input type='button' id='btnSaveOrEdit' class='btn btn-primary autoCust' value='Show/Edit Stockiest' onclick='StockiestPopup(1);'/>";
dEntry += "</tr><tr>";
dEntry += "<td><input type='text' id='txtDCust_2'  class='input-large form-control autoCust' /><input type='hidden' id='hdnDCust_2' /></td>";
dEntry += "<td><input type='text' id='txtDExp_2' class='input-mini form-control docExp' /></td>";
dEntry += "<td><input type='text' id='txtDPresent_2' class='input-large form-control checkexpnumeric' /></td>";
dEntry += "<td><input type='text' id='txtDPotential_2' class='input-large form-control checkexpnumeric' /></td>";
dEntry += "<td><input type='text' id='txtDBillNumber_2' class='input-large form-control' /></td>";
dEntry += "<td><textarea id='txtDUserRemarks_2' class='form-control'></textarea></td>";
dEntry += "<td><div id=dvbutton_2><input type='button' id='btnSaveOrEdit' class='btn btn-primary autoCust' value='Show/Edit Stockiest' onclick='StockiestPopup(2);'/></div>";
dEntry += "</tr></tbody></table></div><div style='clear: both;'></div>";

var dRow = "<tr>";
dRow += "<td><input type='text' id='txtDCust_DNUM'  class='input-large form-control autoCust' /><input type='hidden' id='hdnDCust_DNUM' /></td>";
dRow += "<td><input type='text' id='txtDExp_DNUM' class='input-mini form-control docExp' /></td>";
dRow += "<td><input type='text' id='txtDPresent_DNUM' class='input-large form-control checkexpnumeric' /></td>";
dRow += "<td><input type='text' id='txtDPotential_DNUM' class='input-large form-control checkexpnumeric' /></td>";
dRow += "<td><input type='text' id='txtDBillNumber_DNUM' class='input-large form-control' /></td>";
dRow += "<td><textarea id='txtDUserRemarks_DNUM' class='form-control'></textarea></td>";
dRow += "<td><div id=dvbutton_DNUM><input type='button' id='btnStockiest_DNUM' class='btn btn-primary autoCust' value='Show/Edit Stockiest' onclick='StockiestPopup(DNUM);'/></div>";
dRow += "</tr>";

var dRowEdit = "<tr>";
dRowEdit += "<td><input type='text' id='txtEDCust_DNUM' class='input-large form-control autoCustEdit' /><input type='hidden' id='hdnEDCust_DNUM' /></td>";
dRowEdit += "<td><input type='text' id='txtEDExp_DNUM' class='input-mini form-control docExpEdit' /></td>";
dRowEdit += "<td id='spnEDDeduction_DNUM'>0.00</td>";
dRowEdit += "<td id='spnEDApproved_DNUM'>0.00</td>";
dRowEdit += "<td><input type='text' id='txtEDPresent_DNUM' class='input-large form-control checkexpnumericEdit' /></td>";
dRowEdit += "<td><input type='text' id='txtEDPotential_DNUM' class='input-large form-control checkexpnumericEdit' /></td>";
dRowEdit += "<td><input type='text' class='form-control' id='txtEDBillNumber_DNUM'/></td>";
dRowEdit += "<td><textarea id='txtEDUserRemarks_DNUM' class='form-control'></textarea></td>";
dRowEdit += "<td><textarea id='txtEDUserRemarks_DNUM' class='form-control'></textarea></td>";
//dRowEdit += "<td><input type='button' class='btn btn-primary autoCust' value='Show Stockiest' onclick='StockiestPopup();'>";
dRowEdit += "<td></td></tr>";


//function fnCheckCustomerVailabilty(i) {
//    
//    var customerCode1 = $("#hdnDCust_" + i).val();
//    //customerCode.split('_');
//    var result = "";
//    $.ajax({
//        type: 'POST',
//        async: false,
//        data: "customerCode=" + customerCode1.split('_')[0],
//        url: '../HiDoctor_Activity/ExpenseClaim/GetCRMRequest',
//        success: function (response) {

//            if (response != "" && response != null) {
//                ret = response;
//                //fnChangeButtonValue();
//                return ret;
//            }
//        },
//        error: function (e) {
//            fnMsgAlert('info', '', 'Error.' + e.responseText);
//        }
//    });

//    if (parseInt(ret) > 0) {

//        //id='" + rowid[0] + "_" + rowid[1] + "_" + rowid[2] + "_" + prodid + "'
//        $("#dvbutton_" + i).html("<input type='button' id='btnStockiest_" + i + "' class='btn btn-primary autoCust' value='Edit Stockiest' onclick='StockiestPopup(" + i + ");'/>");
//    }
//    else {
//        $("#dvbutton_" + i).html("<input type='button' id='btnStockiest_" + i + "' class='btn btn-primary autoCust' value='Save Stockiest' onclick='StockiestPopup(" + i + ");'/>");
//    }

//}


function fnClear() {
    debugger;
    uploadFileName = [];
    retFileName = "";
    fileName = "";
    imagesize = "";
    imagelimit = "";
    rowlength = "";
    rowlength2 = "";
    $("#attachment").html('');
    $("#attachment1").html('');
}
function fnLoadData() {
    $.ajax({
        type: 'POST',
        data: "a",
        url: '../HiDoctor_Activity/ExpenseClaim/ExpenseClaimFormLoadValues',
        success: function (response) {
            var jData = response;
            lstUserDetails = jData[1].Data;
            fnBindSyncfusionGridforSearchUser();
            fnSearchExp();
            fnBindRequestAndFavouringUser()

            debugger;
        },
        error: function () {

        },
    });
}
function fnBindRequestAndFavouringUser() {
    $('#dvEdit').hide();
    $.ajax({
        type: 'POST',
        data: "a",
        url: '../HiDoctor_Activity/ExpenseClaim/ExpenseClaimFormLoadValues',
        success: function (response) {
            if (response != "" && response != null) {
                $("#ddlRequest").html("");
                $("#ddlRequest").append("<option value=''>-Select Request-</option>");
                var jData = response;
                if (jData !== undefined && jData.length > 0) {
                    // Bind Request       
                    if (jData[0].Data != undefined && jData[0].Data.length > 0) {
                        if (jData[0].Data.length == 1) {
                            $("#ddlRequest").html("");
                        }
                        for (var i = 0; i < jData[0].Data.length; i++) {
                            if (request_g == jData[0].Data[i].Request_Code) {
                                $("#ddlRequest").append("<option selected='selected' value=" + jData[0].Data[i].Request_Code + ">" + jData[0].Data[i].Request_Name + "</option>");
                            }
                            else {
                                $("#ddlRequest").append("<option value=" + jData[0].Data[i].Request_Code + ">" + jData[0].Data[i].Request_Name + "</option>");
                            }
                        }
                    }
                    if (request_g == null || request_g.length == 0) {
                        $("#ddlRequest").val("");
                    }

                    // Bind favouring user     
                    //lstUserDetails = jData[1].Data;
                    //fnBindSyncfusionGridforSearchUser();
                    if (jData[1].Data.length > 0) { // for Leaf level user hide the favouring user
                        //if (favouringuser_g == jData[1].Data[i].User_Code){}

                        debugger;
                        var lstManagerName = [];
                        if (jData[1].Data.length > 0) {
                            if (jData != null && jData != '') {
                                //var jData[1].Data = eval('(' + jData + ')');

                                for (var i = 0; i < jData[1].Data.length; i++) {
                                    _objData = {};
                                    _objData.id = jData[1].Data[i].User_Code;
                                    _objData.label = jData[1].Data[i].User_Name;
                                    lstManagerName.push(_objData);
                                }

                                regiondetails = lstManagerName;
                                var valueArr = [];
                            }
                        }

                        UserPreDropdown = new ej.dropdowns.DropDownList({

                            //set the data to dataSource property
                            dataSource: lstManagerName,

                            fields: { text: 'label', value: 'id' },
                            filterBarPlaceholder: 'Search',
                            showClearButton: true,
                            allowFiltering: true,
                            placeholder: "Select FavouringUser",
                            change: ddlRequest_onChange,
                            index: 0,
                            filtering: function (e) {
                                var dropdown_query = new ej.data.Query();
                                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                e.updateData(lstManagerName, dropdown_query);
                            }
                            //DropDownList.value = jData[1].Data[i].User_Code;

                        });
                        UserPreDropdown.appendTo('#ddlFavouringUser');

                        // atcObj.push(lstManagerName[0].id);

                        //UserPreDropdown.value = lstManagerName[0].id;



                        //if (jData[1].Data != undefined && jData[1].Data.length > 0) {

                        //    for (var i = 0; i < jData[1].Data.length; i++) {
                        //        if (favouringuser_g == jData[1].Data[i].User_Code) {


                        //            $("#ddlFavouringUser").append("<option selected='selected' value=" + jData[1].Data[i].User_Code + ">" + jData[1].Data[i].User_Name + "_" + jData[1].Data[i].Region_Name + "</option>");
                        //        }
                        //        else {
                        //            if (jData[1].Data.length == 1) {
                        //                $("#ddlFavouringUser").append("<option selected='selected' value=" + jData[1].Data[i].User_Code + ">" + jData[1].Data[i].User_Name + "_" + jData[1].Data[i].Region_Name + "</option>");
                        //                ddlRequest_onChange();
                        //                return false;
                        //            }
                        //            else {
                        //                if (CurrUserCode_g == jData[1].Data[i].User_Code) {
                        //                    $("#ddlFavouringUser").append("<option selected='selected' value=" + jData[1].Data[i].User_Code + ">" + jData[1].Data[i].User_Name + "_" + jData[1].Data[i].Region_Name + "</option>");
                        //                }
                        //                else {
                        //                    $("#ddlFavouringUser").append("<option value=" + jData[1].Data[i].User_Code + ">" + jData[1].Data[i].User_Name + "_" + jData[1].Data[i].Region_Name + "</option>");
                        //                }
                        //            }
                        //        }
                        //    }
                        //}


                        if ($("#ddlRequest").val() == "") {
                            $("#ddlFavouringUser").val("-1");
                        }
                        if ($('select[name="ddlFavouringUser"]').val() != -1) {
                            if ((favouringuser_g == null || favouringuser_g.length == 0)) {
                                //$("#ddlFavouringUser").val("");
                                ddlRequest_onChange();
                            }
                            else {
                                ddlRequest_onChange();
                            }
                        }
                    }
                        //if (jData[1].Data.length > 0) { // for Leaf level user hide the favouring user
                        //    if (jData[1].Data != undefined && jData[1].Data.length > 0) {
                        //        for (var i = 0; i < jData[1].Data.length; i++) {
                        //            if (favouringuser_g == jData[1].Data[i].User_Code) {
                        //                $("#ddlFavouringUser").append("<option selected='selected' value=" + jData[1].Data[i].User_Code + ">" + jData[1].Data[i].User_Name + "_" + jData[1].Data[i].Region_Name + "</option>");
                        //            }
                        //            else {
                        //                $("#ddlFavouringUser").append("<option value=" + jData[1].Data[i].User_Code + ">" + jData[1].Data[i].User_Name + "_" + jData[1].Data[i].Region_Name + "</option>");
                        //            }
                        //        }
                        //    }
                        //    if (favouringuser_g == null || favouringuser_g.length == 0) {
                        //        $("#ddlFavouringUser").val("");
                        //        ddlRequest_onChange();
                        //    }
                        //    else {
                        //        ddlRequest_onChange();
                        //    }
                        //}
                    else {
                        $("#dvFavouringUser").css('display', 'none');
                    }

                }
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
        }
    });
}
function fnBindSyncfusionGridforSearchUser() {
    debugger;
    var lstUsers = [];
    if (lstUserDetails.length > 0) {
        $('#dvSearchUserName').html('');
        $('#dvSearchUserName').html('<input class="" type="text" id="UserSrch">');
        for (var i = 0; i < lstUserDetails.length; i++) {
            var Obj = {
                label: lstUserDetails[i].User_Name,// + '_' + lstUserDetails[i].Region_Name,
                id: lstUserDetails[i].User_Code
            };
            lstUsers.push(Obj);
        }

    }
    Userdropdown = new ej.dropdowns.DropDownList({
        //set the data to dataSource property
        dataSource: lstUsers,
        fields: { text: 'label', value: 'id' },
        filterBarPlaceholder: 'Search',
        showClearButton: true,
        allowFiltering: true,
        placeholder: 'Select User',
        index: 0,
        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(lstUsers, dropdown_query);
        }

    });
    Userdropdown.appendTo('#UserSrch');
}
function fnBindRequestAndFavouringUserSel(Sel_FavouringUser) {
    debugger;
    $('#dvEdit').hide();
    if (Sel_FavouringUser == "") {
        Sel_FavouringUser = $('select[name="ddlFavouringUser"]').val() == null ? "" : $('select[name="ddlFavouringUser"]').val();
        SelFavUser_g = $('select[name="ddlFavouringUser"]').val() == null ? "" : $('select[name="ddlFavouringUser"]').val();
    }
    SelFavUser_g = Sel_FavouringUser;
    $.ajax({
        type: 'POST',
        data: "Fav_UserCode=" + Sel_FavouringUser,
        async: false,
        url: '../HiDoctor_Activity/ExpenseClaim/ExpenseClaimFormLoadValuesSel',
        success: function (response) {
            if (response != "" && response != null) {
                $("#ddlRequest").html("");
                var jData = response;
                if (jData !== undefined && jData.length > 0) {
                    // Bind Request  
                    //lstUserDetails = jData;
                    //fnBindSyncfusionGridforSearchUser();
                    if (jData.length == 1) {
                        $("#ddlRequest").append("<option selected='selected'  value=" + jData[0].Request_Code + ">" + jData[0].Request_Name + "</option>");
                    }
                    else {
                        $("#ddlRequest").append("<option value=''>-Select Request-</option>");
                        for (var i = 0; i < jData.length; i++) {

                            if (request_g == jData[i].Request_Code) {
                                $("#ddlRequest").append("<option selected='selected'  value=" + jData[i].Request_Code + ">" + jData[i].Request_Name + "</option>");
                            }
                            else {
                                $("#ddlRequest").append("<option  value=" + jData[i].Request_Code + ">" + jData[i].Request_Name + "</option>");
                            }
                        }
                    }

                    if (request_g == null || request_g.length == 0) {
                        $("#ddlRequest").val("");
                    }
                    if ($("#ddlRequest").val().split('_')[1] !== undefined) {
                        ddlRequest_onChange();
                    }
                }
                else {
                    $("#ddlRequest").append("<option value=''>-Select Request-</option>");
                }
            }
            else {
                $("#ddlRequest").html("");
                $("#ddlRequest").append("<option value=''>-Select Request-</option>");
                $(".dvDCRDates").hide();
            }
            fnSearchExp();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
        }
    });
}
function fnGetFavouringUser() {
    $.ajax({
        type: "GET",
        async: false,
        url: "../HiDoctor_Activity/ExpenseClaim/GetFavouringUser",
        success: function (result) {
            if (result.length > 0) { // for Leaf level user hide the favouring user
                if (result != undefined && result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        if (favouringuser_g == result[i].User_Code) {
                            $("#ddlFavouringUser").append("<option selected='selected' value=" + result[i].User_Code + ">" + result[i].User_Name + "_" + result[i].Region_Name + "</option>");
                        }
                        else {
                            $("#ddlFavouringUser").append("<option value=" + result[i].User_Code + ">" + result[i].User_Name + "_" + result[i].Region_Name + "</option>");
                        }
                    }
                }
                if (favouringuser_g == null || favouringuser_g.length == 0) {
                    $("#ddlFavouringUser").val("");
                    ddlRequest_onChange();
                }
                else {
                    ddlRequest_onChange();
                }
            }
            else {
                $("#dvFavouringUser").css('display', 'none');
            }
        },
        error: function () {

        }
    });

}
function fnGetPrivilegeforExpense() {

    var favoringUserCode_lcl = "";
    if (favouringuser_g != "") {
        favoringUserCode_lcl = favouringuser_g;
    }
    else {
        favoringUserCode_lcl =$('select[name="ddlFavouringUser"]').val();
    }
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        data: 'favoringuserCode=' + favoringUserCode_lcl,
        url: '../HiDoctor_Activity/ExpenseClaim/GetExpenseDayandMonthwisePrivilege',
        success: function (result) {

            if (result != null && result != '') {
                $('#btnGo').hide();
                var privilegeValue = result;
                //dvDCRDates
                if (privilegeValue == "DATE") {

                    var request = $("#ddlRequest").val();
                    $('#main').load('HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest?request=' + request + "&favouringUser=" + favoringUserCode_lcl);
                    HideModalPopup("dvloading");
                }
                else {
                    HideModalPopup("dvloading");
                    //  $('#main').load('HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest');
                }
            }

        },
        error: function (e) {
            HideModalPopup("dvloading");
        }
    });

}

function fnBindExpenseClaimSummary() {
    $('#dvEdit').hide();
    $('#dvTablePrint').hide();
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        data: "a",
        url: '../HiDoctor_Activity/ExpenseClaim/GetExpenseClaimSummaryTableString',
        success: function (response) {
            if (response != "" && response != null) {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvSummaryTabSub").html(response);
                    $(".expRem").each(function () {
                        if ($(this).html().length > 30) {
                            $(this).html($(this).html().substring(0, 30) + '...');
                        }
                    })
                    //$("#lnkExcel").attr('href', response.split('$')[1]);
                    $('#dvTablePrint').show();
                    $("#userDv").show();
                    $("#ReqDv").show();
                    $("#btnSearchDv").show();
                }
                else {
                    fnMsgAlert('info', '', 'Error.' + response.split('^')[1]);
                    $("#main").unblock();
                }
            }
            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
        }
    });
}

function fnExpenseClaimSummaryHide(divid, spnid) {
    if ($('.' + divid).css("display") == "none") {
        $('.' + divid).fadeIn('slow');
        $('#' + spnid).removeClass('expandDFC');
        $('#' + spnid).addClass('collapseDFC');
    }
    else {
        $('.' + divid).fadeOut('slow');
        $('#' + spnid).removeClass('collapseDFC');
        $('#' + spnid).addClass('expandDFC');
    }
}




function ddlRequest_onChange() {

    if ($("#ddlRequest").val() != "") {
        //check statusCycle Mapping
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        var favuserCode = "";
        if (favouringuser_g != "") {
            favuserCode = favouringuser_g;
        } else {
            favuserCode = $('select[name="ddlFavouringUser"]').val();
        }
        $.ajax({
            type: 'POST',
            data: "cycleCode=" + $("#ddlRequest").val().split('_')[1] + "&userCode=" + favuserCode,
            url: '../HiDoctor_Activity/ExpenseClaim/CheckStatusCycleMapping',
            async: false,
            success: function (result) {
                if (result != "NO") {
                    $("#hdnMainStatusCode").val(result);

                    var requestCode = $("#ddlRequest").val().split('_')[0];
                    //var datafieldExp = fieldExp.split(',');

                    //for (i = 0; i < datafieldExp.length; i++) {
                    //    //alert(data[i]);
                    //    if ($("#ddlRequest :selected").text() == datafieldExp[i]) { // Field Expense 
                    //        $(".dvDCRDates").css('display', '');
                    //        $("#dvDoctorCRMButton").css('display', 'none');
                    //        $("#txtTotExpense").val("0.00");
                    //        $("#dvTotExp").css('display', '');
                    //        $("#dvDetailEntry").empty();
                    //        $("#ddlFavouringUser").val("");
                    //        $("#txtFromDate").val("");
                    //        $("#txtToDate").val("");
                    //        $("#txtRemarks").val("");
                    //    }
                    //    else if ($("#ddlRequest :selected").text() == doctorCRM) { // Doctor CRM
                    //        $(".dvDCRDates").css('display', 'none');
                    //        $("#dvDoctorCRMButton").css('display', '');
                    //        $("#txtTotExpense").val("0.00");
                    //        $("#dvTotExp").css('display', '');
                    //        $("#dvDetailEntry").empty();
                    //        $("#ddlFavouringUser").val("");
                    //        $("#txtFromDate").val("");
                    //        $("#txtToDate").val("");
                    //        $("#txtRemarks").val("");
                    //        break
                    //    }
                    //    else if ($("#ddlRequest").val() != "") { // others
                    //        $(".dvDCRDates").css('display', 'none');
                    //        $("#dvDoctorCRMButton").css('display', 'none');
                    //        $("#txtTotExpense").val("0.00");
                    //        $("#dvTotExp").css('display', 'none');
                    //        $("#dvDetailEntry").empty();
                    //        $("#ddlFavouringUser").val("");
                    //        $("#txtFromDate").val("");
                    //        $("#txtToDate").val("");
                    //        $("#txtRemarks").val("");

                    //    }

                    //    if ($("#ddlRequest :selected").text() == datafieldExp[i]) {
                    //        break;
                    //    }
                    //    else {
                    //        continue;
                    //    }

                    //}
                    var requestType = fnGetExpenseRequesttype(requestCode);

                    if (requestType.toUpperCase() == "REGION WISE") { // Field Expense 
                        $(".dvDCRDates").css('display', '');
                        $("#dvDoctorCRMButton").css('display', 'none');
                        $("#txtTotExpense").val("0.00");
                        $("#dvTotExp").css('display', '');
                        $("#dvDetailEntry").empty();
                        // $("#ddlFavouringUser").val("");
                        $("#txtFromDate").val("");
                        $("#txtToDate").val("");
                        $("#txtRemarks").val("");
                        if ($("#hdnClaimCode").val() != "") {

                            var claimCode = $("#hdnClaimCode").val();
                            var requestName = $("#ddlRequest :selected").text();
                            $("#hdnStatusCode").val(result);
                            fnEditExpenseClaim(claimCode, requestName, cycleCode_g, requestCode, "MONTHLY", "", favuserCode);
                        }
                    }
                    else if (requestType.toUpperCase() == "CUSTOMER WISE") { // Doctor CRM
                        $(".dvDCRDates").css('display', 'none');
                        $("#dvDoctorCRMButton").css('display', '');
                        $("#txtTotExpense").val("0.00");
                        $("#dvTotExp").css('display', '');
                        $("#dvDetailEntry").empty();
                        //   $("#ddlFavouringUser").val("");
                        $("#txtFromDate").val("");
                        $("#txtToDate").val("");
                        $("#txtRemarks").val("");

                    }
                    else if ($("#ddlRequest").val() != "") { // others
                        $(".dvDCRDates").css('display', 'none');
                        $("#dvDoctorCRMButton").css('display', 'none');
                        $("#dvNew").css('display', 'none');
                        $("#txtTotExpense").val("0.00");
                        $("#dvTotExp").css('display', 'none');
                        $("#dvDetailEntry").empty();
                        $("#dvNew").css('display', 'none');
                        //   $("#ddlFavouringUser").val("");
                        $("#txtFromDate").val("");
                        $("#txtToDate").val("");
                        $("#txtRemarks").val("");

                    }
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Request', 'Since, status cycle mapping is missing for ' + $("#ddlRequest :selected").text() + ' you cannot apply claim for ' + $("#ddlRequest :selected").text());
                    $(".dvDCRDates").css('display', 'none');
                    $("#dvDoctorCRMButton").css('display', 'none');
                    $("#dvNew").css('display', 'none');
                    $("#txtTotExpense").val("0.00");
                    $("#dvTotExp").css('display', '');
                    $("#dvDetailEntry").empty();
                    //  $("#ddlFavouringUser").val("");
                    $("#txtFromDate").val("");
                    $("#txtToDate").val("");
                    $("#txtRemarks").val("");
                    $("#hdnMainStatusCode").val("");
                }
                ddlFavouringUserSel_OnChange();
                $("#main").unblock();
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.responseText);
                $("#main").unblock();
            },
            complete: function () {
            }
        });
    }
    else {
        $(".dvDCRDates").css('display', 'none');
        $("#dvNew").css('display', 'none');
        $("#dvDoctorCRMButton").css('display', 'none');
        $("#txtTotExpense").val("0.00");
        $("#dvTotExp").css('display', '');
        $("#dvDetailEntry").empty();
        //  $("#ddlFavouringUser").val("");
        $("#txtFromDate").val("");
        $("#txtToDate").val("");
        $("#txtRemarks").val("");
        $("#hdnMainStatusCode").val("");
    }
}
function fnGetExpenseRequesttype(val) {
    var result = "";
    if (val != "") {
        $.ajax({
            type: 'POST',
            data: "requestCode=" + val,
            url: '../HiDoctor_Activity/ExpenseClaim/GetExpenserequestType',
            async: false,
            success: function (response) {
                //alert(data[i]);
                result = response.toUpperCase();
                return result;
                $("#attachment").html('');

            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.responseText);
                $("#main").unblock();
            }
        });
    }
    else {
        $("#attachment").html('');
    }

    return result;

}

function ddlFavouringUser_OnChange() {


    $("#dvDetailEntry").empty();
    $("#dvExpFooter").css("display", 'none');
    $("#dvNew").css('display', 'none');
    $("#txtTotExpense").val("0.00");
    $("#dvTotExpTypeWise").hide();
    var requestCode = $("#ddlRequest").val().split('_')[0];
    var requestType = fnGetExpenseRequesttype(requestCode)
    if (requestType.toUpperCase() == "REGION WISE") {
        fnGetPrivilegeforExpense();
    }
    if (SelFavUser_g != $('select[name="ddlFavouringUser"]').val() == null ? "" : $('select[name="ddlFavouringUser"]').val()) {
        //favouringuser_g = "";
        fnBindRequestAndFavouringUserSel('');
    }
    else {
        ddlRequest_onChange();
    }
}
function ddlFavouringUserSel_OnChange() {


    $("#dvDetailEntry").empty();
    $("#dvExpFooter").css("display", 'none');
    $("#dvNew").css('display', 'none');
    $("#txtTotExpense").val("0.00");
    $("#dvTotExpTypeWise").hide();
    var requestCode = $("#ddlRequest").val().split('_')[0];
    var requestType = fnGetExpenseRequesttype(requestCode)
    if (requestType.toUpperCase() == "REGION WISE") {
        fnGetPrivilegeforExpense();
    }
}

$("#txtMonth").blur(function () {
    $("#dvDetailEntry").empty();
    $("#dvNew").css('display', 'none');
    $("#dvExpFooter").css("display", 'none');
    $("#txtTotExpense").val("0.00");
    $("#dvTotExpTypeWise").hide();
});

$("#txtToDate").change(function () {
    $("#dvDetailEntry").empty();
    $("#dvNew").css('display', 'none');
    $("#txtTotExpense").val("0.00");
    $("#dvTotExpTypeWise").hide();
});

$("#advEntryTab").click(function () {
    debugger;
    fnLoadBody("HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest");
    //fnCancelExpense();
    //fnCancelExpenseEdit();
    // fngetdcrExpenseUrl(month, year, claimFavouringUser,'Entry');
});

function fnCancelExpense_redirect() {
    fnLoadBody("HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest");
}

// FIELD

function fnShowDCRExpenseDetails(nonEditMode) {
    debugger;
    $("#dvDetailEntry").empty();
    fnClear();
    var claimRequestCode = "";
    var claimFavouringUser = "";
    if (nonEditMode) {
        var dcrFrom = "", dcrTo = "";
        var claimRequestCode = $("#ddlRequest").val().split('_')[0];
        var claimFavouringUser = $('select[name="ddlFavouringUser"]').val();
        var result = false;

        if ($("#txtMonth").val() == "") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please select month.');
            return false;
        }

        claimRequestCode = $("#ddlRequest").val().split('_')[0];
        claimFavouringUser = $('select[name="ddlFavouringUser"]').val();

        if (claimRequestCode == "") {
            fnMsgAlert("info", "Expense Claim", "Please select request.");
            return false;
        }

        if (claimFavouringUser == "-1") {
            fnMsgAlert("info", "Expense Claim", "Please select Favouring user.");
            return false;
        }
    }
    else {
        claimRequestCode = $("#hdnRequest").val().split('_')[0];
        claimFavouringUser = $("#hdnFavouringUserCode").val();
    }
    var result = false;
    result = fnRequestValidation(claimRequestCode, claimFavouringUser);
    if (result) {
        var month = "";
        if (nonEditMode) {
            month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
            month = ((month <= 9) ? "0" + month : month);
            var year = $('#txtMonth').val().split('-')[1];

            var seletedDate = new Date(year + '-' + month + '-01');
            result = fnRequestValidationforMonth(claimRequestCode, claimFavouringUser, month, year);
            if (result) {
                fnShowDCRExpenseDeatilsforMonthwise(month, year, nonEditMode);
                IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                if (IsAddlExpense.toUpperCase() == 'YES') {
                    fnAddlDcrExpDetforMonthwise(month, year, nonEditMode);

                }
            }
            else {
                if ($("#ddlRequest").val() != "") {
                    ddlRequest_onChange();
                }
                result = false;
            }
            fngetdcrExpenseUrl(month, year, $('select[name="ddlFavouringUser"]').val(), 'Entry');
        }
        else {

            month = fngetMonthNumber($('#hdnDCRMonth').val().split('-')[0]);
            month = ((month <= 9) ? "0" + month : month);
            var year = $('#hdnDCRMonth').val().split('-')[1];
            fnShowDCRExpenseDeatilsforMonthwise(month, year, nonEditMode);
            IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
            if (IsAddlExpense.toUpperCase() == 'YES') {
                fnAddlDcrExpDetforMonthwise(month, year, nonEditMode);

            }
        }

        // 


    }

}



function fnShowDCRExpenseDeatilsforMonthwise(month, Year, nonEditMode) {
    var favouringUser = "";
    var IsAddlExpense = "";
    if (nonEditMode) {
        favouringUser = $('select[name="ddlFavouringUser"]').val();
    }
    else {
        favouringUser = $("#hdnFavouringUserCode").val();
    }
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "userCode=" + favouringUser + "&month=" + month + "&Year=" + Year,
        url: '../HiDoctor_Activity/ExpenseClaim/GetFieldExpenseEntryTableStringforMonthwise',
        async: false,
        success: function (response) {
            if (response != "" && response != null) {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvDetailEntry").html("");
                    $("#dvClaimDetails").html("");
                    if (nonEditMode) {
                        $("#dvDetailEntry").html(response.split('$')[0]);

                    }
                    else {
                        IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                        if (IsAddlExpense.toUpperCase() == 'YES') {
                            fnAddlAprExpRow(0);
                            $("#dvAddlUnApClaimDetails").html(response.split('$')[2]);
                            fnAddlDcrExpDetforMonthwiseEdit(month, Year, false);
                        }
                        else {
                            $("#dvAddlClaimRefPanel").hide();
                            $("#dvAddlClaimPanel").hide();
                        }
                        $("#dvClaimDetails").html(response.split('$')[0]);

                        $("#dvEditTab").css('display', '');
                        $('#dvTabs').tabs('option', 'selected', 2);
                        $("#main").unblock();

                    }
                    $("#spnfavouringUser").html($("#ddlFavouringUser :selected").text());
                    expenseTable = response.split('$')[1];

                    //$("#dvDetailEntry").html(response);

                    if (response.indexOf("No Expense Details are available for this Month") == -1) {
                        $("#dvExpFooter").css("display", "");
                        $("#dvNew").css("display", "");
                    }
                    else {
                        $("#dvExpFooter").css("display", "none");
                        $("#dvNew").css("display", "");
                    }
                    var approvedExpenseAmt = $("#hdnmonthExpense").val();
                    $('#txtTotExpense').val(approvedExpenseAmt);
                    fnCalculateTotalForFieldExpense();
                    //  var favUserName = $.trim($("#ddlFavouringUser :selected").text());
                    // $("#spnfavouringUser").html(favUserName);


                }
                else {
                    fnMsgAlert('info', '', 'Error.' + response.split('^')[1]);
                }
            }

            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
        }
    });
}

function fnAddlDcrExpDetforMonthwiseEdit(month, Year, nonEditMode) {
    debugger;
    var favouringUser = "";
    var IsAddlExpense = "";
    if (nonEditMode) {
        favouringUser = $('select[name="ddlFavouringUser"]').val();
    }
    else {
        favouringUser = $("#hdnFavouringUserCode").val();
    }
    var ExpTableContent = "";
    $.ajax({
        type: 'POST',
        data: "userCode=" + favouringUser + "&month=" + month + "&Year=" + Year,
        url: '../HiDoctor_Activity/ExpenseClaim/GetAddlDcrExpDetforMonthwise',
        async: false,
        success: function (response) {
            if (response != "" && response != null) {
                debugger;
                IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                if (IsAddlExpense.toUpperCase() == 'YES') {
                    AddlDcrDetEdit_g = response[0].lstDcrExp;
                    AddlExpDetEdit_g = response[0].lstUserExpDet;
                    var DcrUniqueFlag = [];
                    var DcrUniqueCat = [];
                    var DcrDateLst = "[";
                    for (var i = 0; i < response[0].lstDcrDateUq.length; i++) {
                        DcrDateLst += "{label:" + '"' + "" + response[0].lstDcrDateUq[i].DCR_Date + "" + '",' + "value:" + '"' + "" + response[0].lstDcrDateUq[i].DCR_Date + "" + '"' + "}";
                        if (i < response[0].lstDcrDateUq.length - 1) {
                            DcrDateLst += ",";
                        }
                    }
                    DcrDateLst += "];";
                    AutoComplete_AprDcrDate = eval(DcrDateLst);
                }
            }

            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
        },
        complete: function () {
            autoComplete(AutoComplete_AprDcrDate, "AprDcrDate", "hdnAprDcrDate", "AutoAprDcrDate");
        }
    });
}

function fnAddlDcrExpDetforMonthwise(month, Year, nonEditMode) {
    debugger;
    var favouringUser = "";
    var IsAddlExpense = "";
    if (nonEditMode) {
        favouringUser = $('select[name="ddlFavouringUser"]').val();
    }
    else {
        favouringUser = $("#hdnFavouringUserCode").val();
    }
    var ExpTableContent = "";
    $.ajax({
        type: 'POST',
        data: "userCode=" + favouringUser + "&month=" + month + "&Year=" + Year,
        url: '../HiDoctor_Activity/ExpenseClaim/GetAddlDcrExpDetforMonthwise',
        async: false,
        success: function (response) {

            if (response != "" && response != null) {
                debugger;
                AddlExpDet_g = response[0].lstDcrExp;
                AddlExpTypeDet_g = response[0].lstUserExpDet;
                AddMonthlyEx = response[0].lstDcrExpense
                if (AddMonthlyEx.length > 0 && nonEditMode == true) {
                    if (AddMonthlyEx[0].Result == 'No') {
                        ExpTableContent += "<table id='AddlExpTbl' class='table table-striped' cellspacing='0' cellpadding='0'>";
                        ExpTableContent += "<thead><tr><th>DCR Date</th><th>Flag</th><th>Category</th>";
                        ExpTableContent += "<th>Expense Type</th><th>Expense Amount</th>";
                        ExpTableContent += "<th>Reference Details</th><th>Remarks</th><th>Action</th></tr></thead><tbody>";
                        ExpTableContent += "<tr id='ExpRow_1' class='AddlExpCls'><td><input type='text' style='width: 90px;' value='' id='DcrDateTxt_1' class='form-control AutoDcrDate' onblur ='fnValidateAutofill(this," + 'AutoComplete_DcrDate' + ",\"DcrDateTxt\",\"hdnDcrDate\");fnGetDcrFlag(1);' autocomplete='off'/><input type='hidden' class='hdnDcrDateCls' id='hdnDcrDate_1'></td>";
                        ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='DcrFlagTxt_1' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + 'AutoComplete_Ovr_DcrFlag' + ",\"DcrFlagTxt\",\"hdnDcrFlag\");fnGetDcrCategory(1);' autocomplete='off' disabled/><input type='hidden' class='hdnDcrFlagCls' id='hdnDcrFlag_1'></td>";
                        ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='DcrCatTxt_1' class='form-control AutoDcrCat' onblur ='fnValidateAutofill(this," + 'AutoComplete_Dcr_Category' + ",\"DcrCatTxt\",\"hdnDcrCat\");' autocomplete='off' disabled/><input type='hidden' class='hdnDcrCatCls' id='hdnDcrCat_1'></td>";
                        ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='ExpTypeTxt_1'  class='form-control' onclick='fnGetDcrExpense(1);' autocomplete='off' disabled/><input type='hidden' class='hdnDcrExpCls' id='hdnDcrExp_1'></td>";
                        ExpTableContent += "<td><input type='text' value='' style='width: 90px;' id='ExpAmt_1' class='form-control' disabled/><input type='hidden' id='ExpMode_1' value=''/></td>";
                        ExpTableContent += "<td><input type='text' value='' style='width: 100px;' id='RefTxt_1' class='form-control'/></td>";
                        ExpTableContent += "<td><input type='text' value='' style='width: 100px;' id='RemTxt_1' class='form-control'/></td>";
                        ExpTableContent += "<td><a style='cursor:pointer;' onclick='FnCreateRow(1)'><i id='plus_1' class='fa fa-plus' style='font-size:18px;color:green;'></i></a>&nbsp;&nbsp;<a style='cursor:pointer;' onclick='FnClearRowData(1)'><i class='fa fa-remove' style='font-size:21px;color:red;'></i></a></td></tr>";
                        ExpTableContent += "</tbody></table>";
                        //$('#dvAddlUnApClaimDetails').html(ExpTableContent)
                        $("#AddlExpense").html(ExpTableContent);

                    }
                    else {
                        var t = 1;
                        ExpTableContent += "<table id='AddlExpTbl' class='table table-striped' cellspacing='0' cellpadding='0'>";
                        ExpTableContent += "<thead><tr><th>DCR Date</th><th>Flag</th><th>Category</th>";
                        ExpTableContent += "<th>Expense Type</th><th>Expense Amount</th>";
                        ExpTableContent += "<th>Reference Details</th><th>Remarks</th><th>Action</th></tr></thead><tbody>";
                        var row = (AddMonthlyEx.length) - 1
                        // var j = 1;
                        var Curr_Amt = 0;
                        for (var i = 0; i < AddMonthlyEx.length; i++) {
                            var j = i + 1;
                            var totalExpTbl = $(".clsApprExpTypeTotal").length;
                            Curr_Amt = Curr_Amt + parseInt(AddMonthlyEx[i].Eligibility_Amount);
                            ExpTableContent += "<tr id='ExpRow_" + j + "' class='AddlExpCls'><td><input type='text' style='width: 90px;' value='" + AddMonthlyEx[i].DCR_Date + "' id='DcrDateTxt_" + j + "' class='form-control AutoDcrDate' autocomplete='off' disabled/><input type='hidden' value='" + AddMonthlyEx[i].DCR_Date + "'  class='hdnDcrDateCls' id='hdnDcrDate_" + j + "'></td>";
                            ExpTableContent += "<td><input type='text' style='width: 90px;' id='DcrFlagTxt_" + j + "' value='" + AddMonthlyEx[i].Flag + "' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + 'AutoComplete_Ovr_DcrFlag' + ",\"DcrFlagTxt\",\"hdnDcrFlag\"); autocomplete='off' disabled/><input type='hidden' class='hdnDcrFlagCls' id='hdnDcrFlag_" + j + "' value='" + AddMonthlyEx[i].Flag + "'></td>";
                            ExpTableContent += "<td><input type='text' style='width: 90px;'  id='DcrCatTxt_" + j + "' value='" + AddMonthlyEx[i].Category + "' class='form-control AutoDcrCat' onblur ='fnValidateAutofill(this," + 'AutoComplete_Dcr_Category' + ",\"DcrCatTxt\",\"hdnDcrCat\");' autocomplete='off' disabled/><input type='hidden' class='hdnDcrCatCls' id='hdnDcrCat_" + j + "' value='" + AddMonthlyEx[i].Category + "'></td>";
                            ExpTableContent += "<td><input type='text' style='width: 90px;'  id='ExpTypeTxt_" + j + "'  value='" + AddMonthlyEx[i].Expense_Type_Name + "'   class='form-control' onclick='fnGetDcrExpense(" + j + ");' autocomplete='off' disabled/><input type='hidden' value='" + AddMonthlyEx[i].Expense_Type_Code + "'  class='hdnDcrExpCls' id='hdnDcrExp_" + j + "'></td>";
                            //  ExpTableContent += "<td><input type='text'  style='width: 90px;' id='ExpAmt_" + j + "' value='" + AddMonthlyEx[i].Eligibility_Amount + "' class='form-control' disabled/><input type='hidden' value='" + AddMonthlyEx[i].Eligibility_Amount + "' id='ExpMode_" + j + "' value=''/></td>";
                            ExpTableContent += "<td><input type='text'  style='width: 90px;' id='ExpAmt_" + j + "' value='" + AddMonthlyEx[i].Eligibility_Amount + "'  onblur=fnvalidateautoexpense(" + j + ",'" + AddMonthlyEx[i].Eligibility_Amount + "','" + AddMonthlyEx[i].Is_Validation_On_Eligibility + "'," + totalExpTbl + ")  class='form-control'/><input type='hidden' value='" + AddMonthlyEx[i].Eligibility_Amount + "' id='ExpMode_" + j + "' value=''/></td>"; ExpTableContent += "<td><input type='text' value='' style='width: 100px;' id='RefTxt_" + j + "' class='form-control'/></td>";
                            ExpTableContent += "<td><input type='text' value='' style='width: 100px;' id='RemTxt_" + j + "' class='form-control'/></td>";
                            ExpTableContent += "<td><a style='cursor:pointer;' onclick='FnCreateRow(" + j + ")'><i id='plus_" + j + "' class='fa fa-plus' style='font-size:18px;color:green;'></i></a></td></tr>";
                            var ExpenseContent = "";
                            debugger;
                            //ExpenseContent += "<tbody class='TotalExpenseCls'>";
                           
                            var totalExpTbl = $(".clsApprExpTypeTotal").length;
                            var isExpAvail = false;
                            for (var k = 0; k < totalExpTbl; k++) {
                                if ($("#ExpenseTypeName #TotalExpName_" + k + "").html() == AddMonthlyEx[i].Expense_Type_Name) {
                                    var totalAmt = parseFloat($("#TotalExpAmt_" + k + "").html()) + parseFloat(AddMonthlyEx[i].Eligibility_Amount);
                                    $("#ExpenseTypeName #TotalExpAmt_" + k + "").html(totalAmt);
                                    isExpAvail = true;
                                    //if (totalAmt > 0) {
                                    //    $("#ExpenseTypeNameEdit #TotalExpAmt_" + i + "").show();
                                    //    $("#ExpenseTypeNameEdit #TotalExpName_" + i + "").show();
                                    //}
                                }
                             
                            }
                            if (!isExpAvail) {
                                ExpenseContent += "<tr id='trApproveExpTypeTotal' class='clsApprExpTypeTotal'>";
                                ExpenseContent += "<td id='TotalExpName_" + (totalExpTbl+t) + "'>" + AddMonthlyEx[i].Expense_Type_Name + "</td>";
                                ExpenseContent += "<td id='TotalExpAmt_" + (totalExpTbl+t) + "'>" + AddMonthlyEx[i].Eligibility_Amount + "</td>";
                                ExpenseContent += "</tr>";//</tbody>";
                            }
                            t++;

                            $("#ExpenseTypeName #tbltotalExpenseEntry tbody").append(ExpenseContent);

                        }
                        ExpTableContent += "</tbody></table>";
                        //$('#dvAddlUnApClaimDetails').html(ExpTableContent)
                        $("#AddlExpense").html(ExpTableContent);
                        var Curr_Amt = 0;//$("#txtTotExpenseEdit").val();
                        $('#ExpenseTypeName #tbltotalExpenseEntry tbody tr').map(function () {
                            var amount = $(this).children()[1].textContent;
                            Curr_Amt = Curr_Amt + parseInt(amount);
                        })
                        $("#txtTotExpense").val(Curr_Amt);

                    }
                }
                else {
                    ExpTableContent += "<table id='AddlExpTbl' class='table table-striped' cellspacing='0' cellpadding='0'>";
                    ExpTableContent += "<thead><tr><th>DCR Date</th><th>Flag</th><th>Category</th>";
                    ExpTableContent += "<th>Expense Type</th><th>Expense Amount</th>";
                    ExpTableContent += "<th>Reference Details</th><th>Remarks</th><th>Action</th></tr></thead><tbody>";
                    ExpTableContent += "<tr id='ExpRow_1' class='AddlExpCls'><td><input type='text' style='width: 90px;' value='' id='DcrDateTxt_1' class='form-control AutoDcrDate' onblur ='fnValidateAutofill(this," + 'AutoComplete_DcrDate' + ",\"DcrDateTxt\",\"hdnDcrDate\");fnGetDcrFlag(1);' autocomplete='off'/><input type='hidden' class='hdnDcrDateCls' id='hdnDcrDate_1'></td>";
                    ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='DcrFlagTxt_1' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + 'AutoComplete_Ovr_DcrFlag' + ",\"DcrFlagTxt\",\"hdnDcrFlag\");fnGetDcrCategory(1);' autocomplete='off' disabled/><input type='hidden' class='hdnDcrFlagCls' id='hdnDcrFlag_1'></td>";
                    ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='DcrCatTxt_1' class='form-control AutoDcrCat' onblur ='fnValidateAutofill(this," + 'AutoComplete_Dcr_Category' + ",\"DcrCatTxt\",\"hdnDcrCat\");' autocomplete='off' disabled/><input type='hidden' class='hdnDcrCatCls' id='hdnDcrCat_1'></td>";
                    ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='ExpTypeTxt_1'  class='form-control' onclick='fnGetDcrExpense(1);' autocomplete='off' disabled/><input type='hidden' class='hdnDcrExpCls' id='hdnDcrExp_1'></td>";
                    ExpTableContent += "<td><input type='text' value='' style='width: 90px;' id='ExpAmt_1' class='form-control' disabled/><input type='hidden' id='ExpMode_1' value=''/></td>";
                    ExpTableContent += "<td><input type='text' value='' style='width: 100px;' id='RefTxt_1' class='form-control'/></td>";
                    ExpTableContent += "<td><input type='text' value='' style='width: 100px;' id='RemTxt_1' class='form-control'/></td>";
                    ExpTableContent += "<td><a style='cursor:pointer;' onclick='FnCreateRow(1)'><i id='plus_1' class='fa fa-plus' style='font-size:18px;color:green;'></i></a>&nbsp;&nbsp;<a style='cursor:pointer;' onclick='FnClearRowData(1)'><i class='fa fa-remove' style='font-size:21px;color:red;'></i></a></td></tr>";
                    ExpTableContent += "</tbody></table>";
                    //$('#dvAddlUnApClaimDetails').html(ExpTableContent)
                    $("#AddlExpense").html(ExpTableContent);
                }
                var DcrDateLst = "[";
                for (var i = 0; i < response[0].lstDcrDateUq.length; i++) {
                    DcrDateLst += "{label:" + '"' + "" + response[0].lstDcrDateUq[i].DCR_Date + "" + '",' + "value:" + '"' + "" + response[0].lstDcrDateUq[i].DCR_Date + "" + '"' + "}";
                    if (i < response[0].lstDcrDateUq.length - 1) {
                        DcrDateLst += ",";
                    }
                }
                DcrDateLst += "];";
                AutoComplete_DcrDate = eval(DcrDateLst);
                $("#AddlExpense").show();
            }

            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
        },
        complete: function () {
            autoComplete(AutoComplete_DcrDate, "DcrDateTxt", "hdnDcrDate", "AutoDcrDate");
        }
    });
}
function fnvalidateautoexpense(j, amount, Is_Validation,tbl_i) {
    debugger;
    var am = $('#ExpAmt_' + j).val();
    am = parseInt(am);
    amount = parseInt(amount);
    var val = true;
    if (Is_Validation == 'Y') {
        if (am > amount) {
            fnMsgAlert('info', 'Expense Additional Claim', 'Eligiblity Amount Limit Exceeded');
            $('#ExpAmt_' + j).val(amount);
            val = false;
        }
        else {
            val = true;
        }
    }
    if (val == true) {
        $('#TotalExpAmt_' + tbl_i).html(am);
        var Curr_Amt = 0;//$("#txtTotExpenseEdit").val();
        $('#ExpenseTypeName #tbltotalExpenseEntry tbody tr').map(function () {
            var amount = $(this).children()[1].textContent;
            Curr_Amt = Curr_Amt + parseInt(amount);
        })
        $("#txtTotExpense").val(Curr_Amt);
    }
    else {
        $('#TotalExpAmt_' + tbl_i).html(amount);
        var Curr_Amt = 0;//$("#txtTotExpenseEdit").val();
        $('#ExpenseTypeName #tbltotalExpenseEntry tbody tr').map(function () {
            var amount = $(this).children()[1].textContent;
            Curr_Amt = Curr_Amt + parseInt(amount);
        })
        $("#txtTotExpense").val(Curr_Amt);
    }
}
function fnSaveCRMRequest() {

}


function fnRequestValidation(claimRequestCode, claimFavouringUser) {
    debugger;
    var result = false;
    $.ajax({
        type: 'POST',
        data: "userCode=" + claimFavouringUser + "&requestCode=" + claimRequestCode,
        url: '../HiDoctor_Activity/ExpenseClaim/GetvalidClaimRequest',
        async: false,
        success: function (response) {
            if (response != "" && response != null) {
                if (response == 1) {
                    result = true;
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Request', 'Please Select correct Request .');
                    result = false;
                }
            }
            return result;

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
            return result;
        }
    });
    return result;
}


function fnSelectAllExpense() {
    if ($("input:checkbox[name=selAllExpense]:checked").length == 0) {
        $("input:checkbox[name=checkedExpense]").attr('checked', false);
        $("#txtTotExpense").val("0.00");
        $("#dvTotExpTypeWise").hide();


    }
    else if ($("input:checkbox[name=selAllExpense]:checked").length == 1) {
        $("input:checkbox[name=checkedExpense]").attr('checked', true);
        fnCalculateTotalForFieldExpense();
        $("#dvTotExpTypeWise").show();
    }
}

function fnClearSelectAll() {
    if ($("input:checkbox[name=checkedExpense]:checked").length == $("input:checkbox[name=checkedExpense]").length) {
        $("input:checkbox[name=selAllExpense]").attr('checked', true);
    }
    else {
        $("input:checkbox[name=selAllExpense]").attr('checked', false);
    }

    if ($("input:checkbox[name=checkedExpense]:checked").length > 0) {
        fnCalculateTotalForFieldExpense();
    }
    else {
        $("#txtTotExpense").val("0.00");
        $("#ExpenseTypeName").html("");
        $("#dvTotExpTypeWise").hide();
    }
}
var selectedExpenseTypeName = new Array();
var uniqueExpenseTypeName = new Array();
var expenceTypeCode = new Array();
function fnCalculateTotalForFieldExpense() {

    $("#dvTotExpTypeWise").show();
    $("#ExpenseTypeWiseNameLable").show();
    var totalExpense = 0.00;
    var typewiseExpense = 0.00;
    selectedExpenseTypeName = [];
    uniqueExpenseTypeName = [];
    var choosebutton = "";
    choosebutton += "<input type='file' value='ChooseFile' id='ChooseFile'  />";
    $("#uploadfile").html(choosebutton);
    GetConfitValueForSize();

    ////Length having only approved records
    //var tbllength = $('.trappr').length;
    //if (tbllength > 0) {
    //    for (var s = 1 ; s <= tbllength ; s++) {
    //        //$("input:checkbox[name=checkedExpense]:checked").each(function () {
    //        //    var rowNo = this.id.split('_')[1];
    //        totalExpense += parseFloat($("#tdExpAmount_" + s).html());
    //        expenseTypeName = $("#tdExpTypeName_" + s).html();

    //        selectedExpenseTypeName.push(expenseTypeName);
    //        //});
    //    }
    //    

    //    var expenseTypeUniqueValues = fnGetUniqueValues(selectedExpenseTypeName);
    //    uniqueExpenseTypeName.push(expenseTypeUniqueValues);
    //    var totalamount = $('#hdnmonthExpense').val();
    //    

    //    $("#txtTotExpense").val(totalamount);
    //    var tableContent = "";
    //    
    //    tableContent += "<table class='table table-striped'>";
    //    tableContent += "<tr>";
    //    tableContent += "<td style='font-weight: bold;'>Expense Type Name</td>";
    //    tableContent += "<td style='font-weight: bold;'>Amount</td>";
    //    tableContent += "</tr>";
    //    for (var i = 0; i < uniqueExpenseTypeName[0].length; i++) {
    //        
    //        typewiseExpense = 0.0;
    //        tableContent += "<tr><td style='font-weight: bold;'>" + uniqueExpenseTypeName[0][i] + " ₹" + "</td>";
    //        var expLen = $("input[Exp_Code='" + uniqueExpenseTypeName[0][i] + "']:checked").length;
    //        for (var r = 0; r < expLen; r++) {
    //            
    //            typewiseExpense += parseFloat($($("input[Exp_Code='" + uniqueExpenseTypeName[0][i] + "']:checked")[r]).val().split('_').reverse()[0]);
    //        }
    //        tableContent += "<td><span>" + typewiseExpense + "</span><td></tr>";
    //    }

    if ($("#hdnClaimCode").val() == "") {
        $("#ExpenseTypeName").html(expenseTable);
        var sno = 0;
        $('#ExpenseTypeName #tbltotalExpenseEntry tbody tr').map(function () {
            debugger;
            $(this).children()[0].id = 'TotalExpName_' + sno;
            $(this).children()[1].id = 'TotalExpAmt_' + sno;
            sno++;
        });

    }
    else {
        $("#ExpenseTypeNameEdit").html(expenseTable);
        $("#txtTotExpenseEdit").val($("#hdnmonthExpense").val());
        var sno = 0;
        $('#ExpenseTypeNameEdit #tbltotalExpenseEntry tbody tr').map(function () {
            debugger;
            $(this).children()[0].id = 'TotalExpName_' + sno;
            $(this).children()[1].id = 'TotalExpAmt_' + sno;
            sno++;
        });
    }
}

//DOCTOR CRM

function fnShowDoctorCRMEntryGrid() {

    $("#dvCRMSubmit").show();
    $("#dvDetailEntry").empty();
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    var claimCRMRequestCode = $("#ddlRequest").val().split('_')[0];
    var claimCRMFavouringUser = $('select[name="ddlFavouringUser"]').val();



    var result = false;
    result = fnRequestValidation(claimCRMRequestCode, claimCRMFavouringUser);

    if (result) {
        $.ajax({
            type: 'POST',
            data: "userCode=" + $('select[name="ddlFavouringUser"]').val(),
            url: '../HiDoctor_Activity/ExpenseClaim/GetDoctorJson',
            success: function (docJson) {

                if (docJson != null && docJson.length > 0) {
                    //Sale product autofill
                    var doc = "[";
                    for (var i = 0; i < docJson.length; i++) {
                        doc += "{label:" + '"' + "" + docJson[i].Customer_Name + "_" + docJson[i].MDL_Number + "_" + docJson[i].Speciality_Name + "_" + docJson[i].Region_Name + "" + '",' + "value:" + '"' + "" + docJson[i].Customer_Code + "_" + docJson[i].Region_Code + "" + '"' + "}";
                        if (i < docJson.length - 1) {
                            doc += ",";
                        }
                    }
                    doc += "];";
                    d_g = eval(doc);

                    $("#dvDetailEntry").html(dEntry);
                    autoComplete(d_g, "txtDCust", "hdnDCust", 'autoCust');
                    fnDocCRMEntryTableEventBinder();
                    $("#main").unblock();
                }
                else {
                    d_g = "";
                    var tblStrg = "";
                    tblStrg = "<div class='col-lg-12'>No Customer Details available for " + $("#ddlFavouringUser :selected").text() + " .</div><div style='clear: both;'></div>";
                    $("#dvDetailEntry").html(tblStrg);
                    $("#main").unblock();
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.responseText);
                $("#main").unblock();
            }
        });
    }
    else {
        $("#main").unblock();
        return false;
    }
}

function fnDocCRMEntryTableEventBinder() {
    $(".autoCust").keypress(function () { fnCreateDocCRMEntryRow(this); });
    $(".autoCust").dblclick(function () { fnCreateDocCRMEntryRow(this); });

    $(".autoCust").blur(function () { $("#" + this.id.replace(/txtDCust/g, "txtDExp")).val(""); fnCalculateTotalForDoctorCRM(); });

    $(".docExp").blur(function () {
        if ($(this).val() != "") {
            if (fnCheckBigInt(this)) {
                $(this).val(parseFloat($(this).val()).toFixed(2));
                fnCalculateTotalForDoctorCRM();
            }
        }
        else {
            fnCalculateTotalForDoctorCRM();
        }
    });

    $(".checkexpnumeric").blur(function () { if ($(this).val() != "") { return fnCheckInt(this); } });
}

function fnCreateDocCRMEntryRow(id) {
    var idNum = (id.id).split('_')[1];
    if ((parseInt(idNum) + 1) == $("#tbldocCRMEntry tr").length) {

        var rowString = dRow.replace(/DNUM/g, (parseInt(idNum) + 1));
        var row = rowString.replace("StockiestPopup();", "StockiestPopup(" + (parseInt(idNum) + 1) + ");");

        $("#tbldocCRMEntry tbody").append(row);

        autoComplete(d_g, "txtDCust", "hdnDCust", 'autoCust');
        //autoComplete(d_g, "hdnDCustName", "hdnDCust", 'autoCust1');

        fnDocCRMEntryTableEventBinder();
    }
}

function fnCalculateTotalForDoctorCRM() {

    var totalExpense = 0.00;
    for (var d = 1; d < $("#tbldocCRMEntry tr").length; d++) {
        if ($.trim($("#txtDCust_" + d).val()) != "" && $.trim($("#txtDExp_" + d).val()) != "") {
            if (fnCheckNumeric($("#txtDExp_" + d))) {
                totalExpense += parseFloat($("#txtDExp_" + d).val());
            }
        }
    }
    $("#txtTotExpense").val(totalExpense.toFixed(2));
}


// SAVE
function fnCancelExpense() {
    debugger;
    //  fnLoadBody("HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest");
    $("#ddlRequest").val("");
    $(".dvDCRDates").css('display', 'none');
    $("#dvNew").css('display', 'none');
    $("#txtTotExpense").val("0.00");
    $("#dvTotExp").css('display', '');
    $("#dvDetailEntry").empty();
    if ($("#AddlExpense").length > 0) {
        $("#AddlExpense").empty();
    }
    // $("#ddlFavouringUser").val("");
    var monthName = fnGetLastMonthName(fnMonthName());
    var year = curdate.split('.')[2]
    if (monthName == 'Dec') {
        year--;
    }
    $("#txtMonth").val(monthName + '-' + year);
    $("#txtRemarks").val("");
    $("#hdnMainStatusCode").val("");
    d_g = "";
    $("#finalAlert").css('display', 'none');
    $("#dvTotExpTypeWise").hide();
    fnClear();
}
var requestType = "";
function fnSaveExpenseClaim() {
    debugger
    //$("#submitexpense").hide();
    $("#submitexpense").attr("disabled", true);
    ShowModalPopup("dvloading");

    if (fnValidateExpenseClaimforMonth()) {
        //read detail string  
        //var dateFrom = "", dateTo = "";
        var cycleCode = $("#ddlRequest").val().split('_')[1];
        var requestCode = $("#ddlRequest").val().split('_')[0];
        var statusCode = $("#hdnMainStatusCode").val();
        var actualAmount = parseFloat($("#txtTotExpense").val()).toFixed(2);
        var favouringUser = $('select[name="ddlFavouringUser"]').val();
        var remarks = $("#txtRemarks").val();
        var expenseType = "";
        var detailString = "";

        if (requestType.toUpperCase() == "REGION WISE") {
            var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
            month = ((month <= 9) ? "0" + month : month);
            var year = $('#txtMonth').val().split('-')[1];
            var dateFrom = year + '-' + month + '-01';
            var noofdays = new Date(year, month, 0).getDate();

            var dateTo = year + '-' + month + '-' + noofdays;
            //var lastDaysinmonth = dateTo + 1;
            ////var lastdayofmonth = parseInt((fngetMonthNumber($('#txtMonth').val().split('-')[0])) + 1);
            //var dateTo = new Date(year + '-' + lastdayofmonth + '0');

            //dateFrom = dateFrom.split('/')[2] + '-' + dateFrom.split('/')[1] + '-' + dateFrom.split('/')[0];
            //dateTo = dateTo.split('/')[2] + '-' + dateTo.split('/')[1] + '-' + dateTo.split('/')[0];
            expenseType = "FIELD";
            detailString = fnReadFieldExpenseClaimTable();

            if (detailString == "") {
                fnMsgAlert('info', 'Expense Claim Request', 'Atlease one approved records need to be claim the expense.');
                HideModalPopup("dvloading");
                $('#submitexpense').attr("disabled", false);
                return false;
            }
        }

        $('#main').block({
            message: '<h3>Saving</h3>',
            css: { border: '2px solid #ddd' }
        });
        if (requestType.toUpperCase() == "REGION WISE") {
            var TotalRow = $('.AddlExpCls').length;
            var SelectedRow = $('.AddlExpCls:visible').length;
            AddlExpArr = [];
            var AddlExpObj = "";
            var j = 0;
            var IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
            if (IsAddlExpense.toUpperCase() == 'YES') {
                for (var i = 0; i < TotalRow; i++) {
                    var datesplit = "";
                    var formattedDate = "";
                    if ($('#ExpRow_' + parseInt(i + 1) + '').is(':visible')) {
                        if ($("#hdnDcrDate_" + parseInt(i + 1) + "").val() != "") {
                            j = j + 1;
                            var DcrFlagMin = "";
                            if ($("#hdnDcrFlag_" + parseInt(i + 1) + "").val() != "") {
                                if ($("#hdnDcrFlag_" + parseInt(i + 1) + "").val() == "FIELD") {
                                    DcrFlagMin = "F";
                                }
                                else if ($("#hdnDcrFlag_" + parseInt(i + 1) + "").val() == "ATTENDANCE") {
                                    DcrFlagMin = "A";
                                }
                            }
                            else {
                                fnMsgAlert('info', 'Expense Additional Claim', 'Invalid Flag in Row ' + parseInt(i + 1) + '');
                                $("#main").unblock();
                                HideModalPopup("dvloading");
                                $('#submitexpense').attr("disabled", false);
                                return false;
                            }
                            if ($("#hdnDcrDate_" + parseInt(i + 1) + "").val() != "") {
                                datesplit = $("#hdnDcrDate_" + parseInt(i + 1) + "").val();
                                //.split('/');
                                formattedDate = datesplit;// datesplit[1] + '/' + datesplit[0] + '/' + datesplit[2];
                            }
                            else {
                                fnMsgAlert('info', 'Expense Additional Claim', 'Invalid Date in Row ' + parseInt(i + 1) + '');
                                $("#main").unblock();
                                HideModalPopup("dvloading");
                                $('#submitexpense').attr("disabled", false);
                                return false;
                            }
                            if ($("#hdnDcrCat_" + parseInt(i + 1) + "").val() == "") {
                                fnMsgAlert('info', 'Expense Additional Claim', 'Invalid Category in Row ' + parseInt(i + 1) + '');
                                $("#main").unblock();
                                HideModalPopup("dvloading");
                                $('#submitexpense').attr("disabled", false);
                                return false;
                            }
                            if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == "") {
                                fnMsgAlert('info', 'Expense Additional Claim', 'Invalid Expense Type in Row ' + parseInt(i + 1) + '');
                                $("#main").unblock();
                                HideModalPopup("dvloading");
                                $('#submitexpense').attr("disabled", false);
                                return false;
                            }
                            var isRemarksMandate = "";
                            isRemarksMandate = $.grep(AddlExpTypeDet_g, function (element, index) {
                                if (element.Expense_Type_Code == $("#hdnDcrExp_" + parseInt(i + 1) + "").val() && element.Expense_Mode.toUpperCase() == 'DAILY') {
                                    return (element.Expense_Type_Code == $("#hdnDcrExp_" + parseInt(i + 1) + "").val() && element.Expense_Entity == $("#hdnDcrCat_" + parseInt(i + 1) + "").val())
                                }
                                else {
                                    return (element.Expense_Type_Code == $("#hdnDcrExp_" + parseInt(i + 1) + "").val())
                                }
                            });
                            if (isRemarksMandate.length > 0) {
                                if (isRemarksMandate[0].Mandate_Remarks.toUpperCase() == 'Y' && $("#RemTxt_" + parseInt(i + 1) + "").val() == "") {
                                    fnMsgAlert('info', 'Expense Additional Claim', 'Remarks Mandatory for Expense Type in Row ' + parseInt(i + 1) + '');
                                    $("#main").unblock();
                                    HideModalPopup("dvloading");
                                    $('#submitexpense').attr("disabled", false);
                                    return false;
                                }
                            }

                            AddlExpObj = {
                                "S_No": j,
                                "DCR_Date": formattedDate,
                                "DCR_Flag": DcrFlagMin,
                                "Dcr_Category": $("#hdnDcrCat_" + parseInt(i + 1) + "").val(),
                                "Expense_Type_Name": $("#ExpTypeTxt_" + parseInt(i + 1) + "").val(),
                                "Expense_Type_Code": $("#hdnDcrExp_" + parseInt(i + 1) + "").val(),
                                "Expense_Mode": $("#ExpMode_" + parseInt(i + 1) + "").val(),
                                "Expense_Amount": $("#ExpAmt_" + parseInt(i + 1) + "").val() == "" ? "0" : $("#ExpAmt_" + parseInt(i + 1) + "").val(),
                                "Addl_Reference_Details": $("#RefTxt_" + parseInt(i + 1) + "").val(),
                                "Addl_Expense_Remarks": $("#RemTxt_" + parseInt(i + 1) + "").val()
                            }
                            AddlExpArr.push(AddlExpObj);
                            AddlExpObj = "";
                        }
                    }
                }
            }
            $.ajax({
                type: 'POST',
                data: "cycleCode=" + cycleCode + "&requestCode=" + requestCode + "&statusCode=" + statusCode + "&actualAmount=" + actualAmount
                        + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&favouringUser=" + favouringUser + "&remarks=" + escape(remarks) +
                        "&expenseType=" + expenseType + "&detailString=" + escape(detailString) + "&screenMode=MONTHLY&AddlExpLst=" + JSON.stringify(AddlExpArr),
                url: '../HiDoctor_Activity/ExpenseClaim/InsertExpenseClaim',

                success: function (response) {
                    if (response != "0") {
                        favouringuser_g = "";
                        if (uploadFileName.length > 0) {
                            fnSaveClaimImg(response);
                        }

                        HideModalPopup("dvloading");
                        fnBindExpenseClaimSummary();
                        fnCancelExpense();
                        fnCancelExpenseEdit();
                        $("#dvExpFooter").hide();
                        $("#finalAlert").html("Expense Claim Saved successfully.Please note your Expense Claim Id for future reference (" + response + ").");
                        //   $("#submitexpense").show();
                        $('#submitexpense').attr("disabled", false);
                        $("#finalAlert").fadeIn();
                        fnClear();
                        fnBindRequestAndFavouringUserSel('');
                    }
                    else {
                        HideModalPopup("dvloading");
                        fnMsgAlert('info', 'Expense Claim Request', 'Error while saving the Expense Claim.');
                        //   $("#submitexpense").show();
                        $('#submitexpense').attr("disabled", false);
                        fnClear();
                    }
                    $("#main").unblock();
                    // $("#submitexpense").show();
                    $('#submitexpense').attr("disabled", false);
                },

                error: function (e) {
                    $("#main").unblock();
                    HideModalPopup("dvloading");
                    fnMsgAlert('info', '', 'Error.' + e.responseText);

                    // $("#submitexpense").show();
                    $('#submitexpense').attr("disabled", false);
                }
            });
        }
        else if (requestType.toUpperCase() == "CUSTOMER WISE") {
            if (expenseType == "CRM") {
                var limit = "";
                var expamount = "";
                //limit = fncreditlimit(requestCode);

                //for (var j = 1; j < $("#tbldocCRMEntry tr").length; j++) {
                //    if ($.trim($("#txtDCust_" + j).val()) != "") {
                //        expamount =+ $("#txtDExp_" + j).val();// expense amount
                //    }
                //}

                expamount = $("#txtTotExpense").val()

                if (parseFloat(expamount) > parseFloat(limit)) {
                    fnMsgAlert('info', 'Expense Claim Request', 'Your expense amount should not greater then Request Credit limit.');
                    HideModalPopup("dvloading");
                    $('#submitexpense').attr("disabled", false);
                    return false;
                }
            }


            detailString = fnReadDoctorCRMClaimTable();
            var ar = new Array();

            var a = {};
            a.name = "customerProducts_arr";
            a.value = JSON.stringify(customerStockiestArray);
            ar.push(a.value);

            $.ajax({
                type: 'POST',
                data: "cycleCode=" + cycleCode + "&requestCode=" + requestCode + "&statusCode=" + statusCode + "&actualAmount=" + actualAmount
                        + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&favouringUser=" + favouringUser + "&remarks=" + escape(remarks) +
                        "&expenseType=" + expenseType + "&detailString=" + escape(detailString) + "&screenMode=DAILY" + "&customerProducts_arr=" + ar,
                url: '../HiDoctor_Activity/ExpenseClaim/InsertCRMClaim',
                async: false,
                success: function (response) {
                    if (response != "0") {
                        fnSaveClaimImg(response);
                        $("#attachment").empty();
                        fnBindExpenseClaimSummary();
                        fnCancelExpense();
                        fnCancelExpenseEdit();
                        $("#finalAlert").html("Expense Claim Saved successfully.Please note your Expense Claim Id for future reference (" + response + ").");
                        //  $("#submitexpense").show();
                        $('#submitexpense').attr("disabled", false);
                        $("#finalAlert").fadeIn();
                    }
                    else {
                        fnMsgAlert('info', 'Expense Claim Request', 'Error while saving the Expense Claim.');
                        // $("#submitexpense").show();
                        $('#submitexpense').attr("disabled", false);
                    }
                    $("#main").unblock();
                    HideModalPopup("dvloading");
                    // $("#submitexpense").show();
                    $('#submitexpense').attr("disabled", false);
                },
                error: function (e) {
                    fnMsgAlert('info', '', 'Error.' + e.responseText);
                    $("#main").unblock();
                    //  $("#submitexpense").show();
                    $('#submitexpense').attr("disabled", false);
                }
            });
        }


        //fnSaveCRM();

    } else {
        $("#submitexpense").attr("disabled", false);
    }
}

function fnSaveClaimImg(response) {
    if (uploadFileName.length >= 1) {
        $.ajax({
            type: 'Post',
            dataType: 'json',
            url: '../HiDoctor_Activity/ExpenseClaim/SaveClaimImg',
            data: JSON.stringify({ img: uploadFileName, claimCode: response }),
            contentType: 'application/json; charset=utf-8',
            async: false,
            success: function (data) {
                uploadFileName = [];
            },
        });
    }
}

//------------------------------------------------------------------------------------------------
var maxRetries = 3;
var blockLength = 1048576;
var numberOfBlocks = 1;
var currentChunk = 1;
var retryAfterSeconds = 3;
var retFileName = "";
var fileName = "";
var imagesize = "";
var imagelimit = "";
function fnUploadImage() {
    debugger;
    var fileUpload = $("#ChooseFile").get(0);
    var files = fileUpload.files;

    $('#attachment').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $("#btupload").hide();
    var fileUpload = $("#ChooseFile").get(0);
    var files = fileUpload.files;
    if (files.length == 0) {
        fnMsgAlert('info', 'Expense Claim Request', 'Please Choose the file.');
        $("#btupload").show();
        $("#attachment").unblock();
    }
    else {
        fileName = fileUpload.files[0].name;
        var size = fileUpload.files[0].size;
        var FormateImage = getFileExtension(fileName);
        var Formate = FormateImage.toLowerCase();
        if (Formate != "jpeg" && Formate != "jpg" && Formate != "gif" && Formate != "tif" && Formate != "png" && Formate != "pdf") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please use only .jpeg, .jpg, .gif, .tif, .png, .pdf file formats.');
            var choose = "";
            choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
            $("#uploadfile").html('');
            $("#uploadfile").html(choose);
            $("#attachment").unblock();
            $("#btupload").show();
        }
        else {

            var byteval = imagesize * (1024 * 1024);
            if (byteval < size) {
                fnMsgAlert('info', 'Expense Claim Request', 'The File size should be less than ' + imagesize + " MB");
                var choose = "";
                choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
                $("#uploadfile").html('');
                $("#uploadfile").html(choose);
                $("#attachment").unblock();
                $("#btupload").show();
            }
            else {

                if (imagelimit <= uploadFileName.length) {
                    fnMsgAlert('info', 'Expense Claim Request', 'The File Upload limit is  ' + imagelimit);
                    var choose = "";
                    choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
                    $("#uploadfile").html('');
                    $("#uploadfile").html(choose);
                    $("#attachment").unblock();
                    $("#btupload").show();
                }
                else {
                    BeginFileUpload(fileName, fileUpload, 'add');
                }

            }
        }
    }
}
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
function BeginFileUpload(fileName, fileControl, source) {

    if (fileControl.files.length > 0) {
        if (fileControl.files.length > 0) {
            for (var i = 0; i < fileControl.files.length; i++) {
                UploadFile(fileControl.files[i], i, fileName, source);
            }
        }
    }
}



var UploadFile = function (file, index, fileName, source) {
    var size = file.size;
    numberOfBlocks = Math.ceil(file.size / blockLength);
    var name = fileName;
    currentChunk = 1;
    name = name.replace(/&/g, 'and');
    $.ajax({
        type: "POST",
        async: false,
        url: "../HiDoctor_Activity/ExpenseClaim/UploadAttachment",
        data: "blocksCount=" + numberOfBlocks + "&fileName=" + encodeURIComponent(name) + "&fileSize=" + size + "",
    }).done(function (retfileName) {
        if (retfileName != "") {
            retFileName = retfileName;
            if (source == 'add')
                sendFile(file, blockLength, fnSaveNoticeBoard, fnNoticeUploadFailure);
            else sendFile(file, blockLength, fnuplodImageEdit, fnNoticeUploadFailure);
            //  fnSaveNoticeBoard(retfileName);
        }
        else {
            //var message = eval('(' + state + ')');
        }
    }).fail(function () {
        alert('Error: Error while uploading attachment');
    });
}
function fnSaveNoticeBoard() {
    debugger;
    $("#attachment1").empty();
    var attachment = "";
    var choose = "";
    var MyArray = retFileName + "#" + fileName + "#0";
    retFileName = "";
    uploadFileName.push(MyArray);
    attachment += "<table class='table table-hover tblattachment'>";
    //attachment += "<thead>";
    var valdelete = "delete1"
    for (var i = 0; i < uploadFileName.length; i++) {
        attachment += "<tr><td>Attachment " + [i + 1] + ":</td><td>" + uploadFileName[i].split("#")[1] + "</td><td><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + ", 1)' /></td></tr>";
    }
    //attachment += "</thead>";
    attachment += "</table>";

    choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
    $("#attachment").html(attachment);
    $("#uploadfile").html('');
    $("#uploadfile").html(choose);
    $("#attachment").unblock();
    $("#btupload").show();
}
function fnNoticeUploadFailure() {
    alert("Upload Failed");
    $("#progressBar").css('display', 'none');
}

var sendFile = function (file, chunkSize, successCallBack, failureCallBack) {
    var start = 0,
        end = Math.min(chunkSize, file.size),
        retryCount = 0,
        sendNextChunk, fileChunk;



    sendNextChunk = function () {
        fileChunk = new FormData();

        if (file.slice) {
            fileChunk.append('Slice', file.slice(start, end));
        }
        else if (file.webkitSlice) {
            fileChunk.append('Slice', file.webkitSlice(start, end));
        }
        else if (file.mozSlice) {
            fileChunk.append('Slice', file.mozSlice(start, end));
        }
        else {
            alert(operationType.UNSUPPORTED_BROWSER);
            return;
        }
        jqxhr = $.ajax({
            async: true,
            url: ('../HiDoctor_Activity/ExpenseClaim/UploadChunk?id=' + currentChunk),
            data: fileChunk,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST'
        }).fail(function (request, error) {
            if (error !== 'abort' && retryCount < maxRetries) {
                ++retryCount;
                setTimeout(sendNextChunk, retryAfterSeconds * 1000);
            }

            if (error === 'abort') {
                alert("Aborted");
            }
            else {
                if (retryCount === maxRetries) {
                    alert("Upload timed out.");
                    resetControls();
                    uploader = null;
                }
                else {
                    alert("Resuming Upload");
                }
            }

            return;
        }).done(function (notice) {

            if (notice.error || notice.isLastBlock) {
                successCallBack();
                return;
            }

            ++currentChunk;
            start = (currentChunk - 1) * blockLength;
            end = Math.min(currentChunk * blockLength, file.size);
            retryCount = 0;
            updateProgress();
            if (currentChunk <= numberOfBlocks) {
                sendNextChunk(successCallBack, failureCallBack);
            }

        });
    }
    sendNextChunk(successCallBack, failureCallBack);
}

var displayStatusMessage = function (message) {
    //$("#statusMessage").html(message);
    //alert(message)
}

//var updateProgress = function () {
//    //$("#progressBar").css('display', '');
//    //var progress = currentChunk / numberOfBlocks * 100;
//    //if (progress <= 100) {
//    //    $("#progressBar").progressbar("option", "value", parseInt(progress));
//    //    displayStatusMessage("Uploaded " + parseInt(progress) + "%");
//    //}

//}

var updateProgress = function (progressbar) {
    if (progressbar != undefined && progressbar != null && progressbar != '') {
        $("#progressBar").css('display', 'block');
        var progress = currentChunk / numberOfBlocks * 100;
        if (progress <= 100) {
            $("#" + progressbar).simple_progressbar({ value: parseInt(progress), showValue: true });
            //$("#" + progressbar).progressbar("option", "value", parseInt(progress));
            //displayStatusMessage("Uploaded " + parseInt(progress) + "%");
        }
    }
}

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}
function fnUploadImage2() {
    debugger;
    $('#block').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $("#btupload1").hide();
    var fileUpload = $("#ChooseFile1").get(0);
    var files = fileUpload.files;
    if (files.length == 0) {
        fnMsgAlert('info', 'Expense Claim Request', 'Please Choose the file.');
        $("#btupload1").show();
        $("#block").unblock();
    }
    else {
        fileName = fileUpload.files[0].name;
        var size = fileUpload.files[0].size;
        var FormateImage = getFileExtension(fileName);
        var Formate = FormateImage.toLowerCase();
        if (Formate != "jpeg" && Formate != "jpg" && Formate != "gif" && Formate != "tif" && Formate != "png" && Formate != "pdf") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please use only .jpeg, .jpg, .gif, .tif, .png, .pdf file formats.');
            var choose = "";
            choose = "<input type='file' value='ChooseFile' id='ChooseFile1'  />";
            $("#uploadfile1").html('');
            $("#uploadfile1").html(choose);
            $("#block").unblock();
            $("#btupload1").show();
        }
        else {
            var bytevalue = imagesize * (1024 * 1024);
            if (bytevalue <= size) {
                fnMsgAlert('info', 'Expense Claim Request', 'The File size should be less than ' + imagesize + " MB");
                var choose = "";
                choose = "<input type='file' value='ChooseFile' id='ChooseFile1'  />";
                $("#uploadfile1").html('');
                $("#uploadfile1").html(choose);
                $("#block").unblock();
                $("#btupload1").show();
            }
            else {
                var table = document.getElementById("stable");
                var rows = table.getElementsByTagName("tr");
                rowlength2 = rows.length;
                if (imagelimit <= uploadFileName.length) {
                    fnMsgAlert('info', 'Expense Claim Request', 'The File Upload limit is ' + imagelimit);
                    var choose = "";
                    choose = "<input type='file' value='ChooseFile' id='ChooseFile1'  />";
                    $("#uploadfile1").html('');
                    $("#uploadfile1").html(choose);
                    $("#block").unblock();
                    $("#btupload1").show();
                }
                else {

                    BeginFileUpload(fileName, fileUpload, 'edit');
                }
            }
        }
    }
}
var rowlength2 = "";
var rowlength = "";
function fnuplodImageEdit() {
    debugger;
    var attachment = "";
    var choose = "";
    var MyArray = retFileName + "#" + fileName + "#0";
    retFileName = "";
    uploadFileName.push(MyArray);
    var table = document.getElementById("stable");
    var rows = table.getElementsByTagName("tr");
    rowlength = rows.length;

    attachment += "<table class='table table-hover'>";
    // attachment += "<thead>";
    for (var i = 0; i < uploadFileName.length; i++) {
        //var Name = uploadFileName[i].split("#")[1];
        attachment += "<tr><td>Attachment " + [i + 1] + ":</td><td>" + uploadFileName[i].split("#")[1] + "</td><td><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + ", 0 )' /></td></tr>";
     
    }
    //attachment += "</thead>";
    attachment += "</table>";
    choose = "<input type='file' value='ChooseFile' id='ChooseFile1'/>";
    $("#stable").html('');
    $("#stable").html(attachment);
    $("#uploadfile1").html('');
    $("#uploadfile1").html(choose);
    $("#block").unblock();
    $("#btupload1").show();
}
function fndeleteupload(i, delupload) {
    debugger;
    $('.attblock').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    uploadFileName.splice(i, 1);
    var button = "#delete_" + i;
    $(button).closest("tr").remove();
    fnCreateUploadTable(delupload);
}
function fnCreateUploadTable(delupload) {
    debugger;

    var attachment = "";
    attachment += "<table class='table table-hover'>";
    if (delupload == "1") {

        for (var i = 0; i < uploadFileName.length; i++) {
            attachment += "<tr><td>Attachment " + [i + 1] + ":</td><td>" + uploadFileName[i].split("#")[1] + "</td><td><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + "," + delupload + ")' /><input type='hidden' id='dcrid_" + i + "' value='" + uploadFileName[i].split("#")[2] + "'/></td></tr>";
        }
        attachment += "</table>";

        $("#attachment").html(attachment);
    }
    else {
        var d = rowlength2;
        for (var i = 0; i < uploadFileName.length; i++) {
            //var Name = uploadFileName[i].split("#")[1];
            attachment += "<tr><td>Attachment " + [i + 1] + ":</td><td>" + uploadFileName[i].split("#")[1] + "</td><td><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + "," + delupload + ")' /><input type='hidden' id='dcrid_" + i + "' value='" + uploadFileName[i].split("#")[2] + "'/></td></tr>";
            d++;
        }
        attachment += "</table>";
        $("#stable").html(attachment);
    }
    $('.attblock').unblock();
}
////Confit value///////
function GetConfitValueForSize() {
    $.ajax({
        type: 'POST',
        data: '',
        async: false,
        url: '../HiDoctor_Activity/ExpenseClaim/GetConfitValueForSize',
        success: function (jsdata) {
            debugger;
            imagesize = jsdata.split('#')[0];
            imagelimit = jsdata.split('#')[1];
        }
    });

}

function fnGetCRMCustomerAndProducts(customerCode) {

    $.ajax({
        type: 'POST',
        data: "customerCode=" + customerCode.split('_')[0],
        url: '../HiDoctor_Activity/ExpenseClaim/GetCRMCustomerAndProductDetails',
        async: false,
        success: function (jsData) {

            var jsData = CRMCustomerAndProductsJson;
            var baseCustomerName = "[";
            for (var s = 0 ; s < jsData.length ; s++) {

                baseCustomerName += "{label:" + '"' + "" + jsData[s].Customer_Code + "_" + jsData[s].Base_Code + "_" + jsData[s].Product_Name + "_" + jsData[s].Product_Code + '"' + "}";
                if (s < jsData.length - 1) {
                    baseCustomerName += ",";
                }
            }
            baseCustomerName += "];";
            CRMCustomerAndProductsJson = eval(baseCustomerName);
        }
    });
}


function fnSaveCRM() {
    detailString = fnReadDoctorCRMClaimTable();


    //var expamount = "";
    //limit = fncreditlimit(requestCode);

    //expamount = $("#txtTotExpense").val()

    //if (parseFloat(expamount) > parseFloat(limit)) {
    //    fnMsgAlert('info', 'Expense Claim Request', 'Your expense amount should not greater then Request Credit limit.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    HideModalPopup("dvloading");


    var result = "";

    if (popup == true) {


        result = fnStockiestSave();
        if (result != 'SUCCESS' && result != '' && result != undefined) {
            fnMsgAlert('info', 'Expense Claim', 'Error in CRM Request');
            customer_Name = "";
            customerCode = "";
            while (customerStockiestArray.length > 0) {
                customerStockiestArray.pop();
            }
        }
        else {
            fnMsgAlert('info', 'Saved Successfully');

        }
        HideModalPopup("dvloading");
        $('#dvAjaxLoad').hide();
    }
}

function fncreditlimit(claimRequestCode) {
    var result = false;
    $.ajax({
        type: 'POST',
        data: "requestCode=" + claimRequestCode,
        url: '../HiDoctor_Activity/ExpenseClaim/GetCreditLimit',
        async: false,
        success: function (response) {
            if (response != "" && response != null) {

                result = response;

            }
            return result;

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
            return result;
        }
    });
    return result;
}

function fnReadFieldExpenseClaimTable() {

    var detailString = "";
    var approveDCRLength = $(".cls_approve_even").length + $('.cls_approve_odd').length;
    var readAprrovedRows = 0;
    for (rowNumber = 0; readAprrovedRows < approveDCRLength; rowNumber++) {
        if ($("#trApprove_" + rowNumber).hasClass('cls_approve_even') || $("#trApprove_" + rowNumber).hasClass('cls_approve_odd')) {

            //DCR_Expense_Code,@Expense_Type_Code,@Expense_Amount,@Record_Status,@DCR_Actual_Date,@DCR_Activity_Flag,@Bill_Number
            // dcr.DCR_Expense_Code + "_" + dcr.DCR_Date + "_" + dcr.DCR_Flag + "_" + dcr.Expense_Type_Code

            var checkedVal = $("#chkExp_" + rowNumber).val();
            if (checkedVal != undefined && checkedVal != "") {
                detailString += checkedVal.split('_')[0] + '^';// dcr expense code
                detailString += checkedVal.split('_')[1] + '^';// dcrDate
                detailString += checkedVal.split('_')[2] + '^';// dcr flag
                detailString += checkedVal.split('_')[3] + '^';// expense type code
                detailString += $("#tdExpAmount_" + rowNumber).html() + '^';// expense Amount
                detailString += $("#txtBillNumber_" + rowNumber).val() + '^';// bill number
                detailString += $("#txtUserRemarks_" + rowNumber).val() + '$';   // user remarks        
            }
            readAprrovedRows++;

        }
    }
    return detailString;
}

function fnReadDoctorCRMClaimTable() {
    var detailString = "";
    //@Customer_Code,@Doctor_Region_Code,@Expense_Amount,@Present_Contribution,@Potential_Contribution,@Remarks_By_User

    for (var j = 1; j < $("#tbldocCRMEntry tr").length; j++) {
        if ($.trim($("#txtDCust_" + j).val()) != "") {
            detailString += $("#hdnDCust_" + j).val().split('_')[0] + '^';// doctor code
            detailString += $("#hdnDCust_" + j).val().split('_')[1] + '^';// doctor region code
            detailString += $("#txtDExp_" + j).val() + '^';// expense amount
            detailString += $("#txtDPresent_" + j).val() + '^';// present contribution
            detailString += $("#txtDPotential_" + j).val() + '^';// potential contribution
            detailString += $("#txtDBillNumber_" + j).val() + '^';// Bill number
            detailString += $("#txtDUserRemarks_" + j).val() + '$';// remarks by user            
        }
    }
    return detailString;
}

//--------------- EDIT-------------------------------------------------------
// EDIT
//var editRequestCode = "";
//function fnEditExpenseClaim(claimCode, requestName, cycleCode, requestCode, screenMode, requestType, statusCode) {
//    $('#dvEdit').show();
//    $('#dvSummaryTab').block({
//        message: '<h3>Processing</h3>',
//        css: { border: '2px solid #ddd' }
//    });

//    // to clear entry screen   



//    if (screenMode != "MONTHLY") {
//        var favoringUserCode = "";
//        HideModalPopup("dvloading");

//        $('#main').load('HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest?request=' + requestCode + "&favouringUser=" + favoringUserCode +
//            "&claimCode=" + claimCode + "&cycleCode=" + cycleCode + "&requestName=" + escape(requestName));
//        return false;
//    }

//    fnCancelExpense();
//    fnCancelExpenseEdit();
//    $("#hdnClaimCode").val(claimCode);
//    $("#hdnStatusCode").val(statusCode);

//    $.ajax({
//        type: "POST",
//        url: '../HiDoctor_Activity/ExpenseClaim/GetClaimDetailsForEdit',
//        data: "claimCode=" + claimCode + "&requestType=" + requestType,
//        success: function (result) {

//            if (result.split('^')[0] != 'FAIL') {
//                if (result.split('$').length > 1) {
//                    var ar = result.split('$');
//                    var claimJson = eval('(' + ar[2] + ')');

//                    fnFillDetailsInHeader(claimJson, requestName, requestType);
//                    // $('#dvClaimDetails').html(ar[0]);
//                    $("#dvClaimHistoryPopUp").html(ar[1]);
//                    fnShowDCRExpenseDetails();
//                    $("#dvSummaryTab").unblock();
//                    //   fncalculateExpensetypewiseEdit();
//                    // Initiating Doctor CRM Events
//                    if (requestType.toUpperCase() == "CRM") {
//                        if (claimJson[0].lstClaimHeader[0] != "") {
//                            var favouringUserCode = claimJson[0].lstClaimHeader[0].Favouring_User_Code;
//                            $.ajax({
//                                type: 'POST',
//                                data: "userCode=" + $("#ddlFavouringUser").val(),
//                                url: '../HiDoctor_Activity/ExpenseClaim/GetDoctorJson',
//                                success: function (docJson) {
//                                    if (docJson != null && docJson.length > 0) {
//                                        //Sale product autofill
//                                        var doc = "[";
//                                        for (var i = 0; i < docJson.length; i++) {
//                                            doc += "{label:" + '"' + "" + docJson[i].Customer_Name + "_" + docJson[i].MDL_Number + "_" + docJson[i].Speciality_Name + "_" + docJson[i].Region_Name + "" + '",' + "value:" + '"' + "" + docJson[i].Customer_Code + "_" + docJson[i].Region_Code + "" + '"' + "}";
//                                            if (i < docJson.length - 1) {
//                                                doc += ",";
//                                            }
//                                        }
//                                        doc += "];";
//                                        d_g = eval(doc);

//                                        autoComplete(d_g, "txtEDCust", "hdnEDCust", 'autoCustEdit');
//                                        fnDocCRMEditTableEventBinder();

//                                        $("#dvEditTab").css('display', '');
//                                        $('#dvTabs').tabs('option', 'selected', 2);
//                                        $("#main").unblock();
//                                    }
//                                    else {
//                                        d_g = "";
//                                    }
//                                },
//                                error: function (e) {
//                                    fnMsgAlert('info', '', 'Error.' + e.responseText);
//                                    $("#main").unblock();
//                                }
//                            });
//                        }
//                        else {
//                            fnMsgAlert('info', '', 'No Claim Details Found');
//                            $("#main").unblock();
//                        }
//                    }
//                    else {
//                        $("#dvEditTab").css('display', '');
//                        $('#dvTabs').tabs('option', 'selected', 2);
//                        $("#main").unblock();
//                    }
//                }

//            }
//            else {
//                fnMsgAlert('info', 'Error', 'Error.' + result.split('^')[1]);
//                $("#main").unblock();
//            }
//        },
//        error: function () {
//            fnMsgAlert('info', '', 'Error.' + e.responseText);
//            $("#dvEditTab").unblock();
//        },
//        complete: function () {
//            $("#dvEditTab").unblock();
//        }
//    });
//}
// claimCode, requestName, cycleCode_g, requestCode, "MONTHLY", requestType, result


function fnGetDetailsUploadImage(claimCode) {
    $.ajax({
        type: 'POST',
        data: "claimCode=" + claimCode,
        url: '../HiDoctor_Activity/ExpenseClaim/GetDetailsUploadImage',
        success: function (jsdata) {
            debugger;
            uploadFileName = [];
            var stable = "";
            Edituploadeddetails = jsdata;
            var chooseUpload = "";
            $("#attachment1").empty();
            stable += "<table class='table table-hover'>";
            // stable += "<thead>";
            for (var i = 0; i < jsdata.length; i++) {
                stable += "<tr><td>Attachment " + [i + 1] + ":</td><td>" + jsdata[i].File_Name + "</a></td><td><a href=" + jsdata[i].Image_File_Path + " target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='deleteimage_" + i + "' value=Delete onclick='fnDeleteUploadedfile(" + jsdata[i].EI_ID + "," + i + ")' /></td></tr>";
                var MyArray = jsdata[i].Image_File_Path + "#" + jsdata[i].File_Name + "#" + jsdata[i].Img_ID;
                if (uploadFileName.indexOf(MyArray) == -1) {
                    uploadFileName.push(MyArray);
                }
            }
            stable += "</table>";
            chooseUpload += "<input type='file' value='ChooseFile' id='ChooseFile1'/>";
            $("#stable").html(stable);
            $("#uploadfile1").html(chooseUpload);
            month = fngetMonthNumber($('#hdnDCRMonth').val().split('-')[0]);

            var year = $('#hdnDCRMonth').val().split('-')[1];
            fngetdcrExpenseUrl(month, year, $('select[name="UserSrch"]').val(), 'Edit')


        }
    });

}

function fnDeleteUploadedfile(ID, i) {
    debugger;
    $('.attblock').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    uploadFileName.splice(i, 1);
    fnCreateUploadTable(0);

}

function fnEditExpenseClaim(claimCode, requestName, cycleCode, requestCode, screenMode, statusCode, favoringuserCode) {
    debugger;
    uploadFileName = [];
    $('#dvEdit').show();
    $('#dvSummaryTab').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $("#attachment").html('');

    if (screenMode != "MONTHLY") {
        var favoringUserCode = "";
        HideModalPopup("dvloading");
        //favoringUserCode = $("#ddlFavouringUser").val();
        $('#main').load('HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest?request=' + requestCode + "&favouringUser=" + favoringuserCode +
            "&claimCode=" + claimCode + "&cycleCode=" + cycleCode + "&requestName=" + escape(requestName));
        return false;
    }
    else {
        // to clear entry screen   
        fnCancelExpense();
        fnCancelExpenseEdit();
        fnClear();
        $("#hdnClaimCode").val(claimCode);
        $("#hdnStatusCode").val(statusCode);

        $.ajax({
            type: 'POST',
            data: "cycleCode=" + cycleCode + "&userCode=" + favoringuserCode,// $("#ddlFavouringUser").val(),
            url: '../HiDoctor_Activity/ExpenseClaim/CheckStatusCycleMapping',
            success: function (result) {
                if (result != "NO") {
                    $("#hdnStatusCode").val(result);// status code for edit'applied'
                    $("#hdnClaimCode").val(claimCode);
                    $("#hdnRequest").val(requestName);

                    var requestType = "";
                    var result = fnGetExpenseRequesttype(requestCode)
                    editRequestCode = requestCode;
                    //   var fieldExpEdit = fieldExp.split(',');
                    //  for (i = 0; i < fieldExpEdit.length; i++) {
                    if (result.toUpperCase() == "REGION WISE") {
                        requestType = "FIELD";
                    }
                    if (result.toUpperCase() == "CUSTOMER WISE") {
                        requestType = "CRM";
                    }

                    $('#main').block({
                        message: '<h3>Processing</h3>',
                        css: { border: '2px solid #ddd' }
                    });


                    if (requestType == "CRM") {
                        fnCRMEditBind(claimCode, requestType, requestName);
                    }
                    else if (requestType == "FIELD") {
                        fnFillMonthlyCalimEditDetails(claimCode, requestType, requestName)
                    }
                    else {
                        fnMsgAlert("info", "Expense Claim Edit", "Your Request Type is changed.");
                        return false;
                    }
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Request', 'Since, status cycle mapping is missing for ' + requestName + ' you cannot apply claim for ' + requestName);
                    $("#hdnStatusCode").val('');
                }
                $("#dvSummaryTab").unblock();
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.responseText);
                $("#dvSummaryTab").unblock();
            }
        });
    }
}



function fnFillDetailsInHeader(claimJson, requestName, claimType) {

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
        }
        if (claimJson[0].lstClaimRemarks != '') {
            var tblContent = "";
            var Rem_By_Usr = "";

            tblContent += "<table id='tblRemarks'>";
            for (var i = 0; i < claimJson[0].lstClaimRemarks.length; i++) {
                if (claimJson[0].lstClaimRemarks[i].Remarks_By_User == undefined) {
                    Rem_By_Usr = "";
                }
                else
                {
                    Rem_By_Usr = claimJson[0].lstClaimRemarks[i].Remarks_By_User;
                }
                tblContent += "<tr><td><div class='col-lg-12'>";
                //tblContent += "<span class='user'></span>" + claimJson[0].lstClaimRemarks[i].User_Name + " </br> <div class='dvEnteredRemarks'>"
                //                        + claimJson[0].lstClaimRemarks[i].Remarks_By_User + "</div></div></td> </tr>";
                tblContent += "<div class='col-lg-12'><span class='user'></span>" + claimJson[0].lstClaimRemarks[i].User_Name + " </div><div class='dvEnteredRemarks col-lg-12'>"
                                                            + Rem_By_Usr + "</div></div></td> </tr>";
            }
            tblContent += "<tr><td><div class='col-lg-12'>";
            tblContent += "<div class='col-lg-12'><span class='user'></span>" + $("#spnUser").html().split('(')[0] + " | " + $("#hdnRegionName").val() + "</div> ";
            tblContent += "<div  class='col-lg-12'> <textarea id='txtAdminRemarks' class='form-group'></textarea></div></div></td> </tr>";
            tblContent += "</table>";
            $('#dvConRemarks').html(tblContent);
        }
        if (claimJson[0].lstClaimHeader != '') {
            $('#dvClaimCode').html(claimJson[0].lstClaimHeader[0].Claim_Code);
            $('#dvClaimStatus').html('<b>Status Name :' + claimJson[0].lstClaimHeader[0].Status_Name + ' </b><a onclick="fnShowHistory();" class="td-a" style="cursor:pointer;margin-left:5px;">Status History</a>');
            $("#spnItemwiseDeduction").html(claimJson[0].lstClaimHeader[0].Item_Wise_Deduction);
            $("#spnOtherDeductionAmount").html(claimJson[0].lstClaimHeader[0].Other_Deduction);
            $("#spnTotalClaimAmount").html(claimJson[0].lstClaimHeader[0].Actual_Amount);
            $('#spnTotalDeductionAmount').html(claimJson[0].lstClaimHeader[0].Total_Deduction);
            $("#spnTotalApprovedAmount").html(claimJson[0].lstClaimHeader[0].Approved_Amount);

            if (claimType.toUpperCase() == "FIELD") {

                $("#tdDcrDateTitle").show();

                $("#txtMonth").show();
                var monthName = fnMonthName(claimJson[0].lstClaimHeader[0].Date_To);
                var monthPicValue = monthName + "-" + claimJson[0].lstClaimHeader[0].Date_To.split("/")[2];
                $("#txtMonth").val(monthPicValue);
                $("#hdnDCRMonth").val(monthPicValue);
                $("#hdnFavouringUserCode").val(claimJson[0].lstClaimHeader[0].Favouring_User_Code);
                $("#hdnRequest").val(claimJson[0].lstClaimHeader[0].Request_Code + "_" + claimJson[0].lstClaimHeader[0].Cylce_Code);
                $('#tdTotalDeductionTitle').show();
                $('#tdTotalDeduction').show();
                $('#spnDcrDate').html(claimJson[0].lstClaimHeader[0].Date_From + '-' + claimJson[0].lstClaimHeader[0].Date_To);
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(claimJson[0].lstClaimHeader[0].Actual_Amount);
                $('#spnTotalDeduction').html(claimJson[0].lstClaimHeader[0].Total_Deduction);
                $('#spnApprovedAmount').html(claimJson[0].lstClaimHeader[0].Approved_Amount);
                //$('.notForOthers').css('display', '');
                $("#dvClaimDetails").show();
                $("#aExpDetails").html('Hide');
            }
            else if (claimType.toUpperCase() == "CRM") {
                $('#tdDcrDateTitle').hide();
                $('#tdDcrDate').hide();
                $('#tdTotalDeductionTitle').show();
                $('#tdTotalDeduction').show();
                $('#spnDcrDate').html(claimJson[0].lstClaimHeader[0].Date_From + '-' + claimJson[0].lstClaimHeader[0].Date_To);
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(claimJson[0].lstClaimHeader[0].Actual_Amount);
                $('#spnTotalDeduction').html(claimJson[0].lstClaimHeader[0].Total_Deduction);
                $('#spnApprovedAmount').html(claimJson[0].lstClaimHeader[0].Approved_Amount);
                // $('.notForOthers').css('display', '');
            }
            else {
                $('#tdDcrDateTitle').hide();
                $('#tdDcrDate').hide();
                $('#tdTotalDeductionTitle').hide();
                $('#tdTotalDeduction').hide();
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(claimJson[0].lstClaimHeader[0].Actual_Amount);
                //   $('.notForOthers').css('display', 'none');
            }
        }
    }
}


function fncalculateExpensetypewiseEdit() {
    $("#dvTotExpTypeWiseEdit").show();
    $("#ExpenseTypeWiseNameLableEdit").show();
    var expenseTypeNameEdit = "";
    var selectedExpenseTypeNameEdit = [];
    var uniqueExpenseTypeNameEdit = [];
    var typewiseExpenseEdit = 0.00;
    $("input:checkbox[name=checkedExpenseEdit]:checked").each(function () {
        var rowNo = this.id.split('_')[1];
        // totalExpense += parseFloat($("#tdExpAmountEdit_" + rowNo).html());
        expenseTypeNameEdit = $("#tdExpTypeNameEdit_" + rowNo).html();
        selectedExpenseTypeNameEdit.push(expenseTypeNameEdit);
    });

    var uniqueExpenseTypeName = fnGetUniqueValues(selectedExpenseTypeNameEdit);

    uniqueExpenseTypeNameEdit.push(uniqueExpenseTypeName);
    var tableContent = "";
    var choosebutton = "";
    tableContent += "<table class='table table-hover'>";
    //tableContent += "<thead>";
    tableContent += "<tr>";
    tableContent += "<td style='font-weight: bold;'>Expense Type Name</td>";
    tableContent += "<td style='font-weight: bold;'>Amount</td>";
    tableContent += "</tr>";
    //tableContent += "</thead>";
    choosebutton += "<input type='file' value='ChooseFile' id='ChooseFile'  />";
    for (var i = 0; i < uniqueExpenseTypeNameEdit[0].length; i++) {
        typewiseExpenseEdit = 0.0;
        tableContent += "<tr><td>" + uniqueExpenseTypeNameEdit[0][i] + "₹" + "</td>";
        var expLen = $("input[Exp_Code='" + uniqueExpenseTypeNameEdit[0][i] + "']:checked").length;
        for (var r = 0; r < expLen; r++) {
            typewiseExpenseEdit += parseFloat($($("input[Exp_Code='" + uniqueExpenseTypeNameEdit[0][i] + "']:checked")[r]).val().split('_').reverse()[0]);
        }
        tableContent += "<td><span>" + typewiseExpenseEdit + "</span><td></tr></br>";
    }
    GetConfitValueForSize();
    $("#ExpenseTypeNameEdit").html(tableContent);
    $("#uploadfile").html(choosebutton);
    tableContent += "</table>";

}

function fnShowHistory() {
    $("#dvHistoryPopUp").overlay().load();
}


// field expense edit
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

function fnSelectAllExpenseForEdit() {
    if ($("input:checkbox[name=selAllExpenseEdit]:checked").length == 0) {
        $("input:checkbox[name=checkedExpenseEdit]").attr('checked', false);
    }
    else if ($("input:checkbox[name=selAllExpenseEdit]:checked").length == 1) {
        $("input:checkbox[name=checkedExpenseEdit]").attr('checked', true);
    }
    fnCalculateTotalForFieldExpenseForEdit();
    fncalculateExpensetypewiseEdit();
}

function fnClearSelectAllForEdit() {
    if ($("input:checkbox[name=checkedExpenseEdit]:checked").length == $("input:checkbox[name=checkedExpenseEdit]").length) {
        $("input:checkbox[name=selAllExpenseEdit]").attr('checked', true);
    }
    else {
        $("input:checkbox[name=selAllExpenseEdit]").attr('checked', false);
    }

    fnCalculateTotalForFieldExpenseForEdit();
    fncalculateExpensetypewiseEdit();
}

function fnCalculateTotalForFieldExpenseForEdit() {
    var totalExpense = 0.00;
    var itemDeduction = 0.00;
    var otherDeduction = 0.00;
    var totalDeduction = 0.00;
    var totalApproved = 0.00;


    $("input:checkbox[name=checkedExpenseEdit]:checked").each(function () {
        var rowNo = this.id.split('_')[1];
        totalExpense += parseFloat($("#tdExpAmountEdit_" + rowNo).html());

        if ($.trim($("#spnDeduction_" + rowNo).html()) != "" && $.trim($("#spnDeduction_" + rowNo).html()) != "-") {
            itemDeduction += parseFloat($("#spnDeduction_" + rowNo).html());
        }
    });

    if ($.trim($("#spnOtherDeductionAmount").html() != "")) {
        otherDeduction = parseFloat($.trim($("#spnOtherDeductionAmount").html()));
    }

    totalDeduction = parseFloat(itemDeduction.toFixed(2)) + parseFloat(otherDeduction.toFixed(2));
    totalApproved = parseFloat(totalExpense.toFixed(2)) - parseFloat(totalDeduction.toFixed(2));

    $("#spnItemwiseDeduction").html(itemDeduction.toFixed(2));
    $("#spnOtherDeductionAmount").html(otherDeduction.toFixed(2));
    $("#spnTotalClaimAmount").html(totalExpense.toFixed(2));
    $('#spnTotalDeductionAmount').html(totalDeduction.toFixed(2));
    $("#spnTotalApprovedAmount").html(totalApproved.toFixed(2));

    $("#spnClaimAmount").html(totalExpense.toFixed(2));
    $("#spnApprovedAmount").html(totalApproved.toFixed(2));
    $("#spnTotalDeduction").html(totalDeduction.toFixed(2));
}
//


// doctor crm edit
function fnDocCRMEditTableEventBinder() {
    $(".autoCustEdit").keypress(function () { fnCreateDocCRMEditRow(this); });
    $(".autoCustEdit").dblclick(function () { fnCreateDocCRMEditRow(this); });

    $(".autoCustEdit").blur(function () { $("#" + this.id.replace(/txtEDCust/g, "txtEDExp")).val(""); $("#" + this.id.replace(/txtEDCust/g, "spnEDDeduction")).val("0.00"); });

    $(".docExpEdit").blur(function () {
        if ($(this).val() != "") {
            if (fnCheckBigInt(this)) {
                $(this).val(parseFloat($(this).val()).toFixed(2));
                fnCalculateTotalForDoctorCRMEdit();
            }
        }
        else {
            fnCalculateTotalForDoctorCRMEdit();
        }
    });

    $(".checkexpnumericEdit").blur(function () { if ($(this).val() != "") { return fnCheckInt(this); } });
}

function fnCreateDocCRMEditRow(id) {
    var idNum = (id.id).split('_')[1];
    if ((parseInt(idNum) + 1) == $("#tbldocCRMEdit tr").length) {
        var rowString = dRowEdit.replace(/DNUM/g, (parseInt(idNum) + 1));
        $("#tbldocCRMEdit tbody").append(rowString);
        autoComplete(d_g, "txtEDCust", "hdnEDCust", 'autoCustEdit');
        fnDocCRMEditTableEventBinder();
    }
}

function fnCalculateTotalForDoctorCRMEdit() {
    var totalExpense = 0.00;
    var itemDeduction = 0.00;
    var otherDeduction = 0.00;
    var totalDeduction = 0.00;
    var totalApproved = 0.00;

    for (var d = 1; d < $("#tbldocCRMEdit tr").length; d++) {
        if ($.trim($("#txtEDCust_" + d).val()) != "" && $.trim($("#txtEDExp_" + d).val()) != "") {
            if (fnCheckNumeric($("#txtEDExp_" + d))) {
                totalExpense += parseFloat($("#txtEDExp_" + d).val());
            }

            if ($.trim($("#spnEDDeduction_" + d).html()) != "" && $.trim($("#spnEDDeduction_" + d).html()) != "-") {
                itemDeduction += parseFloat($("#spnEDDeduction_" + d).html());
            }

            $("#spnEDApproved_" + d).html((parseFloat($("#txtEDExp_" + d).val()) - parseFloat($("#spnEDDeduction_" + d).html())).toFixed(2));
            spnEDApproved_2
        }
        else {
            $("#spnEDApproved_" + d).html("0.00");
        }
    }

    if ($.trim($("#spnOtherDeductionAmount").html() != "")) {
        otherDeduction = parseFloat($.trim($("#spnOtherDeductionAmount").html()));
    }

    totalDeduction = parseFloat(itemDeduction.toFixed(2)) + parseFloat(otherDeduction.toFixed(2));
    totalApproved = parseFloat(totalExpense.toFixed(2)) - parseFloat(totalDeduction.toFixed(2));

    $("#spnItemwiseDeduction").html(itemDeduction.toFixed(2));
    $("#spnOtherDeductionAmount").html(otherDeduction.toFixed(2));
    $("#spnTotalClaimAmount").html(totalExpense.toFixed(2));
    $('#spnTotalDeductionAmount').html(totalDeduction.toFixed(2));
    $("#spnTotalApprovedAmount").html(totalApproved.toFixed(2));

    $("#spnClaimAmount").html(totalExpense.toFixed(2));
    $("#spnApprovedAmount").html(totalApproved.toFixed(2));
    $("#spnTotalDeduction").html(totalDeduction.toFixed(2));
}
//


// SAVE WHILE EDIT
function fnUpdateExpenseClaim(mode) {
    flag = false;
    $("#UpdateExp").hide();
    ShowModalPopup("dvloading");
    var validateRequestCode = "";
    validateRequestCode = $("#hdnRequest").val().split('_')[0];;
    var result = fnGetExpenseRequesttype(validateRequestCode)

    if (mode.toUpperCase() == "U") {
        flag = true;
    }
    else {

        if (fnValidateExpenseClaimEdit(result)) {
            flag = true;
        }
    }



    if (flag) {
        // var validateRequestCode = "";
        //validateRequestCode = editRequestCode;
        //var result = fnGetExpenseRequesttype(validateRequestCode)
        // if (fnValidateExpenseClaimEdit(result)) {        
        //read detail string
        var claimCode = $("#hdnClaimCode").val();
        var statusCode = $("#hdnStatusCode").val();
        var actualAmount = 0.00, approvedAmount = 0.00, otherDeductions = 0.00;
        var remarks = $("#txtAdminRemarks").val();
        var expenseType = "";
        var detailString = "";
        var requestCode = "";
        var cycleCode = "";


        //var fieldExpEditre = fieldExp.split(',');
        debugger;
        //  for (i = 0; i < fieldExpEditre.length; i++) {
        if (result.toUpperCase() == "REGION WISE") {
            expenseType = "FIELD";
            actualAmount = parseFloat($("#txtTotExpenseEdit").val()).toFixed(2);
            //approvedAmount = parseFloat($("#spnTotalApprovedAmount").html()).toFixed(2);
            // otherDeductions = parseFloat($("#spnOtherDeductionAmount").html()).toFixed(2);
            cycleCode = $("#hdnRequest").val().split('_')[1];
            requestCode = $("#hdnRequest").val().split('_')[0];
            statusCode = $("#hdnStatusCode").val();

            // approvedAmount = parseFloat($("#spnTotalApprovedAmount").html()).toFixed(2);
            var favouringUser = $("#hdnFavouringUserCode").val();
            var remarks = $("#txtRemarks").val();

            detailString = fnReadFieldExpenseClaimEditTable();

            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlAprExpArr = [];
            var AddlAprExpObj = "";
            var j = 0;
            var datesplit = "";
            var formattedDate = "";
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible') && $("#AprDcrDate_" + parseInt(i + 1) + "").val() != "") {
                    j = j + 1;
                    var DcrFlagMin = "";
                    if ($("#hdnAprFlag_" + parseInt(i + 1) + "").val().toUpperCase() == "FIELD") {
                        DcrFlagMin = "F";
                    }
                    else if ($("#hdnAprFlag_" + parseInt(i + 1) + "").val().toUpperCase() == "ATTENDANCE") {
                        DcrFlagMin = "A";
                    }
                    //hdnAddlDateEdit_
                    //hdnAprDcrDate_1
                    datesplit = $("#hdnAprDcrDate_" + parseInt(i + 1) + "").val();//.split('/');
                    formattedDate = datesplit;//datesplit[1] + '/' + datesplit[0] + '/' + datesplit[2];

                    if ($("#AprDcrDate_" + parseInt(i + 1) + "").val() == "") {
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Date for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if ($("#hdnAprDcrDate_" + parseInt(i + 1) + "").val() == "") {
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select Valid Dcr Date for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if ($("#AprFlag_" + parseInt(i + 1) + "").val() == "") {
                        $("#myModal").modal('hide');
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Flag for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if ($("#hdnAprFlag_" + parseInt(i + 1) + "").val() == "") {
                        $("#myModal").modal('hide');
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Dcr Flag for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if ($("#AprCategory_" + parseInt(i + 1) + "").val() == "") {
                        $("#myModal").modal('hide');
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Category for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if ($("#hdnAprCategory_" + parseInt(i + 1) + "").val() == "") {
                        $("#myModal").modal('hide');
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Dcr Category for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if ($("#AprExpType_" + parseInt(i + 1) + "").val() == "") {
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Type for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == "") {
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Expense Type for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if ($("#AprExpAmt_" + parseInt(i + 1) + "").val() == "") {
                        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Amount for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    else if (/^[0-9]+([.][0-9]+)?$/g.test($("#AprExpAmt_" + parseInt(i + 1) + "").val()) == false) {
                        fnMsgAlert('info', 'Expense Additional Claim', 'Please enter Integer Value in Expense Amount for Row ' + parseInt(i + 1) + '');
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                    var isRemarksMandate = "";
                    isRemarksMandate = $.grep(AddlExpDetEdit_g, function (element, index) {
                        if (element.Expense_Type_Code == $("#hdnAprExpCode_" + parseInt(i + 1) + "").val() && element.Expense_Mode.toUpperCase() == 'DAILY') {
                            return (element.Expense_Type_Code == $("#hdnAprExpCode_" + parseInt(i + 1) + "").val() && element.Expense_Entity == $("#hdnAprCategory_" + parseInt(i + 1) + "").val())
                        }
                        else {
                            return (element.Expense_Type_Code == $("#hdnAprExpCode_" + parseInt(i + 1) + "").val())
                        }
                    });
                    if (isRemarksMandate.length > 0) {
                        if (isRemarksMandate[0].Mandate_Remarks.toUpperCase() == 'Y' && $("#AprRemarks_" + parseInt(i + 1) + "").val() == "") {
                            fnMsgAlert('info', 'Expense Additional Claim', 'Remarks Mandatory for Expense Type in Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                    }

                    AddlAprExpObj = {
                        "S_No": j,
                        "DCR_Date": formattedDate,
                        "DCR_Flag": DcrFlagMin,
                        "Dcr_Category": $("#hdnAprCategory_" + parseInt(i + 1) + "").val(),
                        "Expense_Type_Name": $("#AprExpType_" + parseInt(i + 1) + "").val(),
                        "Expense_Type_Code": $("#hdnAprExpCode_" + parseInt(i + 1) + "").val(),
                        "Expense_Mode": $("#ExpMode_" + parseInt(i + 1) + "").val(),
                        "Expense_Amount": $("#AprExpAmt_" + parseInt(i + 1) + "").val(),
                        "Approved_Amount": 0,
                        "Addl_Reference_Details": $("#AprDcrRef_" + parseInt(i + 1) + "").val(),
                        "Addl_Expense_Remarks": $("#AprRemarks_" + parseInt(i + 1) + "").val()
                    }
                    // $("#AprExpAmt_" + parseInt(i + 1) + "").val()
                    AddlAprExpArr.push(AddlAprExpObj);
                    AddlAprExpObj = "";
                }
            }
        }

        //if ($("#hdnRequest").val() == fieldExpEditre[i]) {
        //    break;
        //}
        //else {
        //    continue;
        //}
        //   }


        // if ($("#hdnRequest").val() == doctorCRM) {
        if (result.toUpperCase() == "CUSTOMER WISE") {
            expenseType = "CRM";
            actualAmount = parseFloat($("#spnTotalClaimAmount").html()).toFixed(2);
            approvedAmount = parseFloat($("#spnTotalApprovedAmount").html()).toFixed(2);
            otherDeductions = parseFloat($("#spnOtherDeductionAmount").html()).toFixed(2);
            detailString = fnReadDoctorCRMClaimEditTable();
        }

        HideModalPopup("dvloading");

        //var cycleCode = $("#ddlRequest").val().split('_')[1];
        //var requestCode = $("#ddlRequest").val().split('_')[0];
        //var statusCode = $("#hdnMainStatusCode").val();
        //var actualAmount = parseFloat($("#txtTotExpense").val()).toFixed(2);
        //var favouringUser = $("#ddlFavouringUser").val();
        //var remarks = $("#txtRemarks").val();
        //var expenseType = "";
        //var detailString = "";

        //if (requestType.toUpperCase() == "REGION WISE") {
        //    var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
        //    month = ((month <= 9) ? "0" + month : month);
        //    var year = $('#txtMonth').val().split('-')[1];
        //    var dateFrom = year + '-' + month + '-01';
        //    var noofdays = new Date(year, month, 0).getDate();

        //    var dateTo = year + '-' + month + '-' + noofdays;
        //    //var lastDaysinmonth = dateTo + 1;
        //    ////var lastdayofmonth = parseInt((fngetMonthNumber($('#txtMonth').val().split('-')[0])) + 1);
        //    //var dateTo = new Date(year + '-' + lastdayofmonth + '0');

        //    //dateFrom = dateFrom.split('/')[2] + '-' + dateFrom.split('/')[1] + '-' + dateFrom.split('/')[0];
        //    //dateTo = dateTo.split('/')[2] + '-' + dateTo.split('/')[1] + '-' + dateTo.split('/')[0];
        //    expenseType = "FIELD";
        //    detailString = fnReadFieldExpenseClaimTable();

        //    if (detailString == "") {
        //        fnMsgAlert('info', 'Expense Claim Request', 'Atlease one approved records need to be claim the expense.');
        //        HideModalPopup("dvloading");
        //        return false;
        //    }
        //}

        if (requestType.toUpperCase() == "CUSTOMER WISE") {
            expenseType = "CRM";
            detailString = fnReadDoctorCRMClaimTable();

        }

        if (expenseType == "CRM") {
            var limit = "";
            var expamount = "";
            limit = fncreditlimit(requestCode);
            expamount = $("#txtTotExpense").val()

            if (parseFloat(expamount) > parseFloat(limit)) {
                fnMsgAlert('info', 'Expense Claim Request', 'Your expense amount should not greater then Request Credit limit.');
                HideModalPopup("dvloading");
                return false;
            }
        }




        $('#main').block({
            message: '<h3>Saving</h3>',
            css: { border: '2px solid #ddd' }
        });


        //string claimCode, string statusCode, double actualAmount, double approvedAmount, double otherDeductions,
        //                             string remarks, string expenseType, string detailString
        $.ajax({
            type: 'POST',
            data: "claimCode=" + claimCode + "&statusCode=" + statusCode + "&actualAmount=" + actualAmount + "&approvedAmount=" + approvedAmount
                    + "&otherDeductions=" + otherDeductions + "&remarks=" + escape(remarks) + "&expenseType=" + expenseType + "&detailString=" + escape(detailString) + '&modeType=' + mode + '&AddlAprExpLst=' + JSON.stringify(AddlAprExpArr),
            url: '../HiDoctor_Activity/ExpenseClaim/UpdateExpenseClaim',
            success: function (response) {
                fnSaveClaimImg(claimCode);
                if (response != "0") {
                    fnMsgAlert('success', 'Expense Claim Request', 'Expense Claim Updated successfully');
                    fnSearchExp();
                    $('#dvTabs').tabs('option', 'selected', 1);
                    fnCancelExpenseEdit();
                    fnCancelExpense();
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Request', 'Error while updating the Expense Claim.');
                }
                $("#main").unblock();
                $("#UpdateExp").Show();
                fnClear();
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.responseText);
                $("#main").unblock();
                $("#UpdateExp").Show();
            }
        });
    }
    else {
        HideModalPopup("dvloading");
        return false;
    }
}

function fnCancelExpenseEdit() {
    $('#dvClaimDetails').html();
    $("#dvClaimHistoryPopUp").html();
    $("#dvEditTab").css('display', 'none');
    $("#hdnStatusCode").val('');
    $("#hdnClaimCode").val('');
    $("#hdnRequest").val('');
    d_g = "";
}

function fnValidateExpenseClaimEdit(val) {
    var result = val;
    // var fieldexpd = fieldExp.split(',');
    //  for (i = 0; i < fieldexpd.length; i++) {
    // if ($("#hdnRequest").val() == fieldexpd[i]) { // Validtions for field Expense Claim   
    if (result.toUpperCase() == "REGION WISE") {
        var approveDCRLength = $('.cls_approve_even').length + $('.cls_approve_odd').length;
        // var pendingDCRLength = $('.clsApplied').length + $(".clsUnapprove").length + $(".clsDraft").length + $(".clsblank").length;
        var pendingDCRLength = $("#hdnNonEnteredDays").val();
        if (pendingDCRLength == "") {
            pendingDCRLength = 0;
        }
        if (pendingDCRLength > 0) {
            var message = "This Claim has " + pendingDCRLength + " working day(s) for which DCRs are either not entered or in Draft / Applied / Unapproved status. "
            message += "These are considered as Incomplete Records. Please note that you will not be able to submit the Incomplete Records as-on-today in another Claim.\n";
            message += "If you wish to continue with Claim Submission, click OK, else click CANCEL to return to the previous screen.";

            if (!confirm(message)) {
                HideModalPopup("dvloading");
                return false;
            }

        }


        if ($.trim($("#txtMonth").val()) == "") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please select Dcr Month.');
            HideModalPopup("dvloading");
            return false;
        }

        if (approveDCRLength > 0) {

            for (rowNumber = 0; rowNumber <= approveDCRLength; rowNumber++) {
                // Bill number
                if ($.trim($("#txtBillNumber_" + rowNumber).val()) != "") {
                    if (($("#txtBillNumber_" + rowNumber).val()).length > 100) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 100 characters in Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtBillNumber_" + rowNumber).focus();
                        return false;
                    }

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtBillNumber_" + rowNumber).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtBillNumber_" + rowNumber).focus();
                        return false;
                    }
                }

                // User item wise remarks
                if ($.trim($("#txtUserRemarks_" + rowNumber).val()) != "") {
                    if (($("#txtUserRemarks_" + rowNumber).val()).length > 1000) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
                        HideModalPopup("dvloading");
                        $("#txtUserRemarks_" + rowNumber).focus();
                        return false;
                    }

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtUserRemarks_" + rowNumber).val()))) {

                        HideModalPopup("dvloading");
                        $("#txtUserRemarks_" + rowNumber).focus();
                        return false;
                    }
                }
            }
        }
        else {
            fnMsgAlert('info', 'Expense Claim Request', 'You do not have any Approved Expense to Claim.');
            HideModalPopup("dvloading");
            return false;
        }
    }

        // else if ($("#hdnRequest").val() == doctorCRM) { // Validations For Doctor CRM        
    else if (result.toUpperCase() == "CUSTOMER WISE") {

        var docCount = 0;
        var unidDoc = new Array();
        for (var j = 1; j < $("#tbldocCRMEdit tr").length; j++) {
            if ($.trim($("#txtEDCust_" + j).val()) != "") {
                docCount++;

                // Valid Customer check
                if ($.trim($("#hdnEDCust_" + j).val()) != "") {

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtEDCust_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtEDCust_" + j).focus();
                        return false;
                    }

                    var docJson = jsonPath(d_g, "$.[?(@.label=='" + $("#txtEDCust_" + j).val() + "')]");
                    if (docJson == false || docJson === undefined) {
                        fnMsgAlert('info', 'Expense Claim Request', $("#txtEDCust_" + j).val() + ' is not a valid Customer.');
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Request', $("#txtEDCust_" + j).val() + ' is not a valid Customer.');
                    HideModalPopup("dvloading");
                    return false;
                }

                // duplication of doctor check
                if ($.inArray($("#txtEDCust_" + j).val(), unidDoc) > -1) {
                    fnMsgAlert('info', 'Expense Claim Request', 'You have already entered the customer ' + $("#txtEDCust_" + j).val() + '.');
                    HideModalPopup("dvloading");
                    $("#txtEDCust_" + j).focus();
                    return false;
                }
                else {
                    unidDoc.push($("#txtEDCust_" + j).val());
                }

                // Expense Amount Validation
                if ($.trim($("#txtEDExp_" + j).val()) == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Please enter Expense Amount for ' + $("#txtEDCust_" + j).val() + '.');
                    HideModalPopup("dvloading");
                    $("#txtEDExp_" + j).focus();
                    return false;
                }
                if (parseFloat($("#txtEDExp_" + j).val()) <= 0) {
                    fnMsgAlert('info', 'Expense Claim Request', 'Expense Amount must be greater than Zero.');
                    HideModalPopup("dvloading");
                    $("#txtEDExp_" + j).focus();
                    return false;
                }


                // present , potential contribution validation
                if ($.trim($("#txtEDPresent_" + j).val()) == "") {
                    if (parseInt($("#txtEDPresent_" + j).val()) <= 0) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Present Contribution cannot be a negative value.');
                        HideModalPopup("dvloading");
                        $("#txtEDPresent_" + j).focus();
                        return false;
                    }
                }
                if ($.trim($("#txtEDPotential_" + j).val()) == "") {
                    if (parseInt($("#txtEDPresent_" + j).val()) <= 0) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Committed Contribution cannot be a negative value.');
                        HideModalPopup("dvloading");
                        $("#txtEDPotential_" + j).focus();
                        return false;
                    }
                }

                // Bill number
                if ($.trim($("#txtEDBillNumber_" + j).val()) != "") {
                    if (($("#txtEDBillNumber_" + j).val()).length > 100) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 100 characters in Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtEDBillNumber_" + j).focus();
                        return false;
                    }

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtEDBillNumber_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtEDBillNumber_" + j).focus();
                        return false;
                    }
                }

                // item wise user Remarks Validation
                if ($.trim($("#txtEDUserRemarks_" + j).val()) != "") {
                    if (($("#txtEDUserRemarks_" + j).val()).length > 1000) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
                        HideModalPopup("dvloading");
                        $("#txtEDUserRemarks_" + j).focus();
                        return false;
                    }

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtEDUserRemarks_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
            }
        }

        if (docCount == 0) {
            fnMsgAlert('info', 'Expense Claim Request', 'Please enter any one doctor.');
            HideModalPopup("dvloading");
            return false;
        }

    }

    else { // Validation for Other Claims 
        if ($.trim($("#txtAdminRemarks").val()) == "") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please enter Remarks.');
            HideModalPopup("dvloading");
            $("#txtAdminRemarks").focus();
            return false;
        }
    }


    // }

    // Main Remarks Validation
    if ($.trim($("#txtAdminRemarks").val()) != "") {
        if (($("#txtAdminRemarks").val()).length > 1000) {
            fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
            HideModalPopup("dvloading");
            $("#txtAdminRemarks").focus();
            return false;
        }

        if (!(regExforAlphaNumericSpecificRemarks($("#txtAdminRemarks").val()))) {
            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
            HideModalPopup("dvloading");
            return false;
        }
    }
    return true;
}

function fnReadFieldExpenseClaimEditTable() {
    //var detailString = "";
    //for (rowNumber = 1; rowNumber < $("#tblExpDetails tr").length; rowNumber++) {
    //    if ($("#chkExpEdit_" + rowNumber).is(':checked')) {
    //        //DCR_Expense_Code,@Expense_Type_Code,@Expense_Amount,@Record_Status,@DCR_Actual_Date,@DCR_Activity_Flag,@Bill_Number
    //        // dcr.DCR_Expense_Code + "_" + dcr.DCR_Date + "_" + dcr.DCR_Flag + "_" + dcr.Expense_Type_Code

    //        var checkedVal = $("#chkExpEdit_" + rowNumber).val();
    //        detailString += checkedVal.split('_')[0] + '^';// dcr expense code
    //        detailString += checkedVal.split('_')[1] + '^';// dcrDate
    //        detailString += checkedVal.split('_')[2] + '^';// dcr flag
    //        detailString += checkedVal.split('_')[3] + '^';// expense type code
    //        // detailString += 0 + '^';// expense type code
    //        detailString += $("#tdExpAmountEdit_" + rowNumber).html() + '^';// expense Amount
    //        detailString += $("#txtBillNumberEdit_" + rowNumber).val() + '^';// bill number
    //        detailString += $("#txtUserRemarksEdit_" + rowNumber).val() + '^';   // user remarks        
    //        //detailString += (($("#spnApproved_" + rowNumber).html() == '-') ? parseFloat($("#tdExpAmountEdit_" + rowNumber).html()).toFixed(2) : parseFloat($("#spnApproved_" + rowNumber).html()).toFixed(2)) + '$'; // Approved Amount
    //        detailString += 0 + '$';


    //    }
    //}
    //return detailString;
    var detailString = "";
    var approveDCRLength = $(".cls_approve_even").length + $('.cls_approve_odd').length;
    var readAprrovedRows = 0;
    for (rowNumber = 0; readAprrovedRows < approveDCRLength; rowNumber++) {
        if ($("#trApprove_" + rowNumber).hasClass('cls_approve_even') || $("#trApprove_" + rowNumber).hasClass('cls_approve_odd')) {

            //DCR_Expense_Code,@Expense_Type_Code,@Expense_Amount,@Record_Status,@DCR_Actual_Date,@DCR_Activity_Flag,@Bill_Number
            // dcr.DCR_Expense_Code + "_" + dcr.DCR_Date + "_" + dcr.DCR_Flag + "_" + dcr.Expense_Type_Code

            var checkedVal = $("#chkExp_" + rowNumber).val();
            if (checkedVal != undefined && checkedVal != "") {
                detailString += checkedVal.split('_')[0] + '^';// dcr expense code
                detailString += checkedVal.split('_')[1] + '^';// dcrDate
                detailString += checkedVal.split('_')[2] + '^';// dcr flag
                detailString += checkedVal.split('_')[3] + '^';// expense type code
                detailString += $("#tdExpAmount_" + rowNumber).html() + '^';// expense Amount
                detailString += $("#txtBillNumber_" + rowNumber).val() + '^';// bill number
                detailString += $("#txtUserRemarks_" + rowNumber).val() + '^';   // user remarks
                detailString += 0 + '$'; // Approved amount. In $("#tdExpAmount_" + rowNumber).html()
            }
            readAprrovedRows++;

        }
    }

    return detailString;
}

function fnReadDoctorCRMClaimEditTable() {
    var detailString = "";
    //@Customer_Code,@Doctor_Region_Code,@Expense_Amount,@Present_Contribution,@Potential_Contribution,@Remarks_By_User

    for (var j = 1; j < $("#tbldocCRMEdit tr").length; j++) {
        if ($.trim($("#txtEDCust_" + j).val()) != "") {
            detailString += $("#hdnEDCust_" + j).val().split('_')[0] + '^';// doctor code
            detailString += $("#hdnEDCust_" + j).val().split('_')[1] + '^';// doctor region code
            detailString += $("#txtEDExp_" + j).val() + '^';// expense amount
            detailString += $("#txtEDPresent_" + j).val() + '^';// present contribution
            detailString += $("#txtEDPotential_" + j).val() + '^';// potential contribution
            detailString += $("#txtEDBillNumber_" + j).val() + '^';// Bill number
            detailString += $("#txtEDUserRemarks_" + j).val() + '^';// remarks by user       
            detailString += (($("#spnEDApproved_" + j).html() == "") ? parseFloat($("#txtEDExp_" + j).val()).toFixed(2) : parseFloat($("#spnEDApproved_" + j).html()).toFixed(2)) + '$';
        }
    }
    return detailString;
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
function fnExpandAddlExpDetails() {
    if ($("#dvAddlClaimPanel").is(':visible')) {
        $("#dvAddlClaimDetails").hide();
        $("#aAddlExpDetails").html('Show');
    }
    else {
        $("#dvAddlClaimDetails").show();
        $("#aAddlExpDetails").html('Hide');
    }
}
function fnExpandAddlExpRefDetails() {
    if ($("#dvAddlClaimRefPanel").is(':visible')) {
        $("#dvAddlUnApClaimDetails").hide();
        $("#aAddlUnApExpDetails").html('Show');
    }
    else {
        $("#dvAddlUnApClaimDetails").show();
        $("#aAddlUnApExpDetails").html('Hide');
    }
}
//------------ DETAIL POP UP ---------------------
function fnExpenseClaimDetailPopUp(claimCode, requestCode, userCode) {
    var result = fnGetExpenseRequesttype(requestCode)
    // var fieldpopup = fieldExp.split(',');
    //  for (i = 0; i < fieldpopup.length; i++) {
    if (result.toUpperCase() == "REGION WISE") {
        //fnExpenseClaimDetailFieldPopUp(claimCode, requestName);
        fnOpenDeductionDetailPopUp(claimCode, userCode);
    }

    // }

    if (result.toUpperCase() == "CUSTOMER WISE") {
        fnExpenseClaimDetailDoctorCRMPopUp(claimCode, requestName);
    }
}

// FIELD EXPENSE POP UP
function fnExpenseClaimDetailFieldPopUp(claimCode, requestName) {

    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        data: "claimCode=" + claimCode,
        url: '../HiDoctor_Activity/ExpenseClaim/GetFieldExpenseClaimDetailsPopUpString',
        success: function (response) {
            if (response != "" && response != null) {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvFieldClaimPopUpDetail").html(response);
                    $("#spnPopUpTitleField").html(requestName + " details");

                    $(".expRem").each(function () {
                        if ($(this).html().length > 30) {
                            $(this).html($(this).html().substring(0, 30) + '...');
                        }
                    })
                    $("#dvFieldClaimPopUp").overlay().load();
                }
                else {
                    fnMsgAlert('info', '', 'Error.' + response.split('^')[1]);
                    $("#main").unblock();
                }
            }
            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
        }
    });

}

// DOCTOR CRM POPUP
function fnExpenseClaimDetailDoctorCRMPopUp(claimCode, requestName) {

    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        data: "claimCode=" + claimCode,
        url: '../HiDoctor_Activity/ExpenseClaim/GetDoctorCRMClaimDetailsPopUpString',
        success: function (response) {
            if (response != "" && response != null) {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvDoctorClaimPopUpDetail").html(response);
                    $("#spnPopUpTitleCRM").html(requestName + " details");

                    $(".expRem").each(function () {
                        if ($(this).html().length > 30) {
                            $(this).html($(this).html().substring(0, 30) + '...');
                        }
                    })
                    $("#dvDoctorClaimPopUp").overlay().load();
                }
                else {
                    fnMsgAlert('info', '', 'Error.' + response.split('^')[1]);
                    $("#main").unblock();
                }
            }
            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
        }
    });
}

function fnEditClear() {
    $('#dvEdit').hide();
}

function fnDeleteClaim(claimCode, requestCode, userCode) {
    if (confirm("Do You want to delete the Claim?")) {
        $.ajax({
            type: 'POST',
            data: "claimCode=" + claimCode + "&requestCode=" + claimCode + "&userCode=" + userCode,
            url: '../HiDoctor_Activity/ExpenseClaim/DeleteClaimHeader',
            success: function (result) {
                if (parseInt(result) > 0) {
                    fnMsgAlert('success', 'success', 'Claim  Deleted Successfully.');
                    fnBindExpenseClaimSummary();
                }
            },
            error: function (e) {
                fnMsgAlert('info', 'info' + e.responseText);
            }
        });
    }
}

function fnGetUniqueValues(arrayObject) {

    var arrIndex = 0;
    var uniqueValues = new Array();
    for (arrIndex = 0; arrIndex < arrayObject.length; arrIndex++) {
        if ($.inArray(arrayObject[arrIndex], uniqueValues) == -1) {
            uniqueValues.push(arrayObject[arrIndex]);
        }
    }

    return uniqueValues;
}


/////////Expense claim for Month - start//////
function fnRequestValidationforMonth(claimRequestCode, claimFavouringUser, month, year) {
    if (claimRequestCode == "") {
        fnMsgAlert("info", "Expense Claim", "Please select request.");
        return false;
    }

    if (claimFavouringUser == "-1") {
        fnMsgAlert("info", "Expense Claim", "Please select Favouring user.");
        return false;
    }

    var result = false;
    $.ajax({
        type: 'POST',
        data: "userCode=" + claimFavouringUser + "&requestCode=" + claimRequestCode + "&month=" + month + "&year=" + year,
        url: '../HiDoctor_Activity/ExpenseClaim/GetExpenseclaimcountforMonth',
        async: false,
        success: function (response) {
            if (response != "" && response != null) {

                if (response > 0) {
                    fnMsgAlert('info', 'Expense Claim Request', 'You have already submitted a Claim for the selected Month.');
                    //fnCancelExpense();
                    //fnBindRequestAndFavouringUserSel('');
                    result = false;
                }
                else {
                    // fnMsgAlert('info', 'Expense Claim Request', 'Please Select correct Request .');
                    result = true;
                }
            }
            return result;

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
            return result;
        }
    });
    return result;
}
//submit expense for month
function fnValidateExpenseClaimforMonth() {

    if ($("#ddlRequest").val() == "") {
        fnMsgAlert('info', 'Expense Claim Request', 'Please select Request.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#hdnMainStatusCode").val() == "") {
        fnMsgAlert('info', 'Expense Claim Request', 'Since, status cycle mapping is missing for ' + $("#ddlRequest :selected").text() + ' you cannot apply claim for ' + $("#ddlRequest :selected").text());
        HideModalPopup("dvloading");
        return false;
    }

    // var datafieldvalidation = fieldExp.split(',');
    // for (i = 0; i < datafieldvalidation.length; i++) {
    var requestCode = $("#ddlRequest").val().split('_')[0];
    var result = fnGetExpenseRequesttype(requestCode)
    requestType = result;
    if (result.toUpperCase() == "REGION WISE") { // Validtions for field Expense Claim
        var approveDCRLength = $('.cls_approve_even').length + $('.cls_approve_odd').length;
        //var pendingDCRLength = $('.clsApplied').length + $(".clsUnapprove").length + $(".clsDraft").length + $(".clsblank").length;
        var pendingDCRLength = $("#hdnNonEnteredDays").val();
        if (pendingDCRLength == "") {
            pendingDCRLength = 0;
        }

        if (pendingDCRLength > 0) {
            var message = "This Claim has " + pendingDCRLength + " working day(s) for which DCRs are either not entered or in Draft / Applied / Unapproved status. "
            message += "These are considered as Incomplete Records. Please note that you will not be able to submit the Incomplete Records as-on-today in another Claim.\n";
            message += "If you wish to continue with Claim Submission, click OK, else click CANCEL to return to the previous screen.";

            if (!confirm(message)) {
                HideModalPopup("dvloading");
                return false;
            }

        }


        if ($.trim($("#txtMonth").val()) == "") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please select Dcr Month.');
            HideModalPopup("dvloading");
            return false;
        }

        if (approveDCRLength > 0) {

            for (rowNumber = 0; rowNumber <= approveDCRLength; rowNumber++) {
                // Bill number
                if ($.trim($("#txtBillNumber_" + rowNumber).val()) != "") {
                    if (($("#txtBillNumber_" + rowNumber).val()).length > 100) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 100 characters in Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtBillNumber_" + rowNumber).focus();
                        return false;
                    }

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtBillNumber_" + rowNumber).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtBillNumber_" + rowNumber).focus();
                        return false;
                    }
                }

                // User item wise remarks
                if ($.trim($("#txtUserRemarks_" + rowNumber).val()) != "") {
                    if (($("#txtUserRemarks_" + rowNumber).val()).length > 1000) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
                        HideModalPopup("dvloading");
                        $("#txtUserRemarks_" + rowNumber).focus();
                        return false;
                    }

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtUserRemarks_" + rowNumber).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtUserRemarks_" + rowNumber).focus();
                        return false;
                    }
                }
            }
            if ($('#AddlExpense').is(":visible")) {
                for (rowNumber = 1; rowNumber < $("#AddlExpTbl tbody tr").length; rowNumber++) {
                    if ($.trim($("#RefTxt_" + rowNumber).val()) != "") {
                        if (($("#RefTxt_" + rowNumber).val()).length > 100) {
                            fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 100 characters in Reference Details.');
                            HideModalPopup("dvloading");
                            $("#txtBillNumber_" + rowNumber).focus();
                            return false;
                        }

                        if (!(regExforAlphaNumericSpecificRemarks($("#RefTxt_" + rowNumber).val()))) {
                            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                            HideModalPopup("dvloading");
                            $("#txtBillNumber_" + rowNumber).focus();
                            return false;
                        }
                    }

                    // User item wise remarks
                    if ($.trim($("#RemTxt_" + rowNumber).val()) != "") {
                        if (($("#RemTxt_" + rowNumber).val()).length > 1000) {
                            fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
                            HideModalPopup("dvloading");
                            $("#txtUserRemarks_" + rowNumber).focus();
                            return false;
                        }

                        if (!(regExforAlphaNumericSpecificRemarks($("#RemTxt_" + rowNumber).val()))) {
                            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
                            HideModalPopup("dvloading");
                            $("#txtUserRemarks_" + rowNumber).focus();
                            return false;
                        }
                    }
                }
            }
        }
        else {
            fnMsgAlert('info', 'Expense Claim Request', 'You do not have any Approved Expense to Claim.');
            HideModalPopup("dvloading");
            return false;
        }

    }
    else if (result.toUpperCase() == "CUSTOMER WISE") { // Validations For Doctor CRM
        if ($("#dvDetailEntry").html().length == 0) {
            fnMsgAlert('info', 'Expense Claim Request', 'Please click on Show Entry Grid.');
            HideModalPopup("dvloading");
            return false;
        }
        var docCount = 0;
        var unidDoc = new Array();
        for (var j = 1; j < $("#tbldocCRMEntry tr").length; j++) {
            if ($.trim($("#txtDCust_" + j).val()) != "") {
                docCount++;

                // Valid Customer check
                if ($.trim($("#hdnDCust_" + j).val()) != "") {

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtDCust_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtDCust_" + j).focus();
                        return false;
                    }

                    var docJson = jsonPath(d_g, "$.[?(@.label=='" + $("#txtDCust_" + j).val() + "')]");
                    if (docJson == false || docJson === undefined) {
                        fnMsgAlert('info', 'Expense Claim Request', $("#txtDCust_" + j).val() + ' is not a valid Customer.');
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Request', $("#txtDCust_" + j).val() + ' is not a valid Customer.');
                    HideModalPopup("dvloading");
                    return false;
                }

                // duplication of doctor check
                if ($.inArray($("#txtDCust_" + j).val(), unidDoc) > -1) {
                    fnMsgAlert('info', 'Expense Claim Request', 'You have already entered the customer ' + $("#txtDCust_" + j).val() + '.');
                    HideModalPopup("dvloading");
                    $("#txtDCust_" + j).focus();
                    return false;
                }
                else {
                    unidDoc.push($("#txtDCust_" + j).val());
                }

                // Expense Amount Validation
                if ($.trim($("#txtDExp_" + j).val()) == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Please enter Expense Amount for ' + $("#txtDCust_" + j).val() + '.');
                    HideModalPopup("dvloading");
                    $("#txtDExp_" + j).focus();
                    return false;
                }
                if (parseFloat($("#txtDExp_" + j).val()) <= 0) {
                    fnMsgAlert('info', 'Expense Claim Request', 'Expense Amount must be greater than Zero.');
                    HideModalPopup("dvloading");
                    $("#txtDExp_" + j).focus();
                    return false;
                }


                // present , potential contribution validation
                if ($.trim($("#txtDPresent_" + j).val()) == "") {
                    if (parseInt($("#txtDPresent_" + j).val()) <= 0) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Present Contribution cannot be a negative value.');
                        HideModalPopup("dvloading");
                        $("#txtDPresent_" + j).focus();
                        return false;
                    }
                }
                if ($.trim($("#txtDPotential_" + j).val()) == "") {
                    if (parseInt($("#txtDPresent_" + j).val()) <= 0) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Committed Contribution cannot be a negative value.');
                        HideModalPopup("dvloading");
                        $("#txtDPotential_" + j).focus();
                        return false;
                    }
                }

                // Bill number
                if ($.trim($("#txtDBillNumber_" + j).val()) != "") {
                    if (($("#txtDBillNumber_" + j).val()).length > 100) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 100 characters in Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtDBillNumber_" + j).focus();
                        return false;
                    }

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtDBillNumber_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        $("#txtDBillNumber_" + j).focus();
                        return false;
                    }
                }

                // item wise user Remarks Validation
                if ($.trim($("#txtDUserRemarks_" + j).val()) != "") {
                    if (($("#txtDUserRemarks_" + j).val()).length > 1000) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
                        HideModalPopup("dvloading");
                        $("#txtDUserRemarks_" + j).focus();
                        return false;
                    }

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtDUserRemarks_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
            }
        }

        if (docCount == 0) {
            fnMsgAlert('info', 'Expense Claim Request', 'Please enter any one doctor.');
            HideModalPopup("dvloading");
            return false;
        }

    }

    else { // Validation for Other Claims 
        if ($.trim($("#txtRemarks").val()) == "") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please enter Remarks.');
            HideModalPopup("dvloading");
            $("#txtRemarks").focus();
            return false;
        }
    }

    //if ($("#ddlRequest :selected").text() == datafieldvalidation[i]) {
    //    break;
    //}
    //else {
    //    continue;
    //}

    // }

    // Main Remarks Validation
    if ($.trim($("#txtRemarks").val()) != "") {
        if (($("#txtRemarks").val()).length > 1000) {
            fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
            HideModalPopup("dvloading");
            $("#txtRemarks").focus();
            return false;
        }

        if (!(regExforAlphaNumericSpecificRemarks($("#txtRemarks").val()))) {
            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reference Details.');
            HideModalPopup("dvloading");
            return false;
        }
    }
    return true;
}
function fnRequestValidation(claimRequestCode, claimFavouringUser) {

    if (claimRequestCode == "") {
        fnMsgAlert("info", "Expense Claim", "Please select request.");
        return false;
    }

    if (claimFavouringUser == "-1") {
        fnMsgAlert("info", "Expense Claim", "Please select Favouring user.");
        return false;
    }

    var result = false;
    $.ajax({
        type: 'POST',
        data: "userCode=" + claimFavouringUser + "&requestCode=" + claimRequestCode,
        url: '../HiDoctor_Activity/ExpenseClaim/GetvalidClaimRequest',
        async: false,
        success: function (response) {
            if (response != "" && response != null) {
                if (response == 1) {
                    result = true;
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Request', 'Please Select correct Request .');
                    result = false;
                }
            }
            return result;

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
            return result;
        }
    });
    return result;
}


function StockiestPopup(i, claimCode) {

    popup = true;
    var ret = fnCheckCustomerVailabilty(i);


    var custname = $('#txtDCust_' + i).val();
    if (custname == "") {
        fnMsgAlert('info', 'Expense Claim Request', 'Customer Name cannot be empty');
        $("#dvbutton_" + i).html("<input type='button' id='btnStockiest_" + i + "' class='btn btn-primary autoCust' value='Save/Edit Stockiest' onclick='StockiestPopup(" + i + ");'/>");
        fnStockiestClose();
        return false;
    }
    customerCode = $("#hdnDCust_" + i).val();
    var doctorCode = $("#hdnDCust_" + i).val().split('_')[0];

    if (customerStockiestArray.length > 0) {
        for (var k = 0; k < customerStockiestArray.length; k++) {
            if (customerStockiestArray[k].Customer_Code == doctorCode) {
                customerStockiestArray[k] = [];
                var arrayLength = customerStockiestArray.length - 1;
                customerStockiestArray.length = arrayLength;
            }
        }

    }


    if (claimCode != "" && claimCode != undefined) {

        fnGetEditCRMStockiestAndProducts(customerCode, i, claimCode);
    }
    else {

        content = "";

        content += "<div><h3 style='width: 99.5%;margin:0px auto'>";

        content += "<div id='dvCustomerName' style='width:99.5%;margin:3px auto;font-weight: bold;font-style: italic;font-size: 20px;'>" + custname + "</div><input type='hidden' id='hdn_DoctorCode' value='" + doctorCode + "'/>";
        for (var j = 1; j <= 2; j++) {

            content += "<div id='dvstockiest_" + j + "'><table id='tblStockiestEntry_" + j + "' cellspacing='0' cellpadding='0'>";
            content += "<tbody><tr><td style='vertical-align: middle;'><span style='margin-bottom: 61px;font-size: 13px;font-variant: normal;font-weight: bold;'>Stockiest Name</span></td><td><input type='text' style='margin: 6px;'  onkeypress='fnCreateNewRowStock(" + j + ");' id='txtStockiest_" + j + "' class='input-large form-control autoCustStock'/>";
            content += "<input type='hidden' id='hdnStockiest_" + j + "' /></td></tr></tbody>";
            content += "<div id='dvProduct'><table class='table table-striped' id='txtStockiest_" + j + "_tblProductEntry_" + j + "' cellspacing='0' cellpadding='0'>";
            content += "<thead><tr style='font-family: 'Segoe UI', 'Lucida Grande', Verdana, Arial, Helvetica, sans-serif !important;font-size: 15px;'><th>Product</th><th>Percentage</th></tr>";
            content += "</thead><tbody>";
            content += "<tr><td><input type='text' id='tblStockiestEntry_" + j + "_txtProduct_1' onkeypress='fnCreateNewRowProduct(this);' class='input-large form-control autoCustProduct'/>";
            content += "<input type='hidden' id='tblStockiestEntry_" + j + "_hdnProduct_1' /></td>";
            content += "<td><input type='text' id='tblStockiestEntry_" + j + "_txtPercentage_1' onkeypress='return isNumberKey(event);'  class='input-large form-control'/>";
            content += "<input type='hidden' id='tblStockiestEntry_" + j + "_hdnPercentage_1' /></td>";
            content += "</tr></table></table></div></div>";

            if (j == 2) {
                button += "<div id='dvstockiest_" + j + "_dvButton_1'><table><tr><td><input type='button' class='btn btn-primary autoCust' value='Save' onclick='fnStockiestProductValidate();'/></td>";
                button += "<td><input type='button' class='btn btn-primary autoCust' value='Cancel' onclick='fnStockiestClose();'></td></tr></table></div>";
            }
        }

        $("#dvStock").html(content);
        $("#dvstockiest_2").append(button);


        fnGetCRMStockiestAndProducts();
    }
    customer_Name = $("#dvCustomerName").val();
    rownum = "3";
    rowProd = "2";
    //fnCRMStockiestEventBinder();
    $("#dvStockiest").overlay().load();

}

function fnGetEditCRMStockiestAndProducts(customerCode, rowCount, claimCode) {

    customerCode = $("#hdnDCust_" + rowCount).val();
    var doctorCode = $("#hdnDCust_" + rowCount).val().split('_')[0];
    if (customerStockiestArray.length > 0) {
        for (var i = 0; i < customerStockiestArray.length; i++) {
            if (customerStockiestArray[i].Customer_Code == doctorCode) {
                customerStockiestArray[i] = [];
                var arrayLength = customerStockiestArray.length - 1;
                customerStockiestArray.length = arrayLength;
            }
        }

    }

    var favouringUserCode = $('select[name="ddlFavouringUser"]').val();
    var stockiest = "";
    var Editbutton = "";
    content = "";
    var custname = $('#txtDCust_' + rowCount).val();
    var doctorCode = $("#hdnDCust_" + rowCount).val().split('_')[0];

    $.ajax({
        type: 'POST',
        data: "customerCode=" + customerCode.split('_')[0] + "&DoctorName=" + custname + "&DocCode=" + doctorCode + "&claimCode=" + claimCode,
        url: '../HiDoctor_Activity/ExpenseClaim/GetCRMCustomerDetails',
        async: false,
        success: function (jsData) {

            content += "<div><h3 style='width: 99.5%;margin:0px auto'>";
            if (custname == "") {
                fnMsgAlert('info', 'Expense Claim Request', 'Customer Name cannot be empty');
                $("#dvbutton_" + i).html("<input type='button' id='btnStockiest_" + i + "' class='btn btn-primary autoCust' value='Show/Edit Stockiest' onclick='StockiestPopup(" + i + "" + ");'/>");
                fnStockiestClose();
                return false;
            }
            else {
                $("#dvStock").html(jsData);
                $("#dvStockiest").overlay().load();
                rownum = "3";
                rowProd = "2";
            }
        }
    });

    fnGetCRMCustomerAndProducts(customerCode);

}

function fnCreateNewRowStock(id) {

    var row = id;

    if (parseInt(rownum) == 3) {
        $("#dvstockiest_" + (parseInt(rownum) - 1) + "_dvButton_" + (parseInt(rownum) - 2)).html("");
    }
    else {
        $("#dvstockiest_" + (parseInt(rownum) - 1) + "_dvButton_" + (parseInt(rownum) - 1)).html("");
    }

    var tblContent = "";
    button = "";
    tblContent += "<div id='dvstockiest_" + rownum + "'>";
    tblContent += "<table id='tblStockiestEntry_" + rownum + "' cellspacing='0' cellpadding='0'>";
    tblContent += "<tbody><tr><td style='vertical-align: middle;'><span style='margin-bottom: 61px;font-size: 13px;font-variant: normal;'>Stockiest Name</span></td><td><input type='text' style='margin: 6px;' id='txtStockiest_" + rownum + "' onkeypress='fnCreateNewRowStock(" + rownum + ");'  class='input-large form-control autoCustStock'/><input type='hidden' id='hdnStockiest_" + rownum + "' />";
    tblContent += "</td></tr></tbody>";
    tblContent += "<table class='table table-striped' id='txtStockiest_" + rownum + "_tblProductEntry_" + rownum + "' cellspacing='0' cellpadding='0'>";
    content += "<thead><tr style='font-family: 'Segoe UI', 'Lucida Grande', Verdana, Arial, Helvetica, sans-serif !important;font-size: 15px;'><th>Product</th><th>Percentage</th></tr>";
    tblContent += "</thead><tbody>";
    tblContent += "<tr><td><input type='text' id='tblStockiestEntry_" + rownum + "_txtProduct_1'  onkeypress='fnCreateNewRowProduct(this);'  class='input-large form-control autoCustProduct'/><input type='hidden' id='tblStockiestEntry_" + parseInt(row + 1) + "_hdnProduct_1' /></td>";
    tblContent += "<td><input type='text' id='tblStockiestEntry_" + rownum + "_txtPercentage_1' onkeypress='return isNumberKey(event);' class='input-large form-control'/><input type='hidden' id='tblStockiestEntry_" + parseInt(row + 1) + "_hdnPercentage_1' />";
    tblContent += "</td></tr></table></table><div id='dvstockiest_" + rownum + "_dvButton_" + rownum + "'>";
    button += "<table><tr><td><input type='button' class='btn btn-primary autoCust' value='Save' onclick='fnStockiestProductValidate();'/></td>";
    button += "<td><input type='button' class='btn btn-primary autoCust' value='Cancel' onclick='fnStockiestClose();'></td></tr></table></div>";

    $('#dvStock').append(tblContent);
    $("#dvstockiest_" + rownum + "_dvButton_" + rownum).append(button);

    fnGetCRMStockiestAndProducts();
    rownum = parseInt(rownum) + 1;
    //fnCRMStockiestEventBinder();

}


function fnCreateNewRowProduct(id) {

    var tblContent = "";
    var rowid = id.id.split('_');

    var prodid = parseInt(rowid[3]) + 1;
    tblContent += "<tr><td><input type='text' id='" + rowid[0] + "_" + rowid[1] + "_" + rowid[2] + "_" + prodid + "' onkeypress='fnCreateNewRowProduct(this);' ondblclick='fnCreateNewRowProduct(this);' class='input-large form-control autoCustProduct'/><input type='hidden' id= '" + rowid[0] + "_" + rowid[1] + "_" + 'hdnProduct_' + prodid + "' /></td>";
    tblContent += "<td><input type='text' onkeypress='return isNumberKey(event);' id='" + rowid[0] + "_" + rowid[1] + '_txtPercentage_' + prodid + "' class='input-large form-control checkexpnumeric'/><input type='hidden' id='hdnPercentage_" + prodid + "' /></td></tr></table>";

    $("#txtStockiest_" + rowid[1] + "_tblProductEntry_" + rowid[1] + " tbody").append(tblContent);
    rowProd = parseInt(rownum) + 1;
    fnGetCRMStockiestAndProducts();
    //fnCRMStockiestEventBinder();
}

//function fnCRMStockiestEventBinder() {
//    
//    $(".autoCustStock").keypress(function () { fnCreateNewRowStock(this); });
//    $(".autoCustProduct").dblclick(function () { fnCreateDocCRMEntryRow(this); });

//}

//function fnStockiestSave() {
//    

//    $("#dvAjaxLoad").show();

//    var tblContent = "";

//    //var code = ""; stockiestCode = "", Product_Code = "", Percentage = "";
//    //for (var i = 0; i < stockiestArray.length; i++) {

//    //    code = customerCode;
//    //    tblContent += code + "^" + stockiestArray[i] + "$";
//    //}
//    //while (stockiestArray.length > 0) {
//    //    stockiestArray.pop();
//    //}
//    //while (stockiestArray.length > 0) {
//    //    stockiestArray.pop();
//    //}

//    var result = fnStockiestProductValidate();


//    
//    var ar = new Array();

//    var a = {};
//    a.name = "customerProducts_arr";
//    a.value = JSON.stringify(customerStockiestArray);
//    ar.push(a.value);

//    
//    var favoringUserCode = $("#ddlFavouringUser").val();
//    ////Insert to main table
//    //if (tblContent.length != 0) {

//    //$.ajax({
//    //    type: 'POST',
//    //    async: false,
//    //    url: '../HiDoctor_Activity/ExpenseClaim/InsertCRMExpenseClaim',
//    //    data: "customerProducts_arr=" + ar + "&favoringUserCode=" + favoringUserCode,
//    //    success: function (result) {
//    //        if (result == "SUCCESS") {
//    //            tblContent = "";
//    //            fnStockiestClose();
//    //        }
//    //        else {

//    //            fnMsgAlert('info', 'Failure', result);
//    //        }
//    //    },
//    //    error: function () {
//    //        $("#dvAjaxLoad").hide();
//    //        $.unblockUI();
//    //    },
//    //});
//    //}
//    HDAjax.requestInvoke("ExpenseClaim", "InsertCRMExpenseClaim", ar, "POST",
//       function (jsonResult) {
//       if (jsonResult == "SUCCESS") {
//               fnStockiestClose();
//           }
//           else {

//               fnMsgAlert('info', 'Failure', result);
//           }

//       },
//             function (e) {
//                 fnMsgAlert("info", "CRM Request", "There is some issue. Please contact support team.");
//                 $('.dash-content-wrapper').unblock();
//                 $.unblockUI();

//             },
//            function () {
//                $('.dash-content-wrapper').unblock();
//                $.unblockUI();
//            });
//}

function fnStockiestProductValidate() {

    var flag = true;
    var rowlength = parseInt(rownum - 1);
    var StockName = "", hdnStock = "", ProductName = "", Percentage = "", hdnProd = "", hdnPercen = "";

    for (var a = 1 ; a <= rowlength ; a++) {

        customer_Name = $("#hdnStockiest_" + a).val();
        var productlength = $("#txtStockiest_" + a + "_tblProductEntry_" + a + " tr").length;
        productlength = parseInt(productlength) - 1;
        for (var p = 1; p <= productlength; p++) {

            if ($("#txtStockiest_" + a).val() == "") {
                $("#hdnStockiest_" + a).val('');
            }
            if ($("#tblStockiestEntry_" + a + "_txtProduct_" + p).val() == "") {
                $('#tblStockiestEntry_2_hdnProduct_1').val('');
            }

            if ($("#tblStockiestEntry_" + a + "_txtProduct_" + p).val() != "") {
                if ($("#txtStockiest_" + a).val() == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Stockiest  name cannot be empty');
                    $("#tblStockiestEntry_" + a).val('');
                    $("#tblStockiestEntry_" + a).focus();
                    return false;

                }
            }

            if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != "") {

                if ($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val() == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Percentage cannot be empty');
                    $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val('');
                    $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).focus();
                    return false;


                }
            }

            if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != "") {
                if ($("#txtStockiest_" + a).val() == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Stockiest  name cannot be empty');
                    $("#tblStockiestEntry_" + a).val('');
                    $("#tblStockiestEntry_" + a).focus();
                    return false;
                }
            }

            if ($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val() != "") {
                fnPercentageCheck($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val());
                if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Product  cannot be empty');
                    $("#tblStockiestEntry_" + a + "_txtProduct_" + p).val('');
                    $("#tblStockiestEntry_" + a + "_txtProduct_" + p).focus();

                    return false;
                }
            }

            if ($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val() != "") {
                if (fnPercentageCheck($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val()) == false) {
                    fnMsgAlert('info', 'Expense Claim Request', 'Percentage cannot be greater than 100');
                    $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val('');
                    $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).focus();
                    return false;
                }
            }
        }
    }

    var c = [];
    var b = "";

    for (var a = 1 ; a <= rowlength ; a++) {



        customer_code = $("#hdnStockiest_" + a).val();
        if (customer_code != "") {
            customer_Name = $("#txtStockiest_" + a).val();
            var productlength = $("#txtStockiest_" + a + "_tblProductEntry_" + a + " tr").length;
            productlength = parseInt(productlength) - 1;



            var validCustomer = jsonPath(CRMCustomerAndProductsJson, "$.[?(@.label=='" + $("#hdnStockiest_" + a).val() + "')]");
            if (validCustomer == false) {
                fnMsgAlert("info", "Stockiest Customer", "Invalid Customer Name");
                $("#txtStockiest_" + a).val('');
                $("#txtStockiest_" + a).focus();
                return false;
            }

            for (var p = 1; p <= productlength; p++) {

                if ($("#txtStockiest_" + a).val() == "") {
                    $("#hdnStockiest_" + a).val('');
                }
                if ($("#tblStockiestEntry_" + a + "_txtProduct_" + p).val() == "") {
                    $('#tblStockiestEntry_2_hdnProduct_1').val('');
                }


                if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != "") {
                    hdnProd = $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val();
                }

                if (/^[0-9]*$/.test($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val()) == false) {
                    fnMsgAlert("info", "Stockiest Customer", "Decimal values are not allowed for Percentage");
                    $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val('');
                    $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').focus();
                    return false;
                }


                if (Math.round($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val()) != $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val()) {
                    fnMsgAlert("info", "Stockiest Customer", "Enter only numeric values in Percentage");
                    $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val('');
                    $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').focus();
                    return false;
                }

                if (!isNaN($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val())) {
                    hdnPercen = $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val();
                }
                else {
                    fnMsgAlert("info", "Stockiest Customer", "Enter only numbers for Percentage");
                    $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val('');
                    $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').focus();
                    return false;

                }
                hdnPercen = $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val();
                hdnProd = $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val();
                doctorCode = $('#hdn_DoctorCode').val();
                doctorName = $('#dvCustomerName').html().split('_')[0];



                if (customer_code != "" && hdnProd != "") {

                    var d = {};
                    d.Customer_Code = doctorCode
                    d.Base_Code = customer_code;
                    d.Product_Code = hdnProd;
                    d.Percentage = hdnPercen;

                    b = doctorCode + "-" + customer_code;
                    if ($.inArray(b, c) != -1) {
                        fnMsgAlert("info", "CRM Request", "Duplication of Doctor : " + doctorName + "<br/> and Customer: " + customer_Name + " is not allowed");
                        return false;
                    }
                    else {
                        c.push(b);
                    }
                }

                customerStockiestArray.push(d);
                hdnProd = "";
                hdnPercen = "";
            }
            customer_Name = "";
        }
        customer_Name = $("#dvCustomerName").val();
    }
    fnStockiestClose();
    return flag;

}


function fnPercentageCheck(i) {

    if (i > 100) {
        return false;
    }
    else {
        return true;
    }
}

// Numeric only control handler
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}


function fnStockiestClose() {
    content = "";
    button = "";
    $('#dvStockiest').overlay().close();
    return false;
}

function fnExpensePrint(userCode, claimCode, DateFrom, DateTo, statusName) {

    var dateFrom = new Array();
    var dateTo = new Array();

    dateFrom = DateFrom.split('/');
    dateTo = DateTo.split('/');
    DateFrom = dateFrom[2] + '-' + dateFrom[1] + '-' + dateFrom[0];
    DateTo = dateTo[2] + '-' + dateTo[1] + '-' + dateTo[0];

    $.ajax({
        type: 'POST',
        data: 'userCode=' + userCode + '&claimCode=' + claimCode + '&dateFrom=' + DateFrom + '&dateTo=' + DateTo + "&claimStatusName=" + statusName,
        url: '../HiDoctor_Activity/ExpenseClaim/GetExpenseClaimForPrint',
        success: function (response) {

            if (response != false || response != undefined) {
                $("#div").append(response.split('$')[0]);
                $("#divSumPrint").html(response.split('$')[1]);
                var totalExp = parseFloat(response.split('$')[2]);
                var expModeCount = parseInt(response.split('$')[3]);
                var docCount = parseInt(response.split('$')[4]);
                var blobUrl = response.split('$')[5];
                var totalDistances = response.split('$')[6];

                $('#dvPrintTotal').html("Total Expense : " + totalExp.toFixed(2));

                $('#tblExpenseAnalysis').dataTable({
                    "sPaginationType": "full_numbers",
                    "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                        var subTotalArr = new Array();
                        var grandTotalArr = new Array();
                        var colArray = new Array();

                        // 12 static column 
                        // expense will start from 13 or 17 (if doc count 4)

                        var arrInx = 0;
                        var startIdx = 14 + (4 - docCount);
                        var endIdx = 14 + (4 - docCount) + (expModeCount * 3);
                        var skipFrst = 1;
                        var docTotalStrt = startIdx - (4 - docCount);
                        var discount = 13
                        //for dynamic Distances count total


                        for (var col = docTotalStrt - 1; col < startIdx ; col++) {
                            for (var i = 0; i < aaData.length; i++) {
                                if (subTotalArr[arrInx] === undefined) {
                                    subTotalArr[arrInx] = 0.0;
                                }
                                if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                    subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                }
                            }
                            colArray[arrInx] = col;
                            arrInx++;
                        }


                        // for dynamic doctor count total
                        for (var col = docTotalStrt; col < startIdx ; col++) {
                            for (var i = 0; i < aaData.length; i++) {
                                if (subTotalArr[arrInx] === undefined) {
                                    subTotalArr[arrInx] = 0.0;
                                }
                                if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                    subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                }
                            }
                            colArray[arrInx] = col;
                            arrInx++;
                        }

                        // for dynamic Expense type expenses
                        for (var col = startIdx; col < endIdx ; col++) {
                            if (skipFrst == 3) {
                                for (var i = 0; i < aaData.length; i++) {
                                    if (subTotalArr[arrInx] === undefined) {
                                        subTotalArr[arrInx] = 0.0;
                                    }
                                    if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                        subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                                    }
                                }
                                colArray[arrInx] = col;
                                arrInx++;
                                skipFrst = 0;
                            }
                            skipFrst++;
                        }

                        //Total Expense
                        for (var i = 0; i < aaData.length; i++) {
                            if (subTotalArr[arrInx] === undefined) {
                                subTotalArr[arrInx] = 0.0;
                            }
                            if (!isNaN(aaData[i][col].replace(',', '')) && aaData[i][col] != "") {
                                subTotalArr[arrInx] += parseFloat(aaData[i][col].replace(',', ''));
                            }
                        }
                        colArray[arrInx] = col;

                        // grand total
                        for (var col = 0; col < colArray.length ; col++) {
                            for (var i = iStart; i < iEnd; i++) {
                                if (grandTotalArr[col] === undefined) {
                                    grandTotalArr[col] = 0.0;
                                }
                                if (!isNaN(aaData[aiDisplay[i]][colArray[col]].replace(',', '')) && aaData[aiDisplay[i]][colArray[col]] != "") {
                                    grandTotalArr[col] += parseFloat(aaData[aiDisplay[i]][colArray[col]].replace(',', ''));
                                }
                            }
                        }

                        var ncell = nRow.getElementsByTagName('th');

                        for (var col = 0; col < colArray.length; col++) {
                            ncell[colArray[col]].innerHTML = addCommas(grandTotalArr[col].toFixed(2)) + '<br/>(' + addCommas(subTotalArr[col].toFixed(2)) + ')';
                        }

                    },
                    "bDestroy": true,
                    "sDom": 'T<"clear">lfrtip',
                    "bSort": false,
                    "bSearchable": false,
                    "bFilter": false
                }).dataTable();


                fninializePrint("divSumPrint", "ifrmPrint", "div");
                fnPrint("divSumPrint", "ifrmPrint");
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
function fninializePrint(divId, iFrameId, mainDiv) {

    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

function fnCRMEditBind(claimCode, requestType, requestName) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/ExpenseClaim/GetClaimDetailsForEdit',
        data: "claimCode=" + claimCode + "&requestType=" + requestType,
        success: function (result) {
            fnGetDetailsUploadImage(claimCode);
            fnClear();
            if (result.split('^')[0] != 'FAIL') {
                if (result.split('$').length > 1) {
                    var ar = result.split('$');
                    var claimJson = eval('(' + ar[2] + ')');
                    fnFillDetailsInHeader(claimJson, requestName, requestType);
                    $('#dvClaimDetails').html(ar[0]);

                    $("#dvClaimHistoryPopUp").html(ar[1]);
                    fncalculateExpensetypewiseEdit();
                    // Initiating Doctor CRM Events
                    if (requestType.toUpperCase() == "CRM") {
                        if (claimJson[0].lstClaimHeader[0] != "") {
                            var favouringUserCode = claimJson[0].lstClaimHeader[0].Favouring_User_Code;
                            $.ajax({
                                type: 'POST',
                                data: "userCode=" + $('select[name="ddlFavouringUser"]').val(),
                                url: '../HiDoctor_Activity/ExpenseClaim/GetDoctorJson',
                                success: function (docJson) {
                                    if (docJson != null && docJson.length > 0) {
                                        //Sale product autofill
                                        var doc = "[";
                                        for (var i = 0; i < docJson.length; i++) {
                                            doc += "{label:" + '"' + "" + docJson[i].Customer_Name + "_" + docJson[i].MDL_Number + "_" + docJson[i].Speciality_Name + "_" + docJson[i].Region_Name + "" + '",' + "value:" + '"' + "" + docJson[i].Customer_Code + "_" + docJson[i].Region_Code + "" + '"' + "}";
                                            if (i < docJson.length - 1) {
                                                doc += ",";
                                            }
                                        }
                                        doc += "];";
                                        d_g = eval(doc);

                                        autoComplete(d_g, "txtEDCust", "hdnEDCust", 'autoCustEdit');
                                        fnDocCRMEditTableEventBinder();


                                        //$("#dvEditTab").css('display', '');
                                        $('#dvTabs').tabs('option', 'selected', 2);
                                        $("#main").unblock();
                                    }
                                    else {
                                        d_g = "";
                                    }
                                },
                                error: function (e) {
                                    fnMsgAlert('info', '', 'Error.' + e.responseText);
                                    $("#main").unblock();
                                }
                            });
                        }
                        else {
                            fnMsgAlert('info', '', 'No Claim Details Found');
                            $("#main").unblock();
                        }
                    }
                    else {
                        $("#dvEditTab").css('display', '');
                        $('#dvTabs').tabs('option', 'selected', 2);
                        $("#main").unblock();
                    }
                }

            }
            else {
                fnMsgAlert('info', 'Error', 'Error.' + result.split('^')[1]);
                $("#main").unblock();
            }
        },
        error: function () {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#dvEditTab").unblock();
        },
        complete: function () {
            $("#dvEditTab").unblock();
        }
    });
}

function fnFillMonthlyCalimEditDetails(claimCode, requestType, requestName) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/ExpenseClaim/GetClaimDetailsForEdit',
        data: "claimCode=" + claimCode + "&requestType=" + requestType,
        success: function (result) {
            fnGetDetailsUploadImage(claimCode);
            if (result.split('^')[0] != 'FAIL') {
                if (result.split('$').length > 1) {
                    var ar = result.split('$');
                    var claimJson = eval('(' + ar[2] + ')');

                    fnFillDetailsInHeader(claimJson, requestName, requestType);
                    // $('#dvClaimDetails').html(ar[0]);
                    $("#dvClaimHistoryPopUp").html(ar[1]);
                    fnShowDCRExpenseDetails();
                    $("#dvSummaryTab").unblock();
                    $("#main").unblock();
                }
            }
        },
        error: function (e) {
            fnMsgAlert("info", "Expense Claim", "There is some issue please contact your administrator.");
            $("#main").unblock();
        }
    });
}

/////////Expense claim for Month - End//////

/////////Expense claim for Month - End//////
function fnResetExp() {
    $("#UserSrch").val("");
    $("#DateDrp").val("");
    $("#DateDrpDaily").val("");
    var SrchMonthName = fnMonthName();
    var year = curdate.split('.')[2];
    var monthName = fnGetLastMonthName(fnMonthName());
    if (monthName == 'Dec') {
        year--;
    }
    $("#DateDrp").val(SrchMonthName + '-' + year);
    fnLoadData();
    //fnBindExpenseClaimSummary();
}
function fnSearchExp() {
    debugger;
    $("#main").block();
    var dateSplit = "";
    var ExpMonthName = "";
    var ExpMonth = 0;
    var ExpYear = 0;
    if ($("#DateDrp").val() != "") {
        dateSplit = $("#DateDrp").val().split('-');
        ExpMonthName = dateSplit[0];
        ExpMonth = fnGetMonthNumber(ExpMonthName);
        ExpYear = dateSplit[1];
    }
    if ($("#UserSrch").val() == "" && ExpMonth == 0 && ExpYear == 0) {
        fnMsgAlert('info', 'Expense Claim', 'Search using user name or requested date');
        $("#main").unblock();
        return false;
    }
    var SelectedUserCode = '', type = '', userName = '';
    if ($('input:radio[name=exp]:checked').val() == "login") {
        SelectedUserCode = CurrUserCode_g;
        type = 'login';
        userName = CurUserName;

    }
    else {

        SelectedUserCode = $('select[name="UserSrch"]').val();
        type = 'fav';
        userName = $('select[name="UserSrch"]').text();
        userName = userName.split('-')[0];
    }
    // $("#ddlFavouringUser").val();

    //$("#UserSrch").val()

    $.ajax({
        type: "GET",
        data: "UserName=" + userName + "&ExpMonth=" + ExpMonth + "&ExpYear=" + ExpYear + "&selectedUserCode=" + SelectedUserCode + "&Type=" + type,
        url: "../HiDoctor_Activity/ExpenseClaim/GetExpClaimSearch",
        success: function (response) {
            if (response != "" && response != null) {
                if (response.split('^')[0] != "FAIL") {
                    $("#userDv").show();
                    $("#ReqDv").show();
                    $("#btnSearchDv").show();
                    $("#dvSummaryTabSub").html(response);
                    $(".expRem").each(function () {
                        if ($(this).html().length > 30) {
                            $(this).html($(this).html().substring(0, 30) + '...');
                        }
                    })
                    //$("#lnkExcel").attr('href', response.split('$')[1]);
                    $('#dvTablePrint').show();
                }
                else {
                    fnMsgAlert('info', '', 'Error.' + response.split('^')[1]);
                    $("#main").unblock();
                }
            }
            $("#main").unblock();
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {

        }
    });
}
function fnGetMonthNumber(ExpMonth) {
    switch (ExpMonth) {
        case 'Jan': {
            return 1;
        }
        case 'Feb': {
            return 2;
        }
        case 'Mar': {
            return 3;
        }
        case 'Apr': {
            return 4;
        }
        case 'May': {
            return 5;
        }
        case 'Jun': {
            return 6;
        }
        case 'Jul': {
            return 7;
        }
        case 'Aug': {
            return 8;
        }
        case 'Sep': {
            return 9;
        }
        case 'Oct': {
            return 10;
        }
        case 'Nov': {
            return 11;
        }
        case 'Dec': {
            return 12;
        }
    }
}
function fnGetDcrFlag(RowId) {
    debugger;
    var DcrSelDate = $("#DcrDateTxt_" + RowId + "").val();
    if (DcrSelDate != "") {
        AutoComplete_Ovr_DcrFlag = $.grep(AddlExpDet_g, function (element, index) {
            return (element.DCR_Date === DcrSelDate)
        });
        if (AutoComplete_Ovr_DcrFlag.length > 0) {
            if (AutoComplete_Ovr_DcrFlag.length == 1) {
                $("#DcrFlagTxt_" + RowId + "").val(AutoComplete_Ovr_DcrFlag[0].DCR_Flag);
                $("#hdnDcrFlag_" + RowId + "").val(AutoComplete_Ovr_DcrFlag[0].DCR_Flag);
                fnGetDcrCategory(RowId);
            }
            else {
                var DcrFlagLst = "[";
                for (var i = 0; i < AutoComplete_Ovr_DcrFlag.length; i++) {
                    DcrFlagLst += "{label:" + '"' + "" + AutoComplete_Ovr_DcrFlag[i].DCR_Flag + "" + '",' + "value:" + '"' + "" + AutoComplete_Ovr_DcrFlag[i].DCR_Flag + "" + '"' + "}";
                    if (i < AutoComplete_Ovr_DcrFlag.length - 1) {
                        DcrFlagLst += ",";
                    }
                }
                DcrFlagLst += "];";
                AutoComplete_Ovr_DcrFlag = eval(DcrFlagLst)
                autoComplete(AutoComplete_Ovr_DcrFlag, "DcrFlagTxt", "hdnDcrFlag", "AutoDcrFlag");
                $("#DcrFlagTxt_" + RowId + "").removeAttr("disabled");
            }
            $("#DcrDateTxt_" + RowId + "").attr('disabled', true);
        }
    }
    else {
        //fnMsgAlert('info', 'Expense Claim', 'Select Date For Row ' + RowId + '');
        return false;
    }
}
function fnGetDcrFlagEdit(RowId) {
    debugger;
    var DcrSelDate = $("#AprDcrDate_" + RowId + "").val();
    if (DcrSelDate != "") {
        autoComplete_DcrFlag_Edit = $.grep(AddlDcrDetEdit_g, function (element, index) {
            return (element.DCR_Date === DcrSelDate)
        });
        if (autoComplete_DcrFlag_Edit.length > 0) {
            if (autoComplete_DcrFlag_Edit.length == 1) {
                $("#AprFlag_" + RowId + "").val(autoComplete_DcrFlag_Edit[0].DCR_Flag);
                $("#hdnAprFlag_" + RowId + "").val(autoComplete_DcrFlag_Edit[0].DCR_Flag);
                $("#AprFlag_" + RowId + "").removeAttr("disabled");
                fnGetDcrCategoryEdit(RowId);
            }
            else {
                var DcrFlagLst = "[";
                for (var i = 0; i < autoComplete_DcrFlag_Edit.length; i++) {
                    DcrFlagLst += "{label:" + '"' + "" + autoComplete_DcrFlag_Edit[i].DCR_Flag + "" + '",' + "value:" + '"' + "" + autoComplete_DcrFlag_Edit[i].DCR_Flag + "" + '"' + "}";
                    if (i < autoComplete_DcrFlag_Edit.length - 1) {
                        DcrFlagLst += ",";
                    }
                }
                DcrFlagLst += "];";
                autoComplete_DcrFlag_Edit = eval(DcrFlagLst)
                autoComplete(autoComplete_DcrFlag_Edit, "AprFlag", "hdnAprFlag", "AutoAprDcrFlag");
                $("#AprFlag_" + RowId + "").removeAttr("disabled");
            }
            $("#AprDcrDate_" + RowId + "").attr('disabled', true);
        }
    }
}
function fnGetDcrCategory(RowId) {
    debugger;
    var DcrSelDate = $("#DcrDateTxt_" + RowId + "").val();
    var DcrSelFlag = $("#DcrFlagTxt_" + RowId + "").val();
    if (DcrSelFlag != "" && DcrSelDate != "") {
        var autoComplete_DcrCat = $.grep(AddlExpDet_g, function (element, index) {
            return (element.DCR_Flag === DcrSelFlag && element.DCR_Date === DcrSelDate)
        });
        if (autoComplete_DcrCat.length > 0) {
            if (autoComplete_DcrCat.length == 1) {
                $("#DcrCatTxt_" + RowId + "").val(autoComplete_DcrCat[0].Category);
                $("#hdnDcrCat_" + RowId + "").val(autoComplete_DcrCat[0].Category);
                $("#ExpTypeTxt_" + RowId + "").attr('disabled', false);
            }
            $("#DcrFlagTxt_" + RowId + "").attr('disabled', true);
        }
    }
}
function fnGetDcrCategoryEdit(RowId) {
    debugger;
    var DcrSelDate = $("#AprDcrDate_" + RowId + "").val();
    var DcrSelFlag = $("#AprFlag_" + RowId + "").val();
    if (DcrSelFlag != "" && DcrSelDate != "") {
        autoComplete_DcrCat_Edit = $.grep(AddlDcrDetEdit_g, function (element, index) {
            return (element.DCR_Flag === DcrSelFlag && element.DCR_Date === DcrSelDate)
        });
        if (autoComplete_DcrCat_Edit.length > 0) {
            if (autoComplete_DcrCat_Edit.length == 1) {
                $("#AprCategory_" + RowId + "").val(autoComplete_DcrCat_Edit[0].Category);
                $("#hdnAprCategory_" + RowId + "").val(autoComplete_DcrCat_Edit[0].Category);
            }
            else {
                var DcrCatLst = "[";
                for (var i = 0; i < autoComplete_DcrCat_Edit.length; i++) {
                    DcrCatLst += "{label:" + '"' + "" + autoComplete_DcrCat_Edit[i].Category + "" + '",' + "value:" + '"' + "" + autoComplete_DcrCat[i].Category + "" + '"' + "}";
                    if (i < autoComplete_DcrCat_Edit.length - 1) {
                        DcrCatLst += ",";
                    }
                }
                DcrCatLst += "];";
                autoComplete_DcrCat_Edit = eval(DcrCatLst)
                autoComplete(autoComplete_DcrCat_Edit, "AprCategory", "hdnAprCategory", "AutoAprDcrCat");
            }
            $("#AprFlag_" + RowId + "").attr('disabled', true);
            $("#AprExpType_" + RowId + "").attr('disabled', false);
        }
    }
}
function fnGetDcrExpense(RowId) {
    debugger;
    ExpenseRow = RowId;
    $("#ExpNameModal").val('');
    $("#hdnExpCodeModal").val('');
    $("#ExpAmtModal").val('');
    $("#myModal").modal();
    var FormattedDate = "";
    var DcrSelDate = $("#DcrDateTxt_" + RowId + "").val();
    if (DcrSelDate != "") {
        var DateSplit = $("#DcrDateTxt_" + RowId + "").val().split('/');
        FormattedDate = DateSplit[1] + '/' + DateSplit[0] + '/' + DateSplit[2];
    }
    var DcrSelFlag = $("#DcrFlagTxt_" + RowId + "").val();
    var DcrSelCat = $("#DcrCatTxt_" + RowId + "").val();
    if (FormattedDate != "" && DcrSelFlag != "" && DcrSelCat != "") {
        autoComplete_DcrExp = $.grep(AddlExpTypeDet_g, function (element, index) {
            debugger;
            if (element.Expense_Entity != null) {
                return (element.Expense_Entity.trim() === DcrSelCat && new Date(FormattedDate) >= new Date(element.Effective_From.trim().split(' ')[0]) && new Date(FormattedDate) <= new Date(element.Effective_To.trim().split(' ')[0]))
            }
            else {
                return (new Date(FormattedDate) >= new Date(element.Effective_From.trim().split(' ')[0]) && new Date(FormattedDate) <= new Date(element.Effective_To.trim().split(' ')[0]))
            }
        });
        if (autoComplete_DcrExp.length > 0) {
            if (autoComplete_DcrExp.length == 0) {
                $("#ExpTypeTxt_" + RowId + "").val(autoComplete_DcrExp[0].Expense_Type_Name);
                $("#hdnDcrExp_" + RowId + "").val(autoComplete_DcrExp[0].Expense_Type_Code);
            }
            else {
                var ExpLst = "[";
                for (var i = 0; i < autoComplete_DcrExp.length; i++) {
                    ExpLst += "{label:" + '"' + "" + autoComplete_DcrExp[i].Expense_Type_Name + "" + '",' + "value:" + '"' + "" + autoComplete_DcrExp[i].Expense_Type_Code + "" + '"' + "}";
                    if (i < autoComplete_DcrExp.length - 1) {
                        ExpLst += ",";
                    }
                }
                ExpLst += "];";
                autoComplete_DcrExp = eval(ExpLst)
                autoComplete(autoComplete_DcrExp, "ExpNameModal", "hdnExpCodeModal", "AutoDcrExp");
                $("#ExpNameModal").attr('onblur', "fnValidateAutofill(this," + 'autoComplete_DcrExp' + ",\"ExpNameModal\",\"hdnExpCodeModal\")");
            }
        }
    }
}
function fnGetDcrExpenseEdit(RowId) {
    debugger;
    ExpenseRow = RowId;
    $("#ExpNameEditModal").val('');
    $("#hdnExpCodeEditModal").val('');
    $("#ExpAmtEditModal").val('');
    $("#ExpEditModal").modal();
    var FormattedDate = "";
    var DcrSelDate = $("#AprDcrDate_" + RowId + "").val();
    if (DcrSelDate != "") {
        var DateSplit = $("#AprDcrDate_" + RowId + "").val().split('/');
        FormattedDate = DateSplit[1] + '/' + DateSplit[0] + '/' + DateSplit[2];
    }
    var DcrSelFlag = $("#AprFlag_" + RowId + "").val();
    var DcrSelCat = $("#AprCategory_" + RowId + "").val();
    if (FormattedDate != "" && DcrSelFlag != "" && DcrSelCat != "") {
        var autoComplete_DcrExp = $.grep(AddlExpDetEdit_g, function (element, index) {
            debugger;
            if (element.Expense_Entity != null) {
                return (element.Expense_Entity.trim() === DcrSelCat && new Date(FormattedDate) >= new Date(element.Effective_From.trim().split(' ')[0]) && new Date(FormattedDate) <= new Date(element.Effective_To.trim().split(' ')[0]))
            }
            else {
                return (new Date(FormattedDate) >= new Date(element.Effective_From.trim().split(' ')[0]) && new Date(FormattedDate) <= new Date(element.Effective_To.trim().split(' ')[0]))
            }
        });
        if (autoComplete_DcrExp.length > 0) {
            if (autoComplete_DcrExp.length == 0) {
                $("#AprExpType_" + RowId + "").val(autoComplete_DcrExp[0].Expense_Type_Name);
                $("#hdnAprExpCode_" + RowId + "").val(autoComplete_DcrExp[0].Expense_Type_Code);
            }
            else {
                var ExpLst = "[";
                for (var i = 0; i < autoComplete_DcrExp.length; i++) {
                    ExpLst += "{label:" + '"' + "" + autoComplete_DcrExp[i].Expense_Type_Name + "" + '",' + "value:" + '"' + "" + autoComplete_DcrExp[i].Expense_Type_Code + "" + '"' + "}";
                    if (i < autoComplete_DcrExp.length - 1) {
                        ExpLst += ",";
                    }
                }
                ExpLst += "];";
                autoComplete_DcrExp = eval(ExpLst)
                autoComplete(autoComplete_DcrExp, "ExpNameEditModal", "hdnExpCodeEditModal", "AutoDcrExpEdit");
            }
        }
    }
}
function FnCreateRow(RowId) {
    debugger;
    //if (RowId == $(".AutoDcrDate").length) {
    var dcrdate = $("#hdnDcrDate_" + RowId + "").val();
    if (dcrdate != "") {
        var DateSplit = dcrdate.split('/');
        FormattedDate = DateSplit[1] + '/' + DateSplit[0] + '/' + DateSplit[2];
    }
    var dcrflag = $("#hdnDcrFlag_" + RowId + "").val();
    var dcrcat = $("#hdnDcrCat_" + RowId + "").val();
    var dcrexpname = $("#ExpTypeTxt_" + RowId + "").val();
    var dcrexptypecode = $("#hdnDcrExp_" + RowId + "").val();
    var dcrexpamt = $("#ExpAmt_" + RowId + "").val();
    var userCode = $('select[name="ddlFavouringUser"]').val();

    if ($("#DcrDateTxt_" + RowId + "").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Date for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (dcrdate == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Date for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#DcrFlagTxt_" + RowId + "").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Flag for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (dcrflag == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Flag for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#DcrCatTxt_" + RowId + "").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Category for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (dcrcat == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Category for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (dcrexpname == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Type for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (dcrexptypecode == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Expense Type for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (dcrexpamt == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Amount for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (/^[0-9]+([.][0-9]+)?$/g.test(dcrexpamt) == false) {
        fnMsgAlert('info', 'Expense Additional Claim', 'Please Enter Integer Value in Expense Amount for Row ' + RowId + ' ');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        type: 'GET',
        data: "userCode=" + userCode + "&DcrDate=" + FormattedDate + "&DcrFlag=" + dcrflag + "&DcrCat=" + dcrcat + "&DcrExp=" + dcrexpname + "&DcrExpCode=" + dcrexptypecode + "&DcrAmt=" + dcrexpamt,
        url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
        success: function (resp) {
            if (resp.split('^')[0].toUpperCase() == "SUCCESS") {
                var ExpRowContent = "";
                if (RowId != "") {
                    RowId = $(".AutoDcrDate").length;
                    ExpRowContent += "<tr id='ExpRow_" + parseInt(RowId + 1) + "' class='AddlExpCls'><td><input type='text' style='width: 90px;' value='' id='DcrDateTxt_" + parseInt(RowId + 1) + "' class='form-control AutoDcrDate' onblur ='fnValidateAutofill(this," + 'AutoComplete_DcrDate' + ",\"DcrDateTxt\",\"hdnDcrDate\");fnGetDcrFlag(" + parseInt(RowId + 1) + ");' autocomplete='off'/><input type='hidden' class='hdnDcrDateCls' id='hdnDcrDate_" + parseInt(RowId + 1) + "'></td>";
                    ExpRowContent += "<td><input type='text' style='width: 90px;' value='' id='DcrFlagTxt_" + parseInt(RowId + 1) + "' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + 'AutoComplete_Ovr_DcrFlag' + ",\"DcrFlagTxt\",\"hdnDcrFlag\");fnGetDcrCategory(" + parseInt(RowId + 1) + ");' autocomplete='off' disabled/><input type='hidden' class='hdnDcrFlagCls' id='hdnDcrFlag_" + parseInt(RowId + 1) + "'></td>";
                    ExpRowContent += "<td><input type='text' style='width: 90px;' value='' id='DcrCatTxt_" + parseInt(RowId + 1) + "' class='form-control AutoDcrCat' onblur ='fnValidateAutofill(this," + 'AutoComplete_Ovr_DcrFlag' + ",\"DcrCatTxt\",\"hdnDcrCat\");' autocomplete='off' disabled/><input type='hidden' class='hdnDcrCatCls' id='hdnDcrCat_" + parseInt(RowId + 1) + "'></td>";
                    ExpRowContent += "<td><input type='text' style='width: 90px;' value='' id='ExpTypeTxt_" + parseInt(RowId + 1) + "' class='form-control' onclick='fnGetDcrExpense(" + parseInt(RowId + 1) + ");' disabled/><input type='hidden' class='hdnDcrExpCls' id='hdnDcrExp_" + parseInt(RowId + 1) + "'></td>";
                    ExpRowContent += "<td><input type='text' style='width: 90px;' value='' style='width: 90px;' class='form-control' id='ExpAmt_" + parseInt(RowId + 1) + "' class='form-control' disabled/><input type='hidden' id='ExpMode_" + parseInt(RowId + 1) + "' value=''/></td>";
                    ExpRowContent += "<td><input type='text' style='width: 100px;' value='' class='form-control' id='RefTxt_" + parseInt(RowId + 1) + "'/></td>";
                    ExpRowContent += "<td><input type='text' style='width: 100px;' value='' class='form-control' id='RemTxt_" + parseInt(RowId + 1) + "'/></td>";
                    ExpRowContent += "<td><a style='cursor:pointer;' onclick='FnCreateRow(" + parseInt(RowId + 1) + ")'><i class='fa fa-plus' style='font-size:18px;color:green;'></i></a>&nbsp;&nbsp;<a style='cursor:pointer;' onclick='FnClearRowData(" + parseInt(RowId + 1) + ")'><i class='fa fa-remove' style='font-size:21px;color:red;'></i></a></td></tr>";
                    $('#AddlExpTbl tr:last').after(ExpRowContent);
                    $("#DcrDateTxt_" + RowId + "").attr('disabled', true);
                    $("#DcrFlagTxt_" + RowId + "").attr('disabled', true);
                    $("#DcrCatTxt_" + RowId + "").attr('disabled', true);
                    $("#ExpTypeTxt_" + RowId + "").attr('disabled', true);
                    $("#ExpAmt_" + RowId + "").attr('disabled', true);
                    $("#plus_" + RowId + "").attr('disabled', true);
                }
                return false;
            }
            else {
                fnMsgAlert('error', 'Expense Additional Claim', resp.split('^'));
                return false;
            }
        },
        error: function () {

        },
        complete: function () {
            autoComplete(AutoComplete_DcrDate, "DcrDateTxt", "hdnDcrDate", "AutoDcrDate");
        }
    });
    //  }

}
function FnDeleteRow(RowId) {
    $("#ExpRow_" + RowId + "").hide();
}
function fnGetDcrExpMode(SelRow) {
    var FormattedDate = "";
    var DcrSelDate = $("#DcrDateTxt_" + SelRow + "").val();
    if (DcrSelDate != "") {
        var DateSplit = $("#DcrDateTxt_" + SelRow + "").val().split('/');
        FormattedDate = DateSplit[1] + '/' + DateSplit[0] + '/' + DateSplit[2];
    }
    var ExpTypeCode = $("#hdnDcrExp_" + SelRow + "").val();
    var DcrSelCat = $("#DcrCatTxt_" + SelRow + "").val();
    var DcrExpenseMode = $.grep(AddlExpTypeDet_g, function (element, index) {
        if (element.Expense_Entity != null) {
            return (element.Expense_Entity.trim() == DcrSelCat && element.Expense_Type_Code == ExpTypeCode && new Date(FormattedDate) >= new Date(element.Effective_From.trim().split(' ')[0]) && new Date(FormattedDate) <= new Date(element.Effective_To.trim().split(' ')[0]));
        }
        else {
            return (element.Expense_Type_Code == ExpTypeCode && new Date(FormattedDate) >= new Date(element.Effective_From.trim().split(' ')[0]) && new Date(FormattedDate) <= new Date(element.Effective_To.trim().split(' ')[0]));
        }
    });
    $("#ExpMode_" + SelRow + "").val(DcrExpenseMode[0].Expense_Mode);
}
function fnAddExpDetails() {
    debugger;
    var dcrdate = $("#DcrDateTxt_" + ExpenseRow + "").val();
    if (dcrdate != "") {
        var splitDate = dcrdate.split('/');
        var formatDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2];
    }
    var dcrflag = $("#DcrFlagTxt_" + ExpenseRow + "").val();
    var dcrcat = $("#DcrCatTxt_" + ExpenseRow + "").val();
    var dcrexpname = $("#ExpNameModal").val();
    var dcrexptypecode = $("#hdnExpCodeModal").val();
    var dcrexpamt = $("#ExpAmtModal").val();
    var userCode = $('select[name="ddlFavouringUser"]').val();
    if (dcrdate == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Date for Row ' + ExpenseRow + ' ');
        $("#myModal").modal('hide')
        return false;
    }
    else if (dcrflag == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Flag for Row ' + ExpenseRow + ' ');
        $("#myModal").modal('hide')
        return false;
    }
    else if (dcrcat == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Category for Row ' + ExpenseRow + ' ');
        $("#myModal").modal('hide')
        return false;
    }
    else if (dcrexpname == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Type for Row ' + ExpenseRow + ' ');
        return false;
    }
    else if (dcrexptypecode == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Valid Expense for row ' + ExpenseRow + ' ');
        return false;
    }
    else if (dcrexpamt == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Amount for Row ' + ExpenseRow + ' ');
        return false;
    }
    else if (dcrexpamt == "0") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Enter expense amount greater than zero for row ' + ExpenseRow + ' ');
        return false;
    }
    else if (/^[0-9]+([.][0-9]+)?$/g.test(dcrexpamt) == false) {
        fnMsgAlert('info', 'Expense Additional Claim', 'Please Enter Integer Value in expense amount for row ' + ExpenseRow + ' ');
        return false;
    }
    var ExpenseMode = $.grep(AddlExpTypeDet_g, function (element, index) {
        return (element.Expense_Type_Code == dcrexptypecode && element.Expense_Mode.toUpperCase() != "DAILY")
    });
    if (ExpenseMode.length > 0) {
        if (ExpenseMode[0].Expense_Mode != "DAILY") {
            var TotalRow = $('.AddlExpCls').length;
            var SelectedRow = $('.AddlExpCls:visible').length;
            AddlExpArr = [];
            var isExpRepeated = 0;
            var AddlExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#ExpRow_' + parseInt(i + 1) + '').is(':visible')) {
                    if (dcrdate != "") {
                        if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate == $("#DcrDateTxt_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + dcrexpname + ' already claimed for ' + dcrdate + '');
                            return false;
                        }
                        else if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate != $("#DcrDateTxt_" + parseInt(i + 1) + "").val()) {
                            dcrexpamt = parseFloat(dcrexpamt) + parseFloat($("#ExpAmt_" + parseInt(i + 1) + "").val());
                            isExpRepeated = 1;
                        }
                    }
                }
            }
        }
        if (ExpenseMode[0].Can_Split_Amount == "N") {
            var TotalRow = $('.AddlExpCls').length;
            var SelectedRow = $('.AddlExpCls:visible').length;
            AddlExpArr = [];
            var isExpRepeated = 0;
            var AddlExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#ExpRow_' + parseInt(i + 1) + '').is(':visible')) {
                    if (dcrdate != "") {
                        if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == dcrexptypecode) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + dcrexpname + ' have no split amount');
                            return false;
                        }
                    }
                }
            }
        }
    }
    var DailyExpenseMode = $.grep(AddlExpTypeDet_g, function (element, index) {
        return (element.Expense_Type_Code == dcrexptypecode && element.Expense_Mode.toUpperCase() == "DAILY" && element.Expense_Entity.trim() == dcrcat)
    });
    if (DailyExpenseMode.length > 0) {
        if (DailyExpenseMode[0].Expense_Mode == "DAILY") {
            var TotalRow = $('.AddlExpCls').length;
            var SelectedRow = $('.AddlExpCls:visible').length;
            AddlExpArr = [];
            var isExpRepeated = 0;
            var AddlExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#ExpRow_' + parseInt(i + 1) + '').is(':visible')) {
                    if (dcrdate != "") {
                        if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate == $("#DcrDateTxt_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + dcrexpname + ' already claimed for ' + dcrdate + '');
                            return false;
                        }
                    }
                }
            }
        }
    }
    $('#btnAddlExpSave').attr('disabled', true);
    $.ajax({
        type: 'GET',
        data: "userCode=" + userCode + "&DcrDate=" + formatDate + "&DcrFlag=" + dcrflag + "&DcrCat=" + dcrcat + "&DcrExp=" + dcrexpname + "&DcrExpCode=" + dcrexptypecode + "&DcrAmt=" + dcrexpamt,
        url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
        success: function (resp) {
           
            if (resp.split('^')[0] == "SUCCESS") {
                $('#btnAddlExpSave').attr('disabled', false);
                $("#myModal").modal('hide');
                var content = resp.split('^')[1];
                $("#ExpTypeTxt_" + ExpenseRow + "").val($("#ExpNameModal").val());
                $("#hdnDcrExp_" + ExpenseRow + "").val($("#hdnExpCodeModal").val());
                $("#ExpAmt_" + ExpenseRow + "").val($("#ExpAmtModal").val());
                $("#ExpTypeTxt_" + ExpenseRow + "").attr("disabled", true);
                fnMsgAlert('success', 'Expense Additional Claim', content);
                //var Curr_Amt = $("#txtTotExpense").val();
                //Curr_Amt = parseFloat(Curr_Amt) + parseFloat(dcrexpamt);
                // $("#txtTotExpense").val(Curr_Amt);
                var totalExpTbl = $(".clsApprExpTypeTotal").length;
                var isExpAvail = false;
                for (var i = 0; i < totalExpTbl; i++) {
                    if ($("#ExpenseTypeName #TotalExpName_" + i + "").html() == $("#ExpTypeTxt_" + ExpenseRow + "").val()) {
                        var totalAmt = parseFloat($("#TotalExpAmt_" + i + "").html()) + parseFloat($("#ExpAmt_" + ExpenseRow + "").val());
                        $("#ExpenseTypeName #TotalExpAmt_" + i + "").html(totalAmt);
                        isExpAvail = true;
                        if (totalAmt > 0) {
                            $("#ExpenseTypeName #TotalExpAmt_" + i + "").show();
                            $("#ExpenseTypeName #TotalExpName_" + i + "").show();
                        }
                    }
                }
                if (!isExpAvail) {
                    var ExpenseContent = "";
                    //ExpenseContent += "<tbody class='TotalExpenseCls'>";
                    ExpenseContent += "<tr id='trApproveExpTypeTotal' class='clsApprExpTypeTotal'>";
                    ExpenseContent += "<td id='TotalExpName_" + parseInt(totalExpTbl) + "'>" + $("#ExpTypeTxt_" + ExpenseRow + "").val() + "</td>";
                    ExpenseContent += "<td id='TotalExpAmt_" + parseInt(totalExpTbl) + "'>" + $("#ExpAmt_" + ExpenseRow + "").val() + "</td>";
                    ExpenseContent += "</tr>";//</tbody>";
                    $("#ExpenseTypeName #tbltotalExpenseEntry tbody").append(ExpenseContent);
                  
                }
                //$("#txtTotExpenseEdit").val();
                var Curr_Amt = 0;
                $('#ExpenseTypeName #tbltotalExpenseEntry tbody tr').map(function () {
                    var amount = $(this).children()[1].textContent;
                    Curr_Amt = Curr_Amt + parseInt(amount);
                })

                //Curr_Amt = parseFloat(Curr_Amt) + parseFloat(dcrexpamt);
                $("#txtTotExpense").val(Curr_Amt);
                return false;
            }
            else {
                $('#btnAddlExpSave').attr('disabled', false);
                var content = resp.split('^')[1];
                fnMsgAlert('error', 'Expense Additional Claim', content);
                return false;
            }
        },
        error: function () {
            $('#btnAddlExpSave').attr('disabled', false);
        },
        complete: function () {

        }
    });

    return false;
}
function fnAddExpDetEdit() {
    debugger;
    var dcrdate = $("#AprDcrDate_" + ExpenseRow + "").val();
    var splitDate = dcrdate.split('/');
    var formatDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2];
    var dcrflag = $("#AprFlag_" + ExpenseRow + "").val();
    var dcrcat = $("#AprCategory_" + ExpenseRow + "").val();
    var dcrexpname = $("#ExpNameEditModal").val();
    var dcrexptypecode = $("#hdnExpCodeEditModal").val();
    var dcrexpamt = $("#ExpAmtEditModal").val();
    var userCode = $("#hdnFavouringUserCode").val();
    if ($("#ExpNameEditModal").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Type For Expense Additional Claim');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#hdnExpCodeEditModal").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Valid Expense Type For Expense Additional Claim');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#ExpAmtEditModal").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Please Enter Amount For Expense Additional Claim');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (/^[0-9]+([.][0-9]+)?$/g.test($("#ExpAmtEditModal").val()) == false) {
        fnMsgAlert('info', 'Expense Additional Claim', 'Please Enter Integer Value in Amount For Expense Additional Claim');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    var ExpenseMode = $.grep(AddlExpDetEdit_g, function (element, index) {
        return (element.Expense_Type_Code == dcrexptypecode && element.Expense_Mode.toUpperCase() != "DAILY")
    });
    if (ExpenseMode.length > 0) {
        if (ExpenseMode[0].Expense_Mode != "DAILY") {
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlAprExpArr = [];
            var AddlAprExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible') && $("#AprDcrDate_" + parseInt(i + 1) + "").val() != "") {
                    if (dcrdate != "") {
                        if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate == $("#AprDcrDate_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + dcrexpname + ' Already Claimed For ' + dcrdate + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate != $("#AprDcrDate_" + parseInt(i + 1) + "").val()) {
                            dcrexpamt = parseFloat(dcrexpamt) + parseFloat($("#AprExpAmt_" + parseInt(i + 1) + "").val());
                            isExpRepeated = 1;
                        }
                    }
                }
            }
        }
        if (ExpenseMode[0].Can_Split_Amount == "N") {
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlAprExpArr = [];
            var AddlAprExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible') && $("#AprDcrDate_" + parseInt(i + 1) + "").val() != "") {
                    if (dcrdate != "") {
                        if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == dcrexptypecode) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + dcrexpname + ' have no split amount');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                    }
                }
            }
        }
    }
    var DailyExpenseMode = $.grep(AddlExpDetEdit_g, function (element, index) {
        return (element.Expense_Type_Code == dcrexptypecode && element.Expense_Mode.toUpperCase() == "DAILY" && element.Expense_Entity.trim() == dcrcat)
    });
    if (DailyExpenseMode.length > 0) {
        if (DailyExpenseMode[0].Expense_Mode == "DAILY") {
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlAprExpArr = [];
            var AddlAprExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible') && $("#AprDcrDate_" + parseInt(i + 1) + "").val() != "") {
                    if (dcrdate != "") {
                        if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate == $("#AprDcrDate_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + dcrexpname + ' Already Claimed For ' + dcrdate + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                    }
                }
            }
        }
    }
    $('#btnAddlExpSaveEdit').attr('disabled', true);
    $.ajax({
        type: 'GET',
        data: "userCode=" + userCode + "&DcrDate=" + formatDate + "&DcrFlag=" + dcrflag + "&DcrCat=" + dcrcat + "&DcrExp=" + dcrexpname + "&DcrExpCode=" + dcrexptypecode + "&DcrAmt=" + dcrexpamt,
        url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
        success: function (resp) {
            $("#myModal").modal('hide');
            if (resp.split('^')[0] == "SUCCESS") {
                debugger;
                $('#btnAddlExpSaveEdit').attr('disabled', false);
                var content = resp.split('^')[1];
                $("#AprExpType_" + ExpenseRow + "").val($("#ExpNameEditModal").val());
                $("#hdnAprExpCode_" + ExpenseRow + "").val($("#hdnExpCodeEditModal").val());
                $("#AprExpAmt_" + ExpenseRow + "").val($("#ExpAmtEditModal").val());
                $("#AprExpType_" + ExpenseRow + "").attr("disabled", true);
                fnMsgAlert('success', 'Expense Additional Claim', content);


                var totalExpTbl = $(".clsApprExpTypeTotal").length;
                var isExpAvail = false;
                for (var i = 0; i < totalExpTbl; i++) {
                    if ($("#ExpenseTypeNameEdit #TotalExpName_" + i + "").html() == $("#ExpNameEditModal").val()) {
                        var totalAmt = parseFloat($("#TotalExpAmt_" + i + "").html()) + parseFloat($("#ExpAmtEditModal").val());
                        $("#ExpenseTypeNameEdit #TotalExpAmt_" + i + "").html(totalAmt);
                        isExpAvail = true;
                        if (totalAmt > 0) {
                            $("#ExpenseTypeNameEdit #TotalExpAmt_" + i + "").show();
                            $("#ExpenseTypeNameEdit #TotalExpName_" + i + "").show();
                        }
                    }
                }
                if (!isExpAvail) {
                    var ExpenseContent = "";
                    //ExpenseContent += "<tbody class='TotalExpenseCls'>";
                    ExpenseContent += "<tr id='trApproveExpTypeTotal' class='clsApprExpTypeTotal'>";
                    ExpenseContent += "<td id='TotalExpName_" + parseInt(totalExpTbl) + "'>" + $("#ExpNameEditModal").val() + "</td>";
                    ExpenseContent += "<td id='TotalExpAmt_" + parseInt(totalExpTbl) + "'>" + $("#ExpAmtEditModal").val() + "</td>";
                    ExpenseContent += "</tr>";//</tbody>";
                    $("#ExpenseTypeNameEdit #tbltotalExpenseEntry tbody").append(ExpenseContent);
                }
                $("#ExpEditModal").modal('hide');
                var Curr_Amt = 0;//$("#txtTotExpenseEdit").val();
                $('#ExpenseTypeNameEdit #tbltotalExpenseEntry tbody tr').map(function () {
                    var amount = $(this).children()[1].textContent;
                    Curr_Amt = Curr_Amt + parseInt(amount);
                })
                //Curr_Amt = parseFloat(Curr_Amt) + parseFloat(dcrexpamt);
                $("#txtTotExpenseEdit").val(Curr_Amt);

                return false;
            }
            else {
                $('#btnAddlExpSaveEdit').attr('disabled', false);
                var content = resp.split('^')[1];
                fnMsgAlert('error', 'Expense Additional Claim', content);
                return false;
            }
        },
        error: function () {
            $('#btnAddlExpSaveEdit').attr('disabled', false);
        },
        complete: function () {

        }
    });

    return false;
}
function FnClearRowData(selRow) {

    if ($("#ExpAmt_" + selRow + "").val() != "") {
        var ExpenseAmt = $("#ExpAmt_" + selRow + "").val();
        var Curr_Amt = $("#txtTotExpense").val();
        Curr_Amt = parseFloat(Curr_Amt) - parseFloat(ExpenseAmt);
        $("#txtTotExpense").val(Curr_Amt);

        var totalExpTbl = $(".clsApprExpTypeTotal").length;
        for (var i = 0; i < totalExpTbl; i++) {
            if ($("#TotalExpName_" + i + "").html() == $("#ExpTypeTxt_" + selRow + "").val()) {
                var totalAmt = parseFloat($("#TotalExpAmt_" + i + "").html()) - parseFloat(ExpenseAmt);
                $("#TotalExpAmt_" + i + "").html(totalAmt);
                if (totalAmt == 0) {
                    $("#TotalExpAmt_" + i + "").hide();
                    $("#TotalExpName_" + i + "").hide();
                }
            }
        }
    }
    $("#DcrDateTxt_" + selRow + "").val("");
    $("#hdnDcrDate_" + selRow + "").val("");
    $("#DcrFlagTxt_" + selRow + "").val("");
    $("#hdnDcrFlag_" + selRow + "").val("");
    $("#DcrCatTxt_" + selRow + "").val("");
    $("#hdnDcrCat_" + selRow + "").val("");
    $("#ExpTypeTxt_" + selRow + "").val("");
    $("#hdnDcrExp_" + selRow + "").val("");
    $("#ExpAmt_" + selRow + "").val("");
    $("#RefTxt_" + selRow + "").val("");
    $("#RemTxt_" + selRow + "").val("");
    $("#DcrDateTxt_" + selRow + "").attr('disabled', false);
    $("#RefTxt_" + selRow + "").val("").attr('disabled', false);
    $("#RemTxt_" + selRow + "").val("").attr('disabled', false);

}
function FnAddExpense(selRow) {
    debugger;
    var favUserCode = $("#hdnFavouringUserCode").val();
    var DcrDate = $("#unDcrDate_" + selRow + "").html();
    var formattedDate = DcrDate.split('/');
    formattedDate = formattedDate[1] + '/' + formattedDate[0] + '/' + formattedDate[2];
    var DcrFlag = $("#unDcrFlag_" + selRow + "").html();
    var DcrCategory = $("#unDcrCat_" + selRow + "").html();
    var ExpType = $("#unExpType_" + selRow + "").text();
    var ExpCode = $("#hdnUnExpCode_" + selRow + "").val();
    var ExpActAmt = $("#unExpAmt_" + selRow + "").html();
    var ExpAmt = $("#unExpAmt_" + selRow + "").html();
    var DcrStatus = $("#unDcrStatus" + selRow + "").html();
    var rowCount = $(".AprExpRow").length;

    var DcrReference = $("#hdnUnExpRef_" + selRow).val();
    var DcrRemUsr = $("#hdnUnExpRemUsr_" + selRow).val();

    var ExpenseMode = $.grep(AddlExpDetEdit_g, function (element, index) {
        return (element.Expense_Type_Code == ExpCode && element.Expense_Mode.toUpperCase() != "DAILY")
    });
    if (ExpenseMode.length > 0) {
        if (ExpenseMode[0].Expense_Mode != "DAILY") {
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlAprExpArr = [];
            var AddlAprExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible') && $("#AprDcrDate_" + parseInt(i + 1) + "").val() != "") {
                    if (DcrDate != "") {
                        if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == ExpCode && DcrDate == $("#AprDcrDate_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + ExpType + ' Already Claimed For ' + DcrDate + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == ExpCode && DcrDate != $("#AprDcrDate_" + parseInt(i + 1) + "").val()) {
                            ExpAmt = parseFloat(ExpAmt) + parseFloat($("#AprExpAmt_" + parseInt(i + 1) + "").val());
                            isExpRepeated = 1;
                        }
                    }
                }
            }
        }
        if (ExpenseMode[0].Can_Split_Amount == "N") {
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlAprExpArr = [];
            var AddlAprExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible') && $("#AprDcrDate_" + parseInt(i + 1) + "").val() != "") {
                    if (DcrDate != "") {
                        if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == ExpCode) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + ExpType + ' have no split amount');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                    }
                }
            }
        }
    }
    var DailyExpenseMode = $.grep(AddlExpDetEdit_g, function (element, index) {
        return (element.Expense_Type_Code == ExpCode && element.Expense_Mode.toUpperCase() == "DAILY" && element.Expense_Entity.trim() == DcrCategory)
    });
    if (DailyExpenseMode.length > 0) {
        if (DailyExpenseMode[0].Expense_Mode == "DAILY") {
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlAprExpArr = [];
            var AddlAprExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible') && $("#AprDcrDate_" + parseInt(i + 1) + "").val() != "") {
                    if (DcrDate != "") {
                        if ($("#hdnAprExpCode_" + parseInt(i + 1) + "").val() == ExpCode && DcrDate == $("#AprDcrDate_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Additional Claim', '' + ExpType + ' Already Claimed For ' + DcrDate + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                    }
                }
            }
        }
    }
    $.ajax({
        type: 'GET',
        data: "userCode=" + favUserCode + "&DcrDate=" + formattedDate + "&DcrFlag=" + DcrFlag + "&DcrCat=" + DcrCategory + "&DcrExp=" + ExpType + "&DcrExpCode=" + ExpCode + "&DcrAmt=" + ExpAmt,
        url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
        success: function (resp) {
            $("#myModal").modal('hide');
            debugger;
            if (resp.split('^')[0] == "SUCCESS") {
                var content = resp.split('^')[1];
                var IncludeAddlExp = "";
                if ($("#AprDcrDate_" + rowCount + "").val() == "") {

                    $("#AprDcrDate_" + rowCount + "").val(DcrDate).attr('disabled', true);
                    $("#hdnAprDcrDate_" + rowCount + "").val(DcrDate);
                    $("#AprFlag_" + rowCount + "").val(DcrFlag).attr('disabled', true);
                    $("#hdnAprFlag_" + rowCount + "").val(DcrFlag);
                    $("#AprCategory_" + rowCount + "").val(DcrCategory).attr('disabled', true);
                    $("#hdnAprCategory_" + rowCount + "").val(DcrCategory);
                    $("#AprExpType_" + rowCount + "").val(ExpType).attr('disabled', true);
                    $("#hdnAprExpCode_" + rowCount + "").val(ExpCode);
                    $("#AprExpAmt_" + rowCount + "").val(ExpActAmt).attr('disabled', true);
                    $("#AprDcrRef_" + rowCount).val(DcrReference);
                    $("#AprRemarks_" + rowCount).val(DcrRemUsr);
                    //var curr_Amt = $("#txtTotExpenseEdit").val();
                    //var totalAmt = parseFloat(curr_Amt) + parseFloat(ExpActAmt);
                    //$("#txtTotExpenseEdit").val(totalAmt);
                    var totalExpTbl = $(".clsApprExpTypeTotal").length;
                    var isExpAvail = false;
                    for (var i = 0; i < totalExpTbl; i++) {
                        if ($("#ExpenseTypeNameEdit #TotalExpName_" + i + "").html() == ExpType) {
                            var totalAmt = parseFloat($("#TotalExpAmt_" + i + "").html()) + parseFloat(ExpActAmt);
                            $("#ExpenseTypeNameEdit #TotalExpAmt_" + i + "").html(totalAmt);
                            isExpAvail = true;
                            if (totalAmt > 0) {
                                $("#ExpenseTypeNameEdit #TotalExpAmt_" + i + "").show();
                                $("#ExpenseTypeNameEdit #TotalExpName_" + i + "").show();
                            }
                        }
                    }
                    if (!isExpAvail) {
                        var ExpenseContent = "";
                        //ExpenseContent += "<tbody class='TotalExpenseCls'>";
                        ExpenseContent += "<tr id='trApproveExpTypeTotal' class='clsApprExpTypeTotal'>";
                        ExpenseContent += "<td id='TotalExpName_" + parseInt(totalExpTbl) + "'>" + ExpType + "</td>";
                        ExpenseContent += "<td id='TotalExpAmt_" + parseInt(totalExpTbl) + "'>" + ExpActAmt + "</td>";
                        ExpenseContent += "</tr>";//</tbody>";
                        $("#ExpenseTypeNameEdit #tbltotalExpenseEntry tbody").append(ExpenseContent);
                    }
                    fnMsgAlert('success', 'Expense Additional Claim', content);
                    var Curr_Amt = 0;//$("#txtTotExpenseEdit").val();
                    $('#ExpenseTypeNameEdit #tbltotalExpenseEntry tbody tr').map(function () {
                        var amount = $(this).children()[1].textContent;
                        Curr_Amt = Curr_Amt + parseInt(amount);
                    })
                    //Curr_Amt = parseFloat(Curr_Amt) + parseFloat(dcrexpamt);
                    $("#txtTotExpenseEdit").val(Curr_Amt);
                    return false;
                }
                else {
                    var doubleAddCheck = true;
                    var TotalRow = $('.AprExpRow').length;
                    var SelectedRow = $('.AprExpRow:visible').length;
                    AddlAprExpArr = [];
                    var AddlAprExpObj = "";
                    var j = 0;
                    for (var i = 0; i < TotalRow; i++) {
                        if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible')) {
                            if (DcrDate == $("#hdnAprDcrDate_" + parseInt(i + 1) + "").val()
                                && DcrFlag == $("#hdnAprFlag_" + parseInt(i + 1) + "").val()
                                && DcrCategory == $("#AprCategory_" + parseInt(i + 1) + "").val()
                                && ExpCode == $("#hdnAprExpCode_" + parseInt(i + 1) + "").val()) {
                                fnMsgAlert('info', 'Expense Additional Claim', 'Expense already added');
                                doubleAddCheck = false;
                            }
                        }
                    }
                    if (doubleAddCheck) {
                        IncludeAddlExp += "<tr id='AprExpRowId_" + parseInt(rowCount + 1) + "' class='AprExpRow'>";
                        IncludeAddlExp += "<td><input type='text' class='form-control AutoAprDcrDate' id='AprDcrDate_" + parseInt(rowCount + 1) + "' onblur ='fnValidateAutofill(this," + 'AutoComplete_AprDcrDate' + ",\"AprDcrDate\",\"hdnAprDcrDate\");fnGetDcrFlagEdit(1);' value='" + DcrDate + "' /><input id='hdnAprDcrDate_" + parseInt(rowCount + 1) + "' type='hidden' value='" + DcrDate + "' /></td>";
                        IncludeAddlExp += "<td><input type='text' class='form-control AutoAprDcrFlag' id='AprFlag_" + parseInt(rowCount + 1) + "' value='" + DcrFlag + "' /><input type='hidden' id='hdnAprFlag_" + parseInt(rowCount + 1) + "' onblur ='fnValidateAutofill(this," + 'autoComplete_DcrFlag_Edit' + ",\"AprDcrDate\",\"hdnAprDcrDate\");fnGetDcrCategoryEdit(1);' value='" + DcrFlag + "'/></td>";
                        IncludeAddlExp += "<td><input type='text' class='form-control AutoAprDcrCat' id='AprCategory_" + parseInt(rowCount + 1) + "' value='" + DcrCategory + "' /><input id='hdnAprCategory_" + parseInt(rowCount + 1) + "' type='hidden' value='" + DcrCategory + "'/></td>";
                        IncludeAddlExp += "<td><input type='text' id='AprExpType_" + parseInt(rowCount + 1) + "' onclick='fnGetDcrExpenseEdit(1)' value='" + ExpType + "' /><input type='hidden' style='width:91px;' id='hdnAprExpCode_" + parseInt(rowCount + 1) + "' value='" + ExpCode + "' /></td>";
                        IncludeAddlExp += "<td><input type='text' id='AprExpAmt_" + parseInt(rowCount + 1) + "' value='" + ExpActAmt + "' disabled/></td>";
                        IncludeAddlExp += "<td><input type='text' id='AprDcrRef_" + parseInt(rowCount + 1) + "' value='" + DcrReference + "' /></td>";
                        IncludeAddlExp += "<td><input type='text' id='AprRemarks_" + parseInt(rowCount + 1) + "' value='" + DcrRemUsr + "' /></td>";
                        IncludeAddlExp += "<td><a style='cursor:pointer;' onclick='fnAddlAprExpRow(" + parseInt(rowCount + 1) + ")'><i class='fa fa-plus' style='font-size:18px;color:green;'>";
                        IncludeAddlExp += "</i></a>&nbsp;&nbsp;<a style='cursor:pointer;' onclick='fnClrAddlExpRow(" + parseInt(rowCount + 1) + ")'><i class='fa fa-remove' style='font-size:18px;color:red;'>";
                        IncludeAddlExp += "</i></a></td></tr>";
                        $("#AddlExpBdy").append(IncludeAddlExp);
                        //var curr_Amt = $("#txtTotExpenseEdit").val();
                        //var totalAmt = parseFloat(curr_Amt) + parseFloat(ExpActAmt);
                        //$("#txtTotExpenseEdit").val(totalAmt);

                        var totalExpTbl = $(".clsApprExpTypeTotal").length;
                        var isExpAvail = false;
                        for (var i = 0; i < totalExpTbl; i++) {
                            if ($("#ExpenseTypeNameEdit #TotalExpName_" + i + "").html() == ExpType) {
                                var totalAmt = parseFloat($("#TotalExpAmt_" + i + "").html()) + parseFloat(ExpActAmt);
                                $("#ExpenseTypeNameEdit #TotalExpAmt_" + i + "").html(totalAmt);
                                isExpAvail = true;
                                if (totalAmt > 0) {
                                    $("#ExpenseTypeNameEdit #TotalExpAmt_" + i + "").show();
                                    $("#ExpenseTypeNameEdit #TotalExpName_" + i + "").show();
                                }
                            }
                        }
                        if (!isExpAvail) {
                            var ExpenseContent = "";
                            //ExpenseContent += "<tbody class='TotalExpenseCls'>";
                            ExpenseContent += "<tr id='trApproveExpTypeTotal' class='clsApprExpTypeTotal'>";
                            ExpenseContent += "<td id='TotalExpName_" + parseInt(totalExpTbl) + "'>" + ExpType + "</td>";
                            ExpenseContent += "<td id='TotalExpAmt_" + parseInt(totalExpTbl) + "'>" + ExpActAmt + "</td>";
                            ExpenseContent += "</tr>";//</tbody>";
                            $("#ExpenseTypeNameEdit #tbltotalExpenseEntry tbody").append(ExpenseContent);
                        }
                        var Curr_Amt = 0;//$("#txtTotExpenseEdit").val();
                        $('#ExpenseTypeNameEdit #tbltotalExpenseEntry tbody tr').map(function () {
                            var amount = $(this).children()[1].textContent;
                            Curr_Amt = Curr_Amt + parseInt(amount);
                        })
                        //Curr_Amt = parseFloat(Curr_Amt) + parseFloat(dcrexpamt);
                        $("#txtTotExpenseEdit").val(Curr_Amt);
                        fnMsgAlert('success', 'Expense Additional Claim', content);
                    }
                }

            }
            else {
                var content = resp.split('^')[1];
                fnMsgAlert('error', 'Expense Additional Claim', content);
                return false;
            }
        },
        error: function () {

        },
        complete: function () {

        }
    });
}
function fnAddlAprExpRow(selRow) {
    if (selRow == 0) {
        $('#AddlExpBdy').empty();
    }
    if ($(".AprExpRow").length == selRow) {
        if (selRow != 0) {
            if ($("#AprDcrDate_" + selRow + "").val() == "") {
                fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Date for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if ($("#hdnAprDcrDate_" + selRow + "").val() == "") {
                fnMsgAlert('info', 'Expense Additional Claim', 'Select Valid Dcr Date for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if ($("#AprFlag_" + selRow + "").val() == "") {
                $("#myModal").modal('hide');
                fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Flag for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if ($("#hdnAprFlag_" + selRow + "").val() == "") {
                $("#myModal").modal('hide');
                fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Dcr Flag for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if ($("#AprCategory_" + selRow + "").val() == "") {
                $("#myModal").modal('hide');
                fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Category for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if ($("#hdnAprCategory_" + selRow + "").val() == "") {
                $("#myModal").modal('hide');
                fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Dcr Category for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if ($("#AprExpType_" + selRow + "").val() == "") {
                fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Type for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if ($("#hdnAprExpCode_" + selRow + "").val() == "") {
                fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Expense Type for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if ($("#AprExpAmt_" + selRow + "").val() == "") {
                fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Amount for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
            else if (/^[0-9]+([.][0-9]+)?$/g.test($("#AprExpAmt_" + selRow + "").val()) == false) {
                fnMsgAlert('info', 'Expense Additional Claim', 'Please enter Integer Value in Expense Amount for Row ' + selRow + '');
                $("#main").unblock();
                HideModalPopup("dvloading");
                return false;
            }
        }
        selRow = $(".AprExpRow").length;
        var insertRow = "";
        insertRow += "<tr id='AprExpRowId_" + parseInt(selRow + 1) + "' class='AprExpRow'>";
        insertRow += "<td><input type='text' class='form-control AutoAprDcrDate' id='AprDcrDate_" + parseInt(selRow + 1) + "' onblur ='fnValidateAutofill(this," + 'AutoComplete_AprDcrDate' + ",\"AprDcrDate\",\"hdnAprDcrDate\");fnGetDcrFlagEdit(" + parseInt(selRow + 1) + ");' value='' autocomplete='off' /><input id='hdnAprDcrDate_" + parseInt(selRow + 1) + "' type='hidden' value='' /></td>";
        insertRow += "<td><input type='text' class='form-control AutoAprDcrFlag' id='AprFlag_" + parseInt(selRow + 1) + "' onblur ='fnValidateAutofill(this," + 'autoComplete_DcrFlag_Edit' + ",\"AprFlag\",\"hdnAprFlag\");fnGetDcrCategoryEdit(" + parseInt(selRow + 1) + ");' value='' autocomplete='off' disabled/><input type='hidden' id='hdnAprFlag_" + parseInt(selRow + 1) + "'  value=''/></td>";
        insertRow += "<td><input type='text' class='form-control AutoAprDcrCat' id='AprCategory_" + parseInt(selRow + 1) + "' value='' disabled/><input id='hdnAprCategory_" + parseInt(selRow + 1) + "' type='hidden' value='' autocomplete='off'/></td>";
        insertRow += "<td><input type='text' id='AprExpType_" + parseInt(selRow + 1) + "' onclick='fnGetDcrExpenseEdit(" + parseInt(selRow + 1) + ")' value='' disabled/><input type='hidden' style='width:91px;' id='hdnAprExpCode_" + parseInt(selRow + 1) + "' value='' /></td>";
        insertRow += "<td><input type='text' id='AprExpAmt_" + parseInt(selRow + 1) + "' value='' disabled/></td>";
        insertRow += "<td><input type='text' id='AprDcrRef_" + parseInt(selRow + 1) + "' value='' /></td>";
        insertRow += "<td><input type='text' id='AprRemarks_" + parseInt(selRow + 1) + "' value='' /></td>";
        insertRow += "<td><a style='cursor:pointer;' onclick='fnAddlAprExpRow(" + parseInt(selRow + 1) + ")'><i class='fa fa-plus' style='font-size:18px;color:green;'>";
        insertRow += "</i></a>&nbsp;&nbsp;<a onclick='fnClrAddlExpRow(" + parseInt(selRow + 1) + ")' style='cursor:pointer;'><i class='fa fa-remove' style='font-size:18px;color:red;'>";
        insertRow += "</i></a></td></tr>";
        $("#AddlExpBdy").append(insertRow);
        autoComplete(AutoComplete_AprDcrDate, "AprDcrDate", "hdnAprDcrDate", "AutoAprDcrDate");
    }
}
function fnClrAddlExpRow(selRow) {
    if ($("#AprExpAmt_" + selRow + "").val() != "") {

        var curr_Amt = $("#txtTotExpenseEdit").val();
        var totalAmt = parseFloat(curr_Amt) - parseFloat($("#AprExpAmt_" + selRow + "").val());
        $("#txtTotExpenseEdit").val(totalAmt);
        var totalExpTbl = $(".clsApprExpTypeTotal").length;
        var isExpAvail = false;
        for (var i = 0; i < totalExpTbl; i++) {
            if ($("#TotalExpName_" + i + "").html() == $("#AprExpType_" + selRow + "").val()) {
                var totalAmt = parseFloat($("#TotalExpAmt_" + i + "").html()) - parseFloat($("#AprExpAmt_" + selRow + "").val());
                $("#TotalExpAmt_" + i + "").html(totalAmt);
                isExpAvail = true;
                if (totalAmt == 0) {
                    $("#TotalExpAmt_" + i + "").hide();
                    $("#TotalExpName_" + i + "").hide();
                }
            }
        }
    }
    $("#AprDcrDate_" + selRow + "").val("").attr('disabled', false);
    $("#hdnAprDcrDate_" + selRow + "").val("");
    $("#AprFlag_" + selRow + "").val("");
    $("#hdnAprFlag_" + selRow + "").val("");
    $("#AprCategory_" + selRow + "").val("");
    $("#hdnAprCategory_" + selRow + "").val("");
    $("#AprExpType_" + selRow + "").val("");
    $("#hdnAprExpCode_" + selRow + "").val("");
    $("#AprExpAmt_" + selRow + "").val("");
    $("#AprDcrRef_" + selRow + "").val("");
    $("#AprRemarks_" + selRow + "").val("");
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
/// DCR Attachment changes/////////////////

function fngetdcrExpenseUrl(month, year, claimFavouringUser, mode) {
    $.ajax({
        type: 'GET',
        data: "userCode=" + claimFavouringUser + "&month=" + month + "&year=" + year + "&Effective_from=''&Effective_to=''",
        url: "../HiDoctor_Activity/ExpenseClaim/fngetdcrExpenseUrl",
        success: function (resp) {
            debugger;
            dcrattachment = resp;
            if (mode == 'Entry') {
                if (resp.length > 0) {
                    var tbl = '<table class="table table-striped" id="dcrattachement" style="max-height: 528px;overflow: scroll;"><thead><th></th><th>DCR Date</th><th>URL Name</th><th>Preview</th></thead><tbody>';
                    for (var i = 0; i < resp.length; i++) {
                        tbl += '<tr><td><input type="checkbox" id="chec_' + i + '" value="' + i + '" onclick="fncheckimage(' + i + ');"></td>';
                        tbl += '<td>' + resp[i].DCR_Date + '</td>';
                        tbl += '<td>' + resp[i].Uploaded_File_Name + '</td>';
                        tbl += '<td><a href="' + resp[i].Blob_Url + '" target="_blank"  class="btn btn-info">Preview</a></td></tr>';
                    }
                    tbl += '</tbody></table>'
                }
                else {
                    tbl = '<label>No Record Found</label>'
                }
                $('#BindDCRURL').html(tbl);
            }
            else {

                if (resp.length > 0) {
                    var tbl = '<table class="table table-striped" id="dcrattachement" style="max-height: 528px;overflow: scroll;"><thead><th></th><th>DCR Date</th><th>URL Name</th><th>Preview</th></thead><tbody>';
                    for (var i = 0; i < resp.length; i++) {
                        var Setails = $.grep(Edituploadeddetails, function (element, index) {
                            return (element.Img_ID === resp[i].ID)
                        });
                        if (Setails.length > 0 && resp[i].ID != 0) {
                            tbl += '<tr><td><input type="checkbox" id="chec_' + i + '" value="' + i + '" checked onclick="fncheckimage(' + i + ');"></td>';
                        }
                        else {
                            tbl += '<tr><td><input type="checkbox" id="chec_' + i + '" value="' + i + '"  onclick="fncheckimage(' + i + ');"></td>';
                        }

                        tbl += '<td>' + resp[i].DCR_Date + '</td>';
                        tbl += '<td>' + resp[i].Uploaded_File_Name + '</td>';
                        tbl += '<td><a href="' + resp[i].Blob_Url + '" target="_blank"  class="btn btn-info">Preview</a></td></tr>';
                    }
                    tbl += '</tbody></table>'
                }
                else {
                    tbl = '<label>No Record Found</label>'
                }
                $('#BindDCRURLEdit').html(tbl);
            }
        },
        error: function (ex) {

        }
    });

}
function fncheckimage(id) {
    debugger;
    if ($("#chec_" + id).prop("checked") == false) {
        var MyArray = dcrattachment[id].Blob_Url + "#" + dcrattachment[id].Uploaded_File_Name + "#" + dcrattachment[id].ID;
        var arrayindex = uploadFileName.indexOf(MyArray)
        uploadFileName.splice(arrayindex, 1);
    }
}
function fnshowurl(mode) {
    if (mode == 'Entry')
        $('#DCRURL').modal('show');
    else
        $('#DCRURLEdit').modal('show');
}
function fnattchement(mode) {
    debugger;
    $('#attsave').attr("disabled", true);
    $("#dcrattachement input[type=checkbox]:checked").map(function (i, e) {
        var id = $(this).val();
        var MyArray = dcrattachment[id].Blob_Url + "#" + dcrattachment[id].Uploaded_File_Name + "#" + dcrattachment[id].ID;
        if (uploadFileName.indexOf(MyArray) == -1) {
            uploadFileName.push(MyArray);
        }


    })
    $("#attachment1").empty();
    $("#attachment").empty();
    var attachment = "";
    var choose = "";

    attachment += "<table class='table table-hover tblattachment' >";
    //attachment += "<thead>";
    var valdelete = "delete1"
    for (var i = 0; i < uploadFileName.length; i++) {
        attachment += "<tr><td>Attachment " + [i + 1] + ":</td><td>" + uploadFileName[i].split("#")[1] + "</td><td><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + ", 1)' /><input type='hidden' id='dcrid_" + i + "' value='" + uploadFileName[i].split("#")[2] + "'/></td></tr>";
    }
    //attachment += "</thead>";
    attachment += "</table>";

    choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
    if (mode == 'Entry') {
        $("#attachment").html(attachment);
    }
    else {
        $("#stable").html('');
        $("#stable").html(attachment);
    }

    $("#uploadfile").html('');
    $("#uploadfile").html(choose);
    $("#attachment").unblock();
    $("#btupload").show();
    $('#DCRURL').modal('hide');
    $('#DCRURLEdit').modal('hide');
    $('#attsave').attr("disabled", false);
}
