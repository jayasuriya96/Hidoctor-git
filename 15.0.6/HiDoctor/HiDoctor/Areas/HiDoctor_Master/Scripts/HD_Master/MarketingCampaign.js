var saleProd_g = "", sampleProd_g = "", jsonDoctorCount = "", Activities_g = ""; MCList = ''; ExistingCampaigns = ''; EditStatus = '';
var DocCountRegions = ''; MCProdList = '';
//var CompanyCode = '';
var RegionCode = '';
var UserCode = '';
var UserTypeCode = '';
var _MS_PER_DAY = 1000 * 60 * 60 * 24;

var MapToList = '';
var prodString = '<div id="dvsale_MAINNUM" class="col-lg-12  form-group dvsalebox" >';
prodString += '<div class="col-xs-12  form-group">';
prodString += '<div class="col-xs-6  form-group"><div class="col-xs-12"><div><label class="Productlabel">Product(Sales)</label></div><div class="col-xs-12 form-group" style="padding-left:0px !important;">';
prodString += '<input type="text" id="txtsale_MAINNUM" class="input-xlarge form-control autoSale ac_input" autocomplete="off"><input type="hidden" id="hdnsale_MAINNUM"><input type="hidden" id="hiddenflag_MAINNUM" value="0"/></div></div>';
prodString += '</div><div class="col-xs-6 form-group"><div class="col-xs-12"><div><label class="ROIlabel">Expected Sale Increase</label></div><div class="col-xs-6 paddng form-group">';
prodString += '<input type="number" id="ROI_MAINNUM" min="1" max="9999999" onkeypress="return fnValidateInputROI(id,event);" class="input-xlarge form-control"></div><div class="col-lg-1 paddng form-group" style="padding-left:5px !important;padding-top:5px;">';
prodString += '<label>%</label></div></div></div></div>';
//prodString += '<div class="col-lg-12  form-group">';
//prodString += '<div class="col-lg-2  form-group"><label class="Productlabel">Product(Sales)</label></div>';
//prodString += '<div class="col-lg-6 form-group"><input type="text" id="txtsale_MAINNUM" class="input-xlarge form-control autoSale" />';
//prodString += '<input type="hidden" id="hdnsale_MAINNUM"/></div>';
//prodString += '<div class="col-lg-1  form-group"><label class="ROIlabel">Expected Sale Increase</label></div>';
//prodString += '<div class="col-lg-2 paddng form-group"><input type="number" id="ROI_MAINNUM" min="1" max="9999999" onkeypress="return fnValidateInputROI(id,event);" class="input-xlarge form-control" />';
//prodString += '</div>';
//prodString += '<div class="col-lg-1 paddng form-group" style="padding-left:5px !important;padding-top:5px;"><label>%</label></div></div>';
prodString += '<div class="col-lg-12  form-group" style="margin-top:90px;">';
prodString += '<div  class="col-lg-12 table-responsive form-group" style="padding-left: 0px;">';
prodString += '<table id="sale-MAINNUM" class="table table-striped">';
prodString += '<tr class="form-group">';
prodString += '<td id="InptType" class="form-group">Input Type</td>';
prodString += '<td id="PRO_AC" class="form-group">Product (Promotional)/Activity Name</td>';
prodString += '<td id="VO" class="form-group">Visit Order</td>';
prodString += '<td id="Qty_Du" class="form-group">Quantity/Duration</td>';
prodString += '<td id="sDate" class="form-group">Start Date</td>';
prodString += '<td id="eDate"class="form-group">Due Date</td>';
prodString += '<td id="Bdgt_PRO_AC" class="form-group">Budget for Promotional Product/Activity</td>';
prodString += '</tr>';
prodString += '<tr class="form-group sample_MAINNUM_SUBNUM sample_MAINNUM" id="sample_MAINNUM_SUBNUM">';
prodString += '<td>';
prodString += '<select class="form-control mc" maxlength="25" id="inpttype_MAINNUM_SUBNUM" onchange="fnShowInputsOnselect(this.value,id);">';
prodString += '<option maxlength="25" value="0">Select Input Type</option>';
prodString += '<option maxlength="25" value="PI">Promotional</option>';
prodString += '<option maxlength="25" value="A">Activity</option>';
prodString += '</select></td>';
prodString += '</tr></table></div></div></div><div style="clear:both;"></div>';



var ProdString = '';

ProdString += '<td>';
ProdString += '<select class="form-control mc" maxlength="25" id="inpttype_MAINNUM_SUBNUM" onchange="fnShowInputsOnselect(this.value,id);">';
ProdString += '<option maxlength="25" value="0">Select Input Type</option>';
ProdString += '<option maxlength="25" value="PI">Promotional</option>';
ProdString += '<option maxlength="25" value="A">Activity</option>';
ProdString += '</select></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="text" id="txtsample_MAINNUM_SUBNUM" class="input-xlarge form-control autoSample" /><input type="hidden" id="hdnsample_MAINNUM_SUBNUM" /><input type="hidden" id="hdntype_MAINNUM_SUBNUM"  value="0"/><input type="hidden" id="hiddenflagsamp_MAINNUM_SUBNUM" value="0"/></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="number" id="txtvisitorder_MAINNUM_SUBNUM" min="1" max="99" class="input-mini form-control checkexpnumeric" onpaste="return false" onkeypress="return fnValidateInputVO(this,event);"/></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="number" id="txtQuantity_MAINNUM_SUBNUM" min="0" max="99999" class="input-mini form-control checkexpnumeric"  onpaste="return false" onkeypress="return fnValidateInputQty(this,event);"/></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="text" id="txtStartDate_MAINNUM_SUBNUM" class="input-mini form-control StartDate" readonly="readonly"  style="cursor:pointer !important;" /></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="text" id="txtDueDate_MAINNUM_SUBNUM" class="input-mini form-control DueDate" readonly="readonly"  style="cursor:pointer !important;" /></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="number" id="txtBudget_MAINNUM_SUBNUM" min="1" max="9999999999" class="input-mini form-control checkexpnumeric"  onpaste="return false" onkeypress="return fnValidateBudget(this,event);"/></td>';
ProdString += '<td id="remove_MAINNUM_SUBNUM" class="removerow" style="display:none;padding-top:15px !important;"><i onclick="RemoveRow(MAINNUM,SUBNUM);"  title="Remove Row" class="fa fa-times-circle" style="color:red;font-size:20px;"></i></td>';



var Prodstring = '';
Prodstring += '<td>';
Prodstring += '<select class="form-control mc" maxlength="25" id="inpttype_MAINNUM_SUBNUM" onchange="fnShowInputsOnselect(this.value,id);">';
Prodstring += '<option maxlength="25" value="0">Select Input Type</option>';
Prodstring += '<option maxlength="25" value="PI">Promotional</option>';
Prodstring += '<option maxlength="25" value="A">Activity</option>';
Prodstring += '</select></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="text" id="txtactivity_MAINNUM_SUBNUM" maxLength="150" class="input-xlarge form-control autactivity auto_activity" onblur="fnValidateAutofillMC(this); fnClose(this);" /><input type="hidden" id="hdnactivityval_MAINNUM_SUBNUM" value="0"><input type="hidden" id="hdntype_MAINNUM_SUBNUM"  value="1"/><input type="hidden" id="hiddenflagact_MAINNUM_SUBNUM" value="0"/></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="number" id="txtvisitorder_MAINNUM_SUBNUM" min="1" max="99" class="input-mini form-control checkexpnumeric"  onpaste="return false" onkeypress="return fnValidateInputVO(this,event);" /></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="number" id="txtQuantity_MAINNUM_SUBNUM" min="0" max="99999" title="Please Enter Duration for Activity" class="input-mini form-control checkexpnumeric" /></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="text" id="txtStartDate_MAINNUM_SUBNUM" class="input-mini form-control StartDate" readonly="readonly"  style="cursor:pointer !important;" /></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="text" id="txtDueDate_MAINNUM_SUBNUM" class="input-mini form-control DueDate" readonly="readonly"   style="cursor:pointer !important;"/></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="number" id="txtBudget_MAINNUM_SUBNUM" min="1" max="9999999999" class="input-mini form-control checkexpnumeric"  onpaste="return false" onkeypress="return fnValidateBudget(this,event);"/></td>';
Prodstring += '<td id="remove_MAINNUM_SUBNUM" class="removerow" style="display:none;padding-top:15px !important;"><i onclick="RemoveRow(MAINNUM,SUBNUM);"  title="Remove Row" class="fa fa-times-circle" style="color:red;font-size:20px;"></i></td>';


var DrpDwnString = '';
DrpDwnString += '<tr class="form-group sample_MAINNUM_SUBNUM sample_MAINNUM" id="sample_MAINNUM_SUBNUM">';
DrpDwnString += '<td>';
DrpDwnString += '<select class="form-control mc" maxlength="25" id="inpttype_MAINNUM_SUBNUM" onchange="fnShowInputsOnselect(this.value,id);">';
DrpDwnString += '<option maxlength="25" value="0">Select Input Type</option>';
DrpDwnString += '<option maxlength="25" value="PI">Promotional</option>';
DrpDwnString += '<option maxlength="25" value="A">Activity</option>';
DrpDwnString += '</select></td>';
DrpDwnString += '</tr>';


var sampleString = '<tr class="form-group sample-MAINNUM" >';
sampleString += '<td class="form-group">';
sampleString += '<input type="text" id="txtsample_MAINNUM_SUBNUM" class="input-xlarge form-control autoSample" /><input type="hidden" id="hdnsample_MAINNUM_SUBNUM" /></td>';
sampleString += '<td class="form-group">';
sampleString += '<input type="text" id="txtvisitorder_MAINNUM_SUBNUM" class="input-mini form-control checkexpnumeric" /></td>';
sampleString += '<td class="form-group">';
sampleString += '<input type="text" id="txtQuantity_MAINNUM_SUBNUM" class="input-mini form-control checkexpnumeric" /></td>';
sampleString += '<td class="form-group">';
sampleString += '<input type="number" id="txtDueDate_MAINNUM_SUBNUM" class="input-mini form-control checkexpnumeric" readonly="readonly" /></td>';
sampleString += '</tr>';

var mappedDoctorsJsonCount_g = "0";
var customer_Count_g = "";
var doctor_product_mapping_validation_g = "";
var mapped_doctor_count_g = "";

function fnGetCampaigns() {
    //debugger;
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    //if (regionTree.getActiveNode() != null) {
    //    var regionCode = regionTree.getActiveNode().data.key;
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetMarketingCampaigns/',
        type: "POST",
        data: "regionCode=" + regionCode,
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                var campaign = $("#cboCampaign");
                $("#cboCampaign option").remove();
                campaign.append("<option value=0>-Select Campaign-</option>");
                for (var i = 0; i < jsData.length; i++) {
                    campaign.append("<option value=" + jsData[i].Campaign_Code + ">" + jsData[i].Campaign_Name + "</option>");
                }
                //if (regionCode != null) {
                //    fnGetDoctorProducts();
                //}
                fnGetParentHierarchyRegions();

            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
    //}
}

function fnGetCMECampaigns() {
    debugger;
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    Method_params = ["CMEApi/GetCMECampaigns", CompanyCode, regionCode];
    CoreREST.get(null, Method_params, null, fnCampaignsSuccessCallback, fnCampaignsFailureCallback);
}
function fnCampaignsSuccessCallback(response) {
    debugger;
    if (response != '') {
        //jsData = eval('(' + jsData + ')');
        var campaign = $("#cboCMECampaign");
        $("#cboCMECampaign option").remove();
        campaign.append("<option value=0>-Select Campaign-</option>");
        for (var i = 0; i < response.list.length; i++) {
            campaign.append("<option value=" + response.list[i].Campaign_Code + ">" + response.list[i].Campaign_Name + "</option>");
        }
        fnGetCMEParentHierarchyRegions();

    }
}
function fnCampaignsFailureCallback() {

}
function fnOnChangeEventOfCMECampaigns() {
    fnGetCMEParentHierarchyRegions();
}
function fnGetCMEParentHierarchyRegions() {
    debugger;
    $.blockUI();
    var content = '';
    content += ' <option value="0">-Please Select Region To Map-</option>';
    var mappingType = $('input:radio[name=rdMapping]:checked').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    var campaignCode = "";
    campaignCode = $('#cboCMECampaign :selected').val();
    if (campaignCode == null || campaignCode == 0) {
        campaignCode = 0;
    }
    else {
        campaignCode = $('#cboCMECampaign :selected').val();
    }
    $.ajax({
        type: "GET",
        data: "mappingType=" + mappingType + "&typeofMapping=" + TypeOfMapping + "&regionCode=" + regionCode + "&campaignCode=" + campaignCode,
        url: "../HiDoctor_Master/MarketingCampaign/GetParentHierarchyByRegion",
        success: function (resp) {
            debugger;
            MapToList = resp;
            if (resp != null) {
                fnBindHierarchyHTML(resp);
            } else {
                $("#MapTo option").remove();
                $('#MapTo').html(content);
            }

        }
    });
}

function fnOnChangeEventOfCampaigns(value) {
    fnGetParentHierarchyRegions();
}
function fnGetParentHierarchyRegions() {
    //debugger;
    $.blockUI();
    var content = '';
    content += ' <option value="0">-Please Select Region To Map-</option>';
    var mappingType = $('input:radio[name=rdMapping]:checked').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    var campaignCode = "";
    campaignCode = $('#cboCampaign :selected').val();
    if (campaignCode == null || campaignCode == 0) {
        campaignCode = 0;
    }
    else {
        campaignCode = $('#cboCampaign :selected').val();
    }
    $.ajax({
        type: "GET",
        data: "mappingType=" + mappingType + "&typeofMapping=" + TypeOfMapping + "&regionCode=" + regionCode + "&campaignCode=" + campaignCode,
        url: "../HiDoctor_Master/MarketingCampaign/GetParentHierarchyByRegion",
        success: function (resp) {
            MapToList = resp;
            if (resp != null) {
                fnBindHierarchyHTML(resp);
            } else {
                $("#MapTo option").remove();
                $('#MapTo').html(content);
            }

        }
    });
}

