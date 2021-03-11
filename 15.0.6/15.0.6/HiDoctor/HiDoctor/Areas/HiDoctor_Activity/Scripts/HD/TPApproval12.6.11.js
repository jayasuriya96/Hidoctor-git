//Global variables
var jsData_g = "";
var Planned_doc_g;
var Missed_doc_g;
var DoctorHeader_g;
var summary_Data_g = 0;
var userPrivilege_g
function fnsetPrivilegeValues() {
    var tpAppovalprivilegeValue_g = "";
    var approveArr = new Array();

    tpAppovalprivilegeValue_g = fnGetPrivilegeValue("CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF", "");

    approveArr = tpAppovalprivilegeValue_g.split(',');

    if ($.inArray("TP", approveArr) > -1) { // check whether the privilege CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF is mapped with the value "TP",TP approval needed
        UnapprovalNeeded_g = "YES";
    }
    else {
        UnapprovalNeeded_g = "NO";
    }
}
///Get divisions
function fnGetDivisions() {
    $.ajax({
        type: 'post',
        url: '../HiDoctor_Master/Approval/GetDivisions',
        data: 'A',
        success: function (jsData) {
            if (jsData != null && jsData != '' && jsData != undefined) {
                var jsonResult = eval('(' + jsData + ')');
                if (jsonResult.length > 0) {
                    var selectcolumn = $("#ddlDivision");
                    for (var s = 0 ; s < jsonResult.length; s++) {
                        selectcolumn.append("<option value=" + jsonResult[s].Division_Code + ">" + jsonResult[s].Division_Name + "</option>");
                    }
                    selectcolumn.append("<option value='ALLDIV' selected='selected'>ALL</option>");
                }
            }

        },
        error: function () {
            fnMsgAlert("Get Divisions failed.");
        }
    });
}

//functions which are based on the MSDN style format
function fnUserTreeNodeClick(node) {
    return false;
    //if ($("#txtTPMonth").val() == "") {
    //    fnMsgAlert('error', 'Error', 'Please select Month & Year');
    //    return false;
    //}
    //if ($("#drpStatus").val() == "S") {
    //    fnMsgAlert('error', 'Error', 'Please select status');
    //    return false;
    //}

    //$("#leftNav").show();
    //$('#dvTPMonth').hide();
    //$('#tree').hide();
    //$('#divMain').show();
    //$("#dvTPApp").show();

    //$('#leftNav').removeClass('col-xs-5');
    //$('#leftNav').removeClass('col-xs-4');
    //$('#leftNav').removeClass('col-xs-3');
    //$("#divMain").removeClass('col-xs-9');
    //$("#divMain").removeClass('col-xs-8');
    //$("#divMain").removeClass('col-xs-7');
    //$("#divMain").addClass('col-xs-11');

    //$('#hdnUserCode').val(node.data.key);
    //$('#hdnUserName').val(node.data.title);
    //$("#spnName").html(node.data.title);

    //var month = $("#txtTPMonth").val().split('-')[0].toString();
    //var year = $("#txtTPMonth").val().split('-')[1].toString();

    //fnBindTPAppliedStatus(month, year);
}
function fnBindTpconsolidatedReport(month, year) {
    $("#dvTpconsolidated").block();
    $.ajax({
        type: 'POST',
        url: 'TourPlanner/GetTpconsolidatedReport',
        data: "userCode=" + $("#hdnUserCode").val() + "&month=" + month + "&year=" + year,
        success: function (result) {
            debugger;
            var tp_Report = eval('(' + result + ')');
            var totalCount = tp_Report.Tables[0].Rows;
            Planned_doc_g = tp_Report.Tables[1].Rows;
            Missed_doc_g = tp_Report.Tables[2].Rows;
            var cons_Count = tp_Report.Tables[3].Rows;
            var cat_report = tp_Report.Tables[4].Rows;
            var childUserCount = tp_Report.Tables[5].Rows;
            var table = "<table class='data display box' style='width: 80%;margin-top: 6px;'><thead><tr><td>Total " + DoctorHeader_g + "</td><td>Planned " + DoctorHeader_g + "</td><td>Missed " + DoctorHeader_g + "</td></tr></thead>";
            for (var i = 0; i < totalCount.length; i++) {
                table += "<tr><td> " + totalCount[i].Approved_Doctors_Count + "</td>";
                if (parseInt(totalCount[i].Planned_Doctor_Count) > 0)
                    table += "<td> <a onclick='fnShowPlannedDoc();' style='cursor: pointer;'  herf='#'>" + totalCount[i].Planned_Doctor_Count + "</a></td>";
                else
                    table += "<td>0</td>";
                var missed_doc = parseInt(totalCount[i].Approved_Doctors_Count) - parseInt(totalCount[i].Planned_Doctor_Count);
                if (missed_doc > 0)
                    table += "<td> <a onclick='fnShowMissedDoc();' style='cursor: pointer;'  herf='#'>" + missed_doc + "</a></td></tr>";
                else
                    table += "<td>0</td>";
            }
            table += '<tbody></tbody></table>';
            var con_table = "<table class='data display box' style='width: 80%;margin-top: 6px;'><thead><tr><td>Total Days</td><td>No of Applicable  Days</td><td>No of Field Days</td><td>No of Attendance Days</td><td>No of Leave</td><td>No of Non Entry Days</td><td>No of Weekend / Holidays</td></tr></thead>";
            con_table += '<tr><td>' + cons_Count[0].TotalDays + '</td>';
            con_table += '<td>' + cons_Count[0].Total_Applicable_Days + '</td>';
            con_table += '<td>' + cons_Count[0].Field_Count + '</td>';
            con_table += '<td>' + cons_Count[0].Attendance_Count + '</td>';
            con_table += '<td>' + cons_Count[0].Leave_Count + '</td>';
            con_table += '<td>' + cons_Count[0].tpnonEntryDays + '</td>';
            con_table += '<td>' + cons_Count[0].Holiday_WeekEnd_Count + '</td></tr>';
            con_table += '</table>'

            var cat_table = "<table class='data display box' style='width: 80%;margin-top: 6px;'><thead><tr>";
            for (var i = 0; i < cat_report.length; i++) {
                cat_table += "<td>" + cat_report[i].Expense_Entity_Name + "</td>";
            }
            cat_table += "</tr></thead><tr>";
            for (var i = 0; i < cat_report.length; i++) {
                cat_table += "<td>" + cat_report[i].Count + "</td>";
            }
            cat_table += "</tr></table>";
            $("#dvTpconsolidated").show();
            $("#dvTpconsolidated").html("<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Consolidated View</h3></div>" + con_table + "<div id='divSummary'><div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>" + DoctorHeader_g + " Planned Summary</h3></div>" + table + "</div><div id='divCategoryBreakUp'><div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Work Category Break-Up</h3></div><div style='width: 98%;overflow-y: overlay;margin-bottom: 10px;'>" + cat_table + "</div></div><div id='divCount'></div>");

            if (childUserCount.length > 0) {
                //Manager-Hide the work cat summary
                if (parseInt(childUserCount[0].ChildUserCount) > 0) {
                    $("#divSummary").hide();
                } else
                    $("#divSummary").show();
            }
            else {
                $("#divSummary").show();
            }
            fnBindTPCount(month, year);
            $("#dvTpconsolidated").unblock();

        },
        error: function () {
            $("#dvTpconsolidated").hide();
            $("#dvTpconsolidated").unblock();
        }
    });
}
function fnBindTPCount(month, year) {
    $("#divCount").block();
    $.ajax({
        type: 'POST',
        url: 'TourPlanner/GetTPCount',
        data: "userCode=" + $("#hdnUserCode").val() + "&month=" + month + "&year=" + year,
        success: function (result) {
            var table = '<div class="gridHeader"><h3 style="width: 85%;margin:0px auto">TP Total Count</h3></div>';
            table += '<div style="width: 98%;overflow-y: overlay;margin-bottom: 10px;"><table class="data display box" style="width: 80%;margin-top: 6px;"><thead><tr><td>TP Total Count</td><td>TP Applied Count</td><td>TP Approved Count</td><td>TP Unapproved Count</td></thead><tbody>';
            for (var i = 0; i < result.length; i++) {
                table += "<tr><td>" + result[i].TP_Total_Count + "</td>";
                table += "<td>" + result[i].TP_Applied_Count + "</td>";
                table += "<td>" + result[i].TP_Approved_Count + "</td>";
                table += "<td>" + result[i].TP_Unapproved_Count + "</td></tr>";
            }
            table += "</tbody></html>";
            $("#divCount").html(table);
            $("#divCount").unblock();
        }
    });
}
function fnShowPlannedDoc() {
    var table = "<div class='gridHeader'><h3 style='width: 85%;margin:6px auto'>Planned " + DoctorHeader_g + "</h3></div><div style='height: 300px;overflow-y: scroll;'><table class='data display box'><thead><tr><td>Category Name</td><td>" + DoctorHeader_g + " Visit Count</td><td>" + DoctorHeader_g + " Visit Norms</td><td>Less Than Norms</td><td>Equal Norms</td><td>More Than Norms</td></tr></thead>";
    for (var i = 0; i < Planned_doc_g.length; i++) {
        table += '<tr><td>' + Planned_doc_g[i].Category_Name + '</td>';
        table += '<td>' + Planned_doc_g[i].Category_Visit_Count + '</td>';
        table += '<td>' + Planned_doc_g[i].Total_Doc_Count + '</td>';
        table += '<td>' + Planned_doc_g[i].Less_Then + '</td>';
        table += '<td>' + Planned_doc_g[i].Equal + '</td>';
        table += '<td>' + Planned_doc_g[i].More_Than + '</td></tr>';
    }
    table += '</tbody></table></div>';
    bootbox.alert(table);
}
function fnShowMissedDoc() {
    var table = "<div class='gridHeader'><h3 style='width: 85%;margin:6px auto'>Missed " + DoctorHeader_g + "</h3></div><div style='height: 300px;overflow-y: scroll;'><table class='data display box'><thead><tr><td>" + DoctorHeader_g + " Name</td><td>Category Name</td><td>Speciality Name</td><td>MDL Number</td></tr></thead>";
    for (var i = 0; i < Missed_doc_g.length; i++) {
        table += '<tr><td>' + Missed_doc_g[i].Doctor_Name + '</td>';
        table += '<td>' + Missed_doc_g[i].Category_Name + '</td>';
        table += '<td>' + Missed_doc_g[i].Speciality_Name + '</td>';
        table += '<td>' + Missed_doc_g[i].MDL_Number + '</td></tr>';
    }
    table += '</tbody></table></div>';
    bootbox.alert(table);
}
var TpHeader = "";
var TpReportId = "";
var TPvalues = "";

