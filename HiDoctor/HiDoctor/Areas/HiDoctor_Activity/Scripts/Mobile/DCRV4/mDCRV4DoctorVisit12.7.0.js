/*
doctorDetails_g[0].Data[0] = Doctor Data.
doctorDetails_g[1].Data = Products Data.
doctorDetails_g[3].Data = Chemist Data
doctorDetails_g[4].Data = RCPA Data
*/
var parval = 0;
var getProdRow_g = 0;
var getChemRow_g = 0;
var detProdRow_g = 0;
var prodRow_g = 0;
var chemRow_g = 0;
var chemistModified = false;
var inputsModified = false;
var detailProductModified = false;
var isProductsget_g = false;
var isDetProd_g = false;
var isChemistsget_g = false;
var doctorDetails_g = "";
var isChemistsget_g = false;
var compAutoFill_g = new Array();
var intregex_g = new RegExp("^[0-9]+$");
var screenTitle = "Doctor Visit";
var maxCode_g = "";
var productString_g = '<div id="divProduct_PDNUM" class="prdcount" data-icon="delete" style="border:1px solid #aaa;padding:3px" ><div data-role="fieldcontain"  data-mini="true"><a href="#" id="deleteProduct_PDNUM" class="delete-icon" style="float:right;margin-top:-10px;margin-right:5px;" onclick="fnDeleteProduct(this)"></a><span id="prodSpan_PDNUM" style="font-weight:bold;padding-left:5px;font-size:12px;"></span><input id="prodhdn_PDNUM" type="hidden" value="0" /></div>';
productString_g += '<div id="dvdetail_PDNUM" style="display:none"  data-role="fieldcontain" data-mini="true"><fieldset data-role="controlgroup" data-type="horizontal" ><div><label for="toggIsDetailed_PDNUM">Is Detailed</label></div><input name="detailed_PDNUM" data-mini="true" id="rdYes_PDNUM" name="isDetailed" value="1" type="radio" /><label for="rdYes_PDNUM">Yes</label>';
productString_g += '<input id="rdNo_PDNUM" name="detailed_PDNUM" name="isDetailed" data-mini="true" value="0" type="radio" /><label for="rdNo_PDNUM">No</label></fieldset></div>';
productString_g += '<div data-role="fieldcontain" data-mini="true"><fieldset class="fel" data-role="controlgroup" data-mini="true"><label for="txtprdqty_PDNUM">Qty</label><input name="Qty" maxlength="3" type="text" id="txtprdqty_PDNUM"  value="0" >';
productString_g += '</fieldset></div><div><div style="clear:both"></div>';

var chemistString_g = ' <div id="divChemist_CDNUM" style="border:1px solid #aaa;padding:3px" ><div data-role="fieldcontain"><a href="#" id="deleteChemist_CDNUM"  class="delete-icon"  onclick="fnDeleteChemist(this)"  style="float:right;width:35px;margin-top:-10px;margin-right:5px"></a><span id="chemistspan_CDNUM" style="font-weight:bold;padding-left:5px;font-size:12px;"></span><input id="chemisthdn_CDNUM" type="hidden" value="0" />';
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


var aRESULT = {};
aRESULT.Result_Code = 0;
aRESULT.Result_Text = "";
aRESULT.ResultPass = "PASS";
aRESULT.ResultFail = "FAIL";

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
    if (qtydefault == "") {
        $('#txtprdqty_' + prodRow_g).val('');
    }

    //if ($('#hdnsoe').val().toUpperCase() == "TABLET") {
    //    $('#dvdetail_' + prodRow_g).css('display', 'none');
    //}
    //else {
    //    $('#dvdetail_' + prodRow_g).css('display', '');
    //}
}

function fnAddDetailedProductsRow(detProdName, detPrdCode) {
    detProdRow_g = detProdRow_g + 1;
    var detProdsHTML = detailProductString_g.replace(/PDNUM/g, detProdRow_g);
    $('#detailedProductlist').append(detProdsHTML).trigger('create');
    if (detProdName != null) {
        $('#detProdSpan_' + detProdRow_g).html(detProdName);
        $('#detProdhdn_' + detProdRow_g).val(detPrdCode);
    }
    else {
        $('#detProdSpan_' + detProdRow_g).html('');
    }
}

