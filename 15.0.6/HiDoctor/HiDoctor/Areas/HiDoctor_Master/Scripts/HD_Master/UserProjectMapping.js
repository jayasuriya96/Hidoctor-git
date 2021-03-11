//Created By: SRISUDHAN//
//Created Date: 17-12-2013//
//Screen Name:UserProjectMapping//

//get Project Tree
var projectCode_g = "";
function fnProjectTree(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserProjectMapping/GetProjectDetails',
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            data = jsData;
            if (jsData.length > 0) {
                strTree = "<ul  id='home' item-expanded='true'  >";
                for (var i = 0; i < jsData.length; i++) {

                    strTree += "<li id='" + jsData[i].Project_Code + "'  class='expanded' >" + jsData[i].Project_Name + "";
                    strTree += "<ul >";
                    fnSubMenu(jsData, jsData[i].Project_Code);
                    strTree += "</ul>";
                }
                strTree += "</li>";
            }

            strTree += "</ul>";


            $("#" + id).html(' ');
            $('#' + id).dynatree('destroy');
            $('#' + id).empty();
            $("#" + id).html(strTree);

            $("#" + id).dynatree({
                checkbox: true,
                onActivate: function (node) {
                    fnProjectTreeNodeClick(node);
                },
                onSelect: function (select, node) {
                    // Get a list of all selected nodes, and convert to a key array:
                    fnProjectTreeSelect(select, node);
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
                    fnProjectTreeNodeDblClick(node);
                },
                onPostInit: function (node, event) {
                    fnProjectTreePostInit(node);
                }


            });
            $("#dvAjaxLoad").hide();
        }

    });
}

//fill user Project Grid
var resultmapData = "";
function fnfillMappingGrid(pagenumber) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserProjectMapping/GetUserProjectDetails',
        data: "pageNo=" + pagenumber,
        success: function (result) {
            resultmapData = (result.split('*')[1]);
            if (result != '') {
                $("#dvTable").html(result.split('*')[0]);

            }
        }
    });
}

function fnSave() {
    $('#lblmessage').html("");
    if (selKeys == "") {
        fnMsgAlert('info', 'User Project Mapping', 'Please select the atleast one user');
        return false;
    }
    if (selKeysproject == "") {
        fnMsgAlert('info', 'User Project Mapping', 'Please select the project name.');
        return false;
    }
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'User Project Mapping', 'Please Enter Start Date.');
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'User Project Mapping', 'Please Enter End Date.');
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtToDate"), "EndDate"))) {
        return false;
    }




    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        return false;
    }




    var existUserCodes = selKeys;
    var exitsprojectCode = selKeysproject;
    var jsdata = eval(resultmapData);
    for (var i = 0; i < existUserCodes.length; i++) {
        for (var j = 0; j < exitsprojectCode.length; j++) {
            var disJson = jsonPath(jsdata, "$.[?(@.User_Code =='" + existUserCodes[i] + "' && @.Project_Code == '" + exitsprojectCode[j] + "')]");
            if (disJson != false && disJson != undefined) {
                fnMsgAlert('info', 'User Project Mapping', 'Already Mapped' + ' ' + disJson[0].User_Name);
                return false;
            }
        }
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserProjectMapping/InsertUserProject',
        data: "userCode=" + selKeys + "&projectCode=" + selKeysproject + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (result) {
            if (result != " ") {
                fnMsgAlert('success', 'User Project Mapping', 'Mapped Sucessfully');
            }
            else {
                alert("Please Check")
            }
            HideModalPopup("dvloading");
            fnfillMappingGrid(1);
            fnClear();

        }
    });


}
//delete
function fnDelete(val) {
    $('#lblmessage').html("");
    var projectCode = val.split('_')[0]
    var userCode = val.split('_')[1]
    var mapcode = val.split('_')[2]

    $("#dvTable").html("");
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserProjectMapping/DeleteUserProject',
        data: "projectCode=" + mapcode,
        success: function (result) {
            if (result == "1") {
                fnMsgAlert('success', 'User Project Mapping', 'Deleted Sucessfully');
            }
            else {
                alert("Sorry an error occured. Please try again later.")
            }
            HideModalPopup("dvloading");
            fnfillMappingGrid(1)
        }
    });
}


function fnEdit(val) {
    $('#lblmessage').html("");
    $('#btnSave').hide();
    var mapcode = val.split('_')[2]
    projectCode_g = val.split('_')[0]
    var userCode = val.split('_')[1]
    var startDate = val.split('_')[3]
    var endDate = val.split('_')[4]
    $("#tree").dynatree("getRoot").visit(function (node) {
        if (node.data.key == userCode) {
            node.select(true);
        }
    });

    $("#Projecttree").dynatree("getRoot").visit(function (node) {
        if (node.data.key == projectCode_g) {
            node.select(true);
        }
    });
    $("#txtFromDate").val(startDate);
    $("#txtToDate").val(endDate);
    $('#btnUpdate').show();
}


function fnUpdate() {
    $('#lblmessage').html("");
    if (selKeys == "") {
        fnMsgAlert('info', 'User Project Mapping', 'Please select the atleast one user');
        return false;
    }
    if (selKeysproject == "") {
        fnMsgAlert('info', 'User Project Mapping', 'Please select the project name.');
        return false;
    }
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'User Project Mapping', 'Please Enter Start Date.');
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'User Project Mapping', 'Please Enter End Date.');
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtToDate"), "EndDate"))) {
        return false;
    }



    var existUserCodes = selKeys;
    var exitsprojectCode = selKeysproject;
    var jsdata = eval(resultmapData);
    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        return false;
    }
    var st = $("#txtFromDate").val();
    var ed = $("#txtToDate").val();
    for (var i = 0; i < existUserCodes.length; i++) {
        for (var j = 0; j < exitsprojectCode.length; j++) {
            var disJson = jsonPath(jsdata, "$.[?(@.User_Code =='" + existUserCodes[i] + "' && @.Project_Code == '" + exitsprojectCode[j] + "' && @.StartDate == '" + st + "' && @.EndDate == '" + ed + "')]");
            if (disJson != false && disJson != undefined) {
                fnMsgAlert('info', 'User Project Mapping', 'Already Mapped' + ' ' + disJson[0].User_Name);
                $('#btnSave').hide();
                $('#btnUpdate').show();
                return false;
            }
        }
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserProjectMapping/UpdateUserProject',
        data: "userCode=" + selKeys + "&projectCode=" + selKeysproject + "&startDate=" + startDate + "&endDate=" + endDate + "&oldProjectCode=" + projectCode_g,
        success: function (result) {
            if (result != " ") {
                fnMsgAlert('success', 'User Project Mapping', 'Updated Sucessfully');
                $('#btnSave').show();
                $('#btnUpdate').hide();
            }
            else {
                fnMsgAlert('success', 'User Project Mapping', 'Already Mapped');
            }
            HideModalPopup("dvloading");
            fnfillMappingGrid(1);
            fnClear();

        }
    });
}


function fnClear() {
    $("#txtFromDate").val('');
    $("#txtToDate").val('');
    $("#tree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });
    $("#Projecttree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });

}


function fnGoToPrevPage() {
    var pno = parseInt($('#pageno').html()) - 1;
    fnfillMappingGrid(pno);
}
function fnGoToNextPage() {
    var pno = parseInt($('#pageno').html()) + 1;
    fnfillMappingGrid(pno);
}
function fnGoToPage() {
    var pno = $('#drpPaging :selected').val();
    fnfillMappingGrid(pno);
}


