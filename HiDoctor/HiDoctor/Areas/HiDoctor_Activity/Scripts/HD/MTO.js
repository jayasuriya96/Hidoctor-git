///////////////////Created By:S.Manju //////////////////
/////////////////// ON:25-10-2018 ////////////////////
var MTO = {
    defaults: {
        AddAcc: 0,
        AddCus: 0,
        AddSales: 0,
        AddSamples: 0,
        Accompanist: '',
        Sales: '',
        Sample: '',
        ProductSales: '',
        ProductSample: '',
        MTOValue: '',
        EndTime: '',
        SS: '',
        InTime: '',
        SpChar: "-_.,()",
    },
    initialize: function () {
        if (navigator.onLine == true) {
            MTO.fnAccompanistDetails();
            if (MTO_ID == 0) {
                MTO.GetAllProduct();
            }
            else {
                MTO.fngetMTOFieldDraftDetails();
            }

            $('#Save').click(function () {
                if (navigator.onLine == true) {
                    var Userstatus = fnuserstatus();
                    if (Userstatus) {
                        MTO.defaults.MTOValue = 1;
                        MTO.PunchEndTime();
                    }
                    else {
                        swal("", "Your account has been deactivated.", "");
                        return false;
                    }
                }
                else {
                    swal("", "Please connect to the internet.", "");
                    return false;
                }
            });
            $('#Draft').click(function () {
                if (navigator.onLine == true) {
                    var Userstatus = fnuserstatus();
                    if (Userstatus) {
                        MTO.defaults.MTOValue = 0;
                        if (MTO_ID == 0 && $('#punchintime').val() == '') {
                            swal("", "Please enter Punch Start Time", "");
                            return false;
                        }
                        else {
                            //$('#Draft').prop('disabled', true);
                            //$('#Save').prop('disabled', true);
                            MTO.fnAttachmentcheck();
                        }
                    }
                    else {
                        swal("", "Your account has been deactivated.", "");
                        return false;
                    }
                }
                else {
                    swal("", "Please connect to the internet.", "");
                    return false;
                }
            });
            $("#Punch").click(function () {
                if (navigator.onLine == true) {
                    var Userstatus = fnuserstatus();
                    if (Userstatus) {
                        MTO.fnMTOPunchTime();
                    }
                    else {
                        swal("", "Your account has been deactivated.", "");
                        return false;
                    }
                }
                else {
                    swal("", "Please connect to the internet.", "");
                    return false;
                }
            })
            $("#punchtime").click(function () {
                MTO.fnMTOInsertPunchTime();
            });
            $("#Endpunch").click(function () {
                if (navigator.onLine == true) {
                    var Userstatus = fnuserstatus();
                    if (Userstatus) {
                        if ($('#PunchEnd') == '') {
                            swal("", "Please enter End Time", "");
                            return false;
                        }
                        MTO.fnAttachmentcheck();
                        
                    }
                    else {
                        swal("", "Your account has been deactivated.", "");
                        return false;
                    }
                }
                else {
                    swal("", "Please connect to the internet.", "");
                    return false;
                }
            });
            $("#Back").click(function () {
                if (navigator.onLine == true) {
                    var Userstatus = fnuserstatus();
                    if (Userstatus) {
                        window.location.href = '../MTO/MTOMobile?Lid=' + Lid;
                    }
                    else {
                        swal("", "Your account has been deactivated.", "");
                        return false;
                    }
                }
                else {
                    swal("", "Please connect to the internet.", "");
                    return false;
                }
            });
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
    fnAddAccompanist: function () {
        $('#Add_' + MTO.defaults.AddAcc).html('');
        $('#Add_' + MTO.defaults.AddAcc).html('<button type="button" class="btn btn-danger" id="AddAcc_' + MTO.defaults.AddAcc + '" onclick=" MTO.fnRemoveAccompanist(this);">Remove</button>');
        MTO.defaults.AddAcc = MTO.defaults.AddAcc + 1;
        var str = '';
        //$('.Add').removeClass('btn btn-info');
        //$('.Add').addClass('btn btn-danger');
        str += '<div class="panel panel-default" id="Acc_' + MTO.defaults.AddAcc + '">';
        str += '<div class="panel-body">';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix">';
        str += '<input class="form-control" name="accompanist" type="text" id="Accomp_' + MTO.defaults.AddAcc + '" placeholder="Accompanist">';
        str += '<input class="form-control" type="hidden" id="AccompCode_' + MTO.defaults.AddAcc + '">';
        str += ' </div>';
        str += ' <div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix">';
        str += '<div class="col-lg-6 col-md-6 col-xs-6 clearfix">';
        str += '<input class="form-control" type="text" id="Starttime_' + MTO.defaults.AddAcc + '" placeholder="Start Time">';
        str += '</div>';
        str += '<div class="col-lg-6 col-md-6 col-xs-6 clearfix">';
        str += '<input class="form-control" type="text" id="Endtime_' + MTO.defaults.AddAcc + '" placeholder="End Time">';
        str += '</div>';
        str += '</div>';
        str += '<div class="col-lg-12 col-md-12 col-xs-12 clearfix" id="Add_' + MTO.defaults.AddAcc + '" style="text-align:center">';
        str += '<button type="button" class="btn btn-info" id="AddAcc_' + MTO.defaults.AddAcc + '" onclick=" MTO.fnAddAccompanist();">ADD</button>';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        $('#ADDAccompanist').append(str);
        $('#Starttime_' + MTO.defaults.AddAcc).mdtimepicker();
        $('#Endtime_' + MTO.defaults.AddAcc).mdtimepicker();
    },
    fnRemoveAccompanist: function (val) {
        debugger;
        var remove = $("#" + val.id).parent().parent().parent().attr('id');
        $('#' + remove).remove();
    },
    fnAddCustomerDetails: function () {

        $('#AddC_' + MTO.defaults.AddCus).html('');
        $('#AddC_' + MTO.defaults.AddCus).html('<button type="button" class="btn btn-danger" id="AddC_' + MTO.defaults.AddCus + '" onclick=" MTO.fnRemoveCustomer(this);">Remove</button>');
        MTO.defaults.AddCus = MTO.defaults.AddCus + 1;
        var str = '';
        str += '<div class="col-lg-12 col-md-12 col-xs-12 clearfix" id="CustomerD_' + MTO.defaults.AddCus + '" style="padding:0px;">';
        str += '<div class="panel panel-default Customer">';
        str += '<div class="panel-body clearfix">';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix">';
        str += ' <input class="form-control" type="text" id="cusname" placeholder="Customer Name">';
        str += '</div>';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix">';
        str += '<input class="form-control" type="number" id="MobileNum" placeholder="Mobile Number" >';
        str += '</div>';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;" id="cusSalesPro">';
        str += '<label>Sales</label>';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;" id="cusSalesPro_' + MTO.defaults.AddCus + '_' + MTO.defaults.AddSales + '">';
        str += '<div class="col-lg-6 col-md-6 col-xs-6 clearfix" style="padding:0px;">';
        str += '<input class="form-control" type="text" id="productSales" name="ProdSales" placeholder="Sales Name">';
        str += '<input class="form-control" type="hidden" id="SalesCode">';
        str += '</div>';
        str += '<div class="col-lg-4 col-md-4 col-xs-4 clearfix">';
        str += '<input class="form-control" type="numeric" id="salesquality" placeholder="Quantity" min=0>';
        str += '</div>';
        str += '<div class="col-lg-2 col-md-2 col-xs-2 clearfix" style="">';
        str += '<span class="Salespluse" id="SAdd_' + MTO.defaults.AddCus + '_' + MTO.defaults.AddSales + '"><i class="fa fa-plus AddSales" onclick="MTO.fnAddSales(' + MTO.defaults.AddCus + ');"></i></span>';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;" id="cusSamplePro">';
        str += '<label>Sample</label>';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;" id="cusSamplePro_' + MTO.defaults.AddCus + '_' + MTO.defaults.AddSamples + '">';
        str += '<div class="col-lg-6 col-md-6 col-xs-6 clearfix" style="padding:0px;">';
        str += '<input class="form-control" type="text" id="productSample" name="ProdSample" placeholder="Sample Name">';
        str += '<input class="form-control" type="hidden" id="SampleCode">';
        str += '</div>';
        str += '<div class="col-lg-4 col-md-4 col-xs-4 clearfix">';
        str += '<input class="form-control" type="numeric" id="samplequality" placeholder="Quantity" min=0>';
        str += '</div>';
        str += '<div class="col-lg-2 col-md-2 col-xs-2 clearfix" style="">';
        str += '<span class="Samplepluse" id="SPAdd_' + MTO.defaults.AddCus + '_' + MTO.defaults.AddSamples + '"><i class="fa fa-plus AddSample" onclick="MTO.fnAddSamples(' + MTO.defaults.AddCus + ');"></i></span>';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix">';
        str += '<label>Remarks</label>';
        str += '<div class="col-sm-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
        str += '<textarea class="form-control" cols="25" rows="3" id="remark" maxlength="300"></textarea>';
        str += '</div>';
        str += '</div>';
        str += '<div class="col-lg-12 col-md-12 col-xs-12 clearfix" id="AddC_' + MTO.defaults.AddCus + '" style="text-align:center">';
        str += '<button type="button" class="btn btn-info" id="AddCus_' + MTO.defaults.AddCus + '" onclick="MTO.fnAddCustomerDetails();">ADD</button>';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        $('#CustomerDetails').append(str);
    },
    fnRemoveCustomer: function (val) {
        debugger;
        var remove = $("#" + val.id).parent().parent().parent().attr('id');
        $('#' + remove).remove();
    },
    fnAddSales: function (val) {
        debugger;
        var str = '';
        $('#CustomerD_' + val + ' .Salespluse').html('<i class="fa fa-trash DeleteSales" id="remove"></i>');
        MTO.defaults.AddSales = MTO.defaults.AddSales + 1;
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;" id="cusSalesPro_' + val + '_' + MTO.defaults.AddSales + '">';
        str += '<div class="col-lg-6 col-md-6 col-xs-6 clearfix" style="padding:0px;">';
        str += '<input class="form-control" type="text" id="productSales" name="ProdSales" placeholder="Sales Name">';
        str += '<input class="form-control" type="hidden" id="SalesCode">';
        str += '</div>';
        str += '<div class="col-lg-4 col-md-4 col-xs-4 clearfix">';
        str += '<input class="form-control" type="numeric" id="salesquality" placeholder="Quantity" min=0>';
        str += '</div>';
        str += '<div class="col-lg-2 col-md-2 col-xs-2 clearfix" style="">';
        str += '<span class="Salespluse" id="SAdd_' + val + '_' + MTO.defaults.AddSales + '"><i class="fa fa-plus AddSales" onclick="MTO.fnAddSales(' + val + ');"></i></span>';
        str += '</div>';
        str += '</div>';
        $('#CustomerD_' + val + ' #cusSalesPro').append(str);
        var trigger = $('#CustomerD_' + val + ' .Salespluse #remove');
        trigger.click(function () {
            MTO.fnRemove($(this));
        })
    },
    fnRemove: function (id) {
        debugger;
        id.parent().parent().parent().remove();
    },
    fnAddSamples: function (val) {
        debugger;
        MTO.defaults.AddSamples = MTO.defaults.AddSamples + 1;
        $('#CustomerD_' + val + ' .Samplepluse').html('<i id="Sampremove" class="fa fa-trash DeleteSample"></i>');
        var str = '';
        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;" id="cusSamplePro_' + val + '_' + MTO.defaults.AddSamples + '">';
        str += '<div class="col-lg-6 col-md-6 col-xs-6 clearfix" style="padding:0px;">';
        str += '<input class="form-control" type="text" id="productSample" name="ProdSample" placeholder="Sample Name">';
        str += '<input class="form-control" type="hidden" id="SampleCode">';
        str += '</div>';
        str += '<div class="col-lg-4 col-md-4 col-xs-4 clearfix">';
        str += '<input class="form-control" type="numeric" id="samplequality" placeholder="Quantity" min=0>';
        str += '</div>';
        str += '<div class="col-lg-2 col-md-2 col-xs-2 clearfix" style="">';
        str += '<span class="Samplepluse" id="SPAdd_' + val + '_' + MTO.defaults.AddSamples + '"><i class="fa fa-plus AddSample" onclick="MTO.fnAddSamples(' + val + ');"></i></span>';
        str += '</div>';
        str += '</div>';
        $('#CustomerD_' + val + ' #cusSamplePro').append(str);
        var trigger = $('#CustomerD_' + val + ' .Samplepluse #Sampremove');
        trigger.click(function () {
            MTO.fnRemove($(this));
        })
    },
    GetAllProduct: function () {
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $.ajax(
                           {
                               type: 'POST',
                               data: "Region_Code=" + LoginRegionCode + '&subDomainName=' + subDomainName + '&User_Code=' + LoginUserCode,
                               url: '../../HiDoctor_Activity/MTO/GetAllProductName',
                               success: function (response) {
                                   debugger;
                                   var content = '', str = '';
                                   var Product = response.Prod;
                                   var Sample = response.Sample;
                                   MTO.defaults.ProductSales = Product;
                                   MTO.defaults.ProductSample = Sample;
                                   if (Product != null && Product.length > 0) {
                                       var doc = "[";
                                       for (var i = 0; i < Product.length; i++) {
                                           //////////////Autcomplete
                                           doc += "{label:" + '"' + "" + Product[i].Product_Name + "" + '",' + "id:" + '"' + "" + Product[i].Product_Code + '"' + "}";
                                           if (i < Product.length - 1) {
                                               doc += ",";
                                           }
                                           ///////////////////////
                                           if (i == 0) {
                                               content += '<div class="Cuspanel panel-default clearfix " style="margin-top: 16px;" id="Sales_' + Product[i].Product_Code + '">';
                                           }
                                           else {
                                               content += '<div class="Cuspanel panel-default clearfix " id="Sales_' + Product[i].Product_Code + '">';
                                           }
                                           content += '<div class="panel-heading collapsebatchs togglebatch" id="collap_' + Product[i].Product_Code + '" onclick=MTO.fntoogleProduct("' + Product[i].Product_Code + '") >';
                                           content += '<span><label class="container">' + Product[i].Product_Name + '<input id="Sales_' + Product[i].Product_Code + '" type="checkbox" name="sales"><span class="checkmark" onclick=MTO.fntoogleProductcheck("' + Product[i].Product_Code + '")></span></label>';
                                           //<span >Product Name : ' + Product[i].Product_Name + '</span>';
                                           content += '<span class="badge"></span></span>';
                                           content += '</div>';

                                           content += '<div class="col-md-12 clearfix collapse" id="openProd_' + Product[i].Product_Code + '"  style="padding:0px;">';
                                           content += "<div class='col-md-12 clearfix' style='cursor:pointer;padding:0px;'>";
                                           content += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                                           content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SAOpening_' + Product[i].Product_Code + '" placeholder="Opening" min="0"></div>';
                                           content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SARecepit_' + Product[i].Product_Code + '" placeholder="Receipt" min="0"></div>';
                                           content += "</div>";
                                           content += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                                           content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SASales_' + Product[i].Product_Code + '" placeholder="Sales" min="0"></div>';
                                           content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control" type="number" id="SAClosing_' + Product[i].Product_Code + '" placeholder="Closing" readonly ></div>';
                                           content += "</div>";
                                           content += "</div>";
                                           content += "<hr>";
                                           content += '</div>'
                                           content += '</div>';
                                       }
                                       doc += "];";
                                       MTO.defaults.Sales = eval(doc);
                                   }

                                   if (Sample != null && Sample.length > 0) {
                                       var doc2 = "[";
                                       for (var i = 0; i < Sample.length; i++) {
                                           //////////////Autcomplete
                                           doc2 += "{label:" + '"' + "" + Sample[i].Product_Name + "" + '",' + "id:" + '"' + "" + Sample[i].Product_Code + '"' + "}";
                                           if (i < Sample.length - 1) {
                                               doc2 += ",";
                                           }
                                           ///////////////////////
                                           if (i == 0) {
                                               str += '<div class="Cuspanel panel-default clearfix" style="margin-top: 16px;" id="Samples_' + Sample[i].Product_Code + '">';
                                           }
                                           else {
                                               str += '<div class="Cuspanel panel-default clearfix" id="Samples_' + Sample[i].Product_Code + '">';
                                           }
                                           str += '<div class="panel-headingsample collapsebatchs togglebatch" id="collap_' + Sample[i].Product_Code + '" onclick=MTO.fntoogleSample("' + Sample[i].Product_Code + '") >';
                                           str += '<span><label class="container">' + Sample[i].Product_Name + '<input id="Sample_' + Sample[i].Product_Code + '" type="checkbox" name="sample"><span onclick=MTO.fntoogleSampleCheck("' + Sample[i].Product_Code + '") class="checkmark"></span></label>';
                                           //<span >Product Name : ' + Sample[i].Product_Name + '</span>';
                                           str += '<span class="badge"></span></span></div>';
                                           str += '<div class="col-md-12 clearfix collapse" id="openSample_' + Sample[i].Product_Code + '"  style="padding:0px;">';
                                           str += "<div class='col-md-12 clearfix' style='cursor:pointer;padding:0px;'>";
                                           str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                                           str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix" ><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPOpening_' + Sample[i].Product_Code + '" placeholder="Opening" min="0"></div>';
                                           str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPRecepit_' + Sample[i].Product_Code + '" placeholder="Receipt" min="0"></div>';
                                           str += "</div>";
                                           str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                                           str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPSales_' + Sample[i].Product_Code + '" placeholder="Sales" min="0"></div>';
                                           str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control" type="number" id="SPClosing_' + Sample[i].Product_Code + '" placeholder="Closing" readonly></div>';
                                           str += "</div>";
                                           str += "</div>";
                                           str += "<hr>";
                                           str += '</div></div>'
                                       }
                                       doc2 += "];";
                                       MTO.defaults.Sample = eval(doc2);
                                   }
                                   var tabObj = new ej.navigations.Tab({
                                       animation: { prev: {}, next: {} },
                                       items: [
                                   {
                                       header: { 'text': 'Sales' },
                                       content: content
                                   },
                                   {
                                       header: { 'text': 'Samples' },
                                       content: str
                                   }
                                       ]
                                   });


                                   tabObj.appendTo('#proddiv');
                                   if (MTO_ID != 0) {
                                       $('#punchdiv').hide();
                                       //  MTO.fngetMTOFieldDraftDetails()
                                   }
                                   $('html,body').animate({
                                       scrollTop: $("#first").offset().top
                                   },
                                     'slow');
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
            swal("", "Please connect to the internet.", "");
            return false;
        }

    },
    GetAllDraftProduct: function () {
        if (navigator.onLine == true) {
            $.ajax(
    {
        type: 'POST',
        data: "Region_Code=" + LoginRegionCode + '&subDomainName=' + subDomainName + '&User_Code=' + LoginUserCode,
        url: '../../HiDoctor_Activity/MTO/GetAllProductName',
        success: function (response) {
            debugger;
            var content = '', str = '';
            var Product = response.Prod;
            var Sample = response.Sample;
            MTO.defaults.ProductSales = Product;
            MTO.defaults.ProductSample = Sample;
            var Sales = $.grep(MTO.defaults.SS, function (v) {
                return v.Entity == 'Sales'
            })
            var DraSample = $.grep(MTO.defaults.SS, function (v) {
                return v.Entity == 'Sample'
            })
            if (Product != null && Product.length > 0) {
                var doc = "[";
                for (var i = 0; i < Product.length; i++) {
                    //////////////Autcomplete
                    doc += "{label:" + '"' + "" + Product[i].Product_Name + "" + '",' + "id:" + '"' + "" + Product[i].Product_Code + '"' + "}";
                    if (i < Product.length - 1) {
                        doc += ",";
                    }
                    ///////////////////////
                    if (i == 0) {
                        content += '<div class="Cuspanel panel-default clearfix " style="margin-top: 16px;" id="Sales_' + Product[i].Product_Code + '">';
                    }
                    else {
                        content += '<div class="Cuspanel panel-default clearfix " id="Sales_' + Product[i].Product_Code + '">';
                    }
                    content += '<div class="panel-heading collapsebatchs togglebatch" id="collap_' + Product[i].Product_Code + '" onclick=MTO.fntoogleProduct("' + Product[i].Product_Code + '") >';
                    var lstsales = $.grep(Sales, function (v) {
                        return v.Product_Code == Product[i].Product_Code
                    })
                    if (lstsales.length == 1) {
                        content += '<span><label class="container">' + Product[i].Product_Name + '<input id="Sales_' + Product[i].Product_Code + '" type="checkbox" name="sales" checked><span class="checkmark" onclick=MTO.fntoogleProductcheck("' + Product[i].Product_Code + '")></span></label>';
                        //<span >Product Name : ' + Product[i].Product_Name + '</span>';
                        content += '<span class="badge"></span></span>';
                        content += '</div>';

                        content += '<div class="col-md-12 clearfix collapse" id="openProd_' + Product[i].Product_Code + '"  style="padding:0px;">';
                        content += "<div class='col-md-12 clearfix' style='cursor:pointer;padding:0px;'>";
                        content += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                        content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SAOpening_' + Product[i].Product_Code + '" placeholder="Opening" value="' + lstsales[0].Opening + '" min="0"></div>';
                        content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SARecepit_' + Product[i].Product_Code + '" placeholder="Receipt" value="' + lstsales[0].Receipt + '" min="0"></div>';
                        content += "</div>";
                        content += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                        content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SASales_' + Product[i].Product_Code + '" placeholder="Sales" value="' + lstsales[0].Sales + '" min="0"></div>';
                        content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control" type="number" id="SAClosing_' + Product[i].Product_Code + '" placeholder="Closing" value="' + lstsales[0].Closing + '" readonly ></div>';
                    }
                    else {
                        content += '<span><label class="container">' + Product[i].Product_Name + '<input id="Sales_' + Product[i].Product_Code + '" type="checkbox" name="sales"><span class="checkmark" onclick=MTO.fntoogleProductcheck("' + Product[i].Product_Code + '")></span></label>';
                        //<span >Product Name : ' + Product[i].Product_Name + '</span>';
                        content += '<span class="badge"></span></span>';
                        content += '</div>';

                        content += '<div class="col-md-12 clearfix collapse" id="openProd_' + Product[i].Product_Code + '"  style="padding:0px;">';
                        content += "<div class='col-md-12 clearfix' style='cursor:pointer;padding:0px;'>";
                        content += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                        content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SAOpening_' + Product[i].Product_Code + '" placeholder="Opening" min="0"></div>';
                        content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SARecepit_' + Product[i].Product_Code + '" placeholder="Receipt" min="0"></div>';
                        content += "</div>";
                        content += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                        content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculate("' + Product[i].Product_Code + '") id="SASales_' + Product[i].Product_Code + '" placeholder="Sales" min="0"></div>';
                        content += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control" type="number" id="SAClosing_' + Product[i].Product_Code + '" placeholder="Closing" readonly ></div>';
                    }

                    content += "</div>";
                    content += "</div>";
                    content += "<hr>";
                    content += '</div>'
                    content += '</div>';
                }
                doc += "];";
                MTO.defaults.Sales = eval(doc);
            }

            if (Sample != null && Sample.length > 0) {
                var doc2 = "[";
                for (var i = 0; i < Sample.length; i++) {
                    //////////////Autcomplete
                    doc2 += "{label:" + '"' + "" + Sample[i].Product_Name + "" + '",' + "id:" + '"' + "" + Sample[i].Product_Code + '"' + "}";
                    if (i < Sample.length - 1) {
                        doc2 += ",";
                    }
                    ///////////////////////
                    if (i == 0) {
                        str += '<div class="Cuspanel panel-default clearfix" style="margin-top: 16px;" id="Samples_' + Sample[i].Product_Code + '">';
                    }
                    else {
                        str += '<div class="Cuspanel panel-default clearfix" id="Samples_' + Sample[i].Product_Code + '">';
                    }
                    str += '<div class="panel-headingsample collapsebatchs togglebatch" id="collap_' + Sample[i].Product_Code + '" onclick=MTO.fntoogleSample("' + Sample[i].Product_Code + '") >';
                    var lstsample = $.grep(DraSample, function (v) {
                        return v.Product_Code == Sample[i].Product_Code
                    });
                    if (lstsample.length == 1) {
                        str += '<span><label class="container">' + Sample[i].Product_Name + '<input id="Sample_' + Sample[i].Product_Code + '" type="checkbox"  name="sample" checked><span onclick=MTO.fntoogleSampleCheck("' + Sample[i].Product_Code + '") class="checkmark"></span></label>';
                        //<span >Product Name : ' + Sample[i].Product_Name + '</span>';
                        str += '<span class="badge"></span></span></div>';
                        str += '<div class="col-md-12 clearfix collapse" id="openSample_' + Sample[i].Product_Code + '"  style="padding:0px;">';
                        str += "<div class='col-md-12 clearfix' style='cursor:pointer;padding:0px;'>";
                        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                        str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix" ><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPOpening_' + Sample[i].Product_Code + '" placeholder="Opening" value="' + lstsample[0].Opening + '" min="0"></div>';
                        str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPRecepit_' + Sample[i].Product_Code + '" placeholder="Receipt" value="' + lstsample[0].Receipt + '" min="0"></div>';
                        str += "</div>";
                        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                        str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPSales_' + Sample[i].Product_Code + '" placeholder="Sales" value="' + lstsample[0].Sales + '" min="0"></div>';
                        str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control" type="number" id="SPClosing_' + Sample[i].Product_Code + '" placeholder="Closing" value="' + lstsample[0].Closing + '" readonly></div>';
                    }
                    else {
                        str += '<span><label class="container">' + Sample[i].Product_Name + '<input id="Sample_' + Sample[i].Product_Code + '" type="checkbox" name="sample"><span onclick=MTO.fntoogleSampleCheck("' + Sample[i].Product_Code + '") class="checkmark"></span></label>';
                        //<span >Product Name : ' + Sample[i].Product_Name + '</span>';
                        str += '<span class="badge"></span></span></div>';
                        str += '<div class="col-md-12 clearfix collapse" id="openSample_' + Sample[i].Product_Code + '"  style="padding:0px;">';
                        str += "<div class='col-md-12 clearfix' style='cursor:pointer;padding:0px;'>";
                        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                        str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix" ><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPOpening_' + Sample[i].Product_Code + '" placeholder="Opening" min="0"></div>';
                        str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPRecepit_' + Sample[i].Product_Code + '" placeholder="Receipt" min="0"></div>';
                        str += "</div>";
                        str += '<div class="form-group col-lg-12 col-md-12 col-xs-12 clearfix" style="padding:0px;">';
                        str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control decimalck" type="number" onkeyup=MTO.fnCalculateSample("' + Sample[i].Product_Code + '") id="SPSales_' + Sample[i].Product_Code + '" placeholder="Sales" min="0"></div>';
                        str += '<div class="form-group col-lg-6 col-md-6 col-xs-6 clearfix"><input class="form-control" type="number" id="SPClosing_' + Sample[i].Product_Code + '" placeholder="Closing" readonly></div>';
                    }

                    str += "</div>";
                    str += "</div>";
                    str += "<hr>";
                    str += '</div></div>'
                }
                doc2 += "];";
                MTO.defaults.Sample = eval(doc2);
            }
            var tabObj = new ej.navigations.Tab({
                animation: { prev: {}, next: {} },
                items: [
            {
                header: { 'text': 'Sales' },
                content: content
            },
            {
                header: { 'text': 'Samples' },
                content: str
            }
                ]
            });


            tabObj.appendTo('#proddiv');
            if (MTO_ID != 0) {
                $('#punchdiv').hide();
                //  MTO.fngetMTOFieldDraftDetails()
            }
            $('html,body').animate({
                scrollTop: $("#first").offset().top
            },
                  'slow');
        },
        error: function () {

        }
    });
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }

    },
    fnCalculate: function (code) {
        debugger;
        var opening = $('#SAOpening_' + code).val() == '' ? 0 : $('#SAOpening_' + code).val();
        var rcepit = $('#SARecepit_' + code).val() == '' ? 0 : $('#SARecepit_' + code).val();
        var sales = $('#SASales_' + code).val() == '' ? 0 : $('#SASales_' + code).val();
        var value = parseInt(opening) + parseInt(rcepit) - parseInt(sales);
        $('#SAClosing_' + code).val(value);
    },
    fnCalculateSample: function (code) {
        debugger;
        var opening = $('#SPOpening_' + code).val() == '' ? 0 : $('#SPOpening_' + code).val();
        var rcepit = $('#SPRecepit_' + code).val() == '' ? 0 : $('#SPRecepit_' + code).val();
        var sales = $('#SPSales_' + code).val() == '' ? 0 : $('#SPSales_' + code).val();
        var value = parseInt(opening) + parseInt(rcepit) - parseInt(sales);
        $('#SPClosing_' + code).val(value);
    },
    fntoogleProduct: function (code) {
        $("#openProd_" + code + "").toggle();
    },
    fntoogleProductcheck: function (code) {
        $("#openProd_" + code + "").toggle();
        $("#SAOpening_" + code).val() == '' ? $("#SAOpening_" + code).val(0) : $("#SAOpening_" + code).val();
        $("#SARecepit_" + code).val() == '' ? $("#SARecepit_" + code).val(0) : $("#SARecepit_" + code).val();
        $("#SASales_" + code).val() == '' ? $("#SASales_" + code).val(0) : $("#SASales_" + code).val();
        $("#SAClosing_" + code).val() == '' ? $("#SAClosing_" + code).val(0) : $("#SAClosing_" + code).val();
    },
    fntoogleSample: function (code) {
        $("#openSample_" + code + "").toggle();
    },
    fntoogleSampleCheck: function (code) {
        $("#openSample_" + code + "").toggle();
        $("#SPOpening_" + code).val() == '' ? $("#SPOpening_" + code).val(0) : $("#SPOpening_" + code).val();
        $("#SPRecepit_" + code).val() == '' ? $("#SPRecepit_" + code).val(0) : $("#SPRecepit_" + code).val();
        $("#SPSales_" + code).val() == '' ? $("#SPSales_" + code).val(0) : $("#SPSales_" + code).val();
        $("#SPClosing_" + code).val() == '' ? $("#SPClosing_" + code).val(0) : $("#SPClosing_" + code).val();
    },
    fnAccompanistDetails: function () {
        if (navigator.onLine == true) {
            $.ajax(
            {
                type: 'POST',
                data: "User_Code=" + LoginUserCode + "&Region_Code=" + LoginRegionCode + '&subDomainName=' + subDomainName,
                url: '../../HiDoctor_Activity/MTO/GetAccompanistDetails',
                success: function (response) {
                    debugger;
                    if (response != null && response.length > 0) {
                        //$('#customerName').val('')
                        //$('#customerCode').val('')
                        var doc = "[";
                        for (var i = 0; i < response.length; i++) {
                            var Accname = response[i].Region_Name + ',' + response[i].User_Name + '(' + response[i].Employee_Name + ',' + response[i].User_Type_Name + ')';
                            doc += "{label:" + '"' + "" + Accname + "" + '",' + "id:" + '"' + "" + response[i].User_Code + '"' + "}";
                            if (i < response.length - 1) {
                                doc += ",";
                            }
                        }

                        doc += "];";
                        MTO.defaults.Accompanist = eval(doc);
                    }
                    else {
                        var doc = '[]';
                        //$('#customerName').val('')
                        //$('#customerCode').val('')
                        MTO.defaults.Accompanist = eval(doc);
                    }

                }
            });
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
    fnAutoCompleteChange: function (val, id) {
        debugger;

        var inputValues = [];

        $('#ADDAccompanist :input').map(function () {
            var type = $(this).prop("name");

            if (type == "accompanist") {
                inputValues.push($(this).val());
            }
        });
        var check = $.grep(inputValues, function (v) {
            return v == val;
        });
        if (check != null && check.length > 1) {
            swal('Accompanist Already Selected !', "", "info");
            $(id).val('');
        }
        else {
            $('#applybtn').removeAttr('disabled');
        }
    },
    bytesToSize: function(bytes) {
    //var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    //if (bytes == 0) return '0 Byte';
    //var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    //return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    return (bytes / 1048576).toFixed(3);
    },
    fnAttachmentcheck: function () {
        fileData = new FormData();
        fileUpload = '';
        files = '';
        var file = '';
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                if ($("#mapfile").val() != '' || $("#spnfilename").html() != '') {
                    if ($("#mapfile").val() != '' && $("#spnfilename").html() != '') {
                        swal({
                            title: "Are you sure?",
                            text: "Do you want to replace the old attachment with new attachment?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-primary",
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                            closeOnConfirm: true,
                            closeOnCancel: false
                        },
                      function (isConfirm) {
                          debugger
                          if (isConfirm) {
                              $("#spnfilename").html(' ');
                              if ($("#mapfile").val() != "") {
                                  fileUpload = $("#mapfile").get(0);
                                  files = fileUpload.files;
                              }
                              if (files.length > 0) {
                                  if (MTO.bytesToSize(document.getElementById("mapfile").files[0].size) > 5) {
                                      swal('File Size Must be Less than 5 MB !', "", "info");
                                      return false;
                                  }
                                  else {
                                      fileData.append(files[0].name, files[0]);
                                  }
                              }
                          }
                          else {
                              $('#mapfile').val('')
                          }
                          MTO.InsertMTO();
                      });
                    }
                    else {
                        if ($("#mapfile").val() != '') {
                            file = $("#mapfile").val();
                        }
                        else if ($("#spnfilename").html() != '') {
                            file = $("#spnfilename").html();
                        }
                        if ($("#mapfile").val() != "") {
                            fileUpload = $("#mapfile").get(0);
                            files = fileUpload.files;
                        }
                        if (files.length > 0) {
                            if (MTO.bytesToSize(document.getElementById("mapfile").files[0].size) > 5) {
                                swal('File Size Must be Less than 5 MB !', "", "info");
                                return false;
                            }
                            else {
                                fileData.append(files[0].name, files[0]);
                            }
                        }
                        MTO.InsertMTO();
                    }
                }
                else {
                    MTO.InsertMTO();
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
        InsertMTO: function () {
            debugger;

        if (navigator.onLine == true) {
            var StoreName = $('#StoreName').val();
            if ($('#StoreName').val() == '') {
                result = false;
                swal('Please Enter Store Name', "", "info");
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            var spec = MTO.fnChkSplChar('StoreName');
            if (spec == false) {
                result = false;
                swal("Special Characters are not allowed in  Store Name", "", "info");
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            
            var loopCount = $('#ADDAccompanist > div').map(function () {
                return this.id;
            });
            var result = true;
            var Accompanist = [];
            var ProductSale = [];
            var ProductSample = [];
            var CustomerDetails = [];
            for (var i = 0; i < loopCount.length; i++) {
                var id = loopCount[i].split('_')[1];

                var obj1 = {
                    "User_Name": $('#Accomp_' +id).val(),
                    "User_Code": $('#AccompCode_' +id).val(),
                    "StartTime": $('#Starttime_' +id).val(),
                    "EndTime": $('#Endtime_' +id).val(),
            }

                if (obj1.User_Name != '') {

                    var Acc = $.grep(MTO.defaults.Accompanist, function (v) {
                        return v.label == $('#Accomp_' +id).val();
                    });
                    var Count = $.grep(Accompanist, function (v) {
                        return v.User_Code == $('#AccompCode_' +id).val();
                    });
                    if (Acc.length == 0) {
                        result = false;
                        swal('Please select  valid Accompanist Name', "", "info");
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                }
                    var accname = obj1.User_Name.split(',')[1].split('(')[0];
                    if (obj1.StartTime == '') {
                        result = false;
                        swal('Please Select Start Time For ' + accname + '', "", "info");
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                    }
                    else if (obj1.EndTime == '') {
                        result = false;
                        swal('Please Select End Time For ' + accname + '', "", "info");
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                    }
                    else if (Date.parse("2001/01/01 " + obj1.StartTime) > Date.parse("2001/01/01 " + obj1.EndTime)) {
                        result = false;
                        swal('Start time cannot be greater than end time For ' + accname + '', "", "info");
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                    }
                    else if (Count.length != 0) {
                        result = false;
                        swal('' + accname + ' Accompanist is already entered', "", "info");
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                    }
                    else {
                        Accompanist.push(obj1);
                }

            }

        }
            $.each($("input[name='sales']:checked"), function () {
                var code = $(this).attr('id').split('_')[1];
                var Productname = $.grep(MTO.defaults.ProductSales, function (v) {
                    return v.Product_Code == code;
                });
                if (!/^\d{1,16}(\.\d{1,2})?$/.test($("#SAOpening_" +code).val() == '' ? 0 : $("#SAOpening_" +code).val())) {
                    swal('Information', 'You have exceeded the limit of ' + Productname[0].Product_Name + ' in Quantity', "", "info");
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    result = false;
                    return false;
            }
                if (!/^\d{1,16}(\.\d{1,2})?$/.test($("#SARecepit_" +code).val() == '' ? 0 : $("#SARecepit_" +code).val())) {
                    swal('Information', 'You have exceeded the limit of ' + Productname[0].Product_Name + ' in receipt', "", "info");
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    result = false;
                    return false;
            }
                if (!/^\d{1,16}(\.\d{1,2})?$/.test($("#SASales_" +code).val() == '' ? 0 : $("#SASales_" +code).val())) {
                    swal('Information', 'You have exceeded the limit of ' + Productname[0].Product_Name + ' in Sales', "", "info");
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    result = false;
                    return false;
            }
                var Pobj = {
                    "Product_Code": code,
                    "Product_Name": Productname[0].Product_Name,
                    "Opening": $("#SAOpening_" +code).val() == '' ? 0 : $("#SAOpening_" +code).val(),
                    "Recepit": $("#SARecepit_" +code).val() == '' ? 0 : $("#SARecepit_" +code).val(),
                    "Sales": $("#SASales_" +code).val() == '' ? 0 : $("#SASales_" +code).val(),
                    "Closing": $("#SAClosing_" +code).val() == '' ? 0 : $("#SAClosing_" +code).val(),
                    "Entity": "Sales"
            }
                if (Pobj.Closing < 0) {
                    swal('Information', 'Closing balance should be greater than 0 For ' + Productname[0].Product_Name + ' in Sales', "", "info");
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    result = false;
                    return false;
                }
                else {
                    ProductSale.push(Pobj);
            }


            });


            $.each($("input[name='sample']:checked"), function () {
                var code = $(this).attr('id').split('_')[1];
                var Productname = $.grep(MTO.defaults.ProductSample, function (v) {
                    return v.Product_Code == code;
                });
                if (!/^\d{1,16}(\.\d{1,2})?$/.test($("#SPOpening_" +code).val() == '' ? 0 : $("#SPOpening_" +code).val())) {
                    swal('Information', 'You have exceeded the limit of ' + Productname[0].Product_Name + ' in Quantity', "", "info");
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    result = false;
                    return false;
            }
                if (!/^\d{1,16}(\.\d{1,2})?$/.test($("#SPRecepit_" +code).val() == '' ? 0 : $("#SPRecepit_" +code).val())) {
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    swal('Information', 'You have exceeded the limit of ' + Productname[0].Product_Name + ' in Receipt', "", "info");
                    result = false;
                    return false;
            }
                if (!/^\d{1,16}(\.\d{1,2})?$/.test($("#SPSales_" +code).val() == '' ? 0 : $("#SPSales_" +code).val())) {
                    swal('Information', 'You have exceeded the limit of ' + Productname[0].Product_Name + ' in Sales', "", "info");
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    result = false;
                    return false;
            }
                var Pobj = {
                    "Product_Code": code,
                    "Product_Name": Productname[0].Product_Name,
                    "Opening": $("#SPOpening_" +code).val() == '' ? 0 : $("#SPOpening_" +code).val(),
                    "Recepit": $("#SPRecepit_" +code).val() == '' ? 0 : $("#SPRecepit_" +code).val(),
                    "Sales": $("#SPSales_" +code).val() == '' ? 0 : $("#SPSales_" +code).val(),
                    "Closing": $("#SPClosing_" +code).val() == '' ? 0 : $("#SPClosing_" +code).val(),
                    "Entity": "Sample"
            }
                if (Pobj.Closing < 0) {
                    swal('Information', 'Closing balance should be greater than 0 For ' + Productname[0].Product_Name + ' in Sales', "", "info");
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    result = false;
                    return false;
                }
                else {
                    ProductSample.push(Pobj);
            }
            });
            var CusCount = $('#CustomerDetails  > div').map(function () {
                return this.id;
            });
            for (var i = 0; i < CusCount.length; i++) {
                CusProductDeatils = [];
                var id = CusCount[i].split('_')[1];
                var prod = MTO.GetSalesValue(CusCount[i]);
                if (prod == false) {
                    result = false;
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    return false;
            }
                var Cus = {
                    "Customer_Name": $('#' + CusCount[i] + ' #cusname').val() == '' ? null : $('#' + CusCount[i] + ' #cusname').val(),
                    "MobileNumber": $('#' + CusCount[i] + ' #MobileNum').val() == '' ? null : $('#' + CusCount[i] + ' #MobileNum').val(),
                    "Remark": $('#' + CusCount[i] + ' #remark').val() == '' ? null : $('#' + CusCount[i] + ' #remark').val(),
                    "Product": CusProductDeatils,
            }
                if (Cus.MobileNumber != null) {
                    if (Cus.Customer_Name == null) {
                        swal("Please Enter the Customer Name", "", "info");
                        result = false;
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                }
                    if (Cus.MobileNumber.length != 10) {
                        swal("Please enter valid Mobile Number", "", "info");
                        result = false;
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                }
                    var mob = MTO.fnChkSplChar(CusCount[i] + ' #MobileNum');
                    if (mob == false) {
                        swal("Special Characters are not allowed in Mobile Number", "", "info");
                        result = false;
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                }
            }
                if (Cus.Remark != null && Cus.Customer_Name == null) {
                    swal("Please Enter the Customer Name", "", "info");
                    result = false;
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    return false;
            }
                if (CusProductDeatils.length > 0 && Cus.Customer_Name == null) {
                    swal("Please Enter the Customer Name", "", "info");
                    result = false;
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    return false;
            }
                if (Cus.Customer_Name != null) {
                    var spec = MTO.fnChkSplChar(CusCount[i] + ' #cusname');
                    if (spec == false) {
                        swal("Special Characters are not allowed in  Customer Name", "", "info");
                        result = false;
                        $('#Draft').prop('disabled', false);
                        $('#Save').prop('disabled', false);
                        return false;
                    }
                    else if (Cus.Remark != null) {
                        var Remark = MTO.fnReChkSplChar(CusCount[i] + ' #remark');
                        if (Remark == false) {
                            swal('Special characters are not allowed in remarks except - _ . , ( )', "", "info");
                            result = false;
                            $('#Draft').prop('disabled', false);
                            $('#Save').prop('disabled', false);
                            return false;
                    }
                }
                    CustomerDetails.push(Cus);

            }

        }
            var endtime = $('#PunchEnd').val();
            if (MTO.defaults.MTOValue == 1) {
                if ($('#PunchEnd').val() == '') {
                    swal('Please Enter End Time', "", "info");
                    result = false;
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    return false;
            }
                if (Date.parse("2001/01/01 " + MTO.defaults.InTime) > Date.parse("2001/01/01 " +endtime)) {
                    swal('Punch End time should be greater than Punch Start time ' + MTO.defaults.InTime + '.', "", "info");
                    result = false;
                    $('#Draft').prop('disabled', false);
                    $('#Save').prop('disabled', false);
                    return false;
            }
        }
            var GMRemark = MTO.fnReChkSplChar('Gremark');
            if (GMRemark == false) {
                swal('Special characters are not allowed in remarks except - _ . , ( ) ', "", "info");
                result = false;
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            if (result == true) {
                var GRemaks = $('#Gremark').val();
                var _objData = new Object();
                _objData.subDomainName = subDomainName;
                _objData.Region_Code = LoginRegionCode;
                _objData.User_Code = LoginUserCode;
                _objData.MTODate = MTO_Date;
                _objData.MTO_ID = MTO_ID;
                _objData.StoreName = StoreName;
                _objData.Accompanist = JSON.stringify(Accompanist);
                _objData.ProductSale = JSON.stringify(ProductSale);
                _objData.ProductSample = JSON.stringify(ProductSample);
                _objData.CustomerDetails = JSON.stringify(CustomerDetails);
                _objData.GRemaks = GRemaks;
                _objData.OutTime = $('#PunchEnd').val() == '' ? null : $('#PunchEnd').val();
                _objData.MTOValue = MTO.defaults.MTOValue;
                _objData.Latitude = Lat;
                _objData.Longitude = Long;

                if (navigator.onLine == true) {
                    $.ajax(
                     {
                             type: 'POST',
                             data: _objData,
                             url: '../../HiDoctor_Activity/MTO/GetInsetField',
                             success: function (response) {
                                 debugger;
                             if (response != 0) {

                                 $('#Draft').prop('disabled', false);
                                 $('#Save').prop('disabled', false);
                                 if ($("#mapfile").val() != '') {
                                     MTO.fnMTOAttachment(response, fileData);
                                 }
                                 else {
                                     debugger
                                     swal({
                                             title: "Field Activity Saved Successfully",
                                             showCancelButton: false,
                                             closeOnConfirm: false,
                                     }, function (inputValue) {
                                         if (inputValue === false) return false;
                                         window.location.href = '../MTO/MTOMobile?Lid=' +Lid;
                                     });
                             }
                             }
                     },
                             error: function () {

                     }
                    });
                }
                else {
                    window.location.href = '../MTO/MTOErrorPage';
            }
            }
            else {
                // $('#Draft').prop('disabled', false);
                // $('#Save').prop('disabled', false);
        }
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
        //fnGetCompanyCode: function (response, fileData) {
        //    $.ajax({
        //        type: 'POST',
        //        data: 'subDomainName=' + subDomainName + "&CompanyId=" + CompanyId,
        //        url: '../../HiDoctor_Activity/MTO/GetCompanyCode',
        //        success: function (res) {
        //            debugger;
        //            if (res != 0) {
        //                debugger
        //                var Companycode = res[0].Company_Code;
        //                var _obj = new Object();
        //                _obj.Company_Code = Companycode;
        //                fileData.append("Companycode", Companycode);
        //                MTO.fnInsertMTOAttachment(response, fileData);
        //            }
        //        }
        //    })

        //},
        fnMTOAttachment: function (response, fileData) {
            debugger
        if (navigator.onLine == true) {
            $.ajax({
                    url: '../../HiDoctor_Activity/MTO/UploadFieldAttachment',
                    type: "POST",
                    contentType: false, // Not to set any content header  
                    processData: false, // Not to process data  
                    data: fileData,
                    success: function (result) {
                        debugger
                    if (result[0] != "Failed") {
                        MTO.fnInsertMTOAttachment(response, result)
                        console.log(result);
                    }
                    else {
                        swal('Attachment Upload Failed', "", "info");
                        return false;
                    }
            },
                    error: function (err) {
            }
            });
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
        fnInsertMTOAttachment: function (MTOID, result) {
        var Fname = result[1];
        var FPath = result[0];
        $.ajax({
                type: 'POST',
                data: 'subDomainName=' + subDomainName + "&MTOId=" + MTOID + "&Filename=" + Fname + "&FilePath=" + FPath + "&LoginUserCode=" +LoginUserCode,
                url: '../../HiDoctor_Activity/MTO/InsertFileDetails',
                success: function (res) {
                    debugger
                if (res != -1) {
                    swal({
                            title: "Activity Saved Successfully",
                            showCancelButton: false,
                            closeOnConfirm: false,
                    }, function (inputValue) {
                        if (inputValue === false) return false;
                        window.location.href = '../MTO/MTOMobile?Lid=' +Lid;
                    });
                }
                else {
                    swal('Attachment Upload Failed', "", "info");
                    return false;
                }
        }
        })
    },
        fnReChkSplChar: function (id) {
            //Remark
        if ($('#' +id).val() != "") {
            var specialCharregex = new RegExp("^[-a-zA-Z0-9 _().,\n\r\r\n]+$");
            if (!specialCharregex.test($('#' +id).val())) {
                return false;
            }
            else {
                return true;
        }
        }
        return true

    },
        GetSalesValue: function (Cus) {

        var result = true;
        var CustomerSales = $('#' + Cus + ' #cusSalesPro  > div').map(function () {
            return this.id;
        });
        for (var j = 0; j < CustomerSales.length; j++) {
            if (!/^\d{1,16}(\.\d{1,2})?$/.test($('#' + CustomerSales[j] + ' #salesquality').val() == '' ? 0 : $('#' + CustomerSales[j] + ' #salesquality').val())) {
                swal('Information', 'You have exceeded the limit of ' + $('#' + CustomerSales[j] + ' #productSales').val() + '', "", "info");
                result = false;
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            var salesval = $.grep(CusProductDeatils, function (v) {
                return v.Product_Name == $('#' + CustomerSales[j] + ' #productSales').val() && v.Entity == 'Sales';
            })
            var salvalidation = $.grep(MTO.defaults.ProductSales, function (v) {
                return v.Product_Name == $('#' + CustomerSales[j] + ' #productSales').val();
            });
            if ($('#' + CustomerSales[j] + ' #productSales').val() != '' && salvalidation.length == 0) {
                result = false;
                swal('Please select  valid Sales Product Name', "", "info");
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            if (salesval.length > 0) {
                swal('Information', ' ' + $('#' + CustomerSales[j] + ' #productSales').val() + ' this Product is already exist', "", "info");
                result = false;
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            var CusSales = {
                "Product_Name": $('#' + CustomerSales[j] + ' #productSales').val(),
                "Product_Code": $('#' + CustomerSales[j] + ' #SalesCode').val(),
                "Quantity": $('#' + CustomerSales[j] + ' #salesquality').val() == '' ? 0 : $('#' + CustomerSales[j] + ' #salesquality').val(),
                "Entity": 'Sales'
        }
            if (CusSales.Product_Name != '') {
                CusProductDeatils.push(CusSales);
        }
        }
        var CustomerSample = $('#' + Cus + ' #cusSamplePro  > div').map(function () {
            return this.id;
        });
        for (var k = 0; k < CustomerSample.length; k++) {
            if (!/^\d{1,16}(\.\d{1,2})?$/.test($('#' + CustomerSample[k] + ' #samplequality').val() == '' ? 0 : $('#' + CustomerSample[k] + ' #samplequality').val())) {
                swal('Information', 'You have exceeded the limit of ' + $('#' + CustomerSample[k] + ' #productSample').val() + '', "", "info");
                result = false;
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            var samplesval = $.grep(CusProductDeatils, function (v) {
                return v.Product_Name == $('#' + CustomerSample[k] + ' #productSample').val() && v.Entity == 'Sample';
            })
            if (samplesval.length > 0) {
                swal('Information', ' ' + $('#' + CustomerSample[k] + ' #productSample').val() + ' this Product is already exist', "", "info");
                result = false;
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            var samvalidation = $.grep(MTO.defaults.ProductSample, function (v) {
                return v.Product_Name == $('#' + CustomerSample[k] + ' #productSample').val();
            });
            if ($('#' + CustomerSample[k] + ' #productSample').val() != '' && samvalidation.length == 0) {
                result = false;
                swal('Please select  valid Sample Product Name', "", "info");
                $('#Draft').prop('disabled', false);
                $('#Save').prop('disabled', false);
                return false;
        }
            var CusSales = {
                "Product_Name": $('#' + CustomerSample[k] + ' #productSample').val(),
                "Product_Code": $('#' + CustomerSample[k] + ' #SampleCode').val(),
                "Quantity": $('#' + CustomerSample[k] + ' #samplequality').val() == '' ? 0 : $('#' + CustomerSample[k] + ' #samplequality').val(),
                "Entity": 'Sample'
        }
            if (CusSales.Product_Name != '') {
                CusProductDeatils.push(CusSales);
        }
        }
        return result;
    },
        phonenumber: function (id) {
            debugger;
        var inputtxt = $(id).val();
        var numbers = /^[0-9]+$/;
        if (inputtxt.value.match(numbers)) {
            return true;
        }
        else {
            return false;
        }
    },

        //phonenumber:function(inputtxt)
        //{
        //var phoneno = /^\d{10}$/;
        //if(inputtxt.value.match(phoneno))
        //{
        //    return true;
        //}
        //else
        //{
        //    return false;
        //}
        //},
        fngetMTOFieldDraftDetails: function () {
            debugger;
        var _objData = new Object();
        _objData.MTO_ID = MTO_ID;
        _objData.subDomainName = subDomainName;
        if (navigator.onLine == true) {
            $.ajax(
                       {
                               type: 'POST',
                               data: _objData,
                               url: '../../HiDoctor_Activity/MTO/GetMTOFieldDraftDetails',
                               success: function (response) {
                                   debugger;
                               var Header = response.header;
                               var Accompanist = response.FieldAcc;
                               MTO.defaults.SS = response.SS;
                               var CusHeader = response.CusHeader;
                               var CusDetails = response.CusDetails;
                               if (Header.length > 0) {
                                   $('#StoreName').val(Header[0].Store_Name);
                                   $('#Gremark').val(Header[0].GeneralRemarks);

                               }
                                   ///////////Accompanist
                               if (Accompanist.length > 0) {
                                   for (var i = 0; i < Accompanist.length; i++) {
                                       if (i == 0) {
                                           $('#Accomp_' +i).val(Accompanist[i].Accompanist_Name);
                                           $('#AccompCode_' +i).val(Accompanist[i].Accompanist_Code);
                                           $('#Starttime_' +i).val(Accompanist[i].Start_Time);
                                           $('#Endtime_' +i).val(Accompanist[i].End_Time);
                                       }
                                       else {
                                           MTO.fnAddAccompanist();
                                           $('#Accomp_' +i).val(Accompanist[i].Accompanist_Name);
                                           $('#AccompCode_' +i).val(Accompanist[i].Accompanist_Code);
                                           $('#Starttime_' +i).val(Accompanist[i].Start_Time);
                                           $('#Endtime_' +i).val(Accompanist[i].End_Time);
                                   }
                               }
                               }
                                   /////////////////Sales And Sample///////////////////////
                               if (MTO.defaults.SS.length > 0) {
                                   MTO.GetAllDraftProduct();
                               }
                               else {
                                   MTO.GetAllProduct();
                               }
                                   //////////////Customer Details/////////
                               if (CusHeader.length > 0) {
                                   for (var j = 0; j < CusHeader.length; j++) {
                                       MTO.defaults.AddSales = 0;
                                       MTO.defaults.AddSamples = 0;
                                       var CusSales = $.grep(CusDetails, function (v) {
                                           return v.Customer_Id == CusHeader[j].Customer_Id && v.Entity == 'Sales'
                                       })
                                       var CusSample = $.grep(CusDetails, function (v) {
                                           return v.Customer_Id == CusHeader[j].Customer_Id && v.Entity == 'Sample'
                                       })
                                       if (j != 0) {
                                           MTO.fnAddCustomerDetails();
                                   }
                                       $('#CustomerD_' + j + ' #cusname').val(CusHeader[j].Customer_Name);
                                       $('#CustomerD_' + j + ' #MobileNum').val(CusHeader[j].MobileNumber == 0 ? '' : CusHeader[j].MobileNumber);
                                       $('#CustomerD_' + j + ' #remark').val(CusHeader[j].Remark);

                                       for (var k = 0; k < CusSales.length; k++) {
                                           if (k != 0) {
                                               MTO.fnAddSales(j);
                                       }
                                           $('#cusSalesPro_' + j + '_' + k + ' #productSales').val(CusSales[k].Product_Name);
                                           $('#cusSalesPro_' + j + '_' + k + ' #SalesCode').val(CusSales[k].Product_Code);
                                           $('#cusSalesPro_' + j + '_' + k + ' #salesquality').val(CusSales[k].Quantity);
                                   }
                                       for (var s = 0; s < CusSample.length; s++) {
                                           if (s != 0) {
                                               MTO.fnAddSamples(j);
                                       }
                                           $('#cusSamplePro_' + j + '_' + s + '  #productSample').val(CusSample[s].Product_Name);
                                           $('#cusSamplePro_' + j + '_' + s + '  #SampleCode').val(CusSample[s].Product_Code);
                                           $('#cusSamplePro_' + j + '_' + s + '  #samplequality').val(CusSample[s].Quantity);
                                   }
                               }
                               }
                               $('#stime').show();
                               $('#spnstrttime').html(Header[0].In_time);
                       },
                               error: function () {

                       }
            });
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
        MTO.fnGetAttachment(MTO_ID);
    },
        fnGetAttachment: function (MtoId) {
        $.ajax(
               {
                       type: 'POST',
                       data: 'subDomainName=' + subDomainName + '&MTO_ID=' +MTO_ID,
                       url: '../../HiDoctor_Activity/MTO/GetMtoAttachment',
                       success: function (response) {
                           debugger;
                       if (response.length != 0) {
                           $('#spnfilename').html(response[0].File_Name);
                           $('#spnfilename').attr('href', response[0].File_Path);
                           $('#mapfile').show();
                       }
                       else {
                           $('#mapfile').show();
                           $('#spnfilename').hide();
                       }
               }
        })
    },
        PunchEndTime: function () {
        $('#PunchEndTime').show();
        $('#PunchEnd').mdtimepicker();
    },
        fnMTOPunchTime: function () {
        if ($('#StoreName').val() == '') {
            swal('Please Enter Store Name', "", "info");
            return false;
        }
        var spec = MTO.fnChkSplChar('StoreName');
        if (spec == false) {
            swal("Special Characters are not allowed in  Store Name", "", "info");
            return false;
        }
            //if ($("#mapfile").val() == "" || $("#mapfile").val() == null) {
            //    if ($("#spnfilename").html() == "") {
            //        swal("Please choose attachment", "info");
            //        return false;
            //    }
            //}
        else {
            $('#myModal').show();
            $('#punchintime').mdtimepicker();
        }

    },
        fnChkSplChar: function (id) {
            debugger;
        var str = $('#' +id).val();
        if (/^[a-zA-Z0-9 ]+$/.test(str) == false) {
            return false;
        }
        else {
            return true;
        }
            //if ($('#' + id).val() != "") {
            //    var value = $('#' + id).val();
            //    var specialCharregex = new RegExp("^[a-zA-Z0-9 ]+$");
            //    if (!specialCharregex.test(value)) {

            //    }
            //    else {
            //        return true;
            //    }
            //}
    },
        fnMTOInsertPunchTime: function () {
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $("#punchtime").prop('disabled', true);
                var StoreName = $('#StoreName').val();
                var InTime = $('#punchintime').val();
                if (InTime == '') {
                    swal("Please enter Start Time", "", "info");
                    $("#punchtime").prop('disabled', false);
                    return false;
            }

                var _objData = new Object();
                _objData.subDomainName = subDomainName;
                _objData.Region_Code = LoginRegionCode;
                _objData.User_Code = LoginUserCode;
                _objData.MTODate = MTO_Date;
                _objData.MTO_ID = MTO_ID;
                _objData.InTime = InTime;
                _objData.OutTime = null;
                _objData.StoreName = StoreName;
                _objData.Activity = 1;
                _objData.Latitude = Lat;
                _objData.Longitude = Long;

                $.ajax(
               {
                       type: 'POST',
                       data: _objData,
                       url: '../../HiDoctor_Activity/MTO/GetMTOPunchTime',
                       success: function (response) {
                           debugger;
                       if (response != 0) {
                           MTO_ID = response;
                           MTO.defaults.InTime = $('#punchintime').val();
                           $('#myModal').hide();
                           $('#punchdiv').hide();
                           $('#Save').show();
                           $('#Draft').show();
                           $("#punchtime").prop('disabled', true);
                           $('#stime').show();
                           $('#spnstrttime').html(InTime);
                           //MTO.fnsaveuserlocation(MTO_ID);
                       }
               }, error: function () {

               }
                });
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
                return false;
        }
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }

    }
}

// AutoComplete.
var selector = 'input[name=accompanist]';
$(document).on('keydown.autocomplete', selector, function () {
    debugger;
    $(this).autocomplete({
        delay: 45,
        source: MTO.defaults.Accompanist,
        minLength: 1,
        select: function (event, ui) {
            $(this).val(ui.item.label);
            var hd = '#AccompCode_' + this.id.split('_')[1]
            $(hd).val(ui.item.id);
            MTO.fnAutoCompleteChange(ui.item.label, $(this));
        },
        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
});
$(document).on('keydown.autocomplete', 'input[name = ProdSales]', function () {
    debugger;
    $(this).autocomplete({
        delay: 45,
        source: MTO.defaults.Sales,
        minLength: 1,
        select: function (event, ui) {
            debugger;
            $(this).val(ui.item.label);
            var hd = $(this).parent().parent().attr('id');
            $('#' + hd + ' #SalesCode').val(ui.item.id);
            //MTO.fnAutoCompleteChange(ui.item.label, $(this));
        },
        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
});
$(document).on('keydown.autocomplete', 'input[name = ProdSample]', function () {
    debugger;
    $(this).autocomplete({
        delay: 45,
        source: MTO.defaults.Sample,
        minLength: 1,
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).parent().parent();
            var hd = $(this).parent().parent().attr('id');
            $('#' + hd + ' #SampleCode').val(ui.item.id);
            //MTO.fnAutoCompleteChange(ui.item.label, $(this));
        },
        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
});
