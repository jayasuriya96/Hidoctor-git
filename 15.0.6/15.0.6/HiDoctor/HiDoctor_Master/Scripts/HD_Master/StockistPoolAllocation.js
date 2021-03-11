var rowCount = 0;
var sCR = "";
var sCRAuto = "";
var stckSummary = "";

function fnBindStockistSharingRatio() {
    var cont = "";

    cont = '<div class="SCommon">';
    cont += '<div class="S1 SsubHeader">Territory Name</div>';
    cont += '<div class="S2 SsubHeader">Division Name</div>';
    cont += '<div class="S3 SsubHeader">Share (in %)</div>';
    cont += '<div class="S4"></div>';
    cont += '</div>';

    for (var i = 1; i <= 4; i++) {
        cont += '<div class="SCommon SRow SEnable">';
        cont += '<div class="S1"><input type="text" class="autoTerritory" id="txtRegion_' + i + '" /><input type="hidden" id="hdnRegion_' + i + '" /></div>';
        cont += '<div class="S2"><label class="divisionName" id="lblDivision_' + i + '"></label><input type="hidden" id="hdnDivision_' + i + '" /></div>';
        cont += '<div class="S3"><input type="text" class="number" /></div>';
        cont += '<div class="S4" style="cursor:pointer;" onclick="fnDeleteSharingRatio(this);">X</div>';
        cont += '</div>';
    }
    rowCount = 4;
    $("#dvSharingRatio").html(cont);
    fnEventBinder();
    fnGetChildRegionWithDivision();
}


function fnBindStockistAllocationSummary() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/StockistPollAllocation/GetStockistPoolAllocationDetails',
        data: 'regionCode=' + $('#hdnRegionCode').val(),
        success: function (response) {
            var jsStock = eval('(' + response + ')');
            stckSummary = jsStock;
            if ((jsStock !== undefined) && jsStock.Tables.length > 0 && jsStock.Tables[0].Rows.length > 0) {
                var tblCont = "";
                tblCont = "<table cellspacing='0' cellpadding='0' id='tblStockistAllocation' class='data display dataTable box' width='100%'>";
                tblCont += "<thead>";

                tblCont += "<tr style='display: none;' id='tblTrb'>";
                tblCont += "<th >Stockiest Name</th>";
                tblCont += "<th >Product Name</th>";
                tblCont += "<th >Sharing Details</th>";
                tblCont += "<th >Division</th>";
                tblCont += "<th >Effective From</th>";
                tblCont += "<th >Effective To</th>";
                tblCont += "<th >Status</th>";
                tblCont += "<th >Action</th>";
                tblCont += "</tr>";
                tblCont += "<tr>";
                tblCont += "<th >Stockiest Name</th>";
                tblCont += "<th >Product Name</th>";
                tblCont += "<th >Sharing Details</th>";
                tblCont += "<th >Division</th>";
                tblCont += "<th >Effective From</th>";
                tblCont += "<th >Effective To</th>";
                tblCont += "<th >Status</th>";
                tblCont += "<th >Action</th>";
                tblCont += "</tr>";

                var type = '[{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }, { type: "text" },{ type: "text" },{ type: "text" }';
                type += ']';

                tblCont += "<tr><th colspan= '8' align='left'  ><span id='spnDivToggleb' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeb()'>Show Filter</span></th></tr>";
                tblCont += " </thead><tbody>";

                for (var i = 0; i < jsStock.Tables[0].Rows.length; i++) {
                    tblCont += "<tr>";
                    tblCont += "<td >" + jsStock.Tables[0].Rows[i]["Customer_Name"] + "</td>";
                    tblCont += "<td >" + jsStock.Tables[0].Rows[i]["Product_Name"] + "</td>";

                    var sharing = jsonPath(jsStock, "$.Tables[1].Rows[?(@.Stockist_Share_Code=='" + jsStock.Tables[0].Rows[i]["Stockist_Share_Code"] + "')]");
                    if (sharing != false && sharing !== undefined && sharing.length > 0) {
                        var tableSub1 = "<table cellspacing='0' cellpadding='0' border='0'>";
                        var tableSub2 = "<table cellspacing='0' cellpadding='0' border='0'>";
                        for (var m = 0; m < sharing.length; m++) {
                            tableSub1 += "<tr><td>" + sharing[m].Region_Name + " = " + sharing[m].Share_Percentage + "</td></tr>";
                            tableSub2 += "<tr><td>" + ((sharing[m].Division_Name == null) ? "No Division" : sharing[m].Division_Name) + "</td></tr>";
                        }
                        tableSub1 += "</table>";
                        tableSub2 += "</table>";
                        tblCont += "<td >" + tableSub1 + "</td>";
                        tblCont += "<td >" + tableSub2 + "</td>";
                    }
                    else {
                        tblCont += "<td ></td>";
                        tblCont += "<td ></td>";

                    }
                    tblCont += "<td >" + jsStock.Tables[0].Rows[i]["Effective_From"] + "</td>";
                    tblCont += "<td >" + jsStock.Tables[0].Rows[i]["Effective_To"] + "</td>";
                    tblCont += "<td >" + ((jsStock.Tables[0].Rows[i]["Record_Status"] == '1') ? "Enabled" : "Disabled") + "</td>";
                    tblCont += "<td class='td-a' onclick='fnEditStockistAllocation(\"" + jsStock.Tables[0].Rows[i]["Stockist_Share_Code"] + "\")'>Edit</td>";
                    tblCont += "</tr>";
                }
                tblCont += "</tbody></table>";

                $("#dvSummary").html(tblCont);
                $("#divPrint").html(tblCont);
                var jsonType = eval(type);
                $('#tblStockistAllocation').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true
                    , "sDom": 'T<"clear">lfrtip'
                }).dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
                fninializePrint("divPrint", "ifrmPrint", "dvSummary");
                $("#dvAjaxLoad").hide();
            }
            else {
                $("#dvAjaxLoad").hide();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error3.' + e.Message);
        }
    });
}

