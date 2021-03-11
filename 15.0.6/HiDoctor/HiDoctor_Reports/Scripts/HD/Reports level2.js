

//********************************************************DCR Count -Alumni***************************************************************************//

function fnDCRCountAlumni() {
    var selectedval = "";
    var nodeVal = $('#hdnRegionCode').val();
    var adjustType = $('input:checkbox[name=DCRStatus]:checked');

    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + ",";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = adjustType[intLoop].value + ",";
            break;
        }
    }

    if (selectedval != "") {
        selectedval = selectedval.substring(0, selectedval.length - 1);
    }
    else {
        fnMsgAlert('info', 'DCR Count Alumni', 'Select atleast one dcr Status');
        HideModalPopup("dvloading");
        return false;
    }

    var startDate = $('#txtStartDate').val().split('/');
    var endDate = $('#txtEndDate').val().split('/');

    if ($("#txtStartDate").val() == "") {
        fnMsgAlert('info', 'DCR Count Alumni', 'Select start date');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtEndDate").val() == "") {
        fnMsgAlert('info', 'DCR Count Alumni', 'Select end date');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]); //dt1 
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'DCR Count Alumni', 'Start Month&Year should be less than End Month&Year');
        HideModalPopup("dvloading");
        return false;
    }


    var option = "";
    $('input:checkbox[name=DCRStatus]').each(function () {
        if ($(this).is(':checked')) { option += $(this).val() + ","; }
    });

    $.ajax({
        url: 'Reports/GetDCRCountAlumi',
        type: "POST",
        data: "RegionCode=" + $("#hdnRegionCode").val() + "&StartDate=" + $("#txtStartDate").val() + "&EndDate=" + $("#txtEndDate").val() + "&Status=" + option,
        success: function (response) {

            jsData = eval('(' + response + ')');

            var content = "";

            if (!(jsData.Tables === undefined) && jsData.Tables.length > 0 && jsData.Tables[0].Rows.length > 0) {

                //get dcr data table///
                content += "<table class='data display datatable' id='tbl_DCRcount'>";
                content += "<thead>";
                content += "<tr style='display: none;' id='tblTr'>";
                //Company Name added
                content += "<th>Company Name</th>"
                content += "<th>User Name</th>";
                content += "<th>User Type</th>";
                content += "<th>Territory Name</th>";
                content += "<th>Division</th>";
                content += "<th>Reporting Manager</th>";
                content += "<th>Reporting HQ</th>";
                content += "<th>Next Level Manger</th>";
                content += "<th>Next Level Manger HQ</th>";
                content += "<th>Date of Joining</th>";
                content += "<th>Date of Resignation</th>";
                content += "<th>No of Days  Service</th>";
                content += "<th>Last DCR Date</th>";
                content += "<th>Total Days DCR Entered</th>";
                content += "<th>Status as on date</th>";
                content += "</tr>";
                var type = '[{ type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "text" }';
                type += ',{ type: "text" },{ type: "date-range" },{ type: "date-range" },{ type: "number-range" },{ type: "date-range" },{ type: "number-range" },{ type: "text" }]';
                content += "<tr>";
                content += "<th>Company Name</th>";
                content += "<th>User Name</th>";
                content += "<th>User Type</th>";
                content += "<th>Territory Name</th>";
                content += "<th>Division</th>";
                content += "<th>Reporting Manager</th>";
                content += "<th>Reporting HQ</th>";
                content += "<th>Next Level Manger</th>";
                content += "<th>Next Level Manger HQ</th>";
                content += "<th>Date of Joining</th>";
                content += "<th>Date of Resignation</th>";
                content += "<th>No of Days  Service</th>";
                content += "<th>Last DCR Date</th>";
                content += "<th>Total Days DCR Entered</th>";
                content += "<th>Status as on date</th>";
                content += "</tr>";
                content += "<th colspan= '15' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                content += "</thead>";
                content += "<tbody>";
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    content += "<tr>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Company_Name;                   
                    content += "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].User_Name;
                    content += "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].User_Type_Name;
                    content += "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Region_Name;
                    content += "</td>";
                    //user division//
                    if (jsData.Tables[2].Rows.length > 0) {
                        var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.User_Code=='" + jsData.Tables[0].Rows[i].User_Code + "')]");
                        divisionName = "";
                        if (dJsonData != false) {
                            for (var j = 0; j < dJsonData.length; j++) {
                                divisionName += dJsonData[j].Division_Name + ",";
                            }

                            if (divisionName != "") {
                                divisionName = divisionName.substring(0, divisionName.length - 1);
                            }
                            content += "<td >" + divisionName + "</td>";
                        }
                        else {
                            content += "<td></td>  ";
                        }
                    }
                    else {
                        content += "<td></td>  ";
                    }
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Manager_Name;
                    content += "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Manager_Region;
                    content += "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Next_Manager_Name;
                    content += "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Next_Manager_Region;
                    content += "</td>";

                    content += "<td>";
                    content += (jsData.Tables[0].Rows[i].DOJ == null) ? "" : jsData.Tables[0].Rows[i].DOJ;
                    content += "</td>";
                    content += "<td>";
                    content += (jsData.Tables[0].Rows[i].Resignation_Date == null) ? "" : jsData.Tables[0].Rows[i].Resignation_Date;
                    content += "</td>";

                    //getting count o working days//                    
                    if (jsData.Tables[0].Rows[i].Resignation_Date != null && jsData.Tables[0].Rows[i].DOJ != null) {
                        var days = "";
                        var resigDate = jsData.Tables[0].Rows[i].Resignation_Date.split('/')[1] + '/' + jsData.Tables[0].Rows[i].Resignation_Date.split('/')[0] + '/' + jsData.Tables[0].Rows[i].Resignation_Date.split('/')[2];
                        var joinDate = jsData.Tables[0].Rows[i].DOJ.split('/')[1] + '/' + jsData.Tables[0].Rows[i].DOJ.split('/')[0] + '/' + jsData.Tables[0].Rows[i].DOJ.split('/')[2];
                        var d1 = new Date(resigDate);
                        var d2 = new Date(joinDate);
                        days = fnGetDateDifference(d2, d1);
                        content += "<td>";
                        content += days;
                        content += "</td>";
                    }
                    else {
                        content += "<td>";
                        content += "</td>";
                    }

                    if (jsData.Tables[2].Rows.length > 0) {
                        var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.User_Code=='" + jsData.Tables[0].Rows[i].User_Code + "')]");
                        LastDate = "";

                        if (dJsonData != false) {
                            content += "<td >" + dJsonData[0].DCR_Actual_Date + "</td>";
                            content += "<td >" + dJsonData[0].DCR_Count + "</td>";
                        }
                        else {
                            content += "<td> </td>  ";
                            content += "<td> </td>  ";
                        }
                    }
                    else {
                        content += "<td> </td>  ";
                        content += "<td> </td>  ";
                    }

                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].User_Status;
                    content += "</td>";
                    content += "</tr>";
                }
                content += "</tbody>";
                content += "</table>";

                $("#divReport").html(content);
                $("#divPrint").html(content);
                var jsonType = eval(type);
                if ($.fn.dataTable) { $('#tbl_DCRcount').dataTable({ "sPaginationType": "full_numbers" }); };
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tbl_DCRcount').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                $("#divReport").show();
            }
            else {
                fnMsgAlert('info', 'DCR Count Alumni', 'No Data found');
            }

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//***********************************************************************DCR Count -Alumni**************************************************

