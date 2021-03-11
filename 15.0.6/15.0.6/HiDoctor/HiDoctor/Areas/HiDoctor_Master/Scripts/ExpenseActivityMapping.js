function getallexpensetype() {
    debugger;
    $.ajax({
        type: "GET",
        url: '../HiDoctor_Master/Expense/GetExpenseTypeDetails',
        success: function (response) {
            var html = '';
            if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    html += '<input type="checkbox" id="E_' + i + '" name="Expense" value="' + response[i].Expense_Type_Code + '">';
                    html += '<label for="E_' + i + '">' + response[i].Expense_Type_Name + '</label><br>';
                }
                $('#details').html(html);
            }

        },
        Error: function (response) {

        }
    })
}
function getAllActivitytype() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Expense/GetExpenseActivitytype',
        success: function (response) {
            debugger;
            var html = '<option value="0">--Select Activity Type--</option>';
            if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    html += '<option value="' + response[i].Activity_Code + '">' + response[i].Activity_Name + '</option>';
                }
                $('#activitytype').html(html);
            }
        }, Error: function () {

        },
    });
}
function fnselectAll() {
    debugger;
    if ($('#select').prop('checked') == true) {
        $("input:checkbox").prop("checked", true);
    }
    else {
        $("input:checkbox").prop("checked", false);
    }
}
function fnclear() {
    $("input:checkbox").prop("checked", false);
    $("#startdate").val('');
    $("#enddate").val('');
    $("#enddate").val('');
    $('#activity').val(0);
    $('#activitytype').val(0);
}
function fnsubmitexpensemapping() {
    debugger;
    var Expense = [];
    var Estring = '';
    var lst = [];
    if (UserTypeCode == '') {
        fnMsgAlert('info', 'Expense', 'Please select User Type name');
        return false;
    }
    var activity = $('#activity').val();
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();
    if (activity == 0) {
        fnMsgAlert('info', 'Expense', 'Please select Activity');
        return false;
    }
    if (startdate == '') {
        fnMsgAlert('info', 'Expense', 'Please enter Effective From');
        return false;
    }
    if (enddate == '') {
        fnMsgAlert('info', 'Expense', 'Please enter Effective To');
        return false;
    }
   
    var activitytype = '';
    if (activity == 'A') {
        activitytype = $('#activitytype').val();
        if (activitytype == 0) {
            fnMsgAlert('info', 'Expense', 'Please select Expense Activity Type');
            return false;
        }
    }
    else {
        activitytype = '';
    }
    $.each($("input[name='Expense']:checked"), function () {
        var obj = {
            code: $(this).val()
        }
        Expense.push(obj);
        var name=$(this).val();
 
    if (activity == 'F')
    {
         lst = $.grep(Details, function (element, index) {
            debugger;
            return (element.User_Type_Code === UserTypeCode && (new Date(startdate) >= new Date(element.Start_Date) && new Date(startdate) <= new Date(element.End_Date)) && activity == element.Activity_N && name == element.Expense_Code && element.Status == 'Active')

        });
    }
    else {
         lst = $.grep(Details, function (element, index) {
            debugger;
            return (element.User_Type_Code === UserTypeCode && (new Date(startdate) >= new Date(element.Start_Date) || new Date(enddate) <= new Date(element.End_Date)) && activity == element.Activity_N && activitytype == element.Activity_Type && name == element.Expense_Code && element.Status == 'Active')

        });
    }
    });
    if (Expense.length == 0) {
        fnMsgAlert('info', 'Expense', 'Please select Expense Type name');
        return false;
    }

    if (lst.length == 0)
    {
        var obj = {
            activity: activity,
            activitytype: activitytype,
            startdate: startdate,
            enddate: enddate,
            UserTypeCode: UserTypeCode,
            Expense: JSON.stringify(Expense)
        }
        debugger;
        $.ajax({
            url: '../HiDoctor_Master/Expense/InsertExpenseActivityMapping',
            data: obj,
            success: function (response) {
                if (response == 'Success') {
                    fnMsgAlert('success', 'Expense', 'Expense Type  Mapped Successfully');
                    getallexpenseactivitymapping();
                    fnclear();
                }
                else {
                    fnMsgAlert('info', 'Expense', ' Expense Type is already mapped to this Activity ');
                }

            },
            error: function () {

            }
        });
    }
    else {
        var string=''
        for(var i=0;i<lst.length;i++)
        {
            if (i == (lst.length)-1)
            {
                string += lst[i].Expense_Type_Name;
            }
            else {
                string += lst[i].Expense_Type_Name + ',';
            }
        
        }
        fnMsgAlert('info', 'Expense', '' + string + ' is already mapped to this Activity ');
    }

}
function getallexpenseactivitymapping() {
    $.ajax({
        url: '../HiDoctor_Master/Expense/Getallexpenseactivitymapping',
        success: function (response) {
            if (response.length != 0) {
                Details = response;
                $('#Summarytable').html('');
                var grid = new ej.grids.Grid({
                    dataSource: response,
                    toolbar: ['Search'],
                    showColumnChooser: true,
                    allowTextWrap: true,
                    allowResizing: true,
                    //allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    allowGrouping: true,
                    allowScrolling: true,
                    pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                    height: 400,
                    columns: [
                        { headerText: 'Action', width: 150, textAlign: 'center' },
                         { field: 'User_Type_Name', headerText: 'User Type Name', textAlign: 'left' },
                          { field: 'Activity', headerText: 'Activity', textAlign: 'left' },
                            { field: 'Activity_Name', headerText: 'Activity Name', textAlign: 'left' },
                        { field: 'Expense_Type_Name', headerText: 'Expense Type Name', textAlign: 'left' },
                             { field: 'Effective_From', width: 150, headerText: 'Effective From', format: 'yMd', textAlign: 'center' },
                                { field: 'Effective_To', width: 150, headerText: 'Effective To', format: 'yMd', textAlign: 'center' },
                                       { field: 'Status', headerText: 'Status', textAlign: 'left' },
                        { field: 'Created_Date', width: 150, headerText: 'Created Date ', format: 'yMd', textAlign: 'center' },
                    ],
                     queryCellInfo: fnQueryCellInfo,
                });
                grid.appendTo('#Summarytable');
            }

        },
        error: function () {

        }
    });
}
function fnQueryCellInfo(args) {
    debugger;
    if (args.column.headerText == 'Action') {
        if (args.data.Status == "Disable") {
            args.cell.innerHTML = "<a herf=# >Disabled</a>";
        }
        else {
            args.cell.innerHTML = "<a herf=# style='cursor:pointer;color:blue;' onclick='fnalert(\"" + args.data.ExpenseMapping_id + "\");'>Change Status</a>";
        }
    }
}
function fnalert(id)
{
    swal({
        text: "Are you Sure? Do you want to change status",
        buttons: true,
        dangerMode: true,
    })
.then((willDelete) => {
    if (willDelete) {
      
        fnChangeStatus(id);
    }
});
}
function fnChangeStatus(id)
{
    $.ajax({
        url: '../HiDoctor_Master/Expense/ChangeStatus',
        data: 'id=' + id,
        success: function (response) {
            getallexpenseactivitymapping();
        },
        error: function () {

        }
    });
}