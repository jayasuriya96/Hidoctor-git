


function fnGetDailyCallPlannerCreate() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DailyCallPlanner/GetDailyCallPlanner',
        data: "dcrDate=" + $("#hdnDCRDateCreate").val(),
        success: function (jsData) {
            if (jsData != '') {
                var dailyPlan = eval('(' + jsData + ')');
                //dailyPlan.Tables[0].Rows.length

                var tblCont = "";
                if (!(dailyPlan.Tables === undefined) && dailyPlan.Tables.length > 0 && dailyPlan.Tables[0].Rows.length > 0) {
                    tblCont += "<table cellspacing='0' cellpadding='0' id='tblDailyPlannerHeaderCreate' class='data display dataTable box' width='100%'>";
                    tblCont += "<thead>";
                    tblCont += "<tr>";
                    tblCont += "<th>Employee Name : " + dailyPlan.Tables[0].Rows[0]["Employee_Name"] + "</th>";
                    tblCont += "<th>Category : " + dailyPlan.Tables[0].Rows[0]["Category"] + "</th>";
                    tblCont += "<th>CP Name : " + dailyPlan.Tables[0].Rows[0]["CP_Name"] + "</th>";
                    tblCont += "<th>Distance : " + dailyPlan.Tables[0].Rows[0]["Distance"] + "</th>";
                    tblCont += "</tr>";
                    tblCont += "<tr>";
                    tblCont += "<th>Working with :" + dailyPlan.Tables[0].Rows[0]["Accomp_Name"] + "</th>";
                    tblCont += "<th>Contact point :" + dailyPlan.Tables[0].Rows[0]["Meeting_Point"] + "</th>";
                    tblCont += "<th>Time :" + dailyPlan.Tables[0].Rows[0]["Meeting_Time"] + "</th>";
                    tblCont += "<th></th>";
                    tblCont += "</tr></thead>";
                    tblCont += "</table>";
                    $("#divDailyCallHeaderCreate").html(tblCont);                   
                    return;
                }
                else {
                    var dateFormate = $("#hdnDCRDateCreate").val().split('-')[2] + '/' + $("#hdnDCRDateCreate").val().split('-')[1] + '/' + $("#hdnDCRDateCreate").val().split('-')[0];
                    tblCont = "<div><h3 style='width: 100%;margin:0px auto;padding-top: 20px;'>No TP for " + dateFormate + "</h3></div>";
                    $("#divDailyCallHeaderCreate").html(tblCont);
                    return;
                }
            }
            else {
                var tblCont = "";
                tblCont = "<div><h3 style='width: 100%;margin:0px auto;padding-top: 20px;'>No TP for " + dateFormate + "</h3></div>";
                $("#divDailyCallHeaderCreate").html(tblCont);
                return;
            }
        }
    });
}

