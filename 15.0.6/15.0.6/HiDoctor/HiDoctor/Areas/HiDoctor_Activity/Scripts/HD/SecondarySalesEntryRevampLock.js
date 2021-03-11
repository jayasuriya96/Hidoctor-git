
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var Selected_Region_Code = "";
var valid = false;
var product_List;
var product_Name_List = [];
var price_Group = "";
var privilege_List = "";
var Selected_Product_List;
var grid2;
var privilege = "";
var Generated_Date = "";
var rowCount = 1;
var Input_Columns = "";
var Edited_SS_Code = "";
var stockCode = "";
var Compute_Field_Editable = false;
var Purchase_Editable = false;
var Opening_Editable = false;
var arr = [];
var Year = "";
var Month = "";
var final_Insert_Data = [];
var Insert_Mode = "";
var check_ps = "";
var global_variable = "";
var check_Mandatory_Privilege = true;
var lstEnteredProducts = [];
var lstUnMappedProducts = [];
var lstCheckMappedProd = [];
var can_Enter_SS = true;
var double_Entry_Check = true;
var g_tblSecondarySalesReleased = "";
var No_decimal = "";
var SecondarySales = {
    //setting default values related to logged in user
    defaults: {
        Company_Code: "",
        Company_Id: "",
        LogRegionCode: "",
        LogUserCode: "",
        CompanyId: "",
        Month: "",
        Year: "",

        //initializings: function () {
        //    debugger;
        //    SecondarySales.fnGetDateList();
        //},
    },
    fnClear: function () {
        debugger;
        $("#txtMonth").val('');
        $("#effectfrom").val('');
        $("#effectto").val('');
        
},
    fnperodiclock: function () {
        debugger;
        $('.def').addClass('active');
        $('.sum').removeClass('active');
        $('#dvSecondarySalesEnteredDetails').hide();
        $("#perloc").show();
        $("#btnTree").show();
        $("#dvregtree").show();
        $("#DetailsPer").hide();


    },
    fnDetails: function () {
        debugger;
        $('.def').removeClass('active');
        $('.sum').addClass('active');
        $("#perloc").hide();
        $("#btnTree").show();
        $("#dvregtree").show();
        $("#DetailsPer").show();
        $('#dvSecondarySalesEnteredDetails').show();
        var today = new Date();
        var cdd = today.getDate();
        var cmm = today.getMonth() + 1;
        var cyy = today.getFullYear();
        if (cmm < 10) {
            var currentDate = cdd + '-' + '0' + cmm + '-' + cyy;

        }
        else {
            var currentDate = cdd + '-' + cmm + '-' + cyy;

        }
       
        
        
        today.setDate(today.getDate() - 60); 
        var pdd = today.getDate();
        var pmm = today.getMonth() + 1;
        var pyy = today.getFullYear();
        if (pmm < 10) {
            var prevDate = pdd + '-' + '0' + pmm + '-' + pyy;

        }
        else {
            var prevDate = pdd + '-' + pmm + '-' + pyy;

        }
       
        
        $('#effectivefrom').val(prevDate);
        $('#effectiveto').val(currentDate);

    },

    fnReleasedetails: function () {
        debugger;
        var regioncodes = "";

        var RegObj = {};
        //for (var i = 0; i < selectedKeys.length; i++) {
        //    //regioncodes = regioncodes + selKeys[i] + ','
        //    regionArray.push(selectedKeys[i]);
        //}
        
        var regionArray = selectedKeys.split(',')
        

        if (regionArray.length == 0) {
            fnMsgAlert('info', 'secondary sales', 'Please Select  Region');
            return false;
        }
        //if (regionArray.length > 1) {
        //    fnMsgAlert('info', 'secondary sales', 'You cannot Select Multiple Regions.');
        //    return false;
        //}
        if ($('#txtMonth').val() == '') {
            swal('Info', 'Please Select Month', 'info');
            return false;
        }
        if ($.trim($('#effectfrom').val()) == "") {
            fnMsgAlert('info', 'secondary sales', 'Please Select Effective From Date.');
            return false;
        }
        if ($.trim($('#effectto').val()) == "") {
            fnMsgAlert('info', 'secondary sales', 'Please Select Effective To Date.');
            return false;
        }


        Month = fnGetMonthName($('#txtMonth').val().split('-')[0]);
        Year = $('#txtMonth').val().split('-')[1];
        var EffectFrom = $('#effectfrom').val();
        var EffectTo = $('#effectto').val();
        if (EffectFrom != "" && EffectFrom != undefined && EffectFrom != null) {
            EffectFrom = EffectFrom.split('-')[2] + '-' + EffectFrom.split('-')[1] + '-' + EffectFrom.split('-')[0];
        }
        if (EffectTo != "" && EffectTo != undefined && EffectTo != null) {
            EffectTo = EffectTo.split('-')[2] + '-' + EffectTo.split('-')[1] + '-' + EffectTo.split('-')[0];
        }
        if (EffectTo < EffectFrom) {
            fnMsgAlert('info', 'secondary sales', 'EffectiveTo date should be greater than Effective From date');
            return false;

        }
        var lstSecondaryDetails = [];
        for (var i = 0; i < regionArray.length; i++) {
           
            var obj1 = {
                Company_Code: SecondarySales.defaults.Company_Code,
                Company_Id: SecondarySales.defaults.Company_Id,
                Entered_By: SecondarySales.defaults.LogUserCode,
                Region_Code: regionArray[i],
                Month: Month,
                Year: Year,
                Effective_From: EffectFrom,
                Effective_To: EffectTo



            }
            if (regionArray[i] !='')
            lstSecondaryDetails.push(obj1);
        }
       
        final_Insert_Data.lstReleasedetails = lstSecondaryDetails
        debugger;
        var final_insert_obj = {
            "lstReleasedetails": lstSecondaryDetails
        }


        SSCoreREST.requestInvoke('api/InsertSecondarySalesRelease', "", final_insert_obj, "POST", SecondarySales.fnGeReleasesSuccessCallback, SecondarySales.fnGetReleasesFailureCallback, null, "JSON");



    },
    fnGeReleasesSuccessCallback: function (response) {
        debugger;
        if (response.Count > 0) {
            //if (final_Insert_Data.obj.SS_Status =="0") {
            $("#txtMonth").val('')
            $("#effectfrom").val('')
            $("#effectto").val('')
            swal('Success', 'Secondary Sales Released successfully', 'success');
            return false;
          
            //}
        }
        else {
            swal('info', 'Secondary Sales  Data Already released ', 'info');
            return false;

        }
    },



    fnGetReleasesFailureCallback: function (response) {
        debugger;
        swal('Info', 'Failed to release Secondary Sales Data', 'info');
        return false;
    },



    fnGo: function () {
        debugger;
        var regionArray = [];
        var regioncodes = "";
        var Sel_Region_Code = "";

        var RegObj = {};
        var Selected_Region_Code = "";
        var RegObj = {};
        //for (var i = 0; i < selectedKeys.length; i++) {
        //    Sel_Region_Code = Sel_Region_Code + selectedKeys[i] + ','
        //    regionArray.push(selectedKeys[i]);
        //    //regioncodes = selKeys[i];
        //}
        var regionArray = selectedKeys.split(',')

        if (regionArray.length == 0) {
            fnMsgAlert('info', 'secondary sales', 'Please Select  Region');
            return false;
        }
        //if (regionArray.length > 1) {
        //    fnMsgAlert('info', 'secondary sales', 'You cannot Select Multiple  Regions.');
        //    return false;
        //}

        //var Effective_From = $('#effectivefrom').val();
        //var Effective_To = $('#effectiveto').val();
        var Effective_From = $('#effectivefrom').val();
        var Effective_To = $('#effectiveto').val();
        if (Effective_From != "" && Effective_From != undefined && Effective_From != null) {
            Effective_From = Effective_From.split('-')[2] + '-' + Effective_From.split('-')[1] + '-' + Effective_From.split('-')[0];
        }
        if (Effective_To != "" && Effective_To != undefined && Effective_To != null) {
            Effective_To = Effective_To.split('-')[2] + '-' + Effective_To.split('-')[1] + '-' + Effective_To.split('-')[0];
        }
        if (Effective_To  < Effective_From) {
            fnMsgAlert('info', 'secondary sales', 'EffectiveTo date should be greater than Effective From date');
            return false;

        }
        var details = SecondarySales.defaults.Company_Code + '/' + regionArray + '/' + Effective_From + '/' + Effective_To;
        SSCoreREST.requestInvoke('api/GetReleasedDetails', details, null, "GET", SecondarySales.fnGetReleasedListSuccessCallback, SecondarySales.fnGetReleasedListFailureCallback);
        //}
    },
    fnGetReleasedListSuccessCallback: function (response) {
        debugger;
        $('#tblSecondarySalesReleased').html('');
        if (response.Count > 0) {
            g_tblSecondarySalesReleased = response.Response;
            var grid = new ej.grids.Grid({
                dataSource: response.Response,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                allowExcelExport: true,
                height: 400,
                gridLines: 'Both',
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['Search'],
                aggregates: [],
                columns: [


                    { field: 'Region_Name', headerText: 'Region Name', width: 150, textAlign: 'center' },
                    { field: 'Month', headerText: 'Month', width: 120, textAlign: 'center' },
                    { field: 'Year', headerText: 'Year', width: 120, textAlign: 'center' },
                     { field: 'Effective_From', headerText: 'Effective From', width: 250, textAlign: 'center' },
                    { field: 'Effective_To', headerText: 'Effective To', width: 150, textAlign: 'center' },
                    //{ field: 'Status', headerText: 'Status', width: 150, textAlign: 'center' },
                     { headerText: 'Status', template: "<a href=#;>Status</a>", width: 100, textAlign: 'center' },


                ],
                queryCellInfo: SecondarySales.queryCellInfo,
            });
            grid.appendTo('#tblSecondarySalesReleased');
        }
        else {
            swal("Info", " No Records Found. ", "info");

           // $('#tblSecondarySalesReleased').html('<label>No Record Found</label>');

            
        }
    },
    fnGetReleasedListFailureCallback(response) {
        //if (response.Count == 0) {
        //    swal("Info", " No Records Found. ", "info");

        //}

    },
    queryCellInfo: function (args) {
        if (args.column.headerText == "Status") {
            if (args.cell.innerText == "Status") {
                var Lock_Status = '';
                //if (Lock_Status == 1) {
                    args.data.Status

                //}
                //else {

                //    args.data.Status = 

                //}

                //if(args.data.Status='Enable')
                //{
                //    Lock_Status=1
                //}
                //else{
                //    Lock_Status=0
                //}
                args.cell.innerHTML = "<a href='#' onclick=SecondarySales.fnStatus(" + args.data.ID + ","+args.data.Lock_Status+")>"+args.data.Status+"</a>";
            }
        }
    },

    fnStatus: function (Id, Lock_Status) {

        debugger;
        if (Lock_Status == 1) {
            var details = SecondarySales.defaults.Company_Code + '/' + Id + '/' + Lock_Status;
            SSCoreREST.requestInvoke('api/statuschange', details, null, "POST", SecondarySales.fnGetStatusSuccessCallback, SecondarySales.fnGetStatusFailureCallback);

        }
        else {
            swal("Info", " You cannot Change Status From  Disable To Enable. ", "info");
            return false;

        }
        //var lstSecondaryDetails =[];
        //var obj1 = {
        //    Company_Code: SecondarySales.defaults.Company_Code,
        //    ID:ID,
        //    Lock_Status:Lock_Status
           

        //                }
        //        lstSecondaryDetails.push(obj1);
        //            final_Insert_Data.lstReleasedetails = lstSecondaryDetails
        //debugger;
        //var final_insert_obj = {
        //    "lststatus": lstSecondaryDetails
          
            
//}
        var details = SecondarySales.defaults.Company_Code + '/' + Id + '/' +Lock_Status;
       SSCoreREST.requestInvoke('api/statuschange', details, null, "POST", SecondarySales.fnGetStatusSuccessCallback, SecondarySales.fnGetStatusFailureCallback);
    },
    fnGetStatusSuccessCallback: function (response) {
        debugger;
        if (response.Count > 0 && response != "") {

            swal("Success", "Successfully  Status changed ", "success");

          SecondarySales.fnGo();
            
        } else {
            swal("Info", " You cannot Change Status From  Disable To Enable. ", "info");

            //}
        }
    },
    fnGetStatusFailureCallback: function (response) {
    },
  


       
  
        fnGetReleasedListFailureCallback: function (response) {
            debugger;
            swal('Info', 'Failed to Release Secondary Sales Data', 'info');
            },
        fnToggleTree: function () {
            btnTree

        if ($('#btnTree').val() == "Hide Tree") {
            $("#dvregtree").hide();
            $("#dvSSEntry").toggleClass("col-sm-9", false);
            $("#dvSSEntry").toggleClass("col-sm-12", true);
            $('#btnTree').val("Show Tree");
}
else {
            $("#dvSSEntry").toggleClass("col-sm-12", false);
            $("#dvSSEntry").toggleClass("col-sm-9", true);
            $("#dvregtree").show();
            $('#btnTree').val("Hide Tree");

        }


    },

}

