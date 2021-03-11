var regionCode_g = "";
var regionName_g = "";
var globalurl = "";
var ASales = {
    defaults: {
        RegionDetails: "",
        CustomerDetails: "",
        //StateCity: "",
        //Sales_ID: "",
        ProductDetail: "",
        SpChar: "-_.,()"
    },
    Approvalinitialize: function () {
        globalurl = window.location.origin;
        //fnUserSelectedOption();
        ASales.GetAllRegion();
        fnSalesTypeOption();
        //weeksinMonth();
        //ASales.GetStateName();
        var month_year = fnLoadMonthAndYear()
        $('#AMyear').val(month_year);
        var statementdate = fnLoadStatementDate()
        $('#SDate').val(statementdate);
        //$('.Cusinput').change(function () {
        //    if ($('input[name="inputs"]:checked').val() == 'hospital') {
        //        $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
        //    }
        //    else {
        //        $('#icon').html('Text');
        //    }
        //    ASales.GetCustomerDetails();
        //});
        $('#Approvalgo').click(function () {
            ASales.GetAllEntityDetails();
            fnEntityProductOption();
        });
        $('#searchgo').click(function () {
            ASales.GetHospitalName();
        });
        $('#ApprovalClear').click(function () {
            $('#auto').html('');
            $('#auto').html(' <input type="text" class="text-line" id="Aregionname"><input type="hidden" class="form-control" id="Aregioncode">');
            ASales.GetAllRegion();
            $('#AMyear').val('');
            $('#hospital').prop("checked", true);
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            $('#Cityname').val('');
            $('#Citycode').val('');
            $('#Statename').val('');
            $('#Statecode').val('');
            $('#Tab').html('');
            ASales.GetCustomerDetails();
        })
    },
    GetAllRegion: function () {
        debugger;
        var url = '../../HiDoctor_Master/PSAndSS/GetAllRegionName';
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetAllRegionName';
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: 'Region_Code=' + LoginRegionCode + "&subDomainName=" + subDomainName,
            success: function (response) {
                debugger;

                if (response != null && response.length > 0) {

                    //Sale product autofill

                    //var doc = "[";
                    var lstRegions = [];
                    for (var i = 0; i < response.length; i++) {
                        if (i == 0) {
                            regionCode_g = response[0].Region_Code;
                            $('#regionname').val(response[0].Region_Name)
                        }
                        //doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "}";
                        //if (i < response.length - 1) {
                        //    doc += ",";
                        //}
                        var _obj = {
                            label: response[i].Region_Name,
                            id: response[i].Region_Code
                        }
                        lstRegions.push(_obj)
                    }

                    //doc += "];";
                    ASales.defaults.RegionDetails = '';
                    ASales.defaults.RegionDetails = lstRegions;
                    $('#dvtxtregionName').empty();
                    $('#dvtxtregionName').html('<input type="text" class="" id="regionname">');
                    var atcObj = new ej.dropdowns.DropDownList({
                        //set the data to dataSource property
                        dataSource: lstRegions,
                        fields: { text: 'label', value: 'id' },
                        filterBarPlaceholder: 'Search',
                        showClearButton: true,
                        allowFiltering: true,
                        placeholder: 'Select a Region',
                        filtering: function (e) {
                            var dropdown_query = new ej.data.Query();
                            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                            e.updateData(lstRegions, dropdown_query);
                        },
                        select: ASales.changefirst,
                        focusOut: ASales.changefocusOutfirst,

                    });
                    atcObj.appendTo('#regionname');
                    $('#regionname').val(response[0].Region_Name)
                    if (regionCode_g != "" && regionCode_g != null && regionCode_g != undefined) {
                        atcObj.value = regionCode_g;

                    } else {
                        atcObj.value = response[0].Region_Code;
                    }
                    ASales.GetCustomerDetails();


                }
            },
            error: function () {

            },
            complete: function () {

            }
        });
    },
    changefirst: function (arg) {
        debugger;
        if (arg.itemData != null) {
            $("#regionname").val(arg.itemData.id);
            regionCode_g = arg.itemData.id;
            ASales.GetCustomerDetails();

            fnEntityProductOption();
        }
    },
    changefocusOutfirst: function () {
        debugger;
        if ($('#regionname').val() == '') {
            // $("#regioncode").val('');
        }

    },
    fnGetData: function () {
        ASales.GetCustomerDetails();
    },
    GetCustomerDetails: function () {
        debugger;
        var value = 'stockist';
        var RegionCode = $('select[name="regionname"]').val();
        var Date = '';
        var Month = fnGetMonthName($('#AMyear').val().split('-')[0]);
        var Year = $('#AMyear').val().split('-')[1];
        if (value == 'stockist' && $('#AMyear').val() == '') {
            swal('Please select Sales Month & Year', "", "info");
            $('#hospital').prop("checked", true);
            ASales.GetCustomerDetails();
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            return false;
        }
        else if (value == 'stockist' && $('#AMyear').val() != '') {
            Month = fnGetMonthName($('#AMyear').val().split('-')[0]);
            Year = $('#AMyear').val().split('-')[1];
            Date = Year + '-' + Month + '-01';
        }
        var url = '../../HiDoctor_Master/PSAndSS/GetCustomerDetails';
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetCustomerDetails';
        }
        $.ajax(
            {
                async: false,
                type: 'POST',
                url: url,
                data: 'RegionCode=' + regionCode_g + "&subDomainName=" + subDomainName + "&Value=" + value + "&SDate=" + Date + "&month=" + Month + "&year=" + Year,
                success: function (response) {
                    debugger;

              

                        $('#dvtxtcustomerName').empty();
                        $('#dvtxtcustomerName').html('<input type="text" id="customerName">');

                        var lst = [];
                        for (var i = 0; i < response.length; i++) {
                            if (i == 0) {
                                indexDet = 0;
                                //var Customercode = response[0].CustomerCode;
                                //$('#CustomerName').val(response[0].CustomerName)
                            }
                            //doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "}";
                            //if (i < response.length - 1) {
                            //    doc += ",";
                            //}
                            var _obj = {
                                label: response[i].CustomerName,
                                id: response[i].CustomerCode,
                                index: i

                            }
                            lst.push(_obj)
                        }


                        ASales.defaults.CustomerDetails = '';
                        ASales.defaults.CustomerDetails = lst;

                        var atcObj = new ej.dropdowns.DropDownList({
                            //set the data to dataSource property
                            dataSource: lst,
                            fields: { text: 'label', value: 'id' },
                            filterBarPlaceholder: 'Search',
                            showClearButton: true,
                            allowFiltering: true,
                            placeholder: 'Select Stockist',
                            //index: indexDet,
                            filtering: function (e) {
                                var dropdown_query = new ej.data.Query();
                                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                e.updateData(lst, dropdown_query);
                            },


                        });
                        atcObj.appendTo('#customerName');



                        ASales.defaults.CustomerDetails = lst;

                    
                    //if (response != null && response.length > 0) {
                    //    $('#customerName').val(0)
                    //    $('#customerCode').val('')
                    //    var drpdwnCont = [];

                    //    drpdwnCont += '<option maxlength="25" style="text-align:left;" value="0" selected>Please Select Stockist </option>';
                    //    if (response != null && response != '' & response.length > 0) {
                    //        for (i = 0; i < response.length; i++) {
                    //            drpdwnCont += '<option maxlength="25" value="' + response[i].CustomerCode + '" style="text-align:left;">' + response[i].CustomerName + '</option>';

                    //        }
                    //    }
                    //    $('#customerName').html(drpdwnCont);
                    //    $('#customerName').val(0);
                    //    global_var = $('#customer');

                    //    var lst = [];
                    //    for (var i = 0; i < response.length; i++) {
                    //        var obj = {};
                    //        obj.label = response[i].CustomerName;
                    //        obj.value = response[i].CustomerCode;
                    //        lst.push(obj);
                    //    }



                    //    ASales.defaults.CustomerDetails = lst;
                    //}
                    //else {
                    //    var drpdwnCont = [];

                    //    drpdwnCont += '<option maxlength="25" style="text-align:left;" value="0" selected>Please Select Stockiest </option>';
                    //    $("#customerName").empty();
                    //    $('#customerCcustomerNameode').val('')
                    //    $('#customerName').html(drpdwnCont);
                    //    var lst = [];
                    //    ASales.defaults.CustomerDetails = eval(lst);
                    //}
                    //autoComplete(Sales.defaults.CustomerDetails, "customerName", "customerCode", 'customer');
                },
                error: function () {

                }
            });
    },
    //GetStateName: function () {
    //    var url = '../../HiDoctor_Activity/Batch/GetStateName';
    //    if (isResponsive.toUpperCase() == "YES") {
    //        url = '../GetStateName';
    //    }
    //    $.ajax(
    //             {
    //                 type: 'POST',
    //                 url: url,
    //                 data: "&subDomainName=" + subDomainName,
    //                 success: function (response) {
    //                     debugger;
    //                     var State = response;
    //                     if (State != null && State.length > 0) {

    //                         //Sale product autofill
    //                         var doc = "[";
    //                         for (var i = 0; i < State.length; i++) {
    //                             doc += "{label:" + '"' + "" + State[i].State_Name + "" + '",' + "value:" + '"' + "" + State[i].State_ID + '"' + "}";
    //                             if (i < State.length - 1) {
    //                                 doc += ",";
    //                             }
    //                         }

    //                         doc += "];";
    //                         ASales.defaults.StateCity = eval(doc);
    //                         var atcObj = new ej.dropdowns.AutoComplete({
    //                             //set the data to dataSource property
    //                             dataSource: eval(doc),

    //                             fields: { text: 'label' },

    //                             select: ASales.StateChange,
    //                             focusOut: ASales.StatefocusOutfirst,
    //                         });
    //                         //atcObj.destroy();
    //                         atcObj.appendTo('#Statename');
    //                     }

    //                 },
    //                 error: function () {

    //                 }
    //             });
    //},
    //GetCityName: function (salesid) {
    //    var url = '../../HiDoctor_Activity/Batch/GetCityName';
    //    if (isResponsive.toUpperCase() == "YES") {
    //        url = '../GetStateName';
    //    }
    //    $.ajax(
    //             {
    //                 type: 'POST',
    //                 url: url,
    //                 data: "&subDomainName=" + subDomainName + "&StateID=" + salesid,
    //                 success: function (response) {
    //                     debugger;
    //                     var City = response;
    //                     if (City != null && City.length > 0) {
    //                         $('#city').html(' <input type="text" class="text-line" id="Cityname"><input type="hidden" class="form-control" id="Citycode">');
    //                         //Sale product autofill
    //                         var doc = "[";
    //                         for (var i = 0; i < City.length; i++) {
    //                             doc += "{label:" + '"' + "" + City[i].City_Name + "" + '",' + "value:" + '"' + "" + City[i].City_ID + '"' + "}";
    //                             if (i < City.length - 1) {
    //                                 doc += ",";
    //                             }
    //                         }

    //                         doc += "];";
    //                         //  Sales.defaults.RegionDetails = eval(doc);
    //                         var atcObj = new ej.dropdowns.AutoComplete({
    //                             //set the data to dataSource property
    //                             dataSource: eval(doc),

    //                             fields: { text: 'label' },

    //                             select: ASales.CityChange,
    //                             focusOut: ASales.CityfocusOutfirst,
    //                         });
    //                         //atcObj.destroy();
    //                         atcObj.appendTo('#Cityname');
    //                         ASales.GetCustomerDetails();
    //                     }
    //                 },
    //                 error: function () {

    //                 }
    //             });
    //},


    //StateChange: function (arg) {
    //    debugger;
    //    if (arg.itemData != null) {
    //        $("#Statecode").val(arg.itemData.value);
    //        Sales.GetCityName(arg.itemData.value);
    //    }
    //},
    //StatefocusOutfirst: function () {
    //    debugger;
    //    if ($('#Statename').val() == '') {
    //        $("#Statecode").val('');
    //    }

    //},
    //CityChange: function (arg) {
    //    debugger;
    //    if (arg.itemData != null) {
    //        $("#Citycode").val(arg.itemData.value);
    //    }
    //},
    //CityfocusOutfirst: function () {
    //    debugger;
    //    if ($('#Cityname').val() == '') {
    //        $("#Citycode").val('');
    //    }

    //},
    //GetHospitalName: function () {
    //    var url = '../../HiDoctor_Activity/Batch/GetHospitalName';
    //    if (isResponsive.toUpperCase() == "YES") {
    //        url = '../GetHospitalName';
    //    }
    //    var StateID = $("#Statecode").val();
    //    var CityID = $("#Citycode").val();
    //    if (StateID == '') {
    //        swal('Please select the State Name', "", "info");
    //        return false;
    //    }
    //    if (CityID == '') {
    //        swal('Please select the City Name', "", "info");
    //        return false;
    //    }
    //    $.ajax({
    //        type: 'POST',
    //        url: url,
    //        data: "&subDomainName=" + subDomainName + "&StateID=" + StateID + "&CityID=" + CityID,
    //        success: function (response) {
    //            debugger;
    //            if (response != null && response.length > 0) {
    //                var str = "";
    //                str += '<table class="table table-hover" id="hospital"><thead><tr><th scope="col"></th><th scope="col">Hospital Name</th><th scope="col">Local Area</th><th scope="col">Pin Code</th></tr></thead>';
    //                str += '<tbody>';
    //                for (var i = 0; i < response.length; i++) {
    //                    str += '<tr><th scope="row">';
    //                    if (i == 0) {
    //                        str += '<input type="radio" class="hospitalinput" value=' + response[i].Hospital_Id + '_' + encodeURIComponent(response[i].Hospital_Name) + ' name="inputs" checked>';
    //                    }
    //                    else {
    //                        str += '<input type="radio" class="hospitalinput" value=' + response[i].Hospital_Id + '_' + encodeURIComponent(response[i].Hospital_Name) + ' name="inputs">';
    //                    }
    //                    str += '</th><td>' + response[i].Hospital_Name + '</td><td>' + response[i].Local_Area + '</td><td>' + response[i].Pin_Code + '</td></tr>';
    //                }
    //                str += '</tbody></table>';
    //                str += '<input type="button" class="btn btn-primary" id="Hospsave" value="Save" onclick="ASales.fnsavehospital()" />'
    //                $('#tblhospital').html(str);
    //            }
    //            else {
    //                $('#tblhospital').html('No Record Found');
    //            }
    //        },
    //        error: function () {

    //        }
    //    });
    //},
    fnsavehospital: function () {
        debugger;
        var value = $('input[class="hospitalinput"]:checked').val();
        if (isResponsive.toUpperCase() != "YES") {
            $('#AcustomerCode').val(value.split('_')[0]);
            $('#AcustomerName').val(decodeURIComponent(value.split('_')[1]));
        } else {
            $('#AcustomerName').val(decodeURIComponent(value.split('_')[0]));
        }
        $('#SearchModel').hide();
        $('#Cityname').val('');
        $('#Citycode').val('');
        $('#Statename').val('');
        $('#Statecode').val('');
        $('#tblhospital').html('');
    },
    GetAllEntityDetails: function () {
        debugger;
        var EntityCode = "";

        if (isResponsive.toUpperCase() == "YES") {

            EntityCode = $('select[name="customerName"]').val();
        }
        {
            EntityCode = $('select[name="customerName"]').val();
        }
        var Entity = 'stockist';
        if ($('#regionname').val() == '') {
            swal('Please select the Region Name', "", "info");
            return false;
        }
        //if ($('#weeksinMonth').val() == "" || $('#weeksinMonth').val() == null || $('#weeksinMonth').val() == undefined) {
        //    swal('Info', 'Please Select Week ', 'info');
        //    //$.unblockUI();
        //    return false;
        //}

        var lst = $.grep(ASales.defaults.RegionDetails, function (v) {
            return v.label == $('#regionname').val();
        });
        if (lst.length == 0) {
            swal('Please select the valid Region Name', "", "info");
            return false;
        }
        //if ($('#AcustomerName').val() == '') {
        //    swal('Please select Entity Name', "", "info");
        //    return false;
        //}

        //var Clst = $.grep(ASales.defaults.CustomerDetails, function (v) {
        //    return v.label == $('#AcustomerName').val();
        //});
        //if (Clst.length == 0) {
        //    swal('Please select  valid Entity Name', "", "info");
        //    return false;
        //}
        if ($('#AMyear').val() == '') {
            swal('Please select the Sales Month & Year', "", "info");
            return false;
        }
        if (EntityCode == null || EntityCode == 0 || EntityCode == undefined) {
            EntityCode = ""
        }
        var Month = fnGetMonthName($('#AMyear').val().split('-')[0]);
        var Year = $('#AMyear').val().split('-')[1];
        var _objData = new Object();
        _objData.EntityCode = EntityCode == null ? "" : EntityCode;
        _objData.Entity = Entity;
        _objData.Month = Month;
        _objData.Year = Year;
        _objData.Region_Code = $('select[name="regionname"]').val();
        _objData.subDomainName = subDomainName;
        _objData.TypeOfMapping = $('input[name="inputEntity"]:checked').val();
        var url = '../HiDoctor_Master/PSAndSS/GetAllEntityDetails';
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetAllEntityDetails';
        }
        $.ajax(
           {
               type: "Post",
               data: _objData,
               url: url,
               success: function (response) {
                   debugger;
                   var str = '';
                   var content = '';
                   var Sales = response.Sales;
                   var Release = response.Release;
                   $('#Tab').html('');

                   if (Sales.length != 0) {
                       str += '<div class="chselect">';
                       str += '<input type="checkbox" id="selectAllData" onclick="ASales.fnselectalldata();"/> <label style="padding:0px;margin-bottom:10px;">Select All</label>';
                       str += '</div>';
                       str += '<div class="card-column">'
                       for (var i = 0; i < Sales.length; i++) {
                           str += '<div class="panel panel-default cardHeader" style="width: 32rem;" id="prod">';
                           str += ' <div>';
                           str += '<div class="panel-heading ProductName" id="tblRelease">';
                           //if (Sales[i].Status == 1) {
                           str += '<input type="checkbox" id="chkbx_' + i + '" value="' + Sales[i].Sales_Id + '" name="select"/></div>';
                           //}
                           str += '</div>';
                           str += '<div class="panel-body">';
                           str += '<div class="form-group clearfix ">';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Entity</label>';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Sales[i].Entity_Name + '</label>';
                           str += '</div>';
                           str += '<div class="form-group clearfix ">';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Entity Type </label>';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Sales[i].Entity_Type + '</label>';
                           str += '</div>';
                           str += '<div class="form-group clearfix ">';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Type Of Sales </label>';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Sales[i].TypeOfMapping + '</label>';
                           str += '</div>';
                           str += '<div class="form-group clearfix ">';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Month & Year</label>';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Month + '-' + Sales[i].Year + '</label>';
                           str += '</div>';
                           str += '<div class="form-group clearfix ">';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Week</label>';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Sales[i].week + '</label>';
                           str += '</div>';
                           str += '<div class="form-group clearfix ">';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Statement Date</label>';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Sales[i].Statement_Date + '</label>';
                           str += '</div>';
                           str += '<div class="form-group clearfix ">';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Product</label>';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;"><span class="fa fa-info-circle info" onclick=ASales.Productlist(' + Sales[i].Sales_Id + ')></span></label>';
                           str += '</div>';
                           str += '</div>';
                           str += '</div>';


                       }
                       str += '</div>';
                       str += '<input type="button" class="btn btn-primary" id="btnsave" value="AllowEdit" onclick="ASales.fnsaveDetails()"/>';
                       //if (Sales.length != 0) {
                       //    //debugger;
                       //    //str += '<center><table class="table tables" id="tblRelease"><thead style="display: block;"><th class="tbl2"><input type="checkbox" id="selectAllData" onclick="ASales.fnselectalldata();"></th><th class="tbl1">Entity Name</th><th class="tbl2">Entity</th><th class="tbl2">Sales Month & Year</th><th class="tbl2">Statement Date</th><th class="tbl2">Product</th></thead>';
                       //    //str += '<tbody style="height: 500px;display: block;overflow-x: auto;">'
                       //    for (var i = 0; i < Sales.length; i++) {
                       //        debugger;
                       //        str += '<div class="panel panel-default"  id="tblRelease" style="width: 32rem;">';
                       //        str += '<div class="panel-body">';
                       //        str += '<table>';
                       //        str += '<tr>';
                       //        str += '<td>Entity Name</td>';                           
                       //        if (Sales[i].Status == 1) {
                       //            str += '<td><input type="checkbox" id="chkbx_' + i + '" value="' + Sales[i].Sales_Id + '" name="select" ></td>';
                       //        }
                       //        str += '</tr>';
                       //        str += '<tr>';
                       //        str += '<td>Entity</td>';
                       //        str += '<td></td>';
                       //        str += '</tr>';
                       //        str += '<tr>';
                       //        str += '<td>Sales Month & Year</td>';
                       //        str += '<td></td>';
                       //        str += '</tr>';
                       //        str += '<tr>';
                       //        str += '<td>Statement Date</td>';
                       //        var Month = fnGetMonth(Sales[i].Month);
                       //        str += ' <td class="tbl1">' + Sales[i].Entity_Name + '</td><td class="tbl2">' + Sales[i].Entity_Type + '</td><td class="tbl2">' + Month + '-' + Sales[i].Year + '</td><td class="tbl2">' + Sales[i].Statement_Date + '</td>';
                       //        str += '</tr>';

                       //        str += '<tr>';
                       //        str += '<td>Product</td>';
                       //        str += '<td class="tbl2"><span class="fa fa-info-circle info" onclick=ASales.Productlist(' + Sales[i].Sales_Id + ')></span></td>';
                       //        str += '</tr>';         
                       //        str += '</table>';

                       //    }
                       //    str += '</tbody>';
                       //    str += '</table>'
                       //    str += '</div>';
                       //    str += '</div>';
                       //    str += '<div><input type="button" class="btn btn-primary" id="btnsave" value="AllowEdit" onclick="ASales.fnsaveDetails()"  />';
                   }
                   else {
                       str += '<center><label>No Record Found</label></center>';
                   }
                   if (Release.length != 0) {
                       content += '<div class="card-column">'

                       for (var i = 0; i < Release.length; i++) {
                           content += '<div class="panel panel-default"style="width: 32rem;" id="prod">';
                           content += ' <div>';
                           content += '<div class="panel-heading ProductName" id="tblReleased">';
                           content += '<div> <span>' + Release[i].Entity_Name + '</span></div>';
                           content += '</div>';
                           content += '<div class="panel-body">';
                           content += '<div class="form-group clearfix ">';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Entity Type </label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Release[i].Entity_Type + '</label>';
                           content += '</div>';
                           content += '<div class="form-group clearfix ">';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Type Of Sales</label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Release[i].TypeOfMapping + '</label>';
                           content += '</div>';
                           content += '<div class="form-group clearfix ">';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Month & Year</label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Month + '-' + Release[i].Year + '</label>';
                           content += '</div>';
                           content += '<div class="form-group clearfix ">';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Week</label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Release[i].week + '</label>';
                           content += '</div>';
                           content += '<div class="form-group clearfix ">';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Statement Date</label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Release[i].Statement_Date + '</label>';
                           content += '</div>';
                           content += '<div class="form-group clearfix ">';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Release Date</label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Release[i].Released_Date + '</label>';
                           content += '</div>';
                           content += '<div class="form-group clearfix ">';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Release BY</label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Release[i].Released_By + '</label>';
                           content += '</div>';
                           content += '<div class="form-group clearfix ">';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Remarks</label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Release[i].Remark + '</label>';
                           content += '</div>';
                           content += '</div>';
                           content += '</div>';
                           content += '</div>';
                       }
                       content += '</div>';
                       //    content += '<div class="panel panel-default"style="width: 32rem;">';
                       //    content += '<div class="panel-heading" style="display: block;">';
                       //    content += '<div>';
                       //    content += '<div class="panel-body">';
                       //    content += '<table>';
                       //    content += '<thead>';
                       //    content += '<th class="tbl2">Entity Name</th>';
                       //    content += '<th class="tbl2">Entity</th>';
                       //    content += '<th class="tbl2">Sales Month & Year</th>';
                       //    content += '<th class="tbl2">Statement Date</th>';
                       //    content += '<th class="tbl2">Released By</th>';
                       //    content += '<th class="tbl2">Released Date</th>';
                       //    content += '<th class="tbl2">Remark</th></thead>';
                       //    content += '<tr>';
                       //    for (var i = 0; i < Release.length; i++) {
                       //        content += '<tr>';
                       //        var Month = fnGetMonth(Release[i].Month)
                       //        content += '<td class="tbl1">' + Release[i].Entity_Name + '</td><td class="tbl2">' + Release[i].Entity_Type + '</td><td class="tbl2">' + Month + '-' + Release[i].Year + '</td><td class="tbl2">' + Release[i].Statement_Date + '</td>';
                       //        content += '<td class="tbl2">' + Release[i].Released_By + '</td><td class="tbl2">' + Release[i].Released_Date + '</td><td class="tbl2">' + Release[i].Remark + '</td></tr>';
                       //    }

                       //    content += '</thead>';
                       //    content += '<tbody>';
                   }
                   else {
                       content += '<center><label>No Record Found</label></center>';
                   }


                   //content += '<center><table class="table tables"><thead style="display: block;"><th class="tbl1">Entity Name</th><th class="tbl2">Entity</th><th class="tbl2">Sales Month & Year</th><th class="tbl2">Statement Date</th><th class="tbl2">Released By</th><th class="tbl2">Released Date</th><th class="tbl2">Remark</th></thead>';
                   // content += '<tbody style="height: 500px;display: block;overflow-x: auto;">'

                   //content += '</tbody></table></center>'

                   //content += '<center><table class="table tables"><thead style="display: block;"><th class="tbl1">Entity Name</th><th class="tbl2">Entity</th><th class="tbl2">Sales Month & Year</th><th class="tbl2">Statement Date</th><th class="tbl2">Released By</th><th class="tbl2">Released Date</th><th class="tbl2">Remark</th></thead>';
                   // content += '<tbody style="height: 500px;display: block;overflow-x: auto;">'
                   //    for (var i = 0; i < Release.length; i++) {
                   //        content += '<tr>';
                   //        var Month = fnGetMonth(Release[i].Month)
                   //        content += '<td class="tbl1">' + Release[i].Entity_Name + '</td><td class="tbl2">' + Release[i].Entity_Type + '</td><td class="tbl2">' + Month + '-' + Release[i].Year + '</td><td class="tbl2">' + Release[i].Statement_Date + '</td>';
                   //        content += '<td class="tbl2">' + Release[i].Released_By + '</td><td class="tbl2">' + Release[i].Released_Date + '</td><td class="tbl2">' + Release[i].Remark + '</td></tr>';
                   //    }
                   //    content += '</tbody></table></center>'
                   //}
                   //else {
                   //    content += '<center><label>No Record Found</label></center>';
                   //}

                   //   $('#detailedApproval').html(str);

                   // Initialize Tab component
                   var tabObj = new ej.navigations.Tab({
                       items: [
                           {
                               header: { 'text': 'PS And SS Sales' },
                               content: str
                           },
                          {
                              header: { 'text': 'PS And SS Release Log' },
                              content: content
                          }
                       ]
                   });

                   //$(document).on('click', '#selectAllData', function () {

                   //});
                   //Render initialized Tab component
                   tabObj.appendTo('#Tab');
                   //$('#Tab').html(str)
                   ASales.GetAllEntityProduct();
                   $('#Cityname').val('');
                   $('#Citycode').val('');
                   $('#Statename').val('');
                   $('#Statecode').val('');
               },
               error: function () {

               }
           });
    },
    fnFillRelevantTypeofMapping: function () {
        debugger;
        if ($('input[name="inputEntity"]:checked').val() == "PRIMARY") {
            $('#customerName').val('');
            $('#customerCode').val('');
            $('#product').hide();
            $('#hospital').prop("checked", true);
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            //autoComplete([], "customerName", "customerCode", 'customer');
            ASales.GetCustomerDetails();
            return true;
        } else {
            $('input[name="inputEntity"]:checked').val() == "SECONDARY";
            $('#customerName').val('');
            $('#customerCode').val('');
            $('#hospital').prop("checked", true);
            $('#product').hide();
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            ASales.GetCustomerDetails();
        }

    },

    fnselectalldata: function () {
        debugger;
        if ($('#selectAllData').is(":checked")) {
            var group = "input:checkbox[name='select']"
            $(group).prop("checked", false);
            $("input:checkbox").prop("checked", true);
        }
        else {

            $("input:checkbox").prop("checked", false);
        }
    },
    fnsaveDetails: function () {
        debugger;
        if ($('input[name="select"]:checked').length == 0) {
            swal('Please select atleast one Record', "", "info");
            return false;
        }
        else {
            $('#RemarkNotes1').val('');
            $('#MulRemarks').show();
        }
    },




    GetAllEntityProduct: function () {
        debugger;
        var _objData = new Object();
        _objData.Region_Code = $('select[name="regionname"]').val();
        _objData.subDomainName = subDomainName;
        $.ajax(
           {
               type: "Post",
               data: _objData,
               url: "../../HiDoctor_Master/PSAndSS/GetAllEntityProduct",  //"../../HiDoctor_Activity/Batch/GetAllEntityProduct",
               success: function (response) {
                   ASales.defaults.ProductDetail = response;
               },
               error: function () {

               }
           });
    },
    //fnChangestatus: function (Sales_Id) {
    //    ASales.defaults.Sales_ID = Sales_Id;
    //    $('#RemarkNotes').val('');
    //    $('#Remark').show();

    //},
    Productlist: function (Sales_Id) {

        debugger;
        var lst = $.grep(ASales.defaults.ProductDetail, function (v) {
            return v.Sales_Id == Sales_Id;
        });
        var content = '';
        if (lst.length > 0) {
            content += ' <table class="table table-bordered" ><thead><tr><th>Product Name</th><th class="clssales" >Sales Units</th><th class="clsclosing">Closing Units</th><th class="clsTransit">Free Goods</th></tr></thead>';
            content += ' <tbody>';
            for (var i = 0; i < lst.length; i++) {
                content += '<tr>';
                content += '<td>' + lst[i].Product_Name + '</td>';
                if (lst[i].Units == -1) {
                    content += '<td class="clssales">-</td>'
                }
                else {
                    content += '<td class="clssales" style="">' + lst[i].Units + '</td>'
                }
                if (lst[i].Closing == -1) {
                    content += '<td class="clssales" >-</td>'
                }
                else {
                    content += '<td class="clssales" style="">' + lst[i].Closing + '</td>'
                }
                if (lst[i].Transit == -1) {
                    content += '<td class="clssales">-</td>'
                }
                else {
                    content += '<td class="clssales" style="">' + lst[i].Transit + '</td>'
                }

            }

            content += '  </tbody></table>';
        }
        else {
            content += '<span>No Data Found</span>';
        }
        $('#tblProduct').html(content);
        //if (Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT") {
        //$(".clssales").show();
        //$(".clsclosing").show();
        //$(".clsTransit").show();
        //}
        //else if (Closing_Unit_g == "CLOSING_UNITS") {
        //    $(".clsclosing").show();
        //}
        //else if (Sales_Unit_g == "SALES_UNITS") {
        //    $(".clssales").show();
        //}
        //else if (Transit_g == "TRANSIT") {
        //    $(".clsTransit").show();
        //}
        $('#ProductDetails').show();
    },
    fnStatusChange: function () {
        if ($('#RemarkNotes').val() == '') {
            swal('Please enter the Remarks', "", "info");
            return false;
        }
        if ($('#RemarkNotes').val().length > 300) {
            swal('Remarks should not exceed more than 300 characters', "", "info");
            return false;
        }
        var Remark = ASales.fnChkSplChar('RemarkNotes');
        if (Remark == false) {
            swal('Please Enter the following characters only ' + ASales.defaults.SpChar + ' in Remarks ', "", "info");
            return false;
        }
        var _ObjData = new Object();
        _ObjData.User_Code = LoginUserCode;
        _objData.subDomainName = subDomainName;
        _objData.Sales_Id = ASales.defaults.Sales_ID;
        _objData.Remark = $('#RemarkNotes').val();
        var url = '../../HiDoctor_Master/PSAndSS/GetEntityStatusChange';
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetEntityStatusChange';
        }
        $.ajax(
          {
              type: "Post",
              data: _objData,
              url: url,
              success: function (response) {
                  if (response == 1) {
                      $('#RemarkNotes').val('');
                      $('#Remark').hide();
                      swal({
                          title: 'Status Changed Successfully ',
                          imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                      });
                      ASales.GetAllEntityDetails();
                      //$('#AMyear').val('');
                      //$('#hospital').prop("checked", true);
                  }
              },
              error: function () {

              }
          });
    },
    fnChkSplChar: function (id) {
        debugger;
        //Remark
        if ($('#' + id).val() != "") {
            var specialCharregex = new RegExp("^[-a-zA-Z0-9 _().,\n\r\r\n]+$");
            if (!specialCharregex.test($('#' + id).val())) {
                return false;
            }
            else {
                return true;
            }
        }
        return true

    },




    /////////////  Multiple Selection  ////////////

    fnsaveMultiDetails: function () {
        debugger;
        var releaselst = [];
        $('.cardHeader').map(function () {
            if ($(this).find('input[type=checkbox]').is(":checked")) {
                var _objData = {
                    Sales_Id: $(this).find('input[type=checkbox]:checked').val(),
                    Remark: $('#RemarkNotes1').val(),
                    SubDomainName: subDomainName
                };
                releaselst.push(_objData);
            }
        });

        if ($('#RemarkNotes1').val() == '') {
            swal('Please enter the Remarks', "", "info");
            return false;
        }
        if (releaselst.length > 0) {


            //if ($('#RemarkNote').val().length > 300) {
            //    swal('Remarks should not exceed more than 300 characters', "", "info");
            //    return false;
            //}
            var Remark = ASales.fnChkSpecialChar('RemarkNotes1');
            if (Remark == false) {
                swal('Please Enter the following characters only ' + ASales.defaults.SpChar + ' in Remarks ', "", "info");
                return false;
            }
            var _ObjData = new Object();
            _ObjData.User_Code = LoginUserCode;
            _ObjData.lstSaleEntity = releaselst;
            _ObjData.subDomainName = subDomainName;
            var url = '../../HiDoctor_Master/PSAndSS/GetMultipleEntityStatusChange';
            if (isResponsive.toUpperCase() == "YES") {
                url = globalurl + '/HiDoctor_Master/PSAndSS/GetMultipleEntityStatusChange';
            }
            $.ajax(
              {
                  url: url,
                  type: "POST",

                  contentType: 'application/json',
                  dataType: 'json',
                  data: JSON.stringify(_ObjData),
                  success: function (response) {
                      if (response == 1) {
                          $('#RemarkNotes1').val('');
                          $('#MulRemarks').hide();
                          swal({
                              title: 'Status Changed Successfully ',
                              imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                          });
                          var month_year = fnLoadMonthAndYear()
                          $('#AMyear').val(month_year);
                          var statementdate = fnLoadStatementDate()
                          $('#SDate').val(statementdate);
                          ASales.GetAllEntityDetails();
                      }
                  },
                  error: function () {

                  }
              });
        } else {
            swal('Please enter the Remarks', "", "info");
            return false;

        }
    },

    fnChkSpecialChar: function (id) {
        debugger;
        //Remark
        if ($('#' + id).val() != "") {
            var specialCharregex = new RegExp("^[-a-zA-Z0-9 _().,\n\r\r\n]+$");
            if (!specialCharregex.test($('#' + id).val())) {
                return false;
            }
            else {
                return true;
            }
        }
        return true

    },

}

