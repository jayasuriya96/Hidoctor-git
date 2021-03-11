
function fnShowUserDetail() {
    debugger; 
    $("#dvTable").html("");
    //$('#dvTable2').html("");
    //if (selKeys == "") {
    //    fnMsgAlert('info', 'Send SMS', 'Please Select User.');
    //    return false;
    //}

    //if (!(fnValidateDateFormate($("#fromDate"), "From Date"))) {
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    //if (!(fnValidateDateFormate($("#toDate"), "To Date"))) {
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    //if ($('#fromDate').val() == "") {
    //    fnMsgAlert('info', 'Send SMS', 'Please select From Date');
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    //if ($('#toDate').val() == "") {
    //    fnMsgAlert('info', 'Send SMS', 'Please select To Date');
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    
    $('#lblmessage').html("");

   

    fromDate_g = $("#fromDate").val().split('/')[2] + "/" + $("#fromDate").val().split('/')[1] + "/" + $("#fromDate").val().split('/')[0];
    toDate_g = $("#toDate").val().split('/')[2] + "/" + $("#toDate").val().split('/')[1] + "/" + $("#toDate").val().split('/')[0];
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/SMS_UserIdCreation/GetUserInfo',
        data: "fromDate=" + fromDate_g + "&toDate=" + toDate_g,
        success: function (result) {
            if (result != '') {
                debugger;
                 $("#dvTable").html(result);
                //var grid = new ej.grids.Grid({
                //    dataSource: result,
                //    // rowSelected: fnRowSelected,
                //    showColumnChooser: true,
                //    allowPaging: true,
                //    allowGrouping: true,
                //    allowSorting: true,
                //    allowFiltering: true,
                //    allowResizing: true,
                //    allowCellMerging: true,
                //    allowScrolling: true,
                //    allowExcelExport: true,
                //    pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                //    filterSettings: { type: 'CheckBox' },
                //    toolbar: ['Search', 'ColumnChooser'],
                //    aggregates: [],
                //    columns: [
                //         { headerText: '<input type="checkbox" onclick="fnselectall();" id="bulkcheck"> Select All', template: '<input type="checkbox" name="checkSendSMS">', width: 120, textAlign: 'center' },
                //         { field: 'Employee_Name', headerText: 'Employee Name', width: 250, textAlign: 'center' },
                //         { field: 'Employee_Number', headerText: 'Employee Number', width: 250, textAlign: 'center' },
                //         { field: 'User_Name', headerText: 'User Name', width: 250, textAlign: 'center' },
                //         { field: 'User_Type_Name', headerText: 'Designation', width: 250, textAlign: 'center' },
                //         { field: 'Region_Name', headerText: 'Region Name', width: 250, textAlign: 'center' },
                //         { field: 'Under_User_Name', headerText: 'Reporting To', width: 250, textAlign: 'center' },
                //         { field: 'Created_Date', headerText: 'Created Date', width: 250, textAlign: 'center' },
                //         { field: 'HiDoctor_Start_Date', headerText: 'HiDoctor Start Date', width: 250, textAlign: 'center' },
                //         { field: 'Division_Name', headerText: 'Division', width: 250, textAlign: 'center' },
                //         { field: 'SMS_count', headerText: 'Sent SMS Count', width: 250, textAlign: 'center' },
                //    ],
                //    queryCellInfo: fnqueryCellInfo,
                //});
                //grid.appendTo('#dvTable');
                $("#SendSMS").show();
            }
            else {
                $('#lblmessage').html("No data found");
                $("#SendSMS").hide();
            }
            HideModalPopup("dvloading");

        }
    });
}

//function fnqueryCellInfo(args) {
//    debugger;
//    if (args.column.headerText == '<input type="checkbox" onclick="fnselectall();" id="bulkcheck"> Select All') {
//        if (args.cell.innerHTML == '<input type="checkbox" name="checkSendSMS">') {
//            args.cell.innerHTML = '<input type="checkbox" name="checkSendSMS" value="' + args.data.User_Code + '">';
//        }
//    }
//}
function fnselectall() {
    if ($('#bulkcheck').is(":checked")) {
        $("input:checkbox[name=chk_UserInfo]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chk_UserInfo]").removeAttr('checked');
    }
}

function fnSendSMS() {
    $('#lblmessage').html("");
    //if (!$("input[name='chk_UserInfo']").is(":checked")) {
    //    fnMsgAlert('info', 'Send SMS', 'Please select User');
    //    return false;
    //}
    var userCode = ""
    $("input:checkbox[name=chk_UserInfo]").each(function () {
        if (this.checked) {
            userCode += "" + $(this).val() + ",";
        }
    });
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/SMS_UserIdCreation/SendPassword',
        data: "userCode=" + userCode,
        success: function (result) {
            debugger
            if (result != '') {
                $("#dvTable2").html(result.split('*')[0]);
                // $('#lblmessage').html(result.split('*')[1]);
                fnMsgAlert('info', '', result.split('*')[1]);
                //fnMsgAlert('info', '', result.split('*')[0]);
            }
           // cancel();
            //$('#fromDate').val("");
            fnShowUserDetail();
            HideModalPopup("dvloading");
        }
    });
}

function fnGetSentSMSDetails(userCode) {
    debugger
    $.ajax({
        type:"GET",
        url:'../HiDoctor_Master/SMS_UserIdCreation/GetSMSDetails',
        data: "userCode=" + userCode,
        success: function(result){
            if(result != ''){
                $('#divBody').html(result);
                $('#myModal').modal('show');
            }
        }
    });
}

