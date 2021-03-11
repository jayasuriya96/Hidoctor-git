//toggle tree
//Newly added for restrict the special characters in DCR and it's related approval Remarks field


var MarketingCampaignAprrovalList = '';
var Campaign_Status = "";
var restrictedSpecialchar_g = "/\+^%$#@!~{}'><=";
var approvalScreen = "";
var leave_policy = "";
var ALLOW_ONLY_LEAVE = "NO";
var privilege_g = "";
function fnCheckRemarksSpecialCharforDCRinBlurfun(id) {
    if ($(id).val() != "") {
        var specialCharregexfordcr = new RegExp(/[~`^$&<>\\]/g);
        if (specialCharregexfordcr.test($(id).val())) {
            fnMsgAlert('info', 'Info', 'Special characters <b>( ~`^&$<>\ )</b> are not allowed in the remarks.');
            return false;
        }
        else {
            return true;
        }
        //var specialCharregexfordcr = new RegExp(/^[a-zA-Z0-9-_.?,;:&*()[\] ]+$/);
        //if (!specialCharregexfordcr.test($(id).val())) {
        //    fnMsgAlert('info', 'Information', 'Please Remove the following special characters ' + restrictedSpecialchar_g + '');
        //    return false;
        //}
        //else {
        //    return true;
        //}
    }
    else {
        return true;
    }
}
function fnviewsurvey(URL) {
    debugger;
    $("#dvReportTwo").addClass('addzindex');
    $("#dvReportTwo").removeClass('removezindex');
    //var subdomainName = '';
    //var Survey_User_Assignment_Id = 0;
    //var Survey_Publish_Group_Id = 0;
    var qeyString = URL;
    $("#mySurveyViewModal").show();
    $("#surveyviewbody").html('<iframe src=' + qeyString + ' id="isurvey" style="width:100%;height:500px;"></iframe>');
}
function fnsurveyresponseclose() {
    debugger;
    $("#mySurveyViewModal").hide();
    $("#dvReportTwo").removeClass('addzindex');
    $("#dvReportTwo").addClass('removezindex');

}
function fnCMEclose() {
    debugger;
    $("#dvCME").hide();
    $("#dvReportTwo").removeClass('addzindex');
    $("#dvReportTwo").addClass('removezindex');

}
function fnOpenTree() {
    $("#usertree").slideDown();
    $("#imggr").hide();
    $("#imgless").show()
    $('#divleft').addClass('col-lg-3')
    $('#dataDiv').removeClass('col-lg-12')
    $('#dataDiv').addClass('col-lg-9')
    $('#dataDiv').addClass('col-lg-8')

    if ($('#dvMonth') != null) {
        $('#dvMonth').css('display', '');
    }
}
function fnCloseTree() {
    $("#usertree").slideUp();
    $("#imggr").show();
    $("#imgless").hide()
    $('#divleft').removeClass('col-lg-3')
    $('#dataDiv').addClass('col-lg-12')
    $('#dataDiv').removeClass('col-lg-9')
    $('#dataDiv').removeClass('col-lg-8')
    if ($('#dvMonth') != null) {
        $('#dvMonth').css('display', 'none');
    }
}

function fnClosePopUp(id) {
    $("#" + id).overlay().close();
}

/************************************ DCR LOCK RELEASE ***************************/

function fnRootNodeDisable() {
    debugger;
    $("#usertree").dynatree("getRoot").visit(function (node) {
        if (node.data.key == userCode_g) {
            node.activate = false;
        }
    });
}
function fnBindActivityLockData(userCode) {
    debugger;
    var Content = '';
    $("#dvuserHeaderDetails").html('');
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/EmployeeDetails',
        data: 'user_Code=' + $("#hdnUserCode").val(),
        success: function (response) {
            debugger;
            Content += "<table class='table table-bordered'>";
            Content += "<thead style='#5E87B0 !important'>";
            Content += "<tr>";
            Content += "<th style='width:48%;'>User Details</th>";
            Content += "<th>Reporting Manager Details</th>";
            Content += "</tr>";
            Content += "</thead>";
            Content += "<tbody>";
            Content += "<tr>";
            Content += "<td><b>Employee Name</b>: " + response[0].Employee_Name + "</td>";
            Content += "<td><b>Employee Name</b>: " + response[0].Manager_Emp_Name + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>User Name</b>: " + response[0].User_Name + "</td>";
            Content += "<td><b>User Name</b>: " + response[0].Manager_Name + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>Region Name</b>: " + response[0].Region_Name + "</td>";
            Content += "<td><b>Region Name</b>: " + response[0].Manager_Region_Name + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>Designation</b>: " + response[0].User_Type_Name + "</td>";
            Content += "<td><b>Designation</b>: " + response[0].Manager_Type_Name + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>Date Of Joining</b>: " + response[0].DOJ + "</td>";
            Content += "<td><b>Date Of Joining</b>: " + response[0].Manager_Date_Of_Joining + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>HiDoctor Start Date</b>: " + response[0].HiDOCTOR_Start_Date + "</td>";
            Content += "<td><b>HiDoctor Start Date</b>: " + response[0].HSD + "</td>";
            Content += "</tr>";
            Content += "</tbody>";
            Content += "</table>";
            $("#dvuserHeaderDetails").append(Content);
        }

    });
}

function fnBindLockDetails(userCode) {
    debugger;
    var Content = '';
    
    $('#dvLockDetails').html('');
    $.ajax({
        type: 'GET',
        url: '../HiDoctor_Master/Approval/GetLockDetails',
        data: 'userCode=' + userCode ,
        success: function (result) {
            debugger;
            Content += "<table class='table table-bordered'>";
            Content += "<thead style='#5E87B0 !important'>";
            Content += "<tr>";
            Content += "<th style='width:100%'>Lock Details</th>";
            Content += "</tr>";
            Content += "</thead>";
            Content += "</table>";
            Content += "<table class='table table-bordered'>";
            Content += "<thead style='#5E87B0 !important'>";
            Content += "<tr>";
            Content += "<th style='width:32%;'>Active Locks</th>";
            Content += "<th style='width:33%;'>Released Locks</th>";
            Content += "<th style='width:33%;'>Total Locks</th>";
            Content += "</tr>";
            Content += "</thead>";
            Content += "<tr>";
            Content += "<td><b>" + result[0].Active_Locks + "</b></td>";
            Content += "<td><b>" + result[0].Released_Locks + "</b></td>";
            Content += "<td><b>" + result[0].Total_Locks + "</b></td>";
            Content += "</tr>";
            Content += "</table>";
            $('#dvLockDetails').append(Content);
        }
    });
}


function fnReleasetheDCRLock() {
    debugger;
    var checkboxchecked = false;
    var privcheck = '';
    var dcrLockLeaveRelease = '';
    var dcrDCRActualDate = ''
    var release_Reson = "";
    var dcrLockedDate = '';
    var userCode = ''
    var lockType = 'LOCK LEAVE';
    var leaveType='1'
    var lockleavedate = fnGetLockedandDCRDate(lockType)
    if (lockleavedate.length > 1 && lockleavedate != true) {
        checkboxchecked = true;
        //if (privcheck.length > 1) {
        //    privcheck==1
        //}

        //privcheck == 0
       
        dcrLockedDate = lockleavedate.split('~')[0];
        dcrDCRActualDate = lockleavedate.split('~')[1];
        release_Reson = lockleavedate.split('~')[2];
        privcheck = lockleavedate.split('~')[3];
        //  alert($("#hdnUserCode").val() + '^' + dcrDCRActualDate + '^' + dcrLockedDate + '^' + "LOCK_LEAVE");
        fnReleasetheLock("LOCK_LEAVE", dcrLockedDate, dcrDCRActualDate, release_Reson, privcheck);
    }


    lockType = 'IDLE DCR';
    var data = fnGetLockedandDCRDate(lockType)
    dcrLockedDate = '';
    dcrDCRActualDate = '';
    if (data.length > 1 && data != true) {
        checkboxchecked = true;
        dcrLockedDate = data.split('~')[0];
        dcrDCRActualDate = data.split('~')[1];
        release_Reson = data.split('~')[2];
        //alert($("#hdnUserCode").val() + '^' + dcrDCRActualDate + '^' + dcrLockedDate + '^' + lockType);
        fnReleasetheLock("IDLE_DCR", dcrLockedDate, dcrDCRActualDate, release_Reson);
    }
    if (!checkboxchecked && lockleavedate != true && data != true) {
        fnMsgAlert('info', 'DCR Lock Release', 'Please select one row for lock release.');
    }
}

function fnGetselectedPrivileges() {
    debugger;
    var userCode = $("#hdnUserCode").val();
    $.ajax({
        type: 'POST',
        url: '../Master/fnGetselectedAllPrivileges',
        data: "user_Code=" + userCode,
        async: false,
        success: function (response) {
            // we have the response
            privilege_g = response;
        }
        });
}
function fnBindLockedData(showSuccessMsg) {

    debugger;
    Privilege_Value_Name = '';
    var priValue = fnGetselectedPrivileges("ALLOW_ONLY_LEAVE_IN_DCR", "NO")
   
    var list = '';
    var list = $.grep(privilege_g, function (v) {
        return v.PrivilegeName == 'ALLOW_ONLY_LEAVE_IN_DCR' && v.PrivilegeValue == 'YES';
    });
    if (list.length != 0) {
        priValue = "YES"
    }
    else {

        priValue = "NO"

    }
        

    //if (privilege_g.length != 0) {
    //    for (var i = 0; i < privilege_g.length; i++) {

    //        if (privilege_g[i].Privilege_Name == 'ALLOW_ONLY_LEAVE' && privilege_g[i].Privilege_Value_Name == 'YES') {

    //            priValue = "YES"
    //        }

    //    }
    //}
    //else {
    //    priValue = "NO"
    //}
    // fngetreportedmanagers();
    if (isClickonTab) {
        fnGetDateList();
    }
    $("#dvReleasefilter").hide();
    $("#dvlockfilter").show();
    $("#dvlockedReleaseDataGrid").hide();
    $("#dvlockedDataGrid").show();
    $("#dvlockedDataGrid").html('');
    //var status = val;
    var FromDate = "";
    var ToDate = "";
    var FromDateNew = '';
    var ToDateNew = '';


    FromDate = $('#dvfromdatefltr').val();
    ToDate = $('#dvtodatefltr').val();
   var FromDate1 = FromDate.split('/')[2] + '-' + FromDate.split('/')[1] + '-' + FromDate.split('/')[0];
   var ToDate1 = ToDate.split('/')[2] + '-' + ToDate.split('/')[1] + '-' + ToDate.split('/')[0];
    var Sart_Date = new Date(FromDate1)
    var End_Date = new Date(ToDate1)
 
        if (Sart_Date > End_Date) {
        fnMsgAlert('info', 'Dcr Lock Release', 'To date should be greater than From date');
        return false;
    }

    if (FromDate != "" && FromDate != null && FromDate != undefined) {
        FromDate = FromDate.split('/')[2] + '-' + FromDate.split('/')[1] + '-' + FromDate.split('/')[0];
        FromDateNew = new Date(FromDate);
    }
    if (ToDate != "" && ToDate != null && ToDate != undefined) {
        ToDate = ToDate.split('/')[2] + '-' + ToDate.split('/')[1] + '-' + ToDate.split('/')[0];
        ToDateNew = new Date(ToDate);
    }


    //if (FromDateNew > ToDateNew) {
    //    fnMsgAlert('info', 'DCR Lock Release', 'From date can  not be Greater  than To date.');

    //}
    //if (!showSuccessMsg) {
    //    /*$('#warningmessage').css('display', 'none');
    //    $('#warningmessage').html('');
    //    $('#successmsg').css('display', 'none');
    //    $('#successmsg').html('');
    //    $('#errormsg').css('display', 'none');
    //    $('#errormsg').html('');*/
    //}

    $.ajax({
        type: 'POST',
        data: "user_Code=" + $("#hdnUserCode").val() + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Privilegevalue=" + priValue,
        url: '../Approval/GetLockedData',
        success: function (response) {
            debugger;

            if (response.indexOf('table') > -1) {
                $("#dvlockedDataGrid").show();
                $('#dvlockedDataGrid').html(response);
                $('#btnRelease').css('display', '');

            }
            else {
                $("#dvlockedDataGrid").show();
                $('#dvlockedDataGrid').html(response);
                $('#btnRelease').css('display', 'none');
                //$("#dvlockedReleaseDataGrid").hide();
            }
            //        if (response.length > 0) {
            //            $('#btnRelease').css('display', '');
            //            var grid = new ej.grids.Grid({
            //                dataSource: response,
            //                showColumnChooser: true,
            //                allowPaging: true,
            //                allowGrouping: true,
            //                allowSorting: true,
            //                allowFiltering: true,
            //                allowResizing: true,
            //                allowCellMerging: true,
            //                allowEditing: true,
            //                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
            //                allowScrolling: true,
            //                pageSettings: { pageSize: 100, pageSizes: [20, 40, 60, 80, 100], pageCount: 5 },
            //                filterSettings: { type: 'CheckBox' },
            //                toolbar: ['Search', 'ColumnChooser'],
            //                // rowSelected: fnRowSelected,                   
            //                aggregates: [],
            //                columns: [
            //                     { type: "checkbox", template: "<input type='checkbox' class='check' />", isPrimaryKey: true, width: 150, textAlign: 'center' },
            //                      { field: 'User_Name', headerText: 'User Name', isPrimaryKey: true, width: 150, textAlign: 'center' },
            //                      { field: 'Locked_Date', headerText: 'Locked Date', isPrimaryKey: true, width: 150, textAlign: 'center' },
            //                      { field: 'DCR_Actual_Date', headerText: 'DCR Date', isPrimaryKey: true, width: 200, textAlign: 'center' },
            //                      { field: 'Lock_Status', headerText: 'Lock Status', isPrimaryKey: true, width: 200, textAlign: 'center' },
            //                      { field: 'Lock_Type', headerText: 'Lock Type', isPrimaryKey: true, width: 200, textAlign: 'center' },
            //                      { field: 'Request_Released_By', headerText: 'Request Released By', editType: 'dropdownedit', edit: { params: { popupHeight: '300px' } }, width: 200, textAlign: 'center' },
            //                      { field: 'Released_Reason', headerText: 'Released Reason', isPrimaryKey: true, template: "<textarea>", width: 200, textAlign: 'center' },



            //                ],
            //             // queryCellInfo: queryCellInfo,


            //            });
            //            grid.appendTo('#dvlockedDataGrid');
            //            fnCheckOrUncheckRowsCheckbox();
            //          //  fngetreportedmanagers();
            //        }

            //        else {
            //            ('#dvlockedDataGrid').Append("<span>No Lock Details Found.</span>");
            //            $('#btnRelease').css('display', 'none');
            //        }

            //    },
            //    error: function (e) {
            //        fnMsgAlert('Error', 'DCR Lock Release', e.responseText);
        }
    });


}
function queryCellInfo(args) {
    debugger;

    if (args.column.field == "Request_Released_By") {
        if (args.cell.innerHTML == '<select id="selectuser"></select>') {
            fngetreportedmanagers();
        }



    }
}
var Json_Response = '';
function fngetreportedmanagers() {
    debugger;
    var content = '';
    var reporteduser = $("#hdnUserCode").val();
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetReportedMangers',
        type: "POST",
        data: "UserCode=" + reporteduser,
        success: function (JsonResult) {
            responsereport = JsonResult;
            Json_Response = eval('(' + responsereport + ')');
            //content += '<option>--select--</option>';
            //debugger;
            //for (var i = 0; i < Json_Response.length; i++) {

            //    content += ("<option value=" + Json_Response[i].User_Code + ">" + Json_Response[i].User_Name + "</option>");

            //}
            //$('#ddluser_code_' + i + '').append(content)

        }
    });
}
var PageNumber = '1';
var total = '';
function fnDCRLockReleasePagination() {
    debugger;
    var userCode = $("#hdnUserCode").val();
    if (userCode == currentUserCode_g) {
        $("#dataDiv").hide();
        fnMsgAlert('info', 'Info', 'You cannot release the lock for yourself');
        return false;
    }
    else {
        $("#dataDiv").show();
    }
    total = '';
    var PageSize = '10';
    $.blockUI('#mainpagination');
    $("#dvlockedDataGrid").hide();
    $("#dvlockedReleaseDataGrid").hide();
    $("#btnRelease").hide();
    $.ajax({
        type: 'POST',
        data: "user_Code=" + $("#hdnUserCode").val() + "&PageNumber=" + PageNumber + "&PageSize=" + PageSize,
        url: '../Approval/GetDCRLockRelease',
        success: function (response) {
            total = response.Totalcount;
            //for (var i = 0; i < response.lstDCRLock.length; i++) {
            //    if (response.lstDCRLock[i].Lock_Type == "IDLE_DCR") {
            //        debugger;
            //        fngetActualDate($("#hdnUserCode").val(), response.lstDCRLock[i].LockDate);
            //    }
            //}
            fnBindActivityLockData(userCode);
            fnBindLockDetails(userCode);
            fnBindLockedData();
            //fnBindRelaeseData(userCode);
            //  fnBindActivityLockData(response);
        },
        error: function (e) {

        },
        complete: function (response) {
            debugger;
            if (total > 0) {
                if (PageNumber == 1) {
                    var jData = JSON.parse(response.responseText)
                    $('#Release-Pagination').pagination({
                        items: jData.Totalcount,
                        itemsOnPage: 10,
                        hrefTextPrefix: 'javascript:getDetailForRelease(',
                        hrefTextSuffix: ');',
                        cssStyle: 'light-theme'
                    });
                }
                total = '';
            }
            else {
            }
            $.unblockUI('#mainpagination');
            total = '';
        }

    });
}

function fnGetDateList() {
    debugger;
    var today = new Date();
    var cdd = ("0" + today.getDate()).slice(-2);
    var cmm = today.getMonth() + 1;
    cmm = ("0" + cmm).slice(-2);
    var cyy = today.getFullYear();
    var currentDate = cdd + '/' + cmm + '/' + cyy;
    today.setDate(today.getDate() - 60);
    var pdd = ("0" + today.getDate()).slice(-2);
    var pmm =  today.getMonth() + 1;
    pmm = ("0" + pmm).slice(-2);
    var pyy = today.getFullYear();
    var prevDate = pdd + '/' + pmm + '/' + pyy;

    $('#dvfromdate').val('');
    $('#dvtodate').val('');
    $('#dvfromdatefltr').val(prevDate);
    $('#dvtodatefltr').val(currentDate);

}


function getDetailForRelease(pageNumber) {
    PageNumber = pageNumber;
    fnDCRLockReleasePagination();
}


function fnDCRLockReleaseTable(response) {
    debugger;

    var tblsfadcrlock = '';
    if (response.lstDCRLock.length > 0) {
        tblsfadcrlock += "<table cellspacing='0' cellpadding='0' id='tblDcrLockRelease' class='data display datatable dataTable' width='100%'>";
        tblsfadcrlock += "<thead>";
        tblsfadcrlock += "<tr>";
        tblsfadcrlock += "<th>Locked Date</th>";
        tblsfadcrlock += "<th>Release Date</th>";
        tblsfadcrlock += "<th>DCR Actual Date</th>";
        tblsfadcrlock += "<th>Lock Type</th>";
        tblsfadcrlock += "<th>Released By</th>";
        tblsfadcrlock += "<th>Request Released By</th>";
        tblsfadcrlock += "<th>Released Reason</th>";
        tblsfadcrlock += "</tr></thead>"

        for (var i = 0; i < response.lstDCRLock.length; i++) {
            tblsfadcrlock += "<tr>";
            tblsfadcrlock += "<td>" + response.lstDCRLock[i].Locked_Date + "</td>";
            tblsfadcrlock += "<td>" + response.lstDCRLock[i].Released_Date + "</td>";
            tblsfadcrlock += "<td>" + response.lstDCRLock[i].DCR_Actual_Date + "</td>";
            tblsfadcrlock += "<td>" + response.lstDCRLock[i].Lock_Type + "</td>";
            tblsfadcrlock += "<td>" + response.lstDCRLock[i].Released_By + "</td>";
            tblsfadcrlock += "<td>" + response.lstDCRLock[i].Request_Released_By + "</td>";
            tblsfadcrlock += "<td>" + response.lstDCRLock[i].Released_Reason + "</td>";
            tblsfadcrlock += "</tr>";
        }
        $('#Release-Pagination').show();
    }
    else {
        tblsfadcrlock = "<p>No Release Details found</P>"
        $('#Release-Pagination').hide();
    }
    $('#tbl_pagination').html(tblsfadcrlock);

}
var ActualDate = '';
function fngetActualDate(UserCode, LockedDate) {
    debugger;
    ActualDate = '';
    $.ajax({
        type: 'POST',
        data: "User_Code=" + UserCode + "&Locked_Date=" + LockedDate,
        url: '../Approval/GetActualDateforLock',
        async: false,
        success: function (data) {
            debugger;
            if (data.length > 0) {
                ActualDate = data[0].Actual_Date;
            }
            else {
                ActualDate = '';
            }
        },
        error: function (ex) {
        }
    });
}

function fnBindRelaeseData(val) {
    debugger;
    //if (isClickonTab) {
    //    fnGetDateList();
    //}

    $("#dvlockfilter").hide();
    $("#dvReleasefilter").show();
    $("#btnRelease").hide();
    $("#dvlockedDataGrid").hide();
    $('#dvlockedReleaseDataGrid').html("");
    var status = val;
    var FromDate = "";
    var ToDate = "";
    //$("#dvlockfilter").show();
    FromDate = $('#dvfromdate').val();
    ToDate = $('#dvtodate').val();
    if (FromDate != "" && FromDate != null && FromDate != undefined) {
        FromDate = FromDate.split('/')[2] + '-' + FromDate.split('/')[1] + '-' + FromDate.split('/')[0];
    }
    if (ToDate != "" && ToDate != null && ToDate != undefined) {
        ToDate = ToDate.split('/')[2] + '-' + ToDate.split('/')[1] + '-' + ToDate.split('/')[0];
    }
    if ($('#dvfromdate').val() == "" && $('#dvtodate').val() != "") {
        fnMsgAlert('info', 'Dcr Lock Release', 'Please Select  From Date.');
        return false;
    }
    if ($('#dvfromdate').val() != "" && $('#dvtodate').val() == "") {
        fnMsgAlert('info', 'Dcr Lock Release', 'Please Select  To Date.');
        return false;
    }

    if (FromDate > ToDate) {
        fnMsgAlert('info', 'Dcr Lock Release', 'To date should be greater than From date');
        return false;
    }



    var showmore = "";
    if (status == 1) {
        showmore = "SHOWMORE";
    }
    else {
        showmore = "";
    }
    $.ajax({
        type: 'POST',
        data: "user_Code=" + $("#hdnUserCode").val() + "&showMore=" + showmore + "&FromDate=" + FromDate + "&ToDate=" + ToDate,
        url: '../Approval/GetlockReleaseData',
        success: function (response) {
            //$('#dvlockedReleaseDataGrid').html(response);

            //$('#dvlockedReleaseDataGrid').html('');
            if (response.length > 0) {
                var grid = new ej.grids.Grid({
                    dataSource: response,
                    showColumnChooser: true,
                    allowPaging: true,
                    allowGrouping: true,
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    allowCellMerging: true,
                    allowScrolling: true,
                    pageSettings: { pageSize: 100, pageSizes: [20, 40, 60, 80, 100], pageCount: 5 },
                    filterSettings: { type: 'CheckBox' },
                    toolbar: ['Search', 'ColumnChooser'],
                    // rowSelected: fnRowSelected,                   
                    aggregates: [],
                    columns: [
                            { field: 'Locked_Date', headerText: 'Locked Date', width: 150, textAlign: 'center' },
                            { field: 'Released_Date', headerText: 'Released Date', width: 150, textAlign: 'center' },
                            { field: 'DCR_Actual_Date', headerText: 'DCR Actual Date', width: 200, textAlign: 'center' },
                            { field: 'Lock_Type', headerText: 'Lock Type', width: 200, textAlign: 'center' },
                             { field: 'Released_By', headerText: 'Released By', width: 200, textAlign: 'center' },
                            { field: 'Request_Released_By', headerText: 'Request Released By', width: 200, textAlign: 'center' },
                            { field: 'Released_Reason', headerText: 'Released Reason', width: 200, textAlign: 'center' },



                    ],
                    //queryCellInfo: queryCellInfo,


                });
                grid.appendTo('#dvlockedReleaseDataGrid');
            }
            else {
                // ('#dvlockedReleaseDataGrid').Append("<span>No Lock Details Found.</span>");
                $('#dvlockedReleaseDataGrid').html("No release Details Found.");
            }
            $("#dvlockedReleaseDataGrid").show();

        },
        error: function (e) {
            fnMsgAlert('Error', 'DCR Lock Release', e.responseText);
        }


    });

}
var isClickonTab = false;
function fnFlagCreation() {
    isClickonTab = true;
}
function fnDCRLockFilter() {
    debugger;
    var FromDate = "";
    var ToDate = "";

    FromDate = $('#dvfromdatefltr').val();
    ToDate = $('#dvtodatefltr').val();

    if ($.trim($('#dvfromdatefltr').val()) == "") {
        fnMsgAlert('info', 'Dcr Lock Release', 'Please Select  From Date.');
        return false;
    }
    if ($.trim($('#dvtodatefltr').val()) == "") {
        fnMsgAlert('info', 'Dcr Lock Release', 'Please Select  To Date.');
        return false;
    }


    //if (FromDate > ToDate) {
    //    fnMsgAlert('info', 'Dcr Lock Release', 'To date should be greater than From date');
    //    return false;
    //}
    //if ($('#dvfromdatefltr').val() == "" || dvfromdatefltr == null || dvfromdatefltr == undefined)) {
    //    fnMsgAlert('info',  'Please select From Date');
    //}

    //else if ($(dvtodatefltr == "" || dvtodatefltr == null || dvtodatefltr == undefined)) {
    //    fnMsgAlert('info', 'Please select To Date');
    //}
    //else{
    var result = true;
    if ($("#dvlockedDataGrid").is(":visible") == true) {
        isClickonTab = false;
        fnBindLockedData();
    }
    else {
        isClickonTab = false;
        FromDate = $('#dvfromdate').val();
        ToDate = $('#dvtodate').val();
        if ($.trim($('#dvfromdate').val()) == "") {
            fnMsgAlert('info', 'Dcr Lock Release', 'Please Select  From Date.');
            return false;
        }
        if ($.trim($('#dvtodate').val()) == "") {
            fnMsgAlert('info', 'Dcr Lock Release', 'Please Select  To Date.');
            return false;
        }
        fnBindRelaeseData();


    }
    //FromDate = $('#dvfromdatefltr').val();
    //ToDate = $('#dvtodatefltr').val();
    //if (FromDate = "" && FromDate = null && FromDate = undefined) {
    //    FromDate = FromDate.split('/')[2] + '-' + FromDate.split('/')[1] + '-' + FromDate.split('/')[0];
    //}
    //if (ToDate != "" && ToDate != null && ToDate != undefined) {
    //    ToDate = ToDate.split('/')[2] + '-' + ToDate.split('/')[1] + '-' + ToDate.split('/')[0];
    //}

}
function fnCheckOrUncheckRowsCheckbox() {
    debugger;
    if ($('#hdrCheckBox').attr('checked') == 'checked') {
        $.each($('.table tbody tr  input'), function (index, value) {
            ($('#rowcheckbox_' + (index + 1)).attr('checked', 'checked'))
        });
    }
    else {
        $.each($('.table tbody tr  input'), function (index, value) {
            ($('#rowcheckbox_' + (index + 1)).attr('checked', false))
        });

    }
}