function fnBindTpReport(values) {
    debugger;
    TPvalues = values;
    DoctorHeader_g = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor ");
    var TPvaluesLength = TPvalues.split('|');
    tpId = TPvalues.split('|')[0];
    $("#dvTpReport").overlay({
        onBeforeLoad: function () {
            $('#Modal').modal("hide");
        },
        onLoad: function () {
        },
        onClose: function () {
            $('#Modal').modal("show");
        }
    });
    if ($('#dvTpReport').css('display') == 'none') {
        $('#dvTpReport').show();
    }
    //ShowModalPopup('dvLoading');
    $.ajax({
        type: 'POST',
        url: 'TourPlanner/GetTPReport',
        data: 'tp_Id=' + tpId,
        success: function (result) {
            debugger;
            TpHeader = result.TpHeader;
            TpReportId = tpId;
            var htmltable = "";
            var TpHeadertbl = "<table class='data display dataTable box'><thead>";
            if (TpHeader[0].Project_Name != 'LEAVE') {
                TpHeadertbl += '<tr><td>Type of TP</td>';
                if (TpHeader[0].Project_Name == 'ATTENDANCE')
                    TpHeadertbl += "<td>Activity Name</td>";
                TpHeadertbl += '<td>Beat / Patch Name</td><td>Work Category</td>';
                TpHeadertbl += '<td>Place Worked</td><td>Meeting Point</td><td>Meeting Time</td><td>TP Status</td><td>TP Common Remarks</td><td>Approved / Un Approved By</td>';
                TpHeadertbl += '<td>Approved / Un Approved Date</td><td>Approval / Un Approval Reason</td></tr></thead>';
                for (var i = 0; i < TpHeader.length; i++) {
                    TpHeadertbl += '<tr><td>' + TpHeader[i].Project_Name + '</td>';
                    if (TpHeader[0].Project_Name == 'ATTENDANCE')
                        TpHeadertbl += "<td>" + TpHeader[i].Activity_Name + "</td>";
                    TpHeadertbl += '<td>' + TpHeader[i].CP_name + '</td><td>' + TpHeader[i].Category + '</td>';
                    TpHeadertbl += '<td>' + TpHeader[i].Work_Area + '</td><td>' + TpHeader[i].Meeting_Point + '</td><td>' + TpHeader[i].Meeting_Time + '</td><td>' + TpHeader[i].TP_Status + '</td><td>' + TpHeader[i].Remarks + '</td><td>' + TpHeader[i].Tp_Approved_By + '</td>';
                    TpHeadertbl += '<td>' + TpHeader[i].Approved_Date + '</td><td>' + TpHeader[i].Unapprove_Reason + '</td></tr>';
                }
                TpHeadertbl += '</tbody></table>';

                //SFC
                var sfc = result.TpSfc;
                var sfcTable = "<table class='data display dataTable box'><thead><tr><td>Region Name</td><td>From Place</td><td>To Place</td><td>Distance</td><td>Travel Mode</td></tr></thead>";
                if (sfc != null)
                    for (var i = 0; i < sfc.length; i++) {
                        sfcTable += '<tr><td>' + sfc[i].Region_Name + '</td>';
                        sfcTable += '<td>' + sfc[i].From_Place + '</td>';
                        sfcTable += '<td>' + sfc[i].To_Place + '</td>';
                        sfcTable += '<td>' + sfc[i].Distance + '</td>';
                        sfcTable += '<td>' + sfc[i].Travel_Mode + '</td></tr>';
                    }

                sfcTable += '</tbody></table>';
                //Doctor 
                var doc_List = new Array();
                var doctor = result.TpDoctor;
                var doctable = "<table class='data display dataTable box' ><tbody><tr><td>Doctor Region</td><td>Doctor Name</td><td>MDL/SVL#</td><td>Category</td><td>Specialty</td></tr></thead>";
                if (doctor != null)
                    for (var i = 0; i < doctor.length; i++) {
                        if (doc_List.indexOf(doctor[i].Region_Name.trim()) == -1) {
                            doctable += '<tr><td>' + doctor[i].Region_Name + '</td>';
                            doc_List.push(doctor[i].Region_Name.trim());
                        }
                        else {
                            doctable += '<tr><td style="text-align: center;">-</td>';
                        }
                        doctable += '<td>' + doctor[i].Customer_Name + '</td>';
                        doctable += '<td>' + doctor[i].MDL_Number + '</td>';
                        doctable += '<td>' + doctor[i].Category_Name + '</td>';
                        doctable += '<td>' + doctor[i].Speciality_Name + '</td></tr>';

                    }
                doctable += '</tbody></table>';

                //Sample
                var sample = result.TpSampleProduct;
                var samplesTable = "<table class='data display dataTable box' ><thead><tr><td>" + DoctorHeader_g + " Region</td><td>" + DoctorHeader_g + " Name</td><td>Sample / Promotional item name</td>";
                samplesTable += '<td>Qty Planned</td><td>Brand Name</td></tr></thead>';

                if (sample != null)
                    for (var i = 0; i < sample.length; i++) {
                        samplesTable += '<tr><td>' + sample[i].DoctorRegionName + '</td>';
                        samplesTable += '<td>' + sample[i].DoctorName + '</td>';
                        samplesTable += '<td>' + sample[i].Product_Name + '</td>';
                        samplesTable += '<td>' + sample[i].Quantity + '</td>';
                        samplesTable += '<td>' + sample[i].Brand_Name + '</td></tr>';
                    }
                samplesTable += '</tbody></table>';

                var tblAccName = result.lsAccName;
                var acc_Sno = 1;
                var accTable = "<table class='data display dataTable box' ><thead><tr><td style='display:none'>S.No</td><td>Region Name</td><td>User Name</td><td>Designation</td></tr></thead>";
                for (var i = 0; i < tblAccName.length; i++) {
                    if (TpHeader.length > 0 && tblAccName[i].Accomp_Name != null && tblAccName[i].Accomp_Name != '') {
                        accTable += "<tr><td style='display:none'>" + acc_Sno + "</td><td>" + tblAccName[i].Region_Name + "</td>";
                        accTable += "<td>" + tblAccName[i].Accomp_Name + "</td><td>" + tblAccName[i].User_Type_Name + "</td></tr>";
                        acc_Sno++;
                    }
                }
                accTable += "</table>";
                if (TpHeader != null && TpHeader.length > 0) {
                    htmltable += "<div class='gridHeader'><h3 class='heading_tp'>Header Details</div><div style='overflow-x:auto;'>" + TpHeadertbl + "</div>";
                }
                if (acc_Sno > 1) {
                    htmltable += "<div class='gridHeader'><h3 class='heading_tp'>Accompanist Details</div>" + accTable;
                }
                if (sfc != null && sfc.length > 0) {
                    htmltable += "<div class='gridHeader'><h3 class='heading_tp'>SFC Details</div>" + sfcTable;
                }
                if (doctor != null && doctor.length > 0) {
                    htmltable += "<div class='gridHeader'><h3 class='heading_tp'>" + DoctorHeader_g + " Planned Details</div>" + doctable;
                }
                if (sample != null && sample.length > 0) {
                    htmltable += "<div class='gridHeader'><h3 class='heading_tp'>Doctor Sample / Promotional item Details</div>" + samplesTable;
                }
                var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");
                if (batchPrivellage == 'YES') {
                    var batch = result.lstBatch;
                    var batchTable = "<table class='data display dataTable box' ><thead><tr><td>Region Name</td><td>Customer Name</td><td>Batch Name</td><td>No of Chicks</td><td> Schedule Name</td><td> Start Date</td><td> End Date</td> </tr></thead>";
                    for (var i = 0; i < batch.length; i++) {
                        batchTable += "<tr>";
                        batchTable += "<td>" + batch[i].Region_Name + "</td>";
                        batchTable += "<td>" + batch[i].Customer_Name + "</td>";
                        batchTable += "<td>" + batch[i].Batch_Name + "</td>";
                        batchTable += "<td>" + batch[i].No_Of_Chick + "</td>";
                        batchTable += "<td>" + batch[i].Schedule_Name + "</td>";
                        batchTable += "<td>" + batch[i].Schedule_StartDate + "</td>";
                        batchTable += "<td>" + batch[i].Schedule_EndDate + "</td>";
                        batchTable += "</tr>";
                    }
                    batchTable += "</table>";
                    if (batch != null && batch.length > 0) {
                        htmltable += "<div class='gridHeader'><h3 class='heading_tp'>Poultry Batch</div>" + batchTable;
                    }
                }

                if (tpApproveStatus == "") {
                    tpApproveStatus = "2^";
                }

                //remarks, approve and unapprove(in report popup)
                if (tpApproveStatus == "2^") {

                    htmltable += "<div style='margin-left: 35%'>";
                    htmltable += "<div><textarea id='txtReason' class='clstxtreason' style='height: 50px; width: 250px ;margin-top: 10px;' maxlength='500' placeholder='Remarks is Mandatory, in case of Unapproval'></textarea> <input type='hidden' id='hdnSingle'/></div>";
                    htmltable += "<div style='clear: both'></div><br /></div>";
                    //htmltable += "<td><img src='../areas/hidoctor_activity/content/images/web/hd/tpapp_approve.png' style='margin-left: 45%;' id='imgunapprove' onclick='fnReportApprove(this)' /></td>";
                    //htmltable += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' style='margin-left: 30px;' id='imgUnApprove' onclick='fnReportUnApprove(this)' />";
                    htmltable += "<input type='button' value='Approve' id='btnApproved' style='margin-left: 45%;' class='btn small primary' onclick = 'fnReportApprove(TPvalues)'  />";
                    htmltable += "<input type='button' value='Unapprove' id='btnUnApproved' style='margin-left: 10px;' class='btn small primary' onclick = 'fnReportUnApprove(TPvalues)' />";
                }
                else if (tpApproveStatus == "1^") {
                    var TPUnapprovePrivilege = fnGetPrivilegeVal("CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF", "NO");
                    var tp = TPUnapprovePrivilege.split(',');
                    var tpprivilegeLength = tp.length;
                    for (var i = 0; i < tpprivilegeLength; i++) {
                        if (TPUnapprovePrivilege.split(',')[i] == "TP") {
                            htmltable += "<div style='margin-left: 40%'>";
                            htmltable += "<div><textarea id='txtReason' style='height: 50px; width: 250px ;margin-top: 10px;' maxlength='500' placeholder='Remarks is Mandatory, in case of Unapproval'></textarea> <input type='hidden' id='hdnSingle'/></div>";
                            htmltable += "<div style='clear: both'></div><br /></div>";
                            htmltable += "<input type='button' value='Unapprove' id='btnUnApproved' style='margin-left: 48%;' class='btn small primary' onclick = 'fnReportUnApprove(TPvalues)' />";
                            //htmltable += "<input type='button' value='Unapprove' id='btnUnApproved' style='margin-left: 48%;' class='btn small primary' onclick = 'fnUnApprove(this)' />";
                        }
                    }
                }

            } else {
                TpHeadertbl += '<tr><td>Type of TP</td><td>Leave Type Name</td><td>TP Status</td><td>TP Common Remarks</td><td>Approved / Un Approved By</td>';
                TpHeadertbl += "<td>Approved / Un Approved Date</td><td>Approval / Un Approval Reason</td></tr><tbody>";
                for (var i = 0; i < TpHeader.length; i++) {
                    TpHeadertbl += '<tr><td>' + TpHeader[i].Project_Name + '</td><td>' + TpHeader[i].Activity_Name + '</td>';
                    TpHeadertbl += '<td>' + TpHeader[i].TP_Status + '</td>';
                    TpHeadertbl += '<td>' + TpHeader[i].Remarks + '</td><td>' + TpHeader[i].Tp_Approved_By + '</td>';
                    TpHeadertbl += '<td>' + TpHeader[i].Approved_Date + '</td><td>' + TpHeader[i].Unapprove_Reason + '</td></tr>';
                }
                TpHeadertbl += '</tbody></table>';
                htmltable += "<div class='gridHeader'><h3 class='heading_tp'>Header Details</div>" + TpHeadertbl;

                if (tpApproveStatus == "") {
                    tpApproveStatus = "2^";
                }

                if (tpApproveStatus == "2^") {

                    htmltable += "<div style='margin-left: 35%'>";
                    htmltable += "<div><textarea id='txtReason' class='clstxtreason' style='height: 50px; width: 250px ;margin-top: 10px;' maxlength='500' placeholder='Remarks is Mandatory, in case of Unapproval'></textarea> <input type='hidden' id='hdnSingle'/></div>";
                    htmltable += "<div style='clear: both'></div><br /></div>";
                    htmltable += "<input type='button' value='Approve' id='btnApproved' style='margin-left: 45%;' class='btn small primary' onclick = 'fnReportApprove(TPvalues)'  />";
                    htmltable += "<input type='button' value='Unapprove' id='btnUnApproved' style='margin-left: 10px;' class='btn small primary' onclick = 'fnReportUnApprove(TPvalues)' />";
                }
                else if (tpApproveStatus == "1^") {
                    var TPUnapprovePrivilege = fnGetPrivilegeVal("CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF", "NO");
                    var tp = TPUnapprovePrivilege.split(',');
                    var tpprivilegeLength = tp.length;
                    for (var i = 0; i < tpprivilegeLength; i++) {
                        if (TPUnapprovePrivilege.split(',')[i] == "TP") {
                            htmltable += "<div style='margin-left: 40%'>";
                            htmltable += "<div><textarea id='txtReason' style='height: 50px; width: 250px ;margin-top: 10px;' maxlength='500' placeholder='Remarks is Mandatory, in case of Unapproval'></textarea> <input type='hidden' id='hdnSingle'/></div>";
                            htmltable += "<div style='clear: both'></div><br /></div>";
                            htmltable += "<input type='button' value='Unapprove' id='btnUnApproved' style='margin-left: 48%;' class='btn small primary' onclick = 'fnReportUnApprove(TPvalues)' />";
                        }
                    }
                }

            }
            HideModalPopup('dvLoading');
            $("#dvTp").html(htmltable);
            $("#dvTpReport").overlay().load();
            $("#dvTpReport").css("width", "60%");
            if (TPvalues.split('|')[1] == "Expense") {
                $('#txtReason').hide();
                $('#btnApproved').hide();
                $('#btnUnApproved').hide();
            }
        }
    });
}

