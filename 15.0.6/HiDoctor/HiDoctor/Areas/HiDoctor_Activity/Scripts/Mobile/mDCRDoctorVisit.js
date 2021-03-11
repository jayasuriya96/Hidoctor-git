/*
doctorDetails_g[0].Data[0] = Doctor Data.
doctorDetails_g[1].Data = Products Data.
doctorDetails_g[3].Data = Chemist Data
doctorDetails_g[4].Data = RCPA Data
*/
var getProdRow_g = 0;
var getChemRow_g = 0;
var prodRow_g = 0;
var chemRow_g = 0;
var isProductsget_g = false;
var isChemistsget_g = false;
var doctorDetails_g = "";
var compAutoFill_g = new Array();
var intregex_g = new RegExp("^[0-9]+$");
var screenTitle = "Doctor Visit";
var productString_g = '<div id="divProduct_PDNUM" class="prdcount" data-icon="delete" style="border:1px solid #aaa;padding:3px" ><div data-role="fieldcontain"  data-mini="true"><a href="#" id="deleteProduct_PDNUM" class="delete-icon" style="float:right;margin-top:-10px;margin-right:5px;" onclick="fnDeleteProduct(this)"></a><label for="prodSpan_PDNUM"></label><span id="prodSpan_PDNUM" style="font-weight:bold;padding-left:5px;font-size:12px;"></span><input id="prodhdn_PDNUM" type="hidden" value="0" /></div>';
productString_g += '<div data-role="fieldcontain"><fieldset data-role="controlgroup"><label for="toggIsDetailed_PDNUM">Is Detailed</label><select name="toggIsDetailed_PDNUM" id="toggIsDetailed_PDNUM" data-theme="b" data-role="slider"data-mini="true">'
productString_g += '<option value="0">No</option><option value="1">Yes</option></select></fieldset></div>';
productString_g += '<div data-role="fieldcontain" data-mini="true"><fieldset class="fel" data-role="controlgroup" data-mini="true"><label for="txtprdqty_PDNUM">Qty</label><input name="Qty" maxlength="3" type="text" id="txtprdqty_PDNUM" placeholder="0" value="" >';
productString_g += '</fieldset></div><div><div style="clear:both"></div>';

var chemistString_g = ' <div id="divChemist_CDNUM" style="border:1px solid #aaa;padding:3px" ><div data-role="fieldcontain"><a href="#" id="deleteChemist_CDNUM"  class="delete-icon"  onclick="fnDeleteChemist(this)"  style="float:right;width:35px;margin-top:-10px;margin-right:5px"></a><label for="selectche_CDNUM">Chemist</label><span id="chemistspan_CDNUM" style="font-weight:bold;padding-left:5px;font-size:12px;"></span><input id="chemisthdn_CDNUM" type="hidden" value="0" />';
chemistString_g += '<div id="divflexichme_CDNUM"><label for="txtChemist_CDNUM">if not listed type here</label><input id="txtChemist_CDNUM" maxlength="50" type="text" value=""></div></div><div data-role="fieldcontain" data-mini="true"><fieldset data-role="controlgroup" data-mini="true"><label for="txtchepob_CDNUM">';
chemistString_g += 'POB</label><input name="POB" id="txtchepob_CDNUM" placeholder="0.00" value="" maxlength="6" type="text"></fieldset><input type="hidden" id="hdnRCPANo_CDNUM" value="0"></div><div id="dvRCPA_CDNUM"></div><div id="dvAddSaleProduct_CDNUM"><a href="#" onclick="fnAddRCPA(\'CDNUM\')" >Add RCPA</a><div></div>';

var rcpaString_g = '<div data-role="collapsible-set" data-theme="e" data-content-theme="c" data-mini="true" id="dvRCPA_CDNUM_RDNUM">';
rcpaString_g += '<div data-role="collapsible" data-collapsed="false" data-mini="true"><h3>RCPA</h3><div style="width:24px;height:24px;float:right"><a href="#" id="deleteRCPA_CDNUM_RDNUM" onclick="fnDeleteRCPA(this)" class="delete-icon"  style="float:right;margin-right:5px"></a></div><div style="clear:both"></div>';
rcpaString_g += '<div data-inset="true" data-theme="c" data-mini="true"><input type="hidden" id="hdncomp_CDNUM_RDNUM" value="1"><label for="selectsaleprod_CDNUM_RDNUM">Sale Product</label><select data-mini="true" id="selectsaleprod_CDNUM_RDNUM" onchange="fnResetCompAutofill(this)"/><label for="txtsaleprodQty_CDNUM_RDNUM">Qty</label><input type="text" maxlength="3" id="txtsaleprodQty_CDNUM_RDNUM" value="0" /> ';
rcpaString_g += '<div style="background:#bbb;margin:5px;padding:5px"><div id="dvComp_CDNUM_RDNUM"  data-inset="true" data-theme="E" data-mini="true">';
rcpaString_g += '<div id="dvcomp_CDNUM_RDNUM_1" style="border-bottom:1px solid #222"><div style="float:right;heigth:24px;width:100%"><a href="#"  onclick="fnDeleteComp(this)" id="deletecomp_CDNUM_RDNUM_1" class="delete-icon" style="float:right;width:35px;margin-top:-5px;"></a></div><div><div style="clear:both"></div><label for="selectcomp_CDNUM_RDNUM_1">Comp</label><select id="selectcomp_CDNUM_RDNUM_1" class="compauto_CDNUM_RDNUM" data-mini="true" ></select><label for="txtcomp_CDNUM_RDNUM_1">if not listed type here</label><input type="text" value="" id="txtcomp_CDNUM_RDNUM_1" maxlength="50" />';
rcpaString_g += '<label for="txtcompqty_CDNUM_RDNUM_1">Qty</label><input type="text" id="txtcompqty_CDNUM_RDNUM_1" maxlength="3" /></div></div><div><a href="#" id="addcomp_CDNUM_RDNUM_1" onclick="fnAddCompRow(this)" >Add Comp</a></div></div></div></div></div>';

var compHTML_g = '<div id="dvcomp_CDNUM_RDNUM_CODNUM"   style="border-bottom:1px solid #222"><div style="float:right;height:24px;width:100%"><a href="#" id="deletecomp_CDNUM_RDNUM_CODNUM" class="delete-icon" onclick="fnDeleteComp(this)"   style="float:right;margin-top:3px;"></a></div><div style="clear:both"></div><label for="selectcomp_CDNUM_RDNUM_CODNUM">Comp</label><select id="selectcomp_CDNUM_RDNUM_CODNUM"  data-mini="true"  class="compauto_CDNUM_RDNUM"></select><label for="txtcomp_CDNUM_RDNUM_CODNUM">if not listed type here</label><input type="text" value="" id="txtcomp_CDNUM_RDNUM_CODNUM" maxlength="50" />';
compHTML_g += '<label for="txtcompqty_CDNUM_RDNUM_CODNUM">Qty</label><input  data-mini="true" maxlength="3"  type="text" id="txtcompqty_CDNUM_RDNUM_CODNUM" /></div>';