function fnCheckOrUncheckHeaderRow() {
    var allCheckBoxChecked = true;
    $.each($('.table tbody tr  input'), function (index, value) {
        if (($('#rowcheckbox_' + (index + 1)).attr('checked')) == null) {
            $('#hdrCheckBox').attr('checked', false)
            allCheckBoxChecked = false;
            return false;
        }

    });
    if (allCheckBoxChecked) {
        $('#hdrCheckBox').attr('checked', true);
    }
}
function fnCheckorUncheck() {
    debugger;
    if ($('#prvCheckBox').attr('checked') == 'checked') {
        $.each($('.table tbody tr  input'), function (index, value) {
            ($('#rowcheck_' + (index + 1)).attr('checked', 'checked'))
        });
    }
    else {
        $.each($('.table tbody tr  input'), function (index, value) {
            ($('#rowcheck_' + (index + 1)).attr('checked', false))
        });

    }
}


function fnCheckOrUncheckHeader() {
    var allCheckBoxChecked = true;
    $.each($('.table tbody tr  input'), function (index, value) {
        if (($('#rowcheck_' + (index + 1)).attr('checked')) == null) {
            $('#pvrCheckBox').attr('checked', false)
            allCheckBoxChecked = false;
            return false;
        }

    });
    if (allCheckBoxChecked) {
        $('#hdrCheckBox').attr('checked', true);
    }
}

function fnReleasetheLock(lock_Type, locked_date, dcr_Actual_Date, release_Reson, privcheck) {
    debugger;
    $.ajax({
        type: 'POST',
        data: "user_Code=" + $("#hdnUserCode").val() + "&lock_Type=" + lock_Type + "&locked_Date=" + locked_date + '&dcr_Actual_Date=' + dcr_Actual_Date + "&Request_Released_By=" + release_Reson + "&Privilegevalue=" + privcheck,
        url: '../Approval/UpdateDCRLockToRelease',
        success: function (response) {
            if (response == "-1") {
                fnMsgAlert('success', 'DCR Lock Release', 'DCR Lock Released Successfully!');
                fnBindLockedData();
                //fnBindRelaeseData(0);
                //fnDCRLockReleasePagination();
            }
            else {
                fnMsgAlert('success', 'DCR Lock Release', response);
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', e.responseText);
        }
    });
}

function fnGetLockedandDCRDate(lock_Type) {
    debugger;
    var dcrLockedDate = ''
    var dcrDCRActualDate = ''
    var reason = "";
    var privcheck = "";
    var error = false;
    $.each($('.table tbody tr  input'), function (index, value) {
        if (error != true) {
            if (($('#rowcheckbox_' + (index + 1)).attr('checked')) == "checked"
                && $('#spnLockType_' + (index + 1)).html().toUpperCase() == lock_Type) {
                var lockdate = $('#spnlockedDate_' + (index + 1)).html()
                var dcrdate = $('#spnDcrActualDate_' + (index + 1)).html();
               // var privcheck = $('#rowcheck_' + (index + 1)).attr('checked') == "checked";
                if ($.trim(lockdate).length > 0) {
                    lockdate = lockdate.split('/')[1] + '/' + lockdate.split('/')[0] + '/' + lockdate.split('/')[2]
                    dcrLockedDate += lockdate + '^';
                }
               
                if ($.trim(dcrdate).length > 0) {
                    dcrdate = dcrdate.split('/')[1] + '/' + dcrdate.split('/')[0] + '/' + dcrdate.split('/')[2]
                    dcrDCRActualDate += dcrdate + '^';
                }
                var dcrdate = $('#spnDcrActualDate_' + (index + 1)).html();
                dcrdate = dcrdate.split('/')[1] + '/' + dcrdate.split('/')[0] + '/' + dcrdate.split('/')[2]
                if ($("#txtReason_" + (index + 1)).val().trim() == '') {
                    fnMsgAlert('info', 'info', 'Enter the Released Reason for DCR Date ' + $('#spnDcrActualDate_' + (index + 1)).html());
                    error = true;
                    dcrLockedDate = '';
                    dcrDCRActualDate = '';
                    reason = '';
                    // return false;
                }
                if ($("#ddluser_code_" + (index + 1)).val() == '0') {
                    fnMsgAlert('info', 'info', 'Select the Released By name for DCR Date ' + $('#spnDcrActualDate_' + (index + 1)).html());
                    error = true;
                    dcrLockedDate = '';
                    dcrDCRActualDate = '';
                    reason = '';
                    //return false;
                }
                
                var details = $("#txtReason_" + (index + 1)).val() + "$" + $("#ddluser_code_" + (index + 1)).val() + "$" + dcrdate;
                if (reason == '' && details != '')
                    reason = details;
                else
                    reason += '@' + details;

                if ($('#rowcheck_'+(index + 1)).attr('checked') == "checked") {
                    privcheck = '1';

                }
                else {
                    privcheck = '0';
                }
            }
        }
    });
    if ($.trim(dcrLockedDate).length == 0 && $.trim(dcrDCRActualDate).length == 0 || $.trim(reason).length == 0) {
        if (error)
            return error;
        else
            return "";
    }
    else {
        return dcrLockedDate + '~' + dcrDCRActualDate + "~" + reason + '@' + "~" + privcheck;
    }
   
}
/************************************ END: DCR LOCK RELEASE ***************************/
//********************************** DELETE DCR *****************************//
function fnShowDeleteDCR() {
    if (fnValidateDeleteDCR()) {
        var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
        var year = $('#txtMonth').val().split('-')[1];
        var dcrFlag = $("#ddlFlagDeleteDCR").val();
        var dcrStatus = $("#ddlStatus").val();

        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/Approval/GetDCRDetailsForDelete',
            data: 'userCode=' + $('#hdnUserCodeDeleteDCR').val() + '&month=' + month + '&year=' + year + '&dcrFlag=' + dcrFlag + '&dcrStatus=' + dcrStatus,
            success: function (response) {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvContent").html(response);
                    $("#main").unblock();
                }
                else {
                    fnMsgAlert('info', 'Delete DCR', "Error: " + response.split('^')[1]);
                    $("#main").unblock();
                    return false;
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error1.' + e.Message);
                $("#main").unblock();
            }
        });

    }
}

function fnDeleteDCR() {
    if ($("input:checkbox[name=dcrDelete]:checked").length == 0) {
        fnMsgAlert('info', 'Delete DCR', 'Please select any DCR.');
        return false;
    }

    if (confirm('Dear ' + $("#spnUser").html().split('(')[0] + ',Please note that, all expenses will be deleted for the selected activity. If any daily expenses were entered in the activity that will also be deleted. To claim expenses that were deleted, resubmit the activity with relevant expenses. ')) {

        var selectedDCR = "";
        $("input:checkbox[name=dcrDelete]:checked").each(function () {
            selectedDCR += $(this).val() + '^';
        });

        var selectedDCRForQueue = "";
        $("input:checkbox[name=dcrDelete]:checked").each(function () {
            selectedDCRForQueue += $(this).val() + '~';
        });


        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/Approval/DCRDelete',
            data: 'userCode=' + $('#hdnUserCodeDeleteDCR').val() + '&selectedDCR=' + selectedDCR + '&dcrStatus=' + $("#ddlStatus").val() + '&selectedDCRForQueue=' + selectedDCRForQueue,
            success: function (response) {

                if (response.split('^')[0] != "FAIL") {
                    if (response.split('^')[0] == "SUCCESS") {
                        if ($.trim(response.split('^')[1]).length > 0 || $.trim(response.split('^')[2]).length > 0) {
                            var dates = response.split('^')[1];
                            dates = dates.replace(/\|/g, ',');
                            dates = dates.slice(0, -1);

                            var cantDeleteDays = response.split('^')[2];
                            cantDeleteDays = cantDeleteDays.replace(/\|/g, ',');
                            cantDeleteDays = cantDeleteDays.slice(0, -1);

                            if (dates != "" && cantDeleteDays != "") {
                                fnMsgAlert('info', 'Delete DCR', "Unable to delete DCRs for " + dates + ". These dates has Activity Lock. Release the Activity Lock then delete the DCR. And also unable to delete DCRs for " + dates + ", Since you have no enough leave balance.");
                            }
                            else if (dates != "") {
                                fnMsgAlert('info', 'Delete DCR', "Unable to delete DCRs for " + dates + ". These dates has Activity Lock. Release the Activity Lock then delete the DCR.");
                            }
                            else if (cantDeleteDays != "") {
                                fnMsgAlert('info', 'Delete DCR', "Unable to delete DCRs for " + dates + ", Since you have no enough leave balance.");
                            }

                        }
                        else {
                            fnMsgAlert('success', 'Delete DCR', 'DCRs deleted successfully.');
                        }
                        fnShowDeleteDCR();
                        HighlightTree();
                        $("#main").unblock();
                    }
                    else {
                        fnMsgAlert('info', 'Delete DCR', response);
                        $("#main").unblock();
                    }
                }
                else {
                    fnMsgAlert('info', 'Delete DCR', "Error: " + response.split('^')[1]);
                    $("#main").unblock();
                    return false;
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error1.' + e.Message);
                $("#main").unblock();
            }
        });
    }

}

function fnValidateDeleteDCR() {

    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Delete DCR', 'Please select month.');
        return false;
    }

    var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
    month = ((month <= 9) ? "0" + month : month);
    var year = $('#txtMonth').val().split('-')[1];
    var seletedDate = new Date(year + '-' + month + '-01');
    var todayDate = new Date(curdate.split('.')[2] + '-' + curdate.split('.')[1] + '-01');
    //if (seletedDate > todayDate) {
    //    fnMsgAlert('info', 'Delete DCR', 'You cannot select future month DCRs.');
    //    return false;
    //}
    return true;
}

function fnOpenUserPerDayFromDCR(userCode, dcrDate, flag, userName) {
    var username = $('#hdnUserName').val()
    $("#dvUserPerDay").html("");
    $("#dvUserPerDay").load('../HiDoctor_Reports/Reports/UserPerDayReport/?userCode=' + userCode + '&dcrDate=' + dcrDate + '&flag=' + flag + '&userName=' + escape(username));

    ShowModalPopup('dvReportTwo');
}


function HighlightTree() {
    if (fnValidateDeleteDCR()) {
        var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
        var year = $('#txtMonth').val().split('-')[1];
        var dcrFlag = $("#ddlFlagDeleteDCR").val();
        var dcrStatus = $("#ddlStatus").val();

        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/Approval/HighlightTree',
            data: 'userCode=' + $('#hdnUserCodeDeleteDCR').val() + '&month=' + month + '&year=' + year + '&dcrFlag=' + dcrFlag + '&dcrStatus=' + dcrStatus,
            success: function (response) {
                if (response != null && response != "") {
                    var jDCR = eval('(' + response + ')')
                    ssss = jDCR;
                    if (jDCR !== undefined && jDCR != null) {
                        $("#usertree").dynatree("getRoot").visit(function (node) {
                            var users = jsonPath(jDCR, "$.[?(@.User_Code=='" + node.data.key + "')]");
                            if (users.length > 0) {
                                $(node.span).addClass('tree-node-active');
                            }
                            else {
                                $(node.span).removeClass('tree-node-active');
                            }
                        });
                    }
                }
                $("#main").unblock();
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error1.' + e.responseText);
                $("#main").unblock();
            }
        });
    }
}
//********************************** DELETE DCR *****************************//

/***************************** START: Notice Board Approval ********************/
function fnRootNodeDisableOrEnable() {
    var priValue = fnGetPrivilegeValue('SELF_APPROVAL_NEEDED_SCREENS', '')
    if (priValue.indexOf('NOTICE') == -1) {
        $("#usertree").dynatree("getRoot").visit(function (node) {
            if (node.data.key == userCode_g) {
                node.activate = false;
            }
        });
    }
}


function fnGetNotices(showSuccessMessage) {
    if (!showSuccessMessage) {
        $('#errormsg').html('')
        $('#errormsg').css('display', 'none');
        $('#warningmessage').html('')
        $('#warningmessage').css('display', 'none');
        $('#successmsg').css('display', 'none');
        $('#successmsg').html('');
    }
    var priValue = fnGetPrivilegeValue('SELF_APPROVAL_NEEDED_SCREENS', '')
    if (priValue.toUpperCase().indexOf('NOTICE') == -1) {
        priValue = 'NO';
    }
    else {
        priValue = 'YES';
    }
    var selected_User_Code = $("#hdnUserCode").val().length == 0 ? "" : $("#hdnUserCode").val();
    $.ajax({
        type: 'POST',
        data: "selected_User_Code=" + selected_User_Code + "&Self_Approval_Pri_Value=" + priValue,
        url: '../Approval/GetNoticesForApprovalAndUnapproval',
        success: function (response) {
            if (response.indexOf('table') > -1) {
                $('#dvNoticeDataGrid').html(response);
                $('#btnDiv').css('display', '');
            }
            else {
                $('#dvNoticeDataGrid').html(response);
                $('#btnDiv').css('display', 'none');
            }
            $('#dvNoticeAppr').unblock();
        },
        error: function (e) {
            $('#dvNoticeAppr').unblock();
            fnMsgAlert('Error', 'Notice Approval', e.responseText);
            //$('#errormsg').html('OOPS! ' + e.responseText)
            //$('#errormsg').css('display', '');
        }
    });
}

function fnChangeStatus(status) {
    var msg_Codes = fnGetSelectedMsgCodes();

    // validation
    if ($.trim(msg_Codes).length == 0) {
        fnMsgAlert('info', 'Notice Approval', 'Please select one row for ' + status + '.');
        //$('#warningmessage').html('Please select one row for ' + status + '.')
        //$('#warningmessage').css('display', '');
        //$('#successmsg').css('display', 'none');
        //$('#successmsg').html('');
        //$('#errormsg').css('display', 'none');
        //$('#errormsg').html('');
        return false;
    }

    $.ajax({
        type: 'POST',
        data: "msg_Codes=" + msg_Codes + "&status=" + status,
        url: '../Approval/ChangeStatusForNotices',
        success: function (response) {
            if (response == -1) {
                fnMsgAlert('success', 'Notice Approval', 'Notice(s) ' + status + 'd Successfully!');
                //$('#successmsg').css('display', '');
                //$('#successmsg').html('Notice(s) ' + status + ' Successfully!');
                //$('#errormsg').html('')
                //$('#errormsg').css('display', 'none');
                //$('#warningmessage').html('')
                //$('#warningmessage').css('display', 'none');
                fnGetNotices(true)
            }
            else {
                fnMsgAlert('Error', 'Notice Approval', response);
                //$('#errormsg').html('OOPS! ' + response)
                //$('#errormsg').css('display', '');
                //$('#warningmessage').html('')
                //$('#warningmessage').css('display', 'none');
                //$('#successmsg').css('display', 'none');
                //$('#successmsg').html('');
            }
        },
        error: function (e) {
            fnMsgAlert('Error', 'Notice Approval', e.responseText);
            //$('#errormsg').html('OOPS! ' + e.responseText)
            //$('#errormsg').css('display', '');
            //$('#warningmessage').html('')
            //$('#warningmessage').css('display', 'none');
            //$('#successmsg').css('display', 'none');
            //$('#successmsg').html('');

        }
    });
}

function fnGetSelectedMsgCodes() {
    var msg_Codes = '';
    $.each($('.table tbody tr  input'), function (index, value) {
        if (($('#rowcheckbox_' + (index + 1)).attr('checked')) == "checked") {
            var msgCode = $('#spnMsgCode_' + (index + 1)).html()
            if ($.trim(msgCode).length > 0) {
                msg_Codes += msgCode + '^';
            }

        }
    });
    return msg_Codes;
}
/***************************** END: Notice Board Approval ********************/


// Get Month val();
function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN" || monthName.toUpperCase() == "JANUARY") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEB" || monthName.toUpperCase() == "FEBRUARY") {
        return 2;
    }
    if (monthName.toUpperCase() == "MAR" || monthName.toUpperCase() == "MARCH") {
        return 3;
    }
    if (monthName.toUpperCase() == "APR" || monthName.toUpperCase() == "APRIL") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUN" || monthName.toUpperCase() == "JUNE") {
        return 6;
    }
    if (monthName.toUpperCase() == "JUL" || monthName.toUpperCase() == "JULY") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUG" || monthName.toUpperCase() == "AUGUST") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEP" || monthName.toUpperCase() == "SEPTEMBER") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCT" || monthName.toUpperCase() == "OCTOBER") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV" || monthName.toUpperCase() == "NOVEMBER") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC" || monthName.toUpperCase() == "DECEMBER") {
        return 12;
    }
}

//SRISUDHAN//
//SFC APPROVAL//
var sfcdata_g


function fnSFCApprovalfillGrid() {
    $.blockUI();
    if ($('#ddlstatus option:selected').val() == "") {
        fnMsgAlert('info', 'SFC APPROVAL', 'Please Select Status.');
        $.unblockUI();
        return false;
    }
    var status = $("#ddlstatus option:selected").val();
    var regionCode = $('#hdnRegionCode').val()
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/GetRegionSFCRecord',
        data: "regionCode=" + regionCode + "&status=" + status,
        success: function (result) {

            if (result != '') {
                $("#dvTable").html(result);
                if (result == "No data found.") {
                    $('#btnApprove').hide();
                    $('#spnInfo').hide();
                    $('#btnUnapprove').hide();
                }
                else {
                    $('#btnApprove').show();
                    $('#spnInfo').show();
                    $('#btnUnapprove').show();
                }
                $.unblockUI();
            }
            $.unblockUI();
            //else {
            //    $("#dvTable").html("NO DATA FOUND");
            //    $.unblockUI();
            //    $('#btnApprove').hide();
            //    $('#btnUnapprove').hide();
            //   // fnMsgAlert('info', 'SFC APPROVAL', 'No data found');
            //}

        }
    });
}

//check box//
//select all check box function//
function fnselectall() {
    if ($('#bulkcheck').is(":checked")) {
        $("input:checkbox[name=chk_SFC]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chk_SFC]").removeAttr('checked');
    }
}
//approve sfc//
function fnSFCApprove() {
    debugger;
    $('#lblmessage').html("");
    if (!$("input[name='chk_SFC']").is(":checked")) {
        fnMsgAlert('info', 'SFC APPROVAL', 'Please select alteast one SFC');
        return false;
    }
    $.blockUI();
    var dfcCode = ""
    $("input:checkbox[name=chk_SFC]").each(function () {
        if (this.checked) {
            dfcCode += "" + $(this).val() + "^";
        }
    });
    var regionCode = $('#hdnRegionCode').val() + "^";
    var mode = "APPROVE";
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/SFCBulkApproval',
        data: "regionCode=" + regionCode + "&dfcCode=" + dfcCode + "&mode=" + mode,
        success: function (result) {
            if (result == "APPROVED") {
                $('#lblmessage').html("Approved Sucessfully");
            }
            else {
                $('#lblmessage').html("");
            }
            $.unblockUI();
            // fnClearall()
            fnSFCApprovalfillGrid()
        }

    });
    $.unblockUI();
}

function fnSFCUnapprove() {
    $('#lblmessage').html("");
    if (!$("input[name='chk_SFC']").is(":checked")) {
        fnMsgAlert('info', 'SFC APPROVAL', 'Please select alteast one SFC');
        return false;
    }
    $.blockUI();
    var dfcCode = ""
    $("input:checkbox[name=chk_SFC]").each(function () {
        if (this.checked) {
            dfcCode += "" + $(this).val() + "^";
        }
    });
    var mode = "UNAPPROVE";
    var regionCode = $('#hdnRegionCode').val() + "^";
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/SFCBulkUnapproval',
        data: "regionCode=" + regionCode + "&dfcCode=" + dfcCode + "&mode=" + mode,
        success: function (result) {
            sfcdata_g = result;
            if (result == "UNAPPROVED") {
                $('#lblmessage').html("Unapproved Sucessfully");
            }
            else {
                $('#lblmessage').html("Since the selected SFC is used in CP/TP/DCR, you are not able to unapprove the selected SFC. <a href='#' onclick='showDetailsTable();'>Click here</a> to see more details");
            }
            $.unblockUI();
            // fnClearall()
            fnSFCApprovalfillGrid()
        }
    });
    $.unblockUI();
}

//show popup
function showDetailsTable() {
    $.blockUI();
    $("#divModel").html(sfcdata_g);
    $("#dvOverlay").overlay().load();
    $.unblockUI();
}

function fnClearall() {
    $("input:checkbox[name=chk_SFC]").removeAttr('checked');
    $("input:checkbox[name=bulkchk_sfc]").removeAttr('checked');
    $('#lblmessage').html("");
}

