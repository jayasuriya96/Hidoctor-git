//**************************** START- DCR CONSOLIDATED REPORT ****************************************//
var smallMonthArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var jDcrCons = ""; var fnCnt = 0;
var accHeaderTableString_g = ' <table class="accHeaderTable"><tr><td style="font-weight:bold;">User Name</td> <td><span id="spnpuserName"></span></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">Employee Name</td><td><span id="spnEmpName"></span></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">Region Name</td><td><span id="spnRegionName"></span></td></tr>';
accHeaderTableString_g += '<tr><td style="font-weight:bold;">DCR Date</td> <td><span id="spnDCRDate"></span></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">DCR Type</td><td><span id="spnDCRType"></span></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">DCR Status</td><td><span id="spnDCRStatus"></span></td>';
accHeaderTableString_g += '</tr><tr><td style="font-weight:bold;">Work Place</td> <td><span id="spnWorkPlace"></span></td><td style="font-weight:bold;">Travelled Places</td>';
accHeaderTableString_g += '<td id="tdTravlledPlaces"></td>';
accHeaderTableString_g += '<td style="font-weight:bold;">Entered Date</td><td><span id="spnDCRentedDate"></span></td>';
accHeaderTableString_g += '</tr></table><br />';
accHeaderTableString_g += '<table style="margin:0px auto">';
accHeaderTableString_g += '<tr><td style="font-weight: bold;white-space:nowrap">Accompanist Name : </td><td><span id="accPopUpName"></span></td></tr>';
accHeaderTableString_g += '<tr><td style="font-weight: bold;">Time : </td><td><span id="accPopUpTime" style="white-space:nowrap"></span></td></tr>';
accHeaderTableString_g += '</table>';


var detailProdString_g = '<table class="accHeaderTable"><tr><td style="font-weight:bold;">User Name</td><td><span id="spnduserName"></span></td><td style="font-weight:bold;">Employee Name</td>';
detailProdString_g += '<td><span id="spndEmpName"></span></td><td style="font-weight:bold;">Region Name</td><td><span id="spndRegionName"></span></td>';
detailProdString_g += '</tr><br /><tr><td style="font-weight:bold;">Doctor Name</td><td><span id="spndDocName"></span></td><td style="font-weight:bold;">MDL No</td><td><span id="spndMDL"></span></td>';
detailProdString_g += '<td style="font-weight:bold;">Specilaity</td><td><span id="spndSpeciality"></span></td></tr><tr><td style="font-weight:bold;">Category</td><td><span id="spndCategory"></span></td>';
detailProdString_g += '</tr></table>';

function fnDCRConsolidatedReport() {
    //  myFunction();

    $("#DcrDisclaimer").show();
    $("#hdnSelect").val("");
    //$("#divReport").empty();
    $("#divHeaderDetails").empty();
    //  $("#leftNav").hide();
    $('#tree').hide();
    $("#spnTreeToggle").html('Show Tree');
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-12');

    //hide All dives
    $("#divReport").hide();
    $("#aExpandCollapse").html("Collapse All");
    var objCol = $("#aExpandCollapse");
    fnDCRConsExpandCollapseAll(objCol);
    $("#aExpandCollapse").html("Collapse All");

    $("#lstStock").hide();
    $("#lstChem").hide();
    $("#lstProd").hide();
    $("#lstDCRHead").hide();
    $("#lstDocVisit").hide();
    $("#lstDocMiss").hide();
    $("#lstUnlistDoc").hide();
    $("#lstExp").hide();
    $("#lstRCPA").hide();
    $("#lstWA").hide();

    //empty div
    $("#dvStock").empty();
    $("#dvChem").empty();
    $("#dvProd").empty();
    $("#dvDCRHead").empty();
    $("#dvDocVisit").empty();
    $("#dvDocMiss").empty();
    $("#dvUnlistDoc").empty();
    $("#dvExp").empty();
    $("#dvRCPA").empty();
    $("#dvWA").empty();



    // clear print
    $("#divPrintProd").empty();
    $("#divPrintStock").empty();
    $("#divPrintChem").empty();
    $("#divPrintDCRHead").empty();
    $("#divPrintDocVisit").empty();
    $("#divPrintDocMiss").empty();
    $("#divPrintUnlistDoc").empty();
    $("#divPrintExp").empty();
    $("#divPrintRCPA").empty();
    $("#divPrintWA").empty();

    ShowModalPopup('dvloading');
    if (fnValidateDCRConsRprt()) {

        var dcrStatus = "";
        var option = "";
        var startDate = "", endDate = "";

        startDate = $.trim($("#txtFromDate").val().split('/')[2]) + "-" + $.trim($("#txtFromDate").val().split('/')[1]) + "-" + $.trim($("#txtFromDate").val().split('/')[0]);
        endDate = $.trim($("#txtToDate").val().split('/')[2]) + "-" + $.trim($("#txtToDate").val().split('/')[1]) + "-" + $.trim($("#txtToDate").val().split('/')[0]);

        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        // GET OPTIONS
        if ($(":checkbox[name=optionAll]:checked").length > 0) {
            option = $("input:checkbox[name=optionAll]:checked").val();
        }
        else {
            $('input:checkbox[name=otn]').each(function () {
                if ($(this).is(':checked')) { option += $(this).val() + "^"; }
            });
        }

        var showWAData = 'N';
        if ($(":checkbox[name=showWA]:checked").length > 0) {
            showWAData = 'Y';
        }

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsolidatedReport',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&option=' + escape(option) + '&userCode=' + $("#hdnUserCode").val() + '&showWAData=' + showWAData,
            success: function (response) {
                jDcrCons = eval('(' + response + ')');
                var tblCont = "";
                if (!(jDcrCons.Tables === undefined) && jDcrCons.Tables.length > 0 && jDcrCons.Tables[0].Rows.length > 0) {
                    tblCont = "<div class='gridDCRConsHeader'><h3 style='width: 99.5%;margin:0px auto'>Summary</h3></div>";
                    tblCont += "<div style='width: 100%;overflow: auto;margin-bottom: 20px;'><table cellspacing='0' cellpadding='0' id='tblDCRReprt' class='data display dataTable box' width='100%' style='margin-bottom:20px;'>";
                    tblCont += "<thead>";
                    tblCont += "<tr>";
                    tblCont += "<th>View Detailed</th>";
                    tblCont += "<th>User id</th>";
                    tblCont += "<th>Employee Name</th>";
                    tblCont += "<th>Employee No</th>";
                    tblCont += "<th>Designation</th>";
                    tblCont += "<th>Date of Joining</th>";
                    tblCont += "<th>Region Name</th>";
                    tblCont += "<th>Division Name</th>";
                    tblCont += "<th>Reporting Region</th>";


                    // all selected
                    if ($(":checkbox[name=optionAll]:checked").length > 0) {
                        tblCont += "<th>DCRSubmitted</th>";
                        tblCont += "<th>Listed Doctor Met</th>";
                        tblCont += "<th>Unlisted Doctor Met</th>";
                        tblCont += "<th>Doctor Visits Summary</th>";
                        tblCont += "<th>Total Doctor Visits</th>";
                        tblCont += "<th>Doctor Missed</th>";
                        tblCont += "<th>Hospitals Visited</th>";
                        tblCont += "<th>RCPA done for how many Doctors</th>";
                        tblCont += "<th>Chemists Met</th>";
                        tblCont += "<th>Stockists Met</th>";
                        tblCont += "<th>Products given</th>";
                        tblCont += "<th>Expense Amount</th>";
                    }
                    else {
                        $('input:checkbox[name=otn]').each(function () {
                            if ($(this).is(':checked')) {
                                switch ($(this).val()) {
                                    case 'D':
                                        tblCont += "<th>DCRSubmitted</th>";
                                        break;
                                    case 'DR':
                                        tblCont += "<th>Listed Doctor Met</th>";
                                        tblCont += "<th>Unlisted Doctor Met</th>";
                                        tblCont += "<th>Doctor Visits Summary</th>";
                                        tblCont += "<th>Total Doctor Visits</th>";
                                        tblCont += "<th>Doctor Missed</th>";
                                        tblCont += "<th>Hospitals Visited</th>";
                                        tblCont += "<th>RCPA done for how many Doctors</th>";
                                        break;
                                    case 'C':
                                        tblCont += "<th>Chemists Met</th>";
                                        break;
                                    case 'S':
                                        tblCont += "<th>Stockists Met</th>";
                                        break;
                                    case 'P':
                                        tblCont += "<th>Products given</th>";
                                        break;
                                    case 'E':
                                        tblCont += "<th>Expense Amount</th>";
                                        break;
                                }
                            }
                        });
                    }
                    if ($(":checkbox[name=showWA]:checked").length > 0) {
                        tblCont += "<th>WideAngle DCR</th>";
                    }
                    tblCont += "</tr>";
                    tblCont += "<tr>";
                    tblCont += "<th><a href='#' onclick='fnDCRConsExpandAll()'>Show All</a></th>";
                    tblCont += "<th id='thuserName'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + "</th>";
                    tblCont += "<th id='thempName'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + "</th>";
                    tblCont += "<th >" + jDcrCons.Tables[0].Rows[0]["Employee_Number"] + "</th>";
                    tblCont += "<th >" + jDcrCons.Tables[0].Rows[0]["User_Type_Name"] + "</th>";
                    tblCont += "<th >" + jDcrCons.Tables[0].Rows[0]["Date_of_Joining"] + "</th>";
                    tblCont += "<th id='thRegionName'>" + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</th>";
                    tblCont += "<th>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + "</th>";
                    tblCont += "<th>" + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</th>";

                    // if all selected
                    if ($(":checkbox[name=optionAll]:checked").length > 0) {
                        if (jDcrCons.Tables[1].Rows[0]["DCR_Count"] > 0) {
                            tblCont += "<th><a  href='#' onclick='fnDCRConsDCRHeaderDetail()'>" + jDcrCons.Tables[1].Rows[0]["DCR_Count"] + "</a></th>";
                        }
                        else {
                            tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["DCR_Count"] + "</th>";
                        }

                        tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Listed_Doctor_Met"] + "</th>";
                        if (jDcrCons.Tables[1].Rows[0]["Unlisted_Doctor_Met"] > 0) {
                            tblCont += "<th><a href='#' onclick='fnDCRConsUnlistedDoctorMet()'>" + jDcrCons.Tables[1].Rows[0]["Unlisted_Doctor_Met"] + "</a></th>";
                        }
                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Unlisted_Doctor_Met"] + "</th>"; }

                        tblCont += "<th><a href='#' onclick='fnDCRConsDoctorVisitsSummaryPopup()'>View</a></th>"; // doctor visit summary

                        if (jDcrCons.Tables[1].Rows[0]["Doctor_Visited"] > 0) {
                            tblCont += "<th><a href='#' onclick='fnDCRConsDoctorVisit()'>" + jDcrCons.Tables[1].Rows[0]["Doctor_Visited"] + "</a></th>";
                        }
                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Doctor_Visited"] + "</th>"; }

                        if (jDcrCons.Tables[1].Rows[0]["Doctor_Missed"] > 0) {
                            tblCont += "<th><a href='#' onclick='fnDCRConsDoctorMissed()'>" + jDcrCons.Tables[1].Rows[0]["Doctor_Missed"] + "</a></th>";
                        }
                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Doctor_Missed"] + "</th>"; }

                        tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Hospital_Count"] + "</th>";

                        if (jDcrCons.Tables[1].Rows[0]["RCPA_Count"] > 0) {
                            tblCont += "<th><a href='#' onclick='fnDCRConsRCPADetails()'>" + jDcrCons.Tables[1].Rows[0]["RCPA_Count"] + "</a></th>";
                        }
                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["RCPA_Count"] + "</th>"; }


                        if (jDcrCons.Tables[1].Rows[0]["Chemist_Count"] > 0) {
                            tblCont += "<th><a href='#' onclick='fnDCRConsChemistDetail()'>" + jDcrCons.Tables[1].Rows[0]["Chemist_Count"] + "</a></th>";
                        }
                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Chemist_Count"] + "</th>"; }

                        if (jDcrCons.Tables[1].Rows[0]["Stockist_Count"]) {
                            tblCont += "<th><a href='#' onclick='fnDCRConsStockistDetail()'>" + jDcrCons.Tables[1].Rows[0]["Stockist_Count"] + "</a></th>";
                        }
                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Stockist_Count"] + "</th>"; }

                        if (jDcrCons.Tables[1].Rows[0]["Product_Count"]) {
                            tblCont += "<th><a href='#' onclick='fnDCRConsProductDetail()'>" + jDcrCons.Tables[1].Rows[0]["Product_Count"] + "</a></th>";
                        }
                        else {
                            tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Product_Count"] + "</th>";
                        }

                        if (jDcrCons.Tables[1].Rows[0]["Expense_Amount"] != null) {
                            tblCont += "<th><a href='#' onclick='fnDCRConsExpenseDetail()'>" + jDcrCons.Tables[1].Rows[0]["Expense_Amount"] + "</a></th>";
                        }
                        else { tblCont += "<th>-</th>"; }
                    }
                    else {
                        $('input:checkbox[name=otn]').each(function () {
                            if ($(this).is(':checked')) {
                                switch ($(this).val()) {
                                    case 'D':
                                        if (jDcrCons.Tables[1].Rows[0]["DCR_Count"] > 0) {
                                            tblCont += "<th><a href='#' onclick='fnDCRConsDCRHeaderDetail()'>" + jDcrCons.Tables[1].Rows[0]["DCR_Count"] + "</a></th>";
                                        }
                                        else {
                                            tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["DCR_Count"] + "</th>";
                                        }
                                        break;
                                    case 'DR':
                                        tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Listed_Doctor_Met"] + "</th>";
                                        if (jDcrCons.Tables[1].Rows[0]["Unlisted_Doctor_Met"] > 0) {
                                            tblCont += "<th><a href='#' onclick='fnDCRConsUnlistedDoctorMet()'>" + jDcrCons.Tables[1].Rows[0]["Unlisted_Doctor_Met"] + "</a></th>";
                                        }
                                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Unlisted_Doctor_Met"] + "</th>"; }

                                        tblCont += "<th><a href='#' onclick='fnDCRConsDoctorVisitsSummaryPopup()'>View</a></th>";  // doctor visit summary
                                        if (jDcrCons.Tables[1].Rows[0]["Doctor_Visited"] > 0) {
                                            tblCont += "<th><a href='#' onclick='fnDCRConsDoctorVisit()'>" + jDcrCons.Tables[1].Rows[0]["Doctor_Visited"] + "</a></th>";
                                        }
                                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Doctor_Visited"] + "</th>"; }

                                        if (jDcrCons.Tables[1].Rows[0]["Doctor_Missed"] > 0) {
                                            tblCont += "<th><a href='#' onclick='fnDCRConsDoctorMissed()'>" + jDcrCons.Tables[1].Rows[0]["Doctor_Missed"] + "</a></th>";
                                        }
                                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Doctor_Missed"] + "</th>"; }

                                        tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Hospital_Count"] + "</th>";

                                        if (jDcrCons.Tables[1].Rows[0]["RCPA_Count"] > 0) {
                                            tblCont += "<th><a href='#' onclick='fnDCRConsRCPADetails()'>" + jDcrCons.Tables[1].Rows[0]["RCPA_Count"] + "</a></th>";
                                        }
                                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["RCPA_Count"] + "</th>"; }

                                        break;
                                    case 'C':
                                        if (jDcrCons.Tables[1].Rows[0]["Chemist_Count"] > 0) {
                                            tblCont += "<th><a  href='#' onclick='fnDCRConsChemistDetail()'>" + jDcrCons.Tables[1].Rows[0]["Chemist_Count"] + "</a></th>";
                                        }
                                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Chemist_Count"] + "</th>"; }
                                        break;
                                    case 'S':
                                        if (jDcrCons.Tables[1].Rows[0]["Stockist_Count"]) {
                                            tblCont += "<th><a  href='#' onclick='fnDCRConsStockistDetail()'>" + jDcrCons.Tables[1].Rows[0]["Stockist_Count"] + "</a></th>";
                                        }
                                        else { tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Stockist_Count"] + "</th>"; }
                                        break;

                                    case 'P':
                                        if (jDcrCons.Tables[1].Rows[0]["Product_Count"]) {
                                            tblCont += "<th><a href='#' onclick='fnDCRConsProductDetail()'>" + jDcrCons.Tables[1].Rows[0]["Product_Count"] + "</a></th>";
                                        }
                                        else {
                                            tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["Product_Count"] + "</th>";
                                        }
                                        break;
                                    case 'E':
                                        if (jDcrCons.Tables[1].Rows[0]["Expense_Amount"] != null) {
                                            tblCont += "<th><a href='#' onclick='fnDCRConsExpenseDetail()'>" + jDcrCons.Tables[1].Rows[0]["Expense_Amount"] + "</a></th>";
                                        }
                                        else { tblCont += "<th>-</th>"; }
                                        break;
                                }
                            }
                        });
                    }

                    // wide angle data
                    if ($(":checkbox[name=showWA]:checked").length > 0) {
                        if (jDcrCons.Tables[1].Rows[0]["WA_DCRCount"] > 0) {
                            tblCont += "<th><a href='#' onclick='fnWADCRDetails()'>" + jDcrCons.Tables[1].Rows[0]["WA_DCRCount"] + "</a></th>";
                        }
                        else {
                            tblCont += "<th>" + jDcrCons.Tables[1].Rows[0]["WA_DCRCount"] + "</th>";
                        }
                    }
                    tblCont += "</tr></thead>";
                    tblCont += "</table></div>";
                    $("#divHeaderDetails").html(tblCont);
                    HideModalPopup("dvloading");
                    return;
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        HideModalPopup("dvloading");
    }
}

function fnValidateDCRConsRprt() {
    if ($.trim($("#txtFromDate").val()) == "") {
        fnMsgAlert('info', 'DCR Consolidate Report', 'Please enter Start date.');
        $("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    if ($.trim($("#txtToDate").val()) == "") {
        fnMsgAlert('info', 'DCR Consolidate Report', 'Please enter End date.');
        $("#txtToDate").focus();
        HideModalPopup("dvloading");
        return false;
    }

    var fromDate = $("#txtFromDate").val().split('/')[2] + '/' + $("#txtFromDate").val().split('/')[1] + '/' + $("#txtFromDate").val().split('/')[0];
    var toDate = $("#txtToDate").val().split('/')[2] + '/' + $("#txtToDate").val().split('/')[1] + '/' + $("#txtToDate").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (!(fnValidateDateFormate($("#txtFromDate"), "Start Date"))) {
        HideModalPopup("dvloading");
        return false;
    }
    if (!(fnValidateDateFormate($("#txtToDate"), "End Date"))) {
        HideModalPopup("dvloading");
        return false;
    }

    // start date end date check
    if (startDate > endDate) {
        fnMsgAlert('info', 'DCR Consolidate Report', 'End date can not be less than start date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":checkbox[name=dcrStatus]:checked").length == 0) {
        fnMsgAlert('info', 'DCR Consolidate Report', 'Please select DCR status.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":checkbox[name=optionAll]:checked").length == 0 && $(":checkbox[name=otn]:checked").length == 0) {
        fnMsgAlert('info', 'DCR Consolidate Report', 'Please select Option.');
        HideModalPopup("dvloading");
        return false;
    }

    return true;
}

// for dcr status
function fnChangeRadioDCR() {
    //uncheck all without draft
    $("input:checkbox[name=dcrStatusAllWOD]").removeAttr('checked');
    // uncheck all with draft
    $("input:checkbox[name=dcrStatusAllWD]").removeAttr('checked');

    if ($(":checkbox[name=dcrStatus]:checked").length > 0) {
        var dcrStatus = "";
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val(); }
        });
        if (dcrStatus == '210') {
            // check All without draft
            $("input:checkbox[name=dcrStatusAllWOD]").attr('checked', 'checked');
        }
        if (dcrStatus == '2103') {
            // check All with draft
            $("input:checkbox[name=dcrStatusAllWD]").attr('checked', 'checked');
        }
    }
}

function fnChangeCheckWithDraft() {
    if ($(":checkbox[name=dcrStatusAllWD]:checked").length > 0) {
        //uncheck all without draft
        $("input:checkbox[name=dcrStatusAllWOD]").removeAttr('checked');

        //Check All other status
        $('input:checkbox[name=dcrStatus]').each(function () {
            $(this).attr('checked', 'checked');
        });
        return;
    }
}

function fnChangeCheckWithoutDraft() {
    if ($(":checkbox[name=dcrStatusAllWOD]:checked").length > 0) {
        // uncheck all with draft
        $("input:checkbox[name=dcrStatusAllWD]").removeAttr('checked');

        // uncheck Draft and check Applied, Approved, Unappreved
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).val() == '3') {
                $(this).removeAttr('checked');
            }
            else {
                $(this).attr('checked', 'checked');
            }
        });
        return;
    }
}

