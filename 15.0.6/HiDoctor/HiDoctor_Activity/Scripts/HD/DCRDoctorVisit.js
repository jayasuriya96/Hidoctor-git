var productRowIndex_g = 0;
var chemistRowIndex_g = 0;
var gridRowNo_g = 0;
var cpDoctorSave_g = false;
var screenTitle = "Doctor/Customer & Sample/Promotional items"
var compAutoFill_g = new Array();

var rcpaTableString_g = "<table id='tblchem_prod_CHNUM_RCPANUM' cellpadding='0' cellspacing='0' border='0' style='width:100%;overflow:hidden' class='rcpaTable'  >";
rcpaTableString_g += "<tr class='rcpaheader'><td><label>Sale Product</label></td><td><label>Qty</label></td><td><label>Competitor</label></td><td><label>Qty</label></td></tr>";
rcpaTableString_g += "<tr><td class='tdsaleprod' style='width:30%'><input type='text' id='txtchem_prod_CHNUM_RCPANUM' onkeypress='fnAddSaleProductRow(this)' ondblclick='fnAddSaleProductRow(this)' onblur ='fnValidateAutofill(this," + 'RCPAProductAutofill_g' + ",\"txtchem_prod_\",\"hdnchem_prod_\");fnGetCompetitors(this);' ";
rcpaTableString_g += "class='txtsaleprod autoRCPA  setfocus'  maxlength='299' style='width:155px !important;'  /></td>";
rcpaTableString_g += "<td style='width:5% !important'><input type='text' id='txtchem_prodQty_CHNUM_RCPANUM' onkeypress='return fnIsNumber(event)' style='width:35px;' class='checkinteger setfocus' maxlength='3' /></td>";
rcpaTableString_g += "<td class='tdcomp'><input type='text' id='txtchem_prod_comp_CHNUM_RCPANUM_1' class='autoComp_CHNUM_RCPANUM' onkeypress='fnAddCompRow(this)' onblur='fnValidateComp(this)' class=' txtcomp' maxlength='50' style='width:140px;' />";
rcpaTableString_g += "<input type='hidden' id='hdnchem_prod_CHNUM_RCPANUM' /></td>";
rcpaTableString_g += "<td><input type='text' id='txtchem_prod_compQty_CHNUM_RCPANUM_1' class='checkinteger txtcompqty setfocus' onkeypress='return fnIsNumber(event)' maxlength='3' style='width:25px !important; '  />";
rcpaTableString_g += "<input type='hidden' id='hdnchem_prod_comp_CHNUM_RCPANUM_1'  /></td></tr>";
rcpaTableString_g += "</table>";

// Grid Row Creation
function fnCreateDoctorList(detailsJSON_g) {
    if (dcrDoctorVisit_g != null && dcrDoctorVisit_g.length > 0) {
        var listLength = dcrDoctorVisit_g[0].Data.length;
        for (var i = 0; i < listLength; i++) {
            gridRowNo_g++;
            fnRowCreation(dcrDoctorVisit_g, i)
        }
    }
}