function fnAddProductRow(pqty, pCode, pName) {
    prodRow_g = prodRow_g + 1;

    var productHTML = productString_g.replace(/PDNUM/g, prodRow_g);
    $('#productlist').append(productHTML).trigger('create');

    if ($('.prdcount').length > 0) {
        $('#dvBotAddInputs').css('display', '');
    }

    var qtydefault = input_qty_default_g == "NO" ? "" : "0";
    $('txtprdqty_' + prodRow_g).val(qtydefault);
    if (pName != null && pName.length > 0) {
        var avQty = pName.substring(pName.lastIndexOf('(') + 1).replace(')', '');
        var qty = parseInt(avQty) + parseInt(pqty);
        pName = pName.substring(0, pName.lastIndexOf('(')) + '(' + qty.toString() + ')'
        $('#prodSpan_' + prodRow_g).html(pName);
        $('#prodhdn_' + prodRow_g).val(pCode);
    }
    else {
        $('#prodSpan_' + prodRow_g).html("");
        $('#prodhdn_' + prodRow_g).val("");
    }

}

function fnAddProducts() {
    try {
        $('#productmodaldiv').simpledialog2('close');
        $.mobile.loading('show');
        if ($('#slectedinputslist li').length > 0) {
            var plength = $('#slectedinputslist li').length
            for (var p = 0; p < plength; p++) {
                fnAddProductRow();
                $('#prodSpan_' + prodRow_g).html($('#slectedinputslist li a.getPrdlabel')[p].innerHTML);
                $('#prodhdn_' + prodRow_g).val($('#slectedinputslist input')[p].value.split('_')[0]);
            }
        }
        $('.prdselected').removeClass('prdselected');
        $('input[data-type="search"]').val('')
        $('#slectedinputslist').html("");

        $.mobile.loading('hide');
    }
    catch (e) {
        fnMsgAlert('info', screenTitle, e.message);
        $.mobile.loading('hide');
    }
}

function fnAddChemists() {
    try {
        $('#chemistmodaldiv').simpledialog2('close');
        $.mobile.loading('show');

        if ($('#slectedchemistslist li').length > 0) {
            var clength = $('#slectedchemistslist li').length
            for (var c = 0; c < clength; c++) {
                fnAddChemistRow();
                $('#chemistspan_' + chemRow_g).html($('#slectedchemistslist li a.getChelabel')[c].innerHTML);
                $('#chemisthdn_' + chemRow_g).val($('#slectedchemistslist input')[c].value);
                $('#divflexichme_' + chemRow_g).css('display', 'none');
            }
        }
        $('#slectedchemistslist').html("");

        $('.cheselected').removeClass('cheselected');
        $('input[data-type="search"]').val('');
        $.mobile.loading('hide');
    }
    catch (e) {
        fnMsgAlert('info', screenTitle, e.message);
        $.mobile.loading('hide');
    }
}


function showProductDialog() {
    if (isProductsget_g) {
        $.mobile.loading('show');
        $('#productmodaldiv').simpledialog2();
        $.mobile.loading('hide');
        return false;
    }
    else {
        fnGetProducts();
    }
}

function showChemistDialog(objche) {
    if (isChemistsget_g) {
        $.mobile.loading('show');
        $('#chemistmodaldiv').simpledialog2();
        $.mobile.loading('hide');
        return false;
    }
    else {
        fnGetChemists();
    }
}




function fnAddChemistRow(cheName) {
    chemRow_g = chemRow_g + 1;
    var chemistHTML = chemistString_g.replace(/CDNUM/g, chemRow_g);
    $('#chemistlist').append(chemistHTML).trigger('create');
    if (RCPA_g == "N") {
        $('#dvAddSaleProduct_' + chemRow_g).css('display', 'none');
    }
}

function fnAddRCPA(cheNo) {
    var rcpaRowNo = $('#hdnRCPANo_' + cheNo).val();
    rcpaRowNo = parseInt(rcpaRowNo) + 1;
    var rcpaHTML = rcpaString_g.replace(/CDNUM/g, cheNo).replace(/RDNUM/g, rcpaRowNo);
    $('#dvRCPA_' + cheNo).append(rcpaHTML).trigger('create');
    $('#hdnRCPANo_' + cheNo).val(rcpaRowNo);
    if (RCPAProductAutofill_g.length > 0) {
        $('#selectsaleprod_' + cheNo + '_' + rcpaRowNo).append('<option value="0" >Select Product</option>');
    }
    else {
        $('#selectsaleprod_' + cheNo + '_' + rcpaRowNo).append('<option value="0" >No Product</option>');
    }
    for (var r = 0; r < RCPAProductAutofill_g.length; r++) {
        $('#selectsaleprod_' + cheNo + '_' + rcpaRowNo).append('<option value="' + RCPAProductAutofill_g[r].value + '" >' + RCPAProductAutofill_g[r].label + '</option>')
    }
    $('#selectsaleprod_' + cheNo + '_' + rcpaRowNo).val('0');
    $('#selectsaleprod_' + cheNo + '_' + rcpaRowNo).selectmenu('refresh');
    $('#selectcomp_' + cheNo + '_' + rcpaRowNo + '_1').append('<option value="0">No Competitor</option>');
    $('#selectcomp_' + cheNo + '_' + rcpaRowNo + '_1').val('0');
    $('#selectcomp_' + cheNo + '_' + rcpaRowNo + '_1').selectmenu('refresh');
}

function fnAddCompRow(ctl) {
    var idArr = ctl.id.split('_');
    var cheIndex = idArr[1];
    var rcpaIndex = idArr[2];
    var compIndex = idArr[3];
    compIndex = parseInt($('#hdncomp_' + cheIndex + '_' + rcpaIndex).val()) + 1;
    $('#hdncomp_' + cheIndex + '_' + rcpaIndex).val(parseInt($('#hdncomp_' + cheIndex + '_' + rcpaIndex).val()) + 1);
    ctl.id = 'addcomp_' + cheIndex + '_' + rcpaIndex + '_' + compIndex;
    var compHTML = compHTML_g.replace(/CDNUM/g, cheIndex).replace(/RDNUM/g, rcpaIndex).replace(/CODNUM/g, compIndex);
    $('#dvComp_' + cheIndex + '_' + rcpaIndex).append(compHTML).trigger('create');
    var saleProdCode = $('#selectsaleprod_' + cheIndex + '_' + rcpaIndex).val();
    var compJson = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + saleProdCode + "')]");
    if (compJson.length > 0) {
        $('#selectcomp_' + cheIndex + '_' + rcpaIndex + '_' + compIndex).append('<option value="0">Select Competitor</option>')
    }
    else {
        $('#selectcomp_' + cheIndex + '_' + rcpaIndex + '_' + compIndex).append('<option value="0">No Competitor</option>')
    }
    for (var co = 0; co < compJson.length; co++) {
        $('#selectcomp_' + cheIndex + '_' + rcpaIndex + '_' + compIndex).append('<option value="' + compJson[co].value + '" >' + compJson[co].label + '</option>')
    }
    $('#selectcomp_' + cheIndex + '_' + rcpaIndex + '_' + compIndex).val('0');
    $('#selectcomp_' + cheIndex + '_' + rcpaIndex + '_' + compIndex).selectmenu('refresh')
}