function fnAddDetailedProducts() {
    try {
        $('#detProductmodaldiv').simpledialog2('close');
        $.mobile.loading('show');
        if ($('#selecteddetProdslist li').length > 0) {
            var detplength = $('#selecteddetProdslist li').length
            for (var dp = 0; dp < detplength; dp++) {
                fnAddDetailedProductsRow();
                $('#detProdSpan_' + detProdRow_g).html($('#selecteddetProdslist li a.getdetPrdlabel')[dp].innerHTML);
                $('#detProdhdn_' + detProdRow_g).val($('#selecteddetProdslist input')[dp].value.split('_')[0]);
            }
        }
        $('.detPrdselected').removeClass('detPrdselected');
        $('input[data-type="search"]').val('')
        $('#selecteddetProdslist').html("");

        $.mobile.loading('hide');
    }
    catch (e) {
        fnMsgAlert('info', screenTitle, e.message);
        $.mobile.loading('hide');
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
    $.mobile.loading('show');
    var dvCode = "";
    if (!chemistModified) {
        $('#divchemistscollapse').removeClass('plmicollapse');
        $('#divchemistscollapse').addClass('plmiexpand');
        chemistModified = true;
        if (codes_g.length > 0) {
            dvCode = codes_g.split('^')[0];
        }
        if (dvCode != null && dvCode.length > 0) {
            var rcpalstObj = GetDCRRCPADetailsForADoctor();
            fnGetRCPASaleProducts();
            fnGetDCRChemistVisitForADoctor(rcpalstObj);
            $.mobile.loading('hide');
        }
        else {
            fnGetRCPASaleProducts();
            $('#dvChemist').css('display', '');
            $.mobile.loading('hide');
        }
    }
    else {
        if ($('#divchemistscollapse').hasClass('plmiexpand')) {
            $('#divchemistscollapse').removeClass('plmiexpand');
            $('#divchemistscollapse').addClass('plmicollapse');
            $('#dvChemist').css('display', 'none');
            $.mobile.loading('hide');
        }
        else if ($('#divchemistscollapse').hasClass('plmicollapse')) {
            $('#divchemistscollapse').removeClass('plmicollapse');
            $('#divchemistscollapse').addClass(' plmiexpand');
            $('#dvChemist').css('display', '');
            $.mobile.loading('hide');
        }
    }
}

function showDetailedProductDialog(objdetProd) {
    //alert("We will build a new page for detailed products entry.");
    //var dvCode = "";
    //if (codes_g.length > 0) {
    //    dvCode = codes_g.split('^')[0];
    //}
    //if (dvCode.indexOf('ED') == -1) {
    //    if (dvCode.length > 0) {
    //        $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/DetailedProductsEntry?DCR_Visit_Code=" + dvCode + "&docName=" + $('#txtDocName').val(), {
    //            type: "post",
    //            reverse: false,
    //            changeHash: false
    //        });
    //    }
    //    else {
    //        alert("Please save the doctor for detailed products entry.");
    //    }
    //}
    //else {
    //    alert("Please save the doctor for detailed products entry.");
    //}
    $.mobile.loading('show');
    detailProductModified = true;
    var dvCode = "";
    dvCode = codes_g.split('^')[0];
    if ($('#divdetailedproductcollapse').hasClass('plmiexpand')) {
        $('#divdetailedproductcollapse').removeClass('plmiexpand');
        $('#divdetailedproductcollapse').addClass('plmicollapse');
        $('#dvDetailedProducts').css('display', 'none');
        $.mobile.loading('hide');
    }
    else if ($('#divdetailedproductcollapse').hasClass('plmicollapse')) {
        $('#divdetailedproductcollapse').removeClass('plmicollapse');
        $('#divdetailedproductcollapse').addClass(' plmiexpand');
        $('#dvDetailedProducts').css('display', '');
        debugger;
        $.mobile.loadPage('/HiDoctor_Activity/DCRV4DoctorVisit/DetailedProductsEntry?DCR_Visit_Code=' + dvCode + '&docName=' + $('#txtDocName').val()
                    , { 'pageContainer': $('#dvDetailedProducts') }).done(function (e) {
                        var dvObj = $("#dvDetailedProducts .ui-page");
                        $(dvObj).attr('data-role', 'content');
                        $(dvObj).attr('data-external-page', false);
                        $(dvObj).css('border', 'none');
                        $(dvObj).removeClass('ui-page');
                        $("#dvDetailedProducts .logo").hide();
                        $('#dvDetailedProducts .headercontent').hide();

                        // To remove ; in the page
                        //var strCont = $("#dvDetailedProducts div[role=main]").html();
                        //strCont = strCont.slice(0, strCont.lastIndexOf(";"));
                        //$("#dvDetailedProducts div[role=main]").html(strCont);
                        $.mobile.loading('hide');

                    }).fail(function (e) {
                        alert("Problem while loading Detailed Products");
                        $.mobile.loading('hide');
                    });
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

function fnAddChemistRow(cheName) {
    chemRow_g = chemRow_g + 1;
    var chemistHTML = chemistString_g.replace(/CDNUM/g, chemRow_g);
    $('#chemistlist').append(chemistHTML).trigger('create');
    if (RCPA_g == "N") {
        $('#dvAddSaleProduct_' + chemRow_g).css('display', 'none');
    }
}



function fnDeleteProduct(ctl) {
    $('#' + ctl.id.replace('delete', 'div')).remove();
    $('.duplicateProductHighlight').removeClass('duplicateProductHighlight');
    if ($('.prdcount').length == 0) {
        $('#dvBotAddInputs').css('display', 'none');
    }
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
        var docAccCode = codeArr[4];
        var docDetProdCode = codeArr[5];

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


function fnDeleteChemistPopUp(n) {
    $('#selectche_' + n).remove();
    $('#chename_' + n).removeClass('cheselected');
}

function fnGetDoctors() {
    $.ajax({
        type: 'POST',
        data: 'acc_Regions=' + accUsers_g + "&showAccDataValue=" + accChemistPri_g,
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDoctorsList',
        async: false,
        success: function (response) {
            // we have the response
            if (response != null && response.Data != null) {
                doctorAutoFill_g = response.Data;
                //fnGetDoctorVisitData();
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
            alert(e.responseText);
        }
    });
}

function fnGetSpeciality() {
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetSpecialityList',
        async: false,
        success: function (response) {
            // we have the response
            if (response != null && response.length > 0) {
                specialityAutoFill_g = response;
                //fnGetDoctorVisitData();
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
            alert(e.responseText);
        }
    });
}



function fnGetPrefillData() {
    var c = "";
    if (codes_g.length > 0) {
        c = codes_g.split('^');
    }
    // draft Doctors.
    if (c.length > 0) {
        var dvCode = c[0];
        var recordStatus = c[1];

        fnFillFormDetails(dvCode, recordStatus)
        //fnGetDoctorVisitData();
    }
    else {
        var regionCode = "";
        var docname = "";
        if (source_g != null && source_g.toUpperCase() == "DOCTORADD") {
            docname = jsonPath(doctors_g, "$.[?(@.label=='" + docname_g + "')]");

        } else {
            docname = jsonPath(doclist_g, "$.[?(@.label=='" + docname_g + "')]");
        }
        if (docname) {
            $('#txtDocName').val(docname[0].label);
            $('#hdnDocCode').val(docname[0].Doctor_Code);
            $('#hdnCateCode').val(docname[0].Category_Code);
            $('#hdnCate').val(docname[0].Category);
            regionCode = docname[0].Doctor_Region_Code;
        }
        else {
            $('#txtDocName').val(docname_g);
        }
        $('#hdnRecord_Status').val("1");
        $('#hdnDoc_EntryMode').val("M");
        fnSetServerTime();

        // TP Doctor and Sample
        if (doclist_g != null && doclist_g.length > 0) {
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

                    if (isDetailed == "1") {
                        $('#rdYes_' + prodRow_g).attr('checked', 'checked').checkboxradio('refresh');
                    }
                    else {
                        $('#rdNo_' + prodRow_g).attr('checked', 'checked').checkboxradio('refresh');
                    }
                    $('#txtprdqty_' + prodRow_g).val(pqty);
                }
            }
            if (RCPA_g == "R") {
                //fnAddRCPA(1);
            }
        }
        $.mobile.loading('hide');
    }
    fnSetAccompanistAutoFill()
}

function fnSetAccompanistAutoFill() {
    var accOpt = "";

    if (acc_g != null) {
        for (var ai = 0; ai < acc_g.length; ai++) {
            if (acc_g[ai].accName.length > 0) {
                accOpt += '<option value="' + acc_g[ai].accCode + '" >' + acc_g[ai].accName + '</option>';
            }
        }
        if (accOpt.length > 0) {
            accOpt = '<option value="0" >Select Accompanist</option>' + accOpt;
            $('#selectdocAcc_1').append(accOpt);
            $('#selectdocAcc_2').append(accOpt);
            $('#selectdocAcc_3').append(accOpt);
            $('#selectdocAcc_4').append(accOpt);
        }
        else {
            var emptyaccOpt = '<option value="-1" >No Accompanist</option>'
            $('#selectdocAcc_1').append(emptyaccOpt);
            $('#selectdocAcc_2').append(emptyaccOpt);
            $('#selectdocAcc_3').append(emptyaccOpt);
            $('#selectdocAcc_4').append(emptyaccOpt);
        }
    }
}

function fnFillFormDetails(dvCode, rs) {
    //fnSetAccompanistAutoFill();
    try {
        if (doclist_g.length > 0 && doclist_g[0].Data != null) {
            doctorData = jsonPath(doclist_g[0].Data, "$.[?(@.Doctor_Visit_Code=='" + dvCode + "')]");
            if (doctorData) {
                doctorData = doctorData[0];
            }
            var visitMode = "AM";
            var visitTime = "";
            var mode_of_entry = doctorData.Mode_Of_Entry;
            var reocrd_status = doctorData.Record_Status == null ? "1" : doctorData.Record_Status.length == 0 ? "1" : doctorData.Record_Status;
            var sourceofentry = doctorData.Source_of_Entry;
            var lat = doctorData.Lattitude;
            var long = doctorData.Longtitude;
            var loca = doctorData.Location;
            var edt = doctorData.Entered_Date_Time;
            var dvcode = doctorData.Doctor_Visit_Code;
            var customerStatus;
            var doctor_Code;
            var category;
            if (source_g != null && source_g.toUpperCase() == "DOCTORADD") {
                docname = jsonPath(doctors_g, "$.[?(@.label=='" + docname_g + "')]");
                if (docname != null && docname) {
                    customerStatus = docname[0].Customer_Status;
                    doctor_Code = docname[0].Doctor_Code;
                    category = docname[0].Category;
                }
            }
            else {
                customerStatus = doctorData.Customer_Status;
                doctor_Code = doctorData.Doctor_Code;
                category = doctorData.Category;
            }
            $('#hdnDocCode').val(doctor_Code);
            $('#hdnRecord_Status').val(reocrd_status);
            $('#hdnDVCode').val(dvcode);
            $('#hdnsoe').val(sourceofentry);
            $('#hdnlat').val(lat);
            $('#hdnlon').val(long);
            $('#hdnloc').val(loca);
            $('#hdnedt').val(edt);
            $('#hdnCate').val(category);
            $('#hdnDoc_EntryMode').val(mode_of_entry);
            if (customerStatus != null && customerStatus != "1" && customerStatus != "") {
                $('#txtDocName').addClass('customerStatus');
            }
            else {
                $('#txtDocName').removeClass('customerStatus');
            }
            $('#hdnDVCode').val(doctorData.Doctor_Visit_Code);
            doctorData.Visit_Mode = doctorData.Visit_Mode == null ? "AM" : $.trim(doctorData.Visit_Mode).length == 0 ? "AM" : doctorData.Visit_Mode;
            if (dcrDoctorVisitTimeEntryModeValue_g != "SERVER_TIME") {
                if (doctorData.Doctor_Visit_Time != null && doctorData.Doctor_Visit_Time.length > 0 && doctorData.Doctor_Visit_Time.indexOf(' ') > -1) {
                    visitMode = doctorData.Doctor_Visit_Time.split(' ')[1];
                    visitTime = doctorData.Doctor_Visit_Time.split(' ')[0];
                }
                else {
                    visitMode = doctorData.Visit_Mode;
                    visitTime = doctorData.Doctor_Visit_Time != null ? doctorData.Doctor_Visit_Time.length > 0 ? doctorData.Doctor_Visit_Time.split(' ')[0] : "" : "";
                }
                if (doctotVisitTime_g.toUpperCase() == "AM_PM") {
                    $('#spnVisitMode').html(doctorData.Visit_Mode)
                    $('#dvvisitime').css('display', 'none');
                    if ($('#spnVisitMode').html().length > 0) {
                        $('#lnkShowTimeVM').html("Edit");
                    }
                }
                else {
                    $('#dvvisitmode').css('display', 'none');
                    var hour = "";
                    var min = "";
                    var mode = "AM";
                    var visitMode = doctorData.Visit_Mode;
                    if (visitTime != null && visitTime.length > 0) {
                        var timeArr = visitTime.split(':');

                        hour = timeArr[0];
                        min = timeArr[1];
                        $('#spnVisitTime').html(visitTime + ' ' + visitMode);
                    }
                    if (visitMode != null) {
                        mode = visitMode;
                    }
                    if ($('#spnVisitTime').html().length > 0) {
                        $('#lnkShowTimeVT').html("Edit");
                    }

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

                        $('#lblVisitTime').html(doctorData.Doctor_Visit_Time + ' ' + doctorData.Visit_Mode);
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
            $('#txtDocRemarks').val(unescape(doctorData.Remarks));
            // START:Accompanist
            $('#drpTimeMode').selectmenu('refresh');

            if (mode_of_entry == "A") {
                $('#lnkDoctorSelection').css('display', 'none');
                $('#lnkShowTimeVT').css('display', 'none');
                $('#lnkShowTimeVM').css('display', 'none');
            }
            else {
                $('#lnkDoctorSelection').css('display', '');
                $('#lnkShowTimeVT').css('display', '');
                $('#lnkShowTimeVM').css('display', '');
            }
        }
        else {
            $('#txtDocName').val(docname_g);
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
        $('#dvvisitime').css('display', 'none');
        $('#dvvisitmode').css('display', '');
        if (dcrDoctorVisitTimeEntryModeValue_g == "SERVER_TIME") {
            $('#dvvisitmode').css('display', 'none');
            $('#lblvisitmode').css('display', '');
        }
    }
    else {
        $('#dvvisitime').css('display', '');

    }
    if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
        if (dcrDoctorVisitTimeEntryModeValue_g == "SERVER_TIME") {
            $('#dvvisitime').css('display', 'none');
            $('#lblVisitTime').css('display', '');
        }
        fnSetMinutestoDropDown();
        $('#dvvisitmode').css('display', 'none');
    }
    if (doctorPOBAmount_g.toUpperCase() == "NO") {
        $('#dvDocPOB').css('display', 'none');
    }
    if (productBringType_g == "^") {
        $('#div-product').css('display', 'none');
    }
}

function fnGoToDoctorsSelection() {
    $.mobile.changePage("/HiDoctor_Activity/DCRV4ChooseDoctorsSelection/Index?codes=&dcrActualDate=" + dcrDate_g + "&accUsers=" + accUsers_g + "&flagRCPA=" + RCPA_g + "&doctorname=''&speciality=''&travelKm=" + travelKm_g, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnValidation(redirectPoint) {
    debugger;
    try {
        $('#btnSaveAccEntry').attr('disabled', 'disable');
        $('#btnSave').attr('disabled', 'disable');
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
        var region_name = "";

        var soe = "MOBILE";
        var lat = null;
        var long = null;
        var loc = null;
        var edt = null;
        var doctor = {};
        var doctorArray = new Array();

        doc_name = $('#txtDocName').val();

       
        // doctor required validation.
        if (doc_name.length == 0) {
            $.mobile.loading('hide');
            fnMsgAlert('info', screenTitle, "Please enter " + doctor_header + " name.");
            $.mobile.loading('hide');
            $('#btnSaveAccEntry').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            return false;
        }

        if ($('#hdnDVCode').val().length == 0) {
            if ($.inArray(doc_name, docArray) > -1) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, "This " + doctor_header + " already entered.");
                $('#btnSaveAccEntry').attr('disabled', false);
                $('#btnSave').attr('disabled', false);
                return false;
            }
        }

        // Valid doctor validation.
        if (doctorEntryMode_g.toUpperCase() == "YES") {
            if ($('#hdnDocCode').val().length == 0) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, "Please enter valid " + doctor_header + " name.");
                $('#btnSaveAccEntry').attr('disabled', false);
                $('#btnSave').attr('disabled', false);
                return false;
            }
            else {
                if (source_g != null && source_g.toUpperCase() == "DOCTORADD") {
                    docname = jsonPath(doctors_g, "$.[?(@.label=='" + docname_g + "')]");

                } else {
                    docname = jsonPath(doclist_g, "$.[?(@.label=='" + docname_g + "' & @.Customer_Status!=0)]");
                }
                if (docname) {
                    doc_code = docname[0].Doctor_Code;
                    $('#hdnDocCode').val(doc_code);
                    spec_name = doc_name.split('_')[2];
                    var tempRegName = doc_name.split('_')[3]
                    region_name = tempRegName.split('*')[0];
                    if (region_name.indexOf("|") > 0) {
                        var region_nameArr = region_name.split('|');
                        region_name = $.trim(region_nameArr[0]);
                    }
                    doc_name = doc_name.split('_')[0];
                }
                else {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, "Please enter valid " + doctor_header + " name.");
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
            }
        }
        else {
            // flexi and choose doctors from auto fill.
            if (source_g != null && source_g.toUpperCase() == "DOCTORADD") {
                docname = jsonPath(doctors_g, "$.[?(@.label=='" + docname_g + "')]");

            } else {
                docname = jsonPath(doclist_g, "$.[?(@.label=='" + docname_g + "')]");
            }
            if (docname) {
                if (docname[0].Customer_Status != "0") {
                    doc_code = docname[0].Doctor_Code;
                    $('#hdnDocCode').val(doc_code);
                }
                else {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, "Please enter valid " + doctor_header + " name.");
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
            }
            if ($('#hdnDocCode').val().length > 0) {
                doc_code = $('#hdnDocCode').val();
                spec_name = doc_name.split('_')[2];
                var tempRegName = doc_name.split('_')[3]
                region_name = tempRegName.split('*')[0];
                if (region_name.indexOf("|") > 0) {
                    var region_nameArr = region_name.split('|');
                    region_name = $.trim(region_nameArr[0]);
                }
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

        if (dcrDoctorVisitTimeEntryModeValue_g != "SERVER_TIME") {
            // Doctor Visit Time.
            if (doctotVisitTime_g.toUpperCase() == "AM_PM") {
                visit_mode = $('#spnVisitMode').html();//$('#togDocVisitMode').val();
            }
            else if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {

                if ($.trim($('#spnVisitTime').html()).length == 0) {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, "please choose the visit time value.");
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
                else {
                    visit_time = $.trim($('#spnVisitTime').html().split(' ')[0]);
                    visit_mode = $.trim($('#spnVisitTime').html().split(' ')[1]);
                }
            }
            else {

                if ($.trim($('#spnVisitTime').html()).length > 0) {
                    visit_time = $.trim($('#spnVisitTime').html().split(' ')[0]);
                    visit_mode = $.trim($('#spnVisitTime').html().split(' ')[1]);
                }
            }
        }
        else {
            if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME") {
                visit_time = $('#lblVisitTime').html().split(' ')[0];
                visit_mode = $('#lblVisitTime').html().split(' ')[1];
            }
            else {
                visit_mode = $('#lblvisitmode').html();
            }
        }
        // Doctor POB.

        if (doctorPOBAmount_g == "YES") {
            if ($('#txtDocPOB').val().length > 0) {
                if (fnCurrencyFormat($('#txtDocPOB'), "POB")) {
                    doc_pob = $('#txtDocPOB').val();
                }
                else {
                    $.mobile.loading('hide');
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
            }
            else {
                doc_pob = "0.00";
            }
        }
        if (!(DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2($("#txtDocRemarks")))) {
            fnMsgAlert("DCR", "", "Please remove the special characters in Remarks. The following characters are only allowed _-.,.");
            $.mobile.loading('hide');
            $('#btnSaveAccEntry').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            return false;
        }
        //if (!(fnCheckRemarksSpecialChar("#txtDocRemarks"))) {
        //    $.mobile.loading('hide');
        //    $('#btnSaveAccEntry').attr('disabled', false);
        //    $('#btnSave').attr('disabled', false);
        //    return false;
        //}
        if ($.trim($('#txtDocRemarks').val()).length > 500) {
            //alert("You have entered more than 500 chars in Remarks. which is not allowed.");
            //$.msgbox('You have entered more than 500 chars in Remarks. which is not allowed.');
            $.mobile.loading('hide');
            fnMsgAlert('info', screenTitle, 'You have entered more than 500 chars in Remarks. which is not allowed.');
            $('#btnSaveAccEntry').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            return false;
        }

        // TO DO: Assign CP Doctor Value.
        var isCpDoc = "";
        remarks = $.trim($('#txtDocRemarks').val());
        //var doc_string = escape(doc_name) + "^" + doc_code + "^" + spec_name + "^" + spec_code + "^" + visit_mode + "^" + visit_time + "^" + doc_pob + "^" + isCpDoc + "^" + escape(remarks) + "^" + source_of_entry + "^" + doc_category + "^" + is_Acc_Doctor + "^" + region_Code + "^";

        var dcr_visit_code = $('#hdnDVCode').val();

        lat = null;
        long = null;
        loc = null;
        soe = "";
        edt = null;
        if ($('#hdnsoe').val().toUpperCase() == "TABLET" || $('#hdnsoe').val().toUpperCase() == "OFFLINE") {
            soe = $('#hdnsoe').val().toUpperCase();
            lat = $('#hdnlat').val();
            long = $('#hdnlon').val();
            loc = $('#hdnloc').val();
            edt = $('#hdnedt').val();
        }
        else {
            soe = "MOBILE";
        }
        doc_category = $('#hdnCate').val();
        doctor.Doctor_Visit_Code = dcr_visit_code;
        doctor.Doctor_Name = doc_name;
        doctor.label = $.trim($('#txtDocName').val());
        doctor.Doctor_Code = $.trim(doc_code) == "" ? null : doc_code;
        doctor.Speciality_Name = $.trim(spec_name) == "" ? null : spec_name;
        doctor.Speciality_Code = spec_code;
        doctor.Visit_Mode = $.trim(visit_mode) == "" ? "AM" : visit_mode;
        doctor.Doctor_Visit_Time = $.trim(visit_time) == "" ? null : visit_time;
        doctor.POB_Amount = $.trim(doc_pob) == "" ? null : doc_pob;
        doctor.Is_CPDoc = isCpDoc;
        doctor.Remarks = $.trim(escape(remarks)) == "" ? null : escape(remarks);
        doctor.Category = $.trim(doc_category) == "" ? null : doc_category;
        doctor.Is_Acc_Doctor = $.trim(is_Acc_Doctor) == "" ? null : is_Acc_Doctor;
        doctor.Doctor_Region_Code = $.trim(region_name) == "" ? null : region_name;
        doctor.Mode_Of_Entry = $('#hdnDoc_EntryMode').val();
        doctor.Record_Status = $('#hdnRecord_Status').val();
        doctor.Source_of_Entry = soe;
        doctor.Location = loc;
        doctor.Lattitude = lat;
        doctor.Longtitude = long;
        doctor.Entered_Date_Time = edt;
        doctorArray.push(doctor);


        // START: Accompanist.

        var acc_string = "";
        var acc_user_Name = "";
        var acc_user_Code = "";
        var acc_region_Code = "";
        var only_for_doc = "";
        var mode_of_entry = "";
        var acc_user_type = "";
        var accArray = new Array();
        var docAccArray = new Array();



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
        var prodArray = new Array();

        if (inputsModified) {
            for (var pr = 1; pr <= prodRow_g; pr++) {
                prod_spec_code = "";
                prod_name = "";
                prod_code = "";
                prod_qty = "";
                var prod = {};

                var prodIdElement = {};
                if ($('#divProduct_' + pr).length > 0) {
                    prod_code = $('#prodhdn_' + pr).val();
                    //prod_code = $("#selectprd_" + pr + " option:selected").val();
                    //prod_name = $("#selectprd_" + pr + " option:selected").text();
                    prod_name = $("#prodSpan_" + pr).html();
                    prod_qty = $("#txtprdqty_" + pr).val().length == 0 ? "0" : $("#txtprdqty_" + pr).val();
                    if ($('#rdYes_' + pr).attr('checked') == 'checked') {
                        isDetailed = "1";
                    }
                    else {
                        isDetailed = '0';
                    }
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
                            $('#btnSaveAccEntry').attr('disabled', false);
                            $('#btnSave').attr('disabled', false);
                            return false;
                        }
                        if (!intregex_g.test(prod_qty)) {
                            $.mobile.loading('hide');
                            fnMsgAlert('info', screenTitle, 'Invalid quantity for Sample/Promotional item' + prod_name + '.');
                            $('#btnSaveAccEntry').attr('disabled', false);
                            $('#btnSave').attr('disabled', false);
                            return false;
                        }
                        prod_Arr.push(prod_code);
                        prodString += escape(prod_name) + "^" + prod_code + "^" + prod_qty + "^" + isDetailed + "^" + doc_code + "^" + region_Code + "^";

                        prod.DCR_Visit_Code = dcr_visit_code;
                        prod.Doctor_Code = $.trim(doc_code) == "" ? null : doc_code;
                        prod.Quantity_Provided = prod_qty;
                        prod.Product_Name = escape(prod_name);
                        prod.Product_Code = prod_code;
                        prod.Speciality_Code = prod_spec_code;
                        prod.Is_Detailed = isDetailed == null ? "0" : isDetailed == "" ? "0" : isDetailed;
                        prod.Doctor_Region_Code = $.trim(region_Code) == "" ? null : region_Code;

                        prodArray.push(prod);
                    }
                }
            }

            if (inputs_mandatory_number_g > 0) {
                if (prod_Arr.length < inputs_mandatory_number_g) {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, ' You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items.');
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
            }
        }
        else {
            if (inputs_mandatory_number_g > 0) {
                if (maxCode_g.InputsCount < inputs_mandatory_number_g) {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, ' You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items.');
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
            }
        }


        // START: Detailed Products..
        // Detailed Products.
        var detail_string = "";
        var det_prd_Name = "";
        var det_prd_Code = "";
        var det_mode_of_entry = "";
        var detprdArray = new Array();
        var detProdJsonArray = new Array();
        if (detailProductModified) {
            for (var detprindex = 0; detprindex <= detProdRow_g; detprindex++) {
                var detprdobj = {};
                var detprd = "";
                if (detprindex == 0) {
                    continue;
                }
                // check the row is exist. if not continue the next row.
                if ($('#detProdSpan_' + detprindex).css('display') == 'none') {
                    continue;
                }

                if ($.trim($('#detProdSpan_' + detprindex).html()).length > 0) {
                    det_prd_Name = $('#detProdSpan_' + detprindex).html();
                    det_prd_code = $('#detProdhdn_' + detprindex).val();


                    if ($.trim(det_prd_code).length == 0) {
                        fnMsgAlert('info', screenTitle, 'Invalid Product Name in Detailed box.');
                        $('#btnSaveAccEntry').attr('disabled', false);
                        $('#btnSave').attr('disabled', false);
                        return false;
                    }
                    if ($.inArray(det_prd_Name, detprdArray) > -1) {
                        fnMsgAlert('info', screenTitle, 'Detailed Product Name is duplicate.');
                        $('#btnSaveAccEntry').attr('disabled', false);
                        $('#btnSave').attr('disabled', false);
                        return false;
                    }
                    detprdArray.push(det_prd_Name);

                    detprd = $.trim(det_prd_Name) + "^" + det_prd_code + "^";
                    detprdobj.Sale_Product_Code = det_prd_code;
                    detprdobj.Sale_Product_Name = det_prd_Name;
                    detprdobj.Mode_Of_Entry = $('#hdnDetEntryMode_' + detprindex).val();

                    detProdJsonArray.push(detprdobj);
                }
                //detail_string += detprd;
            }
            var detailProdMandatory = fnGetPrivilegeValue('DCR_DETAILING_MANDATORY_NUMBER', '0');

            if (detProdJsonArray.length < parseInt(detailProdMandatory)) {
                $.mobile.hidePageLoadingMsg('loading');
                fnMsgAlert('info', screenTitle, 'You should enter at least ' + detailProdMandatory + ' detailing products for this doctor visit..');
                $('#btnSaveAccEntry').attr('disabled', false);
                $('#btnSave').attr('disabled', false);
                return false;
            }
        }
        else {
            var detailProdMandatory = fnGetPrivilegeValue('DCR_DETAILING_MANDATORY_NUMBER', '0');
            if (detailProdMandatory > 0) {
                if (maxCode_g.DetailedMaxCount < detailProdMandatory) {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, 'You should enter at least ' + detailProdMandatory + ' detailing products for this doctor visit..');
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
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
        var chemJsonArray = new Array();
        var rcpaJSONArray = new Array();

        if (chemistModified) {
            fnSaveChemAndRCPA(doctorArray, prodArray, detProdJsonArray, redirectPoint);
        }
        else {
            var chemJsonArray = new Array();
            var rcpaJSONArray = new Array();
            if (chemists_mandatory_number_g > 0) {
                if (maxCode_g.ChemistCount < chemists_mandatory_number_g) {
                    $.mobile.hidePageLoadingMsg('loading');
                    fnMsgAlert('info', screenTitle, ' You need to enter minimum of ' + chemists_mandatory_number_g + ' ' + chemist_header + '.');
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
            }

            if (maxCode_g.RCPACount == 0 && RCPA_g == "R") {
                var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
                if (rcpaMandatory.length > 0) {
                    var rcapCategoryArray = rcpaMandatory.split(',');
                    if ($('#hdnCate').val() != null && $('#hdnCate').val().length > 0) {
                        if ($.inArray($('#hdnCate').val(), rcapCategoryArray) > -1) {
                            $.mobile.hidePageLoadingMsg('loading');
                            fnMsgAlert('info', screenTitle, "For " + rcpaMandatory + " " + doctor_header + ", you need to enter minimum of one RCPA entry.")
                            $('#btnSaveAccEntry').attr('disabled', false);
                            $('#btnSave').attr('disabled', false);
                            return false;
                        }
                    }
                }
            }

            fnInsertDoctorDetails(doctorArray, prodArray, chemJsonArray, rcpaJSONArray, detProdJsonArray, redirectPoint);
        }
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('info', screenTitle, e.message)
        $('#btnSaveAccEntry').attr('disabled', false);
        $('#btnSave').attr('disabled', false);
        return false;
    }
}

function fnInsertDoctorDetails(doctorArray, prodArray, chemJSONArray, RCPAJSONArray, detProdJsonArray, redirectPoint) {
    var result = "";
    var dcrDate = dcrActualDate_g.split('-')[2] + "-" + dcrActualDate_g.split('-')[1] + "-" + dcrActualDate_g.split('-')[0];
    // $('#btnSave').attr('disabled', true)

    var dcrVisitCode = $('#hdnDVCode').val();

    if (DCR_CATEGORY_VISIT_COUNT_RESTRICTION_g == "YES" && doctorArray[0].Doctor_Code != null && $.trim(doctorArray[0].Doctor_Code).length > 0 && doctorArray[0].Category != null && $.trim(doctorArray[0].Category).length > 0) {
        $.ajax({
            type: 'POST',
            url: '/HiDoctor_Activity/DCRV4DoctorVisit/ValidateCategoryVisitCountRestriction',
            data: "Doctor_Code=" + doctorArray[0].Doctor_Code + "&Category_Code=" + doctorArray[0].Category + "&DCR_Actual_Date=" + dcrActualDate_g,
            success: function (response) {
                debugger;
                if (response != null && response.Result == aRESULT.ResultPass) {
                    fnInsertDoctorFinal(doctorArray, prodArray, chemJSONArray, RCPAJSONArray, detProdJsonArray, redirectPoint)
                }
                else {
                    $.mobile.loading('hide');
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    //$('#buttondiv').css('display', '');
                    var Result_txt = response.Result_Text;
                    Result_txt = 'This ' + DoctorHeader_g + ' exceeds the visit count limit for the month.';
                    alert(Result_txt);
                    return false;
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                $('#btnSaveAccEntry').attr('disabled', false);
                $('#btnSave').attr('disabled', false);
                fnMsgAlert("Error", "DCR Doctor Visit", e.responseText);
                return false;
            }
        });
    }
    else {
        fnInsertDoctorFinal(doctorArray, prodArray, chemJSONArray, RCPAJSONArray, detProdJsonArray, redirectPoint);
    }


}


function fnInsertDoctorFinal(doctorArray, prodArray, chemJSONArray, RCPAJSONArray, detProdJsonArray, redirectPoint) {
    var result = "";
    var dcrDate = dcrActualDate_g.split('-')[2] + "-" + dcrActualDate_g.split('-')[1] + "-" + dcrActualDate_g.split('-')[0];
    // $('#btnSave').attr('disabled', true)
    var dcrVisitCode = $('#hdnDVCode').val();

    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/InsetDoctorVisitDataForMobile',
        data: "Doctor_Visit_Code=" + dcrVisitCode + "&DCR_Actual_Date=" + dcrDate_g + "&docJSON=" + JSON.stringify(doctorArray) + "&inputsJSON=" + JSON.stringify(prodArray) + "&chemJSON=" + JSON.stringify(chemJSONArray) + "&RCPAJSON=" + JSON.stringify(RCPAJSONArray) +
        "&DoctorVisitMaxCode=" + $('#hdnDocMaxCode').val() + "&inputsMaxCode=" + $('#hdnInputsMaxCode').val() + "&chemistMaxcode=" + $('#hdnChemMaxCode').val()
            + "&RCAPMaxCode=" + $('#hdnRCPAMaxCode').val() + "&chemistModified=" + chemistModified + "&inputsModified=" + inputsModified + "&detailProductModified=" + detailProductModified + "&detProdJson=" + JSON.stringify(detProdJsonArray),
        success: function (response) {
            $('#btnSaveAccEntry').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            doctorArray[0].Doctor_Visit_Code = response;
            if (typeof response != "object" && response.indexOf('Error') > -1) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, response.replace(/Error:/, ''));
            }
            else {
                if (response.indexOf('DVC') > -1) {
                    fnUpadteDoctorList(response, doctorArray[0]);
                    //doclist_g[0].Data.push(doctorArray[0]);
                    if (redirectPoint == null || redirectPoint == "") {
                        $.mobile.changePage("/HiDoctor_Activity/DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=" + RCPA_g + "&source=TAB&flag=F&travelKm=" + travelKm_g, {
                            type: "post",
                            reverse: false,
                            changeHash: false
                        });
                    }
                    else if (redirectPoint == "A") {
                        codes_g = response + '^3';
                        alert(doctor_header+" details has been saved. Please proceed next steps.");
                    }
                    $.mobile.loading('hide');
                }
                else {
                    $.mobile.loading('hide');
                    alert(response);
                    return false;
                }
                $.mobile.loading('hide');
            }

        },
        error: function (e) {
            $('#btnSaveAccEntry').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Error', e.responseText);
        }
    });
}

function fnCancel() {
    if (confirm("Do you wish to cancel the page?")) {
        $.mobile.changePage("/HiDoctor_Activity/DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=" + RCPA_g + "&source=TAB&flag=F&travelKm=" + travelKm_g, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
}

function fnGetProducts(obj) {
    var searchWord = "";

    $.mobile.loading('show');
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetHTMLFormattedProductslist',
        data: "searchWord=" + searchWord + "&prodBringType=" + productBringType_g + "&DCR_Date=" + dcrDate_g,
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
            fnMsgAlert('error', 'Error', 'Get Products Failed.');
        }
    });
}
var cg;
function fnGetChemists() {

    var searchWord = "";
    $.mobile.loading('show');
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetChemistsHTMLFormatted',
        data: "searchWord=" + searchWord + "&showAccChemist=" + accChemistPri_g + "&accRegions=" + accUsers_g,
        success: function (response) {
            if (typeof response != "object" && response.indexOf('Error') > -1) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, response.replace(/Error:/, ''));
            }
            else {
                if (response.length > 0) {
                    cg = response;
                    $("#chemistmodal").append(response);
                    $("#chemistmodal").listview("refresh");
                }
                else {
                    $("#chemistmodal").append("<li>No " + chemist_header + " Found.</li>");
                }

                $('#chemistmodal li').addClass('ui-screen-hidden');
                $('#chemistmodaldiv').simpledialog2();
                isChemistsget_g = true;
            }
            $.mobile.loading('hide');
            return false;
        },
        error: function (e) {
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Error', 'Get ' + chemist_header + ' Failed.');
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
}

