///////////////////Created By:S.Manju //////////////////
/////////////////// ON:09-10-2018 ////////////////////
var doctorMasterFrom_g = "";
var regionCode_g = "";
var regionName_g = "";
var Sales = {
    defaults: {
        RegionDetails: "",
        CustomerDetails: "",
        Sales_ID: "",
        StateName: "",
        CityName: "",
        ProductDetail: "",
        SalesDetails: "",

        Isgo: 0,
        Global_Product_Lst: "",
        SpChar: "-_.,()",
        lstProducts: "",

    },
    initialize: function () {
        fnUserSelectedOption();
        fnEntityProductOption();
        var month_year = fnLoadMonthAndYear();
        $('#Myear').val(month_year);
        var statementdate = fnLoadStatementDate()
        $('#SDate').val(statementdate);
        GetConfig();

        $('#update').click(function () {
            Sales.fnUpdateSalesMonth();
        });
        $('.Cusinput').change(function () {
            if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
                if ($('input[name="inputs"]:checked').val() == 'hospital') {
                    $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
                }
                else {
                    $('#icon').html('Text');
                }
                Sales.GetCustomerDetails();
            } else {
                $('#icon').html('Text');
            }
        });
        $('#searchgo').click(function () {
            Sales.GetHospitalName();
        });

        Sales.GetAllRegion();
        Sales.GetStateName();

    },
    fnGo: function () {
        //   Sales.fnSaveSalesMonth();
        debugger;
        Sales.AddProduct();
        fnEntityProductOption();
        Sales.defaults.Isgo = 1;
        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
            Sales.PrefillalreadyEntered(1);
        }
    },
    PrefillalreadyEntered: function (val) {
        debugger;
        var selectedProdCode = "";
        if ($('#customerName').val() == "" || $('#customerName').val() == null || $('#customerName').val() == undefined) {
            swal('Info', 'Please Select Entity Name', 'info');
            //$.unblockUI();
            return false;
        } else {
            selectedProdCode = $('#customerName').val();

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
        var modeofMapping = "Entity";
        if (val == 2) {
            modeofMapping = "Product";
        }
        var entity = $('input[name="inputs"]:checked').val();
        $.ajax({
            type: "GET",
            url: '../GetAlreadyMappedData',
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


    GetAllRegion: function () {
        $.ajax(
                 {
                     type: 'POST',
                     url: '../GetAllRegionName',
                     data: 'Region_Code=' + LoginRegionCode + "&subDomainName=" + subDomainName,
                     success: function (response) {
                         debugger;

                         if (response != null && response.length > 0) {

                             //Sale product autofill

                             var doc = "[";
                             for (var i = 0; i < response.length; i++) {
                                 if (i == 0) {
                                     var regioncode = response[0].Region_Code;
                                     $('#regionname').val(response[0].Region_Name)
                                 }
                                 doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "}";
                                 if (i < response.length - 1) {
                                     doc += ",";
                                 }
                             }

                             doc += "];";
                             Sales.defaults.RegionDetails = '';
                             Sales.defaults.RegionDetails = eval(doc);
                             $('#dvtxtregionName').empty();
                             $('#dvtxtregionName').html('<input type="text" class="text-line" id="regionname">');
                             var atcObj = new ej.dropdowns.AutoComplete({
                                 //set the data to dataSource property
                                 dataSource: eval(doc),

                                 fields: { text: 'label' },

                                 select: Sales.changefirst,
                                 focusOut: Sales.changefocusOutfirst,
                             });
                             //atcObj.destroy();
                             atcObj.appendTo('#regionname');
                             if (regionCode_g != "" && regionCode_g != null && regionCode_g != undefined) {
                                 atcObj.value = regionName_g;
                                 $('#regioncode').val(regionCode_g)


                             } else {
                                 atcObj.value = response[0].Region_Name;
                                 $('#regioncode').val(response[0].Region_Code)


                             }
                             Sales.GetAllSalesDetails();
                             Sales.GetCustomerDetails();
                         }
                     },
                     error: function () {

                     }
                 });
    },
    changefirst: function (arg) {
        debugger;
        if (arg.itemData != null) {
            $("#regioncode").val(arg.itemData.value);
            regionCode_g = arg.itemData.value;
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
            $("#regioncode").val('');
        }

    },
    fnFinsh: function (salesId) {
        if ($('#regionname').val() == '' || $('#regionname').val() == undefined || $('#regionname').val() == null) {
            $("#regioncode").val('');


            return false;
        } else {
            var regionCode = $("#regioncode").val();

            var subdomain = '';
            $.ajax({
                type: "GET",
                url: "../UpdateStatusofDraft",
                data: "regionCode=" + regionCode + "&salesId=" + salesId + "&subDomainName=" + subDomainName,
                success: function (response) {
                    if (response == "True") {
                        swal('Success', 'Successfully Finished', 'success');
                        Sales.initialize();
                    }
                },
                error: function (error) {

                },
            })
        }
    },
    AddProduct: function () {
        debugger;
        var regioncode = $("#regioncode").val();
        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {

            $('#prodheading').html("<div class='col-lg-6'  style='padding:0px;'><div class='sel'><input type='checkbox' class='selectAll' name='Selectproduct'/><label style='padding:0px;margin-bottom:10px;'>Select All</label></div></div><div class='col-lg-3' style='padding:0px;'><input type='text' class='form-control'  id='search' placeholder='Search ..' title='Type in a name' autocomplete='off'></div><div class='col-lg-3' style='padding-top:5px;' ><button type='button' class='btn input-sm btn-primary' onclick='Sales.myFunction();'>search</div>");

            $.ajax(
                    {
                        async: false,
                        type: 'POST',
                        data: "Region_Code=" + regioncode + "&subDomainName=" + subDomainName,
                        async: false,
                        url: '../GetAllProductSales',
                        success: function (response) {
                            debugger;
                            Sales.defaults.Global_Product_Lst = response;
                            $('#product').show();
                            $('.listproduct').show();
                            if (response != null && response.length > 0) {

                                var str = "";
                                //str += '<div class="sel">';
                                //str += '<input type="checkbox" class="selectAll" name="Selectproduct"/> <label style="padding:0px;margin-bottom:10px;">Select All</label>';
                                //str += '</div>';
                                //str += '<div scope="col" style="width:50px"><input type="checkbox" class="selectAll" name="Selectproduct"><label >Select All</label>';
                                //str += '</div>';
                                //str += '<table class="table tables" id="prod"><thead style="display: block;"><tr><th scope="col" style="width:50px" ><input type="checkbox" class="selectAll" name="Selectproduct"></th><th scope="col" class="tbl1">Product Name</th><th scope="col" class="tbl2">Ref Key</th><th scope="col" class="tbl2 clssales" id="Sales_Unit" style="display:none">Sales Units</th><th scope="col" class="tbl2 clsclosing" id="Closing_Unit" style="display:none">Closing Units</th></tr></thead>';
                                //str += '<tbody style="height: 278px;display: block;overflow-x: auto;">';
                                for (var i = 0; i < response.length; i++) {

                                    str += '<div class="panel panel-default" id="prod">';
                                    str += '<div>';

                                    str += '<div class="panel-heading ProductName1" id="txtDet_' + response[i].Product_Code + '"><input type="checkbox" id=' + response[i].Product_Code + ' class="ProductName" name="product">' + response[i].Product_Name + '</div>';
                                    //str += ' ' + response[i].Product_Name + '';
                                    str += '</div>';
                                    str += '<div class="panel-body">';
                                    str += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Ref Key </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Ref_Key1 + ' </label></div>';
                                    str += '<div class="clssales" style="display:none;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Sales Units </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 form-control decimalck " id="sales_' + response[i].Product_Code + '" " min="0"></div></div>';
                                    str += '<div class="clsclosing" style="display:none;margin-top: 20%;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Closing Units </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 form-control decimalck" id="units_' + response[i].Product_Code + '" min="0"></div></div>';
                                    str += '<div class="clsTransit" style="display:none;margin-top: 35%;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Transit </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 form-control decimalck" id="Transit_' + response[i].Product_Code + '" min="0"></div></div>';
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
            var value = $('input[name="inputs"]:checked').val();
            var RegionCode = $('#regioncode').val();
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
            var displayName = "";
            if ($('input[name="inputs"]:checked').val() == "doctor") {
                displayName = 'Doctor';
            } else if ($('input[name="inputs"]:checked').val() == "chemist") {
                displayName = 'Chemist';
            }
            else if ($('input[name="inputs"]:checked').val() == "stockist") {
                displayName = 'Stockist';
            }
            else {
                displayName = 'Hospital';
            }
            $('#prodheading').html("<div class='col-lg-6'><label>List Of " + displayName + "(s)</label></div><div class='col-lg-6'><input type='text' class='form-control'  id='search' onkeyup='Sales.myFunction();' placeholder='Search ..' title='Type in a name' autocomplete='off'></div>");
            // $('#prodheading').html("<div class='col-lg-6'  style='padding:0px;'><div class='sel'><input type='checkbox' class='selectAll' name='Selectproduct'/><label style='padding:0px;margin-bottom:10px;'>Select All</label></div></div><div class='col-lg-3' style='padding:0px;'><input type='text' class='form-control'  id='search' placeholder='Search for product names..' title='Type in a name' autocomplete='off'></div><div class='col-lg-3' style='padding-top:5px;' ><button type='button' class='btn input-sm btn-primary' onclick='Sales.myFunction();'>search</div>");

            $.ajax(
              {
                  async: false,
                  type: 'POST',
                  url: '../GetCustomerDetails',
                  data: 'RegionCode=' + RegionCode + "&subDomainName=" + subDomainName + "&Value=" + value + "&SDate=" + Date + "&doctoMasterFrom=" + doctorMasterFrom_g + "&month=" + Month + "&year=" + Year,
                  success: function (response) {
                      debugger;
                      //$.blockUI();
                      if (response != null && response.length > 0) {


                          var str = "";
                          str += '<div class="sel">';
                          str += '<input type="checkbox" class="selectAll" name="Selectproduct"/> <label style="padding:0px;margin-bottom:10px;">Select All</label>';
                          str += '</div>';


                          //str += '<table class="table tables" id="prod"><thead style="display: block;"><tr><th scope="col" style="width:50px" ><input type="checkbox" class="selectAll" name="Selectproduct"></th><th scope="col" class="tbl1">Product Name</th><th scope="col" class="tbl2">Ref Key</th><th scope="col" class="tbl2 clssales" id="Sales_Unit" style="display:none">Sales Units</th><th scope="col" class="tbl2 clsclosing" id="Closing_Unit" style="display:none">Closing Units</th></tr></thead>';
                          //str += '<tbody style="height: 278px;display: block;overflow-x: auto;">';
                          for (var i = 0; i < response.length; i++) {

                              str += '<div class="panel panel-default" id="prod">';
                              str += '<div>';

                              str += '<div class="panel-heading ProductName1" id="txtDet_' + response[i].CustomerCode + '"><input type="checkbox" id=' + response[i].CustomerCode + ' class="ProductName" name="product">' + response[i].CustomerName + '</div>';
                              //str += ' ' + response[i].Product_Name + '';
                              str += '</div>';
                              str += '<div class="panel-body">';
                              str += '<div class="form-group clearfix "><label class="col-sm-6 col-xs-6" style="padding:0px;">Ref Key </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + response[i].Ref_Key1 + ' </label></div>';
                              str += '<div class="clssales" style="display:none;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Sales Units </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 form-control decimalck " id="sales_' + response[i].CustomerCode + '" " min="0"></div></div>';
                              str += '<div class="clsclosing" style="display:none;margin-top: 20%;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Closing Units </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 form-control decimalck" id="units_' + response[i].CustomerCode + '" min="0"></div></div>';
                              str += '<div class="clsTransit" style="display:none;margin-top: 35%;"><label class="col-sm-6 col-xs-6" style="padding:0px;">Transit </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 form-control decimalck" id="Transit_' + response[i].CustomerCode + '" min="0"></div></div>';
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



                          Sales.PrefillalreadyEntered(2);
                      }
                      else {
                          //$.unblockUI();
                          $('#productAdd').html('No Product Found');

                      }

                  },
                  error: function () {

                  }
              });
        }
        $('#product').show();


    },
    fnprodutclear: function () {
        $('.decimalck').val('');
        $("input:checkbox").prop("checked", false);
        $('#search').val('');
        Sales.myFunction();
    },
    fnprodclear: function () {
        $('#ProdUpdate').hide();
        Sales.fnclear();
        $('.listproduct').hide();
        $('#customerName').val(0);
        $('#customerCode').val('');
        $('.decimalck').val('');
        $('#btnFinsh').hide();
        $("input:checkbox").prop("checked", false);
        $("input.Cusinput").attr("disabled", false);
        $('#ProdUpdate').hide();
        $('#Prodsave').show();
        $('#update').hide();
        $('#go').show();
        $('#product').hide();
        $('#regionname').prop('disabled', false);
        $('#customerName').prop('disabled', false);
        $('#Myear').prop('disabled', false);
        $("input[name='inputEntity'][value='ENTITY']").prop('checked', true);
        $("input[name='inputEntity']").attr("disabled", false);
        $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
        //if ($('#Myear').val() != "") {
        Sales.GetAllSalesDetails();
        //}
    },
    GetCustomerDetails: function () {
        debugger;
        var value = $('input[name="inputs"]:checked').val();
        var RegionCode = $('#regioncode').val();
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
        $.ajax(
          {
              async: false,
              type: 'POST',
              url: '../GetCustomerDetails',
              data: 'RegionCode=' + RegionCode + "&subDomainName=" + subDomainName + "&Value=" + value + "&SDate=" + Date + "&doctoMasterFrom=" + doctorMasterFrom_g + "&month=" + Month + "&year=" + Year,
              success: function (response) {
                  debugger;
                  if (response != null && response.length > 0) {
                      $('#customerName').val(0)
                      $('#customerCode').val('')
                      var drpdwnCont = [];

                      drpdwnCont += '<option maxlength="25" style="text-align:left;" value="0" selected>Please Select Entity </option>';
                      if (response != null && response != '' & response.length > 0) {
                          for (i = 0; i < response.length; i++) {
                              drpdwnCont += '<option maxlength="25" value="' + response[i].CustomerCode + '" style="text-align:left;">' + response[i].CustomerName + '</option>';

                          }
                      }
                      $('#customerName').html(drpdwnCont);
                      $('#customerName').val(0);
                      global_var = $('#customer');

                      var lst = [];
                      for (var i = 0; i < response.length; i++) {
                          var obj = {};
                          obj.label = response[i].CustomerName;
                          obj.value = response[i].CustomerCode;
                          lst.push(obj);
                      }


                      //var doc = "[";
                      //for (var i = 0; i < response.length; i++) {
                      //    doc += "{label:" + '"' + "" + response[i].CustomerName + "" + '",' + "value:" + '"' + "" + response[i].CustomerCode + '"' + "}";
                      //    if (i < response.length - 1) {
                      //        doc += ",";
                      //    }
                      //}

                      //drpdwnCont += "];";


                      Sales.defaults.CustomerDetails = lst;
                  }
                  else {
                      var drpdwnCont = [];

                      drpdwnCont += '<option maxlength="25" style="text-align:left;" value="0" selected>Please Select Entity </option>';
                      $("#customerName").empty();
                      $('#customerCcustomerNameode').val('')
                      $('#customerName').html(drpdwnCont);
                      var lst = [];
                      Sales.defaults.CustomerDetails = eval(lst);
                  }
                  //autoComplete(Sales.defaults.CustomerDetails, "customerName", "customerCode", 'customer');
              },
              error: function () {

              }
          });
    },
    ////// Type of Mapping
    fnFillRelevantTypeofMapping: function () {
        debugger;
        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
            $('#customerName').val('');
            $('#customerCode').val('');
            $('#product').hide();
            $('#hospital').prop("checked", true);
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            //autoComplete([], "customerName", "customerCode", 'customer');
            Sales.GetCustomerDetails();
            return true;
        } else {
            $('#customerName').val('');
            $('#customerCode').val('');
            $('#hospital').prop("checked", true);
            $('#product').hide();
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            Sales.fnTypeofMappingProducs()
        }

    },
    fnTypeofMappingProducs: function () {
        debugger;

        var regioncode = $("#regioncode").val();
        $.ajax(
              {
                  async: false,
                  type: 'POST',
                  data: "Region_Code=" + regioncode + "&subDomainName=" + subDomainName,
                  async: false,
                  url: '../GetAllProductSales',
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


                  },
                  error: function (e) {

                  }
              });
    },
    GetStateName: function () {
        $.ajax(
                 {
                     type: 'POST',
                     url: '../GetStateName',
                     data: "&subDomainName=" + subDomainName,
                     success: function (response) {
                         debugger;
                         var State = response;
                         if (State != null && State.length > 0) {

                             //Sale product autofill
                             var doc = "[";
                             for (var i = 0; i < State.length; i++) {
                                 doc += "{label:" + '"' + "" + State[i].State_Name + "" + '",' + "value:" + '"' + "" + State[i].State_ID + '"' + "}";
                                 if (i < State.length - 1) {
                                     doc += ",";
                                 }
                             }

                             doc += "];";
                             Sales.defaults.StateCity = eval(doc);
                             var atcObj = new ej.dropdowns.AutoComplete({
                                 //set the data to dataSource property
                                 dataSource: eval(doc),

                                 fields: { text: 'label' },

                                 select: Sales.StateChange,
                                 focusOut: Sales.StatefocusOutfirst,
                             });
                             //atcObj.destroy();
                             atcObj.appendTo('#Statename');
                         }

                     },
                     error: function () {

                     }
                 });
    },
    GetCityName: function (salesid) {
        $.ajax(
                 {
                     type: 'POST',
                     url: '../../HiDoctor_Activity/Batch/GetCityName',
                     data: "&subDomainName=" + subDomainName + "&StateID=" + salesid,
                     success: function (response) {
                         debugger;
                         var City = response;
                         if (City != null && City.length > 0) {
                             $('#city').html(' <input type="text" class="text-line" id="Cityname"><input type="hidden" class="form-control" id="Citycode">');
                             //Sale product autofill
                             var doc = "[";
                             for (var i = 0; i < City.length; i++) {
                                 doc += "{label:" + '"' + "" + City[i].City_Name + "" + '",' + "value:" + '"' + "" + City[i].City_ID + '"' + "}";
                                 if (i < City.length - 1) {
                                     doc += ",";
                                 }
                             }

                             doc += "];";
                             //  Sales.defaults.RegionDetails = eval(doc);
                             var atcObj = new ej.dropdowns.AutoComplete({
                                 //set the data to dataSource property
                                 dataSource: eval(doc),

                                 fields: { text: 'label' },

                                 select: Sales.CityChange,
                                 focusOut: Sales.CityfocusOutfirst,
                             });
                             // atcObj.destroy();
                             atcObj.appendTo('#Cityname');
                             Sales.GetCustomerDetails();
                         }
                     },
                     error: function () {

                     }
                 });
    },
    StateChange: function (arg) {
        debugger;
        if (arg.itemData != null) {
            $("#Statecode").val(arg.itemData.value);
            Sales.GetCityName(arg.itemData.value);
        }
    },
    StatefocusOutfirst: function () {
        debugger;
        if ($('#Statename').val() == '') {
            $("#Statecode").val('');
        }

    },
    CityChange: function (arg) {
        debugger;
        if (arg.itemData != null) {
            $("#Citycode").val(arg.itemData.value);
        }
    },
    CityfocusOutfirst: function () {
        debugger;
        if ($('#Cityname').val() == '') {
            $("#Citycode").val('');
        }

    },
    GetHospitalName: function () {
        var StateID = $("#Statecode").val();
        var CityID = $("#Citycode").val();
        if (StateID == '') {
            swal('Please select the State Name', "", "info");
            return false;
        }
        if (CityID == '') {
            swal('Please select the City Name', "", "info");
            return false;
        }
        $.ajax(
               {
                   type: 'POST',
                   url: '../../HiDoctor_Activity/Batch/GetHospitalName',
                   data: "&subDomainName=" + subDomainName + "&StateID=" + StateID + "&CityID=" + CityID,
                   success: function (response) {
                       debugger;
                       if (response != null && response.length > 0) {
                           var str = "";
                           str += '<table class="table table-hover"><thead><tr><th scope="col"></th><th scope="col">Hospital Name</th><th scope="col">Local Area</th><th scope="col">Pin Code</th></tr></thead>';
                           str += '<tbody>';
                           for (var i = 0; i < response.length; i++) {
                               str += '<tr><th scope="row">';
                               if (i == 0) {
                                   str += '<input type="radio" class="hospitalinput" value=' + response[i].Hospital_Id + '_' + encodeURIComponent(response[i].Hospital_Name) + ' name="inputs" checked>';
                               }
                               else {
                                   str += '<input type="radio" class="hospitalinput" value=' + response[i].Hospital_Id + '_' + encodeURIComponent(response[i].Hospital_Name) + ' name="inputs">';
                               }
                               str += '</th><td>' + response[i].Hospital_Name + '</td><td>' + response[i].Local_Area + '</td><td>' + response[i].Pin_Code + '</td></tr>';
                           }
                           str += '</tbody></table>';
                           str += '<input type="button" class="btn btn-primary" id="Hospsave" value="Save" onclick="Sales.fnsavehospital()" />'
                           $('#tblhospital').html(str);
                       }
                       else {
                           $('#tblhospital').html('No Record Found');
                       }
                   },
                   error: function () {

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
        //searchKey = document.getElementById("search").value;Fproductf
        //var searchedList = $.grep(Sales.defaults.Global_Product_Lst, function (v) {
        //    return v.Product_Name.indexOf(searchKey) > 0;
        //});
        ////// Bind Searched List.
        //if (searchedList != null && searchedList.length > 0) {
        //    var str = "";
        //    for (var i = 0; i < searchedList.length; i++) {
        //        str += '<div class="panel panel-default" style="margin-bottom: 10px;">';                
        //        str += '<div class="panel-heading" id=' + searchedList[i].Product_Code + '>' + searchedList[i].Product_Name + '</div>';
        //        str += '<div class="panel-body">';
        //        str += '<div class="form-group clearfix"><label class="col-sm-6 col-xs-6" style="padding:0px;">Ref Key </label> <label class="col-sm-6 col-xs-6" style="padding:0px;">' + searchedList[i].Ref_Key1 + ' </label></div>';
        //        str += '<div class="form-group clearfix"><label class="col-sm-6 col-xs-6" style="padding:0px;">Sales Unit </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 form-control decimalck " id="units_' + i + '" min="0"></div></div>';
        //        str += '<div class="form-group clearfix"><label class="col-sm-6 col-xs-6" style="padding:0px;">Closing Unit </label>  <div class="col-sm-6 col-xs-6" style="padding:0px;"><input type="number" class="col-sm-6 col-xs-6 form-control decimalck" id="units_' + i + '" min="0"></div></div>';
        //        str += '</div>';
        //        str += '</div>';
        //    }         
        //    $('#productAdd').html(str);
        //    $('#ProdUpdate').hide();
        //    $('.selectAll').click(function () {
        //        Sales.fnselectall();
        //    });
        //    $('.decimalck').keypress(function (e) {
        //        var character = String.fromCharCode(e.keyCode)
        //        var newValue = this.value + character;
        //        if (isNaN(newValue) || hasDecimalPlace(newValue, 3)) {
        //            e.preventDefault();
        //            return false;
        //        }
        //    });
        //}
        //else {
        //    $('#productAdd').html('No Product Found');
        //}

        //var input, filter, table, tr, td, i;
        //input = document.getElementById("search");
        //filter = input.value.toUpperCase();
        //table = document.getElementById("productAdd");
        //tr = table.getElementsByTagName("tr");
        //for (i = 0; i < tr.length; i++) {
        //    td = tr[i].getElementsByTagName("lable")[0];
        //    if (td) {
        //        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        //            tr[i].style.display = "";
        //        } else {
        //            tr[i].style.display = "none";
        //        }
        //    }
        //}
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
        $("input[name='inputEntity'][value='ENTITY']").prop('checked', true);
        $("input[name='inputEntity']").attr("disabled", false);
        $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
        $('#Cityname').val('');
        $('#Citycode').val('');
        $('#Statename').val('');
        $('#Statecode').val('');
        $('#tblhospital').html('');
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
        _objData.Region_Code = $('#regioncode').val();
        _objData.subDomainName = subDomainName;
        _objData.Entity_Type = Entity_type_g;
        $.ajax(
           {
               async: false,
               type: "Post",
               data: _objData,
               url: "../GetAllSalesDetails",
               success: function (response) {
                   Sales.defaults.SalesDetails = response;
                   if (response.length != 0) {
                       debugger;

                       $('#detailedSales').html('');
                       var grid = new ej.grids.Grid({
                           dataSource: response,
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
                                   { headerText: 'Finish', width: 150, textAlign: 'center' },
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
        if (args.column.headerText == "Finish") {
            if (args.data.Status == 3) {
                args.cell.innerHTML = "<a style='textDecoration:\'underline\';cursor:\'pointer\'' onclick=Sales.fnFinsh(" + args.data.Sales_Id + ")'>Finish</a>"
                $(args.cell).bind("click", function () {
                    Sales.fnFinsh(args.data.Sales_Id);
                });
            }
            else {
                args.cell.innerHTML = ""
            }
        }
    },
    Productlist: function (Sales_Id) {

        debugger;
        var lst = $.grep(Sales.defaults.ProductDetail, function (v) {
            return v.Sales_Id == Sales_Id;
        });
        var content = '';
        if (lst.length > 0) {
            content += ' <table class="table table-bordered" ><thead><tr><th>Product Name</th><th class="clssales" >Sales Units</th><th class="clsclosing">Closing Units</th><th class="clsTransit">Transit</th></tr></thead>';
            content += ' <tbody>';
            //content += '<<div class="card" style="width: 18rem;"><div class="card-body"> <label for="Product Name">Product Name</label><input type="text" class="productname" id="productAdd" /> <div id="panel"><label for="salesunit">Sales Unit</label> <input type="text" class="salesunit" id="slunit" /> <br /> <label for="closing unit">Closing Unit</label><input type="text" class="closingunit" id="clunit" />>'
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


                //content+='<div class="panel panel-default" style="margin-bottom: 10px;">';
                //content += '<div class="panel-heading">' + lst[i].Product_Name + '</div>';
                //content+='<div class="panel-body">Panel Content</div>';
                //content += 'div>';
                //content += '<tr><td>' + lst[i].Product_Name + '</td><td class="clssales" style="display:none;">' + lst[i].Units + '</td><td class="clsclosing" style="display:none;">' + lst[i].Closing + '</td><td class="clsTransit" style="display:none;">' + lst[i].Transit + '</td></tr>';
            }

            content += '  </tbody></table>';
        }
        else {
            content += '<span>No Data Found</span>';
        }
        $('#tblProductmodel').html(content);
        //$(".clssales").show();
        //$(".clsclosing").show();
        //$(".clsTransit").show();
        //if (Entity_Product_g == "CLOSING_UNITS,SALES_UNITS," || Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,") {
        //    $(".clssales").show();
        //    $(".clsclosing").show();
        //}
        //else if (Closing_Unit_g == "CLOSING_UNITS") {
        //    $(".clsclosing").show();

        //}
        //else if (Sales_Unit_g == "SALES_UNITS") {
        //    $(".clssales").show();
        //}

        $('#ProductDetails').show();
    },
    fnEdit: function (Sales_Id) {
        debugger;
        var lst = $.grep(Sales.defaults.SalesDetails, function (v) {
            return v.Sales_Id == Sales_Id;
        });
        $('#go').hide();
        $('#regioncode').val(lst[0].Region_Code);
        $('#regionname').val(lst[0].Region_Name);
        $('#regionname').prop('disabled', true);
        Sales.AddProduct();
        var type = lst[0].Entity_Type.toLowerCase();

        var ProductdefaultOptions = "CLOSING_UNITS,SALES_UNITS,TRANSIT";
        var privilege_Name_Doctor = "DOCTOR_ENTITY_SALES_PRODUCT_UNITS";
        var privilege_Name_Chemist = "CHEMIST_ENTITY_SALES_PRODUCT_UNITS";
        var privilege_Name_Stockist = "STOCKIST_ENTITY_SALES_PRODUCT_UNITS";
        var privilege_Name_Hospital = "HOSPITAL_ENTITY_SALES_PRODUCT_UNITS";
        var DoctorProductOptions = fngetprivilegevaluesale(privilege_Name_Doctor, ProductdefaultOptions);
        var ChemistProductOptions = fngetprivilegevaluesale(privilege_Name_Chemist, ProductdefaultOptions);
        var StockistProductOptions = fngetprivilegevaluesale(privilege_Name_Stockist, ProductdefaultOptions);
        var HospitalProductOptions = fngetprivilegevaluesale(privilege_Name_Hospital, ProductdefaultOptions);
        Doctor_Entity_Product_g = DoctorProductOptions + ',';
        Chemist_Entity_Product_g = ChemistProductOptions + ',';
        Stockist_Entity_Product_g = StockistProductOptions + ',';
        Hospital_Entity_Product_g = HospitalProductOptions + ',';
        var DoctorProductOptionsArr = DoctorProductOptions.split(',');
        var ChemistProductOptionsArr = ChemistProductOptions.split(',');
        var StockistProductOptionsArr = StockistProductOptions.split(',');
        var HospitalProductOptionsArr = HospitalProductOptions.split(',');
        var selectedEntity = $('input[name="inputs"]:checked').val();
        if (type == "doctor") {
            if (DoctorProductOptionsArr.length > 0) {
                for (var i = 0; i < DoctorProductOptionsArr.length; i++) {
                    //if ($('#' + ProductOptionsArr[i]).hasClass('fc-state-active')) {
                    //    return ProductOptionsArr[i].toUpperCase();
                    //}
                    if (DoctorProductOptionsArr[i] == "CLOSING_UNITS") {
                        Closing_Unit_g = "CLOSING_UNITS";
                        $(".clsclosing").show();
                    }
                    else if (DoctorProductOptionsArr[i] == "SALES_UNITS") {
                        Sales_Unit_g = "SALES_UNITS";
                        $(".clssales").show();
                    }
                    else if (DoctorProductOptionsArr[i] == "TRANSIT") {
                        Transit_g = "TRANSIT";
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

        if (type == "chemist") {
            if (ChemistProductOptionsArr.length > 0) {
                for (var i = 0; i < ChemistProductOptionsArr.length; i++) {
                    //if ($('#' + ProductOptionsArr[i]).hasClass('fc-state-active')) {
                    //    return ProductOptionsArr[i].toUpperCase();
                    //}
                    if (ChemistProductOptionsArr[i] == "CLOSING_UNITS") {
                        Chemist_Closing_Unit_g = "CLOSING_UNITS";
                        $(".clsclosing").show();
                    }
                    else if (ChemistProductOptionsArr[i] == "SALES_UNITS") {
                        Chemist_Sales_Unit_g = "SALES_UNITS";
                        $(".clssales").show();
                    }
                    else if (ChemistProductOptionsArr[i] == "TRANSIT") {
                        Chemist_Transit_g = "TRANSIT";
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
        if (type == "stockist") {
            if (StockistProductOptionsArr.length > 0) {
                for (var i = 0; i < StockistProductOptionsArr.length; i++) {
                    //if ($('#' + ProductOptionsArr[i]).hasClass('fc-state-active')) {
                    //    return ProductOptionsArr[i].toUpperCase();
                    //}
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
        if (type == "hospital") {
            if (HospitalProductOptionsArr.length > 0) {
                for (var i = 0; i < HospitalProductOptionsArr.length; i++) {
                    //if ($('#' + ProductOptionsArr[i]).hasClass('fc-state-active')) {
                    //    return ProductOptionsArr[i].toUpperCase();
                    //}
                    if (HospitalProductOptionsArr[i] == "CLOSING_UNITS") {
                        Hospital_Closing_Unit_g = "CLOSING_UNITS";
                        $(".clsclosing").show();
                    }
                    else if (HospitalProductOptionsArr[i] == "SALES_UNITS") {
                        Hospital_Sales_Unit_g = "SALES_UNITS";
                        $(".clssales").show();
                    }
                    else if (HospitalProductOptionsArr[i] == "TRANSIT") {
                        Hospital_Transit_g = "TRANSIT";
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
        $('#customerCode').val(lst[0].Entity_Code);
        // $('#customerName').val(lst[0].Entity_Name);
        $('#customerName').html('<option maxlength="25" style="text-align:left;" value="' + lst[0].Entity_Code + '">' + lst[0].Entity_Name + '</option>');
        $('#customerName').prop('disabled', true);
        var type = lst[0].Entity_Type.toLowerCase();
        $("input[name='inputs'][value='" + type + "']").prop('checked', true);
        var Month = fnGetMonth(lst[0].Month);
        $('#Myear').val(Month + '-' + lst[0].Year);
        $('#SDate').val(lst[0].Statement_Date);
        $('#Myear').prop('disabled', true);
        $("input.Cusinput").attr("disabled", true);
        $("input[name='inputEntity'][value='ENTITY']").prop('checked', true);
        $("input[name='inputEntity']").attr("disabled", true);
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
            //$('#units_' + lstProd[i].Product_Code).val(lstProd[i].Closing);
            //$('#Transit_' + lstProd[i].Product_Code).val(lstProd[i].Transit);

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
        _objData.Region_Code = $('#regioncode').val();
        _objData.subDomainName = subDomainName;
        $.ajax(
           {
               type: "Post",
               data: _objData,
               url: "../GetAllEntityProduct",  //"../../HiDoctor_Activity/Batch/GetAllEntityProduct",
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
        var RegionCode = $('#regioncode').val();
        var EntityCode = $('#customerName').val();
        var EntityName = $('#customerName option:selected').text();
        var Entity = $('input[name="inputs"]:checked').val();
        var statementDate = $('#SDate').val();
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
        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
            Clst = $.grep(Sales.defaults.CustomerDetails, function (v) {
                return v.value == $('#customerName').val();
            });
        } else {
            Clst = $.grep(Sales.defaults.lstProducts, function (v) {
                return v.value == $('#customerName').val();
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
        var Mlst = "";
        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
            var Mlst = $.grep(Sales.defaults.SalesDetails, function (v) {
                return v.Month == Month && v.Year == Year && v.Entity_Code == EntityCode && v.Status == 1;
            });
            if (Mlst != 0) {
                swal('The Sales for the month is already entered', "", "info");
                $('#Prodsave').prop('disabled', false);
                unitsvalue = false;
                return false;
            }
        } else {
            var arrAlreadySubmitted = [];
            var sno = 0;
            $('input[name="product"]:checked').each(function () {
                sno++;
                var entityCode = $(this).context.id;//$('#prod_' + sno).children().find('input')[0].id;
                Mlst = $.grep(Sales.defaults.SalesDetails, function (v) {
                    return v.Month == Month && v.Year == Year && v.Status == 1 && v.Entity_Type.toUpperCase() == Entity.toUpperCase() && v.Entity_Code == entityCode;
                });
                if (Mlst.length > 0) {
                    arrAlreadySubmitted.push(entityCode);
                }

            });

            var Entity = $('input[name="inputs"]:checked').val();
            if (arrAlreadySubmitted.length > 0) {
                swal('The Sales for the month for certain ' + Entity + '(s) is already entered', "", "info");
                $('#Prodsave').prop('disabled', false);
                unitsvalue = false;
                return false;
            }
        }
        var arr = [];

        $('#prod input[name="product"]:checked').each(function () {
            debugger;
            var tr = $(this).parent().attr('id');
            tr = tr.split('_')[1];
            var obj = {
                Product_Code: tr,
                Product_Name: $('#txtDet_' + tr).text(),
                Units: $('#sales_' + tr).val(),
                Closing: $('#units_' + tr).val(),
                Transit: $('#Transit_' + tr).val(),
            }

            var selectedEntity = $(".entitytype input[type=radio]:checked").val();
            var arrColumns = [];
            var entityProductLcl = "";
            if (selectedEntity == "doctor") {
                debugger;
                entityProductLcl = Doctor_Entity_Product_g.slice(0, -1);
            }
            if (selectedEntity == "chemist") {
                debugger;
                entityProductLcl = Chemist_Entity_Product_g.slice(0, -1);
            }
            if (selectedEntity == "stockist") {
                debugger;
                entityProductLcl = Stockist_Entity_Product_g.slice(0, -1);
            }
            if (selectedEntity == "hospital") {
                debugger;
                entityProductLcl = Hospital_Entity_Product_g.slice(0, -1);
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
                        swal('Please Enter Transit For ' + obj.Product_Name, "", "info");
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



            //if (Entity_Product_g == "SALES_UNITS,CLOSING_UNITS," || Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,") {
            //    if (obj.Units != '' && obj.Closing != '') {
            //        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //            unitsvalue = false;
            //            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //            $('#Prodsave').prop('disabled', false);
            //            return false;
            //        }
            //        else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing)) {
            //            unitsvalue = false;
            //            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //            $('#Prodsave').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            arr.push(obj);
            //        }
            //    }
            //    else if (obj.Units == '') {
            //        unitsvalue = false;
            //        swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //        $('#Prodsave').prop('disabled', false);
            //        return false;
            //    }
            //    else {
            //        unitsvalue = false;
            //        swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //        $('#Prodsave').prop('disabled', false);
            //        return false;
            //    }
            //}
            //    //Closing_Unit_g='';
            //    //Sales_Unit_g ='';
            //else if (Sales_Unit_g == "SALES_UNITS" || Closing_Unit_g == "CLOSING_UNITS") {
            //    if (obj.Units != '' && Sales_Unit_g == "SALES_UNITS") {
            //        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //            unitsvalue = false;
            //            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //            $('#Prodsave').prop('disabled', false);
            //            return false;
            //        }
            //        else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Closing_Unit_g == "CLOSING_UNITS") {
            //            unitsvalue = false;
            //            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //            $('#Prodsave').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            arr.push(obj);
            //        }
            //    }
            //    else if (obj.Units == '' && Sales_Unit_g == "SALES_UNITS") {
            //        unitsvalue = false;
            //        swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //        $('#Prodsave').prop('disabled', false);
            //        return false;
            //    }
            //    else if (obj.Closing == "" && Closing_Unit_g == "CLOSING_UNITS") {
            //        unitsvalue = false;
            //        swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //        $('#Prodsave').prop('disabled', false);
            //        return false;
            //    }
            //    else {
            //        arr.push(obj);
            //    }
            //}
            //if (obj.Units == "") {
            //    obj.Units = 0.00;
            //}
            //else if (obj.Closing == "") {
            //    obj.Closing = 0.00;
            //}
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
            _objData.Region_Code = RegionCode;
            _objData.EntityCode = EntityCode;
            _objData.Entity = Entity;
            _objData.Month = Month;
            _objData.Year = Year;
            _objData.Date = statementDate.split('-')[2] + '-' + statementDate.split('-')[1] + '-' + statementDate.split('-')[0];
            _objData.TypeOfMapping = $('input[name="inputEntity"]:checked').val();
            _objData.EntityName = EntityName;
            $.ajax(
          {
              type: "Post",
              data: JSON.stringify({ "_ObjData": _objData }),
              contentType: "application/json utf-8",
              url: '../GetInsertProductSales',
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
        var RegionCode = $('#regioncode').val();
        var EntityCode = $('#customerCode').val();
        var EntityName = $('#customerName option:selected').text();
        var Entity = $('input[name="inputs"]:checked').val();
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
        $('#prod input[name="product"]:checked').each(function () {
            var tr = $(this).parent().attr('id');
            tr = tr.split('_')[1];
            var obj = {
                Product_Code: $(this).attr('id'),
                Product_Name: $("#txtDet_" + tr).text(),
                Units: $('#sales_' + $(this).attr('id')).val(),
                Sales_Id: Sales.defaults.Sales_ID,
                Closing: $('#units_' + $(this).attr('id')).val(),
                Transit: $('#Transit_' + $(this).attr('id')).val(),
            }
            //debugger;
            //if (Entity_Product_g == "SALES_UNITS,CLOSING_UNITS," || Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,") {
            //    if (obj.Units != '' && obj.Closing != '') {
            //        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //            unitsvalue = false;
            //            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Closing_Unit_g == "CLOSING_UNITS") {
            //            unitsvalue = false;
            //            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            arr.push(obj);
            //        }

            //    }
            //    else if (obj.Units == '') {
            //        unitsvalue = false;
            //        swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //        $('#ProdUpdate').prop('disabled', false);
            //        return false;
            //    }
            //    else {
            //        unitsvalue = false;
            //        swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //        $('#ProdUpdate').prop('disabled', false);
            //        return false;
            //    }
            //}
            //else if (Sales_Unit_g == "SALES_UNITS" || Closing_Unit_g == "CLOSING_UNITS") {
            //    if (obj.Units != '' && Sales_Unit_g == "SALES_UNITS") {

            //        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //            unitsvalue = false;
            //            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Closing_Unit_g == "CLOSING_UNITS") {
            //            unitsvalue = false;
            //            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            arr.push(obj);
            //        }
            //    }
            //    else if (obj.Units == '' && Sales_Unit_g == "SALES_UNITS") {
            //        unitsvalue = false;
            //        swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //        $('#ProdUpdate').prop('disabled', false);
            //        return false;
            //    }
            //    else if (obj.Closing == '' && Closing_Unit_g == "CLOSING_UNITS") {
            //        unitsvalue = false;
            //        swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //        $('#ProdUpdate').prop('disabled', false);
            //        return false;
            //    }
            //    else {
            //        arr.push(obj);
            //    }
            //}
            var selectedEntity = $(".entitytype input[type=radio]:checked").val();
            var arrColumns = [];
            var entityProductLcl = "";
            if (selectedEntity == "doctor") {
                debugger;
                entityProductLcl = Doctor_Entity_Product_g.slice(0, -1);
            }
            if (selectedEntity == "chemist") {
                debugger;
                entityProductLcl = Chemist_Entity_Product_g.slice(0, -1);
            }
            if (selectedEntity == "stockist") {
                debugger;
                entityProductLcl = Stockist_Entity_Product_g.slice(0, -1);
            }
            if (selectedEntity == "hospital") {
                debugger;
                entityProductLcl = Hospital_Entity_Product_g.slice(0, -1);
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
                        swal('Please Enter Transit For ' + obj.Product_Name, "", "info");
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
                $('#ProdUpdate').prop('disabled', false);
                return false;
            }
            var _objData = new Object();
            _objData.User_Code = LoginUserCode;
            _objData.CompanyId = CompanyId;
            _objData.subDomainName = subDomainName;
            _objData.Region_Code = RegionCode;
            _objData.EntityCode = EntityCode;
            _objData.Entity = Entity;
            _objData.Month = Month;
            _objData.Year = Year;
            _objData.Date = statementDate.split('-')[2] + '-' + statementDate.split('-')[1] + '-' + statementDate.split('-')[0];
            _objData.EntityName = EntityName;
            _objData.Sales_Id = Sales.defaults.Sales_ID;
            _objData.TypeOfMapping = $('input[name="inputEntity"]:checked').val();
            _objData.lstProductSales = arr;

            $.ajax(
          {
              type: "Post",
              data: JSON.stringify({ "_ObjData": _objData }),
              url: '../GetUpdateProductSales',
              contentType: "application/json utf-8",
              success: function (response) {
                  if (response >= 1) {
                      swal({
                          title: 'Successfully Updated',
                          imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                      });
                      Sales.fnprodclear();
                      $('#ProdUpdate').prop('disabled', false);
                      Sales.GetAllEntityProduct();
                  }
              },
              error: function (response) {
                  $('#QuantitySave').prop('disabled', false);
                  $('#ProdUpdate').prop('disabled', false);
              }
          });
        }
        else {
            return false;
        }


    },

}
///////////////////////////////Hospital Approval//////////////////////////////////
//var ASales = {
//    defaults: {
//        RegionDetails: "",
//        CustomerDetails: "",
//        StateCity: "",
//        Sales_ID: "",
//        ProductDetail: "",
//        SpChar: "-_.,()"
//    },
//    Approvalinitialize: function () {
//        fnUserSelectedOption();
//        ASales.GetAllRegion();
//        ASales.GetStateName();
//        //ASales.GetConfig();
//        $('.Cusinput').change(function () {
//            if ($('input[name="inputs"]:checked').val() == 'hospital') {
//                $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
//            }
//            else {
//                $('#icon').html('Text');
//            }
//            ASales.GetCustomerDetails();
//        });
//        $('#Approvalgo').click(function () {
//            ASales.GetAllEntityDetails();
//            fnEntityProductOption();
//        });
//        $('#searchgo').click(function () {
//            ASales.GetHospitalName();
//        });
//        $('#ApprovalClear').click(function () {
//            $('#auto').html('');
//            $('#auto').html(' <input type="text" class="text-line" id="Aregionname"><input type="hidden" class="form-control" id="Aregioncode">');
//            ASales.GetAllRegion();
//            $('#AMyear').val('');
//            $('#hospital').prop("checked", true);
//            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
//            $('#Cityname').val('');
//            $('#Citycode').val('');
//            $('#Statename').val('');
//            $('#Statecode').val('');
//            $('#Tab').html('');
//            ASales.GetCustomerDetails();
//        })
//    },
//    GetAllRegion: function () {
//        $.ajax(
//                 {
//                     type: 'POST',
//                     url: '../../HiDoctor_Activity/Batch/GetAllRegionName',
//                     data: 'Region_Code=' + LoginRegionCode + "&subDomainName=" + subDomainName,
//                     success: function (response) {
//                         debugger;

//                         if (response != null && response.length > 0) {

//                             //Sale product autofill
//                             var doc = "[";
//                             for (var i = 0; i < response.length; i++) {
//                                 if (i == 0) {
//                                     var regioncode = response[0].Region_Code;
//                                     $('#Aregionname').val(response[0].Region_Name)
//                                     $('#Aregioncode').val(response[0].Region_Code)
//                                 }
//                                 doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "}";
//                                 if (i < response.length - 1) {
//                                     doc += ",";
//                                 }
//                             }

//                             doc += "];";
//                             ASales.defaults.RegionDetails = eval(doc);
//                             //$('#dvtxtregionName').empty();
//                             // $('#dvtxtregionName').html('<input type="text" class="text-line" id="regionname">');
//                             var atcObj = new ej.dropdowns.AutoComplete({
//                                 //set the data to dataSource property
//                                 dataSource: eval(doc),

//                                 fields: { text: 'label' },

//                                 select: ASales.changefirst,
//                                 focusOut: ASales.changefocusOutfirst,
//                             });
//                             //atcObj.destroy();
//                             atcObj.appendTo('#Aregionname');
//                             //atcObj.value = response[0].Region_Code;
//                             ASales.GetCustomerDetails();
//                         }
//                     },
//                     error: function () {

//                     }
//                 });
//    },
//    changefirst: function (arg) {
//        debugger;
//        if (arg.itemData != null) {
//            $("#Aregioncode").val(arg.itemData.value);
//            ASales.GetCustomerDetails();
//            fnEntityProductOption();
//        }
//    },
//    changefocusOutfirst: function () {
//        debugger;
//        if ($('#Aregionname').val() == '') {
//            $("#Aregioncode").val('');
//        }

//    },
//    GetCustomerDetails: function () {
//        debugger;
//        var value = $('input[name="inputs"]:checked').val();
//        var RegionCode = $('#Aregioncode').val();
//        var Date = '';
//        if (value == 'stockist' && $('#AMyear').val() == '') {
//            swal('Please select Sales Month & Year', "", "info");
//            $('#hospital').prop("checked", true);
//            ASales.GetCustomerDetails();
//            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
//            return false;
//        }
//        else if (value == 'stockist' && $('#AMyear').val() != '') {
//            var Month = fnGetMonthName($('#AMyear').val().split('-')[0]);
//            var Year = $('#AMyear').val().split('-')[1];
//            Date = Year + '-' + Month + '-01';
//        }
//        $.ajax(
//          {
//              type: 'POST',
//              url: '../../HiDoctor_Activity/Batch/GetCustomerDetails',
//              data: 'RegionCode=' + RegionCode + "&subDomainName=" + subDomainName + "&Value=" + value + "&SDate=" + Date,
//              success: function (response) {
//                  debugger;
//                  $('#AcustomerName').val('');
//                  $('#AcustomerCode').val('');
//                  if (response != null && response.length > 0) {

//                      //Sale product autofill
//                      var doc = "[";
//                      for (var i = 0; i < response.length; i++) {
//                          doc += "{label:" + '"' + "" + response[i].CustomerName + "" + '",' + "value:" + '"' + "" + response[i].CustomerCode + '"' + "}";
//                          if (i < response.length - 1) {
//                              doc += ",";
//                          }
//                      }

//                      doc += "];";
//                      ASales.defaults.CustomerDetails = eval(doc);


//                  }
//                  else {
//                      var doc = "[]";
//                      ASales.defaults.CustomerDetails = eval(doc);
//                  }
//                  autoComplete(ASales.defaults.CustomerDetails, "AcustomerName", "AcustomerCode", 'customer');
//              },
//              error: function () {

//              }
//          });
//    },
//    GetStateName: function () {
//        $.ajax(
//                 {
//                     type: 'POST',
//                     url: '../../HiDoctor_Activity/Batch/GetStateName',
//                     data: "&subDomainName=" + subDomainName,
//                     success: function (response) {
//                         debugger;
//                         var State = response;
//                         if (State != null && State.length > 0) {

//                             //Sale product autofill
//                             var doc = "[";
//                             for (var i = 0; i < State.length; i++) {
//                                 doc += "{label:" + '"' + "" + State[i].State_Name + "" + '",' + "value:" + '"' + "" + State[i].State_ID + '"' + "}";
//                                 if (i < State.length - 1) {
//                                     doc += ",";
//                                 }
//                             }

//                             doc += "];";
//                             ASales.defaults.StateCity = eval(doc);
//                             var atcObj = new ej.dropdowns.AutoComplete({
//                                 //set the data to dataSource property
//                                 dataSource: eval(doc),

//                                 fields: { text: 'label' },

//                                 select: ASales.StateChange,
//                                 focusOut: ASales.StatefocusOutfirst,
//                             });
//                             //atcObj.destroy();
//                             atcObj.appendTo('#Statename');
//                         }

//                     },
//                     error: function () {

//                     }
//                 });
//    },
//    GetCityName: function (salesid) {
//        $.ajax(
//                 {
//                     type: 'POST',
//                     url: '../../HiDoctor_Activity/Batch/GetCityName',
//                     data: "&subDomainName=" + subDomainName + "&StateID=" + salesid,
//                     success: function (response) {
//                         debugger;
//                         var City = response;
//                         if (City != null && City.length > 0) {
//                             $('#city').html(' <input type="text" class="text-line" id="Cityname"><input type="hidden" class="form-control" id="Citycode">');
//                             //Sale product autofill
//                             var doc = "[";
//                             for (var i = 0; i < City.length; i++) {
//                                 doc += "{label:" + '"' + "" + City[i].City_Name + "" + '",' + "value:" + '"' + "" + City[i].City_ID + '"' + "}";
//                                 if (i < City.length - 1) {
//                                     doc += ",";
//                                 }
//                             }

//                             doc += "];";
//                             //  Sales.defaults.RegionDetails = eval(doc);
//                             var atcObj = new ej.dropdowns.AutoComplete({
//                                 //set the data to dataSource property
//                                 dataSource: eval(doc),

//                                 fields: { text: 'label' },

//                                 select: ASales.CityChange,
//                                 focusOut: ASales.CityfocusOutfirst,
//                             });
//                             //atcObj.destroy();
//                             atcObj.appendTo('#Cityname');
//                             ASales.GetCustomerDetails();
//                         }
//                     },
//                     error: function () {

//                     }
//                 });
//    },
//    StateChange: function (arg) {
//        debugger;
//        if (arg.itemData != null) {
//            $("#Statecode").val(arg.itemData.value);
//            Sales.GetCityName(arg.itemData.value);
//        }
//    },
//    StatefocusOutfirst: function () {
//        debugger;
//        if ($('#Statename').val() == '') {
//            $("#Statecode").val('');
//        }

//    },
//    CityChange: function (arg) {
//        debugger;
//        if (arg.itemData != null) {
//            $("#Citycode").val(arg.itemData.value);
//        }
//    },
//    CityfocusOutfirst: function () {
//        debugger;
//        if ($('#Cityname').val() == '') {
//            $("#Citycode").val('');
//        }

//    },
//    GetHospitalName: function () {
//        var StateID = $("#Statecode").val();
//        var CityID = $("#Citycode").val();
//        if (StateID == '') {
//            swal('Please select the State Name', "", "info");
//            return false;
//        }
//        if (CityID == '') {
//            swal('Please select the City Name', "", "info");
//            return false;
//        }
//        $.ajax(
//               {
//                   type: 'POST',
//                   url: '../../HiDoctor_Activity/Batch/GetHospitalName',
//                   data: "&subDomainName=" + subDomainName + "&StateID=" + StateID + "&CityID=" + CityID,
//                   success: function (response) {
//                       debugger;
//                       if (response != null && response.length > 0) {
//                           var str = "";
//                           str += '<table class="table table-hover" id="hospital"><thead><tr><th scope="col"></th><th scope="col">Hospital Name</th><th scope="col">Local Area</th><th scope="col">Pin Code</th></tr></thead>';
//                           str += '<tbody>';
//                           for (var i = 0; i < response.length; i++) {
//                               str += '<tr><th scope="row">';
//                               if (i == 0) {
//                                   str += '<input type="radio" class="hospitalinput" value=' + response[i].Hospital_Id + '_' + encodeURIComponent(response[i].Hospital_Name) + ' name="inputs" checked>';
//                               }
//                               else {
//                                   str += '<input type="radio" class="hospitalinput" value=' + response[i].Hospital_Id + '_' + encodeURIComponent(response[i].Hospital_Name) + ' name="inputs">';
//                               }
//                               str += '</th><td>' + response[i].Hospital_Name + '</td><td>' + response[i].Local_Area + '</td><td>' + response[i].Pin_Code + '</td></tr>';
//                           }
//                           str += '</tbody></table>';
//                           str += '<input type="button" class="btn btn-primary" id="Hospsave" value="Save" onclick="ASales.fnsavehospital()" />'
//                           $('#tblhospital').html(str);
//                       }
//                       else {
//                           $('#tblhospital').html('No Record Found');
//                       }
//                   },
//                   error: function () {

//                   }
//               });
//    },
//    fnsavehospital: function () {
//        debugger;
//        var value = $('input[class="hospitalinput"]:checked').val();
//        $('#AcustomerName').val(decodeURIComponent(value.split('_')[1]));
//        $('#AcustomerCode').val(value.split('_')[0]);
//        $('#SearchModel').hide();
//        $('#Cityname').val('');
//        $('#Citycode').val('');
//        $('#Statename').val('');
//        $('#Statecode').val('');
//        $('#tblhospital').html('');
//    },
//    GetAllEntityDetails: function () {
//        debugger;
//        var EntityCode = $('#AcustomerCode').val();

//        var Entity = $('input[name="inputs"]:checked').val();
//        if ($('#Aregionname').val() == '') {
//            swal('Please select the Region Name', "", "info");
//            return false;
//        }

//        var lst = $.grep(ASales.defaults.RegionDetails, function (v) {
//            return v.label == $('#Aregionname').val();
//        });
//        if (lst.length == 0) {
//            swal('Please select the valid Region Name', "", "info");
//            return false;
//        }
//        if ($('#AcustomerName').val() == '') {
//            swal('Please select Entity Name', "", "info");
//            return false;
//        }

//        var Clst = $.grep(ASales.defaults.CustomerDetails, function (v) {
//            return v.label == $('#AcustomerName').val();
//        });
//        if (Clst.length == 0) {
//            swal('Please select  valid Entity Name', "", "info");
//            return false;
//        }
//        if ($('#AMyear').val() == '') {
//            swal('Please select the Sales Month & Year', "", "info");
//            return false;
//        }
//        var Month = fnGetMonthName($('#AMyear').val().split('-')[0]);
//        var Year = $('#AMyear').val().split('-')[1];
//        var _objData = new Object();
//        _objData.EntityCode = EntityCode;
//        _objData.Entity = Entity;
//        _objData.Month = Month;
//        _objData.Year = Year;
//        _objData.Region_Code = $('#Aregioncode').val();
//        _objData.subDomainName = subDomainName;
//        $.ajax(
//           {
//               type: "Post",
//               data: _objData,
//               url: "../../HiDoctor_Activity/Batch/GetAllEntityDetails",
//               success: function (response) {
//                   debugger;
//                   var str = '';
//                   var content = '';
//                   var Sales = response.Sales;
//                   var Release = response.Release;
//                   $('#Tab').html('');
//                   if (Sales.length != 0) {
//                       debugger;
//                       str += '<center><table class="table tables"><thead style="display: block;"><th class="tbl2"></th><th class="tbl1">Entity Name</th><th class="tbl2">Entity</th><th class="tbl2">Sales Month & Year</th><th class="tbl2">Statement Date</th><th class="tbl2">Product</th></thead>';
//                       str += '<tbody style="height: 500px;display: block;overflow-x: auto;">'
//                       for (var i = 0; i < Sales.length; i++) {
//                           debugger;
//                           //console.log(Entity_type_g);

//                           //    if (Sales[i].Entity_Type.includes(Entity_type_g)) {
//                           str += '<tr>';
//                           if (Sales[i].Status == 1) {
//                               str += '<td onclick=ASales.fnChangestatus(' + Sales[i].Sales_Id + '); class="tbl2"><a style="cursor: pointer;">Allow Edit</a></td>';
//                           }
//                           else {
//                               str += '<td class="tbl2">Allow Edit</td>';
//                           }
//                           var Month = fnGetMonth(Sales[i].Month)
//                           str += '<td class="tbl1">' + Sales[i].Entity_Name + '</td><td class="tbl2">' + Sales[i].Entity_Type + '</td><td class="tbl2">' + Month + '-' + Sales[i].Year + '</td><td class="tbl2">' + Sales[i].Statement_Date + '</td>';
//                           str += '<td class="tbl2"><span class="fa fa-info-circle info" onclick=ASales.Productlist(' + Sales[i].Sales_Id + ')></span></td></tr>';
//                           //     }
//                           str += '</tbody></table></center>'
//                       }
//                   }
//                   else {
//                       str += '<center><label>No Record Found</label></center>';
//                   }
//                   if (Release.length != 0) {

//                       content += '<center><table class="table tables"><thead style="display: block;"><th class="tbl1">Entity Name</th><th class="tbl2">Entity</th><th class="tbl2">Sales Month & Year</th><th class="tbl2">Statement Date</th><th class="tbl2">Released By</th><th class="tbl2">Released Date</th><th class="tbl2">Remark</th></thead>';
//                       content += '<tbody style="height: 500px;display: block;overflow-x: auto;">'
//                       for (var i = 0; i < Release.length; i++) {
//                           content += '<tr>';
//                           var Month = fnGetMonth(Release[i].Month)
//                           content += '<td class="tbl1">' + Release[i].Entity_Name + '</td><td class="tbl2">' + Release[i].Entity_Type + '</td><td class="tbl2">' + Month + '-' + Release[i].Year + '</td><td class="tbl2">' + Release[i].Statement_Date + '</td>';
//                           content += '<td class="tbl2">' + Release[i].Released_By + '</td><td class="tbl2">' + Release[i].Released_Date + '</td><td class="tbl2">' + Release[i].Remark + '</td></tr>';
//                       }
//                       content += '</tbody></table></center>'
//                   }
//                   else {
//                       content += '<center><label>No Record Found</label></center>';
//                   }

//                   //   $('#detailedApproval').html(str);

//                   //Initialize Tab component
//                   var tabObj = new ej.navigations.Tab({
//                       items: [
//                           {
//                               header: { 'text': 'Entity Sales' },
//                               content: str
//                           },
//                          {
//                              header: { 'text': 'Entity Release Log' },
//                              content: content
//                          }
//                       ]
//                   });
//                   //Render initialized Tab component
//                   tabObj.appendTo('#Tab');
//                   ASales.GetAllEntityProduct();
//                   $('#Cityname').val('');
//                   $('#Citycode').val('');
//                   $('#Statename').val('');
//                   $('#Statecode').val('');
//               },
//               error: function () {

//               }
//           });
//    },
//    GetAllEntityProduct: function () {
//        var _objData = new Object();
//        _objData.Region_Code = $('#Aregioncode').val();
//        _objData.subDomainName = subDomainName;
//        $.ajax(
//           {
//               type: "Post",
//               data: _objData,
//               url: "../../HiDoctor_Activity/Batch/GetAllEntityProduct",
//               success: function (response) {
//                   ASales.defaults.ProductDetail = response;
//               },
//               error: function () {

//               }
//           });
//    },

//    fnChangestatus: function (Sales_Id) {
//        ASales.defaults.Sales_ID = Sales_Id;
//        $('#RemarkNotes').val('');
//        $('#Remark').show();

//    },
//    Productlist: function (Sales_Id) {
//        debugger;
//        var lst = $.grep(ASales.defaults.ProductDetail, function (v) {
//            return v.Sales_Id == Sales_Id;
//        });
//        var content = '';
//        if (lst.length > 0) {
//            content += ' <table class="table table-bordered" ><thead><tr><th>Product Name</th><th class="clssales" style="display:none;">Sales Units</th><th class="clsclosing" style="display:none;">Closing Units</th></tr></thead>';
//            content += ' <tbody>';
//            for (var i = 0; i < lst.length; i++) {
//                content += '<tr><td>' + lst[i].Product_Name + '</td><td class="clssales" style="display:none;">' + lst[i].Units + '</td><td class="clsclosing" style="display:none;">' + lst[i].Closing + '</td></tr>';
//            }

//            content += '  </tbody></table>';
//        }
//        else {
//            content += '<span>No Data Found</span>';
//        }
//        $('#tblProductmodel').html(content);

//        if (Entity_Product_g == "CLOSING_UNITS,SALES_UNITS," || Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,") {
//            $(".clssales").show();
//            $(".clsclosing").show();
//        }
//        else if (Closing_Unit_g == "CLOSING_UNITS") {
//            $(".clsclosing").show();
//        }
//        else if (Sales_Unit_g == "SALES_UNITS") {
//            $(".clssales").show();
//        }

//        $('#ProductDetails').show();
//    },
//    fnStatusChange: function () {
//        if ($('#RemarkNotes').val() == '') {
//            swal('Please enter the Remarks', "", "info");
//            return false;
//        }
//        if ($('#RemarkNotes').val().length > 300) {
//            swal('Remarks should not exceed more than 300 characters', "", "info");
//            return false;
//        }
//        var Remark = ASales.fnChkSplChar('RemarkNotes');
//        if (Remark == false) {
//            swal('Please Enter the following characters only ' + ASales.defaults.SpChar + ' in Remarks ', "", "info");
//            return false;
//        }
//        var _objData = new Object();
//        _objData.User_Code = LoginUserCode;
//        _objData.subDomainName = subDomainName;
//        _objData.Sales_Id = ASales.defaults.Sales_ID;
//        _objData.Remark = $('#RemarkNotes').val();
//        $.ajax(
//          {
//              type: "Post",
//              data: _objData,
//              url: "../../HiDoctor_Activity/Batch/GetEntityStatusChange",
//              success: function (response) {
//                  if (response == 1) {
//                      $('#RemarkNotes').val('');
//                      $('#Remark').hide();
//                      swal({
//                          title: 'Status Changed Successfully ',
//                          imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
//                      });
//                      ASales.GetAllEntityDetails();
//                      //$('#AMyear').val('');
//                      //$('#hospital').prop("checked", true);
//                  }
//              },
//              error: function () {

//              }
//          });
//    },
//    fnChkSplChar: function (id) {
//        debugger;
//        //Remark
//        if ($('#' + id).val() != "") {
//            var specialCharregex = new RegExp("^[-a-zA-Z0-9 _().,\n\r\r\n]+$");
//            if (!specialCharregex.test($('#' + id).val())) {
//                return false;
//            }
//            else {
//                return true;
//            }
//        }
//        return true

//    },
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
function hasDecimalPlace(value, x) {
    var pointIndex = value.indexOf('.');
    return pointIndex >= 0 && pointIndex < value.length - x;
}
function fnUserSelectedOption() {

    var defaultOptions = "HOSPITAL,DOCTOR,CHEMIST,STOCKIST";
    var privilege_Name = "ENTITY_SALES_TYPE";
    var dcrOptions = fngetprivilegevaluesale(privilege_Name, defaultOptions);

    if (dcrOptions != undefined) {
        Entity_type_g = dcrOptions + ',';
        var dcrOptionsArr = dcrOptions.split(',');
        for (var i = 0; i < dcrOptionsArr.length; i++) {
            if ($('#' + dcrOptionsArr[i]).hasClass('fc-state-active')) {
                return dcrOptionsArr[i].toUpperCase();
            }

            if (dcrOptionsArr[i] == "HOSPITAL") {
                Hospital_g = "HOSPITAL";
                $("#hospital").prop("checked", true);
                $(".hdnhospital").show();
                $("#hdnhospital").show();
            }
            else if (dcrOptionsArr[i] == "DOCTOR") {
                Doctor_g = "DOCTOR";
                $(".clshdndoctor").show();
                $("#hdndoctor").show();
            }
            else if (dcrOptionsArr[i] == "CHEMIST") {
                Chemist_g = "CHEMIST";
                $(".clshdnchemist").show();
                $("#hdnchemist").show();
            }
            else if (dcrOptionsArr[i] == "STOCKIST") {
                Stockist_g = "STOCKIST";
                $(".clshdnstockist").show();
                $("#hdnstockist").show();
            }
            else {
                Entity_type_g = 'HOSPITAL', 'DOCTOR', 'CHEMIST', 'STOCKIST';
            }


            if (Entity_type_g == "HOSPITAL,DOCTOR,CHEMIST,STOCKIST") {
                $("#hospital").prop("checked", true);
            }
            else if (Hospital_g == "" && Doctor_g == "DOCTOR") {
                $("#doctor").prop("checked", true);
            }
            else if (Hospital_g == "" && Doctor_g == "" && Chemist_g == "CHEMIST") {
                $("#chemist").prop("checked", true);
            }
            else if (Hospital_g == "" && Doctor_g == "" && Chemist_g == "") {
                $("#stockist").prop("checked", false);
            }
            else {
                $("#hospital").prop("checked", true);
            }
        }
    }
}

function GetConfig() {
    var Config_Key = 'ENTITY_SALES_DOCTOR_FROM';
    var Possible_Values = 'Master,Calci';
    var Config_Value = 'Master';
    var Type = 'USER';
    //var companycode = 'TEO00000010';
    var subdomain = '';
    $.ajax({
        type: 'GET',
        url: '../GetConfigMaster',
        data: "Config_Key=" + Config_Key + "&Possible_Values=" + Possible_Values + "&Config_Value=" + Config_Value + "&Type=" + Type + "&companycode=" + CompanyCode + "&subdomain=" + subDomainName,
        success: function (response) {
            debugger;
            if (response.length > 0) {
                doctorMasterFrom_g = response[0].Type;

            } else {
                doctorMasterFrom_g = "Master";
            }
        }
    });
}
function fngetprivilegevaluesale(privilege_Name, default_value) {

    var value = "";
    var _objData = new Object();
    _objData.User_Code = LoginUserCode;
    _objData.subDomainName = subDomainName;
    _objData.privilege_Name = privilege_Name;
    _objData.default_value = default_value;

    $.ajax({
        type: "GET",
        data: _objData,
        url: '../GetEntitySalesMob',
        async: false,
        success: function (response) {

            value = response;
        },
        error: function () {

        }
    });
    return value;
}

function fnEntityProductOption() {
    debugger;
    var ProductdefaultOptions = "CLOSING_UNITS,SALES_UNITS,TRANSIT";
    var privilege_Name_Doctor = "DOCTOR_ENTITY_SALES_PRODUCT_UNITS";
    var privilege_Name_Chemist = "CHEMIST_ENTITY_SALES_PRODUCT_UNITS";
    var privilege_Name_Stockist = "STOCKIST_ENTITY_SALES_PRODUCT_UNITS";
    var privilege_Name_Hospital = "HOSPITAL_ENTITY_SALES_PRODUCT_UNITS";
    var DoctorProductOptions = fngetprivilegevaluesale(privilege_Name_Doctor, ProductdefaultOptions);
    var ChemistProductOptions = fngetprivilegevaluesale(privilege_Name_Chemist, ProductdefaultOptions);
    var StockistProductOptions = fngetprivilegevaluesale(privilege_Name_Stockist, ProductdefaultOptions);
    var HospitalProductOptions = fngetprivilegevaluesale(privilege_Name_Hospital, ProductdefaultOptions);
    //var DoctorMasterFrom = fngetprivilegevaluesale("ENTITY_SALES_DOCTOR_FROM", "MASTER");
    Doctor_Entity_Product_g = DoctorProductOptions + ',';
    Chemist_Entity_Product_g = ChemistProductOptions + ',';
    Stockist_Entity_Product_g = StockistProductOptions + ',';
    Hospital_Entity_Product_g = HospitalProductOptions + ',';
    //var DoctorMasterOptionArr = DoctorMasterFrom.split(',');
    //Doctor_Master_From_g = DoctorMasterFrom + ',';
    //doctorMasterFrom_g = DoctorMasterFrom;
    var DoctorProductOptionsArr = DoctorProductOptions.split(',');
    var ChemistProductOptionsArr = ChemistProductOptions.split(',');
    var StockistProductOptionsArr = StockistProductOptions.split(',');
    var HospitalProductOptionsArr = HospitalProductOptions.split(',');

    if (DoctorProductOptions != undefined && $('input[name="inputs"]:checked').val().toUpperCase() == "DOCTOR") {
        for (var i = 0; i < DoctorProductOptionsArr.length; i++) {

            if (DoctorProductOptionsArr[i] == "CLOSING_UNITS") {
                Closing_Unit_g = "CLOSING_UNITS";
                $(".clsclosing").show();
            }
            else if (DoctorProductOptionsArr[i] == "SALES_UNITS") {
                Sales_Unit_g = "SALES_UNITS";
                $(".clssales").show();
            }
            else if (DoctorProductOptionsArr[i] == "TRANSIT") {
                Transit_g = "TRANSIT";
                $(".clsTransit").show();
            }
        }
    }
    if (ChemistProductOptions != undefined && $('input[name="inputs"]:checked').val().toUpperCase() == "CHEMIST") {
        for (var i = 0; i < ChemistProductOptionsArr.length; i++) {

            if (ChemistProductOptionsArr[i] == "CLOSING_UNITS") {
                Chemist_Closing_Unit_g = "CLOSING_UNITS";
                $(".clsclosing").show();
            }
            else if (ChemistProductOptionsArr[i] == "SALES_UNITS") {
                Chemist_Sales_Unit_g = "SALES_UNITS";
                $(".clssales").show();
            }
            else if (ChemistProductOptionsArr[i] == "TRANSIT") {
                Chemist_Transit_g = "TRANSIT";
                $(".clsTransit").show();
            }
        }
    }
    if (StockistProductOptions != undefined && $('input[name="inputs"]:checked').val().toUpperCase() == "STOCKIST") {
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
    if (HospitalProductOptions != undefined && $('input[name="inputs"]:checked').val().toUpperCase() == "HOSPITAL") {
        for (var i = 0; i < HospitalProductOptionsArr.length; i++) {

            if (HospitalProductOptionsArr[i] == "CLOSING_UNITS") {
                Hospital_Chemist_Closing_Unit_g = "CLOSING_UNITS";
                $(".clsclosing").show();
            }
            else if (HospitalProductOptionsArr[i] == "SALES_UNITS") {
                Hospital_Sales_Unit_g = "SALES_UNITS";
                $(".clssales").show();
            }
            else if (HospitalProductOptionsArr[i] == "TRANSIT") {
                Hospital_Transit_g = "TRANSIT";
                $(".clsTransit").show();
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