/***************************** START: Marketin Campaign Approval ********************/
function fnMarketingCampaignApprovalFillGrid(value) {
    debugger;
    Campaign_Status = '';
    var disjson = '';
    if (value != "" && value != undefined) {
        Campaign_Status = value;
    }
    else {
        Campaign_Status = $("#ddlStatus option:selected").val();
    }
    $.blockUI();
    if ($('#ddlStatus option:selected').val() == "SM") {
        fnMsgAlert('info', 'Info', 'Please Select Status.');
        $.unblockUI();
        return false;
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/GetMarketingCampaignsForARegion',
        data: "approvalStatus=" + value,
        success: function (result) {
            MarketingCampaignAprrovalList = result;
            //if (Campaign_Status != "" && Campaign_Status != "2,1,0") {
            //    disjson = jsonPath(MarketingCampaignAprrovalList.lstMCHeader, "$.[?(@.Record_Status=='" + Campaign_Status + "')]");
            //    fnBindMarketingCampaignHTML(disjson);
            //    $.unblockUI();
            //}
            //else {
            //    disjson = MarketingCampaignAprrovalList.lstMCHeader;
            //    fnBindMarketingCampaignHTML(disjson);
            //    $.unblockUI();
            //}
            fnBindMarketingCampaignHTML(result);
        },

    });
}
function fnGetDetails(value) {
    debugger;
    Campaign_Status = '';
    var disjson = '';
    var resp = [];
    if (value != "" && value != undefined) {
        Campaign_Status = value;
    }
    else {
        Campaign_Status = $("#ddlStatus option:selected").val();
    }
    $.blockUI();
    if ($('#ddlStatus option:selected').val() == "SM") {
        fnMsgAlert('info', 'Info', 'Please Select Status.');
        fnBindMarketingCampaignHTML(resp);
        $.unblockUI();
        return false;
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/GetMarketingCampaignsForARegion',
        data: "approvalStatus=" + value,
        success: function (result) {
            MarketingCampaignAprrovalList = result;
            fnBindMarketingCampaignHTML(result);
        },
    });
}
function fnBindMarketingCampaignHTML(resp) {
    debugger;
    var content = '';
    var rowIndex = 0;
    var condt = false;
    var Privilege = '';
    // var resp = '';


    content += "<div  class='table-responsive'><table class='table table-striped' id='tblMC' cellspacing='0' cellpadding='0' style='text-align:center;'>";
    content += "<thead style='text-align:center;'>";
    content += "<tr>";
    content += "<th class='chkbx' id='idchkbx'><input type='checkbox' id='marketbulkChk' name='bulkChk_Market' onclick='fnCheckAll();' /></th>";
    content += "<th class='apprv' id='apprvid'>Approve</th>";
    content += "<th class='unapprv' id='unapprvid'>Unapprove</th>";
    content += "<th class='rmrks'>Remarks</th>";
    content += "<th style='width:20%;'>Campaign Name</th>";
    content += "<th>Region Name</th>";
    content += "<th>Employee Name</th>"
    content += "<th>Start Date</th>";
    content += "<th>End Date</th>";
    content += "<th>Customer Selection</th>";
    content += "<th>Campaign Based On</th>";
    content += "<th>Customer Count</th>";
    // content += "<th>Applicable Region Types</th>";
    content += "<th>Details</th>";
    content += "<th>Campaign Frequency</th>";
    content += "<th>Status</th>";
    content += "</tr>";
    content += "</thead>";
    content += "<tbody>";
    if (resp.length >= 1) {
        for (var i = 0; i < resp.length; i++) {
            rowIndex++;
            var Campaign_Code = resp[i].Campaign_Code;

            content += "<tr id='tr_" + rowIndex + "'>";

            if (resp[i].Record_Status == 2) {
                content += "<td class='chkbx'><input type='checkbox' id='chk_Marketcampaign' value=" + resp[i].Campaign_Code + "|" + resp[i].Record_Status + " name='chk_Marketcampaign' /></td>";
                content += "<td class='td-a apprv'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png' onclick='fnMarketingcampaignApprovedStatus(\"" + resp[i].Campaign_Code + "|" + resp[i].Record_Status + "|" + rowIndex + "\");'></td>";
                content += "<td  class='td-a unapprv'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' onclick='fnMarketingcampaignUnApprovedStatus(\"" + resp[i].Campaign_Code + "|" + resp[i].Record_Status + "|" + rowIndex + "\");'></td>";
                content += "<td class='rmrks'><textarea rows='4' style='resize:none;'maxlength='500' id='unapprvrmrks" + rowIndex + "'></textarea></td>";
            }
            else if (resp[i].Record_Status == 1) {
                var privilege = fnGetPrivilegeValue("CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF", "");
                if (privilege.length > 3) {
                    Privilege = privilege.split(',');
                }
                if (Privilege.length >= 1) {
                    for (var k = 0; k < Privilege.length; k++) {
                        if (Privilege[k].toUpperCase() == "MC") {
                            condt = true;
                        }
                    }
                } else if (Privilege.length == 0 && privilege != '') {
                    if (privilege.toUpperCase() == "MC") {
                        condt = true;
                    }
                }
                if (condt == true) {
                    content += "<td class='chkbx'><input type='checkbox' id='chk_Marketcampaign' value=" + resp[i].Campaign_Code + "|" + resp[i].Record_Status + " name='chk_Marketcampaign' /></td>";
                    content += '<td class="td-a apprv"></td>';
                    content += "<td  class='td-a unapprv'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' onclick='fnMarketingcampaignUnApprovedStatus(\"" + resp[i].Campaign_Code + "|" + resp[i].Record_Status + "|" + rowIndex + "\");'></td>";
                    content += "<td class='rmrks'><textarea rows='4' style='resize:none;'maxlength='500' id='unapprvrmrks" + rowIndex + "'></textarea></td>";
                    //content += "<td  class='td-a unapprv'><a onclick='fnMarketingcampaignUnApprovedStatus(\"" + resp[i].Campaign_Code + "\",\"" + resp[i].Record_Status + "\");'>Unapprove</a></td>";
                } else {
                    content += '<td  class="chkbx"></td>';
                    content += '<td class="td-a apprv"></td>';
                    content += "<td  class='td-a unapprv'></td>";
                    content += "<td class='rmrks'></td>";
                }
            } else if (resp[i].Record_Status == 0) {
                content += '<td class="chkbx"></td>';
                content += "<td class='td-a apprv'></td>";
                content += '<td  class="td-a unapprv"></td>';
                content += '<td class="rmrks"></td>';
            }
            content += "<td style='text-align:left;white-space:normal;word-wrap:break-word;word-break:break-word;'>" + resp[i].Campaign_Name + "</td>";
            content += "<td>" + resp[i].Region_Name + "</td>";
            content += "<td>" + resp[i].Employee_Name + "</td>"
            content += "<td>" + resp[i].Start_Date + "</td>";
            content += "<td>" + resp[i].End_Date + "</td>";
            content += "<td>" + resp[i].Doctor_Product_Mapping_Validation + "</td>";
            if (resp[i].Campaign_Based_On == 1) {
                content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Region</td>";
            } else {
                content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Role</td>";
            }
            content += "<td>" + resp[i].Customer_Count + "</td>";

            content += "<td style='cursor: pointer;text-decoration: underline;color: blue; text-align:center' Onclick='fnViewMCDetails(\"" + resp[i].Campaign_Code + "\");'>View Details</td>";
            if (resp[i].Campaign_Frequency == 1) {
                content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Monthly</td>";
            } else if (resp[i].Campaign_Frequency == 2) {
                content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Quarterly</td>";
            } else if (resp[i].Campaign_Frequency == 3) {
                content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Half-Yearly</td>";
            } else if (resp[i].Campaign_Frequency == 4) {
                content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Yearly</td>";
            } else {
                content += '<td>-</td>';
            }
            if (resp[i].Record_Status == 1) {
                content += "<td id='apprvd'>Approved</td>";
            } else if (resp[i].Record_Status == 2) {
                content += "<td id='appld'>Applied</td>";
            }
            else if (resp[i].Record_Status == 0) {
                content += "<td id='unapprvd'>UnApproved</td>";
            }
            content += "</tr>";
        }
        content += "</tbody></table>";
        $('#button').show();
        $('#formhdn').hide();
        if (Campaign_Status != "2,1,0") {
            $('#btnApprove').show();
            $('#btnUnapprove').show();
            $('#spnInfo').show();
        } else if (Campaign_Status == 1) {
            $('#btnApprove').hide();
            $('#btnUnapprove').hide();
            $('#spnInfo').hide();
        } else {
            $('#btnApprove').hide();
            $('#btnUnapprove').hide();
            $('#spnInfo').hide();
        }
    }
    else {
        //$('#formhdn').show();
        //content = '';
        if (Campaign_Status == 2 || Campaign_Status == 1 || Campaign_Status == "SM") {
            content += '<tr><td colspan="14" style="text-align:center;font-style:italic;font-weight:bold;">No Record(s) Found.</td></tr>'
        } else {
            content += '<tr><td colspan="10" style="text-align:center;font-style:italic;font-weight:bold;">No Record(s) Found.</td></tr>'
        }
        $('#button').hide();
    }
    $('#dvMarketingcampaignApproval').html(content);
    if (Campaign_Status == "2,1,0" || Campaign_Status == 0) {
        $('#button').hide();
        $('.chkbx').hide();
        $('.apprv').hide();
        $('.unapprv').hide();
        $('.rmrks').hide();
        $('#btnApprove').hide();
        $('#btnUnapprove').hide();
        $('#spnInfo').hide();
    } else if (Campaign_Status == 1) {
        if (condt == true) {
            $('#btnApprove').hide();
            $('#btnUnapprove').show();
            $('#spnInfo').hide();
        } else {
            $('#btnApprove').hide();
            $('#btnUnapprove').hide();
            $('#spnInfo').hide();
        }
    }
    $.unblockUI();
}
function fnViewMCDetails(campaignCode) {
    debugger;
    var campCode = campaignCode;
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    var List_Header = MarketingCampaignAprrovalList;
    var disjson = jsonPath(List_Header, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    $('#MCName').html(disjson[0].Campaign_Name);
    if (disjson[0].Campaign_Description == "" || disjson[0].Campaign_Description == null) {
        var Descr = "No Description for the Campaign.";
        $('#MCDescrp').html(Descr);
        $('#MCDescrp').addClass('descrpcss');
    } else {
        $('#MCDescrp').html(disjson[0].Campaign_Description);
    }
    if (disjson[0].Campaign_Budget == "" || disjson[0].Campaign_Budget == 0 || disjson[0].Campaign_Budget == null) {
        var Descr = "Budget is not Specified.";
        $('#BudgetofCamppop').html(Descr);
        $('#BudgetofCamppop').addClass('descrpcss');
    } else {
        $('#BudgetofCamppop').html(disjson[0].Campaign_Budget);
    }
    $.ajax({
        type: 'GET',
        data: "campaignCode=" + campaignCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetCampaignHeaderDetails',
        success: function (response) {

            fnBindOtherMCDetails(response, campCode);
            //$("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Failed to load details.Please try After Sometime.');
            $("#main").unblock();
        },
        complete: function (e) {
            fnGetProductsDetails(campCode);
        }
    });
}
function fnBindOtherMCDetails(response, campaignCode) {
    debugger;
    var DcCat = "";
    var spCat = "";
    var regionTypes = '';
    var CatgSno = 0;
    var list_Categ = response.lstDocCateg;
    var disjsonCatCode = jsonPath(list_Categ, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    for (var i = 0; i < disjsonCatCode.length; i++) {
        CatgSno++;
        DcCat += '<tr>';
        DcCat += '<td style="min-width:100px">' + CatgSno + '</td>';
        DcCat += '<td style="min-width:168px;">' + disjsonCatCode[i].Doctor_Category_Name + '</td>';
        DcCat += '</tr>';
        //if (i < respCatCode.length - 1) {
        //    DcCat += ',';
        //}
    }
    $('#MCCatCode').html(DcCat);
    var SpecSno = 0;
    var list_Speclty = response.lstSpecCateg;
    var disjsonSpecCode = jsonPath(list_Speclty, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    for (var i = 0; i < disjsonSpecCode.length; i++) {
        SpecSno++;
        spCat += '<tr>';
        spCat += '<td style="min-width:100px">' + SpecSno + '</td>';
        spCat += '<td style="min-width:168px;">' + disjsonSpecCode[i].Doctor_Speciality_Name + '</td>';
        spCat += '</tr>';
        //spCat += disjsonSpecCode[i].Doctor_Speciality_Name;
        //if (i < disjsonSpecCode.length - 1) {
        //    spCat += ',';

        //}
    }
    $('#MCSpecCode').html(spCat);
    var regSno = 0;
    var list_RegTypes = response.lstDesig;
    var disjsonregiontye = jsonPath(list_RegTypes, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    for (var i = 0; i < disjsonregiontye.length; i++) {
        regSno++;
        regionTypes += '<tr>';
        regionTypes += '<td style="min-width:100px">' + regSno + '</td>';
        regionTypes += '<td style="min-width:168px;">' + disjsonregiontye[i].Region_Type_Name + '</td>';
        regionTypes += '</tr>';
        //regionTypes += disjsonregiontye[i].Region_Type_Name;
        //if (i < disjsonregiontye.length - 1) {
        //    regionTypes += ',';
        //}
    }
    $('#MCRegType').html(regionTypes);
    var parregSno = 0;
    var list_parReg = response.lstMCParRegions;
    var disjsonRegionsProd = jsonPath(list_parReg, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    var ParRegions = '';
    for (var i = 0; i < disjsonRegionsProd.length; i++) {
        parregSno++;
        ParRegions += '<tr>';
        ParRegions += '<td style="min-width:100px">' + parregSno + '</td>';
        ParRegions += '<td style="min-width:168px;">' + disjsonRegionsProd[i].Region_Name + '</td>';
        ParRegions += '</tr>';
        //ParRegions += disjsonRegionsProd[i].Region_Name;
        //if (i < disjsonRegionsProd.length - 1) {
        //    ParRegions += ',';
        //}
    }
    $('#MCParReg').html(ParRegions);

}
function fnGetProductsDetails(campaignCode) {
    debugger;
    $.ajax({
        type: 'POST',
        data: "campaignCode=" + campaignCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetProductsSamplebyCampaign',
        success: function (response) {

            fnBindMCProducts(response);
            //$("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Failed to get product details.Please try After Sometime.');
            $("#main").unblock();
        }
    });

}
function fnBindMCProducts(resp) {
    debugger;
    var content = '';
    if (resp.lstProd.length >= 1) {

        for (var i = 0; i < resp.lstProd.length; i++) {
            var Product_Code = resp.lstProd[i].Product_Code;

            content += '<div class="col-lg-12 paddng" id="main_ + i + ">';
            content += '<div class="col-lg-12 paddng" id="Prod_' + i + '">';
            content += '<div class="col-lg-6">';
            content += '<div class="col-lg-12 paddng">';
            content += '<div class="col-lg-6 paddng"><b>Sale Product:</b></div>';
            content += '<div class="col-lg-6 paddng">' + resp.lstProd[i].Product_Name + '</div>';
            content += '</div>';
            content += '</div>';
            content += '<div class="col-lg-6">';
            content += '<div class="col-lg-12 paddng">';
            content += '<div class="col-lg-6 paddng"><b>Expected Sale Increase:</b></div>';
            if (resp.lstProd[i].ROI != 0) {
                content += '<div class="col-lg-4 paddng">' + resp.lstProd[i].ROI + '%</div>';
            } else {
                content += '<div class="col-lg-3">-</div>';
            }
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '<div class="table-responsive Samp" style="padding-top:10px !important;">';
            content += '<table class="table table-striped" id="tblProdPopup" cellspacing="0" cellpadding="0" style="text-align:center;">';
            content += '<thead style="text-align:center;">';
            content += '<tr>';
            content += '<th>Input Type</th>';
            content += '<th style="width:40%  !important;">Sample Products/Activity</th>';
            content += '<th>Visit Order</th>';
            content += '<th>Quantity</th>';
            content += '<th>Start Date</th>';
            content += '<th>Due Date</th>';
            content += '<th>Budget Of Item</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody>';
            var disjson = jsonPath(resp.lstSamp, "$.[?(@.Product_Code=='" + Product_Code + "')]");
            for (var j = 0; j < disjson.length; j++) {

                if (disjson.length >= 1) {
                    if (disjson[j].Input_Type != null) {
                        content += "<tr>";
                        if (disjson[j].Input_Type == "PI") {
                            content += "<td>Promotional</td>";
                        } else if (disjson[j].Input_Type == "A") {
                            content += "<td>Activity</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Input_Type == "PI") {
                            content += "<td style='width:40%  !important;'>" + disjson[j].Product_Name + "</td>";
                        } else {
                            content += "<td style='width:40%  !important;'>" + disjson[j].Activity_Name + "</td>";
                        }
                        if (disjson[j].Quantity != 0) {
                            content += "<td>" + disjson[j].Visit_Order + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Quantity != 0) {
                            content += "<td>" + disjson[j].Quantity + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Start_Date != null && disjson[j].Start_Date != "01/01/1900") {
                            var Start_Date = disjson[j].Start_Date.split(' ')[0];
                            Start_Date = Start_Date.split('/')[1] + '/' + Start_Date.split('/')[0] + '/' + Start_Date.split('/')[2];
                            content += "<td>" + Start_Date + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Due_Date != null && disjson[j].Due_Date != "01/01/1900") {
                            var Due_Date = disjson[j].Due_Date.split(' ')[0];
                            Due_Date = Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0] + '/' + Due_Date.split('/')[2];
                            content += "<td>" + Due_Date + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Line_Item_Budget != "" && disjson[j].Line_Item_Budget != null) {
                            content += "<td>" + disjson[j].Line_Item_Budget + "</td>"
                        } else {
                            content += "<td>-</td>";
                        }

                        content += "</tr>";
                    }
                }
            }
            content += '</tbody></table></div></div>';
        }
    } else {
        content = '';
        content += "<div class='col-lg-12 form-group'>No Product details found for this campaign.</div>";
    }
    $('#divMCProdDetail').html(content);
    $('#dvOverLay').modal('show');
    $('#main').unblock();
}


function fnCheckAll() {
    if ($('#marketbulkChk').is(":checked")) {
        $("input:checkbox[name=chk_Marketcampaign]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chk_Marketcampaign]").removeAttr('checked');
    }
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
// Single Approve
function fnMarketingcampaignApprovedStatus(CampCode) {
    debugger;
    var campaignCode = "";
    var Status = "";
    var statuschange = "";
    var regionCode = $('#hdnRegionCode').val();
    campaignCode = CampCode.split('|')[0];
    Status = CampCode.split('|')[1];
    var rowId = CampCode.split('|')[2];
    var lstUnapproval = [];
    if (Status == 1) {
        fnMsgAlert('info', 'Info', 'This Campaign already Approved.');
        return false;

    }
    else {
        Status = '1';
    }

    var remarks = $('#unapprvrmrks' + rowId).val();
    if (regExforAlphaNumericSpecificRemarks(remarks) == false) {
        fnMsgAlert('info', 'Info', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Remarks.');
        return false;
    } else {


        var ObjunApproveModel = {
            Campaign_Code: campaignCode,
            Record_Status: Status,
            Remarks: remarks
        };
        lstUnapproval.push(ObjunApproveModel);
        var regionCode = $('#hdnRegionCode').val();
        $.blockUI();
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/Approval/MarketingCampaignBulkApproval',
            data: JSON.stringify({ "lstUnApproval": lstUnapproval }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result == "1") {
                    fnMsgAlert('success', 'Success', 'Approved successfully');
                    fnMarketingCampaignApprovalFillGrid(Campaign_Status);
                    //$.unblockUI();
                }
                else {
                    fnMsgAlert('info', 'Caution', 'Insertion Failed');
                    $.unblockUI();
                }
                //$.unblockUI();
            }
        });
    }

}
// Single UnApprove

function fnMarketingcampaignUnApprovedStatus(CampCode) {
    debugger;
    var campaignCode = "";
    var Status = "";
    var statuschange = "";
    var regionCode = $('#hdnRegionCode').val();
    campaignCode = CampCode.split('|')[0];
    var lstUnapproval = [];
    Status = CampCode.split('|')[1];
    var rowId = CampCode.split('|')[2];
    if (Status == 0) {
        fnMsgAlert('info', 'Info', 'This Campaign already UnApproved.');
        return false;
    }
    else {
        status = '0';
    }

    if ($('#unapprvrmrks' + rowId).val() == '') {
        $('#unapprvrmrks' + rowId).addClass("errTxtBox");
        fnMsgAlert('info', 'Info', 'Remarks is mandatory for UnApproval.');
        return false;

    }
    else if (regExforAlphaNumericSpecificRemarks($('#unapprvrmrks' + rowId).val()) == false) {
        $('#unapprvrmrks' + rowId).addClass("errTxtBox");
        fnMsgAlert('info', 'Info', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Remarks.');
        HideModalPopup("dvloading");
        return false;
    }
    else {
        $('#unapprvrmrks' + rowId).removeClass("errTxtBox");
        var regionCode = $('#hdnRegionCode').val();
        var remarks = $('#unapprvrmrks' + rowId).val();
        var ObjunApproveModel = {
            Campaign_Code: campaignCode,
            Record_Status: status,
            Remarks: remarks
        };
        lstUnapproval.push(ObjunApproveModel);
        $.blockUI();
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/Approval/MarketingCampaignBulkApproval',
            data: JSON.stringify({ "lstUnApproval": lstUnapproval }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result == "1") {
                    fnMsgAlert('success', 'Success', 'Unapproved successfully');
                    fnMarketingCampaignApprovalFillGrid(Campaign_Status);
                    //$.unblockUI();
                }
                else {
                    fnMsgAlert('info', 'Caution', 'Insertion Failed');
                    $.unblockUI();
                }
                // $.unblockUI();
            }
        });
    }
}

//Bulk Approval
function fnMarketingcampaignApprovalChangeStatus(status) {
    debugger;
    $('#lblmessage').html("");
    var campaignCode = ""
    var status = "";
    var chkstatus = true;
    var lstUnapproval = [];
    var Status = 1;
    var rowId = 0;
    $("input:checkbox[name=chk_Marketcampaign]").each(function () {
        debugger;
        var ObjApprvModel = {};
        rowId++;
        if (this.checked) {
            campaignCode = $(this).val().split('|')[0];
            status = $(this).val().split('|')[1];
            remarks = $('#unapprvrmrks' + rowId).val();

            if (status == 0) {
                fnMsgAlert('info', 'Info', 'This Campaign already UnApproved.');
                chkstatus = false;
            }
            else if (regExforAlphaNumericSpecificRemarks(remarks) == false) {
                fnMsgAlert('info', 'Info', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Remarks.');
                $('#unapprvrmrks' + rowId).addClass("errTxtBox");
                chkstatus = false;
            } else {
                ObjApprvModel = {
                    Campaign_Code: campaignCode,
                    Record_Status: Status,
                    Remarks: remarks
                };

            }
            lstUnapproval.push(ObjApprvModel);
        }
    });
    if (chkstatus == false) {
        return false;
    }
    if (chkstatus) {
        var regionCode = $('#hdnRegionCode').val()

        if (lstUnapproval.length >= 1) {
            $.blockUI();
            $.ajax({
                type: "POST",
                url: '../HiDoctor_Master/Approval/MarketingCampaignBulkApproval',
                data: JSON.stringify({ "lstUnApproval": lstUnapproval }),
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    if (result != '') {
                        if (!isNaN(result)) {
                            if (parseInt(result) > 0) {
                                fnMsgAlert('success', 'Success', 'Approved successfully');
                                fnMarketingCampaignApprovalFillGrid(Campaign_Status);
                                //$.unblockUI();
                            }
                            else {
                                fnMsgAlert('info', 'Caution', 'Insertion Failed');
                                $.unblockUI();
                            }
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Caution', 'Something went Wrong');
                        $.unblockUI();
                    }
                    // $.unblockUI();
                }
            });
        }
    }
    else {
        fnMsgAlert('info', 'Info', 'This Campaign already Approved.');
    }
}

//Bulk UnApproval
function fnMarketingcampaignUnApprovalChangeStatus(status) {
    $('#lblmessage').html("");
    var campaignCode = ""
    var status = "";
    var remarks = "";
    var chkstatus = true;
    var rowId = 0;
    var lstUnapproval = [];
    var Status = 0;
    $("input:checkbox[name=chk_Marketcampaign]").each(function () {
        debugger;
        rowId++;
        var ObjApprvModel = {};
        if (this.checked) {
            campaignCode = $(this).val().split('|')[0];
            status = $(this).val().split('|')[1];
            remarks = $('#unapprvrmrks' + rowId).val();
            if (status == 0) {
                fnMsgAlert('info', 'Info', 'This Campaign already UnApproved.');
                chkstatus = false;
            } else if (remarks == '') {
                $('#unapprvrmrks' + rowId).addClass("errTxtBox");
                chkstatus = false;
            } else if (regExforAlphaNumericSpecificRemarks($('#unapprvrmrks' + rowId).val()) == false) {
                fnMsgAlert('info', 'Info', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Remarks.');
                $('#unapprvrmrks' + rowId).addClass("errTxtBox");
                chkstatus = false;
            }
            else {
                $('#unapprvrmrks' + rowId).removeClass("errTxtBox");
                ObjApprvModel = {
                    Campaign_Code: campaignCode,
                    Record_Status: Status,
                    Remarks: remarks
                };

            }
            lstUnapproval.push(ObjApprvModel);
        }
    });
    if (chkstatus == false) {
        return false;
    }
    if (chkstatus) {
        var regionCode = $('#hdnRegionCode').val()
        //var status = "0";
        if (lstUnapproval.length >= 1) {
            $.blockUI();

            $.ajax({
                type: "POST",
                url: '../HiDoctor_Master/Approval/MarketingCampaignBulkApproval',
                data: JSON.stringify({ "lstUnApproval": lstUnapproval }),
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    if (result != '') {
                        if (!isNaN(result)) {
                            if (parseInt(result) > 0) {
                                fnMsgAlert('success', 'Success', 'UnApproved successfully');
                                fnMarketingCampaignApprovalFillGrid(Campaign_Status);
                                //$.unblockUI();
                            }
                            else {
                                fnMsgAlert('info', 'Caution', 'Insertion Failed');
                                $.unblockUI();
                            }
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Caution', 'Something went Wrong');
                        $.unblockUI();
                    }
                    //$.unblockUI();
                }
            });
        }
    }
    else {
        fnMsgAlert('info', 'Info', 'This Campaign already UnApproved.');
    }
}

//Bulk Approval
function fnMarketingcampaignApprove() {
    debugger;
    if ($("input:checkbox[name=chk_Marketcampaign]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select atleast one Campaign To Approve or UnApprove');
        return false;
    }
    fnMarketingcampaignApprovalChangeStatus(1);

}

//Bulk UnApproval
function fnMarketingcampaignUnapprove() {
    debugger;
    if ($("input:checkbox[name=chk_Marketcampaign]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select atleast one Campaign To Approve or UnApprove');
        return false;
    }
    fnMarketingcampaignUnApprovalChangeStatus(0);
}

function fnclearall() {
    $("input:checkbox[name=chk_Marketcampaign]").removeAttr('checked');
    $("input:checkbox[name=marketbulkChk]").removeAttr('checked');
    $('#lblmessage').html("");
}

function fnExpand(rowIndex, campaignCode) {
    debugger;
    var RowIndex = rowIndex;
    if ($("#tr_" + rowIndex + "_" + rowIndex).is(":visible")) {
        $("#tr_" + rowIndex + "_" + rowIndex).hide();
    }
    else {
        $("#tr_" + rowIndex + "_" + rowIndex).show();
    }
}

/***************************** END: Marketin Campaign Approval ********************/

/********************************** START CP APPROVAL ************************************************/
function fnCPHeader() {
    $("#divHeader").html("");
    ShowModalPopup("dvloading");
    if ($('#ddlstatus option:selected').val() == "") {
        fnMsgAlert('info', 'CP APPROVAL', 'Please Select Status.');
        HideModalPopup("dvloading");
        return false;
    }
    var status = $("#ddlstatus option:selected").val();
    var regionCode = $('#hdnRegionCode').val()
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/GetCPHeader',
        data: "regionCode=" + regionCode + "&status=" + status,
        success: function (result) {

            if (result != "NO") {
                $("#divHeader").html(result);
                $('#btnApprove').show();
                $('#btnUnapprove').show();
                $('#spnInfo').show();
                HideModalPopup("dvloading");
            }
            else {
                $("#divHeader").html("No  Details Found.");
                HideModalPopup("dvloading");
                $('#btnApprove').hide();
                $('#btnUnapprove').hide();
                $('#spnInfo').hide();
                //fnMsgAlert('info', 'CP APPROVAL', 'No data found');
            }
        }
    });
}

function fnValidateCP(status) {
    var flag = false;
    var isResult = true;
    var remarks = "";

    var selectedStatus = $("#ddlstatus option:selected").val();

    if (selectedStatus == "E") {
        fnMsgAlert('info', 'Info', 'Please select cp status.');
        isResult = false;
        return false;
    }

    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            var id = this.id;
            flag = true;
            remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
            if (status == "0") {
                if ($.trim(remarks).length == 0 || remarks == null) {
                    fnMsgAlert('info', 'Info', 'Please enter remarks');
                    isResult = false;
                    return false;
                }
            }
            var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#@!;{}*-\/,`=?]+$");
            if (remarks != "") {
                if (!specialCharregex.test(remarks)) {
                    fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. ~^+$.please remove the special characters."');
                    isResult = false;
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    });
    if (!flag) {
        fnMsgAlert('info', 'Info', 'Please select atleast one CP');
        isResult = false;
        return false;
    }
    return isResult;
}

function fnCPApprove(status) {

    var cpDetails = "";
    var remarks = "";
    if (fnValidateCP(status)) {

        $("input:checkbox[name=chkSelect]").each(function () {
            if (this.checked) {
                var id = this.id;
                cpDetails += $("#" + id.replace("chkSelect", "hdnCP")).val() + "|";
                remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
                remarks = $.trim(remarks);
                cpDetails += remarks.replace('|', ' ') + "$";
            }
        });

        var regionCode = $('#hdnRegionCode').val()
        var selectedStatus = $("#ddlstatus option:selected").val();
        var selectionType = "MULTI";
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/Approval/UpdateCPStatus',
            data: "regionCode=" + regionCode + "&status=" + status + "&cpDetails=" + cpDetails + "&selection=" + selectionType,
            success: function (result) {
                if (result) {
                    fnMsgAlert('success', 'Success', result);
                    fnCPHeader();
                }
                else if (data == "1") {
                    fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'Insertion Failed');
                }
            }
        });
    }
}