function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}


function fnDeleteSharingRatio(id) {
    if ($("#dvSharingRatio .SEnable").length != 1) {
        $(id).closest(".SCommon").css('display', 'none');
        $(id).closest(".SCommon").removeClass('SEnable');
        $(id).closest(".SCommon").addClass('SDisabled');
    }
}

function fnCreateNewRow(id) {
    var actualRows = $("#dvSharingRatio .SEnable").length;
    if ($("#dvSharingRatio .SEnable .S1 input[type=text]")[actualRows - 1].id === id.id) {
        var cont = "";
        var row = parseInt($("#dvSharingRatio .SRow").length) + 1;
        cont = '<div class="SCommon SRow SEnable">';
        cont += '<div class="S1"><input type="text" class="autoTerritory" id="txtRegion_' + row + '" /><input type="hidden" id="hdnRegion_' + row + '" /></div>';
        cont += '<div class="S2"><label class="divisionName" id="lblDivision_' + row + '"></label><input type="hidden" id="hdnDivision_' + row + '" /></div>';
        cont += '<div class="S3"><input type="text" class="number" /></div>';
        cont += '<div class="S4" style="cursor:pointer;" onclick="fnDeleteSharingRatio(this);">X</div>';
        cont += '</div>';
    }
    $("#dvSharingRatio").append(cont);
    autoComplete(sCRAuto, "txtRegion", "hdnRegion", 'autoTerritory');
    fnEventBinder();
}

function fnEventBinder() {
    // new row 
    $(".autoTerritory").keypress(function () { fnCreateNewRow(this); });
    $(".autoTerritory").dblclick(function () { fnCreateNewRow(this); });

    // fil division
    $(".autoTerritory").blur(function () { fnFillDivision(this); });
}