// for options
function fnChangeRadioOptinon() {
    if ($(":checkbox[name=otn]:checked").length > 0) {
        $("input:checkbox[name=optionAll]").removeAttr('checked');
        return;
    }
}

function fnChangeCheckOptinon() {
    if ($(":checkbox[name=optionAll]:checked").length > 0) {
        $('input:checkbox[name=otn]').each(function () {
            $(this).removeAttr('checked');
        });
        return;
    }
}


function fnDCRConsStockistDetail() {
    if ($("#tblDCRReprtStockist").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }


        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsStockistDetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jstoc = eval('(' + response + ')');
                var tblCont = "";
                if (!(jstoc.Tables === undefined) && jstoc.Tables.length > 0 && jstoc.Tables[1].Rows.length > 0 && jstoc.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtStockist' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrStockiest'>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Stockist Name</th>";
                    tblCont += "<th>Visited Dates</th>";
                    tblCont += "<th>POB Amount</th>";
                    tblCont += "<th>Collection Amount</th>";
                    tblCont += "<th>Remarks</th>";
                    tblCont += "</tr>";

                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "date-range" }, { type: "number-range" }, { type: "number-range" }]';
                    tblCont += "<tr>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Stockist Name</th>";
                    tblCont += "<th>Visited Dates</th>";
                    tblCont += "<th>POB Amount</th>";

                    tblCont += "<th>Collection Amount</th>";
                    tblCont += "<th>Remarks</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '10' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaStockiest()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";

                    for (var k = 0; k < jstoc.Tables[1].Rows.length; k++) {
                        var stocJson = jsonPath(jstoc, "$.Tables[0].Rows[?(@.Stockiest_Code=='" + jstoc.Tables[1].Rows[k]["Stockiest_Code"] + "')]");
                        tblCont += "<tr>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                        tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                        tblCont += "<td>" + stocJson[0].Stockiest_Name + "</td>";
                        tblCont += "<td>";
                        for (var l = 0; l < stocJson.length; l++) {
                            tblCont += stocJson[l].DCR_Actual_Date + "<br />";
                            if (stocJson.length > 1 && (stocJson.length - 1) != l) {
                                tblCont += ",";
                            }
                        }
                        tblCont += "</td>";
                        tblCont += "<td>" + ((jstoc.Tables[1].Rows[k]["POB_Amount"] == null) ? "" : jstoc.Tables[1].Rows[k]["POB_Amount"]) + "</td>";
                        tblCont += "<td>" + ((jstoc.Tables[1].Rows[k]["Coll_Amount"] == null) ? "" : jstoc.Tables[1].Rows[k]["Coll_Amount"]) + "</td>";
                        //tblCont += "<td>" + (jstoc.Tables[1].Rows[k]["Remarks_By_User"]) + "</td>";
                        tblCont += "<td>";
                        for (var l = 0; l < stocJson.length; l++) {
                            tblCont += "(" + stocJson[l].DCR_Actual_Date + ")" + stocJson[l].Remarks_By_User + "<br />";
                            if (stocJson.length > 1 && (stocJson.length - 1) != l) {
                                tblCont += "~";
                            }
                        }
                        tblCont += "</td>";
                        tblCont += "</tr>";
                    }
                    tblCont += "</tbody></table>";

                    $("#dvStock").html(tblCont);
                    $("#divReport").show();
                    $("#dvStock").show();
                    $("#lstStock").show();

                    $("#divPrintStock ").html($("#dvStock ").html());

                    var jsonType = eval(type);
                    $('#tblDCRReprtStockist').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });


                    fninializePrint("divPrintStock", "ifrmPrintdvStock", "dvStock");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        //window.location.hash = '#dvStock';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    // window.location.hash = '#dvStock';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
        }
    }
}

function fnDCRConsChemistDetail() {

    if ($("#tblDCRReprtChemist").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }

        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsChemistDetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jchem = eval('(' + response + ')');
                var tblCont = "";
                if (!(jchem.Tables === undefined) && jchem.Tables.length > 0 && jchem.Tables[1].Rows.length > 0 && jchem.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtChemist' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrchemist'>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";

                    tblCont += "<th>Chemist Name</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>MDL/SVL No</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>In Campaign</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "<th>Visited Dates</th>";
                    tblCont += "<th>POB Amount</th>";
                    tblCont += "</tr>";

                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }';
                    type += ', { type: "text" }, { type: "date" }, { type: "number-range" }]';
                    tblCont += "<tr>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none' >Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Chemist Name</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>MDL/SVL No</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>In Campaign</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "<th>Visited Dates</th>";
                    tblCont += "<th>POB Amount</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '15' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeachemist()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";

                    var flexichemvJson = jsonPath(jchem, "$.Tables[0].Rows[?(@.Chemist_Code=='')]");
                    var rigidchemvJson = jsonPath(jchem, "$.Tables[1].Rows[?(@.Chemist_Code!='')]");

                    if (rigidchemvJson != false && rigidchemvJson !== undefined) {
                        for (var k = 0; k < rigidchemvJson.length; k++) {
                            var chemJson = jsonPath(jchem, "$.Tables[0].Rows[?(@.Chemist_Code=='" + rigidchemvJson[k]["Chemist_Code"] + "' && @.Doctor_Name=='" + rigidchemvJson[k]["Doctor_Name"] + "')]");
                            if (chemJson != false && chemJson !== undefined) {
                                tblCont += "<tr>";
                                tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                                tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                                tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                                tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                                tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                                tblCont += "<td>" + chemJson[0].Chemists_Name + "</td>";


                                //check for unlisted doctor
                                if (chemJson[0].MDL == null || chemJson[0].MDL == '') {
                                    tblCont += "<td>" + chemJson[0].Doctor_Name + "</td>";
                                    tblCont += "<td>Unlisted</td>";
                                    tblCont += "<td>Unlisted</td>";
                                }
                                else {
                                    tblCont += "<td><span onclick='fnDoctor360Popup(\"" + chemJson[0].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + chemJson[0].Doctor_Name + "</span></td>";
                                    tblCont += "<td>" + chemJson[0].MDL + "</td>";
                                    tblCont += "<td>" + ((chemJson[0].Category_Name == null) ? "" : chemJson[0].Category_Name) + "</td>";
                                }
                                tblCont += "<td>" + ((chemJson[0].Speciality_Name == null) ? "" : chemJson[0].Speciality_Name) + "</td>";
                                tblCont += "<td>" + chemJson[0].Is_Campaign + "</td>";
                                tblCont += "<td>" + ((chemJson[0].Hospital_Name == null) ? "" : chemJson[0].Hospital_Name) + "</td>";
                                tblCont += "<td>" + ((chemJson[0].Hospital_Classification == null) ? "" : chemJson[0].Hospital_Classification) + "</td>";
                                tblCont += "<td>";
                                var pobAmount = 0;
                                for (var l = 0; l < chemJson.length; l++) {
                                    tblCont += chemJson[l].DCR_Actual_Date + "<br />";
                                    if (chemJson.length > 1 && (chemJson.length - 1) != l) {
                                        tblCont += ",";
                                    }
                                    pobAmount += parseFloat(chemJson[l].PO_Amount);
                                }
                                tblCont += "</td>";
                                tblCont += "<td>" + pobAmount.toFixed(2) + "</td>";
                                tblCont += "</tr>";
                            }
                        }
                    }

                    if (flexichemvJson != false && flexichemvJson !== undefined) {
                        for (var k = 0; k < flexichemvJson.length; k++) {
                            tblCont += "<tr>";
                            tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                            tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                            tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                            tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                            tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                            tblCont += "<td>" + flexichemvJson[k].Chemists_Name + "</td>";

                            tblCont += "<td>" + flexichemvJson[k].Doctor_Name + "</td>";
                            //check for unlisted doctor
                            if (flexichemvJson[k].MDL == null || flexichemvJson[k].MDL == '') {
                                tblCont += "<td>Unlisted</td>";
                                tblCont += "<td>Unlisted</td>";
                            }
                            else {
                                tblCont += "<td>" + flexichemvJson[k].MDL + "</td>";
                                tblCont += "<td>" + ((flexichemvJson[k].Category_Name == null) ? "" : flexichemvJson[k].Category_Name) + "</td>";
                            }
                            tblCont += "<td>" + ((flexichemvJson[k].Speciality_Name == null) ? "" : flexichemvJson[k].Speciality_Name) + "</td>";
                            tblCont += "<td>" + flexichemvJson[k].Is_Campaign + "</td>";
                            tblCont += "<td>" + ((flexichemvJson[k].Hospital_Name == null) ? "" : flexichemvJson[k].Hospital_Name) + "</td>";
                            tblCont += "<td>" + ((flexichemvJson[k].Hospital_Classification == null) ? "" : flexichemvJson[k].Hospital_Classification) + "</td>";
                            tblCont += "<td>" + flexichemvJson[k].DCR_Actual_Date + "</td>";
                            tblCont += "<td>" + ((flexichemvJson[k].PO_Amount == null) ? "0.00" : flexichemvJson[k].PO_Amount) + "</td>";
                            tblCont += "</tr>";
                        }
                    }

                    tblCont += "</tbody></table>";

                    $("#dvChem").html(tblCont);
                    $("#divReport").show();
                    $("#dvChem").show();
                    $("#lstChem").show();

                    $("#divPrintChem ").html($("#dvChem ").html());

                    var jsonType = eval(type);
                    $('#tblDCRReprtChemist').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });


                    fninializePrint("divPrintChem", "ifrmPrintdvChem", "dvChem");

                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        // window.location.hash = '#dvChem';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    //window.location.hash = '#dvChem';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
        }
    }
}