function fnCPChangeStatus(val) {

    var cpDetails = "";
    var remarks = "";
    var cpCode = "";
    var categoryCode = "";
    var cpStatus = "";
    var regionCode = "";
    var status = "";
    var rowNo = 0;
    cpCode = val.split('|')[0];
    categoryCode = val.split('|')[1];
    cpStatus = val.split('|')[2];
    regionCode = val.split('|')[3];
    rowNo = parseInt(val.split('|')[5]);
    remarks = $("#txtRemarks_" + rowNo).val();
    status = val.split('|')[4];
    if (status == "0") {
        if ($.trim(remarks).length == 0 || remarks == null) {
            fnMsgAlert('info', 'Info', 'Reason must be given for unapproval');
            return false;
        }
    }
    if (remarks != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#@!;{}*-\/,`=?]+$");
        if (!specialCharregex.test(remarks)) {
            fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. ~^+$.please remove the special characters."');
            return false;
        }
    }
    cpDetails = cpCode + "|" + categoryCode + "|" + cpStatus + "|" + regionCode + "|" + remarks + "$";
    var selectionType = "SINGLE";

    var regionCode = $('#hdnRegionCode').val()
    var selectedStatus = $("#ddlstatus option:selected").val();
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/UpdateCPStatus',
        data: "regionCode=" + regionCode + "&status=" + status + "&cpDetails=" + cpDetails + "&selection=" + selectionType,
        success: function (result) {
            if (result) {
                result = result.replace('&', '\n');
                fnMsgAlert('success', 'Success', result);
                fnCPHeader();
            }
            else if (data == "1") {
                fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
            }
            else {
                fnMsgAlert('info', 'Caution', 'Insertion Failed');
            }
        }
    });

}


function fnCPselectall() {
    if ($('#bulkCPcheck').is(":checked")) {
        $("input:checkbox[name=chkSelect]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chkSelect]").removeAttr('checked');
    }
}
function fnDoctorList(val) {

    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val()
    var cpCode = val.split('|')[0];
    var cpName = val.split('|')[2];
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/GetCPDoctorList',
        data: "regionCode=" + regionCode + "&cpCode=" + cpCode + '&cpName=' + cpName,
        success: function (result) {
            if (result) {
                $("#divModel").html(result);
                $("#dvOverlay").overlay().load();
            }

        }
    });
    HideModalPopup("dvloading");
}

//History Details
function fnViewCpHistory(val) {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    var cpCode = val.split('|')[0];
    var cpName = val.split('|')[1];
    var regionCode = val.split('|')[2];
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/GetCpHistory',
        data: "cpCode=" + cpCode + '&cpName=' + cpName + "&regionCode=" + regionCode,
        success: function (result) {
            if (result != "" && result != null) {
                if (result.split('^')[0] != "FAIL") {
                    $("#dvCphistorydetails").html(result);
                    $("#dvCpHistory").overlay().load();
                    $("#dvAccordion").accordion({
                        collapsible: true,
                        active: false
                    });
                    $("#main").unblock();
                }
                else {
                    fnMsgAlert('info', '', 'Error.' + result.split('^')[1]);
                    $("#main").unblock();
                }
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.result);
            $("#main").unblock();
        }
    });

}

function fnSFCDetails(val) {

    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val()
    var cpCode = val.split('|')[0];
    var cpName = val.split('|')[2];
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/GetCPSFCDetails',
        data: "regionCode=" + regionCode + "&cpCode=" + cpCode + '&cpName=' + cpName,
        success: function (result) {
            if (result) {
                $("#divModel").html(result);
                $("#dvOverlay").overlay().load();
            }

        }
    });
    HideModalPopup("dvloading");
}

function fngetPrivilegeValueDCRLockinReport(userCode) {
    debugger;
    $.ajax({
        type: "GET",
        async: false,
        url: '/HiDoctor_Master/Approval/fnGetDCRPrivilegeReport',
        data: 'userCode=' + userCode,
        success: function (response) {
            debugger;
            var privilegecheckreport = response;
            if (privilegecheckreport.length > 4) {
                unApprovallockCheck_g = "ENABLED";
            }
            else {
                unApprovallockCheck_g = "DISABLED";
            }

        }
    });

}

// DCR APPROVAL START
function fnsetPrivilegeValues() {
    debugger;
    var dcrAppovalprivilegeValue = "", dcrbulkapproval = "";
    var approveArr = new Array();

    dcrAppovalprivilegeValue = fnGetPrivilegeValue("CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF", "");
    dcrbulkapproval = fnGetPrivilegeValue("BULK_DCR_APPROVAL", "YES");
    //  dcrApprovallock = fnGetPrivilegeValue("DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK", "");


    approveArr = dcrAppovalprivilegeValue.split(',');

    if ($.inArray("DCR", approveArr) > -1) { // check whether the privilege CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF is mapped with the value "DCR",DCR approval needed
        unApprovalNeeded_g = "YES";
    }
    else {
        unApprovalNeeded_g = "NO";
    }

    if (dcrbulkapproval.toUpperCase() == "YES") {
        bulkApprovalneeded_g = "YES";
    }
    else {
        bulkApprovalneeded_g = "NO";
    }


}

function fnDCRCheckRemarksSpecialChar(id) {
    debugger;
    if ($(id).val() != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#@!;{}*-\/,`=?]+$");
        if (!specialCharregex.test($(id).val())) {
            fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. ~^+$.please remove the special characters."');
            //  $(id).val('');
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

function fnFillLeaveDCRData() {
    debugger;
    var month = "";
    var year = "";
    var legend = "";

    if ($('#hdnMonth').val() != "") {
        month = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
        year = $('#hdnMonth').val().split('-')[1];
    }
    var flag = $("#hdnMode").val();
    var dcrstatus = $("#hdnStatus").val();
    var selectedstatus = $("#ddlStatus option:selected").text();
    debugger;
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/Approval/GetDCRLeaveData',
            data: 'userCode=' + $("#hdnUserCodeApproval").val() + '&month=' + month + '&year=' + year + '&dcrStatus=' + dcrstatus + '&dcrFlag=' + flag,
            success: function (response) {
                debugger;
                fnCheckRecon(month, year, $("#hdnUserCodeApproval").val());
                if (response != "" && response.toUpperCase() != "NO") {
                    $("#divDCR").html(response);
                    legend += "<idv><span style='font-weight:bold;'>1.</span> For Approval of DCRs, select the corresponding DCR record(s), enter Approval Remarks (if needed) and click on Approve button.</div>";
                    legend += "<div><span style='font-weight:bold;'>2.</span> For Un-approval of DCRs, select the corresponding DCR record(s), enter Un-approval Remarks (mandatory) and click on Unapprove button.</div>";

                    $('#dvLegend').html(legend);

                    if (bulkApprovalneeded_g.toUpperCase() == "YES") {
                        if (unApprovalNeeded_g.toUpperCase() == "YES") {
                            if (selectedstatus.toUpperCase() == 'APPLIED') {
                                $("#dv-buttons").show();
                                $("#btnbulkapprove").show();
                                $("#btnbulkunapprove").show();
                                $('#dv-buttons').css('display', '');
                            }
                            else if (selectedstatus.toUpperCase() == "APPROVED") {
                                $("#dv-buttons").show();
                                $("#btnbulkapprove").hide();
                                $("#btnbulkunapprove").show();
                                $('#dv-buttons').css('display', '');
                            }
                            else {
                                $("#dv-buttons").hide();
                                $("#btnbulkapprove").hide();
                                $("#btnbulkunapprove").hide();
                                $('#txtReason').hide();
                                $('#dv-buttons').css('display', 'none');
                            }
                        }
                        else {
                            if (selectedstatus.toUpperCase() == 'APPLIED') {
                                $("#dv-buttons").show();
                                $("#btnbulkapprove").show();
                                $("#btnbulkunapprove").show();
                                $('#dv-buttons').css('display', '');
                            }
                            else {
                                $("#dv-buttons").hide();
                                $("#btnbulkapprove").hide();
                                $("#btnbulkunapprove").hide();
                                $('#dv-buttons').css('display', 'none');
                                $('#txtReason').hide();

                            }
                        }
                    }
                    else {
                        if (selectedstatus.toUpperCase() == 'APPLIED') {
                            $("#dv-buttons").show();
                            $("#btnbulkapprove").show();
                            $("#btnbulkunapprove").show();
                            $('#dv-buttons').css('display', '');
                        }
                        else if (selectedstatus.toUpperCase() == "APPROVED") {
                            $("#dv-buttons").show();
                            $("#btnbulkapprove").hide();
                            $("#btnbulkunapprove").show();
                            $('#dv-buttons').css('display', '');
                        }
                        else {
                            $("#dv-buttons").hide();
                            $("#btnbulkapprove").hide();
                            $("#btnbulkunapprove").hide();
                            $('#txtReason').hide();
                            $('#dv-buttons').css('display', 'none');
                        }
                    }
                }
                else {
                    $("#divDCR").html("No data found");
                    $("#dvLegend").html('');
                    $("#dv-buttons").hide();
                    $('#dv-buttons').css('display', 'none');
                }
            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'Error.');
                $("#dataDiv").hide();
                $("#dv-buttons").hide();
                $('#dv-buttons').css('display', 'none');

            },
            complete: function (e) {
                $('#chkSelect_All').click(function (e) {
                    //$(this).closest('.chkShow').find('input:checkbox').prop('checked', this.checked);
                    $('.chkShow:input:checkbox').prop('checked', this.checked);
                });
                $('.chkShow').click(function (e) {
                    var chkBoxCounts = $(".chkShow:input:checkbox").length;
                    var CheckedChkBoxCounts = $(".chkShow:input:checkbox:checked").length;
                    if (chkBoxCounts == CheckedChkBoxCounts) {
                        $('#chkSelect_All').prop('checked', true);
                    }
                    else {
                        $('#chkSelect_All').prop('checked', false);
                    }
                });
            }

        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        $("#dataDiv").hide();
        return false;
    }
}

function fnFillDCRData() {
    debugger;
    var month = "";
    var year = "";
    var legend = "";

    $('#dvLegend').html("");

    if ($('#hdnMonth').val() != "") {
        month = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
        year = $('#hdnMonth').val().split('-')[1];
    }
    var flag = $("#hdnMode").val();
    var dcrstatus = $("#hdnStatus").val();
    var selectedstatus = $("#ddlStatus option:selected").text();
    //Check the 
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Master/Approval/GetMonthExpenseStatus',
        data: 'userCode=' + $("#hdnUserCodeApproval").val() + '&month=' + month + '&year=' + year,
        success: function (response) {
            debugger;
            if (response == "no") {
                //get the applied users
                try {
                    $.ajax({
                        type: "POST",
                        url: '/HiDoctor_Master/Approval/GetDCRData',
                        data: 'userCode=' + $("#hdnUserCodeApproval").val() + '&month=' + month + '&year=' + year + '&dcrStatus=' + dcrstatus + '&dcrFlag=' + flag,
                        success: function (response) {
                            fnCheckRecon(month, year, $("#hdnUserCodeApproval").val());
                            if (response != "" && response.toUpperCase() != "NO") {

                                $("#divDCR").html(response);

                                legend += "<idv><span style='font-weight:bold;'>1.</span> For Approval of DCRs, select the corresponding DCR record(s), enter Approval Remarks (if needed) and click on Approve button.</div>";
                                legend += "<div><span style='font-weight:bold;'>2.</span> For Un-approval of DCRs, select the corresponding DCR record(s), enter Un-approval Remarks (mandatory) and click on Unapprove button.</div>";
                                legend += "<div><span style='font-weight:bold;'>3.</span> For Unapproval of DCRs, in case the <span class='clsLegend'>“to-be-unapproved DCRs”</span> are associated to a claim, the following steps need to be followed:</div>";
                                legend += "<div>&nbsp;&nbsp;&nbsp;<span style='font-weight:bold;'>a.</span> Go to the <span class='clsLegend'>Request Approval Screen</span> and under <span class='clsLegend'>Claim Request Details</span>, select the corresponding Claim, and Unapprove it by entering appropriate remarks.</div>";
                                legend += "<div>&nbsp;&nbsp;&nbsp;<span style='font-weight:bold;'>b.</span> Then go to the <span class='clsLegend'>Expense Claim screen</span> and under <span class='clsLegend'>Summary</span>, click on the Edit link for the correcting the respective Unapproved Claim record.Note that only the user who is the creator of the mentioned claim can see the Edit link for the Unapproved records.  This could be the Rep himself, or any other user who has submitted the claim on behalf of the Rep</div>";
                                legend += "<div>&nbsp;&nbsp;&nbsp;<span style='font-weight:bold;'>c.</span> Inside the Expense Claim Editing screen,<span class='clsLegend'>de-link</span> the<span class='clsLegend'>“to-be-unapproved DCRs”</span> from the Claim by unchecking the checkboxes for the corresponding DCR dates. Then click on <span class='clsLegend'>“Apply Expense”</span>  button to submit. This process will dis-associate the DCRs from the Claim.</div>";
                                legend += "<div>&nbsp;&nbsp;&nbsp;<span style='font-weight:bold;'>d.</span> Come back to the <span class='clsLegend'>DCR Approval screen</span>, and for the corresponding user, now select the <span class='clsLegend'>“to-be-unapproved DCRs”</span>, enter Remarks and click on Unapprove button.</div>";

                                $('#dvLegend').html(legend);

                                if (bulkApprovalneeded_g.toUpperCase() == "YES") {
                                    if (unApprovalNeeded_g.toUpperCase() == "YES") {
                                        if (selectedstatus.toUpperCase() == 'APPLIED') {
                                            $("#dv-buttons").show();
                                            $("#btnbulkapprove").show();
                                            $("#btnbulkunapprove").show();
                                            $('#dv-buttons').css('display', '');
                                        }
                                        else if (selectedstatus.toUpperCase() == "APPROVED") {
                                            $("#dv-buttons").show();
                                            $("#btnbulkapprove").hide();
                                            $("#btnbulkunapprove").show();
                                            $('#dv-buttons').css('display', '');
                                        }
                                        else {
                                            $("#dv-buttons").hide();
                                            $("#btnbulkapprove").hide();
                                            $("#btnbulkunapprove").hide();
                                            $('#txtReason').hide();
                                            $('#dv-buttons').css('display', 'none');
                                        }
                                    }
                                    else {
                                        if (selectedstatus.toUpperCase() == 'APPLIED') {
                                            $("#dv-buttons").show();
                                            $("#btnbulkapprove").show();
                                            $("#btnbulkunapprove").show();
                                            $('#dv-buttons').css('display', '');
                                        }
                                        else {
                                            $("#dv-buttons").hide();
                                            $("#btnbulkapprove").hide();
                                            $("#btnbulkunapprove").hide();
                                            $('#dv-buttons').css('display', 'none');
                                            $('#txtReason').hide();
                                        }
                                    }
                                }
                                else {
                                    $("#dv-buttons").hide();
                                    $("#btnbulkapprove").hide();
                                    $("#btnbulkunapprove").hide();
                                    $('#txtReason').hide();
                                    $('#dv-buttons').css('display', 'none');
                                }
                            }
                            else {
                                $("#divDCR").html("No data found");
                                $("#dvLegend").html('');
                                $("#dv-buttons").hide();
                                $('#dv-buttons').css('display', 'none');
                            }

                        },
                        error: function (e) {
                            fnMsgAlert('error', 'Error', 'Error.');
                            $("#dataDiv").hide();
                            $("#dv-buttons").hide();
                            $('#dv-buttons').css('display', 'none');

                        },
                        complete: function (e) {
                            $('#chkSelect_All').click(function (e) {
                                //$(this).closest('.chkShow').find('input:checkbox').prop('checked', this.checked);
                                $('.chkShow:input:checkbox').prop('checked', this.checked);
                            });
                            $('.chkShow').click(function (e) {
                                var chkBoxCounts = $(".chkShow:input:checkbox").length;
                                var CheckedChkBoxCounts = $(".chkShow:input:checkbox:checked").length;
                                if (chkBoxCounts == CheckedChkBoxCounts) {
                                    $('#chkSelect_All').prop('checked', true);
                                }
                                else {
                                    $('#chkSelect_All').prop('checked', false);
                                }
                            });
                        }
                    });
                }
                catch (e) {
                    fnMsgAlert('error', 'Error', e.message);
                    $("#dataDiv").hide();
                    return false;
                }
            } else {
                fnMsgAlert('info', 'Information', "Expense is being claimed for the selected month. No modification allowed");
                $("#divDCR").html('');
                $("#spnName").text('');
            }
        }
    });
}

function fnReportTwo(val) {
    debugger;
    approvalScreen = val;
    var uc = val.split('|')[0];
    fnGetDCRApprovalAllDCR(val);
    var sourceOfEntry = val.split('|')[12];
    debugger;
    fnUserperDayReport(val);


}

