var saleProd_g = '';
var sampleProd_g = '';
var Activities_g = '';
var EditStatus = '';
var row = 1;
var Campaign_Code = '';
var lstSpeciality = [];
var lstCategory = [];
var lstDesignations = [];
var lstUnderRegions = [];
var dropcategory = '';
var dropspeciality = '';
var dropdesignation = '';
var bindFlag = false;
var selKeys = new Array();
var SelTitleKeys = new Array();
var selKeys_ls = new Array();
//var prodString = '<div id="dvsale_MAINNUM" class="col-lg-12  form-group dvsalebox" >';
//prodString += '<div class="col-xs-12  form-group">';
//prodString += '<div class="col-xs-6  form-group"><div class="col-xs-6"><div><label class="Productlabel">Product(Sales)</label></div><div class="col-xs-12 form-group" style="padding-left:0px !important;">';
//prodString += '<input type="text" id="txtsale_MAINNUM" class="input-xlarge form-control autoSale ac_input" autocomplete="off"><input type="hidden" id="hdnsale_MAINNUM"><input type="hidden" id="hiddenflag_MAINNUM" value="0"/></div></div>';
//prodString += '</div><div class="col-xs-6 form-group"><div class="col-xs-6"><div><label class="ROIlabel">Expected Sale Increase</label></div><div class="col-xs-6 paddng form-group">';
//prodString += '<input type="number" id="ROI_MAINNUM" min="1" max="9999999" onkeypress="return fnValidateInputROI(id,event);" class="input-xlarge form-control"></div><div class="col-lg-1 paddng form-group" style="padding-left:5px !important;padding-top:5px;">';
//prodString += '<label>%</label></div></div></div></div>';
var prodString = '<div class="form-row dvsalebox" id="dvsale_MAINNUM" >';
prodString += '<div class="form-group col-md-4">';
prodString += '<label for="inputproduct" class="Productlabel"><b>Target Product/Brand(Activity)</b></label>';
prodString += '<input type="text" id="txtsale_MAINNUM" class="input-xlarge form-control autoSale ac_input product" autocomplete="off"><input type="hidden" class="hdnproduct" id="hdnsale_MAINNUM"><input type="hidden" id="hiddenflag_MAINNUM" value="0"/>';
//prodString += '<input type="text" class="form-control form-control-sm" id="txtproduct1">';
prodString += '</div>';
prodString += '<div class="form-group col-md-4">';
prodString += '<label for="inputExpectedsales" class="ROIlabel"><b>Expected increase in Sales</b></label>';
prodString += '<input type="number" id="ROI_MAINNUM" min="1" max="9999999" onkeypress="return CMEDefinition.fnValidateInputROI(id,event);" class="input-xlarge form-control">';
prodString += '</div>';


//prodString += '<div class="col-lg-12  form-group">';
//prodString += '<div class="col-lg-2  form-group"><label class="Productlabel">Product(Sales)</label></div>';
//prodString += '<div class="col-lg-6 form-group"><input type="text" id="txtsale_MAINNUM" class="input-xlarge form-control autoSale" />';
//prodString += '<input type="hidden" id="hdnsale_MAINNUM"/></div>';
//prodString += '<div class="col-lg-1  form-group"><label class="ROIlabel">Expected Sale Increase</label></div>';
//prodString += '<div class="col-lg-2 paddng form-group"><input type="number" id="ROI_MAINNUM" min="1" max="9999999" onkeypress="return fnValidateInputROI(id,event);" class="input-xlarge form-control" />';
//prodString += '</div>';
//prodString += '<div class="col-lg-1 paddng form-group" style="padding-left:5px !important;padding-top:5px;"><label>%</label></div></div>';
prodString += '<div class="col-lg-12  form-group">';
prodString += '<div  class="col-lg-12 table-responsive form-group" style="padding-left: 0px;">';
prodString += '<table id="sale-MAINNUM" class="table table-striped">';
prodString += '<tr class="form-group">';
prodString += '<td id="InptType" class="form-group"><b>Input Type</b></td>';
prodString += '<td id="PRO_AC" class="form-group"><b>Product (Promotional)/Activity Name</b></td>';
prodString += '<td id="VO" class="form-group"><b>Visit Order</b></td>';
prodString += '<td id="Qty_Du" class="form-group"><b>Quantity/Duration</b></td>';
prodString += '<td id="sDate" class="form-group"><b>Start Date</b></td>';
prodString += '<td id="eDate"class="form-group"><b>Due Date</b></td>';
prodString += '<td id="Bdgt_PRO_AC" class="form-group"><b>Budget for Promotional Product/Activity</b></td>';
prodString += '</tr>';
prodString += '<tr class="form-group sample_MAINNUM_SUBNUM sample_MAINNUM" id="sample_MAINNUM_SUBNUM">';
prodString += '<td>';
prodString += '<select class="form-control mc" maxlength="25" id="inpttype_MAINNUM_SUBNUM" onchange="CMEDefinition.fnShowInputsOnselect(this.value,id);">';
prodString += '<option maxlength="25" value="0">Select Input Type</option>';
prodString += '<option maxlength="25" value="PI">Promotional</option>';
prodString += '<option maxlength="25" value="A">Activity</option>';
prodString += '</select></td>';
prodString += '</tr></table></div></div></div><div style="clear:both;"></div>';



var ProdString = '';

ProdString += '<td>';
ProdString += '<select class="form-control mc" maxlength="25" id="inpttype_MAINNUM_SUBNUM" onchange="CMEDefinition.fnShowInputsOnselect(this.value,id);">';
ProdString += '<option maxlength="25" value="0">Select Input Type</option>';
ProdString += '<option maxlength="25" value="PI">Promotional</option>';
ProdString += '<option maxlength="25" value="A">Activity</option>';
ProdString += '</select></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="text" id="txtsample_MAINNUM_SUBNUM" class="input-xlarge form-control autoSample"/><input type="hidden"  class="hdnsample" id="hdnsample_MAINNUM_SUBNUM" /><input type="hidden" id="hdntype_MAINNUM_SUBNUM"  value="0"/><input type="hidden" id="hiddenflagsamp_MAINNUM_SUBNUM" value="0"/></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="number" id="txtvisitorder_MAINNUM_SUBNUM" min="1" max="99" class="input-mini form-control checkexpnumeric" onpaste="return false" onkeypress="return CMEDefinition.fnValidateInputVO(this,event);"/></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="number" id="txtQuantity_MAINNUM_SUBNUM" min="0" max="99999" class="input-mini form-control checkexpnumeric"  onpaste="return false" onkeypress="return CMEDefinition.fnValidateInputQty(this,event);"/></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="text" id="txtStartDate_MAINNUM_SUBNUM" class="input-mini form-control StartDate" readonly="readonly"  style="cursor:pointer !important;" /></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="text" id="txtDueDate_MAINNUM_SUBNUM" class="input-mini form-control DueDate" readonly="readonly"  style="cursor:pointer !important;" /></td>';
ProdString += '<td class="form-group">';
ProdString += '<input type="number" id="txtBudget_MAINNUM_SUBNUM" min="1" max="9999999999" class="input-mini form-control checkexpnumeric"  onpaste="return false" onkeypress="return CMEDefinition.fnValidateBudget(this,event);"/></td>';
ProdString += '<td id="remove_MAINNUM_SUBNUM" class="removerow" style="display:none;padding-top:15px !important;"><i onclick="CMEDefinition.RemoveRow(MAINNUM,SUBNUM);"  title="Remove Row" class="fa fa-times-circle" style="color:red;font-size:20px;"></i></td>';



var Prodstring = '';
Prodstring += '<td>';
Prodstring += '<select class="form-control mc" maxlength="25" id="inpttype_MAINNUM_SUBNUM" onchange="CMEDefinition.fnShowInputsOnselect(this.value,id);">';
Prodstring += '<option maxlength="25" value="0">Select Input Type</option>';
Prodstring += '<option maxlength="25" value="PI">Promotional</option>';
Prodstring += '<option maxlength="25" value="A">Activity</option>';
Prodstring += '</select></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="text" id="txtactivity_MAINNUM_SUBNUM" maxLength="150" class="input-xlarge form-control" onblur="CMEDefinition.fnValidateAutofillMC(this); CMEDefinition.fnClose(this);" /><input type="hidden" id="hdnactivityval_MAINNUM_SUBNUM" value="0"><input type="hidden" id="hdntype_MAINNUM_SUBNUM"  value="1"/><input type="hidden" id="hiddenflagact_MAINNUM_SUBNUM" value="0"/></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="number" id="txtvisitorder_MAINNUM_SUBNUM" min="1" max="99" class="input-mini form-control checkexpnumeric"  onpaste="return false" onkeypress="return CMEDefinition.fnValidateInputVO(this,event);" /></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="number" id="txtQuantity_MAINNUM_SUBNUM" min="0" max="99999" title="Please Enter Duration for Activity" class="input-mini form-control checkexpnumeric" /></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="text" id="txtStartDate_MAINNUM_SUBNUM" class="input-mini form-control StartDate" readonly="readonly"  style="cursor:pointer !important;" /></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="text" id="txtDueDate_MAINNUM_SUBNUM" class="input-mini form-control DueDate" readonly="readonly"   style="cursor:pointer !important;"/></td>';
Prodstring += '<td class="form-group">';
Prodstring += '<input type="number" id="txtBudget_MAINNUM_SUBNUM" min="1" max="9999999999" class="input-mini form-control checkexpnumeric"  onpaste="return false" onkeypress="return CMEDefinition.fnValidateBudget(this,event);"/></td>';
Prodstring += '<td id="remove_MAINNUM_SUBNUM" class="removerow" style="display:none;padding-top:15px !important;"><i onclick="CMEDefinition.RemoveRow(MAINNUM,SUBNUM);"  title="Remove Row" class="fa fa-times-circle" style="color:red;font-size:20px;"></i></td>';


