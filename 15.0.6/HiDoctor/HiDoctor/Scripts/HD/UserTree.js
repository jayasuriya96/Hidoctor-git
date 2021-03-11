//global variable
var userCode_g = "";
var strTree = "";
var menuContent = "";
function fnBindUserTree(id, filterNodeId) {
    debugger;
    $('#' + id).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    //  $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateUserTree',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                $('#' + filterNodeId).hide();
                $("#" + id).show();
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);

                $("#" + id).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $('#' + id).unblock();
            }
        }
        //}
    });
    $('#' + id).unblock();
}

//******************************Start New Tree Generated*******************************************************************
// New Tree Created by adding Employee Name in first

function fnBindUserTreeNew(id, filterNodeId) {
    debugger;
    $('#' + id).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    //  $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateUserTreeNew',
        data: "A",
        success: function (jsData) {
            debugger;
            if (jsData != '') {
                $('#' + filterNodeId).hide();
                $("#" + id).show();
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);

                $("#" + id).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $('#' + id).unblock();
            }
        }
        //}
    });
    $('#' + id).unblock();
}


// All user free with check box
//function fnBindFullUserTreeWithCheckBox(id) {
//    debugger;
//    $.ajax({
//        type: "POST",
//        url: 'Master/GenerateFullUserTreeNew',
//        data: "A",
//        success: function (jsData) {
//            if (jsData != '') {
//                strTree = jsData;
//                $("#" + id).html(' ');
//                $('#' + id).dynatree('destroy');
//                $('#' + id).empty();
//                $("#" + id).html(strTree);
//                var clickStatus = new Boolean();

//                $("#" + id).dynatree({
//                    checkbox: true,
//                    onActivate: function (node) {
//                        fnUserTreeNodeClick(node);
//                    },
//                    onClick: function (node, event) {
//                        // Close menu on click
//                        if ($(".contextMenu:visible").length > 0) {
//                            $(".contextMenu").hide();
//                        }
//                    },
//                    onCreate: function (node, span) {
//                        bindUserContextMenu(span);
//                    },
//                    onSelect: function (select, node) {
//                        // Get a list of all selected nodes, and convert to a key array:
//                        fnUserTreeSelect(select, node);
//                        clickStatus = select;
//                    },
//                    onKeydown: function (node, event) {
//                        // Eat keyboard events, when a menu is open

//                    },
//                    onDeactivate: function (node) {
//                    },
//                    strings: {
//                        loading: "Loading…",
//                        loadError: "Load error!"
//                    },
//                    onDblClick: function (node, event) {
//                        try {
//                            inEventHandler = true;
//                            node.visit(function (childNode) {
//                                childNode.select(clickStatus);
//                            });
//                        } finally {
//                            inEventHandler = false;
//                        }

//                    },
//                    onPostInit: function (node, event) {
//                        fnUserTreePostInit(node);
//                    }
//                });
//                $("#dvAjaxLoad").hide();
//            }
//        }
//    });
//}

// **********************************************************End **********************************************************

// ---User Contextmenu helper --------------------------------------------------
function bindUserContextMenu(span) {
    // Add context menu to this node:
    $(span).contextMenu({ menu: "userConMenu" }, function (action, el, pos) {
        // The event was bound to the <span> tag, but the node object
        // is stored in the parent <li> tag
        var node = $.ui.dynatree.getNode(el);
        switch (action) {
            case "deleteuser":
                fnChangeUserStatus(action, node);
                break;
            case "adduser":
                fnAddChildUser(action, node);
                break;
            case "usermoveup":
                fnMoveUserTreeUp(action, node);
                break;
            case "usermovedown":
                fnMoveUserTreeDown(action, node);
                break;
            case "changeuser":
                fnChangeUserHierarchyPopUp(action, node);
                break;
            default:

        }
    });
};

function fnBindUserTreeWithCheckBox(id) {
    $.blockUI();
    // $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateUserTree',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);
                var clickStatus = new Boolean();

                $("#" + id).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        clickStatus = select;
                        //if (!select) {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                        //else {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        try {
                            inEventHandler = true;
                            node.visit(function (childNode) {
                                childNode.select(clickStatus);
                            });
                        } finally {
                            inEventHandler = false;
                        }
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        }
    });
}
function fnBindUserTreeWithCheckBoxDoubleClick(id) {
    // $.blockUI();
    // $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateUserTree',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);
                var clickStatus = new Boolean();

                $("#" + id).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        //// Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        clickStatus = select;
                        //if (!select) {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                        //else {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        //fnUserTreeNodeDblClick(node);
                        //fnRegionTreeNodeClick(node);
                        //node.select(true);
                        try {
                            inEventHandler = true;
                            node.visit(function (childNode) {
                                childNode.select(clickStatus);
                            });
                        } finally {
                            inEventHandler = false;
                        }
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        }
    });
}

//***************************** Last Submitted Report New Tree with Employee Name********************************************

function fnBindUserTreeWithCheckBoxDoubleClickNew(id) {
    // $.blockUI();
    // $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateUserTreeNew',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);
                var clickStatus = new Boolean();

                $("#" + id).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        //// Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        clickStatus = select;
                    },
                    onKeydown: function (node, event) {

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        try {
                            inEventHandler = true;
                            node.visit(function (childNode) {
                                childNode.select(clickStatus);
                            });
                        } finally {
                            inEventHandler = false;
                        }
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        }
    });
}
// All user free with check box
function fnBindFullUserTreeWithCheckBox(id) {
    $.ajax({
        type: "POST",
        url: 'Master/GenerateFullUserTree',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);
                var clickStatus = new Boolean();

                $("#" + id).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        clickStatus = select;
                        //if (!select) {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                        //else {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        // fnUserTreeNodeDblClick(node);
                        //node.select(true);
                        try {
                            inEventHandler = true;
                            node.visit(function (childNode) {
                                childNode.select(clickStatus);
                            });
                        } finally {
                            inEventHandler = false;
                        }

                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        }
    });
}

