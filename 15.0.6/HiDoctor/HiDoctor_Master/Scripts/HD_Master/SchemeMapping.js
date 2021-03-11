


function fnGetSchemes() {
    $.ajax({
        url: '../HiDoctor_Master/Scheme/GetSchemeHeader/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.length > 0) {
                var cboScheme = $("#cboScheme");
                $('option', cboScheme).remove();
                cboScheme.append("<option value=0>-Select Scheme-</option>");
                for (var i = 0; i < jsData.length; i++) {
                    cboScheme.append("<option value='" + jsData[i].Scheme_Code + "'>" + jsData[i].Scheme_Name + "</option>");
                }
                $("#cboScheme").attr('selectedIndex', 0);
            }
        },
        error: function () {
        }
    });
}

function fnGetMappedSchemes() {
    fnBindRegionClassification();
}


function fnBindRegionClassification() {

    $('option', $("#cboRegionClassification")).remove();
    $('option', $("#cboRegionType")).remove();
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetRegionClassification',
        type: "POST",
        data: "A",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                var regionClassiJson = jsonData[0].Data;
                var regionTypeJson = jsonData[1].Data;
                if (regionClassiJson.length > 0) {
                    var regionClassi = "";
                    var regionClassiAll = "";
                    $("#cboRegionClassification").append("<option value='ALL' selected='selected'>ALL</option>");
                    for (var i = 0; i < regionClassiJson.length; i++) {
                        $("#cboRegionClassification").append("<option value='" + regionClassiJson[i].Region_Classification_Code + "'>" + regionClassiJson[i].Region_Classification_Name + "</option>");
                    }
                    $("#cboRegionClassification").multiselect();
                    $("#cboRegionClassification").multiselect({
                        noneSelectedText: 'Select RegionClassification'
                    }).multiselectfilter();
                    // $("#dRegClassi").show();
                }
                if (regionTypeJson.length > 0) {
                    var regionType = "";
                    var regionTypeAll = "";
                    $("#cboRegionType").append("<option value='ALL' selected='selected'>ALL</option>");
                    for (var i = 0; i < regionTypeJson.length; i++) {
                        $("#cboRegionType").append("<option value='" + regionTypeJson[i].Region_Type_Code + "'>" + regionTypeJson[i].Region_Type_Name + "</option>");
                    }
                    $("#cboRegionType").multiselect();
                    $("#cboRegionType").multiselect({
                        noneSelectedText: 'Select Region Type'
                    }).multiselectfilter();
                    //$("#cboRegionType").attr('selectedIndex', 0);

                }
                $("#cboRegionClassification").multiselect('refresh');
                $("#cboRegionType").multiselect('refresh');
                fnGetRegions();
            }
        },
        error: function () {
            alert("error");
        }
    });
}

