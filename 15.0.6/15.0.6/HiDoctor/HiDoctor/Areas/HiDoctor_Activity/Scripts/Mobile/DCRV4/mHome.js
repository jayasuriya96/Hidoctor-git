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
var acc_g = new Array();
var screenTitle = "Home"

function fnCreateHeader() {
    $('#listHeader').html('');
    try {
        if (flag_g == "A") {
            if (dcrHeader_g.length > 0 && dcrHeader_g[2].Data != null) {
                var headerStr = "";
                category_g = dcrHeader_g[2].Data[0].Category_Name;
                headerStr = '<li data-theme="c" onclick="fnGoToHeader()"><div class="home_placelabel" >Category:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].Category_Name + '</div><div class="clearboth"></div>';
                if (dcrHeader_g[2].Data[0].Category_Name.toUpperCase() != "HQ") {
                    if (dcrHeader_g[1].Data.length == 0) {
                        if (dcrHeader_g[1].Data[0].Rout_Way == "R") {
                            headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].To_Place + '</div><div class="clearboth"></div>';
                            headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].From_Place + '</div>';
                            headerStr += '<div class="clearboth"></div>';
                        }
                        else {
                            headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].From_Place + '</div><div class="clearboth"></div>';
                            headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].To_Place + '</div>';
                            headerStr += '<div class="clearboth"></div>';
                        }
                    }
                    else {
                        for (var i = 0; i < dcrHeader_g[1].Data.length; i++) {
                            var fromPlace = dcrHeader_g[1].Data[i].From_Place;
                            var toPlace = dcrHeader_g[1].Data[i].To_Place;
                            var routeWay = dcrHeader_g[1].Data[i].Route_Way;
                            if (routeWay == "R") {
                                headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + toPlace + '</div><div class="clearboth"></div>';
                                headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + fromPlace + '</div>';
                                headerStr += '<div class="clearboth"></div>';

                            }
                            else {
                                headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + fromPlace + '</div><div class="clearboth"></div>';
                                headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + toPlace + '</div>';
                                headerStr += '<div class="clearboth"></div>';
                            }
                        }
                    }
                }
                else {
                    if (dcrHeader_g[2].Data[0].Rout_Way == "R") {
                        headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].To_Place + '</div><div class="clearboth"></div>';
                        headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].From_Place + '</div>';
                        headerStr += '<div class="clearboth"></div>';
                    }
                    else {
                        headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].From_Place + '</div><div class="clearboth"></div>';
                        headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[2].Data[0].To_Place + '</div>';
                        headerStr += '<div class="clearboth"></div>';
                    }
                }
            }
            tpCode_g = dcrHeader_g[2].Data[0].Tp_Code == null ? "" : dcrHeader_g[2].Data[0].Tp_Code;
            headerStr += '<div class="clearboth"></div></li>';
            $('#listHeader').append(headerStr);
            $('#listHeader').listview("refresh");
        }
        else {
            if (dcrHeader_g.length > 0 && dcrHeader_g[0].Data != null) {
                var headerStr = "";
                unapproveReason_g = dcrHeader_g[0].Data[0].UnApprovalReason;
                category_g = dcrHeader_g[0].Data[0].Category_Name;
                headerStr = '<li data-theme="c" onclick="fnGoToHeader()"><div class="home_placelabel" >Category:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].Category_Name + '</div><div class="clearboth"></div>';
                if (dcrHeader_g[0].Data[0].Category_Name.toUpperCase() != "HQ") {
                    if (dcrHeader_g[1].Data.length == 0) {
                        if (dcrHeader_g[0].Data[0].Rout_Way == "R") {
                            headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].To_Place + '</div><div class="clearboth"></div>';
                            headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].From_Place + '</div>';
                            headerStr += '<div class="clearboth"></div>';
                        }
                        else {
                            headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].From_Place + '</div><div class="clearboth"></div>';
                            headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].To_Place + '</div>';
                            headerStr += '<div class="clearboth"></div>';
                        }
                    }
                    else {
                        for (var i = 0; i < dcrHeader_g[1].Data.length; i++) {
                            var fromPlace = dcrHeader_g[1].Data[i].From_Place;
                            var toPlace = dcrHeader_g[1].Data[i].To_Place;
                            var routeWay = dcrHeader_g[1].Data[i].Route_Way;
                            if (routeWay == "R") {
                                headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + toPlace + '</div><div class="clearboth"></div>';
                                headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + fromPlace + '</div>';
                                headerStr += '<div class="clearboth"></div>';

                            }
                            else {
                                headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + fromPlace + '</div><div class="clearboth"></div>';
                                headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + toPlace + '</div>';
                                headerStr += '<div class="clearboth"></div>';
                            }
                        }
                    }
                }
                else {
                    if (dcrHeader_g[0].Data[0].Rout_Way == "R") {
                        headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].To_Place + '</div><div class="clearboth"></div>';
                        headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].From_Place + '</div>';
                        headerStr += '<div class="clearboth"></div>';
                    }
                    else {
                        headerStr += '<div class="home_placelabel" >From Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].From_Place + '</div><div class="clearboth"></div>';
                        headerStr += '<div class="home_placelabel">To Place:</div><div class="homeplace_value">' + dcrHeader_g[0].Data[0].To_Place + '</div>';
                        headerStr += '<div class="clearboth"></div>';
                    }
                }
            }
            cpCode_g = dcrHeader_g[0].Data[0].CP_Code == null ? "" : dcrHeader_g[0].Data[0].CP_Code;
            tpCode_g = dcrHeader_g[0].Data[0].Tp_Code == null ? "" : dcrHeader_g[0].Data[0].Tp_Code;
            var acc1Region = dcrHeader_g[0].Data[0].Acc1_Code == null ? "^" : dcrHeader_g[0].Data[0].Acc1_Code + "^";
            var acc2Region = dcrHeader_g[0].Data[0].Acc2_Code == null ? "^" : dcrHeader_g[0].Data[0].Acc2_Code + "^";
            var acc3Region = dcrHeader_g[0].Data[0].Acc3_Code == null ? "^" : dcrHeader_g[0].Data[0].Acc3_Code + "^";
            var acc4Region = dcrHeader_g[0].Data[0].Acc4_Code == null ? "^" : dcrHeader_g[0].Data[0].Acc4_Code + "^";
            var acc = {};
            if (dcrHeader_g[0].Data[0].Acc1_Name != null) {
                acc.accName = dcrHeader_g[0].Data[0].Acc1_Name;
                acc.accCode = dcrHeader_g[0].Data[0].Acc1_Code;
                acc.accOnlyDoc = $.trim(dcrHeader_g[0].Data[0].Acc1_Only_For_Doctor).length > 0 ? "checked" : "";
            }
            if (Object.keys(acc).length != 0) {
                acc_g.push(acc);
            }

            var acc = {};
            if (dcrHeader_g[0].Data[0].Acc2_Name != null) {
                acc.accName = dcrHeader_g[0].Data[0].Acc2_Name;
                acc.accCode = dcrHeader_g[0].Data[0].Acc2_Code;
                acc.accOnlyDoc = $.trim(dcrHeader_g[0].Data[0].Acc2_Only_For_Doctor).length > 0 ? "checked" : "";
            }
            if (Object.keys(acc).length != 0) {
                acc_g.push(acc);
            }

            var acc = {};
            if (dcrHeader_g[0].Data[0].Acc3_Name != null) {
                acc.accName = dcrHeader_g[0].Data[0].Acc3_Name;
                acc.accCode = dcrHeader_g[0].Data[0].Acc3_Code;
                acc.accOnlyDoc = $.trim(dcrHeader_g[0].Data[0].Acc3_Only_For_Doctor).length > 0 ? "checked" : "";
            }
            if (Object.keys(acc).length != 0) {
                acc_g.push(acc);
            }

            var acc = {};
            if (dcrHeader_g[0].Data[0].Acc4_Name != null) {
                acc.accName = dcrHeader_g[0].Data[0].Acc4_Name;
                acc.accCode = dcrHeader_g[0].Data[0].Acc4_Code;
                acc.accOnlyDoc = $.trim(dcrHeader_g[0].Data[0].Acc4_Only_For_Doctor).length > 0 ? "checked" : "";
            }
            if (Object.keys(acc).length != 0) {
                acc_g.push(acc);
            }

            accRegions_g = acc1Region + acc2Region + acc3Region + acc4Region;
            headerStr += '<div class="clearboth"></div></li>';
            $('#listHeader').append(headerStr);
            $('#listHeader').listview("refresh");
        }
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
            var waimg = '<img src="../Images/circle.png" style="width:16px;height:16px" title="WideAngle" alt="WideAngle" id="imgWideAngle">';
            var record_Status = doclist_g[0].Data[i].Record_Status;
            var mode_of_entry = doclist_g[0].Data[i].Mode_Of_Entry;
            var source_of_Entry = doclist_g[0].Data[i].Source_of_Entry;
            var customer_Status = doclist_g[0].Data[i].Customer_Status;
            var deleteDoctor = "";
            var docVistTick = "";
            var clsCustomerStatus = "";
            if (customer_Status != '1' && customer_Status != "" && customer_Status != null) {
                clsCustomerStatus = "customerStatus";
            }
            if (record_Status == 3) {
                docVistTick = "<div class='tick'></div>";
                if (mode_of_entry != "A") {
                    deleteDoctor = '<a id="docdelete_' + i + '" href="#" class="delete-icon" style="padding:15px;" onclick="fnDeleteDoctor(\'' + doclist_g[0].Data[i].Doctor_Visit_Code + '\');" ></a>';
                }
            }
            if (doclist_g[0].Data[i].Doctor_Visit_Code != null && doclist_g[0].Data[i].Doctor_Visit_Code.length > 0) {
                if (source_of_Entry.toUpperCase() == "TABLET") {
                    doclistStr += docVistTick + waimg + '<div data-role="fieldcontain"  style="margin-top:-5px;margin-right:1px;float:right;">' + deleteDoctor + '</div>';
                }
                else {
                    doclistStr += docVistTick + '<div data-role="fieldcontain" style="margin-top:-5px;margin-right:1px;float:right;">' + deleteDoctor + '</div>';
                }
                docArray.push(dname);
            }
            var region = doclist_g[0].Data[i].Doctor_Name.split('_')[3];
            doclistStr += '<a href="#page1" data-transition="slide" id="docname_' + i + '" onclick="fnGotoDoctorScreen(' + i + ')" ><span class="' + clsCustomerStatus + '" id="spndocname_' + i + '">' + dname.split('*')[0] + "<br />@" + region + "</span>";
            doclistStr += '<div class="dvchemlist">';
            var dvCode = doclist_g[0].Data[i].Doctor_Visit_Code;
            var status = doclist_g[0].Data[i].Record_Status;
            codes = dvCode != null ? dvCode + "^" + status : "";

            // Added Accompanist details for V4 home only.
            if (doclist_g[1].Data != null) {
                var docAccJSON = jsonPath(doclist_g[1].Data, "$.[?(@.Doctor_Visit_Code=='" + dvCode + "')]");
                for (var da = 0; da < docAccJSON.length; da++) {
                    doclistStr += '<div class="dvdocAccList">' + docAccJSON[da].Acc_User_Name + '</div>'
                    if (da == docAccJSON.length - 1) {
                        // codes += docAccJSON[da].DCR_Doctor_Acc_Code + "^,";
                    }
                    else {
                        // codes += docAccJSON[da].DCR_Doctor_Acc_Code + "^";
                    }
                }

                if (!docAccJSON || docAccJSON.length == 0) {
                    // codes += "^,";
                }
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
    //Add * for end of the name 
    var arrdoctorName = $('#spndocname_' + index).html().split("<br>");
    if (arrdoctorName.length > 1) {
        var cityname = arrdoctorName[1];
        var index = cityname.indexOf('*');
        if (index > 0) {
            for (var i = index; i < arrdoctorName[1].length; i++) {
                if (docname === '')
                    docname = cityname[i];
                else
                    docname += cityname[i];
            }
        }
    }
    //
    var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";

    $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/Index?Status=" + dcrStatus_g + "&flagRCPA=" + rcpa + "&accUsers=" + accRegions_g + "&cp=&tp=&dcrActualDate=" + dcrDate_g + "&category=&travelledkms=" + travelKMS_g + "&source=&flag=&codes=&doctorName=" + docname + "&tp_Code=" + tpCode_g, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnGoToDoctorsSelection() {
    var codes = "";
    var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";

    $.mobile.changePage("/HiDoctor_Activity/DCRV4ChooseDoctorsSelection/index?codes=" + codes + "&dcractualdate=" + dcrDate_g + "&accusers=" + accRegions_g + "&flagrcpa=" + rcpa + "&doctorname=''&speciality=''&travelkm=" + travelKMS_g, {
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

    $.mobile.changePage("/HiDoctor_Activity/DCRV4StockiestExpense/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=" + dcrStatus + "&entity=" + category_g + "&travelkm=" + travelKMS_g + "&isRCPA=" + isRCPA_g + "&accRegions=" + accRegions_g + "&flag=" + flag_g + "&actvity=" + activity, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}
function fnGoToHeader() {
    $.mobile.changePage("/HiDoctor_Activity/DCRV4Header/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=" + dcrStatus_g + "&isrcpa=" + isRCPA_g + "&source=" + source_g + "&flag=" + flag_g, {
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
            url: '/HiDoctor_Activity/DCRV4MobileHome/GetHeaderDetails',
            success: function (response) {

                var result = response;
                dcrHeader_g = result;
                // set travell km to get expense.
                //if (dcrHeader_g.length > 0 && dcrHeader_g[0].Data != null) {
                //    travelKMS_g = dcrHeader_g[0].Data[0].Distance;
                //}
                debugger;
                fnCreateHeader();

                if (flag_g == "A") {
                    $('#activityBar').css('display', '');
                    $('#doclistbar').css('display', 'none');
                    $('#dvdoclist').css('display', 'none');
                    $('#dvStockiest').css('display', 'none');
                    travelKMS_g = dcrHeader_g[2].Data[0].Distance;
                    fnCreateActivityList();
                    //GetExpense();
                }
                else {
                    $('#activityBar').css('display', 'none');
                    $('#doclistbar').css('display', '');
                    $('#dvdoclist').css('display', '');
                    $('#dvStockiest').css('display', '');
                    travelKMS_g = dcrHeader_g[0].Data[0].Distance;
                    fnGetDoctorList(1);
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, e.responseText);
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
        tpCode_g = tpCode_g == null ? "-1" : tpCode_g == "" ? "-1" : tpCode_g
        $.ajax({
            type: 'POST',
            data: "DCR_Actual_Date=" + dcrDate_g + '&TP_Id=' + escape(tpCode_g) + '&CP_Code=' + escape(cpCode_g) + "&request_From=MOBILE",
            url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDoctorVisitDetailsPerDay',
            success: function (response) {
                if (response != null) {
                    doclist_g = response;
                    fnCreateDocList();
                    $.mobile.loading('hide');
                    if (calTime == 1) {
                        //                        GetStockiests()
                    }
                    else {
                        $.mobile.loading('hide');
                    }
                }
                else {
                    $.mobile.loading('hide');
                    if (calTime == 1) {
                        //                      GetStockiests()

                    }
                    else {
                        $.mobile.loading('hide');
                    }
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, e.responseText);
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
                fnMsgAlert('info', screenTitle, e.responseText);
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

function fnDrAccMandatory() {
    var accMand = true;

    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDrAccMandatory',
        data: 'DCR_Date=' + dcrDate_g,
        async: false,
        success: function (result) {

            if (result != "No") {
                fnMsgAlert('info', 'Accompanist Details', result);
                accMand = false;
            }
        }
    });
    return accMand;
}

function fnSaveExpenseFromHome() {
    var InDoctorVisit = GetAccompanistMandatoryInDoctorVisit();
    if (InDoctorVisit) {
        if (fnDrAccMandatory()) {
            $.mobile.loading('show');
            fnGotoStockistExpense();
        }
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
                        fnGetDoctorList(2);
                    }
                    else {
                        $.mobile.loading('hide');
                        fnMsgAlert('error', screenTitle, result)
                    }
                },
                error: function (e) {
                    $.mobile.loading('hide');
                    fnMsgAlert('error', screenTitle, 'Delete Transaction Failed.');
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

function GetAccompanistMandatoryInDoctorVisit() {
    var rValue = false;
    $.ajax({
        type: 'POST',
        data: "dcr_date=" + dcrDate_g,
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetAccompanistMandatoryInDoctorVisit',
        async: false,
        success: function (response) {
            if (response == 'NO') {
                rValue = true;
            }
            else {
                var acc_name = response.split('^');
                var name = "";
                for (var i = 0; i < acc_name.length; i++) {
                    if (name == '')
                        name = acc_name[i];
                    else
                        name = name + ', ' + acc_name[i];
                }
                fnMsgAlert('error', 'Doctor Visit', 'All the accompanist who are selected in the first screen should be a part of at least one doctor visit.Following Accompanist not part of any Accompanied call(YES) :' + name);
                rValue = false;
            }

        }
    });
    return rValue;
}
