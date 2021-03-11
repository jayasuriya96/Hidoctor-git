//CREATED BY :SRISUDHAN//

//get the Sales Type Product Detail//

var product_Mapping = {
    fnGetSourceProductType: function () {
        debugger;
        var html = "";
        html += "<option value=''>-Select Product Type-</option>";
        html += "<option value='Sales'>Sales</option>";
        html += "<option value='Activity'>Activity</option>";

        $("#src_product_type").append(html);
    },

    fnGetProductTypelstForDes: function () {
        debugger;
        $('#dvTable').html('');
        $('#dvTable1').html('');
        var product_Type = $("#src_product_type").val();
        if (product_Type == '') {
            product_Type = "Sales";
        }
        $.ajax({
            url: '../HiDoctor_Master/SalestypeMappng/GetProductTypelstForDes',
            type: 'GET',
            data: 'product_Type=' + product_Type,
            success: function (JsonResult) {
                debugger;
                var prdDesdrpDown = "";
                if (JsonResult.length > 0) {
                    prdDesdrpDown += "<option value=''>-Select Product Type-</option>";
                    for (var i = 0; i < JsonResult.length; i++) {
                        prdDesdrpDown += "<option value=" + JsonResult[i].Product_Type_Name + ">" + JsonResult[i].Product_Type_Name + "</option>";
                    }
                    $("#des_product_type").html(prdDesdrpDown);
                }
                else {
                    prdDesdrpDown += "<option value=''>-Select Product Type-</option>";
                    $("#des_product_type").html(prdDesdrpDown);
                }
            },
            error: function () {
                fnMsgAlert('error', 'Error', 'An error occurred while fetching product types for destination');
            }
        });
    },

    fnGetSourceProductList: function () {
        $('#dvTable').html('');
        var Src_Prd_Type = $('#src_product_type').val();
        if (Src_Prd_Type != '') {
            debugger;
            $.ajax({
                url: '../HiDoctor_Master/SalestypeMappng/GetSourceProductList',
                type: 'GET',
                data: 'Src_Prd_Type=' + Src_Prd_Type,
                success: function (JsonResult) {
                    debugger;
                    var content = "";
                    content += "<table class='data display datatable' id='tbl_product'>";
                    content += "<thead>";
                    content += "<th colspan='4'>" + Src_Prd_Type + " Type Product Detail</th>";
                    content += "<tr>";
                    content += "<th> </th>";
                    content += "<th>ProductName</th>";
                    content += "<th>BrandName</th>";
                    content += "<th>SpecialityName</th>";
                    content += "</tr>";
                    content += "</thead>";
                    content += "<tbody>";
                    for (var i = 0; i < JsonResult.length; i++) {
                        content += "<tr>";
                        content += "<td><input type='radio' name='rbn_product' onclick='product_Mapping.fnGetDestinationProductList();'  value='" + JsonResult[i].Product_code + "'/> </td>";
                        content += "<td>";
                        content += JsonResult[i].Product_Name;
                        content += "</td>";
                        content += "<td>";
                        content += JsonResult[i].Brand_Name;
                        content += "</td>";
                        content += "<td>";
                        content += JsonResult[i].Speciality_Name;
                        content += "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody>";
                    content += "</table>";

                    $('#dvTable').html(content);
                    $('#dvTable').show();
                    $('#btnSave').show();
                    if ($.fn.dataTable) { $('#tbl_product').dataTable({ bPaginate: false, "sScrollY": "500px" }); };
                },
                error: function () {
                    fnMsgAlert('error', 'Error', 'Failed to bind ' + Src_Prd_Type + ' type list');
                    return false;
                }
            });
        }
        else {
            fnMsgAlert('info', 'Info', 'Plese select a Source Product Type');
            return false;
        }
    },

    fnGetDestinationProductList: function () {
        var des_product_type = $('#des_product_type').val();
        var product_code = $("input[name='rbn_product']:checked").val();
        if (des_product_type != '') {
            $.ajax({
                url: '../HiDoctor_Master/SalestypeMappng/GetDestinationProductList',
                type: 'GET',
                data: 'product_code=' + product_code + '&des_product_type=' + des_product_type,
                success: function (JsonResult) {
                    debugger;
                    var content = "";
                    content += "<table class='data display datatable' id='tbl_pro'>";
                    content += "<thead>";
                    content += "<th colspan='8'>" + des_product_type + " Type Product Detail</th>";
                    content += "<tr>";
                    content += "<th><input type='checkbox' id='chk_product_nonsale' onclick='product_Mapping.fnselectall();' name='chk_pro'></th>";
                    content += "<th>ProductName</th>";
                    content += "<th>BrandName</th>";
                    content += "<th>SpecialityName</th>";
                    if (des_product_type == "Competitor") {
                        content += "<th>CompanyName</th>";
                    }
                    content += "<th>UOM</th>";
                    content += "<th>UOMTYPE</th>";
                    content += "</tr>";
                    content += "</thead>";
                    content += "<tbody>";
                    for (var i = 0; i < JsonResult.length; i++) {
                        content += "<tr>";
                        content += "<td><input type='checkbox' id='chk_productCode_" + i + "' class='case' name='chk_product_nonsale' value='" + JsonResult[i].Product_code + "'/> </td>";
                        content += "<td>";
                        content += JsonResult[i].Product_Name;
                        content += "</td>";
                        content += "<td>";
                        content += JsonResult[i].Brand_Name;
                        content += "</td>";
                        content += "<td>";
                        content += JsonResult[i].Speciality_Name;
                        content += "</td>";
                        if (des_product_type == "Competitor") {
                            content += "<td>";
                            content += JsonResult[i].Competitor_Name;
                            content += "</td>";
                        }
                        content += "<td>";
                        content += JsonResult[i].UOM_Name;
                        content += "</td>";
                        content += "<td>";
                        content += JsonResult[i].UOM_Type_Name;
                        content += "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody>";
                    content += "</table>";

                    $('#dvTable1').html(content);
                    $('#dvTable1').show();

                    for (var i = 0; i < JsonResult.length; i++) {
                        if (JsonResult[i].Product_code == $("#chk_productCode_" + i).val())
                            if (JsonResult[i].Mapped_Status == "Mapped") {
                                $("#chk_productCode_" + i).prop('checked', true);
                            }
                    }
                    if ($.fn.dataTable) { $('#tbl_pro').dataTable({ bPaginate: false, "sScrollY": "500px" }); };
                    $('#div_Save').show();
                },
                error: function () {
                    fnMsgAlert('error', 'Error', 'Failed to bind ' + des_product_type + ' type list');
                    return false;
                }
            });
        }
        else {
            fnMsgAlert('info', 'Info', 'Please select a Destination Product Type');
            return false;
        }
    },

    fnselectallproduct: function () {
        debugger;
        $('#dvTable1').hide();
        $("#frmloading").show();
        $.ajax({
            type: 'GET',
            url: '../HiDoctor_Master/SalestypeMappng/GetAllSelectProductlst',
            data: "Souce_Product_Code=" + $("input[name='rbn_product']:checked").val(),
            success: function (result) {
                debugger;
                var length = $("#tbl_pro tr").length;
                //product_Mapping.fnCancel();
                for (var i = 0; i < length ; i++) {
                    var prodCode = $("#chk_productCode_" + i).val();

                    var dJsonData = jsonPath(data, "$.[?(@.SalesMappingcode=='" + prodCode + "')]");

                    if (dJsonData != false && dJsonData.length > 0) {
                        $("#chk_productCode_" + i).attr('checked', true);
                    }

                }
                $('#dvTable1').show();
                $("#frmloading").hide();
            },
            error: function () {
                fnMsgAlert('error', 'Error', 'An error occurred while recovering mapped record data');
                return false;
            }
        })
    },

    fnSave: function () {
        debugger;
        var ProductMappingcode = "";
        var productCode = "";
        if (!$("input[name='rbn_product']").is(":checked")) {
            fnMsgAlert('ingo', 'Info', 'Please Select the sales type product Name');
            return false;
        }
        $("input:checkbox[name='chk_product_nonsale']").each(function () {
            if (this.checked) {
                ProductMappingcode += "" + $(this).val() + ",";
            }
        });
        ProductMappingcode = ProductMappingcode.slice(0, -1);
        debugger;
        productCode = $('input[name="rbn_product"]:checked').val();
        if (ProductMappingcode != "") {
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/SalestypeMappng/productInsert",
                data: "ProductCode=" + $('input[name="rbn_product"]:checked').val() + "&MappingCode=" + ProductMappingcode + "" + "&Src_Product_Type=" + $('#src_product_type').val() + "&Des_Product_Type=" + $('#des_product_type').val(),
                success: function (data) {
                    debugger;
                    fnMsgAlert('success', 'Success', 'Saved Successfully');
                    $("#dvTable1 input[type=checkbox]").prop("checked", false);
                    $('#dvTable1').html('');
                    //product_Mapping.fnCancel();
                    //product_Mapping.fnremove();
                },
                error: function () {
                }
            });
        }
        else {
            fnMsgAlert('info', 'Info', 'Please select the Mapping ProductName');
            return false;
        }
    },

    fnselectall: function () {
        // Select All.
        debugger;
        if ($('#chk_product_nonsale').prop('checked') == true) {
            $('#dvTable1 input[type=checkbox]').prop('checked', true);
        }
        else {
            $('#dvTable1 input[type=checkbox]').prop('checked', false);
        }
    },

    fnClear: function () {
        $('#dvTable').html('');
        $('#dvTable1').html('');
    }
}

