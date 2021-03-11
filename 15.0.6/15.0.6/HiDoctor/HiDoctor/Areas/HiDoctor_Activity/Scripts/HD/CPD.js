var CPD = {
    defaults: {
        Accompanist: '',
        TotalProducts: '',
        MarketList: [],
        MTotaltOutlets:[],
        Products:'',
        BrightOutlet: '',
        Sample: '',
        CPDValue: '',
        InTime:'',
        EndTime: '',
        SS: '',
        SpChar: "-_.,()",
    },
    initialize: function () {
        debugger
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                CPD.GetMarketNames();

                $('#Save').click(function () {
                    if (navigator.onLine == true) {
                        var Userstatus = fnuserstatus();
                        debugger
                        if (Userstatus) {
                            CPD.defaults.CPDValue = 1;
                            $('#Save').prop('disabled', true);
                            //CPD.PunchEndTime();
                            CPD.InsertCPD();
                        }
                        else {
                            swal("Info!", "Your account has been deactivated.", "info");
                        }
                    }
                    else {
                        swal("Please connect to the internet", "", "");
                        return false;
                    }
                });
                $('#Draft').click(function () {
                    if (navigator.onLine == true) {
                        var Userstatus = fnuserstatus();
                        debugger
                        if (Userstatus) {
                            CPD.defaults.CPDValue = 0;
                            CPD.InsertCPD();
                        }
                        else {
                            swal("Info!", "Your account has been deactivated.", "info");
                        }
                    }
                    else {
                        swal("Please connect to the internet", "", "");
                        return false;
                    }
                    //}
                });
                //$("#Punch").click(function () {
                //    CPD.fnCPDPunchTime();
                //})
                //$("#punchtime").click(function () {
                //    CPD.fnCPDInsertPunchTime();
                //});
                //$("#Endpunch").click(function () {
                //    if ($('#PunchEnd') == '') {
                //        swal("Please enter End Time", "", "");
                //        return false;
                //    }
                //    CPD.defaults.EndTime = $('#PunchEnd').val();
                //    $('#Draft').prop('disabled', true);
                //    $('#Save').prop('disabled', true);
                //    CPD.InsertCPD();

                //});
                $("#Back").click(function () {
                    if (navigator.onLine == true) {
                        var Userstatus = fnuserstatus();
                        debugger
                        if (Userstatus) {
                            window.location.href = '../CPD/CPDMobile?LID=' + LID;
                        }
                        else {
                            swal("Info!", "Your account has been deactivated.", "info");
                        }
                    }
                    else {
                        swal("Please connect to the internet", "", "");
                        return false;
                    }
                });
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    //fnCPDPunchTime: function () {
    //    if ($('#MarketName').val() == '') {
    //        swal('Please Enter Store Name', "", "");
    //        return false;
    //    }
    //    var spec = CPD.fnChkSplChar('MarketName');
    //    if (spec == false) {
    //        swal("Special Characters are not allowed in  Market Name", "", "");
    //        return false;
    //    }
    //    else {
    //        $('#myModal').show();
    //        $('#punchintime').mdtimepicker();
    //    }

    //},
    GetMarketNames: function () {
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $.ajax(
           {
               type: 'POST',
               data: "Region_Code=" + LoginRegionCode + '&subDomainName=' + subDomainName,
               url: '../../HiDoctor_Activity/CPD/GetAllMarketNames',
               success: function (response) {
                   if (response.length > 0) {
                       debugger
                       var Marketname = '';
                       var Marketid = '';
                       var Totaloutlet = '';
                       var doc = "[";
                       for (var i = 0; i < response.length; i++) {
                           doc += "{label:" + '"' + "" + response[i].Market_Name + "" + '",' + "id:" + '"' + "" + response[i].Market_Id + '"' + "}";
                           if (i < response.length - 1) {
                               doc += ",";
                           }
                       }
                       doc += "];";

                       CPD.defaults.MarketList = eval(doc);
                       CPD.defaults.MTotaltOutlets = response;
                       for (var i = 0; i < response.length; i++) {
                           var marketobj = {
                               Marketid: response[i].Market_Id,
                               Marketname: response[i].Market_Name,
                               Totaloutlet: response[i].Total_Outlets
                           }
                           if (marketobj.Marketid != '') {
                               MarketHead.push(marketobj);
                           }
                       }
                   }
                   CPD.GetAllProduct();
               }
           })
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    GetAllProduct: function () {
        debugger
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $.ajax(
           {
               type: 'POST',
               data: "Region_Code=" + LoginRegionCode + '&subDomainName=' + subDomainName + '&User_Code=' + LoginUserCode + '&CPD_Date=' + CPD_Date,
               url: '../../HiDoctor_Activity/CPD/GetAllProductNames',
               success: function (response) {
                   debugger;
                   var prod = '';
                   var Brightprod = '';
                   var Shineprod = '';
                   CPD.defaults.Products = response;
                   CPD.defaults.TotalProducts = response;
                   if (response != null && response.length > 0) {
                       prod += '<div class="form-group clearfix">';
                       prod += '<label class="control-label col-sm-7 col-xs-6" name="Actprod" style="font-size: 13px;">Product Name</label>';
                       prod += '<div class="col-sm-6 col-xs-6">';
                       prod += '<label class="control-label col-sm-5 col-xs-6" style="font-size: 13px;">Value</label>';
                       prod += '</div></div>';
                       for (var i = 0; i < response.length; i++) {
                           prod += '<div class="form-group clearfix">';
                           prod += '<label class="control-label col-sm-7 col-xs-6" name="Actprod" style="font-size: 13px;" id="P_' + response[i].Product_Code + '">' + response[i].Product_Name + '</label>';
                           prod += '<div class="col-sm-6 col-xs-6" style="padding: 1px;">';
                           prod += '<input type="number" class="form-control" id="Prodvalue_' + response[i].Product_Code + '" placeholder="Value" value=0 onclick="fndelZero(this);">';
                           prod += '</div></div>';
                       }
                       $('#proddiv').html(prod);

                       Brightprod += '<div class="form-group clearfix">';
                       Brightprod += '<label class="control-label col-sm-6 col-xs-4" name="Actprod" style="font-size: 13px;">Product Name</label>';
                       Brightprod += '<div>';
                       Brightprod += '<label class="control-label col-sm-3 col-xs-4" style="font-size: 13px;">Calls</label>';
                       Brightprod += '</div>';
                       Brightprod += '<div>';
                       Brightprod += '<label class="control-label col-sm-3 col-xs-4" style="font-size: 13px;">Value</label>';
                       Brightprod += '</div></div>';
                       for (var i = 0; i < response.length; i++) {
                           debugger
                           Brightprod += '<div class="form-group clearfix">';
                           Brightprod += '<label class="control-label col-sm-6 col-xs-4" name="Brightprod" style="font-size: 13px;" id="BO_' + response[i].Product_Code + '">' + response[i].Product_Name + '</label>';
                           Brightprod += '<div class="col-sm-3 col-xs-4" style="padding: 1px;">';
                           Brightprod += '<input type="number" class="form-control" id="BProdcount_' + response[i].Product_Code + '" placeholder="Calls" value=0 onclick="fndelZero(this);">';
                           Brightprod += '</div>';
                           Brightprod += '<div class="col-sm-3 col-xs-4" style="padding: 1px;">';
                           Brightprod += '<input type="number" class="form-control" id="BProdval_' + response[i].Product_Code + '" placeholder="Value" value=0 onclick="fndelZero(this);">';
                           Brightprod += '</div></div>';
                       }
                       $('#Brightdiv').html(Brightprod);

                       Shineprod += '<div class="form-group clearfix">';
                       Shineprod += '<label class="control-label col-sm-6 col-xs-4" name="Actprod" style="font-size: 13px;">Product Name</label>';
                       Shineprod += '<div>';
                       Shineprod += '<label class="control-label col-sm-3 col-xs-4" style="font-size: 13px;">Calls</label>';
                       Shineprod += '</div>';
                       Shineprod += '<div>';
                       Shineprod += '<label class="control-label col-sm-3 col-xs-4" style="font-size: 13px;">Value</label>';
                       Shineprod += '</div></div>';
                       for (var i = 0; i < response.length; i++) {
                           debugger
                           Shineprod += '<div class="form-group clearfix">';
                           Shineprod += '<label class="control-label col-sm-6 col-xs-4" name="Shineprod" style="font-size: 13px;" id="SO_' + response[i].Product_Code + '">' + response[i].Product_Name + '</label>';
                           Shineprod += '<div class="col-sm-3 col-xs-4" style="padding: 1px;">';
                           Shineprod += '<input type="number" class="form-control" id="SProdcount_' + response[i].Product_Code + '" placeholder="Calls" value=0 onclick="fndelZero(this);">';
                           Shineprod += '</div>';
                           Shineprod += '<div class="col-sm-3 col-xs-4" style="padding: 1px;">';
                           Shineprod += '<input type="number" class="form-control" id="SProdval_' + response[i].Product_Code + '" placeholder="Value" value=0 onclick="fndelZero(this);">';
                           Shineprod += '</div></div>';
                       }
                       $('#Shinediv').html(Shineprod);
                   }
                   else {
                       prod += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="margin-left: 25px;">';
                       prod += '<label>No record found</label>';
                       prod += '</div>';
                       $('#proddiv').html(prod);
                       $('#Brightdiv').html(prod);
                       $('#Shinediv').html(prod);
                   }
               }
           })
                if (CPD_ID != 0) {
                    CPD.fngetCPDFieldDraftDetails();
                }
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    //fnCPDInsertPunchTime: function () {
    //    debugger
    //    var MarketName = $('#MarketName').val();
    //    //$("#punchtime").prop('disabled', true);
    //    Totalcalls = $('#totalcall').val();
    //    Productivecalls = $('#Prodcall').val();
    //    BrightCalls = $('#BrightCalls').val();
    //    ShineCalls = $('#ShineCalls').val();

    //    if (Totalcalls == '') {
    //        swal("Please enter Total Calls", "", "");
    //        return false;
    //    }
    //    if (Productivecalls == '') {
    //        swal("Please enter Productive Calls", "", "");
    //        return false;
    //    }
    //    if (Totalcalls != '' && Productivecalls != '') {
    //        if (Productivecalls > Totalcalls) {
    //            swal("Productive Calls should be less than or equal to Total Calls", "", "");
    //            return false;
    //        }
    //    }
    //    var punchintime = $('#punchintime').val();
    //    if (punchintime == '') {
    //        swal("Please enter Start Time", "", "");
    //        $("#punchtime").prop('disabled', false);
    //        return false;
    //    }
        
    //    var _objData = new Object();
    //    _objData.subDomainName = subDomainName;
    //    _objData.CompanyId = CompanyId;
    //    _objData.CPD_ID = CPD_ID;
    //    _objData.CPDDate = CPD_Date;
    //    _objData.User_Code = LoginUserCode;
    //    _objData.Region_Code = LoginRegionCode;
    //    _objData.InTime = punchintime;
    //    _objData.OutTime = null;
    //    _objData.StoreName = MarketName;
    //    _objData.Activity = 1;
    //    _objData.TotalCalls = ($('#totalcall').val()!="") ? $('#totalcall').val():null;
    //    _objData.Productivecalls = ($('#Prodcall').val() != "") ? $('#Prodcall').val() : null;
    //    _objData.BrightCalls = null;
    //    _objData.ShineCalls = null;
    //    if (navigator.onLine == true) {
    //        $.ajax(
    //       {
    //           type: 'POST',
    //           data: _objData,
    //           url: '../../HiDoctor_Activity/CPD/InsertFieldDraft',
    //           success: function (response) {
    //               debugger;
    //               if (response != 0) {
    //                   CPD_ID = response;
    //                   CPD.defaults.InTime = $('#punchintime').val();
    //                   $('#myModal').hide();
    //                   //$('#punchdiv').hide();
    //                   $('#starttime').show();
    //                   $('#strttime').html(CPD.defaults.InTime);
    //                   $('#Save').show();
    //                   $('#Draft').show();
    //                  // $("#punchtime").prop('disabled', true);
    //               }
    //           }, error: function () {

    //           }
    //       });
    //    }
    //    else {
    //        window.location.href = '../CPD/CPDErrorPage';
    //    }
    //},
    fnChkSplChar: function (id) {
        debugger;
        var str = $('#' + id).val();
        if (/^[a-zA-Z0-9 ]+$/.test(str) == false) {
            return false;
        }
        else {
            return true;
        }
    },
    fngetCPDFieldDraftDetails: function () {
        debugger;
        var _objData = new Object();
        _objData.CPD_ID = CPD_ID;
        _objData.subDomainName = subDomainName;
        if (navigator.onLine == true) {
            $.ajax(
                       {
                           type: 'POST',
                           data: _objData,
                           url: '../../HiDoctor_Activity/CPD/GetCPDFieldDraftDetails',
                           success: function (response) {
                               debugger;
                               var Header = response.header;
                               var Proddetails = response.Proddetails;
                               var Outlet = response.Outlet;
                               var prod = '';
                               var Brightprod = '';
                               var Shineprod = '';
                               CPD.defaults.Products = response;
                               if (Header.length > 0) {
                                   $('#Marketname').val(Header[0].Market_Name);
                                   $('#Marketid').val(Header[0].Market_Id);
                                   $('#Totaloutlet').val(Header[0].Total_Outlets);
                                   $('#totalcall').val(Header[0].Total_Calls);
                                   $('#Prodcall').val(Header[0].Productive_Calls);
                                   $('#BrightCalls').val(Header[0].Bright_Calls);
                                   $('#ShineCalls').val(Header[0].Shine_Calls);
                                   $('#Gremark').val(Header[0].GRemaks);
                                   $('#repcode').text(Header[0].Employee_Number);
                                   $('#CPDdate').html('');
                                   $('#CPDdate').html(Header[0].CPD_Date);
                                   $('#Totaloutlet').prop('disabled', true);
                               }
                               
                               if (Proddetails != null && Proddetails.length > 0) {
                                   for (var i = 0; i < Proddetails.length; i++) {
                                       $('#Prodvalue_' + Proddetails[i].Product_Code).val(Proddetails[i].Product_Value);
                                   }
                                       var bright = $.grep(Outlet, function (v) {
                                           return v.Outlet_Type == 2;
                                       })
                                       for (var i = 0; i < bright.length; i++) {
                                           debugger
                                           $('#BProdcount_' + bright[i].Product_Code).val(bright[i].Outlet_Count);
                                           $('#BProdval_' + bright[i].Product_Code).val(bright[i].Outlet_Value);
                                       }

                                       var shine = $.grep(Outlet, function (v) {
                                           return v.Outlet_Type == 1;
                                       })
                                       for (var i = 0; i < shine.length; i++) {
                                           debugger
                                           $('#SProdcount_' + shine[i].Product_Code).val(shine[i].Outlet_Count);
                                           $('#SProdval_' + shine[i].Product_Code).val(shine[i].Outlet_Value);
                                       }
                                   }
                           },
                           error: function () {

                           }
                       });
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    InsertCPD: function()
    {
        $('#Save').prop('disabled', true);
        var MarketName = $('#Marketname').val();
        Totaloutlet = $('#Totaloutlet').val();
        var result = true;
        var Product = [];
        var Brightoutlet = [];
        var Shineoutlet = [];

        if (MarketName == '') {
            $('#Save').prop('disabled', false);
            swal('Please Enter Market Name', "", "");
            return false;
        }
        if (Totaloutlet == '') {
            $('#Save').prop('disabled', false);
            swal('Please Enter Total Outlets', "", "");
            return false;
        }
        if (Totaloutlet > 999999999)
        {
            $('#Save').prop('disabled', false);
            swal('Total Outlets should not exceed 999999999', "", "");
            return false;
        }
        var spec = CPD.fnChkSplChar('MarketName');
        if (spec == false) {
            result = false;
            $('#Save').prop('disabled', false);
            swal("Special Characters are not allowed in  Market Name", "", "");
            return false;
        }
        Totalcalls = $('#totalcall').val();
        Productivecalls = $('#Prodcall').val();
        BrightCalls = $('#BrightCalls').val();
        ShineCalls = $('#ShineCalls').val();
        if (CPD.defaults.CPDValue != 0) {
            if (Totalcalls == '') {
                $('#Save').prop('disabled', false);
                swal("Please enter Total Calls", "", "");
                return false;
            }
            if (Productivecalls == '') {
                $('#Save').prop('disabled', false);
                swal("Please enter Productive Calls", "", "");
                return false;
            }
        }
        if (Totalcalls > 999999999) {
            $('#Save').prop('disabled', false);
            swal('Total calls should not exceed 999999999', "", "");
            return false;
        }
        if (Productivecalls > 999999999) {
            $('#Save').prop('disabled', false);
            swal('Productive calls should not exceed 999999999', "", "");
            return false;
        }
        if (Totalcalls != '' && Totaloutlet != '') {
            if (parseInt(Totaloutlet) < parseInt(Totalcalls)) {
                $('#Save').prop('disabled', false);
                swal("Total Outlet Calls should be greater than or equal to Total Calls", "", "");
                return false;
            }
        }
        if (Totalcalls != '' && Productivecalls != '') {
            if (parseInt(Productivecalls) > parseInt(Totalcalls)) {
                $('#Save').prop('disabled', false);
                swal("Productive Calls should be less than or equal to Total Calls", "", "");
                return false;
            }
        }
        if (CPD.defaults.CPDValue != 0) {
            if (BrightCalls == '') {
                $('#Save').prop('disabled', false);
                swal("Please enter Bright Calls", "", "");
                return false;
            }
            if (ShineCalls == '') {
                $('#Save').prop('disabled', false);
                swal("Please enter Shine Calls", "", "");
                return false;
            }
        }
        if (BrightCalls != '' && ShineCalls != '') {
            SumofCalls = parseInt(BrightCalls) + parseInt(ShineCalls);
            if (parseInt(SumofCalls) > parseInt(Productivecalls)) {
                $('#Save').prop('disabled', false);
                swal("Sum of Bright and Shine Outlets should be less than or equal to Productive Calls", "", "");
                return false;
            }
        }
        for (var i = 0; i < CPD.defaults.TotalProducts.length; i++) {
            var name = CPD.defaults.TotalProducts[i].Product_Name;
            var Value = '0.0';
            if ($('#Prodvalue_' + CPD.defaults.TotalProducts[i].Product_Code).val() != '') {
                if (!/^\d{1,9}(\.\d{1,2})?$/.test($('#Prodvalue_' + CPD.defaults.TotalProducts[i].Product_Code).val())) {
                    $('#Save').prop('disabled', false);
                    swal("You have exceeded the limit of " + name + " in Value", "", "");
                    return false;
                }
                else {
                    Value = $('#Prodvalue_' + CPD.defaults.TotalProducts[i].Product_Code).val();
                }
            }
            else
            {
                $('#Save').prop('disabled', false);
                swal("Please enter the value of " + name, "", "");
                return false;
            }
            var Prod = {
                "Product_Code":CPD.defaults.TotalProducts[i].Product_Code,
                "Product_Value": Value,
            }
            Product.push(Prod);
        }
        for (var i = 0; i < CPD.defaults.TotalProducts.length; i++) {
             
            var name = CPD.defaults.TotalProducts[i].Product_Name;
            var Value = '0.0';
            var Count = 0;
            if (parseInt($('#BProdcount_' + CPD.defaults.TotalProducts[i].Product_Code).val()) > parseInt(BrightCalls)) {
                $('#Save').prop('disabled', false);
                swal("Calls should not exceed Bright Outlets Calls", "", "");
                return false;
            }
            if ($('#BProdcount_' + CPD.defaults.TotalProducts[i].Product_Code).val() != '') {
                Count = $('#BProdcount_' + CPD.defaults.TotalProducts[i].Product_Code).val();
            }
            else {
                $('#Save').prop('disabled', false);
                swal('Please enter the Bright Calls of ' + name, "", "");
                return false;
            }
            if ($('#BProdval_' + CPD.defaults.TotalProducts[i].Product_Code).val() != '') {
                if (!/^\d{1,9}(\.\d{1,2})?$/.test($('#BProdval_' + CPD.defaults.TotalProducts[i].Product_Code).val())) {
                    $('#Save').prop('disabled', false);
                    swal('You have exceeded the limit of ' + name + ' in Value', "", "");
                    return false;
                }
                else {
                    Value = $('#BProdval_' + CPD.defaults.TotalProducts[i].Product_Code).val();
                }
            }
            else {
                $('#Save').prop('disabled', false);
                swal('Please enter the Bright value of ' + name, "", "");
                return false;
            }
            var Bright = {
                "Outlet_Type":2,
                "Product_Code": CPD.defaults.TotalProducts[i].Product_Code,
                "Outlet_Count": Count,
                "Outlet_Value": Value,
            }
            Brightoutlet.push(Bright);
        }
        for (var i = 0; i < CPD.defaults.TotalProducts.length; i++) {
            
            var name = CPD.defaults.TotalProducts[i].Product_Name;
            var Value = '0.0';
            var Count = 0;
            if (parseInt($('#SProdcount_' + CPD.defaults.TotalProducts[i].Product_Code).val()) > parseInt(ShineCalls)) {
                $('#Save').prop('disabled', false);
                swal("Calls should not exceed Shine Outlets Calls", "", "");
                return false;
            }
            if ($('#SProdcount_' + CPD.defaults.TotalProducts[i].Product_Code).val() != '') {
                Count = $('#SProdcount_' + CPD.defaults.TotalProducts[i].Product_Code).val();
            }
            else {
                $('#Save').prop('disabled', false);
                swal('Please enter the Shine Calls of ' + name, "", "");
                return false;
            }
            if ($('#SProdval_' + CPD.defaults.TotalProducts[i].Product_Code).val() != '') {
                if (!/^\d{1,9}(\.\d{1,2})?$/.test($('#SProdval_' + CPD.defaults.TotalProducts[i].Product_Code).val())) {
                    $('#Save').prop('disabled', false);
                    swal('You have exceeded the limit of ' + name + ' in Value', "", "");
                    return false;
                }
                else {
                    Value = $('#SProdval_' + CPD.defaults.TotalProducts[i].Product_Code).val();
                }
            }
            else {
                $('#Save').prop('disabled', false);
                swal('Please enter the Shine value of ' + name, "", "");
                return false;
            }
            var Shine = {
                "Outlet_Type": 1,
                "Product_Code": CPD.defaults.TotalProducts[i].Product_Code,
                "Outlet_Count": Count,
                "Outlet_Value": Value,
            }
            Shineoutlet.push(Shine);
        }
        for (var i = 0; i < CPD.defaults.TotalProducts.length; i++) {
           
            var prod='#BO_' + CPD.defaults.TotalProducts[i].Product_Code;
            var BProductCode = prod.split("_")[1];
            var prod='#SO_' + CPD.defaults.TotalProducts[i].Product_Code;
            var SProductCode = prod.split("_")[1];

            var Prodval = $.grep(CPD.defaults.TotalProducts, function (v) {
                return v.Product_Code == BProductCode && v.Product_Code == SProductCode;
            })
            if (Prodval.length == 1) {
                var Prodname = $('#BO_' + CPD.defaults.TotalProducts[i].Product_Code).text();
                ProdValue = $('#Prodvalue_' + CPD.defaults.TotalProducts[i].Product_Code).val();
                BrightValue = $('#BProdval_' + CPD.defaults.TotalProducts[i].Product_Code).val();
                ShineValue = $('#SProdval_' + CPD.defaults.TotalProducts[i].Product_Code).val();
                TotalValue = parseFloat(BrightValue) + parseFloat(ShineValue);
                if (TotalValue > ProdValue) {
                    $('#Save').prop('disabled', false);
                    swal("Sum of Bright and Shine value of " + Prodname + " should be less than or equal to Product value of " + Prodname , "", "");
                    return false;
                }
            }
        }
        //if (CPD.defaults.CPDValue == 1) {
        //    if ($('#PunchEnd').val() == '') {
        //        swal('Please Enter End Time', "", "");
        //        result = false;
        //        $('#Draft').prop('disabled', false);
        //        $('#Save').prop('disabled', false);
        //        return false;
        //    }
        //    if (Date.parse("2001/01/01 " + CPD.defaults.InTime) > Date.parse("2001/01/01 " + CPD.defaults.EndTime)) {
        //        swal('End time should be greater than Start time ' + CPD.defaults.InTime + '.', "", "");
        //        result = false;
        //        $('#Draft').prop('disabled', false);
        //        $('#Save').prop('disabled', false);
        //        return false;
        //    }
        //}

        var GMRemark = CPD.fnReChkSplChar('Gremark');
        if (GMRemark == false) {
            $('#Save').prop('disabled', false);
            swal('Special characters are not allowed in remarks except - _ . , ( ) ', "", "");
            return false;
        }
        if (result == true) {
            if (navigator.onLine == true) {
                var Userstatus = fnuserstatus();
                debugger
                if (Userstatus) {
                    var GRemaks = $('#Gremark').val();
                    var _objData = new Object();
                    _objData.subDomainName = subDomainName;
                    _objData.CompanyId = CompanyId;
                    _objData.Region_Code = LoginRegionCode;
                    _objData.User_Code = LoginUserCode;
                    _objData.CPDDate = CPD_Date;
                    _objData.CPD_ID = CPD_ID;
                    _objData.Activity = 1;
                    _objData.MarketName = MarketName;
                    _objData.MarketID = MarketID;
                    _objData.Totaloutlets = Totaloutlet;
                    _objData.Totalcalls = (Totalcalls == '' ? null : Totalcalls);
                    _objData.Productivecalls = (Productivecalls == '' ? null : Productivecalls);
                    _objData.BrightCalls = (BrightCalls == '' ? null : BrightCalls);
                    _objData.ShineCalls = (ShineCalls == '' ? null : ShineCalls);
                    _objData.ProdDetails = JSON.stringify(Product);
                    _objData.Brightoutlet = JSON.stringify(Brightoutlet);
                    _objData.Shineoutlet = JSON.stringify(Shineoutlet);
                    _objData.GRemaks = GRemaks;
                    //_objData.OutTime = $('#PunchEnd').val() == '' ? null : $('#PunchEnd').val();
                    _objData.CPDValue = CPD.defaults.CPDValue;


                    $.ajax({
                        type: 'POST',
                        data: _objData,
                        url: '../../HiDoctor_Activity/CPD/InsertFieldDetails',
                        success: function (response) {
                            debugger;
                            if (response == 1) {
                                swal({
                                    title: "Field Activity Saved Successfully",
                                    showCancelButton: false,
                                    closeOnConfirm: false,
                                }, function (inputValue) {
                                    if (inputValue === false) return false;
                                    window.location.href = '../CPD/CPDMobile?LID=' + LID;
                                });
                                $('#Save').prop('disabled', false);
                                //$('#Draft').prop('disabled', false);
                                //$('#Save').prop('disabled', false);
                            }
                        },
                        error: function () {

                        }
                    });
                }
                else {
                    swal("Info!", "Your account has been deactivated.", "info");
                }
            }
            else {
                $('#Save').prop('disabled', false);
                swal("Please connect to the internet", "", "");
                return false;
            }

        }
    },
    fnReChkSplChar: function (id) {
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
    PunchEndTime: function () {
        $('#PunchEndTime').show();
        $('#PunchEnd').mdtimepicker();
    },
}