function fnBindHierarchyHTML(resp) {
    //debugger;
    var content = '';
    content += ' <option value="0">-Please Select Region To Map-</option>';
    for (var i = 0; i < resp.lstRegions.length; i++) {
        var disjson = jsonPath(resp.lstUsers, "$.[?(@.Region_Code=='" + resp.lstRegions[i].Region_Code + "')]");
        var content1 = '';
        if (disjson == false) {
            content1 += 'VACANT';
        } else {
            for (var j = 0; j < disjson.length; j++) {
                content1 += '' + disjson[j].User_Name + " (" + disjson[j].User_Type_Name + ")" + '';
            }
        }

        content += '<option value=' + resp.lstRegions[i].Region_Code + '>' + resp.lstRegions[i].Region_Name + " (" + resp.lstRegions[i].Region_Type_Name + ")" + "-" + content1 + '</option>';
    }

    $('#MapTo').html(content);
    fnOptionAdjustment();

}
function fnOptionAdjustment() {
    // debugger;
    $('#MapTo option').each(function () {
        // debugger;
        var text = $(this).text();

        if (text.length > 120) {
            $(this).text(text.substr(0, 120) + '…')
        }
    });
    $.unblockUI();
}
function fnGetSelectedMCHeader() {
     debugger;
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    //var regionCode = regionTree.getActiveNode().data.key;
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetSelectedMCHeader/',
        type: "POST",
        data: "campaignCode=" + $("#cboCampaign").val() + "&regionCode=" + regionCode,
        success: function (jsonResult) {
            if (jsonResult != '') {
                jsonResult = eval('(' + jsonResult + ')');
                if (jsonResult.length > 0) {
                    doctor_product_mapping_validation_g = jsonResult[0].Doctor_Product_Mapping_Validation;
                    customer_Count_g = jsonResult[0].Customer_Count;
                    mapped_doctor_count_g = jsonResult[0].Mapped_Doctor_Count;
                }
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function fnGetSelectedCMEHeader() {
    debugger;
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    //var regionCode = regionTree.getActiveNode().data.key;
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetSelectedCMECHeader/',
        type: "POST",
        data: "campaignCode=" + $("#cboCMECampaign").val() + "&regionCode=" + regionCode,
        success: function (jsonResult) {
            if (jsonResult != '') {
                jsonResult = eval('(' + jsonResult + ')');
                if (jsonResult.length > 0) {
                    doctor_product_mapping_validation_g = jsonResult[0].Doctor_Product_Mapping_Validation;
                    customer_Count_g = jsonResult[0].Customer_Count;
                    mapped_doctor_count_g = jsonResult[0].Mapped_Doctor_Count;
                }
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function fnGetGrids() {
    debugger;
    $('#txtSearchKey').val('');
    fnGetDoctorProducts();
}
function fnGetDoctorProducts() {
    debugger;
    var prodprivval = '';
    var CampaignCode = '';
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    // var regionCode = regionTree.getActiveNode().data.key;
    var mappingType = $('input:radio[name=rdMapping]:checked').val();
    var mappingTo = $('#MapTo :selected').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    $('#dvMappingType').html('');
    //if (mappingType == "DOCTOR_PRODUCT") {
    //    $("#spnDoctorTable").html('Hide Doctors');
    //}
    //else {
    //    $("#spnDoctorTable").html('Hide Products');
    //}
    if ($('input:radio[name=rdTypeMap]:checked').val() == 'CME_MAP') {
        fnGetSelectedCMEHeader();
    }
    else {
        fnGetSelectedMCHeader();

    }


    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    if ($('input:radio[name=rdTypeMap]:checked').val() == 'CME_MAP') {
        CampaignCode = $("#cboCMECampaign").val();
        if (CampaignCode == "" || CampaignCode == null) {
            CampaignCode = 0;
        } else {
            CampaignCode = $("#cboCMECampaign").val();
        }
    }
    else {
        CampaignCode = $("#cboCampaign").val();
        if (CampaignCode == "" || CampaignCode == null) {
            CampaignCode = 0;
        } else {
            CampaignCode = $("#cboCampaign").val();
        }
    }
    var result = fnValidateInputs();
    debugger;
    if (result == true) {
        $.ajax({
            url: '../HiDoctor_Master/MarketingCampaign/GetDoctorProductTable/',
            type: "POST",
            data: "campaignCode=" + CampaignCode + "&mappingType=" + mappingType + "&regionCode=" + regionCode + "&productPriValue=" + prodprivval + "&SearchKey="
                + $.trim($("#txtSearchKey").val()) + "&mappingTo=" + mappingTo + "&typeOfMapping=" + TypeOfMapping,
            success: function (result) {
                if (result != '') {
                    if (result.split('$').length > 1) {
                        if (mappingType == "DOCTOR_PRODUCT") {
                            $("#dvMapping").html("<div id='dvDoctor' class='col-sm-6 table-responsive'></div><div class='col-sm-6 table-responsive' id='dvProduct'></div><div style='clear:both'></div>");
                            $('#txtSearchKey').attr('placeholder', 'Search By Product Name');
                        }
                        else {
                            $("#dvMapping").html("<div class='col-sm-6 table-responsive' id='dvProduct'></div><div id='dvDoctor' class='col-sm-6 table-responsive'></div><div style='clear:both'></div>");

                            if (privval != '') {
                                $('#txtSearchKey').attr('placeholder', 'Search By ' + privval + ' Name');
                            } else {
                                $('#txtSearchKey').attr('placeholder', 'Search By Doctor Name');
                            }
                        }
                        $("#dvDoctor").html(result.split('$')[0]);
                        $("#dvProduct").html(result.split('$')[1]);
                        $('#dvProdDocTbls').show();
                        $('#btnDPMSubmit').show();
                        $(".clsDecimal").keypress(function () { return fnIsNumeric(event) });
                        $(".clsDecimal").blur(function () { if (!fnCheckMaxLimit(this, "FLOAT")) { $(this).val('0'); } });
                        $("#main").unblock();

                        if (privval != '') {
                            $('.docLabel').html(privval);

                        } else {
                            $('.docLabel').html("Doctor");
                        }
                    }
                }
            },
            error: function () {
                $("#main").unblock();
            },
            complete: function () {
                $("#main").unblock();

            }
        });
    } else {
        $("#main").unblock();
    }

}

function fnValidatePriority(obj) {
    var rowNumber = $("#tblProduct tr").length;
    var id = obj.id;
    if ($(obj).val() != '') {
        if (isNaN($(obj).val())) {
            fnMsgAlert('info', 'Validate', 'Please enter numbers alone');
            $(obj).val('');
            return;
        }
        for (var i = 0; i < parseInt(rowNumber) ; i++) {
            if ($("#chkSelect_" + (parseInt(i) + 1)) != undefined) {
                if (id != "txtPriority_" + (parseInt(i) + 1)) {
                    if ($("#chkSelect_" + (parseInt(i) + 1)).attr('checked') == "checked") {

                        if ($.trim($(obj).val()) == $.trim($("#txtPriority_" + (parseInt(i) + 1)).val())) {
                            fnMsgAlert('info', 'Validate', 'Priority No. must be unique');
                            $(obj).val('');
                            return;
                        }
                    }
                }
            }
        }
    }
}
function fnValidateInputs() {
    //debugger;
    var flag = true;
    if ($('input:radio[name=rdTypeMap]:checked').val() == "") {
        fnMsgAlert('info', 'Info', 'Please select Type Of Mapping');
        $("#main").unblock();
        flag = false;
        return;
    }
    if ($('#MapTo :selected').val() == "" || $('#MapTo :selected').val() == 0) {
        fnMsgAlert('info', 'Info', 'Please select Map To.');
        $("#main").unblock();
        flag = false;
        return;
    }
    if ($('input:radio[name=rdTypeMap]:checked').val() == "MARK_MAP") {
        if ($('#cboCampaign :selected').val() == "" || $('#cboCampaign :selected').val() == 0) {
            fnMsgAlert('info', 'Info', 'Please select Campaign To Map.');
            $("#main").unblock();
            flag = false;
            return;
        }
    }
    return flag;
}


function fnSubmit() {
    debugger;
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    // var regionCode = regionTree.getActiveNode().data.key;
    var mappingType = $('input:radio[name=rdMapping]:checked').val();
    var mappingTo = $('#MapTo :selected').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    var productDetails = "";
    var doctorDetails = "";
    var flag = false;
    var selectedDoctor = "";
    var selectedProduct = "";
    var selectedDoctorCategory = "";
    var isAllowedDoctor = true;
    var result = fnValidateInputs();
    if (result == true) {
        if (mappingType == "DOCTOR_PRODUCT") {
            if ($('input:radio[name=rdSelect]:checked').val() != undefined && $('input:radio[name=rdSelect]:checked').val() != null
                        && $('input:radio[name=rdSelect]:checked').val() != '') {
                selectedDoctor = $('input:radio[name=rdSelect]:checked').val().split('_')[0];
                selectedDoctorCategory = $('input:radio[name=rdSelect]:checked').val().split('_')[1];
                $("input:checkbox[name=chkSelect]").each(function () {
                    var productCode = this.value;
                    if (this.checked) {
                        if (TypeOfMapping == "CME_MAP") {
                            var id = this.id;
                            flag = true;
                            productDetails += productCode + "^";
                            productDetails += $("#" + id.replace("chkSelect", "txtYield")).val() + "^";
                            if ($("#" + id.replace("chkSelect", "txtPotential")).val() == undefined) {
                                productDetails += 0 + "^";

                            }
                            else {
                                productDetails += $("#" + id.replace("chkSelect", "txtPotential")).val() + "^";

                            }
                            productDetails += $("#" + id.replace("chkSelect", "txtPriority")).val() + "^";
                        }
                        else {
                            var id = this.id;
                            flag = true;
                            productDetails += productCode + "^";
                            productDetails += $("#" + id.replace("chkSelect", "txtYield")).val() + "^";
                            productDetails += $("#" + id.replace("chkSelect", "txtPotential")).val() + "^";
                            productDetails += $("#" + id.replace("chkSelect", "txtPriority")).val() + "^";
                        }
                        //productDetails += "$";
                    }
                });
                if (!flag) {
                    if ($("#hdnMode").val() != "EDIT") {
                        fnMsgAlert('info', 'Info', 'Please select atleast one product');
                        return;
                    }
                }

                fnSubmitValues(regionCode, mappingTo, TypeOfMapping, mappingType, productDetails, doctorDetails, selectedDoctor, selectedDoctorCategory, selectedProduct);
            }
            else {
                if (privval != '') {
                    fnMsgAlert('info', 'Info', 'Please select atleast one  ' + privval + '');
                } else {

                    fnMsgAlert('info', 'Info', 'Please select atleast one Doctor');
                }
                return;
            }
        }
        else {
            selectedProduct = $('input:radio[name=rdSelect]:checked').val();
            var docCount = 0;
            if (selectedProduct != undefined && selectedProduct != null && selectedProduct != '') {
                //$("input:checkbox[name=chkSelect]").each(function () {
                //    if (this.checked) {
                //        docCount++;
                //    }
                //});
                $("input:checkbox[name=chkSelect]").each(function () {
                    var doctorCode = this.value.split('_')[0];
                    if (this.checked) {
                        var id = this.id;
                        flag = true;
                        doctorDetails += doctorCode + "^";
                        doctorDetails += $("#" + id.replace("chkSelect", "txtYield")).val() + "^";
                        if ($("#" + id.replace("chkSelect", "txtPotential")).val() == undefined) {
                            productDetails += 0 + "^";

                        }
                        else {
                            productDetails += $("#" + id.replace("chkSelect", "txtPotential")).val() + "^";

                        }
                        doctorDetails += $("#" + id.replace("chkSelect", "txtPotential")).val() + "^";
                        // doctorDetails += this.value.split('_')[1];
                        // doctorDetails += "$";
                    }
                });
                if (!flag) {
                    if ($("#hdnMode").val() != "EDIT") {
                        if (privval != '') {
                            fnMsgAlert('info', 'Info', 'Please select atleast one  ' + privval + '');

                        } else {
                            fnMsgAlert('info', 'Info', 'Please select atleast one Doctor');
                        }


                        return;
                    }
                }
                fnSubmitValues(regionCode, mappingTo, TypeOfMapping, mappingType, productDetails, doctorDetails, selectedDoctor, selectedDoctorCategory, selectedProduct);
            }
            else {
                fnMsgAlert('info', 'Info', 'Please select atleast one product');
                return;
            }
        }
    }
}

function fnSubmitValues(regionCode, mappingTo, TypeOfMapping, mappingType, productDetails, doctorDetails, selectedDoctor, selectedDoctorCategory, selectedProduct) {
    debugger;
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    if (TypeOfMapping == 'CME_MAP') {
        var CampaignCode = $("#cboCMECampaign").val();
    }
    else {
        var CampaignCode = $("#cboCampaign").val();
    }
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/InsertMCDoctorProductMapping/',
        type: "POST",
        data: "regionCode=" + regionCode + "&campaignCode=" + CampaignCode + "&mappingType=" + mappingType + "&MCProductDetails=" + productDetails
            + "&MCDoctorDetails=" + doctorDetails + "&doctorCode=" + selectedDoctor + "&selectedProductCode=" + selectedProduct + "&mappingTo=" + mappingTo + "&typeOfMapping=" + TypeOfMapping,
        success: function (result) {
            debugger;
            $("#main").unblock();
            if (result != '') {
                if (result.split(':')[0] == "SUCCESS") {
                    if (mappingType.toUpperCase() == "DOCTOR_PRODUCT") {
                        if (privval != "") {
                            var Result = result.split(':')[1];
                            Result = Result.replace('Doctor', privval);
                            fnMsgAlert('success', 'Success', Result);
                        } else {
                            fnMsgAlert('success', 'Success', result.split(':')[1]);
                        }
                    }
                    else {
                        if (privval != "") {
                            var Result = result.split(':')[1];
                            Result = Result.replace('Doctor', privval);
                            fnMsgAlert('success', 'Success', Result);
                        } else {
                            fnMsgAlert('success', 'Success', result.split(':')[1]);
                        }
                    }
                    $('#dvMappingType').html('');
                    $("#hdnMode").val('INSERT');
                    fnGetDoctorProducts();
                }
                else {
                    if (privval != "") {
                        var Result = result.split(':')[1];
                        Result = Result.replace('Doctor', privval);
                        fnMsgAlert('error', 'Error', Result);
                    } else {
                        fnMsgAlert('error', 'Error', result.split(':')[1]);
                    }

                }
            }
            else {
                if (privval != '') {
                    fnMsgAlert('info', 'Error', 'Error while mapping the ' + privval + ' and product');
                } else {
                    fnMsgAlert('info', 'Error', 'Error while mapping the doctor and product');
                }

            }

        },

        error: function () {
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}
function fnSelectAll() {
    //debugger;
    if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = false;
        });
    }
}


function fnHideDoctors() {
    //debugger;
    var mappingType = $('input:radio[name=rdMapping]:checked').val();
    if (mappingType == "DOCTOR_PRODUCT") {
        if ($("#spnDoctorTable").html() == "Hide Doctors") {
            $("#dvDoctor").hide();
            $("#dvProduct").removeClass('col-sm-6');
            $("#dvProduct").addClass('col-lg-12');
            $("#spnDoctorTable").html('Show Doctors');
        }
        else {
            $("#dvDoctor").show();
            $("#dvDoctor").addClass('col-sm-6');
            $("#dvProduct").removeClass('col-lg-12');
            $("#dvProduct").addClass('col-sm-6');
            $("#spnDoctorTable").html('Hide Doctors');
        }
    }
    else {
        if ($("#spnDoctorTable").html() == "Hide Products") {
            $("#dvProduct").hide();
            $("#dvDoctor").removeClass('col-sm-6');
            $("#dvDoctor").addClass('col-lg-12');
            $("#spnDoctorTable").html('Show Products');
        }
        else {
            $("#dvProduct").show();
            $("#dvProduct").addClass('col-sm-6');
            $("#dvDoctor").removeClass('col-lg-12');
            $("#dvDoctor").addClass('col-sm-6');
            $("#spnDoctorTable").html('Hide Products');
        }
    }
}

function fnGetSelectedDoctorName(doc, mode) {
    debugger;
    $("#hdnMode").val(mode);
    var doctorCode = doc.split('_')[0];
    $('#dvMappingType').html('Selected <span class="docLabel"></span> Name : ' + doc.split('^')[1]);
    $('#dvMappingType').show();
    if (privval != '') {
        $('.docLabel').html(privval);
    } else {
        $('.docLabel').html("Doctor");
    }
    if (mode == "EDIT") {
        fnGetMappedProducts(doc);
    }
    else {
        $("input:checkbox[name=chkSelectAll]").attr('checked', false);
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = false;
            var id = this.id;
            $("#" + id.replace("chkSelect", "txtYield")).val('');
            $("#" + id.replace("chkSelect", "txtYield")).removeClass('mappedPro');
            $("#" + id.replace("chkSelect", "txtPotential")).val('');
            $("#" + id.replace("chkSelect", "txtPotential")).removeClass('mappedPro');
            $("#" + id.replace("chkSelect", "txtPriority")).val('');
            $("#" + id.replace("chkSelect", "txtPriority")).removeClass('mappedPro');
        });
        //fnHideDoctors();
    }
}
function fnGetSelectedProductName(pro, mode) {
    //debugger;
    $("#hdnMode").val(mode);
    var productCode = pro.split('_')[0];
    $('#dvMappingType').html('Selected Product Name : ' + pro.split('_')[1]);
    $('#dvMappingType').show();
    if (mode == "EDIT") {
        fnGetMappedDoctors(pro);
    }
    else {
        $("input:checkbox[name=chkSelectAll]").attr('checked', false);
        $("input:checkbox[name=chkSelect]").each(function () {
            var doctorCode = this.value.split('_')[0];
            this.checked = false;
            var id = this.id;
            $("#" + id.replace("chkSelect", "txtYield")).val('');
            $("#" + id.replace("chkSelect", "txtPotential")).val('');
            $("#" + id.replace("chkSelect", "txtYield")).removeClass('mappedPro');
            $("#" + id.replace("chkSelect", "txtPotential")).removeClass('mappedPro');
        });
        //fnHideDoctors();
    }
}


function fnGetMappedProducts(doc) {
    debugger;
    $("#hdnMode").val('EDIT');
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    //var regionCode = regionTree.getActiveNode().data.key;
    var doctorCode = doc.split('_')[0];
    var mappingTo = $('#MapTo :selected').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    $('#dvMappingType').html('Selected <span class="docLabel"></span> Name : ' + doc.split('^')[1]);
    $('#dvMappingType').show();
    if (privval != '') {
        $('.docLabel').html(privval);

    } else {
        $('.docLabel').html("Doctor");
    }
    $('input[name=rdSelect][value="' + doc.split('^')[0] + '"]').attr('checked', true);
    // $("#spnDoctorTable").html('Show Doctors');
    //fnHideDoctors();
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    var CampaignCode = "";
    if (TypeOfMapping != 'CME_MAP') {
        CampaignCode = $("#cboCampaign").val();
        if (CampaignCode == "" || CampaignCode == null) {
            CampaignCode = 0;
        } else {
            CampaignCode = $("#cboCampaign").val();
        }
    }
    else {
        CampaignCode = $("#cboCMECampaign").val();
        if (CampaignCode == "" || CampaignCode == null) {
            CampaignCode = 0;
        } else {
            CampaignCode = $("#cboCMECampaign").val();
        }
    }
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetMCProductsByDoctor/',
        type: "POST",
        data: "regionCode=" + regionCode + "&doctorCode=" + doctorCode + "&campaignCode=" + CampaignCode + "&mappingTo=" + mappingTo + "&typeofMapping=" + TypeOfMapping,
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                //mappedProductsJson_g = jsData;
                $("input:checkbox[name=chkSelect]").each(function () {
                    var productCode = this.value;
                    var id = this.id;
                    var disJson = jsonPath(jsData, "$.[?(@.Product_Code=='" + productCode + "')]");
                    if (disJson != false && disJson != undefined) {
                        this.checked = true;
                        $("#" + id.replace("chkSelect", "txtYield")).val(disJson[0].Support_Quantity);
                        $("#" + id.replace("chkSelect", "txtYield")).addClass('mappedPro');
                        $("#" + id.replace("chkSelect", "txtPotential")).val(disJson[0].Potential_Quantity);
                        $("#" + id.replace("chkSelect", "txtPotential")).addClass('mappedPro');
                        if (disJson[0].Product_Priority_No == "0") {
                            $("#" + id.replace("chkSelect", "txtPriority")).val('');
                        }
                        else {
                            $("#" + id.replace("chkSelect", "txtPriority")).val(disJson[0].Product_Priority_No);
                        }
                        $("#" + id.replace("chkSelect", "txtPriority")).addClass('mappedPro');
                    }
                    else {
                        this.checked = false;
                        $("#" + id.replace("chkSelect", "txtYield")).val('');
                        $("#" + id.replace("chkSelect", "txtPotential")).val('');
                        $("#" + id.replace("chkSelect", "txtPriority")).val('');
                        $("#" + id.replace("chkSelect", "txtYield")).removeClass('mappedPro');
                        $("#" + id.replace("chkSelect", "txtPotential")).removeClass('mappedPro');
                        $("#" + id.replace("chkSelect", "txtPriority")).removeClass('mappedPro');
                    }
                });
                $("#main").unblock();
            }
        },
        error: function () {
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnViewDoctorProductMapping(doctorCode) {
    //debugger;
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    var mappingTo = $('#MapTo :selected').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    var CampaignCode = "";

    CampaignCode = $("#cboCampaign").val();
    if (CampaignCode == "" || CampaignCode == null) {
        CampaignCode = 0;
    } else {
        if ($('input:radio[name=rdTypeMap]:checked').val() == 'CME_MAP') {
            CampaignCode = $("#cboCMECampaign").val();
        }
        else {
            CampaignCode = $("#cboCampaign").val();
        }
    }
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetMCProductsByDoctor/',
        type: "POST",
        data: "regionCode=" + regionCode + "&doctorCode=" + doctorCode.split('_')[0] + "&campaignCode=" + CampaignCode + "&mappingTo=" + mappingTo + "&typeofMapping=" + TypeOfMapping,
        success: function (jsData) {
            var tblContent = "";
            if (jsData != '' && jsData != undefined) {
                jsData = eval('(' + jsData + ')');
                var mappedCount = jsData.length;
                if (TypeOfMapping == "CME_MAP") {
                    tblContent += '<div class="col-lg-12"> <div class="col-sm-6" style="font-weight:bold"><span class="docLabel"></span> Name : ' + doctorCode.split('_')[1]
                        + '</div><div class="col-sm-6" style="font-weight:bold">No of Products Mapped : ' + mappedCount + '</div></div></div><br/>';
                    tblContent += '<div class="col-lg-12 table-responsive"> <table class="table table-striped"><thead><tr><th>Product Name</th><th>Business Potential</th><th>Priority</th>';
                    tblContent += '<th>Mapped By</th> </tr> </thead><tbody>';
                    for (var i = 0; i < jsData.length; i++) {
                        tblContent += '<tr><td>' + jsData[i].Product_Name + '</td>';
                        tblContent += '<td>' + jsData[i].Support_Quantity + '</td>';
                        //tblContent += '<td>' + jsData[i].Potential_Quantity + '</td>';
                        if (jsData[i].Product_Priority_No != 0) {
                            tblContent += '<td>' + jsData[i].Product_Priority_No + '</td>';
                        } else {
                            tblContent += '<td></td>';
                        }

                        tblContent += '<td>' + jsData[i].Created_By + '</td>';
                        tblContent += '</tr>';
                    }
                    tblContent += '</tbody>';
                    tblContent += '</table>';
                    tblContent += '</div>';
                    tblContent += '<div style="clear: both;"></div>';
                }
                else {
                    tblContent += '<div class="col-lg-12"> <div class="col-sm-6" style="font-weight:bold"><span class="docLabel"></span> Name : ' + doctorCode.split('_')[1]
                        + '</div><div class="col-sm-6" style="font-weight:bold">No of Products Mapped : ' + mappedCount + '</div></div></div><br/>';
                    tblContent += '<div class="col-lg-12 table-responsive"> <table class="table table-striped"><thead><tr><th>Product Name</th><th>Prescriptions</th>';
                    tblContent += '<th>Potential Prescriptions</th><th>Priority</th><th>Mapped By</th> </tr> </thead><tbody>';
                    for (var i = 0; i < jsData.length; i++) {
                        tblContent += '<tr><td>' + jsData[i].Product_Name + '</td>';
                        tblContent += '<td>' + jsData[i].Support_Quantity + '</td>';
                        tblContent += '<td>' + jsData[i].Potential_Quantity + '</td>';
                        if (jsData[i].Product_Priority_No != 0) {
                            tblContent += '<td>' + jsData[i].Product_Priority_No + '</td>';
                        } else {
                            tblContent += '<td></td>';
                        }

                        tblContent += '<td>' + jsData[i].Created_By + '</td>';
                        tblContent += '</tr>';
                    }
                    tblContent += '</tbody>';
                    tblContent += '</table>';
                    tblContent += '</div>';
                    tblContent += '<div style="clear: both;"></div>';
                }
            }
            $('#dvDoctorMappedProducts').html(tblContent);
            if (privval != '') {
                $('.docLabel').html(privval);

            } else {
                $('.docLabel').html("Doctor");
            }
            $('#spnPopUpTitle').html('Mapped Product Details')
            $("#dvProductPopUp").overlay().load();
        }
    });
}


function fnViewProductDoctorMapping(productCode) {
    //debugger;

    var regionTree = $("#dvRegionTree").dynatree("getTree");
    var mappingTo = $('#MapTo :selected').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    var CampaignCode = "";

    CampaignCode = $("#cboCampaign").val();
    if (CampaignCode == "" || CampaignCode == null) {
        CampaignCode = 0;
    } else {
        if ($('input:radio[name=rdTypeMap]:checked').val() == "CME_MAP") {
            CampaignCode = $("#cboCMECampaign").val();
        }
        else {
            CampaignCode = $("#cboCampaign").val();

        }
    }
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetMCDoctorsByProduct/',
        type: "POST",
        data: "regionCode=" + regionCode + "&productCode=" + productCode.split('_')[0] + "&campaignCode=" + CampaignCode + "&mappingTo=" + mappingTo + "&typeofMapping=" + TypeOfMapping,
        success: function (jsData) {
            var tblContent = "";
            if (jsData != '' && jsData != undefined) {
                jsData = eval('(' + jsData + ')');
                var mappedCount = jsData.length;
                if ($('input:radio[name=rdTypeMap]:checked').val() == "CME_MAP") {
                    //   tblContent += '<div class="col-lg-12" style="clear:both">';
                    tblContent += '<div class="col-lg-12"> <div class="col-sm-6" style="font-weight:bold">Product Name : ' + productCode.split('_')[1]
                     + '</div><div class="col-sm-6" style="font-weight:bold">No of  <span class="docLabel"></span> Mapped : ' + mappedCount + '</div></div></div><br/>';
                    tblContent += '<div class="col-lg-12 table-responsive"> <table class="table table-striped"><thead><tr> <th> <span class="docLabel"></span> Name</th><th>MDL Number</th>';
                    tblContent += '<th>Business Potential</th><th>Mapped By</th> </tr> </thead><tbody>';
                    for (var i = 0; i < jsData.length; i++) {
                        tblContent += '<tr><td>' + jsData[i].Customer_Name + '</td>';
                        tblContent += ' <td>' + jsData[i].MDL_Number + '</td>';
                        if (jsData[i].Support_Quantity != 0) {
                            tblContent += '<td>' + jsData[i].Support_Quantity + '</td>';
                        } else {
                            tblContent += '<td></td>';
                        }
                        //if (jsData[i].Potential_Quantity != 0) {
                        //    tblContent += '<td>' + jsData[i].Potential_Quantity + '</td>';
                        //} else {
                        //    tblContent += '<td></td>';
                        //}
                        tblContent += '<td>' + jsData[i].Created_By + '</td></tr>';
                    }
                    tblContent += '</tbody>';
                    tblContent += '</table>';
                    tblContent += '</div>';
                    tblContent += '<div style="clear: both;"></div>';
                }
                else {
                    tblContent += '<div class="col-lg-12"> <div class="col-sm-6" style="font-weight:bold">Product Name : ' + productCode.split('_')[1]
                                      + '</div><div class="col-sm-6" style="font-weight:bold">No of  <span class="docLabel"></span> Mapped : ' + mappedCount + '</div></div></div><br/>';
                    tblContent += '<div class="col-lg-12 table-responsive"> <table class="table table-striped"><thead><tr> <th> <span class="docLabel"></span> Name</th><th>MDL Number</th>';
                    tblContent += '<th>Prescriptions</th> <th>Potential Prescriptions</th><th>Mapped By</th> </tr> </thead><tbody>';
                    for (var i = 0; i < jsData.length; i++) {
                        tblContent += '<tr><td>' + jsData[i].Customer_Name + '</td>';
                        tblContent += ' <td>' + jsData[i].MDL_Number + '</td>';
                        if (jsData[i].Support_Quantity != 0) {
                            tblContent += '<td>' + jsData[i].Support_Quantity + '</td>';
                        } else {
                            tblContent += '<td></td>';
                        }
                        if (jsData[i].Potential_Quantity != 0) {
                            tblContent += '<td>' + jsData[i].Potential_Quantity + '</td>';
                        } else {
                            tblContent += '<td></td>';
                        }
                        tblContent += '<td>' + jsData[i].Created_By + '</td></tr>';
                    }
                    tblContent += '</tbody>';
                    tblContent += '</table>';
                    tblContent += '</div>';
                    tblContent += '<div style="clear: both;"></div>';
                }
            }
            if (privval != '') {
                $('#spnPopUpTitle').html('Mapped ' + privval + ' Details');
            } else {
                $('#spnPopUpTitle').html('Mapped Doctor Details');
            }

            $('#dvDoctorMappedProducts').html(tblContent)
            if (privval != '') {
                $('.docLabel').html(privval);

            } else {
                $('.docLabel').html("Doctor");
            }
            $("#dvProductPopUp").overlay().load();
        }
    });
}