function fnBindStockist() {
    var stockistJson = "";
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/StockistPollAllocation/GetStockistData',
        data: 'regionCode=' + $('#hdnRegionCode').val(),
        success: function (response) {
            var jsStock = response;

            // generate json for accompanist
            var stockist = "[";
            for (var i = 0; i < jsStock.data.length; i++) {
                stockist += "{name:" + '"' + "" + jsStock.data[i].Customer_Name + '(' + jsStock.data[i].Region_Name + ')' + "" + '",' + "id:" + '"' + "" + jsStock.data[i].Customer_Code + '_' + jsStock.data[i].Region_Code + "" + '"' + "}";
                if (i < jsStock.data.length - 1) {
                    stockist += ",";
                }
            }
            stockist += "];";
            stockistJson = eval(stockist);

            $(".stockist_token_input").prev().detach();
            $(".stockist_token_input").tokenInput(
                [stockistJson], {
                    preventDuplicates: true, theme: "facebook", onAdd: function (item) {

                    },
                    onDelete: function (item) {

                    }
                }
                );
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error1.' + e.Message);
        }
    });
}

function fnBindProduct() {
    var productJson = "";
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/StockistPollAllocation/GetAllSaleProducts',
        success: function (response) {
            var jsProd = response;
            // generate json for accompanist
            var product = "[";
            for (var i = 0; i < jsProd.length; i++) {
                product += "{name:" + '"' + "" + jsProd[i].Product_Name + "" + '",' + "id:" + '"' + "" + jsProd[i].Product_Code + "" + '"' + "}";
                if (i < jsProd.length - 1) {
                    product += ",";
                }
            }
            product += "];";
            productJson = eval(product);

            $(".product_token_input").prev().detach();
            $(".product_token_input").tokenInput(
                [productJson], {
                    preventDuplicates: true, theme: "facebook", onAdd: function (item) {

                    },
                    onDelete: function (item) {

                    }
                }
                );
        },
        error: function () {
            fnMsgAlert('info', 'Stockist Allocation', 'Error.');
        }

    });

}

function fnGetChildRegionWithDivision() {

    if ($('#hdnRegionCode').val() != "") {
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/StockistPollAllocation/GetChildRegionsWithDivision',
            data: 'regionCode=' + $('#hdnRegionCode').val(),
            success: function (response) {
                var jsRegion = response;

                sCR = response;
                // generate json for accompanist
                var cRegion = "[";
                for (var i = 0; i < jsRegion.length; i++) {
                    cRegion += "{label:" + '"' + "" + jsRegion[i].Region_Name + "" + '",' + "value:" + '"' + "" + jsRegion[i].Region_Code + "" + '"' + "}";
                    if (i < jsRegion.length - 1) {
                        cRegion += ",";
                    }
                }
                cRegion += "];";
                sCRAuto = eval(cRegion);
                autoComplete(sCRAuto, "txtRegion", "hdnRegion", 'autoTerritory');
            },
            error: function () {
                fnMsgAlert('info', 'Stockist Allocation', 'Error.');
            }
        });
    }
}

function fnResetStockistAllocation() {
    $(".stockist_token_input").tokenInput('clear');
    $(".product_token_input").tokenInput('clear');
    $(".token-input-dropdown-facebook").css('display', 'none');
    $("#txtEffectiveFrom").val("");
    $("#txtEffectiveTo").val("");
    $("input:radio[name=rdStatus]").removeAttr('checked');
    $("#rdEnable").attr('checked', 'checked');
    $("#hdnStockID").val();
    fnBindStockistSharingRatio();
}


