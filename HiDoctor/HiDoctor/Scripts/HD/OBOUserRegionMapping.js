var OBOUserRegion = {
    UserCode: 0,
    RegionCode: 0,
    UserList: [],
    fnBindSearchBar: function (id) {
        var tblContent = "";
        tblContent += "<div id='treeNav'>";
        tblContent += "<div id='dvUserNodeSearch' style='padding-top:1%;'>";
        tblContent += "<div class='input-group col-xs-8'>";
        tblContent += "<input type='text' id='txtUserSearchNode' placeholder='Search' class='form-control'/>";
        tblContent += "<span class='input-group-addon' onclick='fnSearchUsersFromTree();'><i class='fa fa-search'></i></span></div>";
        tblContent += "<span onclick='fnShowFullUserTreeClick();' id='dvUserFullTree' class='pull-right' style='margin-right: 4%;cursor:pointer;' title='Click here to show all users'><i class='fa fa-th-list fa-2'></i></span>";
        tblContent += "<span onclick='fnLoadInitialUserTree();' id='dvUserLoadTree' class='pull-right' style='display: none; margin-right: 4%;cursor:pointer;' title='Click here to show all users' ><i class='fa fa-th-list fa-2'></i></span>";
        tblContent += "<div class='clearfix'></div></div>";
        tblContent += "<div id='dvUserFilteredNode' class='dvFilteredNode' style='display: none;overflow: scroll;height: 455px;'></div>";
        tblContent += "<div id='dvUserMainTree'>";
        tblContent += "<div id='dvUserPreviousNode' class='dvPreviousNode' onclick='fnBindUsersWithOneLevelParentNew();'>";
        tblContent += "<i class='fa fa-arrow-up '></i></div>";
        tblContent += "<div id='dvUserTree' class='dvNewUserTree'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/load.gif'/>Loading tree</div>";
        tblContent += "<div class='clearfix'></div>";
        tblContent += "</div></div>";
        $('#' + id).html(tblContent);
    },

    fnSelectUserType: function (ev) {
        debugger;
        var RdtVal = $(ev).val();
        if (RdtVal == "USER") {
            $("#divRegion div.popUpTitle").html("User Hierarchy");
            fnGetUserTreeByUserWithCheckBox(OBOUserRegion.UserCode, "dvRegionTree", "dvFilteredNode");
            _UserTree.fnUserTreeEvent();
        }
        else {
            //Its option tree
            fnRegionTreePosition("regiontree");
            $("#divRegion div.popUpTitle").html("Region Hierarchy");
            _Region.fnEventReplace();
            _Region.fnGetRegionTree(OBOUserRegion.RegionCode, "dvRegionTree", "dvFilteredNode");

        }
        //$("#dvNodeSearch").hide();
        var myInterval = setInterval(function () { OBOUserRegion.fnGetSelected(); clearInterval(myInterval); }, 3000);

    },
    init: function () {
        //Defaut tree load 
        OBOUserRegion.fnBindSearchBar("usertree");
        fnGetUserTreeByUserNew(currentUserCode_g, "dvUserTree", "dvUserFilteredNode");

        //Its option tree
        fnRegionTreePosition("regiontree");
        //$("#dvNodeSearch").hide();
        $("#divRegion div.popUpTitle").html("User Hierarchy");
        OBOUserRegion.fnGetUserTreeByUserWithCheckBox(OBOUserRegion.UserCode, "dvRegionTree", "dvFilteredNode");
        _UserTree.fnUserTreeEvent();
        $.unblockUI();
    },
    fnSearchUserCheckboxTree: function (userCode, treeId, filterId) {
        if (userCode == "") {
            $('#dvPreviousNode').hide();
            OBOUserRegion.fnGetUserTreeByUserWithCheckBox(OBOUserRegion.UserCode, treeId, filterId);
        } else {
            $('#dvPreviousNode').show();
            OBOUserRegion.fnGetUserTreeByUserwithcheckboxMD(userCode, treeId, filterId)
        }

    },
    fnGetUserTreeByUserWithCheckBox: function (userCode, treeId, filterId) {
        debugger;
        if (userCode == "") {
            userCode = OBOUserRegion.UserCode;
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
                debugger;
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
                            //
                        },
                        onDblClick: function (node, event) {
                            var select = node.bSelected;
                            node.select(!select);
                            //node.visit(function (node) {
                            //    node.select(!select);
                            //});

                            //fnUserTreeNodeDblClick(node);
                        },
                        onPostInit: function (node, event) {
                            fnUserTreePostInit(node);
                        }
                    });
                    $("#dvAjaxLoad").hide();
                    $("span.childIcon").removeClass('childIcon');

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
    },
    fnGetUserTreeByUserwithcheckboxMD: function (userCode, treeId, filterId) {
        debugger;
        if (userCode == "") {
            userCode = OBOUserRegion.UserCode;
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
                    if (userCode == OBOUserRegion.UserCode) {
                        $('#dvPreviousNode').hide();
                    }
                    else {
                        $('#dvPreviousNode').show();
                    }
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

                            if ($(".contextMenu:visible").length > 0) {
                                $(".contextMenu").hide();
                            }
                        },
                        onSelect: function (select, node) {
                            //// Get a list of all selected nodes, and convert to a key array:
                            // fnUserTreeSelect(select, node);
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
                //var testKey = selKeys;
                //for (var i = 0; i < testKey.length; i++) {
                //    $("#" + treeId).dynatree("getRoot").visit(function (node) {
                //        if (testKey[i] == node.data.key) {
                //            node.select(true);
                //        }
                //    });
                //}
                $('#' + treeId).unblock();
            }

        });
    },
    fnGetUsersByUserNameEmployeeNameMD: function (userName, treeId, filterId) {
        debugger;
        $.ajax({
            type: "POST",
            url: 'HiDoctor_Master/MasterDataDownload/GetUsersByUserNameEmployeeNameMD',
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
    },
    //fnBindUserRegionSearchBar: function (id) {
    //    var tblContent = "";
    //    tblContent += "<div id='UserRegionTreeNav'>";
    //    tblContent += "<div id='dvUserRegionNodeSearch' style='padding-top:1%;'>";
    //    tblContent += "<div class='input-group col-xs-8'>";
    //    tblContent += "<input type='text' id='txtUserRegionSearchNode' placeholder='Search' class='form-control'/>";
    //    tblContent += "<span class='input-group-addon' onclick='OBOUserRegion.fnSearchUserRegionTree();'><i class='fa fa-search'></i></span></div>";
    //    tblContent += "<span onclick='OBOUserRegion.fnShowFullUserRegionTreeClick();' id='dvUserRegionFullTree' class='pull-right' style='margin-right: 4%;cursor:pointer;' title='Click here to show all users'><i class='fa fa-th-list fa-2'></i></span>";
    //    tblContent += "<span onclick='OBOUserRegion.fnLoadInitialUserRegionTree();' id='dvUserRegionLoadTree' class='pull-right' style='display: none; margin-right: 4%;cursor:pointer;' title='Click here to show all users' ><i class='fa fa-th-list fa-2'></i></span>";
    //    tblContent += "<div class='clearfix'></div></div>";
    //    tblContent += "<div id='dvUserRegionFilteredNode' class='dvUserRegionFilteredNode' style='display: none;overflow: scroll;height: 455px;'></div>";
    //    tblContent += "<div id='dvUserRegionMainTree'>";
    //    tblContent += "<div id='dvUserRegionPreviousNode' class='dvUserRegionPreviousNode' onclick='fnBindUsersWithOneLevelParentNew();'>";
    //    tblContent += "<i class='fa fa-arrow-up '></i></div>";
    //    tblContent += "<div id='dvRegionTree' class='dvNewUserTree'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/load.gif'/>Loading tree</div>";
    //    tblContent += "<div class='clearfix'></div>";
    //    tblContent += "</div></div>";
    //    $('#' + id).html(tblContent);
    //},
    /* fnSearchUserRegionTree: function () {
         debugger;
         var Type_Name = $("input[name=optradio]:checked").val();
         if ($.trim($('#txtSearchNode').val()) == '' && Type_Name == "REGION") {
             fnGetUserTreeByUserWithCheckBox(OBOUserRegion.UserCode, "dvRegionTree", "dvUserRegionFilteredNode");
         }
         else {
             fnGetUsersByUserNameEmployeeName($('#txtUserRegionSearchNode').val(), "dvRegionTree", "dvUserRegionFilteredNode");
             //  OBOUserRegion.fnGetUsersByUserNameEmployeeNameMD($('#txtUserSearchNode').val(), "dvUserTree", "dvUserFilteredNode");
         }
     },
     fnShowFullUserRegionTreeClick: function () {
         debugger;
         $('#dvUserRegionPreviousNode').hide();
         $('#dvUserRegionFullTree').hide();
         $('#dvUserRegionLoadTree').show();
         $('#dvUserRegionLoadTree').attr("title", "Click here to show users");
         fnShowFullTreeNew(OBOUserRegion.UserCode, "dvUserTree", "dvUserFilteredNode", "NO");
     },
     fnLoadInitialUserRegionTree: function () {
         debugger;
         $('#dvUserRegionFullTree').show();
         $('#dvUserRegionLoadTree').hide();
         $('#dvUserRegionFullTree').attr("title", "Click here to show all users");
         OBOUserRegion.fnGetUserTreeByUserNew(OBOUserRegion.UserCode, "dvUserTree", "dvFilteredNode");
     },
     fnGetUserTreeByUserNew: function (userCode, treeId, filterId) {
         debugger;
         if (userCode == "") {
             userCode = OBOUserRegion.UserCode;
         }
 
 
 
         if (userCode == curUserCode_g) {
             $('#dvUserRegionPreviousNode').hide();
             $(".dynatree-expander").hide();
             $(".dynatree-icon").hide();
         }
         else {
             $('#dvUserRegionPreviousNode').show();
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
                             //   fnUserTreeNodeDblClick(node);
                         },
                         onPostInit: function (node, event) {
                             fnUserTreePostInit(node);
                         }
                     });
 
                     $("#dvAjaxLoad").hide();
                     $("#divUser").find("span.childIcon").removeClass("childIcon");
 
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
     },
     */
    fnSetDisplayName: function () {
        debugger;
        var SelNode = $('#dvRegionTree').dynatree("getRoot").tree.getSelectedNodes();
        var Type_Name = $("input[name=optradio]:checked").val();
        if (SelNode.length > 0) {

            var Content = '<table class="table" id="tblUsersPopUp">';
            Content += '<thead style="font-weight:bold !important;"><tr><th>User Name</th><th>Display Name</th>';
            Content += '</tr></thead><tbody>';
            var itr = 0;
            var TempUser = OBOUserRegion.UserList;
            var selKeys = $.map(SelNode, function (node) {

                var arr;
                var DisplayName = "";
                if (Type_Name == "USER") {
                    arr = jQuery.grep(TempUser, function (n, i) {
                        return (n.User_Code == node.data.key);
                    });
                    if (arr.length > 0)
                        DisplayName = arr[0].User_Name;
                }
                else {
                    arr = jQuery.grep(TempUser, function (n, i) {
                        return (n.Region_Code == node.data.key);
                    });
                    if (arr.length > 0)
                        DisplayName = arr[0].Region_Name;
                }


                Content += '<tr><td><input type="hidden" id="hndUserCode_' + itr + '" value="' + node.data.key + '" />' + node.data.title + '</td><td><input type="text" id="txtDisplayName_' + itr + '" value="' + DisplayName + '" class="form-control"/></td></tr>"';
                itr++;

            });
            Content += "</tbody></table>"

            $('#dvAllUsers').html(Content);
            $('#dvUserSelection').overlay().load();
        }
    },
    fnConfirmation: function () {
        debugger;
        if (OBOUserRegion.fnvalidate()) {
            var SelectedCount = $('#dvRegionTree').dynatree("getRoot").tree.getSelectedNodes().length;
            $("#dvAllUsers").html("");
            OBOUserRegion.fnSetDisplayName();

            if (SelectedCount > 0)
                $('#dvUserSelection').overlay().load();
            else
            { OBOUserRegion.fnSubmit(); }
        }
    },
    fnvalidate: function () {
        var flag = true;
        debugger;

        var SelectedCount = $('#dvRegionTree').dynatree("getRoot").tree.getSelectedNodes().length;

        if ($.trim($("#hndUserCode").val()) == "") {
            flag = false;
            fnMsgAlert('error', 'Error', "Please select atleast one user ");
        }

        else if ($("input[name=optradio]:checked").length == 0) {
            flag = false;
            fnMsgAlert('error', 'Error', "Please select Mapping type");
        }
        //var isDisplayName = 0;
        //var SelNode = $('#dvRegionTree').dynatree("getRoot").tree.getSelectedNodes();
        //for (var itr = 0; itr <= SelNode.length - 1; itr++) { 
        //    if ($.trim($('#txtDisplayName_' + itr).val()) == "") {
        //        flag = false;
        //        isDisplayName++;
        //    }

        //}

        //if (isDisplayName > 0)
        //{
        //    fnMsgAlert('error', 'Error', "Please enter the Display name.");
        //}


        return flag;
    }, fnSubmit: function () {
        debugger;
        $("#btnSubmit").hide();
        $('#dvRegionMaster').block({
            message: '<h3>Loading...</h3>',
            css: { border: '1px solid #ddd' }
        });
        //Get User or region Genenrated
        var SelNode = $('#dvRegionTree').dynatree("getRoot").tree.getSelectedNodes();
        if (OBOUserRegion.fnvalidate()) {
            debugger;
            var arrMappedDetails = [];
            var Type_Name = $("input[name=optradio]:checked").val();
            var Owner_Code = $("#hndUserCode").val();

            var _ArrDisplayName = [];

            var isDisplayName = 0;
            for (var itr = 0; itr <= SelNode.length - 1; itr++) {
                _ArrDisplayName.push({
                    "User_Code": $('#hndUserCode_' + itr).val(),
                    "User_Name": $('#txtDisplayName_' + itr).val(),
                });

                if ($.trim($('#txtDisplayName_' + itr).val()) == "") {
                    isDisplayName++;
                }
            }
            $("#dvErrorMsg").hide();
            if (isDisplayName > 0) {
                // $("#dvErrorMsg").show();
                fnMsgAlert('error', 'Error', "Please enter the display name.");
                $('#dvRegionMaster').unblock();
                $("#btnSubmit").show();
                //  return false;
            } else {
                if (SelNode.length > 0)
                    $('#dvUserSelection').overlay().close();
                var selKeys = $.map(SelNode, function (node) {

                    var _arr = jQuery.grep(_ArrDisplayName, function (n, i) {
                        return (n.User_Code == node.data.key);
                    });
                    arrMappedDetails.push({
                        "User_Code": node.data.key,
                        "User_Name": _arr[0].User_Name
                    });
                });

                //$('#dvRegionTree').dynatree("getRoot").visit(function (node) {
                //    if (node.bSelected) {
                //        arrMappedDetails.push({
                //            "User_Code": node.data.key,
                //            "User_Name": node.data.title.split(",")[0]
                //        });
                //    }
                //});

                var JsonParam = "{User_Code:'" + Owner_Code + "',Type_Name:'" + Type_Name + "',lstUserMappingDetails:" + JSON.stringify(arrMappedDetails) + "}"

                $.ajax({
                    type: "POST",
                    url: 'Messaging/OBOUserRegionInserMapping',
                    contentType: "application/json; charset=utf-8",
                    data: JsonParam,
                    async: false,
                    success: function (jsData) {
                        // console.log(jsData, jsData.length);
                        debugger;
                        if (jsData != undefined) {
                            //if (jsData.length > 0) {
                            if (jsData.Success) {
                                $('#dvRegionMaster').unblock();
                                $("#btnSubmit").show();
                                if (SelNode.length > 0)
                                    $('#dvUserSelection').overlay().close();
                                OBOUserRegion.fnGetSelected();
                                fnMsgAlert('success', 'success', jsData.message);

                            } else {
                                $('#dvRegionMaster').unblock();
                                $("#btnSubmit").show();
                                if (SelNode.length > 0)
                                    $('#dvUserSelection').overlay().close();
                                fnMsgAlert('error', 'Error', jsData.message);

                            }
                            // }

                        }
                    },
                    error: function () {
                        if (SelNode.length > 0)
                            $('#dvUserSelection').overlay().close();
                        $('#dvRegionMaster').unblock();
                        $("#btnSubmit").show();
                    },
                    complete: function () {
                        if (SelNode.length > 0)
                            $('#dvUserSelection').overlay().close();
                        $('#dvRegionMaster').unblock();
                        $("#btnSubmit").show();
                    }

                });
            }

        } else {
            if (SelNode.length > 0)
                $('#dvUserSelection').overlay().close();
            $('#dvRegionMaster').unblock();
            $("#btnSubmit").show();
        }
    },
    fnGetSelected: function () {
        debugger;
        try {
            var Type_Name = $("input[name=optradio]:checked").val();
            var Owner_Code = $("#hndUserCode").val();
            $.ajax({
                url: '../../Messaging/GetOBOUsers/',
                type: 'POST',
                data: "TypeName=" + Type_Name + "&UserCode=" + Owner_Code,
                async: false,
                success: function (response) {
                    debugger;
                    var jsonData = eval(response);
                    OBOUserRegion.UserList = jsonData;
                    $('#dvRegionTree').dynatree("getRoot").visit(function (node) {
                        node.select(false);
                    });
                    if (jsonData != null && jsonData != '' && jsonData.length > 0) {

                        $('#dvRegionTree').dynatree("getRoot").visit(function (node) {
                            var arr;
                            if (Type_Name == "USER") {
                                arr = jQuery.grep(jsonData, function (n, i) {
                                    return (n.User_Code == node.data.key);
                                });
                            }
                            else {
                                arr = jQuery.grep(jsonData, function (n, i) {
                                    return (n.Region_Code == node.data.key);
                                });
                            }

                            if (arr.length > 0)
                                node.select(true);
                        });

                    }
                    else {
                        $('#dvRegionTree').dynatree("getRoot").visit(function (node) {
                            node.select(false);
                        });
                        $.unblockUI();
                    }
                },
                error: function (e) {
                    $.unblockUI();

                },
                complete: function () {
                    $.unblockUI();

                }
            });
        } catch (err) {
            debugger;
            console.log("error:", err.message);
            $.unblockUI();
        }
    }


}


var _Region = {
    init: function () {

    },
    fnEventReplace: function () {
        //Event Replaced

        $('#dvFullTree').removeAttr('onclick');
        $('#dvLoadTree').removeAttr('onclick');
        //   $("#txtSearchNode span:first-child").removeAttr('onclick');


        $('#dvFullTree').attr('onClick', '_Region.fnLoadFullRegionTree();');


        $('#dvLoadTree').attr('onClick', '_Region.fnLoadFullRegionTree();');
        $("#dvNodeSearch div:first-child").css("display", "inline-block");
        //$("#txtSearchNode span:first-child").attr('onClick',"_Region.fnSearchRegionTree()");


    },
    fnGetRegionTree: function (regionCode, treeId, filterId) {
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
                        checkbox: true,
                        ajaxDefaults: {
                            type: 'POST',
                            cache: false
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
                        onDblClick: function (node, event) {
                            //  fnRegionTreeNodeClick(node);
                        },
                        onPostInit: function (node, event) {
                            fnRegionTreePostInit(node);
                        },
                        onExpand: function (select, dtnode) {
                            // fnRegionTreeVacantNodeInit(select, dtnode, id);
                        },
                        strings: {
                            loading: "Loading…",
                            loadError: "Load error!"
                        },
                    });

                    // vacant user background-color change
                    $("#" + treeId).dynatree("getRoot").visit(function (node) {
                        if (node.data.title.split('-')[1] == "NOT ASSIGNED" || node.data.title.split('-')[1] == "VACANT") {
                            $(node.span).addClass('tree-node-vacant');
                        }
                    });

                    $("#dvAjaxLoad").hide();
                    $("#divRegion").find("span.childIcon").removeClass("childIcon");

                }
            },
            error: function () {
                $('#' + treeId).unblock();
            },
            complete: function () {
                $('#' + treeId).unblock();
            }
        });
    },
    fnLoadFullRegionTree: function () {
        debugger;
        $('#dvUserFullTree').show();
        $('#dvUserLoadTree').hide();
        $('#dvUserFullTree').attr("title", "Click here to show all users");
        _Region.fnGetRegionTree(OBOUserRegion.RegionCode, "dvRegionTree", "dvFilteredNode");
    },
    fnSearchRegionTree: function () {
        if ($.trim($('#txtSearchNode').val()) == '') {
            _Region.fnGetRegionTree(OBOUserRegion.RegionCode, "dvRegionTree", "dvFilteredNode");
        }
        else {
            //OBOUserRegion.fnGetUsersByUserNameEmployeeNameMD($('#txtSearchNode').val(), "dvRegionTree", "dvFilteredNode");
            //fnGetRegionsByRegionName($('#txtSearchNode').val(), "dvRegionTree", "dvFilteredNode");
            _Region.fnGetRegionsByRegionNameWithCheckBox($('#txtSearchNode').val(), "dvRegionTree", "dvFilteredNode");
        }

    },
    fnGetRegionsByRegionNameWithCheckBox: function (regionName, treeId, filterId) {
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
                    _Region.fnGetRegionTree("", treeId, filterId);
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


}