//function getproduct() {
//    $.ajax({
//        url: '../HiDoctor_Master/SalestypeMappng/GetAllproduct',
//        type: "POST",
//        data: "a",
//        success: function (JsonResult) {
//            result = JsonResult;
//            debugger;
//            var content = "";
//            content += "<table class='data display datatable' id='tbl_product'>";
//            content += "<thead>";
//            content += "<th colspan='4'>Sales Type Product Detail</th>";
//            content += "<tr>";
//            content += "<th> </th>";
//            content += "<th>ProductName</th>";
//            content += "<th>BrandName</th>";
//            content += "<th>SpecialityName</th>";
//            content += "</tr>";
//            content += "</thead>";
//            content += "<tbody>";
//            for (var i = 0; i < JsonResult.length; i++) {
//                content += "<tr>";
//                content += "<td><input type='radio' name='rbn_product' onclick='getnonsaleproduct();'  value='" + JsonResult[i].Productcode + "'/> </td>";
//                content += "<td>";
//                content += JsonResult[i].ProductName;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].BrandName;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].SpecialityName;
//                content += "</td>";
//                content += "</tr>";
//            }
//            content += "</tbody>";
//            content += "</table>";
//            $("#dvTable").html(content);
//            // if ($.fn.dataTable) { $('#tbl_product').dataTable({ "sPaginationType": "full_numbers" }); };
//            if ($.fn.dataTable) { $('#tbl_product').dataTable({ bPaginate: false, "sScrollY": "500px" }); };
//        },
//        error: function () {
//            fnMsgAlert('error', 'Error', 'Error');
//        }
//    });
//}