function fnDeleteDPMapping(docCode, campCode, docName) {
    //debugger;
    var content = '';
    var Content = '';
    if ($('input:radio[name=rdTypeMap]:checked').val() == 'CME_MAP') {
        var Campaign_Name = $('#cboCMECampaign :selected').text();
    }
    else {
        var Campaign_Name = $('#cboCampaign :selected').text();
    }
    if (campCode == '' || campCode == 0) {
        Content += 'Are you sure?Do to Want to Delete Mapped Products for the "' + docName + '"';
        $('#deleteMappingBody').html(Content);
        content += '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnDeleteDoctorProdMap(\'' + docCode + '\',\'' + campCode + '\');">Yes</button>';
        $('#confrmdelte').html(content);
        $('#DeleteModal').modal('show');
    }
    else {
        if ($('input:radio[name=rdTypeMap]:checked').val() == 'CME_MAP') {
            Content += 'Are you sure?Do to Want to Delete Mapped Products for the "' + docName + '" for the selected CME Campaign "' + Campaign_Name + '"';
        }
        else {
            Content += 'Are you sure?Do to Want to Delete Mapped Products for the "' + docName + '" for the selected Marketing Campaign "' + Campaign_Name + '"';
        }
        $('#deleteMappingBody').html(Content);
        content += '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnDeleteDoctorProdMap(\'' + docCode + '\',\'' + campCode + '\');">Yes</button>';
        $('#confrmdelte').html(content);
        $('#DeleteModal').modal('show');
    }
}

function fnDeleteDoctorProdMap(doccode, campcode) {
    //debugger;
    var mappingTo = $('#MapTo :selected').val();


    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    $.ajax({
        type: "DELETE",
        url: "../HiDoctor_Master/MarketingCampaign/DoctorProdMappingDelete",
        data: "regionCode=" + regionCode + "&doctorCode=" + doccode + "&campaignCode=" + campcode + "&mappingTo=" + mappingTo + "&typeofMapping=" + TypeOfMapping,
        success: function (resp) {
            console.log(resp);
            fnGetDoctorProducts();
        }
    });
}



function fnDeletePDMapping(prodCode, campCode, prdName) {
    //debugger;
    var content = '';
    var Content = '';
    if ($('input:radio[name=rdTypeMap]:checked').val() == 'CME_MAP') {
        var Campaign_Name = $('#cboCMECampaign :selected').text();
    }
    else {
        var Campaign_Name = $('#cboCampaign :selected').text();
    }
    if (campCode == '' || campCode == 0) {
        Content += 'Are you sure?Do to Want to Delete Mapped <span class="docLabel"></span> for the ' + prdName + '';
        $('#deleteMappingBody').html(Content);
        if (privval != '') {
            $('.docLabel').html(privval);

        } else {
            $('.docLabel').html("Doctor");
        }
        content += '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnDeleteProdDoctorMap(\'' + prodCode + '\',\'' + campCode + '\')">Yes</button>';
        $('#confrmdelte').html(content);
        $('#DeleteModal').modal('show');
    }
    else {
        if ($('input:radio[name=rdTypeMap]:checked').val() == 'CME_MAP') {
            Content += 'Are you sure?Do to Want to Delete Mapped <span class="docLabel"></span> for the ' + prdName + ' for the selected CME ' + Campaign_Name + '';

        }
        else {
            Content += 'Are you sure?Do to Want to Delete Mapped <span class="docLabel"></span> for the ' + prdName + ' for the selected Marketing Campaign ' + Campaign_Name + '';

        }
        $('#deleteMappingBody').html(Content);
        if (privval != '') {
            $('.docLabel').html(privval);

        } else {
            $('.docLabel').html("Doctor");
        }
        content += '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnDeleteProdDoctorMap(\'' + prodCode + '\',\'' + campCode + '\')">Yes</button>';
        $('#confrmdelte').html(content);
        $('#DeleteModal').modal('show');
    }
}

function fnDeleteProdDoctorMap(prodCode, campcode) {
    // debugger;
    var mappingTo = $('#MapTo :selected').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    $.ajax({
        type: "DELETE",
        url: "../HiDoctor_Master/MarketingCampaign/ProdDoctorMappingDelete",
        data: "regionCode=" + regionCode + "&productCode=" + prodCode + "&campaignCode=" + campcode + "&mappingTo=" + mappingTo + "&typeofMapping=" + TypeOfMapping,
        success: function (resp) {
            console.log(resp);
            fnGetDoctorProducts();
        }
    });
}

function fnGetMappedDoctors(pro) {
    //debugger;
    $("#hdnMode").val("EDIT");
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    var regionCode = regionTree.getActiveNode().data.key;
    var productCode = pro.split('_')[0];
    var mappingType = $('input:radio[name=rdMapping]:checked').val();
    var mappingTo = $('#MapTo :selected').val();
    var TypeOfMapping = $('input:radio[name=rdTypeMap]:checked').val();
    $('#dvMappingType').html('Selected Product Name : ' + pro.split('_')[1]);
    $('#dvMappingType').show();
    $('input[name=rdSelect][value="' + pro.split('_')[0] + '"]').attr('checked', true);
    if ($('input:radio[name=rdTypeMap]:checked').val() != 'CME_MAP') {
        var Campaign_Code = $("#cboCampaign").val();
    }
    else {
        var Campaign_Code = $("#cboCMECampaign").val();
    }
    // $("#spnDoctorTable").html('Show Products');
    // fnHideDoctors();
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetMCDoctorsByProduct/',
        type: "POST",
        data: "regionCode=" + regionCode + "&productCode=" + productCode + "&campaignCode=" + Campaign_Code + "&mappingTo=" + mappingTo + "&typeofMapping=" + TypeOfMapping,
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                // mappedDoctorsJsonCount_g = jsData;
                mappedDoctorsJsonCount_g = 0;
                $("input:checkbox[name=chkSelect]").each(function () {
                    var customerCode = this.value.split('_')[0];
                    var id = this.id;
                    var disJson = jsonPath(jsData, "$.[?(@.Customer_Code=='" + customerCode + "')]");
                    if (disJson != false && disJson != undefined) {
                        this.checked = true;
                        mappedDoctorsJsonCount_g = parseInt(mappedDoctorsJsonCount_g) + 1;
                        $("#" + id.replace("chkSelect", "txtYield")).val(disJson[0].Support_Quantity);
                        $("#" + id.replace("chkSelect", "txtPotential")).val(disJson[0].Potential_Quantity);
                        $("#" + id.replace("chkSelect", "txtYield")).addClass('mappedPro');
                        $("#" + id.replace("chkSelect", "txtPotential")).addClass('mappedPro');
                    }
                    else {
                        this.checked = false;
                        $("#" + id.replace("chkSelect", "txtYield")).val('');
                        $("#" + id.replace("chkSelect", "txtPotential")).val('');
                        $("#" + id.replace("chkSelect", "txtYield")).removeClass('mappedPro');
                        $("#" + id.replace("chkSelect", "txtPotential")).removeClass('mappedPro');
                    }
                });
                $("#main").unblock();
            }
        },
        error: function () {
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

//**************** START - MARKETING CAMPAIGN ************************************//
function fnLoadMarketingCampaignDefiner(regionCode) {
    ExistingCampaigns = '';
    debugger;
    $.blockUI();
    //var regionCode = $('#hdnRegionCode').val();
    var content = '';
    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetMarketingCampaignFormData',
        success: function (response) {
            console.log(response);
            if (response != "" && response != null) {
                var jData = response;
                jData = jData.data;

                if (jData !== undefined && jData.length > 0) {

                    // Bind Entity
                    //$("#ddlCategory").append("<option value=0>-Category-</option>");
                    if (jData[0].Data != undefined && jData[0].Data.length > 0) {
                        for (var i = 0; i < jData[0].Data.length; i++) {
                            content += "<option value=" + jData[0].Data[i].Region_Type_Code + ">" + jData[0].Data[i].Region_Type_Name + '(' + jData[0].Data[i].User_Type_Name + ')' + "</option>";
                        }
                        $("#ddlCategory").html(content);
                        //$("#ddlsurveyusers").html(content);
                    }
                    $("#ddlCategory").multiselect("destroy").multiselect().multiselectfilter();
                    $("#ddlCategory").multiselect({
                        noneSelectedText: '-Campaign Driven By-'
                    }).multiselectfilter();
                    var Content1 = '';
                    if (jData[0].Data != undefined && jData[0].Data.length > 0) {
                        for (var i = 0; i < jData[0].Data.length; i++) {
                            Content1 += "<option value=" + jData[0].Data[i].Region_Type_Code + ">" + jData[0].Data[i].Region_Type_Name + '(' + jData[0].Data[i].User_Type_Name + ')' + "</option>";
                        }
                        // $("#ddlCategory").html(content);
                        $("#ddlsurveyusers").html(Content1);
                    }
                    $("#ddlsurveyusers").multiselect("destroy").multiselect().multiselectfilter();
                    $("#ddlsurveyusers").multiselect({
                        noneSelectedText: '-Survey taken by-'
                    }).multiselectfilter();


                    // Bind Doctor Category
                    //$("#ddlDocCategory").append("<option value=0>-Doctor Category-</option>");
                    if (jData[1].Data != undefined && jData[1].Data.length > 0) {
                        content = '';
                        for (var i = 0; i < jData[1].Data.length; i++) {
                            content += "<option value=" + jData[1].Data[i].Category_Code + ">" + jData[1].Data[i].Category_Name + "</option>";
                        }
                        $("#ddlDocCategory").html(content);
                    }
                    $("#ddlDocCategory").multiselect("destroy").multiselect().multiselectfilter();
                    $("#ddlDocCategory").multiselect({
                        noneSelectedText: '-Customer Category-'
                    }).multiselectfilter();


                    // Bind Doctor Speciality
                    //$("#ddlSpeciality").append("<option value=0>-Speciality-</option>");
                    if (jData[2].Data != undefined && jData[2].Data.length > 0) {
                        content = '';
                        for (var i = 0; i < jData[2].Data.length; i++) {
                            content += "<option value=" + jData[2].Data[i].Speciality_Code + ">" + jData[2].Data[i].Speciality_Name + "</option>"
                        }
                        $("#ddlSpeciality").html(content);
                    }
                    $("#ddlSpeciality").multiselect("destroy").multiselect().multiselectfilter();
                    $("#ddlSpeciality").multiselect({
                        noneSelectedText: '-Speciality-'
                    }).multiselectfilter();

                    //Sale product autofill
                    var saleProd = "[";
                    for (var i = 0; i < jData[3].Data.length; i++) {
                        saleProd += "{label:" + '"' + "" + jData[3].Data[i].Product_Name + "" + '",' + "value:" + '"' + "" + jData[3].Data[i].Product_Code + "" + '"' + "}";
                        if (i < jData[3].Data.length - 1) {
                            saleProd += ",";
                        }
                    }
                    saleProd += "];";
                    saleProd_g = eval(saleProd);

                    // Sample product autofill
                    var sampleProd = "[";
                    for (var i = 0; i < jData[4].Data.length; i++) {
                        sampleProd += "{label:" + '"' + "" + jData[4].Data[i].Product_Name + "" + '",' + "value:" + '"' + "" + jData[4].Data[i].Product_Code + "" + '"' + "}";
                        if (i < jData[4].Data.length - 1) {
                            sampleProd += ",";
                        }
                    }
                    sampleProd += "];";
                    sampleProd_g = eval(sampleProd);
                    fnCreateProductTable("LOAD");
                }
            }

            //$.unblockUI();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Failed to load details.Please try After sometime.');
            $.unblockUI();
        },
        complete: function (e) {
            fnGetRegionTreeByRegionWithCheckBoxMC(Sel_Region_Code, "treebody", "");
        }
    });

}


//For Approval
function fnShowInputsOnselect(value, id) {
    // debugger;
    var DPM_Count = $("#hdnMappedDoctorCount").val();
    if (value == "PI") {

        var mainId = id.split('_')[1];
        var subId = id.split('_')[2];
        var mainid = mainId;
        var subid = subId;
        $('.sample_' + mainId + '_' + subId).empty();
        // mainid--;
        subid--;
        var prodStr = ProdString.replace(/MAINNUM/g, mainId);
        prodStr = prodStr.replace(/SUBNUM/g, subId);

        $('.sample_' + mainId + '_' + subId).append(prodStr);
        $('#inpttype_' + mainId + '_' + subId).val("PI");
        autoComplete(sampleProd_g, "txtsample", "hdnsample", 'autoSample');
        if (EditStatus == 'Approved' || EditStatus == 'Applied') {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).hide();
        } else if (EditStatus == 'UnApproved' && DPM_Count > 0) {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).hide();
        } else {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).show();
        }
        fnMarketingCampaignEventBinder();
    } else if (value == "A") {

        var mainId = id.split('_')[1];
        var subId = id.split('_')[2];

        $('.sample_' + mainId + '_' + subId).empty();
        var mainid = mainId;
        var subid = subId;
        //mainid--;
        subid--;

        $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
        $("#remove_" + mainid + "_" + subid).show();
        var prodStr = Prodstring.replace(/MAINNUM/g, mainId);
        prodStr = prodStr.replace(/SUBNUM/g, subId);
        $('.sample_' + mainId + '_' + subId).append(prodStr);
        $('#inpttype_' + mainId + '_' + subId).val("A");
        //fnGetActivitylst();  
        if (EditStatus == 'Approved' || EditStatus == 'Applied') {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).hide();
        } else if (EditStatus == 'UnApproved' && DPM_Count > 0) {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).hide();
        } else {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).show();
        }
        fnMarketingCampaignEventBinder();
    }
    else if (value == 0) {
        var mainId = id.split('_')[1];
        var subId = id.split('_')[2];
        $('.sample_' + mainId + '_' + subId).empty();
        var mainid = mainId;
        var subid = subId;
        //amainid--;
        subid--;
        if (EditStatus == 'Approved' || EditStatus == 'Applied') {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).hide();
        } else if (EditStatus == 'UnApproved' && DPM_Count > 0) {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).hide();
        } else {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", true);
            $("#remove_" + mainid + "_" + subid).show();
        }

        var prdstr = DrpDwnString.replace(/MAINNUM/g, mainId);
        prdstr = prdstr.replace(/SUBNUM/g, subId);
        $('.sample_' + mainId + '_' + subId).append(prdstr);
        $('#inpttype_' + mainId + '_' + subId).val("0");



        fnMarketingCampaignEventBinder();
        return false;
    }
}

function fnGetActivities() {
    //debugger;
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/MarketingCampaign/GetActivities",
        data: "",
        success: function (resp) {
            console.log(resp);
            var Activities = "["
            for (var i = 0; i < resp.length; i++) {
                Activities += "{label:" + '"' + "" + resp[i].Activity_Name + "" + '",' + "value:" + '"' + "" + resp[i].Activity_Id + "" + '"' + "}";
                if (i < resp.length - 1) {
                    Activities += ",";
                }
            }
            Activities += "];";
            Activities_g = eval(Activities);;
        }
    });

}

function fnCreateProductTable(id) {
    //debugger;
    // $.blockUI();
    if (id == "LOAD") {
        var mainId = 0;
    }
    else {
        var mainId = parseInt(id.id.split('_')[1]);
    }
    var count = $(".dvsalebox").length;
    if (count == mainId) {
        count = count + 1;
        var prodStr = prodString.replace(/MAINNUM/g, count);
        prodStr = prodStr.replace(/SUBNUM/g, 1);
        //prodStr = prodStr.replace(/mainnum/g, 1);
        $("#dvproduct").append(prodStr);
        autoComplete(saleProd_g, "txtsale", "hdnsale", 'autoSale');
        fnMarketingCampaignEventBinder();
        var isVisible = $('#usertree').is(':visible');
        if (isVisible == true) {
            $('.dvsalebox').removeClass('col-lg-12');
            $('.dvsalebox').addClass('col-lg-12');
        } else {
            $('.dvsalebox').removeClass('col-lg-12');
            $('.dvsalebox').addClass('col-lg-12');
        }
    }
    //$.unblockUI();
    //fnGetAllRegionUsers(Sel_Region_Code);
    //fnRegionBindTreeAlreadySelected();
}
function RemoveRow(mainId, subId) {
    debugger;
    var samp_lngth = $('.sample_' + mainId).length;
    if (samp_lngth == 1) {
        $("#inpttype_" + mainid + "_" + subid).attr("disabled", false);
        $("#remove_" + mainid + "_" + subid).hide();
    } else {
        $('.sample_' + mainId + '_' + subId).remove();
    }

}

function fnCreateSampleProductNewRow(id) {
    // debugger;
    var mainId = id.id.split('_')[1];
    var subId = id.id.split('_')[2];
    var count = $(".sample_" + mainId).length;
    var MaxId = $("#sale-" + mainId + " tr:last").get(0).id;
    MaxId = MaxId = MaxId.split('_')[2];
    if (MaxId == parseInt(subId)) {
        var NxtId = Number(MaxId);
        NxtId = NxtId + 1;
        var prodStr = DrpDwnString.replace(/MAINNUM/g, mainId);
        prodStr = prodStr.replace(/SUBNUM/g, NxtId);
        //  prodStr = prodStr.replace(/mainnum/g, count);
        $("#sale-" + mainId).append(prodStr);
        autoComplete(sampleProd_g, "txtsample", "hdnsample", 'autoSample');
        var isVisible = $('#usertree').is(':visible');
        if (isVisible == true) {
            $('.dvsalebox').removeClass('col-lg-12');
            $('.dvsalebox').addClass('col-lg-12');
        } else {
            $('.dvsalebox').removeClass('col-lg-12');
            $('.dvsalebox').addClass('col-lg-12');
        }
        fnMarketingCampaignEventBinder();
    }
}
function fnDueDate(Id) {
    var SDate = '';
    var EDate = '';
    if ($('#txtStartDate').val() != "" && $('#txtEndDate').val() != "") {
        var SDate = $('#txtStartDate').val();
        SDate = SDate.split('/')[2] + '/' + SDate.split('/')[1] + '/' + SDate.split('/')[0];
        var EDate = $('#txtEndDate').val();
        EDate = EDate.split('/')[2] + '/' + EDate.split('/')[1] + '/' + EDate.split('/')[0];
    }

    //if (SDate != "" && EDate != "") {
    //    $("#" + Id.id).datepicker("destroy");
    //    $("#" + Id.id).datepicker({
    //        dateFormat: 'dd/mm/yy',
    //        numberOfMonths: 1,
    //        minDate: new Date(SDate),
    //        maxDate: new Date(EDate),
    //        changeMonth: true,
    //        changeYear: true,
    //        //showButtonPanel: true
    //    });
    //} else {
    $("#" + Id.id).datepicker({
        dateFormat: 'dd/mm/yy',
        numberOfMonths: 1,
        minDate: 0,
        // maxDate: new Date(EDate),
        changeMonth: true,
        changeYear: true,
        //showButtonPanel: true
    });



    //$("#" + Id.id).mouseover(function () {
    //    $('#ui-datepicker-div').show();
    //});
}
function fnActivityAuto() {
    autoComplete(Activities_g, "txtactivity", "hdnactivityval", "auto_activity");
}

function fnClose(Id) {
    $(".ac_results").mouseleave(function () {
        $('.ac_results').hide();
    });
    //$('#ui-datepicker-div').mouseleave(function () {
    //    $('#ui-datepicker-div').hide();
    //});
}

function fnMarketingCampaignEventBinder() {

    $(".autoSale").keypress(function () { fnCreateProductTable(this); fnClose(this); });
    $(".autoSale").dblclick(function () { fnCreateProductTable(this); fnClose(this); });
    //$(".autoSale").blur(function () { fnCreateProductTable(this); }); 


    $(".autoSample").dblclick(function () { fnCreateSampleProductNewRow(this); fnClose(this); });
    $(".autoSample").keypress(function () { fnCreateSampleProductNewRow(this); fnClose(this); });

    $(".DueDate").hover(function () { fnDueDate(this); });
    $(".DueDate").click(function () { fnDueDate(this); });

    $(".StartDate").hover(function () { fnDueDate(this); });
    $(".StartDate").click(function () { fnDueDate(this); });

    $('.autactivity').keypress(function () { fnActivityAuto(this); fnCreateSampleProductNewRow(this); });
    $('.autactivity').dblclick(function () { fnActivityAuto(this); fnCreateSampleProductNewRow(this); });
    $('.autactivity').click(function () { fnActivityAuto(this); fnCreateSampleProductNewRow(this); });
    $('.autactivity').blur(function () { fnActivityAuto(this); fnCreateSampleProductNewRow(this); });

    $(".checkexpnumeric").blur(function () { if ($(this).val() != "") { return fnCheckInt(this); } });

}