function GetChemistmet() {
    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Chemist Met', 'Select start date');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Chemist Met', 'Select end date');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Chemist Met', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetChemistmetAnalysis',
        type: "POST",
        data: "UserCode=" + $("#hdnUserCode").val() + "&StartDate=" + $("#txtFromDate").val() + "&EndDate=" + $("#txtToDate").val(),
        success: function (response) {

            jsData = eval('(' + response + ')');

            var content = "";


            content += "<table class='data display datatable' id='tbl_dayanalysis'>";
            content += "<thead>";
            content += "<tr style='display: none;' id='tblTr'>";
            content += "<th>User Name</th>";
            content += "<th>User Type</th>";
            content += "<th>Territory Name</th>";
            content += "<th>Division</th>";
            content += "<th>Reporting Manager</th>";
            content += "<th>Reporting HQ</th>";
            content += "<th></th>";
            content += "<th></th>";
            content += "<th></th>";
            content += "<th></th>";
            content += "</tr>";
            var type = '[{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },null';
            type += ',null,null,null]';
            //type += ',{ type: "number-range" },{ type: "number-range" },{ type: "number-range" }]';

            content += "<tr>";
            content += "<th>User Name</th>";
            content += "<th>User Type</th>";
            content += "<th>Territory Name</th>";
            content += "<th>Division</th>";
            content += "<th>Reporting Manager</th>";
            content += "<th>Reporting HQ</th>";
            content += "<th>Chemist Name</th>";
            content += "<th>POB Value</th>";
            content += "<th>No of Drs Covered</th>";
            content += "<th>No of days RCPA detailed</th>";
            content += "</tr>";
            content += "<th colspan= '10' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
            content += "</thead>";
            content += "<tbody>";
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                content += "<tr>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].User_Name;
                content += "<input type='hidden' id='txt_user_" + i + "'value='" + jsData.Tables[0].Rows[i].User_Code + "'/>";
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].User_Type_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Region_Name;
                content += "</td>";
                if (jsData.Tables[0].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                    divisionName = "";
                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            divisionName += dJsonData[j].Division_Name;
                        }
                        content += "<td >" + divisionName + "</td>";
                    }
                    else {
                        content += "<td> </td>  ";
                    }
                }
                else {
                    content += "<td> </td>  ";
                }

                content += "<td>";
                content += jsData.Tables[0].Rows[i].Manager_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Manager_Region_Name;
                content += "</td>";
                if (jsData.Tables[2].Rows.length > 0) {
                    var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.User_Code=='" + jsData.Tables[0].Rows[i].User_Code + "')]");
                    ChemistName = "";
                    POP = "";
                    rcpa = "";
                    var doctor_count = "";
                    var rcpa_count = "";
                    //                    DoctorCount = "";

                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            ChemistName += "<div id='dvChemist_" + j + "_" + i + "'>" + dJsonData[j].Chemists_Name + " </div><br />";
                            POP += "<div id='dv_" + j + "_" + i + "'>" + dJsonData[j].PO_Amount + " </div><br />";
                            var DoctorCount = jsonPath(jsData, "$.Tables[3].Rows[?(@.User_Code=='" + jsData.Tables[0].Rows[i].User_Code + "' & @.Chemists_Name =='" + dJsonData[j].Chemists_Name + "')]");
                            if (DoctorCount != false) {
                                doctor_count += "<div id='dvDocCount_" + j + "_" + i + "' style='text-decoration:underline;cursor:pointer;' onclick='fnDRDetails(this,\"" + jsData.Tables[0].Rows[i].User_Code + "\",\"" + jsData.Tables[0].Rows[i].Region_Code + "\");'>" + DoctorCount[0].doctor_count + " </div><br />";
                            }
                            else {
                                doctor_count += "<div id='dv_" + j + "_" + i + "'>0</div><br />";
                            }
                            var rcpacount = jsonPath(jsData, "$.Tables[4].Rows[?(@.User_Code=='" + jsData.Tables[0].Rows[i].User_Code + "' & @.Chemists_Name =='" + dJsonData[j].Chemists_Name + "')]");
                            if (rcpacount != false) {
                                rcpa_count += "<div id='dv_" + j + "_" + i + "'>" + rcpacount[0].DCR_RCPA + " </div><br />";

                            }
                            else {
                                rcpa_count += "<div id='dv_" + j + "_" + i + "'>0</div><br />";
                            }
                        }
                        content += "<td >" + ChemistName + "</td>";
                        content += "<td >" + POP + "</td>";
                        content += "<td align='center' ><span  style='text-decoration:underline;cursor:pointer'>" + doctor_count + "</span></td>";
                        content += "<td >" + rcpa_count + "</td>";

                    }
                    else {
                        content += "<td> </td>  ";
                        content += "<td>0</td>  ";
                        content += "<td> </td>";
                        content += "<td> </td>";
                    }
                }
                else {
                    content += "<td></td>  ";
                    content += "<td>0</td>  ";
                    content += "<td></td>";
                    content += "<td></td>";
                }


                content += "</tr>";
            }

            content += "</tbody>";
            content += "</table>";

            $("#divReport").html(content);
            $("#divPrint").html(content);
            var jsonType = eval(type);
            if ($.fn.dataTable) { $('#tbl_dayanalysis').dataTable({ "sPaginationType": "full_numbers" }); };
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_dayanalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType

                });
            };
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            $("#divReport").show();

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}
//showing pop up Dr Details//
function fnDRDetails(obj, userCode, regionCode) {
    var id = obj.id;
    var chemistName = $("#" + id.replace("dvDocCount", "dvChemist")).html();

    $.ajax({
        url: '../HiDoctor_Reports/Reports/fnDRDetails',
        type: "POST",
        data: 'UserCode=' + userCode + '&Regioncode=' + regionCode + '&ChemistName=' + chemistName + "&StartDate=" + $("#txtFromDate").val() + "&EndDate=" + $("#txtToDate").val(),
        //data: 'UserCode=' + val.split('_')[0] + '&Regioncode=' + val.split('_')[1] + '&ChemistName=' + $("#" + (obj.id).replace("dvCount", "dv")).html() + "&StartDate=" + $("#txtFromDate").val() + "&EndDate=" + $("#txtToDate").val(),
        success: function (response) {

            jsData = eval('(' + response + ')');

            var content = "";
            content += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >";
            content += "<thead><tr>";
            content += "<th align='left' colspan='6' >User Details</th></tr></thead>";
            content += "<tbody>";
            content += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Name + "</td>";
            content += "<td align='left' ><b>Region Name</b></td><td align='left' > " + jsData.Tables[1].Rows[0].Region_Name + " </td>";
            content += "<td align='left' ><b>Date Period</b></td><td align='left' > " + $("#txtFromDate").val() + " to " + $("#txtToDate").val() + "</td></tr>";
            content += "<tr><td align='left' ><b>Employee Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Employee_Name + " </td>";
            //            content += "<td align='left' ><b>Division</b></td><td align='left' > </td>";
            if (jsData.Tables[2].Rows.length > 0) {
                var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[0].Region_Code + "')]");
                divisionName = "";
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {
                        divisionName += dJsonData[j].Division_Name + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }
                    content += "<td align='left' ><b>Division</b></td><td align='left' > " + divisionName + "</td>";
                }
                else {
                    content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                }
            }
            else {
                content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
            }


            content += "<td align='left' ><b>Reporting To</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Manager_Name + "</td></tr>";
            content += "</tbody>";
            content += "</table>";
            content += "<table class='data display datatable' id='tbl_Details'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Chemist Name</th>";
            content += "<th>POB Value</th>";
            content += "<th>DCR Date</th>";
            content += "<th>Doctor Name</th>";
            content += "<th>MDL No</th>";
            content += "<th>Category</th>";
            content += "<th>Speciality</th>";
            content += "<th>Hospital Name</th>";
            content += "<th>Hospital Classification</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                content += "<tr>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Chemists_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].PO_Amount;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].DCR_Actaual_Date;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Doctor_Name;
                content += "</td>";
                if (jsData.Tables[0].Rows[i].MDL_Number != null && jsData.Tables[0].Rows[i].MDL_Number != "") {
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].MDL_Number;
                    content += "</td>";
                }
                else {
                    content += "<td></td>  ";
                }

                if (jsData.Tables[0].Rows[i].Category_Name != null && jsData.Tables[0].Rows[i].Category_Name != "") {
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Category_Name;
                    content += "</td>";
                }
                else {
                    content += "<td></td>  ";
                }

                content += "<td>";
                content += jsData.Tables[0].Rows[i].Speciality_Name;
                content += "</td>";

                if (jsData.Tables[0].Rows[i].Hospital_Name != null && jsData.Tables[0].Rows[i].Hospital_Name != "") {
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Hospital_Name;
                    content += "</td>";
                }
                else {
                    content += "<td></td>  ";
                }
                if (jsData.Tables[0].Rows[i].Hospital_Classification != null && jsData.Tables[0].Rows[i].Hospital_Classification != "") {
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Hospital_Classification;
                    content += "</td>";
                }
                else {
                    content += "<td></td>  ";
                }
                content += "</tr>";
            }


            content += "</tbody>";
            content += "</table>";

            $("#divModel").html(content);
            if ($.fn.dataTable) { $('#tbl_Details').dataTable({ "sPaginationType": "full_numbers" }); };
            $("#divModel").show();
            ShowModalPopup('modal');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}



