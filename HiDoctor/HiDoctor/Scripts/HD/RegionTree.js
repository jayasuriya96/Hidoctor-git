// Region Tree

var vacantArr = new Array();
function fnBindRegionTree(id, filterNodeId) {

    $("#" + id).html('');
    $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateRegionTree',
        data: "A",
        success: function (result) {
            $('#' + filterNodeId).hide();
            $("#" + id).show();

            $("#" + id).html(' ');
            $('#' + id).dynatree('destroy');
            $('#' + id).empty();
            $("#" + id).html(result);

            $("#" + id).dynatree({
                checkbox: false,
                ajaxDefaults: {
                    type: 'POST',
                    cache: false
                },
                onActivate: function (node) {
                    fnRegionTreeActivate(node);
                },
                onClick: function (node, event) {
                    // Close menu on click
                    if ($(".contextMenu:visible").length > 0) {
                        $(".contextMenu").hide();
                    }
                },
                onCreate: function (node, span) {
                    bindRegionContextMenu(span);
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
                    fnRegionTreeNodeClick(node);
                },
                onPostInit: function (node, event) {
                    fnRegionTreePostInit(node);
                },
                onExpand: function (select, dtnode) {
                    fnRegionTreeVacantNodeInit(select, dtnode, id);
                }
            });

            // vacant user background-color change                
            $("#" + id).dynatree("getRoot").visit(function (node) {
                debugger;
                //$(node.span.lastChild).addClass("tip");
                //if ($.inArray(node.data.key, vacantArr) > -1) {
                if (node.data.title.split('-')[1] == "NOT ASSIGNED" ) {
                    $(node.span).addClass('tree-node-assigned');
                }
                if (node.data.title.split('-')[1] == "VACANT") {
                    $(node.span).addClass('tree-node-vacant');
                }
                if (node.data.title.split('-')[1] == "TO BE VACANT") {
                    $(node.span).addClass('tree-node-tobevacant');
                }
                //}
            });

            //$(".tip").tooltip({ position: "center right", offset: [-2, 10], effect: "fade", opacity: 0.7 });
            $("#dvAjaxLoad").hide();

        }
    });
    //$(".tip").tooltip({ position: "center right", offset: [-2, 10], effect: "fade", opacity: 0.7 });
}

function fnRegionTreeVacantNodeInit(select, dtnode, id) {
    $("#" + id).dynatree("getRoot").visit(function (node) {
        if ($.inArray(node.data.key, vacantArr) > -1) {
            $(node.span).addClass('tree-node-vacant');
        }
    });
}
// ---Region Contextmenu helper --------------------------------------------------
function bindRegionContextMenu(span) {
    // Add context menu to this node:
    $(span).contextMenu({ menu: "regionConMenu" }, function (action, el, pos) {
        // The event was bound to the <span> tag, but the node object
        // is stored in the parent <li> tag
        var node = $.ui.dynatree.getNode(el);
        switch (action) {

            case "regiondelete":
                fnChangeRegionStatus(action, node);
                break;
            case "addregion":
                fnAddChildRegion(action, node);
                break;
            case "regionmoveup":
                fnMoveRegionTreeUp(action, node);
                break;
            case "regionmovedown":
                fnMoveRegionTreeDown(action, node);
                break;
            case "changeregion":
                fnChangeRegionHierarchy(action, node);
                break;
            case "regionUserAdd":
                fnShowAddUser(action, node);
                break;
            case "disableUser":
                fnShowDisableUsers(action, node);
                break;
            default:

        }
    });
};