function fnGetMCList() {
    // debugger;
    var today = new Date();
    var cdd = today.getDate();
    var cmm = today.getMonth() + 1;
    var cyy = today.getFullYear();
    var currentDate = cdd + '/' + cmm + '/' + cyy;
    today.setDate(today.getDate() - 90);
    var pdd = today.getDate();
    var pmm = today.getMonth() + 1;
    var pyy = today.getFullYear();
    var prevDate = pdd + '/' + pmm + '/' + pyy;


    $('#fromDate').val(prevDate);
    $('#toDate').val(currentDate);
    //fnGetMarketingCampaignDetails();
}
function fnValidateInputsForSummary() {
    //debugger;
    var flag = true;
    if ($('#fromDate').val() == "") {
        fnMsgAlert('info', 'Marketing Campaign', 'Please Select Campaign Start Date.');
        flag = false;
        $.unblockUI();
        return;
    }
    if ($('#toDate').val() == "") {
        fnMsgAlert('info', 'Marketing Campaign', 'Please Select Campaign End Date.');
        flag = false;
        $.unblockUI();
        return;
    }
    if ($('input[name=MCStatFil]:checked').length == 0) {
        fnMsgAlert('info', 'Marketing Campaign', 'Please Select Atleast one Status.');
        flag = false;
        $.unblockUI();
        return;
    }

    //if (!(fnValidateDateFormate($("#fromDate"), "Campaign Start Date"))) {
    //    HideModalPopup("dvloading");
    //    flag = false;
    //    return;
    //}
    //if (!(fnValidateDateFormate($("#toDate"), "Campaign End Date"))) {
    //    HideModalPopup("dvloading");
    //    flag = false;
    //    return;
    //}
    if ($('#hdnRegionCode').val() == "" || $('#hdnRegionCode').val() == null || $('#hdnRegionCode').val() == undefined) {
        fnMsgAlert('info', 'Marketing Campaign', 'Please Select Region to see Campaign(s).');
        flag = false;
        $.unblockUI();
        return;
    }
    var SDate = $('#fromDate').val();
    var EDate = $('#toDate').val();
    if (SDate != "" && SDate != undefined && SDate != null) {
        SDate = SDate.split('/')[2] + '/' + SDate.split('/')[1] + '/' + SDate.split('/')[0];
    }
    if (EDate != "" && EDate != undefined && EDate != null) {
        EDate = EDate.split('/')[2] + '/' + EDate.split('/')[1] + '/' + EDate.split('/')[0];
    }
    var sdate = new Date(SDate);
    var edate = new Date(EDate);
    if (edate < sdate) {
        fnMsgAlert('info', 'Marketing Campaign', 'Please Enter Campaign End Date greater than Campaign Start Date.');
        flag = false;
        $.unblockUI();
        return;
    }
    return flag;
}
function fnGetMarketingCampaignDetails(regionCode, loadType) {
    debugger;
    var mode = $('#hdnLoadType').val();
    if (regionCode.toUpperCase() == "A") {
        regionCode = $('#hdnRegionCode').val();
    }
    $("#dvTablePrint").hide();
    //$.blockUI();
    var result = fnValidateInputsForSummary();
    if (result) {
        var SDate = $('#fromDate').val();
        if (SDate != "" && SDate != null && SDate != undefined) {
            SDate = SDate.split('/')[2] + '/' + SDate.split('/')[1] + '/' + SDate.split('/')[0];
        }
        var EDate = $('#toDate').val();
        if (EDate != "" && EDate != null && EDate != undefined) {
            EDate = EDate.split('/')[2] + '/' + EDate.split('/')[1] + '/' + EDate.split('/')[0];
        }
        var status_length = $('input[name=MCStatFil]:checked').length;
        var status = '';


        $('input[name=MCStatFil]').each(function () {
            if (this.checked) {
                status += $(this).val() + ',';
            }
        });
        status = status.slice(0, -1);

        $.ajax({
            data: "regionCode=" + regionCode + "&recordStatus=" + status + "&startDate=" + SDate + "&endDate=" + EDate + "&mode=" + mode,
            url: '../HiDoctor_Master/MarketingCampaign/GetMarketingCampaignsForARegion',
            contentType: 'application/json',
            success: function (response) {
                //console.log(response);
                MCList = response
                fnBindDetailsMC(MCList, loadType);

            },
            error: function (e) {
                $.unblockUI();
            },
            complete: function (e) {

            }
        });
    }
}
function fnBindDetailsMC(resp, loadType) {
    debugger;
    var PR_Url = "HiDoctor_Master/PurchaseRequisition/PurchaseRequisitionForm";
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();

    var currentDate = yy + '/' + mm + '/' + dd;
    var CDate = new Date(currentDate);
    var lstExitingCampaigns = [];
    var regionCode = $('#hdnRegionCode').val();
    if (resp.length != 0) {
        var content = '';
        content += "<div  class='table-responsive'><table class='table table-striped' id='tblMC' cellspacing='0' cellpadding='0' style='text-align:center;'>";
        content += "<thead style='text-align:center;'>";
        content += "<tr>";
        content += "<th>Edit</th>";
        content += "<th style='width:25%;'>Campaign Name</th>";
        content += "<th>Region Name</th>";
        content +="<th>Employee Name</>"
        content += "<th>Start Date</th>";
        content += "<th>End Date</th>";
        content += "<th>Track From Date</th>";
        content += "<th>Track Till Date</th>";
        content += "<th>Customer Selection</th>";
        content += "<th>Campaign Based On</th>";
        content += "<th>Customer Count</th>";
        content += "<th>Details</th>";
        content += "<th>Campaign Frequency</th>";
        content += "<th>Status</th>";
        content += "<th>History</th>";
        content += "<th>Action</th>";
        //content += "<th>Create</th>";
        content += "<th>Create Purchase Requisition</th>";
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";
        if (resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                var Campaign_Code = resp[i].Campaign_Code;
                var sDate = resp[i].Start_Date;
                sDate = sDate.split('/')[2] + '/' + sDate.split('/')[1] + '/' + sDate.split('/')[0];
                var eDate = resp[i].End_Date;
                eDate = eDate.split('/')[2] + '/' + eDate.split('/')[1] + '/' + eDate.split('/')[0];

                var SDate = new Date(sDate);
                var EDate = new Date(eDate);
                content += "<tr>";
                if (loadType.toUpperCase() != "LOAD" && (resp[i].Region_Code == regionCode)) {
                    content += "<td class='td-a' onclick='fnEditMarketingCampaign(\"" + resp[i].Campaign_Code + "\",\"" + resp[i].Mapped_Doctor_Count + "\",\"" + resp[i].Customer_Count + "\",\"" + resp[i].Record_Status + "\");'>Edit</td>";
                }

                else {
                    content += "<td></td>";
                }
                
                //if (resp[i].Record_Status != "Applied") {

                //}
                //else {
                //    content += "<td></td>";
                //}
                lstExitingCampaigns.push(resp[i].Campaign_Name);
                content += "<td id='campName_" + resp[i].Campaign_Code + "' style='white-space:ormal;word-wrap:break-word;word-break:break-word;'>" + resp[i].Campaign_Name + "</td>";
                content += "<td id='regname_" + resp[i].Campaign_Code + "'>" + resp[i].Region_Name + "</td>";
                content += "<td id='empname_" + resp[i].Campaign_Code + "'>" + resp[i].Employee_Name + "</td>";
                content += "<td id='sDate_" + resp[i].Campaign_Code + "'>" + resp[i].Start_Date + "</td>";
                content += "<td id='eDate_" + resp[i].Campaign_Code + "'>" + resp[i].End_Date + "</td>";
                if (resp[i].Track_From != '' && resp[i].Track_From != '01/01/1900' && resp[i].Track_From != null) {
                    content += "<td id='Desg_" + resp[i].Campaign_Code + "'>" + resp[i].Track_From + "</td>";
                } else {
                    content += '<td></td>';
                }
                if (resp[i].Track_Till != '' && resp[i].Track_Till != '01/01/1900' && resp[i].Track_Till != null) {
                    content += "<td id='Desg_" + resp[i].Campaign_Code + "'>" + resp[i].Track_Till + "</td>";
                } else {
                    content += '<td></td>';
                }
                content += "<td id='docsel_'" + resp[i].Campaign_Code + "'>" + resp[i].Doctor_Product_Mapping_Validation + "</td>";

                if (resp[i].Campaign_Based_On == 1) {
                    content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Region</td>";
                } else {
                    content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Role</td>";
                }
                content += "<td id='custCount_" + resp[i].Campaign_Code + "'>" + resp[i].Customer_Count + "</td>";
                content += "<td class='td-a' onclick='fnOpenProductDetails(\"" + resp[i].Campaign_Code + "\");'>View Details</td>";
                if (resp[i].Campaign_Frequency == 1) {
                    content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Monthly</td>";
                } else if (resp[i].Campaign_Frequency == 2) {
                    content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Quarterly</td>";
                } else if (resp[i].Campaign_Frequency == 3) {
                    content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Half-Yearly</td>";
                } else if (resp[i].Campaign_Frequency == 4) {
                    content += "<td id='custCount_" + resp[i].Campaign_Code + "'>Yearly</td>";
                } else {
                    content += '<td>-</td>';
                }

                content += "<td >" + resp[i].Record_Status + "</td>";
                content += "<td class='td-a' onclick='fnOpenRemarksistory(\"" + resp[i].Campaign_Code + "\");'>View History</td>";
                if (resp[i].Record_Status == "Approved") {
                    if (EDate >= CDate) {
                        if (resp[i].Campaign_Current_Status == 0 || resp[i].Campaign_Current_Status == null) {
                            content += "<td class='td-a' onclick='fnPauseCampaignRem(\"" + resp[i].Campaign_Code + "\",1);'>Pause</td>";
                        } else {
                            content += "<td class='td-a' onclick='fnPauseCampaign(\"" + resp[i].Campaign_Code + "\",0);'>Resume</td>";
                        }
                    } else {
                        content += '<td></td>';
                    }
                } else {
                    content += '<td></td>';
                }

                //For PR Module
                if (resp[i].Record_Status == "Approved") {
                    if (EDate >= CDate) {
                        if (resp[i].Sample_Count > 0) {
                            var disjson = jsonPath(menuContent_g.Tables[0].Rows, "$.[?(@.Menu_URL=='" + PR_Url + "')]");
                            if (disjson.length > 0 && disjson != false && disjson != undefined) {
                                content += "<td class='td-a' onclick='fnLoadPurchaseRequisition(\"" + resp[i].Campaign_Code + "\",\"" + resp[i].Start_Date + "\",\"" + resp[i].End_Date + "\");'>New Purchase Request</td>";

                            } else {
                                content += '<td></td>';
                            }
                        } else {
                            content += '<td></td>';
                        }
                    }
                    else {
                        content += '<td></td>';
                    }
                }
                else {
                    content += '<td></td>';
                }
                content += "</tr>";
            }
        }
        content += "</tbody>";
        content += "</table></div>";
        $("#dvDefinerSummary").html(content);
        ExistingCampaigns = lstExitingCampaigns;
        $.unblockUI();

    }

    else {
        content = '';
        content += "<div class='col-lg-12 form-group' style='font-style:italic;'>No Marketing Campaign(s) found for the given Date range and Status Filter.Please change Date range.</div>";
        $("#dvDefinerSummary").html(content);
        $.unblockUI();
    }
}


function fnOpenProductDetails(campaignCode) {
    debugger;

    //$('#main').block({
    //    message: '<h3>Processing</h3>',
    //    css: { border: '2px solid #ddd' }
    //});
    $.blockUI();
    var disjson = jsonPath(MCList, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    $('#MCName').html(disjson[0].Campaign_Name);
    if (disjson[0].Campaign_Description == "" || disjson[0].Campaign_Description == null) {
        var Descr = "No Description for the Campaign.";
        $('#MCDescrp').html(Descr);
        $('#MCDescrp').addClass('descrpcss');
    } else {
        $('#MCDescrp').html(disjson[0].Campaign_Description);
    }
    if (disjson[0].Campaign_Budget == "" || disjson[0].Campaign_Budget == 0 || disjson[0].Campaign_Budget == null) {
        var Descr = "Budget is not Specified.";
        $('#BudgetofCamppop').html(Descr);
        $('#BudgetofCamppop').addClass('descrpcss');
    } else {
        $('#BudgetofCamppop').html(disjson[0].Campaign_Budget);
    }


    $.ajax({
        type: 'GET',
        data: "campaignCode=" + campaignCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetCampaignHeaderDetails',
        success: function (response) {

            fnBindOtherMCDetails(response);
            //$("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Failed to load details.Please try After Sometime.');
            $("#main").unblock();
        },
        complete: function (e) {
            fnGetProductsDetails(campaignCode);
        }
    });



}
function fnBindOtherMCDetails(resp) {
    debugger;
    var DcCat = "";
    var spCat = "";
    var regiontypes = '';
    var CatgSno = 0;
    //var disjsonCatCode = jsonPath(resp.lstDocCateg, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    for (var i = 0; i < resp.lstDocCateg.length; i++) {
        CatgSno++;
        DcCat += '<tr>';
        DcCat += '<td style="min-width:100px">' + CatgSno + '</td>';
        DcCat += '<td style="min-width:168px;">' + resp.lstDocCateg[i].Doctor_Category_Name + '</td>';
        DcCat += '</tr>';
        //if (i < disjsonCatCode.length - 1) {
        //    DcCat += ',';
        //}
    }
    $('#MCCatCode').html(DcCat);
    var SpecSno = 0;
    //var disjsonSpecCode = jsonPath(resp.lstSpecCateg, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    for (var i = 0; i < resp.lstSpecCateg.length; i++) {
        SpecSno++;
        spCat += '<tr>';
        spCat += '<td style="min-width:100px">' + SpecSno + '</td>';
        spCat += '<td style="min-width:168px;">' + resp.lstSpecCateg[i].Doctor_Speciality_Name + '</td>';
        spCat += '</tr>';
        //spCat += disjsonSpecCode[i].Doctor_Speciality_Name;
        //if (i < disjsonSpecCode.length - 1) {
        //    spCat += ',';
        //}
    }
    $('#MCSpecCode').html(spCat);
    var regSno = 0;
    //var disjsonregiontye = jsonPath(resp.lstDesig, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    for (var i = 0; i < resp.lstDesig.length; i++) {
        regSno++;
        regiontypes += '<tr>';
        regiontypes += '<td style="min-width:100px">' + regSno + '</td>';
        regiontypes += '<td style="min-width:168px;">' + resp.lstDesig[i].Region_Type_Name + '</td>';
        regiontypes += '</tr>';
        //regiontypes += disjsonregiontye[i].Region_Type_Name;
        //if (i < disjsonregiontye.length - 1) {
        //    regiontypes += ',';
        //}
    }
    $('#MCRegType').html(regiontypes);

    //$('#BudgetofCamppop').html(disjson[0].Budget_Of_Campaign);
    var parregSno = 0;
    //var disjsonRegionsProd = jsonPath(resp.lstMCParRegions, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
    var ParRegions = '';
    for (var i = 0; i < resp.lstMCParRegions.length; i++) {
        parregSno++;
        ParRegions += '<tr>';
        ParRegions += '<td style="min-width:100px">' + parregSno + '</td>';
        ParRegions += '<td style="min-width:168px;">' + resp.lstMCParRegions[i].Region_Name + '</td>';
        ParRegions += '</tr>';
        //ParRegions += disjsonRegionsProd[i].Region_Name;
        //if (i < disjsonRegionsProd.length - 1) {
        //    ParRegions += ',';
        //}
    }
    $('#MCParReg').html(ParRegions);
}
function fnGetProductsDetails(campaignCode) {
    debugger;
    $.ajax({
        type: 'POST',
        data: "campaignCode=" + campaignCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetProductsSamplebyCampaign',
        success: function (response) {

            fnBindDetailsMCProds(response);
            //$("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Failed to get product details.Please try After Sometime.');
            $("#main").unblock();
        }
    });

}

function fnBindDetailsMCProds(resp) {
    //debugger;

    var content = '';
    if (resp.lstProd.length >= 1) {

        for (var i = 0; i < resp.lstProd.length; i++) {
            var Product_Code = resp.lstProd[i].Product_Code;

            content += '<div class="col-lg-12 Main paddng" id="main_' + i + '">';
            content += '<div class="col-lg-12 Prod paddng" id="Prod_' + i + '">';
            content += '<div class="col-lg-6">';
            content += '<div class="col-lg-12 paddng">';
            content += '<div class="col-lg-4 paddng"style="padding-left:6px !important;"><b>Sale Product:</b></div>';
            content += '<div class="col-lg-8 paddng">' + resp.lstProd[i].Product_Name + '</div>';
            content += '</div>';
            content += '</div>';
            content += '<div class="col-lg-6">';
            content += '<div class="col-lg-12 paddng">';
            content += '<div class="col-lg-8 paddng"><b>Expected Sale Increase:</b></div>';
            if (resp.lstProd[i].ROI != 0) {
                content += '<div class="col-lg-4 paddng">' + resp.lstProd[i].ROI + '%</div>';
            } else {
                content += '<div class="col-lg-3">-</div>';
            }
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '<div class="table-responsive Samp" style="padding-top:10px !important;">';
            content += '<table class="table table-striped" id="tblProdPopup" cellspacing="0" cellpadding="0" style="text-align:center;">';
            content += '<thead style="text-align:center;">';
            content += '<tr>';
            content += '<th>Input Type</th>';
            content += '<th style="width:40%  !important;">Sample Products/Activity</th>';
            content += '<th>Visit Order</th>';
            content += '<th>Quantity</th>';
            content += '<th>Start Date</th>';
            content += '<th>Due Date</th>';
            content += '<th>Budget Of Item</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody>';
            var disjson = jsonPath(resp.lstSamp, "$.[?(@.Product_Code=='" + Product_Code + "')]");
            if (disjson.length >= 1) {


                for (var j = 0; j < disjson.length; j++) {

                    if (disjson[j].Input_Type != null) {
                        content += "<tr>";
                        if (disjson[j].Input_Type == "PI") {
                            content += "<td>Promotional</td>";
                        } else if (disjson[j].Input_Type == "A") {
                            content += "<td>Activity</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Input_Type == "PI") {
                            content += "<td style='width:40%  !important;'>" + disjson[j].Product_Name + "</td>";
                        } else if (disjson[j].Input_Type == "A") {
                            content += "<td style='width:40%  !important;'>" + disjson[j].Activity_Name + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Visit_Order != 0) {
                            content += "<td>" + disjson[j].Visit_Order + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }

                        if (disjson[j].Quantity != 0) {
                            content += "<td>" + disjson[j].Quantity + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Start_Date != null && disjson[j].Start_Date != "01/01/1900") {
                            var Start_Date = disjson[j].Start_Date.split(' ')[0];
                            Start_Date = Start_Date.split('/')[1] + '/' + Start_Date.split('/')[0] + '/' + Start_Date.split('/')[2];
                            content += "<td>" + Start_Date + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Due_Date != null && disjson[j].Due_Date != "01/01/1900") {
                            var Due_Date = disjson[j].Due_Date.split(' ')[0];
                            Due_Date = Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0] + '/' + Due_Date.split('/')[2];
                            content += "<td>" + Due_Date + "</td>";
                        } else {
                            content += "<td>-</td>";
                        }
                        if (disjson[j].Line_Item_Budget != "" && disjson[j].Line_Item_Budget != null) {
                            content += "<td>" + disjson[j].Line_Item_Budget + "</td>"
                        } else {
                            content += "<td>-</td>";
                        }

                        content += "</tr>";
                    }
                }
            }
            content += '</tbody></table></div></div>';
        }
    } else {
        content = '';
        content += "<div class='col-lg-12 form-group' style='font-style:italic;'>No Product details found for this campaign.</div>";
    }
    $.unblockUI();
    $('#divMCProdDetail').html(content);
    $('#dvOverLay').modal('show');
}