function fnUserperDayReport(val) {
    debugger;
    HideModalPopup('dvPopup');
    // $("#divloadingSub").show();
    $("#divRating").hide();
    $("#txtRatingRemarks").hide();
    $('#txtReason').val('');
    $("#txtRatingRemarks").val('');
    // USC00002098^01/08/2013^^Field^Approved^8^2013^0^1^2^^ALL|DCRCode
    //  $("#dvUserPerDay").html("");
    var flag = val.split('|')[3];
    flag = ((flag == 'Field') ? 'F' : ((flag == 'Leave') ? 'L' : 'A'));
    var userName = $("#spnName").html();
    var oldStatus = val.split('|')[4];
    var sourceOfEntry = val.split('|')[12];
    if (val.split('|')[13] == "Dashboard") {
        fnUserPerDayreportPop(val.split('|')[0], ToJavaScriptDate(val.split('|')[1]), flag, sourceOfEntry, val);
        var date = ToJavaScriptDate(val.split('|')[1]);
        var combinedDate = date.split('-')[0] + "/" + val.split('|')[5] + "/" + val.split('|')[6];
        $("#hdnSingle").val(val.split('|')[9] + "|" + val.split('|')[3] + "|" + val.split('|')[4] + "|" + val.split('|')[10] + "|" + val.split('|')[11] + "|" + combinedDate + "|" + sourceOfEntry);
    }
    else if (val.split('|')[13] == "DCRApproval") {
        fnUserPerDayreportPop(val.split('|')[0], val.split('|')[1], flag, sourceOfEntry, val);
        $("#hdnSingle").val(val.split('|')[9] + "|" + val.split('|')[3] + "|" + val.split('|')[4] + "|" + val.split('|')[10] + "|" + val.split('|')[11] + "|" + val.split('|')[1] + "|" + sourceOfEntry);
    }
    //  $('#hdnUserName').val(userName);
    //   $("#dvUserPerDay").load('../HiDoctor_Reports/Reports/UserPerDayReport/?userCode=' + val.split('|')[0] + '&dcrDate=' + val.split('|')[1] + '&flag=' + flag + '&userName=' + escape(userName));
    //value='" + dcrApproval.DCR_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.DCR_Date
    if (flag.toUpperCase() != "L") {
        if (val.split('|')[13] == "DCRApproval") {
            fnBindRatingParameter(val.split('|')[0], val.split('|')[9], flag, oldStatus);
        }
        else if (val.split('|')[13] == "Dashboard") {
            fnBindRatingParameter(val.split('|')[0], val.split('|')[9], flag, oldStatus);
        }
        else {
            $("#divRating").hide();
            $("#txtRatingRemarks").hide();
        }
    }
    if (sourceOfEntry.toUpperCase() == "PAY_WS") {//If Payroll is leave user should not be allowed to approve or unapprove so removing the check box

        //$('#dv-buttonsTwo').hide();
        $("#btnSingleApproved").hide();
        $("#btnSingleUnApproved").hide();
        $('#txtReason').hide();
        $('#txtReason').hide();
    }
    debugger;
    if (flag.toUpperCase() == "L") {
        if (val.split('|')[13] == "DCRApproval" || val.split('|')[13] == "Dashboard") {
            fnGetLeavePrivilege(val);
        }
    }
    else {
        ShowModalPopup('dvReportTwo');
        $("#dvReportTwo").removeClass('addzindex');
        $("#dvReportTwo").addClass('removezindex');
    }
    // $("#divloadingSub").hide();
}
function fnGetLeavePrivilege(val) {
    debugger;
    var userCode = "";
    userCode = (val.split('|')[0]);
    $.ajax({
        type: "GET",
        url: '/HiDoctor_Master/Approval/GetLeavePolicy',
        data: 'userCode=' + userCode,
        async: false,
        success: function (response) {
            if (response == 1) {
                leave_policy = response;
                ShowModalPopup('dvReportTwo');
                $("#btnSingleApproved").hide();
                $("#btnSingleUnApproved").hide();
                $('#txtReason').hide();
                $('#txtReason').hide();
            }
            else {
                leave_policy = response;
                ShowModalPopup('dvReportTwo');
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'Error.');
            $("#divDates").hide();
        }
    });
}

function fnGetDCRApprovalAllDCR(val) {
    debugger;
    var month = "";
    var year = "";
    var flag = "";
    var dcrstatus = "";
    var userCode = "";
    if (val.split('|')[13] == "Dashboard") {
        month = (val.split('|')[5]);
        year = (val.split('|')[6]);
        flag = (val.split('|')[8]);
        dcrstatus = (val.split('|')[7]);
        userCode = (val.split('|')[0]);

    }
    else if (val.split('|')[13] == "DCRApproval") {
        if ($('#hdnMonth').val() != "") {
            month = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
            year = $('#hdnMonth').val().split('-')[1];
        }
        flag = $("#hdnMode").val();
        dcrstatus = $("#hdnStatus").val();
        userCode = $("#hdnUserCodeApproval").val();
    }
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/Approval/GetDCRApprovalAllDCR',
            data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&dcrStatus=' + dcrstatus + '&dcrFlag=' + flag,
            success: function (response) {
                if (response != "") {
                    $("#divDates").html(response);
                    $("#divDates").show();
                }

            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'Error.');
                $("#divDates").hide();
            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        $("#divDates").hide();
        return false;
    }
}




function fnRemoveSpecialCharactor(txtVal) {
    if (txtVal.value != '' && txtVal.value.match(/^[\w ]+$/) == null) {
        txtVal.value = txtVal.value.replace(/[^a-z0-9-_,.?'\s]/gi, '');
    }
}

function fnBindRatingParameter(userCode, dcrCode, flag, status) {
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/Approval/GetRatingParameter',
            data: 'userCode=' + userCode + '&dcrCode=' + dcrCode + '&dcrFlag=' + flag + '&dcrStatus=' + status,
            success: function (response) {
                if (response != "") {
                    $("#divRating").html(response.split('~')[0]);
                    $("#txtRatingRemarks").val(response.split('~')[1]);
                    $("#divRating").show();
                    $("#txtRatingRemarks").show();
                }
            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'Error.');
                $("#divDates").hide();
            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        $("#divDates").hide();
        return false;
    }
}


function fnValidateLeaveDCR(status) {
    debugger;
    var flag = false;
    var remarks = "";
    var currentStatus = "";
    var isResult = true;
    var dcrDetails = "";
    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            var id = this.id;
            flag = true;
            var remarks_id = id.replace("chkSelect", "txtRemarks");
            //remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
            remarks = $("#" + remarks_id).val();
            dcrDetails += $("#" + id.replace("chkSelect", "hdnDCR")).val() + "|";
            if (status == "0") {
                if ($.trim(remarks).length == 0 || remarks == null) {
                    fnMsgAlert('info', 'Info', 'Please enter remarks');
                    isResult = false;
                    return false;
                }
            }


            if ($.trim(remarks) != "") {
                var specialCharregexfordcr = new RegExp(/[~`''^&<>$\\]/g);
                if (specialCharregexfordcr.test($("#" + remarks_id).val())) {
                    fnMsgAlert('info', 'Info', 'Special characters <b>( ~`^&<>$\ )</b> are not allowed in the remarks.');
                    isResult = false;
                    return false;
                }
                else {
                    return true;
                }
            }


            if (status == "2") {
                currentStatus = $("#" + id.replace("chkSelect", "hdnDCR")).val().split('|')[2];
                if (currentStatus.toLocaleUpperCase() == "APPROVED") {
                    fnMsgAlert('info', 'Info', 'You cannot Approve the Approved DCR.');
                    isResult = false
                    return false;
                }
            }
        }
    });
    if (!flag) {
        fnMsgAlert('info', 'Info', 'Please select atleast one DCR');
        isResult = false;
        return false;
    }

    var Dcrdetails = "";

    $("input:checkbox[name=chkSelect]").each(function () {
        debugger;
        if (this.checked) {
            var id = this.id;
            var dcrData = $("#" + id.replace("chkSelect", "hdnDCR")).val();
            var dcrDate = dcrData.split('|')[0] + " to " + dcrData.split('|')[1];
            var idRow = id.split("_")[1];
            if ($("#chkSelectUser_" + idRow).is(':checked') == false) {
                Dcrdetails += dcrDate + (',');

            }

        }
    });

    if ($("#chkSelectUser_1").html() != null) {
        if (Dcrdetails != "" && status != "2") {
            var r = confirm("Do you want to disable the DCR Activity Lock for the following dates " + Dcrdetails.split(",").join("\n"));
            if (r != true) {
                return false;
            }
        }
    }
    return isResult;
}

function fnValidateDCR(status) {
    debugger;
    var flag = false;
    var remarks = "";
    var currentStatus = "";
    var isResult = true;
    var dcrDetails = "";
    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            var id = this.id;
            flag = true;
            var remarks_id = id.replace("chkSelect", "txtRemarks");
            //remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
            remarks = $("#" + remarks_id).val();
            dcrDetails += $("#" + id.replace("chkSelect", "hdnDCR")).val() + "|";
            if (status == "0") {
                if ($.trim(remarks).length == 0 || remarks == null) {
                    fnMsgAlert('info', 'Info', 'Please enter remarks');
                    isResult = false;
                    return false;
                }
            }


            if ($.trim(remarks) != "") {
                var specialCharregexfordcr = new RegExp(/[~`/\''^&$<>?""*+!|#%=\\]/g);
                if (specialCharregexfordcr.test($("#" + remarks_id).val())) {
                    var specialChar = "(/[~`/\''^&$<>?*+!|#%=\\]/g)";
                    fnMsgAlert('info', 'Info', 'Special characters <b>' + specialChar + '</b> are not allowed in the remarks.');
                    isResult = false;
                    return false;
                }
                else {
                    return true;
                }
            }


            if (status == "2") {
                currentStatus = $("#" + id.replace("chkSelect", "hdnDCR")).val().split('|')[2];
                if (currentStatus.toLocaleUpperCase() == "APPROVED") {
                    fnMsgAlert('info', 'Info', 'You cannot Approve the Approved DCR.');
                    isResult = false
                    return false;
                }
            }
        }
    });
    if (!flag) {
        fnMsgAlert('info', 'Info', 'Please select atleast one DCR');
        isResult = false;
        return false;
    }

    var Dcrdetails = "";

    $("input:checkbox[name=chkSelect]").each(function () {
        debugger;
        if (this.checked) {
            var id = this.id;
            var dcrData = $("#" + id.replace("chkSelect", "hdnDCR")).val();
            var dcrDate = dcrData.split('|')[5];
            var idRow = id.split("_")[1];
            if ($("#chkSelectUser_" + idRow).is(':checked') == false) {
                Dcrdetails += dcrDate + (',');

            }

        }
    });

    if ($("#chkSelectUser_1").html() != null) {
        if (Dcrdetails != "" && status != "2") {
            var r = confirm("Do you want to disable the DCR Activity Lock for the following dates " + Dcrdetails.split(",").join("\n"));
            if (r != true) {
                return false;
            }
        }
    }
    return isResult;
}

function fnBulkLeaveApprove(status) {
    debugger;
    if (recon_Status.toString() == "0") {
        fnMsgAlert('info', 'DCR Calendar', "Since Recon Form is Either it is in Approved/Cancelled You can't Approve/Unapprove the DCRy")
        return false;
    } else {
        $("#btnbulkapprove").prop("disabled", true);
        $("#btnbulkunapprove").prop("disabled", true);
        $('#dataDiv').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        var dcrDetails = "";
        var remarks = "";
        var month = "";
        var year = "";
        var currentStatus = "";
        var parameterDetails = "";
        var ratingRemarks = "";
        var finalDcrdetails = "";
        var msgHtml = "";
        var finalDcrdetailsLock = "";
        debugger;
        if (fnValidateLeaveDCR(status)) {
            if ($('#hdnMonth').val() != "") {
                month = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
                year = $('#hdnMonth').val().split('-')[1];
            }
            var selectedFlag = $("#hdnMode").val();
            var selectedStatus = $("#hdnStatus").val();

            $("input:checkbox[name=chkSelect]").each(function () {
                if (this.checked) {
                    var id = this.id;
                    dcrDetails += $("#" + id.replace("chkSelect", "hdnDCR")).val() + "|";
                    remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
                    remarks = remarks.replace('|', ' ');
                    var idRow = id.split("_")[1];
                    if ($("#chkSelectUser_" + idRow).is(':checked') == true) {
                        dcrDetails += 1 + "|";
                    } else {
                        dcrDetails += 0 + "|";
                    }
                    dcrDetails += remarks + "$";
                }
            });

            finalDcrdetails = dcrDetails;
            if (finalDcrdetails != null && finalDcrdetails != "") {
                debugger;
                try {
                    $.ajax({
                        type: "POST",
                        url: '/HiDoctor_Master/Approval/UpdateLeaveDCRStatus',
                        data: 'userCode=' + $("#hdnUserCodeApproval").val() + '&dcrDetails=' + escape(finalDcrdetails) + '&status=' + status + '&month=' + month + '&year=' + year + '&selectedStatus=' + selectedStatus,
                        success: function (response) {
                            debugger;
                            $("#btnbulkapprove").prop("disabled", false);
                            $("#btnbulkunapprove").prop("disabled", false);
                            if (response != "") {
                                if (response == "SUCCESS") {
                                    fnFillLeaveDCRData();
                                    fnGetUsersSub();
                                    var monthYear = month + "-" + year;
                                    //fnCurrentAppieduserStatus(monthYear);
                                    $('#dataDiv').unblock();
                                    fnMsgAlert('success', 'Success', 'Leave has been successfully approved/unapproved');
                                    return false;
                                }
                                else {
                                    fnFillLeaveDCRData();
                                    fnGetUsersSub();
                                    var monthYear = month + "-" + year;
                                    //fnCurrentAppieduserStatus(monthYear);
                                    $('#dataDiv').unblock();
                                    fnMsgAlert('info', 'Info', 'some error has occurred during the approval process.');
                                    return false;
                                }
                                //fnFillLeaveDCRData();
                                //fnGetUsersSub();
                                //var monthYear = month + "-" + year;
                                //fnCurrentAppieduserStatus(monthYear);
                            }
                            else {
                                fnMsgAlert('info', 'Info', 'Some Error Occurred During Approval Process.');
                                return false;
                                $('#dataDiv').unblock();
                                fnFillLeaveDCRData();
                                fnGetUsersSub();
                                var monthYear = month + "-" + year;
                                //fnCurrentAppieduserStatus(monthYear);
                            }
                        },
                        error: function (e) {
                            fnMsgAlert('error', 'Error', 'Error.');

                        }
                    });
                }
                catch (e) {
                    $("#btnbulkapprove").prop("disabled", false);
                    $("#btnbulkunapprove").prop("disabled", false);
                    $("#dataDiv").unblock();
                    fnMsgAlert('error', 'Error', e.message);
                    $("#divDates").hide();
                    return false;
                }
            }
            else {
                $("#btnbulkapprove").prop("disabled", false);
                $("#btnbulkunapprove").prop("disabled", false);
                $("#dataDiv").unblock();
                msgHtml += "Your pre selected DCR date(s) are associated to a claim. To proceed with Un-approval of these DCRs,<br/>";
                msgHtml += " please follow the steps given under POINT 3, on top of the <span style='foont-weight:bold;'>DCR APPROVAL SCREEN</span>. In case of any problems, please contact your system administrator.";

                fnMsgAlert('info', 'Info', "" + msgHtml + "");
                return false;
            }
        }
        else {
            $("#btnbulkapprove").prop("disabled", false);
            $("#btnbulkunapprove").prop("disabled", false);
            $("#dataDiv").unblock();
        }
    }
}

function fnBulkApprove(status) {
    debugger;
    if (recon_Status.toString() == "0") {
        fnMsgAlert('info', 'DCR Calendar', "Since Recon Form is Either it is in Approved/Cancelled You can't Approve/Unapprove the DCRy")
        return false;
    } else {
        $("#btnbulkapprove").prop("disabled", true);
        $("#btnbulkunapprove").prop("disabled", true);
        $('#dataDiv').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        var dcrDetails = "";
        var remarks = "";
        var month = "";
        var year = "";
        var currentStatus = "";
        var parameterDetails = "";
        var ratingRemarks = "";
        var finalDcrdetails = "";
        var msgHtml = "";
        var finalDcrdetailsLock = "";


        if (fnValidateDCR(status)) {
            if ($('#hdnMonth').val() != "") {
                month = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
                year = $('#hdnMonth').val().split('-')[1];
            }
            var selectedFlag = $("#hdnMode").val();
            var selectedStatus = $("#hdnStatus").val();

            $("input:checkbox[name=chkSelect]").each(function () {
                if (this.checked) {
                    var id = this.id;
                    dcrDetails += $("#" + id.replace("chkSelect", "hdnDCR")).val() + "|";
                    remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
                    var res = '';
                    for (var i = 0; i < remarks.split('\n').length; i++) {
                        res = res + remarks.split('\n')[i] + ' ';
                    }
                    remarks = res.replace('|', ' ');
                    dcrDetails += remarks + "$";
                }
            });

            var finalresult = fnValidateExpenseClaim($("#hdnUserCodeApproval").val(), dcrDetails, status, month, year, selectedStatus, selectedFlag)


            if (finalresult != null && finalresult != "") {
                var expensedetails = finalresult.split(',');

                if (expensedetails != null && expensedetails != "") {
                    // var checklength = $("#tbldcrbulkapproval tbody tr").length;
                    //for (var s = 1 ; s <= checklength ; s++) {
                    //    
                    //    var id = 'chkSelect_' + s;
                    //    if ($("#chkSelect_" + s).is(":checked")) {
                    //        var dcrData = $("#" + id.replace("chkSelect", "hdnDCR")).val();
                    //        var dcrDate = dcrData.split('|')[5];
                    //        if ($.inArray(dcrDate, expensedetails) == -1) {
                    //            
                    //            finalDcrdetails += $("#" + id.replace("chkSelect", "hdnDCR")).val() + "|";
                    //            remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
                    //            remarks = remarks.replace('|', ' ');
                    //            finalDcrdetails += remarks + "$";
                    //        }
                    //    }

                    //}

                    $("input:checkbox[name=chkSelect]").each(function () {
                        debugger;
                        if (this.checked) {
                            var id = this.id;
                            var dcrData = $("#" + id.replace("chkSelect", "hdnDCR")).val();
                            var dcrDate = dcrData.split('|')[5];
                            if ($.inArray(dcrDate, expensedetails) == -1) {
                                finalDcrdetails += $("#" + id.replace("chkSelect", "hdnDCR")).val() + "|";
                                remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
                                var res = '';
                                for (var i = 0; i < remarks.split('\n').length; i++) {
                                    res = res + remarks.split('\n')[i] + ' ';
                                }
                                remarks = res.replace('|', ' ');
                                var idRow = id.split("_")[1];
                                if ($("#chkSelectUser_" + idRow).is(':checked') == true) {
                                    finalDcrdetails += 0 + "|";
                                } else {
                                    finalDcrdetails += 1 + "|";
                                }

                                finalDcrdetails += remarks + "$";
                            }
                        }
                    });
                }
                else {
                    finalDcrdetails = dcrDetails;
                }


                if (finalDcrdetails != null && finalDcrdetails != "") {
                    debugger;
                    try {
                        $.ajax({
                            type: "POST",
                            url: '/HiDoctor_Master/Approval/UpdateDCRStatus',
                            data: 'userCode=' + $("#hdnUserCodeApproval").val() + '&dcrDetails=' + escape(finalDcrdetails) + '&status=' + status + '&month=' + month + '&year=' + year + '&selectedStatus=' + selectedStatus + '&selectedFlag=' + selectedFlag + '&parameter=' + parameterDetails + '&ratingRemarks=' + escape(ratingRemarks),
                            success: function (response) {
                                debugger;
                                $("#btnbulkapprove").prop("disabled", false);
                                $("#btnbulkunapprove").prop("disabled", false);
                                $("#dataDiv").unblock();
                                if (response != "") {
                                    if (response != "" && finalresult != "1") {
                                        msgHtml += "Your pre selected DCR date(s) are associated to a claim. To proceed with Un-approval of these DCRs,<br/>";
                                        msgHtml += " please follow the steps given under POINT 3, on top of the <span style='foont-weight:bold;'>DCR APPROVAL SCREEN</span>. In case of any problems, please contact your system administrator.";
                                        msgHtml += "<br/>" + response + "";

                                        fnMsgAlert('info', 'Info', "" + msgHtml + "");
                                        $("#divDates").html("");
                                        fnFillDCRData();
                                        fnGetUsersSub();
                                        var monthYear = month + "-" + year;
                                        fnCurrentAppieduserStatus(monthYear);
                                    }
                                    else {
                                        if (response.split(':')[0] == "FAIL") {
                                            fnMsgAlert('info', 'Info', response.split(':')[1]);
                                        }
                                        else {
                                            fnMsgAlert('success', 'Success', response);
                                        }
                                        $("#divDates").html("");
                                        fnFillDCRData();
                                        fnGetUsersSub();
                                        var monthYear = month + "-" + year;
                                        fnCurrentAppieduserStatus(monthYear);
                                    }
                                }

                            },
                            error: function (e) {
                                fnMsgAlert('error', 'Error', 'Error.');

                            }
                        });
                    }
                    catch (e) {
                        $("#btnbulkapprove").prop("disabled", false);
                        $("#btnbulkunapprove").prop("disabled", false);
                        $("#dataDiv").unblock();
                        fnMsgAlert('error', 'Error', e.message);
                        $("#divDates").hide();
                        return false;
                    }
                }
                else {
                    $("#btnbulkapprove").prop("disabled", false);
                    $("#btnbulkunapprove").prop("disabled", false);
                    $("#dataDiv").unblock();
                    msgHtml += "Your pre selected DCR date(s) are associated to a claim. To proceed with Un-approval of these DCRs,<br/>";
                    msgHtml += " please follow the steps given under POINT 3, on top of the <span style='foont-weight:bold;'>DCR APPROVAL SCREEN</span>. In case of any problems, please contact your system administrator.";

                    fnMsgAlert('info', 'Info', "" + msgHtml + "");
                    return false;
                }
            }
            else {
                $("#btnbulkapprove").prop("disabled", false);
                $("#btnbulkunapprove").prop("disabled", false);
                $("#dataDiv").unblock();
            }
        }
        else {
            $("#btnbulkapprove").prop("disabled", false);
            $("#btnbulkunapprove").prop("disabled", false);
            $("#dataDiv").unblock();
        }
    }
}