function fnDCRConsProductDetail() {

    if ($("#tblDCRReprtProduct").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }

        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsProductDetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jchem = eval('(' + response + ')');
                var tblCont = "";
                if (!(jchem.Tables === undefined) && jchem.Tables.length > 0 && jchem.Tables[1].Rows.length > 0 && jchem.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtProduct' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrProduct'>";
                    tblCont += "<th >User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Product Name</th>";
                    tblCont += "<th>Brand Name</th>";
                    tblCont += "<th>Qty</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>MDL/SVL No</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>Mapped</th>";
                    tblCont += "<th>In Campaign</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "<th>Visited Dates</th>";
                    tblCont += "<th>Yield</th>";
                    tblCont += "<th>Potential</th>";
                    tblCont += "</tr>";

                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" },{ type: "text" }, { type: "number-range" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }';
                    type += ', { type: "text" }, { type: "text" }, { type: "date-range" }, { type: "number-range" }, { type: "number-range" }]';
                    tblCont += "<tr>";
                    tblCont += "<th >User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Product Name</th>";
                    tblCont += "<th>Brand Name</th>";
                    tblCont += "<th>Qty</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>MDL/SVL No</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>Mapped</th>";
                    tblCont += "<th>In Campaign</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "<th>Visited Dates</th>";
                    tblCont += "<th>Yield</th>";
                    tblCont += "<th>Potential</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '19' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaProduct()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";

                    for (var k = 0; k < jchem.Tables[1].Rows.length; k++) {
                        var proJson = jsonPath(jchem, "$.Tables[0].Rows[?(@.Product_Code=='" + jchem.Tables[1].Rows[k]["Product_Code"] + "' && @.Doctor_Name=='" + jchem.Tables[1].Rows[k]["Doctor_Name"] + "')]");
                        if (proJson != false && proJson !== undefined) {
                            tblCont += "<tr>";
                            tblCont += "<td>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                            tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                            tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                            tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                            tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                            tblCont += "<td>" + proJson[0].Product_Name + "</td>";
                            tblCont += "<td>" + ((proJson[0].Brand_Name == null) ? "" : proJson[0].Brand_Name) + "</td>";
                            tblCont += "<td>" + ((proJson[0].Quantity_Provided == null) ? "" : proJson[0].Quantity_Provided) + "</td>";


                            //check for unlisted doctor
                            if (proJson[0].MDL == null || proJson[0].MDL == '') {
                                tblCont += "<td>" + proJson[0].Doctor_Name + "</td>";
                                tblCont += "<td>Unlisted</td>";
                                tblCont += "<td>Unlisted</td>";
                            }
                            else {
                                tblCont += "<td><span onclick='fnDoctor360Popup(\"" + proJson[0].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + proJson[0].Doctor_Name + "</span></td>";
                                tblCont += "<td>" + proJson[0].MDL + "</td>";
                                tblCont += "<td>" + ((proJson[0].Category_Name == null) ? "" : proJson[0].Category_Name) + "</td>";
                            }
                            tblCont += "<td>" + ((proJson[0].Speciality_Name == null) ? "" : proJson[0].Speciality_Name) + "</td>";
                            tblCont += "<td>" + proJson[0].Is_Mapped + "</td>";
                            tblCont += "<td>" + proJson[0].Is_Campaign + "</td>";
                            tblCont += "<td>" + ((proJson[0].Hospital_Name == null) ? "" : proJson[0].Hospital_Name) + "</td>";
                            tblCont += "<td>" + ((proJson[0].Hospital_Classification == null) ? "" : proJson[0].Hospital_Classification) + "</td>";
                            tblCont += "<td>";
                            for (var l = 0; l < proJson.length; l++) {
                                tblCont += proJson[l].DCR_Actual_Date + "<br />";
                                if (proJson.length > 1 && (proJson.length - 1) != l) {
                                    tblCont += ",";
                                }
                            }
                            tblCont += "</td>";
                            tblCont += "<td>" + ((proJson[0].Support_Quantity == null) ? "" : proJson[0].Support_Quantity) + "</td>";
                            tblCont += "<td>" + ((proJson[0].Potential_Quantity == null) ? "" : proJson[0].Potential_Quantity) + "</td>";
                            tblCont += "</tr>";
                        }
                    }
                    tblCont += "</tbody></table>";

                    $("#dvProd").html(tblCont);
                    $("#divReport").show();
                    $("#dvProd").show();
                    $("#lstProd").show();
                    $("#divPrintProd ").html($("#dvProd ").html());

                    var jsonType = eval(type);
                    $('#tblDCRReprtProduct').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });


                    fninializePrint("divPrintProd", "ifrmPrintdvProd", "dvProd");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        //window.location.hash = '#dvProd';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    //window.location.hash = '#dvProd';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
        }
        //else { window.location.hash = '#dvProd'; }
    }
}

function fnDCRConsDCRHeaderDetail() {
    if ($("#tblDCRReprtHeaderDetail").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }

        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsDCRHeaderDetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jdcr = eval('(' + response + ')');
                var tblCont = "";
                if (!(jdcr.Tables === undefined) && jdcr.Tables.length > 0 && jdcr.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtHeaderDetail' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTr'>";
                    tblCont += "<th >DCR Date</th>";
                    tblCont += "<th >Entered Date</th>";
                    tblCont += "<th >DCR Type</th>";
                    tblCont += "<th >Status</th>";
                    tblCont += "<th >CP</th>";
                    tblCont += "<th >Category</th>";
                    tblCont += "<th >Work Place</th>";
                    tblCont += "<th >From-To(Distance,Mode)</th>";
                    tblCont += "<th >Start-End time</th>";
                    tblCont += "<th ></th>";
                    tblCont += "<th ></th>";
                    tblCont += "<th ></th>";
                    tblCont += "<th ></th>";
                    tblCont += "<th ></th>";
                    tblCont += "<th ></th>";
                    tblCont += "<th ></th>";
                    tblCont += "<th ></th>";
                    tblCont += "<th >DCR Common Remarks</th>";
                    tblCont += "<th >Approve/Unapprove Remarks</th>";
                    tblCont += "<th >Approved By</th>";
                    tblCont += "<th >Approved Date</th>";
                    tblCont += "</tr>";

                    var type = '[{ type: "date" }, { type: "date" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "text" }';
                    type += ', { type: "text" }, null, { type: "text" }, null, { type: "text" }, null, { type: "text" },{ type: "text" } ,null, { type: "text" }, { type: "date" }]';
                    tblCont += "<tr>";
                    tblCont += "<th rowspan='2'>DCR Date</th>";
                    tblCont += "<th rowspan='2'>Entered Date</th>";
                    tblCont += "<th rowspan='2'>DCR Type</th>";
                    tblCont += "<th rowspan='2'>Status</th>";
                    tblCont += "<th rowspan='2'>CP</th>";
                    tblCont += "<th rowspan='2'>Category</th>";
                    tblCont += "<th rowspan='2'>Work Place</th>";
                    tblCont += "<th rowspan='2'>From-To(Distance,Mode)</th>";
                    tblCont += "<th rowspan='2'>Start-End time</th>";
                    tblCont += "<th colspan='2'>Accompanist 1</th>";
                    tblCont += "<th colspan='2'>Accompanist 2</th>";
                    tblCont += "<th colspan='2'>Accompanist 3</th>";
                    tblCont += "<th colspan='2'>Accompanist 4</th>";
                    tblCont += "<th rowspan='2'>DCR Common Remarks</th>";
                    tblCont += "<th rowspan='2'>Approve/Unapprove Remarks</th>";
                    tblCont += "<th rowspan='2'>Approved By</th>";
                    tblCont += "<th rowspan='2'>Approved Date</th>";
                    tblCont += "</tr>";
                    tblCont += "<tr>";
                    tblCont += "<th>Name</th>";
                    tblCont += "<th>Time</th>";
                    tblCont += "<th>Name</th>";
                    tblCont += "<th>Time</th>";
                    tblCont += "<th>Name</th>";
                    tblCont += "<th>Time</th>";
                    tblCont += "<th>Name</th>";
                    tblCont += "<th>Time</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '25' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";

                    for (var k = 0; k < jdcr.Tables[0].Rows.length; k++) {
                        tblCont += "<tr>";
                        tblCont += "<td id='DCRDate_" + k + "'>" + jdcr.Tables[0].Rows[k]["DCR_Actual_Date"] + "</td>";
                        tblCont += "<td id='DCREnterDate_" + k + "'>" + jdcr.Tables[0].Rows[k]["Entered_Date"] + "</td>";

                        if (jdcr.Tables[0].Rows[k]["DCR_Type"] == "Leave") {
                            var ljson = jsonPath(jdcr, "$.Tables[3].Rows[?(@.DCR_Code=='" + jdcr.Tables[0].Rows[k]["DCR_Code"] + "')]");
                            if (ljson != false) {
                                tblCont += "<td id='DCRType_" + k + "'>" + jdcr.Tables[0].Rows[k]["DCR_Type"] + "(" + ljson[0].Leave_Type_Name + ")</td>";
                            }
                            else {
                                tblCont += "<td id='DCRType_" + k + "'>" + jdcr.Tables[0].Rows[k]["DCR_Type"] + "</td>";
                            }
                        }
                        else if (jdcr.Tables[0].Rows[k]["DCR_Type"] == "Attendance") {
                            var ljson = jsonPath(jdcr, "$.Tables[2].Rows[?(@.DCR_Code=='" + jdcr.Tables[0].Rows[k]["DCR_Code"] + "')]");
                            if (ljson != false) {
                                tblCont += "<td id='DCRType_" + k + "'>" + jdcr.Tables[0].Rows[k]["DCR_Type"] + "(" + ljson[0].Activity_Name + ")</td>";
                            }
                            else {
                                tblCont += "<td id='DCRType_" + k + "'>" + jdcr.Tables[0].Rows[k]["DCR_Type"] + "</td>";
                            }
                        }
                        else {
                            tblCont += "<td id='DCRType_" + k + "'>" + jdcr.Tables[0].Rows[k]["DCR_Type"] + "</td>";
                        }
                        tblCont += "<td id='DCRStatus_" + k + "'>" + jdcr.Tables[0].Rows[k]["DCR_Status"] + "</td>";
                        //for Leave
                        if (jdcr.Tables[0].Rows[k]["DCR_Type"] == "Leave") {
                            for (var u = 0; u < 13; u++) {
                                if (u == 0) { tblCont += "<td style='background-color: #d3d3d3;'>N/A</td>"; }
                                else { tblCont += "<td style='background-color: #d3d3d3;'></td>"; }
                            }
                        }

                            //for Attendance and field
                        else {
                            tblCont += "<td>" + ((jdcr.Tables[0].Rows[k]["CP_Name"] == null) || (jdcr.Tables[0].Rows[k]["CP_Name"] == "null") ? "" : jdcr.Tables[0].Rows[k]["CP_Name"]) + "</td>";
                            tblCont += "<td>" + jdcr.Tables[0].Rows[k]["Category"] + "</td>";
                            tblCont += "<td id='DCRWorkPlace_" + k + "'>" + jdcr.Tables[0].Rows[k]["Place_Worked"] + "</td>";

                            // for HQ
                            if (jdcr.Tables[0].Rows[k]["Category"] == "HQ") {
                                if (jdcr.Tables[0].Rows[k]["From_Place"] != null) {
                                    tblCont += "<td id='DCRTravelPlace_" + k + "'>" + jdcr.Tables[0].Rows[k]["From_Place"] + "-" + jdcr.Tables[0].Rows[k]["To_Place"] + "(" + jdcr.Tables[0].Rows[k]["Travelled_Kms"] + "," + jdcr.Tables[0].Rows[k]["Travel_Mode"] + ")</td>";
                                }
                                else {
                                    tblCont += "<td></td>";
                                }
                            }

                                // for other than HQ
                            else {
                                if (jdcr.Tables[0].Rows[k]["From_Place"] != null && jdcr.Tables[0].Rows[k]["Distance_Fare_Code"] != null && jdcr.Tables[0].Rows[k]["From_Place"] != '') {
                                    tblCont += "<td id='DCRTravelPlace_" + k + "'>" + jdcr.Tables[0].Rows[k]["From_Place"] + "-" + jdcr.Tables[0].Rows[k]["To_Place"] + "(" + jdcr.Tables[0].Rows[k]["Travelled_Kms"] + "," + jdcr.Tables[0].Rows[k]["Travel_Mode"] + ")</td>";
                                }
                                else {
                                    var rdJson = jsonPath(jdcr, "$.Tables[1].Rows[?(@.DCR_Code=='" + jdcr.Tables[0].Rows[k]["DCR_Code"] + "' & @.DCR_HOP_Flag=='" + jdcr.Tables[0].Rows[k]["Flag"] + "')]");
                                    if (rdJson != false) {
                                        tblCont += "<td id='DCRTravelPlace_" + k + "'>";
                                        for (var g = 0; g < rdJson.length; g++) {
                                            if (rdJson[g].Route_Way != "R") {
                                                tblCont += rdJson[g].From_Place + "-" + rdJson[g].To_Place + "(" + rdJson[g].Distance + "," + rdJson[g].Travel_Mode + ")</br>";
                                            }
                                            else {
                                                tblCont += rdJson[g].To_Place + "-" + rdJson[g].From_Place + "(" + rdJson[g].Distance + "," + rdJson[g].Travel_Mode + ")</br>";
                                            }
                                        }
                                        tblCont += "</td>";
                                    }
                                    else {
                                        tblCont += "<td id='DCRTravelPlace_" + k + "' ></td>";
                                    }
                                }
                            }
                            tblCont += "<td>" + ((jdcr.Tables[0].Rows[k]["User_Start_Time"] == null) ? "" : jdcr.Tables[0].Rows[k]["User_Start_Time"]) + "-" + ((jdcr.Tables[0].Rows[k]["User_End_Time"] == null) ? "" : jdcr.Tables[0].Rows[k]["User_End_Time"]) + "</td>";

                            //for Attendance
                            if (jdcr.Tables[0].Rows[k]["DCR_Type"] == "Attendance") {
                                for (var u = 0; u < 8; u++) {
                                    if (u == 0) { tblCont += "<td style='background-color: #d3d3d3;'>N/A</td>"; }
                                    else { tblCont += "<td style='background-color: #d3d3d3;'></td>"; }
                                }
                            }
                                //for Field
                            else {
                                var acc1Time = ((jdcr.Tables[0].Rows[k]["Accomp_Start_Time"] == null) ? "" : jdcr.Tables[0].Rows[k]["Accomp_Start_Time"] + "-" + jdcr.Tables[0].Rows[k]["Accomp_End_Time"]);
                                var acc2Time = ((jdcr.Tables[0].Rows[k]["Acc2_Start_Time"] == null) ? "" : jdcr.Tables[0].Rows[k]["Acc2_Start_Time"] + "-" + jdcr.Tables[0].Rows[k]["Acc2_End_Time"]);
                                var acc3Time = ((jdcr.Tables[0].Rows[k]["Acc3_Time"] == null) ? "" : jdcr.Tables[0].Rows[k]["Acc3_Time"]);
                                var acc4Time = ((jdcr.Tables[0].Rows[k]["Acc4_Time"] == null) ? "" : jdcr.Tables[0].Rows[k]["Acc4_Time"]);

                                tblCont += "<td class='td-a' onclick='fnShowDoctors(\"" + jdcr.Tables[0].Rows[k]["Acc1_Name"] + "\",\"" + jdcr.Tables[0].Rows[k]["DCR_Actual_Date"] + "\",\"" + k + "\",\"" + jdcr.Tables[0].Rows[k]["Ref_Key1"] + "\",\"" + acc1Time + "\")'>" + ((jdcr.Tables[0].Rows[k]["Acc1_Name"] == null) ? "" : jdcr.Tables[0].Rows[k]["Acc1_Name"]) + "</td>";
                                tblCont += "<td>" + acc1Time + "</td>";
                                tblCont += "<td class='td-a' onclick='fnShowDoctors(\"" + jdcr.Tables[0].Rows[k]["Acc2_Name"] + "\",\"" + jdcr.Tables[0].Rows[k]["DCR_Actual_Date"] + "\",\"" + k + "\",\"" + jdcr.Tables[0].Rows[k]["Ref_Key1"] + "\",\"" + acc2Time + "\")'>" + ((jdcr.Tables[0].Rows[k]["Acc2_Name"] == null) ? "" : jdcr.Tables[0].Rows[k]["Acc2_Name"]) + "</td>";
                                tblCont += "<td>" + acc2Time + "</td>";
                                tblCont += "<td class='td-a' onclick='fnShowDoctors(\"" + jdcr.Tables[0].Rows[k]["Acc3_Person"] + "\",\"" + jdcr.Tables[0].Rows[k]["DCR_Actual_Date"] + "\",\"" + k + "\",\"" + jdcr.Tables[0].Rows[k]["Ref_Key1"] + "\",\"" + acc3Time + "\")'>" + ((jdcr.Tables[0].Rows[k]["Acc3_Person"] == null) ? "" : jdcr.Tables[0].Rows[k]["Acc3_Person"]) + "</td>";
                                tblCont += "<td>" + acc3Time + "</td>";
                                tblCont += "<td class='td-a' onclick='fnShowDoctors(\"" + jdcr.Tables[0].Rows[k]["Acc4_Person"] + "\",\"" + jdcr.Tables[0].Rows[k]["DCR_Actual_Date"] + "\",\"" + k + "\",\"" + jdcr.Tables[0].Rows[k]["Ref_Key1"] + "\",\"" + acc4Time + "\")'>" + ((jdcr.Tables[0].Rows[k]["Acc4_Person"] == null) ? "" : jdcr.Tables[0].Rows[k]["Acc4_Person"]) + "</td>";
                                tblCont += "<td>" + acc4Time + "</td>";
                            }
                        }

                        //ReMARKS
                        var DcrcommonRemarks = "";
                        if (jdcr.Tables[0].Rows[k]["DCR_General_Remarks"] == null || jdcr.Tables[0].Rows[k]["DCR_General_Remarks"] == "" || jdcr.Tables[0].Rows[k]["DCR_General_Remarks"] == "^" || jdcr.Tables[0].Rows[k]["DCR_General_Remarks"] == "^^" || jdcr.Tables[0].Rows[k]["DCR_General_Remarks"] == "^^^") {
                            var DcrcommonRemarks = ""

                        }
                        else {

                            DcrcommonRemarks = jdcr.Tables[0].Rows[k]["DCR_General_Remarks"]
                            DcrcommonRemarks = DcrcommonRemarks.replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
                            DcrcommonRemarks = DcrcommonRemarks.replace("^", "<br />");//.replace(/\^/g, '<br />');
                            DcrcommonRemarks = DcrcommonRemarks.replace("~", " - ");//.replace(/~/g, ' - ');
                            DcrcommonRemarks = DcrcommonRemarks.replace(/\^/g, '<br />');
                        }


                        tblCont += "<td>" + DcrcommonRemarks + "</td>";
                        //REMARKS
                        if (jdcr.Tables[0].Rows[k]["Unapproval_Reason"] == null || jdcr.Tables[0].Rows[k]["Unapproval_Reason"] == "" || jdcr.Tables[0].Rows[k]["Unapproval_Reason"] == "^" || jdcr.Tables[0].Rows[k]["Unapproval_Reason"] == "^^" || jdcr.Tables[0].Rows[k]["Unapproval_Reason"] == "^^^") {
                            tblCont += "<td >N/A</td>";
                        }
                        else {
                            tblCont += "<td class='td-a' onclick='fnShowApprovalUnapprovalRemarks(\"" + jdcr.Tables[0].Rows[k]["Unapproval_Reason"] + "\")'>View</td>";
                        }
                        tblCont += "<td>" + ((jdcr.Tables[0].Rows[k]["Approved_By"] == null) ? "" : jdcr.Tables[0].Rows[k]["Approved_By"]) + "</td>";
                        tblCont += "<td>" + ((jdcr.Tables[0].Rows[k]["Approved_Date"] == null) ? "" : jdcr.Tables[0].Rows[k]["Approved_Date"]) + "</td>";
                        tblCont += "</tr>";
                    }
                    tblCont += "</tbody></table>";

                    $("#dvDCRHead").html(tblCont);
                    $("#divReport").show();
                    $("#dvDCRHead").show();
                    $("#lstDCRHead").show();
                    $("#divPrintDCRHead").html($("#dvDCRHead").html());

                    var jsonType = eval(type);
                    $('#tblDCRReprtHeaderDetail').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "bSort": false, "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                    //$('#dvPrint').remove();


                    fninializePrint("divPrintDCRHead", "ifrmPrintdvDCRHead", "dvDCRHead");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        // window.location.hash = '#dvDCRHead';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    // window.location.hash = '#dvDCRHead';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
        }
        //else { window.location.hash = '#dvDCRHead'; }
    }
}