//function for approve from tp reports
function fnReportApprove(TPvalues) {
    debugger;
    var tdStatus = TpHeader[0].TP_Status;
    if (tdStatus == "Approved") {
        fnMsgAlert('info', 'Info', 'You cannot approve the Approved TP.');
        HideModalPopup('dvLoading');
        return false;
    }
    tpId = TpReportId;
    var remarks = $(".clstxtreason").val();

    if (remarks != '') {
        if (!fnChkSplCharForRemarks('txtReason')) {
            var specialChar = "(/[~`/\''^&$<>?*+!|#%=\\]/g)";
            fnMsgAlert('info', 'Info', 'Special characters <b>' + specialChar + '</b> are not allowed in the remarks.');
         
            HideModalPopup('dvLoading');
            return false;
        }
    }

    $.ajax({
        type: "POST",
        url: 'TourPlanner/TPStatusChange',
        data: "TPId=" + tpId + "&Status=1&Remarks=" + remarks + "",
        success: function (jsData) {
            debugger;
            if (TPvalues.split('|')[1] == "Dashboard") {
                var tempdate = TPvalues.split('|')[2];
                month = tempdate.split('-')[1];
                year = tempdate.split('-')[2];
            }
            else if (TPvalues.split('|')[1] == "TPApproval") {
                var month = fngetMonthNumber($('#txtTPMonth').val().split('-')[0]);
                var year = $("#txtTPMonth").val().split('-')[1].toString();
            }
            fnBindTPAppliedStatus(month, year, "", "");
            fnBindTPAppliedStatus(month, year, "1", "");
            fnBindTPCount(month, year);
            fnMsgAlert('success', 'TP Approval', 'Tour planner aproved successfully');
            HideModalPopup('dvLoading');
            $('#dvTpReport').hide();
            if (TPvalues.split('|')[1] == "Dashboard") {
                $('#Modal').modal('hide');
                fnLoadBody('DashboardLandingPage/Index', this, 'Home');
                LandingPage.fnGetTPApprovalCount();
                //location.reload('DashboardLandingPage/Index');
            }
        }
    });

}