//Get TP Deatils in DCR Approval
function fnSeeTpDetails(value) {
    var tp_id = value;

    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        data: "tpId=" + tp_id,
        url: '/HiDoctor_Master/Approval/GetDCRTpdetails',
        success: function (response) {
            if (response != null && response != "") {
                if (response.split('^')[0] != "FAIL") {
                    $("#dvTPdetails").html(response);
                    $("#dvDCRTP").overlay().load();
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

function fnValidateExpenseClaim(userCode, dcrDetail, status, month, year, selectedStatus, selectedFlag) {
    debugger;
    var userCode = userCode;
    var dcrDetails = dcrDetail;
    var status = status;
    var month = month;
    var year = year;
    var selectedStatus = selectedStatus;
    var selectedFlag = selectedFlag;
    var result = "";
    var msgHtml = "";


    if (status == 0) {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/Approval/CheckExpenseClaim',
            async: false,
            data: 'userCode=' + userCode + '&dcrDetails=' + escape(dcrDetails) + '&status=' + status + '&month=' + month + '&year=' + year + '&selectedStatus=' + selectedStatus + '&selectedFlag=' + selectedFlag,
            success: function (response) {
                debugger;
                if (response != null && response.length > 0) {
                    result = response;
                }
                else {
                    result = "1";
                }
            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'Error.');
                result = "";
            }
        });
    }
    else {
        result = "1";
    }
    return result;


}

function validateDecimal(txtValue, txtId) {
    var dec = /^[0-9]+(\.[0-9]+)+$/
    if (txtValue != "") {
        if (isNaN(txtValue)) {

            fnMsgAlert('info', 'Info', 'Please enter decimal value.');
            $("#txtParameterValue_" + txtId.toString()).val(" ");
            $("#txtParameterValue_" + txtId.toString()).focus();
            return false;
        }
        else if (txtValue < 0) {
            fnMsgAlert('info', 'Info', 'Please enter positive value.');
            $("#txtParameterValue_" + txtId.toString()).val(" ");
            $("#txtParameterValue_" + txtId.toString()).focus();
            return false;
        }
        else if (txtValue > 10) {
            fnMsgAlert('info', 'Info', 'Please enter the value below 10.');
            $("#txtParameterValue_" + txtId.toString()).val(" ");
            $("#txtParameterValue_" + txtId.toString()).focus();
            return false;

        }
    }

}


function maxLengthPaste(field) {
    var maxChars = 500;
    event.returnValue = false;
    if ((field.value.length + window.clipboardData.getData("Text").length) > maxChars) {
        alert("more than " + maxChars + " chars not allowed.");
        return false;
    }
    event.returnValue = true;
    maxLengthPaste

    function maxLength(field) {
        var maxChars = 500;
        if (field.value.length >= maxChars) {
            event.returnValue = false;
            alert("more than " + maxChars + " chars not allowed.");
            return false;
        }
    }
}
// Single Approval

function fnDCRApprove(status) {
    debugger;
    if (approvalScreen.split('|')[13] == "Dashboard") {
        recon_Status = "1";
    }
    if (recon_Status.toString() != "1") {
        fnMsgAlert('info', 'DCR Calendar', "Since Recon Form is Either it is in Approved/Cancelled You can't Approve/Unapprove the DCR")
        return false;

    } else {
        debugger;
        var dcrDetails = "";
        var remarks = "";
        var month = "";
        var year = "";
        var currentStatus = "";
        var msgHtml = "";
        var selectedFlag = "";
        var selectedStatus = "";
        var userCode = "";
        //Newly added for restict the special character in remarks field
        //if (!(fnCheckRemarksSpecialCharforDCR("#txtReason"))) {
        //    return false;
        //}
        if ($('#txtReason').val() != '') {
            var specialCharregexfordcr = new RegExp(/[~`/\''^&$<>?""*+!|#%=\\]/g);
            if (specialCharregexfordcr.test($("#txtReason").val())) {
                var specialChar = "(/[~`/\''^&$<>?*+!|#%=\\]/g)";
                fnMsgAlert('info', 'Info', 'Special characters <b>' + specialChar + '</b> are not allowed in the remarks.');
                isResult = false;
                return false;
            }
        }

        if (!(fnCheckRemarksSpecialCharforDCR("#txtRatingRemarks"))) {
            return false;
        }
        if (approvalScreen.split('|')[13] == "Dashboard") {
            month = approvalScreen.split('|')[5];
            year = approvalScreen.split('|')[6];
            selectedFlag = approvalScreen.split('|')[8];
            selectedStatus = approvalScreen.split('|')[7];
        }
        else {
            month = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
            year = $('#hdnMonth').val().split('-')[1];
            selectedFlag = $("#hdnMode").val();
            selectedStatus = $("#hdnStatus").val();
        }


        var remarks = $('.clstxtReason').val();
        var res = '';
        for (var i = 0; i < remarks.split('\n').length; i++) {
            res = res + remarks.split('\n')[i] + ' ';
        }
        var ratingRemarks = $('#txtRatingRemarks').val();
        remarks = res.replace('|', ' ');
        if (status == "0" && $.trim(remarks).length == 0) {
            fnMsgAlert('info', 'Info', 'Please enter remarks');
            return;
        }
        else {
            if ($("#chkSelectSingleUser").html() != null) {
                if ($("#chkSelectSingleUser").is(":checked") != true && status != "2") {
                    var r = confirm("Do you want to disable the DCR Activity Lock for this Date");
                    if (r != true) {
                        return false;
                    }

                    //    dcrDetails = $("#hdnSingle").val() + "|" + 1 + "|" + remarks + "$";
                    //    dcrDetails = 1 + "|";

                    dcrDetails = $("#hdnSingle").val() + "|" + 1 + "|" + remarks + "$";
                }
                else {
                    dcrDetails = $("#hdnSingle").val() + "|" + 0 + "|" + remarks + "$";
                    //  dcrDetails = 0 + "|";
                }
            }
            else {
                dcrDetails = $("#hdnSingle").val() + "|" + 0 + "|" + remarks + "$";
                //  dcrDetails = 0 + "|";
            }
        }

        var dcrStatusOld = dcrDetails.split('|')[2];
        if (dcrStatusOld.toUpperCase() == "APPROVED" && status == "2") {
            fnMsgAlert('info', 'Info', 'You cannot Approve the Approved DCR.');
            return;
        }
        else if (dcrStatusOld.toUpperCase() == "UNAPPROVED") {
            fnMsgAlert('info', 'Info', 'You cannot change the status of Unapproved DCRs.');
            return;
        }


        var length = $("#tblRating tr").length

        if ($("#hdnIsMandatoryRating").val() == 1 && status == 2) {
            for (var i = 1; i <= length ; i++) {

                var ddlRating = "ddlRating_" + i + "";
                if (($("#" + ddlRating + " option:selected").val()) == 0) {
                    fnMsgAlert('info', 'Info', 'Please Select all Parameters Ratings');
                    $("#" + ddlRating + "").focus();
                    return false;
                }

            }
        }


        var parameterDetails = "";
        var paramaterCode = "", ratingValue = "", ratingRemark = "";
        var finalResult = "";

        for (var i = 1; i <= length ; i++) {

            var ddlRating = "ddlRating_" + i + "";
            if (($("#" + ddlRating + " option:selected").val()) > 0) {

                paramaterCode = $("#txtParameterCode_" + i).val();
                ratingValue = $("#" + ddlRating + " option:selected").val();
                ratingRemark = $("#txtRatingRemark_" + i).val();
                parameterDetails += paramaterCode + "|" + ratingValue + "|" + ratingRemark + "$";

            }

        }

        debugger;
        if (approvalScreen.split('|')[13] == "Dashboard") {
            finalResult = fnValidateExpenseClaim(approvalScreen.split('|')[0], dcrDetails, status, month, year, selectedStatus, selectedFlag);
        }
        else {
            finalResult = fnValidateExpenseClaim($("#hdnUserCodeApproval").val(), dcrDetails, status, month, year, selectedStatus, selectedFlag);
        }
        debugger;
        if (approvalScreen.split('|')[13] == "Dashboard") {
            userCode = approvalScreen.split('|')[0];
        }
        else {
            userCode = $("#hdnUserCodeApproval").val();
        }
        if (finalResult != "" && finalResult != null && finalResult != "1") {
            msgHtml += "Your pre selected DCR date(s) are associated to a claim. To proceed with Un-approval of these DCRs,<br/>";
            msgHtml += " please follow the steps given under POINT 3, on top of the <span style='foont-weight:bold;'>DCR APPROVAL SCREEN</span>. In case of any problems, please contact your system administrator.";

            fnMsgAlert('info', 'Info', "" + msgHtml + "");
            return false;
        }
        else {
            debugger;
            try {
                $.ajax({
                    type: "POST",
                    url: '/HiDoctor_Master/Approval/UpdateDCRStatus',
                    data: 'userCode=' + userCode + '&dcrDetails=' + escape(dcrDetails) + '&status=' + status + '&month=' + month + '&year=' + year + '&selectedStatus=' + selectedStatus + '&selectedFlag=' + selectedFlag + '&parameter=' + parameterDetails + '&ratingRemarks=' + escape(ratingRemarks),
                    success: function (response) {
                        debugger;
                        if (response != "") {
                            if (response != "") {
                                fnMsgAlert('success', 'Success', response);
                                if (approvalScreen.split('|')[13] == "Dashboard") {
                                    $(".clsdivuserperday").dialog("destroy");
                                    $.unblockUI();
                                    $('#Modal').modal('hide');
                                    LandingPage.OnInit();
                                }
                                else {
                                    $("#divDates").html("");
                                    fnFillDCRData();
                                    HideModalPopup('dvReportTwo');
                                    fnGetUsersSub();
                                    fnmanagerApprovalPrivilage();
                                }
                            }
                        }
                        else {
                            fnMsgAlert('info', 'Caution', 'Insertion Failed');
                            HideModalPopup('dvReportTwo');
                        }

                    },
                    error: function (e) {
                        fnMsgAlert('error', 'Error', 'Error.');

                    }
                });
            }
            catch (e) {
                fnMsgAlert('error', 'Error', e.message);
                $("#divDates").hide();
                // return false;
            }
        }
    }
}


function fnShowPreviousRemarks(remarks) {
    if (remarks == "&nbsp;" || remarks == "" || remarks == "^") {
        alert("No Previous remarks found.");
    }
    else {
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
                content += "<div style='float:left;width:100%;border:1px solid #000;" + style + "'>";
                if (remarksArr[j].split('~')[0] !== undefined) {
                    content += "<div style='float:left;width:100%;padding: 3px;'>" + remarksArr[j].split('~')[0] + "</div>";
                }
                if (remarksArr[j].split('~')[1] !== undefined) {
                    content += "<div style='float:left;width:100%;padding: 3px;'>" + remarksArr[j].split('~')[1] + "</div>";
                }
                content += "</div>";
            }
        }
        $("#divdetailsTable").html(content);
        ShowModalPopup('dvPopup');
    }
}


// ******************************************************* User per day popup *************************************************************//

debugger;
var dcrjson_g = "";

var uaccHeaderTableString_g = ' <table class="accHeaderTable"><tr><td style="font-weight:bold;">User Name</td> <td><span id="spnuserName"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Employee Name</td><td><span id="spnpEmpName"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Employee Number</td><td><span id="spnpEmpNumber"></span></td>';
uaccHeaderTableString_g += '</tr>';
uaccHeaderTableString_g += '<tr><td style="font-weight:bold;">Region Name</td><td><span id="spnpRegionName"></span></td></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Designation</td><td><span id="spnpDesignation"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Division Name</td><td><span id="tddivisionName"></span></td>';
uaccHeaderTableString_g += '</tr><tr><td style="font-weight:bold;">DCR Date</td> <td><span id="spnDCRDate"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Work Place</td> <td><span id="spnWorkPlace"></span></td>';
uaccHeaderTableString_g += '<td style="font-weight:bold;">Entered Date</td><td><span id="spnDCRentedDate"></span></td>';
uaccHeaderTableString_g += '</tr></table><div style="height:45px;"><span style="font-size:19px;">Accompanist Details</span></div>';
uaccHeaderTableString_g += '<table style="width:99%;margin-top:-12px;">';
uaccHeaderTableString_g += '<tr><td style="font-weight: bold;">User Name</td><td><span id="accPopUpName"></span></td><td style="font-weight: bold;">Employee Name</td><td><span id="accEmpName"></span></td><td style="font-weight: bold;">Region Name</td><td><span id="accRegName"></span></td></tr>';
uaccHeaderTableString_g += '<tr><td style="font-weight: bold;">Division</td><td><span id="accDivName"></span></td><td style="font-weight: bold;">Designation</td><td><span id="accdesignation"></span></td><td style="font-weight: bold;">Time</td><td><span id="accPopUpTime"></span></td></tr>';
uaccHeaderTableString_g += '</table>';



var detailProdString_g = '<table class="accHeaderTable"><tr><td style="font-weight:bold">User Name</td><td><span id="spnduserName"></span></td><td style="font-weight:bold">Employee Name</td>';
detailProdString_g += '<td><span id="spndEmpName"></span></td><td style="font-weight:bold">Region Name</td><td><span id="spndRegionName"></span></td>';
detailProdString_g += '</tr><brf/><tr><td style="font-weight:bold">Doctor Name</td><td><span id="spndDocName"></span></td><td style="font-weight:bold">MDL No</td><td><span id="spndMDL"></span></td>';
detailProdString_g += '<td style="font-weight:bold">Specialty</td><td><span id="spndSpeciality"></span></td></tr><tr><td style="font-weight:bold">Category</td><td><span id="spndCategory"></span></td>';
detailProdString_g += '<td style="font-weight:bold">Division Name</td><td><span id="spnDivisionname"></span></td>'
detailProdString_g += '</tr></table>';


var rowid = "";
var lstDetails = [];
var lstDetailsA = [];
function fnchecksurveyresponse() {
    debugger;
    var tblDoclength = $('#dvUserPerDayCont #tblOwnDoctor tbody tr').length;
    var sno = 0;
    for (var i = 0; i < tblDoclength; i++) {
        sno++;
        rowid = sno;
        if ($('#dvUserPerDayCont #surveylink_' + sno).text().toUpperCase() == "YES") {
            var details = $('#hdnDetails_' + sno).val();
            var doctCode = details.split('|')[0];
            var surveyId = details.split('|')[1];
            var UserCode = details.split('|')[2];
            var flag = "F"
            _objData = {
                Id: rowid,
                Customer_Code: doctCode,
                Survey_Id: surveyId,
                User_Code: UserCode,
                Flag: "F"
            };
            lstDetails.push(_objData)
            Method_params = ["SurveyAPI/GetSurveyResponse", Company_Code, Region_Code, UserCode, doctCode, surveyId, flag];
            SurveyCoreREST.get(null, Method_params, null, fnSurveyResponseSuccessCallback, fnSurveyResponseFailureCallback);
        }
    }
    var tblDocAlength = $('#dvUserPerDayCont #tblProducts tbody tr').length;
    lstDetailsA = [];
    for (var i = 0; i < tblDocAlength; i++) {
        rowid = i;
        if ($('#dvUserPerDayCont #surveylinkA_' + i).text().toUpperCase() == "YES") {
            var details = $('#hdnAtteDetails_' + i).val();
            var doctCode = details.split('|')[0];
            var surveyId = details.split('|')[1];
            var UserCode = details.split('|')[2];
            var flag = "A"
            _objData = {
                Id: rowid,
                Customer_Code: doctCode,
                Survey_Id: surveyId,
                User_Code: UserCode,
                Flag: "A"
            };
            lstDetailsA.push(_objData)
            Method_params = ["SurveyAPI/GetSurveyResponse", Company_Code, Region_Code, UserCode, doctCode, surveyId, flag];
            SurveyCoreREST.get(null, Method_params, null, fnSurveyAtteResponseSuccessCallback, fnSurveyResponseFailureCallback);
        }
    }
}
function fnSurveyResponseSuccessCallback(response) {
    debugger;
    var disjson = $.grep(lstDetails, function (ele, index) {
        return ele.Id == rowid;
    });
    var content = "";
    if (response == 1) {
        var qeyString = accKey + "/Survey/KASurveyResultPage?CompanyCode=" + Company_Code + "&ChecklistId=" + disjson[0].Survey_Id + "&CompanyId=" + CompanyId + "&UserId=" + disjson[0].User_Code + "&CustomerCode=" + disjson[0].Customer_Code + "";
        content = "<a href='#' onclick='fnviewsurvey(\"" + qeyString + "\");'>YES</a>";
    } else {
        content = "<span>NO</span>";
    }
    $('#surveylink_' + rowid).html(content);
}
function fnSurveyAtteResponseSuccessCallback(response) {
    var disjson = $.grep(lstDetailsA, function (ele, index) {
        return ele.Id == rowid;
    });
    var content = "";
    if (response == 1) {
        var qeyString = accKey + "/Survey/KASurveyResultPage?CompanyCode=" + Company_Code + "&ChecklistId=" + disjson[0].Survey_Id + "&CompanyId=" + CompanyId + "&UserId=" + disjson[0].User_Code + "&CustomerCode=" + disjson[0].Customer_Code + "";
        content = "<a href='#' onclick='fnviewsurvey(\"" + qeyString + "\");'>YES</a>";
    } else {
        content = "<span>NO</span>";
    }
    $('#dvUserPerDayCont #surveylinkA_' + rowid).html(content);
}
function fnSurveyResponseFailureCallback() {
}
function fnUserPerDayreportPop(userCode, startDate, activityMode, sourceOfEntry, val) {
    debugger;
    var selectedstatus = $("#ddlStatus option:selected").text();
    var btncontent = "";
    var selectedDate = "";
    $("#dvUserPerDayCont").html('');
    $("#dvUserPerDayCont").hide();
    $("#divuserperday").show();
    $(".dcrQuickLoad").show();
    $("#dvLoading").show();
    $("#hdnCurrentDate").val(startDate);
    if (val.split('|')[13] == "Dashboard") {
        selectedDate = startDate.split('-')[2] + "-" + startDate.split('-')[1] + "-" + startDate.split('-')[0];
    }
    else if (val.split('|')[13] == "DCRApproval") {
        selectedDate = startDate.split('/')[2] + "-" + startDate.split('/')[1] + "-" + startDate.split('/')[0];
    }
    $.ajax({
        url: '../HiDoctor_Reports/UserPerDay/GetUserPerDayReport',
        type: "POST",
        data: "userCode=" + userCode + '&sd=' + selectedDate + '&flag=' + activityMode + "&options=S&Company_Code=" + Company_Code + "&User_Name=&Region_Code=" + ($("#hdnRegionCode").val() == "" || $("#hdnRegionCode").val() == undefined ? Region_Code : $("#hdnRegionCode").val()),
        success: function (response) {
            debugger;
            if (response.split('^')[0] != 'FAIL') {
                $("#dvUserPerDayCont").html("");
                $("#dvUserPerDayCont").html(response);
                fnchecksurveyresponse();
                if (val.split('|')[3] == 'Field') {
                    fngetdcrsummarycount(val);
                    GetPOBSummaryCount(val);
                }
                if (leave_policy == "1") {
                    $("#btnSingleApproved").hide();
                    $("#btnSingleUnApproved").hide();
                    $('#txtReason').hide();
                    $('#txtReason').hide();
                }
                else if (sourceOfEntry.toUpperCase() == "PAY_WS") {//If Payroll is leave user should not be allowed to approve or unapprove so removing the check box                 
                    //$('#dv-buttonsTwo').hide();
                    $("#btnSingleApproved").hide();
                    $("#btnSingleUnApproved").hide();
                    $('#txtReason').hide();
                    $('#txtReason').hide();
                }
                else {
                    $("#btnSingleApproved").show();
                    $("#btnSingleUnApproved").show();
                    $('#txtReason').show();
                }
                fngetPrivilegeValueDCRLockinReport(userCode);

                var dcrAppovalprivilegeValue = "", dcrbulkapproval = "";
                var approveArr = new Array();

                dcrAppovalprivilegeValue = fnGetPrivilegeValue("CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF", "");
                dcrbulkapproval = fnGetPrivilegeValue("BULK_DCR_APPROVAL", "YES");
                //  dcrApprovallock = fnGetPrivilegeValue("DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK", "");
                approveArr = dcrAppovalprivilegeValue.split(',');

                if ($.inArray("DCR", approveArr) > -1) { // check whether the privilege CAN_UNAPPROVE_AN_APPROVED_ENTRY_OF is mapped with the value "DCR",DCR approval needed
                    unApprovalNeeded_g = "YES";
                }
                else {
                    unApprovalNeeded_g = "NO";
                }

                if (dcrbulkapproval.toUpperCase() == "YES") {
                    bulkApprovalneeded_g = "YES";
                }
                else {
                    bulkApprovalneeded_g = "NO";
                }

                if (val.split('|')[13] == "Dashboard") {
                    //fngetPrivilegeValueDCRLockinReport(userCode);
                    selectedstatus = "APPLIED";
                }
                debugger;

                if (bulkApprovalneeded_g.toUpperCase() == "YES") {
                    if (unApprovalNeeded_g.toUpperCase() == "YES") {
                        if (unApprovallockCheck_g.toUpperCase() == "ENABLED") {
                            //btncontent +="<tr>"
                            btncontent += "<td style='text-align:center'>"
                            btncontent += "<input type='checkbox' class='chkShowUser1'  id='chkSelectSingleUser' name='chkSelectUser' checked='checked' /><span>Enable DCR Lock</span>";
                            btncontent += "<input type='hidden' id='chkSelectSingleUser'";

                            //     btncontent.Append("value='" + dcrApproval.DCR_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.DCR_Date + "|" + dcrApproval.Source_Of_Entry + "'/>");
                            btncontent += "</td></br></br>";
                        }
                        if (selectedstatus.toUpperCase() == 'APPLIED' && sourceOfEntry.toUpperCase() != "PAY_WS") {
                            if (leave_policy == "0" && (val.split('|')[13] == "Dashboard" || val.split('|')[13] == "DCRApproval") && val.split('|')[3]) {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Approve' id='btnSingleApproved' style='margin-left: 50px;' class='btn small primary' onclick='fnDCRApprove(2);'/>";
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                            }
                            else if (val.split('|')[3] == 'Field' || val.split('|')[3] == 'Attendance') {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Approve' id='btnSingleApproved' style='margin-left: 50px;' class='btn small primary' onclick='fnDCRApprove(2);'/>";
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                            }
                        }
                        else if (selectedstatus.toUpperCase() == "APPROVED" && sourceOfEntry.toUpperCase() != "PAY_WS") {
                            if (leave_policy == "0" && (val.split('|')[13] == "Dashboard" || val.split('|')[13] == "DCRApproval")) {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                            }
                            else if (val.split('|')[3] == 'Field' || val.split('|')[3] == 'Attendance') {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                            }
                        }
                    }
                    else {
                        if (selectedstatus.toUpperCase() == 'APPLIED' && sourceOfEntry.toUpperCase() != "PAY_WS") {
                            if (unApprovallockCheck_g.toUpperCase() == "ENABLED") {
                                //btncontent +="<tr>"
                                btncontent += "<td style='text-align:center'>"
                                btncontent += "<input type='checkbox' class='chkShowUser1'  id='chkSelectSingleUser' name='chkSelectUser' checked='checked' /><span>Enable DCR Lock</span>";
                                btncontent += "<input type='hidden' id='chkSelectSingleUser'";

                                //     btncontent.Append("value='" + dcrApproval.DCR_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.DCR_Date + "|" + dcrApproval.Source_Of_Entry + "'/>");
                                btncontent += "</td></br></br>";
                            }
                            if (leave_policy == "0" && (val.split('|')[13] == "Dashboard" || val.split('|')[13] == "DCRApproval")) {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Approve' id='btnSingleApproved' style='margin-left: 50px;' class='btn small primary' onclick='fnDCRApprove(2);'/>";
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' class='btn small primary' style='margin-left: 10px;' onclick='fnDCRApprove(0);'/>";
                            }
                            else if (val.split('|')[3] == 'Field' || val.split('|')[3] == 'Attendance') {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Approve' id='btnSingleApproved' style='margin-left: 50px;' class='btn small primary' onclick='fnDCRApprove(2);'/>";
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' class='btn small primary' style='margin-left: 10px;' onclick='fnDCRApprove(0);'/>";
                            }
                        }
                        //else if (selectedstatus.toUpperCase() == 'APPROVED' && sourceOfEntry.toUpperCase() != "PAY_WS") {
                        //    btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                        //}
                    }
                }
                else {
                    if (unApprovalNeeded_g.toUpperCase() == "YES") {
                        if (unApprovallockCheck_g.toUpperCase() == "ENABLED") {
                            //btncontent +="<tr>"
                            btncontent += "<td style='text-align:center'>"
                            btncontent += "<input type='checkbox' class='chkShowUser1'  id='chkSelectSingleUser' name='chkSelectUser' checked='checked' /><span>Enable DCR Lock</span>";
                            btncontent += "<input type='hidden' id='chkSelectSingleUser'";

                            //     btncontent.Append("value='" + dcrApproval.DCR_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.DCR_Date + "|" + dcrApproval.Source_Of_Entry + "'/>");
                            btncontent += "</td></br></br>";
                        }
                        if (selectedstatus.toUpperCase() == 'APPLIED' && sourceOfEntry.toUpperCase() != "PAY_WS") {
                            if (leave_policy == "0") {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Approve' id='btnSingleApproved'  style='margin-left: 50px;' class='btn small primary' onclick='fnDCRApprove(2);'/>";
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' class='btn small primary' style='margin-left: 10px;' onclick='fnDCRApprove(0);'/>";
                            }
                            else if (val.split('|')[3] == 'Field' || val.split('|')[3] == 'Attendance') {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Approve' id='btnSingleApproved'  style='margin-left: 50px;' class='btn small primary' onclick='fnDCRApprove(2);'/>";
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' class='btn small primary' style='margin-left: 10px;' onclick='fnDCRApprove(0);'/>";
                            }
                        }
                        else if (selectedstatus.toUpperCase() == "APPROVED" && sourceOfEntry.toUpperCase() != "PAY_WS") {
                            if (leave_policy == "0") {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                            }
                            else if (val.split('|')[3] == 'Field' || val.split('|')[3] == 'Attendance') {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                            }
                        }
                    }
                    else {
                        if (unApprovallockCheck_g.toUpperCase() == "ENABLED") {
                            //btncontent +="<tr>"
                            btncontent += "<td style='text-align:center'>"
                            btncontent += "<input type='checkbox' class='chkShowUser1'  id='chkSelectSingleUser' name='chkSelectUser' checked='checked' /><span>Enable DCR Lock</span>";
                            btncontent += "<input type='hidden' id='chkSelectSingleUser'";

                            //     btncontent.Append("value='" + dcrApproval.DCR_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.DCR_Date + "|" + dcrApproval.Source_Of_Entry + "'/>");
                            btncontent += "</td></br></br>";
                        }
                        if (selectedstatus.toUpperCase() == 'APPLIED' && sourceOfEntry.toUpperCase() != "PAY_WS") {
                            if (leave_policy == "0") {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Approve' id='btnSingleApproved' style='margin-left: 50px;' class='btn small primary' onclick='fnDCRApprove(2);'/>";
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                            }
                            else if (val.split('|')[3] == 'Field' || val.split('|')[3] == 'Attendance') {
                                $('#txtReason').show();
                                btncontent += "<input type='button' value='Approve' id='btnSingleApproved' style='margin-left: 50px;' class='btn small primary' onclick='fnDCRApprove(2);'/>";
                                btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                            }
                        }
                        //else if (selectedstatus.toUpperCase() == 'APPROVED' && sourceOfEntry.toUpperCase() != "PAY_WS") {
                        //    if (leave_policy == "0") {
                        //        $('#txtReason').show();
                        //        btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                        //    }
                        //    else if (val.split('|')[3] == 'Field' || val.split('|')[3] == 'Attendance') {
                        //        $('#txtReason').show();
                        //        btncontent += "<input type='button' value='Unapprove' id='btnSingleUnApproved' style='margin-left: 10px;' class='btn small primary' onclick='fnDCRApprove(0);'/>";
                        //    }
                        //}
                    }
                }

                $('#dv-buttonsTwo').html(btncontent);
                $('#UserName').html($('#hdnUserName').val() + " - " + startDate);
                $("#dvUserPerDayCont").show();
                $("#dvLoading").hide();
                $(".dcrQuickLoad").hide();
            }
            else {
                $("#dvLoading").hide();
            }
        },
    });
}
function fngetdcrsummarycount(val) {
    debugger;
    var user_code = val.split('|')[0];
    if (val.split('|')[13] == "Dashboard") {
        var selectedDate = ToJavaScriptDate(val.split('|')[1]);
        var actual_date = selectedDate.split('-')[2] + "-" + selectedDate.split('-')[1] + "-" + selectedDate.split('-')[0];
    }
    else if (val.split('|')[13] == "DCRApproval") {
        var selectedDate = val.split('|')[1];
        var actual_date = selectedDate.split('/')[2] + "-" + selectedDate.split('/')[1] + "-" + selectedDate.split('/')[0];
    }
    var month = val.split('|')[5];
    var year = val.split('|')[6];

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/UserPerDay/GetSummaryCount',
        data: "User_Code=" + user_code + "&Actual_Date=" + actual_date + "&Month=" + month + "&Year=" + year,
        success: function (response) {
            $('#dcrSummary').html(response);
        },
        error: function () {
        }
    });
}