function fnBindFullRegionTreeWithCheckbox(id) {
    $("#" + id).html('');
    $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateRegionFullTree',
        data: "A",
        success: function (result) {
            $("#" + id).html(' ');
            $('#' + id).dynatree('destroy');
            $('#' + id).empty();
            $("#" + id).html(result);
            var clickStatus = new Boolean();

            $("#" + id).dynatree({
                checkbox: true,
                ajaxDefaults: {
                    type: 'POST',
                    cache: false
                },
                onActivate: function (node) {
                    fnRegionTreeActivate(node);
                },
                onClick: function (node, event) {
                    // Close menu on click
                    if ($(".contextMenu:visible").length > 0) {
                        $(".contextMenu").hide();
                    }
                },
                onCreate: function (node, span) {
                    // bindRegionContextMenu(span);
                },
                onSelect: function (select, node) {
                    // Get a list of all selected nodes, and convert to a key array:
                    fnRegionTreeSelect(select, node);
                    clickStatus = select;
                    //clickStatus = select;
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
                dnd: {
                    onDragStart: function (node) {
                        //fnRegionTreeDragStart(node);
                        logMsg("tree.onDragStart(%o)", node);
                        return true;
                    },
                    onDragStop: function (node) {
                        // This function is optional.
                        logMsg("tree.onDragStop(%o)", node);
                    },
                    autoExpandMS: 1000,
                    preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                    onDragEnter: function (node, sourceNode) {
                        logMsg("tree.onDragEnter(%o, %o)", node, sourceNode);
                        return true;
                    },
                    onDragOver: function (node, sourceNode, hitMode) {
                        logMsg("tree.onDragOver(%o, %o, %o)", node, sourceNode, hitMode);
                        // Prevent dropping a parent below it's own child
                        if (node.isDescendantOf(sourceNode)) {
                            return false;
                        }
                        // Prohibit creating childs in non-folders (only sorting allowed)
                        if (!node.data.isFolder && hitMode === "over") {
                            return "after";
                        }
                    },
                    onDrop: function (node, sourceNode, hitMode, ui, draggable) {
                        sourceNode.move(node, hitMode);
                        //   fnRegionTreeDrop(node, sourceNode, hitMode, ui, draggable);
                        // expand the drop target
                        //        sourceNode.expand(true);
                    },
                    onDragLeave: function (node, sourceNode) {
                        logMsg("tree.onDragLeave(%o, %o)", node, sourceNode);
                    }
                },
                strings: {
                    loading: "Loading…",
                    loadError: "Load error!"
                },

                onDblClick: function (node, event) {
                    // fnRegionTreeNodeClick(node);
                    //node.select(true);
                    try {
                        inEventHandler = true;
                        node.visit(function (childNode) {
                            childNode.select(clickStatus);
                        });
                    } finally {
                        inEventHandler = false;
                    }

                    // fnRegionTreeNodeClick(node);
                    //fnRegionTreeSelect(node);
                    //if (select) {
                    //    node.visit(function (node) {
                    //        node.select(true);
                    //    });
                    //}
                    //else {
                    //    node.visit(function (node) {
                    //        node.select(false);
                    //    });
                    //}
                },
                onPostInit: function (node, event) {
                    fnRegionTreePostInit(node);
                },
                onExpand: function (select, dtnode) {
                    fnRegionTreeVacantNodeInit(select, dtnode, id);
                }
            });

            // vacant user background-color change                
            $("#" + id).dynatree("getRoot").visit(function (node) {
                //$(node.span.lastChild).addClass("tip");
                //   if ($.inArray(node.data.key, vacantArr) > -1) {
                if (node.data.title.split('-')[1] == "NOT ASSIGNED") {
                    $(node.span).addClass('tree-node-assigned');
                }
                if (node.data.title.split('-')[1] == "VACANT") {
                    $(node.span).addClass('tree-node-vacant');
                }
                if (node.data.title.split('-')[1] == "TO BE VACANT") {
                    $(node.span).addClass('tree-node-tobevacant');
                }
                //  }
            });
            $("#dvAjaxLoad").hide();
        }
        //}
    });
}



