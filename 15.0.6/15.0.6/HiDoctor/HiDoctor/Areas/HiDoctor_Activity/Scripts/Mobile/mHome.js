var dcrHeader_g;
var doclist_g;
var stockist_g;
var expenselist_g;
var category_g = "";
var travelKMS_g = "0"
var cpCode_g = "";
var tpCode_g = "";
var accRegions_g = "";
var codes_g = "";
var docArray = new Array();
function fnCreateHeader() {
    try {
        if (dcrHeader_g.length > 0 && dcrHeader_g[0].Data != null) {
            var headerStr = "";
            category_g = dcrHeader_g[0].Data[0].Category_Name;
            headerStr = '<li data-theme="c" onclick="fnGoToHeader()"><div class="home_placelabel" >Category:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].Category_Name + '</div><div class="clearboth"></div>';
            if (dcrHeader_g[0].Data[0].Category_Name.toUpperCase() != "HQ") {
                if (dcrHeader_g[1].Data.length == 0) {
                    headerStr += '<div class="home_placelabel" >Form Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].From_Place + '</div><div class="clearboth"></div>';
                    headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].To_Place + '</div>';
                    headerStr += '<div class="clearboth"></div>';
                }
                else {
                    for (var i = 0; i < dcrHeader_g[1].Data.length; i++) {
                        var fromPlace = dcrHeader_g[1].Data[i].From_Place;
                        var toPlace = dcrHeader_g[1].Data[i].To_Place;
                        headerStr += '<div class="home_placelabel" >Form Place:</div><div class="homeplace_value">' + fromPlace + '</div><div class="clearboth"></div>';
                        headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + toPlace + '</div>';
                        headerStr += '<div class="clearboth"></div>';
                    }
                }
            }
            else {
                headerStr += '<div class="home_placelabel" >Form Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].From_Place + '</div><div class="clearboth"></div>';
                headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].To_Place + '</div>';
                headerStr += '<div class="clearboth"></div>';
            }
        }
        cpCode_g = dcrHeader_g[0].Data[0].CP_Code == null ? "" : dcrHeader_g[0].Data[0].CP_Code;
        tpCode_g = dcrHeader_g[0].Data[0].Tp_Code == null ? "" : dcrHeader_g[0].Data[0].Tp_Code;
        var acc1Region = dcrHeader_g[0].Data[0].Acc1_Code == null ? "^" : dcrHeader_g[0].Data[0].Acc1_Code + "^";
        var acc2Region = dcrHeader_g[0].Data[0].Acc2_Code == null ? "^" : dcrHeader_g[0].Data[0].Acc2_Code + "^";
        var acc3Region = dcrHeader_g[0].Data[0].Acc3_Code == null ? "^" : dcrHeader_g[0].Data[0].Acc3_Code + "^";
        var acc4Region = dcrHeader_g[0].Data[0].Acc4_Code == null ? "^" : dcrHeader_g[0].Data[0].Acc4_Code + "^";
        accRegions_g = acc1Region + acc2Region + acc3Region + acc4Region;
        headerStr += '<div class="clearboth"></div></li>';
        $('#listHeader').append(headerStr);
        $('#listHeader').listview("refresh");
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
    }
}