function fnSetServerTime() {

    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetServerTime',
        success: function (response) {
            // we have the response
            if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
                var mode = response.split(' ')[1];
                $('#lblVisitTime').html(response);
                $('#lblvisitmode').html(mode);
            }
            else {
                var mode = response.split(' ')[1];
                $('#lblvisitmode').html(mode);
                $('#lblVisitTime').html(response);
            }
        },
        error: function (e) {
        }
    });
}

function fnGetMaxCodes() {
    maxCode_g = "";
    var dvCode = "";
    if (codes_g.length > 0) {
        dvCode = codes_g.split('^')[0];
    }
    $.ajax({
        type: 'POST',
        data: "DCR_Actual_Date=" + dcrActualDate_g + "&DCR_Visit_Code=" + dvCode,
        url: '../DCRV4DoctorVisit/GetDCRDoctorVisitMaxCodesAndDetailsCountForMobile',
        async: false,
        success: function (response) {

            // we have the response
            maxCode_g = response;
            setMaxCodes(maxCode_g);
        },
        error: function (e) {
            // alert(e.responseText);
        }
    });
}

function setMaxCodes(maxCodeJson) {
    $('#hdnDocMaxCode').val(maxCodeJson.Doctor_Vist_Max_Code);
    $('#hdnDocAccMaxCode').val(maxCodeJson.Doc_Acc_Max_Code);
    $('#hdnInputsMaxCode').val(maxCodeJson.Inputs_Max_Code);
    $('#hdnDetailedMaxCode').val(maxCodeJson.Detailed_Max_Code);
    $('#hdnChemMaxCode').val(maxCodeJson.Chemist_Max_Code);
    $('#hdnRCPAMaxCode').val(maxCodeJson.RCPA_Max_Code);

}