function fnBindRegionTreeWithCheckBox(id) {
    $("#" + id).html('');
    $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateRegionTree',
        data: "A",
        success: function (result) {
            $("#" + id).html(' ');
            $('#' + id).dynatree('destroy');
            $('#' + id).empty();
            $("#" + id).html(result);
            var clickStatus = new Boolean();

            $("#" + id).dynatree({
                checkbox: true,
                ajaxDefaults: {
                    type: 'POST',
                    cache: false
                },
                onActivate: function (node) {
                    fnRegionTreeActivate(node);
                },
                onSelect
                   : function (select, node) {
                       // Get a list of all selected nodes, and convert to a key array:
                       fnRegionTreeSelect(select, node);
                       clickStatus = select;
                       //if (!select) {
                       //    node.visit(function (node) {
                       //        node.select(false);
                       //    });
                       //}
                       //if (select) {
                       //    if (node.getParent() != null) {
                       //        node.getParent().select(true);
                       //        node.getParent().disabled = true; //make it unselectable
                       //    }
                       //}
                   },

                onClick: function (node, event) {
                    // Close menu on click
                    if ($(".contextMenu:visible").length > 0) {
                        $(".contextMenu").hide();
                    }
                },
                onCreate: function (node, span) {
                    bindRegionContextMenu(span);
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
                    fnRegionTreePostInit(node);
                },
                onExpand: function (select, dtnode) {
                    fnRegionTreeVacantNodeInit(select, dtnode, id);
                }
            });

            // vacant user background-color change                
            $("#" + id).dynatree("getRoot").visit(function (node) {
                //$(node.span.lastChild).addClass("tip");
                if (node.data.title.split('-')[1] == "NOT ASSIGNED") {
                    $(node.span).addClass('tree-node-assigned');
                }
                if (node.data.title.split('-')[1] == "VACANT") {
                    $(node.span).addClass('tree-node-vacant');
                }
                if (node.data.title.split('-')[1] == "TO BE VACANT") {
                    $(node.span).addClass('tree-node-tobevacant');
                }
            });

            //$(".tip").tooltip({ position: "center right", offset: [-2, 10], effect: "fade", opacity: 0.7 });
            $("#dvAjaxLoad").hide();
        }
        //  }
    });
    //$(".tip").tooltip({ position: "center right", offset: [-2, 10], effect: "fade", opacity: 0.7 });
}

function fnTreeWithChkBoxChildSelction(id) {
    $("#" + id).html('');
    //$("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateRegionTree',
        data: "A",
        success: function (result) {
            var clickStatus = new Boolean();
            $("#" + id).html(' ');
            $('#' + id).dynatree('destroy');
            $('#' + id).empty();
            $("#" + id).html(result);
            $("#" + id).dynatree({
                checkbox: true,
                ajaxDefaults: {
                    type: 'POST',
                    cache: false
                },
                onActivate: function (node) {
                    fnRegionTreeActivate(node);
                },
                onClick: function (node, event) {
                    // Close menu on click
                    if ($(".contextMenu:visible").length > 0) {
                        $(".contextMenu").hide();
                    }
                },
                onCreate: function (node, span) {
                    bindRegionContextMenu(span);
                },
                onKeydown: function (node, event) {
                    // Eat keyboard events, when a menu is open
                },
                onSelect
                    : function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnRegionTreeSelect(select, node);
                        clickStatus = select;
                        //if (!select) {
                        //    node.visit(function (node) {
                        //        node.select(false);
                        //    });
                        //}
                        //if (select) {
                        //    if (node.getParent() != null) {
                        //        node.getParent().select(true);
                        //        node.getParent().disabled = true; //make it unselectable
                        //    }
                        //}
                    },
                onDeactivate: function (node) {
                },
                strings: {
                    loading: "Loading…",
                    loadError: "Load error!"
                },
                dnd: {
                    onDragStart: function (node) {
                        fnRegionTreeDragStart(node);
                        logMsg("tree.onDragStart(%o)", node);
                        return true;
                    },
                    onDragStop: function (node) {
                        // This function is optional.
                        logMsg("tree.onDragStop(%o)", node);
                    },
                    autoExpandMS: 1000,
                    preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                    onDragEnter: function (node, sourceNode) {
                        logMsg("tree.onDragEnter(%o, %o)", node, sourceNode);
                        return true;
                    },
                    onDragOver: function (node, sourceNode, hitMode) {
                        logMsg("tree.onDragOver(%o, %o, %o)", node, sourceNode, hitMode);
                        // Prevent dropping a parent below it's own child
                        if (node.isDescendantOf(sourceNode)) {
                            return false;
                        }
                        // Prohibit creating childs in non-folders (only sorting allowed)
                        if (!node.data.isFolder && hitMode === "over") {
                            return "after";
                        }
                    },
                    onDrop: function (node, sourceNode, hitMode, ui, draggable) {
                        sourceNode.move(node, hitMode);
                        fnRegionTreeDrop(node, sourceNode, hitMode, ui, draggable);
                        // expand the drop target
                        //        sourceNode.expand(true);
                    },
                    onDragLeave: function (node, sourceNode) {
                        logMsg("tree.onDragLeave(%o, %o)", node, sourceNode);
                    }
                },
                strings: {
                    loading: "Loading…",
                    loadError: "Load error!"
                },
                onDblClick: function (node, event) {
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
                    fnRegionTreePostInit(node);
                },
                onExpand: function (select, dtnode) {
                    fnRegionTreeVacantNodeInit(select, dtnode, id);
                }

            });
            // vacant user background-color change                
            $("#" + id).dynatree("getRoot").visit(function (node) {
                //$(node.span.lastChild).addClass("tip");
                if (node.data.title.split('-')[1] == "NOT ASSIGNED") {
                    $(node.span).addClass('tree-node-assigned');
                }
                if (node.data.title.split('-')[1] == "VACANT") {
                    $(node.span).addClass('tree-node-vacant');
                }
                if (node.data.title.split('-')[1] == "TO BE VACANT") {
                    $(node.span).addClass('tree-node-tobevacant');
                }
            });
            //$("#dvAjaxLoad").hide();
        }

    });
}