var _UserTree = {
    fnSearchUserCheckBox: function () {
        debugger;
        if ($.trim($('#txtSearchNode').val()) == '') {
            OBOUserRegion.fnGetUserTreeByUserWithCheckBox(OBOUserRegion.UserCode, "dvRegionTree", "dvFilteredNode");
        }
        else {
            OBOUserRegion.fnGetUsersByUserNameEmployeeNameMD($('#txtSearchNode').val(), "dvRegionTree", "dvFilteredNode");
        }
    },
    fnUserTreeEvent: function () {
        $('#dvFullTree').removeAttr('onclick');
        $('#dvLoadTree').removeAttr('onclick');
        $('#dvPreviousNode').removeAttr('onclick');

        $('#dvFullTree').attr('onClick', '_UserTree.fnLoadUserTreeEvent();');

        $('#dvLoadTree').attr('onClick', '_UserTree.fnLoadUserTreeEvent();');
        //$('#dvPreviousNode').attr('onClick', '_UserTree.fnBindUserOneLevelParent();');
        $("#dvNodeSearch div:first-child").css("display", "inline-block");


    },
    fnLoadUserTreeEvent: function () {
        debugger;
        $('#dvUserFullTree').show();
        $('#dvUserLoadTree').hide();
        $('#dvUserFullTree').attr("title", "Click here to show all users");
        OBOUserRegion.fnGetUserTreeByUserwithcheckboxMD(OBOUserRegion.UserCode, "dvRegionTree", "dvFilteredNode");
    },

    fnShowFullUserTreeClick: function () {
        debugger;
        $('#dvUserPreviousNode').hide();
        $('#dvUserFullTree').hide();
        $('#dvUserLoadTree').show();
        $('#dvUserLoadTree').attr("title", "Click here to show users");
        fnShowFullTreeNew(currentUserCode_g, "dvUserTree", "dvUserFilteredNode", "NO");
    },
    fnBindUserOneLevelParent: function () {
        var userCode = $("#dvRegionTree").dynatree("getTree").tnRoot.childList[0].data.key;
        // fnGetUserTreeByUserWithOnelevelParentNew(userCode, "dvRegionTree", "dvFilteredNode");
        _UserTree.fnGetUserTreeByParentwithcheckboxMD(userCode, "dvRegionTree", "dvFilteredNode");
    },
    fnGetUserTreeByParentwithcheckboxMD: function (userCode, treeId, filterId) {
        debugger;
        if (userCode == "") {
            userCode = OBOUserRegion.UserCode;
        }

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
                    if (userCode == OBOUserRegion.UserCode) {
                        $('#dvPreviousNode').hide();
                    }
                    else {
                        $('#dvPreviousNode').show();
                    }
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

                            if ($(".contextMenu:visible").length > 0) {
                                $(".contextMenu").hide();
                            }
                        },
                        onSelect: function (select, node) {
                            //// Get a list of all selected nodes, and convert to a key array:
                            // fnUserTreeSelect(select, node);
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
                    $("span.childIcon").unbind("click");
                    $("span.childIcon").live("click", function (e) {
                        //alert("Edit " + $.ui.dynatree.getNode(e.target));
                        fnShowChildNodes(e.target);
                    });
                    var FirstUserCode = $("#" + treeId).dynatree("getTree").tnRoot.childList[0].data.key
                    if (FirstUserCode == OBOUserRegion.UserCode) {
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
                //var testKey = selKeys;
                //for (var i = 0; i < testKey.length; i++) {
                //    $("#" + treeId).dynatree("getRoot").visit(function (node) {
                //        if (testKey[i] == node.data.key) {
                //            node.select(true);
                //        }
                //    });
                //}
                $('#' + treeId).unblock();
            }

        });
    },
}