function fnBindUserTypeTree(id) {
    $.ajax({
        type: "POST",
        url: '../../Master/GetUserTypeMasterTreeDetails',
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            data = jsData;
            if (jsData.Tables[0].Rows.length > 0) {
                strTreeUserType = "<ul  id='home' item-expanded='true'  >";
                var stUserTypeCode = jsData.Tables[0].Rows[0].User_Type_Code
                var strUserTypeName = jsData.Tables[0].Rows[0].User_Type_Name;

                strTreeUserType += "<li id='" + stUserTypeCode + "'  class='expanded' >" + strUserTypeName;

                var parentJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + stUserTypeCode + "')]");
                if (parentJson != false && parentJson.length > 0) {
                    strTreeUserType += "<ul >";

                    for (var i = 0; i < parentJson.length; i++) {
                        var disJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + parentJson[i].User_Type_Code + "')]");

                        //if (disJson != false && disJson.length > 1) {
                        //    strTreeUserType += "<ul >";
                        //}
                        strTreeUserType += "<li id='" + parentJson[i].User_Type_Code + "'  class='expanded' >" + parentJson[i].User_Type_Name + "";

                        if (disJson != false && disJson.length > 0) {
                            strTreeUserType += "<ul >";
                            fnUserTypeSubMenu(jsData, parentJson[i].User_Type_Code);
                            strTreeUserType += "</ul>";
                        }
                        strTreeUserType += "</li>";

                        //if (disJson != false && disJson.length > 1) {
                        //    strTreeUserType += "</ul>";
                        //}
                    }
                    strTreeUserType += "</ul>";
                }

                strTreeUserType += "</li></ul>";

                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTreeUserType);
                $("#" + id).dynatree({

                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTypeTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTypeTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTypeTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        }
    });
}

function fnUserTypeSubMenu(jsonData, parentId) {
    var dJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + parentId + "')]");
    if (dJson != false) {
        for (var j = 0; j < dJson.length; j++) {
            strTreeUserType += "<li id='" + dJson[j].User_Type_Code + "' class='expanded' >" + dJson[j].User_Type_Name;

            var dsJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + dJson[j].User_Type_Code + "')]");
            if (dsJson != false && dsJson.length > 0) {
                strTreeUserType += "<ul >";
                fnUserTypemenu(jsonData, dJson[j].User_Type_Code);
                strTreeUserType += "</ul>";
            }
            strTreeUserType += "</li>";
        }
    }
}

function fnUserTypemenu(jsonData, parentId) {
    var dJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + parentId + "')]");
    if (dJson != false) {
        for (var j = 0; j < dJson.length; j++) {
            strTreeUserType += "<li id='" + dJson[j].User_Type_Code + "' class='expanded' >" + dJson[j].User_Type_Name;

            var dsJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + dJson[j].User_Type_Code + "')]");
            if (dsJson != false && dsJson.length > 0) {
                strTreeUserType += "<ul >";
                fnUserTypemenu(jsonData, dJson[j].User_Type_Code);
                strTreeUserType += "</ul>";
            }
            strTreeUserType += "</li>";
        }
    }
}



function fnBindUserTypeTreeWithCheckbox(id) {
    $.ajax({
        type: "POST",
        url: '../../Master/GetUserTypeMasterTreeDetails',
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            data = jsData;
            if (jsData.Tables[0].Rows.length > 0) {
                strTreeUserType = "<ul  id='home' item-expanded='true'  >";
                var stUserTypeCode = jsData.Tables[0].Rows[0].User_Type_Code
                var strUserTypeName = jsData.Tables[0].Rows[0].User_Type_Name;

                strTreeUserType += "<li id='" + stUserTypeCode + "'  class='expanded' >" + strUserTypeName;

                var parentJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + stUserTypeCode + "')]");
                if (parentJson != false && parentJson.length > 0) {
                    strTreeUserType += "<ul >";

                    for (var i = 0; i < parentJson.length; i++) {
                        var disJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + parentJson[i].User_Type_Code + "')]");

                        //if (disJson != false && disJson.length > 1) {
                        //    strTreeUserType += "<ul >";
                        //}
                        strTreeUserType += "<li id='" + parentJson[i].User_Type_Code + "'  class='expanded' >" + parentJson[i].User_Type_Name + "";

                        if (disJson != false && disJson.length > 0) {
                            strTreeUserType += "<ul >";
                            fnUserTypeSubMenu(jsData, parentJson[i].User_Type_Code);
                            strTreeUserType += "</ul>";
                        }
                        strTreeUserType += "</li>";

                        //if (disJson != false && disJson.length > 1) {
                        //    strTreeUserType += "</ul>";
                        //}
                    }
                    strTreeUserType += "</ul>";
                }

                strTreeUserType += "</li></ul>";

                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTreeUserType);
                $("#" + id).dynatree({

                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTypeTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnUserTypeTreeSelect(select, node);
                        if (!select) {
                            node.visit(function (node) {
                                node.select(false);
                            });
                        }
                        else {
                            node.visit(function (node) {
                                node.select(false);
                            });
                        }
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTypeTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTypeTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        }
    });
}

function fnDisabledUserTree(id) {
    $.ajax({
        type: 'POST',
        url: 'Master/GetDisabledUsers',
        data: '',
        success: function (response) {
            $("#" + id).html(response);
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        },
        complete: function () {
        }
    });

}

//function fnGetUserTreeByUser(userCode, treeId, filterId) {
//    if (userCode == "") {
//        userCode = curUserCode_g;
//    }
//    //if (userCode == curUserCode_g) {
//    //    $('#dvPreviousNode').hide();
//    //}
//    //else {
//    //    $('#dvPreviousNode').show();
//    //}
//    $.ajax({
//        type: "POST",
//        url: 'Master/UserTreeGenerationByUserCode',
//        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
//        success: function (jsData) {
//            if (jsData != '') {
//                $('#' + filterId).hide();
//                $("#" + treeId).show();
//                strTree = jsData;
//                $("#" + treeId).html(' ');
//                $('#' + treeId).dynatree('destroy');
//                $('#' + treeId).empty();
//                $("#" + treeId).html(strTree);

