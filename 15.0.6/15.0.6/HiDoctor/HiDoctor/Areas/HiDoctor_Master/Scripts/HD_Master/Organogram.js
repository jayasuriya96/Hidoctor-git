
/*
* Created By Rajeswari R
* Organogram.js
*/

/*
* Global Variable
*/

var RegionMasterDetails_g = "";
var user_g = "";
var childRegions_g = "";
var ExpenseGroupMapping = "Expense Group";
var searchManager = "";
/*
* Get the depending master data for region master and bind all the drop down values
*/
function fnGetData() {
    $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Organogram/GetRegionMasterDetails',
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            RegionMasterDetails_g = jsData;
            var regionType = $("#cboRegionTypeCode");
            var underRegion = $("#cboUnderRegionCode");
            var regionClassification = $("#cboRegionClassification");
            var expenseGroup = $("#cboExpenseGroup");
            $('option', underRegion).remove();
            underRegion.append("<option value=0>-Under Region-</option>");
            if (jsData.Tables[0].Rows.length > 0) {
                for (var c = 0; c < jsData.Tables[1].Rows.length; c++) {
                    // if (curRegionCode != jsData.Tables[1].Rows[c].Region_Code) {
                    underRegion.append("<option value=" + jsData.Tables[1].Rows[c].Region_Code + ">" + jsData.Tables[1].Rows[c].Region_Name + "</option>");
                    //}
                }
            }
            $("#cboUnderRegionCode").attr('selectedIndex', 0)

            $('option', regionType).remove();
            regionType.append("<option value=0>-Region Type-</option>");
            if (jsData.Tables[0].Rows.length > 0) {
                for (var b = 0; b < jsData.Tables[0].Rows.length; b++) {
                    regionType.append("<option value=" + jsData.Tables[0].Rows[b].Region_Type_Code + ">" + jsData.Tables[0].Rows[b].Region_Type_Name + "</option>");
                }
            }
            $("#cboRegionTypeCode").attr('selectedIndex', 0)

            $('option', regionClassification).remove();
            regionClassification.append("<option value=0>-Region Classification-</option>");
            if (jsData.Tables[2].Rows.length > 0) {
                for (var a = 0; a < jsData.Tables[2].Rows.length; a++) {
                    regionClassification.append("<option value=" + jsData.Tables[2].Rows[a].Region_Classification_Code + ">" + jsData.Tables[2].Rows[a].Region_Classification_Name + "</option>");
                }
            }
            $("#cboRegionClassification").attr('selectedIndex', 0)

            $('option', expenseGroup).remove();
            expenseGroup.append("<option value=0>-Expense Group-</option>");
            if (jsData.Tables[3].Rows.length > 0) {
                for (var z = 0; z < jsData.Tables[3].Rows.length; z++) {
                    expenseGroup.append("<option value=" + jsData.Tables[3].Rows[z].Expense_Group_Id + ">" + jsData.Tables[3].Rows[z].Expense_Group_Name + "</option>");
                }
            }
            $("#cboExpenseGroup").attr('selectedIndex', 0)
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

/*
* Insert region master
*/
function fnRegionSubmit() {
    debugger;
    $('#btnSave').hide();
    $('#btnSave1').hide();
    var result = fnValidateRegionInsertion();
    if (result == true) {
        $('#btnSave').hide();
        $('#btnSave1').hide();
    }
    else {
        $('#btnSave').show();
        $('#btnSave1').show();
    }
    if (result) {
        var regionName = $("#Region_Name").val().replace(/\s{2,}/g, ' ');
        //regionName.replace(/\s{2,}/g, ' ')
        $("#dvAjaxLoad").show();
        $.blockUI();
        $.ajax({
            url: '../HiDoctor_Master/Organogram/Create/',
            type: "POST",
            data: $("form").serialize() + "&RegionTypeCode=" + $("#cboRegionTypeCode").val() + "&UnderRegionCode=" + $("#cboUnderRegionCode").val()
                + "&RegionClassification=" + $("#cboRegionClassification").val() + "&ExpenseGroupId=" + $("#cboExpenseGroup").val() + "&RegionStatus=1&RegionCode="
                + $("#hdnRegionCode").val() + "&RegionName=" + regionName + "&Country=" + $('#txtCountry').val() + "&State="
                + $('#txtState').val() + "&City=" + $('#txtCity').val() + "&LocalArea=" + $('#txtLocalArea').val() + "&Lat="
                + $('#hdnLatVal').val() + "&Long=" + $('#hdnLngVal').val() + "",
            success: function (data) {
                $("#dvAjaxLoad").hide();
                if (data.split(':')[0] == 'SUCCESS') {
                    if ($("#hdnRegionCode").val() != '') {
                        $("#dvAddRegion").overlay().close();
                        fnMsgAlert('success', 'Success', "" + data.split(':')[1] + " region updated successfully");
                        $("#dvRegionInfo").show();
                        $("#dvRegionInfo").html(" --> Click refresh button to see your changes");
                        $('.blink').blink();
                        fnUpdateRegFullIndex();
                        fnGetData();
                        fnGetMasterDataForUser();
                        $('#btnSave').show();
                        $('#btnSave1').show();
                    }
                    else {
                        $("#dvAddRegion").overlay().close();
                        fnMsgAlert('success', 'Success', "" + data.split(':')[1] + " region inserted successfully");
                        fnBindRegionTree("dvRegionTree");
                        fnGetData();
                        // fnGetMasterDataForUserAdd();
                        fnGetMasterDataForUser();
                        $('#btnSave').show();
                        $('#btnSave1').show();
                    }

                }
                else {
                    $("#dvAjaxLoad").hide();
                    fnMsgAlert('error', 'Error', "" + data.split(':')[1] + " region inserted failed");
                    $('#btnSave').show();
                    $('#btnSave1').show();
                }
                $.unblockUI();
            },
            error: function () {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
            },
            complete: function () {
                $.unblockUI();
            }
        });
    }
}


/*
* Region Tree on double click
*/
function fnRegionTreeNodeClick(node) {
    debugger;
    fnRegionClearAll();
    var regionName = node.data.title;
    var regionCode = node.data.key;
    $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({

        url: '../HiDoctor_Master/Organogram/GetRegionDetails/',
        type: "POST",
        data: "RegionCode=" + regionCode + "",
        success: function (jsData) {
            $("#dvAjaxLoad").hide();
            jsData = eval('(' + jsData + ')');
            if (jsData.Tables[0].Rows.length > 0) {
                $("#Region_Name").val(regionName.split('(')[0]);
                $("#Region_Name").blur(function () { fnValidateRegionName() });
                $("#hdnRegionCode").val(regionCode);
                var regionTypeCode = jsData.Tables[0].Rows[0].Region_Type_Code;
                var underRegionCode = jsData.Tables[0].Rows[0].Under_Region_Code;
                var regionClassificationCode = jsData.Tables[0].Rows[0].Region_Classification_Code;
                var expenseGroupCode = jsData.Tables[0].Rows[0].Expense_Group_Id;
                if (underRegionCode == null || underRegionCode == '') {
                    $("#cboUnderRegionCode").val(0);
                }
                else {
                    $("#cboUnderRegionCode").val(underRegionCode);
                }
                if (regionTypeCode == null || regionTypeCode == '') {
                    $("#cboRegionTypeCode").val('0');
                }
                else {
                    $("#cboRegionTypeCode").val(regionTypeCode);
                }
                if (regionClassificationCode == null || regionClassificationCode == '') {
                    $("#cboRegionClassification").val('0');
                }
                else {
                    $("#cboRegionClassification").val(regionClassificationCode);
                }
                if (expenseGroupCode == null || expenseGroupCode == '') {
                    $("#cboExpenseGroup").val('0');
                }
                else {
                    $("#cboExpenseGroup").val(expenseGroupCode);
                }
                $('#txtCountry').val(jsData.Tables[0].Rows[0].Region_Country);
                $('#txtState').val(jsData.Tables[0].Rows[0].Region_State);
                $('#txtCity').val(jsData.Tables[0].Rows[0].Region_City);
                $('#txtLocalArea').val(jsData.Tables[0].Rows[0].Region_Local_Area);
                if (jsData.Tables[0].Rows[0].Region_Latitude != null && jsData.Tables[0].Rows[0].Region_Latitude != undefined &&
                    jsData.Tables[0].Rows[0].Region_Latitude != '') {
                    $('#hdnLatVal').val(jsData.Tables[0].Rows[0].Region_Latitude);
                }
                else {
                    $('#hdnLatVal').val('0');
                }
                if (jsData.Tables[0].Rows[0].Region_Longitude != null && jsData.Tables[0].Rows[0].Region_Longitude != undefined &&
                  jsData.Tables[0].Rows[0].Region_Longitude != '') {
                    $('#hdnLngVal').val(jsData.Tables[0].Rows[0].Region_Longitude);
                }
                else {
                    $('#hdnLngVal').val('0');
                }
                if (currMap.toUpperCase() == 'GOOGLE') {
                    var obj = new google.maps.LatLng(parseFloat($('#hdnLatVal').val()), parseFloat($('#hdnLngVal').val()));
                    getAddress(obj);
                }
                if (currMap.toUpperCase() == 'BING') {
                    getBingAddress(parseFloat($('#hdnLatVal').val()), parseFloat($('#hdnLngVal').val()));
                }

            }
            $.unblockUI();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        complete: function () {
            $("#dvAddRegion").overlay().load();
            $.unblockUI();
        }
    });
}

/*
* clear region master pop up values
*/
function fnRegionClearAll() {

    $("#cboUnderRegionCode").val("0");
    $("#cboRegionTypeCode").val("0");
    $("#cboRegionClassification").val("0");
    $("#cboExpenseGroup").val("0");
    $("#Region_Name").val("");
    $("#hdnRegionCode").val("");
    $('#txtCountry').val('');
    $('#txtState').val('');
    $('#txtCity').val('');
    $('#txtLocalArea').val('');
    $('#hdnLatVal').val('0');
    $('#hdnLngVal').val('0');
    $('#txtMap').val('');
    //google.maps.event.trigger(map, 'resize');
    //map.setZoom(map.getZoom());
}

/*
* Open popup while click the add region button
*/
function fnAddRegion() {
    debugger;

    var Region_Master = 'Hidoctor_Master/RegionCreation/RegionCreation';
    var regionmaster = false;
    for (var i = 0; i < menuContent_g.Tables[0].Rows.length; i++) {
        if (menuContent_g.Tables[0].Rows[i].Menu_URL != null) {
            if (menuContent_g.Tables[0].Rows[i].Menu_URL.toUpperCase().replace(/[^A-Z0-9]/ig, ' ') == Region_Master.toUpperCase().replace(/[^A-Z0-9]/ig, ' ')) {
                regionmaster = true;
            }
        }
    }

    if (regionmaster == true) {
        $('#main').load('HiDoctor_Master/RegionCreation/RegionCreationWizard');
    } else {
        fnMsgAlert('info', 'Info', "Sorry you dont have access to create a region. Please contact admin for region creation");
    }
   
    //fnRegionClearAll();
    //$("#hdnRegionCode").val("");
    //$("#dvAddRegion").overlay().load();
    // ShowModalPopup("dvAddRegion");
    // initialize();
    // initialize();
}

/*
* Open popup while click the add user button
*/
function fnAddUser() {
    //$("#User_Name").attr("disabled", false);
    //$("#cboEmployee").attr("disabled", false);
    //fnUserClearAll();
    //$("#hdnUserCode").val("");
    //$("#dvAddUser").overlay().load();
    var User_Master = 'HiDoctor_Master/UsercreationWizard/Home';
    var usermaster = false;
    for (var i = 0; i < menuContent_g.Tables[0].Rows.length; i++) {
        if (menuContent_g.Tables[0].Rows[i].Menu_URL != null) {
            if (menuContent_g.Tables[0].Rows[i].Menu_URL.toUpperCase().replace(/[^A-Z0-9]/ig, ' ') == User_Master.toUpperCase().replace(/[^A-Z0-9]/ig, ' ')) {
                usermaster = true;
            }
        }
    }

    if (usermaster == true) {
        $('#main').load('HiDoctor_Master/UsercreationWizard/CreateUserWizard?id=0');
    } else {
        fnMsgAlert('info', 'Info', "Sorry you dont have access to create a user. Please contact admin for user creation");
    }

}


/*
* User tree on double click
*/
function fnUserTreeNodeDblClick(node) {
    var UserName = node.data.title;
    var UserCode = node.data.key;
    $("#dvEditUser").overlay().load();
}

function fnRegionTreeDragStart(node) {
}

/*
* Region tree drag and drop event
*/
function fnRegionTreeDrop(node, sourceNode, hitMode, ui, draggable) {
    $.msgAlert({
        type: 'warning'
	    , title: 'Delete'
	    , text: 'Do you want to change the hierarchy'
        , callback: function () {
            fnChangeRegSeqInd(node.data.key, sourceNode.data.key, hitMode)
        }
    });

}
/*
* User tree drag and drop event
*/
function fnUserTreeDrop(node, sourceNode, hitMode, ui, draggable) {
    $.msgAlert({
        type: 'warning'
	    , title: 'Delete'
	    , text: 'Do you want to change the hierarchy'
        , callback: function () {
            $("#dvAjaxLoad").show();
            $.blockUI();
            $.ajax({
                url: '../HiDoctor_Master/Organogram/UpdateUserSeq/',
                type: "POST",
                data: "Node=" + node.data.key + "&SourceNode=" + sourceNode.data.key + "&HitMode=" + hitMode + "",
                success: function (jsData) {
                    $("#dvAjaxLoad").hide();
                    if (jsData.split(':')[0] == "SUCCESS") {
                        fnMsgAlert('success', 'Success', "User hierarchy changed");
                        $('#dvUserInfo').show();
                        $("#dvUserInfo").html(" --> Click refresh button to see your changes");
                        $('.blink').blink();
                    }
                    else {
                        fnMsgAlert('info', 'Information', "User hierarchy changes failed");
                    }
                    $.unblockUI();
                },
                error: function () {
                    $("#dvAjaxLoad").hide();
                    $.unblockUI();
                },
                complete: function () {
                    $.unblockUI();
                }
            });
        }
    });

}

function fnClose(obj) {
    $("#dvAjaxLoad").hide();
    fnRegionClearAll();
    $(obj).overlay().close();
}

/*
* Region hierarchy change using drag and drop function
*/
function fnChangeRegSeqInd(node, sourceNode, hitMode) {
    $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Master/Organogram/UpdateRegionSeq/',
        type: "POST",
        data: $("form").serialize() + "&Node=" + node + "&SourceNode=" + sourceNode + "&HitMode=" + hitMode + "",
        success: function (jsData) {
            $("#dvAjaxLoad").hide();
            if (jsData.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', "Region hierarchy changed");
                $("#dvRegionInfo").show();
                $("#dvRegionInfo").html(" --> Click refresh button to see your changes");
                $('.blink').blink();

            }
            else {
                fnMsgAlert('info', 'Information', "Region hierarchy changes failed");
            }
            $.unblockUI();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        complete: function () {
            $.unblockUI();
        }
    });
}


/*
* Update region full index column while click the refresh button
*/
fnUpdateRegFullIndex = function() {
    $.blockUI();
    // $("#dvAjaxLoad").show();
    //UpdateRegionFullIndex
    $.ajax({
        url: '../HiDoctor_Master/Region/UpdateRegionFullIndex/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            //$("#dvAjaxLoad").hide();
            if (jsData.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', "Region tree refreshed");
                //$("#dvXMLInfo").html('Region tree is refreshed');
                //$("#dvRegionInfo").html("");
                //$('.blink').blink();
                //$("#dvRegionXml").overlay().load();
                $("#dvRegionInfo").hide();
            }
            else {
                fnMsgAlert('info', 'Information', "Region tree refresh failed");
            }
            fnBindRegionTree("dvRegionTree");
            //$.unblockUI();
        },
        error: function () {
            // $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

function fnUpdateRegionIndex() {
    // $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        type: 'POST',//UpdateUserNewIndex
        url: '../HiDoctor_Master/Region/UpdateRegionNewIndex',
        data: "A",
        success: function (result) {
            if (result != '') {
                if (result.split(':')[0] == "SUCCESS") {
                    fnMsgAlert('success', 'Success', 'Region tree refreshed successfully.');
                }
                else {
                    fnMsgAlert('error', 'error', 'Region tree refresh failed.');
                    console.log(result.split(':')[1]);
                }
            }
            else {
                fnMsgAlert('error', 'error', 'Region tree refresh failed.');
                console.log(result.split(':')[1]);
            }
            fnBindRegionTree("dvRegionTree");
        },
        error: function (err) {
            console.log(err);
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

/*
* Update region full index column while click the refresh button
*/

function fnUpdateUserFullIndex() {
    debugger;
    $.blockUI();
    // $("#dvAjaxLoad").show();
    $.ajax({
        url: '../HiDoctor_Master/User/UpdateUserFullIndex/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            // $("#dvAjaxLoad").hide();
            if (jsData.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', "User tree refreshed");
                //$("#dvXMLInfo").html('User tree is refreshed');
                //$("#dvUserInfo").html("");
                //$('.blink').blink();
                //$("#dvRegionXml").overlay().load();
            }
            else {
                fnMsgAlert('info', 'Information', "User tree refresh failed");
            }
            fnBindUserTree("dvUserTree");
            //$.unblockUI();
        },
        error: function () {
            // $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        complete: function () {
            $.unblockUI();
        }
    });
}


function fnUpdateUserFullIndexNew() {
    debugger;
    $.blockUI();
    // $("#dvAjaxLoad").show();
    $.ajax({
        url: '../HiDoctor_Master/User/UpdateUserFullIndexNew/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            // $("#dvAjaxLoad").hide();
            if (jsData.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', "User tree refreshed");
                //$("#dvXMLInfo").html('User tree is refreshed');
                //$("#dvUserInfo").html("");
                //$('.blink').blink();
                //$("#dvRegionXml").overlay().load();
                $('#dvUserInfo').hide();
            }
            else {
                fnMsgAlert('info', 'Information', "User tree refresh failed");
            }
            fnBindUserTreeNew("dvUserTree");
            //$.unblockUI();
        },
        error: function () {
            // $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        complete: function () {
            $.unblockUI();
        }
    });
}
/*
* Disable region node while right click and then change status
*/

function fnChangeRegionStatus(action, node) {

    //$.msgAlert({
    //    type: 'warning'
    //    , title: 'Delete'
    //    , text: 'Do you want to delete this region'
    //    , callback: function () {
    if (confirm('Do you want to delete this region')) {
        $.blockUI();
        $.ajax({
            url: '../HiDoctor_Master/Master/GetChildRegions/',
            type: "POST",
            data: "RegionCode=" + node.data.key + "",
            success: function (jsData) {
                jsData = eval('(' + jsData + ')');
                if (jsData.Tables[0].Rows.length > 1) {
                    alert('You can not disable this region. first change the child region hierarchy then disable this region');
                    // fnChangeRegionHierarchy('', '');
                }
                else {
                    $.blockUI();
                    //$("#dvAjaxLoad").show();
                    $.ajax({
                        url: '../HiDoctor_Master/User/GetChildUsersByRegion/',
                        type: "POST",
                        data: "regionCode=" + node.data.key + "",
                        success: function (jsData) {
                            if (jsData != '') {
                                var content = "";
                                var disUserJson = jsonPath(jsData, "$.[?(@.Region_Code=='" + node.data.key + "')]");

                                if (disUserJson != false && disUserJson != null && disUserJson != '') {
                                    fnMsgAlert('info', 'Info', "You can not delete this region.Because there are " + disUserJson.length + " user(s) mapped to this region.");
                                    return;
                                }
                                else {
                                    $.ajax({
                                        url: '../HiDoctor_Master/Organogram/UpdateRegionStatus/',
                                        type: "POST",
                                        data: "RegionCode=" + node.data.key + "",
                                        success: function (jsData) {
                                            $("#dvAjaxLoad").hide();
                                            if (jsData.split(':')[0] == "SUCCESS") {
                                                fnMsgAlert('success', 'Success', "Region status updated successfully");
                                                fnBindRegionTree("dvRegionTree");
                                            }
                                            else {
                                                fnMsgAlert('info', 'Information', "Region status updation failed");
                                            }
                                        }
                                    });
                                }
                            }
                            else {
                                $.ajax({
                                    url: '../HiDoctor_Master/Organogram/UpdateRegionStatus/',
                                    type: "POST",
                                    data: "RegionCode=" + node.data.key + "",
                                    success: function (jsData) {
                                        $("#dvAjaxLoad").hide();
                                        if (jsData.split(':')[0] == "SUCCESS") {
                                            fnMsgAlert('success', 'Success', "Region status updated successfully");
                                            fnBindRegionTree("dvRegionTree");
                                        }
                                        else {
                                            fnMsgAlert('info', 'Information', "Region status updation failed");
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                $.unblockUI();
            },
            error: function () {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
            },
            complete: function () {
                $.unblockUI();
            }
        });

    }
    //});
}

/*
* Disable user node while right click and then change status
*/
function fnChangeUserStatus(action, node) {

    $.msgAlert({
        type: 'warning'
	    , title: 'Delete'
	    , text: 'Do you want to permanently delete this User'
        , callback: function () {
            $.blockUI();
            $.ajax({
                url: '../HiDoctor_Master/Master/GetChildUsers/',
                type: "POST",
                data: "UserCode=" + node.data.key + "",
                success: function (jsData) {
                    jsData = eval('(' + jsData + ')');
                    if (jsData.Tables[0].Rows.length > 1) {
                        var users = "Dear " + $("#spnUser").html().split(',')[0] + " ,You can not delete the " + node.data.title + " <br/> because following user(s) are reporting to him.<br/>";
                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                            if (node.data.key != jsData.Tables[0].Rows[i].User_Code) {
                                users += jsData.Tables[0].Rows[i].User_Name + "(" + jsData.Tables[0].Rows[i].User_Type_Name + ") <br/>";
                            }
                        }
                        $("#dvUserContent").html(users);
                        //alert('You can not disable this user. first change the child user hierarchy then disable this user');
                        $("#dvDisUserCount").dialog({
                            resizable: true,
                            height: 300,
                            modal: true,
                            buttons: {
                                Cancel: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                        //  fnChangeUserHierarchy('', '');

                    }
                    else {
                        $("#dvAjaxLoad").show();
                        $("#dvDisableUser").overlay().load();
                        //$.ajax({
                        //    url: '../HiDoctor_Master/User/BulkUserDisable/',
                        //    type: "POST",
                        //    data: "userCodes=" + node.data.key + "",
                        //    success: function (jsData) {
                        //        $("#dvAjaxLoad").hide();
                        //        if (jsData.split(':')[0] == "SUCCESS") {
                        //            fnMsgAlert('success', 'Success', "User status updated successfully");
                        //            fnBindUserTree("dvUserTree");
                        //        }
                        //        else {
                        //            fnMsgAlert('info', 'Information', "User status updation failed");
                        //        }
                        //    }
                        //    ,
                        //    error: function () {
                        //        $("#dvAjaxLoad").hide();
                        //    }
                        //});
                    }
                }
            });

        }
    });
}

/*
* Move region node up using right click then move up
*/
function fnMoveRegionTreeUp(action, node) {
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        if (confirm('Do you want to move the region up')) {
            //$.msgAlert({
            //    type: 'warning'
            //, title: 'Move Up'
            //, text: 'Do you want to move the region up'
            //, callback: function () {
            $("#dvAjaxLoad").show();
            $.blockUI();
            var regionCode = regionTree.getActiveNode().data.key;
            $.ajax({
                url: '../HiDoctor_Master/Organogram/RegionNodeUp/',
                type: "POST",
                data: "RegionCode=" + regionCode + "",
                success: function (jsData) {
                    $("#dvAjaxLoad").hide();
                    if (jsData.split(':')[0] == "SUCCESS") {
                        fnMsgAlert('success', 'Success', "" + regionTree.getActiveNode().data.title + "moved up");
                        $("#dvRegionInfo").show();

                        $('.blink').blink();
                    }
                    else {
                        fnMsgAlert('info', 'Information', "You can move only within the region");

                    }
                    $.unblockUI();
                    fnGetRegionTree(currentRegionCode_g, "dvRegionTree", "dvFilteredNode");
                },
                error: function () {
                    $("#dvAjaxLoad").hide();
                    $.unblockUI();
                },
                complete: function () {
                    $.unblockUI();
                }
            });

        }
        // });
    }
    else {
        fnMsgAlert('info', 'Information', 'Please select any one region');
    }

}

/*
* Move region node down using right click then move up
*/
function fnMoveRegionTreeDown(action, node) {
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        if (confirm('Do you want to move the region down')) {
            //$.msgAlert({
            //    type: 'warning'
            //, title: 'Move Down'
            //, text: 'Do you want to move this region down'
            //, callback: function () {
            $("#dvAjaxLoad").show();
            $.blockUI();
            var regionCode = regionTree.getActiveNode().data.key;
            $.ajax({
                url: '../HiDoctor_Master/Organogram/RegionNodeDown/',
                type: "POST",
                data: "RegionCode=" + regionCode + "",
                success: function (jsData) {
                    $("#dvAjaxLoad").hide();
                    if (jsData.split(':')[0] == "SUCCESS") {
                        fnMsgAlert('success', 'Success', "" + regionTree.getActiveNode().data.title + "moved Down");
                        $("#dvRegionInfo").show();

                        $("#dvRegionInfo").html(" --> Click refresh button to see your changes");
                        $('.blink').blink();

                    }
                    else {
                        fnMsgAlert('info', 'Information', "You can move only within the region");
                    }
                    $.unblockUI();
                    fnBindRegionTree("dvRegionTree");
                },
                error: function () {
                    $("#dvAjaxLoad").hide();
                    $.unblockUI();
                },
                complete: function () {
                    $.unblockUI();
                }
            });

        }
        // });
    }
    else {
        fnMsgAlert('info', 'Information', 'Please select any one region');
    }
}


/*
* Move user node up using right click then move up
*/
function fnMoveUserTreeUp(action, node) {

    var userTree = $("#dvUserTree").dynatree("getTree");
    if (userTree.getActiveNode() != null) {
        $.msgAlert({
            type: 'warning'
	    , title: 'Delete'
	    , text: 'Do you want to move this user up'
        , callback: function () {
            $.blockUI();
            // $("#dvAjaxLoad").show();
            var userCode = userTree.getActiveNode().data.key;
            $.ajax({
                url: '../HiDoctor_Master/Organogram/UserNodeUp/',
                type: "POST",
                data: "UserCode=" + userCode + "",
                success: function (jsData) {
                    //$("#dvAjaxLoad").hide();
                    if (jsData.split(':')[0] == "SUCCESS") {
                        fnMsgAlert('success', 'Success', "" + userTree.getActiveNode().data.title + " moved up");
                        $("#dvUserInfo").show();
                        $("#dvUserInfo").html(" --> Click refresh button to see your changes");
                        $('.blink').blink();
                    }
                    else {
                        fnMsgAlert('info', 'Information', "You can move only within the under user");
                    }
                    $.unblockUI();
                    fnBindUserTreeNew("dvUserTree");
                },
                error: function () {
                    // $("#dvAjaxLoad").hide();
                    $.unblockUI();
                },
                complete: function () {
                    $.unblockUI();
                }
            });

        }
        });
    }
    else {
        fnMsgAlert('info', 'Information', 'Please select any one user');
    }

}

/*
* Move user node down using right click then move up
*/
function fnMoveUserTreeDown(action, node) {
    var userTree = $("#dvUserTree").dynatree("getTree");
    if (userTree.getActiveNode() != null) {
        $.msgAlert({
            type: 'warning'
	    , title: 'Delete'
	    , text: 'Do you want to move this user down'
        , callback: function () {
            $.blockUI();
            //  $("#dvAjaxLoad").show();
            var userCode = userTree.getActiveNode().data.key;
            $.ajax({
                url: '../HiDoctor_Master/Organogram/UserNodeDown/',
                type: "POST",
                data: "UserCode=" + userCode + "",
                success: function (jsData) {
                    //  $("#dvAjaxLoad").hide();
                    if (jsData.split(':')[0] == "SUCCESS") {
                        fnMsgAlert('success', 'Success', "" + userTree.getActiveNode().data.title + " moved Down");
                        $("#dvUserInfo").show();
                        $("#dvUserInfo").html(" --> Click refresh button to see your changes");
                        $('.blink').blink();
                    }
                    else {
                        fnMsgAlert('info', 'Information', "You can move only within the under user");
                    }
                    $.unblockUI();
                    fnBindUserTreeNew("dvUserTree");
                },
                error: function () {
                    //  $("#dvAjaxLoad").hide();
                    $.unblockUI();
                },
                complete: function () {
                    $.unblockUI();
                }
            });

        }
        });
    }
    else {
        fnMsgAlert('info', 'Information', 'Please select any one user');
    }
}

/*
* Validate special chacters
* Validate region name is already exists or not
*/
function fnValidateRegionName() {
    if ($.trim($("#Region_Name").val()) != '') {
        var result = regExforAlphaNumeric($("#Region_Name").val());
        if (!result) {
            fnBarAlert('warning', 'Error', 'Special characters are not allowed in region name', 'dvErrorRegion');
            $("#Region_Name").val('');
        }
        if ($("#hdnRegionCode").val() == '') {
            if ($("#Region_Name").val() != '') {
                if (RegionMasterDetails_g != '') {
                    if (RegionMasterDetails_g.Tables[4].Rows.length > 0) {
                        var disJson = jsonPath(RegionMasterDetails_g.Tables[4].Rows, "$.[?(@.Region_Name=='" + $.trim($("#Region_Name").val()).toUpperCase() + "')]");
                        if (disJson.length > 0) {
                            if (disJson[0].Region_Status == "1") {
                                fnBarAlert('info', 'Caution!', 'Dear User the same region name ' + $.trim($("#Region_Name").val()).toUpperCase() + ' is already available in the system in active status.Please use other Region name', 'dvErrorRegion');
                                $("#Region_Name").val('');
                                return;
                            }
                            else {
                                fnBarAlert('info', 'Caution!', 'Dear User the same region name ' + $.trim($("#Region_Name").val()).toUpperCase() + ' is already available in the system in Inactive status.Please use other Region name', 'dvErrorRegion');
                                $("#Region_Name").val('');
                                return;
                            }
                        }
                    }
                }
            }
        }
        else {
            if ($("#Region_Name").val() != '') {
                if (RegionMasterDetails_g != '') {
                    if (RegionMasterDetails_g.Tables[4].Rows.length > 0) {
                        var disJson = jsonPath(RegionMasterDetails_g.Tables[4].Rows, "$.[?(@.Region_Name=='" + $.trim($("#Region_Name").val()).toUpperCase() + "')]");
                        if (disJson.length > 0) {
                            if (disJson[0].Region_Status == "1") {
                                if (disJson[0].Region_Code != $.trim($("#hdnRegionCode").val())) {
                                    fnBarAlert('info', 'Caution!', 'Dear User the same region name ' + $.trim($("#Region_Name").val()).toUpperCase() + ' is already available in the system in active status.Please use other Region name', 'dvErrorRegion');
                                    $("#Region_Name").val('');
                                    return;
                                }
                            }
                            else {
                                fnBarAlert('info', 'Caution!', 'Dear User the same region name ' + $.trim($("#Region_Name").val()).toUpperCase() + ' is already available in the system in Inactive status.Please use other Region name', 'dvErrorRegion');
                                $("#Region_Name").val('');
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}

/*
* Validate special chacters
* Validate user name is already exists or not
*/
function fnValidateUserName() {
    var result = regExforAlphaNumeric($("#User_Name").val());
    if (!result) {
        fnBarAlert('warning', 'Error', 'Special characters are not allowed in user name', 'dvErrorUser');
        $("#Region_Name").val('');
    }
    if ($("#hdnUserCode").val() == '') {
        if (user_g != '') {
            if (user_g.Rows.length > 0) {
                for (var i = 0; i < user_g.Rows.length; i++) {
                    if ((user_g.Rows[i].User_Name).toUpperCase() == $("#User_Name").val().toUpperCase()) {
                        fnBarAlert('info', 'Information', 'User Name already exists', 'dvErrorUser');
                        $("#User_Name").val('');
                        return;
                    }
                }
            }
        }
    }
}

/*
* Validate entered region details
* Mandatory field validation
*/
function fnValidateRegionInsertion() {
    debugger;
    if ($.trim($("#Region_Name").val()) == "") {
        fnBarAlert('info', 'error', 'Please enter region name', 'dvErrorRegion');
        return false;
    }
    else if ($("#cboUnderRegionCode").val() == "0") {
        fnBarAlert('info', 'error', 'Please select under region name', 'dvErrorRegion');
        //alert('Please select under region name');
        return false;
    }
    else if ($("#cboRegionTypeCode").val() == "0") {
        fnBarAlert('info', 'error', 'Please select region type name', 'dvErrorRegion');
        //alert('Please select region type name');
        return false;
    }
    if ($("#hdnRegionCode").val() != '') {
        if (RegionMasterDetails_g != '') {
            var disJson = jsonPath(RegionMasterDetails_g, "$.Tables[1].Rows[?(@.Region_Code=='" + $("#hdnRegionCode").val() + "')]");
            if (disJson != false) {
                var curRegionfullIndex = disJson[0].Full_index;
                var disParentJson = jsonPath(RegionMasterDetails_g, "$.Tables[1].Rows[?(@.Region_Code=='" + $("#cboUnderRegionCode").val() + "')]");
                if (disParentJson != false) {
                    var parRegionfullIndex = disParentJson[0].Full_index;
                    if (parRegionfullIndex.indexOf(curRegionfullIndex) > -1) {
                        fnMsgAlert('info', 'Info', 'You have selected one of your parent region as under region name.');
                        return false;
                    }
                }
            }
        }
    }

    //**********Expense Group Mapping Privilege Set Start***********************************************//

    var expenseGroup = fnGetPrivilegeValue('MANDATE_EXPENSE_GROUP_MAPPING', 'NO');
    if (expenseGroup.toUpperCase() == "YES") {
        debugger;
        if ($("#cboExpenseGroup").val() == "0") {

            fnMsgAlert('info', ExpenseGroupMapping, 'Expense group mapping is mandatory for this selected user type(s)/designation(s)');
            return false;
        }
        else {
            return true;
        }
    }

    // ****************************Privilege Set End**********************************//


    if ($('#txtCountry').val().length == 0) {
        fnBarAlert('info', 'error', 'Please select country, state and city', 'dvErrorRegion');
        return false;
    }
    if ($('#txtState').val().length == 0) {
        fnBarAlert('info', 'error', 'Please select country, state and city', 'dvErrorRegion');
        return false;
    }
    if ($('#txtCity').val().length == 0) {
        fnBarAlert('info', 'error', 'Please select country, state and city', 'dvErrorRegion');
        return false;
    }
    if ($('#txtLocalArea').val().length == 0) {
        fnBarAlert('info', 'error', 'Please enter local area', 'dvErrorRegion');
        return false;
    }
    if ($('#hdnLatVal').val().length == 0) {
        $('#hdnLatVal').val('0');
    }
    if ($('#hdnLngVal').val().length == 0) {
        $('#hdnLngVal').val('0');
    }
    return true;
}


/*
* Validate entered user details
* Mandatory field validation
*/


/*
* Region Tree search
*/

function fnHighlightText() {
    $('#dvRegionTree').removeHighlight().highlight($("#txtRegionSearch").val());
}

/*
* User Tree search
*/
function fnHighlightUserText() {
    $('#dvUserTree').removeHighlight().highlight($("#txtUserSearch").val());
}

/*
* Child regions add
*/

function fnAddChildRegion(action, node) {

    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        fnRegionClearAll();
        $("#hdnRegionCode").val("");
        $("#dvAddRegion").overlay().load();
        $("#cboUnderRegionCode").val(node.data.key);
    }
    else {
        fnMsgAlert('info', 'Information', 'Please select any one region');
    }
}


/*
* Child User add
*/
function fnAddChildUser(action, node) {
    $.blockUI();
    $("#User_Name").attr("disabled", false);
    var userTree = $("#dvUserTree").dynatree("getTree");
    if (userTree.getActiveNode() != null) {
        fnUserClearAll();
        $("#hdnUserCode").val("");
        $("#dvAddUser").overlay().load();
        $("#cboUnderUser").val(node.data.key);
    }
    else {
        fnMsgAlert('info', 'Information', 'Please select any one user');
    }
}


/*
* Change parent region
*/
function fnChangeRegionHierarchy(action, node) {
    // $("#dvAjaxLoad").show();
    $("#cboParRegion").val('0')
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        $("#dvSelectdRegions").html("");
        $.blockUI();
        $.ajax({
            url: '../HiDoctor_Master/Master/GetChildRegions/',
            type: "POST",
            data: "RegionCode=" + regionTree.getActiveNode().data.key + "",
            success: function (jsData) {
                jsData = eval('(' + jsData + ')');
                childRegions_g = jsData;
                if (RegionMasterDetails_g != '') {
                    if (RegionMasterDetails_g.Tables[1].Rows.length > 0) {
                        var parentRegion = $("#cboParRegion");
                        parentRegion.append("<option value=0>-Region-</option>");
                        for (var c = 0; c < RegionMasterDetails_g.Tables[1].Rows.length; c++) {
                            parentRegion.append("<option value=" + RegionMasterDetails_g.Tables[1].Rows[c].Region_Code + ">" + RegionMasterDetails_g.Tables[1].Rows[c].Region_Name + "</option>");
                        }
                    }
                }
                var content = "";
                content += "<table class='data display datatable' >";
                content += "<thead><tr><td style='width:5%;'>Select <input type='checkbox' name='chkAllRegion' onclick='fnCheckAllRegion();'/></td><td style='width:15%;'>Region</td></tr></thead><tbody>";
                for (var r = 0; r < jsData.Tables[0].Rows.length; r++) {
                    if (node == '') {
                        if (regionTree.getActiveNode().data.key != jsData.Tables[0].Rows[r].Region_Code) {
                            content += "<tr>";
                            content += "<td><input type='checkbox' id='chkRegion_" + r + "' name='chkSelect' value='" + jsData.Tables[0].Rows[r].Region_Code + "' /></td>";
                            content += "<td>" + jsData.Tables[0].Rows[r].Region_Name + "</td>";
                            content += "</tr>";
                        }
                    }
                    else {
                        content += "<tr>";
                        content += "<td><input type='checkbox' id='chkRegion_" + r + "' name='chkSelect' value='" + jsData.Tables[0].Rows[r].Region_Code + "' /></td>";
                        content += "<td>" + jsData.Tables[0].Rows[r].Region_Name + "</td>";
                        content += "</tr>";
                    }
                }
                content += "</tbody></table>";
                $("#dvSelectdRegions").html(content);
                if ($.fn.dataTable) { $('.datatable').dataTable({ "bPaginate": false, "bDestroy": true }); };
                // $("#dvAjaxLoad").hide();
                $("#dvRegionHierarchy").overlay().load();
                $.unblockUI();
            },
            error: function () {
                // $("#dvAjaxLoad").hide();
                $.unblockUI();
            },
            complete: function () {
                $.unblockUI();
            }
        });
    }
    else {
        fnMsgAlert('info', 'Information', 'Please select a region');
        //  $("#dvAjaxLoad").hide();
    }
}


/*
* Change parent user
*/


/*
* Change parent region save function
*/
function fnChangeRegionHierarchySubmit() {
    //RegionHierarchyChange
    if ($("#cboParRegion").val() == "0") {
        fnBarAlert('info', 'Information', 'Please select parent region', 'dvErrorRegChange');
    }
    else {
        var regionCodes = "";
        var count = 0;
        $("input:checkbox[name=chkSelect]").each(function () {
            if (this.checked) {
                regionCodes += $(this).val() + "^";
                count = parseInt(count) + 1;
            }
        });
        if (count > 0) {
            $("#dvAjaxLoad").show();
            $.ajax({
                url: '../HiDoctor_Master/Organogram/RegionHierarchyChange/',
                type: "POST",
                data: "RegionCodes=" + regionCodes + "&UnderRegionCode=" + $("#cboParRegion").val() + "",
                success: function (jsData) {
                    if (jsData.split(':')[0] == "SUCCESS") {
                        $("#dvAjaxLoad").hide();
                        $("#dvRegionHierarchy").overlay().close();
                        fnMsgAlert('success', 'Success', "Region Hierarchy changed");
                        // $("#dvRegionInfo").html(" --> Click refresh button to see your changes");
                        // $('.blink').blink();
                        fnUpdateRegFullIndex();

                    }
                    $.unblockUI();
                },
                error: function () {
                    $("#dvAjaxLoad").hide();
                    $.unblockUI();
                },
                complete: function () {
                    $.unblockUI();
                }
            });
        }
        else {
            fnBarAlert('info', 'Information', 'Please select atleast one region', 'dvErrorRegChange');
        }
    }

}
function fnChangeUserHierarchyPopUp() {
    var userTree = $("#dvUserTree").dynatree("getTree");
    if (userTree.getActiveNode() != null) {
        $("#dvUserHierarchy").overlay().load();
    }
    else {
        fnMsgAlert('info', 'Info', 'Please select any one user');
        return;
    }
}
/*
* Change parent user save function
*/

//}

function fnCheckAllRegion() {
    if ($("input:checkbox[name=chkAllRegion]").attr("checked") == "checked") {
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


function fnCheckAllUser() {
    if ($("input:checkbox[name=chkAllUser]").attr("checked") == "checked") {
        $("input:checkbox[name=chkUserSelect]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkUserSelect]").each(function () {
            this.checked = false;
        });
    }
}

function fnPasswordValidation() {
    if ($("#hdnUserCode").val() == '') {
        var result = regExforAlphaNumeric($("#User_Pass").val());
        if (!result) {
            fnBarAlert('warning', 'Error', 'Special characters are not allowed in user password', 'dvErrorUser');
            $("#User_Pass").val('');
        }
    }
}

function fnRegionTreePostInit() {
}




/******************** Add New user and Map to region ******************/
function fnShowAddUser(action, node) {

    //var regionTree = $("#dvRegionTree").dynatree("getTree");
    //var regionCode = regionTree.getActiveNode().data.key;
    //var regionName = regionTree.getActiveNode().data.title.split('(')[0];
    //var region = regionCode + "_" + regionName;

    //$("#dvAddUser").load('../HiDoctor_Master/User/User/' + region);

    $("#dvAddUser").overlay().load();
    // $.modal({ ajax: '../HiDoctor_Master/User/User/?id=' + escape(region), title: '', overlayClose: false });
}


function fnShowDisableUsers(action, node) {
    if ($(node.span).hasClass('tree-node-vacant')) {
        fnMsgAlert('info', 'info', 'There is no users mapped to the selective region');
        return;
    }
    else {
        $("#dvDisableRegionUser").overlay().load();
        //$.ajax({
        //    url: '../HiDoctor_Master/User/GetChildUsersByRegion/',
        //    type: "POST",
        //    data: "regionCode=" + node.data.key + "",
        //    success: function (jsData) {
        //        if (jsData != '') {
        //            var disUserJson = jsonPath(jsData, "$.[?(@.Region_Code=='" + node.data.key + "')]");
        //            if (disUserJson != false) {
        //                if (disUserJson.length > 1) {
        //                    $("#dvDisableUser").overlay().load();
        //                }
        //                else {
        //                    if (disUserJson.length == 1) {
        //                        var disJson = jsonPath(jsData, "$.[?(@.Under_User_Code=='" + disUserJson[0].User_Code + "')]");
        //                        if (disJson != false) {
        //                            fnMsgAlert('info', 'info', 'You can not disable this users. Because some users are mapped under him.');
        //                            return;
        //                        }
        //                        else {
        //                            $.ajax({
        //                                url: '../HiDoctor_Master/User/BulkUserDisable/',
        //                                type: "POST",
        //                                data: "userCodes=" + disUserJson[0].User_Code + "",
        //                                success: function (result) {
        //                                    $("#dvAjaxLoad").hide();
        //                                    if (result.split(':')[0] == "SUCCESS") {
        //                                        fnMsgAlert('success', 'Success', "User status updated successfully");
        //                                    }
        //                                    else {
        //                                        fnMsgAlert('info', 'Information', "User status updation failed");
        //                                    }
        //                                },
        //                                error: function () {
        //                                    $("#dvAjaxLoad").hide();
        //                                }
        //                            });
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //});

    }
}




//var autocomplete;
//var map, marker, geocoder, infoWindow, options, myLatlng, infoWindow;
///********************** Geo Details added ******************************/
//function initialize() {
//    
//    autocomplete = new google.maps.places.Autocomplete(
//        /** @type {HTMLInputElement} */(document.getElementById('txtMap')),
//        { types: ['geocode'] });
//    var mapOptions = {
//        center: new google.maps.LatLng(0, 0),
//        zoom: 13,
//        mapTypeId: google.maps.MapTypeId.ROADMAP
//    };
//    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
//    google.maps.event.addListener(map, 'click', function (e) {
//        // Getting the address for the position being clicked				
//        getAddress(e.latLng);
//    });
//}

///*Function GeoReverseCoding Starts*/
//function getAddress(latLng) {
//    //alert(latLng);
//    // Check to see if a geocoder object already exists
//    if (!geocoder) {
//        geocoder = new google.maps.Geocoder();
//    }
//    // Creating a GeocoderRequest object
//    var geocoderRequest = {
//        latLng: latLng
//    }
//    geocoder.geocode(geocoderRequest, function (results, status) {
//        // If the infoWindow hasn't yet been created we create it
//        if (!infoWindow) {
//            infoWindow = new google.maps.InfoWindow();
//        }
//        // Setting the position for the InfoWindow
//        infoWindow.setPosition(latLng);
//        // Creating content for the InfoWindow
//        var content = '<h3>Position: ' + latLng.toUrlValue() + '</h3>';
//        // Check to see if the request went allright
//        if (status == google.maps.GeocoderStatus.OK) {
//            $("#hdnLatVal").val(results[0].geometry.location.lat());
//            $("#hdnLngVal").val(results[0].geometry.location.lng());
//            $("#hdnAddress").val(results[0].formatted_address);
//            map.setCenter(results[0].geometry.location);
//            if (marker) {
//                marker.setMap(null);
//            }
//            // Creating a new marker and adding it to the map
//            marker = new google.maps.Marker({
//                map: map,
//                //draggable: true,
//                position: latLng
//            });

//            content += results[0].formatted_address + '<br />';
//            //content += '<input type="button" onclick="saveData()" class="info_button" value="Click here to set Coordinates."/>';
//        }
//        else {
//            if (marker) {
//                marker.setMap(null);
//            }
//            // Creating a new marker and adding it to the map
//            marker = new google.maps.Marker({
//                map: map,
//                //draggable: true,
//                position: latLng
//            });
//            content += '<p>No address could be found. Status = ' + status + '</p>';
//        }
//        // Adding the content to the InfoWindow
//        infoWindow.setContent(content);
//        // Opening the InfoWindow
//        infoWindow.open(map, marker);
//    });
//}






/************** working code **********************/
//var geocoder;
//var map;
//var marker;
//var pageNum = 0;

///* Load Map*/
//var geocoder;
//var map;
//var infowindow = new google.maps.InfoWindow();
//var marker;
//var input = document.getElementById('txtMap');
//function fnBindMap() {
//    // $("#dvAjaxLoad").show();
//    var lat = $('#hdnLatVal').val();
//    var log = $('#hdnLngVal').val();
//    if (lat == '') {
//        //lat = '12.98267';
//        lat = "20.593684";
//    }
//    if (log == '') {
//        log = '78.962880';
//    }
//    if (lat == '0') {
//        // lat = '12.98267';
//        lat = "20.593684";
//    }
//    if (log == '0') {
//        // log = '80.26338';
//        log = '78.962880';
//    }

//    var defaultBounds = new google.maps.LatLngBounds(
//           new google.maps.LatLng(lat, log),
//          new google.maps.LatLng(lat, log));


//    var mapOptions = {
//        center: new google.maps.LatLng(lat, log),
//        zoom: 13,
//        mapTypeId: google.maps.MapTypeId.ROADMAP
//    };
//    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
//    google.maps.event.addListener(map, 'click', function (e) {
//        // Getting the address for the position being clicked				
//        getAddress(e.latLng);
//    });
//    autocomplete = new google.maps.places.Autocomplete(input);
//    autocomplete.bindTo('bounds', map);
//    var infowindow = new google.maps.InfoWindow();
//    marker = new google.maps.Marker({
//        position: new google.maps.LatLng(lat, log),
//        map: map
//    });

//    //$("#dvAjaxLoad").hide();
//    google.maps.event.addListener(autocomplete, 'place_changed', function () {

//        fnInfoWindow(autocomplete.getPlace());
//    });

//    $.ajax({
//        url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + log + '&sensor=true',
//        success: function (data) {
//            //  alert(data.results[4].formatted_address);
//            $("#txtMap").val(data.results[4].formatted_address);

//        }
//    });

//}

//function fnInfoWindow(place) {
//    
//    infowindow.close();
//    marker.setVisible(false);
//    input.className = '';
//   // place = autocomplete.getPlace();
//    if (place != undefined) {
//        if (!place.geometry) {
//            // Inform the user that the place was not found and return.
//            input.className = 'notfound';
//            return;
//        }
//    }
//    else {
//        input.className = 'notfound';
//        return;
//    }
//    // If the place has a geometry, then present it on a map.
//    if (place.geometry.viewport) {
//        map.fitBounds(place.geometry.viewport);
//    } else {
//        map.setCenter(place.geometry.location);
//        map.setZoom(17);  // Why 17? Because it looks good.
//    }
//    var image = new google.maps.MarkerImage(
//                          place.icon,
//                          new google.maps.Size(71, 71),
//                          new google.maps.Point(0, 0),
//                          new google.maps.Point(17, 34),
//                          new google.maps.Size(35, 35));
//    //marker.setIcon(image);
//    marker.setPosition(place.geometry.location);

//    var address = '';
//    if (place.address_components) {
//        address = [
//                          (place.address_components[0] && place.address_components[0].short_name || ''),
//                          (place.address_components[1] && place.address_components[1].short_name || ''),
//                          (place.address_components[2] && place.address_components[2].short_name || '')
//        ].join(' ');
//    }

//    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
//    infowindow.open(map, marker);
//}
///* Load Map*/
//function placeMarker(location) {
//    if (marker) {
//        marker.setPosition(location);
//    } else {
//        marker = new google.maps.Marker({
//            position: location,
//            map: map
//        });
//    }
//}
//var address = '';
//function getAddress(latLng) {
//    //alert(latLng);
//    // Check to see if a geocoder object already exists
//    if (!geocoder) {
//        geocoder = new google.maps.Geocoder();
//    }
//    // Creating a GeocoderRequest object
//    var geocoderRequest = {
//        latLng: latLng
//    }
//    geocoder.geocode(geocoderRequest, function (results, status) {
//        // If the infoWindow hasn't yet been created we create it


//        ////if (!infoWindow) {
//        //infoWindow = new google.maps.InfoWindow();
//        //// }
//        //// Setting the position for the InfoWindow
//        //infoWindow.setPosition(latLng);
//        //// Creating content for the InfoWindow
//        //var content = '<h3>Position: ' + latLng.toUrlValue() + '</h3>';
//        // Check to see if the request went allright
//        if (status == google.maps.GeocoderStatus.OK) {
//            place = results[0];
//            alert(results[0].formatted_address);
//            $("#hdnLatVal").val(results[0].geometry.location.lat());
//            $("#hdnLngVal").val(results[0].geometry.location.lng());
//            $("#txtMap").val(results[0].formatted_address);
//            //address = results[0].formatted_address;
//            //map.setCenter(results[0].geometry.location);
//            //if (marker) {
//            //    marker.setMap(null);
//            //}
//            //// Creating a new marker and adding it to the map
//            //marker = new google.maps.Marker({
//            //    map: map,
//            //    //draggable: true,
//            //    position: latLng
//            //});
//            ////infowindow.open();
//            //content += results[0].formatted_address + '<br />';
//            ////content += '<input type="button" onclick="saveData()" class="info_button" value="Click here to set Coordinates."/>';
//            fnInfoWindow(results[0]);
//        }
//        else {
//            //if (marker) {
//            //    marker.setMap(null);
//            //}
//            //// Creating a new marker and adding it to the map
//            //marker = new google.maps.Marker({
//            //    map: map,
//            //    //draggable: true,
//            //    position: latLng
//            //});
//            //content += '<p>No address could be found. Status = ' + status + '</p>';
//        }
//        //// Adding the content to the InfoWindow
//        //infoWindow.setContent(content);
//        //// Opening the InfoWindow
//        //infoWindow.open(map, marker);


//        //if (place.address_components) {
//        //    address = [
//        //                      (place.address_components[0] && place.address_components[0].short_name || ''),
//        //                      (place.address_components[1] && place.address_components[1].short_name || ''),
//        //                      (place.address_components[2] && place.address_components[2].short_name || '')
//        //    ].join(' ');
//        //}

//        //infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
//        //infowindow.open(map, marker);
//    });
//}


/************** working code **********************/


function initialize() {
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById('txtMap')),
        { types: ['geocode'] });
    fnLoadMap();
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        fnLoadMap();
    });
}



function fnLoadMap() {
    var addressText = document.getElementById('txtMap').value;
    //Code to remove the '/' and '&' Symbol
    if (addressText != '') {
        var replaceText = addressText.replace(/ForwardSlash/g, '/');
        var ampersandText = replaceText.replace(/Ampersand/g, '&');
        //   var splitText = ampersandText.split('~');
        //var curLatLog;
        if (currMap.toUpperCase() == 'GOOGLE') {
            getCoordinates(addressText);
        }
    }
    else {
        //if (navigator.geolocation) {
        //    
        //    navigator.geolocation.getCurrentPosition(showPosition, showError);
        //}
        //else {
        //    alert("Sorry, browser does not support geolocation!");
        //}


        // alert(navigator.geolocation);
    }

}

/*Function GeoCoding Start*/
// Create a function the will return the coordinates for the address
function getCoordinates(address) {
    //alert(address);
    // Check to see if we already have a geocoded object. If not we create one
    if (!geocoder) {
        geocoder = new google.maps.Geocoder();
    }
    // Creating a GeocoderRequest object
    var geocoderRequest = {
        address: address
    }
    // Making the Geocode request			
    geocoder.geocode(geocoderRequest, function (results, status) {
        // Check if status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            // Center the map on the returned location
            map.setCenter(results[0].geometry.location);
            // Check to see if we've already got a Marker object
            if (marker) {
                marker.setMap(null);
            }
            //if (!marker) {
            // Creating a new marker and adding it to the map
            marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            //}
            // Setting the position of the marker to the returned location
            marker.setPosition(results[0].geometry.location);
            // Check to see if we've already got an InfoWindow object
            if (!infoWindow) {
                // Creating a new InfoWindow
                infoWindow = new google.maps.InfoWindow;
            }
            // Creating the content of the InfoWindow to the address
            // and the returned position
            $("#hdnLatVal").val(results[0].geometry.location.lat());
            $("#hdnLngVal").val(results[0].geometry.location.lng());
            $("#txtMap").val(results[0].formatted_address);
            fnFillAddress();
            var content = '<strong>' + results[0].formatted_address + '</strong><br />';
            content += 'Lat: ' + results[0].geometry.location.lat() + '<br />';
            content += 'Lng: ' + results[0].geometry.location.lng() + '<br />';
            //content += '<input type="button" onclick="saveData()" class="info_button" value="Click here to set Coordinates."/>';
            // Adding the content to the InfoWindow
            infoWindow.setContent(content);
            // Opening the InfoWindow
            infoWindow.open(map, marker);
        }
    });

}
function getBingAddress(lat, lng) {
    debugger;
    infoWindow = new Microsoft.Maps.Infobox();
    infoWindow.setMap(null);
    $("#hdnLatVal").val('0');
    $("#hdnLngVal").val('0');
    if (lat == 0 && lng == 0) {
        $(".Infobox").remove();
        var searchManager;
        //if($("#txtCity").val()!="") {
        //   search(map, $("#txtCity").val());
        //   }
        //else if ($("#txtState").val() != "")
        //   {
        //       search(map, $("#txtState").val());
        //   }
        //else if($("#txtCountry").val()!="")
        //{
        //    search(map, $("#txtCountry").val());
        //}
        search(map, "guindy");
        return false;
    }
    if (lat != 0 && lng != 0) {
        if (lat != undefined || lng != undefined) {
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                var searchManager = new Microsoft.Maps.Search.SearchManager(map);
                var reverseGeocodeRequestOptions = {
                    location: new Microsoft.Maps.Location(lat, lng),
                    callback: function (result) {
                        debugger;
                        $("#txtMap").val(result.address.formattedAddress);
                        $("#txtState").val(result.address.adminDistrict);
                        if (result.address.district != undefined) {
                            $("#txtCity").val(result.address.district);
                        }
                        else {
                            $("#txtCity").val(result.address.locality);
                        }
                        $("#txtCountry").val(result.address.countryRegion);
                        if (result.address.addressLine != undefined) {
                            $("#txtLocalArea").val(result.address.addressLine + ' ' + result.address.locality);
                        }
                        else {
                            $("#txtLocalArea").val(result.address.locality);
                        }
                        map.entities.clear();
                        $(".Infobox").remove();
                        //var latLon = new Microsoft.Maps.Location(lat, lng);
                        //var pin = new Microsoft.Maps.Pushpin(latLon, { text: '1', draggable: true });
                        infoWindow = new Microsoft.Maps.Infobox(reverseGeocodeRequestOptions.location,
                           {
                               title: 'Details',
                               description: '<h3>Position:' + lat.toString() + ',' + lng.toString() + '</h3>' + $("#txtMap").val() + '<br />'
                           });
                        // infoWindow.setMap(null);
                        map.entities.push(new Microsoft.Maps.Pushpin(reverseGeocodeRequestOptions.location));
                        // map.entities.push(pin);
                        // map.entities.push(infoWindow);
                        infoWindow.setMap(map);
                        $("#hdnLatVal").val(lat);
                        $("#hdnLngVal").val(lng);
                        map.setView({ center: reverseGeocodeRequestOptions.location, zoom: 10 });
                    },
                    errorCallback: function (e) {
                        $(".Infobox").remove();
                        //If there is an error, alert the user about it.
                        infoWindow = new Microsoft.Maps.Infobox(reverseGeocodeRequestOptions.location,
                          {
                              title: 'Details',
                              description: '<h3>Position:No results found.<br />'
                          });
                        infoWindow.setMap(map);
                    }
                };
                searchManager.reverseGeocode(reverseGeocodeRequestOptions);
            });

        }
    }
}
function search(map, query) {
    //Create an instance of the search manager and perform the search.
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        searchManager = new Microsoft.Maps.Search.SearchManager(map);
        geocodeQuery(map, query);
    });
}
function geocodeQuery(map, query) {
    var searchRequest = {
        where: query,
        callback: function (r) {
            if (r && r.results && r.results.length > 0) {
                debugger;
                infoWindow = new Microsoft.Maps.Infobox();
                infoWindow.setMap(null);
                map.entities.clear();
                infoWindow = new Microsoft.Maps.Infobox(r.results[0].location,
                      {
                          title: 'Details',
                          description: '<h3>Position:No results found.<br />'
                      });
                //Add the pins to the map
                map.entities.push(new Microsoft.Maps.Pushpin(r.results[0].location));
                infoWindow.setMap(map);
                map.setView({ center: r.results[0].location, zoom: 10 });

            }
        },
        errorCallback: function (e) {
            //If there is an error, alert the user about it.
            //document.getElementById('printoutPanel').innerHTML = 'No results found.';
        }
    };
    //Make the geocode request.
    searchManager.geocode(searchRequest);
}
/*Function GeoCoding End*/

/*Function GeoReverseCoding Starts*/
function getAddress(latLng) {
    //alert(latLng);
    // Check to see if a geocoder object already exists
    if (!geocoder) {
        geocoder = new google.maps.Geocoder();
    }
    // Creating a GeocoderRequest object
    var geocoderRequest = {
        latLng: latLng
    }
    geocoder.geocode(geocoderRequest, function (results, status) {
        // If the infoWindow hasn't yet been created we create it
        if (!infoWindow) {
            infoWindow = new google.maps.InfoWindow();
        }
        // Setting the position for the InfoWindow
        infoWindow.setPosition(latLng);
        // Creating content for the InfoWindow
        var content = '<h3>Position: ' + latLng.toUrlValue() + '</h3>';
        // Check to see if the request went allright
        if (status == google.maps.GeocoderStatus.OK) {
            $("#hdnLatVal").val(results[0].geometry.location.lat());
            $("#hdnLngVal").val(results[0].geometry.location.lng());
            $("#txtMap").val(results[0].formatted_address);
            fnFillAddress();
            map.setCenter(results[0].geometry.location);
            if (marker) {
                marker.setMap(null);
            }
            // Creating a new marker and adding it to the map
            marker = new google.maps.Marker({
                map: map,
                //draggable: true,
                position: latLng
            });

            content += results[0].formatted_address + '<br />';
            //content += '<input type="button" onclick="saveData()" class="info_button" value="Click here to set Coordinates."/>';
        }
        else {
            if (marker) {
                marker.setMap(null);
            }
            // Creating a new marker and adding it to the map
            marker = new google.maps.Marker({
                map: map,
                //draggable: true,
                position: latLng
            });
            content += '<p>No address could be found. Status = ' + status + '</p>';
        }
        // Adding the content to the InfoWindow
        infoWindow.setContent(content);
        // Opening the InfoWindow
        infoWindow.open(map, marker);
    });
}



//$('#txtLocalArea_' + rNo).removeClass('clsLocalArea');
function fnFillAddress() {
    //
    if ($('#txtMap').val().length > 0) {
        var ar = $('#txtMap').val().split(',');
        ar.reverse();

        var myRegexp = /(\d+)/g;


        if (ar.length == 1) {
            $('#txtCountry').val(ar[0]);
            $('#txtState').val('');
            $('#txtCity').val('');
            $('#txtLocalArea').val('');
        }
        if (ar.length == 2) {
            $('#txtCountry').val(ar[0]);
            var match = myRegexp.exec(ar[1]);
            if (match != 0 && match != null && match != undefined) {
                var strVal = ar[1].replace(myRegexp, '');
                $('#txtState').val(strVal);
            }
            else {
                $('#txtState').val(ar[1]);
            }
            $('#txtCity').val('');
            $('#txtLocalArea').val('');
        }
        if (ar.length == 3) {
            $('#txtCountry').val(ar[0]);
            var match = myRegexp.exec(ar[1]);
            if (match != 0 && match != null && match != undefined) {
                var strVal = ar[1].replace(myRegexp, '');
                $('#txtState').val(strVal);
            }
            else {
                $('#txtState').val(ar[1]);
            }
            $('#txtCity').val(ar[2]);
            $('#txtLocalArea').val(ar[2]);
        }
        if (ar.length == 4) {
            $('#txtCountry').val(ar[0]);
            var match = myRegexp.exec(ar[1]);
            if (match != 0 && match != null && match != undefined) {
                var strVal = ar[1].replace(myRegexp, '');
                $('#txtState').val(strVal);
            }
            else {
                $('#txtState').val(ar[1]);
            }
            $('#txtCity').val(ar[2]);
            $('#txtLocalArea').val(ar[3]);
        }
        if (ar.length > 4) {
            $('#txtCountry').val(ar[0]);
            var match = myRegexp.exec(ar[1]);
            if (match != 0 && match != null && match != undefined) {
                var strVal = ar[1].replace(myRegexp, '');
                $('#txtState').val(strVal);
            }
            else {
                $('#txtState').val(ar[1]);
            }
            $('#txtCity').val(ar[2]);
            $('#txtLocalArea').val(ar[3]);
        }
    }
}