function GetPOBSummaryCount(val) {
    debugger;
    var user_code = val.split('|')[0];
    if (val.split('|')[13] == "Dashboard") {
        var selectedDate = ToJavaScriptDate(val.split('|')[1]);
        var actual_date = selectedDate.split('-')[2] + "-" + selectedDate.split('-')[1] + "-" + selectedDate.split('-')[0];
    }
    else if (val.split('|')[13] == "DCRApproval") {
        var selectedDate = val.split('|')[1];
        var actual_date = selectedDate.split('/')[2] + "-" + selectedDate.split('/')[1] + "-" + selectedDate.split('/')[0];
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/UserPerDay/GetPOBSummaryCount',
        data: "User_Code=" + user_code + "&Actual_Date=" + actual_date,
        success: function (response) {
            var lspobCount = response;
            var table = "<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>POB Summary Details</h3></div><table class='data display dataTable box'><thead><tr><th colspan='4'style='text-align: center;'>Doctor</th><th colspan='3'style='text-align: center;background: lightseagreen;color: white;'>Chemist</th></tr></thead><tbody>";
            table += "<tr><td></td><td style='font-weight: bold;'>Total Calls</td><td  style='font-weight: bold;'>Productivity Calls</td><td style='font-weight: bold;'>Total Value</td style='font-weight: bold;'><td style='font-weight: bold;'>Total Calls</td><td style='font-weight: bold;'>Productivity Calls</td style='font-weight: bold;'><td style='font-weight: bold;'>Total value</td></tr>";
            var dayDochtml = "";
            var dayChhtml = "";
            var monthDochtml = "";
            var monthChhtml = "";
            for (var i = 0; i < lspobCount.length; i++) {
                if (lspobCount[i].Entity_Type == 'D' && lspobCount[i].Record_Count_Type == 'DAY')
                    dayDochtml = "<tr><td>For the Day</td><td>" + lspobCount[i].Entity_Count + "</td><td>" + lspobCount[i].POB_Count + "</td><td>" + lspobCount[i].Total_Amount + "</td>";
                if (lspobCount[i].Entity_Type == 'C' && lspobCount[i].Record_Count_Type == 'DAY')
                    dayChhtml = "<td>" + lspobCount[i].Entity_Count + "</td><td>" + lspobCount[i].POB_Count + "</td><td>" + lspobCount[i].Total_Amount + "</td></tr>";
                if (lspobCount[i].Entity_Type == 'D' && lspobCount[i].Record_Count_Type == 'MONTH')
                    monthDochtml = "<tr><td>For the Month</td><td>" + lspobCount[i].Entity_Count + "</td><td>" + lspobCount[i].POB_Count + "</td><td>" + lspobCount[i].Total_Amount + "</td>";
                if (lspobCount[i].Entity_Type == 'C' && lspobCount[i].Record_Count_Type == 'MONTH')
                    monthChhtml = "<td>" + lspobCount[i].Entity_Count + "</td><td>" + lspobCount[i].POB_Count + "</td><td>" + lspobCount[i].Total_Amount + "</td></tr>";
            }
            table += dayDochtml + dayChhtml + monthDochtml + monthChhtml;
            table += "</tbody></table>";
            $("#pobSummary").html(table);
        },
        error: function () {
        }
    });
}

function fnShowDigitalsig(Id, Datalink) {
    debugger;
    $('#showImage').html('<img src="' + Datalink + '"/>');
    $("#udvOverLaydg").show();

}

function fnShowAccDoctor(obj) {
    debugger;
    if ($("#udvOverLay").css('display') == 'none') {
        $('#udivAccDocDetail').html('')
        $('#udivAccDocDetail').html(uaccHeaderTableString_g);
        var accName = document.getElementById(obj.id).innerHTML;
        var accStartTimeId = "";
        var accEndTimeId = "";
        if (obj.id.indexOf('First') > -1) {
            accStartTimeId = obj.id.replace(/AccPersonName/g, 'AccStartTime');
            accEndTimeId = obj.id.replace(/AccPersonName/g, 'AccEndTime');
        }
        else if (obj.id.indexOf('Sec') > -1) {
            accStartTimeId = obj.id.replace(/SecAccPersonName/g, 'SecondAccStartTime');
            accEndTimeId = obj.id.replace(/SecAccPersonName/g, 'SecondAccEndTime');
        }
        else {
            accStartTimeId = obj.id.replace(/AccPersonName/g, 'AccPersonStartTime');
            accEndTimeId = obj.id.replace(/AccPersonName/g, 'AccPersonEndTime');
        }
        var accTime = document.getElementById(accStartTimeId).innerHTML + "-" + document.getElementById(accEndTimeId).innerHTML;
        if (accTime == "-") {
            accTime = "N/A";
        }

        var userCode = "";
        var userName = "";
        var s = "";
        var regionName = ";"
        var dcrDate = "";
        var selectedDate = "";
        var dcrType = "";
        var workplace = "";
        var dcrEnterDate = "";
        var dcrStatus = "";
        var empName = "";
        var divisionName = "";
        var designation = "";
        var empnumber = "";
        var travlePlaces = "";
        var revisedDate = "";
        var DcrUserCode = "";

        if (approvalScreen.split('|')[13] == "Dashboard") {
            debugger;
            userCode = approvalScreen.split('|')[0];
            userName = approvalScreen.split('|')[14];
            s = approvalScreen.split('|')[15];
            regionName = s.substring(s.lastIndexOf('(') + 1, s.lastIndexOf(')'));
            dcrDate = ToJavaScriptDate(approvalScreen.split('|')[1]);
            selectedDate = dcrDate.split('-')[2] + "-" + dcrDate.split('-')[1] + "-" + dcrDate.split('-')[0];
            dcrType = approvalScreen.split('|')[3];
            workplace = approvalScreen.split('|')[16];
            dcrEnterDate = ToJavaScriptDate(approvalScreen.split('|')[19]);
            dcrStatus = approvalScreen.split('|')[4];
            empName = approvalScreen.split('|')[17];
            divisionName = approvalScreen.split('|')[18];
            designation = approvalScreen.split('|')[20];
            empnumber = approvalScreen.split('|')[21];
            revisedDate = dcrDate.replace(/\//g, "");
            DcrUserCode = approvalScreen.split('|')[9];

        }
        else if (approvalScreen.split('|')[13] == "DCRApproval") {
            debugger;
            userCode = $('#hdnUserCodeApproval').val();
            userName = $('#UserName').html().split(',')[0];
            s = $('#UserName').html().split(',')[1];
            regionName = s.substring(s.lastIndexOf('(') + 1, s.lastIndexOf(')'));
            dcrDate = $("#hdnCurrentDate").val();
            selectedDate = dcrDate.split('/')[2] + "-" + dcrDate.split('/')[1] + "-" + dcrDate.split('/')[0];
            dcrType = $("#ddlflag option:selected").text();
            workplace = $('#spnPlaceWorked').html();
            dcrEnterDate = $('#spndcrEnteredDate').html();
            dcrStatus = $('#spnDCRStatus').html();
            empName = $('#spnEmpName').html();
            divisionName = $('#lbnDivisionName').html();
            designation = $('#lbndesignation').html();
            empnumber = $('#lbnEmpNumber').html();
            revisedDate = dcrDate.replace(/\//g, "");
            DcrUserCode = "DCR" + userName + revisedDate;
        }
        //userCode = $('#hdnUserCodeApproval').val();
        //userName = $('#UserName').html().split(',')[0];
        //s = $('#UserName').html().split(',')[1];
        //regionName = s.substring(s.lastIndexOf('(') + 1, s.lastIndexOf(')'));
        //dcrDate = $("#hdnCurrentDate").val();
        //var selectedDate = dcrDate.split('/')[2] + "-" + dcrDate.split('/')[1] + "-" + dcrDate.split('/')[0];
        //var dcrType = $("#ddlflag option:selected").text();
        //var workplace = $('#spnPlaceWorked').html();
        //var dcrEnterDate = $('#spndcrEnteredDate').html();
        //var dcrStatus = $('#spnDCRStatus').html();
        //var empName = $('#spnEmpName').html();
        //var divisionName = $('#lbnDivisionName').html();
        //var designation = $('#lbndesignation').html();
        //var empnumber = $('#lbnEmpNumber').html();
        //var travlePlaces = "";
        //var revisedDate = dcrDate.replace(/\//g, "");
        //var DcrUserCode = "DCR" + userName + revisedDate;
        for (var i = 1; i < $("#tblHOP tbody tr").length; i++) {
            travlePlaces += $("#tblHOP tbody tr")[i].getElementsByClassName("sfcFrom")[0].innerHTML + "<br />" + $("#tblHOP tr")[i].getElementsByClassName("sfcTo")[0].innerHTML;
        }

        $('#spnuserName').html(userName);
        $('#spnpEmpName').html(empName);
        $('#spnpRegionName').html(regionName);
        $('#spnDCRDate').html(dcrDate);
        if (dcrType == "") {
            $('#spnDCRType').html("Field");
        }
        else {
            $('#spnDCRType').html(dcrType);
        }
        $('#uspnpDCRStatus').html(dcrStatus);
        $('#spnWorkPlace').html(workplace);
        $('#spnDCRentedDate').html(dcrEnterDate);
        $('#tddivisionName').html(divisionName);
        $('#accPopUpName').html(accName);
        $('#accPopUpTime').html(accTime);
        $('#spnpEmpNumber').html(empnumber);
        $('#spnpDesignation').html(designation);
        $("#udvOverLay").overlay().load();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/Reports/GetAccompanistVisitedDoctors',
            data: "DCR_User_Code=" + userCode + "&Acc_User_Name=" + accName + "&DCR_User_Name=" + userName
                + "&DCR_Actual_Date=" + selectedDate,
            success: function (response) {
                debugger;
                if ($('#spndcrversion').html().toUpperCase() == "DCR V3") {
                    var accHTML = $('#udivAccDocDetail').html() + "*Doctor Details <br />" + response + '<br /><span id="accDesclaimer">*the data that you see here is indicative only.</span>';
                }
                else {
                    var accHTML = $('#udivAccDocDetail').html() + response;
                }
                $('#udivAccDocDetail').html(accHTML);
            },
            error: function () {
                fnMsgAlert('info', 'DCR Consolidate', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }
    fnAccDetail(accName, DcrUserCode);
}

function fnShowDetailedProducts(rI, docCode, t) {
    $('#divDetailPrdDetail').html('')
    $('#divDetailPrdDetail').html(detailProdString_g);
    var docName = "";
    var docmdl = "";
    var cate = ""
    var spec = ""
    if (t == "acc") {
        docName = $('#accdocName_' + rI).html();
        docmdl = $('#accdocMDL_' + rI).html();
        cate = $('#accdocCategory_' + rI).html();
        spec = $('#accdocSpec_' + rI).html();

    }
    else {
        docName = $('#docName_' + rI).html();
        docmdl = $('#docMDL_' + rI).html();
        cate = $('#docCategory_' + rI).html();
        spec = $('#docSpec_' + rI).html();
    }
    /*var docName = $('#docName_' + rI).html();
    var docmdl = $('#docMDL_' + rI).html();
    var cate = $('#docCategory_' + rI).html();
    var spec = $('#docSpec_' + rI).html();*/
    var dates = $("#hdnCurrentDate").val().split('/')[1] + "/" + $("#hdnCurrentDate").val().split('/')[0] + "/" + $("#hdnCurrentDate").val().split('/')[2] + "^";
    var dcr_user_Code = $("#hdnUserCodeApproval").val();
    var dcrDates = "";
    var userCode = $('#hdnUserCodeApproval').val();
    var userName = $('#UserName').html().split(',')[0];
    var s = $('#UserName').html().split(',')[1];
    var regionName = s.substring(s.lastIndexOf('(') + 1, s.lastIndexOf(')'));
    var empName = $('#spnEmpName').html();
    var divisionName = $('#lbnDivisionName').html();
    spec = spec.split('<')[0];

    $('#spnduserName').html(userName);
    $('#spndEmpName').html(empName);
    $('#spndRegionName').html(regionName);
    $('#spndDocName').html(docName);
    $('#spndMDL').html(docmdl);
    $('#spndSpeciality').html(spec);
    $('#spndCategory').html(cate == null ? "NA" : cate);
    $('#spnDivisionname').html(divisionName);

    $("#dvDetailedProductOverLay").overlay().load();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDetailedProductsAndInputsPerDoctor',
        data: "doctor_Code=" + docCode + "&doctor_Name=" + $.trim(docName) + "&user_Code=" + userCode
            + "&DCR_Actual_Dates=" + $.trim(dates) + "&speciality_Name=" + $.trim(spec),
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
//************************************* DCR APPROVAL END ***************************************************************//

function fnSSselectall() {
    if ($('#bulkSScheck').is(":checked")) {
        $("input:checkbox[name=chkSelect]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chkSelect]").removeAttr('checked');
    }
}
function fnSSDetailsSelectAll() {

    if ($('#bulkSScheckDetails').is(":checked")) {
        $("input:checkbox[name=chkSSSelect]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chkSSSelect]").removeAttr('checked');
    }
}


function fnBindSecondarySalesApproval() {

    //  $("#hdnSelectedRegionCode").val('');

    $("#hdnSelectedRegionCode").val('')

    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Approval', 'Select month and year');
        return false;
    }

    var status = $("#ddlStatus option:selected").val();
    if (status.toUpperCase() == "MODE") {
        fnMsgAlert('info', 'Secondary Sales Approval', 'Select secondary sales status');
        return false;
    }

    var selectedMonth = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
    var selectedYear = $('#txtMonth').val().split('-')[1];
    var title = "";
    // status name assign the hidden field
    $('#hdnStatusName').val($("#ddlStatus option:selected").text());
    $('#hdnMonth').val($('#txtMonth').val());
    $('#hdnStatus').val(status);
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Approval/GetSecondarySalesApprovalHeader',
        data: 'month=' + selectedMonth + '&year=' + selectedYear + '&status=' + status,
        success: function (response) {
            title = "List of user(s) who have submitted the Secondary sales details for the month of < " + $('#hdnMonth').val() + " > which is in < " + $("#ddlStatus option:selected").text() + " > Mode <br>"
            if (response != "NO") {

                $('#dvGrid').html(title + response);
                $('#dvSSDetails').html("");
                $("#divDetails").show();
                $("#dv-buttons").hide();
            }
            else {
                $('#dvGrid').html(title + " No data found.");
                $('#dvSSDetails').html("");
                $("#dv-buttons").hide();
                fnMsgAlert('info', 'Secondary sales approval ', 'No data found.');
                HideModalPopup("dvloading");
                $("#divDetails").hide();

            }

        },
        error: function (e) {
            HideModalPopup("dvloading");
        }
    });

}


function fnBindSSHeaderDetails() {

    if ($("#hdnMonth").val() == "") {
        fnMsgAlert('info', 'Secondary sales approval.', 'Select month and year.');
        return false;
    }

    var regionCodes = "";
    if ($("#hdnSelectedRegionCode").val() == "") {
        $("input:checkbox[name=chkSelect]").each(function () {
            if (this.checked) {
                var id = this.id;
                regionCodes += $("#" + id.replace("chkSelect", "hdnApprovl")).val().split('|')[0] + "^";
            }
        });

        if (regionCodes == "") {
            fnMsgAlert('info', 'Secondary sales approval.', 'Select atleast one region.');
            return false;
        }
        $("#hdnSelectedRegionCode").val(regionCodes);
    }
    else {
        regionCodes = $("#hdnSelectedRegionCode").val();
    }

    var selectedMonth = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
    var selectedYear = $('#hdnMonth').val().split('-')[1];
    var status = $('#hdnStatus').val();
    var title = "";
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Approval/GetSecondarySalesApprovalDetails',
        data: 'month=' + selectedMonth + '&year=' + selectedYear + '&status=' + status + '&regionCode=' + regionCodes,
        success: function (response) {
            $('#dvGridlegent').html("Approved and Unapproved button show only for applied secondary sales records");
            title = "Secondary Sales Details for the month of < " + $('#hdnMonth').val() + " >";
            if (response != "NO") {
                $('#dvSSDetails').html(title + response);
                $("#divDetails").show();
                $("#dv-buttons").show();
                $("#hdnSelectedRegionCode").val('');
                HideModalPopup("dvloading");
                if (status == "1") {
                    $("#dv-buttons").show();
                }
                else {
                    $("#dv-buttons").hide();
                }
            }
            else {
                $("#dv-buttons").hide();
                $('#dvSSDetails').html(title + "No details found");
                $("#hdnSelectedRegionCode").val('');
                //   fnMsgAlert('info', 'Secondary sales approval ', 'No data found.');
                HideModalPopup("dvloading");
            }

        },
        error: function (e) {
            HideModalPopup("dvloading");

        }
    });

}



function fnSecondarySalesBulkApproval(status) {
    var details = "";
    var remarks = "";
    var selectedMonth = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
    var selectedYear = $('#hdnMonth').val().split('-')[1];
    var currentStatus = $('#hdnStatus').val();
    if (fnValidateSecondarySales(status)) {

        $("input:checkbox[name=chkSSSelect]").each(function () {
            if (this.checked) {
                var id = this.id;
                details += $("#" + id.replace("chkSSSelect", "hdnApprovlDetails")).val() + "|";
                remarks = $("#" + id.replace("chkSSSelect", "txtRemarks")).val();
                remarks = remarks.replace('|', ' ');
                details += remarks + "$";
            }
        });

        try {
            $.ajax({
                type: "POST",
                url: '/HiDoctor_Master/Approval/UpdateSecondarySalesStatus',
                data: 'details=' + escape(details) + '&status=' + status + '&month=' + selectedMonth + '&year=' + selectedYear + '&currentStatus=' + currentStatus,
                success: function (response) {
                    if (response != "") {
                        if (response != "") {
                            fnMsgAlert('success', 'Success', response);
                            $('#dvSSDetails').html();
                            fnBindSSHeaderDetails();
                            //   fnBindSecondarySalesApproval()
                        }
                    }

                },
                error: function (e) {
                    fnMsgAlert('error', 'Error', 'Error.');

                }
            });
        }
        catch (e) {
            fnMsgAlert('error', 'Error', e.message);
            $("#divDates").hide();
            return false;
        }
    }
}



function fnValidateSecondarySales(status) {
    var flag = false;
    var remarks = "";
    var currentStatus = "";
    var isResult = true;

    $("input:checkbox[name=chkSSSelect]").each(function () {
        if (this.checked) {
            var id = this.id;
            flag = true;
            remarks = $("#" + id.replace("chkSSSelect", "txtRemarks")).val();
            if (status == "0") {
                if ($.trim(remarks).length == 0 || remarks == null) {
                    fnMsgAlert('info', 'Info', 'Please enter remarks');
                    isResult = false;
                    return false;
                }
            }

            if ($.trim(remarks) != "") {
                var specialCharregex = new RegExp("^[a-zA-Z0-9() |._%#@!;{}:*\\-,`=+?]+$");
                if (!specialCharregex.test(remarks)) {
                    fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. "&~^$<>[]\\/\'.please remove the special characters.');
                    isResult = false;
                    return false;
                }
                else {
                    return true;
                }
            }


            if (status == "2") {
                currentStatus = $("#" + id.replace("chkSSSelect", "hdnApprovlDetails")).val().split('|')[2];
                if (currentStatus.toLocaleUpperCase() == "APPROVED") {
                    fnMsgAlert('info', 'Info', 'You cannot Approve the Approved Secondary Sales.');
                    isResult = false
                    return false;
                }
            }
        }
    });
    if (!flag) {
        fnMsgAlert('info', 'Info', 'Please select atleast one Secondary Sales.');
        isResult = false;
        return false;
    }

    return isResult;
}

function fnReportSSTwo(details) {
    $("#hdnApprovalTwo").val(' ')
    $("#dvReportTwo").html('');
    $("#dvReportTwo").hide();
    $("#divHeader").show();
    $("#dvLoading").show();
    $('#txtReason').val('');
    $("#hdnApprovalTwo").val(details);
    var status = $('#hdnStatus').val();
    var title = "";

    $.ajax({
        url: '/HiDoctor_Master/Approval/GetSecondarySalesApprovalTwo',
        type: "POST",
        data: 'month=' + details.split('|')[3] + '&year=' + details.split('|')[4] + '&status=' + status + '&regionCode=' + details.split('|')[0] + '&ssCode=' + details.split('|')[1] + '&userCode=' + details.split('|')[5],
        success: function (response) {
            if (response != "") {
                title = "<div>Secondary Sales Details for the month of < " + $('#hdnMonth').val() + " ></div> ";
                $("#dvReportTwo").html(title + response.split('$')[0]);
                $("#dvRemarks").html(response.split('$')[1]);
                $("#dvReportTwo").show();
                $("#dvLoading").hide();
                if (status == "1") {
                    $("#dv-buttonsTwo").show();
                }
                else {
                    $("#dv-buttonsTwo").hide();
                }
            }
            else {
                $("#dvLoading").hide();
            }
            ShowModalPopup('dvReportSSTwo');
        },
    });
}

function fnSSApprove(status) {
    var details = "";
    var remarks = "";
    var selectedMonth = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
    var selectedYear = $('#hdnMonth').val().split('-')[1];
    var currentStatus = $('#hdnStatus').val();
    remarks = $('#txtReason').val();
    remarks = $.trim(remarks);

    if (status == "0" && remarks == "") {
        fnMsgAlert('info', 'Secondary sales approval.', 'please enter the remarks.');
        return false;
    }

    if ($.trim(remarks) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9() |._%#@!;{}:*\\-,`=+?]+$");
        if (!specialCharregex.test(remarks)) {
            fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. "&~^$<>[]\\/\'.please remove the special characters.');

            return false;
        }
    }
    details = $("#hdnApprovalTwo").val() + "|";
    details += remarks.replace('|', ' ') + "$";
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/Approval/UpdateSecondarySalesStatus',
            data: 'details=' + escape(details) + '&status=' + status + '&month=' + selectedMonth + '&year=' + selectedYear + '&currentStatus=' + currentStatus,
            success: function (response) {
                if (response != "") {
                    if (response != "") {
                        fnMsgAlert('success', 'Success', response);
                        $('#dvSSDetails').html();
                        HideModalPopup('dvReportSSTwo');
                        fnBindSSHeaderDetails();
                    }
                }

            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'Error.');
            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }

}