//function for unapprove from tp reports
function fnReportUnApprove(TPvalues) {
    debugger;
    var tdStatus = TpHeader[0].TP_Status;
    if (tdStatus == "Unapproved") {
        fnMsgAlert('info', 'Info', 'You cannot approve the Approved TP.');
        HideModalPopup('dvLoading');
        return false;
    }

    tpId = TpReportId;
    var remarks = $(".clstxtreason").val();   // $('#txtReason').val();
    if ($.trim(remarks) == "") {
        fnMsgAlert('info', 'Info', 'Please enter remarks for unapprove');
        HideModalPopup('dvLoading');
        return false;
    }

    if (remarks != '') {
        if (!fnChkSplCharForRemarks('txtReason')) {
            var specialChar = "(/[~`/\''^&$<>?*+!|#%=\\]/g)";
            fnMsgAlert('info', 'Info', 'Special characters <b>' + specialChar + '</b> are not allowed in the remarks.');
            HideModalPopup('dvLoading');
            return false;
        }
    }

    $.ajax({
        type: "POST",
        url: 'TourPlanner/TPStatusChange',
        data: "TPId=" + tpId + "&Status=0&Remarks=" + remarks + "",
        success: function (jsData) {
            debugger;
            if (TPvalues.split('|')[1] == "Dashboard") {
                var tempdate = TPvalues.split('|')[2];
                month = tempdate.split('-')[1];
                year = tempdate.split('-')[2];
            }
            else if (TPvalues.split('|')[1] == "TPApproval") {
                var month = fngetMonthNumber($('#txtTPMonth').val().split('-')[0]);
                var year = $("#txtTPMonth").val().split('-')[1].toString();
            }
            fnBindTPAppliedStatus(month, year, "", "");
            fnBindTPAppliedStatus(month, year, "1", "");
            fnBindTPCount(month, year);
            fnMsgAlert('success', 'TP Approval', 'Tour planner unapproved successfully');
            HideModalPopup('dvLoading');
            $('#dvTpReport').hide();
            if (TPvalues.split('|')[1] == "Dashboard") {
                $('#Modal').modal('hide');
                fnLoadBody('DashboardLandingPage/Index', this, 'Home');
                LandingPage.fnGetTPApprovalCount();
            }
        }
    });
}

