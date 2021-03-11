var menuContent_g = "";
var Year = "";
var Month = "";
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function fnGetdate() {
    // debugger;
    var today = new Date();
    var cdd = today.getDate();
    var cmm = today.getMonth() + 1;
    var cyy = today.getFullYear();
    var currentDate = cdd + '/' + cmm + '/' + cyy;
    today.setDate(today.getDate() - 90);
    var pdd = today.getDate();
    var pmm = today.getMonth() + 1;
    var pyy = today.getFullYear();
    var prevDate = pdd + '/' + pmm + '/' + pyy;


    $('#fromDate').val(prevDate);
    $('#toDate').val(currentDate);
    //fnGetMarketingCampaignDetails();
}
function fnGetMenuContentBP() {

    $.ajax({
        url: '/Home/GetMenuContent/',
        type: "POST",
        data: "A",
        success: function (jsMenu) {
            jsMenu = eval('(' + jsMenu + ')');
            menuContent_g = jsMenu;


        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

function fnGetBPHeader(value,bpType) {
    debugger;
    if (value==undefined) {
        var value = 0;
    }
   // $("#dvAjaxLoad").show();
    $.blockUI();
    //fnGetMenuContentBP();
    //var bpType = $("#dvBpTypes input[type='radio']:checked").val();
   
    var bpType = $("#batchtype").val();
 
    if ($("#batchtype").val() == "--Select Batch Processing Type--") {
        fnMsgAlert('info', 'Info', 'Please select Batch Processing type.');
        $.unblockUI();
        return false;
    }
    var effectivefrm = $("#fromDate").val();
    var arrEffectivefrom = effectivefrm.split('/');
    var effectivefromdate = arrEffectivefrom[2] + '-' + arrEffectivefrom[1] + '-' + arrEffectivefrom[0]
    var effectiveto = $("#toDate").val();
    var arrEffectiveto = effectiveto.split('/');
    var effectivetodate = arrEffectiveto[2] + '-' + arrEffectiveto[1] + '-' + arrEffectiveto[0]
    if (bpType != null && bpType.length > 0) {
        $('#dvErrMsg').css('display', 'none');
        $('#dvErrMsg').html('');
        $.ajax({
            url: '../BatchProcessing/GetBPHeader',
            // dataType:"Application/json",
            type: "GET",
            data: "bp_Type=" + bpType + "&Effective_from=" + effectivefromdate + "&Effective_to=" + effectivetodate + "&Value=" + value,
            success: function (JsonResult) {
                debugger;
                $("#dvAjaxLoad").hide();
                $.unblockUI();
                Json_Batch = JsonResult;
                var jsonresult = eval('(' + Json_Batch + ')');

                //var a = jsonresult.Tables["0"].Rows.Upload_Date;
                //var b = a.split('T');
                //var c = b[0].split('-');
                //var d = c[2] + '/' + c[1] + '/' + c[0];
                //var e = d + ' ' + b[1];

                $("#batchProcessingGRD").html('');
                if (jsonresult != '') {
                    // $('#batchProcessingGRD').html(jsonresult);

                    var grid = new ej.grids.Grid({
                        dataSource: jsonresult.Tables[0].Rows,
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
                                { field: 'Upload_File_Name', headerText: 'File Name', width: 150, textAlign: 'center' },
                                { field:'Upload_Date', headerText: 'Date of Upload', width: 150, textAlign: 'center' },
                                { field: 'User_Name', headerText: 'Uploaded By', width: 200, textAlign: 'center' },
                                { field: 'Status', headerText: 'Upload Status', width: 200, textAlign: 'center' },
                                { field: 'Reupload', headerText: 'Action', width: 200, textAlign: 'center' },


                        ],
                        queryCellInfo: queryCellInfo,


                    });
                    grid.appendTo('#batchProcessingGRD');

                }
                else {
                    $('#batchProcessingGRD').html("No uploaded found.");
                }
            },
            error: function (res) {
                debugger;
                fnMsgAlert('info', 'Error', 'ERROR.');
                // alert("ERROR");
            }
        });

    }

    else {
        $('#dvErrMsg').html('Please select Batch Processing type.')
        $('#dvErrMsg').css('display', '');
    }
}
function queryCellInfo(args) {
    debugger;
    if (args.column.field == "Status") {
        if (args.data.Status == "FAILED") {

            args.cell.style.cursor = "pointer";
            args.cell.style.color = "blue";
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.innerHTML = "Error"
        }
    }
    if (args.column.field == "Status") {
        if (args.data.Status == "ERROR") {
            args.cell.style.cursor = "pointer";
            args.cell.style.color = "blue";
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.innerHTML = "Error"
        }
        $(args.cell).bind("click", function () {
            if (args.data.Status == "ERROR" || args.data.Status == "FAILED") {
                BPPopup(args.data.BP_ID);
            }

        })
    }
    if (args.column.field == "Reupload") {
        //args.column.field.style.fontSize = "16px";
        if (args.data.Reupload == "Retry") {
            args.cell.style.cursor = "pointer";
            args.cell.style.color = "blue";
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.innerHTML = "Retry"
        }
        $(args.cell).bind("click", function () {
            debugger;
            if (args.data.Reupload == "Retry") {
                fnRedirectToUploadScreen();
            }
        })
    }
    if (args.column.field == "Status") {
        if (args.data.Status == "SUCCESS") {
            args.cell.innerHTML = "Success"
        }
    }
    //if (args.column.field == "Upload_Date") {
    //    if (args.data.Upload_Date != "") {
    //        var s = args.data.Upload_Date
    //        var a = s.split('T')
    //        var b = a[0] + ' ' + a[1]
    //        args.cell.innerHTML = b
    //    }

    //    //args.column.type = 'date';
    //    //args.column.setFormatter("dd/mm/yyyy HH:MM");
    //}
}

function BPPopup(bpid) {
    debugger;
    $("#dvOverLay").overlay().load();
    $('#batchProcessingErrorLogGRD').html('');
    $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        url: '../BatchProcessing/GetBPErrorLog',
        type: "POST",
        data: "bpId=" + bpid,
        success: function (result) {
            debugger;
            if (result) {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
                $('#batchProcessingErrorLogGRD').html(result);
            }
            else {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
                $('#batchProcessingErrorLogGRD').html("No errors found.");
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
            fnMsgAlert('error', 'Error', 'ERROR.');
        }
    });
}

//For PS Automation
function BPPopupForPSAutomation(bpid) {
    debugger;
    $("#dvOverLay").overlay().load();
    $('#batchProcessingErrorLogGRD').html('');
    $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        url: '../BatchProcessing/GetBPErrorLogForPSAutomation',
        type: "POST",
        data: "bpId=" + bpid,
        success: function (result) {
            debugger;
            if (result) {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
                $('#batchProcessingErrorLogGRD').html(result);
            }
            else {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
                $('#batchProcessingErrorLogGRD').html("No errors found.");
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
            fnMsgAlert('error', 'Error', 'ERROR.');
        }
    });
}

function fnRedirectToUploadScreen() {
    debugger;
    var bpType = $("#batchtype").val()
    if (bpType.toUpperCase() == "INWARD_UPLOAD") {

        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/Inward/ExcelBulkUpload' && @.Access=='1')]");
        if (menu != null && !menu) {
            var url = "HiDoctor_Master/Inward/ExcelBulkUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/Inward/ExcelBulkUpload";
            var html = $('<div>Innward Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
        //$('#main').load('HiDoctor_Master/Inward/ExcelBulkUpload');
    }
    else if (bpType.toUpperCase() == "DOCTOR_UPLOAD") {
        $('#main').load('HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=D');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=D' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=D";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=D";
            var html = $('<div> Doctor Bulk Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "CHEMIST_UPLOAD") {
        // $('#main').load('HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=C');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=C' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=C";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=C";
            var html = $('<div> Chemist Bulk Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "STOCKIEST_UPLOAD") {
        //$('#main').load('HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=S');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=S' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=S";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/DoctorMaster/ExcelBulkUploadMultiTerritory?cust=S";
            var html = $('<div> Stockiest Bulk Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "USER_UPLOAD") {
        // $('#main').load('HiDoctor_Master/User/UserExcelBulkAdd');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/User/UserExcelBulkAdd' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/User/UserExcelBulkAdd";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/User/UserExcelBulkAdd";
            var html = $('<div> User Bulk Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "EMPLOYEE_UPLOAD") {
        // $('#main').load('HiDoctor_Master/User/EmployeeBulkAdd');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/User/EmployeeBulkAdd' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/User/EmployeeBulkAdd";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/User/EmployeeBulkAdd";
            var html = $('<div> Employee Bulk Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "PRODUCT_UPLOAD") {
        //  $('#main').load('HiDoctor_Master/ProductMaster/ProductExcelUpload');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/ProductMaster/ProductExcelUpload' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/ProductMaster/ProductExcelUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/ProductMaster/ProductExcelUpload";
            var html = $('<div> Product Excel Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "SFC_UPLOAD") {
        // $('#main').load('HiDoctor_Master/SFCRegion/SFCExcelUpload');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/SFCRegion/SFCExcelUpload' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/SFCRegion/SFCExcelUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/SFCRegion/SFCExcelUpload";
            var html = $('<div> SFC Excel Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "PRIMARYSALESVALUES_UPLOAD") {
        // $('#main').load('HiDoctor_Master/ProductMaster/PrimarySalesValuesExcelUpload');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/ProductMaster/PrimarySalesValuesExcelUpload' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/ProductMaster/PrimarySalesValuesExcelUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/ProductMaster/PrimarySalesValuesExcelUpload";
            var html = $('<div>Primary Sales Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }

    }
    else if (bpType.toUpperCase() == "PAYSLIP_UPLOAD") {
        // $('#main').load('HiDoctor_Master/PaySlip/PayslipDataUpload');
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/PaySlip/PayslipDataUpload' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/PaySlip/PayslipDataUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/PaySlip/PayslipDataUpload";
            var html = $('<div>PaySlip Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "CCM_UPLOAD") {
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='CCM/CCM/CCMExcelUpload' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "CCM/CCM/CCMExcelUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "CCM/CCM/CCMExcelUpload";
            var html = $('<div>CCM Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
        // $('#main').load('CCM/CCM/CCMExcelUpload');
    }
    else if (bpType.toUpperCase() == "REGION_UPLOAD") {
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/Organogram/RegionExcelBlukUpload' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/Organogram/RegionExcelBlukUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/Organogram/RegionExcelBlukUpload";
            var html = $('<div>Innward Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
        // $('#main').load('HiDoctor_Master/Organogram/RegionExcelBlukUpload');
    }
    else if (bpType.toUpperCase() == "PSU_UPLOAD") {
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Activity/PrimarySales/Index' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Activity/PrimarySales/Index";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Activity/PrimarySales/Index";
            var html = $('<div>Primary Sales</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
        // $('#main').load('HiDoctor_Master/Organogram/RegionExcelBlukUpload');
    }
    else if (bpType.toUpperCase() == "HOLIDAY_UPLOAD") {
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/Region/Holiday' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/Region/Holiday";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/Region/Holiday";
            var html = $('<div>Innward Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
        // $('#main').load('HiDoctor_Master/Organogram/RegionExcelBlukUpload');
    }
    else if (bpType.toUpperCase() == "INWARD_BULK_UPLOAD") {
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/Inward/BulkInwardUpload' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/Inward/BulkInwardUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/Inward/BulkInwardUpload";
            var html = $('<div>Inward Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
        // $('#main').load('HiDoctor_Master/Organogram/RegionExcelBlukUpload');
    }
    else if (bpType.toUpperCase() == "DFC_UPLOAD") {
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/DistanceFareChart/DFCExcelUpload' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/DistanceFareChart/DFCExcelUpload";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/DistanceFareChart/DFCExcelUpload";
            var html = $('<div>DFC Upload</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else if (bpType.toUpperCase() == "LEAVE_BALANCE_UPLOAD") {
        var menu = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/LeaveType/LeaveBalanceUpdate' && @.Access=='1')]");

        if (menu != null && menu) {
            var url = "HiDoctor_Master/LeaveType/LeaveBalanceUpdate";
            var html = $('<div>' + menu[0].Menu_Text + '</div>');
            var menu_id = menu[0].Menu_Id;
            fnLoadBody(url, html, menu_id);
        }
        else {
            var url = "HiDoctor_Master/LeaveType/LeaveBalanceUpdate";
            var html = $('<div>Leave Balance Update</div>');
            var menu_id = -2;
            fnLoadBody(url, html, menu_id);
            //fnLoadBody(url, html, menu_id);
        }
    }
    else {
        fnMsgAlert('info', 'Info', 'Invalid Type.');
        // alert("Invalid Type");
    }
}

function GotoPage(type) {

}

function fnDoAction(Err_Code, Product_Ref_Key, Product_Type, Product_Name, Batch_Numer, Emp_No) {
    if (Err_Code.toUpperCase() == "HD_ERR_0428") {
        $('#dvAjaxLoad').hide();
        $.modal({
            ajax: '../HiDoctor_Master/ProductMaster/Index?isPopup=1&Product_Name=' + Product_Name + "&Product_Type="
                + Product_Type + "&Emp_No=" + parseInt(Emp_No) + "&Product_Ref_Key=" + Product_Ref_Key, title: 'Add Product', overlayClose: false
        });
        $("#modal").css("z-index", "99999");
        $("#modal").css("width", "600px;");
    }
    else if (Err_Code.toUpperCase() == "HD_ERR_0430") {
        $.ajax({
            url: '../BatchProcessing/UserProductMap',
            type: "POST",
            data: "Emp_No=" + Emp_No + "&Product_Ref_Key=" + Product_Ref_Key,
            success: function (result) {
                if (result.split(":")[0].toUpperCase() == "SUCCESS") {
                    fnMsgAlert('success', "Success", "Product Successfully mapped to the user.");
                }
                else if (result.split(":")[0].toUpperCase() == "ERROR") {
                    fnMsgAlert('error', "error", "User Product map failed.");
                }
            },
            error: function (result) {
                fnMsgAlert('error', "error", "User Product map failed.");
                console.log(result);
            }
        });
    }
    else if (Err_Code.toUpperCase() == "HD_ERR_0461") {  //ProductBatchMap
        $.ajax({
            url: '../BatchProcessing/ProductBatchMap',
            type: "POST",
            data: "Product_Ref_Key=" + Product_Ref_Key + "&Batch_Number=" + Batch_Numer,
            success: function (result) {
                if (result.split(":")[0].toUpperCase() == "ERROR") {
                    $('#dvAjaxLoad').hide();
                    fnMsgAlert('error', 'Error', result.split(":")[1]);
                }
                else if (result.split(":")[0].toUpperCase() == "SUCCESS") {
                    fnMsgAlert('success', 'Success', 'Batch Saved Successfully.');
                }
            },
            error: function (result) {
                fnMsgAlert('error', "error", "User Product map failed.");
                console.log(result);
            }
        });
    }
}


//SAP Api Call
function fnGetPrimarySalesData() {
    debugger;
    var id = $("#bday-month").val();
    var arr = id.split("-");
    var Month = arr[1];
    var Year = arr[0];
    var Upload_Type = "Manual";
    var final_Insert_Data = [];
    //$("#dvOverLay").overlay().load();
    $("#dvAjaxLoad").show();
    $.blockUI();
    //$.ajax({
    //    url: '../BatchProcessing/GetPrimarySalesData',
    //    type: "GET",
    //    data: "Month=" + Month + "&Year=" + Year + "",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        debugger;
    //        if (result.Data.d.results.length>0) {
    //            debugger;
    //            $("#dvAjaxLoad").hide();
    //            $.unblockUI();
    //            var objPrimarysales = result.Data;
    //            //SSCoreREST.requestInvoke('ProductApi/InsertPrimarySales/' + Company_Code + "/" + User_Code, "", objPrimarysales, "POST", fnEntry_SuccessCallback, fnEntry_FailureCallback, null, "JSON");
    //            Method_params = ["ProductApi/InsertPrimarySales", Company_Code, User_Code];
    //            CoreREST.post(null, Method_params, objPrimarysales, fnEntry_SuccessCallback,fnEntry_FailureCallback);
    //        }
    //        else {
    //            $("#dvAjaxLoad").hide();
    //            $.unblockUI();
    //            fnMsgAlert('error', 'Error', 'Sorry An Occured While Connecting SAP Environment.');
    //        }
    //    },
    //    error: function () {
    //        $("#dvAjaxLoad").hide();
    //        $.unblockUI();
    //        fnMsgAlert('error', 'Error', 'Unknown Error.');
    //    }
    //});
    Method_params = ["ProductApi/GetPrimarySalesData", Company_Code, User_Code, Month, Year,Upload_Type];
    CoreREST.get(null, Method_params, null, fnEntry_SuccessCallback,fnEntry_FailureCallback);
}
    
        function fnEntry_SuccessCallback(response) {
        debugger;
        if (response != null && response.Message=="SUCCESS") {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
            fnMsgAlert('success', "Success", "Data has been Saved successfully,Please click Refresh Button to Check Status.");
            //swal('Success', 'Data has been Saved successfully,Please click Refresh Button to Check Status', 'success');
            return;
        }
        else if (response != null && response.Message == "Sorry Already an Request is inprogress,Please Try again Later.") {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
            fnMsgAlert('error', "Error", response.Message);
            //swal('Success', 'Data has been Saved successfully,Please click Refresh Button to Check Status', 'success');
            return;
        }
        else if (response != null && response.Message == "No Records Found.") {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
            fnMsgAlert('error', "Error", response.Message);
            //swal('Success', 'Data has been Saved successfully,Please click Refresh Button to Check Status', 'success');
            return;
        }
        else {
            fnMsgAlert('error', 'Error',"Sorry An Occured While Connecting SAP Environment,Please Try again Later.");
            $("#dvAjaxLoad").hide();
            $.unblockUI();
            return;
         }

         }
function fnEntry_FailureCallback() {
  }

function fnBindMonthAndYear() {
    $('#txtYear').html('');
    $('#txtMonth').html('');
   fnBindYear();
}
function fnBindYear() {
    $('#dvYear').html('');
    $('#dvYear').html('<input id="txtYear" style="width:100%;text-align:left;" />');
    var lstYear = [];

    for (var i = 0; i < 2; i++) {
        _objYearData = {};
        _objYearData.value = new Date().getFullYear() - i;
        _objYearData.label = new Date().getFullYear() - i;
        lstYear.push(_objYearData);
    }

    atcObj = new ej.dropdowns.DropDownList({
        dataSource: lstYear,
        fields: { text: 'label', value: 'value' },
        popupHeight: '200px',
        change: function () { fnBindMonth(); }
    });
    atcObj.appendTo('#txtYear');
    atcObj.index = 0;
}
//for current year months are bounded upto the current month.
//for previous year all the months are bounded
//drop down code is written using syncfusion controls
function fnBindMonth() {
    $('#dvMonth').html('');
    $('#dvMonth').html('<input id="txtMonth" style="width:100%;text-align:left;" />');
    var lstMonth = [];
    var year = $('#txtYear').val();


    if (year == new Date().getFullYear()) {
        for (var i = 0; i <= new Date().getMonth() ; i++) {
            _objMonthData = {};
            _objMonthData.value = i + 1;
            _objMonthData.label = monthNames[i];
            lstMonth.push(_objMonthData);
        }
    }
    else {
        for (var i = 0; i <= 11; i++) {
            _objMonthData = {};
            _objMonthData.value = i + 1;
            _objMonthData.label = monthNames[i];
            lstMonth.push(_objMonthData);
        }
    }

    atcObj1 = new ej.dropdowns.DropDownList({
        dataSource: lstMonth,
        fields: { text: 'label', value: 'value' },
        popupHeight: '200px',
    });

    atcObj1.appendTo('#txtMonth');

    atcObj1.value = parseInt(Month);

    if (Month != '') {
        document.querySelector("#txtMonth").ej2_instances[0].enabled = false;
    }
    var d = new Date();
    var n = d.getMonth();
    if (n == 0) {
        var d = 11;
    }
    else {
        var d = n - 1;
    }

    atcObj1.index = d;
}

