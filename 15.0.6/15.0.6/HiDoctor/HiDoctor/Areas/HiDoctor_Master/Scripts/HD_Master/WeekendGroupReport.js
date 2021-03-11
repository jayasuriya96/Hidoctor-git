//************************ START - WEEKEND GROUP DEFINER REPORT ************************//

var weekendGroupNameJson = "";
function fnGetWeekendGroups() {    
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
                autoComplete(weekendGroupNameJson, "txtWeekendOffDefinerName", "hdnWeekendOffDefinerName", 'autoWeekEndReport');
            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'GetAllWeekendGroups Failed.');
            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

function fnBindWeekendGroupDefinerReport() {
    if ($("#txtWeekendOffDefinerName").val() != "") {
        var validWeekGroup = jsonPath(weekendGroupNameJson, "$.[?(@.label=='" + $("#txtWeekendOffDefinerName").val() + "')]");
        if (validWeekGroup != false && validWeekGroup !== undefined && validWeekGroup.length > 0) {
            //dvWeekendGroupDefinerReport
            try {
                $.ajax({
                    type: "POST",
                    url: '../HiDoctor_Master/WeekendGroup/GetWeekendGroupDefinerReport',
                    data: "weekEndGroupCode=" + validWeekGroup[0].value,
                    success: function (response) {
                        if (response && response.length > 0) {
                            debugger;

                            $('#dvWeekendGroupDefinerReport').html('');
                            var grid = new ej.grids.Grid({
                                dataSource: response,
                                //queryCellInfo: queryCellInfo,
                                showColumnChooser: true,
                                allowPaging: true,
                                allowGrouping: true,
                                allowSorting: true,
                                allowFiltering: true,
                                allowResizing: true,
                                allowCellMerging: true,
                                allowScrolling: true,
                                allowExcelExport: true,
                                
                                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                                filterSettings: { type: 'CheckBox' },
                                toolbar: ['Search', 'ColumnChooser'],

                                aggregates: [],
                                columns: [

                                    
                                        { field: 'Year', headerText: 'Year', width: 150, textAlign: 'center' },
                                        { field: 'Date', headerText: 'Date', width: 150, textAlign: 'center' },
                                         { field: 'Day', headerText: 'Day', width: 150, textAlign: 'center' },
                                        
                                        

                                ],

                            });
                            grid.appendTo('#dvWeekendGroupDefinerReport');

                        }
                            //tblCont += "</tbody></table>";
                            //$("#dvWeekendGroupDefinerReport").html(tblCont);
                            //var jsonType = eval(type);
                            //$('#tblWeekendGroupReport').dataTable({
                            //    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'//, "sGroupBy": "Doctor Name"
                            //}).dataTable().columnFilter({
                            //    sPlaceHolder: "head:after",
                            //    aoColumns: jsonType
                            //});
                       
                    },
                    error: function (e) {
                        fnMsgAlert('error', 'Error', 'GetWeekendGroupDefinerReport Failed.');
                    }
                });
            }
            catch (e) {
                fnMsgAlert('error', 'Error', e.message);
                return false;
            }
        }
        else {
            fnMsgAlert('error', 'Error', 'Enter valid Weekend Group Name');
            return false;
        }
    }
    else {
        fnMsgAlert('error', 'Error', 'Please enter Weekend Group Name');
        return false;
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
//************************ END - WEEKEND GROUP DEFINER REPORT   ************************//