function fnCreateDocList() {
    try {
        $('#doclist').html('');
        for (var i = 0; i < doclist_g[0].Data.length; i++) {
            var codes = "";
            var doclistStr = '<li data-theme="c">';
            var dname = doclist_g[0].Data[i].Doctor_Name;
            dname = dname.replace('__', '_');
            if (doclist_g[0].Data[i].Doctor_Visit_Code != null && doclist_g[0].Data[i].Doctor_Visit_Code.length > 0) {
                doclistStr += '<div class="tick"></div><div data-role="fieldcontain" style="margin-top:-5px;margin-right:1px;float:right;"><a id="docdelete_' + i + '" href="#" class="delete-icon" style="padding:15px;" onclick="fnDeleteDoctor(\'' + doclist_g[0].Data[i].Doctor_Visit_Code + '\');" ></a></div>';
                docArray.push(dname);
            }
            var region = doclist_g[0].Data[i].Doctor_Name.split('_')[3];
            doclistStr += '<a href="#page1" data-transition="slide" id="docname_' + i + '" onclick="fnGotoDoctorScreen(' + i + ')" ><span id="spndocname_' + i + '">' + dname + "<br />@" + region + "</span>";
            doclistStr += '<div class="dvchemlist">';
            var dvCode = doclist_g[0].Data[i].Doctor_Visit_Code;
            codes = dvCode != null ? dvCode + "^," : "";

            var productJSON = jsonPath(doclist_g[1].Data, "$.[?(@.DCR_Visit_Code=='" + dvCode + "')]");
            for (var p = 0; p < productJSON.length; p++) {
                if (p == productJSON.length - 1) {
                    codes += productJSON[p].DCR_Product_Code + '^,';
                }
                else {
                    codes += productJSON[p].DCR_Product_Code + '^';
                }
            }
            if (!productJSON || productJSON.length == 0) {
                codes += "^,";
            }
            var chemistJSON = jsonPath(doclist_g[2].Data, "$.[?(@.DCR_Visit_Code=='" + dvCode + "')]");
            for (var c = 0; c < chemistJSON.length; c++) {
                doclistStr += '<div class="dvchemlist">' + chemistJSON[c].Chemist_Name + '</div>'
                if (c == chemistJSON.length - 1) {
                    codes += chemistJSON[c].DCR_Chemists_Code + "^,";
                }
                else {
                    codes += chemistJSON[c].DCR_Chemists_Code + "^";
                }
            }

            if (!chemistJSON || chemistJSON.length == 0) {
                codes += "^,";
            }

            var rcpaJSON = jsonPath(doclist_g[3].Data, "$.[?(@.DCR_Visit_Code=='" + dvCode + "')]");
            for (var r = 0; r < rcpaJSON.length; r++) {
                if (r == rcpaJSON.length - 1) {
                    codes += rcpaJSON[r].DCR_RCPA_Code + "^,";
                }
                else {
                    codes += rcpaJSON[r].DCR_RCPA_Code + "^";
                }
            }
            if (!rcpaJSON || rcpaJSON.length == 0) {
                codes += "^,";
            }
            doclistStr += '</div></a><input type="hidden" id="hdnCodes_' + i + '" value="' + codes + '" /></li>';
            if (doclist_g[0].Data.length == i - 1) {
                doclistStr += '<li data-theme="c"><a href="#">New Doctor Entry</a></li>'
            }

            $('#doclist').append(doclistStr).trigger("create");
            $("#doclist").listview("refresh");
        }
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
    }
}

function fnCreateStockList() {
    try {
        for (var s = 0; s < stockist_g.length; s++) {
            var stckStr = '<li data-theme="c"><a  data-transition="slide" onclick="fnGotoStockistExpense()" >' + stockist_g[s].StockiestName + ' </a></li>';
            $('#stocklist').append(stckStr);
        }
        $('#stocklist').listview("refresh");
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
    }
}

function fnCreateExpeList() {
    try {
        if (sourceFromStockist_g == 'TAB_STOCKIEST') {
            for (var e = 0; e < expenselist_g[2].Data.length; e++) {
                var expstr = '<li data-theme="c" class="readExpense"><a  data-transition="slide" onclick="fnGotoStockistExpense()" >' + expenselist_g[2].Data[e].ExpenseTypeName + ' - <span>' + expenselist_g[2].Data[e].ExpenseAmount + '</span></a><input type="hidden" value="' + expenselist_g[2].Data[e].ExpenseTypeCode + '"/></li>';
                $('#explist').append(expstr);
            }
        }
        else {
            for (var e = 0; e < expenselist_g[1].Data.length; e++) {
                var expstr = '<li data-theme="c" class="readExpense"><a  data-transition="slide" onclick="fnGotoStockistExpense()" >' + expenselist_g[1].Data[e].ExpenseTypeName + ' - <span>' + expenselist_g[1].Data[e].TotalFare + '</span></a><input type="hidden" value="' + expenselist_g[1].Data[e].ExpenseTypeCode + '"/></li>';
                $('#explist').append(expstr);
            }
            for (var e = 0; e < expenselist_g[2].Data.length; e++) {
                var exists = jsonPath(expenselist_g[1].Data, "$.[?(@.ExpenseTypeCode=='" + expenselist_g[2].Data[e].ExpenseTypeCode + "')]");
                if (!exists) {
                    var expstr = '<li data-theme="c" class="readExpense"><a  data-transition="slide" onclick="fnGotoStockistExpense()" >' + expenselist_g[2].Data[e].ExpenseTypeName + ' - <span>' + expenselist_g[2].Data[e].ExpenseAmount + '</span></a><input type="hidden" value="' + expenselist_g[2].Data[e].ExpenseTypeCode + '"/></li>';
                    $('#explist').append(expstr);
                }
            }
        }
        $('#explist').listview("refresh");
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
    }
}