//function to bind the tp details
function fnBindTPAppliedStatus(month, year, Is_summary, Is_consolidated) {
    debugger;
    ShowModalPopup('dvLoading');
    var selectedstatus = $("#hdnStatus").val();
    var selectedstatusName = $("#ddlStatus option:selected").text().toUpperCase();
    if (Is_summary == "1") {
        selectedstatusName = "ALL";
    }
    var currentuserCode = $('#hdnUserCode').val();
    var sfcContent = "";
    $.ajax({
        type: "POST",
        url: 'TourPlanner/GetTPApproval',
        data: "UserCode=" + $("#hdnUserCode").val() + "&Month=" + month + "&Year=" + year + "&Status=" + selectedstatusName + "",
        //async: false,
        success: function (jsData) {
            debugger;
            jsData = eval('(' + jsData + ')');
            jsData_g = jsData;
            var content = "";
            var tableClassName = "data display datatable";
            if (true) {
                tableClassName = "table";
            }
            if (Is_summary == "")
                content += "<table class='" + tableClassName + "' width='150%' id='tblTPApproval'>";
            else
                content += "<table class='" + tableClassName + "' width='150%' id='tblTPApproval_Summary'>";
            content += "<thead><tr>";
            if (Is_summary == "") {
                content += "<td><div>Select</div><div style='margin-left: 12px;'><input type='checkbox' id='Chk_selectAll' onclick='fnSelectall(this)'/></div></td>";
            }
            else {
                content += "<td>Report</td>";
            }
            debugger;
            if (selectedstatusName != 'ALL') {
                if (currentuserCode != currentUserCode_g) {
                    if (UnapprovalNeeded_g == 'YES') {
                        if (selectedstatusName.toUpperCase() == 'APPLIED') {
                            content += "<td>Approve</td><td>Unapprove</td>";
                        }
                        else if (selectedstatusName.toUpperCase() == 'APPROVED') {
                            content += "<td>Unapprove</td>";
                        }
                    }
                    else {
                        if (selectedstatusName.toUpperCase() == 'APPLIED') {
                            content += "<td>Approve</td><td>Unapprove</td>";
                        }
                    }
                }
            }
            if (selectedstatusName != 'ALL') {
                content += "<td align='center'>Approval Remarks</td>";
            }
            content += " <td>TP Date</td><td>Activity Type</td><td>Work Category</td><td>Accompanist Name</td><td>Work Place</td><td>Beat / Patch Name</td>";
            // if (selectedstatusName != 'ALL' && summary_Data_g == 0) {
            //$("#dvTpconsolidated").hide();
            //content += " <td>SFC</td><td>Accompanists</td><td>TP Remarks</td>";
            //}
            // else {
            //if (summary_Data_g == 0)
            //var selectedstatusvalue = $("#ddlStatus option:selected").text().toUpperCase();
            if (Is_consolidated == "1")
                fnBindTpconsolidatedReport(month, year);

            // }
            //content += " <td>Show Doctors Link</td>";
            if (selectedstatusName == 'ALL')
                content += " <td>Status</td>";
            content += " <td>Approval History</td></tr></thead>";
            content += "<tbody>";
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                var className = '';
                if (jsData.Tables[0].Rows[i].Project_Name.toUpperCase() == 'WEEKEND') {
                    className = "weekend";
                }
                if (jsData.Tables[0].Rows[i].Project_Name.toUpperCase() == 'HOLIDAY') {
                    className = "holiday";
                }
                if (jsData.Tables[0].Rows[i].Project_Name.toUpperCase() == 'Non Entered Date') {
                }
                content += "<tr>";
                //Report
                var report = '';
                if (jsData.Tables[0].Rows[i].TP_Id != null) {
                    debugger;
                    var report = '';
                    var screenName = "TPApproval";
                    var dummyVar = "0";
                    report = "<a id='chkReport_" + i + "' onclick='fnBindTpReport(\"" + jsData.Tables[0].Rows[i].TP_Id + "|" + screenName + "|" + dummyVar + "\")' href='#'>Report</a>";
                    if (Is_summary == "") {
                        content += "<td class='" + className + "'><div style='margin-left: 12px;'><input type='checkbox' class='case' name='case' id='chk_" + i + "' /></div> " + report + "</td>";
                    } else {
                        content += "<td class='" + className + "'>" + report + "</td>";
                    }
                }
                else
                    content += "<td class='" + className + "'>-</td>";
                if (selectedstatusName != 'ALL') {
                    ////Approve and Unapprove buttons
                    if (currentuserCode != currentUserCode_g) {
                        if (UnapprovalNeeded_g == 'YES') {
                            if (selectedstatusName.toUpperCase() == 'APPLIED') {
                                content += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png' id='imgUnApprove_" + i + "' onclick='fnApprove(this)' /></td>";
                                content += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' id='imgUnApprove_" + i + "' onclick='fnUnApprove(this)' />";
                                if (Is_summary == "")
                                    content += "<input type='hidden' id='hdnTpid_" + i + "' value='" + jsData.Tables[0].Rows[i].TP_Id + "' /></td>";
                            }
                            else if (selectedstatusName.toUpperCase() == 'APPROVED') {
                                content += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' id='imgUnApprove_" + i + "' onclick='fnUnApprove(this)' />";
                                if (Is_summary == "")
                                    content += " <input type='hidden' id='hdnTpid_" + i + "' value='" + jsData.Tables[0].Rows[i].TP_Id + "' /></td>";
                            }
                        }
                        else {
                            if (selectedstatusName.toUpperCase() == 'APPLIED') {
                                content += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png' id='imgUnApprove_" + i + "' onclick='fnApprove(this)' /></td>";
                                content += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' id='imgUnApprove_" + i + "' onclick='fnUnApprove(this)' />";
                                if (Is_summary == "")
                                    content += "<input type='hidden' id='hdnTpid_" + i + "' value='" + jsData.Tables[0].Rows[i].TP_Id + "' /></td>";
                            }
                        }
                    }
                }
                //Approval Remarks
                if (jsData.Tables[0].Rows[i].TP_Id != null && selectedstatusName != 'ALL')
                    content += "<td style='width:22% !important'><textarea style='width:80%;' id='txtRemarks_" + i + "' /></td>";
                // else if (selectedstatusName != 'ALL')
                //   content += "<td class='" + className + "'>-</td>";
                //TP Date                
                content += "<td class='" + className + "' style='width:12% !important'>" + jsData.Tables[0].Rows[i].TP_Date + "</td>";
                //DCR Type
                content += "<td class='" + className + "'>" + jsData.Tables[0].Rows[i].Project_Name + "</td>";
                //Work Category
                content += "<td class='" + className + "'>" + jsData.Tables[0].Rows[i].Category + "</td>";
                var accDetails = jsonPath(jsData, "$.Tables[1].Rows[?(@.TP_Id=='" + jsData.Tables[0].Rows[i].TP_Id + "')]");
                var accContent = "";
                var acc = '';
                var acc1doc = '';
                var acc2 = '';
                var acc2doc = '';
                var acc3 = '';
                var acc3doc = '';
                var acc4 = '';
                var acc4doc = '';
                if (accDetails != false && accDetails != undefined) {

                    if (accDetails[0].Accomp_Name != "" && accDetails[0].Accomp_Name != null) {
                        //  content += "<b>1</b>." + accDetails[0].Accomp_Name + "<br />";
                        acc = accDetails[0].Accomp_Name;
                        //content += "<td class='" + className + "'>" + accDetails[0].Accomp_Name + "</td>";
                    }
                    if (accDetails[0].Acc1_only_for_Doctor != "" && accDetails[0].Acc1_only_for_Doctor != null) {
                        acc1doc = accDetails[0].Acc1_only_for_Doctor;
                        // content += "<td class='" + className + "'>" + accDetails[0].Acc1_only_for_Doctor + "</td>";
                        // accContent += "<b>1</b>." + accDetails[0].Acc1_only_for_Doctor + "<br />";
                    }
                    if (accDetails[0].Accompanist2_Name != "" && accDetails[0].Accompanist2_Name != null) {
                        acc2 = accDetails[0].Accompanist2_Name;
                        // content += "<td class='" + className + "'>" + accDetails[0].Accompanist2_Name + "</td>";
                        //accContent += "<b>2</b>." + accDetails[0].Accompanist2_Name + "<br />";
                    }
                    if (accDetails[0].Acc2_only_for_Doctor != "" && accDetails[0].Acc2_only_for_Doctor != null) {
                        acc2doc = accDetails[0].Acc2_only_for_Doctor;
                        //content += "<td class='" + className + "'>" + accDetails[0].Acc2_only_for_Doctor + "</td>";
                        // accContent += "<b>2</b>." + accDetails[0].Acc2_only_for_Doctor + "<br />";
                    }
                    if (accDetails[0].Accompanist3_Name != "" && accDetails[0].Accompanist3_Name != null) {
                        acc3 = accDetails[0].Accompanist3_Name;
                        //  content += "<td class='" + className + "'>" + accDetails[0].Accompanist3_Name + "</td>";
                        // accContent += "<b>3</b>." + accDetails[0].Accompanist3_Name + "<br />";
                    }
                    if (accDetails[0].Acc3_only_for_Doctor != "" && accDetails[0].Acc3_only_for_Doctor != null) {
                        acc3doc = accDetails[0].Acc3_only_for_Doctor;
                        // content += "<td class='" + className + "'>" + accDetails[0].Acc3_only_for_Doctor + "</td>";
                        // accContent += "<b>3</b>." + accDetails[0].Acc3_only_for_Doctor + "<br />";
                    }
                    if (accDetails[0].Accompanist4_Name != "" && accDetails[0].Accompanist4_Name != null) {
                        acc4 = accDetails[0].Accompanist4_Name;
                        // content += "<td class='" + className + "'>" + accDetails[0].Accompanist4_Name + "</td>";
                        // accContent += "<b>4</b>." + accDetails[0].Accompanist4_Name + "<br />";
                    }
                    if (accDetails[0].Acc4_only_for_Doctor != "" && accDetails[0].Acc4_only_for_Doctor != null) {
                        acc4doc = accDetails[0].Acc4_only_for_Doctor;
                        // content += "<td class='" + className + "'>" + accDetails[0].Acc4_only_for_Doctor + "</td>";
                        // accContent += "<b>4</b>." + accDetails[0].Acc4_only_for_Doctor + "<br />";
                    }

                }
                content += "<td style='width:8% !important' class='" + className + "'><ul style='list-style: none;'>" + ((acc == null || acc == "") ? "" : "<li>" + acc + "</li>") + ((acc2 == null || acc2 == "") ? "" : "<li>" + acc2 + "</li>") + ((acc3 == null || acc3 == "") ? "" : "<li>" + acc3 + "</li>") + ((acc4 == null || acc4 == "") ? "" : "<li>" + acc4 + "</li>") + "</ul></td>";
                //Work Place
                content += "<td style='width:8% !important' class='" + className + "'>" + jsData.Tables[0].Rows[i].Work_Area + "</td>";
                //Cp Name
                content += "<td style='width:8% !important' class='" + className + "'>" + jsData.Tables[0].Rows[i].CP_name + "</td>";
                //SFC 
                sfcContent = "";
                var sfcDetails = jsonPath(jsData, "$.Tables[3].Rows[?(@.TP_Id=='" + jsData.Tables[0].Rows[i].TP_Id + "')]");
                if (sfcDetails != false && sfcDetails != undefined) {
                    sfcContent = "";
                    sfcContent += "<span class='spn-small-font'>";
                    for (var s = 0; s < sfcDetails.length; s++) {
                        sfcContent += "<b>" + (s + 1) + "</b>." + sfcDetails[s].From_Place + " <b>to</b> " + sfcDetails[s].To_Place + "<br />";
                    }
                    sfcContent += "</span>";
                }
                //if (selectedstatusName != 'ALL') {
                //    content += "<td style='width:10% !important'>" + sfcContent + "</td>";
                //}
                //accompanist bind         
                var accDetails = jsonPath(jsData, "$.Tables[1].Rows[?(@.TP_Id=='" + jsData.Tables[0].Rows[i].TP_Id + "')]");
                var accContent = "";
                if (accDetails != false && accDetails != undefined) {
                    accContent += "<span class='spn-small-font'>";
                    if (accDetails[0].Accomp_Name != "" && accDetails[0].Accomp_Name != null) {
                        accContent += "<b>1</b>." + accDetails[0].Accomp_Name + "<br />";
                    }
                    if (accDetails[0].Acc1_only_for_Doctor != "" && accDetails[0].Acc1_only_for_Doctor != null) {
                        accContent += "<b>1</b>." + accDetails[0].Acc1_only_for_Doctor + "<br />";
                    }
                    if (accDetails[0].Accompanist2_Name != "" && accDetails[0].Accompanist2_Name != null) {
                        accContent += "<b>2</b>." + accDetails[0].Accompanist2_Name + "<br />";
                    }
                    if (accDetails[0].Acc2_only_for_Doctor != "" && accDetails[0].Acc2_only_for_Doctor != null) {
                        accContent += "<b>2</b>." + accDetails[0].Acc2_only_for_Doctor + "<br />";
                    }
                    if (accDetails[0].Accompanist3_Name != "" && accDetails[0].Accompanist3_Name != null) {
                        accContent += "<b>3</b>." + accDetails[0].Accompanist3_Name + "<br />";
                    }
                    if (accDetails[0].Acc3_only_for_Doctor != "" && accDetails[0].Acc3_only_for_Doctor != null) {
                        accContent += "<b>3</b>." + accDetails[0].Acc3_only_for_Doctor + "<br />";
                    }
                    if (accDetails[0].Accompanist4_Name != "" && accDetails[0].Accompanist4_Name != null) {
                        accContent += "<b>4</b>." + accDetails[0].Accompanist4_Name + "<br />";
                    }
                    if (accDetails[0].Acc4_only_for_Doctor != "" && accDetails[0].Acc4_only_for_Doctor != null) {
                        accContent += "<b>4</b>." + accDetails[0].Acc4_only_for_Doctor + "<br />";
                    }
                    accContent += "</span>";
                }
                //if (selectedstatusName != 'ALL')
                //    content += "<td>" + accContent + "</td>";
                //Tp Remarks
                //if (selectedstatusName != 'ALL')
                //    content += "<td>" + jsData.Tables[0].Rows[i].Remarks + "</td>";
                //Doctor Link
                //var docCount = 0;
                //var docDetails = jsonPath(jsData_g, "$.Tables[2].Rows[?(@.TP_Id=='" + jsData.Tables[0].Rows[i].TP_Id + "')]");
                //if (docDetails != false && docDetails != undefined) {
                //    docCount = docDetails.length;
                //}
                //if (jsData.Tables[0].Rows[i].TP_Id != null && docCount > 0)
                //    content += "<td style='width:5% !important'><span class='italic-small' onclick='fnBindDoctors(" + jsData.Tables[0].Rows[i].TP_Id + ")'> (" + docCount + " Drs) </span></td>";
                //else
                //    content += "<td class='" + className + "'>-</td>";
                //Tp Status
                if (jsData.Tables[0].Rows[i].TP_Status == "Applied" && selectedstatusName == 'ALL') {
                    var name = 'td-tp-applied' + className;
                    if (Is_summary == "") {
                        content += "<td  class='" + name + "' id='tdTpStatus_" + i + "'>" + jsData.Tables[0].Rows[i].TP_Status + "</td>";
                    }
                    else {
                        content += "<td  class='" + name + "'>" + jsData.Tables[0].Rows[i].TP_Status + "</td>";
                    }
                }
                else if (jsData.Tables[0].Rows[i].TP_Status == "Approved" && selectedstatusName == 'ALL') {
                    var name = 'td-tp-approved' + className;
                    if (Is_summary == "") {
                        content += "<td  class='" + name + "' id='tdTpStatus_" + i + "'>" + jsData.Tables[0].Rows[i].TP_Status + "</td>";
                    }
                    else {
                        content += "<td  class='" + name + "'>" + jsData.Tables[0].Rows[i].TP_Status + "</td>";
                    }
                }
                else {
                    if (selectedstatusName == 'ALL') {
                        var name = 'td-tp-unapproved' + className;
                        if (Is_summary == "") {
                            content += "<td class='" + className + "'  id='tdTpStatus_" + i + "'>" + jsData.Tables[0].Rows[i].TP_Status + "</td>";
                        }
                        else {
                            content += "<td class='" + className + "'>" + jsData.Tables[0].Rows[i].TP_Status + "</td>";
                        }
                    }
                }
                //History 
                if (jsData.Tables[0].Rows[i].TP_Id != null) {
                    content += "<td style='width: 5%;' class='td-a' onclick='fnShowHistory(\"" + jsData.Tables[0].Rows[i].User_Code + "\",\"" + jsData.Tables[0].Rows[i].TP_Date + "\");'>View</td>";
                }
                else {
                    content += "<td class='" + className + "'>-</td>";
                }
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";

            if (Is_summary == "") {

                $("#dvTPApp").html(content);
                if (false) {
                    if (currentuserCode != currentUserCode_g) {
                        if (UnapprovalNeeded_g == 'YES') {
                            if ((selectedstatusName.toUpperCase() == 'ALL') || (selectedstatusName.toUpperCase() == 'UNAPPROVED')) {
                                $('#tblTPApproval').dataTable({ bPaginate: false }).rowGrouping({
                                    iGroupingColumnIndex: 3,
                                    sGroupBy: "name",
                                    bExpandableGrouping: true,
                                    bHideGroupingColumn: false
                                });
                            }
                            else if (selectedstatusName.toUpperCase() == 'APPLIED') {
                                $('#tblTPApproval').dataTable({ bPaginate: false }).rowGrouping({
                                    iGroupingColumnIndex: 5,
                                    sGroupBy: "name",
                                    bExpandableGrouping: true,
                                    bHideGroupingColumn: false
                                });
                            }
                            else if (selectedstatusName.toUpperCase() == 'APPROVED') {
                                $('#tblTPApproval').dataTable({ bPaginate: false }).rowGrouping({
                                    iGroupingColumnIndex: 4,
                                    sGroupBy: "name",
                                    bExpandableGrouping: true,
                                    bHideGroupingColumn: false
                                });
                            }
                        }
                        else {
                            if (selectedstatusName.toUpperCase() == 'APPLIED') {
                                $('#tblTPApproval').dataTable({ bPaginate: false }).rowGrouping({
                                    iGroupingColumnIndex: 5,
                                    sGroupBy: "name",
                                    bExpandableGrouping: true,
                                    bHideGroupingColumn: false
                                });
                            }
                            else {
                                $('#tblTPApproval').dataTable({ bPaginate: false }).rowGrouping({
                                    iGroupingColumnIndex: 3,
                                    sGroupBy: "name",
                                    bExpandableGrouping: true,
                                    bHideGroupingColumn: false
                                });
                            }
                        }
                    }
                    else {
                        $('#tblTPApproval').dataTable({ bPaginate: false }).rowGrouping({
                            iGroupingColumnIndex: 3,
                            sGroupBy: "name",
                            bExpandableGrouping: true,
                            bHideGroupingColumn: false
                        });
                    }
                    $('.group').append('<span class="group-exp-col"> (click here to expand/collapse)</span>')
                }
                $("#dvtpinitimation").html('');
                //To bind completion status
                if (jsData.Tables[5].Rows.length > 0) {
                    if (jsData.Tables[5].Rows[0].TP_Completion_Status == "NOT COMPLETED") {
                        if (currentuserCode != currentUserCode_g) {
                            if (UnapprovalNeeded_g == 'YES') {
                                if (selectedstatusName.toUpperCase() == 'APPLIED') {
                                    $('#dvshowbtn').show();
                                    $("#dvtpinitimation").html("Not every days in the month has a TP.");
                                    $('#btnApprove').show();
                                    $("#btnUnApprove").show();
                                }
                                else if (selectedstatusName.toUpperCase() == 'APPROVED') {
                                    $('#dvshowbtn').show();
                                    $("#dvtpinitimation").html('');
                                    $('#btnApprove').hide();
                                    $("#btnUnApprove").show();
                                }
                                else {
                                    $('#dvshowbtn').hide();
                                }
                            }
                            else {
                                if (selectedstatusName.toUpperCase() == 'APPLIED') {
                                    $('#dvshowbtn').show();
                                    $("#dvtpinitimation").html("Not every days in the month has a TP.");
                                    $('#btnApprove').show();
                                    $("#btnUnApprove").show();
                                }
                                else {
                                    $('#dvshowbtn').hide();
                                    $("#dvtpinitimation").html('');
                                    $('#btnApprove').hide();
                                    $('#btnUnApprove').hide();
                                }

                            }
                        }
                        else {
                            $('#dvshowbtn').hide();
                            $("#dvtpinitimation").html('');
                            $('#btnApprove').hide();
                            $('#btnUnApprove').hide();
                        }
                    }
                    else {
                        if (currentuserCode != currentUserCode_g) {
                            if (UnapprovalNeeded_g == 'YES') {
                                if (selectedstatusName.toUpperCase() == 'APPLIED') {
                                    $('#dvshowbtn').show();
                                    $("#dvtpinitimation").html('');
                                    $('#btnApprove').show();
                                    $("#btnUnApprove").show();
                                }
                                else if (selectedstatusName.toUpperCase() == 'APPROVED') {
                                    $('#dvshowbtn').show();
                                    $("#dvtpinitimation").html('');
                                    $('#btnApprove').hide();
                                    $("#btnUnApprove").show();
                                }
                                else {
                                    $('#dvshowbtn').hide();
                                }
                            }
                            else {
                                if (selectedstatusName.toUpperCase() == 'APPLIED') {
                                    $('#dvshowbtn').show();
                                    $("#dvtpinitimation").html("Not every days in the month has a TP.");
                                    $('#btnApprove').show();
                                    $("#btnUnApprove").show();
                                }
                                else {
                                    $('#dvshowbtn').hide();
                                    $("#dvtpinitimation").html('');
                                    $('#btnApprove').hide();
                                    $('#btnUnApprove').hide();
                                }
                            }
                        }
                        else {
                            $('#dvshowbtn').hide();
                            $("#dvtpinitimation").html('');
                            $('#btnApprove').hide();
                            $('#btnUnApprove').hide();
                        }
                    }
                }
                else {
                    $("#dvtpinitimation").html("Not every days in the month has a TP.");
                    // $('#dvshowbtn').hide();
                }
            }
            else {
                $("#dvSummaryTable").html('');
                $("#dvSummaryTable").html(content);
                $("#dvSummary").show();

            }
            // $("#divMain").css('display', '')
            //$("#divCenter").css('display', '')
            HideModalPopup('dvLoading');
        }
    });
}

