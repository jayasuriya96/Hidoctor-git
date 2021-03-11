//Created By: Sumathi
//Date: 23/12/2013


function fnAddOptionToSelect(id, text, value) {
    if ($.msie) {
        var option = document.createElement('option');
        jQuery(option).appendTo('#' + id);
        option.text = text;
        option.value = value;
    }
    else {
        $('#' + id).append("<option value='" + value + "'>" + text + "</option>");
    }
}

//Get RegionType
var division_rT
function fnGetRegionType() {
    $.ajax({
        url: '../HiDoctor_Master/ProductPriceMaster/GetRegionType',
        type: "POST",
        success: function (JsonResult) {
            division_rT = JsonResult;
            if (division_rT != null) {
                if (division_rT.length > 0) {
                    fnAddOptionToSelect("ddlRegionType", "-Select a RegionType-", "0");
                    for (var di = 0; di < division_rT.length; di++) {
                        fnAddOptionToSelect("ddlRegionType", division_rT[di].Region_Type_Name, division_rT[di].Region_Type_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlRegionType", "-No Division-", "0");
                }

            }
            else {
                fnAddOptionToSelect("ddlRegionType", "-No Division-", "0");
            }
        }
    });
}

var division_r
function fnChangeRegionType(regionTypecode) {
    $("#ddlRegion").empty();
    //$("#ddlRegion option").remove();
    $.ajax({
        url: '../HiDoctor_Master/ProductPriceMaster/GetRegionList',
        type: "POST",
        data: { 'regionTypecode': regionTypecode },
        success: function (JsonResult) {
            division_r = JsonResult;
            if (division_r != null) {
                if (division_r.length > 0) {
                    fnAddOptionToSelect("ddlRegion", "-Select a Region-", "0");
                    for (var di = 0; di < division_r.length; di++) {
                        fnAddOptionToSelect("ddlRegion", division_r[di].Region_Name, division_r[di].Region_Code);
                        if (regioncode_dd != '') {
                            $('#ddlRegion').val(regioncode_dd);
                        }
                    }
                }
                else {
                    fnAddOptionToSelect("ddlRegion", "-Select a Region-", "0");
                }

            }
            else {
                fnAddOptionToSelect("ddlRegion", "-Select a Region-", "0");
            }
        }
    });
}
//Get Region
$("#ddlRegionType").change(function () {
    var RegionTypeCode = $("#ddlRegionType option:selected").val();
    var RegionTypeName = $("#ddlRegionType option:selected").text();
    fnChangeRegionType(RegionTypeCode);
});

//Get Product
var division_P
function fnGetProduct() {
    $.ajax({
        url: '../HiDoctor_Master/ProductPriceMaster/GetProductList',
        type: "POST",
        success: function (JsonResult) {
            division_P = JsonResult;
            if (division_P != null) {
                if (division_P.length > 0) {
                    fnAddOptionToSelect("ddlProduct", "-Select a Product-", "0");
                    for (var di = 0; di < division_P.length; di++) {
                        fnAddOptionToSelect("ddlProduct", division_P[di].Product_Name, division_P[di].Product_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlProduct", "-No Division-", "0");
                }

            }
            else {
                fnAddOptionToSelect("ddlProduct", "-No Division-", "0");
            }
        }
    });
}

//Bind the Date with Html Table
function fnGetProductPricedetails() {
    $.ajax({
        url: '../HiDoctor_Master/ProductPriceMaster/GetProductPriceMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divProductPrice").html(result);
            }
        }
    });
}

function fnsubvalidate() {
    if ($('#ddlRegionType').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The RegionType');
        return false;
    }

    if ($('#ddlProduct').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The Product');
        return false;
    }

    if ($('#ddlRegion').val() == '0') {
        fnMsgAlert('info', 'Info', 'There is No RegionType for this REgion,Please Choose another Region');
        return false;
    }
    if (isNaN($("#txtprice").val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid Amount');
        return false;
    }

    if ($.trim($("#txtprice").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Price');
        return false;
    }

    if ($("#hdnMode").val() == "I") {
        var Productcode = $("#ddlProduct option:selected").val();
        var RegionCode = $("#ddlRegion option:selected").val();
        var ProductName = $("#ddlProduct option:selected").text();

        if (ProductName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if ($("#Product_Code" + i).html() == Productcode && $("#Region_Code" + i).html() == RegionCode) {
                        fnMsgAlert('info', 'Info', 'This Product is already mapped with this region');
                        return false;
                    }
                }
            }
        }
    }

    if ($("#hdnMode").val() == "E") {
        var Productcode = $("#ddlProduct option:selected").val();
        var RegionCode = $("#ddlRegion option:selected").val();

        if (ProductName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i < $("#tblsummary tr").length - 1 ; i++) {
                    if ($("#Product_Code" + i).html() != Productcode && $("#Region_Code" + i).html() == RegionCode) {
                        fnMsgAlert('info', 'Info', 'This Product is already mapped with this region');
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

//Submit
var effective_From
var effective_To
$("#btnsave").click(function () {
    var result = fnsubvalidate();
    if (result) {
        var RegionTypeCode = $("#ddlRegionType option:selected").val();
        var RegionTypeName = $("#ddlRegionType option:selected").text();

        var RegionCode = $("#ddlRegion option:selected").val();
        var RegionName = $("#ddlRegion option:selected").text();

        var ProductCode = $("#ddlProduct option:selected").val();
        var ProductName = $("#ddlProduct option:selected").text();
        
        var Effectivefrom = $("#txtEffectiveFrom").val();
        var EffectiveTo = $("#txtEffectiveTo").val();
        if (Effectivefrom) {
            var day = $("#txtEffectiveFrom").val().split('/')[0];
            var month = $('#txtEffectiveFrom').val().split('/')[1];
            var year = $('#txtEffectiveFrom').val().split('/')[2];
            var effective_From = year + '-' + month + '-' + day;
        }
        else {
            effective_From = "";
        }

        if (EffectiveTo) {
            var day = $("#txtEffectiveTo").val().split('/')[0];
            var month = $('#txtEffectiveTo').val().split('/')[1];
            var year = $('#txtEffectiveTo').val().split('/')[2];
            var effective_To = year + '-' + month + '-' + day;
        }
        else {
            effective_To = "";
        }
        var Price = $("#txtprice").val();

        $.ajax({
            url: '../HiDoctor_Master/ProductPriceMaster/InsertandUpdateProductprice',
            type: "POST",
            data: {
                'regionTypecode': RegionTypeCode, 'regionCode': RegionCode, 'productCode': ProductCode,

                'price': Price, 'effectiveFrom': effective_From, 'effectiveTo': effective_To, 'Mode': $("#hdnMode").val(), 'priceCodeval':

                $("#hdnPriceCodeval").val()
            },
            success: function (data) {
                if (data != '') {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            $("#ddlRegionType").val('0');
                            $("#ddlRegion").val('0');
                            $("#ddlProduct").val('0');
                            $("#txtprice").val('');
                            $("#txtEffectiveFrom").val('');
                            $("#txtEffectiveTo").val('');

                            $("#btnsave").val('Save');  //Button Value Change From Update To Save
                            $("#hdnMode").val("I");
                            fnGetProductPricedetails();
                        }
                        else {
                            fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                        }
                    }
                }
                else {
                    fnMsgAlert('info', 'Caution', 'Something went Wrong');
                }

            }
        });
    }
});

//Change status
function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Price_Status');
        var tblpricecode = obj.id.replace('C', 'Price_Code');
        var status = $("#" + tblchange).text();
        var priceCode = $("#" + tblpricecode).text();

        $.ajax({
            url: '../HiDoctor_Master/ProductPriceMaster/ChangestatusforProductPriceMaster',
            type: "POST",
            data: { 'status': status, 'priceCode': priceCode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'something went wrong');
                }
                fnGetProductPricedetails();
            }
        });
    }
}