function fnGotoDoctorScreen(index) {
    var codes = $('#hdnCodes_' + index).val();
    codes_g = codes;
    var docname = $('#spndocname_' + index).html().split("<br")[0];
    var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";

    $.mobile.changePage("/HiDoctor_Activity/DCRDoctorVisit/Create?Status=" + dcrStatus_g + "&flagRCPA=" + rcpa + "&accUsers=" + accRegions_g + "&cp=&tp=&dcrActualDate=" + dcrDate_g + "&category=&travelledkms=" + travelKMS_g + "&source=&flag=&codes=&doctorName=" + docname, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnGoToDoctorsSelection() {
    var codes = "";
    var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";
    $.mobile.changePage("/HiDoctor_Activity/ChooseDoctorsSelection/Index?codes=" + codes + "&dcrActualDate=" + dcrDate_g + "&accUsers=" + accRegions_g + "&flagRCPA=" + rcpa + "&doctorname=''&speciality=''&travelKm=" + travelKMS_g, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}


function fnGotoStockistExpense() {
    if (sourceFromStockist_g == 'TAB_STOCKIEST') {
        var dcrStatus = '3';
    }
    else {
        var dcrStatus = dcrStatus_g;
    }

    var activity = "";
    if (dcrHeader_g[2] != null && dcrHeader_g[2].Data != null && dcrHeader_g[2].Data.length > 0) {
        for (var a = 0; a < dcrHeader_g[2].Data.length; a++) {
            activity += dcrHeader_g[2].Data[a].Activity_Name.split('(')[0] + ",";
        }
    }

    if (activity.lastIndexOf(',') > -1) {
        activity = activity.substring(activity.lastIndexOf(','), 0);
    }
    $.mobile.changePage("/HiDoctor_Activity/DCRStockiestExpense/Create/?dcrDate=" + dcrDate_g + "&dcrStatus=" + dcrStatus + "&entity=" + category_g + "&travelkm=" + travelKMS_g + "&isRCPA=" + isRCPA_g + "&accRegions=" + accRegions_g + "&flag=" + flag_g +"&actvity=" + activity, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}
function fnGoToHeader() {
    $.mobile.changePage("/HiDoctor_Activity/DCRHeader/Create/?dcrDate=" + dcrDate_g + "&dcrStatus=" + dcrStatus_g + "&isrcpa=" + isRCPA_g + "&source=" + source_g + "&flag=" + flag_g, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnCreateActivityList() {
    try {
        for (var a = 0; a < dcrHeader_g[2].Data.length; a++) {
            var stckStr = '<li data-theme="c"><a  data-transition="slide" onclick="fnGoToHeader()" >' + dcrHeader_g[2].Data[a].Activity_Name + ' </a></li>';
            $('#actlist').append(stckStr);
        }
        $('#actlist').listview("refresh");
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
        return false;
    }
}


function fnGetHeaderDetails() {
    try {
        $.mobile.loading('show');
        $.ajax({
            type: 'POST',
            data: 'dcrStatus=' + dcrStatus_g + '&dcrDate=' + dcrDate_g + '&source=' + source_g + '&flag=' + flag_g,
            url: '/HiDoctor_Activity/MobileHome/GetHeaderDetails',
            success: function (response) {

                var result = response;
                dcrHeader_g = result;
                // set travell km to get expense.
                if (dcrHeader_g.length > 0 && dcrHeader_g[0].Data != null) {
                    travelKMS_g = dcrHeader_g[0].Data[0].Distance;
                }
                fnCreateHeader()
                if (flag_g == "A") {
                    fnCreateActivityList();

                    GetExpense()
                }
                else {
                    fnGetDoctorList(1);
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, e);
                return false;
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
        return false;
    }
    return true;
}

function fnGetDoctorList(calTime) {
    try {
        var month = dcrDate_g.split('-')[1];
        var year = dcrDate_g.split('-')[0];
        $.ajax({
            type: 'POST',
            data: "dcrActualDate=" + dcrDate_g + '&tpname=' + escape(tpCode_g) + '&cpname=' + escape(cpCode_g) + "&month=" + month + "&year=" + year,
            url: '/HiDoctor_Activity/DCRDoctorVisit/GetDoctorVisitData',
            success: function (response) {
                if (response != null && response.Data != null) {
                    var result = response.Data;
                    doclist_g = result;
                    fnCreateDocList();
                    if (calTime == 1) {
                        GetStockiests()
                    }
                    else {
                        $.mobile.loading('hide');
                    }
                }
                else {
                    if (calTime == 1) {
                        GetStockiests()

                    }
                    else {
                        $.mobile.loading('hide');
                    }
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, e);
                return false;
            }
        });
        return true;
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
        return false;

    }
}

function GetStockiests() {
    try {
        $.ajax({
            type: 'POST',
            data: 'dcrDate=' + dcrDate_g + '&dcrStatus=' + dcrStatus_g,
            url: '/HiDoctor_Activity/MobileHome/GetStockiests',
            success: function (response) {
                var result = response;
                stockist_g = result;
                fnCreateStockList();
                GetExpense();
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, e);
                return false;
            }
        });
        return true;
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
        return false;
    }
}

function GetExpense() {
    try {
        var intermediatePlace = fnGetPrivilegeValue("DCR_INTERMEDIATE_PLACES", "");
        var entity = category_g;
        var dcrDate = dcrDate_g
        var travelKm = travelKMS_g;
        var dcrStatus = dcrStatus_g;

        if (sourceFromStockist_g == 'TAB_STOCKIEST') {
            dcrStatus = '3';
        }

        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRStockiestExpense/ExpenseDetails',
            data: "InterMediate_Places_Needed=" + intermediatePlace + " &entity=" + escape(entity) + "&dcrDate=" + dcrDate + "&Travel_Km=" + travelKm + "&dcrStatus=" + dcrStatus + "&flag=" + flag_g,
            success: function (response) {
                var result = response;
                expenselist_g = result;

                fnCreateExpeList();
                $.mobile.loading('hide');
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, e);
                return false;
            }
        });
        return true;
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
        return false;
    }
}

function fnSaveExpenseFromHome() {
    $.mobile.loading('show');
    if (sourceFromStockist_g != 'TAB_STOCKIEST' && $('#explist li input').length > 0) {
        var correctIndex = [];
        for (var j = 0; j < $('#explist li input').length; j++) {
            //valid Expense Type check
            var expense = $('#explist li input')[j].value;
            var expenseJson = jsonPath(expenselist_g[0], "$.Data[?(@.ExpenseTypeCode=='" + expense + "')]");
            if (expenseJson == false || expenseJson === undefined || expenseJson.length <= 0) {
                fnMsgAlert('info', 'Stockist & Expense', $('#explist li a')[j].innerHTML.split('-')[0] + ' is invalid Expense Type.');
                $.mobile.loading('hide');
                $('#btnSaveDCRHome').show();
                return false;
            }
            correctIndex.push(j);
        }

        if (expenselist_g[0].Data.length > 0 && correctIndex.length > 0) {
            fnCanSplitAmountHomeExpense(0, correctIndex);
        }
        else {
            fnReadHomeExpenseTable();
        }
    }
    else {
        fnSubmitforApproval();
    }
}

function fnCanSplitAmountHomeExpense(index, row) {

    var i = row[index];
    if ($('#explist li input')[i].value != "") {
        var expense = $('#explist li input')[i].value;
        var expenseJson = jsonPath(expenselist_g[0], "$.Data[?(@.ExpenseTypeCode=='" + expense + "')]");

        //  Can_Split_Amount check
        if (expenseJson[0].ExpenseMode != "DAILY") {
            if (expenseJson[0].CanSplitAmount == "N") {
                $.ajax({
                    type: "POST",
                    url: '/HiDoctor_Activity/DCRStockiestExpense/GetExpenseSum',
                    data: "dcrDate=" + dcrDate_g + "&expenseMode=" + expenseJson[0].ExpenseMode + "&expenseTypeCode=" + expenseJson[0].ExpenseTypeCode,
                    success: function (expenseSum) {
                        if (expenseSum > 0.0) {
                            fnMsgAlert('info', 'Stockist & Expense', 'Already you have entered ' + expenseJson[0].ExpenseTypeName + '. And it can not be split for the expense mode ' + expenseJson[0].ExpenseMode + '.');
                            $.mobile.loading('hide');
                            $('#btnSaveDCRHome').show();
                            //$.msgbox('Already you have entered ' + $("#txtExpense_" + i).val() + '. And it can not be split for the expense mode ' + expenseJson[0].ExpenseMode + '.');                            
                            return false;
                        }
                        else {
                            if (row.length != (index + 1)) {
                                fnCanSplitAmountHomeExpense((index + 1), row);
                            }
                            else {
                                return (fnEligibilityAmountCheckHomeExpense(0, row));
                            }
                        }
                    }
                });
            }
            else {
                if (row.length != (index + 1)) {
                    fnCanSplitAmountHomeExpense((index + 1), row);
                }
                else {
                    return (fnEligibilityAmountCheckHomeExpense(0, row));
                }
            }
        }
        else {
            if (row.length != (index + 1)) {
                fnCanSplitAmountHomeExpense((index + 1), row);
            }
            else {
                return (fnEligibilityAmountCheckHomeExpense(0, row));
            }
        }
    }
    else {
        if (row.length != (index + 1)) {
            fnCanSplitAmountHomeExpense((index + 1), row);
        }
        else {
            return (fnEligibilityAmountCheckHomeExpense(0, row));
        }
    }
}

function fnEligibilityAmountCheckHomeExpense(index, row) {

    var i = row[index];
    if ($('#explist li input')[i].value != "") {
        var expense = $('#explist li input')[i].value;
        var expenseJson = jsonPath(expenselist_g[0], "$.Data[?(@.ExpenseTypeCode=='" + expense + "')]");

        // Is_Validation_On_Eligibility check.
        if (expenseJson[0].SFC_Type == 'E') {
            if (expenseJson[0].IsValidationOnEligibility == "Y") {
                // Getting eligibility amount.
                if (expenseJson[0].EligibilityAmount != "") {
                    var eligibilityAmount = parseFloat(expenseJson[0].EligibilityAmount);
                }
                else {
                    var eligibilityAmount = 0.0;
                }

                // Check for ExpenseMode
                if (expenseJson[0].ExpenseMode != "") {
                    if (expenseJson[0].ExpenseMode.toUpperCase() == "DAILY") {
                        var enteredAmount = parseInt($('#explist li a span')[i].innerHTML);

                        if (enteredAmount > eligibilityAmount) {
                            $.mobile.loading('hide');
                            fnMsgAlert('info', 'Stockist & Expense', 'You have entered more than the eligibilty amount for the expense type ' + expenseJson[0].ExpenseTypeName + '.');
                            $('#btnSaveDCRHome').show();
                            return false;
                        }
                        else {
                            if (row.length != (index + 1)) {
                                fnEligibilityAmountCheckHomeExpense((index + 1), row);
                            }
                            else {
                                fnReadHomeExpenseTable();
                            }
                        }
                    }
                    else {
                        var enteredAmount = parseInt($('#explist li a span')[i].innerHTML);

                        $.ajax({
                            type: "POST",
                            url: '/HiDoctor_Activity/DCRStockiestExpense/GetExpenseSum',
                            data: "dcrDate=" + dcrDate_g + "&expenseMode=" + expenseJson[0].ExpenseMode + "&expenseTypeCode=" + expenseJson[0].ExpenseTypeCode,
                            success: function (expenseSum) {
                                enteredAmount = parseInt(enteredAmount) + parseInt(expenseSum);
                                if (enteredAmount > eligibilityAmount) {
                                    $.mobile.loading('hide');
                                    fnMsgAlert('info', 'Stockist & Expense', 'You have entered more than the eligibilty amount for the expense type ' + expenseJson[0].ExpenseTypeName + '.');
                                    $('#btnSaveDCRHome').show();
                                    return false;
                                }
                                else {
                                    if (row.length != (index + 1)) {
                                        fnEligibilityAmountCheckHomeExpense((index + 1), row);
                                    }
                                    else {
                                        fnReadHomeExpenseTable();
                                    }
                                }
                            }
                        });
                    }
                }
                else {
                    if (row.length != (index + 1)) {
                        fnEligibilityAmountCheckHomeExpense((index + 1), row);
                    }
                    else {
                        fnReadHomeExpenseTable();
                    }
                }
            }
            else {
                if (row.length != (index + 1)) {
                    fnEligibilityAmountCheckHomeExpense((index + 1), row);
                }
                else {
                    fnReadHomeExpenseTable();
                }
            }
        }
        else {
            if (row.length != (index + 1)) {
                fnEligibilityAmountCheckHomeExpense((index + 1), row);
            }
            else {
                fnReadHomeExpenseTable();
            }
        }
    }
    else {
        if (row.length != (index + 1)) {
            fnEligibilityAmountCheckHomeExpense((index + 1), row);
        }
        else {
            fnReadHomeExpenseTable();
        }
    }
}

function fnReadHomeExpenseTable() {
    var expenseDetails = "";
    if (expenselist_g[0].Data.length > 0) {
        // Generate the expense data string

        for (var i = 0; i < $('#explist li input').length; i++) {
            if ($('#explist li input')[i].value != "") {
                var expense = $('#explist li input')[i].value;
                var expenseJson = jsonPath(expenselist_g[0], "$.Data[?(@.ExpenseTypeCode=='" + expense + "')]");

                expenseDetails += expenseJson[0].ExpenseTypeName + '^';
                expenseDetails += $('#explist li input')[i].value + '^';//Expense Type Code
                expenseDetails += $('#explist li a span')[i].innerHTML + '^'; // Expense Type Name               
                expenseDetails += expenseJson[0].ExpenseMode + '^';
                expenseDetails += (expenseJson[0].EligibilityAmount == null ? '0' : expenseJson[0].EligibilityAmount.length > 0 ? expenseJson[0].EligibilityAmount : '0') + '^';
                expenseDetails += expenseJson[0].ExpenseGroupId + '^';
                expenseDetails += "" + '^';
            }
        }
    }

    // get DCR_AUTO_APPROVAL privilege value

    var dailyAllowance = fnGetPrivilegeValue("FARE_DAILY_ALLOWANCE", "");

    // insert expense details.
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRStockiestExpense/InsertExpense',
        data: "expenseContent=" + escape(expenseDetails) + "&dcrDate=" + dcrDate_g + "&dcrStatus=" + dcrStatus_g + "&dailyAllowance=" + dailyAllowance + "&dcrFlag=" + flag_g,
        success: function (result) {
            if (result.toUpperCase() == "TRUE") {
                fnSubmitforApproval();
            }
            else {
                fnMsgAlert('error', 'Stockist & Expense', 'Insertion failed.');
                $.mobile.loading('hide');
                $('#btnSaveDCRHome').show();
            }
        }
    });
}


function fnSubmitforApproval() {


    try {
        $.mobile.loading('show');
        if (flag_g != "A") {
            var isThereAnyOneDocSaved = 0;
            if (doclist_g != null && doclist_g[0] != null && doclist_g[0].Data != null && doclist_g[0].Data.length > 0) {
                var doc_data = doclist_g[0].Data;

                for (var i = 0; i < doc_data.length; i++) {
                    if (doclist_g[0].Data[i].Doctor_Visit_Code != null && doclist_g[0].Data[i].Doctor_Visit_Code.length > 0) {
                        isThereAnyOneDocSaved = 1;
                        break;
                    }
                }


            }
            if (isThereAnyOneDocSaved == 0) {
                fnMsgAlert('error', 'Doctor Visit', 'Please save atleast one doctor.');
                $.mobile.loading('hide');
                $('#btnSaveDCRHome').show();
                return false;
            }

        }

        var autoApproval = fnGetPrivilegeValue("DCR_AUTO_APPROVAL", "NO");
        var calcFieldsStatus = fnGetPrivilegeValue("CALC_FIELD_STATUS", "APPROVED");
        var dcrStatus = dcrStatus_g;
        var flag = flag_g;
        var dcrDate = $.trim(dcrDate_g);
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRStockiestExpense/UpdateProductAndStatus',
            data: "dcrDate=" + dcrDate + " &autoApproval=" + autoApproval + "&calcFieldStatus=" + calcFieldsStatus + "&dcrStatus=" + dcrStatus + "&dcrFlag=" + flag_g + "&commonRemarks=" + $("#txtDCRCommonRmrks").val(),
            success: function (response) {
                if (response) {
                    $.mobile.changePage("/HiDoctor_Activity/DCRCalendar/Index", {
                        type: "post",
                        reverse: false,
                        changeHash: false
                    });
                }
            },
            error: function (e) {
                return false;
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message);
        $('#btnSaveDCRHome').show();
        return false;
    }

}

function fnDeleteDoctor(dvCode) {
    var productBringType_g = "^";
    if (dvCode != null && dvCode != "") {
        if (confirm('Do you wish to delete the Doctor and related details?')) {
            $.mobile.loading('show');
            $.ajax({
                type: 'POST',
                url: '/HiDoctor_Activity/DCRDoctorVisit/DeleteDoctorVisitData',
                data: 'dvcode=' + dvCode + "&dcrActualDate=" + dcrDate_g + "&prodBringType=" + productBringType_g,
                success: function (response) {
                    // we have the response
                    var result = response;
                    if (result != null) {
                        /* if (dvCode == $('#hdnDoctorVisitCode').val()) {
                             fnClear();
                         }*/
                        /*productAutoFill_g = result;
                        productAutoFillOri_g = JSON.stringify(result);
                        autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");*/
                        fnGetDoctorList(2);

                        //fnGetDoctorVisitData(2);
                    }
                    else {
                        //$.msgbox(result);
                        $.mobile.loading('hide');
                        fnMsgAlert('error', screenTitle, result)
                        //alert(result);
                    }
                },
                error: function (e) {
                    //$.msgbox('Delete Transaction Failed.', { type: "error" });
                    $.mobile.loading('hide');
                    fnMsgAlert('error', screenTitle, 'Delete Transaction Failed.');
                    //alert("Page Error");
                }
            });
        }
    }
}

function fnGoToCalendar() {
    $.mobile.changePage("/HiDoctor_Activity/DCRCalendar/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnOpenDCROldRemarks() {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRStockiestExpense/GetCommonRemarks',
        data: "dcrDate=" + dcrDate_g + "&dcrFlag=" + flag_g,
        success: function (response) {
            var content = "";
            if (response != "") {
                var remrksArr = response.split('^');
                for (var i = 0; i < remrksArr.length; i++) {
                    content += "<div style='float:left;width:90%;'>" + remrksArr[i] + "</div>";
                }
            }
            else {
                content += "<div style='float:left;width:90%;'>No Previous Remarks Found</div>";
            }
            $("#dvOpenDCROldRemarks").html(content).trigger('create');
            $("#dvOpenDCROldRemarksMain").simpledialog2();
        }
    });
}