function fnGetDailyCallPlannerDoctorDetailsCreate(financeYear) {
    
    $("#hdnYTDCreate").val(financeYear);
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DailyCallPlanner/GetDailyCallPlannerDoctorDetails',
        data: "dcrDate=" + $("#hdnDCRDateCreate").val() + "&YTDType=" + financeYear,
        success: function (jsData) {

            if (jsData != '') {

                var dailyDoc = eval('(' + jsData + ')');

                var content = "";
                if (!(dailyDoc.Tables === undefined) && dailyDoc.Tables.length > 0 && dailyDoc.Tables[0].Rows.length > 0) {
                    content = "<table cellspacing='0' cellpadding='0' width='100%' class='data display datatable' id='tblDoctorDetailsCreate'>";
                    content += "<thead><tr>";
                    content += "<th rowspan='2'>MDL/SVL</th>";
                    content += "<th rowspan='2'>Doctor Name</th>";
                    content += "<th rowspan='2'>Speciality</th>";
                    content += "<th rowspan='2'>Category</th>";
                    content += "<th rowspan='2'>Last Visited Date</th>";
                    content += "<th colspan='2'>Brands prescribed</th>";
                    content += "<th rowspan='2'>Focus brands</th>";
                    content += "<th rowspan='2'>Inputs / Samples given in last month</th>";
                    content += "<th rowspan='2'>Non Samples given in last month</th>";
                    content += "<th rowspan='2'>Non Samples given till Date(YTD)</th>";
                    content += "</tr>";
                    content += "<tr>";
                    content += "<th>Our</th>";
                    content += "<th>Other</th>";
                    content += "</tr>";
                    content += "</thead><tbody>";

                    for (var i = 0; i < dailyDoc.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + dailyDoc.Tables[0].Rows[i]["MDL_Number"] + "</td>";
                        content += "<td>" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "</td>";
                        content += "<td>" + dailyDoc.Tables[0].Rows[i]["Speciality_Name"] + "</td>";
                        content += "<td>" + dailyDoc.Tables[0].Rows[i]["Category_Name"] + "</td>";

                        // Last Visited Date
                        var lstJson = jsonPath(dailyDoc.Tables[6], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (lstJson != false) {
                            content += "<td>" + lstJson[0]["Last_Visited"] + "</td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        //Our and other brand count
                        var brandJson = jsonPath(dailyDoc.Tables[5], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (brandJson != false) {
                            content += "<td><a id='our_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "'  onclick='fnGetOurBrandProductsCreate(this)'>" + brandJson[0]["Our_Count"] + "</a></td>";
                            content += "<td><a id='Comp_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "'  onclick='fnGetCompBrandProductsCreate(this)'>" + brandJson[0]["Comp_Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                            content += "<td></td>";
                        }


                        // from doctor product mapping
                        var focusJson = jsonPath(dailyDoc.Tables[1], "$.Rows[?(@.Customer_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (focusJson != false) {
                            content += "<td><a id='doc_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "' onclick='fnDoctorProductPopUpCreate(this)'>" + focusJson[0]["Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        //Inputs / Samples given in last month(Count)
                        var samJson = jsonPath(dailyDoc.Tables[2], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (samJson != false) {
                            content += "<td><a id='samp_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "' onclick='fnGetGivenProductsCreate(this)'>" + samJson[0]["Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        //Non Samples given in last month(Count)
                        var nonsamJson = jsonPath(dailyDoc.Tables[3], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (nonsamJson != false) {
                            content += "<td><a id='nonsamp_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "'  onclick='fnGetGivenProductsCreate(this)'>" + nonsamJson[0]["Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        //Non Samples given ytd
                        var nonsamYTDJson = jsonPath(dailyDoc.Tables[4], "$.Rows[?(@.Doctor_Code=='" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "')]");
                        if (nonsamYTDJson != false) {
                            content += "<td><a id='nonsampYTD_" + dailyDoc.Tables[0].Rows[i]["Customer_Code"] + "_" + dailyDoc.Tables[0].Rows[i]["Customer_Name"] + "' onclick='fnGetNonSampleGivenYTDCreate(this)'>" + nonsamYTDJson[0]["Count"] + "</a></td>";
                        }
                        else {
                            content += "<td></td>";
                        }

                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#divDailyCallDetailCreate").html(content);
                    $('#tblDoctorDetailsCreate').dataTable({
                        //"bPaginate": false, 
                        "sPaginationType": "full_numbers",
                        "bFilter": true,
                        "bSearchable": true,
                        "bSort": false, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                    $("#dvShowDocDetailCreate").css('display', '');
                    return;
                }
            }
        }
    });
}


function fnDoctorProductPopUpCreate(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DailyCallPlanner/GetDoctorProductMappingDetail',
        data: "customerCode=" + (id.id).split('_')[1],
        success: function (jsData) {
            if (jsData != "") {
                var docProd = eval('(' + jsData + ')');
                if (!(docProd.Tables === undefined) && docProd.Tables.length > 0 && docProd.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 99.5%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='100%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Product Type</th>";
                    content += "<th>Yield</th>";
                    content += "<th>Potential</th>";
                    content += "</tr></thead><tbody>";
                    for (var i = 0; i < docProd.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + docProd.Tables[0].Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + docProd.Tables[0].Rows[i]["Product_Type_Name"] + "</td>";
                        content += "<td>" + docProd.Tables[0].Rows[i]["Support_Quantity"] + "</td>";
                        content += "<td>" + docProd.Tables[0].Rows[i]["Potential_Quantity"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopupCreate").html(content);
                    ShowModalPopup('dvDailyPopupCreate');
                }
            }
        }
    });
}

function fnGetGivenProductsCreate(id) {
    var type = "";
    if ((id.id).split('_')[0] == "samp") { type = "SAMPLE"; }
    else { type = "NONSAMPLE"; }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DailyCallPlanner/GetProductGivenInLastMonth',
        data: "customerCode=" + (id.id).split('_')[1] + "&type=" + type + "&dcrDate=" + $("#hdnDCRDateCreate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Tables === undefined) && product.Tables.length > 0 && product.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 99.5%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='100%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Given Date</th>";
                    content += "<th>Quantity given</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Tables[0].Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["DCR_Actual_Date"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["Quantity_Provided"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopupCreate").html(content);
                    ShowModalPopup('dvDailyPopupCreate');
                }
            }
        }
    });
}

function fnGetNonSampleGivenYTDCreate(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DailyCallPlanner/GetNonSampleGivenYTD',
        data: "customerCode=" + (id.id).split('_')[1] + "&YTDType=" + $("#hdnYTDCreate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Tables === undefined) && product.Tables.length > 0 && product.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 99.5%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='100%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Given Date</th>";
                    content += "<th>Quantity given</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Tables[0].Rows[i]["Product_Name"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["DCR_Actual_Date"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["Quantity_Provided"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopupCreate").html(content);
                    ShowModalPopup('dvDailyPopupCreate');
                }
            }
        }
    });
}


