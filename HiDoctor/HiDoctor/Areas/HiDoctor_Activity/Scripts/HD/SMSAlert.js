var month = new Array();
var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

var DateDetails = "";
var Year = [];
var atcObj;
var grid;
var ReportGenerateId = "";
var globaldd = "";
var show_SentHistory = "";
var SMSAlerts = {
    fnMonthAndYearDrpdn: function () {
        var startDate = new Date(new Date().getFullYear() - 2 + '-' + (new Date().getMonth() + 1) + '-01'); //YYYY-MM-DD
        var endDate = new Date(); //YYYY-MM-DD
        var dateArr = SMSAlerts.getDateArray(startDate, endDate);
        var lstDates = [];

        for (var i = dateArr.length; i > 0; i--) {
            _objData = {};
            _objData.value = dateArr[i - 1];
            _objData.label = dateArr[i - 1];
            lstDates.push(_objData);
        }
        DateDetails = lstDates;
        atcObj = new ej.dropdowns.DropDownList({
            dataSource: lstDates,
            fields: { text: 'label', value: 'value' },
            popupHeight: '200px',
            change: function () { SMSAlerts.fnGetScheduleDates(); }
        });
        SMSAlerts.fnGetUserTypes();
        atcObj.appendTo('#txtMonthYear');
        atcObj.index = 0;
    },
    getDateArray: function (start, end) {
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {

            var dates = new Date(dt);
            var months = dates.getMonth() + 1;
            var Years = dates.getFullYear();
            var month_Year = monthNames[parseInt(months) - 1] + '-' + Years;
            var exists = $.grep(arr, function (v) {
                return v == month_Year;
            });
            if (exists.length == 0) {
                arr.push(month_Year);
            }

            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    },
    fnGetScheduleDates: function () {
        var mANDy = $("#txtMonthYear").val();
        var y = "";
        var m = "";
        var schedule_Dates = "";
        y = mANDy.split('-')[1];
        m = mANDy.split('-')[0];
        m = monthNames.indexOf(m);
        m = m + 1;
        $('#schedule_Dates').html('');
        $.ajax({
            type: 'GET',
            url: '../HiDoctor_Activity/SMS/GetScheduleDates',
            data: "month=" + m + "&year=" + y,
            success: function (result) {
                $('#btnSendSMS').hide();
                $('#btnSendSMSToAll').hide();
                $('#dvSMSDetails').html('');
                if (result != '') {
                    schedule_Dates = result;
                    SMSAlerts.fnBindScheduleDates(schedule_Dates, m, y);
                }
                else {
                    fnMsgAlert('info', 'Info', 'No scheduled dates found for the selected month');
                    return false;
                }
            }
        });
    },
    fnGetUserTypes: function () {
        debugger;
        $.ajax({
            type: 'GET',
            url: '../HiDoctor_Activity/SMS/GetUserTypes',
            success: function (result) {
                debugger;
                var userTypeArr = [];
                userTypeArr.push({ "value": "All", "label": "All" });

                for (var i = 0; i < result.length; i++) {
                    _objData = {};
                    _objData.value = result[i].User_Type_Code;
                    _objData.label = result[i].User_Type_Name;
                    userTypeArr.push(_objData);
                }

                var data = userTypeArr;

                var dropDownListObj = new ej.dropdowns.DropDownList({
                    dataSource: data,
                    fields: { text: 'label', value: 'value' }
                });
                dropDownListObj.appendTo('#txtUserType');
            }
        })
    },
    fnBindScheduleDates: function (schedule_Dates, m, y) {
        var htmlContent = "";

        for (var i = 0; i < schedule_Dates.length; i++) {
            htmlContent += '<div class="s_date" style="padding: 1rem;">';
            htmlContent += '<span>' + (schedule_Dates[i].schedule_day + "-" + m + "-" + y) + '</span>';
            htmlContent += '</div>';
        }

        $("#schedule_Dates").html(htmlContent);

        var trigger = $("#schedule_Dates span");
        trigger.click(function () {
            globaldd = this.textContent;
            SMSAlerts.fnGetDetails(globaldd);
        });
    },
    fnSetUserType: function (val) {
        if (val == 0) {
            $('#txtUserType').val('All');
            $("#txtUserType").prop("disabled", false);
        }
        else {
            $('#txtUserType').val('All');
            $("#txtUserType").prop("disabled", true);
        }
    },
    fnGetDetails: function (dd) {
        show_SentHistory = $('input:radio[name=rdShowHistory]:checked').val();
        $('#compdate').show();
        $('#dvSMSDetails').html('');
        selected_date = dd.split('-')[2] + "-" + ("0" + dd.split('-')[1]).slice(-2) + "-" + ("0" + dd.split('-')[0]).slice(-2);
        if (show_SentHistory == "0") {
            SMSAlerts.fnGetComplianceDetails(selected_date);
        }
        else {
            $('#btnSendSMS').hide();
            $('#btnSendSMSToAll').hide();
            SMSAlerts.fnGetSentSMSDetails(selected_date);
        }
    },
    fnGetComplianceDetails: function (selected_date) {
        debugger;
        $('#dvSMSDetails').html('');
        /*var userType = $('#txtUserType').val();
        if (userType == "") {
            fnMsgAlert('info', 'Info', 'Please select User Type Name');
            return false;
        }
        else {*/
            $.ajax({
                type: 'GET',
                url: '../HiDoctor_Activity/SMS/GetSMSComplianceReport',
                //data: 'selected_date=' + selected_date + '&userType=' + userType,
                data: 'selected_date=' + selected_date,
                success: function (result) {
                    for (var i = 0; i < result.length; i++) {
                        var message = "";
                        message = 'MSR : ' + result[i].User_Name;
                        message = message + '</br>HQ : ' + result[i].Region_Name;
                        message = message + '</br>';
                        message = message + '</br>V3 Met : ';
                        //message = message + '</br> a. More Than Thrice : ' + result[i].V3GT;
                        message = message + '</br>a.Thrice : ' + result[i].V3EQ;
                        message = message + '</br>b.Twice : ' + result[i].V3_2;
                        message = message + '</br>c.Once : ' + result[i].V3_1;
                        message = message + '</br>d.Not Met : ' + (result[i].TotalV3Doctor - result[i].V3GT - result[i].V3EQ - result[i].V3_2 - result[i].V3_1);
                        message = message + '</br>';
                        message = message + '</br>V2 Met : ';
                        //message = message + '</br> a. More Than Twice : ' + result[i].V2GT;
                        message = message + '</br>a.Twice : ' + result[i].V2EQ;
                        message = message + '</br>b.Once : ' + result[i].V2_1;
                        message = message + '</br>c.Not Met : ' + (result[i].TotalV2Doctor - result[i].V2GT - result[i].V2EQ - result[i].V2_1);
                        message = message + '</br>';
                        message = message + '</br>V1 Met : ';
                        //message = message + '</br> a. More Than Once : ' + result[i].V1Gt;
                        message = message + '</br>a.Once : ' + result[i].V1EQ;
                        message = message + '</br>b.Not Met : ' + (result[i].TotalV1Doctor - result[i].V1Gt - result[i].V1EQ);
                        result[i].Message = message;
                    }
                    grid = new ej.grids.Grid({
                        dataSource: result,
                        showColumnChooser: true,
                        allowPaging: true,
                        allowGrouping: true,
                        allowSorting: true,
                        allowFiltering: true,
                        allowResizing: true,
                        allowCellMerging: true,
                        allowScrolling: true,
                        allowExcelExport: true,
                        gridLines: 'Both',
                        selectionSettings: { checkboxOnly: true },
                        height: 400,
                        pageSettings: { pageSize: 100, pageSizes: [20, 50, 100], pageCount: 100 },
                        filterSettings: { type: 'CheckBox' },
                        toolbar: ['ExcelExport', 'Search', 'ColumnChooser'],

                        aggregates: [],
                        columns: [
                            { type: "checkbox", headerText: 'Select', field: "", allowFiltering: false, allowSorting: false, width: '60' },
                            { field: 'Employee_Name', headerText: 'Employee Name', textAlign: 'center' },
                            { field: 'User_Name', headerText: 'User Name', textAlign: 'center' },
                            { field: 'User_Type_Name', headerText: 'User Type Name', textAlign: 'center' },
                            { field: 'Division_Name', headerText: 'Division Name', textAlign: 'center' },
                            { field: 'Region_Name', headerText: 'Region Name', textAlign: 'center' },
                            { headerText: 'SMS Message', template: "<a href='';>View Message</a>", textAlign: 'center' },
                            { headerText: 'SMS Logs', template: "<a href='';>Logs</a>", textAlign: 'center' },
                            { field: 'Message', headerText: 'Message', textAlign: 'center', visible: false },
                            { field: 'Manager_Emp_Name', headerText: 'Manager Name', textAlign: 'center' },
                            { field: 'Sup_Manager_Emp_Name', headerText: 'Sup. Manager Name', textAlign: 'center' },
                            { field: 'SMS_To_Be_Sent_User_Name', headerText: 'SMS Will Be Sent To User Name', textAlign: 'center' },
                            { field: 'Mobile_Number', headerText: 'Mobile No.', textAlign: 'center' },
                            { field: 'SMS_Url', headerText: 'SMS URL', textAlign: 'center', visible: false }
                        ],
                        rowDataBound: (args) => {
                            if (args.data['Mobile_Number'] == "" || args.data['Mobile_Number'] == null) {
                                args.row.getElementsByClassName('e-gridchkbox')[0].classList.add('disablecheckbox');
                                args.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add('disablecheckbox')
                            }
                            if (args.data['SMS_Url'] == "" || args.data['SMS_Url'] == null) {
                                args.row.getElementsByClassName('e-gridchkbox')[0].classList.add('disablecheckbox');
                                args.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add('disablecheckbox')
                            }
                        },
                        checkBoxChange: (args) => {
                            var customselect = [];
                            if (args.checked && args.target.classList.contains('e-checkselectall')) {
                                for (var i = 0; i < args.selectedRowIndexes.length; i++) {
                                    var row = grid.getRowByIndex(args.selectedRowIndexes[i]);
                                    if (!row.querySelector('.disablecheckbox')) {
                                        customselect.push(args.selectedRowIndexes[i])
                                    }
                                }
                                grid.selectRows(customselect)
                            }
                        },
                        queryCellInfo: SMSAlerts.queryCellInfo,
                    });
                    grid.appendTo('#dvSMSDetails');

                    grid.toolbarClick = function (args) {
                        if (args.item.id === 'dvSMSDetails_excelexport') {
                            grid.columns[0].visible = false;
                            grid.columns[5].visible = false;
                            grid.columns[7].visible = true;
                            grid.excelExport();
                        }
                    };
                    var style = $("#customSyncStyle").html();
                    $("#customSyncStyle").html(style);
                }
            });
            $('#btnSendSMS').show();
            $('#btnSendSMSToAll').show();
        //}
    },
    fnGetSentSMSDetails: function (selected_date) {
        $.ajax({
            type: 'GET',
            url: '../HiDoctor_Activity/SMS/GetSentSMSDetails',
            data: 'selected_date=' + selected_date,
            success: function (result) {
                for (var i = 0; i < result.length; i++) {
                    var message = "";
                    message = 'MSR : ' + result[i].User_Name;
                    message = message + '</br>HQ : ' + result[i].Region_Name;
                    message = message + '</br>';
                    message = message + '</br>V3 Met : ';
                    //message = message + '</br> a. More Than Thrice : ' + result[i].V3GT;
                    message = message + '</br>a.Thrice : ' + result[i].V3EQ;
                    message = message + '</br>b.Twice : ' + result[i].V3_2;
                    message = message + '</br>c.Once : ' + result[i].V3_1;
                    message = message + '</br>d.Not Met : ' + (result[i].TotalV3Doctor - result[i].V3GT - result[i].V3EQ - result[i].V3_2 - result[i].V3_1);
                    message = message + '</br>';
                    message = message + '</br>V2 Met : ';
                    //message = message + '</br> a. More Than Twice : ' + result[i].V2GT;
                    message = message + '</br>a.Twice : ' + result[i].V2EQ;
                    message = message + '</br>b.Once : ' + result[i].V2_1;
                    message = message + '</br>c.Not Met : ' + (result[i].TotalV2Doctor - result[i].V2GT - result[i].V2EQ - result[i].V2_1);
                    message = message + '</br>';
                    message = message + '</br>V1 Met : ';
                    //message = message + '</br> a. More Than Once : ' + result[i].V1Gt;
                    message = message + '</br>a.Once : ' + result[i].V1EQ;
                    message = message + '</br>b.Not Met : ' + (result[i].TotalV1Doctor - result[i].V1Gt - result[i].V1EQ);
                    result[i].Message = message;
                }

                $.each(result, function (index, ele) {
                    if (ele.SMS_Sent_Count == "0")
                        ele.SMS_Sent_Count = "Failure";
                    else if (ele.SMS_Sent_Count == "1")
                        ele.SMS_Sent_Count = "Success";

                    if (ele.SMS_Failure_Reason == null) {
                        ele.SMS_Failure_Reason = "-";
                    }
                });

                grid = new ej.grids.Grid({
                    dataSource: result,
                    showColumnChooser: true,
                    allowPaging: true,
                    allowGrouping: true,
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    allowCellMerging: true,
                    allowScrolling: true,
                    allowExcelExport: true,
                    gridLines: 'Both',
                    filterSettings: { type: 'CheckBox' },
                    height: 400,
                    pageSettings: { pageSize: 100, pageSizes: [10, 20, 30, 40, 50, 100], pageCount: 30 },
                    toolbar: ['ExcelExport', 'Search', 'ColumnChooser'],

                    aggregates: [],
                    columns: [
                        { field: 'Employee_Name', headerText: 'Employee Name', textAlign: 'center' },
                        { field: 'User_Name', headerText: 'User Name', textAlign: 'center' },
                        { field: 'User_Type_Name', headerText: 'User Type Name', textAlign: 'center' },
                        { field: 'Region_Name', headerText: 'Region Name', textAlign: 'center' },
                        { headerText: 'SMS Message', template: "<a href='';>View Message</a>", textAlign: 'center' },
                        { field: 'Message', headerText: 'Message', textAlign: 'center', visible: false },
                        { field: 'Manager_Emp_Name', headerText: 'Manager Name', textAlign: 'center' },
                        { field: 'Sup_Manager_Emp_Name', headerText: 'Sup. Manager Name', textAlign: 'center' },
                        { field: 'Mobile_Number', headerText: 'Mobile No.', textAlign: 'center' },
                        { field: 'SMS_Sent_Count', headerText: 'SMS Sent Status', textAlign: 'center' },
                        { field: 'SMS_Failure_Reason', headerText: 'Failure Reason', textAlign: 'center', width: 600 }
                    ],
                    queryCellInfo: SMSAlerts.queryCellInfo,
                });
                grid.appendTo('#dvSMSDetails');

                grid.toolbarClick = function (args) {
                    if (args.item.id === 'dvSMSDetails_excelexport') {
                        grid.toolbarClick = function (args) {
                            if (args.item.id === 'dvSMSDetails_excelexport') {
                                grid.columns[3].visible = false;
                                grid.columns[4].visible = true;
                                grid.excelExport();
                            }
                        };
                    }
                };
                var style = $("#customSyncStyle").html();
                $("#customSyncStyle").html(style);
            }
        });
    },
    queryCellInfo: function (args) {
        if (args.column.headerText == "SMS Message") {
            if (args.cell.innerText == "View Message") {
                args.cell.style.cursor = "pointer";
                args.cell.style.textDecoration = "underline";
                args.cell.style.color = "blue";
                args.cell.textAlign = 'center';
                args.cell.innerHTML = "<a href='#' onclick='SMSAlerts.fnViewMessage(\"" + args.data.Message + "\");'>View Message</a>";
            }
        }
        if (args.column.headerText == "SMS Logs") {
            if (args.cell.innerText == "Logs") {
                if (args.data['SMS_Sent_Count'] == 0) {
                    args.cell.innerText = "-";
                }
                else {
                    args.cell.style.cursor = "pointer";
                    args.cell.style.textDecoration = "underline";
                    args.cell.innerHTML = "<a href='#' onclick='SMSAlerts.fnViewLog(\"" + args.data.Alert_Sent_Log_Id + "\");'>Logs</a>";
                }
            }
        }
    },
    fnViewMessage: function (Message) {
        debugger;
        $('#sms_Messagge').html('');
        $('#sms_Message').html(Message);
        $("#myModal").modal('show');
    },
    fnViewLog: function (Alert_Sent_Log_Id) {
        debugger;
        var alerthtml = "";
        $('#sms_Messagge').html('');
        $.ajax({
            type: 'GET',
            url: '../HiDoctor_Activity/SMS/GetSentLogs',
            data: 'Alert_Sent_Log_Id=' + Alert_Sent_Log_Id,
            success: function (result) {
                debugger;
                //alerthtml += "<h3 style='margin-top: 10px;'>The below table shows the list of users to whom the selected records SMS was sent.</h3><br/>";
                alerthtml += '<table class="table table-bordered" style="border-collapse: collapse;font-size: 11px; max-height: 200px; overflow-x: auto;">';
                alerthtml += '<thead>';
                alerthtml += '<tr>';
                alerthtml += '<th>Sno</th>';
                alerthtml += '<th>User Name</th>';
                alerthtml += '<th>Date & Time</th>';
                alerthtml += '<th>Mobile Number</th>';
                alerthtml += '<th>SMS Sent Status</th>';
                alerthtml += '</tr>';
                alerthtml += '</thead>';
                alerthtml += '<tbody>';
                for (var i = 0; i < result.length; i++) {
                    alerthtml += '<tr>';
                    alerthtml += '<td>' + (i + 1) + '</td>';
                    alerthtml += '<td>' + result[i].User_Name + '</td>';
                    alerthtml += '<td>' + result[i].Sent_Date + '</td>';
                    if (result[i].Mobile != null) {
                        alerthtml += '<td>' + result[i].Mobile + '</td>';
                    }
                    else {
                        alerthtml += '<td>-</td>';
                    }
                    if (result[i].Sent_Status == 1) {
                        alerthtml += '<td>Success</td>';
                    }
                    else {
                        alerthtml += '<td>Failure</td>';
                    }
                    alerthtml += '</tr>';
                }
                alerthtml += '</tbody>';
                alerthtml += '</table>';
                debugger;
                $('#sms_Message').html(alerthtml);
                $("#myModal").modal('show');
            }
        });
    },
    getSelectedRecords: function (type) {
        debugger;
        $.blockUI();
        var lstData;
        if (type == 'Single') {
            if (grid.getSelectedRecords().length == 0) {
                fnMsgAlert('info', 'Info', 'Please select atleast one user for sending sms');
                return false;
            }
            else {
                lstData = grid.getSelectedRecords();
            }
        }
        else {
            if (grid.getSelectedRecords().length > 0) {
                $.unblockUI();
                fnMsgAlert('info', 'Info', 'You have already selected a few records. Please click on <b>SEND SMS</b> button to Send Them OR Unselect them to send all records using <b>SEND SMS TO ALL</b> button');
                return false;
            }
            else {
                lstData = grid.dataSource;
            }
        }
        var obj = {
            lstModel: lstData
        }
        obj = JSON.stringify(obj);
        debugger;
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/SMS/InsertSelectedRecords',
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            data: obj,
            success: function (result) {
                debugger;
                SMSAlerts.fnGetDetails(globaldd);
                fnMsgAlert('info', 'Info', result.split('|')[0]);
                console.log(result.split('|')[1]);
            },
            error: function () {
            },
            complete: function () {
                $.unblockUI();
            }
        });
    },
}