function fnFillDivision(id) {
    if ($(id).val() != "") {
        var cnt = (id.id).split('_')[1];
        var divJson = jsonPath(sCR, "$.[?(@.Region_Code=='" + $("#hdnRegion_" + cnt).val() + "')]");
        if (divJson != false && divJson !== undefined && divJson.length > 0) {
            if (divJson[0].Division_Code != null && divJson[0].Division_Code != "") {
                $("#lblDivision_" + cnt).html(divJson[0].Division_Name);
                $("#hdnDivision_" + cnt).val(divJson[0].Division_Code);
            }
            else {
                $("#lblDivision_" + cnt).html("No Division");
                $("#hdnDivision_" + cnt).val("");
            }
        }
        else {
            $("#lblDivision_" + cnt).html("No Division");
            $("#hdnDivision_" + cnt).val("");
        }
    }
    else {
        $("#lblDivision_" + cnt).html("");
        $("#hdnDivision_" + cnt).val("");
    }
}

function fnValidateStockistAllocation() {
    $("#dvAjaxLoad").show();
    if ($('#hdnRegionCode').val() == "") {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Please select any Region.');
        $("#dvAjaxLoad").hide();
        return false;
    }

    if ($(".stockist_token_input").tokenInput('get').length == 0) {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Please select any Stockist.');
        $("#dvAjaxLoad").hide();
        return false;
    }
    if ($(".product_token_input").tokenInput('get').length == 0) {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Please select any Product.');
        $("#dvAjaxLoad").hide();
        return false;
    }

    var isTerritory = 0;
    var terrArry = new Array();
    var totalRatio = 0.0;
    for (var m = 0; m < $("#dvSharingRatio .SEnable").length; m++) {
        var txtId = $("#dvSharingRatio .SEnable .S1 input[type=text]")[m].id;

        if ($("#" + txtId).val() != "") {
            var hdnID = $("#dvSharingRatio .SEnable .S1 input[type=hidden]")[m].id;
            isTerritory++;

            // territory valid data check
            var divJson = jsonPath(sCR, "$.[?(@.Region_Code=='" + $("#" + hdnID).val() + "')]");
            if (divJson == false || divJson === undefined || divJson.length == 0) {
                fnMsgAlert('error', 'Stockist Pool Allocation', 'Please enter valid Territory.');
                $("#" + txtId).focus();
                $("#dvAjaxLoad").hide();
                return false;
            }

            // territory duplicate check
            if (jQuery.inArray($("#" + hdnID).val(), terrArry) === -1) {
                terrArry.push($("#" + hdnID).val());
            }
            else {
                fnMsgAlert('info', 'Sale Order Entry', 'You have entered the Territory more than one time.Please enter it for only one time. ');
                $("#" + txtId).focus();
                $("#dvAjaxLoad").hide();
                return false;
            }

            // ratio empty check
            if ($("#dvSharingRatio .SEnable .S3 input[type=text]")[m].value == "") {
                fnMsgAlert('error', 'Stockist Pool Allocation', 'Please enter Sharing ratio.');
                $("#dvSharingRatio .SEnable .S3 input[type=text]")[m].focus();
                $("#dvAjaxLoad").hide();
                return false;
            }

            // ratio float check
            if (isNaN($("#dvSharingRatio .SEnable .S3 input[type=text]")[m].value)) {
                fnMsgAlert('error', 'Stockist Pool Allocation', 'Please enter numeric value in Sharing ratio.');
                $("#dvSharingRatio .SEnable .S3 input[type=text]")[m].focus();
                $("#dvAjaxLoad").hide();
                return false;
            }
            else if ($("#dvSharingRatio .SEnable .S3 input[type=text]")[m].value == "0") {
                fnMsgAlert('error', 'Stockist Pool Allocation', 'Sharing ratio cannot be zero.');
                $("#dvSharingRatio .SEnable .S3 input[type=text]")[m].focus();
                $("#dvAjaxLoad").hide();
                return false;
            }
            else if (parseFloat($("#dvSharingRatio .SEnable .S3 input[type=text]")[m].value) < 0) {
                fnMsgAlert('error', 'Stockist Pool Allocation', 'Sharing ratio cannot be a negative value.');
                $("#dvSharingRatio .SEnable .S3 input[type=text]")[m].focus();
                $("#dvAjaxLoad").hide();
                return false;
            }

            //ratio 100 % check
            totalRatio += parseFloat($("#dvSharingRatio .SEnable .S3 input[type=text]")[m].value);
        }
    }

    // empty check
    if (isTerritory == 0) {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Please enter any one Territory.');
        $("#dvSharingRatio .SEnable .S1 input[type=text]")[0].focus();
        $("#dvAjaxLoad").hide();
        return false;
    }

    //ratio 100 % check
    if (parseFloat(totalRatio) != 100) {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Total Sharing ratio should be 100.');
        $("#dvAjaxLoad").hide();
        return false;
    }

    if ($("#txtEffectiveFrom").val() == "") {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Please enter Effective From.');
        $("#txtEffectiveFrom").focus();
        $("#dvAjaxLoad").hide();
        return false;
    }
    if ($("#txtEffectiveTo").val() == "") {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Please enter Effective To.');
        $("#txtEffectiveTo").focus();
        $("#dvAjaxLoad").hide();
        return false;
    }

    var effFrom = $("#txtEffectiveFrom").val().split('-')[1] + '-' + fngetMonthNumber($("#txtEffectiveFrom").val().split('-')[0]) + '-01';
    var effTo = $("#txtEffectiveTo").val().split('-')[1] + '-' + fngetMonthNumber($("#txtEffectiveTo").val().split('-')[0]) + '-' + fngetMonthLastDate($("#txtEffectiveTo").val());

    if ((new Date(effFrom) > new Date(effTo))) {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Please enter Effective from cannot be greater than Effective to.');
        $("#txtEffectiveTo").focus();
        $("#dvAjaxLoad").hide();
        return false;
    }

    if ($("input:radio[name=rdStatus]:checked").length == 0) {
        fnMsgAlert('error', 'Stockist Pool Allocation', 'Please select Status.');
        $("#dvAjaxLoad").hide();
        return false;
    }

    fnReadStockistPoolAllocation();
}