var DrpDwnString = '';
DrpDwnString += '<tr class="form-group sample_MAINNUM_SUBNUM sample_MAINNUM" id="sample_MAINNUM_SUBNUM">';
DrpDwnString += '<td>';
DrpDwnString += '<select class="form-control mc" maxlength="25" id="inpttype_MAINNUM_SUBNUM" onchange="CMEDefinition.fnShowInputsOnselect(this.value,id);">';
DrpDwnString += '<option maxlength="25" value="0">Select Input Type</option>';
DrpDwnString += '<option maxlength="25" value="PI">Promotional</option>';
DrpDwnString += '<option maxlength="25" value="A">Activity</option>';
DrpDwnString += '</select></td>';
DrpDwnString += '</tr>';
$(".StartDate").datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    minDate: new Date()
});
$(".DueDate").datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    minDate: new Date()
});
var CMEDefinition = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        RegionCode: "",
        UserCode: "",
        UserTypeCode: "",
    },
    Init: function () {
        $("#CMEDefiner").show();
        CMEDefinition.fngetdivisions();
        // CMEDefinition.fnbindProductdetails();
        //  CMEDefinition.fnGetDoctorCategory();
        CMEDefinition.fnGetSpeciality();
        // CMEDefinition.fnGetUnderRegions();
        //CMEDefinition.fnGetProducts('sales');
        //CMEDefinition.fnGetProducts('sample');
        CMEDefinition.fnGetActivities();
        CMEDefinition.fnGetDesignations();
    },
    fnCMEDefiner: function () {
        debugger;
        $('.def').addClass('active');
        $('.sum').removeClass('active');
        var saleProd_g = '';
        var sampleProd_g = '';
        var Activities_g = '';
        var EditStatus = '';
        var row = 1;
        Campaign_Code = '';
        $("#CMEDefiner").show();
        $("#CMESummary").hide();
        CMEDefinition.fnCancelCMEDefiner();

    },
    fnCMESummary: function () {
        debugger;
        $('.def').removeClass('active');
        $('.sum').addClass('active');
        $("#CMEDefiner").hide();
        $("#CMESummary").show();
        var today = new Date();
        var cdd = today.getDate();
        var cmm = today.getMonth() + 1;
        var cyy = today.getFullYear();
        var currentDate = cyy + '-' + ("0" + (cmm)).slice(-2) + '-' + ("0" + (cdd)).slice(-2);
        today.setDate(today.getDate() - 90);
        var pdd = today.getDate();
        var pmm = today.getMonth() + 1;
        var pyy = today.getFullYear();
        var prevDate = pyy + '-' + ("0" + (pmm)).slice(-2) + '-' + ("0" + (pdd)).slice(-2);
        $('#CMEStartDate').val(prevDate);
        $('#CMEEndDate').val(currentDate);
        CMEDefinition.fnGetCMESummary()


    },
    fnGetRegionDetails: function () {
        debugger;
        $('#treebody').empty();
        fnGetRegionTreeByRegionWithCheckBoxMC(currentRegionCode_g, "treebody", "", 'Yes', 'LOAD');

    },
    fngetdata: function () {
        debugger;
        CMEDefinition.fnGetDoctorCategory();
        fnGetRegionTreeByRegionWithCheckBoxMC(currentRegionCode_g, "treebody", "", 'Yes', 'LOAD');
        CMEDefinition.fnGetProducts('sales');
        CMEDefinition.fnGetProducts('sample');
    },
    //fnUnSelectAll: function () {
    //    debugger;
    //    $("#" + treeId).dynatree("getRoot").visit(function (node) {
    //        debugger;
    //        bindFlag = true;
    //        node.select(false);
    //        node.render(true);
    //    });
    //},
    //fnSelectAll: function () {
    //    debugger;
    //    $("#" + treeId).dynatree("getRoot").visit(function (node) {
    //        debugger;
    //        bindFlag = true;
    //        node.select(true);
    //        node.render(true);
    //    });
    //},

    //fnGetRegionTreeByRegionWithCheckBoxMC: function (regionCode, treeId, filterId, check, loadType) {
    //     debugger;

    //    $('#' + treeId).block({
    //        message: '<h3>Loading...</h3>',
    //        css: { border: '1px solid #ddd' }
    //    });
    //    var divisioncode = 0;
    //    if (loadType.toUpperCase() == "LOAD") {

    //    }
    //    else {
    //        divisioncode = "";
    //        if ($("select[name='division']").val().length > 0) {
    //            for (var i = 0; i < $("select[name='division']").val().length; i++) {
    //                divisioncode = $("select[name='division']").val() + ','
    //            }
    //        }
    //    }
    //    $.ajax({
    //        type: "POST",
    //        url: 'Master/RegionTreeGenerationByRegionCodeforCME',
    //        data: "regionCode=" + regionCode + "&includeOneLevelParent=NO" + "&divisioncode=" + divisioncode,
    //        success: function (jsData) {
    //            if (jsData != '') {
    //                $('#' + filterId).hide();
    //                $("#" + treeId).show();
    //                $("#" + treeId).html(' ');
    //                $('#' + treeId).dynatree('destroy');
    //                $('#' + treeId).empty();
    //                $("#" + treeId).html(jsData);

    //                $("#" + treeId).dynatree({
    //                    checkbox: true,
    //                    onActivate: function (node) {
    //                        CMEDefinition.fnRegionTreeNodeClick(node);
    //                    },
    //                    onClick: function (node, event) {
    //                        debugger;
    //                         Close menu on click
    //                        if ($(event.target).hasClass("parent")) {
    //                            alert("You clicked " + node + ",  url=" + node.url);
    //                        }
    //                        if ($(".contextMenu:visible").length > 0) {
    //                            $(".contextMenu").hide();
    //                        }

    //                    },
    //                    onCreate: function (node, span) {
    //                        CMEDefinition.bindRegionContextMenu(span);
    //                    },
    //                    onKeydown: function (node, event) {
    //                         Eat keyboard events, when a menu is open

    //                    },
    //                    onDeactivate: function (node) {
    //                    },
    //                    strings: {
    //                        loading: "Loading…",
    //                        loadError: "Load error!"
    //                    },
    //                    onSelect: function (select, node) {
    //                         Get a list of all selected nodes, and convert to a key array:
    //                        CMEDefinition.fnRegionTreeSelect(select, node);
    //                        if (select) {
    //                            node.visit(function (node) {
    //                                node.select(true);
    //                            });
    //                        }
    //                        else {
    //                            node.visit(function (node) {
    //                                node.select(false);
    //                            });
    //                        }
    //                    },
    //                    onDblClick: function (node, event) {
    //                        debugger;
    //                        node.select(true);
    //                        try {
    //                            inEventHandler = true;
    //                            node.visit(function (childNode) {
    //                                childNode.select(true);
    //                            });
    //                        } finally {
    //                            inEventHandler = false;
    //                        }
    //                         fnAddNode(node);
    //                        CMEDefinition.fnBindRegionTreeWithCheckBox(node);
    //                    },
    //                    onPostInit: function (node, event) {
    //                        CMEDefinition.fnRegionTreePostInit(node);
    //                    }
    //                });

    //                 vacant user background-color change
    //                $("#" + treeId).dynatree("getRoot").visit(function (node) {
    //                    $(node.span.lastChild).addClass("tip");
    //                    if (node.data.title.split('-')[1] == "NOT ASSIGNED" || node.data.title.split('-')[1] == "VACANT") {
    //                        $(node.span).addClass('tree-node-vacant');
    //                    }
    //                });

    //                $("#dvAjaxLoad").hide();
    //                $("span.childIcon").unbind("click");
    //                $("span.childIcon").bind("click", function (e) {
    //                    alert("Edit " + $.ui.dynatree.getNode(e.target));
    //                    fnShowChildNodes(e.target);
    //                    e.preventDefault();
    //                    fnAddRegionNode(e);
    //                    return false;
    //                });
    //            }
    //        },
    //        error: function () {
    //            $("#dvAjaxLoad").hide();
    //            $('#' + treeId).unblock();
    //        },
    //        complete: function () {
    //            $.unblockUI();
    //            $("#dvAjaxLoad").hide();
    //            $('#' + treeId).unblock();
    //            CMEDefinition.fnGetAllRegionUsers(currentRegionCode_g);
    //              fnGetMarketingCampaignDetails();
    //            $("#" + treeId).dynatree("getRoot").visit(function (node) {
    //                debugger;
    //                bindFlag = true;
    //                node.select(true);
    //                node.render(true);
    //            });
    //        }
    //        }

    //    });
    //    $("#dvAjaxLoad").hide();

    //},
    //bindRegionContextMenu: function (span) {
    //     Add context menu to this node:
    //    $(span).contextMenu({ menu: "regionConMenu" }, function (action, el, pos) {
    //         The event was bound to the <span> tag, but the node object
    //         is stored in the parent <li> tag
    //        var node = $.ui.dynatree.getNode(el);
    //        switch (action) {

    //            case "regiondelete":
    //                fnChangeRegionStatus(action, node);
    //                break;
    //            case "addregion":
    //                fnAddChildRegion(action, node);
    //                break;
    //            case "regionmoveup":
    //                fnMoveRegionTreeUp(action, node);
    //                break;
    //            case "regionmovedown":
    //                fnMoveRegionTreeDown(action, node);
    //                break;
    //            case "changeregion":
    //                fnChangeRegionHierarchy(action, node);
    //                break;
    //            case "regionUserAdd":
    //                fnShowAddUser(action, node);
    //                break;
    //            case "disableUser":
    //                fnShowDisableUsers(action, node);
    //                break;
    //            default:

    //        }
    //    });
    //},
    //fnShowModalRegionPopup: function () {
    //    debugger;

    //    $('#myModaltree').modal('show');
    //},


    //fnRegionTreeSelect: function (select, node) {
    //    debugger;
    //    bindFlag = true;
    //    var lastSelectedNode = node.data.key;
    //    selKeys = $.map(node.tree.getSelectedNodes(), function (node) {
    //        return node.data.key;
    //    });
    //    SelTitleKeys = $.map(node.tree.getSelectedNodes(), function (node) {
    //        return node.data.title;
    //    });

    //    selKeys_ls = selKeys;
    //},
    //fnRegionTreePostInit: function () {

    //},

    //fnGetAllRegionUsers: function (regionCode) {
    //    debugger;
    //    var excludeParentLevel = "";
    //    $.ajax({
    //        type: "GET",
    //        url: "../HiDoctor_Master/MarketingCampaign/GetDocForAllRegionsUndertheSelectedRegion",
    //        data: "regionCode=" + regionCode + "&excludeParentLevel=" + excludeParentLevel + "&includeOneLevelParent=NO",
    //        async: false,
    //        success: function (resp) {
    //            console.log(resp);
    //            $.unblockUI();
    //            DocCountRegions = resp;
    //            if (EditStatus == "" || bindFlag == false) {
    //                CMEDefinition.fnShowChckBoxOnlywithDocCount(resp);
    //                 fnRegionBindTreeAlreadySelected(resp)
    //            }
    //        },
    //        complete: function (e) {
    //            $.unblockUI();

    //        }
    //    });
    //},
    //fnShowChckBoxOnlywithDocCount: function (resp) {
    //    debugger;
    //    if (EditStatus == "") {
    //    $('#treebody').unblock();
    //    }

    //    $("#" + treeId).dynatree("getRoot").visit(function (node) {

    //        var user = $.grep(resp, function (element, index) {
    //            return element.Region_Code == node.data.key;

    //        });
    //        if (user.length > 0 && user != null) {


    //            if (user[0].Doc_Count != 0) {
    //                 node.select(true);
    //                node.data.unselectable = false; //make it unselectable
    //                node.data.hideCheckbox = false; //hide the checkbox (mo

    //                node.render(false);
    //            }
    //            else {
    //                 node.select(true);
    //                node.data.unselectable = true;
    //                node.data.hideCheckbox = true;
    //                node.Checked = true;
    //                 node.data.title.attr("disabled", true);
    //                $('.span.dynatree-checkbox').prop('checked', false);
    //                node.render(true);
    //            }
    //        }


    //    });
    //    if (cmpCode == "") {

    //    }

    //    if (EditStatus != "" && bindFlag == false) {
    //        fnRegionBindTreeAlreadySelected();
    //    }
    //    $('#treebody').dynatree("getRoot").visit(function (node){
    //        debugger;
    //        bindFlag=true;
    //        node.select(true);
    //        node.render(true);
    //    });
    //},

    //fnRegionBindTreeAlreadySelected: function (disjsonRegions) {
    //    debugger;
    //    $.unblockUI();
    //    $("#main").unblock();


    //    $("#" + treeId).dynatree("getRoot").visit(function (node) {
    //         debugger;
    //        var user = $.grep(disjsonRegions, function (element, index) {
    //            return element.Region_Code == node.data.key;

    //        });
    //        if (user != false && user != undefined && user.length > 0) {
    //            if (user.length > 0) {
    //                node.select(true);
    //                node.data.unselectable = true; //make it unselectable
    //                node.data.hideCheckbox = true; //hide the checkbox (mo

    //                node.render(true);
    //            }
    //        }

    //    });


    //},
    fnGetDoctorCategory: function () {
        debugger;
        var lstdivision = [];
        var dv = {};
        //if ($("select[name='division']").val().length > 0) {
        //    for (var i = 0; i < $("select[name='division']").val().length; i++) {
        //        dv = {
        //            divisioncode: $("select[name='division']").val()
        //        }
        //        lstdivision.push(dv);
        //    }
        //}
        if ($("select[name='division']").val().length > 0) {
            for (var i = 0; i < $("select[name='division']").val().length; i++) {
                var divisioncode = $("select[name='division']").val() + ','
            }
        }
        Method_params = ["CMEApi/GetDoctorCategory", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.RegionCode, divisioncode];
        CoreREST.get(null, Method_params, null, CMEDefinition.fnCategorySuccessCallback, CMEDefinition.fnCategoryFailureCallback);
        //HDAjax.requestInvoke('CME', 'GetRegionDetails', arrDetails, "POST", CMEDefinition.fnRegionDetailsSuccessCallback, CMEDefinition.fnRegionDetailsFailureCallback, null);
    },
    fnCategorySuccessCallback: function (response) {
        debugger;
        $("#category").empty();
        $("#category").html('<input type="hidden" id="hdnCategory" /><input type="text" class="form-control form-control-sm" id="txtCategory" onblur="CMEDefinition.fnValidateCategoryAutoFill(this);">');
        lstCategory = [];
        var Categoryarr = [];
        for (var i = 0; i < response.list.length; i++) {
            _objData = {};
            _objData.value = response.list[i].Category_Code;
            _objData.label = response.list[i].Category_Name;
            lstCategory.push(_objData);
            Categoryarr.push(response.list[i].Category_Code);
        }
        if (lstCategory.length > 0) {
            CategoryDetails = lstCategory;

            dropcategory = new ej.dropdowns.MultiSelect({
                dataSource: lstCategory,
                fields: { text: 'label', value: 'value' },
                placeholder: 'Select Category',
                mode: 'CheckBox',
                showSelectAll: true,
                showDropDownIcon: true,
                filterBarPlaceholder: 'Search Category',
                popupHeight: '350px',
                //filtering: function (e) {
                //    var dropdown_query = new ej.data.Query();
                //    dropdown_query = (e.text !== '') ? dropdown_query.where('Category_Name', 'contains', e.text, true) : dropdown_query;
                //    e.updateData(lstCategory, dropdown_query);
                //}
            });
            dropcategory.appendTo('#txtCategory');
            var Category = document.getElementById("txtCategory").ej2_instances[0];
            var str_array = Categoryarr;
            Category.value = str_array;
        }
    },

    fnCategoryFailureCallback: function (error) {

    },
    fnGetSpeciality: function () {
        debugger;

        Method_params = ["CMEApi/GetDoctorSpeciality", CMEDefinition.defaults.CompanyCode];
        CoreREST.get(null, Method_params, null, CMEDefinition.fnSpecialitySuccessCallback, CMEDefinition.fnSpecialityFailureCallback);
        //HDAjax.requestInvoke('CME', 'GetRegionDetails', arrDetails, "POST", CMEDefinition.fnRegionDetailsSuccessCallback, CMEDefinition.fnRegionDetailsFailureCallback, null);
    },
    fnSpecialitySuccessCallback: function (response) {
        debugger;
        $("#speciality").empty();
        $("#speciality").html(' <input type="hidden" id="hdnSpeciality" /><input type="text" class="form-control form-control-sm" id="txtSpeciality" onblur="CMEDefinition.fnValidateSpecialityAutoFill(this);">');
        lstSpeciality = [];
        var specialityarr = [];
        for (var i = 0; i < response.list.length; i++) {
            _objData = {};
            _objData.value = response.list[i].Speciality_Code;
            _objData.label = response.list[i].Speciality_Name;
            specialityarr.push(response.list[i].Speciality_Code);
            lstSpeciality.push(_objData);
        }
        if (lstSpeciality.length > 0) {
            SpecialityDetails = lstSpeciality;
            var valueArr = [];

            dropspeciality = new ej.dropdowns.MultiSelect({
                dataSource: lstSpeciality,
                fields: { text: 'label', value: 'value' },
                placeholder: 'Select Speciality',
                mode: 'CheckBox',
                showSelectAll: true,
                showDropDownIcon: true,
                filterBarPlaceholder: 'Search Speciality',
                popupHeight: '350px',
                //filtering: function (e) {
                //    var dropdown_query = new ej.data.Query();
                //    dropdown_query = (e.text !== '') ? dropdown_query.where('Speciality_Name', 'contains', e.text, true) : dropdown_query;
                //    e.updateData(lstSpeciality, dropdown_query);
                //}
            });
            dropspeciality.appendTo('#txtSpeciality');
            var Speciality = document.getElementById("txtSpeciality").ej2_instances[0];
            var str_specialityarray = specialityarr;
            Speciality.value = str_specialityarray;
        }
    },

    fnSpecialityFailureCallback: function (error) {

    },
    fnValidateSpecialityAutoFill: function (Id) {
        debugger;
        var Specialityname = $('#' + Id.id).val();
        if (Specialityname != "" && SpecialityDetails.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < SpecialityDetails.length; o++) {
                if (SpecialityDetails[o].label == Specialityname) {
                    i = true;
                    s = SpecialityDetails[o].value;
                }
            }
            if (!i) {
                $("#hdnSpeciality").val(0);
            }
            else {
                $("#hdnSpeciality").val(s);
            }
        } else {
            $("#hdnSpeciality").val(0);
        }
    },
    fnValidateRegionAutoFill: function (Id) {
        debugger;
        var regionName = $('#' + Id.id).val();
        if (regionName != "" && regionDetails.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < regionDetails.length; o++) {
                if (regionDetails[o].label == regionName) {
                    i = true;
                    s = regionDetails[o].value;
                }
            }
            if (!i) {
                $("#hdnRegionCode").val(0);
            }
            else {
                $("#hdnRegionCode").val(s);
            }
        } else {
            $("#hdnRegionCode").val(0);
        }
    },
    fnValidateCategoryAutoFill: function (Id) {
        debugger;
        var Category = $('#' + Id.id).val();
        if (Category != "" && CategoryDetails.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < CategoryDetails.length; o++) {
                if (CategoryDetails[o].label == Category) {
                    i = true;
                    s = CategoryDetails[o].value;
                }
            }
            if (!i) {
                $("#hdnCategory").val(0);
            }
            else {
                $("#hdnCategory").val(s);
            }
        } else {
            $("#hdnCategory").val(0);
        }
    },

    //fnGetUnderRegions: function () {
    //    debugger;
    //    Method_params = ["CMEApi/GetDocForAllRegionsUndertheSelectedRegion", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.RegionCode, null, null, CMEDefinition.defaults.RegionCode];
    //    CoreREST.get(null, Method_params, null, CMEDefinition.fnUnderRegionsSuccessCallback, CMEDefinition.fnUnderRegionsFailureCallback);
    //    //HDAjax.requestInvoke('CME', 'GetRegionDetails', arrDetails, "POST", CMEDefinition.fnRegionDetailsSuccessCallback, CMEDefinition.fnRegionDetailsFailureCallback, null);
    //},
    //fnUnderRegionsSuccessCallback: function (response) {
    //    debugger;
    //    $("#RegionType").empty();
    //    $("#RegionType").html('<input type="hidden" id="hdnCampaignRegion" /><input type="text" class="form-control form-control-sm" id="txtCampaignRegion" onblur="CMEDefinition.fnValidateUnderRegionsAutoFill(this);">');
    //    lstUnderRegions = [];
    //    for (var i = 0; i < response.list.length; i++) {
    //        if (response.list[i].Doc_Count != 0) {
    //            _objData = {};
    //            _objData.value = response.list[i].Region_Code;
    //            _objData.label = response.list[i].Region_Name;
    //            lstUnderRegions.push(_objData);
    //        }
    //    }
    //    if (lstUnderRegions.length > 0) {
    //        UnderRegionsDetails = lstUnderRegions;
    //        var valueArr = [];
    //        // valueArr.push(lstUnderRegions[0].label);
    //        var atcObj = new ej.dropdowns.MultiSelect({
    //            //set the data to dataSource property
    //            dataSource: lstUnderRegions,
    //            fields: { text: 'label', value: 'value' },
    //            placeholder: 'Select a Region',
    //            mode: 'CheckBox',
    //            showSelectAll: true,
    //            showDropDownIcon: true,
    //            //filtering: function (e) {
    //            //    var dropdown_query = new ej.data.Query();
    //            //    dropdown_query = (e.text !== '') ? dropdown_query.where('Region_Name', 'contains', e.text, true) : dropdown_query;
    //            //    e.updateData(lstUnderRegions, dropdown_query);
    //            //}
    //        });
    //        atcObj.appendTo('#txtCampaignRegion');
    //        $('#txtCampaignRegion').html(lstUnderRegions[0].label);
    //        $('#hdnCampaignRegion').val(lstUnderRegions[0].value);
    //    }
    //},

    //fnUnderRegionsFailureCallback: function (error) {

    //},
    fnValidateUnderRegionsAutoFill: function (Id) {
        debugger;
        var UnderRegionname = $('#' + Id.id).val();
        if (UnderRegionname != "" && UnderRegionsDetails.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < UnderRegionsDetails.length; o++) {
                if (UnderRegionsDetails[o].label == UnderRegionname) {
                    i = true;
                    s = UnderRegionsDetails[o].value;
                }
            }
            if (!i) {
                $("#hdnCampaignRegion").val(0);
            }
            else {
                $("#hdnCampaignRegion").val(s);
            }
        } else {
            $("#hdnCampaignRegion").val(0);
        }
    },

    fnGetDesignations: function () {
        debugger;
        Method_params = ["CMEApi/GetDesignations", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.RegionCode];
        CoreREST.get(null, Method_params, null, CMEDefinition.fnDesignationsSuccessCallback, CMEDefinition.fnDesignationsFailureCallback);
    },
    fnDesignationsSuccessCallback: function (response) {
        debugger;
        $("#DrivenRegion").empty();
        $("#DrivenRegion").html('<input type="hidden" id="hdnDriven" /><input type="text" class="form-control form-control-sm" id="txtDriven" onblur="CMEDefinition.fnValidateDesignationsAutoFill(this);">');
        lstDesignations = [];
        var desarr = []
        for (var i = 0; i < response.list.length; i++) {
            if (response.list[i].Doc_Count != 0) {
                _objData = {};
                _objData.label = response.list[i].Region_Type_Name + ' (' + response.list[i].User_Type_Name + ')';
                _objData.value = response.list[i].Region_Type_Code;
                lstDesignations.push(_objData);
                desarr.push(response.list[i].Region_Type_Code);
            }
        }
        if (lstDesignations.length > 0) {
            DesignationDetails = lstDesignations;
            var valueArr = [];
            // valueArr.push(lstUnderRegions[0].label);
            dropdesignation = new ej.dropdowns.MultiSelect({
                //set the data to dataSource property
                dataSource: lstDesignations,
                fields: { text: 'label', value: 'value' },
                placeholder: 'Select a Designation',
                mode: 'CheckBox',
                showSelectAll: true,
                showDropDownIcon: true,
                //filtering: function (e) {
                //    var dropdown_query = new ej.data.Query();
                //    dropdown_query = (e.text !== '') ? dropdown_query.where('Region_Name', 'contains', e.text, true) : dropdown_query;
                //    e.updateData(lstDesignations, dropdown_query);
                //}
            });
            dropdesignation.appendTo('#txtDriven');
            var des = document.getElementById("txtDriven").ej2_instances[0];
            var str_array = desarr;
            des.value = str_array;
        }
    },

    fnDesignationsFailureCallback: function (error) {

    },
    fnValidateDesignationsAutoFill: function (Id) {
        debugger;
        var Designationname = $('#' + Id.id).val();
        if (Designationname != "" && DesignationDetails.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < DesignationDetails.length; o++) {
                if (DesignationDetails[o].label == Designationname) {
                    i = true;
                    s = DesignationDetails[o].value;
                }
            }
            if (!i) {
                $("#hdnDriven").val(0);
            }
            else {
                $("#hdnDriven").val(s);
            }
        } else {
            $("#hdnDriven").val(0);
        }
    },
    fnGetProducts: function (mode) {
        debugger;
        if ($("select[name='division']").val().length > 0) {
            for (var i = 0; i < $("select[name='division']").val().length; i++) {
                var divisioncode = $("select[name='division']").val() + ','
            }
        }
        Method_params = ["CMEApi/GetSaleProductsBasedOnRegion", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.RegionCode, mode, divisioncode];
        CoreREST.get(null, Method_params, null, CMEDefinition.fnProductsSuccessCallback, CMEDefinition.fnProductsFailureCallback);
    },
    fnProductsSuccessCallback: function (response) {
        debugger;
        $('.product').val('');

        if (response != null && response.list[0].lstProducts.length > 0) {
            if (response.list[0].Mode.toUpperCase() == "SALES") {
                var lstproductSales = [];
                for (var i = 0; i < response.list[0].lstProducts.length; i++) {
                    _objData = {};
                    _objData.value = response.list[0].lstProducts[i].Product_Code;
                    _objData.label = response.list[0].lstProducts[i].Product_Name;
                    lstproductSales.push(_objData);
                }
                saleProd_g = lstproductSales;//response.list[0].lstProducts;
                CMEDefinition.fnCreateProductTable('LOAD');

                //if (lstproduct.length > 0) {
                //    ProductDetails = lstproduct;
                //    var valueArr = [];
                //    valueArr.push(lstproduct[0].label);
                //    var atcObj = new ej.dropdowns.ComboBox({
                //        //set the data to dataSource property
                //        dataSource: lstproduct,
                //        fields: { text: 'label' },
                //        placeholder: 'Select a Product',
                //        value: valueArr
                //        //change: CUSTOMER.change,
                //    });
                //    atcObj.appendTo('.product');
                //    $('.product').html(lstproduct[0].label);
                //    $('.hdnproduct').val(lstproduct[0].value);
                //    CMEDefinition.fnGetProducts('sample');
                //}
            } else if (response.list[0].Mode.toUpperCase() == "SAMPLE") {
                var lstproductSample = [];
                for (var i = 0; i < response.list[0].lstProducts.length; i++) {
                    _objData = {};
                    _objData.value = response.list[0].lstProducts[i].Product_Code;
                    _objData.label = response.list[0].lstProducts[i].Product_Name;
                    lstproductSample.push(_objData);
                }
                sampleProd_g = lstproductSample;// response.list[0].lstProducts;

                //if (lstproduct.length > 0) {
                //    ProductDetails = lstproduct;
                //    var valueArr = [];
                //    valueArr.push(lstproduct[0].label);
                //    var atcObj = new ej.dropdowns.ComboBox({
                //        //set the data to dataSource property
                //        dataSource: lstproduct,
                //        fields: { text: 'label' },
                //        placeholder: 'Select a Product',
                //        value: valueArr
                //        //change: CUSTOMER.change,
                //    });
                //    atcObj.appendTo('.sample');
                //    $('.sample').html(lstproduct[0].label);
                //    $('.hdnsample').val(lstproduct[0].value);
                //}
            }

        }
    },

    fnProductsFailureCallback: function (error) {

    },
    fnValidateProductsAutoFill: function (Id) {
        debugger;
        var Productname = $('#' + Id.id).val();
        if (Productname != "" && ProductDetails.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < ProductDetails.length; o++) {
                if (ProductDetails[o].label == Productname) {
                    i = true;
                    s = ProductDetails[o].value;
                }
            }
            if (!i) {
                $(".hdnproduct").val(0);
            }
            else {
                $(".hdnproduct").val(s);
            }
        } else {
            $(".hdnproduct").val(0);
        }
    },

    fnCreateProductTable: function (id) {
        debugger;
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
            // $(".bindproducts").append(prodStr);
            //if (saleProd_g != null && saleProd_g.length > 0) {
            //    var atcObj = new ej.dropdowns.ComboBox({
            //        //set the data to dataSource property
            //        dataSource: saleProd_g,
            //        fields: { text: 'label', value: 'value' },
            //        placeholder: 'Select a Product',
            //    });
            //    atcObj.appendTo('#txtsale_' + count);
            //    CMEDefinition.fnValidateSaleAutoFill(this, count);
            //}

            $(".bindproducts").append(prodStr);
            autoComplete(saleProd_g, "txtsale", "hdnsale", 'autoSale');
            //fnMarketingCampaignEventBinder();
            CMEDefinition.fnMarketingCampaignEventBinder();
            //var isVisible = $('#usertree').is(':visible');
            //if (isVisible == true) {
            //    $('.dvsalebox').removeClass('col-lg-12');
            //    $('.dvsalebox').addClass('col-lg-12');
            //} else {
            //    $('.dvsalebox').removeClass('col-lg-12');
            //    $('.dvsalebox').addClass('col-lg-12');
            //}
        }
        //$.unblockUI();
        //fnGetAllRegionUsers(Sel_Region_Code);
        //fnRegionBindTreeAlreadySelected();
    },
    fnValidateSaleAutoFill: function (Id, count) {
        debugger;
        var salename = $('#' + Id.id).val();
        if (salename != "" && saleProd_g.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < saleProd_g.length; o++) {
                if (saleProd_g[o].label == salename) {
                    i = true;
                    s = saleProd_g[o].value;
                }
            }
            if (!i) {
                $('#hdnsale_' + count + '').val(0);
            }
            else {
                $('#hdnsale_' + count + '').val(s);
            }
        } else {
            $('#hdnsale_' + count + '').val(0);
        }
    },
    fnCreateSampleProductNewRow: function (id) {
        debugger;
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
            //var atcObj = new ej.dropdowns.ComboBox({
            //    //set the data to dataSource property
            //    dataSource: sampleProd_g,
            //    fields: { text: 'label', value: 'value' },
            //    placeholder: 'Select a Product',
            //});
            //atcObj.appendTo('#txtsample_' + mainId + '_' + NxtId);
            //CMEDefinition.fnValidateSampleAutoFill(this, mainId, NxtId);
            autoComplete(sampleProd_g, "txtsample", "hdnsample", 'autoSample');

            //autoComplete(sampleProd_g, "txtsample", "hdnsample", 'autoSample');
            //var isVisible = $('#usertree').is(':visible');
            //if (isVisible == true) {
            //    $('.dvsalebox').removeClass('col-lg-12');
            //    $('.dvsalebox').addClass('col-lg-12');
            //} else {
            //    $('.dvsalebox').removeClass('col-lg-12');
            //    $('.dvsalebox').addClass('col-lg-12');
            //}

            CMEDefinition.fnMarketingCampaignEventBinder();
        }
    },
    fnValidateSampleAutoFill: function (Id, mainId, NxtId) {
        debugger;
        var samplename = $('#' + Id.id).val();
        if (samplename != "" && sampleProd_g.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < sampleProd_g.length; o++) {
                if (sampleProd_g[o].label == samplename) {
                    i = true;
                    s = sampleProd_g[o].value;
                }
            }
            if (!i) {
                $('#hdnsample_' + mainId + '_' + NxtId).val(0);
            }
            else {
                $('#hdnsample_' + mainId + '_' + NxtId).val(s);
            }
        } else {
            $('#hdnsample_' + mainId + '_' + NxtId).val(0);
        }
    },
    fnMarketingCampaignEventBinder: function () {

        $(".autoSale").keypress(function () { CMEDefinition.fnCreateProductTable(this); CMEDefinition.fnClose(this); });
        $(".autoSale").dblclick(function () { CMEDefinition.fnCreateProductTable(this); CMEDefinition.fnClose(this); });
        //$(".autoSale").blur(function () { fnCreateProductTable(this); }); 


        $(".autoSample").dblclick(function () { CMEDefinition.fnCreateSampleProductNewRow(this); CMEDefinition.fnClose(this); });
        $(".autoSample").keypress(function () { CMEDefinition.fnCreateSampleProductNewRow(this); CMEDefinition.fnClose(this); });

        $(".DueDate").hover(function () { CMEDefinition.fnDueDate(this); });
        $(".DueDate").click(function () { CMEDefinition.fnDueDate(this); });

        $(".StartDate").hover(function () { CMEDefinition.fnDueDate(this); });
        $(".StartDate").click(function () { CMEDefinition.fnDueDate(this); });

        $('.autactivity').keypress(function () { CMEDefinition.fnActivityAuto(this); CMEDefinition.fnCreateSampleProductNewRow(this); });
        $('.autactivity').dblclick(function () { CMEDefinition.fnActivityAuto(this); CMEDefinition.fnCreateSampleProductNewRow(this); });
        $('.autactivity').click(function () { CMEDefinition.fnActivityAuto(this); CMEDefinition.fnCreateSampleProductNewRow(this); });
        $('.autactivity').blur(function () { CMEDefinition.fnActivityAuto(this); CMEDefinition.fnCreateSampleProductNewRow(this); });

        $(".checkexpnumeric").blur(function () { if ($(this).val() != "") { return fnCheckInt(this); } });

    },
    fnActivityAuto: function () {
        autoComplete(Activities_g, "txtactivity", "hdnactivityval", "auto_activity");
        //var lstActivity = [];
        //for (var i = 0; i < Activities_g.length; i++) {
        //    _objData = {};
        //    _objData.value = Activities_g[i].Activity_Id;
        //    _objData.label = Activities_g[i].Activity_Name;
        //    lstActivity.push(_objData);
        //}
        //if (lstActivity.length > 0) {
        //    ActivityDetails = lstActivity;
        //    var valueArr = [];
        //    valueArr.push(lstActivity[0].label);
        //    var atcObj = new ej.dropdowns.ComboBox({
        //        //set the data to dataSource property
        //        dataSource: lstActivity,
        //        fields: { text: 'label' },
        //        placeholder: 'Select a Activity',
        //        value: valueArr
        //        //change: CUSTOMER.change,
        //    });
        //    atcObj.appendTo('#txtactivity');
        //    $('#txtactivity').html(lstActivity[0].label);
        //    $('#hdnactivityval').val(lstActivity[0].value);
        //}
    },
    fnGetActivities: function () {
        debugger;
        Method_params = ["CMEApi/GetActivities", CMEDefinition.defaults.CompanyCode];
        CoreREST.get(null, Method_params, null, CMEDefinition.fnActivitiesSuccessCallback, CMEDefinition.fnActivitiesFailureCallback);
        //HDAjax.requestInvoke('CME', 'GetRegionDetails', arrDetails, "POST", CMEDefinition.fnRegionDetailsSuccessCallback, CMEDefinition.fnRegionDetailsFailureCallback, null);
    },
    fnActivitiesSuccessCallback: function (response) {
        debugger;
        var Activities = "["
        for (var i = 0; i < response.list.length; i++) {
            Activities += "{label:" + '"' + "" + response.list[i].Activity_Name + "" + '",' + "value:" + '"' + "" + response.list[i].Activity_Id + "" + '"' + "}";
            if (i < response.list.length - 1) {
                Activities += ",";
            }
        }
        Activities += "];";
        // Activities_g = response.list;
        Activities_g = eval(Activities);

    },

    fnActivitiesFailureCallback: function (error) {

    },


    fnDueDate: function (Id) {
        debugger;
        var SDate = '';
        var EDate = '';
        if ($('#txtStartDate').val() != "" && $('#txtEndDate').val() != "") {
            var SDate = $('#txtStartDate').val();
            // SDate = SDate.split('/')[2] + '/' + SDate.split('/')[1] + '/' + SDate.split('/')[0];
            var EDate = $('#txtEndDate').val();
            // EDate = EDate.split('/')[2] + '/' + EDate.split('/')[1] + '/' + EDate.split('/')[0];
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
    },
    fnClose: function (Id) {
        $(".ac_results").mouseleave(function () {
            $('.ac_results').hide();
        });
        //$('#ui-datepicker-div').mouseleave(function () {
        //    $('#ui-datepicker-div').hide();
        //});
    },
    fnShowInputsOnselect: function (value, id) {
        debugger;

        var DPM_Count = $("#hdnMappedDoctorCount").val();

        //if (activitiy_Mand >= 1 && value=='A')
        //    {
        //        var mainId = id.split('_')[1];
        //        var subId = id.split('_')[2];
        //        fnMsgAlert('info', 'CME', 'You can select only one activity for a CME.');
        //        $('#inpttype_' + mainId + '_' + subId).val(0);
        //        return false;
        //    }
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
            //var atcObj = new ej.dropdowns.ComboBox({
            //    //set the data to dataSource property
            //    dataSource: sampleProd_g,
            //    fields: { text: 'label', value: 'value' },
            //    placeholder: 'Select a Product',
            //    //change: CUSTOMER.change,
            //});
            //atcObj.appendTo('#txtsample_' + mainId + '_' + subId);
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
            CMEDefinition.fnMarketingCampaignEventBinder();
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
            var Activity = $("#txtsale_" + mainId).val();
            // var hiddenActitvity = $("#hdnsale_" + mainId).val();
            // $("#txtactivity_" + mainId + "_" + subId).val(Activity);
            //  $("#hdnsample_" + mainId + "_" + subId).val(hiddenActitvity);
            CMEDefinition.fnMarketingCampaignEventBinder();
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



            CMEDefinition.fnMarketingCampaignEventBinder();
            return false;
        }
    },
    RemoveRow: function (mainId, subId) {
        debugger;
        var samp_lngth = $('.sample_' + mainId).length;
        if (samp_lngth == 1) {
            $("#inpttype_" + mainid + "_" + subid).attr("disabled", false);
            $("#remove_" + mainid + "_" + subid).hide();
        } else {
            //if ($("#inpttype_" + mainId + "_" + subId).val() == 'A')
            //{
            //    activitiy_Mand = activitiy_Mand - 1;
            //}
            $('.sample_' + mainId + '_' + subId).remove();
        }

    },
    fnValidateAutofillMC: function (Id) {
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
    },
    fnValidateInputVO: function (Id, evt) {

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
    },
    fnSaveMarketingCampaignDefiner: function () {
        debugger;
        ShowModalPopup("dvloading");
        if (CMEDefinition.fnValidateMarketingCampaignDefiner()) {
            //Campaign_Name
            var campName = $.trim($('#campaignname').val());
            //Campaign_Description
            var campDescrp = $.trim($('#Campaigndescription').val());
            //Campaign_Code
            var campCode = Campaign_Code;
            var NoOfMonth = $.trim($('#NoofMonth').val());
            var CMEType = $('#type').val();
            //Customer_Category_Code
            //  var docCatCode = "";
            // var docCategoryCode = {};
            var docCatCode = [];
            var docCategoryCode = $("select[name=txtCategory]").val();
            if (docCategoryCode == null) {

                for (var i = 0; i < lstCategory.length; i++) {
                    var _obj = {
                        Category_Code: lstCategory[i].value
                    };
                    docCatCode.push(_obj)
                }
            }
            else {
                for (var i = 0; i < docCategoryCode.length; i++) {
                    var _obj = {
                        Category_Code: docCategoryCode[i]
                    };
                    docCatCode.push(_obj)
                }
            }

            //docCategoryCode = {
            //    docCatCode: $("select[name=txtCategory]").val()

            //};
            //docCatCode.push(docCategoryCode);
            //Customer_Speciality_Code
            //var specialityCode = {};
            var specCode = [];
            var Specialitycode = $("select[name=txtSpeciality]").val();
            if (Specialitycode == null) {

                for (var i = 0; i < lstSpeciality.length; i++) {
                    var _obj = {
                        Speciality_Code: lstSpeciality[i].value
                    };
                    specCode.push(_obj)
                }
            }
            else {
                for (var i = 0; i < Specialitycode.length; i++) {
                    var _obj = {
                        Speciality_Code: Specialitycode[i]
                    };
                    specCode.push(_obj)
                }
            }

            //specialityCode = {
            //    specCode: $("select[name=txtSpeciality]").val()

            //};
            //specCode.push(specialityCode);

            //Start_Date
            //var sDate = $('#Startdate').val().split('/')[2] + '/' + $('#Startdate').val().split('/')[1] + '/' + $('#Startdate').val().split('/')[0];
            var sDate = $('#Startdate').val();
            //End_Date
            //var eDate = $('#EndDate').val().split('/')[2] + '/' + $('#EndDate').val().split('/')[1] + '/' + $('#EndDate').val().split('/')[0];
            var eDate = $('#EndDate').val()
            //Track_Till_Date
            var ttDate = '';
            if ($('#Trackfrom').val() != "") {
                //ttDate = $('#Trackfrom').val().split('/')[2] + '/' + $('#Trackfrom').val().split('/')[1] + '/' + $('#Trackfrom').val().split('/')[0];
                ttDate = $('#Trackfrom').val();
            }
            var tfdate = '';
            if ($('#TrackTill').val() != "") {
                //  tfdate = $('#TrackTill').val().split('/')[2] + '/' + $('#TrackTill').val().split('/')[1] + '/' + $('#TrackTill').val().split('/')[0];
                tfdate = $('#TrackTill').val();
            }
            //Campaign Based On
            var CamBasdOn = 1;


            //Customer_Count
            var custCount = '';
            if (CamBasdOn == 1) {
                custCount = $('#Count').val();
            } else {
                custCount = $('#Count').val();
            }


            //Doctor_Selection
            var docSelection = $('input:radio[name=SelectionRadios]:checked').val();



            //Designation_Code


            var entityCode = [];
            var DesignationCode = $("select[name=txtDriven]").val();
            if (DesignationCode == null) {
                for (var i = 0; i < lstDesignations.length; i++) {
                    var _obj = {
                        Region_Type_Code: lstDesignations[i].value
                    };
                    entityCode.push(_obj)
                }
            }
            else {
                for (var i = 0; i < DesignationCode.length; i++) {
                    var _obj = {
                        Region_Type_Code: DesignationCode[i]
                    };
                    entityCode.push(_obj)
                }
            }

            //
            var Region_Code = CMEDefinition.defaults.RegionCode;
            var ParticipatingRegionCode = [];

            if (selKeys.length >= 1) {
                for (var i = 0; i < selKeys.length; i++) {
                    var ObjParReg = {
                        Region_Code: selKeys[i],
                    };
                    ParticipatingRegionCode.push(ObjParReg);
                }


            }
            var BudgetOfCamp = null;
            var FreqOfCamp = null;

            //Product And Sample
            var productString = "";
            total_prod_lgnth = $(".dvsalebox").length;
            var ProdtSample = [];
            var ActivityCount = 0;
            for (var a = 1; a <= total_prod_lgnth; a++) {
                //var sale_Prod = $("#txtsale_" + a).val();
                //var dd = document.getElementById("txtsale_1").ej2_instances[0];
                //var Product_Code=dd.value;
                //if (Campaign_Code != '' && $('#hdnsale_' + a).val() != 0) {
                //    var Product_Code = $('#hdnsale_' + a).val();
                //}
                //else{
                //    var Product_Code = $('select[name=txtsale_' + a + ']').val();
                //}
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
                                ActivityCount = ActivityCount + 1;
                            }
                            else if (InputType == "PI") {
                                var Sample_Code = $('#hdnsample_' + rowid).val();
                                //var sample = document.getElementById("txtsample_" + rowid).ej2_instances[0];
                                //var Sample_Code=sample.value;
                                //if (Campaign_Code != '' && $('#hdnsample_' + rowid).val() != 0) {
                                //    var Sample_Code = $('#hdnsample_' + rowid).val();
                                //}
                                //else
                                //{
                                //    var Sample_Code = $('select[name=txtsample_' + rowid + ']').val();
                                //}
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
            // if (ActivityCount <= 1) {
            var objcampaign = {
                Status: 'Approved',
                Campaign_Name: campName,
                Campaign_Description: campDescrp,
                Start_Date: sDate,
                End_Date: eDate,
                Track_Till: ttDate,
                Track_From: tfdate,
                lstRegionCodes: ParticipatingRegionCode,
                lstDesignation: entityCode,
                Campaign_Based_On: CamBasdOn,
                Customer_Count: custCount,
                Doctor_Product_Mapping_Validation: docSelection,
                lstCategorycode: docCatCode,
                lstSpecialityCode: specCode,
                Budget_Of_Campaign: BudgetOfCamp,
                Frequency_Of_Campaign: FreqOfCamp,
                Campaign_Code: campCode,
                lstProdSamp: ProdtSample,
                No_Of_Month: NoOfMonth,
                CME_Type: CMEType
            };

            HideModalPopup("dvloading");


            //$('#main').block({
            //    message: '<h3>Saving...</h3>',
            //    css: { border: '2px solid #ddd' }
            //});
            //objcampaign = JSON.stringify({ "ObjMCHeader": MarketingCampaignModel, "regionCode": ParRegionCode }),
            //var objcampaign =
            //    {
            //        ObjMCHeader:MarketingCampaignModel,
            //        regionCode: ParRegionCode
            //    }

            Method_params = ["CMEApi/InsertCMECampaign", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.UserCode, CMEDefinition.defaults.CompanyId, Region_Code];
            CoreREST.post(null, Method_params, objcampaign, CMEDefinition.BindpostSuccessData, CMEDefinition.BindpostFailure);
            // }
            //else {
            //    fnMsgAlert('info', 'CME', 'You can select only one activity for a CME.');
            //    HideModalPopup("dvloading");
            //    return false;
            //}
        }
    },
    BindpostSuccessData: function (response) {
        debugger;
        if (response == 0 || response == 1) {
            swal({
                icon: "success",
                title: "Success",
                text: 'CME Saved successfully.',
                button: "Ok",
            });
            CMEDefinition.fnCancelCMEDefiner();
            HideModalPopup("dvloading")
        }
        else {
            fnMsgAlert('error', 'CME', 'Error while saving the CME.');
        }
        $("#main").unblock();
    },

    BindpostFailure: function () {

    },
    regExforAlphaNumericSpecificRemarks: function (value) {
        var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
        //var specialCharregex = new RegExp("^[''!@#$%^*?+=|]+$");
        if (specialCharregex.test(value) == true) {
            return false;
        }
        else {
            return true;
        }
    },

    fnValidateMarketingCampaignDefiner: function () {    // empty check
        debugger;
        var flag = true;
        if ($.trim($('#campaignname').val()) == "") {
            fnMsgAlert('info', 'CME', 'Please Enter CME Name.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if ($('#type').val() == "") {
            fnMsgAlert('info', 'CME', 'Please Select CME Type.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if ($("select[name='division']").val() == null) {
            //   if ($("select[name='division']").val().length==0) {
            fnMsgAlert('info', 'CME', 'Please Select Division.');
            HideModalPopup("dvloading");
            flag = false;
            return;
            // }
        }
        //special char check   
        if (CMEDefinition.regExforAlphaNumericSpecificRemarks($("#campaignname").val()) == false) {
            HideModalPopup("dvloading");
            fnMsgAlert('info', 'CME', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the CME Name.');
            flag = false;
            return;
        }
        if (CMEDefinition.regExforAlphaNumericSpecificRemarks($("#Campaigndescription").val()) == false) {
            fnMsgAlert('info', 'CME', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the CME Description.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        //if (CMEDefinition.regExforAlphaNumericSpecificRemarks($("#Budget").val()) == false) {
        //    fnMsgAlert('info', 'CME', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Budget of CME.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}
        //Date validation

        if ($.trim($('#Startdate').val()) == "") {
            fnMsgAlert('info', 'CME', 'Please Select Start Date.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if ($.trim($('#EndDate').val()) == "") {
            fnMsgAlert('info', 'CME', 'Please Select End Date.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }

        var ttDate = "";
        var TtDate = '';
        var tfDate = '';
        var TfDate = '';
        var fromDate = $("#Startdate").val();
        var toDate = $("#EndDate").val();
        if ($("#Trackfrom").val() != undefined && $("#Trackfrom").val() != '') {
            ttDate = $("#txtMonths").val();
            TtDate = new Date(ttDate);
        }
        if ($('#TrackTill').val() != undefined && $('#TrackTill').val() != '') {
            tfDate = $('#TrackTill').val();
            TfDate = new Date(tfDate);
        }
        var startDate = new Date(fromDate);
        var endDate = new Date(toDate);


        //Invalid Date   

        //if (!(fnValidateDateFormate($("#txtStartDate"), "Start Date"))) {
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}
        //if (!(fnValidateDateFormate($("#txtEndDate"), "End Date"))) {
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}

        if (startDate > endDate) {
            fnMsgAlert('info', 'CME', 'End date can not be less than Start date.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if (TfDate != undefined && TfDate != '') {
            if ((TfDate > endDate) || (TfDate < startDate)) {
                fnMsgAlert('info', 'CME', 'Track From Date should be in between Start Date And End Date');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
        }


        if (TtDate != undefined && TtDate != "") {
            if (TtDate < startDate) {
                fnMsgAlert('info', 'CME', 'Track Till Date can not be less than Start date.');
                HideModalPopup("dvloading");
                flag = false;
                return;
            }
            if (TfDate != undefined && TfDate != '') {
                if (TtDate < TfDate) {
                    fnMsgAlert('info', 'CME', 'Track Till Date can not be less than Track From Date.');
                    HideModalPopup("dvloading");
                    flag = false;
                    return;
                }
                if ((TfDate > endDate) || (TfDate < startDate)) {
                    fnMsgAlert('info', 'CME', 'Track From Date should be in between Start Date And End Date');
                    HideModalPopup("dvloading");
                    flag = false;
                    return;
                }
                if (TtDate < endDate) {
                    fnMsgAlert('info', 'CME', 'Track Till Date should be greater than End Date');
                    HideModalPopup("dvloading");
                    flag = false;
                    return;
                }
            }
        }
        //Region(s) Selection Validation



        //Region Type Selection
        //if ($("select[name=txtCategory]").val() == null) {
        //    fnMsgAlert('info', 'CME', 'Please Select Atleast One Region Type.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}
        //var entity_Names = new Array();
        //$('select#ddlCategory > option:selected').each(function () {
        //    // entityCode += $(this).val() + ',';
        //    entity_Names.push($(this).text().split('(')[0]);
        //});

        //Campaign Based On Selection
        //if ($('input:radio[name=CampaignRadios]:checked').length <= 0) {
        //    fnMsgAlert('info', 'CME', 'Please select CME Based On.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}

        //Customer_Count Based On Campaign_Based_On


        //if ($('input:radio[name=CampaignRadios]:checked').val() == 1) {
        //    if ($.trim($('#Count').val()) == "") {
        //        fnMsgAlert('info', 'CME', 'Please Enter Customer Count Per Territory.');
        //        HideModalPopup("dvloading");
        //        flag = false;
        //        return;
        //    }
        //    if ($.trim($('#Count').val()) == 0) {
        //        fnMsgAlert('info', 'CME', 'Please Enter Customer Count Per Territory other than Zero(0).');
        //        HideModalPopup("dvloading");
        //        flag = false;
        //        return;
        //    }
        //if (CustCount != "") {
        //if ($.trim($('#Count').val()) != "") {
        //    if ($('#Count').val() < CustCount) {
        //        fnMsgAlert('info', 'Marketing Campaign Definer', 'Customer Count Per Territory cannot be reduced for Approved or UnApproved Marketing Campaigns.');
        //        $('#Count').html(CustCount);
        //        HideModalPopup("dvloading");
        //        flag = false;
        //        return;
        //    }

        //}
        // }
        //} else {
        //    if ($.trim($('#Count').val()) == "") {
        //        fnMsgAlert('info', 'CME', 'Please Enter Customer Count Per Role.');
        //        HideModalPopup("dvloading");
        //        flag = false;
        //        return;
        //    }
        //if (CustCount != "") {
        //if ($.trim($('#Count').val()) != "") {
        //    if ($('#Count').val() < CustCount) {
        //        fnMsgAlert('info', 'CME', 'Customer Count Per Role cannot be reduced for Approved or UnApproved Marketing Campaigns.');
        //        $('#Count').html(CustCount);
        //        HideModalPopup("dvloading");
        //        flag = false;
        //        return;
        //    }

        //}
        //}

        //}

        //Customer Selection
        if ($('input:radio[name=SelectionRadios]:checked').length <= 0) {
            fnMsgAlert('info', 'CME', 'Please select Customer Selection.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }

        //if ($('input:radio[name=SelectionRadios]:checked').val() == "R") {
        //    if ($('input:radio[name=CampaignRadios]:checked').val() == 1) {
        //        if (parseInt($("#Count").val()) == 0) {
        //            fnMsgAlert('info', 'CME', 'Customer count per Territory cannot be zero when doctor selection is rigid.');
        //            HideModalPopup("dvloading");
        //            flag = false;
        //            return;
        //        }
        //    } else {
        //        if (parseInt($("#Counts").val()) == 0) {
        //            fnMsgAlert('info', 'CME', 'Customer count per role cannot be zero when doctor selection is rigid.');
        //            HideModalPopup("dvloading");
        //            flag = false;
        //            return;
        //        }
        //    }
        //}



        ////Customer Category
        //if ($("select[name=txtCategory]").val() == null) {
        //    fnMsgAlert('info', 'CME', 'Please Select Atleast One Customer Category.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}

        //Customer Speciality
        //if ($("select[name=txtSpeciality]").val() == null) {
        //    fnMsgAlert('info', 'CME', 'Please Select Atleast One Customer Speciality.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}

        //if ($("select[name=txtCampaignRegion]").val() == null) {
        //    fnMsgAlert('info', 'CME', 'Please Select Regions Participating in CME.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}
        //if ($("select[name=txtDriven]").val() == null) {
        //    fnMsgAlert('info', 'CME', 'Please Select CME Driven by.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}


        if ($('#NoofMonth').val() == '') {
            fnMsgAlert('info', 'CME', 'Please Enter No Of Month.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }
        if ($('#NoofMonth').val() <= 0) {
            fnMsgAlert('info', 'CME', 'Please enter no of month greater than zero.');
            HideModalPopup("dvloading");
            flag = false;
            return;
        }




        //Product Box Check
        var uniqueProd = new Array();
        var activitymandatory = 0;
        var Line_Item_Budget_Array = new Array();
        for (var a = 1; a <= $(".dvsalebox").length; a++) {
            var sample_Lngth_Det = $(".sample_" + a).length;
            if ($("#txtsale_" + a).val() != "") {


                if ($("#hiddenflag_" + a).val() == 0) {
                    var saleJson = jsonPath(saleProd_g, "$.[?(@.value=='" + $("#hdnsale_" + a).val() + "')]");
                    if (saleJson == false || saleJson === undefined) {
                        fnMsgAlert('info', 'CME', 'Please Enter Valid Sale Product.');
                        HideModalPopup("dvloading");
                        $("#txtsale_" + a).focus();
                        flag = false;
                        return;
                    }

                    // unique check
                    if ($.inArray($("#hdnsale_" + a).val(), uniqueProd) > -1) {
                        fnMsgAlert('info', 'CME', 'You have already entered the product ' + $("#txtsale_" + a).val() + '.');
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
                                    fnMsgAlert('info', 'CME', 'Visit Order cannot be less than 1.');
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
                                fnMsgAlert('info', 'CME', 'Quantity cannot be a negative number.');
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
                                fnMsgAlert('info', 'CME', 'Please select Due Date between Start Date and End Date');
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
                                fnMsgAlert('info', 'CME', 'Please select Line Item Start Date between Campaign Start Date and Campaign End Date');
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
                                fnMsgAlert('info', 'CME', 'Please select Line Item Due Date greater than Start Date');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                        }
                        if (parseInt($('#txtBudget_' + rowid).val()) == 0) {
                            fnMsgAlert('info', 'CME', 'Line Item cannot be Zero(0).Please Enter Other than Zero(0)');
                            HideModalPopup("dvloading");
                            flag = false;
                            return;
                        } else if ($('#txtBudget_' + rowid).val() != "" && $('#txtBudget_' + rowid).val() != undefined && $('#txtBudget_' + rowid).val() != null) {
                            Line_Item_Budget_Array.push($('#txtBudget_' + rowid).val());
                        }
                        //if (parseInt($('#txtBudget_' + rowid).val()) > parseInt($("#Budget").val())) {
                        //    fnMsgAlert('info', 'CME', 'Budget for Promotional Product/Activity should be less than Budget of CME.');
                        //    HideModalPopup("dvloading");
                        //    flag = false;
                        //    return;
                        //}
                    }
                    else if (InputType == "A") {

                        if (InputType == "A" && $('#txtactivity_' + rowid).val() == '') {
                            fnMsgAlert('info', 'CME', 'Please Enter Activity Name for the Selected Input');
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
                                    //if (Acondt == true) {
                                    //    fnMsgAlert('info', 'CME', 'You have already entered the Activity name "' + $('#txtactivity_' + rowid).val() + '".Please select the Activity from list');
                                    //    HideModalPopup("dvloading");
                                    //    flag = false;
                                    //    return;
                                    //}
                                }
                            }
                            if ($('#txtactivity_' + rowid).val() != undefined) {
                                activitymandatory = activitymandatory + 1;
                            }
                            //if ($('#txtactivity_' + rowid).val() == undefined) {
                            //    fnMsgAlert('info', 'CME', 'Please enter atleast one activity to save CME.');
                            //    HideModalPopup("dvloading");
                            //    flag = false;
                            //    return false;
                            //}
                        }

                        if ($.inArray($('#hdnactivityval_' + rowid).val(), uniqActivity) > -1) {
                            fnMsgAlert('info', 'CME', 'You have already entered the Activity ' + $('#txtactivity_' + rowid).val() + ' for visit order ' + $("#txtvisitorder_" + rowid).val() + ' for the sale product ' + $("#txtsale_" + a).val() + '.');
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
                        if (CMEDefinition.regExforAlphaNumericSpecificRemarks($("#txtsample_" + rowid).val()) == false) {
                            fnMsgAlert('info', 'CME', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Activity.')
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
                                fnMsgAlert('info', 'CME', 'Please select Due Date between Start Date and End Date');
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
                                fnMsgAlert('info', 'CME', 'Please select Line Item Start Date between Campaign Start Date and Campaign End Date');
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
                                fnMsgAlert('info', 'CME', 'Please select Line Item Due Date greater than Start Date');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                        }
                        if (parseInt($('#txtBudget_' + rowid).val()) == 0) {
                            fnMsgAlert('info', 'CME', 'Line Item cannot be Zero(0).Please Enter Other than Zero(0)');
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
                                fnMsgAlert('info', 'CME', 'Please Enter Sale Product.');
                                HideModalPopup("dvloading");
                                $("#txtsale_" + a).focus();
                                flag = false;
                                return;
                            }
                            if ($("#hiddenflagsamp_" + rowid).val() == 0) {
                                if ($("#txtsample_" + rowid).val() != "") {

                                    var sampleJson = jsonPath(sampleProd_g, "$.[?(@.value=='" + $("#hdnsample_" + rowid).val() + "')]");
                                    if (sampleJson == false || sampleJson === undefined) {
                                        fnMsgAlert('info', 'CME', 'Please Enter Valid Sample Product.');
                                        HideModalPopup("dvloading");
                                        $("#txtsample_" + rowid).focus();
                                        flag = false;
                                        return;
                                    }
                                }
                            }

                            if ($("#txtvisitorder_" + rowid).val() != "") {
                                if (parseInt($("#txtvisitorder_" + rowid).val()) < 1) {
                                    fnMsgAlert('info', 'CME', 'Visit Order cannot be less than 1.');
                                    HideModalPopup("dvloading");
                                    $("#txtvisitorder_" + rowid).focus();
                                    flag = false;
                                    return;
                                }
                            }
                            else {
                                fnMsgAlert('info', 'CME', 'Please enter Visit Order.');
                                HideModalPopup("dvloading");
                                $("#txtvisitorder_" + rowid).focus();
                                flag = false;
                                return;
                            }

                            // unique sample product and visit order for a sale product check
                            if ($.inArray($("#hdnsample_" + rowid).val() + '_' + $("#txtvisitorder_" + rowid).val(), uniqSampPrdVisitOrd) > -1) {
                                fnMsgAlert('info', 'CME', 'You have already entered the sample ' + $("#txtsample_" + rowid).val() + ' for visit order ' + $("#txtvisitorder_" + rowid).val() + ' for the sale product ' + $("#txtsale_" + a).val() + '.');
                                HideModalPopup("dvloading");
                                $("#txtvisitorder_" + rowid).focus();
                                flag = false;
                                return;
                            }
                            else {
                                uniqSampPrdVisitOrd.push($('select[name=txtsample_' + rowid + ']').val() + '_' + $("#txtvisitorder_" + rowid).val());
                            }

                            if ($("#txtQuantity_" + rowid).val() != "") {
                                if (parseInt($("#txtQuantity_" + rowid).val()) < 0) {
                                    fnMsgAlert('info', 'CME', 'Quantity cannot be a negative number.');
                                    HideModalPopup("dvloading");
                                    $("#txtQuantity_" + rowid).focus();
                                    flag = false;
                                    return;
                                }
                            } else if ($("#txtQuantity_" + rowid).val() == '') {
                                fnMsgAlert('info', 'CME', 'Please Enter Quantity.');
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
                                    fnMsgAlert('info', 'CME', 'Please select Due Date between Start Date and End Date');
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
                                    fnMsgAlert('info', 'CME', 'Please select Line Item Start Date between Campaign Start Date and Campaign End Date');
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
                                    fnMsgAlert('info', 'CME', 'Please select Line Item Due Date greater than Start Date');
                                    HideModalPopup("dvloading");
                                    flag = false;
                                    return;
                                }
                            }
                            if (parseInt($('#txtBudget_' + rowid).val()) == 0) {
                                fnMsgAlert('info', 'CME', 'Line Item cannot be Zero(0).Please Enter Other than Zero(0)');
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            } else if ($('#txtBudget_' + rowid).val() != "" && $('#txtBudget_' + rowid).val() != undefined && $('#txtBudget_' + rowid).val() != null) {
                                Line_Item_Budget_Array.push($('#txtBudget_' + rowid).val());
                            }
                        }
                        else if (InputType = "A") {
                            if (InputType == "A" && $('#txtactivity_' + rowid).val() == '') {
                                fnMsgAlert('info', 'CME', 'Please Enter Activity Name for the Selected Input');
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
                                if ($('#txtactivity_' + rowid).val() != undefined) {
                                    activitymandatory = activitymandatory + 1;
                                }
                                //var g = rowid.split('_');
                                //if ($("#txtsale_" + g[0] + "").val() != "") {
                                //    if ($('#txtactivity_' + rowid).val() == undefined) {
                                //        fnMsgAlert('info', 'CME', 'Please enter atleast one activity to save CME.');
                                //        HideModalPopup("dvloading");
                                //        flag = false;
                                //        return false;
                                //    }
                                //}

                            }
                            if ($('#hdnactivityval_' + rowid).val() == 0) {
                                var flexiactivity = $('#txtactivity_' + rowid).val();
                                uniqueflexiActivity.push(flexiactivity);
                            }


                            if ($.inArray($('#hdnactivityval_' + rowid).val(), uniqActivity) > -1) {
                                fnMsgAlert('info', 'CME', 'You have already entered the Activity ' + $('#txtactivity_' + rowid).val() + ' for visit order ' + $("#txtvisitorder_" + rowid).val() + ' for the sale product ' + $("#txtsale_" + a).val() + '.');
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
                            if (CMEDefinition.regExforAlphaNumericSpecificRemarks($("#txtsample_" + rowid).val()) == false) {
                                fnMsgAlert('info', 'CME', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the Activity.')
                                HideModalPopup("dvloading");
                                flag = false;
                                return;
                            }
                            var Due_Date = $('#txtDueDate_' + rowid).val();
                            if (Due_Date != '' && Due_Date != undefined) {
                                Due_Date = Due_Date.split('/')[2] + '/' + Due_Date.split('/')[1] + '/' + Due_Date.split('/')[0];
                                var duedate = new Date(Due_Date);
                                if ((duedate > endDate) || (duedate < startDate)) {
                                    fnMsgAlert('info', 'CME', 'Please select Due Date between Start Date and End Date');
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
                                    fnMsgAlert('info', 'CME', 'Please select Line Item Start Date between Campaign Start Date and Campaign End Date');
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
                                fnMsgAlert('info', 'CME', 'Line Item cannot be Zero(0).Please Enter Other than Zero(0)');
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
                            var result = CMEDefinition.fncheckIfArrayIsUnique(uniqueflexiActivity);
                            if (result == true) {
                                fnMsgAlert('info', 'CME', 'You have already entered the new Activity name twice.Please select different Activity from list');
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
        var activityvalue = "";
        var k = 0;
        for (var i = 0; i < $(".product").length; i++) {
            if ($("#txtsale_" + (i + 1) + "").val() != "") {
                for (var j = 0; j < $(".sample_" + (i + 1) + "").length ; j++) {
                    if ($("#inpttype_" + (i + 1) + "_" + (j + 1) + "").val() != "A" && $("#inpttype_" + (i + 1) + "_" + (j + 1) + "").val() != "PI") {
                        //k++;
                        //activityvalue = k;
                        fnMsgAlert('info', 'CME', 'Please enter atleast one activity for each product to save CME.');
                        HideModalPopup("dvloading");
                        flag = false;
                        return;
                    }
                }
            }
        }
        //if (activityvalue > $(".product").length) {
        //    fnMsgAlert('info', 'CME', 'Please enter atleast one activity for each product to save CME.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}
        //if (activitymandatory == $(".product").length) {
        //    fnMsgAlert('info', 'CME', 'Please enter atleast one activity for each product to save CME.');
        //    HideModalPopup("dvloading");
        //    flag = false;
        //    return;
        //}
        if (uniqueProd.length == 0) {
            fnMsgAlert('info', 'Marketing Campaign Definer', 'Please Enter Atleast one Sale Product To Save CME.');
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
    },
    fncheckIfArrayIsUnique: function (myArray) {
        for (var i = 0; i < myArray.length; i++) {
            for (var j = i + 1; j < myArray.length; j++) {
                if (myArray[i] == myArray[j]) {
                    return true; // means there are duplicate values
                }
            }
        }
        return false; // means there are no duplicate values.
    },
    fnValidateInputVO: function (Id, evt) {

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
    },
    fnValidateCustomerCount: function (Id, evt) {

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
    },
    fnValidateInputQty: function (Id, evt) {

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
    },
    fnValidateBudget: function (Id, evt) {
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
    },
    fnCancelCMEDefiner: function () {
        debugger;
        $('#campaignname').attr('disabled', false);
        $('#Startdate').attr('disabled', false);
        $('#EndDate').attr('disabled', false);
        $('#type').attr('disabled', false);
        $("#campaignname").val('');
        $("#Campaigndescription").val('');
        $("#Startdate").val('');
        $("#EndDate").val('');
        $("#Budget").val('');
        $('#freqSel').val('');
        $('input:radio[name=SelectionRadios][value=0]').attr('checked', true);
        $('input:radio[name=CampaignRadios][value=0]').attr('checked', true);
        $("#Count").val('');
        $("#Trackfrom").val('');
        $("#TrackTill").val('');
        $("#NoofMonth").val('');
        $('#type').val("");
        $("#category").empty();
        $("#category").html('<input type="hidden" id="hdnCategory" /><input type="text" class="form-control form-control-sm" id="txtCategory" onblur="CMEDefinition.fnValidateCategoryAutoFill(this);">');
        dropcategory = new ej.dropdowns.MultiSelect({
            dataSource: lstCategory,
            fields: { text: 'label', value: 'value' },
            placeholder: 'Select Category',
            mode: 'CheckBox',
            showSelectAll: true,
            showDropDownIcon: true,
            filterBarPlaceholder: 'Search Category',
            popupHeight: '350px',
            //filtering: function (e) {
            //    var dropdown_query = new ej.data.Query();
            //    dropdown_query = (e.text !== '') ? dropdown_query.where('Category_Name', 'contains', e.text, true) : dropdown_query;
            //    e.updateData(lstCategory, dropdown_query);
            //}
        });
        dropcategory.appendTo('#txtCategory');
        $("#speciality").empty();
        $("#speciality").html(' <input type="hidden" id="hdnSpeciality" /><input type="text" class="form-control form-control-sm" id="txtSpeciality" onblur="CMEDefinition.fnValidateSpecialityAutoFill(this);">');
        dropspeciality = new ej.dropdowns.MultiSelect({
            dataSource: lstSpeciality,
            fields: { text: 'label', value: 'value' },
            placeholder: 'Select Speciality',
            mode: 'CheckBox',
            showSelectAll: true,
            showDropDownIcon: true,
            filterBarPlaceholder: 'Search Speciality',
            popupHeight: '350px',
            //filtering: function (e) {
            //    var dropdown_query = new ej.data.Query();
            //    dropdown_query = (e.text !== '') ? dropdown_query.where('Speciality_Name', 'contains', e.text, true) : dropdown_query;
            //    e.updateData(lstSpeciality, dropdown_query);
            //}
        });
        dropspeciality.appendTo('#txtSpeciality');
        // CMEDefinition.fnGetUnderRegions();
        $("#DrivenRegion").empty();
        $("#DrivenRegion").html('<input type="hidden" id="hdnDriven" /><input type="text" class="form-control form-control-sm" id="txtDriven" onblur="CMEDefinition.fnValidateDesignationsAutoFill(this);">');
        dropdesignation = new ej.dropdowns.MultiSelect({
            //set the data to dataSource property
            dataSource: lstDesignations,
            fields: { text: 'label', value: 'value' },
            placeholder: 'Select a Designation',
            mode: 'CheckBox',
            showSelectAll: true,
            showDropDownIcon: true,
            //filtering: function (e) {
            //    var dropdown_query = new ej.data.Query();
            //    dropdown_query = (e.text !== '') ? dropdown_query.where('Region_Name', 'contains', e.text, true) : dropdown_query;
            //    e.updateData(lstDesignations, dropdown_query);
            //}
        });
        dropdesignation.appendTo('#txtDriven');
        $(".bindproducts").html('');
        fnUnSelectAll()
        CMEDefinition.fnCreateProductTable("LOAD");
        fnGetRegionTreeByRegionWithCheckBoxMC(currentRegionCode_g, "treebody", "", 'No', 'LOAD');
    },
    fnValidateInputROI: function (Id, evt) {
        debugger;
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
    },
    fnGetCMESummary: function () {
        debugger;
        var startDate = new Date($("#CMEStartDate").val());
        var endDate = new Date($("#CMEEndDate").val());
        if (startDate > endDate) {
            swal({
                icon: "info",
                title: "Info",
                text: 'Start date should be greater than End date.',
                button: "Ok",
            });
            return false;
        }
        Method_params = ["CMEApi/GetCMEDetails", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.RegionCode, $("#CMEStartDate").val(), $("#CMEEndDate").val()];
        CoreREST.get(null, Method_params, null, CMEDefinition.fnSummarySuccessCallback, CMEDefinition.fnSummaryFailureCallback);
    },
    fnSummarySuccessCallback: function (response) {
        debugger;
        var response = response;
        $('#Summary').html('');
        var grid = new ej.grids.Grid({
            dataSource: response.list,
            toolbar: ['Search'],
            showColumnChooser: true,
            allowTextWrap: true,
            allowResizing: true,
            //allowFiltering: true,
            allowSorting: true,
            allowPaging: true,
            allowGrouping: true,
            allowScrolling: true,
            pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
            height: 400,
            columns: [
                { headerText: 'Action', width: 100, textAlign: 'center' },
                { headerText: 'Change Status', width: 150, textAlign: 'center' },
                { headerText: 'View Details', width: 150, textAlign: 'center' },
                { field: 'Campaign_Name', headerText: 'Campaign Name', textAlign: 'center' },
                { field: 'Start_Date', width: 150, headerText: 'Start Date', format: 'yMd', textAlign: 'center' },
                { field: 'End_Date', width: 150, headerText: 'End Date', format: 'yMd', textAlign: 'center' },
                { field: 'CME_Type', width: 150, headerText: 'CME Type', textAlign: 'center' },
                { field: 'No_Of_Month', width: 150, headerText: 'No OF Months Tracked', textAlign: 'center' },
              //  { field: 'Customer_Count', headerText: 'Customer Count', textAlign: 'center' },
                { field: 'Campaign_Current_Status', headerText: 'Status', textAlign: 'center' },

            ],
            queryCellInfo: CMEDefinition.fnQueryCellInfo,
        });
        grid.appendTo('#Summary');
    },
    fnSummaryFailureCallback: function () {

    },
    fnQueryCellInfo: function (args) {
        debugger;
        if (args.column.headerText == 'Action') {
            if (args.data.Campaign_Current_Status == 'Approved') {
                args.cell.innerHTML = "<a herf=# style='cursor:pointer;color:blue;' onclick='CMEDefinition.fnEdit(\"" + args.data.Campaign_Code + "\");'>Edit</a>";
            }
            else {
                args.cell.innerHTML = "<a>Edit</a>";
            }
        }
        if (args.column.headerText == "View Details") {
            args.cell.innerHTML = "<a herf=# style='cursor:pointer;color:blue;' onclick='CMEDefinition.fnGetCMEDetails(\"" + args.data.Campaign_Code + "\");'>View Details</a>";
        }
        //if (args.column.headerText == 'Status') {
        //    var recordStatus = args.data.Record_Status;
        //    //var colorCode = SM.fnGetColorName(recordStatus)
        //    //args.cell.style.backgroundColor = colorCode;
        //    if (args.data.Record_Status == 2 || args.data.Record_Status == 1) {
        //        args.cell.innerHTML = "Approved";
        //    }
        //}
        if (args.column.headerText == "Change Status") {
            args.cell.innerHTML = "<a herf=# style='cursor:pointer;color:blue;' onclick='CMEDefinition.fnChangeStatus(\"" + args.data.Campaign_Code + "\");'>Change Status</a>";
        }
    },
    fnGetCMEDetails: function (CampaignCode) {
        debugger;
        Campaign_Code = CampaignCode;
        Method_params = ["CMEApi/GetCampaignSummaryDetails", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.RegionCode, CampaignCode];
        CoreREST.get(null, Method_params, null, CMEDefinition.fnCampaignDetailSuccessCallback, CMEDefinition.fnCampaignDetailFailureCallback);
    },
    fnCampaignDetailSuccessCallback: function (response) {
        debugger;
        $('#MCName').html(response.list.lstCampaigndetails[0].Campaign_Name);
        $('#MCDescrp').html(response.list.lstCampaigndetails[0].Campaign_Description);
        var Budget = response.list.lstCampaigndetails[0].Campaign_Budget == 0 ? '' : response.list.lstCampaigndetails[0].Campaign_Budget;
        $('#BudgetofCamppop').html(Budget);
        var DcCat = "";
        var spCat = "";
        var regiontypes = '';
        var CatgSno = 0;
        //var disjsonCatCode = jsonPath(resp.lstDocCateg, "$.[?(@.Campaign_Code=='" + campaignCode + "')]");
        for (var i = 0; i < response.list.lstCategoryDetails.length; i++) {
            CatgSno++;
            DcCat += '<tr>';
            DcCat += '<td style="min-width:100px">' + CatgSno + '</td>';
            DcCat += '<td style="min-width:168px;">' + response.list.lstCategoryDetails[i].Category_Name + '</td>';
            DcCat += '</tr>';
            //if (i < disjsonCatCode.length - 1) {
            //    DcCat += ',';
            //}
        }
        $('#MCCatCode').html(DcCat);
        var SpecSno = 0;
        for (var i = 0; i < response.list.lstSpecialityDetails.length; i++) {
            SpecSno++;
            spCat += '<tr>';
            spCat += '<td style="min-width:100px">' + SpecSno + '</td>';
            spCat += '<td style="min-width:168px;">' + response.list.lstSpecialityDetails[i].Speciality_Name + '</td>';
            spCat += '</tr>';
        }
        $('#MCSpecCode').html(spCat);
        var regSno = 0;
        for (var i = 0; i < response.list.lstdesignationdetails.length; i++) {
            regSno++;
            regiontypes += '<tr>';
            regiontypes += '<td style="min-width:100px">' + regSno + '</td>';
            regiontypes += '<td style="min-width:168px;">' + response.list.lstdesignationdetails[i].Region_Type_Name + '</td>';
            regiontypes += '</tr>';
        }
        $('#MCRegType').html(regiontypes);

        var parregSno = 0;
        var ParRegions = '';
        for (var i = 0; i < response.list.lstregiondetails.length; i++) {
            parregSno++;
            ParRegions += '<tr>';
            ParRegions += '<td style="min-width:100px">' + parregSno + '</td>';
            ParRegions += '<td style="min-width:168px;">' + response.list.lstregiondetails[i].Region_Name + '</td>';
            ParRegions += '</tr>';
        }
        $('#MCParReg').html(ParRegions);

        var jProd = response.list.lstProductDetails
        if (jProd != "" && jProd != null && jProd.length > 0) {
            var saleProdArr = [];
            $.each(jProd, function () {
                if ($.inArray(this.Product_Code, saleProdArr) === -1) {
                    saleProdArr.push(this.Product_Code);
                }
            });
            var table = '';
            for (var i = 0; i < saleProdArr.length; i++) {
                var Product = $.grep(jProd, function (v) {
                    return v.Product_Code == saleProdArr[i];
                });
                table += ' <div class="form-group row"><label class="col-sm-3 col-form-label">Target Product/Brand(Activity):</label><label class="col-sm-3 col-form-label">' + Product[0].Product_Name + '</label>';
                var expectedSales = Product[0].ROI == 0 ? '-' : Product[0].ROI;
                table += '<label class="col-sm-3 col-form-label">Expected Sale Increase:</label><label class="col-sm-3 col-form-label">' + expectedSales + '</label> </div>';
                table += '<table class="table table-bordered" id="tblProdPopup" cellspacing="0" cellpadding="0" style="text-align:center;">';
                table += '<thead style="text-align:center;">';
                table += '<tr>';
                table += '<th>Input Type</th>';
                table += '<th style="width:40%  !important;">Sample Products/Activity</th>';
                table += '<th>Visit Order</th>';
                table += '<th>Quantity</th>';
                table += '<th>Start Date</th>';
                table += '<th>Due Date</th>';
                table += '<th>Budget Of Item</th>';
                table += '</tr>';
                table += '</thead>';
                table += '<tbody>';
                for (var m = 0; m < Product.length; m++) {

                    table += '<tr>';
                    if (Product[m].Input_Type == 'A') {
                        var activityName = Product[m].Activity_Name == null ? '-' : Product[m].Activity_Name;
                        table += '<td>Activity</td>';
                        table += '<td>' + activityName + '</td>';
                    }
                    else {
                        var sampleName = Product[m].Sample_Name == null ? '-' : Product[m].Sample_Name;
                        table += '<td>Promotional</td>';
                        table += '<td>' + sampleName + '</td>';
                    }
                    var Visit_Order = Product[m].Visit_Order == 0 ? "-" : Product[m].Visit_Order;
                    var Quality = Product[m].Quantity == 0 ? "-" : Product[m].Quantity;
                    var Start_Date = Product[m].Start_Date == null ? "-" : Product[m].Start_Date;
                    var Due_Date = Product[m].Due_Date == null ? "-" : Product[m].Due_Date;
                    var Line_Item_Budget = Product[m].Line_Item_Budget == 0 ? "-" : Product[m].Line_Item_Budget;
                    table += '<td>' + Visit_Order + '</td>';
                    table += '<td>' + Quality + '</td>';
                    table += '<td>' + Start_Date + '</td>';
                    table += '<td>' + Due_Date + '</td>';
                    table += '<td>' + Line_Item_Budget + '</td>';
                    table += '</tr>';
                }
                table += '</tbody>';
                table += '</table>';
            }

        }
        $('#divMCProdDetail').html(table);

        $('#myModal').modal('show');
    },
    fnEdit: function (CampaignCode) {
        debugger;
        Campaign_Code = CampaignCode;
        $("#CMEDefiner").show();
        $("#CMESummary").hide();
        $('.def').addClass('active');
        $('.sum').removeClass('active');
        Method_params = ["CMEApi/GetCampaignSummaryDetails", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.RegionCode, CampaignCode];
        CoreREST.get(null, Method_params, null, CMEDefinition.fnCampaignSummarySuccessCallback, CMEDefinition.fnCampaignSummaryFailureCallback);

    },

    fnCampaignSummarySuccessCallback: function (response) {
        debugger;
        $('#campaignname').attr('disabled', true);
        $('#Startdate').attr('disabled', true);
        $('#EndDate').attr('disabled', true);
        $('#type').attr('disabled', true);
        $("#campaignname").val(response.list.lstCampaigndetails[0].Campaign_Name);
        $("#Campaigndescription").val(response.list.lstCampaigndetails[0].Campaign_Description);
        $("#Startdate").val(response.list.lstCampaigndetails[0].Start_Date);
        $("#EndDate").val(response.list.lstCampaigndetails[0].End_Date);
        //    $("#Budget").val(response.list.lstCampaigndetails[0].Campaign_Budget);
        //    $('#freqSel').val(response.list.lstCampaigndetails[0].Campaign_Frequency);
        $('input:radio[name=SelectionRadios][value=' + response.list.lstCampaigndetails[0].Doctor_Product_Mapping_Validation + ']').attr('checked', true);
        $('input:radio[name=CampaignRadios][value=' + response.list.lstCampaigndetails[0].Campaign_Based_On + ']').attr('checked', true);
        // $('input:radio[name=CampaignRadios]:checked').val(response.list.lstCampaigndetails[0].Campaign_Based_On);
        //('input:radio[name=SelectionRadios]:checked').val(response.list.lstCampaigndetails[0].Doctor_Product_Mapping_Validation);
        $("#Count").val(response.list.lstCampaigndetails[0].Customer_Count);
        $("#Trackfrom").val(response.list.lstCampaigndetails[0].Track_Till);
        $("#TrackTill").val(response.list.lstCampaigndetails[0].Track_From);
        $("#NoofMonth").val(response.list.lstCampaigndetails[0].No_Of_Month);
        $("#type").val(response.list.lstCampaigndetails[0].CME_Type);
        // CMEDefinition.fnGetDoctorCategory();
        var arr = [];
        for (var i = 0; i < response.list.lstCategoryDetails.length; i++) {
            arr.push(response.list.lstCategoryDetails[i].Customer_Category_Code);
        }
        var msObject = document.getElementById("txtCategory").ej2_instances[0];
        var str_array = arr;
        msObject.value = str_array;
        dropcategory.enabled = false;
        // CMEDefinition.fnGetSpeciality();
        var specialityarr = [];
        for (var i = 0; i < response.list.lstSpecialityDetails.length; i++) {
            specialityarr.push(response.list.lstSpecialityDetails[i].Customer_Speciality_Code);
        }
        var Speciality = document.getElementById("txtSpeciality").ej2_instances[0];
        var str_specialityarray = specialityarr;
        Speciality.value = str_specialityarray;
        dropspeciality.enabled = false;
        //CMEDefinition.fnGetUnderRegions();
        var Regionarr = [];
        for (var i = 0; i < response.list.lstdesignationdetails.length; i++) {
            Regionarr.push(response.list.lstdesignationdetails[i].Region_Type_Code);
        }
        var Underregions = document.getElementById("txtDriven").ej2_instances[0];
        var str_Regionarray = Regionarr;
        Underregions.value = str_Regionarray;
        dropdesignation.enabled = false;
        //CMEDefinition.fnGetDesignations();
        var Designationarr = [];
        for (var i = 0; i < response.list.lstregiondetails.length; i++) {
            var obj = {
                Region_Code: response.list.lstregiondetails[i].Participating_Region_Code,
                Region_Name: response.list.lstregiondetails[i].Region_Name,
            }
            Designationarr.push(obj)
        }
        fnRegionBindTreeAlreadySelected(Designationarr)
        var EditStatus = 'Approved';
        var jProd = response.list.lstProductDetails
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
                    CMEDefinition.fnCreateProductTable("LOAD");
                    rowidx++;
                }
                else {

                    var objProd = [];
                    objProd.id = "_" + rowidx;
                    CMEDefinition.fnCreateProductTable(objProd);

                    rowidx++;


                }
                if (pd < saleProdArr.length) {
                    //debugger;
                    var sampleJson = jsonPath(jProd, "$.[?(@.Product_Code=='" + saleProdArr[pd] + "')]");
                    $("#txtsale_" + rowidx).val(sampleJson[0].Product_Name);
                    $("#hdnsale_" + rowidx).val(sampleJson[0].Product_Code);
                    //$("#txtsale_" + rowidx).val(sampleJson[0].Product_Name);
                    ////$("#hdnsale_" + rowidx).val(sampleJson[0].Product_Code);
                    //var dd = document.getElementById('txtsale_' + rowidx + '').ej2_instances[0];
                    //dd.value = sampleJson[0].Product_Code;

                    // $('select[name=txtsale_' + rowidx + ']').val(sampleJson[0].Product_Code);
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
                        CMEDefinition.fnShowInputsOnselect(sampleJson[sam].Input_Type, objsamProd);
                        if (sampleJson.length > 1) {
                            if (sampleJson[sam].Input_Type != null) {
                                CMEDefinition.fnCreateSampleProductNewRow(ObjSamProd);
                            }
                        } else if (sampleJson.length == 1) {
                            if (sampleJson[sam].Input_Type != null) {
                                CMEDefinition.fnCreateSampleProductNewRow(ObjSamProd);
                            }
                        }


                        if (sam < sampleJson.length) {
                            if (sampleJson[sam].Input_Type == "PI") {
                                $("#inpttype_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Input_Type);
                                $("#txtsample_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Sample_Name);
                                $("#hdnsample_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Sample_Code);
                                //var sample = document.getElementById("txtsample_" + (pd + 1) + "_" + subrowidx).ej2_instances[0];
                                //sample.value = ssampleJson[sam].Sample_Code;
                                // $('select[name=txtsample_' + subrowidx + ']').val(sampleJson[sam].Sample_Code)
                                // $("#hdnsample_" + (pd + 1) + "_" + subrowidx).val(sampleJson[sam].Sample_Code);
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
            }
        }
        else {
            CMEDefinition.fnCreateProductTable("LOAD");
        }

    },
    fnChangeStatus: function (CampaignCode) {
        swal({
            text: "Are you Sure? Do you want to change the status of the CME",
            buttons: true,
            dangerMode: true,
        })
.then((willDelete) => {
    if (willDelete) {
        Method_params = ["CMEApi/UpdateCMEStatus", CMEDefinition.defaults.CompanyCode, CampaignCode];
        CoreREST.post(null, Method_params, null, CMEDefinition.fnStatusChangeSuccessCallback, CMEDefinition.fnStatusChangeFailureCallback);
    }
});
    },
    fnStatusChangeSuccessCallback: function (response) {
        if (response == 1) {
            swal({
                title: "Success",
                text: 'CME status changed sucessfully.',
            });
            CMEDefinition.fnGetCMESummary();
        }
        else {
            fnMsgAlert('error', 'CME', 'Error while saving the CME.');
        }
    },
    fnStatusChangeFailureCallback: function (response) {

    },
    fngetdivisions: function () {
        debugger;
        Method_params = ["CMEApi/GetDivisionDetails", CMEDefinition.defaults.CompanyCode, CMEDefinition.defaults.UserCode, CMEDefinition.defaults.RegionCode];
        CoreREST.get(null, Method_params, null, CMEDefinition.fngetdivisionsSuccessCallback, CMEDefinition.fngetdivisionsFailureCallback);

    },
    fngetdivisionsSuccessCallback: function (response) {
        debugger;
        var data1 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].Division_Code),
                        name: $.trim(response.list[i].Division_Name)
                    };
                    data1.push(_obj);
                }
            }
            Division_g = data1;

            $('#dvdivision').empty();
            $('#dvdivision').html('<input type="text" id="division" name="division" class="form-control" maxlength="" />');
            var division = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Division',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'CheckBox',
                showSelectAll: true,
                showDropDownIcon: true,
                change: CMEDefinition.fngetdata

            });
            division.appendTo('#division');
        } else {
            $('#dvdivision').empty();
            $('#dvdivision').html('<input type="text" id="division" name="division" class="form-control" maxlength="" />');
            var division = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Division',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'CheckBox',
                showSelectAll: true,
                showDropDownIcon: true,
                change: CMEDefinition.fngetdata
            });
            division.appendTo('#division');
        }
        CMEDefinition.fnGetRegionDetails();
    },
    fngetdivisionsFailureCallback: function () {

    },
}



