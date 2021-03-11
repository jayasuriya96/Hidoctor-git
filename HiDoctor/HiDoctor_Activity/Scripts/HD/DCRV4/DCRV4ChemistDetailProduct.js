var detailedRowIndexChemist_g = 0;

var ChemistDetailProductDetails = {



    fnBindDetailedProducts: function () {
        debugger;
        var tblDetailedProductsRows = $('#tbl_DetailedProducts_Chemist tr');

        var i = 0;
        for (i = 0; i < tblDetailedProductsRows.length; i++) {
            if (i == 0) {
                continue;
            }
            $(tblDetailedProductsRows[i]).remove();
            detailedRowIndexChemist_g--;
        }
        //fnAddDetailedProductsRow(true, 'txtproductDetailedChemist_' + detailedRowIndexChemist_g);

        var selctedobjects = $('#dvAllPro_Chemist input[type="checkbox"]:checked');
        var i = 0;
        var rowIndex = 0;
        // ChemistDetailProductDetails.fnClear();
        for (i = 0; i <= selctedobjects.length; i++) {
            var selprodname = $(selctedobjects[i]).attr("data-pname");
            var selprodCode = $(selctedobjects[i]).attr("value");
            var selModeOfEntry = $(selctedobjects[i]).attr("data-modeentry");
            rowIndex++;
            ChemistDetailProductDetails.fnAddDetailedProductsRow(null, 'txtproductDetailedChemist_' + rowIndex);
            $('#txtproductDetailedChemist_' + rowIndex).val(selprodname);
            $('#hdnproductDetailedChemist_' + rowIndex).val(selprodCode);
            $('#hdnDetEntryModeChemist_' + rowIndex).val(selModeOfEntry);
            if (selModeOfEntry == "A") {
                $('#txtproductDetailedChemist_' + rowIndex).attr('disabled', 'disabled');
                $('#DetailedprodRemoveChemist' + rowIndex).css('display', 'none');
            }
            else {
                $('#txtproductDetailedChemist_' + rowIndex).attr('disabled', false);
                $('#DetailedprodRemoveChemist' + rowIndex).css('display', '');
            }

        }

        ChemistDetailProductDetails.fnAddDetailedProductsRow(null, 'txtproductDetailedChemist_' + (++rowIndex).toString());
        $("#dvAllDetailedProduct_Chemist").hide();
        //overlay().close();
        //fnTableShowHide('tbl_DetailedProducts_Chemist', 'spnproducts_Chemist');

    },

    fnShowDetailedProductsPopup: function () {
        debugger;
        var i = 0;
        var selectedProducts = ChemistDetailProductDetails.fnGetSelectedDetailedProducts_Chemist();

        if (selectedProducts) {

            $("#dvAllPro_Chemist").html("");
            var detailedProductsTable = "";
            var selectedProductsString = "";

            detailedProductsTable += "<table><tbody>";
            for (i = 0; i < detailedProductsAutoFill_g.length; i++) {
                var isSelectedProduct = false;
                var mode_of_Entry = "";
                if (selectedProducts.length > 0) {
                    var j = 0;
                    for (j = 0; j < selectedProducts.length; j++) {
                        if (detailedProductsAutoFill_g[i].value == selectedProducts[j].Sale_Product_Code) {
                            selectedProductsString += selectedProducts[j].Sale_Product_Name + ", ";
                            mode_of_Entry = selectedProducts[j].Mode_Of_Entry
                            isSelectedProduct = true;
                            break;
                        }
                    }
                }

                detailedProductsTable += "<tr><td>" + detailedProductsAutoFill_g[i].label + "</td>";
                // var disabled = mode_of_Entry == null ? "" : mode_of_Entry.length == 0 ? "" : mode_of_Entry == "A" ? "disabled=true" : "";

                if (isSelectedProduct) {
                    detailedProductsTable += "<td><input type='checkbox' class='cls_detPrdcheckbox_Chemist' onclick='ChemistDetailProductDetails.fnSetSelectedProductString(this)' checked='checked' data-modeentry='" + mode_of_Entry + "' data-pname='" + detailedProductsAutoFill_g[i].label + "' value='" + detailedProductsAutoFill_g[i].value + "'  /></td></tr>";
                }
                else {
                    detailedProductsTable += "<td><input type='checkbox'  class='cls_detPrdcheckbox_Chemist' onclick='ChemistDetailProductDetails.fnSetSelectedProductString(this)' data-pname='" + detailedProductsAutoFill_g[i].label + "' value='" + detailedProductsAutoFill_g[i].value + "'  /></td></tr>";
                }
            }
            detailedProductsTable += "</tbody></table>";

            $(".cls_selectedProdList_Chemist").html(selectedProductsString);
            $("#dvAllPro_Chemist").html(detailedProductsTable);

            var selctedobjects = $('#dvAllPro_Chemist input[type="checkbox"]:checked');
            var i = 0;
            for (i = 0; i < selctedobjects.length; i++) {
                var mode = $(selctedobjects[i]).attr("data-modeentry");
                if (mode == "A") {
                    $(selctedobjects[i]).attr("disabled", true);
                }
            }
            $('#dvAllDetailedProduct_Chemist').overlay().load();

            $("#dvAllDetailedProduct_Chemist").show();
            //overlay().load();
        } else {
            alert(1);
            //fnTableShowHide('tbl_DetailedProducts_Chemist_Chemist', 'spndetailedproducts');
        }
    },

    fnDeleteDetailedProductRowChemist: function (index) {
        var rowLength = $('#tbl_DetailedProducts_Chemist tr').length;
        if (index == rowLength) {
            //$.msgbox("You are not allowed to delete this row!");
            fnMsgAlert('info', ChemAlertTitle, 'You are not allowed to delete this row!');
            //alert("You didnt delete this row!");
        }
        else {
            if (confirm('Do you wish to delete the detailed product?')) {
                $('#DeatailedProdRowChemist' + index).css('display', 'none');
            }
        }
    },
    //    fnBindDetailedProducts: function () {
    //        var tblDetailedProductsRows = $('#tbl_DetailedProducts_Chemist tr');

    //var i = 0;
    //for (i = 0; i < tblDetailedProductsRows.length; i++) {
    //    if (i == 0) {
    //        continue;
    //    }
    //    $(tblDetailedProductsRows[i]).remove();
    //    detailedRowIndexChemist_g--;
    //}
    ////fnAddDetailedProductsRow(true, 'txtproductDetailedChemist_' + detpindex);
    //var selctedobjects = $('#dvAllPro_Chemist input[type="checkbox"]:checked');
    //var i = 0;
    //var rowIndex = 0;
    //for (i = 0; i < selctedobjects.length; i++) {
    //    var selprodname = $(selctedobjects[i]).attr("data-pname");
    //    var selprodCode = $(selctedobjects[i]).attr("value");
    //    var selModeOfEntry = $(selctedobjects[i]).attr("data-modeentry");
    //    rowIndex++;
    //    //ChemistDetailProductDetails.fnAddDetailedProductsRow(true, 'txtproductDetailedChemist_' + rowIndex);
    //    $('#txtproductDetailedChemist_' + rowIndex).val(selprodname);
    //    $('#hdnproductDetailedChemist_' + rowIndex).val(selprodCode);
    //    $('#hdnDetEntryModeChemist_' + rowIndex).val(selModeOfEntry);
    //    if (selModeOfEntry == "A") {
    //        $('#txtproductDetailedChemist_' + rowIndex).attr('disabled', 'disabled');
    //        $('#DetailedprodRemoveChemist' + rowIndex).css('display', 'none');
    //    }
    //    else {
    //        $('#txtproductDetailedChemist_' + rowIndex).attr('disabled', false);
    //        $('#DetailedprodRemoveChemist' + rowIndex).css('display', '');
    //    }

    //}

    //ChemistDetailProductDetails.fnAddDetailedProductsRow(null, 'txtproductDetailedChemist_' + (++rowIndex).toString());
    //$("#dvAllDetailedProduct_Chemist").overlay().close();
    //fnTableShowHide('tbl_DetailedProducts_Chemist', 'spndetailedproducts');

    //    },
    fnAddDetailedProductsRow: function (isDraft, curDetailedObj) {
        debugger;
        detailedRowIndexChemist_g++;
        var tblDetailedProductsRowLength = $('#tbl_DetailedProducts_Chemist tr').length;
        var newDetailedProductRow = document.getElementById('tbl_DetailedProducts_Chemist').insertRow(parseInt(tblDetailedProductsRowLength));
        newDetailedProductRow.id = "DeatailedProdRowChemist" + detailedRowIndexChemist_g;

        // Product Name.
        var td1 = newDetailedProductRow.insertCell(0);

        var htmlvalue = "";
        if (isDraft) {
            htmlvalue = "<input style='width:95%;' type='text' id='txtproductDetailedChemist_" + detailedRowIndexChemist_g + "' class='autoDetailedProduct chemist_txt setfocus' maxlength='299'  onblur='fnValidateAutofill(this," + 'detailedProductsAutoFill_g' + ",\"txtproductDetailedChemist_\",\"hdnproductDetailedChemist_\");' /><input type='hidden' id='hdnproductDetailedChemist_" + detailedRowIndexChemist_g + "'  />";
        }
        else {
            htmlvalue = "<input style='width:95%;' type='text' id='txtproductDetailedChemist_" + detailedRowIndexChemist_g + "' ondblclick='ChemistDetailProductDetails.fnAddDetailedProductsRow(null,this)'  onkeyup='ChemistDetailProductDetails.fnAddDetailedProductsRow(null,this)' maxlength='299' ";
            htmlvalue += "class='autoDetailedProduct chemist_txt  setfocus'  onblur='fnValidateAutofill(this," + 'detailedProductsAutoFill_g' + " ,\"txtproductDetailedChemist_\",\"hdnproductDetailedChemist_\");' /><input type='hidden' id='hdnproductDetailedChemist_" + detailedRowIndexChemist_g + "' />";
        }
        $(td1).css('width', '95%');
        $(td1).css('textAlign', 'left');
        $(td1).html(htmlvalue);

        var td2 = newDetailedProductRow.insertCell(1);
        htmlvalue = "<input type='hidden' id='hdnDetEntryModeChemist_" + detailedRowIndexChemist_g + "'>";
        $(td2).css('textAlign', 'left');
        $(td2).html(htmlvalue)

        var td3 = newDetailedProductRow.insertCell(2);
        $(td3).html("&nbsp;")

        // Remove icon.
        var td4 = newDetailedProductRow.insertCell(3);
        $(td4).addClass('deleteRowIcon')
        $(td4).html("<img id='DetailedprodRemove" + detailedRowIndexChemist_g + "' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer' onclick='ChemistDetailProductDetails.fnDeleteDetailedProductRowChemist(" + detailedRowIndexChemist_g + ")' />");
        if (curDetailedObj != null) {
            curDetailedObj.onkeyup = null;
            curDetailedObj.ondblclick = null;
        }
        if (detailedProductsAutoFill_g != null && detailedProductsAutoFill_g.length > 0) {
            autoComplete(detailedProductsAutoFill_g, "txtproductDetailedChemist", "hdnproductDetailedChemist", "autoDetailedProduct");
        }
        $(".setfocus").click(function () { $(this).select(); });
    },

    fnGetSelectedDetailedProducts_Chemist: function () {
        var detProdJsonArray = new Array();
        var productCodeArray = new Array();
        for (var detprindex = 0; detprindex < detailedRowIndexChemist_g; detprindex++) {

            var detprdobj = {};
            var detprd = "";
            if (detprindex == 0) {
                continue;
            }
            // check the row is exist. if not continue the next row.
            if ($('#DeatailedProdRowChemist' + detprindex).css('display') == 'none') {
                continue;
            }

            if ($.trim($('#txtproductDetailedChemist_' + detprindex).val()).length > 0) {
                var det_prd_Name = $('#txtproductDetailedChemist_' + detprindex).val();
                var det_prd_code = $('#hdnproductDetailedChemist_' + detprindex).val();

                if (productCodeArray.indexOf(det_prd_code) > -1) {
                    fnMsgAlert("info", "DCR - Detailed Products", "The Product Name : <b>" + det_prd_Name + "</b> duplicated in the Detailed Products grid. Once remove the dupliacte product then try again. ");
                    return false;
                } else {
                    productCodeArray.push(det_prd_code);
                }

                detprdobj.Sale_Product_Code = det_prd_code;
                detprdobj.Sale_Product_Name = det_prd_Name;
                detprdobj.Mode_Of_Entry = $('#hdnDetEntryModeChemist_' + detprindex).val();

                detProdJsonArray.push(detprdobj);
            }
        }
        return detProdJsonArray;
    },

    fnSetSelectedProductString: function (obj) {

        var selprodlist = "";
        var selctedobjects = $('#dvAllPro_Chemist input[type="checkbox"]:checked');
        var i = 0;
        for (i = 0; i < selctedobjects.length; i++) {
            selprodlist += $(selctedobjects[i]).attr("data-pname") + ", ";
        }

        $(".cls_selectedProdList_Chemist").html(selprodlist);
    },

    fnGetChemistDetailProduct: function () {

        var Chemist_DetProduct = new Array();
        var Detproduct = {};
        var det_prd_Name = "";
        var det_prd_Code = "";
        var det_mode_of_entry = "";
        var detail_string = "";

        var detprdArray = new Array();
        //if ($('#tbl_DetailedProducts_Chemist tr').lenght != null && $('#tbl_DetailedProducts_Chemist tr').length > 1) {
        for (var i = 1; i < $('#tbl_DetailedProducts_Chemist tr').length; i++) {
            var j = parseInt(i);
            //+ 1;
            Detproduct = {};
            debugger
            if ($('#DeatailedProdRowChemist' + i).css('display') == 'none') {
                continue;
            }
            if ($.trim($('#txtproductDetailedChemist_' + j).val()).length > 0) {

                //if ($('#hdnproductDetailedChemist_' + j).val() != '') {
                det_prd_Name = $('#txtproductDetailedChemist_' + j).val();
                det_prd_Code = $('#hdnproductDetailedChemist_' + j).val();

                if ($.trim($('#hdnproductDetailedChemist_' + j)).length == 0) {
                    fnMsgAlert('info', ChemAlertTitle, 'Invalid Product Name in Detailed box.');
                    return false;
                }
                if ($.inArray(det_prd_Name, detprdArray) > -1) {
                    fnMsgAlert('info', ChemAlertTitle, 'Detailed Product Name is duplicate.');
                    return false;
                }
                detprdArray.push(det_prd_Name);
                Detproduct.Sales_Product_Code = $('#hdnproductDetailedChemist_' + j).val();
                Detproduct.Sales_Product_Name = $('#txtproductDetailedChemist_' + j).val();
                //  Chemist_DetProduct.Quantity_Provided = $('#txtProdQtyChemistChemist_'+ i).val();
                Chemist_DetProduct.push(Detproduct);
                //   }
                //else {
                //    fnMsgAlert('info', ChemAlertTitle, 'Invalid Product Name in Detailed box.');
                //}
            }




        }
        var detailProdMandatory = fnGetPrivilegeValue('DCR_CHEMIST_DETAILING_MANDATORY_NUMBER', '0');
        if (Chemist_DetProduct.length < parseInt(detailProdMandatory)) {
            fnMsgAlert('info', ChemAlertTitle, 'Please enter at least ' + detailProdMandatory + ' detailing products for this ' + ChemistVisit.defaults.Chemist_Caption + ' visit.');
            return false;
        }
        console.log(Chemist_DetProduct);
        return Chemist_DetProduct;
        //  }
    },
    fnPrefill: function (lstChemistDetails) {
        var detProdJsonArray = new Array();
        var productCodeArray = new Array();
        debugger;
        var det_prd_Name = "";
        var det_prd_Code = "";
        var det_mode_of_entry = "";
        var selctedobjects = $('#dvAllPro_Chemist input[type="checkbox"]:checked');
        var i = 0;
        var rowIndex = 0;

        for (i = 0; i <= selctedobjects.length; i++) {
            var selprodname = $(selctedobjects[i]).attr("data-pname");
            var selprodCode = $(selctedobjects[i]).attr("value");
            var selModeOfEntry = $(selctedobjects[i]).attr("data-modeentry");
            rowIndex++;
            //     ChemistDetailProductDetails.fnAddDetailedProductsRow(null, 'txtproductDetailedChemist_' + rowIndex);
            //$('#txtproductDetailedChemist_' + rowIndex).val(selprodname);
            //$('#hdnproductDetailedChemist_' + rowIndex).val(selprodCode);
            //$('#hdnDetEntryModeChemist_' + rowIndex).val(selModeOfEntry);
            if (selModeOfEntry == "A") {
                $('#txtproductDetailedChemist_' + rowIndex).attr('disabled', 'disabled');
                $('#DetailedprodRemoveChemist' + rowIndex).css('display', 'none');
            }
            else {
                $('#txtproductDetailedChemist_' + rowIndex).attr('disabled', false);
                $('#DetailedprodRemoveChemist' + rowIndex).css('display', '');
            }

        }
        if (lstChemistDetails.length > 0) {
            $('#tbl_DetailedProducts_Chemist tr').remove();
            $("#tbl_DetailedProducts_Chemist").append('<tr><td>Product Name</td><td>&nbsp;</td><td>&nbsp;</td><td class="deleteRowIcon">&nbsp;</td></tr>')
            detailedRowIndexChemist_g = 0;

            for (var detprindex = 1; detprindex <= lstChemistDetails.length  ; detprindex++) {

                var detprdobj = {};
                var detprd = "";
                //if (detprindex == 0) {
                //    continue;
                //}

                $("input[class='cls_detPrdcheckbox_Chemist" + detprindex + "'][value='" + [detprindex - 1].Sales_Product_Code + "']").attr('checked', 'checked');
                // check the row is exist. if not continue the next row.
                ChemistDetailProductDetails.fnAddDetailedProductsRow(null, 'txtproductDetailedChemist_' + detprd);

                det_prd_Name = $('#txtproductDetailedChemist_' + detprindex).val(lstChemistDetails[detprindex - 1].Sales_Product_Name);
                det_prd_code = $('#hdnproductDetailedChemist_' + detprindex).val(lstChemistDetails[detprindex - 1].Sales_Product_Code);
                detprdobj.Sale_Product_Code = det_prd_code;
                detprdobj.Sale_Product_Name = det_prd_Name;
                detprdobj.Mode_Of_Entry = $('#hdnDetEntryModeChemist_' + detprindex).val();



                // $('#hdnDetEntryMode_' + detpindex).val(lstChemistDetails[detprindex - 1].Mode_Of_Entry);
                detProdJsonArray.push(detprdobj);



            }
        }
        ChemistDetailProductDetails.fnAddDetailedProductsRow(null);
    },
    fnInitialize: function () {
        ChemistDetailProductDetails.fnBindDetailedProducts();
    },
    fnClear: function () {
        $('#tbl_DetailedProducts_Chemist tr').remove();
        $("#tbl_DetailedProducts_Chemist").append('<tr><td>Product Name</td><td>&nbsp;</td><td>&nbsp;</td><td class="deleteRowIcon">&nbsp;</td></tr>')
        detailedRowIndexChemist_g = 0;
        ChemistDetailProductDetails.fnAddDetailedProductsRow(null, 'txtproductDetailedChemist_0');
    }

}