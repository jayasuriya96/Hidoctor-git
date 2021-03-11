//////////Created By: Manju////////////
//////////Date : 09-09-2019//////////
var CME = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        RegionCode: "",
        UserCode: "",
        UserTypeCode: "",
        CME_id: "",
        Doctor_Code: "",
        CME_Value: "",
        ISfirsttime: 0,
        PlanningDetails: [],
        CMEName: [],
        Value: '',
        P_ID: 0,
        Edit_CME: '',
        Edit_Doctor: '',
        CurrentCME: [],
        Product: []
    },
    Init: function () {
        $('#submit').click(function () {
            CME.fnsubmit('Save');
        })

        $('#Cancel').click(function () {
            CME.fncancel();
        });
    },
    fnCMEPlanning: function () {
        $('.def').addClass('active');
        $('.sum').removeClass('active');
        $('#planning').show();
        $('#edit').hide();
    },
    fnCMESummary: function () {
        $('.def').removeClass('active');
        $('.sum').addClass('active');
        $('#planning').hide();
        $('#edit').show();
        var today = new Date();
        var cdd = today.getDate();
        var cmm = today.getMonth() + 1;
        var cyy = today.getFullYear();
        var currentDate = cyy + '-' + ("0" + (cmm)).slice(-2) + '-' + ("0" + (cdd)).slice(-2);
        today.setDate(today.getDate() - 90);
        var pdd = today.getDate();
        var pmm = today.getMonth() + 1;
        var pyy = today.getFullYear();
        var prevDate = pyy + '-' + ("0" + (pmm)).slice(-2) + '-' + ("0" + (pdd)).slice(-2);
        $('#CMEStartDate').val(prevDate);
        $('#CMEEndDate').val(currentDate);
        CME.getAllCMEPlanningDetails();
    },

    fnsubmit: function (value) {
        debugger;

        var validation = CME.fnValidation();
        if (validation == false) {
            return false;
        }
        CME.defaults.Value = value;
        var DoctorName = $("#Doctors_hidden").val()
        var CMEName = $("#CMEName_hidden").val()
        //var Dates = $('#Dates').val();
        var NoofDoctor = $('#NoofDoctor').val();
        var DoctorExpense = $('#Edoctor').val();
        var Venu = $('#Evenu').val();
        var Marketing = $('#EMarketing').val();
        var Travel = $('#ETravel').val();
        var Other = $('#EOther').val();
        var Total = $('#ETotal').val();
        var Remark = $('#Remark').val();
        var MappingProduct = []
        var table = $('#mappingtable tr').length;
        var month = $('#NoofMonth').val();
        for (var i = 1; i <= (table - 1) ; i++) {
            var j = (i - 1)
            var mapping = {}
            if ($("#chkbox" + j + "").prop('checked') == true) {
                mapping.Product_Code = $('#Code_' + j).html();
                mapping.Current_Sales = $('#Csales_' + j).val() == "" ? null : $('#Csales_' + j).val();
                mapping.Potential_Sales = $('#Psales_' + j).val() == "" ? null : $('#Psales_' + j).val();
                mapping.No_Of_Month = 0;
                MappingProduct.push(mapping)
            }
        }
        if (MappingProduct.length == 0) {
            swal("", "Please select atleast one product", "");
            return false;
        }
        var obj = {
            "Company_Code": CME.defaults.CompanyCode,
            "Region_Code": $('#Region_hidden').val(),
            "User_Code": CME.defaults.UserCode,
            "Doctor_Code": DoctorName,
            "CME_ID": CMEName,
            "Dates": $('#SDate').val(),
            "Start_Date": $('#SDate').val(),
            "End_Date": $('#UDate').val(),
            "No_of_Doctor": NoofDoctor == '' ? -1 : NoofDoctor,
            "DoctorExpense": DoctorExpense == '' ? -1 : DoctorExpense,
            "VenuExpense": Venu == '' ? -1 : Venu,
            "MarketingExpense": Marketing == '' ? -1 : Marketing,
            "TravelExpense": Travel == '' ? -1 : Travel,
            "OtherExpense": Other == '' ? -1 : Other,
            "TotalExpense": Total == '' ? 0 : Total,
            "Value": value,
            "P_ID": CME.defaults.P_ID,
            "Remark": Remark,
            "Mapping": JSON.stringify(MappingProduct),
            "No_Of_Months": month,
        };
        swal({
            text: "Are you sure to plan the CME?, Once CME is planned you can't edit",
            buttons: true,
            dangerMode: false,
        })
.then((willDelete) => {
    if (willDelete) {
        Method_params = ["CMEApi/InsertCMEPlanning"];
        CoreREST.post(null, Method_params, obj, CME.SuccessData, CME.Failure);
    }
});



    },
    SuccessData: function (response) {
        if (response == 1) {
            if (CME.defaults.Value == 'Save') {
                swal("Success", "CME Planning Saved successfully.", "success");
                //swal({
                //    icon: "success",
                //    title: "Success",
                //    text: 'CME Planning Saved successfully.',
                //    button: "Ok",
                //});
                CME.fncancel();
            }
            else {
                swal({
                    icon: "success",
                    title: "Success",
                    text: 'CME Planning Updated successfully.',
                    button: "Ok",
                });
                CME.fncancel();
                CME.defaults.ISfirsttime = 0;
                $('#Summary').html('');
            }

        }
    },
    Failure: function (response) {

    },
    fnValidation: function () {
        var error = true;

        if ($('#Region_hidden').val() == null || $('#Region_hidden').val() == '') {
            swal("", "Enter Region Name", "");
            error = false;
            return false;
        }
        if ($('#CMEName_hidden').val() == null || $('#CMEName_hidden').val() == '') {
            swal("", "Enter CME Name", "");
            error = false;
            return false;
        }
        //if ($('#Dates').val() == '') {
        //    swal("", "Enter the Date", "");
        //    error = false;
        //    return false;
        //}
        if ($('#SDate').val() == '') {
            swal("", "Enter the Planned Date", "");
            error = false;
            return false;
        }
        if ($('#UDate').val() == '') {
            swal("", "Enter the Plan Applicable Till", "");
            error = false;
            return false;
        }
        if ($('#NoofMonth').val() == '') {
            swal("", "Enter the No of Month", "");
            error = false;
            return false;
        }
        if ($('#NoofMonth').val() < 0) {
            swal("", "Please enter valid No of Month", "");
            error = false;
            return false;
        }
        var SDate = new Date($('#SDate').val());
        var UfDate = new Date($('#UDate').val() + ' 00:00:00');
        var response = $.grep(CME.defaults.CMEName, function (v) {
            return v.Code == $('#CMEName_hidden').val();
        });
        var CMESart_Date = new Date(response[0].Start_Date)
        var CMEEnd_Date = new Date(response[0].End_Date)
        if (SDate <= CMESart_Date) {
            fnMsgAlert('info', 'CME', 'Planned Date should be greater than CME Start Date');
            error = false;
            return false;
        }
        if (CMEEnd_Date < UfDate) {
            fnMsgAlert('info', 'CME', 'Plan Applicable Till Date should be less than CME End Date');
            error = false;
            return false;
        }

        if ($('#Doctors_hidden').val() == null || $('#Doctors_hidden').val() == '') {
            swal("", "Enter Doctor Name", "");
            error = false;
            return false;
        }

        if ($('#Edoctor').val() < 0) {
            swal("", "Enter no of doctor participation greater than zero", "");
            error = false;
            return false;
        }
        if ($('#Edoctor').val().length > 10 || $('#Edoctor').val() < 0) {
            swal("", "Enter valid doctor expense", "");
            error = false;
            return false;
        }
        if ($('#Evenu').val().length > 10 || $('#Evenu').val() < 0) {
            swal("", "Enter valid venu expense", "");
            error = false;
            return false;
        }
        if ($('#EMarketing').val().length > 10 || $('#EMarketing').val() < 0) {
            swal("", "Enter valid marketing expense", "");
            error = false;
            return false;
        }
        if ($('#ETravel').val().length > 10 || $('#ETravel').val() < 0) {
            swal("", "Enter valid travel expense", "");
            error = false;
            return false;
        }
        if ($('#EOther').val().length > 10 || $('#EOther').val() < 0) {
            swal("", "Enter valid Other expense", "");
            error = false;
            return false;
        }
        //if ($('#ETotal').val() == '' || $('#ETotal').val() == 0 ) {
        //    swal("", "Enter expense for cme", "");
        //    error = false;
        //    return false;
        //}
        if ($('#Remark').val().length > 500) {
            swal("", "Enter 1000 character in remark", "");
            error = false;
            return false;
        }
        //var dates = $('#SDate').val().split('-')[2] + '/' + $('#SDate').val().split('-')[1] + '/' + $('#SDate').val().split('-')[0];
        //var todate = $('#UDate').val().split('-')[2] + '/' + $('#UDate').val().split('-')[1] + '/' + $('#UDate').val().split('-')[0];
        var Check = $.grep(CME.defaults.CurrentCME, function (v) {
            return v.CME_ID == $('#CMEName_hidden').val() && v.Region_Code == $('#Region_hidden').val() && v.Doctor_Code == $('#Doctors_hidden').val();
        });
        if (Check.length != 0) {
            for (var i = 0; i < Check.length; i++) {
                var Startdate = Check[i].Start_Date.split('/')[2] + '-' + Check[i].Start_Date.split('/')[1] + '-' + Check[i].Start_Date.split('/')[0]
                var enddate = Check[i].End_Date.split('/')[2] + '-' + Check[i].End_Date.split('/')[1] + '-' + Check[i].End_Date.split('/')[0]
                Startdate = new Date(Startdate)
                enddate = new Date(enddate + ' 00:00:00')

                if (SDate <= Startdate && enddate <= UfDate) {
                    fnMsgAlert('info', 'CME', 'You have already planned CME for this period');
                    error = false;
                    return false;
                }
                if ((SDate >= Startdate && SDate < enddate) || (UfDate >= Startdate && UfDate < enddate)) {
                    fnMsgAlert('info', 'CME', 'You have already planned CME for this period');
                    error = false;
                    return false;
                }

            }
        }
        return error;
    },
    getAllCMEPlanningDetails: function () {
        debugger;
        var User_Code = CME.defaults.UserCode;
        var Start_Date = $('#CMEStartDate').val();
        var End_Date = $('#CMEEndDate').val();
        var Status = $('#Status').val();
        Method_params = ["CMEApi/GetCMEPlanningDetails", CME.defaults.CompanyCode, User_Code, Start_Date, End_Date, Status];
        CoreREST.get(null, Method_params, null, CME.getAllCMEDetailsSuccess, CME.getAllCMEDetailsSuccessFailure);
    },
    getAllCMEDetailsSuccess: function (response) {
        debugger;
        var result = response.list.lst;
        CME.defaults.PlanningDetails = response.list.lst;
        CME.defaults.Product = response.list.lstProd;
        $('#Summary').html('');
        var grid = new ej.grids.Grid({
            dataSource: result,
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
                //{ headerText: 'Action', width: 150, textAlign: 'center' },
                { field: 'CME_Name', headerText: 'CME Name', textAlign: 'left' },
                  { field: 'Region_Name', headerText: 'Region Name', textAlign: 'left' },
                  { field: 'Status', width: 150, headerText: 'Status', textAlign: 'center' },
               { field: 'View Details', headerText: 'View Details', textAlign: 'center' },
                { field: 'Start_Date', width: 150, headerText: 'Planned Date ', format: 'yMd', textAlign: 'center' },
                { field: 'End_Date', width: 150, headerText: 'Plan Applicable Till', format: 'yMd', textAlign: 'center' },
                { field: 'Doctor_Name', headerText: 'Doctor Name', textAlign: 'left' },
                { field: 'No_Of_Doctor', width: 150, headerText: 'No of doctors participation', textAlign: 'center' },
                { field: 'No_Of_Month', width: 150, headerText: 'No Of Month', textAlign: 'center' },

            { field: 'Created_Date', width: 150, headerText: 'Created Date', textAlign: 'center' },
                 { field: 'Remark', headerText: 'Remark', textAlign: 'left' },
            ],
            queryCellInfo: CME.fnQueryCellInfo,
        });
        grid.appendTo('#Summary');
    },
    getAllCMEDetailsSuccessFailure: function (response) {

    },
    getAllCurrentDateCMEPlanning: function () {
        debugger;
        var User_Code = CME.defaults.UserCode;
        var today = new Date();
        var Start_Date = $('#SDate').val();
        var End_Date = $('#SDate').val();
        var Status = 4;
        Method_params = ["CMEApi/GetCMEPlanningDetails", CME.defaults.CompanyCode, User_Code, Start_Date, End_Date, Status];
        CoreREST.get(null, Method_params, null, CME.getAllCurrentDateCMEPlanningSucess, CME.getAllCurrentDateCMEPlanningFailure);
    },
    getAllCurrentDateCMEPlanningSucess: function (response) {
        debugger;
        CME.defaults.CurrentCME = response.list.lst;

    },
    getAllCurrentDateCMEPlanningFailure: function (response) {

    },
    fnQueryCellInfo: function (args) {
        if (args.column.headerText == 'View Details') {
            args.cell.innerHTML = "<a herf=# style='cursor:pointer;color:blue;' onclick='CME.CMEProductExpenseDetails(\"" + args.data.P_ID + "\");'>View Details</a>";
        }
    },
    CMEProductExpenseDetails: function (P_ID) {
        debugger;
        debugger;
        var Details = $.grep(CME.defaults.PlanningDetails, function (v) {
            return v.P_ID == P_ID;
        });
        var table = '';
        table += '<tr>';
        table += '<td>';
        table += Details[0].Doctor_Expense == null ? '-' : Details[0].Doctor_Expense;
        table += '</td>';
        table += '<td>'
        table += Details[0].Venu_Expense == null ? '-' : Details[0].Venu_Expense;
        table += '</td>';
        table += '<td>';
        table += Details[0].Marketing_Expense == null ? '-' : Details[0].Marketing_Expense;
        table += '</td>';
        table += '<td>';
        table += Details[0].Travel_Expense == null ? '-' : Details[0].Travel_Expense;
        table += '</td>';
        table += '<td>';
        table += Details[0].Other_Expense == null ? '-' : Details[0].Other_Expense;
        table += '</td>';
        table += '<td>';
        table += Details[0].Total_Expense == null ? '-' : Details[0].Total_Expense;
        table += '</td>';
        table += '<tr>';
        $('#CMEBody').html(table);
        table = '';
        if (Details[0].Approved_By != null) {
            table += '<tr>';
            table += '<td style="min-width:100px">' + Details[0].Approved_By + '</td>';
            table += '<td style="min-width:168px;">' + Details[0].Approved_Date + '</td>';
            table += '<td style="min-width:168px;">' + Details[0].Approval_Remark + '</td>';
            table += '<tr>';

        }
        else {
            table += '<tr>';
            table += '<td colspan = "3">No Record Found</td>';
            table += '</tr>';
        }
        $('#CMEAction').html(table);
        var So = 0;
        table = '';
        var response = $.grep(CME.defaults.Product, function (v) {
            return v.P_ID == P_ID;
        });
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                So++;
                table += '<tr>';
                table += '<td style="min-width:100px">' + So + '</td>';
                table += '<td style="min-width:168px;">' + response[i].Product_Name + '</td>';
                table += '<td style="min-width:168px;">'
                table += response[i].Current_Sales == null ? '-' : response[i].Current_Sales;
                table += '</td>';
                table += '<td style="min-width:168px;">'
                table += response[i].Potential_Sales == null ? '-' : response[i].Potential_Sales;
                table += '</td>';
                //table += '<td style="min-width:168px;">' + response[i].No_Of_Month + '</td>';
                table += '</tr>';
            }
        }
        else {
            table += '<tr>';
            table += '<td colspan = "5">No Record Found</td>';
            table += '</tr>';
        }

        $('#CMEProd').html(table);
        $('#myModal').modal('show');
    },
    fnEdit: function (P_ID) {
        debugger;
        var Details = $.grep(CME.defaults.PlanningDetails, function (v) {
            return v.P_ID == P_ID;
        });
        CME.defaults.Edit_CME = '';
        CME.defaults.P_ID = P_ID;
        CME.defaults.Edit_CME = Details[0].CME_ID;
        CME.defaults.Edit_Doctor = Details[0].Doctor_Code;
        regionDownListObj.value = Details[0].Region_Code;
        //  CME.fnEditCMEName(Details[0].Region_Code, Details[0].CME_ID)
        //dropDownListObj.value = ""+Details[0].CME_ID+"";
        $('#Dates').val(Details[0].Dates);
        $('#NoofDoctor').val(Details[0].No_Of_Doctor);
        $('#Edoctor').val(Details[0].Doctor_Expense);
        $('#Evenu').val(Details[0].Venu_Expense);
        $('#EMarketing').val(Details[0].Marketing_Expense);
        $('#ETravel').val(Details[0].Travel_Expense);
        $('#EOther').val(Details[0].Other_Expense);
        $('#ETotal').val(Details[0].Total_Expense);
        $('#Remark').val(Details[0].Remark);
        $('.buttons').html('<button id="update" value="Update" class="btn btn-primary mr-1" type="button" onclick=CME.fnsubmit("Update")>Update</button><button id="Cancel" value="Cancel" class="btn btn-primary" type="button" onclick=CME.fncancel() >Cancel</button>');
        CME.fnCMEPlanning();
    },
    fncancel: function () {
        CME.defaults.P_ID = 0;

        $('#Dates').val('');
        $('#NoofDoctor').val('');
        $('#Edoctor').val('');
        $('#Evenu').val('');
        $('#EMarketing').val('');
        $('#ETravel').val('');
        $('#EOther').val('');
        $('#ETotal').val('0.00');
        $('#NoofMonth').val('')
        $('#Remark').val('');
        $('#SDate').val('');
        $('#UDate').val('');
        getAllCMERegion();
        $('#UserName').val('')
        $('.productMapping').hide();
        $('#cmeinput').html("<input class='form-control' type='text' tabindex='1' id='CMEName' />");
        $('#multiselect').html("<input class='form-control cancel' type='text' id='Doctors'>");
        $('.buttons').html('<button id="submit" value="Submit" class="btn btn-primary mr-1" type="button" onclick=CME.fnsubmit("Save")>Submit</button><button id="Cancel" value="Cancel" class="btn btn-primary" type="button" onclick=CME.fncancel()>Cancel</button>');
    },
    GetProductDetails: function () {
        var CampaignCode = $('#CMEName_hidden').val();
        Method_params = ["CMEApi/GetCMEProductForMapping", CME.defaults.CompanyCode, CampaignCode];
        CoreREST.get(null, Method_params, null, CME.fnMappingSuccessCallback, CME.fnMappingChangeFailureCallback);
    },
    fnMappingSuccessCallback: function (res) {
        debugger;
        $('#mapping').html('');
        $('.productMapping').show();
        var table = ''
        var response = res.list;
        if (response.length > 0) {
            $('#NoofMonth').val(response[0].No_Of_Month);
            table += '<table class="table table-bordered" id="mappingtable">';
            table += '<thead><tr><th scope="col"><input type="checkbox" onchange="checkAll(this)" name="chk[]"/></th><th scope="col">Product Name</th><th scope="col">Current Sales</th><th scope="col">Potential sales</th></tr></thead>';
            table += '<tbody>';
            for (var i = 0; i < response.length; i++) {
                table += '<tr><td><input type="checkbox" id="chkbox' + i + '"/></td><td style="display:none" class="code" id="Code_' + i + '">' + response[i].Product_Code + '</td><td>' + response[i].Product_Name + '</td><td><input type="number" id="Csales_' + i + '" class="Current form-control" id="CurrentSales" onkeypress="return fnValidateBudget(this,event);">';
                table += '</td><td><input type="number" id="Psales_' + i + '" class="Potential form-control" id="PotentialSales" onkeypress="return fnValidateBudget(this,event);"></td></tr>';
            }
            table += ' </tbody>';
            table += '</table>';
        }

        $('#mapping').html(table)
    },
    fnMappingChangeFailureCallback: function () {

    }
}
function checkAll(ele) {
    var checkboxes = document.getElementsByTagName('input');
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            console.log(i)
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = false;
            }
        }
    }
}
function fnValidateBudget(Id, evt) {
    debugger;
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
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