function fnResetCompAutofill(ctl) {
    $.mobile.showPageLoadingMsg('Retriveing Competitiors');
    var coIdArr = ctl.id.split('_');
    var cheNum = coIdArr[1];
    var rcpaRowNum = coIdArr[2];
    var compRows = $('#hdncomp_' + coIdArr[1] + '_' + coIdArr[2]).val();
    $('.compauto_' + cheNum + '_' + rcpaRowNum).empty()
    $('.compauto_' + cheNum + '_' + rcpaRowNum).text('');
    var saleproductvalue = $('#' + ctl.id).val();
    var compJSON = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + saleproductvalue + "')]");
    if (compJSON) {
        $.mobile.hidePageLoadingMsg('Retriveing Competitiors');
    }
    else {
        $.ajax({
            type: 'POST',
            url: '/HiDoctor_Activity/DCRDoctorVisit/GetCompetitorsName',
            data: 'saleproductcode=' + saleproductvalue + '^',
            async: false,
            success: function (response) {
                // we have the response
                compAutoFill_g.push(response);
                compJSON = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + saleproductvalue + "')]");
                $.mobile.showPageLoadingMsg('Retriveing Competitiors');
            },
            error: function (e) {
                fnMsgAlert('error', screenTitle, 'Get Competitor Failed.');
                $.mobile.showPageLoadingMsg('Retriveing Competitiors');
            }
        });
    }
    $.mobile.loading('hide');
    if (compJSON.length > 0) {
        for (var k = 1; k <= compRows; k++) {
            $('#selectcomp_' + cheNum + '_' + rcpaRowNum + '_' + k).append('<option value="0">Select Competitor</option>')
        }
    }
    else {
        for (var k = 1; k <= compRows; k++) {
            $('#selectcomp_' + cheNum + '_' + rcpaRowNum + '_' + k).append('<option value="0">No Competitor</option>')
        }
    }

    for (var k = 1; k <= compRows; k++) {
        for (var j = 0; j < compJSON.length; j++) {
            $('#selectcomp_' + cheNum + '_' + rcpaRowNum + '_' + k).append('<option value="' + compJSON[j].value + '" >' + compJSON[j].label + '</option>')
        }
    }

    for (var k = 1; k <= compRows; k++) {
        $('#selectcomp_' + cheNum + '_' + rcpaRowNum + '_' + k).val('0');
        $('#selectcomp_' + cheNum + '_' + rcpaRowNum + '_' + k).selectmenu('refresh');
    }
}

function fnDeleteProduct(ctl) {
    $('#' + ctl.id.replace('delete', 'div')).remove();
    $('.duplicateProductHighlight').removeClass('duplicateProductHighlight');
    if ($('.prdcount').length == 0) {
        $('#dvBotAddInputs').css('display', 'none');
    }
}

function fnDeleteChemist(ctl) {
    $('#' + ctl.id.replace('delete', 'div')).remove();
    $('.duplicateChemistHighlight').removeClass('duplicateChemistHighlight');
}

function fnDeleteRCPA(ctl) {
    $('#' + ctl.id.replace('delete', 'dv')).remove();
}

function fnDeleteComp(ctl) {
    $('#' + ctl.id.replace('delete', 'dv')).remove();
}

function fnGetDoctorVisitData() {
    try {
        var codeArr = codes_g.split(',');
        var dvCode = codeArr[0];
        var pdCode = codeArr[1];
        var cvCode = codeArr[2];
        var rdCode = codeArr[3];
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRDoctorVisit/GetSelectedDoctorVisitDetails',
            data: "dvCode=" + escape(dvCode) + "&pdCodes=" + escape(pdCode) + "&cvCodes=" + escape(cvCode) + "&rdCodes=" + escape(rdCode) + "&dcrActualDate=" + escape(dcrActualDate_g),
            success: function (response) {
                doctorDetails_g = response.Data;
                if (doctorDetails_g != null && doctorDetails_g.length > 0 && doctorDetails_g.length == 5) {
                    compAutoFill_g.push(doctorDetails_g[4]);
                }

                fnFillFormDetails();

            },
            error: function (e) {
                $.mobile.loading('hide');
                return false;
            }
        });
    }
    catch (e) {
        fnMsgAlert('info', screenTitle, e.message);
        $.mobile.loading('hide');
    }
}

function fnGetProduct(value, text, n) {
    $('#slectedinputslist').append('<li id="selectprd_' + n + '"><a class="getPrdlabel" href="#">' + text + '</a><a href="#" onclick="fnDeleteProductPoPUp(\'' + n + '\')"></a></li><input type="hidden" value="' + value + '">')
    $('#prdname_' + n).addClass('prdselected');
    $('#slectedinputslist').trigger('create');
    $('#slectedinputslist').listview('refresh');
}

function fnDeleteProductPoPUp(n) {
    $('#selectprd_' + n).remove();
    $('#prdname_' + n).removeClass('prdselected');
}


function fnGetChemist(value, text, n) {
    $('#slectedchemistslist').append('<li id="selectche_' + n + '"><a class="getChelabel" href="#">' + text + '</a><a href="#" onclick="fnDeleteChemistPopUp(\'' + n + '\')"></a></li><input type="hidden" value="' + value + '">')
    $('#chename_' + n).addClass('cheselected')
    $('#slectedchemistslist').trigger('create');
    $('#slectedchemistslist').listview('refresh');
}

function fnDeleteChemistPopUp(n) {
    $('#selectche_' + n).remove();
    $('#chename_' + n).removeClass('cheselected');
}

function fnGetAutoFillData() {
    try {
        $.ajax({
            type: 'POST',
            data: 'accRegions=' + accUsers_g + "&accChemist=" + accChemistPri_g + "&ProdBringType=" + productBringType_g,
            url: '/HiDoctor_Activity/DCRDoctorVisit/SetAutofillViewBag',
            success: function (response) {
                // we have the response
                var result = response.Data;
                if (result.length == 0) {
                    //fnGetDoctorVisitData();
                }
                else {
                    doctorAutoFill_g = result[0].Data;
                    chemistAutoFill_g = result[1].Data;
                    productAutoFill_g = result[2].Data;
                    productAutoFillOri_g = JSON.stringify(result[2].Data);
                    RCPAProductAutofill_g = result[3].Data;
                    specialityAutoFill_g = result[4].Data;

                    var c = codes_g.replace(/\^/g, '').replace(/,/g, '');
                    if (c.length > 0) {
                        fnGetDoctorVisitData();
                    }
                    else {
                        var regionCode = "";
                        var docname = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + docname_g + "')]");
                        if (docname) {
                            $('#txtDocName').val(docname[0].label);
                            $('#hdnDocCode').val(docname[0].value);
                            regionCode = docname[0].Doctor_Region_Code;
                        }
                        else {
                            $('#txtDocName').val(docname_g);
                        }

                        fnSetServerTime();
                        var products = jsonPath(doclist_g[1].Data, "$.[?(@.Doctor_Code=='" + $('#hdnDocCode').val() + "' & @.Doctor_Region_Code=='" + regionCode + "')]");
                        if (products) {
                            /* for (var p = 0; p < products.length; p++) {
                                 var pname = products[p].Product_Name;
                                 var pqty = products[p].Quantity_Provided;
                                 var isDetailed = products[p].Is_Detailed
                                 var pCode = products[p].Product_Code;
                                 fnAddProductRow(pqty, pCode);
                                 $('#selectprd_' + prodRow_g).val(pCode);
                                 $("#selectprd_" + prodRow_g).selectmenu('refresh');
                                 $('#toggIsDetailed_' + prodRow_g).val(isDetailed)
                                 $('#toggIsDetailed_' + prodRow_g).slider('refresh');
                                 $('#txtprdqty_' + prodRow_g).val(pqty);
                             }*/
                        }
                        //fnAddProductRow();
                        //fnAddChemistRow();
                        if (RCPA_g == "R") {
                            fnAddRCPA(1);
                        }

                        $.mobile.loading('hide');
                    }

                    // fnAddProductRow();
                    //fnAddChemistRow();
                }
                //fnCreateDoctorList();
                //alert(10);
            },
            error: function (e) {
                $.mobile.loading('hide');
                alert("Error" + e);
            }
        });
    }
    catch (e) {
        fnMsgAlert('info', screenTitle, e.message);
        $.mobile.loading('hide');
    }
}