//***************************************************************************************TPStatusReport**********************************************************************************//

//tp status grid//
function fntpstatus() {
    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'TP Status Report', 'Please Select The Month');
        return false;
    }
    var selectedval = "";
    var nodeVal = $('#hdnUserCode').val();
    var adjustType = $('input:checkbox[name=TPStatus]:checked');

    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + ",";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = adjustType[intLoop].value + ",";
            break;
        }
    }

    if (selectedval != "") {
        selectedval = selectedval.substring(0, selectedval.length - 1);
    }
    else {
        fnMsgAlert('info', 'TP Status Report', 'Select atleast one TP Status');
        HideModalPopup("dvloading");
        return false;
    }
    var month = "", year = "";
    var fromDate = "";
    var toDate = "", accName = "";
    if ($("#txtFrom").val().split('-')[0] == "Jan") {
        month = "01";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Feb") {
        month = "02";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Mar") {
        month = "03";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Apr") {
        month = "04";
    }
    else if ($("#txtFrom").val().split('-')[0] == "May") {
        month = "05";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Jun") {
        month = "06";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Jul") {
        month = "07";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Aug") {
        month = "08";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Sep") {
        month = "09";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Oct") {
        month = "10";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Nov") {
        month = "11";
    }
    else if ($("#txtFrom").val().split('-')[0] == "Dec") {
        month = "12";
    }
    year = $("#txtFrom").val().split('-')[1];
    var option = "";
    $('input:checkbox[name=TPStatus]').each(function () {
        if ($(this).is(':checked')) { option += $(this).val() + ","; }
    });
    ShowModalPopup("dvloading");
    $('#tree').hide();
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');
    $("#spnTreeToggle").html('Show Tree');

    $("#divReport").hide();   
    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetTPstatus',
        type: "POST",
        data: "UserCode=" + $("#hdnUserCode").val() + "&month=" + month + "&year=" + year + "&Status=" + option,
        success: function (response) {         
            $("#divReport").html(response.split('*')[0]);
            $("#divPrint").html(response.split('*')[0]);
            $("#divReport").show();
            var type = response.split('*')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $('#tbl_dayanalysis').dataTable({
                    "sPaginationType": "full_numbers","bSort":false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                })
                    .dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType

                    });
            };
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            $("#divReport").show();
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnTpproduct(val) {

    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetNonmappedproduct',
        type: "POST",

        data: 'UserCode=' + val.split('_')[0] + '&month=' + val.split('_')[1] + '&year=' + val.split('_')[2] + '&Status=' + val.split('_')[3] + '&tpid=' + val.split('_')[4] + '&dateperiod=' + $("#txtFrom").val(),

        success: function (response) {

            $("#divModel_4").html(response.split('*')[0]);
            $("#divsubPrint").html(response.split('*')[0]);
            var type = response.split('*')[1];
            var jsonType = eval(type)       
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_CPDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }

                });
                    //.dataTable().columnFilter({
                //    sPlaceHolder: "head:after",
                //    aoColumns: jsonType

                //});
            };
            fninializePrint("divsubPrint", "ifrmsubPrint", "divModel_4");
            $("#divModel").show();
            ShowModalPopup('modal_4');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//pop up for non cp//
