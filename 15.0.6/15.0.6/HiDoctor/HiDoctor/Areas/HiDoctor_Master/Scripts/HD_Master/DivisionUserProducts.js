//Date : 27-12-2013
//Created For : Division User Product mapping Screen
//Created by : SriSudan

//Get Division//
var division = "";
function fnGetDivision() {
    $.ajax({
        url: '../HiDoctor_Master/DivisionUserProducts/GetDivision',
        type: "POST",
        success: function (JsonResult) {

            division = JsonResult;
            if (division != null) {
                if (division.length > 0) {
                    fnAddOptionToSelect("ddlDivisionName", "-Select-", "0");
                    for (var i = 0; i < division.length; i++) {
                        fnAddOptionToSelect("ddlDivisionName", division[i].Division_Name, division[i].Division_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlDivisionName", "-No DivisionName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlDivisionName", "-No DivisionName-", "0");
            }
        }
    });
}

function fnGetUserTypeName() {
    $.ajax({
        url: '../HiDoctor_Master/DivisionUserProducts/GetUserTypeName',
        type: "POST",
        success: function (JsonResult) {

            var userTypeName = JsonResult;
            if (userTypeName != null) {
                if (userTypeName.length > 0) {
                    fnAddOptionToSelect("ddlUserType", "-Select-", "0");
                    for (var i = 0; i < userTypeName.length; i++) {
                        fnAddOptionToSelect("ddlUserType", userTypeName[i].User_Type_Name, userTypeName[i].User_Type_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlUserType", "-No UserTypeName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlUserType", "-No UserTypeName-", "0");
            }
        }
    });
}


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

var privilegevalue
function fnGetUserTypeprivillage() {

    if ($("#ddlDivisionName").val() == "0") {
        fnMsgAlert('info', 'Division UserProduct Mapping Screen', 'Please Select Division.');
        return false;
    }

    if ($("#ddlproductselection").val() == "0") {
        fnMsgAlert('info', 'Division UserProduct Mapping Screen', 'Please Select Product Selection.');
        return false;
    }

    var userTypeCode = $("#ddlUserType option:selected").val();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/DivisionUserProducts/GetPrivileges',
        data: "userTypeCode=" + userTypeCode,
        success: function (response) {
            privilegevalue = eval('(' + response + ')');
            $("#dvTable").html("");
            if (ActionType == "EDIT" && SelUserCode == "") {
                fnMsgAlert('info', 'Division User Product', 'Please select a user from Tree');
            }
            else {
                if (privilegevalue.length > 0) {
                    fnFillGrid();
                }
            }
        },
        error: function (e) {
            //fnMsgAlert("info", "Information", "Calendar Loads failed.");
        }

    });

}

function fnFillGrid() {
    //var pageNumber = val;
    $("#dvTable").html("");

    if ($("#ddlDivisionName").val() == "0") {
        fnMsgAlert('info', 'Division UserProduct Mapping Screen', 'Please Select Division.');
        return false;
    }

    if ($("#ddlproductselection").val() == "0") {
        fnMsgAlert('info', 'Division UserProduct Mapping Screen', 'Please Select Product Selection.');
        return false;
    }
    debugger;
    var divisionCode = "";
    var mode = $("#ddlproductselection option:selected").val();
    var userCode = "";
    if (ActionType.toUpperCase() == "SAVE") {
        SelUserCode = "";
    }

    if (mode == 3) {
        if (division.length > 0) {
            for (var i = 0; i < division.length; i++) {
                divisionCode += division[i].Division_Code;
                if (i < division.length - 1) {
                    divisionCode += ',';
                }
            }
        }
    } else {
        divisionCode = $("#ddlDivisionName option:selected").val();
    }
    debugger;
    if (ActionType.toUpperCase() == "EDIT") {
        if (UserName == '') {
            $('#lbllable').hide();
        }
        else {
            $('#lbllable').show();
            $('#username').html(UserName);
        }
    }
    else {
        $('#lbllable').hide();
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/DivisionUserProducts/GetDivUserProductsDetails',
        data: "divisionCode=" + divisionCode + "&proSelectMode=" + mode
            + "&productType=" + (privilegevalue[0] == undefined ? "" : privilegevalue[0].Privilege_Value_Name)
            + "&actionType=" + ActionType + "&userCode=" + SelUserCode,

        success: function (result) {
            debugger;
            if (result != '' && result != "</tbody></table>") {
                $("#dvTable").html(result);
                if (ActionType.toUpperCase() == "EDIT") {
                    $("#btnSave").hide();
                    fnGetUserProducts();
                }
                else
                    $("#btnSave").show();
            }
            else {
                $("#btnSave").hide();
                fnMsgAlert('info', 'Division User Product', 'No Products Found');

            }
        },
        error: function (result) {
            fnMsgAlert('info', 'Division User Product', 'Getting Division user products failed.');
        }
    });

}

function fnGetUserProducts() {
    var rows = $("#tblUserProject tbody").find("tr");
    $.each(rows, function () {
        $($(this).find("input[name='chk_DivUserPro']")[0]).prop("checked", false);
        $($(this).find(".minCount")[0]).val("0");
        //$($(this).find(".minCount")[0]).prop("disabled", true);
        $($(this).find(".maxCount")[0]).val("0");
        //$($(this).find(".maxCount")[0]).prop("disabled", "true")

    });
    if (SelUserCode != "") {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/DivisionUserProducts/GetUserProducts',
            data: "User_Code=" + SelUserCode,
            success: function (result) {
                //result = eval('(' + result + ')');
                $.each(rows, function () {
                    var productCode = $($(this).find("input[name='chk_DivUserPro']")[0]).val();
                    var product = $.grep(result, function (d) {
                        return d.Product_Code == productCode
                    })
                    if (product.length > 0) {
                        if (product[0].User_Product_status == "0")
                            $($(this).find("input[name='chk_DivUserPro']")[0]).prop("checked", true);
                        else
                            $($(this).find("input[name='chk_DivUserPro']")[0]).prop("checked", false);
                        $($(this).find(".minCount")[0]).val(product[0].Min_Count)
                        $($(this).find(".maxCount")[0]).val(product[0].Max_Count)
                    }
                    else {
                        $($(this).find("input[name='chk_DivUserPro']")[0]).prop("checked", false);
                    }
                });
            },
            error: function (result) {
                fnMsgAlert('info', 'Products', 'Getting User Products failed.');
            }
        });
    }
}


function fnselectall() {
    if ($('#bulkcheck').is(":checked")) {
        $("input:checkbox[name=chk_DivUserPro]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chk_DivUserPro]").removeAttr('checked');
    }
}


function fnSave() {
    var insertProduct = "";
    var alreadyMappedProduct = "";

    ShowModalPopup("dvloading");
    if (!$("input[name='chk_DivUserPro']").is(":checked")) {
        fnMsgAlert('info', 'Division User Product', 'Please select alteast one product');
        HideModalPopup("dvloading");
        return false;
    }

    if (selKeys == "") {
        fnMsgAlert('info', 'Division User Product', 'Please select alteast one user');
        HideModalPopup("dvloading");
        return false;
    }

    var productCode = ""
    var minCounts = "";
    var maxCounts = "";
    var isError = false;
    $("input:checkbox[name=chk_DivUserPro]").each(function () {
        if (this.checked) {
            productCode += "" + $(this).val() + "^";

            var tr = $(this).closest("tr");
            var temp = "";
            var productName = $(tr).find("td").eq(1).html();
            var minCount = 0;
            var maxCount = 0;
            temp = $($(tr).find("[name='txtMinCount']").eq(0)).val() == "" ? '0' : $($(tr).find("[name='txtMinCount']").eq(0)).val();
            if (isNaN(parseInt(temp)) == true) {
                fnMsgAlert('info', 'Division User Product', "Product " + productName + " has non numueric value for Min count");
                isError = true;
                return false;
            }
            minCount = parseInt(temp);
            minCounts += "" + temp + "^";
            temp = $($(tr).find("[name='txtMaxCount']").eq(0)).val() == "" ? '0' : $($(tr).find("[name='txtMaxCount']").eq(0)).val();
            if (isNaN(parseInt(temp)) == true) {
                fnMsgAlert('info', 'Division User Product', "Product " + productName + " has non numueric value for Max count");
                isError = true;
                return false;
            }
            maxCount = parseInt(temp);
            maxCounts += "" + temp + "^";
            if (minCount > 0 && maxCount > 0) {
                if (minCount > maxCount) {
                    fnMsgAlert('info', 'Division User Product', "Min count value should be less than Max count.");
                    isError = true;
                    return false;
                }
            }
        }
    });

    if (isError == true) {
        HideModalPopup("dvloading");
        return;
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/DivisionUserProducts/InsertUserProduct',
        data: "userCode=" + selKeys + "&productCode=" + productCode + "&minCounts=" + minCounts + "&maxCounts=" + maxCounts,
        success: function (result) {
            if (result != null && result != "" && parseInt(result) > 0) {
                fnMsgAlert('info', 'Division User Product', 'The selected Products have been successfully mapped to the selected Users.');
            }

            else {
                fnMsgAlert('info', 'Division User Product', 'Already Mapped.');
            }
            HideModalPopup("dvloading");
        },
        error: function (e) {
            fnMsgAlert('error', 'Division User Product', 'An error has occurred while mapping the selected products to the selected users. Please try again and if the problem persists, contact the System Administrator.');
            HideModalPopup("dvloading");
        }
    });
    fnFillGrid();

}