function fnSetAccValues(index) {
    try {
        var accCode = $('#selectdocAcc_' + index + ' :selected').val();
        var accText = $('#selectdocAcc_' + index + ' :selected').text();
        if (accCode != null && accText != null && accText.length > 0) {

            if (doclist_g != null && doclist_g.length > 4) {

                $('#toggonlyfordoc_' + index).attr('disabled', false);
                var accdata = jsonPath(doclist_g[4], "$.[?(@.Doctor_Visit_Code=='" + $('#hdnDVCode').val() + "' )]");
                if (accdata != false) {
                    for (var i = 0; i < accdata.length; i++) {
                        if (accdata[i].Acc_User_Name.toUpperCase() == accText.split(',')[1].split('(')[0].toUpperCase()) {
                            if (accdata[i].Is_Only_For_Doctor == "Y") {
                                $('#toggonlyfordoc_' + index).val('1')
                                $('#toggonlyfordoc_' + index).slider('refresh');
                                $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                return;
                            }
                        }
                    }
                }
                else {
                    if (acc_g != null && acc_g.length > 0) {
                        for (var i = 0; i < acc_g.length; i++) {
                            if (acc_g[i].accName.toUpperCase() == accText.toUpperCase()) {
                                if (acc_g[i].accOnlyDoc == "checked") {
                                    $('#toggonlyfordoc_' + index).val('1');
                                    $('#toggonlyfordoc_' + index).slider('refresh');
                                    $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                    return;
                                }
                            }
                        }
                    }
                }
                $('#toggonlyfordoc_' + index).val('0');
                $('#toggonlyfordoc_' + index).slider('refresh');
                $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
            }
            else {
                if (acc_g != null && acc_g.length > 0) {
                    for (var i = 0; i < acc_g.length; i++) {
                        if (acc_g[i].accName.toUpperCase() == accText.toUpperCase()) {
                            if (acc_g[i].accOnlyDoc == "checked") {
                                $('#toggonlyfordoc_' + index).val('1');
                                $('#toggonlyfordoc_' + index).slider('refresh');
                                $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                return;
                            }
                        }
                    }
                }
            }

        }
    }
    catch (e) {
        alert("fnSetOnlyForDoc()" + e.message);
    }
}