function fnRowCreation(jsonContent, index) {
    var rowIndex = $('#tbl_doctorvisit_list tr').length;
    var newListRow = document.getElementById('tbl_doctorvisit_list').insertRow(parseInt(rowIndex++));
    var dvcode = "";
    dvcode = jsonContent[0].Data[index].Doctor_Visit_Code;
    var detailsJSON = "";
    detailsJSON = jsonContent[0].Data[index];
    var docName = "";
    docName = jsonContent[0].Data[index].Doctor_Name;
    var docCode = "";
    docCode = jsonContent[0].Data[index].Doctor_Code;
    var doctorRegionCode = "";
    doctorRegionCode = jsonContent[0].Data[index].Doctor_Region_Code;
    var productsJSONData = "";
    productsJSONData = jsonContent[1].Data;
    var chemistJSONData = "";
    chemistJSONData = jsonContent[2].Data;
    var sampleCount = 0;
    var samplesJson = "";
    if (dvcode != null) {
        samplesJson = jsonPath(productsJSONData, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
    }
    else {
        samplesJson = jsonPath(productsJSONData, "$.[?(@.Doctor_Code=='" + docCode + "'& @.Doctor_Region_Code=='"+doctorRegionCode+"')]");
    }
    var chemistJson = "";
    chemistJson = jsonPath(chemistJSONData, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
    sampleCount = samplesJson == "false" ? 0 : samplesJson.length;
    var chemistCount = 0;
    chemistCount = chemistJson == "false" ? 0 : chemistJson.length;
    var rcpaJSON = "";
    rcpaJSON = jsonPath(jsonContent[3].Data, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
    var rcpaCount = 0;
    rcpaCount = rcpaJSON == "false" ? 0 : rcpaJSON.length;
    newListRow.id = "doc_List_" + gridRowNo_g;
    $(newListRow).addClass("grdRow");
    $("#doc_List_" + gridRowNo_g).click(function () { fnFillForm(this.id.split('_')[2]) });

    // Row No.
    var td1 = newListRow.insertCell(0);
    $(td1).html(gridRowNo_g);

    // DvCode
    var td2 = newListRow.insertCell(1);
    dvcode = dvcode == null ? "" : dvcode

    $(td2).html('<span id="spnDVCode_' + gridRowNo_g + '">' + dvcode + '</span>');
    $(td2).css('display', 'none');

    //  Doctor JSON Content
    var td3 = newListRow.insertCell(2);
    detailsJSON = JSON.stringify(detailsJSON)
    $(td3).html('<input type="hidden" id="hdnDoctorJson_' + gridRowNo_g + '" value=\'' + detailsJSON + '\' />');
    $(td3).css('display', 'none');

    //  Sample JSON Content
    var td4 = newListRow.insertCell(3);
    samplesJson = samplesJson == false ? "{}" : JSON.stringify(samplesJson)
    $(td4).html('<input type="hidden" id="hdnSampleJson_' + gridRowNo_g + '" value=\'' + samplesJson + '\' />');
    $(td4).css('display', 'none');

    // Chemist JSON Content
    var td5 = newListRow.insertCell(4);
    chemistJson = chemistJson == false ? "{}" : JSON.stringify(chemistJson)
    $(td5).html('<input type="hidden" id="hdnChemistJson_' + gridRowNo_g + '" value=\'' + chemistJson + '\' />');
    $(td5).css('display', 'none');

    // RCPA JSON Content
    var td6 = newListRow.insertCell(5);
    rcpaJSON = rcpaJSON == "" ? "{}" : JSON.stringify(rcpaJSON)
    $(td6).html('<input type="hidden" id="hdnRCPAJson' + gridRowNo_g + '" value=\'' + rcpaJSON + '\' />');
    $(td6).css('display', 'none');


    // Doctor Name
    var td7 = newListRow.insertCell(6);
    var imgtick = "";
    if (dvcode != null && dvcode.length > 0) {
        imgtick = '<img id="imgSelected' + gridRowNo_g + '"  src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tickIcon.png" alt="Selected" style="border:0px;" />';
    }
    else {
        imgtick = '<img id="imgSelected' + gridRowNo_g + '"  src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tickIcon.png" alt="Selected" style="border:0px;display:none" />';
    }
    $(td7).html(imgtick+'<span id="spnDocName_' + gridRowNo_g + '">' + docName + '</span>' );

    // Sample
    var td8 = newListRow.insertCell(7);
    $(td8).css('width', '10px')
    var sampleid = "Sample_" + gridRowNo_g;
    var sampleDiv = '"'; //'<div id="divsamptoltip_' + gridRowNo_g + '" class="sampletooltip">'
    var ind = 0;
    for (var s = 0; s < eval('(' + samplesJson + ')').length; s++) {
        ind = s + 1;
        sampleDiv += ind + "." + eval('(' + samplesJson + ')')[s].Product_Name.toString() + "\n";
    }

    sampleDiv += '"'//"</div>";
    sampleDiv = ind == 0 ? '' : sampleDiv;
    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/Green-Capsule16.png" alt="Sam" />';
    sampleCount > 0 ? $(td8).html('<a id=' + sampleid + ' title=' + sampleDiv + ' class="sampletooltip" >' + img + '</a>') : $(td8).html('<a id=' + sampleid + ' class="sampletooltip"></a>' + sampleDiv);
    //$("#" + sampleid).tooltip({ effect: 'toggle' });

    // Chemist
    var td9 = newListRow.insertCell(8);
    $(td9).css('width', '10px')
    var chemistid = "chemist_" + gridRowNo_g;
    var chemistDiv = '"';  //'<div  id="divchemtoltip_' + gridRowNo_g + '" class="tooltip">'
    var ind = 0;
    for (var c = 0; c < eval('(' + chemistJson + ')').length; c++) {
        ind = c + 1;
        chemistDiv += +ind + "." + eval('(' + chemistJson + ')')[c].Chemist_Name + "\n";
    }
    chemistDiv += '"';
    chemistDiv = ind == 0 ? '' : chemistDiv;
    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/chemis16x16.png" alt="Chemist" />';
    chemistCount > 0 ? $(td9).html('<a id=' + chemistid + ' title=' + chemistDiv + ' class="sampletooltip">' + img + '</a>') : $(td9).html('<a id=' + chemistid + ' class="sampletooltip"></a>' + chemistDiv);
    // $("#" + chemistid).tooltip({ effect: 'toggle' });

    // RCPA
    var td10 = newListRow.insertCell(9);
    $(td10).attr('id', 'grdRCPA_' + gridRowNo_g);
    $(td10).css('width', '10px')
    if (RCPA_g == "R") {
        var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/rcpa.png" alt="RCPA" />';
        rcpaCount > 0 ? $(td10).html(img) : $(td10).html("&nbsp;");
    }
    else {
        $(td10).css('display', 'none');
    }

    // Remove Icon. 
    var td11 = newListRow.insertCell(10);
    $(td11).attr('id', "delete_" + gridRowNo_g);
    $(td11).css('width', '10px');
    if (dvcode != null && $.trim(dvcode).length > 0) {
        $(td11).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" onclick="fnDeleteGridRow(\'' + dvcode + '\',\'' + newListRow.id + '\')" />')
    }
    else {
        $(td11).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="display:none" />')
    }

    var td12 = newListRow.insertCell(11);
    $(td12).css('width', '10px');
    $(td12).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/arrow.png" id="grdSelectArrow_' + gridRowNo_g + '" alt="Select" style="display:none;"  />')

    if ($('#tbl_doctorvisit_list tr').length > 1) {
        $('#btnSave').val('Save & Next Doctor/Customer');
    }

    if (jsonContent != null && jsonContent.length != null && jsonContent.length > 5 && jsonContent[5].Data.length > 0)
    {
         productAutoFill_g = jsonContent[5].Data;
         productAutoFillOri_g = JSON.stringify(jsonContent[5].Data);
        autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");
    }
}

function fnRowUpdation(updatedJSON, rowNum) {
    var dvcode = "";
    dvcode = updatedJSON[0].Data[0].Doctor_Visit_Code;
    var detailsJSON = "";
    detailsJSON = updatedJSON[0].Data[0];
    var docName = "";
    docName = updatedJSON[0].Data[0].Doctor_Name;
    var docCode = "";
    docCode = updatedJSON[0].Data[0].Doctor_Code;
    var productsJSONData = "";
    productsJSONData = updatedJSON[1].Data;
    var chemistJSONData = "";
    chemistJSONData = updatedJSON[2].Data;
    var sampleCount = 0;
    var samplesJson = "";
    if (dvcode != null) {
        samplesJson = jsonPath(productsJSONData, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
    }
    else {
        samplesJson = jsonPath(productsJSONData, "$.[?(@.Doctor_Code=='" + docCode + "')]");
    }
    var chemistJson = "";
    chemistJson = jsonPath(chemistJSONData, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
    sampleCount = samplesJson == "false" ? 0 : samplesJson.length;
    var chemistCount = 0;
    chemistCount = chemistJson == "false" ? 0 : chemistJson.length;
    var rcpaJSON = "";
    rcpaJSON = jsonPath(updatedJSON[3].Data, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
    var rcpaCount = 0;
    rcpaCount = rcpaJSON == "false" ? 0 : rcpaJSON.length;


    // DvCode
    dvcode = dvcode == null ? "" : dvcode
    $('#spnDVCode_' + rowNum).html(dvcode);
    $('#imgSelected' + rowNum).css('display', '');
    //  Doctor JSON Content
    detailsJSON = JSON.stringify(detailsJSON)
    $('#hdnDoctorJson_' + rowNum).val(detailsJSON);

    //  Sample JSON Content
    samplesJson = samplesJson == false ? "{}" : JSON.stringify(samplesJson);
    $('#hdnSampleJson_' + rowNum).val(samplesJson);

    // Chemist JSON Content
    chemistJson = chemistJson == false ? "{}" : JSON.stringify(chemistJson);
    $('#hdnChemistJson_' + rowNum).val(chemistJson);

    // RCPA JSON Content
    rcpaJSON = rcpaJSON == "" ? "{}" : JSON.stringify(rcpaJSON);
    $('#hdnRCPAJson' + rowNum).val(rcpaJSON);


    // Doctor Name
    $('#spnDocName_' + rowNum).html(docName);

    // Sample

    var sampleDiv = "";

    var si = 0;
    for (var s = 0; s < eval('(' + samplesJson + ')').length; s++) {
        si++;
        sampleDiv += (si).toString() + "." + eval('(' + samplesJson + ')')[s].Product_Name + "\n";
    }
    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/Green-Capsule16.png" alt="Sample/Promotional Items" />';
    if (sampleCount > 0)
    { $('#Sample_' + rowNum).attr('title', sampleDiv); $('#Sample_' + rowNum).html(img); }
    else { $('#Sample_' + rowNum).html("") };

    // Chemist
    var ci = 0;
    var chemistDiv = "";
    for (var c = 0; c < eval('(' + chemistJson + ')').length; c++) {
        ci++;
        chemistDiv += (ci).toString() + ". " + eval('(' + chemistJson + ')')[c].Chemist_Name + "\n";
    }
    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/chemis16x16.png" alt="Chemist" />';
    if (chemistCount > 0) {
        $('#chemist_' + rowNum).attr('title', chemistDiv); $('#chemist_' + rowNum).html(img); ;
    } else { $('#chemist_' + rowNum).html("") };

    if (RCPA_g == "R") {
        if (rcpaCount > 0) {
            var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/rcpa.png" alt="RCPA" />';
            $('#grdRCPA_' + rowNum).html(img);
        } else { $('#grdRCPA_' + rowNum).html(""); };
    }

    $('#delete_' + rowNum).html('');
    $('#delete_' + rowNum).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" onclick="fnDeleteGridRow(\'' + dvcode + '\',\'' + "doc_List_" + rowNum + '\')" />');

    productAutoFill_g = updatedJSON[5].Data;
    productAutoFillOri_g = JSON.stringify(updatedJSON[5].Data);
    autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");
}

function fnFillForm(rowPosition, doctorjson, productJson, chemistJson, rcpaJson) {
    if ($('#doc_List_' + rowPosition).css('display') == 'none') {
        fnClear();
        return false;
    }

    if (formMode_g == "Edit") {
        var result = confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.');
        if (!result) {
            return false;
        }
        else {
            fnInsertDoctorVisitData(false, rowPosition);
        }
    }
    else {
        fnFillFormEdit(rowPosition, doctorjson, productJson, chemistJson, rcpaJson);
    }
}

function fnFillFormEdit(rowPosition, doctorjson, productJson, chemistJson, rcpaJson) {
    
    productAutoFill_g = eval('('+productAutoFillOri_g+')');
    autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");
    formMode_g = "";
    if (rowPosition != 'default') {
        $('#hdnbindRowNumber').val(rowPosition);
        doctorjson = eval('(' + $('#hdnDoctorJson_' + rowPosition).val() + ')');
        productJson = eval('(' + $('#hdnSampleJson_' + rowPosition).val() + ')');
        chemistJson = eval('(' + $('#hdnChemistJson_' + rowPosition).val() + ')');
        rcpaJson = eval('(' + $('#hdnRCPAJson' + rowPosition).val() + ')');
    }
    else {
        $('#hdnbindRowNumber').val('1');
    }
    fnDeleteRows();

    if (doctorjson != null) {
        rowPosition = rowPosition == 'default' ? "1" : rowPosition;

        fnhighlightRowColor(rowPosition);
        var dvcode = $('#spnDVCode_' + rowPosition).html();
        $('#hdnDoctorVisitCode').val(dvcode);
        if (doctorEntryMode_g.toUpperCase() == "NO") {
            if (doctorjson.Doctor_Code.length == 0) {
                var doc_name = doctorjson.Doctor_Name.split('_')[0];
                var doc_code = doctorjson.Doctor_Code;
                var speciality = doctorjson.Doctor_Name.split('_')[2]
                $('#txtDocName').val("");
                $('#hdnDocName').val("");
                $('#txtDocSpeciality').val("");
                $('#txtDocName').val(doc_name);
                $('#hdnDocName').val(doc_code);
                $('#txtDocSpeciality').val(speciality);
                var specialityCode = jsonPath(specialityAutoFill_g, "$.[?(@.label=='" + speciality + "')]");
                if (specialityCode != false) {
                    $('#hdnspecname').val(specialityCode[0].value);
                }
                else {
                    $('#hdnspecname').val('');
                }
            }
            else {
                $('#txtDocName').val(doctorjson.Doctor_Name);
                $('#hdnDocName').val(doctorjson.Doctor_Code);
                $('#txtDocSpeciality').val("");
                $('#hdnspecname').val("");
            }
        }
        else { // Rigid
            $('#txtDocName').val(doctorjson.Doctor_Name);
            $('#hdnDocName').val(doctorjson.Doctor_Code);
        }

        // Is CP Doctor

        $('#hdnIsCPDoc').val(doctorjson.Is_CPDoc);

        // POB Amount.
        if (doctorPOBAmount_g.toUpperCase() == "YES") {
            $('#txtDocPOB').val(doctorjson.POB_Amount);
        }
        // Visit Time or Visit Mode.
        if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
            if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                if (doctorjson.Doctor_Visit_Time != null && $.trim(doctorjson.Doctor_Visit_Time).length > 0) {
                    $('#lbltimepicker').html(doctorjson.Doctor_Visit_Time);
                }
                else {
                    fnSetServerTime();
                }
            } else {
                //$('#timepicker').val("");
                if (dvcode != null && $.trim(dvcode).length > 0) {
                    var visitmode = doctorjson.Visit_Mode == null ? "AM" : $.trim(doctorjson.Visit_Mode).length == 0 ? "AM" : doctorjson.Visit_Mode;
                    if (doctorjson.Doctor_Visit_Time != null && $.trim(doctorjson.Doctor_Visit_Time).length > 0) {
                        $('#timepicker').val(doctorjson.Doctor_Visit_Time);
                    }
                    else {
                        $('#timepicker').val("");
                    }
                }else
                {
                    $('#timepicker').val("");
                }
            }
        }
        else {
            if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                if (doctorjson.Visit_Mode != null && $.trim(doctorjson.Visit_Mode).length > 0) {
                    $('#lblvisitmode').html(doctorjson.Visit_Mode);
                }
                else {
                    fnSetServerTime();
                }
            }
            else {
                if (doctorjson.Visit_Mode == "PM") {
                    $('#rdpm').attr('checked', 'checked');
                }
                else {
                    $('#rdam').attr('checked', 'checked');
                }
            }
        }
        $('#txtDocRemarks').val(doctorjson.Remarks);
        var pindex = 0;
        if (productJson && productJson.length > 0) {
            for (var prIndex = 0; prIndex < productJson.length; prIndex++) {
                pindex = prIndex;
                pindex = pindex + 1;
                fnAddProductRow(true, $('#txtProd_' + pindex.toString())[0]);
                if (productAutoFill_g.length > 0) {
                    // only for saved doctors.
                    if (dvcode.length > 0) {
                        for (var pi = 0; pi < productAutoFill_g.length; pi++) {
                            if (productAutoFill_g[pi].value.split('_')[0] == productJson[prIndex].Product_Code) {
                                var avQty = productAutoFill_g[pi].label.substring(productAutoFill_g[pi].label.lastIndexOf('(') + 1).replace(')', '');
                                var gQty = productJson[prIndex].Quantity_Provided
                                var qty = parseInt(avQty) + parseInt(gQty);
                                productAutoFill_g[pi].label = productAutoFill_g[pi].label.substring(0, productAutoFill_g[pi].label.lastIndexOf('(')) + '(' + qty.toString() + ')';
                            }
                        }
                    }
                    var products = jsonPath(productAutoFill_g, "$[?(@.Product_Code=='" + productJson[prIndex].Product_Code + "')]");
                    if (products) {
                        $('#' + 'txtProd_' + pindex).val(products[0].label);
                        $('#' + 'hdnProd_' + pindex).val(products[0].value);
                    }
                    else {
                        $('#' + 'txtProd_' + pindex).val(productJson[prIndex].Product_Name);
                    }
                }
                else {
                    if (productJson[prIndex].Product_Name != null) {
                        $('#' + 'txtProd_' + pindex).val(productJson[prIndex].Product_Name);
                    }
                }

                $('#' + 'txtProdQty_' + pindex).val(productJson[prIndex].Quantity_Provided);
                if (productJson[prIndex].Is_Detailed == "1") {
                    $('#chkProdDetail' + pindex).attr('checked', true)
                }
                $('#txtProd_' + pindex).onkeypress = null;
            }
        }
        fnAddProductRow(null, 'txtProd_' + (++pindex).toString());

        var cindex = 0;
        if (chemistJson && chemistJson.length > 0) {
            // looping the chemists.

            var cindex = 0;
            for (var crIndex = 0; crIndex < chemistJson.length; crIndex++) {
                cindex = crIndex;
                cindex = cindex + 1;
                fnAddChemistRow(true, 'txtChem_' + cindex);
                $('#' + 'txtChem_' + cindex).val(chemistJson[crIndex].Chemist_Name);
                $('#' + 'hdnChem_' + cindex).val(chemistJson[crIndex].Chemist_Code);
                $('#' + 'txtChemPOB_' + cindex).val(chemistJson[crIndex].POB_Amount);

                // Retrieves the chemist visit code.
                var chemistVisitCode = chemistJson[crIndex].DCR_Chemists_Code;

                if (RCPA_g == "R") {
                    // Retrieves the given chemist rcpa details.
                    var rcpaList = jsonPath(rcpaJson, "$.[?(@.Chemist_Visit_Code=='" + chemistVisitCode + "')]");

                    if (rcpaList && rcpaList.length > 0) {
                        // declare the variables.
                        var prevProductCode;
                        var saleProductRowIndex = 0;

                        // looping the rcpa details.                
                        for (var rcIndex = 0; rcIndex < rcpaList.length; rcIndex++) {

                            // The 0 th index have default a rcpa sale product table, so we do not create a sale product table.
                            // and the 0 th product code set the previous product code.
                            // then check the next index dcr product code is same the previous product code, if same, we assume they are competitor row. so continue the statement.
                            // if not equal we assume next product comming and create a sale product row.
                            if (rcIndex != 0) {
                                if (prevProductCode != rcpaList[rcIndex].DCR_Product_Code) {
                                    fnAddSaleProductRow($('#txtchem_prod_' + cindex + '_' + saleProductRowIndex)[0]);
                                    saleProductRowIndex++;
                                    $('#' + 'txtchem_prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Product_Name);
                                    $('#' + 'txtchem_prodQty_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Suuport_Qty);
                                    $('#' + 'hdnchem_prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].DCR_Product_Code);
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                saleProductRowIndex++;
                                $('#' + 'txtchem_prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Product_Name);
                                $('#' + 'txtchem_prodQty_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Suuport_Qty);
                                $('#' + 'hdnchem_prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].DCR_Product_Code);
                            }

                            // Retrieve the competitors for selected product.

                            var compJSON = jsonPath(rcpaList, "$.[?(@.DCR_Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "')]");
                            // set the prev product code. this is important.
                            var prevProductCode = rcpaList[rcIndex].DCR_Product_Code;

                            // Remove the product name as competitor.
                            for (var i = 0; i < compJSON.length; i++) {
                                if (compJSON[i].Competitor_Product_Name == rcpaList[rcIndex].Product_Name) {
                                    compJSON.splice(i, 1);
                                }
                            }

                            // looping the competitors.
                            var compRowIndex = 0;
                            for (var compIndex = 0; compIndex < compJSON.length; compIndex++) {
                                var compRowIndex = compIndex + 1;
                                // In 0 th index we have default competitor row. so we do not create competitor row.
                                if (compIndex == 0) {
                                    $('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Competitor_Product_Name)
                                    $('#txtchem_prod_compQty_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Suuport_Qty)
                                    var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "' & @.label=='" + compJSON[compIndex].Competitor_Product_Name + "')]");
                                    if (compautoFill) {
                                        $('#hdnchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compautoFill[0].value);
                                    }
                                    else {
                                        $('#hdnchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val('');
                                    }
                                }
                                else {
                                    var preCompRowIndex = compRowIndex - 1;
                                    fnAddCompRow($('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + preCompRowIndex)[0])
                                    $('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Competitor_Product_Name);
                                    var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "' & @.label=='" + compJSON[compIndex].Competitor_Product_Name + "')]");
                                    if (compautoFill) {
                                        $('#hdnchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compautoFill[0].value);
                                    }
                                    else {
                                        $('#hdnchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val('');
                                    }
                                    $('#txtchem_prod_compQty_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Suuport_Qty)
                                }
                            }

                            // Creates a empty competitor row.
                            if (compJSON.length > 0) {
                                fnAddCompRow($('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex)[0])
                            }
                        }

                        // Creates a empty sale product row.
                        fnAddSaleProductRow($('#txtchem_prod_' + cindex + '_' + saleProductRowIndex)[0]);
                    }
                }
            }
        }
        fnAddChemistRow(null, 'txtChem_' + (++cindex));
    }
    else {
        if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
            fnSetServerTime();
        }
        fnAddProductRow(null);
        fnAddChemistRow(null);
    }
}

// Creates the Product Row. A row contains 4 cells.
// ProductName, Qty, Detailed and RemoveIcon.
function fnAddProductRow(isDraft, curProdObject) {
    // Increment the row Index. Retrieve the row length and insert a new row.
    productRowIndex_g++;

    var tblProductRowLength = $('#tbl_Produts tr').length;
    var newProductRow = document.getElementById('tbl_Produts').insertRow(parseInt(tblProductRowLength));
    newProductRow.id = "ProdRow" + productRowIndex_g;

    // Product Name.
    var td1 = newProductRow.insertCell(0);

    var htmlvalue = "";
    if (isDraft) {
        htmlvalue = "<input type='text' id='txtProd_" + productRowIndex_g + "' class='autoProduct txtproduct setfocus' maxlength='299'  onblur='fnValidateAutofill(this," + 'productAutoFill_g' + ",\"txtProd_\",\"hdnProd_\");' /><input type='hidden' id='hdnProd_" + productRowIndex_g + "'  />";
    }
    else {
        htmlvalue = "<input type='text' id='txtProd_" + productRowIndex_g + "' ondblclick='fnAddProductRow(null,this)'  onkeypress='fnAddProductRow(null,this)' maxlength='299' ";
        htmlvalue += "class='autoProduct txtproduct setfocus'  onblur='fnValidateAutofill(this," + 'productAutoFill_g' + " ,\"txtProd_\",\"hdnProd_\");' /><input type='hidden' id='hdnProd_" + productRowIndex_g + "' />";
    }


    $(td1).html(htmlvalue);
    $(td1).addClass("txtproduct");

    // Product Qty.
    var td2 = newProductRow.insertCell(1);
    var qtydefault = input_qty_default_g == "NO" ? "" : "0";
    $(td2).html("<input type='text' align='center' id='txtProdQty_" + productRowIndex_g + "' class='checkinteger' value='" + qtydefault + "' />")
    $(td2).addClass("txtqty");
    $(td2).attr('align', 'center');

    // Detailed Check box.
    var td3 = newProductRow.insertCell(2);
    $(td3).html("<input type='checkbox' id='chkProdDetail" + productRowIndex_g + "' />");
    $(td3).addClass('txtqty');
    $(td3).attr('align', 'left');

    // Remove icon.
    var td4 = newProductRow.insertCell(3);
    $(td4).html("<img id='prodRemove" + productRowIndex_g + "' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer' onclick='fnDeleteProductRow(" + productRowIndex_g + ")' />");
    if (curProdObject != null) {
        curProdObject.onkeypress = null;
        curProdObject.ondblclick = null;
    }
    if (productAutoFill_g.length > 0) {
        autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");
    }
    $(".setfocus").click(function () { $(this).select(); });
    $(".checkinteger").blur(function () { $(this).blur(function () { fnChekInteger(this) }); });

}

// Creates the Chemist Row. A row contains 3 cells.
// ChmeistName, POB and RemoveIcon.
function fnAddChemistRow(isDraft, curChemObject) {

    // Increment the row Index. Retrieve the row length and insert a new row.
    chemistRowIndex_g++;
    var tblChemistRowLength = $('#tbl_chemist tr').length;

    var newChemistRow = document.getElementById('tbl_chemist').insertRow(chemistRowIndex_g);
    newChemistRow.id = "chemRow" + chemistRowIndex_g;

    // Chemist Name.
    var td1 = newChemistRow.insertCell(0);

    if (RCPA_g == "N") {
        if (isDraft) {
            $(td1).html("<input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus'  maxlength='50' onblur='fnValidateAutofill(this," + 'chemistAutoFill_g' + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />");
        }
        else {
            $(td1).html("<input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' onkeypress='fnAddChemistRow(null,this)' ondblclick='fnAddChemistRow(null,this)'  maxlength='50' onblur='fnValidateAutofill(this," + 'chemistAutoFill_g' + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />");
        }
    }
    else if (RCPA_g.toUpperCase() == "R") {
        if (isDraft) {
            var rcpaJSON = "";
            var htmlvalue = "<input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' maxlength='50'  style='width:75%' onfocus='hideRCPA(\"" + chemistRowIndex_g + "\")' onblur='fnValidateAutofill(this," + chemistAutoFill_g + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />";
            htmlvalue += '<div id="divRCPA' + chemistRowIndex_g + '" style="display:none;background-color:#f7f7e7;width:95%;" >' + fnCreateRCPA(chemistRowIndex_g, rcpaJSON) + '</div>';
            $(td1).html(htmlvalue);
            autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
        }
        else {
            var rcpaJSON = "";
            //var htmlvalue = '<input type="text" id="txtChem_' + chemistRowIndex_g + '"  class="autoChemist txtchemisticon setfocus"  style="width:75%"  maxlength="50" onkeypress="fnAddChemistRow(null,this)" ondblclick="fnAddChemistRow(null,this)" onfocus="hideRCPA(\'' + chemistRowIndex_g + '\')" /><input type="hidden" id="hdnChem_' + chemistRowIndex_g + '" />';
            //var htmlvalue = '<input type="text" id="txtChem_' + chemistRowIndex_g + '"  class="autoChemist txtchemisticon setfocus"  style="width:75%"  maxlength="50"  onfocus="hideRCPA(\'' + chemistRowIndex_g + '\')" /><input type="hidden" id="hdnChem_' + chemistRowIndex_g + '" />';
            var htmlvalue = "<input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' maxlength='50'  style='width:75%' onkeypress='fnAddChemistRow(null,this)' ondblclick='fnAddChemistRow(null,this)' onfocus='hideRCPA(\"" + chemistRowIndex_g + "\")' onblur='fnValidateAutofill(this," + chemistAutoFill_g + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />";
            htmlvalue += '<div id="divRCPA' + chemistRowIndex_g + '" style="display:none;background-color:#f7f7e7;width:95%;;" >' + fnCreateRCPA(chemistRowIndex_g, rcpaJSON) + '</div>';
            $(td1).html(htmlvalue);
            autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
        }

    }
    $(td1).addClass('txtchemist');

    // Chemist POB.
    var td2 = newChemistRow.insertCell(1);
    $(td2).html('<input type="text" id="txtChemPOB_' + chemistRowIndex_g + '" style="vertical-align:top;"  valign="top" onblur="return fnCurrencyFormat(this, \'POB\')" />');
    $(td2).addClass('txtpob');
    $(td2).attr('align', 'center');

    // Remove Icon.
    var td3 = newChemistRow.insertCell(2);
    $(td3).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="fnDeleteChemistRow(' + chemistRowIndex_g + ')" />');
    $(td3).addClass('valign-top');
    $(td3).attr('align', 'center');

    if (curChemObject != null) {
        curChemObject.onkeypress = null;
        curChemObject.ondblclick = null;
    }
    autoComplete(chemistAutoFill_g, "txtChem_", "hdnChem_", "autoChemist");

    $(".setfocus").click(function () { $(this).select(); });

}

function fnCreateRCPA(chemistIndex, rcpaJSON) {
    var rcpaTableIndex = 1;
    var rcpatable = "";
    if (rcpaJSON != null && rcpaJSON.length > 0) {
        // TO DO: Create a RCPA table in Draft mode.

    }
    else {
        rcpatable = rcpaTableString_g.replace(/CHNUM/g, chemistIndex).replace(/RCPANUM/g, rcpaTableIndex);
        autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");

    }
    return rcpatable;
}

function fnAddSaleProductRow(salProdRow) {
    //tblchem_prod_CHNUM_RCPANUM
    var idArr = salProdRow.id.split('_');
    var chemistIndex = idArr[2];
    var rcpaIndex = idArr[3]
    var rcpaTable = rcpaTableString_g.replace(/CHNUM/g, chemistIndex).replace(/RCPANUM/g, ++rcpaIndex);
    var div1 = document.createElement('div');
    div1.innerHTML = rcpaTable;
    document.getElementById('divRCPA' + chemistIndex).appendChild(div1);
    if (salProdRow != null) {
        salProdRow.onkeypress = null;
        salProdRow.ondblclick = null;
    }
    autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
    $(".checkinteger").blur(function () { $(this).blur(function () { fnChekInteger(this) }); });

}

function fnAddCompRow(ctl) {
    var compIdArr = ctl.id.split('_');
    var compRow = compIdArr[5];
    var prodTblId = compIdArr[0] + "_" + compIdArr[1] + "_" + compIdArr[3] + "_" + compIdArr[4]; //ctl.id.replace('txt', 'tbl').substring(0, ctl.id.lastIndexOf('_'));
    prodTblId = prodTblId.replace('txt', 'tbl');

    var tblCompRowLength = $('#' + prodTblId + ' tr').length;
    var newCompRow = document.getElementById(prodTblId).insertRow(parseInt(tblCompRowLength));
    var tdcomp1 = newCompRow.insertCell(0);
    $(tdcomp1).html('&nbsp;');

    var tdcomp2 = newCompRow.insertCell(1);
    $(tdcomp2).html('&nbsp;');

    var tdcomp3 = newCompRow.insertCell(2);
    compRow = parseInt(compRow) + 1;
    var newcompId = ctl.id.substring(0, ctl.id.lastIndexOf('_')) + "_" + compRow.toString();
    $(tdcomp3).html('<input type="text" id="' + newcompId + '" onkeypress="fnAddCompRow(this)" onblur="fnValidateComp(this)"  class="checkspecialchar txtcomp newAddCompRow setfocus autoComp_' + compIdArr[3] + '_' + compIdArr[4] + '"  />');


    var tdcomp4 = newCompRow.insertCell(3);
    var newcompQtyId = compIdArr[0] + "_" + compIdArr[1] + "_" + compIdArr[2] + "Qty_" + compIdArr[3] + "_" + compIdArr[4] + "_" + compRow.toString();
    var hdnCompId = newcompId.replace('txt', 'hdn');
    $(tdcomp4).html('<input type="text" id="' + newcompQtyId + '" class="setfocus" style="width:25px !important; " /><input type="hidden" onblur="fnValidateComp(this)" id="'+hdnCompId+'"  />');

    if (!$("#" + newcompQtyId).hasClass("checkinteger")) {
        $("#" + newcompQtyId).addClass("checkinteger");
    }

    $("#" + newcompQtyId).keypress(function () { return fnIsNumber(event) });
    autoComplete(chemistAutoFill_g, "txtChem_", "hdnChem_", "autoChemist");
    var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "')]");
    autoComplete(compautoFill, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + compIdArr[3] + '_' + compIdArr[4]);
    ctl.onkeypress = null;
    $(".checkspecialchar").blur(function () { fnCheckSpecialChar(this); });
    $(".checkinteger").blur(function () { $(this).blur(function () { fnChekInteger(this) }); });
    $(".setfocus").click(function () { this.select; });


}

function fnshowRCPA(index) {
    document.getElementById("divRCPA" + index).style.display = '';
}

function hidePrev(ctl) {
    var pTbl = ctl.id.replace('txt', 'tbl');
    $('#' + pTbl + ' tr').fadeIn('fast');
    var pTbl = ctl.id.replace('txt', 'tbl');
    if (pTbl != "tblchem1_prod1") {
        pTbl = pTbl.substring(0, pTbl.length - 1) + (parseInt(pTbl.split('_')[1].replace('prod', '')) - 1).toString();
        $('#' + pTbl + ' tr:gt(1)').fadeOut('fast');
    }
}

function hideRCPA(index) {
    for (var rIndex = 1; rIndex <= chemistRowIndex_g; rIndex++) {
        if (index != rIndex) {
            if ($('#divRCPA' + rIndex) != null) {
                $('#divRCPA' + rIndex).fadeOut("fast");
            }
        }
        else {
            if ($('#divRCPA' + rIndex) != null) {
                $('#divRCPA' + rIndex).fadeIn("fast");
            }
        }
    }
}

function fnOnInit() {
    if ($('#hdnAction').val().toUpperCase() == "EDIT") {
        ShowModalPopup('dvLoading');
        fnCreateDoctorList("");
        if (dcrDoctorVisit_g != null) {
            if (dcrDoctorVisit_g[0].Data.length > 0) {
                var doctor = dcrDoctorVisit_g[0].Data[0];
                var dvCode = dcrDoctorVisit_g[0].Data[0].Doctor_Visit_Code;
                var productsJSONData = dcrDoctorVisit_g[1].Data;
                var chemistJSONData = dcrDoctorVisit_g[2].Data;
                var rcpaJSONData = dcrDoctorVisit_g[3].Data;
                var sampleCount = 0;
                var samplesJson = jsonPath(productsJSONData, "$.[?(@.DCR_Visit_Code=='" + dvCode + "')]");
                var chemistJson = jsonPath(chemistJSONData, "$.[?(@.DCR_Visit_Code=='" + dvCode + "')]");
                var rcpaJson = jsonPath(rcpaJSONData, "$.[?(@.DCR_Visit_Code=='" + dvCode + "')]");
                if (RCPA_g.toUpperCase() == "R") {
                    if (dcrDoctorVisit_g.length == 5 && dcrDoctorVisit_g[4].Data != null && dcrDoctorVisit_g[4].Data.length > 0) {
                        compAutoFill_g = dcrDoctorVisit_g[4].Data
                    }
                }

                // Bind the Doctor visit details.
                fnFillForm('default', doctor, samplesJson, chemistJson, rcpaJson);
            }
            else {
                $('#hdnbindRowNumber').val("0");
                fnAddProductRow(null);
                fnAddChemistRow(null);
                if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                    fnSetServerTime();
                }
            }
        }
        HideModalPopup('dvLoading');
    }
    else {
        ShowModalPopup('dvLoading');
        // Build the new form.
        var month = dcrActualDate_g.split('-')[1];
        var year = dcrActualDate_g.split('-')[0];
        if (queryString_g.split('&')[1].length > 0 || queryString_g.split('&')[2].length > 0) {
            $.ajax({
                type: 'POST',
                url: '../HiDoctor_Activity/DCRDoctorVisit/GetCPDoctors',
                data: 'tpname=' + escape(queryString_g.split('&')[2]) + '&cpname=' + escape(queryString_g.split('&')[1])+"&month="+month+"&year="+year,
                success: function (response) {
                    // we have the response

                    var result = response;
                    dcrDoctorVisit_g = result;
                    if (dcrDoctorVisit_g.length > 0) {
                        fnCreateDoctorList(dcrDoctorVisit_g);
                        // Bind the Doctor visit details.
                        var doctor = dcrDoctorVisit_g[0].Data[0];
                        var docCode = dcrDoctorVisit_g[0].Data[0].Doctor_Code;
                        var productsJSONData = dcrDoctorVisit_g[1].Data;
                        var doctorRegionCode = "";
                        if (dcrDoctorVisit_g[1].Data[0] != null && dcrDoctorVisit_g[1].Data[0].Doctor_Region_Code != "") {
                            doctorRegionCode = dcrDoctorVisit_g[1].Data[0].Doctor_Region_Code;
                        }
                        var samplesJson = jsonPath(productsJSONData, "$.[?(@.Doctor_Code=='" + docCode + "' & @.Doctor_Region_Code=='" + doctorRegionCode + "')]");
                        fnFillForm('default', doctor, samplesJson, chemistJson, rcpaJson);
                    }
                    else {

                        fnCreateDoctorList("");
                        fnAddProductRow(null);
                        fnAddChemistRow(null);
                        if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                            fnSetServerTime();
                        }
                    }
                    //fnAddProductRow(null);
                    //fnAddChemistRow(null);
                },
                error: function (e) {
                    fnMsgAlert('error', screenTitle, 'Get CP Doctors Failed.');
                    //$.msgbox("Get CP Doctors Failed.", { type: "error" });
                }
            });
        }
        else {
            fnCreateDoctorList("");
            fnAddProductRow(null);
            fnAddChemistRow(null);
            if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                fnSetServerTime();
            }
        }
    }
    HideModalPopup('dvLoading');
    $('#divPage').css('display', '');
}

function fnDeleteProductRow(index) {
    var rowLength = $('#tbl_Produts tr').length - 1;
    if (index == rowLength) {
        //$.msgbox("You are not allowed to delete this row!");
        fnMsgAlert('info', screenTitle, 'You are not allowed to delete this row!');
        //alert("You didnt delete this row!");
    }
    else {
        if (confirm('Do you wish to delete the Sample/Promotional item?')) {
            $('#ProdRow' + index).css('display', 'none');
        }
    }
}

function fnDeleteChemistRow(index) {
    if (index == $('.autoChemist').length) {
        //$.msgbox("You are not allowed to delete this row!");
        fnMsgAlert('info', screenTitle, 'You are not allowed to delete this row!');
        //alert("You didnt delete this row!");
    }
    else {
        if (confirm('Do you wish to delete the chemists?')) {
            $('#chemRow' + index).css('display', 'none');
        }
    }
}

function fnDeleteGridRow(dvCode, id) {
    if (dvCode != null && dvCode != "") {
        if (confirm('Do you wish to delete the Doctor/Customer and related details?')) {
            $.ajax({
                type: 'POST',
                url: '../HiDoctor_Activity/DCRDoctorVisit/DeleteDoctorVisitData',
                data: 'dvcode=' + dvCode + "&dcrActualDate=" + dcrActualDate_g + "&prodBringType=" + productBringType_g,
                success: function (response) {
                    // we have the response
                    var result = response;
                    
                    if (result != null) {
                        if (dvCode == $('#hdnDoctorVisitCode').val()) {
                            fnClear();
                        }
                        productAutoFill_g = result.Data;
                        productAutoFillOri_g = JSON.stringify(result.Data);
                        autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");
                        fnGetDoctorVisitData(2);
                    }
                    else {
                        //$.msgbox(result);
                        fnMsgAlert('error', screenTitle,result)
                        //alert(result);
                    }
                },
                error: function (e) {
                    //$.msgbox('Delete Transaction Failed.', { type: "error" });
                    fnMsgAlert('error', screenTitle, 'Delete Transaction Failed.');
                    //alert("Page Error");
                }
            });
        }
    }
    else {
        if (confirm('Do you wish to delete the Doctor/Customer?')) {
            var rowNo = id.split('_')[2];
            $('#' + id).css('display', 'none');
            if ($("#spnDocName_" + rowNo).html() == $('#txtDocName').val()) {
                fnClear();
            }
        }
    }
}

function sampleToolTip(sid) {
    $('#' + sid).tooltip({ effect: 'slide' });
}

function fnDeleteRows() {
    productRowIndex_g = 0;
    chemistRowIndex_g = 0;
    $('#tbl_Produts').html('<tr><td class="dcr_product_header" style="text-align:left;">Name</td><td class="dcr_product_header txtqty" style="text-align:left;padding-left:30px">QTY</td><td class="dcr_product_header txtqty" style="text-align:left;padding-left:23px;">Detailed</td><td class="dcr_product_header"></td></tr>');
    $("#tbl_chemist").html('<tr><td class="dcr_chemist_header" style="text-align:left;">Name</td><td class="dcr_chemist_header txtpob" style="text-align:left;padding-left:11px;">POB</td><td class="dcr_chemist_header"></td></tr>');
}

// Get DoctorVisitData.
function fnGetDoctorVisitData(calTime) {
    var month = dcrActualDate_g.split('-')[1];
    var year = dcrActualDate_g.split('-')[0];
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRDoctorVisit/GetDoctorVisitData',
        data: "dcrActualDate=" + dcrActualDate_g + '&tpname=' + escape(queryString_g.split('&')[2]) + '&cpname=' + escape(queryString_g.split('&')[1]) + "&month=" + month + "&year=" + year,
        success: function (response) {
            // set the ViewBag.
            dcrDoctorVisit_g = response.Data;
            if (calTime != 1) {
                $('#tbl_doctorvisit_list').html("");
                gridRowNo_g = 0;
                if (RCPA_g.toUpperCase() == "R") {
                    if (dcrDoctorVisit_g.length == 5 && dcrDoctorVisit_g[4].Data != null && dcrDoctorVisit_g[4].Data.length > 0) {
                        compAutoFill_g = dcrDoctorVisit_g[4].Data
                    }
                }
                fnCreateDoctorList(dcrDoctorVisit_g);
            }
            else {
                fnOnInit();

            }
        },
        error: function (e) {
            //$.msgbox('Get Doctor Visit Data Failed.', { type: "error" });
            fnMsgAlert('info', screenTitle, 'Get Doctor/Customer Visit Data Failed.');
            //alert("Page Error");
        }
    });
}

// Insert.
function fnInsertDoctorVisitData(isRedirecttoStockiest, rowpos) {
    //$('#div_doctorvisit').addClass('opacityClass');
    ShowModalPopup('dvLoading');
    if (!fnValidate(isRedirecttoStockiest, rowpos)) {
        HideModalPopup('dvLoading');
    }
}

// Validate.
function fnValidate(isRedirecttoStockiest, rowpos) {
    var dcr_visit_code = "";
    var doc_Name = "";
    var doc_code = "";
    var spec_name = "";
    var spec_code = "";
    var visit_mode = "";
    var visit_time = "";
    var remarks = "";
    var doc_pob = "0";
    var doc_string = "";
    var doc_category = "";
    var is_Acc_Doctor = 0;
    var Region_Code = "";

    // Doctor Name Required.
    if (!fnCheckIsNull($('#txtDocName'), 'Doctor/Customer Name')) {
        return false;
    }

    // duplicate doctor
    var doc_count = 0;
    var tempdvCode = "";
    for (var rowIndex = 0; rowIndex < $('#tbl_doctorvisit_list tr').length; rowIndex++) {
        var rowNum = rowIndex + 1;
        if ($.trim($('#txtDocName').val()) == $.trim($('#spnDocName_' + rowNum).html())) {
            doc_count++;
            if ($('#hdnDoctorVisitCode').val().length > 0) {
                tempdvCode = $('#spnDVCode_' + rowNum).html();
            }
        }
    }

    var rowNum = $('#hdnbindRowNumber').val();
    if ($('#hdnDoctorVisitCode').val().length > 0) {
        if (tempdvCode == $('#hdnDoctorVisitCode').val()) {
            if (doc_count > 1) {
                //$.msgbox('This doctor already entered.');
                fnMsgAlert('info', screenTitle, 'This Doctor/Customer already entered.');
                //alert("This doctor already entered.");
                return false;
            }
        }
        else {
            if (doc_count == 1) {
                //$.msgbox('This doctor already entered.');
                fnMsgAlert('info', screenTitle, 'This Doctor/Customer already entered.');
                return false;
            }
        }
    }
    else if ($('#hdnIsCPDoc').val() == 1 && doc_count > 1) {
        //$.msgbox('This doctor already entered.');
        fnMsgAlert('info', screenTitle, 'This Doctor/Customer already entered.');
        //alert("This doctor already entered.");
        return false;
    }
    else if ($('#hdnIsCPDoc').val() != 1 && doc_count == 1) {
        //$.msgbox('This doctor already entered.');
        fnMsgAlert('info', screenTitle, 'This Doctor/Customer already entered.');
        //alert("This doctor already entered.");
        return false;
    }

    
    // Check Doctor Entry Mode.
    // doctor name and speciality name.
    if (doctorEntryMode_g.toUpperCase() == 'YES') {
        if ($.trim($('#hdnDocName').val()).length == 0) {
            //$.msgbox('Invalid Doctor Name.');
            fnMsgAlert('info', screenTitle, 'Invalid Doctor/Customer Name.');
            //alert("Invalid Doctor Name.");
            return false;
        }
        else {
            var docvalidJSON = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + $('#hdnDocName').val() + "' & @.label=='" + $('#txtDocName').val() + "')]");
            if (!docvalidJSON) {
                fnMsgAlert('info', screenTitle, 'Invalid Doctor/Customer Name.');
                return false;
            }
        }
        doc_code = $('#hdnDocName').val();
        var doc_json = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + $('#txtDocName').val() + "')]");
        if (doc_json && doc_json.length > 0) {
            doc_category = doc_json[0].Category_Code;
            is_Acc_Doctor = doc_json[0].Is_Acc_Doctor;
            Region_Code = doc_json[0].Doctor_Region_Code;
        }
        doc_Name = $.trim($('#txtDocName').val()).split('_')[0];
        spec_name = $.trim($('#txtDocName').val()).split('_')[2];
    }
    else {
        if ($.trim($('#hdnDocName').val()).length == 0) {
            if (!fnCheckIsNull($('#txtDocSpeciality'), 'Speciality Name')) {
                return false;
            }
            else {
                if ($.trim($('#hdnspecname').val()).length == 0) {
                    fnMsgAlert('info', screenTitle, $('#hdnspecname').val() + 'is invalid Speciality Name.');
                    return false;
                }
                spec_code = $('#hdnspecname').val();
                doc_Name = $.trim($('#txtDocName').val());
                spec_name = $.trim($('#txtDocSpeciality').val());
            }
        }
        else {
            doc_code = $('#hdnDocName').val();
            doc_Name = $.trim($('#txtDocName').val()).split('_')[0];
            spec_name = $.trim($('#txtDocName').val()).split('_')[2];
            var doc_json = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + $('#txtDocName').val() + "')]");
            if (doc_json && doc_json.length > 0) {
                doc_category = doc_json[0].Category_Code;
                is_Acc_Doctor = doc_json[0].Is_Acc_Doctor;
                Region_Code = doc_json[0].Doctor_Region_Code;
            }
            else {
                fnMsgAlert('info', screenTitle, 'Invalid Doctor/Customer Name.');
                return false;
            }
        }
    }

    // Visit Time or Visit Mode.
    if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME") {
        if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
            visit_time = $('#lbltimepicker').html();
            visit_mode = $('#lbltimepicker').html().split(' ')[1];
        }
        else {
            if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY" && !fnCheckIsNull($('#timepicker'), 'Visit Time')) {
                return false;
            }

            if (fnChekTimeformat('timepicker')) {
                if ($('#timepicker').val().length > 0) {
                    visit_time = $('#timepicker').val();
                    visit_mode = $('#timepicker').val().split(' ')[1];
                }
                else {
                    visit_mode = "AM";
                }
            }
            else {
                //$.msgbox('Please enter valid Time format.');
                fnMsgAlert('info', screenTitle, 'Please enter valid Time format.');
                //alert("Please enter valid Time format.");
                return false;
            }
        }
    }
    else {
        if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
            visit_mode = $('#lblvisitmode').html();
            visit_time = $('#lbltimepicker').html();
        }
        else {
            if ($('#rdam').attr('checked') == 'checked') {
                visit_mode = "AM";
            }
            else {
                visit_mode = "PM";
            }
        }
    }

    // POB.
    if (doctorPOBAmount_g.toUpperCase() == "YES") {
        if ($.trim($('#txtDocPOB').val()).length != 0) {
            if (fnCurrencyFormat($('#txtDocPOB'), "POB")) {
                doc_pob = $('#txtDocPOB').val();
            }
            else {
                return false;
            }
        }
        else {
            doc_pob = "0.00";
        }
    }

    // Is CP Doctor.
    var isCpDoc = $('#hdnIsCPDoc').val();

    var dcr_visit_code = $('#hdnDoctorVisitCode').val()
    // remarks
    var remarks = $('#txtDocRemarks').val();

    //var result = fnCheckRemarksSpecialChar('#txtDocRemarks');
    if (!(fnCheckRemarksSpecialChar("#txtDocRemarks"))) {
        return false;
    }

    if ($.trim($('#txtDocRemarks').val()).length > 500) {
        //alert("You have entered more than 500 chars in Remarks. which is not allowed.");
        //$.msgbox('You have entered more than 500 chars in Remarks. which is not allowed.');
        fnMsgAlert('info', screenTitle, 'You have entered more than 500 chars in Remarks. which is not allowed.');
        return false;
    }

    var source_of_entry = "WEB";
    // doctor string.

    doc_string = escape(doc_Name) + "^" + doc_code + "^" + spec_name + "^" + spec_code + "^" + visit_mode + "^" + visit_time + "^" + doc_pob + "^" + isCpDoc + "^" + escape(remarks) + "^" + source_of_entry + "^" + doc_category + "^" + is_Acc_Doctor + "^"+Region_Code+"^";

    // Products.
    var prod_Rows = $('#tbl_Produts tr');
    var prodString = "";
    var prod_code = "";
    var prod_name = "";
    var prod_spec_code = "";
    var prod_qty = "";
    var product_count = 0;
    // looping the row collection.
    for (var prowIndex = 0; prowIndex < productRowIndex_g; prowIndex++) {

        if (prowIndex == 0) {
            continue;
        }

        // check the row is exist. if not continue the next row.
        if ($('#ProdRow' + prowIndex).css('display') == 'none') {
            continue;
        }

        // Retrieves the row input collection.
        var inp_array = $('#ProdRow' + prowIndex + ' input'); //prod_Rows[prowIndex].getElementsByTagName('input');

        // Product Name and Product Code.
        if ($.trim($(inp_array[0]).val()).length != 0) {
            if ($.trim($('#' + inp_array[1].id).val()).length == 0) {
                fnMsgAlert('info', screenTitle, 'The Sample/Promotional item ' + $(inp_array[0]).val() + ' is invalid.');
                return false;
            }
            else {
                var prod_code = $(inp_array[1]).val().split('_')[0];
                prod_name = $(inp_array[0]).val();
            }


            var prod_count = 0;
            for (var i = 1; i < $('#tbl_Produts tr').length - 1; i++) {
                
                if ($.trim($('#txtProd_' + i).val()).length != 0 && prod_name == $('#txtProd_' + i).val()) {
                    if ($('#ProdRow' + i).css('display') != 'none') {
                        prod_count++;
                        if (prod_count > 1) {
                            fnMsgAlert('info', screenTitle, 'The Sample/Promotional item ' + prod_name + ' already entered.');
                            return false;
                        }
                    }
                }
            }

            var qtydefault = input_qty_default_g == "NO" ? "" : "0";
            // Product Qty.

            // Product Qty.
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
                    fnMsgAlert('info', screenTitle, 'Please enter QTY for the Product ' + prod_name);
                    return false;
            }
                else {
                    prod_qty = 0;
                }
            }

            // isDetailed
            var isDetailed = $(inp_array[3]).attr('checked');
            isDetailed = isDetailed ? '1' : '0';
            product_count++;
            prodString += escape(prod_name) + "^" + prod_code + "^" + prod_qty + "^" + isDetailed + "^" + doc_code + "^"+Region_Code+"^";
        }
    }
    if (inputs_mandatory_number_g > 0) {
        if (inputs_mandatory_number_g > product_count) {
            fnMsgAlert('info', screenTitle, ' You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items.');
            return false;
        }
    }

    // Chemist.
    var chem_Rows = $('#tbl_chemist tr');
    var chem_name = "";
    var chem_code = "";
    var chem_pob = "0";
    var chemistString = "";
    var rcpaString = "";
    var chem_count = 0;
    var is_Acc_Chemist = '0'

    for (var crowIndex = 0; crowIndex < chemistRowIndex_g; crowIndex++) {

        // Skip the header row.
        if (crowIndex == 0) {
            continue;
        }

        // check, the row is exist, if not continue the loop.
        if ($('#chemRow' + crowIndex).css('display') == 'none') {
            continue;
        }

        // Retrieves the inputs collection.
        // We have chemist row id.
        var chemNum = crowIndex;
        var inp_array = $('#chemRow' + crowIndex + ' input');
        // Chemist Name and Chemist Code.
        if ($.trim($(inp_array[0]).val()).length != 0) {
            chem_name = $(inp_array[0]).val();
            chem_code = $('#hdnChem_' + crowIndex).val();

            chem_pob = $('#txtChemPOB_' + crowIndex).val();
            chem_count++;
            var specialCharregex = new RegExp("^[a-zA-Z0-9()._& ]+$");
            if (!specialCharregex.test(chem_name)) {
                fnMsgAlert('info', screenTitle, 'Please remove the special characters for chemist.' + chem_name);
                fnErrorIndicator(inp_array[0]);
                return false
            }
            else {
                fnRemoveErrorIndicatior(inp_array[0]);
            }

            if (!fnCurrencyFormat($('#txtChemPOB_' + crowIndex), "Chemist POB")) {
                return false;
            }

            if (!fnCurrencyFormat($('#txtChemPOB_' + crowIndex), "Chemist POB")) {
                return false;
            }

            if (chem_code.length > 0) {
                var chem_json = jsonPath(chemistAutoFill_g, "$.[?(@.value=='" + chem_code + "')]");
                if (chem_json && chem_json.length > 0) {
                    is_Acc_Chemist = chem_json[0].Is_Acc_Chemist;
                }
            }
            chem_pob = chem_pob.length > 0 ? chem_pob : 0;

            var chemname_count = 0;
            for (var i = 1; i < $('#tbl_chemist tr').length - 1; i++) {
                if (chem_name == $('#txtChem_' + i).val() && $('#txtChem_' + i).val().length != 0) {
                    if ($('#chemRow' + i).css('display') != 'none') {
                        chemname_count++;
                        if (chemname_count > 1) {
                            fnMsgAlert('info', screenTitle, 'The chemist ' + chem_name + ' already entered.');
                            return false;
                        }
                    }
                }
            }

            // Build the Chemist String.
            chemistString += escape(chem_name) + "^" + chem_code + "^" + chem_pob + "^" + visit_mode + "^" + is_Acc_Chemist + "^";
        }

        // Check the RCPA is R, Read the RCPA details.
        if ($.trim($(inp_array[0]).val()).length != 0) {
            if (RCPA_g.toUpperCase() == "R") {
                var rcpaResult = fnReadRcpaDetails(chemNum, chem_name);
                if (rcpaResult.toString().length > 0) {
                    if (rcpaResult == false) {
                        return false;
                    }
                    else {
                        rcpaString += rcpaResult;
                    }
                }

            }
        }
    }

    if (chemists_mandatory_number_g > 0) {
        if (chemists_mandatory_number_g > chem_count) {
            fnMsgAlert('info', screenTitle, 'You need to enter minimum of ' + chemists_mandatory_number_g + ' chemists.');
            return false;
        }
    }

    // Doctor Name Change Validation.
    if ($('#hdnbindRowNumber').val() != "0" && $('#hdnbindRowNumber').val().length > 0) {
        if (doc_code.length > 0) {
            if ($.trim($('#txtDocName').val()) != $.trim($('#spnDocName_' + rowNum).html()) && (prodString.length > 0 || (chemistString.length > 0 || rcpaString.length > 0))) {
                var oldname = $.trim($('#spnDocName_' + rowNum).html());
                var newname = $.trim($('#txtDocName').val());
                if (!confirm("You have changed the Doctor/Customer name from " + oldname + " to " + newname + ".\nDo you wish to retain the chemist entry and Sample/Promotional item entry?")) {
                    doc_string = escape(doc_Name) + "^" + doc_code + "^" + spec_name + "^" + spec_code + "^" + visit_mode + "^" + visit_time + "^" + doc_pob + "^" + isCpDoc + "^" + escape(remarks) + "^" + source_of_entry + "^";
                    prodString = "";
                    chemistString = "";
                    rcpaString = "";
                    fnInsertDoctor(dcr_visit_code, doc_string, prodString, chemistString, rcpaString, isRedirecttoStockiest, rowpos);
                    return;
            }

            }
        }
        else {
            if ($.trim($('#txtDocName').val()) != $.trim($('#spnDocName_' + rowNum).html().split('_')[0]) && (prodString.length > 0 || (chemistString.length > 0 || rcpaString.length > 0))) {
                var oldname = $.trim($('#spnDocName_' + rowNum).html());
                var newname = $.trim($('#txtDocName').val());
                if (!confirm("You have changed the Doctor/Customer name from " + oldname + " to " + newname + ".\nDo you wish to retain the chemist entry and Sample/Promotional item entry?")) {
                    doc_string = escape(doc_Name) + "^" + doc_code + "^" + spec_name + "^" + spec_code + "^" + visit_mode + "^" + visit_time + "^" + doc_pob + "^" + isCpDoc + "^" + escape(remarks) + "^" + source_of_entry + "^";
                    prodString = "";
                    chemistString = "";
                    rcpaString = "";
                    fnInsertDoctor(dcr_visit_code, doc_string, prodString, chemistString, rcpaString, isRedirecttoStockiest, rowpos);
                    return;
                }

        }
    }
    }
    // RCPA Mandatoty Check.
    if (RCPA_g.toUpperCase() == "R") {
        if (rcpaString.length == 0) {
            var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
            if (rcpaMandatory.length > 0) {
                var rcapCategoryArray = rcpaMandatory.split(',');
                var doctorCategory = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + $('#hdnDocName').val() + "')]");
                if ( doctorCategory && doctorCategory[0].Category != null) {
                    if ($.inArray(doctorCategory[0].Category, rcapCategoryArray) > -1) {
                        fnMsgAlert('info', screenTitle, "For " + rcpaMandatory + " doctors, you need to enter minimum of one RCPA entry.")
                        HideModalPopup('dvLoading');
                        return false;
                    }
                }
            }
        }
    }

    fnInsertDoctor(dcr_visit_code, doc_string, prodString, chemistString, rcpaString, isRedirecttoStockiest, rowpos);
}

function fnReadRcpaDetails(chemRowNum, chem_name) {
    var rcpastr = "";
    var rcpaObject = $('#divRCPA' + chemRowNum + ' table')

    // RCPA Tables Count.
    var rcpaTablesCount = $('#divRCPA' + chemRowNum + ' table').length;
    for (var rcpaRowIndex = 0; rcpaRowIndex < rcpaTablesCount; rcpaRowIndex++) {
        var rcpaProduct = "";
        var rcpaComp = "";
        var rcpaCompQty = "";

        var compCodes = new Array();
        //tblchem_prod_CHNUM_RCPANUM
        var rcpaIndex = rcpaRowIndex + 1;

        // Retrieves the each table row length.(including competitor rows).
        var rcpaRowLength = $('#tblchem_prod_' + chemRowNum + "_" + rcpaIndex + ' tr').length;
        for (var rindex = 0; rindex < rcpaRowLength; rindex++) {
            //txtchem_prod_CHNUM_RCPANUM
            // Skip the header.
            if (rindex == 0) {
                continue;
            }
           
            var rcpaNum = rindex;
            // if row no is 1.
            // Read the Product and the same product as competitor and read the first row competitor.
            if (rcpaNum == 1) {

                if ($('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex)) {
                    // if product name length is not equal is 0. we read the product.
                    if ($('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex).val().length != 0) {

                        // Retrieve the product name.
                        rcpaProduct = $('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex).val();

                        // Retrieve the Product code and check is valid.
                        rcpaProductCode = $('#hdnchem_prod_' + chemRowNum + '_' + rcpaIndex).val();
                        if (rcpaProductCode.length == 0) {
                            fnMsgAlert('info', screenTitle, "Invalid Sale Product " + rcpaProduct + " for chemist " + chem_name + ".");
                            return false;
                        }

                        // set the product as competitor.
                        rcpaComp = rcpaProduct;

                        // Retrieve the Product Qty.
                        // txtchem_prodQty_CHNUM_RCPANUM
                        rcpaCompQty = $('#txtchem_prodQty_' + chemRowNum + '_' + rcpaIndex).val();
                        if (rcpaCompQty.length == 0) {
                            rcpaCompQty = "0";
                        }

                        var rcpaProdCount = 0;
                        for (var index = 1; index <= rcpaTablesCount - 1; index++) {
                            if ($('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex).val() == $('#txtchem_prod_' + chemRowNum + '_' + index).val()) {
                                rcpaProdCount++;
                                if (rcpaProdCount > 1) {
                                    //$.msgbox('The sale product ' + rcpaProduct + ' already entered for chemist ' + chem_name + '.');
                                    fnMsgAlert('info', screenTitle, 'The sale product ' + rcpaProduct + ' already entered for chemist ' + chem_name + '.');
                                    //alert('The sale product ' + rcpaProduct + ' already entered for chemist ' + chem_name + '.')
                                    return false;
                                }
                            }
                        }

                        // Concatenate the string.
                        rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaProductCode + "^";
                        
                        // Read the first row competitor name and qty.
                        if ($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val().length > 0) {

                            var rcpaComp = $('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            var rcpaCompCode = $('#hdnchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            var rcpaCompQty = $('#txtchem_prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            if (rcpaCompCode.length > 0) {
                                compCodes.push(rcpaCompCode);
                            }
                            if (rcpaCompQty.length == 0) {
                                rcpaCompQty = "0";
                            }
                        }
                        else {
                            // if first row competitor length is 0. loop is continue.
                            continue;
                        }
                    }
                    else {
                        // if first row product length is 0. loop is continue go to next product.

                        break;
                    }
                }
            }
            else {
                //txtchem_prod_compQty_CHNUM_RCPANUM_1
                // Read the other competitors row.
                if ($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val().length > 0) {
                    var rcpaComp = $('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                    var rcpaCompCode = $('#hdnchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                    var rcpaCompQty = $('#txtchem_prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                    if (rcpaCompCode.length > 0) {
                        if ($.inArray(rcpaCompCode, compCodes) > -1) {
                            fnMsgAlert('info', screenTitle, 'The ' + rcpaComp + ' competitor name more than once for product ' + rcpaProduct + '.');
                            return false;
                        }
                        else {
                            compCodes.push(rcpaCompCode);
                        }
                    }
                    var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&]+$");
                    if (!specialCharregex.test(rcpaComp)) {
                        fnMsgAlert('error', screenTitle, 'Please remove the special characters for competitor.' + rcpaComp);
                        //$.msgbox('Please remove the special characters for competitor.' + rcpaComp);
                        fnErrorIndicator($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                        return false
                    }
                    else {
                        fnRemoveErrorIndicatior($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                    }
                    if (rcpaCompQty.length == 0) {
                        rcpaCompQty = "0";
                    }

                }
                else {
                    // if competitor row length is 0. Continue next row.
                    continue;
                }
            }

            rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^"+rcpaCompCode+"^";
        }
    }
    return rcpastr;
}

function fnInsertDoctor(dcrVisitCode, docString, productString, chemistString, rcpaString, isRedirecttoStockiest, rowpos) {
    var result = "";
    var dcrDate = dcrActualDate_g.split('-')[2] + "-" + dcrActualDate_g.split('-')[1] + "-" + dcrActualDate_g.split('-')[0];
    $('#btnSave').attr('disabled', true)
    ShowModalPopup('dvLoading');
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRDoctorVisit/InsertDCRDoctorVisitData',
        data: "dcrVisitCode=" + dcrVisitCode + "&dcrActualDate=" + dcrActualDate_g + "&doctor=" + docString + "&products=" + productString + "&chemists=" + chemistString + "&rcpa=" + rcpaString + "&rcpaFlag=" + RCPA_g+"&prodBringType="+productBringType_g+"&sourceOfEntry=WEB",
        success: function (response) {
            // we have the response
            $('#btnSave').attr('disabled', false);
            formMode_g = "";
            var result = "";
            if (response.Data == null) {
               result = response
            }
            else {
                result = response.Data;
            }
            $('#btnSave').attr('disabled', false);
           
            if (typeof result != "object" && result.indexOf('Error') > -1) {
                //alert(result.replace(/Error:/, ''));
                fnMsgAlert('info', 'DCR DoctorVisit', result.replace(/Error:/, ''), { type: "error" })
                //$.msgbox(result.replace(/Error:/, ''), { type: "error" });
            }
            else {
                formMode_g = "";
                
                if (isRedirecttoStockiest) {
                    var rowNo = $('#hdnbindRowNumber').val();
                    $('#imgSelected' + rowNo).css('display', '');
                    if ($('#hdnDoctorVisitCode').val().length == 0 && $('#hdnIsCPDoc').val() != "1") {
                        gridRowNo_g++;
                        fnRowCreation(result, 0);
                    }
                    else {
                        fnRowUpdation(result, rowNo);
                    }
                    fnRedirectTostockiestVisit();
                    HideModalPopup('dvLoading');
                    return;
                }
                if ($('#hdnDoctorVisitCode').val().length == 0 && $('#hdnIsCPDoc').val() != "1") {
                    gridRowNo_g++;
                    fnRowCreation(result, 0);
                    if (rowpos == null) {
                        if (gridRowNo_g == "1") {
                            fnClear();
                            $('#doc_List_1').removeClass('grdRowSelected');
                        }
                        else {
                            //fnFillForm("1");
                            fnClear();
                            $('#doc_List_1').removeClass('grdRowSelected');
                        }
                    } else {
                        fnFillFormEdit(rowpos);
                    }
                }
                else {
                    if (isRedirecttoStockiest) {
                        var rowNo = $('#hdnbindRowNumber').val();
                        $('#imgSelected' + rowNo).css('display', '');
                        fnRowUpdation(result, rowNo);
                        fnRedirectTostockiestVisit();
                        //var rcpaValue = RCPA_g.toUpperCase() == "R" ? "Y" : "N";
                        //$('#main').load('../DCRStockiestExpense/Create/?dcrDate=' + dcrActualDate_g + '&dcrStatus=' + status_g + '&entity=' + escape(category_g) + '&travelkm=' + travelledKMS_g + '&isRCPA=' + rcpaValue);
                        HideModalPopup('dvLoading');
                    }
                    if (rowpos == null) {
                        var rowNo = $('#hdnbindRowNumber').val();
                        $('#imgSelected' + rowNo).css('display', '');
                        fnRowUpdation(result, rowNo);
                        rowNo = parseInt($('#hdnbindRowNumber').val()) + parseInt(1);
                        if (rowNo <= $('#tbl_doctorvisit_list tr').length) {
                            for (var i = rowNo; i <= $('#tbl_doctorvisit_list tr').length; i++) {
                                if ($("#doc_List_" + i).css('display') == "none") {
                                    continue;
                                }
                                rowNo = i;
                                break;
                            }
                            if ($("#doc_List_" + $('#hdnbindRowNumber').val()).css('display') != "none") {
                                fnFillForm(rowNo);
                            }
                            else {
                                $('#doc_List_' + $('#hdnbindRowNumber').val()).removeClass('grdRowSelected');
                                fnClear();
                            }
                        }
                        else {
                            if ($('#tbl_doctorvisit_list tr').length == 1) {
                                $('#doc_List_' + $('#hdnbindRowNumber').val()).removeClass('grdRowSelected');
                                fnClear();
                            }
                            else {
                                // fnFillForm("1");
                                $('#doc_List_' + $('#hdnbindRowNumber').val()).removeClass('grdRowSelected');
                                fnClear();
                            }
                        }
                    }
                    else {
                        var rowNo = $('#hdnbindRowNumber').val();
                        $('#imgSelected' + rowNo).css('display', '');
                        fnRowUpdation(result, rowNo);
                        if(rowpos != null)
                            for(var i=rowpos;i<=$('#tbl_doctorvisit_list tr').length;i++)
                            {
                                if ($("#doc_List_" + i).css('display') == "none") {
                                    continue;
                                }
                                rowpos = i;
                                break;
                            }
                        if ($("#doc_List_" + rowpos).css('display') != "none") {
                            fnFillFormEdit(rowpos);
                        }
                        else {
                            $('#doc_List_' + $('#hdnbindRowNumber').val()).removeClass('grdRowSelected');
                            fnClear();
                        }
                        //fnFillForm(rowpos);
                    }
                }
            }
            $('#btnSave').attr('disabled', false)
            HideModalPopup('dvLoading');
        },
        error: function (e) {
            fnMsgAlert('error', 'DCR Doctor Visit', "Sorry. Unable to save the Doctor/Customer visit data.");
            //$.msgbox('Sorry. Unable to save the Doctor/Customer visit data.', { type: "error" });
            //fnMsgAlert('error', 'Error', 'Sorry. Unable to save the doctor visit data.');
            //alert("Page Error");
            $('#btnSave').attr('disabled', false)
            HideModalPopup('dvLoading');
        }
    });
}

function fnBindNextRow() {
    var rowNo = parseInt($('#hdnbindRowNumber').val()) + 1;
    if (rowNo <= $('#tbl_doctorvisit_list tr').length) {
        fnFillForm(rowNo);
    }
    else {
        fnFillForm("1");
    }
}

function fncancel() {
    if (formMode_g == "Edit") {
        if (confirm('Do you wish to cancel the changes?')) {
            if ($('#hdnbindRowNumber').val().length > 0) {
                if ($('#hdnbindRowNumber').val() != "0") {
                    formMode_g = "";
                    var rowNo = parseInt($('#hdnbindRowNumber').val());
                    fnFillForm(rowNo);
                }
                else {
                    fnClear();
                    
                }
            }
            else {
                fnFillForm('default');
            }
        }
    }
}

function fnClear() {
    $('#hdnbindRowNumber').val("0");
    $('#hdnDoctorVisitCode').val("");
    $('#hdnIsCPDoc').val("");
    $('#txtDocName').val("");
    $('#hdnDocName').val("");
    $('#txtDocPOB').val("");
    $('#txtDocSpeciality').val("");
    $('#timepicker').val("");
    $('#txtDocRemarks').val("");
    fnDeleteRows();
    fnAddProductRow(null, 'txtprod1');
    fnAddChemistRow(null, 'txtchem1');
    formMode_g = "";
    productAutoFill_g = eval('(' + productAutoFillOri_g + ')');
    $('.grdRowSelected').removeClass('grdRowSelected');
    fnhighlightRowColor('-1');
    if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
        $('#timepicker').css('display', 'none');
        fnSetServerTime();
    }
}

function fnInsertCPDoctors() {
    if (formMode_g == "Edit") {
        if (confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.')) {
            fnInsertDoctorVisitData(true);
        }
    }
    else {
        fnRedirectTostockiestVisit();
        HideModalPopup('dvLoading');
    }
}

function fnhighlightRowColor(index) {
    for (var i = 0; i < $('#tbl_doctorvisit_list tr').length; i++) {
        var rowIndex = i + 1;
        if (rowIndex == index) {
            // $('#rowSelected_' + index).css('display', '');
            $('#doc_List_' + index).addClass('grdRowSelected');
            $('#grdSelectArrow_' + rowIndex).css('display', '');

        }
        else {
            //$('#rowSelected_' + index).css('display', 'none');
            $('#doc_List_' + rowIndex).removeClass('grdRowSelected');
            $('#grdSelectArrow_' + rowIndex).css('display', 'none');
        }
    }
}


function fnRedirectToHeader() {
    var dvCode = "ALL";
    // delete doctors.
    if (status_g == 1 && (source_g.toUpperCase() == 'CALENDAR')) {
        if ($('#tbl_doctorvisit_list tr').length > 0) {
            if (confirm('Do you wish to delete Doctor/Customer and Doctor/Customer details?')) {
                $.ajax({
                    type: 'POST',
                    url: '../HiDoctor_Activity/DCRDoctorVisit/DeleteDoctorVisitDataAll',
                    data: 'dcrActualDate=' + queryString_g.split('&')[3],
                    success: function (response) {
                        // we have the response
                        var result = response;
                        if (result == "SUCCESS") {
                            // fnGetDoctorVisitData(2);
                            fnGoToHeader();
                        }
                        else {
                            // alert(result);
                            //$.msgbox(result);
                            fnMsgAlert('error', 'DCR Doctor Visit', result);
                        }
                    },
                    error: function (e) {
                        //$.msgbox('Redirection Failed.', { type: "error" });
                        fnMsgAlert('error', 'DCR Doctor Visit', 'Redirection Failed.');
                    }
                });
            }
        }
        else {
            fnGoToHeader()
        }
    }
    else {
        fnGoToHeader()
    }
}

function fnGoToHeader() {
    if (RCPA_g == "N") {
        $('#main').load('../HiDoctor_Activity/DCRHeader/Create/?dcrDate=' + dcrDate + '&dcrStatus=' + status_g + '&isrcpa=N&source=TAB_DOCTOR&flag=' + flag_g);
    }
    if (RCPA_g == "R") {
        $('#main').load('../HiDoctor_Activity/DCRHeader/Create/?dcrDate=' + dcrDate + '&dcrStatus=' + status_g + '&isrcpa=Y&source=TAB_DOCTOR&flag=' + flag_g);
    }
}

function fnSetFormMode() {

    formMode_g = "Edit";
}

function fnCheckQuantity() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRDoctorVisit/CheckQuantity',
        data: 'dcrActualDate=' + dcrActualDate_g,
        success: function (response) {
            // we have the response
            var result = response;
            if (result == "0") {
                //var rcpaValue = RCPA_g.toUpperCase() == "R" ? "Y" : "N";
                $('#main').load('../DCRStockiestExpense/Create/?dcrDate=' + dcrActualDate_g + '&dcrStatus=' + status_g + '&entity=' + escape(category_g) + '&travelkm=' + travelledKMS_g + '&isRCPA=' + RCPA_g + '&accRegions=' + escape(queryString_g.split('&')[0]) + "&flag=" + flag_g);
                HideModalPopup('dvLoading');
            }
            else {
                var dvcode = result.split('^')[0];
                var product = result.split('^')[1];
                if ($('#tbl_doctorvisit_list tr').length > 0) {
                    var tableLength = $('#tbl_doctorvisit_list tr').length;
                    for (var i = 1; i <= tableLength; i++) {
                        if ($('#spnDVCode_' + i).html() == dvcode) {
                            $.msgbox("The Product " + product + " quantity exceeded for Doctor/Customer " + $('#spnDocName_' + i).html());
                            //alert("The Product " + product + " quantity exceeded for doctor " + $('#spnDocName_' + i).html());
                            break;
                        }
                    }
                }

            }
        },
        error: function (e) {
            $.msgbox("Product quantity check failed.");
            HideModalPopup('dvLoading');
            //fnMsgAlert('error', 'Error', 'Redirection Failed.');
        }
    });
}

function fnCheckMandatoryFields(rowNum) {
    // Check Doctor Entry Mode.
    // doctor name and speciality name.
    var doctorJSON = eval('(' + $('#hdnDoctorJson_' + rowNum).val() + ')');
    var productJSON = eval('(' + $('#hdnSampleJson_' + rowNum).val() + ')');
    var chemistJSON = eval('(' + $('#hdnChemistJson_' + rowNum).val() + ')');
    var rcpaJSON = eval('(' + $('#hdnRCPAJson' + rowNum).val() + ')');
    if (doctorEntryMode_g.toUpperCase() == 'YES') {
        var doc_codeJSON = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + doctorJSON.Doctor_Code + "')]");
        if (doc_codeJSON.toString() == "false" || doc_codeJSON.length == 0) {
            $.msgbox(' The Doctor/Customer' + $('#spnDocName_' + rowNum).html() + ' is invalid.');
            return false;
        }
    }


    // Visit Time or Visit Mode.
    if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
        if (doctorJSON.Doctor_Visit_Time == null || doctorJSON.Doctor_Visit_Time.length == 0) {
            $.msgbox('please enter the visit time for the Doctor/Customer' + $('#spnDocName_' + rowNum).html() + '.');
            return false;
        }

    }
    if (inputs_mandatory_number_g > 0) {
        if (productJSON.length == null) {
            $.msgbox('You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items for the Doctor/Customer ' + $('#spnDocName_' + rowNum).html() + '.');
            return false;
        }
        if (inputs_mandatory_number_g > productJSON.length) {
            $.msgbox('You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items for the Doctor/Customer ' + $('#spnDocName_' + rowNum).html() + '.');
            //fnMsgAlert('error', 'Error', ' You need to enter minimum of ' + inputs_mandatory_number_g + ' inputs.');
            return false;
        }

    }

    if (chemists_mandatory_number_g > 0) {
        if (chemistJSON.length == null) {
            $.msgbox('You need to enter minimum of ' + chemists_mandatory_number_g + ' chemist for the Doctor/Customer ' + $('#spnDocName_' + rowNum).html() + '.');
            return false;
        }
        if (chemists_mandatory_number_g > chemistJSON.length) {
            $.msgbox('You need to enter minimum of ' + chemists_mandatory_number_g + ' chemists for the Doctor/Customer ' + $('#spnDocName_' + rowNum).html() + '.');
            //fnMsgAlert('error', 'Error', 'You need to enter minimum of ' + chemists_mandatory_number_g + ' chemists.');
            // alert("You should be entered the " + chemists_mandatory_number_g + ' chemists.');
            return false;
        }
    }


    // RCPA Mandatoty Check.
    if (RCPA_g.toUpperCase() == "R") {
        if (rcpaJSON.length == null || rcpaJSON.length == 0) {
            var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
            if (rcpaMandatory.length > 0) {
                var rcapCategoryArray = rcpaMandatory.split(',');
                var doctorCategory = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + doctorJSON.Doctor_Code + "')]");
                if (doctorCategory && doctorCategory[0].Category != null) {
                    if ($.inArray(doctorCategory[0].Category, rcapCategoryArray) > -1) {
                        $.msgbox("For " + $('#spnDocName_' + rowNum).html() + "(" + rcpaMandatory + ")" + " doctors, you need to enter minimum of one RCPA entry.");
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function fnRedirectTostockiestVisit() {
    var listLength = $('#tbl_doctorvisit_list tr').length;
    var isThereAnyDoctorSave = 0;
    if (listLength == 0) {
        fnMsgAlert("info", screenTitle, "Please enter atleast one doctor.");
        return false;
    }
    
    for (var rowIndex = 0; rowIndex < listLength; rowIndex++) {
        var rowPos = rowIndex + 1;
        if ($('#doc_List_' + rowIndex).css('dispaly') != 'none') {
            if ($('#spnDVCode_' + rowPos).html().length > 0) {
                isThereAnyDoctorSave = 1;
                if (!fnCheckMandatoryFields(rowPos)) {
                    HideModalPopup('dvLoading');
                    return false;
                }
            }
        }
    }

    if (isThereAnyDoctorSave == 0) {
        fnMsgAlert("info", screenTitle, "Please enter atleast one doctor.");
        return false;
    }
    $('#main').load('../HiDoctor_Activity/DCRStockiestExpense/Create/?dcrDate=' + dcrActualDate_g + '&dcrStatus=' + status_g + '&entity=' + escape(category_g) + '&travelkm=' + travelledKMS_g + '&isRCPA=' + RCPA_g + '&accRegions=' + escape(queryString_g.split('&')[0]) + "&flag=" + flag_g+'&cpCode='+escape(queryString_g.split('&')[1]) +'&tpCode='+escape(queryString_g.split('&')[2]));
    //fnCheckQuantity();
}

function fnTableShowHide(tableid, spnid) {
    if ($('#' + tableid).css("display") == "none") {
        $('#' + tableid).fadeIn('slow');
        $('#' + spnid).removeClass('expand');
        $('#' + spnid).addClass('collapse');
    }
    else {
        $('#' + tableid).fadeOut('slow');
        $('#' + spnid).removeClass('collapse');
        $('#' + spnid).addClass('expand');
    }
}

function fnGetCompetitors(obj) {
    
    var saleProductCode = $('#' + obj.id.replace('txt', 'hdn')).val();
    var tblObj = $('#' + obj.id.replace('txt', 'tbl'))
    var indexArray = tblObj[0].id.split('_');
    var cheindex = indexArray[2];
    var rcpaindex = indexArray[3];

    for (var i = 1; i < tblObj[0].rows.length; i++) {
        $('#txtchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).unautocomplete();
        $('#txtchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
        $('#hdnchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
    }
    
    var objComp = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='"+saleProductCode+"')]");
    if (!objComp) {
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/DCRDoctorVisit/GetCompetitorsName',
            data: 'saleproductcode=' + saleProductCode+'^',
            success: function (response) {
                // we have the response
                compAutoFill_g.push(response);
                res_g = response;
                
                autoComplete(response, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);

            },
            error: function (e) {
                $.msgbox("Product quantity check failed.");

                //fnMsgAlert('error', 'Error', 'Redirection Failed.');
            }
        });
    }
    else {
        var cheindex = indexArray[2];
        var rcpaindex = indexArray[3];
        autoComplete(objComp, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
    }
}

function fnValidateComp(ctl)
{
    
    var compIdArr = ctl.id.split('_');
    var cheindex = compIdArr[3];
    var rcpaindex = compIdArr[4];
    // var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "' & @.label=='" + ctl.value + "')]");
    var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "' & @.label=='" + ctl.value + "')]");
    if (compautoFill) {
        $('#' + ctl.id.replace('txt', 'hdn')).val(compautoFill[0].value);
        //ctl.id.replace('txt', 'hdn').value = compautoFill[0].value;
    }
    else {
         $('#'+ctl.id.replace('txt', 'hdn')).val('');
    }
}

function fnSetServerTime() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRDoctorVisit/GetServerTime',
        success: function (response) {
            // we have the response
            if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
                $('#lbltimepicker').html(response);
                var mode = response.split(' ')[1];
                $('#lblvisitmode').html(mode);
            }
            else {
                var mode = response.split(' ')[1];
                $('#lblvisitmode').html(mode);
                $('#lbltimepicker').html(response);
            }
        },
        error: function (e) {
        }
    });
}