var AutoComplete_Product = "";
function fnGetDoctorProdLst() {
    $.blockUI();
    var selType = $("input[name='optRegRadio']:checked").val();
    var selRegionCode = "";
    var DocProdtbl = "";
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        regionCode = regionTree.getActiveNode().data.key;
        $("#DocProdLst").html('');
        $("#dvSubmit").hide();
        if (selType == 'self') {
            selRegionCode = userRegionCode;
        }
        else if (selType == 'others') {
            selRegionCode = regionCode;
        }
        $.ajax({
            type: 'GET',
            data: "RegionCode=" + regionCode + "&SelRegionCode=" + selRegionCode,
            url: '../HiDoctor_Master/MarketingCampaign/GetDocProduct',
            success: function (result) {
                debugger;
                $("#DocProdLst").html();
                var CustomerCodeAr = [];
                DocProdtbl += "<table class='table table-striped DocProdTbl' id='DocProdTblId'><thead>";
                DocProdtbl += "<tr><th rowspan='2'><label>";
                DocProdtbl += "<input type='checkbox' onclick='toggle(this);' value=''>Select</label>";
                DocProdtbl += "</th><th rowspan='2'>Doctor Name</th><th rowspan='2'>Doctor Category</th>";
                DocProdtbl += "<th rowspan='2'>Doctor Speciality</th><th rowspan='2'>MDL Number</th>";
                DocProdtbl += "<th colspan='3' style='text-align:center'>P1</th>";
                DocProdtbl += "<th colspan='3' style='text-align:center'>P2</th>";
                DocProdtbl += "<th colspan='3' style='text-align:center'>P3</th>";
                DocProdtbl += "<th colspan='3' style='text-align:center'>T1</th>";
                DocProdtbl += "<th colspan='3' style='text-align:center'>T2</th>";
                DocProdtbl += "<th colspan='3' style='text-align:center'>T3</th></tr><tr><th>Name</th>";
                DocProdtbl += "<th>Yield</th>";
                DocProdtbl += "<th>Potential</th><th>Name</th>";
                DocProdtbl += "<th>Yield</th><th>Potential</th><th>Name</th><th>Yield</th><th>Potential</th>";
                DocProdtbl += "<th>Name</th><th>Yield</th><th>Potential</th>";
                DocProdtbl += "<th>Name</th><th>Yield</th><th>Potential</th><th>Name</th><th>Yield</th>";
                DocProdtbl += "<th>Potential</th></tr></thead><tbody>";
                if (result[0].lstDocProd.length > 0) {
                    var k = 0;
                    for (var i = 0; i < result[0].lstDocProd.length; i++) {
                        var CustomerCode = "";
                        CustomerCode = result[0].lstDocProd[i].customer_Code;
                        if (CustomerCodeAr.indexOf(CustomerCode) < 0) {
                            k = k + 1;
                            CustomerCodeAr.push(CustomerCode);
                            DocProdtbl += "<tr>";
                            DocProdtbl += "<td><input type='checkbox' value='" + k + "'></td>";
                            DocProdtbl += "<td><span id='CustomerName_" + k + "'>" + result[0].lstDocProd[i].customer_name + "</span><input type='hidden' id='CustomerCode_" + k + "' value=" + result[0].lstDocProd[i].customer_Code + "></td>";
                            DocProdtbl += "<td>" + result[0].lstDocProd[i].Category_Name + "<input type='hidden' id='CustCategoryCode_" + k + "' value=" + result[0].lstDocProd[i].Category_Code + "></td>";
                            DocProdtbl += "<td>" + result[0].lstDocProd[i].Speciality_Name + "</td>";
                            DocProdtbl += "<td>" + result[0].lstDocProd[i].MDL_Number + "</td>";
                            DocProdtbl += "<td><input type='text' placeholder='Name' id='txtProduct_" + k + "_1' class='autoProduct' onblur ='fnValidateAutofill(this," + 'AutoComplete_Product' + ",\"txtProduct\",\"hdnAcProd\")' autocomplete='off' value=''><input type='hidden' class='hdnAcProdVal' id='hdnAcProd_" + k + "_1'></td>";
                            DocProdtbl += "<td><input placeholder='Yield' onblur=isValidNumeric('txtProductYld_'," + k + ",1) class='txtYldCls' type='number' min='0' id='txtProductYld_" + k + "_1'></td>";
                            DocProdtbl += "<td><input placeholder='Potential' onblur=isValidNumeric('txtProductPot_'," + k + ",1) class='txtPotCls' type='number' min='0' id='txtProductPot_" + k + "_1'></td>";
                            DocProdtbl += "<td><input type='text' placeholder='Name' id='txtProduct_" + k + "_2' class='autoProduct' onblur ='fnValidateAutofill(this," + 'AutoComplete_Product' + ",\"txtProduct\",\"hdnAcProd\")' autocomplete='off' value=''><input type='hidden' class='hdnAcProdVal' id='hdnAcProd_" + k + "_2'></td>";
                            DocProdtbl += "<td><input placeholder='Yield' onblur=isValidNumeric('txtProductYld_'," + k + ",2) class='txtYldCls' type='number' min='0' id='txtProductYld_" + k + "_2'></td>";
                            DocProdtbl += "<td><input placeholder='Potential' onblur=isValidNumeric('txtProductPot_'," + k + ",2) class='txtPotCls' type='number' min='0' id='txtProductPot_" + k + "_2'></td>";
                            DocProdtbl += "<td><input type='text' placeholder='Name' id='txtProduct_" + k + "_3' class='autoProduct' onblur ='fnValidateAutofill(this," + 'AutoComplete_Product' + ",\"txtProduct\",\"hdnAcProd\")' autocomplete='off' value=''><input type='hidden' class='hdnAcProdVal' id='hdnAcProd_" + k + "_3'></td>";
                            DocProdtbl += "<td><input placeholder='Yield' onblur=isValidNumeric('txtProductYld_'," + k + ",3) class='txtYldCls' type='number' min='0' id='txtProductYld_" + k + "_3'></td>";
                            DocProdtbl += "<td><input placeholder='Potential' onblur=isValidNumeric('txtProductPot_'," + k + ",3) class='txtPotCls' type='number' min='0' id='txtProductPot_" + k + "_3'></td>";
                            DocProdtbl += "<td><input type='text' placeholder='Name' id='txtTargetProduct_" + k + "_1' class='autoTargetProduct' onblur ='fnValidateAutofill(this," + 'AutoComplete_Product' + ",\"txtTargetProduct\",\"hdnAcTargetProd\")' autocomplete='off' value=''><input type='hidden' class='hdnAcTargetProdVal' id='hdnAcTargetProd_" + k + "_1'></td>";
                            DocProdtbl += "<td><input placeholder='Yield' onblur=isValidNumeric('txtTarProductYld_'," + k + ",1) class='txtYldCls' type='number' min='0' id='txtTarProductYld_" + k + "_1'></td>";
                            DocProdtbl += "<td><input placeholder='Potential' onblur=isValidNumeric('txtTarProductPot_'," + k + ",1) class='txtPotCls' type='number' min='0' id='txtTarProductPot_" + k + "_1'></td>";
                            DocProdtbl += "<td><input type='text' placeholder='Name' id='txtTargetProduct_" + k + "_2' class='autoTargetProduct' onblur ='fnValidateAutofill(this," + 'AutoComplete_Product' + ",\"txtTargetProduct\",\"hdnAcTargetProd\")' autocomplete='off' value=''><input type='hidden' class='hdnAcTargetProdVal' id='hdnAcTargetProd_" + k + "_2'></td>";
                            DocProdtbl += "<td><input placeholder='Yield' onblur=isValidNumeric('txtTarProductYld_'," + k + ",2) class='txtYldCls' type='number' min='0' id='txtTarProductYld_" + k + "_2'></td>";
                            DocProdtbl += "<td><input placeholder='Potential' onblur=isValidNumeric('txtTarProductPot_'," + k + ",2) class='txtPotCls' type='number' min='0' id='txtTarProductPot_" + k + "_2'></td>";
                            DocProdtbl += "<td><input type='text' placeholder='Name' id='txtTargetProduct_" + k + "_3' class='autoTargetProduct' onblur ='fnValidateAutofill(this," + 'AutoComplete_Product' + ",\"txtTargetProduct\",\"hdnAcTargetProd\")' autocomplete='off' value=''><input type='hidden' class='hdnAcTargetProdVal' id='hdnAcTargetProd_" + k + "_3'></td>";
                            DocProdtbl += "<td><input placeholder='Yield' onblur=isValidNumeric('txtTarProductYld_'," + k + ",3) class='txtYldCls' type='number' min='0' id='txtTarProductYld_" + k + "_3'></td>";
                            DocProdtbl += "<td><input placeholder='Potential' onblur=isValidNumeric('txtTarProductPot_'," + k + ",3) class='txtPotCls' type='number' min='0' id='txtTarProductPot_" + k + "_3'></td>";
                            DocProdtbl += "</tr>";

                        }
                    }
                }
                else {
                    DocProdtbl += "<tr><td colspan='20'><label style='text-align:center;'>No Records Found</label></td></tr>";
                }

                DocProdtbl += "</tbody></table>";
                $("#DocProdLst").html(DocProdtbl);
                //$('table').on('scroll', function () {
                //    $("table > *").width($("table").width() + $("table").scrollLeft());
                //    $("tbody > *").width($("tbody").width() + $("tbody").scrollTop());
                //});
                for (var i = 0; i < CustomerCodeAr.length; i++) {
                    var CustomerCode = "";
                    CustomerCode = CustomerCodeAr[i];
                    for (var j = 0; j < result[0].lstDocProd.length; j++) {
                        if (result[0].lstDocProd[j].customer_Code == CustomerCode) {
                            if (result[0].lstDocProd[j].Ref_Type == "MAPPING") {
                                if (result[0].lstDocProd[j].Product_Priority_No == 1) {
                                    $("#txtProduct_" + parseInt(i + 1) + "_1").val(result[0].lstDocProd[j].product_name);
                                    $("#hdnAcProd_" + parseInt(i + 1) + "_1").val(result[0].lstDocProd[j].Product_Code);
                                    $("#txtProductYld_" + parseInt(i + 1) + "_1").val(result[0].lstDocProd[j].Support_Quantity);
                                    $("#txtProductPot_" + parseInt(i + 1) + "_1").val(result[0].lstDocProd[j].Potential_Quantity);
                                }
                                else if (result[0].lstDocProd[j].Product_Priority_No == 2) {
                                    $("#txtProduct_" + parseInt(i + 1) + "_2").val(result[0].lstDocProd[j].product_name);
                                    $("#hdnAcProd_" + parseInt(i + 1) + "_2").val(result[0].lstDocProd[j].Product_Code);
                                    $("#txtProductYld_" + parseInt(i + 1) + "_2").val(result[0].lstDocProd[j].Support_Quantity);
                                    $("#txtProductPot_" + parseInt(i + 1) + "_2").val(result[0].lstDocProd[j].Potential_Quantity);
                                }
                                else if (result[0].lstDocProd[j].Product_Priority_No == 3) {
                                    $("#txtProduct_" + parseInt(i + 1) + "_3").val(result[0].lstDocProd[j].product_name);
                                    $("#hdnAcProd_" + parseInt(i + 1) + "_3").val(result[0].lstDocProd[j].Product_Code);
                                    $("#txtProductYld_" + parseInt(i + 1) + "_3").val(result[0].lstDocProd[j].Support_Quantity);
                                    $("#txtProductPot_" + parseInt(i + 1) + "_3").val(result[0].lstDocProd[j].Potential_Quantity);
                                }

                            }
                            else if (result[0].lstDocProd[j].Ref_Type == "TARGET_MAPPING") {
                                if (result[0].lstDocProd[j].Product_Priority_No == 1) {
                                    $("#txtTargetProduct_" + parseInt(i + 1) + "_1").val(result[0].lstDocProd[j].product_name);
                                    $("#hdnAcTargetProd_" + parseInt(i + 1) + "_1").val(result[0].lstDocProd[j].Product_Code);
                                    $("#txtTarProductYld_" + parseInt(i + 1) + "_1").val(result[0].lstDocProd[j].Support_Quantity);
                                    $("#txtTarProductPot_" + parseInt(i + 1) + "_1").val(result[0].lstDocProd[j].Potential_Quantity);
                                }
                                if (result[0].lstDocProd[j].Product_Priority_No == 2) {
                                    $("#txtTargetProduct_" + parseInt(i + 1) + "_2").val(result[0].lstDocProd[j].product_name);
                                    $("#hdnAcTargetProd_" + parseInt(i + 1) + "_2").val(result[0].lstDocProd[j].Product_Code);
                                    $("#txtTarProductYld_" + parseInt(i + 1) + "_2").val(result[0].lstDocProd[j].Support_Quantity);
                                    $("#txtTarProductPot_" + parseInt(i + 1) + "_2").val(result[0].lstDocProd[j].Potential_Quantity);
                                }
                                if (result[0].lstDocProd[j].Product_Priority_No == 3) {
                                    $("#txtTargetProduct_" + parseInt(i + 1) + "_3").val(result[0].lstDocProd[j].product_name);
                                    $("#hdnAcTargetProd_" + parseInt(i + 1) + "_3").val(result[0].lstDocProd[j].Product_Code);
                                    $("#txtTarProductYld_" + parseInt(i + 1) + "_3").val(result[0].lstDocProd[j].Support_Quantity);
                                    $("#txtTarProductPot_" + parseInt(i + 1) + "_3").val(result[0].lstDocProd[j].Potential_Quantity);
                                }
                            }
                        }
                    }
                }
                var ProductLst = "[";
                for (var i = 0; i < result[0].lstAC_Product.length; i++) {
                    ProductLst += "{label:" + '"' + "" + result[0].lstAC_Product[i].Product_Name + "" + '",' + "value:" + '"' + "" + result[0].lstAC_Product[i].Product_Code + "" + '"' + "}";
                    if (i < result[0].lstAC_Product.length - 1) {
                        ProductLst += ",";
                    }
                }
                ProductLst += "];";
                AutoComplete_Product = eval(ProductLst)
                $("#dvSubmit").show();
            },
            error: function () {

            },
            complete: function () {
                autoComplete(AutoComplete_Product, "txtProduct", "hdnAcProd", "autoProduct");
                autoComplete(AutoComplete_Product, "txtTargetProduct", "hdnAcTargetProd", "autoTargetProduct");
                $("#dvSubmit").show();
                var WH = $(window).height();
                var SH = $('body').prop("scrollHeight");
                $('html, body').stop().animate({ scrollTop: SH - WH }, 1000);
                $.unblockUI();
            }
        });
    }
}
function fnProductSubmit(PageType) {
    debugger;
    if (PageType == 1) {
        $(".DocLstDv").hide();
        $("#ProductEntryDv").show();
    }
    else {
        $(".DocLstDv").show();
        $("#ProductEntryDv").hide();
    }

}
function fnGetAddlDoc() {
    debugger;
    var docLst = "";
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        var regionCode = regionTree.getActiveNode().data.key;
        $("#DoctorSelLst").html('');
    }
    $.ajax({
        type: 'GET',
        data: "regionCode=" + regionCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetDoctorDetailsByRegion',
        success: function (result) {
            docLst += "<table style='height:315px' id='Fixedtbl' class='table table-striped DocTbl'><thead><tr>";
            docLst += "<th><label><input type='checkbox' onclick='toggle(this);' value=''>Select</label></th><th>Doctor Name</th>";
            docLst += "<th>Doctor Category</th><th>Doctor Speciality</th><th>MDL No</th></tr></thead><tbody id='Fixedtbody'>";
            for (var i = 0; i < result.length; i++) {
                docLst += "<tr><td><input type='checkbox' value=''></td><td>" + result[i].Doctor_Name + "</td>";
                docLst += "<td>" + result[i].Doctor_Category + "</td>";
                docLst += "<td>" + result[i].Doctor_Speciality + "</td>";
                docLst += "<td>" + result[i].Doctor_MDL + "</td></tr>"
            }
            docLst += "</tbody></table>";
            $("#DoctorSelLst").html(docLst);
        },
        error: function () {

        },
        complete: function () {
            $("#DoctorSelModal").modal('show');
        }
    })
}
function toggle(source) {
    var checkboxes = document.querySelectorAll('.DocProdTbl input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source)
            checkboxes[i].checked = source.checked;
    }
}