function fnGetPrefillData() {

    $.ajax({
        type: 'POST',
        data: 'accRegions=' + accUsers_g + "&showAccData=" + accChemistPri_g,
        url: '/HiDoctor_Activity/DCRDoctorVisit/GetDoctorsAndSpecialityM',
        success: function (response) {
            // we have the response
            var result = response;
            if (result.length == 0) {
                //fnGetDoctorVisitData();
            }
            else {
                if (result[0] != null) {
                    doctorAutoFill_g = result[0].Data;
                }
                if (result[1].Data != null) {
                    specialityAutoFill_g = result[1].Data;
                }
                if (result[2].Data != null) {
                    RCPAProductAutofill_g = result[2].Data;
                }
                var c = codes_g.replace(/\^/g, '').replace(/,/g, '');
                if (c.length > 0) {
                    fnGetDoctorVisitData();
                }
                else {
                    var regionCode = "";
                    var docname = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + docname_g + "')]");
                    if (docname) {
                        $('#txtDocName').val(docname[0].label);
                        $('#hdnDocCode').val(docname[0].value);
                        regionCode = docname[0].Doctor_Region_Code;
                    }
                    else {
                        $('#txtDocName').val(docname_g);
                    }

                    fnSetServerTime();
                    var products = jsonPath(doclist_g[1].Data, "$.[?(@.Doctor_Code=='" + $('#hdnDocCode').val() + "' & @.Doctor_Region_Code=='" + regionCode + "')]");
                    if (products) {
                        for (var p = 0; p < products.length; p++) {
                            var pname = products[p].Product_Name;
                            var pqty = products[p].Quantity_Provided;
                            var isDetailed = products[p].Is_Detailed
                            var pCode = products[p].Product_Code;
                            var currentStock = products[p].Current_Stock;
                            pname = pname + '(' + currentStock + ')';
                            fnAddProductRow(pqty, pCode);
                            $('#prodSpan_' + prodRow_g).html(pname);
                            $('#prodhdn_' + prodRow_g).val(pCode);
                            $('#toggIsDetailed_' + prodRow_g).val(isDetailed)
                            $('#toggIsDetailed_' + prodRow_g).slider('refresh');
                            $('#txtprdqty_' + prodRow_g).val(pqty);
                        }
                    }
                    //   fnAddProductRow();
                    //  fnAddChemistRow();
                    if (RCPA_g == "R") {
                        //fnAddRCPA(1);
                    }

                    $.mobile.loading('hide');
                }
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
            alert("Error" + e);
        }
    });

}

