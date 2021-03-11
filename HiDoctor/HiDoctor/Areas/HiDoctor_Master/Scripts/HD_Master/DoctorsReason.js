var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var regionCode_g = "";
var regionName_g = "";
var globalurl = "";
var DoctorCount = {
    defaults: {
        //misseddocList: "",
        DoctorlistDetails: "",
        RegionDetails: "",
        lstProductSales: '',
        DoctorDetailslist: '',
        ReasonList: '',
    },
    initialize: function () {
        debugger;

        globalurl = window.location.origin;

        GetAllRegion();
    },
    fnstart: function () {
        $('#load').html('<img style="width:50px;" src="../../Content/images/loader1.gif"/>');
        DoctorCount.fnGo();
    },
    fnGo: function () {
        debugger;
        var RegionName = $('select[name="regionname"]').text();
        var Month = "";
        var Year = "";
        Month = fnGetMonthName($('#Myear').val().split('-')[0]);
        Year = $('#Myear').val().split('-')[1];
        var regName = RegionName
        $('#regName').text('RegionName');
        if ($('select[name="regionname"]').text() == "") {
            fnMsgAlert('info', 'Doctor Missed Reason', 'Please select the valid Region Name');
            return false;
        }
        GetReasonDetails();
        DoctorCount.gridDetails();
        //$('#DocRegioList').show();
        DoctorCount.DoctorDetails();

        $('#dvAjaxLoad').hide();
    },
    gridDetails: function () {
        debugger;
        //var regioncode = $('select[name="regionname"]').val();
        var url = '../../HiDoctor_Master/MissedDoctor/GetGridDetails'
        var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
        var Year = $('#Myear').val().split('-')[1];
        var RegionCode = $('select[name="regionname"]').val()


        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/MissedDoctor/GetGridDetails';
        }

        $.ajax(
                {
                    type: 'GET',
                    data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + RegionCode + '&Month=' + Month + '&Year=' + Year,
                    url: url,
                    success: function (response) {
                        debugger
                        //$('#DocRegioList').show();
                        if (response != null && response.length > 0){
                            var Content = "";
                            Content += '<div class="panel panel-default list" id="DocRegioList" style="padding:30px 9px 30px">';
                            Content += '<div class="panel-body">';
                            Content += '<div class="col-xs-12 col-sm-12 clearfix" style="padding:0px;">';
                            Content += '<form>';
                            Content += '<div class="form-group col-sm-3">';
                            Content += '<label id="regName"for="">Region Name :</label>';
                            Content += '<label >' + response[0].Region_Name + '</label>';
                            Content += '</div>'
                            Content += '<div class="form-group col-sm-5">';
                            Content += '<label  id="emplname"for="">Employee Name :</label>';
                            Content += '<label >' + response[0].Employee_Name + '</label>';
                            Content += '</div>';
                            Content += '<div class="form-group col-sm-4">';
                            Content += '<label for="">Month:</label>';
                            Content += '<label >' + response[0].MonthName + '</label>';
                            Content += '</div>';
                            Content += '</form>';
                            Content += '</div>';
                            Content += '<div class="col-xs-12 col-sm-12 clearfix" style="padding:0px;">';
                            Content += '<form>';
                            Content += '<div class="form-group col-sm-3">';
                            Content += '<label for="">Manger Region Name :</label>';
                            Content += '<label >' + response[0].Reporting_Manager_Region_Name + '</label>';
                            Content += '</div>';
                            Content += '<div class="form-group col-sm-5">';
                            Content += '<label for="">Manager Name :</label>';
                            Content += '<label >' + response[0].Reporting_Manager_Name + '</label>';
                            Content += '</div>';
                            Content += '<div class="form-group col-sm-4">';
                            Content += '<label for="">Year :</label>';
                            Content += '<label >' + response[0].Year + '</label>';
                            Content += '</div>';
                            Content += '</form>';
                            Content += '</div>';
                            Content += '</div>';
                            Content += '</div>';
                            $('#DocRegioList').html(Content);
                            $('#DocRegioList').show();

                        }

                        else {
                            $('#DocRegioList').html('No Records Found');
                            $('#DocRegioList').show();
                        }
                    },
                    error: function () {

                    }
                });
    },
    DoctorDetails: function () {
        debugger;
        var RegionCode = $('select[name="regionname"]').val()
        var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
        var Year = $('#Myear').val().split('-')[1];
        //var regioncode = $('select[name="regionname"]').val();
        var url = '../../HiDoctor_Master/MissedDoctor/GetAllDoctorslist'
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/MissedDoctor/GetAllDoctorslist';
        }
        $.ajax(
                {
                    //async: false,
                    type: 'POST',
                    data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + RegionCode + '&Month=' + Month + '&Year=' + Year,
                    url: url,
                    success: function (response) {
                        var ReasonList = DoctorCount.defaults.ReasonList;
                        debugger;
                        $('#prodheading').html("<div class='col-lg-6'  style='padding:0px;'><div class='sel'><input type='checkbox' class='selectAll' name='Selectproduct'/><label style='padding:0px;margin-bottom:10px;'>Select All</label></div></div><div class='col-lg-3' style='padding:0px;'><input type='text' class='form-control'  id='search' placeholder='Search By Doctor Name ..' title='Type in a name' autocomplete='off'></div><div class='col-lg-3' style='padding-top:5px;' ><button type='button' class='btn input-sm btn-primary' onclick='DoctorCount.myFunction();'>search</div>");
                        DoctorCount.defaults.misseddocList = response;
                        $('#Doctormislist').show();
                        $('.listMisDoctor').show();
                        if (response != null && response.length > 0) {
                            var Content = "";
                            for (var i = 0; i < response.length; i++) {
                                Content += '<div class="panel panel-default" id="prod">';
                                Content += '<div>';
                                Content += '<div class="panel-heading ProductName1"style="background:#0092b8" id="txtDet_' + response[i].Customer_Code + '"><input type="checkbox" id=' + response[i].Customer_Code + ' class="ProductName" name="docmslist"/><input type="hidden" id="hdnCustomerCode_' + response[i].Customer_Code + '" value="' + response[i].Customer_Code + '" /><input type="hidden" id="hdnRegionCode_' + response[i].Customer_Code + '" value="' + response[i].Region_Code + '" />' + response[i].Customer_Name + '</div>';
                                Content += '</div>';
                                Content += '<div class="panel-body">';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Category </label> <label class="col-sm-6 col-xs-6"  style="padding:0px;">' + response[i].Category_Name + ' </label></div>'
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Specialty</label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Speciality_Name + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">MDL Number </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].MDL_Number + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Local Area</label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Local_Area + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Status </label> <label class="col-sm-6 col-xs-6" id="AVsCount_" style="padding:0px;">' + response[i].Status + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Proposed Visit Count </label> <label class="col-sm-6 col-xs-6"id="NVsCount_" style="padding:0px;">' + response[i].Norms_Visit_Count + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Actual Visit Count </label> <label class="col-sm-6 col-xs-6" id="AVsCount_" style="padding:0px;">' + response[i].Actual_Visit_Count + ' </label></div>';
                                //Content += '<div class="clssales" style=""><label class="col-sm-6 col-xs-6" style="padding:0px;">Reason </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><select class="col-sm-8 col-xs-8" id="reason_' + i + '"><option value="0"selected>I was on Leave</option><option value="1">I went to out station</option></select></div></div>';
                                Content += '<div class="clssales" style="">';
                                Content += '<label class="col-sm-6 col-xs-6 " style="padding:0px;">Reason </label>';
                                Content += '<div class="col-sm-6 col-xs-6 decimalck" style="padding:0px;">';
                                Content += '<select class="col-sm-8 col-xs-8 decimalck" id="reason_' + response[i].Customer_Code + '">';
                                Content += '<option value="0">Select Reason</option>';

                                for (var r = 0; r < ReasonList.length; r++) {
                                    var Reasonvalue = r + 1;
                                    Content += '<option value=' + Reasonvalue + '>' + ReasonList[r].Reason_Name + '</option>';
                                }
                                Content += '</select>';
                                Content += '</div>';
                                Content += '</div>';
                                Content += '<div class="clsclosing" style="margin-top: 20%;"><label class="col-sm-6 col-xs-6 decimalck" style="padding:0px;">Remarks</label> <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="text" class="col-sm-6 col-xs-6 form-control decimalck" id="remarks_' + response[i].Customer_Code + '"><input type="hidden" id="remarks_' + i + '" value="' + response[i].Customer_Code + '" /></div></div>';
                                Content += '</div>';
                                Content += '</div>';
                            }
                            $('#load').html('');
                            //$("input:checkbox").prop("checked", true);
                            $('#Doctorslst').html(Content);
                            $('.btns').show();
                            $('.selectAll').click(function () {
                                DoctorCount.fnselectall();
                            });
                        }

                        else {
                            $('#load').html('');
                            $('#Doctorslst').html('No Records Found');

                            $('.btns').hide();
                            $('#prodheading').hide();
                        }
                    },

                    error: function () {
                    }
                });
        GetAllSalesDetails();
    },
    myFunction: function () {
        debugger;
        // var count = $('.card-column').css("column-count", '2');
        var txt = $('#search').val();
        $('.ProductName1').each(function () {
            if ($(this).text().toUpperCase().indexOf(txt.toUpperCase()) != -1) {
                $(this).parent().parent().css('display', 'inline-block');
            }
            else {
                $(this).parent().parent().css('display', 'none');
            }
        });
        var content = "";
        if ($('.ProductName1').parent().parent().find(":visible").length > 0) {
            $('#norecordsfound').hide();
        }
        else {
            content = "No Record(s) found.";
            $('#norecordsfound').html(content);
            $('#norecordsfound').show()
        }
    },
    fnselectall: function () {
        debugger;
        if ($('.selectAll').is(":checked")) {
            var group = "input:checkbox[name='docmslist']"
            $(group).prop("checked", false);
            $("input:checkbox").prop("checked", true);
           
        }
        else {
            $("input:checkbox").prop("checked", false);
        }
    },

                       // Modal Pop up Binding//
    DoctorDetailslist: function (Header_Id, Month, Year) {
        debugger;
        var RegionCode = $('select[name="regionname"]').val()
        var url = '../../HiDoctor_Master/MissedDoctor/GetprefilDoctorslist'
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/MissedDoctor/GetprefilDoctorslist';
        }

        $.ajax(
                {
                    async: false,
                    type: 'POST',
                    data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + RegionCode + '&Month=' + Month + '&Year=' + Year,
                    async: false,
                    url: url,
                    success: function (response) {
                        debugger;
                        $('#Missedlist').show();
                        if (response != null && response.length > 0) {
                            $('#prodheading').html("<div class='col-lg-6'  style='padding:0px;'><div class='sel'><input type='checkbox' class='selectAll' name='Selectproduct'/><label style='padding:0px;margin-bottom:10px;'>Select All</label></div></div><div class='col-lg-3' style='padding:0px;'><input type='text' class='form-control'  id='search' placeholder='Search By Doctor Name ..' title='Type in a name' autocomplete='off'></div><div class='col-lg-3' style='padding-top:5px;' ><button type='button' class='btn input-sm btn-primary' onclick='DoctorCount.myFunction();'>search</div>");
                            var Content = "";
                            for (var i = 0; i < response.length; i++) {
                                Content += '<div class="panel panel-default" id="prod">';
                                Content += '<div>';
                                Content += '<div class="panel-heading ProductName1"style="background:#0092b8" id="txtDet_' + i + '"><input type="hidden" id="hdnCustomerCode_' + i + '" value="' + response[i].Customer_Code + '" /><input type="hidden" id="hdnRegionCode_' + i + '" value="' + response[i].Region_Code + '" />' + response[i].Customer_Name + '</div>';
                                Content += '</div>';
                                Content += '<div class="panel-body">';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Category </label> <label class="col-sm-6 col-xs-6"  style="padding:0px;">' + response[i].Category_Name + ' </label></div>'
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Specialty</label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Speciality_Name + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">MDL Number </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].MDL_Number + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Local Area</label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Local_Area + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Proposed Visit Count </label> <label class="col-sm-6 col-xs-6"  style="padding:0px;">' + response[i].Norms_Visit_Count + ' </label></div>'
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Actual Visit Count</label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Actual_Visit_Count + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Status </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Status + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Reason Name </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Reason_Name + ' </label></div>';
                                Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Remarks</label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Remarks + ' </label></div>';
                                Content += '</div>';
                                Content += '</div>';

                            }

                            $('#lstdocadetails').html(Content);
                        }
                        else {
                            $('#lstdocadetails').html('No Records Found');
                        }
                    },
                    error: function () {

                    }
                });
    },
    gridDetailsList: function (Header_Id, Month, Year) {
        debugger;
        var url = '../../HiDoctor_Master/MissedDoctor/GetGridDetailslist'
        var RegionCode = $('select[name="regionname"]').val()

        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/MissedDoctor/GetGridDetailslist';
        }

        $.ajax(
                {
                    async: false,
                    type: 'GET',
                    data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + RegionCode + '&Month=' + Month + '&Year=' + Year,
                    async: false,
                    url: url,
                    success: function (response) {
                        debugger;
                        if (response != null && response.length > 0) {
                            var Content = "";
                            //Content += '<div class="panel panel-default list" id="DocRegioList" style="padding:30px 9px 30px">';
                            //Content += '<div class="panel-body">';
                            Content += '<div class="col-xs-12 col-sm-12 clearfix" style="padding:0px;">';
                            Content += '<form>';
                            Content += '<div class="form-group col-sm-3">';
                            Content += '<label id="regName"for="">Region Name :</label>';
                            Content += '<label >' + response[0].Region_Name + '</label>';
                            Content += '</div>'
                            Content += '<div class="form-group col-sm-4">';
                            Content += '<label  id="emplname"for="">Employee Name :</label>';
                            Content += '<label >' + response[0].Employee_Name + '</label>';
                            Content += '</div>';
                            Content += '<div class="form-group col-sm-2">';
                            Content += '<label for="">Month:</label>';
                            Content += '<label >' + response[0].MonthName + '</label>';
                            Content += '</div>';
                            Content += '<div class="form-group col-sm-3">';
                            Content += '<label for="">Status:</label>';
                            Content += '<label >' + response[0].status + '</label>';
                            Content += '</div>';
                            Content += '</form>';
                            Content += '</div>';
                            Content += '<div class="col-xs-12 col-sm-12 clearfix" style="padding:0px;">';
                            Content += '<form>';
                            Content += '<div class="form-group col-sm-3">';
                            Content += '<label for="">Manger Region Name :</label>';
                            Content += '<label >' + response[0].Reporting_Manager_Region_Name + '</label>';
                            Content += '</div>';
                            Content += '<div class="form-group col-sm-6">';
                            Content += '<label for="">Manager Name :</label>';
                            Content += '<label >' + response[0].Reporting_Manager_Name + '</label>';
                            Content += '</div>';
                            Content += '<div class="form-group col-sm-2">';
                            Content += '<label for="">Year :</label>';
                            Content += '<label >' + response[0].Year + '</label>';
                            Content += '</div>';
                            Content += '</form>';
                            Content += '</div>';
                            //Content += '</div>';
                            //Content += '</div>';
                            $('#prefildetailedlist').html(Content);

                        }

                        else {
                            $('#prefildetailedlist').html('No Records Found');
                        }
                    },
                    error: function () {

                    }
                });
    },
    fnsave: function (status) {
        debugger;
        $('#Prodsave').prop('disabled', true);
        var RegionCode = $('select[name="regionname"]').val()
        var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
        var Year = $('#Myear').val().split('-')[1];
        var lst = $.grep(DoctorCount.defaults.RegionDetails, function (v) {
            return v.label == $('#regionname').val();
        });

        if (lst.length == 0) {
            fnMsgAlert('info', 'Doctor Missed Reason', 'Please select the valid Region Name');
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        if ($('#Myear').val() == '') {
            fnMsgAlert('info', 'Doctor Missed Reason', 'Please select Sales Month & Year');
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }

        var list = "";
        var list = $.grep(DoctorCount.defaults.DoctorlistDetails, function (v) {
            return v.Status == 1 && v.Month == Month && v.Year == Year && v.Region_Code == RegionCode;
        });
        if (list.length > 0) {
            fnMsgAlert('info', 'Doctor Missed Reason', 'Already entered For this Month And Year');
            //fnMsgAlert('Already entered For this Month And Year', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        var arr = [];
        $('input[name="docmslist"]:checked').each(function () {
            var tr = $(this).parent().attr('id');
            tr = tr.split('_')[1];
            var obj = {
                Customer_Code: tr,
                Customer_Name: $('#txtDet_' + tr).text(),
                Region_Code: $('#hdnRegionCode_' + tr).val(),
                Customer_Code: $('#hdnCustomerCode_' + tr).val(),
                Reason: $('#reason_' + tr + ' option:selected').val(),
                Remarks: $('#remarks_' + tr).val()

            }

            arr.push(obj);

        });

        if (arr.length == 0) {
            fnMsgAlert('info', 'Doctor Missed Reason', 'Please select atleast one Record');
            return false;
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].Reason == 0) {
                fnMsgAlert('info', 'Doctor Missed Reason', 'Please Select Reason for ' + arr[i].Customer_Name + '');
                $('#Prodsave').prop('disabled', false);
                unitsvalue = false;
                return false;
            }
        }

        var lstProductSales = "";
        var _objData = new Object();
        _objData.User_Code = LoginUserCode;
        _objData.Company_Code = CompanyCode;
        _objData.Region_Code = RegionCode;
        _objData.lstProductSales = arr;
        _objData.Month = Month;
        _objData.Year = Year;
        _objData.Header_Id = 0;
        _objData.subDomainName = subDomainName;
        _objData.Status = status;
        var url = '../HiDoctor_Master/MissedDoctor/GetInsertDoctorsList'
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/MissedDoctor/GetInsertDoctorsList';
        }
        $.ajax(
        {
            type: "Post",
            url: url,
            dataType: 'json',
            data: JSON.stringify(_objData),
            contentType: "application/json utf-8",
            success: function (response) {
                if (response >= 1) {
                    fnMsgAlert('success', 'Doctor Missed Reason', 'Successfully  Created.');
                    $('#Myear').prop('disabled', false);
                    $("input:checkbox").prop("checked", false);
                    $('.decimalck').val('');
                    $('.decimalck').val('');

              
                    GetAllSalesDetails();
                    DoctorCount.DoctorDetails();
                }
                else if (response == -1) { //Already Exists the record throw the Error.
                    fnMsgAlert('info', 'Doctor Missed Reason', 'Already entered For this Month And Year');
                    $("input:checkbox").prop("checked", false);
                    $('.decimalck').val('');
                }

            },

        });

    },
}
function fnprodclear() {
    debugger;
    $('#customerName').val('');
    $('#Myear').prop('disabled', false);
    GetAllRegion();
}
function GetAllRegion() {
    debugger;
    var url = '../HiDoctor_Master/MissedDoctor/GetAllRegionName'
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/MissedDoctor/GetAllRegionName';
    }
    $.ajax(
             {
                 type: 'POST',
                 url: url,
                 data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + LoginRegionCode,
                 success: function (response) {
                     debugger;
                     var indexDet = 0;
                     $('#dvtxtregionName').html('<input type="text" class="" id="regionname">');
                     if (response != null && response.length > 0) {
                         var lstRegions = [];
                         for (var i = 0; i < response.length; i++) {
                             if (i == 0) {
                                 indexDet = 0;
                                 var regioncode = response[0].Region_Code;
                                 $('#regionname').val(response[0].Region_Name)
                             }
                             var _obj = {
                                 label: response[i].Region_Name,
                                 id: response[i].Region_Code,
                                 index: i

                             }
                             lstRegions.push(_obj)
                         }
                         DoctorCount.defaults.RegionDetails = '';
                         DoctorCount.defaults.RegionDetails = lstRegions;

                         var atcObj = new ej.dropdowns.DropDownList({
                             dataSource: lstRegions,
                             fields: { text: 'label', value: 'id' },
                             filterBarPlaceholder: 'Search',
                             showClearButton: true,
                             allowFiltering: true,
                             placeholder: 'Select a Region',
                             index: indexDet,
                             filtering: function (e) {
                                 var dropdown_query = new ej.data.Query();
                                 dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                 e.updateData(lstRegions, dropdown_query);
                             },

                         });
                         atcObj.appendTo('#regionname');
                         atcObj.id = LoginRegionCode;
                         regionCode_g = LoginRegionCode;

                     }

                     var month_year = fnLoadMonthAndYear();
                     $('#Myear').val(month_year);
                     // GetAllSalesDetails();
                 },
                 error: function () {

                 }
             });

}
function GetReasonDetails() {
    var RegionCode = $('select[name="regionname"]').val()
    var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
    var Year = $('#Myear').val().split('-')[1];
    var url = '../../HiDoctor_Master/MissedDoctor/ReasonDetails'
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/MissedDoctor/ReasonDetails';

    }
    $.ajax(
       {
           type: "GET",
           data: "subDomainName=" + subDomainName + '&Region_Code=' + RegionCode,
           url: url,
           success: function (response) {
               debugger;
               DoctorCount.defaults.ReasonList = response;

           },
           error: function () {

           }
       });
}
function prefileditDetails(Header_Id, Status, Month, Year) {
    debugger;
    var RegionCode = $('select[name="regionname"]').val()
    //var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
    //var Year = $('#Myear').val().split('-')[1];
    var url = "../../HiDoctor_Master/MissedDoctor/prefileditDetails"
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/MissedDoctor/prefileditDetails';
    }
    $.ajax(
       {
           async: false,
           type: "GET",
           data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + RegionCode + '&Month=' + Month + '&Year=' + Year,
           url: url,
           success: function (response) {
               debugger;
               DoctorCount.defaults.DoctorDetailslist = response;

           },
           error: function () {

           }
       });
}
function GetAllSalesDetails() {
    debugger;
    var RegionCode = $('select[name="regionname"]').val()
    var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
    var Year = $('#Myear').val().split('-')[1];
    var url = "../../HiDoctor_Master/MissedDoctor/GetAllDoctorDetails"
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/MissedDoctor/GetAllDoctorDetails';
    }
    $.ajax(
       {
           type: "GET",
           data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + RegionCode + '&Month=' + Month + '&Year=' + Year,
           url: url,
           success: function (response) {
               debugger;
               DoctorCount.defaults.DoctorlistDetails = response;
               //Sales.defaults.OtherSales = response.lstdetails;
               if (response.length != 0) {
                   debugger;

                   $('#detailedlist').html('');
                   var grid = new ej.grids.Grid({
                       dataSource: response,
                       //queryCellInfo: Sales.queryCellInfo,
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
                               { headerText: 'Edit', template: "<a href=#;>Edit</a>", width: 150, textAlign: 'center' },
                               { field: 'Region_Name', headerText: 'Region Name', width: 150, textAlign: 'center' },
                               { field: 'Year', headerText: 'Year', width: 150, textAlign: 'center' },
                               { field: 'MonthName', headerText: 'Month', width: 150, textAlign: 'center' },
                               { headerText: 'View', template: "<a href=#;>View</a>", width: 150, textAlign: 'center' },
                               { field: 'Entered_By', headerText: 'Entered By', width: 150, textAlign: 'center' },
                                { field: 'status', headerText: 'Status', width: 150, textAlign: 'center' },
                               { field: 'Entered_Date', headerText: 'Entered_Date', width: 150, textAlign: 'center' },
                       ],
                       queryCellInfo: queryCellInfo,
                   });
                   grid.appendTo('#detailedlist');

               }
               else {
                   $('#detailedlist').html('<label>No Record Found</label>');
               }
           },
           error: function () {

           }
       });
}
function queryCellInfo(args) {
    if (args.column.headerText == "View") {
        if (args.cell.innerText == "View") {
            args.data.Status
            args.cell.innerHTML = "<a href='#'onclick=fnView(\"" + args.data.Header_Id + "\",\"" + args.data.Month + "\",\"" + args.data.Year + "\")>View</a>"

        }
        else {
            args.cell.innerHTML = "View"
        }
    }
    if (args.column.headerText == "Edit") {
        if (args.cell.innerText == "Edit") {

            args.cell.innerHTML = "<a href='#' onclick='fnEdit(\"" + args.data.Header_Id + "\",\"" + args.data.Status + "\",\"" + args.data.Month + "\",\"" + args.data.Year + "\");'>Edit</a>";

        }
        if (args.data.Status == 1)
            args.cell.innerHTML = "<a></a>";
    }
}