function fnReadStockistPoolAllocation() {
    var stockiestString = "";
    var productString = "";
    var territoryDetail = "";
    var stockObj = $(".stockist_token_input").tokenInput('get');
    var prodObj = $(".product_token_input").tokenInput('get');

    for (var s = 0; s < stockObj.length; s++) {
        stockiestString += stockObj[s].id + '^';
    }
    for (var p = 0; p < prodObj.length; p++) {
        productString += prodObj[p].id + '^';
    }

    for (var m = 0; m < $("#dvSharingRatio .SEnable").length; m++) {
        if ($("#dvSharingRatio .SEnable .S1 input[type=text]")[m].value != "") {
            territoryDetail += $("#dvSharingRatio .SEnable .S1 input[type=hidden]")[m].value + '^'; // terrirtory Code
            territoryDetail += $("#dvSharingRatio .SEnable .S2 input[type=hidden]")[m].value + '^'; // Division Code
            territoryDetail += $("#dvSharingRatio .SEnable .S3 input[type=text]")[m].value + '~'; //Sharing Ratio
        }
    }

    fnSaveStockistPoolAllocation(stockiestString, productString, territoryDetail);
}

function fnSaveStockistPoolAllocation(stockiestString, productString, territoryDetail) {
    var effFrom = $("#txtEffectiveFrom").val().split('-')[1] + '-' + fngetMonthNumber($("#txtEffectiveFrom").val().split('-')[0]) + '-01';
    var effTo = $("#txtEffectiveTo").val().split('-')[1] + '-' + fngetMonthNumber($("#txtEffectiveTo").val().split('-')[0]) + '-' + fngetMonthLastDate($("#txtEffectiveTo").val());
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/StockistPollAllocation/InsertStockistPoolAllocation',
        data: 'stockist=' + escape(stockiestString) + '&product=' + productString + '&territory=' + territoryDetail + '&from=' + effFrom + '&to=' + effTo + '&status=' + $("input:radio[name=rdStatus]:checked").val() + '&stockID=' + $("#hdnStockID").val() + '&baseRegion=' + $('#hdnRegionCode').val(),
        success: function (response) {
            if (response == "SUCCESS") {
                if ($("#hdnStockID").val() == "") {
                    fnMsgAlert('success', 'Stockist Pool Allocation', 'Saved successfully.');
                }
                else {
                    fnMsgAlert('success', 'Stockist Pool Allocation', 'Updated successfully.');
                    $('#hdnRegionCode').val($('#hdnRegionCode1').val());
                    fnBindProduct();
                    $(".stockist_token_input").tokenInput('clear');
                    $(".stockist_token_input").prev().detach();
                    fnBindStockist();//11
                }
                fnResetStockistAllocation();
                fnBindStockistAllocationSummary();
            }
            else {
                fnMsgAlert('error', 'Stockist Pool Allocation', 'Insertion Failed.' + response);
                return false;
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error2.' + e.Message);
        }
    });
}