function fnLoadPurchaseRequisition(campCode, sDate, eDate) {
    debugger;
    $.blockUI();
    $('#RequisitionBody').load('../HiDoctor_Master/PurchaseRequisition/PurchaseRequisitionForm/?CampaignCode=' + campCode + '&StartDate=' + sDate + '&EndDate=' + eDate);
    //$('#PR_Modal').modal('show');
}
function fnPauseCampaignRem(campCodepause, status) {
    // debugger;
    var content = '';
    content += '<button type="button" class="btn btn-default" onclick="fnPauseCampaign(\'' + campCodepause + '\',\'' + status + '\')">Pause</button>';
    $('#Acknowledgebutton').html(content);
    $('#AcknowledgeConfirmation').modal('show');
}
function fnValidatePauseReason() {
    debugger;
    var flag = true;
    if ($('#PauseRemarks').val() == "") {
        fnMsgAlert('info', 'Marketing Campaign', 'Please Enter the Reason For Pausing the Marketing Campaign.');
        flag = false;
        return;
    }
    if ($('#PauseRemarks').val() != "") {
        var result = regExforAlphaNumericSpecificRemarks($('#PauseRemarks').val());
        if (result == false) {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Reason.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
    }
    return flag;
}

function fnPauseCampaign(CampCodePaus, status) {
    // debugger;
    var reasontoPause = "";
    var regionCode = $('#hdnRegionCode').val()
    if (CampCodePaus != "" && CampCodePaus != undefined) {
        if (status == 1) {
            var result = fnValidatePauseReason();
            reasontoPause = $('#PauseRemarks').val();
            if (result == true) {
                $.ajax({
                    type: "PUT",
                    url: "../HiDoctor_Master/MarketingCampaign/UpdateCampaignCurrentStatus",
                    data: "campaignCode=" + CampCodePaus + "&UpdateStatus=" + status + "&reasontoPause=" + reasontoPause,
                    success: function (resp) {
                        $.blockUI();
                        var loadType = $('#hdnLoadType').val();
                        if (resp == "True") {
                            fnGetMarketingCampaignDetails(regionCode, 'Click');
                            $('#AcknowledgeConfirmation').modal('hide');
                            $('#PauseRemarks').val('');
                            fnMsgAlert('success', 'Marketing Campaign', 'Paused Campaign Successfully.');
                            return false;
                        }
                        else {
                            fnGetMarketingCampaignDetails(regionCode, 'Click');
                            $('#AcknowledgeConfirmation').modal('hide');
                            $('#PauseRemarks').val('');
                            fnMsgAlert('error', 'Marketing Campaign', 'Failed to Pause Campaign.Please try after sometime.');
                            return false;
                        }
                    }
                });
            }

        } else {
            $.ajax({
                type: "PUT",
                url: "../HiDoctor_Master/MarketingCampaign/UpdateCampaignCurrentStatus",
                data: "campaignCode=" + CampCodePaus + "&UpdateStatus=" + status + "&reasontoPause=" + reasontoPause,
                success: function (resp) {
                    if (resp == "True") {
                        $.blockUI();
                        fnGetMarketingCampaignDetails(regionCode, 'Click');
                        fnMsgAlert('success', 'Marketing Campaign', 'Resumed Campaign Successfully.');
                        return false;
                    }
                    else {
                        fnMsgAlert('error', 'Marketing Campaign', 'Failed to Resume Campaign.Please try after sometime.');
                        return false;
                    }
                }
            });
        }

    }
}
function fnOpenRemarksistory(campaignCode) {
    // debugger;
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/MarketingCampaign/GetRemarksByMarketingCampaign",
        data: "campaignCode=" + campaignCode,
        success: function (resp) {
            fnBindRemarksHTML(resp);
        }
    });
}
function fnBindRemarksHTML(resp) {
    // debugger;
    var content = '';
    var sno = 0;
    if (resp.length >= 1) {
        content += "<div  class='table-responsive'><table class='table table-striped' id='tblMC' cellspacing='0' cellpadding='0'>";
        content += "<thead style='text-align:center;'>";
        content += "<tr>";
        content += '<th>S.No</th>';
        content += "<th style='width:20%;'>Marketing Campaign Name</th>";
        content += "<th style='width:10%;'>Action</th>";
        content += "<th style='width:15%;'>Action By</th>";
        content += "<th style='width:15%;'>Date Of Action</th>";
        content += "<th style='width:40%;'>Remarks</th>";
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";
        for (var i = 0; i < resp.length; i++) {
            sno++;
            content += '<tr>';
            content += '<td>' + sno + '</td>';
            content += '<td>' + resp[i].Campaign_Name + '</td>';
            if (resp[i].Record_Status == 1) {
                content += '<td>Approved</td>';
            }
            else if (resp[i].Record_Status == 2) {
                content += '<td>Applied</td>';
            } else if (resp[i].Record_Status == 0) {
                content += '<td>UnApproved</td>';
            } if (resp[i].Record_Status == 2 && resp[i].Updated_By == null && resp[i].Updated_DateTime == null) {

                if (resp[i].Created_By != null) {
                    content += '<td>' + resp[i].Created_By + '</td>';
                } else {
                    content += '<td></td>';
                }
                if (resp[i].Created_DateTime != null) {
                    content += '<td>' + resp[i].Created_DateTime + '</td>';
                } else {
                    content += '<td></td>';
                }
                if (resp[i].Remarks != null) {
                    content += '<td>' + resp[i].Remarks + '</td>';
                } else {
                    content += '<td></td>';
                }
            } else {
                if (resp[i].Updated_By != null) {
                    content += '<td>' + resp[i].Updated_By + '</td>';
                } else {
                    content += '<td></td>';
                }
                if (resp[i].Updated_DateTime != null) {
                    content += '<td>' + resp[i].Updated_DateTime + '</td>';
                } else {
                    content += '<td></td>';
                }
                if (resp[i].Remarks != null) {
                    content += '<td>' + resp[i].Remarks + '</td>';
                } else {
                    content += '<td></td>';
                }
            }
        }
    } else {
        content = '';
        content += "<div class='col-lg-12 form-group' style='font-style:italic;'>No Remarks History.</div>";
    }
    $("#hstryoverlay").html(content);
    $("#dvhstryOverLay").overlay().load();
}


function fnValidateInputVO(Id, evt) {

    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 2) {
            return false;
        }
    }
}
function fnValidateCustomerCount(Id, evt) {

    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 3) {
            return false;
        }
    }
}
function fnValidateInputQty(Id, evt) {

    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 5) {
            return false;

        }
    }
}
function fnValidateBudget(Id, evt) {
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 10) {
            return false;

        }
    }
}




function fnValidateInputROI(Id, evt) {

    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id + '').val().length >= 7) {
            return false;

        }
    }
}

function fnSaveMarketingCampaignDefiner() {
    debugger;
    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();
    if (fnValidateMarketingCampaignDefiner()) {
        //Campaign_Name
        var campName = $.trim($('#txtCampName').val());
        //Campaign_Description
        var campDescrp = $.trim($('#txtCampPurpose').val());
        //Campaign_Code
        var campCode = $("#hdnCampaignCode").val();

        //Customer_Category_Code
        var docCatCode = "";
        $('select#ddlDocCategory > option:selected').each(function () {
            docCatCode += $(this).val() + ',';
        });
        docCatCode = docCatCode.slice(0, -1);

        //Customer_Speciality_Code
        var specCode = "";
        $('select#ddlSpeciality > option:selected').each(function () {
            specCode += $(this).val() + ',';
        });
        specCode = specCode.slice(0, -1);

        //Start_Date
        var sDate = $('#txtStartDate').val().split('/')[2] + '/' + $('#txtStartDate').val().split('/')[1] + '/' + $('#txtStartDate').val().split('/')[0];

        //End_Date
        var eDate = $('#txtEndDate').val().split('/')[2] + '/' + $('#txtEndDate').val().split('/')[1] + '/' + $('#txtEndDate').val().split('/')[0];

        //Track_Till_Date
        var ttDate = '';
        if ($('#txtMonths').val() != "") {
            ttDate = $('#txtMonths').val().split('/')[2] + '/' + $('#txtMonths').val().split('/')[1] + '/' + $('#txtMonths').val().split('/')[0];
        }
        var tfdate = '';
        if ($('#txtfrom').val() != "") {
            tfdate = $('#txtfrom').val().split('/')[2] + '/' + $('#txtfrom').val().split('/')[1] + '/' + $('#txtfrom').val().split('/')[0];
        }
        //Campaign Based On
        var CamBasdOn = $('input:radio[name=typeSelection]:checked').val();


        //Customer_Count
        var custCount = '';
        if (CamBasdOn == 1) {
            custCount = $('#txtCustCount').val();
        } else {
            custCount = $('#txtCustCountrole').val();
        }


        //Doctor_Selection
        var docSelection = $('input:radio[name=doctorSelection]:checked').val();



        //Designation_Code
        var entityCode = "";
        //var entity_Names = new Array();
        $('select#ddlCategory > option:selected').each(function () {
            entityCode += $(this).val() + ',';
            //entity_Names.push($(this).text().split('(')[0]);
        });
        entityCode = entityCode.slice(0, -1);
        var role = '';
        $('select#ddlsurveyusers > option:selected').each(function () {
            role += $(this).val() + ',';
            //entity_Names.push($(this).text().split('(')[0]);
        });
        role = role.slice(0, -1);
        //
        var Region_Code = $("#hdnRegionCode").val();
        var ParRegionCode = [];
        if (selKeys.length >= 1) {
            for (var i = 0; i < selKeys.length; i++) {
                var ObjParReg = {
                    Region_Code: selKeys[i],
                };
                ParRegionCode.push(ObjParReg);
            }


        }
        var BudgetOfCamp = $('#CampBudget').val();
        var FreqOfCamp = $('#freqSel :selected').val();
        if ($('#ddlsurvey :selected').val() == 0 || $('#ddlsurvey :selected').val() == undefined) {
            var Survey = 0;
            var Surveydate = "-1";
        }
        else {
            var Surveyid = $('#ddlsurvey :selected').val().split('|');
            var Survey = Surveyid[0];
            var Surveydate = Surveyid[1];
            //.split(' ')[0]
            Surveydate = Surveydate.split('-')[2] + '-' + Surveydate.split('-')[1] + '-' + Surveydate.split('-')[0];

        }

        //Product And Sample
        var productString = "";
        total_prod_lgnth = $(".dvsalebox").length;
        var ProdtSample = [];
        for (var a = 1; a <= total_prod_lgnth; a++) {
            var sale_Prod = $("#txtsale_" + a).val();
            var Product_Code = $('#hdnsale_' + a).val();
            var ROI = $('#ROI_' + a).val();
            if (sale_Prod != "") {
                // sample Product
                var atleastOneSample = 0;
                var sample_Lngth = $(".sample_" + a).length;
                if (sample_Lngth >= 1) {


                    $(".sample_" + a).each(function (index, obj) {
                        var rowid = obj.id.replace("sample_", "");

                        var InputType = $("#inpttype_" + rowid + " >:selected").val();
                        var prodSample = {};

                        if (InputType == "A") {
                            var Activity_Id = $('#hdnactivityval_' + rowid).val();
                            var Activity_Name = $('#txtactivity_' + rowid).val();
                            var Visit_Order = $('#txtvisitorder_' + rowid).val();
                            var Quantity = $('#txtQuantity_' + rowid).val();
                            var Due_Date = "";
                            if ($('#txtDueDate_' + rowid).val() != "") {
                                Due_Date = $('#txtDueDate_' + rowid).val().split('/')[2] + '/' + $('#txtDueDate_' + rowid).val().split('/')[1] + '/' + $('#txtDueDate_' + rowid).val().split('/')[0];
                            }
                            var Start_Date = "";
                            if ($('#txtStartDate_' + rowid).val() != "") {
                                Start_Date = $('#txtStartDate_' + rowid).val().split('/')[2] + '/' + $('#txtStartDate_' + rowid).val().split('/')[1] + '/' + $('#txtStartDate_' + rowid).val().split('/')[0];
                            }
                            var LI_Budget = "";
                            if ($('#txtBudget_' + rowid).val() != "" && $('#txtBudget_' + rowid).val() != undefined) {
                                LI_Budget = $('#txtBudget_' + rowid).val();
                            }


                            prodSample = {
                                Product_Code: Product_Code,
                                ROI: ROI,
                                Input_Type: InputType,
                                Activity_Name: Activity_Name,
                                Activity_Id: Activity_Id,
                                Quantity: Quantity,
                                Visit_Order: Visit_Order,
                                Due_Date: Due_Date,
                                Start_Date: Start_Date,
                                Line_Item_Budget: LI_Budget,
                            };
                            ProdtSample.push(prodSample);
                        }
                        else if (InputType == "PI") {
                            var Sample_Code = $('#hdnsample_' + rowid).val();
                            var Visit_Order = $('#txtvisitorder_' + rowid).val();
                            var Quantity = $('#txtQuantity_' + rowid).val();
                            var Due_Date = "";
                            if ($('#txtDueDate_' + rowid).val() != "") {
                                Due_Date = $('#txtDueDate_' + rowid).val();
                                Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                            }
                            var Start_Date = "";
                            if ($('#txtStartDate_' + rowid).val() != "") {
                                Start_Date = $('#txtStartDate_' + rowid).val().split('/')[2] + '/' + $('#txtStartDate_' + rowid).val().split('/')[1] + '/' + $('#txtStartDate_' + rowid).val().split('/')[0];
                            }
                            var LI_Budget = "";
                            if ($('#txtBudget_' + rowid).val() != "" && $('#txtBudget_' + rowid).val() != undefined) {
                                LI_Budget = $('#txtBudget_' + rowid).val();
                            }

                            prodSample = {
                                Product_Code: Product_Code,
                                ROI: ROI,
                                Input_Type: InputType,
                                Sample_Code: Sample_Code,
                                Quantity: Quantity,
                                Visit_Order: Visit_Order,
                                Due_Date: Due_Date,
                                Start_Date: Start_Date,
                                Line_Item_Budget: LI_Budget,
                            };
                            ProdtSample.push(prodSample);
                        }
                        else {
                            if (InputType == 0 && $(".sample_" + a).length <= 1) {
                                prodSample = {
                                    Product_Code: Product_Code,
                                    ROI: ROI,
                                    Input_Type: "",
                                    Activity_Name: "",
                                    Activity_Id: "",
                                    Quantity: "",
                                    Visit_Order: "",
                                    Due_Date: "",
                                    Start_Date: "",
                                    Line_Item_Budget: "",
                                };
                                ProdtSample.push(prodSample);
                            }
                        }
                    });
                }
                else {
                    prodSample = {
                        Product_Code: Product_Code,
                        ROI: ROI,
                        Input_Type: "",
                        Activity_Name: "",
                        Activity_Id: "",
                        Quantity: "",
                        Visit_Order: "",
                        Due_Date: "",
                        Start_Date: "",
                        Line_Item_Budget: "",
                    };
                    ProdtSample.push(prodSample);
                }
                //if (atleastOneSample == 0) {
                //    var InputType = $("#inpttype" + a + "_" + b + " >:selected").val();
                //    if (InputType != 0) {
                //        ProdSample = {
                //            Product_Code: sale_Prod,
                //            ROI: ROI,
                //            Input_Type: InputType,
                //            Sample_Code: Sample_Code,
                //            Quantity: Quantity,
                //            Visit_Order: Visit_Order,
                //            Due_Date: Due_Date,
                //        };
                //        ProdSample.push(ProdSample);
                //    }
                //}
            }
        }
        var status = $('#hdnStatus').val();
        var MarketingCampaignModel = {
            Status: EditStatus,
            Campaign_Name: campName,
            Campaign_Description: campDescrp,
            Start_Date: sDate,
            End_Date: eDate,
            Track_Till: ttDate,
            Track_From: tfdate,
            lstRegionCodes: ParRegionCode,
            Designation: entityCode,
            UserType: role,
            Campaign_Based_On: CamBasdOn,
            Customer_Count: custCount,
            Doctor_Product_Mapping_Validation: docSelection,
            Customer_Category_Code: docCatCode,
            Customer_Speciality_Code: specCode,
            Budget_Of_Campaign: BudgetOfCamp,
            Frequency_Of_Campaign: FreqOfCamp,
            Survey: Survey,
            Surveydate: Surveydate,
            Campaign_Code: campCode,
            lstProdSamp: ProdtSample,

        };

        HideModalPopup("dvloading");


        $('#main').block({
            message: '<h3>Saving...</h3>',
            css: { border: '2px solid #ddd' }
        });

        $.ajax({
            type: 'POST',
            data: JSON.stringify({ "ObjMCHeader": MarketingCampaignModel, "regionCode": Region_Code }),
            url: '../HiDoctor_Master/MarketingCampaign/InsertMarketingCampaign',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response != "0") {
                    fnMsgAlert('success', 'Marketing Campaign Definer', 'Marketing Campaign Saved successfully');
                    cmpCode = '';
                    fnGetMarketingCampaignDetails(regionCode, 'Click');
                    fnCancelMarketingCampaignDefiner();
                    fnGetActivities();
                    $('#treebody').empty();
                    fnGetRegionTreeByRegionWithCheckBoxMC(Sel_Region_Code, "treebody", "");
                    //fnGetAllRegionUsers(Sel_Region_Code);
                }
                else {
                    fnMsgAlert('error', 'Marketing Campaign Definer', 'Error while saving the Marketing Campaign.');
                }
                $("#main").unblock();
            },
            error: function (e) {
                // fnMsgAlert('info', '', 'Error.' + e.Message);
                $("#main").unblock();
            }
        });
    }
}