function fnEdit(Header_Id, Status, Month, Year) {
    debugger;
    prefileditDetails(Header_Id, Status, Month, Year);
    var lst = $.grep(DoctorCount.defaults.DoctorDetailslist, function (v) {
        return v.Header_Id == Header_Id;
    });
    var Month = fnGetMonth(lst[0].Month);
    $('#Myear').val(Month + '-' + lst[0].Year);
    DoctorDetailsedit();


    var lst = $.grep(DoctorCount.defaults.DoctorDetailslist, function (v) {
        return v.Header_Id == Header_Id;
    });
    $('#Myear').prop('disabled', true);
    for (var i = 0; i < lst.length; i++) {
        $("input[name='docmslist'][id='" + lst[i].Customer_Code + "']").prop('checked', true);
        $('#reason_' + lst[i].Customer_Code).val(lst[i].Reason_Id);
        $('#remarks_' + lst[i].Customer_Code).val(lst[i].Remarks);
        //$('#reason_' + i).val(lst[i].Reason_Id);
        //$('#remarks_' + i).val(lst[i].Remarks);
    }
}
function DoctorDetailsedit() {
    debugger;
    var RegionCode = $('select[name="regionname"]').val()
    var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
    var Year = $('#Myear').val().split('-')[1];
    var url = '../../HiDoctor_Master/MissedDoctor/GetAllDoctorslist'
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/MissedDoctor/GetAllDoctorslist';
    }

    $.ajax(
            {
                async: false,
                type: 'POST',
                data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + RegionCode + '&Month=' + Month + '&Year=' + Year,
                url: url,
                success: function (response) {

                    var ReasonList = DoctorCount.defaults.ReasonList;

                    debugger;
                    $('#prodheading').html("<div class='col-lg-6'  style='padding:0px;'><div class='sel'><input type='checkbox' class='selectAll' name='Selectproduct'/><label style='padding:0px;margin-bottom:10px;'>Select All</label></div></div><div class='col-lg-3' style='padding:0px;'><input type='text' class='form-control'  id='search' placeholder='Search By Doctor Name ..' title='Type in a name' autocomplete='off'></div><div class='col-lg-3' style='padding-top:5px;' ><button type='button' class='btn input-sm btn-primary' onclick='DoctorCount.myFunction();'>search</div>");
                    DoctorCount.defaults.misseddocList = response;
                    $('#Doctormislist').show();
                    $('.listMisDoctor').show();
                    if (response != null && response.length > 0) {
                        var Content = "";
                        for (var i = 0; i < response.length; i++) {
                            Content += '<div class="panel panel-default" id="prod">';
                            Content += '<div>';
                            Content += '<div class="panel-heading ProductName1"style="background:#0092b8" id="txtDet_' + response[i].Customer_Code + '"><input type="checkbox" id=' + response[i].Customer_Code + ' class="ProductName" name="docmslist"/><input type="hidden" id="hdnCustomerCode_' + response[i].Customer_Code + '" value="' + response[i].Customer_Code + '" /><input type="hidden" id="hdnRegionCode_' + response[i].Customer_Code + '" value="' + response[i].Region_Code + '" />' + response[i].Customer_Name + '</div>';
                            Content += '</div>';
                            Content += '<div class="panel-body">';
                            Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Category </label> <label class="col-sm-6 col-xs-6"  style="padding:0px;">' + response[i].Category_Name + ' </label></div>'
                            Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Specialty</label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Speciality_Name + ' </label></div>';
                            Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">MDL Number </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].MDL_Number + ' </label></div>';
                            Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Local Area</label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Local_Area + ' </label></div>';
                            Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Status </label> <label class="col-sm-6 col-xs-6" id="AVsCount_" style="padding:0px;">' + response[i].Status + ' </label></div>';
                            Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Proposed Visit Count </label> <label class="col-sm-6 col-xs-6"id="NVsCount_" style="padding:0px;">' + response[i].Norms_Visit_Count + ' </label></div>';
                            Content += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Actual Visit Count </label> <label class="col-sm-6 col-xs-6" id="AVsCount_" style="padding:0px;">' + response[i].Actual_Visit_Count + ' </label></div>';
                            //Content += '<div class="clssales" style=""><label class="col-sm-6 col-xs-6" style="padding:0px;">Reason </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><select class="col-sm-8 col-xs-8" id="reason_' + i + '"><option value="0"selected>I was on Leave</option><option value="1">I went to out station</option></select></div></div>';
                            Content += '<div class="clssales" style="">';
                            Content += '<label class="col-sm-6 col-xs-6 " style="padding:0px;">Reason </label>';
                            Content += '<div class="col-sm-6 col-xs-6 decimalck" style="padding:0px;">';
                            Content += '<select class="col-sm-8 col-xs-8 decimalck" id="reason_' + response[i].Customer_Code + '">';
                            Content += '<option value="0">Select Reason</option>';
                            for (var r = 0; r < ReasonList.length; r++) {
                                var Reasonvalue = r + 1;
                                Content += '<option value=' + Reasonvalue + '>' + ReasonList[r].Reason_Name + '</option>';

                            }

                            Content += '</select>';
                            Content += '</div>';
                            Content += '</div>';
                            Content += '<div class="clsclosing" style="margin-top: 20%;"><label class="col-sm-6 col-xs-6 decimalck" style="padding:0px;">Remarks</label> <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="text" class="col-sm-6 col-xs-6 form-control decimalck" id="remarks_' + response[i].Customer_Code + '"><input type="hidden" id="remarks_' + i + '" value="' + response[i].Customer_Code + '" /></div></div>';
                            Content += '</div>';
                            Content += '</div>';
                        }
                        $('#load').html('');
                        //$("input:checkbox").prop("checked", true);
                        $('#Doctorslst').html(Content);
                        $('.btns').show();
                        $('.selectAll').click(function () {
                            DoctorCount.fnselectall();
                        });

                    }

                    else {
                        $('#load').html('');
                        $('#Doctorslst').html('No Records Found');

                        $('.btns').hide();
                        $('#prodheading').hide();
                    }

                },

                error: function () {

                }
            });
}

function fnView(Header_Id, Month, Year) {
    debugger;
    DoctorCount.gridDetailsList(Header_Id, Month, Year);
    DoctorCount.DoctorDetailslist(Header_Id, Month, Year);
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

function fnLoadMonthAndYear() {
    debugger;
    var today = new Date();
    today.setDate(today.getDate());
    var pmm = today.getMonth() + 1;
    var pyy = today.getFullYear();
    var monthName = fnGetMonth(pmm);
    var monthandyear = monthName + '-' + pyy;
    return monthandyear;
}