//************REGION TREE -NEW START **********************//
//Tree Position
function fnRegionTreePosition(id) {
    var tblContent = "";
    tblContent += "<div id='treeNav'>";
    tblContent += "<div id='dvNodeSearch'>";
    tblContent += "<div class='input-group col-xs-8'>";
    tblContent += "<input type='text' id='txtSearchNode' placeholder='Search' class='form-control'/>";
    tblContent += "<span class='input-group-addon' onclick='fnSearchRegions();'><i class='fa fa-search'></i></span></div>";
    tblContent += "<span onclick='fnShowFullRegionTreeClick();' id='dvFullTree' class='pull-right' style='margin-right: 4%;cursor:pointer;' title='Click here to show all Regions'><i class='fa fa-th-list fa-2'></i></span>";
    tblContent += "<span onclick='fnLoadInitialRegionTree();' id='dvLoadTree' class='pull-right' style='display: none; margin-right: 4%;cursor:pointer;' title='Click here to show all Regions'><i class='fa fa-th-list fa-2'></i></span>";
    tblContent += "<div class='clearfix'></div></div>";
    tblContent += "<div id='dvFilteredNode' class='dvFilteredNode' style='display: none;'></div>";
    tblContent += "<div id='dvMainTree'>";
    tblContent += "<div id='dvPreviousNode' class='dvPreviousNode' onclick='fnBindRegionsWithOneLevelParent();'>";
    tblContent += "<i class='fa fa-arrow-up '></i></div>";
    tblContent += "<div id='dvRegionTree' class='dvNewRegionTree'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/load.gif'/>Loading tree</div>";
    tblContent += "<div class='clearfix'></div>";
    tblContent += "</div></div>";
    $('#' + id).html(tblContent);
}