function fnEntityProductOption() {
    debugger;
    var ProductdefaultOptions = "CLOSING_UNITS,SALES_UNITS,TRANSIT";
    var privilege_Name_Stockist = "STOCKIST_SS_PRODUCT_UNITS";
    var StockistProductOptions = fnGetPrivilegeValue(privilege_Name_Stockist, ProductdefaultOptions);
    Stockist_Entity_Product_g = StockistProductOptions + ',';
    var StockistProductOptionsArr = StockistProductOptions.split(',');
    if (StockistProductOptions != undefined) {
        for (var i = 0; i < StockistProductOptionsArr.length; i++) {

            if (StockistProductOptionsArr[i] == "CLOSING_UNITS") {
                Stockist_Chemist_Closing_Unit_g = "CLOSING_UNITS";
                $(".clsclosing").show();
            }
            else if (StockistProductOptionsArr[i] == "SALES_UNITS") {
                Stockist_Sales_Unit_g = "SALES_UNITS";
                $(".clssales").show();
            }
            else if (StockistProductOptionsArr[i] == "TRANSIT") {
                Stockist_Transit_g = "TRANSIT";
                $(".clsTransit").show();
            }
        }
    }

}
function fnSalesTypeOption() {
    debugger;
    var ProductdefaultOptions = "PRIMARY_SALES,SECONDARY_SALES";
    var privilege_Name_Weekly = "WEEKLY_TYPE_OF_SALES";
    var SalesProductOptions = fnGetPrivilegeValue(privilege_Name_Weekly, ProductdefaultOptions);
    Sales_Type_g = SalesProductOptions + ',';

    var arr = Sales_Type_g.split(',');
    var html = '';
    for (var j = 0; j < arr.length; j++) {
        if (arr[j] == 'PRIMARY_SALES') {
            html += ' <div><input type="radio" id="Entity" class="clsenty" name="inputEntity" checked value="PRIMARY" onclick="ASales.fnFillRelevantTypeofMapping()"><label id="entity">Primary Sales</label></div>'
        }
        if (arr[j] == 'SECONDARY_SALES') {
            html += '<div style="margin-left :1rem;"><input type="radio" id="Product" class="clsprod" name="inputEntity" value="SECONDARY" onclick="ASales.fnFillRelevantTypeofMapping()"><label id="Prod">Secondary Sales</label> </div>'
        }
    }
    $('#Privillege').html(html);



    var WeeklysaleTypeOptionsArr = SalesProductOptions.split(',');
    if (SalesProductOptions != undefined) {
        for (var i = 0; i < WeeklysaleTypeOptionsArr.length; i++) {

            if (WeeklysaleTypeOptionsArr[i] == "PRIMARY_SALES") {
                Primary_Sales_g = "PRIMARY_SALES";
                $("#Entity").show();
            }
            else {
                (WeeklysaleTypeOptionsArr[i] == "SECONDARY_SALES")
                Secondary_sales_g = "SECONDARY_SALES";
                $("#Product").show();
            }

        }
    }

}
//function weeksinMonth() {
//    debugger;
//    var a = $('#AMyear').val();
//    var monArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
//    var month = parseInt(monArray.indexOf(a.split('-')[0].toUpperCase())) + 1;

//    var year = $.trim(a.split('-')[1]);

//    year = year || new Date().getFullYear();
//    var d = new Date(year, month, 0);
//    var noOfWeeks = Math.floor((d.getDate() - 1) / 7) + 1;
//    var content = ""
//    for (i = 1; i <= noOfWeeks; i++) {
//        content += '<option value="' + i + '">Week ' + i + '</option>';
//    }
//    $('#weeksinMonth').html(content);
//}

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
function fnLoadStatementDate() {
    debugger;
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var datemonthandyear = day + '-' + month + '-' + year;
    return datemonthandyear;

}
function fnLoadMonthAndYear() {
    debugger;
    var today = new Date();
    today.setDate(today.getDate() - 30);
    var pmm = today.getMonth() + 1;
    var pyy = today.getFullYear();
    var monthName = fnGetMonth(pmm);
    var monthandyear = monthName + '-' + pyy;
    return monthandyear;
}