var _MainUserTree = {
    fnGetUserTreeByUserWithOnelevelParentNew: function (userCode, treeId, filterId) {
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
                    debugger;
                    if (userCode == curUserCode_g) {
                        $('#dvUserPreviousNode').hide();

                    }
                    else {
                        $('#dvUserPreviousNode').show();

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
                            //fnUserTreeNodeClick(node);
                            fnUserTreeNewNodeClick(node);
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
                    debugger;
                    // var first_levelusercode = $("#dvUserTree").dynatree("getRoot").getChildren()[0].data.key;
                    var first_levelusercode = $("#" + treeId).dynatree("getTree").tnRoot.childList[0].data.key
                    if (first_levelusercode == curUserCode_g) {
                        $('#dvUserPreviousNode').hide();
                    }
                    else {
                        $('#dvUserPreviousNode').show();
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
    , fnGetUserTreeByUserNew: function (userCode, treeId, filterId) {
        debugger;
        if (userCode == "") {
            userCode = currentUserCode_g;
        }



        if (userCode == curUserCode_g) {
            $('#dvUserPreviousNode').hide();
            $(".dynatree-expander").hide();
            $(".dynatree-icon").hide();
        }
        else {
            $('#dvUserPreviousNode').show();
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
                            //fnUserTreeNodeClick(node);
                            fnUserTreeNewNodeClick(node);
                        },

                        onClick: function (node, event) {
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
                            //   fnUserTreeNodeDblClick(node);
                        },
                        onPostInit: function (node, event) {
                            fnUserTreePostInit(node);
                        }
                    });
                    var FirstUserCode = $("#" + treeId).dynatree("getTree").tnRoot.childList[0].data.key
                    if (FirstUserCode == OBOUserRegion.UserCode) {
                        $('#dvUserPreviousNode').hide();
                    }
                    else {
                        $('#dvUserPreviousNode').show();
                    }
                    $("#dvAjaxLoad").hide();
                    $("#divUser").find("span.childIcon").removeClass("childIcon");

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
}