function fnCpCount(val) {

    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetCPDetails',
        type: "POST",
        data: 'UserCode=' + val.split('_')[0] + '&month=' + val.split('_')[1] + '&year=' + val.split('_')[2] + '&Status=' + val.split('_')[3] + '&dateperiod=' + $("#txtFrom").val(),

        success: function (response) {
            $("#divModel").html(response.split('*')[0]);
            $("#divsub1Print").html(response.split('*')[0]);
            var type = response.split('*')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_CPDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            //    .dataTable().columnFilter({
            //        sPlaceHolder: "head:after",
            //        aoColumns: jsonType
            //    });
            };
            fninializePrint("divsub1Print", "ifrmsub1Print", "divModel");
            $("#divModel").show();
            ShowModalPopup('modal');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}

//pop up for non category//
function fnCategory(val) {

    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetCategoryDetails',
        type: "POST",
        data: 'UserCode=' + val.split('_')[0] + '&month=' + val.split('_')[1] + '&year=' + val.split('_')[2] + '&Status=' + val.split('_')[3] + '&dateperiod=' + $("#txtFrom").val(),

        success: function (response) {
            $("#divModel_1").html(response.split('*')[0]);
            $("#divsub2Print").html(response.split('*')[0]);
            var type = response.split('*')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_CategoryDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
                //.dataTable().columnFilter({
                //    sPlaceHolder: "head:after",
                //    aoColumns: jsonType

                //});
            };
            fninializePrint("divsub2Print", "ifrmsub2Print", "divModel_1");
            $("#divModel_1").show();
            ShowModalPopup('modal_1');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}

