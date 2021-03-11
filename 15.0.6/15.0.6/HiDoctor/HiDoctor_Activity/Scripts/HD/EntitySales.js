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
        SpChar: "-_.,()",
        lstProducts: "",
    },

    initialize: function () {
        $('#btnFinsh').hide();
        fnUserSelectedOption();
        fnEntityProductOption();
        GetConfig();
        var month_year = fnLoadMonthAndYear()
        $('#Myear').val(month_year);
        var statementdate = fnLoadStatementDate()
        $('#SDate').val(statementdate);
        //$('#go').click(function () {
        //    //   Sales.fnSaveSalesMonth();

        //    Sales.AddProduct();
        //    fnEntityProductOption();
        //    Sales.defaults.Isgo = 1;
        //});
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

            //Sales.fnLoadBindingGrid();
        });
        $('#searchgo').click(function () {
            Sales.GetHospitalName();
        });

        Sales.GetAllRegion();
        Sales.GetStateName();
    },
    fnGo: function () {

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
            $.unblockUI();
            return false;
        } else {
            selectedProdCode = $('#customerCode').val();

        }
        var Month = "";
        var Year = "";
        if ($('#Myear').val() == "" || $('#Myear').val() == null || $('#Myear').val() == undefined) {
            swal('Info', 'Please Select Month & Year.', 'info');
            $.unblockUI();
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
            url: '../../HiDoctor_Activity/Batch/GetAlreadyMappedData',
            data: "entityType=" + entity + "&month=" + Month + "&year=" + Year + "&selectedMappingCode=" + selectedProdCode + "&mappingType=" + modeofMapping + "&subDomainName=" + subDomainName,
            success: function (response) {
                if (response != null && response.length > 0) {
                    if (val == 2) {
                        var tbl_lngth = $('#prod tbody tr').length;
                        for (var i = 0; i < tbl_lngth; i++) {
                            for (var j = 0; j < response.length; j++) {
                                if ($('#prod_' + i).children().find('input')[0].id == response[j].Entity_Code) {
                                    var id = $('#prod_' + i).children().find('input')[0].id;
                                    $('#' + id).prop('checked', true);
                                    $('#units_' + i).val(response[j].Units);
                                    $('#closing_' + i).val(response[j].Closing);
                                    $('#Transit_' + i).val(response[j].Transit);
                                }
                            }
                        }
                    }
                    else {
                        var tbl_lngth = $('#prod tbody tr').length;
                        for (var i = 0; i < tbl_lngth; i++) {
                            for (var j = 0; j < response.length; j++) {
                                if ($('#prod_' + i).children().find('input')[0].id == response[j].Product_Code) {
                                    var id = $('#prod_' + i).children().find('input')[0].id;
                                    $('#' + id).prop('checked', true);
                                    $('#units_' + i).val(response[j].Units);
                                    $('#closing_' + i).val(response[j].Closing);
                                    $('#Transit_' + i).val(response[j].Transit);
                                }
                            }
                        }
                    }

                }

            },
            error: function (error) {
                $.unblockUI();
            }
        });
        $.unblockUI();

    },
    fnHideGrid: function () {
        $('#productAdd').hide();
    },
    GetAllRegion: function () {
        $.ajax(
                 {
                     type: 'POST',
                     url: '../../HiDoctor_Activity/Batch/GetAllRegionName',
                     data: 'Region_Code=' + LoginRegionCode + "&subDomainName=" + subDomainName,
                     //success: function (response) {
                     //    debugger;
                     //    var indexDet = 0;
                     //    if (response != null && response.length > 0) {
                     //        $('#dvRegionName').html('');
                     //        $('#dvRegionName').html('<input type="text" class="text-line" id="regionname">');
                     //        //Sale product autofill
                     //        //var doc = "[";
                     //        var lstRegions = [];
                     //        for (var i = 0; i < response.length; i++) {
                     //            if (i == 0) {
                     //                indexDet = 0;
                     //                var regioncode = response[0].Region_Code;
                     //                //$('#regionname').val(response[0].Region_Name)
                     //            }
                     //            //doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "Draft_Count:" + '"' + "" + response[i].Draft_Count + '"' + "}";
                     //            var _objData = {
                     //                label: response[i].Region_Name,
                     //                value: response[i].Region_Code,
                     //                Draft_Count: response[i].Draft_Count,
                     //                index: i
                     //            };
                     //            lstRegions.push(_objData);
                     //        }

                     //        //doc += "];";
                     //        Sales.defaults.RegionDetails = '';
                     //        Sales.defaults.RegionDetails = lstRegions
                     //        var atcObj = new ej.dropdowns.AutoComplete({
                     //            dataSource: lstRegions,
                     //            fields: { text: 'label', value: 'id' },
                     //            index: indexDet,
                     //            select: Sales.changefirst,
                     //            focusOut: Sales.changefocusOutfirst,
                       
                     //        //var atcObj = new ej.dropdowns.AutoComplete({
                     //        //    //set the data to dataSource property
                     //        //    dataSource: lstRegions,

                     //        //    fields: { text: 'label' },

                     //        //    select: Sales.changefirst,
                     //        //    focusOut: Sales.changefocusOutfirst,
                     //        });
                     //        //atcObj.destroy();
                     //        atcObj.appendTo('#regionname');
                     //        if (regionCode_g != "" && regionCode_g != null && regionCode_g != undefined) {
                     //            atcObj.value = regionName_g;
                     //            $('#regioncode').val(regionCode_g)

                     //        } else {
                     //            atcObj.value = response[0].Region_Name;
                     //            $('#regioncode').val(response[0].Region_Code);


                     //        }
                     //        Sales.GetAllSalesDetails();
                     //        Sales.GetCustomerDetails();
                     //    }
                     //},

                     success: function (response) {
                         debugger;
                         var indexDet = 0;
                         $('#dvRegionName').html('');
                         $('#dvRegionName').html('<input type="text" class="text-line" id="regionname">');
                         if (response != null && response.length > 0) {
                             var lstRegions = [];
                             for (var i = 0; i < response.length; i++) {
                                 if (i == 0) {
                                     indexDet = 0;
                                     var regioncode = response[0].Region_Code;
                                     $('#RegionName').val(response[0].Region_Name)
                                 }
                                 var _obj = {
                                     label: response[i].Region_Name,
                                     value: response[i].Region_Code,
                                     Draft_Count: response[i].Draft_Count,
                                     index: i

                                 }
                                 lstRegions.push(_obj)
                             }
                             Sales.defaults.RegionDetails = '';
                             Sales.defaults.RegionDetails = lstRegions

                             var atcObj = new ej.dropdowns.AutoComplete({
                                 dataSource: lstRegions,
                                 fields: { text: 'label' },
                                 filterBarPlaceholder: 'Search',
                                 showClearButton: true,
                                 allowFiltering: true,
                                 placeholder: 'Select a Region',

                                 index: indexDet,
                                 select: Sales.changefirst,
                                 focusOut: Sales.changefocusOutfirst,

                                 filtering: function (e) {
                                     var dropdown_query = new ej.data.Query();
                                     dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                     e.updateData(lstRegions, dropdown_query);
                                 },

                             });
                            
                             atcObj.appendTo('#regionname');
                             if (regionCode_g != "" && regionCode_g != null && regionCode_g != undefined) {
                                 atcObj.value = regionName_g;
                                 $('#regioncode').val(regionCode_g)

                             } else {
                                 atcObj.value = response[0].Region_Name;
                                 $('#regioncode').val(response[0].Region_Code);


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
            //if (arg.itemData.Draft_Count > 0) {
            //    $('#btnFinsh').show();
            //}
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
            $.ajax({
                type: "GET",
                url: "../HiDoctor_Activity/Batch/UpdateStatusofDraft",
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

        var regioncode = $("#regioncode").val();
        //var TypeOfMapping = $("#TypMap input[type=radio]:checked").val();

        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
            $('#prodheading').html("<div class='col-lg-6'><label>List Of Sales Product</label></div><div class='col-lg-6'><input type='text' class='form-control'  id='search' onkeyup='Sales.myFunction();' placeholder='Search ..' title='Type in a name' autocomplete='off'></div>");
            $.ajax(
                    {
                        async: false,
                        type: 'POST',
                        data: "Region_Code=" + regioncode + "&subDomainName=" + subDomainName,
                        async: false,
                        url: '../../HiDoctor_Activity/Batch/GetAllProductSales',
                        success: function (response) {
                            debugger;
                            if (response != null && response.length > 0) {
                                var str = "";
                                str += '<table class="table tables" id="prod">';
                                str += '<thead style="display: block;">';
                                str += '<tr>';
                                str += '<th scope="col" style="width:50px"><input type="checkbox" class="selectAll" name="Selectproduct"></th>';
                                str += '<th scope="col" class="tbl1">Product Name</th>';
                                str += '<th scope="col" class="tbl2">Ref Key</th>';
                                str += '<th scope="col" class="tbl2 clssales" id="Sales_Unit" style="display:none">Sales Units</th>';
                                str += '<th scope="col" class="tbl2 clsclosing" id="Closing_Unit" style="display:none">Closing Units</th>';
                                str += '<th scope="col" class="tbl2 clsTransit" id="Transit" style="display:none">Transit</th>';
                                str += '</tr>';
                                str += '</thead>';
                                str += '<tbody style="height: 278px;display: block;overflow-x: auto;">';
                                for (var i = 0; i < response.length; i++) {
                                    str += '<tr id="prod_' + i + '">';
                                    str += '<td style="width:50px"><input type="checkbox" id=' + response[i].Product_Code + ' class="product" name="product"></td>';
                                    str += '<td class="tbl1"><lable>' + response[i].Product_Name + '</lable></td>';
                                    str += '<td class="tbl2">' + response[i].Ref_Key1 + '</td>';
                                    str += '<td class="tbl2 clssales" style="display:none"><input type="number" class="form-control decimalck" id="units_' + i + '" min="0"></td>';
                                    str += '<td class="tbl2 clsclosing" style="display:none"><input type="number" class="form-control decimalck" id="closing_' + i + '" min="0"></td>';
                                    str += '<td class="tbl2 clsTransit" style="display:none"><input type="number" class="form-control decimalck" id="Transit_' + i + '" min="0"></td>';
                                }
                                str += '</tbody></table>';
                                str += '<div><input type="button" class="btn btn-primary" id="Prodsave" value="Save" onclick="Sales.fnsaveProduct()" />';
                                str += '<input type="button" class="btn btn-primary" id="ProdUpdate" value="Update" onclick="Sales.fnUpdateProduct()" />';
                                str += '<input type="button" class="btn btn-primary" id="Prodclear" value="Clear" onclick="Sales.fnprodutclear()" style="margin-left: 12px;" /></div>';
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
                                $.unblockUI();
                                $('#productAdd').html('No Product Found');
                            }
                        },
                        error: function () {

                        }
                    });
        } else {
            var value = $('input[name="inputs"]:checked').val();
            var RegionCode = $('#regioncode').val();
            var Date = "";
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

            $.ajax(
              {
                  async: false,
                  type: 'POST',
                  url: '../../HiDoctor_Activity/Batch/GetCustomerDetails',

                  data: 'RegionCode=' + RegionCode + "&subDomainName=" + subDomainName + "&Value=" + value + "&SDate=" + Date + "&doctoMasterFrom=" + doctorMasterFrom_g + "&month=" + Month + "&year=" + Year,
                  success: function (response) {
                      debugger;
                      $.blockUI();
                      if (response != null && response.length > 0) {

                          var str = "";
                          str += '<table class="table tables" id="prod">';
                          str += '<thead style="display: block;">';
                          str += '<tr>';
                          str += '<th scope="col" style="width:50px"><input type="checkbox" class="selectAll" name="Selectproduct"></th>';
                          str += '<th scope="col" class="tbl1">' + displayName + ' Name</th>';
                          str += '<th scope="col" class="tbl2">Ref Key</th>';
                          str += '<th scope="col" class="tbl2 clssales" id="Sales_Unit" style="display:none">Sales Units</th>';
                          str += '<th scope="col" class="tbl2 clsclosing" id="Closing_Unit" style="display:none">Closing Units</th>';
                          str += '<th scope="col" class="tbl2 clsTransit" id="Transit" style="display:none">Transit</th>';
                          str += '</tr>';
                          str += '</thead>';
                          str += '<tbody style="height: 278px;display: block;overflow-x: auto;">';
                          for (var i = 0; i < response.length; i++) {
                              str += '<tr id="prod_' + i + '">';
                              str += '<td style="width:50px"><input type="checkbox" id=' + response[i].CustomerCode + ' class="product" name="product"></td>';
                              str += '<td class="tbl1"><lable>' + response[i].CustomerName + '</lable></td>';
                              str += '<td class="tbl2">' + response[i].Ref_Key1 + '</td>';
                              str += '<td class="tbl2 clssales" style="display:none"><input type="number" class="form-control decimalck" id="units_' + i + '" min="0"></td>';
                              str += '<td class="tbl2 clsclosing" style="display:none"><input type="number" class="form-control decimalck" id="closing_' + i + '" min="0"></td>';
                              str += '<td class="tbl2 clsTransit" style="display:none"><input type="number" class="form-control decimalck" id="Transit_' + i + '" min="0"></td>';
                          }
                          str += '</tbody></table>';
                          str += '<div><input type="button" class="btn btn-primary" id="Prodsave" value="Save" onclick="Sales.fnsaveProduct()" />';
                          str += '<input type="button" class="btn btn-primary" id="ProdUpdate" value="Update" onclick="Sales.fnUpdateProduct()" />';
                          str += '<input type="button" class="btn btn-primary" id="Prodclear" value="Clear" onclick="Sales.fnprodutclear()" style="margin-left: 12px;" /></div>';
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
                          $.unblockUI();
                          $('#productAdd').html('No Product Found');
                      }

                  },
                  error: function () {

                  }
              });
        }
        $('#product').show();
    },
    fnFillRelevantTypeofMapping: function () {
        debugger;
        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
            $('#customerName').val('');
            $('#customerCode').val('');
            $('#product').hide();
            $('#hospital').prop("checked", true);
            $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            autoComplete([], "customerName", "customerCode", 'customer');
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
                  url: '../../HiDoctor_Activity/Batch/GetAllProductSales',
                  success: function (response) {
                      if (response.length > 0) {
                          var lstProducts = []
                          for (var i = 0; i < response.length; i++) {
                              var _objData = {
                                  label: response[i].Product_Name,
                                  value: response[i].Product_Code
                              }
                              lstProducts.push(_objData);
                          }
                          Sales.defaults.lstProducts = lstProducts;
                          autoComplete(lstProducts, "customerName", "customerCode", 'customer');
                      }

                  },
                  error: function (e) {

                  }
              });
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
        $('#btnFinsh').hide();
        $('#customerName').val('');
        $('#customerCode').val('');
        $('.decimalck').val('');
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
        Sales.GetAllSalesDetails();
    },
    GetCustomerDetails: function () {
        debugger;
        var value = $('input[name="inputs"]:checked').val();
        var RegionCode = $('#regioncode').val();
        var Date = "";
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
              url: '../../HiDoctor_Activity/Batch/GetCustomerDetails',
              data: 'RegionCode=' + RegionCode + "&subDomainName=" + subDomainName + "&Value=" + value + "&SDate=" + Date + "&doctoMasterFrom=" + doctorMasterFrom_g + "&month=" + Month + "&year=" + Year,
              success: function (response) {
                  debugger;
                  var Details = [];
                  if (response != null && response.length > 0) {
                      $('#customerName').val('');
                      $('#customerCode').val('');
                     
                      for (var i = 0; i < response.length; i++) {
                          var obj1 = {
                              label: response[i].CustomerName,
                              value: response[i].CustomerCode
                            



                          }
                          
                          Details.push(obj1)
                      }
                      //    doc += "{label:" + '"' + "" + response[i].CustomerName + "" + '",' + "value:" + '"' + "" + response[i].CustomerCode + '"' + "}";
                      //    if (i < response.length - 1) {
                      //        doc += ",";
                      //    }
                      //}

                      //doc += "];";
                 
                      Sales.defaults.CustomerDetails = Details;
                  }
                  else {
                      var doc = '[]';
                      $('#customerName').val('');  
                      $('#customerCode').val('');
                      Sales.defaults.CustomerDetails = Details;
                  }
                  autoComplete(Sales.defaults.CustomerDetails, "customerName", "customerCode", 'customer');
              },
              error: function () {

              }
          });
    },
    GetStateName: function () {
        $.ajax(
                 {
                     type: 'POST',
                     url: '../../HiDoctor_Activity/Batch/GetStateName',
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
        var input, filter, table, tr, td, i;
        input = document.getElementById("search");
        filter = input.value.toUpperCase();
        table = document.getElementById("productAdd");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("lable")[0];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
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
        $('#customerName').val('');
        $('#customerCode').val('');
        $('#SDate').val('');
        $('#Myear').val('');
        $('#btnFinsh').hide();
        $('#hospital').prop("checked", true);
        $("input[name='inputEntity'][value='ENTITY']").prop('checked', true);
        $("input[name='inputEntity']").attr("disabled", false);
        $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
        $('#Cityname').val('');
        $('#Citycode').val('');
        $('#Statename').val('');
        $('#Statecode').val('');
        $('#product').hide();
        $('#tblhospital').html('');
        Sales.GetAllRegion();
        var month_year = fnLoadMonthAndYear()
        $('#Myear').val(month_year);
        var statementdate = fnLoadStatementDate()
        $('#SDate').val(statementdate);
        Sales.GetCustomerDetails();
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
               url: "../../HiDoctor_Activity/Batch/GetAllSalesDetails",
               success: function (response) {
                   Sales.defaults.SalesDetails = response;
                   if (response.length != 0) {
                       debugger;
                       //var disjson = $.grep(response, function (ele, index) {
                       //    return ele.Status != 3;
                       //})
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
            for (var i = 0; i < lst.length; i++) {
                content += '<tr>';
                content += '<td>' + lst[i].Product_Name + '</td>';
                if (lst[i].Units == -1) {
                    content += '<td class="clssales">-</td>'
                }
                else {
                    content += '<td class="clssales">' + lst[i].Units + '</td>'
                }
                if (lst[i].Closing == -1) {
                    content += '<td class="clssales" >-</td>'
                }
                else {
                    content += '<td class="clssales">' + lst[i].Closing + '</td>'
                }
                if (lst[i].Transit == -1) {
                    content += '<td class="clssales">-</td>'
                }
                else {
                    content += '<td class="clssales">' + lst[i].Transit + '</td>'
                }

            }

            content += '  </tbody></table>';
        }
        else {
            content += '<span>No Data Found</span>';
        }
        $('#tblProduct').html(content);
        //if (Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT,") {
        //$(".clssales").show();
        //$(".clsclosing").show();
        //$(".clsTransit").show();
        //}
        //else if (Entity_Product_g == "CLOSING_UNITS,TRANSIT," || Entity_Product_g == "CLOSING_UNITS,TRANSIT,") {
        //    $(".clsclosing").show();
        //    $(".clsTransit").show();
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
    fnEdit: function (Sales_Id) {
        debugger;
        var lst = $.grep(Sales.defaults.SalesDetails, function (v) {
            return v.Sales_Id == Sales_Id;
        });
        // fnEntityProductOption();

        $('#go').hide();
        $('#regioncode').val(lst[0].Region_Code);
        $('#regionname').val(lst[0].Region_Name);
        $('#regionname').prop('disabled', true);
        Sales.AddProduct();
        var type = lst[0].Entity_Type.toLowerCase();

        var ProductdefaultOptions = "CLOSING_UNITS,SALES_UNITS,TRANSIT";
        var DoctorProductOptions = fnGetPrivilegeValue("DOCTOR_ENTITY_SALES_PRODUCT_UNITS", ProductdefaultOptions);
        var ChemistProductOptions = fnGetPrivilegeValue("CHEMIST_ENTITY_SALES_PRODUCT_UNITS", ProductdefaultOptions);
        var StockistProductOptions = fnGetPrivilegeValue("STOCKIST_ENTITY_SALES_PRODUCT_UNITS", ProductdefaultOptions);
        var HospitalProductOptions = fnGetPrivilegeValue("HOSPITAL_ENTITY_SALES_PRODUCT_UNITS", ProductdefaultOptions);
        Doctor_Entity_Product_g = DoctorProductOptions + ',';
        Chemist_Entity_Product_g = ChemistProductOptions + ',';
        Stockist_Entity_Product_g = StockistProductOptions + ',';
        Hospital_Entity_Product_g = HospitalProductOptions + ',';
        var DoctorProductOptionsArr = DoctorProductOptions.split(',');
        var ChemistProductOptionsArr = ChemistProductOptions.split(',');
        var StockistProductOptionsArr = StockistProductOptions.split(',');
        var HospitalProductOptionsArr = HospitalProductOptions.split(',');
        var selectedEntity = $(".entitytype input[type=radio]:checked").val();
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
        $('#customerName').val(lst[0].Entity_Name);
        $('#customerName').prop('disabled', true);
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
            var tr = $('#' + lstProd[i].Product_Code).parent().parent().attr('id');
            if (lstProd[i].Units != -1) {
                $('#' + tr + ' td:nth-child(4)').find('input').val(lstProd[i].Units);

            } else {
                $('#' + tr + ' td:nth-child(4)').find('input').val(0);

            }
            if (lstProd[i].Closing != -1) {
                $('#' + tr + ' td:nth-child(5)').find('input').val(lstProd[i].Closing);

            } else {
                $('#' + tr + ' td:nth-child(5)').find('input').val(0);

            }
            if (lstProd[i].Transit != -1) {
                $('#' + tr + ' td:nth-child(6)').find('input').val(lstProd[i].Transit);

            } else {
                $('#' + tr + ' td:nth-child(6)').find('input').val(0);

            }


        }
        if (type == 'doctor') {
            if (Doctor_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Doctor_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT,") {
                //$(".clssales").show();
                //$(".clsclosing").show();
                //$(".clsTransit").show();
            }
            if (Closing_Unit_g == "CLOSING_UNITS") {
                $(".clsclosing").show();

            }
            if (Sales_Unit_g == "SALES_UNITS") {
                $(".clssales").show();
            }
            if (Transit_g == "TRANSIT") {
                $(".clsTransit").show();
            }




        } else if (type == 'hospital') {
            if (Hospital_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Hospital_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT,") {
                //$(".clssales").show();
                //$(".clsclosing").show();
                //$(".clsTransit").show();
            }
            else if (Hospital_Closing_Unit_g == "CLOSING_UNITS") {
                $(".clsclosing").show();

            }
            else if (Hospital_Sales_Unit_g == "SALES_UNITS") {
                $(".clssales").show();
            }
            else if (Hospital_Transit_g == "TRANSIT") {
                $(".clsTransit").show();
            }



        }
        else if (type == 'stockist') {
            if (Stockist_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Stockist_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT,") {
                //$(".clssales").show();
                //$(".clsclosing").show();
                //$(".clsTransit").show();
            }
            else if (Stockist_Closing_Unit_g == "CLOSING_UNITS") {
                $(".clsclosing").show();

            }
            else if (Stockist_Sales_Unit_g == "SALES_UNITS") {
                $(".clssales").show();
            }
            else if (Stockist_Transit_g == "TRANSIT") {
                $(".clsTransit").show();
            }


        }

        else if (type == 'chemist') {
            if (Chemist_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Chemist_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT,") {
                //$(".clssales").show();
                //$(".clsclosing").show();
                //$(".clsTransit").show();
            }
            else if (Chemist_Closing_Unit_g == "CLOSING_UNITS") {
                $(".clsclosing").show();

            }
            else if (Chemist_Sales_Unit_g == "SALES_UNITS") {
                $(".clssales").show();
            }
            else if (Chemist_Transit_g == "TRANSIT") {
                $(".clsTransit").show();
            }
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
               url: "../../HiDoctor_Activity/Batch/GetAllEntityProduct",
               success: function (response) {
                   Sales.defaults.ProductDetail = response;
               },
               error: function () {

               }
           });
    },
    fnsaveProduct: function () {
        debugger;
        $.blockUI();
        $('#Prodsave').prop('disabled', true);
        var unitsvalue = true;
        var RegionCode = $('#regioncode').val();
        var EntityCode = $('#customerCode').val();
        var EntityName = $('#customerName').val();
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
            $.unblockUI();
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        if ($('#customerName').val() == '') {
            swal('Please select the Entity Name', "", "info");
            $.unblockUI();
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }

        var Clst = "";
        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
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
            $.unblockUI();
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        if ($('#Myear').val() == '') {
            swal('Please select Sales Month & Year', "", "info");
            $.unblockUI();
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;
        }
        if ($('#SDate').val() == '') {
            swal('Please select statement date', "", "info");
            $.unblockUI();
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
            $.unblockUI();
            $('#Prodsave').prop('disabled', false);
            unitsvalue = false;
            return false;

        }
        var Mlst = "";
        if ($('input[name="inputEntity"]:checked').val() == "ENTITY") {
            Mlst = $.grep(Sales.defaults.SalesDetails, function (v) {
                return v.Month == Month && v.Year == Year && v.Entity_Code == EntityCode && v.Status == 1;
            });

            if (Mlst.length > 0) {
                swal('The Sales for the month is already entered', "", "info");
                $.unblockUI();
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
                $.unblockUI();
                $('#Prodsave').prop('disabled', false);
                unitsvalue = false;
                return false;
            }
        }

        var arr = [];

        $('#prod input[name="product"]:checked').each(function () {
            debugger;
            var tr = $(this).parent().parent().attr('id');
            var obj = {
                Product_Code: $(this).attr('id'),
                Product_Name: $('#' + tr + ' td:nth-child(2)').text(),
                Units: $('#' + tr + ' td:nth-child(4)').find('input').val(),
                Closing: $('#' + tr + ' td:nth-child(5)').find('input').val(),
                Transit: $('#' + tr + ' td:nth-child(6)').find('input').val(),
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
                            $.unblockUI();
                            $('#Prodsave').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Units == '') {
                        unitsvalue = false;
                        swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
                        $.unblockUI();
                        $('#Prodsave').prop('disabled', false);
                        return false;
                    }
                }
                else if (arrColumns[i].toUpperCase() == "CLOSING_UNITS") {
                    if (obj.Closing != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Closing_Unit_g == "CLOSING_UNITS") {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $.unblockUI();
                            $('#Prodsave').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Closing == '') {
                        unitsvalue = false;
                        swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
                        $.unblockUI();
                        $('#Prodsave').prop('disabled', false);
                        return false;
                    }
                }
                else if (arrColumns[i].toUpperCase() == "TRANSIT") {
                    if (obj.Transit != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Transit_g == "Transit") {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $.unblockUI();
                            $('#Prodsave').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Transit == '') {
                        unitsvalue = false;
                        swal('Please Enter Transit For ' + obj.Product_Name, "", "info");
                        $.unblockUI();
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
                $.unblockUI();
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
            //var _objData = new Object();
            //_objData.User_Code = LoginUserCode;
            //_objData.lstSaleEntity = releaselst;
            $.ajax(
          {
              type: "Post",
              data: JSON.stringify({ "_ObjData": _objData }),
              contentType: "application/json utf-8",
              url: '../../HiDoctor_Activity/Batch/GetInsertProductSales',
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
                      Sales.GetAllRegion();
                      $.unblockUI();

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

              },
              complete: function () {
                  $.unblockUI();
              }

          });
        }
        else {
            return false;
        }


    },
    fnUpdateProduct: function () {
        debugger;
        $.blockUI();
        $('#ProdUpdate').prop('disabled', true);
        var unitsvalue = true;
        var RegionCode = $('#regioncode').val();
        var EntityCode = $('#customerCode').val();
        var EntityName = $('#customerName').val();
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
            var obj = {};
            unitsvalue = true;
            var tr = $(this).parent().parent().attr('id');
            obj = {
                Product_Code: $(this).attr('id'),
                Product_Name: $('#' + tr + ' td:nth-child(2)').text(),
                Units: $('#' + tr + ' td:nth-child(4)').find('input').val(),
                Sales_Id: Sales.defaults.Sales_ID,
                Closing: $('#' + tr + ' td:nth-child(5)').find('input').val(),
                Transit: $('#' + tr + ' td:nth-child(6)').find('input').val(),
            };
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
                            $.unblockUI();
                            $('#ProdUpdate').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Units == '') {
                        unitsvalue = false;
                        swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
                        $.unblockUI();
                        $('#ProdUpdate').prop('disabled', false);
                        return false;
                    }
                }
                else if (arrColumns[i].toUpperCase() == "CLOSING_UNITS") {
                    if (obj.Closing != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Closing_Unit_g == "CLOSING_UNITS") {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $.unblockUI();
                            $('#ProdUpdate').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Closing == '') {
                        unitsvalue = false;
                        swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
                        $.unblockUI();
                        $('#ProdUpdate').prop('disabled', false);
                        return false;
                    }
                }
                else if (arrColumns[i].toUpperCase() == "TRANSIT") {
                    if (obj.Transit != '') {
                        if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Transit_g == "Transit") {
                            unitsvalue = false;
                            swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
                            $.unblockUI();
                            $('#ProdUpdate').prop('disabled', false);
                            return false;
                        }
                    }
                    if (obj.Transit == '') {
                        unitsvalue = false;
                        swal('Please Enter Transit For ' + obj.Product_Name, "", "info");
                        $.unblockUI();
                        $('#ProdUpdate').prop('disabled', false);
                        return false;
                    }
                }


            }
            //if (Doctor_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT," || Doctor_Entity_Product_g == "SALES_UNITS,TRANSIT,CLOSING_UNITS,"
            //|| Doctor_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Doctor_Entity_Product_g == "CLOSING_UNITS,TRANSIT,SALES_UNITS,"
            //|| Doctor_Entity_Product_g == "TRANSIT,CLOSING_UNITS,SALES_UNITS," || Doctor_Entity_Product_g == "TRANSIT,SALES_UNITS,CLOSING_UNITS,"
            //|| Doctor_Entity_Product_g == "TRANSIT,CLOSING_UNITS," || Doctor_Entity_Product_g == "TRANSIT,SALES_UNITS"
            //|| Doctor_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS," || Doctor_Entity_Product_g == "CLOSING_UNITS,TRANSIT,"
            //|| Doctor_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS," || Doctor_Entity_Product_g == "SALES_UNITS,TRANSIT,"
            //|| Doctor_Entity_Product_g == "TRANSIT," || Doctor_Entity_Product_g == "SALES_UNITS," || Doctor_Entity_Product_g == "CLOSING_UNITS,") {
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
            //        else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Transit_g == "Transit") {
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
            //else
            //    if (Sales_Unit_g == "SALES_UNITS" || Closing_Unit_g == "CLOSING_UNITS" || Transit_g == "TRANSIT") {
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
            //        else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Transit_g == "TRANSIT") {
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
            //    else if (obj.Transit == '' && Transit_g == "TRANSIT") {
            //        unitsvalue = false;
            //        swal('Please Enter Transit   For ' + obj.Product_Name, "", "info");
            //        $('#ProdUpdate').prop('disabled', false);
            //        return false;
            //    }
            //    else {
            //        arr.push(obj);
            //    }

            //}
            if (obj.Units == "") {
                obj.Units = -1;
            }
            if (obj.Closing == "") {
                obj.Closing = -1;
            }
            if (obj.Transit == "") {
                obj.Transit = -1;
            }
            //if (selectedEntity == "chemist") {
            //    if (Chemist_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT," || Chemist_Entity_Product_g == "SALES_UNITS,TRANSIT,CLOSING_UNITS,"
            //      || Chemist_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Chemist_Entity_Product_g == "CLOSING_UNITS,TRANSIT,SALES_UNITS,"
            //      || Chemist_Entity_Product_g == "TRANSIT,CLOSING_UNITS,SALES_UNITS," || Chemist_Entity_Product_g == "TRANSIT,SALES_UNITS,CLOSING_UNITS,"
            //      || Chemist_Entity_Product_g == "TRANSIT,CLOSING_UNITS," || Chemist_Entity_Product_g == "TRANSIT,SALES_UNITS"
            //      || Chemist_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS," || Chemist_Entity_Product_g == "CLOSING_UNITS,TRANSIT,"
            //      || Chemist_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS," || Chemist_Entity_Product_g == "SALES_UNITS,TRANSIT,"
            //      || Chemist_Entity_Product_g == "TRANSIT," || Chemist_Entity_Product_g == "SALES_UNITS," || Chemist_Entity_Product_g == "CLOSING_UNITS,") {
            //        if (obj.Units != '' && obj.Closing != '') {
            //            if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Chemist_Closing_Unit_g == "CLOSING_UNITS") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Chemist_Transit_g == "Transit") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else {
            //                arr.push(obj);
            //            }

            //        }
            //        else if (obj.Units == '') {
            //            unitsvalue = false;
            //            swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Closing == '') {
            //            unitsvalue = false;
            //            swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        } else {
            //            unitsvalue = false;
            //            swal('Please Enter Transit  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //    }
            //    else if (Chemist_Sales_Unit_g == "SALES_UNITS" || Chemist_Closing_Unit_g == "CLOSING_UNITS" || Chemist_Transit_g == "TRANSIT") {
            //        if (obj.Units != '' && Sales_Unit_g == "SALES_UNITS") {

            //            if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Chemist_Closing_Unit_g == "CLOSING_UNITS") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Chemist_Transit_g == "TRANSIT") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else {
            //                arr.push(obj);
            //            }
            //        }

            //        else if (obj.Units == '' && Chemist_Sales_Unit_g == "SALES_UNITS") {
            //            unitsvalue = false;
            //            swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Closing == '' && Chemist_Closing_Unit_g == "CLOSING_UNITS") {
            //            unitsvalue = false;
            //            swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Transit == '' && Chemist_Transit_g == "TRANSIT") {
            //            unitsvalue = false;
            //            swal('Please Enter Transit   For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            arr.push(obj);
            //        }

            //    }
            //    if (obj.Units == "") {
            //        obj.Units = 0.00;
            //    }
            //    if (obj.Closing == "") {
            //        obj.Closing = 0.00;
            //    }
            //    if (obj.Transit == "") {
            //        obj.Transit = 0.00;
            //    }
            //}
            //if (selectedEntity == "stockist") {

            //    if (Stockist_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT," || Stockist_Entity_Product_g == "SALES_UNITS,TRANSIT,CLOSING_UNITS,"
            //     || Stockist_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Stockist_Entity_Product_g == "CLOSING_UNITS,TRANSIT,SALES_UNITS,"
            //     || Stockist_Entity_Product_g == "TRANSIT,CLOSING_UNITS,SALES_UNITS," || Stockist_Entity_Product_g == "TRANSIT,SALES_UNITS,CLOSING_UNITS,"
            //     || Stockist_Entity_Product_g == "TRANSIT,CLOSING_UNITS," || Stockist_Entity_Product_g == "TRANSIT,SALES_UNITS"
            //     || Stockist_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS," || Stockist_Entity_Product_g == "CLOSING_UNITS,TRANSIT,"
            //     || Stockist_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS," || Stockist_Entity_Product_g == "SALES_UNITS,TRANSIT,"
            //     || Stockist_Entity_Product_g == "TRANSIT," || Stockist_Entity_Product_g == "SALES_UNITS," || Stockist_Entity_Product_g == "CLOSING_UNITS,") {
            //        if (obj.Units != '' && obj.Closing != '') {
            //            if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Stockist_Closing_Unit_g == "CLOSING_UNITS") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Stockist_Transit_g == "Transit") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else {
            //                arr.push(obj);
            //            }

            //        }
            //        else if (obj.Units == '') {
            //            unitsvalue = false;
            //            swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Closing == '') {
            //            unitsvalue = false;
            //            swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            unitsvalue = false;
            //            swal('Please Enter Transit  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //    }
            //    else if (Stockist_Sales_Unit_g == "SALES_UNITS" || Stockist_Closing_Unit_g == "CLOSING_UNITS" || Transit_g == "TRANSIT") {
            //        if (obj.Units != '' && Sales_Unit_g == "SALES_UNITS") {

            //            if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Stockist_Closing_Unit_g == "CLOSING_UNITS") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Stockist_Transit_g == "TRANSIT") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else {
            //                arr.push(obj);
            //            }
            //        }

            //        else if (obj.Units == '' && Stockist_Sales_Unit_g == "SALES_UNITS") {
            //            unitsvalue = false;
            //            swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Closing == '' && Stockist_Closing_Unit_g == "CLOSING_UNITS") {
            //            unitsvalue = false;
            //            swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Transit == '' && Stockist_Transit_g == "TRANSIT") {
            //            unitsvalue = false;
            //            swal('Please Enter Transit   For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            arr.push(obj);
            //        }

            //    }
            //    if (obj.Units == "") {
            //        obj.Units = 0.00;
            //    }
            //    if (obj.Closing == "") {
            //        obj.Closing = 0.00;
            //    }
            //    if (obj.Transit == "") {
            //        obj.Transit = 0.00;
            //    }
            //}
            //if (selectedEntity == "hospital") {

            //    if (Hospital_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS,TRANSIT," || Hospital_Entity_Product_g == "SALES_UNITS,TRANSIT,CLOSING_UNITS,"
            //     || Hospital_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS,TRANSIT," || Hospital_Entity_Product_g == "CLOSING_UNITS,TRANSIT,SALES_UNITS,"
            //     || Hospital_Entity_Product_g == "TRANSIT,CLOSING_UNITS,SALES_UNITS," || Hospital_Entity_Product_g == "TRANSIT,SALES_UNITS,CLOSING_UNITS,"
            //     || Hospital_Entity_Product_g == "TRANSIT,CLOSING_UNITS," || Hospital_Entity_Product_g == "TRANSIT,SALES_UNITS"
            //     || Hospital_Entity_Product_g == "CLOSING_UNITS,SALES_UNITS," || Hospital_Entity_Product_g == "CLOSING_UNITS,TRANSIT,"
            //     || Hospital_Entity_Product_g == "SALES_UNITS,CLOSING_UNITS," || Hospital_Entity_Product_g == "SALES_UNITS,TRANSIT,"
            //     || Hospital_Entity_Product_g == "TRANSIT," || Hospital_Entity_Product_g == "SALES_UNITS," || Hospital_Entity_Product_g == "CLOSING_UNITS,") {
            //        if (obj.Units != '' && obj.Closing != '') {
            //            if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Hospital_Closing_Unit_g == "CLOSING_UNITS") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Hospital_Transit_g == "Transit") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else {
            //                arr.push(obj);
            //            }

            //        }
            //        else if (obj.Units == '') {
            //            unitsvalue = false;
            //            swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Closing == '') {
            //            unitsvalue = false;
            //            swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            unitsvalue = false;
            //            swal('Please Enter Transit  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //    }
            //    else if (Hospital_Sales_Unit_g == "SALES_UNITS" || Hospital_Closing_Unit_g == "CLOSING_UNITS" || Hospital_Transit_g == "TRANSIT") {
            //        if (obj.Units != '' && Sales_Unit_g == "SALES_UNITS") {

            //            if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Units)) {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Closing) && Hospital_Closing_Unit_g == "CLOSING_UNITS") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else if (!/^\d{1,16}(\.\d{1,2})?$/.test(obj.Transit) && Hospital_Transit_g == "TRANSIT") {
            //                unitsvalue = false;
            //                swal('You have exceeded the limit for ' + obj.Product_Name, "", "info");
            //                $('#ProdUpdate').prop('disabled', false);
            //                return false;
            //            }
            //            else {
            //                arr.push(obj);
            //            }
            //        }

            //        else if (obj.Units == '' && Hospital_Sales_Unit_g == "SALES_UNITS") {
            //            unitsvalue = false;
            //            swal('Please Enter Sales Units For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Closing == '' && Hospital_Closing_Unit_g == "CLOSING_UNITS") {
            //            unitsvalue = false;
            //            swal('Please Enter Closing Units  For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else if (obj.Transit == '' && Hospital_Transit_g == "TRANSIT") {
            //            unitsvalue = false;
            //            swal('Please Enter Transit   For ' + obj.Product_Name, "", "info");
            //            $('#ProdUpdate').prop('disabled', false);
            //            return false;
            //        }
            //        else {
            //            arr.push(obj);
            //        }

            //    }
            //    if (obj.Units == "") {
            //        obj.Units = 0.00;
            //    }
            //    if (obj.Closing == "") {
            //        obj.Closing = 0.00;
            //    }
            //    if (obj.Transit == "") {
            //        obj.Transit = 0.00;
            //    }
            //}
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
              url: '../../HiDoctor_Activity/Batch/GetUpdateProductSales',
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
                      Sales.GetAllRegion();
                      $.unblockUI();
                  }
              },
              error: function (response) {
                  $('#QuantitySave').prop('disabled', false);
                  $('#ProdUpdate').prop('disabled', false);
              },
              complete: function () {
                  $.unblockUI();
              }
          });
        }
        else {
            return false;
        }


    },

}
/////////////////////////////Hospital Approval//////////////////////////////////
var RdoctorMasterFrom_g = "Master";
var ASales = {
    defaults: {
        RegionDetails: "",
        CustomerDetails: "",
        StateCity: "",
        Sales_ID: "",
        ProductDetail: "",
        SpChar: "-_.,()"
    },
    Approvalinitialize: function () {
        fnUserSelectedOption();
        ASales.GetAllRegion();
        ASales.GetStateName();
        var month_year = fnLoadMonthAndYear()
        $('#AMyear').val(month_year);
        var statementdate = fnLoadStatementDate()
        $('#SDate').val(statementdate);
        $('.Cusinput').change(function () {
            if ($('input[name="inputs"]:checked').val() == 'hospital') {
                $('#icon').html('<i class="fa fa-search" onclick=$("#SearchModel").show();></i>');
            }
            else {
                $('#icon').html('Text');
            }
            ASales.GetCustomerDetails();
        });
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
        var url = '../../HiDoctor_Activity/Batch/GetAllRegionName';
        if (isResponsive.toUpperCase() == "YES") {
            url = '../GetAllRegionName';
        }
        $.ajax(
                 {
                     type: 'POST',
                     url: url,
                     data: 'Region_Code=' + LoginRegionCode + "&subDomainName=" + subDomainName,
                     success: function (response) {
                         debugger;

                         if (response != null && response.length > 0) {

                             //Sale product autofill
                             var doc = "[";
                             for (var i = 0; i < response.length; i++) {
                                 if (i == 0) {
                                     var regioncode = response[0].Region_Code;
                                     $('#Aregionname').val(response[0].Region_Name)
                                     $('#Aregioncode').val(response[0].Region_Code)
                                 }
                                 doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "}";
                                 if (i < response.length - 1) {
                                     doc += ",";
                                 }
                             }

                             doc += "];";
                             ASales.defaults.RegionDetails = eval(doc);
                             var atcObj = new ej.dropdowns.AutoComplete({
                                 //set the data to dataSource property
                                 dataSource: eval(doc),

                                 fields: { text: 'label' },

                                 select: ASales.changefirst,
                                 focusOut: ASales.changefocusOutfirst,
                             });
                             //atcObj.destroy();
                             atcObj.appendTo('#Aregionname');
                             ASales.GetCustomerDetails();
                         }
                     },
                     error: function () {

                     }
                 });
    },
    changefirst: function (arg) {
        debugger;
        if (arg.itemData != null) {
            $("#Aregioncode").val(arg.itemData.value);
            //ASales.GetCustomerDetails();
            fnEntityProductOption();
        }
    },
    changefocusOutfirst: function () {
        debugger;
        if ($('#Aregionname').val() == '') {
            $("#Aregioncode").val('');
        }

    },
    fnGetData: function () {
        ASales.GetCustomerDetails();
    },
    GetCustomerDetails: function () {
        debugger;
        var value = $('input[name="inputs"]:checked').val();
        var RegionCode = $('#Aregioncode').val();
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
        var url = '../../HiDoctor_Activity/Batch/GetCustomerDetails';
        if (isResponsive.toUpperCase() == "YES") {
            url = '../GetCustomerDetails';
        }
        $.ajax(
          {
              type: 'POST',
              url: url,
              data: 'RegionCode=' + RegionCode + "&subDomainName=" + subDomainName + "&Value=" + value + "&SDate=" + Date + "&doctoMasterFrom=" + RdoctorMasterFrom_g + "&month=" + Month + "&year=" + Year,
              success: function (response) {
                  debugger;
                  $('#AcustomerName').val('');
                  $('#AcustomerCode').val('');
                  var drpdwnCont = [];
                  drpdwnCont += '<select name="customer" class="form-control" id="AcustomerName">';
                  if (response != null && response.length > 0) {
                      //if (isResponsive.toUpperCase() != "YES") {

                      //    //Sale product autofill
                      //    var doc = "[";
                      //    for (var i = 0; i < response.length; i++) {
                      //        doc += "{label:" + '"' + "" + response[i].CustomerName + "" + '",' + "value:" + '"' + "" + response[i].CustomerCode + '"' + "}";
                      //        if (i < response.length - 1) {
                      //            doc += ",";
                      //        }
                      //    }

                      //    doc += "];";
                      //    ASales.defaults.CustomerDetails = eval(doc);
                      //    autoComplete(ASales.defaults.CustomerDetails, "AcustomerName", "AcustomerCode", 'customer');
                      //}
                      //else {

                      drpdwnCont += '<option maxlength="25" style="text-align:left;" value="0">Please Select Entity </option>';
                      for (var i = 0; i < response.length; i++) {

                          if (response != null && response != '' & response.length > 0) {
                              for (i = 0; i < response.length; i++) {
                                  drpdwnCont += '<option maxlength="25" value="' + response[i].CustomerCode + '" style="text-align:left;">' + response[i].CustomerName + '</option>';

                                  //}
                              }
                          }
                          drpdwnCont += '</select>';
                          $('#dvEntityOption').html(drpdwnCont);

                      }

                  }
                  else {
                      var doc = "[]";
                      ASales.defaults.CustomerDetails = eval(doc);
                      $('#dvEntityOption').html(drpdwnCont);
                  }
              },
              error: function () {

              }

          });
    },
    GetStateName: function () {
        var url = '../../HiDoctor_Activity/Batch/GetStateName';
        if (isResponsive.toUpperCase() == "YES") {
            url = '../GetStateName';
        }
        $.ajax(
                 {
                     type: 'POST',
                     url: url,
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
                             ASales.defaults.StateCity = eval(doc);
                             var atcObj = new ej.dropdowns.AutoComplete({
                                 //set the data to dataSource property
                                 dataSource: eval(doc),

                                 fields: { text: 'label' },

                                 select: ASales.StateChange,
                                 focusOut: ASales.StatefocusOutfirst,
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
        var url = '../../HiDoctor_Activity/Batch/GetCityName';
        if (isResponsive.toUpperCase() == "YES") {
            url = '../GetStateName';
        }
        $.ajax(
                 {
                     type: 'POST',
                     url: url,
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

                                 select: ASales.CityChange,
                                 focusOut: ASales.CityfocusOutfirst,
                             });
                             //atcObj.destroy();
                             atcObj.appendTo('#Cityname');
                             ASales.GetCustomerDetails();
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
        var url = '../../HiDoctor_Activity/Batch/GetHospitalName';
        if (isResponsive.toUpperCase() == "YES") {
            url = '../GetHospitalName';
        }
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
        $.ajax({
            type: 'POST',
            url: url,
            data: "&subDomainName=" + subDomainName + "&StateID=" + StateID + "&CityID=" + CityID,
            success: function (response) {
                debugger;
                if (response != null && response.length > 0) {
                    var str = "";
                    str += '<table class="table table-hover" id="hospital"><thead><tr><th scope="col"></th><th scope="col">Hospital Name</th><th scope="col">Local Area</th><th scope="col">Pin Code</th></tr></thead>';
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
                    str += '<input type="button" class="btn btn-primary" id="Hospsave" value="Save" onclick="ASales.fnsavehospital()" />'
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

            EntityCode = $('#AcustomerCode').val();
        } else {
            EntityCode = $('#AcustomerName').val();
        }
        var Entity = $('input[name="inputs"]:checked').val();
        if ($('#Aregionname').val() == '') {
            swal('Please select the Region Name', "", "info");
            return false;
        }

        var lst = $.grep(ASales.defaults.RegionDetails, function (v) {
            return v.label == $('#Aregionname').val();
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
        _objData.Region_Code = $('#Aregioncode').val();
        _objData.subDomainName = subDomainName;
        var url = '../../HiDoctor_Activity/Batch/GetAllEntityDetails';
        if (isResponsive.toUpperCase() == "YES") {
            url = '../GetAllEntityDetails';
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
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Month & Year</label>';
                           str += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Month + '-' + Sales[i].Year + '</label>';
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
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">Month & Year</label>';
                           content += '<label class="col-sm-6 col-xs-6" style="padding:0px;">' + Month + '-' + Release[i].Year + '</label>';
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
                               header: { 'text': 'Entity Sales' },
                               content: str
                           },
                          {
                              header: { 'text': 'Entity Release Log' },
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
        var _objData = new Object();
        _objData.Region_Code = $('#Aregioncode').val();
        _objData.subDomainName = subDomainName;
        var url = '../../HiDoctor_Activity/Batch/GetAllEntityProduct';
        if (isResponsive.toUpperCase() == "YES") {
            url = '../GetAllEntityProduct';
        }
        $.ajax(
           {
               type: "Post",
               data: _objData,
               url: url,
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
            content += ' <table class="table table-bordered" ><thead><tr><th>Product Name</th><th class="clssales" >Sales Units</th><th class="clsclosing">Closing Units</th><th class="clsTransit">Transit</th></tr></thead>';
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
        var _objData = new Object();
        _objData.User_Code = LoginUserCode;
        _objData.subDomainName = subDomainName;
        _objData.Sales_Id = ASales.defaults.Sales_ID;
        _objData.Remark = $('#RemarkNotes').val();
        var url = '../../HiDoctor_Activity/Batch/GetEntityStatusChange';
        if (isResponsive.toUpperCase() == "YES") {
            url = '../GetEntityStatusChange';
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
            var _objData = new Object();
            _objData.User_Code = LoginUserCode;
            _objData.lstSaleEntity = releaselst;
            var url = '../../HiDoctor_Activity/Batch/GetMultipleEntityStatusChange';
            if (isResponsive.toUpperCase() == "YES") {
                url = '../GetMultipleEntityStatusChange';
            }
            $.ajax(
              {
                  type: "Post",
                  data: JSON.stringify({ "_obj": _objData }),
                  contentType: 'application/json; charset=utf-8',
                  url: url,
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
function GetConfig() {
    var Config_Key = 'ENTITY_SALES_DOCTOR_FROM';
    var Possible_Values = 'Master,Calci';
    var Config_Value = 'Master';
    var Type = 'USER';
    //var companycode = 'TEO00000010';
    var subdomain = '';
    $.ajax({
        type: 'GET',
        url: '../../HiDoctor_Activity/Batch/GetConfigMaster',
        data: "Config_Key=" + Config_Key + "&Possible_Values=" + Possible_Values + "&Config_Value=" + Config_Value + "&Type=" + Type + "&companycode=" + CompanyCode + "&subdomain=" + subDomainName,
        success: function (response) {
            debugger;
            if (response.length > 0) {
                doctorMasterFrom_g = response[0].Type
            } else {
                doctorMasterFrom_g = "Master";
            }
        }
    });
}
function hasDecimalPlace(value, x) {
    var pointIndex = value.indexOf('.');
    return pointIndex >= 0 && pointIndex < value.length - x;
}
function fnUserSelectedOption() {
    debugger;
    var defaultOptions = "HOSPITAL,DOCTOR,CHEMIST,STOCKIST";
    var dcrOptions = fnGetPrivilegeValue("ENTITY_SALES_TYPE", defaultOptions);
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


function fnEntityProductOption() {
    debugger;
    var ProductdefaultOptions = "CLOSING_UNITS,SALES_UNITS,TRANSIT";
    var DoctorProductOptions = fnGetPrivilegeValue("DOCTOR_ENTITY_SALES_PRODUCT_UNITS", ProductdefaultOptions);
    var ChemistProductOptions = fnGetPrivilegeValue("CHEMIST_ENTITY_SALES_PRODUCT_UNITS", ProductdefaultOptions);
    var StockistProductOptions = fnGetPrivilegeValue("STOCKIST_ENTITY_SALES_PRODUCT_UNITS", ProductdefaultOptions);
    var HospitalProductOptions = fnGetPrivilegeValue("HOSPITAL_ENTITY_SALES_PRODUCT_UNITS", ProductdefaultOptions);
    //var DoctorMasterFrom = fnGetPrivilegeValue("ENTITY_SALES_DOCTOR_FROM", "MASTER");
    Doctor_Entity_Product_g = DoctorProductOptions + ',';
    Chemist_Entity_Product_g = ChemistProductOptions + ',';
    Stockist_Entity_Product_g = StockistProductOptions + ',';
    Hospital_Entity_Product_g = HospitalProductOptions + ',';

    //Doctor_Master_From_g = DoctorMasterFrom + ',';
    //var DoctorMasterOptionArr = DoctorMasterFrom.split(',');
    var DoctorProductOptionsArr = DoctorProductOptions.split(',');
    var ChemistProductOptionsArr = ChemistProductOptions.split(',');
    var StockistProductOptionsArr = StockistProductOptions.split(',');
    var HospitalProductOptionsArr = HospitalProductOptions.split(',');
    //doctorMasterFrom_g = DoctorMasterFrom;
    var selectedEntity = $(".entitytype input[type=radio]:checked").val();
    if (selectedEntity == "doctor") {
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
    if (selectedEntity == "chemist") {
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
    if (selectedEntity == "stockist") {
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
    if (selectedEntity == "hospital") {
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