//get the Other Type Product Detail//

//function getnonsaleproduct() {
//    debugger;
//    var product_code = $("input[name='rbn_product']:checked").val();
//    $.ajax({
//        url: '../HiDoctor_Master/SalestypeMappng/GetAllnonsaleproduct',
//        type: "POST",
//        data: "product_code=" + product_code,
//        success: function (JsonResult) {
//            debugger;
//            result = JsonResult;
//            var content = "";
//            content += "<table class='data display datatable' id='tbl_pro'>";
//            content += "<thead>";
//            content += "<th colspan='8'>Other Type Product Detail</th>";
//            content += "<tr>";
//            content += "<th><input type='checkbox'  id='chk_product_nonsale' name='chk_pro' onclick='fnselectall();'></th>";
//            content += "<th>ProductName</th>";
//            //content += "<th>ProductType</th>";
//            content += "<th>BrandName</th>";
//            content += "<th>SpecialityName</th>";
//            content += "<th>CompanyName</th>";
//            content += "<th>UOM</th>";
//            content += "<th>UOMTYPE</th>";
//            content += "</tr>";
//            content += "</thead>";
//            content += "<tbody>";
//            for (var i = 0; i < JsonResult.length; i++) {
//                content += "<tr>";
//                content += "<td><input type='checkbox' id='chk_productCode_" + i + "' class='case' name='chk_product_nonsale' value='" + JsonResult[i].Productcode + "'/> </td>";
//                content += "<td>";
//                content += JsonResult[i].ProductName;
//                content += "</td>";
//                //content += "<td>";
//                //content += JsonResult[i].ProductTypeName;
//                //content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].BrandName;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].SpecialityName;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].CompetitorName;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].UOMName;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].UOMTypeName;
//                content += "</td>";\
//                content += "</tr>";
//            }
//            content += "</tbody>";
//            content += "</table>";
//            $("#dvTable1").html(content);
//            //   if ($.fn.dataTable) { $('#tbl_pro').dataTable({ "sPaginationType": "full_numbers" }); };
//            if ($.fn.dataTable) { $('#tbl_pro').dataTable({ bPaginate: false, "sScrollY": "500px" }); };
//            fnselectallproduct();
//            //   }
//        },
//        error: function () {
//            alert("error");
//        }
//    });
//}

