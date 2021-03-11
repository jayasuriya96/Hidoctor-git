var weekendGroupNameJson = "";
var LoginUserCode = "";
var WeekendDefineredit = {
    defaults: {

       
        LogUserCode: "",
        Month: "",
        Year: "",
       



    },
}
function fnGetWeekendGroupsedit() {
    try {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/WeekendGroup/GetAllWeekendGroups',
            data: "a",
            success: function (response) {

                var weekendGroup = response;

                var weekDatString = "[";
                for (var i = 0; i < weekendGroup.length; i++) {
                    weekDatString += "{label:" + '"' + "" + weekendGroup[i].Weekend_Off_Name + "" + '",' + "value:" + '"' + "" + weekendGroup[i].Weekend_Off_Code + "" + '"' + "}";
                    if (i < weekendGroup.length - 1) {
                        weekDatString += ",";
                    }
                }
                weekDatString += "];";

                weekendGroupNameJson = eval(weekDatString);
                autoComplete(weekendGroupNameJson, "txtWeekendOffDefiner", "hdnWeekendOffDefinerName", 'autoWeekEndReport');
            },
            error: function (e) {
                fnMsgAlert('info', 'Weekend Group Definer', 'GetAllWeekendGroups Failed.');
            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}
function fnBindWeekendGroup() {
    debugger;
    if ($("#txtWeekendOffDefiner").val() != "") {
        var validWeekGroup = jsonPath(weekendGroupNameJson, "$.[?(@.label=='" + $("#txtWeekendOffDefiner").val() + "')]");
        if (validWeekGroup != false && validWeekGroup !== undefined && validWeekGroup.length > 0) {
            $("#AddWeekend").show();
            //dvWeekendGroupDefinerReport
            try {
                $.ajax({
                    type: "POST",
                    url: '../HiDoctor_Master/WeekendGroup/GetWeekendGroupDefinerReport',
                    data: "weekEndGroupCode=" + validWeekGroup[0].value,
                    success: function (response) {
                        //var weekReport = response;
                       // if (weekReport !== undefined && weekReport.length > 0) {
                        if (response && response.length > 0) {
                            debugger;

                            $('#detailedlist').html('');
                            var grid = new ej.grids.Grid({
                                dataSource: response,
                                queryCellInfo: queryCellInfo,
                                showColumnChooser: true,
                                allowPaging: true,
                                allowGrouping: true,
                                allowSorting: true,
                                allowFiltering: true,
                                allowResizing: true,
                                allowCellMerging: true,
                                allowScrolling: true,
                                // allowExcelExport: true,
                                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                                filterSettings: { type: 'CheckBox' },
                                toolbar: ['Search', 'ColumnChooser'],

                                aggregates: [],
                                columns: [

                                       //{ field: 'MonthName', headerText: 'Month', width: 150, textAlign: 'center' },
                                        { field: 'Year', headerText: 'Year', width: 150, textAlign: 'center' },
                                        { field: 'Date', headerText: 'Date', width: 150, textAlign: 'center' },
                                         { field: 'Day', headerText: 'Day', width: 150, textAlign: 'center' },
                                        //{ field: 'Released_By', headerText: 'Released By', width: 150, textAlign: 'center' },
                                        // { field: 'Actual_Released_By', headerText: 'Actual Released By', width: 150, textAlign: 'center' },
                                         { headerText: 'Action', template: "<a href=#;>Delete</a>", width: 150, textAlign: 'center' },

                                ],

                            });
                            grid.appendTo('#detailedlist');

                        }
                        else {

                            $('#detailedlist').html('No Record Found');
                        }
                    },
                    error: function () {


                        
                    }
                });
            }
            catch (e) {
                fnMsgAlert('error', 'Error', e.message);
                return false;
            }
        }
        else {
            fnMsgAlert('info', 'Weekend Group Definer', 'Please enter Weekend Group Name.');
            return false;
        }
    }
    else {
        fnMsgAlert('info', 'Weekend Group Definer', 'Please enter Weekend Group Name.');
        return false;
    }
}
function queryCellInfo(args) {
    debugger;
    if (args.column.headerText == "Action") {
        if (args.cell.innerText == "Delete") {
            args.data.Status
            args.cell.innerHTML = "<a href='#'onclick=fnDeletedata(\"" + args.data.Year + "\",\"" + args.data.Date + "\",\"" + args.data.Day + "\")>Delete</a>"

        }
        //if (args.data.Stockist_Code == null)
        //    args.cell.innerHTML = "<a></a>";
    }
}
function fnDeletedata(Year, Date,Day) {
    debugger;
    //var LoginUserCode
    var User_Code = LoginUserCode;

    $.ajax(
            {
                    type: "POST",
                    url: '../HiDoctor_Master/WeekendGroup/DeleteWeekend',
                    data: "Year=" + Year + "&Date=" + Date + '&Day=' + Day + '&User_Code=' + LoginUserCode,
                  
                success: function (response) {
                    debugger;
                    if (response >= 1) {
                        fnBindWeekendGroup();
                        fnMsgAlert('success', 'Weekend Group Definer', 'Successfully  Deleted.');
                       

                    }

                    else {
                        fnMsgAlert('info', 'Weekend Group Definer', '  failed .');
                   
                }
                    
                },
                error: function () {

                }
            });
}
function fnAddnewWeekend() {
    debugger;
    if ($("#txtWeekendOffDefiner").val() == "") {
        fnMsgAlert('info', 'Weekend Group Definer', 'Please enter Weekend Group Name.');
        return false;
    }
    var validWeekGroup = jsonPath(weekendGroupNameJson, "$.[?(@.label=='" + $("#txtWeekendOffDefiner").val() + "')]")
    var Date = $('#Frmdate').val();
    

    if (Date != "" && Date != undefined && Date != null) {
        Date = Date.split('-')[2] + '-' + Date.split('-')[1] + '-' + Date.split('-')[0];
    }
    if ($('#Frmdate').val() == "" || $('#Frmdate').val() == "null") {
        fnMsgAlert('info', 'Weekend Definer', 'Please Select   Date.');
        return false;
    }
    $.ajax(
            {
                type: "POST",
                url: '../HiDoctor_Master/WeekendGroup/ManualInsertWeekend',
                data: "weekEndGroupCode=" + validWeekGroup[0].value + "&Date=" + Date,

                success: function (response) {
                    debugger;
                    if (response >= 1) {
                        fnBindWeekendGroup();
                        $("#Frmdate").val('');
                        fnMsgAlert('success', 'Weekend Group Definer', 'Successfully  Created.');


                    }

                    else {
                        fnMsgAlert('info', 'Weekend Group Definer', ' Weekend is mapped already for the selected Date.');

                    }

                },
                error: function () {

                }
            });
}