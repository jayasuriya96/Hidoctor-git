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
var customerStockJSONPreffill = new Array();
var CRMCustomerAndProductsJson = "";
var AutoComplete_DcrDate = "";
var AutoComplete_Ovr_DcrFlag = "";
var AutoComplete_Dcr_Category = "";
var uploadFileName = new Array();
var autoComplete_DcrExp = "";
var ExpenseClaimUser = "";
var fromMonth = "";
var ToMonth = "";
var dcrFromEdit = "";
var dcrToEdit = "";
var dcrFromEditDate = "";
var dcrToEditDate = "";
var lstUserDetails = "";
var UserPreDropdown = "";
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
//dEntry += "<td><div id=dvbutton_1><input type='button' id='btnSaveOrEdit' class='btn btn-primary autoCust' value='Save Stockiest' onclick='StockiestPopup(1);'/> <input type='hidden' id='hdn_StockiestProductJson_1'/>";
dEntry += "<td><div id=dvbutton_1><input type='button' id='btnSaveOrEdit' class='btn btn-primary autoCust' value='Save Stockiest' onclick='StockiestPopup(1);'/><input type='hidden' id='hdn_StockiestProductJson_1'/></div>";
dEntry += "</tr><tr>";
dEntry += "<td><input type='text' id='txtDCust_2' class='input-large form-control autoCust' /><input type='hidden' id='hdnDCust_2' /></td>";
dEntry += "<td><input type='text' id='txtDExp_2' class='input-mini form-control docExp' /></td>";
dEntry += "<td><input type='text' id='txtDPresent_2' class='input-large form-control checkexpnumeric' /></td>";
dEntry += "<td><input type='text' id='txtDPotential_2' class='input-large form-control checkexpnumeric' /></td>";
dEntry += "<td><input type='text' id='txtDBillNumber_2' class='input-large form-control' /></td>";
dEntry += "<td><textarea id='txtDUserRemarks_2' class='form-control'></textarea></td>";
dEntry += "<td><div id=dvbutton_2><input type='button' id='btnSaveOrEdit' class='btn btn-primary autoCust' value='Save Stockiest' onclick='StockiestPopup(2);'/><input type='hidden' id='hdn_StockiestProductJson_2'/></div>";
dEntry += "</tr></tbody></table></div><div style='clear: both;'></div>";

var dRow = "<tr>";
dRow += "<td><input type='text' id='txtDCust_DNUM' onBlur='fnCheckCustomerVailabilty(DNUM)' class='input-large form-control autoCust' /><input type='hidden' id='hdnDCust_DNUM' /></td>";
dRow += "<td><input type='text' id='txtDExp_DNUM' class='input-mini form-control docExp' /></td>";
dRow += "<td><input type='text' id='txtDPresent_DNUM' class='input-large form-control checkexpnumeric' /></td>";
dRow += "<td><input type='text' id='txtDPotential_DNUM' class='input-large form-control checkexpnumeric' /></td>";
dRow += "<td><input type='text' id='txtDBillNumber_DNUM' class='input-large form-control' /></td>";
dRow += "<td><textarea id='txtDUserRemarks_DNUM' class='form-control'></textarea></td>";
dRow += "<td><div id=dvbutton_DNUM><input type='button' id='btnStockiest_DNUM' class='btn btn-primary autoCust' value='Save Stockiest' onclick='StockiestPopup(DNUM);'/><input type='hidden' id='hdn_StockiestProductJson_DNUM'/></div>";
dRow += "</tr>";

var dRowEdit = "<tr>";
dRowEdit += "<td><input type='text' id='txtEDCust_DNUM' class='input-large form-control autoCustEdit' /><input type='hidden' id='hdnDCust_DNUM' /></td>";
dRowEdit += "<td><input type='text' id='txtEDExp_DNUM' class='input-mini form-control docExpEdit' /></td>";
dRowEdit += "<td id='spnEDDeduction_DNUM'>0.00</td>";
dRowEdit += "<td id='spnEDApproved_DNUM'>0.00</td>";
dRowEdit += "<td><input type='text' id='txtEDPresent_DNUM' class='input-large form-control checkexpnumericEdit' /></td>";
dRowEdit += "<td><input type='text' id='txtEDPotential_DNUM' class='input-large form-control checkexpnumericEdit' /></td>";
dRowEdit += "<td><input type='text' class='form-control' id='txtEDBillNumber_DNUM'/></td>";
dRowEdit += "<td><textarea id='txtEDUserRemarks_DNUM' class='form-control'></textarea></td>";
dRowEdit += "<td><input type='hidden' id='hdn_StockiestProductJson_DNUM'><span></span></td>";
dRowEdit += "<td><input type='button' class='btn btn-primary autoCust' value='Save Stockiest' onclick='StockiestPopup(DNUM);'>";
dRowEdit += "<td></td></tr>";


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
        },
        error: function () {

        },
    });
}
function fnLoadloggeduserData() {
    $.ajax({
        type: 'POST',
        data: "a",
        url: '../HiDoctor_Activity/ExpenseClaim/ExpenseClaimFormLoadValues',
        success: function (response) {
            var jData = response;
            lstUserDetails = jData[1].Data;
            fnBindSyncfusionGridforSearchUser();
            Userdropdown.enabled = false;
            //fnSearchExp();
        },
        error: function () {

        },
    });
}
function fnBindRequestAndFavouringUser() {
    debugger;
    $('#dvEdit').hide();
    $.ajax({
        type: 'POST',
        data: "a",
        url: '../HiDoctor_Activity/ExpenseClaim/ExpenseClaimFormLoadValues',
        success: function (response) {
            debugger;
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
                                $("#ddlRequest").append("<option selected='selected'  value=" + jData[0].Data[i].Request_Code + ">" + jData[0].Data[i].Request_Name + "</option>");
                            }
                            else {
                                $("#ddlRequest").append("<option  value=" + jData[0].Data[i].Request_Code + ">" + jData[0].Data[i].Request_Name + "</option>");
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
                        if ($("#ddlFavouringUser").val() != -1) {
                            if ((favouringuser_g == null || favouringuser_g.length == 0)) {
                                //$("#ddlFavouringUser").val("");
                                ddlRequest_onChange();
                            }
                            else {
                              ddlRequest_onChange();
                            }
                        }
                    }
                    else {
                        $("#dvFavouringUser").css('display', 'none');
                    }

                }
            }
            fnSearchExp();
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
            //fnSearchExp();
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
            debugger;
          
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
function fnBindExpenseClaimSummary() {
    debugger;
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

function fnExpenseDownloadImage(imageUrl) {
    debugger;
    var Urls = imageUrl.split("^");


    if (Urls.length == 1) {
        var link = document.createElement('a');

        link.setAttribute('download', null);
        link.style.display = 'none';

        document.body.appendChild(link);
        for (var i = 0; i < Urls.length; i++) {
            link.setAttribute('href', Urls[i]);
            link.click();
        }
        document.body.removeChild(link);
    }
    else {
        var ExpAttStr = "";
        ExpAttStr += "<ol>";
        for (var i = 0; i < Urls.length; i++) {
            var lastUrl = Urls[i].substring(Urls[i].lastIndexOf("/") + 1, Urls[i].length);
            ExpAttStr += "<li><a href='" + Urls[i] + "' target='_blank'>" + lastUrl + "</li>";
        }
        ExpAttStr += "</ol>";
        $("#ExpContent").html(ExpAttStr);
        $("#AttModal").modal();
    }

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

function fnGetPrivilegeforExpense() {
    debugger;
    var favoringUserCode_lcl = "";
    if (favouringuser_g != "") {
        favoringUserCode_lcl = favouringuser_g;
    }
    else {
        favoringUserCode_lcl = $('select[name="ddlFavouringUser"]').val();
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
                    var now = new Date();
                    var prevMonthLastDate = new Date(now.getFullYear(), now.getMonth(), 0);
                    var prevMonthFirstDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, 1);

                    var formatDateComponent = function (dateComponent) {
                        return (dateComponent < 10 ? '0' : '') + dateComponent;
                    };

                    var formatDate = function (date) {
                        return formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
                    };
                    $("#txtFromDate").val(formatDate(prevMonthFirstDate));
                    $("#txtToDate").val(formatDate(prevMonthLastDate));
                    $('#dvDCRDates').show();
                    HideModalPopup("dvloading");
                }
                else {
                    var request = $("#ddlRequest").val();
                    HideModalPopup("dvloading");
                    favoringUserCode = "";
                    $('#main').load('HiDoctor_Activity/ExpenseClaim/ExpenseClaimMonthRequest?request=' + request + "&favouringUser=" + favoringUserCode_lcl);

                }
            }

        },
        error: function (e) {

            fnMsgAlert("info", "Expense Claim", "There is some issue. Please contact support team.");
            HideModalPopup("dvloading");
        }
    });

}



function ddlRequest_onChange() {
    debugger;
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
                debugger;
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
                    //    }o

                    //}
                    var requestType = fnGetExpenseRequesttype(requestCode);

                    if (requestType.toUpperCase() == "REGION WISE") { // Field Expense 
                        $(".dvDCRDates").css('display', '');
                        $("#dvDoctorCRMButton").css('display', 'none');
                        $("#txtTotExpense").val("0.00");
                        $("#dvTotExp").css('display', '');
                        $("#dvDetailEntry").empty();
                        //  $("#ddlFavouringUser").val("");
                        $("#txtFromDate").val("");
                        $("#txtToDate").val("");
                        $("#txtRemarks").val("");
                    }
                    else if (requestType.toUpperCase() == "CUSTOMER WISE") { // Doctor CRM
                        $(".dvDCRDates").css('display', 'none');
                        $("#dvDoctorCRMButton").css('display', '');
                        $("#txtTotExpense").val("0.00");
                        $("#dvTotExp").css('display', '');
                        $("#dvDetailEntry").empty();
                        $("#ddlFavouringUser").val("");
                        $("#txtFromDate").val("");
                        $("#txtToDate").val("");
                        $("#txtRemarks").val("");

                    }
                    else if ($("#ddlRequest").val() != "") { // others
                        $(".dvDCRDates").css('display', 'none');
                        $("#dvNew").css('display', 'none');
                        $("#dvDoctorCRMButton").css('display', 'none');
                        $("#txtTotExpense").val("0.00");
                        $("#dvTotExp").css('display', 'none');
                        $("#dvDetailEntry").empty();
                        //   $("#ddlFavouringUser").val("");
                        $("#txtFromDate").val("");
                        $("#txtToDate").val("");
                        $("#txtRemarks").val("");

                    }
                }
                else {
                    fnMsgAlert('info', 'Expense Claim Request', 'Since, status cycle mapping is missing for ' + $("#ddlRequest :selected").text() + ' you cannot apply claim for ' + $("#ddlRequest :selected").text());
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
        $("#dvDoctorCRMButton").css('display', 'none');
        $("#dvNew").css('display', 'none');
        $("#txtTotExpense").val("0.00");
        $("#dvTotExp").css('display', '');
        $("#dvDetailEntry").empty();
        //$("#ddlFavouringUser").val("");
        $("#txtFromDate").val("");
        $("#txtToDate").val("");
        $("#txtRemarks").val("");
        $("#hdnMainStatusCode").val("");
    }
}