//toggle tree
function fnOpenTree() {
    $("#dvTPMonth").slideDown()
    $("#usertree").slideDown();
    $("#divleft").css('width', '20%');
    $("#imggr").hide();
    $("#imgless").show()
    $("#divCenter").css('width', '75%');
}
function fnCloseTree() {
    $("#dvTPMonth").slideUp()
    $("#usertree").slideUp();
    $("#divleft").css('width', '3%');
    $("#imggr").show();
    $("#imgless").hide()
    $("#divCenter").css('width', '94%');
}

//bind doctors in overlay
function fnBindDoctors(tpId) {
    $("#dvDoc").html('');
    var docDetails = jsonPath(jsData_g, "$.Tables[2].Rows[?(@.TP_Id=='" + tpId + "')]");
    if (docDetails != false && docDetails != undefined) {
        var content = "";
        content += "<table class='data display datatable'>";
        content += "<thead>";
        content += "<tr><td>Si No</td><td>MDL Number</td><td>Doctor Name</td><td>Region Name</td><td>Category</td><td>Speciality</td></tr>";
        content += "</thead>";
        content += "<tbody>";
        for (var d = 0; d < docDetails.length; d++) {
            var proDetails = jsonPath(jsData_g, "$.Tables[4].Rows[?(@.TP_Doctor_Id=='" + docDetails[d].TP_Doctor_Id + "')]");
            var proCount = 0;
            if (proDetails != false && proDetails != undefined) {
                proCount = proDetails.length;
            }

            content += "<tr>";
            content += "<td style='width:8%'>" + (d + 1) + "</td>";
            content += "<td style='width:15%'>" + docDetails[d].MDL_Number + "</td>";
            content += "<td style='text-decoration:underline;cursor:pointer;color:#2084C2' onclick='fnShowProducts(" + d + ")'>" + docDetails[d].Customer_Name + "<span class='group-exp-col'> ( " + proCount + " sample )</span></td>";
            content += "<td>" + docDetails[d].Region_Name + "</td>";
            content += "<td>" + docDetails[d].Category_Name + "</td>";
            content += "<td>" + docDetails[d].Speciality_Name + "</td>";
            content += "</tr>";

            content += "<tr id='tr_" + d + "' style='display:none'>";
            content += "<td colspan='5'>";

            content += "<div style='border:1px solid #efefef;padding:3px;color:#09778E'>";
            for (var p = 0; p < proDetails.length; p++) {
                content += proDetails[p].Product_Name + " ( " + proDetails[p].Quantity + " )<br />";
            }
            if (proCount == 0) {
                content += "(No sample details found for this doctor)";
            }
            content += "</div>";

            content += "</td>";
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";

        $("#dvDoc").html(content);

    }
    $("#dvDoctors").overlay().load();
}

//Show Products
function fnShowProducts(rowIndex) {
    if ($("#tr_" + rowIndex).is(":visible")) {
        $("#tr_" + rowIndex).css('display', 'none');
    }
    else {
        $("#tr_" + rowIndex).css('display', '');
    }
}

//function to approve
function fnApprove(obj) {
    debugger;
    ShowModalPopup('dvLoading');
    var tdStatus = obj.id.replace('imgUnApprove_', 'tdTpStatus_');
    if ($("#" + tdStatus).html() == "Approved") {
        fnMsgAlert('info', 'Info', 'You cannot approve the Approved TP.');
        HideModalPopup('dvLoading');
        return false;
    }
    var tp = obj.id.replace('imgUnApprove_', 'hdnTpid_')
    var tpId = $("#" + tp).val();
    var remarksId = obj.id.replace('imgUnApprove_', 'txtRemarks_');
    var remarks = $("#" + remarksId).val();

    if (!fnChkSplCharForRemarks(remarksId)) {
        var specialChar = "(/[~`/\''^&$<>?*+!|#%=\\]/g)";
        fnMsgAlert('info', 'Info', 'Special characters <b>' + specialChar + '</b> are not allowed in the remarks.');
        HideModalPopup('dvLoading');
        return false;
    }
    else {
        $.ajax({
            type: "POST",
            url: 'TourPlanner/TPStatusChange',
            data: "TPId=" + tpId + "&Status=1&Remarks=" + remarks + "",
            success: function (jsData) {
                var month = fngetMonthNumber($('#txtTPMonth').val().split('-')[0]);
                var year = $("#txtTPMonth").val().split('-')[1].toString();
                fnBindTPAppliedStatus(month, year, "", "");
                fnBindTPAppliedStatus(month, year, "1", "");
                fnBindTPCount(month, year);
                fnMsgAlert('success', 'TP Approval', 'Tour planner aproved successfully');
                HideModalPopup('dvLoading');
            }
        });
    }
}
//function to unapprove
function fnUnApprove(obj) {
    debugger;
    ShowModalPopup('dvLoading');
    var tdStatus = obj.id.replace('imgUnApprove_', 'tdTpStatus_');
    if ($("#" + tdStatus).html() == "Unapproved") {
        fnMsgAlert('info', 'Info', 'You cannot unapprove the Unapproved TP.');
        HideModalPopup('dvLoading');
        return false;
    }

    var tp = obj.id.replace('imgUnApprove_', 'hdnTpid_')
    var tpId = $("#" + tp).val();

    var remarksId = obj.id.replace('imgUnApprove_', 'txtRemarks_');
    var remarks = $("#" + remarksId).val();
    if ($.trim(remarks) == "") {
        fnMsgAlert('info', 'Info', 'Please enter remarks for unapprove');
        HideModalPopup('dvLoading');
        return false;
    }

    if (!fnChkSplCharForRemarks(remarksId)) {
        var specialChar = "(/[~`/\''^&$<>?*+!|#%=\\]/g)";
        fnMsgAlert('info', 'Info', 'Special characters <b>' + specialChar + '</b> are not allowed in the remarks.');
        HideModalPopup('dvLoading');
        return false;
    }
    else {
        $.ajax({
            type: "POST",
            url: 'TourPlanner/TPStatusChange',
            data: "TPId=" + tpId + "&Status=0&Remarks=" + remarks + "",
            success: function (jsData) {
                var month = fngetMonthNumber($('#txtTPMonth').val().split('-')[0]);
                var year = $("#txtTPMonth").val().split('-')[1].toString();
                fnBindTPAppliedStatus(month, year, "", "");
                fnBindTPAppliedStatus(month, year, "1", "");
                fnBindTPCount(month, year);
                fnMsgAlert('success', 'TP Approval', 'Tour planner unapproved successfully');
                HideModalPopup('dvLoading');
            }
        });
    }
}
//function to approve bulk
function fnBulkApprove(status) {
    ShowModalPopup('dvLoading');
    var tbllength = $("#tblTPApproval tr").length;
    var tpIds = "";
    var remarks = "";
    var cnt = 0;
    for (var i = 0; i < tbllength; i++) {
        if ($("#chk_" + i).attr('checked')) {
            cnt++;
            var tpId = $("#hdnTpid_" + i).val();
            var remark = $("#txtRemarks_" + i).val();
            var tpStatus = $("#tdTpStatus_" + i).html();

            tpIds += "tpid_" + cnt + "=" + tpId + "&";
            remarks += "tpremarks_" + cnt + "=" + remark + "&";

            if (status == "0") {
                if (tpStatus == "Unapproved") {
                    fnMsgAlert('info', 'Info', 'You cannot unapprove the unapproved TP');
                    HideModalPopup('dvLoading');
                    return false;
                }
                if ($.trim(remark) == "") {
                    fnMsgAlert('info', 'Info', 'Please enter remarks for unapprove');
                    HideModalPopup('dvLoading');
                    return false;
                }

                if (!fnChkSplCharForRemarks(("txtRemarks_") + i)) {
                    var specialChar = "(/[~`/\''^&$<>?*+!|#%=\\]/g)";
                    fnMsgAlert('info', 'Info', 'Special characters <b>' + specialChar + '</b> are not allowed in the remarks.');
                    HideModalPopup('dvLoading');
                    return false;
                }
            }
            else if (status == "1") {
                if (tpStatus == "Approved") {
                    fnMsgAlert('info', 'Info', 'You cannot approve the approved TP');
                    HideModalPopup('dvLoading');
                    return false;
                }
                if (!fnChkSplCharForRemarks(("txtRemarks_") + i)) {
                    var specialChar = "(/[~`/\''^&$<>?*+!|#%=\\]/g)";
                    fnMsgAlert('info', 'Info', 'Special characters <b>' + specialChar + '</b> are not allowed in the remarks.');
                    HideModalPopup('dvLoading');
                    return false;
                }
            }
        }
    }
    if (cnt == 0) {
        fnMsgAlert('info', 'Info', 'Please select tour planner to approve/unapprove');
        HideModalPopup('dvLoading');
        return false;
    }


    var datas = tpIds + remarks + "&Status=" + status + "&Count=" + cnt + "";
    $.ajax({
        type: "POST",
        url: 'TourPlanner/TPBulkStatusChange',
        data: datas,
        success: function (jsData) {
            var month = fngetMonthNumber($('#txtTPMonth').val().split('-')[0]);
            var year = $("#txtTPMonth").val().split('-')[1].toString();
            fnBindTPAppliedStatus(month, year, "", "");
            fnBindTPAppliedStatus(month, year, "1", "");
            fnBindTPCount(month, year);
            if (status == "1") {
                fnMsgAlert('success', 'TP Approval', 'Tour planner aproved successfully');
            }
            else {
                fnMsgAlert('success', 'TP Approval', 'Tour planner unaproved successfully');
            }
            HideModalPopup('dvLoading');
        }
    });

}

function fnSelectall(obj) {
    if ($(obj).attr('checked')) {
        $('.case').attr('checked', true);
    } else {
        $('.case').attr("checked", false);
    }

}

// show history details
function fnShowHistory(UserCode, TP_Date) {

    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        data: "UserCode=" + UserCode + "&TP_Date=" + TP_Date,
        url: 'TourPlanner/GetTPHistory',
        success: function (response) {
            if (response != "" && response != null) {
                if (response.split('^')[0] != "FAIL") {

                    var tphistory = eval('(' + response + ')');
                    var tbl_TpHistory = tphistory.Tables[0].Rows;
                    var his_html = "<table class='table'><thead><tr><td>TP Date</td><td>TP Submitted Date</td><td>Action</td><td>Action By</td><td>Date of Action</td><td>Reason for Action</td></thead>";
                    for (var i = 0; i < tbl_TpHistory.length; i++) {
                        his_html += "<tr><td>" + tbl_TpHistory[i].Tp_date + "</td>";
                        his_html += "<td>" + tbl_TpHistory[i].Tp_Entered_Date + "</td>";
                        his_html += "<td>" + tbl_TpHistory[i].Tp_Action + "</td>";
                        his_html += "<td>" + tbl_TpHistory[i].Action_By + "</td>";
                        his_html += "<td>" + tbl_TpHistory[i].Date_of_Action + "</td>";
                        his_html += "<td>" + tbl_TpHistory[i].Unapprove_Reason + "</td></tr>";
                    }
                    if (tbl_TpHistory.length > 0)
                        $("#dvTPHistorySub").html(his_html);
                    else
                        $("#dvTPHistorySub").html("<div class='col-lg-12'>No History found for this tp.</div>");
                    $("#dvTpHistory").overlay().load();
                    $("#dvAccordion").accordion({
                        collapsible: true,
                        active: false
                    });
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

// show tp product details
function fnOpenTPProductHistory(headerTranID, tpDoctorId) {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        data: "headerTranID=" + headerTranID + "&tpDoctorId=" + tpDoctorId,
        url: 'TourPlanner/GetTPProductHistory',
        success: function (response) {
            if (response != "" && response != null) {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvTPHistorySub").html(response);
                    $("#dvTpHistory").overlay().load();
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
// Get Month val();
function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEB") {
        return 2;
    }
    if (monthName.toUpperCase() == "MAR") {
        return 3;
    }
    if (monthName.toUpperCase() == "APR") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 6;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCT") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC") {
        return 12;
    }
}

function fnMonthName() {
    var month = new Array(12);
    month[1] = "Jan";
    month[2] = "Feb";
    month[3] = "Mar";
    month[4] = "Apr";
    month[5] = "May";
    month[6] = "Jun";
    month[7] = "Jul";
    month[8] = "Aug";
    month[9] = "Sep";
    month[10] = "Oct";
    month[11] = "Nov";
    month[12] = "Dec";
    return month[parseInt(curdate.split('.')[1])];
}

function fngetMonthNumberFromArray(monthName) {
    if (monthName.toUpperCase() == "1") {
        return "JAN";
    }
    if (monthName.toUpperCase() == "2") {
        return "FEB";
    }
    if (monthName.toUpperCase() == "3") {
        return "MAR";
    }
    if (monthName.toUpperCase() == "4") {
        return "APR";
    }
    if (monthName.toUpperCase() == "5") {
        return "MAY";
    }
    if (monthName.toUpperCase() == "6") {
        return "JUN";
    }
    if (monthName.toUpperCase() == "7") {
        return "JUL";
    }
    if (monthName.toUpperCase() == "8") {
        return "AUG";
    }
    if (monthName.toUpperCase() == "9") {
        return "SEP";
    }
    if (monthName.toUpperCase() == "10") {
        return "OCT";
    }
    if (monthName.toUpperCase() == "11") {
        return "NOV";
    }
    if (monthName.toUpperCase() == "12") {
        return "DEC";
    }
}

var tpApproveStatus = "";

function fnGetUsers() {
    debugger;
    $("#divloading").show();
    $("#divIndication").hide();
    $("#divUserInfo").html("");
    $("#divUserHeader").hide();
    $("#divUserInfo").hide();
    $('#tree').show();
    $('#dvShowHideTree').show();
    if ($("#txtTPMonth").val() == "") {
        fnMsgAlert('info', 'Info', 'Please select Month & Year');
        $("#divloading").hide();
        return false;
    }

    $("#divMain").hide();
    $("#dvTPApp").html("");
    $('#spnName').html('');
    //get the all users from tree
    var userCodes = "";
    var month = "";
    var year = "";

    month = fngetMonthNumber($('#txtTPMonth').val().split('-')[0]);
    year = $('#txtTPMonth').val().split('-')[1];
    var tpStatus = $("#ddlStatus option:selected").val();
    tpApproveStatus = tpStatus;

    $('#hdnMonth').val($('#txtTPMonth').val());
    $('#hdnStatus').val(tpStatus);

    $('#hdnStatusName').val($("#ddlStatus option:selected").text());

    var selectedDivisionCode = $('#ddlDivision option:selected').val();
    var userSelection = $("#ddlSelection option:selected").val();
    $('#hdnUserSelection').val(userSelection);
    //get the applied users
    $.ajax({
        type: "POST",
        url: 'TourPlanner/GetTPSelectedUsers',
        data: 'month=' + month + '&year=' + year + '&tpStatus=' + tpStatus + '&selection=' + userSelection + '&divisionCodes=' + selectedDivisionCode,
        success: function (result) {
            if (result != "") {
                $("#divUserInfo").html(result);
                $("#divUserHeader").show();
                $("#divUserInfo").show();
                $("#divloading").hide();
                $("#divIndication").show();
                var monthYear = month + "-" + year;
            }
            else {
                $("#divloading").hide();
            }

        }
    });

    if ($("#ddlStatus option:selected").text().toUpperCase() == "ALL")
        $("#btnSummary").hide();
    else
        $("#btnSummary").show();
}

function fnGetTPDetails(val) {
    $("#spnName").html("");
    month = fngetMonthNumber($('#txtTPMonth').val().split('-')[0]);
    year = $('#txtTPMonth').val().split('-')[1];
    $('#divMain').show();
    $("#dvTPApp").show();
    $("#hdnUserCode").val(val.split('|')[0]);
    $('#hdnUserName').val(val.split('|')[1]);
    $("#spnName").html("<div>Tour Planner Approval - " + val.split('|')[1] + " : for " + $('#hdnMonth').val() + " , TP Status : " + $('#hdnStatusName').val() + "</div>");
    var selectedstatusName = $("#ddlStatus option:selected").text().toUpperCase();
    var is_consolidated = "";
    if (selectedstatusName == "ALL")
        is_consolidated = "1";
    fnBindTPAppliedStatus(month, year, "", is_consolidated);
    summary_Data_g = 0;
    // $("#dvSummaryTable").hide();
    // $("#btn_summary_Expanded").val("Show Summary  - click to expand")GetTpconsolidatedReport;
    $("#btnSummary").hide();
    $("#divConsolidate").show();
    $("#dvSummaryTable").html('');
    $("#dvSummary").hide();
    if (selectedstatusName != "ALL")
        fnGetSummarDetails();
    var userCode = val.split("|")[0];
    fnGetUserPrivileges(userCode);
}

function fnGetSummarDetails() {
    if (summary_Data_g != 0) {
        if ($("#divConsolidate").css('display') == 'block') {
            $("#divConsolidate").slideUp();
            $("#btn_summary_Expanded").val("Show Summary - Click to Expand");
            $("#btn_SummaryTable_Expanded").val("Show TP Details - Click to Expand");
            $("#dvSummaryTable").slideUp();
        }
        else {
            $("#divConsolidate").slideDown();
            $("#btn_summary_Expanded").val("Hide Summary - Click to Collapse");
        }
    }
    if (summary_Data_g == 0) {
        month = fngetMonthNumber($('#txtTPMonth').val().split('-')[0]);
        year = $('#txtTPMonth').val().split('-')[1];
        fnBindTPAppliedStatus(month, year, "1", "1");
        summary_Data_g = 1;
        $("#btnSummary").show();
        $("#divConsolidate").show();
        $("#dvSummary").show();
        $("#dvSummaryTable").hide();
        $("#btn_summary_Expanded").val("Hide Summary - Click to Collapse");
        $("#btn_SummaryTable_Expanded").val("Show TP Details - Click to Expand");
    }

}
function fnshowTpDetails() {
    if ($("#dvSummaryTable").css('display') == "none") {
        $("#btn_SummaryTable_Expanded").val("Hide TP Details - Click to Collapse");
        $("#dvSummaryTable").slideDown();
    }
    else {
        $("#btn_SummaryTable_Expanded").val("Show TP Details - Click to Expand");
        $("#dvSummaryTable").slideUp();
    }
}
function fnGetUserPrivileges(userCode) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/Master/GetPrivilegesByUser',
        data: "UserCode=" + userCode + "",
        async: false,
        success: function (response) {
            userPrivilege_g = response;

            //Get the user information all the page events fired from here
            //fnGetuserInfo(userCode);
        },
        error: function (e) {
        }
    });
}

function fnGetPrivilegeVal(privilegeName, defaultValue) {
    if (userPrivilege_g != null) {
        if (privilegeName != "") {
            var selectedValue = jsonPath(userPrivilege_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
            if (selectedValue != null && selectedValue.length > 0) {
                defaultValue = selectedValue[0].PrivilegeValue;
            }
        }
    }
    return defaultValue;
}

function fnChkSplCharForRemarks(id) {
    if ($("#" + id).val() != "") {
        var specialCharregex = new RegExp(/[~`/\''^&$<>?""*+!|#%=\\]/g);
        if (specialCharregex.test($("#" + id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}


