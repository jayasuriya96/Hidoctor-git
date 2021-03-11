var workCategoryRule = {
    defaults: {
        rowCount: 1,
        G_Work_Category_Data: "",
        G_UserTypeCode: "",
        G_Work_Category_Rule_Data : ""
    },
    fnGetWorkCategory: function () {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/WorkCategroyRules/GetWorkCategory',
            async: false,
            success: function (result) {
                debugger;
                if (result.length > 0) {
                    workCategoryRule.defaults.G_Work_Category_Data = result;
                    workCategoryRule.fnBindComboBox('workCategory', workCategoryRule.defaults.rowCount);
                    workCategoryRule.fnBindComboBox('less_workCategory', workCategoryRule.defaults.rowCount);
                    workCategoryRule.fnBindComboBox('more_workCategory', workCategoryRule.defaults.rowCount);
                }
            }
        });
    },
    fnBindComboBox: function (id, rowCount) {
        debugger;
        var dropDownListObj = new ej.dropdowns.DropDownList({
            // set the placeholder to DropDownList input element
            placeholder: 'Select a Category',
            // set the placeholder to filter search box input element
            filterBarPlaceholder: 'Search',
            //set the local data to dataSource property
            dataSource: workCategoryRule.defaults.G_Work_Category_Data,
            // map the appropriate columns to fields property
            fields: { text: 'Expense_Entity_Name', value: 'Expense_Entity_Code' },
            // set the height of the popup element
            popupHeight: '250px',
            popupWidth: '400px',
            // set true for enable the filtering support.
            allowFiltering: true,
            // bind the filtering event
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                // frame the query based on search string with filter type.
                dropdown_query = (e.text !== '') ? dropdown_query.where('Expense_Entity_Name', 'startswith', e.text, true) : dropdown_query;
                // pass the filter data source, filter query to updateData method.
                e.updateData(workCategoryRule.defaults.G_Work_Category_Data, dropdown_query);
            }
        });
        dropDownListObj.appendTo('#' + id + rowCount); 
    },
    fnAddNewRow: function () {
        debugger;
        workCategoryRule.defaults.rowCount++;
        var content = "";
        content += '<tr>';
        content += '<td><input type="text" class="form-control form-control-sm workCategory" id="workCategory' + workCategoryRule.defaults.rowCount + '"><input type="hidden" id="hdn_Rule_Definition_Id"></td>';
        content += '<td><input type="number" class="form-control form-control-sm minOfCalls" min="0" oninput="validity.valid||(value=\'\');"></td>';
        content += '<td><input type="text" class="form-control form-control-sm less_workCategory" id="less_workCategory' + workCategoryRule.defaults.rowCount + '"></td>';
        content += '<td><input type="text" class="form-control form-control-sm more_workCategory" id="more_workCategory' + workCategoryRule.defaults.rowCount + '"></td>';
        content += '<td><input type="text" class="form-control form-control-sm datepicker effective_From"></td>';
        content += '<td><input type="text" class="form-control form-control-sm datepicker effective_To"></td>';
        content += '<td class="text-center"><i class="fa fa-trash-o" aria-hidden="true" id="deleteRow"></i></td>';
        content += '</tr>';
        $(".definitiontbody").append(content);
        $(".datepicker").datepicker({
            dateFormat: 'dd/mm/yy',
        });
        workCategoryRule.fnBindComboBox('workCategory', workCategoryRule.defaults.rowCount);
        workCategoryRule.fnBindComboBox('less_workCategory', workCategoryRule.defaults.rowCount);
        workCategoryRule.fnBindComboBox('more_workCategory', workCategoryRule.defaults.rowCount);
    },
    fnInsertRules: function (mode) {
        debugger;
        if (workCategoryRule.defaults.G_UserTypeCode == "") {
            swal('Info', 'Please Select User Designation', 'info');
            return false;
        }
        var arr = [];
        var validationText = "";
        var flag = false;
        $.each($(".definitiontbody tr"), function (i, e) {
            var obj = {};
            obj.Rule_Definition_ID = $(this).find("#hdn_Rule_Definition_Id").val();
            obj.User_Type_Code = workCategoryRule.defaults.G_UserTypeCode;
            obj.Work_Category_Code = document.querySelector("#" + $(this).find('.workCategory').attr('id')).ej2_instances[0].value;
            obj.Min_No_Calls = $(this).find('.minOfCalls').val();
            obj.Less_Work_Category = document.querySelector("#" + $(this).find('.less_workCategory').attr('id')).ej2_instances[0].value;
            obj.More_Work_Category = document.querySelector("#" + $(this).find('.more_workCategory').attr('id')).ej2_instances[0].value;
            obj.Effective_From = ($(this).find('.effective_From').val() == "" ? "" : workCategoryRule.fnDataConvert($(this).find('.effective_From').val(), 1));
            obj.Effective_To = ($(this).find('.effective_To').val() == "" ? "" : workCategoryRule.fnDataConvert($(this).find('.effective_To').val(), 1));


            // Validation            
            flag = false;

            if (obj.Work_Category_Code != null) {
                if (obj.Min_No_Calls == "" || obj.Min_No_Calls == 0) {
                    validationText = 'Minimum no of calls must not be empty or zero'
                    flag = true;
                    return false;
                }
                else if (obj.Less_Work_Category == null) {
                    validationText = 'Please select Less than work category'
                    flag = true;
                    return false;
                }
                else if (obj.More_Work_Category == null) {
                    validationText = 'Please select More than work category'
                    flag = true;
                    return false;
                }
                else if (obj.Effective_From == "") {
                    validationText = 'Please select Effective From'
                    flag = true;
                    return false;
                }
                else if (obj.Effective_To == "") {
                    validationText = 'Please select Effective To'
                    flag = true;
                    return false;
                }
                else if (new Date(obj.Effective_From) > new Date(obj.Effective_To)) {
                    validationText = 'Effective From should not be less / greater than Effective To Date'
                    flag = true;
                    return false;
                }
            }

            // Complete.
            if (obj.Work_Category_Code != "" && obj.Min_No_Calls != "" && obj.Less_Work_Category != "" && obj.More_Work_Category != "" && obj.Effective_From != "" && obj.Effective_To != "") {
                arr.push(obj);
            }
        });

        if (flag) {
            swal('Info', validationText, 'info');
            return false;
        }
        if (arr.length == 0) {
            swal('Info', 'Please Enter Minimum One Rule', 'info');
            return false;
        }

        // Insert Here.
        var objDetails = {
            Mode: mode,
            lst: arr
        }
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/WorkCategroyRules/InsertorUpdateRulesData',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(objDetails),
            success: function (result) {
                debugger;
                if (result.indexOf("Successfully") != -1) {
                    swal('Success', result, 'success');
                    $("#btnsave").show();
                    $("#btnUpdate").hide();
                    $("#btncancel").hide();
                    $('.definitiontbody input[type=text]').val('');
                    $('.definitiontbody input[type=number]').val('');                    
                    workCategoryRule.fnRuleEdit();
                }
                else {
                    swal('Info', result, 'info');
                }
            },
            error: function (er) {
                debugger;
            }
        });
    },
    fnRuleEdit: function () {
        debugger;
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/WorkCategroyRules/GetWorkCategoryRuleData',
            async: false,
            success: function (result) {
                debugger;
                workCategoryRule.defaults.G_Work_Category_Rule_Data = result;
                $('#grid').html('');
                if (result.length > 0) {
                    var grid = new ej.grids.Grid({
                        dataSource: result,
                        allowPaging: true,
                        allowGrouping: false,
                        allowSorting: true,
                        allowFiltering: false,
                        allowResizing: true,
                        allowCellMerging: true,
                        allowScrolling: true,
                        allowExcelExport: false,
                        height: 400,
                        gridLines: 'Both',
                        pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                        toolbar: ['Search'],
                        aggregates: [],
                        columns: [
                            { headerText: 'Edit', template: "<a href=#;>Edit</a>", width: 100, textAlign: 'center' },
                           // { headerText: 'Delete', template: "<a href=#;>Delete</a>", width: 100, textAlign: 'center' },
                            { field: 'User_Type_Name', headerText: 'UserType', width: 150 },
                           //  { field: 'Record_Status', headerText: 'Status', width: 150 },
                            { field: 'Category', headerText: 'Work Category', width: 150 },
                            { field: 'MinNo_Calls', headerText: 'Min No of Calls', width: 150 },
                            { field: 'Less_Category', headerText: 'Less Than Min No of Calls', width: 150 },
                            { field: 'More_Category', headerText: 'More Than Min No of Calls', width: 150 },
                            { field: 'Effective_From', headerText: 'Effective From', width: 150 },
                            { field: 'Effective_To', headerText: 'Effective To', width: 150 }
                        ],
                        queryCellInfo: workCategoryRule.queryCellInfo,
                    });
                    grid.appendTo('#grid');
                }
                else {
                    $('#grid').htm("No Records Found");
                }
            }
        });
    },
    queryCellInfo: function (args) {
        debugger;
        //if (args.column.headerText == "Delete") {
        //    args.cell.innerHTML = "<a href='#' onclick='workCategoryRule.fnDelete(\"" + args.data.Rule_Definition_ID + "\");'>Delete</a>";
        //}
        if (args.column.headerText == "Edit") {
            args.cell.innerHTML = "<a href='#' onclick='workCategoryRule.fnEdit(" + args.data.Rule_Definition_ID + ")'>Edit</a>";
        }
    },
    fnEdit: function (id) {
        debugger;       
        $("#btnsave").hide();
        $("#btnUpdate").show();
        $("#btncancel").show();
        $("#btnAdd").hide();
        $("#deleteRow").hide();
        $('#myTab li:first-child a').tab('show');

        var lst = $.grep(workCategoryRule.defaults.G_Work_Category_Rule_Data, function (v) {
            return v.Rule_Definition_ID == id;
        });
        workCategoryRule.defaults.G_UserTypeCode = lst[0].User_Type_Code;
      
        $("#UserTypetree").dynatree("getRoot").visit(function (node) {
            if (node.data.key == workCategoryRule.defaults.G_UserTypeCode) {
                $(node.span).addClass('tree-node-active');
                node.select(true);
            }
            else {                
                $(node.span).removeClass('tree-node-active');
            }
        });

        var content = "";
        $(".definitiontbody").html('');
        for (var i = 0; i < lst.length; i++) {
            content += '<tr>';
            content += '<td><input type="text" class="form-control form-control-sm workCategory" id="workCategory' + (i + 1) + '"><input type="hidden"  id="hdn_Rule_Definition_Id" value="' + lst[i].Rule_Definition_ID + '"</td>';
            content += '<td><input type="number" class="form-control form-control-sm minOfCalls" min="0" oninput="validity.valid||(value=\'\');" value ="' + lst[i].MinNo_Calls + '"></td>';
            content += '<td><input type="text" class="form-control form-control-sm less_workCategory" id="less_workCategory' + (i + 1) + '"></td>';
            content += '<td><input type="text" class="form-control form-control-sm more_workCategory" id="more_workCategory' + (i + 1) + '"></td>';
            content += '<td><input type="text" class="form-control form-control-sm  effective_From" value ="' + lst[i].Effective_From + '"readonly></td>';
            content += '<td><input type="text" class="form-control form-control-sm effective_To" value ="' + lst[i].Effective_To + '"readonly></td>';
            content += '<td class="text-center"><i class="fa fa-trash-o" aria-hidden="true" id="deleteRow"></i></td>';
            content += '</tr>';
            $(".definitiontbody").append(content);
            $(".datepicker").datepicker({
                dateFormat: 'dd/mm/yy',
            });
            workCategoryRule.fnBindComboBox('workCategory', (i + 1));
            workCategoryRule.fnBindComboBox('less_workCategory', (i + 1));
            workCategoryRule.fnBindComboBox('more_workCategory', (i + 1));

            document.querySelector('#workCategory' + (i + 1)).ej2_instances[0].value = lst[i].Categroy_Code;
            document.querySelector('#less_workCategory' + (i + 1)).ej2_instances[0].value = lst[i].Less_Category_Code;
            document.querySelector('#more_workCategory' + (i + 1)).ej2_instances[0].value = lst[i].More_Category_Code;
        }
        document.querySelector("#workCategory1").ej2_instances[0].readonly = true;
    },
    fnCancel: function(){
        $("#btnsave").show();
        $("#btnUpdate").hide();
        $("#btncancel").hide();
        $("#btnAdd").show();
        $('.definitiontbody input[type=text]').val('');
        document.querySelector("#workCategory1").ej2_instances[0].readonly = false;
        $('.definitiontbody input[type=text]').attr("readonly", false);
        $('.definitiontbody input[type=number]').val('');
        
    },
    fnDataConvert: function (currentDate, format) {
        var arr = currentDate.split('/');
        var ConvertDate = "";
        if (format == 1) // yyyy-mm-dd
        {
            ConvertDate = arr[2] + '-' + arr[1] + '-' + arr[0];
        }
        return ConvertDate;
    }

}