function fnGetExpenseRequesttype(val) {
    debugger;
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
//$("#ddlFavouringUser").unbind("change").bind("change", function () {  });
function ddlFavouringUser_OnChange() {
    debugger;
    $("#dvDetailEntry").empty();
    $("#dvExpFooter").css("display", "none");
    $("#dvNew").css("display", "none");
    $("#txtTotExpense").val("0.00");
    $("#dvTotExpTypeWise").hide();
    var requestCode = $("#ddlRequest").val().split('_')[0];
    var requestType = fnGetExpenseRequesttype(requestCode)
    if (requestType.toUpperCase() == "REGION WISE") {
        fnGetPrivilegeforExpense();
    }
    if (SelFavUser_g != $("#ddlFavouringUser").val() == null ? "" : $("#ddlFavouringUser").val()) {
        //favouringuser_g = "";
        fnBindRequestAndFavouringUserSel('');
    }
    else {
        ddlRequest_onChange();
    }
    //fnGetPrivilegeforExpense();
}
function ddlFavouringUserSel_OnChange() {
    debugger;
    $("#dvDetailEntry").empty();
    $("#dvExpFooter").css("display", "none");
    $("#dvNew").css("display", "none");
    $("#txtTotExpense").val("0.00");
    $("#dvTotExpTypeWise").hide();
    var requestCode = $("#ddlRequest").val().split('_')[0];
    var requestType = fnGetExpenseRequesttype(requestCode)
    if (requestType.toUpperCase() == "REGION WISE") {
        fnGetPrivilegeforExpense();
    }
    //fnGetPrivilegeforExpense();
}

$("#txtFromDate").change(function () {
    $("#dvDetailEntry").empty();
    $("#dvExpFooter").css("display", "none");
    $("#dvNew").css("display", "none");
    $("#txtTotExpense").val("0.00");
    $("#dvTotExpTypeWise").hide();
});

$("#txtToDate").change(function () {
    $("#dvDetailEntry").empty();
    $("#dvExpFooter").css("display", "none");
    $("#dvNew").css("display", "none");
    $("#txtTotExpense").val("0.00");
    $("#dvTotExpTypeWise").hide();
});

$("#advEntryTab").click(function () {
    debugger;
    fnLoadBody("HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest");
    //fnCancelExpense();
    //fnCancelExpenseEdit();
});

function fnCancelExpense_redirect() {
    fnLoadBody("HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest");
}
// FIELD

function fnShowDCRExpenseDetails() {
    debugger;
    $('#dvClaimDetails').html("");
    $("#dvDetailEntry").empty();
    fnClear();
    if ($.trim($("#txtFromDate").val()) == "") {
        fnMsgAlert('info', 'Expense Claim Request', 'Please select DCR Date From.');
        return false;
    }
    if ($.trim($("#txtToDate").val()) == "") {
        fnMsgAlert('info', 'Expense Claim Request', 'Please select DCR Date To.');
        return false;
    }

    var claimRequestCode = $("#ddlRequest").val();
    var claimFavouringUser = $('select[name="ddlFavouringUser"]').val()

    if (claimRequestCode == "") {
        fnMsgAlert("info", "Expense Claim", "Please select request.");
        return false;
    }

    if (claimFavouringUser == "-1") {
        fnMsgAlert("info", "Expense Claim", "Please select Favouring user.");
        return false;
    }
    claimRequestCode = claimRequestCode.split('_')[0];
    claimFavouringUser = $('select[name="ddlFavouringUser"]').val()

    var result = false;
    result = fnRequestValidation(claimRequestCode, claimFavouringUser);
    if (result) {
        var dcrFrom = $("#txtFromDate").val().split('/')[2] + '-' + $("#txtFromDate").val().split('/')[1] + '-' + $("#txtFromDate").val().split('/')[0];
        var dcrTo = $("#txtToDate").val().split('/')[2] + '-' + $("#txtToDate").val().split('/')[1] + '-' + $("#txtToDate").val().split('/')[0];

        var sDate = new Date(dcrFrom);
        var eDate = new Date(dcrTo);
        if (sDate > eDate) {
            fnMsgAlert('info', 'Expense Claim Request', 'End date can not be less than Start date.');
            return false;
        }

        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });


        $.ajax({
            type: 'POST',
            data: "userCode=" + $('select[name="ddlFavouringUser"]').val() + "&dcrFrom=" + dcrFrom + "&dcrTo=" + dcrTo,
            url: '../HiDoctor_Activity/ExpenseClaim/GetFieldExpenseEntryTableString',
            async: false,
            success: function (response) {
                if (response != "" && response != null) {
                    if (response.split('^')[0] != "FAIL") {
                        debugger;
                        fromMonth = dcrFrom.split('-')[1];
                        ToMonth = dcrTo.split('-')[1];
                        if (fromMonth == ToMonth) {
                            IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                            if (IsAddlExpense.toUpperCase() == 'YES') {
                                debugger;
                                fnAddlDcrExpDet(dcrFrom, dcrTo, true);
                            }
                        }
                        else {
                            $("#AddlExpense").hide();
                        }
                        if (response.indexOf('No Expense Details are available for this Date period.') == -1) {
                            $("#dvExpFooter").css("display", "");
                            $("#dvNew").css("display", "");
                        }
                        else {
                            $("#dvExpFooter").css("display", "none");
                            $("#dvNew").css("display", "none");
                        }
                        $("#dvDetailEntry").html(response);
                        $("#spnfavouringUser").html("");
                        $("#spnfavouringUser").html($("#ddlFavouringUser :selected").val());
                        fnCalculateTotalForFieldExpense();
                        fngetdcrExpenseUrl(dcrFrom, dcrTo, $('select[name="ddlFavouringUser"]').val(), 'Entry');
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
    else {


        return false;
    }
   // fngetdcrExpenseUrl(month, year, claimFavouringUser);
}


function fnRequestValidation(claimRequestCode, claimFavouringUser) {
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
    else if ($('.AddlExpCls:visible').length > 0) {
        fnCalculateTotalForFieldExpense();
    }
    else {
        $("#txtTotExpense").val("0.00");
        //$("#ExpenseTypeName").html("");
        //$("#dvTotExpTypeWise").hide();
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
    $("input:checkbox[name=checkedExpense]:checked").each(function () {
        var rowNo = this.id.split('_')[1];
        totalExpense += parseFloat($("#tdExpAmount_" + rowNo).html());
        expenseTypeName = $("#tdExpTypeName_" + rowNo).html();

        selectedExpenseTypeName.push(expenseTypeName);
    });

    var AddlExpTypeName = "";
    var IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
    if (IsAddlExpense == "YES") {
        var TotalRow = $('.AddlExpCls').length;
        var SelectedRow = $('.AddlExpCls:visible').length;
        for (var i = 0; i < TotalRow; i++) {
            if ($('#ExpRow_' + parseInt(i + 1) + '').is(':visible')) {
                if ($("#ExpAmt_" + parseInt(i + 1) + "").val() != "") {
                    totalExpense += parseFloat($("#ExpAmt_" + parseInt(i + 1) + "").val());
                    AddlExpTypeName = $("#ExpTypeTxt_" + parseInt(i + 1)).val();
                    selectedExpenseTypeName.push(AddlExpTypeName);
                }
            }
        }
    }
    var expenseTypeUniqueValues = fnGetUniqueValues(selectedExpenseTypeName);
    uniqueExpenseTypeName.push(expenseTypeUniqueValues);
    debugger;
    $("#txtTotExpense").val(totalExpense.toFixed(2));
    var tableContent = "";
    var choosebutton = "";
    tableContent += "<table class='table table-striped'>";
    tableContent += "<thead style= background:#428bca;color: #fff;>";
    tableContent += "<tr>";
    tableContent += "<td style='font-weight: bold;'>Expense Type Name</td>";
    tableContent += "<td style='font-weight: bold;'>Amount</td>";
    tableContent += "</tr>";
    tableContent += "</thead>";
    choosebutton += "<input type='file' value='ChooseFile' id='ChooseFile'  />";
    for (var i = 0; i < uniqueExpenseTypeName[0].length; i++) {
        typewiseExpense = 0.0;
        tableContent += "<tr class='ExpenseTotCls'><td id='ExpenseTotalName_" + parseInt(i + 1) + "' style='font-weight: bold;'>" + uniqueExpenseTypeName[0][i] + "</td>";
        var expLen = $("input[Exp_Code='" + uniqueExpenseTypeName[0][i] + "']:checked").length;
        for (var r = 0; r < expLen; r++) {
            typewiseExpense += parseFloat($($("input[Exp_Code='" + uniqueExpenseTypeName[0][i] + "']:checked")[r]).val().split('_').reverse()[0]);
        }
        tableContent += "<td><span id='ExpenseTotalVal_" + parseInt(i + 1) + "'>" + typewiseExpense + "</span><td></tr>";
    }
    tableContent += "</table>";

    $("#ExpenseTypeName").html(tableContent);

    var TotalRow = $('.AddlExpCls').length;
    var SelectedRow = $('.AddlExpCls:visible').length;
    for (var i = 0; i < TotalRow; i++) {
        if ($('#ExpRow_' + parseInt(i + 1) + '').is(':visible')) {
            var expenseTypeName = $("#ExpTypeTxt_" + parseInt(i + 1) + "").val().trim();
            var ExpAmt = $("#ExpAmt_" + parseInt(i + 1) + "").val().trim();
            for (var j = 1; j <= $(".ExpenseTotCls").length; j++) {
                if ($("#ExpenseTotalName_" + j + "").html() == expenseTypeName) {
                    var currExpAmt = $("#ExpenseTotalVal_" + j + "").html();
                    var TotalExpAmt = parseFloat(currExpAmt) + parseFloat(ExpAmt);
                    $("#ExpenseTotalVal_" + j + "").html(TotalExpAmt);
                }
            }
        }
    }

    $("#uploadfile").html(choosebutton);
    GetConfitValueForSize();

}

//DOCTOR CRM

function fnShowDoctorCRMEntryGrid() {

    if ($('select[name="ddlFavouringUser"]').val() == -1) {
        fnMsgAlert('info', 'Expense Claim Request', 'Kindly select the favouring user.');
        return false;
    }

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
                    //autoComplete(d_g, "hdnDCustName", "hdnDCust", 'autoCust1');



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


    $(".autoCust").keyup(function () { fnCreateDocCRMEntryRow(this); });
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
    // fnLoadBody("HiDoctor_Activity/ExpenseClaim/ExpenseClaimRequest");
    $("#ddlRequest").val("");
    $(".dvDCRDates").css('display', 'none');
    $("#dvNew").css('display', 'none');
    $("#txtTotExpense").val("0.00");
    $("#dvTotExp").css('display', '');
    $("#dvDetailEntry").empty();
    if ($("#AddlExpense").length > 0) {
        $("#AddlExpense").empty();
    }
  //  $("#ddlFavouringUser").val("");
    $("#txtFromDate").val("");
    $("#txtToDate").val("");
    $("#txtRemarks").val("");
    $("#hdnMainStatusCode").val("");
    d_g = "";
    $("#finalAlert").css('display', 'none');
    $("#dvTotExpTypeWise").hide();
    fnClear();
    uploadFileName = [];
}
var requestType = "";
function fnSaveExpenseClaim() {
    debugger;
    //  $("#submitexpense").hide();
    $("#submitexpense").attr("disabled", true);
    ShowModalPopup("dvloading");

    if (fnValidateExpenseClaim()) {
        //read detail string       
        var cycleCode = $("#ddlRequest").val().split('_')[1];
        var requestCode = $("#ddlRequest").val().split('_')[0];
        var statusCode = $("#hdnMainStatusCode").val();
        var actualAmount = parseFloat($("#txtTotExpense").val()).toFixed(2);
        var dateFrom = $("#txtFromDate").val();
        var dateTo = $("#txtToDate").val();
        var favouringUser = $('select[name="ddlFavouringUser"]').val();
        var remarks = $("#txtRemarks").val();
        var expenseType = "";
        var detailString = "";

        $('#main').block({
            message: '<h3>Saving</h3>',
            css: { border: '2px solid #ddd' }
        });

        // var datafield = fieldExp.split(',');
        //  for (i = 0; i < datafield.length; i++) {
        if (requestType.toUpperCase() == "REGION WISE") {
            dateFrom = dateFrom.split('/')[2] + '-' + dateFrom.split('/')[1] + '-' + dateFrom.split('/')[0];
            dateTo = dateTo.split('/')[2] + '-' + dateTo.split('/')[1] + '-' + dateTo.split('/')[0];
            expenseType = "FIELD";

            // Read the expense claim region wise.
            detailString = fnReadFieldExpenseClaimTable();
            if (fromMonth == ToMonth) {
                var IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                if (IsAddlExpense.toUpperCase() == 'YES') {
                    var isDcrExpValid = true;
                    $.ajax({
                        type: 'POST',
                        data: "favouringUser=" + favouringUser + "&detailString=" + escape(detailString),
                        url: '../HiDoctor_Activity/ExpenseClaim/ValidateDcrExp',
                        async: false,
                        success: function (response) {
                            debugger;
                            if (response.split('^')[0].toUpperCase() == "ERROR") {
                                fnMsgAlert('info', 'Expense Claim', response.split('^')[1]);
                                isDcrExpValid = false;
                            }
                        },
                        error: function () {

                        },
                        complete: function () {

                        }
                    });
                    if (!isDcrExpValid) {
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        $('#submitexpense').attr("disabled", false);
                        return false;
                    }
                }
            }
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
                            if ($("#hdnDcrFlag_" + parseInt(i + 1) + "").val() == "FIELD") {
                                DcrFlagMin = "F";
                            }
                            else if ($("#hdnDcrFlag_" + parseInt(i + 1) + "").val() == "ATTENDANCE") {
                                DcrFlagMin = "A";
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
                                $('#submitexpense').attr("disabled", false);
                                HideModalPopup("dvloading");
                                return false;
                            }
                            if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == "") {
                                fnMsgAlert('info', 'Expense Additional Claim', 'Invalid Expense Type in Row ' + parseInt(i + 1) + '');
                                $("#main").unblock();
                                $('#submitexpense').attr("disabled", false);
                                HideModalPopup("dvloading");
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
                                    $('#submitexpense').attr("disabled", false);
                                    HideModalPopup("dvloading");
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
                                "Expense_Amount": $("#ExpAmt_" + parseInt(i + 1) + "").val(),
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
                        "&expenseType=" + expenseType + "&detailString=" + escape(detailString) + "&screenMode=DAILY&AddlExpLst=" + JSON.stringify(AddlExpArr),
                url: '../HiDoctor_Activity/ExpenseClaim/InsertExpenseClaim',
                async: false,
                success: function (response) {
                    debugger;
                    if (response != "0" && response != "-1") {
                        favouringuser_g = "";
                        if (uploadFileName.length > 0) {
                            fnSaveClaimImg(response);
                        }
                        $("#attachment").empty();
                        fnBindExpenseClaimSummary();
                        fnCancelExpense();
                        fnCancelExpenseEdit();
                        $("#dvExpFooter").hide();
                        $("#finalAlert").html("Expense Claim Saved successfully.Please note your Expense Claim Id for future reference (" + response + ").");
                        // $("#submitexpense").show();
                        $('#submitexpense').attr("disabled", false);
                        $("#finalAlert").fadeIn();
                       fnBindRequestAndFavouringUserSel('');
                    }
                    else if (response == "-1") {
                        fnMsgAlert('info', 'Expense Claim Request', 'Please select alteast one DCR Expense along with the Additional Expense to Submit.Cannot claim Additional Expense alone.');
                        $('#submitexpense').attr("disabled", false);
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
                    // $("#submitexpense").show();
                    $('#submitexpense').attr("disabled", false);
                }
            });
        }
        else if (requestType.toUpperCase() == "CUSTOMER WISE") {
            var limit = "";

            var expamount = "";
            limit = fncreditlimit(requestCode);

            expamount = $("#txtTotExpense").val()

            if (parseFloat(expamount) > parseFloat(limit)) {
                fnMsgAlert('info', 'Expense Claim Request', 'Your expense amount should not be greater than Request Credit limit.');
                HideModalPopup("dvloading");
                $("#main").unblock();
                $('#submitexpense').attr("disabled", false);
                return false;
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
                        // $("#submitexpense").show();
                        $('#submitexpense').attr("disabled", false);
                        $("#finalAlert").fadeIn();
                        HideModalPopup();
                        $('#dvloading').hide();
                        fnClear();
                    }
                    else {
                        fnMsgAlert('info', 'Expense Claim Request', 'Error while saving the Expense Claim.');
                        // $("#submitexpense").show();
                        $('#submitexpense').attr("disabled", false);
                        fnClear();
                    }
                    $("#main").unblock();
                    HideModalPopup("dvloading");
                    //  $("#submitexpense").show();
                    $('#submitexpense').attr("disabled", false);
                },
                error: function (e) {
                    fnMsgAlert('info', '', 'Error.' + e.responseText);
                    $("#main").unblock();
                    // $("#submitexpense").show();
                    $('#submitexpense').attr("disabled", false);
                }
            });
        }
        //fnSaveCRM();
    }
    else {
        HideModalPopup("dvloading");
        $("#submitexpense").attr("disabled", false);
        return false;
    }
}
function fnSaveClaimImg(response) {
    debugger;
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
            var btsize = imagesize * (1024 * 1024);
            if (btsize < size) {
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
                    fnMsgAlert('info', 'Expense Claim Request', 'The File Upload limit is ' + imagelimit);
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
    var MyArray = retFileName + "#" + fileName+"#0";
    retFileName = "";
    uploadFileName.push(MyArray);
    attachment += "<table class='table table-hover tblattachment'>";
    //attachment += "<thead>";
    for (var i = 0; i < uploadFileName.length; i++) {
        attachment += "<tr><td>Attachment " + [i + 1] + ":</td><td>" + uploadFileName[i].split("#")[1] + "</td><td><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + ",1)'/> <input type='hidden' id='dcrid_" + i + "' value='" + uploadFileName[i].split("#")[2] + "'/></td></tr>";
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
            var bsize = imagesize * (1024 * 1024);
            if (bsize <= size) {
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

var rowlength = "";
var rowlength2 = "";
function fnuplodImageEdit() {
    debugger;
    var attachment = "";
    var choose = "";
    var MyArray = retFileName + "#" + fileName +"#0";
    retFileName = "";
    uploadFileName.push(MyArray);
    var table = document.getElementById("stable");
    var rows = table.getElementsByTagName("tr");
    rowlength = rows.length;

    attachment += "<table class='table table-hover'>";
    // attachment += "<thead>";
    for (var i = 0; i < uploadFileName.length; i++) {
        //var Name = uploadFileName[i].split("#")[1];
        attachment += "<tr><td>Attachment " + [i + 1] + ":</td><td>" + uploadFileName[i].split("#")[1] + "</td><td><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + ",0 )' /></td></tr>";
       
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
        var table = document.getElementById("stable");
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
            var jsonData = eval(jsData);
            var baseCustomerName = "[";
            for (var s = 0 ; s < jsonData.length ; s++) {

                baseCustomerName += "{label:" + '"' + "" + jsonData[s].Customer_Code + '"' + "}";

                if (s < jsonData.length - 1) {
                    baseCustomerName += ",";
                }
            }
            baseCustomerName += "];";
            CRMCustomerAndProductsJson = eval(baseCustomerName);
        }
    });
}

//function fnSaveCRM() {
//    var limit = "";
//    

//    //var expamount = "";
//    //limit = fncreditlimit(requestCode);

//    //expamount = $("#txtTotExpense").val()

//    //if (parseFloat(expamount) > parseFloat(limit)) {
//    //    fnMsgAlert('info', 'Expense Claim Request', 'Your expense amount should not greater then Request Credit limit.');
//    //    HideModalPopup("dvloading");
//    //    return false;
//    //}

//    HideModalPopup("dvloading");


//    var result = "";

//    if (popup == true) {
//        

//        result = fnStockiestSave();
//        if (result != 'SUCCESS' && result != '' && result != undefined) {
//            fnMsgAlert('info', 'Expense Claim', 'Error in CRM Request');
//            customer_Name = "";
//            customerCode = "";
//            while (customerStockiestArray.length > 0) {
//                customerStockiestArray.pop();
//            }
//            return false;
//        }
//        HideModalPopup("dvloading");
//        $('#dvAjaxLoad').hide();
//    }
//}
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



function fnValidateExpenseClaim() {
    debugger;
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



        if ($.trim($("#txtFromDate").val()) == "") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please select DCR Date From.');
            HideModalPopup("dvloading");
            return false;
        }
        if ($.trim($("#txtToDate").val()) == "") {
            fnMsgAlert('info', 'Expense Claim Request', 'Please select DCR Date To.');
            HideModalPopup("dvloading");
            return false;
        }

        //Invalid Date
        if (!(fnValidateDateFormate($("#txtFromDate"), "DCR Date From"))) {
            HideModalPopup("dvloading");
            return false;
        }
        if (!(fnValidateDateFormate($("#txtToDate"), "DCR Date To"))) {
            HideModalPopup("dvloading");
            return false;
        }

        var dcrFrom = $("#txtFromDate").val().split('/')[2] + '-' + $("#txtFromDate").val().split('/')[1] + '-' + $("#txtFromDate").val().split('/')[0];
        var dcrTo = $("#txtToDate").val().split('/')[2] + '-' + $("#txtToDate").val().split('/')[1] + '-' + $("#txtToDate").val().split('/')[0];

        var sDate = new Date(dcrFrom);
        var eDate = new Date(dcrTo);
        if (sDate > eDate) {
            fnMsgAlert('info', 'Expense Claim Request', 'End date can not be less than Start date.');
            HideModalPopup("dvloading");
            return false;
        }

        // Entry grid Validation
        if ($("#dvDetailEntry").html().length == 0) {
            fnMsgAlert('info', 'Expense Claim Request', 'Please click on Show Expense.');
            HideModalPopup("dvloading");
            return false;
        }

        if ($("#tblExpenseEntry tr").length > 0) {
            if ($("input:checkbox[name=checkedExpense]:checked").length == 0) {
                var IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                if (IsAddlExpense.toUpperCase() == 'NO') {
                    fnMsgAlert('info', 'Expense Claim Request', 'Please select any Expense for Claim.');
                    HideModalPopup("dvloading");
                    return false;
                }
                else if (IsAddlExpense.toUpperCase() == 'YES') {
                    if ($('.AddlExpCls:visible').length > 0) {
                        var TotalRow = $('.AddlExpCls').length;
                        var AddlCompAvail = false;
                        for (var i = 0; i < TotalRow; i++) {
                            if ($('#ExpRow_' + parseInt(i + 1) + '').is(':visible')) {
                                if ($("#DcrDateTxt_" + parseInt(i + 1) + "").val() != "") {
                                    AddlCompAvail = true;
                                    break;
                                }
                            }
                        }
                        if (!AddlCompAvail) {
                            fnMsgAlert('info', 'Expense Claim Request', 'Please select any Additional Expense for Claim.');
                            HideModalPopup("dvloading");
                            return false;
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Expense Claim Request', 'Please select any Expense for Claim.');
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
            }


            for (rowNumber = 1; rowNumber < $("#tblExpenseEntry tr").length; rowNumber++) {
                if ($("#chkExp_" + rowNumber).is(':checked')) {
                    // Bill number
                    if ($.trim($("#txtBillNumber_" + rowNumber).val()) != "") {
                        if (($("#txtBillNumber_" + rowNumber).val()).length > 100) {
                            fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 100 characters in Reference Details.');
                            HideModalPopup("dvloading");
                            $("#txtBillNumber_" + rowNumber).focus();
                            return false;
                        }

                        if (!(regExforAlphaNumericSpecificRemarks($("#txtBillNumber_" + rowNumber).val()))) {
                            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
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
                            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
                            HideModalPopup("dvloading");
                            $("#txtUserRemarks_" + rowNumber).focus();
                            return false;
                        }
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
            fnMsgAlert('info', 'Expense Claim Request', 'You do not have any Expense to Claim.');
            HideModalPopup("dvloading");
            return false;
        }

    }
    else if (result.toUpperCase() == "CUSTOMER WISE") { // Validations For Doctor CRM
        debugger;
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
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
                        HideModalPopup("dvloading");
                        $("#txtDCust_" + j).focus();
                        return false;
                    }
                    debugger;
                    var docJson = jsonPath(d_g, "$.[?(@.label=='" + $("#txtDCust_" + j).val() + "')]");
                    if (docJson == false || docJson == undefined) {
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
                debugger;
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
                debugger;
                // Expense Amount Validation
                if ($.trim($("#txtDExp_" + j).val()) == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Please enter Expense Amount for ' + $("#txtDCust_" + j).val() + '.');
                    HideModalPopup("dvloading");
                    $("#txtDExp_" + j).focus();
                    return false;
                }
                debugger;
                if (parseFloat($("#txtDExp_" + j).val()) <= 0) {
                    fnMsgAlert('info', 'Expense Claim Request', 'Expense Amount must be greater than Zero.');
                    HideModalPopup("dvloading");
                    $("#txtDExp_" + j).focus();
                    return false;
                }

                debugger;

                // present , potential contribution validation
                if ($.trim($("#txtDPresent_" + j).val()) == "") {
                    if (parseInt($("#txtDPresent_" + j).val()) <= 0) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Present Contribution cannot be a negative value.');
                        HideModalPopup("dvloading");
                        $("#txtDPresent_" + j).focus();
                        return false;
                    }
                }
                debugger;

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
                    debugger;

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtDBillNumber_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
                        HideModalPopup("dvloading");
                        $("#txtDBillNumber_" + j).focus();
                        return false;
                    }
                }
                debugger;

                // item wise user Remarks Validation
                if ($.trim($("#txtDUserRemarks_" + j).val()) != "") {
                    if (($("#txtDUserRemarks_" + j).val()).length > 1000) {
                        fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
                        HideModalPopup("dvloading");
                        $("#txtDUserRemarks_" + j).focus();
                        return false;
                    }
                    //$("#txtDUserRemarks_" + j).val()
                    if (!(regExforAlphaNumericSpecificRemarks($("#txtDUserRemarks_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
            }
        }
        debugger;

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
            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
            HideModalPopup("dvloading");
            return false;
        }
    }
    return true;
}

function fnReadFieldExpenseClaimTable() {
    debugger;
    var detailString = "";
    for (rowNumber = 1; rowNumber < $("#tblExpenseEntry tr").length; rowNumber++) {
        if ($("#chkExp_" + rowNumber).is(':checked')) {

            //DCR_Expense_Code,@Expense_Type_Code,@Expense_Amount,@Record_Status,@DCR_Actual_Date,@DCR_Activity_Flag,@Bill_Number
            // dcr.DCR_Expense_Code + "_" + dcr.DCR_Date + "_" + dcr.DCR_Flag + "_" + dcr.Expense_Type_Code

            var checkedVal = $("#chkExp_" + rowNumber).val();
            detailString += checkedVal.split('_')[0] + '^';// dcr expense code
            detailString += checkedVal.split('_')[1] + '^';// dcrDate
            detailString += checkedVal.split('_')[2] + '^';// dcr flag
            detailString += checkedVal.split('_')[3] + '^';// expense type code
            detailString += $("#tdExpAmount_" + rowNumber).html() + '^';// expense Amount
            detailString += $("#txtBillNumber_" + rowNumber).val() + '^';// bill number
            detailString += $("#txtUserRemarks_" + rowNumber).val() + '$';   // user remarks        
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
var editRequestCode = "";

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

function fnGetDetailsUploadImage(claimCode) {
    $.ajax({
        type: 'POST',
        data: "claimCode=" + claimCode,
        url: '../HiDoctor_Activity/ExpenseClaim/GetDetailsUploadImage',
        success: function (jsdata) {
            debugger;
            Edituploadeddetails = jsdata;
            var stable = "";
            var chooseUpload = "";
            $("#attachment1").empty();
            uploadFileName = [];
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
          
            fngetdcrExpenseUrl(dcrFromEditDate, dcrToEditDate, $('select[name="UserSrch"]').val(), 'Edit')
           


        }
    });

}

function fnDeleteUploadedfile(ID, i) {
    $('.attblock').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    uploadFileName.splice(i, 1);
    fnCreateUploadTable(0);

}

function fnEditExpenseClaim(claimCode, requestName, cycleCode, requestCode, screenMode, statusCode, favoringusercode) {
    debugger;
    uploadFileName = [];
    $('#dvCRMSubmit').hide();
    $("#attachment").html('');
    ret = 1;

    $('#dvEdit').show();
    $('#dvSummaryTab').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });


    if (screenMode == "MONTHLY") {
        var favoringUserCode = "";
        $("#ddlRequest").val(requestCode + "_" + cycleCode);
        var request = $("#ddlRequest").val();
        HideModalPopup("dvloading");
        $('#main').load('HiDoctor_Activity/ExpenseClaim/ExpenseClaimMonthRequest?request=' + request + "&favouringUser=" + favoringusercode + "&claimCode=" + claimCode + "&cycleCode=" + cycleCode);
        return false;

    }
    // to clear entry screen   
    if (favouringuser_g == "") {
        fnCancelExpense();
        fnCancelExpenseEdit();
        fnClear();
    }

    $.ajax({
        type: 'POST',
        data: "cycleCode=" + cycleCode + "&userCode=" + favoringusercode,//$("#ddlFavouringUser").val(),
        url: '../HiDoctor_Activity/ExpenseClaim/CheckStatusCycleMapping',
        success: function (result) {
            debugger;
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

                //if (fieldExpEdit[i] == requestName) {
                //    break;
                //}
                //else {
                //    continue;
                //}
                //   }

                if (result.toUpperCase() == "CUSTOMER WISE") {
                    requestType = "CRM";
                    $('#dvTotExpTypeWiseEdit').hide();
                    $('#spn_TotExpTypeWiseEdit').hide();
                }

                $('#main').block({
                    message: '<h3>Processing</h3>',
                    css: { border: '2px solid #ddd' }
                });


                $.ajax({
                    type: "POST",
                    url: '../HiDoctor_Activity/ExpenseClaim/GetClaimDetailsForEdit',
                    data: "claimCode=" + claimCode + "&requestType=" + requestType,
                    success: function (result) {
                        fnGetDetailsUploadImage(claimCode);
                        fnClear();
                        debugger;
                        if (result.split('^')[0] != 'FAIL') {
                            if (result.split('$').length > 1) {
                                var ar = result.split('$');
                                var claimJson = eval('(' + ar[2] + ')');
                                fnFillDetailsInHeader(claimJson, requestName, requestType);
                                $('#dvClaimDetails').html(ar[0]);
                                IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                                if (IsAddlExpense.toUpperCase() == 'YES') {
                                    debugger;
                                    $('#dvAddlAprClaimDetails').html(ar[3]);
                                    var dcrDateEdit = ar[4].split(',');
                                    dcrFromEdit = dcrDateEdit[0].split('-')[1] + '/' + dcrDateEdit[0].split('-')[2] + '/' + dcrDateEdit[0].split('-')[0];
                                    dcrToEdit = dcrDateEdit[1].split('-')[1] + '/' + dcrDateEdit[1].split('-')[2] + '/' + dcrDateEdit[1].split('-')[0];
                                    dcrFromEditDate = dcrDateEdit[0];
                                    dcrToEditDate = dcrDateEdit[1];
                                    ExpenseClaimUser = dcrDateEdit[2];
                                    if (dcrDateEdit[0].split('-')[1] == dcrDateEdit[1].split('-')[1]) {
                                        var TotalRow = $(".AprExpRow").length;
                                        var AddlComponent = "";
                                        AddlComponent += "<tr class='AprExpRow' id='AprExpRowId_" + (TotalRow + 1) + "'><input type='hidden' id='FavUser_" + (TotalRow + 1) + "' value='" + ExpenseClaimUser + "'/> ";
                                        AddlComponent += "<td><input type='text' class='form-control AutoDcrDate' onblur ='fnValidateAutofill(this," + "AutoComplete_DcrDate" + ",\"AddlDcrDate\",\"hdnAddlDateEdit\");fnGetDcrFlagEdit(" + (TotalRow + 1) + ");' autocomplete='off' id='AddlDcrDate_" + (TotalRow + 1) + "' value=''/><input type='hidden' id='hdnAddlDateEdit_" + (TotalRow + 1) + "' value=''/></td>";
                                        AddlComponent += "<td><input type='text' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + "AutoComplete_Ovr_DcrFlag" + ",\"AddlDcrFlag\",\"hdnAddlFlagEdit\");fnGetDcrCategoryEdit(" + (TotalRow + 1) + ");' autocomplete='off' id='AddlDcrFlag_" + (TotalRow + 1) + "' value='' disabled/><input type='hidden' id='hdnAddlFlagEdit_" + (TotalRow + 1) + "' value=''/></td>";
                                        AddlComponent += "<td><input type='text' class='form-control AutoDcrCat' onblur='fnValidateAutofill(this," + "AutoComplete_Dcr_Category" + ",\"AddlCat\",\"hdnAddlCatEdit\");' autocomplete='off' id='AddlCat_" + (TotalRow + 1) + "' value='' disabled/><input type='hidden' id='hdnAddlCatEdit_" + (TotalRow + 1) + "' value=''/></td>";
                                        AddlComponent += "<td><input type='text' Addl_Exp_Code='' class='form-control AutoDcrExpCls' onclick='fnGetDcrExpenseEdit(" + (TotalRow + 1) + ");' id='AddlExpType_" + (TotalRow + 1) + "' value='' disabled/><input type='hidden' id='hdnAddlExpEdit_" + (TotalRow + 1) + "' value=''/></td>";
                                        AddlComponent += "<td><input type='text' class='form-control' id='AddlExpAmt_" + (TotalRow + 1) + "' value='' disabled/></td>";
                                        AddlComponent += "<td id='AddlCurrDed_" + (TotalRow + 1) + "'>0</td>";
                                        AddlComponent += "<td id='AddlAprAmt_" + (TotalRow + 1) + "'>0</td>";
                                        AddlComponent += "<td><input type='text' class='form-control' id='AddlRef_" + (TotalRow + 1) + "' /></td>";
                                        AddlComponent += "<td><input type='text' class='form-control' id='AddlUserRem_" + (TotalRow + 1) + "' /></td>";
                                        AddlComponent += "<td id='AddlAdminRem_" + (TotalRow + 1) + "'></td>";
                                        AddlComponent += "<td><a style='cursor:pointer;' onclick='FnAddExpenseEdit(" + (TotalRow + 1) + ")'><i class='fa fa-plus'  style='font-size:18px;color:green;'></i></a>&nbsp;&nbsp;<a style='cursor:pointer;' onclick='FnClearExpenseEdit(" + (TotalRow + 1) + ")'><i class='fa fa-remove'  style='font-size:18px;color:red;'></i></a></td>";
                                        AddlComponent += "</tr>";
                                        $("#AddlCntEdit").append(AddlComponent);
                                        debugger;
                                        fnAddlDcrExpDetEdit(dcrFromEdit, dcrToEdit, dcrDateEdit[2]);
                                    }
                                    else {
                                        $("#dvAddlAprClaimDetailsPanel").hide();
                                    }

                                }
                                else {
                                    $("#dvAddlAprClaimDetailsPanel").hide();
                                }
                                $("#dvClaimHistoryPopUp").html(ar[1]);

                                // Initiating Doctor CRM Events
                                if (requestType.toUpperCase() == "CRM") {
                                    $('#dvTotExpTypeWiseEdit').hide();
                                    if (claimJson[0].lstClaimHeader[0] != "") {

                                        var favouringUserCode = claimJson[0].lstClaimHeader[0].Favouring_User_Code;
                                        $.ajax({
                                            type: 'POST',
                                            data: "userCode=" + favouringUserCode,
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


                                                    $("#dvEditTab").css('display', '');
                                                    //$("#dvEditTab").html(d_g);
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
                        fncalculateExpensetypewiseEdit();
                        $("#dvEditTab").unblock();
                    }
                });
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
                $('#tdDcrDate').show();
                $('#tdTotalDeductionTitle').show();
                $('#tdTotalDeduction').show();
                $('#spnDcrDate').html(claimJson[0].lstClaimHeader[0].Date_From + '-' + claimJson[0].lstClaimHeader[0].Date_To);
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(claimJson[0].lstClaimHeader[0].Actual_Amount);
                $('#spnTotalDeduction').html(claimJson[0].lstClaimHeader[0].Total_Deduction);
                $('#spnApprovedAmount').html(claimJson[0].lstClaimHeader[0].Approved_Amount);
                $('.notForOthers').css('display', '');
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
                $("#hdnFavouringUser").val(claimJson[0].lstClaimHeader[0].Favouring_User_Code);

                $('.notForOthers').css('display', '');
            }
            else {
                $('#tdDcrDateTitle').hide();
                $('#tdDcrDate').hide();
                $('#tdTotalDeductionTitle').hide();
                $('#tdTotalDeduction').hide();
                $('#spnClaimDate').html(claimJson[0].lstClaimHeader[0].Entered_DateTime);
                $('#spnClaimAmount').html(claimJson[0].lstClaimHeader[0].Actual_Amount);
                $('.notForOthers').css('display', 'none');
            }
        }
    }


}


function fncalculateExpensetypewiseEdit() {
    debugger;
    $("#dvTotExpTypeWiseEdit").show();
    $("#ExpenseTypeWiseNameLableEdit").show();
    var expenseTypeNameEdit = "";
    var selectedExpenseTypeNameEdit = [];
    var uniqueExpenseTypeNameEdit = [];
    var typewiseExpenseEdit = 0.00;
    debugger;
    $("input:checkbox[name=checkedExpenseEdit]:checked").each(function () {
        var rowNo = this.id.split('_')[1];
        // totalExpense += parseFloat($("#tdExpAmountEdit_" + rowNo).html());
        expenseTypeNameEdit = $("#tdExpTypeNameEdit_" + rowNo).html();
        selectedExpenseTypeNameEdit.push(expenseTypeNameEdit);
    });
    var AddlExpTypeName = "";
    var IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
    if (IsAddlExpense == "YES") {
        var TotalRow = $('.AprExpRow').length;
        var SelectedRow = $('.AprExpRow:visible').length;
        for (var i = 0; i < TotalRow; i++) {
            if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible')) {
                if ($("#AddlExpAmt_" + parseInt(i + 1) + "").val() != "") {
                    AddlExpTypeName = $("#AddlExpType_" + parseInt(i + 1)).val();
                    selectedExpenseTypeNameEdit.push(AddlExpTypeName);
                }
            }
        }
    }
    var uniqueExpenseTypeName = fnGetUniqueValues(selectedExpenseTypeNameEdit);

    uniqueExpenseTypeNameEdit.push(uniqueExpenseTypeName);
    var tableContent = "";
    var choosebutton = "";
    tableContent += "<table class='table table-hover'>";
    //tableContent += "<thead>";
    tableContent += "<tr>";
    tableContent += "<td class='btn btn-primary' style='font-weight: bold;>Expense Type Name</td>";
    tableContent += "<td class='btn btn-primary' style='font-weight: bold;'>Amount</td>";
    tableContent += "</tr>";
    //tableContent += "</thead>";
    tableContent += "</table>";
    choosebutton += "<input type='file' value='ChooseFile' id='ChooseFile'  />";
    for (var i = 0; i < uniqueExpenseTypeNameEdit[0].length; i++) {
        typewiseExpenseEdit = 0.0;
        tableContent += "<tr><td>" + uniqueExpenseTypeNameEdit[0][i] + "-" + "</td>";
        var expLen = $("input[Exp_Code='" + uniqueExpenseTypeNameEdit[0][i] + "']:checked").length;
        var AddlExpLen = $("input[Addl_Exp_Code='" + uniqueExpenseTypeNameEdit[0][i] + "']").length;
        for (var r = 0; r < expLen; r++) {
            typewiseExpenseEdit += parseFloat($($("input[Exp_Code='" + uniqueExpenseTypeNameEdit[0][i] + "']:checked")[r]).val().split('_').reverse()[0]);
        }
        for (var r = 0; r < AddlExpLen; r++) {
            var id = $("input[Addl_Exp_Code='" + uniqueExpenseTypeName[i] + "']")[r].id;
            var AddlExpClaim = ($("#" + id.replace("AddlExpType", "AddlExpAmt")));
            typewiseExpenseEdit += parseFloat(AddlExpClaim.val() == "" ? 0 : AddlExpClaim.val());
        }
        tableContent += "<td><span>" + typewiseExpenseEdit + "</span><td></tr></br>";
    }

    $("#ExpenseTypeNameEdit").html(tableContent);
    $("#uploadfile").html(choosebutton);

    GetConfitValueForSize();
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
function fnSelectAddlAllExpenseForEdit() {
    if ($("input:checkbox[name=selAllAddlExpenseEdit]:checked").length == 0) {
        $("input:checkbox[name=checkedAddlExpenseEdit]").attr('checked', false);
    }
    else if ($("input:checkbox[name=selAllAddlExpenseEdit]:checked").length == 1) {
        $("input:checkbox[name=checkedAddlExpenseEdit]").attr('checked', true);
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
function fnClearSelectAllAddlForEdit() {
    if ($("input:checkbox[name=checkedAddlExpenseEdit]:checked").length == $("input:checkbox[name=checkedAddlExpenseEdit]").length) {
        $("input:checkbox[name=selAllAddlExpenseEdit]").attr('checked', true);
    }
    else {
        $("input:checkbox[name=selAllAddlExpenseEdit]").attr('checked', false);
    }

    fnCalculateTotalForFieldExpenseForEdit();
    fncalculateExpensetypewiseEdit();
}

function fnCalculateTotalForFieldExpenseForEdit() {
    debugger;
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

    var TotalRow = $('.AprExpRow').length;
    for (var i = 0; i < TotalRow; i++) {
        if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible')) {
            if ($("#AddlExpAmt_" + parseInt(i + 1)).val() != "") {
                totalExpense += parseFloat($("#AddlExpAmt_" + parseInt(i + 1)).val());
            }
            if ($.trim($("#AddlCurrDed_" + parseInt(i + 1)).html()) != "" && $.trim($("#AddlCurrDed_" + parseInt(i + 1)).html()) != "0") {
                itemDeduction += parseFloat($("#AddlCurrDed_" + parseInt(i + 1)).html());
            }
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


// doctor crm edit
function fnDocCRMEditTableEventBinder() {
    $(".autoCustEdit").unbind("keyup").bind("keyup", (function () { fnCreateDocCRMEditRow(this) }));
    $(".autoCustEdit").dblclick(function () { fnCreateDocCRMEditRow(this); });
    //onblur ='fnValidateAutofill(this," + 'RCPAProductAutofill_g' + ",\"txtchem_prod_\",\"hdnchem_prod_\")
    //$(".autoCustEdit").blur(function () { $("#" + this.id.replace(/txtEDCust/g, "txtEDExp")).val(""); $("#" + this.id.replace(/txtEDCust/g, "spnEDDeduction")).val("0.00"); });
    $(".autoCustEdit").unbind("blur").bind("blur", (function () { fnValidateAutofill(this, d_g, "txtDCust_", "hdnDCust_") }));
    $(".autoCustEdit").unbind("blur").bind("blur", (function () { fnValidateAutofill(this, d_g, "txtEDCust_", "hdnEDCust_") }));
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
        autoComplete(d_g, "txtDCust", "hdnDCust", 'autoCustEdit');
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
    debugger;
    flag = false;
    $("#UpdateExp").hide();
    ShowModalPopup("dvloading");
    var validateRequestCode = "";
    validateRequestCode = editRequestCode;
    var result = fnGetExpenseRequesttype(validateRequestCode)

    if (mode.toUpperCase() == "U") {
        flag = true;
    }
    else {
        debugger;
        if (fnValidateExpenseClaimEdit(result)) {
            flag = true;
        }

        //if (fnValidateExpenseClaimEdit(result)) {
        //    flag = true;
        //}
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


        //var fieldExpEditre = fieldExp.split(',');

        //  for (i = 0; i < fieldExpEditre.length; i++) {
        if (result.toUpperCase() == "REGION WISE") {
            expenseType = "FIELD";
            actualAmount = parseFloat($("#spnTotalClaimAmount").html()).toFixed(2);
            //approvedAmount = parseFloat($("#spnTotalApprovedAmount").html()).toFixed(2);
            // otherDeductions = parseFloat($("#spnOtherDeductionAmount").html()).toFixed(2);
            detailString = fnReadFieldExpenseClaimEditTable();
            if (dcrFromEdit.split('/')[0] == dcrToEdit.split('/')[0]) {
                var IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                if (IsAddlExpense.toUpperCase() == 'YES') {
                    var isDcrExpValid = true;
                    $.ajax({
                        type: 'POST',
                        data: "favouringUser=" + ExpenseClaimUser + "&detailString=" + escape(detailString),
                        url: '../HiDoctor_Activity/ExpenseClaim/ValidateDcrExp',
                        async: false,
                        success: function (response) {
                            debugger;
                            if (response.split('^')[0].toUpperCase() == "ERROR") {
                                fnMsgAlert('info', 'Expense Claim', response.split('^')[1]);
                                isDcrExpValid = false;
                            }
                        },
                        error: function () {

                        },
                        complete: function () {

                        }
                    });
                    if (!isDcrExpValid) {
                        $("#main").unblock();
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
            }
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlAprExpArr = [];
            var AddlAprExpObj = "";
            var j = 0;
            var datesplit = "";
            var formattedDate = "";
            for (var i = 0; i < TotalRow; i++) {
                debugger;
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible')) {
                    if ($("#hdnAddlDateEdit_" + parseInt(i + 1) + "").val() != "") {
                        j = j + 1;
                        var DcrFlagMin = "";
                        if ($("#hdnAddlFlagEdit_" + parseInt(i + 1) + "").val().toUpperCase() == "FIELD") {
                            DcrFlagMin = "F";
                        }
                        else if ($("#hdnAddlFlagEdit_" + parseInt(i + 1) + "").val().toUpperCase() == "ATTENDANCE") {
                            DcrFlagMin = "A";
                        }
                        datesplit = $("#hdnAddlDateEdit_" + parseInt(i + 1) + "").val();//.split('/');
                        formattedDate = datesplit;//datesplit[1] + '/' + datesplit[0] + '/' + datesplit[2];
                        if ($("#AddlDcrDate_" + parseInt(i + 1) + "").val() == "") {
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Date for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#hdnAddlDateEdit_" + parseInt(i + 1) + "").val() == "") {
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select Valid Dcr Date for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#AddlDcrFlag_" + parseInt(i + 1) + "").val() == "") {
                            $("#myModal").modal('hide');
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Flag for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#hdnAddlFlagEdit_" + parseInt(i + 1) + "").val() == "") {
                            $("#myModal").modal('hide');
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Dcr Flag for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#AddlCat_" + parseInt(i + 1) + "").val() == "") {
                            $("#myModal").modal('hide');
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Category for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#hdnAddlCatEdit_" + parseInt(i + 1) + "").val() == "") {
                            $("#myModal").modal('hide');
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Dcr Category for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#AddlExpType_" + parseInt(i + 1) + "").val() == "") {
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Type for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val() == "") {
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Expense Type for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#AddlExpAmt_" + parseInt(i + 1) + "").val() == "") {
                            fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Amount for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if (/^[0-9]+([.][0-9]+)?$/g.test($("#AddlExpAmt_" + parseInt(i + 1) + "").val()) == false) {
                            fnMsgAlert('info', 'Expense Additional Claim', 'Please enter Integer Value in Expense Amount for Row ' + parseInt(i + 1) + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        var isRemarksMandate = "";
                        isRemarksMandate = $.grep(AddlExpTypeDet_g, function (element, index) {
                            if (element.Expense_Type_Code == $("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val() && element.Expense_Mode.toUpperCase() == 'DAILY') {
                                return (element.Expense_Type_Code == $("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val() && element.Expense_Entity == $("#AddlCat_" + parseInt(i + 1) + "").val())
                            }
                            else {
                                return (element.Expense_Type_Code == $("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val())
                            }
                        });
                        if (isRemarksMandate.length > 0) {
                            if (isRemarksMandate[0].Mandate_Remarks.toUpperCase() == 'Y' && $("#AddlUserRem_" + parseInt(i + 1) + "").val() == "") {
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
                            "Dcr_Category": $("#AddlCat_" + parseInt(i + 1) + "").val(),
                            "Expense_Type_Name": $("#AddlExpType_" + parseInt(i + 1) + "").val(),
                            "Expense_Type_Code": $("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val(),
                            "Expense_Mode": $("#ExpMode_" + parseInt(i + 1) + "").val(),
                            "Expense_Amount": $("#AddlExpAmt_" + parseInt(i + 1) + "").val(),
                            "Addl_Reference_Details": $("#AddlRef_" + parseInt(i + 1) + "").val(),
                            "Addl_Expense_Remarks": $("#AddlUserRem_" + parseInt(i + 1) + "").val(),
                            "Approved_Amount": 0
                        }
                        //$("#AddlAprAmt_" + parseInt(i + 1) + "").html()
                        AddlAprExpArr.push(AddlAprExpObj);
                        AddlAprExpObj = "";
                    }
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
            debugger;
            fnCalculateTotalForEditDoctorCRM();
            var expamount = "";
            limit = fncreditlimit(editRequestCode);

            expamount = $("#txtTotExpense").val()

            if (parseFloat(expamount) > parseFloat(limit)) {
                fnMsgAlert('info', 'Expense Claim Request', 'Your expense amount should not be greater than Request Credit limit.');
                HideModalPopup("dvloading");
                $("#main").unblock();
                return false;
            }

            expenseType = "CRM";
            actualAmount = parseFloat($("#spnTotalClaimAmount").html()).toFixed(2);
            approvedAmount = parseFloat($("#spnTotalApprovedAmount").html()).toFixed(2);
            otherDeductions = parseFloat($("#spnOtherDeductionAmount").html()).toFixed(2);
            debugger;
            detailString = fnReadDoctorCRMClaimEditTable();
        }

        HideModalPopup("dvloading");

        $('#main').block({
            message: '<h3>Saving</h3>',
            css: { border: '2px solid #ddd' }
        });

        debugger;
        //string claimCode, string statusCode, double actualAmount, double approvedAmount, double otherDeductions,
        //                             string remarks, string expenseType, string detailString
        $.ajax({
            type: 'POST',
            data: "claimCode=" + claimCode + "&statusCode=" + statusCode + "&actualAmount=" + actualAmount + "&approvedAmount=" + approvedAmount
                    + "&otherDeductions=" + otherDeductions + "&remarks=" + escape(remarks) + "&expenseType=" + expenseType + "&detailString=" + escape(detailString) + '&modeType=' + mode + '&AddlAprExpLst=' + JSON.stringify(AddlAprExpArr),
            url: '../HiDoctor_Activity/ExpenseClaim/UpdateExpenseClaim',
            success: function (response) {
                if (response != "0") {
                    if (result.toUpperCase() == "CUSTOMER WISE" && customerStockiestArray != null && customerStockiestArray.length > 0) {
                        fnStockiestSave(claimCode);
                    }

                    fnSaveClaimImg(claimCode);
                    fnMsgAlert('success', 'Expense Claim Request', 'Expense Claim Updated successfully');
                    fnSearchExp();
                    $('#dvTabs').tabs('option', 'selected', 1);
                    fnCancelExpenseEdit();
                    fnCancelExpense();

                }
                else if (response == "-1") {
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
                fnClear();
                //$("#UpdateExp").Show();

            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.responseText);
                $("#main").unblock();
                //$("#UpdateExp").Show();
            }
        });
    }
    else {
        HideModalPopup("dvloading");
        return false;
    }
}

function fnCalculateTotalForEditDoctorCRM() {

    var totalExpense = 0.00;
    for (var d = 1; d < $("#tbldocCRMEdit tr").length; d++) {
        if ($.trim($("#txtEDCust_" + d).val()) != "" && $.trim($("#txtEDCust_" + d).val()) != undefined) {
            if (fnCheckNumeric($("#txtEDExp_" + d))) {
                totalExpense += parseFloat($("#txtEDExp_" + d).val());
            }
        }
    }
    $("#txtTotExpense").val(totalExpense.toFixed(2));
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
        if ($("#tblExpDetails tr").length > 1) {
            if ($("input:checkbox[name=checkedExpenseEdit]:checked").length == 0) {
                var IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                if (IsAddlExpense.toUpperCase() == 'NO') {
                    fnMsgAlert('info', 'Expense Claim Request', 'Please select any Expense for Claim.');
                    HideModalPopup("dvloading");
                    return false;
                }
                else if (IsAddlExpense.toUpperCase() == 'YES' && $("input:checkbox[name=checkedExpenseEdit]:checked").length == 0) {
                    if ($('.AprExpRow:visible').length > 0) {
                        var isContains = false;
                        var TotalRow = $('.AprExpRow').length;
                        for (var i = 0; i < TotalRow; i++) {
                            if ($("#AprExpRowId_" + parseInt(i + 1) + "").is(':visible')) {
                                if ($("#AddlExpAmt_" + parseInt(i + 1) + "").val() != "") {
                                    isContains = true;
                                }
                            }
                        }
                        if (!isContains) {
                            fnMsgAlert('info', 'Expense Claim Request', 'Please select any Additional Expense for Claim.');
                            HideModalPopup("dvloading");
                            return false;
                        }
                    }
                }
            }


            for (rowNumber = 1; rowNumber < $("#tblExpDetails tr").length; rowNumber++) {
                if ($("#chkExpEdit_" + rowNumber).is(':checked')) {

                    // Bill number
                    if ($.trim($("#txtBillNumberEdit_" + rowNumber).val()) != "") {
                        if (($("#txtBillNumberEdit_" + rowNumber).val()).length > 100) {
                            fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 100 characters in Reference Details.');
                            HideModalPopup("dvloading");
                            $("#txtBillNumberEdit_" + rowNumber).focus();
                            return false;
                        }

                        if (!(regExforAlphaNumericSpecificRemarks($("#txtBillNumberEdit_" + rowNumber).val()))) {
                            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
                            HideModalPopup("dvloading");
                            $("#txtBillNumberEdit_" + rowNumber).focus();
                            return false;
                        }
                    }

                    // User item wise remarks
                    if ($.trim($("#txtUserRemarksEdit_" + rowNumber).val()) != "") {
                        if (($("#txtUserRemarksEdit_" + rowNumber).val()).length > 1000) {
                            fnMsgAlert('info', 'Expense Claim Request', 'You Can Enter only 1000 characters in Remarks.');
                            HideModalPopup("dvloading");
                            $("#txtUserRemarksEdit_" + rowNumber).focus();
                            return false;
                        }

                        if (!(regExforAlphaNumericSpecificRemarks($("#txtUserRemarksEdit_" + rowNumber).val()))) {
                            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
                            HideModalPopup("dvloading");
                            $("#txtUserRemarksEdit_" + rowNumber).focus();
                            return false;
                        }
                    }
                }
            }
        }
        else {
            fnMsgAlert('info', 'Expense Claim Request', 'You do not have any Expense to Claim.');
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

                    if (!(regExforAlphaNumericSpecificRemarks($("#txtDCust_" + j).val()))) {
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
                        HideModalPopup("dvloading");
                        $("#txtDCust_" + j).focus();
                        return false;
                    }

                    var docJson = jsonPath(d_g, "$.[?(@.label=='" + $("#txtEDCust_" + j).val() + "')]");
                    if (docJson == false || docJson === undefined) {
                        fnMsgAlert('info', 'Expense Claim Request', $("#txtDCust_" + j).val() + ' is not a valid Customer.');
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
                    $("#txtDCust_" + j).focus();
                    return false;
                }
                else {
                    unidDoc.push($("#txtDCust_" + j).val());
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
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
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
                        fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
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
            fnMsgAlert('info', 'Expense Claim Request', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.');
            HideModalPopup("dvloading");
            return false;
        }
    }
    return true;
}

function fnReadFieldExpenseClaimEditTable() {
    var detailString = "";
    for (rowNumber = 1; rowNumber < $("#tblExpDetails tr").length; rowNumber++) {
        if ($("#chkExpEdit_" + rowNumber).is(':checked')) {
            //DCR_Expense_Code,@Expense_Type_Code,@Expense_Amount,@Record_Status,@DCR_Actual_Date,@DCR_Activity_Flag,@Bill_Number
            // dcr.DCR_Expense_Code + "_" + dcr.DCR_Date + "_" + dcr.DCR_Flag + "_" + dcr.Expense_Type_Code

            var checkedVal = $("#chkExpEdit_" + rowNumber).val();
            detailString += checkedVal.split('_')[0] + '^';// dcr expense code
            detailString += checkedVal.split('_')[1] + '^';// dcrDate
            detailString += checkedVal.split('_')[2] + '^';// dcr flag
            detailString += checkedVal.split('_')[3] + '^';// expense type code
            // detailString += 0 + '^';// expense type code
            detailString += $("#tdExpAmountEdit_" + rowNumber).html() + '^';// expense Amount
            detailString += $("#txtBillNumberEdit_" + rowNumber).val() + '^';// bill number
            detailString += $("#txtUserRemarksEdit_" + rowNumber).val() + '^';   // user remarks        
            //detailString += (($("#spnApproved_" + rowNumber).html() == '-') ? parseFloat($("#tdExpAmountEdit_" + rowNumber).html()).toFixed(2) : parseFloat($("#spnApproved_" + rowNumber).html()).toFixed(2)) + '$'; // Approved Amount
            detailString += 0 + '$';


        }
    }
    return detailString;
}

function fnReadDoctorCRMClaimEditTable() {
    debugger;
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
    debugger;
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
function fnAddlAprExpandItemwiseDetails() {
    if ($("#dvAddlAprClaimDetails").is(':visible')) {
        $("#dvAddlAprClaimDetails").hide();
        $("#aAddlAprExpDetails").html('Show');
    }
    else {
        $("#dvAddlAprClaimDetails").show();
        $("#aAddlAprExpDetails").html('Hide');
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
        fnExpenseClaimDetailDoctorCRMPopUp(claimCode, result);
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
    //$('#dvSummaryTabSub').hide();
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
                    fnSearchExp();
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

function fnGetEditCRMStockiestAndProducts(customerCode, rowCount, claimCode) {

    customerCode = $("#hdnEDCust_" + rowCount).val();
    var doctorCode = $("#hdnEDCust_" + rowCount).val().split('_')[0];
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
    var custname = $('#txtEDCust_' + rowCount).val();
    var doctorCode = $("#hdnEDCust_" + rowCount).val().split('_')[0];

    $.ajax({
        type: 'POST',
        data: "customerCode=" + customerCode.split('_')[0] + "&DoctorName=" + custname + "&DocCode=" + doctorCode + "&claimCode=" + claimCode + "&rowId=" + rowCount,
        url: '../HiDoctor_Activity/ExpenseClaim/GetCRMCustomerDetails',
        async: false,
        success: function (jsData) {

            content += "<div><h3 style='width: 99.5%;margin:0px auto'>";
            if (custname == "") {
                fnMsgAlert('info', 'Expense Claim Request', 'Customer Name cannot be empty');
                $('#btnSaveOrEdit').val('Save Stockiest');
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
    fnGetCRMStockiestAndProducts(true); // editMode set as true.
    fnGetCRMCustomerAndProducts(customerCode);

}

//Ajax call for CRMRequest=>stockiest and product mapping
function fnGetCRMStockiestAndProducts(isEditMode) {
    debugger;
    var favouringUserCode = "";
    if ($('select[name="ddlFavouringUser"]').val() == "-1") {
        favouringUserCode = $("#hdnFavouringUser").val();
    }
    else {
        favouringUserCode = $("#ddlFavouringUser").val();
    }


    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/ExpenseClaim/GetCRMStockiestAndProduct',
        data: "userCode=" + favouringUserCode,
        success: function (jsData) {

            $("#dvAjaxLoad").show();
            //Load Stockiest
            var StockiestJson = jsData[0];
            var ProductJson = jsData[1];
            var Stockiest = '[';

            for (var b = 0; b < StockiestJson.Data.length; b++) {

                Stockiest += '{label:' + '"' + "" + StockiestJson.Data[b].Customer_Name + '_' + StockiestJson.Data[b].Region_Name + "" + '",' + "value:" + '"' + "" + StockiestJson.Data[b].Customer_Code + "" + '"' + '}';
                if (b < StockiestJson.Data.length - 1) {
                    Stockiest += ",";
                }
            }
            Stockiest += '];';
            StockiestJson_g = eval(Stockiest);
            autoComplete(StockiestJson_g, "txtStockiest", "hdnStockiest", "autoCustStock");

            //Load Product
            var Product = '['

            for (var p = 0; p < ProductJson.Data.length; p++) {
                Product += '{label:' + '"' + "" + ProductJson.Data[p].Product_Name + "" + '",' + "value:" + '"' + "" + ProductJson.Data[p].Product_Code + '"' + '}';
                if (p < ProductJson.Data.length - 1) {
                    Product += ",";
                }
            }

            Product += '];';
            ProductJson_g = eval(Product);
            autoComplete(ProductJson_g, "txtProduct", "hdnProduct", "autoCustProduct");

            $("#dvAjaxLoad").hide();
        }

    });

}

$('#dvStockiest').click(function () {
    $('#btnSaveOrEdit').val('Save Stockiest');
});

function StockiestPopup(i, claimCode) {
    debugger;
    popup = true;
    var mode = "Save";
    var custname = "";
    if (claimCode == "" || claimCode == null) {
        custname = $('#txtDCust_' + i).val().trim();
    }
    else {
        custname = $('#txtEDCust_' + i).val().trim();
    }
    if (custname == "") {
        fnMsgAlert('info', 'Expense Claim Request', 'Customer Name cannot be empty');
        $('#btnSaveOrEdit').val('Save Stockiest');
        fnStockiestClose();
        return false;
    }
    var doctorCode = "";
    if (claimCode == "" || claimCode == null) {
        customerCode = $("#hdnDCust_" + i).val();
        doctorCode = $("#hdnDCust_" + i).val().split('_')[0];
    }
    else {
        customerCode = $("#hdnEDCust_" + i).val();
        doctorCode = $("#hdnEDCust_" + i).val().split('_')[0];
    }

    if ($("#hdn_StockiestProductJson_" + i).val() == "") {
        if (claimCode != "" && claimCode != undefined) {
            fnGetEditCRMStockiestAndProducts(customerCode, i, claimCode);
            return;

        }
    }
    debugger;
    if ($("#hdn_StockiestProductJson_" + i).val() != "") {
        var customerArray = new Array();
        customerArray = eval($("#hdn_StockiestProductJson_" + i).val());
        content = "";
        debugger;

        content += "<div><h3 style='width: 99.5%;margin:0px auto'>";

        content += "<div id='dvCustomerName' style='width:99.5%;margin:3px auto;font-weight: bold;font-style: italic;font-size: 20px;'>" + custname + "</div><input type='hidden' id='hdnDoctorRowNum' value='" + i + "'/><input type='hidden' id='hdn_DoctorCode' value='" + doctorCode + "'/>";
        for (var j = 0; j < customerArray.length; j++) {
            var rowIndex = j + 1;
            content += "<div id='dvstockiest_" + rowIndex + "'><table id='tblStockiestEntry_" + rowIndex + "' cellspacing='0' cellpadding='0'>";
            content += "<tbody><tr><td style='vertical-align: middle;font-weight: bold;width:26%'>Stockiest Name</td><td style='width:70%'><input type='text' style='margin: 6px;' value='" + customerArray[j].Stockiest.StockietName + "'  onkeyup='fnCreateNewRowStock(this);' id='txtStockiest_" + rowIndex + "' class='input-large form-control autoCustStock'/>";
            content += "<input type='hidden' id='hdnStockiest_" + rowIndex + "' value=" + customerArray[j].Stockiest.StockiestCode + " /></td></tr></tbody>";
            content += "<div id='dvProduct'><table class='table table-striped' id='txtStockiest_" + rowIndex + "_tblProductEntry_" + rowIndex + "' cellspacing='0' cellpadding='0'>";
            content += "<thead><tr style='font-weight:bold'><th>Product</th><th>Percentage</th></tr>";
            content += "</thead><tbody>";
            for (var p = 0; p < customerArray[j].Products.length; p++) {
                var prodIndex = p + 1;
                content += "<tr><td><input type='text' id='tblStockiestEntry_" + rowIndex + "_txtProduct_" + prodIndex + "' value='" + customerArray[j].Products[p].Product_Name + "' onkeyup='fnCreateNewRowProduct(this);' class='input-large form-control autoCustProduct'/>";
                content += "<input type='hidden'  value=" + customerArray[j].Products[p].Product_Code + " id='tblStockiestEntry_" + rowIndex + "_hdnProduct_" + prodIndex + "' /></td>";
                content += "<td><input type='text' value=" + customerArray[j].Products[p].Percentage + " id='tblStockiestEntry_" + rowIndex + "_txtPercentage_" + prodIndex + "' onkeyup='return isNumberKey(event);'  class='input-large form-control'/>";
                content += "<input type='hidden' id='tblStockiestEntry_" + rowIndex + "_hdnPercentage_1' /></td>";
                content += "</tr>";
            }

        }
        if (customerArray.length == 1) {
            content += "<div id='dvstockiest_" + 2 + "'><table id='tblStockiestEntry_" + 2 + "' cellspacing='0' cellpadding='0'>";
            content += "<tbody><tr><td style='vertical-align: middle;font-weight: bold;width:26%'>Stockiest Name</td><td style='width:70%'><input type='text' style='margin: 6px;'  onkeyup='fnCreateNewRowStock(this);' id='txtStockiest_" + 2 + "' class='input-large form-control autoCustStock'/>";
            content += "<input type='hidden' id='hdnStockiest_" + 2 + "' /></td></tr></tbody>";
            content += "<div id='dvProduct'><table class='table table-striped' id='txtStockiest_" + 2 + "_tblProductEntry_" + 2 + "' cellspacing='0' cellpadding='0'>";
            content += "<thead><tr style='font-weight:bold'><th>Product</th><th>Percentage</th></tr>";
            content += "</thead><tbody>";
            content += "<tr><td><input type='text' id='tblStockiestEntry_" + 2 + "_txtProduct_" + 1 + "'  onkeyup='fnCreateNewRowProduct(this);' class='input-large form-control autoCustProduct'/>";
            content += "<input type='hidden' id='tblStockiestEntry_" + 2 + "_hdnProduct_" + 1 + "' /></td>";
            content += "<td><input type='text' id='tblStockiestEntry_" + 2 + "_txtPercentage_" + 1 + "' onkeyup='return isNumberKey(event);'  class='input-large form-control'/>";
            content += "<input type='hidden' id='tblStockiestEntry_" + 2 + "_hdnPercentage_1' /></td>";
            content += "</tr>";
        }
        content += "</table></table></div></div>";
        button = "<div id='dvstockiest_" + rowIndex + "_dvButton_1'><table><tr><td><input type='button' class='btn btn-primary autoCust' value='Save' onclick='fnStockiestProductValidate(" + i + ");'/></td>";
        button += "<td><input type='button' class='btn btn-primary autoCust' value='Cancel' onclick='fnStockiestClose();'></td></tr></table></div>";

        $("#dvStock").html(content);
        $(".dvpopfooter").html(button);
        fnGetCRMStockiestAndProducts();
        $("#dvStockiest").overlay().load();
    }

    else {
        debugger;
        content = "";

        content += "<div><h3 style='width: 99.5%;margin:0px auto'>";

        content += "<div id='dvCustomerName' style='width:99.5%;margin:3px auto;font-weight: bold;font-style: italic;font-size: 20px;'>" + custname + "</div><input type='hidden' id='hdnDoctorRowNum' value='" + i + "'/><input type='hidden' id='hdn_DoctorCode' value='" + doctorCode + "'/>";
        for (var j = 1; j <= 1; j++) {
            content += "<div id='dvstockiest_" + j + "'><table id='tblStockiestEntry_" + j + "' cellspacing='0' cellpadding='0'>";
            content += "<tbody><tr><td style='vertical-align: middle;font-weight: bold;width:26%'>Stockiest Name</td><td style='width:70%'><input type='text' style='margin: 6px;'  onkeyup='fnCreateNewRowStock(this);' id='txtStockiest_" + j + "' class='input-large form-control autoCustStock'/>";
            content += "<input type='hidden' id='hdnStockiest_" + j + "' /></td></tr></tbody>";
            content += "<div id='dvProduct'><table class='table table-striped' id='txtStockiest_" + j + "_tblProductEntry_" + j + "' cellspacing='0' cellpadding='0'>";
            content += "<thead><tr style='font-weight:bold'><th>Product</th><th>Percentage</th></tr>";
            content += "</thead><tbody>";
            content += "<tr><td><input type='text' id='tblStockiestEntry_" + j + "_txtProduct_1' onkeyup='fnCreateNewRowProduct(this);' class='input-large form-control autoCustProduct'/>";
            content += "<input type='hidden' id='tblStockiestEntry_" + j + "_hdnProduct_1' /></td>";
            content += "<td><input type='text' id='tblStockiestEntry_" + j + "_txtPercentage_1' onkeyup='return isNumberKey(event);'  class='input-large form-control'/>";
            content += "<input type='hidden' id='tblStockiestEntry_" + j + "_hdnPercentage_1' /></td>";
            content += "</tr></table></table></div></div>";

            //if (j == 1) {
            //    button = "<div id='dvstockiest_" + j + "_dvButton_1'><table><tr><td><input type='button' class='btn btn-primary autoCust' value='Save' onclick='fnStockiestProductValidate(" + i + ");'/></td>";
            //    button += "<td><input type='button' class='btn btn-primary autoCust' value='Cancel' onclick='fnStockiestClose();'></td></tr></table></div>";
            //}
        }

        $("#dvStock").html(content);
        //$(".dvpopfooter").html(button);
        fnGetCRMStockiestAndProducts();
        $("#dvStockiest").overlay().load();
    }
    //customer_Name = $("#dvCustomerName").val();
    rownum = "3";
    rowProd = "2";
}



function fnCreateNewRowStock(id, mode) {
    debugger;
    //var row = parseInt(id + 1);
    var row = id.id.split('_');
    var rowcount = parseInt(row[1]) + 1;

    $("#txtStockiest_" + row[1])[0].onkeyup = null;
    $("#txtStockiest_" + row[1])[0].ondblclick = null;
    var tblContent = "";
    button = "";
    tblContent += "<div id='dvstockiest_" + rowcount + "'>";
    tblContent += "<table id='tblStockiestEntry_" + rowcount + "' cellspacing='0' cellpadding='0'>";
    tblContent += "<tbody><tr><td style='vertical-align: middle;font-weight: bold;width:26%'>Stockiest Name</td><td style='width:70%'><input type='text' style='margin: 6px;'  onkeyup='fnCreateNewRowStock(this);' id='txtStockiest_" + rowcount + "' class='input-large form-control autoCustStock'/>";
    tblContent += "<input type='hidden' id='hdnStockiest_" + rowcount + "' /></td></tr></tbody>";
    //tblContent += "<tbody><tr><td><input type='text' style='margin: 6px;' id='txtStockiest_" + rowcount + "' onkeyup='fnCreateNewRowStock(this);'  class='input-large form-control autoCustStock'/><input type='hidden' id='hdnStockiest_" + rowcount + "' />";
    //tblContent += "</td></tr></tbody>";
    tblContent += "<table class='table table-striped' id='txtStockiest_" + rowcount + "_tblProductEntry_" + rowcount + "' cellspacing='0' cellpadding='0'>";
    tblContent += "<thead><tr style='font-weight:bold'><th>Product</th><th>Percentage</th></tr>";
    tblContent += "</thead><tbody>";
    tblContent += "<tr><td><input type='text' id='tblStockiestEntry_" + rowcount + "_txtProduct_1'  onkeyup='fnCreateNewRowProduct(this);'  class='input-large form-control autoCustProduct'/><input type='hidden' id='tblStockiestEntry_" + rowcount + "_hdnProduct_1' /></td>";
    tblContent += "<td><input type='text' id='tblStockiestEntry_" + rowcount + "_txtPercentage_1' onkeyup='return isNumberKey(event);' class='input-large form-control'/><input type='hidden' id='tblStockiestEntry_" + rowcount + "_hdnPercentage_1' />";
    tblContent += "</td></tr></table></table><div id='dvstockiest_" + rowcount + "_dvButton_" + rowcount + "'>";
    button = "<table><tr><td><input type='button' class='btn btn-primary autoCust' value='Save' onclick='fnStockiestProductValidate(" + row + ");'/></td>";
    button += "<td><input type='button' class='btn btn-primary autoCust' value='Cancel' onclick='fnStockiestClose();'></td></tr></table></div>";

    $('#dvStock').append(tblContent);
    //$("#dvstockiest_" + rownum + "_dvButton_" + rownum).append(button);
    //$(".dvpopfooter").html(button);

    if (mode == 'Edit') {
        fnGetCRMStockiestAndProducts(true);
    }
    else {
        fnGetCRMStockiestAndProducts();
    }
    fnGetCRMStockiestAndProducts();
    rownum = parseInt(rownum) + 1;
    //$("#txtStockiest_" + rowcount)[0].onkeyup = null;
    //$("#txtStockiest_" + rowcount)[0].ondblclick = null;

}


function fnCreateNewRowProduct(id) {
    debugger;
    var tblContent = "";
    var rowid = id.id.split('_');

    var prodid = parseInt(rowid[3]) + 1;
    tblContent += "<tr><td><input type='text' id='" + rowid[0] + "_" + rowid[1] + "_" + rowid[2] + "_" + prodid + "' onkeyup='fnCreateNewRowProduct(this);' ondblclick='fnCreateNewRowProduct(this);' class='input-large form-control autoCustProduct'/><input type='hidden' id= '" + rowid[0] + "_" + rowid[1] + "_" + 'hdnProduct_' + prodid + "' /></td>";
    tblContent += "<td><input type='text' onkeyup='return isNumberKey(event);' id='" + rowid[0] + "_" + rowid[1] + '_txtPercentage_' + prodid + "' class='input-large form-control checkexpnumeric'/><input type='hidden' id='hdnPercentage_" + prodid + "' /></td></tr></table>";

    $("#txtStockiest_" + rowid[1] + "_tblProductEntry_" + rowid[1] + " tbody").append(tblContent);
    rowProd = parseInt(rownum) + 1;
    $(id)[0].onkeyup = null;
    $(id)[0].ondblclick = null;
    fnGetCRMStockiestAndProducts();
}

//function fnCRMStockiestEventBinder() {
//    
//    $(".autoCustStock").keypress(function () { fnCreateNewRowStock(this); });
//    $(".autoCustProduct").dblclick(function () { fnCreateDocCRMEntryRow(this); });

//}

function fnStockiestSave(claimCode) {

    debugger;
    //$("#dvAjaxLoad").show();

    var tblContent = "";

    var ar = new Array();
    var index = 0;
    for (index = 0; index < customerStockiestArray.length; index++) {
        customerStockiestArray[index].Claim_Code = claimCode;

    }

    var a = {};
    a.name = "customerProducts_arr";
    a.value = customerStockiestArray;
    a.type = "JSON";
    ar.push(a);


    var favoringUserCode = $('select[name="ddlFavouringUser"]').val();

    HDAjax.requestInvoke("ExpenseClaim", "InsertCRMExpenseClaim", ar, "POST",
               function (jsonResult) {
                   if (jsonResult == "SUCCESS") {
                       fnStockiestClose();
                   }
                   else {

                       fnMsgAlert('info', 'Failure', jsonResult);
                   }

               },
                     function (e) {
                         fnMsgAlert("info", "CRM Request", "There is some issue. Please contact support team.");
                         $('.dash-content-wrapper').unblock();
                         $.unblockUI();

                     },
                    function () {
                        $('.dash-content-wrapper').unblock();
                        $.unblockUI();
                    });
}

function fnStockiestProductValidate() {
    debugger;
    var i = $("#hdnDoctorRowNum").val()
    var flag = true;
    var rowlength = $('.autoCustStock').length;
    var StockName = "", hdnStock = "", ProductName = "", Percentage = "", hdnProd = "", hdnPercen = "";

    for (var a = 1 ; a <= rowlength ; a++) {
        debugger;
        customer_Name = $("#hdnStockiest_" + a).val();
        var productlength = $("#txtStockiest_" + a + "_tblProductEntry_" + a + " tr").length;
        productlength = parseInt(productlength) - 1;
        for (var p = 1; p <= productlength; p++) {

            if ($("#txtStockiest_" + a).val() == "") {
                $("#hdnStockiest_" + a).val('');
            }



            if ($("#tblStockiestEntry_" + a + "_txtProduct_" + p).val() != "") {
                if ($("#txtStockiest_" + a).val() == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Stockiest  name cannot be empty');
                    $("#tblStockiestEntry_" + a).val('');
                    $("#tblStockiestEntry_" + a).focus();
                    return false;

                }
            }
            if ($("#tblStockiestEntry_" + a + "_txtProduct_" + p).val() == "") {
                $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val('');
            }


            if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != "" && $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != undefined) {

                if ($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val() == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Percentage cannot be empty');
                    $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val('');
                    $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).focus();
                    return false;


                }
            }

            if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != "" && $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != undefined) {
                if ($("#txtStockiest_" + a).val() == "") {
                    fnMsgAlert('info', 'Expense Claim Request', 'Stockiest  name cannot be empty');
                    $("#tblStockiestEntry_" + a).val('');
                    $("#tblStockiestEntry_" + a).focus();
                    return false;
                }
            }


            if ($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val() != "" && $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val() != undefined) {
                if (fnPercentageCheck($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val()) == false) {
                    fnMsgAlert('info', 'Expense Claim Request', 'Percentage cannot be greater than 100');
                    $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val('');
                    $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).focus();
                    return false;
                }
            }
        }
    }

    fnGetCRMStockiestAndProducts();
    debugger;
    var c = [];
    var b = "";
    var productName = "";
    var stockiestName = "";
    var stockProdJson = {};
    var prodJson = {};
    var ProdArrayJson = new Array();
    var a = 0;
    customerStockJSONPreffill = new Array();
    for (a = 1 ; a <= rowlength ; a++) {
        debugger;
        if ($("#hdnStockiest_" + a).val() != "" && $("#hdnStockiest_" + a).val() != undefined) {
            stockProdJson = {};
            ProdArrayJson = new Array();
            if ($("#txtStockiest_" + a).val() == "") {
                $("#hdnStockiest_" + a).val('');
            }


            customer_code = $("#hdnStockiest_" + a).val();
            if (customer_code != "") {
                customer_Name = $("#txtStockiest_" + a).val();
                var productlength = $("#txtStockiest_" + a + "_tblProductEntry_" + a + " tr").length;
                productlength = parseInt(productlength) - 1;





                fnGetCRMStockiestAndProducts();

                if ($("#hdnStockiest_" + a).val() != "" && $("#hdnStockiest_" + a).val() != undefined) {
                    var validCustomer = jsonPath(CRMCustomerAndProductsJson, "$.[?(@.label=='" + $("#hdnStockiest_" + a).val() + "')]");
                    if (validCustomer == false) {
                        fnMsgAlert("info", "Stockiest Customer", "Invalid Customer Name");
                        $("#txtStockiest_" + a).val('');
                        $("#txtStockiest_" + a).focus();
                        fnGetCRMStockiestAndProducts();
                        return false;
                    }
                }
                ProdArrayJson = new Array();
                var p = 1
                for (p = 1; p <= productlength; p++) {


                    debugger;
                    if ($("#txtStockiest_" + a).val() == "") {
                        $("#hdnStockiest_" + a).val('');
                    }
                    //if ($("#tblStockiestEntry_" + a + "_txtProduct_" + p).val() == "") {
                    //    $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val('');
                    //    hdnProd = "";
                    //}


                    if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != "") {
                        hdnProd = $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val();
                    }

                    if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() == "") {
                        hdnProd = "";
                    }

                    if (/^[0-9]*$/.test($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val()) == false) {
                        fnMsgAlert("info", "CRM Request", "Decimal values are not allowed for Percentage");
                        $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val('');
                        $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').focus();
                        return false;
                    }


                    if (Math.round($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val()) != $("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val()) {
                        fnMsgAlert("info", "CRM Request", "Enter only numeric values in Percentage");
                        $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val('');
                        $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').focus();
                        return false;
                    }

                    if (!isNaN($("#tblStockiestEntry_" + a + "_txtPercentage_" + p).val())) {
                        hdnPercen = $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val();
                    }
                    else {
                        fnMsgAlert("info", "CRM Request", "Enter only numbers for Percentage");
                        $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val('');
                        $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').focus();
                        return false;
                    }
                    debugger;
                    if ($("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != "" && $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() != undefined) {
                        var product = jsonPath(ProductJson_g, "$.[?(@.value=='" + $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val() + "')]");
                        debugger;
                        if (product == false) {
                            debugger;
                            fnMsgAlert("info", "CRM Request", "Invalid Product");
                            $('#tblStockiestEntry_' + a + '_txtProduct_' + p + '').focus();
                            return false;
                        }
                    }


                    hdnPercen = $('#tblStockiestEntry_' + a + '_txtPercentage_' + p + '').val();
                    hdnProd = $("#tblStockiestEntry_" + a + "_hdnProduct_" + p).val();
                    doctorCode = $('#hdn_DoctorCode').val();
                    doctorName = $('#dvCustomerName').html().split('_')[0];
                    productName = $("#tblStockiestEntry_" + a + "_txtProduct_" + p).val();
                    StockName = $("#txtStockiest_" + a).val();

                    debugger;
                    if (customer_code != "" && hdnProd != "") {

                        var d = {};
                        d.Customer_Code = doctorCode
                        d.Base_Code = customer_code;
                        d.Product_Code = hdnProd;
                        d.Percentage = hdnPercen;
                        d.Product_Name = productName;
                        d.Stock_Name = StockName;

                        b = doctorCode + "-" + customer_code + "-" + hdnProd;
                        if ($.inArray(b, c) != -1) {
                            fnMsgAlert("info", "CRM Request", "Duplication of Doctor : " + doctorName + "<br/>, Customer: " + customer_Name + "<br/> and Product: " + productName + " is not allowed");
                            return false;
                        }
                        else {
                            c.push(b);

                            prodJson = {};
                            prodJson.Product_Code = hdnProd;
                            prodJson.Product_Name = productName;
                            prodJson.Percentage = hdnPercen;
                            ProdArrayJson.push(prodJson);

                        }
                        debugger;
                        customerStockiestArray.push(d);
                    }

                    hdnProd = "";
                    hdnPercen = "";
                }
                stockProdJson.Doctor_Code = doctorCode;
                stockProdJson.StockiestCode = customer_code;
                stockProdJson.StockietName = StockName;
                var custStockJsonData = {};

                custStockJsonData.Stockiest = stockProdJson;
                custStockJsonData.Products = ProdArrayJson;
                customerStockJSONPreffill.push(custStockJsonData);
                debugger;
                //console.log(customerStockJSONPreffill);
                // console.log(i);
                $("#hdn_StockiestProductJson_" + i).val(JSON.stringify(customerStockJSONPreffill));
                customer_Name = "";
            }
            customer_Name = $("#dvCustomerName").val();
        }
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

function fnRemrksView(remarks) {
    if ($.trim(remarks).length > 0)
    { alert(remarks); }
}
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
    if ($("#DateDrpDaily").val() != "") {
        dateSplit = $("#DateDrpDaily").val().split('-');
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
        fnLoadloggeduserData();
    }
    else {

        SelectedUserCode = $('select[name="UserSrch"]').val();
        type = 'fav';
        userName = $('select[name="UserSrch"]').text();
        userName = userName.split('-')[0];
    }



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

function fnAddlDcrExpDet(Dcr_From, Dcr_To, nonEditMode) {
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
        data: "userCode=" + favouringUser + "&Dcr_From=" + Dcr_From + "&Dcr_To=" + Dcr_To,
        url: '../HiDoctor_Activity/ExpenseClaim/GetAddlDcrExpDet',
        async: false,
        success: function (response) {
            if (response != "" && response != null) {
                debugger;
                AddlExpDet_g = response[0].lstDcrExp;
                AddlExpTypeDet_g = response[0].lstUserExpDet;
                ExpTableContent += "<table id='AddlExpTbl' class='table table-striped' cellspacing='0' cellpadding='0'>";
                ExpTableContent += "<thead><tr><th>DCR Date</th><th>Flag</th><th>Category</th>";
                ExpTableContent += "<th>Expense Type</th><th>Expense Amount</th>";
                ExpTableContent += "<th>Reference Details</th><th>Remarks</th><th>Action</th></tr></thead><tbody>";
                ExpTableContent += "<tr id='ExpRow_1' class='AddlExpCls'><td><input type='text' style='width: 90px;' value='' id='DcrDateTxt_1' class='form-control AutoDcrDate' onblur ='fnValidateAutofill(this," + 'AutoComplete_DcrDate' + ",\"DcrDateTxt\",\"hdnDcrDate\");fnGetDcrFlag(1);' autocomplete='off'/><input type='hidden' class='hdnDcrDateCls' id='hdnDcrDate_1'></td>";
                ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='DcrFlagTxt_1' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + 'AutoComplete_Ovr_DcrFlag' + ",\"DcrFlagTxt\",\"hdnDcrFlag\");fnGetDcrCategory(1);' autocomplete='off' disabled/><input type='hidden' class='hdnDcrFlagCls' id='hdnDcrFlag_1'></td>";
                ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='DcrCatTxt_1' class='form-control AutoDcrCat' onblur ='fnValidateAutofill(this," + 'AutoComplete_Dcr_Category' + ",\"DcrCatTxt\",\"hdnDcrCat\");' autocomplete='off' disabled/><input type='hidden' class='hdnDcrCatCls' id='hdnDcrCat_1'></td>";
                ExpTableContent += "<td><input type='text' style='width: 90px;' value='' id='ExpTypeTxt_1'  class='form-control AutoDcrExpCls' onclick='fnGetDcrExpense(1);' disabled/><input type='hidden' class='hdnDcrExpCls' id='hdnDcrExp_1'></td>";
                ExpTableContent += "<td><input type='text' value='' style='width: 90px;' id='ExpAmt_1' class='form-control' disabled/><input type='hidden' id='ExpMode_1' value=''/></td>";
                ExpTableContent += "<td><input type='text' value='' style='width: 100px;' id='RefTxt_1' class='form-control'/></td>";
                ExpTableContent += "<td><input type='text' value='' style='width: 100px;' id='RemTxt_1' class='form-control'/></td>";
                ExpTableContent += "<td><a style='cursor:pointer;' onclick='FnCreateRow(1)'><i id='plus_1' class='fa fa-plus' style='font-size:18px;color:green;'></i></a>&nbsp;<a style='cursor:pointer;' onclick='FnClearRowData(1)'><i class='fa fa-remove' style='font-size:21px;color:red;'></i></a></td></tr>";
                ExpTableContent += "</tbody></table>";
                $("#AddlExpense").html(ExpTableContent);
                var dcrUniqueDate = [];
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
// Dcr Flag autocomplete
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
                $("#DcrFlagTxt_" + RowId + "").attr('disabled', false);
            }
            $("#DcrDateTxt_" + RowId + "").attr('disabled', true);
        }
    }
}
function fnGetDcrFlagEdit(RowId) {
    debugger;
    var DcrSelDate = $("#hdnAddlDateEdit_" + RowId + "").val();
    if (DcrSelDate != "") {
        AutoComplete_Ovr_DcrFlag = $.grep(AddlExpDet_g, function (element, index) {
            return (element.DCR_Date === DcrSelDate)
        });
        if (AutoComplete_Ovr_DcrFlag.length > 0) {
            if (AutoComplete_Ovr_DcrFlag.length == 1) {
                $("#AddlDcrFlag_" + RowId + "").val(AutoComplete_Ovr_DcrFlag[0].DCR_Flag);
                $("#hdnAddlFlagEdit_" + RowId + "").val(AutoComplete_Ovr_DcrFlag[0].DCR_Flag);
                fnGetDcrCategoryEdit(RowId);
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
                autoComplete(AutoComplete_Ovr_DcrFlag, "AddlDcrFlag", "hdnAddlFlagEdit", "AutoDcrFlag");
                $("#AddlDcrFlag_" + RowId + "").attr('disabled', false);
            }
            $("#AddlDcrDate_" + RowId + "").attr('disabled', true);
        }
    }
}
//DCR Category autocomplete
function fnGetDcrCategory(RowId) {
    debugger;
    var DcrSelDate = $("#DcrDateTxt_" + RowId + "").val();
    var DcrSelFlag = $("#DcrFlagTxt_" + RowId + "").val();
    if (DcrSelFlag != "" && DcrSelDate != "") {
        AutoComplete_Dcr_Category = $.grep(AddlExpDet_g, function (element, index) {
            return (element.DCR_Flag === DcrSelFlag && element.DCR_Date === DcrSelDate)
        });
        if (AutoComplete_Dcr_Category.length > 0) {
            if (AutoComplete_Dcr_Category.length == 1) {
                $("#DcrCatTxt_" + RowId + "").val(AutoComplete_Dcr_Category[0].Category);
                $("#hdnDcrCat_" + RowId + "").val(AutoComplete_Dcr_Category[0].Category);
            }
            else {
                var DcrCatLst = "[";
                for (var i = 0; i < AutoComplete_Dcr_Category.length; i++) {
                    DcrCatLst += "{label:" + '"' + "" + AutoComplete_Dcr_Category[i].Category + "" + '",' + "value:" + '"' + "" + AutoComplete_Dcr_Category[i].Category + "" + '"' + "}";
                    if (i < AutoComplete_Dcr_Category.length - 1) {
                        DcrCatLst += ",";
                    }
                }
                DcrCatLst += "];";
                AutoComplete_Dcr_Category = eval(DcrCatLst)
                autoComplete(AutoComplete_Dcr_Category, "DcrCatTxt", "hdnDcrCat", "AutoDcrCat");
            }
            $("#DcrFlagTxt_" + RowId + "").attr('disabled', true);
            $("#ExpTypeTxt_" + RowId + "").attr('disabled', false);
        }
    }
}
function fnGetDcrCategoryEdit(RowId) {
    debugger;
    var DcrSelDate = $("#hdnAddlDateEdit_" + RowId + "").val();
    var DcrSelFlag = $("#hdnAddlFlagEdit_" + RowId + "").val();
    if (DcrSelFlag != "" && DcrSelDate != "") {
        AutoComplete_Dcr_Category = $.grep(AddlExpDet_g, function (element, index) {
            return (element.DCR_Flag === DcrSelFlag && element.DCR_Date === DcrSelDate)
        });
        if (AutoComplete_Dcr_Category.length > 0) {
            if (AutoComplete_Dcr_Category.length == 1) {
                $("#AddlCat_" + RowId + "").val(AutoComplete_Dcr_Category[0].Category);
                $("#hdnAddlCatEdit_" + RowId + "").val(AutoComplete_Dcr_Category[0].Category);
            }
            else {
                var DcrCatLst = "[";
                for (var i = 0; i < AutoComplete_Dcr_Category.length; i++) {
                    DcrCatLst += "{label:" + '"' + "" + AutoComplete_Dcr_Category[i].Category + "" + '",' + "value:" + '"' + "" + AutoComplete_Dcr_Category[i].Category + "" + '"' + "}";
                    if (i < AutoComplete_Dcr_Category.length - 1) {
                        DcrCatLst += ",";
                    }
                }
                DcrCatLst += "];";
                AutoComplete_Dcr_Category = eval(DcrCatLst)
                autoComplete(AutoComplete_Dcr_Category, "AddlCat", "hdnAddlCatEdit", "AutoDcrCat");
            }
            $("#AddlDcrFlag_" + RowId + "").attr('disabled', true);
            $("#AddlExpType_" + RowId + "").attr('disabled', false);
        }
    }
}
//Dcr Expense Modal for entering expense type name and expense amount
function fnGetDcrExpense(RowId) {
    debugger;
    ExpenseRow = RowId;
    $("#ExpNameModal").val('');
    $("#hdnExpCodeModal").val('');
    $("#ExpAmtModal").val('');
    $("#myModal").modal();
    var FormattedDate = "";
    var Date = "";
    var DcrSelDate = $("#DcrDateTxt_" + RowId + "").val();
    if (DcrSelDate != "") {
        var DateSplit = $("#DcrDateTxt_" + RowId + "").val().split('/');
        FormattedDate = DateSplit[1] + '/' + DateSplit[0] + '/' + DateSplit[2];
        Date = DateSplit[2] + '-' + DateSplit[1] + '-' + DateSplit[0];
    }
    var favouringUser = $('select[name="ddlFavouringUser"]').val();
    var DcrSelFlag = $("#DcrFlagTxt_" + RowId + "").val();
    var Flag = '';
    if (DcrSelFlag == 'FIELD') {
        Flag = 'F';
    }
    else {
        Flag = 'A';
    }
    var DcrSelCat = $("#DcrCatTxt_" + RowId + "").val();
    if (FormattedDate != "" && DcrSelFlag != "" && DcrSelCat != "") {
        $.ajax({
            type: 'GET',
            data: "userCode=" + favouringUser + "&DcrDate=" + Date + "&Flag=" + Flag,
            url: '../HiDoctor_Activity/ExpenseClaim/GetAdditionalExpense',
            async: false,
            success: function (response) {
                var DCRautoComplete = response;
                autoComplete_DcrExp = $.grep(DCRautoComplete, function (element, index) {
                    debugger;
                    if (element.Expense_Entity != null) {
                        return (element.Expense_Entity.trim() === DcrSelCat)
                    }
                    else {
                        return (element.Expense_Entity === null)
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
            },
            error: function () {

            }
        });



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
    var DcrSelDate = $("#hdnAddlDateEdit_" + RowId + "").val();
    if (DcrSelDate != "") {
        var DateSplit = $("#hdnAddlDateEdit_" + RowId + "").val().split('/');
        FormattedDate = DateSplit[1] + '/' + DateSplit[0] + '/' + DateSplit[2];
    }
    var DcrSelFlag = $("#hdnAddlFlagEdit_" + RowId + "").val();
    var DcrSelCat = $("#hdnAddlCatEdit_" + RowId + "").val();
    if (FormattedDate != "" && DcrSelFlag != "" && DcrSelCat != "") {
        var autoComplete_DcrExp = $.grep(AddlExpTypeDet_g, function (element, index) {
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
                $("#AddlExpType_" + RowId + "").val(autoComplete_DcrExp[0].Expense_Type_Name);
                $("#hdnAddlExpEdit_" + RowId + "").val(autoComplete_DcrExp[0].Expense_Type_Code);
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
function fnAddExpDetails() {
    debugger;
    if ($("#hdnDcrDate_" + ExpenseRow + "").val() == "") {
        $("#myModal").modal('hide');
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Date for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#hdnDcrFlag_" + ExpenseRow + "").val() == "") {
        $("#myModal").modal('hide');
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Flag for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#hdnDcrCat_" + ExpenseRow + "").val() == "") {
        $("#myModal").modal('hide');
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Category for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#ExpNameModal").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Type for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#hdnExpCodeModal").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Expense Type for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#ExpAmtModal").val() == "") {
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Amount for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if (/^[0-9]+([.][0-9]+)?$/g.test($("#ExpAmtModal").val()) == false) {
        fnMsgAlert('info', 'Expense Additional Claim', 'Please enter Integer Value in Expense Amount for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    var dcrdate = $("#hdnDcrDate_" + ExpenseRow + "").val();
    var splitDate = dcrdate.split('/');
    var formatDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2];
    var dcrflag = $("#hdnDcrFlag_" + ExpenseRow + "").val();
    var dcrcat = $("#hdnDcrCat_" + ExpenseRow + "").val();
    var dcrexpname = $("#ExpNameModal").val();
    var dcrexptypecode = $("#hdnExpCodeModal").val();
    var dcrexpamt = $("#ExpAmtModal").val();
    var userCode = $('select[name="ddlFavouringUser"]').val();
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
                    if ($("#hdnDcrDate_" + parseInt(i + 1) + "").val() != "") {
                        if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate == $("#hdnDcrDate_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Claim', '' + dcrexpname + ' already claimed for ' + dcrdate + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate != $("#hdnDcrDate_" + parseInt(i + 1) + "").val()) {
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
                    if ($("#hdnDcrDate_" + parseInt(i + 1) + "").val() != "") {
                        if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == dcrexptypecode) {
                            fnMsgAlert('info', 'Expense Claim', '' + dcrexpname + ' Have no split amount');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
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
                    if ($("#hdnDcrDate_" + parseInt(i + 1) + "").val() != "") {
                        if ($("#hdnDcrExp_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate == $("#hdnDcrDate_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Claim', '' + dcrexpname + ' already claimed for ' + dcrdate + '');
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
        data: "userCode=" + userCode + "&DcrDate=" + formatDate + "&DcrFlag=" + dcrflag + "&DcrCat=" + dcrcat + "&DcrExp=" + dcrexpname + "&DcrExpCode=" + dcrexptypecode + "&DcrAmt=" + dcrexpamt,
        url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
        success: function (resp) {
            if (resp.split('^')[0] == "SUCCESS") {
                $("#myModal").modal('hide');
                var content = resp.split('^')[1];
                $("#ExpTypeTxt_" + ExpenseRow + "").val($("#ExpNameModal").val());
                $("#hdnDcrExp_" + ExpenseRow + "").val($("#hdnExpCodeModal").val());
                $("#ExpAmt_" + ExpenseRow + "").val($("#ExpAmtModal").val());
                $("#ExpTypeTxt_" + ExpenseRow + "").attr("disabled", true);
                fnMsgAlert('success', 'Expense Additional Claim', content);
                var Curr_Amt = $("#txtTotExpense").val();
                Curr_Amt = parseInt(Curr_Amt + dcrexpamt);
                $("#txtTotExpense").val(Curr_Amt);
                return false;
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
            fnCalculateTotalForFieldExpense();
        }
    });

    return false;
}
function FnClearRowData(selRow) {
    $("#DcrDateTxt_" + selRow + "").val("").attr('disabled', false);
    $("#hdnDcrDate_" + selRow + "").val("");
    $("#DcrFlagTxt_" + selRow + "").val("");
    $("#hdnDcrFlag_" + selRow + "").val("");
    $("#DcrCatTxt_" + selRow + "").val("");
    $("#hdnDcrCat_" + selRow + "").val("");
    $("#ExpTypeTxt_" + selRow + "").val("");
    $("#hdnDcrExp_" + selRow + "").val("");
    $("#ExpAmt_" + selRow + "").val("");
    $("#RefTxt_" + selRow + "").val("").attr('disabled', false);
    $("#RemTxt_" + selRow + "").val("").attr('disabled', false);
    fnCalculateTotalForFieldExpense();
}
function FnCreateRow(RowId) {
    debugger;
    if ($(".AddlExpCls").length == RowId) {
        var FormattedDate = "";
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
            fnMsgAlert('info', 'Expense Additional Claim', 'Enter Integer Value in Expense Amount for Row ' + RowId + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        if (userCode != "" && FormattedDate != "" && dcrflag != "" && dcrcat != "" && dcrexpname != "" && dcrexptypecode != "" && dcrexpamt != "") {
            $.ajax({
                type: 'GET',
                data: "userCode=" + userCode + "&DcrDate=" + FormattedDate + "&DcrFlag=" + dcrflag + "&DcrCat=" + dcrcat + "&DcrExp=" + dcrexpname + "&DcrExpCode=" + dcrexptypecode + "&DcrAmt=" + dcrexpamt,
                url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
                success: function (resp) {
                    if (resp.split('^')[0].toUpperCase() == "SUCCESS") {
                        var ExpRowContent = "";
                        if (RowId != "") {
                            RowId = $(".AddlExpCls").length;
                            var visibleRowId = $(".ExpCount:visible").length;
                            ExpRowContent += "<tr id='ExpRow_" + parseInt(RowId + 1) + "' class='AddlExpCls'><td><input type='text' style='width: 90px;' value='' id='DcrDateTxt_" + parseInt(RowId + 1) + "' class='form-control AutoDcrDate' onblur ='fnValidateAutofill(this," + 'AutoComplete_DcrDate' + ",\"DcrDateTxt\",\"hdnDcrDate\");fnGetDcrFlag(" + parseInt(RowId + 1) + ");' autocomplete='off'/><input type='hidden' class='hdnDcrDateCls' id='hdnDcrDate_" + parseInt(RowId + 1) + "'></td>";
                            ExpRowContent += "<td><input type='text' style='width: 90px;' value='' id='DcrFlagTxt_" + parseInt(RowId + 1) + "' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + 'AutoComplete_Ovr_DcrFlag' + ",\"DcrFlagTxt\",\"hdnDcrFlag\");fnGetDcrCategory(" + parseInt(RowId + 1) + ");' autocomplete='off' disabled/><input type='hidden' class='hdnDcrFlagCls' id='hdnDcrFlag_" + parseInt(RowId + 1) + "'></td>";
                            ExpRowContent += "<td><input type='text' style='width: 90px;' value='' id='DcrCatTxt_" + parseInt(RowId + 1) + "' class='form-control AutoDcrCat' onblur ='fnValidateAutofill(this," + 'AutoComplete_Ovr_DcrFlag' + ",\"DcrCatTxt\",\"hdnDcrCat\");' autocomplete='off' disabled/><input type='hidden' class='hdnDcrCatCls' id='hdnDcrCat_" + parseInt(RowId + 1) + "'></td>";
                            ExpRowContent += "<td><input type='text' style='width: 90px;' value='' id='ExpTypeTxt_" + parseInt(RowId + 1) + "' class='form-control' onclick='fnGetDcrExpense(" + parseInt(RowId + 1) + ");' disabled/><input type='hidden' class='hdnDcrExpCls' id='hdnDcrExp_" + parseInt(RowId + 1) + "'></td>";
                            ExpRowContent += "<td><input type='text' style='width: 90px;' value='' style='width: 90px;' class='form-control' id='ExpAmt_" + parseInt(RowId + 1) + "' class='form-control' disabled/><input type='hidden' id='ExpMode_" + parseInt(RowId + 1) + "' value=''/></td>";
                            ExpRowContent += "<td><input type='text' style='width: 100px;' value='' class='form-control' id='RefTxt_" + parseInt(RowId + 1) + "'/></td>";
                            ExpRowContent += "<td><input type='text' style='width: 100px;' value='' class='form-control' id='RemTxt_" + parseInt(RowId + 1) + "'/></td>";
                            ExpRowContent += "<td><a style='cursor:pointer;' onclick='FnCreateRow(" + parseInt(RowId + 1) + ")' id='plus_" + parseInt(RowId + 1) + "'><i class='fa fa-plus' style='font-size:18px;color:green;'></i></a>&nbsp;<a style='cursor:pointer;'><i onclick='FnClearRowData(" + parseInt(RowId + 1) + ")' class='fa fa-remove' style='font-size:21px;color:red;'></i></a></td></tr>";
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
                        fnMsgAlert('error', 'Expense Additional Claim', resp[1].split('^'));
                        return false;
                    }
                },
                error: function () {

                },
                complete: function () {
                    autoComplete(AutoComplete_DcrDate, "DcrDateTxt", "hdnDcrDate", "AutoDcrDate");
                }
            });
        }
    }

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
    var ExpAmt = $("#unExpAmt_" + selRow + "").html();
    var DcrStatus = $("#unDcrStatus" + selRow + "").html();
    var rowCount = $(".AprExpRow").length;


    $.ajax({
        type: 'GET',
        data: "userCode=" + favUserCode + "&DcrDate=" + formattedDate + "&DcrFlag=" + DcrFlag + "&DcrCat=" + DcrCategory + "&DcrExp=" + ExpType + "&DcrExpCode=" + ExpCode + "&DcrAmt=" + ExpAmt,
        url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
        success: function (resp) {
            if (resp.split('^')[0] == "SUCCESS") {
                $("#myModal").modal('hide');
                var content = resp.split('^')[1];
                var IncludeAddlExp = "";
                if ($("#ApDcrDate_" + rowCount + "").val() != "") {

                    $("#AprDcrDate_" + rowCount + "").val(DcrDate);
                    $("#AprFlag_" + rowCount + "").val(DcrFlag);
                    $("#AprCategory_" + rowCount + "").val(DcrCategory);
                    $("#AprExpType_" + rowCount + "").val(ExpType);
                    $("#hdnAprExpCode_" + rowCount + "").val(ExpCode);
                    $("#AprExpAmt_" + rowCount + "").val(ExpAmt);
                    $("#AprDcrStat_" + rowCount + "").val("Approved");
                    $("#AprReason_" + rowCount + "").val();
                    $("#AprDcrRem_" + rowCount + "").val();
                    $("#AprDcrRef_" + rowCount + "").val('hi');
                    $("#AprRemarks_" + rowCount + "").val('hi');
                    fnMsgAlert('success', 'Expense Additional Claim', content);
                    return false;
                }
                else {
                    IncludeAddlExp += "<tr id='AprExpRowId_" + parseInt(rowCount + 1) + "' class='AprExpRow'><td><input type='text' id='AprDcrDate_" + parseInt(rowCount + 1) + "' value='" + DcrDate + "'/></td>";
                    IncludeAddlExp += "<td><input style='width:91px;' type='text' class='AutoAprDcrFlag' id='AprFlag_" + parseInt(rowCount + 1) + "' value='" + DcrStatus + "'/><input type='hidden' id='hdnAprFlag_" + parseInt(rowCount + 1) + "' value=''/></td>";
                    IncludeAddlExp += "<td><input style='width:91px;' type='text' id='AprCategory_" + parseInt(rowCount + 1) + "' value='" + DcrCategory + "'/></td>";
                    IncludeAddlExp += "<td><input style='width:91px;' type='text' id='AprExpType_" + parseInt(rowCount + 1) + "' value='" + ExpType + "'/><input type='hidden' style='width:91px;' id='hdnAprExpCode_" + parseInt(rowCount + 1) + "' value='" + ExpCode + "' /></td>";
                    IncludeAddlExp += "<td><input style='width:91px;' type='text' id='AprExpAmt_" + parseInt(rowCount + 1) + "' value='" + ExpAmt + "'</td>";
                    IncludeAddlExp += "<td><input style='width:91px;' type='text' id='AprDcrStat_" + parseInt(rowCount + 1) + "' value='Approved'/></td>";
                    IncludeAddlExp += "<td><input style='width:92px;' type='text' id='AprReason_" + parseInt(rowCount + 1) + "' value=''/></td>";
                    IncludeAddlExp += "<td><input style='width:92px;' type='text' id='AprDcrRem_" + parseInt(rowCount + 1) + "' value=''/></td>";
                    IncludeAddlExp += "<td><input style='width:92px;' type='text' id='AprDcrRef_" + parseInt(rowCount + 1) + "' value=''/></td>";
                    IncludeAddlExp += "<td><input style='width:92px;' type='text' id='AprRemarks_" + parseInt(rowCount + 1) + "' value=''/></td>";
                    IncludeAddlExp += "<td><a style='cursor:pointer;' id='plus_" + parseInt(rowCount + 1) + "'><i class='fa fa-plus' style='font-size:18px;color:green;'></i></a>&nbsp;<a style='cursor:pointer;'><i class='fa fa-remove' style='font-size:18px;color:red;'></i></a></td></tr>";
                    $("#AddlExpBdy").append(IncludeAddlExp);
                    fnMsgAlert('success', 'Expense Additional Claim', content);
                    return false;
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
function FnClearExpenseEdit(selRow) {
    if ($("#AddlExpAmt_" + selRow + "").val() != "") {
        var dcrexpamt = $("#AddlExpAmt_" + selRow + "").val();
        var Curr_ClaimAmt = $("#spnTotalClaimAmount ").html();
        var Curr_AprAmt = $("#spnTotalApprovedAmount ").html();
        Curr_ClaimAmt = parseFloat(Curr_ClaimAmt) - parseFloat(dcrexpamt);
        Curr_AprAmt = parseFloat(Curr_AprAmt) - parseFloat(dcrexpamt);
        $("#spnTotalClaimAmount ").html(Curr_ClaimAmt);
        $("#spnTotalApprovedAmount ").html(Curr_AprAmt);
    }
    $("#AddlDcrDate_" + selRow + "").val('').attr('disabled', false);
    $("#AddlDcrFlag_" + selRow + "").val('');
    $("#AddlCat_" + selRow + "").val('');
    $("#AddlExpType_" + selRow + "").val('');
    $("#AddlExpAmt_" + selRow + "").val('');
    $("#AddlCurrDed_" + selRow + "").val('');
    $("#AddlAprAmt_" + selRow + "").val('');
    $("#AddlRef_" + selRow + "").val('');
    $("#AddlUserRem_" + selRow + "").val('');
    $("#AddlAdminRem_" + selRow + "").val('');
    $("#hdnAddlDateEdit_" + selRow + "").val('');
    $("#hdnAddlFlagEdit_" + selRow + "").val('');
    $("#hdnAddlCatEdit_" + selRow + "").val('');
    $("#hdnAddlExpEdit_" + selRow + "").val('');
    fncalculateExpensetypewiseEdit();
}
function FnAddExpenseEdit(selRow) {
    debugger;
    if ($(".AprExpRow").length == selRow) {
        if ($("#AddlDcrDate_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Date for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        else if ($("#hdnAddlDateEdit_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Dcr Date for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        else if ($("#AddlDcrFlag_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Flag for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        else if ($("#hdnAddlFlagEdit_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Dcr Flag for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        else if ($("#AddlCat_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select Category for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        else if ($("#hdnAddlCatEdit_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Category for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        else if ($("#AddlExpType_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Type for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        else if ($("#hdnAddlExpEdit_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select valid Expense Type for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        else if ($("#AddlExpAmt_" + selRow + "").val() == "") {
            fnMsgAlert('info', 'Expense Additional Claim', 'Select Expense Amount for Row ' + selRow + ' ');
            $("#main").unblock();
            HideModalPopup("dvloading");
            return false;
        }
        var DcrDate = $("#hdnAddlDateEdit_" + selRow + "").val();
        var formattedDate = DcrDate.split('/');
        formattedDate = formattedDate[1] + '/' + formattedDate[0] + '/' + formattedDate[2];
        var DcrFlag = $("#hdnAddlFlagEdit_" + selRow + "").val();
        var DcrCategory = $("#hdnAddlCatEdit_" + selRow + "").val();
        var ExpType = $("#AddlExpType_" + selRow + "").val();
        var ExpCode = $("#hdnAddlExpEdit_" + selRow + "").val();
        var ExpAmt = $("#AddlExpAmt_" + selRow + "").val();
        var DcrStatus = $("#AddlStatusEdit_" + selRow + "").html();
        var rowCount = $(".AprExpRow").length;
        if (DcrDate != "") {
            $.ajax({
                type: 'GET',
                data: "userCode=" + ExpenseClaimUser + "&DcrDate=" + formattedDate + "&DcrFlag=" + DcrFlag + "&DcrCat=" + DcrCategory + "&DcrExp=" + ExpType + "&DcrExpCode=" + ExpCode + "&DcrAmt=" + ExpAmt,
                url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
                success: function (resp) {
                    if (resp.split('^')[0] == "SUCCESS") {
                        $("#myModal").modal('hide');
                        var content = resp.split('^')[1];
                        var AddlComponent = "";
                        AddlComponent += "<tr class='AprExpRow' id='AprExpRowId_" + (rowCount + 1) + "'><input type='hidden' id='FavUser_" + (rowCount + 1) + "' value=''/> ";
                        AddlComponent += "<td><input type='text' class='form-control AutoDcrDate' onblur ='fnValidateAutofill(this," + "AutoComplete_DcrDate" + ",\"AddlDcrDate\",\"hdnAddlDateEdit\");fnGetDcrFlagEdit(" + (rowCount + 1) + ");' autocomplete='off' id='AddlDcrDate_" + (rowCount + 1) + "' value=''/><input type='hidden' id='hdnAddlDateEdit_" + (rowCount + 1) + "' value=''/></td>";
                        AddlComponent += "<td><input type='text' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + "AutoComplete_Ovr_DcrFlag" + ",\"AddlDcrFlag\",\"hdnAddlFlagEdit\");fnGetDcrCategoryEdit(" + (rowCount + 1) + ");' autocomplete='off' id='AddlDcrFlag_" + (rowCount + 1) + "' value='' disabled/><input type='hidden' id='hdnAddlFlagEdit_" + (rowCount + 1) + "' value=''/></td>";
                        AddlComponent += "<td><input type='text' class='form-control AutoDcrCat' onblur='fnValidateAutofill(this," + "AutoComplete_Dcr_Category" + ",\"AddlCat\",\"hdnAddlCatEdit\");' autocomplete='off' id='AddlCat_" + (rowCount + 1) + "' value='' disabled/><input type='hidden' id='hdnAddlCatEdit_" + (rowCount + 1) + "' value=''/></td>";
                        AddlComponent += "<td><input type='text' class='form-control AutoDcrExpCls' Addl_Exp_Code='' onclick='fnGetDcrExpenseEdit(" + (rowCount + 1) + ");' id='AddlExpType_" + (rowCount + 1) + "' value='' disabled/><input type='hidden' id='hdnAddlExpEdit_" + (rowCount + 1) + "' value=''/></td>";
                        AddlComponent += "<td><input type='text' class='form-control' id='AddlExpAmt_" + (rowCount + 1) + "' value='' disabled/></td>";
                        AddlComponent += "<td id='AddlCurrDed_" + (rowCount + 1) + "'>0</td>";
                        AddlComponent += "<td id='AddlAprAmt_" + (rowCount + 1) + "'>0</td>";
                        AddlComponent += "<td><input type='text' class='form-control' id='AddlRef_" + (rowCount + 1) + "' /></td>";
                        AddlComponent += "<td><input type='text' class='form-control' id='AddlUserRem_" + (rowCount + 1) + "' /></td>";
                        AddlComponent += "<td id='AddlAdminRem_" + (rowCount + 1) + "'></td>";
                        AddlComponent += "<td><a style='cursor:pointer;' onclick='FnAddExpenseEdit(" + (rowCount + 1) + ")'><i class='fa fa-plus'  style='font-size:18px;color:green;'></i></a>&nbsp;&nbsp;<a style='cursor:pointer;' onclick='FnClearExpenseEdit(" + (rowCount + 1) + ")'><i class='fa fa-remove'  style='font-size:18px;color:red;'></i></a></td>";
                        AddlComponent += "</tr>";
                        $("#AddlCntEdit").append(AddlComponent);
                        return false;

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
                    autoComplete(AutoComplete_DcrDate, "AddlDcrDate", "hdnAddlDateEdit", "AutoDcrDate");
                }
            });
        }
    }
}
function fnAddlDcrExpDetEdit(Dcr_From, Dcr_To, favouringUser) {
    debugger;
    var ExpTableContent = "";
    $.ajax({
        type: 'POST',
        data: "userCode=" + favouringUser + "&Dcr_From=" + Dcr_From + "&Dcr_To=" + Dcr_To,
        url: '../HiDoctor_Activity/ExpenseClaim/GetAddlDcrExpDet',
        async: false,
        success: function (response) {
            if (response != "" && response != null) {
                debugger;
                IsAddlExpense = fnGetPrivilegeValue("ADDITIONAL_CLAIM_THROUGH_EXPENSE_REQUEST", "NO");
                if (IsAddlExpense.toUpperCase() == 'YES') {
                    AddlExpDet_g = response[0].lstDcrExp;
                    AddlExpTypeDet_g = response[0].lstUserExpDet;
                    var dcrUniqueDate = [];
                    var DcrDateLst = "[";
                    for (var i = 0; i < response[0].lstDcrDateUq.length; i++) {
                        DcrDateLst += "{label:" + '"' + "" + response[0].lstDcrDateUq[i].DCR_Date + "" + '",' + "value:" + '"' + "" + response[0].lstDcrDateUq[i].DCR_Date + "" + '"' + "}";
                        if (i < response[0].lstDcrDateUq.length - 1) {
                            DcrDateLst += ",";
                        }
                    }
                    DcrDateLst += "];";
                    AutoComplete_DcrDate = eval(DcrDateLst);
                }
            }

            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.responseText);
            $("#main").unblock();
        },
        complete: function () {
            autoComplete(AutoComplete_DcrDate, "AddlDcrDate", "hdnAddlDateEdit", "AutoDcrDate");
        }
    });
}
function fnAddExpDetEdit() {
    debugger;
    if ($("#hdnAddlDateEdit_" + ExpenseRow + "").val() == "") {
        $("#myModal").modal('hide');
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Date for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#hdnAddlFlagEdit_" + ExpenseRow + "").val() == "") {
        $("#myModal").modal('hide');
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Flag for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#hdnAddlCatEdit_" + ExpenseRow + "").val() == "") {
        $("#myModal").modal('hide');
        fnMsgAlert('info', 'Expense Additional Claim', 'Select Dcr Category for Row ' + ExpenseRow + '');
        $("#main").unblock();
        HideModalPopup("dvloading");
        return false;
    }
    else if ($("#ExpNameEditModal").val() == "") {
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
    var dcrdate = $("#hdnAddlDateEdit_" + ExpenseRow + "").val();
    var splitDate = dcrdate.split('/');
    var formatDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2];
    var dcrflag = $("#hdnAddlFlagEdit_" + ExpenseRow + "").val();
    var dcrcat = $("#hdnAddlCatEdit_" + ExpenseRow + "").val();
    var dcrexpname = $("#ExpNameEditModal").val();
    var dcrexptypecode = $("#hdnExpCodeEditModal").val();
    var dcrexpamt = $("#ExpAmtEditModal").val();
    var userCode = ExpenseClaimUser;
    debugger;
    var ExpenseMode = $.grep(AddlExpTypeDet_g, function (element, index) {
        return (element.Expense_Type_Code == dcrexptypecode && element.Expense_Mode.toUpperCase() != "DAILY")
    });
    if (ExpenseMode.length > 0) {
        if (ExpenseMode[0].Expense_Mode != "DAILY") {
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlExpArr = [];
            var isExpRepeated = 0;
            var AddlExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible')) {
                    if (dcrdate != "") {
                        if ($("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate == $("#hdnAddlDateEdit_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Claim', '' + dcrexpname + ' already claimed for ' + dcrdate + '');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
                            return false;
                        }
                        else if ($("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val() == dcrexptypecode
                            && dcrdate != $("#hdnAddlDateEdit_" + parseInt(i + 1) + "").val()) {
                            if ($("#RemoveIcon_" + parseInt(i + 1) + "").length > 0) {
                                if ($("#RemoveIcon_" + parseInt(i + 1) + "").is('visible')) {
                                    dcrexpamt = parseFloat(dcrexpamt) + parseFloat($("#AddlExpAmt_" + parseInt(i + 1) + "").val());
                                    isExpRepeated = 1;
                                }
                            }
                            else {
                                dcrexpamt = parseFloat(dcrexpamt) + parseFloat($("#AddlExpAmt_" + parseInt(i + 1) + "").val());
                                isExpRepeated = 1;
                            }
                        }
                    }
                }
            }
        }
        if (ExpenseMode[0].Can_Split_Amount == "N") {
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlExpArr = [];
            var isExpRepeated = 0;
            var AddlExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible')) {
                    if (dcrdate != "") {
                        if ($("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val() == dcrexptypecode) {
                            fnMsgAlert('info', 'Expense Claim', '' + dcrexpname + ' have no split amount');
                            $("#main").unblock();
                            HideModalPopup("dvloading");
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
            var TotalRow = $('.AprExpRow').length;
            var SelectedRow = $('.AprExpRow:visible').length;
            AddlExpArr = [];
            var isExpRepeated = 0;
            var AddlExpObj = "";
            var j = 0;
            for (var i = 0; i < TotalRow; i++) {
                if ($('#AprExpRowId_' + parseInt(i + 1) + '').is(':visible')) {
                    if (dcrdate != "") {
                        if ($("#hdnAddlExpEdit_" + parseInt(i + 1) + "").val() == dcrexptypecode && dcrdate == $("#hdnAddlDateEdit_" + parseInt(i + 1) + "").val()) {
                            fnMsgAlert('info', 'Expense Claim', '' + dcrexpname + ' already claimed for ' + dcrdate + '');
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
        data: "userCode=" + userCode + "&DcrDate=" + formatDate + "&DcrFlag=" + dcrflag + "&DcrCat=" + dcrcat + "&DcrExp=" + dcrexpname + "&DcrExpCode=" + dcrexptypecode + "&DcrAmt=" + dcrexpamt,
        url: "../HiDoctor_Activity/ExpenseClaim/ValidateExpenses",
        success: function (resp) {
            if (resp.split('^')[0] == "SUCCESS") {
                debugger;
                $("#ExpEditModal").modal('hide');
                var content = resp.split('^')[1];
                $("#AddlExpType_" + ExpenseRow + "").val($("#ExpNameEditModal").val());
                $("#hdnAddlExpEdit_" + ExpenseRow + "").val($("#hdnExpCodeEditModal").val());
                $("#AddlExpAmt_" + ExpenseRow + "").val($("#ExpAmtEditModal").val());
                $("#AddlAprAmt_" + ExpenseRow + "").html(0);
                $("#AddlExpType_" + ExpenseRow + "").attr("disabled", true);
                $("#AddlExpType_" + ExpenseRow + "").attr("Addl_Exp_Code", $("#ExpNameEditModal").val())
                fnMsgAlert('success', 'Expense Additional Claim', content);
                //var Curr_ClaimAmt = $("#spnTotalClaimAmount ").html();
                //var Curr_AprAmt = $("#spnTotalApprovedAmount ").html();
                //Curr_ClaimAmt = parseFloat(Curr_ClaimAmt) + parseFloat(dcrexpamt);
                //Curr_AprAmt = parseFloat(Curr_AprAmt) + parseFloat(dcrexpamt);
                //$("#spnTotalClaimAmount ").html(Curr_ClaimAmt);
                //$("#spnTotalApprovedAmount ").html(Curr_AprAmt);
                return false;
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
            fnCalculateTotalForFieldExpenseForEdit();
            fncalculateExpensetypewiseEdit();
        }
    });

    return false;

}
function FnDelExpenseEdit(selRow) {
    debugger;
    var fav_User_Code = ExpenseClaimUser;
    var claimDet = $("#ClaimDet_" + selRow + "").val();
    $.ajax({
        type: 'POST',
        data: "userCode=" + fav_User_Code + "&ClaimDet=" + claimDet,
        url: '../HiDoctor_Activity/ExpenseClaim/DeleteDailyExpEdit',
        success: function (result) {
            if (result == 1) {

                if ($("#AddlExpAmt_" + selRow + "").val() != "") {
                    var dcrexpamt = $("#AddlExpAmt_" + selRow + "").val();
                    var Curr_ClaimAmt = $("#spnTotalClaimAmount ").html();
                    var Curr_AprAmt = $("#spnTotalApprovedAmount ").html();
                    Curr_ClaimAmt = parseFloat(Curr_ClaimAmt) - parseFloat(dcrexpamt);
                    Curr_AprAmt = parseFloat(Curr_AprAmt) - parseFloat(dcrexpamt);
                    $("#spnTotalClaimAmount ").html(Curr_ClaimAmt);
                    $("#spnTotalApprovedAmount ").html(Curr_AprAmt);
                }
                $("#AddlDcrDate_" + selRow + "").val('').attr('disabled', false);
                $("#AddlDcrFlag_" + selRow + "").val('');
                $("#AddlCat_" + selRow + "").val('');
                $("#AddlExpType_" + selRow + "").val('');
                $("#AddlExpAmt_" + selRow + "").val('');
                $("#AddlCurrDed_" + selRow + "").val('');
                $("#AddlAprAmt_" + selRow + "").val('');
                $("#AddlRef_" + selRow + "").val('');
                $("#AddlUserRem_" + selRow + "").val('');
                $("#AddlAdminRem_" + selRow + "").val('');
                $("#hdnAddlDateEdit_" + selRow + "").val('');
                $("#hdnAddlFlagEdit_" + selRow + "").val('');
                $("#hdnAddlCatEdit_" + selRow + "").val('');
                $("#hdnAddlExpEdit_" + selRow + "").val('');
                $("#AddlCurrDed_" + selRow + "").html(0);
                $("#AddlAprAmt_" + selRow + "").html(0);
                $("#AddlAdminRem_" + selRow + "").html('');
                $("#TrashIcon_" + selRow + "").hide();
                $("#RemoveIcon_" + selRow + "").show();
                fncalculateExpensetypewiseEdit();
            }
            else {
                fnMsgAlert('error', 'Expense Additional Claim', 'Failed To Delete Expense.Try again later');
                return false;
            }
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
/// DCR Attachment changes/////////////////

function fngetdcrExpenseUrl(Effective_from, Effective_to, claimFavouringUser, mode) {
    $.ajax({
        type: 'GET',
        data: "userCode=" + claimFavouringUser + "&month=0&year=0&Effective_from=" + Effective_from + "&Effective_to=" + Effective_to + "",
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
function fncheckimage(id)
{
    if($("#chec_"+id).prop("checked") == false)
    {
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
    $('#attsave').attr("disabled", true);
    $("#dcrattachement input[type=checkbox]:checked").map(function (i, e) {
        debugger;
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
