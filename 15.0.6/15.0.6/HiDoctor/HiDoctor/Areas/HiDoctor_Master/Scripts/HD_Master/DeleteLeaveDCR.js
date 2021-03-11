var grid;
var User_Code = '';
var DeleteLeaveDCR = {

    defaults: {
        Company_Code: "",
        LogRegionCode: "",
        LogUserCode: "",
        CompanyId: "",
    },

    fnBindMonthAndYear: function () {
        var datepicker = new ej.calendars.DatePicker({
            placeholder: 'Choose Month & Year',
            //sets the start
            start: 'Decade',
            //sets the depth
            depth: 'Year',
            format: 'MMMM-yyyy',
            width: '240px',
        });
        datepicker.appendTo('#MonthAndYear');
    },

    fnGetUserCode: function (value) {
        User_Code = "";
        User_Code = value.data.key;
        $('#dvDeleteLeaveDCR').html('');
        $('#dvMonthYear').show();
        $('#dvDelLeave').hide();
    },

    fnGetDeleteLeaveDCR: function(){
        var Month = "";
        if ($('#MonthAndYear').val().split('-')[0] == "January") {
            Month = 01;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "February") {
            Month = 02;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "March") {
            Month = 03;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "April") {
            Month = 04;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "May") {
            Month = 05;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "June") {
            Month = 06;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "July") {
            Month = 07;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "August") {
            Month = 08;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "September") {
            Month = 09;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "October") {
            Month = 10;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "November") {
            Month = 11;
        }
        else if ($('#MonthAndYear').val().split('-')[0] == "December") {
            Month = 12;
        }
        var details = DeleteLeaveDCR.defaults.Company_Code + "/" + User_Code + "/" + Month + "/" + $('#MonthAndYear').val().split('-')[1];
        SSCoreREST.requestInvoke('api/GetDeleteLeaveDCR', details, null, "GET", DeleteLeaveDCR.fnGetDCRLeaveDeleteSuccessCallback, DeleteLeaveDCR.fnGetDCRLeaveDeleteFailureCallback, null);
    },

    fnGetDCRLeaveDeleteSuccessCallback: function (response) {
        $('#dvDeleteLeaveDCR').html('');
        grid = '';
        grid = new ej.grids.Grid({
            dataSource: response.Response,
            allowPaging: true,
            allowFiltering: true,
            allowResizing: true,
            gridLines: 'Both',
            selectionSettings: { checkboxOnly: true },
            height: 390,
            pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], pageCount: 100 },
            filterSettings: { type: 'CheckBox' },
            aggregates: [],
            columns: [
                { type: "checkbox", headerText: 'Select', field: "", allowFiltering: false, allowSorting: false, width: '60' },
                { field: 'User_Name', headerText: 'User Name', textAlign: 'center' },
                { field: 'Leave_Type_Name', headerText: 'Leave Type', textAlign: 'center' },
                { field: 'From_Date', headerText: 'From Date', textAlign: 'center' },
                { field: 'To_Date', headerText: 'To Date', textAlign: 'center' },
                { field: 'Number_Of_Days', headerText: 'Number Of Days', textAlign: 'center' },
                { field: 'Leave_Status', headerText: 'DCR Status', textAlign: 'center' },
                { field: 'Created_Date', headerText: 'Created_Date', textAlign: 'center' },
                { field: 'Unapproved_By', headerText: 'Unapproved By', textAlign: 'center' },
                { field: 'Unapproval_Date', headerText: 'Unapproval Date', textAlign: 'center' },
                { field: 'Unapproval_Reason', headerText: 'Unapproval Reason', textAlign: 'center' },
            ],
            checkBoxChange: (args) => {
                var customselect = [];
                if (args.checked && args.target.classList.contains('e-checkselectall')) {
                    for (var i = 0; i < args.selectedRowIndexes.length; i++) {
                        var row = grid.getRowByIndex(args.selectedRowIndexes[i]);
                        customselect.push(args.selectedRowIndexes[i]);
                    }
                    grid.selectRows(customselect)
                }
            },
        });
        grid.appendTo('#dvDeleteLeaveDCR');
        $('#dvDelLeave').show();
    },

    fnGetDCRLeaveDeleteFailureCallback: function (response) {
    },

    getRecordsForDeleting: function () {
        $.blockUI();
        var lstDelete;
        if (grid.getSelectedRecords().length == 0) {
            swal('Info', 'Please select atleast one record for deletion', 'info');
            return false;
        }
        else {
            lstData = grid.getSelectedRecords();
            var obj = {
                Company_Code: DeleteLeaveDCR.defaults.Company_Code,
                User_Code: DeleteLeaveDCR.defaults.LogUserCode,
            }

            var obj1 = {
                obj: obj,
                lstDelete: lstData
            }
            SSCoreREST.requestInvoke('api/DeleteLeaveDCR', "", obj1, "POST", DeleteLeaveDCR.fnDeleteLeave_SuccessCallback, DeleteLeaveDCR.fnDeleteLeave_FailureCallback, null, "JSON");
        }
    },

    fnDeleteLeave_SuccessCallback: function (response) {
        if (response.Message == "SUCCESS") {
            $.unblockUI();
            var Month = "";
            if ($('#MonthAndYear').val().split('-')[0] == "January") {
                Month = 01;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "February") {
                Month = 02;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "March") {
                Month = 03;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "April") {
                Month = 04;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "May") {
                Month = 05;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "June") {
                Month = 06;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "July") {
                Month = 07;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "August") {
                Month = 08;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "September") {
                Month = 09;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "October") {
                Month = 10;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "November") {
                Month = 11;
            }
            else if ($('#MonthAndYear').val().split('-')[0] == "December") {
                Month = 12;
            }
            var details = DeleteLeaveDCR.defaults.Company_Code + "/" + User_Code + "/" + Month + "/" + $('#MonthAndYear').val().split('-')[1];
            SSCoreREST.requestInvoke('api/GetDeleteLeaveDCR', details, null, "GET", DeleteLeaveDCR.fnGetDCRLeaveDeleteSuccessCallback, DeleteLeaveDCR.fnGetDCRLeaveDeleteFailureCallback, null);
            swal('Success', 'Leave DCR Deleted Successfully', 'success');
            return false;
        }
    },

    fnDeleteLeave_FailureCallback: function (response) {
        console.log(response);
        $.unblockUI();
        swal('Error', 'Some error occurred while trying to Delete Leave DCR', 'error');
        return false;
    }
}