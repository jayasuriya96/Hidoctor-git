



var DepotMaster = {
    defaults: {
        currentUserCode_g: '',
        companycode_g: ''
    },
    init: function () {
        debugger;
    },
    fnClear: function () {
        debugger;
        $('#txtDepotName').val('');
        $('#txtDepotShortName').val('');
        $('#txtAddress1').val('');
        $('#txtAddress2').val('');
        $('#txtPhone').val('');
        $('#txtMobile').val('');
        $('#txtDrugLicense1').val('');
        $('#txtDrugLicense2').val('');
        $('#txtGSTNumber').val('');
        $('#txtRefKey1').val('');
        $('#txtDepotName').removeAttr('disabled');
    },
    fnSave: function()
    {
        if (DepotMaster.fnValidate()) {
            try {
                //Assigning runtime values to a variable
                var DCode = $('#hdndepotcode').val();
                var DName = $('#txtDepotName').val();
                var DSName = $('#txtDepotShortName').val();
                var Add1 = $('#txtAddress1').val();
                var Add2 = $('#txtAddress2').val();
                var phne = $('#txtPhone').val();
                var mob = $('#txtMobile').val();
                var DLN1 = $('#txtDrugLicense1').val();
                var DLN2 = $('#txtDrugLicense2').val();
                var GST = $('#txtGSTNumber').val();
                var RefKey1 = $('#txtRefKey1').val();

                // posting runtime values to controller thru ajax method
                $.ajax({
                    type: "POST",
                    url: 'HiDoctor_Activity/Depot/InsertDepotMaster',
                    data: "DepCode=" + DCode + "&DepName=" + DName + "&DepShtName=" + DSName + "&Add1=" + Add1 + "&Add2=" + Add2 + "&phne=" + phne + "&mob=" + mob + "&DLN1=" + DLN1 + "&DLN2=" + DLN2 + "&GST=" + GST + "&RKey1=" + RefKey1,
                    success: function (response) {
                        debugger;
                        HideModalPopup("dvloading");
                        $('#txtDepotName').val('');
                        $('#txtDepotShortName').val('');
                        $('#txtAddress1').val('');
                        $('#txtAddress2').val('');
                        $('#txtPhone').val('');
                        $('#txtMobile').val('');
                        $('#txtDrugLicense1').val('');
                        $('#txtDrugLicense2').val('');
                        $('#txtGSTNumber').val('');
                        $('#txtRefKey1').val('');
                        debugger;
                        if (response == "0") {
                            fnMsgAlert('success', 'Depot Master', 'Depot details saved successfully.');
                            $('#txtDepotName').removeAttr('disabled');
                            $('#dvDepotTable').empty();
                            DepotMaster.fnGetDepotMasterDetails();
                            return false;
                        }
                        if (response == "1") {
                            fnMsgAlert('success', 'Depot Master', 'Depot details updated successfully.');
                            $('#txtDepotName').removeAttr('disabled');
                            $('#dvDepotTable').empty();
                            DepotMaster.fnGetDepotMasterDetails();
                            return false;
                        }
                        else {
                            fnMsgAlert('error', 'Depot Master', "Check the status value");
                            $('#txtDepotName').removeAttr('disabled');
                            $('#dvDepotTable').empty();
                            DepotMaster.fnGetDepotMasterDetails();
                            return false;
                        }

                    },
                    error: function (e) {
                        fnMsgAlert("error", "Depot Master", e.responseText);
                        HideModalPopup("dvloading");
                        return false;
                    }
                });
            }
            catch (e) {
                HideModalPopup("dvloading");
                fnMsgAlert("error", "Depot Master", e.responseText);
                return false;
            }
        }
    },

    fnValidate: function() {
        debugger;
        var errMsg = "";

            //Depot Name is mandatory field
            if ($.trim($('#txtDepotName').val()).length == 0) {
                errMsg += "Please enter the Depot Name <br />";
            }
            //Reference Key1 is mandatory field
            if ($.trim($('#txtRefKey1').val()).length == 0) {
                errMsg += "Please enter the reference key1 <br />";
            }
            // show errors.
            if (errMsg.length > 0) {
                fnMsgAlert("info", "Depot Master", errMsg);
                return false;
            }
            return true;
        },


    fnGetDepotMasterDetails: function() {
        debugger;
        $.ajax({
            type: "GET",
            url: 'HiDoctor_Activity/Depot/GetDepotMasterDetails',
            success: function (response) {
                debugger;
                //DepotMaster.fnDisplayDepot("dvView");
                if (response.length > 0) {
                    var grid = new ej.grids.Grid({
                        dataSource: response,
                        showColumnChooser: false,
                        allowPaging: true,
                        allowGrouping: false,
                        allowSorting: true,
                        allowFiltering: true,
                        allowResizing: true,
                        allowCellMerging: true,
                        allowScrolling: true,
                        allowTextWrap: true,
                        pageSettings: { pageSize: 10, pageSizes: [5, 10, 20, 40, 60, 80, 100], pageCount: 5 },
                        filterSettings: { type: 'CheckBox' },
                        //toolbar: ['Search', 'ColumnChooser'],
                        toolbar: ['Search'],
                        aggregates: [],
                        height:'auto',
                        columns: [
                                { headerText: 'Edit', template: "<a herf=#;>Edit</a>", width: 150, textAlign: 'center' },
                                { headerText: 'Record Status', template: "<a herf=#;>Change Status</a>", width: 150, textAlign: 'center' },
                                { field: 'Depot_Code', headerText: 'Depot Code', width: 150, textAlign: 'left', visible: false },
                                //{ field: 'Location', headerText: 'Location', width: 130, textAlign: 'left' },
                                { field: 'Depot_Name', headerText: 'Depot Name', width: 200, textAlign: 'left' },
                                //{ field: 'Depot_Short_Name', headerText: 'Depot Short Name', width: 200, textAlign: 'left' },
                                { field: 'Drug_License_Number1', headerText: 'Drug License Number1', width: 200, textAlign: 'left' },
                                { field: 'Drug_License_Number2', headerText: 'Drug License Number2', width: 200, textAlign: 'left' },
                                { field: 'Ref_Key1', headerText: 'Reference Key', width: 200, textAlign: 'left' },
                                //{ field: 'Record_Status', headerText: 'Status', width: 200, textAlign: 'left' },
                        ],
                        queryCellInfo: DepotMaster.fnQueryCellInfo,
                    });
                    grid.appendTo('#dvDepotTable');
                }
                else {
                    $('#dvDepotTable').html("No records found.");
                    $('#dvDepotTable').addClass('className');
                }
            },
            error: function (e) {
                fnMsgAlert("error", "Depot Master", e.responseText);
                return false;
            }
        });

    },

    fnQueryCellInfo: function (args) {
         if (args.column.headerText == "Edit") {
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.style.color = "blue";
            args.cell.textAlign = 'center';
            args.cell.innerHTML = "<a href='#' onclick='DepotMaster.fnEditDepot(\"" + args.data.Depot_Code + "\",\"" + args.data.Depot_Name + "\");'>Edit</a>"
         }
         if (args.column.headerText == "Record Status") {
             args.cell.style.cursor = "pointer";
             args.cell.style.textDecoration = "underline";
             args.cell.style.color = "blue";
             args.cell.textAlign = 'center';
             args.cell.innerHTML = "<a href='#' onclick='DepotMaster.fnChangeRecordStatus(\"" + args.data.Depot_Code + "\",\"" + args.data.Depot_Name + "\");'>Change Status</a>"
         }
    },

    fnEditDepot: function (depoCode, depoName) {
        $('#hdndepotcode').val(depoCode);
        debugger;
        $.ajax({
            type: "GET",
            url: 'HiDoctor_Activity/Depot/SearchDepotMasterDetails',
            data: "Comp_Code=" + companycode_g + "&Depot_Code=" + depoCode + "&Depot_Name=" + depoName,
            success: function (response) {
                debugger;
                HideModalPopup("dvloading");
                $('#txtDepotName').val(response[0].Depot_Name);
                $('#txtDepotName').attr('disabled', 'disabled');
                $('#txtDepotShortName').val(response[0].Depot_Short_Name);
                $('#txtAddress1').val(response[0].Address1);
                $('#txtAddress2').val(response[0].Address2);
                $('#txtPhone').val(response[0].Phone_Number);
                $('#txtMobile').val(response[0].Mobile_Number);
                $('#txtDrugLicense1').val(response[0].Drug_License_Number1);
                $('#txtDrugLicense2').val(response[0].Drug_License_Number2);
                $('#txtGSTNumber').val(response[0].CST_Number);
                $('#txtRefKey1').val(response[0].Ref_Key1);
                //DepotMaster.fnDisplayDepot("dvView");
            },
            error: function (e) {
                fnMsgAlert("error", "Depot Master", e.responseText);
                HideModalPopup("dvloading");
                return false;
            }
        });
    },

    fnChangeRecordStatus: function (depoCode, depoName) {
        debugger;
        $.ajax({
            type: "POST",
            url: 'HiDoctor_Activity/Depot/UpdateRecordStatus',
            data: "CompanyCode=" + companycode_g + "&DepotCode=" + depoCode + "&DepotName=" + depoName,
            success: function (response) {
                debugger;
                HideModalPopup("dvloading");
                if (response != 0) {
                    fnMsgAlert('success', 'Depot Master', 'Status updated successfully.');
                }
                else {
                    fnMsgAlert('success', 'Depot Master', 'Status value of ' + depoCode + ' is ' + response);
                }
                $('#dvDepotTable').empty();
                DepotMaster.fnGetDepotMasterDetails();
            },
            error: function (e) {
                fnMsgAlert("error", "Depot Master", e.responseText);
                HideModalPopup("dvloading");
                return false;
            }
        });
    }
}