
function fnGetCampaigns() {
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        var regionCode = regionTree.getActiveNode().data.key;
        $.ajax({
            url: '../HiDoctor_Master/DoctorProductMapping/GetCampaigns/',
            type: "POST",
            data: "regionCode=" + regionCode + "",
            success: function (jsData) {
                if (jsData != '') {
                    jsData = eval('(' + jsData + ')');
                    var campaign = $("#cboCampaign");
                    campaign.append("<option value=ALL>-Select Campaign-</option>");
                    for (var i = 0; i < jsData.length; i++) {
                        campaign.append("<option value=" + jsData[i].Campaign_Code + ">" + jsData[i].Campaign_Name + "</option>");
                    }
                }
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }
}

function fnGetDoctorProducts() {
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    var regionCode = regionTree.getActiveNode().data.key;
    var mappingType = "";
    $.ajax({
        url: '../HiDoctor_Master/DoctorProductMapping/GetDoctorProductTable/',
        type: "POST",
        data: "regionCode=" + regionCode + "&campaignCode=" + $("#cboCampaign").val() + "&mappingType=" + mappingType + "",
        success: function (result) {
            if (result != '') {
                if (result.split('$').length > 1) {
                    if (mappingType == "0") {
                        $("#dvMapping").html("<div id='dvDoctor' class='col-sm-6'></div><div class='col-sm-6' id='dvProduct'></div>");
                    }
                    else {
                        $("#dvMapping").html("<div class='col-sm-6' id='dvProduct'></div><div id='dvDoctor' class='col-sm-6'></div>");
                    }
                    $("#dvDoctor").html(result.split('$')[0]);
                    $("#dvProduct").html(result.split('$')[1]);
                    $(".clsDecimal").keypress(function () { return fnIsNumeric(event) });
                    $(".clsDecimal").blur(function () { fnCheckNumeric(this) });
                }
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });

}


function fnSubmit() {
    var mappingType = "";
    var doctorCode = ""
    var productDetails = "";
    var flag = false;
    if (mappingType == "0") {
        $("input:checkbox[name=chkSelect]").each(function () {
            var productCode = this.value;
            if (this.checked) {
                var id = this.id;
                flag = true;
                productDetails += productCode + "^";
                productDetails += $("#" + id.replace("chkSelect", "txtYield")).val() + "^";
                productDetails += $("#" + id.replace("chkSelect", "txtPotential")).val() + "^";
                productDetails += $("#" + id.replace("chkSelect", "txtPriority")).val() + "^";
                productDetails += "$";
            }
        });
    }
}