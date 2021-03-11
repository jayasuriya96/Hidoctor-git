var isChemistsget_g = false;

var chemistString_g = ' <div id="divChemist_CDNUM" style="border:1px solid #aaa;padding:3px" ><div data-role="fieldcontain"><a href="#" id="deleteChemist_CDNUM"  class="delete-icon"  onclick="fnDeleteChemist(this)"  style="float:right;width:35px;margin-top:-10px;margin-right:5px"></a><label for="selectche_CDNUM">Chemist</label><span id="chemistspan_CDNUM" style="font-weight:bold;padding-left:5px;font-size:12px;"></span><input id="chemisthdn_CDNUM" type="hidden" value="0" />';
chemistString_g += '<div id="divflexichme_CDNUM"><label for="txtChemist_CDNUM">if not listed type here</label><input id="txtChemist_CDNUM" maxlength="50" type="text" value=""></div></div><div data-role="fieldcontain" data-mini="true"><fieldset data-role="controlgroup" data-mini="true"><label for="txtchepob_CDNUM">';
chemistString_g += 'POB</label><input name="POB" id="txtchepob_CDNUM" placeholder="0.00" value="" maxlength="6" type="text"></fieldset><input type="hidden" id="hdnRCPANo_CDNUM" value="0"></div><div id="dvRCPA_CDNUM"></div><div id="dvAddSaleProduct_CDNUM"><a href="#" onclick="fnAddRCPA(\'CDNUM\')" >Add RCPA</a><div></div>';

var rcpaString_g = '<div data-role="collapsible-set" data-theme="e" data-content-theme="c" data-mini="true" id="dvRCPA_CDNUM_RDNUM">';
rcpaString_g += '<div data-role="collapsible" data-collapsed="false" data-mini="true"><h3>RCPA</h3><div style="width:24px;height:24px;float:right"><a href="#" id="deleteRCPA_CDNUM_RDNUM" onclick="fnDeleteRCPA(this)" class="delete-icon"  style="float:right;margin-right:5px"></a></div><div style="clear:both"></div>';
rcpaString_g += '<div data-inset="true" data-theme="c" data-mini="true"><input type="hidden" id="hdncomp_CDNUM_RDNUM" value="1"><label for="selectsaleprod_CDNUM_RDNUM">Sale Product</label><select data-mini="true" id="selectsaleprod_CDNUM_RDNUM" onchange="fnResetCompAutofill(this)"/><label for="txtsaleprodQty_CDNUM_RDNUM">Qty</label><input type="text" maxlength="3" id="txtsaleprodQty_CDNUM_RDNUM" value="0" /> ';
rcpaString_g += '<div style="background:#bbb;margin:5px;padding:5px"><div id="dvComp_CDNUM_RDNUM"  data-inset="true" data-theme="E" data-mini="true">';
rcpaString_g += '<div id="dvcomp_CDNUM_RDNUM_1" style="border-bottom:1px solid #222"><div style="float:right;heigth:24px;width:100%"><a href="#"  onclick="fnDeleteComp(this)" id="deletecomp_CDNUM_RDNUM_1" class="delete-icon" style="float:right;width:35px;margin-top:-5px;"></a></div><div><div style="clear:both"></div><label for="selectcomp_CDNUM_RDNUM_1">Comp</label><select id="selectcomp_CDNUM_RDNUM_1" class="compauto_CDNUM_RDNUM" data-mini="true" ></select><label for="txtcomp_CDNUM_RDNUM_1">if not listed type here</label><input type="text" value="" id="txtcomp_CDNUM_RDNUM_1" maxlength="50" />';
rcpaString_g += '<label for="txtcompqty_CDNUM_RDNUM_1">Qty</label><input type="text" id="txtcompqty_CDNUM_RDNUM_1" maxlength="3" /></div></div><div><a href="#" id="addcomp_CDNUM_RDNUM_1" onclick="fnAddCompRow(this)" >Add Comp</a></div></div></div></div></div>';