function fnDCRConsDoctorVisit() {

    if ($("#tblDCRReprtDoctorVisit").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }


        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsDCRDoctorVisitDetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jdocv = eval('(' + response + ')');
                var tblCont = "";
                if (!(jdocv.Tables === undefined) && jdocv.Tables.length > 0 && jdocv.Tables[1].Rows.length > 0 && jdocv.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtDoctorVisit' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrpopup'>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>MDL/SVL No</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>Campaign Name</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "<th>Visited Dates</th>";
                    tblCont += "<th>Visit Count</th>";
                    tblCont += "<th>Detailed Product List</th>";
                    tblCont += "<th>Doctor POB</th>";
                    tblCont += "<th style='display:none;'>Remarks</th>";
                    tblCont += "<th>Remarks</th>";
                    tblCont += "</tr>";
                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }';
                    type += ', { type: "text" }, { type: "date" }, { type: "number-range" },{ type: "text" }, { type: "number-range" },null, { type: "text" }]';
                    tblCont += "<tr>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>MDL/SVL No</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>Campaign Name</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "<th>Visited Dates</th>";
                    tblCont += "<th>Visit Count</th>";
                    tblCont += "<th>Detailed Product List</th>";
                    tblCont += "<th>Doctor POB</th>";
                    tblCont += "<th style='display:none;'>Remarks</th>";
                    tblCont += "<th>Remarks</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '18' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapopup()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";
                    var id = 1;

                    var flexidocvJson = jsonPath(jdocv, "$.Tables[1].Rows[?(@.Doctor_Code=='')]");
                    var rigiddocvJson = jsonPath(jdocv, "$.Tables[1].Rows[?(@.Doctor_Code!='')]");
                    debugger;
                    if (rigiddocvJson != false && rigiddocvJson !== undefined) {
                        for (var k = 0; k < rigiddocvJson.length; k++) {
                            var docvJson = jsonPath(jdocv, "$.Tables[0].Rows[?(@.Doctor_Code=='" + rigiddocvJson[k]["Doctor_Code"] + "')]");
                            if (docvJson != false && docvJson !== undefined) {
                                tblCont += "<tr>";
                                tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                                tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                                tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                                tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                                tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                                tblCont += "<td><span id='vdocname_" + k + "' onclick='fnDoctor360Popup(\"" + docvJson[0].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + rigiddocvJson[k]["Doctor_Name"] + "</span></td>";
                                tblCont += "<td id='vdocmdl_" + k + "'>" + ((docvJson[0].MDL == null) ? "" : docvJson[0].MDL) + "</td>";
                                tblCont += "<td id='vdoccat_" + k + "'>" + ((docvJson[0].Category_Name == null) ? "" : docvJson[0].Category_Name) + "</td>";
                                tblCont += "<td id='vdocspec_" + k + "'>" + ((docvJson[0].Speciality_Name == null) ? "" : docvJson[0].Speciality_Name) + "</td>";
                                tblCont += "<td>" + ((docvJson[0].Campaign_Name == null) ? "-" : docvJson[0].Campaign_Name) + "</td>";
                                tblCont += "<td>" + ((docvJson[0].Hospital_Name == null) ? "" : docvJson[0].Hospital_Name) + "</td>";
                                tblCont += "<td>" + ((docvJson[0].Hospital_Classification == null) ? "" : docvJson[0].Hospital_Classification) + "</td>";
                                tblCont += "<td id='vdocDates_" + k + "'>";
                                for (var l = 0; l < docvJson.length; l++) {
                                    if (docvJson[l].Acc_Visit_Count == '0') {
                                        tblCont += docvJson[l].DCR_Actual_Date + "<br />";
                                    }
                                    else {
                                        tblCont += "<div style='display:none;' id='divDocAccDetails_" + id + "' value='" + docvJson[l].DCR_Date + "$" + docvJson[l].DCR_Visit_Code + "$" + docvJson[l].MDL + "$" + docvJson[l].Doctor_Name + "$" + docvJson[l].Category_Name + "'></div><a href='#' onclick='fnGetDoctorAccompanist(\"" + id + "\");'>" + docvJson[l].DCR_Actual_Date + "</a> ,";

                                    }
                                    if (docvJson.length > 1 && (docvJson.length - 1) != l) {
                                        tblCont += ",";
                                    }
                                }
                                id++;
                                tblCont += "</td>";
                                tblCont += "<td>" + docvJson.length + "</td>";
                                tblCont += "<td class='td-a' onclick='fnShowDetailedProducts(\"" + k + "\",\"" + docvJson[0].Doctor_Code + "\")'>View</td>"; // Detailed Product List view
                                tblCont += "<td>" + ((rigiddocvJson[k]["POB"] == null) ? "-" : rigiddocvJson[k]["POB"]) + "</td>";

                                //Remarks
                                var remarks = "", dcrCodes = "", visitcodes = "";
                                for (var l = 0; l < docvJson.length; l++) {
                                    if (docvJson[l].Remarks_By_User != "" && docvJson[l].Remarks_By_User != null) {
                                        remarks += docvJson[l].Remarks_By_User + ',';
                                    }
                                    dcrCodes += docvJson[l].DCR_Code + '^';
                                    visitcodes += docvJson[l].DCR_Visit_Code + '^';
                                }
                                remarks = remarks.slice(0, -1);
                                tblCont += "<td style='display:none;'>" + remarks + "</td>";
                                tblCont += "<td class='td-a' onclick='fnShowDoctorVisitRemarks(\"" + dcrCodes + "_" + visitcodes + "\")'>View</td>";
                                tblCont += "</tr>";
                            }
                        }
                    }

                    if (flexidocvJson != false && flexidocvJson !== undefined) {
                        for (var k = 0; k < flexidocvJson.length; k++) {
                            tblCont += "<tr>";
                            tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                            tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                            tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                            tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                            tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                            tblCont += "<td><span id='vdocname_" + k + "'>" + flexidocvJson[k]["Doctor_Name"] + "</span></td>";
                            tblCont += "<td>Unlisted</td>";
                            tblCont += "<td>Unlisted</td>";
                            tblCont += "<td id='vdocspec_" + k + "'>" + flexidocvJson[k]["Doctor_Region_Code"] + "</td>"; // for flexi doctors speciality name cums in 'Doctor_Region_Code' column
                            tblCont += "<td></td>";
                            tblCont += "<td></td>";
                            tblCont += "<td></td>";
                            tblCont += "<td>" + flexidocvJson[k]["DCR_Actual_Date"] + "</td>";
                            tblCont += "<td>" + flexidocvJson[k]["Count"] + "</td>";
                            tblCont += "<td class='td-a' onclick='fnShowDetailedProducts(\"" + k + "\",\"" + flexidocvJson[k].Doctor_Code + "\")'>View</td>"; // Detailed Product List view
                            tblCont += "<td>" + ((flexidocvJson[k]["POB"] == null) ? "-" : flexidocvJson[k]["POB"]) + "</td>";
                            tblCont += "<td style='display:none;'>" + ((flexidocvJson[k]["Remarks_By_User"] == null) ? " " : flexidocvJson[k]["Remarks_By_User"]) + "</td>";
                            tblCont += "<td class='td-a' onclick='fnShowDoctorVisitRemarks(\"" + flexidocvJson[k]["DCR_Code"] + "^_" + flexidocvJson[k]["DCR_Visit_Code"] + "^" + "\")'>View</td>";
                            tblCont += "</tr>";
                        }
                    }
                    tblCont += "</tbody></table><div id='dvDocVisitExcel' style='display:none;'></div>";

                    $("#dvDocVisit").html(tblCont);


                    // Only for Excel 
                    var tblExcelCont = "";
                    tblExcelCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtDoctorVisitExcel'  width='100%'>";
                    tblExcelCont += "<thead>";
                    tblExcelCont += "<tr>";
                    tblExcelCont += "<th style='display:none'>User Name</th>";
                    tblExcelCont += "<th style='display:none'>Employee Name</th>";
                    tblExcelCont += "<th style='display:none'>Region Name</th>";
                    tblExcelCont += "<th style='display:none'>Division Name</th>";
                    tblExcelCont += "<th style='display:none'>Reporting Region</th>";
                    tblExcelCont += "<th>Doctor Name</th>";
                    tblExcelCont += "<th>MDL/SVL No</th>";
                    tblExcelCont += "<th>Category</th>";
                    tblExcelCont += "<th>Speciality</th>";
                    tblExcelCont += "<th>Campaign Name</th>";
                    tblExcelCont += "<th>Hospital Name</th>";
                    tblExcelCont += "<th>Hospital Classification</th>";
                    tblExcelCont += "<th>Visited Dates</th>";
                    tblExcelCont += "<th>Visit Count</th>";
                    tblExcelCont += "<th>Detailed Product List</th>";
                    tblExcelCont += "<th>Doctor POB</th>";
                    tblExcelCont += "<th style='display:none;'>Remarks</th>";
                    tblExcelCont += "<th>Remarks</th>";
                    tblExcelCont += "</tr>";
                    tblExcelCont += "</thead><tbody>";
                    if (rigiddocvJson != false && rigiddocvJson !== undefined) {
                        for (var k = 0; k < rigiddocvJson.length; k++) {
                            var docvJson = jsonPath(jdocv, "$.Tables[0].Rows[?(@.Doctor_Code=='" + rigiddocvJson[k]["Doctor_Code"] + "')]");
                            if (docvJson != false && docvJson !== undefined) {
                                tblExcelCont += "<tr>";
                                tblExcelCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                                tblExcelCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                                tblExcelCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                                tblExcelCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                                tblExcelCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                                tblExcelCont += "<td><span id='vdocname_" + k + "' onclick='fnDoctor360Popup(\"" + docvJson[0].Doctor_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + rigiddocvJson[k]["Doctor_Name"] + "</span></td>";
                                tblExcelCont += "<td id='vdocmdl_" + k + "'>" + ((docvJson[0].MDL == null) ? "" : docvJson[0].MDL) + "</td>";
                                tblExcelCont += "<td id='vdoccat_" + k + "'>" + ((docvJson[0].Category_Name == null) ? "" : docvJson[0].Category_Name) + "</td>";
                                tblExcelCont += "<td id='vdocspec_" + k + "'>" + ((docvJson[0].Speciality_Name == null) ? "" : docvJson[0].Speciality_Name) + "</td>";
                                tblExcelCont += "<td>" + ((docvJson[0].Campaign_Name == null) ? "-" : docvJson[0].Campaign_Name) + "</td>";
                                tblExcelCont += "<td>" + ((docvJson[0].Hospital_Name == null) ? "" : docvJson[0].Hospital_Name) + "</td>";
                                tblExcelCont += "<td>" + ((docvJson[0].Hospital_Classification == null) ? "" : docvJson[0].Hospital_Classification) + "</td>";
                                tblExcelCont += "<td id='vdocDates_" + k + "'>";
                                for (var l = 0; l < docvJson.length; l++) {
                                    if (docvJson[l].Acc_Visit_Count == '0') {
                                        tblExcelCont += docvJson[l].DCR_Actual_Date + "<br />";
                                    }
                                    else {
                                        tblExcelCont += "" + docvJson[l].DCR_Actual_Date + ",";

                                    }
                                    if (docvJson.length > 1 && (docvJson.length - 1) != l) {
                                        tblExcelCont += ",";
                                    }
                                }
                                id++;
                                tblExcelCont += "</td>";
                                tblExcelCont += "<td>" + docvJson.length + "</td>";
                                tblExcelCont += "<td class='td-a' onclick='fnShowDetailedProducts(\"" + k + "\",\"" + docvJson[0].Doctor_Code + "\")'>View</td>"; // Detailed Product List view
                                tblExcelCont += "<td>" + ((rigiddocvJson[k]["POB"] == null) ? "-" : rigiddocvJson[k]["POB"]) + "</td>";

                                //Remarks
                                var remarks = "", dcrCodes = "", visitcodes = "";
                                for (var l = 0; l < docvJson.length; l++) {
                                    if (docvJson[l].Remarks_By_User != "" && docvJson[l].Remarks_By_User != null) {
                                        remarks += docvJson[l].Remarks_By_User + ',';
                                    }
                                    dcrCodes += docvJson[l].DCR_Code + '^';
                                    visitcodes += docvJson[l].DCR_Visit_Code + '^';
                                }
                                remarks = remarks.slice(0, -1);
                                tblExcelCont += "<td style='display:none;'>" + remarks + "</td>";
                                tblExcelCont += "<td class='td-a' onclick='fnShowDoctorVisitRemarks(\"" + dcrCodes + "_" + visitcodes + "\")'>View</td>";
                                tblExcelCont += "</tr>";
                            }
                        }
                    }

                    if (flexidocvJson != false && flexidocvJson !== undefined) {
                        for (var k = 0; k < flexidocvJson.length; k++) {
                            tblExcelCont += "<tr>";
                            tblExcelCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                            tblExcelCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                            tblExcelCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                            tblExcelCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                            tblExcelCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                            tblExcelCont += "<td><span id='vdocname_" + k + "'>" + flexidocvJson[k]["Doctor_Name"] + "</span></td>";
                            tblExcelCont += "<td>Unlisted</td>";
                            tblExcelCont += "<td>Unlisted</td>";
                            tblExcelCont += "<td id='vdocspec_" + k + "'>" + flexidocvJson[k]["Doctor_Region_Code"] + "</td>"; // for flexi doctors speciality name cums in 'Doctor_Region_Code' column
                            tblExcelCont += "<td></td>";
                            tblExcelCont += "<td></td>";
                            tblExcelCont += "<td></td>";
                            tblExcelCont += "<td>" + flexidocvJson[k]["DCR_Actual_Date"] + "</td>";
                            tblExcelCont += "<td>" + flexidocvJson[k]["Count"] + "</td>";
                            tblExcelCont += "<td class='td-a' onclick='fnShowDetailedProducts(\"" + k + "\",\"" + flexidocvJson[k].Doctor_Code + "\")'>View</td>"; // Detailed Product List view
                            tblExcelCont += "<td>" + ((flexidocvJson[k]["POB"] == null) ? "-" : flexidocvJson[k]["POB"]) + "</td>";
                            tblExcelCont += "<td style='display:none;'>" + ((flexidocvJson[k]["Remarks_By_User"] == null) ? " " : flexidocvJson[k]["Remarks_By_User"]) + "</td>";
                            tblExcelCont += "<td class='td-a' onclick='fnShowDoctorVisitRemarks(\"" + flexidocvJson[k]["DCR_Code"] + "^_" + flexidocvJson[k]["DCR_Visit_Code"] + "^" + "\")'>View</td>";
                            tblExcelCont += "</tr>";
                        }
                    }
                    debugger;
                    tblExcelCont += "</tbody></table>";
                    $("#dvDocVisitExcel").html(tblExcelCont);
                    ////////////////////////////////////////////////////////////

                    $("#divReport").show();
                    $("#dvDocVisit").show();
                    $("#lstDocVisit").show();
                    $("#divPrintDocVisit").html($("#dvDocVisit").html());

                    var jsonType = eval(type);
                    $('#tblDCRReprtDoctorVisit').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                    //$('#dvPrint').remove();


                    fninializePrint("divPrintDocVisit", "ifrmPrintdvDocVisit", "dvDocVisit");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        //window.location.hash = '#dvDocVisit';
                    }


                    //$('#dvDocVisit').closest('div').find('.TableTools_xls').hide();
                    //$('#dvDocVisit').closest('div').find('.TableTools').after('<div id="ToolTables_XLSDocVisit" style="height: 38px;width: 30px;cursor:pointer;float: right;margin-top: 0px;background-color: #f0f0f0;color: black;font-weight: 700;">Excel</div>');
                    //$('#dvDocVisit').closest('div').find('.TableTools').html('<div id="ToolTables_XLSDocVisit"  style="height: 30px; width: 30px;"><div title="Save for Excel" style="position: absolute; left: 0px; top: 0px; width: 30px; height: 30px; z-index: 99;"><embed id="ZeroClipboardMovie_15" src="../Content/DataTable/media/swf/ZeroClipboard.swf" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="30" height="30" name="ZeroClipboardMovie_15" align="middle" allowscriptaccess="always" allowfullscreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="id=15&amp;width=30&amp;height=30" wmode="transparent"></div></div>');

                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    // window.location.hash = '#dvDocVisit';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }, complete: function () {
                debugger;

                

                $('#ToolTables_XLSDocVisit').click(function (e) {
                    //getting values of current time for generating the file name
                    var dt = new Date();
                    var day = dt.getDate();
                    var month = dt.getMonth() + 1;
                    var year = dt.getFullYear();
                    var hour = dt.getHours();
                    var mins = dt.getMinutes();
                    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
                    //creating a temporary HTML link element (they support setting file names)
                    var a = document.createElement('a');
                    //getting data from our div that contains the HTML table
                    var data_type = 'data:application/vnd.ms-excel;charset=utf-8';

                    var table_html = $('#tblDCRReprtDoctorVisitExcel')[0].outerHTML;
                    //    table_html = table_html.replace(/ /g, '%20');
                    table_html = table_html.replace(/<tfoot[\s\S.]*tfoot>/gmi, '');
                    debugger;
                    var css_html = '<style>td {border: 0.5pt solid #c0c0c0} .tRight { text-align:right} .tLeft { text-align:left} </style>';
                    //    css_html = css_html.replace(/ /g, '%20');

                    a.href = data_type + ',' + encodeURIComponent('<html><head>' + css_html + '</' + 'head><body>' + table_html + '</body></html>');

                    //setting the file name
                    a.download = 'DCRReprtDoctorVisit_' + postfix + '.xls';
                    //triggering the function
                    a.click();
                    //just in case, prevent default behaviour
                    e.preventDefault();
                });
               
                //$('#ToolTables_XLS_7').hide();
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
        }
        //else { window.location.hash = '#dvDocVisit'; }
    }
}

