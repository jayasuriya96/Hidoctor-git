var sampleinputs_mandatory_number_g = "";
var input_qty_default_CV = fnGetPrivilegeValue('INPUT_QTY_DEFAULT', '0');
debugger;
sampleinputs_mandatory_number_g = fnGetPrivilegeValue('DCR_CHEMIST_INPUT_MANDATORY_NUMBER', '0');
var productRowIndex_g_Chemist = 0;
var detailedRowIndex_g = 0;
//var productAutoFill_g = new Array();
//var productAutoFillOri_g;
//var dcrActualDate_g;
var productBringType = fnGetPrivilegeValue('DCR_PRODUCTS_BRING_TYPE', '') + "^";
productBringType_g = productBringType.replace(/,/g, '^');
if (productBringType_g == "^") {
    $('#div_productdetails_entry').css('display', 'none');
    $('#productHeader').css('display', 'none');
}
var ChemistProductDetails = {

    fnAddProductRow: function (isDraft, curProdObject) {
        // Increment the row Index. Retrieve the row length and insert a new row.
        productRowIndex_g_Chemist++;

        var tblProductRowLength = $('#tbl_Prodcuts_Chemist tr').length;
        var newProductRow = document.getElementById('tbl_Prodcuts_Chemist').insertRow(parseInt(tblProductRowLength));
        newProductRow.id = "ProdRowChemist" + productRowIndex_g_Chemist;

        // Product Name.
        var td0 = newProductRow.insertCell(0);

        var htmlvalue = "";
        if (isDraft) {
            htmlvalue = "<input type='text' id='txtProdChemist_" + productRowIndex_g_Chemist + "' class='autoProduct_cv txtproduct setfocus' maxlength='299'   onblur='ChemistProductDetails.fnDCRProductBlur(" + productRowIndex_g_Chemist + ")';   /><input type='hidden' id='hdnProdChemist_" + productRowIndex_g_Chemist + "'  />";
        }
        else {
            htmlvalue = "<input type='text' id='txtProdChemist_" + productRowIndex_g_Chemist + "' ondblclick='ChemistProductDetails.fnAddProductRow(null,this)'  onkeyup='ChemistProductDetails.fnAddProductRow(null,this)' maxlength='299' ";
            htmlvalue += "class='autoProduct_cv txtproduct setfocus'  onblur='ChemistProductDetails.fnDCRProductBlur(" + productRowIndex_g_Chemist + ")' /><input type='hidden' id='hdnProdChemist_" + productRowIndex_g_Chemist + "' />";
        }


        $(td0).html(htmlvalue);
        $(td0).addClass("txtproduct");

        var td1 = newProductRow.insertCell(1);
        $(td1).append("<select onchange='ChemistProductDetails.fnSampleQtyChange(" + productRowIndex_g_Chemist + ");' style='width:120px;' id='selBatchChemist_" + productRowIndex_g_Chemist + "' > </select>");
        $(td1).addClass("selBatchChemist");

        // Product Qty.
        var td2 = newProductRow.insertCell(2);
        var qtydefault = input_qty_default_CV == "NO" ? "" : "0";
        $(td2).html("<input type='text' align='center' maxlength='3' onchange='ChemistProductDetails.fnSampleQtyChange(" + productRowIndex_g_Chemist + ");'   id='txtProdQtyChemist_" + productRowIndex_g_Chemist + "' class='checkinteger' value='" + qtydefault + "' />")
        $(td2).addClass("txtqty");
        $(td2).attr('align', 'center');

        // Detailed Check box.
        var td3 = newProductRow.insertCell(3);
        if ($('#hdnsoe').val().toUpperCase() != "TABLET") {
            $(td3).html("<input type='checkbox' id='chkProdDetail" + productRowIndex_g_Chemist + "'  />");
            $('#hdr_detailed').css('display', '');
        }
        else {
            $(td3).html("<input type='checkbox' id='chkProdDetail" + productRowIndex_g_Chemist + "' style='display:none' />");
            $('#hdr_detailed').css('display', 'none');
        }
        $(td3).append("<input type='hidden' id='hdnBatchesChemist_" + productRowIndex_g_Chemist + "' /> ")
        $(td3).addClass('txtqty');
        $(td3).attr('align', 'left');
        $(td3).css('display', 'none');

        // Remove icon.
        var td4 = newProductRow.insertCell(3);
        $(td4).html("<img id='prodRemove" + productRowIndex_g_Chemist + "' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer' onclick='ChemistProductDetails.fnDeleteProductRowChemist(" + productRowIndex_g_Chemist + ")' />");
        if (curProdObject != null) {
            curProdObject.onkeyup = null;
            curProdObject.ondblclick = null;
        }
        if (productAutoFill_g != null && productAutoFill_g.length > 0) {
            autoComplete(productAutoFill_g, "txtProdChemist_", "hdnProdChemist_", "autoProduct_cv");
        }
        $(".setfocus").click(function () { $(this).select(); });
        $(".checkinteger").blur(function () { $(this).blur(function () { fnChekInteger(this) }); });

    },
    fnGetUserProductsAndSetAutoFill: function () {
        $('#imgloadInputs').css('display', '');
        $('#inputsLoadingTitle').css('display', '')

        $.ajax({
            type: 'POST',
            data: "prdBringType=" + escape(productBringType_g) + "&searchWord=&DCR_Date=" + dcrActualDate_g,
            url: '../DCRV4DoctorVisit/GetUserProductsList',
            async: false,
            success: function (response) {
                // we have the response
                if (response != null && response.length > 0) {
                    productAutoFill_g = response;
                    productAutoFillOri_g = JSON.stringify(productAutoFill_g);
                    autoComplete(productAutoFill_g, "txtProd_", "hdnProdChemist_", "autoProduct_cv");
                    $('#imgloadInputs').css('display', 'none');
                    $('#inputsLoadingTitle').css('display', 'none')
                }
                else {
                    $('#imgloadInputs').css('display', 'none');
                    $('#inputsLoadingTitle').css('display', 'none')
                }
            },
            error: function (e) {
                $('#imgloadInputs').css('display', 'none');
                $('#inputsLoadingTitle').css('display', 'none')
                // alert(e.responseText);
            }
        });
    },
    fnDeleteProductRowChemist: function (index) {
        var rowLength = $('#tbl_Prodcuts_Chemist tr').length - 1;
        if (index == rowLength) {
            //$.msgbox("You are not allowed to delete this row!");
            fnMsgAlert('info', docSampleAlertTitle, 'You are not allowed to delete this row!');
            //alert("You didnt delete this row!");
        }
        else {
            if (confirm('Do you wish to delete the Sample/Promotional item?')) {
                $('#ProdRowChemist' + index).css('display', 'none');
            }
        }
    },
    fnPrefill: function (lstChemistDetails) {

        if (lstChemistDetails.length > 0) {

            for (var i = 0; i < lstChemistDetails.length; i++) {

                ChemistProductDetails.fnAddProductRow(null);
                var k = parseInt(i) + 1;
                $('#hdnProdChemist_' + k).val(lstChemistDetails[i].Product_Code);
                $('#txtProdQtyChemist_' + k).val(lstChemistDetails[i].Quantity_Provided);
                var arr = $.grep(productAutoFill_g, function (ele) {
                    return ele.Product_Code == lstChemistDetails[i].Product_Code;
                });
                $('#txtProdChemist_' + k).val(arr[0].label);
                //Batch
                var Batches = "";
                Batches = fnGetProductBatch(lstChemistDetails[i].Product_Code, 'C', CV_Visit_Id_g);
                if (Batches.length > 0) {
                    var strhtml = "";
                    for (var j = 0; j < Batches.length; j++) {
                        strhtml += "<option value='" + Batches[j].Batch_Number + "'>" + Batches[j].Batch_Number + "</option>";
                    }
                    $("#selBatchChemist_" + k.toString()).html(strhtml);
                    $("#selBatchChemist_" + k.toString()).val(lstChemistDetails[i].Batch_Number);
                    $("#hdnBatchesChemist_" + k.toString()).val(JSON.stringify(Batches));
                }
                else {
                    $("#selBatchChemist_" + k.toString()).html("<option value=''>-No Batch Found-</option>");
                    $("#hdnBatchesChemist_" + k.toString()).val("");
                }

                $('#selBatchChemist_' + k).val(lstChemistDetails[i].Batch_Number);

            }
        }

    },
    fnGetChemistProduct: function () {
        var Chm_Prod = new Array();
        var Prod = {};
        var prodString = "";
        var prod_code = "";
        var prod_spec_code = "";
        var prod_name = "";
        var prod_spec_code = "";
        var prod_qty = "";
        var product_count = 0;
        var batch_Number = "";
        var prodArray = new Array();
        for (var i = 1; i < $('#tbl_Prodcuts_Chemist tr').length; i++) {
            var inp_array = $('#ProdRowChemist' + i + ' input'); //prod_Rows[i].getElementsByTagName('input');

            // Product Name and Product Code.
            if ($('#ProdRowChemist' + i).css('display') != 'none') {
                if ($.trim($(inp_array[0]).val()).length != 0) {
                    if ($.trim($('#' + inp_array[1].id).val()).length == 0) {
                        //$.msgbox('The input ' + $(inp_array[0]).val() + ' is invalid.');
                        fnMsgAlert('info', docSampleAlertTitle, 'The Sample/Promotional item ' + $(inp_array[0]).val() + ' is invalid.');
                        //alert("The product " + $(inp_array[0]).val() + " is invalid.");
                        return false;
                    }
                    else {
                        var prod_code = $(inp_array[1]).val().split('_')[0];
                        prod_spec_code = $(inp_array[1]).val().split('_')[1]
                        prod_name = $(inp_array[0]).val();
                        var index = inp_array[1].id.split("_")[1];
                        batch_Number = $("#selBatchChemist_" + index + " option:selected").val() == undefined ? "" : $("#selBatchChemist_" + index + " option:selected").val();
                    }
                    var prod_count = 0;
                    for (var j = 1; j < $('#tbl_Prodcuts_Chemist tr').length - 1; j++) {

                        if ($.trim($('#txtProdChemist_' + j).val()).length != 0 && prod_name == $('#txtProdChemist_' + j).val() && batch_Number == ($("#selBatchChemist_" + j + " option:selected").val() == undefined ? "" : $("#selBatchChemist_" + j + " option:selected").val())) {
                            if ($('#ProdRowChemist' + j).css('display') != 'none') {
                                prod_count++;
                                if (prod_count > 1) {
                                    //$.msgbox('The input ' + prod_name + ' already entered.');
                                    if (batch_Number != '')
                                        fnMsgAlert('error', docSampleAlertTitle, 'The Sample/Promotional item ' + prod_name + (($("#selBatchChemist_" + i + " option:selected").val() != undefined) ? (' and batch ' + batch_Number) : "") + ' is already entered.');
                                    else
                                        fnMsgAlert('info', docSampleAlertTitle, 'The Sample/Promotional item ' + prod_name + ' already entered.');
                                    return false;
                                }
                            }
                        }
                    }

                    var qtydefault = input_qty_default_CV == "NO" ? "" : "0";
                    // Product Qty.

                    // Product Qty.
                    debugger
                    if ($.trim($(inp_array[2]).val()).length != 0) {
                        if (!fnChekInteger(inp_array[2])) {
                            return false;
                        }
                        else {
                            prod_qty = $(inp_array[2]).val();
                        }
                    }
                    else {
                        if (qtydefault.length == 0) {
                            fnMsgAlert('info', docSampleAlertTitle, 'Please enter QTY for the Product ' + prod_name);
                            return false;
                        }
                        else {
                            prod_qty = 0;
                        }
                    }


                    //  if (productAutoFill_g != null && productAutoFill_g.length > 0) {

                    //    var j = parseInt(i) + 1;
                    if ($('#hdnProdChemist_' + i).val() != '' && $('#hdnProdChemist_' + i).val() != null) {
                        Prod = {};
                        var Prodcode = $('#hdnProdChemist_' + i).val()
                        Prodcode = Prodcode.split('_');
                        Prod.Product_Code = Prodcode[0];
                        Prod.Quantity_Provided = prod_qty;
                        Prod.Batch_Number = batch_Number;
                        Prod.Product_Name = $("#txtProdChemist_" + i).val();
                        //$('#txtProdQtyChemist_' + i).val();
                        Chm_Prod.push(Prod);
                    }

                }
            }
            console.log(Chm_Prod);

        }

        if (sampleinputs_mandatory_number_g > 0) {
            debugger;
            if (sampleinputs_mandatory_number_g > Chm_Prod.length) {
                //$.msgbox('You need to enter minimum of ' + inputs_mandatory_number_g + ' inputs.');
                fnMsgAlert('info', docSampleAlertTitle, ' You need to enter minimum of ' + sampleinputs_mandatory_number_g + ' Sample/Promotional items.');
                return false;
            }
        }
        debugger;
        //if (Chm_Prod.length == 0)
        //{
        //    Prod.Product_Code = 0;
        //    Prod.Quantity_Provided = 0;
        //    Prod.Batch_Number = "";
        //    Prod.Product_Name = "";
        //    $('#txtProdQtyChemist_' + i).val();
        //    Chm_Prod.push(Prod);
        //}
        return Chm_Prod;
    },
    fnClear: function () {
        $('#tbl_Prodcuts_Chemist  tr').remove();
        $("#tbl_Prodcuts_Chemist").append('<tr><td class="dcr_product_header" style="text-align:left;background-color: #e4ecf3 !important; ">Input Name</td><td class="dcr_product_header txtqty" style="background-color: #e4ecf3 !important; ">Batch Number</td><td class="dcr_product_header txtqty" style="background-color: #e4ecf3 !important; ">Quantity</td><td id="hdr_detailed" class="dcr_product_header txtqty" style="text-align: left; padding-left: 23px;background-color: #e4ecf3 !important; "></td><td class="dcr_product_header"style="background-color: #e4ecf3 !important;"></td></tr>');
        productRowIndex_g_Chemist = 0;
        ChemistProductDetails.fnAddProductRow(null);
    },
    fnDCRProductBlur: function (index) {
        var text = $("#txtProdChemist_" + index).val();
        var arr = $.grep(productAutoFill_g, function (ele) {
            return ele.label == text;
        });

        if (arr.length <= 0) {
            //fnValidateAutofill(this, productAutoFill_g, "txtProd_" + index, "hdnProd_" + index);
            $("#hdnProdChemist_" + index).val("");
        }
        else {
            $("#hdnProdChemist_" + index).val(arr[0].Product_Code);

        }
        ChemistProductDetails.fnSampleProductChange(index);
    },

    fnSampleProductChange: function (index) {
        if ($("#hdnProdChemist_" + index.toString()).val().trim() != "") {
            var productCode = $("#hdnProdChemist_" + index.toString()).val().trim().split("_")[0];
            var Batches = "";
            Batches = fnGetProductBatch(productCode, 'C', CV_Visit_Id_g);
            if (Batches.length > 0) {
                var strhtml = "";
                for (var i = 0; i < Batches.length; i++) {
                    strhtml += "<option value='" + Batches[i].Batch_Number + "'>" + Batches[i].Batch_Number + "</option>";
                }
                $("#selBatchChemist_" + index.toString()).html(strhtml);
                $("#selBatchChemist_" + index.toString()).val($("#hdnProd_" + index).val());
                $("#hdnBatchesChemist_" + index.toString()).val(JSON.stringify(Batches));
            }
            else {
                $("#selBatchChemist_" + index.toString()).html("<option value=''>-No Batch Found-</option>");
                $("#hdnBatchesChemist_" + index.toString()).val("");
                $("#txtProdQtyChemist_" + index).val('0');
            }
        }
        else {
            $("#selBatchChemist_" + index.toString()).html("<option value=''>-No Batch Found-</option>");
            $("#hdnBatchesChemist_" + index.toString()).val("");
            $("#txtProdQtyChemist_" + index).val('0');
        }
    },

    fnSampleQtyChange: function (index) {
        debugger;
        if ($("#hdnBatchesChemist_" + index).val().trim().length > 0) {
            var batches = eval($("#hdnBatchesChemist_" + index).val());
            var stock = 0;
            if (batches.length > 0) {
                var res = $.grep(batches, function (ele) {
                    return ele.Batch_Number == $("#selBatchChemist_" + index.toString() + " option:selected").val();
                });
                if (res.length > 0)
                    stock = res[0].Current_Stock;
            }
            if (parseInt($("#txtProdQtyChemist_" + index.toString()).val()) > stock) {
                fnMsgAlert('info', 'error', 'Quantity exceeds the available stock for this batch.');
                $("#txtProdQtyChemist_" + index.toString()).val(stock);
            }
        }
    }
}