function GetProductDetailsForADoctor(dvCode) {
    var products;
    tp_Codeg = tp_Codeg == null ? "-1" : tp_Codeg == "" ? "-1" : tp_Codeg;
    $('#productlist').html('');
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDCRProductDetailsForADoctor',
        data: "DCR_Actual_Date=" + dcrDate_g + '&TP_Id=' + tp_Codeg + '&CP_Code=&DCR_Visit_Code=' + dvCode,
        async: false,
        success: function (response) {
            // we have the response
            products = response;
            $.mobile.loading('show');
        },
        error: function (e) {
            fnMsgAlert('error', screenTitle, 'Get Competitor Failed.');
            $.mobile.loading('hide');
        }
    });
    return products;
}

function fnGoAccPage() {
    var dvCode = "";
    if (codes_g.length > 0) {
        dvCode = codes_g.split('^')[0];
    }
    if (dvCode.indexOf('ED') == -1) {
        if (dvCode.length > 0) {
            $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/DoctorAccompanistEntry?DCR_Visit_Code=" + dvCode + "&docName=" + $('#txtDocName').val(), {
                type: "post",
                reverse: false,
                changeHash: false
            });
        }
        else {
            alert("Please save the " + doctor_header + " for accompanist entry.");
        }
    }
    else {
        alert("Please save the " + doctor_header + " for accompanist entry.");
    }
}



