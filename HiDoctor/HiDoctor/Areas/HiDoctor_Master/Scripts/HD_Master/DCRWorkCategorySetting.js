function fngetcategoryname()
{
    debugger;
    $.ajax({
        type: 'GET',
        url: '../HiDoctor_Master/Target_Setting/GetWorkCategory',
        success: function (response) {
            debugger;
            var html = '<option value="0">--Select Work Category--</option>';
            if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    html += '<option value="' + response[i].Expense_Entity_Code + '">' + response[i].Expense_Entity_Name + '</option>';
                }
                $('.Categorytype').html(html);
            }
        }, Error: function () {

        },
    });
}
function fnValidateBudget(Id, evt) {
    debugger;
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 10) {
            return false;

        }
    }
    var value = $('#' + Id.id + '').val();
    var RE = new RegExp(/^\d*\.?\d{0,1}$/g);
    if (RE.test(value)) {
        return true;
    } else {
        return false;
    }
}
function fnsubmit()
{
    debugger;
    var category = $('#Category').val();
    var kilometer=$('#Kilometer').val();
    var lesscategory = $('#lessCategory').val();
    var greatercatergory = $('#GreaterCategory').val();
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();
    if (UserTypeCode == '')
    {
        fnMsgAlert('info', 'Category', 'Please select user type');
        return false;
    }
    if(category==0)
    {
        fnMsgAlert('info', 'Category', 'Please select work categroy');
        return false;
    }

    if (kilometer <-2)
    {
        fnMsgAlert('info', 'Category', 'Please Enter Valid kilometer');
        return false;
    }
    if(lesscategory==0)
    {
        fnMsgAlert('info', 'Category', 'Please select Category Less than Kilometer');
        return false;
    }
    if (greatercatergory == 0) {
        fnMsgAlert('info', 'Category', 'Please select Category Greater than Kilometer');
        return false;
    }
    if (startdate == '') {
        fnMsgAlert('info', 'Category', 'Please enter Effective From');
        return false;
    }
    if (enddate == '') {
        fnMsgAlert('info', 'Category', 'Please enter Effective To');
        return false;
    }
    var lst = $.grep(Details, function (element, index) {
        debugger;
        return (element.User_Type_Code === UserTypeCode && (new Date(startdate) >= new Date(element.Effective_From) && new Date(startdate) <= new Date(element.Effective_To)) && category == element.Category && element.Status == "Active")

    });
    if (lst.length > 0)
    {
        fnMsgAlert('info', 'Category', ' Category Setting is already mapped to this user type ');
        return false;
    }
    var obj = {
        User_Type_Code: UserTypeCode,
        Category: category,
        Kilometer: kilometer,
        Less_than_Kilometer: lesscategory,
        Greater_than_kilometer: greatercatergory,
        Effective_From: startdate,
        Effective_To: enddate
    }
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/Target_Setting/InsertCategorySetting',
        data: obj,
        success: function (response) {
            if(response==1)
            {
                fnMsgAlert('success', 'Expense', 'Saved Successfully');
                fnclear();
                fngetallworkcategorysettings();
            }
        },
        error: function () {

        }
    });
}
function fnclear() {
    $("#startdate").val('');
    $("#enddate").val('');
    $('#Category').val(0);
    $('#lessCategory').val(0);
    $('#GreaterCategory').val(0);
    $('#Kilometer').val('');
}
function fngetallworkcategorysettings()
{
    $.ajax({
        url: '../HiDoctor_Master/Target_Setting/Getallcategorysetting',
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
                          { field: 'Kilometer', headerText: 'Kilometer', textAlign: 'left' },
                            { field: 'Category_Name', headerText: 'Category_Name', textAlign: 'left' },
                        { field: 'Less_than_Kilometer', headerText: 'Less than Kilometer Category', textAlign: 'left' },
                             { field: 'Greater_than_Kilometer', width: 150, headerText: 'Greater than Kilometer Category', },
                                { field: 'Status', width: 150, headerText: 'Status', textAlign: 'left' },
                                { field: 'Startdate', width: 150, headerText: 'Effective From', format: 'yMd', textAlign: 'center' },
                                { field: 'Enddate', width: 150, headerText: 'Effective To', format: 'yMd', textAlign: 'center' },
                        //{ field: 'Created_Date', width: 150, headerText: 'Created Date ', format: 'yMd', textAlign: 'center' },
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
            args.cell.innerHTML = "<a herf=# style='cursor:pointer;color:blue;' onclick='fnalert(\"" + args.data.WC_id + "\");'>Change Status</a>";
        }
    }
}
function fnalert(id) {
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
function fnChangeStatus(id) {
    $.ajax({
        url: '../HiDoctor_Master/Target_Setting/ChangeStatus',
        data: 'id=' + id,
        success: function (response) {
            fngetallworkcategorysettings();
        },
        error: function () {

        }
    });
}