function fnGetDateList() {
    debugger;
    var today = new Date();
    var cdd = today.getDate();
    var cmm = today.getMonth() + 1;
    var cyy = today.getFullYear();
    if (cmm < 10) {
        var currentDate = cdd + '-' + '0' + cmm + '-' + cyy;
    } else {
        var currentDate = cdd + '-' + cmm + '-' + cyy;
    }
    today.setDate(today.getDate() - 60);
    var pdd = today.getDate();
    var pmm = today.getMonth() + 1;
    var pyy = today.getFullYear();
    if (pmm < 10) {
        var prevDate = pdd + '-' + '0'+ pmm + '-' + pyy;

    }
    var prevDate = pdd + '-' + pmm + '-' + pyy;


    //$('#effectfrom').val(prevDate);
    //$('#effectto').val(currentDate);

}

function fnGetMonthName(Month) {
    var str;
    switch (Month) {
        case "Jan":
            str = 01;
            break;
        case "Feb":
            str = 02;
            break;
        case "Mar":
            str = 03;
            break;
        case "Apr":
            str = 04;
            break;
        case "May":
            str = 05;
            break;
        case "Jun":
            str = 06;
            break;
        case "Jul":
            str = 07;
            break;
        case "Aug":
            str = 08;
            break;
        case "Sep":
            str = 09;
            break;
        case "Oct":
            str = 10;
            break;
        case "Nov":
            str = 11;
            break;
        case "Dec":
            str = 12;
            break;
    }
    return str;
}
function fnGetMonth(Month) {
    var str;
    switch (Month) {
        case 1:
            str = "Jan";
            break;
        case 2:
            str = "Feb";
            break;
        case 3:
            str = "Mar";
            break;
        case 4:
            str = "Apr";
            break;
        case 5:
            str = "May";
            break;
        case 6:
            str = "Jun";
            break;
        case 7:
            str = "Jul";
            break;
        case 8:
            str = "Aug";
            break;
        case 9:
            str = "Sep";
            break;
        case 10:
            str = "Oct";
            break;
        case 11:
            str = "Nov";
            break;
        case 12:
            str = "Dec";
            break;
    }
    return str;
}