//Insert the values//

//function fnSave() {
//    debugger;
//    var ProductMappingcode = "";
//    var productCode = "";
//    if (!$("input[name='rbn_product']").is(":checked")) {
//        fnMsgAlert('ingo', 'Info', 'Please Select the sales type product Name');
//        return false;
//    }
//    $("input:checkbox[name='chk_product_nonsale']").each(function () {
//        if (this.checked) {
//            ProductMappingcode += "" + $(this).val() + ",";
//        }
//    });
//    ProductMappingcode = ProductMappingcode.slice(0, -1);
//    productCode = $('input[name="rbn_product"]:checked').val();
//    if (ProductMappingcode != "") {
//        $.ajax({
//            type: "POST",
//            url: "../HiDoctor_Master/SalestypeMappng/productInsert",
//            data: "ProductCode=" + $('input[name="rbn_product"]:checked').val() + "&MappingCode=" + ProductMappingcode + "",
//            success: function (data) {
//                fnMsgAlert('success', 'Success', 'Saved Successfully');
//                Cancel();
//                fnremove();
//            },
//            error: function () {
//            }
//        });
//    }
//    else {
//        fnMsgAlert('info', 'Info', 'Please select the Mapping ProductName');
//        return false;
//    }
//}

//select all check box function//

//function fnselectall() {
//    // add multiple select / deselect functionality
//    $("#chk_product_nonsale").click(function () {
//        $('.case').attr('checked', this.checked);
//    });
//    // if all checkbox are selected, check the selectall checkbox
//    // and viceversa
//    $(".case").click(function () {
//        if ($(".case").length == $(".case:checked").length) {
//            $("#chk_product_nonsale").attr("checked", "checked");
//        } else {
//            $("#chk_product_nonsale").removeAttr("checked");
//        }
//    });
//}
//clear the screen//

//uncheck checked boxes

//function Cancel() {
//    $("input:checkbox[name=chk_product_nonsale]").each(function () {
//        $(this).removeAttr('checked');
//    });
//    $("input:checkbox[name=chk_pro]").removeAttr('checked');
//    // $('input[name=rbn_product]').attr('checked', false);
//}

//remove function

//function fnremove() {
//    $('input[name=rbn_product]').attr('checked', false);
//}

//check the mapping product//

//function fnselectallproduct() {
//    debugger;
//    $('#dvTable1').hide();
//    $("#frmloading").show();
//    $.ajax({
//        type: "POST",
//        url: "../HiDoctor_Master/SalestypeMappng/GetAllSelectProduct",
//        data: "ProductCodeselect=" + $('input[name="rbn_product"]:checked').val(),
//        success: function (data) {
//            var length = $("#tbl_pro tr").length
//            Cancel();
//            for (var i = 0; i < length ; i++) {
//                var prodCode = $("#chk_productCode_" + i).val();
//                var dJsonData = jsonPath(data, "$.[?(@.SalesMappingcode=='" + prodCode + "')]");
//                if (dJsonData != false && dJsonData.length > 0) {
//                    $("#chk_productCode_" + i).attr('checked', true);
//                }
//            }
//            $('#dvTable1').show();
//            $("#frmloading").hide();
//        },
//        error: function () {
//        }
//    });
//}