function fnEditStockistAllocation(id) {

    $("#hdnStockID").val(id);
    var sharingMain = jsonPath(stckSummary, "$.Tables[0].Rows[?(@.Stockist_Share_Code=='" + id + "')]");

    $('#hdnRegionCode').val(sharingMain[0].Base_Region); // base code
    $(".stockist_token_input").tokenInput('clear');
    $(".product_token_input").tokenInput('clear');

    var stockist = "[";
    stockist += "{name:" + '"' + "" + sharingMain[0].Customer_Name + '(' + sharingMain[0].Region_Name + ')' + "" + '",' + "id:" + '"' + "" + sharingMain[0].Stockist_Code + '_' + sharingMain[0].Stockist_Region_Code + "" + '"' + "}";

    stockist += "];";
    stockistJson = eval(stockist);
    $(".stockist_token_input").prev().detach();
    $(".stockist_token_input").tokenInput(
        [stockistJson], {
            preventDuplicates: true, theme: "facebook", onAdd: function (item) {

            },
            onDelete: function (item) {

            }
        }
        );

    $(".stockist_token_input").tokenInput("add", { id: sharingMain[0].Stockist_Code + '_' + sharingMain[0].Stockist_Region_Code, name: sharingMain[0].Customer_Name + '(' + sharingMain[0].Region_Name + ')' });

    var product = "[";
    product += "{name:" + '"' + "" + sharingMain[0].Product_Name + "" + '",' + "id:" + '"' + "" + sharingMain[0].Product_Code + "" + '"' + "}";
    product += "];";
    productJson = eval(product);

    $(".product_token_input").prev().detach();
    $(".product_token_input").tokenInput(
        [productJson], {
            preventDuplicates: true, theme: "facebook", onAdd: function (item) {

            },
            onDelete: function (item) {

            }
        }
        );

    $(".product_token_input").tokenInput("add", { id: sharingMain[0].Product_Code, name: sharingMain[0].Product_Name });

    $(".token-input-dropdown-facebook").css('display', 'none');

    var sharingDetail = jsonPath(stckSummary, "$.Tables[1].Rows[?(@.Stockist_Share_Code=='" + id + "')]");
    var cont = "";

    cont = '<div class="SCommon">';
    cont += '<div class="S1 SsubHeader">Territory Name</div>';
    cont += '<div class="S2 SsubHeader">Division Name</div>';
    cont += '<div class="S3 SsubHeader">Share (in %)</div>';
    cont += '<div class="S4"></div>';
    cont += '</div>';

    for (var i = 1; i <= sharingDetail.length; i++) {
        cont += '<div class="SCommon SRow SEnable">';
        cont += '<div class="S1"><input type="text" class="autoTerritory" id="txtRegion_' + i + '" value="' + sharingDetail[i - 1].Region_Name + '" /><input type="hidden" id="hdnRegion_' + i + '"  value="' + sharingDetail[i - 1].Region_Code + '" /></div>';
        cont += '<div class="S2"><label class="divisionName" id="lblDivision_' + i + '">' + ((sharingDetail[i - 1].Division_Name == null) ? "No Division" : sharingDetail[i - 1].Division_Name) + '</label><input type="hidden" id="hdnDivision_' + i + '" value="' + ((sharingDetail[i - 1].Division_Code == null) ? " " : sharingDetail[i - 1].Division_Code) + '" /></div>';
        cont += '<div class="S3"><input type="text" class="number" value="' + sharingDetail[i - 1].Share_Percentage + '" /></div>';
        cont += '<div class="S4" style="cursor:pointer;" onclick="fnDeleteSharingRatio(this);">X</div>';
        cont += '</div>';
    }

    cont += '<div class="SCommon SRow SEnable">';
    cont += '<div class="S1"><input type="text" class="autoTerritory" id="txtRegion_' + i + '" /><input type="hidden" id="hdnRegion_' + i + '" /></div>';
    cont += '<div class="S2"><label class="divisionName" id="lblDivision_' + i + '"></label><input type="hidden" id="hdnDivision_' + i + '" /></div>';
    cont += '<div class="S3"><input type="text" class="number" /></div>';
    cont += '<div class="S4" style="cursor:pointer;" onclick="fnDeleteSharingRatio(this);">X</div>';
    cont += '</div>';

    rowCount = parseInt(sharingDetail.length) + 1;
    $("#dvSharingRatio").html(cont);
    fnEventBinder();
    fnGetChildRegionWithDivision();

    $("#txtEffectiveFrom").val(sharingMain[0].Effective_From);
    $("#txtEffectiveTo").val(sharingMain[0].Effective_To);

    $("input:radio[name=rdStatus]").removeAttr('checked');
    if (sharingMain[0].Record_Status == '1') {
        $("#rdEnable").attr('checked', 'checked');
    }
    else {
        $("#rdDisable").attr('checked', 'checked');
    }
}