var disjsonRegions = '';
var Status = '';
function fnEditMarketingCampaign(campCode, mappedDoctorCount, customerCount, MCStatus) {
    debugger;
    window.scrollTo(0, 10);
    //$('#main').block({
    //    message: '<h3>Saving...</h3>',
    //    css: { border: '2px solid #ddd' }
    //});
    cmpCode = campCode;
    fnCancelMarketingCampaignDefiner();
    EditStatus = MCStatus;
    Status = "EDIT";
    $('#main').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    //$.blockUI();
    var lst_Header = MCList;
    var disjson = jsonPath(lst_Header, "$.[?(@.Campaign_Code=='" + campCode + "')]");
    $("#hdnCampaignCode").val(campCode);
    //$("#hdnMappedDoctorCount").val(mappedDoctorCount);

    $('#txtCampName').val(disjson[0].Campaign_Name);
    $('#txtCampPurpose').val(disjson[0].Campaign_Description);

    $('#dvTabs').tabs('option', 'selected', 0);
    $('#txtStartDate').val(disjson[0].Start_Date);
    $('#txtEndDate').val(disjson[0].End_Date);
    if (disjson[0].Track_From != "" && disjson[0].Track_From != "01/01/1900") {
        $('#txtfrom').val(disjson[0].Track_From);
    } else {
        $('#txtfrom').val("");
    }
    if (disjson[0].Track_Till != "" && disjson[0].Track_Till != "01/01/1900") {
        $('#txtMonths').val(disjson[0].Track_Till);
    } else {
        $('#txtMonths').val("");
    }


    if (disjson[0].Campaign_Based_On == 1) {
        $('#regsel').show();
        $('#rolesel').hide();
        $('#txtCustCountrole').val('');
        $('#txtCustCount').val(disjson[0].Customer_Count);
    } else {
        $('#rolesel').show();
        $('#regsel').hide();
        $('#txtCustCount').val('');
        $('#txtCustCountrole').val(disjson[0].Customer_Count);
    }

    if (disjson[0].Campaign_Based_On == 1) {
        $('input:radio[name=typeSelection][value=1]').attr('checked', true);
    } else {
        $('input:radio[name=typeSelection][value=2]').attr('checked', true);
    }
    CustCount = disjson[0].Customer_Count;
    $('#hdnStatus').val(disjson[0].Record_Status);


    if (disjson[0].Doctor_Product_Mapping_Validation == "Flexi") {
        $('input:radio[name=doctorSelection][value=F]').attr('checked', true);
    }
    else {
        $('input:radio[name=doctorSelection][value=R]').attr('checked', true);
    }
    if (disjson[0].Campaign_Frequency != 0) {
        $('#freqSel').val(disjson[0].Campaign_Frequency);
    } else {
        $('#freqSel').val(0);
    }
    if (disjson[0].Survey != 0) {
        var date = disjson[0].Survey_ValidTo;
        date = date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0];
        $('#ddlsurvey').val(disjson[0].Survey + '|' + date);
    } else {
        $('#ddlsurvey').val(0);
    }
    if (disjson[0].Campaign_Budget != 0 && disjson[0].Campaign_Budget != null) {
        $('#CampBudget').val(disjson[0].Campaign_Budget);
    } else {
        $('#CampBudget').val("");
    }

    $.ajax({
        type: 'POST',
        data: "campaignCode=" + campCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetDoctorCountforRegion',
        success: function (response) {
            jsonDoctorCount = eval('(' + response + ')');
            if (jsonDoctorCount != "" && jsonDoctorCount != null && jsonDoctorCount.length >= 0) {
                //var jsonfilterDoc_Cnt = jsonPath(jsonDoctorCount, "$.[?(@.Mapped_Doctor_Count >='" + customerCount + "')]");
                //if (jsonfilterDoc_Cnt != null && jsonfilterDoc_Cnt.length > 0) {
                $("#hdnMappedDoctorCount").val(jsonDoctorCount[0].Mapped_Doctor_Count);
            }
            else {
                $("#hdnMappedDoctorCount").val("");
            }
        },
        error: function (e) {
        },
        complete: function (e) {
            fnGetOtherDetailstoBindonEdit(campCode, mappedDoctorCount, customerCount, MCStatus);
            //fnEditCampaignBind(campCode, mappedDoctorCount, customerCount, MCStatus);
        }
    });
}
var Selctd_MCDetails = '';
function fnGetOtherDetailstoBindonEdit(campCode, mappedDoctorCount, customerCount, MCStatus) {
    debugger;
    $.ajax({
        type: 'GET',
        data: "campaignCode=" + campCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetCampaignHeaderDetails',
        success: function (response) {
            Selctd_MCDetails = response;
            fnEditCampaignBind(campCode, mappedDoctorCount, customerCount, MCStatus, Selctd_MCDetails);
            //fnBindOtherMCDetails(response);
            //$("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Failed to load details.Please try After Sometime.');
            $("#main").unblock();
        },
        complete: function (e) {

        }
    });

}
function fnEditCampaignBind(campCode, mappedDoctorCount, customerCount, MCStatus, resp) {
    debugger;
    var lst_Header = MCList;
    var disjson = jsonPath(lst_Header, "$.[?(@.Campaign_Code=='" + campCode + "')]");
    //var lst_Categ=MCList.lstDocCateg;
    //var disjsonDocCat = jsonPath(lst_Categ, "$.[?(@.Campaign_Code=='" + campCode + "')]");
    //var lst_Speclty=MCList.lstSpecCateg;
    //var disjsonSpecCat = jsonPath(lst_Speclty, "$.[?(@.Campaign_Code=='" + campCode + "')]");
    //var lst_RegType=MCList.lstDesig;
    //var disjsonDesg = jsonPath(lst_RegType, "$.[?(@.Campaign_Code=='" + campCode + "')]");
    //var lst_ParRegions=MCList.lstMCParRegions;
    //disjsonRegions = jsonPath(lst_ParRegions, "$.[?(@.Campaign_Code=='" + campCode + "')]");
    // fnGetAllRegionUsers(Sel_Region_Code);
    // $('#dvTabs').tabs('option', 'selected', 0);
    disjsonRegions = resp.lstMCParRegions;



    //$('#docCat_' + campCode).val()
    //var docCatArr = $('#docCat_' + campCode).attr('code').split(',');
    for (var g = 0; g < resp.lstDocCateg.length; g++) {
        $("#ddlDocCategory").multiselect("widget").find(":checkbox[value='" + resp.lstDocCateg[g].Doctor_Category_Code + "']").attr("checked", "checked");
        $("#ddlDocCategory option[value='" + resp.lstDocCateg[g].Doctor_Category_Code + "']").attr("selected", true);
    }
    $('#ddlDocCategory').multiselect("destroy").multiselect().multiselectfilter();

    //$('#spec_' + campCode).val()
    //var specArr = $('#spec_' + campCode).attr('code').split(',');
    for (var g = 0; g < resp.lstSpecCateg.length; g++) {
        $("#ddlSpeciality").multiselect("widget").find(":checkbox[value='" + resp.lstSpecCateg[g].Doctor_Speciality_Code + "']").attr("checked", "checked");
        $("#ddlSpeciality option[value='" + resp.lstSpecCateg[g].Doctor_Speciality_Code + "']").attr("selected", true);
    }
    $('#ddlSpeciality').multiselect("destroy").multiselect().multiselectfilter();


    //$('#entity_' + campCode).val()    
    //var entityArr = $('#entity_' + campCode).attr('code').split(',');
    for (var g = 0; g < resp.lstDesig.length; g++) {
        $("#ddlCategory").multiselect("widget").find(":checkbox[value='" + resp.lstDesig[g].Region_Type_Code + "']").attr("checked", "checked");
        $("#ddlCategory option[value='" + resp.lstDesig[g].Region_Type_Code + "']").attr("selected", true);
    }
    $('#ddlCategory').multiselect("destroy").multiselect().multiselectfilter();
    //var entityArr = $('#entity_' + campCode).attr('code').split(',');
    for (var g = 0; g < resp.lstDesig.length; g++) {
        $("#ddlsurveyusers").multiselect("widget").find(":checkbox[value='" + resp.lstDesig[g].User_type_Code + "']").attr("checked", "checked");
        if (resp.lstDesig[g].User_type_Code != undefined) {
            $("#ddlsurveyusers option[value='" + resp.lstDesig[g].User_type_Code + "']").attr("selected", true);

        }
    }
    $('#ddlsurveyusers').multiselect("destroy").multiselect().multiselectfilter();

    //dvproduct clear
    $("#dvproduct").empty();

    var DPM_Count = $("#hdnMappedDoctorCount").val();
    if (MCStatus == 'UnApproved') {
        if (disjson[0].Survey != 0) {
            $('#ddlsurvey').attr('disabled', true);
        } else {
            $('#ddlsurvey').attr('disabled', false);
        }
        for (var g = 0; g < resp.lstDesig.length; g++) {
            if (resp.lstDesig[g].User_type_Code != null) {
                $("#ddlsurveyusers").multiselect('disable');
            }
            else {
                $("#ddlsurveyusers").multiselect("widget").find(":checkbox[value='" + resp.lstDesig[g].User_type_Code + "']").attr("disabled", false);
            }
        }
        if (DPM_Count > 0) {
            $('#txtCampName').attr('disabled', true);
            $('#txtStartDate').attr('disabled', true);
            $('#txtEndDate').attr('disabled', true);

            for (var g = 0; g < resp.lstSpecCateg.length; g++) {
                $("#ddlSpeciality").multiselect("widget").find(":checkbox[value='" + resp.lstSpecCateg[g].Doctor_Speciality_Code + "']").attr("disabled", true);

            }
            for (var g = 0; g < resp.lstDocCateg.length; g++) {
                $("#ddlDocCategory").multiselect("widget").find(":checkbox[value='" + resp.lstDocCateg[g].Doctor_Category_Code + "']").attr("disabled", true);

            }
            for (var g = 0; g < resp.lstDesig.length; g++) {
                $("#ddlCategory").multiselect("widget").find(":checkbox[value='" + resp.lstDesig[g].Region_Type_Code + "']").attr("disabled", true);
            }

            $('input:radio[name=doctorSelection]').attr('disabled', true);
            $('input:radio[name=typeSelection]').attr('disabled', true);

            if (disjson[0].Campaign_Frequency != 0) {
                $('#freqSel').attr('disabled', true);
            } else {
                $('#freqSel').attr('disabled', false);
            }



        }
    }
    else if (MCStatus == 'Approved' || MCStatus == 'Applied') {
        $('#txtCampName').attr('disabled', true);
        $('#txtStartDate').attr('disabled', true);
        $('#txtEndDate').attr('disabled', true);
        if (disjson[0].Campaign_Based_On == 1) {
            $('#txtCustCount').attr('disabled', true);

        } else {
            $('#txtCustCountrole').attr('disabled', true);

        }
        if (disjson[0].Campaign_Frequency != 0) {
            $('#freqSel').attr('disabled', true);
        } else {
            $('#freqSel').attr('disabled', false);
        }
        if (disjson[0].Survey != 0) {
            $('#ddlsurvey').attr('disabled', true);
        } else {
            $('#ddlsurvey').attr('disabled', false);
        }
        $("#ddlSpeciality").multiselect('disable');
        $("#ddlDocCategory").multiselect('disable');
        $("#ddlCategory").multiselect('disable');
        for (var g = 0; g < resp.lstDesig.length; g++) {
            if (resp.lstDesig[g].User_type_Code != null) {
                $("#ddlsurveyusers").multiselect('disable');
            }
            else {
                $("#ddlsurveyusers").multiselect("widget").find(":checkbox[value='" + resp.lstDesig[g].User_type_Code + "']").attr("disabled", false);
            }
        }
        $('input:radio[name=doctorSelection]').attr('disabled', true);
        $('input:radio[name=typeSelection]').attr('disabled', true);
    }
    fnObjectiveLength();
    fnPrefillProductTable(campCode);
}

//function fnBindAllSelectedRegions(regionslist) {
//    debugger;

//}