function fnDCRConsDoctorMissed() {

    if ($("#tblDCRReprtDoctorMissed").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }


        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsDCRDoctorMissedDetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jdocm = eval('(' + response + ')');
                var tblCont = "";
                if (!(jdocm.Tables === undefined) && jdocm.Tables.length > 0 && jdocm.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtDoctorMissed' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrDrmissed'>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>MDL/SVL No</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>Campaign Name</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "</tr>";
                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "number-range" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }';
                    type += ', { type: "text" }]';
                    tblCont += "<tr>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>MDL/SVL No</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>Campaign Name</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '12' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaMissed()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";

                    for (var k = 0; k < jdocm.Tables[0].Rows.length; k++) {
                        tblCont += "<tr>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                        tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                        //  tblCont += "<td><span onclick='fnDoctor360Popup(\"" + jdocm.Tables[0].Rows[k]["Region_Code"] + "_" + jdocm.Tables[0].Rows[k]["Customer_Code"] + "_" + $("#hdnUserCode").val() + "\")' style='text-decoration:underline;cursor:pointer'>" + jdocm.Tables[0].Rows[k]["Customer_Name"] + "</span></td>";
                        tblCont += "<td><span onclick='fnDoctor360Popup(\"" + jdocm.Tables[0].Rows[k]["Customer_Code"] + "\")' style='text-decoration:underline;cursor:pointer'>" + jdocm.Tables[0].Rows[k]["Customer_Name"] + "</span></td>";
                        tblCont += "<td>" + ((jdocm.Tables[0].Rows[k]["MDL"] == null) ? "" : jdocm.Tables[0].Rows[k]["MDL"]) + "</td>";
                        tblCont += "<td>" + ((jdocm.Tables[0].Rows[k]["Category_Name"] == null) ? "" : jdocm.Tables[0].Rows[k]["Category_Name"]) + "</td>";
                        tblCont += "<td>" + ((jdocm.Tables[0].Rows[k]["Speciality_Name"] == null) ? "" : jdocm.Tables[0].Rows[k]["Speciality_Name"]) + "</td>";
                        tblCont += "<td>" + ((jdocm.Tables[0].Rows[k]["Campaign_Name"] == null) ? "-" : jdocm.Tables[0].Rows[k]["Campaign_Name"]) + "</td>";
                        tblCont += "<td>" + ((jdocm.Tables[0].Rows[k]["Hospital_Name"] == null) ? "" : jdocm.Tables[0].Rows[k]["Hospital_Name"]) + "</td>";
                        tblCont += "<td>" + ((jdocm.Tables[0].Rows[k]["Hospital_Classification"] == null) ? "" : jdocm.Tables[0].Rows[k]["Hospital_Classification"]) + "</td>";
                        tblCont += "</tr>";
                    }
                    tblCont += "</tbody></table>";

                    $("#dvDocMiss").html(tblCont);
                    $("#divReport").show();
                    $("#dvDocMiss").show();
                    $("#lstDocMiss").show();

                    $("#divPrintDocMiss").html($("#dvDocMiss").html());

                    var jsonType = eval(type);
                    $('#tblDCRReprtDoctorMissed').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                    //$('#dvPrint').remove();


                    fninializePrint("divPrintDocMiss", "ifrmPrintdvDocMiss", "dvDocMiss");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        // window.location.hash = '#dvDocMiss';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    // window.location.hash = '#dvDocMiss';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
        }
        //else { window.location.hash = '#dvDocMiss'; }
    }
}