function fnFillFormDetails() {

    try {
        if (doctorDetails_g.length > 0 && doctorDetails_g[0].Data != null) {
            var doctorData = doctorDetails_g[0].Data[0];
            var visitMode = "AM";
            var visitTime = "";
            var docname = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + docname_g + "')]");
            if (docname) {
                $('#txtDocName').val(docname[0].label);
                $('#hdnDocCode').val(docname[0].value);
            }
            else {
                if (docname_g.indexOf('__') > -1) {
                    $('#txtDocName').val(docname_g.replace('__', '_'));
                }
            }
            $('#hdnDVCode').val(doctorData.Doctor_Visit_Code);
            doctorData.Visit_Mode = doctorData.Visit_Mode == null ? "AM" : $.trim(doctorData.Visit_Mode).length == 0 ? "AM" : doctorData.Visit_Mode;
            if (dcrDoctorVisitTimeEntryModeValue_g != "SERVER_TIME") {
                if (doctorData.Doctor_Visit_Time.length > 0 && doctorData.Doctor_Visit_Time.indexOf(' ') > -1) {
                    visitMode = doctorData.Doctor_Visit_Time.split(' ')[1];
                    visitTime = doctorData.Doctor_Visit_Time.split(' ')[0];
                }
                else {
                    visitMode = doctorData.Visit_Mode;
                    visitTime = doctorData.Doctor_Visit_Time.split(' ')[0];
                }
                if (doctotVisitTime_g.toUpperCase() == "AM_PM") {
                    $('#togDocVisitMode').val(doctorData.Visit_Mode)
                    $('#togDocVisitMode').slider('refresh');
                }
                else {
                    var hour = "";
                    var min = "";
                    var mode = "AM";
                    var visitMode = doctorData.Visit_Mode;
                    if (visitTime != null && visitTime.length > 0) {
                        var timeArr = visitTime.split(':');

                        hour = timeArr[0];
                        min = timeArr[1];
                    }
                    if (visitMode != null) {
                        mode = visitMode;
                    }
                    $('#drpHour').val(hour);
                    if ($("#drpMin option[value='" + min + "']").length > 0) {
                        $('#drpMin').val(min);
                    }
                    else {
                        if (min != null && min.length > 0) {
                            $("#drpMin").append('<option value="' + min + '">' + min + '</option>');
                            $("#drpMin").val(min);
                        }
                    }
                    $('#drpTimeMode').val(visitMode);
                    $('#drpHour').selectmenu('refresh');
                    $('#drpMin').selectmenu('refresh');
                    $('#drpTimeMode').selectmenu('refresh');
                }
            }
            else {
                if (doctotVisitTime_g.toUpperCase() == "AM_PM") {
                    if (doctorData.Visit_Mode != null && $.trim(doctorData.Visit_Mode).length > 0) {
                        $('#lblvisitmode').html(doctorData.Visit_Mode)
                        doctorData.Doctor_Visit_Time = doctorData.Doctor_Visit_Time == null ? "" : $.trim(doctorData.Doctor_Visit_Time).length == 0 ? "" : doctorData.Doctor_Visit_Time;
                        $('#lblVisitTime').html(doctorData.Doctor_Visit_Time);
                    }
                    else {
                        fnSetServerTime();
                    }
                }
                else {
                    if (doctorData.Doctor_Visit_Time != null && $.trim(doctorData.Doctor_Visit_Time).length > 0) {

                        $('#lblVisitTime').html(doctorData.Doctor_Visit_Time);
                        $('#lblvisitmode').html(doctorData.Visit_Mode);
                    }
                    else {
                        fnSetServerTime();
                    }
                }
            }
            if (doctorPOBAmount_g.toUpperCase() == "YES") {
                $('#txtDocPOB').val(doctorData.POB_Amount);
            }
            $('#txtDocRemarks').val(doctorData.Remarks);


            // STRAT: Product Rows
            if (doctorDetails_g[1].Data != null && doctorDetails_g[1].Data.length > 0) {
                var productsData = doctorDetails_g[1].Data;
                for (var p = 0; p < productsData.length; p++) {
                    var pname = productsData[p].Product_Name;
                    var pqty = productsData[p].Quantity_Provided;
                    var isDetailed = productsData[p].Is_Detailed
                    var pCode = productsData[p].Product_Code;
                    var currentStock = productsData[p].Current_Stock;
                    pname = pname + '(' + currentStock + ')';
                    fnAddProductRow(pqty, pCode, pname);
                    $('#prodSpan_' + prodRow_g).html(pname);
                    $('#prodhdn_' + prodRow_g).val(pCode);
                    $('#toggIsDetailed_' + prodRow_g).val(isDetailed)
                    $('#toggIsDetailed_' + prodRow_g).slider('refresh');
                    $('#txtprdqty_' + prodRow_g).val(pqty);
                }
            }
            //fnAddProductRow();
            // END: Product Rows.

            // START: Chemist Rows.
            if (doctorDetails_g[2].Data != null && doctorDetails_g[2].Data.length > 0) {
                var chemistData = doctorDetails_g[2].Data;
                for (var c = 0; c < chemistData.length; c++) {
                    fnAddChemistRow();
                    var cname = chemistData[c].Chemist_Name;
                    var cpob = chemistData[c].POB_Amount;
                    var cCode = chemistData[c].Chemist_Code;
                    var cChemistVisitCode = chemistData[c].DCR_Chemists_Code;
                    if (cCode.length > 0) {
                        $('#chemistspan_' + chemRow_g).html(cname);
                        $('#chemisthdn_' + chemRow_g).val(cCode);
                        $('#divflexichme_' + chemRow_g).css('display', 'none');
                    }
                    else {
                        $('#txtChemist_' + chemRow_g).val(cname);
                    }
                    $('#txtchepob_' + chemRow_g).val(cpob);
                    if (RCPA_g == "R") {
                        // START: RCPA Rows.
                        if (doctorDetails_g[3].Data != null && doctorDetails_g[3].Data.length > 0) {
                            var rcpaJSON = jsonPath(doctorDetails_g[3].Data, "$.[?(@.Chemist_Visit_Code=='" + cChemistVisitCode + "')]");
                            var preSaleProduct = "";
                            if (rcpaJSON && rcpaJSON.length > 0) {
                                for (var r = 0; r < rcpaJSON.length; r++) {
                                    if (rcpaJSON[r].DCR_Product_Code != preSaleProduct) {
                                        fnAddRCPA(chemRow_g);
                                        var rcpaRow = $('#hdnRCPANo_' + chemRow_g).val();
                                        var saleProdCode = rcpaJSON[r].DCR_Product_Code;
                                        preSaleProduct = saleProdCode;
                                        var supportQty = rcpaJSON[r].Suuport_Qty;
                                        $('#selectsaleprod_' + chemRow_g + '_' + rcpaRow).val(saleProdCode);
                                        $('#selectsaleprod_' + chemRow_g + '_' + rcpaRow).selectmenu('refresh');
                                        $('#txtsaleprodQty_' + chemRow_g + '_' + rcpaRow).val(supportQty);
                                        var compJson = jsonPath(rcpaJSON, "$.[?(@.Chemist_Visit_Code=='" + cChemistVisitCode + "' & @.DCR_Product_Code=='" + saleProdCode + "')]");
                                        if (compJson) {
                                            for (var co = 0; co < compJson.length; co++) {
                                                if (co == 0) {
                                                    continue;
                                                }
                                                if (co == 1) {
                                                    fnResetCompAutofill($('#selectsaleprod_' + chemRow_g + '_' + rcpaRow)[0]);
                                                    var compCode = compJson[co].Competitor_Product_Code;
                                                    if ($.trim(compCode).length > 0) {
                                                        $('#selectcomp_' + chemRow_g + '_' + rcpaRow + '_' + co).val(compCode);
                                                        $('#selectcomp_' + chemRow_g + '_' + rcpaRow + '_' + co).selectmenu('refresh');
                                                    }
                                                    else {
                                                        $('#txtcomp_' + chemRow_g + '_' + rcpaRow + '_1').val(compJson[co].Competitor_Product_Name)
                                                        $('#selectcomp_' + chemRow_g + '_' + rcpaRow + '_' + co).val('0');
                                                        $('#selectcomp_' + chemRow_g + '_' + rcpaRow + '_' + co).selectmenu('refresh');
                                                    }
                                                    $('#txtcompqty_' + chemRow_g + '_' + rcpaRow + '_' + co).val(compJson[co].Suuport_Qty)
                                                    continue;
                                                }
                                                fnAddCompRow($('#addcomp_' + chemRow_g + '_' + rcpaRow + '_' + (parseInt(co) - 1).toString())[0]);
                                                var compCode = compJson[co].Competitor_Product_Code;
                                                if ($.trim(compCode).length > 0) {
                                                    $('#selectcomp_' + chemRow_g + '_' + rcpaRow + '_' + co).val(compCode);
                                                    $('#selectcomp_' + chemRow_g + '_' + rcpaRow + '_' + co).selectmenu('refresh');
                                                }
                                                else {
                                                    $('#txtcomp_' + chemRow_g + '_' + rcpaRow + '_' + co).val(compJson[co].Competitor_Product_Name)
                                                }
                                                $('#txtcompqty_' + chemRow_g + '_' + rcpaRow + '_' + co).val(compJson[co].Suuport_Qty)
                                            }
                                        }
                                    }
                                }
                            }

                        }
                        // END : RCPA Rows.
                    }
                }
            }
            // END: Chemist Rows
        }
        else {
            var docname = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + docname_g + "')]");
            if (docname) {
                $('#txtDocName').val(docname[0].label);
                $('#hdnDocCode').val(docname[0].value);
            }
            else {
                $('#txtDocName').val(docname_g);
            }

            if (dcrDoctorVisitTimeEntryModeValue_g == "SERVER_TIME") {
                fnSetServerTime();
            }
        }
        $.mobile.loading('hide');
    }
    catch (e) {
        fnMsgAlert('info', screenTitle, e.message);
        $.mobile.loading('hide');
    }
}

function fnSetFormControls() {
    if (doctorEntryMode_g.toUpperCase() == "YES") {
        // $('#dvDocSpeciality').css('display', 'none');
    }
    if (doctotVisitTime_g.toUpperCase() == "AM_PM") {
        $('#dvDocVisitTime').css('display', 'none');
        if (dcrDoctorVisitTimeEntryModeValue_g == "SERVER_TIME") {
            $('#dvVisitMode').css('display', 'none');
            $('#lblvisitmode').css('display', '');
        }
    }
    if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
        if (dcrDoctorVisitTimeEntryModeValue_g == "SERVER_TIME") {
            $('#dvVisitTime').css('display', 'none');
            $('#lblVisitTime').css('display', '');
        }
        fnSetMinutestoDropDown();
        $('#dvDocVisitMode').css('display', 'none');
    }
    if (doctorPOBAmount_g.toUpperCase() == "NO") {
        $('#dvDocPOB').css('display', 'none');
    }
    if (productBringType_g == "^") {
        $('#div-product').css('display', 'none');
    }

    // TO DO: Product Bring Type.
}