//used to get Full Region Tree
function fnGetRegionTreeByRegion(regionCode, treeId, filterId) {
    if (regionCode == "") {
        regionCode = currentRegionCode_g;
    }
    if (regionCode == currentRegionCode_g) {
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
        url: 'Master/RegionTreeGenerationByRegionCode',
        data: "regionCode=" + regionCode + "&includeOneLevelParent=NO",
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
                        fnRegionTreeNodeClick(node);
                       
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
                        bindRegionContextMenu(span);
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
                        fnBindRegionTreeWithCheckBox(node);
                    },
                    onPostInit: function (node, event) {
                        fnRegionTreePostInit(node);
                    }
                });

                // vacant user background-color change                
                $("#" + treeId).dynatree("getRoot").visit(function (node) {
                    //$(node.span.lastChild).addClass("tip");
                    //if ($.inArray(node.data.key, vacantArr) > -1) {
                    if (node.data.title.split('-')[1] == "NOT ASSIGNED") {
                        $(node.span).addClass('tree-node-assigned');
                    }
                    if (node.data.title.split('-')[1] == "VACANT") {
                        $(node.span).addClass('tree-node-vacant');
                    }
                    if (node.data.title.split('-')[1] == "TO BE VACANT") {
                        $(node.span).addClass('tree-node-tobevacant');
                    }
                    //}
                });

                $("#dvAjaxLoad").hide();
                $("span.childIcon").unbind("click");
                $("span.childIcon").live("click", function (e) {
                    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildRegionNodes(e.target);
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
//Used to Load Full Region Tree
function fnLoadInitialRegionTree() {
    $('#dvFullTree').show();
    $('#dvLoadTree').hide();
    $('#dvLoadTree').attr("title", "Click here to show all Regions");
    fnGetRegionTreeByRegion(currentRegionCode_g, "dvRegionTree", "dvFilteredNode");
}
//Used to Add New Region Node
function fnAddRegionNode(obj) {
    var node = $.ui.dynatree.getNode(obj.target);
    if (!node.hasChildren()) {
        var code = $.ui.dynatree.getNode(obj.target).data.key;
        $.ajax({
            type: "POST",
            url: 'Master/GetImmediateChildRegions',
            data: "regionCode=" + code,
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
                        fnAddRegionNode(e);
                        return false;
                    });

                }

            }
        });
    }
    return false;
}
//Used to Get region Tree BY searching Region name
function fnSearchRegions() {
    if ($.trim($('#txtSearchNode').val()) == '') {
        fnGetRegionTreeByRegion(currentRegionCode_g, "dvRegionTree", "dvFilteredNode");
    }
    else {
        fnGetRegionsByRegionName($('#txtSearchNode').val(), "dvRegionTree", "dvFilteredNode");
    }
}

//function fnBindRegionWithOneLevelParent() {
//    var regionCode = $("#dvRegionTree").dynatree("getTree").tnRoot.childList[0].data.key;
//    fnGetRegionTreeByRegionWithOnelevelParent(regionCode, "dvRegionTree", "dvFilteredNode");
//}

function fnBindRegionsWithOneLevelParent() {
    var regionCode = $("#dvRegionTree").dynatree("getTree").tnRoot.childList[0].data.key;
    fnGetRegionTreeByRegionWithOnelevelParent(regionCode, "dvRegionTree", "dvFilteredNode");
}