//pop up for accom//
function fnAccom(val) {

    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetAccDetails',
        type: "POST",
        data: 'UserCode=' + val.split('_')[0] + '&month=' + val.split('_')[1] + '&year=' + val.split('_')[2] + '&Status=' + val.split('_')[3] + '&dateperiod=' + $("#txtFrom").val(),

        success: function (response) {
            $("#divModel_2").html(response.split('*')[0]);
            $("#divsub3Print").html(response.split('*')[0]);
            var type = response.split('*')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_ACCDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
                //    .dataTable().columnFilter({
                //    sPlaceHolder: "head:after",
                //    aoColumns: jsonType
                //});
            };
            fninializePrint("divsub3Print", "ifrmsub3Print", "divModel_2");
            $("#divModel_2").show();
            ShowModalPopup('modal_2');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//popup for tpdoctors//
function fnTpdoctors(val) {
    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetNoEnteredDoctorDetails',
        type: "POST",
        data: 'UserCode=' + val.split('_')[0] + '&month=' + val.split('_')[1] + '&year=' + val.split('_')[2] + '&Status=' + val.split('_')[3] + '&dateperiod=' + $("#txtFrom").val(),

        success: function (response) {
            $("#divModel_3").html(response.split('*')[0]);
            $("#divsub4Print").html(response.split('*')[0]);
            var type = response.split('*')[1];
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_doctorDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
                //    .dataTable().columnFilter({
                //    sPlaceHolder: "head:after",
                //    aoColumns: jsonType
                //});
            };
            fninializePrint("divsub4Print", "ifrmsub4Print", "divModel_3");
            $("#divModel_3").show();
            ShowModalPopup('modal_3');
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
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



function fnToggleTreeamain() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrmain").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrmain").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeatpproduct() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrtpproduct").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrtpproduct").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeacpcount() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrcpcount").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrcpcount").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}


function fnToggleTreeacategory() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrcategory").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrcategory").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}
//fnToggleTreeadoctor

function fnToggleTreeaacc() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTracc").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTracc").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}


function fnToggleTreeadoctor() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrdoctor").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrdoctor").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}