function fnGetRegions(mode) {
    var isAll = false;
    var regionTypeCodes = "";
    var regionClassi = "";
    //Region Types
    $('select#cboRegionType > option:selected').each(function () {
        if ($(this).val() == "ALL") {
            isAll = true;
            return;
        }
    });
    if (!isAll) {
        $('select#cboRegionType > option:selected').each(function () {
            regionTypeCodes += $(this).val() + "^";
        });
    }
    else {
        $('select#cboRegionType > option').each(function () {
            if ($(this).val() != "ALL") {
                regionTypeCodes += $(this).val() + "^";
            }
        });
    }
    regionTypeCodes = regionTypeCodes.slice(0, -1);
    if (regionTypeCodes == "") {
        fnMsgAlert('info', 'info', 'Please select atleast one region type');
        return;
    }
    isAll = false;
    //Region Classification 
    if ($("#cboRegionClassification > option").length > 0) {
        $('select#cboRegionClassification > option:selected').each(function () {
            if ($(this).val() == "ALL") {
                isAll = true;
                return;
            }
        });
        if (!isAll) {
            $('select#cboRegionClassification > option:selected').each(function () {
                regionClassi += $(this).val() + "^";
            });
        }
        else {
            $('select#cboRegionClassification > option').each(function () {
                if ($(this).val() != "ALL") {
                    regionClassi += $(this).val() + "^";
                }
            });
        }
        regionClassi = regionClassi.slice(0, -1);
        if (regionClassi == "") {
            fnMsgAlert('info', 'info', 'Please select atleast one region classification');
            return;
        }
    }
    // $("#cboRegion").multiselect('destroy');
    $('option', $("#cboRegion")).remove();
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetRegions',
        type: "POST",
        data: "regionTypes=" + regionTypeCodes + "&regionClassifications=" + regionClassi + "",
        success: function (jsonData) {
            jsonData = eval('(' + jsonData + ')');
            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#cboRegion").append("<option value='" + jsonData[i].Region_Code + "'>" + jsonData[i].Region_Name + "</option>");
                }
                //  $("#cboRegion").multiselect('destroy');
                // $("#cboRegion").multiselect();
                $("#cboRegion").multiselect({
                    noneSelectedText: 'Select Regions'
                }).multiselectfilter();
                $("#cboRegion").multiselect('refresh');
                $.ajax({
                    url: '../HiDoctor_Master/Scheme/GetMappedRegionsByScheme',
                    type: "POST",
                    data: "schemeCode=" + $("#cboScheme").val() + "",
                    success: function (jsonData) {
                        jsonData = eval('(' + jsonData + ')');
                        if (jsonData.length > 0) {
                            for (var i = 0; i < jsonData.length; i++) {
                                $("#cboRegion").multiselect("widget").find(":checkbox[value='" + jsonData[i].Region_Code + "']").attr("checked", "checked");
                                $("#cboRegion option[value='" + jsonData[i].Region_Code + "']").attr("selected", true);
                            }
                            $("#cboRegion").multiselect({
                                noneSelectedText: 'Select Regions'
                            }).multiselectfilter();
                        }
                    },
                    error: function () {
                    }
                });

            }
        },
        error: function () {
            //
        }
    });
}


function fnSchemeMapping() {
    //rdMap
    var regionCodes = "";
    var mappedRegion = $('input:radio[name=rdMap]:checked').val();
    if (mappedRegion == "1") {
        //regionCodes = "ALL";
        $('select#cboRegion > option').each(function () {
            if ($(this).val() != "ALL") {
                regionCodes += $(this).val() + "^";
            }
        });
    }
    else {
        $('select#cboRegion > option:selected').each(function () {
            regionCodes += $(this).val() + "^";
        });
        //regionCodes = regionCodes.slice(0, -1);
        if (regionCodes == "") {
            fnMsgAlert('info', 'info', 'Please select atleast one region');
            return;
        }
    }
    //InsertSchemeRegionMapping
    $.ajax({
        url: '../HiDoctor_Master/Scheme/InsertSchemeMapping',
        type: "POST",
        data: "schemeCode=" + $("#cboScheme").val() + "&regionCodes=" + regionCodes + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('success', 'Success', 'Scheme mapped to the selected regions');
                fnClearMapping();
            }
            else {
                fnMsgAlert('error', 'Error', 'Scheme mapping failed. ' + result.split(':')[1]);
            }
        },
        error: function () {
            //
        }
    });
}


function fnClearMapping() {
    $("#cboScheme").attr('selectedIndex', 0);
    $("#cboScheme").val('0');
    $("#cboRegionClassification").multiselect('destroy');
    $("#cboRegionType").multiselect('destroy');
    $("#cboRegion").multiselect('destroy');
    $('option', $("#cboRegionClassification")).remove();
    $('option', $("#cboRegionType")).remove();
    $('option', $("#cboRegion")).remove();
    //$("#dRegClassi").hide();
}

function fnShowRegions() {
    var selectedVal = $("input:radio[name=rdMap]:checked").val();
    if (selectedVal == "1") {
        $("#dvRegionType").hide();
        $("#dRegClassi").hide();
        $("#dvBtnRegions").hide();
        $("#dvMainRegion").hide();
    }
    else {
        $("#dvRegionType").show();
        $("#dRegClassi").show();
        $("#dvBtnRegions").show();
        $("#dvMainRegion").show();
    }
}