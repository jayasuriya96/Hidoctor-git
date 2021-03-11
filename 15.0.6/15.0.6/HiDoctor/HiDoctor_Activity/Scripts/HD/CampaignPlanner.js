var jsonSFC_g;
var autoSFC_g;
var autoDoctor_g;
var jsonDoctor_g;
var docRowNum = 3;
var cpRowNum = "";
var jsonCPDetails_g = "";
var travelMode_g = "";
var PriCampaignPlanner_g = "";
var PriInterPlace_g = "";
var PriFareEdit_g = "";
var PriCategoryCheck_g = "";
var allSFCJson_g = "";

function fnGetExpenseEntity() {
    $.ajax({
        url: '../HiDoctor_Activity/CampaignPlanner/GetExpenseEntity/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                var category = $("#cboCategory");
                for (var i = 0; i < jsData.length; i++) {
                    category.append("<option value=" + jsData[i].Expense_Entity_Code + ">" + jsData[i].Expense_Entity_Name + "</option>");
                }
                //$("#cboCategory option:eq(HQ)").attr('selected', 'selected');
                $("#cboCategory option").each(function () {
                    if ($(this).text() == "HQ") {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function fnGetSFC() {
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        var regionCode = regionTree.getActiveNode().data.key;
        $('#dvCPMain').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Activity/CampaignPlanner/GetSFC/',
            type: "POST",
            data: "regionCode=" + regionCode + "",
            success: function (jsSFC) {
                if (jsSFC != '') {
                    jsSFC = eval('(' + jsSFC + ')');
                    jsonSFC_g = jsSFC;
                    allSFCJson_g = jsSFC;
                    fnFilterCategoryBasedSFC();
                    fnGetDoctors();
                }
            },
            error: function () {
            },
            complete: function () {
                $('#dvCPMain').unblock();
            }
        });
    }

}
function fnFilterCategoryBasedSFC() {
    var arSFC = new Array();
    jsonSFC_g = new Array();
    if ($.inArray("CP", PriCategoryCheck_g) == -1) {
        for (var s = 0; s < allSFCJson_g.length; s++) {
            var sfc = {};
            if (allSFCJson_g[s].Category_Name.toUpperCase() == $("#cboCategory :selected").text().toUpperCase()) {
                if ($.inArray(allSFCJson_g[s].From_Region_Name.toUpperCase(), arSFC) == -1) {
                    arSFC.push(allSFCJson_g[s].From_Region_Name.toUpperCase());
                }
                if ($.inArray(allSFCJson_g[s].To_Region_Name.toUpperCase(), arSFC) == -1) {
                    arSFC.push(allSFCJson_g[s].To_Region_Name.toUpperCase());
                }
                sfc.Category_Name = allSFCJson_g[s].Category_Name;
                sfc.Distance = allSFCJson_g[s].Distance;
                sfc.Distance_Fare_Code = allSFCJson_g[s].Distance_Fare_Code;
                sfc.Fare_Amount = allSFCJson_g[s].Fare_Amount;
                sfc.From_Region_Name = allSFCJson_g[s].From_Region_Name;
                sfc.SFC_Version_No = allSFCJson_g[s].SFC_Version_No;
                sfc.SFC_Visit_Count = allSFCJson_g[s].SFC_Visit_Count;
                sfc.To_Region_Name = allSFCJson_g[s].To_Region_Name;
                sfc.Travel_Mode = allSFCJson_g[s].Travel_Mode;
                jsonSFC_g.push(sfc);
            }
        }
    }
    else {
        for (var s = 0; s < allSFCJson_g.length; s++) {
            if ($.inArray(allSFCJson_g[s].From_Region_Name.toUpperCase(), arSFC) == -1) {
                arSFC.push(allSFCJson_g[s].From_Region_Name.toUpperCase());
            }
            if ($.inArray(allSFCJson_g[s].To_Region_Name.toUpperCase(), arSFC) == -1) {
                arSFC.push(allSFCJson_g[s].To_Region_Name.toUpperCase());
            }

        }
        jsonSFC_g.push(allSFCJson_g);
    }
    $('.autoWorkArea').unautocomplete();
    $('.autoFromPlace').unautocomplete();
    $('.autoToPlace').unautocomplete();
    var sfc = "[";
    for (var i = 0; i < arSFC.length; i++) {
        sfc += "{label:" + '"' + "" + arSFC[i] + "" + '",' + "value:" + '"' + "" + arSFC[i] + "" + '"' + "},";
    }
    if (arSFC.length > 0) {
        sfc = sfc.slice(0, -1);
    }
    sfc += "];";
    autoSFC_g = eval(sfc);
    fnCreateSFCTable();
}
function fnGetDoctors() {
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        var regionCode = regionTree.getActiveNode().data.key;
        $.ajax({
            url: '../HiDoctor_Activity/CampaignPlanner/GetApprovedDoctorsByRegion/',
            type: "POST",
            data: "regionCode=" + regionCode + "",
            success: function (jsData) {
                if (jsData != '') {
                    jsData = eval('(' + jsData + ')');
                    jsonDoctor_g = jsData;
                    var doctors = "[";
                    for (var i = 0; i < jsData.length; i++) {
                        var doctorName = jsData[i].Customer_Name + '_' + jsData[i].MDL_Number + '_' + jsData[i].Speciality_Name + '_' + jsData[i].Region_Name;
                        doctors += "{label:" + '"' + "" + doctorName + "" + '",' + "value:" + '"' + "" + jsData[i].Customer_Code + "" + '"' + "},";
                    }
                    if (jsData.length > 0) {
                        doctors = doctors.slice(0, -1);
                    }
                    doctors += "];";
                    autoDoctor_g = eval(doctors);
                    fnCreateDoctorTable();

                }
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }
}
//Function to bind the travel modes
function fnGetTravelModes() {
    $.ajax({
        type: 'POST',
        url: '../SFCRegion/GetTravelModes',
        success: function (response) {
            travelMode_g = "";
            for (var i = 0; i < response.length; i++) {
                var travelMode = "[";
                for (var i = 0; i < response.length; i++) {
                    travelMode += "{label:" + '"' + "" + response[i].TravelMode_Name + "" + '",' + "value:" + '"' + "" + response[i].TravelMode_Name + "" + '"' + "},";
                }
                travelMode += "];";
                travelMode_g = eval(travelMode);
            }
        },
        error: function (e) {
            travelModeArr.clear();
        }
    });
}

function fnCreateSFCTable() {
    var sfcContent = "";
    sfcContent += '<table id="tblSFC" class="table table-striped"><thead> <tr> ';
    //sfcContent += '<th>Work Area</th>';
    sfcContent += '<th>From Place</th> <th>To Place</th><th>Travel Mode</th>';
    sfcContent += '<th>SFC Category</th><th>Distance</th><th>Fare</th> </tr> </thead>';
    sfcContent += '<tbody> <tr>';
    //sfcContent += '<td><input type="text" id="txtWorkArea_1" class="form-control autoWorkArea" maxlength=100';
    //sfcContent += ' onkeypress="  (this);" ondblclick="fnCreateSFCNewRow(this);" />';
    //sfcContent += '<input type="hidden" id="hdnWorkArea_1"/></td>';
    sfcContent += '<td><input type="text" id="txtFromPlace_1" class="form-control autoFromPlace" maxlength=50';
    sfcContent += 'onblur="fnGetFare(this)"/>';
    sfcContent += '<input type="hidden" id="hdnFromPlace_1"/></td>';
    sfcContent += '<td> <input type="text" id="txtToPlace_1" class="form-control autoToPlace" maxlength=50 onblur="fnCreateSFCNewRow(this);fnGetFare(this);"';
    sfcContent += ' ondblclick="fnCreateSFCNewRow(this);"/>';
    sfcContent += '<input type="hidden" id="hdnToPlace_1"/></td>';
    sfcContent += '<td><input type="text" id="txtTravelMode_1" class="form-control autoTravelMode" maxlength=30  onblur="fnGetFare(this)"/>';
    sfcContent += '<input type="hidden" id="hdnTravelMode_1"/><input type="hidden" id="hdnDistanceFareCode_1"/><input type="hidden" id="hdnRoute_1"/>';
    sfcContent += '</td>';
    sfcContent += '<td><span id="spnSFCCategory_1"></span></td>';
    if (PriFareEdit_g == "RIGID_PLACE") {
        sfcContent += '<td><input type="text" id="txtDistance_1" class="form-control clsDecimal" readonly=readonly /></td>';
        sfcContent += '<td> <input type="text" id="txtFare_1" class="form-control clsDecimal"  readonly=readonly/> </td>';
    }
    else {
        sfcContent += '<td><input type="text" id="txtDistance_1" class="form-control clsDecimal" /></td>';
        sfcContent += '<td> <input type="text" id="txtFare_1" class="form-control clsDecimal" /> </td>';
    }
    sfcContent += '</tr> </tbody> </table>';
    $("#dvSFC").html(sfcContent);
    //var travelMode = "[";
    //travelMode += "{label:" + '"' + "BIKE" + '",' + "value:" + '"' + "BIKE" + '"' + "},";
    //travelMode += "{label:" + '"' + "BUS" + '",' + "value:" + '"' + "BUS" + '"' + "},";
    //travelMode += "{label:" + '"' + "TRAIN" + '",' + "value:" + '"' + "TRAIN" + '"' + "},";
    //travelMode += "{label:" + '"' + "CAR" + '",' + "value:" + '"' + "CAR" + '"' + "},";
    //travelMode += "{label:" + '"' + "TAXI" + '",' + "value:" + '"' + "TAXI" + '"' + "},";
    //travelMode += "{label:" + '"' + "AIR" + '",' + "value:" + '"' + "AIR" + '"' + "},";
    //travelMode += "{label:" + '"' + "ROAD" + '",' + "value:" + '"' + "ROAD" + '"' + "}";
    //travelMode += "];";
    //travelMode_g = eval(travelMode);

    autoComplete(autoSFC_g, "txtWorkArea", "hdnWorkArea", "autoWorkArea");
    autoComplete(autoSFC_g, "txtFromPlace", "hdnFromPlace", "autoFromPlace");
    autoComplete(autoSFC_g, "txtToPlace", "hdnToPlace", "autoToPlace");
    autoComplete(travelMode_g, "txtTravelMode", "hdnTravelMode", "autoTravelMode");
    //$(".autoTravelMode").blur(function () { $(this).removeClass('errorIndicator'); $(this).removeAttr('title'); });
    $(".autoWorkArea").blur(function () { fnValidateAutofill(this, autoSFC_g, "txtWorkArea", "hdnWorkArea"); });
    $(".clsDecimal").keypress(function () { return fnIsNumeric(event) });
    $(".clsDecimal").blur(function () { if (!fnCheckMaxLimit(this, "FLOAT")) { $(this).val('0'); } });
    cpRowNum = 2;
}
function fnCreateSFCNewRow(obj) {
    
    $(obj).removeClass('errorIndicator');
    $(obj).removeAttr('title');
    var id = obj.id;
    if (obj == "EDIT") {
        var currentId = cpRowNum - 1;
    }
    else {
        currentId = id.split('_')[1]
    }
    var cateName = $("#cboCategory :selected").text().toUpperCase();
    var previousToplace = $('#txtToPlace_' + currentId).val();
    if ($.inArray(cateName, PriInterPlace_g) > -1 && $("#cboCategory :selected").text() != "HQ") {

        // if (parseInt(cpRowNum) - 1 == currentId) {
        if (previousToplace.length > 0) {

            var newSFCRowId = parseInt(currentId) + 1;
            if ($('#txtFromPlace_' + newSFCRowId).length > 0) {
                $('#txtFromPlace_' + newSFCRowId).val(previousToplace);
                $("#hdnFromPlace_" + newSFCRowId).val(previousToplace);
            }

            else {
                var rCnt = document.getElementById("tblSFC").getElementsByTagName("tr").length;
                var newRow = document.getElementById("tblSFC").insertRow(parseInt(rCnt));
                // var tdWorkArea = newRow.insertCell(0);
                var tdFromPlace = newRow.insertCell(0);
                var tdToPlace = newRow.insertCell(1);
                var tdTravelMode = newRow.insertCell(2);
                var tdCategory = newRow.insertCell(3);
                var tdDistance = newRow.insertCell(4);
                var tdFare = newRow.insertCell(5);

                //$(tdWorkArea).html('<input type="text" id="txtWorkArea_' + cpRowNum + '" class="form-control autoWorkArea" ' +
                //        'maxlength=100 onkeypress="fnCreateSFCNewRow(this);" ondblclick="fnCreateSFCNewRow(this);"/> ' +
                //        '<input type="hidden" id="hdnWorkArea_' + cpRowNum + '"/>');
                $(tdFromPlace).html('<input type="text" disabled="disabled" id="txtFromPlace_' + cpRowNum + '" class="form-control autoFromPlace" maxlength=50 ' +
                                    'onblur="fnGetFare(this)"/> ' +
                                    '<input type="hidden" id="hdnFromPlace_' + cpRowNum + '"/>');
                $(tdToPlace).html('<input type="text" id="txtToPlace_' + cpRowNum + '" class="form-control autoToPlace" maxlength=50 ' +
                                  'onblur="fnCreateSFCNewRow(this);fnGetFare(this);"  ondblclick="fnCreateSFCNewRow(this);"/> <input type="hidden" id="hdnToPlace_' + cpRowNum + '"/>');
                $(tdTravelMode).html('<input type="text" id="txtTravelMode_' + cpRowNum + '" maxlength=30 class="form-control autoTravelMode" ' +
                         'onblur="fnGetFare(this)"/><input type="hidden" id="hdnTravelMode_'
                         + cpRowNum + '"/><input type="hidden" id="hdnDistanceFareCode_'
                         + cpRowNum + '"/><input type="hidden" id="hdnRoute_' + cpRowNum + '"/>');
                $(tdCategory).html('<span id="spnSFCCategory_' + cpRowNum + '"></span>');
                if (PriFareEdit_g == "RIGID_PLACE") {
                    $(tdDistance).html('<input type="text" id="txtDistance_' + cpRowNum + '" class="form-control clsDecimal" readonly=readonly />')
                    $(tdFare).html('<input type="text" id="txtFare_' + cpRowNum + '" class="form-control clsDecimal" readonly=readonly /> ');
                }
                else {
                    $(tdDistance).html('<input type="text" id="txtDistance_' + cpRowNum + '" class="form-control clsDecimal" />')
                    $(tdFare).html('<input type="text" id="txtFare_' + cpRowNum + '" class="form-control clsDecimal" /> ');
                }

                $("#txtFromPlace_" + cpRowNum).val(previousToplace);
                $("#hdnFromPlace_" + cpRowNum).val(previousToplace);
                //autoComplete(autoSFC_g, "txtWorkArea", "hdnWorkArea", "autoWorkArea");
                autoComplete(autoSFC_g, "txtFromPlace", "hdnFromPlace", "autoFromPlace");
                autoComplete(autoSFC_g, "txtToPlace", "hdnToPlace", "autoToPlace");
                autoComplete(travelMode_g, "txtTravelMode", "hdnTravelMode", "autoTravelMode");
                $(".clsDecimal").keypress(function () { return fnIsNumeric(event) });
                $(".clsDecimal").blur(function () { if (!fnCheckMaxLimit(this, "FLOAT")) { $(this).val('0'); } });
                // $(".autoTravelMode").blur(function () { $(this).removeClass('errorIndicator'); $(this).removeAttr('title'); });
                //$(".autoWorkArea").blur(function () { fnValidateAutofill(this, autoSFC_g, "txtWorkArea", "hdnWorkArea"); });
                cpRowNum = cpRowNum + 1;
                //}
            }
        }
        else {
            var previousRowid = id.split('_')[1];
            var startpreviousId = parseInt(previousRowid) + 1;
            var rowCount = cpRowNum;
            for (var i = startpreviousId; i < rowCount; i++) {
                $("#txtToPlace_" + i).parent().parent().remove();
                cpRowNum--;
            }

        }
    }

}
function fnGetFareByFromPlace(obj) {
    $(obj).removeClass('errorIndicator');
    $(obj).removeAttr('title');
    
    fnValidateAutofill(obj, autoSFC_g, "txtFromPlace", "hdnFromPlace");
    var flag = true;
    var id = obj.id;
    // var workArea = $.trim($("#" + id.replace("txtFromPlace", "txtWorkArea")).val()).toUpperCase();
    var toPlace = "";
    var fromPlace = "";


    toPlace = $.trim($("#" + id.replace("txtFromPlace", "txtToPlace")).val()).toUpperCase();
    fromPlace = $.trim($(obj).val()).toUpperCase();


    var travelMode = $.trim($("#" + id.replace("txtFromPlace", "txtTravelMode")).val()).toUpperCase();
    var categoryName_s = $("#cboCategory :selected").text().toUpperCase();
    //if (workArea == "") {
    //    $("#" + id.replace("txtFromPlace", "txtWorkArea")).addClass('errorIndicator');
    //    $("#" + id.replace("txtFromPlace", "txtWorkArea")).attr('title', 'Please select work area');
    //    flag = false;
    //}
    //else {
    //    $("#" + id.replace("txtFromPlace", "txtWorkArea")).removeClass('errorIndicator');
    //    $("#" + id.replace("txtFromPlace", "txtWorkArea")).removeAttr('title');
    //}
    if (toPlace == "") {
        $(obj).addClass('errorIndicator');
        $(obj).attr('title', 'Please select from place');
        $("#" + id.replace("txtFromPlace", "txtDistance")).val('0')
        $("#" + id.replace("txtFromPlace", "txtFare")).val('0')
        $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val('');
        $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html('');
        flag = false;
    }
    else {
        if ($.trim(fromPlace) != '' && ($.trim($("#" + id.replace("txtFromPlace", "hdnFromPlace")).val()) == '' ||
           $("#" + id.replace("txtFromPlace", "hdnFromPlace")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
            $(obj).addClass('errorIndicator');
            $(obj).attr('title', 'Please select from place');
            $("#" + id.replace("txtFromPlace", "txtDistance")).val('0')
            $("#" + id.replace("txtFromPlace", "txtFare")).val('0')
            $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val('');
            $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html('');
            flag = false;
        }
        else {
            $(obj).removeClass('errorIndicator');
            $(obj).removeAttr('title', 'Please select from place');
        }
    }

    if ($.trim(toPlace) != '' && ($.trim($("#" + id.replace("txtFromPlace", "hdnToPlace")).val()) == '' ||
            $("#" + id.replace("txtFromPlace", "hdnToPlace")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
        $("#" + id.replace("txtFromPlace", "txtToPlace")).addClass('errorIndicator');
        $("#" + id.replace("txtFromPlace", "txtToPlace")).attr('title', 'Please select to place');
        flag = false;
    }
    //if ($.trim(workArea) != '' && ($.trim($("#" + id.replace("txtFromPlace", "hdnWorkArea")).val()) == '' || $("#" + id.replace("txtFromPlace", "hdnWorkArea")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
    //    $("#" + id.replace("txtFromPlace", "txtWorkArea")).addClass('errorIndicator');
    //    $("#" + id.replace("txtFromPlace", "txtWorkArea")).attr('title', 'Please select work area');
    //    flag = false;
    //}

    if ($.trim(travelMode) != '' && ($.trim($("#" + id.replace("txtFromPlace", "hdnTravelMode")).val()) == '' ||
           $("#" + id.replace("txtFromPlace", "hdnTravelMode")).val() == undefined)) {
        $("#" + id.replace("txtFromPlace", "txtTravelMode")).addClass('errorIndicator');
        $("#" + id.replace("txtFromPlace", "txtTravelMode")).attr('title', 'Please select travel mode');
        flag = false;
    }
    if (flag) {
        $("#" + id.replace("txtFromPlace", "txtToPlace")).removeClass('errorIndicator');
        $(obj).removeClass('errorIndicator');
        $("#" + id.replace("txtFromPlace", "txtTravelMode")).removeClass('errorIndicator');
        // if ($.trim(fromPlace) != '' && $.trim(toPlace) != '' && $.trim(workArea) != '' && $.trim(travelMode) != '') {
        if ($.trim(fromPlace) != '' && $.trim(toPlace) != '') {
            if (PriFareEdit_g == "RIGID_PLACE") {
                if (autoSFC_g != '') {
                    var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' || @.To_Region_Name=='" + fromPlace + "')]");
                    if (disJson == false && disJson != undefined) {
                        $(obj).addClass('errorIndicator');
                        $(obj).attr('title', 'Invalid from place');
                    }
                    else {
                        $(obj).removeClass('errorIndicator');
                        $(obj).removeAttr('title');
                    }
                    var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + toPlace + "' || @.To_Region_Name=='" + toPlace + "')]");
                    if (disJson == false && disJson != undefined) {
                        $("#" + id.replace("txtFromPlace", "txtToPlace")).addClass('errorIndicator');
                        $("#" + id.replace("txtFromPlace", "txtToPlace")).attr('title', 'Invalid to place');
                    }
                    else {
                        $("#" + id.replace("txtFromPlace", "txtToPlace")).removeClass('errorIndicator');
                        $("#" + id.replace("txtFromPlace", "txtToPlace")).removeAttr('title');
                    }
                    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                    //    + toPlace + "'  && @.Travel_Mode=='" + travelMode + "')]");
                    if (categoryCheckNeeded == "YES") { // sfc category check
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                    }
                    else {
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                            + toPlace + "')]");
                    }

                    $('#hdnErrorSFCRowNo').val(id.split('_')[1]);
                    if (disRouteJson != false && disJson != undefined) {
                        if (disRouteJson.length > 1) {
                            fnGetMappedSFC(disRouteJson);
                            return;
                        }
                        else {
                            $("#" + id.replace("txtFromPlace", "hdnRoute")).val('D');
                            $("#" + id.replace("txtFromPlace", "txtDistance")).val(disRouteJson[0].Distance);
                            $("#" + id.replace("txtFromPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                            $("#" + id.replace("txtFromPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace("txtFromPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                            $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                        }
                    }
                    else {
                        if (categoryCheckNeeded == "YES") { // sfc category check
                            var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                                + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                        }
                        else {
                            var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                                + toPlace + "')]");
                        }
                        //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                        //    + toPlace + "'  && @.Travel_Mode=='" + travelMode + "')]");
                        if (disRouteJson != false && disJson != undefined) {
                            if (disRouteJson.length > 1) {
                                fnGetMappedSFC(disRouteJson);
                                return;
                            }
                            else {
                                $("#" + id.replace("txtFromPlace", "hdnRoute")).val('R');
                                $("#" + id.replace("txtFromPlace", "txtDistance")).val(disRouteJson[0].Distance);
                                $("#" + id.replace("txtFromPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                                $("#" + id.replace("txtFromPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                                $("#" + id.replace("txtFromPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                                $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                                $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                            }
                        }
                        else {
                            $(obj).addClass('errorIndicator');
                            $(obj).attr('title', 'Invalid sfc');
                            $("#" + id.replace("txtFromPlace", "txtDistance")).val('0')
                            $("#" + id.replace("txtFromPlace", "txtFare")).val('0')
                            //  $("#" + id.replace("txtFromPlace", "txtTravelMode")).val('')
                            $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val('');
                            $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html('');
                        }
                    }
                }
            }
            else {
                $('#hdnErrorSFCRowNo').val(id.split('_')[1]);
                if (categoryCheckNeeded == "YES") { // sfc category check
                    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                        + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                }
                else {
                    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                        + toPlace + "')]");
                }
                //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                if (disRouteJson != false && disRouteJson != undefined) {
                    if (disRouteJson.length > 1) {
                        fnGetMappedSFC(disRouteJson);
                        return;
                    }
                    else {
                        $("#" + id.replace("txtFromPlace", "txtDistance")).val(disRouteJson[0].Distance);
                        $("#" + id.replace("txtFromPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                        $("#" + id.replace("txtFromPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                        $("#" + id.replace("txtFromPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                        $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                        $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                        $("#" + id.replace("txtFromPlace", "hdnRoute")).val('D');
                    }
                }
                else {
                    if (categoryCheckNeeded == "YES") { // sfc category check
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                    }
                    else {
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                            + toPlace + "')]");
                    }
                    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                    //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                    if (disRouteJson != false && disRouteJson != undefined) {
                        if (disRouteJson.length > 1) {
                            fnGetMappedSFC(disRouteJson);
                            return;
                        }
                        else {
                            $("#" + id.replace("txtFromPlace", "txtDistance")).val(disRouteJson[0].Distance);
                            $("#" + id.replace("txtFromPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                            $("#" + id.replace("txtFromPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace("txtFromPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                            $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                            $("#" + id.replace("txtFromPlace", "hdnRoute")).val('R');
                        }
                    }
                    else {
                        $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val('');
                    }
                }

                //$("#" + id.replace("txtFromPlace", "hdnRoute")).val('D');
                //if (categoryCheckNeeded == "YES") { // sfc category check
                //    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                //        + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                //}
                //else {
                //    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                //        + toPlace + "')]");
                //}
                ////var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                ////    + toPlace + "'  && @.Travel_Mode=='" + travelMode + "')]");

                //if (disRouteJson != false && disJson != undefined) {
                //    $("#" + id.replace("txtFromPlace", "txtDistance")).val(disRouteJson[0].Distance);
                //    $("#" + id.replace("txtFromPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                //    $("#" + id.replace("txtFromPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                //    $("#" + id.replace("txtFromPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                //    $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                //    $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                //    $("#" + id.replace("txtFromPlace", "hdnRoute")).val('D');
                //}
                //else {
                //    if (categoryCheckNeeded == "YES") { // sfc category check
                //        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                //            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                //    }
                //    else {
                //        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                //            + toPlace + "')]");
                //    }
                //    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                //    //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                //    if (disRouteJson != false && disJson != undefined) {
                //        $("#" + id.replace("txtFromPlace", "txtDistance")).val(disRouteJson[0].Distance);
                //        $("#" + id.replace("txtFromPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                //        $("#" + id.replace("txtFromPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                //        $("#" + id.replace("txtFromPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                //        $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                //        $("#" + id.replace("txtFromPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                //        $("#" + id.replace("txtFromPlace", "hdnRoute")).val('R');
                //    }
                //    else {
                //        $("#" + id.replace("txtFromPlace", "hdnDistanceFareCode")).val('');
                //    }
            }
        }
    }
}

function fnGetFare1(obj) {
    $(obj).removeClass('errorIndicator');
    $(obj).removeAttr('title');
    fnValidateAutofill(obj, autoSFC_g, "txtToPlace", "hdnToPlace");



    var flag = true;
    var id = obj.id;
    // var workArea = $.trim($("#" + id.replace("txtToPlace", "txtWorkArea")).val()).toUpperCase();
    var fromPlace = $.trim($("#" + id.replace("txtToPlace", "txtFromPlace")).val()).toUpperCase();
    var toPlace = $.trim($(obj).val()).toUpperCase();
    var travelMode = $.trim($("#" + id.replace("txtToPlace", "txtTravelMode")).val()).toUpperCase();
    var categoryName_s = $("#cboCategory :selected").text().toUpperCase();
    if (fromPlace == "") {
        $("#" + id.replace("txtToPlace", "txtFromPlace")).addClass('errorIndicator');
        $("#" + id.replace("txtToPlace", "txtFromPlace")).attr('title', 'Please select from place');
        flag = false;
    }
    else {
        if ($.trim(fromPlace) != '' && ($.trim($("#" + id.replace("txtToPlace", "hdnFromPlace")).val()) == '' ||
       $("#" + id.replace("txtToPlace", "hdnFromPlace")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
            $("#" + id.replace("txtToPlace", "txtFromPlace")).addClass('errorIndicator');
            $("#" + id.replace("txtToPlace", "txtFromPlace")).attr('title', 'Please select from place');
            flag = false;
        }
        else {
            $("#" + id.replace("txtToPlace", "txtFromPlace")).removeClass('errorIndicator');
            $("#" + id.replace("txtToPlace", "txtFromPlace")).removeAttr('title');
        }
    }
    if (toPlace == "") {
        $(obj).addClass('errorIndicator');
        $(obj).attr('title', 'Please select to place');
        $("#" + id.replace("txtToPlace", "txtDistance")).val('0')
        $("#" + id.replace("txtToPlace", "txtFare")).val('0')
        $("#" + id.replace("txtToPlace", "hdnDistanceFareCode")).val('');
        $("#" + id.replace("txtToPlace", "spnSFCCategory")).html('');
        flag = false;
    }
    else {
        if ($.trim(toPlace) != '' && ($.trim($("#" + id.replace("txtToPlace", "hdnToPlace")).val()) == '' ||
       $("#" + id.replace("txtToPlace", "hdnToPlace")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
            $(obj).addClass('errorIndicator');
            $(obj).attr('title', 'Please select to place');
            $("#" + id.replace("txtToPlace", "txtDistance")).val('0')
            $("#" + id.replace("txtToPlace", "txtFare")).val('0')
            $("#" + id.replace("txtToPlace", "hdnDistanceFareCode")).val('');
            $("#" + id.replace("txtToPlace", "spnSFCCategory")).html('');
            flag = false;
        }
        else {
            $(obj).removeClass('errorIndicator');
            $(obj).removeAttr('title');
        }
    }


    if ($.trim(travelMode) != '' && ($.trim($("#" + id.replace("txtToPlace", "hdnTravelMode")).val()) == '' ||
       $("#" + id.replace("txtToPlace", "hdnTravelMode")).val() == undefined)) {
        $("#" + id.replace("txtToPlace", "txtTravelMode")).addClass('errorIndicator');
        $("#" + id.replace("txtToPlace", "txtTravelMode")).attr('title', 'Please select travel mode');
        flag = false;
    }
    else {
        $("#" + id.replace("txtToPlace", "txtTravelMode")).removeClass('errorIndicator');
        $("#" + id.replace("txtToPlace", "txtTravelMode")).removeAttr('title');
    }
    if (true) {
        //  if ($.trim(fromPlace) != '' && $.trim(toPlace) != '' && $.trim(workArea) != '' && $.trim(travelMode)) {
        if ($.trim(fromPlace) != '' && $.trim(toPlace) != '') {
            $("#" + id.replace("txtToPlace", "txtFromPlace")).removeClass('errorIndicator');
            $("#" + id.replace("txtToPlace", "txtTravelMode")).removeClass('errorIndicator');
            $(obj).removeClass('errorIndicator');
            if (PriFareEdit_g == "RIGID_PLACE") {
                if (autoSFC_g != '') {
                    var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' || @.To_Region_Name=='" + fromPlace + "')]");
                    if (disJson == false && disJson != undefined) {
                        $("#" + id.replace("txtToPlace", "txtFromPlace")).addClass('errorIndicator');
                        $("#" + id.replace("txtToPlace", "txtFromPlace")).attr('title', 'Invalid from place');
                    }
                    else {
                        $("#" + id.replace("txtToPlace", "txtFromPlace")).removeClass('errorIndicator');
                        $("#" + id.replace("txtToPlace", "txtFromPlace")).removeAttr('title');
                    }
                    var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + toPlace + "' || @.To_Region_Name=='" + toPlace + "')]");
                    if (disJson == false && disJson != undefined) {
                        $(obj).addClass('errorIndicator');
                        $(obj).attr('title', 'Invalid to place');
                    }
                    else {
                        $(obj).removeClass('errorIndicator');
                        $(obj).removeAttr('title');
                    }

                    $('#hdnErrorSFCRowNo').val(id.split('_')[1]);
                    if (categoryCheckNeeded == "YES") { // sfc category check
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                    }
                    else {
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                            + toPlace + "')]");
                    }
                    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                    //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                    if (disRouteJson != false && disRouteJson != undefined) {
                        if (disRouteJson.length > 1) {
                            fnGetMappedSFC(disRouteJson);
                            return;
                        }
                        else {
                            $("#" + id.replace("txtToPlace", "hdnRoute")).val('D');
                            $("#" + id.replace("txtToPlace", "txtDistance")).val(disRouteJson[0].Distance);
                            $("#" + id.replace("txtToPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                            $("#" + id.replace("txtToPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace("txtToPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace("txtToPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                            $("#" + id.replace("txtToPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                        }
                    }
                    else {
                        if (categoryCheckNeeded == "YES") { // sfc category check
                            var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                                + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                        }
                        else {
                            var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                                + toPlace + "')]");
                        }
                        //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                        //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                        if (disRouteJson != false && disRouteJson != undefined) {
                            if (disRouteJson.length > 1) {
                                fnGetMappedSFC(disRouteJson);
                                return;
                            }
                            else {
                                $("#" + id.replace("txtToPlace", "hdnRoute")).val('R');
                                $("#" + id.replace("txtToPlace", "txtDistance")).val(disRouteJson[0].Distance);
                                $("#" + id.replace("txtToPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                                $("#" + id.replace("txtToPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                                $("#" + id.replace("txtToPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                                $("#" + id.replace("txtToPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                                $("#" + id.replace("txtToPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                            }
                        }
                        else {
                            $(obj).addClass('errorIndicator');
                            $(obj).attr('title', 'Invalid sfc');
                            $("#" + id.replace("txtToPlace", "txtDistance")).val('0')
                            $("#" + id.replace("txtToPlace", "txtFare")).val('0')
                            //  $("#" + id.replace("txtToPlace", "txtTravelMode")).val('')
                            $("#" + id.replace("txtToPlace", "hdnDistanceFareCode")).val('');
                            $("#" + id.replace("txtToPlace", "spnSFCCategory")).html('');
                        }
                    }
                }
            }
            else {
                $('#hdnErrorSFCRowNo').val(id.split('_')[1]);
                if (categoryCheckNeeded == "YES") { // sfc category check
                    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                        + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                }
                else {
                    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                        + toPlace + "')]");
                }
                //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                if (disRouteJson != false && disRouteJson != undefined) {
                    if (disRouteJson.length > 1) {
                        fnGetMappedSFC(disRouteJson);
                        return;
                    }
                    else {
                        $("#" + id.replace("txtToPlace", "txtDistance")).val(disRouteJson[0].Distance);
                        $("#" + id.replace("txtToPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                        $("#" + id.replace("txtToPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                        $("#" + id.replace("txtToPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                        $("#" + id.replace("txtToPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                        $("#" + id.replace("txtToPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                        $("#" + id.replace("txtToPlace", "hdnRoute")).val('D');
                    }
                }
                else {
                    if (categoryCheckNeeded == "YES") { // sfc category check
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                    }
                    else {
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                            + toPlace + "')]");
                    }
                    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                    //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                    if (disRouteJson != false && disRouteJson != undefined) {
                        if (disRouteJson.length > 1) {
                            fnGetMappedSFC(disRouteJson);
                            return;
                        }
                        else {
                            $("#" + id.replace("txtToPlace", "txtDistance")).val(disRouteJson[0].Distance);
                            $("#" + id.replace("txtToPlace", "txtFare")).val(disRouteJson[0].Fare_Amount);
                            $("#" + id.replace("txtToPlace", "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace("txtToPlace", "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace("txtToPlace", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                            $("#" + id.replace("txtToPlace", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                            $("#" + id.replace("txtToPlace", "hdnRoute")).val('R');
                        }
                    }
                    else {
                        $("#" + id.replace("txtToPlace", "hdnDistanceFareCode")).val('');
                    }
                }
            }
        }
    }
}

function fnGetFareByTravelMode(obj) {
    debugger;
    $(obj).removeClass('errorIndicator');
    $(obj).removeAttr('title');

    fnValidateAutofill(obj, travelMode_g, "txtTravelMode", "hdnTravelMode");
    
    var flag = true;
    var id = obj.id;
    // var workArea = $.trim($("#" + id.replace("txtTravelMode", "txtWorkArea")).val()).toUpperCase();
    var fromPlace = $.trim($("#" + id.replace("txtTravelMode", "txtFromPlace")).val()).toUpperCase();
    var toPlace = $.trim($("#" + id.replace("txtTravelMode", "txtToPlace")).val()).toUpperCase();
    var travelMode = $.trim($(obj).val()).toUpperCase();
    var categoryName_s = $("#cboCategory :selected").text().toUpperCase();
    if (fromPlace == "") {
        $("#" + id.replace("txtTravelMode", "txtFromPlace")).addClass('errorIndicator');
        $("#" + id.replace("txtTravelMode", "txtFromPlace")).attr('title', 'Please select from place');
        flag = false;
    }
    else {
        if ($.trim(fromPlace) != '' && ($.trim($("#" + id.replace("txtTravelMode", "hdnFromPlace")).val()) == '' ||
             $("#" + id.replace("txtTravelMode", "hdnFromPlace")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
            $("#" + id.replace("txtTravelMode", "txtFromPlace")).addClass('errorIndicator');
            $("#" + id.replace("txtTravelMode", "txtFromPlace")).attr('title', 'Please select from place');
            flag = false;
        }
        else {
            $("#" + id.replace("txtTravelMode", "txtFromPlace")).removeClass('errorIndicator');
            $("#" + id.replace("txtTravelMode", "txtFromPlace")).removeAttr('title');
        }
    }
    if (toPlace == "") {
        $("#" + id.replace("txtTravelMode", "txtToPlace")).addClass('errorIndicator');
        $("#" + id.replace("txtTravelMode", "txtToPlace")).attr('title', 'Please select to place');
        flag = false;
    }
    else {
        if ($.trim(toPlace) != '' && ($.trim($("#" + id.replace("txtTravelMode", "hdnToPlace")).val()) == '' ||
        $("#" + id.replace("txtTravelMode", "hdnToPlace")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
            $(obj).addClass('errorIndicator');
            $(obj).attr('title', 'Please select to place');
            flag = false;
        }
        else {
            $("#" + id.replace("txtTravelMode", "txtFromPlace")).removeClass('errorIndicator');
            $("#" + id.replace("txtTravelMode", "txtFromPlace")).removeAttr('title');
        }
    }
    if (travelMode == "") {
        $(obj).addClass('errorIndicator');
        $(obj).attr('title', 'Please select travel mode');
        $("#" + id.replace("txtTravelMode", "txtDistance")).val('0')
        $("#" + id.replace("txtTravelMode", "txtFare")).val('0')
        $("#" + id.replace("txtTravelMode", "hdnDistanceFareCode")).val('');
        $("#" + id.replace("txtTravelMode", "spnSFCCategory")).html('');
        flag = false;
    }
    else {
        if ($.trim(travelMode) != '' && ($("#" + id.replace("txtTravelMode", "hdnTravelMode")).val() == '' ||
             $("#" + id.replace("txtTravelMode", "hdnTravelMode")).val() == undefined)) {
            $(obj).addClass('errorIndicator');
            $(obj).attr('title', 'Please select travel mode');
            $("#" + id.replace("txtTravelMode", "txtDistance")).val('0')
            $("#" + id.replace("txtTravelMode", "txtFare")).val('0')
            $("#" + id.replace("txtTravelMode", "hdnDistanceFareCode")).val('');
            $("#" + id.replace("txtTravelMode", "spnSFCCategory")).html('');
            flag = false;
        }
        else {
            $(obj).removeClass('errorIndicator');
            $(obj).removeAttr('title');
        }
        //$(obj).removeClass('errorIndicator');
        //$(obj).removeAttr('title');
    }



    if (flag) {
        // if ($.trim(fromPlace) != '' && $.trim(toPlace) != '' && $.trim(workArea) != '' && $.trim(travelMode) != '') {
        if ($.trim(fromPlace) != '' && $.trim(toPlace) != '') {
            $("#" + id.replace("txtTravelMode", "txtFromPlace")).removeClass('errorIndicator');
            $("#" + id.replace("txtTravelMode", "txtToPlace")).removeClass('errorIndicator');
            $(obj).removeClass('errorIndicator');
            if (PriFareEdit_g == "RIGID_PLACE") {
                if (autoSFC_g != '') {
                    var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' || @.To_Region_Name=='" + fromPlace + "')]");
                    if (disJson == false && disJson != undefined) {
                        $("#" + id.replace("txtTravelMode", "txtFromPlace")).addClass('errorIndicator');
                        $("#" + id.replace("txtTravelMode", "txtFromPlace")).attr('title', 'Invalid from place');
                    }
                    else {
                        $("#" + id.replace("txtTravelMode", "txtFromPlace")).removeClass('errorIndicator');
                        $("#" + id.replace("txtTravelMode", "txtFromPlace")).removeAttr('title');
                    }
                    var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + toPlace + "' || @.To_Region_Name=='" + toPlace + "')]");
                    if (disJson == false && disJson != undefined) {
                        $("#" + id.replace("txtTravelMode", "txtToPlace")).addClass('errorIndicator');
                        $("#" + id.replace("txtTravelMode", "txtToPlace")).attr('title', 'Invalid to place');
                    }
                    else {
                        $("#" + id.replace("txtTravelMode", "txtToPlace")).removeClass('errorIndicator');
                        $("#" + id.replace("txtTravelMode", "txtToPlace")).removeAttr('title');
                    }

                    $('#hdnErrorSFCRowNo').val(id.split('_')[1]);
                    if (categoryCheckNeeded == "YES") { // sfc category check
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                    }
                    else {
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                            + toPlace + "')]");
                    }
                    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                    //                            + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                    if (disRouteJson != false && disRouteJson != undefined) {
                        if (disRouteJson.length > 1) {
                            fnGetMappedSFC(disRouteJson);
                            return;
                        }
                        else {
                            var travelid = obj.id;
                            var travelmode = $('#' + travelid).val();
                            var disJson = jsonPath(travelMode_g, "$.[?(@.label=='" + travelmode + "')]");
                            if (disJson == false && disJson != undefined) {
                                $(obj).addClass('errorIndicator');
                                $(obj).attr('title', 'Invalid Travel Mode.');
                            }
                            else {
                                $("#" + id.replace("txtTravelMode", "txtToPlace")).removeClass('errorIndicator');
                                $("#" + id.replace("txtTravelMode", "txtToPlace")).removeAttr('title');
                                $("#" + id.replace("txtTravelMode", "hdnRoute")).val('R');
                                $("#" + id.replace("txtTravelMode", "txtDistance")).val(disRouteJson[0].Distance);
                                $("#" + id.replace("txtTravelMode", "txtFare")).val(disRouteJson[0].Fare_Amount);
                                $("#" + id.replace("txtTravelMode", "txtTravelMode")).val(travelmode);
                                $("#" + id.replace("txtTravelMode", "hdnTravelMode")).val(travelmode);
                                $("#" + id.replace("txtTravelMode", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                                $("#" + id.replace("txtTravelMode", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                            }
                        }
                    }
                    else {
                        if (categoryCheckNeeded == "YES") { // sfc category check
                            var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                                + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                        }
                        else {
                            var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                                + toPlace + "')]");
                        }
                        //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                        //    + toPlace + "'  && @.Travel_Mode=='" + travelMode + "')]");
                        if (disRouteJson != false && disRouteJson != undefined) {
                            if (disRouteJson.length > 1) {
                                fnGetMappedSFC();
                                return;
                            }
                            else {
                                var travelid = obj.id;
                                var travelmode = $('#' + travelid).val();
                                var disJson = jsonPath(travelMode_g, "$.[?(@.label=='" + travelmode + "')]");
                                if (disJson == false && disJson != undefined) {
                                    $(obj).addClass('errorIndicator');
                                    $(obj).attr('title', 'Invalid Travel Mode.');
                                }
                                else {
                                    $("#" + id.replace("txtTravelMode", "txtToPlace")).removeClass('errorIndicator');
                                    $("#" + id.replace("txtTravelMode", "txtToPlace")).removeAttr('title');
                                    $("#" + id.replace("txtTravelMode", "hdnRoute")).val('R');
                                    $("#" + id.replace("txtTravelMode", "txtDistance")).val(disRouteJson[0].Distance);
                                    $("#" + id.replace("txtTravelMode", "txtFare")).val(disRouteJson[0].Fare_Amount);
                                    $("#" + id.replace("txtTravelMode", "txtTravelMode")).val(travelmode);
                                    $("#" + id.replace("txtTravelMode", "hdnTravelMode")).val(travelmode);
                                    $("#" + id.replace("txtTravelMode", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                                    $("#" + id.replace("txtTravelMode", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                                }
                            }
                        }
                        else {
                            $(obj).addClass('errorIndicator');
                            $(obj).attr('title', 'Invalid sfc');
                            $("#" + id.replace("txtTravelMode", "txtDistance")).val('0')
                            $("#" + id.replace("txtTravelMode", "txtFare")).val('0')
                            // $("#" + id.replace("txtTravelMode", "txtTravelMode")).val('')
                            $("#" + id.replace("txtTravelMode", "hdnDistanceFareCode")).val('');
                            $("#" + id.replace("txtTravelMode", "spnSFCCategory")).html('');
                        }
                    }
                }
            }
            else {
                $('#hdnErrorSFCRowNo').val(id.split('_')[1]);
                if (categoryCheckNeeded == "YES") { // sfc category check
                    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                        + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                }
                else {
                    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                        + toPlace + "')]");
                }
                //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                if (disRouteJson != false && disRouteJson != undefined) {
                    if (disRouteJson.length > 1) {
                        fnGetMappedSFC(disRouteJson);
                        return;
                    }
                    else {
                        var travelid = obj.id;
                        var travelmode = $('#' + travelid).val();
                        var disJson = jsonPath(travelMode_g, "$.[?(@.label=='" + travelmode + "')]");
                        if (disJson == false && disJson != undefined) {
                            $(obj).addClass('errorIndicator');
                            $(obj).attr('title', 'Invalid Travel Mode.');
                        }
                        else {
                            $("#" + id.replace("txtTravelMode", "txtToPlace")).removeClass('errorIndicator');
                            $("#" + id.replace("txtTravelMode", "txtToPlace")).removeAttr('title');
                            $("#" + id.replace("txtTravelMode", "hdnRoute")).val('R');
                            $("#" + id.replace("txtTravelMode", "txtDistance")).val(disRouteJson[0].Distance);
                            $("#" + id.replace("txtTravelMode", "txtFare")).val(disRouteJson[0].Fare_Amount);
                            $("#" + id.replace("txtTravelMode", "txtTravelMode")).val(travelmode);
                            $("#" + id.replace("txtTravelMode", "hdnTravelMode")).val(travelmode);
                            $("#" + id.replace("txtTravelMode", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                            $("#" + id.replace("txtTravelMode", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                        }
                    }
                }
                else {
                    if (categoryCheckNeeded == "YES") { // sfc category check
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                    }
                    else {
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                            + toPlace + "')]");
                    }
                    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                    //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                    if (disRouteJson != false && disRouteJson != undefined) {
                        if (disRouteJson.length > 1) {
                            fnGetMappedSFC(disRouteJson);
                            return;
                        }
                        else {
                            var travelid = obj.id;
                            var travelmode = $('#' + travelid).val();
                            var disJson = jsonPath(travelMode_g, "$.[?(@.label=='" + travelmode + "')]");
                            if (disJson == false && disJson != undefined) {
                                $(obj).addClass('errorIndicator');
                                $(obj).attr('title', 'Invalid Travel Mode.');
                            }
                            else {
                                $("#" + id.replace("txtTravelMode", "txtToPlace")).removeClass('errorIndicator');
                                $("#" + id.replace("txtTravelMode", "txtToPlace")).removeAttr('title');
                                $("#" + id.replace("txtTravelMode", "hdnRoute")).val('R');
                                $("#" + id.replace("txtTravelMode", "txtDistance")).val(disRouteJson[0].Distance);
                                $("#" + id.replace("txtTravelMode", "txtFare")).val(disRouteJson[0].Fare_Amount);
                                $("#" + id.replace("txtTravelMode", "txtTravelMode")).val(travelmode);
                                $("#" + id.replace("txtTravelMode", "hdnTravelMode")).val(travelmode);
                                $("#" + id.replace("txtTravelMode", "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                                $("#" + id.replace("txtTravelMode", "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                            }
                        }
                    }
                    else {
                        $("#" + id.replace("txtTravelMode", "hdnDistanceFareCode")).val('');
                    }
                }
            }
        }
    }
}

function fnCreateDoctorTable() {
    var tblContent = "";
    tblContent += '<table id="tblDoctors" class="table table-striped"><thead><tr><td>Doctor Name</td><td>Category</td><td>Qualification</td><td>Delete</td></tr>';
    tblContent += '</thead><tbody>';
    tblContent += '<tr><td><input type="text" id="txtDoctorName_1" class="autoDoctor form-control" ondblclick="fnCreateDoctorTableNewRow(this);"';
    tblContent += '  /><input type="hidden" id="hdnDoctorCode_1" /></td>';
    tblContent += '<td><span id="spnCategory_1"></span></td>';
    tblContent += '<td><span id="spnQualification_1"></span></td><td><div id="dvDelete_1" class="docProDelete" ondblclick="fnDelete(this);"></div></td></tr>';
    tblContent += '<tr><td><input type="text" id="txtDoctorName_2" class="autoDoctor form-control" ondblclick="fnCreateDoctorTableNewRow(this);"';
    tblContent += '  /><input type="hidden" id="hdnDoctorCode_2" /></td>';
    tblContent += '<td><span id="spnCategory_2"></span></td>';
    tblContent += '<td><span id="spnQualification_2"></span></td><td><div id="dvDelete_2" class="docProDelete" onclick="fnDelete(this);"></div></td></tr></tbody></table>';
    $('#dvDoctors').html(tblContent);
    docRowNum = 3;

    autoComplete(autoDoctor_g, "txtDoctorName", "hdnDoctorCode", "autoDoctor");
    $('.autoDoctor').bind('blur', function () { fnGetCategory(this); });
    $('.timepicker').timepicker({
        showPeriod: true,
        showLeadingZero: true
    });
    $('#dvSubmitButton').show();
    $('.showDoc').show();
}
function fnCreateDoctorTableNewRow(obj) {
    var id = obj.id;
    if (obj == "EDIT") {
        var currentId = docRowNum - 1;
    }
    else {
        currentId = id.split('_')[1]
    }
    if (currentId == parseInt(docRowNum) - 1) {
        var rCnt = document.getElementById("tblDoctors").getElementsByTagName("tr").length;
        var newRow = document.getElementById("tblDoctors").insertRow(parseInt(rCnt));
        var tdDoctorName = newRow.insertCell(0);
        // var tdTime = newRow.insertCell(1);
        var tdDocCategory = newRow.insertCell(1);
        var tdDocQualification = newRow.insertCell(2);
        var tdDocDelete = newRow.insertCell(3);
        //onkeypress="fnCreateDoctorTableNewRow(this);"
        $(tdDoctorName).html('<input type="text" id="txtDoctorName_' + docRowNum
                                        + '" class="autoDoctor form-control" maxlength="50"  ondblclick="fnCreateDoctorTableNewRow(this);"/><input type="hidden" id="hdnDoctorCode_'
                                        + docRowNum + '" />');
        // $(tdTime).html('<input type="text" id="txtTime_' + docRowNum + '" class="timepicker form-control" />');
        $(tdDocCategory).html('<span id="spnCategory_' + docRowNum + '"></span>');
        $(tdDocQualification).html('<span id="spnQualification_' + docRowNum + '"></span>');
        $(tdDocDelete).html('<div id="dvDelete_' + docRowNum + '" class="docProDelete" onclick="fnDelete(this);"></div>');
        docRowNum = parseInt(docRowNum) + 1;
        $(".clsDecimal").keypress(function () { return fnIsNumeric(event) });
        $(".clsDecimal").blur(function () { if (!fnCheckMaxLimit(this, "FLOAT")) { $(this).val('0'); } });
        //$('.timepicker').timepicker({
        //    showPeriod: true,
        //    showLeadingZero: true
        //});

    }
    var rCnt = $("#tblDoctors tr").length;
    for (var k = 1; k <= rCnt; k++) {
        $("#txtDoctorName_" + k).unautocomplete();
    }

    autoComplete(autoDoctor_g, "txtDoctorName", "hdnDoctorCode", "autoDoctor");
    $('.autoDoctor').bind('blur', function () { fnGetCategory(this); });
}
function fnGetCategory(obj) {

    fnValidateAutofill(obj, autoDoctor_g, "txtDoctorName", "hdnDoctorCode");
    var id = obj.id

    //if (obj == "EDIT") {
    //    var currentId = docRowNum - 1;
    //}
    //else {
    //    currentId = id.split('_')[1]
    //}
    //if (currentId == parseInt(docRowNum) - 1) {
    //    var rCnt = document.getElementById("tblDoctors").getElementsByTagName("tr").length;
    //    var newRow = document.getElementById("tblDoctors").insertRow(parseInt(rCnt));
    //    var tdDoctorName = newRow.insertCell(0);
    //    var tdTime = newRow.insertCell(1);
    //    var tdDocCategory = newRow.insertCell(2);
    //    var tdDocQualification = newRow.insertCell(3);
    //    var tdDocDelete = newRow.insertCell(4);
    //    $(tdDoctorName).html('<input type="text" id="txtDoctorName_' + docRowNum
    //                                    + '" class="autoDoctor form-control" onkeypress="fnCreateDoctorTableNewRow(this);" maxlength=50  ondblclick="fnCreateDoctorTableNewRow(this);" onblur="fnGetCategory(this);"/><input type="hidden" id="hdnDoctorCode_'
    //                                    + docRowNum + '" />');
    //    $(tdTime).html('<input type="text" id="txtTime_' + docRowNum + '" class="timepicker form-control" />');
    //    $(tdDocCategory).html('<span id="spnCategory_' + docRowNum + '"></span>');
    //    $(tdDocQualification).html('<span id="spnQualification_' + docRowNum + '"></span>');
    //    $(tdDocDelete).html('<div id="dvDelete_' + docRowNum + '" class="docProDelete" onclick="fnDelete(this);"></div>');
    //    docRowNum = parseInt(docRowNum) + 1;
    //    $(".clsDecimal").keypress(function () { return fnIsNumeric(event) });
    //    $(".clsDecimal").blur(function () { fnCheckNumeric(this) });
    //    $('.timepicker').timepicker({
    //        showPeriod: true,
    //        showLeadingZero: true
    //    });
    //}
    // autoComplete(autoDoctor_g, "txtDoctorName", "hdnDoctorCode", "autoDoctor");
    //if (obj != "EDIT") {
    if ($(obj).val() != '') {
        var doctorCode = $("#" + id.replace("txtDoctorName", "hdnDoctorCode")).val();
        if (doctorCode == undefined || doctorCode == '' || doctorCode == null) {
            //$(obj).addClass('errorIndicator');
            //$(obj).attr('title', 'Please select a valid doctor name');
            return true;
        }
        else {
            $(obj).removeClass('errorIndicator');
            $(obj).removeAttr('title', '');
            if (jsonDoctor_g != '') {
                var disJson = jsonPath(jsonDoctor_g, "$.[?(@.Customer_Code=='" + doctorCode + "')]");
                if (disJson != false) {
                    $("#" + id.replace("txtDoctorName", "spnCategory")).html(disJson[0].Category_Name);
                    $("#" + id.replace("txtDoctorName", "spnQualification")).html(disJson[0].Qualification);
                }
                else {
                    $(obj).addClass('errorIndicator');
                    $(obj).attr('title', 'Please select a valid doctor name');
                    $("#" + id.replace("txtDoctorName", "spnCategory")).html('');
                    $("#" + id.replace("txtDoctorName", "spnQualification")).html('');
                }
            }
        }
    }
    else {
        $("#" + id.replace("txtDoctorName", "spnCategory")).html('');
        $("#" + id.replace("txtDoctorName", "spnQualification")).html('');
    }
    fnCreateDoctorTableNewRow(obj);
    return true;
    //}

}
function fnGetCPDetails() {
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        var regionCode = regionTree.getActiveNode().data.key;
        $('#dvCPMain').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Activity/CampaignPlanner/GetCPDetails/',
            type: "POST",
            data: "regionCode=" + regionCode + "",
            success: function (jsResult) {
                if (jsResult != '') {
                    $("#dvEditCP").html(jsResult.split('$')[0]);
                    if (jsResult.split('$')[1] != '') {
                        var cpDetails = eval('(' + jsResult.split('$')[1].split('^')[0] + ')');
                        jsonCPDetails_g = cpDetails;
                        $("#lnkExcel").attr("href", jsResult.split('$')[1].split('^')[1]);
                    }
                }
            },
            error: function () {
                $("#dvCPMain").unblock();
            },
            complete: function () {
                $("#dvCPMain").unblock();
            }
        });
    }
}
function fnEditCPDetails(cpCode) {
    $("#dvInsertCP .errorIndicator").removeClass('errorIndicator');
    $("#hdnMode").val("EDIT");
    //GetModifiedCPSFCDetails
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        var regionCode = regionTree.getActiveNode().data.key;
        $.ajax({
            url: '../HiDoctor_Activity/CampaignPlanner/GetModifiedCPSFCDetails/',
            type: "POST",
            data: "regionCode=" + regionCode + "&cpCode=" + cpCode + "",
            success: function (jsResult) {
                if (jsResult != '') {
                    
                    var modifiedSFCJson = eval('(' + jsResult + ')');
                    if (modifiedSFCJson.Tables[1].Rows[0].Modified == "Y") {
                        if (confirm('Your SFC has been modified after you entered CP. System will prefill the updated SFC now. Click  OK button to continue')) {
                            fnFillCPDetails(cpCode, modifiedSFCJson);
                        }
                    }
                    else {
                        fnFillCPDetails(cpCode, modifiedSFCJson);
                    }
                }
            },
            error: function () {
            },
            complete: function () {
                $("#dvCPMain").unblock();
            }
        });
    }

}

function fnFillCPDetails(cpCode, jsResult) {
    if (jsonCPDetails_g != '') {
        $('#dvCPMain').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        
        var disCPJson = jsonPath(jsonCPDetails_g, "$.Tables[0].Rows[?(@.CP_Code =='" + cpCode + "')]");
        if (disCPJson != false) {
            $('#hdnCPCode').val(disCPJson[0].CP_Code);
            $('#txtCPName').val(disCPJson[0].CP_Name.substring(2));
            $('#cboCategory').val(disCPJson[0].Category_Code);
            $('#txtWorkArea').val(disCPJson[0].Work_Area);
            $('#hdnWorkArea').val(disCPJson[0].Work_Area);

            //Fill SFC Autocomplete
            //var arSFC = new Array();
            //if ($.inArray("CP", PriCategoryCheck_g) == -1) {
            //    for (var s = 0; s < jsonSFC_g.length; s++) {
            //        if (jsonSFC_g[s].Category_Name.toUpperCase() == $("#cboCategory :selected").text().toUpperCase()) {
            //            if ($.inArray(jsonSFC_g[s].From_Region_Name.toUpperCase(), arSFC) == -1) {
            //                arSFC.push(jsonSFC_g[s].From_Region_Name.toUpperCase());
            //            }
            //            if ($.inArray(jsonSFC_g[s].To_Region_Name.toUpperCase(), arSFC) == -1) {
            //                arSFC.push(jsonSFC_g[s].To_Region_Name.toUpperCase());
            //            }
            //        }
            //    }
            //}
            //else {
            //    for (var s = 0; s < allSFCJson_g.length; s++) {
            //        if ($.inArray(allSFCJson_g[s].From_Region_Name.toUpperCase(), arSFC) == -1) {
            //            arSFC.push(allSFCJson_g[s].From_Region_Name.toUpperCase());
            //        }
            //        if ($.inArray(allSFCJson_g[s].To_Region_Name.toUpperCase(), arSFC) == -1) {
            //            arSFC.push(allSFCJson_g[s].To_Region_Name.toUpperCase());
            //        }
            //    }
            //}
            var arSFC = new Array();
            jsonSFC_g = new Array();
            if ($.inArray("CP", PriCategoryCheck_g) == -1) {
                for (var s = 0; s < allSFCJson_g.length; s++) {
                    var sfc = {};
                    if (allSFCJson_g[s].Category_Name.toUpperCase() == $("#cboCategory :selected").text().toUpperCase()) {
                        if ($.inArray(allSFCJson_g[s].From_Region_Name.toUpperCase(), arSFC) == -1) {
                            arSFC.push(allSFCJson_g[s].From_Region_Name.toUpperCase());
                        }
                        if ($.inArray(allSFCJson_g[s].To_Region_Name.toUpperCase(), arSFC) == -1) {
                            arSFC.push(allSFCJson_g[s].To_Region_Name.toUpperCase());
                        }
                        sfc.Category_Name = allSFCJson_g[s].Category_Name;
                        sfc.Distance = allSFCJson_g[s].Distance;
                        sfc.Distance_Fare_Code = allSFCJson_g[s].Distance_Fare_Code;
                        sfc.Fare_Amount = allSFCJson_g[s].Fare_Amount;
                        sfc.From_Region_Name = allSFCJson_g[s].From_Region_Name;
                        sfc.SFC_Version_No = allSFCJson_g[s].SFC_Version_No;
                        sfc.SFC_Visit_Count = allSFCJson_g[s].SFC_Visit_Count;
                        sfc.To_Region_Name = allSFCJson_g[s].To_Region_Name;
                        sfc.Travel_Mode = allSFCJson_g[s].Travel_Mode;
                        jsonSFC_g.push(sfc);
                    }
                }
            }
            else {
                for (var s = 0; s < allSFCJson_g.length; s++) {
                    if ($.inArray(allSFCJson_g[s].From_Region_Name.toUpperCase(), arSFC) == -1) {
                        arSFC.push(allSFCJson_g[s].From_Region_Name.toUpperCase());
                    }
                    if ($.inArray(allSFCJson_g[s].To_Region_Name.toUpperCase(), arSFC) == -1) {
                        arSFC.push(allSFCJson_g[s].To_Region_Name.toUpperCase());
                    }

                }
                jsonSFC_g.push(allSFCJson_g);
            }
            $('.autoWorkArea').unautocomplete();
            $('.autoFromPlace').unautocomplete();
            $('.autoToPlace').unautocomplete();
            var sfc = "[";
            for (var i = 0; i < arSFC.length; i++) {
                sfc += "{label:" + '"' + "" + arSFC[i] + "" + '",' + "value:" + '"' + "" + arSFC[i] + "" + '"' + "},";
            }
            if (arSFC.length > 0) {
                sfc = sfc.slice(0, -1);
            }
            sfc += "];";
            autoSFC_g = eval(sfc);


            if (jsonCPDetails_g.Tables[1] != undefined) {
                var disHop = jsonPath(jsonCPDetails_g, "$.Tables[1].Rows[?(@.CP_Code =='" + cpCode + "')]");

                var sfcContent = "";
                sfcContent += '<table id="tblSFC" class="table table-striped"><thead> <tr>';
                //sfcContent += '<th>Work Area</th>';
                sfcContent += '<th>From Place</th> <th>To Place</th><th>Travel Mode</th>  <th>SFC Category</th><th>Distance</th>';
                sfcContent += '<th>Fare</th> </tr> </thead><tbody>';


                if (jsResult != false) {
                    if (jsResult.Tables[0].Rows.length > 0) {

                        var cateName = $("#cboCategory :selected").text().toUpperCase();
                        
                        if ($.inArray(cateName, PriInterPlace_g) == -1) {
                            for (var j = 1; j <= 1; j++) {
                                var i = parseInt(j) - 1;
                                sfcContent += '<tr>';
                                var fromPlaceReadonly = "disabled='disabled'";
                                if (j == 1) {
                                    fromPlaceReadonly = "";
                                }

                                if (jsResult.Tables[0].Rows[i].Route_Way == "R") {
                                    sfcContent += '<td><input type="text" ' + fromPlaceReadonly + ' id="txtFromPlace_' + j + '" class="autoFromPlace form-control" maxlength=50 value ="'
                                     + jsResult.Tables[0].Rows[i].To_Region_Name + '"onblur="fnGetFare(this);"/>';
                                    sfcContent += '<input type="hidden" id="hdnFromPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].To_Region_Name + '"/></td>';
                                    sfcContent += '<td> <input type="text" id="txtToPlace_' + j + '" class="autoToPlace form-control" maxlength=50 value ="'
                                        + jsResult.Tables[0].Rows[i].From_Region_Name + '" onblur="fnCreateSFCNewRow(this);fnGetFare(this);" ' + ' />';
                                    sfcContent += '<input type="hidden" id="hdnToPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].From_Region_Name + '"/></td>';
                                }
                                else {
                                    sfcContent += '<td><input type="text" ' + fromPlaceReadonly + ' id="txtFromPlace_' + j + '" class="autoFromPlace form-control" maxlength=50 value ="'
                                    + jsResult.Tables[0].Rows[i].From_Region_Name + '"onblur="fnGetFare(this)"  />';
                                    sfcContent += '<input type="hidden" id="hdnFromPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].From_Region_Name + '"/></td>';
                                    sfcContent += '<td> <input type="text" id="txtToPlace_' + j + '" class="autoToPlace form-control" maxlength=50 value ="'
                                        + jsResult.Tables[0].Rows[i].To_Region_Name + '" onblur="fnCreateSFCNewRow(this);fnGetFare(this);"/>';
                                    sfcContent += '<input type="hidden" id="hdnToPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].To_Region_Name + '"/></td>';
                                }
                                sfcContent += '<td><input type="text" id="txtTravelMode_' + j + '" class="form-control autoTravelMode" maxlength=30 value ="'
                                + jsResult.Tables[0].Rows[i].Travel_Mode + '" onblur="fnGetFare(this)"/>';
                                sfcContent += '<input type="hidden" id="hdnTravelMode_' + j + '" value ="' + jsResult.Tables[0].Rows[i].Travel_Mode + '"/>';
                                sfcContent += '<td><span id="spnSFCCategory_' + j + '">' + jsResult.Tables[0].Rows[i].Category_Name + '</span></td>';
                                if (PriFareEdit_g == "RIGID_PLACE") {
                                    sfcContent += '<td><input type="text" id="txtDistance_' + j + '" class="form-control clsDecimal" readonly=readonly value ="'
                                                    + jsResult.Tables[0].Rows[i].Distance + '" /></td>';
                                    sfcContent += '<td> <input type="text" id="txtFare_' + j + '" class="form-control clsDecimal" readonly=readonly value ="'
                                                + jsResult.Tables[0].Rows[i].Fare_Amount + '"/> </td>';
                                }
                                else {
                                    sfcContent += '<td><input type="text" id="txtDistance_' + j + '" class="form-control clsDecimal" value ="'
                                        + jsResult.Tables[0].Rows[i].Distance + '" /></td>';
                                    sfcContent += '<td> <input type="text" id="txtFare_' + j + '" class="form-control clsDecimal"  value ="'
                                        + jsResult.Tables[0].Rows[i].Fare_Amount + '"/> </td>';
                                }

                                sfcContent += ' <input type="hidden" id="hdnDistanceFareCode_' + j + '" value="' + jsResult.Tables[0].Rows[i].Distance_Fare_Code + '"/>';
                                sfcContent += '<input type="hidden" id="hdnRoute_' + j + '" value="' + jsResult.Tables[0].Rows[i].Route_Way + '"/></td></tr>';
                            }
                            cpRowNum = 2;
                        }
                        else {
                            var cateName = $("#cboCategory :selected").text().toUpperCase();
                            if (cateName.toUpperCase() != "HQ") {// Other than HQ and Mapped the Intermediate Places.
                                for (var j = 1; j <= jsResult.Tables[0].Rows.length; j++) {
                                    var i = parseInt(j) - 1;
                                    sfcContent += '<tr>';
                                    var fromPlaceReadonly = "disabled='disabled'";
                                    if (j == 1) {
                                        fromPlaceReadonly = "";
                                    }

                                    if (jsResult.Tables[0].Rows[i].Route_Way == "R") {
                                        sfcContent += '<td><input type="text" ' + fromPlaceReadonly + ' id="txtFromPlace_' + j + '" class="autoFromPlace form-control" maxlength=50 value ="'
                                         + jsResult.Tables[0].Rows[i].To_Region_Name + '"onblur="fnGetFare(this);"/>';
                                        sfcContent += '<input type="hidden" id="hdnFromPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].To_Region_Name + '"/></td>';
                                        sfcContent += '<td> <input type="text" id="txtToPlace_' + j + '" class="autoToPlace form-control" maxlength=50 value ="'
                                            + jsResult.Tables[0].Rows[i].From_Region_Name + '" onblur="fnCreateSFCNewRow(this);fnGetFare(this);" ' + ' />';
                                        sfcContent += '<input type="hidden" id="hdnToPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].From_Region_Name + '"/></td>';
                                    }
                                    else {
                                        sfcContent += '<td><input type="text" ' + fromPlaceReadonly + ' id="txtFromPlace_' + j + '" class="autoFromPlace form-control" maxlength=50 value ="'
                                        + jsResult.Tables[0].Rows[i].From_Region_Name + '"onblur="fnGetFare(this)"  />';
                                        sfcContent += '<input type="hidden" id="hdnFromPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].From_Region_Name + '"/></td>';
                                        sfcContent += '<td> <input type="text" id="txtToPlace_' + j + '" class="autoToPlace form-control" maxlength=50 value ="'
                                            + jsResult.Tables[0].Rows[i].To_Region_Name + '" onblur="fnCreateSFCNewRow(this);fnGetFare(this);"/>';
                                        sfcContent += '<input type="hidden" id="hdnToPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].To_Region_Name + '"/></td>';
                                    }
                                    sfcContent += '<td><input type="text" id="txtTravelMode_' + j + '" class="form-control autoTravelMode" maxlength=30 value ="'
                                    + jsResult.Tables[0].Rows[i].Travel_Mode + '" onblur="fnGetFare(this)"/>';
                                    sfcContent += '<input type="hidden" id="hdnTravelMode_' + j + '" value ="' + jsResult.Tables[0].Rows[i].Travel_Mode + '"/>';
                                    sfcContent += '<td><span id="spnSFCCategory_' + j + '">' + jsResult.Tables[0].Rows[i].Category_Name + '</span></td>';
                                    if (PriFareEdit_g == "RIGID_PLACE") {
                                        sfcContent += '<td><input type="text" id="txtDistance_' + j + '" class="form-control clsDecimal" readonly=readonly value ="'
                                                        + jsResult.Tables[0].Rows[i].Distance + '" /></td>';
                                        sfcContent += '<td> <input type="text" id="txtFare_' + j + '" class="form-control clsDecimal" readonly=readonly value ="'
                                                    + jsResult.Tables[0].Rows[i].Fare_Amount + '"/> </td>';
                                    }
                                    else {
                                        sfcContent += '<td><input type="text" id="txtDistance_' + j + '" class="form-control clsDecimal" value ="'
                                            + jsResult.Tables[0].Rows[i].Distance + '" /></td>';
                                        sfcContent += '<td> <input type="text" id="txtFare_' + j + '" class="form-control clsDecimal"  value ="'
                                            + jsResult.Tables[0].Rows[i].Fare_Amount + '"/> </td>';
                                    }

                                    sfcContent += ' <input type="hidden" id="hdnDistanceFareCode_' + j + '" value="' + jsResult.Tables[0].Rows[i].Distance_Fare_Code + '"/>';
                                    sfcContent += '<input type="hidden" id="hdnRoute_' + j + '" value="' + jsResult.Tables[0].Rows[i].Route_Way + '"/></td></tr>';
                                }
                                cpRowNum = jsResult.Tables[0].Rows.length + 1;
                            }
                            else {// HQ Only;
                                for (var j = 1; j <= 1; j++) {
                                    var i = parseInt(j) - 1;
                                    sfcContent += '<tr>';
                                    var fromPlaceReadonly = "disabled='disabled'";
                                    if (j == 1) {
                                        fromPlaceReadonly = "";
                                    }

                                    if (jsResult.Tables[0].Rows[i].Route_Way == "R") {
                                        sfcContent += '<td><input type="text" ' + fromPlaceReadonly + ' id="txtFromPlace_' + j + '" class="autoFromPlace form-control" maxlength=50 value ="'
                                         + jsResult.Tables[0].Rows[i].To_Region_Name + '"onblur="fnGetFare(this);"/>';
                                        sfcContent += '<input type="hidden" id="hdnFromPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].To_Region_Name + '"/></td>';
                                        sfcContent += '<td> <input type="text" id="txtToPlace_' + j + '" class="autoToPlace form-control" maxlength=50 value ="'
                                            + jsResult.Tables[0].Rows[i].From_Region_Name + '" onblur="fnCreateSFCNewRow(this);fnGetFare(this);" ' + ' />';
                                        sfcContent += '<input type="hidden" id="hdnToPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].From_Region_Name + '"/></td>';
                                    }
                                    else {
                                        sfcContent += '<td><input type="text" ' + fromPlaceReadonly + ' id="txtFromPlace_' + j + '" class="autoFromPlace form-control" maxlength=50 value ="'
                                        + jsResult.Tables[0].Rows[i].From_Region_Name + '"onblur="fnGetFare(this)"  />';
                                        sfcContent += '<input type="hidden" id="hdnFromPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].From_Region_Name + '"/></td>';
                                        sfcContent += '<td> <input type="text" id="txtToPlace_' + j + '" class="autoToPlace form-control" maxlength=50 value ="'
                                            + jsResult.Tables[0].Rows[i].To_Region_Name + '" onblur="fnCreateSFCNewRow(this);fnGetFare(this);"/>';
                                        sfcContent += '<input type="hidden" id="hdnToPlace_' + j + '" value ="' + jsResult.Tables[0].Rows[i].To_Region_Name + '"/></td>';
                                    }
                                    sfcContent += '<td><input type="text" id="txtTravelMode_' + j + '" class="form-control autoTravelMode" maxlength=30 value ="'
                                    + jsResult.Tables[0].Rows[i].Travel_Mode + '" onblur="fnGetFare(this)"/>';
                                    sfcContent += '<input type="hidden" id="hdnTravelMode_' + j + '" value ="' + jsResult.Tables[0].Rows[i].Travel_Mode + '"/>';
                                    sfcContent += '<td><span id="spnSFCCategory_' + j + '">' + jsResult.Tables[0].Rows[i].Category_Name + '</span></td>';
                                    if (PriFareEdit_g == "RIGID_PLACE") {
                                        sfcContent += '<td><input type="text" id="txtDistance_' + j + '" class="form-control clsDecimal" readonly=readonly value ="'
                                                        + jsResult.Tables[0].Rows[i].Distance + '" /></td>';
                                        sfcContent += '<td> <input type="text" id="txtFare_' + j + '" class="form-control clsDecimal" readonly=readonly value ="'
                                                    + jsResult.Tables[0].Rows[i].Fare_Amount + '"/> </td>';
                                    }
                                    else {
                                        sfcContent += '<td><input type="text" id="txtDistance_' + j + '" class="form-control clsDecimal" value ="'
                                            + jsResult.Tables[0].Rows[i].Distance + '" /></td>';
                                        sfcContent += '<td> <input type="text" id="txtFare_' + j + '" class="form-control clsDecimal"  value ="'
                                            + jsResult.Tables[0].Rows[i].Fare_Amount + '"/> </td>';
                                    }

                                    sfcContent += ' <input type="hidden" id="hdnDistanceFareCode_' + j + '" value="' + jsResult.Tables[0].Rows[i].Distance_Fare_Code + '"/>';
                                    sfcContent += '<input type="hidden" id="hdnRoute_' + j + '" value="' + jsResult.Tables[0].Rows[i].Route_Way + '"/></td></tr>';
                                }
                                cpRowNum = 2;
                            }
                        }
                    }
                    else {

                        sfcContent += '<tr>';
                        sfcContent += '<td><input type="text" id="txtFromPlace_1" class="form-control autoFromPlace" maxlength=50';
                        sfcContent += 'onblur="fnGetFare(this)"/>';
                        sfcContent += '<input type="hidden" id="hdnFromPlace_1"/></td>';
                        sfcContent += '<td> <input type="text" id="txtToPlace_1" class="form-control autoToPlace" maxlength=50  onblur="fnGetFare(this);"/>';
                        sfcContent += '<input type="hidden" id="hdnToPlace_1"/></td>';
                        sfcContent += '<td><input type="text" id="txtTravelMode_1" class="form-control autoTravelMode" maxlength=30  ondblclick="fnCreateSFCNewRow(this);" onblur="fnCreateSFCNewRow(this);fnGetFare(this);"/>';
                        sfcContent += '<input type="hidden" id="hdnTravelMode_1"/><input type="hidden" id="hdnDistanceFareCode_1"/><input type="hidden" id="hdnRoute_1"/>';
                        sfcContent += '</td>';
                        sfcContent += '<td><span id="spnSFCCategory_1"></span></td>';
                        if (PriFareEdit_g == "RIGID_PLACE") {
                            sfcContent += '<td><input type="text" id="txtDistance_1" class="form-control clsDecimal" readonly=readonly /></td>';
                            sfcContent += '<td> <input type="text" id="txtFare_1" class="form-control clsDecimal"  readonly=readonly/> </td>';
                        }
                        else {
                            sfcContent += '<td><input type="text" id="txtDistance_1" class="form-control clsDecimal" /></td>';
                            sfcContent += '<td> <input type="text" id="txtFare_1" class="form-control clsDecimal" /> </td>';
                        }
                        sfcContent += '</tr>';
                    }
                }
                sfcContent += '</tbody> </table>';
                $("#dvSFC").html(sfcContent);
                fnCreateSFCNewRow("EDIT");
                autoComplete(autoSFC_g, "txtWorkArea", "hdnWorkArea", "autoWorkArea");
                autoComplete(autoSFC_g, "txtFromPlace", "hdnFromPlace", "autoFromPlace");
                autoComplete(autoSFC_g, "txtToPlace", "hdnToPlace", "autoToPlace");
                autoComplete(travelMode_g, "txtTravelMode", "hdnTravelMode", "autoTravelMode");
                //$(".autoTravelMode").blur(function () {
                //    fnValidateAutofill(this, travelMode_g, "txtTravelMode", "hdnTravelMode");
                //    $(this).removeClass('errorIndicator'); $(this).removeAttr('title');
                //});
                //$(".autoWorkArea").blur(function () { fnValidateAutofill(this, autoSFC_g, "txtWorkArea", "hdnWorkArea"); });
                $('.timepicker').timepicker({
                    showPeriod: true,
                    showLeadingZero: true
                });
                $(".clsDecimal").keypress(function () { return fnIsNumeric(event) });
                $(".clsDecimal").blur(function () { if (!fnCheckMaxLimit(this, "FLOAT")) { $(this).val('0'); } });


            }
            if (jsonCPDetails_g.Tables[2] != undefined) {
                var disCPDoc = jsonPath(jsonCPDetails_g, "$.Tables[2].Rows[?(@.CP_code =='" + cpCode + "')]");
                if (disCPDoc != false) {
                    fnBindSelectedDoctors(disCPDoc, "EDIT");
                }
            }
            $('#dvRightPanel').tabs('option', 'selected', 0);
            $("#dvCPMain").unblock();
        }
        else {
            $("#dvCPMain").unblock();
        }
    }
}

function fnDelete(obj) {
    var id = obj.id;
    if (id.split('_')[1] == docRowNum - 1) {
        fnMsgAlert('info', 'Info', 'You should enter atleast one doctor details');
        return;
    }
    if (confirm("Are you sure you want to delete this row?")) {
        var parent = $(obj).parent().parent();
        parent.fadeOut('slow', function () { });
    }
}

var tempSFCJson = new Array();
function fnValidate() {
    //$("#dvInsertCP .errorIndicator").removeClass('errorIndicator');
    var flag = true;
    tempSFCJson = new Array();
    if ($.trim($("#txtCPName").val()) == '') {
        //$("#txtCPName").addClass('errorIndicator');
        //$("#txtCPName").attr('title', 'Please enter campaign planner name');
        //flag = false;
        fnMsgAlert('info', 'Error', 'Please enter campaign planner name');
        flag = false;
        return;
    }
    else {

        if (!fnCheckSpecialCharacter($("#txtCPName"))) {
            //$("#txtCPName").addClass('errorIndicator');
            //$("#txtCPName").attr('title', 'Please remove the special characters from the CP Name');
            //flag = false;
            fnMsgAlert('info', 'Error', 'Please remove the special characters from the CP Name');
            flag = false;
            return;
        }
        else {
            // $("#txtCPName").removeClass('errorIndicator');
            if (jsonCPDetails_g != '') {
                var disJson;
                if ($("#hdnMode").val() != "EDIT") {
                    disJson = jsonPath(jsonCPDetails_g, "$.Tables[0].Rows[?(@.CP_Name.toUpperCase().substring(2)=='"
                        + $.trim($('#txtCPName').val().toUpperCase()) + "')]");
                }
                else {
                    disJson = jsonPath(jsonCPDetails_g, "$.Tables[0].Rows[?(@.CP_Name.toUpperCase().substring(2)=='"
                        + $.trim($('#txtCPName').val().toUpperCase()) + "' && @.CP_Code!= '" + $("#hdnCPCode").val() + "')]");
                }
                if (disJson != false && disJson != undefined) {
                    fnMsgAlert('info', 'Error', 'CP name already exists');
                    flag = false;
                    return;
                }
                else {
                    $("#txtCPName").removeClass('errorIndicator');
                    $("#txtCPName").removeAttr('title');
                }
            }
            var sfcLoopCount = cpRowNum;
            if ($("#cboCategory :selected").text().toUpperCase() != "HQ") {
                var cateName = $("#cboCategory :selected").text().toUpperCase();
                if ($.inArray(cateName, PriInterPlace_g) > -1) {
                    sfcLoopCount = sfcLoopCount - 1;
                }
            }
            //if ($('#txtWorkArea').val() != '' && ($('#hdnWorkArea').val() == '' || $('#hdnWorkArea').val() == undefined)) {
            //    fnMsgAlert('info', 'Validate', 'Please enter valid work area');
            //    $("#txtWorkArea").addClass('errorIndicator');
            //    $("#txtWorkArea").attr('title', 'Please enter valid work area');
            //    $('#hdnWorkArea').val('');
            //    flag = false;
            //    return;
            //}
            if ($.trim($('#txtWorkArea').val()) == '') {
                fnMsgAlert('info', 'Validate', 'Please enter work area');
                $("#txtWorkArea").addClass('errorIndicator');
                $("#txtWorkArea").attr('title', 'Please enter work area');
                $('#hdnWorkArea').val('');
                flag = false;
                return;
            }
            else {
                if (!fnCheckSpecialCharacter($("#txtWorkArea"))) {
                    $("#txtWorkArea").addClass('errorIndicator');
                    $("#txtWorkArea").attr('title', 'Please remove the special characters from Work area');
                    flag = false;
                    return;
                }
                else {
                    $("#txtWorkArea").removeClass('errorIndicator');
                    $("#txtWorkArea").attr('title');
                }
            }
            var sfcCount = 0;

            // Start: Travel Mode Validation against Travel Mode Master.
            for (var j = 1; j < sfcLoopCount ; j++) {
                var lastToplace = $.trim($("#txtToPlace_" + j).val());
                if (lastToplace.length > 0) {
                    var travelMode = $("#txtTravelMode_" + j).val();
                    var travelModejson = jsonPath(travelMode_g, "$[?(@.label=='" + travelMode + "')]");
                    if (!travelModejson) {
                       
                        $("#txtTravelMode_" + j).addClass('errorIndicator');
                        $("#txtTravelMode_" + j).attr('title', 'Please select valid travel mode');
                        flag = false;
                    }

                }
            }
            // END:Travel Mode Validation against Travel Mode Master.


            for (var i = 1; i < sfcLoopCount ; i++) {
                var jsSFC = {};
                var lastToplace = $("#txtToPlace_" + i).val();
                if (lastToplace.length > 0) {
                    //if ($("#txtWorkArea_" + i) != null) {
                    if ($("#txtFromPlace_" + i) != null) {
                        //if ($("#txtWorkArea_" + i + "").is(":visible")) {
                        if ($("#txtFromPlace_" + i + "").is(":visible")) {
                            // if ($.trim($("#txtWorkArea_" + i).val()) != '') {
                            if ($.trim($("#txtFromPlace_" + i).val()) != '') {
                                sfcCount = parseInt(sfcCount) + 1;
                                if (PriFareEdit_g == "RIGID_PLACE") {
                                    //if (!fnCheckSpecialCharacter($("#txtWorkArea_" + i))) {
                                    //    $("#txtWorkArea_" + i).addClass('errorIndicator');
                                    //    $("#txtWorkArea_" + i).attr('title', 'Please remove the special characters from Work area');
                                    //    flag = false;
                                    //}
                                    
                                    var fromPlace = jsonPath(autoSFC_g, "$[?(@.label=='" + $("#txtFromPlace_" + i).val() + "')]");
                                    var toPlace = jsonPath(autoSFC_g, "$[?(@.label=='" + $("#txtToPlace_" + i).val() + "')]");

                                    if (!fromPlace) {
                                        $("#hdnFromPlace_" + i).val("");
                                    }
                                    if (!toPlace) {
                                        $("#hdnToPlace_" + i).val("");
                                    }

                                    if ($.trim($("#hdnFromPlace_" + i).val()) == "") {
                                        $("#txtFromPlace_" + i).addClass('errorIndicator');
                                        if ($("#txtFromPlace_" + i).val().length > 0) {
                                            $("#txtFromPlace_" + i).attr('title', 'Please enter valid from place');
                                        }
                                        else {
                                            $("#txtFromPlace_" + i).attr('title', 'Please enter from place');
                                        }
                                        flag = false;
                                    }
                                    else if ($.trim($("#hdnToPlace_" + i).val()) == "") {
                                        $("#txtToPlace_" + i).addClass('errorIndicator');
                                        if ($("#txtToPlace_" + i).val().length > 0) {
                                            $("#txtToPlace_" + i).attr('title', 'Please enter valid to place');
                                        }
                                        else {
                                            $("#txtToPlace_" + i).attr('title', 'Please enter to place');
                                        }
                                        flag = false;
                                    }
                                    else if ($.trim($("#hdnTravelMode_" + i).val()) == "") {
                                        $("#txtTravelMode_" + i).addClass('errorIndicator');
                                        $("#txtTravelMode_" + i).attr('title', 'Please select travel mode');
                                        flag = false;
                                    }
                                    else {
                                        var distanceFareCode = $("#hdnDistanceFareCode_" + i).val();
                                        jsSFC.From_Region_Name = $.trim($("#txtFromPlace_" + i).val());
                                        jsSFC.To_Region_Name = $.trim($("#txtToPlace_" + i).val());
                                        jsSFC.Travel_Mode = $.trim($("#txtTravelMode_" + i).val());
                                        jsSFC.Category_Name = $.trim($("#spnSFCCategory_" + i).html());
                                        tempSFCJson.push(jsSFC);
                                    }
                                }
                                else {
                                    //if ($.trim($("#txtWorkArea_" + i).val()) == "") {
                                    //    $("#txtWorkArea_" + i).addClass('errorIndicator');
                                    //    $("#txtWorkArea_" + i).attr('title', 'Please enter work area');
                                    //    flag = false;
                                    //}
                                    if ($.trim($("#txtFromPlace_" + i).val()) == "") {
                                        $("#txtFromPlace_" + i).addClass('errorIndicator');
                                        $("#txtFromPlace_" + i).attr('title', 'Please enter from place');
                                        flag = false;
                                    }
                                    else if ($.trim($("#txtToPlace_" + i).val()) == "") {
                                        $("#txtToPlace_" + i).addClass('errorIndicator');
                                        $("#txtToPlace_" + i).attr('title', 'Please enter to place');
                                        flag = false;
                                    }
                                    else if ($.trim($("#txtTravelMode_" + i).val()) == "") {
                                        $("#txtTravelMode_" + i).addClass('errorIndicator');
                                        $("#txtTravelMode_" + i).attr('title', 'Please select travel mode');
                                        flag = false;
                                    }
                                    else if ($.trim($("#txtDistance_" + i).val()) == "") {
                                        $("#txtDistance_" + i).addClass('errorIndicator');
                                        $("#txtDistance_" + i).attr('title', 'Please enter distance');
                                        flag = false;

                                    }
                                    else if ($.trim($("#txtFare_" + i).val()) == "") {
                                        $("#txtFare_" + i).addClass('errorIndicator');
                                        $("#txtFare_" + i).attr('title', 'Please enter fare');
                                        flag = false;
                                    }
                                    else {
                                        //if (!fnCheckSpecialCharacter($("#txtWorkArea_" + i))) {
                                        //    $("#txtWorkArea_" + i).addClass('errorIndicator');
                                        //    $("#txtWorkArea_" + i).attr('title', 'Please remove the special characters from Work area');
                                        //    flag = false;
                                        //}
                                        if (!fnCheckSpecialCharacter($("#txtFromPlace_" + i))) {
                                            $("#txtFromPlace_" + i).addClass('errorIndicator');
                                            $("#txtFromPlace_" + i).attr('title', 'Please remove the special characters from Place from');
                                            flag = false;
                                        }
                                        if (!fnCheckSpecialCharacter($("#txtToPlace_" + i))) {
                                            $("#txtToPlace_" + i).addClass('errorIndicator');
                                            $("#txtToPlace_" + i).attr('title', 'Please remove the special characters from To place');
                                            flag = false;
                                        }
                                        if (!fnCheckSpecialCharacter($("#txtTravelMode_" + i))) {
                                            $("#txtTravelMode_" + i).addClass('errorIndicator');
                                            $("#txtTravelMode_" + i).attr('title', 'Please remove the special characters from travel mode');
                                            flag = false;
                                        }
                                    }
                                }

                                var result = fnCheckNumeric($("#txtDistance_" + i));
                                if (!result) {
                                    $("#txtDistance_" + i).addClass('errorIndicator');
                                    $("#txtDistance_" + i).attr('title', 'Please validate the distance');
                                    flag = false;
                                }
                                var result = fnCheckNumeric($("#txtFare_" + i));
                                if (!result) {
                                    $("#txtFare_" + i).addClass('errorIndicator');
                                    $("#txtFare_" + i).attr('title', 'Please validate the fare');
                                    flag = false;
                                }
                            }
                        }
                    }
                }
            }
            if (!flag) {
                fnMsgAlert('info', 'Error', 'Please validate the errors which is mentioned in the red color box');
                flag = false;
                return;
            }
            else {
                if (sfcCount == 0) {
                    fnMsgAlert('info', 'Error', 'Please enter atleast any one valid sfc details');
                    flag = false;
                    return;
                }
                else {
                    if ($("#dvSFC .errorIndicator").length > 0) {
                        fnMsgAlert('info', 'Error', 'Please validate the errors which is mentioned in the red color box');
                        flag = false;
                        return;
                    }
                    for (var i = 0; i < tempSFCJson.length; i++) {

                        var disJson = jsonPath(tempSFCJson, "$[?(@.Category_Name=='" + tempSFCJson[i].Category_Name + "' & @.From_Region_Name=='"
                                     + tempSFCJson[i].From_Region_Name + "' & @.To_Region_Name=='" + tempSFCJson[i].To_Region_Name
                                     + "' & @.Travel_Mode=='" + tempSFCJson[i].Travel_Mode + "' )]");
                        if (disJson.length > 1) {
                            fnMsgAlert('info', 'Validate', 'Duplicate entry found for the combination - ' + tempSFCJson[i].Category_Name
                                + "</br>" + tempSFCJson[i].From_Region_Name
                                + "</br>" + tempSFCJson[i].To_Region_Name + "</br>" + tempSFCJson[i].Travel_Mode);
                            flag = false;
                            return;
                        }
                        else {
                            var disJson = jsonPath(tempSFCJson, "$[?(@.Category_Name=='" + tempSFCJson[i].Category_Name + "' & @.To_Region_Name=='"
                                     + tempSFCJson[i].From_Region_Name + "' & @.From_Region_Name=='" + tempSFCJson[i].To_Region_Name
                                     + "' & @.Travel_Mode=='" + tempSFCJson[i].Travel_Mode + "' )]");
                            if (disJson.length > 1) {
                                fnMsgAlert('info', 'Validate', 'Duplicate entry found for the combination - ' + tempSFCJson[i].Category_Name
                                    + "</br>" + tempSFCJson[i].From_Region_Name
                                    + "</br>" + tempSFCJson[i].To_Region_Name + "</br>" + tempSFCJson[i].Travel_Mode);
                                flag = false;
                                return;
                            }
                        }
                    }
                    var docCount = 0;
                    for (var j = 1; j < docRowNum - 1; j++) {
                        if ($("#txtDoctorName_" + j) != null) {
                            if ($("#txtDoctorName_" + j + "").is(":visible")) {
                                if ($.trim($("#txtDoctorName_" + j).val()) == "") {
                                    //if ($("#txtTime_" + j).val() != '') {
                                    //    $("#txtDoctorName_" + j).addClass('errorIndicator');
                                    //    $("#txtDoctorName_" + j).attr('title', 'Please enter doctor name');
                                    //    flag = false;
                                    //}
                                }
                                else {
                                    if ($('#hdnDoctorCode_' + j).val() == '') {
                                        $("#txtDoctorName_" + j).addClass('errorIndicator');
                                        $("#txtDoctorName_" + j).attr('title', 'Please enter the valid doctor name');
                                        flag = false;
                                    }
                                    else {
                                        docCount = parseInt(docCount) + 1;
                                        for (var k = 1; k < docRowNum - 1; k++) {
                                            if ($("#txtDoctorName_" + k) != null) {
                                                if ($("#txtDoctorName_" + k + "").is(":visible")) {
                                                    if (k != j) {
                                                        if ($('#hdnDoctorCode_' + j).val() == $('#hdnDoctorCode_' + k).val()) {
                                                            $("#txtDoctorName_" + j).addClass('errorIndicator');
                                                            $("#txtDoctorName_" + j).attr('title', 'Doctor name already exists');
                                                            flag = false;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (!flag) {
                        fnMsgAlert('info', 'Validate', 'Please validate the errors and then proceed');
                        flag = false;
                        return;
                    }
                    else {
                        if (docCount == 0) {
                            fnMsgAlert('info', 'Error', 'Please enter atleast any one doctor');
                            flag = false;
                            return;
                        }
                        else {
                            $("#dvDoctors .errorIndicator").removeClass('errorIndicator');
                            $("#dvDoctors .errorIndicator").removeAttr('title');
                        }
                    }
                }
            }
        }
    }

    return flag;
}
function fnSubmit(status) {
    debugger;
    var result = fnValidate();
    if (result) {
        if ($("#dvInsertCP .errorIndicator").length > 0) {
            fnMsgAlert('info', 'Validate', 'Please validate the error then try to submit');
            return;
        }
        else {

            if ($('#hdnMode').val() == "EDIT") {
                //var result = fnValidate();
                //if (result) {
                //    if ($("#dvInsertCP .errorIndicator").length > 0) {
                //        fnMsgAlert('info', 'Validate', 'Please validate the error then try to submit');
                //        return;
                //    }
                var sfcCount = 0;
                var sfcLoopCount = cpRowNum;
                if ($("#cboCategory :selected").text().toUpperCase() != "HQ") {
                    var cateName = $("#cboCategory :selected").text().toUpperCase()
                    if ($.inArray(cateName, PriInterPlace_g) > -1) {
                        sfcLoopCount = sfcLoopCount - 1;
                    }
                }
                for (var i = 1; i < sfcLoopCount ; i++) {
                    var jsSFC = {};
                    var lastToplace = $.trim($('#txtToPlace_' + i).val());
                    if (lastToplace.length > 0) {
                        if ($("#txtFromPlace_" + i) != null) {
                            //if ($("#txtWorkArea_" + i + "").is(":visible")) {
                            if ($("#txtFromPlace_" + i + "").is(":visible")) {
                                // if ($.trim($("#txtWorkArea_" + i).val()) != '') {
                                if ($.trim($("#txtFromPlace_" + i).val()) != '') {
                                    sfcCount = parseInt(sfcCount) + 1;
                                    if (PriFareEdit_g == "RIGID_PLACE") {
                                        //jsSFC.From_Region_Name = $.trim($("#txtFromPlace_" + i).val());
                                        //jsSFC.To_Region_Name = $.trim($("#txtToPlace_" + i).val());
                                        //jsSFC.Travel_Mode = $.trim($("#txtTravelMode_" + i).val());
                                        //jsSFC.Category_Name = $.trim($("#spnSFCCategory_" + i).html());

                                        var disJson = jsonPath(allSFCJson_g, "$[?(@.Category_Name=='" + $("#spnSFCCategory_" + i).html() + "' & @.From_Region_Name=='"
                                        + $("#txtFromPlace_" + i).val() + "' & @.To_Region_Name=='" + $("#txtToPlace_" + i).val()
                                        + "' & @.Travel_Mode=='" + $("#txtTravelMode_" + i).val() + "' )]");
                                        if (disJson != false && disJson != undefined && disJson != null) {
                                        }
                                        else {
                                            //if (disJson == false || disJson == undefined) {
                                            //    fnMsgAlert('info', 'Validate', 'Invalid SFC - From Place - ' + $("#txtFromPlace_" + i).val()
                                            //        + ' To Place - ' + $("#txtToPlace_" + i).val() + " Category - " + $("#spnSFCCategory_" + i).html()
                                            //        + " Travel mode - " + $("#txtTravelMode_" + i).val());

                                            //    return;
                                            //}
                                            //else {
                                            var disJson = jsonPath(allSFCJson_g, "$[?(@.Category_Name=='" + $("#spnSFCCategory_" + i).html() + "' & @.From_Region_Name=='"
                                         + $("#txtToPlace_" + i).val() + "' & @.To_Region_Name=='" + $("#txtFromPlace_" + i).val()
                                         + "' & @.Travel_Mode=='" + $("#txtTravelMode_" + i).val() + "' )]");
                                            if (disJson == false || disJson == undefined) {
                                                fnMsgAlert('info', 'Validate', 'Invalid SFC - From Place - ' + $("#txtToPlace_" + i).val()
                                               + 'To Place - ' + $("#txtFromPlace_" + i).val() + " Category - " + $("#spnSFCCategory_" + i).html()
                                               + " Travel mode - " + $("#txtTravelMode_" + i).val());

                                                return;
                                                return;
                                            }
                                        }
                                    }
                                    else {
                                        if ($.trim($("#txtFromPlace_" + i).val()) == "") {
                                            $("#txtFromPlace_" + i).addClass('errorIndicator');
                                            $("#txtFromPlace_" + i).attr('title', 'Please enter from place');
                                            flag = false;
                                        }
                                        else if ($.trim($("#txtToPlace_" + i).val()) == "") {
                                            $("#txtToPlace_" + i).addClass('errorIndicator');
                                            $("#txtToPlace_" + i).attr('title', 'Please enter to place');
                                            flag = false;
                                        }
                                        else if ($.trim($("#txtTravelMode_" + i).val()) == "") {
                                            $("#txtTravelMode_" + i).addClass('errorIndicator');
                                            $("#txtTravelMode_" + i).attr('title', 'Please select travel mode');
                                            flag = false;
                                        }
                                        else if ($.trim($("#txtDistance_" + i).val()) == "") {
                                            $("#txtDistance_" + i).addClass('errorIndicator');
                                            $("#txtDistance_" + i).attr('title', 'Please enter distance');
                                            flag = false;

                                        }
                                        else if ($.trim($("#txtFare_" + i).val()) == "") {
                                            $("#txtFare_" + i).addClass('errorIndicator');
                                            $("#txtFare_" + i).attr('title', 'Please enter fare');
                                            flag = false;
                                        }
                                        else {
                                            if (!fnCheckSpecialCharacter($("#txtFromPlace_" + i))) {
                                                $("#txtFromPlace_" + i).addClass('errorIndicator');
                                                $("#txtFromPlace_" + i).attr('title', 'Please remove the special characters from Place from');
                                                flag = false;
                                            }
                                            if (!fnCheckSpecialCharacter($("#txtToPlace_" + i))) {
                                                $("#txtToPlace_" + i).addClass('errorIndicator');
                                                $("#txtToPlace_" + i).attr('title', 'Please remove the special characters from To place');
                                                flag = false;
                                            }
                                            if (!fnCheckSpecialCharacter($("#txtTravelMode_" + i))) {
                                                $("#txtTravelMode_" + i).addClass('errorIndicator');
                                                $("#txtTravelMode_" + i).attr('title', 'Please remove the special characters from travel mode');
                                                flag = false;
                                            }
                                        }
                                    }

                                    var result = fnCheckNumeric($("#txtDistance_" + i));
                                    if (!result) {
                                        $("#txtDistance_" + i).addClass('errorIndicator');
                                        $("#txtDistance_" + i).attr('title', 'Please validate the distance');
                                        flag = false;
                                    }
                                    var result = fnCheckNumeric($("#txtFare_" + i));
                                    if (!result) {
                                        $("#txtFare_" + i).addClass('errorIndicator');
                                        $("#txtFare_" + i).attr('title', 'Please validate the fare');
                                        flag = false;
                                    }
                                }
                            }
                        }//
                    }
                }
            }
            var sfcDetails = "";
            var doctorDetails = "";
            for (var i = 1; i < cpRowNum; i++) {
                var lastRowToplace = $.trim($('#txtToPlace_' + i).val());
                if (lastRowToplace.length > 0) {
                    // if ($("#txtWorkArea_" + i + "").is(":visible")) {
                    if ($("#txtFromPlace_" + i + "").is(":visible")) {
                        //if ($("#txtWorkArea_" + i) != null) {
                        if ($("#txtFromPlace_" + i) != null) {
                            // if ($.trim($("#txtWorkArea_" + i).val()) != '') {
                            if ($.trim($("#txtFromPlace_" + i).val()) != '') {
                                // sfcDetails += $("#txtWorkArea_" + i).val() + "^";
                                sfcDetails += $("#txtFromPlace_" + i).val().replace("'", '').toUpperCase() + "^";
                                sfcDetails += $("#txtToPlace_" + i).val().replace("'", '').toUpperCase() + "^";
                                sfcDetails += $("#txtDistance_" + i).val() + "^";
                                sfcDetails += $("#txtFare_" + i).val() + "^";
                                sfcDetails += $("#txtTravelMode_" + i).val().replace("'", '') + "^";
                                if ($("#hdnDistanceFareCode_" + i).val() == "null" || $("#hdnDistanceFareCode_" + i).val() == "NULL") {
                                    $("#hdnDistanceFareCode_" + i).val('');
                                }
                                sfcDetails += $("#hdnDistanceFareCode_" + i).val() + "^";
                                sfcDetails += $("#hdnRoute_" + i).val() + "^";
                                sfcDetails += "$";
                            }
                        }
                    }
                }
            }
            for (var i = 1; i < docRowNum - 1 ; i++) {
                if ($("#txtDoctorName_" + i + "").is(":visible")) {
                    if ($("#txtDoctorName_" + i) != null) {
                        if ($.trim($("#txtDoctorName_" + i).val()) != '') {
                            doctorDetails += $("#hdnDoctorCode_" + i).val() + "^";
                            doctorDetails += $("#txtDoctorName_" + i).val().split('_')[0] + "^";
                            //doctorDetails += $("#txtTime_" + i).val() + "^";
                            doctorDetails += "$";
                        }
                    }
                }
            }
            var regionTree = $("#dvRegionTree").dynatree("getTree");
            var regionCode = regionTree.getActiveNode().data.key;
            var regionName = regionTree.getActiveNode().data.title;
            var categoryCode = $("#cboCategory").val();
            var categoryName = $("#cboCategory :selected").text();
            var cpName = $.trim($("#txtCPName").val());
            var workArea = $.trim($('#txtWorkArea').val());
            $('#dvCPMain').block({
                message: '<h3>Creating campaign planner</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                url: '../HiDoctor_Activity/CampaignPlanner/InsertCampaignPlanner/',
                type: "POST",
                data: "regionCode=" + regionCode + "&regionName=" + regionName.split('(')[0] + "&cpName=" + cpName + "&categoryCode=" + categoryCode
                                + "&categoryName=" + categoryName + "&sfcDetails=" + sfcDetails + "&doctorDetails=" + doctorDetails
                                + "&Mode=" + $("#hdnMode").val() + "&CPCode=" + $("#hdnCPCode").val() + "&CPStatus=" + status
                                + "&workArea=" + workArea + "&EditPrivilege=" + PriFareEdit_g + "",
                success: function (result) {
                    $("#dvCPMain").unblock();
                    if (!isNaN(result)) {
                        if (parseInt(result) > 0) {
                            fnMsgAlert('success', 'Success', 'Campaign planner saved successfully');
                            fnClearAll();
                        }
                        else {
                            fnMsgAlert('error', 'Error', 'Error while saving the campaign planner');
                        }
                    }
                    else {
                        fnMsgAlert('error', 'Error', 'Error while saving the campaign planner');
                    }
                    //if (result.split(':').length > 1) {
                    //    if (result.split(':')[0] == "SUCCESS") {
                    //        fnMsgAlert('success', 'Success', 'Campaign created successfully');
                    //        fnClearAll();
                    //    }
                    //    else {
                    //        fnMsgAlert('error', 'Error', 'Error occurred while creating a campaign' + result.split(':')[1]);
                    //    }
                    //}
                },
                error: function () {
                    $("#dvCPMain").unblock();
                },
                complete: function () {
                    $("#dvCPMain").unblock();
                }
            });
        }
    }
    else {
        //fnMsgAlert('info', 'Validate', 'Please validate the errors then try to submit');
        //return;
    }
}
function fnClearAll() {
    $('#dvCPMain').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $("#dvInsertCP .errorIndicator").removeAttr('title');
    $("#dvInsertCP .errorIndicator").removeClass('errorIndicator');
    $("#txtCPName").val('');
    $("#txtWorkArea").val('');
    $("#hdnWorkArea").val('');
    $("#hdnMode").val("INSERT");
    $("#cboCategory option").each(function () {
        if ($(this).text() == "HQ") {
            $(this).attr('selected', 'selected');
        }
    });
    fnGetSFC();
    fnGetCPDetails();
}
function fnClearAllData() {
    $("#dvInsertCP .errorIndicator").removeAttr('title');
    $("#dvInsertCP .errorIndicator").removeClass('errorIndicator');
    $("#txtCPName").val('');
    $("#txtWorkArea").val('');
    $("#hdnWorkArea").val('');
    $("#hdnMode").val("INSERT");
    $("#cboCategory option").each(function () {
        if ($(this).text() == "HQ") {
            $(this).attr('selected', 'selected');
        }
    });
    fnGetSFC();
}
function fnCheckNumeric(id) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            $(id).addClass('errorIndicator');
            $(id).attr('title', 'Please enter numeric value');
            return false;
        }
        else {
            if ($(id).hasClass('errorIndicator')) {
                $(id).removeClass('errorIndicator');
                $(id).attr('title', '');
            }
        }
    }
    else {
        return false;
        // $(id).val("0.00");
    }
    return true;
}
var disDocArray = new Array();
//var disTimeArray = new Array();
function fnBindAllDoctor() {
    disDocArray = new Array();
    // disTimeArray = new Array();
    var tblLen = $("#tblDoctors tr").length;
    for (var i = 1; i < tblLen; i++) {
        if ($("#hdnDoctorCode_" + i + "").val() != '') {
            disDocArray.push($("#hdnDoctorCode_" + i + "").val());
            // disTimeArray.push($("#txtTime_" + i + "").val() + "_" + $("#hdnDoctorCode_" + i + "").val());
        }
    }
    var tblContent = "";
    if (disDocArray.length > 0) {
        if (jsonDoctor_g != '') {
            tblContent += "<table class='table table-striped'><thead><tr><td>Select<input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/></td>";
            tblContent += "<td>Doctor Name</td><td>Category Name</td><td>Qualification</td></tr></thead><tbody>";
            for (var i = 0; i < jsonDoctor_g.length; i++) {

                var doctorName = jsonDoctor_g[i].Customer_Name + '_' + jsonDoctor_g[i].MDL_Number + '_' + jsonDoctor_g[i].Speciality_Name + '_' + jsonDoctor_g[i].Region_Name;
                if ($.inArray(jsonDoctor_g[i].Customer_Code, disDocArray) > -1) {
                    tblContent += "<tr><td><input type='checkbox' name='chkSelect' checked='checked' id='chkSelect_" + parseInt(i) + 1 + "' value='"
                                                + jsonDoctor_g[i].Customer_Code + "'/></td>";
                }
                else {
                    tblContent += "<tr><td><input type='checkbox' name='chkSelect' id='chkSelect_" + parseInt(i) + 1 + "' value='" + jsonDoctor_g[i].Customer_Code + "'/></td>";
                }
                tblContent += "<td id='tdDoctorName_" + parseInt(i) + 1 + "'>" + doctorName + "</td>";
                tblContent += "<td id='tdCategoryName_" + parseInt(i) + 1 + "'>" + jsonDoctor_g[i].Category_Name + "</td>";
                tblContent += "<td id='tdQualification_" + parseInt(i) + 1 + "'>" + jsonDoctor_g[i].Qualification + "</td></tr>";
            }
            tblContent += "</tbody></table>";
        }
    }
    else {
        if (jsonDoctor_g != '') {
            tblContent += "<table class='table table-striped'><thead><tr><td>Select<input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/></td>";
            tblContent += "<td>Doctor Name</td><td>Category Name</td><td>Qualification</td></tr></thead><tbody>";
            for (var i = 0; i < jsonDoctor_g.length; i++) {
                var doctorName = jsonDoctor_g[i].Customer_Name + '_' + jsonDoctor_g[i].MDL_Number + '_' + jsonDoctor_g[i].Speciality_Name + '_' + jsonDoctor_g[i].Region_Name;
                tblContent += "<tr><td><input type='checkbox' name='chkSelect' id='chkSelect_" + parseInt(i) + 1 + "' value='" + jsonDoctor_g[i].Customer_Code + "'/></td>";
                tblContent += "<td id='tdDoctorName_" + parseInt(i) + 1 + "'>" + doctorName + "</td>";
                tblContent += "<td id='tdCategoryName_" + parseInt(i) + 1 + "'>" + jsonDoctor_g[i].Category_Name + "</td>";
                tblContent += "<td id='tdQualification_" + parseInt(i) + 1 + "'>" + jsonDoctor_g[i].Qualification + "</td></tr>";
            }
            tblContent += "</tbody></table>";
        }
    }
    $("#dvAllDoc").html(tblContent);
    $("#dvAllDoctors").overlay().load();
}
function fnGetSelectedDoctors() {
    $('#dvCPMain').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    var flag = false;
    var doctors = "[";
    $("input:checkbox[name=chkSelect]").each(function () {
        var tdName = this.value;
        if (this.checked) {
            flag = true;
            var doctorCode = this.value;
            var doctorName = $("#" + this.id.replace("chkSelect", "tdDoctorName")).html();
            var categoryName = $("#" + this.id.replace("chkSelect", "tdCategoryName")).html();
            var qualification = $("#" + this.id.replace("chkSelect", "tdQualification")).html();
            // var estimatedTime = $("#" + this.id.replace("chkSelect", "txtTime")).val();
            doctors += "{Customer_Name:" + '"' + "" + doctorName + "" + '",'
                     + "Doctor_Code:" + '"' + "" + doctorCode + "" + '",'
                     + "Category_Name:" + '"' + "" + categoryName + "" + '",'
                     // + "Estimated_Name:" + '"' + "" + estimatedTime + "" + '",'
                      + "Qualification:" + "'" + qualification + "'" + "},";

        }
    });
    if (flag) {
        doctors = doctors.slice(0, -1);
    }
    doctors += "]";
    var selectedDocJson = eval('(' + doctors + ')');
    fnBindSelectedDoctors(selectedDocJson, "SELECTION");
}
function fnBindSelectedDoctors(disCPDoc, mode) {
    var cpDoc = "";
    cpDoc += '<table id="tblDoctors" class="table table-striped"><thead><tr><td>Doctor Name</td> <td>Category</td>';
    cpDoc += '<td>Qualification</td><td>Delete</td>  </tr> </thead><tbody>';
    for (var d = 1; d <= disCPDoc.length; d++) {
        var k = parseInt(d) - 1;
        var doctorName = "";
        if (mode == "EDIT") {
            doctorName = disCPDoc[k].Customer_Name + '_' + disCPDoc[k].MDL_Number + '_' + disCPDoc[k].Speciality_Name + '_' + disCPDoc[k].Region_Name
        }
        else {
            doctorName = disCPDoc[k].Customer_Name;
        }
        // var doctorName = disCPDoc[k].Customer_Name + '_' + disCPDoc[k].MDL_Number + '_' + disCPDoc[k].Speciality_Name + '_' + disCPDoc[k].Region_Name;
        cpDoc += '<tr> <td><input type="text" id="txtDoctorName_' + d + '" maxlength=50 class="autoDoctor form-control"  ondblclick="fnCreateDoctorTableNewRow(this);"';
        cpDoc += 'value="' + doctorName + '" />';
        cpDoc += '<input type="hidden" id="hdnDoctorCode_' + d + '" value="' + disCPDoc[k].Doctor_Code + '" /> </td>';
        //var time = "";
        //if (disTimeArray.length > 0) {
        //    for (var z = 0; z < disTimeArray.length; z++) {
        //        var docCode = disTimeArray[z].split('_')[1];
        //        if (disCPDoc[k].Doctor_Code == docCode) {
        //            time = disTimeArray[z].split('_')[0];
        //            break;
        //        }
        //    }
        //}
        //else {
        //    if (disCPDoc[k].Estimated_Time != null && disCPDoc[k].Estimated_Time != undefined) {
        //        time = disCPDoc[k].Estimated_Time;
        //    }
        //}
        //  cpDoc += ' <td><input type="text" id="txtTime_' + d + '" class="timepicker form-control" value="' + time + '"/></td>';
        cpDoc += '<td> <span id="spnCategory_' + d + '" >' + disCPDoc[k].Category_Name + '</span> </td>';
        cpDoc += ' <td> <span id="spnQualification_' + d + '">' + disCPDoc[k].Qualification + '</span> </td>';
        cpDoc += '<td> <div id="dvDelete_' + d + '" class="docProDelete" onclick="fnDelete(this);"></div></td> </tr>';
    }
    cpDoc += ' </tbody>';
    cpDoc += ' </table>';
    $('#dvDoctors').html(cpDoc);

    docRowNum = disCPDoc.length + 1;
    fnCreateDoctorTableNewRow("EDIT");
    autoComplete(autoDoctor_g, "txtDoctorName", "hdnDoctorCode", "autoDoctor");
    $('.autoDoctor').unbind('blur').bind('blur', function () { fnGetCategory(this); });
    $("#dvAllDoctors").overlay().close();
    $("#dvCPMain").unblock();
}
function fnSelectAll() {
    if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
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
function fnGetUserPrivileges(userCode, type) {
    $.ajax({
        type: 'POST',
        url: '/Master/GetPrivilegesByUser',
        data: "UserCode=" + userCode + "",
        success: function (response) {
            if (response != '') {
                userPrivilege_g = response;
                if (type == "LOAD") {
                    PriCampaignPlanner_g = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO").toUpperCase();
                    PriInterPlace_g = fnGetPrivilegeVal("INTERMEDIATE_PLACES", "").toUpperCase().split(',');//EXHQ, HQ, OS
                    PriFareEdit_g = fnGetPrivilegeVal("FARE_FROM_TO_PLACES_EDIT", "").toUpperCase(); //RIGID_PLACE
                    PriCategoryCheck_g = fnGetPrivilegeVal("SFC_CATEGORY_DONT_CHECK", "").toUpperCase().split(','); // CP,TP,DCR
                    if ($.inArray("CP", PriCategoryCheck_g) > -1) { // don check the sfc data with category, if it is mapped with DCR.
                        categoryCheckNeeded = "NO";
                    }
                    else {
                        categoryCheckNeeded = "YES";
                    }
                    if (PriCampaignPlanner_g == "YES" || PriCampaignPlanner_g == "OPTIONAL") {
                        fnGetSFC();
                        fnGetCPDetails();
                        $("#dvRightPanel").show();
                        $("#dvLeftPanel").hide();
                        $("#dvRightPanel").removeClass('col-lg-8');
                        $("#dvRightPanel").addClass('col-lg-12');
                        $("#spnTree").html('Show Tree');
                    }
                    else {
                        fnMsgAlert('info', 'Info', 'Sorry, This user can not have access to campaign planner');
                        $("#dvRightPanel").hide();
                        return;
                    }
                }
            }
            else {
                fnMsgAlert('info', 'Info', 'Sorry, This user can not have access to campaign planner');
                $("#dvRightPanel").hide();
                return;
            }
        },
        error: function (e) {
        }
    });
}
function fnGetPrivilegeVal(privilegeName, defaultValue) {

    if (userPrivilege_g != null && userPrivilege_g != '') {
        if (privilegeName != "") {
            var selectedValue = jsonPath(userPrivilege_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
            if (selectedValue.length > 0) {
                defaultValue = selectedValue[0].PrivilegeValue;
            }
        }
    }
    return defaultValue;
}
function fnValidateCPName() {
    $('#txtCPName').removeClass('errorIndicator');
    $('#txtCPName').removeAttr('title');

    if ($.trim($('#txtCPName').val()) == '') {
        $('#txtCPName').addClass('errorIndicator');
        $('#txtCPName').attr('title', 'Please enter CP Name');
    }
    else {
        if (!fnCheckSpecialCharacter($('#txtCPName'))) {
            $('#txtCPName').addClass('errorIndicator');
            $('#txtCPName').attr('title', 'Please remove the special characters from CP Name');
        }
        else {
            if (jsonCPDetails_g != '') {
                var disJson;
                if ($("#hdnMode").val() != "EDIT") {
                    disJson = jsonPath(jsonCPDetails_g, "$.Tables[0].Rows[?(@.CP_Name.toUpperCase().substring(2)=='" + $.trim($('#txtCPName').val().toUpperCase()) + "')]");
                }
                else {
                    disJson = jsonPath(jsonCPDetails_g, "$.Tables[0].Rows[?(@.CP_Name.toUpperCase().substring(2)=='" + $.trim($('#txtCPName').val().toUpperCase()) + "' && @.CP_Code!= '" + $("#hdnCPCode").val() + "')]");
                }
                if (disJson != false && disJson != undefined) {
                    $('#txtCPName').addClass('errorIndicator');
                    $('#txtCPName').attr('title', 'CP Name already exists. Pleas enter any other CP Name');
                }
                else {
                    $('#txtCPName').removeClass('errorIndicator');
                    $('#txtCPName').removeAttr('title');
                }
            }

        }
    }
}
function fnCheckSpecialCharacter(id) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9 ]+$");
        if (!specialCharregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

function fnGetMappedSFC(disJson) {
    var currentSFCRow = $('#hdnErrorSFCRowNo').val();
    var fromPlace = $('#txtFromPlace_' + currentSFCRow).val();
    var toPlace = $('#txtToPlace_' + currentSFCRow).val();
    var travelMode = $('#txtTravelMode_' + currentSFCRow).val();
    var content = "";
    var routeWay = "D";

    if (fromPlace == disJson[0].To_Region_Name && toPlace == disJson[0].From_Region_Name) {
        routeWay = "R";
    }


    if (disJson != null && disJson != undefined) {
        if (disJson != false) {
            content += "<table class='table table-striped'> <thead><tr><th>Select</th><th>Category Name</th><th>From Place</th>";
            content += "<th>To Place </th><th>Travel Mode</th><th>Distance</th><th>Fare Amount</th> </tr> </thead><tbody>";
            for (var i = 0; i < disJson.length; i++) {
                content += " <tr><td> <input type='radio' name='chkSFCSelect' id='chkSFCSelect_" + i + "' value='"
                    + disJson[i].Distance_Fare_Code + "_" + disJson[i].Distance + "_" + disJson[i].Fare_Amount + "_" + disJson[i].Category_Name + "_" + routeWay + "_" + disJson[i].Travel_Mode + "' /> </td>";
                content += "<td>" + disJson[i].Category_Name + "</td>";
                content += "<td>" + disJson[i].From_Region_Name + "</td>";
                content += "<td>" + disJson[i].To_Region_Name + "</td>";
                content += "<td>" + disJson[i].Travel_Mode + "</td>";
                content += "<td>" + disJson[i].Distance + "</td>";
                content += "<td>" + disJson[i].Fare_Amount + "</td>";
                content += "</tr>";
            }
            content += "</tbody> </table>";
        }
        $('#dvAllSFC').html(content);
        $("#dvSFCPopUp").overlay().load();
    }
}

function fnBindSelectedSFCCode() {
    var currentSFCRow = $('#hdnErrorSFCRowNo').val();
    var distanceFareCode = $('input:radio[name=chkSFCSelect]:checked').val().split('_'); //this.value.split('_');
    $('#hdnDistanceFareCode_' + currentSFCRow).val(distanceFareCode[0]);
    $('#txtDistance_' + currentSFCRow).val(distanceFareCode[1]);
    $('#txtFare_' + currentSFCRow).val(distanceFareCode[2]);
    $('#spnSFCCategory_' + currentSFCRow).html(distanceFareCode[3]);
    $('#hdnRoute_' + currentSFCRow).val(distanceFareCode[4]);
    $('#txtTravelMode_' + currentSFCRow).val(distanceFareCode[5]);
    $('#hdnTravelMode_' + currentSFCRow).val(distanceFareCode[5]);
    $("#txtTravelMode_" + currentSFCRow).removeClass('errorIndicator')
    $("#dvSFCPopUp").overlay().close();
}

//function fnGetMappedSFC(disJson) {
//    
//    var currentSFCRow = $('#hdnErrorSFCRowNo').val();
//    var fromPlace = $('#txtFromPlace_' + currentSFCRow).val();
//    var toPlace = $('#txtToPlace_' + currentSFCRow).val();
//    var travelMode = $('#txtTravelMode_' + currentSFCRow).val();
//    var content = "";
//    if (jsonSFC_g != null && jsonSFC_g != undefined) {
//        var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='" + toPlace
//                                + "' && @.Travel_Mode=='" + travelMode + "')]");
//        if (disJson != false) {
//            content += "<table class='table table-striped'> <thead><tr><th>Select</th><th>Category Name</th><th>From Place</th>";
//            content += "<th>To Place </th><th>Travel Mode</th><th>Distance</th><th>Fare Amount</th> </tr> </thead><tbody>";
//            for (var i = 0; i < disJson.length; i++) {
//                content += " <tr><td> <input type='radio' name='chkSFCSelect' id='chkSFCSelect_" + i + "' value='"
//                    + disJson[i].Distance_Fare_Code + "_" + disJson[i].Distance + "_" + disJson[i].Fare_Amount + "_" + disJson[i].Category_Name + "_D' /> </td>";
//                content += "<td>" + disJson[i].Category_Name + "</td>";
//                content += "<td>" + disJson[i].From_Region_Name + "</td>";
//                content += "<td>" + disJson[i].To_Region_Name + "</td>";
//                content += "<td>" + disJson[i].Travel_Mode + "</td>";
//                content += "<td>" + disJson[i].Distance + "</td>";
//                content += "<td>" + disJson[i].Fare_Amount + "</td>";
//                content += "</tr>";
//            }
//            content += "</tbody> </table>";
//        }
//        else {
//            var disJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='" + toPlace
//                                + "' && @.Travel_Mode=='" + travelMode + "')]");
//            if (disJson != false) {
//                content += "<table class='table table-striped'> <thead><tr><th>Select</th><th>Category Name</th><th>From Place</th>";
//                content += "<th>To Place </th><th>Travel Mode</th> </tr> </thead><tbody>";
//                for (var i = 0; i < disJson.length; i++) {
//                    content += " <tr><td> <input type='radio' name='chkSFCSelect' id='chkSFCSelect_" + i + "' value='"
//                        + disJson[i].Distance_Fare_Code + "_" + disJson[i].Distance + "_" + disJson[i].Fare_Amount + "_" + disJson[i].Category_Name + "_R' /> </td>";
//                    content += "<td>" + disJson[i].Category_Name + "</td>";
//                    content += "<td>" + disJson[i].From_Region_Name + "</td>";
//                    content += "<td>" + disJson[i].To_Region_Name + "</td>";
//                    content += "<td>" + disJson[i].Travel_Mode + "</td>";
//                    content += "<td>" + disJson[i].Distance + "</td>";
//                    content += "<td>" + disJson[i].Fare_Amount + "</td>";
//                    content += "</tr>";
//                }
//                content += "</tbody> </table>";
//            }
//        }
//        $('#dvAllSFC').html(content);
//        $("#dvSFCPopUp").overlay().load();
//    }
//}

//function fnBindSelectedSFCCode() {
//    
//    var currentSFCRow = $('#hdnErrorSFCRowNo').val();
//    var distanceFareCode = $('input:radio[name=chkSFCSelect]:checked').val().split('_'); //this.value.split('_');
//    $('#hdnDistanceFareCode_' + currentSFCRow).val(distanceFareCode[0]);
//    $('#txtDistance_' + currentSFCRow).val(distanceFareCode[1]);
//    $('#txtFare_' + currentSFCRow).val(distanceFareCode[2]);
//    $('#spnSFCCategory_' + currentSFCRow).html(distanceFareCode[3]);
//    $('#hdnRoute_' + currentSFCRow).val(distanceFareCode[4]);
//    $("#dvSFCPopUp").overlay().close();
//}



function fnGetFare(obj) {
    debugger;
    $(obj).removeClass('errorIndicator');
    $(obj).removeAttr('title');
    var objid = $(obj)[0].id;
    var objIdArr = objid.split('_');
    var objName = objIdArr[0];
    var objHdnObjName = objName.replace("txt", "hdn");
    
    var cateName = $("#cboCategory :selected").text().toUpperCase();
    if ($.inArray(cateName, PriInterPlace_g) > -1 && cateName!="HQ") {
        if ((parseInt(cpRowNum) - 1) == parseInt(objIdArr[1])) {
            return;
        }
    }

   
    if (objName.indexOf("TravelMode") > -1) {
        fnValidateAutofill(obj, travelMode_g, objName, objHdnObjName);
    }
    else {
        fnValidateAutofill(obj, autoSFC_g, objName, objHdnObjName);
    }




    var flag = true;
    var id = obj.id;
    // var workArea = $.trim($("#" + id.replace(objName, "txtWorkArea")).val()).toUpperCase();
    var fromPlace = $.trim($("#" + id.replace(objName, "txtFromPlace")).val()).toUpperCase();
    var toPlace = $.trim($("#" + id.replace(objName, "txtToPlace")).val()).toUpperCase();
    var travelMode = $.trim($("#" + id.replace(objName, "txtTravelMode")).val()).toUpperCase();
    var categoryName_s = $("#cboCategory :selected").text().toUpperCase();

    // From Place validation.
    flag = fnFromPlaceValidation(fromPlace, objName, id);

    // To Place Validation.
    flag = fnToPlaceValidation(toPlace, objName, id);

    // Travel Mode
    flag = fnTravelModeValidation(travelMode, objName, id);



    if (objName.indexOf("TravelMode") == -1) {
        //  if ($.trim(fromPlace) != '' && $.trim(toPlace) != '' && $.trim(workArea) != '' && $.trim(travelMode)) {
        if ($.trim(fromPlace) != '' && $.trim(toPlace) != '') {
            $("#" + id.replace(objName, "txtFromPlace")).removeClass('errorIndicator');
            $("#" + id.replace(objName, "txtTravelMode")).removeClass('errorIndicator');
            $(obj).removeClass('errorIndicator');
            if (PriFareEdit_g == "RIGID_PLACE") {
                if (autoSFC_g != '') {
                    var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' || @.To_Region_Name=='" + fromPlace + "')]");
                    if (disJson == false && disJson != undefined) {
                        $("#" + id.replace(objName, "txtFromPlace")).addClass('errorIndicator');
                        $("#" + id.replace(objName, "txtFromPlace")).attr('title', 'Invalid from place');
                    }
                    else {
                        $("#" + id.replace(objName, "txtFromPlace")).removeClass('errorIndicator');
                        $("#" + id.replace(objName, "txtFromPlace")).removeAttr('title');
                    }
                    var disJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + toPlace + "' || @.To_Region_Name=='" + toPlace + "')]");
                    if (disJson == false && disJson != undefined) {
                        $(obj).addClass('errorIndicator');
                        $(obj).attr('title', 'Invalid to place');
                    }
                    else {
                        $(obj).removeClass('errorIndicator');
                        $(obj).removeAttr('title');
                    }

                    $('#hdnErrorSFCRowNo').val(id.split('_')[1]);


                    /***************************************************************************************************************/
                    /* Start: Fill the Travel Mode and Other details(Distance Fare Code, Category etc). */
                    /* SFC Straight Way - means Direct Route.
                    /***************************************************************************************************************/
                    if (categoryCheckNeeded == "YES") { // sfc category check
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                    }
                    else {
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                            + toPlace + "')]");
                    }
                    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                    //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                    if (disRouteJson != false && disRouteJson != undefined) {
                        if (disRouteJson.length > 1) {
                            fnGetMappedSFC(disRouteJson);
                            return;
                        }
                        else {
                            $("#" + id.replace(objName, "hdnRoute")).val('D');
                            $("#" + id.replace(objName, "txtDistance")).val(disRouteJson[0].Distance);
                            $("#" + id.replace(objName, "txtFare")).val(disRouteJson[0].Fare_Amount);
                            $("#" + id.replace(objName, "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace(objName, "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace(objName, "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                            $("#" + id.replace(objName, "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                        }
                    }
                        /***************************************************************************************************************/
                        /* END: Fill the Travel Mode and Other details(Distance Fare Code, Category etc). */
                        /* SFC Straight Way - means Direct Route.
                        /***************************************************************************************************************/
                        /***************************************************************************************************************/
                        /* Start: Fill the Travel Mode and Other details(Distance Fare Code, Category etc). */
                        /* SFC Straight Way - means Return Route.
                        /***************************************************************************************************************/
                    else {
                        if (categoryCheckNeeded == "YES") { // sfc category check
                            var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                                + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                        }
                        else {
                            var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                                + toPlace + "')]");
                        }
                        //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                        //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                        if (disRouteJson != false && disRouteJson != undefined) {
                            if (disRouteJson.length > 1) {
                                fnGetMappedSFC(disRouteJson);
                                return;
                            }
                            else {
                                $("#" + id.replace(objName, "hdnRoute")).val('R');
                                $("#" + id.replace(objName, "txtDistance")).val(disRouteJson[0].Distance);
                                $("#" + id.replace(objName, "txtFare")).val(disRouteJson[0].Fare_Amount);
                                $("#" + id.replace(objName, "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                                $("#" + id.replace(objName, "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                                $("#" + id.replace(objName, "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                                $("#" + id.replace(objName, "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                            }
                        }
                            /***************************************************************************************************************/
                            /* Start: Fill the Travel Mode and Other details(Distance Fare Code, Category etc). */
                            /* No SFC Routes are available in SFC Master ,System reset the above fileds.
                            /***************************************************************************************************************/
                        else {
                            $(obj).addClass('errorIndicator');
                            $(obj).attr('title', 'Invalid sfc');
                            $("#" + id.replace(objName, "txtDistance")).val('0')
                            $("#" + id.replace(objName, "txtFare")).val('0')
                            //  $("#" + id.replace(objName, "txtTravelMode")).val('')
                            $("#" + id.replace(objName, "hdnDistanceFareCode")).val('');
                            $("#" + id.replace(objName, "spnSFCCategory")).html('');
                        }
                    }

                }
            }// End Rigid Place Condition.
            else { // Start - Flexi Place
                $('#hdnErrorSFCRowNo').val(id.split('_')[1]);
                if (categoryCheckNeeded == "YES") { // sfc category check
                    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                        + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                }
                else {
                    var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                        + toPlace + "')]");
                }
                //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                if (disRouteJson != false && disRouteJson != undefined) {
                    if (disRouteJson.length > 1) {
                        fnGetMappedSFC(disRouteJson);
                        return;
                    }
                    else {
                        $("#" + id.replace(objName, "txtDistance")).val(disRouteJson[0].Distance);
                        $("#" + id.replace(objName, "txtFare")).val(disRouteJson[0].Fare_Amount);
                        $("#" + id.replace(objName, "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                        $("#" + id.replace(objName, "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                        $("#" + id.replace(objName, "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                        $("#" + id.replace(objName, "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                        $("#" + id.replace(objName, "hdnRoute")).val('D');
                    }
                }
                else {
                    if (categoryCheckNeeded == "YES") { // sfc category check
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                            + toPlace + "'  && @.Category_Name=='" + categoryName_s + "')]");
                    }
                    else {
                        var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                            + toPlace + "')]");
                    }
                    //var disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.To_Region_Name=='" + fromPlace + "' && @.From_Region_Name=='"
                    //    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                    if (disRouteJson != false && disRouteJson != undefined) {
                        if (disRouteJson.length > 1) {
                            fnGetMappedSFC(disRouteJson);
                            return;
                        }
                        else {
                            $("#" + id.replace(objName, "txtDistance")).val(disRouteJson[0].Distance);
                            $("#" + id.replace(objName, "txtFare")).val(disRouteJson[0].Fare_Amount);
                            $("#" + id.replace(objName, "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace(objName, "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                            $("#" + id.replace(objName, "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                            $("#" + id.replace(objName, "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                            $("#" + id.replace(objName, "hdnRoute")).val('R');
                        }
                    }
                    else {
                        $("#" + id.replace(objName, "hdnDistanceFareCode")).val('');
                    }
                }
            }
        }

    }
    else {
        
        if ($.trim(fromPlace) != '' && $.trim(toPlace) != '' && $.trim(travelMode) != '') {
            $('#hdnErrorSFCRowNo').val(id.split('_')[1]);
            var disRouteJson = "";
            if (categoryCheckNeeded == "YES") { // sfc category check
                disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                    + toPlace + "'  && @.Category_Name=='" + categoryName_s + "' && @.Travel_Mode=='" + travelMode + "')]");
            }
            else {
                disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + fromPlace + "' && @.To_Region_Name=='"
                    + toPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
            }
            if (disRouteJson != null && disRouteJson.length >= 1) {
                $("#" + id.replace(objName, "txtDistance")).val(disRouteJson[0].Distance);
                $("#" + id.replace(objName, "txtFare")).val(disRouteJson[0].Fare_Amount);
                $("#" + id.replace(objName, "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                $("#" + id.replace(objName, "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                $("#" + id.replace(objName, "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                $("#" + id.replace(objName, "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                $("#" + id.replace(objName, "hdnRoute")).val('D');
            }
            else { //swap the place
                if (categoryCheckNeeded == "YES") { // sfc category check
                    disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + toPlace + "' && @.To_Region_Name=='"
                        + fromPlace + "'  && @.Category_Name=='" + categoryName_s + "' && @.Travel_Mode=='" + travelMode + "')]");
                }
                else {
                    disRouteJson = jsonPath(jsonSFC_g, "$.[?(@.From_Region_Name=='" + toPlace + "' && @.To_Region_Name=='"
                        + fromPlace + "' && @.Travel_Mode=='" + travelMode + "')]");
                }
                if (disRouteJson != null && disRouteJson.length >= 1) {
                    $("#" + id.replace(objName, "txtDistance")).val(disRouteJson[0].Distance);
                    $("#" + id.replace(objName, "txtFare")).val(disRouteJson[0].Fare_Amount);
                    $("#" + id.replace(objName, "txtTravelMode")).val(disRouteJson[0].Travel_Mode);
                    $("#" + id.replace(objName, "hdnTravelMode")).val(disRouteJson[0].Travel_Mode);
                    $("#" + id.replace(objName, "hdnDistanceFareCode")).val(disRouteJson[0].Distance_Fare_Code);
                    $("#" + id.replace(objName, "spnSFCCategory")).html(disRouteJson[0].Category_Name);
                    $("#" + id.replace(objName, "hdnRoute")).val('R');
                }
                else {
                    if (PriFareEdit_g == "RIGID_PLACE") {
                        $(obj).addClass('errorIndicator');
                        $(obj).attr('title', 'Invalid sfc');
                    }
                    $("#" + id.replace(objName, "txtDistance")).val('0')
                    $("#" + id.replace(objName, "txtFare")).val('0')
                    //  $("#" + id.replace(objName, "txtTravelMode")).val('')
                    $("#" + id.replace(objName, "hdnDistanceFareCode")).val('');
                    $("#" + id.replace(objName, "spnSFCCategory")).html('');
                }

            }
        }
        else {
            if (PriFareEdit_g == "RIGID_PLACE") {
                $(obj).addClass('errorIndicator');
                $(obj).attr('title', 'Invalid sfc');
            }
            $("#" + id.replace(objName, "txtDistance")).val('0')
            $("#" + id.replace(objName, "txtFare")).val('0')
            //  $("#" + id.replace(objName, "txtTravelMode")).val('')
            $("#" + id.replace(objName, "hdnDistanceFareCode")).val('');
            $("#" + id.replace(objName, "spnSFCCategory")).html('');
        }
    }
}



function fnFromPlaceValidation(fromPlace, objName, id) {
    if (fromPlace == "") {
        $("#" + id.replace(objName, "txtFromPlace")).addClass('errorIndicator');
        $("#" + id.replace(objName, "txtFromPlace")).attr('title', 'Please select from place');
        return false;
        //flag = false;
    }
    else {
        if ($.trim(fromPlace) != '' && ($.trim($("#" + id.replace(objName, "hdnFromPlace")).val()) == '' ||
       $("#" + id.replace(objName, "hdnFromPlace")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
            $("#" + id.replace(objName, "txtFromPlace")).addClass('errorIndicator');
            $("#" + id.replace(objName, "txtFromPlace")).attr('title', 'Please select from place');
            return false;
        }
        else {
            $("#" + id.replace(objName, "txtFromPlace")).removeClass('errorIndicator');
            $("#" + id.replace(objName, "txtFromPlace")).removeAttr('title');
            return true;
        }
    }
}

function fnToPlaceValidation(toPlace, objName, id) {
    if (toPlace == "") {
        $("#" + id.replace(objName, "txtToPlace")).addClass('errorIndicator');
        $("#" + id.replace(objName, "txtToPlace")).attr('title', 'Please select To place');
        $("#" + id.replace(objName, "txtDistance")).val('0')
        $("#" + id.replace(objName, "txtFare")).val('0')
        $("#" + id.replace(objName, "hdnDistanceFareCode")).val('');
        $("#" + id.replace(objName, "spnSFCCategory")).html('');
        return false;
    }
    else {
        if ($.trim(toPlace) != '' && ($.trim($("#" + id.replace(objName, "hdnToPlace")).val()) == '' ||
       $("#" + id.replace(objName, "hdnToPlace")).val() == undefined) && PriFareEdit_g == "RIGID_PLACE") {
            $("#" + id.replace(objName, "txtToPlace")).addClass('errorIndicator');
            $("#" + id.replace(objName, "txtToPlace")).attr('title', 'Please select To place');
            $("#" + id.replace(objName, "txtDistance")).val('0')
            $("#" + id.replace(objName, "txtFare")).val('0')
            $("#" + id.replace(objName, "hdnDistanceFareCode")).val('');
            $("#" + id.replace(objName, "spnSFCCategory")).html('');
            return false;
        }
        else {
            $("#" + id.replace(objName, "txtToPlace")).removeClass('errorIndicator');
            $("#" + id.replace(objName, "txtToPlace")).removeAttr('title', 'Please select To place');
            return true;
        }
    }
}

function fnTravelModeValidation(travelMode, objName, id) {
    if ($.trim(travelMode) != '' && ($.trim($("#" + id.replace(objName, "hdnTravelMode")).val()) == '' ||
      $("#" + id.replace(objName, "hdnTravelMode")).val() == undefined)) {
        $("#" + id.replace(objName, "txtTravelMode")).addClass('errorIndicator');
        $("#" + id.replace(objName, "txtTravelMode")).attr('title', 'Please select travel mode');
        return false;
    }
    else {
        $("#" + id.replace(objName, "txtTravelMode")).removeClass('errorIndicator');
        $("#" + id.replace(objName, "txtTravelMode")).removeAttr('title');
        return true;
    }
}