function fnDCRConsUnlistedDoctorMet() {
    if ($("#tblDCRReprtUnlistedDocMet").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }

        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsDCRUnlistedDoctorMet',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jUndocm = eval('(' + response + ')');
                var tblCont = "";
                if (!(jUndocm.Tables === undefined) && jUndocm.Tables.length > 0 && jUndocm.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtUnlistedDocMet' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrUnlisted'>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>DCR Date</th>";
                    tblCont += "</tr>";
                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "text" }';
                    type += ', { type: "date-range" }]';
                    tblCont += "<tr>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>Speciality</th>";
                    tblCont += "<th>DCR Date</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '8' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaUnlisted()'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";

                    for (var k = 0; k < jUndocm.Tables[0].Rows.length; k++) {
                        tblCont += "<tr>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                        tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                        tblCont += "<td>" + jUndocm.Tables[0].Rows[k]["Doctor_Name"] + "</td>";
                        tblCont += "<td>" + ((jUndocm.Tables[0].Rows[k]["Speciality_Name"] == null) ? "" : jUndocm.Tables[0].Rows[k]["Speciality_Name"]) + "</td>";
                        tblCont += "<td>" + jUndocm.Tables[0].Rows[k]["DCR_Actual_Date"] + "</td>";
                        tblCont += "</tr>";
                    }
                    tblCont += "</tbody></table>";

                    $("#dvUnlistDoc").html(tblCont);
                    $("#divReport").show();
                    $("#dvUnlistDoc").show();
                    $("#lstUnlistDoc").show();

                    $("#divPrintUnlistDoc").html($("#dvUnlistDoc").html());

                    var jsonType = eval(type);
                    $('#tblDCRReprtUnlistedDocMet').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });


                    fninializePrint("divPrintUnlistDoc", "ifrmPrintdvUnlistDoc", "dvUnlistDoc");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        // window.location.hash = '#dvUnlistDoc';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    // window.location.hash = '#dvUnlistDoc';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
        }
        //else { window.location.hash = '#dvUnlistDoc'; }
    }
}

function fnDCRConsExpenseDetail() {

    if ($("#tblDCRReprtExpense").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }


        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsDCRExpenseDetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jexp = eval('(' + response + ')');
                var tblCont = "";
                if (!(jexp.Tables === undefined) && jexp.Tables.length > 0 && jexp.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtExpense' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>DCR Date</th>";
                    tblCont += "<th>DCR Type</th>";
                    tblCont += "<th>Expense Type</th>";
                    tblCont += "<th>Expense Mode</th>";
                    tblCont += "<th>Expense Amount</th>";
                    tblCont += "<th>Eligibility Amount</th>";
                    tblCont += "<th>Status</th>";
                    tblCont += "<th>Remarks</th>";
                    tblCont += "</tr>";
                    tblCont += "</thead><tbody>";

                    for (var k = 0; k < jexp.Tables[0].Rows.length; k++) {
                        tblCont += "<tr>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                        tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                        tblCont += "<td>" + jexp.Tables[0].Rows[k]["DCR_Actual_Date"] + "</td>";
                        tblCont += "<td>" + jexp.Tables[0].Rows[k]["DCR_Type"] + "</td>";
                        tblCont += "<td>" + jexp.Tables[0].Rows[k]["Expense_Type_Name"] + "</td>";
                        tblCont += "<td>" + ((jexp.Tables[0].Rows[k]["Expense_Mode"] == null) ? "" : jexp.Tables[0].Rows[k]["Expense_Mode"]) + "</td>";
                        tblCont += "<td>" + jexp.Tables[0].Rows[k]["Expense_Amount"] + "</td>";
                        tblCont += "<td>" + ((jexp.Tables[0].Rows[k]["Eligibility_Amount"] == null) ? "" : jexp.Tables[0].Rows[k]["Eligibility_Amount"]) + "</td>";
                        tblCont += "<td>" + jexp.Tables[0].Rows[k]["DCR_Status"] + "</td>";
                        tblCont += "<td>" + ((jexp.Tables[0].Rows[k]["Expense_Remarks"] == null) ? "" : jexp.Tables[0].Rows[k]["Expense_Remarks"]) + "</td>";
                        tblCont += "</tr>";
                    }
                    tblCont += "</tbody></table>";

                    $("#dvExp").html(tblCont);
                    $("#divReport").show();
                    $("#dvExp").show();
                    $("#lstExp").show();
                    $("#divPrintExp").html($("#dvExp").html());

                    $('#tblDCRReprtExpense').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "bSort": false, "sDom": 'T<"clear">lfrtip'
                    }).rowGrouping({
                        iGroupingColumnIndex: 8,
                        sGroupBy: "name",
                        bExpandableGrouping: true,
                        bHideGroupingColumn: false
                    });


                    fninializePrint("divPrintExp", "ifrmPrintdvExp", "dvExp");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        //window.location.hash = '#dvExp';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    //window.location.hash = '#dvExp';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
        }
        //else { window.location.hash = '#dvExp'; }
    }
}

function fnDCRConsRCPADetails() {

    if ($("#tblDCRReprtRCPA").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }


        var dcrStatus = "";
        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsDCRRCPADetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jrcpa = eval('(' + response + ')');
                var tblCont = "";
                if (!(jrcpa.Tables === undefined) && jrcpa.Tables.length > 0 && jrcpa.Tables[1].Rows.length > 0 && jrcpa.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblDCRReprtRCPA' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>Doctor Name</th>";
                    tblCont += "<th>Chemist Name</th>";
                    tblCont += "<th>Product/Competitor Name</th>";
                    tblCont += "<th>Brand Name</th>";
                    tblCont += "<th>My Brand</th>";
                    tblCont += "<th>Rx Qty</th>";
                    tblCont += "<th>Category</th>";
                    tblCont += "<th>MDL</th>";
                    tblCont += "<th>Hospital Name</th>";
                    tblCont += "<th>Hospital Classification</th>";
                    tblCont += "</tr>";
                    tblCont += "</thead><tbody>";


                    for (var k = 0; k < jrcpa.Tables[1].Rows.length; k++) {


                        var prodJson = jsonPath(jrcpa, "$.Tables[0].Rows[?(@.Doctor_Name=='" + jrcpa.Tables[1].Rows[k]["Doctor_Name"] + "' && @.Chemists_Name=='" + jrcpa.Tables[1].Rows[k]["Chemists_Name"] + "' && @.Product_Name=='" + jrcpa.Tables[1].Rows[k]["Competitor_Product_Name"] + "')]");
                        if (prodJson != false && prodJson !== undefined) {
                            tblCont += "<tr>";
                            if (prodJson[0].MDL == null || prodJson[0].MDL == '') {
                                tblCont += "<td>" + jrcpa.Tables[1].Rows[k]["Doctor_Name"] + "</td>";
                                tblCont += "<td>" + jrcpa.Tables[1].Rows[k]["Doctor_Name"] + "</td>";
                            }
                            else {
                                tblCont += "<td><span onclick='fnDoctor360Popup(\"" + prodJson[0].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jrcpa.Tables[1].Rows[k]["Doctor_Name"] + "</span></td>";
                                tblCont += "<td><span onclick='fnDoctor360Popup(\"" + prodJson[0].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jrcpa.Tables[1].Rows[k]["Doctor_Name"] + "</span></td>";
                            }
                            tblCont += "<td>" + jrcpa.Tables[1].Rows[k]["Chemists_Name"] + "</td>";
                            tblCont += "<td>" + jrcpa.Tables[1].Rows[k]["Competitor_Product_Name"] + "</td>";
                            tblCont += "<td>" + ((prodJson[0].Product_Code == null) ? "" : prodJson[0].Brand_Name) + "</td>";
                            tblCont += "<td>" + prodJson[0].My_Brand + "</td>";
                            tblCont += "<td>" + jrcpa.Tables[1].Rows[k]["Support_Qty"] + "</td>";

                            //check for unlisted doctor
                            if (prodJson[0].MDL == null || prodJson[0].MDL == '') {
                                tblCont += "<td>Unlisted</td>";
                                tblCont += "<td>Unlisted</td>";
                            }
                            else {
                                tblCont += "<td>" + ((prodJson[0].Category_Name == null) ? "" : prodJson[0].Category_Name) + "</td>";
                                tblCont += "<td>" + prodJson[0].MDL + "</td>";

                            }
                            tblCont += "<td>" + ((prodJson[0].Hospital_Name == null) ? "" : prodJson[0].Hospital_Name) + "</td>";
                            tblCont += "<td>" + ((prodJson[0].Hospital_Classification == null) ? "" : prodJson[0].Hospital_Classification) + "</td>";
                            tblCont += "</tr>";
                        }
                    }
                    tblCont += "</tbody></table>";


                    $("#dvRCPA").html(tblCont);
                    $("#divReport").show();
                    $("#dvRCPA").show();
                    $("#lstRCPA").show();
                    $("#divPrintRCPA").html($("#dvRCPA").html());

                    $('#tblDCRReprtRCPA').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'//, "sGroupBy": "Doctor Name"
                    }).rowGrouping({
                        bExpandableGrouping: true, iGroupingColumnIndex: 0,
                        sGroupBy: "name"
                    });
                    // $('#dvPrint').remove();


                    fninializePrint("divPrintRCPA", "ifrmPrintdvRCPA", "dvRCPA");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        //window.location.hash = '#dvRCPA';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    // window.location.hash = '#dvRCPA';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
            HideModalPopup('dvloading');

        }
        //else { window.location.hash = '#dvRCPA'; }
    }
}

function fnWADCRDetails() {

    if ($("#tblWADCR").html() == null) {
        if ($("#hdnSelect").val() != "SELECT") {
            ShowModalPopup('dvloading');
        }


        var startDate = "", endDate = "";

        startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
        endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDCRConsWADCRDetails',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&userCode=' + $("#hdnUserCode").val(),
            success: function (response) {
                var jwa = eval('(' + response + ')');
                var tblCont = "";
                if (!(jwa.Tables === undefined) && jwa.Tables.length > 0 && jwa.Tables[0].Rows.length > 0) {

                    tblCont = "<table cellspacing='0' cellpadding='0' id='tblWADCR' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr style='display: none;' id='tblTrWA'>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>DCR Date</th>";
                    tblCont += "<th>Activity Name</th>";
                    tblCont += "</tr>";
                    var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }';
                    type += ', { type: "text" }]';
                    tblCont += "<tr>";
                    tblCont += "<th style='display:none'>User Name</th>";
                    tblCont += "<th style='display:none'>Employee Name</th>";
                    tblCont += "<th style='display:none'>Region Name</th>";
                    tblCont += "<th style='display:none'>Division Name</th>";
                    tblCont += "<th style='display:none'>Reporting Region</th>";
                    tblCont += "<th>DCR Date</th>";
                    tblCont += "<th>Activity Name</th>";
                    tblCont += "</tr>";
                    tblCont += "<th colspan= '7' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaWA(this)'>Show Filter</span></th>";
                    tblCont += "</thead><tbody>";

                    for (var k = 0; k < jwa.Tables[0].Rows.length; k++) {
                        tblCont += "<tr>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["User_Name"] + " </td>";
                        tblCont += "<td style='display:none'>" + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</td>";
                        tblCont += "<td style='display:none'>" + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + " </td>";
                        tblCont += "<td style='display:none'> " + jDcrCons.Tables[0].Rows[0]["Reporting_Region"] + "</td>";
                        tblCont += "<td>" + jwa.Tables[0].Rows[k]["DCR_Actual_Date"] + "</td>";
                        tblCont += "<td>" + jwa.Tables[0].Rows[k]["Activity_Name"] + "</td>";
                        tblCont += "</tr>";
                    }
                    tblCont += "</tbody></table>";

                    $("#dvWA").html(tblCont);
                    $("#divReport").show();
                    $("#dvWA").show();
                    $("#lstWA").show();

                    $("#divPrintWA").html($("#dvWA").html());

                    var jsonType = eval(type);
                    $('#tblWADCR').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });

                    fninializePrint("divPrintWA", "ifrmPrintdvWA", "dvWA");
                    if ($("#hdnSelect").val() == "SELECT") { fnCloseLoadingForSelect(); }
                    else {
                        HideModalPopup('dvloading');
                        //window.location.hash = '#dvRCPA';
                    }
                    return;
                }
                else if ($("#hdnSelect").val() == "SELECT") {
                    fnCloseLoadingForSelect();
                }
                else {
                    HideModalPopup('dvloading');
                    // window.location.hash = '#dvRCPA';
                }
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    else {
        if ($("#hdnSelect").val() == "SELECT") {
            fnCloseLoadingForSelect();
            HideModalPopup('dvloading');
        }
        //else { window.location.hash = '#dvRCPA'; }
    }
}