function fnSaveEdit(ele) {
    var tr = $(ele).closest("tr");
    var checkBox = $($(tr).find("input[name='chk_DivUserPro']")[0])
    var status = $(checkBox).is(":checked") == true ? "0" : "1";
    var productCode = $(checkBox).val();
    var minCount = $($(tr).find(".minCount").eq(0)).val();
    if (isNaN(parseInt(minCount)) == true) {
        fnMsgAlert('info', 'Division User Product', " Min count value should be numeric.");
        return;
    }
    var maxCount = $($(tr).find(".maxCount").eq(0)).val();
    if (isNaN(parseInt(maxCount)) == true) {
        fnMsgAlert('info', 'Division User Product', "Max count value should be numeric");
        return;
    }
    if (parseInt(minCount) > 0 && parseInt(maxCount) > 0) {
        if (parseInt(minCount) > parseInt(maxCount)) {
            fnMsgAlert('info', 'Division User Product', "Max-Count value should be greater than Min-Count.");
            return;
        }
    }
    if (SelUserCode == "") {
        fnMsgAlert('info', 'Division User Product', "Please select any user from UserTree.");
        return;
    }

    ShowModalPopup("dvloading");
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/DivisionUserProducts/SaveUserProduct',
        data: "Product_Code=" + productCode + "&minCount=" + minCount
        + "&maxCount=" + maxCount + "&status=" + status + "&User_Code=" + SelUserCode,
        success: function (result) {
            HideModalPopup("dvloading");
            if (result.split(":")[0].toUpperCase() == "ERROR") {
                fnMsgAlert('error', 'Error', result.split(":")[1]);
            }
            else if (result.split(":")[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('success', 'Success', 'Changes saved successfully.');
            }

        },
        error: function (e) {
            HideModalPopup("dvloading");
            fnMsgAlert("info", "failed", "Failed to save changes.");
            console.log(e);
        }
    });
}


//function fnGoToPrevPage() {
//    var pno = parseInt($('#pageno').html()) - 1;
//    fnFillGrid(pno);
//}
//function fnGoToNextPage() {
//    var pno = parseInt($('#pageno').html()) + 1;
//    fnFillGrid(pno);
//}
//function fnGoToPage() {
//    var pno = $('#drpPaging :selected').val();
//    fnFillGrid(pno);
//}