function fnGetOurBrandProductsCreate(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DailyCallPlanner/GetOurBrandProducts',
        data: "customerCode=" + (id.id).split('_')[1] + "&dcrDate=" + $("#hdnDCRDateCreate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Tables === undefined) && product.Tables.length > 0 && product.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 99.5%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='100%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Tables[0].Rows[i]["Product_Name"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopupCreate").html(content);
                    ShowModalPopup('dvDailyPopupCreate');
                }
            }
        }
    });
}

function fnGetCompBrandProductsCreate(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DailyCallPlanner/GetCompetitorBrandProducts',
        data: "customerCode=" + (id.id).split('_')[1] + "&dcrDate=" + $("#hdnDCRDateCreate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var product = eval('(' + jsData + ')');
                if (!(product.Tables === undefined) && product.Tables.length > 0 && product.Tables[0].Rows.length > 0) {
                    var content = "";
                    content = "<div ><h3 style='width: 99.5%;margin:0px auto'>Doctor Name : " + (id.id).split('_')[2] + "</h3></div>";
                    content += "<table cellspacing='0' cellpadding='0' id='tblActivity' width='100%'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th>Product Name</th>";
                    content += "<th>Competitor Product Name</th>";
                    content += "</tr></thead><tbody>";

                    for (var i = 0; i < product.Tables[0].Rows.length; i++) {
                        content += "<tr>";
                        content += "<td>" + product.Tables[0].Rows[i]["Own_Product_Name"] + "</td>";
                        content += "<td>" + product.Tables[0].Rows[i]["Competitor_Product_Name"] + "</td>";
                        content += "</tr>";
                    }
                    content += "</tbody></table>";
                    $("#dvSubDailyPopupCreate").html(content);
                    ShowModalPopup('dvDailyPopupCreate');
                }
            }
        }
    });
}

function fnLoadLeaveDeatilsCreate() {
    var tblCont = "";
    var dateFormate = $("#hdnDCRDateCreate").val().split('-')[2] + '/' + $("#hdnDCRDateCreate").val().split('-')[1] + '/' + $("#hdnDCRDateCreate").val().split('-')[0];
    tblCont = "<div ><h3 style='width: 100%;margin:0px auto;padding-top: 20px;'>You have planned leave on " + dateFormate + "</h3></div>";
    $("#divDailyCallHeaderCreate").html(tblCont);
    return;
    // $("#divDailyCallHeader").html("<span>You have planned leave on " + $("#hdnDCRDate").val() + "</span>");
}

function fnLoadHolidayDetailCreate() {
    var tblCont = "";
    var dateFormate = $("#hdnDCRDateCreate").val().split('-')[2] + '/' + $("#hdnDCRDateCreate").val().split('-')[1] + '/' + $("#hdnDCRDateCreate").val().split('-')[0];
    tblCont = "<div ><h3 style='width: 100%;margin:0px auto;padding-top: 20px;'>" + dateFormate + " is Holiday for you</h3></div>";
    $("#divDailyCallHeaderCreate").html(tblCont);
    return;
    //$("#divDailyCallHeader").html("<span>" + $("#hdnDCRDate").val() + " is Holiday for you</span>");
}

function fnLoadAttendanceCreate() {
    var tblCont = "";

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DailyCallPlanner/GetAttendanceDetail',
        data: "dcrDate=" + $("#hdnDCRDateCreate").val(),
        success: function (jsData) {
            if (jsData != "") {
                var attn = eval('(' + jsData + ')');
                if (!(attn.Tables === undefined) && attn.Tables.length > 0 && attn.Tables[0].Rows.length > 0) {
                    var dateFormate = $("#hdnDCRDateCreate").val().split('-')[2] + '/' + $("#hdnDCRDateCreate").val().split('-')[1] + '/' + $("#hdnDCRDateCreate").val().split('-')[0];
                    tblCont = "<div ><h3 style='width: 100%;margin:0px auto;padding-top: 20px;'>You have attendance on " + dateFormate + ".(" + attn.Tables[0].Rows[0]["Activity_Name"] + ")</h3></div>";
                    $("#divDailyCallHeaderCreate").html(tblCont);
                    return;
                }
            }
        }
    });

}