function showTimePicker() {

    $('#lnkHideTimeVT').css('display', '');
    $('#lnkShowTimeVT').css('display', 'none');
    $('#lnkHideTimeVM').css('display', '');
    $('#lnkShowTimeVM').css('display', 'none');
    var visttimeString = '<div data-role="fieldcontain" id="dvDocVisitTime"><fieldset data-role="controlgroup" data-mini="true"><div id="dvVisitTime" data-role="content"><div data-role="fieldcontain"><div><select id="drpHour" name="drpHour" data-mini="true"><option value="HH">HH</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select><div style="height: 5px;width: 100%;"></div><select id="drpMin" name="drpMin" data-mini="true"><option value="MM">MM</option></select><div style="height: 5px;width: 100%;"></div><select id="drpTimeMode" name="drpTimeMode" data-mini="true"><option value="AM">AM</option><option value="PM">PM</option></select></div></div></div></fieldset></div>'
    var visitmodeString = '<div data-role="fieldcontain" data-mini="true" id="dvDocVisitMode"><fieldset data-role="controlgroup" data-type="horizontal" ><div id="dvVisitMode"><input type="radio" name="visitmode" id="rdVisitModeAM" value="AM" data-mini="true" /><label for="rdVisitModeAM" > AM </label></div><div><input type="radio" data-mini="true" name="visitmode" id="rdVisitModePM" value="PM" /> <label for="rdVisitModePM" > PM </label> </div></fieldset></div>';
    if (doctotVisitTime_g.toUpperCase() == "AM_PM") {
        var visitMode = $('#spnVisitMode').html();
        $('#timePicker').html(visitmodeString);
        $('#timePicker').trigger("create");
        if ($.trim(visitMode).length > 0) {
            if (visitMode == "PM") {
                $('#rdVisitModePM').attr('checked', 'checked').checkboxradio('refresh');
            }
            else {
                $('#rdVisitModeAM').attr('checked', 'checked').checkboxradio('refresh');
            }
        }
        else {
            $('#togDocVisitMode').slider();
            $('#togDocVisitMode').slider('refresh');
        }
    }
    else {
        $('#timePicker').html(visttimeString);
        var time = $('#spnVisitTime').html();
        fnSetMinutestoDropDown();
        if ($.trim(time).length > 0) {
            var hour = time.split(':')[0];
            var min = time.split(':')[1].split(' ')[0];
            var mode = time.split(' ')[1];
            $('#drpHour').val(hour);
            $('#drpTimeMode').val(visitMode);
            if ($("#drpMin option[value='" + min + "']").length > 0) {
                $('#drpMin').val(min);
                $('#drpMin').selectmenu();
            }
            else {
                if (min != null && min.length > 0) {
                    $("#drpMin").append('<option value="' + min + '">' + min + '</option>');
                    $("#drpMin").val(min);
                }
            }
            $('#drpHour').selectmenu();
            $('#drpHour').selectmenu('refresh');
            $("#drpMin").selectmenu();
            $("#drpMin").selectmenu('refresh');
            $('#drpTimeMode').selectmenu();
            $('#drpTimeMode').selectmenu('refresh');
        }
    }
}

function validateTimePicker() {
    var visit_time = "";
    var visit_mode = "";
    $('#lnkHideTimeVT').css('display', 'none');
    $('#lnkShowTimeVT').css('display', '');
    $('#lnkHideTimeVM').css('display', 'none');
    $('#lnkShowTimeVM').css('display', '');

    if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
        var hour = $('#drpHour option:selected').val();
        var min = $('#drpMin option:selected').val();
        visit_mode = $('#drpTimeMode option:selected').val();
        if (hour == "HH") {
            fnMsgAlert('info', screenTitle, "please choose the hour value in the visit time.");
            return false;
        }
        else if (min == "MM") {
            fnMsgAlert('info', screenTitle, "please choose the minutes value in the visit time.");
            return false;
        }
        else {
            visit_mode = visit_mode;
            visit_time = hour + ":" + min + " " + visit_mode;
        }
    }
    else if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME") {
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
    else {
        if ($('#rdVisitModePM').attr('checked') == "checked") {
            visitmode = "PM";
        }
        else {
            visitmode = "AM";
        }
        $('#spnVisitMode').html(visitmode);
        if (visit_mode.length > 0) {
            $('#lnkShowTimeVM').html('Edit');
        }
    }
    if (visit_time.length > 0) {
        $('#spnVisitTime').html(visit_time);
        $('#lnkShowTimeVT').html('Edit');
    }
    $('#timePicker').html('');
}

function fnGetRCPASaleProducts() {
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetSaleProductsList',
        async: false,
        success: function (response) {
            // we have the response
            if (response != null && response.length > 0) {
                RCPAProductAutofill_g = response;
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
            alert(e.responseText);
        }
    });
}

function showChemistSimpleDialog(objche) {
    //alert("We will build a new page for chemist entry.");
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

function fnAddChemistRow(cheName) {
    chemRow_g = chemRow_g + 1;
    var chemistHTML = chemistString_g.replace(/CDNUM/g, chemRow_g);
    $('#chemistlist').append(chemistHTML).trigger('create');
    if (RCPA_g == "N") {
        $('#dvAddSaleProduct_' + chemRow_g).css('display', 'none');
    }
}

function fnDeleteChemist(ctl) {
    $('#' + ctl.id.replace('delete', 'div')).remove();
    $('.duplicateChemistHighlight').removeClass('duplicateChemistHighlight');
}

function fnGetChemist(value, text, n) {
    $('#slectedchemistslist').append('<li id="selectche_' + n + '"><a class="getChelabel" href="#">' + text + '</a><a href="#" onclick="fnDeleteChemistPopUp(\'' + n + '\')"></a></li><input type="hidden" value="' + value + '">')
    $('#chename_' + n).addClass('cheselected')
    $('#slectedchemistslist').trigger('create');
    $('#slectedchemistslist').listview('refresh');
}

function fnAddChemistRow(cheName) {
    chemRow_g = chemRow_g + 1;
    var chemistHTML = chemistString_g.replace(/CDNUM/g, chemRow_g);
    $('#chemistlist').append(chemistHTML).trigger('create');
    if (RCPA_g == "N") {
        $('#dvAddSaleProduct_' + chemRow_g).css('display', 'none');
    }
}

function fnGetChemists() {
    var searchWord = "";
    $.mobile.loading('show');
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetChemistsHTMLFormatted',
        data: "searchWord=" + searchWord + "&showAccChemist=" + accChemistPri_g + "&accRegions=" + accUsers_g,
        success: function (response) {
            if (typeof response != "object" && response.indexOf('Error') > -1) {
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, response.replace(/Error:/, ''));
            }
            else {
                if (response.length > 0) {
                    cg = response;
                    $("#chemistmodal").append(response);
                    $("#chemistmodal").listview("refresh");
                }
                else {
                    $("#chemistmodal").append("<li>No " + chemist_header + " Found.</li>");
                }

                $('#chemistmodal li').addClass('ui-screen-hidden');
                $('#chemistmodaldiv').simpledialog2();
                isChemistsget_g = true;
            }
            $.mobile.loading('hide');
            return false;
        },
        error: function (e) {
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Error', 'Get ' + chemist_header + ' Failed.');
        }
    });
}


