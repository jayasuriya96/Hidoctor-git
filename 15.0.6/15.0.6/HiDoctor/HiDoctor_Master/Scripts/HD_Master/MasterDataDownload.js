var specialKeys = new Array();
specialKeys.push(8); //Backspace
specialKeys.push(9); //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(37); //Left
specialKeys.push(39); //Right

function IsAlphaNumeric(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    var ret = (keyCode == 32 || (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
    document.getElementById("error").style.display = ret ? "none" : "inline";
    return ret;
}
function fnGetdate() {
    // debugger;
    var today = new Date();
    var cdd = today.getDate();
    var cmm = today.getMonth() + 1;
    var cyy = today.getFullYear();
    var currentDate = cdd + '/' + cmm + '/' + cyy;
    today.setDate(today.getDate() - 30);
    var pdd = today.getDate();
    var pmm = today.getMonth() + 1;
    var pyy = today.getFullYear();
    var prevDate = pdd + '/' + pmm + '/' + pyy;


    $('#fromDate').val(prevDate);
    $('#toDate').val(currentDate);
    //fnGetMarketingCampaignDetails();
}

function fnInsertMasterData() {
    debugger
    var UserArray = [];
    var Entityval = $('#txtEntity').val();
    var Infoval = $('#txtinfo').val();

    if (Entityval == '')
    {
        fnMsgAlert('info', 'Master Data Download', 'Please Enter Entity Field');
        return false;
    }
    if (Entityval.length > 50) {
        fnMsgAlert('info', 'Master Data Download', 'Entity Field Should not exceed 50 characters');
        return false;
    }
    if (Infoval == '')
    {
        fnMsgAlert('info', 'Master Data Download', 'Please Enter Info Field');
        return false;
    }
    if (Infoval.length > 100) {
        fnMsgAlert('info', 'Master Data Download', 'Info Field Should not exceed 100 characters');
        return false;
    }
    for (var i = 0; i < selKeys.length; i++) {
        var UserObj = {
            Company_Code: Companycode,
            LoggedUser_Code: UserCode,
            Region_Code: RegionCode,
            User_Code: selKeys[i],
            Entity: Entityval,
            Info: Infoval,
        };
        UserArray.push(UserObj);
    }

    if (UserArray.length == 0)
    {
        fnMsgAlert('info', 'Master Data Download', 'Please Select atleast one User');
        return false;
    }
           $.ajax({
            url: '../HiDoctor_Master/MasterDataDownload/InsertMasterData/',
            type: "POST",
            data: JSON.stringify({ "lstUsers": UserArray }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                debugger
                if (result == true || result == "True") {
                    fnMsgAlert('success', 'Master Data Download', 'Saved successfully');
                    $('#txtEntity').val('');
                    $('#txtinfo').val('');
                    selKeys = '';
                    fnGetUserTreeByUserWithCheckBox(currentUserCode_g, "dvUserTree", "dvFilteredNode");
                }
                else {
                    fnMsgAlert('info', 'Master Data Download', 'Please Try Again Later');
                    $('#txtEntity').val('');
                    $('#txtinfo').val('');
                }
            }
        });
}

function fnGetMasterData()
{
    debugger
    var FromDate = $('#fromDate').val();
    var ToDate = $('#toDate').val();
    if (FromDate == '')
    {
        fnMsgAlert('info', 'Master Data Download', 'Please Enter Effective From');
        return false;
    }
    if (ToDate == '') {
        fnMsgAlert('info', 'Master Data Download', 'Please Enter Effective To');
        return false;
    }
    var effectivefrm = FromDate;
    var arrEffectivefrom = effectivefrm.split('/');
    var effectivefromdate = arrEffectivefrom[2] + '-' + arrEffectivefrom[1] + '-' + arrEffectivefrom[0]
    var effectiveto = ToDate;
    var arrEffectiveto = effectiveto.split('/');
    var effectivetodate = arrEffectiveto[2] + '-' + arrEffectiveto[1] + '-' + arrEffectiveto[0]

    $.ajax({
        url: '../HiDoctor_Master/MasterDataDownload/GetMasterData/',
        type: "GET",
        data: 'FromDate=' + effectivefromdate + '&ToDate=' + effectivetodate,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            debugger
            if (result.length > 0)
            {
                $('#dvMasterdatagrid').html('');
                var grid = new ej.grids.Grid({
                    dataSource: result,
                    showColumnChooser: true,
                    allowPaging: true,
                    allowGrouping: true,
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    allowCellMerging: true,
                    allowScrolling: true,
                    pageSettings: { pageSize: 20, pageSizes: [20, 40, 60, 80, 100], pageCount: 5 },
                    filterSettings: { type: 'CheckBox' },
                    toolbar: ['Search', 'ColumnChooser'],
                    // rowSelected: fnRowSelected,                   
                    aggregates: [],

                    columns: [
                            { field: 'User_Name', headerText: 'User Name', width: 200, textAlign: 'center' },
                            { field: 'Designation', headerText: 'Designation', width: 200, textAlign: 'center' },
                            { field: 'Region_Name', headerText: 'Region Name', width: 200, textAlign: 'center' },
                            { field: 'Date', headerText: 'Date', width: 200, textAlign: 'center' },
                            { field: 'Status', headerText: 'Status', width: 200, textAlign: 'center' },
                    ],
                });
                grid.appendTo('#dvMasterdatagrid');
            }
            else {
                $('#dvMasterdatagrid').html("No data found.");
            }
        },
        error: function (res) {
            debugger;
            fnMsgAlert('info', 'Error', 'ERROR.');
        }
    })

}

function fnGetUserTreeByUserWithCheckBox(userCode, treeId, filterId) {
    debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }
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