//                $("#" + treeId).dynatree({
//                    checkbox: false,
//                    onActivate: function (node) {
//                        fnUserTreeNodeClick(node);
//                    },
//                    onClick: function (node, event) {
//                        // Close menu on click
//                        if ($(".contextMenu:visible").length > 0) {
//                            $(".contextMenu").hide();
//                        }
//                    },
//                    onCreate: function (node, span) {
//                        bindUserContextMenu(span);
//                    },
//                    onKeydown: function (node, event) {
//                        // Eat keyboard events, when a menu is open

//                    },
//                    onDeactivate: function (node) {
//                    },
//                    strings: {
//                        loading: "Loading…",
//                        loadError: "Load error!"
//                    },
//                    onDblClick: function (node, event) {
//                        fnUserTreeNodeDblClick(node);
//                    },
//                    onPostInit: function (node, event) {
//                        fnUserTreePostInit(node);
//                    }
//                });
//                $("#dvAjaxLoad").hide();
//                if ($("#" + treeId).dynatree("getTree").tnRoot.childList[0].data.key == curUserCode_g) {
//                    $('#dvPreviousNode').hide();
//                }
//                else {
//                    $('#dvPreviousNode').show();
//                }
//            }
//        }
//        //}
//    });
//}
function fnGetUserTreeByUserWithOnelevelParentmethod(userCode, treeId, filterId) {
    debugger;
    // var userCode = $("#dvRegionTree").dynatree("getTree").tnRoot.childList[0].data.key;
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode',
        data: "userCode=" + userCode + "&includeOneLevelParent=YES",
        success: function (jsData) {
            if (jsData != '') {
                if (userCode == curUserCode_g) {
                    $('#dvPreviousNode').hide();
                }
                else {
                    $('#dvPreviousNode').show();
                }
                $('#' + filterId).hide();
                $("#" + treeId).show();
                var strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(e.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                //if ($("#" + treeId).dynatree("getTree").tnRoot.childList[0].data.key == curUserCode_g) {
                //    $('#dvPreviousNode').hide();
                //}
                //else {
                //    $('#dvPreviousNode').show();
                //}
                // $('.parent').click(fnClick(this));
                $("span.parent").live("click", function (e) {
                    // alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildNodesnewwithcheckbox(e.target);
                });
                var first_levelusercode = $("#dvUserTree").dynatree("getRoot").getChildren()[0].data.key;
                if (first_levelusercode == curUserCode_g) {
                    $('#dvPreviousNode').hide();
                }
                else {
                    $('#dvPreviousNode').show();
                }
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}

function fnGetUserTreeByUserWithOnelevelParent(userCode, treeId, filterId) {
    debugger;
    // var userCode = $("#dvRegionTree").dynatree("getTree").tnRoot.childList[0].data.key;
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode',
        data: "userCode=" + userCode + "&includeOneLevelParent=YES",
        success: function (jsData) {
            if (jsData != '') {
                if (userCode == curUserCode_g) {
                    $('#dvPreviousNode').hide();
                }
                else {
                    $('#dvPreviousNode').show();
                }
                $('#' + filterId).hide();
                $("#" + treeId).show();
                var strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(e.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                //if ($("#" + treeId).dynatree("getTree").tnRoot.childList[0].data.key == curUserCode_g) {
                //    $('#dvPreviousNode').hide();
                //}
                //else {
                //    $('#dvPreviousNode').show();
                //}
                // $('.parent').click(fnClick(this));
                $("span.parent").live("click", function (e) {
                    // alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildNodes(e.target);
                });
                var first_levelusercode = $("#dvUserTree").dynatree("getRoot").getChildren()[0].data.key;
                if (first_levelusercode == curUserCode_g) {
                    $('#dvPreviousNode').hide();
                }
                else {
                    $('#dvPreviousNode').show();
                }
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}
function fnGetUserTreeByUserWithOnelevelParentwithcheckbox(userCode, treeId, filterId) {
    debugger;
    // var userCode = $("#dvRegionTree").dynatree("getTree").tnRoot.childList[0].data.key;
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode',
        data: "userCode=" + userCode + "&includeOneLevelParent=YES",
        success: function (jsData) {
            if (jsData != '') {
                if (userCode == curUserCode_g) {
                    $('#dvPreviousNode').hide();
                }
                else {
                    $('#dvPreviousNode').show();
                }
                $('#' + filterId).hide();
                $("#" + treeId).show();
                var strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(e.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                //if ($("#" + treeId).dynatree("getTree").tnRoot.childList[0].data.key == curUserCode_g) {
                //    $('#dvPreviousNode').hide();
                //}
                //else {
                //    $('#dvPreviousNode').show();
                //}
                // $('.parent').click(fnClick(this));
                $("span.parent").live("click", function (e) {
                    // alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildNodesnewwithcheckbox(e.target);
                });
                var first_levelusercode = $("#dvUserTree").dynatree("getRoot").getChildren()[0].data.key;
                if (first_levelusercode == curUserCode_g) {
                    $('#dvPreviousNode').hide();
                }
                else {
                    $('#dvPreviousNode').show();
                }
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}
function fnGetUserTreeByUserWithOnelevelParentNew(userCode, treeId, filterId) {
    debugger;
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode_New',
        data: "userCode=" + userCode + "&includeOneLevelParent=YES",
        success: function (jsData) {
            debugger;
            if (jsData != '') {
                if (userCode == curUserCode_g) {
                    $('#dvPreviousNode').hide();

                }
                else {
                    $('#dvPreviousNode').show();

                }
                $('#' + filterId).hide();
                $("#" + treeId).show();
                var strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(e.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $("span.parent").live("click", function (e) {
                    // alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildNodes(e.target);
                });
                var first_levelusercode = $("#dvUserTree").dynatree("getRoot").getChildren()[0].data.key;
                if (first_levelusercode == curUserCode_g) {
                    $('#dvPreviousNode').hide();
                }
                else {
                    $('#dvPreviousNode').show();
                }
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}



function fnGetUsersByUserName(userName, treeId, filterId) {
    $.ajax({
        type: "POST",
        url: 'Master/GetUsersByUserName',
        data: "userName=" + userName + "&treeId=" + treeId + "&filterId=" + filterId + "",
        success: function (result) {
            if (result != "") {
                $('#dvFilteredNode').html(result);
                $('#' + treeId).hide();
                $('#' + filterId).show();

            }
            else {
                fnGenerateUserTree("dvUserTree");
                $('#' + treeId).show();
                $('#' + filterId).hide();
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}

function fnGetUsersByUserNameEmployeeName(userName, treeId, filterId) {
    debugger;
    $.ajax({
        type: "POST",
        url: 'Master/GetUsersByUserNameEmployeeName',
        data: "userName=" + userName + "&treeId=" + treeId + "&filterId=" + filterId + "",
        success: function (result) {
            debugger;
            if (result != "") {
                $('#' + filterId).html(result);
                $('#' + treeId).hide();
                $('#' + filterId).show();

            }
            else {
                debugger;
                fnGenerateUserTree("dvUserTree");
                $('#' + treeId).show();
                $('#' + filterId).hide();
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function fnGetUserTreeByUser(userCode, treeId, filterId) {
    debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }
    if (userCode == curUserCode_g) {
        $('#dvPreviousNode').hide();
    }
    else {
        $('#dvPreviousNode').show();
    }
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            if (jsData != '') {
                $('#' + filterId).hide();
                $("#" + treeId).show();
                strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(event.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    //onLazyRead: function (node) {
                    //    // In real life we would call something like this:

                    //    // .. but here we use a local file instead:
                    //    //node.appendAjax({
                    //    //    url: "sample-data2.json",
                    //    //    // We don't want the next line in production code:
                    //    //    debugLazyDelay: 750
                    //    //});
                    //    fnAddNode(node);
                    //},
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $("span.childIcon").unbind("click");
                $("span.childIcon").live("click", function (e) {
                    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildNodes(e.target);
                });
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}
function fnGetUserTreeByUserwithcheckbox(userCode, treeId, filterId) {
    debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }
    if (userCode == curUserCode_g) {
        $('#dvPreviousNode').hide();
    }
    else {
        $('#dvPreviousNode').show();
    }
    $('span').removeClass('childIcon');
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            if (jsData != '') {
                $('#' + filterId).hide();
                $("#" + treeId).show();
                strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(event.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onSelect: function (select, node) {
                        //// Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                    },
                    //onLazyRead: function (node) {
                    //    // In real life we would call something like this:

                    //    // .. but here we use a local file instead:
                    //    //node.appendAjax({
                    //    //    url: "sample-data2.json",
                    //    //    // We don't want the next line in production code:
                    //    //    debugLazyDelay: 750
                    //    //});
                    //    fnAddNode(node);
                    //},
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $("span.childIcon").unbind("click");
                $("span.childIcon").live("click", function (e) {
                    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildNodes(e.target);
                });
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}

function fnGetUserTreeByUserNew(userCode, treeId, filterId) {
    debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }



    if (userCode == curUserCode_g) {
        $('#dvPreviousNode').hide();
        $(".dynatree-expander").hide();
        $(".dynatree-icon").hide();
    }
    else {
        $('#dvPreviousNode').show();
        $(".dynatree-expander").show();
        $(".dynatree-icon").show();
    }
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode_New',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            if (jsData != '') {
                $('#' + filterId).hide();
                $("#" + treeId).show();
                strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },

                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(event.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}

                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },

                    //onLazyRead: function (node) {
                    //    // In real life we would call something like this:

                    //    // .. but here we use a local file instead:
                    //    //node.appendAjax({
                    //    //    url: "sample-data2.json",
                    //    //    // We don't want the next line in production code:
                    //    //    debugLazyDelay: 750
                    //    //});
                    //    fnAddNode(node);
                    //},
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });

                $("#dvAjaxLoad").hide();
                $("span.childIcon").unbind("click");
                $("span.childIcon").live("click", function (e) {
                    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildNodes(e.target);
                });
                var dynamicStyle = $("#dynamicStyle").html();
                $("#dynamicStyle").html(dynamicStyle);
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}
function fnGetUserTreeByUserNewmethod(userCode, treeId, filterId) {
    debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }



    if (userCode == curUserCode_g) {
        $('#dvPreviousNode').hide();
        $(".dynatree-expander").hide();
        $(".dynatree-icon").hide();
    }
    else {
        $('#dvPreviousNode').show();
        $(".dynatree-expander").show();
        $(".dynatree-icon").show();
    }
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode_Newmethod',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            if (jsData != '') {
                $('#' + filterId).hide();
                $("#" + treeId).show();
                strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },

                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(event.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}

                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },

                    //onLazyRead: function (node) {
                    //    // In real life we would call something like this:

                    //    // .. but here we use a local file instead:
                    //    //node.appendAjax({
                    //    //    url: "sample-data2.json",
                    //    //    // We don't want the next line in production code:
                    //    //    debugLazyDelay: 750
                    //    //});
                    //    fnAddNode(node);
                    //},
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });

                $("#dvAjaxLoad").hide();
                $("span.childIcon").removeClass("childIcon");
                //$("span.childIcon").unbind("click");
                //$("span.childIcon").live("click", function (e) {
                //    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                //    fnShowChildNodes(e.target);
                //});
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}
function fnGetUserTreeByUserNewExceptloginuser(userCode, treeId, filterId) {
    debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }
    if (userCode == curUserCode_g) {
        $('#dvPreviousNode').hide();
    }
    else {
        $('#dvPreviousNode').show();
    }
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode_NewExceptloginuser',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            if (jsData != '') {
                $('#' + filterId).hide();
                $("#" + treeId).show();
                strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(event.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    //onLazyRead: function (node) {
                    //    // In real life we would call something like this:

                    //    // .. but here we use a local file instead:
                    //    //node.appendAjax({
                    //    //    url: "sample-data2.json",
                    //    //    // We don't want the next line in production code:
                    //    //    debugLazyDelay: 750
                    //    //});
                    //    fnAddNode(node);
                    //},
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $("span.childIcon").unbind("click");
                $("span.childIcon").live("click", function (e) {
                    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildNodes(e.target);
                });
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}
function fnExpandCollapseUserTree(treeExpandLevel, mainDivId, treeNavId, obj, mainReptId, treeId) {
    //leftNav
    $('#' + treeNavId).show();

    if (treeExpandLevel == 0) {
        $('#' + mainDivId).show();
        $(obj).removeAttr('title');
        $('#' + mainDivId).removeClass('col-xs-5');
        $('#' + mainDivId).addClass('col-xs-3');
        $('#' + treeId).show();
        $('#' + mainReptId).removeClass('col-xs-7');
        $('#' + mainReptId).addClass('col-xs-9');
        $("#spnTreeToggle").html('Hide Tree');
        treeExpandLevel = treeExpandLevel + 1;
        $(obj).attr('title', 'Click here to expand tree');
        $(obj).html('<i class="fa fa-chevron-circle-right fa-lg"></i>');
    }
    else if (treeExpandLevel == 1) {
        $('#' + mainDivId).show();
        $(obj).removeAttr('title');
        $('#' + mainDivId).removeClass('col-xs-3');
        $('#' + mainDivId).addClass('col-xs-4');
        $('#' + treeId).show();
        $('#' + mainReptId).removeClass('col-xs-9');
        $('#' + mainReptId).addClass('col-xs-8');
        $("#spnTreeToggle").html('Hide Tree');
        treeExpandLevel = treeExpandLevel + 1;
        $(obj).attr('title', 'Click here to expand tree');
        $(obj).html('<i class="fa fa-chevron-circle-right fa-lg"></i>');
    }
    else if (treeExpandLevel == 2) {
        $('#' + mainDivId).show();
        $(obj).removeAttr('title');

        $('#' + mainDivId).removeClass('col-xs-4');
        $('#' + mainDivId).addClass('col-xs-5');
        $('#' + treeId).show();
        $('#' + mainReptId).removeClass('col-xs-8');
        $('#' + mainReptId).addClass('col-xs-7');
        $("#spnTreeToggle").html('Hide Tree');
        treeExpandLevel = treeExpandLevel + 1;
        $(obj).html('<i class="fa fa-chevron-circle-left fa-lg"></i>');
        $(obj).attr('title', 'Click here to collapse tree');

    }
    else {
        $('#' + mainDivId).removeClass('col-xs-5');
        $('#' + mainDivId).removeClass('col-xs-4');
        $('#' + mainDivId).removeClass('col-xs-3');

        $('#' + treeId).hide();


        $('#' + mainReptId).removeClass('col-xs-7');
        $('#' + mainReptId).removeClass('col-xs-8');
        $('#' + mainReptId).removeClass('col-xs-9');
        $('#' + mainReptId).addClass('col-xs-11');
        $("#spnTreeToggle").html('Show Tree');

        $(obj).removeAttr('title');
        //  $('#' + mainDivId).hide();
        // $('#' + treeNavId).hide();
        $(obj).removeAttr('title');
        treeExpandLevel = -1;
        $(obj).html('<i class="fa fa-chevron-circle-right fa-lg"></i>');
        $(obj).attr('title', 'Click here to expand tree');
    }
}

function fnLoaduserDynaTree(userCode, treeId, filterId) {
    $.ajax({
        type: "POST",
        url: 'Master/GetUsersJson',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            if (jsData != '') {
                $("#" + treeId).dynatree({
                    title: "Lazy loading sample",
                    fx: { height: "toggle", duration: 200 },
                    autoFocus: false, // Set focus to first child, when expanding or lazy-loading.
                    // In real life we would call a URL on the server like this:
                    //          initAjax: {
                    //              url: "/getTopLevelNodesAsJson",
                    //              data: { mode: "funnyMode" }
                    //              },
                    // .. but here we use a local file instead:
                    initAjax: {
                        url: jsData
                    },

                    onActivate: function (node) {
                        $("#echoActive").text("" + node + " (" + node.getKeyPath() + ")");
                    },

                    onLazyRead: function (node) {
                        // In real life we would call something like this:
                        //              node.appendAjax({
                        //                  url: "/getChildrenAsJson",
                        //                data: {key: node.data.key,
                        //                       mode: "funnyMode"
                        //                         }
                        //              });
                        // .. but here we use a local file instead:
                        node.appendAjax({
                            url: "sample-data2.json",
                            // We don't want the next line in production code:
                            debugLazyDelay: 750
                        });
                    }
                });
            }
        }
    });
}


function fnShowFullTree(userCode, treeId, filterNodeId, checkBoxNeeded) {
    if (checkBoxNeeded == "YES") {
        fnBindUserTreeWithCheckBoxDoubleClick(treeId);
    }
    else {
        // fnGetUserTreeByUser(treeId);
        // fnGetUserTreeByUser(userCode, treeId, filterNodeId);
        fnBindUserTree(treeId, filterNodeId);
    }
}

function fnShowFullTreeNew(userCode, treeId, filterNodeId, checkBoxNeeded) {
    if (checkBoxNeeded == "YES") {
        fnBindUserTreeWithCheckBoxDoubleClickNew(treeId);
    }
    else {
        // fnGetUserTreeByUser(treeId);
        // fnGetUserTreeByUser(userCode, treeId, filterNodeId);
        fnBindUserTreeNew(treeId, filterNodeId);
    }
}

function fnShowFullTreeWithChecked(treeId, checkBoxNeeded) {
    if (checkBoxNeeded) {
        fnBindUserTreeWithCheckBoxDoubleClick(treeId);
    }
    else {
        fnBindUserTree(treeId);
    }
}

///////*********** checkbox tree *********************///////
function fnGetUserTreeByUserWithCheckBox(userCode, treeId, filterId) {
    debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }
    $('span').removeClass('childIcon');
    //if (userCode == curUserCode_g) {
    //    $('#dvPreviousNode').hide();
    //}
    //else {
    //    $('#dvPreviousNode').show();
    //}
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            if (jsData != '') {
                $('#' + filterId).hide();
                $("#" + treeId).show();
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(jsData);

                $("#" + treeId).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(event.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        if (!select) {
                            node.visit(function (node) {
                                node.select(true);
                            });
                        }
                        else {
                            node.visit(function (node) {
                                node.select(false);
                            });
                        }
                    },
                    onDblClick: function (node, event) {
                        node.select(true);
                        try {
                            inEventHandler = true;
                            node.visit(function (childNode) {
                                childNode.select(true);
                            });
                        } finally {
                            inEventHandler = false;
                        }
                        // fnAddNode(node);
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $("span.childIcon").unbind("click");
                $("span.childIcon").bind("click", function (e) {
                    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                    //fnShowChildNodes(e.target);
                    e.preventDefault();
                    fnAddNode(e);
                    return false;
                });
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}

function fnAddNode(obj) {
    var node = $.ui.dynatree.getNode(obj.target);
    if (!node.hasChildren()) {
        var code = $.ui.dynatree.getNode(obj.target).data.key;
        $.ajax({
            type: "POST",
            url: 'Master/GetImmediateChildUsers',
            data: "userCode=" + code,
            success: function (jsData) {
                if (jsData != '') {
                    var jsonFormat = "[";
                    for (var i = 0; i < jsData.length; i++) {
                        var userDetails = jsData[i].User_Name + "," + jsData[i].User_Type_Name + '(' + jsData[i].Region_Name + ')';

                        if (jsData[i].Child_User_Count > 1) {
                            jsonFormat += "{title:" + '"' + "" + userDetails + "" + '",'
                                           + "key:" + '"' + "" + jsData[i].User_Code + "" + '",'
                                           + "addClass:" + '"' + "childIcon" + '"' + "}";
                        }
                        else {
                            jsonFormat += "{title:" + '"' + "" + userDetails + "" + '",' + "key:" + '"' + "" + jsData[i].User_Code + "" + '"' + "}";
                        }
                        if (i < jsData.length - 1) {
                            jsonFormat += ",";
                        }
                    }
                    jsonFormat += "];";
                    var treeJson = eval(jsonFormat);
                    if (treeJson != null) {
                        node.addChild(treeJson);
                    }
                    node.expand();
                    $("span.childIcon").unbind("click");
                    $("span.childIcon").bind("click", function (e) {
                        e.preventDefault();
                        fnAddNode(e);
                        return false;
                    });

                }

            }
        });
    }
    return false;
}
function fnBindAllUserTreeWithCheckBox(id, isChecked) {
    // $.blockUI();
    // $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateUserTree',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);

                $("#" + id).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        if (!select) {
                            node.visit(function (node) {
                                node.select(false);
                            });
                        }
                        else {
                            node.visit(function (node) {
                                node.select(false);
                            });
                        }
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node, isChecked, id);
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}

function fnGetUsersByUserNameWithCheckBox(userName, treeId, filterId) {
    $.ajax({
        type: "POST",
        url: 'Master/GetUsersByUserNameWithCheckBox',
        data: "userName=" + userName + "&treeId=" + treeId + "&filterId=" + filterId + "",
        success: function (result) {
            if (result != "") {
                $('#dvFilteredNode').html(result);
                $('#' + treeId).hide();
                $('#' + filterId).show();

            }
            else {
                fnGetUserTreeByUserWithCheckBox("", "dvUserTree", filterId);
                $('#' + treeId).show();
                $('#' + filterId).hide();
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
///////*********** check box tree end ***************///////


//////***********Start - Tree Without Checkbox - New********//////
//Tree Position
function fnTreePosiition(id) {
    var tblContent = "";
    tblContent += "<div id='treeNav'>";
    tblContent += "<div id='dvNodeSearch'>";
    tblContent += "<div class='input-group col-xs-8'>";
    tblContent += "<input type='text' id='txtSearchNode' placeholder='Search' autocomplete='off' value='' class='form-control'/>";
    tblContent += "<span class='input-group-addon' onclick='fnSearchUsers();'><i class='fa fa-search'></i></span></div>";
    tblContent += "<span onclick='fnShowFullTreeClick();' id='dvFullTree' class='pull-right' style='margin-right: 4%;cursor:pointer;' title='Click here to show all users'><i class='fa fa-th-list fa-2'></i></span>";
    tblContent += "<span onclick='fnLoadInitialTree();' id='dvLoadTree' class='pull-right' style='display: none; margin-right: 4%;cursor:pointer;' title='Click here to show all users' ><i class='fa fa-th-list fa-2'></i></span>";
    tblContent += "<div class='clearfix'></div></div>";
    tblContent += "<div id='dvFilteredNode' class='dvFilteredNode' style='display: none;'></div>";
    tblContent += "<div id='dvMainTree'>";
    tblContent += "<div id='dvPreviousNode' class='dvPreviousNode' onclick='fnBindUsersWithOneLevelParent();'>";
    tblContent += "<i class='fa fa-arrow-up '></i></div>";
    tblContent += "<div id='dvUserTree' class='dvNewUserTree'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/load.gif'/>Loading tree</div>";
    tblContent += "<div class='clearfix'></div>";
    tblContent += "</div></div>";
    $('#' + id).html(tblContent);
}


function fnTreePosiitionNew(id) {
    debugger;
    var tblContent = "";
    tblContent += "<div id='treeNav'>";
    tblContent += "<div id='dvNodeSearch'>";
    tblContent += "<div class='input-group col-xs-8'>";
    tblContent += "<input type='text' id='txtSearchNode' placeholder='Search' autocomplete='off' value='' class='form-control'/>";
    tblContent += "<span class='input-group-addon' onclick='fnSearchUsersNew();'><i class='fa fa-search'></i></span></div>";
    tblContent += "<span onclick='fnShowFullTreeClickNew();' id='dvFullTree' class='pull-right' style='margin-right: 4%;cursor:pointer;' title='Click here to show all users'><i class='fa fa-th-list fa-2'></i></span>";
    tblContent += "<span onclick='fnLoadInitialTreeNew();' id='dvLoadTree' class='pull-right' style='display: none; margin-right: 4%;cursor:pointer;' title='Click here to show all users' ><i class='fa fa-th-list fa-2'></i></span>";
    tblContent += "<div class='clearfix'></div></div>";
    tblContent += "<div id='dvFilteredNode' class='dvFilteredNode' style='display: none;'></div>";
    tblContent += "<div id='dvMainTree'>";
    tblContent += "<div id='dvPreviousNode' class='dvPreviousNode' onclick='fnBindUsersWithOneLevelParentNew();'>";
    tblContent += "<i class='fa fa-arrow-up '></i></div>";
    tblContent += "<div id='dvUserTree' class='dvNewUserTree'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/load.gif'/>Loading tree</div>";
    tblContent += "<div class='clearfix'></div>";
    tblContent += "</div></div>";
    $('#' + id).html(tblContent);
}
function fnTreePosiitionNewmethod(id) {
    debugger;
    var tblContent = "";
    tblContent += "<div id='treeNav'>";
    tblContent += "<div id='dvNodeSearch'>";
    tblContent += "<div class='input-group col-xs-8'>";
    tblContent += "<input type='text' id='txtSearchNode' placeholder='Search' autocomplete='off' value='' class='form-control'/>";
    tblContent += "<span class='input-group-addon' onclick='fnSearchUsersNew();'><i class='fa fa-search'></i></span></div>";
    tblContent += "<span onclick='fnShowFullTreeClickNewmethod();' id='dvFullTree' class='pull-right' style='margin-right: 4%;cursor:pointer;' title='Click here to show all users'><i class='fa fa-th-list fa-2'></i></span>";
    tblContent += "<span onclick='fnLoadInitialTreeNewmethod();' id='dvLoadTree' class='pull-right' style='display: none; margin-right: 4%;cursor:pointer;' title='Click here to show all users' ><i class='fa fa-th-list fa-2'></i></span>";
    tblContent += "<div class='clearfix'></div></div>";
    tblContent += "<div id='dvFilteredNode' class='dvFilteredNode' style='display: none;'></div>";
    tblContent += "<div id='dvMainTree'>";
    tblContent += "<div id='dvPreviousNode' class='dvPreviousNode' onclick='fnBindUsersWithOneLevelParentNew();'>";
    tblContent += "<i class='fa fa-arrow-up '></i></div>";
    tblContent += "<div id='dvUserTree' class='dvNewUserTree'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/load.gif'/>Loading tree</div>";
    tblContent += "<div class='clearfix'></div>";
    tblContent += "</div></div>";
    $('#' + id).html(tblContent);
}
function fnSearchUsers() {
    debugger;
    if ($.trim($('#txtSearchNode').val()) == '') {
        fnGetUserTreeByUser(currentUserCode_g, "dvUserTree", "dvFilteredNode");
    }
    else {
        fnGetUsersByUserName($('#txtSearchNode').val(), "dvUserTree", "dvFilteredNode");
    }
}
function fnSearchUserswithchechbox() {
    debugger;
    if ($.trim($('#txtSearchNode').val()) == '') {
        fnGetUserTreeByUserwithcheckbox(currentUserCode_g, "dvUserTree", "dvFilteredNode");
    }
    else {
        fnGetUsersByUserName($('#txtSearchNode').val(), "dvUserTree", "dvFilteredNode");
    }
}

function fnBindUsersWithOneLevelParent() {
    var userCode = $("#dvUserTree").dynatree("getTree").tnRoot.childList[0].data.key;
    fnGetUserTreeByUserWithOnelevelParent(userCode, "dvUserTree", "dvFilteredNode");
}

function fnBindUsersWithOneLevelParentmethod() {
    var userCode = $("#dvUserTree").dynatree("getTree").tnRoot.childList[0].data.key;
    fnGetUserTreeByUserWithOnelevelParentmethod(userCode, "dvUserTree", "dvFilteredNode");
}


function fnShowChildNodes(obj) {
    //  alert($.ui.dynatree.getNode(obj).data.key);
    fnGetUserTreeByUserWithOnelevelParent($.ui.dynatree.getNode(obj).data.key, "dvUserTree", "dvFilteredNode");
}
function fnShowChildNodesnewwithcheckbox(obj) {
    //  alert($.ui.dynatree.getNode(obj).data.key);
    fnGetUserTreeByUserWithOnelevelParentwithcheckbox($.ui.dynatree.getNode(obj).data.key, "dvUserTree", "dvFilteredNode");
}
function fnSearchUsersNew() {
    debugger;
    if ($.trim($('#txtSearchNode').val()) == '') {
        fnGetUserTreeByUserNew(currentUserCode_g, "dvUserTree", "dvFilteredNode");
    }
    else {
        fnGetUsersByUserNameEmployeeName($('#txtSearchNode').val(), "dvUserTree", "dvFilteredNode");
    }
}


function fnBindUsersWithOneLevelParentNew() {
    debugger;
    var userCode = $("#dvUserTree").dynatree("getTree").tnRoot.childList[0].data.key;
    fnGetUserTreeByUserWithOnelevelParentNew(userCode, "dvUserTree", "dvFilteredNode");
}

function fnShowChildNodesNew(obj) {
    debugger;
    //  alert($.ui.dynatree.getNode(obj).data.key);
    fnGetUserTreeByUserWithOnelevelParentNew($.ui.dynatree.getNode(obj).data.key, "dvUserTree", "dvFilteredNode");
}

function fnShowFullTreeClick() {
    debugger;
    $('#dvPreviousNode').hide();
    $('#dvFullTree').hide();
    $('#dvLoadTree').show();
    $('#dvLoadTree').attr("title", "Click here to show users");
    fnShowFullTree(currentUserCode_g, "dvUserTree", "dvFilteredNode", "NO");
}

function fnLoadInitialTree() {
    debugger;
    $('#dvFullTree').show();
    $('#dvLoadTree').hide();
    $('#dvFullTree').attr("title", "Click here to show all users");
    fnGetUserTreeByUser(currentUserCode_g, "dvUserTree", "dvFilteredNode");
}

function fnShowFullTreeClickNew() {
    debugger;
    $('#dvPreviousNode').hide();
    $('#dvFullTree').hide();
    $('#dvLoadTree').show();
    $('#dvLoadTree').attr("title", "Click here to show users");
    fnShowFullTreeNew(currentUserCode_g, "dvUserTree", "dvFilteredNode", "NO");
}
function fnShowFullTreeClickNewmethod() {
    debugger;
    $('#dvPreviousNode').hide();
    $('#dvFullTree').hide();
    $('#dvLoadTree').show();
    $('#dvLoadTree').attr("title", "Click here to show users");
    fnGetUserTreeByUserWithCheckBox(currentUserCode_g, "dvUserTree", "dvFilteredNode", "NO");
}
function fnLoadInitialTreeNew() {
    debugger;
    $('#dvFullTree').show();
    $('#dvLoadTree').hide();
    $('#dvFullTree').attr("title", "Click here to show all users");
    fnGetUserTreeByUserNew(currentUserCode_g, "dvUserTree", "dvFilteredNode");
}
function fnLoadInitialTreeNewmethod() {
    debugger;
    $('#dvFullTree').show();
    $('#dvLoadTree').hide();
    $('#dvFullTree').attr("title", "Click here to show all users");
    fnGetUserTreeByUserWithCheckBox(currentUserCode_g, "dvUserTree", "dvFilteredNode");
}
//////***********End - Tree Withour Checkbox - New********////////



////////*********************** Tree for In Chamber Effectiveness Start******************//////////
function fnfullUsertreeWithoutPrivilege(id) {
    debugger;
    //$('#' + id).block({
    //    message: '<h3>Loading...</h3>',
    //    css: { border: '1px solid #ddd' }
    //});
    // $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateUserTree',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                strTree = jsData;
                $("#" + id).html(' ');
                $('#' + id).dynatree('destroy');
                $('#' + id).empty();
                $("#" + id).html(strTree);
                var clickStatus = new Boolean();

                $("#" + id).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        clickStatus = select;
                        //if (!select) {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                        //else {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onDblClick: function (node, event) {
                        try {
                            inEventHandler = true;
                            node.visit(function (childNode) {
                                childNode.select(clickStatus);
                            });
                        } finally {
                            inEventHandler = false;
                        }
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    },
                    error: function () {
                        $('#' + id).unblock();
                    },
                    complete: function () {
                        $('#' + id).unblock();
                    }
                });
                $("#dvAjaxLoad").hide();
            }
        }
    });
}
// ---------------------- To follow the fashion of implementing common tree for various screen.

//var ObjUserTree = {
//    services: {
//        CheckBox: false
//    },
//    defaultTree: function (UserCode, ElementId) {

//    },
//    defaultTreeSearch: function (UserCode, ElementId, SearchKey) {
//        UserTreeService.BindTree()
//    },
//    checkBoxTree: function (UserCode, ElementId) {
//        UserTreeService.BindTree(ElementId, ObjUserTree.services);
//    },
//    checkBoxTreeSearch: function (UserCode, ElementId, SearchKey) {

//    },
//}

//var UserTreeService = {
//    BindTree: function (id, services) {
//        debugger;
//        var tblContent = "";
//        tblContent += "<div id='treeNav'>";
//        if (services.CheckBox == true) {
//            tblContent += "<div id='dvNodeSearch'>";
//            tblContent += "<div class='input-group col-xs-8'>";
//            tblContent += "<input type='text' id='txtSearchNode' placeholder='Search' class='form-control'/>";
//            tblContent += "<span class='input-group-addon' onclick='fnSearchUsersNew();'><i class='fa fa-search'></i></span></div>";
//            tblContent += "<span onclick='fnShowFullTreeClickNew();' id='dvFullTree' class='pull-right' style='margin-right: 4%;cursor:pointer;' title='Click here to show all users'><i class='fa fa-th-list fa-2'></i></span>";
//            tblContent += "<span onclick='fnLoadInitialTreeNew();' id='dvLoadTree' class='pull-right' style='display: none; margin-right: 4%;cursor:pointer;' title='Click here to show all users' ><i class='fa fa-th-list fa-2'></i></span>";
//            tblContent += "<div class='clearfix'></div></div>";
//            tblContent += "<div id='dvFilteredNode' class='dvFilteredNode' style='display: none;'></div>";
//        }
//        tblContent += "<div id='dvMainTree'>";
//        if (services.CheckBox == true) {
//            tblContent += "<div id='dvPreviousNode' class='dvPreviousNode' onclick='fnBindUsersWithOneLevelParentNew();'>";
//            tblContent += "<i class='fa fa-arrow-up '></i></div>";
//        }
//        tblContent += "<div id='dvUserTree' class='dvNewUserTree'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/load.gif'/>Loading tree</div>";
//        tblContent += "<div class='clearfix'></div>";
//        tblContent += "</div></div>";
//        $('#' + id).html(tblContent);
//    },
//    PopulateUserTree: function () {

//    }

//}

////////*********************** Tree for In Chamber Effectiveness End******************//////////