function fnCheckDuplicateProd(Ref_Type, SelRow, SelId) {
    debugger;
    if (Ref_Type == 'product') {
        if (SelId == 1) {
            if ($("#txtProduct_" + SelRow + "_" + SelId + "").val() == "" && $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() == "") {
                if ($("#hdnAcProd_" + SelRow + "_2").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " P" + SelId + " Column");
                    $("#txtProduct_" + SelRow + "_2").val("");
                    $("#hdnAcProd_" + SelRow + "_2").val("");
                    return false;
                }
                else if ($("#hdnAcProd_" + SelRow + "_3").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " P" + SelId + " Column");
                    $("#txtProduct_" + SelRow + "_3").val("");
                    $("#hdnAcProd_" + SelRow + "_3").val("");
                    return false;
                }
                else if ($("#hdnAcTargetProd_" + SelRow + "_2").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " T" + SelId + " Column");
                    $("#txtTargetProduct_" + SelRow + "_2").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_2").val("");
                    return false;
                }
                else if ($("#hdnAcTargetProd_" + SelRow + "_3").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " T" + SelId + " Column");
                    $("#txtTargetProduct_" + SelRow + "_3").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_3").val("");
                    return false;
                }
                else if ($("#txtProduct_" + SelRow + "_" + SelId + "").val() == "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " P" + SelId + " or T" + SelId + " Column");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == "" && $("#txtProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "" + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " invalid for " + $("#CustomerName_" + SelRow + "").html() + "");
                $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
        }
        else if (SelId == 2) {
            if ($("#txtProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() == "" && $("#txtProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " P" + parseInt(SelId - 1) + " Column");
                $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == "" && $("#txtProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "" + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " invalid for " + $("#CustomerName_" + SelRow + "").html() + "");
                $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_" + parseInt(SelId - 1) + "").val()) {
                if ($("#txtProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() != "" && $("#hdnAcProd_" + SelRow + "_" + parseInt(SelId - 1) + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_1").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_1").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_1").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_2").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_2").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_2").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_3").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_3").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_3").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
        }
        else if (SelId == 3) {
            if ($("#txtProduct_" + SelRow + "_" + parseInt(SelId - 2) + "").val() == "" && $("#txtProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " P" + parseInt(SelId - 2) + "  Column");
                $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#txtProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() == "" && $("#txtProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " P" + parseInt(SelId - 1) + " Column");
                $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == "" && $("#txtProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "" + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " invalid for " + $("#CustomerName_" + SelRow + "").html() + "");
                $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_" + parseInt(SelId - 1) + "").val()) {
                if ($("#txtProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() != "" && $("#hdnAcProd_" + SelRow + "_" + parseInt(SelId - 1) + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() + " already mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_" + parseInt(SelId - 2) + "").val()) {
                if ($("#txtProduct_" + SelRow + "_" + parseInt(SelId - 2) + "").val() != "" && $("#hdnAcProd_" + SelRow + "_" + parseInt(SelId - 2) + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + parseInt(SelId - 2) + "").val() + " already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_1").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_1").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_1").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_2").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_2").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_2").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_3").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_3").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_3").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
        }

    }
    else if (Ref_Type == 'Target_product') {
        if (SelId == 1) {
            if ($("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() == "" && $("#txtProduct_" + SelRow + "_" + SelId + "").val() == "") {
                fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " T" + SelId + " Column");
                $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == "" && $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "" + $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() + " invalid for " + $("#CustomerName_" + SelRow + "").html() + "");
                $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_1").val()) {
                if ($("#txtProduct_" + SelRow + "_1").val() != "" && $("#hdnAcProd_" + SelRow + "_1").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_2").val()) {
                if ($("#txtProduct_" + SelRow + "_2").val() != "" && $("#hdnAcProd_" + SelRow + "_2").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_3").val()) {
                if ($("#txtProduct_" + SelRow + "_3").val() != "" && $("#hdnAcProd_" + SelRow + "_3").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
        }
        else if (SelId == 2) {
            if ($("#txtTargetProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() == "" && $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " T" + parseInt(SelId - 1) + " Column");
                $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == "" && $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "" + $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() + " invalid for " + $("#CustomerName_" + SelRow + "").html() + "");
                $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_" + parseInt(SelId - 1) + "").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_" + parseInt(SelId - 1) + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtTargetProduct_" + SelRow + "" + parseInt(SelId - 1) + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_1").val()) {
                if ($("#txtProduct_" + SelRow + "_1").val() != "" && $("#hdnAcProd_" + SelRow + "_1").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_1").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_2").val()) {
                if ($("#txtProduct_" + SelRow + "_2").val() != "" && $("#hdnAcProd_" + SelRow + "_2").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_2").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_3").val()) {
                if ($("#txtProduct_" + SelRow + "_3").val() != "" && $("#hdnAcProd_" + SelRow + "_3").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_3").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
        }
        else if (SelId == 3) {
            if ($("#txtTargetProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() == "" && $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Product for " + $("#CustomerName_" + SelRow + "").html() + " T" + parseInt(SelId - 1) + " Column");
                $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == "" && $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() != "") {
                fnMsgAlert("info", "Doctor Product Mapping", "" + $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() + " invalid for " + $("#CustomerName_" + SelRow + "").html() + "");
                $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                return false;
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_" + parseInt(SelId - 1) + "").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_" + parseInt(SelId - 1) + "").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_" + parseInt(SelId - 1) + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcTargetProd_" + SelRow + "_" + parseInt(SelId - 2) + "").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_" + parseInt(SelId - 2) + "").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_" + parseInt(SelId - 2) + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_1").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_1").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_2").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_2").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
            else if ($("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() == $("#hdnAcProd_" + SelRow + "_3").val()) {
                if ($("#txtTargetProduct_" + SelRow + "_" + SelId + "").val() != "" && $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val() != "") {
                    fnMsgAlert("info", "Doctor Product Mapping", "Product " + $("#txtProduct_" + SelRow + "_3").val() + " Already Mapped for " + $("#CustomerName_" + SelRow + "").html() + "");
                    $("#txtTargetProduct_" + SelRow + "_" + SelId + "").val("");
                    $("#hdnAcTargetProd_" + SelRow + "_" + SelId + "").val("");
                    return false;
                }
            }
        }
    }
}
function fnInsertDocProd() {
    debugger;
    $.blockUI();
    var checkedDoc = $('.DocProdTbl input[type="checkbox"]:checked').length;
    var checkVal = 0;
    var isValid = "";
    if (checkedDoc > 0) {
        var DocProdAr = []
        for (var i = 0; i < checkedDoc; i++) {
            checkVal = $('.DocProdTbl input[type="checkbox"]:checked')[i].value;
            var DocProdobj = "";
            for (var j = 1; j <= 3; j++) {
                isValid = true;
                if ($("#txtProduct_" + checkVal + "_" + j + "").val() !== undefined) {
                    if ($("#txtProduct_" + checkVal + "_" + j + "").val() != '') {
                        isValid = fnCheckDuplicateProd("product", checkVal, j);
                        if (isValid == false) {
                            $.unblockUI();
                            return false;
                        }
                        if ($("#hdnAcProd_" + checkVal + "_" + j + "").val() != '') {
                            isValid = fnCheckDuplicateProd("product", checkVal, j);
                            if (isValid == false) {
                                $.unblockUI();
                                return false;
                            }
                            DocProdobj = {
                                "Customer_Code": $("#CustomerCode_" + checkVal + "").val(),
                                "Customer_Category_Code": $("#CustCategoryCode_" + checkVal + "").val(),
                                "Product_Code": $("#hdnAcProd_" + checkVal + "_" + j + "").val(),
                                "Support_Quantity": $("#txtProductYld_" + checkVal + "_" + j + "").val() == "" ? "0" : $("#txtProductYld_" + checkVal + "_" + j + "").val(),
                                "Potential_Quantity": $("#txtProductPot_" + checkVal + "_" + j + "").val() == "" ? "0" : $("#txtProductPot_" + checkVal + "_" + j + "").val(),
                                "Product_Priority_No": j,
                                "Region_Code": regionCode,
                                "User_Region_Code": userRegionCode,
                                "Ref_Type": "MAPPING"
                            }
                            DocProdAr.push(DocProdobj);
                            DocProdobj = "";
                        }
                        else if ($("#hdnAcProd_" + checkVal + "_" + j + "").val() == '') {
                            isValid = fnCheckDuplicateProd("product", checkVal, j);
                            if (isValid == false) {
                                $.unblockUI();
                                return false;
                            }
                        }
                    }
                    else if ($("#txtProduct_" + checkVal + "_" + j + "").val() == '') {
                        isValid = fnCheckDuplicateProd("product", checkVal, j);
                        if (isValid == false) {
                            $.unblockUI();
                            return false;
                        }
                    }
                }
                if ($("#txtTargetProduct_" + checkVal + "_" + j + "").val() !== undefined) {
                    if ($("#txtTargetProduct_" + checkVal + "_" + j + "").val() != '') {
                        isValid = fnCheckDuplicateProd("Target_product", checkVal, j);
                        if (isValid == false) {
                            $.unblockUI();
                            return false;
                        }
                        if ($("#hdnAcTargetProd_" + checkVal + "_" + j + "").val() != '') {
                            isValid = fnCheckDuplicateProd("Target_product", checkVal, j);
                            if (isValid == false) {
                                $.unblockUI();
                                return false;
                            }
                            DocProdobj = {
                                "Customer_Code": $("#CustomerCode_" + checkVal + "").val(),
                                "Customer_Category_Code": $("#CustCategoryCode_" + checkVal + "").val(),
                                "Product_Code": $("#hdnAcTargetProd_" + checkVal + "_" + j + "").val(),
                                "Support_Quantity": $("#txtTarProductYld_" + checkVal + "_" + j + "").val() == "" ? "0" : $("#txtTarProductYld_" + checkVal + "_" + j + "").val(),
                                "Potential_Quantity": $("#txtTarProductPot_" + checkVal + "_" + j + "").val() == "" ? "0" : $("#txtTarProductPot_" + checkVal + "_" + j + "").val(),
                                "Product_Priority_No": j,
                                "Region_Code": regionCode,
                                "User_Region_Code": userRegionCode,
                                "Ref_Type": "TARGET_MAPPING"
                            }
                            DocProdAr.push(DocProdobj);
                            DocProdobj = "";
                        }
                        else if ($("#hdnAcTargetProd_" + checkVal + "_" + j + "").val() == '') {
                            isValid = fnCheckDuplicateProd("Target_product", checkVal, j);
                            if (isValid == false) {
                                $.unblockUI();
                                return false;
                            }
                        }
                    }
                    else if ($("#txtTargetProduct_" + checkVal + "_" + j + "").val() == '') {
                        isValid = fnCheckDuplicateProd("Target_product", checkVal, j);
                        if (isValid == false) {
                            $.unblockUI();
                            return false;
                        }
                    }
                }
            }
            checkVal = 0;
        }
        if (DocProdAr.length > 0) {
            var selType = $("input[name='optRegRadio']:checked").val();
            DocProdAr = JSON.stringify({ 'InsertDocProdLst': DocProdAr, 'selType': selType });
        }
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: DocProdAr,
            url: '../HiDoctor_Master/MarketingCampaign/InsertDocProd',
            success: function (result) {
                debugger;
                var status = result.split('^');
                if (status[0] == "SUCCESS") {
                    fnGetDoctorProdLst();
                    fnMsgAlert("success", "Doctor Product Mapping", "Doctor Product Inserted Successfully");
                    return false;
                }
                else if (status[0] == "FAIL") {
                    fnMsgAlert("error", "Doctor Product Mapping", "Doctor Product Inserted Failed");
                    return false;
                }
            },
            error: function (xhr, textStatus) {
                alert(textStatus);
                $.unblockUI();
            },
            complete: function () {
                $.unblockUI();
            }
        });
    }
    else {
        $.unblockUI();
        fnMsgAlert("info", "Doctor Product Mapping", "Select Atleast One Doctor to save");
        return false;
    }
}
function isValidNumeric(SelId, SelRow, SelCnt) {
    debugger;
    var numCheck = "";
    numCheck = $("#" + SelId + SelRow + "_" + SelCnt + "").val();
    if (numCheck != "") {
        var Restrict = /^[0-9]+([,.][0-9]+)?$/g;
        var IsValid = Restrict.test(numCheck);
        if (IsValid == false) {
            fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Numbers greater than or equal to zero");
            $("#" + SelId + SelRow + "_" + SelCnt + "").val("");
            return false;
        }
        else if (numCheck.length > 5) {
            fnMsgAlert("info", "Doctor Product Mapping", "Please Enter Numbers Less than or equal to 5");
            $("#" + SelId + SelRow + "_" + SelCnt + "").val("");
            return false;
        }
    }
}