function fnGetDCRChemistVisitForADoctor(rcpalistObj) {
    var dvCode = "";
    if (codes_g.length > 0) {
        dvCode = codes_g.split('^')[0];
    }
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDCRChemistVisitForADoctor',
        data: "DCR_Actual_Date=" + dcrDate_g + '&DCR_Visit_Code=' + dvCode,
        async: false,
        success: function (response) {
            fnSetChemists(response, rcpalistObj);
            $.mobile.loading('hide');
            $('#dvChemist').css('display', '')
        },
        error: function (e) {
            fnMsgAlert('error', screenTitle, e.responseText);
            $.mobile.loading('hide');
        }
    });
}

function GetDCRRCPADetailsForADoctor() {
    var rcpaObj = null;
    var dvCode = "";
    if (codes_g.length > 0) {
        dvCode = codes_g.split('^')[0];
    }
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDCRRCPADetailsForADoctor',
        data: "DCR_Actual_Date=" + dcrDate_g + '&DCR_Visit_Code=' + dvCode,
        async: false,
        success: function (response) {
            rcpaObj = response;
            $.mobile.loading('show');
        },
        error: function (e) {
            fnMsgAlert('error', screenTitle, e.responseText);
            $.mobile.loading('hide');
        }
    });
    return rcpaObj;
}