function fnBindWideAngleApproval(direction) {

    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Wide Angle Approval', 'Select month and year');
        return false;
    }

    var status = $("#ddlStatus option:selected").val();
    if (status.toUpperCase() == "MODE") {
        fnMsgAlert('info', 'Wide Angle Approval', 'Select Mode');
        return false;
    }
    var title = "";

    if (direction == "1") {
        // status name assign the hidden field
        $('#hdnMonth').val($('#txtMonth').val());
        $('#hdnStatus').val($("#ddlStatus option:selected").val());
        $('#hdnStatusText').val($("#ddlStatus option:selected").text());

    }
    var selectedMonth = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
    var selectedYear = $('#hdnMonth').val().split('-')[1];
    var currentStatus = $('#hdnStatus').val();
    var statusName = $('#hdnStatusText').val();
    $("#dv-buttons").hide();
    var title = "";


    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Approval/GetWideAngleUserHeader',
        data: 'month=' + selectedMonth + '&year=' + selectedYear + '&status=' + currentStatus,
        success: function (response) {
            title = "<div  class='col-lg-9'>List of user(s) who have submitted the DCR Calendar release request in the month of < " + $('#hdnMonth').val() + " > which is in < " + statusName + " > Mode  </div>"
            if (response != "NO") {
                $('#dvWideAngleHeader').html(title + response.split('~')[1]);
                $('#dvGrid').html(response.split('~')[0]);
                $("#dv-buttons").show();
                //if (currentStatus == "1") {
                //    $("#dv-buttons").show();
                //}
                //else {
                //    $("#dv-buttons").hide();
                //}
            }
            else {
                $('#dvWideAngleHeader').html('');
                $('#dvGrid').html(title + " <div class='col-lg-9'>No data found.</div>");
                $("#dv-buttons").hide();
                fnMsgAlert('info', 'Wide Angle Approval ', 'No data found.');
                HideModalPopup("dvloading");

            }

        },
        error: function (e) {
            HideModalPopup("dvloading");
        }
    });
}

function fnShowWideAngleRemarks(remarks) {
    if (remarks == "&nbsp;" || remarks == "" || remarks == "^") {
        alert("No remarks found.");
    }
    else {
        $("#divdetailsTable").html(remarks);
        ShowModalPopup('dvPopup');
    }
}



function fnValidateWideAngle(status) {
    var flag = false;
    var remarks = "";
    var currentStatus = "";
    var isResult = true;

    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            var id = this.id;
            flag = true;
            remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
            if (status == "3") {
                if ($.trim(remarks).length == 0 || remarks == null) {
                    fnMsgAlert('info', 'Info', 'Please enter remarks');
                    isResult = false;
                    return false;
                }
            }
            if ($.trim(remarks) != "") {
                var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#@!;{}*-\/,`=?]+$");
                if (!specialCharregex.test(remarks)) {
                    fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. ~^+$.please remove the special characters."');
                    isResult = false;
                    return false;
                }
                else {
                    return true;
                }
            }


            if (status == "2") {
                currentStatus = $("#" + id.replace("chkSelect", "hdnApprovlDetails")).val().split('|')[2];
                if (currentStatus.toLocaleUpperCase() == "APPROVED") {
                    fnMsgAlert('info', 'Info', 'You cannot Approve the Approved Wide Angle.');
                    isResult = false
                    return false;
                }
            }
        }
    });
    if (!flag) {
        fnMsgAlert('info', 'Info', 'Please select atleast one Wide Angle.');
        isResult = false;
        return false;
    }

    return isResult;
}

function fnWideAngleBulkApproval(status) {
    var details = "";
    var remarks = "";
    var selectedMonth = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
    var selectedYear = $('#hdnMonth').val().split('-')[1];
    var currentStatus = $('#hdnStatus').val();
    if (fnValidateWideAngle(status)) {

        $("input:checkbox[name=chkSelect]").each(function () {
            if (this.checked) {
                var id = this.id;
                details += $("#" + id.replace("chkSelect", "hdnApprovlDetails")).val() + "|";
                remarks = $("#" + id.replace("chkSelect", "txtRemarks")).val();
                remarks = remarks.replace('|', ' ');
                details += remarks + "$";
            }
        });

        try {
            $.ajax({
                type: "POST",
                url: '/HiDoctor_Master/Approval/UpdateWideAngleStatus',
                data: 'details=' + escape(details) + '&status=' + status,
                success: function (response) {
                    if (response != "") {
                        if (response != "") {
                            fnMsgAlert('success', 'Success', response);
                            fnBindWideAngleApproval(2);
                        }
                    }

                },
                error: function (e) {
                    fnMsgAlert('error', 'Error', 'Error.');

                }
            });
        }
        catch (e) {
            fnMsgAlert('error', 'Error', e.message);
            $("#divDates").hide();
            return false;
        }
    }
}

function fnDetailsSelectAll() {
    if ($('#bulkcheckDetails').is(":checked")) {
        $("input:checkbox[name=chkSelect]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chkSelect]").removeAttr('checked');
    }
}

function fnReportWideAngleTwo(details) {

    $("#hdnApprovalTwo").val(' ')
    $("#dvReportTwo").html('');
    $("#dvReportTwo").hide();

    $("txtStartDate").val();
    $("txtEndDate").val();
    $("#hdnRequestedDate").val();

    $("#dvLoading").show();
    $("#hdnApprovalTwo").val(details);
    $("#dvRemarks").html(" ");
    var requestFrom = "";
    var status = $('#hdnStatus').val();
    $("#dv-buttonsTwo").hide();
    var title = "";

    var requestId = details.split('|')[1];
    $.ajax({
        url: '/HiDoctor_Master/Approval/GetWideAngleApprovalTwo',
        type: "POST",
        data: 'status=' + status + '&userCode=' + details.split('|')[0] + '&requestId=' + requestId,
        success: function (response) {
            if (response != "NO") {
                // title = "<div>DCR Calendar Release request of < " + $('#hdnMonth').val() + " ></div> ";
                $("#dvReportTwo").html(response.split('$')[0]);
                requestFrom = response.split('$')[1]
                $("#txtStartDate").val(requestFrom.split("|")[0]);
                $("#txtEndDate").val(requestFrom.split("|")[1]);
                $("#hdnRequestedDate").val(requestFrom.split("|")[2]);
                $("#dvReportTwo").show();
                $("#dv-buttonsTwo").show();
                //if (status == "1") {
                //    $("#dv-buttonsTwo").show();
                //}
                //else {
                //    $("#dv-buttonsTwo").hide();
                //}
                $("#dvLoading").hide();
                //  fnBindWideAngleApproval();
            }
            else {
                $("#dvLoading").hide();
                $("#dv-buttonsTwo").hide();
            }
            ShowModalPopup('dvWideAnglePop');
        },
    });
}



function fnWideApprove(status) {
    var details = "";
    var remarks = "";
    var startDate = $('#txtStartDate').val().split('/');
    var endDate = $('#txtEndDate').val().split('/');
    var requestDate = $("#hdnRequestedDate").val().split('/');

    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]); //dt1 
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);
    var dtReq = new Date(requestDate[2] + "-" + requestDate[1] + "-" + requestDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Wide Angle approval', 'Start date should be less than End date');
        return false;
    }

    if (dtReq > dt1) {
        fnMsgAlert('info', 'Wide Angle approval', 'Approved date from should be less than Requested Date');
        return false;
    }

    remarks = $('#txtReason').val();
    if (status == "3" && remarks == "") {
        fnMsgAlert('info', 'Wide Angle approval.', 'please enter the remarks.');
        return false;
    }

    if ($.trim(remarks) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#@!;{}*-\/,`=?]+$");
        if (!specialCharregex.test(remarks)) {
            fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. ~^+$.please remove the special characters."');
            return false;
        }
    }

    var requestFrom = $("#txtStartDate").val();
    var requestTo = $("#txtEndDate").val();
    details = $("#hdnApprovalTwo").val();
    var currentStatus = $('#hdnStatus').val();

    if (requestFrom == "") {
        requestFrom = details.split('|')[4];
    }

    if (requestTo == "") {
        requestTo = details.split('|')[5];
    }
    details = details.split('|')[0] + "|" + details.split('|')[1] + "|" + details.split('|')[2] + "|" + details.split('|')[3] + "|" + requestFrom + "|" + requestTo + "|";

    details += remarks.replace('|', ' ') + "$";

    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/Approval/UpdateWideAngleStatus',
            data: 'details=' + escape(details) + '&status=' + status,
            success: function (response) {
                if (response != "") {
                    if (response != "") {
                        fnMsgAlert('success', 'Success', response);
                        HideModalPopup('dvWideAnglePop');
                        //  fnBindWideAngleApproval(2);
                        fnBindWideAngleApproval(2);

                    }
                }

            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'Error.');

            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        $("#divDates").hide();
        return false;
    }

}


//DCR-History Details
function fnViewApprovalHistory(val) {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    var dcrCode = "";
    var userCode = "";
    dcrCode = val.split('|')[0];
    userCode = val.split('|')[1];
    if (dcrCode != null && dcrCode != '') {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/Approval/GetDCRApprovalHistorydetails',
            data: "dcrCode=" + dcrCode + '&userCode=' + userCode,
            success: function (result) {
                if (result != "" && result != null) {
                    if (result.split('^')[0] != "FAIL") {
                        $("#dvDCRHistorydetails").html(result);
                        $("#dvDCRHistory").overlay().load();
                        $("#main").unblock();
                    }
                    else {
                        fnMsgAlert('info', '', 'Error.' + result.split('^')[1]);
                        $("#main").unblock();
                    }
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.result);
                $("#main").unblock();
            }
        });
    }
}

//Leave Popup for DCR Leave Approval
function fnLeavePopup(val) {
    debugger;
    $('#dvPopupLeave').overlay().load();
    var tblcontent = "", approvedby = "", approvedDate = "", approvedReason = "", attachment = "";
    approvedby = val.split('|')[0];
    approvedDate = val.split('|')[1];
    approvedReason = val.split('|')[2];
    attachment = val.split('|')[3];
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Reports/UserPerDay/GetAttachments",
        data: "attachment_Id=" + attachment,
        success: function (result) {
            debugger;
            tblcontent += "<table class='table table-striped'>";
            tblcontent += "<thead class='active'><tr><th>S No</th>";
            tblcontent += "<th>Attachment Name</th>";
            tblcontent += "</tr></thead>";
            tblcontent += "<tbody>";
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    tblcontent += "<tr>";
                    tblcontent += "<td>" + (i + 1) + "</td>";
                    //tblcontent += "<td>" + result[i].Attachment_Name + "</td>";
                    tblcontent += "<td><span><a href='" + result[i].Attachment_Url + "'>" + result[i].Attachment_Name + " </span></td>";
                    tblcontent += "</tr>";
                }
            }
            else {
                tblcontent += "No details found.";
            }
            tblcontent += "</tbody>";
            tblcontent += "</table>";

            tblcontent += "<label>NOTE: Click on Attachment Name to Download the Attachment</label>";
            $('#tblleavepopup').html(tblcontent);
            $("#dvPopupLeave").overlay().load();
        }
    });
}

function fnDoctor360Popup(val) {
    $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + val, title: 'Reports', overlayClose: false });
    return;
}

function fnAccDetail(accName, DcrUserCode) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetAccompanistVisitedDetails',
        data: "Accompanist=" + accName + "&DcrUserCode=" + DcrUserCode,
        success: function (result) {
            debugger;
            if (result != null && result.length > 0) {
                $('#accEmpName').html(result[0].Emp_Name);
                $('#accRegName').html(result[0].Region_Name);
                $('#accdesignation').html(result[0].User_Type_Name);
                for (var i = 0; i <= result.length; i++) {
                    if (i < result.length - 1) {
                        $('#accDivName').append(result[i].Division_Name + ',');
                    }
                    else {
                        $('#accDivName').append(result[i].Division_Name);
                    }
                }
            }
        },
        error: function () {
            HideModalPopup("dvloading");
        }
    });
}
function fnGetDoctorAccompanist(id) {
    var dcr_date = "";
    var doctor_Visit_Code = ""; var mdlno = ""; var doc_name = ""; var category = "";
    var details = $("#divDocAccDetails_" + id).text().trim().split('$');
    var userCode = $('#hdnUserCodeApproval').val();
    dcr_date = details[0];
    doctor_Visit_Code = details[1];
    mdlno = details[2];
    doc_name = details[3];
    category = details[4];
    $("#dvAccOverLay").overlay().load();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetDoctorVisitAccName',
        data: "dcr_date=" + dcr_date + "&doctor_Visit_Code=" + doctor_Visit_Code + "&user_code=" + userCode,
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


// POB Order 


function fnGetPOBProductDetailsforReport(Order_Id) {
    debugger;
    $.ajax({
        start: ShowModalPopup("dvloading"),
        type: 'POST',
        data: 'orderId=' + Order_Id,
        url: 'Order/GetOrder',
        async: false,
        success: function (response) {
            if (response != null && response != undefined) {
                fnBuildPOBDetails(response);
            }
        },
        complete: function () {
            HideModalPopup("dvloading");
        }
    });
}

function fnBuildPOBDetails(jsonPOB) {
    if (jsonPOB.lstHeader.length > 0) {
        var strPOB = "<table style='width:100%' class='data display box'><tbody><tr>";
        strPOB += "<tr><td colspan='2'>Customer Name : </td><td colspan='2'>" + jsonPOB.lstHeader[0].Customer_Name + "</td></tr>";
        var orderDueDate = new Date(eval(jsonPOB.lstHeader[0].Order_Due_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
        strPOB += "<tr><td>Stockist Name : </td><td>" + jsonPOB.lstHeader[0].Stockist_Name + "</td><td>Due Date : </td><td>" + (orderDueDate.getMonth() + 1) + "/" + orderDueDate.getDate() + "/" + orderDueDate.getFullYear() + "</td></tr>";
        strPOB += "<tr><td colspan='4'>";

        strPOB += "<table style='width:100%' class='data display box'>";
        strPOB += "<thead>";
        strPOB += "<tr>";
        strPOB += "<th>Product Name</th><th>Qty</th><th>Unit Rate</th><th>Amount</th>";
        strPOB += "</tr>";
        strPOB += "<thead>";
        strPOB += "<tbody>";
        for (var pRCount = 0; pRCount < jsonPOB.lstDetails.length; pRCount++) {
            strPOB += "<tr><td>" + jsonPOB.lstDetails[pRCount].Product_Name + "</td><td>" + jsonPOB.lstDetails[pRCount].Product_Qty + "</td><td>" + jsonPOB.lstDetails[pRCount].Unit_Rate + "</td><td>" + jsonPOB.lstDetails[pRCount].Amount + "</td></tr>";
        }
        strPOB += "</tbody>";
        strPOB += "<tfoot>";
        strPOB += "<tr>No of Products : " + jsonPOB.lstHeader[0].No_Of_Products + "</tr><tr></tr><tr>Total Qty : " + jsonPOB.lstHeader[0].Total_Qty + "</tr><tr>Total POB : " + jsonPOB.lstHeader[0].Total_POB_Value + "</tr>";
        strPOB += "</tfoot>";
        strPOB += "</table>";

        strPOB += "<tr><td colspan='4'>Remarks :</td><tr>";
        strPOB += "<tr><td colspan='4'>" + jsonPOB.lstHeader[0].Remarks + "</td><tr>";
        strPOB += "</td><tr>";
        strPOB += "</tbody></table>";

        $("#dvMoreInfoHeader").html("POB Details");
        $("#dvInfoContent").html(strPOB);
        ShowModalPopup("dvMoreInfoModal");
    }
}

function GetCompanyCode() {
    debugger;
    if (Company_Code == '') {
        var _this = null;
        var url = window.location.href;
        url = url.split("/")[2];
        context = ["CompanyApi/GetCompanyDetails", url];
        CoreREST.getsync(_this, context, null, GetCompanyCodesuccess, fnCheckReconfailure);

    }
}
function GetCompanyCodesuccess(data) {
    Company_Code = data.list[0].Company_Code;
}
function fnCheckRecon(month, year, userCode) {
    debugger;
    //var value = fnGetPrivilegeValue("SAMPLE_RECON_EFFECTIVE_FROM", "");
    //if (value.length > 0) {
    var _this = null;
    context = ["Api/ReconApi/CheckPendingReconInDCRApproval", Company_Code, userCode, month, year];
    CoreREST.get(_this, context, null, fnCheckReconSuccess, fnCheckReconfailure);
    //  }
}
function fnCheckReconSuccess(data) {
    debugger;
    recon_Status = data;

}
function fnCheckReconfailure() {

}

//function fnGetDCRLeavePrivilege(userCode, DCR_Flag) {
//    debugger;
//    $.ajax({
//        type: 'GET',
//        url: '../HiDoctor_Master/Approval/GetLeavePrivilege',
//        data: 'userCode=' + userCode,
//        success: function (result) {
//            debugger;
//            if (DCR_Flag == 'L' || DCR_Flag == 'F,A,L') {
//                if (result == "YES") {
//                    fnMsgAlert('info', 'Info', "You cannot delete Leave Type DCR's from DCR Delete Screen. Please go to Delete Leave DCR Screen in order to do so.");
//                    return false;
//                }
//                else {
//                    fnShowDeleteDCR();
//                }
//            }
//            else {
//                fnShowDeleteDCR();
//            }
//        }
//    });
//}
function fngetCMEProductDetails(DCR_Code, DCR_Attendance_Doctor_Id, CME_Id) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetCMEProductDetails',
        data: "DCR_Code=" + DCR_Code + '&DCR_Attendance_Doctor_Id=' + DCR_Attendance_Doctor_Id + '&CME_Id=' + CME_Id,
        success: function (response) {
            var str = '';
            if (response.length > 0) {
                str = "<div class='gridHeader'><h3 style='width: 85%;margin:0px auto;background: grey;'>CME Details</h3></div>";
                str += "<label style='margin-left: 55px;padding: 10px;'>No of Month Tracked : " + response[0].No_Of_Months + "</label>";
                str += "<table id='tblCME' style='width: 85%;' class='data display dataTable box'><thead>";
                str += "<th>Product Name</th><th>Current Sales</th><th>ExpectedSales</th></thead>";
                str += "<tbody>";
                for (var i = 0; i < response.length; i++) {
                    str += "<tr>";
                    str += "<td>" + response[i].Product_Name + "</td><td>" + response[i].Current_Sales + "</td><td>" + response[i].Expected_Sales + "</td>"
                    str += "</tr>";

                }
                str += "</tbody></table>";
                $('#dvCMEDetails').css('display', '');
                $('#dvCMEDetails').html(str);

            }
            else {
                $('#dvCMEDetails').html('No Record found');
            }
            $("#dvCME").show();

        },
        error: function () {

        }
    });
}
function fnshowattachments(url) {
    debugger;
    $('#dvExpense').overlay().load();
    $('#tblexpense').html('<img src=' + url + ' style="width:50%;max-width:1000px;height:50%;max-height:1000px;text-align:center;">');
}
function fnshowDRReport(headerid) {
    debugger;
    Method_params = ["DieticianReporting/GetDieticianReportingdetailsforDCR", Company_Code, Region_Code, headerid];
    CoreREST.get(null, Method_params, null, fngetDieticianReportingdetailsSuccessData, fngetDieticianReportingdetailsFailure);
}

function fngetDieticianReportingdetailsSuccessData(response) {
    debugger;
    $("#dvDRdetails").html("");
    var content = "";
    for (var i = 0; i < response.list.lstheaderdetails.length; i++) {
        content += "<h3>Camp" + (i + 1) + "</h3>";
        content += "<table class='data display dataTable box' style='width:100%'>";
        content += "<thead>";
        content += "<tr>";
        content += "<th>Filled By</th>";
        content += "<th>Region Name</th> ";
        content += "<th>Start Date</th>";
        content += "<th>Start Time</th>";
        content += "<th>End Time</th>";
        content += "<th>Camp Type</th>";
        content += "<th>Camp Sub Type</th>";
        content += "<th>Location</th>";
        content += "<th>Doctor Count</th>";
        content += "<th>Patient Count</th>";
        content += "<th>Prescription Count</th>";
        content += "</tr>";
        content += "</thead>";
        headerid = response.list.lstheaderdetails[i].Camp_Sub_Type;
        var CST = response.list.lstheaderdetails[i].Camp_Sub_Type;
        var disjson = $.grep(response.list.lstheaderdetails, function (ele, index) {
            return ele.Camp_Sub_Type == headerid;
        });
        content += "<tbody>";
        //   for (var d = 0; i < disjson.length; x++) {
        var a = disjson[0].Start_date.split("T");
        content += "<tr>";
        content += "<td>" + disjson[0].Filled_By + "</td>";
        content += "<td>" + disjson[0].Region_Name + "</td>";
        content += "<td>" + a[0] + "</td>";
        content += "<td>" + disjson[0].Start_Time + "</td>";
        content += "<td>" + disjson[0].End_Time + "</td>";
        content += "<td>" + disjson[0].Activity_Name + "</td>";
        content += "<td>" + disjson[0].SubActivity_Name + "</td>";
        content += "<td>" + disjson[0].Location + "</td>";
        if (disjson[0].Noofdoctors != 0) {
            content += "<td>" + disjson[0].Noofdoctors + "</td>";
        }
        else {
            content += "<td>-</td>";
        }
        if (disjson[0].Noofpatients != 0) {
            content += "<td>" + disjson[0].Noofpatients + "</td>";
        }
        else {
            content += "<td>-</td>";
        }
        if (disjson[0].Noofprescriptions != 0) {
            content += "<td>" + disjson[0].Noofprescriptions + "</td>";
        }
        else {
            content += "<td>-</td>";
        }
        content += "</tr>";
        //  }
        content += "</tbody>";
        content += "</table>";
        if (response.list.lstAccompdetails.length > 0) {
            content += "<table style='width:100%' class='data display dataTable box'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Accompanist Name</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";
            var disjson = $.grep(response.list.lstAccompdetails, function (ele, index) {
                return ele.Accompanist_Code == headerid;
            });
            for (var k = 0; k < disjson.length; k++) {
                content += "<tr>";
                if (disjson[k].User_Name != null) {
                    content += "<td>" + disjson[k].User_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
        if (response.list.lstdoctordetails.length > 0) {
            content += "<table style='width:100%' class='data display dataTable box'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Doctor Name</th>";
            content += "<th>Speciality Name</th>";
            content += "<th>Prescription Value</th>";
            content += "<th>Notes</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";
            var disjson = $.grep(response.list.lstdoctordetails, function (ele, index) {
                return ele.Doctor_Code == headerid;
            });
            for (var m = 0; m < disjson.length; m++) {
                content += "<tr>";
                if (disjson[m].Customer_Name != null) {
                    content += "<td>" + disjson[m].Customer_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }

                if (disjson[m].Speciality_Name != -1) {
                    content += "<td>" + disjson[m].Speciality_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[m].Prescription_Value != 0) {
                    content += "<td>" + disjson[m].Prescription_Value + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[m].Notes != null) {
                    content += "<td>" + disjson[m].Notes + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
        if (response.list.lstpatientdetails.length > 0) {
            content += "<table style='width:100%' class='data display dataTable box'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Parameter Type</th>";
            content += "<th>Patient Name</th>";
            content += "<th>Age</th>";
            content += "<th>Gender</th>";
            content += "<th>Prescription Value</th>";
            content += "<th>Notes</th>";
            content += "</tr>";
            content += "</thead>";

            content += "<tbody>";
            var disjson = $.grep(response.list.lstpatientdetails, function (ele, index) {
                return ele.Parameter_Value == headerid;
            });
            for (var n = 0; n < disjson.length; n++) {
                content += "<tr>";
                if (disjson[n].Parametertype_Name != null) {
                    content += "<td>" + disjson[n].Parametertype_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Patient_Name != null) {
                    content += "<td>" + disjson[n].Patient_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Age != 0) {
                    content += "<td>" + disjson[n].Age + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Gender != -1 && disjson[n].Gender != null) {
                    content += "<td>" + disjson[n].Gender + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Total_Prescription_Value != 0) {
                    content += "<td>" + disjson[n].Total_Prescription_Value + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[n].Notes != null) {
                    content += "<td>" + disjson[n].Notes + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
        if (response.list.lstprescriptiondetails.length > 0) {
            content += "<table style='width:100%' class='data display dataTable box'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Product Name</th>";
            content += "<th>No of Prescriptions</th>";
            content += "<th>No of Prescription Value</th>";
            content += "<th>Notes</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";
            var disjson = $.grep(response.list.lstprescriptiondetails, function (ele, index) {
                return ele.Product_Code == headerid;
            });
            for (var o = 0; o < disjson.length; o++) {
                content += "<tr>";
                if (disjson[o].Product_Name != null) {
                    content += "<td>" + disjson[o].Product_Name + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[o].No_of_Prescriptions != 0) {
                    content += "<td>" + disjson[o].No_of_Prescriptions + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[o].No_of_PrescriptionValue != 0) {
                    content += "<td>" + disjson[o].No_of_PrescriptionValue + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }
                if (disjson[o].Notes != null) {
                    content += "<td>" + disjson[o].Notes + "</td>";
                }
                else {
                    content += "<td>-</td>";
                }

                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
    }
    $("#dvDRdetails").append(content);
    $("#dvDR").show();
}
function fngetDieticianReportingdetailsFailure() {

}