function fnGoToDoctorsSelection() {
    $.mobile.changePage("/HiDoctor_Activity/ChooseDoctorsSelection/Index?codes=&dcrActualDate=" + dcrDate_g + "&accUsers=" + accUsers_g + "&flagRCPA=" + RCPA_g + "&doctorname=''&speciality=''&travelKm=" + travelKm_g, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnValidation() {
    try {
        $.mobile.loading('show');
        var doc_name = "";
        var doc_code = "";
        var spec_name = "";
        var spec_code = "";
        var visit_mode = "";
        var visit_time = "";
        var doc_pob = "";
        var isCpDoc = "";
        var remarks = "";
        var source_of_entry = "MOBILE";
        var doc_category = "";
        var is_Acc_Doctor = "";
        var region_Code = "";
        doc_name = $('#txtDocName').val()

        // doctor required validation.
        if (doc_name.length == 0) {
            $.mobile.loading('hide');
            fnMsgAlert('info', screenTitle, "Please enter doctor name.");
            return false;
        }

        if ($('#hdnDVCode').val().length == 0) {
            if ($.inArray(doc_name, docArray) > -1) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, "This doctor already entered.");
                return false;
            }
        }

        // Valid doctor validation.
        if (doctorEntryMode_g.toUpperCase() == "YES") {
            if ($('#hdnDocCode').val().length == 0) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, "Please enter valid doctor name.");
                return false;
            }
            else {
                doc_code = $('#hdnDocCode').val();
                var doc_json = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + doc_name + "')]");
                if (doc_json && doc_json.length > 0) {
                    doc_category = doc_json[0].Category_Code;
                    is_Acc_Doctor = doc_json[0].Is_Acc_Doctor;
                    region_Code = doc_json[0].Doctor_Region_Code;
                }
            }
            // set doctor name and speciality name.
            spec_name = doc_name.split('_')[2];
            doc_name = doc_name.split('_')[0];
        }
        else {
            // flexi and choose doctors from auto fill.
            if ($('#hdnDocCode').val().length > 0) {
                doc_code = $('#hdnDocCode').val();
                spec_name = doc_name.split('_')[2];
                doc_name = doc_name.split('_')[0];
                //spec_name = doc_name.split('_')[2];
            }
            else {
                // flexi and manual enter doctor name.
                spec_name = doc_name.split('_')[1];
                doc_name = doc_name.split('_')[0];
                doc_code = $('#hdnDocCode').val();
                //spec_name = doc_name.split('_')[1];
            }
        }
        var specobj = jsonPath(specialityAutoFill_g, "$.[?(@.label=='" + spec_name + "')]");
        if (!specobj) {
            $.mobile.loading('hide');
            fnMsgAlert('info', screenTitle, "please enter valid speciality.");
            return false;
        }
        else {
            spec_code = specobj[0].value;
        }

        if (dcrDoctorVisitTimeEntryModeValue_g != "SERVER_TIME") {
            // Doctor Visit Time.
            if (doctotVisitTime_g.toUpperCase() == "AM_PM") {
                visit_mode = $('#togDocVisitMode').val();
            }
            else if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
                var hour = $('#drpHour option:selected').val();
                var min = $('#drpMin option:selected').val();
                var visit_mode = $('#drpTimeMode option:selected').val();
                if (hour == "HH") {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, "please choose the hour value in the visit time.");
                    return false;
                }
                else if (min == "MM") {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, "please choose the minutes value in the visit time.");
                    return false;
                }
                else {
                    visit_mode = visit_mode;
                    visit_time = hour + ":" + min + " " + visit_mode;
                }
            }
            else {
                var hour = $('#drpHour option:selected').val();
                var min = $('#drpMin option:selected').val();

                if (hour != "HH" && $.trim(hour).length > 0) {
                    if (min == "MM" || $.trim(min).length == 0) {
                        $.mobile.loading('hide');
                        fnMsgAlert('info', screenTitle, "please choose the minutes value in the visit time.");
                        return false;
                    }
                }

                if (min != "MM" && $.trim(min).length > 0) {
                    if (hour == "HH" || $.trim(hour).length == 0) {
                        $.mobile.loading('hide');
                        fnMsgAlert('info', screenTitle, "please choose the hours value in the visit time.");
                        return false;
                    }
                }

                var visit_mode = $('#drpTimeMode option:selected').val();
                if (hour != "HH" && min != "MM") {
                    visit_mode = visit_mode;
                    visit_time = hour + ":" + min + " " + visit_mode;
                }
            }
        }
        else {
            visit_mode = $('#lblvisitmode').html();
            visit_time = $('#lblVisitTime').html();
        }
        // Doctor POB.

        if (doctorPOBAmount_g == "YES") {
            if ($('#txtDocPOB').val().length > 0) {
                if (fnCurrencyFormat($('#txtDocPOB'), "POB")) {
                    doc_pob = $('#txtDocPOB').val();
                }
                else {
                    $.mobile.loading('hide');
                    return false;
                }
            }
            else {
                doc_pob = "0.00";
            }
        }
        if (!(fnCheckRemarksSpecialChar("#txtDocRemarks"))) {
            $.mobile.loading('hide');
            return false;
        }
        if ($.trim($('#txtDocRemarks').val()).length > 500) {
            //alert("You have entered more than 500 chars in Remarks. which is not allowed.");
            //$.msgbox('You have entered more than 500 chars in Remarks. which is not allowed.');
            $.mobile.loading('hide');
            fnMsgAlert('info', screenTitle, 'You have entered more than 500 chars in Remarks. which is not allowed.');
            return false;
        }

        // TO DO: Assign CP Doctor Value.
        var isCpDoc = "";
        remarks = $.trim($('#txtDocRemarks').val());
        var doc_string = escape(doc_name) + "^" + doc_code + "^" + spec_name + "^" + spec_code + "^" + visit_mode + "^" + visit_time + "^" + doc_pob + "^" + isCpDoc + "^" + escape(remarks) + "^" + source_of_entry + "^" + doc_category + "^" + is_Acc_Doctor + "^" + region_Code + "^";

        // Products.
        var prod_Arr = new Array();
        var prodString = "";
        var prod_code = "";
        var prod_name = "";
        var prod_spec_code = "";
        var prod_qty = "";
        var isDetailed = "";
        var product_count = 0;
        var prodIdContainer = new Array();
        for (var pr = 1; pr <= prodRow_g; pr++) {
            var prodIdElement = {};
            if ($('#divProduct_' + pr).length > 0) {
                prod_code = $('#prodhdn_' + pr).val();
                //prod_code = $("#selectprd_" + pr + " option:selected").val();
                //prod_name = $("#selectprd_" + pr + " option:selected").text();
                prod_name = $("#prodSpan_" + pr).html();
                prod_qty = $("#txtprdqty_" + pr).val().length == 0 ? "0" : $("#txtprdqty_" + pr).val();
                isDetailed = $('#toggIsDetailed_' + pr).val();
                prodIdElement.id = pr;
                prodIdElement.prod_code = prod_code;
                prodIdContainer.push(prodIdElement);
                if (prod_code == 0) {
                    continue;
                }
                else {
                    if ($.inArray(prod_code, prod_Arr) > -1) {
                        $.mobile.loading('hide');
                        var rowIdsobj = jsonPath(prodIdContainer, "$.[?(@.prod_code=='" + prod_code + "')]");

                        fnMsgAlert('info', screenTitle, 'The Sample/Promotional item "' + prod_name + '" already entered.');
                        for (var i = 0; i < rowIdsobj.length; i++) {
                            $('#divProduct_' + rowIdsobj[i].id).addClass("duplicateProductHighlight")
                        }
                        return false;
                    }
                    if (!intregex_g.test(prod_qty)) {
                        $.mobile.loading('hide');
                        fnMsgAlert('info', screenTitle, 'Invalid quantity for Sample/Promotional item' + prod_name + '.');
                        return false;
                    }
                    prod_Arr.push(prod_code);
                    prodString += escape(prod_name) + "^" + prod_code + "^" + prod_qty + "^" + isDetailed + "^" + doc_code + "^" + region_Code + "^";
                }
            }
        }

        if (inputs_mandatory_number_g > 0) {
            if (prod_Arr.length < inputs_mandatory_number_g) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, ' You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items.');
                return false;
            }
        }
        // Chemists
        var chem_name = "";
        var chem_code = "";
        var chem_pob = "0";
        var chemistString = "";
        var rcpaString = "";
        var chem_count = 0;
        var is_Acc_Chemist = '0'
        var che_Arr = new Array();
        var rcpastr = "";
        var chemistContainer = new Array();
        for (var ch = 1; ch <= chemRow_g; ch++) {
            var che = {};
            // Check that object are delete.
            if ($('#divChemist_' + ch).length > 0) {
                //chem_code = $("#selectche_" + ch + " option:selected").val();
                chem_code = $("#chemisthdn_" + ch).val();
                if (chem_code.length > 0 && chem_code != 0) {
                    chem_name = $("#chemistspan_" + ch).html();
                    var chem_json = jsonPath(chemistAutoFill_g, "$.[?(@.value=='" + chem_code + "')]");
                    if (chem_json && chem_json.length > 0) {
                        is_Acc_Chemist = chem_json[0].Is_Acc_Chemist;
                    }
                }
                else {
                    chem_name = $('#txtChemist_' + ch).val();
                    chem_code = "";
                }
                che.id = ch;
                che.chemname = chem_name;
                chemistContainer.push(che);
                if (chem_name.length > 0) {
                    // validation chemists name special chracters.
                    var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&]+$");
                    if (!specialCharregex.test(chem_name)) {
                        $.mobile.loading('hide');
                        //$.msgbox('Please remove the special characters for chemist.' + chem_name);
                        fnMsgAlert('info', screenTitle, 'Please  remove the special characters for chemist.' + chem_name);
                        return false
                    }
                    if ($.inArray(chem_name, che_Arr) > -1) {
                        $.mobile.loading('hide');
                        var cherowIdsobj = jsonPath(chemistContainer, "$.[?(@.chemname=='" + chem_name + "')]");
                        for (var j = 0; j < cherowIdsobj.length; j++) {
                            $('#divChemist_' + cherowIdsobj[j].id).addClass("duplicateChemistHighlight")
                        }
                        fnMsgAlert('info', screenTitle, ' The chemist "' + chem_name + '" entered more than once.');
                        return false;
                    }
                    else {
                        che_Arr.push(chem_name);
                    }
                    chem_pob = $('#txtchepob_' + ch).val().length == 0 ? "0" : $('#txtchepob_' + ch).val();
                    if (!/^\d{1,5}(\.\d{1,3})?$/.test(chem_pob)) {
                        $.mobile.loading('hide');
                        fnMsgAlert('info', screenTitle, ' The POB amount is invalid for the chemist' + chem_name + '.');
                        return false;
                    }

                    chemistString += escape(chem_name) + "^" + chem_code + "^" + chem_pob + "^" + visit_mode + "^" + is_Acc_Chemist + "^";

                    // START: RCPA Read.
                    if (RCPA_g == "R") {
                        var rcpaLen = $('#hdnRCPANo_' + ch).val();

                        if (rcpaLen > 0) {

                            var rcpaProductCode = "";
                            var rcpaProduct = "";
                            var rcpaComp = "";
                            var rcpaCompQty = "";
                            var rcpaCompCode = "";
                            var rcpaCodeArr = new Array();
                            for (var rc = 1; rc <= rcpaLen; rc++) {
                                if ($('#dvRCPA_' + ch + '_' + rc).length > 0) {
                                    rcpaProductCode = $('#selectsaleprod_' + ch + '_' + rc + " option:selected").val();
                                    rcpaProductCode = rcpaProductCode == "0" ? "" : rcpaProductCode;
                                    if (rcpaProductCode.length > 0) {

                                        if ($.inArray(rcpaProductCode, rcpaCodeArr) > -1) {
                                            $.mobile.loading('hide');
                                            fnMsgAlert('info', screenTitle, 'The Sale Product ' + rcpaProduct + ' entered more than once for chemist ' + chem_name + '.');
                                            return false;
                                        }
                                        else {
                                            rcpaCodeArr.push(rcpaProductCode);
                                        }

                                        rcpaProduct = $('#selectsaleprod_' + ch + '_' + rc + " option:selected").text();
                                        rcpaComp = rcpaProduct;
                                        var rcpaCompQty = $('#txtsaleprodQty_' + ch + '_' + rc).val();
                                        rcpaCompQty = $.trim(rcpaCompQty).length == 0 ? "0" : rcpaCompQty;
                                        if (!intregex_g.test(rcpaCompQty)) {
                                            $.mobile.loading('hide');
                                            fnMsgAlert('info', screenTitle, 'Invalid quantity for sale product ' + rcpaProduct + ' for chemist ' + chem_name + '.');
                                            return false;
                                        }
                                        rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaCompCode + "^";
                                        // STRAT: Comp Rows Read.
                                        var compLength = $('#hdncomp_' + ch + '_' + rc).val();
                                        var compArr = new Array()


                                        if (compLength > 0) {
                                            for (var co = 1; co <= compLength; co++) {
                                                if ($('#dvcomp_' + ch + '_' + rc + '_' + co).length > 0) {
                                                    rcpaCompCode = $('#selectcomp_' + ch + '_' + rc + '_' + co + " option:selected").val();
                                                    rcpaCompCode = rcpaCompCode == "0" ? "" : rcpaCompCode;
                                                    if (rcpaCompCode.length > 0) {
                                                        rcpaComp = $('#selectcomp_' + ch + '_' + rc + '_' + co + " option:selected").text();
                                                    }
                                                    else {
                                                        rcpaComp = $.trim($('#txtcomp_' + ch + '_' + rc + '_' + co).val());
                                                    }
                                                    if ($.trim(rcpaComp).length > 0) {
                                                        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&]+$");
                                                        if (!specialCharregex.test(rcpaComp)) {
                                                            //$.msgbox('Please remove the special characters for chemist.' + chem_name);
                                                            fnMsgAlert('info', screenTitle, 'Please remove the special characters for the competitor ' + rcpaComp);
                                                            return false
                                                        }
                                                        if ($.inArray(rcpaComp, compArr) > -1) {
                                                            $.mobile.loading('hide');
                                                            fnMsgAlert('info', screenTitle, ' The competitor ' + rcpaComp + ' entered more than once.');
                                                            return false;
                                                        }
                                                        else {
                                                            compArr.push(rcpaComp);
                                                        }
                                                        var rcpaCompQty = $.trim($('#txtcompqty_' + ch + '_' + rc + '_' + co).val());
                                                        rcpaCompQty = rcpaCompQty.length == 0 ? "0" : rcpaCompQty;
                                                        if (!intregex_g.test(rcpaCompQty)) {
                                                            $.mobile.loading('hide');
                                                            fnMsgAlert('info', screenTitle, 'Invalid quantity for competitor' + rcpaComp + '.');
                                                            return false;
                                                        }
                                                        rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaCompCode + "^";
                                                    }

                                                }
                                            }
                                        }
                                        // END : Comp Rows Read.
                                    }
                                    //rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaCompCode + "^";
                                    //rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^";
                                }
                            }
                        }
                    }
                }
            }
        }
        if (chemists_mandatory_number_g > 0) {
            if (che_Arr.length < chemists_mandatory_number_g) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, ' You need to enter minimum of ' + chemists_mandatory_number_g + ' chemists.');
                return false;
            }
        }
        //RCPA Category Check

        if (rcpastr.length == 0 && RCPA_g == "R") {
            var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
            if (rcpaMandatory.length > 0) {
                var rcapCategoryArray = rcpaMandatory.split(',');
                var doctorCategory = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + doc_code + "')]");
                if (doctorCategory && doctorCategory[0].Category != null) {
                    if ($.inArray(doctorCategory[0].Category, rcapCategoryArray) > -1) {
                        //$.msgbox("For " + rcpaMandatory + " doctors, you need to enter minimum of one RCPA entry.");
                        $.mobile.loading('hide');
                        fnMsgAlert('info', screenTitle, "For " + rcpaMandatory + " doctors, you need to enter minimum of one RCPA entry.")
                        return false;
                    }
                }
            }
        }
        fnInsertDoctorDetails(doc_string, prodString, chemistString, rcpastr);
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message)
        return false;
    }
}