function fnDCRConsExpandAll(jDCRSummary) {
    $("#hdnSelect").val("SELECT");
    var tblCont = "";
    fnCnt = 0;
    ShowModalPopup('dvloading');
    $("#aExpandCollapse").html("Collapse All");
    if ($("#tblDCRReprtHeader").html() == null) {
        if (!(jDcrCons.Tables === undefined) && jDcrCons.Tables.length > 0 && jDcrCons.Tables[0].Rows.length > 0) {
            //tblCont = "<div class='gridHeader'><h3 style='width: 99.5%;margin:0px auto;'>Detailed</h3></div>";
            tblCont = "<div><table cellspacing='0' cellpadding='0' id='tblDCRReprtHeader' class='data display dataTable box' width='100%'>";
            tblCont += "<thead>";
            tblCont += "<tr>";
            tblCont += "<th>User id : " + jDcrCons.Tables[0].Rows[0]["User_Name"] + "</th>";
            tblCont += "<th>Region Name : " + jDcrCons.Tables[0].Rows[0]["Region_Name"] + "</th>";
            tblCont += "<th>Date Period : " + $("#txtFromDate").val() + " to " + $("#txtToDate").val() + "</th></tr>";

            tblCont += "<tr><th>Employee Name : " + jDcrCons.Tables[0].Rows[0]["Employee_Name"] + "</th>";
            tblCont += "<th >Employee No : " + jDcrCons.Tables[0].Rows[0]["Employee_Number"] + "</th>";
            tblCont += "<th >Designation : " + jDcrCons.Tables[0].Rows[0]["User_Type_Name"] + "</th></tr>";

            tblCont += "<tr><th >Date of Joining : " + jDcrCons.Tables[0].Rows[0]["Date_of_Joining"] + "</th>";
            tblCont += "<th>Division Name : " + ((jDcrCons.Tables[0].Rows[0]["Division_Name"] == null) ? " N/A" : jDcrCons.Tables[0].Rows[0]["Division_Name"]) + "</th>";
            tblCont += "<th>Manager's Name : " + jDcrCons.Tables[0].Rows[0]["Manager_Name"] + " ( " + jDcrCons.Tables[0].Rows[0]["Under_User"] + " ) </th></thead></table></div></br>";
            //tblCont += "<a onclick='fnDCRConsExpandCollapseAll(this)' style='text-decoration: underline;cursor:pointer;font-weight:bold;'>Collapse All</a><br />";
        }
        $("#divHeaderDetails").append(tblCont);
    }

    // if all selected
    if ($(":checkbox[name=optionAll]:checked").length > 0) {
        // dcr
        if (jDcrCons.Tables[1].Rows[0]["DCR_Count"] > 0) {
            fnDCRConsDCRHeaderDetail();
        }
        else { fnCloseLoadingForSelect(); }

        //doctor
        if (jDcrCons.Tables[1].Rows[0]["Doctor_Visited"] > 0) {
            fnDCRConsDoctorVisit();
        }
        else { fnCloseLoadingForSelect(); }

        if (jDcrCons.Tables[1].Rows[0]["Doctor_Missed"] > 0) {
            fnDCRConsDoctorMissed();
        }
        else { fnCloseLoadingForSelect(); }

        if (jDcrCons.Tables[1].Rows[0]["RCPA_Count"] > 0) {
            fnDCRConsRCPADetails();
        }
        else { fnCloseLoadingForSelect(); }

        if (jDcrCons.Tables[1].Rows[0]["Unlisted_Doctor_Met"] > 0) {
            fnDCRConsUnlistedDoctorMet();
        }
        else { fnCloseLoadingForSelect(); }

        // chemist
        if (jDcrCons.Tables[1].Rows[0]["Chemist_Count"] > 0) {
            fnDCRConsChemistDetail();
        }
        else { fnCloseLoadingForSelect(); }

        // stockist
        if (jDcrCons.Tables[1].Rows[0]["Stockist_Count"]) {
            fnDCRConsStockistDetail();
        }
        else { fnCloseLoadingForSelect(); }

        // product
        if (jDcrCons.Tables[1].Rows[0]["Product_Count"]) {
            fnDCRConsProductDetail();
        }
        else { fnCloseLoadingForSelect(); }

        //expense
        if (jDcrCons.Tables[1].Rows[0]["Expense_Amount"] != null) {
            fnDCRConsExpenseDetail();
        }
        else { fnCloseLoadingForSelect(); }

    }
    else {
        $('input:checkbox[name=otn]').each(function () {
            if ($(this).is(':checked')) {
                switch ($(this).val()) {
                    case 'D':
                        if (jDcrCons.Tables[1].Rows[0]["DCR_Count"] > 0) {
                            fnDCRConsDCRHeaderDetail();
                        }
                        else { fnCloseLoadingForSelect(); }
                        break;

                    case 'DR':
                        if (jDcrCons.Tables[1].Rows[0]["Doctor_Visited"] > 0) {
                            fnDCRConsDoctorVisit();
                        }
                        else { fnCloseLoadingForSelect(); }

                        if (jDcrCons.Tables[1].Rows[0]["Doctor_Missed"] > 0) {
                            fnDCRConsDoctorMissed();
                        }
                        else { fnCloseLoadingForSelect(); }

                        if (jDcrCons.Tables[1].Rows[0]["RCPA_Count"] > 0) {
                            fnDCRConsRCPADetails();
                        }
                        else { fnCloseLoadingForSelect(); }

                        if (jDcrCons.Tables[1].Rows[0]["Unlisted_Doctor_Met"] > 0) {
                            fnDCRConsUnlistedDoctorMet();
                        }
                        else { fnCloseLoadingForSelect(); }
                        break;

                    case 'C':
                        if (jDcrCons.Tables[1].Rows[0]["Chemist_Count"] > 0) {
                            fnDCRConsChemistDetail();
                        }
                        else { fnCloseLoadingForSelect(); }
                        break;
                    case 'S':
                        if (jDcrCons.Tables[1].Rows[0]["Stockist_Count"]) {
                            fnDCRConsStockistDetail();
                        }
                        else { fnCloseLoadingForSelect(); }
                        break;

                    case 'P':
                        if (jDcrCons.Tables[1].Rows[0]["Product_Count"]) {
                            fnDCRConsProductDetail();
                        }
                        else { fnCloseLoadingForSelect(); }
                        break;
                    case 'E':
                        if (jDcrCons.Tables[1].Rows[0]["Expense_Amount"] != null) {
                            fnDCRConsExpenseDetail();
                        }
                        else { fnCloseLoadingForSelect(); }
                        break;
                }
            }
        });
    }

    // wide angle
    if ($(":checkbox[name=showWA]:checked").length > 0) {
        if (jDcrCons.Tables[1].Rows[0]["WA_DCRCount"] > 0) {
            fnWADCRDetails();
        }
        else {
            fnCloseLoadingForSelect();
        }
    }
}

function fnDCRConsExpandCollapseAll(id) {
    if ($(id).html() == "Collapse All") {
        $(id).html("Expand All");

        $("#dvStock").hide();
        //$('#spnHeaderStock').removeClass('collapse');
        //$('#spnHeaderStock').addClass('expand');

        $("#dvChem").hide();
        //$('#spnHeaderChem').removeClass('collapse');
        //$('#spnHeaderChem').addClass('expand');

        $("#dvProd").hide();
        //$('#spnHeaderProd').removeClass('collapse');
        //$('#spnHeaderProd').addClass('expand');

        $("#dvDCRHead").hide();
        //$('#spnHeaderDCRHead').removeClass('collapse');
        //$('#spnHeaderDCRHead').addClass('expand');

        $("#dvDocVisit").hide();
        //$('#spnHeaderDocVisit').removeClass('collapse');
        //$('#spnHeaderDocVisit').addClass('expand');

        $("#dvDocMiss").hide();
        //$('#spnHeaderDocMiss').removeClass('collapse');
        //$('#spnHeaderDocMiss').addClass('expand');

        $("#dvUnlistDoc").hide();
        $('#spnHeaderUnlistDoc').removeClass('collapse');
        $('#spnHeaderUnlistDoc').addClass('expand');

        $("#dvExp").hide();
        //$('#spnHeaderExp').removeClass('collapse');
        //$('#spnHeaderExp').addClass('expand');

        $("#dvRCPA").hide();
        //$('#spnHeaderRCPA').removeClass('collapse');
        //$('#spnHeaderRCPA').addClass('expand');

        $("#dvWA").hide();
        //$('#spnHeaderWA').removeClass('collapse');
        //$('#spnHeaderWA').addClass('expand');

    }
    else if ($(id).html() == "Expand All") {
        $(id).html("Collapse All");
        $("#dvStock").show();
        //$('#spnHeaderStock').removeClass('expand');
        //$('#spnHeaderStock').addClass('collapse');

        $("#dvChem").show();
        //$('#spnHeaderChem').removeClass('expand');
        //$('#spnHeaderChem').addClass('collapse');

        $("#dvProd").show();
        //$('#spnHeaderProd').removeClass('expand');
        //$('#spnHeaderProd').addClass('collapse');

        $("#dvDCRHead").show();
        //$('#spnHeaderDCRHead').removeClass('expand');
        //$('#spnHeaderDCRHead').addClass('collapse');

        $("#dvDocVisit").show();
        //$('#spnHeaderDocVisit').removeClass('expand');
        //$('#spnHeaderDocVisit').addClass('collapse');

        $("#dvDocMiss").show();
        //$('#spnHeaderDocMiss').removeClass('expand');
        //$('#spnHeaderDocMiss').addClass('collapse');

        $("#dvUnlistDoc").show();
        //$('#spnHeaderUnlistDoc').removeClass('expand');
        //$('#spnHeaderUnlistDoc').addClass('collapse');

        $("#dvExp").show();
        //$('#spnHeaderExp').removeClass('expand');
        //$('#spnHeaderExp').addClass('collapse');

        $("#dvRCPA").show();
        //$('#spnHeaderRCPA').removeClass('expand');
        //$('#spnHeaderRCPA').addClass('collapse');

        $("#dvWA").show();
        //$('#spnHeaderWA').removeClass('expand');
        //$('#spnHeaderWA').addClass('collapse');

    }
}

function fnCloseLoadingForSelect() {
    fnCnt = parseInt(fnCnt) + 1;
    if ($(":checkbox[name=optionAll]:checked").length > 0) { // all option
        if ($(":checkbox[name=showWA]:checked").length > 0) { // WA
            if (fnCnt == 8) {
                HideModalPopup('dvloading');
                $("#hdnSelect").val("");
                fnCnt = 0;
            }
        }
        else {
            if (fnCnt == 7) {
                HideModalPopup('dvloading');
                $("#hdnSelect").val("");
                fnCnt = 0;
            }
        }
    }
    else {
        var totCnt = 0;
        if ($(":checkbox[name=otn][value=DR]").is(':checked')) { // if doctor selected there are 4 detail tables
            totCnt = $(":checkbox[name=otn]:checked").length + 3;
        }
        else {
            totCnt = $(":checkbox[name=otn]:checked").length;
        }
        if ($(":checkbox[name=showWA]:checked").length > 0) { // wide angle
            if ((totCnt + 1) == fnCnt) {
                HideModalPopup('dvloading');
                $("#hdnSelect").val("");
                fnCnt = 0;
            }
        }
        else {
            if (totCnt == fnCnt) {
                HideModalPopup('dvloading');
                $("#hdnSelect").val("");
                fnCnt = 0;
            }
        }
    }
}

function fnClearDCRConsolidated() {
    $("#hdnSelect").val("");
}

function fnShowDoctorVisitRemarks(id) {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDCRConsDCRDoctorVisitRemarksPopUp',
        data: 'dcrCodes=' + id.split('_')[0] + '&visitCodes=' + id.split('_')[1],
        success: function (response) {
            var jsReport = eval('(' + response + ')');
            var content = "";
            if (!(jsReport.Tables === undefined) && jsReport.Tables.length > 0 && jsReport.Tables[0].Rows.length > 0) {

                content = "<table cellspacing='0' cellpadding='0' width='50%'  id='tblNonDaily' class='data display dataTable box'>";
                content += "<thead>";
                content += "<tr><th>DCR Date</th>";
                content += "<th>Remarks</th>";
                content += "</tr>";
                content += "</thead><tbody>";

                for (var j = 0; j < jsReport.Tables[0].Rows.length; j++) {
                    content += "<tr>";
                    content += "<td>" + jsReport.Tables[0].Rows[j]["DCR_Actual_Date"] + "</td>";
                    content += "<td>" + ((jsReport.Tables[0].Rows[j]["Remarks_By_User"] == null) ? "-" : jsReport.Tables[0].Rows[j]["Remarks_By_User"]) + "</td>";
                    content += "</tr>";
                }
                content += "</tbody></table>";

                var userDet = $("#dvUserDetails").html();
                $("#dvDailyBlockM").html("<h4>Doctor Name : " + jsReport.Tables[0].Rows[0]["Doctor_Name"] + "</h4>");
                $("#dvNonDailyBlockM").html(content);
            }
            if (($("#dvDailyBlockM").html() != "") || ($("#dvNonDailyBlockM").html() != "")) {
                ShowModalPopup('dvLoadingExpense');
            }
            else {
                fnMsgAlert('info', 'Information', 'No Remarks found.');
            }
        }
    });
}

function fnShowApprovalUnapprovalRemarks(remarks) {

    //01/10/2013- Approved By user Name ~ Remarks^                
    var remarksArr = remarks.split('^');
    var content = "";
    var style = "";
    var p = 0;
    for (var j = 0; j < remarksArr.length; j++) {
        if (remarksArr[j] != "") {
            if (p % 2 == 0) {
                style = "background-color:#efefef;";
            }
            else {
                style = "background-color:#d3d3d3;";
            }
            p++;
            content += "<div style='float:left;width:98%;border:1px solid #000;" + style + "'>";
            if (remarksArr[j].split('~')[0] !== undefined) {
                content += "<div style='float:left;width:100%;padding: 3px;'>" + remarksArr[j].split('~')[0] + "</div>";
            }
            if (remarksArr[j].split('~')[1] !== undefined) {
                content += "<div style='float:left;width:100%;padding: 3px;'>" + remarksArr[j].split('~')[1] + "</div>";
            }
            content += "</div>";
        }
    }

    $("#dvDailyBlockM").html("<h4>Approval/Unapproval Remarks</h4>");
    $("#dvNonDailyBlockM").html(content);
    ShowModalPopup('dvLoadingExpense');
}

function fnDCRTableShowHide(divid, spnid) {
    if ($('#' + divid).css("display") == "none") {
        $('#' + divid).fadeIn('slow');
    }
    else {
        $('#' + divid).fadeOut('slow');
    }
}

function fnDoctor360Popup(val) {
    // $.modal({ ajax: '../HiDoctor_Reports/Reports/Doctor360/' + val, title: 'Reports', overlayClose: false });
    $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + val, title: 'Reports', overlayClose: false });
    return;
}