function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 01;
    }
    if (monthName.toUpperCase() == "FEB") {
        return 02;
    }
    if (monthName.toUpperCase() == "MAR") {
        return 03;
    }
    if (monthName.toUpperCase() == "APR") {
        return 04;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 05;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 06;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 07;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 08;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 09;
    }
    if (monthName.toUpperCase() == "OCT") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC") {
        return 12;
    }
}

function fngetMonthLastDate(month) {
    var monthName = month.split('-')[0];
    var year = month.split('-')[1];

    if (monthName.toUpperCase() == "JAN") {
        return 31;
    }
    if (monthName.toUpperCase() == "FEB") {
        if ((parseInt(year) % 4) == 0) {
            return 29;
        }
        else {
            return 28;
        }
    }
    if (monthName.toUpperCase() == "MAR") {
        return 31;
    }
    if (monthName.toUpperCase() == "APR") {
        return 30;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 31;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 30;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 31;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 31;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 30;
    }
    if (monthName.toUpperCase() == "OCT") {
        return 31;
    }
    if (monthName.toUpperCase() == "NOV") {
        return 30;
    }
    if (monthName.toUpperCase() == "DEC") {
        return 31;
    }
}

function fnToggleTreeb() {
    if ($("#spnDivToggleb").html() == "Hide Filter") {

        $("#tblTrb").hide();
        $("#spnDivToggleb").html('Show Filter');
    }
    else if ($("#spnDivToggleb").html() == "Show Filter") {
        $("#tblTrb").show();
        $("#spnDivToggleb").html('Hide Filter');
    }
}


function fnInitialiseTokenInput() {
    var stockistJson = "", productJson = "";
    $(".stockist_token_input").tokenInput(
                    [stockistJson], {
                        preventDuplicates: true, theme: "facebook", onAdd: function (item) {

                        },
                        onDelete: function (item) {

                        }
                    }
                    );

    $(".product_token_input").tokenInput(
                   [productJson], {
                       preventDuplicates: true, theme: "facebook", onAdd: function (item) {

                       },
                       onDelete: function (item) {

                       }
                   }
                   );
}