function fnInsertDoctorDetails(docString, productString, chemistString, rcpaString) {
    var result = "";
    var dcrDate = dcrActualDate_g.split('-')[2] + "-" + dcrActualDate_g.split('-')[1] + "-" + dcrActualDate_g.split('-')[0];
    // $('#btnSave').attr('disabled', true)
    var dcrVisitCode = $('#hdnDVCode').val();
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRDoctorVisit/InsertDCRDoctorVisitData',
        data: "dcrVisitCode=" + dcrVisitCode + "&dcrActualDate=" + dcrDate_g + "&doctor=" + docString + "&products=" + productString + "&chemists=" + chemistString + "&rcpa=" + rcpaString + "&rcpaFlag=" + RCPA_g + "&prodBringType=" + productBringType_g + "&sourceOfEntry=MOBILE",
        success: function (response) {
            if (typeof response != "object" && response.indexOf('Error') > -1) {
                //alert(result.replace(/Error:/, ''));
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, response.replace(/Error:/, ''));
                //$.msgbox(response.replace(/Error:/, ''), { type: "error" });
            }
            else {

                $.mobile.changePage("/HiDoctor_Activity/MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=" + RCPA_g + "&source=TAB&flag=F&travelKm=" + travelKm_g, {
                    type: "post",
                    reverse: false,
                    changeHash: false
                });
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
            //$.msgbox('Sorry. Unable to save the Doctor/Customer visit data.', { type: "error" });
            fnMsgAlert('error', 'Error', 'Sorry. Unable to save the doctor visit data.');
            //alert("Page Error");
            //$('#btnSave').attr('disabled', false)
        }
    });
}