function fnDCRConsDoctorVisitsSummaryPopup() {

    var dcrStatus = "";
    var startDate = "", endDate = "";

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
    // GET DCR STATUS
    $('input:checkbox[name=dcrStatus]').each(function () {
        if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
    });
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDCRConsDCRDoctorVisitSummary',
        data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&userCode=' + $("#hdnUserCode").val(),
        success: function (response) {
            var jdocv = eval('(' + response + ')');

            if (!(jdocv.Tables === undefined) && jdocv.Tables.length > 0 && jdocv.Tables[0].Rows.length > 0) {
                // user details
                $("#spnDVSuserName").html(jdocv.Tables[1].Rows[0]["User_Name"]);
                $("#spnDVSEmpName").html(jdocv.Tables[1].Rows[0]["Employee_Name"]);
                $("#spnDVSRegionName").html(jdocv.Tables[1].Rows[0]["Region_Name"]);
                $("#spnDVSdivision").html(((jdocv.Tables[1].Rows[0]["Division_Name"] == null) ? " N/A" : jdocv.Tables[1].Rows[0]["Division_Name"]));
                $("#spnDVSmanager").html(jdocv.Tables[1].Rows[0]["Manager_Name"] + " ( " + jdocv.Tables[1].Rows[0]["Under_User"] + " )");
                $("#spnDVSdateperiod").html($("#txtFromDate").val() + " to " + $("#txtToDate").val());

                //visitdetails
                $("#spnDVSonce").html(jdocv.Tables[0].Rows[0]["Once_Visited"]);
                $("#spnDVStwice").html(jdocv.Tables[0].Rows[0]["Twice_Visited"]);
                $("#spnDVSthrice").html(jdocv.Tables[0].Rows[0]["Thrice_Visited"]);
                $("#spnDVSmoreThanThrice").html(jdocv.Tables[0].Rows[0]["More_Visited"]);
                $("#spnDVStotalcalls").html(jdocv.Tables[0].Rows[0]["Doctor_Calls_Made"]);
            }
            $("#dvDoctorVisitSummaryOverLay").overlay().load();
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


//**************************** END- DCR CONSOLIDATED REPORT ******************************************//

function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

function fnShowDoctors(accName, date, k, version, accTime) {
    if ($("#dvOverLay").css('display') == 'none') {
        $('#divAccDocDetail').html('')
        $('#divAccDocDetail').html(accHeaderTableString_g);

        if (version == 'DCR V4') {
            $("#accDesclaimer").css('display', 'none');
        }
        else {
            $("#accDesclaimer").css('display', '');
        }

        var dcr_user_Code = $("#hdnUserCode").val();
        date = date.split('/')[1] + "/" + date.split('/')[0] + "/" + date.split('/')[2];
        var userName = $('#thuserName').html();
        var empName = $('#thempName').html();
        var regionName = $('#thRegionName').html();
        var dcrType = $('#DCRType_' + k).html();
        var dcrStatus = $('#DCRStatus_' + k).html();
        var workplace = $('#DCRWorkPlace_' + k).html();
        var travelPlaces = $('#DCRTravelPlace_' + k).html();
        var enteredDate = $('#DCREnterDate_' + k).html();

        $('#spnpuserName').html(userName);
        $('#spnEmpName').html(empName);
        $('#spnRegionName').html(regionName);
        $('#spnDCRDate').html(date);
        $('#spnDCRType').html(dcrType);
        $('#spnDCRStatus').html(dcrStatus);
        $('#spnWorkPlace').html(workplace);
        $('#spnDCRentedDate').html(enteredDate);
        $('#tdTravlledPlaces').html(travelPlaces);
        $('#accPopUpName').html(accName);
        $('#accPopUpTime').html(accTime);

        $("#dvOverLay").overlay().load();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetAccompanistVisitedDoctors',
            data: "DCR_User_Code=" + dcr_user_Code + "&Acc_User_Name=" + accName + "&DCR_User_Name=" + userName
                + "&DCR_Actual_Date=" + date,
            success: function (response) {
                if (version == 'DCR V4') {

                    var accHTML = $('#divAccDocDetail').html() + response;
                    $('#divAccDocDetail').html(accHTML);
                }
                else {
                    var accHTML = $('#divAccDocDetail').html() + "*Doctor Details <br />" + response + '<br /><span id="accDesclaimer">*the data that you see here is indicative only.</span>';
                    $('#divAccDocDetail').html(accHTML);
                }
            },
            error: function () {
                fnMsgAlert('info', 'DCR Consolidate', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
}

function fnShowDetailedProducts(rI, doccode) {
    $('#divDetailPrdDetail').html('')
    $('#divDetailPrdDetail').html(detailProdString_g);

    var docName = $('#vdocname_' + rI).html();
    var docmdl = $('#vdocmdl_' + rI).html();
    var cate = $('#vdoccat_' + rI).html();
    var spec = $('#vdocspec_' + rI).html();
    var dates = $('#vdocDates_' + rI).html();
    var dcr_user_Code = $("#hdnUserCode").val();
    var dcrDates = "";
    var userName = $('#thuserName').html();
    var empName = $('#thempName').html();
    var regionName = $('#thRegionName').html();

    dates = dates.replace(/<br>/g, '').split(',')
    for (var i = 0; i < dates.length; i++) {
        var d = new Date(dates[i]);
        dcrDates += (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + "^";
    }

    $('#spnduserName').html(userName);
    $('#spndEmpName').html(empName);
    $('#spndRegionName').html(regionName);

    $('#spndDocName').html(docName);
    $('#spndMDL').html(docmdl);
    $('#spndSpeciality').html(spec);
    $('#spndCategory').html(cate);

    $("#dvDetailedProductOverLay").overlay().load();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDetailedProductsAndInputsPerDoctor',
        data: "doctor_Code=" + doccode + "&doctor_Name=" + $.trim(docName) + "&user_Code=" + dcr_user_Code
            + "&DCR_Actual_Dates=" + $.trim(dcrDates) + "&speciality_Name=" + $.trim(spec),
        success: function (response) {
            var htmlvalue = $('#divDetailPrdDetail').html() + response;
            $('#divDetailPrdDetail').html(htmlvalue);
        },
        error: function () {
            fnMsgAlert('info', 'DCR Consolidate', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//**************************** END- DCR CONSOLIDATED REPORT ******************************************//


function fnToggleTreeaStockiest() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrStockiest").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrStockiest").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeaWA(id) {
    if ($(id).html() == "Hide Filter") {

        $("#tblTrWA").hide();
        $("#id").html('Show Filter');
    }
    else if ($("#id").html() == "Show Filter") {
        $("#tblTrWA").show();
        $("#id").html('Hide Filter');
    }
}

function fnToggleTreea() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeaMissed() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrDrmissed").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrDrmissed").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeaUnlisted() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrUnlisted").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrUnlisted").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeapopup() {

    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrpopup").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrpopup").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeaProduct() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrProduct").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrProduct").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreea() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeachemist() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrchemist").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrchemist").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}



//---------------- START - DCR CONSOLIDATED TABULAR ---------------------------------
function fnShowDCRConsolidatedTabuler() {

    ShowModalPopup('dvloading');


    var pageHeader = $("#divPageHeader").html();

    if (fnValidateDCRConsRprtTabular(pageHeader)) {
        var dcrStatus = "";
        var option = "";
        var startDate = "", endDate = "";

        $('#dvuserTree').hide();
        $("#spnTreeToggle").html('Show Tree');
        $('#leftNav').removeClass('col-xs-5');
        $('#leftNav').removeClass('col-xs-4');
        $('#leftNav').removeClass('col-xs-3');
        $("#divMain").removeClass('col-xs-9');
        $("#divMain").removeClass('col-xs-8');
        $("#divMain").removeClass('col-xs-7');
        $("#divMain").addClass('col-xs-11');

        //Hide all divs         
        $("#dvDataTable").hide();

        //Clear All the Fields  
        $("#dvDataTable").html('');


        startDate = $.trim($("#txtFromDate").val().split('/')[2]) + "-" + $.trim($("#txtFromDate").val().split('/')[1]) + "-" + $.trim($("#txtFromDate").val().split('/')[0]);
        endDate = $.trim($("#txtToDate").val().split('/')[2]) + "-" + $.trim($("#txtToDate").val().split('/')[1]) + "-" + $.trim($("#txtToDate").val().split('/')[0]);

        // GET DCR STATUS
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) { dcrStatus += $(this).val() + ","; }
        });


        // GET OPTIONS
        if ($(":checkbox[name=optionAll]:checked").length > 0) {
            option = $("input:checkbox[name=optionAll]:checked").val();
        }
        else {
            $('input:checkbox[name=otn]').each(function () {
                if ($(this).is(':checked')) { option += $(this).val() + "^"; }
            });
        }

        var showWAData = 'N';
        if ($(":checkbox[name=showWA]:checked").length > 0) {
            showWAData = 'Y';
        }

        var isExcel = 'N';
        isExcel = $(":radio[name=rptOptions]:checked").val();
        HideModalPopup("dvloading");

        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/DCRConsolidatedReport/GetDCRConsolidatedTabular',
            data: 'startDate=' + startDate + '&endDate=' + endDate + '&dcrStatus=' + escape(dcrStatus) + '&option=' + escape(option) + '&userCode=' + $("#hdnUserCode").val() + '&showWAData=' + showWAData + '&isExcel=' + isExcel + '&pageHeader=' + pageHeader,
            success: function (response) {
                if (response != null && response.split('^')[0] != "FAIL") {
                    $("#dvDataTable").html('<div class="col-lg-12"><div class="helpIconright"><img src="../Images/HelpIcon.png" onclick="fnHelp(\'DCRCONSOLIDATEDTABULAR\',\'GRID\')" /></div><div style="clear:both;"></div></div>');
                    if (isExcel == "N") {
                        $("#dvDataTable").append('<div class="col-lg-12"><a class="td-a" onclick="fnExpandAllDCRConsTabular(this)">Expand All</a></div>');
                        $("#dvDataTable").append(response);
                        $("#dvDataTable").show();
                        $(".dcrConsTabHeader").click(function () {
                            fnDCRConsTabularShowHideTable(this);
                        });
                        $("#DcrDisclaimer").show();
                    }
                    else {
                        $("#dvDataTable").append(response);
                        $("#dvDataTable").show();
                    }
                }
                else {
                    fnMsgAlert('info', pageHeader, 'Error.' + response.split('^')[1]);
                }
                $("#main").unblock();
            },
            error: function () {
                fnMsgAlert('info', pageHeader, 'Error.');
                $("#main").unblock();
            }
        });

    }
    else {
        HideModalPopup("dvloading");
    }
}

function fnDCRConsTabularShowHideTable(obj) {
    if ($(obj).hasClass("dcrconscollapse")) {
        $(obj).removeClass('dcrconscollapse');
        $(obj).addClass('dcrconsexpand');
        $(obj).next('div.table-responsive').slideDown();
    }
    else {
        $(obj).removeClass('dcrconsexpand');
        $(obj).addClass('dcrconscollapse');
        $(obj).next('div.table-responsive').slideUp();
    }
}

function fnValidateDCRConsRprtTabular(pageHeader) {

    if ($.trim($("#txtFromDate").val()) == "") {
        fnMsgAlert('info', pageHeader, 'Please enter Start date.');
        $("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    if ($.trim($("#txtToDate").val()) == "") {
        fnMsgAlert('info', pageHeader, 'Please enter End date.');
        $("#txtToDate").focus();
        HideModalPopup("dvloading");
        return false;
    }

    var fromDate = $.trim($("#txtFromDate").val().split('/')[2]) + '/' + $.trim($("#txtFromDate").val().split('/')[1]) + '/' + $.trim($("#txtFromDate").val().split('/')[0]);
    var toDate = $.trim($("#txtToDate").val().split('/')[2]) + '/' + $.trim($("#txtToDate").val().split('/')[1]) + '/' + $.trim($("#txtToDate").val().split('/')[0]);
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (!(fnValidateDateFormate($("#txtFromDate"), "Start Date"))) {
        HideModalPopup("dvloading");
        return false;
    }
    if (!(fnValidateDateFormate($("#txtToDate"), "End Date"))) {
        HideModalPopup("dvloading");
        return false;
    }

    // start date end date check
    if (startDate > endDate) {
        fnMsgAlert('info', pageHeader, 'End date can not be less than start date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":checkbox[name=dcrStatus]:checked").length == 0) {
        fnMsgAlert('info', pageHeader, 'Please select DCR status.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":checkbox[name=optionAll]:checked").length == 0 && $(":checkbox[name=otn]:checked").length == 0) {
        fnMsgAlert('info', pageHeader, 'Please select Option.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($(":radio[name=rptOptions]:checked").length == 0) {
        fnMsgAlert('info', pageHeader, 'Please select View in-screen\Export to excel.');
        HideModalPopup("dvloading");
        return false;
    }
    return true;

}

function fnExpandAllDCRConsTabular(obj) {
    if ($(obj).html() == "Expand All") {
        $(obj).html("Collapse All");
        $(".dcrconscollapse").each(function () {
            $(this).removeClass('dcrconscollapse');
            $(this).addClass('dcrconsexpand');
            $(this).next('div.table-responsive').slideDown();
        });
    }
    else {
        $(obj).html("Expand All");
        $(".dcrconsexpand").each(function () {
            $(this).removeClass('dcrconsexpand');
            $(this).addClass('dcrconscollapse');
            $(this).next('div.table-responsive').slideUp();
        });
    }
}

function fnGetDoctorAccompanist(id) {
    var dcr_date = "";
    var doctor_Visit_Code = ""; var mdlno = ""; var doc_name = ""; var category = "";
    var details = document.getElementById('divDocAccDetails_' + id).getAttribute('value').trim().split('$');

    dcr_date = details[0];
    doctor_Visit_Code = details[1];
    mdlno = details[2];
    doc_name = details[3];
    category = details[4];
    if ($("#dvAccOverLay").css('display') == 'none') {
        $("#dvAccOverLay").overlay().load();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetDoctorVisitAccName',
            data: "dcr_date=" + dcr_date + "&doctor_Visit_Code=" + doctor_Visit_Code + "&user_code=" + $("#hdnUserCode").val(),
            success: function (response) {
                var header = doc_name + ", " + mdlno + ", " + category;
                $("#doc_details").text(header);
                $("#divAccDocDetail_Call").html(response);
            },
            error: function () {
                fnMsgAlert('info', 'DCR Consolidate', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
}


function myFunction() {
    setInterval(function () { fnGetSession(); }, 300000);

}


function fnGetSession() {
    $.ajax({
        type: 'POST',
        url: '../../Home/GetHomeSession/',
        data: 'A',
        success: function (response) {

        },
        error: function () {

        }
    });

}

function GetConsolidateSummaryNG()
{
    //../HiDoctor_Reports/Reports / SpecialityCategoryWiseVisitAnaly
    window.open("DCRConsoliadteReport/DCRConsolidateNG/TTT00000159/USC00000281/2017-04-01/2017-07-31/1,2", 'DCR Consolidate Report',
        'height=1024,width=768,toolbar=no,directories=no,status=no');
    //var url = "http://localhost:14829/DCR/Consolidate/Summary/TTT00000159/USC00000281/2017-04-01/2017-07-31/1,2";
    //    $.ajax({
    //        type: 'GET',
    //        url: url,
    //        success: function (response) {
    //            console.log(response);
    //            window.open(window.location.href +"/DCRConsolidatedReport/DCRConsolidateNG/TTT00000159/USC00000281/2017-04-01/2017-07-31/1,2")

    //            alert("done");
    //        },
    //        error: function () {
    //            fnMsgAlert('info', 'DCR Consolidate', 'Error.');
    //            HideModalPopup("dvloading");
    //        }
    //    });
    
}
//---------------- END - DCR CONSOLIDATED TABULAR ---------------------------------