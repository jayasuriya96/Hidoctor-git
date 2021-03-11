///////////////////Created By:S.Manju //////////////////
/////////////////// ON:16-08-2018 ////////////////////
var Batch = {
    defaults: {
        "month": "",
        "BatchDetails": "",
        "BatchID": "",
        "BStatus": "",
        "d_g": "",
        "Batchd_g": "",
        "P_Id": 2,
        "Product": "",
        "ScheduleDetails": "",
        "ScheduleId": "",
        "SDate": "",
        "EDate": "",
        "Region_Name": "",
        "BatchSDate": "",
        "BatchEDate": "",
        "BatchName": "",
        "ScheduleSDate": "",
        "ScheduleEDate": "",
        "Remark_ID": "",
        "Remark_Schedule": "",
        "PreStatus": ""
    },
    initialize: function () {
        ////////////////////////////////////////////// 
        $('#status').change(function () {
            Batch.GetDetailsOfBatch();
        });
        $('#createBatch').click(function () {
            Batch.SaveBatchDetalis();
        });
        $('#UPDateBatch').click(function () {
            Batch.UpadteBatchDetails();
        });
        $('#cancel').click(function () {
            Batch.fnclear();
        });
        $('#CreateBatchEdit').click(function () {
            Batch.fnclear();
            $('#create').show();
            $('#fullEdit').hide();
            $('#Update').hide();
        });
        $('#EditBatch').click(function () {
            Batch.fnUpdateBatch();
            //$('#Update').show();
        });
        $('#SaveSchedule').click(function () {
            if ($('#SaveSchedule').html() == 'Update') {
                Batch.fnUpdateSchedule();
            }
            else {
                Batch.fnInsertSchedule();
            }

        });
        $('#UPDatecancel').click(function () {
            Batch.fnclear();
        });
        $('#CancelSchedule').click(function () {
            Batch.fnclearProduct();
        });

        $('#closemodel').click(function () {
            $('#BatchQuality').hide();
        })
        /////////////////////////////////////////////
        Batch.GetAllRegion();
       
        Batch.GetBatchAllRegion();

        $("#dvAjaxLoad").hide();
    },
    GetDetailsOfBatch: function () {
        debugger;
        $('#batchDetails').html('');
        $('#Update').hide();
        $("#fullEdit").hide();
        $("#UpDate").hide();
        $('#SchDetails').hide();
        $('#create').show();
        var status = $('#status').val();
        var Region_Code = $('#hdnRegionBatch').val();
        var Region_Name = $('#txtRegionBatch').val();
        var CustomerCode = '';
        if ($('#txtDoctorBatch').val() != '') {
            CustomerCode = $('#hdnDotorBatch').val().split('_')[0];
            var doctor = $.grep(Batch.defaults.Batchd_g, function (v) {
                return v.label == $('#txtDoctorBatch').val();
            });
            if (doctor.length == 0) {
                swal('Please enter valid Customer Name ', "", "info");
                return false;
            }
        }
        else {
            CustomerCode = 'All';
        }
        var region = $.grep(Batch.defaults.Region_Name, function (v) {
            return v.label == Region_Name;
        });
        if (region.length == 0) {
            swal('Please enter valid Region Name ', "", "info");
            return false;
        }

        Batch.fnclearProduct();
        var _objData = new Object();
        _objData.Region_Code = Region_Code;
        _objData.CustomerCode = CustomerCode;
        _objData.status = status;
        _objData.subDomainName = subDomainName;
        $.ajax(
            {
                type: 'POST',
                data: _objData,
                async: false,
                url: '../GetBatchDetails',
                success: function (response) {
                    debugger;
                    var content = '';
                    if (response.length != 0) {
                        //content += '<hr>';
                        Batch.defaults.BatchDetails = response;
                        var uniqueData = response.reduce(function (item, e1) {
                            var matches = item.filter(function (e2)
                            { return e1.Customer_Code == e2.Customer_Code });
                            if (matches.length == 0) {
                                item.push(e1);
                            }
                            return item;
                        }, []);

                        for (var i = 0; i < uniqueData.length; i++) {
                            var lst = $.grep(response, function (v) {
                                return v.Customer_Code == uniqueData[i].Customer_Code;
                            });
                            content += '<div class="panel panel-default ">';
                            content += '<div class="panel-heading togglebatch" id="collap_' + uniqueData[i].Customer_Code + '"  onclick=Batch.fntooglebatch("' + uniqueData[i].Customer_Code + '") >';
                            content += '<span class="collapsebatchs">Customer Name : <br>' + uniqueData[i].Customer_Name + '</span>';
                            content += '<span class="badge" style="float: right;">' + lst.length + '</span></div>';
                            content += '<div class="col-md-12 clearfix collapse" id="openbatch_' + uniqueData[i].Customer_Code + '">';

                            for (var j = 0; j < lst.length; j++) {
                                content += "<div class='col-md-12 clearfix' style='cursor:pointer;margin-top:5px;' onclick=Batch.fnEditBatch(" + lst[j].Batch_Id + "\," + lst[j].status + ")>";
                                content += "<span>" + lst[j].Batch_Name + "</span>";
                                if (lst[j].status == 1) {
                                    content += " <span class='dot'></span><span>Active</span>";
                                }
                                else {
                                    content += " <span class='Indot'></span><span>In Active</span>";
                                }
                                content += "</div>";
                                
                                content += "<hr>";
                            }
                            content += "</div>";
                            content += '</div>'


                        }

                    }
                    else {
                        content += '<span>No Record Found</span>';
                    }
                    $('#batchDetails').html(content);
                },
                error: function () {

                }
            })
    },
    fntooglebatch: function (code) {
        debugger;
        //$(".togglebatch").slideUp();
        $("#openbatch_" + code + "").toggle();
    },
    GetupdateDoctorName: function (val) {
        debugger;
        var Region_Code = $('#UPhdnRegion').val();
        var _objData = new Object();
        _objData.Region_Code = Region_Code;
        _objData.subDomainName = subDomainName;
        $.ajax(
                   {
                       type: 'POST',
                       data: _objData,
                       url: '../GetDoctorName',
                       success: function (response) {
                           debugger;

                           if (response != null && response.length > 0) {

                               //Sale product autofill
                               var doc = "[";
                               for (var i = 0; i < response.length; i++) {
                                   doc += "{label:" + '"' + "" + response[i].Customer_Name + "(" + response[i].Hospital_Name + ")" + "" + '",' + "value:" + '"' + "" + response[i].Customer_Code + "_" + response[i].Customer_RegionCode + "" + '"' + "}";
                                   if (i < response.length - 1) {
                                       doc += ",";
                                   }
                               }

                               doc += "];";
                               Batch.defaults.d_g = eval(doc);
                               var atcObj = new ej.dropdowns.AutoComplete({
                                   //set the data to dataSource property
                                   dataSource: eval(doc),

                                   fields: { text: 'label' },

                                   select: Batch.UpdateDoctorchange,
                               });
                               atcObj.appendTo('#UPtxtDoctor');
                           }
                           else {
                               Batch.defaults.d_g = '';
                               var atcObj = new ej.dropdowns.AutoComplete({
                                   //set the data to dataSource property
                                   dataSource: eval(Batch.defaults.d_g),

                                   fields: { text: 'label' },

                                   select: Batch.UpdateDoctorchange,
                               });

                               atcObj.appendTo('#UPtxtDoctor');
                           }
                           if (val == "update") {
                               $('#UPtxtDoctor').prop('disabled', true);
                           }
                       },
                       error: function () {

                       }
                   });
    },
    UpdateDoctorchange: function (arg) {
        if (arg.itemData != null) {
            $('#UPhdnDotor').val(arg.itemData.value);
        }
    },
    GetDoctorName: function () {

        var Region_Code = $('#hdnRegion').val();
        var _objData = new Object();
        _objData.Region_Code = Region_Code;
        _objData.subDomainName = subDomainName;
        $('#txtDoctor').html('');
        $.ajax(
                   {
                       type: 'POST',
                       data: _objData,
                       url: '../GetDoctorName',
                       success: function (response) {
                           debugger;

                           if (response != null && response.length > 0) {

                               //Sale product autofill
                               var doc = "[";
                               for (var i = 0; i < response.length; i++) {
                                   doc += "{label:" + '"' + "" + response[i].Customer_Name + "(" + response[i].Hospital_Name + ")" + "" + '",' + "value:" + '"' + "" + response[i].Customer_Code + "_" + response[i].Customer_RegionCode + "" + '"' + "}";
                                   if (i < response.length - 1) {
                                       doc += ",";
                                   }
                               }

                               doc += "];";
                               
                           }
                           else {
                               var doc = "[]";
                           }
                           Batch.defaults.d_g = eval(doc);
                               var atcObj = new ej.dropdowns.AutoComplete({
                                   dataSource: eval(doc),

                                   fields: { text: 'label' },

                                   select: Batch.Doctorchange,
                               });

                               atcObj.appendTo('#txtDoctor');
                           
                       },
                       error: function () {

                       }
                   });
    },
    Doctorchange: function (arg) {
        debugger;
        $("#hdnDotor").val(arg.itemData.value);

    },
    GetBatchDoctorName: function () {
        var Region_Code = $('#hdnRegionBatch').val();
        var _objData = new Object();
        _objData.Region_Code = Region_Code;
        _objData.subDomainName = subDomainName;
        $('#txtDoctorBatch').html('');
        $.ajax(
                   {
                       type: 'POST',
                       data: _objData,
                       url: '../GetDoctorName',
                       success: function (response) {
                           debugger;

                           if (response != null && response.length > 0) {

                               //Sale product autofill
                               var doc = "[";
                               for (var i = 0; i < response.length; i++) {
                                   doc += "{label:" + '"' + "" + response[i].Customer_Name + "(" + response[i].Hospital_Name + ")" + "" + '",' + "value:" + '"' + "" + response[i].Customer_Code + "_" + response[i].Customer_RegionCode + "" + '"' + "}";
                                   if (i < response.length - 1) {
                                       doc += ",";
                                   }
                               }

                               doc += "];";
                              
                           }
                           else
                           {
                               var doc = [];
                           }
                           Batch.defaults.Batchd_g = eval(doc);
                               var atcObj = new ej.dropdowns.AutoComplete({
                                   //set the data to dataSource property
                                   dataSource: eval(doc),

                                   fields: { text: 'label' },

                                   select: Batch.DoctorBatchchange,
                               });
                               atcObj.appendTo('#txtDoctorBatch');
                           
                       },
                       error: function () {

                       }
                   });
    },
    DoctorBatchchange: function (arg) {
        debugger;
        $("#hdnDotorBatch").val(arg.itemData.value);


    },
    GetAllProduct: function (regioncode) {
        $.ajax(
                 {
                     type: 'POST',
                     data: "Region_Code=" + regioncode + '&subDomainName=' + subDomainName,
                     url: '../GetAllProductName',
                     success: function (response) {
                         debugger;

                         if (response != null && response.length > 0) {

                             //Sale product autofill
                             var doc = "[";
                             for (var i = 0; i < response.length; i++) {
                                 doc += "{label:" + '"' + "" + response[i].Product_Name + "" + '",' + "id:" + '"' + "" + response[i].Product_Code + '"' + "}";
                                 if (i < response.length - 1) {
                                     doc += ",";
                                 }
                             }

                             doc += "];";
                             Batch.defaults.Product = eval(doc);
                             //autoComplete(Batch.defaults.Product, "productName_1", "hdnproductcode_1", 'product');
                         }
                     },
                     error: function () {

                     }
                 });
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
                                     //$('#txtRegion').val(response[0].Region_Name)
                                     //$('#hdnRegion').val(response[i].Region_Code)
                                     $('#txtRegionBatch').val(response[0].Region_Name)
                                     $('#hdnRegionBatch').val(response[0].Region_Code)
                                 }
                                 doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "}";
                                 if (i < response.length - 1) {
                                     doc += ",";
                                 }
                             }

                             doc += "];";
                             Batch.defaults.Region_Name = eval(doc);
                             var atcObj = new ej.dropdowns.AutoComplete({
                                 //set the data to dataSource property
                                 dataSource: eval(doc),

                                 fields: { text: 'label' },

                                 select: Batch.changefirst,
                                 focusOut: Batch.changefocusOutfirst,
                             });
                             //atcObj.destroy();
                             atcObj.appendTo('#txtRegionBatch');
                             Batch.GetBatchDoctorName();
                             Batch.GetDetailsOfBatch();
                         }
                     },
                     error: function () {

                     }
                 });
    },
    changefirst: function (arg) {
        debugger;
        if (arg.itemData != null) {
            $("#hdnRegionBatch").val(arg.itemData.value);
            $('#auto').html('');
            $('#auto').append(' <input type="text" class="text-line BDoctName" id="txtDoctorBatch"><input type="hidden" id="hdnDotorBatch" />');
            Batch.GetBatchDoctorName();
        }
    },
    changefocusOutfirst: function () {
        debugger;
        if ($('#txtRegionBatch').val() == '') {
            $("#hdnRegionBatch").val('');
            $('#auto').html('');
            $('#auto').append(' <input type="text" class="text-line BDoctName" id="txtDoctorBatch"><input type="hidden" id="hdnDotorBatch" />');
            Batch.GetBatchDoctorName();
        }

    },
    changeBatch: function (arg) {
        debugger;
        if (arg.itemData != null) {
            $("#hdnRegion").val(arg.itemData.value);
            $('#regauto').html('');
            $('#regauto').append('<input type="text" class="text-line CName" placeholder="Customer Name" id="txtDoctor"> <input type="hidden" id="hdnDotor" />');
            Batch.GetDoctorName();
        }
    },
    RfocusOutfirst: function () {
        if ($('#txtRegion').val() == '') {
            $("#hdnRegion").val('');
            $('#regauto').html('');
            $('#regauto').append('<input type="text" class="text-line CName" placeholder="Customer Name" id="txtDoctor"> <input type="hidden" id="hdnDotor" />');
            Batch.GetDoctorName();
        }

    },
    GetBatchAllRegion: function () {
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
                                     var regioncode = response[i].Region_Code;
                                     $('#txtRegion').val(response[i].Region_Name)
                                     $('#hdnRegion').val(response[i].Region_Code)
                                     //$('#txtRegionBatch').val(response[i].Region_Name)
                                     //$('#hdnRegionBatch').val(response[i].Region_Code)
                                 }
                                 doc += "{label:" + '"' + "" + response[i].Region_Name + "" + '",' + "value:" + '"' + "" + response[i].Region_Code + '"' + "}";
                                 if (i < response.length - 1) {
                                     doc += ",";
                                 }
                             }

                             doc += "];";
                             Batch.defaults.Region_Name = eval(doc);
                             var atcObj = new ej.dropdowns.AutoComplete({
                                 //set the data to dataSource property
                                 dataSource: eval(doc),

                                 fields: { text: 'label' },

                                 select: Batch.changeBatch,
                                 focusOut: Batch.RfocusOutfirst,
                             });
                             atcObj.appendTo('#txtRegion');
                             $('#regauto').html('');
                             $('#regauto').append('<input type="text" class="text-line CName" placeholder="Customer Name" id="txtDoctor"> <input type="hidden" id="hdnDotor" />');
                             Batch.GetDoctorName();
                         }
                     
                     },
                     error: function () {

                     }
                 });
    },
    //AutoProduct: function (val) {
    //    autoComplete(Batch.defaults.Product, "productName_", "hdnproductcode_", 'product');

    //},
    SaveBatchDetalis: function () {
        debugger;
        if ($('#hdnDotor').val() == "") {
            swal('Please enter valid Customer Name ', "", "info");
            return false;
        }
        if (CustomerName == '') {
            swal('Please enter Customer Name', "", "info");
            return false;
        }
        var CustomerName = $('#txtDoctor').val().split('(')[0];
        var CustomerCode = $('#hdnDotor').val().split('_')[0];
        var Customer_RegionCode = $('#hdnDotor').val().split('_')[1];
        var BatchName = $('#BatchName').val();
        var NoOfChicks = $('#NoOfChicks').val();
        var StartDate = $('#Start').val();
        var EndDate = $('#End').val();
        var Region_Code = $('#hdnRegion').val();
        var Status = 1;

        if (CustomerCode == "") {
            swal('Please enter valid Customer Name', "", "info");
            return false;
        }
        if ($('#txtRegion').val() == "") {
            swal('Please enter Region Name', "", "info");
            return false;
        }
        if (Region_Code == "") {
            swal('Please enter valid Region Name', "", "info");
            return false;
        }
        if (BatchName == '') {
            swal('Please enter Batch Name', "", "info");
            return false;
        }
        var Chicks = Batch.fnChkSplChar('NoOfChicks');
        if (Chicks == false) {
            swal('Special Characters are not allowed in No Of Chicks', "", "info");
            return false;
        }
        chicks = $('#NoOfChicks').val();
        if (chicks.indexOf("+") != -1) {
            swal('Special Characters are not allowed in No Of Chicks', "", "info");
            return false;
        }
        if (NoOfChicks == '') {
            swal('Please enter No Of Chicks', "", "info");
            return false;
        }
        if (NoOfChicks == 0) {
            swal('Please Enter No Of Chicks greater than Zero', "", "info");
            return false;
        }
        if (StartDate == '') {
            swal('Please enter StartDate', "", "info");
            return false;
        }
        if (EndDate == '') {
            swal('Please enter EndDate', "", "info");
            return false;
        }
        var spec = Batch.fnChkSplChar('BatchName');
        if (spec == false) {
            swal('Special Characters are not allowed in  Batch Name', "", "info");
            return false;
        }
        var region = $.grep(Batch.defaults.Region_Name, function (v) {
            return v.label == $('#txtRegion').val();
        });
        if (region.length == 0) {
            swal('Please enter valid Region Name', "", "info");
            return false;
        }
        var doctor = $.grep(Batch.defaults.d_g, function (v) {
            return v.label == $('#txtDoctor').val();
        });
        if (doctor.length == 0) {
            swal('Please enter valid Customer Name', "", "info");
            return false;
        }

        var _objData = new Object();
        _objData.CustomerName = CustomerName;
        _objData.BatchName = BatchName;
        _objData.NoOfChicks = NoOfChicks;
        _objData.StartDate = StartDate.split('-')[2] + '-' + StartDate.split('-')[1] + '-' + StartDate.split('-')[0];
        _objData.EndDate = EndDate.split('-')[2] + '-' + EndDate.split('-')[1] + '-' + EndDate.split('-')[0];
        _objData.CustomerCode = CustomerCode;
        _objData.Customer_RegionCode = Customer_RegionCode;
        _objData.status = Status;
        _objData.Region_Code = Region_Code;
        _objData.LoginUserCode = LoginUserCode;
        _objData.subDomainName = subDomainName;
        $.ajax(
            {
                type: 'POST',
                data: _objData,
                url: '../GetSaveBatchDetalis',
                success: function (response) {
                    if (response == 1) {
                        swal({
                            title: 'Successfully  Created!!',
                            imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                        });
                        Batch.fnclear();
                        Batch.GetDetailsOfBatch();
                        $("#End").datepicker("destroy");
                        $("#Start").datepicker("destroy");
                        $('#Start').datepicker({
                            dateFormat: 'dd-mm-yy',
                            onSelect: function (selected) {
                                var dates = selected.split('-')[2] + '-' + selected.split('-')[1] + '-' + selected.split('-')[0];
                                var dt = new Date(dates);
                                dt.setDate(dt.getDate() + 1);
                                $("#End").datepicker("option", "minDate", dt);
                            }
                        });
                        $('#End').datepicker({
                            dateFormat: 'dd-mm-yy',
                            onSelect: function (selected) {
                                debugger;
                                var dates = selected.split('-')[2] + '-' + selected.split('-')[1] + '-' + selected.split('-')[0];
                                var dt = new Date(dates);
                                dt.setDate(dt.getDate() - 1);
                                $("#Start").datepicker("option", "maxDate", dt);
                            }
                        });
                    }
                    else {
                        swal('This Batch Name Already Exist', "", "info");
                    }
                },
                error: function () {

                }
            });

    },
    fnclear: function () {
        $('#txtDoctor').val('');
        $('#hdnDotor').val('');
        $('#BatchName').val('');
        $('#NoOfChicks').val('');
        $('#Start').val('');
        $('#End').val('');
        $('#UPtxtDoctor').val('');
        $('#UPhdnDotor').val('');
        $('#UPBatchName').val('');
        $('#UPNoOfChicks').val('');
        $('#UPStart').val('');
        $('#UPEnd').val('');
        $("#End").datepicker("destroy");
        $("#Start").datepicker("destroy");
        $('#Start').datepicker({
            dateFormat: 'dd-mm-yy',
            onSelect: function (selected) {
                var dates = selected.split('-')[2] + '-' + selected.split('-')[1] + '-' + selected.split('-')[0];
                var dt = new Date(dates);
                dt.setDate(dt.getDate() + 1);
                $("#End").datepicker("option", "minDate", dt);
            }
        });
        $('#End').datepicker({
            dateFormat: 'dd-mm-yy',
            onSelect: function (selected) {
                debugger;
                var dates = selected.split('-')[2] + '-' + selected.split('-')[1] + '-' + selected.split('-')[0];
                var dt = new Date(dates);
                dt.setDate(dt.getDate() - 1);
                $("#Start").datepicker("option", "maxDate", dt);
            }
        });
    },

    fnEditBatch: function (Batch_Id, Bstatus) {
        debugger;
        Batch.defaults.BatchID = Batch_Id;
        Batch.defaults.BStatus = Bstatus;
        $("#create").hide();
        $("#fullEdit").show();
        $('#Update').hide();
        $('#addingproduct').html('');
        $('#schDetailBind').html('');
        Batch.fnclearProduct();
        $('#Cregion').html('');
        $('#Cregion').append('<input type="text" class="BRegion" placeholder="Region Name" id="txtRegion"><input type="hidden" id="hdnRegion" />');
        Batch.GetBatchAllRegion();
        var lstBatch = $.grep(Batch.defaults.BatchDetails, function (v) {
            return v.Batch_Id == Batch_Id;
        });
        $('#EDRegion').html(lstBatch[0].Region_Name);
        Batch.GetAllProduct(lstBatch[0].Region_Code);
        $('#EDCustomerName').html(lstBatch[0].Customer_Name);
        $('#EDBNumber').html(lstBatch[0].Batch_Name);
        Batch.defaults.BatchName = lstBatch[0].Batch_Name;

        $('#EDNChicks').html(lstBatch[0].No_Of_Chick);
        $('#EDSDate').html(lstBatch[0].From_Date);
        $('#EDEDate').html(lstBatch[0].To_Date);
        Batch.defaults.EDate = lstBatch[0].To_Date;
        Batch.defaults.SDate = lstBatch[0].From_Date;

        $("#ScheduleSDate").datepicker('destroy');
        $('#ScheduleSDate').datepicker({
            dateFormat: "dd-mm-yy",
            maxDate: new Date(Batch.defaults.EDate.split('-')[1] + '/' + Batch.defaults.EDate.split('-')[0] + '/' + Batch.defaults.EDate.split('-')[2]),
            minDate: new Date(Batch.defaults.SDate.split('-')[1] + '/' + Batch.defaults.SDate.split('-')[0] + '/' + Batch.defaults.SDate.split('-')[2])

        });
        $("#ScheduleEDate").datepicker('destroy');
        $('#ScheduleEDate').datepicker({
            dateFormat: "dd-mm-yy",
            maxDate: new Date(Batch.defaults.EDate.split('-')[1] + '/' + Batch.defaults.EDate.split('-')[0] + '/' + Batch.defaults.EDate.split('-')[2]),
            minDate: new Date(Batch.defaults.SDate.split('-')[1] + '/' + Batch.defaults.SDate.split('-')[0] + '/' + Batch.defaults.SDate.split('-')[2])

        });

        var content = '<Span class="batch">Batch Details</Span>';

        if (lstBatch[0].status == 1) {
            content += '<span class="dot" style="margin-left:10px"></span><Span >Active</Span>';
            $('#ProductAdd').show();
        }
        else {
            content += '<span class="Indot"  style="margin-left:10px"></span><Span>In Active</Span>';
            $('#ProductAdd').hide();
        }
        $('#BatchDetails').html(content);
        Batch.getScheduleDetails();
        $('html,body').animate({
            scrollTop: $("#Edit").offset().top
        },
'slow');
    },
    fnUpdateBatch: function () {
        debugger;

        //autoComplete(Batch.defaults.Region_Name, "UPtxtRegion", "UPhdnRegion", "BRegion");

        var lstBatch = $.grep(Batch.defaults.BatchDetails, function (v) {
            return v.Batch_Id == Batch.defaults.BatchID;
        });

        var lstschedule = $.grep(Batch.defaults.ScheduleDetails.Schedule, function (v) {
            return v.Batch_Id == Batch.defaults.BatchID;
        });
        var editallow = $.grep(lstschedule, function (v) {
            return v.Status == 1;
        });
        $("#create").hide();
        $("#fullEdit").hide();
        $('#Update').show();
        $('#autoregion').html('');
        $('#autoregion').append('<input type="text" class="text-line BRegion" id="UPtxtRegion"><input type="hidden" id="UPhdnRegion" />');
        $("#upauto").html('');
        $("#upauto").append('<input type="text" class="text-line UPCName" id="UPtxtDoctor" placeholder="Customer Name"><input type="hidden" id="UPhdnDotor" />')
        $('#UPtxtRegion').val(lstBatch[0].Region_Name);
        $('#UPhdnRegion').val(lstBatch[0].Region_Code);

        var atcObj = new ej.dropdowns.AutoComplete({
            //set the data to dataSource property
            dataSource: Batch.defaults.Region_Name,

            fields: { text: 'label' },

            select: Batch.Updatechange,
            focusOut: Batch.UpdatefocusOutfirst,
        });
        atcObj.appendTo('#UPtxtRegion');

        if (lstschedule.length == 0) {
            Batch.GetupdateDoctorName();
            $('#UPtxtRegion').prop('disabled', false);
            $('#UPtxtDoctor').prop('disabled', false);
            $('#UPBatchName').prop('disabled', false);
            $('#UPStart').prop('disabled', false);
            $('#UPEnd').prop('disabled', false);
            //$('.statusUpdate').prop('disabled', false);
            $('#UPNoOfChicks').prop('disabled', false);
            $('#UPtxtRegion').css('cursor', 'default');
            $('#UPtxtDoctor').css('cursor', 'default');
            $('#UPBatchName').css('cursor', 'default');
            $('#UPStart').css('cursor', 'default');
            $('#UPEnd').css('cursor', 'default');
            $('#UPNoOfChicks').css('cursor', 'default');
        }
        else if (lstschedule.length != 0 && editallow.length == lstschedule.length) {
            Batch.GetupdateDoctorName("update");
            $('#UPtxtDoctor').prop('disabled', true);
            $('#UPtxtRegion').prop('disabled', true);
            $('#UPtxtRegion').css('cursor', 'not-allowed');

            $('#UPtxtDoctor').css('cursor', 'not-allowed');
            $('#UPBatchName').prop('disabled', true);
            $('#UPBatchName').css('cursor', 'not-allowed');
            $('#UPStart').prop('disabled', true);
            $('#UPStart').css('cursor', 'not-allowed');
            $('#UPEnd').prop('disabled', true);
            $('#UPEnd').css('cursor', 'not-allowed');
            //$('.statusUpdate').prop('disabled', true);
            $('#UPNoOfChicks').prop('disabled', false);
            $('#UPNoOfChicks').css('cursor', 'default');
            $('#UPtxtDoctor').prop('disabled', true);
        }
        else {
            Batch.GetupdateDoctorName("update");
            $('#UPtxtDoctor').prop('disabled', true);
            $('#UPtxtRegion').prop('disabled', true);
            $('#UPtxtRegion').css('cursor', 'not-allowed');

            $('#UPtxtDoctor').css('cursor', 'not-allowed');
            $('#UPBatchName').prop('disabled', true);
            $('#UPBatchName').css('cursor', 'not-allowed');
            $('#UPStart').prop('disabled', true);
            $('#UPStart').css('cursor', 'not-allowed');
            $('#UPEnd').prop('disabled', true);
            $('#UPEnd').css('cursor', 'not-allowed');
            //$('.statusUpdate').prop('disabled', true);
            $('#UPNoOfChicks').prop('disabled', true);
            $('#UPNoOfChicks').css('cursor', 'not-allowed');
            $('#UPtxtDoctor').prop('disabled', true);
        }

        $('#UPhdnDotor').val(lstBatch[0].Customer_RegionCode);
        var doc = lstBatch[0].Customer_Name + "(" + lstBatch[0].Hospital_Name + ")"
        $('#UPtxtDoctor').val(doc);
        $('#UPhdnDotor').val(lstBatch[0].Customer_Code + '_' + lstBatch[0].Customer_RegionCode);
        $('#UPBatchName').val(lstBatch[0].Batch_Name);
        $('#UPNoOfChicks').val(lstBatch[0].No_Of_Chick);
        $('#UPStart').val(lstBatch[0].From_Date);
        $('#UPEnd').val(lstBatch[0].To_Date);
        if (lstBatch[0].status == 1) {
            $('#status1').prop('checked', true);
        }
        else {
            $('#status0').prop('checked', true);
        }
    },
    Updatechange: function (arg) {
        debugger;
        if (arg.itemData != null) {
            $("#UPhdnRegion").val(arg.itemData.value);
            $("#upauto").html('');
            $("#upauto").append('<input type="text" class="text-line UPCName" id="UPtxtDoctor" placeholder="Customer Name"><input type="hidden" id="UPhdnDotor" />')
            Batch.GetupdateDoctorName();
        }
    },
    UpdatefocusOutfirst: function () {
        if ($('#UPtxtRegion').val() == '') {
            $("#UPhdnRegion").val('');
            $("#upauto").html('');
            $("#upauto").append('<input type="text" class="text-line UPCName" id="UPtxtDoctor" placeholder="Customer Name"><input type="hidden" id="UPhdnDotor" />')
            Batch.GetupdateDoctorName();
        }
    },
    UpadteBatchDetails: function () {
        debugger;
        if ($('#UPhdnDotor').val() == "") {
            swal('Please enter valid Customer Name', "", "info");
            return false;
        }
        if (CustomerName == '') {
            swal('Please enter Customer Name', "", "info");
            return false;
        }
        var CustomerName = $('#UPtxtDoctor').val().split('(')[0];;
        var CustomerCode = $('#UPhdnDotor').val().split('_')[0];
        var Customer_RegionCode = $('#UPhdnDotor').val().split('_')[1];
        var BatchName = $('#UPBatchName').val();
        var NoOfChicks = $('#UPNoOfChicks').val();
        var StartDate = $('#UPStart').val();
        var EndDate = $('#UPEnd').val();
        var Region_Code = $('#UPhdnRegion').val();
        var Status = $('.statusUpdate:checked').val();

        if (CustomerCode == "") {
            swal('Please enter valid Customer Name', "", "info");
            return false;
        }
        if ($('#UPtxtRegion').val() == "") {
            swal('Please enter Region Name', "", "info");
            return false;
        }
        if (Region_Code == "") {
            swal('Please enter valid Region Name', "", "info");
            return false;
        }
        if (BatchName == '') {
            swal('Please enter Batch Name', "", "info");
            return false;
        }
        var Chicks = Batch.fnChkSplChar('UPNoOfChicks');
        if (Chicks == false) {
            swal('Special Characters are not allowed in  No Of Chicks', "", "info");
            return false;
        }
        if (NoOfChicks == '') {
            swal('Please enter No Of Chicks', "", "info");
            return false;
        }
        if (NoOfChicks == 0) {
            swal('Please Enter No Of Chicks greater than Zero', "", "info");
            return false;
        }
        if (StartDate == '') {
            swal('Please enter StartDate', "", "info");
            return false;
        }
        if (EndDate == '') {
            swal('Please enter EndDate', "", "info");
            return false;
        }
        var spec = Batch.fnChkSplChar('UPBatchName');
        if (spec == false) {
            swal('Special Characters are not allowed in  Batch Name', "", "info");
            return false;
        }
        var region = $.grep(Batch.defaults.Region_Name, function (v) {
            return v.label == $('#UPtxtRegion').val();
        });
        if (region.length == 0) {
            swal('Enter valid Region Name', "", "info");
            return false;
        }
        var doctor = $.grep(Batch.defaults.d_g, function (v) {
            return v.label == $('#UPtxtDoctor').val();
        });
        if (doctor.length == 0) {
            swal('Enter valid Customer Name', "", "info");
            return false;
        }

        var _objData = new Object();
        _objData.CustomerName = CustomerName;
        _objData.BatchName = BatchName;
        _objData.NoOfChicks = NoOfChicks;
        _objData.StartDate = StartDate.split('-')[2] + '-' + StartDate.split('-')[1] + '-' + StartDate.split('-')[0];
        _objData.EndDate = EndDate.split('-')[2] + '-' + EndDate.split('-')[1] + '-' + EndDate.split('-')[0];
        _objData.CustomerCode = CustomerCode;
        _objData.Customer_RegionCode = Customer_RegionCode;
        _objData.Batch_Id = Batch.defaults.BatchID;
        _objData.Region_Code = Region_Code;
        _objData.status = Status;
        _objData.LoginUserCode = LoginUserCode;
        _objData.subDomainName = subDomainName;
        $.ajax(
            {
                type: 'POST',
                data: _objData,
                url: '../GetUpDateBatchDetalis',
                success: function (response) {
                    if (response == 1) {
                        Batch.GetDetailsOfBatch();
                        swal({
                            title: 'Successfully  Updated',
                            imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                        });
                        Batch.fnclear();
                        Batch.fnEditBatch(Batch.defaults.BatchID, Status);
                    }
                    else {
                        swal('Some Error', "", "error");
                    }
                },
                error: function () {

                }
            });
    },
    fnAddProduct: function () {
        debugger;
        Batch.defaults.P_Id = Batch.defaults.P_Id + 1;
        var content = '<div class="col-md-12 col-xs-12 clearfix Add_' + Batch.defaults.P_Id + '" style="padding:0px;" >';
        content += '<div class="col-xs-1 clearfix form-group" style="padding:0px;"><span><i class="fa fa-search" aria-hidden="true" style="color: #09e5da;"></i></span></div>';
        content += '  <div class="col-xs-6 clearfix form-group" style="padding:0px;margin-right:7px;">';
        content += ' <input type="text" name="product" class="form-control product" placeholder="Select" id="productName_' + Batch.defaults.P_Id + '";>';
        content += ' <input type="hidden" class="hdprod" name="hdproduct" id="hdnproductcode_' + Batch.defaults.P_Id + '" />';
        content += '</div>';
        content += ' <div class="col-xs-3 clearfix form-group" style="padding:0px;">';
        content += '<input type="text" name="dose" class="form-control dose" placeholder="Dose" id="dose_' + Batch.defaults.P_Id + '"">';
        content += '</div>';
        content += '<span><i class="fa fa-trash DeleteProduct" id="delete_' + Batch.defaults.P_Id + '" onclick=Batch.fnDeleteProduct(' + Batch.defaults.P_Id + ') aria-hidden="true" style="color:red;margin-left: 5px;"></i></span><span><i class="fa fa-plus AddProduct" onclick="Batch.fnAddProduct();" aria-hidden="true"  style="color:#09e5da; margin-left: 5px;"></i></span></div>';
        $('#addingproduct').append(content);
    },
    fnDeleteProduct: function (eval) {
        debugger;
        $('.Add_' + eval).remove();
        var pro = $('#pro input[name^=product]').map(function (idx, elem) { return $(elem).val(); }).get();
        if (pro.length == 1) {
            $('#firstpluse').show();
        }
        else {
            $('#firstpluse').hide();
        }
    },
    fnInsertSchedule() {
        debugger;
        $('#SaveSchedule').prop('disabled', true);
        var ScheduleName = $('#ScheduleName').val();
        var StartDate = $('#ScheduleSDate').val();
        var EndDate = $('#ScheduleEDate').val();
        var NumofWeeks = $('#ScheduleNumofWeeks').val();
        var Notes = $('#notes').val();
        var ProdName = $('#pro input[name^=product]').map(function (idx, elem) { return $(elem).val(); }).get();
        var ProdCode = $('#pro input[name^=hdproduct]').map(function (idx, elem) { return $(elem).val(); }).get();
        var dose = $('#pro input[name^=dose]').map(function (idx, elem) { return $(elem).val(); }).get();
        if (ScheduleName == '') {
            swal('Please enter Schedule Name', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (ScheduleName.length >= 300) {
            swal('Minimum 300 Characters are allowed in Schedule Name', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (Batch.defaults.BatchName == ScheduleName) {
            swal('Batch Name and  Schedule Name should not be same', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (StartDate == '') {
            swal('Please enter Start Date', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (EndDate == '') {
            swal('Please enter End Date', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var Weeks = Batch.fnChkSplChar('ScheduleNumofWeeks');
        if (Weeks == false) {
            swal('Special Characters are not allowed in No Of Weeks', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        weeks = $('#ScheduleNumofWeeks').val();
        if (weeks.indexOf("+") != -1) {
            swal('Special Characters are not allowed in No Of Weeks', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (NumofWeeks == '') {
            swal('Please enter the Number of weeks',"","info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (NumofWeeks == 0) {
            swal('Number of weeks should be greater than 0',"","info" );
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var st = new Date(StartDate.split('-')[2] + '-' + StartDate.split('-')[1] + '-' + StartDate.split('-')[0]);
        var Ed = new Date(EndDate.split('-')[2] + '-' + EndDate.split('-')[1] + '-' + EndDate.split('-')[0]);
        if (st > Ed) {
            swal('Start Date Should be greater than End Date', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (Notes.length >= 500) {
            swal('Maximum Character(500) has been exceeded', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var notesck = Batch.fnChkSplChar('notes');
        if (notesck == false) {
            swal('Special Characters are not allowed in  Notes', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var spec = Batch.fnChkSplChar('ScheduleName');
        if (spec == false) {
            swal('Special Characters are not allowed in  Schedule Name', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var arr = [];
        for (var i = 0; i < ProdName.length; i++) {
            if (ProdName[i] != '') {
                var doses = Batch.fnSplChar(dose[i]);
                if (doses == false) {
                    swal('Special Characters are not allowed in Dose', "", "info");
                    $('#SaveSchedule').prop('disabled', false);
                    return false;
                }
                var Product = {
                    "ProductCode": ProdCode[i],
                    "ProductName": ProdName[i],
                    "dose": dose[i]
                }
                var produtcheck = $.grep(Batch.defaults.Product, function (v) {
                    return v.label == ProdName[i]
                });[]
                if (produtcheck.length == 0) {
                    swal('Enter valid Product Name', "", "info");
                    $('#SaveSchedule').prop('disabled', false);
                    return false;
                }
                var produtduplicate = $.grep(arr, function (v) {
                    return v.ProductName == ProdName[i]
                });
                if (produtduplicate.length != 0) {
                    swal('The ' + ProdName[i] + ' is already exist', "", "info");
                    $('#SaveSchedule').prop('disabled', false);
                    return false;
                }

                arr.push(Product);
            }
        }
        if (arr.length == 0) {
            swal('Enter atleast one product', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }

        var lstScheudle = $.grep(Batch.defaults.ScheduleDetails.Schedule, function (v) {
            return v.Schedule_Name == ScheduleName;
        });
        if (lstScheudle.length != 0) {
            swal('Schedule Name is already exist in this batch', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }

        var _objData = new Object();
        _objData.ScheduleName = ScheduleName;
        _objData.StartDate = StartDate.split('-')[2] + '-' + StartDate.split('-')[1] + '-' + StartDate.split('-')[0];
        _objData.EndDate = EndDate.split('-')[2] + '-' + EndDate.split('-')[1] + '-' + EndDate.split('-')[0];
        _objData.Notes = Notes;
        _objData.NumofWeeks = NumofWeeks;
        _objData.Product = JSON.stringify(arr);
        _objData.Batch_Id = Batch.defaults.BatchID;
        _objData.LoginUserCode = LoginUserCode;
        _objData.subDomainName = subDomainName;
        console.log(arr);
        $.ajax(
            {
                type: 'POST',
                data: _objData,
                url: '../GetInsertSchedule',
                success: function (response) {
                    if (response == 1) {
                        swal({
                            title: 'Successfully  Created',
                            imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                        });
                        $('#SaveSchedule').prop('disabled', false);
                        Batch.fnclearProduct();
                        Batch.getScheduleDetails();
                    }
                    else if (response == 100) {
                        swal('This Period for Schedule is already exist', "", "info");
                        $('#SaveSchedule').prop('disabled', false);
                    }
                    else {
                        swal('Some Error', "", "error");
                        $('#SaveSchedule').prop('disabled', false);
                    }
                },
                error: function () {

                },

            }
            )
    },
    getScheduleDetails: function () {
        var _objData = new Object();
        _objData.Batch_Id = Batch.defaults.BatchID;
        _objData.subDomainName = subDomainName;
        $('#schDetailBind').html('');
        Batch.fnclearProduct();
        var chicks = $('#EDNChicks').html();
        $.ajax(
            {
                type: "Post",
                data: _objData,
                url: '../GetScheduledetails',
                success: function (response) {
                    debugger;
                    Batch.defaults.ScheduleDetails = response;
                    if (response.Schedule.length > 0) {
                        $('#schDetailBind').html('');
                        $('#SchDetails').show();
                        var status = '';
                        if (Batch.defaults.BStatus == 0) {
                            for (var i = 0; i < response.Schedule.length; i++) {
                                if (response.Schedule[i].Status == 1) {
                                    status = '<select class="form-control" id="changestatus_' + i + '" ><option value="1">Yet To Start</option></select>';
                                }
                                else if (response.Schedule[i].Status == 2) {
                                    status = '<select class="form-control" id="changestatus_' + i + '"><option value="2" >In Progress</option></select>';
                                }
                                else if (response.Schedule[i].Status == 3) {
                                    status = '<select class="form-control" id="changestatus_' + i + '"><option value="3">Completed</option></select>';
                                }
                                else {
                                    status = '<select class="form-control" id="changestatus_' + i + '" ><option value="0">Skipped</option></select>';
                                }

                                var content = ' <div class="panel panel-default clearfix">';
                                content += ' <div class="panel-heading toggledown clearfix" id="collapse_' + (i + 1) + '" style=" padding: 25px 15px;" >';
                                content += '<span class="collapsebatch" onclick=Batch.fntoogle(' + (i + 1) + ')><a>Schedule Name : <br>' + response.Schedule[i].Schedule_Name + '</a></span>';
                                content += '<span class="status"">Status : </br>' + status + '</span>';
                                content += ' </div>';
                                content += '<div class="col-md-12 clearfix collapse" id="open_' + (i + 1) + '" style="top: 5px;">';
                                if (response.Schedule[i].Status == 1) {
                                    content += '<span id="EditSch" class="editdelete" onclick=Batch.fnScheduleEdit(' + response.Schedule[i].Schedule_Id + ') >Edit</span>';
                                    content += '<span id="DeleteSch" class="editdelete" onclick=Batch.fnScheduleDelete(' + response.Schedule[i].Schedule_Id + ') >Delete</span>';
                                }

                                var lstProduct = $.grep(response.Product, function (v) {
                                    return v.Schedule_Id == response.Schedule[i].Schedule_Id;
                                });
                                var sd = response.Schedule[i].Schedule_Id;
                                content += ' <ul class="list-group">';
                                content += '<li class="list-group-item"><lable>Schedule Name : </lable><lable>' + response.Schedule[i].Schedule_Name + '</lable></li>';
                                content += '<li class="list-group-item"><lable>Start Date : </lable><lable id="start_' + (i + 1) + '">' + response.Schedule[i].Start_Date + '</lable></li>';
                                content += ' <li class="list-group-item"><lable>End Date : </lable><lable id="end_' + (i + 1) + '">' + response.Schedule[i].End_Date + '</lable></li>';
                                content += ' <li class="list-group-item"><lable>No. of Weeks : </lable><lable style="word-wrap: break-word;">' + response.Schedule[i].Num_of_Weeks + '</lable></li>';
                                content += '<li class="list-group-item"><lable>Notes : </lable><lable style="word-wrap: break-word;">' + response.Schedule[i].Notes + '</lable></li>';
                                content += '</ul>';
                                content += '<div style="overflow: scroll;"> <table class="table" id="table_' + i + '" ><thead style="background-color: #337ab7;color: white;"><tr><th>Product Name</th><th>No Of Chicks Serviced</th><th>Dose</th><th>Date</th><th>Remarks</th><th>Activity Details</th></tr></thead>';
                                content += ' <tbody>';
                                for (var j = 0; j < lstProduct.length; j++) {
                                    var value = chicks - lstProduct[j].Product_Quantity;
                                  
                                    content += '<tr><td><input type="hidden" id="ProdID_' + j + '" value="' + lstProduct[j].Product_Id + '" disabled="disabled">' + lstProduct[j].Product_Name + '</td><td style="min-width: 100px;"><input type="text" name="Quantity" class="form-control" placeholder="Quantity" id="Quantity_' + j + '" value="' + value + '" style="cursor:not-allowed;" disabled="disabled">';
                                    content += '</td><td>' + lstProduct[j].Dose + '</td>';
                                    content += '<td><input type="text" class="form-control" placeholder="Date" id="' + sd + 'ProductCal_' + j + '" style="cursor: not-allowed;" disabled="disabled"></td><td><textarea  id="Qnotes_' + j + '" disabled="disabled" style="cursor:not-allowed;"></textarea></td><td>';
                                    content += '<span class="fa fa-info-circle information" onclick=Batch.fnInfoClick(' + lstProduct[j].Product_Id + ',' + Batch.defaults.BatchID + ',' + response.Schedule[i].Schedule_Id + ')></span></td></tr>';

                                    //  content += '<div style="float: right;margin-bottom: 10px;"><button type="button" id="QuantitySave" onclick=Batch.fnQuantitySave(' + i + ',' + response.Schedule[i].Schedule_Id + ') class="buttonSave" style="margin-right: 10px;">Save</button><button type="button" onclick=Batch.fnQuantityCancle(' + i + ')  id="QuantityCancel" class="buttonCancel">Cancel</button></div>';



                                }
                                content += '  </tbody></table></div>';
                                if (response.Schedule[i].Status == 2) {
                                    content += '<div style="float: center;margin-bottom: 10px;"><button type="button" id="QuantitySave" onclick=Batch.fnQuantitySave(' + i + ',' + response.Schedule[i].Schedule_Id + ') class="btn btn-primary buttonSave" style="margin-right: 10px;">Save</button><button type="button" onclick=Batch.fnQuantityCancle(' + i + ')  id="QuantityCancel" class="btn btn-primary buttonCancel">Cancel</button></div>';
                                }

                                content += '</div>';
                                content += '</div>';
                                //content += '</div>';
                                $('#schDetailBind').append(content);
                                $(".QuantityDate").datepicker('destroy');
                                $(".QuantityDate").datepicker({
                                    dateFormat: "dd-mm-yy",
                                });
                            }
                        }
                        else {
                            for (var i = 0; i < response.Schedule.length; i++) {
                                if (response.Schedule[i].Status == 1) {
                                    status = '<select class="form-control" id="changestatus_' + i + '" onchange=Batch.fnstatuschange("' + i + '","' + response.Schedule[i].Schedule_Id + '","' + response.Schedule[i].Status + '")><option value="1">Yet To Start</option><option value="2">In Progress</option><option value="0">Skipped</option></select>';
                                }
                                else if (response.Schedule[i].Status == 2) {
                                    status = '<select class="form-control" id="changestatus_' + i + '" onchange=Batch.fnstatuschange("' + i + '","' + response.Schedule[i].Schedule_Id + '","' + response.Schedule[i].Status + '")><option value="2" >In Progress</option><option value="3">Completed</option><option value="0">Skipped</option></select>';
                                }
                                else if (response.Schedule[i].Status == 3) {
                                    status = '<select class="form-control" id="changestatus_' + i + '" onchange=Batch.fnstatuschange("' + i + '","' + response.Schedule[i].Schedule_Id + '","' + response.Schedule[i].Status + '")><option value="3">Completed</option></select>';
                                }
                                else {
                                    status = '<select class="form-control" id="changestatus_' + i + '" onchange=Batch.fnstatuschange("' + i + '","' + response.Schedule[i].Schedule_Id + '","' + response.Schedule[i].Status + '")><option value="0">Skipped</option></select>';
                                }

                                var content = ' <div class="panel panel-default clearfix">';
                                content += '<div class="panel-heading toggledown clearfix" id="collapse_' + (i + 1) + '" style=" padding: 25px 15px;" ><span class="collapsebatch" onclick=Batch.fntoogle(' + (i + 1) + ')><a>Schedule Name : <br>' + response.Schedule[i].Schedule_Name + '</a></span><span class="status"">Status : </br>' + status + '</span></div>';
                                content += '<div class="col-md-12 clearfix collapse" id="open_' + (i + 1) + '" style="top: 5px;">';
                                if (response.Schedule[i].Status == 1) {
                                    content += '<span id="EditSch" class="editdelete" onclick=Batch.fnScheduleEdit(' + response.Schedule[i].Schedule_Id + ') >Edit</span>';
                                    content += '<span id="DeleteSch" class="editdelete" onclick=Batch.fnScheduleDelete(' + response.Schedule[i].Schedule_Id + ') >Delete</span>';
                                }

                                var lstProduct = $.grep(response.Product, function (v) {
                                    return v.Schedule_Id == response.Schedule[i].Schedule_Id;
                                });
                                var sd = response.Schedule[i].Schedule_Id;
                                content += ' <ul class="list-group">';
                                content += '<li class="list-group-item"><lable>Schedule Name : </lable><lable>' + response.Schedule[i].Schedule_Name + '</lable></li>';
                                content += '<li class="list-group-item"><lable>Start Date : </lable><lable id="start_' + (i + 1) + '">' + response.Schedule[i].Start_Date + '</lable></li>';
                                content += ' <li class="list-group-item"><lable>End Date : </lable><lable id="end_' + (i + 1) + '">' + response.Schedule[i].End_Date + '</lable></li>';
                                content += ' <li class="list-group-item"><lable>No. of Weeks : </lable><lable style="word-wrap: break-word;">' + response.Schedule[i].Num_of_Weeks + '</lable></li>';
                                content += '<li class="list-group-item"><lable>Notes : </lable><lable style="word-wrap: break-word;">' + response.Schedule[i].Notes + '</lable></li>';
                                content += '</ul>';
                                content += '<div style="overflow: auto;"> <table class="table" id="table_' + i + '" ><thead style="background-color: #337ab7;color: white;"><tr><th>Product Name</th><th>No Of Chicks Serviced</th><th>Dose</th><th>Date</th><th>Remarks</th><th>Activity Details</th></tr></thead>';
                                content += ' <tbody>';
                                for (var j = 0; j < lstProduct.length; j++) {
                                    var value = chicks - lstProduct[j].Product_Quantity;
                                    if (response.Schedule[i].Status == 2) {
                                        content += '<tr><td style="min-width: 100px;"><input type="hidden" id="ProdID_' + j + '" value="' + lstProduct[j].Product_Id + '">' + lstProduct[j].Product_Name + '</td><td style="min-width: 100px;">';
                                        if (value == 0) {
                                            content += '<input type="number" name="Quantity" class="form-control" placeholder="' + value + '" id="Quantity_' + j + '" value="" style="cursor:not-allowed;" disabled="disabled"><input type="hidden" name="hdQuantity" class="form-control" value="' + value + '" id="Served_' + j + '" >';
                                            content += '</td><td>' + lstProduct[j].Dose + '</td>';
                                            content += '<td style="min-width: 114px;"><input type="text" class="form-control QuantityDate" placeholder="Date" id="' + sd + 'ProductCal_' + j + '"  disabled="disabled"></td><td><textarea  id="Qnotes_' + j + '" disabled="disabled" ></textarea></td><td>';
                                        }
                                        else {
                                            content += '<input type="number" name="Quantity" class="form-control" placeholder="' + value + '" id="Quantity_' + j + '" value="" ><input type="hidden" name="hdQuantity" class="form-control" value="' + value + '" id="Served_' + j + '" >';
                                            $('#' + sd + 'ProductCal_' + j).prop('disabled', false);
                                            content += '</td><td>' + lstProduct[j].Dose + '</td>';
                                            content += '<td style="min-width: 114px;"><input type="text" class="form-control QuantityDate" placeholder="Date" id="' + sd + 'ProductCal_' + j + '"></td><td><textarea  id="Qnotes_' + j + '" ></textarea></td><td>';
                                        }
                                    }
                                    else {
                                        content += '<tr><td><input type="hidden" id="ProdID_' + j + '" value="' + lstProduct[j].Product_Id + '" disabled="disabled">' + lstProduct[j].Product_Name + '</td><td style="min-width: 100px;"><input type="text" name="Quantity" class="form-control" placeholder="Quantity" id="Quantity_' + j + '" value="' + value + '" style="cursor:not-allowed;" disabled="disabled">';
                                        content += '</td><td>' + lstProduct[j].Dose + '</td>';
                                        content += '<td style="min-width: 114px;"><input type="text" class="form-control" placeholder="Date" id="' + sd + 'ProductCal_' + j + '" cursor: not-allowed;" disabled="disabled"></td><td><textarea  id="Qnotes_' + j + '" disabled="disabled" style="cursor:not-allowed;"></textarea></td><td>';


                                        //  content += '<div style="float: right;margin-bottom: 10px;"><button type="button" id="QuantitySave" onclick=Batch.fnQuantitySave(' + i + ',' + response.Schedule[i].Schedule_Id + ') class="buttonSave" style="margin-right: 10px;">Save</button><button type="button" onclick=Batch.fnQuantityCancle(' + i + ')  id="QuantityCancel" class="buttonCancel">Cancel</button></div>';
                                    }
                                    content += '<span class="fa fa-info-circle information" onclick=Batch.fnInfoClick(' + lstProduct[j].Product_Id + ',' + Batch.defaults.BatchID + ',' + response.Schedule[i].Schedule_Id + ')></span></td></tr>';

                                }
                                content += '  </tbody></table></div>';
                                if (response.Schedule[i].Status == 2) {
                                    content += '<div style="float: center;margin-bottom: 10px;"><button type="button" id="QuantitySave" onclick=Batch.fnQuantitySave(' + i + ',' + response.Schedule[i].Schedule_Id + ') class="btn btn-primary buttonSave" style="margin-right: 10px;">Save</button><button type="button" onclick=Batch.fnQuantityCancle(' + i + ')  id="QuantityCancel" class="btn btn-primary buttonCancel">Cancel</button></div>';
                                }

                                content += '</div>';
                                content += '</div>';
                                //content += '</div>';
                                $('#schDetailBind').append(content);
                                var Qual = $('#table_' + i + ' input[name^=hdQuantity]').map(function (idx, elem) { return $(elem).val(); }).get();
                                var Qlength = $.grep(Qual, function (v) {
                                    return v == 0;
                                });
                                if (Qlength.length != lstProduct.length) {
                                    $('#QSavehide_' + i).show();
                                }
                                else {
                                    $('#QSavehide_' + i).hide();
                                }
                                $('.QuantityDate').datepicker({
                                    dateFormat: "dd-mm-yy",
                                });
                            }
                        }
                      
                    }
                    else {
                        $('#SchDetails').hide();
                    }
                },
                error: function () {

                }


            });
    },
    fnstatuschange: function (id, Schedule_Id, PreStatus) {
        debugger;
        var Status = $('#changestatus_' + id).val();
        Batch.defaults.PreStatus = PreStatus;
        $.ajax({
            type: "POST",
            data: 'Schedule_Id=' + Schedule_Id + '&subDomainName=' + subDomainName,
            url: '../GetScheduleStatus',
            success: function (response) {
                if (Status == 0) {
                    if (response > 0) {
                        swal('The Schedule is already started. You cant able to skip', "", "info");
                        $('#changestatus_' + id).val(PreStatus);
                        return false;
                    }
                    else {
                        $('#Remark').show();
                        $('#RemarkNotes').val('');
                        Batch.defaults.Remark_ID = id;
                        Batch.defaults.Remark_Schedule = Schedule_Id;
                    }
                }
                else if (Status == 3) {
                    if (response == 0) {
                        swal('You need to enter the quantity for atleast one Product then only you can change the status of the schedule', "", "");
                        $('#changestatus_' + id).val(PreStatus);
                        return false;
                    }
                    else {
                        $('#Remark').show();
                        $('#RemarkNotes').val('');
                        Batch.defaults.Remark_ID = id;
                        Batch.defaults.Remark_Schedule = Schedule_Id;
                    }
                }
                else {
                    $('#Remark').show();
                    Batch.defaults.Remark_ID = id;
                    Batch.defaults.Remark_Schedule = Schedule_Id;
                }

            },
            error: function () {

            }

        })

    },
    fnRemarkClose: function () {
        $('#Remark').hide();
        $('#RemarkNotes').val('');
        var id = Batch.defaults.Remark_ID;
        $('#changestatus_' + id).val(Batch.defaults.PreStatus);
    },
    fnRemarkStatusChange: function () {
        var id = Batch.defaults.Remark_ID;
        var Schedule_Id = Batch.defaults.Remark_Schedule;
        var Remarks = $('#RemarkNotes').val();
        if (Remarks == '') {
            swal('Please fill the Remarks column', "", "info");
            return false;
        }
        var Remark = Batch.fnChkSplChar('RemarkNotes');
        if (Remark == false) {
            swal('Special Characters are not allowed  in Remarks', "", "info");
            return false;
        }
        var Status = $('#changestatus_' + id).val();
        $.ajax(
                    {
                        type: "Post",
                        data: 'Schedule_Id=' + Schedule_Id + '&Status=' + Status + '&Remark=' + Remarks + '&User_Code' + LoginUserCode + '&subDomainName=' + subDomainName,
                        url: '../GetChangeScheduleStatus',
                        success: function (response) {
                            swal({
                                title: 'Status Successfully Updated',
                                imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                            });
                            Batch.getScheduleDetails();
                            $('#Remark').hide();
                            $('#RemarkNotes').val('');
                        },
                        error: function () {

                        }
                    });
    },
    fntoogle: function (id) {
        $(".collapse").slideUp();
        $("#open_" + id + "").toggle();
        Batch.defaults.ScheduleSDate = $('#start_' + id).html();
        Batch.defaults.ScheduleEDate = $('#end_' + id).html();
    },
    fnQuantitySave: function (id, Schedule_Id) {
        debugger;
        $('#QuantitySave').prop('disabled', true);
        var trn = $("#table_" + id + " tbody tr").length;
        var value = {};
        var arr = [];
        for (var i = 0; i < trn; i++) {
            if (parseInt($('#table_' + id + ' #Quantity_' + i).val()) != 0 && $('#table_' + id + ' #Quantity_' + i).val() != '') {


                var date = $('#' + Schedule_Id + 'ProductCal_' + i).val();
                if (date == '') {
                    swal('Please Enter Date', "", "info");
                    $('#QuantitySave').prop('disabled', false);
                    return false;

                }
                if (parseInt($('#EDNChicks').html()) < parseInt($('#table_' + id + ' #Quantity_' + i).val())) {
                    swal('Please fill quantity less than No.of Chicks in the Batch', "", "info");
                    $('#QuantitySave').prop('disabled', false);
                    return false;

                }
                var QuCheck = Batch.fnChkSplChar('table_' + id + ' #Quantity_' + i);
                if (QuCheck == false) {
                    swal('Special Characters are not allowed  in No Of Chicks Serviced', "", "info");
                    $('#QuantitySave').prop('disabled', false);
                    return false;
                }
                var Remark = Batch.fnChkSplChar('table_' + id + ' #Qnotes_' + i);
                if (Remark == false) {
                    swal('Special Characters are not allowed  in Remarks', "", "info");
                    $('#QuantitySave').prop('disabled', false);
                    return false;
                }
                value = {
                    "Batch_Id": Batch.defaults.BatchID,
                    "Schedule_Id": Schedule_Id,
                    "ProductID": $('#table_' + id + ' #ProdID_' + i).val(),
                    "Quantity": $('#table_' + id + ' #Quantity_' + i).val(),
                    "Date": date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0],
                    "Remark": $('#table_' + id + ' #Qnotes_' + i).val(),
                }
                arr.push(value);
            }

        }
        if (arr.length == 0) {
            swal('Please Enter Quantity For  No Of Chicks Serviced', "", "info");
            $('#QuantitySave').prop('disabled', false);
            return false;
        }
        var _objData = new Object();
        _objData.LoginUserCode = LoginUserCode;
        _objData.subDomainName = subDomainName;
        _objData.Product = JSON.stringify(arr);
        $.ajax(
           {
               type: "Post",
               data: _objData,
               url: '../GetInsertQuantity',
               success: function (response) {
                   if (response == 1) {
                       swal({
                           title: 'Successfully  Inserted',
                           imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                       });
                       Batch.fnQuantityCancle(id);
                       $('#QuantitySave').prop('disabled', false);
                       Batch.getScheduleDetails();
                   }
               },
               error: function (response) {
                   $('#QuantitySave').prop('disabled', false);
               }
           });

    },
    fnInfoClick: function (Product_Id, Batch_Id, Schedule_Id) {
        $.ajax(
          {
              type: "Post",
              data: "Product_Id=" + Product_Id + "&Batch_Id=" + Batch_Id + "&Schedule_Id=" + Schedule_Id + '&subDomainName=' + subDomainName,
              url: '../GetInformation',
              success: function (response) {
                  debugger;
                  var content = '';
                  if (response.length > 0) {
                      content += ' <table class="table table-bordered" ><thead style="background-color: #337ab7;color: white;"><tr><th>Quantity</th><th>Date</th><th>Remarks</th></tr></thead>';
                      content += ' <tbody>';
                      for (var i = 0; i < response.length; i++) {
                          content += '<tr><td>' + response[i].Product_Quantity + '</td><td>' + response[i].Date + '</td><td>' + response[i].Remarks + '</td></tr>';
                      }

                      content += '  </tbody></table>';
                  }
                  else {
                      content += '<span>No Data Found</span>';
                  }
                  $('#BatchQuality').show();
                  $('#tblProductBatchInfo').html(content);
              },
              error: function (response) {

              }
          });
    },
    fnQuantityCancle: function (id) {
        var trn = $("#table_" + id + " tbody tr").length;
        for (var i = 0; i < trn; i++) {
            $('.QuantityDate').val('');
            $('#table_' + id + ' #Quantity_' + i).val('')
            $('#table_' + id + ' #Qnotes_' + i).val('');
        }
        Batch.getScheduleDetails();
    },
    fnScheduleEdit: function (Schedule_Id) {
        debugger;
        Batch.defaults.ScheduleId = Schedule_Id;
        var lstSchedule = $.grep(Batch.defaults.ScheduleDetails.Schedule, function (v) {
            return v.Schedule_Id == Schedule_Id;
        });
        var lstProduct = $.grep(Batch.defaults.ScheduleDetails.Product, function (v) {
            return v.Schedule_Id == Schedule_Id;
        });
        //$('#editschedule').html('Edit');
        $('#SaveSchedule').html('Update');
        $('#ScheduleName').val(lstSchedule[0].Schedule_Name);
        $('#ScheduleSDate').val(lstSchedule[0].Start_Date);
        $('#ScheduleEDate').val(lstSchedule[0].End_Date);
        $('#ScheduleNumofWeeks').val(lstSchedule[0].Num_of_Weeks);
        $('#notes').val(lstSchedule[0].Notes);
        $('#addingproduct').html('');
        var number = '';
        for (var i = 0; i < lstProduct.length; i++) {
            number = i + 1;
            if (i <= 1) {
                $('#productName_' + number).val(lstProduct[i].Product_Name);
                $('#hdnproductcode_' + number).val(lstProduct[i].Product_Code);
                $('#dose_' + number).val(lstProduct[i].Dose);
            }
            else {
                var content = '<div class="col-md-12 clearfix Add_' + number + '" style="padding:0px;" >';
                content += '<div class="col-xs-1 clearfix form-group" style="padding:0px;"><span><i class="fa fa-search" aria-hidden="true" style="color: #09e5da;"></i></span></div>';
                content += ' <div class="col-xs-6 clearfix form-group" style="padding:0px;margin-right:7px;">';
                content += ' <input type="text" name="product" class="form-control product" style="width:49%" placeholder="Select" id="productName_' + number + '" >';
                content += ' <input type="hidden" class="hdprod" name="hdproduct" id="hdnproductcode_' + number + '" />';
                content += '</div>';
                content += '<div class="col-xs-3 clearfix form-group" style="padding:0px;">';
                content += '<input type="text" name="dose" class="form-control dose" placeholder="Dose" id="dose_' + number + '"">';
                content += '</div>';
                content += '<span><i class="fa fa-trash DeleteProduct" id="delete_' + number + '" onclick=Batch.fnDeleteProduct(' + number + ') aria-hidden="true" style="color:red;margin-left: 5px;"></i></span><span><i class="fa fa-plus AddProduct" onclick="Batch.fnAddProduct();" aria-hidden="true"  style="color:#09e5da; margin-left: 5px;"></i></span></div>';
                $('#addingproduct').append(content);
                $('#productName_' + number).val(lstProduct[i].Product_Name);
                $('#hdnproductcode_' + number).val(lstProduct[i].Product_Code);
                $('#dose_' + number).val(lstProduct[i].Dose);
            }

        }
        $('html,body').animate({
            scrollTop: $("#ProductAdd").offset().top
        },
'slow');
    },
    fnScheduleDelete: function (Schedule_Id) {
        debugger;
        $.ajax({
            type: 'POST',
            data: 'Schedule_Id=' + Schedule_Id + '&subDomainName=' + subDomainName,
            url: '../GetDeleteSchedule',
            success: function (response) {
                swal({
                    title: 'Successfully  Deleted',
                    imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                });
                Batch.getScheduleDetails();
            },
            error: function (response) {

            }
        })
    },
    fnclearProduct: function () {
        $('#ScheduleName').val('');
        $('#ScheduleSDate').val('');
        $('#ScheduleEDate').val('');
        $('#notes').val('');
        $('#ScheduleNumofWeeks').val('');
        $('#addingproduct').html('');
        $('.product  ').val('');
        $('.hdprod').val('');
        $('.dose').val('');
        $('#editschedule').html('');
        $('#SaveSchedule').html('Save');
    },
    fnUpdateSchedule: function () {
        debugger;
        $('#SaveSchedule').prop('disabled', true);
        var ScheduleName = $('#ScheduleName').val();
        var StartDate = $('#ScheduleSDate').val();
        var EndDate = $('#ScheduleEDate').val();
        var NumofWeeks = $('#ScheduleNumofWeeks').val();
        var Notes = $('#notes').val();
        var ProdName = $('#pro input[name^=product]').map(function (idx, elem) { return $(elem).val(); }).get();
        var ProdCode = $('#pro input[name^=hdproduct]').map(function (idx, elem) { return $(elem).val(); }).get();
        var dose = $('#pro input[name^=dose]').map(function (idx, elem) { return $(elem).val(); }).get();
        if (ScheduleName == '') {
            swal('Please enter Schedule Name', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (Batch.defaults.BatchName == ScheduleName) {
            swal('Batch Name and  Schedule Name should not be same', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (StartDate == '') {
            swal('Please enter Start Date', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (EndDate == '') {
            swal('Please enter End Date', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var Weeks = Batch.fnChkSplChar('ScheduleNumofWeeks');
        if (Weeks == false) {
            swal('Special Characters are not allowed in No Of Weeks', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        weeks = $('#ScheduleNumofWeeks').val();
        if (weeks.indexOf("+") != -1) {
            swal('Special Characters are not allowed in No Of Weeks', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (NumofWeeks == '') {
            swal( 'Please enter Number of Weeks',"","info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (NumofWeeks == 0) {
            swal('Number of weeks should be greater than 0',"","info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        if (Notes.length >= 500) {
            swal('Maximum Character(500) has been exceeded', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var arr = [];
        for (var i = 0; i < ProdName.length; i++) {
            if (ProdName[i] != '') {
                var Product = {
                    "ProductCode": ProdCode[i],
                    "ProductName": ProdName[i],
                    "dose": dose[i]
                }
                var produtcheck = $.grep(Batch.defaults.Product, function (v) {
                    return v.label == ProdName[i]
                });
                if (produtcheck.length == 0) {
                    swal('Enter valid Product Name', "", "info");
                    $('#SaveSchedule').prop('disabled', false);
                    return false;
                }
                var produtduplicate = $.grep(arr, function (v) {
                    return v.ProductName == ProdName[i]
                });
                if (produtduplicate.length != 0) {
                    swal('The ' + ProdName[i] + ' is already exist', "", "info");
                    $('#SaveSchedule').prop('disabled', false);
                    return false;
                }
                arr.push(Product);
            }
        }
        if (arr.length == 0) {
            swal('Enter atleast one product', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var spec = Batch.fnChkSplChar('ScheduleName');
        if (spec == false) {
            swal('Special Characters are not allowed in  Schedule Name', "", "info");
            $('#SaveSchedule').prop('disabled', false);
            return false;
        }
        var _objData = new Object();
        _objData.ScheduleName = ScheduleName;
        _objData.StartDate = StartDate.split('-')[2] + '-' + StartDate.split('-')[1] + '-' + StartDate.split('-')[0];
        _objData.EndDate = EndDate.split('-')[2] + '-' + EndDate.split('-')[1] + '-' + EndDate.split('-')[0];
        _objData.Notes = Notes;
        _objData.NumofWeeks = NumofWeeks;
        _objData.Product = JSON.stringify(arr);
        _objData.Batch_Id = Batch.defaults.BatchID;
        _objData.Schedule_Id = Batch.defaults.ScheduleId;
        _objData.LoginUserCode = LoginUserCode;
        _objData.subDomainName = subDomainName;
        console.log(arr);
        $.ajax(
            {
                type: 'POST',
                data: _objData,
                url: '../GetUpdateSchedule',
                success: function (response) {
                    if (response == 1) {
                        swal({
                            title: 'Successfully  Updated',
                            imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                        });
                        Batch.fnclearProduct();
                        Batch.getScheduleDetails();
                        $('#SaveSchedule').prop('disabled', false);
                    }
                    else if (response == 100) {
                        swal('This Period for Schedule is already exist', "", "info");
                        $('#SaveSchedule').prop('disabled', false);
                    }
                    else {
                        swal('Some Erro', "", "error");
                        $('#SaveSchedule').prop('disabled', false);
                    }
                },
                error: function () {

                },

            }
            )
    },
    fnChkSplChar: function (id) {

        debugger;
        if ($('#' + id).val() != "") {
            var value = $('#' + id).val();
            var specialCharregex = new RegExp("^[a-zA-Z0-9 ]+$");
            if (!specialCharregex.test(value)) {
                return false;
            }
            else {
                return true;
            }
        }
    },
    fnSplChar: function (value) {
        if (value != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9 ]+$");
            if (!specialCharregex.test(value)) {
                return false;
            }
            else {
                return true;
            }
        }
    }

}

function fnValidateWeek(Id, evt) {
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 4) {
            return false;

        }
        $('#ScheduleNumofWeeks').bind("cut copy paste", function (e) {
            e.preventDefault();
        });
    }
}
