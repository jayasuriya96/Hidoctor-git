var isDetProd_g = false;
var detailProductString_g = '<div id="divDetailedProduct_PDNUM" class="prdcount" data-icon="delete" style="border:1px solid #aaa;padding:3px" ><div data-role="fieldcontain"  data-mini="true"><a href="#" id="deleteDetailedProduct_PDNUM" class="delete-icon" style="float:right;margin-top:-10px;margin-right:5px;" onclick="fnDeleteDetProduct(this)"></a><span id="detProdSpan_PDNUM" style="font-weight:bold;padding-left:5px;font-size:12px;"></span><input id="detProdhdn_PDNUM" type="hidden" value="" /><input type="hidden" id="hdnDetEntryMode_PDNUM"></div>';
detailProductString_g += '</div>';

function fnDeleteDetProduct(ctl) {
    
    $('#' + ctl.id.replace('delete', 'div')).remove();
}

function showDetailedProductSimpleDialog(objdetProd) {
    //alert("We will build a new page for detailed products entry.");
    if (isDetProd_g) {
        $.mobile.loading('show');
        $('#detProductmodaldiv').simpledialog2();
        $.mobile.loading('hide');
        return false;
    }
    else {
        fnGetDetailedProducts();
    }
}

function fnGetDetailedProducts() {

    $.mobile.loading('show');
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDetailedProductsHTMLFormatted',
        success: function (response) {
            if (response.indexOf('Error') > -1) {
                //alert(result.replace(/Error:/, ''));
                $.mobile.loading('hide');
                fnMsgAlert('info', screenTitle, response.replace(/Error:/, ''));
            }
            else {
                if (response.length > 0) {
                    $("#Detailproductmodal").append(response);
                    $("#Detailproductmodal").listview("refresh");
                }
                else {
                    $("#Detailproductmodal").append("<li>No Products Found.</li>");
                }
                $('#Detailproductmodal li').addClass('ui-screen-hidden');
                $('#detProductmodaldiv').simpledialog2();
                isDetProd_g = true;
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

function fnGetDetProd(value, text, n) {
    $('#selecteddetProdslist').append('<li id="selectdetProd_' + n + '"><a class="getdetPrdlabel" href="#">' + text + '</a><a href="#" onclick="fnDeleteDetProdPopUp(\'' + n + '\')"></a></li><input type="hidden" value="' + value + '">')
    $('#detProdName_' + n).addClass('cheselected')
    $('#selecteddetProdslist').trigger('create');
    $('#selecteddetProdslist').listview('refresh');
}

function fnGetDetailedProductsForADoctor() {
    var dvCode = "";
    if (codes_g.length > 0) {
        dvCode = codes_g.split('^')[0];
    }
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDCRDetailedProductsForADoctor',
        data: "DCR_Actual_Date=" + dcrDate_g + '&DCR_Visit_Code=' + dvCode,
        async: false,
        success: function (response) {
            // we have the response
            //detProducts_g = response;
            fnSetDetProducts(response);
            $.mobile.loading('show');
        },
        error: function (e) {
            fnMsgAlert('error', screenTitle, e.responseText);
            $.mobile.loading('hide');
        }
    });
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

function fnSetDetProducts(detProducts) {
    //// START: Detailed Products
    if (detProducts != null && detProducts.length > 0) {
        
        for (var dpi = 0; dpi < detProducts.length; dpi++) {
            var detProdName = detProducts[dpi].Sale_Product_Name;
            var detProdCode = detProducts[dpi].Sale_Product_Code;
            fnAddDetailedProductsRow(detProdName, detProdCode);
            
            if (detProducts[dpi].Mode_Of_Entry == "A") {
                $('#deleteDetailedProduct_' + detProdRow_g).css('display', 'none');
            }
            $('#hdnDetEntryMode_' + detProdRow_g).val(detProducts[dpi].Mode_Of_Entry);
        }
    }
    // END: Detailed Products
}

function fnSave() {
    // START: Detailed Products..
    // Detailed Products.
    $('#btnSaveBack').attr('disabled', 'disable');
    $('#btnSaveHome').attr('disabled', 'disable');
    var detail_string = "";
    var det_prd_Name = "";
    var det_prd_Code = "";
    var det_mode_of_entry = "";
    var detprdArray = new Array();
    var detProdJsonArray = new Array();
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
              
                $('#btnSaveBack').attr('disabled', false);
                $('#btnSaveHome').attr('disabled', false);
                return false;
            }
            if ($.inArray(det_prd_Name, detprdArray) > -1) {
                fnMsgAlert('info', screenTitle, 'Detailed Product Name is duplicate.');
                $('#btnSaveBack').attr('disabled', false);
                $('#btnSaveHome').attr('disabled', false);

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
        fnMsgAlert('info', screenTitle, 'You should enter at least ' + detailProdMandatory + ' detailing products for this doctor visit..');
        $('#btnSaveBack').attr('disabled', false);
        $('#btnSaveHome').attr('disabled', false);

        return false;
    }

    if (detProdJsonArray.length > 0) {
        fnSaveDetailedProducts(detProdJsonArray);
    }
    return true;
    // END: Detailed Products..
}

function fnSaveDetailedProducts(detProdJSON) {
    codeArr = codes_g.split('^');
    var dvCode = codeArr[0];
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/InsertDCRDetailedProducts',
        data: 'DCR_Actual_Date=' + dcrDate_g + '&DCR_Visit_Code=' + dvCode + "&detProdJSON=" + JSON.stringify(detProdJSON),
        async: false,
        success: function (response) {
            $('#btnSaveBack').attr('disabled', false);
            $('#btnSaveHome').attr('disabled', false);
            // we have the response
            $.mobile.loading('show');
        },
        error: function (e) {
            $('#btnSaveBack').attr('disabled', '');
            $('#btnSaveHome').attr('disabled', '');
            fnMsgAlert('error', "Doctor Accompanist", e.responseText);
            $.mobile.loading('hide');
        }
    });
}

function fnSaveandBack() {
    var result = fnSave();
    if (result) {
        var docname = $('#docnamevalue').html();
        var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";

        $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/Index?Status=" + dcrStatus_g + "&flagRCPA=" + rcpa + "&accUsers=" + accRegions_g + "&cp=&tp=&dcrActualDate=" + dcrDate_g + "&category=&travelledkms=" + travelKMS_g + "&source=&flag=&codes=&doctorName=" + docname, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
}

function fnSaveandHome() {
    var result = fnSave();
    if (result) {
        $.mobile.changePage("../DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F&travelKm=0", {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
}


function fnCancel() {
    if (confirm("Do you wish to cancel the page?")) {
        var docname = $('#docnamevalue').html();
        var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";

        $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/Index?Status=" + dcrStatus_g + "&flagRCPA=" + rcpa + "&accUsers=" + accRegions_g + "&cp=&tp=&dcrActualDate=" + dcrDate_g + "&category=&travelledkms=" + travelKMS_g + "&source=&flag=&codes=&doctorName=" + docname, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }

}

function fnGoToHome() {
    $.mobile.changePage("../DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F&travelKm=0", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}
