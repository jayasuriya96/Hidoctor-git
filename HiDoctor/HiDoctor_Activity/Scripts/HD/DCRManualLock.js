function fnSave() {
    debugger;
    if (confirm("Dear User,The DCR(s) of the selected user will be locked for the period" + $('#txtDateFrom').val() + " to " + $('#txtDateTo').val() + " Press Ok to put the lock. Press cancel to cancel the operation.")) {
        if (fnValidate()) {
            try {
                ShowModalPopup("dvloading");
                var users = ''

                // set the user codes.
                for (var i = 0; i < selKeys.length; i++) {
                    users += selKeys[i] + "^";
                }

                // change the date format.
                var sdate = $('#txtDateFrom').val().split('/');
                sdate = sdate[1] + '/' + sdate[0] + '/' + sdate[2];
                var edate = $('#txtDateTo').val().split('/');
                edate = edate[1] + '/' + edate[0] + '/' + edate[2];
                var lockReason = $('#txtReason').val();

                // call controller.
                $.ajax({
                    type: "post",
                    data: "lockUserCodes=" + users + "&lockDateFrom=" + sdate + "&lockDateTo=" + edate + "&lockReason=" + lockReason,
                    url: '../HiDoctor_Activity/DCRLock/InsertDCRManualLock',
                    success: function (response) {
                        HideModalPopup("dvloading");
                        debugger;
                        if (response) {
                                fnMsgAlert('success', 'DCR Lock', 'Lock applied successfully.');
                                $('#txtDateFrom').val('');
                                $('#txtDateTo').val('');
                                $('#txtReason').val('');
                                fnTreePositionForMasterDataMD("usertree");
                                fnGetUserTreeByUserWithCheckBox(currentUserCode_g, "dvUserTree", "dvFilteredNode");
                        }
                        else {
                            fnMsgAlert('error', 'DCR_Lock', response);
                        }

                    },
                    error: function (e) {
                        fnMsgAlert("error", "DCR Lock", e.responseText);
                        HideModalPopup("dvloading");
                        return false;
                    }
                });
            }
            catch (e) {
                HideModalPopup("dvloading");
            }
        }
    }

}

var restrictedSpecialchar_g = "/\&+^%$#@!~{}'><=";

function fnValidate() {
    debugger;
    var errMsg = "";

    // user mandatory.
    if (selKeys.length == 0) {
        errMsg = "Please select atlease one user.<br />";
    }

    // from date mandatory.
    if ($.trim($('#txtDateFrom').val()).length == 0) {
        errMsg += "Please choose the Lock period from date. <br />";
    }

    // to date mandatory.
    if ($.trim($('#txtDateTo').val()).length == 0) {
        errMsg += "Please choose the Lock period to date. <br />";

    }

    // Manual Lock Reason mandatory
    if ($.trim($("#txtReason").val()) != "") {
        var specialCharregexfordcr = new RegExp(/^[a-zA-Z0-9-_.?,;:*()[\] ]+$/);
        if (!specialCharregexfordcr.test($(txtReason).val())) {
            errMsg += "Please remove the following special characters <br/>" + restrictedSpecialchar_g;
        }
    }

    // from date greater than to date.
    if ($.trim($('#txtDateFrom').val()).length > 0 && $.trim($('#txtDateTo').val()).length > 0) {
        var sdate = $('#txtDateFrom').val().split('/');
        sdate = sdate[1] + '/' + sdate[0] + '/' + sdate[2];
        var edate = $('#txtDateTo').val().split('/');
        edate = edate[1] + '/' + edate[0] + '/' + edate[2];

        if (new Date(sdate) > new Date(edate)) {
            errMsg += "Lock period from date should be greater than Lock period to date. <br />"
        }
    }

    var FromDateArr = $("#txtDateFrom").val().split('/');
    var ToDateArr = $("#txtDateTo").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays >= 31) {
        errMsg += "Difference between Lock period from date and Lock period to date should not be greater than 31 days.<br />"
        //  fnMsgAlert('info', 'DCR Manual Lock', 'Start date and end date should not be greater than 31 days.');
        // HideModalPopup("dvloading");
        //return false;
    }

    // show errors.
    if (errMsg.length > 0) {
        fnMsgAlert("info", "DCR Lock", errMsg);
        return false;
    }
    return true;
}

fnGetUserTreeByUserWithCheckBox = function (userCode, treeId, filterId) {
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
                        //
                    },
                    onDblClick: function (node, event) {
                        var select = node.bSelected;
                        node.select(!select);
                        node.visit(function (node) {
                            node.select(!select);
                        });

                        //fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $("span.childIcon").removeClass('childIcon');
                //$("span.childIcon").unbind("click");
                //$("span.childIcon").bind("click", function (e) {
                //    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                //    //fnShowChildNodes(e.target);
                //    e.preventDefault();
                //    fnAddNode(e);
                //    return false;
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

function fnToggleTree() {
    debugger;

    if ($("#spnTreeToggle").html() == "Hide Tree") {
        $("#dvTree").hide();
        $("#divMain").css('width', '60%');
        $("#spnTreeToggle").html('Show Tree');
    }
    else if ($("#spnTreeToggle").html() == "Show Tree") {
        $("#dvTree").show();
        $("#divMain").css('width', '60%');
        $("#spnTreeToggle").html('Hide Tree');
    }
}

function fnUserTreeSelect(select, node) {

    debugger;
    bindFlag = true;
    var lastSelectedNode = node.data.key;
    selKeys = $.map(node.tree.getSelectedNodes(), function (node) {
        return node.data.key;
    });
    SelTitleKeys = $.map(node.tree.getSelectedNodes(), function (node) {
        return node.data.title;
    });

}

function fnUserTreePostInit() {
}