function fnGetRegionTreeByRegionWithOnelevelParent(regionCode, treeId, filterId) {
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/RegionTreeGenerationByRegionCode',
        data: "regionCode=" + regionCode + "&includeOneLevelParent=YES",
        success: function (jsData) {
            if (jsData != '') {
                if (regionCode == currentRegionCode_g) {
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
                        fnRegionTreeNodeClick(node);
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
                        bindRegionContextMenu(span);
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
                        fnBindRegionTreeWithCheckBox(node);
                    },
                    onPostInit: function (node, event) {
                        fnRegionTreePostInit(node);
                    }
                });

                // vacant user background-color change                
                $("#" + treeId).dynatree("getRoot").visit(function (node) {
                    //$(node.span.lastChild).addClass("tip");
                    if (node.data.title.split('-')[1] == "NOT ASSIGNED") {
                        $(node.span).addClass('tree-node-assigned');
                    }
                    if (node.data.title.split('-')[1] == "VACANT") {
                        $(node.span).addClass('tree-node-vacant');
                    }
                    if (node.data.title.split('-')[1] == "TO BE VACANT") {
                        $(node.span).addClass('tree-node-tobevacant');
                    }
                });

                $("#dvAjaxLoad").hide();
                $("span.parent").live("click", function (e) {
                    // alert("Edit " + $.ui.dynatree.getNode(e.target));
                    fnShowChildRegionNodes(e.target);
                });
                var first_levelRegioncode = $("#dvRegionTree").dynatree("getTree").tnRoot.childList[0].data.key
                // var first_levelRegioncode = $("#dvRegionTree").dynatree("getRoot").getChildren()[0].data.key;
                if (first_levelRegioncode == currentRegionCode_g) {
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

function fnShowChildRegionNodes(obj) {
    //  alert($.ui.dynatree.getNode(obj).data.key);
    fnGetRegionTreeByRegionWithOnelevelParent($.ui.dynatree.getNode(obj).data.key, "dvRegionTree", "dvFilteredNode");
}

function fnShowFullRegionTree(regionCode, treeId, filterNodeId, checkBoxNeeded) {
    if (checkBoxNeeded == "YES") {
        fnBindFullRegionTreeWithCheckbox(treeId);
    }
    else {
        fnBindRegionTree(treeId, filterNodeId);
    }
}

function fnGetRegionsByRegionName(regionName, treeId, filterId) {
    $.ajax({
        type: "POST",
        url: 'Master/GetRegionsByRegionName',
        data: "regionName=" + regionName + "&treeId=" + treeId + "&filterId=" + filterId + "",
        success: function (result) {
            if (result != "") {
                $('#dvFilteredNode').html(result);
                $('#' + treeId).hide();
                $('#' + filterId).show();

            }
            else {
                fnGenerateRegionTree("dvRegionTree");
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

function fnGetRegionByRegionNameWithCheckBox(regionName, treeId, filterId) {
    $.ajax({
        type: "POST",
        url: 'Master/GetRegionsByRegionNameWithCheckBox',
        data: "regionName=" + regionName + "&treeId=" + treeId + "&filterId=" + filterId + "",
        success: function (result) {
            if (result != "") {
                $('#dvFilteredNode').html(result);
                $('#' + treeId).hide();
                $('#' + filterId).show();

            }
            else {
                fnGetRegionTreeByRegionWithCheckBox("", "dvRegionTree", filterId);
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

function fnExpandCollapseRegionTree(treeExpandLevel, mainDivId, treeNavId, obj, mainReptId, treeId) {
    //leftNav
    $('#' + treeNavId).show();

    if (treeExpandLevel == 0) {
        $('#' + mainDivId).show();
        $(obj).removeAttr('title');
        $('#' + mainDivId).removeClass('col-xs-5');
        $('#' + mainDivId).addClass('col-xs-3');
        $('#' + treeId).show();
        $('#dvStatus').show();
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
        $('#dvStatus').show();
        $('#' + mainReptId).removeClass('col-xs-9');
        $('#' + mainReptId).addClass('col-xs-8');
        treeExpandLevel = treeExpandLevel + 1;
        $("#spnTreeToggle").html('Hide Tree');
        $(obj).attr('title', 'Click here to expand tree');
        $(obj).html('<i class="fa fa-chevron-circle-right fa-lg"></i>');
    }
    else if (treeExpandLevel == 2) {
        $('#' + mainDivId).show();
        $(obj).removeAttr('title');

        $('#' + mainDivId).removeClass('col-xs-4');
        $('#' + mainDivId).addClass('col-xs-5');
        $('#' + treeId).show();
        $('#dvStatus').show();
        $('#' + mainReptId).removeClass('col-xs-8');
        $('#' + mainReptId).addClass('col-xs-7');
        treeExpandLevel = treeExpandLevel + 1;
        $("#spnTreeToggle").html('Hide Tree');
        $(obj).html('<i class="fa fa-chevron-circle-left fa-lg"></i>');
        $(obj).attr('title', 'Click here to collapse tree');

    }
    else {
        $('#' + mainDivId).removeClass('col-xs-5');
        $('#' + mainDivId).removeClass('col-xs-4');
        $('#' + mainDivId).removeClass('col-xs-3');
        $('#' + treeId).hide();
        $('#dvStatus').hide();
        $('#' + mainReptId).removeClass('col-xs-7');
        $('#' + mainReptId).removeClass('col-xs-8');
        $('#' + mainReptId).removeClass('col-xs-9');
        $('#' + mainReptId).addClass('col-xs-11');
        $("#spnTreeToggle").html('Show Tree');
        $(obj).removeAttr('title');
        $(obj).removeAttr('title');
        treeExpandLevel = -1;
        $(obj).html('<i class="fa fa-chevron-circle-right fa-lg"></i>');
        $(obj).attr('title', 'Click here to expand tree');
    }
}

function fnShowFullRegionTreeClick() {
    $('#dvPreviousNode').hide();
    $('#dvFullTree').hide();
    $('#dvLoadTree').show();
    $('#dvLoadTree').attr("title", "Click here to show regions");
    fnShowFullRegionTree(currentRegionCode_g, "dvRegionTree", "dvFilteredNode", "NO");
}


//************REGION TREE - NEW END ************************//

//************START NEW REGION TREE - WITH CHECKBOX***************//
function fnGetRegionTreeByRegionWithCheckBox(regionCode, treeId, filterId) {
    if (regionCode == "") {
        regionCode = currentRegionCode_g;
    }
    $('span').removeClass('childIcon');
    if (regionCode == currentRegionCode_g) {
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
        url: 'Master/RegionTreeGenerationByRegionCode',
        data: "regionCode=" + regionCode + "&includeOneLevelParent=NO",
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
                        fnRegionTreeNodeClick(node);
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
                        bindRegionContextMenu(span);
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
                        fnRegionTreeSelect(select, node);
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
                        fnBindRegionTreeWithCheckBox(node);
                    },
                    onPostInit: function (node, event) {
                        fnRegionTreePostInit(node);
                    }
                });

                // vacant user background-color change                
                $("#" + id).dynatree("getRoot").visit(function (node) {
                    //$(node.span.lastChild).addClass("tip");
                    if (node.data.title.split('-')[1] == "NOT ASSIGNED") {
                        $(node.span).addClass('tree-node-assigned');
                    }
                    if (node.data.title.split('-')[1] == "VACANT") {
                        $(node.span).addClass('tree-node-vacant');
                    }
                    if (node.data.title.split('-')[1] == "TO BE VACANT") {
                        $(node.span).addClass('tree-node-tobevacant');
                    }
                });

                $("#dvAjaxLoad").hide();
                $("span.childIcon").unbind("click");
                $("span.childIcon").bind("click", function (e) {
                    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                    //fnShowChildNodes(e.target);
                    e.preventDefault();
                    fnAddRegionNode(e);
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

function fnBindAllRegionTreeWithCheckBox(id, isChecked) {
    // $.blockUI();
    // $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateRegionTree',
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
                        fnRegionTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindRegionContextMenu(span);
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnRegionTreeSelect(select, node);
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
                        fnBindRegionTreeWithCheckBox(node);
                    },
                    onPostInit: function (node, event) {
                        fnRegionTreePostInit(node, isChecked, id);
                    }
                });
                // vacant user background-color change                
                $("#" + id).dynatree("getRoot").visit(function (node) {
                    //$(node.span.lastChild).addClass("tip");
                    //   if ($.inArray(node.data.key, vacantArr) > -1) {
                    if (node.data.title.split('-')[1] == "NOT ASSIGNED") {
                        $(node.span).addClass('tree-node-assigned');
                    }
                    if (node.data.title.split('-')[1] == "VACANT") {
                        $(node.span).addClass('tree-node-vacant');
                    }
                    if (node.data.title.split('-')[1] == "TO BE VACANT") {
                        $(node.span).addClass('tree-node-tobevacant');
                    }
                    //  }
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

function fnGetRegionsByRegionNameWithCheckBox(regionName, treeId, filterId) {
    $.ajax({
        type: "POST",
        url: 'Master/GetRegionsByRegionNameWithCheckBox',
        data: "regionName=" + regionName + "&treeId=" + treeId + "&filterId=" + filterId + "",
        success: function (result) {
            if (result != "") {
                $('#dvFilteredNode').html(result);
                $('#' + treeId).hide();
                $('#' + filterId).show();

            }
            else {
                fnGetRegionTreeByRegionWithCheckBox("", "dvRegionTree", filterId);
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
//************END NEW REGION TREE - WITH CHECKBOX***************//