//Edit
var regioncode_dd
function fnEdit(obj) {
    if (obj.id != null) {
        var tblPriceCode = obj.id.replace('E', 'Price_Code');
        var tblRegionTypeName = obj.id.replace('E', 'Region_Type_Name');
        var tblRegionTypecode = obj.id.replace('E', 'Region_Type_Code');
        var tblRegionName = obj.id.replace('E', 'Region_Name');
        var tblRegionCode = obj.id.replace('E', 'Region_Code');
        var tblProductName = obj.id.replace('E', 'Product_Name');
        var tblProductCode = obj.id.replace('E', 'Product_Code');
        var tblPrice = obj.id.replace('E', 'Price');
        var tblEffectiveFrom = obj.id.replace('E', 'Effective_From');
        var tblEffectiveTo = obj.id.replace('E', 'Effective_To');

        var PriceCode = $("#" + tblPriceCode).text();
        var RegionTypeName = $("#" + tblRegionTypeName).text();
        var RegionTypecode = $("#" + tblRegionTypecode).text();
        var RegionName = $("#" + tblRegionName).text();
        var RegionCode = $("#" + tblRegionCode).text();
        var ProductName = $("#" + tblProductName).text();
        var ProductCode = $("#" + tblProductCode).text();
        var Price = $("#" + tblPrice).text();
        var EffectiveFrom = $("#" + tblEffectiveFrom).text();
        var EffectiveTo = $("#" + tblEffectiveTo).text();
        regioncode_dd = RegionCode;
        $('#hdnPriceCodeval').val(PriceCode);
        $('#hdnRegionTypeCodeval').val(RegionTypecode);
        $('#ddlRegionType').val(RegionTypecode);
        $('#hdnRegionCodeval').val(RegionCode);
        fnChangeRegionType(RegionTypecode);
        $('#hdnproductCodeval').val(ProductCode);
        $('#ddlProduct').val(ProductCode);
        $('#txtprice').val(Price);
        $('#txtEffectiveFrom').val(EffectiveFrom);
        $('#txtEffectiveTo').val(EffectiveTo);

        $("#btnsave").val('Update');  //Button Value Change From Save To Update
        $("#hdnMode").val("E");
    }
}

$("#btncancel").click(function () {
    $("#ddlRegionType").val('0');
    $("#ddlRegion").val('0');
    $("#ddlProduct").val('0');
    $("#txtprice").val('');
    $("#txtEffectiveFrom").val('');
    $("#txtEffectiveTo").val('');

    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
    }
    else {
        $("#btnsave").val('Save');
    }
});