function fnGetMaxCodes() {
    maxCode_g = "";
    $.ajax({
        type: 'POST',
        data: "DCR_Actual_Date=" + dcrActualDate_g,
        url: '../DCRV4DoctorVisit/GetDCRDoctorVisitMaxCodes',
        async: false,
        success: function (response) {

            // we have the response
            maxCode_g = response;
            
        },
        error: function (e) {
            // alert(e.responseText);
        }
    });
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
                //fnGetDoctorVisitData();
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
    /* if ($('#txChemSearch').val().length == 0) {
         fnMsgAlert('info', screenTitle, 'Please enter atleast three letters.');
         return false;
     }*/
    var searchWord = "";
    $.mobile.loading('show');
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetChemistsHTMLFormatted',
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
                    //for (var cr = 0; cr < response.length; cr++) {
                    //    $("#chemistmodal").append('<li data-theme="c"><a href="#"  style="font-weight:normal; font-size:12px;" onclick="fnGetChemist(\'' + response[cr].value + '\',\'' + response[cr].label + '\',\'' + cr + '\')" id=chename_' + cr.toString() + ' data-transition="slide">' + response[cr].label + '</a></li>');
                    //}
                    cg = response;
                    $("#chemistmodal").append(response);
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
            // we have the response
            //detProducts_g = response;
            fnSetChemists(response, rcpalistObj);
            $.mobile.loading('show');
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
            // we have the response
            //detProducts_g = response;
            rcpaObj = response;
            //fnSetChemists(response);
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
                debugger;
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
        //fnGetRCPASaleProducts();
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

function fnSaveandBack() {
    fnSaveRCPA();
    var docname = $('#docnamevalue').html();
    var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";
    $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/Index?Status=" + dcrStatus_g + "&flagRCPA=" + rcpa + "&accUsers=" + accRegions_g + "&cp=&tp=&dcrActualDate=" + dcrDate_g + "&category=&travelledkms=" + travelKMS_g + "&source=&flag=&codes=&doctorName=" + docname, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnSaveandHome() {
    fnSaveRCPA();
    $.mobile.changePage("../DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F&travelKm=0", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnSaveChemAndRCPA() {
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
            //chem_code = $("#selectche_" + ch + " option:selected").val();
            chem_code = $("#chemisthdn_" + ch).val();
            if (chem_code.length > 0 && chem_code != 0) {
                chem_name = $("#chemistspan_" + ch).html();
                //var chem_json = jsonPath(chemistAutoFill_g, "$.[?(@.value=='" + chem_code + "')]");
                //if (chem_json && chem_json.length > 0) {
                //    is_Acc_Chemist = chem_json[0].Is_Acc_Chemist;
                //}
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
                chemobj.DCR_Visit_Code = dvCode;
                chemobj.DCR_Chemists_Code = ch;
                chemobj.Chemist_Name = escape(chem_name);
                chemobj.Chemist_Code = $.trim(chem_code) == "" ? null : chem_code;
                chemobj.POB_Amount = $.trim(chem_pob) == "" ? null : chem_pob;
                chemobj.Is_Acc_Chemist = $.trim(is_Acc_Chemist) == "" ? "0" : "1";
                chemobj.Local_Ref_Code = ch;
                chemJsonArray.push(chemobj);
                //chemistString += escape(chem_name) + "^" + chem_code + "^" + chem_pob + "^" + visit_mode + "^" + is_Acc_Chemist + "^";

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
                                   // rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaCompCode + "^";
                                    var rcpaobj = {};
                                    rcpaobj.DCR_Visit_Code = dvCode == "" ? null : dvCode;
                                    rcpaobj.DCR_Product_Code = rcpaProductCode;// Product Code.
                                    rcpaobj.Product_Name = rcpaProduct; // RCPA Product Name.
                                    rcpaobj.Chemist_Visit_Code = ch; // chemist visit code.
                                    rcpaobj.Product_Code = rcpaProductCode;// Product Code.
                                    rcpaobj.Competitor_Product_Name = $.trim(rcpaProduct) == "" ? null : rcpaProduct; // rcpa comp name.
                                    rcpaobj.Competitor_Product_Code = rcpaProductCode// rcpa comp code.
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
                                                    var rcpaobj = {};
                                                    rcpaobj.DCR_Visit_Code = dvCode == "" ? null : dvCode;
                                                    rcpaobj.DCR_Product_Code = rcpaProductCode;// Product Code.
                                                    rcpaobj.Product_Name = rcpaProduct; // RCPA Product Name.
                                                    rcpaobj.Chemist_Visit_Code = ch; // chemist visit code.
                                                    rcpaobj.Product_Code = rcpaProductCode;// Product Code.
                                                    rcpaobj.Competitor_Product_Name = $.trim(rcpaComp) == "" ? null : rcpaComp; // rcpa comp name.
                                                    rcpaobj.Competitor_Product_Code = rcpaCompCode// rcpa comp code.
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
            fnMsgAlert('info', screenTitle, ' You need to enter minimum of ' + chemists_mandatory_number_g + ' chemists.');
            return false;
        }
    }
    //RCPA Category Check

    if (rcpaJSONArray != null && rcpaJSONArray.length == 0 && RCPA_g == "R") {
        var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
        if (rcpaMandatory.length > 0) {
            var rcapCategoryArray = rcpaMandatory.split(',');
            //var doctorCategory = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + doc_code + "')]");
            if (doctorCategory && doctorCategory[0].Category != null) {
                if ($.inArray(doctorCategory[0].Category, rcapCategoryArray) > -1) {
                    //$.msgbox("For " + rcpaMandatory + " doctors, you need to enter minimum of one RCPA entry.");
                    $.mobile.hidePageLoadingMsg('loading');
                    fnMsgAlert('info', screenTitle, "For " + rcpaMandatory + " doctors, you need to enter minimum of one RCPA entry.")
                    return false;
                }
            }
        }
    }
    //console.log(rcpaJSONArray);
    //console.log(chemJsonArray);
    //fnSaveChemAndRCPA(chemJsonArray, rcpaJSONArray);
}

function fnSaveChemAndRCPA(chemJsonArray, rcpaJSONArray) {
    debugger;
    codeArr = codes_g.split('^');
    var dvCode = codeArr[0];
    
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/InsertDCRChemistsAndRCPA',
        data: 'DCR_Actual_Date=' + dcrDate_g + '&DCR_Visit_Code=' + dvCode + "&chemistJSON=" + JSON.stringify(chemJsonArray)
        + "&RCPAJSON=" + JSON.stringify(rcpaJSONArray) + "&chemitMaxCode=" + maxCode_g.Chemist_Max_Code +
        "&RCPAMAxCode=" + maxCode_g.RCPA_Max_Code,
        async: false,
        success: function (response) {
            // we have the response
            $.mobile.loading('show');
        },
        error: function (e) {
            fnMsgAlert('error', "Doctor Accompanist", e.responseText);
            $.mobile.loading('hide');
        }
    });
}