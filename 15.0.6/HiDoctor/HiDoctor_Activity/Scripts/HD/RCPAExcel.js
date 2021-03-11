function fnGetExcelList(RegionCode_g)
{
    debugger
    $.ajax({
        url: '../HiDoctor_Activity/RCPACompetator/GetExcelList/',
        type: "GET",
        data: 'Regioncode=' + RegionCode_g,
        success: function (result) {
            debugger
                $('#dvFiles').html('');
                var grid = new ej.grids.Grid({
                    dataSource: result,
                    showColumnChooser: true,
                    allowPaging: true,
                    allowGrouping: true,
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    allowCellMerging: true,
                    allowScrolling: true,
                    //pageSettings: { pageSize: 20, pageSizes: [20, 40, 60, 80, 100], pageCount: 5 },
                    pageSettings: { pageSize: 5, pageSizes: [5], pageCount: 100 },
                    filterSettings: { type: 'CheckBox' },
                    toolbar: ['Search', 'ColumnChooser'],
                    aggregates: [],

                    columns: [
                            { field: 'Sno', headerText: 'S.No', width: 100, textAlign: 'center' },
                            { field: 'File_Name', headerText: 'File Name', width: 100, textAlign: 'center' },
                            { field: 'File_Path', headerText: 'File Path', width: 200, textAlign: 'center' },
                            { field: 'User_name', headerText: 'Uploaded By', width: 100, textAlign: 'center' },
                            { field: 'Created_Date', headerText: 'Uploaded Date', width: 100, textAlign: 'center' },
                    ],
                });
                grid.appendTo('#dvFiles');
        },
        error: function (res) {
            debugger;
            fnMsgAlert('info', 'Error', 'ERROR.');
            console.log(res);
        }
    })

}