function fnSetChemists(chemistVisit, rcpalistObj) {
    debugger;
    //// START: Detailed Products
    if (chemistVisit != null && chemistVisit.length > 0) {
        for (var c = 0; c < chemistVisit.length; c++) {
            fnAddChemistRow();
            var cname = chemistVisit[c].Chemist_Name;
            var cpob = chemistVisit[c].POB_Amount;
            var cCode = chemistVisit[c].Chemist_Code;
            var cChemistVisitCode = chemistVisit[c].DCR_Chemists_Code;
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
                if (rcpalistObj != null && rcpalistObj.length > 0) {
                    var rcpaJSON = jsonPath(rcpalistObj, "$.[?(@.Chemist_Visit_Code=='" + cChemistVisitCode + "')]");
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

            }
        }
        // END: Detailed Products
    }
    else {
        $('#dvChemist').css('display', '');

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
    $.mobile.loading('show');
    var coIdArr = ctl.id.split('_');
    var cheNum = coIdArr[1];
    var rcpaRowNum = coIdArr[2];
    var compRows = $('#hdncomp_' + coIdArr[1] + '_' + coIdArr[2]).val();
    $('.compauto_' + cheNum + '_' + rcpaRowNum).empty()
    $('.compauto_' + cheNum + '_' + rcpaRowNum).text('');
    var saleproductvalue = $('#' + ctl.id).val();
    var compJSON = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + saleproductvalue + "')]");
    if (compJSON) {
        $.mobile.loading('hide');
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
                $.mobile.loading('show');
            },
            error: function (e) {
                fnMsgAlert('error', screenTitle, 'Get Competitor Failed.');
                $.mobile.loading('hide');
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

function fnSaveChemAndRCPA(docJSONArray, prodJSONArray, detProdJsonArray, redirectPoint) {
    // Chemists
    var dvCode = "";
    if (codes_g.length > 0) {
        dvCode = codes_g.split('^')[0];
    }
    var chem_name = "";
    var chem_code = "";
    var chem_pob = "0";
    var chemistString = "";
    var rcpaString = "";
    var chem_count = 0;
    var is_Acc_Chemist = '0'
    var che_Arr = new Array();
    var rcpastr = "";
    var chemJsonArray = new Array();
    var rcpaJSONArray = new Array();
    var chemistContainer = new Array();
    for (var ch = 1; ch <= chemRow_g; ch++) {
        var che = {};
        var chemobj = {};
        // Check that object are delete.
        if ($('#divChemist_' + ch).length > 0) {
            chem_code = $("#chemisthdn_" + ch).val();
            if (chem_code.length > 0 && chem_code != 0) {
                chem_name = $("#chemistspan_" + ch).html();
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
                if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($('#txtChemist_' + ch))) {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, 'Please  remove the special characters for ' + chemist_header + '.' + chem_name);
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false
                }
                if ($.inArray(chem_name, che_Arr) > -1) {
                    $.mobile.loading('hide');
                    var cherowIdsobj = jsonPath(chemistContainer, "$.[?(@.chemname=='" + chem_name + "')]");
                    for (var j = 0; j < cherowIdsobj.length; j++) {
                        $('#divChemist_' + cherowIdsobj[j].id).addClass("duplicateChemistHighlight")
                    }
                    fnMsgAlert('info', screenTitle, ' The '+ chemist_header +' "' + chem_name + '" entered more than once.');
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
                else {
                    che_Arr.push(chem_name);
                }
                chem_pob = $('#txtchepob_' + ch).val().length == 0 ? "0" : $('#txtchepob_' + ch).val();
                if (!/^\d{1,5}(\.\d{1,3})?$/.test(chem_pob)) {
                    $.mobile.loading('hide');
                    fnMsgAlert('info', screenTitle, ' The POB amount is invalid for the ' + chemist_header + '' + chem_name + '.');
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
                chemobj.DCR_Visit_Code = dvCode;
                chemobj.DCR_Chemists_Code = ch;
                chemobj.Chemist_Name = escape(chem_name);
                chemobj.Chemist_Code = $.trim(chem_code) == "" ? null : chem_code;
                chemobj.POB_Amount = $.trim(chem_pob) == "" ? null : chem_pob;
                chemobj.Is_Acc_Chemist = $.trim(is_Acc_Chemist) == "" ? "0" : "1";
                chemobj.Local_Ref_Code = ch;
                chemJsonArray.push(chemobj);

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
                                        fnMsgAlert('info', screenTitle, 'The Sale Product ' + rcpaProduct + ' entered more than once for ' + chemist_header + ' ' + chem_name + '.');
                                        $('#btnSaveAccEntry').attr('disabled', false);
                                        $('#btnSave').attr('disabled', false);
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
                                        fnMsgAlert('info', screenTitle, 'Invalid quantity for sale product ' + rcpaProduct + ' for ' + chemist_header + ' ' + chem_name + '.');
                                        $('#btnSaveAccEntry').attr('disabled', false);
                                        $('#btnSave').attr('disabled', false);
                                        return false;
                                    }
                                    // rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaCompCode + "^";
                                    var rcpaobj = {};
                                    rcpaobj.DCR_Visit_Code = dvCode == "" ? null : dvCode;
                                    rcpaobj.DCR_Product_Code = rcpaProductCode;// Product Code.
                                    rcpaobj.Product_Name = rcpaProduct; // RCPA Product Name.
                                    rcpaobj.Chemist_Visit_Code = ch; // chemist visit code.
                                    rcpaobj.Product_Code = rcpaProductCode;// Product Code.
                                    rcpaobj.Competitor_Product_Name = $.trim(rcpaProduct) == "" ? null : rcpaProduct; // rcpa comp name.
                                    rcpaobj.Competitor_Product_Code = null;// rcpa comp code.
                                    rcpaobj.Suuport_Qty = $.trim(rcpaCompQty) == "" ? "0" : rcpaCompQty// Qty.
                                    rcpaJSONArray.push(rcpaobj);
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
                                                    //  var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&]+$");
                                                    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($('#txtcomp_' + ch + '_' + rc + '_' + co))) {
                                                        fnMsgAlert('info', screenTitle, 'Please remove the special characters for the competitor ' + rcpaComp);
                                                        $('#btnSaveAccEntry').attr('disabled', false);
                                                        $('#btnSave').attr('disabled', false);
                                                        $.mobile.loading('hide');
                                                        return false
                                                    }
                                                    if ($.inArray(rcpaComp, compArr) > -1) {
                                                        $.mobile.loading('hide');
                                                        fnMsgAlert('info', screenTitle, ' The competitor ' + rcpaComp + ' entered more than once.');
                                                        $('#btnSaveAccEntry').attr('disabled', false);
                                                        $('#btnSave').attr('disabled', false);
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
                                                        $('#btnSaveAccEntry').attr('disabled', false);
                                                        $('#btnSave').attr('disabled', false);
                                                        return false;
                                                    }
                                                    var rcpaobj = {};
                                                    rcpaobj.DCR_Visit_Code = dvCode == "" ? null : dvCode;
                                                    rcpaobj.DCR_Product_Code = rcpaProductCode;// Product Code.
                                                    rcpaobj.Product_Name = rcpaProduct; // RCPA Product Name.
                                                    rcpaobj.Chemist_Visit_Code = ch; // chemist visit code.
                                                    rcpaobj.Product_Code = null;// Product Code.
                                                    rcpaobj.Competitor_Product_Name = $.trim(rcpaComp) == "" ? null : rcpaComp; // rcpa comp name.
                                                    rcpaobj.Competitor_Product_Code = rcpaCompCode=="" ? null : rcpaCompCode;// rcpa comp code.
                                                    rcpaobj.Suuport_Qty = $.trim(rcpaCompQty) == "" ? "0" : rcpaCompQty// Qty.
                                                    rcpaJSONArray.push(rcpaobj);
                                                    // rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaCompCode + "^";
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
        if (chemJsonArray.length < chemists_mandatory_number_g) {
            $.mobile.hidePageLoadingMsg('loading');
            fnMsgAlert('info', screenTitle, ' You need to enter minimum of ' + chemists_mandatory_number_g + ' ' + chemist_header + '.');
            $('#btnSaveAccEntry').attr('disabled', false);
            $('#btnSave').attr('disabled', false);

            return false;
        }
    }
    //RCPA Category Check

    if (rcpaJSONArray != null && rcpaJSONArray.length == 0 && RCPA_g == "R") {
        var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
        if (rcpaMandatory.length > 0) {
            var rcapCategoryArray = rcpaMandatory.split(',');
            if ($('#hdnCate').val() != null && $('#hdnCate').val().length > 0) {
                if ($.inArray($('#hdnCate').val(), rcapCategoryArray) > -1) {
                    $.mobile.hidePageLoadingMsg('loading');
                    fnMsgAlert('info', screenTitle, "For " + rcpaMandatory + " "+doctor_header+", you need to enter minimum of one RCPA entry.")
                    $('#btnSaveAccEntry').attr('disabled', false);
                    $('#btnSave').attr('disabled', false);
                    return false;
                }
            }
        }
    }
    fnInsertDoctorDetails(docJSONArray, prodJSONArray, chemJsonArray, rcpaJSONArray, detProdJsonArray, redirectPoint);
}

function fnShowInputs() {
    $.mobile.loading('show');
    if (!inputsModified) {
        inputsModified = true;
        $('#divinputscollapse').removeClass('plmicollapse');
        $('#divinputscollapse').addClass('plmiexpand');

        var dvCode = $('#hdnDVCode').val();
        if (dvCode.length > 0) {
            var prodObj = GetProductDetailsForADoctor(dvCode);

            if (prodObj != null && prodObj.length > 0) {
                fnCreateProductsRow(prodObj);
            }
            else {
                $('#dvInputs').css('display', '');
                $.mobile.loading('hide');
            }
        }
        else {
            if (tp_Codeg != null && tp_Codeg.toString().length > 0) {
                var TPProducts = GetProductDetailsForADoctor(dvCode);
                var doctorProducts = jsonPath(TPProducts, "$.[?(@.Doctor_Code=='" + $('#hdnDocCode').val() + "')]");
                fnCreateProductsRow(doctorProducts);
            }
            $('#dvInputs').css('display', '');
            $.mobile.loading('hide');
        }
    }
    else {
        if ($('#divinputscollapse').hasClass("plmicollapse")) {
            $('#divinputscollapse').removeClass("plmicollapse");
            $('#divinputscollapse').addClass("plmiexpand");
            $('#dvInputs').css('display', '');
            $.mobile.loading('hide');

        }
        else if ($('#divinputscollapse').hasClass("plmiexpand")) {
            $('#divinputscollapse').removeClass("plmiexpand");
            $('#divinputscollapse').addClass("plmicollapse");
            $('#dvInputs').css('display', 'none');
            $.mobile.loading('hide');
        }
    }
}

function fnCreateProductsRow(prodObj) {
    var productsData = prodObj;
    for (var p = 0; p < productsData.length; p++) {
        var pname = productsData[p].Product_Name;
        var pqty = productsData[p].Quantity_Provided;
        var isDetailed = productsData[p].Is_Detailed
        var pCode = productsData[p].Product_Code;
        var currentStock = productsData[p].Current_Stock;
        pname = pname + '(' + (parseInt(currentStock) + parseInt(pqty)).toString() + ')';
        fnAddProductRow(pqty, pCode, pname);
        $('#prodSpan_' + prodRow_g).html(pname);
        $('#prodhdn_' + prodRow_g).val(pCode);
        if (isDetailed == "1") {
            $('#rdYes_' + prodRow_g).attr('checked', 'checked').checkboxradio('refresh');
        }
        else {
            $('#rdNo_' + prodRow_g).attr('checked', 'checked').checkboxradio('refresh');
        }
        $('#txtprdqty_' + prodRow_g).val(pqty);
        $('#dvInputs').css('display', '');
        $.mobile.loading('hide');
    }
}



function fnUpadteDoctorList(dvcode, docobj) {
    var dvcodematch = false;
    if (doclist_g != null && doclist_g.length > 0) {
        for (var i = 0; i < doclist_g[0].Data.length; i++) {
            var d = doclist_g[0].Data[i];
            if (d.Doctor_Visit_Code == dvcode) {
                dvcodematch = true;
                doclist_g[0].Data[i].Doctor_Name = docobj.label;
                doclist_g[0].Data[i].label = docobj.label;
                doclist_g[0].Data[i].Doctor_Code = docobj.Doctor_Code;
                doclist_g[0].Data[i].Category = docobj.Category;
                doclist_g[0].Data[i].Doctor_Region_Code = docobj.Doctor_Region_Code;
                doclist_g[0].Data[i].Doctor_Visit_Time = docobj.Doctor_Visit_Time;
                doclist_g[0].Data[i].Is_Acc_Doctor = docobj.Is_Acc_Doctor;
                doclist_g[0].Data[i].Is_CPDoc = docobj.Is_CPDoc;
                doclist_g[0].Data[i].Lattitude = docobj.Lattitude;
                doclist_g[0].Data[i].Location = docobj.Location;
                doclist_g[0].Data[i].Longtitude = docobj.Longtitude;
                doclist_g[0].Data[i].Mode_Of_Entry = docobj.Mode_Of_Entry;
                doclist_g[0].Data[i].POB_Amount = docobj.POB_Amount;
                doclist_g[0].Data[i].Record_Status = "3";
                doclist_g[0].Data[i].Remarks = docobj.Remarks == null ? "" : docobj.Remarks;
                doclist_g[0].Data[i].Source_of_Entry = docobj.Source_of_Entry;
                doclist_g[0].Data[i].Speciality_Code = docobj.Speciality_Code;
                doclist_g[0].Data[i].Speciality_Name = docobj.Speciality_Name;
                doclist_g[0].Data[i].Visit_Mode = docobj.Visit_Mode;
                doclist_g[0].Data[i].Entered_Date_Time = doctor.Entered_Date_Time;
            }
        }
        if (!dvcodematch) {
            docobj.Record_Status = "3";
            doclist_g[0].Data.push(docobj);
        }
    }
    else {
        if (!dvcodematch) {
            docobj.Record_Status = "3";
            doclist_g[0].Data.push(docobj);
        }
    }
}

function fnGoToHome() {
    $.mobile.changePage("../DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F&travelKm=0", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}


function getLocation(par) {
    debugger;
    try{
        parval = par;
        var GeoLocMand = fnGetPrivilegeValue("APP_GEO_LOCATION_MANDATORY", "NO")
        if (GeoLocMand == "YES") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition,showError);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        if (GeoLocMand == "NO") {
            if (par == 'A') {
                fnValidation('A');
            }
            if (par == 'X') {
                fnValidation();
            }
        }
    }
    catch(e)
    {
        if (par == 'A') {
            fnValidation('A');
        }
        if (par == 'X') {
            fnValidation();
        }
    }
}
function showPosition(position) {
    debugger;
    //var DCRLatitude = position.coords.latitude;
    //var DCRLongitude = position.coords.Longtitude;
    if (parval == 'A') {
        fnValidation('A');
    }
    if (parval == 'X') {
        fnValidation();
    }
}
function showError(error) {
    debugger;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //alert("GPS is not Enabled in your broswer.Turn on your GPS");
            if (parval == 'A') {
                fnValidation('A');
            }
            if (parval == 'X') {
                fnValidation();
            }
            break;
        case error.POSITION_UNAVAILABLE:
            //alert("Location information is unavailable.Please Try again");
            if (parval == 'A') {
                fnValidation('A');
            }
            if (parval == 'X') {
                fnValidation();
            }
            break;
        case error.TIMEOUT:
            //alert("The request to get user location timed out.Please Try again");
            if (parval == 'A') {
                fnValidation('A');
            }
            if (parval == 'X') {
                fnValidation();
            }
            break;
        case error.UNKNOWN_ERROR:
            //alert("An unknown error occurred.Please Try again");
            if (parval == 'A') {
                fnValidation('A');
            }
            if (parval == 'X') {
                fnValidation();
            }
            break;
    }
}