function fnPrefillProductTable(campaignCode) {
    debugger;
    var DPM_Count = $("#hdnMappedDoctorCount").val();
    //$('#main').block({
    //    message: '<h3>Processing</h3>',
    //    css: { border: '2px solid #ddd' }
    //});

    $.ajax({
        type: 'POST',
        data: "campaignCode=" + campaignCode,
        url: '../HiDoctor_Master/MarketingCampaign/GetMarketingCampaignProductDetailsList',
        success: function (response) {

            var jProd = eval(response);
            if (jProd != "" && jProd != null && jProd.length > 0) {
                var saleProdArr = [];
                $.each(jProd, function () {
                    if ($.inArray(this.Product_Code, saleProdArr) === -1) {
                        saleProdArr.push(this.Product_Code);
                    }
                });
                var rowidx = 0;
                for (var pd = 0; pd < saleProdArr.length; pd++) {
                    // debugger;
                    if (pd == 0) {
                        fnCreateProductTable("LOAD");
                        rowidx++;
                    }
                    else {

                        var objProd = [];
                        objProd.id = "_" + rowidx;
                        fnCreateProductTable(objProd);

                        rowidx++;


                    }
                    if (pd < saleProdArr.length) {
                        //debugger;
                        var sampleJson = jsonPath(jProd, "$.[?(@.Product_Code=='" + saleProdArr[pd] + "')]");
                        $("#txtsale_" + rowidx).val(sampleJson[0].Product_Name);
                        $("#hdnsale_" + rowidx).val(sampleJson[0].Product_Code);
                        $("#hiddenflag_" + rowidx).val(1);
                        if (sampleJson[0].ROI != 0) {
                            $("#ROI_" + rowidx).val(sampleJson[0].ROI);
                        } else {
                            $("#ROI_" + rowidx).val("");
                        }
                        if (EditStatus == 'Approved' || EditStatus == 'Applied' || (EditStatus == 'UnApproved' && DPM_Count > 0)) {
                            $("#txtsale_" + rowidx).attr('disabled', true);
                        }


                        var subrowidx = 1;
                        for (var sam = 0; sam < sampleJson.length; sam++) {
                            //debugger;

                            var objsamProd = '';
                            var ObjSamProd = [];
                            objsamProd = "_" + rowidx + "_" + subrowidx;
                            ObjSamProd.id = "_" + rowidx + "_" + subrowidx;
                            fnShowInputsOnselect(sampleJson[sam].Input_Type, objsamProd);
                            if (sampleJson.length > 1) {
                                if (sampleJson[sam].Input_Type != null) {
                                    fnCreateSampleProductNewRow(ObjSamProd);
                                }
                            } else if (sampleJson.length == 1) {
                                if (sampleJson[sam].Input_Type != null) {
                                    fnCreateSampleProductNewRow(ObjSamProd);
                                }
                            }


                            if (sam < sampleJson.length) {
                                if (sampleJson[sam].Input_Type == "PI") {
                                    $("#inpttype_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Input_Type);
                                    $("#txtsample_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Sample_Name);
                                    $("#hdnsample_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Sample_Code);
                                    $("#hiddenflagsamp_" + (pd + 1) + "_" + subrowidx).val(1);
                                    //<input type="hidden" id="hiddenflagsamp_MAINNUM_SUBNUM" value="0"/>
                                    if (sampleJson[sam].Quantity != 0) {
                                        $("#txtQuantity_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Quantity);
                                    } else {
                                        $("#txtQuantity_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Visit_Order != 0) {
                                        $("#txtvisitorder_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Visit_Order);
                                    } else {
                                        $("#txtvisitorder_" + (pd + 1) + "_" + subrowidx).val("");
                                    }

                                    if (sampleJson[sam].Due_Date != '' && sampleJson[sam].Due_Date != null && sampleJson[sam].Due_Date != "01/01/1900") {
                                        var Due_Date = sampleJson[sam].Due_Date.split(' ')[0];
                                        Due_Date = Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0] + '/' + Due_Date.split('/')[2];
                                        $("#txtDueDate_" + (pd + 1) + "_" + subrowidx).val(Due_Date);

                                    } else {
                                        $("#txtDueDate_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Start_Date != '' && sampleJson[sam].Start_Date != null && sampleJson[sam].Start_Date != "01/01/1900") {
                                        var Start_Date = sampleJson[sam].Start_Date.split(' ')[0];
                                        Start_Date = Start_Date.split('/')[1] + '/' + Start_Date.split('/')[0] + '/' + Start_Date.split('/')[2];
                                        $("#txtStartDate_" + (pd + 1) + "_" + subrowidx).val(Start_Date);

                                    } else {
                                        $("#txtStartDate_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Line_Item_Budget != "" && sampleJson[sam].Line_Item_Budget != 0 && sampleJson[sam].Line_Item_Budget != null) {
                                        $("#txtBudget_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Line_Item_Budget);
                                    } else {
                                        $("#txtBudget_" + (pd + 1) + "_" + subrowidx).val('');
                                    }

                                    if (EditStatus == 'Approved' || EditStatus == 'Applied' || (EditStatus == 'UnApproved' && DPM_Count > 0)) {
                                        $("#inpttype_" + (pd + 1) + "_" + subrowidx).attr('disabled', true);
                                        $("#txtsample_" + (pd + 1) + "_" + subrowidx).attr('disabled', true);

                                    } else if (EditStatus == 'UnApproved') {
                                        $("#inpttype_" + (pd + 1) + "_" + subrowidx).attr('disabled', true);
                                    }


                                } else if (sampleJson[sam].Input_Type == "A") {
                                    $("#inpttype_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Input_Type);
                                    $("#txtactivity" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Activity_Name);
                                    $("#hdnactivityval_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Activity_Id);
                                    $("#hiddenflagact" + (pd + 1) + "_" + subrowidx).val(1);
                                    if (sampleJson[sam].Quantity != 0) {
                                        $("#txtQuantity_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Quantity);

                                    } else {
                                        $("#txtQuantity_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Visit_Order != 0) {
                                        $("#txtvisitorder_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Visit_Order);
                                    } else {
                                        $("#txtvisitorder_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Due_Date != '' && sampleJson[sam].Due_Date != null && sampleJson[sam].Due_Date != "01/01/1900") {
                                        var Due_Date = sampleJson[sam].Due_Date.split(' ')[0];
                                        Due_Date = Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0] + '/' + Due_Date.split('/')[2];
                                        $("#txtDueDate_" + (pd + 1) + "_" + subrowidx).val(Due_Date);

                                    } else {
                                        $("#txtDueDate_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Start_Date != '' && sampleJson[sam].Start_Date != null && sampleJson[sam].Start_Date != "01/01/1900") {
                                        var Start_Date = sampleJson[sam].Start_Date.split(' ')[0];
                                        Start_Date = Start_Date.split('/')[1] + '/' + Start_Date.split('/')[0] + '/' + Start_Date.split('/')[2];
                                        $("#txtStartDate_" + (pd + 1) + "_" + subrowidx).val(Start_Date);

                                    } else {
                                        $("#txtStartDate_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Line_Item_Budget != "" && sampleJson[sam].Line_Item_Budget != 0 && sampleJson[sam].Line_Item_Budget != null) {
                                        $("#txtBudget_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Line_Item_Budget);
                                    } else {
                                        $("#txtBudget_" + (pd + 1) + "_" + subrowidx).val('');
                                    }
                                    $('#txtactivity_' + (pd + 1) + '_' + subrowidx).val(sampleJson[sam].Activity_Name);
                                    $('#hdnactivityval_' + (pd + 1) + '_' + subrowidx).val(sampleJson[sam].Activity_Id);


                                    if (EditStatus == 'Approved' || EditStatus == 'Applied' || (EditStatus == 'UnApproved' && DPM_Count > 0)) {
                                        $("#inpttype_" + (pd + 1) + "_" + subrowidx).attr('disabled', true);
                                        $("#txtactivity_" + (pd + 1) + "_" + subrowidx).attr('disabled', true);

                                    } else if (EditStatus == 'UnApproved') {
                                        $("#inpttype_" + (pd + 1) + "_" + subrowidx).attr('disabled', true);
                                    }
                                } else if (sampleJson[sam].Input_Type == "0") {
                                    $("#inpttype_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Input_Type);
                                    //$("#hiddenflagsamp_" + (pd + 1) + "_" + subrowidx).val(1);
                                    if (sampleJson[sam].Quantity != 0) {
                                        $("#txtQuantity_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Quantity);

                                    } else {
                                        $("#txtQuantity_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Visit_Order != 0) {
                                        $("#txtvisitorder_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Visit_Order);
                                    } else {
                                        $("#txtvisitorder_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Due_Date != '' && sampleJson[sam].Due_Date != null && sampleJson[sam].Due_Date != "01/01/1900") {
                                        var Due_Date = sampleJson[sam].Due_Date.split(' ')[0];
                                        Due_Date = Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0] + '/' + Due_Date.split('/')[2];
                                        $("#txtDueDate_" + (pd + 1) + "_" + subrowidx).val(Due_Date);
                                    } else {
                                        $("#txtDueDate_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Start_Date != '' && sampleJson[sam].Start_Date != null && sampleJson[sam].Start_Date != "01/01/1900") {
                                        var Start_Date = sampleJson[sam].Start_Date.split(' ')[0];
                                        Start_Date = Start_Date.split('/')[1] + '/' + Start_Date.split('/')[0] + '/' + Start_Date.split('/')[2];
                                        $("#txtStartDate_" + (pd + 1) + "_" + subrowidx).val(Start_Date);

                                    } else {
                                        $("#txtStartDate_" + (pd + 1) + "_" + subrowidx).val("");
                                    }
                                    if (sampleJson[sam].Line_Item_Budget != "" && sampleJson[sam].Line_Item_Budget != 0 && sampleJson[sam].Line_Item_Budget != null) {
                                        $("#txtBudget_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Line_Item_Budget);
                                    } else {
                                        $("#txtBudget_" + (pd + 1) + "_" + subrowidx).val('');
                                    }
                                }
                            }

                            subrowidx++;
                        }
                    }
                    //if (pd >= 1) {
                    //    rowidx++;
                    //}
                }
            }
            else {
                fnCreateProductTable("LOAD");
            }
            //$("#main").unblock();
            //$.unblockUI();
            if (EditStatus != 'Approved' && EditStatus != 'Applied') {
                if (DPM_Count >= 0) {
                    var objProd = [];
                    objProd.id = "_" + rowidx;
                    fnCreateProductTable(objProd);
                    rowidx++;
                }
            }
        },
        error: function (e) {
            fnMsgAlert('info', 'Marketing Campaign', 'Error.Please Try After Sometime.');
            //$("#main").unblock();
            $.unblockUI();
        },
        complete: function (e) {
            fnRegionBindTreeAlreadySelected();
        }
    });
    //fnGetAllRegionUsers(Sel_Region_Code);
    //fnShowChckBoxOnlywithDocCount(DocCountRegions);

}


function fnValidateMarketingCampaignDefiner() {    // empty check
    debugger;
    var flag = true;
    if ($.trim($('#txtCampName').val()) == "") {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Marketing Campaign Name.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    //special char check   
    if (regExforAlphaNumericSpecificRemarks($("#txtCampName").val()) == false) {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Campaign Name.');
        flag = false;
        return;
    }
    if (regExforAlphaNumericSpecificRemarks($("#txtCampPurpose").val()) == false) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Campaign Description.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    //Date validation

    if ($.trim($('#txtStartDate').val()) == "") {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select Start Date.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    if ($.trim($('#txtEndDate').val()) == "") {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select End Date.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    var ttDate = "";
    var TtDate = '';
    var tfDate = '';
    var TfDate = '';
    var fromDate = $("#txtStartDate").val().split('/')[2] + '/' + $("#txtStartDate").val().split('/')[1] + '/' + $("#txtStartDate").val().split('/')[0];
    var toDate = $("#txtEndDate").val().split('/')[2] + '/' + $("#txtEndDate").val().split('/')[1] + '/' + $("#txtEndDate").val().split('/')[0];
    if ($("#txtMonths").val() != undefined && $("#txtMonths").val() != '') {
        ttDate = $("#txtMonths").val().split('/')[2] + '/' + $("#txtMonths").val().split('/')[1] + '/' + $("#txtMonths").val().split('/')[0];
        TtDate = new Date(ttDate);
    }
    if ($('#txtfrom').val() != undefined && $('#txtfrom').val() != '') {
        tfDate = $('#txtfrom').val().split('/')[2] + '/' + $('#txtfrom').val().split('/')[1] + '/' + $('#txtfrom').val().split('/')[0];
        TfDate = new Date(tfDate);
    }
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);


    //Invalid Date   

    if (!(fnValidateDateFormate($("#txtStartDate"), "Start Date"))) {
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    if (!(fnValidateDateFormate($("#txtEndDate"), "End Date"))) {
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    if (startDate > endDate) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'End date can not be less than Start date.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    if (TfDate != undefined && TfDate != '') {
        if ((TfDate > endDate) || (TfDate < startDate)) {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Track From Date should be in between Start Date And End Date');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
    }


    if (TtDate != undefined && TtDate != "") {
        if (TtDate < startDate) {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Track Till Date can not be less than Start date.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if (TfDate != undefined && TfDate != '') {
            if (TtDate < TfDate) {
                fnMsgAlert('info', 'Marketing Campaign Definer', 'Track Till Date can not be less than Track From Date.');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
            if ((TfDate > endDate) || (TfDate < startDate)) {
                fnMsgAlert('info', 'Marketing Campaign Definer', 'Track From Date should be in between Start Date And End Date');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
            if (TtDate < endDate) {
                fnMsgAlert('info', 'Marketing Campaign Definer', 'Track Till Date should be greater than End Date');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
        }
    }
    //Region(s) Selection Validation

    var Regions_Par_lngth = $('#treebody .dynatree-selected').length;
    if (Regions_Par_lngth == 0) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select Atleast One Region to Participate in the Campaign.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    var total_Budget = $('#CampBudget').val();
    if (total_Budget != "") {
        if (total_Budget == 0) {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Budget of the Campaign cannot be Zero(0).Please Enter valid Budget.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
    }

    //Region Type Selection
    if ($('select#ddlCategory > option:selected').length <= 0) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select Atleast One Region Type.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    var entity_Names = new Array();
    $('select#ddlCategory > option:selected').each(function () {
        // entityCode += $(this).val() + ',';
        entity_Names.push($(this).text().split('(')[0]);
    });
    if ($('select#ddlsurveyusers > option:selected').length <= 0 && ($('#ddlsurvey :selected').val() != 0 && $('#ddlsurvey :selected').val() != undefined)) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select Atleast One Region Type.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    var entity_Names = new Array();
    $('select#ddlsurveyusers > option:selected').each(function () {
        // entityCode += $(this).val() + ',';
        entity_Names.push($(this).text().split('(')[0]);
    });
    //Campaign Based On Selection
    if ($('input:radio[name=typeSelection]:checked').length <= 0) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Campaign Based On.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    //Customer_Count Based On Campaign_Based_On


    if ($('input:radio[name=typeSelection]:checked').val() == 1) {
        if ($.trim($('#txtCustCount').val()) == "") {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Customer Count Per Territory.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if ($.trim($('#txtCustCount').val()) == 0) {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Customer Count Per Territory other than Zero(0).');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if (CustCount != "") {
            if ($.trim($('#txtCustCount').val()) != "") {
                if ($('#txtCustCount').val() < CustCount) {
                    fnMsgAlert('info', 'Marketing Campaign Definer', 'Customer Count Per Territory cannot be reduced for Approved or UnApproved Marketing Campaigns.');
                    $('#txtCustCount').html(CustCount);
                    HideModalPopup("dvloading");
                    flag = false;
                    return;
                }

            }
        }
    } else {
        if ($.trim($('#txtCustCountrole').val()) == "") {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Customer Count Per Role.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if (CustCount != "") {
            if ($.trim($('#txtCustCountrole').val()) != "") {
                if ($('#txtCustCountrole').val() < CustCount) {
                    fnMsgAlert('info', 'Marketing Campaign Definer', 'Customer Count Per Role cannot be reduced for Approved or UnApproved Marketing Campaigns.');
                    $('#txtCustCountrole').html(CustCount);
                    HideModalPopup("dvloading");
                    flag = false;
                    return;
                }

            }
        }

    }

    //Customer Selection
    if ($('input:radio[name=doctorSelection]:checked').length <= 0) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Customer Selection.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    if ($('input:radio[name=doctorSelection]:checked').val() == "R") {
        if ($('input:radio[name=typeSelection]:checked').val() == 1) {
            if (parseInt($("#txtCustCount").val()) == 0) {
                fnMsgAlert('info', 'Marketing Campaign Definer', 'Customer count per Territory cannot be zero when doctor selection is rigid.');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
        } else {
            if (parseInt($("#txtCustCountrole").val()) == 0) {
                fnMsgAlert('info', 'Marketing Campaign Definer', 'Customer count per role cannot be zero when doctor selection is rigid.');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
        }



        // For Edit check Doctor product mapping
        if ($("#hdnCampaignCode").val() != "" && $("#hdnMappedDoctorCount").val() != "0") {
            if (parseInt($("#txtCustCount").val()) < parseInt($("#hdnMappedDoctorCount").val())) {
                fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already mapped ' + $("#hdnMappedDoctorCount").val() + ' doctors for this campaign.So you cannot enter Customer count which is less than ' + $("#hdnMappedDoctorCount").val() + ' .');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
        }
    }



    //Customer Category
    if ($('select#ddlDocCategory > option:selected').length <= 0) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select Atleast One Customer Category.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    //Customer Speciality
    if ($('select#ddlSpeciality > option:selected').length <= 0) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select Atleast One Customer Speciality.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    //Budget Of the Campaign
    //if($('#CampBudget').val()!=""){
    //    if()
    //}




    ////Frequency Of the  Campaign
    //var FreqCam=$('#freqSel>selected').val();
    //if(FreqCam==0){
    //    fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select Frequency of the Campaign.');
    //    HideModalPopup("dvloading");
    //    flag = false;
    //    return;
    //}   


    //numeric value check
    if (isNaN($("#txtCustCount").val())) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please enter only numbers in Customer Count.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    if (parseInt($("#txtCustCount").val()) < 0) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Negative numbers are not allowed for Customer Count.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    //int range check
    if (!(fnCheckInt($("#txtCustCount")))) {
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    var campcode = $("#hdnCampaignCode").val();
    if (campcode == "") {
        var condt = false;
        var CampName = $.trim($('#txtCampName').val());
        if (ExistingCampaigns.length >= 1) {
            for (var i = 0; i < ExistingCampaigns.length; i++) {
                if (CampName.toUpperCase().replace(/[^A-Z0-9]/ig, '') == ExistingCampaigns[i].toUpperCase().replace(/[^A-Z0-9]/ig, ''))
                    condt = true;
            }
        }
        if (condt == true) {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Combination of Campaign name , Region name Already exist.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
    }
    //if (SelTitleKeys.length >= 1) {
    //    for (var i = 0; i < SelTitleKeys.length; i++) {
    //        if (SelTitleKeys[i].split('-')[1] == "VACANT") {
    //            fnMsgAlert('info', 'Marketing Campaign Definer', 'Region with Vacant User cannot participate in the Campaign.Please select different Region having User or Assign User to the Region Selected "' + SelTitleKeys[i].split('-')[1] + '".');
    //            HideModalPopup("dvloading");
    //            flag = false;
    //            return;
    //        }
    //        if (flag == false) {
    //            return flag;
    //        }
    //    }
    //}
    var ParRegionsEntityNames = new Array();
    if (SelTitleKeys.length >= 1) {
        for (var i = 0; i < SelTitleKeys.length; i++) {
            var regiontype = SelTitleKeys[0].split('(')[1].split(')')[0];
            if ($.inArray(regiontype, ParRegionsEntityNames) == -1) {
                ParRegionsEntityNames.push(regiontype);
            }
        }
    }
    //if (ParRegionsEntityNames.length >= 1 && entity_Names.length >= 1) {
    //    var result = fncheckIfArrayIsUniqueTwoArrays(ParRegionsEntityNames, entity_Names);
    //    var unmatchtypes = '';
    //    if (result.length > 0) {
    //        for (var i = 0; i < result.length; i++) {
    //            unmatchtypes += result[i];
    //            if (i < result.length - 1) {
    //                unmatchtypes += ',';
    //            }
    //        }
    //        fnMsgAlert('info', 'Marketing Campaign Definer', 'The Selected Region Type(s) "' + unmatchtypes + '" Region(s) are not Selected in Participating Region(s).');
    //        HideModalPopup("dvloading");           
    //        flag = false;
    //        return;

    //    }

    //}
    //var FreqCam = $('#freqSel :selected').val();
    //var range = '';
    //var rdd = '';
    //var rmm = '';
    //var ryy = '';
    //var rdate = '';
    //if (FreqCam != 0 && fromDate != undefined && fromDate != "" && toDate != "" && toDate != undefined) {
    //    var entered_Date_Diff = dateDiffInDays(fromDate, toDate);
    //    if (FreqCam == '1') {
    //        var today = new Date();
    //        //today.setMonth(today.getMonth() + 1);
    //        rdd = today.getDate();
    //        rmm = today.getMonth() + 2;
    //        ryy = today.getFullYear();
    //        rdate = ryy + '/' + rmm + '/' + rdd;
    //    } else if (FreqCam == '2') {
    //        var today = new Date();
    //        //today.setMonth(today.getMonth() + 3);
    //        rdd = today.getDate();
    //        rmm = today.getMonth() + 4;
    //        ryy = today.getFullYear();
    //        rdate = ryy + '/' + rmm + '/' + rdd;
    //    } else if (FreqCam == '3') {
    //        var today = new Date();
    //        //today.setMonth(today.getMonth() + 6);
    //        rdd = today.getDate();
    //        rmm = today.getMonth() + 7;
    //        ryy = today.getFullYear();
    //        rdate = ryy + '/' + rmm + '/' + rdd;
    //    } else if (FreqCam == '4') {
    //        var today = new Date();
    //        //today.setMonth(today.getMonth() + 12);
    //        rdd = today.getDate();
    //        rmm = today.getMonth() + 1;
    //        ryy = today.getFullYear()+1;
    //        rdate = ryy + '/' + rmm + '/' + rdd;
    //    }
    //    range = dateDiffInDays(fromDate, rdate);
    //    if (entered_Date_Diff != "" && range != "") {
    //        var valdiff = entered_Date_Diff / range;
    //        if (valdiff > 1) {
    //            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Select Start Date and End Date of the Campaign according to the Selected Frequency.');
    //            HideModalPopup("dvloading");
    //            flag = false;
    //            return;
    //        }
    //    }
    //}


    //Product Box Check
    var uniqueProd = new Array();
    var Line_Item_Budget_Array = new Array();
    for (var a = 1; a <= $(".dvsalebox").length; a++) {
        var sample_Lngth_Det = $(".sample_" + a).length;
        if ($("#txtsale_" + a).val() != "") {


            if ($("#hiddenflag_" + a).val() == 0) {
                var saleJson = jsonPath(saleProd_g, "$.[?(@.value=='" + $("#hdnsale_" + a).val() + "')]");
                if (saleJson == false || saleJson === undefined) {
                    fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Valid Sale Product.');
                    HideModalPopup("dvloading");
                    $("#txtsale_" + a).focus();
                    flag = false;
                    return;
                }

                // unique check
                if ($.inArray($("#hdnsale_" + a).val(), uniqueProd) > -1) {
                    fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already entered the product ' + $("#txtsale_" + a).val() + '.');
                    HideModalPopup("dvloading");
                    $("#txtsale_" + a).focus();
                    flag = false;
                    return;
                }
                else {
                    uniqueProd.push($("#hdnsale_" + a).val());
                }
            }
            if ($("#txtsale_" + a).val() != "" && $("#hdnsale_" + a).val() != 0) {
                uniqueProd.push($("#hdnsale_" + a).val());
            }



            // sample Product
            var uniqSampPrdVisitOrd = new Array();
            var uniqActivity = new Array();
            var uniqvisitorder = new Array();
            var sample_Lngth = $(".sample_" + a).length;
            var uniqueflexiActivity = new Array();
            $('.sample_' + a).each(function (index, obj) {
                Acondt = false;
                var rowid = obj.id.replace("sample_", "");

                var InputType = $("#inpttype_" + rowid + " >:selected").val();
                if (InputType == "PI") {

                    if ($("#hiddenflagsamp_" + rowid).val() == 0) {


                        if ($("#txtsample_" + rowid).val() == '' && InputType != '') {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Sample Product.');
                            HideModalPopup("dvloading");
                            $("#txtsample_" + rowid).focus();
                            flag = false;
                            return;
                        }

                        if ($("#txtsample_" + rowid).val() != "") {
                            var sampleJson = jsonPath(sampleProd_g, "$.[?(@.value=='" + $("#hdnsample_" + rowid).val() + "')]");
                            if (sampleJson == false || sampleJson === undefined) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Valid Sample Product.');
                                HideModalPopup("dvloading");
                                $("#txtsample_" + rowid).focus();
                                flag = false;
                                return;
                            }
                        }

                        if ($("#txtvisitorder_" + rowid).val() != "") {
                            if (parseInt($("#txtvisitorder_" + rowid).val()) < 1) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Visit Order cannot be less than 1.');
                                HideModalPopup("dvloading");
                                $("#txtvisitorder_" + rowid).focus();
                                flag = false;
                                return;
                            }
                        }


                        // unique sample product and visit order for a sale product check
                        if ($.inArray($("#hdnsample_" + rowid).val(), uniqSampPrdVisitOrd) > -1) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already entered the sample ' + $("#txtsample_" + rowid).val() + ' for visit order ' + $("#txtvisitorder_" + rowid).val() + ' for the sale product ' + $("#txtsale_" + a).val() + '.');
                            HideModalPopup("dvloading");
                            $("#txtvisitorder_" + rowid).focus();
                            flag = false;
                            return;
                        }
                        else {
                            uniqSampPrdVisitOrd.push($("#hdnsample_" + rowid).val());

                        }
                    }
                    if ($("#txtsample_" + rowid).val() != "" && $("#hdnsample_" + rowid).val() != 0) {
                        uniqSampPrdVisitOrd.push($("#hdnsample_" + rowid).val());
                    }

                    if ($("#txtQuantity_" + rowid).val() != "") {
                        if (parseInt($("#txtQuantity_" + rowid).val()) < 0) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Quantity cannot be a negative number.');
                            HideModalPopup("dvloading");
                            $("#txtQuantity_" + rowid).focus();
                            flag = false;
                            return;
                        }
                    }
                    var Due_Date = $('#txtDueDate_' + rowid).val();
                    if (Due_Date != '' && Due_Date != undefined) {
                        Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                        var duedate = new Date(Due_Date);
                        if ((duedate > endDate) || (duedate < startDate)) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Due Date between Start Date and End Date');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                    }
                    var Start_Date_LI = $('#txtStartDate_' + rowid).val();

                    if (Start_Date_LI != '' && Start_Date_LI != undefined) {
                        Start_Date_LI = Start_Date_LI.split('/')[2] + '/' + Start_Date_LI.split('/')[1] + '/' + Start_Date_LI.split('/')[0];
                        var Start_Date_li = new Date(Start_Date_LI);
                        if ((Start_Date_li > endDate) || (Start_Date_li < startDate)) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Line Item Start Date between Campaign Start Date and Campaign End Date');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                    }
                    if (Start_Date_LI != "" && Start_Date_LI != undefined && Due_Date != "" && Due_Date != undefined) {
                        //Start_Date_LI = Start_Date_LI.split('/')[2] + '/' + Start_Date_LI.split('/')[1] + '/' + Start_Date_LI.split('/')[0];
                        var Start_Date_li = new Date(Start_Date_LI);
                        //Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                        var duedate = new Date(Due_Date);
                        if (Start_Date_li > duedate) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Line Item Due Date greater than Start Date');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                    }
                    if (parseInt($('#txtBudget_' + rowid).val()) == 0) {
                        fnMsgAlert('info', 'Marketing Campaign Definer', 'Line Item cannot be Zero(0).Please Enter Other than Zero(0)');
                        HideModalPopup("dvloading");
                        flag = false;
                        return;
                    } else if ($('#txtBudget_' + rowid).val() != "" && $('#txtBudget_' + rowid).val() != undefined && $('#txtBudget_' + rowid).val() != null) {
                        Line_Item_Budget_Array.push($('#txtBudget_' + rowid).val());
                    }

                }
                else if (InputType == "A") {
                    if (InputType == "A" && $('#txtactivity_' + rowid).val() == '') {
                        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Activity Name for the Selected Input');
                        $("#txtsample_" + rowid).focus();
                        HideModalPopup("dvloading");
                        flag = false;
                        return;
                    }

                    if ($('#txtactivity_' + rowid).val() != '') {
                        if ($("#hiddenflagact_" + rowid).val() == 0) {
                            if ($('#hdnactivityval_' + rowid).val() == 0) {
                                for (var i = 0; i < Activities_g.length; i++) {
                                    if (Activities_g[i].label.replace(/[^A-Z0-9]/ig, '').toUpperCase() == $('#txtactivity_' + rowid).val().replace(/[^A-Z0-9]/ig, '').toUpperCase()) {
                                        Acondt = true;
                                    }

                                }
                                if (Acondt == true) {
                                    fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already entered the Activity name "' + $('#txtactivity_' + rowid).val() + '".Please select the Activity from list');
                                    HideModalPopup("dvloading");
                                    flag = false;
                                    return;
                                }
                            }
                        }
                    }

                    if ($.inArray($('#hdnactivityval_' + rowid).val(), uniqActivity) > -1) {
                        fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already entered the Activity ' + $('#txtactivity_' + rowid).val() + ' for visit order ' + $("#txtvisitorder_" + rowid).val() + ' for the sale product ' + $("#txtsale_" + a).val() + '.');
                        HideModalPopup("dvloading");
                        $('#txtactivity_' + rowid).focus();
                        flag = false;
                        return;
                    }
                    else {
                        if ($('#hdnactivityval_' + rowid).val() != 0 && $('#hdnactivityval_' + rowid).val() != undefined) {
                            uniqActivity.push($('#hdnactivityval_' + rowid).val());
                        }
                    }
                    if (regExforAlphaNumericSpecificRemarks($("#txtsample_" + rowid).val()) == false) {
                        fnMsgAlert('info', 'Marketing Campaign Definer', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Activity.')
                        HideModalPopup("dvloading");
                        flag = false;
                        return;
                    }
                    if ($('#hdnactivityval_' + rowid).val() == 0) {
                        var flexiactivity = $('#txtactivity_' + rowid).val();
                        uniqueflexiActivity.push(flexiactivity);
                    }

                    var Due_Date = $('#txtDueDate_' + rowid).val();

                    if (Due_Date != '' && Due_Date != undefined) {
                        Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                        var duedate = new Date(Due_Date);
                        if ((duedate > endDate) || (duedate < startDate)) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Due Date between Start Date and End Date');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                    }

                    var Start_Date_LI = $('#txtStartDate_' + rowid).val();

                    if (Start_Date_LI != '' && Start_Date_LI != undefined) {
                        Start_Date_LI = Start_Date_LI.split('/')[2] + '/' + Start_Date_LI.split('/')[1] + '/' + Start_Date_LI.split('/')[0];
                        var Start_Date_LI = new Date(Start_Date_LI);
                        if ((Start_Date_LI > endDate) || (Start_Date_LI < startDate)) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Line Item Start Date between Campaign Start Date and Campaign End Date');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                    }
                    if (Start_Date_LI != "" && Start_Date_LI != undefined && Due_Date != "" && Due_Date != undefined) {
                        //Start_Date_LI = Start_Date_LI.split('/')[2] + '/' + Start_Date_LI.split('/')[1] + '/' + Start_Date_LI.split('/')[0];
                        var Start_Date_li = new Date(Start_Date_LI);
                        //Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                        var duedate = new Date(Due_Date);
                        if (Start_Date_li > duedate) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Line Item Due Date greater than Start Date');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                    }
                    if (parseInt($('#txtBudget_' + rowid).val()) == 0) {
                        fnMsgAlert('info', 'Marketing Campaign Definer', 'Line Item cannot be Zero(0).Please Enter Other than Zero(0)');
                        HideModalPopup("dvloading");
                        flag = false;
                        return;
                    } else if ($('#txtBudget_' + rowid).val() != "" && $('#txtBudget_' + rowid).val() != undefined && $('#txtBudget_' + rowid).val() != null) {
                        Line_Item_Budget_Array.push($('#txtBudget_' + rowid).val());
                    }
                }
            });
            if (flag == false) {
                return false;
            }
        } else if ($("#txtsale_" + a).val() == "") {

            // sample Product
            var uniqSampPrdVisitOrd = new Array();
            var uniqActivity = new Array();
            var sample_Lngth = $(".sample_" + a).length;
            if (sample_Lngth >= 1) {

                $('.sample_' + a).each(function (index, obj) {
                    Acondt = false;
                    var rowid = obj.id.replace("sample_", "");

                    var InputType = $("#inpttype_" + rowid + " >:selected").val();


                    if (InputType == "PI") {
                        //if ($("#hiddenflagsamp_" + rowId).val() == 0) {
                        if ($("#txtsale_" + a).val() == '' && InputType != 0) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Sale Product.');
                            HideModalPopup("dvloading");
                            $("#txtsale_" + a).focus();
                            flag = false;
                            return;
                        }
                        if ($("#hiddenflagsamp_" + rowid).val() == 0) {
                            if ($("#txtsample_" + rowid).val() != "") {

                                var sampleJson = jsonPath(sampleProd_g, "$.[?(@.value=='" + $("#hdnsample_" + rowid).val() + "')]");
                                if (sampleJson == false || sampleJson === undefined) {
                                    fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Valid Sample Product.');
                                    HideModalPopup("dvloading");
                                    $("#txtsample_" + rowid).focus();
                                    flag = false;
                                    return;
                                }
                            }
                        }

                        if ($("#txtvisitorder_" + rowid).val() != "") {
                            if (parseInt($("#txtvisitorder_" + rowid).val()) < 1) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Visit Order cannot be less than 1.');
                                HideModalPopup("dvloading");
                                $("#txtvisitorder_" + rowid).focus();
                                flag = false;
                                return;
                            }
                        }
                        else {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please enter Visit Order.');
                            HideModalPopup("dvloading");
                            $("#txtvisitorder_" + rowid).focus();
                            flag = false;
                            return;
                        }

                        // unique sample product and visit order for a sale product check
                        if ($.inArray($("#hdnsample_" + rowid).val() + '_' + $("#txtvisitorder_" + rowid).val(), uniqSampPrdVisitOrd) > -1) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already entered the sample ' + $("#txtsample_" + rowid).val() + ' for visit order ' + $("#txtvisitorder_" + rowid).val() + ' for the sale product ' + $("#txtsale_" + a).val() + '.');
                            HideModalPopup("dvloading");
                            $("#txtvisitorder_" + rowid).focus();
                            flag = false;
                            return;
                        }
                        else {
                            uniqSampPrdVisitOrd.push($("#hdnsample_" + rowid).val() + '_' + $("#txtvisitorder_" + rowid).val());
                        }

                        if ($("#txtQuantity_" + rowid).val() != "") {
                            if (parseInt($("#txtQuantity_" + rowid).val()) < 0) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Quantity cannot be a negative number.');
                                HideModalPopup("dvloading");
                                $("#txtQuantity_" + rowid).focus();
                                flag = false;
                                return;
                            }
                        } else if ($("#txtQuantity_" + rowid).val() == '') {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Quantity.');
                            HideModalPopup("dvloading");
                            $("#txtQuantity_" + rowid).focus();
                            flag = false;
                            return;
                        }

                        var Due_Date = $('#txtDueDate_' + rowid).val();

                        if (Due_Date != '' && Due_Date != undefined) {
                            Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                            var duedate = new Date(Due_Date);
                            if ((duedate > endDate) || (duedate < startDate)) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Due Date between Start Date and End Date');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                        }
                        var Start_Date_LI = $('#txtStartDate_' + rowid).val();

                        if (Start_Date_LI != '' && Start_Date_LI != undefined) {
                            Start_Date_LI = Start_Date_LI.split('/')[2] + '/' + Start_Date_LI.split('/')[1] + '/' + Start_Date_LI.split('/')[0];
                            var Start_Date_LI = new Date(Start_Date_LI);
                            if ((Start_Date_LI > endDate) || (Start_Date_LI < startDate)) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Line Item Start Date between Campaign Start Date and Campaign End Date');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                        }
                        if (Start_Date_LI != "" && Start_Date_LI != undefined && Due_Date != "" && Due_Date != undefined) {
                            //Start_Date_LI = Start_Date_LI.split('/')[2] + '/' + Start_Date_LI.split('/')[1] + '/' + Start_Date_LI.split('/')[0];
                            var Start_Date_li = new Date(Start_Date_LI);
                            //Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                            var duedate = new Date(Due_Date);
                            if (Start_Date_li > duedate) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Line Item Due Date greater than Start Date');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                        }
                        if (parseInt($('#txtBudget_' + rowid).val()) == 0) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Line Item cannot be Zero(0).Please Enter Other than Zero(0)');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        } else if ($('#txtBudget_' + rowid).val() != "" && $('#txtBudget_' + rowid).val() != undefined && $('#txtBudget_' + rowid).val() != null) {
                            Line_Item_Budget_Array.push($('#txtBudget_' + rowid).val());
                        }
                    }
                    else if (InputType = "A") {
                        if (InputType == "A" && $('#txtactivity_' + rowid).val() == '') {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Activity Name for the Selected Input');
                            $("#txtsample_" + rowid).focus();
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                        if ($('#txtactivity_' + rowid).val() != '') {
                            if ($("#hiddenflagact_" + rowid).val() == 0) {
                                if ($('#hdnactivityval_' + rowid).val() == 0) {
                                    for (var i = 0; i < Activities_g.length; i++) {
                                        if (Activities_g[i].label.replace(/[^A-Z0-9]/ig, '').toUpperCase() == $('#txtactivity_' + rowid).val().replace(/[^A-Z0-9]/ig, '').toUpperCase()) {
                                            Acondt = true;
                                        }

                                    }
                                    if (Acondt == true) {
                                        fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already entered the Activity name "' + $('#txtactivity_' + rowid).val() + '".Please select the Activity from list');
                                        HideModalPopup("dvloading");
                                        flag = false;
                                        return;
                                    }
                                }
                            }
                        }
                        if ($('#hdnactivityval_' + rowid).val() == 0) {
                            var flexiactivity = $('#txtactivity_' + rowid).val();
                            uniqueflexiActivity.push(flexiactivity);
                        }


                        if ($.inArray($('#hdnactivityval_' + rowid).val(), uniqActivity) > -1) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already entered the Activity ' + $('#txtactivity_' + rowid).val() + ' for visit order ' + $("#txtvisitorder_" + rowid).val() + ' for the sale product ' + $("#txtsale_" + a).val() + '.');
                            HideModalPopup("dvloading");
                            $('#txtactivity_' + rowid).focus();
                            flag = false;
                            return;
                        }
                        else {
                            if ($('#hdnactivityval_' + rowid).val() != 0 && $('#hdnactivityval_' + rowid).val() != undefined) {
                                uniqActivity.push($('#hdnactivityval_' + rowid).val());
                            }
                        }
                        if (regExforAlphaNumericSpecificRemarks($("#txtsample_" + rowid).val()) == false) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Activity.')
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                        var Due_Date = $('#txtDueDate_' + rowid).val();
                        if (Due_Date != '' && Due_Date != undefined) {
                            Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                            var duedate = new Date(Due_Date);
                            if ((duedate > endDate) || (duedate < startDate)) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Due Date between Start Date and End Date');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                        }
                        var Start_Date_LI = $('#txtStartDate_' + rowid).val();

                        if (Start_Date_LI != '' && Start_Date_LI != undefined) {
                            Start_Date_LI = Start_Date_LI.split('/')[2] + '/' + Start_Date_LI.split('/')[1] + '/' + Start_Date_LI.split('/')[0];
                            var Start_Date_LI = new Date(Start_Date_LI);
                            if ((Start_Date_LI > endDate) || (Start_Date_LI < startDate)) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Line Item Start Date between Campaign Start Date and Campaign End Date');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                        }
                        if (Start_Date_LI != "" && Start_Date_LI != undefined && Due_Date != "" && Due_Date != undefined) {
                            //Start_Date_LI = Start_Date_LI.split('/')[2] + '/' + Start_Date_LI.split('/')[1] + '/' + Start_Date_LI.split('/')[0];
                            var Start_Date_li = new Date(Start_Date_LI);
                            //Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                            var duedate = new Date(Due_Date);
                            if (Start_Date_li > duedate) {
                                fnMsgAlert('info', 'Marketing Campaign Definer', 'Please select Line Item Due Date greater than Start Date');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                        }
                        if (parseInt($('#txtBudget_' + rowid).val()) == 0) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'Line Item cannot be Zero(0).Please Enter Other than Zero(0)');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        } else if ($('#txtBudget_' + rowid).val() != "" && $('#txtBudget_' + rowid).val() != undefined && $('#txtBudget_' + rowid).val() != null) {
                            Line_Item_Budget_Array.push($('#txtBudget_' + rowid).val());
                        }
                    }
                });
                if (uniqueflexiActivity != undefined) {
                    if (uniqueflexiActivity.length > 1) {
                        var result = fncheckIfArrayIsUnique(uniqueflexiActivity);
                        if (result == true) {
                            fnMsgAlert('info', 'Marketing Campaign Definer', 'You have already entered the new Activity name twice.Please select different Activity from list');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        }
                    }
                }
                if (flag == false) {
                    return false;
                }
            }
        }
    }
    if (flag == false) {
        return false;
    }
    if (uniqueProd.length == 0) {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Atleast one Sale Product To Save Marketing Campaign.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }
    var add_line_Item_Budget = 0;
    var totalBudget = $('#CampBudget').val();
    if (Line_Item_Budget_Array.length >= 1) {
        for (var i = 0; i < Line_Item_Budget_Array.length; i++) {
            var value = Line_Item_Budget_Array[i];
            add_line_Item_Budget = (parseInt(add_line_Item_Budget) + parseInt(value));
        }
        if (parseInt(add_line_Item_Budget) != "" && add_line_Item_Budget != undefined && add_line_Item_Budget != null && totalBudget != "" && totalBudget != undefined && totalBudget != null) {
            if (parseInt(add_line_Item_Budget) > parseInt(totalBudget)) {
                fnMsgAlert('info', 'Marketing Campaign Definer', 'Sum of the Line Item Budget is exceeding the Budget of the Campaign.Please enter Line Item Budget(s) that sums to the Total Budget of the Campaign.');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
        }
    }
    if (Line_Item_Budget_Array.length >= 1 && totalBudget == "") {
        fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Budget of the Campaign,as Line Item Budget(s) is specified.');
        HideModalPopup("dvloading");
        flag = false;
        return;
    }

    return flag;
}

function fncheckIfArrayIsUnique(myArray) {
    for (var i = 0; i < myArray.length; i++) {
        for (var j = i + 1; j < myArray.length; j++) {
            if (myArray[i] == myArray[j]) {
                return true; // means there are duplicate values
            }
        }
    }
    return false; // means there are no duplicate values.
}
function fncheckIfArrayIsUniqueTwoArrays(myArray, myArray1) {
    debugger;
    var array_one = myArray;
    var array_two = myArray1;
    var a1_lngth = array_one.length;
    var a2_lngth = array_two.length;
    var difference = '';
    if (a1_lngth > a2_lngth) {
        difference = $(array_one).not(array_two).get();
    } else if (a2_lngth > a1_lngth) {
        difference = $(array_two).not(array_one).get();
    } else {
        difference = $(array_one).not(array_two).get();
    }
    return difference;

}

function fnCancelMarketingCampaignDefiner() {
    debugger;
    //$.blockUI();
    bindFlag = false;
    $('#txtCampName').val("");
    $('#txtCampName').attr("disabled", false);
    $('#txtCampPurpose').val('');
    $('select#ddlDocCategory > option').attr('selected', false);
    $('select#ddlDocCategory > option').attr('disabled', false);
    $('#ddlDocCategory').multiselect("destroy").multiselect().multiselectfilter();
    $("#ddlDocCategory").multiselect({
        noneSelectedText: '-Customer Category-'
    }).multiselectfilter();

    $('select#ddlSpeciality > option').attr('selected', false);
    $('select#ddlSpeciality > option').attr('disabled', false);
    $('#ddlSpeciality').multiselect("destroy").multiselect().multiselectfilter();
    $("#ddlSpeciality").multiselect({
        noneSelectedText: '-Speciality-'
    }).multiselectfilter();

    $('#txtStartDate').val("");
    $('#txtEndDate').val("");
    $('#txtCustCount').val("");
    $('#txtCustCount').attr("disabled", false);
    $('#txtCustCountrole').val("");
    $('#txtCustCountrole').attr("disabled", false);
    $('#txtMonths').val('');
    $('#txtfrom').val('');
    $('#txtStartDate').attr("disabled", false);
    $('#txtEndDate').attr("disabled", false);

    //clear radio
    $('input:radio[name=doctorSelection]').attr('checked', false);
    $('input:radio[name=doctorSelection][value=R]').attr('checked', true);

    $('input:radio[name=doctorSelection]').attr('disabled', false);

    $('input:radio[name=typeSelection]').attr('checked', false);
    $('input:radio[name=typeSelection][value=1]').attr('checked', true);

    $('input:radio[name=typeSelection]').attr('disabled', false);


    $('select#ddlCategory > option').attr('selected', false);
    $('select#ddlCategory > option').attr('disabled', false);

    $('#freqSel').attr('disabled', false);
    $("#ddlsurvey").attr('disabled', false);
    $('#ddlCategory').multiselect("destroy").multiselect().multiselectfilter();
    $("#ddlCategory").multiselect({
        noneSelectedText: '-Campaign Driven By-'
    }).multiselectfilter();
    $('select#ddlsurveyusers > option').attr('selected', false);
    $('select#ddlsurveyusers > option').attr('disabled', false);

    $('#freqSel').attr('disabled', false);
    $('#ddlsurveyusers').multiselect("destroy").multiselect().multiselectfilter();
    $("#ddlsurveyusers").multiselect({
        noneSelectedText: '-Survey Taken By-'
    }).multiselectfilter();
    $('#CampBudget').val('');
    $('#freqSel').val(0);
    $("#ddlsurvey").val(0);
    //dvproduct clear
    $("#dvproduct").empty();
    fnGetCustomerCountControl(1);
    // $('#treebody').empty();


    $("#hdnCampaignCode").val("");
    $("#hdnMappedDoctorCount").val("");
    $("#ddlSpeciality").multiselect('enable');
    $("#ddlDocCategory").multiselect('enable');
    $("#ddlCategory").multiselect('enable');
    $("#ddlsurveyusers").multiselect('enable');
    //fnRegionBindTreeAlreadySelected();
    EditStatus = '';
    CustCount = '';


    if ($('#treebody').is(':empty') == false) {
        var regionTree = $("#treebody").dynatree("getTree");
        if (selKeys.length > 0) {
            $('#treebody').dynatree("getRoot").visit(function (node) {
                node.data.unselectable = false;
                node.select(false);
                node.render(true);
            });
        }

    }
    fnCreateProductTable("LOAD");
    fnObjectiveLength();
}

function regExforAlphaNumericSpecificRemarks(value) {
    var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
    //var specialCharregex = new RegExp("^[''!@#$%^*?+=|]+$");
    if (specialCharregex.test(value) == true) {
        return false;
    }
    else {
        return true;
    }
}


function fnValidateAutofillMC(Id) {
    //debugger;
    var ActvtyName = $("#" + Id.id).val();
    var mainId = Id.id.split('_')[1];
    var subId = Id.id.split('_')[2];
    if (ActvtyName != "") {
        var i = "false";
        var s = "";

        for (var o = 0; o < Activities_g.length; o++) {
            if (Activities_g[o].label == ActvtyName) {
                i = "true";
                s = Activities_g[o].value;
            }
        }
        if (i == "false") {
            $("#hdnactivityval_" + mainId + "_" + subId).val(0);
        } else {
            $("#hdnactivityval_" + mainId + "_" + subId).val(s);
        }
    } else {
        $("#hdnactivityval_" + mainId + "_" + subId).val(0);
    }
}

function fnGetAllRegionUsers(regionCode) {
    debugger;
    var excludeParentLevel = "";
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/MarketingCampaign/GetDocForAllRegionsUndertheSelectedRegion",
        data: "regionCode=" + regionCode + "&excludeParentLevel=" + excludeParentLevel + "&includeOneLevelParent=NO",
        //async: false,
        success: function (resp) {
            //console.log(resp);
            //$.unblockUI();
            DocCountRegions = resp;
            if (EditStatus == "" || bindFlag == false) {
                fnShowChckBoxOnlywithDocCount(resp);
            }
        },
        complete: function (e) {
            //$.unblockUI();

        }
    });
}
function fnShowChckBoxOnlywithDocCount(resp) {
    debugger;
    //if (EditStatus == "") {
    $('#treebody').unblock();
    //}

    $("#treebody").dynatree("getRoot").visit(function (node) {
        // debugger;
        //var user = $.grep(resp, function (n, i) { node.data.key = n.Region_Code });
        //var user = jsonPath(resp, "$.[?(@.Region_Code=='" + node.data.key + "')]");
        var user = $.grep(resp, function (element, index) {
            return element.Region_Code == node.data.key;

        });
        if (user.length > 0 && user != null) {


            if (user[0].Doc_Count != 0 || user[0].Region_Type_Name=="Territory") {
                // node.select(true);
                node.data.unselectable = false; //make it unselectable
                node.data.hideCheckbox = false; //hide the checkbox (mo

                node.render(false);
            }
            else {
                // node.select(true);
                node.data.unselectable = true;
                node.data.hideCheckbox = true;
                //node.Checked = true;
                // node.data.title.attr("disabled", true);
                //$('.span.dynatree-checkbox').prop('checked', false);
                node.render(true);
            }
        }


    });
    //if (cmpCode == "") {

    //}

    if (EditStatus != "" && bindFlag == false) {
        fnRegionBindTreeAlreadySelected();
    }
}

function fnRegionBindTreeAlreadySelected() {
    debugger;
    $.unblockUI();
    $("#main").unblock();
    var DPM_Count = $("#hdnMappedDoctorCount").val();
    if (EditStatus == 'UnApproved') {
        if (DPM_Count > 0) {
            $("#treebody").dynatree("getRoot").visit(function (node) {
                debugger;
                //var user = $.grep(disjsonRegions, function (n, i) { node.data.key = n.Region_Code });
                var user = $.grep(disjsonRegions, function (element, index) {
                    return element.Region_Code == node.data.key;

                });
                //var user = jsonPath(disjsonRegions, "$.[?(@.Region_Code=='" + node.data.key + "')]");
                if (user != false && user != undefined && user.length > 0) {
                    if (user[0].Customer_Code_Count > 0) {
                        node.select(true);
                        node.data.unselectable = true; //make it unselectable
                        //node.data.hideCheckbox = true; //hide the checkbox (mo

                        node.render(true);

                    } else {
                        node.select(true);
                        node.data.unselectable = false; //make it unselectable
                        //node.data.hideCheckbox = true; //hide the checkbox (mo

                        node.render(true);
                    }
                }



            });
        } else {
            $("#treebody").dynatree("getRoot").visit(function (node) {
                debugger;

                //var user = $.grep(disjsonRegions, function (n, i) { node.data.key = n.Region_Code });
                // var user = jsonPath(disjsonRegions, "$.[?(@.Region_Code=='" + node.data.key + "')]");
                var user = $.grep(disjsonRegions, function (element, index) {
                    return element.Region_Code == node.data.key;

                });
                if (user != false && user != undefined && user.length > 0) {
                    if (user[0].Customer_Code_Count > 0) {
                        node.select(true);
                        node.data.unselectable = true; //make it unselectable
                        //node.data.hideCheckbox = true; //hide the checkbox (mofnLoad

                        node.render(true);

                    } else {
                        node.select(true);
                        node.data.unselectable = false; //make it unselectable
                        //node.data.hideCheckbox = true; //hide the checkbox (mo

                        node.render(true);
                    }
                }
            });
        }
    } else if (EditStatus == "Applied" || EditStatus == "Approved") {

        $("#treebody").dynatree("getRoot").visit(function (node) {
            // debugger;
            //var user = $.grep(disjsonRegions, function (n, i) { node.data.key = n.Region_Code });
            // var user = jsonPath(disjsonRegions, "$.[?(@.Region_Code=='" + node.data.key + "')]");
            var user = $.grep(disjsonRegions, function (element, index) {
                return element.Region_Code == node.data.key;

            });
            if (user != false && user != undefined && user.length > 0) {
                if (user.length > 0) {
                    node.select(true);
                    node.data.unselectable = true; //make it unselectable
                    //node.data.hideCheckbox = true; //hide the checkbox (mo

                    node.render(true);
                }
            }

        });
    }

}
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    var date1 = new Date(a);
    var date2 = new Date(b);
    var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function fnGetUserPrivileges() {
    debugger;
    var arrDetails = new Array();
    var _obj = {};
    _obj.name = "companyCode";
    _obj.value = CompanyCode;
    arrDetails.push(_obj);

    _obj = {};
    _obj.name = "regionCode";
    _obj.value = RegionCode;
    arrDetails.push(_obj);

    _obj = {};
    _obj.name = "userCode";
    _obj.value = UserCode;
    arrDetails.push(_obj);

    _obj = {};
    _obj.name = "userTypeCode";
    _obj.value = UserTypeCode;
    arrDetails.push(_obj);
    HDAjax.requestInvoke('MarketingCampaign', 'GetUserTypePrivileges', arrDetails, "POST", fnUserTypePrivilegesSuccessCallback, fnUserTypePrivilegesFailureCallback, null);
}
function fnUserTypePrivilegesSuccessCallback(response) {
    debugger;
    usertypePrivilege_g = response;
    var survey_interPriv_g = '';
    var Survey_Privlige = $.grep(usertypePrivilege_g, function (ele, index) {
        return ele.Privilege_Name == 'IS_SURVEY_MODULE_ENABLED';
    });
    if (Survey_Privlige.length > 0) {
        survey_interPriv_g = Survey_Privlige[0].Privilege_Value_Name;
    }
    if (survey_interPriv_g == 'YES') {
        $("#survey").show();
        $("#surveytakenby").show();
    }
    else {
        $("#survey").hide();
        $("#surveytakenby").hide();
    }
}
function fnUserTypePrivilegesFailureCallback(error) {

}
function fnGetSurvey() {
    debugger;
    Method_params = ["SurveyAPI/GetSurvey", CompanyCode, CompanyId, '2', '1'];
    SurveyCoreREST.get(null, Method_params, null, fnSurveySuccessCallback, fnSurveyFailureCallback);
    //HDAjax.requestInvoke('CME', 'GetRegionDetails', arrDetails, "POST", CMEDefinition.fnRegionDetailsSuccessCallback, CMEDefinition.fnRegionDetailsFailureCallback, null);
}
function fnSurveySuccessCallback(response) {
    debugger;
    var Content = '';
    Content += '<option value="0">Please select Survey</option>';
    for (var i = 0; i < response.length; i++) {
        Content += '<option value=\'' + response[i].Survey_Id + '|' + response[i].Schedule_To.split(' ')[0] + '\'>' + response[i].Survey_Name + '</option>';
    }
    $("#ddlsurvey").html(Content);
}
function fnSurveyFailureCallback(error) {

}

function fnViewDoctoralreadymapped(doctorCode)
{
    debugger;
    var regionTree = $("#dvRegionTree").dynatree("getTree");
   

    CampaignCode = $("#cboCampaign").val();
    if (CampaignCode == "" || CampaignCode == null) {
        CampaignCode = 0;
    } else {
        if ($('input:radio[name=rdTypeMap]:checked').val() == 'CME_MAP') {
            CampaignCode = $("#cboCMECampaign").val();
        }
        else {
            CampaignCode = $("#cboCampaign").val();
        }
    }
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetMCMappedtoDoctor/',
        type: "POST",
        data: "regionCode=" + regionCode + "&doctorCode=" + doctorCode.split('_')[0],
        success: function (jsData) {
            var tblContent = "";
            if (jsData != '' && jsData != undefined) {
                jsData = eval('(' + jsData + ')');
                var mappedCount = jsData.length;
               
                    tblContent += '<div class="col-lg-12"> <div class="col-sm-6" style="font-weight:bold"><span class="docLabel"></span> Name : ' + doctorCode.split('_')[1]
                        + '</div></div></div><br/>';
                    tblContent += '<div class="col-lg-12 table-responsive"> <table class="table table-striped"><thead><tr><th>Campaign Name</th><th>Product Name</th><th>Support Value</th>';
                    tblContent += '<th>Bussiness Value</th><th>Product Priority No</th><th>Mapped By</th><th>Mapped Region</th> </tr> </thead><tbody>';
                    for (var i = 0; i < jsData.length; i++) {
                        tblContent += '<tr><td>' + jsData[i].Campaign_Name + '</td>';
                        tblContent += '<td>' + jsData[i].Product_Name + '</td>';
                        tblContent += '<td>' + jsData[i].Support_Quantity + '</td>';
                        tblContent += '<td>' + jsData[i].Potential_Quantity + '</td>';
                        if (jsData[i].Product_Priority_No != 0) {
                            tblContent += '<td>' + jsData[i].Product_Priority_No + '</td>';
                        } else {
                            tblContent += '<td></td>';
                        }

                        tblContent += '<td>' + jsData[i].Created_By + '</td>';
                        tblContent += '<td>' + jsData[i].Created_Region + '</td>';
                        tblContent += '</tr>';
                    }
                    tblContent += '</tbody>';
                    tblContent += '</table>';
                    tblContent += '</div>';
                    tblContent += '<div style="clear: both;"></div>';
                }
            else {
                tblContent+='<label>No Record Found</label>'
            }
            $('#dvDoctorMappedProducts').html(tblContent);
            if (privval != '') {
                $('.docLabel').html(privval);

            } else {
                $('.docLabel').html("Doctor");
            }
            $('#spnPopUpTitle').html('Mapped Product Details')
            $("#dvProductPopUp").overlay().load();
        }
    });
}
//**************** END - MARKETING CAMPAIGN   ************************************//