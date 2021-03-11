///////////////////Created By:upendra //////////////////
/////////////////// ON:09-04-2020 ////////////////////

var regionCode_g = "";
var regionName_g = "";
var globalurl = "";
var Sales = {
    defaults: {
        RegionDetails: "",
        CustomerDetails: "",
        //Sales_ID: "",
        //StateName: "",
        //CityName: "",
        ProductDetail: "",
        SalesDetails: "",
        OtherSales: "",

        Isgo: 0,
        Global_Product_Lst: "",
        SpChar: "-_.,()",
        lstProducts: "",

    },
    initialize: function () {
        debugger;
        globalurl = window.location.origin;
        GetAllRegion();
      
        Sales.AddProduct();

    },
    fnGo: function () {
        debugger;
        Sales.GetAllSalesDetails();
        Sales.AddProduct();
        fnEntityProductOption();
        //fnSalesTypeOption();
        Sales.defaults.Isgo = 1;
        if ($('input[name="inputEntity"]:checked').val() == "PRIMARY") {
            Sales.PrefillalreadyEntered(1);
        }
    },

    PrefillalreadyEntered: function (val) {
        debugger;
        var selectedProdCode = "";
        if ($('select[name="customerName"]').val() == "" || $('select[name="customerName"]').val() == null || $('select[name="customerName"]').val() == undefined) {
            swal('Info', 'Please Select Stockist Name', 'info');
            //$.unblockUI();
            return false;
        } else {
            selectedProdCode = $('select[name="customerName"]').val()

        }
      
        if ($('#weeksinMonth').val() == "" || $('#weeksinMonth').val() == null || $('#weeksinMonth').val() == undefined) {
            swal('Info', 'Please Select Week ', 'info');
        }
        var Month = "";
        var Year = "";
        if ($('#Myear').val() == "" || $('#Myear').val() == null || $('#Myear').val() == undefined) {
            swal('Info', 'Please Select Month & Year.', 'info');
            //$.unblockUI();
            return false;
        } else {
            Month = fnGetMonthName($('#Myear').val().split('-')[0]);
            Year = $('#Myear').val().split('-')[1];
        }
        var modeofMapping = "PRIMARY";
        if (val == 2) {
            modeofMapping = "SECONDARY";
        }
        var entity = $('input[name="inputs"]:checked').val();
        var url = '../HiDoctor_Master/PSAndSS/GetAlreadyMappedData'
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetAlreadyMappedData';
        }
        $.ajax({
            type: "GET",
            url: url,
            data: "entityType=" + entity + "&month=" + Month + "&year=" + Year + "&selectedMappingCode=" + selectedProdCode + "&mappingType=" + modeofMapping,
            success: function (response) {
                if (response != null && response.length > 0) {
                    if (val == 1) {
                        var tbl_lngth = $('#prod tbody tr').length;
                        // for (var i = 0; i < tbl_lngth; i++) {
                        for (var j = 0; j < response.length; j++) {
                            //if ($('#prod_' + i).children().find('input')[0].id == response[j].Entity_Code) {
                            //var id = $('#prod_' + i).children().find('input')[0].id;
                            $('#' + response[j].Product_Code).prop('checked', true);
                            $('#sales_' + response[j].Product_Code).val(response[j].Units);
                            $('#pts_' + response[j].Product_Code).val(response[j].PriceUnit);
                            $('#units_' + response[j].Product_Code).val(response[j].Closing);
                            $('#Transit_' + response[j].Product_Code).val(response[j].Transit);
                        }
                        //    }
                        //}
                    }
                    else {
                        var tbl_lngth = $('#prod tbody tr').length;
                        //for (var i = 0; i < tbl_lngth; i++) {
                        for (var j = 0; j < response.length; j++) {
                            //if ($('#prod_' + i).children().find('input')[0].id == response[j].Product_Code) {
                            //var id = $('#prod_' + i).children().find('input')[0].id;
                            $('#' + response[j].CustomerCode).prop('checked', true);
                            $('#sales_' + response[j].CustomerCode).val(response[j].Units);
                            $('#pts_' + response[j].Product_Code).val(response[j].PriceUnit);
                            $('#units_' + response[j].CustomerCode).val(response[j].Closing);
                            $('#Transit_' + response[j].CustomerCode).val(response[j].Transit);
                        }
                    }
                    //    }
                    //}

                }

            },
            error: function (error) {
                //$.unblockUI();
            }
        });
        //$.unblockUI();

    },

    fnGetPrivilegeValue: function (privilege_Name, default_value) {
        debugger;
        var value = "";
        var url = '../HiDoctor_Master/PSAndSS/GetEntitySalesMob'
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetEntitySalesMob';
        }
        var _objData = new Object();
        _objData.User_Code = LoginUserCode;
        _objData.subDomainName = subDomainName;
        _objData.privilege_Name = privilege_Name;
        _objData.default_value = default_value;

        $.ajax({

            type: "GET",
            data: _objData,
            url: url,
            async: false,
            success: function (response) {
                debugger;

                value = response;
            },
            error: function () {

            }
        });
        return value;
    },


    changefirst: function (arg) {
        debugger;
        if (arg.itemData != null) {
            //$("#regioncode").val(arg.itemData.value);
            regionCode_g = arg.itemData.id;
            regionName_g = arg.itemData.label;
            Sales.GetCustomerDetails();
            Sales.GetAllSalesDetails();

            if (Sales.defaults.Isgo == 1) {
                Sales.AddProduct();
            }
            fnEntityProductOption();
        }
    },
    changefocusOutfirst: function () {
        debugger;
        if ($('#regionname').val() == '') {
            //$("#regioncode").val('');
        }

    },

    AddProduct: function () {
        debugger;
        var regioncode = $('select[name="regionname"]').val();
        if ($('input[name="inputEntity"]:checked').val() == "PRIMARY") {

            $('#prodheading').html("<div class='col-lg-6'  style='padding:0px;'><div class='sel'><input type='checkbox' class='selectAll' name='Selectproduct'/><label style='padding:0px;margin-bottom:10px;'>Select All</label></div></div><div class='col-lg-3' style='padding:0px;'><input type='text' class='form-control'  id='search' placeholder='Search ..' title='Type in a name' autocomplete='off'></div><div class='col-lg-3' style='padding-top:5px;' ><button type='button' class='btn input-sm btn-primary' onclick='Sales.myFunction();'>search</div>");
            var url = '../../HiDoctor_Master/PSAndSS/GetAllProductSales'
            if (isResponsive.toUpperCase() == "YES") {
                url = globalurl + '/HiDoctor_Master/PSAndSS/GetAllProductSales';
            }

            $.ajax(
                    {
                        async: false,
                        type: 'POST',
                        data: "Region_Code=" + regionCode_g + "&subDomainName=" + subDomainName,
                        async: false,
                        url: url,
                        success: function (response) {

                            debugger;
                            Sales.defaults.Global_Product_Lst = response;
                            $('#product').show();
                            $('.listproduct').show();
                            if (response != null && response.length > 0) {

                                var str = "";
                                for (var i = 0; i < response.length; i++) {

                                    str += '<div class="panel panel-default" id="prod">';
                                    str += '<div>';

                                    str += '<div class="panel-heading ProductName1" id="txtDet_' + response[i].Product_Code + '"><input type="checkbox" id=' + response[i].Product_Code + ' class="ProductName" name="product">' + response[i].Product_Name + '</div>';
                                    //str += ' ' + response[i].Product_Name + '';
                                    str += '</div>';
                                    str += '<div class="panel-body">';
                                    str += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Ref Key </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Ref_Key1 + ' </label></div>';
                                    str += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Unit Price </label> <input type ="number" class="col-sm-6 col-xs-6"id="pts_' + response[i].Product_Code + '" value=' + response[i].PTS + '></div>';
                                    //str += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Unit Price </label> <input type ="number" <class="col-sm-6 col-xs-6 form-control decimalck" id="ptsprice_' + '" + value=' + response[i].PTS + '></div>'
                                    //str += '<div class="clssales" style="display:none;><label class="col-sm-6 col-xs-6" style="padding:0px;">Price Unit </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 "id="pts_' + i + '" value=' + response[i].PTS + '></div></div>';
                                    str += '<div class="clssales" style="display:none;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Sales Units </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="form-control form-control-sm decimalck "step="0.1" id="sales_' + response[i].Product_Code + '" " min="0"></div></div>';
                                    str += '<div class="clsclosing" style="display:none;margin-top: 20%;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Closing Units </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number"  class="form-control form-control-sm decimalck "step="0.1" id="units_' + response[i].Product_Code + '" min="0"></div></div>';
                                    str += '<div class="clsTransit" style="display:none;margin-top: 35%;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Free Goods </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="form-control form-control-sm decimalck "step="0.1" id="Transit_' + response[i].Product_Code + '" min="0"></div></div>';
                                    str += '</div>';
                                    str += '</div>';
                                    //str += '<tr id="prod_' + i + '"><td style="width:50px">';
                                    //str += '<input type="checkbox" id=' + response[i].Product_Code + ' class="product" name="product">';
                                    //str += '</td><td class="tbl1"><lable>' + response[i].Product_Name + '</lable></td><td class="tbl2">' + response[i].Ref_Key1 + '</td><td class="tbl2 clssales" style="display:none"><input type="number" class="form-control decimalck" id="units_' + i + '" min="0"></td><td class="tbl2 clsclosing" style="display:none"><input type="number" class="form-control decimalck" id="closing_' + i + '" min="0"></td></tr>';
                                }


                                //str += '</tbody></table>';
                                //str += '<div><input type="button" class="btn btn-primary" id="Prodsave" value="Save" onclick="Sales.fnsaveProduct()" />';
                                //str += '<input type="button" class="btn btn-primary" id="ProdUpdate" value="Update" onclick="Sales.fnUpdateProduct()" />';
                                //str += '<input type="button" class="btn btn-primary" id="Prodclear" value="Clear" onclick="Sales.fnprodutclear()" style="margin-left: 12px;" /></div>';
                                $('#productAdd').html(str);
                                $('#ProdUpdate').hide();
                                $('.selectAll').click(function () {
                                    Sales.fnselectall();
                                });
                                $('.decimalck').keypress(function (e) {
                                    var character = String.fromCharCode(e.keyCode)
                                    var newValue = this.value + character;
                                    if (isNaN(newValue) || hasDecimalPlace(newValue, 3)) {
                                        e.preventDefault();
                                        return false;
                                    }
                                });
                               


                            }

                            else {
                                $('#productAdd').html('No Product Found');
                            }
                        },
                        error: function () {

                        }
                    });
        }
        else {
            $('input[name="inputEntity"]:checked').val() == 'SECONDARY';
            var RegionCode = $('select[name="regionname"]').val();
            var Date = '';
            var Month = "";
            var Year = "";
            var value = 'stockist';
            Month = fnGetMonthName($('#Myear').val().split('-')[0]);
            Year = $('#Myear').val().split('-')[1];
            if (value == 'stockist' && $('#Myear').val() == '') {
                //swal('Please Select Sales Month & Year', "", "info");
                $('#hospital').prop("checked", true);
                $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
                Sales.GetCustomerDetails();
                return false;
            }
            else if (value == 'stockist' && $('#Myear').val() != '') {
                Month = fnGetMonthName($('#Myear').val().split('-')[0]);
                Year = $('#Myear').val().split('-')[1];
                Date = Year + '-' + Month + '-01';
            }
            var displayName = "";

            $('#prodheading').html("<div class='col-lg-6'  style='padding:0px;'><div class='sel'><input type='checkbox' class='selectAll' name='Selectproduct'/><label style='padding:0px;margin-bottom:10px;'>Select All</label></div></div><div class='col-lg-3' style='padding:0px;'><input type='text' class='form-control'  id='search' placeholder='Search ..' title='Type in a name' autocomplete='off'></div><div class='col-lg-3' style='padding-top:5px;' ><button type='button' class='btn input-sm btn-primary' onclick='Sales.myFunction();'>search</div>");          // $('#prodheading').html("<div class='col-lg-6'  style='padding:0px;'><div class='sel'><input type='checkbox' class='selectAll' name='Selectproduct'/><label style='padding:0px;margin-bottom:10px;'>Select All</label></div></div><div class='col-lg-3' style='padding:0px;'><input type='text' class='form-control'  id='search' placeholder='Search for product names..' title='Type in a name' autocomplete='off'></div><div class='col-lg-3' style='padding-top:5px;' ><button type='button' class='btn input-sm btn-primary' onclick='Sales.myFunction();'>search</div>");
            var url = '../../HiDoctor_Master/PSAndSS/GetAllProductSales'
            if (isResponsive.toUpperCase() == "YES") {
                url = globalurl + '/HiDoctor_Master/PSAndSS/GetAllProductSales';
            }

            $.ajax(
                   {
                       async: false,
                       type: 'POST',
                       data: "Region_Code=" + regionCode_g + "&subDomainName=" + subDomainName,
                       async: false,
                       url: url,
                       success: function (response) {
                           debugger;
                           Sales.defaults.Global_Product_Lst = response;
                           $('#product').show();
                           $('.listproduct').show();
                           if (response != null && response.length > 0) {

                               var str = "";
                               for (var i = 0; i < response.length; i++) {

                                   str += '<div class="panel panel-default" id="prod">';
                                   str += '<div>';

                                   str += '<div class="panel-heading ProductName1" id="txtDet_' + response[i].Product_Code + '"><input type="checkbox" id=' + response[i].Product_Code + ' class="ProductName" name="product">' + response[i].Product_Name + '</div>';
                                   //str += ' ' + response[i].Product_Name + '';
                                   str += '</div>';
                                   str += '<div class="panel-body">';
                                   str += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Ref Key </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Ref_Key1 + '</label></div>';
                                   str += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Unit Price </label> <input type ="number" readonly class="col-sm-6 col-xs-6"id="pts_' + response[i].Product_Code + '" value=' + response[i].PTS + '></div>';
                                   //str += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Unit Price</label> <input type ="number" class="col-sm-6 col-xs-6" value=' + response[i].PTS + 'readonly></div>'
                                   str += '<div class="clssales" style="display:none;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Sales Units </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="form-control form-control-sm decimalck "step="0.1"  id="sales_' + response[i].Product_Code + '"min="0"></div></div>';
                                   str += '<div class="clsclosing" style="display:none;margin-top: 20%;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Closing Units </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number"class="form-control form-control-sm decimalck "step="0.1" id="units_' + response[i].Product_Code + '"min="0"></div></div>';
                                   str += '<div class="clsTransit" style="display:none;margin-top: 35%;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Free Goods </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="form-control form-control-sm decimalck "step="0.1"  id="Transit_' + response[i].Product_Code + '"min="0"></div></div>';
                                   str += '</div>';
                                   str += '</div>';  
                                   //str += '<tr id="prod_' + i + '"><td style="width:50px">';
                                   //str += '<input type="checkbox" id=' + response[i].Product_Code + ' class="product" name="product">';
                                   //str += '</td><td class="tbl1"><lable>' + response[i].Product_Name + '</lable></td><td class="tbl2">' + response[i].Ref_Key1 + '</td><td class="tbl2 clssales" style="display:none"><input type="number" class="form-control decimalck" id="units_' + i + '" min="0"></td><td class="tbl2 clsclosing" style="display:none"><input type="number" class="form-control decimalck" id="closing_' + i + '" min="0"></td></tr>';
                               }


                               //str += '</tbody></table>';
                               //str += '<div><input type="button" class="btn btn-primary" id="Prodsave" value="Save" onclick="Sales.fnsaveProduct()" />';
                               //str += '<input type="button" class="btn btn-primary" id="ProdUpdate" value="Update" onclick="Sales.fnUpdateProduct()" />';
                               //str += '<input type="button" class="btn btn-primary" id="Prodclear" value="Clear" onclick="Sales.fnprodutclear()" style="margin-left: 12px;" /></div>';
                               $('#productAdd').html(str);
                               $('#ProdUpdate').hide();
                               $('.selectAll').click(function () {
                                   Sales.fnselectall();
                               });
                               $('.decimalck').keypress(function (e) {
                                   var character = String.fromCharCode(e.keyCode)
                                   var newValue = this.value + character;
                                   if (isNaN(newValue) || hasDecimalPlace(newValue, 3)) {
                                       e.preventDefault();
                                       return false;
                                   }
                               });


                           }

                           else {
                               $('#productAdd').html('No Product Found');
                           }
                           //Sales.GetCustomerDetails();

                       },
                       error: function () {

                       }

                   });
        }
    },
    fnprodutclear: function () {
        $('.decimalck').val('');
        $("input:checkbox").prop("checked", false);
        $('#search').val('');
        Sales.myFunction();
    },
    fnprodclear: function () {
        debugger;
        $('#ProdUpdate').hide();
        Sales.fnclear();
        $('.listproduct').hide();
        $('#customerName').val('');
        $('#customerCode').val('');
        $('.decimalck').val('');
        $('#btnFinsh').hide();
        $("input:checkbox").prop("checked", false);
        $("input.Cusinput").attr("disabled", false);
        $('#ProdUpdate').hide();
        $('#Prodsave').show();
        $('#update').hide();
        $('#go').show();
        $('select[name="regionname"]').hide()
        $('#product').hide();
        $('#regionname').prop('disabled', false);
        $('#customerName').prop('disabled', false);
        //$('#Myear').hide();
        //$('#weeksinMonth').hide();
        $('#weeksinMonth').prop('disabled', false);
        //$('#Myear').prop('disabled', false);
        //$('#weeksinMonth').val(o);
        $("input[name='inputEntity'][value='PRIMARY']").prop('checked', true);
        $("input[name='inputEntity']").attr("disabled", false);
        $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
        //if ($('#Myear').val() != "") {
        Sales.GetAllSalesDetails();
        //}
    },
    GetCustomerDetails: function () {
        debugger;

        var value = "Stockist";
        var RegionCode = $('select[name="regionname"]').val();
        var Date = '';
        var Month = "";
        var Year = "";
        Month = fnGetMonthName($('#Myear').val().split('-')[0]);
        Year = $('#Myear').val().split('-')[1];
        if (value == 'stockist' && $('#Myear').val() == '') {
            swal('Please Select Sales Month & Year', "", "info");
            $('#hospital').prop("checked", true);
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            Sales.GetCustomerDetails();
            return false;
        }
        else if (value == 'stockist' && $('#Myear').val() != '') {
            Month = fnGetMonthName($('#Myear').val().split('-')[0]);
            Year = $('#Myear').val().split('-')[1];
            Date = Year + '-' + Month + '-01';
        }
        var url = '../../HiDoctor_Master/PSAndSS/GetCustomerDetails'
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

                  //if (response != null && response.length > 0) {

                      $('#dvtxtcustomerName').empty();
                      $('#dvtxtcustomerName').html('<input type="text" id="customerName">');

                      var lst = [];
                      for (var i = 0; i < response.length; i++) {
                          if (i == 0) {
                              indexDet = 0;
                              //var Customercode = response[0].CustomerCode;
                              //$('#CustomerName').val(response[0].CustomerName)
                          }
                         
                          var _obj = {
                              label: response[i].CustomerName,
                              id: response[i].CustomerCode,
                              index: i

                          }
                          lst.push(_obj)
                      }

                     
                     Sales.defaults.CustomerDetails = '';
                      Sales.defaults.CustomerDetails = lst;
                    
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

                  //}
              },
                  error: function () {

                  }
           
              
          });
    },
                  //$('#customerName').text("No Records")
             
                  
              


                  //    //$('#customerName').val(0)
                  //    //$('#customerCode').val('')
                  //    //var drpdwnCont = [];

                  //    //drpdwnCont += '<option maxlength="25" style="text-align:left;" value="0" selected>Please Select Stockist </option>';
                  //    //if (response != null && response != '' & response.length > 0) {
                  //    //    for (i = 0; i < response.length; i++) {
                  //    //        drpdwnCont += '<option maxlength="25" value="' + response[i].CustomerCode + '" style="text-align:left;">' + response[i].CustomerName + '</option>';

                  //    //    }
                  //    //}
                  //    //$('#customerName').html(drpdwnCont);
                  //    //$('#customerName').val(0);
                  //    //global_var = $('#customer');

                  //    //var lst = [];
                  //    //for (var i = 0; i < response.length; i++) {
                  //    //    var obj = {};
                  //    //    obj.label = response[i].CustomerName;
                  //    //    obj.value = response[i].CustomerCode;
                  //    //    lst.push(obj);
                  //    //}


                  //    //var doc = "[";
                  //    //for (var i = 0; i < response.length; i++) {
                  //    //    doc += "{label:" + '"' + "" + response[i].CustomerName + "" + '",' + "value:" + '"' + "" + response[i].CustomerCode + '"' + "}";
                  //    //    if (i < response.length - 1) {
                  //    //        doc += ",";
                  //    //    }
                  //    //}

                  //    //drpdwnCont += "];";


                  //Sales.defaults.CustomerDetails = lst;
              
                  //else {
                  //    var drpdwnCont = [];

                  //    drpdwnCont += '<option maxlength="25" style="text-align:left;" value="0" selected>Please Select Stockist </option>';
                  //    $("#customerName").empty();
                  //    $('#customerCcustomerNameode').val('')
                  //    $('#customerName').html(drpdwnCont);
                  //    var lststockiest = [];
                  //    Sales.defaults.CustomerDetails = eval(lststockiest);
                  //}
                  //autoComplete(Sales.defaults.CustomerDetails, "customerName", "customerCode", 'customer');
       
    //////// Type of Mapping
    fnFillRelevantTypeofMapping: function () {
        debugger;
        if ($('input[name="inputEntity"]:checked').val() == "PRIMARY") {
            $('#customerName').val('');
            $('#customerCode').val('');
            $('#product').hide();
            $('#hospital').prop("checked", true);
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            //autoComplete([], "customerName", "customerCode", 'customer');
            Sales.GetCustomerDetails();
            return true;
        } else {
            $('input[name="inputEntity"]:checked').val() == "SECONDARY";
            $('#customerName').val('');
            $('#customerCode').val('');
            $('#hospital').prop("checked", true);
            $('#product').hide();
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            Sales.GetCustomerDetails();
        }

    },
    fnTypeofMappingProducs: function () {
        debugger;

        var regioncode = $('select[name="regionname"]').val();
        var url = '../../HiDoctor_Master/PSAndSS/GetAllProductSales'
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetAllProductSales';
        }
        $.ajax(
              {
                  async: false,
                  type: 'POST',
                  data: "Region_Code=" + regionCode_g + "&subDomainName=" + subDomainName,
                  async: false,
                  url: url,
                  success: function (response) {
                      if (response.length > 0) {
                          var lstProducts = []
                          drpdwnCont = '<option maxlength="25" style="text-align:left;" value="0">Please Select Product</option>';
                          for (var i = 0; i < response.length; i++) {
                              var _objData = {
                                  label: response[i].Product_Name,
                                  value: response[i].Product_Code
                              }
                              lstProducts.push(_objData);
                              drpdwnCont += '<option maxlength="25" style="text-align:left;" value="' + response[i].Product_Code + '">' + response[i].Product_Name + '</option>';
                          }
                          Sales.defaults.lstProducts = lstProducts;
                          $("#customerName").empty();
                          $('#customerCcustomerNameode').val('')
                          $('#customerName').html(drpdwnCont);
                      }
                      Sales.GetCustomerDetails();


                  },
                  error: function (e) {

                  }
              });
    },

    fnsavehospital: function () {
        var value = $('input[class="hospitalinput"]:checked').val();
        $('#customerName').val(decodeURIComponent(value.split('_')[1]));
        $('#customerCode').val(value.split('_')[0]);
        $('#SearchModel').hide();
        $('#Cityname').val('');
        $('#Citycode').val('');
        $('#Statename').val('');
        $('#Statecode').val('');
        $('#tblhospital').html('');
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
            var group = "input:checkbox[name='product']"
            $(group).prop("checked", false);
            $("input:checkbox").prop("checked", true);
            //$("input:checkbox[name=chk_Access]").attr('checked', 'checked');
        }
        else {
            // $("input:checkbox[name=chk_Access]").removeAttr('checked');
            $("input:checkbox").prop("checked", false);
        }
    },
    fnclear: function () {
        $('#customerName').val(0);
        $('#customerCode').val('');
        $('#SDate').val('');
        $('#Myear').val('');
        $('#hospital').prop("checked", true);
        $("input[name='inputEntity'][value='PRIMARY']").prop('checked', true);
        $("input[name='inputEntity']").attr("disabled", false);
        $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
        $('#Cityname').val('');
        $('#Citycode').val('');
        $('#Statename').val('');
        $('#Statecode').val('');
        $('#tblhospital').html('');
        $('#weeksinMonth').val(0);
        var month_year = fnLoadMonthAndYear();
        $('#Myear').val(month_year);
        var statementdate = fnLoadStatementDate()
        $('#SDate').val(statementdate);
        if ($('#Myear').val() != "") {
            Sales.GetCustomerDetails();
        }
    },
    GetAllSalesDetails: function () {
        debugger;
        var _objData = new Object();
        _objData.Region_Code = regionCode_g;
        _objData.subDomainName = subDomainName;
        _objData.Entity_Type = 'stockiest';
        _objData.Month = fnGetMonthName($('#Myear').val().split('-')[0]);
        _objData.Year = $('#Myear').val().split('-')[1];



        _objData.Type_of_mapping = $('input[name="inputEntity"]:checked').val();
        var url = "../../HiDoctor_Master/PSAndSS/GetAllSalesDetails"
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetAllSalesDetails';
        }
        $.ajax(
           {
               async: false,
               type: "Post",
               data: _objData,
               url: url,
               success: function (response) {
                   debugger;
                   Sales.defaults.SalesDetails = response.lstsales;
                   Sales.defaults.OtherSales = response.lstdetails;
                   if (response.length != 0) {
                       debugger;

                       $('#detailedSales').html('');
                       var grid = new ej.grids.Grid({
                           dataSource: response.lstsales,
                           queryCellInfo: Sales.queryCellInfo,
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

                                   { headerText: 'Edit', width: 150, textAlign: 'center' },
                                   { field: 'week', headerText: 'Week', width: 150, textAlign: 'center' },
                                   { field: 'TypeOfMapping', headerText: 'Type_of_mapping', width: 150, textAlign: 'center' },
                                   { field: 'Entity_Name', headerText: 'Entity Name', width: 200, textAlign: 'center' },
                                   { field: 'Entity_Type', headerText: 'Entity', width: 200, textAlign: 'center' },
                                    { headerText: 'Sales Month & Year', width: 150, textAlign: 'center' },
                                   { field: 'Statement_Date', headerText: 'Statement Date', width: 200, textAlign: 'center' },
                                    { headerText: 'Product', width: 150, textAlign: 'center' },
                           ],
                       });
                       grid.appendTo('#detailedSales');
                       Sales.GetAllEntityProduct();
                   }
                   else {
                       $('#detailedSales').html('<label>No Record Found</label>');
                   }
               },
               error: function () {

               }
           });
    },
    queryCellInfo: function (args) {

        if (args.column.headerText == "Edit") {
            if (args.data.Status == 0) {
                args.cell.innerHTML = "<a style='textDecoration:\'underline\';cursor:\'pointer\'' onclick=Sales.fnEdit(" + args.data.Sales_Id + ")'>Edit</a>"

                $(args.cell).bind("click", function () {
                    Sales.fnEdit(args.data.Sales_Id);
                });
            }
            else {
                args.cell.innerHTML = "Edit"
            }
        }

        else if (args.column.headerText == "Product") {
            args.cell.innerHTML = '<span class="fa fa-info-circle information" onclick=Sales.Productlist(' + args.data.Sales_Id + ')></span>'
            $(args.cell).bind("click", function () {
                debugger;
                Sales.Productlist(args.data.Sales_Id);
            })
        }
        else if (args.column.headerText == "Sales Month & Year") {
            args.cell.innerHTML = fnGetMonth(args.data.Month) + ' - ' + args.data.Year
        }
        //if (args.column.headerText == "Finish") {
        //    if (args.data.Status == 3) {
        //        args.cell.innerHTML = "<a style='textDecoration:\'underline\';cursor:\'pointer\'' onclick=Sales.fnFinsh(" + args.data.Sales_Id + ")'>Finish</a>"
        //        $(args.cell).bind("click", function () {
        //            Sales.fnFinsh(args.data.Sales_Id);
        //        });
        //    }
        //    else {
        //        args.cell.innerHTML = ""
        //    }
        //}
    },
    Productlist: function (Sales_Id) {

        debugger;
        var lst = $.grep(Sales.defaults.ProductDetail, function (v) {
            return v.Sales_Id == Sales_Id;
        });
        var content = '';
        if (lst.length > 0) {
            content += ' <table class="table table-bordered" ><thead><tr><th>Product Name</th><th class="clssales" >Sales Units</th><th class="clsclosing">Closing Units</th><th class="clsTransit">Free Goods</th></tr></thead>';
            content += ' <tbody>';
            //content += '<<div class="card" style="width: 18rem;"><div class="card-body"> <label for="Product Name">Product Name</label><input type="text" class="productname" id="productAdd" /> <div id="panel"><label for="salesunit">Sales Unit</label> <input type="text" class="salesunit" id="slunit" /> <br /> <label for="closing unit">Closing Unit</label><input type="text" class="closingunit" id="clunit" />>'
            for (var i = 0; i < lst.length; i++) {
                content += '<tr>';
                content += '<td>' + lst[i].Product_Name + '</td>';
                if (lst[i].Units == -1 && lst[i].Units == 0) {
                    content += '<td class="clssales">-</td>'
                }
                else {
                    content += '<td class="clssales" style="">' + lst[i].Units + '</td>'
                }
                if (lst[i].Closing == -1 && lst[i].Closing == 0) {
                    content += '<td class="clssales" >-</td>'
                }
                else {
                    content += '<td class="clssales" style="">' + lst[i].Closing + '</td>'
                }
                if (lst[i].Transit == -1 && lst[i].Transit == 0) {
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
        $('#tblProductmodel').html(content);


        $('#ProductDetails').show();
    },
    fnEdit: function (Sales_Id) {
        debugger;
        var lst = $.grep(Sales.defaults.SalesDetails, function (v) {
            return v.Sales_Id == Sales_Id;
        });
        $('#go').hide();
        //$('#regioncode').val(lst[0].Region_Code);
        $('#regionname').val(lst[0].Region_Name).prop('disabled', true);
        $('#regionname').prop('disabled', true);
        Sales.AddProduct();
        var type = lst[0].Entity_Type.toLowerCase();

        var ProductdefaultOptions = "CLOSING_UNITS,SALES_UNITS,TRANSIT";
        var privilege_Name_Stockist = "STOCKIST_SS_PRODUCT_UNITS";
        var StockistProductOptions = Sales.fnGetPrivilegeValue(privilege_Name_Stockist, ProductdefaultOptions);
        Stockist_Entity_Product_g = StockistProductOptions + ',';
        var StockistProductOptionsArr = StockistProductOptions.split(',');
        if (type == "stockist") {
            if (StockistProductOptionsArr.length > 0) {
                for (var i = 0; i < StockistProductOptionsArr.length; i++) {

                    if (StockistProductOptionsArr[i] == "CLOSING_UNITS") {
                        Stockist_Closing_Unit_g = "CLOSING_UNITS";
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
            else {

                $(".clssales").show();
                $(".clsclosing").show();
                $(".clsTransit").show();
            }
        }

        $('#ProdUpdate').show();
        $('#Prodsave').hide();
       // $('#customerName').val(lst[0].Entity_Code);
        $('#regionname').prop('disabled', true);
        var dd = document.querySelector("#customerName").ej2_instances[0];
        dd.value = lst[0].Entity_Code
        dd.enabled = false;
        //$('#customerName').prop('disabled', true);
        //Sales.GetCustomerDetails();
        //$('#customerName').val(lst[0].Entity_Name);
        //$('#customerName').html('<option maxlength="25" style="text-align:left;" value="' + lst[0].Entity_Code + '">' + lst[0].Entity_Name + '</option>');
        //$('#customerName').prop("disabled", true);
        var type = lst[0].Entity_Type.toLowerCase();
        $("input[name='inputs'][value='" + type + "']").prop('checked', true);
        var Month = fnGetMonth(lst[0].Month);
        $('#Myear').val(Month + '-' + lst[0].Year);
        $('#weeksinMonth').val(lst[0].week.split(' ')[1]).attr("disabled", true);
        $('#SDate').val(lst[0].Statement_Date).val();
        $('#Myear').prop('disabled', true);
        // $('#SDate').prop('disabled', true);
        $("input.Cusinput").attr("disabled", true);
        var Mapping = lst[0].TypeOfMapping.toLowerCase();
        $("input[name='inputEntity'][value='" + Mapping.toUpperCase() + "']").prop('checked', true);
        $("input[name='inputEntity']").attr("disabled", true);
        // $("input[name='inputEntity'][value='SECONDARY']").prop('checked', true);
        if ($('input[name="inputs"]:checked').val() == 'hospital') {
            $('#icon').html('<i class="fa fa-search"></i>');
        }
        else {
            $('#icon').html('Text');
        }
        var lstProd = $.grep(Sales.defaults.ProductDetail, function (v) {
            return v.Sales_Id == Sales_Id;
        });
        for (var i = 0; i < lstProd.length; i++) {
            $("input[name='product'][id='" + lstProd[i].Product_Code + "']").prop('checked', true);
            //  var tr = $('#' + lstProd[i].Product_Code).parent().parent().attr('id');
            if (lstProd[i].Units != -1) {

                $('#sales_' + lstProd[i].Product_Code).val(lstProd[i].Units);

            } else {
                $('#sales_' + lstProd[i].Product_Code).val(0);

            }
            if (lstProd[i].Closing != -1) {
                $('#units_' + lstProd[i].Product_Code).val(lstProd[i].Closing);

            } else {
                $('#units_' + lstProd[i].Product_Code).val(0);

            }
            if (lstProd[i].Transit != -1) {
                $('#Transit_' + lstProd[i].Product_Code).val(lstProd[i].Transit);

            } else {
                $('#Transit_' + lstProd[i].Product_Code).val(0);

            }
            if (lstProd[i].Price_Per_Unit != -1) {
                $('#pts_' + lstProd[i].Product_Code).val(lstProd[i].Price_Per_Unit);

            } else {
                $('#pts_' + lstProd[i].Product_Code).val(0);

            }

        }

        if (Entity_Product_g == "CLOSING_UNITS,SALES_UNITS," || Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,") {
            $(".clssales").show();
            $(".clsclosing").show();
        }
        else if (Closing_Unit_g == "CLOSING_UNITS") {
            $(".clsclosing").show();

        }
        else if (Sales_Unit_g == "SALES_UNITS") {
            $(".clssales").show();
        }


        Sales.defaults.Sales_ID = Sales_Id;

    },
    GetAllEntityProduct: function () {
        debugger;
        var _objData = new Object();
        _objData.Region_Code = regionCode_g;
        _objData.subDomainName = subDomainName;
        var url = "../../HiDoctor_Master/PSAndSS/GetAllEntityProduct"
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/PSAndSS/GetAllEntityProduct';
        }
        $.ajax(
           {
               type: "Post",
               data: _objData,
               url: url,  //"../../HiDoctor_Activity/Batch/GetAllEntityProduct",
               success: function (response) {
                   Sales.defaults.ProductDetail = response;
               },
               error: function () {

               }
           });
    },
    fnsaveProduct: function () {
        debugger;
        $('#Prodsave').prop('disabled', true); 
        var unitsvalue = true;
        var RegionCode = $('select[name="regionname"]').val();
        var EntityCode = $('select[name="customerName"]').val();
        var EntityName = $('select[name="customerName"]').text();
        var TypeofMapping = $('input[name="inputEntity"]:checked').val()
        var statementDate = $('#SDate').val();
        var week = $('#weeksinMonth option:selected').text();
        if ($('#regionname').val() == '') {
            swal('Please select the Region Name', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }

        var lst = $.grep(Sales.defaults.RegionDetails, function (v) {
            return v.label == $('#regionname').val();
        });
        if (lst.length == 0) {
            swal('Please select the valid Region Name', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        var Clst = "";
        if ($('input[name="inputEntity"]:checked').val()) {
            Clst = $.grep(Sales.defaults.CustomerDetails, function (v) {
                return v.label == $('#customerName').val();
            });
        } else {
            Clst = $.grep(Sales.defaults.lstProducts, function (v) {
                return v.label == $('#customerName').val();
            });
        }
        if (Clst.length == 0) {
            swal('Please select valid Entity Name', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        if ($('#Myear').val() == '') {
            swal('Please select Sales Month & Year', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        if ($('#SDate').val() == '') {
            swal('Please select statement date', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
        var Year = $('#Myear').val().split('-')[1];

        //
        var myDate = new Date(Month + '/01/' + Year);
        var today = new Date($('#SDate').val().split('-')[1] + '/' + $('#SDate').val().split('-')[0] + '/' + $('#SDate').val().split('-')[2]);
        if (myDate > today) {
            swal('Please Select date greater than Sales Month & Year', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;

        }
        if ($('#weeksinMonth').val() == "" || $('#weeksinMonth').val() == null || $('#weeksinMonth').val() == undefined || $('#weeksinMonth').val() == 0) {
            swal('Info', 'Please Select Week ', 'info');
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        var Mlst = "";
        var Olst = "";
        var Mlst = $.grep(Sales.defaults.SalesDetails, function (v) {
            return v.Month == Month && v.Year == Year && v.Entity_Code == EntityCode && v.TypeOfMapping == TypeofMapping && v.week == week && v.Status == 1;
        });
        if (Mlst.length > 0) {
            swal('The Sales for the month is already entered', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        else {
            var Olst = $.grep(Sales.defaults.OtherSales, function (v) {
                return v.Month == Month && v.Year == Year && v.Entity_Code == EntityCode && v.TypeOfMapping == TypeofMapping && v.week == week && v.Status == 1;
            });

            if (Olst.length > 0) {
                swal('The Sales for the Week is already entered', "", "info");
                $('#Prodsave').prop('disabled', false);
                unitsvalue = false;
                return false;
            }
            else {
                var arrAlreadySubmitted = [];
                var sno = 0;
                $('input[name="product"]:checked').each(function () {
                    sno++;
                    var entityCode = $(this).context.id;//$('#prod_' + sno).children().find('input')[0].id;
                    Mlst = $.grep(Sales.defaults.SalesDetails, function (v) {
                        return v.Month == Month && v.Year == Year && v.Entity_Code == EntityCode && v.TypeOfMapping == TypeofMapping && v.week == week && v.Status == 1;
                    });
                    if (Mlst.length > 0) {
                        arrAlreadySubmitted.push(entityCode);
                    }

                });
            }
        }

        var Entity = $('input[name="inputs"]:checked').val();
        if (arrAlreadySubmitted.length > 0) {
            swal('The Sales for the month for certain ' + Entity + '(s) is already entered', "", "info");
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }

        var arr = [];

        $('#prod input[name="product"]:checked').each(function () {
            debugger;
            var tr = $(this).parent().attr('id');
            tr = tr.split('_')[1];
            var obj = {
                Product_Code: tr,
                Product_Name: $('#txtDet_' + tr).text(),
                Price_Per_Unit: $('#pts_' + tr).val(),
                Units: $('#sales_' + tr).val(),
                Closing: $('#units_' + tr).val(),
                Transit: $('#Transit_' + tr).val(),
            }

            var selectedEntity = 'stockist';
            var arrColumns = [];
            var entityProductLcl = "";

            if (selectedEntity == "stockist") {
                debugger;
                entityProductLcl = Stockist_Entity_Product_g.slice(0, -1);
            }

            if (entityProductLcl.indexOf(',') > 0) {
                arrColumns = entityProductLcl.split(',');
            }
            else {
                arrColumns.push(entityProductLcl);
            }
            for (var i = 0; i < arrColumns.length; i++) {
                if (arrColumns[i].toUpperCase() == "SALES_UNITS") {
                    if (obj.Units != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $('#Prodsave').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Units == '') {
                        unitsvalue = false;
                        swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
                        $('#Prodsave').prop('disabled', false);
                        return false;
                    }
                }
                else if (arrColumns[i].toUpperCase() == "CLOSING_UNITS") {
                    if (obj.Closing != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Closing_Unit_g == "CLOSING_UNITS") {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $('#Prodsave').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Closing == '') {
                        unitsvalue = false;
                        swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
                        $('#Prodsave').prop('disabled', false);
                        return false;
                    }
                }
                else if (arrColumns[i].toUpperCase() == "TRANSIT") {
                    if (obj.Transit != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Transit_g == "Transit") {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $('#Prodsave').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Transit == '') {
                        unitsvalue = false;
                        swal('Please Enter Free Goods For ' + obj.Product_Name, "", "info");
                        $('#Prodsave').prop('disabled', false);
                        return false;
                    }
                }


            }
            if (obj.Units == "") {
                obj.Units = -1;
            }
            if (obj.Closing == "") {
                obj.Closing = -1;
            }
            if (obj.Transit == "") {
                obj.Transit = -1;
            }
            if (unitsvalue == true) {
                arr.push(obj);
            }

        });
        if (unitsvalue == true) {
            if (arr.length == 0) {
                swal('Please select atleast one Product', "", "info");
                $('#Prodsave').prop('disabled', false);
                return false;
            }


            var _objData = new Object();
            _objData.User_Code = LoginUserCode;
            _objData.CompanyId = CompanyId;
            _objData.subDomainName = subDomainName;
            _objData.lstProductSales = arr;
            _objData.Region_Code = regionCode_g;
            _objData.EntityCode = EntityCode;
            _objData.Entity = Entity;
            _objData.Month = Month;
            _objData.Year = Year;
            _objData.week = week;
            _objData.Date = statementDate.split('-')[2] + '-' + statementDate.split('-')[1] + '-' + statementDate.split('-')[0];
            _objData.TypeOfMapping = $('input[name="inputEntity"]:checked').val();
            _objData.EntityName = EntityName;
            var url = '../HiDoctor_Master/PSAndSS/GetInsertProductSales'
            if (isResponsive.toUpperCase() == "YES") {
                url = globalurl + '/HiDoctor_Master/PSAndSS/GetInsertProductSales';
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
                      swal({
                          title: 'Successfully Created',
                          imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                      });
                      $('.decimalck').val('');
                      $("input:checkbox").prop("checked", false);
                      $('#Prodsave').prop('disabled', false);
                      Sales.GetAllSalesDetails();
                      Sales.fnclear();
                      Sales.GetAllEntityProduct();
                  }
                  else if (response == -1) { //Already Exists the record throw the Error.
                      // $("input:checkbox").prop("checked", false);
                      $('#Prodsave').prop('disabled', false);
                      swal('The Sales for the month is already entered', "", "info");
                      Sales.GetAllSalesDetails();
                  }
              },
              error: function (response) {
                  $('#QuantitySave').prop('disabled', false);
                  $('#Prodsave').prop('disabled', false);
              }
          });
        }
        else {
            return false;
        }


    },
    fnUpdateProduct: function () {
        debugger;
        $('#ProdUpdate').prop('disabled', true);
        var unitsvalue = true;
        var RegionCode = $('select[name="regionname"]').val();
        var EntityCode = $('select[name="customerName"]').val();
        var EntityName = $('select[name="customerName"]').text();
        var Entity = 'stockiest';
        var statementDate = $('#SDate').val();
        if ($('#SDate').val() == '') {
            swal('Please select statement date', "", "info");
            $('#ProdUpdate').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        var Month = fnGetMonthName($('#Myear').val().split('-')[0]);
        var Year = $('#Myear').val().split('-')[1];
        var myDate = new Date(Month + '/01/' + Year);
        var today = new Date($('#SDate').val().split('-')[1] + '/' + $('#SDate').val().split('-')[0] + '/' + $('#SDate').val().split('-')[2]);
        if (myDate > today) {
            swal('Please Select date greater than Sales Month & Year', "", "info");
            $('#ProdUpdate').prop('disabled', false);
            unitsvalue = false;
            return false;

        }

        var arr = [];
        var arr = [];
        $('#prod input[name="product"]:checked').each(function () {
            var tr = $(this).parent().attr('id');
            tr = tr.split('_')[1];
            var obj = {
                Product_Code: $(this).attr('id'),
                Product_Name: $("#txtDet_" + tr).text(),
                Price_Per_Unit: $('#pts_' + $(this).attr('id')).val(),
                Units: $('#sales_' + $(this).attr('id')).val(),
                Sales_Id: Sales.defaults.Sales_ID,
                Closing: $('#units_' + $(this).attr('id')).val(),
                Transit: $('#Transit_' + $(this).attr('id')).val(),
            }
            var selectedEntity = 'stockist';
            var arrColumns = [];
            var entityProductLcl = "";

            if (selectedEntity == "stockist") {
                debugger;
                entityProductLcl = Stockist_Entity_Product_g.slice(0, -1);
            }

            if (entityProductLcl.indexOf(',') > 0) {
                arrColumns = entityProductLcl.split(',');
            } else {
                arrColumns.push(entityProductLcl);
            }
            for (var i = 0; i < arrColumns.length; i++) {
                if (arrColumns[i].toUpperCase() == "SALES_UNITS") {
                    if (obj.Units != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $('#ProdUpdate').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Units == '') {
                        unitsvalue = false;
                        swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
                        $('#ProdUpdate').prop('disabled', false);
                        return false;
                    }
                }
                else if (arrColumns[i].toUpperCase() == "CLOSING_UNITS") {
                    if (obj.Closing != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Closing_Unit_g == "CLOSING_UNITS") {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $('#ProdUpdate').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Closing == '') {
                        unitsvalue = false;
                        swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
                        $('#ProdUpdate').prop('disabled', false);
                        return false;
                    }
                }
                else if (arrColumns[i].toUpperCase() == "TRANSIT") {
                    if (obj.Transit != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Transit_g == "Transit") {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $('#ProdUpdate').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Transit == '') {
                        unitsvalue = false;
                        swal('Please Enter Free Goods For ' + obj.Product_Name, "", "info");
                        $('#ProdUpdate').prop('disabled', false);
                        return false;
                    }
                }


            }
            if (obj.Units == "") {
                obj.Units = -1;
            }
            if (obj.Closing == "") {
                obj.Closing = -1;
            }
            if (obj.Transit == "") {
                obj.Transit = -1;
            }

            if (unitsvalue == true) {
                arr.push(obj);
            }
        });
        if (unitsvalue == true) {
            if (arr.length == 0) {
                swal('Please select atleast one Product', "", "info");
                $.unblockUI();
                $('#ProdUpdate').prop('disabled', false);
                return false;
            }
            var _objData = new Object();
            _objData.User_Code = LoginUserCode;
            _objData.CompanyId = CompanyId;
            _objData.subDomainName = subDomainName;
            _objData.Region_Code = regionCode_g;
            _objData.EntityCode = EntityCode;
            _objData.Entity = Entity;

            _objData.Month = Month;
            _objData.Year = Year;
            _objData.Date = statementDate.split('-')[2] + '-' + statementDate.split('-')[1] + '-' + statementDate.split('-')[0];
            _objData.EntityName = EntityName;
            _objData.Sales_Id = Sales.defaults.Sales_ID;
            _objData.TypeOfMapping = $('input[name="inputEntity"]:checked').val();
            _objData.lstProductSales = arr;
            var url = '../HiDoctor_Master/PSAndSS/GetUpdateProductSales'
            if (isResponsive.toUpperCase() == "YES") {
                url = globalurl + '/HiDoctor_Master/PSAndSS/GetUpdateProductSales';
            }
            $.ajax(
          {
              type: "Post",
              data: JSON.stringify({ "_ObjData": _objData }),
              url: url,
              contentType: "application/json utf-8",
              success: function (response) {
                  if (response >= -1) {
                      swal({
                          title: 'Successfully Updated',
                          imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                      });
                      Sales.fnprodclear();
                      $('#ProdUpdate').prop('disabled', false);
                      Sales.GetAllEntityProduct();
                      GetAllRegion();
                      Sales.GetAllSalesDetails

                      //$.unblockUI();
                  }
              },
              error: function (response) {
                  $('#QuantitySave').prop('disabled', false);
                  $('#ProdUpdate').prop('disabled', false);
              },
              complete: function () {
                  //$.unblockUI();
              }
          });
        }
        else {
            return false;
        }


    },


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
function hasDecimalPlace(value, x) {
    var pointIndex = value.indexOf('.');
    return pointIndex >= 0 && pointIndex < value.length - x;
}
function fnUserSelectedOption() {

    var defaultOptions = "STOCKIST";
    //var dcrOptions = fnGetPrivilegeValue("ENTITY_SALES_TYPE", defaultOptions);
    var privilege_Name = "ENTITY_SALES_TYPE";
    var dcrOptions = Sales.fnGetPrivilegeValue(privilege_Name, defaultOptions);

    if (dcrOptions != undefined) {
        Entity_type_g = dcrOptions + ',';
        var dcrOptionsArr = dcrOptions.split(',');
        for (var i = 0; i < dcrOptionsArr.length; i++) {
            if ($('#' + dcrOptionsArr[i]).hasClass('fc-state-active')) {
                return dcrOptionsArr[i].toUpperCase();
            }

            //if (dcrOptionsArr[i] == "HOSPITAL") {
            //    Hospital_g = "HOSPITAL";
            //    $("#hospital").prop("checked", true);
            //    $(".hdnhospital").show();
            //    $("#hdnhospital").show();
            //}
            //else if (dcrOptionsArr[i] == "DOCTOR") {
            //    Doctor_g = "DOCTOR";
            //    $(".clshdndoctor").show();
            //    $("#hdndoctor").show();
            //}
            //else if (dcrOptionsArr[i] == "CHEMIST") {
            //    Chemist_g = "CHEMIST";
            //    $(".clshdnchemist").show();
            //    $("#hdnchemist").show();
            //}
            if (dcrOptionsArr[i] == "STOCKIST") {
                Stockist_g = "STOCKIST";
                $(".clshdnstockist").show();
                $("#hdnstockist").show();
            }
            else {
                Entity_type_g = 'STOCKIST';
            }



        }
    }
}
//GetAllRegion: function ()
function GetAllRegion() {
    debugger;
    var url = '../HiDoctor_Master/PSAndSS/GetAllRegionName'
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/PSAndSS/GetAllRegionName';
    }
    $.ajax(
             {
                 type: 'POST',
                 url: url,
                 data: 'Region_Code=' + LoginRegionCode + "&subDomainName=" + subDomainName,
                 success: function (response) {
                     debugger;
                     var indexDet = 0;
                     $('#dvtxtregionName').html('<input type="text" class="" id="regionname">');
                     if (response != null && response.length > 0) {

                         //Sale product autofill

                         //var doc = "[";
                         var lstRegions = [];
                         for (var i = 0; i < response.length; i++) {
                             if (i == 0) {
                                 indexDet = 0;
                                 var regioncode = response[0].Region_Code;
                                 $('#regionname').val(response[0].Region_Name)
                             }
                             //doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "}";
                             //if (i < response.length - 1) {
                             //    doc += ",";
                             //}
                             var _obj = {
                                 label: response[i].Region_Name,
                                 id: response[i].Region_Code,
                                 index: i

                             }
                             lstRegions.push(_obj)
                         }

                         //doc += "];";
                         Sales.defaults.RegionDetails = '';
                         Sales.defaults.RegionDetails = lstRegions;
                         //$('#dvtxtregionName').empty();
                         //$('#dvtxtregionName').html('<input type="text" class="" id="regionname">');
                         var atcObj = new ej.dropdowns.DropDownList({
                             //set the data to dataSource property
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
                             change: Sales.changefirst

                         });
                         atcObj.appendTo('#regionname');
                         atcObj.id = LoginRegionCode;
                         regionCode_g = LoginRegionCode;
                         //var atcObj = new ej.dropdowns.AutoComplete({
                         //    //set the data to dataSource property
                         //    dataSource: lstRegions,

                         //    fields: { text: 'label', value: 'id' },

                         //    select: Sales.changefirst,
                         //    focusOut: Sales.changefocusOutfirst,
                         //});
                         ////atcObj.destroy();
                         //atcObj.appendTo('#regionname');
                         if (regionCode_g != "" && regionCode_g != null && regionCode_g != undefined) {
                             atcObj.value = regionName_g;
                             //$('#regioncode').val(regionCode_g)


                         } else {
                             atcObj.value = response[0].Region_Name;
                             //$('#regioncode').val(response[0].Region_Code)


                         }

                     }

                     var month_year = fnLoadMonthAndYear();
                     $('#Myear').val(month_year);
                     var weekain_months = weeksinMonth();
                     // $('#weeksinMonth').val(weekain_months)
                     var statementdate = fnLoadStatementDate()
                     $('#SDate').val(statementdate);
                     fnEntityProductOption();
                     fnSalesTypeOption();
                     Sales.GetCustomerDetails();
                     Sales.GetAllSalesDetails();

                 },
                 error: function () {

                 }
             });
}




function fnEntityProductOption() {
    debugger;
    var ProductdefaultOptions = "CLOSING_UNITS,SALES_UNITS,TRANSIT";
    var privilege_Name_Stockist = "STOCKIST_SS_PRODUCT_UNITS";
    var StockistProductOptions = Sales.fnGetPrivilegeValue(privilege_Name_Stockist, ProductdefaultOptions);
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
    var SalesProductOptions = Sales.fnGetPrivilegeValue(privilege_Name_Weekly, ProductdefaultOptions);
    Sales_Type_g = SalesProductOptions + ',';

    var arr = Sales_Type_g.split(',');
    var html = '';
    for (var j = 0; j < arr.length; j++) {
        if (arr[j] == 'PRIMARY_SALES') {
            html += ' <div><input type="radio" id="Entity" class="clsenty" name="inputEntity" checked value="PRIMARY" onclick="Sales.fnFillRelevantTypeofMapping()"><label id="entity">Primary Sales</label></div>'
        }
        if (arr[j] == 'SECONDARY_SALES') {
            html += '<div style="margin-left :1rem;"><input type="radio" id="Product" class="clsprod" name="inputEntity" value="SECONDARY" onclick="Sales.fnFillRelevantTypeofMapping()"><label id="Prod">Secondary Sales</label> </div>'
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
function weeksinMonth() {
    debugger;
    var a = $('#Myear').val();
    var monArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var month = parseInt(monArray.indexOf(a.split('-')[0].toUpperCase())) + 1;

    var year = $.trim(a.split('-')[1]);

    year = year || new Date().getFullYear();
    var d = new Date(year, month, 0);
    var noOfWeeks = Math.floor((d.getDate() - 1) / 7) + 1;
    var content = ""
    content += '<option value="0" selected="selected">Select Week</option>'
    for (i = 1; i <= noOfWeeks; i++) {

        content += '<option value="' + i + '">Week ' + i + '</option>';
    }
    $('#weeksinMonth').html(content);
    $("#weeksinMonth").val(0);
}