function fnCancel() {
    if (confirm("Do you wish to cancel the changes?")) {
        $('#drpHour').val("HH");
        $('#drpMin').val("MM");
        $('#drpTimeMode').val("AM");

        $('#drpHour').selectmenu('refresh');
        $('#drpMin').selectmenu('refresh');
        $('#drpTimeMode').selectmenu('refresh');

        $('#txtDocRemarks').val("");

        $('#productlist').html('');
        $('#chemistlist').html('');
        fnGetPrefillData();
    }
}

function fnGetProducts(obj) {
    $.mobile.loading('show');
    var searchWord = "";
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRDoctorVisit/GetHTMLFormattedProductslist',
        data: "searchWord=" + searchWord + "&prodBringType=" + productBringType_g,
        success: function (response) {
            if (response.indexOf('Error') > -1) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, response.replace(/Error:/, ''));
            }
            else {
                if (response.length > 0) {
                    $("#productmodal").append(response);
                    $("#productmodal").listview("refresh");
                }
                else {
                    $("#productmodal").append("<li>No Products Found.</li>");
                }
                $('#productmodal li').addClass('ui-screen-hidden');
                $('#productmodaldiv').simpledialog2();
                isProductsget_g = true;
                $.mobile.loading('hide');
                return false;
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Error', e.responseText);
        }
    });
}

function fnGetChemists() {
    /* if ($('#txChemSearch').val().length == 0) {
         fnMsgAlert('info', screenTitle, 'Please enter atleast three letters.');
         return false;
     }*/
    var searchWord = "";
    $.mobile.loading('show');
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRDoctorVisit/GetChemists',
        data: "searchWord=" + searchWord + "&showAccChemist=" + accChemistPri_g + "&accRegions=" + accUsers_g,
        success: function (response) {
            if (typeof response != "object" && response.indexOf('Error') > -1) {
                //alert(result.replace(/Error:/, ''));
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, response.replace(/Error:/, ''));
                //$.msgbox(response.replace(/Error:/, ''), { type: "error" });
            }
            else {
                if (response.length > 0) {
                    for (var cr = 0; cr < response.length; cr++) {
                        $("#chemistmodal").append('<li data-theme="c"><a href="#"  style="font-weight:normal; font-size:12px;" onclick="fnGetChemist(\'' + response[cr].value + '\',\'' + response[cr].label + '\',\'' + cr + '\')" id=chename_' + cr.toString() + ' data-transition="slide">' + response[cr].label + '</a></li>');
                    }
                    $("#chemistmodal").listview("refresh");
                }
                else {
                    $("#chemistmodal").append("<li>No Chemists Found.</li>");
                }

                $('#chemistmodal li').addClass('ui-screen-hidden');
                $('#chemistmodaldiv').simpledialog2();
                isChemistsget_g = true;

                //$('#productmodaldiv').simpledialog2();
                //var rowNo = obj.id.split('_')[1];
                //getProdRow_g = rowNo;
            }
            $.mobile.loading('hide');
            return false;
        },
        error: function (e) {
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Error', 'Get Chemists Failed.');
        }
    });
}

function fnSetMinutestoDropDown() {
    var minOptinsHTML = "";
    for (var min = 0; min < 60; min = parseInt(min) + parseInt(DCR_ENTRY_TIME_GAP_VALUE_g)) {
        var minString = min;
        minString = minString.toString().length == 1 ? "0" + minString : minString;
        minOptinsHTML = '<option value="' + minString + '">' + minString + '</option>';
        $('#drpMin').append(minOptinsHTML);
    }
    //$('#drpMin').selectmenu('refresh');
}

function fnSetServerTime() {

    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRDoctorVisit/GetServerTime',
        success: function (response) {
            // we have the response
            if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
                var mode = response.split(' ')[1];
                $('#lblVisitTime').html(response);
                $('#lblvisitmode').html(mode);
            }
            else {
                var mode = response.split(' ')[1];
                //var time = response.split(' ')[0];
                $('#lblvisitmode').html(mode);
                $('#lblVisitTime').html(response);
            }
        },
        error: function (e) {
        }
    });
}